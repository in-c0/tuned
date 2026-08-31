// What this site tells the readers that are not people.
//
// Three assertions here are the ones a looser test would miss, and each corresponds to a way
// this could ship looking correct and be wrong:
//
//   1. **The blocking policy is host-derived, not build-derived.** `workers_dev` is on and
//      Workers Builds raises a preview per branch, so several hosts serve this identical
//      Worker. A robots.txt baked at build time says the same thing on all of them. These
//      tests fetch from three different hosts and assert three different answers.
//   2. **`www` is deliberately NOT blocked.** It is the counter-intuitive half: blocking a
//      duplicate host means a crawler never fetches the page and so never reads the
//      `rel="canonical"` that would have consolidated it. A test that only asserted
//      "non-canonical hosts are blocked" would happily accept the regression.
//   3. **robots.txt and the `X-Robots-Tag` header cannot disagree.** They answer different
//      questions — do not fetch this, versus do not index this even though you found it
//      elsewhere — and for a capability URL like /studio/<token> only the second one is load
//      bearing. The drift test walks the disallow list out of robots.txt itself and requires a
//      real response on every path to carry the header.
//
// Everything runs the real Worker against a real D1 in workerd.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";
import { utcDay } from "../src/metrics";
import { PRIVATE_EXACT, PRIVATE_PREFIXES, isPrivatePath, robotsTxt, sitemapXml, w3cDate } from "../src/crawl";

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
    DB.prepare("DELETE FROM metric_days"),
    DB.prepare("DELETE FROM items"),
    DB.prepare("DELETE FROM creators"),
  ]);
});

// Deliberately not justtuned.com by default: every assertion about a canonical URL would pass
// vacuously if the request host were already the answer.
async function get(path: string, host = "https://preview-branch.attention-feed.workers.dev"): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`${host}${path}`), env as never, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

/** A creator plus, optionally, one item at a chosen visibility and time. */
async function seed(
  handle: string,
  opts: { visibility?: string; at?: string } = {}
): Promise<void> {
  const row = await DB.prepare(
    "INSERT INTO creators (handle, name, token, created_at) VALUES (?, ?, ?, ?) RETURNING id"
  )
    .bind(handle, handle, `tok-${handle}`, "2026-08-01T00:00:00.000Z")
    .first<{ id: number }>();
  if (!opts.visibility) return;
  await DB.prepare(
    "INSERT INTO items (creator_id, url, title, domain, visibility, created_at) VALUES (?, ?, ?, 'example.com', ?, ?)"
  )
    .bind(row!.id, `https://example.com/${handle}`, "a find", opts.visibility, opts.at ?? "2026-08-20T09:00:00.000Z")
    .run();
}

function locs(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
}

function directives(txt: string, name: string): string[] {
  return txt
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.toLowerCase().startsWith(`${name.toLowerCase()}:`))
    .map((l) => l.slice(name.length + 1).trim());
}

describe("robots.txt exists at all", () => {
  it("is served as plain text rather than falling through to the feed-handle route", async () => {
    const res = await get("/robots.txt", "https://justtuned.com");

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/plain");
    // Before this change `/robots.txt` matched `/:handle`, was refused as a reserved handle,
    // and 404'd — which a crawler reads as "no rules", i.e. crawl everything.
    expect(await res.text()).toContain("User-agent: *");
  });
});

describe("the policy depends on which host asked", () => {
  it("blocks the whole site on a preview host, which is neither linked nor meant to be found", async () => {
    const txt = await (await get("/robots.txt")).text();

    expect(directives(txt, "Disallow")).toEqual(["/"]);
    // No sitemap is advertised from a host that is not the site: it would invite a crawl of
    // canonical URLs from a duplicate origin's rules.
    expect(directives(txt, "Sitemap")).toEqual([]);
  });

  it("serves the real policy on the canonical host, and points at the sitemap", async () => {
    const txt = await (await get("/robots.txt", "https://justtuned.com")).text();

    expect(directives(txt, "Disallow")).not.toContain("/");
    expect(directives(txt, "Sitemap")).toEqual(["https://justtuned.com/sitemap.xml"]);
  });

  it("does NOT block www — blocking a duplicate host strands the canonical tag on it", async () => {
    // The whole point of run 108's `rel="canonical"` is that a crawler reads it and folds the
    // duplicate into the real page. A crawler that is forbidden to fetch www never reads it,
    // and the duplicate stays indexed on whatever it already knew. So www gets the permissive
    // policy and the canonical does the consolidating.
    const txt = await (await get("/robots.txt", "https://www.justtuned.com")).text();

    expect(directives(txt, "Disallow")).not.toContain("/");
    expect(directives(txt, "Sitemap")).toEqual(["https://justtuned.com/sitemap.xml"]);
  });

  it("fails closed on a host it does not recognise", () => {
    expect(directives(robotsTxt("justtuned.com.evil.test"), "Disallow")).toEqual(["/"]);
    expect(directives(robotsTxt(""), "Disallow")).toEqual(["/"]);
  });
});

describe("robots.txt and X-Robots-Tag cannot drift apart", () => {
  it("names every gated prefix and route", async () => {
    const disallowed = directives(await (await get("/robots.txt", "https://justtuned.com")).text(), "Disallow");

    for (const p of [...PRIVATE_PREFIXES, ...PRIVATE_EXACT]) {
      expect(disallowed, `robots.txt does not mention ${p}`).toContain(p);
    }
    // The two that matter most, spelled out so a future edit that quietly drops them fails
    // with a readable reason: both are capability URLs carrying a secret in the path.
    expect(disallowed).toContain("/studio/");
    expect(disallowed).toContain("/enter/");
  });

  it("sends noindex on a real response for every path robots.txt disallows", async () => {
    // A `Disallow` is a request not to fetch. It does not stop a URL that leaked through a
    // paste or a referrer from being indexed without ever being fetched from us. Note these
    // are 404s and 405s — the header has to be on the response the crawler actually gets,
    // not only on the happy path.
    for (const path of ["/studio/leaked-token", "/enter/leaked-token", "/api/version", "/home", "/today", "/login"]) {
      const res = await get(path, "https://justtuned.com");
      expect(res.headers.get("x-robots-tag"), `${path} is indexable`).toBe("noindex, nofollow");
    }
  });

  it("leaves the public surfaces indexable", async () => {
    await seed("sportstech", { visibility: "public" });

    for (const path of ["/", "/sportstech", "/sportstech/rss.xml", "/terms", "/privacy", "/robots.txt", "/sitemap.xml"]) {
      const res = await get(path, "https://justtuned.com");
      expect(res.headers.get("x-robots-tag"), `${path} was made unindexable`).toBeNull();
    }
  });

  it("matches gated paths exactly, so a feed handle that starts the same way is unaffected", () => {
    expect(isPrivatePath("/home")).toBe(true);
    expect(isPrivatePath("/homebrew")).toBe(false);
    expect(isPrivatePath("/readings")).toBe(false);
    expect(isPrivatePath("/read/12")).toBe(true);
  });
});

describe("sitemap.xml", () => {
  it("advertises the canonical origin even when a duplicate host serves it", async () => {
    await seed("sportstech", { visibility: "public" });
    const xml = await (await get("/sitemap.xml", "https://www.justtuned.com")).text();

    expect(locs(xml)).toContain("https://justtuned.com/sportstech");
    for (const loc of locs(xml)) expect(loc.startsWith("https://justtuned.com/")).toBe(true);
  });

  it("lists the landing page, the legal pages and every feed that has published", async () => {
    await seed("sportstech", { visibility: "public" });
    await seed("scout", { visibility: "public" });
    const res = await get("/sitemap.xml", "https://justtuned.com");

    expect(res.headers.get("content-type")).toContain("xml");
    expect(locs(await res.text()).sort()).toEqual([
      "https://justtuned.com/",
      "https://justtuned.com/privacy",
      "https://justtuned.com/scout",
      "https://justtuned.com/sportstech",
      "https://justtuned.com/terms",
    ]);
  });

  it("omits a feed with nothing published, and one whose only item is hidden", async () => {
    await seed("empty");
    await seed("vetoed", { visibility: "hidden" });
    await seed("live", { visibility: "public" });
    const found = locs(await (await get("/sitemap.xml", "https://justtuned.com")).text());

    expect(found).toContain("https://justtuned.com/live");
    expect(found).not.toContain("https://justtuned.com/empty");
    expect(found).not.toContain("https://justtuned.com/vetoed");
  });

  it("dates each feed from its newest public item, and the landing page from the newest anywhere", async () => {
    await seed("older", { visibility: "public", at: "2026-08-10T01:02:03.456Z" });
    await seed("newer", { visibility: "public", at: "2026-08-22T04:05:06.789Z" });
    const xml = await (await get("/sitemap.xml", "https://justtuned.com")).text();

    const entry = (loc: string) =>
      xml.match(new RegExp(`<loc>${loc.replace(/[/.]/g, "\\$&")}</loc><lastmod>([^<]*)</lastmod>`))?.[1];
    expect(entry("https://justtuned.com/older")).toBe("2026-08-10T01:02:03Z");
    expect(entry("https://justtuned.com/newer")).toBe("2026-08-22T04:05:06Z");
    // The landing page's demo block is the newest public item on the site, so that is when it
    // last changed — not when its oldest creator registered.
    expect(entry("https://justtuned.com/")).toBe("2026-08-22T04:05:06Z");
  });

  it("is well formed when there is nothing to list", async () => {
    const xml = await (await get("/sitemap.xml", "https://justtuned.com")).text();

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml.trimEnd().endsWith("</urlset>")).toBe(true);
    // No feed rows, so no `<lastmod>` on the landing page rather than a fabricated one.
    expect(locs(xml)).toEqual([
      "https://justtuned.com/",
      "https://justtuned.com/terms",
      "https://justtuned.com/privacy",
    ]);
    expect(xml).not.toContain("<lastmod>");
  });

  it("omits lastmod rather than inventing one when a stored date is unusable", () => {
    expect(w3cDate("not a date")).toBeNull();
    expect(w3cDate("")).toBeNull();
    expect(w3cDate(null)).toBeNull();
    expect(sitemapXml([{ path: "/x", lastmod: "nonsense" }])).not.toContain("<lastmod>");
  });

  it("escapes anything interpolated into the XML", () => {
    expect(sitemapXml([{ path: "/a&b<c" }])).toContain("<loc>https://justtuned.com/a&amp;b&lt;c</loc>");
  });
});

describe("both routes are visible to the operating loop", () => {
  it("counts a fetch, split by whether the fetcher declares itself", async () => {
    await get("/robots.txt", "https://justtuned.com");
    await get("/sitemap.xml", "https://justtuned.com");

    const { results } = await DB.prepare("SELECT name, count FROM metric_days WHERE day = ?")
      .bind(utcDay())
      .all<{ name: string; count: number }>();
    const counters = Object.fromEntries(results.map((r) => [r.name, r.count]));

    // The default request carries no user-agent, which `isBot` treats as a bot — correct here,
    // because on these two routes there is no other kind of caller. Neither name is a person
    // and neither is demand; this only answers "has anything ever asked for the rules".
    expect(counters["robots_fetch_bot"]).toBe(1);
    expect(counters["sitemap_fetch_bot"]).toBe(1);
  });
});
