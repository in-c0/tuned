// Mutual exclusion for executor runs, built out of the one atomic primitive this
// environment actually has.
//
// WHY THIS EXISTS. On 2026-08-31 two executor sessions ran cycle 123 concurrently. One was
// stopped only by a non-fast-forward push on `master`; a slightly different interleaving
// would have produced two contradictory ops commits, two execution reports, and machine
// memory that disagreed with itself. Nothing in the loop prevented it, because nothing in
// the loop was a lock — the ordering was a convention, and a convention is not mutual
// exclusion.
//
// WHAT THE PRIMITIVE IS. A git ref update on the server is compare-and-swap: a
// non-force push succeeds only if the ref is still at the value the pusher built on. Two
// contenders who both read tip T and both build a distinct commit with parent T cannot
// both land — the second is rejected as non-fast-forward, by the remote, before any of its
// objects become reachable. That is the whole guard. Everything below is bookkeeping
// around it.
//
// WHY A SINGLE APPEND-ONLY BRANCH. This session's credential was probed on 2026-08-31 and
// grants exactly one shape of write:
//
//   push to refs/heads/*   create + fast-forward      OK
//   push to refs/tags/*                               403
//   push to refs/tuned/*   (custom namespace)         403
//   delete any ref                                    403
//
// So the register cannot live in a private ref namespace, cannot be a tag, and — this is
// the load-bearing one — cannot be deleted. A branch-per-cycle scheme would leave one
// permanent branch per run, forever, and a lock that can only be released by deleting a
// ref would have no release at all. Hence one branch, `ops-claims`, carrying one
// append-only JSONL file. Claim, release and stale takeover are all appends, so every
// state transition is a fast-forward and no operation here ever needs `--force`. The log
// is the audit trail as a side effect of being the lock.
//
// WHY THE BRANCH IS AN ORPHAN. Cloudflare Workers Builds raises a preview deployment per
// branch (ops/DECISIONS.md, run 56). `ops-claims` therefore carries the register and
// nothing else — no wrangler.jsonc, no package.json — and every commit message carries
// `[skip ci]`, which Workers Builds honours. A build that is skipped costs nothing; a
// build that is not skipped fails in seconds for want of a config, and still deploys
// nothing.
//
// WHAT IT GUARANTEES, AND WHAT IT DOES NOT. It guarantees that of N sessions contending
// for the same resource, exactly one proceeds. It does not and cannot stop a session that
// never calls it — a repository-scoped guard has no way to intercept a process that
// declines to ask. The discipline that closes that gap is procedural and lives in
// ops/STATUS.md: claim first, before any commit, comment, dispatch or external action.

import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const CLAIM_BRANCH = "ops-claims";
export const CLAIM_REF = `refs/heads/${CLAIM_BRANCH}`;
export const REGISTER_PATH = "claims.jsonl";
export const DEFAULT_RESOURCE = "executor";
export const DEFAULT_TTL_SECONDS = 5400; // 90 minutes — see `lease-held` in evaluate().
export const DEFAULT_ATTEMPTS = 5;

// A lost claim is a correct, expected outcome, not a failure: it is the guard doing its
// job. It still needs to be distinguishable from success by a shell, so it gets its own
// code rather than 0. 75 is EX_TEMPFAIL, whose sysexits meaning — "the caller is invited
// to retry later" — is exactly right for a contender that lost a lease.
export const EXIT_LOST = 75;

const COMMIT_ENV = {
  GIT_AUTHOR_NAME: "tuned run-claim",
  GIT_AUTHOR_EMAIL: "run-claim@justtuned.com",
  GIT_COMMITTER_NAME: "tuned run-claim",
  GIT_COMMITTER_EMAIL: "run-claim@justtuned.com",
};

function git(args, cwd, { input, allowFail = false } = {}) {
  try {
    return execFileSync("git", args, {
      cwd,
      input,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, ...COMMIT_ENV },
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch (err) {
    if (allowFail) return null;
    const detail = (err.stderr || "").toString().trim() || err.message;
    throw new Error(`git ${args.join(" ")} failed: ${detail}`);
  }
}

/** Holder identity. Distinct per process even when two runs share a session name. */
export function defaultHolder() {
  const label =
    process.env.TUNED_RUN_HOLDER ||
    process.env.GITHUB_RUN_ID ||
    `${os.hostname()}:${process.pid}`;
  return String(label).slice(0, 120);
}

function shiftDate(ymd, days) {
  const [y, m, d] = ymd.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d) + days * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

/**
 * The cycle label two contending sessions must agree on without talking to each other.
 *
 * The routine fires at 08:00, 14:00 and 20:00 Australia/Sydney, so the window a run
 * belongs to is derivable from the clock alone. `graceMinutes` exists because a run fired
 * a few minutes early would otherwise label itself with the *previous* window and look
 * like a different cycle to its twin. The lease in evaluate() is what actually excludes
 * concurrent sessions; the cycle label is the second, narrower question — has this
 * particular window already been executed and reported — so a boundary misfile degrades
 * to "the lease still held", not to "both ran".
 */
export function defaultCycle(now = Date.now(), graceMinutes = 15) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Australia/Sydney",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hour12: false,
    })
      .formatToParts(new Date(now + graceMinutes * 60_000))
      .map((p) => [p.type, p.value]),
  );
  const hour = Number(parts.hour) % 24;
  let date = `${parts.year}-${parts.month}-${parts.day}`;
  const windows = [8, 14, 20];
  let window = windows.filter((h) => h <= hour).pop();
  if (window === undefined) {
    // Before 08:00 Sydney: still inside the previous day's 20:00 window.
    window = 20;
    date = shiftDate(date, -1);
  }
  return `${date}/w${String(window).padStart(2, "0")}`;
}

/** Remote tip of the register branch, or null if the branch does not exist yet. */
export function fetchTip(cwd, remote) {
  const listed = git(["ls-remote", remote, CLAIM_REF], cwd);
  const sha = (listed || "").split(/\s+/)[0];
  if (!sha) return null;
  // Bring the objects local so the register can be read and a child commit built.
  git(["fetch", "--quiet", remote, CLAIM_REF], cwd);
  return sha;
}

/** Raw register contents at `tip` — "" when the branch or file does not exist. */
export function readRegisterRaw(cwd, tip) {
  if (!tip) return "";
  return git(["show", `${tip}:${REGISTER_PATH}`], cwd, { allowFail: true }) ?? "";
}

export function parseRegister(raw) {
  return raw
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line, i) => {
      try {
        return JSON.parse(line);
      } catch {
        // A malformed line must not be silently dropped: dropping it could resurrect a
        // lease that was actually held. Fail closed by surfacing it.
        throw new Error(`${REGISTER_PATH} line ${i + 1} is not valid JSON`);
      }
    });
}

/**
 * Decide whether this contender may claim, given the register it just read.
 *
 * Three ways to lose, and they are different failures:
 *
 *   lease-held     someone else is mid-run. This is the concurrency guard proper, and it
 *                  is resource-scoped rather than cycle-scoped on purpose: two sessions
 *                  that disagree about which window they are in must still exclude.
 *   cycle-complete this window was already claimed AND released. That is the run-123
 *                  duplicate exactly — the first session finished and a second arrived to
 *                  redo it. A finished cycle is never re-entered.
 *   (attempts)     the CAS loop lost the ref race repeatedly; see claim().
 *
 * And one way to win that is not a plain win: `takeover-stale`. A claim with no release
 * whose TTL has elapsed is a crashed session, not a running one. Taking it over is the
 * documented recovery path — it is an ordinary append naming what it supersedes, so it
 * needs no ref deletion, no force push and no credential change.
 */
export function evaluate(records, { resource, cycle, now }) {
  const byNonce = new Map();
  for (const r of records) {
    if (r.resource !== resource) continue;
    if (r.event === "claim") byNonce.set(r.nonce, { ...r, released: null });
    else if (r.event === "release") {
      const held = byNonce.get(r.nonce);
      if (held) held.released = r;
    }
  }
  const claims = [...byNonce.values()];
  const expiry = (c) => Date.parse(c.at) + (c.ttlSeconds ?? DEFAULT_TTL_SECONDS) * 1000;

  const live = claims.filter((c) => !c.released && expiry(c) > now);
  if (live.length > 0) {
    return { ok: false, reason: "lease-held", holder: live[live.length - 1] };
  }
  const completed = claims.find((c) => c.cycle === cycle && c.released);
  if (completed) {
    return { ok: false, reason: "cycle-complete", holder: completed };
  }
  const stale = claims.filter((c) => c.cycle === cycle && !c.released).pop();
  return stale
    ? { ok: true, reason: "takeover-stale", supersedes: stale.nonce, holder: stale }
    : { ok: true, reason: "free", supersedes: null, holder: null };
}

/**
 * Read the register and build — but do not publish — this contender's claim commit.
 *
 * Split from publish() so a test can force the exact interleaving that matters: two
 * contenders that both read the same tip and both believe they may proceed. Without the
 * seam, proving atomicity would depend on winning a race by luck.
 */
export function prepare(cwd, remote, opts) {
  const {
    resource = DEFAULT_RESOURCE,
    cycle,
    holder,
    ttlSeconds = DEFAULT_TTL_SECONDS,
    now = Date.now(),
    event = "claim",
    nonce,
    outcome,
  } = opts;

  const tip = fetchTip(cwd, remote);
  const raw = readRegisterRaw(cwd, tip);
  const records = parseRegister(raw);

  let decision = { ok: true, reason: event, supersedes: null, holder: null };
  if (event === "claim") {
    decision = evaluate(records, { resource, cycle, now });
    if (!decision.ok) return { tip, records, decision, commit: null, record: null };
  }

  const record = {
    v: 1,
    event,
    resource,
    cycle,
    holder,
    nonce: nonce ?? crypto.randomUUID(),
    at: new Date(now).toISOString(),
    ...(event === "claim" ? { ttlSeconds } : {}),
    ...(decision.supersedes ? { supersedes: decision.supersedes } : {}),
    ...(outcome ? { outcome } : {}),
  };

  const content = raw + JSON.stringify(record) + "\n";
  const blob = git(["hash-object", "-w", "--stdin"], cwd, { input: content }).trim();
  const tree = git(["mktree"], cwd, {
    input: `100644 blob ${blob}\t${REGISTER_PATH}\n`,
  }).trim();
  const message =
    `ops-claims: ${event} ${resource} ${cycle} by ${holder} [skip ci]\n\n` +
    `${JSON.stringify(record)}\n`;
  const commit = git(
    ["commit-tree", tree, ...(tip ? ["-p", tip] : []), "-m", message],
    cwd,
  ).trim();

  return { tip, records, decision, commit, record };
}

/**
 * Attempt the ref update. `false` means the remote rejected it — another contender moved
 * the ref between our read and our push — and it means nothing has been mutated: the
 * commit object we built is unreachable and will be garbage collected.
 */
export function publish(cwd, remote, commit) {
  const out = git(["push", "--quiet", remote, `${commit}:${CLAIM_REF}`], cwd, {
    allowFail: true,
  });
  return out !== null;
}

function runCas(cwd, remote, opts) {
  const attempts = opts.attempts ?? DEFAULT_ATTEMPTS;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const prepared = prepare(cwd, remote, { ...opts, now: opts.now ?? Date.now() });
    if (!prepared.decision.ok) {
      return { won: false, attempt, ...prepared.decision, record: null };
    }
    if (publish(cwd, remote, prepared.commit)) {
      return {
        won: true,
        attempt,
        reason: prepared.decision.reason,
        record: prepared.record,
        commit: prepared.commit,
      };
    }
    // Lost the ref race. Loop: re-read the register — the winner may have claimed the very
    // resource we want, in which case the next evaluate() returns `lease-held` and we exit
    // as a loser rather than retrying into a stolen lease.
  }
  return { won: false, attempt: attempts, reason: "contended", holder: null, record: null };
}

/** Acquire the lease. Never mutates anything when it returns `won: false`. */
export function claim(cwd, remote, opts) {
  return runCas(cwd, remote, { ...opts, event: "claim" });
}

/**
 * Release the lease. Appends rather than deleting, so a release is a fast-forward like
 * everything else here, and the record of who held what survives.
 */
export function release(cwd, remote, opts) {
  return runCas(cwd, remote, { ...opts, event: "release" });
}

/** Current state of the register, for `run-claim.mjs status`. */
export function status(cwd, remote, { resource = DEFAULT_RESOURCE, cycle, now = Date.now() }) {
  const tip = fetchTip(cwd, remote);
  const records = parseRegister(readRegisterRaw(cwd, tip));
  return { tip, records, decision: evaluate(records, { resource, cycle, now }) };
}

// ---------------------------------------------------------------------------
// Local handoff between `claim` and `release` inside one run.
//
// Kept under .git/ rather than in the worktree so a claim can never be swept into a
// product commit by an unrelated `git add -A`.
// ---------------------------------------------------------------------------

export function stateFile(cwd) {
  const gitDir = git(["rev-parse", "--absolute-git-dir"], cwd).trim();
  return path.join(gitDir, "tuned-run-claim.json");
}

export function writeState(cwd, record) {
  fs.writeFileSync(stateFile(cwd), JSON.stringify(record, null, 2) + "\n");
}

export function readState(cwd) {
  const file = stateFile(cwd);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
