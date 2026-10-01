#!/usr/bin/env node
// EXP-014's fork, computed from the snapshot rather than read off it by eye.
//
// WHY THIS FILE EXISTS. EXP-014 asks whether 2026-09-26's off-site find-page views were a
// crawler or the first search arrivals. Its window is 2026-09-27 → 2026-10-03, whole UTC days,
// read from ops/metrics/latest.json, and its answer is one of six forks whose next actions
// point in opposite directions. Fork B's is the strongest sentence in ops/EXPERIMENTS.md —
// "the first evidenced arrival channel that needs nobody's permission, and it outranks every
// other candidate available to the loop" — and there are days left after the window closes in
// which a run could act on it. Fork A's is to retire a published number. Fork F's is to grade
// the day as Fork A and change nothing.
//
// The forks exist only as prose, and nothing computes them. That is the shape L-121 was written
// about one turn earlier: when a rule lives as a principle in prose and as a proxy in code, the
// proxy is what runs. Here there is no proxy at all, so what runs is whichever run happens to
// take the reading, by eye, against a definition that has been amended twice.
//
// AND THE AMENDMENTS ARE THE PART THAT IS EASY TO GET WRONG. Fork B is a conjunction — a search
// referrer AND `item_render` >= 1 on the SAME whole day — and Fork F is precisely the trap of
// satisfying the first half alone. Run 198 registered Fork F because it caught ITSELF about to
// read half of B as B; the registered text says so in as many words: F is "the fork this
// experiment would have mis-read as Fork B before the amendment, which is why it is registered
// rather than left to the grading run's judgement." A judgement that was unsafe for the run
// that wrote it down is not safer for a run that has not read it.
//
// WHAT THIS DELIBERATELY DOES NOT DO.
//
//  * It moves no threshold and rewrites no registered text. Every number below is quoted from
//    ops/EXPERIMENTS.md § EXP-014 § Forks, including Amendment 1's `item_render` conjunct. If
//    this file and that file disagree, that file is right and this one is the defect.
//  * It does not decide whether a day is admissible. That is scripts/metrics-window.mjs, which
//    answers the one question about the clock, and this file calls it rather than re-deriving
//    it. A partial final day is not graded here at all.
//  * It does not assert Fork E. Fork E is "`item_view_search_bot` = 0 on a day
//    verify-production.yml ran", and a snapshot cannot say whether that workflow ran. What the
//    snapshot CAN say is the half that needs no external fact: `item_view_search_bot` >= 1
//    means the instrument wrote, so Fork E is excluded outright. On a zero the day is reported
//    as undecided, naming the one fact a caller must supply. Fabricating that fact here would
//    make the loop's own liveness detector answer itself.
//  * It draws no conclusion about demand. No fork produces a user or a dollar, EXP-014 says so
//    under its own heading, and nothing here is an arrival, a visitor or a subscriber.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { completeThrough, loadSnapshot, parseDay, dayOf } from "./metrics-window.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_SNAPSHOT = path.join(REPO_ROOT, "ops", "metrics", "latest.json");
const DAY_MS = 86_400_000;

/** EXP-014's registered window. Whole UTC days, inclusive. 2026-09-26 is the deploy day and is
 *  excluded by registration, not by preference. */
export const WINDOW = { from: "2026-09-27", to: "2026-10-03" };

/** The counters each fork is written over. Unsuffixed unless a fork names the `_bot` half. */
export const NAMES = [
  "item_view",
  "item_view_bot",
  "item_view_onsite",
  "item_view_referred",
  "item_view_search",
  "item_view_search_bot",
  "item_render",
  "item_render_bot",
];

/**
 * Amendment 2's browser brackets on `item_render` — the observations that make a silent beacon
 * mean "nothing rendered the page" rather than "the counter is dead".
 *
 * WHY THIS LIVES IN CODE AND NOT ONLY IN PROSE. Amendment 2 (run 201) imposes a gate on the
 * reading, not on any fork: *"No day may be graded Fork B or Fork C — both of which require
 * `item_render` >= 1 — without a dated browser observation of `item_render` bracketing that day,
 * and a run that grades Fork F must cite one too, because Fork F's whole content is that the
 * beacon was working and nothing ran the document."* Until this change that gate existed as one
 * paragraph inside a 4,000-line file, and the debt it created ("still owed: the far-side
 * bracket") was tracked in an execution report. This file printed `VERDICT B` with no idea the
 * gate existed, and run 210 published that verdict with only the near-side observation taken.
 *
 * That is the same shape as L-76, L-97 and L-123 — an obligation filed where no run is obliged to
 * read it — and L-130 one run ago is its sibling: a number is only as good as the proof behind
 * the thing its label names. So the gate is computed here and printed beside the verdict, and a
 * B, C or F reading that is not bracketed on both sides prints PROVISIONAL rather than silently
 * reading as final.
 *
 * WHAT A BRACKET IS AND IS NOT. Each entry is one dispatch of `qa/find-instrument.spec.mjs`
 * against production in which a real browser loaded a find page and `item_render` fired and was
 * accepted. Its user-agent is headless, so by EXP-014's own binding clause every increment lands
 * in `item_render_bot` and **never** in the unsuffixed names graded above — which is exactly what
 * makes it dispatchable inside an open window. A bracket establishes that the instrument was
 * alive. It establishes **nothing** about who arrives, and no fork may be graded from it.
 *
 * Entries are append-only and each cites the run whose log carries its `EVIDENCE` line. No entry
 * may be written from anything but a green run of that spec.
 */
export const RENDER_BRACKETS = [
  {
    observed_at: "2026-09-28T04:24:41Z",
    run: "https://github.com/in-c0/tuned/actions/runs/36377540765",
    find_page: "/sportstech/289",
    item_render: 1,
    status: 204,
    note:
      "Near-side bracket, taken by run 201 in the same cycle that registered Amendment 2. " +
      "`observed_at` is that run's `Run browser spec` step completion from the jobs API rather " +
      "than its EVIDENCE line's own instant — a later instant than the observation, so it can " +
      "only ever weaken a near-side claim, never strengthen one.",
  },
  {
    observed_at: "2026-10-01T22:25:42.707Z",
    run: "https://github.com/in-c0/tuned/actions/runs/36934919529",
    find_page: "/sportstech/293",
    item_render: 1,
    status: 204,
    note: "Far-side bracket, owed since Amendment 2 and taken by run 212 against build 7897d36.",
  },
];

/**
 * The brackets standing either side of one whole UTC day.
 *
 * "Bracketing that day" is read strictly: the near side is an observation at or before the day
 * BEGINS and the far side one at or after it ENDS. An observation taken partway through a day
 * says the beacon lived at that instant, which is not the same claim as "the beacon lived across
 * this day" — and the weaker reading is the one that could let a dead-for-six-hours beacon pass
 * as alive. The strict rule is also what keeps the debt visible: today's far-side observation
 * brackets 2026-09-30 and does **not** bracket 2026-10-01, which is the honest state.
 *
 * @returns {{ near: object|null, far: object|null, bracketed: boolean }}
 */
export function bracketFor(day, brackets = RENDER_BRACKETS) {
  const begins = parseDay(day);
  const ends = begins + DAY_MS;
  const sorted = [...brackets].sort((a, b) => Date.parse(a.observed_at) - Date.parse(b.observed_at));
  const before = sorted.filter((b) => Date.parse(b.observed_at) <= begins);
  const after = sorted.filter((b) => Date.parse(b.observed_at) >= ends);
  return {
    near: before.length ? before[before.length - 1] : null,
    far: after.length ? after[0] : null,
    bracketed: before.length > 0 && after.length > 0,
  };
}

/** The forks Amendment 2's gate applies to: the two that require a render, and the one defined
 *  by its absence. Every other fork is read off counters the gate says nothing about. */
export const BRACKET_GATED_FORKS = ["B", "C", "F"];

/** Fork A's per-day bar and its window-level one, quoted from the registration. */
export const FORK_A_REFERRED_MAX = 2;
export const FORK_A_VIEW_FLOOR = 50;
/** Fork D's per-day bar. */
export const FORK_D_VIEW_MAX = 5;

/** Every whole UTC day in `[from, to]`, in order. */
export function daysInWindow(from = WINDOW.from, to = WINDOW.to) {
  const days = [];
  for (let ms = parseDay(from); ms <= parseDay(to); ms += DAY_MS) days.push(dayOf(ms));
  return days;
}

/** Daily rows folded to `{ [day]: { [name]: count } }`. */
function byDay(daily) {
  const days = {};
  for (const row of daily ?? []) {
    if (!row || typeof row.day !== "string") continue;
    (days[row.day] ??= {})[row.name] = row.count;
  }
  return days;
}

/**
 * One day's counters, with absence read as zero.
 *
 * Absence and zero are the same reading HERE and only here: a counter with no row had no events
 * that day, which is what every fork's `= 0` means. ops/METRICS.md keeps the other distinction —
 * a name absent because it did not yet exist — and every name above existed from 2026-09-27,
 * which is the window's first day.
 */
export function countsFor(snapshot, day) {
  const rows = byDay(snapshot?.daily)[day] ?? {};
  const counts = {};
  for (const name of NAMES) counts[name] = rows[name] ?? 0;
  return counts;
}

/**
 * The fork one whole UTC day falls under, from that day's counters alone.
 *
 * The order below is not a tie-break and must not be read as one: B and C require
 * `item_render` >= 1 and F requires it = 0, so F is disjoint from both by construction. The
 * order is the order the registration reasons in, and the test file pins each branch against
 * the day that should reach it.
 *
 * @returns {{ fork: string, gradeable: boolean, why: string }}
 *   `fork` is one of E-UNDECIDED, F, B, C, A-CONSISTENT, D-CONSISTENT, AD-CONSISTENT,
 *   UNCLASSIFIED. A day may satisfy Fork A's and Fork D's per-day bars at once — those two are
 *   settled over the whole window, never on one day — so AD-CONSISTENT is a real state and not
 *   an ambiguity to be resolved here.
 */
export function gradeDay(counts) {
  const view = counts.item_view;
  const search = counts.item_view_search;
  const referred = counts.item_view_referred;
  const render = counts.item_render;
  const searchBot = counts.item_view_search_bot;

  // Fork E first, because a day under it "grades nothing" on A-D. Only the affirmative half is
  // decidable from a snapshot: a write proves the instrument lives. A zero needs the fact that
  // verify-production.yml ran, which no counter here reports.
  if (searchBot === 0) {
    return {
      fork: "E-UNDECIDED",
      gradeable: false,
      why:
        "item_view_search_bot = 0. Fork E iff verify-production.yml ran this day — a fact no " +
        "counter in this snapshot reports. If it ran, the instrument is dead and this day grades " +
        "nothing on A-D; if it did not, this day is silent on Fork E and A-D may be read.",
    };
  }

  // Fork F — a referrer arrived and no client ran the document.
  if (render === 0 && (search >= 1 || referred >= 1)) {
    return {
      fork: "F",
      gradeable: true,
      why:
        `item_render = 0 with item_view_search = ${search} and item_view_referred = ${referred}: ` +
        "a header arrived and nothing rendered the page. Not an arrival, and not a weak Fork B.",
    };
  }

  // Fork B — a search referrer corroborated by a rendered document, on the same whole day.
  if (search >= 1 && render >= 1) {
    return {
      fork: "B",
      gradeable: true,
      why: `item_view_search = ${search} and item_render = ${render} on the same whole day.`,
    };
  }

  // Fork C — an inbound link that is not search, corroborated the same way.
  if (referred >= 1 && search === 0 && render >= 1) {
    return {
      fork: "C",
      gradeable: true,
      why: `item_view_referred = ${referred}, item_view_search = 0, item_render = ${render}.`,
    };
  }

  // Forks A and D are settled over the window. What one day can say is whether it still
  // satisfies their bars, and a day can satisfy both.
  const a = search === 0 && referred <= FORK_A_REFERRED_MAX;
  const d = view <= FORK_D_VIEW_MAX;
  if (a && d) {
    return {
      fork: "AD-CONSISTENT",
      gradeable: true,
      why: `item_view_search = 0, item_view_referred = ${referred} <= ${FORK_A_REFERRED_MAX}, and item_view = ${view} <= ${FORK_D_VIEW_MAX}.`,
    };
  }
  if (a) {
    return {
      fork: "A-CONSISTENT",
      gradeable: true,
      why: `item_view_search = 0, item_view_referred = ${referred} <= ${FORK_A_REFERRED_MAX}, item_view = ${view}, item_render = ${render}.`,
    };
  }
  if (d) {
    return {
      fork: "D-CONSISTENT",
      gradeable: true,
      why: `item_view = ${view} <= ${FORK_D_VIEW_MAX}, but item_view_referred = ${referred} > ${FORK_A_REFERRED_MAX}.`,
    };
  }

  // Not a tidy else, and it is provably unreachable — which is worth stating rather than
  // leaving as a shrug. Once Fork E is decided, take the two cases on `item_view_search`:
  // at >= 1 the day is B when something rendered and F when nothing did; at 0 a day that fails
  // Fork A's bar has `item_view_referred` >= 3, which is C when something rendered and F when
  // nothing did. Both are covered, so nothing falls through. The branch is kept because the
  // proof is over the code as written and an amendment could break it, and the test file
  // exhausts a bounded domain to say so. A day that reaches here is a hole in the
  // registration rather than a reading, so it is reported loudly and the CLI exits non-zero.
  return {
    fork: "UNCLASSIFIED",
    gradeable: false,
    why:
      `no registered fork covers item_view = ${view}, item_view_search = ${search}, ` +
      `item_view_referred = ${referred}, item_render = ${render}. The registration has a hole.`,
  };
}

/**
 * The window's reading: every admissible whole day graded, and the verdict those days support.
 *
 * B, C and F fire on ANY single day and are therefore concludable before the window closes.
 * A and D quantify over EVERY whole day and cannot be concluded until the last one is on disk —
 * so while days are outstanding this returns A-PENDING or D-PENDING, never A or D. That
 * asymmetry is the registration's, not this file's.
 */
export function gradeWindow(snapshot, options = {}) {
  const from = options.from ?? WINDOW.from;
  const to = options.to ?? WINDOW.to;
  const through = completeThrough(snapshot?.generated_at);
  const all = daysInWindow(from, to);
  const complete = all.filter((day) => day <= through);
  const outstanding = all.filter((day) => day > through);

  const brackets = options.brackets ?? RENDER_BRACKETS;
  const days = complete.map((day) => {
    const counts = countsFor(snapshot, day);
    const graded = gradeDay(counts);
    return { day, counts, ...graded, bracket: bracketFor(day, brackets) };
  });

  // Computed before any return, so no path out of this function can drop the gate. A day graded
  // B, C or F without both sides owes an observation; every other fork is silent on it.
  const bracketOwed = days
    .filter((d) => BRACKET_GATED_FORKS.includes(d.fork) && !d.bracket.bracketed)
    .map((d) => ({ day: d.day, fork: d.fork, missing: d.bracket.near ? "far" : d.bracket.far ? "near" : "both" }));

  const reading = { from, to, through, days, outstanding, forkFDays: [], bracketOwed, bracket: null, verdict: null, why: "" };

  if (days.length === 0) {
    reading.verdict = "NO-DATA";
    reading.why = `the snapshot is complete through ${through}, which is before ${from}. No whole day of the window exists yet.`;
    return reading;
  }

  const unclassified = days.filter((d) => d.fork === "UNCLASSIFIED");
  if (unclassified.length > 0) {
    reading.verdict = "UNCLASSIFIED";
    reading.why = `${unclassified.map((d) => d.day).join(", ")} fall under no registered fork.`;
    return reading;
  }

  // B and C are the only forks that settle the window off one day, and B is tried first because
  // its next action is registered as outranking every other candidate available to the loop.
  for (const fork of ["B", "C"]) {
    const hit = days.find((d) => d.fork === fork);
    if (hit) {
      reading.verdict = fork;
      reading.why = `${hit.day} satisfies Fork ${fork} on its own, and Forks B and C are registered over ANY whole day.`;
      // Amendment 2's gate attaches to the day the verdict rests on, not to the window.
      reading.bracket = { day: hit.day, ...hit.bracket };
      return reading;
    }
  }

  // Fork F is NOT a window verdict, and this is the registration's instruction rather than a
  // judgement made here. Fork F's next action opens "grade the day under **Fork A** and take
  // Fork A's next action" — so an F day is an A day for the window, carrying one extra duty:
  // record that a referrer with no render must never be published as an arrival. Folding it in
  // is what lets Fork A's "every whole day" quantifier be satisfied by a day whose referrer
  // count is over A's own bar, which is exactly the case F was written for.
  //
  // It also resolves an overlap the registration leaves open and this file must not paper over:
  // a day with `item_view_referred` of 1 or 2 and `item_render` = 0 satisfies Fork F AND Fork A's
  // per-day bars at the same time. The two agree on the action, so the overlap is harmless — but
  // it is an overlap, it is reported in `forkFDays`, and a later amendment should close it in
  // ops/EXPERIMENTS.md rather than here.
  reading.forkFDays = days.filter((d) => d.fork === "F").map((d) => d.day);

  const undecided = days.filter((d) => d.fork === "E-UNDECIDED");
  const readable = days.filter((d) => d.fork !== "E-UNDECIDED");
  if (readable.length === 0) {
    reading.verdict = "E-UNDECIDED";
    reading.why = `every complete day (${undecided.map((d) => d.day).join(", ")}) turns on whether verify-production.yml ran.`;
    return reading;
  }

  const aHolds = readable.every((d) => ["A-CONSISTENT", "AD-CONSISTENT", "F"].includes(d.fork));
  // Fork D is NOT given the same treatment: a Fork F day is graded under Fork A by name, and
  // reading it as Fork D instead would substitute a different fork's next action for the one the
  // registration wrote.
  const dHolds = readable.every((d) => d.fork === "D-CONSISTENT" || d.fork === "AD-CONSISTENT");
  const viewFloorMet = readable.some((d) => d.counts.item_view > FORK_A_VIEW_FLOOR);
  const suffix = undecided.length > 0 ? ` (${undecided.length} day(s) undecided on Fork E and excluded)` : "";

  if (outstanding.length > 0) {
    if (aHolds && viewFloorMet) {
      reading.verdict = "A-PENDING";
      reading.why = `every readable day so far satisfies Fork A's bars and item_view > ${FORK_A_VIEW_FLOOR} on at least one, but Fork A quantifies over every whole day and ${outstanding.length} remain${suffix}.`;
    } else if (dHolds) {
      reading.verdict = "D-PENDING";
      reading.why = `every readable day so far satisfies Fork D's bar, but Fork D quantifies over every whole day and ${outstanding.length} remain${suffix}.`;
    } else if (aHolds) {
      reading.verdict = "A-PENDING-NO-FLOOR";
      reading.why = `Fork A's per-day bars hold on every readable day, but no day has reached item_view > ${FORK_A_VIEW_FLOOR} and ${outstanding.length} remain${suffix}.`;
    } else {
      reading.verdict = "PENDING";
      reading.why = `no fork is settled and ${outstanding.length} whole day(s) remain${suffix}.`;
    }
    return reading;
  }

  if (dHolds) {
    reading.verdict = "D";
    reading.why = `item_view <= ${FORK_D_VIEW_MAX} on every whole day of the window${suffix}.`;
  } else if (aHolds && viewFloorMet) {
    reading.verdict = "A";
    reading.why = `item_view_search = 0 and item_view_referred <= ${FORK_A_REFERRED_MAX} on every whole day, with item_view > ${FORK_A_VIEW_FLOOR} on at least one${suffix}.`;
  } else if (aHolds) {
    reading.verdict = "NEITHER-A-NOR-D";
    reading.why = `Fork A's per-day bars hold on every whole day but no day reached item_view > ${FORK_A_VIEW_FLOOR}, and Fork D's bar does not hold either. The registration does not cover this window${suffix}.`;
  } else {
    reading.verdict = "NEITHER-A-NOR-D";
    reading.why = `neither Fork A's nor Fork D's per-day bars hold on every whole day${suffix}.`;
  }
  return reading;
}

/** The reading as lines, in the vocabulary of the registration. */
export function render(reading) {
  const lines = [
    `EXP-014 — window ${reading.from} → ${reading.to}, whole UTC days`,
    `  snapshot complete through ${reading.through}; ${reading.days.length} day(s) gradeable, ${reading.outstanding.length} outstanding`,
    "",
  ];
  for (const d of reading.days) {
    lines.push(
      `  ${d.day}  ${d.fork.padEnd(14)} item_view=${d.counts.item_view} search=${d.counts.item_view_search} ` +
        `referred=${d.counts.item_view_referred} render=${d.counts.item_render} ` +
        `[bot: view=${d.counts.item_view_bot} search=${d.counts.item_view_search_bot} render=${d.counts.item_render_bot}]`
    );
    lines.push(`              ${d.why}`);
  }
  lines.push("", `  VERDICT ${reading.verdict} — ${reading.why}`);

  // Amendment 2's gate, printed with the verdict rather than left to a reader who knows it is
  // there. A B or C reading is FINAL only when the day it rests on is bracketed on both sides.
  if (reading.bracket) {
    const { day, near, far, bracketed } = reading.bracket;
    if (bracketed) {
      lines.push(
        `  Amendment 2 bracket on ${day}: SATISFIED — item_render observed in a browser at ` +
          `${near.observed_at} (${near.run}) and ${far.observed_at} (${far.run}).`,
        `  The verdict is FINAL on this gate. A bracket proves the instrument was alive; it is not an arrival.`
      );
    } else {
      lines.push(
        `  Amendment 2 bracket on ${day}: NOT SATISFIED — ${near ? "far" : far ? "near" : "both"} side owed.`,
        `  VERDICT ${reading.verdict} is PROVISIONAL and must not be published as final until one dispatch of`,
        "  qa/find-instrument.spec.mjs through qa-browser.yml supplies it."
      );
    }
  }
  if (reading.bracketOwed?.length) {
    for (const owed of reading.bracketOwed) {
      lines.push(
        `  Bracket owed: ${owed.day} graded Fork ${owed.fork} with the ${owed.missing} side missing — ` +
          "Amendment 2 forbids reading that grade as final."
      );
    }
  }
  if (reading.forkFDays?.length) {
    lines.push(
      `  Fork F on ${reading.forkFDays.join(", ")} — graded under Fork A per Fork F's own next action,`,
      "  and each carries the duty to record that a referrer with item_render = 0 is never an arrival."
    );
  }
  if (reading.outstanding.length > 0) {
    lines.push(`  outstanding: ${reading.outstanding.join(", ")}`);
  }
  lines.push("", "  No fork here is an arrival, a visitor, a subscriber or a dollar. EXP-014 says so under its own heading.");
  return lines.join("\n");
}

function usage() {
  return [
    "usage:",
    "  node scripts/exp014-window.mjs [--snapshot PATH] [--from DAY] [--to DAY]",
    "",
    "exit codes: 0 reading printed · 1 a day falls under no registered fork · 2 usage or unreadable snapshot",
  ].join("\n");
}

function main(argv) {
  const args = [...argv];
  const opts = {};
  let snapshotPath = DEFAULT_SNAPSHOT;
  for (const [flag, key] of [["--snapshot", null], ["--from", "from"], ["--to", "to"]]) {
    const at = args.indexOf(flag);
    if (at === -1) continue;
    const value = args[at + 1];
    if (!value) {
      process.stderr.write(`${flag} needs a value\n${usage()}\n`);
      return 2;
    }
    if (key === null) snapshotPath = value;
    else opts[key] = value;
  }

  let snapshot;
  try {
    snapshot = loadSnapshot(snapshotPath);
  } catch (err) {
    process.stderr.write(`cannot read snapshot ${snapshotPath}: ${String(err)}\n`);
    return 2;
  }

  let reading;
  try {
    reading = gradeWindow(snapshot, opts);
  } catch (err) {
    process.stderr.write(`cannot grade window: ${String(err)}\n`);
    return 2;
  }

  process.stdout.write(`${render(reading)}\n`);
  return reading.verdict === "UNCLASSIFIED" ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]).endsWith("exp014-window.mjs")) {
  process.exit(main(process.argv.slice(2)));
}
