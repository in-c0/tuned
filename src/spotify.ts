// Spotify ingestion: connect once, recently-played tracks flow into a PRIVATE QUEUE.
// Doctrine: auto-capture is never auto-publish. Items land as visibility='queued'
// and the member approves them (or flips auto_publish on for this connection).

export interface Connection {
  id: number;
  member_id: number;
  creator_id: number;
  provider: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  auto_publish: number;
  last_sync: string;
}

/** A refused call to Spotify, carrying enough to tell "we are locked out" from "it is having a bad day".
 *
 *  The distinction is operational, not cosmetic. A revoked refresh token or withdrawn consent
 *  (400 `invalid_grant`, 401, 403) can only be fixed by the member reconnecting — an owner action.
 *  A 429 or a 5xx fixes itself on the next half-hourly run. Collapsing both into "sync failed"
 *  is what makes a dead connection look like a quiet one. */
export class SpotifyError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly phase: "token" | "recently-played"
  ) {
    super(message);
    this.name = "SpotifyError";
  }

  /** True when only a human reconnecting can clear it. 429 is explicitly not auth: it is a wait. */
  get isAuth(): boolean {
    return this.status >= 400 && this.status < 500 && this.status !== 429;
  }
}

const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const SCOPES = "user-read-recently-played";

export function authorizeUrl(clientId: string, redirectUri: string, state: string): string {
  const u = new URL(AUTH_URL);
  u.searchParams.set("client_id", clientId);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("redirect_uri", redirectUri);
  u.searchParams.set("scope", SCOPES);
  u.searchParams.set("state", state);
  return u.toString();
}

async function tokenRequest(clientId: string, clientSecret: string, body: URLSearchParams): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
    },
    body,
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new SpotifyError(`spotify token ${res.status}: ${(await res.text()).slice(0, 200)}`, res.status, "token");
  return await res.json();
}

export async function exchangeCode(clientId: string, clientSecret: string, code: string, redirectUri: string) {
  return tokenRequest(clientId, clientSecret, new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  }));
}

/** Return a valid access token, refreshing (and persisting) if it has expired. */
export async function freshAccessToken(db: D1Database, clientId: string, clientSecret: string, conn: Connection): Promise<string> {
  if (new Date(conn.expires_at).getTime() > Date.now() + 60_000) return conn.access_token;
  const t = await tokenRequest(clientId, clientSecret, new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: conn.refresh_token,
  }));
  const expires = new Date(Date.now() + t.expires_in * 1000).toISOString();
  await db.prepare("UPDATE connections SET access_token = ?, expires_at = ?, refresh_token = COALESCE(?, refresh_token) WHERE id = ?")
    .bind(t.access_token, expires, t.refresh_token ?? null, conn.id)
    .run();
  return t.access_token;
}

export interface Play {
  url: string;
  title: string;
  description: string;
  image_url: string;
  played_at: string;
}

/** Recently-played tracks, newest first, played strictly after `since`. */
export async function recentlyPlayed(accessToken: string, since: string): Promise<Play[]> {
  const res = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
    headers: { authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new SpotifyError(`spotify recently-played ${res.status}`, res.status, "recently-played");
  const data = (await res.json()) as {
    items?: Array<{
      played_at: string;
      track?: {
        name?: string;
        external_urls?: { spotify?: string };
        artists?: Array<{ name: string }>;
        album?: { name?: string; images?: Array<{ url: string }> };
      };
    }>;
  };
  const sinceMs = since ? new Date(since).getTime() : 0;
  const out: Play[] = [];
  const seen = new Set<string>();
  for (const it of data.items ?? []) {
    const url = it.track?.external_urls?.spotify;
    if (!url || new Date(it.played_at).getTime() <= sinceMs || seen.has(url)) continue;
    seen.add(url);
    const artists = (it.track?.artists ?? []).map((a) => a.name).join(", ");
    out.push({
      url,
      title: it.track?.name ?? "Track",
      description: [artists, it.track?.album?.name].filter(Boolean).join(" · "),
      image_url: it.track?.album?.images?.[0]?.url ?? "",
      played_at: it.played_at,
    });
  }
  return out;
}

/** Pull new plays for one connection into the queue (or straight to public if auto_publish). */
export async function syncConnection(
  db: D1Database,
  clientId: string,
  clientSecret: string,
  conn: Connection
): Promise<{ added: number; newest: string | null }> {
  const token = await freshAccessToken(db, clientId, clientSecret, conn);
  const plays = await recentlyPlayed(token, conn.last_sync);
  if (!plays.length) return { added: 0, newest: null };
  const visibility = conn.auto_publish ? "public" : "queued";
  let added = 0;
  for (const p of plays.slice(0, 20)) {
    const dup = await db.prepare("SELECT id FROM items WHERE creator_id = ? AND url = ? AND created_at > ?")
      .bind(conn.creator_id, p.url, new Date(Date.now() - 24 * 3600_000).toISOString())
      .first();
    if (dup) continue;
    await db.prepare(
      "INSERT INTO items (creator_id, url, title, description, image_url, site_name, domain, kind, category, note, visibility, created_at) VALUES (?, ?, ?, ?, ?, 'Spotify', 'open.spotify.com', 'music', 'Music', '', ?, ?)"
    )
      .bind(conn.creator_id, p.url, p.title.slice(0, 300), p.description.slice(0, 500), p.image_url, visibility, p.played_at)
      .run();
    added++;
  }
  const newest = plays[0].played_at;
  await db.prepare("UPDATE connections SET last_sync = ? WHERE id = ?").bind(newest, conn.id).run();
  return { added, newest };
}
