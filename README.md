# attention-feed (working title: "Tuned")

Follow what someone is **paying attention to** — not what they post.
A creator pastes links (YouTube, X, articles, music); fans get a live public page:
"right now", a weekly attention breakdown, and a browsable archive. RSS included.

Doctrine (owner, 2026-07-27): **the human contributes attention, not content.**
Nothing is required from the creator but the link — notes are optional, never expected.
Veto (hide) anything, anytime. Full brief + raw words: `D:\Projects\_hub\ideas\2026-07-26-attention-digests.md`.

## Surfaces
- `/:handle` — public feed page (no fan accounts; Follow = email capture, sending TBD)
- `/:handle/rss.xml` — RSS
- `/studio/:token` — creator studio, secret capability URL: paste → auto-metadata → one-tap publish
- `POST /api/creators` — mint a creator (header `x-admin-key`), returns public + studio URLs

## Stack
Cloudflare Worker (Hono, TypeScript) + D1. Link metadata via YouTube/X oEmbed + OG tags (HTMLRewriter, best-effort).

## Dev
```
npm install
npm run db:local          # apply schema.sql to local D1
npx wrangler d1 execute attention_feed --local --file=./seed.sql   # optional demo data
npm run dev               # http://localhost:8791 (see .claude/launch.json)
```
Local admin key lives in `.dev.vars` (`ADMIN_KEY=dev-admin-key`).
Demo studio (local only): `/studio/dev-demo-token-not-for-prod`.

## Deploy
```
npx wrangler d1 create attention_feed   # once; paste id into wrangler.jsonc
npm run db:remote
npx wrangler secret put ADMIN_KEY
npx wrangler deploy
```

## Waitlist
Landing (`/`) has an in-app waitlist (email + fan/creator role) stored in D1. View signups:
```
npx wrangler d1 execute attention_feed --remote --command="SELECT email, role, created_at FROM waitlist ORDER BY created_at DESC" -y
```

## Onboard a creator
```
curl -X POST https://<worker-url>/api/creators \
  -H "content-type: application/json" -H "x-admin-key: $ADMIN_KEY" \
  -d '{"handle":"jude","name":"Jude B","bio":"...","accent":"#06d6a0"}'
```
Send them the `studio_url` (secret) and publish the `public_url` to fans.

## Renaming
The brand is a placeholder: change `BRAND`/`TAGLINE` in `src/pages.ts` (one place).
