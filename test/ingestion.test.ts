// The half-hourly ingestion cron, exercised without waiting half an hour.
//
// Why this exists. `items_queued` sat at 42 from 2026-08-11 to 2026-08-13 after climbing
// from 27 the week before. Two explanations fit that flat line exactly as well — the member
// stopped playing music, or the sync stopped working — and nothing in the system could tell
// them apart, because the cron's only output was a console.log in Cloudflare's logs, which
// the operating loop holds no credentials to read.
//
// The counters under test are what separate those two futures. So they are worth more than
// the usual amount of scepticism: if `spotify_sync_ok` were written on a failed poll, or
// `cron_run` were skipped when credentials are missing, the loop would read a healthy
// pipeline off a dead one and go looking for demand problems that were never there.
//
// The syncer is injected. Real ingestion talks to accounts.spotify.com, and workerd has no
// network here — but the failure modes that matter (revoked token, rate limit, outage) are
// exactly the ones a live call would never reproduce on demand anyway.

import { env } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import { runIngestion, type Bindings } from "../src/index";
import { SpotifyError, type Connection } from "../src/spotify";
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
  for (const sql of statements) await DB.prepare(sql).run();
});

beforeEach(async () => {
  await DB.batch([
    DB.prepare("DELETE FROM metric_days"),
    DB.prepare("DELETE FROM connections"),
    DB.prepare("DELETE FROM items"),
    DB.prepare("DELETE FROM creators"),
    DB.prepare("DELETE FROM members"),
  ]);
});

/** Bindings as the cron sees them: DB plus whichever Spotify credentials exist. */
function bindings(credentials = true): Bindings {
  return {
    DB,
    ADMIN_KEY: "",
    METRICS_KEY: "",
    SPOTIFY_CLIENT_ID: credentials ? "test-client-id" : "",
    SPOTIFY_CLIENT_SECRET: credentials ? "test-client-secret" : "",
    // The cron never touches the operator plane; unset is the production state anyway.
    AGENT_OPERATOR_KEY: "",
    AGENT_OPERATOR_OWNER: "ava",
  };
}

async function addConnection(memberId: number): Promise<void> {
  await DB.prepare("INSERT INTO members (id, email, name, session_token) VALUES (?, ?, 'Member', ?)")
    .bind(memberId, `member${memberId}@example.test`, `session-${memberId}`)
    .run();
  await DB.prepare("INSERT INTO creators (handle, name, bio, accent, token, kind, member_id) VALUES (?, 'Feed', '', '#7c6cff', ?, 'human', ?)")
    .bind(`feed${memberId}`, `token-${memberId}`, memberId)
    .run();
  const feed = await DB.prepare("SELECT id FROM creators WHERE member_id = ?").bind(memberId).first<{ id: number }>();
  await DB.prepare(
    "INSERT INTO connections (member_id, creator_id, provider, access_token, refresh_token, expires_at) VALUES (?, ?, 'spotify', 'at', 'rt', ?)"
  )
    .bind(memberId, feed!.id, new Date(Date.now() + 3600_000).toISOString())
    .run();
}

/** Today's counters, as the metrics snapshot would report them. */
async function counters(): Promise<Record<string, number>> {
  const { results } = await DB.prepare("SELECT name, count FROM metric_days WHERE day = ?")
    .bind(utcDay())
    .all<{ name: string; count: number }>();
  return Object.fromEntries(results.map((r) => [r.name, r.count]));
}

const ok = (added: number) => async () => ({ added, newest: null });

describe("ingestion cron telemetry", () => {
  it("records a successful poll and how much attention it captured", async () => {
    await addConnection(1);
    await runIngestion(bindings(), ok(3));
    expect(await counters()).toEqual({ cron_run: 1, spotify_sync_ok: 1, spotify_items_captured: 3 });
  });

  it("separates a quiet connection from a broken one", async () => {
    await addConnection(1);
    await runIngestion(bindings(), ok(0));
    const c = await counters();
    // Polled fine, nothing new to capture: the flat queue is the member's, not the pipeline's.
    expect(c.spotify_sync_ok).toBe(1);
    expect(c.spotify_items_captured).toBeUndefined();
    expect(c.spotify_sync_error).toBeUndefined();
    expect(c.spotify_sync_auth_error).toBeUndefined();
  });

  it("counts the run even when there is nothing to sync", async () => {
    await runIngestion(bindings(), ok(1));
    // The cron fired; there are simply no connections. Distinguishable from a cron that
    // never fires, which is the failure this counter exists to make visible.
    expect(await counters()).toEqual({ cron_run: 1 });
  });

  it("flags a missing production credential instead of returning silently", async () => {
    await addConnection(1);
    let polled = false;
    await runIngestion(bindings(false), async () => {
      polled = true;
      return { added: 1, newest: null };
    });
    expect(await counters()).toEqual({ cron_run: 1, cron_no_credentials: 1 });
    expect(polled).toBe(false);
  });

  it("counts a revoked token as an auth failure and keeps going", async () => {
    await addConnection(1);
    await addConnection(2);
    let call = 0;
    await runIngestion(bindings(), async () => {
      call++;
      if (call === 1) throw new SpotifyError("spotify token 400: invalid_grant", 400, "token");
      return { added: 2, newest: null };
    });
    const c = await counters();
    expect(c.spotify_sync_auth_error).toBe(1);
    // One dead connection must not stop the others being polled.
    expect(c.spotify_sync_ok).toBe(1);
    expect(c.spotify_items_captured).toBe(2);
    expect(c.spotify_sync_error).toBeUndefined();
  });

  it("counts a transient outage separately from a revoked token", async () => {
    await addConnection(1);
    await runIngestion(bindings(), async () => {
      throw new SpotifyError("spotify recently-played 503", 503, "recently-played");
    });
    const c = await counters();
    expect(c.spotify_sync_error).toBe(1);
    expect(c.spotify_sync_auth_error).toBeUndefined();
  });

  it("counts an unexpected non-Spotify failure as transient, not as an owner action", async () => {
    await addConnection(1);
    await runIngestion(bindings(), async () => {
      throw new TypeError("network connection lost");
    });
    // Escalating an unknown error to "reconnect your account" would send the owner
    // to fix something that was never broken.
    expect((await counters()).spotify_sync_error).toBe(1);
  });
});

describe("SpotifyError classification", () => {
  it("treats a rate limit as a wait, not as lost consent", () => {
    expect(new SpotifyError("429", 429, "recently-played").isAuth).toBe(false);
    expect(new SpotifyError("503", 503, "token").isAuth).toBe(false);
    expect(new SpotifyError("401", 401, "recently-played").isAuth).toBe(true);
    expect(new SpotifyError("400", 400, "token").isAuth).toBe(true);
    expect(new SpotifyError("403", 403, "recently-played").isAuth).toBe(true);
  });
});
