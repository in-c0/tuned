#!/usr/bin/env node
// Does the canonical file carry every owner action it says it carries?
//
// WHY THIS EXISTS. On 2026-09-30 (run 207) the head of `ops/STATUS.md` had read
// `OWNER ACTION REQUIRED: TWO` since run 143 (2026-09-06), and the section it links to carried
// ONE card. Run 143 raised the second — *may Tuned be suggested to ooh.directory at all?* — and
// wrote it into run 143's own entry and into `ops/DASHBOARD.md` §1. It was never appended to
// `## OWNER ACTION REQUIRED`, the standing card stack the head points at from 51 run-head lines
// and the section every execution report since has named as the place the cards are "recorded …
// and not re-argued here". For 64 runs the authoritative file was missing half of the one output
// of this loop that requires a human.
//
// WHY THE USUAL PRECEDENCE RULE MADE IT WORSE RATHER THAN BETTER. `DASHBOARD.md` §1 opens with
// "Mirror of STATUS.md § OWNER ACTION REQUIRED. If the two disagree, STATUS is right", and the
// operating card says DASHBOARD "is never a source of truth". Here the mirror was the *superset*,
// so applying either rule as written resolves the disagreement by DELETING the missing card. A
// precedence rule is only safe while the authoritative file is the superset; nothing checked
// that it was, and this is what checks it.
//
// WHY IT SURVIVED 64 RUNS — L-07, working exactly as designed. "After two unchanged blocker
// cycles, escalate once and then stop restating it." The loop correctly stopped restating both
// cards, which left the pointer as the owner's only channel. A pointer into a section missing half
// its content, plus a rule against restating that content, silently deletes the escalation while
// every report truthfully says `TWO, unchanged`.
//
// A KNOWN BLIND SPOT, MEASURED RATHER THAN ASSUMED. `liveCardHeadings` counts HEADINGS, so a card
// hollowed out to a heading with no body under it passes this guard — run 207 built that mutation and
// it came back exit 0. What caught the real incident is the head-vs-section count disagreement, and a
// card removed heading-and-all is caught by the live-card count. Widening this to judge a card's body
// would make it grade whether a card is adequately written, which is an argument and not a parse, so
// the blind spot is documented here instead of papered over.
//
// WHAT THIS CHECKS, AND THE ONE THING IT DELIBERATELY DOES NOT. It checks that one number agrees
// in three places — STATUS's head, STATUS's section heading, DASHBOARD §1's section heading — and
// that STATUS's section actually carries that many live cards. It does NOT check whether a card is
// *right*, current, or well argued: that is an argument against evidence and belongs in a run's
// report, not in a parser. This guard answers only "are they all here, and does the count agree",
// which is the question 64 runs answered wrong.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const STATUS_PATH = path.join(REPO_ROOT, "ops", "STATUS.md");
export const DASHBOARD_PATH = path.join(REPO_ROOT, "ops", "DASHBOARD.md");

/** The count vocabulary, spelled as words because that is how all three sites spell it. Index is
 *  the value, so `COUNT_WORDS.indexOf("TWO") === 2`. */
export const COUNT_WORDS = ["NONE", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX"];

/** First count word in a line, as a numeral, or null when the line names no count.
 *
 *  Matched as a whole word and case-sensitively in upper case, which is how every count heading in
 *  both files writes it — so the word "one" inside ordinary prose ("one word on issue #1", "no
 *  credential to install, nothing to change") cannot be mistaken for a count. */
export function countWord(line) {
  const m = /\b(NONE|ONE|TWO|THREE|FOUR|FIVE|SIX)\b/.exec(line);
  return m ? COUNT_WORDS.indexOf(m[1]) : null;
}

/** The lines of the section introduced by `heading`, up to the next heading of the same or higher
 *  level. `heading` is matched exactly, at the start of a line. */
export function sectionLines(text, heading) {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => l.trimEnd() === heading);
  if (start < 0) return null;
  const level = /^#+/.exec(heading)[0].length;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => {
    const m = /^(#{1,6})\s/.exec(l);
    return m && m[1].length <= level;
  });
  return end < 0 ? rest : rest.slice(0, end);
}

/** `### ` headings inside a section's live region, in order.
 *
 *  The live region ends at the first `### Previously` heading, which is how STATUS's card stack
 *  separates standing cards from retired ones. A heading whose text begins `NONE` is a notice that
 *  there is nothing to do rather than a card, so it is not counted — that keeps `NONE` meaning
 *  zero cards instead of one. */
export function liveCardHeadings(sectionLines) {
  const out = [];
  for (const line of sectionLines) {
    const m = /^###\s+(.*)$/.exec(line);
    if (!m) continue;
    const label = m[1].replace(/[*`_]/g, "").trim();
    if (/^Previously\b/i.test(label)) break;
    if (/^NONE\b/i.test(label)) continue;
    out.push(line);
  }
  return out;
}

/** The count word the file's head asserts. STATUS's head links the section on the same line it
 *  names the number: `[OWNER ACTION REQUIRED](#owner-action-required):\nTWO, unchanged …` — the
 *  number may wrap onto the following line, so both are read. */
export function headCount(text) {
  const lines = text.split("\n");
  const i = lines.findIndex((l) => l.includes("(#owner-action-required)"));
  if (i < 0) return null;
  return countWord(lines[i]) ?? countWord(lines[i + 1] ?? "");
}

export const STATUS_SECTION = "## OWNER ACTION REQUIRED";
export const DASHBOARD_SECTION = "## 1. OWNER ACTION REQUIRED";

/** Every disagreement, as human sentences. Empty means the records agree. */
export function findDefects({ status, dashboard }) {
  const defects = [];

  const head = headCount(status);
  if (head === null) {
    defects.push(
      `ops/STATUS.md: no head line links (#owner-action-required) with a count word. The head is ` +
        `where a run states how many owner actions are outstanding; without it nothing can be cross-checked.`
    );
  }

  const statusSection = sectionLines(status, STATUS_SECTION);
  if (statusSection === null) {
    defects.push(`ops/STATUS.md: no "${STATUS_SECTION}" section. 51 run-head lines link to it.`);
    return defects;
  }

  const cards = liveCardHeadings(statusSection);
  const first = statusSection.find((l) => /^###\s/.test(l));
  const sectionCount = first === undefined ? null : countWord(first);
  if (sectionCount === null) {
    defects.push(
      `ops/STATUS.md § OWNER ACTION REQUIRED: its leading "###" heading names no count word ` +
        `(${COUNT_WORDS.join("/")}). That heading is the section's own statement of how many cards it carries.`
    );
  }

  if (head !== null && sectionCount !== null && head !== sectionCount) {
    defects.push(
      `ops/STATUS.md: the head says ${COUNT_WORDS[head]} owner action(s); ` +
        `§ OWNER ACTION REQUIRED says ${COUNT_WORDS[sectionCount]}. This is run 207's defect exactly: ` +
        `the head said TWO and the section carried one card for 64 runs.`
    );
  }

  if (sectionCount !== null && cards.length !== sectionCount) {
    defects.push(
      `ops/STATUS.md § OWNER ACTION REQUIRED says ${COUNT_WORDS[sectionCount]} but carries ` +
        `${cards.length} live card heading(s) before "### Previously". A card that is counted and ` +
        `absent is the one the owner never sees.`
    );
  }

  const dashSection = sectionLines(dashboard, DASHBOARD_SECTION);
  if (dashSection === null) {
    defects.push(`ops/DASHBOARD.md: no "${DASHBOARD_SECTION}" section to mirror the cards.`);
  } else {
    const dashFirst = dashSection.find((l) => /^###\s/.test(l));
    const dashCount = dashFirst === undefined ? null : countWord(dashFirst);
    if (dashCount === null) {
      defects.push(
        `ops/DASHBOARD.md § 1. OWNER ACTION REQUIRED: its leading "###" heading names no count word.`
      );
    } else if (sectionCount !== null && dashCount !== sectionCount) {
      defects.push(
        `ops/DASHBOARD.md § 1 says ${COUNT_WORDS[dashCount]} owner action(s); ops/STATUS.md ` +
          `§ OWNER ACTION REQUIRED says ${COUNT_WORDS[sectionCount]}. The mirror and the source must ` +
          `carry the same number — and note that "STATUS is right" is the WRONG remedy when the mirror ` +
          `is the superset: restore the missing card, never delete it.`
      );
    }
  }

  return defects;
}

export function readRecords() {
  return {
    status: fs.readFileSync(STATUS_PATH, "utf8"),
    dashboard: fs.readFileSync(DASHBOARD_PATH, "utf8"),
  };
}

function main() {
  const defects = findDefects(readRecords());
  if (defects.length === 0) {
    const { status } = readRecords();
    const n = liveCardHeadings(sectionLines(status, STATUS_SECTION)).length;
    console.log(`owner cards: OK — ${COUNT_WORDS[n]} live card(s), agreed in head, section and mirror.`);
    return 0;
  }
  console.error("owner cards: DEFECT\n");
  for (const d of defects) console.error(`  - ${d}\n`);
  return 1;
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
  process.exit(main());
}
