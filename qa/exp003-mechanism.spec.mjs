// EXP-003 — application mechanism test.
//
// Pre-registered in ops/EXPERIMENTS.md BEFORE this ran. Read that entry first: the six success
// criteria and the contamination rules below are fixed there, not here, and this file is only their
// executable form.
//
// The one thing to understand about this suite: it must not create an application. The funnel it is
// diagnosing is `0 applications / 115 landing views`, and a test that submitted a real application
// would write itself into the number under study. So the submit is intercepted inside Chromium and
// fulfilled locally — it never reaches the Worker, never inserts a row, never increments
// `application_submit`. The only request that touches the live mutating route is a deliberately
// invalid one that `src/index.ts` rejects with 400 before both the INSERT and the counter.

import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const SHOTS = path.join(process.cwd(), "artifacts", "shots");
fs.mkdirSync(SHOTS, { recursive: true });

// RFC 2606 reserves `.invalid`, so this string is syntactically an address and can never route
// anywhere. It is also never sent: the request carrying it is fulfilled inside the browser.
const TEST_EMAIL = "exp003-intercepted-never-sent@example.invalid";
const TEST_NOTE = "EXP-003 mechanism probe — intercepted in-browser, never submitted.";
const TEST_ROLE = "agent";

function hostOf(url) {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

test.describe("EXP-003 — can a visitor actually apply?", () => {
  test("landing loads clean, the form is usable, and submit issues exactly one correct POST", async ({
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

    // --- criterion 3/4 apparatus: intercept the submit before it can mutate anything -------------
    const captured = [];
    await page.route("**/waitlist", async (route) => {
      const req = route.request();
      captured.push({
        url: req.url(),
        method: req.method(),
        contentType: req.headers()["content-type"] ?? "",
        body: req.postData(),
      });
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    // --- criterion 1: the page loads ------------------------------------------------------------
    const response = await page.goto("/", { waitUntil: "load" });
    expect(response, "no response for GET /").not.toBeNull();
    expect(response.status(), "GET / status").toBe(200);

    // --- criterion 2: the form is present, visible, enabled, and fits the viewport ---------------
    const form = page.locator("#waitlist");
    const email = page.locator("#wl-email");
    const role = page.locator("#wl-role");
    const note = page.locator("#wl-note");
    const button = page.locator("#wl-btn");

    for (const [name, loc] of [
      ["#waitlist", form],
      ["#wl-email", email],
      ["#wl-role", role],
      ["#wl-note", note],
      ["#wl-btn", button],
    ]) {
      await expect(loc, `${name} should be visible`).toBeVisible();
    }
    for (const [name, loc] of [
      ["#wl-email", email],
      ["#wl-role", role],
      ["#wl-note", note],
      ["#wl-btn", button],
    ]) {
      await expect(loc, `${name} should be enabled`).toBeEnabled();
    }

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(
      overflow.scrollWidth,
      `page overflows horizontally: scrollWidth ${overflow.scrollWidth} > innerWidth ${overflow.innerWidth}`,
    ).toBeLessThanOrEqual(overflow.innerWidth + 1);

    // Is the call to action reachable without hunting for it? Recorded, not graded — measuring CTA
    // reach properly is the *next* cycle's job, and this run must not pre-empt it.
    const formBox = await form.boundingBox();
    const aboveFold = formBox ? formBox.y + formBox.height <= testInfo.project.use.viewport.height : false;

    const shot = (n) => path.join(SHOTS, `${testInfo.project.name}-${n}.png`);
    await page.screenshot({ path: shot("1-landing-viewport") });
    await page.screenshot({ path: shot("2-landing-full"), fullPage: true });
    await form.screenshot({ path: shot("3-form") });

    // --- criterion 3/4: fill it the way a person would, and submit ------------------------------
    await email.fill(TEST_EMAIL);
    await role.selectOption(TEST_ROLE);
    await note.fill(TEST_NOTE);
    await button.click();

    await expect
      .poll(() => captured.length, { message: "no POST was issued by the form", timeout: 15_000 })
      .toBeGreaterThan(0);
    // Give a duplicate submit a chance to show up before asserting there was exactly one.
    await page.waitForTimeout(1500);

    expect(captured.length, "the form should issue exactly one request").toBe(1);
    const req = captured[0];
    expect(req.method, "request method").toBe("POST");
    expect(req.url, "request URL").toBe(`${target.origin}/waitlist`);
    expect(req.contentType, "request content-type").toContain("application/json");

    let payload;
    expect(() => {
      payload = JSON.parse(req.body ?? "");
    }, `request body is not JSON: ${req.body}`).not.toThrow();
    expect(Object.keys(payload).sort(), "payload keys").toEqual(["email", "note", "role"]);
    expect(payload.email, "payload email").toBe(TEST_EMAIL);
    expect(payload.role, "payload role").toBe(TEST_ROLE);
    expect(payload.note, "payload note").toBe(TEST_NOTE);

    // --- criterion 5: the success branch of the client script is actually reachable --------------
    const out = page.locator("#wl-out");
    await expect(out, "confirmation text after a 200").toContainText("Application received", {
      timeout: 10_000,
    });
    await expect(form, "form should hide itself after success").toBeHidden();
    await page.screenshot({ path: shot("4-after-submit") });

    // --- criterion 1, graded ---------------------------------------------------------------------
    const firstParty = (u) => u === "" || hostOf(u) === target.host;
    const scriptConsoleErrors = consoleErrors.filter((e) => firstParty(e.url));
    const thirdPartyConsoleErrors = consoleErrors.filter((e) => !firstParty(e.url));
    const firstPartyFailures = failedRequests.filter((f) => firstParty(f.url));
    const thirdPartyFailures = failedRequests.filter((f) => !firstParty(f.url));

    const summary = {
      experiment: "EXP-003",
      project: testInfo.project.name,
      viewport: testInfo.project.use.viewport,
      target: target.origin,
      httpStatus: response.status(),
      formVisible: true,
      horizontalOverflow: overflow.scrollWidth > overflow.innerWidth + 1,
      documentScrollWidth: overflow.scrollWidth,
      viewportInnerWidth: overflow.innerWidth,
      formFullyAboveFold: aboveFold,
      requestsToWaitlist: captured.length,
      requestUrl: req.url,
      requestMethod: req.method,
      requestContentType: req.contentType,
      payloadKeys: Object.keys(payload).sort(),
      payloadMatchesTypedValues: true,
      successBranchReached: true,
      pageErrors,
      firstPartyConsoleErrors: scriptConsoleErrors,
      firstPartyRequestFailures: firstPartyFailures,
      thirdPartyConsoleErrors,
      thirdPartyRequestFailures: thirdPartyFailures,
      contamination: {
        submitReachedServer: false,
        rowsInserted: 0,
        applicationSubmitIncremented: false,
        landingViewsCaused: "counted as landing_view_bot (headless user-agent)",
      },
    };
    console.log(`\nEXP003_SUMMARY ${JSON.stringify(summary, null, 2)}\n`);
    fs.writeFileSync(
      path.join(process.cwd(), "artifacts", `summary-${testInfo.project.name}.json`),
      JSON.stringify(summary, null, 2),
    );

    expect(pageErrors, "uncaught page errors").toEqual([]);
    expect(scriptConsoleErrors, "first-party console errors").toEqual([]);
    expect(firstPartyFailures, "first-party request failures").toEqual([]);
  });

  // Criterion 6. Runs once, from the desktop project only: it is a property of the live route, not
  // of a viewport, and hitting a mutating route twice for one fact is careless.
  test("the live route rejects an invalid email with 400, before any write", async ({
    request,
    baseURL,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440x900", "route-level check runs once");

    // Not an address at all, so it cannot be mistaken for fabricated PII. src/index.ts:99 rejects it
    // before the INSERT on line 101 and before track() on line 104.
    const res = await request.post(`${baseURL}/waitlist`, {
      data: { email: "exp003-not-an-email", role: "agent", note: "EXP-003 negative control" },
    });
    const body = await res.text();
    console.log(`\nEXP003_ROUTE_CHECK ${JSON.stringify({ status: res.status(), body })}\n`);
    expect(res.status(), "invalid email should be rejected with 400").toBe(400);
    expect(body, "rejection body").toContain("invalid email");
  });
});
