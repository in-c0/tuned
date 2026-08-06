import { Hono } from "hono";
import { resolveLink } from "./meta";
import { publicPage, studioPage, landingPage, rssFeed, sharePage, setupPage, BRAND, CATEGORIES, type Creator, type Item, type ShareState } from "./pages";
import { termsPage, privacyPage } from "./legal";
import { dashboardPage, loginPage, type FeedBundle } from "./dashboard";
import { deskPage, type DeskItem, type AgentStats } from "./desk";
import { currentMember, grantSession, clearSession, newToken as newSessionToken, SESSION_COOKIE, type Member } from "./auth";
import { authorizeUrl, exchangeCode, syncConnection, type Connection } from "./spotify";
import { count, memberActive, isBot, snapshot } from "./metrics";
import { BUILD_COMMIT } from "./build-info";
import { getCookie, setCookie } from "hono/cookie";
import type { Context } from "hono";

type Bindings = { DB: D1Database; ADMIN_KEY: string; METRICS_KEY: string; SPOTIFY_CLIENT_ID: string; SPOTIFY_CLIENT_SECRET: string };
const app = new Hono<{ Bindings: Bindings }>();

/** Fire-and-forget telemetry: never blocks the response, never fails a request. */
function track(c: Context, work: Promise<unknown>): void {
  const swallowed = work.catch(() => {});
  try {
    c.executionCtx.waitUntil(swallowed);
  } catch {
    // no execution context (e.g. tests) — the promise still runs
  }
}

const RESERVED_HANDLES = new Set(["api", "studio", "favicon.ico", "robots.txt", "rss.xml", "terms", "privacy", "waitlist", "home", "login", "logout", "enter", "today", "read", "queue", "connect"]);

function newToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function timingSafeEq(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  return crypto.subtle.timingSafeEqual(ha, hb);
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
  const demoCreator = results[0];
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
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) return c.json({ error: "invalid email" }, 400);
  const safeRole = ["fan", "creator", "agent", "both"].includes(role ?? "") ? role : "fan";
  await c.env.DB.prepare("INSERT OR IGNORE INTO waitlist (email, role, note) VALUES (?, ?, ?)")
    .bind(email.toLowerCase(), safeRole, (note ?? "").slice(0, 280))
    .run();
  track(c, count(c.env.DB, "application_submit"));
  return c.json({ ok: true });
});

app.get("/terms", (c) => c.html(termsPage()));
app.get("/privacy", (c) => c.html(privacyPage()));

// Which commit this Worker was built from. Stamped at build time by
// scripts/build-info.mjs; "dev" in any build that did not run through CI.
// Deliberately unauthenticated and content-free: it is how post-deploy verification
// proves the expected version is serving rather than assuming it after a sleep, and
// the repository's commit hashes are not a secret. Returns no environment, no
// binding, no data.
app.get("/api/version", (c) => c.json({ commit: BUILD_COMMIT }, 200, { "cache-control": "no-store" }));

// Aggregate funnel counts for the operating loop. Key-gated and fails closed, so it is
// not a public surface; returns counts only — no emails, ids, handles or item content.
app.get("/api/metrics", async (c) => {
  const key = c.req.header("x-metrics-key") ?? "";
  if (!c.env.METRICS_KEY) return c.json({ error: "metrics key not configured" }, 503);
  if (!(await timingSafeEq(key, c.env.METRICS_KEY))) return c.json({ error: "unauthorized" }, 401);
  return c.json(await snapshot(c.env.DB), 200, { "cache-control": "no-store" });
});

// ---------- member auth + dashboard ----------

// admin: provision a member and (optionally) attach existing creator handles to them
app.post("/api/members", async (c) => {
  const key = c.req.header("x-admin-key") ?? "";
  if (!c.env.ADMIN_KEY || !(await timingSafeEq(key, c.env.ADMIN_KEY))) return c.json({ error: "unauthorized" }, 401);
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
  if (!c.env.ADMIN_KEY || !(await timingSafeEq(key, c.env.ADMIN_KEY))) return c.json({ error: "unauthorized" }, 401);
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

// ---------- public feed ----------
app.get("/:handle", async (c) => {
  const handle = c.req.param("handle").toLowerCase();
  if (RESERVED_HANDLES.has(handle)) return c.notFound();
  const creator = await c.env.DB.prepare("SELECT id, handle, name, bio, avatar_url, accent, kind, created_at FROM creators WHERE handle = ?")
    .bind(handle)
    .first<Creator>();
  if (!creator) return c.text("No such feed", 404);
  track(c, count(c.env.DB, isBot(c.req.header("user-agent") ?? "") ? "feed_view_bot" : "feed_view"));
  const items = await itemsFor(c.env.DB, creator.id, true);
  return c.html(publicPage(creator, items));
});

app.get("/:handle/rss.xml", async (c) => {
  const creator = await c.env.DB.prepare("SELECT id, handle, name, bio, avatar_url, accent, created_at FROM creators WHERE handle = ?")
    .bind(c.req.param("handle").toLowerCase())
    .first<Creator>();
  if (!creator) return c.text("No such feed", 404);
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

export default {
  fetch: app.fetch,
  // every 30 min: pull new plays for every connection into each member's queue
  async scheduled(_event: ScheduledController, env: Bindings, ctx: ExecutionContext) {
    ctx.waitUntil(
      (async () => {
        if (!env.SPOTIFY_CLIENT_ID) return;
        const { results } = await env.DB.prepare("SELECT * FROM connections WHERE provider = 'spotify'").all<Connection>();
        for (const conn of results) {
          try {
            const r = await syncConnection(env.DB, env.SPOTIFY_CLIENT_ID, env.SPOTIFY_CLIENT_SECRET, conn);
            console.log(JSON.stringify({ level: "info", message: "spotify sync", member: conn.member_id, added: r.added }));
          } catch (err) {
            console.log(JSON.stringify({ level: "error", message: "spotify sync failed", member: conn.member_id, detail: String(err) }));
          }
        }
      })()
    );
  },
};
