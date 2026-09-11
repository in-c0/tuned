#!/usr/bin/env node --test
// Proof that the deploy watchdog stays quiet about the false alarm that prompted it, and
// goes red on the outage it is actually sized against. Those are the same reading for
// `verify production`, which is the whole reason this file exists.
//
// Both centrepieces replay real commits and real timestamps from this repository:
//
//   `the 2026-09-11 false alarm` — run 150's three pushes and the metrics-snapshot commit
//   that superseded them. `verify production` went red on `408db69`
//   (https://github.com/in-c0/tuned/actions/runs/34562017390) and the operating rules
//   prescribe rollback for that signal. This asserts the watchdog says FRESH at every
//   hourly firing afterwards, because production was current the whole time. A watchdog
//   that cannot stay quiet about a healthy site is a rollback waiting to happen.
//
//   `the 2026-08-27 stuck pipeline` — three consecutive commits that did not deploy while
//   production served a build from 03:42Z. That incident was found ~19h in, by a run that
//   happened to look. This asserts red at the first hourly firing after the grace period,
//   ~1.6h in, and red again an hour later under the same alarm key so the owner is told
//   once rather than hourly.
//
// The rest is the fail-closed surface, one test per way the input can be missing or wrong.

import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { describe, it } from "node:test";

import {
  DEFAULT_GRACE_MINUTES,
  evaluateDeployStaleness,
  parseServingCommit,
} from "./deploy-staleness.mjs";

const execFileAsync = promisify(execFile);
const CLI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "deploy-staleness.mjs");
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const at = (iso) => Date.parse(iso);

// Run 150's pushes and the scheduled commit that landed 18 minutes later, verbatim from
// `git log --first-parent --format='%H %cI'`. Newest first, as master's line is read.
const SEPT_11 = [
  { sha: "d53b0c098fa2c94ace635edf8fae5a1730a12c62", at: "2026-09-11T04:41:51+00:00" },
  { sha: "408db69c8960dc5b49020e83ba57bb6ddc3145f9", at: "2026-09-11T04:23:24+00:00" },
  { sha: "43a6f53d3bd1c1321a0adfe3a84ed6244ddd3872", at: "2026-09-11T04:21:39+00:00" },
  { sha: "206dc60ab87b000292a0c3c60db0050eef684b6f", at: "2026-09-11T04:17:13+00:00" },
  { sha: "04f84612000f1e2a1bd2f0b9747a1b961dacc92e", at: "2026-09-10T22:44:38+00:00" },
];

// The 2026-08-27 pipeline stall, from the times recorded in ops/STATUS.md: three pushes,
// and a production that kept answering 200 with the build stamp of 2026-08-27T03:42Z.
const AUG_27 = [
  { sha: "33ba76d0000000000000000000000000000000aa", at: "2026-08-27T22:09:14+00:00" },
  { sha: "0c1405300000000000000000000000000000000b", at: "2026-08-27T22:05:04+00:00" },
  { sha: "1bedef200000000000000000000000000000000c", at: "2026-08-27T21:44:36+00:00" },
  { sha: "798314600000000000000000000000000000000d", at: "2026-08-27T03:42:00+00:00" },
];
const AUG_27_SERVING = "798314600000000000000000000000000000000d";

describe("the 2026-09-11 false alarm", () => {
  // The exact reading `verify production` had at 04:31:42Z, when it failed: 43a6f53 was
  // serving and 408db69 was not. The watchdog is asked the same thing and must not agree,
  // because 408db69 was 8 minutes old and no deploy is owed that fast.
  it("does not call a just-pushed commit stale, which is the rollback this prevents", () => {
    const v = evaluateDeployStaleness("43a6f53d3bd1c1321a0adfe3a84ed6244ddd3872", SEPT_11, {
      now: at("2026-09-11T04:31:42+00:00"),
    });
    assert.equal(v.ok, true);
    assert.equal(v.reason, "fresh");
    assert.equal(v.alarmKey, null);
  });

  // Every hourly firing after the incident, at the cron's :35. Production was serving
  // d53b0c0 from ~04:43 onwards, which contains 408db69, so there was never anything to
  // say — and this is the assertion that the red run was a false alarm, made against the
  // same production the red run was reading.
  for (const hour of ["05:35", "06:35", "07:35", "08:35", "09:35", "10:35"]) {
    it(`is quiet at ${hour}Z, with d53b0c0 serving`, () => {
      const v = evaluateDeployStaleness("d53b0c098fa2c94ace635edf8fae5a1730a12c62", SEPT_11, {
        now: at(`2026-09-11T${hour}:00+00:00`),
      });
      assert.equal(v.ok, true, `${hour} should be fresh, got ${v.reason}`);
      assert.equal(v.reason, "fresh");
      assert.equal(v.behind, 0);
    });
  }

  // The counterfactual that separates "the build was dropped and the next push recovered
  // it" from "the pipeline is stuck". Same commits, same clock; only the serving build
  // differs. If both readings came out the same, the instrument would be measuring the
  // clock rather than production.
  it("goes red on the same history when d53b0c0 never lands", () => {
    const v = evaluateDeployStaleness("43a6f53d3bd1c1321a0adfe3a84ed6244ddd3872", SEPT_11, {
      now: at("2026-09-11T06:35:00+00:00"),
    });
    assert.equal(v.ok, false);
    assert.equal(v.reason, "stale");
    assert.equal(v.due, "d53b0c098fa2c94ace635edf8fae5a1730a12c62");
    assert.equal(v.behind, 2);
    assert.equal(v.staleHours, 1.89);
    assert.equal(v.alarmKey, "d53b0c098fa2c94ace635edf8fae5a1730a12c62");
  });
});

describe("the 2026-08-27 stuck pipeline", () => {
  it("is still quiet 90 minutes in, while the grace period is running", () => {
    const v = evaluateDeployStaleness(AUG_27_SERVING, AUG_27, {
      now: at("2026-08-27T23:00:00+00:00"),
    });
    assert.equal(v.ok, true);
    assert.equal(v.reason, "fresh");
  });

  it("is red at the first firing after the grace period, ~1.6h in", () => {
    const v = evaluateDeployStaleness(AUG_27_SERVING, AUG_27, {
      now: at("2026-08-27T23:44:00+00:00"),
    });
    assert.equal(v.ok, false);
    assert.equal(v.reason, "stale");
    assert.equal(v.due, AUG_27[0].sha);
    assert.equal(v.behind, 3);
    assert.equal(v.alarmKey, AUG_27[0].sha);
  });

  // The real incident ran ~19 hours. The owner must hear about it once, not nineteen
  // times, so the key has to be the thing that does not move while the outage lasts.
  it("keeps one alarm key for the whole outage", () => {
    const keys = new Set(
      ["2026-08-27T23:44", "2026-08-28T00:35", "2026-08-28T06:35", "2026-08-28T18:35"].map(
        (stamp) =>
          evaluateDeployStaleness(AUG_27_SERVING, AUG_27, { now: at(`${stamp}:00+00:00`) }).alarmKey,
      ),
    );
    assert.deepEqual([...keys], [AUG_27[0].sha]);
  });

  // ...and a second, separate stall must not be swallowed by the first one's key.
  it("takes a new alarm key when a later commit becomes the blocker", () => {
    const later = [{ sha: "f00dfeed00000000000000000000000000000001", at: "2026-08-28T09:00:00+00:00" }, ...AUG_27];
    const v = evaluateDeployStaleness(AUG_27_SERVING, later, { now: at("2026-08-28T18:35:00+00:00") });
    assert.equal(v.alarmKey, "f00dfeed00000000000000000000000000000001");
  });
});

describe("a normal deploy never trips it", () => {
  // Measured build-to-deploy in this repository is 0.9–1.7 minutes. Anything inside the
  // grace period must read fresh no matter what is serving, or the watchdog fires on every
  // push and the owner stops reading it.
  it("is quiet for the whole grace period after a push, with the previous build serving", () => {
    for (let minute = 0; minute < DEFAULT_GRACE_MINUTES; minute += 5) {
      const now = at("2026-09-11T04:23:24+00:00") + minute * 60_000;
      const v = evaluateDeployStaleness("43a6f53d3bd1c1321a0adfe3a84ed6244ddd3872", SEPT_11.slice(1), { now });
      assert.equal(v.ok, true, `minute ${minute} should be quiet, got ${v.reason}`);
    }
  });

  it("holds the grace period at its derived value", () => {
    assert.equal(DEFAULT_GRACE_MINUTES, 90);
  });
});

describe("fail-closed surface", () => {
  it("has no opinion when production cannot be read, and raises nothing", () => {
    const v = evaluateDeployStaleness(null, SEPT_11, { now: at("2026-09-11T10:35:00+00:00") });
    assert.equal(v.ok, false);
    assert.equal(v.reason, "unreachable");
    assert.equal(v.alarmKey, null, "an unreadable site must not page the owner; see the header");
  });

  it("refuses an empty history rather than calling it fresh", () => {
    const v = evaluateDeployStaleness("d53b0c0", [], { now: at("2026-09-11T10:35:00+00:00") });
    assert.equal(v.ok, false);
    assert.equal(v.reason, "no-history");
  });

  it("refuses a history with an unparseable date", () => {
    const v = evaluateDeployStaleness("d53b0c0", [{ sha: "abc1234", at: "not a date" }], {
      now: at("2026-09-11T10:35:00+00:00"),
    });
    assert.equal(v.ok, false);
    assert.equal(v.reason, "unparseable-history");
  });

  it("raises on a production serving something that is not on master", () => {
    const v = evaluateDeployStaleness("deadbeefdeadbeefdeadbeefdeadbeefdeadbeef", SEPT_11, {
      now: at("2026-09-11T10:35:00+00:00"),
    });
    assert.equal(v.ok, false);
    assert.equal(v.reason, "unknown-serving");
    assert.equal(v.alarmKey, "unknown:deadbeefdeadbeefdeadbeefdeadbeefdeadbeef");
  });

  it("is green, not red, when every commit is younger than the grace period", () => {
    const v = evaluateDeployStaleness("d53b0c098fa2c94ace635edf8fae5a1730a12c62", SEPT_11.slice(0, 1), {
      now: at("2026-09-11T04:45:00+00:00"),
    });
    assert.equal(v.ok, true);
    assert.equal(v.reason, "no-due-commit");
  });

  it("accepts a short serving stamp as the commit it prefixes", () => {
    const v = evaluateDeployStaleness("d53b0c0", SEPT_11, { now: at("2026-09-11T10:35:00+00:00") });
    assert.equal(v.ok, true);
    assert.equal(v.serving, SEPT_11[0].sha);
  });
});

describe("reading the build stamp", () => {
  it("takes the commit out of a real /api/version body", () => {
    assert.equal(
      parseServingCommit('{"commit":"d53b0c098fa2c94ace635edf8fae5a1730a12c62","built":"2026-09-11"}'),
      "d53b0c098fa2c94ace635edf8fae5a1730a12c62",
    );
  });

  // Each of these is a way production has actually answered, or could. None may be
  // mistaken for a commit — a wrong sha here reads as an outage on a healthy site, or
  // hides one on a broken site, depending on which way it lands.
  for (const [label, body] of [
    ["an old Worker's 404 text", "Not found"],
    ["a Cloudflare error page", "<!DOCTYPE html><title>Just a moment...</title>"],
    ["an empty body", ""],
    ["a non-string", null],
    ["a non-hex commit", '{"commit":"not-a-sha"}'],
    ["a commit that is too short", '{"commit":"d53b0"}'],
  ]) {
    it(`returns null for ${label}`, () => {
      assert.equal(parseServingCommit(body), null);
    });
  }
});

describe("as a CLI", () => {
  const run = async (args) => {
    try {
      const { stdout } = await execFileAsync("node", [CLI, ...args]);
      return { code: 0, stdout };
    } catch (err) {
      return { code: err.code ?? 1, stdout: err.stdout ?? "" };
    }
  };

  // HEAD is what a checkout of master serves, so a production claiming to serve it must
  // read fresh at any clock. This exercises the git path end to end — reading master's
  // real first-parent line — which the pure tests above cannot reach.
  it("exits 0 and reports fresh against this repository's real history", async () => {
    const { stdout: head } = await execFileAsync("git", ["-C", REPO, "rev-parse", "HEAD"]);
    const body = path.join(os.tmpdir(), `deploy-staleness-${process.pid}.json`);
    fs.writeFileSync(body, JSON.stringify({ commit: head.trim(), built: "test" }));
    try {
      const { code, stdout } = await run(["--repo", REPO, "--json", "--status", "200", "--version-file", body]);
      assert.equal(code, 0);
      assert.match(stdout, /"reason": "fresh"/);
      assert.match(stdout, /"alarmKey": null/);
    } finally {
      fs.rmSync(body, { force: true });
    }
  });

  // A missing body must never be silently treated as a match: with no stamp there is
  // nothing to compare, and the only safe verdict is "no opinion, and do not page".
  it("exits 1 with no alarm key when there is no body to read", async () => {
    const { code, stdout } = await run(["--repo", REPO, "--json", "--status", "200"]);
    assert.equal(code, 1);
    assert.match(stdout, /"reason": "unreachable"/);
    assert.match(stdout, /"alarmKey": null/);
  });

  it("exits 1 with no alarm key when production answered a non-200", async () => {
    const { code, stdout } = await run(["--repo", REPO, "--json", "--status", "503"]);
    assert.equal(code, 1);
    assert.match(stdout, /"reason": "unreachable"/);
    assert.match(stdout, /production answered HTTP 503/);
  });
});
