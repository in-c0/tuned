#!/usr/bin/env node --test
// Is the closeout report actually postable, exactly once, by a run that can change nothing?
//
// WHY THIS EXISTS. Three files promised a closeout — ops/MILESTONES.md's reference dates, its
// 3-month horizon ("at closeout, hand over an honest cohort table rather than a summary") and
// ops/DASHBOARD.md's mirror of it — and for the whole window no such document existed. Runs 216
// and 217 both named writing it as a next candidate and both declined it, which is L-133's shape:
// an obligation addressed to "a later run" is addressed to nobody in particular.
//
// The deadline is hard and asymmetric. CLAUDE.md binds any run firing after 2026-10-05 to make no
// changes — no commit, no claim, no dispatch — so a closeout not committed BEFORE that date can
// never be composed under gates at all. The post-date run would have to assemble it live, from
// 3,000-line ops files, with no ability to run a single check on a number it printed, against a
// hard rule that no number may be published unsourced. So the document is committed while a run
// can still verify it, and the post-date run's whole job is to post it and stop.
//
// WHAT THESE TESTS DEFEND, each being a way the mechanism fails silently:
//
//   1. the file exists                     — it did not, for the whole window
//   2. the marker is on its own first line — CLAUDE.md's dedup searches for it; a marker that is
//                                            not the first line of the posted comment is the
//                                            difference between "post once" and three comments a
//                                            day forever on the owner's control issue (L-134)
//   3. both files spell the marker alike   — a typo in either one silently disables the dedup,
//                                            and the failure only shows up after the date, when
//                                            no run is permitted to fix it
//   4. it fits in a GitHub comment         — a closeout that cannot be posted is not a closeout,
//                                            and the post-date run cannot shorten it (no commit)
//   5. it declares its number's provenance — the hard rule is that no published number is
//                                            unsourced; this asserts the snapshot and its
//                                            generated_at stamp are named in the body
//   6. CLAUDE.md points at it              — otherwise the post-date run does not know it exists,
//                                            which is the exact failure in 1
//   7. it carries the promised cohort table — the one deliverable two files committed to by name
//
// WHAT IT DELIBERATELY DOES NOT CHECK: whether the figures match today's snapshot. The numbers are
// stated as-of a named generated_at stamp, which stays true forever. Asserting they equal the live
// ops/metrics/latest.json would make a twice-daily automated snapshot commit able to redden `check`
// on master with no human change — red on data rather than on code — and after 2026-10-05 nobody is
// left to clear it. That is L-134's shape pointed the wrong way, and run 216 declined the same
// construction for the same reason.

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLOSEOUT_PATH = path.join(REPO_ROOT, "ops/CLOSEOUT.md");
const CARD_PATH = path.join(REPO_ROOT, "CLAUDE.md");

// The dedup key. CLAUDE.md's post-date procedure searches issue #1 for this exact string, so it is
// the one byte sequence in this repository that must agree across two files.
const MARKER = "<!-- tuned-closeout -->";

// GitHub rejects an issue comment body over 65536 characters. The bound here is deliberately well
// under it: the post-date run posts this verbatim and cannot trim it, so there is no recovery from
// being 100 bytes over on the day.
const MAX_COMMENT_CHARS = 60000;

// The snapshot every figure in the report is read from, and the stamp that pins which reading.
//
// Deliberately a literal and not a read of ops/metrics/latest.json. Comparing the report against the
// live snapshot would let a twice-daily automated snapshot commit redden master with no human change
// -- red on data, not on code -- and after 2026-10-05 nobody is left to clear it (L-134's trap pointed
// the wrong way; declined on that ground by runs 216 and 218). The cost of the literal is that
// re-stamping the report is a two-file edit, and that is the intended friction: a run that moves the
// stamp has to say so here, in the guard, rather than let the figures drift quietly.
//
// Moved 2026-10-03T05:19:34.043Z -> 2026-10-04T04:15:07.776Z by run 219, when EXP-014's window closed
// and the newer snapshot turned the report's one predicted figure (items_public, written 100 with
// "reads 101 on the next snapshot") into an observed 101. Every other figure in the report was
// re-checked against the new reading and none of them moved.
const SOURCE_FILE = "ops/metrics/latest.json";
const SOURCE_STAMP = "2026-10-04T04:15:07.776Z";

const read = (p) => fs.readFileSync(p, "utf8");

describe("closeout report (ops/CLOSEOUT.md)", () => {
  it("exists — a promise in three files and a document in none is what this replaces", () => {
    assert.ok(
      fs.existsSync(CLOSEOUT_PATH),
      "ops/CLOSEOUT.md is missing. It cannot be written after 2026-10-05: a post-date run is bound " +
        "to make no changes, so there is no later cycle that can commit it.",
    );
  });

  it("carries the marker on its own first line, which is what makes `final` mean once", () => {
    const lines = read(CLOSEOUT_PATH).split("\n");
    assert.equal(
      lines[0],
      MARKER,
      `line 1 must be exactly \`${MARKER}\` and nothing else. The routine fires three times a day ` +
        `forever and nothing in this repository disables it; the dedup search is the only thing ` +
        `standing between that and three closeout comments a day on the owner's control issue.`,
    );
  });

  it("spells the marker the same way the operating card searches for it", () => {
    const card = read(CARD_PATH);
    assert.ok(
      card.includes(MARKER),
      `CLAUDE.md must contain \`${MARKER}\` verbatim — it is the string the post-date procedure ` +
        `greps issue #1 for, and a mismatch disables the dedup silently, after the last date on ` +
        `which any run is permitted to fix it.`,
    );
  });

  it("fits in a GitHub issue comment, which the post-date run cannot trim it to", () => {
    const chars = read(CLOSEOUT_PATH).length;
    assert.ok(
      chars <= MAX_COMMENT_CHARS,
      `ops/CLOSEOUT.md is ${chars} characters; the bound is ${MAX_COMMENT_CHARS} (GitHub refuses a ` +
        `comment body over 65536). A post-date run may not commit, so it cannot shorten this — an ` +
        `over-long closeout is simply never posted.`,
    );
  });

  it("names the snapshot and the stamp its figures were read at", () => {
    const body = read(CLOSEOUT_PATH);
    assert.ok(
      body.includes(SOURCE_FILE),
      `the report must name ${SOURCE_FILE} — "never publish a number that is not sourced" is a hard ` +
        `rule, and the closeout is the one report nobody can post a correction to.`,
    );
    assert.ok(
      body.includes(SOURCE_STAMP),
      `the report must name the snapshot's generated_at (${SOURCE_STAMP}). The figures are a reading ` +
        `taken at an instant, not a live value: stamped, they stay true; unstamped, they quietly ` +
        `become a claim about whatever today is.`,
    );
  });

  it("is pointed at by the operating card, the one file every run has read", () => {
    const card = read(CARD_PATH);
    assert.ok(
      card.includes("ops/CLOSEOUT.md"),
      "CLAUDE.md must point at ops/CLOSEOUT.md. A post-date run reads the card and nothing else is " +
        "guaranteed; a closeout it is not told about is a closeout that does not get posted — which " +
        "is the failure this whole file exists to close.",
    );
  });

  it("keeps the card's dedup test on FIRST-LINE position, not on presence in the body", () => {
    // THE DEFECT THIS CLOSES, found by run 218 against its own freshly posted report. CLAUDE.md
    // step 1 originally said to "look for the marker" and step 2 "if a comment carries it".
    // Execution reports DESCRIBE this mechanism, so they necessarily quote the marker in prose:
    // scanning all 334 comments on issue #1 found it in run 215's report and run 218's, mid-body,
    // and neither is a closeout. A post-date run doing a substring search would match run 215's
    // comment from 2026-10-02, conclude the closeout was already posted, post nothing and stop —
    // and the closeout would never be posted at all. The marker is a dedup key, so a false
    // positive on it does not duplicate the artifact, it DISCARDS it, silently and permanently,
    // on the one day no run is permitted to fix anything.
    //
    // This is a prose guard and says so. Whether a procedure is correctly written is an argument a
    // parser cannot grade — the same limit owner-cards.mjs states about judging a card's body. What
    // is checkable is that the two phrases carrying the distinction are still in the file, which is
    // what stops a later edit tidying them away without noticing they are the mechanism.
    const card = read(CARD_PATH);
    assert.match(
      card,
      /FIRST LINE/,
      "CLAUDE.md's post-date step 1 must require the marker be a comment's FIRST LINE. Searching " +
        "for presence anywhere in the body matches every execution report that discusses the " +
        "mechanism, and a false positive here discards the closeout rather than duplicating it.",
    );
    assert.match(
      card,
      /not presence anywhere in the body/,
      "the card must say explicitly that presence in the body is NOT the test — the naive reading " +
        "is the one a run arrives at by default, and it is the reading that loses the artifact.",
    );
  });

  it("hands over the cohort table two files promised by name, rather than a summary", () => {
    const body = read(CLOSEOUT_PATH);
    assert.match(
      body,
      /cohort/i,
      "ops/MILESTONES.md's 3-month horizon and ops/DASHBOARD.md both commit to handing over an " +
        "honest cohort table at closeout. An empty cohort table is an honest one; omitting it is not.",
    );
    assert.match(
      body,
      /^\|.*[Ww]eek-4.*\|/m,
      "the cohort table must actually be a table with the week-4 return column MILESTONES names, " +
        "not a sentence saying there is no cohort.",
    );
  });
});
