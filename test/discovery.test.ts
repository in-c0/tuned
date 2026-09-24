// Machine-readable discovery of a public feed, made executable.
//
// A public feed page carried a visible "RSS" anchor for a human and nothing at all for
// software. `<link rel="alternate" type="application/rss+xml">` is the single element every
// feed reader, aggregator and feed search engine uses to turn a pasted page URL into a
// subscribable feed, and it was absent from every page this service serves. The visible
// anchor is not a substitute: no reader parses page text looking for the word "RSS".
//
// These tests run the real Worker against a real D1 in workerd and assert the element is
// present, well-formed, and — the part that matters and that a string check would miss —
// that the href it advertises is a URL this same Worker actually serves as a feed.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";
import { rssFeed, type Creator, type Item } from "../src/pages";

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

async function seed(handle: string, name: string, kind = "human"): Promise<void> {
  const row = await DB.prepare(
    "INSERT INTO creators (handle, name, token, kind, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id"
  )
    .bind(handle, name, `tok-${handle}`, kind, new Date().toISOString())
    .first<{ id: number }>();
  await DB.prepare(
    "INSERT INTO items (creator_id, url, title, domain, visibility, created_at) VALUES (?, ?, ?, 'example.com', 'public', ?)"
  )
    .bind(row!.id, "https://example.com/a", "a find", new Date().toISOString())
    .run();
}

async function get(path: string, origin = "https://tuned.test"): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`${origin}${path}`), env as never, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

describe("RSS autodiscovery on a public feed page", () => {
  it("advertises the feed with a well-formed alternate link", async () => {
    await seed("sportstech", "Sportstech");
    const html = await (await get("/sportstech")).text();

    const link = html.match(/<link\b[^>]*rel="alternate"[^>]*>/i)?.[0];
    expect(link, "no <link rel=\"alternate\"> in the document").toBeDefined();
    expect(link).toMatch(/type="application\/rss\+xml"/);
    expect(link).toMatch(/href="\/sportstech\/rss\.xml"/);
    // A reader offering a choice of feeds shows this string, so it has to name the feed
    // rather than repeat the product name on its own.
    expect(link).toMatch(/title="Sportstech —/);
  });

  it("is inside <head>, which is the only place a reader looks", async () => {
    await seed("sportstech", "Sportstech");
    const html = await (await get("/sportstech")).text();
    const head = html.slice(html.indexOf("<head>"), html.indexOf("</head>"));
    expect(head).toContain('type="application/rss+xml"');
  });

  it("advertises a href this Worker actually serves as a feed", async () => {
    await seed("sportstech", "Sportstech");
    const html = await (await get("/sportstech")).text();
    const href = html.match(/rel="alternate"[^>]*href="([^"]+)"/i)?.[1];
    expect(href).toBeDefined();

    // The point of the whole element: follow it and get a feed back, not a 404.
    const feed = await get(href!);
    expect(feed.status).toBe(200);
    expect(feed.headers.get("content-type") ?? "").toMatch(/xml/);
    expect(await feed.text()).toContain("<rss");
  });

  it("names the feed it is on, not some other feed", async () => {
    await seed("sportstech", "Sportstech");
    await seed("wearables", "Wearables");
    const html = await (await get("/wearables")).text();
    const links = html.match(/<link\b[^>]*rel="alternate"[^>]*>/gi) ?? [];
    // Exactly one feed is advertised, and it is this page's own.
    expect(links).toHaveLength(1);
    expect(links[0]).toMatch(/href="\/wearables\/rss\.xml"/);
  });

  it("escapes a name that would otherwise break out of the title attribute", async () => {
    await seed("odd", 'Ava " onload=x');
    const html = await (await get("/odd")).text();
    const link = html.match(/<link\b[^>]*rel="alternate"[^>]*>/i)?.[0] ?? "";
    expect(link).not.toContain('" onload=');
    expect(link).toContain("&quot;");
  });
});

// RSS autodiscovery on `/`, which is the page a reader is actually handed.
//
// The block above grades a feed page. `/` is a different claim and it was the missing one: it is
// the URL every canonical, every `og:url`, the sitemap and the README name as this site, so it is
// the string a person pastes into their reader and the string a directory resolves. It carried no
// `<link rel="alternate">` at all, while listing five live feeds in visible HTML — so every reader
// ever given this site's address was told the site has no feed, and the page looked right to every
// human who checked it, because a human sees the list and clicks it (L-46).
//
// WHAT IS GRADED HERE, AND WHY IT IS NOT A CONTAINS-CHECK (L-107). Asserting that `/` contains an
// alternate link grades a precondition: one link satisfies it, and one link on a page offering five
// feeds hides four of them. What a reader does is parse the head, collect *every* alternate, show
// the person a picker, and fetch whichever they choose. So `discover()` below is that consumer —
// it reads the document the same way and returns what a reader would end up holding — and the
// assertions are about the set it returns: it covers exactly the feeds the page itself offers,
// every entry in it is distinguishable from the others, and every entry leads to a real feed.
//
// The expected set is derived from the rendered page's own feed cards, never typed here. A test
// that names the handles it expects grades this fixture; one that reads them off the page grades
// the mapping, and keeps grading it when a sixth feed is registered.

/** What a feed reader holds after being handed a page URL: every RSS alternate in the document's
 *  head, in document order. Deliberately extracted element-by-element and then filtered on the
 *  media type, so both attributes must sit on the SAME element — a document with `rel="alternate"`
 *  on one tag and the RSS type on another is invisible to every real client, and a whole-document
 *  grep for the two strings would call it discovered. */
function discover(html: string): Array<{ href: string; title: string }> {
  const head = html.slice(html.indexOf("<head>"), html.indexOf("</head>"));
  return (head.match(/<link\b[^>]*rel="alternate"[^>]*>/gi) ?? [])
    .filter((el) => el.includes('type="application/rss+xml"'))
    .map((el) => ({
      href: el.match(/href="([^"]*)"/)?.[1] ?? "",
      title: el.match(/title="([^"]*)"/)?.[1] ?? "",
    }));
}

/** The feeds the landing page offers a human, read off the rendered page. This is the denominator
 *  the advertised set has to match, and it is the page's own claim rather than this file's. */
function offeredHandles(html: string): string[] {
  return [...html.matchAll(/class="card-link" href="\/([^"/]+)"/g)].map((m) => m[1]);
}

describe("RSS autodiscovery on the landing page", () => {
  it("advertises a feed at all, which is what it never did", async () => {
    await seed("sportstech", "Sportstech");
    const found = discover(await (await get("/")).text());
    expect(found.length, "/ carries no RSS alternate — a reader handed this site's address finds nothing").toBeGreaterThan(0);
  });

  it("advertises every feed the page offers, in the order it offers them", async () => {
    await seed("sportstech", "Sportstech");
    await seed("wearables", "Wearables");
    await seed("graphics", "Graphics", "agent");
    const html = await (await get("/")).text();

    const offered = offeredHandles(html);
    expect(offered.length).toBe(3);
    // Not a subset and not a superset. A page advertising three of five feeds is the defect in
    // miniature; one advertising a feed it does not list is advertising something else's.
    expect(discover(html).map((l) => l.href)).toEqual(offered.map((h) => `/${h}/rss.xml`));
  });

  it("gives every advertised feed a title the picker can tell apart", async () => {
    // Two feeds, one display name. `name` is not unique in the schema and `handle` is, which is
    // why the title is keyed on the handle: a reader showing two identical rows has asked the
    // person to choose and given them nothing to choose by.
    await seed("sportstech", "Attention");
    await seed("wearables", "Attention");
    const titles = discover(await (await get("/")).text()).map((l) => l.title);
    expect(titles).toHaveLength(2);
    expect(new Set(titles).size, `two feeds share the title ${titles[0]}`).toBe(2);
    for (const t of titles) expect(t).not.toBe("");
  });

  // THE OUTCOME. Everything above is about the document; this is about what the consumer ends up
  // holding. Play the whole reader: take the site URL, discover, follow each advertised href, and
  // require a real feed back — then check the *set* of feeds actually reached against the set the
  // page offers. A link that is well-formed and points at a 404, or at another feed, fails a person
  // exactly as no link does.
  //
  // It is graded on the set reached and NOT per-href for a reason the mutation pass found. The
  // first version of this test asserted, inside the loop, that each fetched feed matched the href
  // that reached it — and that assertion is true by construction whatever the hrefs are, so a
  // landing page advertising five distinct titles that all point at ONE feed passed it. Checking
  // each link against itself is not checking the mapping. The question a reader answers is "can I
  // subscribe to each of these feeds", and only the set can answer it.
  it("leaves a reader holding a working feed for every feed on the page", async () => {
    await seed("sportstech", "Sportstech");
    await seed("wearables", "Wearables");
    const html = await (await get("/")).text();
    const found = discover(html);

    const reached = new Set<string>();
    for (const { href } of found) {
      const feed = await get(href);
      expect(feed.status, `advertised ${href} returned ${feed.status}`).toBe(200);
      expect(feed.headers.get("content-type") ?? "").toMatch(/xml/);
      const xml = await feed.text();
      expect(xml).toContain("<rss");
      reached.add(channelLink(xml) ?? "");
    }
    expect([...reached].sort()).toEqual(
      offeredHandles(html)
        .map((h) => `https://justtuned.com/${h}`)
        .sort()
    );
  });

  it("puts them where a reader looks, and names no feed the site does not serve", async () => {
    await seed("sportstech", "Sportstech");
    const html = await (await get("/")).text();
    // `discover` already reads the head only, so an element that moved into the body leaves the
    // set empty rather than passing.
    expect(discover(html)).toHaveLength(1);
    expect(discover(html)[0].href).toBe("/sportstech/rss.xml");
  });

  it("escapes a handle that would otherwise break out of the attributes", async () => {
    await seed('odd" onload=x', "Odd");
    const links = discover(await (await get("/")).text());
    expect(links).toHaveLength(1);
    expect(links[0].href).not.toContain('" onload=');
    expect(links[0].title).toContain("&quot;");
  });
});

// The feed document's own identity and build date.
//
// `<link rel="alternate">` above solves discovery *from the page*. This block is the other
// direction: once a reader, aggregator or validator holds the XML, what does the XML say about
// itself? Until now, nothing. Three hosts serve this identical document and none of them is named
// inside it, which is the same defect `<link rel="canonical">` was added to the HTML to fix — the
// comment on SITE_ORIGIN says so in as many words and the feed was left out of the fix.
//
// Every request here is made against `https://tuned.test`, deliberately. A self-link built from
// the request would pass a string check and still be wrong, so the assertion that carries the
// weight is that the href names the canonical host and NOT the host that asked.

async function seedFeed(handle: string, dates: string[]): Promise<void> {
  const row = await DB.prepare(
    "INSERT INTO creators (handle, name, token, kind, created_at) VALUES (?, ?, ?, 'agent', ?) RETURNING id"
  )
    .bind(handle, handle, `tok-${handle}`, new Date().toISOString())
    .first<{ id: number }>();
  for (const [n, created] of dates.entries()) {
    await DB.prepare(
      "INSERT INTO items (creator_id, url, title, domain, visibility, created_at) VALUES (?, ?, ?, 'example.com', 'public', ?)"
    )
      .bind(row!.id, `https://example.com/${n}`, `find ${n}`, created)
      .run();
  }
}

const selfHref = (xml: string): string | undefined =>
  xml.match(/<atom:link\b[^>]*rel="self"[^>]*>/i)?.[0].match(/href="([^"]+)"/)?.[1];

/** The CHANNEL's `<link>`, which is the first one in the document — every later one belongs to an
 *  `<item>` and is the source's URL. Anchored on `<channel>` rather than taken as "the first
 *  `<link>`" so that a future element added above it cannot silently change what this reads. */
const channelLink = (xml: string): string | undefined =>
  xml.match(/<channel>[\s\S]*?<link>([^<]*)<\/link>/)?.[1];

describe("the RSS document's own identity", () => {
  it("names itself with a canonical self link, on the canonical host", async () => {
    await seedFeed("sportstech", ["2026-09-12T10:21:50.674Z"]);
    const xml = await (await get("/sportstech/rss.xml")).text();

    // The namespace has to be declared or the prefix is undefined and the document is not
    // namespace-well-formed — a self link nobody can resolve is worse than none.
    expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    expect(selfHref(xml)).toBe("https://justtuned.com/sportstech/rss.xml");
    expect(xml).toMatch(/<atom:link\b[^>]*type="application\/rss\+xml"/);
  });

  it("does not echo the host that asked for it", async () => {
    await seedFeed("sportstech", ["2026-09-12T10:21:50.674Z"]);
    const xml = await (await get("/sportstech/rss.xml")).text();
    // This assertion used to be accompanied by the sentence *"`<link>` is allowed to be the
    // request origin — a client already holds that URL"*, and that sentence was the defect run
    // 190 removed: `<channel><link>` is not a URL the client holds, it is where the site is.
    // Nothing in this document echoes the host now, so the claim is made over the whole of it.
    expect(selfHref(xml)).not.toContain("tuned.test");
    expect(xml).not.toContain("tuned.test");
  });

  it("says where the site is with the canonical host, not the host that asked", async () => {
    await seedFeed("sportstech", ["2026-09-12T10:21:50.674Z"]);
    const xml = await (await get("/sportstech/rss.xml")).text();
    // RSS 2.0: `<channel><link>` is "the URL to the HTML website corresponding to the channel".
    // A reader renders it as the feed's "visit site" and a directory copies it into its listing,
    // so it is a canonical-class statement and the one element here that names the site at all.
    expect(channelLink(xml)).toBe("https://justtuned.com/sportstech");
  });

  // THE OUTCOME, NOT THE PRECONDITION — L-107. The three assertions above each ask what the
  // document CONTAINS when one host asks. What a directory actually does is fetch this feed from
  // whichever host it found, and publish what it read; the property that makes that safe is that
  // there is no "whichever host" to find. So this asks the consumer's question instead: serve the
  // same feed to three hosts and compare the bytes. It is the assertion that fails if any future
  // field is derived from the request, including one nothing above thought to name.
  it("serves a byte-identical document to every host this Worker answers on", async () => {
    await seedFeed("sportstech", ["2026-09-12T10:21:50.674Z", "2026-09-01T00:00:00.000Z"]);
    const hosts = ["https://justtuned.com", "https://www.justtuned.com", "https://attention-feed.in-c0.workers.dev"];
    const docs: string[] = [];
    for (const host of hosts) docs.push(await (await get("/sportstech/rss.xml", host)).text());
    for (let i = 1; i < docs.length; i++) {
      expect(docs[i], `${hosts[i]} served a different document from ${hosts[0]}`).toBe(docs[0]);
    }
    // And the document they all agree on is the canonical one — three hosts agreeing on
    // `workers.dev` would satisfy the loop above and be exactly the defect.
    expect(channelLink(docs[0])).toBe("https://justtuned.com/sportstech");
  });

  it("does not adopt an arrival tag as part of its own identity", async () => {
    await seedFeed("sportstech", ["2026-09-12T10:21:50.674Z"]);
    const xml = await (await get("/sportstech/rss.xml?src=awesome-rss-feeds")).text();
    // `?src=` is a campaign label on a link, not part of the feed. A document that asserted a
    // tagged URL as its own canonical would hand the label to everything that copies it.
    expect(selfHref(xml)).toBe("https://justtuned.com/sportstech/rss.xml");
    expect(selfHref(xml)).not.toContain("src=");
  });

  it("names the feed it is, not another feed on the same host", async () => {
    await seedFeed("sportstech", ["2026-09-12T10:21:50.674Z"]);
    await seedFeed("wearables", ["2026-07-30T00:00:00.000Z"]);
    const xml = await (await get("/wearables/rss.xml")).text();
    expect(selfHref(xml)).toBe("https://justtuned.com/wearables/rss.xml");
  });

  it("states a build date that is the newest pubDate in the document it is on", async () => {
    await seedFeed("sportstech", [
      "2026-09-01T00:00:00.000Z",
      "2026-09-12T10:21:50.674Z",
      "2026-08-20T00:00:00.000Z",
    ]);
    const xml = await (await get("/sportstech/rss.xml")).text();
    const built = xml.match(/<lastBuildDate>([^<]+)<\/lastBuildDate>/)?.[1];
    expect(built).toBe(new Date("2026-09-12T10:21:50.674Z").toUTCString());
    // Against the served document, not against the fixture: the element has to agree with the
    // items underneath it or a reader's "last updated" column contradicts its own list.
    const pubs = [...xml.matchAll(/<pubDate>([^<]+)<\/pubDate>/g)].map((m) => Date.parse(m[1]));
    expect(Math.max(...pubs)).toBe(Date.parse(built!));
  });

  // THE ROUTE CANNOT EXERCISE THIS AND SAYING SO IS THE POINT. `itemsFor` sorts
  // `created_at DESC`, so through `GET /:handle/rss.xml` the newest row is always `items[0]` and
  // a build date read off `items[0]` passes every route-level assertion above — checked by
  // mutation, and it survived. The claim being made is about `rssFeed` itself, which is exported
  // and callable by anything, so it is tested where it can actually fail.
  it("computes the build date over what it was handed, not over the first row", () => {
    const at = (iso: string, id: number): Item =>
      ({
        id,
        created_at: iso,
        url: "https://example.com/a",
        title: "a find",
        category: "Misc",
        note: "",
        description: "",
      }) as Item;
    const xml = rssFeed({ handle: "sportstech", name: "Sportstech" } as Creator, [
      at("2026-08-20T00:00:00.000Z", 1),
      at("2026-09-12T10:21:50.674Z", 2),
      at("2026-09-01T00:00:00.000Z", 3),
    ]);
    expect(xml).toContain(`<lastBuildDate>${new Date("2026-09-12T10:21:50.674Z").toUTCString()}</lastBuildDate>`);
  });

  it("claims no build date at all on a feed with nothing in it", async () => {
    await seedFeed("empty", []);
    const xml = await (await get("/empty/rss.xml")).text();
    expect(xml).toContain("<rss");
    // An empty feed has no build date. Stamping "now" would claim freshness it does not have,
    // which is the one direction this whole register exists to refuse.
    expect(xml).not.toContain("<lastBuildDate>");
    expect(selfHref(xml)).toBe("https://justtuned.com/empty/rss.xml");
  });

  it("omits a date it cannot state rather than publishing `Invalid Date`", async () => {
    await seedFeed("sportstech", ["not-a-timestamp"]);
    const xml = await (await get("/sportstech/rss.xml")).text();
    // `new Date("").toUTCString()` is the literal string `Invalid Date`, and it used to go
    // straight into the document. Absent means unstated; present-and-not-a-date is false.
    expect(xml).not.toContain("Invalid Date");
    expect(xml).not.toContain("<pubDate>");
    expect(xml).not.toContain("<lastBuildDate>");
  });
});
