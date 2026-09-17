// What a subscriber is told about a find, on the one surface anybody actually subscribes to.
//
// A feed item said the source's title, the source's URL and the source's blurb. In a reader —
// which is what a subscription *is* — Tuned's whole subject was therefore absent from every
// item: nothing named who observed the thing or who chose it, and nothing linked to the page
// that states it. The channel-level "(AI agent)" label is shown once in a sidebar, not on the
// item in front of you, and `test/discovery.test.ts` covers that element already.
//
// These tests run the real Worker against a real D1 in workerd. Three of them exist to pin
// decisions rather than behaviour, because each is a thing a later run could quietly undo and
// not notice:
//
//   * `<link>` still goes to the source. The permalink is a second affordance. Re-pointing the
//     primary link at Tuned would send every click on a subscribed feed to us instead of to the
//     thing the member paid attention to, which is the opposite of the doctrine.
//   * `guid` strings do not move. A reader keys "have I shown this?" on that string; rewriting
//     them to the new addresses re-delivers every item in every feed as unread.
//   * the advertised permalink is a URL this same Worker serves, asserted by fetching it rather
//     than by matching a string — the idiom discovery.test.ts uses for `rel="alternate"`, and
//     for the same reason: a well-formed link to a 404 passes every check made of its text.

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
  for (const sql of statements) await DB.prepare(sql).run();
});

beforeEach(async () => {
  await DB.batch([DB.prepare("DELETE FROM items"), DB.prepare("DELETE FROM creators")]);
});

async function creator(handle: string, name: string, kind = "human"): Promise<number> {
  const row = await DB.prepare(
    "INSERT INTO creators (handle, name, token, kind, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id"
  )
    .bind(handle, name, `tok-${handle}`, kind, new Date().toISOString())
    .first<{ id: number }>();
  return row!.id;
}

async function item(
  creatorId: number,
  o: { title?: string; note?: string; description?: string; via?: number | null; url?: string } = {}
): Promise<number> {
  const row = await DB.prepare(
    `INSERT INTO items (creator_id, url, title, description, note, domain, visibility, via_creator_id, created_at)
     VALUES (?, ?, ?, ?, ?, 'example.com', 'public', ?, ?) RETURNING id`
  )
    .bind(
      creatorId,
      o.url ?? "https://example.com/a",
      o.title ?? "a find",
      o.description ?? "",
      o.note ?? "",
      o.via ?? null,
      new Date().toISOString()
    )
    .first<{ id: number }>();
  return row!.id;
}

async function get(path: string): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`https://tuned.test${path}`), env as never, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

/** The raw text of each `<description>`, exactly as it sits in the document. */
function rawDescriptions(xml: string): string[] {
  return [...xml.matchAll(/<description>([\s\S]*?)<\/description>/g)].map((m) => m[1]);
}

/** One XML decode — what a reader's parser does before it hands the result to its renderer.
 *  `&amp;` last, or every other entity gets decoded twice. */
function decodeXml(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

/** The item descriptions as HTML, which is the layer a reader renders. The channel carries a
 *  `<description>` of its own and it is always first, so it is dropped here. */
async function itemHtml(handle: string): Promise<string[]> {
  const xml = await (await get(`/${handle}/rss.xml`)).text();
  return rawDescriptions(xml).slice(1).map(decodeXml);
}

describe("an RSS item carries its provenance", () => {
  it("names both ends of the chain when an agent found it", async () => {
    const ava = await creator("ava", "Ava");
    const scout = await creator("wearables", "Wearables", "agent");
    await item(ava, { via: scout });

    const [html] = await itemHtml("ava");
    expect(html).toContain("Observed by @wearables, read and chosen by @ava.");
  });

  it("names only the selector when nobody found it for them", async () => {
    const ava = await creator("ava", "Ava");
    await item(ava, {});

    const [html] = await itemHtml("ava");
    expect(html).toContain("Selected by @ava.");
    expect(html).not.toContain("Observed by");
  });

  it("links to the find's own page on the canonical origin", async () => {
    const ava = await creator("ava", "Ava");
    const id = await item(ava, {});

    const [html] = await itemHtml("ava");
    expect(html).toContain(`<a href="https://justtuned.com/ava/${id}">`);
  });

  // The whole point of the link, and the one assertion here that a string check cannot make.
  it("advertises a permalink this Worker actually serves as a find page", async () => {
    const ava = await creator("ava", "Ava");
    await item(ava, { title: "the find in question" });

    const [html] = await itemHtml("ava");
    const href = html.match(/<a href="https:\/\/justtuned\.com([^"]+)">/)?.[1];
    expect(href, "no permalink in the item description").toBeDefined();

    const page = await get(href!);
    expect(page.status).toBe(200);
    expect(await page.text()).toContain("the find in question");
  });

  // An item with no blurb used to serve an empty `<description>`. Provenance does not depend on
  // the source having written a summary, so this is the case that gains the most.
  it("says something on an item that has no blurb at all", async () => {
    const ava = await creator("ava", "Ava");
    await item(ava, { note: "", description: "" });

    const [html] = await itemHtml("ava");
    expect(html).toContain("Selected by @ava.");
    expect(html).toContain("<a href=");
  });

  it("prefers the member's own note to the source's summary, as every other surface does", async () => {
    const ava = await creator("ava", "Ava");
    await item(ava, { note: "why this matters", description: "the source's blurb" });

    const [html] = await itemHtml("ava");
    expect(html).toContain("why this matters");
    expect(html).not.toContain("the source's blurb");
  });
});

describe("what the provenance line must not disturb", () => {
  it("leaves <link> pointing at the source, not at Tuned", async () => {
    const ava = await creator("ava", "Ava");
    await item(ava, { url: "https://example.com/the-source" });

    const xml = await (await get("/ava/rss.xml")).text();
    expect(xml).toContain("<link>https://example.com/the-source</link>");
    // The item's primary link is the source's URL and nothing else. A permalink that arrived
    // here instead of in the description would silently re-point every click on every feed.
    expect(xml).not.toMatch(/<link>https:\/\/justtuned\.com\/ava\/\d+<\/link>/);
  });

  it("leaves guid alone, so no reader re-delivers a feed it has already shown", async () => {
    const ava = await creator("ava", "Ava");
    const id = await item(ava, {});

    const xml = await (await get("/ava/rss.xml")).text();
    expect(xml).toContain(`<guid isPermaLink="false">tuned-item-${id}</guid>`);
  });
});

describe("markup inside XML inside a reader", () => {
  // The description is HTML inside an XML text node, so every value passes through two escapes.
  // One escape and a blurb containing a tag becomes live markup in the reader; three and the
  // subscriber reads `&lt;p&gt;`.
  it("escapes a blurb's own markup twice, so it renders as the text it is", async () => {
    const ava = await creator("ava", "Ava");
    await item(ava, { note: '<script>alert("x")</script> & co' });

    const xml = await (await get("/ava/rss.xml")).text();
    const raw = rawDescriptions(xml)[1];
    // In the document: doubly escaped. A parser decodes one layer, a renderer decodes the next,
    // and what the subscriber sees is the characters the member typed.
    expect(raw).toContain("&amp;lt;script&amp;gt;");
    expect(raw).not.toContain("&lt;script&gt;");

    const html = decodeXml(raw);
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&amp; co");
    // The one tag pair that is ours survives the same treatment as live markup.
    expect(html).toMatch(/<p>.*<a href="https:\/\/justtuned\.com\/ava\/\d+">/s);
  });

  it("serves a document that still parses after all of it", async () => {
    const ava = await creator("ava", "Ava");
    await item(ava, { title: 'a "quoted" & <angled> find', note: "]]> and & and <b>" });

    const res = await get("/ava/rss.xml");
    expect(res.headers.get("content-type")).toContain("xml");
    const xml = await res.text();
    // A bare `<` or `&` anywhere outside a tag is a parse error in a reader, and CDATA's own
    // terminator is the classic way to produce one. Neither survives into the document.
    const descriptions = rawDescriptions(xml);
    for (const d of descriptions) {
      expect(d).not.toMatch(/]]>/);
      expect(d.replace(/&(amp|lt|gt|quot|#\d+);/g, "")).not.toMatch(/[<>&]/);
    }
  });
});
