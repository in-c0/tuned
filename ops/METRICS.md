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
  effect for this environment. Re-tested, not assumed.

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
