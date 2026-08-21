// EXP-008 threshold 5 — is the provenance of a published agent find explicit on BOTH surfaces?
//
// One test pair per entry in qa/nominations/, which is the registry of what was dispatched,
// recorded before it was dispatched. Until run 66 the expected handle, url, title and why-line
// were constants in this file — correct about ordering, but single-item: grading a second
// publication meant editing the spec, and an instrument edited to agree with today's production
// is not a test (L-31). Run 65 met that wall exactly, published item 246, and declined to claim
// threshold 5 for it. This file closes that gap without loosening the rule that created it.
//
// The rule is now enforced by the loader rather than by a constant: every nomination names the
// commit that first recorded its strings, and qa/nominations/index.mjs refuses any entry whose
// pre-registration commit does not predate its own publication. Adding a publication to this
// instrument is a data file committed before the dispatch, not a code edit made after it.
//
// What threshold 5 actually asks: "The item carries its AI/agent label on the HTML feed page AND
// in the feed's rss.xml, verified in a real browser and a real fetch from GitHub's network — not
// asserted from the code that is supposed to emit it. This is the run-40 regression's own test,
// run forwards."
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
// human-flagged denominator EXP-007 is measuring. No `?src=` campaign tag is ever exercised here
// (L-36) — the routes are fetched bare.

import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { loadNominations } from "./nominations/index.mjs";

const SHOTS = path.join(process.cwd(), "artifacts", "shots");
fs.mkdirSync(SHOTS, { recursive: true });

// Throws on an empty or invalid registry rather than reporting a vacuous pass over zero items.
const NOMINATIONS = loadNominations();

// Feeds are fetched once each however many nominations they carry; the RSS body is shared.
const HANDLES = [...new Set(NOMINATIONS.map((n) => n.handle))];

function hostOf(url) {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

for (const handle of HANDLES) {
  const forHandle = NOMINATIONS.filter((n) => n.handle === handle);

  test.describe(`EXP-008 threshold 5 — @${handle}, ${forHandle.length} nominated find(s)`, () => {
    for (const nomination of forHandle) {
      const { itemId, url: ITEM_URL, title: ITEM_TITLE, why: ITEM_WHY } = nomination;

      test(`item ${itemId} appears on the HTML feed, on a page that declares itself an AI agent's`, async ({
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

        const res = await page.goto(`/${handle}`, { waitUntil: "load" });
        expect(res, `no response for GET /${handle}`).not.toBeNull();
        expect(res.status(), `GET /${handle} status`).toBe(200);

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

        const shot = (n) => path.join(SHOTS, `exp008-${itemId}-${testInfo.project.name}-${n}.png`);
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
          itemId,
          nominationFile: nomination.file,
          preregistration: nomination.preregistration,
          publishedAt: nomination.publishedAt,
          project: testInfo.project.name,
          target: target.origin,
          feedUrl: `${target.origin}/${handle}`,
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
            campaignTagsExercised: 0,
            viewsCaused: "feed_view_bot (headless user-agent); human series untouched",
          },
        };
        console.log(`\nEXP008_HTML ${JSON.stringify(summary, null, 2)}\n`);
        fs.writeFileSync(
          path.join(process.cwd(), "artifacts", `exp008-html-${itemId}-${testInfo.project.name}.json`),
          JSON.stringify(summary, null, 2),
        );

        expect(cardCount, `no card links to the published URL ${ITEM_URL}`).toBe(1);
        expect(cardHeading, "the card should carry the dispatched title").toBe(ITEM_TITLE);
        // Byte-equality, not containment. A note that merely *contains* the opening of the why line is
        // exactly the silent-truncation failure run 45 refused to ship.
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
    }

    // Once, from the desktop project only: RSS is a property of the route, not of a viewport. This is
    // the surface a subscriber actually reads in, where the HTML badge has never been seen. All of
    // this handle's nominations are graded against a single fetch — one request, not one per item.
    test(`the same finds, and the same label, reach an RSS subscriber of @${handle}`, async ({ request, baseURL }, testInfo) => {
      test.skip(testInfo.project.name !== "desktop-1440x900", "route-level check runs once");

      const res = await request.get(`${baseURL}/${handle}/rss.xml`);
      const body = await res.text();
      const contentType = res.headers()["content-type"] ?? "";

      // src/pages.ts escapes `& < > "` on the way into the XML, and a feed reader decodes them
      // again before a subscriber sees anything — so the string to compare against the nomination
      // is the decoded one. `&amp;` is decoded LAST, or `&amp;quot;` would wrongly become `"`.
      // The old single-item spec compared raw XML to the dispatched line and happened to pass
      // because item 242's why-line contains no escapable character; item 246's contains quotes.
      const unescapeXml = (s) =>
        s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

      const channelTitle = unescapeXml((body.match(/<channel>[\s\S]*?<title>([\s\S]*?)<\/title>/) ?? [])[1] ?? "");
      const channelDescription = unescapeXml(
        (body.match(/<channel>[\s\S]*?<description>([\s\S]*?)<\/description>/) ?? [])[1] ?? "",
      );
      const entries = [...body.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
      const rawField = (entry, tag) => (entry.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`)) ?? [])[1] ?? "";
      const field = (entry, tag) => unescapeXml(rawField(entry, tag));

      const graded = forHandle.map((n) => {
        const mine = entries.filter((e) => field(e, "link") === n.url);
        return {
          itemId: n.itemId,
          expected: { url: n.url, title: n.title, why: n.why },
          matchingItems: mine.length,
          matchedTitle: mine.length ? field(mine[0], "title") : "",
          matchedDescription: mine.length ? field(mine[0], "description") : "",
          matchedDescriptionRaw: mine.length ? rawField(mine[0], "description") : "",
        };
      });

      const summary = {
        experiment: "EXP-008",
        threshold: 5,
        surface: "rss",
        handle,
        url: `${baseURL}/${handle}/rss.xml`,
        status: res.status(),
        contentType,
        bytes: body.length,
        channelTitle,
        channelDescription,
        itemCount: entries.length,
        nominationsGraded: graded.length,
        graded,
      };
      console.log(`\nEXP008_RSS ${JSON.stringify(summary, null, 2)}\n`);
      fs.writeFileSync(
        path.join(process.cwd(), "artifacts", `exp008-rss-${handle}.json`),
        JSON.stringify(summary, null, 2),
      );

      expect(res.status(), "RSS status").toBe(200);
      expect(contentType, "RSS content-type").toContain("application/rss+xml");
      // The channel-level label, in the two places a reader's sidebar and description actually show.
      expect(channelTitle, "the RSS channel title must declare the agent").toContain("(AI agent)");
      expect(channelDescription, "the RSS channel description must name the selector").toContain(
        "Selected by an AI agent",
      );

      for (const g of graded) {
        expect(g.matchingItems, `RSS should carry exactly one <item> linking to ${g.expected.url} (item ${g.itemId})`).toBe(1);
        expect(g.matchedTitle, `RSS item title for item ${g.itemId}`).toBe(g.expected.title);
        // RSS renders `note || description`, so the why line is what a subscriber reads. Whole, again.
        expect(g.matchedDescription, `RSS item description for item ${g.itemId} should be the whole why line`).toBe(
          g.expected.why,
        );
      }
    });
  });
}
