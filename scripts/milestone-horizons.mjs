#!/usr/bin/env node
// Does every closed milestone horizon carry a grade?
//
// WHY THIS EXISTS. `ops/MILESTONES.md` is item 3 in the operating card's read order — every run is
// obliged to open it for "the nearest active horizon". On 2026-09-29 (run 204) it had been last
// updated on 2026-08-13, and it was telling every run three false things at once: the 2-week
// horizon (2026-08-22) and the 1-month horizon (2026-09-08) had closed 38 and 21 days earlier and
// still read `not started` with prospective next actions; six sub-day windows whose own text calls
// them "a rolling execution ladder, re-anchored at the start of each run" were still anchored at
// run 20 and still marked `active` with next actions completed 46 days before; and `DASHBOARD.md`
// §3, the owner's one-screen view, named "the 3-hour one" as the nearest falsifiable milestone —
// a window that closed 2026-08-08 12:30 UTC.
//
// THE SHAPE OF THE DEFECT, WHICH THIS LOOP HAS NOW FOUND FOUR TIMES. An obligation that lives only
// as prose is honoured by whichever run happens to read that far: L-76 (the run lock at line 2493
// of a 3,000-line file), L-97 (the scout record no run was obliged to open), L-122 (a fork rule
// graded by whoever read the paragraph). The remedy each time was the same and is the remedy here:
// make the obligation execute. "Re-anchored at the start of each run" is a sentence; nothing ran it,
// and it rotted for 183 runs.
//
// WHAT THIS CHECKS, AND THE ONE THING IT DELIBERATELY DOES NOT. It checks that a horizon whose
// target date has passed carries a terminal disposition rather than a prospective one. It does NOT
// check whether the grade is *correct* — a grade is an argument against evidence and belongs in a
// run's report, not in a parser. This guard answers only "was it graded at all", which is exactly
// the question 46 days of silence answered wrong.
//
// `closed, ungraded` is terminal ON PURPOSE and spelled as two words ON PURPOSE. A window that
// closed before any run could grade it on fresh evidence must not be graded now from hindsight —
// MILESTONES.md's own rule is that "reconstructing targets for windows that had none, and then
// marking them achieved, would be exactly the invented retrospective accomplishment this file
// exists to prevent", and that rule is symmetric: inventing a retrospective *failure* is no better.
// So the honest disposition exists, and requiring the full phrase keeps it a deliberate act rather
// than a default a future run can drift into.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const MILESTONES_PATH = path.join(REPO_ROOT, "ops", "MILESTONES.md");

/** A disposition that says the horizon is done being waited on. Matched case-insensitively as a
 *  whole word, so `missed` matches the 1-week entry's `condition 2 MISSED` and `achieved` does not
 *  match the word "achievable". */
export const TERMINAL_STATUSES = ["achieved", "missed", "revised", "invalidated", "retired"];

/** Prospective dispositions. A horizon past its target date carrying one of these is the defect. */
export const PROSPECTIVE_STATUSES = ["not started", "active", "blocked"];

/** The deliberate non-grade, required verbatim. See the header. */
export const CLOSED_UNGRADED = "closed, ungraded";

/** Pull a target date out of a horizon heading.
 *
 *  `## 1 month — by 2026-09-08` → 2026-09-08. `## 3 years — by 2029-08` → the last instant of
 *  2029-08, because a month-granular horizon is not past due until the month is. A heading with no
 *  `by <date>` at all — `## Indefinite — vision and direction` — has no deadline and is returned
 *  as null rather than guessed at. */
export function targetDate(heading) {
  const full = /\bby\s+(\d{4})-(\d{2})-(\d{2})\b/.exec(heading);
  if (full) return new Date(Date.UTC(+full[1], +full[2] - 1, +full[3], 23, 59, 59, 999));
  const month = /\bby\s+(\d{4})-(\d{2})\b/.exec(heading);
  if (month) return new Date(Date.UTC(+month[1], +month[2], 0, 23, 59, 59, 999));
  return null;
}

/** Classify a `- **Status:**` line. Terminal wins over prospective wherever both appear, because
 *  the 1-week entry legitimately reads `split, and now half-graded: condition 1 MET, condition 2
 *  MISSED` — a graded horizon that also narrates what is not met. A grade that has been argued is
 *  a grade. */
export function classifyStatus(statusText) {
  const s = statusText.toLowerCase();
  if (s.includes(CLOSED_UNGRADED)) return "closed-ungraded";
  for (const t of TERMINAL_STATUSES) {
    if (new RegExp(`\\b${t}\\b`).test(s)) return "terminal";
  }
  for (const p of PROSPECTIVE_STATUSES) {
    if (new RegExp(`\\b${p}\\b`).test(s)) return "prospective";
  }
  return "unrecognized";
}

/** Split the file into horizons. A horizon is an `## ` section; its status is the first
 *  `- **Status:**` bullet inside it, because a section may discuss other horizons' statuses in
 *  prose below its own and the first one is the section's own claim. */
export function parseHorizons(markdown) {
  const lines = markdown.split("\n");
  const horizons = [];
  let current = null;
  for (const line of lines) {
    const h = /^##\s+(.*)$/.exec(line);
    if (h) {
      if (current) horizons.push(current);
      current = { heading: h[1].trim(), target: targetDate(h[1]), status: null };
      continue;
    }
    if (!current || current.status !== null) continue;
    const s = /^-\s+\*\*Status:\*\*\s*(.*)$/.exec(line);
    if (s) current.status = s[1].trim();
  }
  if (current) horizons.push(current);
  return horizons;
}

/** The horizons that are past due and still prospective — the defect this guard exists to redden
 *  on. A horizon with no target date is never past due; a horizon with no status line at all is
 *  reported too, because an unstated status is not a grade. */
export function pastDueUngraded(horizons, now) {
  return horizons.filter((h) => {
    if (!h.target || h.target.getTime() > now.getTime()) return false;
    if (h.status === null) return true;
    const k = classifyStatus(h.status);
    return k === "prospective" || k === "unrecognized";
  });
}

export function render(horizons, now) {
  const out = [];
  const dated = horizons.filter((h) => h.target);
  out.push(`milestone horizons: ${horizons.length} section(s), ${dated.length} with a target date`);
  out.push(`  now: ${now.toISOString()}`);
  out.push("");
  for (const h of horizons) {
    const when = h.target ? h.target.toISOString().slice(0, 10) : "no deadline";
    const closed = h.target && h.target.getTime() <= now.getTime();
    const kind = h.status === null ? "NO STATUS LINE" : classifyStatus(h.status);
    const flag = closed && (kind === "prospective" || kind === "NO STATUS LINE" || kind === "unrecognized") ? " <-- PAST DUE, UNGRADED" : "";
    out.push(`  ${when}  ${closed ? "closed" : "open  "}  ${kind.padEnd(15)} ${h.heading}${flag}`);
  }
  const bad = pastDueUngraded(horizons, now);
  out.push("");
  if (bad.length === 0) {
    out.push("  OK every closed horizon carries a terminal disposition or an explicit `closed, ungraded`.");
  } else {
    out.push(`  FAIL ${bad.length} closed horizon(s) still read as prospective:`);
    for (const h of bad) out.push(`    - ${h.heading} — status: ${h.status ?? "(none)"}`);
    out.push("");
    out.push("  Grade it against evidence, or mark it `closed, ungraded` and say why it cannot be graded.");
    out.push("  A grade is not a status refresh: it is an argument in a run's report. See L-123.");
  }
  return out.join("\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const now = new Date();
  const horizons = parseHorizons(fs.readFileSync(MILESTONES_PATH, "utf8"));
  console.log(render(horizons, now));
  process.exit(pastDueUngraded(horizons, now).length === 0 ? 0 : 1);
}
