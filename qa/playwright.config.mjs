import { defineConfig, devices } from "@playwright/test";

// The target is live production by default. The executor environment has had no direct egress to
// justtuned.com for eighteen consecutive runs, so this suite is expected to run from GitHub Actions;
// TARGET_URL exists so the same spec can be pointed at a local `wrangler dev` while it is written.
const TARGET_URL = process.env.TARGET_URL ?? "https://justtuned.com";

// Announce ourselves as headless. src/metrics.ts classifies any user-agent matching /headless/i as a
// bot, so the landing views this suite causes land in `landing_view_bot` and never inflate the
// human-flagged denominator of the very conversion ratio under study.
const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36 tuned-qa-exp003";

// CI installs the exact browser build this Playwright version expects (`playwright install chromium`).
// Some sandboxes ship a pre-installed Chromium from a different build number instead; pointing
// CHROMIUM_PATH at it lets the suite be developed there without pinning the harness to whatever
// browser happens to be lying around in one environment.
const launchOptions = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};

export default defineConfig({
  testDir: ".",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  // One worker: two browsers hitting production concurrently would interleave their landing views
  // and make the run harder to read in the counters afterwards.
  workers: 1,
  forbidOnly: true,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "artifacts/report.json" }]],
  outputDir: "artifacts/test-output",
  use: {
    baseURL: TARGET_URL,
    userAgent: USER_AGENT,
    ignoreHTTPSErrors: false,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-1440x900",
      use: {
        ...devices["Desktop Chrome"],
        userAgent: USER_AGENT,
        viewport: { width: 1440, height: 900 },
        launchOptions,
      },
    },
    {
      name: "mobile-390x844",
      use: {
        ...devices["Pixel 7"],
        userAgent: USER_AGENT,
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        launchOptions,
      },
    },
  ],
});
