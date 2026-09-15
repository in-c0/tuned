// A published find, at an address of its own — and the three things that address has to be true of.
//
// Eighty-seven public items existed and not one had a URL. `sitemap.xml` advertised eight
// documents: the landing page, five feeds, terms and privacy. Search is the only arrival channel
// this loop can open without an owner action, a venue's permission or spend, and it was being
// offered almost nothing to index; a visitor who wanted to send someone one find could send only
// the feed, which is a different page tomorrow.
//
// These tests run the real Worker against a real D1 in workerd. The three properties that decide
// whether this surface is sound rather than merely present:
//
//   1. ONLY PUBLISHED ATTENTION GETS AN ADDRESS. `hidden` is a veto and `queued` is awaiting
//      approval. An address IS publication, so both must 404 — on the route and in the sitemap,
//      which are two separate gates that have to agree.
//   2. ONE FIND, ONE URL. The row must belong to the handle in the path. Reaching the same item
//      through another feed's handle is a 404, not a second document with the same content.
//   3. NO PREVIOUSLY-404ING ADDRESS STARTS ANSWERING. This route is `/:handle/:id` and is
//      registered after `/:handle/rss.xml`; a non-numeric second segment must still 404, and the
//      RSS route must keep its literal match.

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
  await DB.batch([
    DB.prepare("DELETE FROM items"),
    DB.prepare("DELETE FROM creators"),
    DB.prepare("DELETE FROM metric_days"),
  ]);
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
  over: Partial<{
    url: string;
    title: string;
    description: string;
    image_url: string;
    site_name: string;
    domain: string;
    category: string;
    note: string;
    visibility: string;
    via_creator_id: number | null;
  }> = {}
): Promise<number> {
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

const HUMAN_UA = "Mozilla/5.0 (X11; Linux x86_64) Chrome/128.0.0.0";
const BOT_UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

/** Always sends a user-agent. An *absent* one is classified as automation by `isBot`, which is
 *  correct and is also why a request with no header cannot stand in for a visitor here. */
async function get(path: string, headers: Record<string, string> = {}): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(
    new Request(`https://tuned.test${path}`, { headers: { "user-agent": HUMAN_UA, ...headers } }),
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

describe("a published find has an address", () => {
  it("serves the find and says whose attention it is", async () => {
    const c = await creator("sportstech", "Sportstech");
    const id = await item(c, { title: "A carbon plate that isn't", domain: "runnersworld.com" });
    const res = await get(`/sportstech/${id}`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("A carbon plate that isn't");
    expect(html).toContain("@sportstech</a> paid attention to this");
    // The outbound link is the primary action: this page records attention, it does not replace
    // the source.
    expect(html).toContain('href="https://example.com/a-find"');
  });

  it("names the provenance chain when the find came via an agent", async () => {
    const scout = await creator("scout", "Scout", "agent");
    const c = await creator("sportstech", "Sportstech");
    const id = await item(c, { via_creator_id: scout });
    const html = await (await get(`/sportstech/${id}`)).text();
    expect(html).toContain("Observed by <b>@scout</b>");
    expect(html).toContain("Read and chosen by <b>@sportstech</b>");
  });

  it("states that Tuned does not host the thing attended to", async () => {
    // The doctrine boundary, asserted rather than assumed: this surface must never read as a
    // destination that replaces the source, which is what a summarizer is.
    const c = await creator("sportstech", "Sportstech");
    const id = await item(c);
    const html = await (await get(`/sportstech/${id}`)).text();
    expect(html).toContain("Tuned does not host this and did not write it");
  });

  it("links back to the feed and to other finds on it, so the page is not an orphan", async () => {
    // Eighty-seven pages reachable only from a sitemap are eighty-seven orphans, which is both a
    // doorway pattern and a graph a crawler cannot walk. These links are what make the set
    // connected — so they have to point at find PAGES. A card that links out to the source looks
    // identical on screen and connects nothing.
    const c = await creator("sportstech", "Sportstech");
    const id = await item(c, { title: "The one being read" });
    const sibling = await item(c, { title: "A sibling find" });
    const html = await (await get(`/sportstech/${id}`)).text();
    expect(html).toContain('href="/sportstech"');
    expect(html).toContain("A sibling find");
    expect(html).toContain(`href="/sportstech/${sibling}"`);
    // ...and never itself, which would be a self-referential "more" block.
    expect(html).not.toContain(`href="/sportstech/${id}"`);
  });
});

describe("only published attention gets an address", () => {
  it("404s a hidden item — a veto is not a publication", async () => {
    const c = await creator("sportstech", "Sportstech");
    const id = await item(c, { visibility: "hidden" });
    expect((await get(`/sportstech/${id}`)).status).toBe(404);
  });

  it("404s a queued item — awaiting approval is not a publication", async () => {
    const c = await creator("sportstech", "Sportstech");
    const id = await item(c, { visibility: "queued" });
    expect((await get(`/sportstech/${id}`)).status).toBe(404);
  });

  it("keeps unpublished finds out of the sitemap, which is the second gate on the same fact", async () => {
    const c = await creator("sportstech", "Sportstech");
    const shown = await item(c, { title: "public" });
    const hidden = await item(c, { visibility: "hidden" });
    const queued = await item(c, { visibility: "queued" });
    const xml = await (await get("/sitemap.xml")).text();
    expect(xml).toContain(`<loc>https://justtuned.com/sportstech/${shown}</loc>`);
    expect(xml).not.toContain(`/sportstech/${hidden}<`);
    expect(xml).not.toContain(`/sportstech/${queued}<`);
  });
});

describe("one find, one URL", () => {
  it("404s an item reached through a handle that does not own it", async () => {
    const mine = await creator("sportstech", "Sportstech");
    await creator("wearables", "Wearables");
    const id = await item(mine);
    expect((await get(`/sportstech/${id}`)).status).toBe(200);
    expect((await get(`/wearables/${id}`)).status).toBe(404);
  });

  it("declares the canonical URL on the canonical origin, whichever host served it", async () => {
    const c = await creator("sportstech", "Sportstech");
    const id = await item(c);
    const html = await (await get(`/sportstech/${id}`)).text();
    expect(html).toContain(`<link rel="canonical" href="https://justtuned.com/sportstech/${id}">`);
    expect(html).toContain(`<meta property="og:url" content="https://justtuned.com/sportstech/${id}">`);
  });
});

describe("the route takes nothing that used to 404", () => {
  it("still 404s a non-numeric second segment", async () => {
    await creator("sportstech", "Sportstech");
    expect((await get("/sportstech/about")).status).toBe(404);
    expect((await get("/sportstech/12a")).status).toBe(404);
  });

  it("404s every spelling of an id that is not its canonical one", async () => {
    // `Number` coerces all of these to the same row, so without a canonical-form guard each one
    // is a second address for one find — the duplicate-URL defect arriving through the id rather
    // than through the handle.
    const c = await creator("sportstech", "Sportstech");
    const id = await item(c);
    expect((await get(`/sportstech/${id}`)).status).toBe(200);
    for (const alias of [`0${id}`, `00${id}`, `${id}.0`, ` ${id}`, `+${id}`, `0x${id.toString(16)}`]) {
      const res = await get(`/sportstech/${encodeURIComponent(alias)}`);
      expect(res.status, `"${alias}" is a second address for find ${id}`).toBe(404);
    }
    // ...and the scientific-notation spelling of a two-digit id, which `\\d+` would also admit
    // were it not for the leading-digit rule.
    expect((await get("/sportstech/1e3")).status).toBe(404);
  });

  it("leaves /:handle/rss.xml serving RSS", async () => {
    const c = await creator("sportstech", "Sportstech");
    await item(c);
    const res = await get("/sportstech/rss.xml");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/rss+xml");
  });

  it("404s a find under a reserved handle", async () => {
    expect((await get("/api/1")).status).toBe(404);
  });
});

describe("the find surface is counted", () => {
  it("writes item_view and the per-feed split", async () => {
    const c = await creator("sportstech", "Sportstech");
    const id = await item(c);
    await get(`/sportstech/${id}`);
    expect(await counter("item_view")).toBe(1);
    expect(await counter("item_view:sportstech")).toBe(1);
  });

  it("splits a self-declaring crawler into the _bot names", async () => {
    const c = await creator("sportstech", "Sportstech");
    const id = await item(c);
    await get(`/sportstech/${id}`, { "user-agent": BOT_UA });
    expect(await counter("item_view")).toBe(0);
    expect(await counter("item_view_bot")).toBe(1);
    expect(await counter("item_view_bot:sportstech")).toBe(1);
  });

  it("counts a tagged arrival under arrival_item, never under the arrival name EXP-010 and EXP-012 are registered over", async () => {
    // The pre-registration guard. `arrival:<tag>` is defined in two running experiments as a
    // count of FEED views; an item view written into that name would change what their counter
    // means inside their own window.
    const c = await creator("sportstech", "Sportstech");
    const id = await item(c);
    await get(`/sportstech/${id}?src=ooh-directory`);
    expect(await counter("arrival_item:ooh-directory")).toBe(1);
    expect(await counter("arrival:ooh-directory")).toBe(0);
  });

  it("counts no tag that is not on the allowlist", async () => {
    const c = await creator("sportstech", "Sportstech");
    const id = await item(c);
    await get(`/sportstech/${id}?src=made-up`);
    expect(await counter("arrival_item:made-up")).toBe(0);
    expect(await counter("item_view")).toBe(1);
  });

  it("writes nothing at all for a find that does not exist", async () => {
    await creator("sportstech", "Sportstech");
    await get("/sportstech/999");
    expect(await counter("item_view")).toBe(0);
    expect(await counter("item_view:sportstech")).toBe(0);
  });

  it("emits item_render and cannot emit feed_render, having no feed page script", async () => {
    // Structural, not incidental: feed_render is gated on #follow-btn inside CLIENT_JS, and this
    // page is served a different script entirely. EXP-011's sibling reading rests on that
    // denominator, so traffic that never saw a feed page must not be able to move it.
    const c = await creator("sportstech", "Sportstech");
    const id = await item(c);
    const html = await (await get(`/sportstech/${id}`)).text();
    expect(html).toContain("/api/pulse/item_render");
    expect(html).not.toContain("feed_render");
    expect(html).not.toContain('id="follow-btn"');
  });

  it("accepts item_render on the pulse route only from this origin", async () => {
    const ctx = createExecutionContext();
    const ok = await worker.fetch(
      new Request("https://tuned.test/api/pulse/item_render", {
        method: "POST",
        headers: { origin: "https://tuned.test", "user-agent": HUMAN_UA },
      }),
      env as never,
      ctx
    );
    await waitOnExecutionContext(ctx);
    expect(ok.status).toBe(204);
    expect(await counter("item_render")).toBe(1);

    const ctx2 = createExecutionContext();
    const foreign = await worker.fetch(
      new Request("https://tuned.test/api/pulse/item_render", {
        method: "POST",
        headers: { "user-agent": HUMAN_UA },
      }),
      env as never,
      ctx2
    );
    await waitOnExecutionContext(ctx2);
    expect(foreign.status).toBe(403);
    expect(await counter("item_render")).toBe(1);
  });
});

describe("what a find page tells a crawler and an unfurler", () => {
  it("leads its description with the attention claim rather than the source's blurb", async () => {
    // Two pages carrying the same summary is the shape a search engine reads as a scrape. The
    // distinguishing fact — who is paying attention — goes first.
    const c = await creator("sportstech", "Sportstech");
    const id = await item(c, {
      title: "A carbon plate that isn't",
      site_name: "Runner's World",
      description: "The source's own blurb about the shoe.",
    });
    const html = await (await get(`/sportstech/${id}`)).text();
    expect(html).toContain(
      `<meta name="description" content="@sportstech is paying attention to &quot;A carbon plate that isn't&quot; from Runner's World.`
    );
  });

  it("uses the find's own image for the card when it is absolute, and a large card with it", async () => {
    const c = await creator("sportstech", "Sportstech");
    const id = await item(c, { image_url: "https://cdn.example.com/cover.png" });
    const html = await (await get(`/sportstech/${id}`)).text();
    expect(html).toContain('<meta property="og:image" content="https://cdn.example.com/cover.png">');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image">');
  });

  it("falls back to the site icon and a small card when the stored image is relative", async () => {
    // Rows written before resolveImageUrl existed still hold root-relative og:image values; in an
    // src on our own origin they 404, and in an og:image they resolve against the *unfurler's*
    // origin. Neither may reach the card.
    const c = await creator("sportstech", "Sportstech");
    const id = await item(c, { image_url: "/static/arxiv-logo-fb.png" });
    const html = await (await get(`/sportstech/${id}`)).text();
    expect(html).toContain('<meta property="og:image" content="https://justtuned.com/icon-512.png">');
    expect(html).toContain('<meta name="twitter:card" content="summary">');
    expect(html).not.toContain("/static/arxiv-logo-fb.png");
  });

  it("advertises the feed so a reader that lands on a find can still subscribe", async () => {
    const c = await creator("sportstech", "Sportstech");
    const id = await item(c);
    const html = await (await get(`/sportstech/${id}`)).text();
    expect(html).toContain(
      '<link rel="alternate" type="application/rss+xml" title="Sportstech — Tuned" href="/sportstech/rss.xml">'
    );
  });
});
