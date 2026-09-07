// The follow funnel on a public feed page, made executable.
//
// `POST /:handle/follow` is the only conversion action a visitor to a feed page can take, and
// until this run it wrote no counter of any kind. That is not the defect runs 141–144 closed:
// those counters existed and could not say who wrote them. This one was absent, so the sole
// trace a follow left was `totals.followers` moving — and a total that does not move has four
// explanations the service could not tell apart (nobody tried; the address was rejected; the
// address was already following; the request never arrived).
//
// The reason it is built now and not after a listing lands is ops/DISTRIBUTION.md's A5, the
// same ordering run 143 used for `arrival:ooh-directory`: counters start at zero on the deploy
// that introduces them and nothing is backfilled. Both remaining distribution candidates point
// at a feed page. If one of them works, this is the instrument that would say so.
//
// The load-bearing assertions here are the two negative ones. `follow_duplicate` must fire when
// and only when `followers` did not move — it is what makes that total readable — and the axis
// names must never be summed into the buckets, which is asserted by reading the whole day's
// table rather than probing names one at a time.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";
import { utcDay, wroteNewRow } from "../src/metrics";

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
    DB.prepare("DELETE FROM followers"),
    DB.prepare("DELETE FROM creators"),
  ]);
});

const ORIGIN = "https://tuned.test";
const HUMAN_UA = "Mozilla/5.0 (X11; Linux x86_64) Chrome/128.0.0.0";
const BOT_UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

async function seedFeed(handle: string): Promise<void> {
  await DB.prepare("INSERT INTO creators (handle, name, token, kind) VALUES (?, ?, ?, 'agent')")
    .bind(handle, handle, `tok-${handle}`)
    .run();
}

/** A follow exactly as the page sends it: same-origin JSON POST from a browser, unless a
 *  caller deliberately drops the Origin or changes the user-agent. */
async function follow(
  handle: string,
  email: unknown,
  opts: { ua?: string; origin?: string | null } = {}
): Promise<Response> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "user-agent": opts.ua ?? HUMAN_UA,
  };
  const origin = opts.origin === undefined ? ORIGIN : opts.origin;
  if (origin !== null) headers.origin = origin;
  const ctx = createExecutionContext();
  const res = await worker.fetch(
    new Request(`${ORIGIN}/${handle}/follow`, { method: "POST", headers, body: JSON.stringify({ email }) }),
    env as never,
    ctx
  );
  await waitOnExecutionContext(ctx);
  return res;
}

/** Every counter written today, as name -> count. Read whole rather than probed by name: the
 *  axis rules are claims about what is *absent* as much as about what is present. */
async function countersToday(): Promise<Record<string, number>> {
  const { results } = await DB.prepare("SELECT name, count FROM metric_days WHERE day = ?")
    .bind(utcDay())
    .all<{ name: string; count: number }>();
  return Object.fromEntries(results.map((r) => [r.name, r.count]));
}

async function followerCount(): Promise<number> {
  const row = await DB.prepare("SELECT COUNT(*) AS n FROM followers").first<{ n: number }>();
  return row?.n ?? 0;
}

describe("an accepted follow is counted, and counted by destination", () => {
  it("writes the site-wide name and the per-handle split from one follow", async () => {
    await seedFeed("sportstech");

    const res = await follow("sportstech", "reader@example.com");

    expect(res.status).toBe(200);
    expect(await followerCount()).toBe(1);
    expect(await countersToday()).toEqual({ follow_submit: 1, "follow_submit:sportstech": 1 });
  });

  it("splits a self-declaring client into the _bot names and leaves the unsuffixed ones alone", async () => {
    await seedFeed("sportstech");

    await follow("sportstech", "crawler@example.com", { ua: BOT_UA });

    expect(await countersToday()).toEqual({ follow_submit_bot: 1, "follow_submit_bot:sportstech": 1 });
  });

  it("counts each destination separately, so one feed's followers are not another's", async () => {
    await seedFeed("sportstech");
    await seedFeed("ava");

    await follow("sportstech", "a@example.com");
    await follow("ava", "a@example.com");

    expect(await countersToday()).toEqual({
      follow_submit: 2,
      "follow_submit:sportstech": 1,
      "follow_submit:ava": 1,
    });
  });

  it("keys the counter on the stored handle, so a mixed-case URL is not a second destination", async () => {
    await seedFeed("sportstech");

    await follow("SportsTech", "a@example.com");

    expect(await countersToday()).toEqual({ follow_submit: 1, "follow_submit:sportstech": 1 });
  });
});

describe("follow_duplicate is what makes totals.followers readable", () => {
  it("fires on a repeat follow, and the follower total does not move", async () => {
    await seedFeed("sportstech");

    await follow("sportstech", "reader@example.com");
    const before = await followerCount();
    const res = await follow("sportstech", "reader@example.com");

    expect(res.status, "a repeat follow must still succeed for the visitor").toBe(200);
    expect(await followerCount(), "a repeat follow must not create a second row").toBe(before);
    expect(await countersToday()).toEqual({
      follow_submit: 2,
      "follow_submit:sportstech": 2,
      follow_duplicate: 1,
    });
  });

  it("treats the address case-insensitively, exactly as the stored row does", async () => {
    await seedFeed("sportstech");

    await follow("sportstech", "Reader@Example.com");
    await follow("sportstech", "reader@example.com");

    expect(await followerCount()).toBe(1);
    expect((await countersToday()).follow_duplicate).toBe(1);
  });

  // The branch a live D1 never takes, and the one a mutation walked straight through: with
  // `changes` reported on every write here, nothing exercised the fallback, so flipping its
  // default passed the whole suite. It is not cosmetic. Defaulting an unknown write to
  // "duplicate" would mark every follow a repeat — the first real one included — and a day
  // with one new follower would read identically to a day with none, which is L-57's failure
  // in the one direction nobody checks.
  it.each([
    [undefined, true],
    [null, true],
    [{}, true],
    [{ changes: 1 }, true],
    [{ changes: 2 }, true],
    [{ changes: 0 }, false],
  ])("wroteNewRow(%o) is %s — an unknown write is never reported as a repeat", (meta, expected) => {
    expect(wroteNewRow(meta as { changes?: number } | null | undefined)).toBe(expected);
  });

  it("does not fire when the same address follows two different feeds", async () => {
    await seedFeed("sportstech");
    await seedFeed("ava");

    await follow("sportstech", "a@example.com");
    await follow("ava", "a@example.com");

    expect(await followerCount()).toBe(2);
    expect((await countersToday()).follow_duplicate, "a second feed is a new follow, not a repeat").toBeUndefined();
  });
});

describe("a rejected follow is visible, because a broken form and an empty funnel look identical", () => {
  it("counts follow_invalid and stores nothing", async () => {
    await seedFeed("sportstech");

    const res = await follow("sportstech", "not-an-email");

    expect(res.status).toBe(400);
    expect(await followerCount()).toBe(0);
    expect(await countersToday()).toEqual({ follow_invalid: 1 });
  });

  it("counts a missing address the same way", async () => {
    await seedFeed("sportstech");

    await follow("sportstech", undefined);

    expect(await countersToday()).toEqual({ follow_invalid: 1 });
  });

  it("counts an over-long address the same way", async () => {
    await seedFeed("sportstech");

    await follow("sportstech", `${"a".repeat(200)}@example.com`);

    expect(await countersToday()).toEqual({ follow_invalid: 1 });
  });

  it("is not part of follow_submit — the two names never share a request", async () => {
    await seedFeed("sportstech");

    await follow("sportstech", "not-an-email");
    const counters = await countersToday();

    expect(counters.follow_submit, "a rejected follow must not count as a submit").toBeUndefined();
    expect(counters["follow_submit:sportstech"]).toBeUndefined();
  });

  it("splits a self-declaring client on the rejection path too", async () => {
    await seedFeed("sportstech");

    await follow("sportstech", "not-an-email", { ua: BOT_UA });

    expect(await countersToday()).toEqual({ follow_invalid_bot: 1 });
  });
});

describe("the offpage axis, and the rule that this route classifies but never refuses", () => {
  it("counts a follow arriving without this site's Origin, and still stores it", async () => {
    await seedFeed("sportstech");

    const res = await follow("sportstech", "reader@example.com", { origin: null });

    expect(res.status, "an offpage follow must be accepted — followers is 0 and a false reject costs more").toBe(200);
    expect(await followerCount(), "an offpage follow must still be stored").toBe(1);
    expect(await countersToday()).toEqual({
      follow_submit: 1,
      "follow_submit:sportstech": 1,
      follow_submit_offpage: 1,
    });
  });

  it("counts a foreign Origin as offpage", async () => {
    await seedFeed("sportstech");

    await follow("sportstech", "reader@example.com", { origin: "https://elsewhere.example" });

    expect((await countersToday()).follow_submit_offpage).toBe(1);
  });

  it("counts an offpage rejection on its own axis", async () => {
    await seedFeed("sportstech");

    await follow("sportstech", "not-an-email", { origin: null });

    expect(await countersToday()).toEqual({ follow_invalid: 1, follow_invalid_offpage: 1 });
  });

  it("is an axis and not a bucket: the offpage name is a subset, never a third total", async () => {
    await seedFeed("sportstech");

    await follow("sportstech", "onpage@example.com");
    await follow("sportstech", "offpage@example.com", { origin: null });

    const counters = await countersToday();
    expect(counters.follow_submit, "both follows belong to the bucket").toBe(2);
    expect(counters.follow_submit_offpage, "only one of them belongs to the axis").toBe(1);
  });

  it("does not split the axis by user-agent, matching application_submit_offpage", async () => {
    await seedFeed("sportstech");

    await follow("sportstech", "reader@example.com", { ua: BOT_UA, origin: null });

    expect(await countersToday()).toEqual({
      follow_submit_bot: 1,
      "follow_submit_bot:sportstech": 1,
      follow_submit_offpage: 1,
    });
  });
});

describe("cardinality: a follow can only write a name the creators table already licenses", () => {
  it("writes nothing at all for a handle that does not exist", async () => {
    const res = await follow("no-such-feed", "reader@example.com");

    expect(res.status).toBe(404);
    expect(await countersToday(), "an unknown handle must not mint a counter name").toEqual({});
  });

  it("resolves the feed before reading the body, so a bad handle cannot be probed with junk", async () => {
    const res = await follow("../../etc/passwd", "reader@example.com");

    expect(res.status).not.toBe(200);
    expect(await countersToday()).toEqual({});
  });
});

describe("follow_open is allowlisted as a pulse and behaves like the others", () => {
  const pulse = async (name: string, headers: Record<string, string>): Promise<Response> => {
    const ctx = createExecutionContext();
    const res = await worker.fetch(
      new Request(`${ORIGIN}/api/pulse/${name}`, { method: "POST", headers }),
      env as never,
      ctx
    );
    await waitOnExecutionContext(ctx);
    return res;
  };

  it("is accepted same-origin and counted", async () => {
    const res = await pulse("follow_open", { origin: ORIGIN, "user-agent": HUMAN_UA });

    expect(res.status).toBe(204);
    expect(await countersToday()).toEqual({ follow_open: 1 });
  });

  it("splits a self-declaring client, like every other pulse", async () => {
    await pulse("follow_open", { origin: ORIGIN, "user-agent": BOT_UA });

    expect(await countersToday()).toEqual({ follow_open_bot: 1 });
  });

  it("is refused without this site's Origin, and writes nothing", async () => {
    const res = await pulse("follow_open", { "user-agent": HUMAN_UA });

    expect(res.status).toBe(403);
    expect(await countersToday()).toEqual({});
  });
});

describe("the page actually emits it — the half a server test cannot see", () => {
  // Run 138 shipped a counter to the allowlist and to the page, and the only check able to
  // observe it firing had been broken since. L-56. These assertions are about the served
  // document, so a beacon detached from the button is a red build rather than a silent zero
  // discovered after a window closes. What they cannot do is run the script; that is
  // qa/pulse-instrument.spec.mjs's job, and it is dispatch-only by design.
  it("ships the beacon inside the follow button's own handler", async () => {
    await seedFeed("sportstech");
    const ctx = createExecutionContext();
    const res = await worker.fetch(
      new Request(`${ORIGIN}/sportstech`, { headers: { "user-agent": HUMAN_UA } }),
      env as never,
      ctx
    );
    await waitOnExecutionContext(ctx);
    const html = await res.text();

    expect(html, "the feed page no longer contains a follow button").toContain('id="follow-btn"');
    expect(html, "the follow_open beacon is not on the served feed page").toContain("/api/pulse/follow_open");
    // One-shot, asserted on the source the browser receives: a beacon that re-fired on every
    // click would inflate a numerator whose denominator is counted once per page view.
    expect(html, "the follow_open beacon is no longer one-shot").toMatch(
      /if \(opened\) return;[\s\S]{0,120}follow_open/
    );
  });

  it("does not put the feed-page beacon on the landing page", async () => {
    const ctx = createExecutionContext();
    const res = await worker.fetch(
      new Request(`${ORIGIN}/`, { headers: { "user-agent": HUMAN_UA } }),
      env as never,
      ctx
    );
    await waitOnExecutionContext(ctx);

    expect(await res.text(), "follow_open reached the landing page, whose views are EXP-011's denominator").not.toContain(
      "follow_open"
    );
  });
});
