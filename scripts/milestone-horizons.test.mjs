#!/usr/bin/env node --test
// The positive control comes first: the tree as it stood on 2026-09-29 before run 204 touched it,
// in which eight closed horizons read as prospective. A guard that cannot redden on the state that
// motivated it is decoration.
//
// The second group pins the two judgement calls in the parser, because both are places a careless
// simplification would quietly stop catching things: a grade that also narrates what is NOT met is
// still a grade (the 1-week entry), and `closed, ungraded` is a deliberate two-word disposition
// rather than any sentence containing the word "ungraded".

import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";

import {
  CLOSED_UNGRADED,
  MILESTONES_PATH,
  classifyStatus,
  parseHorizons,
  pastDueUngraded,
  render,
  targetDate,
} from "./milestone-horizons.mjs";

const NOW = new Date("2026-09-29T04:00:00Z");

/** The shape run 204 found. Trimmed to the horizons that carry the finding. */
const STALE = `# Tuned — MILESTONES

## 12 hours — by 2026-08-09 02:00 UTC (12:00 Sydney)

- **Outcome:** a fresh baseline.
- **Status:** **not started** — it runs unattended.

## 1 week — by 2026-08-15

- **Status:** **split, and now half-graded: condition 1 MET, condition 2 MISSED.**

## 2 weeks — by 2026-08-22

- **Status:** **not started.**

## 3 months — by 2026-11-08

- **Status:** **not started.**

## Indefinite — vision and direction

Humans contribute attention, not content.
`;

describe("the state that motivated the guard", () => {
  it("reddens on the stale tree, and names only the closed prospective horizons", () => {
    const bad = pastDueUngraded(parseHorizons(STALE), NOW);
    assert.deepEqual(bad.map((h) => h.heading), [
      "12 hours — by 2026-08-09 02:00 UTC (12:00 Sydney)",
      "2 weeks — by 2026-08-22",
    ]);
  });

  it("does not flag a horizon whose target date is still in the future", () => {
    const bad = pastDueUngraded(parseHorizons(STALE), NOW);
    assert.ok(!bad.some((h) => h.heading.startsWith("3 months")));
  });

  it("does not flag a horizon with no deadline at all", () => {
    const bad = pastDueUngraded(parseHorizons(STALE), NOW);
    assert.ok(!bad.some((h) => h.heading.startsWith("Indefinite")));
  });

  it("renders the remedy rather than only the failure", () => {
    const out = render(parseHorizons(STALE), NOW);
    assert.match(out, /FAIL 2 closed horizon\(s\)/);
    assert.match(out, /mark it `closed, ungraded` and say why/);
  });
});

describe("a grade that narrates what is not met is still a grade", () => {
  it("counts the 1-week entry's half-graded status as terminal", () => {
    assert.equal(
      classifyStatus("**split, and now half-graded: condition 1 MET, condition 2 MISSED.**"),
      "terminal"
    );
  });

  it("prefers terminal over prospective when a status carries both words", () => {
    assert.equal(classifyStatus("**missed**; the next action is not started yet"), "terminal");
  });

  it("still classifies a plainly prospective status as prospective", () => {
    assert.equal(classifyStatus("**active** — set this run."), "prospective");
    assert.equal(classifyStatus("**not started.**"), "prospective");
    assert.equal(classifyStatus("**blocked** on an owner boundary."), "prospective");
  });

  it("does not match a terminal word inside a longer word", () => {
    assert.equal(classifyStatus("**not started** — the outcome is achievable in principle"), "prospective");
  });

  it("reports an unrecognized status rather than passing it", () => {
    assert.equal(classifyStatus("**in flight, probably**"), "unrecognized");
    const md = "## 1 month — by 2026-09-08\n\n- **Status:** **in flight, probably**\n";
    assert.equal(pastDueUngraded(parseHorizons(md), NOW).length, 1);
  });
});

describe("the deliberate non-grade", () => {
  it("accepts the full two-word phrase", () => {
    assert.equal(classifyStatus("**closed, ungraded** — no run could grade it on fresh evidence."), "closed-ungraded");
    const md = `## 15 minutes — by 2026-08-08 14:15 UTC\n\n- **Status:** **closed, ungraded** — see below.\n`;
    assert.deepEqual(pastDueUngraded(parseHorizons(md), NOW), []);
  });

  it("does NOT accept the word ungraded on its own, so the escape hatch stays deliberate", () => {
    assert.equal(classifyStatus("**ungraded**"), "unrecognized");
    const md = `## 15 minutes — by 2026-08-08 14:15 UTC\n\n- **Status:** **ungraded**\n`;
    assert.equal(pastDueUngraded(parseHorizons(md), NOW).length, 1);
  });

  it("exports the phrase so MILESTONES.md and this guard cannot drift", () => {
    assert.equal(CLOSED_UNGRADED, "closed, ungraded");
  });
});

describe("target dates", () => {
  it("reads a whole date as the last instant of that day, so a horizon is not past due at 00:00", () => {
    assert.equal(targetDate("1 month — by 2026-09-08").toISOString(), "2026-09-08T23:59:59.999Z");
  });

  it("reads a month-granular horizon as the last instant of that month", () => {
    assert.equal(targetDate("3 years — by 2029-08").toISOString(), "2029-08-31T23:59:59.999Z");
  });

  it("returns null when a heading names no deadline", () => {
    assert.equal(targetDate("Indefinite — vision and direction"), null);
  });

  it("anchors on the `by` date and not on any other date in the heading", () => {
    assert.equal(
      targetDate("1 week — by 2026-08-15, revised from 2026-08-12").toISOString(),
      "2026-08-15T23:59:59.999Z"
    );
  });

  it("returns null for a heading that names a date but no deadline", () => {
    assert.equal(targetDate("Retrospective on 2026-08-08"), null);
  });
});

describe("a section's status is its own first claim", () => {
  it("takes the first Status bullet and ignores later ones in the same section", () => {
    const md = `## 2 weeks — by 2026-08-22\n\n- **Status:** **missed.**\n- **Status:** **active.**\n`;
    assert.equal(parseHorizons(md)[0].status, "**missed.**");
  });

  it("treats a section with no Status line at all as ungraded", () => {
    const md = `## 2 weeks — by 2026-08-22\n\n- **Outcome:** a payment path.\n`;
    assert.equal(pastDueUngraded(parseHorizons(md), NOW).length, 1);
  });
});

describe("the committed file", () => {
  it("has every closed horizon graded", () => {
    const horizons = parseHorizons(fs.readFileSync(MILESTONES_PATH, "utf8"));
    const bad = pastDueUngraded(horizons, new Date());
    assert.deepEqual(
      bad.map((h) => h.heading),
      [],
      `ops/MILESTONES.md has closed horizons still reading as prospective:\n${render(horizons, new Date())}`
    );
  });

  it("still parses sixteen horizons, so a heading rename does not silently empty the guard", () => {
    const horizons = parseHorizons(fs.readFileSync(MILESTONES_PATH, "utf8"));
    assert.equal(horizons.length, 16);
  });
});
