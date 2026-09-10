#!/usr/bin/env node
// Does the executor loop still fire? Nothing in this repository could answer that.
//
// WHY THIS EXISTS. Between 2026-09-07T10:05:18Z and 2026-09-10T04:03:37Z the executor
// routine fired seven times on its 04:00/10:00/22:00 UTC cron and produced nothing: no
// lock claim, no commit, no execution report on issue #1. Run 147 found it by reading the
// claims register by hand. Nothing would have found it otherwise, and nothing was looking.
//
// The failure is worse than a gap, because the repository stayed visibly busy while it
// happened. `metrics snapshot` kept committing twice a day under the same author line the
// executor uses, so `git log` showed fresh activity on every one of those days. An owner
// glancing at the repository would have concluded the loop was running. The absence of a
// run is not observable from the presence of commits.
//
// WHAT IT WATCHES, AND WHY THAT SIGNAL. Step 0 of every executor run is `run-claim claim`,
// before any commit, comment, dispatch or external action (ops/STATUS.md). So an appended
// `claim` record for resource `executor` is the earliest and most reliable evidence that a
// run actually started — earlier than a commit, which a run legitimately may not make, and
// earlier than an issue comment, which a run that dies mid-cycle never reaches. A run that
// starts and then fails still leaves the claim; the watchdog is deliberately measuring
// "did a session begin", not "did a session succeed".
//
// WHY IT LIVES IN GITHUB ACTIONS AND NOT IN THE LOOP. An alarm hosted inside the process
// it watches is not an alarm. The scheduled workflow that calls this script runs on
// GitHub's cron, holds no dependency on the Claude routine, and fires whether or not the
// routine exists at all.
//
// THE THRESHOLD, DERIVED RATHER THAN PICKED. Firings are 04:00, 10:00 and 22:00 UTC, so
// the gaps between consecutive claims cycle through 6h, 12h and 6h. The gap after k
// consecutive missed firings is the sum of k+1 of those in cyclic order:
//
//   k=0  on cadence   {6, 12, 6}            max 12h
//   k=1  one miss     {6+12, 12+6, 6+6}     12h … 18h
//   k=2  two misses   {6+12+6, …}           24h, from every anchor
//
// So 20h is the threshold: above every one-miss gap, below every two-miss gap.
//
// WHY THE CHECK IS HOURLY, WHICH IS THE PART I GOT WRONG FIRST. The first draft checked
// three times a day, two hours after each firing window, and a 24h outage was invisible to
// it: from a 22:05 claim, missing 04:00 and 10:00, the checks at 00:00/06:00/12:00 observe
// ages of 1.9h, 7.9h and 13.9h, and the 22:00 firing recovers before the next one looks.
// The gap was 24h and the largest age ever *observed* was 13.9h. A watchdog only sees the
// outage if it looks while the outage is open, so it has to look more often than the
// outage is long. Hourly makes the observed age track the true gap within the hour.
//
// THE RESIDUAL, STATED RATHER THAN HIDDEN. A scheduled run can be delayed by GitHub under
// load, and a delay makes the age this reads larger, never smaller. So a single missed
// firing on an 18h gap, plus a check delayed more than ~2h, can raise a false alarm. That
// trade is deliberate and not close: a false alarm costs one issue comment and a red check
// that the next green run clears, and a missed alarm cost this loop seven firings.
//
// FAIL CLOSED, IN EVERY DIRECTION. A missing register branch, an empty register, a
// register with no claim for this resource, an unparseable timestamp, or a timestamp in
// the future are all *failures*, never passes. This is L-61 applied to the watchdog
// itself: a check whose input parses to nothing sweeps an empty set, and every assertion
// over an empty set holds. The one way to be healthy is to find a real, recent, parseable
// claim.
//
//   node scripts/executor-liveness.mjs            # exit 0 live, exit 1 stale or unreadable
//
// Options: --max-age-hours N  --resource NAME  --remote NAME  --now ISO  --json  --repo PATH

import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import {
  CLAIM_BRANCH,
  DEFAULT_RESOURCE,
  fetchTip,
  parseRegister,
  readRegisterRaw,
} from "./lib/run-claim.mjs";

export const DEFAULT_MAX_AGE_HOURS = 20;

// The watchdog clock and the claim clock are different machines. Five minutes is well
// under the threshold's slack and well over any plausible runner skew, so it separates
// "clocks disagree slightly" from "this timestamp is wrong", which is a corrupt register
// and must fail rather than be treated as the freshest possible claim.
export const CLOCK_SKEW_MS = 5 * 60_000;

const HOUR_MS = 3_600_000;

/**
 * Pure verdict over an already-parsed register. Every non-`live` outcome is a failure;
 * `reason` distinguishes them so the alarm can say which one without re-deriving it.
 */
export function evaluateLiveness(records, { resource = DEFAULT_RESOURCE, now, maxAgeMs } = {}) {
  const base = { resource, now: new Date(now).toISOString(), maxAgeMs };

  if (!Array.isArray(records) || records.length === 0) {
    return { ...base, ok: false, reason: "empty-register", claims: 0 };
  }

  const claims = records.filter((r) => r && r.event === "claim" && r.resource === resource);
  if (claims.length === 0) {
    return { ...base, ok: false, reason: "no-claims", claims: 0 };
  }

  const timed = [];
  for (const record of claims) {
    const at = Date.parse(record.at);
    if (!Number.isFinite(at)) {
      return { ...base, ok: false, reason: "unparseable-timestamp", offender: record.at ?? null };
    }
    timed.push({ at, record });
  }
  timed.sort((a, b) => a.at - b.at);

  const newest = timed[timed.length - 1];
  if (newest.at > now + CLOCK_SKEW_MS) {
    return { ...base, ok: false, reason: "future-timestamp", newestAt: newest.record.at };
  }

  const ageMs = now - newest.at;
  return {
    ...base,
    ok: ageMs <= maxAgeMs,
    reason: ageMs <= maxAgeMs ? "live" : "stale",
    ageMs,
    ageHours: Number((ageMs / HOUR_MS).toFixed(2)),
    newestAt: newest.record.at,
    holder: newest.record.holder ?? null,
    cycle: newest.record.cycle ?? null,
    claims: timed.length,
    claimsLast48h: timed.filter((t) => now - t.at <= 48 * HOUR_MS).length,
  };
}

/** Read the register from the remote register branch. `null` tip means no branch at all. */
export function readRemoteRegister(repoRoot, remote) {
  const tip = fetchTip(repoRoot, remote);
  if (!tip) return { tip: null, records: null };
  return { tip, records: parseRegister(readRegisterRaw(repoRoot, tip)) };
}

function parseArgs(argv) {
  const flags = Object.create(null);
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    if (key === "json") flags.json = true;
    else flags[key] = argv[++i];
  }
  return flags;
}

function appendOutputs(verdict) {
  const file = process.env.GITHUB_OUTPUT;
  if (!file) return;
  const lines = [
    `ok=${verdict.ok}`,
    `reason=${verdict.reason}`,
    `stale_since=${verdict.newestAt ?? ""}`,
    `age_hours=${verdict.ageHours ?? ""}`,
    `holder=${verdict.holder ?? ""}`,
    `cycle=${verdict.cycle ?? ""}`,
    `claims_last_48h=${verdict.claimsLast48h ?? ""}`,
  ];
  fs.appendFileSync(file, `${lines.join("\n")}\n`);
}

// Only runs as a CLI; importing this module for its pure parts must not touch git.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const flags = parseArgs(process.argv.slice(2));
  const repoRoot = flags.repo
    ? path.resolve(flags.repo)
    : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const remote = flags.remote ?? "origin";
  const resource = flags.resource ?? DEFAULT_RESOURCE;
  const maxAgeMs = Number(flags["max-age-hours"] ?? DEFAULT_MAX_AGE_HOURS) * HOUR_MS;
  const now = flags.now ? Date.parse(flags.now) : Date.now();

  let verdict;
  try {
    const { tip, records } = readRemoteRegister(repoRoot, remote);
    verdict =
      records === null
        ? {
            resource,
            now: new Date(now).toISOString(),
            maxAgeMs,
            ok: false,
            reason: "no-register-branch",
            branch: CLAIM_BRANCH,
          }
        : { ...evaluateLiveness(records, { resource, now, maxAgeMs }), tip };
  } catch (err) {
    // A register that cannot be read is indistinguishable from a loop that is not
    // running, and both need the same person to look. Never exit 0 on an exception.
    verdict = {
      resource,
      now: new Date(now).toISOString(),
      maxAgeMs,
      ok: false,
      reason: "register-unreadable",
      error: String(err && err.message ? err.message : err),
    };
  }

  appendOutputs(verdict);

  if (flags.json) {
    console.log(JSON.stringify(verdict, null, 2));
  } else if (verdict.ok) {
    console.log(
      `LIVE  ${verdict.resource} — newest claim ${verdict.newestAt} ` +
        `(${verdict.ageHours}h ago, holder ${verdict.holder}, cycle ${verdict.cycle}); ` +
        `${verdict.claimsLast48h} claim(s) in the last 48h, threshold ${maxAgeMs / HOUR_MS}h`,
    );
  } else {
    console.log(`STALE ${verdict.resource} — ${verdict.reason}`);
    // `ageHours` is absent on the fail-closed paths that never got as far as an age
    // (no branch, no claims, a corrupt or future timestamp). Printing "undefinedh ago"
    // there reads as a broken watchdog at the exact moment its output matters most.
    if (verdict.newestAt) {
      const age = verdict.ageHours === undefined ? "" : ` (${verdict.ageHours}h ago)`;
      console.log(`  newest claim: ${verdict.newestAt}${age}`);
    }
    if (verdict.error) console.log(`  error: ${verdict.error}`);
    console.log(`  threshold: ${maxAgeMs / HOUR_MS}h`);
    console.log(
      `::error title=Executor loop is not firing::${verdict.reason}` +
        (verdict.newestAt
          ? ` — newest executor claim ${verdict.newestAt}` +
            (verdict.ageHours === undefined ? "" : `, ${verdict.ageHours}h ago`)
          : ""),
    );
  }

  process.exit(verdict.ok ? 0 : 1);
}
