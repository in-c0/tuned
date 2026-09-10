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

import {
  CLOCK_SKEW_MS,
  DEFAULT_GAP_LOOKBACK_HOURS,
  DEFAULT_MAX_AGE_HOURS,
  DEFAULT_MAX_GAP_HOURS,
  GAP_WATCH_FROM,
  evaluateLiveness,
} from "./executor-liveness.mjs";

const execFileAsync = promisify(execFile);
const CLI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "executor-liveness.mjs");
const HOUR = 3_600_000;
const MAX_AGE = DEFAULT_MAX_AGE_HOURS * HOUR;
const MAX_GAP = DEFAULT_MAX_GAP_HOURS * HOUR;

// Delivery lag measured from this repository's own Actions history — the 30 most recent
// scheduled `metrics snapshot` runs, `run_started_at` minus the cron instant. The window
// since 2026-08-26 is what the thresholds are sized against; the eight firings before it
// are here because the change of regime is the reason run 147 could size this at "~2h" and
// be wrong without being careless.
const MEASURED_LAG_HOURS = {
  before: { min: 0.22, median: 0.29, max: 0.36 },
  since: { min: 1.56, median: 2.14, max: 4.48 },
};

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
  evaluateLiveness(records, {
    resource: "executor",
    now: at(nowIso),
    maxAgeMs: MAX_AGE,
    maxGapMs: MAX_GAP,
    // Most of this suite predates the watch-from floor and asserts about registers built
    // from scratch, so the default floor would silence the gap verdict everywhere. Tests
    // that care about the floor set it explicitly.
    gapWatchFromMs: 0,
    ...opts,
  });

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

  it("is red before the second missed firing would have been due", () => {
    // 09-08 04:00Z fired nothing either, and by 10:00Z the silence is longer than any
    // cadence with one miss in it can produce plus any lag ever measured here. This is the
    // alarm that never happened.
    //
    // Run 147 asserted this hour at 07:00Z, on a 20h threshold. Raising it to 23h to
    // absorb the measured delivery lag costs exactly those two hours, and the cost is
    // stated rather than buried: the alarm lands at 09:05Z instead of 07:00Z, still 43
    // hours before a run happened to look. That is what the false-alarm fix is bought with.
    const v = verdict(register, "2026-09-08T10:00:00Z");
    assert.equal(v.ok, false);
    assert.equal(v.reason, "stale");
    assert.equal(v.newestAt, "2026-09-07T10:05:18.987Z");
    assert.equal(v.holder, "vm:2047");
    assert.equal(v.alarmKey, "2026-09-07T10:05:18.987Z");
    assert.ok(v.ageHours > 23, `age was ${v.ageHours}h`);
  });

  it("stays red for every hour of the outage, not just the first", () => {
    // 2026-09-08T10:00Z is comfortably inside the red; the loop did not claim again until
    // 2026-09-10T04:10Z. Every hour in between must be red — an alarm that clears itself
    // while the fault persists is how a real outage gets read as a blip.
    const first = at("2026-09-08T10:00:00Z");
    const last = at("2026-09-10T04:00:00Z");
    for (let t = first; t <= last; t += HOUR) {
      const now = new Date(t).toISOString();
      assert.equal(verdict(register, now).ok, false, `should be red at ${now}`);
    }
  });

  it("still reports the outage after the loop has recovered", () => {
    // The wall-clock half goes quiet the moment a run claims again, and run 147's version
    // went green here. That is the failure this suite could not previously express: a
    // sampler delivered late enough, or dropped often enough, could sleep through the
    // entire outage and find a healthy age on the far side of it, and the seven lost runs
    // would be nobody's finding. The gap stays in the register, so this verdict does not
    // depend on having looked while it was open.
    const recovered = [...register, claimRecord("2026-09-10T04:10:00.000Z")];
    const v = verdict(recovered, "2026-09-10T06:00:00Z");
    assert.equal(v.ok, false);
    assert.equal(v.reason, "missed-runs");
    assert.ok(v.ageHours < 23, "the wall-clock half is green here, which is the point");
    assert.equal(v.gap.from, "2026-09-07T10:05:18.987Z");
    assert.equal(v.gap.to, "2026-09-10T04:10:00.000Z");
    assert.equal(v.gap.gapHours, 66.08);
  });

  it("keys the alarm on the gap's start, so recovery does not re-raise it", () => {
    // The dedupe marker is built from `alarmKey`. For a completed outage the newest claim
    // keeps moving as the loop runs on, so keying on it would post a fresh comment about
    // the same seven lost runs at every check until the lookback expired.
    const recovered = [...register, claimRecord("2026-09-10T04:10:00.000Z")];
    const later = [...recovered, claimRecord("2026-09-10T10:04:00.000Z")];
    assert.equal(verdict(recovered, "2026-09-10T06:00:00Z").alarmKey, "2026-09-07T10:05:18.987Z");
    assert.equal(verdict(later, "2026-09-10T12:00:00Z").alarmKey, "2026-09-07T10:05:18.987Z");
  });

  it("goes quiet once the outage is older than the lookback", () => {
    // A gap never leaves an append-only register. Without this, the first outage would
    // redden the check for the rest of the project and the alarm would mean nothing.
    //
    // The loop has to be running normally for the gap to age out, so the fixture is a
    // chain of on-cadence claims rather than one distant claim — a single jump forward
    // would just be a second outage, which is what the first draft of this test asserted
    // was quiet. Nothing is proved by aging out a gap you replaced with a bigger one.
    //
    // The hours below are LITERAL, and that is the point of them. The first draft derived
    // its horizon from DEFAULT_GAP_LOOKBACK_HOURS, so raising the constant to eleven years
    // simply built a longer chain of claims and the test still passed — it pinned the
    // constant against itself and asserted nothing. A test that moves with the value it is
    // meant to hold down is not a test. Only a fixed 40h/50h bracket can fail.
    const recovery = at("2026-09-10T04:10:00.000Z");
    // Built up to `now` and no further: a claim dated after the check is a corrupt register
    // and fail-closes on `future-timestamp`, which is the right answer to the wrong
    // question. The first version of this fixture ran the chain past both reading points
    // and got exactly that.
    const runningUntil = (hours) => {
      const chain = [...register, claimRecord("2026-09-10T04:10:00.000Z")];
      for (let h = 6; h <= hours; h += 6) {
        chain.push(claimRecord(new Date(recovery + h * HOUR).toISOString(), { nonce: `n-${h}` }));
      }
      return verdict(chain, new Date(recovery + hours * HOUR).toISOString());
    };

    const inside = runningUntil(40);
    assert.equal(inside.reason, "missed-runs", "40h after recovery is inside the 48h lookback");

    const outside = runningUntil(50);
    assert.equal(outside.ok, true, "50h after recovery the outage is history, not an alarm");
    assert.equal(outside.gap, null);
  });

  it("reports the open outage, not the closed one, when the register holds both", () => {
    // Precedence, and it is not cosmetic: `stale` means the NEXT scheduled run is going to
    // be lost too, so it is the verdict the owner has to act on. A register can hold a
    // healed gap and a fresh silence at the same time, and reporting the healed one would
    // put a resolved incident in the alarm while the live one went unnamed.
    const healed = [
      claimRecord("2026-09-11T22:05:00Z"),
      claimRecord("2026-09-12T22:05:00Z", { nonce: "n-9" }), // 24h gap, closed
    ];
    const v = verdict(healed, "2026-09-13T23:05:00Z"); // and 25h of silence since
    assert.equal(v.reason, "stale");
    assert.equal(v.alarmKey, "2026-09-12T22:05:00Z");
    assert.ok(v.gap, "the closed gap is still reported in the payload, just not as the verdict");
    assert.equal(v.gap.gapHours, 24);
  });

  it("does not re-raise the outage that predates the watchdog, under the real floor", () => {
    // Shipped default, not the suite's 0: GAP_WATCH_FROM is run 147's own claim, the first
    // appended while this file existed. The 66h gap before it is on issue #1 already and is
    // not news. Asserted against the constant the workflow actually runs with, because a
    // floor that is only correct in the test is not a floor.
    const recovered = [...register, claimRecord(GAP_WATCH_FROM)];
    const v = verdict(recovered, "2026-09-10T06:00:00Z", {
      gapWatchFromMs: at(GAP_WATCH_FROM),
    });
    assert.equal(v.ok, true);
    assert.equal(v.gap, null);
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
      assert.equal(ageAt(claimed, twoMiss - 0.5).ok, false, `missed the outage after ${claimed}`);
      assert.ok(
        oneMiss < DEFAULT_MAX_AGE_HOURS && twoMiss > DEFAULT_MAX_AGE_HOURS,
        `threshold does not separate ${claimed}`,
      );
    }
  });
});

describe("the check is delivered late, and the age it reads is inflated by exactly that", () => {
  // THE BLIND SPOT THIS BLOCK EXISTS TO CLOSE. Every walk above steps `now` forward from a
  // claim in whole hours, which silently models a check that runs at the instant it is
  // scheduled. This repository's scheduled runs have not done that since 2026-08-26. Run
  // 147 wrote the possibility down, sized it at "~2h" from assumption, called it an
  // acceptable residual — and the repository's own Actions history already held 21 firings
  // saying the median was 2.14h and the worst 4.48h. The lesson is not that the number was
  // wrong; it is that the number was available and was reasoned about instead of read.

  const claimed = "2026-09-10T10:05:00Z";
  const lagged = (trueGapHours, lagHours) =>
    verdict(
      [claimRecord(claimed)],
      new Date(at(claimed) + (trueGapHours + lagHours) * HOUR).toISOString(),
    );

  it("does not page the owner over a single missed firing at any measured lag", () => {
    // The regression run 148 shipped to fix. One miss is an 18h gap at the worst anchor; at
    // the old 20h threshold, any lag over 2h turned that into an alarm — so at the measured
    // median this watchdog would have paged on one lost run, which is a blip, and taught
    // the owner to close the tab.
    for (const lag of Object.values(MEASURED_LAG_HOURS).flatMap((r) => [r.min, r.median, r.max])) {
      const v = lagged(18, lag);
      assert.equal(v.ok, true, `false alarm at ${lag}h lag (age read ${v.ageHours}h)`);
    }
  });

  it("would have raised that false alarm at the threshold it replaces", () => {
    // Stated as a test rather than as a claim in a commit message: the fix is load bearing,
    // not tidying. At the median lag the old threshold is already breached by one miss.
    const v = evaluateLiveness([claimRecord(claimed)], {
      resource: "executor",
      now: at(claimed) + (18 + MEASURED_LAG_HOURS.since.median) * HOUR,
      maxAgeMs: 20 * HOUR,
      maxGapMs: MAX_GAP,
      gapWatchFromMs: 0,
    });
    assert.equal(v.ok, false);
    assert.equal(v.reason, "stale");
  });

  it("still catches two missed firings before recovery, at every measured lag", () => {
    // The other side of the same trade. A late check reads a LARGER age, so lag only ever
    // helps this direction; the assertion is that raising the threshold to 23h did not
    // close the window. True age 23.5h, still short of the 24h at which the loop recovers.
    for (const lag of Object.values(MEASURED_LAG_HOURS).flatMap((r) => [r.min, r.median, r.max])) {
      assert.equal(lagged(23.5, lag).ok, false, `slept through the outage at ${lag}h lag`);
    }
  });

  it("finds the outage even when every check inside it was dropped", () => {
    // The failure no threshold can fix, and the reason `missed-runs` reads the register
    // instead of the clock: suppose the hourly check is not merely late but delivered once
    // on either side of a 24h outage. The wall-clock half sees 6h and 4h and is green both
    // times; the gap between the two claims is 24h and is still there to be read.
    const register = [
      claimRecord("2026-09-11T22:05:00Z"),
      claimRecord("2026-09-12T22:05:00Z", { nonce: "n-9" }),
    ];
    const before = verdict([register[0]], "2026-09-12T04:05:00Z");
    const after = verdict(register, "2026-09-13T02:05:00Z");
    assert.equal(before.ok, true, "the wall-clock half is green before the outage matures");
    assert.equal(after.reason, "missed-runs");
    assert.equal(after.gap.gapHours, 24);
  });

  it("reads the same gap whenever the check happens to arrive", () => {
    // The property that makes the gap verdict worth having: identical verdict on time,
    // four and a half hours late, and a full day late. Nothing about it moves with `now`.
    const register = [
      claimRecord("2026-09-11T22:05:00Z"),
      claimRecord("2026-09-12T22:05:00Z", { nonce: "n-9" }),
    ];
    const readings = ["2026-09-12T22:40:00Z", "2026-09-13T03:10:00Z", "2026-09-13T22:40:00Z"].map(
      (now) => verdict(register, now).gap.gapHours,
    );
    assert.deepEqual(readings, [24, 24, 24]);
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
    const outOfOrder = [claimRecord("2026-09-10T05:00:00Z"), claimRecord("2026-09-09T23:00:00Z")];
    const v = verdict(outOfOrder, "2026-09-10T06:00:00Z");
    assert.equal(v.ok, true);
    assert.equal(v.newestAt, "2026-09-10T05:00:00Z");
  });

  it("measures the gap in claim order, not in write order", () => {
    // Sorting became load bearing twice over when the gap verdict arrived: read in written
    // order these two claims are 22h apart backwards, and a signed subtraction on the
    // written order would report a negative gap and pass. The first draft of the test
    // above accidentally proved this — its two fixture claims were 48h apart, so it went
    // red the moment `missed-runs` existed, on a register it only ever meant to be
    // shuffled. The fixture was wrong; the verdict was right.
    const outOfOrder = [claimRecord("2026-09-12T22:05:00Z"), claimRecord("2026-09-11T22:05:00Z")];
    const v = verdict(outOfOrder, "2026-09-12T23:00:00Z");
    assert.equal(v.reason, "missed-runs");
    assert.equal(v.gap.from, "2026-09-11T22:05:00Z");
    assert.equal(v.gap.to, "2026-09-12T22:05:00Z");
    assert.equal(v.gap.gapHours, 24);
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
