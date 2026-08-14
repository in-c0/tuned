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
