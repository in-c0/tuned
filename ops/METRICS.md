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

## Verification evidence quality — corrected 2026-08-07 (run 6)

Every "post-deploy production verification PASS" recorded in this file from `feb6c4f` onward was
**weaker than it read**. `verify-production.yml` established freshness by waiting for `/api/metrics`
to stop returning 404 — valid only for the single deploy that introduced that route. Once every
version carried it, the wait returned on its first attempt against whatever was already serving, so
the health results that followed described *a* live Worker, not provably *the expected* one. The old
gate was reconstructed and run against a stale-but-healthy version: it reports `deploy is live` and
exits 0.

What this does and does not change:

- **Does not change any metric.** Every funnel metric below remains **UNMEASURED**, and the site was
  in fact healthy at each check — the readings were true, just not proof of *which build* was true.
- **Does not weaken the `METRICS_KEY` diagnosis.** That conclusion rested on two independent deploys
  agreeing plus the 503-vs-401 distinction in the endpoint, not on any single reading's freshness.
- **Does change what "verified" means from run 6 forward.** `/api/version` now reports the commit the
  Worker was built from, and the verifier requires it to equal the pushed SHA before evaluating
  health. If it never matches within 8 minutes the job fails and the health steps do not run.

Recorded here rather than quietly fixed because this file's rule is that a metric names its source:
the source of "production verified" was weaker than the claim, and the correction belongs in the log.

## First verification that proves version identity — 2026-08-07 08:22 Sydney (22:22 UTC)

[verify-production run 31128940649](https://github.com/in-c0/tuned/actions/runs/31128940649),
expecting `8fc52ce`:

```
attempt 1: serving 'b8a1277...', expecting '8fc52ce...' — waiting 20s
attempt 2: serving 'b8a1277...', expecting '8fc52ce...' — waiting 20s
Expected commit 8fc52ce3a57606f0dc3ddd4dae216d1d9d2c7d10 is live (attempt 3).
justtuned.com: HTTP 200, landing page rendered (22075 bytes)
/api/metrics without a key: HTTP 503 — METRICS_KEY is not configured yet; endpoint fails closed.
/terms: HTTP 200
/privacy: HTTP 200
```

The two waiting lines are the whole point: for 40 seconds the **previous** version was serving, and
the verifier refused to evaluate health against it. The old gate would have returned on its first
attempt and recorded that as "production verified green" for `8fc52ce`. This is now the first entry
in this file where "verified" names a specific build and can be checked.

It also confirms the stamp chain end-to-end in Cloudflare's real build container: `b8a1277` and
`8fc52ce` were each reported correctly by the Worker built from them.

**`METRICS_KEY` remains absent from the live Worker** — 503 `metrics key not configured` at 22:09,
22:17 and 22:22 UTC, roughly ten hours after the owner reported setting it. Every funnel metric is
still **UNMEASURED**; `ops/metrics/` still does not exist. Gross cash: **$0**, source "no billing
exists", not an estimate. EXP-001's 48-hour window still has not started.

### Verified again at the tip — 2026-08-07 08:27 Sydney (22:27 UTC)

[verify-production run 31128995250](https://github.com/in-c0/tuned/actions/runs/31128995250) passed at
`7a140c6`: site HTTP 200 (22,075 bytes), `/terms` and `/privacy` 200, `/api/metrics` **503** to an
unauthenticated caller. So every commit shipped in run 6 is verified live by SHA, not by timing.

One correction worth keeping, because a claim was made from it and retracted: the run **completed in
~90 seconds**, but `get_check_run` and `list_workflow_jobs` reported it `in_progress` for roughly
fifteen minutes afterwards, and this session posted a hedge to issue #1 on the strength of that stale
reading. The job-log endpoint 404s until a run has genuinely finished, which makes it the reliable
source. See the standing note in NORTH_STAR.md.

`METRICS_KEY` state at this reading: still **absent** (503, fourth confirmation tonight).

## The key went live, and the read path still fails — 2026-08-08 07:33 Sydney (2026-08-07 21:33 UTC), run 11

Two things happened between runs, and they are easy to conflate. They must not be:

1. **The Worker's `METRICS_KEY` is now set.** Confirmed, not assumed.
2. **The snapshot read path still returns 401.** The GitHub repository secret does **not** match it.

### Earliest *observed* key-live time: 2026-08-07 20:59:07 UTC (2026-08-08 06:59 Sydney)

Not the time the owner set it — that is unobservable from here and is deliberately not guessed. This
is the earliest reading in which the endpoint proved the binding exists, bracketed by the last reading
that proved it did not:

| UTC | Run | Unauthenticated `/api/metrics` | Reading |
| --- | --- | --- | --- |
| 2026-08-07 10:04:38 | [verify-production 31168583286](https://github.com/in-c0/tuned/actions/runs/31168583286) | **503** `metrics key not configured` | binding absent (tenth consecutive) |
| 2026-08-07 20:59:07 | [verify-production 31218170468](https://github.com/in-c0/tuned/actions/runs/31218170468) (scheduled) | **401** | **binding present — first observation** |

```
/api/metrics without a key: HTTP 401 — key is set and the endpoint is closed.
```

So the key was set somewhere inside a ~10h55m window ending 20:59:07 UTC. The window is reported as a
window; narrowing it further would require a Cloudflare audit log the executor cannot read.

### The failing boundary: the two secrets are both set and are not equal

`metrics-snapshot` ran twice against the live key — once on its own schedule, once dispatched by this
run — and both authenticated calls were rejected:

| UTC | Run | Trigger | Authenticated result |
| --- | --- | --- | --- |
| 2026-08-07 21:18:54 | [metrics-snapshot 31219528740](https://github.com/in-c0/tuned/actions/runs/31219528740) | schedule | **401** `{"error":"unauthorized"}` |
| 2026-08-07 21:32:34 | [metrics-snapshot 31220433980](https://github.com/in-c0/tuned/actions/runs/31220433980) | this run's single dispatch | **401** `{"error":"unauthorized"}` |

Both job logs show `METRICS_KEY: ***` in the step env, so the GitHub half is populated. The Worker half
is populated too, or the response would have been 503 (`src/index.ts:100` returns 503 *before* any
comparison; 401 is only reachable at `src/index.ts:101`, after the binding is read). **The 401 is
therefore not "no key" on either side — it is two keys that disagree.**

One narrower cause is worth naming because it is the most common and the cheapest to rule out:
`timingSafeEq` (`src/index.ts:35-42`) SHA-256s the two strings exactly as given and compares digests.
Nothing trims. A trailing newline or space pasted into either secret produces a different digest and
an identical 401. From here the two cases are indistinguishable — telling them apart would require
reading a secret value, which is out of bounds and was not attempted.

**No snapshot was written.** The workflow exits before `ops/metrics/latest.json` is created, so the
file still does not exist at master and **every funnel metric remains UNMEASURED**: landing views
(human and bot), application submits, activation, attention counters and return-day aggregates are all
unread, and no UTC date range is covered. Gross cash **AUD $0**, source "no billing exists" — not an
estimate, not a forecast. Zero remains zero, and no conversion, retention or demand is inferred from a
funnel that has never been read.

Neither secret was rotated, exposed, bypassed or inspected. Production health at 20:59:07 UTC was
otherwise green at `8396a895`: `/` HTTP 200 (22,075 bytes), `/terms` 200, `/privacy` 200.
