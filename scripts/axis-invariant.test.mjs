#!/usr/bin/env node --test
// The positive control comes first and it is the real defect: the 2026-09-19 row as production
// actually wrote it. A check that cannot redden on the day it was built for is decoration.

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { SPLIT_FROM, SUBTRACTED_AXES, describeViolations, violations } from "./axis-invariant.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REAL_SNAPSHOT = path.join(REPO_ROOT, "ops", "metrics", "latest.json");

const snapshot = (rows) => ({ daily: rows.map(([day, name, count]) => ({ day, name, count })) });

describe("a subtracted axis may never exceed the bucket it is subtracted from", () => {
  it("catches the shape production actually wrote on 2026-09-19", () => {
    const found = violations(
      snapshot([
        ["2026-09-30", "item_view", 0],
        ["2026-09-30", "item_view_bot", 121],
        ["2026-09-30", "item_view_onsite", 47],
      ])
    );

    assert.equal(found.length, 1);
    assert.equal(found[0].axis, "item_view_onsite");
    assert.equal(found[0].reading, -47);
    assert.match(describeViolations(found)[0], /item_view - item_view_onsite = 0 - 47 = -47/);
  });

  it("passes the same day once the axis carries the split, which is the fix", () => {
    assert.deepEqual(
      violations(
        snapshot([
          ["2026-09-30", "item_view", 0],
          ["2026-09-30", "item_view_bot", 121],
          ["2026-09-30", "item_view_onsite_bot", 47],
        ])
      ),
      []
    );
  });

  // The boundary in both directions. An axis equal to its bucket is every event being on-axis,
  // which is ordinary — a day on which the only visitor was the owner. One more is impossible.
  it("admits an axis equal to its bucket and refuses one above it", () => {
    const at = snapshot([
      ["2026-09-30", "follow_submit", 3],
      ["2026-09-30", "follow_duplicate", 3],
    ]);
    const over = snapshot([
      ["2026-09-30", "follow_submit", 3],
      ["2026-09-30", "follow_duplicate", 4],
    ]);

    assert.deepEqual(violations(at), []);
    assert.equal(violations(over).length, 1);
  });

  // An axis firing on a day its bucket never fired at all is the same impossibility, and it is
  // the shape that reads as a missing name rather than a wrong number. 2026-09-18 was exactly
  // this: item_view 0, item_view_onsite 7.
  it("treats an absent bucket as zero rather than skipping the check", () => {
    const found = violations(snapshot([["2026-09-30", "item_view_onsite", 7]]));

    assert.equal(found.length, 1);
    assert.equal(found[0].ofCount, 0);
    assert.equal(found[0].reading, -7);
  });

  it("says nothing about a day on which the axis never fired", () => {
    assert.deepEqual(violations(snapshot([["2026-09-30", "item_view", 5]])), []);
  });

  // The merged days are excluded by date and not by luck, so this asserts the exclusion is
  // load-bearing: the identical row is a violation above the boundary and silent below it.
  it("excludes the days written under the merged contract, and only those", () => {
    const row = (day) =>
      snapshot([
        [day, "item_view", 0],
        [day, "item_view_onsite", 47],
      ]);

    assert.deepEqual(violations(row("2026-09-19")), [], "a merged day is unreadable, not a defect");
    assert.deepEqual(violations(row("2026-09-22")), [], "the deploy day holds both contracts");
    assert.equal(violations(row(SPLIT_FROM)).length, 1, "the first whole split day is checked");
  });

  it("covers every name the published readings subtract, in both buckets", () => {
    // Each pair is one reading. Missing the `_bot` half is how this defect arrived in the first
    // place, so the pairing is asserted rather than trusted to the list's author.
    for (const { axis, of } of SUBTRACTED_AXES) {
      if (!axis.endsWith("_bot")) {
        assert.ok(
          SUBTRACTED_AXES.some((p) => p.axis === `${axis}_bot` && p.of === `${of}_bot`),
          `${axis} is checked in the non-bot bucket only`
        );
      }
    }
  });
});

describe("the real snapshot", () => {
  it("holds no impossible reading on any day written under the split contract", () => {
    const found = violations(JSON.parse(fs.readFileSync(REAL_SNAPSHOT, "utf8")));

    assert.deepEqual(found, [], describeViolations(found).join("\n"));
  });
});
