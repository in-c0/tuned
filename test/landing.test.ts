// The landing page's freshness claim, made executable.
//
// EXP-005 measured what the old copy was sitting on: the demo block was headed
// "Live demo — a real feed, right now" while the newest item under it was 270.6 hours
// (11.3 days) old, on the page every arriving visitor lands on. Nothing in the codebase
// could have caught that, because the sentence was a constant — true or false depending
// on a database it never consulted.
//
// So the claim is derived now, and these tests are the thing that keeps it derived. They
// run the real Worker against a real D1 in workerd: seed items of a known age, render GET /,
// and assert the page says what the data supports and no more.

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

const ago = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString();

async function creator(handle: string, createdAt: string): Promise<number> {
  const row = await DB.prepare(
    "INSERT INTO creators (handle, name, token, kind, created_at) VALUES (?, ?, ?, 'human', ?) RETURNING id"
  )
    .bind(handle, handle, `tok-${handle}`, createdAt)
    .first<{ id: number }>();
  return row!.id;
}

async function item(creatorId: number, createdAt: string, visibility = "public"): Promise<void> {
  await DB.prepare(
    "INSERT INTO items (creator_id, url, title, domain, visibility, created_at) VALUES (?, ?, ?, 'example.com', ?, ?)"
  )
    .bind(creatorId, `https://example.com/${createdAt}`, `item ${createdAt}`, visibility, createdAt)
    .run();
}

async function landing(): Promise<string> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request("https://tuned.test/"), env as never, ctx);
  await waitOnExecutionContext(ctx);
  expect(res.status).toBe(200);
  return await res.text();
}

describe("the landing page does not claim freshness it does not have", () => {
  it("never asserts 'right now' in prose — recency is a rendered pulse, not a constant", async () => {
    const id = await creator("stale", ago(1000));
    await item(id, ago(270)); // the production reading on 2026-08-13: 11.3 days
    const html = await landing();

    expect(html).toContain("Live demo — a real feed");
    // The exact sentence EXP-005 falsified. If it ever returns, this fails.
    expect(html).not.toContain("a real feed, right now");
    // The old explainer quoted an invented sample reading rather than describing the feature.
    expect(html).not.toContain('"active 2h ago"');
  });

  it("hands the browser the newest item's timestamp, so the pulse can tell the truth", async () => {
    const id = await creator("solo", ago(1000));
    const newest = ago(270);
    await item(id, ago(400));
    await item(id, newest);
    const html = await landing();

    // The pulse element's own script greys out and says "last active" past 24h. What the
    // server owes it is the real timestamp of the real newest item.
    expect(html).toContain(`class="presence" data-latest="${newest}"`);
  });

  it("shows the feed with the newest item, not the oldest creator", async () => {
    // The defect this replaces: the demo was `ORDER BY created_at LIMIT 1` over creators, so
    // it selected by registration date. On 2026-08-13 that happened to pick the freshest feed
    // anyway — the two orderings coincided — which is exactly why it needs a test rather than
    // an observation. Here they disagree.
    const oldestCreator = await creator("registered-first", ago(2000));
    const newerCreator = await creator("registered-later", ago(100));
    await item(oldestCreator, ago(500));
    await item(newerCreator, ago(2));

    const html = await landing();
    expect(html).toContain('class="btn demo-more" href="/registered-later"');
    expect(html).not.toContain('class="btn demo-more" href="/registered-first"');
  });

  it("ignores queued and hidden items when choosing and dating the demo", async () => {
    // Auto-captured Spotify plays land as 'queued' and are private until a member approves
    // them. A queued item that could pull the demo block onto a feed, or backdate its pulse
    // forward, would leak private state into the most public surface Tuned has.
    const publicFeed = await creator("published", ago(2000));
    const queuedFeed = await creator("queued-only", ago(1000));
    const publicNewest = ago(300);
    await item(publicFeed, publicNewest);
    await item(queuedFeed, ago(1), "queued");
    await item(publicFeed, ago(2), "hidden");

    const html = await landing();
    expect(html).toContain('class="btn demo-more" href="/published"');
    expect(html).toContain(`class="presence" data-latest="${publicNewest}"`);
  });

  it("renders no demo block, and no pulse, when nothing is published at all", async () => {
    await creator("empty", ago(500));
    const html = await landing();

    expect(html).not.toContain("Live demo");
    expect(html).not.toContain('class="presence"');
    // The page itself still serves — an empty Tuned is allowed to exist, it just may not
    // advertise a feed it does not have.
    expect(html).toContain("Follow what people");
  });
});

// The feed list's freshness claim, made executable on the same terms as the demo block's.
//
// The demo block above got these tests at run 139 because EXP-005 caught a hardcoded "right now"
// over an 11-day-old item. The list *underneath* it kept the identical defect for six more weeks
// in a louder form: a heading reading "Live feeds" over cards built by a query that selected no
// item, on a reading (EXP-005 per feed, run 152) where four of the five destinations had published
// nothing for six weeks. Every other surface that offers a feed discloses the age — the follow
// block, both follow dialogs (run 172), the desk's suggestion row (run 177). The top of the funnel
// was the one that did not.
describe("the landing page's feed list says how current each destination is", () => {
  it("reports each feed's age on its own card, derived from the row", async () => {
    const fresh = await creator("current", ago(1000));
    const dormant = await creator("dormant", ago(2000));
    await item(fresh, ago(2));
    await item(dormant, ago(54 * 24));

    const html = await landing();
    expect(html).toContain("last published today");
    expect(html).toContain("last published 54 days ago");
  });

  it("puts the age in an element of its own, not inside the clamped description", async () => {
    // `.desc` is `-webkit-line-clamp: 2`, and at 390px the two sentences together land on exactly
    // the second line — so folding the age in there would clamp it away silently on a longer
    // handle. A disclosure that disappears when the text grows is the L-18/L-93 failure mode, and
    // this is the assertion that keeps it out of that element.
    const id = await creator("somebody", ago(1000));
    await item(id, ago(54 * 24));

    const html = await landing();
    expect(html).toContain('<div class="fine">last published 54 days ago</div>');
    expect(html).not.toContain("is paying attention to · last published");
  });

  it("says so plainly for a feed that has never published, rather than showing no age", async () => {
    // The desk's suggestion row falls silent in this case because its own `0 finds` already says
    // it. This card carries no other number, so silence here would leave the emptiest feed the
    // only undisclosed one.
    await creator("never", ago(1000));

    const html = await landing();
    expect(html).toContain('<div class="fine">nothing published yet</div>');
    expect(html).not.toContain("last published");
  });

  it("orders the list by the newest item, not by registration date", async () => {
    // The same defect the demo block was fixed for, on the list it sits above: registration date
    // is a fact about when a feed was registered and says nothing about whether anything on it is
    // current. A visitor choosing a destination is shown the freshest first.
    const registeredFirst = await creator("stale-but-old", ago(2000));
    const registeredLater = await creator("fresh-but-new", ago(100));
    await item(registeredFirst, ago(54 * 24));
    await item(registeredLater, ago(3));

    const html = await landing();
    const freshAt = html.indexOf('<a class="card-link" href="/fresh-but-new">');
    const staleAt = html.indexOf('<a class="card-link" href="/stale-but-old">');
    expect(freshAt).toBeGreaterThan(-1);
    expect(staleAt).toBeGreaterThan(-1);
    expect(freshAt).toBeLessThan(staleAt);
  });

  it("sorts a feed that has never published below every feed that has", async () => {
    const published = await creator("has-published", ago(100));
    await creator("has-not", ago(2000));
    await item(published, ago(54 * 24));

    const html = await landing();
    expect(html.indexOf('<a class="card-link" href="/has-published">')).toBeLessThan(
      html.indexOf('<a class="card-link" href="/has-not">')
    );
  });

  it("does not let a queued or hidden item date a feed in the list", async () => {
    // A queued Spotify capture is private until a member approves it. Dating a card from one
    // would leak private state onto the most public page Tuned has — the rule the demo block's
    // own query already follows, applied to the list.
    const id = await creator("mixed", ago(1000));
    await item(id, ago(54 * 24));
    await item(id, ago(1), "queued");
    await item(id, ago(2), "hidden");

    const html = await landing();
    expect(html).toContain('<div class="fine">last published 54 days ago</div>');
    expect(html).not.toContain("last published today");
    expect(html).not.toContain("last published yesterday");
  });

  it("no longer heads the list with a freshness claim the query cannot keep", async () => {
    const id = await creator("whoever", ago(1000));
    await item(id, ago(54 * 24));

    const html = await landing();
    expect(html).toContain("All feeds");
    // The exact heading this replaces. If it returns, so does the claim.
    expect(html).not.toContain("Live feeds");
  });
});
