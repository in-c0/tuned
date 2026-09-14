// Decide what was actually on screen: the source page, or something standing in front of it.
//
// Why this is its own file. It is the third piece of qa/source-read.spec.mjs that is pure logic,
// and so the third piece that can be wrong silently — but unlike find-windows.mjs and nav-links.mjs
// it is *asserted*, not merely reported. It is the thing that decides whether a read is green. A
// bug here does not misreport a window or a href; it tells this loop that a bot check was an
// article (run 50) or that an answer was a bot check (runs 157 and 160). Both errors have now
// happened, in opposite directions, and neither was catchable without a browser until this module
// existed.
//
// What changed at run 161, and why the floor was not lowered to do it.
//
// MIN_PAGE_CHARS is a terseness floor: below 1000 visible characters, the read was called an
// interstitial. Its stated job is the bot check this loop has *not* seen yet — one whose wording
// matches neither regex below still cannot fake a thousand characters of article. That reasoning is
// sound and the floor stays exactly where it was.
//
// What it cannot do is certify an *absence*. The duplicate check that guards every venue submission
// asks GitHub "is there already an issue mentioning justtuned here", and the answer this loop wants
// is `Open 0 (0) · Closed 0 (0)` — a page that renders 735 characters, because *nothing is here*
// renders short by construction. feedle.world's submission surface was the same shape at 745. So a
// terseness gate is least able to certify exactly the answer an emptiness check exists to return:
// a duplicate check that finds something passes, and one that finds nothing fails. Two recorded
// false alarms, both structural rather than unlucky (L-78).
//
// The fix is an additive discriminator, never a lower floor. A floor tuned down until nothing trips
// it reintroduces run 50's defect, in which a reCAPTCHA page reported `1 passed` (L-28). So the
// floor is unchanged and a *second*, independent way to be a page is added beside it: site
// structure. A bot-check interstitial is a standalone document served instead of the host's page —
// it carries the challenge and essentially nothing else, because it is not the host's page and has
// no navigation to present. A zero-results search page carries the host's entire chrome: nav,
// filters, footer. That difference is visible in the DOM at any text length.
//
// Three properties keep the discriminator from becoming a hole:
//
//   1. **It overrules the length signal and nothing else.** A title or body matching a bot-check
//      pattern stays fatal at any link count. Rich chrome cannot buy past a named challenge.
//   2. **It fails closed on the unknown.** If the anchors could not be extracted at all, there is
//      no rescue — an absent reading is never read as a favourable one.
//   3. **Self-referential links do not count.** A challenge page's one link is usually "retry",
//      pointing at the very URL that was requested. Distinct same-origin addresses *other than
//      this one* are what a real page has and a challenge does not.
//
// Deliberately NOT the formulation L-78 proposed. L-78 wrote the discriminator as "a fetch yielding
// the anchors the query asked about is a page at any length" — i.e. gate on `find_links`. That ties
// the rescue to the question asked, which is attractive, and it has two defects this version does
// not: it is unavailable whenever `find` is unset, and it is satisfiable by exactly the link a
// challenge page does carry, since a retry link's href contains the requested URL and therefore
// contains the literal that was searched for in it. Counting distinct same-origin addresses other
// than this one inverts both.

/**
 * A floor on how much text a page must carry before this reader will call it a page, on the text
 * signal alone.
 *
 * Fail-closed by design and the number is a judgement, stated rather than buried: the remit
 * @sportstech publishes under requires "a concrete measured result or a validated implementation",
 * and no page carrying one is 1000 characters long. A legitimately terse page that trips this and
 * carries no site structure either still fails loudly with its text in the log, so a human can
 * overrule it on the evidence; the opposite error passes silently and cannot be caught at all.
 */
export const MIN_PAGE_CHARS = 1000;

/**
 * How many distinct same-origin addresses, other than this page's own, count as site structure.
 *
 * Also a judgement, and stated on the evidence behind it: the GitHub zero-results page this loop
 * actually reads for its duplicate check scanned 103 anchors, and a site's header-plus-footer
 * chrome alone is routinely 15–30 distinct destinations. A Cloudflare or Akamai challenge document
 * carries nought to two, and they are the challenge provider's or a retry at this same URL. The gap
 * between those two populations is an order of magnitude, so the threshold does not need to be
 * finely tuned — it needs to sit inside the gap and be reported when it bites.
 */
export const MIN_STRUCTURAL_LINKS = 20;

/**
 * Signatures of a bot-check interstitial — a page that is not the source and never was.
 *
 * Asserted rather than merely reported. Run 47 wrote `possible_gate_markers` as "reported, never
 * asserted", naming the exact defect and leaving the instrument unable to act on it. Run 50 walked
 * into it: pmc.ncbi.nlm.nih.gov returned HTTP 200, title "Checking your browser - reCAPTCHA", 131
 * characters of body, no gate markers — and the spec reported `1 passed`. A green tick that means
 * "a bot check was on screen" is the instrument lying in the direction that costs most.
 *
 * Signatures observed live on 2026-08-17, one per host, recorded in ops/EXP-008-CANDIDATES.md.
 */
export const INTERSTITIAL_TITLE =
  /just a moment|checking your browser|attention required|security check|are you a robot|recaptcha|access denied/i;
export const INTERSTITIAL_BODY =
  /checking your browser before accessing|performing security verification|verifies you are not a bot|verify you are human|enable javascript and cookies to continue|ray id:/i;

/** Same-origin, navigable, and not this page itself, compared with the fragment dropped. */
function navigableSameOrigin(href, origin, selfKey) {
  let u;
  try {
    u = new URL(href);
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  if (u.origin !== origin) return null;
  u.hash = "";
  const key = u.toString();
  return key === selfKey ? null : key;
}

/**
 * How much site structure was on screen, measured from the anchors the reader already extracted.
 *
 * `status` is the load-bearing field and is why this returns an object rather than a number.
 * "this page has no links" and "the reader could not read them" are different findings — the same
 * distinction the spec already draws for body text — and only the first is a reading about the
 * page. An unreadable anchor list yields `unreadable`, which never rescues anything.
 *
 * @param {Array<{text?: string, href?: string}>|null|undefined} anchors  Anchors as read from the
 *   DOM, hrefs already resolved to absolute URLs by the browser. `null` means extraction failed.
 * @param {string} finalUrl  The URL actually on screen, after any redirect.
 * @returns {{status: "read"|"unreadable", count: number, origin: string|null}}
 */
export function structuralLinks(anchors, finalUrl) {
  if (!Array.isArray(anchors)) return { status: "unreadable", count: 0, origin: null };

  let self;
  try {
    self = new URL(finalUrl);
  } catch {
    // Without an origin there is no same-origin test to apply, so there is no reading to make.
    // Fail closed rather than falling back to counting every link on the page.
    return { status: "unreadable", count: 0, origin: null };
  }
  const origin = self.origin;
  self.hash = "";
  const selfKey = self.toString();

  const seen = new Set();
  for (const anchor of anchors) {
    const href = typeof anchor?.href === "string" ? anchor.href.trim() : "";
    if (!href) continue;
    const key = navigableSameOrigin(href, origin, selfKey);
    if (key) seen.add(key);
  }

  return { status: "read", count: seen.size, origin };
}

/**
 * Classify what was actually on screen.
 *
 * @param {string|null} title  The document title, or null.
 * @param {string} normalized  Visible body text, whitespace-collapsed.
 * @param {{status: "read"|"unreadable", count: number, origin: string|null}} structure
 *   From structuralLinks(). Required: an omitted structure is treated as unreadable, which is the
 *   fail-closed direction and preserves the pre-run-161 behaviour exactly.
 * @returns {{outcome: "page"|"interstitial", signals: string[],
 *            length_floor_overruled: string|null,
 *            structural_links: number, structural_links_status: "read"|"unreadable"}}
 */
export function classifyRead(title, normalized, structure) {
  const struct =
    structure && (structure.status === "read" || structure.status === "unreadable")
      ? structure
      : { status: "unreadable", count: 0, origin: null };

  const signals = [];
  if (title && INTERSTITIAL_TITLE.test(title)) {
    signals.push(`title matches bot-check pattern: ${JSON.stringify(title)}`);
  }
  const bodyHit = normalized.match(INTERSTITIAL_BODY);
  if (bodyHit) signals.push(`body matches bot-check pattern: ${JSON.stringify(bodyHit[0])}`);

  // Computed independently of the signals above and always reported, so the record says what the
  // length signal did even on a read that a named challenge pattern condemned anyway. It is not a
  // veto: `outcome` is decided by `signals`, and a bot-check pattern is fatal at any link count.
  let overruled = null;
  const structurally = struct.status === "read" && struct.count >= MIN_STRUCTURAL_LINKS;
  if (normalized.length < MIN_PAGE_CHARS) {
    if (structurally) {
      overruled =
        `${normalized.length} visible characters is below the ${MIN_PAGE_CHARS} floor, but ` +
        `${struct.count} distinct same-origin links other than this page were on screen ` +
        `(structural floor ${MIN_STRUCTURAL_LINKS}) — short because the answer is short, not ` +
        `because the page was withheld`;
    } else {
      const why =
        struct.status === "read"
          ? `and only ${struct.count} distinct same-origin links, below the ${MIN_STRUCTURAL_LINKS} structural floor`
          : "and the anchors could not be read, so no structural reading is available";
      signals.push(`only ${normalized.length} visible characters, below the ${MIN_PAGE_CHARS} floor, ${why}`);
    }
  }

  return {
    outcome: signals.length ? "interstitial" : "page",
    signals,
    length_floor_overruled: overruled,
    structural_links: struct.count,
    structural_links_status: struct.status,
  };
}
