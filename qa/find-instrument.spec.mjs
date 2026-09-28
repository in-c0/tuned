// Find-page instrument validity — does `item_render` actually fire in a browser against production?
//
// ---------------------------------------------------------------------------------------------
// WHY THIS EXISTS, and why now rather than after EXP-014's window closes.
//
// EXP-014 grades the find-page arrival question over whole UTC days 2026-09-27 … 2026-10-03, and
// its Amendment 1 (run 198) made `item_render` load-bearing in three of its six forks:
//
//   * Fork B (search is delivering)  requires `item_render` >= 1 on the same whole day.
//   * Fork C (an inbound link)       requires `item_render` >= 1 on the same whole day.
//   * Fork F (a referrer with nothing behind it) is defined BY `item_render` reading 0.
//
// So a day on which the beacon is silent cannot be graded B or C, and falls to F or A by
// construction. That is sound only if a silent beacon means "nothing rendered the page". If the
// beacon is instead DEAD, every day of the window grades to the same two forks no matter what
// arrives, and the experiment can only ever return the answer it already assumed.
//
// EXP-014 registered **Fork E** precisely to stop that happening — to `item_view_search_bot`,
// whose liveness `verify-production.yml` establishes on every run. It registered no such guard for
// `item_render`, which has no first-party writer at all. The counter the amendment leaned on is
// the one counter in the reading with nothing standing behind it.
//
// And the data says the question is live, not theoretical. In `ops/metrics/latest.json` (generated
// 2026-09-27T23:21:56.781Z) `item_render` and `item_render_bot` are **both absent on every day from
// 2026-09-22 through 2026-09-27** — six consecutive days — while `item_view` reads 642 on 09-26 and
// 104 on 09-27. Both names last wrote on 2026-09-21. Two explanations, pointing at opposite next
// actions, and no instrument in this repository can tell them apart:
//
//   (i)  nothing has rendered a find page since 2026-09-21 — the honest reading Fork F's closing
//        sentence already anticipates; or
//   (ii) the beacon stopped firing, or production stopped accepting it, and the zeros are about
//        the instrument.
//
// This loop has shipped four instruments that silently wrote nothing (L-35, L-44, L-46, L-51),
// every one of them found after a window had closed. This spec is the check on the behaviour
// rather than on the document, and it is dispatched before the window's first reading exists
// (the snapshot committed 2026-09-29) so that the reading arrives already disambiguated.
//
// WHAT A GREEN RUN ESTABLISHES, exactly. That a rendering browser loading a find page on
// production emits `POST /api/pulse/item_render`, that production accepts it with 204, and that
// the page throws nothing before the beacon is sent. That rules out (ii) and leaves (i) as the
// reading. It does NOT establish that anybody arrived, and no fork of EXP-014 may be graded from
// this file: the whole reading lives in the unsuffixed names and this suite can only write `_bot`.
//
// WHAT A RED RUN ESTABLISHES. `item_render` is not a usable corroborator, Forks B and C are
// ungradeable for the whole window, and the emitter must be fixed — which under EXP-014's binding
// clause means the window is re-registered from the day after that deploy rather than read across
// it.
//
// EXP-014's binding clauses, and how this spec stays inside every one of them:
//
//   * "No fetch of any find page by this loop ... under a user-agent that is not bot-classified."
//     `qa/playwright.config.mjs` declares `HeadlessChrome`, which `src/metrics.ts` classifies as a
//     bot, so every increment this spec causes lands in `item_view_bot` / `item_render_bot` and
//     cannot touch a name any fork reads. Overriding that user-agent while the window is open is
//     forbidden and would void the window.
//   * "No `Referer` is ever sent by this loop to a find page except from verify-production.yml."
//     The find page is reached by a DIRECT `page.goto`, never by clicking a permalink on a feed
//     page — a click would send this site's own Referer and write `item_view_onsite_bot`. The one
//     navigation in this file is deliberately origin-less, and it must stay that way.
//   * "`item_render`'s emitter may not be edited inside the window." Nothing in this change
//     touches `src/`. This file observes the emitter; it does not alter it.
//
// FOOTPRINT. One `GET /sitemap.xml`, one find-page load, and the one pulse that page sends. The
// follow dialog on the find page is deliberately NOT exercised here: `find_follow_open` and
// `find_follow_rss` have never been observed firing either and are worth a check of their own, but
// a second failure mode in this file could turn the EXP-014 reading red for a reason that has
// nothing to do with what the reading needs — the hazard `pulse-instrument.spec.mjs` names about
// itself. One question per bracket.
// ---------------------------------------------------------------------------------------------

import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ARTIFACTS = path.join(process.cwd(), "artifacts");
fs.mkdirSync(ARTIFACTS, { recursive: true });

const PULSE_PREFIX = "/api/pulse/";

/** The counter this file positively observes, read by `scripts/pulse-observed.test.mjs`.
 *
 *  This is a declaration and not a comment on purpose. The gap this spec closes was not that
 *  nobody had thought about `item_render`; it is named in `qa/pulse-instrument.spec.mjs` already —
 *  in that file's `NEVER_HERE` list, as a counter that must **not** fire on the landing page. A
 *  name can appear all over the suite and still have no check that it ever fires at all, and
 *  grepping for it cannot tell those two apart. So each spec states which pulses it asserts the
 *  FIRING of, and the ops guard reads these declarations rather than the file text. */
export const OBSERVES_PULSES = ["item_render"];

/** The one pulse a find page sends without being asked. Everything else on the page is gated on
 *  the follow dialog, which this spec does not open. */
const UNGATED = "item_render";

/** Allowlisted for another page is not allowlisted for this one. `landing_render` firing from a
 *  find page would put find-page loads into EXP-011's numerator; the three feed-page names would
 *  put them into the denominator `follow_open` is read against. */
const NEVER_HERE = [
  "landing_render",
  "landing_engage",
  "application_start",
  "feed_render",
  "follow_open",
  "follow_rss",
];

test.describe("find-page instrument validity — does the page emit the counter EXP-014 reads?", () => {
  test("a find page load emits item_render and production accepts it", async ({
    page,
    request,
    baseURL,
  }, testInfo) => {
    // Once, not once per viewport. The listener set is identical at both widths and a second load
    // would write a second `item_render_bot` for no extra evidence, which makes the increment this
    // run causes harder to recognise in tomorrow's snapshot.
    test.skip(testInfo.project.name !== "desktop-1440x900", "instrument check runs once");

    // --- the page under test comes from production, not from this file ------------------------
    // A find id typed in here goes stale the first time a find is retracted, and the spec would
    // then fail on a 404 and be read as a dead beacon. The sitemap is what production says it
    // publishes.
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status(), "GET /sitemap.xml status").toBe(200);
    const locs = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    const finds = locs
      .map((u) => {
        try {
          return new URL(u).pathname;
        } catch {
          return null;
        }
      })
      .filter((p) => p && /^\/[A-Za-z0-9_.-]+\/\d+$/.test(p));
    expect(finds.length, "the sitemap advertises no find page — there is nothing to check").toBeGreaterThan(0);
    const target = finds[0];

    const pulses = [];
    const pageErrors = [];
    const consoleErrors = [];
    const httpErrors = [];

    page.on("pageerror", (e) => pageErrors.push(String(e)));
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push({ text: m.text(), url: m.location()?.url ?? "" });
    });
    const targetOrigin = new URL(baseURL).origin;
    page.on("response", (res) => {
      const u = new URL(res.url());
      if (res.status() >= 400 && u.origin === targetOrigin) {
        httpErrors.push({ url: res.url(), status: res.status(), resourceType: res.request().resourceType() });
      }
      if (!u.pathname.startsWith(PULSE_PREFIX)) return;
      pulses.push({ name: u.pathname.slice(PULSE_PREFIX.length), status: res.status() });
    });

    // Armed before the navigation: the beacon is the first statement of the page's script and can
    // resolve before `goto` returns.
    const renderPromise = page.waitForResponse(
      (r) => r.url().includes(`${PULSE_PREFIX}${UNGATED}`),
      { timeout: 15_000 },
    );

    // Direct, referrer-less. See the binding-clause note in this file's header — reaching this
    // page by clicking a permalink would write `item_view_onsite_bot` and put a first-party
    // Referer on a find page inside an open window.
    const res = await page.goto(target, { waitUntil: "load" });
    expect(res, `no response for GET ${target}`).not.toBeNull();
    expect(res.status(), `GET ${target} status`).toBe(200);
    const pageOrigin = new URL(page.url()).origin;

    // Checked before the beacon is awaited. A throw earlier in the same inline script detaches
    // everything below it, and that is the failure mode that makes a working page look like a
    // page nobody rendered.
    expect(pageErrors, `the find page threw on load: ${pageErrors.join(" | ")}`).toEqual([]);

    // --- the assertion this file exists for ---------------------------------------------------
    const renderRes = await renderPromise;
    const renderHeaders = await renderRes.request().allHeaders();

    expect(renderRes.status(), "item_render was not accepted by production").toBe(204);
    // The same-origin guard on POST /api/pulse/:name is the half a command-line caller cannot
    // satisfy and a real browser does. A beacon that fires and is refused writes nothing, and
    // would look identical in the counters to a beacon that never fired.
    expect(renderHeaders.origin, "browser sent no Origin on item_render, or not the page's own").toBe(
      pageOrigin,
    );

    // One page load, one increment. `item_render` is read against `item_view`, which is counted
    // once per request, so a beacon that re-fired would make the ratio exceed 1 for reasons that
    // have nothing to do with who arrived.
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(1_000);
    expect(
      pulses.filter((p) => p.name === UNGATED).length,
      "item_render fired more than once on a single page load",
    ).toBe(1);

    // Nothing gated may have fired: this spec never opened the dialog, so a `find_follow_open`
    // here would be the page reporting an interaction nobody performed.
    expect(
      pulses.map((p) => p.name).filter((n) => n !== UNGATED),
      "a gated or foreign pulse fired on a bare find-page load",
    ).toEqual([]);
    expect(
      pulses.map((p) => p.name).filter((n) => NEVER_HERE.includes(n)),
      "a pulse belonging to another page fired on the find page",
    ).toEqual([]);
    expect(
      pulses.filter((p) => p.status !== 204),
      `production refused a pulse: ${JSON.stringify(pulses)}`,
    ).toEqual([]);

    const evidence = {
      measured_at: new Date().toISOString(),
      utc_day: new Date().toISOString().slice(0, 10),
      target: baseURL,
      find_page: target,
      page_origin: pageOrigin,
      sitemap_find_pages: finds.length,
      item_render_observed: pulses.filter((p) => p.name === UNGATED).length,
      item_render_status: renderRes.status(),
      pulses,
      page_errors: pageErrors,
      console_errors: consoleErrors,
      http_errors: httpErrors,
      note:
        "Instrument validity for item_render, the script-execution counter EXP-014 Forks B, C and F rest on. " +
        "Establishes that the beacon fires from a real browser and is accepted; establishes nothing about who arrives. " +
        "The headless user-agent means every increment lands in item_view_bot / item_render_bot and never in the " +
        "unsuffixed names EXP-014 grades, which is what makes this dispatchable inside the open window. " +
        "No fork of EXP-014 may be graded from this file.",
    };
    // Before anything optional can fail — L-20. The artifact zip is the one place this executor
    // cannot open, so the values go to the job log first.
    console.log("EVIDENCE " + JSON.stringify(evidence));
    fs.writeFileSync(path.join(ARTIFACTS, "find-instrument.json"), JSON.stringify(evidence, null, 2));
    await testInfo.attach("find-instrument.json", {
      body: JSON.stringify(evidence, null, 2),
      contentType: "application/json",
    });
  });
});
