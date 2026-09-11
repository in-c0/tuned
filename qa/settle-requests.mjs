// Wait for a page's own in-flight requests to finish before judging whether any of them failed.
//
// Why this exists. Three specs in this directory — exp008-provenance, public-surfaces and
// exp003-mechanism — end with `expect(firstPartyFailures).toEqual([])`, collecting Playwright's
// `requestfailed` events into a list and asserting the list is empty. That assertion is correct
// about what it wants and wrong about what it measures, and on 2026-09-11 it failed twelve times
// in a row against a production that was working.
//
// The mechanism. Every pulse on this site is fired as `fetch(..., { keepalive: true })` — see
// CLIENT_JS in src/pages.ts. `keepalive` exists precisely so a beacon may outlive the document
// that sent it, so the request is still open when a spec finishes its assertions and Playwright
// tears the page down. Chromium reports the teardown as `requestfailed` with `net::ERR_ABORTED`,
// and the spec reads that as a first-party request failure. It is not one. Nothing failed; the
// test stopped watching.
//
// This is L-67 in a third location, and worth naming as such: a deadline inside a verdict. The
// spec had an implicit deadline — "however long the assertions happen to take" — and on either
// side of it sat two different facts, *the beacon has not landed yet* and *the beacon will never
// land*, reported identically. `feed_render` shipped 2026-09-07 (00f635a); this spec last ran
// 2026-09-05. It has never once run against a page that fires it, which is why the collision
// waited five days to be seen and then arrived all at once.
//
// What this does NOT do, because it is the whole point. **It removes nothing from the failure
// list.** Filtering ERR_ABORTED out of the results would be editing an instrument until it agrees
// with today's production, which is L-31, and it would also blind the spec to a real abort. What
// it does instead is give the page's own requests a bounded chance to *finish*, so a beacon that
// lands never enters the list at all and a beacon that genuinely fails still does. The assertion
// downstream stays byte-identical and stays strict.
//
// And the drain is reported rather than assumed. `settle()` returns whether the page actually went
// quiet or the deadline expired with requests still open, so a caller can tell "we waited and
// nothing was pending" from "we gave up and asserted into a half-finished page". The second is a
// silent pass (L-61) if it is not surfaced, so callers assert on it.

/** How long to let a page's own requests finish before giving up on them, in ms. Generous: the
 *  beacons this is waiting on are a single POST with no body against the same origin, and every
 *  production measurement this loop holds puts that well under a second. A limit this loose can
 *  only be reached by something genuinely stuck, which is the case worth seeing. */
export const SETTLE_TIMEOUT_MS = 10_000;

/** How often to re-check the pending set, in ms. */
export const SETTLE_POLL_MS = 50;

/**
 * Begin tracking first-party requests on a page. Call this BEFORE navigating: a request that
 * starts before the listener is attached is never counted, and the whole question is about a
 * request fired during page load.
 *
 * `isFirstParty(url)` decides what counts. It is the caller's own predicate rather than a host
 * comparison built in here, because each spec already has one and two definitions of "first
 * party" in one repository is how they drift apart.
 */
export function trackInFlight(page, isFirstParty, deps = {}) {
  const now = deps.now ?? (() => Date.now());
  const sleep = deps.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));

  /** URLs currently open, with a count each: the same URL can legitimately be in flight twice. */
  const pending = new Map();

  const add = (url) => {
    if (!isFirstParty(url)) return;
    pending.set(url, (pending.get(url) ?? 0) + 1);
  };
  const drop = (url) => {
    if (!isFirstParty(url)) return;
    const n = pending.get(url);
    if (n === undefined) return;
    if (n <= 1) pending.delete(url);
    else pending.set(url, n - 1);
  };

  page.on("request", (req) => add(req.url()));
  page.on("requestfinished", (req) => drop(req.url()));
  page.on("requestfailed", (req) => drop(req.url()));

  /** URLs still open right now. Sorted so the evidence object is stable between runs. */
  const outstanding = () => [...pending.keys()].sort();

  /**
   * Resolve once nothing first-party is in flight, or once the deadline passes.
   * Returns { settled, waitedMs, outstanding } — never throws, because a spec that cannot
   * even report why it gave up is worse than one that reports a timeout.
   */
  async function settle({ timeoutMs = SETTLE_TIMEOUT_MS, pollMs = SETTLE_POLL_MS } = {}) {
    const started = now();
    while (pending.size > 0 && now() - started < timeoutMs) {
      await sleep(pollMs);
    }
    return { settled: pending.size === 0, waitedMs: now() - started, outstanding: outstanding() };
  }

  return { settle, outstanding, pendingCount: () => pending.size };
}
