// Types for classify-read.mjs. Same reason as find-windows.d.mts and nav-links.d.mts: the
// implementation is .mjs because qa/ is a Playwright harness that runs straight from source with no
// build step, and this file is what lets the Worker's `tsc --noEmit` typecheck the test that
// exercises it.

export declare const MIN_PAGE_CHARS: number;
export declare const MIN_STRUCTURAL_LINKS: number;
export declare const INTERSTITIAL_TITLE: RegExp;
export declare const INTERSTITIAL_BODY: RegExp;

export interface StructureReading {
  status: "read" | "unreadable";
  count: number;
  origin: string | null;
}

export interface ReadClassification {
  outcome: "page" | "interstitial";
  signals: string[];
  length_floor_overruled: string | null;
  structural_links: number;
  structural_links_status: "read" | "unreadable";
}

export declare function structuralLinks(
  anchors: Array<{ text?: string; href?: string }> | null | undefined,
  finalUrl: string,
): StructureReading;

export declare function classifyRead(
  title: string | null,
  normalized: string,
  structure?: StructureReading,
): ReadClassification;
