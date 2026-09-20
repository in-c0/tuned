import { Hono } from "hono";
import { resolveLink } from "./meta";
import { publicPage, itemPage, studioPage, landingPage, rssFeed, sharePage, setupPage, BRAND, CATEGORIES, type Creator, type Item, type ShareState, type FeedViewer } from "./pages";
import { termsPage, privacyPage } from "./legal";
import { dashboardPage, loginPage, type FeedBundle } from "./dashboard";
import { deskPage, type DeskItem, type AgentStats } from "./desk";
import { currentMember, grantSession, clearSession, newToken as newSessionToken, SESSION_COOKIE, type Member } from "./auth";
import { authorizeUrl, exchangeCode, syncConnection, SpotifyError, type Connection } from "./spotify";
import { count, countBy, countEach, memberActive, isBot, snapshot, wroteNewRow } from "./metrics";
import { BUILD_COMMIT } from "./build-info";
import { keyMatches, keyConfigured } from "./keys";
import { RESERVED_HANDLES, ownerHandle, ownerMemberId } from "./handles";
import { isPrivatePath, robotsTxt, sitemapXml, type SitemapEntry } from "./crawl";
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

// Refuse indexing of everything gated, before anything else can answer. `robots.txt` asks a
// crawler not to fetch these; this is what refuses them when the URL was found some other way
// and never fetched from us at all — which is the only case that matters for a capability URL
// like /studio/<token> or /enter/<token>. Registered first so it also covers /api/operator,
// and driven by the same list robots.txt is written from (src/crawl.ts) so the two cannot drift.
app.use("*", async (c, next) => {
  await next();
  if (isPrivatePath(c.req.path)) c.header("x-robots-tag", "noindex, nofollow");
});

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

/** The user-agent split every counter on this site carries. Weak and forgeable by design. */
function botSuffix(c: Context): "" | "_bot" {
  return isBot(c.req.header("user-agent") ?? "") ? "_bot" : "";
}

/** True when nothing about this navigation says a person activated it.
 *
 *  `Sec-Fetch-User: ?1` is sent by a browser on a top-level navigation **only** when it was
 *  triggered by user activation — a click, a typed URL, a bookmark. A prefetcher, a mail
 *  security gateway or a chat unfurler produces no user activation, and a plain HTTP client
 *  sends no `Sec-Fetch-*` header at all, so both land here.
 *
 *  This is the GET counterpart of the `Origin` test on /waitlist: a GET carries no `Origin`,
 *  so there is nothing else on a navigation request to ask. It is evidence, not proof, in
 *  both directions — which is why every caller labels and none refuses. */
function unattended(c: Context): boolean {
  return c.req.header("sec-fetch-user") !== "?1";
}

/** True when this navigation came from a page on this same origin.
 *
 *  The third discriminator of the same family as `_offpage` (an `Origin` test on a POST) and
 *  `_unattended` (a `Sec-Fetch-User` test on a GET): a header the browser sets, read to label a
 *  subset and never to refuse one. `Referer` is the only one of the three that says *where from*.
 *
 *  Parsed rather than prefix-matched. `startsWith(origin)` would count `https://justtuned.com.evil
 *  .test/` as this site, which is the classic form of this bug; comparing parsed origins cannot.
 *  A malformed or absent header is not this site, so it returns false — the direction that
 *  under-counts internal traffic rather than inventing it. */
function onsite(c: Context): boolean {
  const ref = c.req.header("referer");
  if (!ref) return false;
  try {
    return new URL(ref).origin === new URL(c.req.url).origin;
  } catch {
    return false;
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

// ---------- application ----------
//
// This is the one number the whole loop is waiting for. `applications` has read 0 for
// every day of this bet, and the first time it reads 1 that reading will decide what the
// remaining runs do. Until run 141 it was also the **only** counter on this site that
// could not say who wrote it.
//
// Every other funnel counter carries the `isBot` split, and `/api/pulse/*` additionally
// refuses a caller that is not on this page. `/waitlist` did neither: a scripted POST
// from anywhere — the route is public source in a public repository — wrote a `waitlist`
// row and an unsuffixed `application_submit`, and arrived in the snapshot indistinguishable
// from a person who filled in the form. That is L-51's shape at the bottom of the funnel
// instead of the top, and it is worse there, because this is the reading nobody would
// think to doubt.
//
// Two discriminators, and the second is the load-bearing one:
//
//   * `_bot` — the same user-agent heuristic as everywhere else. Weak and forgeable, and
//     it exists here for consistency rather than for strength: a spam script that sends a
//     Chrome user-agent lands unsuffixed, exactly as it does on `landing_view`.
//   * `_offpage` — no `Origin`, or one that is not this site's. Browsers send `Origin` on
//     every same-origin POST, and a cross-origin JSON POST is preflighted and blocked
//     before it arrives; curl, scanners and scripts send none. So its **absence** is real
//     evidence the submit did not come from this page in a browser, on the same reasoning
//     `landing_render` rests on (EXP-011).
//
// `_offpage` is an **axis, not a bucket**: it counts a subset of the two names above and
// is never summed with them. `application_submit + application_submit_bot` remains the
// total, exactly as before.
//
// Deliberately NOT done: rejecting a submit that lacks `Origin`. `applications` is 0, so
// the cost of one false reject — a real applicant turned away because their browser did
// something unexpected — is the entire bet, and the benefit is a counter that is already
// obtainable by labelling. This route classifies; it never refuses.
app.post("/waitlist", async (c) => {
  const { email, role, note } = await c.req.json<{ email?: string; role?: string; note?: string }>();
  const suffix = isBot(c.req.header("user-agent") ?? "") ? "_bot" : "";
  const offpage = c.req.header("origin") !== new URL(c.req.url).origin;
  // A rejected submit is someone who tried to join and did not. It has been invisible:
  // `application_submit` only counts the ones that worked, so a broken validator and an
  // empty funnel look identical in the snapshot.
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) {
    track(c, count(c.env.DB, `application_invalid${suffix}`));
    if (offpage) track(c, count(c.env.DB, "application_invalid_offpage"));
    return c.json({ error: "invalid email" }, 400);
  }
  const safeRole = ["fan", "creator", "agent", "both"].includes(role ?? "") ? role : "fan";
  await c.env.DB.prepare("INSERT OR IGNORE INTO waitlist (email, role, note) VALUES (?, ?, ?)")
    .bind(email.toLowerCase(), safeRole, (note ?? "").slice(0, 280))
    .run();
  track(c, count(c.env.DB, `application_submit${suffix}`));
  if (offpage) track(c, count(c.env.DB, "application_submit_offpage"));
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
// Deliberately bounded: a short allowlist of names, no request body, no response
// body, no cookie, no identifier of any kind, no per-visitor state. Same-origin only, which
// stops casual inflation but is forgeable by anyone willing to set one header — these are
// page-reported counters, and the snapshot's own note says so rather than implying proof.
// Nothing here changes what the privacy policy already describes: no new data category is
// collected and nothing is stored in the visitor's browser.
//
// `landing_render` was added at run 138, and the reason is that after nineteen complete days
// the three explanations above are **still** not separated — because the counter built to
// separate them cannot. `landing_engage` fires on the first pointerdown, keydown or scroll,
// so it requires a visitor to *do* something. Explanations 1 and 2 both produce a near-zero
// reading against it: a headless scanner carrying a Chrome user-agent never scrolls, and
// neither does a real person who reads a short page and leaves. Over the complete UTC days
// 2026-08-16 … 2026-09-03, on which every counter here existed, that is exactly what
// happened — `landing_view` 1131, `landing_engage` 7 on 5 of 19 days, unsuffixed
// `application_start` never written at all — and the register has been reading that as
// "the landing page is not the bottleneck, distribution is" on an inference the numbers do
// not license. Explanation 3 *is* excluded, by application_start rather than by engage.
//
// The missing rung is not another interaction. It is **whether a browser engine ever parsed
// this page and ran its script.** Almost everything that inflates `landing_view` — port and
// path scanners, uptime probes, link-preview fetchers, header-spoofing crawlers — takes the
// HTML and executes none of it. So `landing_render` fires once per page load at script
// execution, unconditionally, and the pair (`landing_view`, `landing_render`) is a ratio
// whose denominator means something: it is the share of UA-flagged human-shaped requests
// that were a rendering browser at all.
//
// What it is not, stated here so no later run has to infer it: **it is not a person.** A
// JS-executing crawler that declares itself lands in `landing_render_bot`; one that does not
// declare itself lands unsuffixed and is indistinguishable from a visitor. It is strictly
// more discriminating than a user-agent string and strictly weaker than proof of a human,
// and it is forgeable on the same one header as the other two. See EXP-011.
//
// `follow_open` is the same rung one page along, and it is added for the reason EXP-007 spent
// nineteen days establishing: without an intermediate counter, a zero at the bottom has two
// explanations that no amount of staring separates. On a feed page `feed_view:<handle>` is the
// top and `follow_submit` is the bottom; if the bottom reads 0, "the arriving clients are not
// people" and "people arrive and do not want to follow" produce the identical number. Opening
// the follow dialog is a deliberate act that neither a scanner nor an uninterested reader
// performs, so it separates them.
//
// What it cannot do, recorded here rather than left to be inferred: it is **site-wide and
// carries no handle**, because the pulse name is the whole key and a handle in it would be a
// string from the URL bar minting rows in metric_days. So with more than one feed live it
// cannot be attributed to a destination the way `follow_submit:<handle>` can, and the ratio
// against `feed_view:<handle>` is only sound while one feed dominates the views. It is also
// page-reported and forgeable on one header, like every other name here.
//
// `feed_render` is `landing_render`'s rung on the feed page, and the argument for it is the one
// above transplanted, not a reading. **No interim value of `landing_render` is quoted here**: it
// first existed on 2026-09-05, EXP-011 is pre-registered to grade R = `landing_render` ÷
// `landing_view` over 2026-09-05 … 2026-09-18, and reporting a partial series as a finding is what
// pre-registration exists to forbid. What is quoted is the structure. `landing_view` alone could
// not say whether a browser engine ever parsed the landing page, which is why that name was built;
// `/:handle` has the view and no such name at all — `feed_view:sportstech` reads 37 across 21
// complete days and nothing on this site can say whether one of them was a rendering browser.
//
// It is built now rather than when a listing lands because **counters do not backfill**. Both open
// items in ops/DISTRIBUTION.md point at a feed page, both are owner-gated and either can land on
// any day; the first arrival is exactly the reading that cannot be reconstructed afterwards.
//
// Two properties it shares with `follow_open` rather than with `landing_render`, stated so no later
// run infers otherwise. It is **site-wide and carries no handle**, for the same reason: the pulse
// name is the whole key and a handle from the URL bar would mint rows in metric_days. And it is
// **emitted only by a page carrying the follow button** — `publicPage` always renders one and
// `studioPage`, which shares this script, never does — so it counts renders of a public feed page
// and not of the studio. What follows from that pair: `feed_render` ÷ `feed_view` is sound
// site-wide, `feed_render` ÷ `feed_view:<handle>` is sound only while one feed dominates views, and
// `feed_render` is the honest denominator for `follow_open`, which is gated on the same element.
//
// `follow_rss` is the fork under `follow_open`, and it exists because the two paths out of that
// dialog are not the same kind of thing. An accepted `follow_submit` writes a row into `followers`
// — a table nothing on this platform reads and no code in src/ can deliver to, because there is no
// mail provider, no sender and no digest job, and standing one up is an owner/auth step. The RSS
// URL is the only subscription on this page that does anything today. Until this run the dialog
// offered the first as a primary button and the second nowhere, with the page's only RSS link at
// 12px in the header; the dialog now discloses that before asking for an address and offers both.
// `follow_rss` is what makes the resulting choice readable at all: `feed_fetch` moves when a reader
// actually polls, but it cannot say the dialog sent them, and a visitor who takes the working path
// would otherwise leave no trace on this rung. Site-wide and handle-free for the same reason as
// `follow_open`, gated on the same element, and counted at most once per page load. It is a click
// and not a subscription — nothing here observes whether a reader was added on the other side — and
// it is emitted only by the link inside the dialog, never by the header link, which carries no
// follow intent and would blur the rung.
const PULSE_COUNTERS = new Set([
  "landing_render",
  "landing_engage",
  "application_start",
  "follow_open",
  "feed_render",
  "follow_rss",
  // `landing_render`'s rung on a find page, and the reading the find surface exists to make
  // possible: a find page is the one surface a search engine can send someone to, so whether the
  // requests arriving there are rendering browsers is the whole question. Read against
  // `item_view` exactly as `landing_render` is read against `landing_view` — the share of
  // requests that ran the document, not a count of people, and forgeable on the same one header.
  "item_render",
  // The find page's follow dialog, counted under names of its own rather than under
  // `follow_open`/`follow_rss`. Those two are published as properties of a public **feed** page
  // and `follow_open`'s honest denominator is `feed_render`, which a find page cannot emit;
  // routing a second surface into them would have changed what a running number means without
  // changing its name. So `find_follow_open` is the dialog opening on a find page and
  // `find_follow_rss` is the RSS option inside it, each at most once per page load, same-origin
  // only, and each read against `item_render` the way the feed-page pair is read against
  // `feed_render`. Neither is a subscriber and neither is additive with the feed-page name it
  // mirrors — a visitor who follows from both surfaces is two page loads, not one funnel.
  "find_follow_open",
  "find_follow_rss",
]);
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

// ---------- crawl policy ----------
//
// Counted for the same reason run 56 started counting `/rss.xml`: this loop keeps shipping
// surfaces whose entire audience is machines, and condition A5 in ops/DISTRIBUTION.md — "if it
// works, would I see it?" — is unsatisfiable on a surface that records nothing. `robots_fetch`
// answers exactly one question, whether any crawler has ever asked this site for its rules.
//
// Read it as nothing else. Every fetch of either route is a machine, so the `_bot` split here
// separates a crawler that declares itself from one that does not — it never separates people
// from bots, and neither bucket is demand, a visitor or a subscriber (EXP-009).
//
// And `robots_fetch_bot`/`sitemap_fetch_bot` carry this loop's own probes: verify-production.yml
// fetches both routes on every push to master and again at 06:20 Sydney, under a user-agent that
// matches BOT_UA. So a non-zero `_bot` count on a deploy day is this loop looking at itself —
// the same trap L-44 recorded for `feed_fetch_bot`. The unsuffixed names are the ones that could
// ever carry a third party, and they start at zero.
app.get("/robots.txt", (c) => {
  track(c, count(c.env.DB, isBot(c.req.header("user-agent") ?? "") ? "robots_fetch_bot" : "robots_fetch"));
  return c.body(robotsTxt(new URL(c.req.url).host), 200, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "public, max-age=3600",
  });
});

// Only feeds with at least one public item are listed. A sitemap is a claim that a URL is worth
// indexing, and an empty feed page is a claim this loop cannot support — the same reason the
// landing page's demo block orders by newest item rather than by oldest creator. An unlisted
// feed is not hidden: it stays linked from the landing page and reachable at its handle.
//
// The row cap is well under the sitemap protocol's 50,000-URL limit and exists so an
// unauthenticated route can never be asked to render an unbounded document. Creator rows are
// ADMIN_KEY-gated today, so this bounds a shape rather than a known attack.
app.get("/sitemap.xml", async (c) => {
  track(c, count(c.env.DB, isBot(c.req.header("user-agent") ?? "") ? "sitemap_fetch_bot" : "sitemap_fetch"));
  const { results } = await c.env.DB.prepare(
    `SELECT cr.handle AS handle, MAX(i.created_at) AS lastmod
       FROM creators cr JOIN items i ON i.creator_id = cr.id AND i.visibility = 'public'
      GROUP BY cr.id ORDER BY cr.handle
      LIMIT 10000`
  ).all<{ handle: string; lastmod: string }>();
  // The landing page changes when anything published anywhere changes — its demo block is the
  // newest public item on the site.
  const newest = results.map((r) => r.lastmod).sort().pop() ?? null;
  // Every published find, at the address it now has. This is the whole point of the sitemap for
  // this service: before find pages existed it advertised eight URLs against eighty-seven pieces
  // of published attention, so the one arrival channel that needs nobody's permission was being
  // offered almost nothing to index.
  //
  // `visibility = 'public'` is the same gate the route enforces, and it must stay that way in
  // both places: a sitemap entry for a hidden or queued row would advertise a 404 and would also
  // be this service asserting that an unpublished item is public.
  const { results: itemRows } = await c.env.DB.prepare(
    `SELECT i.id AS id, cr.handle AS handle, i.created_at AS lastmod
       FROM items i JOIN creators cr ON cr.id = i.creator_id
      WHERE i.visibility = 'public'
      ORDER BY i.created_at DESC
      LIMIT 20000`
  ).all<{ id: number; handle: string; lastmod: string }>();
  const entries: SitemapEntry[] = [
    { path: "/", lastmod: newest },
    ...results.map((r) => ({ path: `/${r.handle}`, lastmod: r.lastmod })),
    ...itemRows.map((r) => ({ path: `/${r.handle}/${r.id}`, lastmod: r.lastmod })),
    { path: "/terms" },
    { path: "/privacy" },
  ];
  return c.body(sitemapXml(entries), 200, {
    "content-type": "application/xml; charset=utf-8",
    "cache-control": "public, max-age=3600",
  });
});

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
  return c.json(await snapshot(c.env.DB, ownerHandle(c.env.AGENT_OPERATOR_OWNER)), 200, {
    "cache-control": "no-store",
  });
});

// ---------- member auth + dashboard ----------

// The input to the approval act below — and until this route existed, there was none.
//
// `POST /waitlist` has written every application since 2026-08-06 into a table that exactly one
// thing reads: `SELECT COUNT(*) FROM waitlist` in src/metrics.ts, reported as the integer
// `applications`. Nothing anywhere returned a row. So an application was visible to the owner
// only as a number moving in a JSON snapshot committed the following morning, while the address,
// the role and the note the applicant wrote sat in a table no surface could reach — and
// `POST /api/members` takes an email, which is precisely the field the count cannot carry. The
// funnel's second stage wrote to a table its third stage had no way to read, so admitting anyone
// required Cloudflare credentials this loop holds by design and the owner would have to go to the
// dashboard for. `applications` has read 0 for the whole window, which is why forty days passed
// without the gap being felt: an unreadable table and an empty one produce the same JSON.
//
// This is the shape of defect run 145 found on `POST /:handle/follow` and the `followers` table —
// a conversion surface whose output nothing consumes — and it survived that sweep and the route
// inventory that came out of it for the same reason both missed it there: it is a missing
// *reader*, not a missing counter, and neither instrument enumerates readers.
//
// Bounded deliberately. It returns the applicant's own submission and nothing derived from
// anywhere else: no session token, no member id, no counter, no other table. `admitted` is the
// address matched against `members`, which is the one fact needed to tell an application still
// waiting from one already approved. `total` and `pending` are counted over the whole table
// rather than the returned page, so `limit` cannot quietly shrink the headline. Key-gated on
// ADMIN_KEY — the same credential that already admits members and creates feeds, so this exposes
// no address to anyone who could not already read it — and it fails closed with 503 while that
// secret is unset, which is the state it ships in.
app.get("/api/applications", async (c) => {
  const key = c.req.header("x-admin-key") ?? "";
  if (!keyConfigured(c.env.ADMIN_KEY)) return c.json({ error: "admin key not configured" }, 503);
  if (!(await keyMatches(key, c.env.ADMIN_KEY))) return c.json({ error: "unauthorized" }, 401);
  const asked = Number(c.req.query("limit") ?? "");
  const limit = Number.isFinite(asked) && asked >= 1 ? Math.min(Math.floor(asked), 500) : 200;
  const [rows, totals] = await Promise.all([
    c.env.DB.prepare(
      `SELECT w.email, w.role, w.note, w.created_at,
              EXISTS (SELECT 1 FROM members m WHERE m.email = w.email) AS admitted
         FROM waitlist w
        ORDER BY w.created_at DESC, w.id DESC
        LIMIT ?`
    )
      .bind(limit)
      .all<{ email: string; role: string; note: string; created_at: string; admitted: number }>(),
    c.env.DB.prepare(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN EXISTS (SELECT 1 FROM members m WHERE m.email = w.email) THEN 0 ELSE 1 END) AS pending
         FROM waitlist w`
    ).first<{ total: number; pending: number | null }>(),
  ]);
  return c.json(
    {
      total: totals?.total ?? 0,
      // SUM over zero rows is NULL in SQLite, which would serialise as `pending: null` on the
      // empty table this route ships against. Coerce it here so the field is always a number.
      pending: totals?.pending ?? 0,
      returned: rows.results?.length ?? 0,
      applications: (rows.results ?? []).map((r) => ({
        email: r.email,
        role: r.role,
        note: r.note,
        created_at: r.created_at,
        admitted: r.admitted > 0,
      })),
    },
    200,
    { "cache-control": "no-store" }
  );
});

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

// A sign-in link is delivered by email and opened by a GET, which makes this the one route on
// the site whose first visitor is *systematically* a machine. Mail providers, security gateways
// and chat unfurlers fetch every URL in a message before a person ever sees it, and this handler
// grants a session and counts a login to whatever asks. So `member_login` recorded "a member
// signed in" and "something opened the link in the admit email" under one name, and the record
// held nothing that could separate them (L-58).
//
// That is worse than a mislabelled counter, because it does not stop here: this route redirects
// to `/today`, which writes a `member_days` row, and `member_days` is the sole source of
// `retention.members_ever_active` — the number this loop reports as its activation evidence and
// which has read **0** for the whole window. A prefetch that carries the cookie through the
// redirect moves it 0 → 1 with no person involved, and reads in the snapshot exactly like the
// first activation Tuned has ever had. The false positive is not hypothetical: it is scheduled
// to fire on the very first real admission, which is the moment nobody would doubt it.
//
// Two discriminators, and the second is the load-bearing one:
//
//   * `_bot` — the same user-agent heuristic as every other counter. Weak and forgeable, and
//     here for consistency rather than strength: a scanner sending a Chrome user-agent lands
//     unsuffixed, exactly as it does on `landing_view`.
//   * `_unattended` — the request carried no `Sec-Fetch-User: ?1`. Browsers set that header on
//     a top-level navigation **only** when a person activated it; nothing a prefetcher, mail
//     gateway or unfurler does produces user activation, and a plain HTTP client sends no
//     `Sec-Fetch-*` at all. So its absence is real evidence no click caused this request — the
//     same shape of reasoning as `_offpage` on /waitlist (L-57) and `landing_render` (EXP-011),
//     adapted to a GET, which carries no `Origin` to test.
//
// `_unattended` is an **axis, not a bucket**: it counts a subset of the two names above and is
// never summed with them. `member_login + member_login_bot` remains the total it always was.
//
// Absence is evidence, not proof, in both directions: a real click that arrives without the
// header lands in `_unattended` too. Which is exactly why this route classifies and never
// refuses — see the sign-in interstitial declined in ops/DECISIONS.md. Turning away one real
// member to keep a counter clean would cost more than every mislabelled login combined.
app.get("/enter/:token", async (c) => {
  const member = await c.env.DB.prepare("SELECT * FROM members WHERE session_token = ?").bind(c.req.param("token")).first<Member>();
  if (!member) return c.html(loginPage("That sign-in link isn't valid anymore. Ask us for a fresh one."), 404);
  grantSession(c, member.session_token);
  track(c, count(c.env.DB, `member_login${botSuffix(c)}`));
  if (unattended(c)) track(c, count(c.env.DB, "member_login_unattended"));
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
  // This is where a false activation actually lands. `memberActive` writes the `member_days`
  // row that `retention.members_ever_active` is computed from, and reaching here needs only the
  // session cookie /enter/<token> just handed out — so anything that followed the sign-in link
  // and kept the cookie through the redirect arrives with a valid session and is counted active.
  //
  // The same two discriminators as /enter, for the same reason, on the same terms: `_bot` is the
  // consistency split, `_unattended` is an axis counting a subset and never summed with the
  // names above, and neither refuses anything — the desk renders identically either way. What
  // they buy is that `members_ever_active: 0 → 1` no longer arrives alone: on the day it moves,
  // `desk_view` / `desk_view_bot` / `desk_view_unattended` say in the same snapshot whether a
  // browser a person was driving is what moved it.
  track(c, Promise.all([count(db, `desk_view${botSuffix(c)}`), memberActive(db, member.id, "desk")]));
  if (unattended(c)) track(c, count(db, "desk_view_unattended"));

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
    // `OR r.action IS NULL` — a find the member has never triaged is not hidden by the window.
    //
    // The seven-day floor is the right rule for a daily-return surface and it stays exactly as it
    // was **for everything the member has seen**. What it could not survive is being the rule for
    // everything they have not. On the day this changed, the five public feeds on this site held
    // 87 public items and **not one of them was inside the window**: `wearables`, `wellbeing` and
    // `graphics` last published 30 July, `ava` 4 August, `sportstech` — the freshest — eight days
    // earlier. So a member who took the offer run 177 put on all eighty-seven find pages was
    // redirected here and shown `0 this week · unrated` over *"Nothing new from @wearables"*,
    // having just clicked a row that advertised **19 finds**. The desk was empty by construction
    // and would have stayed empty for every feed, for every member, until a feed published again.
    //
    // This is not "show the archive forever", and the distinction is the whole design: the moment
    // the member triages a find it is theirs, it falls back under the window, and it does not come
    // back tomorrow. `test/desk-window.test.ts` pins both halves, and the second is the one that
    // would rot if it were only a comment.
    //
    // No extra query: `r` is the LEFT JOIN this statement already had, on this member and this
    // item, which is what `read_action` is read from one line above.
    const { results: items } = await db.prepare(
      `SELECT i.*, cr.handle, cr.name AS agent_name, cr.kind AS agent_kind, r.action AS read_action
       FROM items i JOIN creators cr ON cr.id = i.creator_id
       LEFT JOIN reads r ON r.item_id = i.id AND r.member_id = ?
       WHERE i.creator_id = ? AND i.visibility = 'public' AND (i.created_at > ? OR r.action IS NULL)
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
    // `last_item_at` joins this query rather than adding one. It exists because `found7d` is a
    // true statistic that now renders directly above however many cards the fallback produced:
    // "0 this week" over three finds is not false, and read alone it is unreadable. The age of
    // the feed's newest public item is the sentence that reconciles them — and it is the sentence
    // run 172 put on the follow block and both follow dialogs (L-18: staleness is a fact about
    // the world, a page that declines to mention it is the defect).
    const st = await db.prepare(
      `SELECT
        (SELECT COUNT(*) FROM items WHERE creator_id = ?1 AND created_at > ?2 AND visibility='public') AS found7d,
        (SELECT MAX(created_at) FROM items WHERE creator_id = ?1 AND visibility='public') AS last_item_at,
        (SELECT COUNT(*) FROM reads r JOIN items i ON i.id = r.item_id WHERE i.creator_id = ?1 AND r.member_id = ?3 AND r.action='star' AND r.created_at > ?2) AS starred7d,
        (SELECT COUNT(*) FROM reads r JOIN items i ON i.id = r.item_id WHERE i.creator_id = ?1 AND r.member_id = ?3 AND r.action='skip' AND r.created_at > ?2) AS skipped7d`
    ).bind(cr.id, weekAgo, member.id).first<{ found7d: number; last_item_at: string | null; starred7d: number; skipped7d: number }>();
    groups.push({
      stats: {
        creator: cr,
        found7d: st?.found7d ?? 0,
        lastItemAt: st?.last_item_at ?? null,
        starred7d: st?.starred7d ?? 0,
        skipped7d: st?.skipped7d ?? 0,
      },
      items: kept,
    });
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

  // The feeds this member could add and has not. Without these the desk had nothing to offer and
  // its empty state told the member to "follow more feeds" — a verb with no implementation
  // anywhere in the product. Restricted to feeds that have actually published something, because
  // offering an empty feed to somebody staring at an empty desk is offering them the same screen
  // again. Ordered by most recently published, which is the only ranking signal that exists here.
  const { results: suggestions } = await db.prepare(
    `SELECT cr.*, MAX(i.created_at) AS last_item_at, COUNT(i.id) AS public_items
       FROM creators cr JOIN items i ON i.creator_id = cr.id AND i.visibility = 'public'
      WHERE cr.id NOT IN (SELECT creator_id FROM follows WHERE member_id = ?1)
        -- Your own feed is not somebody else's attention to follow. Excluded rather than left in
        -- and ignored, because the owner is the one member who has feeds, so leaving it in means
        -- the only desk that exists today offers the owner himself as a thing to subscribe to.
        AND (cr.member_id IS NULL OR cr.member_id <> ?1)
      GROUP BY cr.id
      ORDER BY last_item_at DESC
      LIMIT 12`
  ).bind(member.id).all<Creator & { public_items: number; last_item_at: string | null }>();

  return c.html(deskPage(member, groups, streak, newCount, own?.handle ?? null, suggestions ?? []));
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
  // The last two counters on this site with no discriminator of any kind, and the ones
  // that decide the reading this loop most wants to make. `attention_star` /
  // `attention_skip` are site-wide: every value they will ever hold today is the owner
  // triaging their own desk, and the *first star by a real member* — the single event
  // that would count as activation — arrives under exactly the same name. That is
  // L-57's shape a third time: nobody doubts good news, so the discriminator has to
  // exist before the news does.
  //
  // Two labels, doing different jobs. `_bot` is the user-agent split every other counter
  // here carries, and this route not carrying it is why that claim was not true.
  // `_owner` is an **axis, not a bucket**: it counts the subset of attention events taken
  // by the owner's own member, regardless of user-agent, and is never summed with the
  // names above, whose totals are unchanged. `attention_star` moving while
  // `attention_star_owner` does not is the first non-owner star.
  //
  // It fails safe in one direction only, so read it with `totals.owner_resolved`: if the
  // owner handle resolves to no human feed the axis never fires, and the owner's own
  // stars then look exactly like a stranger's. Resolution failure is reported by the
  // snapshot rather than inferred from a silent counter.
  const attention = action === "star" ? "attention_star" : "attention_skip";
  track(c, Promise.all([
    count(c.env.DB, `${attention}${botSuffix(c)}`),
    memberActive(c.env.DB, member.id, "action"),
    ownerMemberId(c.env.DB, ownerHandle(c.env.AGENT_OPERATOR_OWNER)).then((ownerId) =>
      ownerId === member.id ? count(c.env.DB, `${attention}_owner`) : undefined
    ),
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
// `qa` began as this loop's own verification traffic, self-labelled so it stays separable
// from any real campaign, and it is what proved the path writes in production before an
// attempt depended on it. It now has a second and more important job — see the control note
// below. `awesome-rss-feeds` is pre-registered for the one candidate channel whose published
// rules do not forbid the post (ops/DISTRIBUTION.md, run 55) — registered here *before* any
// submission because counters start at zero on the deploy that introduces them and nothing is
// backfilled. Registering it authorizes no submission; it only means that if a submission is
// ever authorized, its result would be readable.
//
// **This allowlist is public source in a public repository, and so is every route it applies
// to.** There is therefore no such thing as a private campaign tag for this service: anyone
// reading this line knows every tag that writes, and this loop has no store that is not
// world-readable in which to keep one. That is a structural property of running the loop in
// the open, not a discipline failure, and it means a tagged counter can never be read as
// "arrivals from the channel I gave this tag to" on its own. It needs a control.
//
// **`qa` is that control, and it must stay on this list for that reason.** It is a tag that
// is published in exactly the same public places, at the same cadence, as any real channel
// tag — and is submitted to no venue, ever. Unsuffixed `arrival_fetch:qa` therefore measures
// precisely what a published-but-never-submitted tagged Tuned URL attracts on its own. That
// number is the null any real tag must be read against (EXP-009, Reading 2). Deleting `qa`
// here because it looks like test scaffolding would silently destroy the null, so
// test/arrival.test.ts pins it.
//
// `ooh-directory` is the second real channel tag, registered run 143 for the candidate in
// ops/DISTRIBUTION.md whose A1 was read at run 57. It applies to **this** route — `GET
// /:handle` — and not to `GET /`, because the venue's own form field says *"The URL of the
// blog's front page (not its feed)"* and the blog here is `/sportstech`, not the marketing
// page at `/`. Registering it therefore needs no new instrument: the route has been counted
// since run 48 and only the tag was missing, which is the mirror of run 56's defect (an
// instrumented tag on an uninstrumented route).
//
// Registered *before* any submission, for the reason above the allowlist: counters start at
// zero on the deploy that introduces them and nothing is backfilled, so a tag added after the
// post grades nothing. **Registering it authorizes no submission.** A2 — whether the owner
// may be named as the suggester of an agent-written link blog — is unanswered at this venue,
// and A1 is only PARTIALLY satisfied (the venue admits link blogs that carry "original
// commentary about each link"; Tuned's commentary is written by an agent and labelled as
// such). EXP-012 holds the window, the threshold, the control and the inadmissible outcomes.
const ARRIVAL_TAGS = new Set(["qa", "awesome-rss-feeds", "ooh-directory"]);

// ---------- public feed ----------
/** What a public page may say to the person reading it, beyond what it says to everybody.
 *
 *  Returns `null` — and runs **no query at all** — when the request carries no session cookie,
 *  which is every crawler, every stranger and every preview fetch. That is deliberate and is the
 *  property the tests pin: with no member there is no second variant of a public page, so the
 *  document a search engine is served is byte-for-byte the one it was served yesterday, and there
 *  is nothing for a shared cache to leak. The signed-in variant is the one that carries member
 *  state, so it is the one marked `private, no-store` by the callers below.
 *
 *  One statement answers both questions. `following` decides whether the honest offer is "add" or
 *  "remove"; `own` withholds the offer entirely on a member's own feed, the same exclusion the
 *  desk's suggestion list makes at `GET /today`. */
async function feedViewer(c: Context, creatorId: number): Promise<FeedViewer | null> {
  const member = await currentMember(c);
  if (!member) return null;
  const row = await (c.env.DB as D1Database)
    .prepare(
      `SELECT EXISTS(SELECT 1 FROM follows WHERE member_id = ? AND creator_id = ?) AS following,
              EXISTS(SELECT 1 FROM creators WHERE id = ? AND member_id = ?) AS own`
    )
    .bind(member.id, creatorId, creatorId, member.id)
    .first<{ following: number; own: number }>();
  return { following: !!row?.following, own: !!row?.own };
}

/** A page whose body depends on who asked must never be stored by a cache that does not know who
 *  asked. Nothing in front of this Worker caches HTML today, so this is the header that keeps that
 *  true if something ever does — and it is set only on the variant that carries member state, so
 *  the anonymous response is unchanged in its headers as well as its bytes. */
const PRIVATE_HTML = { "cache-control": "private, no-store" } as const;

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
  const viewer = await feedViewer(c, creator.id);
  return viewer ? c.html(publicPage(creator, items, viewer), 200, PRIVATE_HTML) : c.html(publicPage(creator, items));
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
  // This loop's own automated fetches of this route land in `feed_fetch_bot`, not in the
  // unsuffixed name. **But "the QA schedule" this comment used to invoke does not exist**, and
  // the correction matters: a liveness signal with no scheduler behind it cannot be read the
  // way a silent one was going to be read (L-44).
  //
  // What is actually scheduled: verify-production.yml (06:20 Sydney) and metrics-snapshot.yml
  // (06:40 Sydney), both through scripts/prod-http.sh, whose UA
  // `tuned-ops-verifier/1.0 (+…; first-party uptime and metrics check)` matches BOT_UA on the
  // token `uptime` — not on `headless`, and not from Playwright at all. Each probes exactly one
  // feed: `/ava/rss.xml`. Nothing on a schedule fetches any other handle's RSS.
  //
  // The three headless specs that do fetch every handle — qa/freshness.spec.mjs,
  // qa/public-surfaces.spec.mjs, qa/exp008-provenance.spec.mjs — run only from qa-browser.yml,
  // which is `workflow_dispatch`-only by deliberate design; its own header gives the reason,
  // that recurring headless traffic through production's funnel counters buys no evidence.
  //
  // So `feed_fetch_bot:ava` is a liveness signal, and `feed_fetch_bot:<any other handle>`
  // records how often this loop happened to dispatch a QA spec. A zero day on those names
  // means nobody dispatched one — never, on its own, that the counter is broken.
  //
  // Unsuffixed `feed_fetch:<handle>` was described here, on the deploy that introduced it, as
  // "a genuine background rate of third-party fetchers". **Its first two days of data say
  // otherwise and the description is withdrawn.** UTC 2026-08-19 read 23 over the 13.7 hours
  // the counters were live; UTC 2026-08-20 read 1 in its first 4.1 hours — and on both days
  // *every single one* carried `?src=qa`, a tag whose joined URL this loop had printed in a
  // public GitHub issue hours earlier. It is not a background rate
  // of anything; so far it is one population, and that population arrived because a URL was
  // published, not because a feed was wanted.
  //
  // Nor does `arrival_fetch:<tag>` "grade an attempt because only a link this loop published
  // carries the tag" — that was the other half of the same mistake. Every tag that writes is
  // listed in public source above, next to the public route it applies to; a stranger does not
  // need to receive the link to fetch it. What a tagged counter measures is *fetches of a
  // tagged URL*, from anyone who assembled one. Attributing them to a channel requires the
  // control (`qa`), not the tag.
  //
  // Neither name is demand and neither is a person.
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

// ---------- one find, at an address of its own ----------
//
// Eighty-seven public items existed and **not one of them had a URL**. Every find this service
// has ever published was reachable only *inside* a feed page that changes under it, and the
// consequences are three different failures wearing one face:
//
//   1. nothing Tuned publishes is indexable. `sitemap.xml` carried EIGHT URLs — the landing page,
//      five feeds, terms, privacy — against eighty-seven published finds. Search is the one
//      arrival channel that needs no venue's permission, no owner action and no spend, and this
//      service was offering it eight documents.
//   2. nothing Tuned publishes is shareable. A visitor who wanted to send someone *this find*
//      could send only the feed, which will be a different page tomorrow. Referral is item 5 of
//      the commercial hierarchy and the product had no unit to refer.
//   3. no arrival could be attributed to a find. `feed_view:<handle>` says a feed was looked at;
//      nothing said which piece of attention brought somebody.
//
// EXP-007 graded Fork A — the landing figure does not describe people, and **arrival** is the
// bottleneck, not conversion. Both named distribution candidates have been owner-blocked for
// twenty runs. This is the arrival lever that is not: it is entirely on Tuned-owned surfaces.
//
// Registered AFTER `/:handle/rss.xml` so that route keeps its literal match, and the id is
// required to be digits — a non-numeric second segment 404s exactly as it did before this route
// existed, so no previously-404ing address starts answering.
//
// Only `visibility = 'public'` rows get an address, and the row must belong to the handle in the
// path. A hidden item is a veto and a queued one is awaiting approval; neither is published, and
// an address is publication. Requiring the pair also means one item has exactly one URL — the
// same row reached through another feed's handle is a 404, not a duplicate document.
//
//   item_view[_bot]              a find page was requested. Bucket; the two are the total.
//   item_view[_bot]:<handle>     the same event split by feed, exactly as feed_view:<handle>
//                                splits a feed view. Not additive with the site-wide name.
//   arrival_item[_bot]:<tag>     a DELIBERATELY separate family from `arrival:<tag>`. EXP-010
//                                and EXP-012 are pre-registered over `arrival:<tag>` as *feed*
//                                views; writing item views into that name would change what a
//                                running experiment's counter means mid-window.
//   item_view_onsite             axis: the subset whose `Referer` is this site. NOT a bucket,
//                                never summed with the names above, whose totals are unchanged.
//
// `item_view_onsite` exists because run 165 gave every feed-page card a permalink into this
// surface, and that link would otherwise have quietly broken the reading run 164 registered over
// these counters: *"`item_view` moving without `_bot` is the first shared link."* It was true
// while the only way in was a sitemap, a search result or a pasted URL — every one of them
// off-site. It stops being true the moment somebody can arrive here by clicking around inside
// Tuned, and the owner is the one member who does that. Splitting the referrer keeps the
// off-site reading computable as `item_view - item_view_onsite` instead of losing it.
//
// Evidence, not proof, in both directions, on the same terms as `_offpage` and `_unattended`: a
// browser may send no `Referer` at all (`rel=noreferrer`, a privacy setting, a downgrade from
// https to http), and such a click from our own feed lands off-axis and reads as external. It
// can therefore under-count internal arrivals and cannot invent one — which is the safe
// direction, since the error works against the interesting claim rather than for it.
//
// `item_render` is the rung under all of them and is emitted by the page itself — see FIND_JS in
// pages.ts, which is a different script from the one feed pages get, so this surface cannot fire
// `feed_render` by construction.
app.get("/:handle/:id", async (c) => {
  const handle = c.req.param("handle").toLowerCase();
  const id = c.req.param("id");
  // Canonical form only, and the leading zero is the reason this is not simply `\d+`. `Number`
  // coerces "042", "4.2e1", " 42" and "0x2a" all to 42, so any of them would serve item 42 at a
  // *second* address — the same duplicate-URL defect the creator_id match exists to prevent,
  // arriving through the id instead of the handle. Row ids are AUTOINCREMENT and start at 1, so
  // no canonical id ever begins with a zero.
  if (RESERVED_HANDLES.has(handle) || !/^[1-9][0-9]{0,14}$/.test(id)) return c.notFound();
  const creator = await c.env.DB.prepare("SELECT id, handle, name, bio, avatar_url, accent, kind, created_at FROM creators WHERE handle = ?")
    .bind(handle)
    .first<Creator>();
  if (!creator) return c.text("No such feed", 404);
  const item = await c.env.DB.prepare(
    `SELECT i.*, v.handle AS via_handle FROM items i LEFT JOIN creators v ON v.id = i.via_creator_id
      WHERE i.id = ? AND i.creator_id = ? AND i.visibility = 'public'`
  )
    .bind(Number(id), creator.id)
    .first<Item>();
  if (!item) return c.text("No such find", 404);
  const suffix = isBot(c.req.header("user-agent") ?? "") ? "_bot" : "";
  const src = c.req.query("src") ?? "";
  track(
    c,
    countEach(c.env.DB, [
      `item_view${suffix}`,
      `item_view${suffix}:${creator.handle}`,
      ARRIVAL_TAGS.has(src) ? `arrival_item${suffix}:${src}` : "",
      onsite(c) ? "item_view_onsite" : "",
    ])
  );
  // The inbound links that stop eighty-seven sitemap entries from being eighty-seven orphans.
  const { results: more } = await c.env.DB.prepare(
    `SELECT i.*, v.handle AS via_handle FROM items i LEFT JOIN creators v ON v.id = i.via_creator_id
      WHERE i.creator_id = ? AND i.visibility = 'public' AND i.id != ?
      ORDER BY i.created_at DESC LIMIT 4`
  )
    .bind(creator.id, Number(id))
    .all<Item>();
  const viewer = await feedViewer(c, creator.id);
  return viewer
    ? c.html(itemPage(creator, item, more, viewer), 200, PRIVATE_HTML)
    : c.html(itemPage(creator, item, more));
});

// The one conversion action on a public feed page, and until now it wrote no counter at all.
//
// That is a different defect from the one runs 141–144 closed. Those counters existed and could
// not say *who* wrote them; this route had nothing to discriminate. `totals.followers` moving
// was the only trace a follow ever left, and a total that does not move has four explanations
// this route could not tell apart: nobody tried, someone tried and the address was rejected,
// someone tried who was already following, or the request never reached here at all.
//
// It matters now rather than generally. Both remaining distribution candidates in
// ops/DISTRIBUTION.md point at a feed page — ooh.directory at `/sportstech` (EXP-012),
// awesome-rss-feeds at its RSS URL — and `feed_view:sportstech` has read 37 unsuffixed views
// over 21 days against `followers` 0. A5 asks "if it works, would I see it?": the arrival was
// instrumented at run 143 and the thing the arrival is *for* was not. Counters do not backfill,
// so this can only be built before a listing lands.
//
// The names, and which of them are buckets and which are axes:
//
//   follow_submit[_bot]             an accepted follow. Bucket; the two are the total.
//   follow_submit[_bot]:<handle>    the same event split by destination, exactly as
//                                   feed_view:<handle> splits a view. Not additive with the
//                                   site-wide name above — it is the same event, twice.
//   follow_submit_offpage           axis: the subset arriving without this site's Origin.
//   follow_invalid[_bot]            rejected by email validation. Not part of follow_submit,
//                                   the same way application_invalid is not part of
//                                   application_submit.
//   follow_invalid_offpage          axis, as above.
//   follow_submit_find              axis: the subset that came from a find page's follow dialog
//   follow_invalid_find             rather than a feed page's. Added when /<handle>/<id> gained
//                                   a follow block of its own — without it, a follow from the
//                                   surface this site is indexed and shared as would land in a
//                                   name published as "an accepted follow on a feed page", and
//                                   the first real one would be read as coming from somewhere
//                                   it did not. The dialog sends `from: "find"`; the feed page
//                                   sends no such field, so every follow recorded before this
//                                   run keeps the meaning it was written with.
//   follow_duplicate                axis: the subset of accepted follows that changed nothing
//                                   because that address already followed this feed. It is the
//                                   name that makes `totals.followers` readable — a day with
//                                   follow_submit 3 and follow_duplicate 3 moved the total by
//                                   zero, and without this counter that is indistinguishable
//                                   from a day nobody tried.
//
// An axis is never summed into the buckets and is not itself split by user-agent, which is the
// convention application_submit_offpage set at run 141: it counts a subset of the unsuffixed
// *and* _bot names together.
//
// This route classifies and never refuses, for the reason run 141 gave about /waitlist and run
// 142 gave about /enter: `followers` is 0, and one real person turned away by a discriminator
// costs more than every mislabelled follow combined. An offpage follow is stored.
app.post("/:handle/follow", async (c) => {
  const creator = await c.env.DB.prepare("SELECT id, handle FROM creators WHERE handle = ?")
    .bind(c.req.param("handle").toLowerCase())
    .first<{ id: number; handle: string }>();
  if (!creator) return c.json({ error: "no such feed" }, 404);
  const suffix = isBot(c.req.header("user-agent") ?? "") ? "_bot" : "";
  const offpage = c.req.header("origin") !== new URL(c.req.url).origin;
  // Which surface sent it. The find page's dialog posts `from: "find"`; the feed page's posts no
  // such field, so absence means the feed page and every follow recorded before this run keeps
  // the meaning it was written with. An axis and not a bucket, on the same terms as `_offpage`:
  // `follow_submit` and `follow_submit_bot` are still the total and are never reduced by it. It
  // is a string in a request body, so it is evidence and not proof — forgeable exactly as far as
  // the `_bot` split is, and never a reason to refuse a follow. This route classifies; it does
  // not gatekeep.
  const { email, from } = await c.req.json<{ email?: string; from?: string }>();
  const fromFind = from === "find";
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) {
    track(
      c,
      countEach(c.env.DB, [
        `follow_invalid${suffix}`,
        offpage ? "follow_invalid_offpage" : "",
        fromFind ? "follow_invalid_find" : "",
      ])
    );
    return c.json({ error: "invalid email" }, 400);
  }
  // `changes` is what separates a new follower from a repeat: INSERT OR IGNORE reports 0 when
  // the (creator_id, email) row already existed. `wroteNewRow` carries the asymmetric default
  // and the reason for it — an unknown result must never be reported as a repeat, because that
  // is the direction in which a real first follower disappears.
  const written = await c.env.DB.prepare("INSERT OR IGNORE INTO followers (creator_id, email) VALUES (?, ?)")
    .bind(creator.id, email.toLowerCase())
    .run();
  const duplicate = !wroteNewRow(written.meta);
  track(
    c,
    countEach(c.env.DB, [
      `follow_submit${suffix}`,
      `follow_submit${suffix}:${creator.handle}`,
      offpage ? "follow_submit_offpage" : "",
      fromFind ? "follow_submit_find" : "",
      duplicate ? "follow_duplicate" : "",
    ])
  );
  return c.json({ ok: true });
});

// Put a feed on your desk, or take it off again.
//
// Until this route existed, `follows` — the sole source of everything `/today` renders — had
// exactly one writer in all of src/: the auto-follow in GET /today, which selects
// `creators WHERE member_id = ? AND kind = 'agent'`. That is the agents a member *already owns*.
// A member admitted through the front door owns nothing, so the set is empty, the desk is empty,
// and there was no action anywhere on this site that could add a row. The Follow button on a
// public feed page writes to `followers`, which is a different table holding an email address for
// a digest with no sender; it never touched the desk. So the product's one activation surface was
// unreachable for everybody except the owner, whose desk works only because he owns the agents.
//
// A form and not a fetch, deliberately. The desk's offer is a real `<form method="post">` with a
// real action, so it works with no JavaScript, it is what the member's browser actually submits,
// and the endpoint is readable straight off the page — which is what lets `test/activation.test.ts`
// grade the offer the member is shown rather than a path the test hard-codes. That is also why the
// body is parsed as form encoding and nothing else: this route has one caller and it is a form.
//
// It classifies and never refuses, on the same terms as every other counter here: `desk_follow`
// and `desk_unfollow` carry the usual `_bot` split, and `desk_follow_duplicate` is an axis over
// the follow names — the subset that changed nothing because the row was already there — never
// summed into them. `wroteNewRow` carries the asymmetric default, so an unreported write result
// counts as new rather than as a repeat and a real first follow can never disappear into the axis.
app.post("/:handle/desk", async (c) => {
  const member = await currentMember(c);
  // A form post, so send them where a form post should go when the session is gone: the sign-in
  // page, rather than a JSON error their browser would render as text.
  if (!member) return c.redirect("/login", 303);
  const creator = await c.env.DB.prepare("SELECT id, handle FROM creators WHERE handle = ?")
    .bind(c.req.param("handle").toLowerCase())
    .first<{ id: number; handle: string }>();
  if (!creator) return c.json({ error: "no such feed" }, 404);

  const form = new URLSearchParams(await c.req.text().catch(() => ""));
  const suffix = botSuffix(c);
  // Which surface made the offer the member took. An axis on the same terms as
  // `follow_submit_find`: counted across the unsuffixed and `_bot` names together, never summed
  // into either, and read as evidence rather than proof, because it is a string in a request body.
  // The desk's own offer at `/today` sends no `from` field, so absence means the desk — which is
  // where every follow recorded before this run came from, and keeps their meaning unchanged.
  //
  // It exists because there are now three places a member can subscribe to a feed and only one
  // reading that matters: which of them a member actually uses. A single `desk_follow` cannot
  // separate "the desk's list works" from "people follow feeds where they read them", and those
  // two answers point at different next changes.
  const from = form.get("from");
  const origin = from === "feed" || from === "find" ? `desk_follow_${from}` : "";

  if (form.get("remove") === "1") {
    await c.env.DB.prepare("DELETE FROM follows WHERE member_id = ? AND creator_id = ?")
      .bind(member.id, creator.id)
      .run();
    track(c, count(c.env.DB, `desk_unfollow${suffix}`));
    return c.redirect("/today", 303);
  }

  const written = await c.env.DB.prepare("INSERT OR IGNORE INTO follows (member_id, creator_id) VALUES (?, ?)")
    .bind(member.id, creator.id)
    .run();
  track(
    c,
    countEach(c.env.DB, [
      `desk_follow${suffix}`,
      wroteNewRow(written.meta) ? "" : "desk_follow_duplicate",
      origin,
    ])
  );
  return c.redirect("/today", 303);
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
