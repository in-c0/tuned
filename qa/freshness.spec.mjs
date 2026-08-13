// EXP-005 — is the content behind Tuned's public "right now" claim actually recent?
//
// Pre-registered in ops/EXPERIMENTS.md BEFORE this ran. The threshold below is fixed there.
//
// Why this exists. EXP-004 established that the public surfaces *work*: the demo link resolves, the
// feed renders cards, RSS serves. It never asked how old those cards are, and nothing else does
// either. Meanwhile `items_public` has been flat at 79 across every committed metrics snapshot from
// 2026-08-08 to 2026-08-12 — five days in which nothing anywhere on Tuned was published. The
// landing page heads its demo block "Live demo — a real feed, right now" and tells a reader that
// following someone shows "what they're into today, live, with a pulse". Those are public claims,
// and the operating rules require public claims to be supported by verifiable data. Nobody has
// verified these.
//
// `items_public` is a total, so it cannot distinguish "the demo feed is stale" from "one feed is
// stale and another is fresh". This resolves that: it reads every public feed the landing page
// offers and reports the age of each one's newest item, from the pubDate the product itself
// publishes.
//
// GETs only — no application, no member, no follow, no mutating route. The headless user-agent means
// the views it causes are classified as bot traffic by src/metrics.ts and never enter the
// human-flagged denominator under study.

import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ARTIFACTS = path.join(process.cwd(), "artifacts");
fs.mkdirSync(ARTIFACTS, { recursive: true });

// Pre-registered threshold. The demo block is captioned "right now"; 48 hours is the most generous
// reading of that word anyone could defend in public. It is deliberately not tight — the question
// is whether the claim is defensible at all, not whether the feed is minutes fresh.
const RIGHT_NOW_HOURS = 48;

const hoursSince = (iso, now) => (now - new Date(iso).getTime()) / 3_600_000;

/** Newest <pubDate> in an RSS document, as an ISO string, or null if the feed carries no items. */
function newestPubDate(xml) {
  const dates = [...xml.matchAll(/<pubDate>([^<]+)<\/pubDate>/g)]
    .map((m) => new Date(m[1]).getTime())
    .filter((t) => Number.isFinite(t));
  if (!dates.length) return null;
  return new Date(Math.max(...dates)).toISOString();
}

test.describe("EXP-005 — how old is the attention Tuned is publishing?", () => {
  test("every public feed reports the age of its newest item", async ({ request, baseURL }, testInfo) => {
    // Route-level facts, not viewport-level ones. Fetching every feed twice for one measurement
    // would double this suite's footprint in production's own counters for no extra evidence.
    test.skip(testInfo.project.name !== "desktop-1440x900", "route-level check runs once");

    const now = Date.now();
    const landing = await request.get(`${baseURL}/`);
    expect(landing.status(), "GET / status").toBe(200);
    const html = await landing.text();

    // Read the handles off the live page rather than hardcoding them: which feeds exist, and which
    // one is chosen as the demo, are both decided at request time in src/index.ts.
    const demoMatch = html.match(/class="btn demo-more" href="\/([A-Za-z0-9_.-]+)"/);
    const demoHandle = demoMatch ? demoMatch[1] : null;
    const handles = [...new Set([...html.matchAll(/class="card-link" href="\/([A-Za-z0-9_.-]+)"/g)].map((m) => m[1]))];
    expect(handles.length, "the landing page should list at least one feed").toBeGreaterThan(0);

    // The demo block renders its item timestamps into data-t attributes, which is exactly what a
    // visitor's browser turns into the "12d ago" line under the "right now" heading. Measuring the
    // rendered attribute rather than the database keeps this a claim about what a reader sees.
    const demoStamps = [...html.matchAll(/class="time" data-t="([^"]+)"/g)].map((m) => m[1]);
    const demoNewest = demoStamps.length
      ? new Date(Math.max(...demoStamps.map((s) => new Date(s).getTime()))).toISOString()
      : null;

    const feeds = [];
    for (const handle of handles) {
      const res = await request.get(`${baseURL}/${handle}/rss.xml`);
      const body = await res.text();
      const newest = res.status() === 200 ? newestPubDate(body) : null;
      feeds.push({
        handle,
        isDemo: handle === demoHandle,
        rssStatus: res.status(),
        items: (body.match(/<item>/g) ?? []).length,
        newestItem: newest,
        ageHours: newest === null ? null : Number(hoursSince(newest, now).toFixed(1)),
      });
    }

    const withItems = feeds.filter((f) => f.newestItem !== null);
    const freshest = withItems.length
      ? withItems.reduce((a, b) => (a.ageHours <= b.ageHours ? a : b))
      : null;

    const summary = {
      experiment: "EXP-005",
      measuredAt: new Date(now).toISOString(),
      target: baseURL,
      thresholdHours: RIGHT_NOW_HOURS,
      demoHandle,
      demoBlockNewestItem: demoNewest,
      demoBlockAgeHours: demoNewest === null ? null : Number(hoursSince(demoNewest, now).toFixed(1)),
      feeds,
      feedsWithNoItems: feeds.filter((f) => f.newestItem === null).map((f) => f.handle),
      // The question the landing copy actually turns on: is ANY feed fresh, and is the one a
      // visitor is shown the fresh one? Those can differ, and if they do that is a routing defect
      // in the demo picker rather than an emptiness problem.
      freshestFeed: freshest ? { handle: freshest.handle, ageHours: freshest.ageHours } : null,
      demoIsFreshest: freshest ? freshest.handle === demoHandle : null,
    };

    console.log(`\nEXP005_SUMMARY ${JSON.stringify(summary, null, 2)}\n`);
    fs.writeFileSync(path.join(ARTIFACTS, "exp005-summary.json"), JSON.stringify(summary, null, 2));

    // Graded last, and on purpose after the summary is already written: a red run must still leave
    // the measurement behind, because the number is the point and the pass/fail is only its verdict.
    expect(demoNewest, "the landing demo block rendered no item timestamps at all").not.toBeNull();
    expect(
      summary.demoBlockAgeHours,
      `the landing page heads this block "a real feed, right now"; its newest item is ${summary.demoBlockAgeHours}h old`,
    ).toBeLessThan(RIGHT_NOW_HOURS);
  });
});
