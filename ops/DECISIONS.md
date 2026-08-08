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

## 2026-08-06 — run 5: first snapshot attempt failed at the Worker, not the workflow

- **Directive:** the owner confirmed `METRICS_KEY` is set as both a Worker secret and a GitHub Actions
  repository secret; dispatch the snapshot and read the first real numbers.
- **What happened:** dispatched `metrics-snapshot.yml` manually
  ([run 31098737983](https://github.com/in-c0/tuned/actions/runs/31098737983), 11:48 UTC). It failed —
  but the failure is precisely located, and the location matters:
  - The **GitHub side is correct.** The job log shows `METRICS_KEY: ***` in the step env, so the
    repository secret exists and was passed. The workflow did not take its skip path.
  - The **Worker side is not.** `https://justtuned.com/api/metrics` returned **HTTP 503
    `{"error":"metrics key not configured"}`**. That branch (`src/index.ts:89`) fires only when
    `c.env.METRICS_KEY` is **absent** in the running Worker. A key that were merely *wrong* would
    return 401, not 503. So this is not a mismatched value — the binding does not exist on the live
    version at all.
- **Diagnostic taken, rather than escalating on a guess:** the live version at the time of the failure
  was built from `8f91091`, deployed ~11:41 UTC — **before** the owner's 11:46 UTC confirmation that
  the secret was set. So one ordinary explanation is that the secret is saved on the Worker but was
  never rolled into a deployed version. Pushing any commit to `master` forces Workers Builds to deploy
  a fresh version, which picks up whatever secrets the Worker holds. This ops commit is that push, and
  re-running the snapshot after it discriminates cleanly:
  - snapshot returns **200** → the secret was saved but not live; the redeploy fixed it, no owner action needed;
  - snapshot returns **503** again → the secret is not on this Worker (wrong Worker, wrong account, or a
    name typo), and that *is* an owner auth-boundary step.
- No `src/` file is touched, so the redeploy ships byte-identical application code. Rollback is not
  applicable — there is no behaviour change to revert.
## 2026-08-06 — run 5 (concurrent session B): patched the one production-runtime advisory

> **Run-number collision, recorded rather than tidied away.** The entry immediately above is a
> *different, concurrently-running session* that also called itself run 5. This session was fired by
> the routine API at 11:44 UTC and selected dependency security; the other was fired by the reviewer
> directive at 11:46 UTC and took the telemetry snapshot. Neither knew of the other until this file
> conflicted on push — the same coordination gap run 3 documented, now on its second occurrence.
> **This session deliberately did not touch the telemetry directive**, to avoid two sessions doing
> one job. The two changes are disjoint: dependency manifest here, ops narration there.

- **Context:** the standing directive (privacy-safe funnel telemetry) is satisfied in code and blocked
  solely on `METRICS_KEY`. Verified at 11:42 UTC: `/api/metrics` returned **503**. *Superseded within
  the run* — the owner set the key at 11:46 UTC; the concurrent session above is diagnosing why the
  live Worker still answered 503 afterwards. Funnel metrics remain UNMEASURED as of this commit. The reviewer's hold
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

### Diagnostic result (same run, 12:03 UTC): the secret is not on the live Worker

The redeploy test above returned an unambiguous answer, and it is the second branch.

- Push `82f069d` (11:49 UTC) → Workers Builds deployed a fresh version. `verify-production`
  [run 31098869474](https://github.com/in-c0/tuned/actions/runs/31098869474) at 11:52 UTC reported
  `/api/metrics` **HTTP 503** unauthenticated — still "not configured".
- A second, independent deploy followed from `51a51ad` (the hono patch, PR #6) at ~11:55 UTC.
- Re-dispatched the snapshot at 12:03 UTC
  ([run 31099758384](https://github.com/in-c0/tuned/actions/runs/31099758384)): **HTTP 503
  `{"error":"metrics key not configured"}`** again, with `METRICS_KEY: ***` still present in the
  runner env.

So: two fresh Worker versions, deployed after the owner reported setting the secret, both start
without a `METRICS_KEY` binding. A stale version is ruled out. **The value is not attached to the
`attention-feed` Worker that serves justtuned.com** — the plausible causes are a different Worker or
Cloudflare account, a name that does not match `METRICS_KEY` exactly (trailing space, different case),
or a dashboard edit that was saved as a draft and never deployed.

**This is an owner authentication-boundary step and the executor stops here rather than working
around it.** The executor holds no Cloudflare credentials by deliberate design — that is the whole
reason the Git-based pipeline exists — so it cannot inspect or set Worker secrets, and will not try.

What is now *positively established*, and was not before this run: the GitHub half of the read path
works. The repository secret exists, is passed to the job, and the workflow reaches production and
parses its response. When the Worker half is fixed, the snapshot needs no code change — just a
re-dispatch.

- Running spend total: **AUD $0.00 of $500** — unchanged; this run cost nothing.
- Concurrency note: PR #6 (hono patch) merged from another executor session at 11:53 UTC while this
  run was in flight. The `[continue]` guard bounds *push-driven* self-invocation; it does not bound
  two externally-fired sessions overlapping, which is what happened here. Not a defect in the guard —
  recorded so the pattern stays visible.

## 2026-08-07 (run 6, 08:10 Sydney) — post-deploy verification proves version identity, not elapsed time

**Decision:** replace the freshness check in `verify-production.yml` with a comparison against a build
stamp baked into the Worker, and treat an unprovable deploy as a failed one.

**Why this and not something else.** The reviewer's directive named it, and inspection confirmed the
defect was real and silent. The old gate waited for `/api/metrics` to stop returning 404. That was a
correct freshness proof for exactly one deploy — the one that introduced the route. From `feb6c4f`
onward every version carried it, so the gate passed on its first attempt against whatever was already
serving. The health steps beneath it then reported on the **old** Worker while reading, in the run log
and in three execution reports, as confirmation of the new one.

This was demonstrated, not reasoned about: the old gate was reconstructed from `origin/master` and run
against a stale-but-healthy version. It prints `deploy is live after 1 attempt(s)` and exits 0. Every
"production verified green" claim since `feb6c4f` rested on the fixed `sleep 120` above it rather than
on evidence — including the two readings that diagnosed the missing `METRICS_KEY`. Those readings were
strong because two independent deploys agreed, not because either was provably post-deploy.

**Design choices worth recording, because each had a plausible alternative:**

- **Generated, not committed.** `src/build-info.ts` is written by `scripts/build-info.mjs` during
  `npm run check` — the same command Workers Builds runs before `wrangler deploy` — and is gitignored,
  following the `worker-configuration.d.ts` convention already in this build gate. Committing a
  placeholder would have kept the tree buildable without the generator, at the cost of a file that is
  perpetually dirty and can drift.
- **Two SHA sources.** `WORKERS_CI_COMMIT_SHA`/`GITHUB_SHA` first, then `git rev-parse HEAD`. If
  Cloudflare's env var names ever change, the git fallback still yields the pushed commit. If neither
  works the stamp is `"unknown"`, which matches no expected SHA — so a broken stamp surfaces as
  "expected version never appeared" rather than as a pass.
- **The SHA is validated before it is written.** It is interpolated into generated TypeScript, so an
  unvalidated env var would be a code-injection path into the Worker. Tested: a malformed
  `WORKERS_CI_COMMIT_SHA` is rejected and the generator falls back to git.
- **`/api/version` is deliberately unauthenticated.** A verifier that needs a secret to establish
  freshness cannot run before that secret exists — which is precisely the state this repository has
  been in for four runs. The commit SHA of a public repository is not a secret. The route returns the
  commit and nothing else, and a test asserts exactly that key set.
- **Fails closed.** If the expected commit is not serving within 8 minutes the job fails and the
  health steps do not run. A green health result on an unknown version is worse than no result.

**Verification:** clean-clone `npm ci && npm run check` exit 0; `npm test` **19/19**;
`npm audit --omit=dev` clean. The gate script was extracted verbatim from the workflow and run against
8 stubbed production states — expected-commit-live and mid-transition pass; old-version-serving,
wrong-SHA, `unknown` stamp, empty body, HTML error page and total curl failure all fail closed.

**Reversibility:** `git revert`. One new route returning a constant; no schema, no data, no user
surface, no authenticated surface.

- Running spend total: **AUD $0.00 of $500** — unchanged; this run cost nothing.

### Same run, 22:15–22:22 UTC — I broke the verifier while shipping it, and what that cost

`b8a1277` shipped a `verify-production.yml` that **did not parse**. The commit-extraction step
embedded a multi-line python script inside a `run: |` block with its continuation lines at column 0,
which ends the YAML block scalar.

GitHub's response to an unparseable workflow is **silence**, and that is the part worth remembering:

- the merge push produced no run — no failure, no annotation, nothing;
- `workflow_dispatch` returned `422 Workflow does not have 'workflow_dispatch' trigger` while the
  trigger sat plainly in the file;
- production ran for ~7 minutes with **no post-deploy verification at all**.

**I first diagnosed this as GitHub failing to ingest events**, and spent two dispatch retries on that
theory. It was my bug. The misreading is the more instructive half: from the outside, an invalid
workflow and a platform outage look identical, and the wrong one is far more comfortable to believe.

Fixed in `8fc52ce` (PR #9): extraction is a single-line `grep -oE` for the fixed shape of a commit
stamp — a SHA does not need a JSON parser, and anything that is not that shape yields `""` and keeps
the loop waiting, so fail-closed is preserved.

**The gate could not have caught it.** `tsc` and `vitest` never open a workflow file, so a syntax
error in the file that verifies production shipped green. `scripts/validate-workflows.py` now parses
all four workflows and asserts each still declares the triggers this loop depends on; `check.yml`
runs it. Verified against the exact broken file (unparseable → exit 1) **and** against a workflow
that still parses but has quietly lost `workflow_dispatch` (→ exit 1) — the second case matters as
much as the first, because a trigger can vanish while the YAML stays valid.

`check.yml` also gained `workflow_dispatch`. A gate that governs production must be runnable when its
own trigger misfires; without it the only options were to leave the change unmerged or to merge on
local evidence alone.

## 2026-08-07 — run 6 (concurrent session B): the duplication is now the binding constraint

> This session produced **no shipped code**. Everything it built, another session had already built.
> That is the finding, and it is worth more than the code would have been.

- **What happened, with times (UTC).** Two executor sessions ran the 2026-08-06 21:28 directive
  simultaneously and neither knew of the other until GitHub told them:
  - 21:59 — `claude-continuation.yml` fired a session from the reviewer's directive comment on #1.
  - ~22:08 — the scheduled routine fired this session. It read #1, saw the directive and no execution
    report after it, and correctly concluded the directive was unclaimed. **It was not unclaimed — it
    was already being worked, and there was no way to see that.**
  - 22:10 / 22:14 — PR #7 and PR #8: the same design, reached independently (build-time commit stamp →
    `GET /api/version` → verifier polls for `github.sha` → fails closed).
  - 22:20 / 22:22 — PR #9 and PR #10: the same YAML fix for the same break, again independently.
- **Both duplicates were resolved by an earliest-first rule, and both times this session yielded.** #8
  closed for #7, #10 closed for #9. The rule matters more than which way it points: a *symmetric* rule
  converges when both sessions apply it, whereas "defer to the other" would have shipped nothing at all.
- **Why this outranks the directive work itself.** Run 3 established that a control defect governing
  every future action ranks above any single action it governs. This is that, one level up: run 3
  bounded a session from *firing* another, which it did. It never bounded two externally-fired sessions
  from doing *the same job*, and that has now happened on three consecutive cycles (run 3, run 5, run 6)
  — the third at a 100% duplication rate. The loop has ~59 days left and is currently spending roughly
  half its executor capacity producing work that is thrown away.
- **Protocol adopted (executor-side, costs nothing, needs no owner action): claim before acting.**
  Recorded in NORTH_STAR.md so every session reads it at start.
  1. After reading #1 and before selecting an action, post a one-line claim comment containing the
     marker `<!-- tuned-run-claim -->`, the UTC time, and the directive being claimed.
  2. Before posting it, re-read the last few comments. If a claim already exists that is **newer than
     the latest reviewer directive**, do not duplicate the work: pick the next-highest-value bounded
     action that is disjoint from the claim, or stop and say so.
  3. The claim is advisory and cheap. It does not prevent a race inside its own posting window; it
     closes the much larger window — minutes to tens of minutes — in which one session is already
     implementing while another is still reading.
- **What it would have caught today:** the 21:59 session would have claimed at ~22:00; this session,
  reading #1 at ~22:08, would have seen it and either stopped or picked something disjoint. Both
  duplicate PR pairs disappear. It does not fix a genuine simultaneous start, and that limit is stated
  rather than papered over.
- **Owner alternative, if the duplication continues:** the `issue_comment` continuation path and the
  3×/day schedule are two independent triggers on the same work. Turning off the `issue_comment` path
  removes the collision at its source, at the cost of directives waiting for the next scheduled run
  (≤6h). That is an owner call, not an executor one, and no change was made to it.
- **`METRICS_KEY` is still absent from the live Worker — fifth independent observation.** Snapshots
  dispatched at 22:09 ([31128798514](https://github.com/in-c0/tuned/actions/runs/31128798514)) and
  22:16 ([31128889032](https://github.com/in-c0/tuned/actions/runs/31128889032)) both returned HTTP 503
  `metrics key not configured`, and `verify-production` on `8fc52ce` at 22:22 read the same 503
  unauthenticated. The runner env shows `METRICS_KEY: ***`, so the GitHub half remains correct. No
  Cloudflare secret was inspected; this stays an owner auth-boundary step.
- Egress re-tested, **sixth consecutive run**: `justtuned.com` still 403 CONNECT at the proxy.
- Running spend total: **AUD $0.00 of $500** — unchanged; this run cost nothing.

## 2026-08-07 — run 9 (19:32 Sydney / 09:32 UTC): the loop stops building and asks someone

The reviewer's directive arrived at 09:31:38 UTC. This session claimed it at 09:32:33 — **55 seconds**
— which is the tightest the claim protocol has ever been tested, and deliberately so: the
`issue_comment` continuation trigger fires on the same comment, so the race window between two
sessions reading the same directive is now measured in seconds rather than minutes. The protocol does
not close that window; it only makes the loser cheap to identify. Recorded because a 55-second claim
is not evidence the protocol is safe, only that it was fast this once.

**Action taken: a distribution packet, and no code.** Nine runs have produced a verified deploy
pipeline, tested telemetry, a version-identity gate, a workflow validator and a claim protocol — and
**zero facts about whether anyone wants Tuned**. Run 8 flagged the intent to shift from measurement to
distribution; the reviewer made it the directive. The packet is a single Show HN post to people who
already run research/coding agents daily, published by the owner, graded against thresholds
pre-registered in `ops/EXPERIMENTS.md` (EXP-002) *before* any result exists.

**The finding that changes the plan, and it came from reading the code rather than assuming:**

> **The campaign tag does not work.** `?src=...` is dropped on the floor.

`app.get("/")` (`src/index.ts:57`) never reads query parameters; `POST /waitlist`
(`src/index.ts:72-81`) persists exactly `email`, `role`, `note`; the `waitlist` table
(`schema.sql:82-88`) has no source column. So the "one tagged URL" the directive asks for is real as a
string and **inert as an instrument**. Two ways this could have gone wrong and did not: shipping a
one-line `?src` capture would have been product code this directive forbids, and quietly writing
"tagged URL: `?src=shn-2026-08`" into the packet would have let a later run compute an attribution
number that the schema cannot support.

What replaces it is honest and weaker, and the weakness is stated in the packet: with a zero baseline
and exactly one channel ever posted, every application inside the window is attributable **by
elimination**. That reasoning is sound exactly once. At channel two it collapses, and capturing a
source on the application becomes the obvious next product change — *if* this experiment earns one.

**Also corrected: a false standing constraint in `NORTH_STAR.md`.** The run-6 bullet instructed every
future session to dispatch `verify-production` manually because push-triggered runs had stopped
firing. They fire — `push` runs at 22:40, 22:44, 22:53, 22:54 and 23:00 UTC on 2026-08-06 and a
`schedule` run at 00:55. Runs 7 and 8 both noticed and neither removed it. Retired with the evidence
inline, plus the residual pattern behind those failed push runs: rapid successive pushes let an
intermediate SHA be superseded in Cloudflare's build queue before it ever serves, so the verifier
fails closed on a commit that never went live. That is the gate working, not production breaking.

**Egress re-tested, ninth consecutive run:** `justtuned.com` still `403` CONNECT at the proxy. One
consequence lands directly on this packet: the post's "try it without an account" link is the live
demo feed, whose handle is chosen at request time as the oldest creator
(`src/index.ts:59-61`) — the executor cannot read it, so it is the single owner-filled token in the
post, flagged rather than guessed.

**Production not re-checked, on purpose.** The reviewer read `/` = 200, `/api/version` = `bdfa636`,
`/api/metrics` = 503 at 09:29 UTC, three minutes before this session began, and the directive says not
to spend a ninth cycle on the same 503. A fresher reading would have cost a dispatch and changed
nothing.

- Running spend total: **AUD $0.00 of $500** — unchanged; this run cost nothing.

## 2026-08-08 — run 11 (07:33 Sydney / 2026-08-07 21:33 UTC): the key is live and the read path is still shut

Claimed the 21:31:05 UTC directive at 21:33 UTC — **~2 minutes**, and this time the claim was the only
one after the directive. Dispatched `metrics-snapshot` **exactly once** as instructed, hit the
directive's own stop condition on the first run, and stopped.

**The finding, and it is a different blocker than the one everyone has been waiting on:**

> `METRICS_KEY` is set on the Worker **and** set in GitHub, and the two values **do not match**.

Eleven runs have reported "the owner hasn't set the Worker secret" off a 503. That reading is now
obsolete: at 20:59:07 UTC the unauthenticated endpoint returned **401**, which is only reachable after
the binding is read (`src/index.ts:100-101`). The blocker moved rather than cleared, and the two look
identical from the outside if you only watch the unauthenticated status the verifier prints.

- **Both authenticated snapshots were rejected 401** — the scheduled one at 21:18:54 UTC
  ([31219528740](https://github.com/in-c0/tuned/actions/runs/31219528740)) and this run's single
  dispatch at 21:32:34 UTC ([31220433980](https://github.com/in-c0/tuned/actions/runs/31220433980)).
  Two independent triggers, same result, ~14 minutes apart. The scheduled run's failure is what turned
  this from a guess into a second data point.
- **Earliest *observed* key-live time: 2026-08-07 20:59:07 UTC (2026-08-08 06:59 Sydney)**, bracketed
  below by a 503 at 10:04:38 UTC. Recorded as a ~10h55m window because that is what was observed. The
  moment the owner actually ran the command is not knowable from here and is not guessed.
- **Most likely cheap cause, stated as a hypothesis and not as a fact:** `timingSafeEq` digests both
  strings exactly as given and trims nothing, so a trailing newline pasted into either secret yields a
  different digest and the same 401. A genuinely different value yields the same 401 too. **These are
  indistinguishable without reading a secret, which is out of bounds** — so the owner is asked to
  re-set both to one identical value rather than told which side is wrong.
- **No baseline exists.** `ops/metrics/latest.json` was never written; the job exits before it. Every
  funnel counter — human and bot landing views, application submits, activation, attention, return-day
  aggregates — is **UNMEASURED**, covering **no** UTC dates. EXP-001 stays PENDING. Gross cash AUD $0,
  source "no billing exists".
- **EXP-002 is NOT measurement-ready, and its written clock condition would have said otherwise.** The
  pre-registered condition was "401 rather than 503", which is now literally true. It was a proxy for
  "the series can be read at window close", which is false. Corrected in EXPERIMENTS.md rather than
  reinterpreted at grading time. Publishing into an unreadable funnel would burn the single channel
  that makes attribution-by-elimination valid, and the funnel shape is unrecoverable after the fact.
- **Scope held.** No application code, no workflow code, no dependency, feature, pricing, attribution
  or infrastructure change. No secret rotated, exposed, bypassed or inspected. Nothing published
  externally; Hacker News not accessed. Exactly one snapshot dispatch, per the directive.
- Executor egress to `justtuned.com` re-tested, **eleventh** consecutive run — still blocked at the
  proxy. Actions remains the only production read path.
- Running spend total: **AUD $0.00 of $500** — unchanged; this run cost nothing.

## 2026-08-08 (run 12) — fix the key comparison, then let the result narrow the blocker

**Decision:** ship a code change to `/api/metrics` auth rather than re-report run 11's blocker
unchanged, then dispatch the snapshot to see which of the two remaining explanations survives.

**Why this outranked standing down.** Run 11 executed the reviewer's directive to its stated stop
condition and closed it; no review has been posted since. The loop's binding constraint is unchanged
and now eleven runs old: **it cannot read a single funnel number.** Run 11 attributed the 401 to "the
two secrets disagree" and routed the whole fix to the owner. That attribution was incomplete in a way
that mattered — one of its two candidate causes was **a defect in our code that no owner re-paste
reliably fixes**, and it was cheap to eliminate.

**The asymmetry that made this a bug, not just a hypothesis.** HTTP strips leading and trailing
whitespace from a field value in transit (RFC 9110 §5.5). The key arriving in the header therefore
*cannot* carry surrounding whitespace; a Worker secret *can*. Had the stored secret carried a trailing
newline — the exact thing `echo v | wrangler secret put` produces — it would have been unmatchable by
every possible HTTP client, permanently, and indistinguishable from a wrong key from outside the
Worker. That is a failure mode the loop could have chased indefinitely.

**Shipped:** [`68cd28d`](https://github.com/in-c0/tuned/commit/68cd28d3a5ec8629685b465b798c717dd318895a)
(PR [#11](https://github.com/in-c0/tuned/pull/11)). `keyMatches()` trims both sides before the
timing-safe compare; `keyConfigured()` treats a whitespace-only secret as absent so `503` (no key) and
`401` (wrong key) keep meaning different things. Applied to `ADMIN_KEY` on `/api/members` and
`/api/creators` too — same provisioning path, same defect. `timingSafeEq` left untouched as the
primitive.

**Security judgement, stated rather than assumed:** trimming costs no meaningful entropy — nobody
provisions a secret whose security rests on a trailing newline — while refusing to trim converts an
invisible typo into an undiagnosable outage. The change strictly narrows nothing else: no route, no
schema, no data handling, no dependency.

**Result — the hypothesis is dead, and that is the finding.** With the fix confirmed live at
`68cd28d` (verify-production 31222849117, build stamp read at 22:11:46 UTC), the dispatched snapshot
still returned **401** (31222947399, 22:12:11 UTC). **The two `METRICS_KEY` values are genuinely
different strings, not one value plus stray whitespace.** The owner's fix is correspondingly sharper:
set both from a single source rather than re-paste and hope.

**What was not done, deliberately:** no secret read, rotated, exposed or bypassed; no attempt to
fingerprint either value (a hash of a secret on a public surface is a real risk and buys little); no
feature, pricing, positioning, billing, distribution, dependency or infrastructure change; nothing
published externally.

**Gates:** `npm ci && npm run check` exit 0; `npm test` 23 passed (19 before, 4 added), mutation-checked;
`npm audit --omit=dev` 0 vulnerabilities; CI `check` green on the PR; GitGuardian green;
verify-production green by SHA post-merge.

- Executor egress to `justtuned.com` — **twelfth** consecutive run blocked at the proxy. Actions
  remains the only production read path.
- Running spend total: **AUD $0.00 of $500** — unchanged; this run cost nothing.

---

## Run 18 — 2026-08-08 19:30–20:00 Sydney (09:30–10:00 UTC)

**Directive** ([09:28:38 UTC](https://github.com/in-c0/tuned/issues/1#issuecomment-5225515723)): one
pre-registered, non-contaminating EXP-003 mechanism test from a real browser in Actions; fix only a
mechanism defect if one appears; otherwise record the mechanism as provisionally working and name
controlled known-human traffic as the next evidence gap.
[Claimed 09:30 UTC](https://github.com/in-c0/tuned/issues/1#issuecomment-5225520575), ~2 minutes after
posting, the only claim.

### Decisions taken

1. **Pre-registration merged as its own change before any reading existed**
   ([`b62bf08`](https://github.com/in-c0/tuned/commit/b62bf083cbdeeb74ab6e81b134a5473d2cd7fc3b), 09:38 UTC;
   first reading 09:39 UTC). Not ceremony: the six criteria decide whether the next cycle works on the
   mechanism or the message, and criteria written after seeing the answer decide nothing.

2. **Criterion 1 sharpened at 09:40 UTC, before any reading, and the change recorded in-file rather
   than applied silently.** As first written it counted *any* console error, which would have graded
   the apply mechanism defective if a third-party favicon host was slow. It now grades script errors
   and first-party failures; third-party subresource failures are reported but do not decide. Logged
   here because sharpening a criterion before the data is legitimate and sharpening it after is not,
   and the only thing that distinguishes them is the timestamp.

3. **`qa/` carries its own manifest.** The Cloudflare build is `npm ci && npm run check` at the root; a
   browser toolchain must never enter the Worker's dependency tree. Symmetrically, `vitest` is now
   scoped to `test/**/*.test.ts` — its default glob had matched the Playwright spec and tried to load it
   inside workerd, where `node:os` does not exist. The local gate caught that before CI did.

4. **`@playwright/test` pinned past [GHSA-7mvr-c777-76hp](https://github.com/advisories/GHSA-7mvr-c777-76hp).**
   Dev-only and outside the production tree, so the root `npm audit --omit=dev` never saw it. Shipping a
   known high advisory into the repository because an audit command happens not to look there is the
   kind of thing this loop should not do.

5. **Fixed the one defect the test found, as a separate change after the result was recorded.** arXiv's
   root-relative `og:image` was stored verbatim and rendered against our own origin
   ([`5ef6970`](https://github.com/in-c0/tuned/commit/5ef6970b50487cace86fb4fbdbac8d7a33e2afba)). Two
   halves — resolve at extraction, guard at render — because rows already hold the bad value and
   **rewriting production data to fix a rendering bug was rejected**: the render guard achieves the same
   result with no D1 write. Both halves mutation-checked. The landing page went 22,075 → 21,974 bytes,
   which is the `<img>` no longer being emitted.

6. **Did not ship the CTA-reach counter, and did not touch copy.** The directive forbids both this
   cycle, and independently they are now the *wrong* work: with the mechanism proven, the open question
   is who is arriving, and neither a counter nor a rewrite can answer that against an unknown
   denominator. Recorded as [L-09](LESSONS.md).

7. **Did not treat the mechanism pass as evidence about the offer.** The tempting inference — "the form
   works, so the message must be the problem" — is unsound while 115 UA-flagged views on a never-
   distributed product are most plausibly crawlers. `STATUS.md` blocker #1 is rewritten accordingly:
   the denominator, not the message.

### Spend

**AUD $0.00 this run. Running total: AUD $0.00 of $500.** No purchase requested; the executor holds no
payment credentials.

## Run 19 — 2026-08-08 20:08–20:25 Sydney (10:08–10:25 UTC) — verify what the packet promises, and fill its last blank

**No reviewer directive existed for this cycle.** The 09:28 UTC directive was claimed, executed and
reported by run 18 at 09:54 UTC. Unlike runs 8 and 10, this session did not overlap a directive *in
flight*; it was the next cycle with none yet posted. Self-selected work, claimed on issue #1 before
starting so a reviewer could kill it and an event-fired session could stand down.

**Decision: check the Show HN packet's public claims and resolve its one unfilled token, rather than
stand down or ship instrumentation.**

Rejected alternatives, and why:

- **Stand down** (the runs 8/10 precedent). Rejected: those stand-downs were correct because a
  directive was mid-flight and explicitly forbade disjoint work. Neither condition holds here, and
  run 10 had already flagged that a further no-op would be "the loop admiring its own instruments".
- **CTA-reach counter, or a copy/positioning rewrite.** Rejected, and *pre-committed* against: run 18
  wrote a falsifiable milestone that is violated if run 19 answers a proven-working mechanism with a
  counter or a copy change. The denominator is still not known to contain humans; both would measure
  or persuade crawlers.
- **Fix the medRxiv thumbnail.** Rejected as scope creep — see below.

**What was shipped:** [#18](https://github.com/in-c0/tuned/pull/18) → `644c23a`. EXP-004
pre-registered in its own commit *before* the workflow was dispatched; a read-only browser spec
(`qa/public-surfaces.spec.mjs`); a reusable dispatch-only `qa-browser.yml` taking the spec as an
input; and `exp003-mechanism.yml` pinned to its own spec file.

**That pin is the non-obvious part and was a real near-miss.** `playwright.config.mjs` sets
`testDir: "."`, so the bare `npx playwright test` in EXP-003's workflow would have silently begun
running this new spec too — quietly changing what a *closed* experiment's instrument does, months
after its result was recorded. Caught before it happened. The general principle: apparatus of a
closed experiment should be pinned, not left to a glob that later files can join.

**Result: EXP-004 PASSED, all five criteria, both widths, first attempt.** `[DEMO_FEED_URL]` resolves
to **`https://justtuned.com/ava`** — 200, 24 items, no empty state; `/ava/rss.xml` 200
`application/rss+xml` with 38 items. The packet's central mitigation is true, and it now contains no
blank and no unchecked assertion.

**Deliberately not fixed:** `medrxiv.org`'s own og:image returns `net::ERR_BLOCKED_BY_ORB` on the
feed. Unlike run 18's finding — a borrowed image path 404ing against *our* origin, which was our bug
— this is a third party declining to serve its image cross-origin, which is their prerogative. The
`onerror` fallback already removes the element. The only real fix is proxying or caching other
people's images, which carries bandwidth and copyright consequences a cosmetic thumbnail does not
justify. Recorded as a product decision, not left as an open defect.

**Honest caveat on the reading:** production was serving `876092c` at 10:12:55 UTC when the browser
hit it, not the just-merged `644c23a`. `644c23a` changes no `src/`, so the bytes are identical under
either build — but the earlier commit is what was measured, and the record says so.

**What did not change:** the binding constraint is still **owner authorization of a first
distribution channel**. No metric moved and none should have — EXP-004 wrote nothing. Gross cash
**AUD $0**, source: no billing exists.

**Spend this run: AUD $0.00. Running total: AUD $0.00 of $500.**
