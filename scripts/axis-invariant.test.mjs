#!/usr/bin/env node --test
// The positive control comes first and it is the real defect: the 2026-09-19 row as production
// actually wrote it. A check that cannot redden on the day it was built for is decoration.

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import {
  DISJOINT_AXES,
  HEADER_DERIVED_AXES,
  SPLIT_FROM,
  SUBTRACTED_AXES,
  describeViolations,
  sumViolations,
  violations,
} from "./axis-invariant.mjs";

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

// The second shape of impossible number, added with the find page's referrer family. Two axes can
// each sit under the bucket and together sit over it, and the reading that breaks is the remainder:
// `item_view - item_view_onsite - item_view_referred` is published as "arrived with no usable
// referrer at all", which is the number that answers whether 2026-09-26's 517 was a crawler.
describe("disjoint axes may never sum past the bucket the remainder is taken from", () => {
  it("catches an overlap that neither axis shows on its own", () => {
    // 6 and 5 are each under 10; together they claim 11 of 10 views, so the remainder is -1.
    const found = sumViolations(
      snapshot([
        ["2026-09-30", "item_view", 10],
        ["2026-09-30", "item_view_onsite", 6],
        ["2026-09-30", "item_view_referred", 5],
      ])
    );

    assert.equal(found.length, 1);
    assert.equal(found[0].axis, "item_view_onsite + item_view_referred");
    assert.equal(found[0].reading, -1);
    assert.match(describeViolations(found)[0], /is not a count of anything/);
    // And the per-axis check passes on the same day, which is why this one had to exist.
    assert.deepEqual(violations(snapshot([
      ["2026-09-30", "item_view", 10],
      ["2026-09-30", "item_view_onsite", 6],
      ["2026-09-30", "item_view_referred", 5],
    ])), []);
  });

  it("accepts a day that exactly accounts for every view", () => {
    assert.deepEqual(
      sumViolations(
        snapshot([
          ["2026-09-30", "item_view", 10],
          ["2026-09-30", "item_view_onsite", 6],
          ["2026-09-30", "item_view_referred", 4],
        ])
      ),
      []
    );
  });

  it("says nothing about a day on which neither name was written", () => {
    assert.deepEqual(sumViolations(snapshot([["2026-09-30", "item_view", 5]])), []);
  });

  it("reads one axis of a group as a group, so a half-written day is still checked", () => {
    const found = sumViolations(
      snapshot([
        ["2026-09-30", "item_view", 2],
        ["2026-09-30", "item_view_referred", 3],
      ])
    );

    assert.equal(found.length, 1);
    assert.equal(found[0].axisCount, 3);
  });

  it("excludes days before the split contract, exactly as the per-axis check does", () => {
    const row = (day) => snapshot([
      [day, "item_view", 1],
      [day, "item_view_onsite", 1],
      [day, "item_view_referred", 1],
    ]);

    assert.deepEqual(sumViolations(row("2026-09-19")), []);
    assert.equal(sumViolations(row(SPLIT_FROM)).length, 1);
  });

  it("covers both sides of the user-agent split, because the remainder is read in each", () => {
    for (const { axes, of } of DISJOINT_AXES) {
      if (of.endsWith("_bot")) continue;
      assert.ok(
        DISJOINT_AXES.some(
          (g) => g.of === `${of}_bot` && g.axes.join() === axes.map((a) => `${a}_bot`).join()
        ),
        `${of} has no _bot partner group`
      );
    }
  });
});

describe("the register of caller-supplied axes", () => {
  it("names only axes this file already knows about, so it cannot drift into fiction", () => {
    const known = new Set([
      ...SUBTRACTED_AXES.map((p) => p.axis),
      ...DISJOINT_AXES.flatMap((g) => g.axes),
    ]);
    const unknown = HEADER_DERIVED_AXES.filter((a) => !known.has(a));

    assert.deepEqual(
      unknown,
      [],
      "HEADER_DERIVED_AXES names an axis that is in no subtraction and no disjoint group — either it is not an axis, or the arithmetic that reads it is unasserted"
    );
  });

  it("covers both sides of the user-agent split, because that split is a header too", () => {
    for (const axis of HEADER_DERIVED_AXES) {
      if (axis.endsWith("_bot")) continue;
      assert.ok(
        HEADER_DERIVED_AXES.includes(`${axis}_bot`),
        `${axis} is registered as caller-supplied and ${axis}_bot is not; a fork reading one side of the split reads a caller-supplied value on both`
      );
    }
  });

  it("is not empty, so the guard that reads it cannot sweep nothing", () => {
    // L-61: every assertion over an empty set holds. The referrer family was six names when
    // this was written.
    assert.ok(
      HEADER_DERIVED_AXES.length >= 6,
      `expected at least the six-name referrer family, found ${HEADER_DERIVED_AXES.length}`
    );
  });
});

describe("the real snapshot", () => {
  it("holds no impossible reading on any day written under the split contract", () => {
    const found = violations(JSON.parse(fs.readFileSync(REAL_SNAPSHOT, "utf8")));

    assert.deepEqual(found, [], describeViolations(found).join("\n"));
  });

  it("holds no impossible remainder on any day written under the split contract", () => {
    const found = sumViolations(JSON.parse(fs.readFileSync(REAL_SNAPSHOT, "utf8")));

    assert.deepEqual(found, [], describeViolations(found).join("\n"));
  });
});
