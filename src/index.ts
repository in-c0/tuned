import { Hono } from "hono";
import { resolveLink } from "./meta";
import { publicPage, studioPage, landingPage, rssFeed, sharePage, setupPage, BRAND, CATEGORIES, type Creator, type Item, type ShareState } from "./pages";
import { termsPage, privacyPage } from "./legal";
import { dashboardPage, loginPage, type FeedBundle } from "./dashboard";
import { deskPage, type DeskItem, type AgentStats } from "./desk";
import { currentMember, grantSession, clearSession, newToken as newSessionToken, SESSION_COOKIE, type Member } from "./auth";
import { authorizeUrl, exchangeCode, syncConnection, SpotifyError, type Connection } from "./spotify";
import { count, countBy, countEach, memberActive, isBot, snapshot } from "./metrics";
import { BUILD_COMMIT } from "./build-info";
import { keyMatches, keyConfigured } from "./keys";
import { RESERVED_HANDLES } from "./handles";
import operator from "./operator";
import { getCookie, setCookie } from "hono/cookie";
import type { Context } from "hono";

export type Bindings = {
  DB: D1Database;
  ADMIN_KEY: string;
  METRICS_KEY: string;
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  /** Operator control plane (src/operator.ts). Absent in production until the owner
   *  installs it, and every operator route fails closed with 503 while it is. */
  AGENT_OPERATOR_KEY: string;
  /** Public var, not a secret: the human handle whose member owns operator-managed agents. */
  AGENT_OPERATOR_OWNER: string;
};
const app = new Hono<{ Bindings: Bindings }>();

// Agent operator control plane — one owner-scoped credential, bounded authority, and
// fail-closed (503) while AGENT_OPERATOR_KEY is unset. See src/operator.ts.
app.route("/api/operator", operator);

/** Fire-and-forget telemetry: never blocks the response, never fails a request. */
function track(c: Context, work: Promise<unknown>): void {
  const swallowed = work.catch(() => {});
  try {
    c.executionCtx.waitUntil(swallowed);
  } catch {
    // no execution context (e.g. tests) — the promise still runs
  }
}

function newToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function creatorByToken(db: D1Database, token: string): Promise<Creator | null> {
  return await db.prepare("SELECT * FROM creators WHERE token = ?").bind(token).first<Creator>();
}

async function itemsFor(db: D1Database, creatorId: number, publicOnly: boolean): Promise<Item[]> {
  const sql = publicOnly
    ? "SELECT i.*, v.handle AS via_handle FROM items i LEFT JOIN creators v ON v.id = i.via_creator_id WHERE i.creator_id = ? AND i.visibility = 'public' ORDER BY i.created_at DESC LIMIT 300"
    : "SELECT i.*, v.handle AS via_handle FROM items i LEFT JOIN creators v ON v.id = i.via_creator_id WHERE i.creator_id = ? ORDER BY i.created_at DESC LIMIT 300";
  const { results } = await db.prepare(sql).bind(creatorId).all<Item>();
  return results;
}

// ---------- landing ----------
app.get("/", async (c) => {
  track(c, count(c.env.DB, isBot(c.req.header("user-agent") ?? "") ? "landing_view_bot" : "landing_view"));
  const { results } = await c.env.DB.prepare("SELECT id, handle, name, bio, avatar_url, accent, kind, created_at FROM creators ORDER BY created_at").all<Creator>();
  // The demo is the feed with the most recently published item, not the oldest creator.
  //
  // It used to be `results[0]` — first by created_at — which is a fact about when the feed
  // was registered and says nothing about whether there is anything current on it. On
  // 2026-08-13 that happened to select the freshest feed anyway (EXP-005), purely because
  // the oldest creator was also the last one to publish; the moment any other feed posts,
  // the same code starts showing a visitor the stalest thing Tuned has. Ordering by content
  // is what the block is actually for.
  const demoCreator =
    (await c.env.DB
      .prepare(
        `SELECT cr.id, cr.handle, cr.name, cr.bio, cr.avatar_url, cr.accent, cr.kind, cr.created_at
         FROM creators cr JOIN items i ON i.creator_id = cr.id AND i.visibility = 'public'
         GROUP BY cr.id ORDER BY MAX(i.created_at) DESC LIMIT 1`
      )
      .first<Creator>()) ?? results[0];
  let demo: { creator: Creator; items: Item[] } | undefined;
  if (demoCreator) {
    const { results: items } = await c.env.DB
      .prepare("SELECT * FROM items WHERE creator_id = ? AND visibility = 'public' ORDER BY created_at DESC LIMIT 3")
      .bind(demoCreator.id)
      .all<Item>();
    demo = { creator: demoCreator, items };
  }
  return c.html(landingPage(results, demo));
});

app.post("/waitlist", async (c) => {
  const { email, role, note } = await c.req.json<{ email?: string; role?: string; note?: string }>();
  // A rejected submit is someone who tried to join and did not. It has been invisible:
  // `application_submit` only counts the ones that worked, so a broken validator and an
  // empty funnel look identical in the snapshot.
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) {
    track(c, count(c.env.DB, "application_invalid"));
    return c.json({ error: "invalid email" }, 400);
  }
  const safeRole = ["fan", "creator", "agent", "both"].includes(role ?? "") ? role : "fan";
  await c.env.DB.prepare("INSERT OR IGNORE INTO waitlist (email, role, note) VALUES (?, ?, ?)")
    .bind(email.toLowerCase(), safeRole, (note ?? "").slice(0, 280))
    .run();
  track(c, count(c.env.DB, "application_submit"));
  return c.json({ ok: true });
});

// ---------- funnel pulse ----------
//
// Between `landing_view` and `application_submit` there is nothing at all, and the gap has
// been answering **0 applications** for nine days against 56–113 UA-flagged human-shaped
// landing views a day. Three unrelated explanations produce that identical zero:
//
//   1. the traffic is not human (the UA heuristic over-counts, and nobody real is arriving);
//   2. real people arrive, read the page, and the offer does not move them;
//   3. people want in and the form loses them before it is submitted.
//
// No counter on either side of the gap can tell those apart, so nothing anyone changes on
// this page is measurable. These two counters — plus `application_invalid` below — separate
// them. See EXP-007 in ops/EXPERIMENTS.md for the pre-registered reading.
//
// Deliberately bounded: an allowlist of exactly two names, no request body, no response
// body, no cookie, no identifier of any kind, no per-visitor state. Same-origin only, which
// stops casual inflation but is forgeable by anyone willing to set one header — these are
// page-reported counters, and the snapshot's own note says so rather than implying proof.
// Nothing here changes what the privacy policy already describes: no new data category is
// collected and nothing is stored in the visitor's browser.
const PULSE_COUNTERS = new Set(["landing_engage", "application_start"]);
app.post("/api/pulse/:name", (c) => {
  const name = c.req.param("name");
  if (!PULSE_COUNTERS.has(name)) return c.body(null, 404);
  // Browsers send Origin on every same-origin POST; curl and friends send none.
  if (c.req.header("origin") !== new URL(c.req.url).origin) return c.body(null, 403);
  track(c, count(c.env.DB, isBot(c.req.header("user-agent") ?? "") ? `${name}_bot` : name));
  return c.body(null, 204);
});

app.get("/terms", (c) => c.html(termsPage()));
app.get("/privacy", (c) => c.html(privacyPage()));

// Which commit this Worker was built from. Deployment is asynchronous, so post-deploy
// verification otherwise has to guess whether it is looking at the new version or the
// old one; this lets it check. Deliberately the whole payload: the commit SHA of a
// public repository is not a secret, and nothing else belongs on an unauthenticated
// route. Never gate this on a key — a verifier that needs a secret to establish
// freshness cannot run before the secret exists.
app.get("/api/version", (c) =>
  c.json({ commit: BUILD_COMMIT }, 200, { "cache-control": "no-store" })
);

// Aggregate funnel counts for the operating loop. Key-gated and fails closed, so it is
// not a public surface; returns counts only — no emails, ids, URLs or item content. Counter
// names carry public labels (a feed handle, a campaign tag) and nothing per-visitor; see the
// docstring on `snapshot`, which this line used to contradict.
app.get("/api/metrics", async (c) => {
  const key = c.req.header("x-metrics-key") ?? "";
  if (!keyConfigured(c.env.METRICS_KEY)) return c.json({ error: "metrics key not configured" }, 503);
  if (!(await keyMatches(key, c.env.METRICS_KEY))) return c.json({ error: "unauthorized" }, 401);
  return c.json(await snapshot(c.env.DB), 200, { "cache-control": "no-store" });
});

// ---------- member auth + dashboard ----------

// admin: provision a member and (optionally) attach existing creator handles to them
app.post("/api/members", async (c) => {
  const key = c.req.header("x-admin-key") ?? "";
  if (!(await keyMatches(key, c.env.ADMIN_KEY))) return c.json({ error: "unauthorized" }, 401);
  const b = await c.req.json<{ email?: string; name?: string; handles?: string[] }>();
  const email = (b.email ?? "").toLowerCase().trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return c.json({ error: "invalid email" }, 400);
  const session = newSessionToken();
  let member = await c.env.DB.prepare("SELECT * FROM members WHERE email = ?").bind(email).first<Member>();
  if (member) {
    await c.env.DB.prepare("UPDATE members SET session_token = ? WHERE id = ?").bind(session, member.id).run();
  } else {
    const res = await c.env.DB.prepare("INSERT INTO members (email, name, session_token) VALUES (?, ?, ?) RETURNING *")
      .bind(email, b.name ?? "", session).first<Member>();
    member = res!;
  }
  // attach creators by handle to this member
  for (const h of b.handles ?? []) {
    await c.env.DB.prepare("UPDATE creators SET member_id = ? WHERE handle = ?").bind(member.id, h.toLowerCase()).run();
  }
  const origin = new URL(c.req.url).origin;
  return c.json({ email, login_url: `${origin}/enter/${session}`, dashboard: `${origin}/home` }, 201);
});

app.get("/enter/:token", async (c) => {
  const member = await c.env.DB.prepare("SELECT * FROM members WHERE session_token = ?").bind(c.req.param("token")).first<Member>();
  if (!member) return c.html(loginPage("That sign-in link isn't valid anymore. Ask us for a fresh one."), 404);
  grantSession(c, member.session_token);
  track(c, count(c.env.DB, "member_login"));
  return c.redirect("/today");
});

app.get("/login", async (c) => {
  if (await currentMember(c)) return c.redirect("/today");
  return c.html(loginPage());
});

app.get("/logout", (c) => {
  clearSession(c);
  return c.redirect("/");
});

// ---------- Spotify ingestion ----------

app.get("/connect/spotify", async (c) => {
  const member = await currentMember(c);
  if (!member) return c.redirect("/login");
  if (!c.env.SPOTIFY_CLIENT_ID) return c.text("Spotify isn't configured yet.", 503);
  const state = newSessionToken(12);
  setCookie(c, "sp_state", state, { httpOnly: true, secure: true, sameSite: "Lax", path: "/", maxAge: 600 });
  const redirectUri = `${new URL(c.req.url).origin}/connect/spotify/callback`;
  return c.redirect(authorizeUrl(c.env.SPOTIFY_CLIENT_ID, redirectUri, state));
});

app.get("/connect/spotify/callback", async (c) => {
  const member = await currentMember(c);
  if (!member) return c.redirect("/login");
  const { code, state, error } = c.req.query();
  if (error) return c.redirect("/home?spotify=denied");
  if (!code || !state || state !== getCookie(c, "sp_state")) return c.redirect("/home?spotify=badstate");

  // the connection publishes into this member's own human feed
  const feed = await c.env.DB
    .prepare("SELECT id FROM creators WHERE member_id = ? AND kind = 'human' ORDER BY created_at LIMIT 1")
    .bind(member.id)
    .first<{ id: number }>();
  if (!feed) return c.redirect("/home?spotify=nofeed");

  try {
    const redirectUri = `${new URL(c.req.url).origin}/connect/spotify/callback`;
    const t = await exchangeCode(c.env.SPOTIFY_CLIENT_ID, c.env.SPOTIFY_CLIENT_SECRET, code, redirectUri);
    const expires = new Date(Date.now() + t.expires_in * 1000).toISOString();
    await c.env.DB.prepare(
      `INSERT INTO connections (member_id, creator_id, provider, access_token, refresh_token, expires_at)
       VALUES (?, ?, 'spotify', ?, ?, ?)
       ON CONFLICT(member_id, provider) DO UPDATE SET
         access_token = excluded.access_token, refresh_token = excluded.refresh_token,
         expires_at = excluded.expires_at, creator_id = excluded.creator_id`
    )
      .bind(member.id, feed.id, t.access_token, t.refresh_token ?? "", expires)
      .run();
    return c.redirect("/home?spotify=connected");
  } catch (err) {
    console.log(JSON.stringify({ level: "error", message: "spotify connect failed", detail: String(err) }));
    return c.redirect("/home?spotify=failed");
  }
});

app.post("/connect/spotify/sync", async (c) => {
  const member = await currentMember(c);
  if (!member) return c.json({ error: "unauthorized" }, 401);
  const conn = await c.env.DB.prepare("SELECT * FROM connections WHERE member_id = ? AND provider = 'spotify'").bind(member.id).first<Connection>();
  if (!conn) return c.json({ error: "not connected" }, 404);
  try {
    const r = await syncConnection(c.env.DB, c.env.SPOTIFY_CLIENT_ID, c.env.SPOTIFY_CLIENT_SECRET, conn);
    return c.json({ ok: true, ...r });
  } catch (err) {
    return c.json({ error: String(err) }, 502);
  }
});

app.post("/connect/spotify/auto", async (c) => {
  const member = await currentMember(c);
  if (!member) return c.json({ error: "unauthorized" }, 401);
  const { on } = await c.req.json<{ on?: boolean }>();
  await c.env.DB.prepare("UPDATE connections SET auto_publish = ? WHERE member_id = ? AND provider = 'spotify'")
    .bind(on ? 1 : 0, member.id)
    .run();
  return c.json({ ok: true });
});

app.post("/connect/spotify/disconnect", async (c) => {
  const member = await currentMember(c);
  if (!member) return c.json({ error: "unauthorized" }, 401);
  await c.env.DB.prepare("DELETE FROM connections WHERE member_id = ? AND provider = 'spotify'").bind(member.id).run();
  return c.json({ ok: true });
});

// approve a queued item into the public feed (session-authed, member must own the feed)
app.post("/queue/:id/:action", async (c) => {
  const member = await currentMember(c);
  if (!member) return c.json({ error: "unauthorized" }, 401);
  const id = Number(c.req.param("id"));
  const action = c.req.param("action");
  const owns = await c.env.DB
    .prepare("SELECT i.id FROM items i JOIN creators cr ON cr.id = i.creator_id WHERE i.id = ? AND cr.member_id = ?")
    .bind(id, member.id)
    .first();
  if (!owns) return c.json({ error: "not found" }, 404);
  if (action === "approve") {
    await c.env.DB.prepare("UPDATE items SET visibility = 'public', created_at = created_at WHERE id = ?").bind(id).run();
  } else if (action === "dismiss") {
    await c.env.DB.prepare("DELETE FROM items WHERE id = ?").bind(id).run();
  } else {
    return c.json({ error: "bad action" }, 400);
  }
  return c.json({ ok: true });
});

// ---------- Morning Desk ----------

app.get("/today", async (c) => {
  const member = await currentMember(c);
  if (!member) return c.redirect("/login");
  const db = c.env.DB;
  track(c, Promise.all([count(db, "desk_view"), memberActive(db, member.id, "desk")]));

  // followed feeds; auto-follow your own agents on first visit so the desk is never empty
  await db.prepare(
    "INSERT OR IGNORE INTO follows (member_id, creator_id) SELECT ?, id FROM creators WHERE member_id = ? AND kind = 'agent'"
  ).bind(member.id, member.id).run();

  const { results: followed } = await db.prepare(
    "SELECT cr.* FROM creators cr JOIN follows f ON f.creator_id = cr.id WHERE f.member_id = ? ORDER BY cr.created_at"
  ).bind(member.id).all<Creator>();

  const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString();
  const groups: Array<{ stats: AgentStats; items: DeskItem[] }> = [];
  const seenUrls = new Map<string, DeskItem>();
  let newCount = 0;

  for (const cr of followed) {
    const { results: items } = await db.prepare(
      `SELECT i.*, cr.handle, cr.name AS agent_name, cr.kind AS agent_kind, r.action AS read_action
       FROM items i JOIN creators cr ON cr.id = i.creator_id
       LEFT JOIN reads r ON r.item_id = i.id AND r.member_id = ?
       WHERE i.creator_id = ? AND i.visibility = 'public' AND i.created_at > ?
       ORDER BY i.created_at DESC LIMIT 40`
    ).bind(member.id, cr.id, weekAgo).all<DeskItem>();

    const kept: DeskItem[] = [];
    for (const it of items) {
      it.also = [];
      const dup = seenUrls.get(it.url);
      if (dup) { dup.also.push(cr.handle); continue; } // cross-agent dedup
      seenUrls.set(it.url, it);
      if (!it.read_action) newCount++;
      kept.push(it);
    }
    const st = await db.prepare(
      `SELECT
        (SELECT COUNT(*) FROM items WHERE creator_id = ?1 AND created_at > ?2 AND visibility='public') AS found7d,
        (SELECT COUNT(*) FROM reads r JOIN items i ON i.id = r.item_id WHERE i.creator_id = ?1 AND r.member_id = ?3 AND r.action='star' AND r.created_at > ?2) AS starred7d,
        (SELECT COUNT(*) FROM reads r JOIN items i ON i.id = r.item_id WHERE i.creator_id = ?1 AND r.member_id = ?3 AND r.action='skip' AND r.created_at > ?2) AS skipped7d`
    ).bind(cr.id, weekAgo, member.id).first<{ found7d: number; starred7d: number; skipped7d: number }>();
    groups.push({ stats: { creator: cr, found7d: st?.found7d ?? 0, starred7d: st?.starred7d ?? 0, skipped7d: st?.skipped7d ?? 0 }, items: kept });
  }

  // 7-day triage streak (any read action that day, member-local ≈ UTC for now)
  const { results: days } = await db.prepare(
    "SELECT DISTINCT substr(created_at, 1, 10) AS d FROM reads WHERE member_id = ? AND created_at > ?"
  ).bind(member.id, weekAgo).all<{ d: string }>();
  const daySet = new Set(days.map((x) => x.d));
  const streak: boolean[] = [];
  for (let i = 6; i >= 0; i--) streak.push(daySet.has(new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10)));

  await db.prepare("UPDATE members SET last_desk_at = ? WHERE id = ?").bind(new Date().toISOString(), member.id).run();
  const own = await db.prepare("SELECT handle FROM creators WHERE member_id = ? AND kind = 'human' ORDER BY created_at LIMIT 1")
    .bind(member.id).first<{ handle: string }>();
  return c.html(deskPage(member, groups, streak, newCount, own?.handle ?? null));
});

// triage: star (republish to own feed with provenance) or skip
app.post("/read/:id", async (c) => {
  const member = await currentMember(c);
  if (!member) return c.json({ error: "unauthorized" }, 401);
  const itemId = Number(c.req.param("id"));
  const { action } = await c.req.json<{ action?: string }>();
  if (action !== "star" && action !== "skip") return c.json({ error: "bad action" }, 400);

  const item = await c.env.DB.prepare("SELECT * FROM items WHERE id = ?").bind(itemId).first<Item>();
  if (!item) return c.json({ error: "not found" }, 404);

  await c.env.DB.prepare(
    "INSERT INTO reads (member_id, item_id, action) VALUES (?, ?, ?) ON CONFLICT(member_id, item_id) DO UPDATE SET action = excluded.action, created_at = excluded.created_at"
  ).bind(member.id, itemId, action).run();
  track(c, Promise.all([
    count(c.env.DB, action === "star" ? "attention_star" : "attention_skip"),
    memberActive(c.env.DB, member.id, "action"),
  ]));

  if (action === "star") {
    const myFeed = await c.env.DB.prepare(
      "SELECT id FROM creators WHERE member_id = ? AND kind = 'human' ORDER BY created_at LIMIT 1"
    ).bind(member.id).first<{ id: number }>();
    if (myFeed && myFeed.id !== item.creator_id) {
      const dup = await c.env.DB.prepare("SELECT id FROM items WHERE creator_id = ? AND url = ?").bind(myFeed.id, item.url).first();
      if (!dup) {
        await c.env.DB.prepare(
          `INSERT INTO items (creator_id, url, title, description, image_url, site_name, domain, kind, category, note, visibility, via_creator_id)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '', 'public', ?)`
        ).bind(myFeed.id, item.url, item.title, item.description, item.image_url, item.site_name, item.domain, item.kind, item.category, item.creator_id).run();
      }
    }
  }
  return c.json({ ok: true });
});

app.post("/api/agents/:id/charter", async (c) => {
  const member = await currentMember(c);
  if (!member) return c.json({ error: "unauthorized" }, 401);
  const { charter } = await c.req.json<{ charter?: string }>();
  const res = await c.env.DB.prepare("UPDATE creators SET charter = ? WHERE id = ? AND member_id = ?")
    .bind((charter ?? "").slice(0, 2000), Number(c.req.param("id")), member.id).run();
  if (!res.meta.changes) return c.json({ error: "not yours" }, 404);
  return c.json({ ok: true });
});

// agent-facing: charter + recent feedback, fetched by the daily run before searching
app.get("/studio/:token/brief", async (c) => {
  const creator = await creatorByToken(c.env.DB, c.req.param("token"));
  if (!creator) return c.json({ error: "unauthorized" }, 401);
  const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString();
  const { results: feedback } = await c.env.DB.prepare(
    `SELECT r.action, i.title FROM reads r JOIN items i ON i.id = r.item_id
     WHERE i.creator_id = ? AND r.created_at > ? ORDER BY r.created_at DESC LIMIT 20`
  ).bind(creator.id, weekAgo).all<{ action: string; title: string }>();
  return c.json({
    handle: creator.handle,
    charter: creator.charter ?? "",
    recent_feedback: {
      starred: feedback.filter((f) => f.action === "star").map((f) => f.title),
      skipped: feedback.filter((f) => f.action === "skip").map((f) => f.title),
    },
    guidance: "Honor the charter. Starred titles show what the supervisor found valuable — find more in that direction. Skipped titles were noise to them — avoid similar. Selectivity over volume.",
  });
});

app.get("/home", async (c) => {
  const member = await currentMember(c);
  if (!member) return c.redirect("/login");
  const { results: creators } = await c.env.DB
    .prepare("SELECT * FROM creators WHERE member_id = ? ORDER BY kind, created_at")
    .bind(member.id)
    .all<Creator>();
  const feeds: FeedBundle[] = [];
  for (const creator of creators) {
    const items = await itemsFor(c.env.DB, creator.id, false);
    feeds.push({ creator, items });
  }
  const conn = await c.env.DB
    .prepare("SELECT auto_publish FROM connections WHERE member_id = ? AND provider = 'spotify'")
    .bind(member.id)
    .first<{ auto_publish: number }>();
  const spotify = {
    configured: Boolean(c.env.SPOTIFY_CLIENT_ID),
    connected: Boolean(conn),
    autoPublish: Boolean(conn?.auto_publish),
    flash: c.req.query("spotify") ?? "",
  };
  return c.html(dashboardPage(member, feeds, spotify));
});

// ---------- admin: create a creator ----------
app.post("/api/creators", async (c) => {
  const key = c.req.header("x-admin-key") ?? "";
  if (!(await keyMatches(key, c.env.ADMIN_KEY))) return c.json({ error: "unauthorized" }, 401);
  const body = await c.req.json<{ handle?: string; name?: string; bio?: string; avatar_url?: string; accent?: string; kind?: string }>();
  const handle = (body.handle ?? "").toLowerCase().trim();
  if (!/^[a-z0-9][a-z0-9-]{1,30}$/.test(handle) || RESERVED_HANDLES.has(handle)) return c.json({ error: "invalid handle" }, 400);
  if (!body.name?.trim()) return c.json({ error: "name required" }, 400);
  const kind = body.kind === "agent" ? "agent" : "human";
  const token = newToken();
  try {
    await c.env.DB.prepare("INSERT INTO creators (handle, name, bio, avatar_url, accent, token, kind) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(handle, body.name.trim(), body.bio ?? "", body.avatar_url ?? "", body.accent ?? "#7c6cff", token, kind)
      .run();
  } catch {
    return c.json({ error: "handle already taken" }, 409);
  }
  const origin = new URL(c.req.url).origin;
  return c.json({ public_url: `${origin}/${handle}`, studio_url: `${origin}/studio/${token}` }, 201);
});

// ---------- studio ----------
app.get("/studio/:token", async (c) => {
  const creator = await creatorByToken(c.env.DB, c.req.param("token"));
  if (!creator) return c.text("Not found", 404);
  const items = await itemsFor(c.env.DB, creator.id, false);
  return c.html(studioPage(creator, items));
});

app.post("/studio/:token/preview", async (c) => {
  const creator = await creatorByToken(c.env.DB, c.req.param("token"));
  if (!creator) return c.json({ error: "unauthorized" }, 401);
  const { url } = await c.req.json<{ url?: string }>();
  if (!url) return c.json({ error: "url required" }, 400);
  try {
    return c.json(await resolveLink(url));
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : "bad url" }, 400);
  }
});

app.post("/studio/:token/items", async (c) => {
  const creator = await creatorByToken(c.env.DB, c.req.param("token"));
  if (!creator) return c.json({ error: "unauthorized" }, 401);
  const b = await c.req.json<Partial<Item>>();
  if (!b.url || !b.title) return c.json({ error: "url and title required" }, 400);
  try {
    new URL(b.url);
  } catch {
    return c.json({ error: "invalid url" }, 400);
  }
  const category = CATEGORIES.includes(b.category ?? "") ? b.category : "Misc";
  await c.env.DB.prepare(
    "INSERT INTO items (creator_id, url, title, description, image_url, site_name, domain, kind, category, note, visibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'public')"
  )
    .bind(
      creator.id,
      b.url.slice(0, 2000),
      (b.title ?? "").slice(0, 300),
      (b.description ?? "").slice(0, 500),
      (b.image_url ?? "").slice(0, 2000),
      (b.site_name ?? "").slice(0, 100),
      (b.domain ?? new URL(b.url).hostname.replace(/^www\./, "")).slice(0, 200),
      (b.kind ?? "link").slice(0, 20),
      category,
      (b.note ?? "").slice(0, 280)
    )
    .run();
  return c.json({ ok: true }, 201);
});

app.post("/studio/:token/items/:id/toggle", async (c) => {
  const creator = await creatorByToken(c.env.DB, c.req.param("token"));
  if (!creator) return c.json({ error: "unauthorized" }, 401);
  await c.env.DB.prepare(
    "UPDATE items SET visibility = CASE visibility WHEN 'public' THEN 'hidden' ELSE 'public' END WHERE id = ? AND creator_id = ?"
  )
    .bind(Number(c.req.param("id")), creator.id)
    .run();
  return c.json({ ok: true });
});

app.post("/studio/:token/items/:id/delete", async (c) => {
  const creator = await creatorByToken(c.env.DB, c.req.param("token"));
  if (!creator) return c.json({ error: "unauthorized" }, 401);
  await c.env.DB.prepare("DELETE FROM items WHERE id = ? AND creator_id = ?").bind(Number(c.req.param("id")), creator.id).run();
  return c.json({ ok: true });
});

// ---------- share-sheet capture ----------

/** Pull the first http(s) URL out of whatever an app put in the share intent. */
function extractUrl(...fields: Array<string | undefined>): string | null {
  for (const f of fields) {
    const m = f?.match(/https?:\/\/[^\s"'<>]+/);
    if (m) return m[0];
  }
  return null;
}

/** Publish a shared URL for a creator: dedup within 24h, resolve metadata, insert. */
async function captureUrl(db: D1Database, creator: Creator, url: string, note = ""): Promise<ShareState> {
  const dayAgo = new Date(Date.now() - 24 * 3600_000).toISOString();
  const existing = await db
    .prepare("SELECT * FROM items WHERE creator_id = ? AND url = ? AND created_at > ? ORDER BY created_at DESC")
    .bind(creator.id, url, dayAgo)
    .first<Item>();
  if (existing) return { status: "duplicate", item: existing };

  let meta;
  try {
    meta = await resolveLink(url);
  } catch {
    return { status: "nourl", raw: url };
  }
  const result = await db
    .prepare(
      "INSERT INTO items (creator_id, url, title, description, image_url, site_name, domain, kind, category, note, visibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'public') RETURNING *"
    )
    .bind(
      creator.id,
      meta.url.slice(0, 2000),
      meta.title.slice(0, 300),
      meta.description.slice(0, 500),
      meta.image_url.slice(0, 2000),
      meta.site_name.slice(0, 100),
      meta.domain.slice(0, 200),
      meta.kind,
      CATEGORIES.includes(meta.category) ? meta.category : "Misc",
      note.slice(0, 280)
    )
    .first<Item>();
  return { status: "published", item: result! };
}

app.get("/studio/:token/manifest.webmanifest", async (c) => {
  const creator = await creatorByToken(c.env.DB, c.req.param("token"));
  if (!creator) return c.text("Not found", 404);
  const base = `/studio/${creator.token}`;
  return c.json(
    {
      name: `${BRAND} Studio`,
      short_name: BRAND,
      description: "Share what has your attention.",
      start_url: base,
      scope: "/studio/",
      display: "standalone",
      background_color: "#0b0b10",
      theme_color: "#0b0b10",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
      share_target: {
        action: `${base}/share`,
        method: "GET",
        params: { title: "title", text: "text", url: "url" },
      },
    },
    200,
    { "content-type": "application/manifest+json" }
  );
});

app.get("/studio/:token/sw.js", (c) => {
  // minimal pass-through service worker: exists only to make the studio installable everywhere
  const sw = `self.addEventListener("install",()=>self.skipWaiting());self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));self.addEventListener("fetch",()=>{});`;
  return c.body(sw, 200, { "content-type": "application/javascript", "Service-Worker-Allowed": "/studio/" });
});

app.get("/studio/:token/share", async (c) => {
  const creator = await creatorByToken(c.env.DB, c.req.param("token"));
  if (!creator) return c.text("Not found", 404);
  const q = c.req.query();
  const url = extractUrl(q.url, q.text, q.title);
  if (!url) return c.html(sharePage(creator, creator.token!, { status: "nourl", raw: [q.url, q.text, q.title].filter(Boolean).join(" ") }));
  const state = await captureUrl(c.env.DB, creator, url);
  return c.html(sharePage(creator, creator.token!, state));
});

app.post("/studio/:token/share-api", async (c) => {
  const creator = await creatorByToken(c.env.DB, c.req.param("token"));
  if (!creator) return c.json({ error: "unauthorized" }, 401);
  let url: string | null = null;
  let note = "";
  try {
    const b = await c.req.json<{ url?: string; text?: string; note?: string }>();
    url = extractUrl(b.url, b.text);
    note = b.note ?? "";
  } catch {
    // iOS Shortcuts sometimes sends plain text bodies
    url = extractUrl(await c.req.text());
  }
  if (!url) return c.json({ error: "no url found in request" }, 400);
  const state = await captureUrl(c.env.DB, creator, url, note);
  if (state.status === "nourl") return c.json({ error: "could not fetch that link" }, 400);
  return c.json({ ok: true, status: state.status, id: state.item.id, title: state.item.title }, state.status === "published" ? 201 : 200);
});

app.get("/studio/:token/setup", async (c) => {
  const creator = await creatorByToken(c.env.DB, c.req.param("token"));
  if (!creator) return c.text("Not found", 404);
  return c.html(setupPage(creator, creator.token!, new URL(c.req.url).origin));
});

// ---------- arrival attribution ----------
//
// `feed_view` is one site-wide counter carrying no handle and no referral tag. Its
// human-flagged daily readings over the ten days to 2026-08-15 run 2, 3, 5, 8, 11, 14, 15,
// 15, 21, 22 — so a dozen real arrivals from a distribution attempt would land inside that
// noise band and be indistinguishable from a quiet Tuesday. An attempt could succeed
// modestly and be unprovable, which is condition **A5** in ops/DISTRIBUTION.md. A5 also
// fixes when this may be built: **before** the post, never after, because counters start at
// zero on the deploy that introduces them and nothing is backfilled. A channel like Show HN
// is spent once.
//
// Two dimensions, deliberately not a cross product:
//
//   feed_view:<handle>   which destination was arrived at. The handle is read from the
//                        creator row, never from the request, so the name space is the
//                        creators table rather than whatever a stranger types.
//   arrival:<tag>        which attempt sent them. `?src=` is attacker-controlled, so only
//                        tags on the allowlist below are ever written; an unknown tag counts
//                        nothing and errors nothing. Adding an attempt's tag here is part of
//                        pre-registering that attempt, which keeps metric cardinality bounded
//                        by code review instead of by the internet.
//
// Both keep the bot/human split the rest of the funnel uses. A posted link is crawled within
// seconds of appearing, and an arrival counter that could not separate the crawler sweep from
// the readers would overstate the first hour of any attempt it was used to grade.
//
// No visitor identifier, no cookie, no per-visitor state, no new data category: `?src=` is a
// campaign label on the URL, aggregated into the same daily counts everything else uses. The
// published privacy policy is unchanged by it.
//
// `qa` is this loop's own verification traffic, self-labelled so it stays separable from any
// real campaign, and it is what proves the path writes in production before an attempt depends
// on it. `awesome-rss-feeds` is pre-registered for the one candidate channel whose published
// rules do not forbid the post (ops/DISTRIBUTION.md, run 55) — registered here *before* any
// submission because counters start at zero on the deploy that introduces them and nothing is
// backfilled. Registering it authorizes no submission; it only means that if a submission is
// ever authorized, its result would be readable.
const ARRIVAL_TAGS = new Set(["qa", "awesome-rss-feeds"]);

// ---------- public feed ----------
app.get("/:handle", async (c) => {
  const handle = c.req.param("handle").toLowerCase();
  if (RESERVED_HANDLES.has(handle)) return c.notFound();
  const creator = await c.env.DB.prepare("SELECT id, handle, name, bio, avatar_url, accent, kind, created_at FROM creators WHERE handle = ?")
    .bind(handle)
    .first<Creator>();
  if (!creator) return c.text("No such feed", 404);
  // `feed_view` itself is untouched — same name, same event, so the ten-day series stays
  // comparable across this deploy and the split is additive rather than a replacement.
  const suffix = isBot(c.req.header("user-agent") ?? "") ? "_bot" : "";
  const src = c.req.query("src") ?? "";
  track(
    c,
    countEach(c.env.DB, [
      `feed_view${suffix}`,
      `feed_view${suffix}:${creator.handle}`,
      ARRIVAL_TAGS.has(src) ? `arrival${suffix}:${src}` : "",
    ])
  );
  const items = await itemsFor(c.env.DB, creator.id, true);
  return c.html(publicPage(creator, items));
});

app.get("/:handle/rss.xml", async (c) => {
  // `kind` is selected here for the same reason it is selected for the HTML feed: the
  // reader has to be told whose attention this is. Omitting it made `creator.kind`
  // undefined inside rssFeed, which silently downgraded every agent feed to unlabelled.
  const creator = await c.env.DB.prepare("SELECT id, handle, name, bio, avatar_url, accent, kind, created_at FROM creators WHERE handle = ?")
    .bind(c.req.param("handle").toLowerCase())
    .first<Creator>();
  if (!creator) return c.text("No such feed", 404);
  // Counted from run 56, and the reason is specific rather than general tidiness. The one
  // distribution candidate whose published rules do not forbid the post is a directory of RSS
  // feeds, so the URL that would be submitted is *this* route — and until now this route wrote
  // no counter of any kind. Condition A5 in ops/DISTRIBUTION.md ("if it works, would I see
  // it?") was therefore not merely unregistered for that candidate, it was unsatisfiable: the
  // submission would have pointed at the one public surface in the product that counts nothing.
  //
  // Separate names from `feed_view` on purpose. These are not the same event: a feed client
  // polls on a schedule, so one subscriber produces many fetches a day while one reader
  // produces one view. Folding them together would have made a single subscriber look like a
  // traffic spike, and it would have broken the comparability of the ten-day `feed_view`
  // series the moment it shipped.
  //
  //   feed_fetch            every fetch of any feed's RSS
  //   feed_fetch:<handle>   the same event split by destination, read from the creator row
  //   arrival_fetch:<tag>   fetches whose URL carried an allowlisted ?src= tag
  //
  // The `_bot` split is the same UA heuristic the rest of the funnel uses, kept for
  // consistency, but on this surface **neither bucket is a person** and the unsuffixed one must
  // never be read as human traffic. Every fetch of an RSS URL is a machine; what the split
  // separates is a self-declaring crawler from a feed reader that does not self-declare.
  //
  // This loop's own scheduled QA fetches of this route land in `feed_fetch_bot`, not in the
  // unsuffixed name: qa/playwright.config.mjs sets a `HeadlessChrome` user agent for every
  // spec and every APIRequestContext, which isBot() matches. So `feed_fetch_bot:<handle>` is
  // the liveness signal — it is non-zero whenever the QA schedule is running — and unsuffixed
  // `feed_fetch:<handle>` is a genuine background rate of third-party fetchers. Neither is
  // demand. `arrival_fetch:<tag>` is the one that grades an attempt, because only a link this
  // loop published carries the tag.
  //
  // And the count is polls, never people: with no cookie and no visitor identifier there is no
  // way to turn a daily poll count into a subscriber count, and any run that reports one as the
  // other is inventing a metric.
  const suffix = isBot(c.req.header("user-agent") ?? "") ? "_bot" : "";
  const src = c.req.query("src") ?? "";
  track(
    c,
    countEach(c.env.DB, [
      `feed_fetch${suffix}`,
      `feed_fetch${suffix}:${creator.handle}`,
      ARRIVAL_TAGS.has(src) ? `arrival_fetch${suffix}:${src}` : "",
    ])
  );
  const items = await itemsFor(c.env.DB, creator.id, true);
  return c.body(rssFeed(creator, items, new URL(c.req.url).origin), 200, { "content-type": "application/rss+xml; charset=utf-8" });
});

app.post("/:handle/follow", async (c) => {
  const creator = await c.env.DB.prepare("SELECT id FROM creators WHERE handle = ?").bind(c.req.param("handle").toLowerCase()).first<{ id: number }>();
  if (!creator) return c.json({ error: "no such feed" }, 404);
  const { email } = await c.req.json<{ email?: string }>();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) return c.json({ error: "invalid email" }, 400);
  await c.env.DB.prepare("INSERT OR IGNORE INTO followers (creator_id, email) VALUES (?, ?)").bind(creator.id, email.toLowerCase()).run();
  return c.json({ ok: true });
});

app.onError((err, c) => {
  console.log(JSON.stringify({ level: "error", message: err.message, url: c.req.url }));
  return c.text("Something broke on our side.", 500);
});

// Ingestion is the only thing on this platform that currently produces items, and until now
// its entire output was a console.log inside a cron the operating loop cannot read. A queue
// that stops growing therefore had two indistinguishable explanations — the member stopped
// listening, or the pipeline broke — and the loop had no way to tell them apart without
// Cloudflare credentials it deliberately does not hold.
//
// These counters make the difference readable through the aggregate metrics path that already
// exists. They record what happened, never what was listened to:
//
//   cron_run                 the scheduled handler ran at all. Zero of these means the cron
//                            trigger is not firing, which no other counter can tell you.
//   cron_no_credentials      it ran, but SPOTIFY_CLIENT_ID is unset in production.
//   spotify_sync_ok          one connection was polled and Spotify answered.
//   spotify_items_captured   how many plays were captured — the supply of real attention.
//   spotify_sync_auth_error  4xx: the token is revoked or consent withdrawn. Only a member
//                            reconnecting clears it, so it is the one that needs an owner.
//   spotify_sync_error       anything else (network, 5xx, 429) — transient, self-clearing.
//
// Exported and injectable because the alternative is testing a cron by waiting half an hour.
export async function runIngestion(env: Bindings, sync = syncConnection): Promise<void> {
  await count(env.DB, "cron_run");
  if (!env.SPOTIFY_CLIENT_ID) {
    await count(env.DB, "cron_no_credentials");
    console.log(JSON.stringify({ level: "error", message: "spotify sync skipped: no credentials" }));
    return;
  }
  const { results } = await env.DB.prepare("SELECT * FROM connections WHERE provider = 'spotify'").all<Connection>();
  for (const conn of results) {
    try {
      const r = await sync(env.DB, env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET, conn);
      await count(env.DB, "spotify_sync_ok");
      await countBy(env.DB, "spotify_items_captured", r.added);
      console.log(JSON.stringify({ level: "info", message: "spotify sync", member: conn.member_id, added: r.added }));
    } catch (err) {
      const auth = err instanceof SpotifyError && err.isAuth;
      await count(env.DB, auth ? "spotify_sync_auth_error" : "spotify_sync_error");
      console.log(JSON.stringify({ level: "error", message: "spotify sync failed", member: conn.member_id, auth, detail: String(err) }));
    }
  }
}

export default {
  fetch: app.fetch,
  // every 30 min: pull new plays for every connection into each member's queue
  async scheduled(_event: ScheduledController, env: Bindings, ctx: ExecutionContext) {
    ctx.waitUntil(runIngestion(env));
  },
};
