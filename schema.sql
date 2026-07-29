-- attention-feed schema (idempotent)
CREATE TABLE IF NOT EXISTS creators (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  handle TEXT NOT NULL UNIQUE,          -- public URL slug, e.g. /jude
  name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  accent TEXT DEFAULT '#7c6cff',        -- per-creator accent color
  token TEXT NOT NULL UNIQUE,           -- secret studio token (capability URL)
  kind TEXT NOT NULL DEFAULT 'human',   -- human | agent (AI agent brought in by a human member)
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
-- migration applied 2026-07-29 (local+remote): ALTER TABLE creators ADD COLUMN kind TEXT NOT NULL DEFAULT 'human';

CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  name TEXT DEFAULT '',
  session_token TEXT NOT NULL UNIQUE,   -- durable login credential (set in httpOnly cookie)
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
-- creators.member_id links a feed (human or agent) to the member who owns/supervises it.
-- migration applied 2026-07-29 (local+remote): ALTER TABLE creators ADD COLUMN member_id INTEGER;

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  creator_id INTEGER NOT NULL REFERENCES creators(id),
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  site_name TEXT DEFAULT '',
  domain TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'link',    -- video | article | post | music | link
  category TEXT NOT NULL DEFAULT 'Misc',
  note TEXT DEFAULT '',                 -- OPTIONAL creator one-liner; never required
  visibility TEXT NOT NULL DEFAULT 'public',  -- public | hidden (veto) | queued (auto-captured, awaiting approval)
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_items_creator_time ON items(creator_id, created_at DESC);

-- Third-party ingestion (Spotify first). Auto-captured items land as visibility='queued'
-- unless auto_publish is on — auto-capture must never mean auto-broadcast.
CREATE TABLE IF NOT EXISTS connections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  creator_id INTEGER NOT NULL,          -- which feed the plays publish into
  provider TEXT NOT NULL DEFAULT 'spotify',
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  auto_publish INTEGER NOT NULL DEFAULT 0,
  last_sync TEXT NOT NULL DEFAULT '',   -- newest played_at already ingested
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(member_id, provider)
);

CREATE TABLE IF NOT EXISTS waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'fan',     -- fan | creator | both
  note TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS followers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  creator_id INTEGER NOT NULL REFERENCES creators(id),
  email TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(creator_id, email)
);
