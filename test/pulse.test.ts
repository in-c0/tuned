// The funnel pulse, made executable.
//
// `landing_view` has read 56–113 a day for nine days and `application_submit` has read 0
// for all nine. Three unrelated causes produce that same pair of numbers, and the loop
// could not tell them apart, so no change to the landing page was measurable. EXP-007
// adds the counters that separate them.
//
// These tests exist because a telemetry route that silently records nothing looks exactly
// like a page nobody touched — the same failure mode metrics.test.ts was written for. They
// run the real Worker against a real D1 in workerd and assert the counter actually lands,
// that the allowlist and the same-origin guard hold, and that the route stays a counter
// rather than growing into an open write endpoint.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";
import { utcDay } from "../src/metrics";

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
  await DB.batch([DB.prepare("DELETE FROM metric_days"), DB.prepare("DELETE FROM waitlist")]);
});

const HUMAN_UA = "Mozilla/5.0 (X11; Linux x86_64) Chrome/128.0.0.0";
const ORIGIN = "https://justtuned.com";

async function counterFor(name: string): Promise<number | null> {
  const row = await DB.prepare("SELECT count FROM metric_days WHERE day = ? AND name = ?")
    .bind(utcDay(), name)
    .first<{ count: number }>();
  return row?.count ?? null;
}

async function pulse(name: string, headers: Record<string, string>): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`${ORIGIN}/api/pulse/${name}`, { method: "POST", headers }), env as never, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

describe("the pulse route records what it claims to", () => {
  it("counts landing_engage from a same-origin browser POST", async () => {
    const res = await pulse("landing_engage", { origin: ORIGIN, "user-agent": HUMAN_UA });

    expect(res.status).toBe(204);
    expect(await res.text()).toBe("");
    expect(await counterFor("landing_engage")).toBe(1);
    expect(await counterFor("landing_engage_bot")).toBeNull();
  });

  it("counts application_start into its own bucket", async () => {
    await pulse("application_start", { origin: ORIGIN, "user-agent": HUMAN_UA });

    expect(await counterFor("application_start")).toBe(1);
    expect(await counterFor("landing_engage")).toBeNull();
  });

  it("separates bot-shaped callers instead of discarding them", async () => {
    // The same rule the landing view already follows: never filter silently, always split.
    // A crawler that executes the page's JS is a real fact about the traffic and belongs in
    // the record — just not in the number the loop reads as "a person was here".
    await pulse("landing_engage", { origin: ORIGIN, "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" });

    expect(await counterFor("landing_engage_bot")).toBe(1);
    expect(await counterFor("landing_engage")).toBeNull();
  });

  it("counts landing_render, the one pulse that asks nothing of the visitor", async () => {
    const res = await pulse("landing_render", { origin: ORIGIN, "user-agent": HUMAN_UA });

    expect(res.status).toBe(204);
    expect(await counterFor("landing_render")).toBe(1);
  });

  it("splits a self-declaring crawler out of landing_render too", async () => {
    // Googlebot renders JavaScript. If it landed in the unsuffixed name, the ratio this
    // counter exists to produce would read as browsers on the first crawl after deploy.
    await pulse("landing_render", { origin: ORIGIN, "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" });

    expect(await counterFor("landing_render_bot")).toBe(1);
    expect(await counterFor("landing_render")).toBeNull();
  });

  it("accumulates repeat pulses rather than overwriting them", async () => {
    await pulse("landing_engage", { origin: ORIGIN, "user-agent": HUMAN_UA });
    await pulse("landing_engage", { origin: ORIGIN, "user-agent": HUMAN_UA });

    expect(await counterFor("landing_engage")).toBe(2);
  });
});

describe("the pulse route stays bounded", () => {
  it("refuses a counter name that is not on the allowlist", async () => {
    // The whole risk of a public write endpoint is that it becomes a way to write anything.
    const res = await pulse("gross_cash", { origin: ORIGIN, "user-agent": HUMAN_UA });

    expect(res.status).toBe(404);
    expect(await counterFor("gross_cash")).toBeNull();
  });

  it("refuses a caller that sends no Origin at all", async () => {
    const res = await pulse("landing_engage", { "user-agent": HUMAN_UA });

    expect(res.status).toBe(403);
    expect(await counterFor("landing_engage")).toBeNull();
  });

  it("refuses a caller claiming a different origin", async () => {
    const res = await pulse("landing_engage", { origin: "https://elsewhere.example", "user-agent": HUMAN_UA });

    expect(res.status).toBe(403);
    expect(await counterFor("landing_engage")).toBeNull();
  });

  it("writes nothing on the paths it refuses", async () => {
    await pulse("landing_engage", { "user-agent": HUMAN_UA });
    await pulse("member_login", { origin: ORIGIN, "user-agent": HUMAN_UA });

    const { results } = await DB.prepare("SELECT name FROM metric_days").all<{ name: string }>();
    expect(results).toEqual([]);
  });
});

describe("a rejected application is no longer invisible", () => {
  it("counts application_invalid when the email fails validation", async () => {
    const ctx = createExecutionContext();
    const res = await worker.fetch(
      new Request(`${ORIGIN}/waitlist`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "not-an-email", role: "fan", note: "" }),
      }),
      env as never,
      ctx
    );
    await waitOnExecutionContext(ctx);

    expect(res.status).toBe(400);
    expect(await counterFor("application_invalid")).toBe(1);
    // The two must never be confused: only submissions that became applications count as one.
    expect(await counterFor("application_submit")).toBeNull();
  });

  it("does not count a valid application as invalid", async () => {
    const ctx = createExecutionContext();
    await worker.fetch(
      new Request(`${ORIGIN}/waitlist`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "someone@example.com", role: "fan", note: "" }),
      }),
      env as never,
      ctx
    );
    await waitOnExecutionContext(ctx);

    expect(await counterFor("application_submit")).toBe(1);
    expect(await counterFor("application_invalid")).toBeNull();
  });
});

describe("the landing page actually fires the pulses", () => {
  // Everything above proves the route works. This proves the page calls it — the failure
  // mode where the endpoint is perfect and no visitor ever reaches it.
  it("ships the one-shot pulse wiring to the browser", async () => {
    const ctx = createExecutionContext();
    const res = await worker.fetch(new Request(`${ORIGIN}/`, { headers: { "user-agent": HUMAN_UA } }), env as never, ctx);
    await waitOnExecutionContext(ctx);
    const html = await res.text();

    expect(html).toContain('/api/pulse/');
    expect(html).toContain('pulse("landing_render")');
    expect(html).toContain('pulse("landing_engage")');
    expect(html).toContain('pulse("application_start")');
    // One shot each: the guards are what make these page-loads rather than event counts.
    expect(html).toContain("if (engaged) return;");
    expect(html).toContain("if (started) return;");
    // landing_render is the exception and must stay one: it is a top-level statement, gated
    // by nothing and attached to no listener, because the event it reports is "this script
    // ran". Bind it to an interaction and it becomes a second landing_engage — which is the
    // exact defect it was built to fix.
    expect(html).not.toMatch(/addEventListener\([^)]*landing_render/);
    expect(html.match(/pulse\("landing_render"\)/g)).toHaveLength(1);
    // No cookie, no identifier, nothing persisted client-side. The privacy policy says the
    // site stores only small UI preferences in the browser; this must not change that.
    expect(html).not.toContain("localStorage.setItem(\"pulse");
  });
});
