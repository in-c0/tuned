# Decisions log

Append-only record of consequential decisions and reversals.

## 2026-08-06 — 60-day autonomous loop started

- Owner committed Tuned as one bounded autonomous commercial bet through **2026-10-05** (Sydney). Claude = executor/developer/QA/operator (Claude Code Routine on `in-c0/tuned`, runs 08:00/14:00/20:00 Sydney). ChatGPT = reviewer (~07:30/13:30/19:30 Sydney, one directive per review into issue #1).
- Adopted the owner's 2026-08-06 repositioning brief (ops/BRIEF-2026-08-06.md) as the working commercial hypothesis: single-player "attention inbox for your agents" wedge first; lead with "Wake up to the few things worth your attention."
- Deployment pipeline decision: Cloudflare Workers Builds Git integration on branch `master` (build `npm ci && npm run check`, deploy `npx wrangler deploy`), so the executor never holds Cloudflare credentials. Pending owner connecting it in the dashboard (auth boundary).
- Autonomous spend cap: **AUD $0** until the owner states otherwise.
- Known structural gap acknowledged at start: no billing exists, so revenue is impossible until a payment path ships; payment-provider account creation is an owner step.

## 2026-08-06 — run 1: fixed the deploy gate before anything else

- **Decision:** spend run 1 on the build gate rather than on funnel instrumentation, despite the initial instruction pointing at measurement. Rationale: the audit found `npm ci && npm run check` — the exact Workers Builds build command — exiting 2 on a fresh clone. Connecting the Cloudflare integration would have yielded a permanently red build and zero deploys, and the symptom would have looked like a Cloudflare fault. Every later intervention, instrumentation included, is unshippable until this is green, so it strictly precedes measurement work. Shipped in PR #2.
- **Decision:** add `.github/workflows/check.yml` mirroring the Cloudflare build command. Without it there is no CI in the repo at all, and the deploy gate required by issue #1 ("type check and automated tests pass") had no enforcement point the executor could observe.
- **Recorded blocker, not worked around:** the routine session cannot reach `justtuned.com` (egress proxy 403) and holds no Cloudflare credentials. Production verification and D1 metrics are therefore owner-dependent for now. Noted rather than routed around; no security boundary was touched.
- **Retention measurement is a schema problem, not a query problem.** `members.last_desk_at` is a single overwritten timestamp, so return-visit and D1/D7 retention cannot be derived from existing data at all. An additive visit-event table is the next candidate.

## 2026-08-06 (evening) — Owner connected the deploy pipeline

- Owner connected Cloudflare Workers Builds (`in-c0/tuned` → Worker `attention-feed`, branch `master`). Pushes to master now build (`npm ci && npm run check`) and deploy (`npx wrangler deploy`); run 1's gate fix means the build is green.
- Spend cap remains AUD $0; owner is deciding the cap.
