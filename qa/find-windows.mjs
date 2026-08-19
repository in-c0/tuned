// Locate a literal string inside a page's visible text and return bounded windows around it.
//
// Why this exists. Run 55 read https://github.com/plenaryapp/awesome-rss-feeds cleanly — HTTP 200,
// `read_outcome: "page"`, 69,678 visible characters — and still could not answer A1 for it, because
// source-read.spec.mjs reports the first EXCERPT_CHARS (4,000) characters of a page and nothing
// else. On that page the first 4,000 characters are the directory tables; the contribution rules,
// which are the entire point of the read, sit tens of thousands of characters further down. The
// compact alternative — /issues/new/choose — served HTTP 200 with 279 visible characters to a
// logged-out reader, so there was no shorter page to read instead.
//
// That is a specific and recurring shape of failure: **the reader can reach the document and cannot
// reach the clause.** It is not a bot check, not a paywall and not an egress problem, so none of the
// existing instruments catch it, and it will recur on every venue whose rules live at the bottom of
// a long page — which is most of them.
//
// The fix that was NOT taken: raising EXCERPT_CHARS. A bigger excerpt mirrors more of other people's
// pages into a public CI log for the same one clause, and it still fails whenever the clause happens
// to sit past whatever the new number is. Locating the clause is the actual requirement; a larger
// prefix is a guess at where it might be.
//
// Bounded by construction, because a reader that can quote arbitrary spans of someone else's page
// on request is a scraper: the needle is a LITERAL, never a pattern; matches are reported as at most
// FIND_MAX_MATCHES windows of at most (before + needle + after) characters each; and every
// occurrence is counted even when it is not shown, so a truncated reading says so rather than
// looking complete.

/** Characters of context kept before a match — enough to see the heading a clause sits under. */
export const FIND_WINDOW_BEFORE = 200;

/** Characters kept after a match. Rules run long; a clause cut in half cannot be quoted honestly. */
export const FIND_WINDOW_AFTER = 700;

/** How many windows are reported. Beyond this the count still rises and the text stops. */
export const FIND_MAX_MATCHES = 6;

/**
 * @param {string} text      Visible page text, already whitespace-normalized.
 * @param {string} needle    Literal to find, matched case-insensitively. Empty means "not asked".
 * @param {{before?: number, after?: number, max?: number}} [opts]
 * @returns {{needle: string|null, total: number, truncated: boolean,
 *            windows: Array<{index: number, text: string}>}}
 */
export function findWindows(text, needle, opts = {}) {
  const before = opts.before ?? FIND_WINDOW_BEFORE;
  const after = opts.after ?? FIND_WINDOW_AFTER;
  const max = opts.max ?? FIND_MAX_MATCHES;

  // "No needle" and "needle that matches nothing" are different readings and must stay different:
  // the first means nobody asked, the second means the page does not say the word. Reporting either
  // as the other would be the instrument answering a question it was not given.
  if (!needle) return { needle: null, total: 0, truncated: false, windows: [] };

  const hay = text.toLowerCase();
  const nee = needle.toLowerCase();

  const windows = [];
  let total = 0;
  let cursor = 0;
  // End (exclusive, in `text` coordinates) of the last window emitted. An occurrence starting before
  // this is already on screen inside that window, so emitting it again would pad the log with the
  // same sentence twice and make a page look like it repeats a rule it states once.
  let coveredTo = -1;

  for (;;) {
    const at = hay.indexOf(nee, cursor);
    if (at === -1) break;
    total += 1;
    cursor = at + nee.length;

    if (at < coveredTo) continue;
    if (windows.length >= max) continue; // keep counting, stop quoting

    const start = Math.max(0, at - before);
    const end = Math.min(text.length, at + nee.length + after);
    windows.push({ index: at, text: text.slice(start, end) });
    coveredTo = end;
  }

  // `total` counts every occurrence, including ones folded into a window already emitted and ones
  // past the cap. `truncated` is therefore "there is more of this page you are not seeing", which is
  // the only honest thing to put in front of a reader who is about to quote from it.
  return { needle, total, truncated: total > windows.length, windows };
}
