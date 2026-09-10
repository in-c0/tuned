#!/usr/bin/env node --test
// Proof that the executor watchdog would have caught the outage it was written for, and
// that it cannot pass by finding nothing.
//
// The centrepiece is `the 2026-09-08 outage`, which replays the real claims register: the
// last claim run 146 appended, then the seven firings that appended nothing. It asserts
// the watchdog is quiet through the first missed firing and red by the second, at the
// exact hours GitHub's cron would have run it. A watchdog whose threshold is asserted
// rather than exercised is a number in a comment.
//
// The rest is the fail-closed surface, one test per way the input can be empty or wrong.
// Each of these is a way a real check has silently passed in this repository before
// (L-61): the register branch gone, the file gone, the resource renamed, a corrupt line.

import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { describe, it } from "node:test";

import { CLOCK_SKEW_MS, DEFAULT_MAX_AGE_HOURS, evaluateLiveness } from "./executor-liveness.mjs";

const execFileAsync = promisify(execFile);
const CLI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "executor-liveness.mjs");
const HOUR = 3_600_000;
const MAX_AGE = DEFAULT_MAX_AGE_HOURS * HOUR;

const at = (iso) => Date.parse(iso);
const claimRecord = (iso, extra = {}) => ({
  v: 1,
  event: "claim",
  resource: "executor",
  cycle: "2026-09-10/w14",
  holder: "routine-run-147",
  nonce: "n-1",
  at: iso,
  ttlSeconds: 5400,
  ...extra,
});

const verdict = (records, nowIso, opts = {}) =>
  evaluateLiveness(records, { resource: "executor", now: at(nowIso), maxAgeMs: MAX_AGE, ...opts });

describe("the 2026-09-08 outage", () => {
  // Verbatim from `node scripts/run-claim.mjs status`: the last claim before the loop went
  // quiet. Seven firings followed — 09-07 22:00Z, 09-08 04:00/10:00/22:00Z,
  // 09-09 04:00/10:00/22:00Z — and appended nothing.
  const register = [
    claimRecord("2026-09-07T04:18:20.841Z", { holder: "vm:9358", cycle: "2026-09-07/w14" }),
    { v: 1, event: "release", resource: "executor", nonce: "n-1", at: "2026-09-07T04:29:33.292Z" },
    claimRecord("2026-09-07T10:05:18.987Z", { holder: "vm:2047", cycle: "2026-09-07/w20", nonce: "n-2" }),
    { v: 1, event: "release", resource: "executor", nonce: "n-2", at: "2026-09-07T10:27:17.485Z" },
  ];

  it("is quiet through the first missed firing", () => {
    // 09-07 22:00Z fired nothing. Every hourly check until the second miss is due sees a
    // gap no larger than one legitimately missed firing, and stays green: paging on a
    // single lost run would train the owner to ignore this alarm.
    for (let hour = 0; hour <= 5; hour++) {
      const now = new Date(at("2026-09-08T00:00:00Z") + hour * HOUR).toISOString();
      assert.equal(verdict(register, now).ok, true, `should be green at ${now}`);
    }
  });

  it("is red within three hours of the second missed firing", () => {
    // 09-08 04:00Z fired nothing either, and the gap is now longer than any cadence with
    // one miss in it can produce. This is the alarm that never happened.
    const v = verdict(register, "2026-09-08T07:00:00Z");
    assert.equal(v.ok, false);
    assert.equal(v.reason, "stale");
    assert.equal(v.newestAt, "2026-09-07T10:05:18.987Z");
    assert.equal(v.holder, "vm:2047");
    assert.ok(v.ageHours > 20, `age was ${v.ageHours}h`);
  });

  it("stays red for every hour of the outage, not just the first", () => {
    // 2026-09-08T07:00Z is the first red hour; the loop did not claim again until
    // 2026-09-10T04:10Z. Every hour in between must be red — an alarm that clears itself
    // while the fault persists is how a real outage gets read as a blip.
    const first = at("2026-09-08T07:00:00Z");
    const last = at("2026-09-10T04:00:00Z");
    for (let t = first; t <= last; t += HOUR) {
      const now = new Date(t).toISOString();
      assert.equal(verdict(register, now).ok, false, `should be red at ${now}`);
    }
  });

  it("recovers the moment a run claims again", () => {
    const recovered = [...register, claimRecord("2026-09-10T04:10:00.000Z")];
    const v = verdict(recovered, "2026-09-10T06:00:00Z");
    assert.equal(v.ok, true);
    assert.equal(v.holder, "routine-run-147");
    assert.equal(v.claimsLast48h, 1);
  });
});

describe("the threshold separates one missed firing from two", () => {
  // The cadence, as gaps rather than clock times, because the gap is what the threshold
  // is about: 04:00 -> 10:00 is 6h, 10:00 -> 22:00 is 12h, 22:00 -> 04:00 is 6h. Each
  // anchor below is a claim, and the walk is the hourly check after it.
  const anchors = [
    { claimed: "2026-09-10T04:05:00Z", onCadence: 6, oneMiss: 18, twoMiss: 24 },
    { claimed: "2026-09-10T10:05:00Z", onCadence: 12, oneMiss: 18, twoMiss: 24 },
    { claimed: "2026-09-10T22:05:00Z", onCadence: 6, oneMiss: 12, twoMiss: 24 },
  ];

  const ageAt = (claimed, hours) =>
    verdict([claimRecord(claimed)], new Date(at(claimed) + hours * HOUR).toISOString());

  it("never fires while the loop is on cadence, at any hour of the wait", () => {
    for (const { claimed, onCadence } of anchors) {
      for (let hour = 0; hour <= onCadence; hour++) {
        assert.equal(ageAt(claimed, hour).ok, true, `fired ${hour}h after ${claimed}`);
      }
    }
  });

  it("never fires on a single miss, at any hour before the next claim lands", () => {
    for (const { claimed, oneMiss } of anchors) {
      for (let hour = 0; hour <= oneMiss; hour++) {
        assert.equal(ageAt(claimed, hour).ok, true, `fired ${hour}h after ${claimed}`);
      }
    }
  });

  it("always fires on two consecutive misses, from every anchor", () => {
    for (const { claimed, oneMiss, twoMiss } of anchors) {
      // Red before the third firing would have been due, from every anchor. The window
      // between the longest one-miss gap and the two-miss gap is where the alarm has to
      // land, and it must land from all three — the bug in the first draft was an anchor
      // whose outage ended before any check looked at it.
      assert.equal(ageAt(claimed, twoMiss - 1).ok, false, `missed the outage after ${claimed}`);
      assert.ok(oneMiss < 20 && twoMiss > 20, `threshold does not separate ${claimed}`);
    }
  });
});

describe("it cannot pass by finding nothing", () => {
  it("fails on an empty register", () => {
    assert.deepEqual(
      [verdict([], "2026-09-10T06:00:00Z").ok, verdict([], "2026-09-10T06:00:00Z").reason],
      [false, "empty-register"],
    );
  });

  it("fails when the register holds only releases", () => {
    const releases = [{ v: 1, event: "release", resource: "executor", at: "2026-09-10T05:00:00Z" }];
    const v = verdict(releases, "2026-09-10T06:00:00Z");
    assert.equal(v.ok, false);
    assert.equal(v.reason, "no-claims");
  });

  it("fails when every claim belongs to some other resource", () => {
    // The shape of a rename: the loop starts claiming `executor-v2` and the watchdog,
    // still asked about `executor`, sweeps an empty set. That must be red, not green.
    const other = [claimRecord("2026-09-10T05:00:00Z", { resource: "something-else" })];
    const v = verdict(other, "2026-09-10T06:00:00Z");
    assert.equal(v.ok, false);
    assert.equal(v.reason, "no-claims");
  });

  it("fails on an unparseable claim timestamp rather than skipping the record", () => {
    const corrupt = [claimRecord("2026-09-10T05:00:00Z"), claimRecord("not-a-date")];
    const v = verdict(corrupt, "2026-09-10T06:00:00Z");
    assert.equal(v.ok, false);
    assert.equal(v.reason, "unparseable-timestamp");
    assert.equal(v.offender, "not-a-date");
  });

  it("fails on a claim from the future, which is a corrupt register and not a fresh run", () => {
    const v = verdict([claimRecord("2026-09-11T06:00:00Z")], "2026-09-10T06:00:00Z");
    assert.equal(v.ok, false);
    assert.equal(v.reason, "future-timestamp");
  });

  it("tolerates skew smaller than the allowance", () => {
    const slightlyAhead = new Date(at("2026-09-10T06:00:00Z") + CLOCK_SKEW_MS - 1000).toISOString();
    assert.equal(verdict([claimRecord(slightlyAhead)], "2026-09-10T06:00:00Z").ok, true);
  });

  it("reads the newest claim, not the last line written", () => {
    // Appends are chronological today, but the register is append-only from more than one
    // holder and nothing in it enforces ordering. Sorting is what makes that safe.
    const outOfOrder = [claimRecord("2026-09-10T05:00:00Z"), claimRecord("2026-09-08T05:00:00Z")];
    const v = verdict(outOfOrder, "2026-09-10T06:00:00Z");
    assert.equal(v.ok, true);
    assert.equal(v.newestAt, "2026-09-10T05:00:00Z");
  });
});

describe("the CLI", () => {
  it("exits non-zero and annotates when the register branch is missing", async () => {
    // A scratch directory with no `origin` at all: `fetchTip` finds nothing, which is the
    // no-register-branch path. The point is the exit code — a watchdog that exits 0 when
    // it cannot read its input is worse than no watchdog.
    const err = await execFileAsync(process.execPath, [CLI, "--remote", "no-such-remote"], {
      cwd: path.dirname(CLI),
    }).catch((e) => e);
    assert.notEqual(err.code, 0, "expected a non-zero exit");
    assert.match(err.stdout, /STALE/);
    assert.match(err.stdout, /::error title=Executor loop is not firing::/);
  });

  it("reports the live loop against the real register", async () => {
    // Run 147's own claim is in `origin/ops-claims` by the time this runs in CI, so this
    // is the end-to-end read: real remote, real branch, real parser, real verdict.
    const { stdout } = await execFileAsync(process.execPath, [CLI, "--json"], {
      cwd: path.dirname(CLI),
    });
    const v = JSON.parse(stdout);
    assert.equal(v.resource, "executor");
    assert.ok(v.claims > 0, "expected at least one claim in the real register");
    assert.ok(v.newestAt, "expected a newest claim timestamp");
  });
});
