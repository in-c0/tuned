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
