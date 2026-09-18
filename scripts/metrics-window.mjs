#!/usr/bin/env node
// Is this snapshot an admissible source for a reading over complete UTC days?
//
// WHY THIS EXISTS. Every pre-registered reading in ops/EXPERIMENTS.md is defined over
// *complete* UTC days, and every one of them is taken by a run that opens a JSON file and
// sums rows. The file says which days it reports. It does not say which of those days had
// finished when it was taken — that fact lives in `generated_at`, one level away, and
// nothing in this repository has ever compared the two.
//
// So a snapshot taken at 23:05Z writes a row for today that is indistinguishable, at the
// point of use, from the same row taken after midnight. It has the day's name, it has
// counts, it sits in a file named after the day. The only thing wrong with it is that
// several hours of the day had not happened yet.
//
// THIS IS NOT HYPOTHETICAL AND IT IS NOT NEW. ops/METRICS.md carries roughly ten hand-written
// "this day is partial" annotations, each one a run re-deriving the same fact by eye from
// `generated_at`, correctly. L-37 records the run that did not: run 57 read a partial day of
// `arrival_fetch:qa`, divided 16 by elapsed hours, and reported the quotient as a cadence —
// "the shape of a feed client or an indexer". The day closed at 23 and the next 4.1 hours
// produced 1. The lesson written that day was "a partial day is not a rate". It was written
// as prose, and prose is not a gate, so the next twenty-odd readings each depended on
// whoever took them noticing again.
//
// WHAT MADE IT URGENT. metrics-snapshot.yml added a second schedule, `15 0 * * *`, for
// exactly this problem. Its header states the intent: the 00:15 run "exists so the previous
// UTC day is on disk, complete, within minutes of ending". It has never once done that.
// Scheduled deliveries in this repository run 1.6h-4.5h late on every firing (measured
// independently in scripts/executor-liveness.mjs); that cron's six most recent fires landed
// 4.48h, 4.65h, 4.58h, 4.68h, 4.70h and 4.55h late, none inside 15 minutes. The snapshot a
// morning run finds is therefore the *previous evening's* 20:40 run, whose final day is
// partial by ~3 hours, and it looks exactly like the one the 00:15 run was added to provide.
//
// The design was sound and the scheduler quietly withdrew it. A guard that reads the file
// cannot be withdrawn that way.
//
// WHAT IT DELIBERATELY DOES NOT DO. It does not judge whether a window's *contents* are
// clean — contamination, instrument failure and every threshold stay where they are
// registered, in ops/EXPERIMENTS.md, which is the only place they belong. It answers one
// question, the one nothing answered: has every day in this window actually finished by the
// time this file was written? A "yes" from here is a statement about the clock and about
// nothing else.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_SNAPSHOT = path.join(REPO_ROOT, "ops", "metrics", "latest.json");
const DAY_MS = 86_400_000;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parse a YYYY-MM-DD UTC day into the instant it begins. Throws rather than returning
 * something falsy: a window bound this script cannot read is a caller error, and silently
 * treating it as epoch zero would make every window trivially admissible.
 */
export function parseDay(day) {
  if (typeof day !== "string" || !DAY_RE.test(day)) {
    throw new Error(`not a UTC day in YYYY-MM-DD form: ${JSON.stringify(day)}`);
  }
  const ms = Date.parse(`${day}T00:00:00.000Z`);
  if (Number.isNaN(ms)) throw new Error(`not a real calendar date: ${day}`);
  // Date.parse accepts 2026-02-31 on some hosts by rolling over; reject that, because a
  // window bound that silently moves is worse than one that fails.
  if (new Date(ms).toISOString().slice(0, 10) !== day) {
    throw new Error(`not a real calendar date: ${day}`);
  }
  return ms;
}

export function dayOf(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

/**
 * The last UTC day a snapshot generated at `generatedAt` reports COMPLETELY.
 *
 * A day D is complete in a snapshot iff the snapshot was generated at or after the instant
 * D ends, which is D+1 at 00:00:00Z. That reduces to: the day before the generation
 * instant's own UTC day. Exactly at midnight counts — the day has closed.
 */
export function completeThrough(generatedAt) {
  const ms = Date.parse(generatedAt);
  if (Number.isNaN(ms)) {
    throw new Error(`snapshot has no readable generated_at: ${JSON.stringify(generatedAt)}`);
  }
  const startOfGenDay = Date.parse(`${dayOf(ms)}T00:00:00.000Z`);
  return dayOf(startOfGenDay - DAY_MS);
}

/** The earliest generation instant at which `lastDay` is a complete day. */
export function earliestAdmissible(lastDay) {
  return new Date(parseDay(lastDay) + DAY_MS).toISOString();
}

export function loadSnapshot(snapshotPath) {
  const raw = fs.readFileSync(snapshotPath, "utf8");
  const snapshot = JSON.parse(raw);
  if (!snapshot || typeof snapshot !== "object") {
    throw new Error(`snapshot is not an object: ${snapshotPath}`);
  }
  return snapshot;
}

/**
 * The earliest UTC day the snapshot carries any row for.
 *
 * Note what this is and is not. A day with no events has no rows at all, so this cannot be
 * used to prove a particular day is present — only that the reported history reaches back
 * at least this far. That is the weaker claim, and it is the true one.
 */
export function earliestDayReported(snapshot) {
  const daily = Array.isArray(snapshot.daily) ? snapshot.daily : [];
  let earliest = null;
  for (const row of daily) {
    const day = row && row.day;
    if (typeof day !== "string" || !DAY_RE.test(day)) continue;
    if (earliest === null || day < earliest) earliest = day;
  }
  return earliest;
}

/**
 * Does `snapshot` admit a reading over the complete UTC days firstDay..lastDay inclusive?
 *
 * Fails closed in every direction: an unparseable generated_at, an empty `daily`, a history
 * that does not reach back to firstDay, or a lastDay that had not finished are all "no".
 * A malformed snapshot must never read as admissible — that is the shape L-61 records.
 */
export function admits(snapshot, firstDay, lastDay) {
  const first = parseDay(firstDay);
  const last = parseDay(lastDay);
  if (last < first) {
    return { ok: false, code: "window-inverted", detail: `${firstDay} is after ${lastDay}` };
  }

  const through = completeThrough(snapshot.generated_at);
  if (through < lastDay) {
    return {
      ok: false,
      code: "window-open",
      completeThrough: through,
      generatedAt: snapshot.generated_at,
      earliestAdmissible: earliestAdmissible(lastDay),
      detail:
        `snapshot was generated at ${snapshot.generated_at}, so it reports complete UTC days ` +
        `only through ${through}. ${lastDay} had not finished, and its row is partial.`,
    };
  }

  const earliest = earliestDayReported(snapshot);
  if (earliest === null) {
    return { ok: false, code: "no-daily-rows", detail: "snapshot reports no daily rows at all" };
  }
  if (earliest > firstDay) {
    return {
      ok: false,
      code: "history-short",
      earliestDayReported: earliest,
      detail: `snapshot's reported history begins ${earliest}, after the window's first day ${firstDay}`,
    };
  }

  return {
    ok: true,
    code: "admissible",
    completeThrough: through,
    generatedAt: snapshot.generated_at,
    days: Math.round((last - first) / DAY_MS) + 1,
  };
}

function usage() {
  return [
    "usage:",
    "  node scripts/metrics-window.mjs complete-through [--snapshot PATH]",
    "  node scripts/metrics-window.mjs admits FIRST-DAY LAST-DAY [--snapshot PATH]",
    "",
    "exit codes: 0 admissible · 1 not admissible · 2 usage or unreadable snapshot",
  ].join("\n");
}

function main(argv) {
  const args = [...argv];
  let snapshotPath = DEFAULT_SNAPSHOT;
  const flag = args.indexOf("--snapshot");
  if (flag !== -1) {
    if (!args[flag + 1]) {
      process.stderr.write(`--snapshot needs a path\n${usage()}\n`);
      return 2;
    }
    snapshotPath = args[flag + 1];
    args.splice(flag, 2);
  }

  const command = args[0];
  let snapshot;
  try {
    snapshot = loadSnapshot(snapshotPath);
  } catch (err) {
    process.stderr.write(`cannot read snapshot ${snapshotPath}: ${err.message}\n`);
    return 2;
  }

  if (command === "complete-through") {
    try {
      process.stdout.write(`${completeThrough(snapshot.generated_at)}\n`);
      return 0;
    } catch (err) {
      process.stderr.write(`${err.message}\n`);
      return 2;
    }
  }

  if (command === "admits") {
    const [, firstDay, lastDay] = args;
    let verdict;
    try {
      verdict = admits(snapshot, firstDay, lastDay);
    } catch (err) {
      process.stderr.write(`${err.message}\n${usage()}\n`);
      return 2;
    }
    if (verdict.ok) {
      process.stdout.write(
        `ADMISSIBLE ${firstDay}..${lastDay} (${verdict.days} complete UTC days)\n` +
          `  snapshot ${snapshotPath}\n` +
          `  generated_at ${verdict.generatedAt}, complete through ${verdict.completeThrough}\n`,
      );
      return 0;
    }
    process.stdout.write(`NOT ADMISSIBLE ${firstDay}..${lastDay} [${verdict.code}]\n  ${verdict.detail}\n`);
    if (verdict.code === "window-open") {
      process.stdout.write(
        `  earliest admissible generated_at: ${verdict.earliestAdmissible}\n` +
          `  remedy: take a fresh snapshot at or after that instant. The scheduled run is\n` +
          `  delivered hours late and cannot be waited on; dispatch metrics-snapshot instead.\n` +
          `  Inside an open pre-registered window, note that a dispatched run probes production\n` +
          `  and writes a landing_view — see metrics-snapshot.yml.\n`,
      );
    }
    return 1;
  }

  process.stderr.write(`${usage()}\n`);
  return 2;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  process.exit(main(process.argv.slice(2)));
}
