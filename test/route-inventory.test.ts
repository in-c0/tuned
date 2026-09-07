// The route surface, enumerated — and the reason this file exists rather than another counter.
//
// Runs 141–144 swept this service for undiscriminated counters and closed on "the instrument
// sweep is finished; no counter on any route is undiscriminated any more." That sentence was
// **true**, and run 145 found `POST /:handle/follow` — the only conversion action on a public feed
// page — writing nothing at all. It had never appeared in the sweep, because every property the
// sweep tested was a property *of a counter* and a route with no counter is not merely undetected
// by that method, it is unreachable by it. [L-61](../ops/LESSONS.md): **an inventory audit is only
// as complete as the set it enumerates.**
//
// L-61's own prevention check is *write down the set you swept, then name one member of the
// intended set that is not in it*, and its prescribed next attempt is to **enumerate the surface,
// not the instrument** — for each route, what does it write, and if nothing, is that deliberate?
// This file is that enumeration, made mechanical. The set swept is the route table itself, which
// is the intended set, so the failure that produced L-61 cannot recur silently: a new route with
// no decision about instrumentation turns this suite red.
//
// It asserts in both directions on purpose. An unlisted route is the run-145 defect. A listed
// route that has *quietly grown* a counter is the same defect wearing the other face — the
// register would then describe a surface as uncounted while production counted it — so an
// `uncounted` entry that starts writing must be reclassified before this passes.
//
// And it guards against passing vacuously, which is the specific way an inventory test lies. A
// regex that matches nothing sweeps an empty set and every assertion over it holds. So the parsed
// route count is checked against an independent count of route-registration tokens, and the set of
// mounted sub-applications is pinned: a route registered in a shape this parser does not read, or
// a whole sub-app mounted under a new prefix, goes red rather than unnoticed.

import { describe, expect, it } from "vitest";
import indexSource from "../src/index.ts?raw";
import operatorSource from "../src/operator.ts?raw";

type Entry = { writes: string } | { uncounted: string };

/** Every route this Worker serves, and what it records. Keys are `METHOD path` exactly as
 *  registered. `writes` names the counters the handler is responsible for — the assertions below
 *  check that it writes *something*; which names, and under what conditions, is pinned by the
 *  dedicated suites (pulse, follow, attention, arrival, landing, metrics). `uncounted` is a
 *  decision, not an oversight, and has to survive being written down. */
const INVENTORY: Record<string, Entry> = {
  // ---- public surfaces, counted ----
  "GET /": { writes: "landing_view[_bot]" },
  "POST /waitlist": { writes: "application_submit / application_invalid, +_bot, +_offpage axis" },
  "POST /api/pulse/:name": { writes: "the allowlisted pulse name, +_bot" },
  "GET /robots.txt": { writes: "robots_fetch[_bot]" },
  "GET /sitemap.xml": { writes: "sitemap_fetch[_bot]" },
  "GET /:handle": { writes: "feed_view[_bot], feed_view[_bot]:<handle>, arrival[_bot]:<tag>" },
  "GET /:handle/rss.xml": { writes: "feed_fetch[_bot], feed_fetch[_bot]:<handle>, arrival_fetch[_bot]:<tag>" },
  "POST /:handle/follow": {
    writes: "follow_submit / follow_invalid, +_bot, +:<handle>, +_offpage and _duplicate axes",
  },

  // ---- member surfaces, counted ----
  "GET /enter/:token": { writes: "member_login[_bot], +_unattended axis" },
  "GET /today": { writes: "desk_view[_bot], +_unattended axis; member_days via memberActive" },
  "POST /read/:id": { writes: "attention_star / attention_skip, +_bot, +_owner axis" },

  // ---- public surfaces, deliberately uncounted ----
  //
  // The two legal pages are the only public HTML this service serves that records nothing, and
  // that is a judgement rather than an omission: they are reached from a footer link on pages
  // whose views are already counted, so a count here would measure the footer, and neither is a
  // step in any funnel the register reads. If a distribution venue ever sends traffic *to* them
  // this becomes wrong and should be revisited.
  "GET /terms": { uncounted: "legal page; footer-reached from surfaces already counted, no funnel step" },
  "GET /privacy": { uncounted: "legal page; footer-reached from surfaces already counted, no funnel step" },
  // Counting this would count *us*. It is what verify-production polls to decide whether a deploy
  // landed, several times per push, plus whatever else probes it — the counter would be a record
  // of this loop's own gates and nothing else, exactly what `cron_run` already is honest about.
  "GET /api/version": { uncounted: "deploy-freshness probe; would count this loop's own verification gates" },
  "GET /api/metrics": { uncounted: "key-gated read of the counters themselves; counting a read of the counts is circular" },
  // The owner's approval act. Its outcome is already recorded as *state* — `totals.members` — and
  // state is strictly better than a counter here, because it is not zero merely because the
  // counter did not exist yet (the property run 144 built `totals.stars_owner` for).
  "POST /api/members": { uncounted: "admin-key-gated approval; outcome recorded as state in totals.members" },
  // No self-service sign-in exists: /login renders an interstitial that asks the owner for a link,
  // it has no form that posts anywhere, and the act it leads to is counted at GET /enter/:token.
  // This entry stops being right the day the page grows a form, which is what the test protects.
  "GET /login": { uncounted: "interstitial with no form; the sign-in act is counted at GET /enter/:token" },
  "GET /logout": { uncounted: "session teardown; ending a session is not a funnel step in either direction" },

  // ---- member-only surfaces, deliberately uncounted ----
  //
  // One reason covers this whole block and it is worth stating once rather than thirty times.
  // Every route below is reachable only with a session cookie or a capability token, `members` is
  // 1, and `totals.owner_resolved` is 1 — so every request any of them has ever served is the
  // owner. A counter here would record the operator operating the service, which is the reading
  // run 144 spent a whole run learning to *subtract* from the counters that already existed. When
  // `members` exceeds 1 this reason expires and the block needs re-deciding, not re-confirming.
  "GET /home": { uncounted: "member-only; sole member is the owner (see block note)" },
  "POST /queue/:id/:action": { uncounted: "member-only desk triage; sole member is the owner" },
  "POST /api/creators": { uncounted: "member-only feed creation; sole member is the owner" },
  "POST /api/agents/:id/charter": { uncounted: "member-only private steering; sole member is the owner" },
  "GET /connect/spotify": { uncounted: "member-only ingestion plumbing; sole member is the owner" },
  "GET /connect/spotify/callback": { uncounted: "member-only ingestion plumbing; sole member is the owner" },
  "POST /connect/spotify/sync": { uncounted: "member-only ingestion plumbing; the sync itself counts spotify_sync_*" },
  "POST /connect/spotify/auto": { uncounted: "member-only ingestion plumbing; sole member is the owner" },
  "POST /connect/spotify/disconnect": { uncounted: "member-only ingestion plumbing; sole member is the owner" },

  // ---- studio: capability-URL surfaces, deliberately uncounted ----
  //
  // Every /studio/:token route is a private path (src/crawl.ts) served against an unguessable
  // token, refused indexing, and reachable only by whoever holds the URL. It is the creator's own
  // workspace rather than a public surface, and the same sole-member reason applies.
  "GET /studio/:token": { uncounted: "capability URL, private path; creator workspace, not a public surface" },
  "GET /studio/:token/brief": { uncounted: "capability URL, private path" },
  "GET /studio/:token/setup": { uncounted: "capability URL, private path" },
  "GET /studio/:token/share": { uncounted: "capability URL, private path" },
  "POST /studio/:token/share-api": { uncounted: "capability URL, private path" },
  "POST /studio/:token/preview": { uncounted: "capability URL, private path" },
  "POST /studio/:token/items": { uncounted: "capability URL, private path" },
  "POST /studio/:token/items/:id/toggle": { uncounted: "capability URL, private path" },
  "POST /studio/:token/items/:id/delete": { uncounted: "capability URL, private path" },
  "GET /studio/:token/manifest.webmanifest": { uncounted: "static asset of a capability URL" },
  "GET /studio/:token/sw.js": { uncounted: "static asset of a capability URL" },

  // ---- operator control plane, deliberately uncounted ----
  //
  // Owner-scoped, single-credential, fail-closed while AGENT_OPERATOR_KEY is unset. Every call is
  // this executor acting as the operator, so a counter would measure the loop, not demand. What
  // these routes do *to the product* is already visible where it matters — `items_public`,
  // `feeds_agent` and the published item's own row — and each dispatch is recorded in the register
  // with its workflow run.
  "GET /api/operator/agents": { uncounted: "operator control plane; every call is this loop, not a visitor" },
  "POST /api/operator/agents": { uncounted: "operator control plane; outcome visible in totals.feeds_agent" },
  "POST /api/operator/agents/adopt": { uncounted: "operator control plane; outcome visible in totals.feeds_agent" },
  "POST /api/operator/agents/:handle/items": { uncounted: "operator control plane; outcome visible in totals.items_public" },
  "POST /api/operator/agents/:handle/disable": { uncounted: "operator control plane; outcome visible in totals.feeds_agent" },
  "POST /api/operator/agents/:handle/items/:itemId/retract": { uncounted: "operator control plane; outcome visible in totals.items_public" },
  "POST /api/operator/agents/:handle/items/:itemId/restore": { uncounted: "operator control plane; outcome visible in totals.items_public" },
};

const COUNT_CALL = /\bcount(Each|By)?\(/;

type Parsed = { key: string; body: string };

/** Route registrations, in source order, with the span of source each one owns. The span runs to
 *  the next registration, which is exact for this file's shape — routes are registered
 *  sequentially at module top level — and is only ever used to ask whether a counter is called
 *  inside it. */
function parse(source: string, varName: string, prefix: string): Parsed[] {
  const re = new RegExp(`^${varName}\\.(get|post|put|patch|delete)\\("([^"]+)"`, "gm");
  const hits: { key: string; idx: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) {
    hits.push({ key: `${m[1].toUpperCase()} ${prefix}${m[2]}`, idx: m.index });
  }
  return hits.map((h, i) => ({
    key: h.key,
    body: source.slice(h.idx, i + 1 < hits.length ? hits[i + 1].idx : source.length),
  }));
}

const registered = [
  ...parse(indexSource, "app", ""),
  ...parse(operatorSource, "operator", "/api/operator"),
];
const byKey = new Map(registered.map((r) => [r.key, r]));

describe("the route inventory is complete in both directions", () => {
  it("classifies every registered route", () => {
    const unlisted = registered.map((r) => r.key).filter((k) => !(k in INVENTORY));
    expect(
      unlisted,
      "a route is served that this inventory has never decided about — write it down as `writes` or as `uncounted` with a reason (L-61)"
    ).toEqual([]);
  });

  it("lists no route that is not registered", () => {
    const stale = Object.keys(INVENTORY).filter((k) => !byKey.has(k));
    expect(stale, "the inventory describes routes this Worker no longer serves").toEqual([]);
  });

  it("finds a counter in every route it calls counted", () => {
    const silent = Object.entries(INVENTORY)
      .filter(([, e]) => "writes" in e)
      .filter(([k]) => !COUNT_CALL.test(byKey.get(k)!.body))
      .map(([k]) => k);
    expect(silent, "a route the register describes as instrumented writes no counter").toEqual([]);
  });

  it("finds no counter in any route it calls uncounted", () => {
    const grown = Object.entries(INVENTORY)
      .filter(([, e]) => "uncounted" in e)
      .filter(([k]) => COUNT_CALL.test(byKey.get(k)!.body))
      .map(([k]) => k);
    expect(
      grown,
      "a route recorded as uncounted has grown a counter — reclassify it, or the register describes a surface production does not have"
    ).toEqual([]);
  });

  it("gives a reason for every uncounted route", () => {
    const mute = Object.entries(INVENTORY)
      .filter(([, e]) => "uncounted" in e && (e as { uncounted: string }).uncounted.trim().length < 20)
      .map(([k]) => k);
    expect(mute, "an uncounted route with no reason is an oversight wearing a decision's clothes").toEqual([]);
  });
});

// The assertions above all quantify over `registered`. If the parser reads nothing, they all pass
// and this file becomes the exact thing it was written against: a sweep whose set is empty. These
// three make that impossible to do quietly.
describe("the sweep cannot pass vacuously", () => {
  it("parses every route-registration token in both files", () => {
    const tokens = (src: string, varName: string) =>
      (src.match(new RegExp(`^${varName}\\.(get|post|put|patch|delete|all|on)\\(`, "gm")) ?? []).length;
    const counted = tokens(indexSource, "app") + tokens(operatorSource, "operator");
    expect(
      registered.length,
      "a route is registered in a shape this parser does not read — a computed path, a template literal, or app.on() — so it is served and never swept"
    ).toBe(counted);
  });

  it("sweeps a surface of the size this Worker actually has", () => {
    expect(registered.length).toBeGreaterThan(40);
  });

  it("pins the set of mounted sub-applications", () => {
    const mounts = [...indexSource.matchAll(/app\.route\("([^"]+)"/g)].map((m) => m[1]);
    expect(
      mounts,
      "a sub-application is mounted under a prefix this inventory does not parse — every route inside it is unswept"
    ).toEqual(["/api/operator"]);
  });
});

// The one write path that is not a route. Left out, the inventory would be complete about routes
// and silent about the scheduled handler, which is the same shape of gap one level up.
describe("the scheduled handler is inventoried too", () => {
  it("counts every cron invocation", () => {
    expect(indexSource).toMatch(/count\(env\.DB, "cron_run"\)/);
  });

  it("records the outcome of each ingestion attempt", () => {
    for (const name of ["spotify_sync_ok", "spotify_sync_error", "spotify_sync_auth_error", "cron_no_credentials"]) {
      expect(indexSource, `the scheduled handler no longer records ${name}`).toContain(`"${name}"`);
    }
  });
});
