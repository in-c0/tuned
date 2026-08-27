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
//
// What a green run means, since run 50 found it meaning less than it looked like: the source page
// itself was on screen. Not "an HTTP 200 came back" — a bot-check interstitial is served at 200 and
// used to pass here. See classifyRead() below.
//
// What it will NOT do to get past one. The reader declares itself headless and declares itself as
// Tuned; a site that refuses it is giving a real answer, and "this candidate cannot be encountered"
// is a reading this loop is willing to record. Spoofing the user agent, solving a challenge, or
// routing around a bot check to reach material the host is deliberately withholding is off the
// table — it is the same defect as a fabricated find, arriving one step earlier.

import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

import { findWindows } from "./find-windows.mjs";
import { matchLinks } from "./nav-links.mjs";

const ARTIFACTS = path.join(process.cwd(), "artifacts");
fs.mkdirSync(ARTIFACTS, { recursive: true });

const SOURCE_URL = process.env.SOURCE_URL ?? "";

// Optional. A LITERAL string to locate on the page — never a pattern — reported as bounded windows
// alongside the excerpt, and (since run 103) as the resolved targets of any links that carry it.
// Empty means "not asked", which is a different reading from "asked and not found";
// find-windows.mjs and nav-links.mjs both keep those apart.
const SOURCE_FIND = (process.env.SOURCE_FIND ?? "").trim();

// A ceiling on how many anchors are pulled out of the DOM before matching. Not a bound on the
// reading — matchLinks caps what is reported — but on the array crossing the page/Node boundary, so
// a link farm cannot turn one read into a memory event. Reported when it bites.
const MAX_ANCHORS_SCANNED = 2_000;

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

// Every locator call in this file carries an explicit timeout, and that is not defensive style — it
// is the fix for run 47's second dispatch. The shared playwright.config.mjs sets no `actionTimeout`,
// so an unbounded locator inherits the *test* timeout: on a page whose body never settles,
// `body.innerText()` waited out the entire 180s envelope, returned "" through its own .catch(), and
// left nothing for the screenshot. The reading came back `visible_text_chars: 0` and looked exactly
// like "the site served a blank page" when what happened was "this spec never asked with a deadline".
// A wrong reading that looks like a finding is worse than a failure.
const LOCATOR_MS = 5_000;
const BODY_TEXT_MS = 20_000;

/** First non-empty value among a list of meta selectors, or null. */
async function firstMeta(page, selectors) {
  for (const sel of selectors) {
    const v = await page
      .locator(sel)
      .first()
      .getAttribute("content", { timeout: LOCATOR_MS })
      .catch(() => null);
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
    .allTextContents({ timeout: LOCATOR_MS })
    .catch(() => []);
  for (const block of ld) {
    const m = block.match(/"datePublished"\s*:\s*"([^"]+)"/);
    if (m) return { value: m[1], source: "json-ld" };
  }

  const t = await page
    .locator("time[datetime]")
    .first()
    .getAttribute("datetime", { timeout: LOCATOR_MS })
    .catch(() => null);
  if (t && t.trim()) return { value: t.trim(), source: "time[datetime]" };

  return null;
}

/**
 * Signatures of a bot-check interstitial — a page that is not the source and never was.
 *
 * Why these are asserted rather than merely reported. Run 47 wrote `possible_gate_markers` as
 * "reported, never asserted", on the reasoning that "a consent or paywall interstitial still
 * 'loads' with HTTP 200, and the difference between reading an article and reading its gate is
 * the whole question here." It named the exact defect and then left the instrument unable to act
 * on it. Run 50 walked into it: pmc.ncbi.nlm.nih.gov returned **HTTP 200**, title
 * "Checking your browser - reCAPTCHA", 131 characters of body, `possible_gate_markers: []` — and
 * this spec reported **`1 passed`**. A green tick that means "a bot check was on screen" is the
 * instrument lying in the direction that costs most, because EXP-008's threshold 6 is the one
 * condition standing between this loop and its first publication, and a find "characterised" from
 * a reCAPTCHA page is a fabricated find arriving through a passing test.
 *
 * The two categories are kept apart on purpose. A soft gate (cookie banner, paywall, sign-in wall)
 * means the page was served and part of it is visible — a real, if shallow, encounter. An
 * interstitial means nothing of the source was reached. Only the second is fatal.
 *
 * Signatures observed live on 2026-08-17, one per host, recorded in ops/EXP-008-CANDIDATES.md.
 */
const INTERSTITIAL_TITLE =
  /just a moment|checking your browser|attention required|security check|are you a robot|recaptcha|access denied/i;
const INTERSTITIAL_BODY =
  /checking your browser before accessing|performing security verification|verifies you are not a bot|verify you are human|enable javascript and cookies to continue|ray id:/i;

/**
 * A floor on how much text a page must carry before this reader will call it a page.
 *
 * This is fail-closed by design and the number is a judgement, stated rather than buried: the
 * remit @sportstech publishes under requires "a concrete measured result or a validated
 * implementation", and no page carrying one is 1000 characters long. Its job is the interstitial
 * this loop has NOT seen yet — a bot check whose wording matches neither regex above still cannot
 * fake a thousand characters of article. A legitimately terse page that trips this fails loudly
 * with its text in the log, so a human can overrule it on the evidence; the opposite error passes
 * silently and cannot be caught at all.
 */
const MIN_PAGE_CHARS = 1000;

/** Classify what was actually on screen: the source, or something standing in front of it. */
function classifyRead(title, normalized) {
  const signals = [];
  if (title && INTERSTITIAL_TITLE.test(title)) signals.push(`title matches bot-check pattern: ${JSON.stringify(title)}`);
  const bodyHit = normalized.match(INTERSTITIAL_BODY);
  if (bodyHit) signals.push(`body matches bot-check pattern: ${JSON.stringify(bodyHit[0])}`);
  if (normalized.length < MIN_PAGE_CHARS) {
    signals.push(`only ${normalized.length} visible characters, below the ${MIN_PAGE_CHARS} floor`);
  }
  return { outcome: signals.length ? "interstitial" : "page", signals };
}

test.describe("source read — open one candidate page and report what is actually on it", () => {
  test("reads the page and records the evidence", async ({ page }, testInfo) => {
    // One fetch per dispatch. Running this at both viewports would open the same third-party page
    // twice for one reading, which is discourteous to the host and adds nothing.
    test.skip(testInfo.project.name !== "desktop-1440x900", "one read per dispatch");

    // The config's 60s default is not a budget this test can live inside, and run 47's first
    // dispatch proved it: navigation (45s) plus the settle wait (15s) consumed the entire allowance
    // before a single field was extracted, so any slow page failed by construction. The steps below
    // are individually bounded; this is the envelope around all of them, with room left over.
    test.setTimeout(180_000);

    expect(SOURCE_URL, "SOURCE_URL must be set").not.toBe("");

    const refusal = refuse(SOURCE_URL);
    expect(refusal, `SOURCE_URL refused — ${refusal}`).toBeNull();

    await page.setExtraHTTPHeaders({ "User-Agent": READER_UA });

    const response = await page.goto(SOURCE_URL, { waitUntil: "domcontentloaded", timeout: 60_000 });
    expect(response, "no response from the page").not.toBeNull();

    const status = response.status();
    // Let the network settle for JS-rendered pages, but do not fail the read if it never idles —
    // a page that keeps polling is still a page that was opened. Publisher pages routinely never
    // reach idle at all (ads, analytics beacons, lazy figures), so this is a courtesy wait with a
    // short leash, not a precondition.
    await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});

    const finalUrl = page.url();
    const title = (await page.title().catch(() => "")) || null;
    const description = await firstMeta(page, [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="citation_abstract"]',
    ]);
    const published = await publishedAt(page);

    // Two very different outcomes used to collapse into the same empty string: the body genuinely
    // contained no text, and this call never finished. They must stay distinguishable — "the
    // publisher served a blank page" is a finding about the source, "the reader gave up" is a finding
    // about the reader, and reporting the second as the first is how an instrument starts lying.
    let bodyText = "";
    let textStatus = "read";
    try {
      bodyText = await page.locator("body").innerText({ timeout: BODY_TEXT_MS });
    } catch {
      textStatus = "extraction-timed-out";
    }
    const normalized = bodyText.replace(/\s+/g, " ").trim();
    if (textStatus === "read" && normalized.length === 0) textStatus = "empty-body";

    // Soft gates: the page WAS served, with something in front of part of it. Reported, never
    // asserted — an abstract behind a paywall is still a real encounter with a real abstract, and
    // whether that is enough to characterise a find is a judgement, not a test.
    const gateHints = ["accept cookies", "subscribe to continue", "sign in to read", "paywall"];
    const lower = normalized.toLowerCase();
    const gates = gateHints.filter((h) => lower.includes(h));

    // Interstitials: the page was NOT served at all. This is a different category from a soft gate
    // and it is asserted, because run 50 found it passing green. See classifyRead() above.
    const classification = classifyRead(title, normalized);

    // The excerpt above is a prefix, and a prefix is a guess about where the interesting sentence
    // is. When SOURCE_FIND is set, the reading also carries bounded windows around a literal —
    // which is how a rules clause tens of thousands of characters into a long page becomes
    // quotable without mirroring the page. See qa/find-windows.mjs for why this rather than a
    // bigger EXCERPT_CHARS.
    const find = findWindows(normalized, SOURCE_FIND);

    // Where the page points, for the links the read was already asking about. Run 62 could reach
    // feedle's document and not its submission surface, because that surface is named in navigation
    // and this reader extracted text and never `href` — so the only way to open it was to guess an
    // address, and the guess returned a 404 that says nothing about the venue. `a.href` is the DOM's
    // resolved absolute URL, not the raw attribute, so a relative target comes back as something a
    // later dispatch can actually be given. Bounded by the needle and never followed: resolving an
    // address and visiting it stay two acts, and the second is another dispatch with its own record.
    const anchors = await page
      .$$eval(
        "a[href]",
        (as, cap) => as.slice(0, cap).map((a) => ({ text: a.innerText || a.textContent || "", href: a.href })),
        MAX_ANCHORS_SCANNED,
      )
      .catch(() => null);
    const links = matchLinks(anchors ?? [], SOURCE_FIND);
    // Same distinction the text extraction draws above: "this page has no links" and "the reader
    // could not read them" are different findings and must not arrive looking alike.
    const linkStatus = anchors === null ? "extraction-failed" : "read";

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
      visible_text_status: textStatus,
      excerpt: normalized.slice(0, EXCERPT_CHARS),
      excerpt_truncated: normalized.length > EXCERPT_CHARS,
      possible_gate_markers: gates,
      read_outcome: classification.outcome,
      interstitial_signals: classification.signals,
      // Reported, never asserted. A rules page that does not contain the word asked for is a real
      // reading about that page — "Lobsters never says 'feed'" is a finding — and failing the run
      // over it would turn a fact about the venue into a fact about the instrument. The assertions
      // below still gate on whether the page was on screen at all, which is the instrument's job.
      find: find.needle,
      find_total_occurrences: find.total,
      find_windows_truncated: find.truncated,
      find_windows: find.windows,
      // Reported, never asserted, for the same reason as `find` above: a rules page that carries no
      // link matching the literal is a reading about that venue, not a failure of this instrument.
      link_status: linkStatus,
      anchors_scanned: anchors?.length ?? 0,
      anchors_scan_capped: (anchors?.length ?? 0) >= MAX_ANCHORS_SCANNED,
      find_links_total: links.total,
      find_links_truncated: links.truncated,
      find_links_skipped_non_http: links.skipped_non_http,
      find_links: links.links,
      read_by: READER_UA,
    };

    // Emit the reading FIRST, before anything optional can fail.
    //
    // Run 47's first dispatch got this order wrong and lost a successful read to it: the JSON was
    // written, then `page.screenshot({fullPage: true})` blew the test timeout on a long lazy-loading
    // article, and the console.log below — the only copy the executor can actually reach, since it
    // reads dispatches through the Actions log and cannot download artifacts — never ran. The
    // reading survived in a file nobody in this loop can open. That is L-20 again: a log nobody can
    // read is not an instrument. Evidence goes to the log before any step that is merely nice to
    // have.
    console.log("--- SOURCE READ EVIDENCE ---");
    console.log(JSON.stringify(evidence, null, 2));
    console.log("--- END SOURCE READ EVIDENCE ---");

    fs.writeFileSync(path.join(ARTIFACTS, "source-read.json"), JSON.stringify(evidence, null, 2));

    // Best-effort, bounded, and never fatal. `fullPage` on a publisher article forces a full
    // scroll-and-stitch of a page built to lazy-load forever, so it is attempted once with a short
    // leash and then abandoned for the viewport shot, which is all the picture has to prove: that
    // this page was really on screen.
    const shot = path.join(ARTIFACTS, "source-read.png");
    let screenshot = "full-page";
    try {
      await page.screenshot({ path: shot, fullPage: true, timeout: 20_000 });
    } catch {
      screenshot = "viewport";
      try {
        await page.screenshot({ path: shot, timeout: 10_000 });
      } catch {
        screenshot = "unavailable";
      }
    }
    console.log(`screenshot: ${screenshot}`);

    // The read succeeded if the page was actually served. A 404 or 403 is a real and useful answer —
    // it says this candidate cannot be encountered — so it is recorded above and then failed here,
    // loudly, rather than passing quietly as though the page had been read.
    expect(status, `page returned HTTP ${status}`).toBeLessThan(400);
    expect(normalized.length, `page yielded no visible text (${textStatus})`).toBeGreaterThan(0);

    // And a 200 is not a read. Everything above this line is recorded either way, so an
    // interstitial remains a useful reading — "this candidate cannot be encountered from here" —
    // it just stops being reported as a successful one.
    expect(
      classification.outcome,
      `HTTP ${status} but the source was not on screen — ${classification.signals.join("; ")}`,
    ).toBe("page");
  });
});
