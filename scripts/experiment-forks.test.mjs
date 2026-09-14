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

import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(ROOT, "ops/EXPERIMENTS.md");

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
