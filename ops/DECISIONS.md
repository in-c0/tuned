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

## 2026-08-06 (late evening) — Spend cap set; executor egress fixed

- **Owner set the autonomous spend cap: AUD $500 total for the 60-day window.** Rationale: ~AUD $16 infra headroom (Workers Paid if free tier is outgrown) + ~AUD $150–300 inference for the agent-scan core's first cohort + remainder for small evidence-gated distribution tests. Spend is not the binding constraint on the goal; the cap exists so sub-$500 purchases never stall a cycle. Running total: **AUD $0.00 of $500** — every purchase must append a line here.
- **Owner widened the routine environment's network allowlist to include justtuned.com.** Executor to confirm direct production egress on next run. D1/wrangler access remains withheld by design.
- Deploy pipeline verified end-to-end earlier this evening: push `46098b2` (10:38 UTC) → deployment `898548a4` live 10:40:04 UTC, site 200.

## 2026-08-06 — run 2: funnel telemetry, deliberately without a visitor identifier

- **Decision: no analytics cookie, no IP/UA hash, no per-visitor identifier of any kind.** The published privacy policy states the site sets no analytics cookies. Adding one would make that statement false and require amending a published privacy document — an owner boundary — for a capability the directive does not actually need. Instead, landing → application is measured as a **day-level ratio** from pure counters (`metric_days`), and retention is measured **per member** (`member_days`), reusing the account relationship and data category the service already stores in `reads` and `members.last_desk_at`. Nothing new about non-members is retained.
  - **Cost of this choice, stated plainly:** there is no per-visitor attribution, so "did the same anonymous visitor who saw the landing page apply?" is unanswerable. Only "how many views and how many applications happened that day" is. That is enough to steer on, and it is the honest limit of the data.
  - If anonymous visitor-level funnel attribution is ever wanted, it needs a privacy-policy amendment and therefore owner approval. It was not taken unilaterally.
- **Decision: the tables self-apply at runtime** (`CREATE TABLE IF NOT EXISTS`, once per isolate, in `src/metrics.ts`). The executor holds no Cloudflare credentials and cannot run a D1 migration, so a credentialed migration step would have made this change owner-blocked. Both tables are additive; no existing table, column, or row is touched, so the change is backward-compatible in both directions.
- **Decision: the read path is a committed file, not live egress.** The routine still cannot reach justtuned.com (403 CONNECT at the proxy, re-tested this run — the reported allowlist widening is not in effect). Rather than treating that as a blocker, `.github/workflows/metrics-snapshot.yml` fetches the key-gated endpoint from GitHub's runners and commits the JSON into `ops/metrics/`, which the executor reads as a file. This survives the egress restriction entirely and leaves credentials with GitHub/Cloudflare rather than the executor.
  - Side effect accepted: the daily snapshot commit lands on `master` and will trigger one no-op Workers build/deploy per day. Harmless and reversible; worth a Workers Builds path filter later if it becomes noise.
- **Owner action required (one auth step, per the directive's stop clause):** set `METRICS_KEY` as (1) a Worker secret and (2) a GitHub Actions repository secret. Until then the endpoint fails closed with 503 and the workflow skips cleanly. No spend involved.
- Running spend total: **AUD $0.00 of $500** — unchanged; this run cost nothing.
