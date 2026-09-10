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
// AND THE PART RUN 147 GOT WRONG, MEASURED BY RUN 148 SIX HOURS LATER. The paragraph that
// used to sit here called the delivery delay a residual and sized it at "~2h" from
// assumption. It is not a residual. Across the 30 most recent scheduled firings of
// `metrics snapshot` in this repository, delivery lag — `run_started_at` minus the cron
// instant — reads:
//
//   2026-08-18 … 2026-08-25   0.22h … 0.36h      (8 firings, all under 22 minutes)
//   2026-08-27 … 2026-09-10   1.56h … 4.48h      (21 firings, median 2.14h, none under 1.5h)
//
// Something changed on 2026-08-26 and has held for two weeks. Nothing in this repository
// recorded it, because no check in this repository had ever cared what time it ran.
//
// A LATE CHECK READS AN AGE THAT IS TOO LARGE, NEVER TOO SMALL. So the wall-clock age is
// biased upward by the lag, and the one-miss/two-miss separation run 147 derived does not
// survive it: a single missed firing on an 18h gap, read by a check delivered 2.14h late,
// is an age of 20.1h — over the 20h threshold. At the measured median this watchdog pages
// the owner on ONE lost run, which is the exact thing run 147 chose the threshold to avoid,
// on the grounds that paging on a blip trains the owner to ignore the alarm.
//
// THE FIX IS TO STOP ASKING THE WALL CLOCK THE QUESTION THAT MATTERS. There are two
// verdicts here now, and only one of them can be poisoned by a late delivery:
//
//   1. MISSED RUNS — the gap between two CONSECUTIVE CLAIMS in the register exceeds
//      MAX_GAP_HOURS (20h). Both endpoints are register timestamps, so this reading is
//      identical whether the check runs on time, four hours late, or a day later. It is
//      exact, and 20h is run 147's derivation applied where the derivation is actually
//      true. It is also the only half that can see an outage which has already ENDED —
//      the gap stays in the register, so a sampler that slept through the whole thing
//      still finds it.
//
//   2. STALE — the loop is quiet RIGHT NOW: `now` minus the newest claim exceeds
//      MAX_AGE_HOURS. This one does read the wall clock, so its threshold has to absorb
//      the lag: 18h (worst one-miss gap) + 4.48h (worst measured lag) = 22.5h, rounded to
//      23h, still under the 24h at which a two-miss outage recovers on its own. Its job is
//      to catch an outage EARLY, while it is open; verdict 1 is what guarantees the outage
//      is caught at all.
//
// Neither subsumes the other, which is why both are here: 1 cannot see an outage that has
// not ended yet, and 2 cannot be trusted at a threshold tight enough to be prompt.
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
// Options: --max-age-hours N  --max-gap-hours N  --gap-lookback-hours N  --gap-watch-from ISO
//          --resource NAME  --remote NAME  --now ISO  --json  --repo PATH

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

// Wall-clock staleness. Sized to absorb the measured delivery lag: 18h is the longest gap
// a single missed firing can produce, 4.48h is the worst lag observed across 21 consecutive
// firings, and 23h clears their sum while staying under the 24h at which a two-miss outage
// recovers by itself. Raised from 20h by run 148 — see the header.
export const DEFAULT_MAX_AGE_HOURS = 23;

// Register-to-register. Both endpoints are claim timestamps, so no delivery lag can move
// this number: 20h sits above every one-miss gap (12h, 18h) and below every two-miss gap
// (24h), exactly as run 147 derived, and here the derivation actually holds.
export const DEFAULT_MAX_GAP_HOURS = 20;

// A gap never leaves an append-only register, so without a lookback the first outage would
// redden this check forever and the signal would be worth nothing. 48h is long enough that
// an hourly check delivered up to ~4.5h late still sees the gap many times over, and short
// enough that a handled incident stops shouting.
export const DEFAULT_GAP_LOOKBACK_HOURS = 48;

// The watchdog reports outages that began after it existed. Run 147's own claim, the first
// one appended while this file was on master; the 66-hour gap before it is the outage that
// caused this file to be written, is on issue #1 already, and must not be re-raised as news.
export const GAP_WATCH_FROM = "2026-09-10T04:07:16.828Z";

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
export function evaluateLiveness(
  records,
  {
    resource = DEFAULT_RESOURCE,
    now,
    maxAgeMs,
    maxGapMs = DEFAULT_MAX_GAP_HOURS * HOUR_MS,
    gapLookbackMs = DEFAULT_GAP_LOOKBACK_HOURS * HOUR_MS,
    gapWatchFromMs = Date.parse(GAP_WATCH_FROM),
  } = {},
) {
  const base = { resource, now: new Date(now).toISOString(), maxAgeMs, maxGapMs };

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
  const gap = findMissedRuns(timed, { now, maxGapMs, gapLookbackMs, gapWatchFromMs });

  const common = {
    ...base,
    ageMs,
    ageHours: Number((ageMs / HOUR_MS).toFixed(2)),
    newestAt: newest.record.at,
    holder: newest.record.holder ?? null,
    cycle: newest.record.cycle ?? null,
    claims: timed.length,
    claimsLast48h: timed.filter((t) => now - t.at <= 48 * HOUR_MS).length,
    gap,
  };

  // An outage that is still open outranks one that has ended: it is the one where the next
  // scheduled run is also going to be lost, so it is the one the owner has to act on now.
  if (ageMs > maxAgeMs) return { ...common, ok: false, reason: "stale", alarmKey: newest.record.at };
  if (gap) return { ...common, ok: false, reason: "missed-runs", alarmKey: gap.from };
  return { ...common, ok: true, reason: "live", alarmKey: null };
}

/**
 * The most recent completed outage the register can prove: consecutive claims more than
 * `maxGapMs` apart, the gap beginning at or after `gapWatchFromMs` and ending within
 * `gapLookbackMs` of now. Both endpoints are register timestamps, so this verdict does not
 * move when the check itself is delivered late — which is the whole reason it exists.
 */
function findMissedRuns(timed, { now, maxGapMs, gapLookbackMs, gapWatchFromMs }) {
  for (let i = timed.length - 1; i > 0; i--) {
    const from = timed[i - 1];
    const to = timed[i];
    if (from.at < gapWatchFromMs) return null; // sorted, so everything earlier is older still
    if (now - to.at > gapLookbackMs) return null;
    const gapMs = to.at - from.at;
    if (gapMs > maxGapMs) {
      return {
        from: from.record.at,
        to: to.record.at,
        gapMs,
        gapHours: Number((gapMs / HOUR_MS).toFixed(2)),
        fromHolder: from.record.holder ?? null,
        toHolder: to.record.holder ?? null,
      };
    }
  }
  return null;
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
    // The dedupe key, and deliberately not `stale_since`: for a completed outage the stable
    // identifier is the last claim BEFORE the gap, which never changes once the loop
    // recovers, whereas the newest claim does. One comment per outage needs the former.
    `alarm_key=${verdict.alarmKey ?? verdict.newestAt ?? "unknown"}`,
    `stale_since=${verdict.newestAt ?? ""}`,
    `age_hours=${verdict.ageHours ?? ""}`,
    `holder=${verdict.holder ?? ""}`,
    `cycle=${verdict.cycle ?? ""}`,
    `claims_last_48h=${verdict.claimsLast48h ?? ""}`,
    `gap_from=${verdict.gap?.from ?? ""}`,
    `gap_to=${verdict.gap?.to ?? ""}`,
    `gap_hours=${verdict.gap?.gapHours ?? ""}`,
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
  const maxGapMs = Number(flags["max-gap-hours"] ?? DEFAULT_MAX_GAP_HOURS) * HOUR_MS;
  const gapLookbackMs = Number(flags["gap-lookback-hours"] ?? DEFAULT_GAP_LOOKBACK_HOURS) * HOUR_MS;
  const gapWatchFromMs = Date.parse(flags["gap-watch-from"] ?? GAP_WATCH_FROM);
  const now = flags.now ? Date.parse(flags.now) : Date.now();
  const opts = { resource, now, maxAgeMs, maxGapMs, gapLookbackMs, gapWatchFromMs };

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
        : { ...evaluateLiveness(records, opts), tip };
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
        `${verdict.claimsLast48h} claim(s) in the last 48h, thresholds ` +
        `${maxAgeMs / HOUR_MS}h age / ${maxGapMs / HOUR_MS}h gap`,
    );
  } else {
    console.log(`STALE ${verdict.resource} — ${verdict.reason}`);
    if (verdict.gap) {
      console.log(
        `  missed runs: ${verdict.gap.gapHours}h between ${verdict.gap.from} ` +
          `and ${verdict.gap.to}`,
      );
    }
    // `ageHours` is absent on the fail-closed paths that never got as far as an age
    // (no branch, no claims, a corrupt or future timestamp). Printing "undefinedh ago"
    // there reads as a broken watchdog at the exact moment its output matters most.
    if (verdict.newestAt) {
      const age = verdict.ageHours === undefined ? "" : ` (${verdict.ageHours}h ago)`;
      console.log(`  newest claim: ${verdict.newestAt}${age}`);
    }
    if (verdict.error) console.log(`  error: ${verdict.error}`);
    console.log(`  thresholds: ${maxAgeMs / HOUR_MS}h age / ${maxGapMs / HOUR_MS}h gap`);
    console.log(
      `::error title=Executor loop is not firing::${verdict.reason}` +
        (verdict.gap ? ` — ${verdict.gap.gapHours}h with no run, ending ${verdict.gap.to}` : "") +
        (verdict.newestAt
          ? ` — newest executor claim ${verdict.newestAt}` +
            (verdict.ageHours === undefined ? "" : `, ${verdict.ageHours}h ago`)
          : ""),
    );
  }

  process.exit(verdict.ok ? 0 : 1);
}
