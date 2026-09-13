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

  it("reads the real register end to end, whatever the verdict is", async () => {
    // Run 147's own claim is in `origin/ops-claims` by the time this runs in CI, so this
    // is the end-to-end read: real remote, real branch, real parser, real verdict.
    //
    // IT MUST NOT REQUIRE A ZERO EXIT, and requiring one was a defect of its own. The CLI
    // exits 1 on every not-`ok` verdict, so as written this test went red exactly when the
    // watchdog was doing its job — it failed for real on 2026-09-13 against the unclaimed
    // gap runs 155 and 156 left, reporting a broken test rather than the finding. What is
    // under test here is the read path, not the state of the loop on the day it runs.
    const out = await execFileAsync(process.execPath, [CLI, "--json"], {
      cwd: path.dirname(CLI),
    }).catch((e) => e);
    const v = JSON.parse(out.stdout);
    assert.equal(v.resource, "executor");
    assert.ok(v.claims > 0, "expected at least one claim in the real register");
    assert.ok(v.newestAt, "expected a newest claim timestamp");
    assert.equal(typeof v.ok, "boolean");
  });
});

// The second source, and the property that it cannot be used to quieten the alarm.
//
// `missed-runs` named two different facts until 2026-09-13: no session ran, and a session
// ran without claiming. Runs 155 and 156 produced the second — eight commits and two
// execution reports inside a 24.02h register gap — and the alarm was an hour from telling
// the owner "24.02h with no run at all" and "check that the routine is enabled and firing",
// both false, with the true half ("no executor session reached step 0") buried below them.
describe("a silent register: the loop was down, or the loop skipped step 0", () => {
  const DOWN = { commits: 0, sessions: [], first: null, last: null };
  const RAN = {
    commits: 8,
    sessions: ["session_01Cm6ueFYFEwUtGrEJTb9Nij", "session_017MjvFBkjJAcLjJ5Sk4u1gh"],
    first: "2026-09-12T22:17:23Z",
    last: "2026-09-13T04:14:34Z",
  };
  // The real shape: run 154's claim, then 24.02h of nothing, then run 157's.
  const register = [
    claimRecord("2026-09-12T10:05:31.690Z", { holder: "vm:2036", cycle: "2026-09-12/w20" }),
    claimRecord("2026-09-13T10:06:54.314Z", { holder: "vm:2079", cycle: "2026-09-13/w20", nonce: "n-2" }),
  ];
  const now = "2026-09-13T10:35:00Z";

  it("says `missed-runs` when nothing committed in the gap either", () => {
    const v = verdict(register, now, { activityIn: () => DOWN });
    assert.equal(v.ok, false);
    assert.equal(v.reason, "missed-runs");
    assert.equal(v.activity, null);
  });

  it("says `unclaimed-runs` when sessions committed inside the gap", () => {
    const v = verdict(register, now, { activityIn: () => RAN });
    assert.equal(v.ok, false);
    assert.equal(v.reason, "unclaimed-runs");
    assert.equal(v.activity.commits, 8);
    assert.equal(v.activity.sessions.length, 2);
    // Same outage, same key: the owner gets one comment about this gap either way.
    assert.equal(v.alarmKey, "2026-09-12T10:05:31.690Z");
  });

  it("asks about the gap's own interval, not about all of history", () => {
    const asked = [];
    verdict(register, now, {
      activityIn: (from, to) => {
        asked.push([new Date(from).toISOString(), new Date(to).toISOString()]);
        return DOWN;
      },
    });
    assert.deepEqual(asked, [["2026-09-12T10:05:31.690Z", "2026-09-13T10:06:54.314Z"]]);
  });

  it("asks from where the lock was RELEASED, so the claiming run's own commits are not counted", () => {
    // Measured against the real register this was worth one whole session: run 154 claimed
    // at 10:05:31 and committed at 10:07–10:28, inside `[claim, next claim)`, so the first
    // version of this check reported "3 sessions ran anyway" when only two had skipped
    // step 0. A number in an alarm that overstates by 50% is the alarm's defect.
    const released = [
      register[0],
      {
        v: 1,
        event: "release",
        resource: "executor",
        nonce: register[0].nonce,
        at: "2026-09-12T10:33:04.194Z",
      },
      register[1],
    ];
    const asked = [];
    verdict(released, now, {
      activityIn: (from, to) => {
        asked.push([new Date(from).toISOString(), new Date(to).toISOString()]);
        return DOWN;
      },
    });
    assert.deepEqual(asked, [["2026-09-12T10:33:04.194Z", "2026-09-13T10:06:54.314Z"]]);
  });

  it("falls back to the claim when the lock was never released", () => {
    // An abandoned lease appends no release. Reverting to the claim is the conservative
    // direction: it widens the window, so it can over-report activity and can never miss it.
    const asked = [];
    verdict(register, now, {
      activityIn: (from) => {
        asked.push(new Date(from).toISOString());
        return DOWN;
      },
    });
    assert.deepEqual(asked, ["2026-09-12T10:05:31.690Z"]);
  });

  it("marks the fail-closed verdicts as never having asked the second source", () => {
    // `unclaimed=false` does not mean "asked and found nothing" — on these paths there is
    // no interval to ask about and nothing was asked. The alarm branches on the difference,
    // so a verdict that cannot tell them apart would put a claim in the comment that this
    // check never made. Every fail-closed shape, one per way the register can be unusable.
    const asked = (v) => Object.prototype.hasOwnProperty.call(v, "activity");
    const never = () => {
      throw new Error("the second source must not be consulted here");
    };
    const shapes = [
      [[], "empty-register"],
      [[{ v: 1, event: "release", resource: "executor", at: "2026-09-12T10:00:00Z" }], "no-claims"],
      [[claimRecord("not-a-date")], "unparseable-timestamp"],
      [[claimRecord("2027-01-01T00:00:00Z")], "future-timestamp"],
    ];
    for (const [records, reason] of shapes) {
      const v = verdict(records, now, { activityIn: never });
      assert.equal(v.reason, reason);
      assert.equal(v.ok, false);
      assert.equal(asked(v), false, `${reason} must not report a corroboration it never made`);
    }
    // And the two that do ask, both ways, so this is a discriminator and not a constant.
    assert.equal(asked(verdict(register, now, { activityIn: () => DOWN })), true);
    assert.equal(asked(verdict(register, now, { activityIn: () => RAN })), true);
  });

  it("keeps `fromRecord` out of the serialised verdict", () => {
    // `gap` goes straight into `--json` and into the workflow's outputs. A whole register
    // record riding along in it is noise in the one artifact a person reads at 3am.
    const v = verdict(register, now, { activityIn: () => RAN });
    assert.ok(v.gap.fromRecord, "the handle itself must still be reachable");
    assert.equal(Object.keys(JSON.parse(JSON.stringify(v)).gap).includes("fromRecord"), false);
  });

  it("separates the same two facts on an open silence, not just a closed gap", () => {
    // One claim, then nothing, read past the staleness bar: `stale` is the other shape the
    // same ambiguity wears, and fixing only the gap would have left half the defect.
    const single = [claimRecord("2026-09-12T10:05:31.690Z", { holder: "vm:2036" })];
    const late = "2026-09-13T12:00:00Z";
    assert.equal(verdict(single, late, { activityIn: () => DOWN }).reason, "stale");
    assert.equal(verdict(single, late, { activityIn: () => RAN }).reason, "unclaimed-stale");
    assert.equal(verdict(single, late, { activityIn: () => RAN }).ok, false);
  });

  it("treats a second source that cannot answer as no evidence at all", () => {
    // An absent corroborator, one that throws, and one that answers "nothing" must all
    // leave the register's own verdict standing. Silence from the second source is not
    // evidence the loop ran.
    for (const activityIn of [undefined, () => null, () => DOWN, () => { throw new Error("git gone"); }]) {
      const v = verdict(register, now, activityIn ? { activityIn } : {});
      assert.equal(v.reason, "missed-runs", "an unanswered second source must not rename the outage");
      assert.equal(v.ok, false);
    }
  });

  it("CANNOT BE TALKED OUT OF ALARMING — no activity value makes any verdict ok", () => {
    // The property the whole change rests on. A watchdog the thing it watches can quieten
    // is not a watchdog, so this is asserted over every shape that reaches the corroborator
    // and over every answer it could give, including absurd ones.
    const answers = [
      DOWN,
      RAN,
      null,
      undefined,
      { commits: 1e9, sessions: ["x"], first: null, last: null },
      { commits: -1, sessions: [] },
      { ok: true },
      "live",
      42,
    ];
    const single = [claimRecord("2026-09-12T10:05:31.690Z", { holder: "vm:2036" })];
    for (const answer of answers) {
      for (const [records, nowIso] of [
        [register, now],
        [single, "2026-09-13T12:00:00Z"],
      ]) {
        const v = verdict(records, nowIso, { activityIn: () => answer });
        assert.equal(v.ok, false, `activity ${JSON.stringify(answer)} must not clear the alarm`);
        assert.notEqual(v.reason, "live");
      }
    }
  });

  it("never consults the second source on a healthy register", () => {
    // A live loop must not pay for a git call every hour, and — more to the point — a
    // corroborator with a side effect must not run on the path where there is nothing to
    // corroborate.
    let calls = 0;
    const healthy = [
      claimRecord("2026-09-13T04:00:00Z", { holder: "vm:1" }),
      claimRecord("2026-09-13T10:00:00Z", { holder: "vm:2", nonce: "n-2" }),
    ];
    const v = verdict(healthy, "2026-09-13T10:35:00Z", {
      activityIn: () => {
        calls += 1;
        return RAN;
      },
    });
    assert.equal(v.ok, true);
    assert.equal(v.reason, "live");
    assert.equal(calls, 0);
  });
});

describe("executorActivity reads real commits and ignores what is not a session", () => {
  it("counts this repository's own executor commits and excludes the bot's", async () => {
    // Against the real repository, over the window runs 155 and 156 committed in. The
    // discriminator being tested is the one the workflow header names: `metrics snapshot`
    // commits land under an author line that looks like the executor's, and they carry no
    // session trailer. `aada5a1` is inside this window and must not be counted.
    const { executorActivity } = await import("./executor-liveness.mjs");
    const repoRoot = path.resolve(path.dirname(CLI), "..");
    const a = executorActivity(repoRoot, {
      fromMs: Date.parse("2026-09-12T10:05:31.690Z"),
      toMs: Date.parse("2026-09-13T10:06:54.314Z"),
      ref: "origin/master",
    });
    if (a === null) return; // no `origin/master` locally; the CLI test covers the read path
    assert.ok(a.commits >= 8, `expected at least 8 executor commits, got ${a.commits}`);
    assert.ok(a.sessions.length >= 2, `expected at least 2 sessions, got ${a.sessions.length}`);
    for (const s of a.sessions) assert.match(s, /^https:\/\/claude\.ai\/code\/session_/);
  });

  it("returns null rather than throwing when git cannot answer", async () => {
    const { executorActivity } = await import("./executor-liveness.mjs");
    const a = executorActivity(path.dirname(CLI), {
      fromMs: 0,
      toMs: 1,
      ref: "refs/heads/no-such-ref-exists-here",
    });
    assert.equal(a, null);
  });
});
