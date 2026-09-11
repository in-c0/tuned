// Types for settle-requests.mjs. Same reason as nav-links.d.mts and find-windows.d.mts: the
// implementation is .mjs because qa/ is a Playwright harness that runs straight from source with
// no build step, and this file is what lets the Worker's `tsc --noEmit` typecheck the test that
// exercises it.

export declare const SETTLE_TIMEOUT_MS: number;
export declare const SETTLE_POLL_MS: number;

export interface SettleResult {
  /** True when the pending set emptied; false when the deadline expired with requests open. */
  settled: boolean;
  waitedMs: number;
  /** URLs still in flight when settle() returned. Empty when `settled` is true. */
  outstanding: string[];
}

export interface InFlightTracker {
  settle(opts?: { timeoutMs?: number; pollMs?: number }): Promise<SettleResult>;
  outstanding(): string[];
  pendingCount(): number;
}

/** The subset of Playwright's Page this helper uses. Kept structural so a test can pass a fake. */
export interface RequestEventSource {
  on(event: "request" | "requestfinished" | "requestfailed", handler: (req: { url(): string }) => void): unknown;
}

export declare function trackInFlight(
  page: RequestEventSource,
  isFirstParty: (url: string) => boolean,
  deps?: { now?: () => number; sleep?: (ms: number) => Promise<void> },
): InFlightTracker;

export declare const PULSE_PATH_PREFIX: string;
export declare function isPulseUrl(url: string): boolean;
export declare function pulseName(url: string): string | null;

export interface FailureRecord {
  url: string;
  failure: string;
}

export declare function partitionFailures(
  firstPartyFailures: FailureRecord[],
  opts?: { abortText?: string },
): { failures: FailureRecord[]; discarded: Array<FailureRecord & { pulse: string | null }> };
