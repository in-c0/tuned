# Metrics

Every metric here must name its source. Never invent, extrapolate, or manually inflate a number. If a metric cannot be sourced yet, it stays listed as UNMEASURED.

## Definitions

- **Applications submitted** — `totals.applications` (rows in `waitlist`) and the `application_submit` daily counter. Source: `GET /api/metrics`, snapshotted to `ops/metrics/latest.json`.
- **Members activated** — `retention.members_ever_active`: members with ≥1 row in `member_days`. Source: `/api/metrics`.
- **Attention events** — `attention_star` / `attention_skip` daily counters, and `totals.stars` / `totals.skips`. Source: `/api/metrics`.
- **Return use** — `retention.members_returned_after_first_day` and `members_active_2plus_days`, computed from distinct `member_days.day` per member. Source: `/api/metrics`.
- **Landing views** — `landing_view` (non-bot by user-agent heuristic) vs `landing_view_bot`. A UA heuristic is not proof of a human; report both, never merge them, and never call `landing_view` "verified human traffic".
- **Human traffic** — Cloudflare `/cdn-cgi/rum` or Worker-side instrumentation only. Raw CF request counts are scanner-dominated and must never be cited as human traffic.
- **Gross cash collected** — payment provider records only. Currently **$0 and unmeasurable: no billing exists**. No other source may ever back this number.

## Read path (added 2026-08-06, run 2)

`GET /api/metrics` returns aggregate counts only — no emails, member ids, handles, URLs or item
content — gated by the `METRICS_KEY` Worker secret and failing closed (503) when it is unset.

The executor has **no egress to justtuned.com** (re-confirmed run 2: 403 CONNECT at the proxy) and
no Cloudflare credentials, so it cannot call that endpoint itself. `.github/workflows/metrics-snapshot.yml`
is the bridge: daily at 06:40 Sydney it fetches the endpoint and commits the JSON to `ops/metrics/`,
where the executor reads it as a file. **This requires the owner to set `METRICS_KEY` in two places
(Worker secret + GitHub Actions repository secret); until then the workflow skips and every metric
below stays UNMEASURED.**

Counters start at zero on the deploy that introduced them. There is no backfill and none will be
invented: history before that deploy does not exist.

## Measurement audit — 2026-08-06 (run 1)

Funnel stage by stage, with whether a source exists **and** whether the executor can read it.

| Stage | Recorded in | Executor can read? |
| --- | --- | --- |
| Landing view | **nothing** — no view instrumentation exists | n/a |
| Application / waitlist | `waitlist` table | no — no CF credentials |
| Approval → member | `members` row | no |
| Member login | **nothing** — no login/session event log | n/a |
| Feed creation | `creators` row | no |
| First find | `items` row | no |
| Star / skip | `reads` table (`action`, `created_at`) | no |
| Return visit | `members.last_desk_at` — **single overwritten timestamp** | no |
| Payment | **does not exist** | n/a |

Four gaps, ordered by how much they block learning:

1. **Return/retention is structurally unmeasurable.** `last_desk_at` is overwritten on each visit, so D1/D7 return and repeat-use — the core retention evidence the decision hierarchy asks for — can never be computed from the current schema, even with database access. Fixing this needs an additive visit-event table, not a query.
2. **Landing → application conversion is unmeasurable.** No view instrumentation. Cloudflare request counts are scanner-dominated and must never be substituted (see Human traffic above).
3. **No executor read path to D1.** `wrangler whoami` reports unauthenticated in the routine session, by design — the Git-based pipeline exists so the executor never holds Cloudflare credentials. Consequence: every table-sourced metric below stays UNMEASURED until the owner supplies a read path or pastes query output into issue #1.
4. **No payment path**, so gross cash stays $0 and unmeasurable.

## Snapshots

_Append dated snapshots below; each line cites its source query._

### 2026-08-06 (run 1)

- Applications submitted — UNMEASURED (no executor read path to D1).
- Members activated — UNMEASURED (same).
- Attention events — UNMEASURED (same).
- Human traffic — UNMEASURED (no instrumentation exists).
- Gross cash collected — **$0**, source: no billing exists. Not an estimate.
- Production reachability from the routine session — **blocked**: `justtuned.com:443` returns 403 at the egress proxy (CONNECT policy denial), so post-deploy verification cannot be performed from here. Recorded, not worked around.

### 2026-08-06 (run 2)

Instrumentation shipped; no production numbers yet. Every metric remains **UNMEASURED** — the
`METRICS_KEY` secret does not exist, so the snapshot workflow has never produced a file, and no
elapsed time has passed since deploy in any case.

- Applications submitted — UNMEASURED (awaiting first snapshot).
- Members activated / return use — UNMEASURED (awaiting first snapshot).
- Attention events — UNMEASURED (awaiting first snapshot).
- Landing views — UNMEASURED (counter live from this deploy forward; no snapshot yet).
- Gross cash collected — **$0**, source: no billing exists. Not an estimate.
- Production reachability from the routine session — still **blocked**: `justtuned.com:443` returns
  403 CONNECT at the egress proxy. The allowlist widening reported on 2026-08-06 evening is not in
  effect for this environment. Re-tested, not assumed. `*.workers.dev` is blocked too, so
  Cloudflare preview URLs are not a way around it.
- Post-deploy production verification — **PASS**, via `.github/workflows/verify-production.yml`
  run [31097100466](https://github.com/in-c0/tuned/actions/runs/31097100466) (2026-08-06 11:26 UTC):
  justtuned.com HTTP 200 and rendering, `/api/metrics` HTTP 503 without a key (fails closed,
  `METRICS_KEY` not yet set), /terms and /privacy HTTP 200. The 404 → 503 transition on
  `/api/metrics` is the evidence the telemetry build is actually live — that route did not exist
  before this deploy. The executor cannot reach production directly, so this workflow is now how
  the loop verifies deployments at all.

Post-deploy funnel table, updated:

| Stage | Recorded in | Executor can read? |
| --- | --- | --- |
| Landing view | `metric_days.landing_view` / `landing_view_bot` | via snapshot, once `METRICS_KEY` is set |
| Application / waitlist | `waitlist` + `metric_days.application_submit` | same |
| Approval → member | `members` | same |
| Member login | `metric_days.member_login` | same |
| Feed creation | `creators` | same |
| First find | `items` | same |
| Star / skip | `reads` + `metric_days.attention_star` / `attention_skip` | same |
| Return visit | `member_days` — **one row per member per active day, no longer overwritten** | same |
| Payment | **does not exist** | n/a |

## Run 3 addendum (2026-08-06 ~21:40 Sydney) — telemetry is now verified, not merely deployed

No new metric is claimed this run. What changed is the **trustworthiness** of the metrics that are
about to arrive.

- **17 tests** (`test/metrics.test.ts`, PR #4 → `f49c4dc`) run the telemetry path in **workerd against
  a real local D1** — the same runtime and SQL engine production uses, no credentials, no network.
  They pin the `ON CONFLICT` accumulation, per-name/per-day keying, `member_days` retention
  arithmetic, bot classification, the aggregate payload containing no identifier, `/api/metrics`
  auth in all three states, and that live requests to `/` and `POST /waitlist` actually increment.
- **Mutation-checked:** breaking the upsert to `DO UPDATE SET count = 1` was confirmed to fail the
  accumulation test. The suite catches the failure it exists for.
- **Consequence for reading the first snapshot:** a zero is now interpretable. Because
  `src/metrics.ts` swallows every error by design, a zero previously could have meant either "no
  traffic" or "the counters never worked", with no way to tell from the outside. It now means
  **no traffic** — a distribution finding, not an instrumentation failure.
- Everything above still reads **UNMEASURED**: `METRICS_KEY` is unset, so no snapshot exists yet.
  That is an owner auth step, not an executor blocker to work around.

### 2026-08-06 (run 5) — first snapshot attempted; every metric still UNMEASURED

The read path was exercised end to end for the first time. It failed on the Worker side, and the
failure is precisely located, so this is a diagnosis rather than an unknown.

- Applications submitted — **UNMEASURED**.
- Members activated / return use — **UNMEASURED**.
- Attention events — **UNMEASURED**.
- Landing views — **UNMEASURED**.
- Gross cash collected — **$0**, source: no billing exists. Not an estimate.

**Why, exactly:** `metrics-snapshot.yml` was dispatched twice
([31098737983](https://github.com/in-c0/tuned/actions/runs/31098737983) 11:48 UTC,
[31099758384](https://github.com/in-c0/tuned/actions/runs/31099758384) 12:03 UTC). Both reached
production and both got **HTTP 503 `{"error":"metrics key not configured"}`**. That branch
(`src/index.ts:89`) fires only when `c.env.METRICS_KEY` is *absent* — a wrong value returns 401 — so
the binding does not exist on the running Worker. The runner env shows `METRICS_KEY: ***`, so the
**GitHub repository secret is correctly set and passed**; only the Cloudflare Worker secret is
missing. Two fresh deploys (`82f069d`, `51a51ad`) in between rule out a stale version.

`ops/metrics/` therefore still does not exist. **No number in this file has been observed yet, and
none is asserted.**

- Production reachability from the routine session — still **blocked** (fifth consecutive run):
  `justtuned.com:443` returns 403 CONNECT at the egress proxy. Re-tested, not assumed.
- Post-deploy production verification — **PASS** at `82f069d`, via
  [run 31098869474](https://github.com/in-c0/tuned/actions/runs/31098869474) (11:52 UTC): site HTTP 200
  and rendering (22,075 bytes), `/api/metrics` refuses unauthenticated callers, /terms and /privacy
  HTTP 200.

### 2026-08-07 (run 6) — still UNMEASURED; and one previously-reported result weakened

- Applications submitted — **UNMEASURED**.
- Members activated / return use — **UNMEASURED**.
- Attention events — **UNMEASURED**.
- Landing views — **UNMEASURED**.
- Gross cash collected — **$0**, source: no billing exists. Not an estimate.

`METRICS_KEY` is still not on the live Worker. Third dispatch of `metrics-snapshot.yml`
([31128798514](https://github.com/in-c0/tuned/actions/runs/31128798514), 2026-08-06 22:09 UTC):
**HTTP 503 `{"error":"metrics key not configured"}`**, runner env showing `METRICS_KEY: ***`.
`ops/metrics/` still does not exist. EXP-001's 48h window has still not started.

**Correction to how earlier "production verified" lines should be read.** Runs 2–5 reported
post-deploy verification as PASS. Those readings were taken after a fixed `sleep 120` plus a
freshness gate that had stopped discriminating — `/api/metrics` returning non-404 proved the route
existed, which by then every version satisfied. The site was up in each case; what was *not*
established is that the version answering was the one just pushed. From run 6's deploy onward,
`verify-production.yml` polls `/api/version` for the exact `github.sha` and fails closed if it never
appears, so "verified" means the expected build was measured. Prior PASS lines stand as
"production was healthy", not as "the new build was healthy".

- Production reachability from the routine session — still **blocked** (sixth consecutive run):
  403 CONNECT at the egress proxy. Re-tested, not assumed.
