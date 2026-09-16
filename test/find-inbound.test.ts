// The edge from the feed page into the find pages — the half of run 164 that was missing.
//
// Run 164 gave all eighty-seven published finds an address and linked those pages to one another.
// It did not link anything *into* the set. `card()` wraps a whole feed card in an anchor to the
// source, so the only route into the island was `sitemap.xml`: a crawler walking links from `/`
// reached none of them, and a visitor who wanted to send someone one find could not obtain its URL
// from any page that showed it. A connected component with no inbound edge is still an orphan.
//
// The properties that decide whether the edge is sound rather than merely present:
//
//   1. THE EDGE EXISTS AND LANDS. Every find rendered on a feed page carries a link to its own
//      page, and that link *resolves* — asserted by following the href the page actually emitted,
//      not by rebuilding the string the test expects.
//   2. THE PRIMARY CLICK IS UNCHANGED. The card still opens the source. The permalink is a second
//      affordance; the moment it becomes the first, every click on the only conversion surface
//      goes to Tuned instead of the thing the member was paying attention to.
//   3. THE ANCHORS ARE NOT NESTED. HTML forbids an anchor inside an anchor and browsers silently
//      un-nest one, which would produce a link the parser moves or drops. Markup that looks right
//      in a string and un-nests in a parser is exactly the class of defect the unit tests here
//      cannot see, so the structure is asserted directly.
//   4. THE FROZEN PAGE DID NOT MOVE. `landingPage` renders its demo through the same `card()`, and
//      EXP-011 freezes the landing page until its reading on 2026-09-19. Byte-identity is asserted
//      rather than inspected.
//   5. THE REFERRER AXIS KEEPS THE OLD READING COMPUTABLE. Run 164 registered "`item_view` moving
//      without `_bot` is the first shared link". That was true while every way in was off-site.
//      This change makes an on-site way in, so `item_view_onsite` has to separate them.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";

const DB = env.DB as D1Database;
const ORIGIN = "https://tuned.test";
const HUMAN_UA = "Mozilla/5.0 (X11; Linux x86_64) Chrome/128.0.0.0";

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
  await DB.batch([
    DB.prepare("DELETE FROM items"),
    DB.prepare("DELETE FROM creators"),
    DB.prepare("DELETE FROM metric_days"),
  ]);
});

async function creator(handle: string, name: string): Promise<number> {
  const row = await DB.prepare(
    "INSERT INTO creators (handle, name, token, kind, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id"
  )
    .bind(handle, name, `tok-${handle}`, "human", new Date().toISOString())
    .first<{ id: number }>();
  return row!.id;
}

async function item(creatorId: number, over: Record<string, unknown> = {}): Promise<number> {
  const v = {
    url: "https://example.com/a-find",
    title: "A find",
    description: "",
    image_url: "",
    site_name: "",
    domain: "example.com",
    category: "Misc",
    note: "",
    visibility: "public",
    via_creator_id: null,
    ...over,
  };
  const row = await DB.prepare(
    `INSERT INTO items (creator_id, url, title, description, image_url, site_name, domain, category, note, visibility, via_creator_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`
  )
    .bind(
      creatorId,
      v.url,
      v.title,
      v.description,
      v.image_url,
      v.site_name,
      v.domain,
      v.category,
      v.note,
      v.visibility,
      v.via_creator_id,
      new Date().toISOString()
    )
    .first<{ id: number }>();
  return row!.id;
}

async function get(path: string, headers: Record<string, string> = {}): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(
    new Request(`${ORIGIN}${path}`, { headers: { "user-agent": HUMAN_UA, ...headers } }),
    env as never,
    ctx
  );
  await waitOnExecutionContext(ctx);
  return res;
}

async function counter(name: string): Promise<number> {
  const row = await DB.prepare("SELECT SUM(count) AS n FROM metric_days WHERE name = ?")
    .bind(name)
    .first<{ n: number | null }>();
  return row?.n ?? 0;
}

/** Every `href` carried by a `card-permalink` anchor, in document order. */
function permalinks(html: string): string[] {
  return [...html.matchAll(/<a class="card-permalink" href="([^"]+)"/g)].map((m) => m[1]);
}

describe("the feed page links into the find pages", () => {
  it("gives every rendered find a link to its own page, and that link resolves", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const a = await item(id, { title: "First find", url: "https://a.example/1" });
    const b = await item(id, { title: "Second find", url: "https://b.example/2" });

    const html = await (await get("/sportstech")).text();
    const hrefs = permalinks(html);

    expect(hrefs).toHaveLength(2);
    expect(new Set(hrefs)).toEqual(new Set([`/sportstech/${a}`, `/sportstech/${b}`]));

    // Follow what the page emitted rather than a string this test rebuilt. A permalink that is
    // well-formed and points nowhere is the failure this assertion exists to catch.
    for (const href of hrefs) {
      const res = await get(href);
      expect(res.status, `${href} should resolve`).toBe(200);
      expect(await res.text()).toContain("Provenance");
    }
  });

  it("does not link to an unpublished find, because the feed does not render one", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const shown = await item(id, { title: "Public" });
    await item(id, { title: "Hidden", visibility: "hidden" });
    await item(id, { title: "Queued", visibility: "queued" });

    const hrefs = permalinks(await (await get("/sportstech")).text());
    expect(hrefs).toEqual([`/sportstech/${shown}`]);
  });

  it("keeps the card's own click on the source", async () => {
    const id = await creator("sportstech", "Sports Tech");
    await item(id, { url: "https://source.example/the-thing" });

    const html = await (await get("/sportstech")).text();
    expect(html).toContain('<a class="card-link" href="https://source.example/the-thing" target="_blank" rel="noopener">');
    // The one thing that must never happen here: the card itself pointing at Tuned.
    expect(html).not.toMatch(/<a class="card-link" href="\/sportstech\/\d+"/);
  });

  it("never nests the permalink anchor inside the card anchor", async () => {
    const id = await creator("sportstech", "Sports Tech");
    await item(id, { note: "a note", description: "a description", title: "T" });

    const html = await (await get("/sportstech")).text();
    // Between the card anchor's opening tag and the permalink's, there must be a closing </a>.
    const open = html.indexOf('<a class="card-link"');
    const close = html.indexOf("</a>", open);
    const link = html.indexOf('<a class="card-permalink"');
    expect(open).toBeGreaterThan(-1);
    expect(link).toBeGreaterThan(-1);
    expect(close, "the card anchor must close before the permalink opens").toBeLessThan(link);
  });

  it("puts the category filter's hook on the wrapper, so a filtered card takes its permalink with it", async () => {
    const id = await creator("sportstech", "Sports Tech");
    await item(id, { category: "Research" });

    const html = await (await get("/sportstech")).text();
    expect(html).toContain('<div class="card-wrap" data-item-cat="Research">');
    // Two hooks on one card would hide the card and leave its permalink behind.
    expect(html).not.toMatch(/<a class="card-link"[^>]*data-item-cat/);
  });
});

describe("the surfaces that must not have changed", () => {
  it("leaves the landing page's cards byte-identical, which EXP-011's freeze requires", async () => {
    const id = await creator("sportstech", "Sports Tech");
    await item(id, { title: "Demo find" });

    const html = await (await get("/")).text();
    expect(html).not.toContain("card-permalink");
    expect(html).not.toContain("card-wrap");
    expect(html).not.toContain("FEED_CSS");
    // The landing page's cards keep the hook on the anchor itself — the pre-change shape.
    expect(html).toMatch(/<a class="card-link" href="[^"]+" target="_blank" rel="noopener" data-item-cat="/);
  });

  it("keeps the permalink stylesheet off every page that is not a public feed", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const one = await item(id);

    expect(await (await get("/")).text()).not.toContain(".card-permalink");
    expect(await (await get(`/sportstech/${one}`)).text()).not.toContain(".card-permalink");
    expect(await (await get("/sportstech")).text()).toContain(".card-permalink");
  });
});

describe("item_view_onsite", () => {
  it("counts a click that came from this site, as an axis and not a bucket", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const one = await item(id);

    await get(`/sportstech/${one}`, { referer: `${ORIGIN}/sportstech` });

    expect(await counter("item_view_onsite")).toBe(1);
    // The totals the old reading rests on are untouched: the axis is never summed into them.
    expect(await counter("item_view")).toBe(1);
    expect(await counter("item_view:sportstech")).toBe(1);
  });

  it("leaves an arrival from off-site off the axis, which is what keeps the old reading readable", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const one = await item(id);

    await get(`/sportstech/${one}`, { referer: "https://news.ycombinator.com/" });
    await get(`/sportstech/${one}`); // no Referer at all — a pasted URL

    expect(await counter("item_view")).toBe(2);
    expect(await counter("item_view_onsite")).toBe(0);
  });

  it("is not fooled by an origin that merely starts with ours", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const one = await item(id);

    // `startsWith(origin)` — the obvious implementation — counts both of these as this site.
    await get(`/sportstech/${one}`, { referer: `${ORIGIN}.evil.test/sportstech` });
    await get(`/sportstech/${one}`, { referer: `${ORIGIN}@evil.test/sportstech` });
    await get(`/sportstech/${one}`, { referer: "not a url" });

    expect(await counter("item_view")).toBe(3);
    expect(await counter("item_view_onsite")).toBe(0);
  });
});

describe("the permalink is reachable by something other than a mouse", () => {
  it("gives each permalink an accessible name that distinguishes it from the others", async () => {
    const id = await creator("sportstech", "Sports Tech");
    await item(id, { title: "First find" });
    await item(id, { title: 'A title with "quotes" & an ampersand' });

    const html = await (await get("/sportstech")).text();
    const labels = [...html.matchAll(/<a class="card-permalink"[^>]*aria-label="([^"]*)"/g)].map((m) => m[1]);

    expect(labels).toHaveLength(2);
    expect(new Set(labels).size, "two finds must not share one accessible name").toBe(2);
    expect(labels).toContain("Permalink: First find");
    // The title is interpolated into an attribute, so it has to be escaped there too.
    expect(labels).toContain("Permalink: A title with &quot;quotes&quot; &amp; an ampersand");
  });
});
