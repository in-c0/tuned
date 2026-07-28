import { Hono } from "hono";
import { resolveLink } from "./meta";
import { publicPage, studioPage, landingPage, rssFeed, CATEGORIES, type Creator, type Item } from "./pages";

type Bindings = { DB: D1Database; ADMIN_KEY: string };
const app = new Hono<{ Bindings: Bindings }>();

const RESERVED_HANDLES = new Set(["api", "studio", "favicon.ico", "robots.txt", "rss.xml"]);

function newToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function timingSafeEq(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  return crypto.subtle.timingSafeEqual(ha, hb);
}

async function creatorByToken(db: D1Database, token: string): Promise<Creator | null> {
  return await db.prepare("SELECT * FROM creators WHERE token = ?").bind(token).first<Creator>();
}

async function itemsFor(db: D1Database, creatorId: number, publicOnly: boolean): Promise<Item[]> {
  const sql = publicOnly
    ? "SELECT * FROM items WHERE creator_id = ? AND visibility = 'public' ORDER BY created_at DESC LIMIT 300"
    : "SELECT * FROM items WHERE creator_id = ? ORDER BY created_at DESC LIMIT 300";
  const { results } = await db.prepare(sql).bind(creatorId).all<Item>();
  return results;
}

// ---------- landing ----------
app.get("/", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT id, handle, name, bio, avatar_url, accent, created_at FROM creators ORDER BY created_at").all<Creator>();
  return c.html(landingPage(results));
});

// ---------- admin: create a creator ----------
app.post("/api/creators", async (c) => {
  const key = c.req.header("x-admin-key") ?? "";
  if (!c.env.ADMIN_KEY || !(await timingSafeEq(key, c.env.ADMIN_KEY))) return c.json({ error: "unauthorized" }, 401);
  const body = await c.req.json<{ handle?: string; name?: string; bio?: string; avatar_url?: string; accent?: string }>();
  const handle = (body.handle ?? "").toLowerCase().trim();
  if (!/^[a-z0-9][a-z0-9-]{1,30}$/.test(handle) || RESERVED_HANDLES.has(handle)) return c.json({ error: "invalid handle" }, 400);
  if (!body.name?.trim()) return c.json({ error: "name required" }, 400);
  const token = newToken();
  try {
    await c.env.DB.prepare("INSERT INTO creators (handle, name, bio, avatar_url, accent, token) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(handle, body.name.trim(), body.bio ?? "", body.avatar_url ?? "", body.accent ?? "#7c6cff", token)
      .run();
  } catch {
    return c.json({ error: "handle already taken" }, 409);
  }
  const origin = new URL(c.req.url).origin;
  return c.json({ public_url: `${origin}/${handle}`, studio_url: `${origin}/studio/${token}` }, 201);
});

// ---------- studio ----------
app.get("/studio/:token", async (c) => {
  const creator = await creatorByToken(c.env.DB, c.req.param("token"));
  if (!creator) return c.text("Not found", 404);
  const items = await itemsFor(c.env.DB, creator.id, false);
  return c.html(studioPage(creator, items));
});

app.post("/studio/:token/preview", async (c) => {
  const creator = await creatorByToken(c.env.DB, c.req.param("token"));
  if (!creator) return c.json({ error: "unauthorized" }, 401);
  const { url } = await c.req.json<{ url?: string }>();
  if (!url) return c.json({ error: "url required" }, 400);
  try {
    return c.json(await resolveLink(url));
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : "bad url" }, 400);
  }
});

app.post("/studio/:token/items", async (c) => {
  const creator = await creatorByToken(c.env.DB, c.req.param("token"));
  if (!creator) return c.json({ error: "unauthorized" }, 401);
  const b = await c.req.json<Partial<Item>>();
  if (!b.url || !b.title) return c.json({ error: "url and title required" }, 400);
  try {
    new URL(b.url);
  } catch {
    return c.json({ error: "invalid url" }, 400);
  }
  const category = CATEGORIES.includes(b.category ?? "") ? b.category : "Misc";
  await c.env.DB.prepare(
    "INSERT INTO items (creator_id, url, title, description, image_url, site_name, domain, kind, category, note, visibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'public')"
  )
    .bind(
      creator.id,
      b.url.slice(0, 2000),
      (b.title ?? "").slice(0, 300),
      (b.description ?? "").slice(0, 500),
      (b.image_url ?? "").slice(0, 2000),
      (b.site_name ?? "").slice(0, 100),
      (b.domain ?? new URL(b.url).hostname.replace(/^www\./, "")).slice(0, 200),
      (b.kind ?? "link").slice(0, 20),
      category,
      (b.note ?? "").slice(0, 280)
    )
    .run();
  return c.json({ ok: true }, 201);
});

app.post("/studio/:token/items/:id/toggle", async (c) => {
  const creator = await creatorByToken(c.env.DB, c.req.param("token"));
  if (!creator) return c.json({ error: "unauthorized" }, 401);
  await c.env.DB.prepare(
    "UPDATE items SET visibility = CASE visibility WHEN 'public' THEN 'hidden' ELSE 'public' END WHERE id = ? AND creator_id = ?"
  )
    .bind(Number(c.req.param("id")), creator.id)
    .run();
  return c.json({ ok: true });
});

app.post("/studio/:token/items/:id/delete", async (c) => {
  const creator = await creatorByToken(c.env.DB, c.req.param("token"));
  if (!creator) return c.json({ error: "unauthorized" }, 401);
  await c.env.DB.prepare("DELETE FROM items WHERE id = ? AND creator_id = ?").bind(Number(c.req.param("id")), creator.id).run();
  return c.json({ ok: true });
});

// ---------- public feed ----------
app.get("/:handle", async (c) => {
  const handle = c.req.param("handle").toLowerCase();
  if (RESERVED_HANDLES.has(handle)) return c.notFound();
  const creator = await c.env.DB.prepare("SELECT id, handle, name, bio, avatar_url, accent, created_at FROM creators WHERE handle = ?")
    .bind(handle)
    .first<Creator>();
  if (!creator) return c.text("No such feed", 404);
  const items = await itemsFor(c.env.DB, creator.id, true);
  return c.html(publicPage(creator, items));
});

app.get("/:handle/rss.xml", async (c) => {
  const creator = await c.env.DB.prepare("SELECT id, handle, name, bio, avatar_url, accent, created_at FROM creators WHERE handle = ?")
    .bind(c.req.param("handle").toLowerCase())
    .first<Creator>();
  if (!creator) return c.text("No such feed", 404);
  const items = await itemsFor(c.env.DB, creator.id, true);
  return c.body(rssFeed(creator, items, new URL(c.req.url).origin), 200, { "content-type": "application/rss+xml; charset=utf-8" });
});

app.post("/:handle/follow", async (c) => {
  const creator = await c.env.DB.prepare("SELECT id FROM creators WHERE handle = ?").bind(c.req.param("handle").toLowerCase()).first<{ id: number }>();
  if (!creator) return c.json({ error: "no such feed" }, 404);
  const { email } = await c.req.json<{ email?: string }>();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) return c.json({ error: "invalid email" }, 400);
  await c.env.DB.prepare("INSERT OR IGNORE INTO followers (creator_id, email) VALUES (?, ?)").bind(creator.id, email.toLowerCase()).run();
  return c.json({ ok: true });
});

app.onError((err, c) => {
  console.log(JSON.stringify({ level: "error", message: err.message, url: c.req.url }));
  return c.text("Something broke on our side.", 500);
});

export default app;
