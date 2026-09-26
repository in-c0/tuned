// Does every public page actually fit a phone?
//
// Not an experiment — a regression check on a defect run 165 measured and left, and it is here
// rather than in the vitest suite because the failure is geometry and a markup assertion cannot
// see geometry (L-83's neighbour: run 165 learned the same boundary one step in).
//
// WHY THE EXISTING CHECK CANNOT SEE THIS, which is the whole reason this file exists.
// `public-surfaces.spec.mjs` and `exp008-provenance.spec.mjs` both assert
//
//     document.documentElement.scrollWidth <= window.innerWidth + 1
//
// on the mobile project. That is a real check and it catches a page that scrolls sideways. It is
// structurally blind to the failure below, because the failure moves BOTH of those numbers
// together and leaves them equal.
//
// A card's `.meta` row is a single nowrap flex line carrying the source's name, which is whatever
// the page called itself and is a bare domain when it called itself nothing. A domain has no
// spaces, so it is one unbreakable token: it sets the row's min-content width, the line box grows
// past the card, and the initial containing block grows with it. Chrome on a phone then zooms the
// whole document out to fit — `innerWidth` becomes the content width, `scrollWidth` matches it,
// the existing assertion reads green, and every word on the page has shrunk by a third.
//
// So this spec compares the layout viewport against the DEVICE instead of against itself:
//
//     window.innerWidth <= the width this project asked for   (not zoomed out to fit)
//     scrollWidth       <= window.innerWidth                  (does not scroll sideways)
//
// Neither alone covers the class. Both are asserted on every public page, and the pages are read
// out of the live sitemap rather than listed here, so a feed or find page this loop publishes
// later is covered the day it is published and not the day somebody remembers to add it.
//
// THE THIRD READING, ADDED RUN 167, AND WHY THE FIRST TWO CANNOT COVER IT EITHER.
// This spec's first production run measured every page at 390px, reported `brokenCount: 0`, and
// in the same JSON reported `<span class="a">` on `/ava` — an artist's name — 371.2px wide and
// ending at 418.2px on a 390px device. Both numbers were right. The page fitted, because the
// container the name sits in sets `overflow: hidden`, so the name could not widen the document;
// it was cut off mid-word instead, with no ellipsis to say anything was missing, and the track
// title beside it had been squeezed to ZERO width by a flex item that could not shrink.
//
// That is the inverse of the failure above and it is invisible to both readings by construction:
// `overflow: hidden` is exactly the declaration that keeps `innerWidth` and `scrollWidth` honest
// while destroying the content. A page-level measurement cannot see inside a box that fits.
//
// So the element list this spec was already collecting is now GRADED rather than only reported:
//
//     no element's right edge is past the device edge     (nothing is cut off)
//
// An element past the edge is either widening the page — caught above — or being clipped by an
// ancestor, which is this reading. Reporting it and not failing on it is how run 166 shipped a
// verified deploy over a defect its own artifact had already measured.
//
// GETs only, no mutating route. The headless user-agent means every view this causes is
// classified as bot traffic by src/metrics.ts and never enters a human-flagged denominator.

import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const SHOTS = path.join(process.cwd(), "artifacts", "shots");
fs.mkdirSync(SHOTS, { recursive: true });

// A find page is one document per published find and production has dozens. Visiting all of them
// would make this the slowest thing the loop runs for no extra coverage: they are one template.
// The landing page and every feed page are visited in full, because those are a handful and each
// renders a different member's items.
const FIND_SAMPLE = 8;

/** Read the page's own geometry. Everything here is measured in the browser, nothing is inferred.
 *
 *  `deviceWidth` is the width this project ASKED for, passed in, not read from the page. It is
 *  deliberately not `window.screen.width`: that is emulated, and Playwright resolves it from the
 *  device descriptor rather than from the viewport override, so the two disagree under some
 *  configurations and the check would silently acquire slack it was never given. The width we
 *  requested is the width a phone has; `innerWidth` is the layout viewport, which is the number
 *  the page can push. That difference is the reading. */
async function measure(page, deviceWidth) {
  return page.evaluate((deviceWidth) => {
    const layoutWidth = window.innerWidth;
    const offenders = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.right <= deviceWidth + 0.5) continue;
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: typeof el.className === "string" ? el.className : "",
        text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60),
        width: Math.round(r.width * 10) / 10,
        right: Math.round(r.right * 10) / 10,
      });
    }
    // Widest first: the element furthest past the edge is the one that set the width.
    offenders.sort((a, b) => b.right - a.right);
    return {
      deviceWidth,
      layoutWidth,
      screenWidth: window.screen.width,
      scrollWidth: document.documentElement.scrollWidth,
      zoomedOut: layoutWidth > deviceWidth + 1,
      scrollsSideways: document.documentElement.scrollWidth > layoutWidth + 1,
      // True when anything at all reaches past the device edge. On a page that fits, that is
      // content an ancestor's `overflow: hidden` is cutting off without saying so.
      overEdge: offenders.length > 0,
      offenders: offenders.slice(0, 10),
    };
  }, deviceWidth);
}

test.describe("every public page fits a phone", () => {
  // Geometry is a property of a viewport, so this runs on the mobile project only. Fetching every
  // public document a second time at 1440px would cost production a second set of views to assert
  // something no desktop user can hit.
  test("no public page is zoomed out or scrolled sideways at phone width", async ({
    page,
    request,
    baseURL,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile-390x844",
      "a phone-fit check on a desktop viewport asserts nothing",
    );

    const target = new URL(baseURL);
    const deviceWidth = testInfo.project.use.viewport.width;

    // --- the page list comes from production, not from this file ---------------------------------
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status(), "GET /sitemap.xml status").toBe(200);
    const xml = await sitemap.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    expect(locs.length, "the sitemap should advertise at least the landing page").toBeGreaterThan(0);

    // A sitemap states the canonical origin, which is `https://justtuned.com` even when this spec
    // is pointed at a local `wrangler dev` — so the entries are checked for being internally
    // canonical (one origin, no strays) and then followed by PATH against whatever host is under
    // test. Asserting they match the target would be a true statement about production and a
    // false one about every other vantage point, which is how a check ends up only ever run once.
    const parsed = locs.map((u) => {
      try {
        return new URL(u);
      } catch {
        return null;
      }
    });
    expect(parsed.filter((u) => u === null).length, `unparseable <loc> in sitemap: ${locs.join(", ")}`).toBe(0);
    const origins = [...new Set(parsed.map((u) => u.origin))];
    expect(origins, "the sitemap should advertise exactly one origin").toHaveLength(1);

    const paths = parsed.map((u) => u.pathname);
    // Every single-segment path is visited in full — the feeds, and `/terms` and `/privacy` with
    // them. There are a handful of them and each is a different document; excluding the legal
    // pages because they are boring is how a page stops being checked.
    const landing = paths.filter((p) => p === "/");
    const singles = paths.filter((p) => /^\/[A-Za-z0-9_.-]+$/.test(p));
    const finds = paths.filter((p) => /^\/[A-Za-z0-9_.-]+\/\d+$/.test(p));

    // Spread the sample across the whole list rather than taking the first N, so a defect in the
    // oldest finds and a defect in the newest are equally likely to be caught.
    const step = Math.max(1, Math.ceil(finds.length / FIND_SAMPLE));
    const findSample = finds.filter((_, i) => i % step === 0).slice(0, FIND_SAMPLE);

    // The address a sitemap can never advertise, and which this spec's own heading nonetheless
    // covers: since run 195 a public 404 is a rendered page, not twelve bytes of plain text — it
    // is where a reader who followed a retracted find's RSS link arrives. It is derived here the
    // same way every other path is, by mutating a handle this site publishes into one it does
    // not, so nothing about it is typed. It was added because its first render overlapped its own
    // two buttons at 390px while every document-level assertion about it passed.
    const absent = [];
    if (singles.length) absent.push({ path: `${singles[0]}-not-a-feed`, status: 404 });
    if (finds.length) absent.push({ path: `${finds[0].split("/")[1] ? "/" + finds[0].split("/")[1] : ""}/99999999`, status: 404 });

    const visiting = [
      ...[...landing, ...singles, ...findSample].map((path) => ({ path, status: 200 })),
      ...absent.filter((a) => a.path.startsWith("/") && a.path !== "/99999999"),
    ];
    expect(visiting.length, "nothing to visit — the sitemap parse is wrong").toBeGreaterThan(0);

    // --- measure each one -------------------------------------------------------------------------
    const readings = [];
    for (const { path: p, status } of visiting) {
      const res = await page.goto(p, { waitUntil: "load" });
      expect(res, `no response for GET ${p}`).not.toBeNull();
      expect(res.status(), `GET ${p} status`).toBe(status);
      const m = await measure(page, deviceWidth);
      readings.push({ path: p, ...m });
      if (m.zoomedOut || m.scrollsSideways || m.overEdge) {
        await page.screenshot({
          path: path.join(SHOTS, `mobile-fit-FAIL${p.replace(/\//g, "_") || "_root"}.png`),
          fullPage: true,
        });
      }
    }

    const broken = readings.filter((r) => r.zoomedOut || r.scrollsSideways || r.overEdge);

    const summary = {
      check: "mobile-fit",
      project: testInfo.project.name,
      viewport: testInfo.project.use.viewport,
      target: target.origin,
      sitemapUrls: locs.length,
      visited: {
        landing: landing.length,
        singles: singles.length,
        finds: findSample.length,
        absent: visiting.filter((v) => v.status === 404).length,
        total: visiting.length,
      },
      findsInSitemap: finds.length,
      brokenCount: broken.length,
      broken,
      readings,
      contamination: {
        mutatingRequests: 0,
        rowsInserted: 0,
        viewsCaused:
          "landing_view_bot + feed_view_bot + item_view_bot (headless user-agent); human series untouched",
      },
    };
    console.log(`\nMOBILE_FIT_SUMMARY ${JSON.stringify(summary, null, 2)}\n`);
    fs.mkdirSync(path.join(process.cwd(), "artifacts"), { recursive: true });
    fs.writeFileSync(
      path.join(process.cwd(), "artifacts", `mobile-fit-${testInfo.project.name}.json`),
      JSON.stringify(summary, null, 2),
    );

    // --- graded ------------------------------------------------------------------------------------
    // Reported as one list rather than failing on the first page, because "which pages" is the
    // useful fact and stopping at the first one hides it.
    const describe = (r) =>
      `${r.path}: ${
        r.zoomedOut ? "ZOOMED OUT" : r.scrollsSideways ? "SCROLLS SIDEWAYS" : "CONTENT PAST THE EDGE"
      } — layout ${r.layoutWidth}px vs device ${r.deviceWidth}px, scrollWidth ${r.scrollWidth}px` +
      (r.offenders.length
        ? ` — widest past the edge: <${r.offenders[0].tag} class="${r.offenders[0].cls}"> "${r.offenders[0].text}" ending at ${r.offenders[0].right}px`
        : "");

    expect(
      broken.map(describe),
      "public pages that do not fit a phone (zoomed out to fit, scrolling sideways, or cutting content off at the device edge)",
    ).toEqual([]);
  });
});
