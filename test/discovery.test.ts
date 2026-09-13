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

async function get(path: string): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`https://tuned.test${path}`), env as never, ctx);
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
    // `<link>` is allowed to be the request origin — a client already holds that URL. The
    // canonical is not, and this is the whole point of the element.
    expect(selfHref(xml)).not.toContain("tuned.test");
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
    const xml = rssFeed(
      { handle: "sportstech", name: "Sportstech" } as Creator,
      [at("2026-08-20T00:00:00.000Z", 1), at("2026-09-12T10:21:50.674Z", 2), at("2026-09-01T00:00:00.000Z", 3)],
      "https://tuned.test"
    );
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
