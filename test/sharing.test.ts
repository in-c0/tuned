// What a public page says about itself when something other than a browser reads it.
//
// Run 86 found that no page in this product carried `<link rel="alternate">`, so every feed
// reader was told this site has no feed. This is the same defect one layer out, on the same
// surface, and it survived that fix: the public feed page — the destination of every
// distribution link Tuned will ever post — carried a `<title>`, an icon, and after run 86 the
// RSS link, and **nothing else**. No description, no Open Graph, no canonical.
//
// Two concrete consequences, neither hypothetical:
//
//   1. Pasted into Slack, Discord, Mastodon, X, LinkedIn, iMessage or WhatsApp, the URL
//      unfurls as bare text. Every one of those clients reads Open Graph and there was none
//      to read. The one distribution route this loop has ever reached A4 on posts a URL to a
//      public venue, and the venue's readers see whatever that URL renders as.
//   2. Three origins serve this identical Worker — `justtuned.com`, `www.justtuned.com` and
//      the `workers_dev` subdomain (wrangler.jsonc) — with nothing telling a crawler which
//      one is the page. That is the exact duplicate-content case `rel="canonical"` exists for.
//
// These tests run the real Worker against a real D1 in workerd. The assertions that matter are
// the ones a string check would miss: that the advertised URL is the *canonical public* one and
// not the host that happened to make the request, and that a hostile creator name cannot break
// out of an attribute it is interpolated into.

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

async function seed(
  handle: string,
  name: string,
  kind = "human",
  bio: string | null = null
): Promise<void> {
  const row = await DB.prepare(
    "INSERT INTO creators (handle, name, token, kind, bio, created_at) VALUES (?, ?, ?, ?, ?, ?) RETURNING id"
  )
    .bind(handle, name, `tok-${handle}`, kind, bio, new Date().toISOString())
    .first<{ id: number }>();
  await DB.prepare(
    "INSERT INTO items (creator_id, url, title, domain, visibility, created_at) VALUES (?, ?, ?, 'example.com', 'public', ?)"
  )
    .bind(row!.id, "https://example.com/a", "a find", new Date().toISOString())
    .run();
}

// Deliberately not justtuned.com. Every assertion below about a canonical or og:url would pass
// vacuously if the request host were already the answer.
async function get(path: string, host = "https://tuned.test"): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`${host}${path}`), env as never, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

/** The content of `<meta name=X>` or `<meta property=X>`, or undefined. Attribute order is not
 *  assumed, because nothing guarantees it and a test that depends on it fails for the wrong
 *  reason the first time the tag is edited. */
function meta(html: string, key: string): string | undefined {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const k = tag.match(/\b(?:name|property)="([^"]*)"/i)?.[1];
    if (k === key) return tag.match(/\bcontent="([^"]*)"/i)?.[1];
  }
  return undefined;
}

function canonical(html: string): string | undefined {
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if (tag.match(/\brel="([^"]*)"/i)?.[1] === "canonical") {
      return tag.match(/\bhref="([^"]*)"/i)?.[1];
    }
  }
  return undefined;
}

describe("a public feed page describes itself to software", () => {
  it("carries a description that names the feed it is describing", async () => {
    await seed("sportstech", "Sportstech");
    const html = await (await get("/sportstech")).text();

    const desc = meta(html, "description");
    expect(desc, "no <meta name=description> — a search result has no snippet to show").toBeDefined();
    expect(desc).toContain("@sportstech");
    expect(desc).toContain("Sportstech");
  });

  it("carries the Open Graph set every link unfurler reads", async () => {
    await seed("sportstech", "Sportstech");
    const html = await (await get("/sportstech")).text();

    // og:title and og:description are what a chat client renders; without og:url and
    // og:image several clients decline to render a card at all.
    for (const key of ["og:type", "og:site_name", "og:title", "og:description", "og:url", "og:image"]) {
      expect(meta(html, key), `missing ${key} — the link unfurls as bare text`).toBeTruthy();
    }
    expect(meta(html, "og:site_name")).toBe("Tuned");
    expect(meta(html, "og:title")).toContain("Sportstech");
  });

  it("advertises the canonical public origin, not the host that made the request", async () => {
    await seed("sportstech", "Sportstech");
    // Served from a host that is not the canonical one — the workers.dev case, and the
    // www. case, both of which serve this same Worker.
    const html = await (await get("/sportstech", "https://attention-feed.workers.dev")).text();

    expect(canonical(html)).toBe("https://justtuned.com/sportstech");
    expect(meta(html, "og:url")).toBe("https://justtuned.com/sportstech");
    // The card image has to be absolute: a relative og:image resolves against the unfurler's
    // own origin, not ours, which is the same class of bug meta.test.ts pins for item images.
    expect(meta(html, "og:image")).toMatch(/^https:\/\/justtuned\.com\//);
  });

  it("claims the card shape it can actually fill", async () => {
    await seed("sportstech", "Sportstech");
    const html = await (await get("/sportstech")).text();
    // The only image this service owns is a 512x512 icon. `summary_large_image` promises a
    // banner and renders a stretched icon when there is none, so the smaller card is the
    // honest one rather than the modest one.
    expect(meta(html, "twitter:card")).toBe("summary");
  });

  it("says an agent feed is an agent feed, and does not say it of a human one", async () => {
    await seed("sportstech", "Sportstech", "agent");
    const agent = await (await get("/sportstech")).text();
    expect(meta(agent, "description")).toMatch(/AI agent/i);

    await seed("ava", "Ava", "human");
    const human = await (await get("/ava")).text();
    expect(meta(human, "description")).not.toMatch(/AI agent/i);
  });

  it("carries a creator's own bio into the description when there is one", async () => {
    await seed("sportstech", "Sportstech", "agent", "Validated wearable sensing research.");
    const html = await (await get("/sportstech")).text();
    expect(meta(html, "description")).toContain("Validated wearable sensing research.");
  });

  it("cannot be broken out of by a hostile name or bio", async () => {
    // A creator name is operator-supplied today, but these values are interpolated into
    // attributes on a public page and the escaping is the only thing between them and an
    // injected tag. Asserted here rather than assumed from esc()'s existence.
    await seed("x", '"><script>alert(1)</script>', "human", '"><img onerror=1>');
    const html = await (await get("/x")).text();

    const head = html.slice(0, html.indexOf("</head>"));
    expect(head).not.toContain("<script>alert(1)</script>");
    expect(head).not.toContain("<img onerror=1>");
    // The values still have to arrive, escaped — an assertion that only checks for absence
    // passes just as well on a page that dropped them.
    expect(meta(html, "og:title")).toContain("&quot;&gt;&lt;script&gt;");
  });
});

describe("the landing page is canonical about itself too", () => {
  it("names one canonical URL for the three origins that serve it", async () => {
    const html = await (await get("/", "https://www.justtuned.com")).text();
    expect(canonical(html)).toBe("https://justtuned.com/");
    expect(meta(html, "og:url")).toBe("https://justtuned.com/");
  });

  it("keeps the description and og:description it already had", async () => {
    const html = await (await get("/")).text();
    // These two strings are reviewed public copy and differ from each other on purpose.
    // This change adds tags; it must not quietly rewrite the ones that were there.
    expect(meta(html, "description")).toBe(
      "Tuned — follow attention, not content. A live page of what someone is actually watching, reading and listening to."
    );
    expect(meta(html, "og:description")).toBe(
      "Follow what people pay attention to — not what they post."
    );
  });

  it("gains the card image and card shape it was missing", async () => {
    const html = await (await get("/")).text();
    expect(meta(html, "og:image")).toBe("https://justtuned.com/icon-512.png");
    expect(meta(html, "twitter:card")).toBe("summary");
    expect(meta(html, "og:site_name")).toBe("Tuned");
  });
});
