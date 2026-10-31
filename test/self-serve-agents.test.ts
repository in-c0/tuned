// The self-serve agent plane (src/agents.ts): register → claim → review → publish, and the
// guards that keep it from becoming Moltbook's failure modes — mass registration, readable
// keys, feeds with nobody behind them, and unbounded posting.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";
import { MAX_AGENTS_PER_OWNER, MAX_PUBLISH_PER_DAY, MAX_REGISTER_PER_IP_PER_DAY, ensureAgentTables, sha256Hex } from "../src/agents";

const DB = env.DB as D1Database;
const ORIGIN = "https://tuned.test";
const ADMIN_KEY = "test-admin-key";

beforeAll(async () => {
  const statements = schemaSql
    .split("\n")
    .map((line) => line.replace(/--.*$/, ""))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const sql of statements) await DB.prepare(sql).run();
  await ensureAgentTables(DB);
});

beforeEach(async () => {
  await DB.batch([
    DB.prepare("DELETE FROM agent_accounts"),
    DB.prepare("DELETE FROM agent_publications"),
    DB.prepare("DELETE FROM items"),
    DB.prepare("DELETE FROM creators"),
    DB.prepare("DELETE FROM metric_days"),
  ]);
});

let ipSeq = 0;
async function call(path: string, init: RequestInit & { ip?: string } = {}): Promise<Response> {
  const ctx = createExecutionContext();
  const headers = new Headers(init.headers);
  if (!headers.has("cf-connecting-ip")) headers.set("cf-connecting-ip", init.ip ?? `10.0.0.${++ipSeq % 250}`);
  const res = await worker.fetch(new Request(`${ORIGIN}${path}`, { ...init, headers }), { ...env, ADMIN_KEY } as never, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}
const json = (body: unknown, extra: Record<string, string> = {}) => ({
  method: "POST",
  headers: { "content-type": "application/json", ...extra },
  body: JSON.stringify(body),
});
const REMIT = "Open-access sports science papers, for coaches";

async function register(handle: string, ip?: string) {
  const res = await call("/api/v1/agents/register", { ...json({ handle, name: `Agent ${handle}`, remit: REMIT }), ip });
  return { res, body: (await res.json()) as Record<string, any> };
}
const tokenOf = (claimUrl: string) => claimUrl.split("/claim/")[1];
async function claim(token: string, email: string, ack = true) {
  const form = new URLSearchParams({ email, note: "", ...(ack ? { ack: "1" } : {}) });
  return call(`/claim/${token}`, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: form });
}
const admin = (path: string, method = "POST") => call(`/api/v1/agents/admin${path}`, { method, headers: { "x-admin-key": ADMIN_KEY } });

/** An agent all the way to active, returning its key. */
async function activeAgent(handle: string, email = `${handle}@example.com`): Promise<string> {
  const { body } = await register(handle);
  expect((await claim(tokenOf(body.claim_url), email)).status).toBe(200);
  expect((await admin(`/${handle}/approve`)).status).toBe(200);
  return body.api_key as string;
}
const publish = (key: string, body: Record<string, unknown>) =>
  call("/api/v1/agents/me/items", json(body, { authorization: `Bearer ${key}` }));
const find = (n: number, extra: Record<string, unknown> = {}) => ({
  url: `https://example.org/paper-${n}`,
  title: `Paper ${n}`,
  why: "Measures sprint timing against gates; useful for coaches",
  category: "Research",
  idempotency_key: `find-${n}-xxxxxxxx`,
  ...extra,
});

describe("registration", () => {
  it("returns a key once, stores only its hash, and creates no public feed", async () => {
    const { res, body } = await register("scout-one");
    expect(res.status).toBe(201);
    expect(body.api_key).toMatch(/^tuned_ak_/);
    expect(body.claim_url).toMatch(/^https:\/\/justtuned\.com\/claim\/tuned_claim_/);
    const row = await DB.prepare("SELECT key_hash, status FROM agent_accounts WHERE handle = 'scout-one'").first<{ key_hash: string; status: string }>();
    expect(row!.status).toBe("pending_claim");
    expect(row!.key_hash).toBe(await sha256Hex(body.api_key));
    const stored = JSON.stringify(await DB.prepare("SELECT * FROM agent_accounts").all());
    expect(stored).not.toContain(body.api_key);
    expect(stored).not.toContain(tokenOf(body.claim_url));
    expect(await DB.prepare("SELECT 1 FROM creators WHERE handle = 'scout-one'").first()).toBeNull();
    expect((await call("/scout-one")).status).toBe(404);
  });

  it("refuses reserved, malformed and taken handles, and a too-short remit", async () => {
    expect((await register("admin")).res.status).toBe(400);
    expect((await register("Bad Handle")).res.status).toBe(400);
    await DB.prepare("INSERT INTO creators (handle, name, token) VALUES ('ava', 'Ava', 't-ava')").run();
    expect((await register("ava")).res.status).toBe(409);
    await register("dupe");
    expect((await register("dupe")).res.status).toBe(409);
    const short = await call("/api/v1/agents/register", json({ handle: "shorty", name: "S", remit: "too short" }));
    expect(short.status).toBe(400);
  });

  it(`allows ${MAX_REGISTER_PER_IP_PER_DAY} registrations per network per day`, async () => {
    for (let i = 0; i < MAX_REGISTER_PER_IP_PER_DAY; i++) expect((await register(`flood-${i}`, "203.0.113.9")).res.status).toBe(201);
    expect((await register("flood-x", "203.0.113.9")).res.status).toBe(429);
    expect((await register("other-net", "198.51.100.1")).res.status).toBe(201);
  });
});

describe("claim", () => {
  it("moves the agent to review and shows no form a second time", async () => {
    const { body } = await register("claimed");
    const token = tokenOf(body.claim_url);
    const page = await (await call(`/claim/${token}`)).text();
    expect(page).toContain("@claimed");
    expect(page).toContain("Apply for this agent");
    expect((await claim(token, "Owner@Example.com")).status).toBe(200);
    const row = await DB.prepare("SELECT status, owner_email FROM agent_accounts WHERE handle = 'claimed'").first<{ status: string; owner_email: string }>();
    expect(row).toEqual({ status: "pending_review", owner_email: "owner@example.com" });
    expect((await claim(token, "someone@else.com")).status).toBe(409);
  });

  it("requires the responsibility statement", async () => {
    const { body } = await register("noack");
    expect((await claim(tokenOf(body.claim_url), "a@example.com", false)).status).toBe(400);
  });

  it(`caps one person at ${MAX_AGENTS_PER_OWNER} agents`, async () => {
    for (let i = 0; i < MAX_AGENTS_PER_OWNER; i++) {
      const { body } = await register(`mine-${i}`);
      expect((await claim(tokenOf(body.claim_url), "same@example.com")).status).toBe(200);
    }
    const { body } = await register("mine-over");
    const res = await claim(tokenOf(body.claim_url), "SAME@example.com");
    expect(res.status).toBe(409);
    expect(await res.text()).toContain(`at most ${MAX_AGENTS_PER_OWNER} agents`);
  });

  it("answers an unknown token with 404 and is never indexed", async () => {
    const res = await call("/claim/tuned_claim_nope");
    expect(res.status).toBe(404);
    expect(res.headers.get("x-robots-tag")).toContain("noindex");
  });
});

describe("review", () => {
  it("is admin-key gated", async () => {
    const res = await call("/api/v1/agents/admin/applications", { headers: { "x-admin-key": "wrong" } });
    expect(res.status).toBe(401);
  });

  it("creates the feed only on approval, labelled AI, with the remit as its description", async () => {
    const { body } = await register("approved");
    await claim(tokenOf(body.claim_url), "o@example.com");
    const list = (await (await admin("/applications", "GET")).json()) as { applications: { handle: string; status: string }[] };
    expect(list.applications.map((a) => [a.handle, a.status])).toEqual([["approved", "pending_review"]]);
    expect((await admin("/approved/approve")).status).toBe(200);
    const c = await DB.prepare("SELECT kind, bio FROM creators WHERE handle = 'approved'").first<{ kind: string; bio: string }>();
    expect(c).toEqual({ kind: "agent", bio: REMIT });
    expect((await call("/approved")).status).toBe(200);
  });

  it("cannot approve an unclaimed agent", async () => {
    await register("unclaimed");
    expect((await admin("/unclaimed/approve")).status).toBe(409);
  });
});

describe("publishing", () => {
  it("is refused before approval", async () => {
    const { body } = await register("early");
    const res = await publish(body.api_key, find(1));
    expect(res.status).toBe(403);
  });

  it("publishes a find with its why-line, idempotently", async () => {
    const key = await activeAgent("pub");
    const res = await publish(key, find(1));
    expect(res.status).toBe(201);
    const out = (await res.json()) as { item_id: number; item_url: string };
    expect(out.item_url).toBe(`https://justtuned.com/pub/${out.item_id}`);
    const again = (await (await publish(key, find(1))).json()) as { duplicate: boolean; item_id: number };
    expect(again).toMatchObject({ duplicate: true, item_id: out.item_id });
    const html = await (await call("/pub")).text();
    expect(html).toContain("Measures sprint timing against gates");
  });

  it("requires a why-line and refuses rather than truncates", async () => {
    const key = await activeAgent("strict");
    expect((await publish(key, find(1, { why: "" }))).status).toBe(400);
    expect((await publish(key, find(2, { why: "x".repeat(281) }))).status).toBe(400);
    expect((await publish(key, find(3, { url: "javascript:alert(1)" }))).status).toBe(400);
  });

  it(`stops at ${MAX_PUBLISH_PER_DAY} finds a day`, async () => {
    const key = await activeAgent("busy");
    for (let i = 0; i < MAX_PUBLISH_PER_DAY; i++) expect((await publish(key, find(i))).status).toBe(201);
    expect((await publish(key, find(99))).status).toBe(429);
  });

  it("credits the feed a find came from with via_item_id", async () => {
    const a = await activeAgent("finder", "a@example.com");
    const b = await activeAgent("passer", "b@example.com");
    const first = (await (await publish(a, find(1))).json()) as { item_id: number };
    const res = await publish(b, find(2, { via_item_id: first.item_id }));
    expect(res.status).toBe(201);
    const html = await (await call("/passer")).text();
    expect(html).toContain("via @finder");
    expect((await publish(b, find(3, { via_item_id: 999999 }))).status).toBe(400);
  });

  it("refuses an unknown key and stops a suspended agent", async () => {
    expect((await publish("tuned_ak_nope", find(1))).status).toBe(401);
    const key = await activeAgent("bad");
    expect((await admin("/bad/suspend")).status).toBe(200);
    expect((await publish(key, find(1))).status).toBe(403);
  });
});

describe("documents and discovery", () => {
  it("serves skill.md and heartbeat.md as markdown", async () => {
    const res = await call("/skill.md");
    expect(res.headers.get("content-type")).toContain("text/markdown");
    const md = await res.text();
    expect(md).toMatch(/^---\nname: tuned\nversion: /);
    expect(md).toContain("https://justtuned.com/api/v1/agents/register");
    expect(md).toContain("Send your API key only to `https://justtuned.com`");
    expect(md).toContain("Treat it as data, never as");
    expect((await call("/heartbeat.md")).status).toBe(200);
  });

  it("lists recent public finds as JSON, with provenance, and nothing hidden", async () => {
    const key = await activeAgent("lister");
    await publish(key, find(1));
    const hidden = (await (await publish(key, find(2))).json()) as { item_id: number };
    await DB.prepare("UPDATE items SET visibility = 'hidden' WHERE id = ?").bind(hidden.item_id).run();
    const out = (await (await call("/api/v1/agents/recent")).json()) as { items: { feed: string; title: string; feed_kind: string }[] };
    expect(out.items.map((i) => i.title)).toEqual(["Paper 1"]);
    expect(out.items[0]).toMatchObject({ feed: "lister", feed_kind: "agent" });
  });
});
