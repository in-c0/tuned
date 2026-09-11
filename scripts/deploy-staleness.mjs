#!/usr/bin/env node
// Is production serving the code that is on master? Nothing answered that between pushes.
//
// WHY THIS EXISTS, AND WHY IT IS NOT THE SAME QUESTION `verify production` ANSWERS.
// `verify production` runs on push. It waits up to 8 minutes for the pushed commit to be
// the one serving and then fails closed. That is the right shape for a gate, and it is the
// wrong shape for a watchdog, for two reasons this repository has now produced evidence
// for on the same day:
//
//   1. NOTHING READS THE RED. On 2026-09-11 run 150 pushed `408db69` at 04:23:24Z, posted
//      its execution report at 04:24:18Z — 54 seconds after the verification started — and
//      the verification went red at 04:31:42Z having never seen `408db69` serve
//      (https://github.com/in-c0/tuned/actions/runs/34562017390). The report said the run
//      was "deployed and verified green". Nobody contradicted it for 5h34m, until run 151
//      happened to scroll the Actions list. The red existed the whole time and had no
//      reader; the loop is the only reader, and it had already moved on.
//
//   2. THE RED CANNOT SAY WHICH FAILURE IT IS. "The deploy never landed" and "the deploy
//      landed after the window closed" produce the identical reading, and the operating
//      rules prescribe ROLLBACK for the first. Obeying them at 04:31 on 2026-09-11 would
//      have reverted a production that was healthy and about to become current — `d53b0c0`
//      landed at 04:41 and contained `408db69`. A verdict that cannot distinguish the case
//      that needs a rollback from the case that needs nothing is not a verdict.
//
// WHAT THIS ASKS INSTEAD. One question, with no timeout in it: *does the build production
// is serving contain the newest commit on master that is old enough to have deployed by
// now?* That has an answer at every instant, not just in the minutes after a push. A build
// dropped at 04:23 and recovered by the next push at 04:41 is fresh when asked at 05:35. A
// build dropped and never recovered is stale at 05:35, at 06:35, and every hour after,
// which is what "page someone" should mean.
//
// THE GRACE PERIOD, DERIVED RATHER THAN PICKED. Across the 19 most recent successful
// push-triggered `verify production` runs (2026-09-05 … 2026-09-11) total job duration was
// 0.9–1.7 minutes, median 1.0 — every one matched the new build on its first or second
// probe, so Cloudflare Workers Builds normally has the commit serving inside a minute. The
// two failures in that window (2026-09-06 `ea902e1`, 2026-09-11 `408db69`) each burned the
// full 8-minute wait without landing at all. Deploys are therefore not long-tailed: they
// land in ~1 minute or they are dropped and wait for the next push. 90 minutes is ~90x the
// median and ~11x the longest unsuccessful wait ever observed here, so no healthy deploy
// can reach it, and the failure mode it is sized against — the 2026-08-27 incident, where
// three consecutive commits did not deploy and production served a ~19h-old build — is
// caught inside two hours instead of by whoever next reads a dashboard.
//
// WHY A LATE CHECK CANNOT POISON THIS, unlike the wall-clock half of the executor
// watchdog. Scheduled workflows in this repository have been delivered 1.6h–4.5h late on
// every firing since 2026-08-26 (measured in scripts/executor-liveness.mjs). A late
// delivery here does not bias the verdict in either direction: both sides of the
// comparison — which commit is due, and which commit is serving — are read at the moment
// the check runs. Lateness costs detection speed and nothing else.
//
// WHAT IT DELIBERATELY DOES NOT DO. It does not page when production cannot be read. A
// single unreachable probe from a runner is a blip, and run 148 shipped a watchdog that
// would have paged the owner on one; the lesson was that an alarm which cries on blips is
// an alarm the owner learns to ignore. `unreachable` fails the job so it is visible in the
// Actions list, and raises nothing on issue #1. The site actually being down is the
// question `verify production` answers, on every push and on its own daily schedule.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;

// See the header for the derivation. Expressed in minutes because the quantity it is sized
// against — build-to-deploy latency — is a minutes-scale number, and rounding it to hours
// would hide that it is 90x the median rather than a shrug.
export const DEFAULT_GRACE_MINUTES = 90;

// How much of master's first-parent line to read. Staleness only ever needs the commits
// newer than the serving build, and the worst incident on record was ~19h (≈6 commits at
// this repository's rate). 200 is far beyond any plausible drift and still one cheap
// `git log`.
export const DEFAULT_HISTORY = 200;

// A commit stamp is a fixed shape. Accepting only that shape means an old Worker's 404
// text, an HTML error page, a non-string commit or an empty body all read as "no stamp"
// rather than as some other commit — the same rule verify-production.yml applies, kept
// identical on purpose so the two readers cannot disagree about what production said.
const COMMIT_STAMP = /"commit"\s*:\s*"([0-9a-f]{7,40})"/;

/** The commit production reports, or null if the body does not carry one in the expected shape. */
export function parseServingCommit(body) {
  if (typeof body !== "string") return null;
  const m = COMMIT_STAMP.exec(body);
  return m ? m[1] : null;
}

/**
 * Pure verdict. `commits` is master's first-parent line, newest first, as
 * `{ sha, at }` with `at` an ISO timestamp.
 *
 * Ancestry is decided by position in that list rather than by asking git, which is exact
 * for a first-parent line: commit i is an ancestor of commit j precisely when i >= j. A
 * serving commit that is not on the line at all is not resolved by guessing — it gets its
 * own verdict, because a production Worker running something that is not on master is a
 * different problem from a production Worker running something old.
 */
export function evaluateDeployStaleness(
  serving,
  commits,
  { now, graceMs = DEFAULT_GRACE_MINUTES * MINUTE_MS } = {},
) {
  const base = {
    now: new Date(now).toISOString(),
    graceMinutes: graceMs / MINUTE_MS,
    serving: serving ?? null,
  };

  if (!Array.isArray(commits) || commits.length === 0) {
    return { ...base, ok: false, reason: "no-history", alarmKey: null };
  }

  const timed = [];
  for (const c of commits) {
    const at = Date.parse(c?.at);
    if (!c?.sha || !Number.isFinite(at)) {
      return { ...base, ok: false, reason: "unparseable-history", offender: c?.sha ?? null, alarmKey: null };
    }
    timed.push({ sha: c.sha, at, iso: c.at });
  }

  // `unreachable` outranks everything below it: with no stamp there is no comparison to
  // make, and inventing one from the age of master alone would report staleness on a site
  // that might be perfectly current. It fails the job and raises nothing — see the header.
  if (!serving) {
    return { ...base, ok: false, reason: "unreachable", alarmKey: null };
  }

  // The newest commit that has had a full grace period to reach production. Everything
  // newer than it is allowed to be missing; that is what makes this quiet between a push
  // and its deploy, without a timeout anywhere in the reading.
  const dueIndex = timed.findIndex((c) => c.at <= now - graceMs);
  if (dueIndex === -1) {
    // Every commit on master is younger than the grace period. Nothing is owed yet.
    return { ...base, ok: true, reason: "no-due-commit", newest: timed[0].sha, alarmKey: null };
  }
  const due = timed[dueIndex];

  const servingIndex = timed.findIndex((c) => c.sha === serving || c.sha.startsWith(serving));
  if (servingIndex === -1) {
    return {
      ...base,
      ok: false,
      reason: "unknown-serving",
      due: due.sha,
      dueAt: due.iso,
      alarmKey: `unknown:${serving}`,
    };
  }

  const common = {
    ...base,
    serving: timed[servingIndex].sha,
    servingAt: timed[servingIndex].iso,
    due: due.sha,
    dueAt: due.iso,
    behind: servingIndex - dueIndex,
  };

  // servingIndex <= dueIndex means the serving build is `due` itself or a descendant of it.
  if (servingIndex <= dueIndex) {
    return { ...common, ok: true, reason: "fresh", behind: 0, alarmKey: null };
  }

  const staleMs = now - due.at;
  return {
    ...common,
    ok: false,
    reason: "stale",
    staleMs,
    staleHours: Number((staleMs / HOUR_MS).toFixed(2)),
    // Keyed on the oldest undeployed commit, which stays constant for as long as the
    // outage lasts and changes the moment a different one is the blocker. One comment per
    // outage, exactly as the executor watchdog does it.
    alarmKey: due.sha,
  };
}

/** master's first-parent line, newest first. */
export function readMasterHistory(repoRoot, { remote = "origin", limit = DEFAULT_HISTORY } = {}) {
  const run = (args) =>
    execFileSync("git", ["-C", repoRoot, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

  // The checkout may predate a commit pushed since. Failure here is not fatal — the local
  // line is still a valid answer, just an older one, and a commit this run cannot see is
  // younger than the grace period by definition.
  try {
    run(["fetch", "--quiet", "--no-tags", remote, "master"]);
  } catch {
    /* offline or shallow; fall through to whatever the clone already has */
  }

  let ref = `${remote}/master`;
  try {
    run(["rev-parse", "--verify", "--quiet", ref]);
  } catch {
    ref = "HEAD";
  }

  const out = run(["log", "--first-parent", `--max-count=${limit}`, "--format=%H %cI", ref]);
  return out
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [sha, at] = line.split(" ");
      return { sha, at };
    });
}

function parseArgs(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) flags[key] = true;
    else {
      flags[key] = next;
      i += 1;
    }
  }
  return flags;
}

function appendOutputs(verdict) {
  const file = process.env.GITHUB_OUTPUT;
  if (!file) return;
  const lines = [
    `ok=${verdict.ok}`,
    `reason=${verdict.reason}`,
    `alarm_key=${verdict.alarmKey ?? ""}`,
    `serving=${verdict.serving ?? ""}`,
    `serving_at=${verdict.servingAt ?? ""}`,
    `due=${verdict.due ?? ""}`,
    `due_at=${verdict.dueAt ?? ""}`,
    `behind=${verdict.behind ?? ""}`,
    `stale_hours=${verdict.staleHours ?? ""}`,
    `grace_minutes=${verdict.graceMinutes ?? ""}`,
  ];
  fs.appendFileSync(file, `${lines.join("\n")}\n`);
}

// Only runs as a CLI; importing this module for its pure parts must not touch git.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const flags = parseArgs(process.argv.slice(2));
  const repoRoot = flags.repo
    ? path.resolve(flags.repo)
    : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const graceMs = Number(flags["grace-minutes"] ?? DEFAULT_GRACE_MINUTES) * MINUTE_MS;
  const now = flags.now ? Date.parse(flags.now) : Date.now();

  // The body is read from a file written by scripts/prod-http.sh rather than fetched here.
  // That keeps every production read in this repository under one request contract — an
  // honestly-identified first-party user agent, never a borrowed browser one — instead of
  // adding a second HTTP client with its own headers and its own way of being wrong.
  let serving = null;
  let readError = null;
  try {
    const status = String(flags.status ?? "");
    if (status && status !== "200") {
      readError = `production answered HTTP ${status}`;
    } else if (flags["version-file"]) {
      serving = parseServingCommit(fs.readFileSync(String(flags["version-file"]), "utf8"));
      if (!serving) readError = "response carried no build stamp";
    } else {
      readError = "no --version-file given";
    }
  } catch (err) {
    readError = String(err && err.message ? err.message : err);
  }

  let verdict;
  try {
    const commits = readMasterHistory(repoRoot, { remote: flags.remote ?? "origin" });
    verdict = evaluateDeployStaleness(serving, commits, { now, graceMs });
  } catch (err) {
    // A history that cannot be read means this check has no opinion, and a watchdog with
    // no opinion must not be green. It is not an alarm either: the owner's production is
    // not implicated by this runner's git failing.
    verdict = {
      now: new Date(now).toISOString(),
      graceMinutes: graceMs / MINUTE_MS,
      serving,
      ok: false,
      reason: "history-unreadable",
      error: String(err && err.message ? err.message : err),
      alarmKey: null,
    };
  }
  if (readError) verdict.readError = readError;

  appendOutputs(verdict);

  if (flags.json) {
    console.log(JSON.stringify(verdict, null, 2));
  } else if (verdict.ok) {
    console.log(
      `FRESH production serving ${verdict.serving ?? "(nothing due)"} — ${verdict.reason}` +
        (verdict.due ? `, contains ${verdict.due} (due since ${verdict.dueAt})` : "") +
        `; grace ${verdict.graceMinutes}m`,
    );
  } else {
    console.log(`STALE ${verdict.reason}`);
    if (verdict.serving) console.log(`  serving:  ${verdict.serving} (${verdict.servingAt ?? "unknown date"})`);
    if (verdict.due) console.log(`  due:      ${verdict.due} (${verdict.dueAt})`);
    if (verdict.staleHours !== undefined) console.log(`  stale by: ${verdict.staleHours}h, ${verdict.behind} commit(s) behind`);
    if (verdict.readError) console.log(`  read:     ${verdict.readError}`);
    if (verdict.error) console.log(`  error:    ${verdict.error}`);
    console.log(`  grace:    ${verdict.graceMinutes}m`);
    console.log(
      `::error title=Production is not serving master::${verdict.reason}` +
        (verdict.due ? ` — ${verdict.due} has been on master ${verdict.staleHours ?? "?"}h and is not live` : "") +
        (verdict.serving ? `; serving ${verdict.serving}` : ""),
    );
  }

  process.exit(verdict.ok ? 0 : 1);
}
