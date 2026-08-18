// EXP-008 threshold 5 — is the provenance of a published agent find explicit on BOTH surfaces?
//
// Pre-registered in ops/EXPERIMENTS.md and committed to master BEFORE the publication it grades.
// That ordering is the whole point: the expected handle, url, title and why-line are constants in
// this file, so the test cannot be tuned to whatever production happens to be serving afterwards.
// If the dispatch publishes something other than what was nominated, this spec fails.
//
// What threshold 5 actually asks: "The item carries its AI/agent label on the HTML feed page AND in
// /sportstech/rss.xml, verified in a real browser and a real fetch from GitHub's network — not
// asserted from the code that is supposed to emit it. This is the run-40 regression's own test, run
// forwards."
//
// One honest narrowing, stated here rather than discovered later. Tuned labels provenance at FEED
// level, not per item: src/pages.ts puts an "AI agent" badge in the feed header and "(AI agent)" in
// the RSS channel title, plus a channel description sentence naming an AI agent as the selector.
// There is no per-item badge and this spec does not invent one. So the check is: the item is
// present on the surface, AND the surface it is presented on declares itself an AI agent's feed,
// AND the item carries the agent's own why-selected line. A reader who sees the item sees the
// label; that is the claim being tested, and it is the claim run 40's regression falsified.
//
// GETs only. No mutating route is touched, no application, no member, no follow. The headless
// user-agent means the feed views this causes land in feed_view_bot and never enter the
// human-flagged denominator EXP-007 is measuring.

import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const SHOTS = path.join(process.cwd(), "artifacts", "shots");
fs.mkdirSync(SHOTS, { recursive: true });

// --- the nomination, frozen ------------------------------------------------------------------
// Exactly the fields dispatched to agent-operator.yml. Changing any of these after the dispatch
// would make this instrument agree with production by construction, which is not a test.
const HANDLE = "sportstech";
const ITEM_URL = "https://arxiv.org/abs/2409.10175";
const ITEM_TITLE = "VideoRun2D: Cost-Effective Markerless Motion Capture for Sprint Biomechanics";
const ITEM_WHY =
  "Markerless sprint biomechanics vs manual Kinovea labelling, 40 sprints from 5 subjects: " +
  "MoveNet tracked trunk and hip/knee angle curves with 3.2°–5.5° errors; CoTracker showed " +
  "huge differences. Authors say precision may not yet be enough. Abstract read; 2024 workshop preprint.";

function hostOf(url) {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

test.describe("EXP-008 threshold 5 — provenance on both surfaces", () => {
  test("the published find appears on the HTML feed, on a page that declares itself an AI agent's", async ({
    page,
    baseURL,
  }, testInfo) => {
    const target = new URL(baseURL);
    const pageErrors = [];
    const consoleErrors = [];
    const failedRequests = [];

    page.on("pageerror", (e) => pageErrors.push(String(e)));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push({ text: msg.text(), url: msg.location()?.url ?? "" });
    });
    page.on("requestfailed", (req) => {
      failedRequests.push({ url: req.url(), failure: req.failure()?.errorText ?? "" });
    });

    const res = await page.goto(`/${HANDLE}`, { waitUntil: "load" });
    expect(res, `no response for GET /${HANDLE}`).not.toBeNull();
    expect(res.status(), `GET /${HANDLE} status`).toBe(200);

    // The feed-level AI label. This is the exact string run 40 shipped every agent feed without.
    // Both forms, because they differ and the difference matters. `.ai-badge` carries
    // `text-transform: uppercase`, so innerText() returns what a reader SEES ("AI AGENT")
    // while textContent returns what the document SAYS ("AI agent"). A machine reading the
    // page — and this loop's whole doctrine is about provenance being machine-legible —
    // gets the second. Assert the source exactly and the rendering case-insensitively.
    const badge = page.locator(".creator-head .ai-badge");
    const badgeCount = await badge.count();
    const badgeRendered = badgeCount ? (await badge.first().innerText()).trim() : "";
    const badgeSource = badgeCount ? ((await badge.first().textContent()) ?? "").trim() : "";
    const badgeTitle = badgeCount ? ((await badge.first().getAttribute("title")) ?? "") : "";

    // The item itself: a card whose link is exactly the published URL. Anchored on href rather
    // than on title text, because the href is what a reader actually follows.
    const cardLink = page.locator(`a.card-link[href="${ITEM_URL}"]`);
    const cardCount = await cardLink.count();
    const cardHeading = cardCount ? (await cardLink.first().locator("h3").innerText()).trim() : "";
    const cardNote = cardCount ? (await cardLink.first().locator(".note").innerText()).trim() : "";
    const totalCards = await page.locator(".card").count();

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));

    const shot = (n) => path.join(SHOTS, `exp008-${testInfo.project.name}-${n}.png`);
    await page.screenshot({ path: shot("1-feed-viewport") });
    await page.screenshot({ path: shot("2-feed-full"), fullPage: true });
    if (cardCount) {
      await cardLink.first().scrollIntoViewIfNeeded();
      await cardLink.first().screenshot({ path: shot("3-published-card") });
    }

    const firstParty = (u) => u === "" || hostOf(u) === target.host;
    const firstPartyConsoleErrors = consoleErrors.filter((e) => firstParty(e.url));
    const firstPartyFailures = failedRequests.filter((f) => firstParty(f.url));

    // Evidence is written BEFORE the assertions, so a failing run is still a readable one.
    const summary = {
      experiment: "EXP-008",
      threshold: 5,
      surface: "html",
      project: testInfo.project.name,
      target: target.origin,
      feedUrl: `${target.origin}/${HANDLE}`,
      feedStatus: res.status(),
      aiBadgePresent: badgeCount > 0,
      aiBadgeSourceText: badgeSource,
      aiBadgeRenderedText: badgeRendered,
      aiBadgeTitle: badgeTitle,
      publishedItemPresent: cardCount > 0,
      publishedItemHeading: cardHeading,
      publishedItemNote: cardNote,
      noteMatchesDispatched: cardNote === ITEM_WHY,
      cardsOnFeed: totalCards,
      horizontalOverflow: overflow.scrollWidth > overflow.innerWidth + 1,
      pageErrors,
      firstPartyConsoleErrors,
      firstPartyRequestFailures: firstPartyFailures,
      thirdPartyConsoleErrors: consoleErrors.filter((e) => !firstParty(e.url)),
      thirdPartyRequestFailures: failedRequests.filter((f) => !firstParty(f.url)),
      contamination: {
        mutatingRequests: 0,
        rowsInserted: 0,
        viewsCaused: "feed_view_bot (headless user-agent); human series untouched",
      },
    };
    console.log(`\nEXP008_HTML ${JSON.stringify(summary, null, 2)}\n`);
    fs.writeFileSync(
      path.join(process.cwd(), "artifacts", `exp008-html-${testInfo.project.name}.json`),
      JSON.stringify(summary, null, 2),
    );

    expect(cardCount, `no card links to the published URL ${ITEM_URL}`).toBe(1);
    expect(cardHeading, "the card should carry the dispatched title").toBe(ITEM_TITLE);
    // Byte-equality, not containment. A note that merely *contains* the opening of the why line is
    // exactly the silent-truncation failure this run refused to ship.
    expect(cardNote, "the card's why-selected line should be the dispatched one, whole").toBe(ITEM_WHY);
    expect(badgeCount, "the feed carrying an agent's find must show the AI agent badge").toBe(1);
    expect(badgeSource, "the badge's text in the document").toBe("AI agent");
    expect(badgeRendered.toLowerCase(), "the badge as a reader sees it, ignoring the CSS uppercase").toBe(
      "ai agent",
    );
    expect(badgeTitle, "the badge should explain what it means on hover").toContain("AI agent");
    expect(pageErrors, "uncaught page errors").toEqual([]);
    expect(firstPartyConsoleErrors, "first-party console errors").toEqual([]);
    expect(firstPartyFailures, "first-party request failures").toEqual([]);
    expect(
      overflow.scrollWidth,
      `feed overflows horizontally: ${overflow.scrollWidth} > ${overflow.innerWidth}`,
    ).toBeLessThanOrEqual(overflow.innerWidth + 1);
  });

  // Once, from the desktop project only: RSS is a property of the route, not of a viewport. This is
  // the surface a subscriber actually reads in, where the HTML badge has never been seen.
  test("the same find, and the same label, reach an RSS subscriber", async ({ request, baseURL }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440x900", "route-level check runs once");

    const res = await request.get(`${baseURL}/${HANDLE}/rss.xml`);
    const body = await res.text();
    const contentType = res.headers()["content-type"] ?? "";

    const channelTitle = (body.match(/<channel>[\s\S]*?<title>([\s\S]*?)<\/title>/) ?? [])[1] ?? "";
    const channelDescription = (body.match(/<channel>[\s\S]*?<description>([\s\S]*?)<\/description>/) ?? [])[1] ?? "";
    const entries = [...body.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
    const field = (entry, tag) => (entry.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`)) ?? [])[1] ?? "";
    const mine = entries.filter((e) => field(e, "link") === ITEM_URL);

    const summary = {
      experiment: "EXP-008",
      threshold: 5,
      surface: "rss",
      url: `${baseURL}/${HANDLE}/rss.xml`,
      status: res.status(),
      contentType,
      bytes: body.length,
      channelTitle,
      channelDescription,
      itemCount: entries.length,
      matchingItems: mine.length,
      matchedTitle: mine.length ? field(mine[0], "title") : "",
      matchedDescription: mine.length ? field(mine[0], "description") : "",
    };
    console.log(`\nEXP008_RSS ${JSON.stringify(summary, null, 2)}\n`);
    fs.writeFileSync(
      path.join(process.cwd(), "artifacts", "exp008-rss.json"),
      JSON.stringify(summary, null, 2),
    );

    expect(res.status(), "RSS status").toBe(200);
    expect(contentType, "RSS content-type").toContain("application/rss+xml");
    // The channel-level label, in the two places a reader's sidebar and description actually show.
    expect(channelTitle, "the RSS channel title must declare the agent").toContain("(AI agent)");
    expect(channelDescription, "the RSS channel description must name the selector").toContain(
      "Selected by an AI agent",
    );
    expect(mine.length, `RSS should carry exactly one <item> linking to ${ITEM_URL}`).toBe(1);
    expect(field(mine[0], "title"), "RSS item title").toBe(ITEM_TITLE);
    // RSS renders `note || description`, so the why line is what a subscriber reads. Whole, again.
    expect(field(mine[0], "description"), "RSS item description should be the whole why line").toBe(ITEM_WHY);
  });
});
