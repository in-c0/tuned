// A5 arrival instrument — does the deployed feed route accept a tagged URL and still serve?
//
// This is not an experiment and it grades nothing. It is a production check on an instrument,
// in the same shape as `pulse-instrument.spec.mjs`, and it deliberately touches **no landing
// surface**: EXP-007 reads complete UTC day 2026-08-16 and nothing here goes near
// `landing_view`, `landing_engage` or `application_start`.
//
// What the workerd suite already proves. `test/arrival.test.ts` runs the real Worker against a
// real D1 and asserts the exact counter names that land — the per-handle split, the bot split,
// the allowlist, and that a hostile `?src=` mints no rows. That is the logic, and it is fully
// covered.
//
// What only production can answer. Whether the deployed build actually serves `/:handle` with a
// query string on it, and whether the edge in front of it does. A tagged URL is the *only* form
// a distribution link will ever take, so "the feed works" is not the same statement as "the link
// we are about to post works" — and a link posted to a channel that can be spent once is not the
// place to discover the difference. This suite is the difference, checked before the post.
//
// What it cannot answer, stated so it is not implied. A counter write has no observable effect
// on the response, so a browser cannot see it land. The counter values are read from the next
// **scheduled** `ops/metrics/` snapshot, which is where this run's own hits will appear.
//
// Footprint, asserted rather than assumed. Two GETs of one public feed, no POST, no form, no
// follow, no landing page. The headless user-agent means src/metrics.ts classifies both as bot
// traffic, so they land in `feed_view_bot`, `feed_view_bot:<handle>` and `arrival_bot:qa` and
// never enter a human-flagged counter.

import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ARTIFACTS = path.join(process.cwd(), "artifacts");
fs.mkdirSync(ARTIFACTS, { recursive: true });

const HANDLE = process.env.ARRIVAL_HANDLE ?? "sportstech";

// The tag mirrors ARRIVAL_TAGS in src/index.ts. `qa` is this loop's own traffic, self-labelled
// so it stays separable from any real campaign that is registered later.
const TAG = "qa";

// Deliberately not allowlisted, and deliberately hostile in shape. A stranger can put anything
// after `?src=`; the page must survive it identically.
const UNREGISTERED = "hn'; DROP TABLE metric_days; --";

test.describe("A5 arrival instrument — a tagged feed URL is served, and an unknown tag is harmless", () => {
  test("the destination renders with a tag on it, and renders identically without one", async ({
    page,
    baseURL,
  }, testInfo) => {
    // Route-level facts, not viewport-level ones. Running this at both widths would double this
    // suite's footprint in the counters it exists to protect, for no extra evidence.
    test.skip(testInfo.project.name !== "desktop-1440x900", "instrument check runs once");

    const pageErrors = [];
    page.on("pageerror", (e) => pageErrors.push(String(e)));

    const visit = async (search) => {
      const res = await page.goto(`/${HANDLE}${search}`, { waitUntil: "load" });
      return {
        url: page.url(),
        status: res.status(),
        handle_line: (await page.locator(".creator-head .handle").innerText({ timeout: 10_000 })).trim(),
        cards: await page.locator(".card").count(),
      };
    };

    // --- the form every distribution link will take ---
    const tagged = await visit(`?${new URLSearchParams({ src: TAG })}`);

    expect(tagged.status, "production did not serve the tagged feed URL").toBe(200);
    // The feed itself has to have rendered, not merely a 200. A5's whole point is that the
    // stranger arrives at something usable; an empty shell answering 200 is the failure it is
    // written against.
    expect(tagged.handle_line, "the feed did not render its own handle").toBe(
      `what @${HANDLE} is paying attention to`,
    );
    // The query string must not have been swallowed by a redirect — if the edge strips or
    // rewrites it, the tag never reaches the Worker and the counter is silently dead.
    expect(new URL(tagged.url).searchParams.get("src"), "the src tag did not survive to the served URL").toBe(TAG);

    // --- an unregistered tag must be inert, not fatal ---
    const junk = await visit(`?${new URLSearchParams({ src: UNREGISTERED })}`);

    expect(junk.status, "an unrecognised src tag changed the response status").toBe(200);
    expect(junk.handle_line, "an unrecognised src tag broke the render").toBe(tagged.handle_line);
    expect(junk.cards, "an unrecognised src tag changed what the feed shows").toBe(tagged.cards);

    expect(pageErrors, `the feed threw in the browser: ${pageErrors.join(" | ")}`).toEqual([]);

    const version = await page.request.get("/api/version");
    const build = await version.json();

    const evidence = {
      measured_at: new Date().toISOString(),
      target: baseURL,
      serving_commit: build.commit,
      handle: HANDLE,
      tagged,
      unregistered_tag: junk,
      page_errors: pageErrors,
      footprint:
        "Two GETs of one public feed. Bot-classified by src/metrics.ts because of the headless user-agent, so the expected writes are feed_view_bot +2, feed_view_bot:" +
        HANDLE +
        " +2, arrival_bot:qa +1. No landing-page request, no POST, no form, no follow.",
      note:
        "Production check on the A5 arrival instrument. Counter values are not observable from a browser; they are read from the next scheduled ops/metrics snapshot, where this run's own hits appear.",
    };
    // Into the run log first, and before anything optional can fail. L-20: the executor cannot
    // open an artifact zip, so evidence that reaches only `artifacts/` has not reached anyone who
    // needs it. Run 47 lost a good reading to exactly this and the lesson did not survive into the
    // next spec written — including this one, whose first production dispatch
    // (31941200421) proved its assertions and printed none of its values.
    console.log("arrival-instrument evidence:", JSON.stringify(evidence, null, 2));

    fs.writeFileSync(path.join(ARTIFACTS, "arrival-instrument.json"), JSON.stringify(evidence, null, 2));
    await testInfo.attach("arrival-instrument.json", {
      body: JSON.stringify(evidence, null, 2),
      contentType: "application/json",
    });
    await page.screenshot({
      path: path.join(ARTIFACTS, "shots", "arrival-instrument-desktop.png"),
      fullPage: false,
    });
  });
});
