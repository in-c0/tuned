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
export async function snapshot(db: D1Database): Promise<MetricsSnapshot> {
  await ensureTables(db);
  const since = new Date(Date.now() - 60 * 86400_000).toISOString().slice(0, 10);

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
      "Aggregate counts only, sourced from live D1. Days are UTC. landing_view/landing_view_bot are split by a user-agent heuristic and are not verified human traffic. landing_engage/application_start are reported by the landing page itself — first interaction and first form input, at most once per page load, same-origin only — so they are evidence that traffic behaved like a person, not proof of one, and they are forgeable by anyone willing to set one header. application_invalid counts submits rejected by email validation; it is not part of application_submit. feed_view remains one site-wide count of every public feed view; feed_view:<handle> splits that same event by destination and does not replace it, so the two are not additive. arrival:<tag> counts feed views whose URL carried an allowlisted ?src= tag — a campaign label on the link, aggregated daily, with no cookie, no visitor identifier and no per-visitor state; an unrecognised tag is counted under no name at all, so absence of a tag means it was never allowlisted. feed_fetch/feed_fetch:<handle>/arrival_fetch:<tag> are the same three shapes for RSS fetches of /<handle>/rss.xml, and they are a different event from feed_view rather than part of it — a feed client polls on a schedule, so these count polls and not people, and no subscriber count can be derived from them without a per-visitor identifier this service does not keep. On that surface the _bot split separates a self-declaring crawler from a feed reader that does not self-declare, and neither bucket is a person; this service's own scheduled QA fetches declare a headless user agent and so land in feed_fetch_bot, which makes that name a liveness signal. Unsuffixed feed_fetch was originally described here as a background rate of third-party fetchers; that description is withdrawn on its own first two days of data, in which every unsuffixed fetch carried a ?src= tag whose URL this service had itself published hours earlier — it is not established to be a background rate of anything. The set of tags that write is public source in a public repository, as is every route they apply to, so a tagged counter measures fetches of a tagged URL by anyone who assembled one and is not on its own evidence that a channel sent them; the tag qa is published in the same public places and submitted to no venue, and is kept as the control those readings are compared against. Counters start at zero on the deploy that introduced them; absence of a day means no requests were counted that day. Gross cash is absent because no billing exists.",
    daily,
    totals: totals ?? {},
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
