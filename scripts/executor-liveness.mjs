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
// starts and then fails still leaves the claim, so for its first two verdicts the watchdog
// is measuring "did a session begin", not "did a session succeed".
//
// That sentence used to end the paragraph, and run 161 is what it cost — see
// ABANDON_WATCH_FROM below. The register also records how a run ENDED, because release is
// its last step, and a third verdict now reads that: a claim whose lease expired with no
// release is a run that stopped mid-sequence, and the execution report it owed issue #1 is
// therefore in doubt. Same input, same file, no new source.
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
//          --abandon-lookback-hours N  --abandon-watch-from ISO
//          --resource NAME  --remote NAME  --now ISO  --json  --repo PATH

import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
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

// THE THIRD WAY A RUN CAN BE LOST, AND THE ONE THE FIRST TWO CANNOT SEE.
//
// Both verdicts above ask whether a run STARTED. Neither asks whether it FINISHED, and the
// file said so in as many words: "a run that starts and then fails still leaves the claim;
// the watchdog is deliberately measuring 'did a session begin', not 'did a session
// succeed'." Run 161 is what that costs.
//
// At 2026-09-14T22:03:52.483Z it claimed cycle 2026-09-15/w08 as vm:1935. At 22:17:11Z it
// pushed 619535f to master; `check` 274 went green at 22:18:04Z. Then it stopped. It never
// appended a release, and it never posted its execution report to issue #1 — the one
// artifact the reviewer reads and the one this loop's own CLAUDE.md makes mandatory for
// every run. The watchdog was green throughout, correctly by its own definition: the claim
// was 1.9h old, and the second source found a commit, which is corroboration that the loop
// RAN. The two existing verdicts get quieter, not louder, on this failure.
//
// So the next run read issue #1, found run 160's report newest, and had no way to know from
// that record that a run had happened at all — which is the duplicate-implementation
// failure of PRs #7/#8 and #9/#10 arriving through a different door. Not two concurrent
// sessions, which the lock stops, but one session invisible to its successor, which nothing
// did.
//
// THE EVIDENCE WAS ALREADY IN THE FILE THIS SCRIPT ALREADY READS. Release is the last step
// of a run, after the report: the two most recent completed runs released 3 seconds after
// their report comment (run 159, report 04:19:46Z / release 04:19:49.309Z; run 160,
// 10:20:13Z / 10:20:15.972Z), and CLAUDE.md puts it last in so many words — "at the end of
// the run, whatever happened". So a claim whose lease has expired with no release is a run
// that did not reach its own closing sequence, and its report is therefore in doubt. That
// is a stronger and earlier signal than the missing comment itself, and it needs no GitHub
// API, no pairing heuristic and no second network source: 35 of the register's 37 claims
// released `completed`, the only exceptions being run 161 and whichever run is in flight.
//
// TWO PLACES ALREADY KNEW AND NEITHER COULD SPEAK. `releasedAt()` below falls back to the
// claim when no release exists and calls that case "what an abandoned lease looks like" in
// a comment, using it only to position an interval. And run-claim's own `evaluate()`
// computes `takeover-stale` from exactly this shape — but only for claims in the CURRENT
// cycle, because all it is deciding is whether this run may seize the lock. Run 161's claim
// was cycle 2026-09-15/w08 and the next run's was w14, so it was stepped over in silence.
// The register held the fact from 23:33:52Z onward and nothing was built to report it.
export const DEFAULT_ABANDON_LOOKBACK_HOURS = 48;

// Same floor, same reason as GAP_WATCH_FROM, and it is load-bearing rather than tidy: run
// 161's abandonment is reported in run 162's execution report on issue #1, so the instrument
// written because of it must not then re-raise it as news. This is run 162's own claim — the
// first appended while this verdict existed — which means the check begins by watching the
// run that shipped it.
export const ABANDON_WATCH_FROM = "2026-09-15T04:03:07.863Z";

// The watchdog clock and the claim clock are different machines. Five minutes is well
// under the threshold's slack and well over any plausible runner skew, so it separates
// "clocks disagree slightly" from "this timestamp is wrong", which is a corrupt register
// and must fail rather than be treated as the freshest possible claim.
export const CLOCK_SKEW_MS = 5 * 60_000;

const HOUR_MS = 3_600_000;

// THE SECOND SOURCE, AND WHY A WATCHDOG WITH ONE SOURCE WAS THE DEFECT.
//
// Until 2026-09-13 this file had exactly one input — the claims register — and one name,
// `missed-runs`, for what silence in it meant. Silence has two causes and they call for
// opposite actions by the owner:
//
//   no executor session ran            -> the routine is down. Restart it.
//   a session ran and did not claim    -> the routine is fine. The protocol is not.
//
// Runs 155 and 156 produced the second on 2026-09-12/13: two sessions, eight commits, two
// execution reports on issue #1, and no claim between 2026-09-12T10:05:31.690Z and this
// file's next reading. The register was right, the verdict name was not, and the alarm was
// one hour from telling the owner "24.02h with no run at all" and "check that the routine
// is enabled and firing" — both false. See issue #1 and ops/LESSONS.md L-75.
//
// Run 147 already knew the discriminator and found the real 2026-09-07 outage with it by
// hand: *"no execution report between run 146 and this one, and no `Claude`-authored commit
// on `master` in that interval, both of which agree with the register"*. The instrument
// built afterwards never learned it. This is that check, moved into the instrument.
//
// WHY COMMIT TRAILERS AND NOT THE AUTHOR LINE. `executor liveness`'s own workflow header
// names the confound: `metrics snapshot` commits twice a day under an author line that
// looks like the executor's, which is why the repository looked busy right through the
// 2026-09-07 outage. A `Claude-Session:` trailer is written by an executor session and by
// nothing else on this repository, and it additionally names *which* session, so two runs
// inside one gap are visible as two rather than as a blur of commits.
//
// WHY THIS DOES NOT WEAKEN THE WATCHDOG, WHICH IS THE PROPERTY THAT MATTERS. Corroboration
// only ever renames an outage; it can never clear one. `unclaimed-runs` and
// `unclaimed-stale` are `ok: false`, alarm on the same key, and fail the job exactly as
// their claimless counterparts do. A test asserts that no activity value turns any
// not-`ok` verdict into an `ok` one, because a watchdog that can be talked out of alarming
// by the thing it watches is not a watchdog.

/** Executor sessions that committed to `ref` inside an interval, as independent evidence
 *  that the loop ran. `null` when git cannot answer — an unavailable second source must
 *  leave the register's own verdict standing, never soften it.
 *
 *  `--since`/`--until` filter on committer date while the returned `%aI` is the author
 *  date; the two differ by seconds here but the window is re-applied in JS against the
 *  date actually reported, so the boundary is exact rather than nearly. */
/** `git` stdout, or `null` when it cannot run or the ref does not resolve. Never throws:
 *  every caller here treats "git did not answer" as "no evidence", and an exception out of
 *  a watchdog's corroborator would take down the check it is meant to inform. */
function gitOut(cwd, args) {
  try {
    return execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 30_000,
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

export function executorActivity(repoRoot, { fromMs, toMs, ref = "origin/master" } = {}) {
  // A TRUNCATED HISTORY ANSWERS "NOTHING" AND IT SOUNDS EXACTLY LIKE "THE LOOP WAS DOWN".
  //
  // `actions/checkout@v4` fetches depth 1 by default, so the first version of this ran green
  // on every local test and returned `{commits: 0}` on every real firing — the corroborator
  // would have been inert in the only place it matters, and its silence would have restored
  // the precise false alarm it was written to remove. Caught by CI on the commit that added
  // it and reproduced with `git clone --depth 1`. Fixed on both sides: the workflow checks
  // out full history, and a repository that cannot see far enough back returns `null` —
  // "cannot answer" — rather than an absence it has not established. `corroborated` carries
  // that into the comment, which then says the second source was not consulted instead of
  // asserting that two sources agreed.
  //
  // The question is NOT "is this clone shallow", which was the first fix and was wrong in
  // the expensive direction: this session's own checkout is shallow at 52 commits and still
  // reaches four days past the window being asked about, so that test threw away a correct
  // answer. It is whether the history reaches back to the start of the interval, which is
  // the property actually required and is the same test for a shallow and a full clone.
  const oldest = gitOut(repoRoot, ["log", ref, "--format=%aI"]);
  if (oldest === null) return null;
  const lines = oldest.trim().split("\n").filter(Boolean);
  const earliest = Date.parse(lines[lines.length - 1] ?? "");
  if (!Number.isFinite(earliest) || earliest > fromMs) return null;

  const out = gitOut(repoRoot, [
    "log",
    ref,
    `--since=${new Date(fromMs - HOUR_MS).toISOString()}`,
    `--until=${new Date(toMs + HOUR_MS).toISOString()}`,
    "--format=%H%x1f%aI%x1f%(trailers:key=Claude-Session,valueonly=true)%x1e",
  ]);
  if (out === null) return null;

  const sessions = new Set();
  let commits = 0;
  let first = null;
  let last = null;
  for (const entry of out.split("\x1e")) {
    const [sha, at, trailer] = entry.trim().split("\x1f");
    if (!sha || !at) continue;
    const session = (trailer ?? "").trim();
    if (!session) continue; // `metrics snapshot` and anything else that is not a session
    const t = Date.parse(at);
    if (!Number.isFinite(t) || t <= fromMs || t >= toMs) continue;
    commits += 1;
    sessions.add(session);
    if (first === null || t < first) first = t;
    if (last === null || t > last) last = t;
  }
  if (commits === 0) return { commits: 0, sessions: [], first: null, last: null };
  return {
    commits,
    sessions: [...sessions],
    first: new Date(first).toISOString(),
    last: new Date(last).toISOString(),
  };
}

/**
 * Pure verdict over an already-parsed register. Every non-`live` outcome is a failure;
 * `reason` distinguishes them so the alarm can say which one without re-deriving it.
 *
 * `activityIn(fromMs, toMs)` is the optional second source above. Omitted, this function
 * behaves exactly as it did before it existed.
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
    abandonLookbackMs = DEFAULT_ABANDON_LOOKBACK_HOURS * HOUR_MS,
    abandonWatchFromMs = Date.parse(ABANDON_WATCH_FROM),
    activityIn = () => null,
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

  /** When the silence a claim is followed by actually begins.
   *
   *  NOT the claim itself, and the difference is a number the alarm would otherwise
   *  overstate. A run commits *after* claiming, so the interval `[claim, next claim)`
   *  contains the claiming run's own work: read against the real register on 2026-09-13
   *  that window reported "3 sessions ran anyway" when two of the three had skipped step 0
   *  and the third — run 154 — had claimed properly and simply committed afterwards. The
   *  interval in which a run should have claimed and did not begins when the previous
   *  holder let go of the lock. Falls back to the claim when no release was appended,
   *  which is itself what an abandoned lease looks like. */
  const releasedAt = (record) =>
    findRelease(records, resource, record?.nonce) ?? Date.parse(record?.at);

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
  //
  // Each shape asks the second source about its OWN interval — the open silence runs from
  // the newest claim to now, the closed gap between its two endpoints — and a `ran` answer
  // only changes the name. `ok` stays false on every branch below.
  if (ageMs > maxAgeMs) {
    const activity = ran(activityIn, releasedAt(newest.record), now);
    return {
      ...common,
      ok: false,
      reason: activity ? "unclaimed-stale" : "stale",
      activity,
      alarmKey: newest.record.at,
    };
  }
  // ABOVE THE GAP VERDICTS AND BELOW `stale`, AND THE ORDER WAS WRONG FIRST TIME. My first
  // version put this last, on the reasoning that a run which finished nothing is better news
  // than runs that never started. Read against the live register that reasoning shipped the
  // hole it was closing: `missed-runs` was already red on the known 2026-09-12/13 gap, which
  // outranks and so silences everything below it for its 48h lookback — and run 161's
  // abandonment falls inside that window. The check written because run 161 was invisible
  // would have left run 161 invisible.
  //
  // So the ordering is by what is still actionable, not by severity. `stale` means the loop
  // is down NOW and the next firing is going to be lost too: the owner has to act, and it
  // stays first. A gap is an outage that has ENDED — its own alarm text opens "the loop has
  // since recovered", the register will still hold it next hour, and its comment has already
  // been posted. An abandoned run is a record that is broken right now, with a repair that
  // belongs to the next run. Fresh and fixable outranks historical and recorded.
  //
  // Masking is not eliminated, only reordered, and `gap` stays populated in the verdict and
  // in the workflow outputs on this branch, so the fact is never lost even when it is not
  // the headline. The second source is not consulted here at all: a claim plus an expired
  // lease already establishes the run ran, and corroboration could only restate it.
  const abandoned = findAbandonedRun(timed, records, {
    now,
    resource,
    abandonLookbackMs,
    abandonWatchFromMs,
  });
  if (abandoned?.kind === "corrupt-lease") {
    return {
      ...common,
      ok: false,
      reason: "unparseable-lease",
      offender: abandoned.offender,
      alarmKey: abandoned.offender,
    };
  }
  if (abandoned) {
    return { ...common, ok: false, reason: "abandoned-run", abandoned, alarmKey: abandoned.at };
  }
  if (gap) {
    const activity = ran(activityIn, releasedAt(gap.fromRecord), Date.parse(gap.to));
    return {
      ...common,
      ok: false,
      reason: activity ? "unclaimed-runs" : "missed-runs",
      activity,
      alarmKey: gap.from,
    };
  }
  return { ...common, ok: true, reason: "live", alarmKey: null };
}

/** The second source's answer, or `null` for "it did not answer" and for "it answered, and
 *  there was nothing" — which must read the same, because neither is evidence the loop ran.
 *  A corroborator that throws is treated as absent rather than allowed to crash the check. */
function ran(activityIn, fromMs, toMs) {
  let activity;
  try {
    activity = activityIn(fromMs, toMs);
  } catch {
    return null;
  }
  return activity && activity.commits > 0 ? activity : null;
}

/** When `nonce`'s lease was released, or `null` for "no release was ever appended". One
 *  implementation, because two callers now ask the same question for opposite reasons:
 *  `releasedAt()` wants the instant so it can position an interval and treats a missing
 *  release as a soft fallback, and `findAbandonedRun()` treats the same absence as the
 *  finding itself. A release whose own timestamp will not parse is not a release. */
function findRelease(records, resource, nonce) {
  if (!nonce) return null;
  for (const r of records) {
    if (r && r.event === "release" && r.resource === resource && r.nonce === nonce) {
      const t = Date.parse(r.at);
      if (Number.isFinite(t)) return t;
    }
  }
  return null;
}

/**
 * The most recent run that claimed the lock and never let go of it: a claim at or after
 * `abandonWatchFromMs` whose lease has expired with no release appended, the expiry falling
 * within `abandonLookbackMs` of now.
 *
 * WHY THE LEASE AND NOT THE CLOCK. A run legitimately holds the lock for its whole cycle, so
 * "no release yet" says nothing until the lease it was granted has run out — 90 minutes by
 * `DEFAULT_TTL_SECONDS`, and read from the record rather than assumed, because the TTL is a
 * claim-time argument and a future run may pass a different one. Both endpoints are register
 * values, so delivery lag cannot move the verdict; only the `now` comparison can be late,
 * and late in the safe direction.
 *
 * FAIL CLOSED ON A LEASE IT CANNOT READ. A watched claim carrying no usable `ttlSeconds` is a
 * corrupt register, not a healthy run: it returns `corrupt-lease` rather than being skipped,
 * because skipping is how a check comes to sweep an empty set and pass (L-61). Only watched
 * claims are parsed this way — a legacy record predating the field cannot redden the check
 * forever, because it is below the floor and never reached.
 */
function findAbandonedRun(
  timed,
  records,
  { now, resource, abandonLookbackMs, abandonWatchFromMs },
) {
  for (let i = timed.length - 1; i >= 0; i--) {
    const { at, record } = timed[i];
    if (at < abandonWatchFromMs) return null; // sorted, so everything earlier is older still
    if (findRelease(records, resource, record.nonce) !== null) continue;

    const ttlSeconds = record.ttlSeconds;
    if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
      return { kind: "corrupt-lease", offender: record.at, holder: record.holder ?? null };
    }
    const leaseEndMs = at + ttlSeconds * 1000;
    if (leaseEndMs + CLOCK_SKEW_MS > now) continue; // still inside its lease: in flight, not lost
    if (now - leaseEndMs > abandonLookbackMs) return null;

    return {
      kind: "abandoned",
      at: record.at,
      holder: record.holder ?? null,
      cycle: record.cycle ?? null,
      nonce: record.nonce ?? null,
      leaseEndAt: new Date(leaseEndMs).toISOString(),
      leaseHours: Number((ttlSeconds / 3600).toFixed(2)),
      sinceHours: Number(((now - leaseEndMs) / HOUR_MS).toFixed(2)),
    };
  }
  return null;
}

/** Verdicts in which the loop demonstrably ran and did not claim. The owner action for
 *  these is the opposite of the one for an outage, so nothing may treat them as the same
 *  thing by string-matching a prefix. */
export const UNCLAIMED_REASONS = new Set(["unclaimed-runs", "unclaimed-stale"]);

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
      const found = {
        from: from.record.at,
        to: to.record.at,
        gapMs,
        gapHours: Number((gapMs / HOUR_MS).toFixed(2)),
        fromHolder: from.record.holder ?? null,
        toHolder: to.record.holder ?? null,
      };
      // The opening claim itself, so the caller can find its release and ask the second
      // source about the silence rather than about the claiming run's own commits. Attached
      // non-enumerably because `gap` is serialised straight into the `--json` verdict: this
      // is a handle for one call site, not a field for a reader.
      return Object.defineProperty(found, "fromRecord", {
        value: from.record,
        enumerable: false,
      });
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
    // The abandoned run, so the alarm can name which cycle stopped mid-sequence without
    // re-reading the register. Empty on every other verdict.
    `abandoned_at=${verdict.abandoned?.at ?? ""}`,
    `abandoned_holder=${verdict.abandoned?.holder ?? ""}`,
    `abandoned_cycle=${verdict.abandoned?.cycle ?? ""}`,
    `abandoned_lease_end=${verdict.abandoned?.leaseEndAt ?? ""}`,
    `abandoned_since_hours=${verdict.abandoned?.sinceHours ?? ""}`,
    // The second source, so the alarm can name the right defect and the right owner action
    // without re-deriving either. Empty on every verdict where the loop did not run.
    `unclaimed=${UNCLAIMED_REASONS.has(verdict.reason)}`,
    // Whether the second source was CONSULTED, which is not the same as whether it found
    // anything and is not implied by `unclaimed=false`. The fail-closed verdicts — no
    // register branch, unreadable, empty, no claims, a corrupt or future timestamp — never
    // reach it, because there is no interval to ask about. Without this the alarm would say
    // "no executor session committed in that interval either" on exactly the runs where
    // nothing had been asked.
    `corroborated=${Object.prototype.hasOwnProperty.call(verdict, "activity")}`,
    `activity_commits=${verdict.activity?.commits ?? ""}`,
    `activity_sessions=${verdict.activity?.sessions?.length ?? ""}`,
    `activity_first=${verdict.activity?.first ?? ""}`,
    `activity_last=${verdict.activity?.last ?? ""}`,
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
  const abandonLookbackMs =
    Number(flags["abandon-lookback-hours"] ?? DEFAULT_ABANDON_LOOKBACK_HOURS) * HOUR_MS;
  const abandonWatchFromMs = Date.parse(flags["abandon-watch-from"] ?? ABANDON_WATCH_FROM);
  const now = flags.now ? Date.parse(flags.now) : Date.now();
  const activityRef = flags["activity-ref"] ?? `${remote}/master`;
  const opts = {
    resource,
    now,
    maxAgeMs,
    maxGapMs,
    gapLookbackMs,
    gapWatchFromMs,
    abandonLookbackMs,
    abandonWatchFromMs,
    activityIn: (fromMs, toMs) => executorActivity(repoRoot, { fromMs, toMs, ref: activityRef }),
  };

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
    const unclaimed = UNCLAIMED_REASONS.has(verdict.reason);
    // Three labels, not two. A run that stopped mid-sequence is neither an outage nor a
    // skipped step 0, and printing "STALE" over it is the 2026-09-13 defect — one headline
    // for two failures with opposite actions — repeated in the line a reader sees first.
    const label = verdict.abandoned ? "ABANDONED" : unclaimed ? "UNCLAIMED" : "STALE";
    console.log(`${label} ${verdict.resource} — ${verdict.reason}`);
    if (verdict.abandoned) {
      console.log(
        `  run ${verdict.abandoned.cycle} (${verdict.abandoned.holder}) claimed ` +
          `${verdict.abandoned.at} and never released: its ${verdict.abandoned.leaseHours}h ` +
          `lease expired ${verdict.abandoned.leaseEndAt}, ${verdict.abandoned.sinceHours}h ago`,
      );
      console.log(
        "  release is the last step of a run, after the execution report — so that report is " +
          "in doubt and issue #1 needs checking",
      );
    }
    if (verdict.gap) {
      console.log(
        `  ${unclaimed ? "unclaimed" : "missed"} runs: ${verdict.gap.gapHours}h between ` +
          `${verdict.gap.from} and ${verdict.gap.to}`,
      );
    }
    if (verdict.activity) {
      console.log(
        `  the loop DID run in that interval: ${verdict.activity.commits} commit(s) from ` +
          `${verdict.activity.sessions.length} session(s), ${verdict.activity.first} … ` +
          `${verdict.activity.last} — the routine is firing and step 0 is being skipped`,
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
    // The title is the line a reader sees in the Actions UI without opening anything, so it
    // has to carry the fact that decides what they do next. "Executor loop is not firing"
    // on a loop that is firing is the false half of the 2026-09-13 alarm, restated where it
    // would be read fastest.
    console.log(
      `::error title=${
        verdict.abandoned
          ? "Executor run stopped without finishing"
          : unclaimed
            ? "Executor loop is running without claiming"
            : "Executor loop is not firing"
      }::${verdict.reason}` +
        (verdict.abandoned
          ? ` — cycle ${verdict.abandoned.cycle} (${verdict.abandoned.holder}) claimed ${verdict.abandoned.at}` +
            `, lease expired ${verdict.abandoned.leaseEndAt} with no release`
          : "") +
        (verdict.gap
          ? ` — ${verdict.gap.gapHours}h ${unclaimed ? "with no claim" : "with no run"}, ending ${verdict.gap.to}`
          : "") +
        (verdict.activity
          ? ` — ${verdict.activity.commits} commit(s) from ${verdict.activity.sessions.length} session(s) in that interval`
          : "") +
        (verdict.newestAt
          ? ` — newest executor claim ${verdict.newestAt}` +
            (verdict.ageHours === undefined ? "" : `, ${verdict.ageHours}h ago`)
          : ""),
    );
  }

  process.exit(verdict.ok ? 0 : 1);
}
