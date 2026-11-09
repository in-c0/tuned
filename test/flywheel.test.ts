// The smallest flywheel, turned once, in workerd against a real D1.
//
//   1. An operator agent publishes a find  -> a new /:handle/:id page, in the sitemap.
//   2. The publish generates (once) an AI-labelled "why it matters" note, or nothing.
//   3. A searcher lands on the find page (item_view + item_view_search, non-bot) and uses the
//      team CTA -> POST /waitlist role agent-request -> agent_request counted, draft stored.
//   4. The draft appears in the owner's review queue and nothing is public until she approves.
//   5. Approval mints a managed agent feed under the per-owner cap.
//
// The model is never reached: `env.AI` rejects in tests (vitest.config.mts), which is the
// "unavailable" path, and the paths that need a reply pass a fake.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";
import { acceptNote, generateItemContext, type AiRunner } from "../src/context";
import { draftFor, REQUESTS_PER_EMAIL } from "../src/requests";
import { snapshot } from "../src/metrics";
import { MAX_MANAGED_AGENTS } from "../src/operator";

const DB = env.DB as D1Database;
const ORIGIN = "https://justtuned.com";
const OPERATOR_KEY = "test-operator-key-local-only";
const BROWSER = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const GOOGLEBOT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const ABSTRACT =
  "This prospective cohort study followed 64 professional football players across two seasons to " +
  "examine whether eccentric hamstring strength measured in preseason predicted hamstring strain " +
  "injury. Players with lower eccentric strength had a higher rate of injury during the competitive " +
  "season. The authors conclude that preseason eccentric screening can help staff prioritise " +
  "prevention work for the athletes most at risk.";

const GOOD_NOTE =
  "For coaching and medical staff, this cohort of 64 professional players links lower preseason " +
  "eccentric hamstring strength to more strain injuries in season. It supports using a simple " +
  "preseason screen to decide which athletes get prevention work first.";

function fakeAi(reply: unknown, calls: unknown[] = []): AiRunner {
  return {
    run: async (_model, input) => {
      calls.push(input);
      return { response: reply };
    },
  };
}

function testEnv(over: Record<string, unknown> = {}): Record<string, unknown> {
  return { ...env, AGENT_OPERATOR_KEY: OPERATOR_KEY, AGENT_OPERATOR_OWNER: "ava", ADMIN_KEY: "admin-key", ...over };
}

async function call(path: string, init: RequestInit = {}, e: Record<string, unknown> = testEnv()): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`${ORIGIN}${path}`, init), e as never, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

async function counter(name: string): Promise<number> {
  const row = await DB.prepare("SELECT SUM(count) AS n FROM metric_days WHERE name = ?").bind(name).first<{ n: number | null }>();
  return row?.n ?? 0;
}

async function publish(body: Record<string, unknown>, e = testEnv()): Promise<{ item_id: number }> {
  const res = await call(
    "/api/operator/agents/sportstech/items",
    {
      method: "POST",
      headers: { "x-operator-key": OPERATOR_KEY, "content-type": "application/json" },
      body: JSON.stringify(body),
    },
    e
  );
  expect(res.status).toBe(201);
  return (await res.json()) as { item_id: number };
}

async function requestAgent(body: Record<string, unknown>, headers: Record<string, string> = {}): Promise<Response> {
  return call("/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json", origin: ORIGIN, "user-agent": BROWSER, ...headers },
    body: JSON.stringify({ role: "agent-request", ...body }),
  });
}

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

let ownerCookie = "";
let strangerCookie = "";

beforeEach(async () => {
  // Tables created lazily by the Worker exist after the first request; clear them if present.
  for (const t of ["item_ai_context", "agent_requests", "operator_publications", "operator_agents"]) {
    await DB.prepare(`DELETE FROM ${t}`).run().catch(() => undefined);
  }
  await DB.batch([
    DB.prepare("DELETE FROM items"),
    DB.prepare("DELETE FROM creators"),
    DB.prepare("DELETE FROM members"),
    DB.prepare("DELETE FROM waitlist"),
    DB.prepare("DELETE FROM metric_days"),
  ]);
  await DB.prepare("INSERT INTO members (id, email, name, session_token) VALUES (1, 'owner@example.com', 'Ava', 'owner-session')").run();
  await DB.prepare("INSERT INTO members (id, email, name, session_token) VALUES (2, 'other@example.com', 'Other', 'other-session')").run();
  await DB.prepare("INSERT INTO creators (handle, name, token, kind, member_id) VALUES ('ava', 'Ava', 'tok-ava', 'human', 1)").run();
  await DB.prepare("INSERT INTO creators (handle, name, token, kind, member_id) VALUES ('sportstech', 'Sports Tech', 'tok-st', 'agent', 1)").run();
  ownerCookie = "tuned_session=owner-session";
  strangerCookie = "tuned_session=other-session";
  const adopt = await call("/api/operator/agents/adopt", {
    method: "POST",
    headers: { "x-operator-key": OPERATOR_KEY, "content-type": "application/json" },
    body: JSON.stringify({ handle: "sportstech", remit: "Sports technology research, source-linked." }),
  });
  expect(adopt.status).toBe(201);
});

describe("the AI-written note: generated once at publish time, labelled, or absent", () => {
  it("stores and renders a grounded note, visibly labelled, under the source link", async () => {
    const calls: unknown[] = [];
    const { item_id } = await publish(
      { url: "https://doi.org/10.1/ham", title: "Eccentric hamstring strength and injury", why: "Selected by @sportstech.", idempotency_key: "key-note-1-0001", context_source: ABSTRACT },
      testEnv({ AI: fakeAi(GOOD_NOTE, calls) })
    );
    expect(calls.length).toBe(1);
    const html = await (await call(`/sportstech/${item_id}`)).text();
    expect(html).toContain('class="ai-context"');
    expect(html).toContain('<span class="ai-label">AI-written</span>');
    expect(html).toContain("not checked by a person");
    expect(html).toContain("eccentric hamstring strength");
    // The source link keeps primacy: the open CTA comes before the note in the body.
    const cta = html.indexOf('<a class="btn primary open-cta"');
    const note = html.indexOf('<aside class="ai-context"');
    expect(cta).toBeGreaterThan(-1);
    expect(cta).toBeLessThan(note);
    // ...and the note repeats the source link.
    expect(html.slice(note)).toContain('href="https://doi.org/10.1/ham"');
    // The source text the model was shown is not stored or shown.
    expect(html).not.toContain("prospective cohort study followed");
  });

  it("is generated once: a replayed publish does not regenerate or overwrite it", async () => {
    const calls: unknown[] = [];
    const body = { url: "https://doi.org/10.1/once", title: "Once", why: "w", idempotency_key: "key-once-0001", context_source: ABSTRACT };
    await publish(body, testEnv({ AI: fakeAi(GOOD_NOTE, calls) }));
    const replay = await call(
      "/api/operator/agents/sportstech/items",
      { method: "POST", headers: { "x-operator-key": OPERATOR_KEY, "content-type": "application/json" }, body: JSON.stringify(body) },
      testEnv({ AI: fakeAi("A different note entirely. It should never be stored here.", calls) })
    );
    expect(((await replay.json()) as { duplicate: boolean }).duplicate).toBe(true);
    expect(calls.length).toBe(1);
    const rows = await DB.prepare("SELECT COUNT(*) AS n FROM item_ai_context").first<{ n: number }>();
    expect(rows?.n).toBe(1);
  });

  it("renders nothing — no block, no label, no filler — when the model is unavailable", async () => {
    // env.AI rejects in tests: the real "unavailable" path.
    const { item_id } = await publish({ url: "https://doi.org/10.1/none", title: "None", why: "w", idempotency_key: "key-none-0001", context_source: ABSTRACT });
    const html = await (await call(`/sportstech/${item_id}`)).text();
    expect(html).not.toContain('class="ai-context"');
    expect(html).not.toContain("AI-written");
    expect(html).toContain("Tuned does not host this and did not write it");
  });

  it("does not call the model at all without source text, or with too little of it", async () => {
    const calls: unknown[] = [];
    await publish({ url: "https://doi.org/10.1/a", title: "A", why: "w", idempotency_key: "key-a-0001" }, testEnv({ AI: fakeAi(GOOD_NOTE, calls) }));
    await publish({ url: "https://doi.org/10.1/b", title: "B", why: "w", idempotency_key: "key-b-0001", context_source: "Too short." }, testEnv({ AI: fakeAi(GOOD_NOTE, calls) }));
    expect(calls.length).toBe(0);
  });

  it("refuses a note that invents a number, declines, links out or is the wrong length", () => {
    const input = { title: "T", domain: "doi.org", sourceText: ABSTRACT };
    expect(acceptNote(GOOD_NOTE, input).note).toBe(GOOD_NOTE);
    expect(acceptNote(GOOD_NOTE.replace("64", "640"), input).refused).toMatch(/number not in source/);
    expect(acceptNote("NONE", input).note).toBe("");
    expect(acceptNote(`${GOOD_NOTE} See https://example.com for more.`, input).note).toBe("");
    expect(acceptNote("One single sentence only, written long enough to clear the minimum length check that this note has to pass first", input).refused).toMatch(/sentences/);
    expect(acceptNote({ not: "text" }, input).note).toBe("");
  });

  it("a model failure never fails the publication", async () => {
    const broken: AiRunner = { run: async () => { throw new Error("boom"); } };
    const out = await generateItemContext(DB, broken, { id: 999, creator_id: 1 }, { title: "T", domain: "d", sourceText: ABSTRACT });
    expect(out).toEqual({ stored: false, refused: "model error" });
  });
});

describe("a searcher lands on a find page and asks for an agent for their team", () => {
  it("counts the arrival as item_view_search on the human side, and a crawler on the bot side", async () => {
    const { item_id } = await publish({ url: "https://doi.org/10.1/land", title: "Land", why: "w", idempotency_key: "key-land-0001" });
    await call(`/sportstech/${item_id}`, { headers: { "user-agent": BROWSER, referer: "https://www.google.com/" } });
    await call(`/sportstech/${item_id}`, { headers: { "user-agent": GOOGLEBOT } });
    await call(`/sportstech/${item_id}`, { headers: { "user-agent": GOOGLEBOT, referer: "https://www.google.com/" } });
    expect(await counter("item_view")).toBe(1);
    expect(await counter("item_view_search")).toBe(1);
    expect(await counter("item_view_bot")).toBe(2);
    expect(await counter("item_view_search_bot")).toBe(1);
  });

  it("shows the team CTA below the source link and the follow block, with no price", async () => {
    const { item_id } = await publish({ url: "https://doi.org/10.1/cta", title: "CTA", why: "w", idempotency_key: "key-cta-0001" });
    const html = await (await call(`/sportstech/${item_id}`)).text();
    const cta = html.indexOf('<a class="btn primary open-cta"');
    const follow = html.indexOf('id="follow-btn"');
    const team = html.indexOf('<div class="team-request"');
    expect(team).toBeGreaterThan(follow);
    expect(follow).toBeGreaterThan(cta);
    expect(html).toContain("Get an agent watching this topic for your team");
    expect(html).toContain(`data-item="${item_id}"`);
    expect(html).not.toMatch(/\$\s?\d/);
  });

  it("stores a request as a draft, counts agent_request, and puts nothing public", async () => {
    const { item_id } = await publish({ url: "https://doi.org/10.1/req", title: "Req", why: "w", idempotency_key: "key-req-0001" });
    const before = await (await call("/sitemap.xml")).text();
    const res = await requestAgent({ topic: "Hamstring injury return-to-play", team_type: "club", email: "Coach@Club.org", from_handle: "sportstech", from_item: item_id });
    expect(res.status).toBe(200);
    expect(await counter("agent_request")).toBe(1);
    expect(await counter("application_submit")).toBe(0);
    const row = await DB.prepare("SELECT * FROM agent_requests").first<Record<string, unknown>>();
    expect(row).toMatchObject({ topic: "Hamstring injury return-to-play", team_type: "club", email: "coach@club.org", source_handle: "sportstech", source_item_id: item_id, status: "pending", bot: 0 });
    // The existing waitlist mechanism holds the address, under the new role.
    const wl = await DB.prepare("SELECT role FROM waitlist WHERE email = 'coach@club.org'").first<{ role: string }>();
    expect(wl?.role).toBe("agent-request");
    // No creator row, no page, no sitemap entry for the draft.
    const draft = String(row!.draft_handle);
    expect(await DB.prepare("SELECT 1 FROM creators WHERE handle = ?").bind(draft).first()).toBeNull();
    expect((await call(`/${draft}`)).status).toBe(404);
    expect(await (await call("/sitemap.xml")).text()).toBe(before);
  });

  it("accepts a request with no email, and refuses a bad topic or bad email with a counter", async () => {
    expect((await requestAgent({ topic: "ACL rehab load monitoring", team_type: "lab" })).status).toBe(200);
    expect((await requestAgent({ topic: "x" })).status).toBe(400);
    expect((await requestAgent({ topic: "Valid topic", email: "not-an-email" })).status).toBe(400);
    expect(await counter("agent_request")).toBe(1);
    expect(await counter("agent_request_invalid")).toBe(2);
    expect((await DB.prepare("SELECT COUNT(*) AS n FROM waitlist").first<{ n: number }>())?.n).toBe(0);
  });

  it("keeps the bot/human split: a declared crawler lands in agent_request_bot and is flagged", async () => {
    await requestAgent({ topic: "Sprint mechanics" }, { "user-agent": GOOGLEBOT });
    await requestAgent({ topic: "Sprint mechanics two" }, { origin: "https://elsewhere.test" });
    expect(await counter("agent_request")).toBe(1);
    expect(await counter("agent_request_bot")).toBe(1);
    expect(await counter("agent_request_offpage")).toBe(1);
    const flagged = await DB.prepare("SELECT COUNT(*) AS n FROM agent_requests WHERE bot = 1").first<{ n: number }>();
    expect(flagged?.n).toBe(1);
  });

  it("ignores a source find that is not a public item of that handle", async () => {
    await requestAgent({ topic: "Forged source", from_handle: "sportstech", from_item: 424242 });
    const row = await DB.prepare("SELECT source_handle, source_item_id FROM agent_requests").first();
    expect(row).toEqual({ source_handle: "", source_item_id: null });
  });

  it("caps pending requests per address and collapses an exact repeat", async () => {
    for (let i = 0; i < REQUESTS_PER_EMAIL; i++) {
      expect((await requestAgent({ topic: `Topic number ${i}`, email: "a@team.org" })).status).toBe(200);
    }
    expect((await requestAgent({ topic: "Topic number 0", email: "a@team.org" })).status).toBe(200); // repeat
    expect((await requestAgent({ topic: "One too many", email: "a@team.org" })).status).toBe(429);
    expect(await counter("agent_request")).toBe(REQUESTS_PER_EMAIL);
    expect(await counter("agent_request_capped")).toBe(1);
  });
});

describe("the owner's review queue and one-tap approval", () => {
  async function oneRequest(): Promise<number> {
    await requestAgent({ topic: "Hamstring injury return-to-play", team_type: "coach", email: "c@club.org" });
    return (await DB.prepare("SELECT id FROM agent_requests").first<{ id: number }>())!.id;
  }

  it("shows pending drafts to the owner and to nobody else", async () => {
    await oneRequest();
    const owner = await (await call("/home", { headers: { cookie: ownerCookie } })).text();
    expect(owner).toContain("Agent requests — 1 waiting");
    expect(owner).toContain("Hamstring injury return-to-play");
    expect(owner).toContain("data-req-approve=");
    const stranger = await (await call("/home", { headers: { cookie: strangerCookie } })).text();
    expect(stranger).not.toContain("Agent requests");
  });

  it("lists drafts to the operator plane without any email, and the plane cannot approve", async () => {
    await oneRequest();
    const res = await call("/api/operator/requests", { headers: { "x-operator-key": OPERATOR_KEY } });
    const body = (await res.json()) as { pending: number; requests: { has_email: boolean; draft: { handle: string } }[] };
    expect(body.pending).toBe(1);
    expect(body.requests[0].has_email).toBe(true);
    expect(JSON.stringify(body)).not.toContain("c@club.org");
    const tryApprove = await call(`/api/operator/requests/1/approve`, { method: "POST", headers: { "x-operator-key": OPERATOR_KEY } });
    expect(tryApprove.status).toBe(404);
  });

  it("refuses approval to anyone but the owner's session", async () => {
    const id = await oneRequest();
    expect((await call(`/requests/${id}/approve`, { method: "POST" })).status).toBe(401);
    expect((await call(`/requests/${id}/approve`, { method: "POST", headers: { cookie: strangerCookie } })).status).toBe(403);
    expect((await DB.prepare("SELECT status FROM agent_requests WHERE id = ?").bind(id).first<{ status: string }>())?.status).toBe("pending");
  });

  it("one tap approves: a managed agent feed exists, empty, and the request is closed", async () => {
    const id = await oneRequest();
    const res = await call(`/requests/${id}/approve`, { method: "POST", headers: { cookie: ownerCookie } });
    expect(res.status).toBe(200);
    const { handle } = (await res.json()) as { handle: string };
    const feed = await DB.prepare("SELECT kind, member_id FROM creators WHERE handle = ?").bind(handle).first();
    expect(feed).toEqual({ kind: "agent", member_id: 1 });
    const managed = await DB.prepare("SELECT status, source, principal FROM operator_agents WHERE handle = ?").bind(handle).first();
    expect(managed).toEqual({ status: "active", source: "created", principal: "owner-approval" });
    expect((await DB.prepare("SELECT status, approved_handle FROM agent_requests WHERE id = ?").bind(id).first())).toEqual({ status: "approved", approved_handle: handle });
    expect(await counter("agent_request_approved")).toBe(1);
    // Empty feed: in no sitemap until its agent publishes.
    expect(await (await call("/sitemap.xml")).text()).not.toContain(`/${handle}<`);
    // A second tap does nothing.
    expect((await call(`/requests/${id}/approve`, { method: "POST", headers: { cookie: ownerCookie } })).status).toBe(404);
  });

  it("decline closes the draft without creating anything", async () => {
    const id = await oneRequest();
    const res = await call(`/requests/${id}/decline`, { method: "POST", headers: { cookie: ownerCookie } });
    expect(res.status).toBe(200);
    expect((await DB.prepare("SELECT COUNT(*) AS n FROM creators WHERE kind = 'agent'").first<{ n: number }>())?.n).toBe(1);
    expect(await counter("agent_request_declined")).toBe(1);
  });

  it("approval respects the owner's managed-agent cap", async () => {
    for (let i = 0; i < MAX_MANAGED_AGENTS - 1; i++) {
      await DB.prepare("INSERT INTO creators (handle, name, token, kind, member_id) VALUES (?, 'x', ?, 'agent', 1)").bind(`filler-${i}`, `tok-f${i}`).run();
      await DB.prepare("INSERT INTO operator_agents (creator_id, member_id, handle, remit, source) SELECT id, 1, handle, 'remit text here', 'created' FROM creators WHERE handle = ?").bind(`filler-${i}`).run();
    }
    const id = await oneRequest();
    const res = await call(`/requests/${id}/approve`, { method: "POST", headers: { cookie: ownerCookie } });
    expect(res.status).toBe(409);
    expect((await DB.prepare("SELECT status FROM agent_requests WHERE id = ?").bind(id).first<{ status: string }>())?.status).toBe("pending");
  });

  it("derives a valid, non-reserved handle and a public remit from the topic alone", () => {
    const d = draftFor("Hamstring injury return-to-play!", "club");
    expect(d.handle).toMatch(/^[a-z0-9][a-z0-9-]{1,30}$/);
    expect(d.handle.endsWith("-watch")).toBe(true);
    expect(d.remit).toContain("sports team or club");
    expect(draftFor("!!!", "other").handle).toBe("topic-watch");
  });
});

describe("/api/metrics carries the new signal", () => {
  it("reports agent_request in daily and the queue as totals, with no topic or address", async () => {
    await requestAgent({ topic: "Secret topic text", email: "private@team.org" });
    const snap = await snapshot(DB);
    expect(snap.daily.some((d) => d.name === "agent_request" && d.count === 1)).toBe(true);
    expect(snap.totals).toMatchObject({ agent_requests: 1, agent_requests_pending: 1, agent_requests_approved: 0 });
    const text = JSON.stringify(snap);
    expect(text).not.toContain("Secret topic text");
    expect(text).not.toContain("private@team.org");
  });
});
