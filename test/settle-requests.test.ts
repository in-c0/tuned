// The tracker that decides whether a "first-party request failure" is a failure or a test ending.
//
// This is the pure half of the fix for the 2026-09-11 provenance run, where twelve cases failed on
// `net::ERR_ABORTED` against a production that was working: a `keepalive` pulse was still open when
// Playwright tore the page down. The spec half can only be exercised by dispatching a browser at
// production, which costs a run and cannot be mutated; this half can be pinned exactly, so it is.
//
// The load-bearing property is the one a careless fix would break. It would be easy — and wrong —
// to make the specs green by filtering ERR_ABORTED out of the results, which is an instrument
// edited until it agrees with today's production (L-31) and blind to a real abort ever after.
// This helper therefore has NO access to the failure list at all: it only lets requests finish.
// The test below pins that a request which genuinely fails still drops out of the pending set
// without being rescued, so the spec's own assertion keeps seeing it.

import { describe, expect, it } from "vitest";

import { SETTLE_POLL_MS, SETTLE_TIMEOUT_MS, trackInFlight } from "../qa/settle-requests.mjs";

/** A stand-in for Playwright's Page: it emits the three request events and nothing else. */
function fakePage() {
  const handlers: Record<string, Array<(req: { url(): string }) => void>> = {};
  return {
    on(event: string, handler: (req: { url(): string }) => void) {
      (handlers[event] ??= []).push(handler);
    },
    emit(event: string, url: string) {
      for (const h of handlers[event] ?? []) h({ url: () => url });
    },
  };
}

/** A clock the test drives, so nothing here waits on real time or passes because a machine was slow. */
function fakeClock() {
  let t = 0;
  return {
    now: () => t,
    sleep: async (ms: number) => {
      t += ms;
    },
    advance: (ms: number) => {
      t += ms;
    },
  };
}

const FIRST_PARTY = (u: string) => u === "" || u.startsWith("https://justtuned.com");
const PULSE = "https://justtuned.com/api/pulse/feed_render";

describe("trackInFlight", () => {
  it("settles immediately when nothing is in flight", async () => {
    const page = fakePage();
    const clock = fakeClock();
    const t = trackInFlight(page, FIRST_PARTY, clock);

    const r = await t.settle();
    expect(r.settled).toBe(true);
    expect(r.outstanding).toEqual([]);
    expect(r.waitedMs).toBe(0);
  });

  it("waits for a keepalive beacon that is still open, then reports it settled", async () => {
    const page = fakePage();
    const clock = fakeClock();
    const t = trackInFlight(page, FIRST_PARTY, clock);

    page.emit("request", PULSE);
    expect(t.pendingCount()).toBe(1);

    // The beacon lands on the first poll, the way a same-origin POST actually does.
    const settling = t.settle();
    await Promise.resolve();
    page.emit("requestfinished", PULSE);

    const r = await settling;
    expect(r.settled).toBe(true);
    expect(r.outstanding).toEqual([]);
  });

  it("a request that genuinely fails is NOT rescued — it clears pending and is left to the spec", async () => {
    const page = fakePage();
    const clock = fakeClock();
    const t = trackInFlight(page, FIRST_PARTY, clock);

    page.emit("request", PULSE);
    const settling = t.settle();
    await Promise.resolve();
    page.emit("requestfailed", PULSE);

    const r = await settling;
    // Settled, because nothing is in flight any more. The helper does not and cannot hide the
    // failure: it never touches the spec's failedRequests list, so the assertion there still fires.
    expect(r.settled).toBe(true);
    expect(r.outstanding).toEqual([]);
  });

  it("reports a timeout as a timeout rather than as quiet — the silent pass L-61 names", async () => {
    const page = fakePage();
    const clock = fakeClock();
    const t = trackInFlight(page, FIRST_PARTY, clock);

    page.emit("request", PULSE);

    const r = await t.settle({ timeoutMs: 500, pollMs: 100 });
    expect(r.settled).toBe(false);
    expect(r.outstanding).toEqual([PULSE]);
    expect(r.waitedMs).toBeGreaterThanOrEqual(500);
  });

  it("ignores third-party requests entirely, so an ad network cannot hold a spec open", async () => {
    const page = fakePage();
    const clock = fakeClock();
    const t = trackInFlight(page, FIRST_PARTY, clock);

    page.emit("request", "https://example.com/tracker.gif");
    expect(t.pendingCount()).toBe(0);

    const r = await t.settle({ timeoutMs: 500, pollMs: 100 });
    expect(r.settled).toBe(true);
    expect(r.waitedMs).toBe(0);
  });

  it("counts the same URL twice when it is genuinely in flight twice", async () => {
    const page = fakePage();
    const clock = fakeClock();
    const t = trackInFlight(page, FIRST_PARTY, clock);

    page.emit("request", PULSE);
    page.emit("request", PULSE);
    expect(t.pendingCount()).toBe(1); // one distinct URL...
    expect(t.outstanding()).toEqual([PULSE]);

    page.emit("requestfinished", PULSE);
    // ...but two in flight, so one completion must not clear it. A Set here would have.
    expect(t.outstanding()).toEqual([PULSE]);

    page.emit("requestfinished", PULSE);
    expect(t.outstanding()).toEqual([]);
  });

  it("survives a completion for a request it never saw start", async () => {
    const page = fakePage();
    const clock = fakeClock();
    const t = trackInFlight(page, FIRST_PARTY, clock);

    // Playwright can deliver a requestfinished for a request that began before the listener
    // attached. Dropping below zero would make the tracker permanently negative and settle forever.
    page.emit("requestfinished", PULSE);
    expect(t.pendingCount()).toBe(0);

    page.emit("request", PULSE);
    expect(t.pendingCount()).toBe(1);
  });

  it("treats the empty URL as first party, the way every spec's own predicate does", async () => {
    const page = fakePage();
    const clock = fakeClock();
    const t = trackInFlight(page, FIRST_PARTY, clock);

    page.emit("request", "");
    expect(t.pendingCount()).toBe(1);
  });

  it("ships a timeout loose enough that only something stuck can reach it", () => {
    expect(SETTLE_TIMEOUT_MS).toBeGreaterThanOrEqual(5_000);
    expect(SETTLE_POLL_MS).toBeLessThanOrEqual(100);
  });
});
