// A page-level vantage on candidate source material.
//
// Why this exists. Runs 44, 45 and 46 each recorded the same limitation in the same words: this
// executor's egress proxy blocks direct page fetches, so "an agent it drives encounters material at
// result level, not page level". Run 46 followed that through to its consequence — EXP-008's
// threshold 6 ("the find is real ... the `why` line describes what was actually encountered") cannot
// be satisfied honestly by something that never opened the page, so the pre-registered outcome is
// *publish nothing*; nothing published means ops/DISTRIBUTION.md's freshness condition A4 never
// clears; and while A4 fails, no distribution channel is admissible for Tuned at all.
//
// So the blocked half of that sentence is load-bearing for the whole commercial path, and it is the
// only half that was never actually tested. Search returns results in this environment. Fetching the
// page behind a result is what returns 403 at the proxy. This spec closes that gap from the vantage
// the loop already owns and has used 36 times: a real browser inside GitHub Actions.
//
// What it is NOT. Not a crawler — exactly one page per dispatch, no link following, no pagination.
// Not a second production prober — it refuses justtuned.com by construction (see REFUSED below).
// Not a summarizer: it reports what the page says, quoted and bounded, and draws no conclusion about
// whether the material is worth publishing. That judgement belongs to a human-readable remit and to
// EXP-008's thresholds, not to this file.
//
// GETs only. No credentials are available to it and none are accepted in the URL.

import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ARTIFACTS = path.join(process.cwd(), "artifacts");
fs.mkdirSync(ARTIFACTS, { recursive: true });

const SOURCE_URL = process.env.SOURCE_URL ?? "";

// Announce what this is, truthfully. Tuned's doctrine is explicit provenance; a reader that lies
// about being an agent to get past a filter would be the same defect as a fabricated find. A site
// that refuses headless agents is a real reading — "this page could not be encountered" — and that
// outcome is reported rather than worked around.
const READER_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) " +
  "HeadlessChrome/140.0.0.0 Safari/537.36 tuned-source-reader (+https://justtuned.com)";

// How much page text is enough to tell whether a find is real without turning this into a scraper
// that mirrors other people's articles into a public CI log.
const EXCERPT_CHARS = 4000;

/**
 * Reasons a URL is refused before a browser is ever launched. Each is a boundary this reader should
 * not be able to cross even by mistake, so they are enforced here rather than trusted to the caller.
 */
function refuse(raw) {
  let u;
  try {
    u = new URL(raw);
  } catch {
    return "not a valid absolute URL";
  }

  const isLocal = u.hostname === "127.0.0.1" || u.hostname === "localhost";

  // Plaintext to a third party leaks the read to anyone on the path. Loopback is exempted because
  // that is how this spec is developed at all, and it cannot reach anything outside the machine.
  if (u.protocol !== "https:" && !(u.protocol === "http:" && isLocal)) {
    return "only https:// is read (http:// is permitted for loopback development only)";
  }

  // Credentials must never ride in a URL that gets echoed into a public Actions log.
  if (u.username || u.password) return "URL carries credentials";

  // This is a reader for *other people's* material. Tuned's own surfaces already have two
  // instruments — verify-production.yml and qa-browser.yml — and pointing a third at production
  // would put untracked headless traffic through the very funnel counters EXP-007 is measuring.
  const host = u.hostname.toLowerCase();
  if (host === "justtuned.com" || host.endsWith(".justtuned.com") || host.endsWith(".workers.dev")) {
    return "refused: this reads source material, not Tuned's own surfaces (use qa-browser.yml)";
  }

  return null;
}

/** First non-empty value among a list of meta selectors, or null. */
async function firstMeta(page, selectors) {
  for (const sel of selectors) {
    const v = await page.locator(sel).first().getAttribute("content").catch(() => null);
    if (v && v.trim()) return v.trim();
  }
  return null;
}

/**
 * A publication date, if the page states one. Checked in descending order of how deliberate the
 * claim is: explicit article metadata, then citation metadata, then JSON-LD, then a visible <time>.
 * Returns null rather than guessing — an invented date on a "find" would be a fabricated claim.
 */
async function publishedAt(page) {
  const meta = await firstMeta(page, [
    'meta[property="article:published_time"]',
    'meta[name="citation_publication_date"]',
    'meta[name="dc.date"]',
    'meta[name="dcterms.date"]',
    'meta[name="prism.publicationDate"]',
  ]);
  if (meta) return { value: meta, source: "meta" };

  const ld = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents()
    .catch(() => []);
  for (const block of ld) {
    const m = block.match(/"datePublished"\s*:\s*"([^"]+)"/);
    if (m) return { value: m[1], source: "json-ld" };
  }

  const t = await page.locator("time[datetime]").first().getAttribute("datetime").catch(() => null);
  if (t && t.trim()) return { value: t.trim(), source: "time[datetime]" };

  return null;
}

test.describe("source read — open one candidate page and report what is actually on it", () => {
  test("reads the page and records the evidence", async ({ page }, testInfo) => {
    // One fetch per dispatch. Running this at both viewports would open the same third-party page
    // twice for one reading, which is discourteous to the host and adds nothing.
    test.skip(testInfo.project.name !== "desktop-1440x900", "one read per dispatch");

    expect(SOURCE_URL, "SOURCE_URL must be set").not.toBe("");

    const refusal = refuse(SOURCE_URL);
    expect(refusal, `SOURCE_URL refused — ${refusal}`).toBeNull();

    await page.setExtraHTTPHeaders({ "User-Agent": READER_UA });

    const response = await page.goto(SOURCE_URL, { waitUntil: "domcontentloaded", timeout: 45_000 });
    expect(response, "no response from the page").not.toBeNull();

    const status = response.status();
    // Let the network settle for JS-rendered pages, but do not fail the read if it never idles —
    // a page that keeps polling is still a page that was opened.
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    const finalUrl = page.url();
    const title = (await page.title().catch(() => "")) || null;
    const description = await firstMeta(page, [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="citation_abstract"]',
    ]);
    const published = await publishedAt(page);

    const bodyText = await page.locator("body").innerText().catch(() => "");
    const normalized = bodyText.replace(/\s+/g, " ").trim();

    // Reported, never asserted. A consent or paywall interstitial still "loads" with HTTP 200, and
    // the difference between reading an article and reading its gate is the whole question here.
    const gateHints = ["accept cookies", "subscribe to continue", "sign in to read", "paywall", "verify you are human"];
    const lower = normalized.toLowerCase();
    const gates = gateHints.filter((h) => lower.includes(h));

    const evidence = {
      requested_url: SOURCE_URL,
      final_url: finalUrl,
      redirected: finalUrl !== SOURCE_URL,
      http_status: status,
      title,
      description,
      published_at: published?.value ?? null,
      published_at_source: published?.source ?? null,
      visible_text_chars: normalized.length,
      excerpt: normalized.slice(0, EXCERPT_CHARS),
      excerpt_truncated: normalized.length > EXCERPT_CHARS,
      possible_gate_markers: gates,
      read_by: READER_UA,
    };

    fs.writeFileSync(path.join(ARTIFACTS, "source-read.json"), JSON.stringify(evidence, null, 2));
    await page.screenshot({ path: path.join(ARTIFACTS, "source-read.png"), fullPage: true });

    // The executor reads dispatches through the Actions log, so the evidence has to be *in* the log
    // and not only in an artifact it cannot download.
    console.log("--- SOURCE READ EVIDENCE ---");
    console.log(JSON.stringify(evidence, null, 2));
    console.log("--- END SOURCE READ EVIDENCE ---");

    // The read succeeded if the page was actually served. A 404 or 403 is a real and useful answer —
    // it says this candidate cannot be encountered — so it is recorded above and then failed here,
    // loudly, rather than passing quietly as though the page had been read.
    expect(status, `page returned HTTP ${status}`).toBeLessThan(400);
    expect(normalized.length, "page served no visible text").toBeGreaterThan(0);
  });
});
