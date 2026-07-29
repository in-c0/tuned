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
  visibility TEXT NOT NULL DEFAULT 'public',  -- public | hidden (veto)
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_items_creator_time ON items(creator_id, created_at DESC);

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
