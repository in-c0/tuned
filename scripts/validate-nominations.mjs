#!/usr/bin/env node
// CI gate for the EXP-008 nomination registry (qa/nominations/*.json).
//
// The registry is what qa/exp008-provenance.spec.mjs grades production against, so a malformed or
// back-dated entry would quietly weaken the instrument rather than break it. This script runs in
// `check.yml` next to validate-workflows.py, for the same reason that one exists: nothing else in
// the pipeline opens these files, so a defect in them fails silently.
//
// Two layers, and the difference between them is deliberate.
//
//   1. STRUCTURAL — shared with the spec via qa/nominations/index.mjs, so the gate accepts exactly
//      what the instrument will grade. Includes the load-bearing one: the pre-registration commit
//      must predate the publication.
//
//   2. TRANSCRIPTION — best-effort, and it says so out loud. It greps the pre-registration commit
//      for the entry's url and title. This is the half of `verifyWith` a machine can do; the `why`
//      line is not checked because a source file may wrap or concatenate it, and a check that
//      passes by accident is worse than one that is honestly absent. The layer SKIPS when the
//      commit is not in the clone — CI checks out at depth 1, so in CI it will usually skip. It is
//      not a gate. The binding guarantee stays git history plus layer 1.

import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadNominations, NOMINATIONS_DIR } from "../qa/nominations/index.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let nominations;
try {
  nominations = loadNominations();
} catch (e) {
  console.error(`FAIL ${e.message}`);
  process.exit(1);
}

console.log(`nomination registry: ${nominations.length} entr${nominations.length === 1 ? "y" : "ies"} in ${path.relative(REPO_ROOT, NOMINATIONS_DIR)}`);

function commitPresent(sha) {
  try {
    execFileSync("git", ["cat-file", "-e", `${sha}^{commit}`], { cwd: REPO_ROOT, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function commitText(sha) {
  return execFileSync("git", ["show", "--format=%B", sha], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
}

let skipped = 0;
let failures = 0;

for (const n of nominations) {
  const lead = `item ${n.itemId} (@${n.handle}, ${n.file})`;
  const ageSeconds = (Date.parse(n.publishedAt) - Date.parse(n.preregistration.committedAt)) / 1000;
  console.log(`  ${lead}: pre-registered ${n.preregistration.commit.slice(0, 7)} at ${n.preregistration.committedAt}, published ${n.publishedAt} (+${ageSeconds}s)`);

  if (!commitPresent(n.preregistration.commit)) {
    console.log(`    transcription check SKIPPED — ${n.preregistration.commit.slice(0, 7)} is not in this clone (shallow checkout). Verify by hand: ${n.preregistration.verifyWith}`);
    skipped += 1;
    continue;
  }

  const text = commitText(n.preregistration.commit);
  const missing = [];
  if (!text.includes(n.url)) missing.push("url");
  if (!text.includes(n.title)) missing.push("title");
  const whyVerbatim = text.includes(n.why);

  if (missing.length) {
    console.error(`    FAIL transcription: ${missing.join(" and ")} not found verbatim in ${n.preregistration.commit.slice(0, 7)}`);
    failures += 1;
  } else {
    console.log(`    transcription OK: url and title verbatim in ${n.preregistration.commit.slice(0, 7)}; why verbatim: ${whyVerbatim ? "yes" : "no (not required — source may wrap it)"}`);
  }
}

if (failures) {
  console.error(`\nFAIL ${failures} nomination(s) do not match their pre-registration commit.`);
  process.exit(1);
}

console.log(`\nOK ${nominations.length} nomination(s) structurally valid${skipped ? `; ${skipped} transcription check(s) skipped for want of the commit` : ""}.`);
