// Telling a delivered beacon from a failed request, and the tracker that says a page went quiet.
//
// This is the pure half of the fix for the 2026-09-11 provenance run, where twelve cases failed on
// `net::ERR_ABORTED` for /api/pulse/feed_render against a production that was working. The browser
// half costs a dispatch and cannot be mutated; this half can be pinned exactly, so it is.
//
// The first attempt at that fix assumed the abort happened at Playwright's teardown and tried to
// let the request finish first. It did not work — `settled` came back true and the abort was still
// there — and the counter then said why: `feed_render_bot` read 25 for UTC 2026-09-11, exactly the
// 24 feed page loads of the two provenance runs plus 1 from the follow-dialog spec. Every aborted
// beacon had been delivered and counted. The abort is the renderer discarding a response nothing
// awaited, which is what `fetch(..., { keepalive: true }).catch(() => {})` asks for by design.
//
// The load-bearing property is the one a careless fix would break. Making the specs green by
// filtering ERR_ABORTED out wholesale would be an instrument edited until it agrees with today's
// production (L-31), blind to a real failure ever after. The exemption is therefore narrowed to
// one shape — a pulse path, aborted — and the tests below pin both halves of that narrowing: a
// pulse that failed any OTHER way is still a failure, and a non-pulse abort is still a failure.

import { describe, expect, it } from "vitest";

import {
  SETTLE_POLL_MS,
  SETTLE_TIMEOUT_MS,
  isPulseUrl,
  partitionFailures,
  pulseName,
  trackInFlight,
} from "../qa/settle-requests.mjs";

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

const ABORT = "net::ERR_ABORTED";
const RESET = "net::ERR_CONNECTION_RESET";

describe("isPulseUrl / pulseName", () => {
  it("matches a pulse by path, not by substring anywhere in the URL", () => {
    expect(isPulseUrl("https://justtuned.com/api/pulse/feed_render")).toBe(true);
    expect(pulseName("https://justtuned.com/api/pulse/feed_render")).toBe("feed_render");
    // The exemption must not be claimable by a URL that merely mentions the path.
    expect(isPulseUrl("https://evil.example/?next=/api/pulse/feed_render")).toBe(false);
    expect(isPulseUrl("https://justtuned.com/sportstech?x=/api/pulse/feed_render")).toBe(false);
  });

  it("is not fooled by a prefix that only looks like the pulse root", () => {
    expect(isPulseUrl("https://justtuned.com/api/pulsex/feed_render")).toBe(false);
    expect(pulseName("https://justtuned.com/api/pulse/")).toBeNull();
  });

  it("returns null rather than throwing on a URL it cannot parse", () => {
    expect(isPulseUrl("not a url")).toBe(false);
    expect(pulseName("not a url")).toBeNull();
  });
});

describe("partitionFailures", () => {
  it("exempts a pulse beacon that aborted — the delivered-and-discarded case", () => {
    const r = partitionFailures([{ url: "https://justtuned.com/api/pulse/feed_render", failure: ABORT }]);
    expect(r.failures).toEqual([]);
    expect(r.discarded).toEqual([
      { url: "https://justtuned.com/api/pulse/feed_render", failure: ABORT, pulse: "feed_render" },
    ]);
  });

  it("does NOT exempt a pulse that failed some other way — this is the narrowing that matters", () => {
    const r = partitionFailures([{ url: "https://justtuned.com/api/pulse/feed_render", failure: RESET }]);
    expect(r.discarded).toEqual([]);
    expect(r.failures).toHaveLength(1);
  });

  it("does NOT exempt a non-pulse request that aborted", () => {
    const r = partitionFailures([{ url: "https://justtuned.com/sportstech", failure: ABORT }]);
    expect(r.discarded).toEqual([]);
    expect(r.failures).toHaveLength(1);
  });

  it("keeps every other failure untouched alongside an exempted beacon", () => {
    const r = partitionFailures([
      { url: "https://justtuned.com/api/pulse/feed_render", failure: ABORT },
      { url: "https://justtuned.com/style.css", failure: RESET },
      { url: "https://justtuned.com/api/pulse/follow_open", failure: ABORT },
    ]);
    expect(r.discarded.map((d) => d.pulse)).toEqual(["feed_render", "follow_open"]);
    expect(r.failures).toEqual([{ url: "https://justtuned.com/style.css", failure: RESET }]);
  });

  it("passes an empty list straight through", () => {
    expect(partitionFailures([])).toEqual({ failures: [], discarded: [] });
  });
});
