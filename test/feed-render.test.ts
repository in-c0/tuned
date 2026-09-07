// `feed_render` — whether a browser engine ever parsed a public feed page.
//
// The landing page has this rung and the feed page does not. `landing_view` alone could not say
// whether a request that looked human-shaped was a rendering browser or one of the scanners,
// uptime probes and preview fetchers that take the HTML and execute none of it; that is why
// `landing_render` exists. `/:handle` is in exactly the position `/` was in before run 138 —
// `feed_view:sportstech` reads 37 across 21 complete days and nothing on this site can say whether
// one of them was a browser.
//
// It matters now rather than later because both open items in ops/DISTRIBUTION.md point at a feed
// page, both are owner-gated, either can land on any day, and **counters do not backfill**. The
// first arrival is precisely the reading that cannot be reconstructed afterwards.
//
// No interim value of `landing_render` is quoted in this file or the comments it describes:
// EXP-011 is pre-registered to grade R = landing_render ÷ landing_view over 2026-09-05 …
// 2026-09-18, and a partial series reported as a finding is what pre-registration forbids.
//
// The two assertions that carry weight here are negative ones. `feed_render` must never reach the
// landing page, whose views are EXP-011's denominator; and the studio page — which is served this
// same script — must not emit it either, which is guaranteed by the follow button rather than by a
// second copy of the script, so the guarantee is asserted on the served document.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import indexSource from "../src/index.ts?raw";
import worker from "../src/index";
import { utcDay } from "../src/metrics";

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
  await DB.batch([DB.prepare("DELETE FROM metric_days"), DB.prepare("DELETE FROM creators")]);
});

const ORIGIN = "https://tuned.test";
const HUMAN_UA = "Mozilla/5.0 (X11; Linux x86_64) Chrome/128.0.0.0";
const BOT_UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

/** The whole day's table, so an axis quietly summed into a bucket shows up as a wrong shape
 *  rather than as a number a single-name probe would never look at. */
async function countersToday(): Promise<Record<string, number>> {
  const { results } = await DB.prepare("SELECT name, count FROM metric_days WHERE day = ?")
    .bind(utcDay())
    .all<{ name: string; count: number }>();
  return Object.fromEntries(results.map((r) => [r.name, r.count]));
}

async function seedFeed(handle: string, kind: "agent" | "human" = "agent"): Promise<string> {
  const token = `tok-${handle}`;
  await DB.prepare("INSERT INTO creators (handle, name, token, kind) VALUES (?, ?, ?, ?)")
    .bind(handle, handle, token, kind)
    .run();
  return token;
}

async function get(path: string, ua = HUMAN_UA): Promise<string> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`${ORIGIN}${path}`, { headers: { "user-agent": ua } }), env as never, ctx);
  await waitOnExecutionContext(ctx);
  return res.text();
}

async function pulse(name: string, headers: Record<string, string>): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(
    new Request(`${ORIGIN}/api/pulse/${name}`, { method: "POST", headers }),
    env as never,
    ctx
  );
  await waitOnExecutionContext(ctx);
  return res;
}

describe("feed_render is allowlisted and behaves like every other pulse", () => {
  it("is accepted same-origin and counted", async () => {
    const res = await pulse("feed_render", { origin: ORIGIN, "user-agent": HUMAN_UA });

    expect(res.status).toBe(204);
    expect(await countersToday()).toEqual({ feed_render: 1 });
  });

  it("splits a self-declaring client out of the unsuffixed name", async () => {
    // Googlebot renders JavaScript. Landing unsuffixed, it would read as browsers on the first
    // crawl after a deploy — the same failure `landing_render_bot` was split out to prevent.
    await pulse("feed_render", { origin: ORIGIN, "user-agent": BOT_UA });

    expect(await countersToday()).toEqual({ feed_render_bot: 1 });
  });

  it("is refused without this site's Origin, and writes nothing", async () => {
    const res = await pulse("feed_render", { "user-agent": HUMAN_UA });

    expect(res.status).toBe(403);
    expect(await countersToday()).toEqual({});
  });

  it("accumulates rather than overwriting, so a day is a count of page loads", async () => {
    await pulse("feed_render", { origin: ORIGIN, "user-agent": HUMAN_UA });
    await pulse("feed_render", { origin: ORIGIN, "user-agent": HUMAN_UA });

    expect(await countersToday()).toEqual({ feed_render: 2 });
  });

  it("is on the server allowlist rather than merely tolerated by it", () => {
    expect(indexSource).toMatch(/const PULSE_COUNTERS = new Set\(\[[^\]]*"feed_render"/);
  });
});

describe("the page actually emits it — the half a server test cannot see", () => {
  it("ships the beacon on the feed page a distribution listing would point at", async () => {
    await seedFeed("sportstech");
    const html = await get("/sportstech");

    expect(html, "the feed page no longer contains a follow button").toContain('id="follow-btn"');
    expect(html, "the feed_render beacon is not on the served feed page").toContain("/api/pulse/feed_render");
  });

  it("fires it on script execution rather than behind an interaction", async () => {
    // The whole point of this name is that it asks nothing of the visitor: a scanner that does
    // not scroll and a reader who looks and leaves must both be counted. Gated behind the click
    // handler it would duplicate `follow_open` and measure nothing new, which is a defect a
    // server-side counter test cannot see — so it is asserted against the served source.
    await seedFeed("sportstech");
    const html = await get("/sportstech");

    // Stated as an ordering rather than a character window, so a comment edit cannot break it and
    // a real move cannot slip through one: the beacon sits after the follow button is resolved —
    // which is the guard that keeps it off the studio page — and before any click handler is
    // registered, which is what makes it unconditional on a page load.
    const guard = html.indexOf('getElementById("follow-btn")');
    const beacon = html.indexOf("/api/pulse/feed_render");
    const click = html.indexOf('addEventListener("click"', guard);

    expect(guard, "the follow button is no longer resolved in the page script").toBeGreaterThan(-1);
    expect(beacon, "the feed_render beacon is gone from the page script").toBeGreaterThan(-1);
    expect(click, "the follow button's click handler is gone").toBeGreaterThan(-1);
    expect(beacon, "feed_render is no longer gated on the follow button").toBeGreaterThan(guard);
    expect(
      beacon,
      "feed_render moved inside or after the click handler — it has become a second follow_open and counts nothing new"
    ).toBeLessThan(click);
  });

  it("never reaches the landing page, whose views are EXP-011's denominator", async () => {
    const html = await get("/");

    expect(html, "feed_render reached the landing page").not.toContain("feed_render");
    // The stop condition stated positively as well: `/` is unchanged in what it reports.
    expect(html, "the landing page no longer fires landing_render").toContain('pulse("landing_render")');
  });

  it("is inert on the studio page, which is served this same script and has no follow button", async () => {
    const token = await seedFeed("sportstech");
    const html = await get(`/studio/${token}`);

    expect(html, "the studio page has grown a follow button, which would make it emit feed_render").not.toContain(
      'id="follow-btn"'
    );
    // The string is present — studio and public pages share CLIENT_JS — and inert, because the
    // guard above never resolves. Asserting its absence would be asserting the wrong thing, so
    // what is asserted is the guard: this is the same argument follow_open already rests on.
    expect(html).toContain("/api/pulse/feed_render");
  });

  it("does not put a handle in the counter name", async () => {
    // The pulse name is the whole key. A handle taken from the URL bar would mint rows in
    // metric_days, which is why this name is site-wide and why the ratio caveat is documented
    // rather than the counter made per-feed.
    await seedFeed("sportstech");
    const html = await get("/sportstech");

    expect(html).not.toContain("/api/pulse/feed_render:");
    expect(html).not.toMatch(/pulse\/feed_render\/\w/);
  });
});
