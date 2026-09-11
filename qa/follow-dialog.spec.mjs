// Does the follow dialog, in a real browser against production, say what it now claims to say —
// and does the one path on it that actually delivers something report that it was taken?
//
// Run 150 changed that dialog. Until then its primary button collected an email address into
// `followers`, a table with one reader in the whole codebase (a COUNT) and no code path anywhere in
// src/ that could deliver to it — no mail provider, no sender, no digest job. The only sentence
// admitting that lived in the *success message*, which a visitor reads after handing over the
// address. The RSS URL, the one subscription on the page that works, was a 12px link in the header.
//
// Two halves of that change are unobservable from a server test, and both are the half that fails
// silently:
//
//   1. **Ordering.** `test/follow.test.ts` pins that the disclosure precedes the email input in the
//      served document. Document order is not reading order — CSS can move either — so the check
//      that matters is geometric, and only a browser has geometry.
//   2. **The beacon.** `follow_rss` is page-reported. A production check can prove the route is
//      allowlisted (verify-production does) and that the served HTML contains the string. Both are
//      equally true of a page whose script throws three lines earlier. That is EXP-011 Fork R-D's
//      failure mode, transplanted to a different counter, and run 140 recorded what it costs:
//      counters do not backfill, so a beacon that never lands costs the whole window it was built
//      for.
//
// Contamination, stated rather than discovered later. This suite is headless and its user-agent
// matches BOT_UA, so every increment it causes lands in a `_bot` name — `feed_view_bot`,
// `feed_render_bot`, `follow_open_bot`, `follow_rss_bot`, and `feed_fetch_bot:<handle>` when the RSS
// link opens its tab. It **never submits the follow form**: doing so would write a real row into
// `followers` from a machine, which is the one number on this page that is supposed to mean a
// person. Typing an address into an unsubmitted form is not worth the risk of a stray Enter, so it
// does not type one either.

import { expect, test } from "@playwright/test";

const PULSE_PREFIX = "/api/pulse/";

test.describe("follow dialog — is the working path offered, disclosed and counted?", () => {
  test("RSS is offered above the ask, the disclosure precedes the input on screen, and follow_rss lands once", async ({
    page,
    request,
  }, testInfo) => {
    // Route-level facts. The listener set and the DOM are identical at both widths and the
    // ordering assertion is checked at this one; running twice would double this suite's footprint
    // in the counters it is validating for no extra evidence.
    test.skip(testInfo.project.name !== "desktop-1440x900", "dialog check runs once");

    const pulses = [];
    const pageErrors = [];
    const consoleErrors = [];

    page.on("pageerror", (e) => pageErrors.push(String(e)));
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text());
    });
    page.on("response", (res) => {
      const u = new URL(res.url());
      if (!u.pathname.startsWith(PULSE_PREFIX)) return;
      pulses.push({ name: u.pathname.slice(PULSE_PREFIX.length), status: res.status() });
    });

    // The handle is read off the live landing page rather than hardcoded, for the reason
    // public-surfaces.spec.mjs gives: the demo creator is whichever feed published most recently,
    // and a guessed handle tests a page nobody is being sent to.
    //
    // Fetched rather than navigated to, deliberately, and this is not tidiness. EXP-011 is grading
    // R = landing_render ÷ landing_view over 2026-09-05 … 2026-09-18. A browser visit to `/` fires
    // `landing_render`; a plain request does not execute the script and fires neither. The headless
    // user-agent would have put the increment in `landing_render_bot`, which R does not read, so
    // this is belt and braces — but "the counter I would have disturbed is the one an open
    // experiment reads" is a bad sentence to be relying on a user-agent string for.
    const landingHtml = await (await request.get("/")).text();
    const demoHref = (landingHtml.match(/class="rss" href="([^"]*)"/) ?? [])[1];
    const handleMatch = (demoHref ?? "").match(/^\/([A-Za-z0-9_.-]+)$/);
    expect(handleMatch, `landing page's feed link is not /{handle}: ${demoHref}`).not.toBeNull();
    const handle = handleMatch[1];

    await page.goto(`/${handle}`, { waitUntil: "load" });
    const pageOrigin = new URL(page.url()).origin;

    // Checked before any interaction: a throw earlier in the same inline script suppresses every
    // beacon below it and looks exactly like a page nobody touched.
    expect(pageErrors, `feed page threw before any interaction: ${pageErrors.join(" | ")}`).toEqual([]);

    // --- the dialog opens, and follow_open still works after the markup changed around it ---
    const openPromise = page.waitForResponse((r) => r.url().includes(`${PULSE_PREFIX}follow_open`), {
      timeout: 15_000,
    });
    await page.click("#follow-btn");
    const openRes = await openPromise;
    expect(openRes.status(), "follow_open was not accepted by production").toBe(204);

    // --- the disclosure is above the input ON SCREEN, not merely before it in the document ---
    //
    // This is the assertion the run exists for. Telling someone that digests are not sending is
    // worth nothing if they read it after handing over an address, which is where that sentence
    // lived until run 150 — and a rule as ordinary as `order: -1` or a flex-column reversal puts it
    // back there without touching the HTML a server test reads.
    const rss = page.locator("#follow-rss");
    const disclosure = page.locator("#follow-dlg .or");
    const input = page.locator("#follow-email");
    await expect(rss, "the dialog offers no RSS subscription").toBeVisible();
    await expect(disclosure, "the dialog does not disclose that digests are not sending").toBeVisible();
    await expect(disclosure).toContainText("not sending yet");

    const box = async (l) => {
      const b = await l.boundingBox();
      expect(b, "an element of the dialog has no box — it is not laid out").not.toBeNull();
      return b;
    };
    const [rssBox, discBox, inputBox] = [await box(rss), await box(disclosure), await box(input)];
    expect(
      discBox.y + discBox.height,
      "the disclosure renders below the email input — a visitor reads it only after handing over an address",
    ).toBeLessThanOrEqual(inputBox.y + 1);
    expect(
      rssBox.y,
      "the RSS option renders below the email input, which is the arrangement this change replaced",
    ).toBeLessThan(inputBox.y);

    // The link has to be the feed's own and has to leave this page intact — a dialog that navigates
    // the tab away to raw XML loses the reader it just converted.
    expect(await rss.getAttribute("href"), "the RSS option points at another feed").toBe(
      `/${handle}/rss.xml`,
    );
    expect(await rss.getAttribute("target"), "the RSS option replaces the page instead of opening a tab").toBe(
      "_blank",
    );

    // --- follow_rss: observed from a browser engine, which is the only witness that counts ---
    const rssPromise = page.waitForResponse((r) => r.url().includes(`${PULSE_PREFIX}follow_rss`), {
      timeout: 15_000,
    });
    await rss.click();
    const rssRes = await rssPromise;
    const rssHeaders = await rssRes.request().allHeaders();

    expect(rssRes.status(), "follow_rss was not accepted by production").toBe(204);
    expect(rssHeaders.origin, "browser sent no Origin on follow_rss, or not the page's own").toBe(
      pageOrigin,
    );

    // --- one-shot, for the same reason every other pulse here is ---
    await rss.click({ force: true }).catch(() => {});
    await page.waitForTimeout(1_000);
    expect(
      pulses.filter((p) => p.name === "follow_rss").length,
      "follow_rss fired more than once on a single page load",
    ).toBe(1);
    expect(
      pulses.filter((p) => p.name === "follow_open").length,
      "follow_open fired more than once on a single page load",
    ).toBe(1);

    // The form is never submitted and never typed into. `follow_submit` is supposed to mean a
    // person left an address; a row written from here would be this loop counting itself.
    expect(
      pulses.map((p) => p.name).sort(),
      "a pulse fired that this interaction does not explain",
    ).toEqual(["feed_render", "follow_open", "follow_rss"]);

    expect(pageErrors, `page errors: ${pageErrors.join(" | ")}`).toEqual([]);

    await testInfo.attach("follow-dialog.json", {
      contentType: "application/json",
      body: JSON.stringify(
        {
          handle,
          pulses,
          rssHref: await rss.getAttribute("href"),
          geometry: { rss: rssBox, disclosure: discBox, input: inputBox },
          disclosureText: (await disclosure.textContent()).trim(),
          followSubmitted: false,
          pageErrors,
          consoleErrors,
          contamination: "feed_view_bot, feed_render_bot, follow_open_bot, follow_rss_bot, feed_fetch_bot:<handle>; human series untouched",
        },
        null,
        2,
      ),
    });

    await page.screenshot({ path: testInfo.outputPath("follow-dialog.png") });
    await testInfo.attach("follow-dialog.png", {
      contentType: "image/png",
      path: testInfo.outputPath("follow-dialog.png"),
    });
  });
});
