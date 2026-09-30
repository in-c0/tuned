// The slug rules here are not read from documentation. They are pinned to ids GitHub itself
// emitted for this repository's own files, fetched on 2026-09-30 (run 208) through the
// repository-scoped contents API with `Accept: application/vnd.github.html`:
//
//   curl -H "Accept: application/vnd.github.html" \
//     .../repos/in-c0/tuned/contents/ops/LESSONS.md?ref=master | grep -o 'id="user-content-[^"]*"'
//
// That read returned 128 ids for ops/LESSONS.md, and `slugsForHeadings(headingsOf(…))`
// reproduced all 128 exactly. The pairs below are the subset carrying the transformations that
// actually decide this file's behaviour, so a later edit to slugify has to keep agreeing with
// GitHub rather than merely with itself.

import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  slugify,
  slugsForHeadings,
  headingsOf,
  explicitAnchorsOf,
  anchorsOf,
  fragmentLinksOf,
  checkFiles,
} from "./lib/doc-anchors.mjs";

/** heading text → the id GitHub actually rendered for it. */
const GITHUB_OBSERVED = [
  ["Tuned — LESSONS", "tuned--lessons"],
  // em dash vanishes and leaves the two hyphens every anchor in this repo has
  ["L-01 — The build gate was broken on a fresh clone, and only a fresh clone could see it",
   "l-01--the-build-gate-was-broken-on-a-fresh-clone-and-only-a-fresh-clone-could-see-it"],
  // apostrophe deleted rather than replaced: GitHub's -> githubs
  ["L-04 — GitHub's response to an unparseable workflow is silence",
   "l-04--githubs-response-to-an-unparseable-workflow-is-silence"],
  // comma deleted; hyphen inside a word survives
  ["L-02 — An autonomous loop that ships by pushing, and wakes on pushes, has no stopping point",
   "l-02--an-autonomous-loop-that-ships-by-pushing-and-wakes-on-pushes-has-no-stopping-point"],
  // backticks removed, `?` removed, parentheses removed, and `_` SURVIVES
  ["EXP-011 — is `landing_view` a browser at all? (2026-09-05, run 138)",
   "exp-011--is-landing_view-a-browser-at-all-2026-09-05-run-138"],
  // a possessive on a number: 2026-09-26's -> 2026-09-26s
  ["EXP-014 — were 2026-09-26's 517 off-site find-page views a crawler, or the first search arrivals? (2026-09-27, run 197)",
   "exp-014--were-2026-09-26s-517-off-site-find-page-views-a-crawler-or-the-first-search-arrivals-2026-09-27-run-197"],
];

test("slugify reproduces the ids GitHub rendered for this repository's headings", () => {
  for (const [heading, id] of GITHUB_OBSERVED) {
    assert.equal(slugify(heading), id, `heading: ${heading}`);
  }
});

test("a bare #l-97 is NOT a heading slug — the defect run 208 confirmed", () => {
  const heading = "L-97 — a gate with nobody standing at it is an outage, not a safeguard (2026-09-21, run 179)";
  assert.notEqual(slugify(heading), "l-97");
  assert.equal(
    slugify(heading),
    "l-97--a-gate-with-nobody-standing-at-it-is-an-outage-not-a-safeguard-2026-09-21-run-179",
  );
});

test("identical headings get GitHub's -1, -2 suffixes", () => {
  assert.deepEqual(slugsForHeadings(["Notes", "Notes", "Notes"]), ["notes", "notes-1", "notes-2"]);
});

test("an inline ``` code span mid-paragraph does not open a fence", () => {
  // ops/LESSONS.md:3366 is exactly this shape. Treating it as a fence opener swallowed every
  // heading after it, and the first attempt at this checker silently saw 83 of 128 headings.
  const md = [
    "## First",
    "",
    "  ``` `.card .meta` ``` into a property access on a string. Every unit test still passed —",
    "",
    "## Second",
  ].join("\n");
  assert.deepEqual(headingsOf(md), ["First", "Second"]);
});

test("a real fenced block hides its # lines", () => {
  const md = ["## Real", "", "```sh", "# not a heading", "```", "", "## Also real"].join("\n");
  assert.deepEqual(headingsOf(md), ["Real", "Also real"]);
});

test("an explicit anchor with NO space before it leaves the heading's own slug alone", () => {
  const md = '## L-01 — The build gate was broken<a id="l-01"></a>';
  assert.deepEqual(headingsOf(md), ["L-01 — The build gate was broken"]);
  const anchors = anchorsOf(md);
  assert.ok(anchors.has("l-01"), "the explicit anchor is reachable");
  assert.ok(anchors.has("l-01--the-build-gate-was-broken"), "and the heading slug is untouched");
});

test("a SPACE before the anchor renames the heading — observed from GitHub, not reasoned", () => {
  // Run 208 pushed the spaced form to a branch and read ops/LESSONS.md back through GitHub's
  // renderer. GitHub emitted, for `## L-97 — … (2026-09-21, run 179) <a id="l-97"></a>`:
  //
  //   <a id="user-content-l-97--a-gate-…-2026-09-21-run-179-" class="anchor" …>
  //                                                       ^ trailing hyphen
  //
  // The anchor element renders no text but the space before it does, and GitHub does not trim
  // before turning spaces into hyphens. 17 live links used those full slugs, in NORTH_STAR.md,
  // STATUS.md, METRICS.md, DECISIONS.md and EXPERIMENTS.md, and all 17 would have died
  // silently. This test is why the repository uses the unspaced form, and it must keep failing
  // for the spaced one.
  const spaced = '## L-97 — a gate with nobody standing at it is an outage, not a safeguard (2026-09-21, run 179) <a id="l-97"></a>';
  const [text] = headingsOf(spaced);
  assert.equal(text.at(-1), " ", "the stripped tag leaves the space behind, as GitHub sees it");
  assert.equal(
    slugify(text),
    "l-97--a-gate-with-nobody-standing-at-it-is-an-outage-not-a-safeguard-2026-09-21-run-179-",
  );
  const unspaced = spaced.replace(" <a id", "<a id");
  assert.equal(
    slugify(headingsOf(unspaced)[0]),
    "l-97--a-gate-with-nobody-standing-at-it-is-an-outage-not-a-safeguard-2026-09-21-run-179",
    "the unspaced form is byte-identical to the slug GitHub served before any anchors existed",
  );
});

test("no heading in this repository carries a space before its explicit anchor", () => {
  const root = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
  const offenders = [];
  for (const file of trackedMarkdown(root)) {
    const md = readFileSync(join(root, file), "utf8");
    md.split("\n").forEach((line, i) => {
      if (/^#{1,6} .*\s<a id=/.test(line)) offenders.push(`${file}:${i + 1}`);
    });
  }
  assert.deepEqual(offenders, []);
});

test("a mathematical < in a heading is arithmetic, not a tag", () => {
  // The same rule run 206 had to give stripAbstractMarkup. Deleting from "p < 0.001" would
  // corrupt the slug the way it corrupted a published quotation.
  assert.deepEqual(headingsOf("## the bar was p < 0.001 and it held"), ["the bar was p < 0.001 and it held"]);
});

test("explicit anchors are read from id and name, on any element", () => {
  const found = explicitAnchorsOf('<a id="one"></a> <a name="two"></a> <span id="three">x</span>');
  assert.deepEqual([...found].sort(), ["one", "three", "two"]);
});

test("fragment links are found, and absolute ones are left to their own hosts", () => {
  const md = [
    "see [a](LESSONS.md#l-07) and [b](#l-08)",
    "and [c](https://github.com/in-c0/tuned/blob/master/ops/LESSONS.md#l-09)",
    "and [d](DECISIONS.md) with no fragment",
  ].join("\n");
  assert.deepEqual(
    fragmentLinksOf(md).map((l) => `${l.target}#${l.fragment}`),
    ["LESSONS.md#l-07", "#l-08"],
  );
});

const withRepo = (files) => {
  const dir = mkdtempSync(join(tmpdir(), "doc-anchors-"));
  for (const [name, body] of Object.entries(files)) writeFileSync(join(dir, name), body);
  return dir;
};

test("the world as it stood before run 208: a bare #l-97 is reported dead", () => {
  const dir = withRepo({
    "LESSONS.md": "## L-97 — a gate with nobody standing at it is an outage (2026-09-21, run 179)\n",
    "STATUS.md": "per [L-97](LESSONS.md#l-97) the gate is attended.\n",
  });
  const findings = checkFiles(["LESSONS.md", "STATUS.md"], { root: dir });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].file, "STATUS.md");
  assert.equal(findings[0].fragment, "l-97");
  assert.match(findings[0].reason, /defines no anchor "l-97"/);
});

test("adding the explicit anchor is what makes that link land", () => {
  const dir = withRepo({
    "LESSONS.md": '## L-97 — a gate with nobody standing at it is an outage (2026-09-21, run 179) <a id="l-97"></a>\n',
    "STATUS.md": "per [L-97](LESSONS.md#l-97) the gate is attended.\n",
  });
  assert.deepEqual(checkFiles(["LESSONS.md", "STATUS.md"], { root: dir }), []);
});

test("a truncated full slug is dead too — the second defect run 208 found", () => {
  // 9 links in ops/LESSONS.md used the full-slug form, then the heading gained its
  // "(2026-08-15, run 44)" tail and the links kept pointing at the old slug. This is why the
  // fix is a stable anchor and not a rewrite to slugs: a slug is a function of a title.
  const dir = withRepo({
    "LESSONS.md":
      "## L-22 — a document describing what code does is a claim, and it decays silently (2026-08-15, run 44)\n" +
      "see [L-22](#l-22--a-document-describing-what-code-does-is-a-claim-and-it-decays-silently)\n",
  });
  const findings = checkFiles(["LESSONS.md"], { root: dir });
  assert.equal(findings.length, 1);
  assert.match(findings[0].reason, /defines no anchor/);
});

test("a missing target file is reported, and a source-line fragment is not judged", () => {
  const dir = withRepo({
    "A.md": "[gone](NOPE.md#x) and [line](../src/index.ts#L785)\n",
  });
  const findings = checkFiles(["A.md"], { root: dir });
  assert.equal(findings.length, 1, "only the missing markdown file is a finding");
  assert.match(findings[0].reason, /no such file/);
});

test("every #fragment in this repository's own markdown resolves", () => {
  // The integration case, and the one that fails if a later run writes a pointer to nowhere.
  const root = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
  const findings = checkFiles(trackedMarkdown(root), { root });
  assert.deepEqual(
    findings.map((f) => `${f.file}:${f.line} -> ${f.target}#${f.fragment}`),
    [],
  );
});

function trackedMarkdown(root) {
  return execFileSync("git", ["-C", root, "ls-files", "*.md", "**/*.md"], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
}
