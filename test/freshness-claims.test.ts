// The freshness claims a stranger is shown about a *specific* feed, made executable.
//
// Run 182 derived the age on every card of the landing page. What it did not reach is the pair of
// surfaces that carry one feed OFF this site, and both of them were still asserting currency as a
// constant:
//
//   * `rssFeed`'s `<channel><description>` — "What X is paying attention to **right now**." This is
//     the string a reader shows in its sidebar and a directory reproduces in its listing, and it is
//     the document the submissions in ops/DISTRIBUTION.md point at. It is the only subscription
//     this funnel can currently complete.
//   * `publicPage`'s `<meta name="description">` / Open Graph description — "a **live** feed of what
//     X is watching…" — what a search result and every unfurled card show.
//
// On the per-feed reading run 182 took off production, four of the five feeds serving both strings
// had published nothing for 50-53 days. The claim was false on 4 of 5 feeds, on the two surfaces a
// stranger meets a feed through, and nothing in the codebase could catch it: it was a constant, so
// it was true or false depending on a database it never consulted. That is run 139's rule — "a claim
// about freshness that is hardcoded is a claim nobody can keep true" — and L-93/L-100's family.
//
// These tests seed a deliberately STALE feed, render the real routes in workerd, and assert the
// documents say what the data supports and no more. The staleness is the fixture, not an accident:
// a currency claim is only wrong when the feed is old, so a fixture written at `now` cannot fail.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
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

/** 52 days — `@wearables`'s real age on production at run 182's reading, to the day. */
const STALE_HOURS = 52 * 24;

async function creator(handle: string, kind = "agent"): Promise<number> {
  const row = await DB.prepare(
    "INSERT INTO creators (handle, name, token, kind, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id"
  )
    .bind(handle, handle, `tok-${handle}`, kind, ago(2000))
    .first<{ id: number }>();
  return row!.id;
}

async function item(creatorId: number, createdAt: string, visibility = "public"): Promise<void> {
  await DB.prepare(
    "INSERT INTO items (creator_id, url, title, domain, visibility, created_at) VALUES (?, ?, ?, 'example.com', ?, ?)"
  )
    .bind(creatorId, `https://example.com/${createdAt}`, `item ${createdAt}`, visibility, createdAt)
    .run();
}

async function get(path: string, host = "justtuned.com"): Promise<string> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`https://${host}${path}`), env as never, ctx);
  await waitOnExecutionContext(ctx);
  expect(res.status, `GET ${path}`).toBe(200);
  return await res.text();
}

/** The sentence a document is no longer allowed to contain about a named feed.
 *
 *  Deliberately a claim about CURRENCY and not the word "live" as such, because the distinction is
 *  the whole judgment and a blunt word ban would flag four sanctioned strings:
 *
 *    * "Live demo — a real feed" (landing) — sanctioned at run 139; the freshness beside it is
 *      derived from the newest item into a rendered pulse, and `test/landing.test.ts` pins that.
 *    * "a live feed of attention, not posts" (both footers) and "your fans get a live page … Not
 *      posts: attention" (studio) — contrastive. These say what KIND of artifact this is, a
 *      continuously-updating page rather than a timeline of posts. They name no feed and claim no
 *      date, and the second is shown to the person publishing to that feed.
 *    * "its RSS link works right now" (application-received message) — a claim that the route
 *      works, which it does. Capability, not currency.
 *
 *  What is banned is a claim that a PARTICULAR feed's contents are current, on a document served
 *  for that feed. Those cannot be kept true by anything but the row, so they are not asserted at
 *  all: the age is stated where it is derived — `lastPublishedClause` on the page, `lastBuildDate`
 *  in the RSS document — and nowhere as prose. */
function assertNoCurrencyClaim(doc: string, surface: string): void {
  for (const banned of ["right now", "a live feed of", "live feed of what", "is live"]) {
    expect(doc.toLowerCase().includes(banned), `${surface} asserts currency in prose: "${banned}"`).toBe(false);
  }
}

/** The same rule as `assertNoCurrencyClaim`, for the one class of string that is COPIED off this
 *  site, and the reason it had to stop being a list of literals.
 *
 *  **The list above is a transcription of the two strings run 182 fixed, not a statement of the
 *  rule they broke.** Every entry is a fragment of one of them — "a live feed of", "live feed of
 *  what", "right now" — so it grades those two sentences and nothing else. The landing page's
 *  `<meta name="description">` made the identical claim in the identical element and passed all
 *  four bans, because it says *"A live **page** of what someone is actually watching"*: one noun
 *  away from a filter written to catch exactly it. It is not that the rule was too weak. It is
 *  that there was no rule — there was a record of two defects.
 *
 *  So this one is a class. A currency adjective is refused wherever it lands, and the four strings
 *  `assertNoCurrencyClaim`'s note sanctions stay sanctioned by SCOPE rather than by exemption:
 *  this applies only to the description strings a search engine and an unfurl cache copy, and all
 *  four sanctioned strings live in `<body>`, where the page's derived ages travel with them. That
 *  is the distinction L-110 turns on and it is doing the work here rather than a spelling.
 *
 *  A copied string cannot carry a derived age either (run 182: it freezes in the copy), so the
 *  only admissible description is one that asserts no currency at all. */
const CURRENCY_ADJECTIVE = /\blive\b|\bright now\b|\bcurrently\b|\bup[- ]to[- ]date\b|\bfresh\b|\breal[- ]time\b/i;

function assertDescriptionAssertsNoCurrency(description: string, surface: string): void {
  const hit = description.match(CURRENCY_ADJECTIVE);
  expect(hit?.[0] ?? null, `${surface} is copied off this site and asserts a currency: "${description}"`).toBe(null);
}

/** Every path this site asks a search engine to index, read off the sitemap rather than typed.
 *
 *  The set is derived so a page class added later is graded without anyone remembering to add it —
 *  which is the failure being closed, one level up: run 182 fixed the page classes it was looking
 *  at, and the class it was not looking at kept the defect for six weeks. */
async function indexedPaths(): Promise<string[]> {
  const xml = await get("/sitemap.xml");
  return [...xml.matchAll(/<loc>https:\/\/justtuned\.com([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
}

function metaContent(html: string, key: string): string | null {
  const byName = html.match(new RegExp(`<meta name="${key}" content="([^"]*)"`));
  const byProperty = html.match(new RegExp(`<meta property="${key}" content="([^"]*)"`));
  return (byName ?? byProperty)?.[1] ?? null;
}

describe("the RSS document does not claim a freshness the feed does not have", () => {
  it("states no currency in its channel description, on a feed 52 days stale", async () => {
    const id = await creator("wearables");
    await item(id, ago(STALE_HOURS));
    const xml = await get("/wearables/rss.xml");

    const description = xml.match(/<description>([^<]*)<\/description>/)![1];
    expect(description).toBe("What wearables is paying attention to. Selected by an AI agent, registered and supervised by a human member.");
    assertNoCurrencyClaim(description, "the RSS channel description");
  });

  it("carries the same description when the feed is fresh — the string is not conditional, it is silent", async () => {
    // The fix is the removal of a claim, not a second claim in the other direction. A description
    // that changed with age would be a relative age by another route, and the comment in `rssFeed`
    // gives the reason that must not happen: a directory copies this string into its own page,
    // where anything relative freezes and becomes the hardcoded claim being removed.
    const stale = await creator("wearables");
    await item(stale, ago(STALE_HOURS));
    const fresh = await creator("sportstech");
    await item(fresh, ago(1));

    const staleDesc = (await get("/wearables/rss.xml")).match(/<description>([^<]*)<\/description>/)![1];
    const freshDesc = (await get("/sportstech/rss.xml")).match(/<description>([^<]*)<\/description>/)![1];
    expect(staleDesc.replace("wearables", "HANDLE")).toBe(freshDesc.replace("sportstech", "HANDLE"));
  });

  it("states the age instead as an absolute instant, which cannot rot where it is copied", async () => {
    const id = await creator("wearables");
    const newest = ago(STALE_HOURS);
    await item(id, ago(STALE_HOURS + 200));
    await item(id, newest);
    const xml = await get("/wearables/rss.xml");

    // `lastBuildDate` is the freshness on this document, and it is the newest item actually served
    // rather than "now" — so the document cannot read fresher than the feed beneath it.
    expect(xml).toContain(`<lastBuildDate>${new Date(newest).toUTCString()}</lastBuildDate>`);
  });

  it("omits the build date entirely on an empty feed rather than stamping now", async () => {
    await creator("empty");
    const xml = await get("/empty/rss.xml");
    expect(xml).not.toContain("<lastBuildDate>");
    assertNoCurrencyClaim(xml, "the RSS document for an empty feed");
  });
});

describe("the feed page's unfurl does not claim a freshness the feed does not have", () => {
  it("describes the feed without calling it live, on a feed 52 days stale", async () => {
    const id = await creator("wearables");
    await item(id, ago(STALE_HOURS));
    const html = await get("/wearables");

    const meta = html.match(/<meta name="description" content="([^"]*)"/)![1];
    expect(meta).toContain("a feed of what wearables is watching");
    assertNoCurrencyClaim(meta, "the feed page's meta description");
  });

  it("still discloses the age on the page, where it is derived from the row", async () => {
    // Removing the claim must not remove the disclosure. Run 172 put this clause on the RSS block
    // for L-18's reason — staleness is a fact about the world, and a page that declines to mention
    // it is the defect. The claim and the disclosure are opposites, and only one of them was wrong.
    const id = await creator("wearables");
    await item(id, ago(STALE_HOURS));
    const html = await get("/wearables");
    expect(html).toContain("the last was 52 days ago.");
  });
});

describe("the landing page's search snippet does not claim a freshness the site cannot keep", () => {
  it("describes what the page is without calling it live, with every feed on it 52 days stale", async () => {
    // The fixture is the point, as everywhere else in this file: a currency claim is only wrong
    // when the feeds are old, so a landing page seeded at `now` cannot fail this.
    const a = await creator("wearables");
    await item(a, ago(STALE_HOURS));
    const b = await creator("wellbeing");
    await item(b, ago(STALE_HOURS));
    const html = await get("/");

    const description = metaContent(html, "description")!;
    // Graded as what survives being copied: this is the whole string a search result shows.
    assertDescriptionAssertsNoCurrency(description, "the landing page's meta description");
    // And the removal must not have been a deletion — the page still says what it IS.
    expect(description).toContain("what someone is actually watching, reading and listening to");
  });

  it("says the same thing when a feed published an hour ago — silent about currency, not conditional", async () => {
    // A description that changed with age would be a relative age by another route, and run 182's
    // reason for keeping one out of a copied string applies here unchanged: the copy freezes.
    const stale = await creator("wearables");
    await item(stale, ago(STALE_HOURS));
    const staleHtml = await get("/");

    await DB.batch([DB.prepare("DELETE FROM items"), DB.prepare("DELETE FROM creators")]);
    const fresh = await creator("sportstech");
    await item(fresh, ago(1));
    const freshHtml = await get("/");

    expect(metaContent(staleHtml, "description")).toBe(metaContent(freshHtml, "description"));
  });

  it("leaves the contrastive og:description alone — it never asserted a currency", async () => {
    const id = await creator("wearables");
    await item(id, ago(STALE_HOURS));
    const html = await get("/");
    expect(metaContent(html, "og:description")).toBe("Follow what people pay attention to — not what they post.");
  });
});

describe("no page this site asks to be indexed asserts a currency where it will be copied", () => {
  it("holds for every path in the sitemap, on a site whose every feed is 52 days stale", async () => {
    // Neither the page list nor the descriptions are typed here. Both are read off the running
    // service — the paths from the document this site hands a crawler, the strings from the pages
    // it serves at them — so a page class registered later is graded by this without being named.
    const a = await creator("wearables");
    await item(a, ago(STALE_HOURS));
    const b = await creator("wellbeing");
    await item(b, ago(STALE_HOURS + 300));

    const paths = await indexedPaths();
    // Landing, two feeds, two finds, terms, privacy. If this collapses to a handful the test has
    // stopped covering anything and should fail rather than pass quietly.
    expect(paths.length).toBeGreaterThanOrEqual(6);
    expect(paths).toContain("/");

    let described = 0;
    for (const path of paths) {
      const html = await get(path);
      for (const key of ["description", "og:description"]) {
        const value = metaContent(html, key);
        // /terms and /privacy carry no social head at all; absence is not a currency claim.
        if (value === null) continue;
        described += 1;
        assertDescriptionAssertsNoCurrency(value, `${key} on ${path}`);
      }
    }
    // Guards the loop itself: a regex that matched no page would make every assertion vacuous.
    expect(described).toBeGreaterThanOrEqual(8);
  });
});

describe("robots.txt does not claim a freshness the site cannot keep", () => {
  it("states the positioning rather than a currency", async () => {
    const txt = await get("/robots.txt");
    expect(txt).toContain("# Tuned — follow the attention of people and agents you trust.");
    expect(txt).toContain("# Humans contribute attention, not content.");
    assertNoCurrencyClaim(txt, "robots.txt");
  });
});
