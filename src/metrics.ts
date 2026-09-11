// Funnel telemetry — deliberately minimal and privacy-safe.
//
// Two tables, both additive and self-applying (see ensureTables):
//
//   metric_days   pure daily counters. No identifiers of any kind, not even a
//                 pseudonymous one. One row per (day, counter name).
//   member_days   one row per member per active day. Same category of data the
//                 service already stores in `reads` and `members.last_desk_at` —
//                 this only stops retention history from being overwritten.
//
// Two things are deliberately NOT done here:
//
//   * No visitor cookie, no IP/UA hash, no per-visitor identifier. The published
//     privacy policy states the site sets no analytics cookies, and anonymous
//     visitor-level attribution is not worth amending it for. The cost is that
//     landing -> application conversion is a day-level ratio, not a per-visitor
//     funnel. That is enough to steer, and it needs no new data category.
//   * Nothing is recorded before a real request happens. No backfill, no
//     synthetic rows, no estimates.
//
// Days are UTC (matching how `reads.created_at` is already bucketed), not Sydney.

import { DEFAULT_OWNER_HANDLE, ownerMemberId } from "./handles";

const BOT_UA =
  /bot|crawl|spider|slurp|scrape|curl|wget|python-requests|httpx|go-http|java\/|headless|lighthouse|pingdom|uptime|monitor|preview|facebookexternalhit|embedly|probe|scan/i;

/** UA heuristic only — it undercounts nothing and overcounts nothing honestly, so
 *  bot and human views are counted into separate buckets rather than filtered away. */
export function isBot(ua: string): boolean {
  return ua === "" || BOT_UA.test(ua);
}

export function utcDay(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

let schemaReady: Promise<void> | null = null;

function ensureTables(db: D1Database): Promise<void> {
  if (!schemaReady) {
    schemaReady = db
      .batch([
        db.prepare(
          `CREATE TABLE IF NOT EXISTS metric_days (
             day TEXT NOT NULL,
             name TEXT NOT NULL,
             count INTEGER NOT NULL DEFAULT 0,
             PRIMARY KEY (day, name)
           )`
        ),
        db.prepare(
          `CREATE TABLE IF NOT EXISTS member_days (
             member_id INTEGER NOT NULL,
             day TEXT NOT NULL,
             desk_views INTEGER NOT NULL DEFAULT 0,
             actions INTEGER NOT NULL DEFAULT 0,
             first_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
             PRIMARY KEY (member_id, day)
           )`
        ),
      ])
      .then(() => undefined)
      // A failed CREATE must not wedge the isolate into never retrying.
      .catch((err) => {
        schemaReady = null;
        throw err;
      });
  }
  return schemaReady;
}

/** Increment a daily counter. Never throws — telemetry must not break a page. */
export async function count(db: D1Database, name: string, day = utcDay()): Promise<void> {
  return countBy(db, name, 1, day);
}

/** Add `by` to a daily counter in one statement. A batch of ingested items is one
 *  event with a size, not N events; incrementing it N times is N round trips for
 *  the same number. `by <= 0` writes nothing — a zero is the absence of a row. */
export async function countBy(db: D1Database, name: string, by: number, day = utcDay()): Promise<void> {
  if (!Number.isFinite(by) || by <= 0) return;
  try {
    await ensureTables(db);
    await db
      .prepare(
        `INSERT INTO metric_days (day, name, count) VALUES (?, ?, ?3)
         ON CONFLICT(day, name) DO UPDATE SET count = count + ?3`
      )
      .bind(day, name, Math.trunc(by))
      .run();
  } catch (err) {
    console.log(JSON.stringify({ level: "error", message: "metric count failed", name, detail: String(err) }));
  }
}

/** Increment several daily counters in one round trip. One request that is worth counting
 *  along two dimensions is still one event; issuing a sequential INSERT per name triples
 *  the D1 calls on a public route for no extra information. Duplicate and empty names are
 *  dropped, so a caller can build the list conditionally without guarding it. Same
 *  fail-quiet contract as `count` — telemetry must not break a page. */
export async function countEach(db: D1Database, names: string[], day = utcDay()): Promise<void> {
  const unique = [...new Set(names.filter((name) => name !== ""))];
  if (unique.length === 0) return;
  try {
    await ensureTables(db);
    await db.batch(
      unique.map((name) =>
        db
          .prepare(
            `INSERT INTO metric_days (day, name, count) VALUES (?, ?, 1)
             ON CONFLICT(day, name) DO UPDATE SET count = count + 1`
          )
          .bind(day, name)
      )
    );
  } catch (err) {
    console.log(
      JSON.stringify({ level: "error", message: "metric countEach failed", names: unique.join(","), detail: String(err) })
    );
  }
}

/** Did an `INSERT OR IGNORE` actually write a row?
 *
 *  D1 reports `meta.changes`, and 0 means the row already existed. This exists as a named
 *  function rather than as an inline `?? 1` because the fallback is the load-bearing half and
 *  it is unreachable in every environment this suite can run: only a D1 that stopped reporting
 *  `changes` would exercise it, and by then the counter it feeds is already being read.
 *
 *  The default is deliberately asymmetric. `follow_duplicate` is an axis whose meaning is
 *  "this accepted follow moved no total", so defaulting an unknown result to *duplicate* would
 *  report every follow as a repeat — including the first real one — and a day with one new
 *  follower would read exactly like a day with none. Defaulting to *new* can only ever
 *  under-report repeats, which is the direction that cannot manufacture an absence of demand.
 */
export function wroteNewRow(meta?: { changes?: number } | null): boolean {
  return (meta?.changes ?? 1) !== 0;
}

/** Record that a member was active today, and what kind of activity it was. */
export async function memberActive(
  db: D1Database,
  memberId: number,
  kind: "desk" | "action",
  day = utcDay()
): Promise<void> {
  const col = kind === "desk" ? "desk_views" : "actions";
  try {
    await ensureTables(db);
    await db
      .prepare(
        `INSERT INTO member_days (member_id, day, ${col}) VALUES (?, ?, 1)
         ON CONFLICT(member_id, day) DO UPDATE SET ${col} = ${col} + 1`
      )
      .bind(memberId, day)
      .run();
  } catch (err) {
    console.log(JSON.stringify({ level: "error", message: "member_days failed", detail: String(err) }));
  }
}

export interface MetricsSnapshot {
  generated_at: string;
  note: string;
  daily: Array<{ day: string; name: string; count: number }>;
  totals: Record<string, number>;
  retention: {
    members_total: number;
    members_ever_active: number;
    members_active_2plus_days: number;
    members_returned_after_first_day: number;
    active_last_7d: number;
    active_last_28d: number;
  };
}

/** Aggregate counts only. No emails, member ids, URLs or item content.
 *
 *  Counter *names* now carry two public labels — the handle in `feed_view:<handle>` and the
 *  campaign tag in `arrival:<tag>`. Both are already public by construction: a handle is the
 *  site's own URL slug and a tag is a string we put in a link ourselves. This docstring used
 *  to say "no handles", and that sentence stops being true the moment a feed is viewed, so it
 *  is corrected here rather than left to read as a guarantee. Nothing per-visitor is added. */
export async function snapshot(
  db: D1Database,
  handle: string = DEFAULT_OWNER_HANDLE
): Promise<MetricsSnapshot> {
  await ensureTables(db);
  const since = new Date(Date.now() - 60 * 86400_000).toISOString().slice(0, 10);

  // `stars` and `skips` below are every read row ever written, and every one of them so
  // far is the owner triaging their own desk. The daily `attention_*_owner` axis makes
  // that separable from the deploy that introduced it forward; `reads` carries member_id
  // already, so the same separation is available for the whole history at the cost of one
  // more sub-select — and unlike a counter, it cannot be zero because it did not exist yet.
  //
  // `owner_resolved` is reported because its absence is not a small caveat: if the owner
  // handle resolves to no human feed, `stars_owner` is absent and the daily axis never
  // fires, so the owner's own attention looks exactly like a stranger's arriving. A reader
  // must be able to tell "no non-owner has acted" from "we do not know who acted".
  const ownerId = await ownerMemberId(db, handle).catch(() => null);

  const { results: daily } = await db
    .prepare("SELECT day, name, count FROM metric_days WHERE day >= ? ORDER BY day DESC, name")
    .bind(since)
    .all<{ day: string; name: string; count: number }>();

  const totals = await db
    .prepare(
      `SELECT
         (SELECT COUNT(*) FROM waitlist) AS applications,
         (SELECT COUNT(*) FROM members) AS members,
         (SELECT COUNT(*) FROM creators WHERE kind = 'human') AS feeds_human,
         (SELECT COUNT(*) FROM creators WHERE kind = 'agent') AS feeds_agent,
         (SELECT COUNT(*) FROM items WHERE visibility = 'public') AS items_public,
         (SELECT COUNT(*) FROM items WHERE visibility = 'queued') AS items_queued,
         (SELECT COUNT(*) FROM reads WHERE action = 'star') AS stars,
         (SELECT COUNT(*) FROM reads WHERE action = 'skip') AS skips,
         (SELECT COUNT(*) FROM followers) AS followers,
         (SELECT COUNT(*) FROM connections) AS connections`
    )
    .first<Record<string, number>>();

  const ownerTotals =
    ownerId === null
      ? { owner_resolved: 0 }
      : {
          owner_resolved: 1,
          ...((await db
            .prepare(
              `SELECT
                 (SELECT COUNT(*) FROM reads WHERE action = 'star' AND member_id = ?1) AS stars_owner,
                 (SELECT COUNT(*) FROM reads WHERE action = 'skip' AND member_id = ?1) AS skips_owner`
            )
            .bind(ownerId)
            .first<Record<string, number>>()) ?? {}),
        };

  const day7 = utcDay(new Date(Date.now() - 7 * 86400_000));
  const day28 = utcDay(new Date(Date.now() - 28 * 86400_000));

  const ret = await db
    .prepare(
      `SELECT
         (SELECT COUNT(*) FROM members) AS members_total,
         (SELECT COUNT(DISTINCT member_id) FROM member_days) AS members_ever_active,
         (SELECT COUNT(*) FROM (SELECT member_id FROM member_days GROUP BY member_id HAVING COUNT(DISTINCT day) >= 2)) AS members_active_2plus_days,
         (SELECT COUNT(*) FROM (
            SELECT member_id FROM member_days GROUP BY member_id
            HAVING MAX(day) > MIN(day)
         )) AS members_returned_after_first_day,
         (SELECT COUNT(DISTINCT member_id) FROM member_days WHERE day >= ?1) AS active_last_7d,
         (SELECT COUNT(DISTINCT member_id) FROM member_days WHERE day >= ?2) AS active_last_28d`
    )
    .bind(day7, day28)
    .first<MetricsSnapshot["retention"]>();

  return {
    generated_at: new Date().toISOString(),
    note:
      "Aggregate counts only, sourced from live D1. Days are UTC. landing_view/landing_view_bot are split by a user-agent heuristic and are not verified human traffic. landing_render/landing_engage/application_start are reported by the landing page itself — script execution, first interaction and first form input, at most once per page load, same-origin only — so they are evidence that traffic behaved like a person, not proof of one, and they are forgeable by anyone willing to set one header. landing_render counts page loads whose script actually ran, which excludes the scanners, probes and preview fetchers that take the HTML and execute none of it; read against landing_view it is the share of UA-flagged human-shaped requests that were a rendering browser, and it is not a count of people — a JS-executing crawler that does not declare itself lands in the unsuffixed name alongside a visitor. application_invalid counts submits rejected by email validation; it is not part of application_submit. From 2026-09-06 both application_submit and application_invalid carry the same _bot user-agent split as every other counter here, so their unsuffixed names mean a submit that did not declare itself as automation; every value either name held before that date was written without the split, and both were 0 on every day of that period, so no earlier reading changes meaning. application_submit_offpage and application_invalid_offpage are an axis rather than a bucket: they count the subset of those submits that arrived without this site's Origin header, and they are never summed with the names above, whose total is unchanged. A browser sends Origin on every same-origin POST and a cross-origin JSON POST is refused before it arrives, so an offpage submit is evidence the request did not come from this page in a browser — it is not proof of automation and the submit is accepted and stored either way, because this route classifies and never refuses. From 2026-09-06 member_login and desk_view carry the same _bot user-agent split as every other counter here, plus member_login_unattended and desk_view_unattended as an axis rather than a bucket: they count the subset of those requests that arrived without Sec-Fetch-User: ?1, and they are never summed with the names above, whose totals are unchanged. A browser sends that header on a top-level navigation only when a person activated it — a click, a typed URL, a bookmark — and a prefetcher, mail security gateway, chat unfurler or plain HTTP client sends no user activation and often no Sec-Fetch header at all, so an unattended request is evidence no click caused it. It is not proof: a real click arriving without the header is counted unattended too, and the sign-in and the desk work identically either way, because these routes classify and never refuse. Read them against retention.members_ever_active, which is computed from member_days rows written by the desk: a sign-in link is delivered by email and fetched by machines before any person opens it, so that number can move from 0 to 1 without a person, and on the day it moves these names are what say whether it did. Every value member_login or desk_view held before that date was written without either discriminator. feed_view remains one site-wide count of every public feed view; feed_view:<handle> splits that same event by destination and does not replace it, so the two are not additive. arrival:<tag> counts feed views whose URL carried an allowlisted ?src= tag — a campaign label on the link, aggregated daily, with no cookie, no visitor identifier and no per-visitor state; an unrecognised tag is counted under no name at all, so absence of a tag means it was never allowlisted. feed_fetch/feed_fetch:<handle>/arrival_fetch:<tag> are the same three shapes for RSS fetches of /<handle>/rss.xml, and they are a different event from feed_view rather than part of it — a feed client polls on a schedule, so these count polls and not people, and no subscriber count can be derived from them without a per-visitor identifier this service does not keep. On that surface the _bot split separates a self-declaring crawler from a feed reader that does not self-declare, and neither bucket is a person; this service's own automated fetches declare themselves and so land in feed_fetch_bot, but only one feed is fetched on a schedule — /ava/rss.xml, twice daily by a first-party uptime checker — so feed_fetch_bot:ava is a liveness signal and feed_fetch_bot:<any other handle> records only first-party QA runs that were dispatched by hand; a zero day on those names means no run was dispatched, not that the counter failed. An earlier version of this note said scheduled headless QA fetched every feed; that was wrong about both the schedule and the fetcher and is withdrawn here. Unsuffixed feed_fetch was originally described here as a background rate of third-party fetchers; that description is withdrawn on its own first two days of data, in which every unsuffixed fetch carried a ?src= tag whose URL this service had itself published hours earlier — it is not established to be a background rate of anything. The set of tags that write is public source in a public repository, as is every route they apply to, so a tagged counter measures fetches of a tagged URL by anyone who assembled one and is not on its own evidence that a channel sent them; the tag qa is published in the same public places and submitted to no venue, and is kept as the control those readings are compared against. From 2026-09-07 attention_star and attention_skip carry the same _bot user-agent split as every other counter here, plus attention_star_owner and attention_skip_owner as an axis rather than a bucket: they count the subset of those events taken by the owner's own member, regardless of user-agent, and are never summed with the names above, whose totals are unchanged. Every attention event this service has ever recorded is the owner triaging their own desk, so the unsuffixed names alone cannot tell the first star by a real member — the one event that would count as activation — from the owner's ten-thousandth; attention_star moving while attention_star_owner does not is that star. Both daily names read 0 on every day before that date because they had never fired at all, so no earlier reading changes meaning. totals.stars_owner and totals.skips_owner are the same separation applied to the whole history rather than forward only: reads carries member_id already, so unlike a counter they are not zero merely because they did not exist yet, and stars minus stars_owner is every star ever taken by someone other than the owner. All four owner names depend on resolving one configured human handle to a member, so totals.owner_resolved reports whether that succeeded: when it is 0 the two totals are absent and the daily axis never fires, which makes the owner's own attention indistinguishable from a stranger's — read no non-owner activation from any of these names on a day owner_resolved is 0. From 2026-09-07 the follow action on a public feed page is counted, having previously written nothing at all: follow_submit/follow_submit_bot is an accepted follow and the two are its total, follow_submit:<handle> splits that same event by destination exactly as feed_view:<handle> splits a view and is not additive with the site-wide name, and follow_invalid/follow_invalid_bot counts a follow rejected by email validation and is not part of follow_submit. follow_submit_offpage and follow_invalid_offpage are an axis rather than a bucket, on the same definition as application_submit_offpage: the subset arriving without this site's Origin, counted across the unsuffixed and _bot names together and never summed into either, and the follow is stored either way because this route classifies and never refuses. follow_duplicate is also an axis and is the name that makes totals.followers readable: it counts accepted follows from an address that already followed that feed, so a day with follow_submit 3 and follow_duplicate 3 moved the follower total by zero, which without it is indistinguishable from a day on which nobody tried. When a write result does not report whether a row was created the follow is counted as new rather than as a repeat, so follow_duplicate can under-report repeats and can never invent one. follow_open is reported by the feed page itself when a visitor opens the follow dialog — the rung between feed_view and follow_submit, on the same reasoning landing_engage rests on, same-origin only and at most once per page load — and unlike follow_submit it is site-wide and carries no handle, so with more than one feed live it cannot be attributed to a destination and a ratio against feed_view:<handle> is only sound while one feed dominates views. Every one of these names reads 0 on every day before that date because none of them existed, and totals.followers has read 0 throughout, so no earlier reading changes meaning. Also from 2026-09-07, feed_render/feed_render_bot is landing_render's rung on a public feed page and is read the same way: it is reported by the feed page itself when its script runs, once per page load, same-origin only, and it counts loads whose script actually ran — which excludes the scanners, probes and preview fetchers that take the HTML and execute none of it. Read against feed_view it is the share of feed views that were a rendering browser at all; it is not a count of people, because a JS-executing crawler that does not declare itself lands in the unsuffixed name alongside a visitor, and it is forgeable on the same one header as every other page-reported name here. Like follow_open it is site-wide and carries no handle, so feed_render divided by feed_view is sound and feed_render divided by feed_view:&lt;handle&gt; is sound only while one feed dominates views. It is emitted only by a page carrying the follow button, which is every public feed page and no other surface — the studio page is served the same script and has no button — so it counts public feed page renders and never a studio one, and it is the denominator follow_open should be read against, both being gated on the same element. It reads 0 on every day before that date because it did not exist, which is a statement about the instrument and not about traffic. From 2026-09-11 follow_rss/follow_rss_bot is the fork under follow_open, and it exists because the two paths out of that dialog deliver different things. An accepted follow_submit writes a row into followers, a table nothing on this platform reads and that no code in src/ can deliver to — there is no mail provider, no sender and no digest job — so a follow by email is an expression of intent and not a subscription, and it is now labelled as one on the page rather than only here. The RSS URL is the only subscription on a feed page that does anything today, and follow_rss counts a click on the RSS option inside the follow dialog: page-reported, same-origin only, at most once per page load, site-wide and carrying no handle for the same reason follow_open does, and forgeable on the same one header as every other page-reported name here. Read it as exactly that click and as nothing further — it is not a subscriber, not a person, and nothing on this service observes whether a reader was ever added on the other side; feed_fetch:&lt;handle&gt; is where an actual poll would appear, and it cannot be attributed to this dialog. The separate RSS link in the feed page header is deliberately not wired to it, so follow_rss under-counts visitors who take RSS and can never over-count them. Its honest denominator is follow_open, which is gated on the same dialog, and follow_rss + follow_submit is not a total: a visitor can take both, or neither, and the dialog no longer presents them as alternatives of the same kind. It reads 0 on every day before that date because it did not exist, which is a statement about the instrument and not about traffic. Counters start at zero on the deploy that introduced them; absence of a day means no requests were counted that day. Gross cash is absent because no billing exists.",
    daily,
    totals: { ...(totals ?? {}), ...ownerTotals },
    retention: ret ?? {
      members_total: 0,
      members_ever_active: 0,
      members_active_2plus_days: 0,
      members_returned_after_first_day: 0,
      active_last_7d: 0,
      active_last_28d: 0,
    },
  };
}
