// The third piece of qa/source-read.spec.mjs that is pure logic, and the only one that is
// *asserted*. find-windows.mjs and nav-links.mjs report; this decides whether a read is green.
//
// Both directions of failure have already happened to this loop, which is why the fixtures below
// are transcriptions rather than inventions:
//
//   * Run 50 — pmc.ncbi.nlm.nih.gov served HTTP 200, title "Checking your browser - reCAPTCHA",
//     131 characters of body, and this spec reported `1 passed`. A bot check read as an article.
//   * Runs 157 and 160 — GitHub's zero-results issue search rendered 735 characters and was called
//     an interstitial, twice, while resolving both state filters by href to `Open 0 (0)` and
//     `Closed 0 (0)`. An answer read as a bot check. feedle.world at 745 characters was the same
//     shape (L-78).
//
// The second is structural rather than unlucky: *nothing is here* renders short by construction, so
// a terseness gate is least able to certify exactly the answer an emptiness check exists to return.
// The tests that matter most below are therefore the ones pinning that the fix is *additive* — the
// floor is unchanged, a named challenge pattern is still fatal at any link count, and an unreadable
// anchor list rescues nothing.

import { describe, expect, it } from "vitest";

import {
  MIN_PAGE_CHARS,
  MIN_STRUCTURAL_LINKS,
  classifyRead,
  structuralLinks,
} from "../qa/classify-read.mjs";

/** Visible text of exactly `n` characters, carrying no bot-check wording. */
function text(n: number): string {
  return "a".repeat(n);
}

const LONG = text(MIN_PAGE_CHARS + 1);
const SHORT = text(735); // the length GitHub's zero-results issue search actually rendered

/** `n` distinct same-origin destinations, the shape of a site's header-plus-footer chrome. */
function chrome(n: number, origin = "https://github.com"): Array<{ text: string; href: string }> {
  return Array.from({ length: n }, (_, i) => ({ text: `nav ${i}`, href: `${origin}/path-${i}` }));
}

const SEARCH_URL = "https://github.com/search?q=repo%3Aplenaryapp%2Fawesome-rss-feeds+justtuned";

describe("structuralLinks", () => {
  it("counts distinct same-origin destinations", () => {
    const r = structuralLinks(chrome(30), SEARCH_URL);
    expect(r.status).toBe("read");
    expect(r.count).toBe(30);
    expect(r.origin).toBe("https://github.com");
  });

  it("folds repeats of the same address, because a header and a footer are not two destinations", () => {
    const nav = [
      { text: "Pricing", href: "https://github.com/pricing" },
      { text: "Pricing", href: "https://github.com/pricing" },
      { text: "pricing (footer)", href: "https://github.com/pricing#plans" },
    ];
    expect(structuralLinks(nav, SEARCH_URL).count).toBe(1);
  });

  it("does not count this page itself — a challenge document's one link is a retry", () => {
    const retry = [
      { text: "Retry", href: SEARCH_URL },
      { text: "Retry (fragment)", href: `${SEARCH_URL}#top` },
    ];
    expect(structuralLinks(retry, SEARCH_URL).count).toBe(0);
  });

  it("does not count off-origin links, so a challenge provider's own links buy nothing", () => {
    const provider = [
      { text: "Cloudflare", href: "https://www.cloudflare.com/" },
      { text: "Privacy", href: "https://policies.cloudflare.com/privacy" },
      ...chrome(5),
    ];
    expect(structuralLinks(provider, SEARCH_URL).count).toBe(5);
  });

  it("does not count controls that are not addresses", () => {
    const controls = [
      { text: "Open menu", href: "javascript:void(0)" },
      { text: "Email us", href: "mailto:hi@github.com" },
      { text: "broken", href: "not a url" },
      { text: "", href: "" },
      ...chrome(3),
    ];
    expect(structuralLinks(controls, SEARCH_URL).count).toBe(3);
  });

  it("reports 'unreadable' rather than zero when the anchors could not be extracted", () => {
    // The same distinction the spec draws for body text. "This page has no links" is a reading
    // about the page; "the reader gave up" is a reading about the reader, and only the first is
    // ever allowed to influence a classification.
    expect(structuralLinks(null, SEARCH_URL)).toEqual({ status: "unreadable", count: 0, origin: null });
    expect(structuralLinks(undefined, SEARCH_URL).status).toBe("unreadable");
  });

  it("fails closed when the page's own URL cannot be parsed, instead of counting every link", () => {
    const r = structuralLinks(chrome(50), "::not a url::");
    expect(r.status).toBe("unreadable");
    expect(r.count).toBe(0);
  });
});

describe("classifyRead — the readings this loop actually took", () => {
  it("calls a long, unchallenged page a page", () => {
    const r = classifyRead("awesome-rss-feeds", LONG, structuralLinks(chrome(40), SEARCH_URL));
    expect(r.outcome).toBe("page");
    expect(r.signals).toEqual([]);
    expect(r.length_floor_overruled).toBeNull();
  });

  it("run 50 — a reCAPTCHA page stays an interstitial", () => {
    const r = classifyRead(
      "Checking your browser - reCAPTCHA",
      text(131),
      structuralLinks([], "https://pmc.ncbi.nlm.nih.gov/articles/PMC1234567/"),
    );
    expect(r.outcome).toBe("interstitial");
    expect(r.signals.join(" ")).toMatch(/title matches bot-check pattern/);
  });

  it("runs 157 and 160 — a zero-results answer inside the host's chrome is now a page", () => {
    const r = classifyRead("Search · justtuned · GitHub", SHORT, structuralLinks(chrome(103), SEARCH_URL));
    expect(r.outcome).toBe("page");
    expect(r.signals).toEqual([]);
    expect(r.length_floor_overruled).toMatch(/735 visible characters/);
    expect(r.structural_links).toBe(103);
    expect(r.structural_links_status).toBe("read");
  });
});

describe("classifyRead — the discriminator is additive and cannot become a hole", () => {
  it("the terseness floor is unchanged for a page with no chrome", () => {
    const r = classifyRead("Some page", SHORT, structuralLinks(chrome(MIN_STRUCTURAL_LINKS - 1), SEARCH_URL));
    expect(r.outcome).toBe("interstitial");
    expect(r.signals.join(" ")).toMatch(new RegExp(`below the ${MIN_PAGE_CHARS} floor`));
    expect(r.signals.join(" ")).toMatch(new RegExp(`below the ${MIN_STRUCTURAL_LINKS} structural floor`));
    expect(r.length_floor_overruled).toBeNull();
  });

  it("is a floor and not a range — exactly MIN_STRUCTURAL_LINKS rescues", () => {
    const r = classifyRead("Some page", SHORT, structuralLinks(chrome(MIN_STRUCTURAL_LINKS), SEARCH_URL));
    expect(r.outcome).toBe("page");
  });

  it("chrome does not buy past a challenge named in the title", () => {
    // The load-bearing property. If rich navigation could overrule a named bot check, this would be
    // run 50's defect re-entering through the fix for run 160's.
    const r = classifyRead("Just a moment...", SHORT, structuralLinks(chrome(500), SEARCH_URL));
    expect(r.outcome).toBe("interstitial");
    expect(r.signals.join(" ")).toMatch(/Just a moment/);
  });

  it("chrome does not buy past a challenge named in the body", () => {
    const body = `${text(400)} Performing security verification ${text(300)}`;
    const r = classifyRead("Search · GitHub", body, structuralLinks(chrome(500), SEARCH_URL));
    expect(r.outcome).toBe("interstitial");
    expect(r.signals.join(" ")).toMatch(/body matches bot-check pattern/);
  });

  it("an unreadable anchor list rescues nothing", () => {
    const r = classifyRead("Some page", SHORT, structuralLinks(null, SEARCH_URL));
    expect(r.outcome).toBe("interstitial");
    expect(r.signals.join(" ")).toMatch(/anchors could not be read/);
  });

  it("an omitted structure behaves exactly as the pre-run-161 classifier did", () => {
    // The migration guard. Any caller that has not been updated to pass a structure must keep
    // failing closed rather than silently gaining a rescue it never asked for.
    expect(classifyRead("Some page", SHORT).outcome).toBe("interstitial");
    expect(classifyRead("Some page", LONG).outcome).toBe("page");
  });

  it("reports the length reading even on a read a challenge pattern condemned anyway", () => {
    // `length_floor_overruled` is a record of what the length signal did, not a veto over the
    // outcome. Keeping the two separable is what makes a failing run's log diagnosable.
    const r = classifyRead("Access denied", SHORT, structuralLinks(chrome(103), SEARCH_URL));
    expect(r.outcome).toBe("interstitial");
    expect(r.length_floor_overruled).not.toBeNull();
  });
});
