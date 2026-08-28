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

## The whitespace hypothesis is eliminated — 2026-08-08 08:12 Sydney (2026-08-07 22:12 UTC), run 12

Run 11 named a "narrower cause worth naming because it is the most common and the cheapest to rule
out": stray whitespace in one of the two secrets, which `timingSafeEq` would digest as a difference.
It then handed the whole question to the owner, because telling the two cases apart appeared to need a
secret value.

It did not. It needed a code change, and the change was worth making on its own merits.

### Why this was a defect and not only a hypothesis

The two sides of the comparison are **not symmetric**. HTTP strips leading and trailing whitespace
from a field value in transit ([RFC 9110 §5.5](https://www.rfc-editor.org/rfc/rfc9110#section-5.5)),
so the key arriving in `x-metrics-key` can never carry surrounding whitespace — no client can send it.
A Worker secret can: `echo v | wrangler secret put` stores the trailing newline, and a dashboard paste
can carry either. Had that been the state, the stored key would have been unmatchable by **every
possible HTTP client**, forever, with no way to see it from outside the Worker.

`68cd28d` trims both sides before the timing-safe compare and treats a whitespace-only secret as
absent rather than as a key (so `503` still means "no key" and `401` still means "wrong key"). Four
tests cover it and were mutation-checked: the two whitespace cases fail against the previous
comparison and pass against this one.

### The result, and it is a negative one

| UTC | Run | Serving commit | Authenticated result |
| --- | --- | --- | --- |
| 2026-08-07 22:12:11 | [metrics-snapshot 31222947399](https://github.com/in-c0/tuned/actions/runs/31222947399) | `68cd28d` (fix live) | **401** `{"error":"unauthorized"}` |
| 2026-08-07 22:13:49 | [metrics-snapshot 31223053290](https://github.com/in-c0/tuned/actions/runs/31223053290) | `68cd28d` (confirmation) | **401** `{"error":"unauthorized"}` |

`68cd28d` was confirmed serving at 22:11:46 UTC by
[verify-production 31222849117](https://github.com/in-c0/tuned/actions/runs/31222849117), which reads
the build stamp at `/api/version` — so the 401 above was answered by a Worker that trims.

**Therefore the two `METRICS_KEY` values differ by more than surrounding whitespace.** They are
genuinely different strings. This is worth stating plainly because it changes the owner's fix from
"re-paste and hope it was a newline" to "these are two different values; set both from one source".

### What is still unmeasured

**Everything.** `ops/metrics/latest.json` still does not exist at master; the job exits before writing
it. Human and bot landing views, application submits, activation, attention counters and return-day
aggregates are **all unread, covering no UTC dates**. Gross cash **AUD $0**, source "no billing
exists" — not an estimate. Zero remains zero, and nothing about conversion, retention or demand is
inferred from a funnel that has never once been read.

Neither secret was rotated, exposed, bypassed or inspected at any point.

## 2026-08-08 (run 16) — **the first baseline. Every number below was observed.**

Source: `ops/metrics/latest.json` at [`a00a8fe`](https://github.com/in-c0/tuned/commit/a00a8fe0da9989cee53ec5800fa0a0f01229fdf9),
`generated_at` `2026-08-08T07:35:20.373Z`, written by snapshot run
[31246496587](https://github.com/in-c0/tuned/actions/runs/31246496587) (job `93075870711`, checkout
`3b9dcac`, authenticated **HTTP 200**). The key is synchronized; the read path works end to end.

**Coverage: 3 UTC days**, 2026-08-06 → 2026-08-08. The last day is **partial**, ending 07:35 UTC.
Counters begin at the `feb6c4f` deploy (2026-08-06); there is no history before it and none is invented.

### Daily counters, exactly as recorded

| UTC day | `landing_view` | `landing_view_bot` | `feed_view` | `feed_view_bot` |
| --- | --- | --- | --- | --- |
| 2026-08-06 | 29 | 15 | 5 | — |
| 2026-08-07 | 69 | 23 | 2 | 5 |
| 2026-08-08 (to 07:35) | 17 | 4 | — | — |
| **total** | **115** | **42** | **7** | **5** |

A dash means the counter recorded **no rows for that day**, which is a zero, not a missing reading.

**Five counters have never fired at all**, on any day: `application_submit`, `member_login`,
`desk_view`, `attention_star`, `attention_skip`. Their absence is the finding of this snapshot.

### Funnel, stage by stage

| Stage | Metric | Observed |
| --- | --- | --- |
| Landing view | `landing_view` (UA-heuristic human) | **115** over 3 days |
| Application submit | `application_submit` / `totals.applications` | **0** — never fired; `waitlist` empty all-time |
| Member activation | `retention.members_ever_active` | **0** of `members_total` = **1** |
| Meaningful attention action | `attention_star` / `attention_skip` | **0** since instrumentation |
| Repeat visit | `members_active_2plus_days`, `members_returned_after_first_day` | **0**, **0** |
| Active last 7d / 28d | `active_last_7d`, `active_last_28d` | **0**, **0** |
| Payment | payment-provider records | **AUD $0** — no billing exists |

**Landing → application conversion: 0 / 115 = 0.0%.** Stated with its uncertainty, because "0%" alone
overclaims: with zero events in 115 trials the one-sided 95% upper bound is **~2.6%**. The honest
reading is *not measurably above zero, and certainly not high* — not *proven to be exactly zero*.

### Two readings that must not be conflated

1. **`totals.stars` = 8 and `totals.skips` = 33 are all-time `reads` rows** (`src/metrics.ts:143-144`),
   accumulated **before** instrumentation existed. The `attention_star` / `attention_skip` **daily
   counters are empty**. So: attention actions have happened in this product's lifetime, and **none
   has happened since 2026-08-06**. The same applies to 79 public items, 27 queued, 5 feeds and 1
   member — inventory, not activity.
2. **115 human-flagged landing views is not 115 humans, and is not demand.** The product has never
   been posted to any channel (`outreach/creator-shortlist.md`: nobody contacted; EXP-002 unpublished).
   Traffic with no distribution is most plausibly crawlers the UA heuristic missed, plus the owner and
   the loop's own verification runs. The correct thing this number proves is **that the counters work**.

### What this changes

The pre-registered fork in EXP-001 — "a zero reading means genuinely no traffic, which would redirect
the loop from measurement to distribution" — **does not fire**. Views are non-zero. The constraint the
data actually points at is one stage later: **arrival → application is 0%**, and the funnel cannot yet
say why, because no counter distinguishes *saw the page* from *saw and understood the call to action*.

Gross cash: **AUD $0**, source "no billing exists" — not an estimate. Autonomous spend: **AUD $0.00 of
$500**. No conversion, retention, demand or traction claim is made beyond the table above.

Executor egress to `justtuned.com` re-tested this run — still **403 CONNECT** at the proxy, sixteenth
consecutive run. GitHub Actions remains the production read path, and it has now proven itself.

---

## Run 26 snapshot — 2026-08-10 22:18:30 UTC (2026-08-11 08:18 Sydney)

**The read path is unfrozen.** Source: `ops/metrics/latest.json` at
[`92ff81e`](https://github.com/in-c0/tuned/commit/92ff81e), from
[snapshot run 31437732863](https://github.com/in-c0/tuned/actions/runs/31437732863). Covers **5 UTC
days**, 2026-08-06 → 2026-08-10.

**Provenance, stated first because it changes how one row should be read.** The zone was still
answering `403 cf-mitigated: challenge`, so this was read through the Worker's own `workers.dev`
origin. That does not affect the values — the counters are D1 state and the route used to read them
is irrelevant. The commit message records the vantage so this is never guessed at later.

| | 08-06 | 08-07 | 08-08 | 08-09 | 08-10 | total |
| --- | --- | --- | --- | --- | --- | --- |
| `landing_view` (UA-heuristic human) | 29 | 69 | 56 | 56 | 75 | **285** |
| `landing_view_bot` | 15 | 23 | 43 | 7 | 15 | **103** |
| `feed_view` | 5 | 2 | 3 | 8 | 14 | **32** |
| `feed_view_bot` | 0 | 5 | 2 | 4 | 9 | **20** |
| `application_submit` | 0 | 0 | 0 | 0 | 0 | **0** |

**Five counters have still never fired:** `application_submit`, `member_login`, `desk_view`,
`attention_star`, `attention_skip`. `members_ever_active` = **0** of 1. `members_returned_after_first_day`,
`active_last_7d`, `active_last_28d` — all **0**.

**Landing → application: 0 / 285 = 0.0%**, 95% one-sided upper bound ~1.1% (was ~1.4% at n=207).
The bound tightens; the estimate does not move. Zero remains zero.

**On 08-10 being the highest day (75), and why it is not a signal.** It is tempting, on the day the
read path comes back, to read the biggest number in the table as the loop's first upward trend. Two
independent reasons not to. First, the standing one: nothing has been published to any channel, so
arrivals to a site with no distribution are most plausibly crawlers the UA heuristic did not catch.
Second, new this run: **the day is censored.** The zone began refusing clients partway through
2026-08-10 UTC, and a request stopped at the edge never reaches the Worker and is never counted. So
08-10 is a partial count of an interrupted day. A number that is both possibly-inflated-by-bots and
definitely-truncated-by-an-outage supports no direction at all.

**Inventory, not activity** (predates instrumentation): 79 public items, **42 queued** (27 at the
last reading — the `*/30` cron kept ingesting straight through the outage, which is independent
evidence the Worker never stopped), 5 feeds (1 human / 4 agent), 8 stars, 33 skips, 1 member,
0 followers, 1 connection.

**Gross cash: AUD $0.** Source: *no billing exists* — not an estimate, not a forecast.
**Autonomous spend: AUD $0.00 of $500.**

---

## Run 31 snapshot — 2026-08-12 21:24:27 UTC (2026-08-13 07:24 Sydney)

**Two readings behind, now caught up.** Source: `ops/metrics/latest.json` at
[`567dad0`](https://github.com/in-c0/tuned/commit/567dad0), from the scheduled
[snapshot run 31642357056](https://github.com/in-c0/tuned/actions/runs/31642357056). Covers **7 UTC
days**, 2026-08-06 → 2026-08-12. Read through the **public zone** — `zone_blocked=false` on the same
day's [verify production run 31640663090](https://github.com/in-c0/tuned/actions/runs/31640663090).

| | 08-06 | 08-07 | 08-08 | 08-09 | 08-10 | 08-11 | 08-12 | total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `landing_view` (UA-heuristic human) | 29 | 69 | 56 | 56 | 84 | 71 | 66 | **431** |
| `landing_view_bot` | 15 | 23 | 43 | 7 | 18 | 26 | 8 | **140** |
| `feed_view` | 5 | 2 | 3 | 8 | 14 | 15 | 15 | **62** |
| `feed_view_bot` | 0 | 5 | 2 | 4 | 9 | 32 | 6 | **58** |
| `application_submit` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |

**08-12 is partial.** The snapshot was taken at 21:24 UTC, so roughly two and a half hours of that day
are missing from every column. It will be revised upward and that revision will not be a trend.

**08-11 was revised upward exactly the same way, which is the point of saying it twice.** The run-29
reading caught that day at 09:33 UTC and recorded 39 human-flagged and 11 bot-flagged landing views
with 0 human-flagged feed views. Finished, the day is **71 / 26 / 15**. Nothing arrived that was not
already arriving; a third of a day was read as if it were a whole one. Any reading taken before a UTC
day closes is a floor, not a count.

**Five counters have still never fired:** `application_submit`, `member_login`, `desk_view`,
`attention_star`, `attention_skip`. `members_ever_active` = **0** of 1.
`members_returned_after_first_day`, `active_last_7d`, `active_last_28d` — all **0**.

**Landing → application: 0 / 431 = 0.0%**, 95% one-sided upper bound ~0.7% (was ~0.9% at n=333, ~1.1%
at n=285). The bound tightens with the denominator and the estimate does not move — but the
denominator is UA-classified requests, not people, so this is not yet a conversion rate about humans.
**The 08-10 and 08-11 counts also remain censored** by the Bot Fight Mode window: a request stopped at
the edge never reached the Worker and was never counted. Both caveats travel with these numbers into
EXP-002's grading. **Superseded 2026-08-13 (run 34): EXP-002 will never be graded** — the packet was
withdrawn as inadmissible on the venue's own rules and the experiment is `INVALIDATED / NOT STARTED`.
Both caveats now travel with these numbers into **whatever first channel is authorized next**, and
none of the figures on this page may be attributed to, or read against, the killed Show HN attempt.
The zero baseline is intact and unspent.

**Inventory, not activity** (predates instrumentation): 79 public items, 42 queued, 5 feeds
(1 human / 4 agent), 8 stars, 33 skips, 1 member, 0 followers, 1 connection.

**A new observation, recorded but not acted on this run: nothing has been published in five days, and
nothing has been queued in two.** Across every committed snapshot — 08-08, 08-09, 08-10, 08-11,
08-12 — `items_public` is **79**, unchanged. `items_queued` went 27 → 27 → **42** → 42 → 42: one jump
on 08-10 and flat since. Stars and skips are frozen at 8 and 33, but those need a member and there is
effectively none, so they say nothing.

Two readings fit and this run does not choose between them. Either the queue → public step requires a
selection action nobody has taken (in which case the numbers are correct and the desk is simply
unattended), or ingestion and publication have stalled. **This matters more than its size suggests:**
Tuned's promise is a feed of fresh attention, and `/ava` is the only surface a stranger can currently
use without applying. **Run 34 raised its priority rather than lowering it:** the Show HN packet was
withdrawn partly because it pointed at an application-gated landing page, so the question of whether
Tuned has a *directly usable destination* worth pointing anyone at is now the question in front of the
loop — and a five-day-stale feed is a poor answer to it. It remains the leading engineering candidate
and is still deliberately uninvestigated: run 34's directive was a bounded compliance reconciliation
that explicitly forbade inventing replacement work, and inventing work is how a waiting loop convinces
itself it is progressing.

**Resolved 2026-08-13 (run 35) — and the five days was an undercount.** EXP-005 read the item dates
out of production directly rather than inferring them from a total, in
[run 31689710757](https://github.com/in-c0/tuned/actions/runs/31689710757) at 10:08:15 UTC:

| Feed | Newest public item | Age at measurement |
| --- | --- | --- |
| **`ava`** (shown as the landing demo) | 2026-08-02T03:33:44Z | **270.6 h — 11.3 days** |
| `sportstech` | 2026-07-30T22:48:09Z | 323.3 h — 13.5 days |
| `wearables` | 2026-07-30T22:49:47Z | 323.3 h — 13.5 days |
| `wellbeing` | 2026-07-30T22:50:34Z | 323.3 h — 13.5 days |
| `graphics` | 2026-07-30T22:51:27Z | 323.3 h — 13.5 days |

**Nothing has been published anywhere on Tuned since 2026-08-02, and nothing outside `ava` since
2026-07-30.** The "five days" above was a floor set by when snapshots began, not a measurement —
`items_public` has been 79 on every committed snapshot because the first snapshot already caught a
feed that had stopped. **Of the two readings offered above, the second is now excluded and the first
is confirmed in a stronger form:** ingestion has not stalled (the Spotify cron kept working —
`items_queued` 27 → 42 is that cron), and publication requires an act nobody has taken. The desk is
unattended, the four agent feeds are not running, and the numbers were correct all along.

**What this changed downstream.** Not a metric — a public claim. The landing page was heading that
11-day-old block *"Live demo — a real feed, right now"*, so **431 UA-flagged human-shaped landing
views arrived on a page asserting something false**. Fixed in run 35 by deriving the claim instead of
asserting it; recorded as [L-18](LESSONS.md). **No conversion inference may be drawn from that fix
in either direction** — no visitor has ever been observed reacting to this page in either state, and
the denominator is still UA-classified requests rather than people.

**Gross cash: AUD $0.** Source: *no billing exists* — not an estimate, not a forecast.
**Autonomous spend: AUD $0.00 of $500.**

Executor egress to `justtuned.com` re-tested this run — still **403 CONNECT** at the proxy,
twenty-seventh consecutive run. GitHub Actions remains the production read path.

## Ingestion telemetry — added 2026-08-14 08:15 Sydney (2026-08-13 22:15 UTC), run 37

**The only path on this platform that currently produces items had no output anyone in this loop
could read.** The half-hourly `scheduled` handler wrote its entire outcome to `console.log`, which
lives in Cloudflare's logs, which the executor holds no credentials for by design. So `items_queued`
standing still had two explanations that looked identical from here — the member stopped playing
music, or the sync stopped working — and the only instrument available was a 24-hour delta between
committed snapshots.

That instrument had already been leaned on. The run-35 note above reads *"ingestion has not stalled
(the Spotify cron kept working — `items_queued` 27 → 42 is that cron)"*. That inference was sound for
the window it covered and is **not** evidence about the window since: the queue has been **42 on
2026-08-11, 08-12 and 08-13**, and a flat delta is exactly what both a quiet member and a dead
connection produce.

Six counters now separate them, written into the existing `metric_days` table and arriving through
the existing `/api/metrics` read path — no new endpoint, no new table, no schema change. Shipped in
[`1297427`](https://github.com/in-c0/tuned/commit/1297427).

| Counter | Definition | What a reading means |
| --- | --- | --- |
| `cron_run` | the scheduled handler ran | **Absent = the cron is not firing.** No other counter can report this, because a cron that never fires writes nothing anywhere |
| `cron_no_credentials` | it ran, but `SPOTIFY_CLIENT_ID` is unset in production | the Worker secret is missing — owner action |
| `spotify_sync_ok` | one connection polled, Spotify answered | the pipeline is alive |
| `spotify_items_captured` | plays captured into a queue | **supply of real attention** — the north-star input, previously with no direct measure |
| `spotify_sync_auth_error` | 4xx from Spotify (400 / 401 / 403) | token revoked or consent withdrawn. **Only a member reconnecting clears it** |
| `spotify_sync_error` | anything else — 429, 5xx, network | transient, self-clearing. Explicitly not an owner action |

**The reading that settles the flat line:** `cron_run` ≥ 1 with `spotify_sync_ok` ≥ 1 and no
`spotify_items_captured` row means the queue is **quiet, not broken** — the member has played nothing
new and the product is working exactly as built. Any other combination names a specific fault with a
specific owner.

Honesty properties, unchanged from the rest of this file: nothing is backfilled and no day is
estimated. A day with no row means the counter was never incremented, **not** that it was zero — and
`countBy` writes nothing for a zero, so "captured nothing" leaves no row rather than a manufactured
one. The counters record what happened, never what was listened to: no URLs, titles, member ids or
timestamps. Counting starts at the deploy above; the three flat days before it stay uninterpretable
and will not be reconstructed.

**First reading — 2026-08-13T22:32:24Z, taken 2 minutes after the first cron boundary following the
deploy.** Source: `ops/metrics/latest.json` at [`f65d6a3`](https://github.com/in-c0/tuned/commit/f65d6a3).

| Counter | 2026-08-13 |
| --- | --- |
| `cron_run` | **1** |
| `spotify_sync_ok` | **1** |
| `spotify_items_captured` | *absent* |
| `spotify_sync_auth_error` · `spotify_sync_error` · `cron_no_credentials` | *absent* |

**Ingestion is alive and there is nothing to ingest.** The cron fires, the credential is set, the
member's Spotify token still authenticates against the live API, and the poll found no play newer
than `last_sync`. [EXP-006](EXPERIMENTS.md) is graded **QUIET, NOT BROKEN** — the flat
`items_queued = 42` is a true absence of supply, not a defect, and the "the connection died" branch is
excluded.

**n = 1 poll.** This is a present-tense fact about 22:30 UTC. It does not reach backwards: the three
flat days before the counters existed remain uninterpretable and will not be reconstructed.

> **It does not reach forwards either.** On 2026-08-14 the same pipeline captured **104 plays** and
> `items_queued` rose 42 → 146. The reading above stands exactly as taken; the connection is no longer
> quiet. See [Second reading](#second-reading--2026-08-15-0658-sydney-2026-08-14-205856-utc-run-41).

---

## Second reading — 2026-08-15 06:58 Sydney (2026-08-14 20:58:56 UTC), run 41

**This reading falsifies a durable statement made in this file and in STATUS.** The sentence *"one
live Spotify connection with nothing to carry"* was true of the 30-minute window it described and is
**no longer true of the connection**. Supply resumed. The correction is recorded here rather than by
editing the graded [EXP-006](EXPERIMENTS.md) result, which stands at its own timestamp.

Source: [`ops/metrics/latest.json`](metrics/latest.json) at
[`7a73982`](https://github.com/in-c0/tuned/commit/7a739827c21f9716765670f20f05fadeb1899ad3),
`generated_at` **2026-08-14T20:58:56.369Z**. Written by the scheduled snapshot job, read through the
public zone. The executor's own egress to `justtuned.com` remains blocked (30th consecutive run), so
this is GitHub's reading of production, not the executor's.

### Ingestion counters

| Counter | 2026-08-13 (final) | 2026-08-14 (partial, to 20:58 UTC) |
| --- | --- | --- |
| `cron_run` | **3** | **30** |
| `spotify_sync_ok` | **3** | **30** |
| `spotify_items_captured` | *absent* | **104** |
| `spotify_sync_auth_error` | *absent* | *absent* |
| `spotify_sync_error` | *absent* | *absent* |
| `cron_no_credentials` | *absent* | *absent* |

**Ingestion is alive and supplying.** Thirty polls, thirty successes, no errors of any kind, and
**104 plays captured** on 2026-08-14. The member's Spotify token authenticates, the cron fires, and
the pipeline delivered real attention events end to end. 08-13's final count of 3 is consistent with
the counters having started at the 22:30 UTC boundary — 22:30, 23:00, 23:30 — with nothing new to
capture in that hour, which is exactly what the first reading recorded.

### What the queue did with them

| Total | Last reading (08-12) | This reading (08-14) | Δ |
| --- | --- | --- | --- |
| `items_queued` | 42 | **146** | **+104** |
| `items_public` | 79 | **79** | **0** |
| `stars` · `skips` | 8 · 33 | 8 · 33 | 0 |
| `applications` | 0 | **0** | 0 |
| `members` · `members_ever_active` | 1 · 0 | 1 · **0** | 0 |
| `feeds_human` · `feeds_agent` | 1 · 4 | 1 · 4 | 0 |
| `followers` · `connections` | 0 · 1 | 0 · 1 | 0 |

**+104 queued equals 104 captured, exactly.** Every play the cron captured entered the private queue,
and **not one left it**. `items_public` has now been **79 on every committed snapshot since
instrumentation began**, and the newest public item still dates to 2026-08-02 — the public feeds have
only aged further since [EXP-005](EXPERIMENTS.md) measured them.

**The two halves of that sentence are the whole finding.** The machine half of Tuned works: it
observed, it captured, it queued. The human half did not happen — publication requires a member to
approve from the queue, and no member has. Tuned's doctrine is that humans contribute attention, not
content; a 146-item private queue with 0 items published is that doctrine's bottleneck stated in
numbers, not a defect to be engineered away.

### What may not be read off this

- **Not demand.** 104 captures is **one member listening to music for one day**. It is supply, and
  supply from a single connection. No activation, retention, referral or revenue inference follows
  from it in either direction.
- **Not a queue to be worked.** The 146 items are member data and that member's attention. They were
  not opened, inspected, counted individually, approved, summarised or published this run, and the
  executor holds no warrant to do any of those things.
- **Not a retroactive claim.** The three flat days before the counters existed (08-11, 08-12, 08-13)
  stay uninterpretable. Nothing here reaches backwards, and there is no backfill.

### One open question, recorded and not investigated

`*/30 * * * *` implies **42** cron boundaries between 2026-08-14T00:00Z and the 20:58:56Z snapshot.
`cron_run` — which increments unconditionally as the first statement of the scheduled handler —
recorded **30**. Twelve boundaries are unaccounted for (~29%).

This is stated as arithmetic, **not as a defect**: Cloudflare cron triggers are best-effort, the
counter write could itself fail, and one partial day is a thin basis for either conclusion. It is not
being investigated this run — the directive is an ops-only reconciliation and the authentication hold
stands. It is logged here as the strongest engineering-shaped candidate currently visible, gradeable
against a **full** UTC day: a complete day should show `cron_run = 48`.

### Non-ingestion counters, for completeness

Landing views, UA-flagged human / bot: **113 / 59** on 08-13 (the first full day above 100 human-
flagged), **60 / 31** on 08-14 to 20:58 UTC. Feed views: **22 / 7** on 08-13, **11 / 1** on 08-14.
`application_submit`, `member_login`, `desk_view`, `attention_star` and `attention_skip` have **still
never fired**. Landing → application remains **0 / n**, and the UA split remains a heuristic, not
verified human traffic.

**Gross cash collected: AUD $0**, sourced from *no billing exists*. **Autonomous spend: AUD $0.00 of
the AUD $500 cap.**

## Acquisition telemetry — added 2026-08-15 14:20 Sydney (2026-08-15 04:20 UTC), run 43

**Nothing below is a reading.** Three counters were added this run and **all three read zero on every
day committed so far**, because they did not exist until [`3213ebf`](https://github.com/in-c0/tuned/commit/3213ebf).
This section records what they are and what may be concluded from them, written before any value of
them is known. The pre-registered forks are [EXP-007](EXPERIMENTS.md).

### The gap they close

| | 08-06 | 08-07 | 08-08 | 08-09 | 08-10 | 08-11 | 08-12 | 08-13 | 08-14 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `landing_view` | 29 | 69 | 56 | 56 | 84 | 71 | 67 | 113 | 60 |
| `application_submit` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

**605 UA-flagged human-shaped landing views. Zero applications. Nothing recorded in between.** The
two columns are the *ends* of the acquisition funnel and Tuned has never observed its middle, so
three unrelated causes have been producing one indistinguishable pair of numbers for nine days:

1. the ~600 views are not people;
2. they are people and the offer does not move them;
3. they are people who wanted in and the form lost them.

[EXP-003](EXPERIMENTS.md) removed a fourth (a broken apply path) by driving a real browser through it
in production. The remaining three are what the counters below separate.

### The three counters

| Name | Fires | Written by |
| --- | --- | --- |
| `landing_engage` / `landing_engage_bot` | first `pointerdown`, `keydown` or `scroll`, **at most once per page load** | the page, via `POST /api/pulse/landing_engage` |
| `application_start` / `application_start_bot` | first `input` into any application-form field, **at most once per page load** | the page, via `POST /api/pulse/application_start` |
| `application_invalid` | a `POST /waitlist` rejected by email validation | the Worker, server-side |

`application_invalid` closes a blind spot of its own. `application_submit` counts only the submits
that **worked**, so since 08-06 a broken validator and an empty funnel have been indistinguishable —
a person who typed a real address the regex rejected left no trace at all.

No schema change, no new table, no new endpoint on the read path: these are rows in the existing
`metric_days` table, arriving through the existing key-gated `/api/metrics`. **No cookie, no visitor
identifier, no per-visitor state, no new data category** — the privacy policy describes this
collection already and was deliberately not amended.

### What may not be read off them

Registered in advance, and binding whatever the numbers turn out to be:

- **`landing_engage` is evidence, not proof.** It is reported by the page itself. The route requires a
  same-origin `Origin` header, which stops casual inflation and is **forgeable by anyone willing to
  set one header**. A headless browser sending a stock Chrome user-agent counts as human here.
- **The bot split is the same heuristic as `landing_view`, with the same limits.** It is honest about
  what it catches: the local browser QA for this change landed in `landing_engage_bot`, because
  Playwright's user-agent contains `HeadlessChrome`.
- **No conversion rate may be computed against `landing_view`** as though it were a human
  denominator. Whether it *is* one is the question under test.
- **Engagement is not demand, activation, retention, referral or revenue.** A page being touched is a
  page being touched.
- **Nothing is graded against the 605 historical views.** Counters start at zero on the deploy that
  introduced them, exactly as the ingestion counters did in run 37, and the nine days before this
  deploy stay uninterpretable for these three names.

### The instrument's own failure mode, and the assertion against it

A JavaScript error, a stripped route or an edge rule would make all three read zero — which is
**identical** to fork A, *"nobody human ever arrived"*. That is the one reading this loop must not get
wrong by accident, so it is asserted in production rather than assumed: `verify production` now POSTs
to `/api/pulse/landing_engage` **with no Origin header** on every push and every schedule.

| Response | Meaning |
| --- | --- |
| **403** | pass — deployed, and refusing to count a caller that is not the page |
| **404** | the instrument is not deployed; its zeros mean nothing. Roll back |
| **204** | the same-origin guard is gone and anyone can write these counters. Roll back |

The verifier **cannot** satisfy the guard it tests — `scripts/prod-http.sh post` sends no Origin by
construction. A monitor able to increment the counter would be manufacturing the traffic it exists to
measure.

**No metric moved this run, and none is claimed.** `items_public` **79**, `items_queued` **146**,
`applications` **0**, `members_ever_active` **0**. **Gross cash collected: AUD $0**, sourced from *no
billing exists*. **Autonomous spend: AUD $0.00 of the AUD $500 cap.**

## Self-inflicted counters on UTC day 2026-08-15 (run 45) — declared before they are read

Run 45 dispatched [`qa/pulse-instrument.spec.mjs`](../qa/pulse-instrument.spec.mjs) against
production ([run 31878890766](https://github.com/in-c0/tuned/actions/runs/31878890766)) to prove
EXP-007's page-side counters actually emit. That browser session **caused counter increments**, and
this section exists so no later run reads them as arrivals.

On **UTC day 2026-08-15 only**, one page load and one interacted session, attributable entirely to
this loop:

| Counter | Increments caused | Why it is in the bot bucket |
| --- | --- | --- |
| `landing_view_bot` | 1 | the harness user-agent contains `HeadlessChrome` |
| `landing_engage_bot` | 1 | same |
| `application_start_bot` | 1 | same |

None of the three human-flagged names — `landing_view`, `landing_engage`, `application_start` — was
touched, and `applications` was not touched at all: the form was typed into and **never submitted**.
Day 2026-08-15 is not a day EXP-007 grades; its reading is complete UTC day **2026-08-16**, from the
scheduled 08-17 snapshot.

The counts above are what the spec asserts it emitted, verified end-to-end against a local
`wrangler dev` before the production dispatch, where `metric_days` showed exactly those three names
at 1 each. The production snapshot has not yet been taken, so they are **the loop's own declared
footprint, not a reading of production** — the 08-16 snapshot will show the actual 08-15 totals,
which will also include whatever genuine traffic arrived that day.

---

## Instrument resolution limit — `feed_view` cannot see a small cohort (2026-08-16, run 46)

Recorded here rather than only in [DISTRIBUTION.md](DISTRIBUTION.md) because it is a property of the
instrument, and any future run reading `feed_view` needs to know it before drawing a conclusion.

**`feed_view` is a single site-wide counter.** It is emitted once per public feed page render at
[`src/index.ts:672`](../src/index.ts), split only by the bot user-agent heuristic. It does **not**
split by handle, and it carries **no referral tag** — so it cannot distinguish a visit to `/ava` from
a visit to `/sportstech`, nor an arrival from a link posted somewhere from an arrival from a crawler
sweep.

Its human-flagged daily readings for the ten days 2026-08-06 → 2026-08-15, sorted — as recorded in the
[2026-08-15 snapshot](metrics/2026-08-15.json). **Two of the ten are partial and are included as-is:**
08-06 is the day the counter deployed, and 08-15 was read at 20:53 UTC. Neither partial is the maximum,
so the range below is not inflated by them.

| | | | | | | | | | |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | 3 | 5 | 8 | 11 | 14 | 15 | 15 | 21 | 22 |

Range **2–22**, against a bot-flagged counterpart that has reached **32** in a single day.

**The consequence, stated so it is not rediscovered later:** an effect smaller than roughly twenty
same-day arrivals is inside this counter's ordinary variation and **cannot be resolved by it in
either direction**. A first distribution attempt that brought a dozen real readers would produce a
reading indistinguishable from a quiet day, and recording that as a null would be a fabricated
negative. See [L-24](LESSONS.md).

**Not a defect and not scheduled as a fix.** The counter does what it was built for — site-wide public
feed traffic — and no experiment has yet needed more. The requirement is registered in
[DISTRIBUTION.md](DISTRIBUTION.md) condition **A5**: a per-destination counter must exist and be
verified in production *before* any distribution attempt, never alongside or after it, because
counters start at zero on the deploy that introduces them and there is no backfill.

**Resolved for future days, and only for future days (2026-08-16, run 48).** The counters below
shipped in [`86cabdd`](https://github.com/in-c0/tuned/commit/86cabdd). **Nothing above changes:** the
2–22 range is a fact about `feed_view` and stays the correct caution for every reading of it,
including readings taken after this deploy, and the ten days already recorded gain no resolution
retroactively. There is no backfill and none will be invented.

## Arrival attribution counters — added 2026-08-16 (run 48)

Deployed [`86cabdd`](https://github.com/in-c0/tuned/commit/86cabdd) (PR
[#41](https://github.com/in-c0/tuned/pull/41)), on the public feed route only. **Zero on every day
before 2026-08-16**, which is the deploy day and therefore itself partial.

| Counter | Definition | Source |
| --- | --- | --- |
| `feed_view:<handle>` / `feed_view_bot:<handle>` | the same event `feed_view` counts, split by which feed was viewed. The handle is read from the creator row, never the request URL | `/api/metrics` daily |
| `arrival:<tag>` / `arrival_bot:<tag>` | a feed view whose URL carried an **allowlisted** `?src=` tag. Unrecognised tags are counted under no name at all | `/api/metrics` daily |

**Reading rules, binding on whoever reads these first:**

- **`feed_view` and `feed_view:<handle>` are not additive.** `feed_view` remains the site-wide total
  and is unchanged by this deploy; the per-handle names are a decomposition of it, and summing all of
  them alongside it double-counts every view.
- **An absent `arrival:<tag>` row is ambiguous and must not be read as demand.** It means either
  nobody arrived with that tag *or* the tag was never added to `ARRIVAL_TAGS`. Check the allowlist in
  [`src/index.ts`](../src/index.ts) before writing down a zero.
- **`arrival:<tag>` counts page views, not people.** One reader who opens the link twice counts twice;
  the counter carries no visitor identifier and one is not going to be added.
- **Neither counter is demand, activation, retention, referral or revenue.** A destination being
  opened is a destination being opened — the same limit `landing_engage` carries.
- **No per-visitor data.** No cookie, no identifier, no per-visitor state. A `?src=` tag is a campaign
  label on a URL we publish ourselves, aggregated into the daily counts that already existed. The
  published privacy policy is unchanged by it.

### The words "on the public feed route only" were load-bearing, and nobody read them that way (run 56)

That phrase, three lines above, is this section's own qualification and it is **correct**. It also
turned out to be the whole problem. `GET /:handle/rss.xml` was **not** the public feed route — it is a
separate handler, and until run 56 it wrote **no counter of any kind**. So every A5 assessment that
cited this section as *"instrument shipped"* was citing a true sentence about the **HTML** page while
the URL under discussion — `https://justtuned.com/sportstech/rss.xml`, proposed for submission to a
directory of RSS feeds — was the **XML** one.

This is [L-35](LESSONS.md), and the sharpest version of it: **the record was accurate and was still
read as a coverage claim.** A qualification that appears once, in the file that defines the counter,
does not survive eight runs of being summarised. The only check that would have caught it is opening
the handler for the exact URL.

## RSS fetch counters — added 2026-08-19 (run 56)

Deployed via PR [#49](https://github.com/in-c0/tuned/pull/49), on `GET /:handle/rss.xml`. **Zero on
every day before 2026-08-19**, which is the deploy day and therefore itself partial — and zero not
because nothing was fetched, but because **nothing was counted**. There is no historical RSS fetch
series for Tuned at all, and none can be reconstructed.

| Counter | Definition | Source |
| --- | --- | --- |
| `feed_fetch` / `feed_fetch_bot` | every fetch of any feed's `rss.xml` | `/api/metrics` daily |
| `feed_fetch:<handle>` / `feed_fetch_bot:<handle>` | the same event split by destination; the handle is read from the creator row, never the request URL | `/api/metrics` daily |
| `arrival_fetch:<tag>` / `arrival_fetch_bot:<tag>` | a fetch whose URL carried an **allowlisted** `?src=` tag. Unrecognised tags are counted under no name at all | `/api/metrics` daily |

**Reading rules, binding on whoever reads these first — and three of them are new, not inherited:**

- **These count polls, not people, and the gap is much larger than it is for a page view.** A feed
  client re-reads the file on a schedule: one subscriber can produce dozens of fetches a day, forever,
  without a person ever looking at any of them. **No subscriber count can be derived from these
  numbers**, because there is no visitor identifier and one is not going to be added. Grade *days with
  activity*, never totals — which is why [EXP-009](EXPERIMENTS.md)'s Fork A is "≥ 7 of 14 days" and
  not a count.
- **Neither bucket is a person.** Every fetch of an RSS URL is a machine. The `_bot` split separates a
  crawler that declares itself in its user agent from a feed reader that does not — it does **not**
  separate machines from humans, and unsuffixed `feed_fetch` must never be read the way unsuffixed
  `landing_view` is read.
- **This loop's own traffic is in `feed_fetch_bot`, not in the unsuffixed name.**
  `qa/playwright.config.mjs` sets a `HeadlessChrome` user agent on every spec and every
  `APIRequestContext`, and `isBot()` matches it, so the scheduled fetches of `/sportstech/rss.xml` in
  `qa/freshness.spec.mjs`, `qa/public-surfaces.spec.mjs` and `qa/exp008-provenance.spec.mjs` all land
  in `feed_fetch_bot:sportstech`. **That name is therefore a liveness signal** — non-zero whenever
  the QA schedule runs — **and unsuffixed `feed_fetch` is a genuine background rate of third-party
  fetchers.** Neither is demand. Only `arrival_fetch:<tag>` grades an attempt, because no QA path
  passes a channel tag. *(This bullet initially said the opposite; it was corrected the same run,
  before any value was read — see [EXP-009](EXPERIMENTS.md)'s closing note.)*
  - **Read this bullet against its first day of data, 2026-08-19, which does not support the second
    half of it.** `feed_fetch 16 · feed_fetch:sportstech 16 · arrival_fetch:qa 16`, against a `_bot`
    half of 10 fully accounted for by this loop's own dispatches. Sixteen non-declaring fetches, **all
    sixteen tag-carrying** — so the unsuffixed name on the only day it has a value is **not** a
    background rate of untagged third-party fetchers; it is unattributed traffic on a URL this loop
    published in a public report nine minutes after the counters shipped. The liveness half
    (`feed_fetch_bot:sportstech`) behaved exactly as written. See [L-36](LESSONS.md): a tagged URL
    printed as evidence is a publication of that URL. **Never treat unsuffixed `feed_fetch` as a clean
    third-party baseline without checking whether the tagged URL has been published anywhere.**
  - **Updated 2026-08-20 (run 58) — the second half of the parent bullet is now withdrawn outright,
    in the deployed comment and in the published `/api/metrics` note as well as here.** The day closed
    at **23**, not 16, and UTC 2026-08-20 read **1** at 04:06:30Z. On **both** days, *every* unsuffixed
    fetch carried `?src=qa` — the unsuffixed name has never once recorded an untagged third-party
    fetch, so calling it "a background rate of third-party fetchers" asserts a population that has not
    been observed. The other half is withdrawn with it: `arrival_fetch:<tag>` does **not** grade an
    attempt "because only a link this loop published carries the tag" — every tag that writes is
    public source next to the public route it applies to ([L-37](LESSONS.md)).
  - **A partial day is not a rate.** Run 57 divided 16 by elapsed hours and called the quotient a
    cadence ("the shape of a feed client"). 23 over 13.7 h is ~one per 35.7 min; the next 4.1 h then
    produced 1 against ~6.9 expected (P(X ≤ 1) ≈ 0.008). **Burst that decayed = crawl, not
    subscription.** Never read a series' shape off its first incomplete day.
  - **Updated 2026-08-24 (run 84) — the *first* half of the parent bullet is now withdrawn too, in
    the deployed comment and in the published `/api/metrics` note as well as here. There is no QA
    schedule.** The bullet says *"the **scheduled** fetches of `/sportstech/rss.xml` in
    `qa/freshness.spec.mjs`, `qa/public-surfaces.spec.mjs` and `qa/exp008-provenance.spec.mjs`"*.
    Those three specs run only from [`qa-browser.yml`](../.github/workflows/qa-browser.yml), which is
    `workflow_dispatch`-only **by deliberate design** — its own header says so. The only two workflows
    carrying a `schedule:` block, [`verify-production.yml`](../.github/workflows/verify-production.yml)
    (06:20 Sydney) and [`metrics-snapshot.yml`](../.github/workflows/metrics-snapshot.yml)
    (06:40 Sydney), each probe exactly one feed's RSS and it is **`/ava/rss.xml`**. They are not the
    headless suite either: they go through [`scripts/prod-http.sh`](../scripts/prod-http.sh), whose UA
    `tuned-ops-verifier/1.0 (+…; first-party uptime and metrics check)` lands in `_bot` on `BOT_UA`'s
    **`uptime`** token, not on `headless`. **So `feed_fetch_bot:ava` is a liveness signal;
    `feed_fetch_bot:<any other handle>` is a record of when this loop happened to dispatch a QA spec,
    and a zero day there means nobody dispatched one.** The series says the same thing —
    `feed_fetch_bot:sportstech` **08-19 4 · 08-20 1 · 08-21 7 · 08-22 1 · 08-23 0** — irregular, and
    already zero inside [EXP-009](EXPERIMENTS.md)'s reading window. [L-44](LESSONS.md).
  - **`arrival_fetch:qa` is now a registered control, not just contamination.** It is published in the
    same public places as any real channel tag and submitted to no venue, ever, so it measures what a
    tagged URL earns with no channel behind it. [EXP-010](EXPERIMENTS.md) grades `control_days` over
    the 14 complete UTC days 2026-08-21 … 2026-09-03, read 2026-09-04. **It is never demand and never
    a person**; any run reporting it as traffic or users is inventing a metric.
- **`feed_fetch` and `feed_view` are different events and are never additive.** They are not two
  measurements of one thing; summing them mixes a poll with a page view.
- **An absent `arrival_fetch:<tag>` row is ambiguous** in exactly the way `arrival:<tag>` is: nobody
  arrived, *or* the tag was never allowlisted, *or* — new here — the published URL lost its query
  string somewhere between this loop and the reader. Check `ARRIVAL_TAGS` in
  [`src/index.ts`](../src/index.ts) **and** the published URL before writing down a zero.
- **No per-visitor data.** No cookie, no identifier, no per-visitor state, no new data category. The
  published privacy policy is unchanged by it.

### Self-inflicted counters on UTC day 2026-08-16 (run 48) — declared before they are read

The production check ([`qa/arrival-instrument.spec.mjs`](../qa/arrival-instrument.spec.mjs), run
[31941200421](https://github.com/in-c0/tuned/actions/runs/31941200421), against serving commit
`86cabddd`) opened one public feed twice. Declared here so no later run reads its own traffic as an
arrival:

| Counter | Increments caused | Why it is in the bot bucket |
| --- | --- | --- |
| `feed_view_bot` | 2 | the harness user-agent contains `HeadlessChrome` |
| `feed_view_bot:sportstech` | 2 | same |
| `arrival_bot:qa` | 1 | same — one of the two visits carried `?src=qa`, the other an unregistered tag that by design counts nothing |

No human-flagged counter was touched. **No landing-page request was made**, so `landing_view`,
`landing_engage` and `application_start` are untouched on **2026-08-16** — the complete UTC day
[EXP-007](EXPERIMENTS.md) grades from the 08-17 scheduled snapshot. No POST, no form, no follow.

These are the loop's declared footprint, **not a reading of production**. The first actual reading of
these counters is the **scheduled 08-17 snapshot**, and it is load-bearing rather than decorative: if
`feed_view_bot` moved on 08-16 while `arrival_bot:qa` is absent, the tag path is broken and shipped
dead — which is exactly the failure a counter with no observable response would otherwise hide.

### Self-inflicted counters on UTC day 2026-08-17 (run 49) — declared before they are read

The far-side instrument bracket ([`qa/pulse-instrument.spec.mjs`](../qa/pulse-instrument.spec.mjs))
loads the landing page once and interacts with it. Declared here so no later run reads this loop's
own traffic as a person:

| Counter | Increments caused | Why it is in the bot bucket |
| --- | --- | --- |
| `landing_view_bot` | 1 | the harness user-agent contains `HeadlessChrome` |
| `landing_engage_bot` | 1 | same — one `Tab` keypress, one-shot per page load |
| `application_start_bot` | 1 | same — typing into the note field, form **never submitted** |

Observed rather than predicted: `qa-browser` [run 31993707292](https://github.com/in-c0/tuned/actions/runs/31993707292)
at **2026-08-17T04:14:12.834Z**, against production serving `6d63bd3`, emitted exactly
`landing_engage` **204** and `application_start` **204** — the two pulses above and nothing else.

No human-flagged counter was touched, and every increment lands on **2026-08-17** — not on
**2026-08-16**, the complete UTC day [EXP-007](EXPERIMENTS.md) grades from the 20:40 UTC scheduled
snapshot. `applications` untouched, still **0**.

**Consequence worth stating in advance:** this makes `landing_engage_bot` **non-zero on 08-17 by
construction**. It is not evidence of anything about arrivals on 08-17, and the day it speaks about is
08-16, where this run put nothing.

### What the 08-16 snapshot already settled — the arrival tag path is alive

Run 48 named the load-bearing check on its own instrument: *"`feed_view_bot` moving while
`arrival_bot:qa` is absent means the tag path shipped dead."* The snapshot generated
2026-08-16T20:52Z carries `arrival_bot:qa` **1**, `feed_view_bot:sportstech` **2** and
`feed_view_bot` **8** on UTC day 2026-08-16 — the declared footprint, arriving under the names it was
declared under. **The `?src=` path writes in production.** That is capability evidence about a
counter and nothing else: no human arrived, no channel exists, and `feed_view` human-flagged read
**24** that day, inside its own 2–22 noise band's neighbourhood rather than above it.

## The graded reading — complete UTC day 2026-08-16 (2026-08-18, run 51)

**Source:** [`ops/metrics/latest.json`](metrics/latest.json) and
[`ops/metrics/2026-08-17.json`](metrics/2026-08-17.json), `generated_at`
**2026-08-17T20:57:27.306Z**, committed as [`4527018`](https://github.com/in-c0/tuned/commit/4527018)
by [run 32068544835](https://github.com/in-c0/tuned/actions/runs/32068544835), **`event: schedule`**.

The trigger is checked rather than assumed. [EXP-007](EXPERIMENTS.md) says the read comes from a
scheduled snapshot and *"not from a dispatched snapshot"*, and `metrics-snapshot.yml` accepts
`workflow_dispatch` as well as its `40 20 * * *` cron — so *which* run produced the file is part of
the reading, not metadata about it.

| Counter | 2026-08-16 (complete) | 2026-08-17 (**partial**, cut 20:57 UTC) |
| --- | --- | --- |
| `landing_view` | **50** | 93 |
| `landing_view_bot` | 31 | 24 |
| `landing_engage` | **absent → 0** | **3** |
| `landing_engage_bot` | **absent → 0** | 1 — this loop's own bracket, declared in advance |
| `application_start` | absent → 0 | absent → 0 |
| `application_start_bot` | absent → 0 | 1 — same bracket |
| `application_invalid` | absent → 0 | absent → 0 |
| `application_submit` | absent → 0 | absent → 0 |
| `feed_view` / `feed_view_bot` | 24 / 8 | 6 / 2 |
| `cron_run` | **49** | 42 (partial day) |

An **absent row means no requests were counted that day** — the snapshot note says so, and these
counters write no zero rows. It is not a missing reading.

**`application_invalid` has never appeared as a daily row on any day, 08-08 through 08-17.** It is
present in the snapshot files only inside the explanatory `note` string. Nobody has been refused by
the email validator. That is a clean negative and it is what closed EXP-007's Fork D.

**`cron_run` = 49 on a complete UTC day against 48 `*/30` boundaries.** Run 49's open item — 08-14
read 36, 08-15 read 48 — is answered for a second complete day: the cron is healthy, and 49 rather
than 48 is one boundary landing either side of the day cut, not an anomaly worth a cycle.

### The one number in this snapshot nobody's footprint accounts for

**`landing_engage` = 3 on UTC day 2026-08-17**, non-bot bucket. Every declared self-inflicted counter
above lands in the `_bot` names, because the harness announces `HeadlessChrome`; the `verify
production` curl checks emit `landing_view_bot` and never reach the page-side emitter at all. **No
loop activity on record produces a non-bot `landing_engage`.**

Binding limits on reading it, which are EXP-007's own and are repeated here because this is the row
someone will quote:

- **It is not proof of a person.** `landing_engage` is page-reported, same-origin only, and forgeable
  by anyone who sets one header. A JS-executing crawler with a stock user agent lands in exactly this
  bucket.
- **It is not demand, activation, retention, referral or revenue.** A page being touched is a page
  being touched. `application_start` stayed at **0** the same day.
- **No conversion rate may be computed from it.** 3/93 is arithmetic, not a funnel metric, and the
  denominator is the assumption EXP-007 exists to test.

It is recorded because it is the first non-bot engagement pulse in the series and because leaving it
out of the file would make the next run's discovery of it look like news.

### Self-inflicted counters on UTC day 2026-08-18 (run 51) — declared before they are read

This run dispatches **no browser QA** and **no source read**. The only production contact is the
post-push `verify production` check, which is `curl` and executes no page script:

| Counter | Increments caused |
| --- | --- |
| `landing_view_bot` | 1 per verify run |
| every page-side counter (`landing_engage`, `application_start`, and their `_bot` forms) | **0 — curl runs no JavaScript** |

**Nothing this run does touches UTC day 2026-08-16 or 2026-08-17**, the days graded above, and nothing
touches a human-flagged counter on any day. `applications` untouched, still **0**.

## First operator publication — 2026-08-18 04:15:49 UTC (14:15 Sydney), run 52

**Source:** `agent-operator.yml` dispatches and the metrics snapshot at
[`6cbbee5`](https://github.com/in-c0/tuned/commit/6cbbee5), `generated_at` **2026-08-18T04:19:43.828Z**.

| Counter | Before | After | Read from |
| --- | --- | --- | --- |
| `totals.items_public` (site-wide) | **79** | **80** | 08-17 20:57 snapshot → 08-18 04:19 snapshot |
| `totals.items_queued` | 146 | **146** | same — unmoved, so nothing else changed |
| `@sportstech` `items_public` | **11** | **12** | `list` [32098325601](https://github.com/in-c0/tuned/actions/runs/32098325601) 04:13:18Z → [32098525266](https://github.com/in-c0/tuned/actions/runs/32098525266) 04:16:28Z |
| `@sportstech` `operator_publications` | **0** | **1** | same |
| `@sportstech` `last_public_item_at` | 2026-07-30T22:48:09.614Z | **2026-08-18T04:15:49.089Z** | same |
| `totals.applications` | 0 | **0** | unchanged |
| `totals.followers` | 0 | **0** | unchanged |
| `retention.members_ever_active` | 0 | **0** | unchanged |

**`items_public` had read 79 in four consecutive daily snapshots** — 08-14, 08-15, 08-16, 08-17 —
so the +1 is attributable to this publication and to nothing else. A third `list`
([32098592220](https://github.com/in-c0/tuned/actions/runs/32098592220), after the replay) reads 12
and 1 again: the replay created nothing.

**What did not move, and is the whole point of saying so.** No arrival metric changed. No
application, no member, no follower, no star, no skip. **Gross cash: AUD $0**, sourced from *no
billing exists*. One item exists that did not exist this morning and **zero people are known to have
seen it** — `feed_view:sportstech` on 08-18 reads **0**, and `feed_view_bot:sportstech` reads **3**,
all three of them this loop's own browser QA.

### Self-inflicted counters on UTC day 2026-08-18 (run 52) — declared before they are read

| Counter | Increments caused | By what |
| --- | --- | --- |
| `landing_view_bot` | 1 per `verify production` run (3 this run) + 2 per browser-QA dispatch | curl checks; the QA harness announces `HeadlessChrome` |
| `feed_view_bot:sportstech` | 2 per browser-QA dispatch of the provenance spec | the spec loads `/sportstech` at both viewports |
| `feed_view:sportstech` (non-bot) | **0** | the harness is UA-flagged as a bot by `src/metrics.ts` |
| `landing_engage`, `application_start`, and their `_bot` forms | **0** | curl runs no JavaScript, and the provenance spec never loads `/` |

The 04:19 snapshot already shows `feed_view_bot:sportstech` **3** and `feed_view_bot` **4** on 08-18.
**Nothing this run did touched UTC day 2026-08-16 or 2026-08-17**, or any human-flagged counter on
any day.

### Incidental early read of complete UTC day 2026-08-17 — disclosed, not graded

The 04:19 snapshot was dispatched for threshold 2, and it carries complete 08-17 as a side effect.
[EXP-007](EXPERIMENTS.md)'s second reading is pre-registered against the **scheduled** 20:40 UTC
snapshot tonight, so what follows is **recorded, not graded**:

| Counter, complete UTC day 2026-08-17 | Value |
| --- | --- |
| `landing_view` | **102** |
| `landing_view_bot` | 27 |
| `landing_engage` | **3** |
| `landing_engage_bot` | 1 |
| `application_start` | absent → **0** |
| `application_start_bot` | 1 |

**Why reading it early cannot be cherry-picking, and why it is still disclosed.** The day is
complete: the number is fixed and identical in any snapshot taken after 00:00 UTC on 08-18, so
timing selects nothing. The pre-registered branches were fixed in advance and **3 falls in the 1–9
band** — Fork A stands, with the note that the denominator is *overwhelmingly*, not *entirely*,
non-human, and landing-page optimisation does not reopen in any branch. The formal grade is still
tonight's scheduled file, which must agree; **if it does not, that disagreement is the finding**, and
it is now checkable because this reading is on the record before the scheduled one exists.

All three `landing_engage` pulses were already present at yesterday's 20:57 cut, so none occurred in
the final three hours of the day.

---

## EXP-007's second reading, taken from the scheduled snapshot — 2026-08-19 (run 54)

**Source, and why the source matters more than the number.** `ops/metrics/2026-08-18.json`,
`generated_at` **2026-08-18T20:54:10.331Z**, from metrics-snapshot run
[32184825922](https://github.com/in-c0/tuned/actions/runs/32184825922) — **`event: schedule`**,
committed as [`c55e702`](https://github.com/in-c0/tuned/commit/c55e702). The pre-registration names
*the scheduled 20:40 UTC snapshot* and forbids a dispatched one; runs 52 and 53 both started before
20:40 UTC and declined the reading rather than dispatching a file that would have carried the same
numbers. This run started at 22:04 UTC and the file existed.

Complete UTC day **2026-08-17**:

| Counter | Value | Note |
| --- | --- | --- |
| `landing_view` | **102** | second-highest in the fourteen-day series |
| `landing_view_bot` | 27 | |
| `landing_engage` | **3** | **unattributed** — no declared footprint of this loop accounts for it |
| `landing_engage_bot` | 1 | run 51's far-side bracket, declared in [EXPERIMENTS.md](EXPERIMENTS.md) before it fired |
| `application_start` | absent → **0** | |
| `application_start_bot` | 1 | same bracket, typing into the form without submitting |
| `application_submit` | absent → **0** | |
| `application_invalid` | absent → **0** | Fork D stays a clean negative on every day 08-08 … 08-18 |

**The check run 53 pre-registered passed.** It wrote, before the file existed, that the scheduled
snapshot *"must agree with the recorded number; if it disagrees, that is the finding."* Run 52's
early read of the same complete day recorded `landing_engage` **3**. The scheduled file reads **3**.
No finding.

**Graded verdict: Fork A stands**, on the 1–9 band the rule fixed in advance — with the qualification
that 08-17's own numbers **miss Fork A's `landing_engage ≤ 2` threshold by one count**. Full entry in
[EXPERIMENTS.md](EXPERIMENTS.md). **No conversion rate is computed against `landing_view`**, and
three page touches are not three people.

**Two-day totals, which is the honest unit:** `landing_view` **152**, `landing_engage` **3**,
`application_start` **0**, `application_submit` **0**, `applications` **0**.

### Self-inflicted counters on UTC day 2026-08-18 (run 54) — declared before they are read

**Zero.** This run's only production-adjacent contact was three `source-read.yml` dispatches, and
that workflow **refuses `justtuned.com` and `*.workers.dev` by construction** — the refusal lives in
[`qa/source-read.spec.mjs`](../qa/source-read.spec.mjs) precisely so a rules-reading tool can never
become untracked headless traffic through the funnel counters EXP-007 measures. No landing view, no
feed view, no pulse, no arrival tag.

A `verify production` dispatch after this run's push adds **`landing_view_bot` +1** on UTC day
2026-08-19, and nothing else. **Nothing this run did touched UTC day 08-16 or 08-17, or any
human-flagged counter on any day.**

### Unmoved this run, stated because a run with no product change should say so

`applications` **0** · `members_ever_active` **0** · `items_public` **80** · `items_queued` **146** ·
followers **0** · stars **8** · skips **33** · `active_last_7d` **0**. Gross cash **AUD $0**, sourced
from *no billing exists*. Autonomous spend this run **AUD $0.00**; running total **AUD $0.00** of the
AUD $500 cap.

---

## 2026-08-21 (run 65) — one item published, and it is capability evidence, not demand

**What moved, source-linked.** From the operator plane's own `list`, before
([32468489106](https://github.com/in-c0/tuned/actions/runs/32468489106), 09:33:51Z) and after
([32468701244](https://github.com/in-c0/tuned/actions/runs/32468701244), 09:36:30Z):

| Metric | Before | After | Source |
| --- | --- | --- | --- |
| `@sportstech` `public_items` | 12 | **13** | `list`, both runs |
| `@sportstech` `operator_publications` | 1 | **2** | `list`, both runs |
| `@sportstech` `operator_publications_hidden` | 0 | **0** | `list`, after |
| `@sportstech` `last_public_item_at` | 2026-08-18T04:15:49.089Z | **2026-08-21T09:35:56.549Z** | `list`, both runs |

**Site-wide `items_public` is stated as derived, not read.** The canonical figure comes from the daily
snapshot, whose last value is **80** (`generated_at` 2026-08-20T20:59:44Z). Summing the per-feed RSS
item counts read from production this run — `ava` 38, `sportstech` 13, `wearables` 10, `wellbeing` 9,
`graphics` 11 ([32468714667](https://github.com/in-c0/tuned/actions/runs/32468714667)) — gives **81**,
consistent with 80 + 1 and with the RSS query's `LIMIT 300` being far above any feed's size. **The next
scheduled snapshot is the authority**; this sum is a cross-check, not a replacement.

**What this is not.** One publication proves the loop can publish a second time. It says nothing about
acquisition, activation, retention, referral or revenue, and it is not traction, momentum or a feed
"coming alive". **Zero people are known to have seen item 246.** No reader is implied, and any movement
in `feed_view` or `feed_fetch` around it is not attributable to it — there is no visitor identifier and
a poll count is not a subscriber count at any level of confidence.

**Unmoved this run, stated because that is the honest reading.** `applications` **0** ·
`members_ever_active` **0** · `active_last_7d` **0** · followers **0** · gross cash **AUD $0**, sourced
from *no billing exists*. Autonomous spend this run **AUD $0.00**; running total **AUD $0.00** of the
AUD $500 cap.

**A4 is a distribution precondition and is recorded there, not here.** It reads **0.0h**, lapsing
2026-08-24T09:35:56Z — see [DISTRIBUTION.md](DISTRIBUTION.md). Freshness is not a metric this loop
optimises, and it moved because a find was worth publishing.

## 2026-08-24 (run 85) — one publication; no demand metric moved

`@sportstech` published item **247**. Read from the operator plane, not inferred:

| Reading | Before (21:41:47Z, [32780854198](https://github.com/in-c0/tuned/actions/runs/32780854198)) | After (21:44:49Z, [32781124002](https://github.com/in-c0/tuned/actions/runs/32781124002)) |
| --- | --- | --- |
| `@sportstech` `public_items` | 13 | **14** |
| `operator_publications` | 2 | **3** |
| `operator_publications_hidden` | 0 | 0 |
| `last_public_item_at` | 2026-08-21T09:35:56.549Z | **2026-08-24T21:43:45.078Z** |

Site-wide `items_public` was **81** at the 21:01:52Z snapshot; the 08-25 snapshot should read **82**,
and if it does not, this record is wrong and the next run should say so.

**Nothing here is demand, and the distinction is the whole point.** `applications` **0** ·
`members_ever_active` **0** · followers **0** · gross cash **AUD $0** from *no billing exists* ·
spend **AUD $0.00 of $500**. A published item is supply. No reader is implied by it, no view is
sought, and any movement in `feed_view` around this publication is **not** attributable to it —
[EXP-008](EXPERIMENTS.md)'s binding clauses say so and they are not weakened by a third publication
landing.

**One measurement-adjacent finding worth keeping.** The set of source hosts that serve this loop's
declared reader was measured **once**, on **four samples**, at run 50 — and then used for four runs as
though it were a property of the literature. It is now **six samples: arXiv and frontiersin.org serve;
Taylor & Francis, SAGE, PMC and mdpi.com refuse.** The number of hosts tested belongs beside any claim
about reachability, and its absence is what let a four-point reading become a belief
([L-45](LESSONS.md)). Untested and next in line: PLOS, PeerJ, bioRxiv, SportRxiv.

## Dated note — 2026-08-25 (run 86), written before the number exists

**A deploy today changes a discovery path inside [EXP-009](EXPERIMENTS.md) Reading 1's window, and
this says so before the days it affects have any data.** Reading 1 is graded on the complete UTC day
**2026-08-26**, over `feed_fetch*` on 2026-08-20 … 08-26. Run 86 shipped
`<link rel="alternate" type="application/rss+xml">` on public feed pages — the element a feed reader,
aggregator or feed search engine uses to get from a page to a feed. Before it, a machine that loaded
`/sportstech` had no way to learn that `/sportstech/rss.xml` exists.

**What is unaffected, and it is the fork.** **Fork I-A is already determined by pre-deploy data** —
`feed_fetch_bot:sportstech` non-zero on ≥ 1 day, satisfied by **08-20 (1), 08-21 (7), 08-22 (1)** and
again by **08-24 (1)**, all of which predate this deploy. **Fork I-B must not be fired** in any case
(run 84's binding correction, [L-44](LESSONS.md)). Nothing about Reading 1's fork changes.

**What is affected, and it is the band.** Reading 1's *Next action* registers the unsuffixed
`feed_fetch:sportstech` series as the **background rate of third-party fetchers** — "the noise floor
any future attempt must be read against". That series has read **0 on 08-21, 08-22, 08-23 and
08-24**. **2026-08-25 and 2026-08-26 are post-deploy days and belong to a different regime.**

**Binding, so that a later run cannot quietly average them:**

- Quote the noise floor from **2026-08-20 … 08-24 only** — five complete pre-deploy days.
- Report **08-25 and 08-26 separately and labelled post-autodiscovery**. A non-zero reading on either
  is **not** evidence of a pre-existing background rate; it is evidence that the new discovery path
  works, which is a different and smaller claim.
- A zero on both is **not** evidence that autodiscovery failed. Two days is not a test of a discovery
  path, no crawler is obliged to re-fetch a page it already has, and nothing external links here.

**This is not [L-31](LESSONS.md), and the difference is the one that matters.** The
`/sportstech/rss.xml` scheduled probe is still **not** added and still waits for Reading 1 to be
graded: that probe would make the fork true *by construction*, with this loop's own timer. This
deploy fetches nothing and counts nothing. It changes only what a page tells a third party, so any
number it produces is a genuine third-party fetch — the contamination is a **level shift mid-window**,
which is why the two regimes are separated above rather than merged.

[EXP-009](EXPERIMENTS.md) and [EXP-010](EXPERIMENTS.md) are **byte-untouched**; this is recorded
outside the pre-registration, before the number exists, rather than edited into it afterwards.

## Dated note — 2026-08-25 (run 87), written before the number exists

**The `awesome-rss-feeds` tag's full URL was published in public before any submission existed, and
that changes what its counter can mean.** The [reviewer directive of
2026-08-25T03:33:11Z](https://github.com/in-c0/tuned/issues/1#issuecomment-5404716623) printed the
joined tagged feed URL — route plus `?src=awesome-rss-feeds` — in a comment on issue #1, a public
repository's public issue. [L-36](LESSONS.md) exists precisely to prevent this, on evidence: run 56
printed `?src=qa` in the same place and `arrival_fetch:qa` read **16 unattributed non-declaring
fetches** by that evening.

**The baseline is clean up to that instant, which is the one piece of luck here.**
`arrival_fetch:awesome-rss-feeds` has **never appeared in any daily series** — not on 08-20 … 08-24,
not at any point since the tag was allowlisted in PR #49. Verified against
[`metrics/2026-08-24.json`](metrics/2026-08-24.json), generated `2026-08-24T21:01:52.635Z`.

**Binding, so that a later run cannot read the wrong thing off this counter:**

- **`t0` is the instant a submission exists at the venue**, not the instant the tag became public.
  There is no `t0` yet; nothing has been submitted.
- Any `arrival_fetch:awesome-rss-feeds` recorded **between `2026-08-25T03:33:11Z` and `t0`** is
  attributable to **readers and crawlers of issue #1**, and to nothing else. It is **not** evidence of
  the venue, of demand, or of a background rate. Report it separately and labelled *pre-`t0`,
  issue-#1-attributable*.
- A non-zero pre-`t0` reading is **not** a reason to withdraw or delay the submission. It changes what
  the post-`t0` series must be read against, and that is all.
- This is **the same contamination EXP-010 was registered to measure**, arriving early and by
  accident. It does not substitute for EXP-010's `control_days` reading due **2026-09-04**, because
  `qa` remains the pre-registered control and is unaffected.

**[EXP-009](EXPERIMENTS.md) and [EXP-010](EXPERIMENTS.md) are byte-untouched.** Recorded here, outside
both pre-registrations, before the number exists. [L-47](LESSONS.md).

## 2026-08-27 (run 99) — EXP-009 Reading 1, graded

**The two dated notes above were written before these numbers existed. This is the reading they
constrain, taken exactly as they require.** Full grading, forks and decision live in
[EXP-009](EXPERIMENTS.md); this entry records the source, the series and the two clauses that bind how
they may be quoted.

**Source.** [`ops/metrics/2026-08-27.json`](metrics/2026-08-27.json) (identical to
[`latest.json`](metrics/latest.json)), `generated_at` **`2026-08-27T00:01:39.681Z`**, commit
[`346f442`](https://github.com/in-c0/tuned/commit/346f442), workflow run
[33025396417](https://github.com/in-c0/tuned/actions/runs/33025396417), event **`schedule`**, head
`2816f3d`. Days are UTC and 2026-08-26 is complete in it.

**The seven-day liveness series.** `feed_fetch_bot:sportstech`, 2026-08-20 … 2026-08-26:
**`1, 7, 1, 0, 3, 1, 0`** — non-zero on five of seven days. **EXP-009 Fork I-A passes.** Fork I-B was
withdrawn in run 84 ([L-44](LESSONS.md)) and is not fired; a zero on this name means no first-party QA
run was dispatched by hand that day, never a failed counter.

**The band, in two regimes that are never averaged together.** Unsuffixed `feed_fetch:sportstech`:

| regime | days | series |
|---|---|---|
| pre-autodiscovery | 2026-08-20 … 08-24 | **`1, 0, 0, 0, 0`** |
| post-autodiscovery | 2026-08-25 … 08-26 | **`16, 0`** |

- **The pre-deploy `1` is this loop's own tag.** 2026-08-20 reads `arrival_fetch:qa` **1** and
  site-wide `feed_fetch` **1** — one event, carrying `?src=qa`, the published control. Read as
  *third-party* arrivals the pre-deploy floor is **`0, 0, 0, 0, 0`**.
- **Correction to the 2026-08-25 (run 86) clause above, which called 08-20 … 08-24 "five complete
  pre-deploy days".** Autodiscovery went live at ~`2026-08-24T22:26Z`–`22:39Z`
  ([`28d9c65`](https://github.com/in-c0/tuned/commit/28d9c65) → read-back
  [`34d0412`](https://github.com/in-c0/tuned/commit/34d0412)), so 08-24's final ~95 minutes are
  post-deploy. Four complete pre-deploy days and one near-complete one. The value is `0` either way;
  the clause's substance stands and only its arithmetic is fixed.
- **Of 08-25's 16, one carried the venue tag** (`arrival_fetch:awesome-rss-feeds` = **1**) and is
  **pre-`t0`, issue-#1-attributable** under the run-87 clause above — excluded from anything Reading 2
  grades. **The other 15 carried no allowlisted tag.**
- **08-25 was site-wide, 08-26 was empty.** Unsuffixed fetches that day: `ava` 2, `graphics` 2,
  `sportstech` 16, `wearables` 2, `wellbeing` 1 = `feed_fetch` **23**. On 08-26 every handle read
  **0**. That is the shape of a sweep rather than a subscription — and **two days is not a test of a
  discovery path**, so it is not a claim that autodiscovery worked, nor that it failed.
- **No count above becomes a person.** These are polls of a file; there is no visitor identifier;
  `applications` **0** · `members_ever_active` **0** · followers **0** · gross cash **AUD $0** from
  *no billing exists*.

## Workflow-recovery note — the 2026-08-26 scheduled read path was delayed, not dropped

[Run 98](https://github.com/in-c0/tuned/issues/1#issuecomment-5431678218) recorded that neither
scheduled workflow had fired on 2026-08-26 at ~100 minutes past due, and asked whether the read path
was broken. **It was not. Both fired late and both succeeded:**

| workflow | cron | fired | delay | result |
|---|---|---|---|---|
| `verify production` | `20 20 * * *` | `2026-08-26T23:33:18Z` | ~3h13m | success, head `2816f3d` |
| `metrics snapshot` | `40 20 * * *` | `2026-08-27T00:01:28Z` | ~3h21m | success, head `2816f3d` |

Historical delay across every prior day since 2026-08-07 was 8–43 minutes, so ~3h15m is a real
outlier — but it is GitHub queueing a `schedule` event late, not an auto-disabled workflow, not a repo
fault, and **not lost data**: `daily` is cumulative from D1 and the 00:01Z snapshot carries the whole
series. **One consequence is worth stating plainly, because it cuts the other way from how it looked:
the delay is what made Reading 1 gradeable.** A snapshot at the scheduled 20:40Z on 08-26 would have
held an incomplete 08-26; crossing midnight UTC is what captured the complete day. The defect and the
enabling condition were the same event.

**What is lost is one file, not one day.** There is no `ops/metrics/2026-08-26.json` — snapshots are
named for the date at write time — so the per-day file series skips 08-26 while the data does not.
**Run 98's escalation test still stands:** if the 2026-08-27 20:20/20:40 UTC schedules also miss, one
outlier becomes a pattern and the read path needs work. One late delivery is not a defect.

## 2026-08-28 (run 106) — item 248, and a scheduled read path that missed its second day

**Read from production this run, `list` [33141249807](https://github.com/in-c0/tuned/actions/runs/33141249807)
at 04:14:47Z and snapshot `generated_at` 2026-08-28T04:18:03.655Z
([33141406899](https://github.com/in-c0/tuned/actions/runs/33141406899)):**

| Reading | Before | After |
| --- | --- | --- |
| `@sportstech` `public_items` | 14 | **15** |
| `@sportstech` `operator_publications` | 3 | **4** |
| site-wide `items_public` | 82 | **83** |
| `last_public_item_at` | 2026-08-24T21:43:45.078Z | **2026-08-28T04:14:13.569Z** |
| A4 | **FAILS** — 78.4h | **SATISFIED** to 2026-08-31T04:14:13Z |

**Every commercial reading is unchanged and every one of them is zero.** `applications` **0** ·
`members` **1** (the owner) · `members_ever_active` **0** · `active_last_7d` **0** ·
`active_last_28d` **0** · `followers` **0** · gross cash **AUD $0**, sourced from *no billing
exists*. Spend **AUD $0.00 of $500**. **Publishing an item moves none of these and is not claimed
to.**

**Landing, three complete-ish days, quoted as measured and not interpreted:** `landing_view`
**52 / 68 / 21** on 08-26 / 08-27 / 08-28-so-far, `landing_view_bot` **9 / 34 / 14**, and
`landing_engage` and `application_start` **absent — that is, zero — on all three.** 141 UA-flagged
human-bucket views and not one first interaction. Consistent with [EXP-007](EXPERIMENTS.md) Fork A;
**not a new grading of it**, because these are not the days that experiment named.

**One counter moved that has not moved before, and it is recorded without a story.** On 08-27,
unsuffixed `feed_fetch` = **2** and `feed_fetch:sportstech` = **2** — the third-party (non-`_bot`)
RSS counter, non-zero for the first time on that handle. **This is outside EXP-009 Reading 1's
window** (complete UTC days 08-20…08-26, graded run 99 and closed), so it changes no grade. The
standing rule holds: **`feed_fetch` is not demand and no fetch count becomes a number of people**
without a per-visitor identifier this service does not keep.

### The `metrics snapshot` schedule missed 2026-08-27, and that is the escalation test this file pre-registered

The [workflow-recovery note above](#workflow-recovery-note--the-2026-08-26-scheduled-read-path-was-delayed-not-dropped)
ends: *"if the 2026-08-27 20:20/20:40 UTC schedules also miss, one outlier becomes a pattern and the
read path needs work."* **They missed.**

| firing due | last `schedule` run of `metrics snapshot` | verdict |
| --- | --- | --- |
| 2026-08-26 20:40Z | [33025396417](https://github.com/in-c0/tuned/actions/runs/33025396417) at **2026-08-27T00:01:28Z** | ~3h21m late, succeeded |
| **2026-08-27 20:40Z** | **none** | **not delivered — 7h38m overdue when this run checked at 04:18Z** |

So **no scheduled snapshot existed between 2026-08-27T00:01Z and this run** — a **28-hour** gap in
the loop's only path to production counters, and nothing surfaced it, because a schedule that never
fires produces no failed run to notice. **Recovered by one `workflow_dispatch`**
([33141406899](https://github.com/in-c0/tuned/actions/runs/33141406899), success, `ops/metrics/2026-08-28.json`
committed as `94b8496`), which also **discriminates the fault**: the workflow, the secret, the
vantage logic and the commit path are all healthy, so what failed is **GitHub delivering the
`schedule` event**, not this repository.

**What is not concluded.** That the schedule is broken, that it will miss again, or that this is
connected to the ~6-hour Workers Builds stall of the same evening. Two late-or-missing deliveries in
three days is a pattern in the weak sense — *worth watching* — and the loop has one instrument for it
already: **every run reads `ops/metrics/latest.json`'s `generated_at`, and a value more than ~28
hours old now means dispatch a snapshot rather than quote a stale one.** No workflow change is
shipped for this: adding a redundant schedule to work around a delivery fault nobody has diagnosed
would hide the next occurrence rather than catch it.

## 2026-08-28 (run 107) — the pre-`t0` boundary re-read, and a background band that is not demand

**Two snapshots bracket the reviewer directive that re-published the joined tagged URL on issue #1 at
`2026-08-28T09:29:09Z`**, so the pre-`t0` contamination boundary can be stated from readings rather
than from reasoning:

| Reading | `generated_at` | `arrival_fetch:awesome-rss-feeds`, 2026-08-28 |
| --- | --- | --- |
| Last snapshot **before** the directive | `2026-08-28T04:26:59.682Z` | **absent (0)** |
| First snapshot **after** it (+3m55s) | `2026-08-28T09:33:04.047Z` | **absent (0)** |

**The boundary is unchanged and remains exactly what run 87 registered:** the only tagged fetch ever
recorded is **`arrival_fetch:awesome-rss-feeds` = 1 on 2026-08-25**, which is **pre-`t0` and
issue-#1-attributable**, never venue traffic, and **not counted** in any EXP-009 grade. Today's
directive is the **second** time a reviewer has printed the joined URL publicly ([L-47](LESSONS.md)
covers the first, `2026-08-25T03:33:11Z`); it has produced no tagged fetch in the four minutes
measured, and the standing rule stands: **any `arrival_fetch:awesome-rss-feeds` between
`2026-08-25T03:33:11Z` and `t0` is issue-#1-attributable and is reported separately.**

**A background band moved and is recorded without a story.** Unsuffixed `feed_fetch` — every RSS fetch
not from a self-declaring crawler — reads **08-27: 2 · 08-28: 5** (`feed_fetch:sportstech` identical on
both days, so all of it is `/sportstech`), against **0 on 08-21 … 08-24**. **None of it carries a
tag.** Per this file's own withdrawn description, unsuffixed `feed_fetch` is **not** established as a
third-party human band, and per the standing rule **a fetch count is not demand and does not become a
number of people**: a single feed reader polling on a schedule produces exactly this shape. It is
logged because it is the counter EXP-009 will read, and its pre-submission level must be on the record
**before** a submission exists — not because it means anything yet.

**Every commercial reading is unchanged and every one is zero.** `applications` **0** · `members` **1**
(the owner) · `members_ever_active` **0** · `active_last_7d` **0** · `active_last_28d` **0** ·
`followers` **0** · `items_public` **83** · gross cash **AUD $0**, from *no billing exists*. Spend
**AUD $0.00 of $500**, unchanged.

## 2026-08-28 (run 108) — a shipped change with no counter, said so before the question is asked

[`1b54f07`](https://github.com/in-c0/tuned/commit/1b54f07) gave the public feed page and the landing page
their Open Graph, description and canonical tags. **It adds no counter, and no counter already here can
observe its effect.**

**Why, precisely.** A link card is rendered by someone else's chat client from tags it read once; a search
snippet is rendered by an index. **Neither makes a request Tuned can attribute**, and this service keeps no
per-visitor identifier by design. So there is no metric that moves when this change works, and **its
absence from every table below is correct rather than an omission.**

**What may move, and what it does not mean.** `feed_view_bot` / `feed_view_bot:<handle>` can rise if
crawlers re-read the changed pages. **A crawl is not a person**, the standing rule is unchanged, and any
such movement is a re-read of a modified document — the least informative possible cause. Nothing here
emits or joins a tagged URL: the canonical and `og:url` are the **untagged** route, so
`arrival*`/`arrival_fetch*` are untouched and **[EXP-010](EXPERIMENTS.md)'s graded series is unaffected**.

**Every commercial reading is unchanged and every one is zero.** `applications` **0** · `members` **1**
(the owner) · `members_ever_active` **0** · `active_last_7d` **0** · `active_last_28d` **0** ·
`followers` **0** · `items_public` **83** · gross cash **AUD $0**, from *no billing exists*. Spend
**AUD $0.00 of $500**, unchanged.
