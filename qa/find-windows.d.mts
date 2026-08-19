// Types for find-windows.mjs. The implementation is .mjs because qa/ is a Playwright harness that
// runs straight from source with no build step; the Worker's `tsc --noEmit` still typechecks the
// test that exercises it, and this file is what lets it.

export declare const FIND_WINDOW_BEFORE: number;
export declare const FIND_WINDOW_AFTER: number;
export declare const FIND_MAX_MATCHES: number;

export interface FindWindow {
  index: number;
  text: string;
}

export interface FindResult {
  needle: string | null;
  total: number;
  truncated: boolean;
  windows: FindWindow[];
}

export declare function findWindows(
  text: string,
  needle: string,
  opts?: { before?: number; after?: number; max?: number },
): FindResult;
