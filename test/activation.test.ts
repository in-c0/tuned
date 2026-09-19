// One stranger, from the landing form to a star — the whole funnel, in one pass, with no state
// seeded between stages.
//
// Every stage of this journey already had a test. `applications.test.ts` covers the waitlist read,
// `operator.test.ts` covers provisioning, `pulse.test.ts` covers `/enter/:token`, `attention.test.ts`
// covers `/read/:id`. All of them pass, and all of them hand-seed the state their stage consumes —
// `applications.test.ts` inserts into `waitlist` with SQL rather than posting to `/waitlist`,
// `pulse.test.ts` inserts a member with a known `session_token` rather than asking
// `POST /api/members` for one. A stage that seeds its own input cannot see the seam above it, and
// every defect this loop has found for a week has been in a seam.
//
// So the rule here, and it is the only thing that makes this file worth having: **each stage may
// use only what the previous stage returned.** The email posted to `/waitlist` is the email read
// back from `/api/applications` and the email handed to `/api/members`; the sign-in URL is the one
// `/api/members` returned; the cookie is the one `/enter/:token` set; the endpoint that puts a feed
// on the desk is the one the desk page itself offers. Nothing is passed around this file by hand.
//
// What that exposed, on the first run against unmodified source: **the desk cannot be populated.**
// `follows` is the sole source of what `/today` renders, and in all of `src/` it has exactly one
// writer —
//
//     INSERT OR IGNORE INTO follows (member_id, creator_id)
//       SELECT ?, id FROM creators WHERE member_id = ? AND kind = 'agent'
//
// — which auto-follows the agents a member *already owns*. A member admitted through the front
// door owns nothing, so the set is empty, so the desk is empty, and no action anywhere on the site
// inserts another row. The public feed page's Follow button writes to `followers`, a different
// table, holding an email address for a digest that has no sender. The desk's own empty state told
// the member to "follow more feeds" — a verb with no implementation.
//
// That is why the assertion below is written as an outcome and not as a presence check. It does not
// look for a button. It reads the endpoint the desk offers, calls it, and requires the next desk to
// carry the find. A page that offers nothing fails at the read; a page that offers something broken
// fails at the call; a page that offers something real passes only if the desk actually changes.
// Grading the precondition instead of the outcome is exactly how 95 URLs got crawled and none
// indexed (L-92), and this is that lesson applied to activation.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";

const DB = env.DB as D1Database;
const ADMIN_KEY = "test-admin-key";
const ORIGIN = "https://justtuned.com";

// A browser navigation a person actually caused. `/enter/:token` and `/today` both classify on
// these two headers, and a journey that arrived without them would be counted unattended — which
// is correct behaviour and would make this file's own traffic read like a mail-gateway prefetch.
const CLICKED = { "user-agent": "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120", "sec-fetch-user": "?1" };

beforeAll(async () => {
  const statements = schemaSql
    .split("\n")
    .map((line) => line.replace(/--.*$/, ""))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const sql of statements) await DB.prepare(sql).run();
});

/** The platform as a stranger finds it: a feed that is not theirs, carrying a public find. This is
 *  world state and not journey state — it is what already exists on the site before anybody
 *  applies, and it is the only thing in this file inserted with SQL. */
const FEED = "scout";
let publicItemId = 0;

beforeEach(async () => {
  await DB.batch([
    DB.prepare("DELETE FROM reads"),
    DB.prepare("DELETE FROM follows"),
    DB.prepare("DELETE FROM items"),
    DB.prepare("DELETE FROM creators"),
    DB.prepare("DELETE FROM members"),
    DB.prepare("DELETE FROM waitlist"),
    DB.prepare("DELETE FROM member_days"),
    DB.prepare("DELETE FROM metric_days"),
  ]);
  const creator = await DB.prepare(
    "INSERT INTO creators (handle, name, token, kind, created_at) VALUES (?, ?, ?, 'agent', ?) RETURNING id"
  )
    .bind(FEED, "Scout", `tok-${FEED}`, new Date().toISOString())
    .first<{ id: number }>();
  const item = await DB.prepare(
    `INSERT INTO items (creator_id, url, title, description, image_url, site_name, domain, category, note, visibility, via_creator_id, created_at)
     VALUES (?, 'https://example.com/the-find', 'The find on the desk', '', '', '', 'example.com', 'Misc', '', 'public', NULL, ?) RETURNING id`
  )
    .bind(creator!.id, new Date().toISOString())
    .first<{ id: number }>();
  publicItemId = item!.id;
});

async function call(path: string, init: RequestInit = {}): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`${ORIGIN}${path}`, init), { ...env, ADMIN_KEY } as never, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

/* ---------- the journey ---------- */

/** Stage 1 — the landing form. Returns the address as the applicant typed it. */
async function applies(email: string): Promise<string> {
  const res = await call("/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json", origin: ORIGIN, ...CLICKED },
    body: JSON.stringify({ email, role: "fan", note: "found you somewhere" }),
  });
  expect(res.status, "POST /waitlist did not accept a valid application").toBe(200);
  return email;
}

/** Stage 2 — the operator reads the queue. Returns the address *as the queue reports it*, which is
 *  the value the next stage is entitled to use. `/waitlist` lowercases on insert, so an applicant
 *  who typed capitals is admitted by whatever this returns and never by what they typed. */
async function readBackFromQueue(applied: string): Promise<string> {
  const res = await call("/api/applications", { headers: { "x-admin-key": ADMIN_KEY } });
  expect(res.status).toBe(200);
  const body = await res.json<{
    pending: number;
    applications: { email: string; admitted: boolean }[];
  }>();
  const row = body.applications.find((a) => a.email.toLowerCase() === applied.toLowerCase());
  expect(row, `the application for ${applied} is not readable at /api/applications`).toBeTruthy();
  expect(row!.admitted, "a brand-new application is already marked admitted").toBe(false);
  expect(body.pending).toBeGreaterThan(0);
  return row!.email;
}

/** Stage 3 — admission. The one manual act in this funnel, and the only route that returns a
 *  sign-in link. Returns that link, and nothing else is taken from this stage. */
async function admits(email: string): Promise<string> {
  const res = await call("/api/members", {
    method: "POST",
    headers: { "content-type": "application/json", "x-admin-key": ADMIN_KEY },
    body: JSON.stringify({ email, name: "A Stranger" }),
  });
  expect(res.status, "POST /api/members did not admit the address /api/applications returned").toBe(201);
  const body = await res.json<{ login_url?: string }>();
  expect(body.login_url, "admission returned no sign-in link").toBeTruthy();
  return body.login_url!;
}

/** Stage 4 — the member opens the link they were handed. Returns the session cookie the Worker set,
 *  which is the only credential the rest of the journey has. */
async function signsIn(loginUrl: string): Promise<string> {
  const path = new URL(loginUrl).pathname;
  const res = await call(path, { headers: CLICKED, redirect: "manual" });
  expect(res.status, `the sign-in link ${path} did not grant a session`).toBe(302);
  expect(res.headers.get("location")).toBe("/today");
  const setCookie = res.headers.get("set-cookie") ?? "";
  const cookie = setCookie.split(";")[0];
  expect(cookie, "the sign-in link set no session cookie").toMatch(/^tuned_session=.+/);
  return cookie;
}

/** Stage 5 — the desk. */
async function desk(cookie: string): Promise<string> {
  const res = await call("/today", { headers: { cookie, ...CLICKED } });
  expect(res.status, "a signed-in member was not served their desk").toBe(200);
  return await res.text();
}

/** The endpoints the desk itself offers for putting a feed on it. Read off the page rather than
 *  written here: what is being graded is the offer the member is actually shown, so a desk that
 *  offers nothing has to fail at this line and not quietly pass a weaker assertion. */
function offersOnDesk(html: string): string[] {
  const out: string[] = [];
  const re = /<form[^>]*\bmethod=["']post["'][^>]*\baction=["']([^"']*\/desk)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) out.push(m[1]);
  // Attribute order is not guaranteed by anything, so try the other one too before concluding the
  // page offers nothing — a false red here would be this file failing on its own parse.
  const alt = /<form[^>]*\baction=["']([^"']*\/desk)["'][^>]*\bmethod=["']post["']/gi;
  while ((m = alt.exec(html))) if (!out.includes(m[1])) out.push(m[1]);
  return out;
}

describe("a stranger becomes an activated member", () => {
  it("walks the whole funnel, and the desk they land on can be filled", async () => {
    const typed = "Stranger@Example.com";

    const applied = await applies(typed);
    const queued = await readBackFromQueue(applied);
    const loginUrl = await admits(queued);
    const cookie = await signsIn(loginUrl);

    // The desk as admitted: nothing followed, nothing to read. That part is expected and is not
    // the defect — a new member has followed nothing yet. The defect is what happens next.
    const empty = await desk(cookie);
    expect(empty).not.toContain("The find on the desk");

    // What the member is offered at the moment they are stuck. This is the assertion that was red:
    // the desk offered no way at all to put a feed on itself.
    const offers = offersOnDesk(empty);
    expect(
      offers,
      "an empty desk offers the member no way to put a feed on it — the one screen every admitted member lands on is a dead end"
    ).not.toEqual([]);
    expect(offers.some((a) => a.includes(FEED)), `the desk offers no route to the public feed @${FEED}`).toBe(true);

    // Take the offer, exactly as the page makes it.
    const endpoint = offers.find((a) => a.includes(FEED))!;
    const added = await call(endpoint, {
      method: "POST",
      headers: { cookie, origin: ORIGIN, "content-type": "application/x-www-form-urlencoded", ...CLICKED },
      body: "",
      redirect: "manual",
    });
    expect([200, 302, 303]).toContain(added.status);

    // The outcome, which is the only thing that settles it.
    const filled = await desk(cookie);
    expect(
      filled,
      "the desk still does not carry the find after the member took the only action it offered"
    ).toContain("The find on the desk");

    // And attention can be paid on it — the event this loop calls activation.
    const star = await call(`/read/${publicItemId}`, {
      method: "POST",
      headers: { cookie, "content-type": "application/json", origin: ORIGIN, ...CLICKED },
      body: JSON.stringify({ action: "star" }),
    });
    expect(star.status, "a member could not star a find on their own desk").toBe(200);

    const read = await DB.prepare("SELECT action FROM reads").first<{ action: string }>();
    expect(read?.action).toBe("star");
  });

  // `retention.members_ever_active` is computed from `member_days`, and it has read 0 for the whole
  // window. This pins what it takes to move it honestly: a member who came through the front door,
  // signed in, and did something.
  it("records the member as active, from a journey that seeded no member row", async () => {
    const cookie = await signsIn(await admits(await readBackFromQueue(await applies("active@example.com"))));
    await desk(cookie);
    const days = await DB.prepare("SELECT COUNT(*) AS n FROM member_days").first<{ n: number }>();
    expect(days?.n ?? 0).toBeGreaterThan(0);
  });
});

describe("putting a feed on a desk", () => {
  async function member(): Promise<string> {
    return await signsIn(await admits(await readBackFromQueue(await applies("member@example.com"))));
  }

  it("refuses an unauthenticated caller rather than following anything", async () => {
    const res = await call(`/${FEED}/desk`, { method: "POST", headers: { origin: ORIGIN }, redirect: "manual" });
    expect([302, 303, 401]).toContain(res.status);
    const rows = await DB.prepare("SELECT COUNT(*) AS n FROM follows").first<{ n: number }>();
    expect(rows?.n ?? 0).toBe(0);
  });

  it("404s an unknown handle", async () => {
    const cookie = await member();
    const res = await call("/no-such-feed/desk", {
      method: "POST",
      headers: { cookie, origin: ORIGIN },
      redirect: "manual",
    });
    expect(res.status).toBe(404);
  });

  it("is idempotent — following twice leaves one row", async () => {
    const cookie = await member();
    const once = { method: "POST", headers: { cookie, origin: ORIGIN }, redirect: "manual" as const };
    await call(`/${FEED}/desk`, once);
    await call(`/${FEED}/desk`, once);
    const rows = await DB.prepare("SELECT COUNT(*) AS n FROM follows").first<{ n: number }>();
    expect(rows?.n).toBe(1);
  });

  // A one-way door is its own defect: a desk you can add to and never subtract from stops being a
  // desk the member steers. Removal is the same route, and it has to be reachable from the page
  // that shows the feed as followed.
  it("removes a feed again, and the desk offers the way to do it", async () => {
    const cookie = await member();
    await call(`/${FEED}/desk`, { method: "POST", headers: { cookie, origin: ORIGIN }, redirect: "manual" });
    const filled = await desk(cookie);
    expect(filled).toContain("The find on the desk");

    expect(
      /<form[^>]*\/desk["'][^>]*>[\s\S]{0,400}?name=["']remove["']/i.test(filled) ||
        /name=["']remove["'][\s\S]{0,400}?<\/form>/i.test(filled),
      "a followed feed on the desk offers no way to take it off again"
    ).toBe(true);

    const res = await call(`/${FEED}/desk`, {
      method: "POST",
      headers: { cookie, origin: ORIGIN, "content-type": "application/x-www-form-urlencoded" },
      body: "remove=1",
      redirect: "manual",
    });
    expect([200, 302, 303]).toContain(res.status);
    const rows = await DB.prepare("SELECT COUNT(*) AS n FROM follows").first<{ n: number }>();
    expect(rows?.n ?? 0).toBe(0);
  });

  // The `_bot` split applies here exactly as it does on every other counter, which is worth one
  // assertion rather than a comment: a request with no user-agent lands in `desk_follow_bot`, so a
  // reading taken off the unsuffixed name is a reading about clients that looked like a browser.
  it("counts the follow, and counts a repeat as a repeat", async () => {
    const cookie = await member();
    const once = {
      method: "POST",
      headers: { cookie, origin: ORIGIN, ...CLICKED },
      redirect: "manual" as const,
    };
    await call(`/${FEED}/desk`, once);
    await call(`/${FEED}/desk`, once);
    await call(`/${FEED}/desk`, { method: "POST", headers: { cookie, origin: ORIGIN }, redirect: "manual" });

    const { results } = await DB.prepare("SELECT name, count FROM metric_days").all<{ name: string; count: number }>();
    const byName = Object.fromEntries(results.map((r) => [r.name, r.count]));
    expect(byName["desk_follow"] ?? 0).toBe(2);
    expect(byName["desk_follow_bot"] ?? 0).toBe(1);
    // An axis, not a bucket: the two repeats are counted here *and* remain inside the totals above.
    expect(byName["desk_follow_duplicate"] ?? 0).toBe(2);
  });

  // The owner is the only member who owns feeds, so a desk that offered every public feed would
  // offer him himself. Following your own feed is not following someone's attention.
  it("does not offer a member their own feed", async () => {
    const cookie = await member();
    const me = await DB.prepare("SELECT id FROM members WHERE email = 'member@example.com'").first<{ id: number }>();
    const mine = await DB.prepare(
      "INSERT INTO creators (handle, name, token, kind, member_id) VALUES ('mine', 'Mine', 'tok-mine', 'human', ?) RETURNING id"
    ).bind(me!.id).first<{ id: number }>();
    await DB.prepare(
      `INSERT INTO items (creator_id, url, title, description, image_url, site_name, domain, category, note, visibility, via_creator_id, created_at)
       VALUES (?, 'https://example.com/mine', 'My own find', '', '', '', 'example.com', 'Misc', '', 'public', NULL, ?)`
    ).bind(mine!.id, new Date().toISOString()).run();

    const html = await desk(cookie);
    const offered = offersOnDesk(html);
    expect(offered.some((a) => a.includes(FEED)), "the public feed stopped being offered").toBe(true);
    expect(offered.some((a) => a.includes("mine")), "the desk offers the member their own feed").toBe(false);
  });

  it("counts a removal under its own name", async () => {
    const cookie = await member();
    const headers = { cookie, origin: ORIGIN, "content-type": "application/x-www-form-urlencoded", ...CLICKED };
    await call(`/${FEED}/desk`, { method: "POST", headers, redirect: "manual" });
    await call(`/${FEED}/desk`, { method: "POST", headers, body: "remove=1", redirect: "manual" });
    const row = await DB.prepare("SELECT count FROM metric_days WHERE name = 'desk_unfollow'").first<{ count: number }>();
    expect(row?.count).toBe(1);
  });
});
