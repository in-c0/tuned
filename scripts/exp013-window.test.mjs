#!/usr/bin/env node --test
// The positive control is the record production actually wrote on 2026-09-22: a green run, an
// uploaded artifact, and a screen that decided nothing. A reading that counts that day as a
// legitimate quiet cycle is the failure this file exists to prevent — it is the difference
// between "the bar refused everything" and "the bar was never asked", and EXP-013's threshold 2
// is graded "on every live screen", so which of the two it was decides whether there is a screen
// to grade at all.

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { SELECTION_RATE_BAR, WINDOW, gradeScreen, renderWindow, screenState } from "./exp013-window.mjs";

/** A record shaped like the ones scripts/agent-scout.mjs writes. */
const record = ({ returned, selected = 0, rejected = 0, deferred = 0, unclaused = 0, find = null, reads = 12 }) => {
  const observations = [];
  for (let i = 0; i < selected; i++) observations.push({ verdict: "selected", clause: "", pmcid: `S${i}` });
  for (let i = 0; i < rejected; i++) {
    observations.push({ verdict: "rejected", clause: i < unclaused ? "" : "scope", pmcid: `R${i}` });
  }
  for (let i = 0; i < deferred; i++) observations.push({ verdict: "deferred", clause: "read-budget", pmcid: `D${i}` });
  return { returned, observations, full_text_reads: reads, find, handle: "sportstech" };
};

describe("a screen that decided nothing is never counted as a quiet one", () => {
  it("calls the 2026-09-22 shape malformed — candidates claimed, no verdict recorded", () => {
    const s = screenState({ returned: 35, observations: [], full_text_reads: 0 });
    assert.equal(s.state, "malformed");
    assert.match(s.why, /35 candidate\(s\) and records no verdict/);
  });

  it("keeps a genuinely empty search a clean empty cycle, not a defect", () => {
    // Run 184 deliberately kept `hitCount: 0` a clean exit so the publisher does not cry wolf on
    // the cycles the bar exists to sit out. Widening `malformed` to cover it would undo that.
    const s = screenState({ returned: 0, observations: [], full_text_reads: 0 });
    assert.equal(s.state, "empty");
  });

  it("contributes no reading in either case, so threshold 2 cannot be graded on it", () => {
    assert.equal(gradeScreen({ returned: 0, observations: [] }).reading, null);
    assert.equal(gradeScreen({ returned: 35, observations: [] }).reading, null);
  });

  it("refuses a record that is not one", () => {
    assert.equal(screenState(null).state, "malformed");
    assert.equal(screenState({ returned: "35", observations: [] }).state, "malformed");
    assert.equal(screenState({ returned: 3 }).state, "malformed");
  });
});

describe("threshold 2 is graded on the bar as written", () => {
  it("reads 2026-09-13 as production wrote it — 9 of 35, over the pre-registered bar", () => {
    const g = gradeScreen(record({ returned: 35, selected: 9, rejected: 12, deferred: 14 }));
    assert.equal(g.reading.screened, 35);
    assert.equal(g.reading.selected, 9);
    assert.ok(g.reading.rate > SELECTION_RATE_BAR, "9/35 = 25.7% must read as over the 25% bar");
    assert.equal(g.reading.decided, 21);
  });

  it("reports the decided-set rate alongside, never in place of, the pre-registered one", () => {
    // EXP-013 recorded the denominator as mis-specified and pre-committed not to rewrite it
    // inside its own window. Both numbers must survive, or the objection on record is unevidenced
    // and the bar being graded is quietly a different bar.
    const g = gradeScreen(record({ returned: 35, selected: 9, rejected: 9, deferred: 17 }));
    assert.equal(g.reading.rate, 9 / 35);
    assert.equal(g.reading.decidedRate, 9 / 18);
    assert.notEqual(g.reading.rate, g.reading.decidedRate);
  });

  it("holds when the rate is exactly the bar, because <= 25% is the written threshold", () => {
    // Graded through renderWindow, because that is where the comparison lives. Asserting
    // `!(rate > BAR)` on the number alone is a tautology: it restates the operator instead of
    // exercising it, and a `>` quietly widened to `>=` would still pass.
    const g = gradeScreen(record({ returned: 36, selected: 9, rejected: 12, deferred: 15 }));
    assert.equal(g.reading.rate, SELECTION_RATE_BAR);

    const out = renderWindow([
      { date: "2026-09-15", runId: 9, record: record({ returned: 36, selected: 9, rejected: 12, deferred: 15 }) },
    ]);
    assert.match(out, /held on all 1/, "exactly 25% must not be reported as a failure");
    assert.doesNotMatch(out, /FAILS/);
  });
});

describe("threshold 1's second clause — every rejection names exactly one", () => {
  it("counts a rejection carrying no clause", () => {
    const g = gradeScreen(record({ returned: 20, selected: 2, rejected: 8, deferred: 10, unclaused: 3 }));
    assert.equal(g.reading.unclaused, 3);
  });

  it("is zero when every rejection is reasoned", () => {
    const g = gradeScreen(record({ returned: 20, selected: 2, rejected: 8, deferred: 10 }));
    assert.equal(g.reading.unclaused, 0);
  });
});

describe("the window table says how much evidence it actually has", () => {
  const rows = [
    { date: "2026-09-13", runId: 1, record: record({ returned: 35, selected: 9, rejected: 12, deferred: 14, find: { idempotencyKey: "k1" } }) },
    { date: "2026-09-14", runId: 2, record: record({ returned: 37, selected: 9, rejected: 12, deferred: 16, find: { idempotencyKey: "k1" } }) },
    { date: "2026-09-22", runId: 3, record: { returned: 35, observations: [], full_text_reads: 0 } },
  ];

  it("names the screen that contributes no reading instead of dropping it", () => {
    const out = renderWindow(rows);
    assert.match(out, /2 of 3 screen\(s\) reached a verdict/);
    assert.match(out, /1 screen\(s\) contribute no reading/);
    assert.match(out, /2026-09-22 malformed/);
  });

  it("reports threshold 2 failing on the screens that exceed the bar", () => {
    const out = renderWindow(rows);
    assert.match(out, /FAILS on 1 of 2/);
    assert.match(out, /2026-09-13 25\.7%/);
  });

  it("says ten screens choosing one paper are one observation repeated", () => {
    const out = renderWindow(rows);
    assert.match(out, /carry \*\*1\*\* distinct top selection/);
    assert.match(out, /one observation repeated, not independent readings/);
  });

  it("reads the identity from `idempotencyKey`, the name the record serialises", () => {
    // agent-scout.mjs LOGS it as `key:` and writes it as `idempotencyKey`. Reading the log's
    // label produced nine screens with no identity, which the renderer then described.
    const g = gradeScreen(
      record({ returned: 35, selected: 9, rejected: 12, deferred: 14, find: { idempotencyKey: "scout-b2aee844368bb449" } })
    );
    assert.equal(g.reading.topKey, "scout-b2aee844368bb449");
    assert.equal(g.reading.top, true);
  });

  it("refuses to describe what the screens chose when no record carries an identity", () => {
    // The defect this replaced: `keys.size <= 1` collapsed "no identity" into "one identity" and
    // printed a claim about the evidence generated from its absence.
    const anonymous = [
      { date: "2026-09-13", runId: 1, record: record({ returned: 35, selected: 9, rejected: 12, deferred: 14, find: null }) },
      { date: "2026-09-14", runId: 2, record: record({ returned: 37, selected: 9, rejected: 12, deferred: 16, find: null }) },
    ];
    const out = renderWindow(anonymous);
    assert.match(out, /Independence\*\* — cannot be read/);
    assert.doesNotMatch(out, /chose the same candidate/);
    assert.doesNotMatch(out, /one observation repeated/);
  });

  it("does not make that claim when the screens genuinely differ", () => {
    const varied = [
      { date: "2026-09-13", runId: 1, record: record({ returned: 35, selected: 4, rejected: 12, deferred: 19, find: { idempotencyKey: "k1" } }) },
      { date: "2026-09-14", runId: 2, record: record({ returned: 37, selected: 5, rejected: 12, deferred: 20, find: { idempotencyKey: "k2" } }) },
    ];
    const out = renderWindow(varied);
    assert.match(out, /carry \*\*2\*\* distinct top selection/);
    assert.doesNotMatch(out, /one observation repeated/);
    assert.match(out, /held on all 2/);
  });
});

describe("the window is EXP-013's, not one this file chose", () => {
  it("matches the pre-registered dates in ops/EXPERIMENTS.md", () => {
    assert.equal(WINDOW.from, "2026-09-12");
    assert.equal(WINDOW.to, "2026-09-25");
    assert.equal(SELECTION_RATE_BAR, 0.25);
  });
});
