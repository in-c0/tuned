#!/usr/bin/env node --test
// Proof that a partial final day cannot read as a complete one.
//
// The property under test is narrow and the whole point is that it is mechanical. Every
// pre-registered reading in ops/EXPERIMENTS.md is defined over complete UTC days; until now
// the only thing standing between a partial day and a graded reading was the run noticing
// `generated_at` and doing the subtraction in its head. ops/METRICS.md shows it being done
// by hand about ten times, and L-37 shows run 57 not doing it and publishing a rate from an
// unfinished day.
//
// The boundary cases carry the risk, so they are written first and explicitly: a snapshot
// taken one millisecond before midnight must not admit that day, and one taken exactly at
// midnight must.

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import {
  admits,
  completeThrough,
  earliestAdmissible,
  earliestDayReported,
  parseDay,
} from "./metrics-window.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLI = path.join(REPO_ROOT, "scripts", "metrics-window.mjs");
const REAL_SNAPSHOT = path.join(REPO_ROOT, "ops", "metrics", "latest.json");

/** A snapshot carrying rows from `from` through `to`, generated at `generatedAt`. */
function snapshotSpanning(from, to, generatedAt) {
  const daily = [];
  for (let ms = parseDay(from); ms <= parseDay(to); ms += 86_400_000) {
    daily.push({ day: new Date(ms).toISOString().slice(0, 10), name: "landing_view", count: 1 });
  }
  return { generated_at: generatedAt, daily };
}

function runCli(args) {
  try {
    const stdout = execFileSync(process.execPath, [CLI, ...args], { encoding: "utf8" });
    return { status: 0, stdout };
  } catch (err) {
    return { status: err.status, stdout: `${err.stdout ?? ""}${err.stderr ?? ""}` };
  }
}

describe("completeThrough — the subtraction nobody was obliged to do", () => {
  it("counts a day as complete only once it has ended", () => {
    assert.equal(completeThrough("2026-09-19T00:00:00.000Z"), "2026-09-18");
  });

  it("does not count the day in progress, one millisecond short", () => {
    assert.equal(completeThrough("2026-09-18T23:59:59.999Z"), "2026-09-17");
  });

  it("is unmoved by how late in the day the snapshot was taken", () => {
    // 20:40Z and 04:44Z are this repository's two real snapshot times. The first reports
    // through yesterday, the second through the day that just ended.
    assert.equal(completeThrough("2026-09-18T20:40:00.000Z"), "2026-09-17");
    assert.equal(completeThrough("2026-09-19T04:44:34.001Z"), "2026-09-18");
  });

  it("refuses a generated_at it cannot read, rather than defaulting to a day", () => {
    assert.throws(() => completeThrough(undefined), /generated_at/);
    assert.throws(() => completeThrough("last Tuesday"), /generated_at/);
  });
});

describe("admits — the live failure this was written for", () => {
  const FIRST = "2026-09-05";
  const LAST = "2026-09-18";

  it("refuses the evening snapshot, whose final day is short by three hours", () => {
    // The real shape of the hazard: metrics-snapshot's 20:40Z cron, delivered ~23:05Z, writes
    // a row for the window's last day that is partial and looks like every other row.
    const verdict = admits(snapshotSpanning("2026-08-06", LAST, "2026-09-18T23:05:00.000Z"), FIRST, LAST);
    assert.equal(verdict.ok, false);
    assert.equal(verdict.code, "window-open");
    assert.equal(verdict.completeThrough, "2026-09-17");
    assert.equal(verdict.earliestAdmissible, "2026-09-19T00:00:00.000Z");
  });

  it("admits a snapshot taken after the window closed", () => {
    const verdict = admits(snapshotSpanning("2026-08-06", LAST, "2026-09-19T04:44:34.001Z"), FIRST, LAST);
    assert.equal(verdict.ok, true);
    assert.equal(verdict.days, 14);
    assert.equal(verdict.completeThrough, LAST);
  });

  it("admits at the exact instant the window closes and not before", () => {
    const at = snapshotSpanning("2026-08-06", LAST, "2026-09-19T00:00:00.000Z");
    const justBefore = snapshotSpanning("2026-08-06", LAST, "2026-09-18T23:59:59.999Z");
    assert.equal(admits(at, FIRST, LAST).ok, true);
    assert.equal(admits(justBefore, FIRST, LAST).ok, false);
  });

  it("refuses a history that does not reach the window's first day", () => {
    const verdict = admits(snapshotSpanning("2026-09-10", LAST, "2026-09-19T04:00:00.000Z"), FIRST, LAST);
    assert.equal(verdict.ok, false);
    assert.equal(verdict.code, "history-short");
    assert.equal(verdict.earliestDayReported, "2026-09-10");
  });

  it("fails closed on a snapshot with no daily rows, rather than finding nothing wrong", () => {
    // L-61's shape. An empty set satisfies every assertion made about its members, so the
    // absence of rows must be its own verdict.
    const verdict = admits({ generated_at: "2026-09-19T04:00:00.000Z", daily: [] }, FIRST, LAST);
    assert.equal(verdict.ok, false);
    assert.equal(verdict.code, "no-daily-rows");
  });

  it("fails closed when daily is missing or not a list", () => {
    for (const daily of [undefined, null, "2026-09-05", { day: "2026-09-05" }]) {
      const verdict = admits({ generated_at: "2026-09-19T04:00:00.000Z", daily }, FIRST, LAST);
      assert.equal(verdict.ok, false, `daily=${JSON.stringify(daily)} must not be admissible`);
      assert.equal(verdict.code, "no-daily-rows");
    }
  });

  it("refuses an inverted window instead of silently reading it backwards", () => {
    const snapshot = snapshotSpanning("2026-08-06", LAST, "2026-09-19T04:00:00.000Z");
    assert.equal(admits(snapshot, LAST, FIRST).code, "window-inverted");
  });

  it("counts a single-day window as one day, not zero", () => {
    const verdict = admits(snapshotSpanning("2026-08-06", LAST, "2026-09-19T04:00:00.000Z"), LAST, LAST);
    assert.equal(verdict.ok, true);
    assert.equal(verdict.days, 1);
  });
});

describe("parseDay — a window bound that cannot move quietly", () => {
  it("rejects anything that is not a YYYY-MM-DD UTC day", () => {
    for (const bad of ["2026-9-5", "05-09-2026", "2026-09-05T00:00:00Z", "", null, 20260905]) {
      assert.throws(() => parseDay(bad), /UTC day/, `${JSON.stringify(bad)} must be rejected`);
    }
  });

  it("rejects a date that does not exist rather than rolling it over", () => {
    assert.throws(() => parseDay("2026-02-31"), /real calendar date/);
    assert.throws(() => parseDay("2026-13-01"), /real calendar date/);
  });

  it("names the instant a day's window closes", () => {
    assert.equal(earliestAdmissible("2026-09-18"), "2026-09-19T00:00:00.000Z");
  });
});

describe("the real committed snapshot, so this guard cannot go vacuous", () => {
  // Every assertion above runs on fixtures this file builds. If ops/metrics/latest.json ever
  // changes shape — a renamed generated_at, a restructured daily — those fixtures keep
  // passing while the guard silently stops applying to the only file anyone reads. That is
  // L-85's shape, and this block is the thing that would go red.
  const snapshot = JSON.parse(fs.readFileSync(REAL_SNAPSHOT, "utf8"));

  it("carries a generated_at this script can read", () => {
    assert.equal(typeof snapshot.generated_at, "string");
    assert.match(completeThrough(snapshot.generated_at), /^\d{4}-\d{2}-\d{2}$/);
  });

  it("reports complete days through exactly the day before it was generated", () => {
    const genDay = snapshot.generated_at.slice(0, 10);
    const expected = new Date(parseDay(genDay) - 86_400_000).toISOString().slice(0, 10);
    assert.equal(completeThrough(snapshot.generated_at), expected);
  });

  it("carries daily rows with readable day fields", () => {
    assert.ok(Array.isArray(snapshot.daily) && snapshot.daily.length > 0);
    assert.match(earliestDayReported(snapshot) ?? "", /^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("the command line, which is what a run actually invokes", () => {
  it("prints the last complete day and exits 0", () => {
    const { status, stdout } = runCli(["complete-through"]);
    assert.equal(status, 0);
    assert.match(stdout.trim(), /^\d{4}-\d{2}-\d{2}$/);
  });

  it("exits 1 and names the remedy when the window is still open", () => {
    const fixture = path.join(REPO_ROOT, "ops", "metrics", ".window-open.fixture.json");
    fs.writeFileSync(
      fixture,
      JSON.stringify(snapshotSpanning("2026-08-06", "2026-09-18", "2026-09-18T23:05:00.000Z")),
    );
    try {
      const { status, stdout } = runCli(["admits", "2026-09-05", "2026-09-18", "--snapshot", fixture]);
      assert.equal(status, 1);
      assert.match(stdout, /NOT ADMISSIBLE/);
      assert.match(stdout, /window-open/);
      assert.match(stdout, /2026-09-19T00:00:00\.000Z/);
      assert.match(stdout, /dispatch metrics-snapshot/);
    } finally {
      fs.rmSync(fixture, { force: true });
    }
  });

  it("exits 2 on an unreadable snapshot rather than 0 or 1", () => {
    // The difference matters: 1 means "asked and answered no", 2 means "could not ask". A
    // caller that treats a missing file as a clean no has a guard that disappears with it.
    const { status } = runCli(["admits", "2026-09-05", "2026-09-18", "--snapshot", "/nonexistent.json"]);
    assert.equal(status, 2);
  });

  it("exits 2 on an unknown command or a malformed day", () => {
    assert.equal(runCli(["grade-it-for-me"]).status, 2);
    assert.equal(runCli(["admits", "2026-09-05"]).status, 2);
    assert.equal(runCli(["admits", "yesterday", "today"]).status, 2);
  });
});
