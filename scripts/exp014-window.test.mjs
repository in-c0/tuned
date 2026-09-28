#!/usr/bin/env node --test
// The positive control comes first and it is the real trap: the day Fork F was registered to
// catch, which the registration itself says this experiment "would have mis-read as Fork B".
// A grader that cannot redden on the mistake it was built to prevent is decoration.
//
// Every threshold asserted here is quoted from ops/EXPERIMENTS.md § EXP-014 § Forks. If a
// future amendment moves one, these tests are what should go red — that is the point of pinning
// them, and a test edited to agree with a changed fork is a fit, not a pass.

import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import {
  FORK_A_REFERRED_MAX,
  FORK_A_VIEW_FLOOR,
  FORK_D_VIEW_MAX,
  WINDOW,
  countsFor,
  daysInWindow,
  gradeDay,
  gradeWindow,
  render,
} from "./exp014-window.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** A day's counters, with the liveness signal alive by default so a test that is not about Fork E
 *  does not have to restate it. Fork E's branch is exercised deliberately below. */
const day = (over = {}) => ({
  item_view: 0,
  item_view_bot: 0,
  item_view_onsite: 0,
  item_view_referred: 0,
  item_view_search: 0,
  item_view_search_bot: 2,
  item_render: 0,
  item_render_bot: 0,
  ...over,
});

/** A snapshot carrying exactly the rows given, generated late enough that `through` is complete. */
const snapshot = (generatedAt, rows) => ({
  generated_at: generatedAt,
  daily: rows.map(([d, name, count]) => ({ day: d, name, count })),
});

describe("Fork F — a referrer with nothing behind it", () => {
  it("grades a search referrer with no render as F, which is the mis-reading it was registered to prevent", () => {
    const graded = gradeDay(day({ item_view: 300, item_view_search: 5, item_view_referred: 5, item_render: 0 }));
    assert.equal(graded.fork, "F");
    assert.notEqual(graded.fork, "B", "half of Fork B is Fork F, not a weak Fork B");
  });

  it("grades a non-search referrer with no render as F too, not as C", () => {
    const graded = gradeDay(day({ item_view: 90, item_view_referred: 4, item_render: 0 }));
    assert.equal(graded.fork, "F");
    assert.notEqual(graded.fork, "C");
  });

  it("does not fire on a day with no referrer at all, however little rendered", () => {
    // 2026-09-27 as production actually wrote it: 105 views, no referrer, nothing rendered.
    // Fork F needs a referrer; a day without one is Fork A's population, not F's.
    const graded = gradeDay(day({ item_view: 105, item_view_bot: 84, item_view_search_bot: 18 }));
    assert.equal(graded.fork, "A-CONSISTENT");
  });
});

describe("Fork B — both halves, on the same whole day", () => {
  it("grades a search referrer corroborated by a render as B", () => {
    assert.equal(gradeDay(day({ item_view: 120, item_view_search: 3, item_view_referred: 3, item_render: 7 })).fork, "B");
  });

  it("requires the render on the SAME day — a render of zero is F however large the referrer", () => {
    assert.equal(gradeDay(day({ item_view: 5000, item_view_search: 900, item_render: 0 })).fork, "F");
  });

  it("fires on a single search referrer, because the registered bar is >= 1", () => {
    assert.equal(gradeDay(day({ item_view: 60, item_view_search: 1, item_view_referred: 1, item_render: 1 })).fork, "B");
  });
});

describe("Fork C — an inbound link that is not search", () => {
  it("grades a referred, unsearched, rendered day as C", () => {
    assert.equal(gradeDay(day({ item_view: 40, item_view_referred: 3, item_view_search: 0, item_render: 2 })).fork, "C");
  });

  it("is not reached when the referrer is a search engine — that is B", () => {
    assert.equal(gradeDay(day({ item_view: 40, item_view_referred: 3, item_view_search: 3, item_render: 2 })).fork, "B");
  });
});

describe("Fork E — the loop's own liveness detector, and the half a snapshot cannot decide", () => {
  it("withholds the grade when item_view_search_bot is 0, naming the fact it lacks", () => {
    const graded = gradeDay(day({ item_view: 500, item_view_search: 9, item_render: 9, item_view_search_bot: 0 }));
    assert.equal(graded.fork, "E-UNDECIDED");
    assert.equal(graded.gradeable, false);
    assert.match(graded.why, /verify-production\.yml/);
  });

  it("excludes Fork E outright on a single bot write, which needs no external fact", () => {
    assert.notEqual(gradeDay(day({ item_view: 10, item_view_search_bot: 1 })).fork, "E-UNDECIDED");
  });

  it("takes precedence over every other fork, because a day under it grades nothing on A-D", () => {
    // Would be a clean Fork B on its unsuffixed names alone. The instrument's silence outranks it.
    assert.equal(gradeDay(day({ item_view_search: 4, item_render: 4, item_view_search_bot: 0 })).fork, "E-UNDECIDED");
  });
});

describe("Forks A and D are settled over the window, never on one day", () => {
  it("reports a quiet day as consistent with both, rather than picking one", () => {
    assert.equal(gradeDay(day({ item_view: 3 })).fork, "AD-CONSISTENT");
  });

  it("holds Fork A's referred bar at the registered maximum", () => {
    assert.equal(FORK_A_REFERRED_MAX, 2);
    // AT the bar with a render is Fork A's population: a referrer arrived and a document ran,
    // so Fork F does not apply and 2 is within A's bar.
    assert.equal(gradeDay(day({ item_view: 100, item_view_referred: 2, item_render: 1 })).fork, "C");
    // Over the bar WITH a render is Fork C, which is not Fork A either way.
    assert.equal(gradeDay(day({ item_view: 100, item_view_referred: 3, item_render: 1 })).fork, "C");
    // A referred day with NOTHING rendered is Fork F at the bar and over it alike — the
    // registration overlaps Fork A here, and F is the stricter, more specific label.
    assert.equal(gradeDay(day({ item_view: 100, item_view_referred: 2 })).fork, "F");
    assert.equal(gradeDay(day({ item_view: 100, item_view_referred: 3 })).fork, "F");
    // A day with no referrer at all is where Fork A's bar is actually decided.
    assert.equal(gradeDay(day({ item_view: 100, item_view_referred: 0 })).fork, "A-CONSISTENT");
  });

  it("holds Fork D's view bar at the registered maximum", () => {
    assert.equal(FORK_D_VIEW_MAX, 5);
    assert.equal(gradeDay(day({ item_view: 5 })).fork, "AD-CONSISTENT");
    assert.equal(gradeDay(day({ item_view: 6 })).fork, "A-CONSISTENT");
  });

  it("never returns a bare A or D from one day, however emphatic that day is", () => {
    for (const counts of [day({ item_view: 9999 }), day({ item_view: 0 })]) {
      assert.ok(!["A", "D"].includes(gradeDay(counts).fork));
    }
  });
});

describe("the forks are exhaustive once Fork E is decided, and the fallback branch is unreachable", () => {
  it("classifies every day in a bounded domain, so UNCLASSIFIED never fires", () => {
    // The proof in the source is over four variables; this exhausts them well past every
    // registered bar. If an amendment opens a hole, this is what goes red.
    let seen = new Set();
    for (const item_view of [0, 1, 5, 6, 50, 51, 105, 1000]) {
      for (const item_view_search of [0, 1, 2, 9]) {
        for (const item_view_referred of [0, 1, 2, 3, 9]) {
          for (const item_render of [0, 1, 7]) {
            // A search referrer is a strict subset of the referred axis by construction, so
            // skip the combinations production cannot write.
            if (item_view_search > item_view_referred) continue;
            const graded = gradeDay(
              day({ item_view, item_view_search, item_view_referred, item_render })
            );
            assert.notEqual(
              graded.fork,
              "UNCLASSIFIED",
              `hole at view=${item_view} search=${item_view_search} referred=${item_view_referred} render=${item_render}`
            );
            seen.add(graded.fork);
          }
        }
      }
    }
    // And the domain really does reach every branch it claims to, or the sweep above proves
    // nothing about the branches it never visited.
    for (const fork of ["F", "B", "C", "A-CONSISTENT", "AD-CONSISTENT"]) {
      assert.ok(seen.has(fork), `the sweep never reached ${fork}`);
    }
  });

  it("still reports UNCLASSIFIED if a counts object reaches the branch directly", () => {
    // Defensive: the branch exists for an amendment that breaks the proof above. A negative
    // count cannot come from a counter, which is exactly why it reaches the branch — every
    // fork's test on `item_view_search` fails at once when the value is neither 0 nor >= 1.
    const graded = gradeDay(day({ item_view: 100, item_view_search: -1 }));
    assert.equal(graded.fork, "UNCLASSIFIED");
    assert.equal(graded.gradeable, false);
  });

  it("reports an empty snapshot as undecided on Fork E rather than unclassified", () => {
    const reading = gradeWindow(
      { generated_at: "2026-09-29T01:00:00.000Z", daily: [] },
      { from: "2026-09-27", to: "2026-09-28" }
    );
    assert.equal(reading.verdict, "E-UNDECIDED");
  });
});

describe("the window reading respects the clock, and delegates the clock to metrics-window", () => {
  it("grades no day the snapshot does not report completely", () => {
    const reading = gradeWindow(
      snapshot("2026-09-28T05:24:58.372Z", [
        ["2026-09-27", "item_view", 105],
        ["2026-09-27", "item_view_search_bot", 18],
        ["2026-09-28", "item_view", 21],
        ["2026-09-28", "item_view_search", 900],
        ["2026-09-28", "item_view_render", 900],
      ])
    );
    assert.equal(reading.through, "2026-09-27");
    assert.deepEqual(reading.days.map((d) => d.day), ["2026-09-27"]);
    assert.ok(reading.outstanding.includes("2026-09-28"), "a partial day is outstanding, not graded");
    assert.notEqual(reading.verdict, "B", "a partial day may not settle a fork");
  });

  it("reports NO-DATA before the window's first whole day exists", () => {
    const reading = gradeWindow(snapshot("2026-09-27T05:00:00.000Z", []));
    assert.equal(reading.verdict, "NO-DATA");
  });

  it("covers exactly the seven registered days", () => {
    assert.equal(WINDOW.from, "2026-09-27");
    assert.equal(WINDOW.to, "2026-10-03");
    assert.equal(daysInWindow().length, 7);
    assert.ok(!daysInWindow().includes("2026-09-26"), "the deploy day is excluded by registration");
  });
});

describe("A and D cannot be concluded early; B, C and F can", () => {
  const sevenQuietDays = () =>
    daysInWindow().flatMap((d) => [
      [d, "item_view", 105],
      [d, "item_view_search_bot", 18],
    ]);

  it("returns A-PENDING while any whole day is outstanding", () => {
    const reading = gradeWindow(
      snapshot("2026-09-29T01:00:00.000Z", sevenQuietDays()),
      { from: "2026-09-27", to: "2026-10-03" }
    );
    assert.equal(reading.verdict, "A-PENDING");
    assert.equal(reading.outstanding.length, 5);
  });

  it("returns A once every whole day is in and the view floor was met", () => {
    const reading = gradeWindow(snapshot("2026-10-04T01:00:00.000Z", sevenQuietDays()));
    assert.equal(reading.verdict, "A");
    assert.equal(FORK_A_VIEW_FLOOR, 50);
  });

  it("withholds A when no day ever passed the view floor", () => {
    const rows = daysInWindow().flatMap((d) => [
      [d, "item_view", 20],
      [d, "item_view_search_bot", 18],
    ]);
    const reading = gradeWindow(snapshot("2026-10-04T01:00:00.000Z", rows));
    assert.equal(reading.verdict, "NEITHER-A-NOR-D");
  });

  it("returns D when item_view never passes its bar on any whole day", () => {
    const rows = daysInWindow().flatMap((d) => [
      [d, "item_view", 2],
      [d, "item_view_search_bot", 18],
    ]);
    assert.equal(gradeWindow(snapshot("2026-10-04T01:00:00.000Z", rows)).verdict, "D");
  });

  it("settles Fork B off a single day, five days before the window closes", () => {
    const rows = [
      ["2026-09-27", "item_view", 105],
      ["2026-09-27", "item_view_search_bot", 18],
      ["2026-09-28", "item_view", 80],
      ["2026-09-28", "item_view_search", 3],
      ["2026-09-28", "item_render", 3],
      ["2026-09-28", "item_view_search_bot", 4],
    ];
    const reading = gradeWindow(snapshot("2026-09-29T01:00:00.000Z", rows));
    assert.equal(reading.verdict, "B");
    assert.ok(reading.outstanding.length > 0, "B is concludable with days still outstanding");
  });

  it("grades a Fork F day under Fork A, which is Fork F's own registered next action", () => {
    const rows = [
      ["2026-09-27", "item_view", 105],
      ["2026-09-27", "item_view_search_bot", 18],
      ["2026-09-28", "item_view", 80],
      ["2026-09-28", "item_view_search", 3],
      ["2026-09-28", "item_view_search_bot", 4],
    ];
    const reading = gradeWindow(snapshot("2026-09-29T01:00:00.000Z", rows));
    assert.notEqual(reading.verdict, "B", "a referrer with no render is never Fork B");
    assert.notEqual(reading.verdict, "F", "Fork F defers to Fork A rather than being a verdict");
    assert.equal(reading.verdict, "A-PENDING");
    assert.deepEqual(reading.forkFDays, ["2026-09-28"], "the F day is reported, not silently folded");
    assert.match(render(reading), /never an arrival/);
  });

  it("lets a Fork F day satisfy Fork A even with a referrer count over Fork A's own bar", () => {
    const rows = daysInWindow().flatMap((d) => [
      [d, "item_view", 105],
      [d, "item_view_referred", 40],
      [d, "item_view_search_bot", 18],
    ]);
    const reading = gradeWindow(snapshot("2026-10-04T01:00:00.000Z", rows));
    assert.equal(reading.verdict, "A");
    assert.equal(reading.forkFDays.length, 7);
  });

  it("prefers B over a Fork F day elsewhere in the window, because B's next action outranks", () => {
    const rows = [
      ["2026-09-27", "item_view", 80],
      ["2026-09-27", "item_view_search", 3],
      ["2026-09-27", "item_view_search_bot", 4],
      ["2026-09-28", "item_view", 80],
      ["2026-09-28", "item_view_search", 3],
      ["2026-09-28", "item_render", 3],
      ["2026-09-28", "item_view_search_bot", 4],
    ];
    assert.equal(gradeWindow(snapshot("2026-09-29T01:00:00.000Z", rows)).verdict, "B");
  });
});

describe("the reading this run actually took, against the snapshot in the repository", () => {
  it("grades 2026-09-27 as consistent with Fork A and the window as A-PENDING", async () => {
    const { loadSnapshot } = await import("./metrics-window.mjs");
    const live = loadSnapshot(path.join(REPO_ROOT, "ops", "metrics", "latest.json"));
    const reading = gradeWindow(live);
    const first = reading.days.find((d) => d.day === "2026-09-27");
    // The snapshot moves forward every day, so assert only what cannot change about a day that
    // has closed: if 2026-09-27 is present, it is the reading this run recorded.
    if (first) {
      assert.equal(first.counts.item_view, 105);
      assert.equal(first.counts.item_view_search, 0);
      assert.equal(first.counts.item_view_referred, 0);
      assert.equal(first.counts.item_render, 0);
      assert.equal(first.counts.item_view_search_bot, 18);
      assert.equal(first.fork, "A-CONSISTENT");
    }
    assert.ok(!["B", "C"].includes(reading.verdict) || first === undefined);
    assert.match(render(reading), /EXP-014 — window 2026-09-27 → 2026-10-03/);
  });

  it("names every counter it reads with countsFor, so an absent row is zero and not undefined", () => {
    const counts = countsFor({ daily: [] }, "2026-09-27");
    for (const value of Object.values(counts)) assert.equal(value, 0);
  });
});
