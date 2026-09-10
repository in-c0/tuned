#!/usr/bin/env node --test
// The alarm shell block, run against a stubbed `gh`.
//
// WHY THIS FILE EXISTS. `scripts/executor-liveness.test.mjs` proves the verdict. It cannot
// prove the thing that carries the verdict to the owner: the `run:` block of the "Raise the
// alarm on issue #1" step is shell, it lives in YAML, and it executes only during an outage
// — so in the normal case it is never run at all, and in the abnormal case there is nobody
// to notice it was wrong. Run 147 exercised it by hand and found two defects in it that
// every other gate in this repository passed over:
//
//   * `gh api --paginate ... | grep -Fq "$marker"` inverted the dedupe under `pipefail`.
//     `grep -q` exits at the first match and closes the pipe, so gh dies of EPIPE and the
//     pipeline fails on exactly the runs where the marker WAS found — a comment every hour
//     for the length of the outage.
//   * `-f "body=@alarm.md"` posts the literal string `@alarm.md`. It is `-F`.
//
// Neither is visible by reading, both are obvious the moment the block is executed, and the
// hand-run that found them was not committed — so nothing would have caught the next one.
// Run 148 edited this block (the marker key changed, and the missed-runs rows were added),
// which is reason enough for the harness to become a file.
//
// The block is EXTRACTED FROM THE SHIPPED YAML, never copied into the test. A copy would
// pass forever after the workflow diverged from it, which is the same defect one level up.

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORKFLOW = path.join(REPO, ".github/workflows/executor-liveness.yml");

/**
 * Pull the `run:` body of the alarm step out of the workflow and undent it. Deliberately
 * strict: if the step is renamed or its shape changes, this throws rather than silently
 * testing nothing (L-61 — a harness that extracts an empty script passes every assertion
 * over it).
 */
function extractAlarmScript() {
  const lines = fs.readFileSync(WORKFLOW, "utf8").split("\n");
  const start = lines.findIndex((l) => l.includes("name: Raise the alarm on issue #1"));
  assert.notEqual(start, -1, "alarm step not found — was it renamed?");

  const runAt = lines.findIndex((l, i) => i > start && /^\s+run: \|/.test(l));
  assert.notEqual(runAt, -1, "alarm step has no `run: |` block");

  const indent = lines[runAt + 1].match(/^\s*/)[0].length;
  const body = [];
  for (let i = runAt + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() !== "" && line.match(/^\s*/)[0].length < indent) break;
    body.push(line.slice(indent));
  }
  const script = body.join("\n");
  assert.ok(script.includes("gh api"), "extracted block does not call gh — extraction is wrong");
  assert.ok(script.length > 500, `extracted block is implausibly short (${script.length} bytes)`);
  return script;
}

const ALARM = extractAlarmScript();

/**
 * Run the block in a scratch directory with `gh` replaced by a stub that records its
 * arguments and replays canned comment bodies. Returns what the block did.
 */
function runAlarm(env, existingComments = []) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "liveness-alarm-"));
  const bin = path.join(dir, "bin");
  fs.mkdirSync(bin);
  fs.writeFileSync(path.join(dir, "comments.json"), JSON.stringify(existingComments));

  // The stub distinguishes the two calls the block makes the way the real gh would: a read
  // (`--jq` over the comments endpoint) and a write (a POST carrying a body field).
  //
  // TWO THINGS HERE ARE FIDELITY, NOT DECORATION, AND THE FIRST DRAFT HAD NEITHER — so the
  // harness passed on the very defects it was written to catch, which is the failure mode
  // it exists to prevent (L-61).
  //
  //   1. `-F` expands a leading `@` to the file's contents; `-f` sends the literal string.
  //      A stub that reads the value without looking at the flag before it cannot tell the
  //      two apart, and `-f "body=@alarm.md"` — the real defect from run 147 — survives.
  //
  //   2. The read pads its output past the pipe buffer. The pipefail defect is a race the
  //      writer has to LOSE: `grep -q` exits at the first match, and gh only dies of EPIPE
  //      if it still had something to write. Issue #1 is 261 comments of multi-kilobyte
  //      execution reports, so the real response is megabytes and the writer always loses;
  //      a stub returning three short strings fits entirely in the 64 KiB pipe buffer,
  //      finishes before grep exits, and the defect is invisible. The padding is what the
  //      real endpoint's size does, reproduced.
  fs.writeFileSync(
    path.join(bin, "gh"),
    `#!/usr/bin/env bash
set -uo pipefail
printf '%s\\n' "$*" >> "${dir}/gh-calls.txt"
for arg in "$@"; do
  if [ "$arg" = "--jq" ]; then
    node -e '
      const fs = require("fs");
      const bodies = JSON.parse(fs.readFileSync("${dir}/comments.json", "utf8"));
      process.stdout.on("error", () => process.exit(1));   // EPIPE, as gh would
      for (const b of bodies) process.stdout.write(b + "\\n");
      const pad = ("x".repeat(4096) + "\\n").repeat(512);   // ~2 MiB, as issue #1 is
      process.stdout.write(pad);
    '
    exit $?
  fi
done
# Anything else is the POST.
prev=""
for i in $(seq 1 $#); do
  a="\${!i}"
  case "\$prev:\$a" in
    -F:body=@*) cp "\${a#body=@}" "${dir}/posted.md" ;;
    *:body=*)   printf '%s' "\${a#body=}" > "${dir}/posted-literal.txt" ;;
  esac
  prev="\$a"
done
`,
    { mode: 0o755 },
  );

  let exitCode = 0;
  try {
    execFileSync("bash", ["-c", ALARM], {
      cwd: dir,
      stdio: "pipe",
      env: {
        PATH: `${bin}:${process.env.PATH}`,
        GITHUB_REPOSITORY: "in-c0/tuned",
        GITHUB_WORKFLOW: "executor liveness",
        ...env,
      },
    });
  } catch (err) {
    exitCode = err.status ?? 1;
  }

  const read = (f) => (fs.existsSync(path.join(dir, f)) ? fs.readFileSync(path.join(dir, f), "utf8") : null);
  return {
    exitCode,
    posted: read("posted.md"),
    postedLiteral: read("posted-literal.txt"),
    calls: (read("gh-calls.txt") ?? "").trim().split("\n").filter(Boolean),
  };
}

const STALE_ENV = {
  REASON: "stale",
  ALARM_KEY: "2026-09-12T22:05:00.000Z",
  STALE_SINCE: "2026-09-12T22:05:00.000Z",
  AGE_HOURS: "25.1",
  HOLDER: "routine-run-160",
  CYCLE: "2026-09-12/w22",
  GAP_FROM: "",
  GAP_TO: "",
  GAP_HOURS: "",
  RUN_URL: "https://github.com/in-c0/tuned/actions/runs/1",
};

const MISSED_ENV = {
  ...STALE_ENV,
  REASON: "missed-runs",
  ALARM_KEY: "2026-09-11T22:05:00.000Z",
  STALE_SINCE: "2026-09-12T22:05:00.000Z",
  AGE_HOURS: "1.2",
  GAP_FROM: "2026-09-11T22:05:00.000Z",
  GAP_TO: "2026-09-12T22:05:00.000Z",
  GAP_HOURS: "24",
};

describe("the alarm posts once per outage", () => {
  it("posts when the issue carries no comment for this outage", () => {
    const r = runAlarm(STALE_ENV);
    assert.equal(r.exitCode, 0);
    assert.ok(r.posted, "expected a comment body to be posted");
    assert.match(r.posted, /Executor loop is not firing/);
    assert.match(r.posted, /<!-- executor-liveness-alarm key=2026-09-12T22:05:00\.000Z -->/);
  });

  it("stays silent when this outage is already flagged", () => {
    const already = ["<!-- executor-liveness-alarm key=2026-09-12T22:05:00.000Z -->\n\n## ..."];
    const r = runAlarm(STALE_ENV, already);
    assert.equal(r.exitCode, 0, "the dedupe must not fail the step");
    assert.equal(r.posted, null, "posted a duplicate");
    assert.equal(r.calls.length, 1, "expected the read only, no POST");
  });

  it("posts again for a different outage", () => {
    const other = ["<!-- executor-liveness-alarm key=2026-08-01T00:00:00.000Z -->"];
    const r = runAlarm(STALE_ENV, other);
    assert.equal(r.exitCode, 0);
    assert.ok(r.posted, "a distinct outage must get its own comment");
  });

  it("survives an issue whose comments contain no marker at all", () => {
    // 261 comments of execution reports, none of them an alarm: the ordinary case, and the
    // one where `grep -Fq` returns 1 and `set -e` would kill the step before it posted.
    const r = runAlarm(STALE_ENV, ["## Execution report — run 147", "## ChatGPT review"]);
    assert.equal(r.exitCode, 0);
    assert.ok(r.posted);
  });
});

describe("the body says which kind of outage it is", () => {
  it("names the gap and the recovery for a completed outage", () => {
    const r = runAlarm(MISSED_ENV);
    assert.ok(r.posted);
    assert.match(r.posted, /Runs missed between \| 2026-09-11T22:05:00\.000Z and 2026-09-12/);
    assert.match(r.posted, /24h with no run at all/);
    assert.match(r.posted, /The loop has since recovered/);
  });

  it("omits the gap rows entirely when the outage is still open", () => {
    // GAP_FROM is empty on the `stale` path. An empty table row reading "Runs missed
    // between  and" is how a monitor loses the reader's trust at the moment it needs it.
    const r = runAlarm(STALE_ENV);
    assert.doesNotMatch(r.posted, /Runs missed between/);
    assert.doesNotMatch(r.posted, /The loop has since recovered/);
  });

  it("keys the marker on the gap start, not the newest claim", () => {
    // The two differ only on the missed-runs path, and that is exactly where keying on the
    // newest claim would re-post the same outage at every check as the loop ran on.
    const r = runAlarm(MISSED_ENV);
    assert.match(r.posted, /key=2026-09-11T22:05:00\.000Z/);
    assert.doesNotMatch(r.posted, /key=2026-09-12T22:05:00\.000Z/);
  });
});

describe("the body reaches GitHub as a body", () => {
  it("posts the file's contents, not the string '@alarm.md'", () => {
    // -F reads `@file`; -f would send the literal. This is one of the two defects the
    // hand-run found in run 147, and the only reason it is not still there.
    const r = runAlarm(STALE_ENV);
    assert.equal(r.postedLiteral, null, "the body was sent as a literal string");
    assert.ok(r.posted?.startsWith("<!-- executor-liveness-alarm"));
  });

  it("carries the Claude Code attribution footer", () => {
    const r = runAlarm(STALE_ENV);
    assert.match(r.posted, /_Generated by \[Claude Code\]\(https:\/\/claude\.ai\/code\)_\s*$/);
  });
});
