#!/usr/bin/env node --test
// The positive control is the record production actually wrote on 2026-09-22: a green run, an
// uploaded artifact, and a screen that decided nothing. A reading that counts that day as a
// legitimate quiet cycle is the failure this file exists to prevent — it is the difference
// between "the bar refused everything" and "the bar was never asked", and EXP-013's threshold 2
// is graded "on every live screen", so which of the two it was decides whether there is a screen
// to grade at all.

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  FRESHNESS_BAR_HOURS,
  SELECTION_RATE_BAR,
  WINDOW,
  gradeScreen,
  publicationCadence,
  renderCadence,
  renderWindow,
  schedulePublishes,
  screenState,
} from "./exp013-window.mjs";

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

// -------------------------------------------------------------------------------------------
// Threshold 4. The positive control is the registry production actually wrote: a 203.8h interval
// between items 281 and 282, against a 72h bar, on a window whose publisher was turned off on
// day 1. Run 186 recorded threshold 4 as "not computable from a screening record ... graded
// against production" and stopped there. These tests hold the distinction that claim missed:
// confirming freshness HELD needs production, establishing that it LAPSED needs only arithmetic
// on committed timestamps.
// -------------------------------------------------------------------------------------------

/** A nomination shaped like the ones qa/nominations/ carries. */
const nom = (itemId, publishedAt, handle = "sportstech") => ({ itemId, handle, publishedAt });

/** The real shape: item 279 lands just before the window, then the six inside it. */
const REGISTRY = [
  nom(279, "2026-09-11T22:17:48.081Z"),
  nom(280, "2026-09-12T04:29:56.560Z"),
  nom(281, "2026-09-12T10:21:50.674Z"),
  nom(282, "2026-09-20T22:07:44.418Z"),
  nom(283, "2026-09-21T10:04:55.788Z"),
  nom(284, "2026-09-22T10:17:01.006Z"),
  nom(285, "2026-09-23T10:17:38.585Z"),
];

const NOW = Date.parse("2026-09-23T22:30:00.000Z");

describe("threshold 4 is failed from the repository, not deferred to a site this session cannot read", () => {
  it("finds the 203.8h interval production actually left between items 281 and 282", () => {
    const c = publicationCadence(REGISTRY, { now: NOW });
    assert.equal(c.count, 6);
    assert.equal(c.widest.from.itemId, 281);
    assert.equal(c.widest.to.itemId, 282);
    assert.equal(c.widest.hours.toFixed(1), "203.8");
    assert.equal(c.exceedsBar, true);
  });

  it("starts the first interval at the newest item when the window OPENED, not at the window edge", () => {
    // Item 279 is outside the window and is still what a reader saw on 2026-09-12 at 00:00Z.
    // Dropping it shortens the leading interval and understates the age the threshold is about.
    const c = publicationCadence(REGISTRY, { now: NOW });
    assert.equal(c.newestAtOpen.itemId, 279);
    assert.equal(c.intervals[0].from.itemId, 279);
    assert.equal(c.intervals[0].to.itemId, 280);
  });

  it("counts only this handle, and only publications inside the window", () => {
    const c = publicationCadence(
      [...REGISTRY, nom(999, "2026-09-15T00:00:00.000Z", "wearables"), nom(998, "2026-10-01T00:00:00.000Z")],
      { now: NOW }
    );
    assert.equal(c.count, 6);
    assert.ok(!c.publications.some((n) => n.itemId === 999 || n.itemId === 998));
  });
});

describe("an interval still running can establish a failure and can never establish a pass", () => {
  it("marks the trailing interval open and reports it as a lower bound", () => {
    // Nothing since 2026-09-12; the window is still open, so the gap can only grow.
    const c = publicationCadence([nom(279, "2026-09-11T22:17:48.081Z"), nom(280, "2026-09-12T04:29:56.560Z")], {
      now: Date.parse("2026-09-20T04:29:56.560Z"),
    });
    assert.equal(c.trailing.open, true);
    assert.equal(c.trailing.to, null);
    assert.equal(c.exceedsBar, true);
    const out = renderCadence(c, schedulePublishes("          PUBLISH: ${{ inputs.publish }}"));
    assert.match(out, /at least \*\*192\.0h\*\*/);
  });

  it("never calls a registry with no lapse a pass", () => {
    const tight = [nom(279, "2026-09-11T22:00:00.000Z"), nom(280, "2026-09-12T04:00:00.000Z")];
    const c = publicationCadence(tight, { now: Date.parse("2026-09-12T06:00:00.000Z") });
    assert.equal(c.exceedsBar, false);
    const out = renderCadence(c, schedulePublishes("          PUBLISH: ${{ inputs.publish }}"));
    assert.match(out, /\*\*That is not a pass\.\*\*/);
    assert.match(out, /does not read production/);
  });

  it("holds when the interval is exactly the bar", () => {
    // Graded through renderCadence rather than by re-asserting the operator on the number, which
    // is the defect run 186 found in its own boundary test: `!(x > BAR)` restates `>` instead of
    // exercising it, so a `>` quietly widened to `>=` still passes.
    const c = publicationCadence([nom(279, "2026-09-11T22:00:00.000Z"), nom(280, "2026-09-14T22:00:00.000Z")], {
      now: Date.parse("2026-09-14T22:00:00.000Z"),
    });
    assert.equal(c.widest.hours, 72);
    const out = renderCadence(c, schedulePublishes("          PUBLISH: ${{ inputs.publish }}"));
    assert.match(out, /\*\*That is not a pass\.\*\*/);
    assert.doesNotMatch(out, /against a \*\*72h\*\* bar/);
  });
});

describe("whether the schedule may publish is read off the workflow, never asserted", () => {
  it("reads the disarmed form production is running today", () => {
    const s = schedulePublishes("        env:\n          PUBLISH: ${{ inputs.publish }}\n");
    assert.equal(s.armed, false);
    assert.match(s.why, /schedule event carries none/);
  });

  it("reads the armed form the workflow calls 'one word' away", () => {
    const s = schedulePublishes(
      "          PUBLISH: ${{ github.event_name == 'schedule' && 'true' || inputs.publish }}\n"
    );
    assert.equal(s.armed, true);
    assert.match(s.why, /a scheduled screen publishes/);
  });

  it("returns null, not 'disarmed', when the line is absent", () => {
    // A missing line is a fact about this reader; "disarmed" is a fact about the workflow. L-104:
    // an absence read as an observation is the one error nothing outside the instrument catches.
    const s = schedulePublishes("jobs:\n  scout:\n    runs-on: ubuntu-latest\n");
    assert.equal(s.armed, null);
    assert.match(s.why, /no `PUBLISH:` line found/);
    const c = publicationCadence(REGISTRY, { now: NOW });
    const out = renderCadence(c, s);
    assert.match(out, /\*\*unreadable\*\*/);
    // With the schedule unreadable, the mutual-exclusion paragraph must not be asserted.
    assert.doesNotMatch(out, /mutually exclusive/);
  });
});

describe("the interim reading names what its own number cannot mean", () => {
  it("says the failure is about the experiment rather than the agent", () => {
    const out = renderCadence(
      publicationCadence(REGISTRY, { now: NOW }),
      schedulePublishes("          PUBLISH: ${{ inputs.publish }}")
    );
    assert.match(out, /INTERIM, not graded here/);
    assert.match(out, /2\.8x/);
    assert.match(out, /Fork B's action and threshold 4 are mutually exclusive/);
    assert.match(out, /measures is the experiment, not the agent/);
  });

  it("carries the pre-registered bar, not one this file chose", () => {
    assert.equal(FRESHNESS_BAR_HOURS, 72);
  });
});
