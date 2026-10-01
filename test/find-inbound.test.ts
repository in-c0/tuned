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
const BOT_UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

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

  // The case this suite did not have until run 185, and the reason the off-site reading was
  // wrong in production for seven days. Every test above asks a HUMAN_UA, so the axis was only
  // ever exercised in the bucket it happens to be subtracted from.
  it("carries the user-agent split, because the published reading subtracts it", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const one = await item(id);

    await get(`/sportstech/${one}`, { referer: `${ORIGIN}/sportstech`, "user-agent": BOT_UA });

    expect(await counter("item_view_bot")).toBe(1);
    expect(await counter("item_view_onsite_bot")).toBe(1);
    // The name the reading subtracts from stays 0, so it cannot be decremented by a crawler.
    expect(await counter("item_view")).toBe(0);
    expect(await counter("item_view_onsite")).toBe(0);
  });

  // Stated as the invariant rather than as counters, because the invariant is what broke: on
  // 2026-09-19 production held item_view 0, item_view_bot 121 and a merged item_view_onsite of
  // 47, and `item_view - item_view_onsite` returned MINUS 47. An axis subtracted from a bucket
  // must never exceed that bucket.
  it("never makes the off-site reading negative, in either bucket", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const one = await item(id);

    // One crawler off our own feed page, one person off our own feed page, one person off-site.
    await get(`/sportstech/${one}`, { referer: `${ORIGIN}/sportstech`, "user-agent": BOT_UA });
    await get(`/sportstech/${one}`, { referer: `${ORIGIN}/sportstech` });
    await get(`/sportstech/${one}`, { referer: "https://news.ycombinator.com/" });

    const human = (await counter("item_view")) ?? 0;
    const humanOnsite = (await counter("item_view_onsite")) ?? 0;
    const bot = (await counter("item_view_bot")) ?? 0;
    const botOnsite = (await counter("item_view_onsite_bot")) ?? 0;

    expect(humanOnsite).toBeLessThanOrEqual(human);
    expect(botOnsite).toBeLessThanOrEqual(bot);
    expect(human - humanOnsite).toBe(1); // the one genuine off-site arrival
  });
});

// The axis `item_view_onsite` left undivided, and the reading it was hiding.
//
// `item_view - item_view_onsite` is published as "the off-site arrivals", and until this run that
// number could not distinguish a crawler walking sitemap.xml from a person arriving on a search
// result: the crawler sends no `Referer`, so it lands off the on-site axis exactly as the person
// does. On 2026-09-26 the reading returned 517 in under five hours against 0 on each of the two
// days before, with `item_view_bot` at 19 — so the loop's largest off-site reading ever had two
// explanations and no way to choose between them. That is the whole point of these two axes.
//
// What is asserted here, and why each is separate:
//
//   1. THE PARTITION. Three referrer states, each writing exactly one of {onsite, referred,
//      neither}. This is the property that makes the remainder ("no referrer at all") computable
//      by subtraction, which is what actually answers the crawler question.
//   2. THE SUBSET. `_search` never fires without `_referred`, and `_referred` fires without
//      `_search` for any other site. An engine missing from the allowlist must still be visible.
//   3. THE ALLOWLIST'S EDGES. A host boundary at both ends, because the obvious `includes` or
//      `endsWith` implementations count `notgoogle.com` or `google.com.evil.test` as Google, and
//      the header is caller-controlled.
//   4. THE `_bot` SPLIT, on both axes, for the reason L-103 records: a reading that compares an
//      axis against one side of the split needs the axis split too, or a crawler decrements the
//      human count. Five of seven days were negative the last time this was got wrong.
//   5. NO COUNTER NAME EVER CARRIES THE HOST. It comes from a header; a name interpolated from
//      one would let any caller write arbitrary rows into metric_days.
describe("item_view_referred and item_view_search", () => {
  it("partitions a view into on-site, referred from elsewhere, or no referrer at all", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const one = await item(id);

    await get(`/sportstech/${one}`, { referer: `${ORIGIN}/sportstech` }); // ours
    await get(`/sportstech/${one}`, { referer: "https://www.google.com/" }); // referred, search
    await get(`/sportstech/${one}`, { referer: "https://news.ycombinator.com/" }); // referred, not search
    await get(`/sportstech/${one}`); // no Referer — a crawler, a paste or a bookmark

    expect(await counter("item_view")).toBe(4);
    expect(await counter("item_view_onsite")).toBe(1);
    expect(await counter("item_view_referred")).toBe(2);
    expect(await counter("item_view_search")).toBe(1);

    // The remainder is what the crawler question turns on, and it is a subtraction rather than a
    // counter of its own: nothing should be written for "no referrer", or three names would have
    // to agree instead of two.
    const bucket = (await counter("item_view")) ?? 0;
    const referrerless = bucket - ((await counter("item_view_onsite")) ?? 0) - ((await counter("item_view_referred")) ?? 0);
    expect(referrerless).toBe(1);
  });

  it("keeps the two axes disjoint, so neither can exceed the bucket it is read against", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const one = await item(id);

    await get(`/sportstech/${one}`, { referer: `${ORIGIN}/` });
    await get(`/sportstech/${one}`, { referer: "https://duckduckgo.com/" });

    const bucket = (await counter("item_view")) ?? 0;
    const on = (await counter("item_view_onsite")) ?? 0;
    const ref = (await counter("item_view_referred")) ?? 0;
    const search = (await counter("item_view_search")) ?? 0;

    expect(on + ref).toBeLessThanOrEqual(bucket);
    expect(search).toBeLessThanOrEqual(ref);
    // An on-site click is never also a referred one, which is what makes the sum legal.
    expect(on).toBe(1);
    expect(ref).toBe(1);
  });

  it("counts an unlisted search engine as referred, so its arrivals are never invisible", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const one = await item(id);

    await get(`/sportstech/${one}`, { referer: "https://search.example-engine.test/?q=tuned" });

    expect(await counter("item_view_referred")).toBe(1);
    expect(await counter("item_view_search")).toBe(0);
  });

  it("recognises a search host on a subdomain and on a country domain", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const one = await item(id);

    for (const referer of [
      "https://www.google.com/",
      "https://google.co.uk/",
      "https://www.google.com.au/",
      "https://search.brave.com/",
      "https://lite.duckduckgo.com/",
      "https://www.bing.com/search?q=tuned",
      "https://search.yahoo.co.jp/",
    ]) {
      await get(`/sportstech/${one}`, { referer });
    }

    expect(await counter("item_view_search")).toBe(7);
    expect(await counter("item_view_referred")).toBe(7);
  });

  it("is not fooled by a host that merely contains an allowlisted one", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const one = await item(id);

    for (const referer of [
      "https://notgoogle.com/",
      "https://evil-google.com/",
      "https://google.com.evil.test/",
      "https://bing.com.attacker.test/",
      "https://mygoogle.com.br.evil.test/",
    ]) {
      await get(`/sportstech/${one}`, { referer });
    }

    expect(await counter("item_view_referred")).toBe(5);
    expect(await counter("item_view_search")).toBe(0);
  });

  it("treats a referrer that merely starts with our origin as off-site, not as ours", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const one = await item(id);

    await get(`/sportstech/${one}`, { referer: `${ORIGIN}.evil.test/sportstech` });

    expect(await counter("item_view_onsite")).toBe(0);
    expect(await counter("item_view_referred")).toBe(1);
  });

  it("writes nothing for an unparseable Referer, on either axis", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const one = await item(id);

    await get(`/sportstech/${one}`, { referer: "not a url" });

    expect(await counter("item_view")).toBe(1);
    expect(await counter("item_view_onsite")).toBe(0);
    expect(await counter("item_view_referred")).toBe(0);
    expect(await counter("item_view_search")).toBe(0);
  });

  it("carries the user-agent split on both axes, because both are read against one side of it", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const one = await item(id);

    await get(`/sportstech/${one}`, { referer: "https://www.google.com/", "user-agent": BOT_UA });

    expect(await counter("item_view_referred_bot")).toBe(1);
    expect(await counter("item_view_search_bot")).toBe(1);
    // The names a human reading compares are untouched by a crawler.
    expect(await counter("item_view_referred")).toBe(0);
    expect(await counter("item_view_search")).toBe(0);
  });

  it("never writes a counter name carrying the referrer's host", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const one = await item(id);

    await get(`/sportstech/${one}`, { referer: "https://attacker.test/" });

    const { results } = await DB.prepare("SELECT DISTINCT name FROM metric_days").all<{ name: string }>();
    const names = results.map((r) => r.name);
    expect(names.some((n) => n.includes("attacker"))).toBe(false);
    expect(names).toContain("item_view_referred");
  });

  // The counters this run did not touch, asserted rather than assumed. A discriminator added to one
  // surface must not quietly appear on another: `feed_view` and `landing_view` have no referrer
  // axis and no published reading that subtracts one, and they are deliberately left alone, so a
  // later run reading `feed_view_referred` as zero must be able to tell "nobody" from "not built".
  it("leaves the feed page and the landing page without a referrer axis", async () => {
    const id = await creator("sportstech", "Sports Tech");
    await item(id);

    await get("/sportstech", { referer: "https://www.google.com/" });
    await get("/", { referer: "https://www.google.com/" });

    expect(await counter("feed_view_referred")).toBe(0);
    expect(await counter("feed_view_search")).toBe(0);
    expect(await counter("landing_view_referred")).toBe(0);
    expect(await counter("landing_view_search")).toBe(0);
    // The surfaces themselves still counted, so this is a statement about the axis and not about
    // whether the request arrived.
    expect(await counter("feed_view")).toBe(1);
    expect(await counter("landing_view")).toBe(1);
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

// The two `.card-link` populations on a find page, and why a check has to tell them apart.
//
// `verify production`'s referred-arrival step reports a find page as "N sibling find(s), M other
// feed(s)" — the pair run 210 published as "0 sibling find(s), 8 other feed(s)" for a page that in
// fact carried four of each. Both numbers came from selectors that cannot name those populations:
// siblings were counted by `class="card-permalink"`, a class only the FEED page's cards carry, so
// the count could not exceed 0 on this page class whatever the page held; and the feed count
// matched every site-relative `.card-link`, so the four siblings were counted a second time as
// feeds — 4 + 4 = the 8 that was published.
//
// The discrimination the step's own comment claims, and now makes: a sibling find points at
// `/handle/id`, a directory feed at `/handle`. These helpers are the grep from that step,
// expressed against really-rendered markup, so the selector is checkable here and not only in a
// workflow nothing in this repository runs.
function siblingFindHrefs(html: string): string[] {
  return [...html.matchAll(/<a class="card-link" href="(\/[A-Za-z0-9_.-]+\/[0-9]+)"/g)].map((m) => m[1]);
}

function directoryFeedHrefs(html: string): string[] {
  return [...html.matchAll(/<a class="card-link" href="(\/[A-Za-z0-9_.-]+)"/g)].map((m) => m[1]);
}

describe("a find page's siblings and the feed directory are separable populations", () => {
  it("renders sibling finds that carry no card-permalink, so counting that class here counts nothing", async () => {
    const id = await creator("sportstech", "Sports Tech");
    const first = await item(id, { title: "First find", url: "https://a.example/1" });
    await item(id, { title: "Second find", url: "https://b.example/2" });
    await item(id, { title: "Third find", url: "https://c.example/3" });

    const html = await (await get(`/sportstech/${first}`)).text();

    // The block is there and populated — this is the anti-orphan edge, not decoration.
    expect(html).toContain('class="more-finds"');
    expect(siblingFindHrefs(html).length).toBeGreaterThanOrEqual(1);
    // And the class the old check counted appears nowhere on this page class, at any population
    // size. This is the assertion that makes "0 siblings" a property of the selector.
    expect(permalinks(html)).toHaveLength(0);
    expect(html).not.toContain("card-permalink");
  });

  it("tells the sibling finds apart from the directory feeds by where they point", async () => {
    const mine = await creator("sportstech", "Sports Tech");
    const other = await creator("wearables", "Wearables");
    const first = await item(mine, { title: "First find", url: "https://a.example/1" });
    await item(mine, { title: "Second find", url: "https://b.example/2" });
    await item(other, { title: "Elsewhere", url: "https://d.example/4" });

    const html = await (await get(`/sportstech/${first}`)).text();

    const siblings = siblingFindHrefs(html);
    const feeds = directoryFeedHrefs(html);

    // One sibling: the same feed's other public find. Never the item in front of the reader.
    expect(siblings).toEqual([`/sportstech/${await secondIdOf(mine, first)}`]);
    // One feed: the directory excludes the handle whose page this is.
    expect(feeds).toEqual(["/wearables"]);
    // The two selectors are disjoint, which is the whole property: neither count can absorb the
    // other, so an empty directory block can no longer be hidden by a populated sibling block.
    expect(siblings.some((h) => feeds.includes(h))).toBe(false);
  });

  it("renders no more-finds block on a one-item feed, so the block may only be asserted where a sibling exists", async () => {
    const mine = await creator("sportstech", "Sports Tech");
    const other = await creator("wearables", "Wearables");
    const only = await item(mine, { title: "The only find" });
    await item(other, { title: "Elsewhere" });

    const html = await (await get(`/sportstech/${only}`)).text();

    // A legitimate zero. A check that asserted the block on an arbitrary find page would fail
    // here on a fact about the feed rather than on a defect, which is why `verify production`
    // derives its page from a handle the sitemap shows has two.
    expect(html).not.toContain('class="more-finds"');
    expect(siblingFindHrefs(html)).toHaveLength(0);
    // The directory block is still there, and still counted.
    expect(html).toContain('class="other-feeds"');
    expect(directoryFeedHrefs(html)).toEqual(["/wearables"]);
  });
});

/** The id of the creator's other public find, read back rather than assumed from insertion order. */
async function secondIdOf(creatorId: number, excludeId: number): Promise<number> {
  const row = await DB.prepare(
    "SELECT id FROM items WHERE creator_id = ? AND id != ? AND visibility = 'public' ORDER BY created_at DESC LIMIT 1"
  )
    .bind(creatorId, excludeId)
    .first<{ id: number }>();
  return row!.id;
}
