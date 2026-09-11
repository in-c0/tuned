// Telling a beacon that was delivered from a request that failed — because Chromium reports both
// to the page as `net::ERR_ABORTED`.
//
// Why this exists. Three specs in this directory — exp008-provenance, public-surfaces and
// exp003-mechanism — end with `expect(firstPartyFailures).toEqual([])`, collecting Playwright's
// `requestfailed` events and asserting the list is empty. On 2026-09-11 that assertion failed
// twelve times in a row, on all six nominated items at both viewports, against a production that
// was working perfectly.
//
// THE MECHANISM, and it is not what the first fix assumed. Every pulse on this site is fired as
// `fetch(..., { keepalive: true }).catch(() => {})` — see CLIENT_JS in src/pages.ts. It is
// fire-and-forget by construction: nothing awaits the promise. `keepalive` hands the request to
// the browser process, which completes it independently of the document, and the renderer then
// discards a response no one is waiting for. Chromium surfaces that discard to the page as
// `requestfailed` / `net::ERR_ABORTED`. The request was sent. The server answered. The page threw
// the answer away on purpose.
//
// This was established by counter rather than by argument, after a first fix that assumed the
// abort happened at test teardown and did not work. `feed_render_bot` read **25** for UTC
// 2026-09-11 in the snapshot generated at 22:30:07Z — exactly the 24 feed page loads the two
// provenance runs made that evening, plus the 1 from the follow-dialog spec. **Every single
// "aborted" beacon was delivered and counted.** The corroborating case is follow-dialog.spec.mjs,
// which sees ordinary `response` events for the same pulses because it *awaits* them with
// `waitForResponse`, so the renderer keeps the stream long enough to deliver it.
//
// So the old assertion could not be made green by waiting, and the honest reading is that
// "no first-party request was aborted" was never the property worth testing. What matters about a
// pulse is whether it was FIRED and whether the server ACCEPTED it, and both are observable.
//
// What this does NOT do, because it is the whole point. It does not blanket-filter ERR_ABORTED,
// which would be an instrument edited until it agrees with today's production (L-31) and blind to
// a real failure ever after. It narrows the exemption to exactly one shape — a POST to
// /api/pulse/* that the page deliberately did not await — and pairs it with POSITIVE assertions
// the old spec never had: the expected pulse fired, and every pulse response that was observed
// carried 204. A pulse that 404s or 403s produces a response with that status, not an abort, and
// is still caught. A pulse that silently stopped firing produces no request at all, and is now
// caught for the first time. The spec ends up stricter than it was, not looser.
//
// `trackInFlight` below is kept from that first fix. It no longer carries the diagnosis, but the
// property it asserts is worth having on its own: an empty failure list read off a page that still
// had requests open is a pass the spec did not earn (L-61).

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

/** The one request shape a page here deliberately abandons: a fire-and-forget pulse beacon. */
export const PULSE_PATH_PREFIX = "/api/pulse/";

/** True for a URL that is one of this site's pulse beacons. Path-anchored, not a substring match:
 *  "…/api/pulse/x" must be the path, so a third-party URL merely *containing* the text cannot
 *  claim the exemption. */
export function isPulseUrl(url) {
  try {
    return new URL(url).pathname.startsWith(PULSE_PATH_PREFIX);
  } catch {
    return false;
  }
}

/** The pulse name, or null when the URL is not a pulse. */
export function pulseName(url) {
  if (!isPulseUrl(url)) return null;
  const name = new URL(url).pathname.slice(PULSE_PATH_PREFIX.length);
  return name === "" ? null : name;
}

/**
 * Split a spec's first-party `requestfailed` list into the failures that matter and the beacon
 * aborts that do not.
 *
 * `discarded` is the narrow exemption: a pulse URL whose failure is an abort. EVERYTHING else
 * stays in `failures`, including a pulse that failed for any other reason (DNS, connection reset,
 * blocked) and any non-pulse request that aborted. The caller asserts `failures` is empty exactly
 * as before; `discarded` goes into the evidence so the exemption is visible rather than silent.
 */
export function partitionFailures(firstPartyFailures, { abortText = "net::ERR_ABORTED" } = {}) {
  const discarded = [];
  const failures = [];
  for (const f of firstPartyFailures) {
    if (isPulseUrl(f.url) && f.failure === abortText) discarded.push({ ...f, pulse: pulseName(f.url) });
    else failures.push(f);
  }
  return { failures, discarded };
}
