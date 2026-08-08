import { describe, it, expect } from "vitest";
import { resolveImageUrl } from "../src/meta";

// EXP-003's browser run against production (Actions run 31251017621, 2026-08-08) recorded a
// first-party 404 on the live landing page:
//
//   https://justtuned.com/static/browse/0.3.4/images/arxiv-logo-fb.png
//
// That path is arXiv's `og:image`, which is root-relative. It was stored verbatim and later
// rendered on our origin, where it resolves to us and 404s. These tests fix the behaviour that
// caused it, using the exact value observed in production as the first case.
describe("resolveImageUrl", () => {
  it("resolves the root-relative og:image that EXP-003 found 404ing in production", () => {
    expect(
      resolveImageUrl("/static/browse/0.3.4/images/arxiv-logo-fb.png", "https://arxiv.org/abs/2401.00001"),
    ).toBe("https://arxiv.org/static/browse/0.3.4/images/arxiv-logo-fb.png");
  });

  it("resolves a path-relative og:image against the fetched document", () => {
    expect(resolveImageUrl("img/cover.png", "https://example.com/posts/hello")).toBe(
      "https://example.com/posts/img/cover.png",
    );
  });

  it("resolves a protocol-relative og:image against the fetched scheme", () => {
    expect(resolveImageUrl("//cdn.example.com/a.png", "https://example.com/x")).toBe(
      "https://cdn.example.com/a.png",
    );
  });

  it("leaves an absolute URL alone", () => {
    expect(resolveImageUrl("https://cdn.example.com/a.png", "https://example.com/x")).toBe(
      "https://cdn.example.com/a.png",
    );
  });

  it("resolves against the redirected URL, not the requested one", () => {
    // fetchOg follows redirects and passes res.url, so a shortener must not become the base.
    expect(resolveImageUrl("/cover.png", "https://www.final.example/article")).toBe(
      "https://www.final.example/cover.png",
    );
  });

  it("drops values that are not http(s) after resolution", () => {
    // These arrive from pages we do not control and end up inside an `src` attribute.
    expect(resolveImageUrl("javascript:alert(1)", "https://example.com/")).toBe("");
    expect(resolveImageUrl("data:image/png;base64,AAAA", "https://example.com/")).toBe("");
  });

  it("returns empty for absent or unparseable input rather than throwing", () => {
    expect(resolveImageUrl("", "https://example.com/")).toBe("");
    expect(resolveImageUrl("http://[", "https://example.com/")).toBe("");
  });
});
