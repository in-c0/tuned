// The agent operator control plane, exercised in workerd against a real D1.
//
// What these tests are for. The operator key is a single credential that will live in a
// GitHub repository secret and be used, unattended, to mint and drive agent feeds in
// production. Its whole value is that its authority is *narrow*, so the tests that matter
// are the refusals: wrong key, wrong owner, human feed, unadopted agent, replayed publish,
// thirteenth agent, revoked agent. If any of those ever start succeeding, the boundary the
// owner was asked to trust has quietly stopped existing.
//
// Nothing here touches production. Every token in this file is local to it.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";
import { MAX_MANAGED_AGENTS } from "../src/operator";

const DB = env.DB as D1Database;

const OPERATOR_KEY = "test-operator-key-local-only";
const OWNER_HANDLE = "ava";

/** Env as production has it once the owner installs the operator secret. */
function operatorEnv(overrides: Record<string, string> = {}): Record<string, unknown> {
  return { ...env, AGENT_OPERATOR_KEY: OPERATOR_KEY, AGENT_OPERATOR_OWNER: OWNER_HANDLE, ...overrides };
}

async function call(
  path: string,
  init: RequestInit = {},
  envOverride: Record<string, unknown> = operatorEnv()
): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`https://example.test${path}`, init), envOverride as never, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

/** An authenticated operator call. The key travels in a header, never in the URL. */
async function op(
  path: string,
  body?: unknown,
  key: string = OPERATOR_KEY,
  envOverride: Record<string, unknown> = operatorEnv()
): Promise<Response> {
  return await call(
    path,
    {
      method: body === undefined ? "GET" : "POST",
      headers: { "x-operator-key": key, "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    },
    envOverride
  );
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

beforeEach(async () => {
  await DB.batch([
    DB.prepare("DELETE FROM operator_item_actions"),
    DB.prepare("DELETE FROM operator_publications"),
    DB.prepare("DELETE FROM operator_agents"),
    DB.prepare("DELETE FROM items"),
    DB.prepare("DELETE FROM creators"),
    DB.prepare("DELETE FROM members"),
  ]);
  // The owner (member 1) with their human feed, plus a dormant agent feed they own —
  // production's actual shape. Member 2 is a second member whose agent must stay
  // untouchable no matter what a workflow input says.
  await DB.batch([
    DB.prepare("INSERT INTO members (id, email, name, session_token) VALUES (1, 'owner@example.test', 'Owner', 'sess-1')"),
    DB.prepare("INSERT INTO members (id, email, name, session_token) VALUES (2, 'other@example.test', 'Other', 'sess-2')"),
    DB.prepare(
      "INSERT INTO creators (handle, name, token, kind, member_id) VALUES ('ava', 'Owner', 'tok-human-ava', 'human', 1)"
    ),
    DB.prepare(
      "INSERT INTO creators (handle, name, token, kind, member_id, charter) VALUES ('scout', 'Scout', 'tok-agent-scout', 'agent', 1, 'existing charter')"
    ),
    DB.prepare(
      "INSERT INTO creators (handle, name, token, kind, member_id) VALUES ('foreign', 'Foreign', 'tok-agent-foreign', 'agent', 2)"
    ),
  ]);
});

const REMIT = "Track edge-compute release notes and post the ones an operator would act on.";

describe("the gate", () => {
  it("fails closed with 503 when no operator key is configured", async () => {
    const res = await op("/api/operator/agents", undefined, OPERATOR_KEY, { ...env, AGENT_OPERATOR_KEY: "" });
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ ok: false, error: "operator key not configured" });
  });

  it("treats a whitespace-only key as absent, not as a key", async () => {
    const res = await op("/api/operator/agents", undefined, "   ", { ...env, AGENT_OPERATOR_KEY: "   " });
    expect(res.status).toBe(503);
  });

  it("rejects a wrong key with 401", async () => {
    const res = await op("/api/operator/agents", undefined, "not-the-key");
    expect(res.status).toBe(401);
  });

  it("rejects a missing key header with 401", async () => {
    const res = await call("/api/operator/agents", {}, operatorEnv());
    expect(res.status).toBe(401);
  });

  it("authenticates through the shared timing-safe comparison, including its whitespace normalisation", async () => {
    // A secret stored by `echo key | wrangler secret put` carries a trailing newline. The
    // shared helper trims both sides; if the operator plane ever grew its own comparison,
    // this is the case that would silently start 401ing in production only.
    const res = await op("/api/operator/agents", undefined, OPERATOR_KEY, {
      ...operatorEnv(),
      AGENT_OPERATOR_KEY: `${OPERATOR_KEY}\n`,
    });
    expect(res.status).toBe(200);
  });

  it("refuses to run when it has been handed the admin key", async () => {
    const res = await op("/api/operator/agents", undefined, OPERATOR_KEY, {
      ...operatorEnv(),
      ADMIN_KEY: OPERATOR_KEY,
    });
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ error: "operator key must differ from admin key" });
  });

  it("fails closed when the configured owner handle resolves to no member", async () => {
    const res = await op("/api/operator/agents", undefined, OPERATOR_KEY, {
      ...operatorEnv(),
      AGENT_OPERATOR_OWNER: "nobody",
    });
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ error: "operator owner not resolvable" });
  });
});

describe("owner scoping", () => {
  it("refuses to adopt an agent owned by another member", async () => {
    const res = await op("/api/operator/agents/adopt", { handle: "foreign", remit: REMIT });
    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({ error: "feed is not owned by the operator's member" });
    const row = await DB.prepare("SELECT COUNT(*) AS n FROM operator_agents").first<{ n: number }>();
    expect(row!.n).toBe(0);
  });

  it("refuses to adopt a human feed", async () => {
    const res = await op("/api/operator/agents/adopt", { handle: "ava", remit: REMIT });
    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({ error: "not an agent feed" });
  });

  it("refuses to publish into a human feed even when the handle is the owner's own", async () => {
    const res = await op("/api/operator/agents/ava/items", {
      url: "https://example.test/a",
      title: "Would be a human post",
      idempotency_key: "human-feed-attempt",
    });
    expect(res.status).toBe(403);
    const items = await DB.prepare("SELECT COUNT(*) AS n FROM items").first<{ n: number }>();
    expect(items!.n).toBe(0);
  });

  it("refuses to publish into another member's agent", async () => {
    const res = await op("/api/operator/agents/foreign/items", {
      url: "https://example.test/a",
      title: "Not yours",
      idempotency_key: "foreign-attempt",
    });
    expect(res.status).toBe(403);
  });
});

describe("adoption and creation", () => {
  it("adopts an existing owned agent and records how it came under management", async () => {
    const res = await op("/api/operator/agents/adopt", { handle: "scout", remit: REMIT });
    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({ ok: true, handle: "scout", status: "active", adopted: true });

    const row = await DB.prepare("SELECT * FROM operator_agents WHERE handle = 'scout'").first<Record<string, unknown>>();
    expect(row).toMatchObject({ source: "adopted", status: "active", member_id: 1, remit: REMIT });
    expect(String(row!.principal)).toBe("github-actions");
    expect(String(row!.created_at)).not.toBe("");
  });

  it("does not silently adopt agents that already exist", async () => {
    // The pre-existing @scout is untouched until someone adopts it explicitly.
    const res = await op("/api/operator/agents");
    const body = await res.json<{ managed: unknown[]; adoptable: string[] }>();
    expect(body.managed).toHaveLength(0);
    expect(body.adoptable).toEqual(["scout"]);
  });

  it("re-adoption is idempotent rather than a second row", async () => {
    await op("/api/operator/agents/adopt", { handle: "scout", remit: REMIT });
    const again = await op("/api/operator/agents/adopt", { handle: "scout", remit: REMIT });
    expect(again.status).toBe(200);
    expect(await again.json()).toMatchObject({ adopted: false });
    const row = await DB.prepare("SELECT COUNT(*) AS n FROM operator_agents").first<{ n: number }>();
    expect(row!.n).toBe(1);
  });

  it("creates a new owned agent from a public remit, and never returns its studio token", async () => {
    const res = await op("/api/operator/agents", { handle: "edgewatch", name: "Edgewatch", remit: REMIT });
    expect(res.status).toBe(201);
    const body = await res.text();
    expect(JSON.parse(body)).toMatchObject({ ok: true, handle: "edgewatch", source: "created" });

    const created = await DB.prepare("SELECT * FROM creators WHERE handle = 'edgewatch'").first<Record<string, unknown>>();
    expect(created).toMatchObject({ kind: "agent", member_id: 1 });
    expect(String(created!.charter)).toBe(REMIT); // the public remit is the agent's brief
    expect(String(created!.token).length).toBeGreaterThan(20);
    // The token exists in D1 and appears nowhere in the response.
    expect(body).not.toContain(String(created!.token));
    expect(body).not.toContain("studio");
  });

  it("refuses invalid and reserved handles", async () => {
    for (const handle of ["api", "studio", "A", "has space", "-lead", ""]) {
      const res = await op("/api/operator/agents", { handle, name: "X", remit: REMIT });
      expect(res.status, handle).toBe(400);
    }
  });

  it("refuses a remit that is missing or too short to be a remit", async () => {
    const res = await op("/api/operator/agents", { handle: "thin", name: "Thin", remit: "watch" });
    expect(res.status).toBe(400);
    const none = await op("/api/operator/agents/adopt", { handle: "scout" });
    expect(none.status).toBe(400);
  });

  it("stops at the managed-agent ceiling", async () => {
    for (let i = 0; i < MAX_MANAGED_AGENTS; i++) {
      const res = await op("/api/operator/agents", { handle: `bounded${i}`, name: `Bounded ${i}`, remit: REMIT });
      expect(res.status, `agent ${i}`).toBe(201);
    }
    const overflow = await op("/api/operator/agents", { handle: "thirteenth", name: "Thirteenth", remit: REMIT });
    expect(overflow.status).toBe(409);
    expect(await overflow.json()).toMatchObject({ ok: false });
    // The refusal is complete: no creator row was left behind by the rejected create.
    const leftover = await DB.prepare("SELECT COUNT(*) AS n FROM creators WHERE handle = 'thirteenth'").first<{ n: number }>();
    expect(leftover!.n).toBe(0);
    // Adoption is bounded by the same ceiling.
    const adopt = await op("/api/operator/agents/adopt", { handle: "scout", remit: REMIT });
    expect(adopt.status).toBe(409);
  });
});

describe("publication", () => {
  beforeEach(async () => {
    await op("/api/operator/agents/adopt", { handle: "scout", remit: REMIT });
  });

  it("refuses to publish to an owned agent that has not been adopted", async () => {
    await op("/api/operator/agents", { handle: "unmanaged", name: "Unmanaged", remit: REMIT });
    await DB.prepare("DELETE FROM operator_agents WHERE handle = 'unmanaged'").run();
    const res = await op("/api/operator/agents/unmanaged/items", {
      url: "https://example.test/x",
      title: "Nope",
      idempotency_key: "unmanaged-attempt",
    });
    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({ error: "agent is not operator-managed — adopt it first" });
  });

  it("publishes one source-linked find with its public why-selected line", async () => {
    const res = await op("/api/operator/agents/scout/items", {
      url: "https://blog.example.test/post?utm=1",
      title: "A find",
      description: "What the source says.",
      category: "Tech",
      why: "Selected because it changes how edge deploys roll back.",
      idempotency_key: "find-2026-08-14-001",
    });
    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({ ok: true, published: true, duplicate: false });

    const item = await DB.prepare("SELECT * FROM items ORDER BY id DESC LIMIT 1").first<Record<string, unknown>>();
    expect(item).toMatchObject({
      visibility: "public",
      domain: "blog.example.test",
      title: "A find",
      note: "Selected because it changes how edge deploys roll back.",
    });
    // Provenance: the item belongs to the agent's own feed, so the feed and RSS label it
    // as the agent's find rather than a human's.
    const agent = await DB.prepare("SELECT id FROM creators WHERE handle = 'scout'").first<{ id: number }>();
    expect(item!.creator_id).toBe(agent!.id);

    const audit = await DB.prepare("SELECT * FROM operator_publications").first<Record<string, unknown>>();
    expect(audit).toMatchObject({ idempotency_key: "find-2026-08-14-001", item_id: item!.id });
  });

  it("publishes nothing on a replayed idempotency key", async () => {
    const first = await op("/api/operator/agents/scout/items", {
      url: "https://example.test/one",
      title: "Once",
      idempotency_key: "replay-me-please",
    });
    expect(first.status).toBe(201);
    const firstId = (await first.json<{ item_id: number }>()).item_id;

    for (let i = 0; i < 3; i++) {
      const replay = await op("/api/operator/agents/scout/items", {
        url: "https://example.test/one",
        title: "Once",
        idempotency_key: "replay-me-please",
      });
      expect(replay.status).toBe(200);
      expect(await replay.json()).toMatchObject({ duplicate: true, published: false, item_id: firstId });
    }
    const n = await DB.prepare("SELECT COUNT(*) AS n FROM items").first<{ n: number }>();
    expect(n!.n).toBe(1);
  });

  it("refuses a publish without a usable idempotency key", async () => {
    for (const idempotency_key of [undefined, "", "short"]) {
      const res = await op("/api/operator/agents/scout/items", {
        url: "https://example.test/x",
        title: "T",
        idempotency_key,
      });
      expect(res.status).toBe(400);
    }
    const n = await DB.prepare("SELECT COUNT(*) AS n FROM items").first<{ n: number }>();
    expect(n!.n).toBe(0);
  });

  // A silently truncated `why` is a fabricated provenance line: it stops mid-word, it
  // reads as the agent's own account of what it saw, and the caller is told 201. The
  // refusal is the point — nothing half-written may reach a reader under an agent's name.
  it("refuses an over-long field instead of publishing a truncated one", async () => {
    const cases = [
      { field: "why", body: { why: "w".repeat(281) } },
      { field: "title", body: { title: "t".repeat(301) } },
      { field: "description", body: { description: "d".repeat(501) } },
      { field: "url", body: { url: `https://example.test/${"p".repeat(2000)}` } },
    ];
    for (const { field, body } of cases) {
      const res = await op("/api/operator/agents/scout/items", {
        url: "https://example.test/long",
        title: "A find",
        idempotency_key: `too-long-${field}-key`,
        ...body,
      });
      expect(res.status, field).toBe(400);
      expect(await res.json(), field).toMatchObject({ ok: false, error: expect.stringContaining(field) });
    }
    const n = await DB.prepare("SELECT COUNT(*) AS n FROM items").first<{ n: number }>();
    expect(n!.n).toBe(0);
    // The rejected dispatches must not have burned their idempotency keys either — the
    // operator has to be able to shorten the line and re-send the same find.
    const claims = await DB.prepare("SELECT COUNT(*) AS n FROM operator_publications").first<{ n: number }>();
    expect(claims!.n).toBe(0);
  });

  it("publishes a why line that sits exactly on the limit, unaltered", async () => {
    const why = "w".repeat(280);
    const res = await op("/api/operator/agents/scout/items", {
      url: "https://example.test/at-the-limit",
      title: "A find",
      why,
      idempotency_key: "exactly-280-key",
    });
    expect(res.status).toBe(201);
    const item = await DB.prepare("SELECT note FROM items ORDER BY id DESC LIMIT 1").first<{ note: string }>();
    expect(item!.note).toBe(why);
  });

  it("refuses a find that is not a fetchable web source", async () => {
    for (const url of ["javascript:alert(1)", "data:text/html,x", "not a url", ""]) {
      const res = await op("/api/operator/agents/scout/items", {
        url,
        title: "T",
        idempotency_key: `bad-url-${url.slice(0, 6)}-key`,
      });
      expect(res.status, url).toBe(400);
    }
    const n = await DB.prepare("SELECT COUNT(*) AS n FROM items").first<{ n: number }>();
    expect(n!.n).toBe(0);
  });
});

describe("revocation", () => {
  it("disables an agent, refuses its publishes, and stays reversible", async () => {
    await op("/api/operator/agents/adopt", { handle: "scout", remit: REMIT });
    await op("/api/operator/agents/scout/items", {
      url: "https://example.test/before",
      title: "Published while active",
      idempotency_key: "before-revocation",
    });

    const off = await op("/api/operator/agents/scout/disable", {});
    expect(off.status).toBe(200);
    expect(await off.json()).toMatchObject({ status: "disabled", changed: true });

    const blocked = await op("/api/operator/agents/scout/items", {
      url: "https://example.test/after",
      title: "Should not exist",
      idempotency_key: "after-revocation",
    });
    expect(blocked.status).toBe(403);
    const n = await DB.prepare("SELECT COUNT(*) AS n FROM items").first<{ n: number }>();
    expect(n!.n).toBe(1);

    // Revocation is not deletion: the feed, its items and the owner's own studio token
    // are untouched, which is what makes re-adoption a restoration rather than a rebuild.
    const creator = await DB.prepare("SELECT token, kind FROM creators WHERE handle = 'scout'").first<Record<string, unknown>>();
    expect(creator).toMatchObject({ token: "tok-agent-scout", kind: "agent" });

    const back = await op("/api/operator/agents/adopt", { handle: "scout", remit: REMIT });
    expect(back.status).toBe(201);
    const allowed = await op("/api/operator/agents/scout/items", {
      url: "https://example.test/after",
      title: "Published after re-adoption",
      idempotency_key: "after-readoption",
    });
    expect(allowed.status).toBe(201);
  });

  it("disabling twice is idempotent and disabling an unmanaged agent is a 404", async () => {
    await op("/api/operator/agents/adopt", { handle: "scout", remit: REMIT });
    await op("/api/operator/agents/scout/disable", {});
    const again = await op("/api/operator/agents/scout/disable", {});
    expect(again.status).toBe(200);
    expect(await again.json()).toMatchObject({ changed: false });

    const missing = await op("/api/operator/agents/foreign/disable", {});
    expect(missing.status).toBe(404);
  });
});

describe("retraction", () => {
  /** Publish one find through the plane and hand back its item id. */
  async function publish(idempotency_key: string, url = "https://example.test/find"): Promise<number> {
    const res = await op("/api/operator/agents/scout/items", {
      url,
      title: "A find",
      why: "Selected because the source says something an operator would act on.",
      idempotency_key,
    });
    expect(res.status).toBe(201);
    return (await res.json<{ item_id: number }>()).item_id;
  }

  beforeEach(async () => {
    await op("/api/operator/agents/adopt", { handle: "scout", remit: REMIT });
  });

  it("takes a published item off the public feed and puts it back unchanged", async () => {
    const id = await publish("retract-round-trip");
    const before = await DB.prepare("SELECT created_at, title, note FROM items WHERE id = ?")
      .bind(id)
      .first<Record<string, unknown>>();

    const feedBefore = await call("/scout");
    expect(await feedBefore.text()).toContain("A find");

    const off = await op(`/api/operator/agents/scout/items/${id}/retract`, {});
    expect(off.status).toBe(200);
    expect(await off.json()).toMatchObject({ ok: true, action: "retract", changed: true, visibility: "hidden", item_id: id });

    // The reader-facing surfaces are the assertion that matters. A retract that only moved
    // a column while the feed and its RSS still served the item would be an undo in name.
    expect(await (await call("/scout")).text()).not.toContain("A find");
    expect(await (await call("/scout/rss.xml")).text()).not.toContain("A find");

    const back = await op(`/api/operator/agents/scout/items/${id}/restore`, {});
    expect(back.status).toBe(200);
    expect(await back.json()).toMatchObject({ action: "restore", changed: true, visibility: "public" });
    expect(await (await call("/scout")).text()).toContain("A find");

    // Nothing else about the item moved, so the round trip is a genuine no-op: a restored
    // item returns to its own place in the feed rather than to the top of it.
    const after = await DB.prepare("SELECT created_at, title, note FROM items WHERE id = ?")
      .bind(id)
      .first<Record<string, unknown>>();
    expect(after).toEqual(before);

    const actions = await DB.prepare("SELECT action, principal FROM operator_item_actions ORDER BY id").all<{
      action: string;
      principal: string;
    }>();
    expect(actions.results.map((a) => a.action)).toEqual(["retract", "restore"]);
  });

  it("refuses to touch an item this operator did not publish", async () => {
    // The agent's own history, put there by its studio rather than by this plane. A
    // credential that could veto these would be an editor of the feed, not a publisher
    // into it.
    const agent = await DB.prepare("SELECT id FROM creators WHERE handle = 'scout'").first<{ id: number }>();
    const own = await DB.prepare(
      "INSERT INTO items (creator_id, url, title, domain, kind, visibility) VALUES (?, 'https://example.test/own', 'The agent own find', 'example.test', 'link', 'public') RETURNING id"
    )
      .bind(agent!.id)
      .first<{ id: number }>();

    const res = await op(`/api/operator/agents/scout/items/${own!.id}/retract`, {});
    expect(res.status).toBe(404);
    expect(await res.json()).toMatchObject({ error: "no such item, or it was not published by this operator" });
    const still = await DB.prepare("SELECT visibility FROM items WHERE id = ?").bind(own!.id).first<{ visibility: string }>();
    expect(still!.visibility).toBe("public");
  });

  it("will not reverse a veto the owner made", async () => {
    const id = await publish("owner-hid-this");
    // The owner's studio hide, as `src/index.ts` performs it.
    await DB.prepare("UPDATE items SET visibility = 'hidden' WHERE id = ?").bind(id).run();

    const res = await op(`/api/operator/agents/scout/items/${id}/restore`, {});
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({
      error: "item was not hidden by this operator — a human veto is not the operator's to reverse",
    });
    const still = await DB.prepare("SELECT visibility FROM items WHERE id = ?").bind(id).first<{ visibility: string }>();
    expect(still!.visibility).toBe("hidden");
  });

  it("is idempotent in both directions", async () => {
    const id = await publish("retract-twice");
    const first = await op(`/api/operator/agents/scout/items/${id}/retract`, {});
    expect(await first.json()).toMatchObject({ changed: true });
    const again = await op(`/api/operator/agents/scout/items/${id}/retract`, {});
    expect(again.status).toBe(200);
    expect(await again.json()).toMatchObject({ changed: false, visibility: "hidden" });

    await op(`/api/operator/agents/scout/items/${id}/restore`, {});
    const restoredAgain = await op(`/api/operator/agents/scout/items/${id}/restore`, {});
    expect(restoredAgain.status).toBe(200);
    expect(await restoredAgain.json()).toMatchObject({ changed: false, visibility: "public" });

    // A no-op writes no audit row, so the trail records what happened rather than what
    // was asked for.
    const n = await DB.prepare("SELECT COUNT(*) AS n FROM operator_item_actions").first<{ n: number }>();
    expect(n!.n).toBe(2);
  });

  it("keeps the same boundaries every other mutation has", async () => {
    const id = await publish("boundary-check");

    // A human feed, a foreign member's agent, and an unparseable item id.
    for (const path of [
      `/api/operator/agents/ava/items/${id}/retract`,
      `/api/operator/agents/foreign/items/${id}/retract`,
    ]) {
      const res = await op(path, {});
      expect(res.status).toBe(403);
    }
    const bad = await op(`/api/operator/agents/scout/items/not-a-number/retract`, {});
    expect(bad.status).toBe(400);

    // Unauthenticated, and with the wrong key.
    expect((await call(`/api/operator/agents/scout/items/${id}/retract`, { method: "POST" })).status).toBe(401);
    expect((await op(`/api/operator/agents/scout/items/${id}/retract`, {}, "not-the-key")).status).toBe(401);

    const untouched = await DB.prepare("SELECT visibility FROM items WHERE id = ?").bind(id).first<{ visibility: string }>();
    expect(untouched!.visibility).toBe("public");
  });

  it("reports the retraction in the operator's own listing", async () => {
    const id = await publish("listed-retraction");
    await op(`/api/operator/agents/scout/items/${id}/retract`, {});

    const listed = await op("/api/operator/agents");
    const body = await listed.json<{ managed: Array<Record<string, unknown>> }>();
    const scout = body.managed.find((m) => m.handle === "scout");
    expect(scout).toMatchObject({ items_public: 0, operator_publications: 1, operator_publications_hidden: 1 });
    // The publication row survives, so a retracted find cannot be republished under the
    // same idempotency key and quietly counted twice.
    expect((await op("/api/operator/agents/scout/items", {
      url: "https://example.test/find",
      title: "A find",
      idempotency_key: "listed-retraction",
    })).status).toBe(200);
  });
});

describe("one key, many agents, zero token handling", () => {
  it("provisions and operates two different agents without ever handling a studio token", async () => {
    // This is the property the whole design exists for: the per-agent studio token
    // handoff is gone, and adding an agent is no longer an owner authentication event.
    const bodies: string[] = [];

    for (const [handle, name] of [
      ["alpha", "Alpha"],
      ["beta", "Beta"],
    ]) {
      const created = await op("/api/operator/agents", { handle, name, remit: REMIT });
      expect(created.status).toBe(201);
      bodies.push(await created.text());

      const published = await op(`/api/operator/agents/${handle}/items`, {
        url: `https://example.test/${handle}`,
        title: `${name} found something`,
        why: "Selected under the public remit.",
        idempotency_key: `${handle}-first-find-key`,
      });
      expect(published.status).toBe(201);
      bodies.push(await published.text());
    }

    const list = await op("/api/operator/agents");
    expect(list.status).toBe(200);
    const listBody = await list.text();
    bodies.push(listBody);
    const parsed = JSON.parse(listBody) as {
      active: number;
      limit: number;
      managed: Array<{ handle: string; items_public: number; operator_publications: number }>;
    };
    expect(parsed.active).toBe(2);
    expect(parsed.limit).toBe(MAX_MANAGED_AGENTS);
    expect(parsed.managed.map((m) => m.handle).sort()).toEqual(["alpha", "beta"]);
    for (const m of parsed.managed) {
      expect(m.items_public).toBe(1);
      expect(m.operator_publications).toBe(1);
    }

    // No response in the whole lifecycle carried a studio token, a session token, a member
    // email or the operator key itself.
    const { results: secrets } = await DB.prepare("SELECT token FROM creators").all<{ token: string }>();
    const { results: sessions } = await DB.prepare("SELECT session_token, email FROM members").all<{
      session_token: string;
      email: string;
    }>();
    const forbidden = [
      ...secrets.map((s) => s.token),
      ...sessions.map((s) => s.session_token),
      ...sessions.map((s) => s.email),
      OPERATOR_KEY,
    ];
    for (const body of bodies) {
      for (const secret of forbidden) {
        expect(body, `leaked ${secret.slice(0, 6)}…`).not.toContain(secret);
      }
    }
  });

  it("never discloses a charter, a member's skips or the private queue", async () => {
    await DB.prepare("UPDATE creators SET charter = 'PRIVATE-CHARTER-TEXT' WHERE handle = 'scout'").run();
    await op("/api/operator/agents/adopt", { handle: "scout", remit: REMIT });
    const agent = await DB.prepare("SELECT id FROM creators WHERE handle = 'scout'").first<{ id: number }>();
    await DB.prepare(
      "INSERT INTO items (creator_id, url, title, domain, visibility) VALUES (?, 'https://x.test/q', 'PRIVATE-QUEUED-ITEM', 'x.test', 'queued')"
    )
      .bind(agent!.id)
      .run();

    const list = await op("/api/operator/agents");
    const body = await list.text();
    expect(body).not.toContain("PRIVATE-CHARTER-TEXT");
    expect(body).not.toContain("PRIVATE-QUEUED-ITEM");
    // Liveness is a count of what is already public, nothing more.
    expect(JSON.parse(body).managed[0].items_public).toBe(0);
  });
});

describe("nothing else changed", () => {
  it("leaves the public site untouched while the operator key is absent", async () => {
    const res = await call("/api/operator/agents", {}, { ...env, AGENT_OPERATOR_KEY: "" });
    expect(res.status).toBe(503);
    const home = await call("/", {}, { ...env, AGENT_OPERATOR_KEY: "" });
    expect(home.status).toBe(200);
  });
});
