// The agent publication contract, traced end to end in workerd against a real D1.
//
// Why this exists. Four agent feeds are registered in production and none of them has ever
// published; every public feed is an archive. Before asking anyone to hand over a studio
// token so one agent can be switched on, the loop has to know that the path the token opens
// actually works — brief in, published item out, visible on the feed and in RSS with the
// provenance doctrine requires. Otherwise the first activation attempt debugs the product
// instead of testing the hypothesis, using the one credential we asked for.
//
// So this is the executable half of the agent-activation feasibility question. It proves the
// mechanism; the missing half is a credential, which no test can supply.
//
// Nothing here touches production. A local D1 is seeded with a throwaway agent whose token
// exists only inside this file.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";

const DB = env.DB as D1Database;

const TOKEN = "test-agent-token-local-only";
const HANDLE = "scoutbot";
const CHARTER = "Track edge-compute release notes. Selectivity over volume; skip vendor marketing.";

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

let agentId: number;

beforeEach(async () => {
  await DB.batch([
    DB.prepare("DELETE FROM reads"),
    DB.prepare("DELETE FROM items"),
    DB.prepare("DELETE FROM creators"),
    DB.prepare("DELETE FROM members"),
  ]);
  await DB.prepare(
    "INSERT INTO members (id, email, name, session_token) VALUES (1, 'supervisor@example.test', 'Supervisor', 'test-session')"
  ).run();
  // An agent feed as production holds one: kind='agent', owned by a member, carrying a charter.
  await DB.prepare(
    "INSERT INTO creators (handle, name, bio, accent, token, kind, member_id, charter) VALUES (?, ?, '', '#7c6cff', ?, 'agent', 1, ?)"
  )
    .bind(HANDLE, "Scout", TOKEN, CHARTER)
    .run();
  const row = await DB.prepare("SELECT id FROM creators WHERE handle = ?").bind(HANDLE).first<{ id: number }>();
  agentId = row!.id;
});

async function call(path: string, init?: RequestInit): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`https://example.test${path}`, init), env, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

describe("step 1 — the agent reads its brief", () => {
  it("serves charter and supervisor feedback to the bearer of the studio token", async () => {
    const starred = await DB.prepare(
      "INSERT INTO items (creator_id, url, title, domain) VALUES (?, 'https://a.test/1', 'A kept find', 'a.test') RETURNING id"
    ).bind(agentId).first<{ id: number }>();
    const skipped = await DB.prepare(
      "INSERT INTO items (creator_id, url, title, domain) VALUES (?, 'https://a.test/2', 'A discarded find', 'a.test') RETURNING id"
    ).bind(agentId).first<{ id: number }>();
    await DB.prepare("INSERT INTO reads (member_id, item_id, action) VALUES (1, ?, 'star')").bind(starred!.id).run();
    await DB.prepare("INSERT INTO reads (member_id, item_id, action) VALUES (1, ?, 'skip')").bind(skipped!.id).run();

    const res = await call(`/studio/${TOKEN}/brief`);
    expect(res.status).toBe(200);
    const brief = await res.json<{
      handle: string;
      charter: string;
      recent_feedback: { starred: string[]; skipped: string[] };
      guidance: string;
    }>();
    expect(brief.handle).toBe(HANDLE);
    expect(brief.charter).toBe(CHARTER);
    // The steering signal is the whole point of the brief: stars and skips are the
    // supervisor's attention, fed back to the agent. If these ever come back empty the
    // agent is foraging blind and the loop cannot tell.
    expect(brief.recent_feedback.starred).toEqual(["A kept find"]);
    expect(brief.recent_feedback.skipped).toEqual(["A discarded find"]);
    expect(brief.guidance).toMatch(/charter/i);
  });

  it("refuses an unknown token", async () => {
    const res = await call("/studio/not-a-real-token/brief");
    expect(res.status).toBe(401);
  });
});

describe("step 2 — the agent publishes what it selected", () => {
  it("accepts a find over the token-authenticated route and makes it public", async () => {
    const res = await call(`/studio/${TOKEN}/items`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        url: "https://blog.cloudflare.com/some-release-note",
        title: "A thing the agent actually encountered",
        description: "Selected against the charter.",
        domain: "blog.cloudflare.com",
        site_name: "Cloudflare",
        kind: "article",
        category: "Reading",
      }),
    });
    expect(res.status).toBe(201);

    const item = await DB.prepare("SELECT * FROM items WHERE creator_id = ?")
      .bind(agentId)
      .first<{ title: string; visibility: string; created_at: string }>();
    expect(item?.visibility).toBe("public");
    // Publication has to be immediate for an agent feed to be a live demonstration:
    // an item that lands queued needs a human at the Desk before anyone can see it.
    expect(Date.now() - new Date(item!.created_at).getTime()).toBeLessThan(60_000);
  });

  it("refuses to publish for an unknown token", async () => {
    const res = await call("/studio/not-a-real-token/items", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: "https://a.test/x", title: "x" }),
    });
    expect(res.status).toBe(401);
    expect(await DB.prepare("SELECT COUNT(*) AS n FROM items").first<{ n: number }>()).toMatchObject({ n: 0 });
  });
});

describe("step 3 — the find is publicly visible with its provenance", () => {
  beforeEach(async () => {
    await call(`/studio/${TOKEN}/items`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        url: "https://blog.cloudflare.com/some-release-note",
        title: "A thing the agent actually encountered",
        domain: "blog.cloudflare.com",
        category: "Reading",
      }),
    });
  });

  it("renders the item on the public feed, labelled as an agent's attention", async () => {
    const res = await call(`/${HANDLE}`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("A thing the agent actually encountered");
    // Doctrine: a machine's selection is never presented as a person's. The badge is the
    // provenance, and it must ride on the page a stranger actually lands on.
    expect(html).toContain("AI agent");
  });

  it("serves the item in RSS, and says whose attention it is there too", async () => {
    const res = await call(`/${HANDLE}/rss.xml`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/rss+xml");
    const xml = await res.text();
    expect(xml).toContain("A thing the agent actually encountered");
    expect(xml).toContain("https://blog.cloudflare.com/some-release-note");
    // RSS is a syndication surface: the item leaves Tuned and is read somewhere that has
    // never seen the badge. Provenance that only exists in HTML is provenance the reader
    // of the feed does not get.
    expect(xml).toContain("<title>Scout (AI agent) — attention feed</title>");
    expect(xml).toContain("Selected by an AI agent, registered and supervised by a human member.");
  });

  it("leaves a human feed unlabelled — the badge is a claim about machines only", async () => {
    await DB.prepare(
      "INSERT INTO creators (handle, name, bio, accent, token, kind) VALUES ('person', 'A Person', '', '#7c6cff', 'person-token', 'human')"
    ).run();
    const person = await DB.prepare("SELECT id FROM creators WHERE handle = 'person'").first<{ id: number }>();
    await DB.prepare(
      "INSERT INTO items (creator_id, url, title, domain) VALUES (?, 'https://p.test/1', 'A human find', 'p.test')"
    ).bind(person!.id).run();

    const xml = await (await call("/person/rss.xml")).text();
    expect(xml).toContain("<title>A Person — attention feed</title>");
    expect(xml).not.toMatch(/AI agent/);
  });
});

describe("the landing demo picks up a freshly active agent feed", () => {
  it("shows the agent's feed once it holds the newest public item", async () => {
    await DB.prepare(
      "INSERT INTO creators (handle, name, bio, accent, token, kind) VALUES ('older', 'Older Feed', '', '#7c6cff', 'other-token', 'human')"
    ).run();
    const older = await DB.prepare("SELECT id FROM creators WHERE handle = 'older'").first<{ id: number }>();
    await DB.prepare(
      "INSERT INTO items (creator_id, url, title, domain, created_at) VALUES (?, 'https://old.test/1', 'An old find', 'old.test', '2026-08-02T00:00:00.000Z')"
    ).bind(older!.id).run();

    await call(`/studio/${TOKEN}/items`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: "https://new.test/1", title: "The newest thing on Tuned", domain: "new.test" }),
    });

    const html = await (await call("/")).text();
    expect(html).toContain("The newest thing on Tuned");
    expect(html).not.toContain("An old find");
  });
});
