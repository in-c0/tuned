// Naming the one arrival channel this project has evidence of.
//
// EXP-014 graded VERDICT FORK B on 2026-09-30: `item_view_search` 1 and `item_render` 5 on the
// same whole day. Fork B's registered reading is *"this is the first evidenced arrival channel
// that needs nobody's permission, and it outranks every other candidate available to the loop"*;
// Fork C's is *"stop treating 'no inbound link' as a standing fact"*.
//
// Neither was actionable, because `item_view_referred` read **5** against `item_view_search`'s
// **1** — four off-site arrivals from a host matching none of the thirteen allowlisted engines —
// and `offsiteReferrerHost` computed that host, used it for two booleans and discarded it. The
// channel was measured and unnameable.
//
// The properties that decide whether this record is sound rather than merely present:
//
//   1. IT NAMES THE HOST, on exactly the requests the axis it explains counts. A row appears for
//      a referred arrival and no row appears for one that arrived without a usable `Referer`.
//   2. IT IS BOUNDED AGAINST A HOSTILE CALLER. The value comes from a header the client sets, so
//      the test that matters is not that a good host is stored but that a thousand forged ones
//      cannot write a thousand rows. The cap is the whole reason this is allowed to exist, and
//      `~over` being non-zero is how a reader tells "no further hosts" from "we stopped looking".
//   3. AN ADMITTED HOST KEEPS COUNTING AFTER THE CAP BINDS. Otherwise the one referrer worth
//      reading freezes at whatever it held when a flood spent the budget.
//   4. THE BOT BUDGET IS SEPARATE. L-103 is the record of what comparing across the `_bot` split
//      does to a reading; a crawler flood must not be able to spend the human side's budget.
//   5. THE COUNTERS IT EXPLAINS DID NOT MOVE. `item_view`, `item_view_referred` and
//      `item_view_search` are inside EXP-014's open window. A new row is only admissible here if
//      every name the window is graded on is untouched by it.
//   6. NOTHING BUT A HOST IS EVER STORED. The path and query of a `Referer` can carry personal
//      data; its host cannot. The full URL must not reach the table even when it is sent.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";
import {
  REFERRER_HOSTS_PER_DAY,
  REFERRER_INVALID,
  REFERRER_OVERFLOW,
  recordReferrer,
  referrerBucket,
  snapshot,
  utcDay,
} from "../src/metrics";

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
    DB.prepare("DELETE FROM referrer_days"),
  ]);
});

async function creator(handle: string): Promise<number> {
  const row = await DB.prepare(
    "INSERT INTO creators (handle, name, token, kind, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id"
  )
    .bind(handle, handle, `tok-${handle}`, "human", new Date().toISOString())
    .first<{ id: number }>();
  return row!.id;
}

async function item(creatorId: number): Promise<number> {
  const row = await DB.prepare(
    `INSERT INTO items (creator_id, url, title, description, image_url, site_name, domain, category, note, visibility, via_creator_id, created_at)
     VALUES (?, ?, ?, '', '', '', ?, 'Misc', '', 'public', NULL, ?) RETURNING id`
  )
    .bind(creatorId, "https://example.com/a", "A find", "example.com", new Date().toISOString())
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

async function rows(): Promise<Array<{ day: string; host: string; bot: number; count: number }>> {
  const { results } = await DB.prepare(
    "SELECT day, host, bot, count FROM referrer_days ORDER BY host, bot"
  ).all<{ day: string; host: string; bot: number; count: number }>();
  return results;
}

async function counter(name: string): Promise<number> {
  const row = await DB.prepare("SELECT SUM(count) AS n FROM metric_days WHERE name = ?")
    .bind(name)
    .first<{ n: number | null }>();
  return row?.n ?? 0;
}

describe("a referred find-page arrival names its own channel", () => {
  it("records the referring host, and records nothing when there is no referrer", async () => {
    const c = await creator("sportstech");
    const id = await item(c);

    await get(`/sportstech/${id}`, { referer: "https://news.ycombinator.com/item?id=1" });
    expect(await rows()).toEqual([
      { day: utcDay(), host: "news.ycombinator.com", bot: 0, count: 1 },
    ]);

    // A sitemap crawl and a pasted URL both arrive with no `Referer` at all. "Not referred" is
    // the absence of a row, never a bucket — otherwise the table would read as a channel.
    await get(`/sportstech/${id}`);
    expect(await rows()).toHaveLength(1);
  });

  it("stores the host and never the path or query of the Referer", async () => {
    const c = await creator("sportstech");
    const id = await item(c);
    await get(`/sportstech/${id}`, {
      referer: "https://www.google.com/search?q=secret+personal+search+terms&uid=abc123",
    });
    const all = await rows();
    expect(all).toEqual([{ day: utcDay(), host: "www.google.com", bot: 0, count: 1 }]);
    // The assertion that matters is about the whole table, not about one column: no cell
    // anywhere may carry the query that the host was extracted from.
    expect(JSON.stringify(all)).not.toContain("secret");
    expect(JSON.stringify(all)).not.toContain("abc123");
  });

  it("does not move any counter EXP-014 is graded on", async () => {
    const c = await creator("sportstech");
    const id = await item(c);
    await get(`/sportstech/${id}`, { referer: "https://www.google.com/search?q=x" });

    // Exactly the values this route wrote before the table existed. The record is an addition,
    // not a re-definition: EXP-014's window is open and these three names are its grade.
    expect(await counter("item_view")).toBe(1);
    expect(await counter("item_view_referred")).toBe(1);
    expect(await counter("item_view_search")).toBe(1);
    expect(await counter("item_view_onsite")).toBe(0);
    // And the host record is not itself a counter — `metric_days` still receives only the fixed
    // strings this route has always written, so no caller-controlled value reaches a counter name.
    const { results } = await DB.prepare("SELECT name FROM metric_days").all<{ name: string }>();
    for (const { name } of results) expect(name).not.toContain("google");
  });

  it("splits the bot flag, so a crawler's referrer is never the same row as a browser's", async () => {
    const c = await creator("sportstech");
    const id = await item(c);
    const ref = { referer: "https://www.google.com/search?q=x" };
    await get(`/sportstech/${id}`, ref);
    await get(`/sportstech/${id}`, { ...ref, "user-agent": BOT_UA });
    expect(await rows()).toEqual([
      { day: utcDay(), host: "www.google.com", bot: 0, count: 1 },
      { day: utcDay(), host: "www.google.com", bot: 1, count: 1 },
    ]);
  });
});

describe("the cap is what makes a caller-controlled value safe to store", () => {
  it("admits at most REFERRER_HOSTS_PER_DAY hosts a day and collapses the rest into ~over", async () => {
    const forged = 500;
    for (let i = 0; i < forged; i++) await recordReferrer(DB, `forged-${i}.example.com`, false);

    const all = await rows();
    const named = all.filter((r) => r.host !== REFERRER_OVERFLOW);
    const over = all.find((r) => r.host === REFERRER_OVERFLOW);

    // The bound is the point: 500 distinct forged referrers must not be 500 rows.
    expect(named).toHaveLength(REFERRER_HOSTS_PER_DAY);
    expect(all.length).toBeLessThanOrEqual(REFERRER_HOSTS_PER_DAY + 1);
    // Nothing is lost, only its identity — every arrival past the cap is still counted.
    expect(over?.count).toBe(forged - REFERRER_HOSTS_PER_DAY);
    expect(named.reduce((n, r) => n + r.count, 0) + (over?.count ?? 0)).toBe(forged);
  });

  it("keeps counting a host that was already admitted after the cap binds", async () => {
    await recordReferrer(DB, "news.ycombinator.com", false);
    for (let i = 0; i < 200; i++) await recordReferrer(DB, `forged-${i}.example.com`, false);
    await recordReferrer(DB, "news.ycombinator.com", false);
    await recordReferrer(DB, "news.ycombinator.com", false);

    // Without this, a flood freezes the one referrer worth reading at whatever it held when the
    // budget ran out, and the freeze is invisible in the data.
    const hn = (await rows()).find((r) => r.host === "news.ycombinator.com");
    expect(hn?.count).toBe(3);
  });

  it("budgets the cap per bot flag, so a crawler flood cannot spend the human side", async () => {
    // The flood comes first and is larger than the cap, so a budget shared across the flag would
    // already be spent by the time a browser arrives.
    for (let i = 0; i < 200; i++) await recordReferrer(DB, `crawler-${i}.example.com`, true);

    // The human side must still be able to admit its FULL budget by name — asserting only that
    // the first one lands would pass on a shared cap that happens to leave one slot.
    for (let i = 0; i < REFERRER_HOSTS_PER_DAY; i++) {
      await recordReferrer(DB, `visitor-${i}.example.com`, false);
    }

    const human = (await rows()).filter((r) => r.bot === 0);
    expect(human).toHaveLength(REFERRER_HOSTS_PER_DAY);
    expect(human.some((r) => r.host === REFERRER_OVERFLOW)).toBe(false);
    // And the bot side was capped independently, rather than one side starving the other.
    const bots = (await rows()).filter((r) => r.bot === 1);
    expect(bots.filter((r) => r.host !== REFERRER_OVERFLOW)).toHaveLength(REFERRER_HOSTS_PER_DAY);
  });

  it("gives each day its own budget", async () => {
    for (let i = 0; i < 200; i++) await recordReferrer(DB, `forged-${i}.example.com`, false, "2026-10-02");
    await recordReferrer(DB, "news.ycombinator.com", false, "2026-10-03");

    const next = (await rows()).filter((r) => r.day === "2026-10-03");
    expect(next).toEqual([{ day: "2026-10-03", host: "news.ycombinator.com", bot: 0, count: 1 }]);
  });
});

describe("what referrerBucket admits", () => {
  it("keeps a DNS-shaped host and lowercases it", () => {
    expect(referrerBucket("News.YCombinator.COM")).toBe("news.ycombinator.com");
    expect(referrerBucket("www.google.co.uk")).toBe("www.google.co.uk");
    expect(referrerBucket("1.2.3.4")).toBe("1.2.3.4");
  });

  it("returns empty for an empty host, because absence is not a bucket", () => {
    expect(referrerBucket("")).toBe("");
    expect(referrerBucket("   ")).toBe("");
  });

  it("sends anything not DNS-shaped to ~invalid rather than storing it", () => {
    for (const bad of [
      "localhost",
      "[::1]",
      "exa mple.com",
      "ex%00ample.com",
      "-leading.example.com",
      "a".repeat(101) + ".com",
      "evil.com/../../etc/passwd",
      "a.com?x=1",
    ]) {
      expect(referrerBucket(bad)).toBe(REFERRER_INVALID);
    }
  });

  it("cannot be made to collide with a reserved bucket", () => {
    // `~` is not in HOST_SHAPE's character class, so no real referrer can forge either name.
    expect(referrerBucket(REFERRER_OVERFLOW)).toBe(REFERRER_INVALID);
    expect(referrerBucket(REFERRER_INVALID)).toBe(REFERRER_INVALID);
  });
});

describe("the snapshot carries the record", () => {
  it("publishes referrers as its own array, leaving daily counters alone", async () => {
    const c = await creator("sportstech");
    const id = await item(c);
    await get(`/sportstech/${id}`, { referer: "https://news.ycombinator.com/item?id=1" });

    const snap = await snapshot(DB);
    expect(snap.referrers).toEqual([
      { day: utcDay(), host: "news.ycombinator.com", bot: 0, count: 1 },
    ]);
    // A reader must not be able to find the host among the counters, in either direction.
    expect(snap.daily.some((d) => d.name.includes("ycombinator"))).toBe(false);
    expect(snap.daily.some((d) => d.name === "item_view_referred")).toBe(true);
  });

  it("is an empty array rather than absent when nothing was referred", async () => {
    const snap = await snapshot(DB);
    // Absent would read as "this snapshot predates the instrument"; empty reads as "nobody
    // arrived from off-site", and the two are different facts.
    expect(snap.referrers).toEqual([]);
  });

  it("documents the two reserved buckets and the cap in its own note", async () => {
    const snap = await snapshot(DB);
    // The note is the only contract a reader of `ops/metrics/latest.json` has. A bucket that is
    // not a host, published without saying so, is a number that reads as a channel.
    expect(snap.note).toContain(REFERRER_OVERFLOW);
    expect(snap.note).toContain(REFERRER_INVALID);
    expect(snap.note).toContain("never the full URL");
  });
});
