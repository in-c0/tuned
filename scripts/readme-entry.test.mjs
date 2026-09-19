#!/usr/bin/env node --test
// Proof that the one indexed property still points at the product.
//
// WHY THIS EXISTS. Run 174 measured what no run had asked: https://justtuned.com has no pages in
// the search index at all. The technical preconditions were all correct and had been for weeks —
// robots.txt, sitemap.xml (95 URLs), canonical, Open Graph, `noindex` scoped to private paths and
// tested both directions. What the site had was no inbound links, and a site with no inbound links
// is not indexed however clean its markup is.
//
// For the one query that returns this project at all — the literal string "justtuned.com" — the
// result is this GitHub repository, not the site. The repository is the single indexed, in-scope
// property this loop controls. And its README linked to the product **nowhere**: the domain
// appeared exactly twice, once inside a fenced `curl` block and once as a backticked redirect URI.
// Neither is a hyperlink. A reader who found the project could not click through to it, and a
// crawler walking the repo was handed no path to the site.
//
// So the properties below are not style rules. Each one is the specific way the entry point failed
// or could silently fail again:
//
//   1. the domain appears outside code spans — a fenced or backticked URL is not a link
//   2. it is written as markdown link form    — bare text is not guaranteed to linkify
//   3. the origin matches src/pages.ts        — a mirrored constant that drifts is L-56
//   4. only public paths are linked           — an indexed page must never hand out a capability URL
//   5. the find-page surface is named         — 87 of the 95 public URLs are find pages
//   6. no local filesystem path               — the README leaked `D:\Projects\...` for seven weeks
//   7. email delivery is not claimed          — `followers` is a table nothing in src/ can send to

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const README_PATH = path.join(REPO_ROOT, "README.md");
const PAGES_PATH = path.join(REPO_ROOT, "src", "pages.ts");

/** Public surfaces the shopfront may link. Anything else on this origin is gated, capability-scoped
 *  or an API, and must not be advertised from a page a crawler reads. `/sportstech` is a real public
 *  handle; a handle that stops being public is a reason to edit this list, not to widen it. */
const LINKABLE_PATHS = new Set([
  "",
  "/",
  "/terms",
  "/privacy",
  "/sportstech",
  "/sportstech/rss.xml",
]);

function readReadme() {
  return fs.readFileSync(README_PATH, "utf8");
}

/** The README with every code span removed — fenced blocks AND inline backticks. This is the only
 *  view that matters for the question "does this document link to the product", because a URL in
 *  either form renders as literal text: not clickable, not a link signal.
 *
 *  Inline spans are stripped deliberately and the omission was a real defect in this file. The
 *  first version of this helper removed fenced blocks only, and the first test below then PASSED
 *  when run against the pre-run-174 README — the exact state it was written to catch — because
 *  that README's one outside-a-fence occurrence of the domain was `…/connect/spotify/callback`,
 *  an inline span. A check that is green on the defect it names is L-85 and L-89's shape, and the
 *  mutation pass did not surface it either: mutation 1 reded the markdown-form test instead, which
 *  reads as coverage. Only running the gate against the original document showed it. */
function outsideCodeSpans(md) {
  return md.replace(/^```[\s\S]*?^```/gm, "\n").replace(/`[^`\n]*`/g, " ");
}

/** The origin the Worker serves itself as, read from source rather than restated here. */
function siteOriginFromSource() {
  const src = fs.readFileSync(PAGES_PATH, "utf8");
  const m = src.match(/export const SITE_ORIGIN\s*=\s*"([^"]+)"/);
  assert.ok(m, "src/pages.ts no longer declares SITE_ORIGIN as a string literal; this test reads it");
  return m[1];
}

describe("README is the entry point to the product (scripts/readme-entry.test.mjs)", () => {
  it("links to the live site outside any code span", () => {
    const origin = siteOriginFromSource();
    const prose = outsideCodeSpans(readReadme());
    assert.ok(
      prose.includes(origin),
      `README.md does not reference ${origin} anywhere outside a code span. A URL inside a fence ` +
        "or inline backticks is literal text: it is not clickable and it is not a link signal. " +
        "This is the exact state run 174 found, in which the one indexed property this loop " +
        "controls was a dead end to the product it describes.",
    );
  });

  it("presents that link as markdown, not as bare text a renderer may not linkify", () => {
    const origin = siteOriginFromSource();
    const prose = outsideCodeSpans(readReadme());
    const autolink = prose.includes(`<${origin}>`);
    const inline = new RegExp(`\\]\\(${origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(prose);
    assert.ok(
      autolink || inline,
      `${origin} appears in README.md but never as a markdown link — neither <${origin}> nor ` +
        "[text](url). Bare text is not guaranteed to render as a hyperlink.",
    );
  });

  it("uses the origin src/pages.ts actually serves, so the two cannot drift", () => {
    const origin = siteOriginFromSource();
    const readme = readReadme();
    const others = [...readme.matchAll(/https?:\/\/(?:www\.)?justtuned\.com/g)].map((m) => m[0]);
    for (const seen of others) {
      assert.equal(
        seen,
        origin,
        `README.md links ${seen} but src/pages.ts serves ${origin}. A second origin in the ` +
          "shopfront sends readers and crawlers to a host the canonical tag disowns.",
      );
    }
    assert.ok(others.length > 0, "README.md links the product on no origin at all");
  });

  it("advertises only public paths — never a gated or capability URL", () => {
    const origin = siteOriginFromSource();
    const readme = readReadme();
    const escaped = origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const paths = [...readme.matchAll(new RegExp(`${escaped}([^\\s)>"'\`]*)`, "g"))].map((m) => m[1]);
    for (const p of paths) {
      // Placeholders inside the operator runbook are addressed to the owner at a terminal, not to a
      // reader following a link, and they are not real URLs. Everything else must be public.
      if (p.includes("...") || p.includes("<") || p.includes("$")) continue;
      if (p.startsWith("/api/") || p.startsWith("/connect/")) continue; // runbook endpoints, POSTed with a key
      assert.ok(
        LINKABLE_PATHS.has(p),
        `README.md points a reader at ${origin}${p}, which is not in the public-surface allowlist ` +
          "in this test. An indexed page must never hand out a gated or capability URL.",
      );
    }
  });

  it("names the find-page surface, which is 87 of the 95 public URLs", () => {
    const readme = readReadme();
    assert.ok(
      readme.includes("/:handle/:id"),
      "README.md does not document `/:handle/:id`. A published find is the unit this site is " +
        "indexed and shared as, and the surface list omitted it entirely until run 174.",
    );
  });

  it("leaks no local filesystem path", () => {
    const readme = readReadme();
    const leak = readme.match(/[A-Za-z]:\\[^\s`]+/);
    assert.equal(
      leak,
      null,
      `README.md contains the local path ${leak?.[0]}. It is meaningless to every reader but one ` +
        "and it advertises a directory layout on the owner's machine.",
    );
  });

  it("does not claim the email Follow delivers anything", () => {
    const prose = outsideCodeSpans(readReadme()).toLowerCase();
    if (!prose.includes("follow")) return;
    assert.ok(
      /sending is not built|sending tbd|rss is what works|only subscription that\s*\n?\s*delivers/.test(prose),
      "README.md mentions Follow without stating that email sending is not built. `followers` is a " +
        "table no code in src/ can send to, and the site's own pages say so — the shopfront must not " +
        "imply otherwise.",
    );
  });
});
