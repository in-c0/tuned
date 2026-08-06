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
- **Also shipped this run: `.github/workflows/verify-production.yml`.** The operating cycle requires "verify production after deployment and roll back on regression", but the executor cannot reach justtuned.com at all, so that step was previously unperformable rather than merely awkward. This runs from GitHub's network on every push to master and asserts three things the executor can read via the Actions API: the site returns 200 and renders, `/api/metrics` **never** returns 200 without a key (a real security assertion, not a liveness ping), and /terms and /privacy still render. It uses no secrets.

## 2026-08-06 — run 3 (concurrent session A): proved the telemetry works before trusting a number from it

- **Decision: spend this run on tests for the telemetry path rather than on new product surface.** Rationale: `src/metrics.ts` swallows every error by design, which is correct for users (a broken counter must never break a page) and dangerous for this loop. If the SQL were wrong, production would record nothing, `/api/metrics` would return an empty set, and **"no traffic" and "telemetry is broken" would be indistinguishable in the brief.** The first number the owner reads would be unfalsifiable in exactly the way the reviewer's acceptance criteria forbid. The repo also had **zero tests**, so the operating cycle's "run tests" step had nothing to run.
- **What this buys, concretely:** it disambiguates EXP-001's threshold. A zero `landing_view` count now means *genuinely no traffic* — a distribution finding — rather than an unexamined possibility that the counter never fired. Without the tests, a zero would have been uninterpretable.
- 17 tests run in **workerd against a real (local) D1** — the same runtime and SQL engine production uses, with no Cloudflare credentials and no network. They cover the `ON CONFLICT` upsert (the single most consequential line: a silent replace-instead-of-add would peg every counter at 1), per-day/per-name keying, `member_days` retention arithmetic, bot classification, the aggregate payload containing no identifier, `/api/metrics` auth in all three states (503/401/200), and — the failure mode where the module is perfect but never called — that real requests to `/` and `POST /waitlist` actually increment their counters.
- Applying the committed `schema.sql` is part of the fixture, so schema drift or invalid SQL now fails a test instead of failing in production. It already earned its keep: it surfaced that `schema.sql:59` has an inline comment containing a semicolon.
- **Verified the tests actually catch the failure they exist for.** Mutating the upsert to `DO UPDATE SET count = 1` was confirmed to fail the accumulation test; `src/metrics.ts` was restored unchanged. A test suite that passes against broken code is worse than none.
- **Decision: tests run in GitHub Actions, not in `npm run check`.** Cloudflare Workers Builds runs `check` as its build command, so anything added to it can wedge deploys — and the test pool spawns a `workerd` binary, exactly the kind of thing that behaves differently in a build sandbox. Every change reaches master through a PR, so gating the merge gates production without putting the deploy path at risk. Clean-clone `npm ci && npm run check` was re-verified at exit 0.
- **No `src/` file was changed this run**, so production runtime risk is zero and rollback is a revert of dev tooling only.
- Dependency note: `vitest` was pinned to `~3.2` with `@cloudflare/vitest-pool-workers@^0.8`. The current `0.20.2` drops the documented `defineWorkersConfig` entry point for an undocumented one; pinning the proven pairing was preferred over reverse-engineering test infrastructure.
- **Security check:** `npm audit` reports 4 moderate + 1 high, **all in dev-only tooling** (`undici` via `miniflare`/`wrangler`) that never reaches the Worker runtime. One production advisory exists — `hono <4.12.34`, ReDoS in **CORS middleware** — and it is **not reachable**: the app registers no CORS middleware anywhere (`grep` for `hono/cors` returns nothing). Recorded rather than bundled into this change; a `hono` patch bump is a clean standalone next candidate.
- Running spend total: **AUD $0.00 of $500** — unchanged; this run cost nothing.
- **Re-confirmed blocker (third run running):** the routine session still cannot reach `justtuned.com` — `403` on CONNECT at the egress proxy, and `example.com` is refused identically, so this is a general allowlist state, not a justtuned-specific rule. The widening recorded on 2026-08-06 is **not in effect for this session**. The `verify-production` workflow makes this survivable, so it is a standing limitation rather than a stop condition.

> **Both entries above are labelled "run 3" because two executor sessions ran concurrently** — the
> exact failure the session-B fix addresses. Session A shipped PR #4 (telemetry tests) to `master`
> while session B had PR #5 (this guard) in flight; session B discovered it as a merge conflict on
> `ops/DECISIONS.md`, not through any coordination mechanism, because none existed. The work did not
> conflict semantically — one added tests, the other a workflow condition — but nothing guaranteed
> that, and both sessions were independently authorised to deploy to production. Treat this as the
> empirical demonstration of the defect rather than a near miss: it is what unbounded self-invocation
> looks like in practice.

## 2026-08-06 — run 3 (concurrent session B): hard guard on executor self-invocation

- **Finding:** `.github/workflows/claude-continuation.yml` (shipped `dae13e0`) fired a new Claude executor session on every successful `check` run for a push to `master`. Because the executor *ships by pushing to master*, that closed a cycle with no termination condition: push → check → fire → executor → push → … The Actions history shows it running three times in six minutes on 2026-08-06 — fires at 11:23:38 (`feb6c4f`), 11:24:30 (`6b08344`) and 11:27:59 (`d9697e9`), the last of which started run 3 itself.
- **Why this outranked the remaining directive work:** the only thing bounding the cycle was the executor's own judgement about when to stop. That is a soft guard on (a) unbounded Claude inference spend, (b) unbounded unattended production deploys, and (c) the 3×/day cadence the owner deliberately configured. A control defect that governs every future action ranks above any single action it would govern — especially now, when the loop is fenced from product work by the reviewer and blocked on `METRICS_KEY`, so a runaway would spin without producing evidence.
- **Decision: push-driven continuation is now opt-in and defaults closed.** A push-triggered fire additionally requires `[continue]` in the head commit message, which the executor adds only when deliberately leaving staged multi-step work that should not wait for the next scheduled run. An ordinary commit ends the chain.
  - The `issue_comment` path (a reviewer directive carrying `<!-- tuned-review-directive -->` on issue #1) is **unchanged**: it is owner/reviewer-initiated and cannot self-sustain, so it is not part of the cycle.
  - Capability is preserved, not removed — the executor can still hand off to itself, but must now say so explicitly rather than doing it as a side effect of shipping.
- **Self-terminating by construction:** this fix's own commit message carries no `[continue]` marker, so merging it is the last push-driven fire. That is the verification — if a further session is fired by this push, the guard did not take.
- Deliberately **not** bundled: the daily metrics-snapshot no-op deploy noted in run 2. Still latent (it needs `METRICS_KEY` first) and lower value; a Workers Builds path filter is an owner dashboard action. Carried as next candidate.
- Running spend total: **AUD $0.00 of $500** — unchanged; this run cost nothing.

## 2026-08-06 — run 4: patched the one production-runtime advisory

- **Context:** the standing directive (privacy-safe funnel telemetry) is satisfied in code and blocked
  solely on the owner setting `METRICS_KEY`. Verified this run at 11:42 UTC: `/api/metrics` still
  returns **503**, so the key is unset and every funnel metric remains UNMEASURED. The reviewer's hold
  forbids pricing, positioning and broad feature work until a baseline exists. That leaves dependency
  security as the highest-value action genuinely inside the envelope — it was candidate #1 in both
  run-3 reports.
- **Decision: bump `hono` 4.12.32 → 4.12.34** ([GHSA-8j4g-w8fx-2239](https://github.com/advisories/GHSA-8j4g-w8fx-2239),
  moderate ReDoS in CORS middleware). `hono` is the **only** production dependency in the tree, so this
  was the only advisory that could ever reach the Worker runtime.
  - **Honest scope of the fix:** the advisory was *not* exploitable here — the app registers no CORS
    middleware (`hono/cors` is imported nowhere in `src/`). This closes a latent path, it does not
    close an active hole. Recorded that way rather than dressed up as an incident.
- **Decision: take 4.12.34, not the 4.13.0 that `npm install hono@^4.12.34` resolves to.** The caret
  range pulled a *minor* bump; the advisory is fixed at the patch. On a Worker serving real users the
  smallest delta from the running version is worth more than being current, and a minor release would
  have needed a behaviour review this run could not justify. `package.json` floor is now `^4.12.34`, so
  a fresh resolve can never land on a vulnerable version again.
- **Correction to a previously recorded fact.** Runs 2–3 recorded the audit as "4 moderate + 1 high,
  all dev-only". As of this run it reads **1 moderate + 6 high** — the advisory database moved (new
  `sharp`/libvips, `ws` and `undici` advisories), not the dependency tree. After the bump: **0 moderate
  + 6 high, and the production dependency tree is advisory-free.** All six remaining are in
  `devDependencies` (`@cloudflare/vitest-pool-workers`, `wrangler`, and their transitives `miniflare`,
  `sharp`, `undici`, `ws`) and never reach the Worker runtime.
- **Deliberately not fixed, with reasons:**
  - `wrangler` (high, [GHSA-36p8-mvp6-cv38](https://github.com/advisories/GHSA-36p8-mvp6-cv38)) — OS
    command injection in **`wrangler pages deploy`**. This is a Worker deployed with `wrangler deploy`;
    the affected subcommand is never invoked. npm's "fix" is a **major downgrade to 3.114.17**, which
    would break both `wrangler types` in the build gate and the Cloudflare deploy command. Downgrading
    the deploy toolchain to clear a non-applicable advisory would trade a real deploy path for a
    cosmetic audit score.
  - `@cloudflare/vitest-pool-workers` 0.8 → 0.20.2 (semver-major, clears four transitive highs) — run 3
    pinned the 0.8 pairing deliberately because 0.20.x drops the documented `defineWorkersConfig`
    entry point. Re-doing the test infrastructure is not a security fix and is not this run's action.
- **Verification:** clean-clone `npm ci && npm run check` (the exact Cloudflare Workers Builds command)
  exit 0; `npm test` 17/17 in workerd against a real local D1. The tests exercise live requests through
  the Hono app itself, so the new version is validated at **runtime**, not merely typechecked.
- Running spend total: **AUD $0.00 of $500** — unchanged; this run cost nothing.
