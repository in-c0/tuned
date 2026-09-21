#!/usr/bin/env node --test
// The publisher gate reading, tested at instants the data actually holds.
//
// L-96 is the reason every fixture here carries an explicit clock rather than `now`: the whole
// subject of this file is a rule of the form "older than X", and a fixture written at `now`
// asserts that no such rule exists. The instants below are the real ones — item 282's actual
// publication and the eight-screen stoppage that preceded it — plus the two boundaries either
// side of a scheduled firing, which is where a wrong answer would be silent.

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DELIVERY_ALLOWANCE_HOURS,
  SCOUT_HANDLE,
  SCREEN_CRON_UTC,
  gateReading,
  screensBetween,
} from "./scout-gate.mjs";

/** Item 282, published by run 179 after reading the 2026-09-20 07:54Z screening record. */
const ITEM_282 = {
  itemId: 282,
  handle: "sportstech",
  title: "IMU-based identification of rowing conditions through supervised machine learning",
  publishedAt: "2026-09-20T22:07:44.418Z",
  file: "282-rowing-imu-conditions.json",
};

/** The publication before it — the far side of the nine-day silence run 179 found. */
const ITEM_281 = {
  itemId: 281,
  handle: "sportstech",
  title: "How Stable Are Temporal EMG Parameters in Rowing? A Seven-Day Test-Retest Study",
  publishedAt: "2026-09-12T10:21:50.674Z",
  file: "281-rowing-emg-temporal-reliability.json",
};

const at = (iso) => new Date(iso);

describe("screensBetween", () => {
  it("returns nothing when the window is empty or inverted", () => {
    const t = Date.parse("2026-09-21T04:00:00Z");
    assert.deepEqual(screensBetween(t, t), []);
    assert.deepEqual(screensBetween(t, t - 1), []);
  });

  it("counts one instant per UTC day, at the cron's own hour and minute", () => {
    const got = screensBetween(Date.parse("2026-09-13T00:00:00Z"), Date.parse("2026-09-16T12:00:00Z"));
    assert.deepEqual(
      got.map((ms) => new Date(ms).toISOString()),
      [
        "2026-09-13T02:40:00.000Z",
        "2026-09-14T02:40:00.000Z",
        "2026-09-15T02:40:00.000Z",
        "2026-09-16T02:40:00.000Z",
      ],
    );
  });

  it("does not skip the instant on the publication's own UTC day", () => {
    // A publication at 00:05Z is followed by that same day's 02:40Z screen. A walk that starts at
    // the *following* day loses it, and the loss is invisible because the count is still plausible.
    const got = screensBetween(Date.parse("2026-09-20T00:05:00Z"), Date.parse("2026-09-20T23:00:00Z"));
    assert.deepEqual(
      got.map((ms) => new Date(ms).toISOString()),
      ["2026-09-20T02:40:00.000Z"],
    );
  });

  it("excludes an instant equal to the publication and includes one equal to the bound", () => {
    const cronInstant = Date.parse("2026-09-20T02:40:00Z");
    assert.deepEqual(screensBetween(cronInstant, cronInstant + 60_000), []);
    assert.deepEqual(screensBetween(cronInstant - 60_000, cronInstant), [cronInstant]);
  });
});

describe("gateReading", () => {
  it("reports CURRENT while no screen has certainly been delivered since the publication", () => {
    // 2026-09-21 04:08Z — run 180's own clock. The 02:40Z screen that day is inside the delivery
    // allowance, so it is not yet counted, and item 282 is six hours old.
    const r = gateReading({ nominations: [ITEM_281, ITEM_282], now: at("2026-09-21T04:08:00Z") });
    assert.equal(r.verdict, "CURRENT");
    assert.equal(r.screensDelivered, 0);
    assert.equal(r.itemId, 282);
    assert.equal(r.publishedAt, "2026-09-20T22:07:44.418Z");
    assert.equal(r.lastScreenDelivered, null);
    assert.equal(r.ageHours, 6);
  });

  it("reports ATTEND once that same screen is past the delivery allowance", () => {
    // 07:41Z is one minute past 02:40Z + 5h. Nothing about the feed changed between this instant
    // and the one above: what changed is that the screen has certainly happened.
    const r = gateReading({ nominations: [ITEM_281, ITEM_282], now: at("2026-09-21T07:41:00Z") });
    assert.equal(r.verdict, "ATTEND");
    assert.equal(r.screensDelivered, 1);
    assert.equal(r.lastScreenDelivered, "2026-09-21T02:40:00.000Z");
  });

  it("holds CURRENT one minute before the allowance expires", () => {
    const r = gateReading({ nominations: [ITEM_281, ITEM_282], now: at("2026-09-21T07:39:00Z") });
    assert.equal(r.verdict, "CURRENT");
    assert.equal(r.screensDelivered, 0);
  });

  it("counts the eight screens the nine-day stoppage discarded", () => {
    // Item 281 on 2026-09-12, read at run 179's claim on 2026-09-20T22:07Z: the screens of
    // 09-13 … 09-20 are all past the allowance. This is the reading that did not exist, stated
    // as the number that would have been on the card: eight.
    const r = gateReading({ nominations: [ITEM_281], now: at("2026-09-20T22:07:00Z") });
    assert.equal(r.verdict, "ATTEND");
    assert.equal(r.screensDelivered, 8);
    assert.equal(r.lastScreenDelivered, "2026-09-20T02:40:00.000Z");
    assert.equal(r.itemId, 281);
  });

  it("reads the newest publication regardless of the order the registry arrives in", () => {
    const forwards = gateReading({ nominations: [ITEM_281, ITEM_282], now: at("2026-09-21T04:08:00Z") });
    const backwards = gateReading({ nominations: [ITEM_282, ITEM_281], now: at("2026-09-21T04:08:00Z") });
    assert.deepEqual(forwards, backwards);
    assert.equal(forwards.itemId, 282);
  });

  it("ignores publications belonging to another feed", () => {
    const otherFeed = { ...ITEM_282, itemId: 999, handle: "wearables", publishedAt: "2026-09-21T03:00:00Z" };
    const r = gateReading({ nominations: [ITEM_281, otherFeed], now: at("2026-09-20T22:07:00Z") });
    assert.equal(r.itemId, 281, "a wearables publication is not evidence that @sportstech published");
    assert.equal(r.screensDelivered, 8);
  });

  it("refuses an empty set rather than reporting the gate current from one", () => {
    // The vacuous pass: no publication is a stale publication, so an unguarded reading answers
    // CURRENT most confidently exactly when the feed is most dead.
    assert.throws(
      () => gateReading({ nominations: [], now: at("2026-09-21T04:08:00Z") }),
      /refusing to report a gate as current from an empty set/,
    );
    assert.throws(
      () => gateReading({ nominations: [{ ...ITEM_282, handle: "graphics" }], now: at("2026-09-21T04:08:00Z") }),
      /refusing to report a gate as current from an empty set/,
    );
  });

  it("refuses an unreadable publication instant rather than skipping the entry", () => {
    assert.throws(
      () => gateReading({ nominations: [{ ...ITEM_282, publishedAt: "soon" }], now: at("2026-09-21T04:08:00Z") }),
      /publishedAt is not a readable instant/,
    );
  });

  it("refuses an unreadable clock", () => {
    assert.throws(() => gateReading({ nominations: [ITEM_282], now: "whenever" }), /now is not a readable instant/);
  });
});

describe("the constants this reading is only as true as", () => {
  it("names the feed the scout publishes to", () => {
    assert.equal(SCOUT_HANDLE, "sportstech");
  });

  it("matches agent-scout.yml's cron, which is what a delivered screen means", () => {
    assert.deepEqual({ ...SCREEN_CRON_UTC }, { hour: 2, minute: 40 });
  });

  it("allows for delivery lateness past the worst this repository has measured", () => {
    // executor-liveness has measured 1.6h–4.5h since 2026-08-26. An allowance below that would
    // count a firing as delivered before it had been, which is the direction that invents work.
    assert.ok(DELIVERY_ALLOWANCE_HOURS >= 4.5, "allowance must cover the measured worst case");
  });
});
