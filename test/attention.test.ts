// Whether a star was ours.
//
// `attention_star` / `attention_skip` were the last two counters on this site with no
// discriminator of any kind. Every attention event the service has ever recorded is the
// owner triaging their own desk, and the *first star by a real member* — the single event
// this loop would report as activation — would have arrived under exactly the same name.
// Nobody doubts good news, so the discriminator has to exist before the news does.
//
// These run the real Worker against a real D1 in workerd, because the thing being checked
// is not that a helper computes a suffix — it is that a star taken through the actual
// route writes the actual names. Telemetry here is fire-and-forget and fail-quiet, so a
// wrong name records nothing and looks exactly like nobody starring anything.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";
import { snapshot, utcDay } from "../src/metrics";
import { ownerHandle, DEFAULT_OWNER_HANDLE } from "../src/handles";

const DB = env.DB as D1Database;
const OWNER_UA = "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/128 Safari/537.36";

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
    DB.prepare("DELETE FROM metric_days"),
    DB.prepare("DELETE FROM member_days"),
    DB.prepare("DELETE FROM reads"),
    DB.prepare("DELETE FROM items"),
    DB.prepare("DELETE FROM creators"),
    DB.prepare("DELETE FROM members"),
  ]);
});

/** A member with a live session token. */
async function member(email: string): Promise<{ id: number; token: string }> {
  const token = `session-${email}`;
  const row = await DB.prepare("INSERT INTO members (email, session_token) VALUES (?, ?) RETURNING id")
    .bind(email, token)
    .first<{ id: number }>();
  return { id: row!.id, token };
}

/** A human feed at `handle`, owned by `memberId`. This is what makes an owner resolvable. */
async function humanFeed(handle: string, memberId: number | null): Promise<number> {
  const row = await DB.prepare(
    "INSERT INTO creators (handle, name, token, kind, member_id) VALUES (?, ?, ?, 'human', ?) RETURNING id"
  )
    .bind(handle, handle, `token-${handle}`, memberId)
    .first<{ id: number }>();
  return row!.id;
}

async function item(creatorId: number): Promise<number> {
  const row = await DB.prepare(
    "INSERT INTO items (creator_id, url, title, domain) VALUES (?, ?, ?, ?) RETURNING id"
  )
    .bind(creatorId, `https://example.com/${crypto.randomUUID()}`, "A find", "example.com")
    .first<{ id: number }>();
  return row!.id;
}

async function read(
  itemId: number,
  token: string,
  action: "star" | "skip",
  ua = OWNER_UA,
  ownerVar = DEFAULT_OWNER_HANDLE
): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(
    new Request(`https://justtuned.com/read/${itemId}`, {
      method: "POST",
      headers: { cookie: `tuned_session=${token}`, "content-type": "application/json", "user-agent": ua },
      body: JSON.stringify({ action }),
    }),
    { ...env, AGENT_OPERATOR_OWNER: ownerVar } as never,
    ctx
  );
  await waitOnExecutionContext(ctx);
  return res;
}

async function counter(name: string): Promise<number | null> {
  const row = await DB.prepare("SELECT count FROM metric_days WHERE day = ? AND name = ?")
    .bind(utcDay(), name)
    .first<{ count: number }>();
  return row?.count ?? null;
}

describe("the owner axis on attention events", () => {
  it("labels the owner's own star, and leaves the site-wide name unchanged", async () => {
    const owner = await member("owner@justtuned.com");
    const feed = await humanFeed(DEFAULT_OWNER_HANDLE, owner.id);
    expect((await read(await item(feed), owner.token, "star")).status).toBe(200);

    // The axis is a subset, never a replacement: the unsuffixed name still counts it.
    expect(await counter("attention_star")).toBe(1);
    expect(await counter("attention_star_owner")).toBe(1);
    expect(await counter("attention_skip")).toBe(null);
    expect(await counter("attention_skip_owner")).toBe(null);
  });

  // The whole point of the change. This is the reading the loop exists to be able to make,
  // and before today it was not available on any name.
  it("does not label a second member's star, so the site-wide name diverges from the axis", async () => {
    const owner = await member("owner@justtuned.com");
    const feed = await humanFeed(DEFAULT_OWNER_HANDLE, owner.id);
    const stranger = await member("stranger@example.com");

    await read(await item(feed), owner.token, "star");
    await read(await item(feed), stranger.token, "star");

    expect(await counter("attention_star")).toBe(2);
    expect(await counter("attention_star_owner")).toBe(1);
  });

  it("labels a skip on its own name and not the star's", async () => {
    const owner = await member("owner@justtuned.com");
    const feed = await humanFeed(DEFAULT_OWNER_HANDLE, owner.id);
    await read(await item(feed), owner.token, "skip");

    expect(await counter("attention_skip")).toBe(1);
    expect(await counter("attention_skip_owner")).toBe(1);
    expect(await counter("attention_star")).toBe(null);
    expect(await counter("attention_star_owner")).toBe(null);
  });

  // The axis is deliberately *not* crossed with the user-agent split — it counts owner
  // events whatever the client claims to be, exactly as `_unattended` does on /enter.
  // A `_bot` variant of it would be a fourth name that nobody reads and that silently
  // drains the one that is read.
  it("carries the user-agent split, with the owner axis firing regardless of it", async () => {
    const owner = await member("owner@justtuned.com");
    const feed = await humanFeed(DEFAULT_OWNER_HANDLE, owner.id);
    await read(await item(feed), owner.token, "star", "curl/8.4.0");

    expect(await counter("attention_star_bot")).toBe(1);
    expect(await counter("attention_star")).toBe(null);
    expect(await counter("attention_star_owner")).toBe(1);
    expect(await counter("attention_star_owner_bot")).toBe(null);
  });

  // The failure mode that would make this instrument lie in the dangerous direction: with
  // no resolvable owner the axis is silent, and the owner's own stars read as a stranger's.
  // The route must still work — it classifies and never refuses — and the snapshot must say
  // so, which is what the next test checks.
  it("stays silent, and does not refuse the star, when the owner handle resolves to nothing", async () => {
    const owner = await member("owner@justtuned.com");
    const feed = await humanFeed("someone-else", owner.id);
    expect((await read(await item(feed), owner.token, "star")).status).toBe(200);

    expect(await counter("attention_star")).toBe(1);
    expect(await counter("attention_star_owner")).toBe(null);
  });

  it("resolves the owner from AGENT_OPERATOR_OWNER rather than a hardcoded handle", async () => {
    const owner = await member("owner@justtuned.com");
    const feed = await humanFeed("someone-else", owner.id);
    await read(await item(feed), owner.token, "star", OWNER_UA, "Someone-Else");

    expect(await counter("attention_star_owner")).toBe(1);
  });

  it("refuses an unauthenticated read and counts nothing", async () => {
    const owner = await member("owner@justtuned.com");
    const feed = await humanFeed(DEFAULT_OWNER_HANDLE, owner.id);
    expect((await read(await item(feed), "not-a-session", "star")).status).toBe(401);
    expect(await counter("attention_star")).toBe(null);
    expect(await counter("attention_star_owner")).toBe(null);
  });
});

describe("owner-scoped totals in the snapshot", () => {
  it("separates the owner's history from everyone else's, retroactively", async () => {
    // Written straight into `reads`, the way the existing 41 rows were — before either
    // daily counter existed. A counter cannot see these; the totals can, and that is the
    // reason this half is computed from the table rather than from metric_days.
    const owner = await member("owner@justtuned.com");
    await humanFeed(DEFAULT_OWNER_HANDLE, owner.id);
    const stranger = await member("stranger@example.com");
    const feedId = await DB.prepare("SELECT id FROM creators WHERE handle = ?")
      .bind(DEFAULT_OWNER_HANDLE)
      .first<{ id: number }>();

    for (const [who, action] of [
      [owner.id, "star"],
      [owner.id, "skip"],
      [owner.id, "skip"],
      [stranger.id, "star"],
    ] as const) {
      await DB.prepare("INSERT INTO reads (member_id, item_id, action) VALUES (?, ?, ?)")
        .bind(who, await item(feedId!.id), action)
        .run();
    }

    const snap = await snapshot(DB, ownerHandle(DEFAULT_OWNER_HANDLE));
    expect(snap.totals.owner_resolved).toBe(1);
    expect(snap.totals.stars).toBe(2);
    expect(snap.totals.stars_owner).toBe(1);
    expect(snap.totals.skips).toBe(2);
    expect(snap.totals.skips_owner).toBe(2);
  });

  // Absence must be legible as absence. A reader who cannot tell "no non-owner has acted"
  // from "we do not know who acted" would report the second as the first.
  it("reports owner_resolved 0 and omits the owner totals when the handle resolves to nothing", async () => {
    const owner = await member("owner@justtuned.com");
    await humanFeed("someone-else", owner.id);
    await DB.prepare("INSERT INTO reads (member_id, item_id, action) VALUES (?, ?, 'star')")
      .bind(owner.id, await item(await humanFeed("another", owner.id)))
      .run();

    const snap = await snapshot(DB, ownerHandle(DEFAULT_OWNER_HANDLE));
    expect(snap.totals.owner_resolved).toBe(0);
    expect(snap.totals.stars).toBe(1);
    expect(snap.totals.stars_owner).toBeUndefined();
    expect(snap.totals.skips_owner).toBeUndefined();
  });

  // A human feed with no member attached is not an owner. Falling back to *any* row for
  // that handle would attribute the whole site's attention to a member id of null.
  it("does not resolve an owner from a handle whose feed has no member", async () => {
    await humanFeed(DEFAULT_OWNER_HANDLE, null);
    const snap = await snapshot(DB, ownerHandle(undefined));
    expect(snap.totals.owner_resolved).toBe(0);
  });

  // The operator control plane has always scoped ownership to a *human* feed, and this
  // reads the same definition from the same function. An agent feed that happened to take
  // the owner's handle must not become the owner, or every star its supervising member
  // takes would be labelled first-party on a rule the operator would reject.
  it("does not resolve an owner from an agent feed at the owner handle", async () => {
    const owner = await member("owner@justtuned.com");
    await DB.prepare(
      "INSERT INTO creators (handle, name, token, kind, member_id) VALUES (?, ?, ?, 'agent', ?)"
    )
      .bind(DEFAULT_OWNER_HANDLE, "an agent", "token-agent", owner.id)
      .run();

    const snap = await snapshot(DB, ownerHandle(undefined));
    expect(snap.totals.owner_resolved).toBe(0);
  });

  it("documents every name it reports", async () => {
    await humanFeed(DEFAULT_OWNER_HANDLE, (await member("owner@justtuned.com")).id);
    const snap = await snapshot(DB, ownerHandle(undefined));
    for (const name of ["attention_star_owner", "attention_skip_owner", "stars_owner", "owner_resolved"]) {
      expect(snap.note).toContain(name);
    }
  });
});
