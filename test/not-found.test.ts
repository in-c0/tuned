// What a stranger is shown at an address this site has nothing at — and why that is a public
// surface rather than an error path.
//
// THE PATH THAT MAKES IT ONE. `rssFeed` puts "Provenance on Tuned →" into every item's
// description, pointing at `/:handle/:id`. A feed reader keeps that description forever, and
// `retract` (src/operator.ts) — the rollback the operating record's deployment gates require for
// a publication — works by setting `visibility='hidden'`, at which point that route stops
// resolving. So a correctly reversed publication turns every already-delivered link, and every
// search result pointing at it from a sitemap this service published itself, into this response.
// It was `c.text("No such find", 404)`: twelve bytes, no navigation, no way back to the feed the
// reader had subscribed to. The rollback was sound on the feed and stranded the only kind of
// visitor this funnel can currently produce.
//
// GRADED AS A CLASS OVER A DERIVED SET, per L-107. The addresses under test are built by
// mutating the paths this service advertises in its OWN `/sitemap.xml` — a feed handle that does
// not exist, an id past every row — so a page class registered later is graded without being
// named here. Nothing in the list below is typed.
//
// THE THREE PROPERTIES, and the reason each is separate:
//
//   1. IT IS A PAGE. `text/html`, and it carries a way back to `/`. A dead end is the defect;
//      "the status was right" was already true before this change.
//   2. IT IS STILL A 404, AND IT IS NOT INDEXABLE. An HTML body on a 200 is a soft 404 — worse
//      than the plain text it replaces, because it also asks to be indexed. The status is
//      asserted, `robots: noindex` is asserted, and the ABSENCE of a self-referential canonical
//      and `og:url` is asserted: every other public page here declares one, and one on this page
//      would be this site asking a crawler to index an address it just said has nothing at it.
//   3. THE MACHINE HALF STAYS MACHINE-SHAPED. A missing feed's `rss.xml` is read by a feed
//      client and an `/api/` path by a script; neither is answered with a page. The split under
//      test is the surface, not the status — the same distinction L-110 turns on.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";

const DB = env.DB as D1Database;

beforeAll(async () => {
  const statements = schemaSql
    .split("\n")
    .map((line) => line.replace(/--.*$/, ""))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const sql of statements) {
    await DB.prepare(sql).run();
  }
});

beforeEach(async () => {
  await DB.batch([DB.prepare("DELETE FROM items"), DB.prepare("DELETE FROM creators")]);
});

const ago = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString();

async function get(path: string): Promise<{ status: number; type: string; body: string }> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`https://justtuned.com${path}`), env as any, ctx);
  await waitOnExecutionContext(ctx);
  return { status: res.status, type: res.headers.get("content-type") ?? "", body: await res.text() };
}

async function creator(handle: string, kind = "agent"): Promise<number> {
  const row = await DB.prepare(
    "INSERT INTO creators (handle, name, token, kind, accent, created_at) VALUES (?, ?, ?, ?, '#7c6cff', ?) RETURNING id"
  )
    .bind(handle, handle, `tok-${handle}`, kind, ago(2000))
    .first<{ id: number }>();
  return row!.id;
}

async function published(creatorId: number, title: string, hours = 3): Promise<number> {
  const row = await DB.prepare(
    `INSERT INTO items (creator_id, url, title, domain, site_name, kind, category, note, visibility, created_at)
     VALUES (?, ?, ?, 'doi.org', 'MDPI Sports', 'article', 'Research', ?, 'public', ?) RETURNING id`
  )
    .bind(creatorId, `https://doi.org/10.3390/x${title.length}`, title, "A measured result.", ago(hours))
    .first<{ id: number }>();
  return row!.id;
}

/** Every `<loc>` the service advertises, as paths. Derived, never typed. */
async function advertisedPaths(): Promise<string[]> {
  const { body } = await get("/sitemap.xml");
  return [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

/** A sibling address of the same shape that this service has nothing at. */
function absentSibling(path: string): string {
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 2 && /^[0-9]+$/.test(parts[1])) return `/${parts[0]}/99${parts[1]}0`;
  if (parts.length === 1) return `/${parts[0]}-not-a-feed`;
  return "";
}

function assertIsAPageAndStillA404(path: string, r: { status: number; type: string; body: string }) {
  expect(r.status, `${path} status`).toBe(404);
  expect(r.type, `${path} content-type`).toMatch(/text\/html/);
  // The way back. A dead end is the defect under test, so this is the assertion that fails if the
  // page is reintroduced as a bare sentence.
  expect(r.body, `${path} offers the way back`).toMatch(/href="\/"/);
  expect(r.body, `${path} noindex`).toMatch(/<meta name="robots" content="noindex">/);
  // Nothing on this page may ask for it to be indexed or shared as content.
  expect(r.body, `${path} has no canonical`).not.toMatch(/rel="canonical"/);
  expect(r.body, `${path} has no og:url`).not.toMatch(/property="og:url"/);
}

it("every address this service advertises has an absent sibling that answers as a page, not as twelve bytes", async () => {
  const sports = await creator("sportstech");
  await published(sports, "Unilateral numbers need context");
  await published(sports, "IMU splits agree with timing gates", 40);
  const wear = await creator("wearables");
  await published(wear, "An older find", 52 * 24);

  const targets = [...new Set((await advertisedPaths()).map(absentSibling).filter(Boolean))];
  // The derivation itself is graded: a sitemap this test could not read would make every
  // assertion below vacuous, which is exactly how a class check passes by checking nothing.
  expect(targets.length, "absent siblings derived from /sitemap.xml").toBeGreaterThanOrEqual(3);

  for (const path of targets) {
    assertIsAPageAndStillA404(path, await get(path));
  }
});

it("a withdrawn find's own address answers as a page and offers the feed the reader subscribed to", async () => {
  const sports = await creator("sportstech");
  const id = await published(sports, "Unilateral numbers need context");

  // The link an RSS reader is holding, taken off the feed document rather than assembled here.
  const rss = await get("/sportstech/rss.xml");
  const link = [...rss.body.matchAll(/https:\/\/justtuned\.com(\/sportstech\/\d+)/g)].map((m) => m[1]);
  expect(link, "the RSS item carries a provenance link").toContain(`/sportstech/${id}`);
  expect((await get(`/sportstech/${id}`)).status, "published find resolves").toBe(200);

  // Exactly what `retract` does — src/operator.ts sets visibility, it does not delete the row.
  await DB.prepare("UPDATE items SET visibility = 'hidden' WHERE id = ?").bind(id).run();

  const r = await get(`/sportstech/${id}`);
  assertIsAPageAndStillA404(`/sportstech/${id}`, r);
  expect(r.body, "names the feed this find belonged to").toMatch(/href="\/sportstech"/);
  // It may not say which of the three reasons applies: never existed, agent retracted, owner
  // vetoed. Asserting the disjunction keeps a later run from narrowing it into a claim about a
  // human's act.
  expect(r.body).toMatch(/never here, or it has since been withdrawn/);
});

it("the surfaces a machine asked for keep a machine-shaped body", async () => {
  await creator("sportstech");
  for (const path of ["/nosuch/rss.xml", "/api/not-a-route", "/studio/nope/manifest.webmanifest"]) {
    const r = await get(path);
    expect(r.status, `${path} status`).toBe(404);
    expect(r.type, `${path} content-type`).not.toMatch(/text\/html/);
  }
});
