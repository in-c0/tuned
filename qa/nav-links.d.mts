// Types for nav-links.mjs. Same reason as find-windows.d.mts: the implementation is .mjs because
// qa/ is a Playwright harness that runs straight from source with no build step, and this file is
// what lets the Worker's `tsc --noEmit` typecheck the test that exercises it.

export declare const LINK_MAX_MATCHES: number;
export declare const LINK_TEXT_CHARS: number;

export interface MatchedLink {
  text: string;
  href: string;
  matched: "text" | "href" | "both";
}

export interface LinkMatchResult {
  needle: string | null;
  total: number;
  truncated: boolean;
  skipped_non_http: number;
  links: MatchedLink[];
}

export declare function matchLinks(
  anchors: Array<{ text?: string; href?: string }>,
  needle: string,
  opts?: { max?: number; textChars?: number },
): LinkMatchResult;
