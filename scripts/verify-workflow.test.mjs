// The post-deploy verifier's match rule.
//
// On 2026-09-06 (run 144) `verify production` reported "the deploy never landed" about a
// deploy that had landed: it asserted the pushed SHA was *exactly* the SHA serving, and a
// scheduled workflow in this repository committed to master one minute after the push, so
// Cloudflare built that newer tip instead. The pushed commit was live, inside a build the
// check could not recognise. This loop's rule is to roll back on a failed verification, so
// a check that goes red about a healthy deploy is worse than no check at all.
//
// The rule is now containment: the serving commit must *contain* the expected one. These
// tests pin both halves of that — the shell predicate really does distinguish an ancestor
// from a descendant, and the workflow really does use it with the full history it needs.

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const WORKFLOW = fileURLToPath(new URL("../.github/workflows/verify-production.yml", import.meta.url));
const yml = readFileSync(WORKFLOW, "utf8");

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

/** The workflow's own predicate, run against a real repository rather than described. */
function contains(cwd, expected, serving) {
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", expected, serving], { cwd, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

test("a newer build containing the pushed commit counts as live", () => {
  const dir = mkdtempSync(join(tmpdir(), "verify-"));
  try {
    git(dir, "init", "-q", "-b", "master");
    git(dir, "config", "user.email", "t@t.t");
    git(dir, "config", "user.name", "t");
    writeFileSync(join(dir, "a"), "1");
    git(dir, "add", "-A");
    git(dir, "commit", "-qm", "pushed by the executor");
    const pushed = git(dir, "rev-parse", "HEAD");
    writeFileSync(join(dir, "b"), "1");
    git(dir, "add", "-A");
    git(dir, "commit", "-qm", "ops: metrics snapshot, landing one minute later");
    const serving = git(dir, "rev-parse", "HEAD");

    // The 2026-09-06 case: what is serving is newer and carries the change.
    assert.equal(contains(dir, pushed, serving), true);
    // Exact match still passes, which is the ordinary case.
    assert.equal(contains(dir, pushed, pushed), true);
    // Fail closed the other way: a Worker still serving an OLDER commit has not
    // deployed the change, and must not be read as though it had.
    assert.equal(contains(dir, serving, pushed), false);
    // An unknown object is not a match either — no silent pass on a bad read.
    assert.equal(contains(dir, pushed, "0".repeat(40)), false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("the workflow asks for containment, with the history that question needs", () => {
  assert.match(yml, /fetch-depth:\s*0/, "a shallow clone answers 'not contained' for everything");
  assert.match(yml, /merge-base --is-ancestor "\$EXPECTED" "\$serving"/);
  // Fetched inside the loop, because the commit that supersedes the push does not exist
  // in the clone at checkout time — which is the entire case this rule exists for.
  assert.match(yml, /git fetch --quiet --no-tags origin master/);
});

test("the verifier still fails closed when nothing serving contains the commit", () => {
  assert.match(yml, /never became live, and nothing serving contained it/);
  // The health assertions must stay behind it: a green result on an unknown Worker is
  // worse than no result, which is why the wait step exits 1 rather than warning.
  assert.match(yml, /exit 1\n/);
});
