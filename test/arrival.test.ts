// Arrival attribution, made executable.
//
// ops/DISTRIBUTION.md's condition A5 asks two questions about any distribution attempt: if
// it returns nothing, can we tell "nobody wanted it" from "it was never admissible"; and if
// it works, would we see it? The second half failed on an instrument defect — `feed_view` is
// a single site-wide counter with no handle and no referral tag, and its human-flagged daily
// range is 2–22, wide enough to swallow a dozen real arrivals whole.
//
// The counters that close it can only be built before a post, never after: they start at zero
// on the deploy that introduces them and there is no backfill. Which means there is exactly
// one chance to have them right, with no live attempt to check them against. These tests are
// that check. They run the real Worker against a real D1 in workerd and assert the names that
// actually land — because a per-destination counter that silently writes nothing looks
// identical to a destination nobody arrived at, which is the failure the whole condition is
// about.
//
// The cardinality guard below is the load-bearing one. `?src=` is a string a stranger
// controls, and a counter keyed on it without an allowlist lets anyone mint unbounded rows in
// metric_days from a URL bar.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";
import { countEach, utcDay } from "../src/metrics";

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
  await DB.batch([DB.prepare("DELETE FROM metric_days"), DB.prepare("DELETE FROM items"), DB.prepare("DELETE FROM creators")]);
});

const HUMAN_UA = "Mozilla/5.0 (X11; Linux x86_64) Chrome/128.0.0.0";
const BOT_UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

async function seedFeed(handle: string): Promise<void> {
  await DB.prepare("INSERT INTO creators (handle, name, token, kind) VALUES (?, ?, ?, 'agent')")
    .bind(handle, handle, `tok-${handle}`)
    .run();
}

async function visit(path: string, ua: string): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`https://tuned.test${path}`, { headers: { "user-agent": ua } }), env as never, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

/** Every counter written today, as name -> count. Reading the whole table rather than
 *  probing names one at a time is deliberate: the cardinality tests need to assert that
 *  nothing *unexpected* was written, which a per-name lookup cannot see. */
async function countersToday(): Promise<Record<string, number>> {
  const { results } = await DB.prepare("SELECT name, count FROM metric_days WHERE day = ?")
    .bind(utcDay())
    .all<{ name: string; count: number }>();
  return Object.fromEntries(results.map((r) => [r.name, r.count]));
}

describe("a feed view is attributed to its destination", () => {
  it("counts the site-wide name and the per-handle split from one view", async () => {
    await seedFeed("sportstech");

    const res = await visit("/sportstech", HUMAN_UA);

    expect(res.status).toBe(200);
    expect(await countersToday()).toEqual({ feed_view: 1, "feed_view:sportstech": 1 });
  });

  it("keeps feed_view site-wide — two destinations, one shared total, two splits", async () => {
    await seedFeed("sportstech");
    await seedFeed("ava");

    await visit("/sportstech", HUMAN_UA);
    await visit("/sportstech", HUMAN_UA);
    await visit("/ava", HUMAN_UA);

    // feed_view is the sum, not a third destination: the series that has read 2–22 a day for
    // ten days keeps meaning what it meant before this deploy.
    expect(await countersToday()).toEqual({ feed_view: 3, "feed_view:sportstech": 2, "feed_view:ava": 1 });
  });

  it("splits crawler arrivals out of both names rather than filtering them away", async () => {
    await seedFeed("sportstech");

    await visit("/sportstech", BOT_UA);

    // A posted link is crawled within seconds. If the sweep landed in the human names, the
    // first hour of any attempt graded against them would read as readers.
    expect(await countersToday()).toEqual({ feed_view_bot: 1, "feed_view_bot:sportstech": 1 });
  });

  it("names the destination from the creator row, not from the request", async () => {
    await seedFeed("sportstech");

    const res = await visit("/SportsTech", HUMAN_UA);

    expect(res.status).toBe(200);
    // The route already lowercases to look the creator up; the counter has to use the value
    // that came back, or one destination accumulates under as many names as it has spellings.
    expect(await countersToday()).toEqual({ feed_view: 1, "feed_view:sportstech": 1 });
  });

  it("counts nothing for a handle that does not exist", async () => {
    const res = await visit("/nobody", HUMAN_UA);

    expect(res.status).toBe(404);
    expect(await countersToday()).toEqual({});
  });
});

describe("an arrival tag identifies the attempt that sent someone", () => {
  it("counts an allowlisted ?src= alongside the view it came with", async () => {
    await seedFeed("sportstech");

    const res = await visit("/sportstech?src=qa", HUMAN_UA);

    expect(res.status).toBe(200);
    expect(await countersToday()).toEqual({ feed_view: 1, "feed_view:sportstech": 1, "arrival:qa": 1 });
  });

  it("splits a tagged crawler arrival too", async () => {
    await seedFeed("sportstech");

    await visit("/sportstech?src=qa", BOT_UA);

    expect(await countersToday()).toEqual({ feed_view_bot: 1, "feed_view_bot:sportstech": 1, "arrival_bot:qa": 1 });
  });

  it("writes no counter at all for a tag that is not allowlisted", async () => {
    await seedFeed("sportstech");

    const res = await visit("/sportstech?src=hn", HUMAN_UA);

    expect(res.status).toBe(200);
    // Not "counts it under an other bucket" — under no name. A tag that reads zero because
    // nobody arrived and a tag that reads zero because it was never registered must not be
    // the same row, or a forgotten allowlist entry becomes a finding about demand.
    expect(await countersToday()).toEqual({ feed_view: 1, "feed_view:sportstech": 1 });
  });

  it("cannot be made to mint arbitrary counter rows from the URL", async () => {
    await seedFeed("sportstech");

    for (const src of ["qa'; DROP TABLE metric_days; --", "a".repeat(400), "feed_view", "", "QA"]) {
      await visit(`/sportstech?src=${encodeURIComponent(src)}`, HUMAN_UA);
    }

    // Five hostile tags, five views, and the only names in the table are the two the route
    // writes unconditionally. `QA` is in the list on purpose: matching is exact, so a tag is
    // the string that was pre-registered and not a case-insensitive family around it.
    expect(await countersToday()).toEqual({ feed_view: 5, "feed_view:sportstech": 5 });
  });
});

describe("countEach writes every name in one round trip", () => {
  it("increments each distinct name, and increments an existing row rather than replacing it", async () => {
    await countEach(DB, ["alpha", "beta"]);
    await countEach(DB, ["alpha"]);

    expect(await countersToday()).toEqual({ alpha: 2, beta: 1 });
  });

  it("drops duplicates so one event cannot count itself twice", async () => {
    // The feed route builds its list from a handle and a suffix; a destination whose split
    // name collided with the site-wide name would otherwise silently double-count.
    await countEach(DB, ["alpha", "alpha"]);

    expect(await countersToday()).toEqual({ alpha: 1 });
  });

  it("writes nothing for an empty list or empty names", async () => {
    // The route passes "" in place of an absent arrival tag rather than branching around the
    // call, so this is the untagged path, not a defensive nicety.
    await countEach(DB, []);
    await countEach(DB, ["", ""]);

    expect(await countersToday()).toEqual({});
  });

  it("never throws, so a telemetry failure cannot break a page", async () => {
    const broken = {
      batch: () => Promise.reject(new Error("D1 is down")),
      prepare: DB.prepare.bind(DB),
    } as unknown as D1Database;

    await expect(countEach(broken, ["alpha"])).resolves.toBeUndefined();
  });
});
