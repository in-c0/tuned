#!/usr/bin/env node
// The arithmetic that says a counter axis is readable, checked against the snapshot itself.
//
// Some names in `ops/metrics/latest.json` are **axes**: a subset of a bucket, never summed into
// any total. Most are only ever read as "the subset", and for those nothing here applies. A few
// exist to be **subtracted** from, or **compared** against, a bucket — new followers are
// `follow_submit - follow_duplicate`, the off-site find-page reading is
// `item_view - item_view_onsite`, the first non-owner star is `attention_star` moving while
// `attention_star_owner` does not. For those the subtraction is only legal while the axis and the
// bucket are drawn from the same population, and the population every counter here is split by is
// the `_bot` user-agent heuristic.
//
// WHY THIS FILE EXISTS. Between 2026-09-16 and 2026-09-22 `item_view_onsite` was written merged
// across that split while `item_view` held the non-bot bucket alone, so a crawler following a
// permalink off our own feed page decremented the human count. `item_view - item_view_onsite`
// returned a NEGATIVE number on five of the seven days the name existed: -12, -4, -7, -47, -24.
// The number was in front of the loop the whole time — `ops/METRICS.md` quotes `item_view_onsite`
// reading 19 on a day `item_view` read 7 — and nothing did the subtraction, so nothing noticed.
// Three further axes carried the identical defect with all-zero data, which is worse and not
// better: they would have come true on the first day anybody used them. See L-103.
//
// The check is deliberately the weakest one that would have caught it. It does not model what an
// axis means or reconstruct a funnel; it asserts that a name a reading subtracts never exceeds the
// name it is subtracted from. A violation is not a discrepancy to interpret, it is an impossible
// number, and an impossible number in this file is the one thing CLAUDE.md's "never publish a
// number that is not sourced" cannot protect against, because the source is where it went wrong.

/** Axis → the bucket a published reading subtracts it from, or compares it against. */
export const SUBTRACTED_AXES = [
  { axis: "item_view_onsite", of: "item_view" },
  { axis: "item_view_onsite_bot", of: "item_view_bot" },
  { axis: "follow_duplicate", of: "follow_submit" },
  { axis: "follow_duplicate_bot", of: "follow_submit_bot" },
  { axis: "desk_follow_duplicate", of: "desk_follow" },
  { axis: "desk_follow_duplicate_bot", of: "desk_follow_bot" },
  { axis: "attention_star_owner", of: "attention_star" },
  { axis: "attention_star_owner_bot", of: "attention_star_bot" },
  { axis: "attention_skip_owner", of: "attention_skip" },
  { axis: "attention_skip_owner_bot", of: "attention_skip_bot" },
];

// The first WHOLE UTC day written under the split contract. The deploy landed during
// 2026-09-22 UTC, so that day holds merged writes before it and split writes after it and is
// readable under neither contract — it is excluded here for the same reason a partial final day
// is excluded from every pre-registered reading (scripts/metrics-window.mjs), and days before it
// are excluded because the values are merged by construction and are not a defect to be fixed by
// a later run. They are unreadable, which ops/METRICS.md states rather than back-fills.
export const SPLIT_FROM = "2026-09-23";

/** Daily rows folded to `{ [day]: { [name]: count } }`. */
function byDay(daily) {
  const days = {};
  for (const row of daily ?? []) {
    (days[row.day] ??= {})[row.name] = row.count;
  }
  return days;
}

/**
 * Every day on which a subtracted axis exceeds its bucket.
 *
 * @param {{ daily?: Array<{ day: string, name: string, count: number }> }} snapshot
 * @param {{ from?: string, pairs?: typeof SUBTRACTED_AXES }} [options]
 * @returns {Array<{ day: string, axis: string, of: string, axisCount: number, ofCount: number, reading: number }>}
 */
export function violations(snapshot, options = {}) {
  const from = options.from ?? SPLIT_FROM;
  const pairs = options.pairs ?? SUBTRACTED_AXES;
  const found = [];
  const days = byDay(snapshot?.daily);
  for (const day of Object.keys(days).sort()) {
    if (day < from) continue;
    for (const { axis, of } of pairs) {
      const axisCount = days[day][axis];
      if (axisCount === undefined) continue;
      const ofCount = days[day][of] ?? 0;
      if (axisCount > ofCount) {
        found.push({ day, axis, of, axisCount, ofCount, reading: ofCount - axisCount });
      }
    }
  }
  return found;
}

/** One line per violation, in the vocabulary of the reading that breaks. */
export function describeViolations(found) {
  return found.map(
    (v) => `${v.day}: ${v.of} - ${v.axis} = ${v.ofCount} - ${v.axisCount} = ${v.reading}, which is not a count of anything`
  );
}
