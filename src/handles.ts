// Handle rules, shared by every surface that can mint a feed. A handle is a public URL
// slug at the site root, so anything that could shadow a real route is refused.

export const RESERVED_HANDLES = new Set([
  "api",
  "studio",
  "favicon.ico",
  "robots.txt",
  "rss.xml",
  "sitemap.xml",
  "terms",
  "privacy",
  "waitlist",
  "home",
  "login",
  "logout",
  "enter",
  "today",
  "read",
  "queue",
  "connect",
]);

/** Normalised handle, or null when it is unusable. Same rule the admin creator API has
 *  always applied: 2–31 chars, lowercase alphanumeric plus dashes, not a reserved route. */
export function normalizeHandle(raw: string | undefined): string | null {
  const handle = (raw ?? "").toLowerCase().trim();
  if (!/^[a-z0-9][a-z0-9-]{1,30}$/.test(handle)) return null;
  if (RESERVED_HANDLES.has(handle)) return null;
  return handle;
}

// ---------- who "we" are ----------
//
// One definition of the owner, used by two things that must never disagree: the operator
// control plane, which scopes every managed agent to the owner's member, and the attention
// counters, which have to say whether an action was the first party's own. Two copies of
// this literal would be two answers to "whose actions are ours", and a counter built to
// separate the owner from a real member is worthless the moment it can drift from the
// scoping it is supposed to mirror.

/** Fallback owner handle when `AGENT_OPERATOR_OWNER` is unset. A public var, not a secret. */
export const DEFAULT_OWNER_HANDLE = "ava";

export function ownerHandle(raw: string | undefined): string {
  return (raw ?? "").trim().toLowerCase() || DEFAULT_OWNER_HANDLE;
}

/** The owner's member id, or `null` when that handle resolves to no human feed with a
 *  member attached.
 *
 *  Null rather than a fallback id, and this is the whole safety property: guessing an
 *  owner attributes somebody else's actions to the first party, and *failing* to resolve
 *  one makes the owner's own actions look like a stranger's. Both are worse than an
 *  absent reading, so callers are expected to report that they could not resolve it
 *  rather than to carry on with a number that means nothing. */
export async function ownerMemberId(db: D1Database, handle: string): Promise<number | null> {
  const row = await db
    .prepare("SELECT member_id FROM creators WHERE handle = ? AND kind = 'human'")
    .bind(handle)
    .first<{ member_id: number | null }>();
  return row?.member_id ?? null;
}
