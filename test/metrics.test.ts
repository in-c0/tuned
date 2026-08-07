// Telemetry is deliberately fail-quiet: src/metrics.ts swallows every error so a
// broken counter can never break a page. That is the right call for users and a
// dangerous one for the operating loop — if the SQL were wrong, production would
// record nothing, /api/metrics would return an empty set, and "no traffic" and
// "telemetry is broken" would look identical in the brief.
//
// These tests are what tells those two apart. They run the real module against a
// real D1 in workerd, so a silent failure fails here instead of in the baseline.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";
import { count, isBot, memberActive, snapshot, utcDay } from "../src/metrics";

const DB = env.DB as D1Database;

/** Applying the committed schema is itself a check: invalid SQL in schema.sql fails here. */
beforeAll(async () => {
  const statements = schemaSql
    .split("\n")
    // Strip trailing comments before splitting — schema.sql has inline comments that
    // themselves contain a semicolon, which would otherwise cut a statement in half.
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
    DB.prepare("DELETE FROM member_days"),
    DB.prepare("DELETE FROM waitlist"),
    DB.prepare("DELETE FROM members"),
  ]);
});

async function counterFor(name: string, day: string): Promise<number | null> {
  const row = await DB.prepare("SELECT count FROM metric_days WHERE day = ? AND name = ?")
    .bind(day, name)
    .first<{ count: number }>();
  return row?.count ?? null;
}

describe("daily counters", () => {
  it("records the first event on a fresh database", async () => {
    await count(DB, "landing_view", "2026-08-01");
    expect(await counterFor("landing_view", "2026-08-01")).toBe(1);
  });

  it("accumulates rather than overwriting", async () => {
    // The ON CONFLICT upsert is the single most consequential line in the module:
    // if it silently replaced instead of adding, every count would be stuck at 1.
    for (let i = 0; i < 5; i++) await count(DB, "landing_view", "2026-08-01");
    expect(await counterFor("landing_view", "2026-08-01")).toBe(5);
  });

  it("keys counters independently by name and by day", async () => {
    await count(DB, "landing_view", "2026-08-01");
    await count(DB, "application_submit", "2026-08-01");
    await count(DB, "landing_view", "2026-08-02");

    expect(await counterFor("landing_view", "2026-08-01")).toBe(1);
    expect(await counterFor("application_submit", "2026-08-01")).toBe(1);
    expect(await counterFor("landing_view", "2026-08-02")).toBe(1);
  });

  it("buckets by UTC day", () => {
    expect(utcDay(new Date("2026-08-01T23:59:59Z"))).toBe("2026-08-01");
    expect(utcDay(new Date("2026-08-02T00:00:01Z"))).toBe("2026-08-02");
  });
});

describe("member activity", () => {
  it("counts desk views and actions in separate columns", async () => {
    await memberActive(DB, 1, "desk", "2026-08-01");
    await memberActive(DB, 1, "desk", "2026-08-01");
    await memberActive(DB, 1, "action", "2026-08-01");

    const row = await DB.prepare("SELECT desk_views, actions FROM member_days WHERE member_id = 1 AND day = ?")
      .bind("2026-08-01")
      .first<{ desk_views: number; actions: number }>();
    expect(row).toEqual({ desk_views: 2, actions: 1 });
  });

  it("keeps one row per member per day instead of overwriting history", async () => {
    // The whole point of the table: members.last_desk_at could not answer this.
    await memberActive(DB, 1, "desk", "2026-08-01");
    await memberActive(DB, 1, "desk", "2026-08-03");
    const { results } = await DB.prepare("SELECT day FROM member_days WHERE member_id = 1 ORDER BY day").all<{ day: string }>();
    expect(results.map((r) => r.day)).toEqual(["2026-08-01", "2026-08-03"]);
  });
});

describe("retention arithmetic", () => {
  it("separates members who returned from members who came once", async () => {
    await memberActive(DB, 1, "desk", "2026-08-01");
    await memberActive(DB, 1, "desk", "2026-08-02"); // returned
    await memberActive(DB, 2, "desk", "2026-08-01"); // came once
    await memberActive(DB, 2, "action", "2026-08-01"); // same day — still once

    const { retention } = await snapshot(DB);
    expect(retention.members_ever_active).toBe(2);
    expect(retention.members_active_2plus_days).toBe(1);
    expect(retention.members_returned_after_first_day).toBe(1);
  });

  it("counts recent activity inside the 7- and 28-day windows only", async () => {
    const dayAgo = (n: number) => utcDay(new Date(Date.now() - n * 86_400_000));
    await memberActive(DB, 1, "desk", dayAgo(2)); // inside 7d
    await memberActive(DB, 2, "desk", dayAgo(14)); // inside 28d only
    await memberActive(DB, 3, "desk", dayAgo(90)); // outside both

    const { retention } = await snapshot(DB);
    expect(retention.active_last_7d).toBe(1);
    expect(retention.active_last_28d).toBe(2);
  });
});

describe("bot classification", () => {
  it("treats crawlers, tooling and blank agents as bots", () => {
    for (const ua of ["", "curl/8.4.0", "Googlebot/2.1", "python-requests/2.32", "HeadlessChrome/120"]) {
      expect(isBot(ua), ua).toBe(true);
    }
  });

  it("does not classify an ordinary browser as a bot", () => {
    const chrome =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
    expect(isBot(chrome)).toBe(false);
  });
});

describe("snapshot payload", () => {
  it("reports aggregate counts without leaking any identifier", async () => {
    await DB.prepare("INSERT INTO waitlist (email, role, note) VALUES (?, ?, ?)")
      .bind("applicant@example.com", "human", "please let me in")
      .run();

    const result = await snapshot(DB);
    const serialised = JSON.stringify(result);

    expect(result.totals.applications).toBe(1);
    // Aggregate means aggregate: no email, note text or per-row detail may appear.
    expect(serialised).not.toContain("applicant@example.com");
    expect(serialised).not.toContain("please let me in");
  });
});

describe("/api/metrics access control", () => {
  async function call(headers: HeadersInit, metricsKey = "test-metrics-key"): Promise<Response> {
    const ctx = createExecutionContext();
    const res = await worker.fetch(
      new Request("https://justtuned.com/api/metrics", { headers }),
      { ...env, METRICS_KEY: metricsKey } as never,
      ctx
    );
    await waitOnExecutionContext(ctx);
    return res;
  }

  it("fails closed with 503 when no key is configured", async () => {
    const res = await call({}, "");
    expect(res.status).toBe(503);
  });

  it("rejects a wrong key with 401", async () => {
    const res = await call({ "x-metrics-key": "not-the-key" });
    expect(res.status).toBe(401);
  });

  it("rejects a missing key with 401 when a key is configured", async () => {
    const res = await call({});
    expect(res.status).toBe(401);
  });

  it("returns the snapshot to a correct key and forbids caching", async () => {
    const res = await call({ "x-metrics-key": "test-metrics-key" });
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toMatchObject({ note: expect.any(String), totals: expect.any(Object) });
  });

  // The case that cost this loop a cycle. `wrangler secret put` fed from a pipe stores
  // the trailing newline; HTTP strips surrounding whitespace from a header value in
  // transit, so the correct key becomes unmatchable by every possible client and the
  // endpoint answers 401 forever. Indistinguishable from a wrong key from outside.
  it("authenticates when the stored secret carries a trailing newline", async () => {
    const res = await call({ "x-metrics-key": "test-metrics-key" }, "test-metrics-key\n");
    expect(res.status).toBe(200);
  });

  it("authenticates when the stored secret carries surrounding whitespace", async () => {
    const res = await call({ "x-metrics-key": "test-metrics-key" }, "  test-metrics-key\r\n");
    expect(res.status).toBe(200);
  });

  it("still rejects a wrong key when the stored secret has stray whitespace", async () => {
    const res = await call({ "x-metrics-key": "not-the-key" }, "test-metrics-key\n");
    expect(res.status).toBe(401);
  });

  // A whitespace-only secret is configured in name only. It must read as absent, or the
  // unauthenticated status stops distinguishing "no key" from "wrong key" — the exact
  // ambiguity that made this failure invisible for eleven runs.
  it("treats a whitespace-only secret as unconfigured, not as a key", async () => {
    const res = await call({ "x-metrics-key": "   " }, "   ");
    expect(res.status).toBe(503);
  });
});

describe("/api/version build evidence", () => {
  // This route exists so post-deploy verification can prove which build is serving.
  // Two things must hold for that to work: it answers without a key (freshness has to
  // be checkable before secrets exist), and it says nothing else.
  async function version(): Promise<Response> {
    const ctx = createExecutionContext();
    const res = await worker.fetch(
      new Request("https://justtuned.com/api/version"),
      { ...env, METRICS_KEY: "test-metrics-key", ADMIN_KEY: "test-admin-key" } as never,
      ctx
    );
    await waitOnExecutionContext(ctx);
    return res;
  }

  it("reports a build commit to an unauthenticated caller", async () => {
    const res = await version();
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    const body = await res.json<{ commit: string }>();
    // A real SHA, or the explicit "unknown" the generator writes when it cannot find
    // one. Anything else means the build stamp is malformed and the verifier — which
    // compares this against the pushed SHA — would never match.
    expect(body.commit).toMatch(/^([0-9a-f]{7,40}|unknown)$/);
  });

  it("exposes the commit and nothing else", async () => {
    const body = await (await version()).json<Record<string, unknown>>();
    expect(Object.keys(body)).toEqual(["commit"]);
    // Bindings are in scope in this handler; none of them may reach the response.
    expect(JSON.stringify(body)).not.toContain("test-metrics-key");
    expect(JSON.stringify(body)).not.toContain("test-admin-key");
  });
});

describe("the funnel is actually wired to the routes", () => {
  // Everything above proves the module works. This proves the app calls it — the
  // failure mode where telemetry is perfect and simply never invoked.
  it("counts a landing view on a real request to /", async () => {
    const ctx = createExecutionContext();
    const res = await worker.fetch(
      new Request("https://justtuned.com/", { headers: { "user-agent": "Mozilla/5.0 (X11; Linux x86_64) Chrome/128.0.0.0" } }),
      env as never,
      ctx
    );
    await waitOnExecutionContext(ctx);

    expect(res.status).toBe(200);
    expect(await counterFor("landing_view", utcDay())).toBe(1);
    expect(await counterFor("landing_view_bot", utcDay())).toBeNull();
  });

  it("counts an application on a real POST to /waitlist", async () => {
    const ctx = createExecutionContext();
    const res = await worker.fetch(
      new Request("https://justtuned.com/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "someone@example.com", role: "human", note: "hi" }),
      }),
      env as never,
      ctx
    );
    await waitOnExecutionContext(ctx);

    expect(res.status).toBe(200);
    expect(await counterFor("application_submit", utcDay())).toBe(1);
  });
});
