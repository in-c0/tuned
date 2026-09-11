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

// The fork under `follow_open`, and the reason the dialog was changed rather than only counted.
//
// Two paths leave that dialog and they are not the same kind of thing. An accepted follow writes
// a row into `followers` — a table nothing on this platform reads and no code in src/ can deliver
// to, because there is no mail provider, no sender and no digest job. The RSS URL is the only
// subscription on this page that does anything today, and it was a 12px header link while the
// path that delivers nothing held the primary button and the dialog's only copy.
//
// The load-bearing assertion here is the ordering one. Telling a visitor that digests are not
// sending yet is worth nothing if they read it *after* handing over an address, which is where
// that sentence lived until this run — in the success message. A test that merely asserts the
// disclosure is present on the page passes in both worlds, so the one below pins that it precedes
// the email input in the served document.
describe("follow_rss — the working path, disclosed before the ask and counted", () => {
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

  const feedPage = async (path: string): Promise<string> => {
    const ctx = createExecutionContext();
    const res = await worker.fetch(
      new Request(`${ORIGIN}${path}`, { headers: { "user-agent": HUMAN_UA } }),
      env as never,
      ctx
    );
    await waitOnExecutionContext(ctx);
    return res.text();
  };

  it("is accepted same-origin, counted, and split like every other pulse", async () => {
    expect((await pulse("follow_rss", { origin: ORIGIN, "user-agent": HUMAN_UA })).status).toBe(204);
    await pulse("follow_rss", { origin: ORIGIN, "user-agent": BOT_UA });

    expect(await countersToday()).toEqual({ follow_rss: 1, follow_rss_bot: 1 });
  });

  it("is refused without this site's Origin, and writes nothing", async () => {
    const res = await pulse("follow_rss", { "user-agent": HUMAN_UA });

    expect(res.status).toBe(403);
    expect(await countersToday()).toEqual({});
  });

  it("offers the feed's own RSS URL inside the dialog, not some other feed's", async () => {
    await seedFeed("sportstech");
    const html = await feedPage("/sportstech");

    expect(html, "the dialog no longer offers an RSS subscription").toContain('id="follow-rss"');
    expect(html, "the dialog's RSS link does not point at this feed").toMatch(
      /id="follow-rss"[^>]*href="\/sportstech\/rss\.xml"/
    );
  });

  it("discloses that digests are not sending BEFORE the email input, not after the submit", async () => {
    await seedFeed("sportstech");
    const html = await feedPage("/sportstech");

    const disclosure = html.indexOf("Digests are not sending yet");
    const input = html.indexOf('id="follow-email"');
    expect(disclosure, "the dialog no longer says digests are not sending yet").toBeGreaterThan(-1);
    expect(input, "the dialog no longer has an email input").toBeGreaterThan(-1);
    expect(
      disclosure,
      "the disclosure moved back after the email input — a visitor learns nothing is sent only once they have handed over an address"
    ).toBeLessThan(input);
  });

  it("wires the beacon to the dialog's link only, and fires it at most once", async () => {
    await seedFeed("sportstech");
    const html = await feedPage("/sportstech");

    expect(html, "the follow_rss beacon is not on the served feed page").toContain("/api/pulse/follow_rss");
    expect(html, "the follow_rss beacon is no longer one-shot").toMatch(
      /if \(rssTaken\) return;[\s\S]{0,120}follow_rss/
    );
    // The header RSS link is a different act: it carries no follow intent, and wiring it here
    // would fold two populations into one rung. Asserted as a count rather than as the absence of
    // one particular shape, because a second wiring can be written a dozen ways and "not this
    // regex" passes for eleven of them.
    expect(
      html.match(/\/api\/pulse\/follow_rss/g),
      "follow_rss is wired more than once — a second entry point folds two acts into one rung"
    ).toHaveLength(1);
    expect(
      html.match(/id="follow-rss"/g),
      "more than one element carries the dialog's RSS id"
    ).toHaveLength(1);
  });

  it("does not reach the landing page, whose views are EXP-011's denominator", async () => {
    expect(await feedPage("/"), "follow_rss reached the landing page").not.toContain("follow_rss");
  });
});
