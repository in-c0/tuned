# Connections map — the full range of hookable attention sources

Product principle (owner, 2026-07-29): **users choose what to connect.** The consent layer IS the
product surface: every source is opt-in per member, defaults to the private queue, and can be
disconnected with history intact. Signal classification decides rendering: **deliberate** (chosen
acts: saves, likes, stars) renders per-card; **ambient** (streams: plays, sessions) rolls up.

Legend — Mechanism: `OAUTH` service OAuth · `TOKEN` personal API token · `PUB` public API/RSS, no
auth · `HOOK` generic webhook (works TODAY via share-api) · `EXT` browser extension · `EMAIL`
email ingestion · `DEV` on-device automation (iOS Shortcuts/Tasker) · `EXPORT` file import.
Status: ✅ buildable now · 🟡 partner/approval-gated or limited · ⛔ no viable path (noted anyway).

## Tier 0 — universal capture (covers EVERYTHING, no per-service build)

| Layer | Mechanism | Status | Notes |
|---|---|---|---|
| Share-sheet (Android PWA / iOS Shortcut) | DEV | ✅ SHIPPED | any app with a share button |
| Bookmarklet + paste-in-dashboard | — | ✅ SHIPPED | any web page |
| **Webhook: POST /studio/:token/share-api** | HOOK | ✅ SHIPPED | **this already connects n8n, Zapier, IFTTT, Tasker, Shortcuts automations, cron scripts — hundreds of services for free** |
| Email ingestion (per-member address, e.g. ava@in.justtuned.com) | EMAIL | ✅ buildable on CF Email Routing + Worker | forward newsletters/receipts you actually read; Gmail filters automate it |
| Browser extension (one-click + optional dwell-time auto→queue) | EXT | ✅ buildable | the deepest "actually read" signal; desktop |
| RSS watcher (member supplies any personal RSS URL) | PUB | ✅ buildable, one feature = many services | Letterboxd diary, Goodreads shelves, blogs, podcasts feeds… |
| OPML / CSV import (one-time) | EXPORT | ✅ | subscriptions = standing attention |
| **Tuned MCP server** | HOOK | ✅ buildable | any AI agent/assistant publishes to its own member feed — the AI-member story, productized |

## Music & audio
| Source | Signal | Mechanism | Status |
|---|---|---|---|
| Spotify recently-played | ambient | OAUTH | ✅ SHIPPED (rolls up) |
| **Spotify liked/saved tracks** | deliberate | OAUTH (`user-library-read`) | ✅ next — the signal fix |
| Apple Music recently-played | ambient | TOKEN (MusicKit) | 🟡 dev-program setup |
| Last.fm / ListenBrainz scrobbles | ambient | PUB (public profiles!) | ✅ trivial |
| SoundCloud | — | API closed to new apps | ⛔ |
| Bandcamp purchases/wishlist | deliberate | EMAIL (receipts) | ✅ via email layer |
| Podcasts (Apple/Pocket Casts/Overcast) | deliberate | no APIs | ⛔ → share-sheet/EMAIL (flag: Dr Onyx's world) |

## Video & film/TV
| Source | Signal | Mechanism | Status |
|---|---|---|---|
| **YouTube liked videos** | deliberate | OAUTH (`youtube.readonly`) | ✅ high priority |
| YouTube subscriptions | standing | OAUTH | ✅ (import-style) |
| YouTube watch history | ambient | Takeout only | ⛔ API |
| Twitch follows | standing | OAUTH | ✅ |
| Vimeo likes | deliberate | OAUTH | ✅ |
| Trakt.tv (films/TV watched — the de-facto streaming layer) | deliberate | OAUTH | ✅ |
| Simkl (auto-tracks Netflix etc. via its extension) | ambient | OAUTH | ✅ |
| **Letterboxd diary/likes** | deliberate | PUB (per-user RSS) | ✅ trivial |
| Netflix/Disney+/etc. direct | — | no APIs | ⛔ (Trakt/Simkl are the path) |

## Reading — articles, newsletters, research
| Source | Signal | Mechanism | Status |
|---|---|---|---|
| **Readwise / Reader** (saves + highlights + Kindle) | deliberate | TOKEN | ✅ high priority |
| Instapaper | deliberate | OAUTH (v1) | ✅ |
| Raindrop.io bookmarks | deliberate | OAUTH | ✅ |
| Pinboard | deliberate | TOKEN | ✅ |
| Hypothes.is annotations | deliberate | PUB/TOKEN | ✅ |
| **Zotero library adds** (researchers!) | deliberate | PUB/TOKEN | ✅ — perfect for science-niche pilots |
| Mendeley | deliberate | OAUTH | 🟡 |
| Pocket | — | shut down 2025 | ⛔ (import only) |
| Omnivore | — | shut down 2024 | ⛔ |
| Newsletters (Substack etc.) | deliberate | EMAIL layer | ✅ — no reader API exists; email IS the API |
| Hacker News upvotes/favorites | deliberate | favorites PUB, upvotes login-only | 🟡 favorites-first |
| Reddit saved/upvoted | deliberate | OAUTH | ✅ personal-use scale |

## Books
| Source | Signal | Mechanism | Status |
|---|---|---|---|
| Goodreads shelves | deliberate | PUB (per-user shelf RSS; API closed) | ✅ via RSS watcher |
| StoryGraph | deliberate | EXPORT (CSV) | 🟡 |
| Literal.club | deliberate | PUB (GraphQL) | ✅ niche |
| Audible | deliberate | EMAIL receipts | ✅ via email layer |

## Code & tech
| Source | Signal | Mechanism | Status |
|---|---|---|---|
| **GitHub stars** | deliberate | PUB (starred_at timestamps, no OAuth) | ✅ trivial — cheapest real win |
| GitHub watched/follows | standing | PUB | ✅ |
| Hugging Face likes | deliberate | PUB | ✅ |
| Product Hunt upvotes | deliberate | OAUTH | ✅ |
| GitLab stars / dev.to reactions | deliberate | PUB/TOKEN | ✅ |
| Stack Overflow saves | deliberate | OAUTH | 🟡 |

## Social platforms (likes = the native attention act)
| Source | Signal | Mechanism | Status |
|---|---|---|---|
| **Bluesky likes** | deliberate | PUB (AT Protocol, free) | ✅ trivial — scicomm crowd lives there |
| Mastodon favourites | deliberate | OAUTH per-instance | ✅ |
| Reddit (above) | | | |
| X/Twitter likes | deliberate | API paywalled (~$200/mo tier) | ⛔ practically — the original proof, now closed |
| Instagram saves/likes | — | API killed 2024 | ⛔ |
| TikTok liked videos | — | Display API can't | ⛔ → share-sheet |
| Threads | — | API limited | 🟡 verify |
| Pinterest pins | deliberate | OAUTH | ✅ |
| Are.na channel adds | deliberate | PUB/OAUTH | ✅ — the most Tuned-native product that exists |

## Games
| Source | Signal | Mechanism | Status |
|---|---|---|---|
| Steam recently-played/playtime | ambient | PUB (API key, public profiles) | ✅ trivial (rolls up) |
| Chess.com / Lichess games | ambient-charming | PUB | ✅ trivial |
| RetroAchievements | deliberate | PUB | ✅ |
| Xbox / PlayStation / Nintendo | ambient | unofficial only | 🟡/⛔ |

## Fitness & health (volt/pulse-adjacent; SSMT world)
| Source | Signal | Mechanism | Status |
|---|---|---|---|
| **Strava activities** | deliberate | OAUTH | ✅ — proven social-feed behavior |
| Oura | ambient | TOKEN (v2) | ✅ easy |
| Fitbit / Whoop | ambient | OAUTH | ✅ |
| Garmin/Polar/Suunto | ambient | partner-gated | 🟡 |
| Apple Health / Google Fit | ambient | DEV (Shortcuts automation → webhook) | ✅ via Tier 0 |
| MyFitnessPal / Peloton / Zwift | — | gated/unofficial | 🟡/⛔ |

## Places, food, learning, knowledge tools
| Source | Signal | Mechanism | Status |
|---|---|---|---|
| Foursquare/Swarm check-ins | deliberate | OAUTH | ✅ |
| Untappd | deliberate | 🟡 partner API | 🟡 |
| Kaggle / LeetCode public activity | deliberate | PUB | ✅ |
| Anki reviews | ambient | DEV/HOOK (addon → webhook) | ✅ via Tier 0 |
| Notion database watch (e.g. a "reading list" DB) | deliberate | TOKEN | ✅ |
| Obsidian/Logseq | deliberate | plugin → HOOK | ✅ via Tier 0 |

## AI-era sources (novel; on-thesis)
| Source | Signal | Mechanism | Status |
|---|---|---|---|
| **Tuned MCP server** — any agent shares what it reads | deliberate | HOOK/MCP | ✅ our 5 agents already do the raw version |
| Claude/ChatGPT topics ("what I asked about today") | deliberate, sensitive | EXPORT/MCP → queue ONLY | 🟡 privacy-first design needed |
| Perplexity/search | — | no API | ⛔ → extension |

## The choice architecture ("give users the choice")

1. **Connections catalog** in the dashboard: every source above as a card. Live ones say Connect;
   the rest carry a **"request this" vote** — the [[B2C roadmap-ballot doctrine]] applied to Tuned.
   We build connectors in vote order, not guess order. Show-don't-tell: no fake toggles — unbuilt
   sources are explicitly votes, not switches.
2. **Per-connection controls:** queue (default) vs auto-publish · category mapping · ambient
   rollup on/off · pause · disconnect (data stays, capture stops).
3. **Per-category standing rules** (the caught-liking answer): "Music auto-publishes, Reading
   queues, Health never leaves the queue."
4. **Signal honesty:** ambient sources are labeled ambient in the catalog and roll up in feeds.

## Build order recommendation (signal-per-effort)
1. Spotify **saved tracks** (scope change — fixes the current noise at the source)
2. **GitHub stars** + **Bluesky likes** + **Letterboxd RSS** (all public, no OAuth — one afternoon, three connectors)
3. **YouTube likes** (OAuth)
4. **Email ingestion address** (unlocks newsletters + receipts — the whole reading economy)
5. **Readwise** (token) + **Zotero** (pilot-creator bait for the science niche)
6. Catalog UI + request-votes (turns the rest into a demand signal)
7. Extension · Strava · Trakt · MCP server — by vote.
