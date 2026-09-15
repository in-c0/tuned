// `GET /api/applications` — the funnel's second stage made readable by its third.
//
// The defect this closes is not a wrong value, it is an absent one: `POST /waitlist` wrote rows
// that only `SELECT COUNT(*)` ever read, so the owner could see *that* someone applied and never
// *who*, while `POST /api/members` — the admission act — takes an email. These tests pin the two
// properties that make the route worth having (it returns the submission, and it says whether
// that address has already been admitted) and the three that keep it safe (fails closed while
// ADMIN_KEY is unset, refuses a wrong key, and never answers an unauthenticated caller).
//
// The empty table is a first-class case here rather than an afterthought. It is the state this
// ships against — `applications` has read 0 for the whole window — so an aggregate that returns
// SQL NULL over zero rows would reach the owner as `pending: null` on day one, and the first
// reading anyone takes of this route is the one taken before anybody has applied.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";

const DB = env.DB as D1Database;

const ADMIN_KEY = "test-admin-key";

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
  await DB.batch([DB.prepare("DELETE FROM waitlist"), DB.prepare("DELETE FROM members")]);
});

interface Body {
  total: number;
  pending: number;
  returned: number;
  applications: { email: string; role: string; note: string; created_at: string; admitted: boolean }[];
}

async function call(
  headers: HeadersInit = { "x-admin-key": ADMIN_KEY },
  adminKey: string = ADMIN_KEY,
  query = ""
): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(
    new Request(`https://justtuned.com/api/applications${query}`, { headers }),
    { ...env, ADMIN_KEY: adminKey } as never,
    ctx
  );
  await waitOnExecutionContext(ctx);
  return res;
}

async function apply(email: string, role = "fan", note = "", createdAt?: string): Promise<void> {
  if (createdAt) {
    await DB.prepare("INSERT INTO waitlist (email, role, note, created_at) VALUES (?, ?, ?, ?)")
      .bind(email, role, note, createdAt)
      .run();
    return;
  }
  await DB.prepare("INSERT INTO waitlist (email, role, note) VALUES (?, ?, ?)").bind(email, role, note).run();
}

describe("access control", () => {
  it("fails closed with 503 when ADMIN_KEY is unset", async () => {
    const res = await call({ "x-admin-key": "anything" }, "");
    expect(res.status).toBe(503);
  });

  // A secret provisioned as a bare newline is configured in name only; 503 and 401 have to keep
  // meaning different things or an undiagnosable outage looks exactly like a wrong key (L-12).
  it("treats a whitespace-only ADMIN_KEY as absent", async () => {
    const res = await call({ "x-admin-key": "  " }, "\n");
    expect(res.status).toBe(503);
  });

  it("refuses a wrong key with 401", async () => {
    const res = await call({ "x-admin-key": "nope" });
    expect(res.status).toBe(401);
  });

  it("refuses a caller with no key at all", async () => {
    const res = await call({});
    expect(res.status).toBe(401);
  });

  // The whole point of the route is that it returns addresses. A refusal that still leaked one
  // would be worse than the gap it closes, so both refusal paths are checked for a body.
  it("leaks no applicant address on either refusal", async () => {
    await apply("secret@example.com");
    for (const res of [await call({ "x-admin-key": "nope" }), await call({ "x-admin-key": "x" }, "")]) {
      expect(await res.text()).not.toContain("secret@example.com");
    }
  });
});

describe("reading applications", () => {
  it("answers the empty table with numbers, not nulls", async () => {
    const res = await call();
    expect(res.status).toBe(200);
    const body = await res.json<Body>();
    expect(body).toEqual({ total: 0, pending: 0, returned: 0, applications: [] });
  });

  it("returns the applicant's own submission", async () => {
    await apply("ava@example.com", "creator", "I want a feed for my reading");
    const body = await (await call()).json<Body>();
    expect(body.total).toBe(1);
    expect(body.pending).toBe(1);
    expect(body.applications[0]).toMatchObject({
      email: "ava@example.com",
      role: "creator",
      note: "I want a feed for my reading",
      admitted: false,
    });
    expect(body.applications[0].created_at).toBeTruthy();
  });

  // The one fact `POST /api/members` needs and the count cannot carry.
  it("marks an address that is already a member as admitted", async () => {
    await apply("in@example.com");
    await apply("out@example.com");
    await DB.prepare("INSERT INTO members (email, name, session_token) VALUES (?, ?, ?)")
      .bind("in@example.com", "In", "session-token")
      .run();
    const body = await (await call()).json<Body>();
    expect(body.total).toBe(2);
    expect(body.pending).toBe(1);
    const byEmail = Object.fromEntries(body.applications.map((a) => [a.email, a.admitted]));
    expect(byEmail).toEqual({ "in@example.com": true, "out@example.com": false });
  });

  it("returns newest first", async () => {
    await apply("old@example.com", "fan", "", "2026-09-01T00:00:00.000Z");
    await apply("new@example.com", "fan", "", "2026-09-10T00:00:00.000Z");
    const body = await (await call()).json<Body>();
    expect(body.applications.map((a) => a.email)).toEqual(["new@example.com", "old@example.com"]);
  });
});

describe("paging", () => {
  beforeEach(async () => {
    for (let i = 0; i < 5; i++) {
      await apply(`a${i}@example.com`, "fan", "", `2026-09-0${i + 1}T00:00:00.000Z`);
    }
  });

  // `limit` bounds the page and must never bound the headline: an owner who asks for two rows
  // still has to be told five people are waiting, or the field that matters reads as progress.
  it("limits the page without shrinking total or pending", async () => {
    const body = await (await call(undefined, ADMIN_KEY, "?limit=2")).json<Body>();
    expect(body.returned).toBe(2);
    expect(body.applications).toHaveLength(2);
    expect(body.total).toBe(5);
    expect(body.pending).toBe(5);
  });

  it("ignores a non-numeric, zero or negative limit rather than returning nothing", async () => {
    for (const q of ["?limit=abc", "?limit=0", "?limit=-3", "?limit="]) {
      const body = await (await call(undefined, ADMIN_KEY, q)).json<Body>();
      expect(body.returned, q).toBe(5);
    }
  });

  it("caps an oversized limit", async () => {
    const body = await (await call(undefined, ADMIN_KEY, "?limit=99999")).json<Body>();
    expect(body.returned).toBe(5);
  });
});

// End to end through the public route, because the two halves were written apart: a value this
// route reports is only true if it is the value `POST /waitlist` actually stored. A test that
// inserts its own rows would pass against a schema the live form never writes.
describe("through the route that creates them", () => {
  it("surfaces an application submitted at POST /waitlist", async () => {
    const ctx = createExecutionContext();
    const submitted = await worker.fetch(
      new Request("https://justtuned.com/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "https://justtuned.com" },
        body: JSON.stringify({ email: "Real@Example.com", role: "creator", note: "hello" }),
      }),
      { ...env, ADMIN_KEY } as never,
      ctx
    );
    await waitOnExecutionContext(ctx);
    expect(submitted.status).toBe(200);

    const body = await (await call()).json<Body>();
    expect(body.total).toBe(1);
    expect(body.pending).toBe(1);
    // /waitlist lowercases on insert and /api/members lowercases before matching, so the
    // address this route hands back is admissible as-is.
    expect(body.applications[0]).toMatchObject({
      email: "real@example.com",
      role: "creator",
      note: "hello",
      admitted: false,
    });
  });
});
