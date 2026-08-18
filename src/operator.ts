// Agent operator control plane.
//
// The problem this replaces. Every creator studio is authorised by a capability token in
// the URL (`/studio/:token/...`). Handing one of those to an unattended executor means one
// owner authentication interruption per agent, forever, and a secret whose blast radius is
// "publish anything to that feed" living in a second system. That does not scale to
// repeated agent tests, which is the thing the loop actually needs.
//
// What this is instead. One stable, revocable, owner-scoped operator credential
// (`AGENT_OPERATOR_KEY`) that authorises a *narrow* set of lifecycle operations against
// agent feeds owned by one configured member. Per-agent studio tokens stay in D1 and are
// never returned by any endpoint here, so they never reach GitHub, a prompt, a log, an
// artifact or an issue comment.
//
// Bounded authority — the operator key CANNOT:
//   * touch a human feed, or any feed owned by another member;
//   * read or return a studio token, session token, member email, private charter text,
//     queued items or a member's skips;
//   * provision members, approve the private queue, or delete anything;
//   * hide or unhide any item it did not itself publish, or reverse a hide the owner made;
//   * run arbitrary SQL, proxy the admin API, or read any secret back;
//   * manage more than MAX_MANAGED_AGENTS agents.
//
// Fail-closed by construction: with the secret absent every route here answers 503 and
// production behaviour is unchanged. That is the state it ships in.

import { Hono, type Context } from "hono";
import { keyConfigured, keyMatches, keysCollide } from "./keys";
import { normalizeHandle } from "./handles";
import { CATEGORIES } from "./pages";

export type OperatorBindings = {
  DB: D1Database;
  ADMIN_KEY: string;
  AGENT_OPERATOR_KEY: string;
  AGENT_OPERATOR_OWNER: string;
};

/** Ceiling on managed agents. An operator that can mint feeds without limit is a spam
 *  surface; twelve is more agent feeds than the product has ever had running. */
export const MAX_MANAGED_AGENTS = 12;

const DEFAULT_OWNER_HANDLE = "ava";
const REMIT_MAX = 600;
const REMIT_MIN = 10;

/** The remit is public — it lands in a public repo file, a public workflow input and the
 *  agent's charter. Control characters are stripped so nothing can smuggle formatting into
 *  a log line; length is bounded so it stays a remit rather than a document. */
function cleanRemit(raw: string | undefined): string | null {
  const remit = (raw ?? "")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
  if (remit.length < REMIT_MIN || remit.length > REMIT_MAX) return null;
  return remit;
}

/** Who is calling, for the audit row. A label, never a credential. */
function principalOf(c: { req: { header: (name: string) => string | undefined } }): string {
  const raw = (c.req.header("x-operator-principal") ?? "github-actions").trim();
  const label = raw.replace(/[^a-zA-Z0-9 ._@\/-]/g, "").slice(0, 80);
  return label || "github-actions";
}

function newStudioToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

let schemaReady: Promise<void> | null = null;

/** Additive, self-applying tables — the same pattern the funnel telemetry uses, because
 *  the executor holds no D1 credentials and cannot run a migration. Nothing is altered or
 *  dropped: all three tables are new, and existing agents are NOT silently adopted into
 *  them. */
function ensureTables(db: D1Database): Promise<void> {
  if (!schemaReady) {
    schemaReady = db
      .batch([
        db.prepare(
          `CREATE TABLE IF NOT EXISTS operator_agents (
             creator_id INTEGER PRIMARY KEY,
             member_id INTEGER NOT NULL,
             handle TEXT NOT NULL,
             remit TEXT NOT NULL DEFAULT '',
             source TEXT NOT NULL,
             principal TEXT NOT NULL DEFAULT '',
             status TEXT NOT NULL DEFAULT 'active',
             created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
             updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
             disabled_at TEXT NOT NULL DEFAULT ''
           )`
        ),
        db.prepare(
          `CREATE TABLE IF NOT EXISTS operator_publications (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             creator_id INTEGER NOT NULL,
             idempotency_key TEXT NOT NULL,
             item_id INTEGER,
             principal TEXT NOT NULL DEFAULT '',
             created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
             UNIQUE(creator_id, idempotency_key)
           )`
        ),
        db.prepare(
          `CREATE TABLE IF NOT EXISTS operator_item_actions (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             creator_id INTEGER NOT NULL,
             item_id INTEGER NOT NULL,
             action TEXT NOT NULL,
             principal TEXT NOT NULL DEFAULT '',
             created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
           )`
        ),
      ])
      .then(() => undefined)
      .catch((err) => {
        schemaReady = null;
        throw err;
      });
  }
  return schemaReady;
}

interface ManagedRow {
  creator_id: number;
  handle: string;
  remit: string;
  source: string;
  principal: string;
  status: string;
  created_at: string;
  updated_at: string;
  disabled_at: string;
}

interface OwnedAgent {
  id: number;
  handle: string;
  kind: string;
  member_id: number | null;
}

type OperatorEnv = { Bindings: OperatorBindings; Variables: { ownerId: number; ownerHandle: string } };
type OperatorContext = Context<OperatorEnv>;

const operator = new Hono<OperatorEnv>();

// ---------- gate ----------
operator.use("*", async (c, next) => {
  if (!keyConfigured(c.env.AGENT_OPERATOR_KEY)) {
    return c.json({ ok: false, error: "operator key not configured" }, 503);
  }
  // The operator plane must be its own credential. If it has been handed the admin key,
  // its bounded authority is a fiction — refuse rather than quietly widen.
  if (await keysCollide(c.env.AGENT_OPERATOR_KEY, c.env.ADMIN_KEY)) {
    return c.json({ ok: false, error: "operator key must differ from admin key" }, 503);
  }
  const provided = c.req.header("x-operator-key") ?? "";
  if (!(await keyMatches(provided, c.env.AGENT_OPERATOR_KEY))) {
    return c.json({ ok: false, error: "unauthorized" }, 401);
  }

  await ensureTables(c.env.DB);

  // Owner scoping is resolved from a configured *human* handle, not from request input.
  // No workflow input can select a different owner, which is the property that keeps a
  // public repository's public workflow inputs from becoming an authority escalation.
  const ownerHandle = ((c.env.AGENT_OPERATOR_OWNER ?? "").trim().toLowerCase() || DEFAULT_OWNER_HANDLE);
  const row = await c.env.DB.prepare("SELECT member_id FROM creators WHERE handle = ? AND kind = 'human'")
    .bind(ownerHandle)
    .first<{ member_id: number | null }>();
  if (!row?.member_id) {
    return c.json({ ok: false, error: "operator owner not resolvable", owner_handle: ownerHandle }, 503);
  }
  c.set("ownerId", row.member_id);
  c.set("ownerHandle", ownerHandle);
  await next();
});

async function managedByHandle(db: D1Database, handle: string): Promise<ManagedRow | null> {
  return await db
    .prepare(
      `SELECT o.creator_id, o.handle, o.remit, o.source, o.principal, o.status,
              o.created_at, o.updated_at, o.disabled_at
         FROM operator_agents o WHERE o.handle = ?`
    )
    .bind(handle)
    .first<ManagedRow>();
}

async function ownedAgent(db: D1Database, handle: string): Promise<OwnedAgent | null> {
  return await db
    .prepare("SELECT id, handle, kind, member_id FROM creators WHERE handle = ?")
    .bind(handle)
    .first<OwnedAgent>();
}

async function activeCount(db: D1Database, ownerId: number): Promise<number> {
  const row = await db
    .prepare("SELECT COUNT(*) AS n FROM operator_agents WHERE member_id = ? AND status = 'active'")
    .bind(ownerId)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

/** Resolve a handle to a creator this operator is allowed to act on, or the reason not.
 *  Every mutation funnels through here, so "human feed", "someone else's agent" and
 *  "not adopted" are one decision made once. */
async function resolveManaged(
  db: D1Database,
  ownerId: number,
  handle: string
): Promise<{ agent: OwnedAgent; managed: ManagedRow } | { error: string; status: 403 | 404 }> {
  const agent = await ownedAgent(db, handle);
  if (!agent) return { error: "no such feed", status: 404 };
  if (agent.kind !== "agent") return { error: "not an agent feed", status: 403 };
  if (agent.member_id !== ownerId) return { error: "feed is not owned by the operator's member", status: 403 };
  const managed = await managedByHandle(db, handle);
  if (!managed) return { error: "agent is not operator-managed — adopt it first", status: 403 };
  if (managed.status !== "active") return { error: "agent is disabled for the operator", status: 403 };
  return { agent, managed };
}

// ---------- read-only: list managed agents and their liveness ----------
//
// This is the replacement for the per-agent read-only preflight: it answers "is the
// credential live, which agents does it manage, and is any of them actually publishing"
// without a studio token and without disclosing a charter, a skip or a member.
operator.get("/agents", async (c) => {
  const ownerId = c.get("ownerId");
  const { results: managed } = await c.env.DB.prepare(
    `SELECT o.creator_id, o.handle, o.remit, o.source, o.principal, o.status,
            o.created_at, o.updated_at, o.disabled_at,
            (SELECT COUNT(*) FROM items i WHERE i.creator_id = o.creator_id AND i.visibility = 'public') AS items_public,
            (SELECT MAX(i.created_at) FROM items i WHERE i.creator_id = o.creator_id AND i.visibility = 'public') AS last_public_item_at,
            (SELECT COUNT(*) FROM operator_publications p WHERE p.creator_id = o.creator_id) AS operator_publications,
            (SELECT COUNT(*) FROM operator_publications p JOIN items i ON i.id = p.item_id
              WHERE p.creator_id = o.creator_id AND i.visibility <> 'public') AS operator_publications_hidden
       FROM operator_agents o WHERE o.member_id = ? ORDER BY o.handle`
  )
    .bind(ownerId)
    .all<
      ManagedRow & {
        items_public: number;
        last_public_item_at: string | null;
        operator_publications: number;
        operator_publications_hidden: number;
      }
    >();

  // Adoptable candidates: agent feeds this member already owns that are not yet managed.
  // Handles are public (they are URLs); nothing else about them is returned.
  const { results: adoptable } = await c.env.DB.prepare(
    `SELECT handle FROM creators
      WHERE member_id = ? AND kind = 'agent'
        AND id NOT IN (SELECT creator_id FROM operator_agents) ORDER BY handle`
  )
    .bind(ownerId)
    .all<{ handle: string }>();

  return c.json({
    ok: true,
    owner_handle: c.get("ownerHandle"),
    limit: MAX_MANAGED_AGENTS,
    active: managed.filter((m) => m.status === "active").length,
    managed: managed.map((m) => ({
      handle: m.handle,
      status: m.status,
      source: m.source,
      principal: m.principal,
      remit: m.remit,
      created_at: m.created_at,
      updated_at: m.updated_at,
      disabled_at: m.disabled_at,
      items_public: m.items_public,
      last_public_item_at: m.last_public_item_at ?? "",
      operator_publications: m.operator_publications,
      operator_publications_hidden: m.operator_publications_hidden,
    })),
    adoptable: adoptable.map((a) => a.handle),
  });
});

// ---------- adopt one existing owned agent ----------
operator.post("/agents/adopt", async (c) => {
  const ownerId = c.get("ownerId");
  const body = await c.req.json<{ handle?: string; remit?: string }>().catch(() => ({}) as Record<string, string>);
  const handle = normalizeHandle(body.handle);
  if (!handle) return c.json({ ok: false, error: "invalid handle" }, 400);
  const remit = cleanRemit(body.remit);
  if (!remit) return c.json({ ok: false, error: `remit must be ${REMIT_MIN}–${REMIT_MAX} characters` }, 400);

  const agent = await ownedAgent(c.env.DB, handle);
  if (!agent) return c.json({ ok: false, error: "no such feed" }, 404);
  if (agent.kind !== "agent") return c.json({ ok: false, error: "not an agent feed" }, 403);
  if (agent.member_id !== ownerId) return c.json({ ok: false, error: "feed is not owned by the operator's member" }, 403);

  const existing = await managedByHandle(c.env.DB, handle);
  if (existing?.status === "active") {
    return c.json({ ok: true, handle, status: "active", adopted: false, note: "already managed" });
  }
  if ((await activeCount(c.env.DB, ownerId)) >= MAX_MANAGED_AGENTS) {
    return c.json({ ok: false, error: `operator limit reached (${MAX_MANAGED_AGENTS} active agents)` }, 409);
  }

  const principal = principalOf(c);
  if (existing) {
    // Re-adoption of a disabled agent. Reversible by design — disable is a revocation of
    // operator authority, not a deletion, so restoring it is one attributable row update.
    await c.env.DB.prepare(
      `UPDATE operator_agents SET status = 'active', remit = ?, principal = ?, disabled_at = '',
              updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE creator_id = ?`
    )
      .bind(remit, principal, agent.id)
      .run();
  } else {
    await c.env.DB.prepare(
      `INSERT INTO operator_agents (creator_id, member_id, handle, remit, source, principal)
       VALUES (?, ?, ?, ?, 'adopted', ?)`
    )
      .bind(agent.id, ownerId, handle, remit, principal)
      .run();
  }
  return c.json({ ok: true, handle, status: "active", adopted: true, source: "adopted" }, 201);
});

// ---------- create a new owned agent from a public remit ----------
operator.post("/agents", async (c) => {
  const ownerId = c.get("ownerId");
  const body = await c.req
    .json<{ handle?: string; name?: string; remit?: string; bio?: string; accent?: string }>()
    .catch(() => ({}) as Record<string, string>);
  const handle = normalizeHandle(body.handle);
  if (!handle) return c.json({ ok: false, error: "invalid handle" }, 400);
  const name = (body.name ?? "").trim().slice(0, 80);
  if (!name) return c.json({ ok: false, error: "name required" }, 400);
  const remit = cleanRemit(body.remit);
  if (!remit) return c.json({ ok: false, error: `remit must be ${REMIT_MIN}–${REMIT_MAX} characters` }, 400);
  if ((await activeCount(c.env.DB, ownerId)) >= MAX_MANAGED_AGENTS) {
    return c.json({ ok: false, error: `operator limit reached (${MAX_MANAGED_AGENTS} active agents)` }, 409);
  }
  if (await ownedAgent(c.env.DB, handle)) return c.json({ ok: false, error: "handle already taken" }, 409);

  // The studio token is minted here and never leaves D1. No response, log, workflow
  // summary or audit row carries it; the operator itself has no way to read it back.
  const token = newStudioToken();
  const accent = /^#[0-9a-fA-F]{6}$/.test(body.accent ?? "") ? (body.accent as string) : "#7c6cff";
  try {
    await c.env.DB.prepare(
      `INSERT INTO creators (handle, name, bio, avatar_url, accent, token, kind, member_id, charter)
       VALUES (?, ?, ?, '', ?, ?, 'agent', ?, ?)`
    )
      .bind(handle, name, (body.bio ?? "").slice(0, 280), accent, token, ownerId, remit)
      .run();
  } catch {
    return c.json({ ok: false, error: "handle already taken" }, 409);
  }
  const created = await ownedAgent(c.env.DB, handle);
  await c.env.DB.prepare(
    `INSERT INTO operator_agents (creator_id, member_id, handle, remit, source, principal)
     VALUES (?, ?, ?, ?, 'created', ?)`
  )
    .bind(created!.id, ownerId, handle, remit, principalOf(c))
    .run();

  const origin = new URL(c.req.url).origin;
  return c.json({ ok: true, handle, status: "active", source: "created", public_url: `${origin}/${handle}` }, 201);
});

// ---------- publish one source-linked find, idempotently ----------
operator.post("/agents/:handle/items", async (c) => {
  const ownerId = c.get("ownerId");
  const handle = normalizeHandle(c.req.param("handle"));
  if (!handle) return c.json({ ok: false, error: "invalid handle" }, 400);
  const resolved = await resolveManaged(c.env.DB, ownerId, handle);
  if ("error" in resolved) return c.json({ ok: false, error: resolved.error }, resolved.status);

  const b = await c.req
    .json<{
      url?: string;
      title?: string;
      description?: string;
      category?: string;
      why?: string;
      idempotency_key?: string;
    }>()
    .catch(() => ({}) as Record<string, string>);

  const idem = (b.idempotency_key ?? "").trim();
  if (idem.length < 8 || idem.length > 200) {
    return c.json({ ok: false, error: "idempotency_key must be 8–200 characters" }, 400);
  }
  // A length limit is a refusal, not a silent edit. `why` is the agent's public account of
  // why it selected this source, and slicing it at 280 publishes a sentence that stops
  // mid-word under the agent's name while telling the caller it succeeded — the same class
  // of defect as an instrument that reports success for a page it never opened. A truncated
  // url is worse: a link that resolves nowhere. Refuse, so the operator shortens it and
  // re-sends, and nothing half-written ever reaches a reader.
  const bounds = [
    ["url", b.url, 2000],
    ["title", b.title, 300],
    ["description", b.description, 500],
    ["why", b.why, 280],
  ] as const;
  const overLong = bounds.find(([, value, max]) => (value ?? "").trim().length > max);
  if (overLong) {
    return c.json({ ok: false, error: `${overLong[0]} must be ${overLong[2]} characters or fewer` }, 400);
  }

  const title = (b.title ?? "").trim();
  if (!title) return c.json({ ok: false, error: "title required" }, 400);

  let url: URL;
  try {
    url = new URL((b.url ?? "").trim());
  } catch {
    return c.json({ ok: false, error: "invalid url" }, 400);
  }
  // A find is a link to a source someone else published. Anything that is not plain web
  // fetchable — data:, javascript:, file: — is not a source.
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return c.json({ ok: false, error: "url must be http(s)" }, 400);
  }
  // Parsing normalises, and normalising can lengthen — percent-encoding a raw character
  // costs two bytes each time. Check the string that actually gets stored, not the one
  // that was sent.
  const href = url.toString();
  if (href.length > 2000) {
    return c.json({ ok: false, error: "url must be 2000 characters or fewer" }, 400);
  }

  const category = CATEGORIES.includes(b.category ?? "") ? (b.category as string) : "Misc";

  // Claim the idempotency key BEFORE writing the item. The UNIQUE constraint is the
  // replay guard: a retried or duplicated dispatch loses the race here and publishes
  // nothing, rather than racing on a SELECT that has already been read.
  let claimed = false;
  try {
    await c.env.DB.prepare(
      "INSERT INTO operator_publications (creator_id, idempotency_key, principal) VALUES (?, ?, ?)"
    )
      .bind(resolved.agent.id, idem, principalOf(c))
      .run();
    claimed = true;
  } catch {
    const prior = await c.env.DB.prepare(
      "SELECT item_id FROM operator_publications WHERE creator_id = ? AND idempotency_key = ?"
    )
      .bind(resolved.agent.id, idem)
      .first<{ item_id: number | null }>();
    return c.json({ ok: true, handle, duplicate: true, item_id: prior?.item_id ?? null, published: false });
  }

  try {
    const inserted = await c.env.DB.prepare(
      `INSERT INTO items (creator_id, url, title, description, image_url, site_name, domain, kind, category, note, visibility)
       VALUES (?, ?, ?, ?, '', '', ?, 'link', ?, ?, 'public') RETURNING id`
    )
      .bind(
        resolved.agent.id,
        href,
        title,
        (b.description ?? "").trim(),
        url.hostname.replace(/^www\./, "").slice(0, 200),
        category,
        // The public "why selected" line. Provenance doctrine: the agent observed and
        // selected this, and says so in its own words on the item. Bounded above, never
        // trimmed to fit here.
        (b.why ?? "").trim()
      )
      .first<{ id: number }>();
    await c.env.DB.prepare("UPDATE operator_publications SET item_id = ? WHERE creator_id = ? AND idempotency_key = ?")
      .bind(inserted!.id, resolved.agent.id, idem)
      .run();
    return c.json({ ok: true, handle, published: true, duplicate: false, item_id: inserted!.id }, 201);
  } catch (err) {
    // Release the claim so an operator retry is not permanently swallowed by a failed write.
    if (claimed) {
      await c.env.DB.prepare("DELETE FROM operator_publications WHERE creator_id = ? AND idempotency_key = ? AND item_id IS NULL")
        .bind(resolved.agent.id, idem)
        .run()
        .catch(() => undefined);
    }
    console.log(JSON.stringify({ level: "error", message: "operator publish failed", handle, detail: String(err) }));
    return c.json({ ok: false, error: "publish failed" }, 500);
  }
});

// ---------- disable / revoke operator authority over one agent ----------
//
// This revokes the OPERATOR's authority. It deliberately does not rotate the creator's
// studio token or touch a single item: the feed, its history and the owner's own
// capability URL are untouched, so nothing here is destructive and re-adoption restores
// the previous state exactly.
operator.post("/agents/:handle/disable", async (c) => {
  const ownerId = c.get("ownerId");
  const handle = normalizeHandle(c.req.param("handle"));
  if (!handle) return c.json({ ok: false, error: "invalid handle" }, 400);
  const managed = await managedByHandle(c.env.DB, handle);
  if (!managed) return c.json({ ok: false, error: "agent is not operator-managed" }, 404);
  const agent = await ownedAgent(c.env.DB, handle);
  if (!agent || agent.member_id !== ownerId) {
    return c.json({ ok: false, error: "feed is not owned by the operator's member" }, 403);
  }
  if (managed.status !== "active") return c.json({ ok: true, handle, status: "disabled", changed: false });
  await c.env.DB.prepare(
    `UPDATE operator_agents SET status = 'disabled', principal = ?,
            disabled_at = strftime('%Y-%m-%dT%H:%M:%fZ','now'),
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')
      WHERE creator_id = ?`
  )
    .bind(principalOf(c), agent.id)
    .run();
  return c.json({ ok: true, handle, status: "disabled", changed: true });
});

// ---------- retract / restore one operator-published item ----------
//
// The undo `publish` never had. Until this route existed the plane could put an item in
// front of readers and had no way to take it back: `disable` revokes the operator's
// authority over a *feed* and deliberately touches no item, so a publication was the one
// thing this executor could do to production that it could not itself reverse. The
// operating record's deployment gates require a rollback path to exist for every change,
// and a publication was shipping without one.
//
// This is not a delete. `visibility='hidden'` is exactly the veto the owner already has in
// their studio: the row, its history and its audit trail stay, and `restore` puts it back
// with its original `created_at`, so a retract/restore round trip is a no-op on the feed.
//
// Two bounds that keep the authority as narrow as it was before:
//
//   * **Only items this plane published.** The item must carry an `operator_publications`
//     row for this creator. An agent's own earlier history, and anything a human put
//     there, is not the operator's to veto — a retract that could reach those would be a
//     quiet widening of the credential from "publish one find" to "edit the feed".
//   * **`restore` undoes only the operator's own retraction.** If the owner hid an item
//     from their studio, the last operator action on it is not `retract`, and restore
//     refuses. A human veto is not something a machine gets to reverse; that is the
//     doctrine applied to the loop's own control plane.

type ItemAction = "retract" | "restore";

interface OperatorItem {
  id: number;
  visibility: string;
}

/** The item, only if this operator published it onto this feed. One join answers both
 *  "does it exist here" and "was it ours", so there is no path where the second is
 *  assumed from the first. */
async function operatorPublishedItem(db: D1Database, creatorId: number, itemId: number): Promise<OperatorItem | null> {
  return await db
    .prepare(
      `SELECT i.id, i.visibility FROM items i
         JOIN operator_publications p ON p.item_id = i.id AND p.creator_id = i.creator_id
        WHERE i.id = ? AND i.creator_id = ?`
    )
    .bind(itemId, creatorId)
    .first<OperatorItem>();
}

/** The last thing this plane did to the item, or "" if it has never touched it. This is
 *  what separates "the operator hid it" from "the owner hid it". */
async function lastItemAction(db: D1Database, creatorId: number, itemId: number): Promise<string> {
  const row = await db
    .prepare("SELECT action FROM operator_item_actions WHERE creator_id = ? AND item_id = ? ORDER BY id DESC LIMIT 1")
    .bind(creatorId, itemId)
    .first<{ action: string }>();
  return row?.action ?? "";
}

function itemRoute(action: ItemAction) {
  const from = action === "retract" ? "public" : "hidden";
  const to = action === "retract" ? "hidden" : "public";

  return async (c: OperatorContext): Promise<Response> => {
    const ownerId = c.get("ownerId");
    const handle = normalizeHandle(c.req.param("handle"));
    if (!handle) return c.json({ ok: false, error: "invalid handle" }, 400);
    const itemId = Number(c.req.param("itemId"));
    if (!Number.isSafeInteger(itemId) || itemId <= 0) return c.json({ ok: false, error: "invalid item id" }, 400);

    const resolved = await resolveManaged(c.env.DB, ownerId, handle);
    if ("error" in resolved) return c.json({ ok: false, error: resolved.error }, resolved.status);

    const item = await operatorPublishedItem(c.env.DB, resolved.agent.id, itemId);
    if (!item) {
      return c.json({ ok: false, error: "no such item, or it was not published by this operator" }, 404);
    }

    // Already where it is being asked to go. Idempotent, so a retried dispatch is safe.
    if (item.visibility === to) {
      return c.json({ ok: true, handle, item_id: itemId, action, changed: false, visibility: to });
    }
    if (item.visibility !== from) {
      return c.json({ ok: false, error: `item is '${item.visibility}', not '${from}'`, item_id: itemId }, 409);
    }
    if (action === "restore" && (await lastItemAction(c.env.DB, resolved.agent.id, itemId)) !== "retract") {
      return c.json(
        { ok: false, error: "item was not hidden by this operator — a human veto is not the operator's to reverse", item_id: itemId },
        409
      );
    }

    // Guarded on the visibility it was read at, so two concurrent dispatches cannot both
    // report a change. `created_at` is untouched: a restored item returns to its own place
    // in the feed rather than to the top of it.
    const updated = await c.env.DB.prepare("UPDATE items SET visibility = ? WHERE id = ? AND creator_id = ? AND visibility = ?")
      .bind(to, itemId, resolved.agent.id, from)
      .run();
    if (!updated.meta.changes) {
      return c.json({ ok: false, error: "item changed underneath this request", item_id: itemId }, 409);
    }
    await c.env.DB.prepare(
      "INSERT INTO operator_item_actions (creator_id, item_id, action, principal) VALUES (?, ?, ?, ?)"
    )
      .bind(resolved.agent.id, itemId, action, principalOf(c))
      .run();

    return c.json({ ok: true, handle, item_id: itemId, action, changed: true, visibility: to });
  };
}

operator.post("/agents/:handle/items/:itemId/retract", itemRoute("retract"));
operator.post("/agents/:handle/items/:itemId/restore", itemRoute("restore"));

export default operator;
