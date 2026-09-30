// Do the `#fragment` pointers in this repository's own records land on anything?
//
// WHY THIS EXISTS. Run 207 noticed that `ops/LESSONS.md#l-97` — the form used by 203 links
// across `ops/` — may not resolve, and could not confirm it: this session cannot fetch
// github.com's rendered HTML. Run 208 confirmed it from GitHub's own renderer, by reading
// `ops/LESSONS.md` back through the repository-scoped contents API with
// `Accept: application/vnd.github.html`. GitHub emitted 128 anchor ids for that file and
// **none of them was `l-97`**: it slugs the WHOLE heading, so `## L-97 — the publisher …`
// becomes `l-97--the-publisher-…`. A bare `#l-97` matches no element, and the browser stays
// wherever it was — silently, because a fragment that hits nothing is not an error anywhere.
//
// That is the same defect class as L-76, L-97, L-122, L-123 and L-126: an obligation or a
// pointer that only prose maintained, with nothing executing it. So this executes. The remedy
// for the links themselves is the other half — explicit `<a id="l-97"></a>` anchors, which
// keep the 203 links true as written and survive a lesson being retitled, where rewriting
// every link to a 70-character slug would break again on the next edit.
//
// WHAT IT CHECKS. Every relative markdown link carrying a `#fragment` resolves to a file that
// exists, and to an anchor that file actually defines — heading slugs plus explicit HTML
// anchors. WHAT IT DOES NOT CHECK: whether the destination is the RIGHT one. A pointer to the
// wrong lesson is an argument, not a parse, and belongs in a run's report.

import { readFileSync, existsSync } from "node:fs";
import { dirname, join, normalize } from "node:path";

/**
 * GitHub's heading-anchor slug, as observed from GitHub's own renderer rather than from
 * documentation. Calibrated against all 128 ids GitHub emitted for `ops/LESSONS.md`
 * (see doc-anchors.test.mjs, which pins the transformations that actually occur there:
 * em dashes and apostrophes vanish, spaces become hyphens, digits and hyphens survive).
 *
 * The punctuation class is github-slugger's: the Unicode general/supplemental punctuation
 * blocks plus ASCII punctuation, with `-` and `_` deliberately absent so they survive.
 */
export function slugify(text) {
  // No trim, and a literal space rather than \s: github-slugger lowercases, deletes the
  // punctuation class, and maps " " -> "-", in that order and nothing else. The trim this
  // originally had agreed with all 128 observed ids by luck — no heading in the file had edge
  // whitespace — while silently swallowing the trailing-space-to-trailing-hyphen rename that a
  // SPACED `<a id>` causes. Faithful to the observed renderer beats tidy.
  return text
    .toLowerCase()
    .replace(/[ -⁯⸀-⹿\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "")
    .replace(/ /g, "-");
}

/** Successive identical headings get `-1`, `-2`, … exactly as GitHub disambiguates them. */
export function slugsForHeadings(headings) {
  const seen = new Map();
  return headings.map((h) => {
    const base = slugify(h);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n === 0 ? base : `${base}-${n}`;
  });
}

/**
 * Heading texts of a markdown document, in order, skipping fenced code blocks — a `#` inside
 * a fence is a shell comment, not a heading, and counting it would shift every later
 * duplicate suffix by one.
 */
export function headingsOf(markdown) {
  const out = [];
  let fence = null;
  for (const line of markdown.split("\n")) {
    // A closing fence is the marker alone. Check it first, so a longer run inside an open
    // fence cannot be mistaken for a nested opener.
    if (fence !== null) {
      const close = /^\s{0,3}(`{3,}|~{3,})\s*$/.exec(line);
      if (close && close[1][0] === fence.char && close[1].length >= fence.length) fence = null;
      continue;
    }
    // An opener carries an optional info string. CommonMark forbids a backtick anywhere in a
    // BACKTICK fence's info string, which is what keeps an inline ``` `.card` ``` code span
    // sitting in the middle of a paragraph from opening a fence that never closes and
    // swallows every heading after it. ops/LESSONS.md line 3366 is exactly that span.
    const open = /^\s{0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (open) {
      const [, marker, info] = open;
      if (!(marker[0] === "`" && info.includes("`"))) {
        fence = { char: marker[0], length: marker.length };
        continue;
      }
    }
    const m = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
    // GitHub slugs a heading's RENDERED text, so an explicit `<a id="l-01"></a>` sitting in
    // the heading contributes nothing to that heading's own slug. Strip tags so this agrees.
    // A tag is `<`, an optional `/`, then a letter — the same rule run 206 had to give
    // stripAbstractMarkup, and for the same reason: a mathematical `p < 0.001` in a heading is
    // arithmetic the author typed, not markup, and deleting from it would corrupt the slug.
    // NOT trimmed after stripping. GitHub slugs the heading's rendered text as it stands, and
    // an interior space left behind by a stripped tag becomes a trailing HYPHEN: writing
    // `## L-97 — … (run 179) <a id="l-97"></a>` renames that heading's own anchor to
    // `…-run-179-` and kills every full-slug link to it. Run 208 shipped exactly that to a
    // branch, read it back from GitHub's renderer, and found 17 live links broken — a `.trim()`
    // here is what had hidden it. Faithful beats tidy.
    if (m) out.push(m[2].replace(/<\/?[a-zA-Z][^>]*>/g, ""));
  }
  return out;
}

/** Explicit anchors an author wrote as HTML: `<a id="x">` / `<a name="x">`, any element. */
export function explicitAnchorsOf(markdown) {
  const out = new Set();
  for (const m of markdown.matchAll(/<[a-zA-Z][^>]*?\s(?:id|name)\s*=\s*["']([^"']+)["']/g)) {
    out.add(m[1]);
  }
  return out;
}

/** Every anchor a reader can actually reach in this document. */
export function anchorsOf(markdown) {
  const all = new Set(slugsForHeadings(headingsOf(markdown)));
  for (const a of explicitAnchorsOf(markdown)) all.add(a);
  return all;
}

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/**
 * Relative markdown links that carry a fragment, with the line they sit on. Inline form
 * `](target#frag)` only — this repository uses no reference-style links.
 */
export function fragmentLinksOf(markdown) {
  const out = [];
  const lines = markdown.split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    for (const m of lines[i].matchAll(/\]\(\s*([^)\s]*?)#([^)\s]+?)\s*\)/g)) {
      const [, target, fragment] = m;
      if (EXTERNAL.test(target)) continue;
      out.push({ line: i + 1, target, fragment });
    }
  }
  return out;
}

/**
 * Check every fragment link in `files` (repo-relative paths). Returns one finding per link
 * that cannot land, each naming the file and line a reader would be reading.
 */
export function checkFiles(files, { root = "." } = {}) {
  const cache = new Map();
  const anchorsFor = (path) => {
    if (!cache.has(path)) {
      cache.set(path, existsSync(join(root, path)) ? anchorsOf(readFileSync(join(root, path), "utf8")) : null);
    }
    return cache.get(path);
  };

  const findings = [];
  for (const file of files) {
    const markdown = readFileSync(join(root, file), "utf8");
    for (const { line, target, fragment } of fragmentLinksOf(markdown)) {
      const path = target === "" ? file : normalize(join(dirname(file), target));
      // Only markdown has heading anchors to check. A fragment on a source file is GitHub's
      // line anchor (`#L785`), which this cannot compute and which is not this check's
      // business — ops/EXPERIMENTS.md points into src/index.ts that way on purpose.
      if (!/\.md$/i.test(path)) continue;
      const anchors = anchorsFor(path);
      if (anchors === null) {
        findings.push({ file, line, target, fragment, reason: `no such file: ${path}` });
      } else if (!anchors.has(fragment)) {
        findings.push({ file, line, target, fragment, reason: `${path} defines no anchor "${fragment}"` });
      }
    }
  }
  return findings;
}
