// Machine-readable discovery of a public feed, made executable.
//
// A public feed page carried a visible "RSS" anchor for a human and nothing at all for
// software. `<link rel="alternate" type="application/rss+xml">` is the single element every
// feed reader, aggregator and feed search engine uses to turn a pasted page URL into a
// subscribable feed, and it was absent from every page this service serves. The visible
// anchor is not a substitute: no reader parses page text looking for the word "RSS".
//
// These tests run the real Worker against a real D1 in workerd and assert the element is
// present, well-formed, and — the part that matters and that a string check would miss —
// that the href it advertises is a URL this same Worker actually serves as a feed.

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

async function seed(handle: string, name: string, kind = "human"): Promise<void> {
  const row = await DB.prepare(
    "INSERT INTO creators (handle, name, token, kind, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id"
  )
    .bind(handle, name, `tok-${handle}`, kind, new Date().toISOString())
    .first<{ id: number }>();
  await DB.prepare(
    "INSERT INTO items (creator_id, url, title, domain, visibility, created_at) VALUES (?, ?, ?, 'example.com', 'public', ?)"
  )
    .bind(row!.id, "https://example.com/a", "a find", new Date().toISOString())
    .run();
}

async function get(path: string): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`https://tuned.test${path}`), env as never, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

describe("RSS autodiscovery on a public feed page", () => {
  it("advertises the feed with a well-formed alternate link", async () => {
    await seed("sportstech", "Sportstech");
    const html = await (await get("/sportstech")).text();

    const link = html.match(/<link\b[^>]*rel="alternate"[^>]*>/i)?.[0];
    expect(link, "no <link rel=\"alternate\"> in the document").toBeDefined();
    expect(link).toMatch(/type="application\/rss\+xml"/);
    expect(link).toMatch(/href="\/sportstech\/rss\.xml"/);
    // A reader offering a choice of feeds shows this string, so it has to name the feed
    // rather than repeat the product name on its own.
    expect(link).toMatch(/title="Sportstech —/);
  });

  it("is inside <head>, which is the only place a reader looks", async () => {
    await seed("sportstech", "Sportstech");
    const html = await (await get("/sportstech")).text();
    const head = html.slice(html.indexOf("<head>"), html.indexOf("</head>"));
    expect(head).toContain('type="application/rss+xml"');
  });

  it("advertises a href this Worker actually serves as a feed", async () => {
    await seed("sportstech", "Sportstech");
    const html = await (await get("/sportstech")).text();
    const href = html.match(/rel="alternate"[^>]*href="([^"]+)"/i)?.[1];
    expect(href).toBeDefined();

    // The point of the whole element: follow it and get a feed back, not a 404.
    const feed = await get(href!);
    expect(feed.status).toBe(200);
    expect(feed.headers.get("content-type") ?? "").toMatch(/xml/);
    expect(await feed.text()).toContain("<rss");
  });

  it("names the feed it is on, not some other feed", async () => {
    await seed("sportstech", "Sportstech");
    await seed("wearables", "Wearables");
    const html = await (await get("/wearables")).text();
    const links = html.match(/<link\b[^>]*rel="alternate"[^>]*>/gi) ?? [];
    // Exactly one feed is advertised, and it is this page's own.
    expect(links).toHaveLength(1);
    expect(links[0]).toMatch(/href="\/wearables\/rss\.xml"/);
  });

  it("escapes a name that would otherwise break out of the title attribute", async () => {
    await seed("odd", 'Ava " onload=x');
    const html = await (await get("/odd")).text();
    const link = html.match(/<link\b[^>]*rel="alternate"[^>]*>/i)?.[0] ?? "";
    expect(link).not.toContain('" onload=');
    expect(link).toContain("&quot;");
  });
});
