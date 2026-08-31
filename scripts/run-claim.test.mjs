#!/usr/bin/env node --test
// Proof that the executor run lock is mutual exclusion and not a convention.
//
// This suite runs under `node --test`, not vitest. `npm test` executes inside workerd,
// where `node:child_process` does not exist — and the entire mechanism under test IS git
// subprocesses against a remote. So it lives next to scripts/validate-nominations.mjs, is
// wired into check.yml as its own step, and uses a throwaway bare repository as the remote
// so nothing here can touch `origin`.
//
// The load-bearing test is `two contenders that both read the same tip`. It does not race
// and hope: it forces the exact interleaving the guard exists to survive — both contenders
// read the register, both conclude the lock is free, and only then does either push. A
// test that spawned two processes and hoped they collided would pass on a machine where
// they never did.

import assert from "node:assert/strict";
import { execFile, execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { after, describe, it } from "node:test";

import {
  CLAIM_REF,
  EXIT_LOST,
  claim,
  defaultCycle,
  evaluate,
  parseRegister,
  prepare,
  publish,
  readRegisterRaw,
  release,
  fetchTip,
} from "./lib/run-claim.mjs";

const execFileAsync = promisify(execFile);
const CLI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "run-claim.mjs");
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "tuned-run-claim-"));

after(() => fs.rmSync(scratch, { recursive: true, force: true }));

let arenaCount = 0;
/** A bare remote plus N independent contender repositories. */
function arena(contenders = 2) {
  const root = fs.mkdtempSync(path.join(scratch, `arena-${arenaCount++}-`));
  const remote = path.join(root, "remote.git");
  execFileSync("git", ["init", "-q", "--bare", "-b", "main", remote]);
  const repos = [];
  for (let i = 0; i < contenders; i++) {
    const dir = path.join(root, `c${i}`);
    fs.mkdirSync(dir);
    execFileSync("git", ["init", "-q", "-b", "main"], { cwd: dir });
    repos.push(dir);
  }
  return { remote, repos };
}

/** Every commit on the register branch, newest first. */
function history(remote) {
  const out = execFileSync("git", ["log", "--format=%H %P", CLAIM_REF], {
    cwd: remote,
    encoding: "utf8",
  });
  return out.trim().split("\n").filter(Boolean);
}

function registerOf(cwd, remote) {
  return parseRegister(readRegisterRaw(cwd, fetchTip(cwd, remote)));
}

const CYCLE = "2026-08-31/w20";
const base = (holder) => ({ resource: "executor", cycle: CYCLE, holder });

describe("cycle labelling", () => {
  it("buckets a firing into the Sydney window it belongs to", () => {
    // 2026-08-31 20:00 Sydney == 10:00 UTC (AEST, UTC+10).
    assert.equal(defaultCycle(Date.parse("2026-08-31T10:00:00Z")), "2026-08-31/w20");
    assert.equal(defaultCycle(Date.parse("2026-08-31T12:30:00Z")), "2026-08-31/w20");
    // 08:00 and 14:00 Sydney.
    assert.equal(defaultCycle(Date.parse("2026-08-30T22:05:00Z")), "2026-08-31/w08");
    assert.equal(defaultCycle(Date.parse("2026-08-31T04:05:00Z")), "2026-08-31/w14");
    // Before the first window of the day: still inside the previous day's 20:00 window.
    assert.equal(defaultCycle(Date.parse("2026-08-30T20:00:00Z")), "2026-08-30/w20");
  });

  it("files a run fired minutes early into the window it is firing for", () => {
    // 19:52 Sydney, eight minutes ahead of the 20:00 firing.
    assert.equal(defaultCycle(Date.parse("2026-08-31T09:52:00Z")), "2026-08-31/w20");
  });
});

describe("two contenders", () => {
  it("both read the same tip, exactly one lands, the loser mutates nothing", () => {
    const { remote, repos: [a, b] } = arena();
    const now = Date.parse("2026-08-31T10:00:00Z");

    // The race window, forced open. Neither has pushed; both see an empty register.
    const pa = prepare(a, remote, { ...base("session-A"), now });
    const pb = prepare(b, remote, { ...base("session-B"), now });
    assert.equal(pa.tip, null);
    assert.equal(pb.tip, null);
    assert.equal(pa.decision.ok, true, "A believes the lock is free");
    assert.equal(pb.decision.ok, true, "B believes the lock is free — this is the danger");
    assert.notEqual(pa.commit, pb.commit, "distinct nonces must yield distinct commits");

    // Now they both push. The remote decides.
    assert.equal(publish(a, remote, pa.commit), true, "A's ref creation lands");
    assert.equal(publish(b, remote, pb.commit), false, "B is rejected by the remote");

    // The loser's commit object exists only in its own repository and is unreachable
    // from the remote: nothing was mutated.
    const register = registerOf(a, remote);
    assert.equal(register.length, 1);
    assert.equal(register[0].holder, "session-A");
    assert.equal(history(remote).length, 1);

    // And when B resolves the loss through the ordinary entry point, it loses cleanly.
    const loss = claim(b, remote, { ...base("session-B"), now });
    assert.equal(loss.won, false);
    assert.equal(loss.reason, "lease-held");
    assert.equal(loss.holder.holder, "session-A");
    assert.equal(loss.record, null);
    assert.equal(registerOf(a, remote).length, 1, "a lost claim appends nothing");
  });

  it("excludes across cycle labels — a lease held is a lease held", () => {
    const { remote, repos: [a, b] } = arena();
    const now = Date.parse("2026-08-31T10:00:00Z");
    assert.equal(claim(a, remote, { ...base("session-A"), now }).won, true);
    // B thinks it is in a different window (the boundary case defaultCycle can produce).
    const loss = claim(b, remote, {
      resource: "executor",
      cycle: "2026-08-31/w14",
      holder: "session-B",
      now,
    });
    assert.equal(loss.won, false);
    assert.equal(loss.reason, "lease-held");
  });

  it("does not exclude a different resource", () => {
    const { remote, repos: [a, b] } = arena();
    const now = Date.parse("2026-08-31T10:00:00Z");
    assert.equal(claim(a, remote, { ...base("session-A"), now }).won, true);
    const other = claim(b, remote, {
      resource: "metrics-snapshot",
      cycle: CYCLE,
      holder: "session-B",
      now,
    });
    assert.equal(other.won, true);
    assert.equal(registerOf(a, remote).length, 2);
  });
});

describe("eight contenders, real processes", () => {
  it("produces exactly one winner and seven clean losers", async () => {
    const { remote, repos } = arena(8);
    const results = await Promise.all(
      repos.map(async (repo, i) => {
        try {
          await execFileAsync(process.execPath, [
            CLI, "claim",
            "--repo", repo,
            "--remote", remote,
            "--cycle", CYCLE,
            "--holder", `session-${i}`,
          ]);
          return { code: 0 };
        } catch (err) {
          return { code: err.code, stdout: err.stdout, stderr: err.stderr };
        }
      }),
    );

    const winners = results.filter((r) => r.code === 0);
    const losers = results.filter((r) => r.code === EXIT_LOST);
    assert.equal(winners.length, 1, `expected one winner, got ${winners.length}`);
    assert.equal(losers.length, 7, `expected seven losers, got ${losers.length}`);
    // A loser exits cleanly: the documented code, and nothing on stderr.
    for (const loser of losers) assert.equal((loser.stderr ?? "").trim(), "");

    const register = registerOf(repos[0], remote);
    assert.equal(register.length, 1, "seven losers appended nothing");
    assert.equal(register[0].event, "claim");
  });
});

describe("a completed cycle is never re-entered", () => {
  it("refuses a second run of a cycle that was claimed and released", () => {
    const { remote, repos: [a, b] } = arena();
    const now = Date.parse("2026-08-31T10:00:00Z");
    const won = claim(a, remote, { ...base("session-A"), now });
    assert.equal(won.won, true);
    assert.equal(
      release(a, remote, { ...base("session-A"), nonce: won.record.nonce, outcome: "completed", now })
        .won,
      true,
    );

    // This is run 123's duplicate: a second session arriving after the first finished.
    const second = claim(b, remote, { ...base("session-B"), now: now + 60_000 });
    assert.equal(second.won, false);
    assert.equal(second.reason, "cycle-complete");
    assert.equal(second.holder.holder, "session-A");

    // The next window is open, though — releasing frees the lock, it does not close it.
    const next = claim(b, remote, {
      resource: "executor",
      cycle: "2026-09-01/w08",
      holder: "session-B",
      now: now + 60_000,
    });
    assert.equal(next.won, true);
  });
});

describe("stale recovery", () => {
  it("takes over an expired claim by appending, never by rewriting", () => {
    const { remote, repos: [a, b] } = arena();
    const now = Date.parse("2026-08-31T10:00:00Z");
    const crashed = claim(a, remote, { ...base("session-A"), ttlSeconds: 60, now });
    assert.equal(crashed.won, true);

    // Still inside the lease: nobody may take it.
    assert.equal(claim(b, remote, { ...base("session-B"), now: now + 30_000 }).reason, "lease-held");

    // Past the lease, with no release on record — a crashed session, not a running one.
    const takeover = claim(b, remote, { ...base("session-B"), now: now + 120_000 });
    assert.equal(takeover.won, true);
    assert.equal(takeover.reason, "takeover-stale");
    assert.equal(takeover.record.supersedes, crashed.record.nonce);

    // Recovery left the prior record in place and added a commit on top of it: no
    // deletion, no force, no history rewritten.
    const log = history(remote);
    assert.equal(log.length, 2);
    assert.equal(log[0].split(" ")[1], log[1].split(" ")[0], "the takeover's parent is the claim");
    assert.equal(registerOf(a, remote).length, 2);
  });

  it("a superseded holder cannot silently re-hold the lock", () => {
    const { remote, repos: [a, b] } = arena();
    const now = Date.parse("2026-08-31T10:00:00Z");
    claim(a, remote, { ...base("session-A"), ttlSeconds: 60, now });
    const takeover = claim(b, remote, { ...base("session-B"), now: now + 120_000 });
    assert.equal(takeover.won, true);
    // The revived original now sees a live lease it does not hold.
    const revived = claim(a, remote, { ...base("session-A"), now: now + 130_000 });
    assert.equal(revived.won, false);
    assert.equal(revived.reason, "lease-held");
    assert.equal(revived.holder.holder, "session-B");
  });
});

describe("fails closed", () => {
  it("refuses to read a register it cannot parse rather than assuming it is empty", () => {
    assert.throws(() => parseRegister('{"v":1}\nnot json\n'), /line 2 is not valid JSON/);
  });

  it("treats a claim with a missing ttl as the default lease, not as unbounded", () => {
    const now = Date.parse("2026-08-31T10:00:00Z");
    const legacy = [
      { v: 1, event: "claim", resource: "executor", cycle: CYCLE, holder: "old", nonce: "n1", at: new Date(now).toISOString() },
    ];
    assert.equal(evaluate(legacy, { resource: "executor", cycle: CYCLE, now: now + 60_000 }).reason, "lease-held");
    assert.equal(
      evaluate(legacy, { resource: "executor", cycle: CYCLE, now: now + 5_401_000 }).reason,
      "takeover-stale",
    );
  });
});
