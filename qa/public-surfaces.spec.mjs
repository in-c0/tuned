// EXP-004 — do the public, no-account surfaces the Show HN post promises actually work?
//
// Pre-registered in ops/EXPERIMENTS.md BEFORE this ran. Read that entry first: the five success
// criteria and the contamination rules are fixed there, not here, and this file is only their
// executable form.
//
// The post the owner is being asked to publish says: "What you can look at without an account:
// [DEMO_FEED_URL] is a live feed, and every feed has open RSS." Nobody has ever checked that
// sentence against production, and it is the post's whole answer to Show HN's "let people try it"
// norm. This suite checks it, and reads the value of [DEMO_FEED_URL] off the live landing page
// instead of guessing a handle into a post that is about to carry the owner's name.
//
// Unlike EXP-003 this touches no mutating route at all: GETs only, no application, no member, no
// follow. The headless user-agent means the views it does cause are classified as bot traffic by
// src/metrics.ts and never enter the human-flagged denominator under study.

import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const SHOTS = path.join(process.cwd(), "artifacts", "shots");
fs.mkdirSync(SHOTS, { recursive: true });

function hostOf(url) {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

test.describe("EXP-004 — can someone look at Tuned without an account?", () => {
  test("the demo link resolves, and the feed behind it is live and readable", async ({
    page,
    baseURL,
  }, testInfo) => {
    const target = new URL(baseURL);
    const pageErrors = [];
    const consoleErrors = [];
    const failedRequests = [];

    page.on("pageerror", (e) => pageErrors.push(String(e)));
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push({ text: msg.text(), url: msg.location()?.url ?? "" });
      }
    });
    page.on("requestfailed", (req) => {
      failedRequests.push({ url: req.url(), failure: req.failure()?.errorText ?? "" });
    });

    // --- criterion 1: the landing page offers exactly one demo link, and it points somewhere -----
    const landing = await page.goto("/", { waitUntil: "load" });
    expect(landing, "no response for GET /").not.toBeNull();
    expect(landing.status(), "GET / status").toBe(200);

    const demoLink = page.locator("a.demo-more");
    await expect(demoLink, "the landing page should offer one demo link").toHaveCount(1);
    await expect(demoLink, "the demo link should be visible").toBeVisible();

    const demoHref = await demoLink.getAttribute("href");
    const demoUrl = new URL(demoHref, target.origin);
    expect(demoUrl.host, "the demo link should stay on our own origin").toBe(target.host);
    // `/{handle}` and nothing deeper: this is the value that gets pasted into a public post, so a
    // link that had drifted to some other shape should fail loudly rather than be posted.
    const handleMatch = demoUrl.pathname.match(/^\/([A-Za-z0-9_.-]+)$/);
    expect(handleMatch, `demo link path is not /{handle}: ${demoUrl.pathname}`).not.toBeNull();
    const handle = handleMatch[1];

    // --- criterion 2: the feed behind it actually serves ----------------------------------------
    const feed = await page.goto(demoUrl.toString(), { waitUntil: "load" });
    expect(feed, `no response for GET ${demoUrl.pathname}`).not.toBeNull();
    expect(feed.status(), `GET ${demoUrl.pathname} status`).toBe(200);

    await expect(page.locator(".creator-head h1"), "the feed should name its creator").toBeVisible();
    const creatorName = (await page.locator(".creator-head h1").innerText()).trim();
    await expect(
      page.locator(".creator-head .handle"),
      "the feed should carry the attention line",
    ).toContainText(`what @${handle} is paying attention to`);

    // --- criterion 3: it is a *live* feed, not an empty one -------------------------------------
    const cards = await page.locator(".card").count();
    const emptyState = await page.locator(".empty").count();

    // --- criterion 4 apparatus ------------------------------------------------------------------
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));

    const shot = (n) => path.join(SHOTS, `exp004-${testInfo.project.name}-${n}.png`);
    await page.screenshot({ path: shot("1-feed-viewport") });
    await page.screenshot({ path: shot("2-feed-full"), fullPage: true });

    const firstParty = (u) => u === "" || hostOf(u) === target.host;
    const scriptConsoleErrors = consoleErrors.filter((e) => firstParty(e.url));
    const thirdPartyConsoleErrors = consoleErrors.filter((e) => !firstParty(e.url));
    const firstPartyFailures = failedRequests.filter((f) => firstParty(f.url));
    const thirdPartyFailures = failedRequests.filter((f) => !firstParty(f.url));

    const summary = {
      experiment: "EXP-004",
      project: testInfo.project.name,
      viewport: testInfo.project.use.viewport,
      target: target.origin,
      // This is the value that fills [DEMO_FEED_URL] in the EXP-002 packet.
      demoFeedUrl: demoUrl.toString(),
      demoHandle: handle,
      creatorName,
      landingStatus: landing.status(),
      feedStatus: feed.status(),
      cardsRendered: cards,
      emptyStateShown: emptyState > 0,
      horizontalOverflow: overflow.scrollWidth > overflow.innerWidth + 1,
      documentScrollWidth: overflow.scrollWidth,
      viewportInnerWidth: overflow.innerWidth,
      pageErrors,
      firstPartyConsoleErrors: scriptConsoleErrors,
      firstPartyRequestFailures: firstPartyFailures,
      thirdPartyConsoleErrors,
      thirdPartyRequestFailures: thirdPartyFailures,
      contamination: {
        mutatingRequests: 0,
        rowsInserted: 0,
        viewsCaused: "landing_view_bot + feed_view_bot (headless user-agent); human series untouched",
      },
    };
    console.log(`\nEXP004_SUMMARY ${JSON.stringify(summary, null, 2)}\n`);
    fs.writeFileSync(
      path.join(process.cwd(), "artifacts", `exp004-summary-${testInfo.project.name}.json`),
      JSON.stringify(summary, null, 2),
    );

    // --- criteria 3 and 4, graded ---------------------------------------------------------------
    expect(emptyState, `the demo feed renders its empty state — "a live feed" would be false`).toBe(0);
    expect(cards, "the demo feed should show at least one item").toBeGreaterThan(0);
    expect(pageErrors, "uncaught page errors").toEqual([]);
    expect(scriptConsoleErrors, "first-party console errors").toEqual([]);
    expect(firstPartyFailures, "first-party request failures").toEqual([]);
    expect(
      overflow.scrollWidth,
      `feed overflows horizontally: scrollWidth ${overflow.scrollWidth} > innerWidth ${overflow.innerWidth}`,
    ).toBeLessThanOrEqual(overflow.innerWidth + 1);
  });

  // Criterion 5. Once, from the desktop project only: RSS is a property of the route, not of a
  // viewport, and fetching the same document twice for one fact is careless.
  test("every feed has open RSS, as the post claims", async ({ request, baseURL }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440x900", "route-level check runs once");

    // Resolve the handle from the landing page rather than hardcoding it: the demo creator is
    // chosen at request time as the oldest creator (src/index.ts), so a constant here would rot.
    const landing = await request.get(`${baseURL}/`);
    expect(landing.status(), "GET / status").toBe(200);
    const html = await landing.text();
    const match = html.match(/class="btn demo-more" href="\/([A-Za-z0-9_.-]+)"/);
    expect(match, "could not find the demo link in the landing HTML").not.toBeNull();
    const handle = match[1];

    const res = await request.get(`${baseURL}/${handle}/rss.xml`);
    const body = await res.text();
    const contentType = res.headers()["content-type"] ?? "";
    const items = (body.match(/<item>/g) ?? []).length;

    console.log(
      `\nEXP004_RSS ${JSON.stringify({
        url: `${baseURL}/${handle}/rss.xml`,
        status: res.status(),
        contentType,
        items,
        bytes: body.length,
      })}\n`,
    );

    expect(res.status(), "RSS status").toBe(200);
    expect(contentType, "RSS content-type").toContain("application/rss+xml");
    expect(items, "RSS should carry at least one <item>").toBeGreaterThan(0);
  });
});
