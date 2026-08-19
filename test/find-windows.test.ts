// The one piece of qa/source-read.spec.mjs that is pure logic, and therefore the one piece that can
// be wrong silently. Everything else in that spec is observable in the run log — a 403, an
// interstitial, a character count — but a windowing bug produces text that looks like a quotation
// and is cut in the wrong place, and a misquoted rule is exactly the failure ops/DISTRIBUTION.md's
// A1 exists to prevent (L-17: rules quoted from a dated source, not recalled or approximated).

import { describe, expect, it } from "vitest";

import { FIND_MAX_MATCHES, findWindows } from "../qa/find-windows.mjs";

const filler = (n: number) => "x".repeat(n);

describe("findWindows", () => {
  it("treats an empty needle as 'nobody asked', not as 'nothing found'", () => {
    const r = findWindows("contributing guidelines", "");
    expect(r.needle).toBeNull();
    expect(r.total).toBe(0);
    expect(r.windows).toEqual([]);
    expect(r.truncated).toBe(false);
  });

  it("reports zero matches without inventing a window", () => {
    const r = findWindows("this page says nothing of the kind", "contribut");
    expect(r.needle).toBe("contribut");
    expect(r.total).toBe(0);
    expect(r.windows).toEqual([]);
    expect(r.truncated).toBe(false);
  });

  it("matches case-insensitively and keeps context on both sides", () => {
    const text = `${filler(1000)}Contributing: send a pull request.${filler(1000)}`;
    const r = findWindows(text, "contributing", { before: 20, after: 30 });
    expect(r.total).toBe(1);
    expect(r.windows).toHaveLength(1);
    expect(r.windows[0].index).toBe(1000);
    expect(r.windows[0].text).toBe(text.slice(980, 1000 + "contributing".length + 30));
    expect(r.windows[0].text).toContain("Contributing: send a pull");
  });

  it("clamps the window at both ends of the text rather than overrunning", () => {
    const r = findWindows("rules", "rules", { before: 500, after: 500 });
    expect(r.windows[0].text).toBe("rules");
    expect(r.windows[0].index).toBe(0);
  });

  it("counts an occurrence that falls inside a window already emitted, but does not requote it", () => {
    // Two hits 10 characters apart, with a 100-character window: the second is already on screen.
    const text = `${filler(200)}feed ....feed${filler(200)}`;
    const r = findWindows(text, "feed", { before: 10, after: 100 });
    expect(r.total).toBe(2);
    expect(r.windows).toHaveLength(1);
    // Two occurrences, one window — the reading is incomplete and must say so.
    expect(r.truncated).toBe(true);
  });

  it("stops quoting at the cap while still counting what it did not show", () => {
    const text = Array.from({ length: FIND_MAX_MATCHES + 4 }, () => `feed${filler(50)}`).join("");
    const r = findWindows(text, "feed", { before: 5, after: 5 });
    expect(r.total).toBe(FIND_MAX_MATCHES + 4);
    expect(r.windows).toHaveLength(FIND_MAX_MATCHES);
    expect(r.truncated).toBe(true);
  });

  it("is not truncated when every occurrence was quoted", () => {
    const text = `feed${filler(500)}feed`;
    const r = findWindows(text, "feed", { before: 5, after: 5 });
    expect(r.total).toBe(2);
    expect(r.windows).toHaveLength(2);
    expect(r.truncated).toBe(false);
  });

  it("does not treat the needle as a pattern", () => {
    const text = "a self-promo rule (see .* below) applies";
    expect(findWindows(text, ".*").total).toBe(1);
    expect(findWindows(text, "s.lf-promo").total).toBe(0);
  });
});
