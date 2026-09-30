// The guard for ops/STATUS.md § OWNER ACTION REQUIRED. See scripts/owner-cards.mjs for why it
// exists; the load-bearing test here is `THE INCIDENT`, which is red on the records exactly as
// they stood before run 207.

import test from "node:test";
import assert from "node:assert/strict";

import {
  COUNT_WORDS,
  DASHBOARD_SECTION,
  STATUS_SECTION,
  countWord,
  findDefects,
  headCount,
  liveCardHeadings,
  readRecords,
  sectionLines,
} from "./owner-cards.mjs";

/** A STATUS.md with `head` as the asserted count and `cards` as the live card headings. */
function status({ head, cards, previously = true }) {
  return [
    "# Tuned — STATUS",
    "",
    `**Last updated:** run 207 — **[OWNER ACTION REQUIRED](#owner-action-required):`,
    `${head}, unchanged and not re-argued here, per [L-07](LESSONS.md).**`,
    "",
    "---",
    "",
    STATUS_SECTION,
    "",
    ...cards.flatMap((c) => [`### ${c}`, "", "body text, one word on issue #1 settles it", ""]),
    ...(previously ? ["### Previously: **NONE.**", "", "retired card body", ""] : []),
    "## BLOCKERS",
    "",
  ].join("\n");
}

function dashboard({ head }) {
  return ["# Tuned — owner dashboard", "", DASHBOARD_SECTION, "", `### **${head} now.**`, "", "body", "", "## 2. NEXT"].join("\n");
}

test("countWord reads the count vocabulary as whole upper-case words", () => {
  assert.equal(countWord("### **TWO, and neither has a deadline.**"), 2);
  assert.equal(countWord("### **ONE, and it has no deadline.**"), 1);
  assert.equal(countWord("### Previously: **NONE.**"), 0);
  assert.equal(countWord("### **THREE things.**"), 3);
});

test("countWord does not read lower-case prose as a count", () => {
  // Both of these appear verbatim in the real cards. If the matcher were case-insensitive, the
  // card bodies would each declare a count.
  assert.equal(countWord("one word on [issue #1](…) settles it"), null);
  assert.equal(countWord("No spend, no credential to install, nothing to change."), null);
  assert.equal(countWord("### **Card 1 of 2 — and it has no deadline.**"), null);
});

test("sectionLines returns a section's body and stops at the next same-level heading", () => {
  const lines = sectionLines(status({ head: "TWO", cards: ["**TWO.**", "**Card 1 of 2.**"] }), STATUS_SECTION);
  assert.ok(lines.some((l) => l.startsWith("### **TWO.**")));
  assert.ok(!lines.some((l) => l.startsWith("## BLOCKERS")));
});

test("sectionLines returns null when the section is absent", () => {
  assert.equal(sectionLines("# nothing here\n", STATUS_SECTION), null);
});

test("liveCardHeadings stops at Previously and does not count a NONE notice as a card", () => {
  const text = status({ head: "TWO", cards: ["**TWO.**", "**Card 1 of 2.**"] });
  assert.equal(liveCardHeadings(sectionLines(text, STATUS_SECTION)).length, 2);

  const none = status({ head: "NONE", cards: ["**NONE.**"] });
  assert.equal(liveCardHeadings(sectionLines(none, STATUS_SECTION)).length, 0);
});

test("headCount reads a count that wraps onto the line after the anchor link", () => {
  assert.equal(headCount(status({ head: "TWO", cards: ["**TWO.**", "**Card 1.**"] })), 2);
});

test("agreeing records produce no defects", () => {
  const defects = findDefects({
    status: status({ head: "TWO", cards: ["**TWO, and neither has a deadline.**", "**Card 1 of 2.**"] }),
    dashboard: dashboard({ head: "TWO" }),
  });
  assert.deepEqual(defects, []);
});

test("MUTATION: THE INCIDENT — the head says TWO, the section carries card 1 only", () => {
  // The records exactly as they stood from run 143 to run 206: STATUS's head asserts TWO, its
  // section's leading heading is card 1's "ONE, and it has no deadline", one live card, and the
  // mirror correctly carries TWO. If this ever stops failing, the guard has stopped proving
  // anything.
  const defects = findDefects({
    status: status({ head: "TWO", cards: ["**ONE, and it has no deadline.** — run 137"] }),
    dashboard: dashboard({ head: "TWO" }),
  });
  assert.ok(defects.length >= 2, `expected the head/section and mirror/source disagreements, got ${defects.length}`);
  assert.ok(
    defects.some((d) => d.includes("the head says TWO") && d.includes("says ONE")),
    "the head/section disagreement must be named"
  );
  assert.ok(
    defects.some((d) => d.includes("carry the same number")),
    "the mirror/source disagreement must be named"
  );
});

test("MUTATION: the mirror-is-superset warning says restore, never delete", () => {
  // "If the two disagree, STATUS is right" is the wrong remedy in this direction, and the operator
  // reading the failure has to be told so, or the fix is to delete the card the owner needs.
  const defects = findDefects({
    status: status({ head: "ONE", cards: ["**ONE.**"] }),
    dashboard: dashboard({ head: "TWO" }),
  });
  const warning = defects.find((d) => d.includes("carry the same number"));
  assert.ok(warning, "expected a mirror/source count defect");
  assert.match(warning, /restore the missing card, never delete it/);
});

test("a section that counts more cards than it carries is a defect", () => {
  const defects = findDefects({
    status: status({ head: "TWO", cards: ["**TWO, and neither has a deadline.**"] }),
    dashboard: dashboard({ head: "TWO" }),
  });
  assert.ok(
    defects.some((d) => d.includes("carries 1 live card heading")),
    `expected a live-card shortfall, got: ${defects.join(" | ")}`
  );
});

test("a head with no count word at all is a defect rather than a pass", () => {
  const text = status({ head: "TWO", cards: ["**TWO.**", "**Card 1.**"] }).replace(
    "TWO, unchanged and not re-argued here",
    "unchanged and not re-argued here"
  );
  const defects = findDefects({ status: text, dashboard: dashboard({ head: "TWO" }) });
  assert.ok(defects.some((d) => d.includes("no head line links")));
});

test("the repository's own records agree", () => {
  assert.deepEqual(findDefects(readRecords()), []);
});

test("COUNT_WORDS is indexed by value", () => {
  assert.equal(COUNT_WORDS.indexOf("TWO"), 2);
  assert.equal(COUNT_WORDS[0], "NONE");
});

test("DASHBOARD's mirror section heading is the one this guard reads", () => {
  const { dashboard: real } = readRecords();
  assert.ok(real.split("\n").some((l) => l.trimEnd() === DASHBOARD_SECTION));
});
