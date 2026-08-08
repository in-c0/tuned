# Tuned — OWNER DASHBOARD

**Private.** This file lives in the private `in-c0/tuned` repository and is served on no Tuned route.

**This is a mirror, not a source of truth.** Every number here is copied from a canonical file and
linked back to it. If this file and a canonical file disagree, **the canonical file is right and this
one is stale** — see [Freshness](#8-last-materially-updated-and-freshness).

| Question | Answered in | Canonical source |
| --- | --- | --- |
| What must I do? | [§1](#1-owner-action-required) | [STATUS.md](STATUS.md) |
| Where are we? | [§2](#2-current-phase-and-single-objective) | [STATUS.md](STATUS.md) |
| Nearest milestone? | [§3](#3-milestone-horizons) | [MILESTONES.md](MILESTONES.md) |
| What are the numbers? | [§4](#4-funnel-revenue-and-spend) | [METRICS.md](METRICS.md) · [`metrics/latest.json`](metrics/latest.json) |
| What is blocked? | [§5](#5-blockers-ordered-by-leverage) | [STATUS.md](STATUS.md) |
| What is being tested? | [§6](#6-current-experiment) | [EXPERIMENTS.md](EXPERIMENTS.md) |
| What did we learn? | [§7](#7-latest-three-lessons) | [LESSONS.md](LESSONS.md) |

---

## 1. OWNER ACTION REQUIRED

### **NONE.**

Nothing is being withheld from you pending a decision. The last owner action — synchronizing
`METRICS_KEY` across the Worker and GitHub secret stores — **met its success check and is retired**:
snapshot run [31246496587](https://github.com/in-c0/tuned/actions/runs/31246496587) authenticated with
HTTP 200 and committed [`ops/metrics/latest.json`](metrics/latest.json) at
[`a00a8fe`](https://github.com/in-c0/tuned/commit/a00a8fe0da9989cee53ec5800fa0a0f01229fdf9). It was open
2026-08-07 → 2026-08-08 (~1 day) and is removed rather than archived here.

**Next owner-boundary item, deliberately *not* listed as an action:** payment-provider account
creation. It becomes the blocking step when there is paid demand to collect. There is none — see
[§4](#4-funnel-revenue-and-spend). Raising it now would be manufacturing an owner action.

**How this section behaves:** either `NONE`, or exactly one canonical action carrying severity, the
blocked outcome, why owner authority is required, the exact minimum action, an observable success
check, blocker age, and where it was last surfaced. It is removed the moment its success check passes,
not when the executor notices. New or materially changed actions are surfaced by the scheduled reviewer
directly in ChatGPT; unchanged ones are not repeated. Private channels (phone, email, SMS) are used
only with explicit owner authorization.

## 2. Current phase and single objective

**Phase:** first-baseline read. The funnel is instrumented **and readable** — three UTC days of
aggregate counts exist in the repository.

**Single active objective: explain the 0-application funnel.** Traffic arrives and nobody applies. The
next intervention must distinguish *the apply path is broken or unseen* from *the offer does not land
on whoever is arriving*. No pricing, billing or distribution work precedes that.

**Explicitly not doing** (full list in [STATUS.md](STATUS.md)): no pricing/positioning/feature work
while conversion is 0%; no EXP-002 publication before owner authorization **and** a funnel that
converts; no secret read, hash, rotation or exposure, ever; no spend; no generic summarizer, content
generator or enterprise observability dashboard; no invented baseline, forecast or traction claim.

## 3. Milestone horizons

All sixteen, from [MILESTONES.md](MILESTONES.md) — that file carries the full evidence conditions; this
is the index.

**Sub-day ladder anchor:** run 17, **2026-08-08 07:50 UTC / 17:50 Sydney**. It is rolling — re-anchored
at the start of each run. These six horizons did not exist before the owner requested them at
[07:04 UTC today](https://github.com/in-c0/tuned/issues/1#issuecomment-5225045057), so **no grade is
assigned to any sub-day window that closed before that**; inventing retrospective achievements is the
one thing this ladder must not do.

| Horizon | Target | Outcome in one line | Status | Blocker | Next action |
| --- | --- | --- | --- | --- | --- |
| 15 min | 08:05 UTC | Run-17 PR open, CI green | active | none | open PR, wait for `check` |
| 30 min | 08:20 UTC | Merged; production verified unchanged by SHA | active | none | merge on green, read `verify-production` job log |
| 1 hour | 08:50 UTC | Control-plane work stops; next selected action is the conversion diagnosis | active | none | name it in the run-17 report and in STATUS.md |
| 3 hours | 10:50 UTC | Known: can a visitor actually reach and complete an application in production today? | not started | executor egress blocked — must run via Actions | scripted production walk of the apply path |
| 6 hours | 13:50 UTC | CTA reach is instrumented with **one** additive counter, or a recorded reason it is the wrong instrument | not started | depends on the 3h answer | smallest additive counter, no copy change |
| 12 hours | 19:50 UTC | EXP-003 pre-registered with falsifiable bands before any reading is taken | not started | depends on 3h/6h | write it into EXPERIMENTS.md before data arrives |
| 1 day | 2026-08-09 | The funnel is readable — one authenticated snapshot | **achieved** 2026-08-08 | cleared | — |
| 1 week | 2026-08-15 | ≥3 consecutive daily snapshots; constraint identified as conversion or distribution | **active** — half answered | owner authorization for EXP-002; the 0% itself | diagnose 0% before adding traffic |
| 2 weeks | 2026-08-22 | A real payment path exists; first genuine willingness-to-pay evidence — or the wedge is falsified | not started | payment-provider account is an owner boundary | request the account once demand exists |
| 1 month | 2026-09-08 | First gross cash; activation measured, not assumed | not started | all of the above, in order | decided by the baseline |
| 3 months | 2026-11-08 | A small **retained paying cohort** | not started — *past the 2026-10-05 operating date; owner's to carry* | everything above | hand over an honest cohort table at closeout |
| 6 months | 2027-02-08 | Multiplayer earns its place: followed attention retains better than the solo desk | not started (directional) | wedge unproven | — |
| 1 year | 2027-08-08 | Provenance is the reason people stay; agent creators have identity and distribution | not started (directional) | — | — |
| 3 years | 2029-08 | Following an agent's attention is as ordinary as following a person's | not started (directional) | — | — |
| 5 years | 2031-08 | Attention provenance is infrastructure, verifiable rather than claimed | not started (directional) | — | — |
| Indefinite | — | Humans contribute **attention, not content**; provenance never blurred, never fabricated | standing doctrine | — | — |

**Nearest falsifiable milestone that is not this run's own paperwork: the 3-hour one** — establish
whether the apply path works at all.

## 4. Funnel, revenue and spend

Source: [`ops/metrics/latest.json`](metrics/latest.json) at
[`a00a8fe`](https://github.com/in-c0/tuned/commit/a00a8fe0da9989cee53ec5800fa0a0f01229fdf9),
`generated_at` 2026-08-08T07:35:20Z. Covers **3 UTC days** (2026-08-06 → 08-08); the last is partial,
ending 07:35 UTC. Full reading and caveats in [METRICS.md](METRICS.md).

| Stage | Observed | Note |
| --- | --- | --- |
| Landing views, human-flagged | **115** (29 / 69 / 17) | UA heuristic — **not** verified human traffic |
| Landing views, bot-flagged | **42** (15 / 23 / 4) | never merged with the above |
| Feed views | **7** human-flagged, 5 bot-flagged | 08-06 and 08-07 only |
| **Applications submitted** | **0** | `application_submit` has never fired |
| Member logins · desk views | **0** · **0** | counters have never fired |
| Attention actions since instrumentation | **0** | `attention_star` / `attention_skip` never fired |
| Members ever active | **0 of 1** | `member_days` is empty |
| Return use (D1+, 2+ active days) | **0** | nothing to return from |

- **Landing → application: 0 / 115 = 0.0%.** With zero events in 115 trials the 95% one-sided upper
  bound is ~2.6% — the true rate could be small-but-positive, but it is **not** high. Do not treat
  "0%" as a measured constant.
- **Gross cash collected: AUD $0.** Source: *no billing exists*. Not an estimate, not a forecast.
- **Autonomous spend: AUD $0.00 of the AUD $500 cap.** Running total in [DECISIONS.md](DECISIONS.md).
- **No traction is claimed.** Tuned has never been posted anywhere; 115 UA-flagged views on a product
  with no distribution is most plausibly incidental and scanner traffic the heuristic missed, plus the
  owner and this loop's own verification runs. It proves **the counters work**, not that demand exists.
- All-time content totals **predate instrumentation and are inventory, not activity**: 79 public items,
  27 queued, 5 feeds (1 human / 4 agent), 8 stars, 33 skips, 1 member, 0 followers, 1 connection.
- **On the AUD $1,000,000 / 60-day stretch target:** it is optimization pressure and direction. No
  number on this dashboard forecasts it and none should be read as predicting it.

## 5. Blockers ordered by leverage

| # | Blocker | Owner | Cost | State |
| --- | --- | --- | --- | --- |
| 1 | **Zero applications from 115 landing views.** No counter distinguishes "saw the CTA" from "saw the page", so the funnel's own data cannot say whether the apply path is broken/unseen or the offer does not land. | **Executor** | AUD $0 | Open. The active objective. |
| 2 | **No payment path.** No provider account exists, so gross cash is structurally $0 regardless of demand. | Owner — account creation | unknown | Not started; **not yet blocking** — no demand to collect. |
| 3 | **EXP-002 (first distribution test) authored but unpublished.** Its measurement precondition is now met. | Owner authorizes; executor prepared | AUD $0 | Ready, **held** — sending traffic into a 0%-conversion funnel would burn the one attributable channel. |
| 4 | **Executor has no direct egress to `justtuned.com`** (403 CONNECT at the proxy, 16 consecutive runs). GitHub's REST API is likewise blocked to direct `curl`. | Environment | — | Mitigated, not fixed: Actions is the production read path and it works. Standing limitation, not a stop condition. |

## 6. Current experiment

- **EXP-001 — funnel telemetry baseline: PASSED / CLOSED** (run 16). Threshold was a non-zero
  `landing_view` or `landing_view_bot` on ≥1 day; observed non-zero on **all three**. Its pre-registered
  fork (*zero views → distribution problem*) **did not fire** — the constraint sits one stage further
  down than the experiment was built to see.
- **EXP-002 — Show HN distribution smoke test: NOT STARTED.** Pre-registered; measurement-unblocked;
  held on owner authorization *and* on blocker #1.
- **EXP-003 — conversion diagnosis: not yet written.** Due at the 12-hour horizon, and it must be
  pre-registered **before** any reading is taken.

Details and grading rules: [EXPERIMENTS.md](EXPERIMENTS.md).

## 7. Latest three lessons

From [LESSONS.md](LESSONS.md), newest first. Each entry there carries the full problem → attempt →
mistake → why → evidence → lesson → next attempt → prevention check.

| # | Lesson | More elegant next attempt |
| --- | --- | --- |
| **L-08** | **Control-plane work is the easiest thing to keep choosing.** By day 3: build gate, CI, telemetry, 23 tests, version-stamped deploys, trigger guards, claim protocol — and zero distribution, no payment capability, no funnel ever read. Every step locally justified; the aggregate spent days on the machine that produces evidence rather than on evidence. | When the next-best action is control-plane work, **first name the demand experiment it unblocks** and check whether that experiment could run without it. |
| **L-07** | **Fourteen reports to an unread channel look exactly like a blocked loop.** The same blocker was re-described to the same private surface fourteen times over three days; from inside, an undelivered message and an ignored one are indistinguishable. | First report → full detail; second → one line; third → escalate on a different authorized channel; thereafter → **silence until state changes**. |
| **L-06** | **A two-sided secret fails identically for three different reasons.** Absent (503), present-but-undeployed, and present-but-different (401) were collapsed into one narrative for eleven runs, because the loop watched the *unauthenticated* status — which cannot see a mismatch. | Provision both stores from **one** read of one value in a single authenticated shell; design surfaces so distinct failures stay distinguishable. |

This dashboard is itself the kind of work L-08 warns about. It was directed, it is bounded to
documentation, and the honest test is whether the next run spends its cycle on the conversion diagnosis
instead of on more of this.

## 8. Last materially updated and freshness

| | |
| --- | --- |
| **Last materially updated** | 2026-08-08 17:50 Sydney (07:50 UTC) |
| **Run** | 17 — [directive](https://github.com/in-c0/tuned/issues/1#issuecomment-5225190862) · [claim](https://github.com/in-c0/tuned/issues/1#issuecomment-5225194650) |
| **Repository commit at time of writing** | [`0e9d9d5`](https://github.com/in-c0/tuned/commit/0e9d9d5ed45c084321f868f0e5e9a24e72d81525) (the merge commit for this change is recorded in the run-17 execution report on issue #1) |
| **Data commit** | [`a00a8fe`](https://github.com/in-c0/tuned/commit/a00a8fe0da9989cee53ec5800fa0a0f01229fdf9) — `generated_at` 2026-08-08T07:35:20Z |
| **Freshness state** | **FRESH.** Written 15 minutes after the snapshot it reports, against the current `master`. |

**Freshness rule, so a future reader can grade this without trusting it:** this dashboard is stale
whenever `ops/metrics/latest.json` has a newer `generated_at` than the data commit above, or `STATUS.md`
has been materially updated since. Snapshots run daily at 20:40 UTC, so a dashboard more than ~24h old
is presumed stale until re-synchronized. It is updated **only on material state change** — not every
run — and it never becomes a second source of truth.
