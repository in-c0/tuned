#!/usr/bin/env node
// Every pre-registered fork must say what the loop DOES when it fires.
//
// WHY THIS EXISTS. On 2026-09-14 (run 159) a sweep of ops/EXPERIMENTS.md found 32 forks
// pre-registered across seven experiments, and eleven of them registered a *reading* with
// no action attached. They were not a random eleven. Every single one was a null, an
// "inadmissible", or a "no reading available" fork:
//
//   EXP-009 D  the submission is never authorized, never made, or never merged
//   EXP-009 E  merged, but the maintainer normalised the URL away
//   EXP-011 R-E  first-party traffic contaminated the window
//   EXP-012 O-C  listed, and it sent nobody
//   EXP-012 O-D  never listed — which the venue's own rules call the expected outcome
//   EXP-012 O-F  contaminated
//   EXP-013 A   cadence demonstrated, and no claim of demand follows
//   EXP-013 E   Europe PMC refuses a self-declaring client; no reading at all
//
// So this loop had written down, in detail, what to do when an experiment tells it
// something — and left blank what to do when it tells it nothing. Nothing is the outcome
// it has actually received. EXP-002 was killed at submission. EXP-009 has never acquired a
// t0. EXP-010 graded to a null. A4 lapsed unused four times. Thirty-nine days in, every
// funnel figure is the figure it started at. The modal outcome was the unhandled one, and
// the gap is invisible while reading the file top to bottom because each fork looks
// complete on its own — it has a threshold, a reading and a prohibition. It just has no
// next step. See ops/LESSONS.md L-77.
//
// WHAT IT ENFORCES. A fork bullet carries an explicitly labelled `*Next action:*`. The
// label matters rather than merely the prose: EXP-010 N-1 and N-4 both describe a
// consequence inside the reading sentence, which is why nobody noticed for three weeks
// that four sibling forks did not.
//
// THE EXEMPTIONS ARE SELF-PRUNING, which is the property that keeps a list like this
// honest. A fork named here that has since been given a next action FAILS the test, so the
// list cannot quietly become the place unfixed things go to rest.
//
// ---------------------------------------------------------------------------------------
//
// THE SECOND RULE, added 2026-09-27 (run 198): a fork graded on a value the CALLER SENDS
// must name a value the caller cannot send.
//
// WHY IT EXISTS. EXP-014 was registered on 2026-09-27 to decide whether the 2026-09-26
// find-page traffic was a crawler or the first search arrivals. Its Fork B — "search is
// delivering" — trips on `item_view_search >= 1` on any one whole day, and its next action
// is the strongest in the file: *"the first evidenced arrival channel that needs nobody's
// permission, and it outranks every other candidate available to the loop."* That counter
// is written from `Referer`. The same experiment's own "what this cannot show" section says
// the header is forgeable. Nothing connected the two, so a single fetcher sending
// `Referer: https://www.google.com/` once in seven days could have redirected the loop's
// last five days onto a channel that does not exist.
//
// It is not a hypothetical population. The traffic on the site the day the experiment was
// written wrote 642 unsuffixed `item_view` and never once wrote `item_render` — so what is
// actually walking these pages is non-bot-classified, does not run the document, and is
// therefore exactly the client that can trip Fork B on purpose or by accident.
//
// The corroborating instrument already existed and was already deployed: `PULSE_COUNTERS`
// in src/index.ts are written by the document's own script behind a same-origin `Origin`
// check, so a client that writes one has RUN the page. EXP-014 named none of them. That is
// L-116 one turn further on — the axis was split so the reading became computable, and the
// corroboration that makes it *believable* was a separate question nobody asked.
//
// WHAT IT ENFORCES. If any fork of an experiment is graded on a name in
// HEADER_DERIVED_AXES, some fork of that experiment must also name a script-execution
// counter. It is a label check, exactly like the rule above: it cannot tell whether the
// corroboration was used correctly, only that the run grading the fork has been handed it.

import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

import { HEADER_DERIVED_AXES } from "./axis-invariant.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(ROOT, "ops/EXPERIMENTS.md");
const SRC_INDEX = path.join(ROOT, "src/index.ts");

// Both shapes in use. EXP-007 … EXP-012 write `- **Fork R-A — …`; EXP-013 writes
// `- **A — …` under its own "Forks, decided in advance" heading. A syntactic check that
// knew only the first would skip EXP-013's five forks in silence, which is the same
// empty-sweep failure this file exists to catch (L-61).
const FORK_RE = /^- \*\*(?:Fork )?([A-Z](?:-[A-Z0-9]+)?)\s+—/;

// Graded and closed 2026-09-04 (run 136, Fork N-2). Both of these state their consequence
// inside the reading sentence instead of under the label — N-1 "must be re-derived from
// this band before any submission is authorized", N-4 "re-run on a clean window rather
// than salvaged". EXPERIMENTS.md is append-only and rewriting the registered text of a
// closed experiment is worse than naming it here. Forks registered after this run get no
// such latitude.
const EXEMPT = [
  { exp: "EXP-010", fork: "N-1", why: "graded+closed 2026-09-04; action embedded in the reading sentence" },
  { exp: "EXP-010", fork: "N-4", why: "graded+closed 2026-09-04; action embedded in the reading sentence" },
];

/** Every fork bullet in the file, with the experiment it belongs to and its full text. */
function readForks() {
  const lines = fs.readFileSync(FILE, "utf8").split("\n");

  const headings = [];
  lines.forEach((line, i) => {
    const m = line.match(/^## (EXP-\d+)\b/);
    if (m) headings.push({ exp: m[1], line: i });
  });
  const expAt = (i) => {
    let found = null;
    for (const h of headings) if (h.line <= i) found = h.exp;
    return found;
  };

  const forks = [];
  lines.forEach((line, i) => {
    const m = line.match(FORK_RE);
    if (!m) return;

    // A bullet runs until the next top-level bullet or the next heading. Continuation
    // lines are indented, so this keeps a fork's own wrapped text and nothing else.
    let j = i + 1;
    let body = line;
    while (j < lines.length && !/^- /.test(lines[j]) && !/^#{2,4} /.test(lines[j])) {
      body += "\n" + lines[j];
      j++;
    }

    forks.push({ exp: expAt(i), fork: m[1], line: i + 1, body });
  });
  return forks;
}

// `*Next\n  action:*` is how markdown wraps it at 100 columns, and it is how EXP-010 N-2
// and N-3 are actually written. Matching the raw string would have called those two
// unregistered and sent a later run to "fix" text that was already correct.
const hasNextAction = (body) => /\*?Next\s+action\s*:/i.test(body.replace(/\s+/g, " "));

const key = (f) => `${f.exp} ${f.fork}`;
const exemptKeys = new Set(EXEMPT.map((e) => `${e.exp} ${e.fork}`));

test("the fork sweep actually finds forks", () => {
  const forks = readForks();
  // L-61: a check whose input parses to nothing sweeps an empty set, and every assertion
  // over an empty set holds. If a later edit changes the bullet style, this fails loudly
  // instead of passing vacuously. 32 forks existed when this was written.
  assert.ok(
    forks.length >= 30,
    `expected the fork sweep to find at least 30 fork bullets, found ${forks.length} — has the bullet style changed?`,
  );
  assert.ok(
    forks.every((f) => f.exp !== null),
    "every fork bullet must sit under an `## EXP-NNN` heading",
  );
});

test("every pre-registered fork carries an explicit next action", () => {
  const missing = readForks()
    .filter((f) => !hasNextAction(f.body))
    .filter((f) => !exemptKeys.has(key(f)));

  assert.deepEqual(
    missing.map((f) => `${key(f)} (line ${f.line})`),
    [],
    "a fork that registers a reading but no action leaves the run that reads it to improvise — which is exactly what happens on the null forks. Add `*Next action:* …`.",
  );
});

test("the exemption list is self-pruning", () => {
  const forks = readForks();
  const byKey = new Map(forks.map((f) => [key(f), f]));

  for (const e of EXEMPT) {
    const k = `${e.exp} ${e.fork}`;
    const fork = byKey.get(k);

    // An exemption for a fork that no longer exists is a stale entry pointing at nothing.
    assert.ok(fork, `exemption names ${k}, which is not a fork in ops/EXPERIMENTS.md`);

    // And the half that keeps the list from becoming a dumping ground: once a fork has
    // been given its next action, it must leave this list.
    assert.ok(
      !hasNextAction(fork.body),
      `${k} now carries a next action — remove it from EXEMPT in ${path.basename(fileURLToPath(import.meta.url))}`,
    );
  }
});

/** The counters only a client that ran the document can write, read from the Worker rather than
 *  copied, so the two cannot drift. `PULSE_COUNTERS` gates `POST /api/pulse/:name` and that route
 *  also requires a same-origin `Origin`, which is why writing one means having rendered the page. */
function readPulseCounters() {
  const src = fs.readFileSync(SRC_INDEX, "utf8");
  const block = src.match(/const PULSE_COUNTERS = new Set\(\[([\s\S]*?)\]\);/);
  assert.ok(
    block,
    `could not find PULSE_COUNTERS in ${path.relative(ROOT, SRC_INDEX)} — if it was renamed, rename it here too rather than letting this guard read an empty set`,
  );
  // Only double-quoted names. Every name inside that block's comments is written in backticks,
  // so prose cannot inflate the set.
  return [...block[1].matchAll(/"([a-z0-9_]+)"/g)].map((m) => m[1]);
}

/** Whole-name match: `item_view_referred` must not be found inside `item_view_referred_bot`. */
const names = (text, name) => new RegExp(`(?<![a-z0-9_])${name}(?![a-z0-9_])`).test(text);

/** Experiment id -> the concatenated text of all its fork bullets. */
function forkTextByExperiment() {
  const byExp = new Map();
  for (const f of readForks()) {
    byExp.set(f.exp, (byExp.get(f.exp) ?? "") + "\n" + f.body);
  }
  return byExp;
}

test("the script-execution counter list is read from the Worker and is not empty", () => {
  const pulse = readPulseCounters();
  // L-61 again. Nine names existed when this was written; `item_render` is the one the find-page
  // reading rests on, so its absence means the set has been gutted whatever the count says.
  assert.ok(pulse.length >= 7, `expected at least 7 pulse counters, found ${pulse.length}: ${pulse.join(", ")}`);
  assert.ok(pulse.includes("item_render"), `PULSE_COUNTERS no longer contains item_render: ${pulse.join(", ")}`);
});

test("an experiment graded on a caller-supplied axis also names a script-execution counter", () => {
  const pulse = readPulseCounters();
  const byExp = forkTextByExperiment();

  const subject = [];
  const missing = [];
  for (const [exp, text] of byExp) {
    const axes = HEADER_DERIVED_AXES.filter((a) => names(text, a));
    if (axes.length === 0) continue;
    subject.push(exp);
    if (!pulse.some((p) => names(text, p))) missing.push(`${exp} (graded on ${axes.join(", ")})`);
  }

  // The vacuity half. If no experiment is graded on a caller-supplied axis, this rule is asserting
  // nothing and must say so rather than pass.
  assert.ok(
    subject.length >= 1,
    "no experiment's forks name any axis in HEADER_DERIVED_AXES — this rule is sweeping an empty set",
  );

  assert.deepEqual(
    missing,
    [],
    "a fork graded on a header the caller sends can be tripped by the caller. Name a PULSE_COUNTERS counter in the forks too — a client that writes one has run the document — or say in the fork why no corroboration is possible.",
  );
});
