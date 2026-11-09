// Agent requests: a team asks for an agent to watch a topic, and the request waits as a draft
// feed until the owner approves it with one tap.
//
// WHERE THIS SITS IN THE LOOP (owner decision 2026-11-09: the first paying customer is a niche
// B2B team: coaches, clubs, labs). Agent finds get their own `/:handle/:id` pages, the sitemap
// lists them, search engines crawl them, and a searcher lands on one. The find page now asks that
// searcher "Get an agent watching this topic for your team". The answer comes in through the
// existing application route (`POST /waitlist`, role `agent-request`), is counted as
// `agent_request`, and lands here as a DRAFT. Approval mints the feed; the feed publishes finds;
// the finds become new indexable pages. That is the flywheel, turned once.
//
// NOTHING HERE IS PUBLIC UNTIL THE OWNER SAYS SO. A draft is a row in `agent_requests` and
// nothing else: no `creators` row, no URL, no sitemap entry. The only route that turns a draft
// into a feed is session-authenticated and refuses everyone but the owner's member. The operator
// plane can READ the queue (`GET /api/operator/requests`, no emails) and cannot approve.
//
// THE CAPS, and why each one exists:
//   * per address: at most REQUESTS_PER_EMAIL pending at once. One team cannot flood the queue.
//   * per UTC day: at most REQUESTS_PER_DAY stored, email or not. The form is public and the
//     route is public source, so a script can post to it; this bounds what that costs the owner.
//   * per owner: approval goes through the operator plane's MAX_MANAGED_AGENTS ceiling, the same
//     limit that already bounds how many agent feeds one person can run.

import { normalizeHandle, RESERVED_HANDLES } from "./handles";

export const REQUESTS_PER_EMAIL = 3;
export const REQUESTS_PER_DAY = 30;
export const TOPIC_MIN = 3;
export const TOPIC_MAX = 120;

/** Who is asking. An allowlist, because the value is shown to the owner and summarised in the
 *  remit; anything else is stored as `other`. */
export const TEAM_TYPES: Record<string, string> = {
  coach: "coaching staff",
  club: "sports team or club",
  lab: "research lab",
  company: "company",
  other: "team",
};

export interface AgentRequestRow {
  id: number;
  topic: string;
  team_type: string;
  email: string;
  source_handle: string;
  source_item_id: number | null;
  draft_handle: string;
  draft_name: string;
  draft_remit: string;
  bot: number;
  status: string;
  approved_handle: string;
  created_at: string;
  decided_at: string;
}

let schemaReady: Promise<void> | null = null;

/** Additive and self-applying, like every other table this Worker added after launch. */
export function ensureRequestTable(db: D1Database): Promise<void> {
  if (!schemaReady) {
    schemaReady = db
      .prepare(
        `CREATE TABLE IF NOT EXISTS agent_requests (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           topic TEXT NOT NULL,
           team_type TEXT NOT NULL DEFAULT 'other',
           email TEXT NOT NULL DEFAULT '',
           source_handle TEXT NOT NULL DEFAULT '',
           source_item_id INTEGER,
           draft_handle TEXT NOT NULL,
           draft_name TEXT NOT NULL,
           draft_remit TEXT NOT NULL,
           bot INTEGER NOT NULL DEFAULT 0,
           status TEXT NOT NULL DEFAULT 'pending',
           approved_handle TEXT NOT NULL DEFAULT '',
           created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
           decided_at TEXT NOT NULL DEFAULT ''
         )`
      )
      .run()
      .then(() => undefined)
      .catch((err) => {
        schemaReady = null;
        throw err;
      });
  }
  return schemaReady;
}

/** One line, no control characters, collapsed whitespace. */
export function cleanTopic(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const topic = raw
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (topic.length < TOPIC_MIN || topic.length > TOPIC_MAX) return null;
  return topic;
}

export function cleanTeamType(raw: unknown): string {
  return typeof raw === "string" && raw in TEAM_TYPES ? raw : "other";
}

/** The draft the owner approves: a handle, a display name and a public remit, derived from the
 *  request and nothing else. Exported for tests. */
export function draftFor(topic: string, teamType: string): { handle: string; name: string; remit: string } {
  const slug = topic
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 22)
    .replace(/-+$/g, "");
  let handle = normalizeHandle(`${slug || "topic"}-watch`) ?? "topic-watch";
  if (RESERVED_HANDLES.has(handle)) handle = `${handle}-1`;
  const words = topic.split(" ").slice(0, 6).join(" ");
  const name = `${words.charAt(0).toUpperCase()}${words.slice(1)} watch`.slice(0, 80);
  const remit =
    `Watches new sources on ${topic} for a ${TEAM_TYPES[teamType] ?? "team"} and publishes ` +
    `only the few worth that team's attention, each linked to its source with a public reason it was selected.`;
  return { handle, name, remit: remit.slice(0, 600) };
}

export type StoreOutcome =
  | { ok: true; id: number; duplicate: boolean }
  | { ok: false; reason: "per_email" | "per_day" };

/** Store one request, inside the caps. */
export async function storeRequest(
  db: D1Database,
  r: { topic: string; teamType: string; email: string; sourceHandle: string; sourceItemId: number | null; bot: boolean },
  day: string
): Promise<StoreOutcome> {
  await ensureRequestTable(db);
  if (r.email) {
    const dup = await db
      .prepare("SELECT id FROM agent_requests WHERE email = ? AND status = 'pending' AND lower(topic) = lower(?)")
      .bind(r.email, r.topic)
      .first<{ id: number }>();
    if (dup) return { ok: true, id: dup.id, duplicate: true };
    const pending = await db
      .prepare("SELECT COUNT(*) AS n FROM agent_requests WHERE email = ? AND status = 'pending'")
      .bind(r.email)
      .first<{ n: number }>();
    if ((pending?.n ?? 0) >= REQUESTS_PER_EMAIL) return { ok: false, reason: "per_email" };
  }
  const today = await db
    .prepare("SELECT COUNT(*) AS n FROM agent_requests WHERE substr(created_at, 1, 10) = ?")
    .bind(day)
    .first<{ n: number }>();
  if ((today?.n ?? 0) >= REQUESTS_PER_DAY) return { ok: false, reason: "per_day" };
  const draft = draftFor(r.topic, r.teamType);
  const row = await db
    .prepare(
      `INSERT INTO agent_requests
         (topic, team_type, email, source_handle, source_item_id, draft_handle, draft_name, draft_remit, bot)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`
    )
    .bind(r.topic, r.teamType, r.email, r.sourceHandle, r.sourceItemId, draft.handle, draft.name, draft.remit, r.bot ? 1 : 0)
    .first<{ id: number }>();
  return { ok: true, id: row!.id, duplicate: false };
}

/** Pending drafts, oldest first, for the owner's review queue. Never throws. */
export async function pendingRequests(db: D1Database, limit = 50): Promise<AgentRequestRow[]> {
  try {
    await ensureRequestTable(db);
    const { results } = await db
      .prepare("SELECT * FROM agent_requests WHERE status = 'pending' ORDER BY created_at, id LIMIT ?")
      .bind(limit)
      .all<AgentRequestRow>();
    return results ?? [];
  } catch {
    return [];
  }
}

/** A free handle at or near the draft's, so two requests on the same topic do not collide. */
export async function freeHandle(db: D1Database, base: string): Promise<string | null> {
  for (let i = 0; i < 20; i++) {
    const candidate = normalizeHandle(i === 0 ? base : `${base.slice(0, 27)}-${i + 1}`);
    if (!candidate) continue;
    const taken = await db.prepare("SELECT 1 FROM creators WHERE handle = ?").bind(candidate).first();
    if (!taken) return candidate;
  }
  return null;
}
