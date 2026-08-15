// EXP-007 instrument validity — does the deployed landing page actually emit its counters?
//
// This is not a new experiment and it does not change EXP-007's pre-registration. It is a
// pre-gate check on EXP-007's *apparatus*, run deliberately on UTC day 2026-08-15 so that it
// lands outside the complete-UTC-day window (2026-08-16) that EXP-007 reads.
//
// Why it exists. EXP-007's whole value is that it separates three explanations of "605 landing
// views, 0 applications" that no existing counter can tell apart. Its instrument validity gate
// says: if `landing_engage + landing_engage_bot` reads 0 on the first complete day while
// `landing_view` is non-zero, the instrument is broken and no fork may be graded. That gate is
// correct, and it is also the *only* thing standing between a silent JavaScript failure and a
// confident, wrong reading of Fork A ("nobody real is arriving"). It fires two days after
// deploy, and its remedy — "fix the pulse" — costs the experiment its only clean first reading.
//
// What is actually unverified. `test/pulse.test.ts` proves the *route* counts, rejects foreign
// origins and holds its allowlist, against a real D1 in workerd. Run 44 proved from GitHub's
// network that the deployed route answers 403 to a caller with no Origin. Neither one proves the
// half that has never been observed anywhere: that the page-side listeners attach in a real
// browser against production and that the request they send is accepted. The counters live at
// the end of a single inline <script>; anything that throws earlier in that block detaches them
// and produces exactly the zeros Fork A predicts.
//
// Footprint. GETs plus the two pulse POSTs the page itself sends. The application form is typed
// into and **never submitted** — `applications` has read 0 for nine days and that number stays
// clean. The headless user-agent means src/metrics.ts classifies everything this suite causes as
// bot traffic, so the increments land in `landing_engage_bot` / `application_start_bot` on
// 2026-08-15 and never enter either the human-flagged counters EXP-007's forks read or the day
// they read them.

import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ARTIFACTS = path.join(process.cwd(), "artifacts");
fs.mkdirSync(ARTIFACTS, { recursive: true });

const PULSE_PREFIX = "/api/pulse/";

// The server-side allowlist, mirrored here so an unexpected third name is a failure rather than
// something this suite quietly counts. Kept in sync with PULSE_COUNTERS in src/index.ts.
const ALLOWED = ["landing_engage", "application_start"];

test.describe("EXP-007 instrument validity — does the page emit what the experiment reads?", () => {
  test("a real interaction emits landing_engage, and a real keystroke emits application_start", async ({
    page,
    baseURL,
  }, testInfo) => {
    // Route-level facts, not viewport-level ones, and the listener set is identical at both
    // widths. Running this twice would double this suite's footprint in the very counters under
    // validation for no extra evidence.
    test.skip(testInfo.project.name !== "desktop-1440x900", "instrument check runs once");

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

    await page.goto("/", { waitUntil: "load" });
    const pageOrigin = new URL(page.url()).origin;

    // Checked before any interaction. A thrown error earlier in the inline script is the exact
    // failure mode that makes a working page look like an empty funnel, and it is invisible in
    // every artifact this loop currently collects.
    expect(pageErrors, `page threw before any interaction: ${pageErrors.join(" | ")}`).toEqual([]);

    // Nothing should have fired yet: both counters are interaction-gated, and a pulse on bare
    // page load would mean the page is reporting engagement nobody performed.
    expect(pulses, "a pulse fired on page load, before any interaction").toEqual([]);

    // --- landing_engage: the first sign of something behaving like a person ---
    //
    // Tab rather than a click or a scroll: it is a genuine `keydown` on the window, it cannot
    // navigate away by landing on a link, and it does not depend on the page being tall enough
    // to scroll at this viewport.
    const engagePromise = page.waitForResponse(
      (r) => r.url().includes(`${PULSE_PREFIX}landing_engage`),
      { timeout: 15_000 },
    );
    await page.keyboard.press("Tab");
    const engageRes = await engagePromise;
    const engageHeaders = await engageRes.request().allHeaders();

    expect(engageRes.status(), "landing_engage was not accepted by production").toBe(204);
    // The same-origin guard is the one part of this route that a real browser satisfies and a
    // command-line caller cannot. Run 44 proved the 403 half from GitHub's network; this is the
    // half that was missing.
    expect(engageHeaders.origin, "browser sent no Origin, or not the page's own").toBe(pageOrigin);

    // --- one-shot: the counter must not re-fire for the rest of the page load ---
    await page.keyboard.press("Tab");
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(1_000);
    expect(
      pulses.filter((p) => p.name === "landing_engage").length,
      "landing_engage fired more than once on a single page load",
    ).toBe(1);

    // --- application_start: did engagement reach the form? ---
    //
    // The free-text note field, not the email field: this types into the application form to
    // prove the listener is attached, and typing an address into an unsubmitted form is the one
    // keystroke here worth not making.
    const startPromise = page.waitForResponse(
      (r) => r.url().includes(`${PULSE_PREFIX}application_start`),
      { timeout: 15_000 },
    );
    await page.locator("#wl-note").pressSequentially("qa", { delay: 60 });
    const startRes = await startPromise;

    expect(startRes.status(), "application_start was not accepted by production").toBe(204);

    await page.locator("#wl-note").pressSequentially("qa", { delay: 60 });
    await page.waitForTimeout(1_000);
    expect(
      pulses.filter((p) => p.name === "application_start").length,
      "application_start fired more than once on a single page load",
    ).toBe(1);

    // --- the suite's own footprint, asserted rather than assumed ---
    expect(
      pulses.map((p) => p.name).filter((n) => !ALLOWED.includes(n)),
      "the page emitted a pulse name outside the server-side allowlist",
    ).toEqual([]);
    expect(
      pulses.filter((p) => p.status !== 204),
      `production refused a pulse: ${JSON.stringify(pulses)}`,
    ).toEqual([]);
    // Never submitted. `applications` has read 0 for nine days and this suite does not get to
    // be the reason that changes.
    expect(await page.locator("#wl-out").textContent(), "the application form was submitted").toBe(
      "",
    );
    expect(pageErrors, `page threw during interaction: ${pageErrors.join(" | ")}`).toEqual([]);

    const evidence = {
      measured_at: new Date().toISOString(),
      target: baseURL,
      page_origin: pageOrigin,
      pulses,
      page_errors: pageErrors,
      console_errors: consoleErrors,
      application_submitted: false,
      note: "Instrument validity pre-check for EXP-007, run on UTC day 2026-08-15 — outside the complete UTC day 2026-08-16 that EXP-007 reads. The increments this caused are bot-classified by src/metrics.ts because of the headless user-agent.",
    };
    fs.writeFileSync(
      path.join(ARTIFACTS, "pulse-instrument.json"),
      JSON.stringify(evidence, null, 2),
    );
    await testInfo.attach("pulse-instrument.json", {
      body: JSON.stringify(evidence, null, 2),
      contentType: "application/json",
    });
    await page.screenshot({
      path: path.join(ARTIFACTS, "shots", "pulse-instrument-desktop.png"),
      fullPage: false,
    });
  });
});
