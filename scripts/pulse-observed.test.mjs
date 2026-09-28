// A corroborating counter an experiment leans on must be one this loop can prove is alive.
//
// ---------------------------------------------------------------------------------------------
// WHERE THIS CAME FROM. `scripts/experiment-forks.test.mjs` enforces the rule run 198 wrote: an
// experiment graded on a name in `HEADER_DERIVED_AXES` — a header the caller sends, and can forge —
// must also name a script-execution counter in its forks, because a client that writes one of
// those has RUN the document. EXP-014 duly names `item_render` in Forks B, C and F.
//
// That rule asks whether the corroboration was NAMED. It cannot ask whether it WORKS. And on
// 2026-09-28 (run 201) the answer for `item_render` was that nobody knew: the counter had never
// once been observed firing from a browser anywhere in this repository, it has no first-party
// writer the way `item_view_search_bot` has `verify-production.yml`, and `ops/metrics/latest.json`
// showed it absent on six consecutive days while `item_view` moved. EXP-014 leaned three of its
// six forks on a counter whose liveness was nobody's job.
//
// That is this loop's most-repeated failure: four instruments shipped that silently wrote nothing
// (L-35, L-44, L-46, L-51), every one found after a window had closed. EXP-014's own **Fork E**
// exists to prevent exactly it — for the other counter. This guard is Fork E's principle made
// general, so the next experiment cannot lean on an unwitnessed beacon.
//
// WHAT IT ENFORCES. If any fork of an experiment names a counter in `PULSE_COUNTERS`, some spec
// under `qa/` must declare that counter in its exported `OBSERVES_PULSES` — meaning that spec
// asserts the counter FIRES from a real browser and is accepted by production.
//
// WHY A DECLARATION AND NOT A GREP. Because the file text cannot answer the question.
// `qa/pulse-instrument.spec.mjs` names `item_render` — in its `NEVER_HERE` list, as a counter that
// must never fire on the landing page. A grep would have called that coverage and been exactly
// wrong: an assertion that a beacon is silent is the opposite of an assertion that it works. So
// each spec states what it positively witnesses, and this guard reads the declarations.
//
// WHAT IT CANNOT DO, said plainly so no run reads more into a green. It is a label check, like the
// two rules it sits beside. It establishes that a browser check EXISTS for the counter, never that
// the check was dispatched, nor that it passed. `qa/` is dispatch-only by design. A run grading a
// fork on one of these counters still has to point at the run that observed it.
// ---------------------------------------------------------------------------------------------

import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXPERIMENTS = path.join(ROOT, "ops/EXPERIMENTS.md");
const SRC_INDEX = path.join(ROOT, "src/index.ts");
const QA = path.join(ROOT, "qa");

// Kept identical to `scripts/experiment-forks.test.mjs`. Both shapes are in use: `- **Fork R-A — `
// and `- **A — `. A regex that knew only one would sweep an empty set in silence (L-61).
const FORK_RE = /^- \*\*(?:Fork )?([A-Z](?:-[A-Z0-9]+)?)\s+—/;

/** Whole-name match: `item_render` must not be found inside `item_render_bot`. */
const names = (text, name) => new RegExp(`(?<![a-z0-9_])${name}(?![a-z0-9_])`).test(text);

/** Read from the Worker rather than copied, so the set here cannot drift from the route's. */
function readPulseCounters() {
  const src = fs.readFileSync(SRC_INDEX, "utf8");
  const block = src.match(/const PULSE_COUNTERS = new Set\(\[([\s\S]*?)\]\);/);
  assert.ok(
    block,
    `could not find PULSE_COUNTERS in ${path.relative(ROOT, SRC_INDEX)} — if it was renamed, rename it here too rather than letting this guard read an empty set`,
  );
  return [...block[1].matchAll(/"([a-z0-9_]+)"/g)].map((m) => m[1]);
}

/** Experiment id -> the concatenated text of every fork bullet under it. */
function forkTextByExperiment() {
  const lines = fs.readFileSync(EXPERIMENTS, "utf8").split("\n");
  const byExp = new Map();
  let exp = null;
  let inFork = false;
  for (const line of lines) {
    const heading = line.match(/^#+\s+(EXP-\d+)/);
    if (heading) {
      exp = heading[1];
      inFork = false;
      continue;
    }
    if (!exp) continue;
    if (FORK_RE.test(line)) {
      inFork = true;
    } else if (inFork && !/^\s+\S/.test(line)) {
      // A fork bullet ends at the first line that is neither indented continuation nor blank.
      if (line.trim() !== "") inFork = false;
    }
    if (inFork) byExp.set(exp, (byExp.get(exp) ?? "") + "\n" + line);
  }
  return byExp;
}

/** Spec file -> the pulse names it declares it positively witnesses.
 *
 *  Parsed from the source text rather than imported. Importing would catch a typo in the
 *  declaration as an import error, which is the nicer failure — but it needs `@playwright/test`,
 *  and `qa/` deliberately carries its own manifest that the repository root never installs (a
 *  browser toolchain must not reach the Worker's dependency tree). An import-based read would
 *  therefore find nothing on the checkout `npm run test:ops` actually runs on, and a guard that
 *  quietly asserts nothing is the failure this guard exists to prevent. So it matches the
 *  declaration FORM — `export const OBSERVES_PULSES = [...]` — which is still the thing that
 *  distinguishes a witnessed counter from one merely mentioned, and the stray-name test below is
 *  what catches the typo instead. */
function readObservations() {
  const specs = fs.readdirSync(QA).filter((f) => f.endsWith(".spec.mjs"));
  const observed = new Map();
  for (const f of specs) {
    const text = fs.readFileSync(path.join(QA, f), "utf8");
    const decl = text.match(/^export const OBSERVES_PULSES\s*=\s*\[([^\]]*)\]/m);
    if (!decl) continue;
    observed.set(f, [...decl[1].matchAll(/"([a-z0-9_]+)"/g)].map((m) => m[1]));
  }
  return observed;
}

test("the pulse-counter list is read from the Worker and is not empty", () => {
  const pulse = readPulseCounters();
  assert.ok(pulse.length >= 7, `expected at least 7 pulse counters, found ${pulse.length}: ${pulse.join(", ")}`);
});

test("a spec's OBSERVES_PULSES may only name counters the Worker actually allows", () => {
  const pulse = new Set(readPulseCounters());
  const observed = readObservations();
  const strays = [];
  for (const [file, list] of observed) {
    for (const n of list) if (!pulse.has(n)) strays.push(`${file} declares ${n}`);
  }
  assert.deepEqual(
    strays,
    [],
    "a QA spec claims to witness a counter POST /api/pulse/:name would refuse. Either the name is a typo or the counter was removed from PULSE_COUNTERS and the spec is asserting a 404.",
  );
});

test("a pulse counter an experiment's forks rest on has a browser check that witnesses it", () => {
  const pulse = readPulseCounters();
  const byExp = forkTextByExperiment();
  const observed = readObservations();

  // No skip path. Every input this rule reads — the Worker's source, EXPERIMENTS.md and the spec
  // files — is in the repository, so there is no checkout on which it can legitimately assert
  // nothing. The two vacuity assertions below are what say so if that ever stops being true.
  assert.ok(
    observed.size >= 1,
    "no qa/ spec declares OBSERVES_PULSES — either every declaration was deleted or the parse above no longer matches the form they are written in",
  );

  const witnessed = new Set([...observed.values()].flat());

  const subject = [];
  const missing = [];
  for (const [exp, text] of byExp) {
    for (const counter of pulse) {
      if (!names(text, counter)) continue;
      subject.push(`${exp}/${counter}`);
      if (!witnessed.has(counter)) missing.push(`${exp} rests on ${counter}, which no qa/ spec witnesses`);
    }
  }

  assert.ok(
    subject.length >= 1,
    "no experiment's forks name any counter in PULSE_COUNTERS — this rule is sweeping an empty set",
  );

  assert.deepEqual(
    missing,
    [],
    "a fork leans on a counter written by the page's own script, and nothing in qa/ has ever seen it fire. Add a spec that asserts the beacon fires and is accepted, and declare it in that spec's OBSERVES_PULSES — or the fork's zero cannot be told from a dead instrument.",
  );
});
