// The second piece of qa/source-read.spec.mjs that is pure logic, and so the second piece that can
// be wrong silently. The consequence of a bug here is specific and expensive: this function's output
// is a URL a later dispatch gets pointed at. A misreported href sends the next read at the wrong
// address, and the 404 that comes back looks exactly like "the venue has no such surface" — which is
// precisely the mistake run 62 made by guessing `/submit`, arriving one layer deeper and wearing the
// authority of an instrument. Hence a fixture with hand-written anchors and no browser.

import { describe, expect, it } from "vitest";

import { LINK_MAX_MATCHES, matchLinks } from "../qa/nav-links.mjs";

// The shape a real site chrome has, written out rather than scraped: a repeated header/footer nav,
// a script-driven control, an off-site link, and a label that does not contain the word its path
// does. Every case below is one this reader has already met or would meet on the next venue.
const CHROME = [
  { text: "feedle", href: "https://feedle.world/" },
  { text: "Submit your blog or podcast", href: "https://feedle.world/submit-feed" },
  { text: "FAQ", href: "https://feedle.world/faq" },
  { text: "Top Stories", href: "https://feedle.world/top" },
  { text: "Add yours", href: "https://feedle.world/submissions/new" },
  { text: "Open submit menu", href: "javascript:void(0)" },
  { text: "Submit by email", href: "mailto:hello@feedle.world" },
  // Footer repeat of the header link — same address, same label.
  { text: "Submit your blog or podcast", href: "https://feedle.world/submit-feed" },
];

describe("matchLinks", () => {
  it("treats an empty needle as 'nobody asked', not as 'no such link'", () => {
    const r = matchLinks(CHROME, "");
    expect(r.needle).toBeNull();
    expect(r.total).toBe(0);
    expect(r.links).toEqual([]);
    expect(r.truncated).toBe(false);
    expect(r.skipped_non_http).toBe(0);
  });

  it("reports zero matches without inventing a target", () => {
    const r = matchLinks(CHROME, "guidelines");
    expect(r.needle).toBe("guidelines");
    expect(r.total).toBe(0);
    expect(r.links).toEqual([]);
    expect(r.truncated).toBe(false);
  });

  it("resolves the navigation target a label names, which is the whole point", () => {
    const r = matchLinks(CHROME, "submit");
    const hrefs = r.links.map((l) => l.href);
    expect(hrefs).toContain("https://feedle.world/submit-feed");
  });

  it("matches on the href when the label does not carry the word", () => {
    const r = matchLinks(CHROME, "submissions");
    expect(r.links).toEqual([
      { text: "Add yours", href: "https://feedle.world/submissions/new", matched: "href" },
    ]);
  });

  it("records how each link matched, so a reader can tell a label from a path", () => {
    const r = matchLinks(CHROME, "submit");
    const byHref = Object.fromEntries(r.links.map((l) => [l.href, l.matched]));
    // Label and path both say it.
    expect(byHref["https://feedle.world/submit-feed"]).toBe("both");
  });

  it("counts a script-driven control as skipped rather than reporting it as an address", () => {
    const r = matchLinks(CHROME, "submit");
    expect(r.links.map((l) => l.href)).not.toContain("javascript:void(0)");
    // `javascript:` and `mailto:` both match "submit" here and neither is a page to dispatch at.
    expect(r.skipped_non_http).toBe(2);
    // A skip is not a match: the four anchors carrying "submit" become a total of two, counting
    // only the navigable pair. Folding the duplicate is the separate concern tested below.
    expect(r.total).toBe(2);
  });

  it("folds a header link repeated in the footer instead of reporting it twice", () => {
    const r = matchLinks(CHROME, "submit-feed");
    expect(r.links).toHaveLength(1);
    // The page really does carry two such anchors, and the count says so.
    expect(r.total).toBe(2);
    expect(r.truncated).toBe(true);
  });

  it("keeps two labels that lead to the same address, since which label leads where is the finding", () => {
    const r = matchLinks(
      [
        { text: "Submit", href: "https://example.com/s" },
        { text: "Submit your feed", href: "https://example.com/s" },
      ],
      "submit",
    );
    expect(r.links).toHaveLength(2);
  });

  it("stops listing at the cap while still counting what it did not show", () => {
    const many = Array.from({ length: LINK_MAX_MATCHES + 3 }, (_, i) => ({
      text: `Submit ${i}`,
      href: `https://example.com/submit/${i}`,
    }));
    const r = matchLinks(many, "submit");
    expect(r.total).toBe(LINK_MAX_MATCHES + 3);
    expect(r.links).toHaveLength(LINK_MAX_MATCHES);
    expect(r.truncated).toBe(true);
  });

  it("truncates a long anchor label rather than mirroring a paragraph out of the page", () => {
    const r = matchLinks(
      [{ text: `submit ${"x".repeat(400)}`, href: "https://example.com/a" }],
      "submit",
      { textChars: 20 },
    );
    expect(r.links[0].text).toHaveLength(21); // 20 characters plus the ellipsis
    expect(r.links[0].text.endsWith("…")).toBe(true);
  });

  it("normalizes whitespace in a label split across lines by the markup", () => {
    const r = matchLinks([{ text: "\n  Submit your\n  blog  ", href: "https://example.com/a" }], "submit");
    expect(r.links[0].text).toBe("Submit your blog");
  });

  it("survives anchors with no href, no text, or no anchors at all", () => {
    expect(matchLinks([], "submit").total).toBe(0);
    expect(matchLinks(undefined as never, "submit").total).toBe(0);
    const r = matchLinks(
      [{ href: "https://example.com/submit" }, { text: "Submit" }, { text: "", href: "  " }],
      "submit",
    );
    expect(r.links).toEqual([
      { text: "", href: "https://example.com/submit", matched: "href" },
    ]);
  });

  it("matches case-insensitively on both sides", () => {
    const r = matchLinks([{ text: "SUBMIT", href: "https://example.com/A" }], "submit");
    expect(r.links).toHaveLength(1);
    const byPath = matchLinks([{ text: "here", href: "https://example.com/SubMit" }], "submit");
    expect(byPath.links[0].matched).toBe("href");
  });
});
