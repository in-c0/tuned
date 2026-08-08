# Tuned — STATUS

**Last updated:** 2026-08-08 17:50 Sydney (07:50 UTC), run 17 · **Head:** [`0e9d9d5`](https://github.com/in-c0/tuned/commit/0e9d9d5ed45c084321f868f0e5e9a24e72d81525)

> **Owner:** [**DASHBOARD.md**](DASHBOARD.md) is the one-screen view of everything below plus
> milestones, experiment, lessons and freshness. It **mirrors** this file — where the two disagree,
> this one is right.

## OWNER ACTION REQUIRED

**NONE.**

The previous entry — `METRICS_KEY` mismatch between the Worker and GitHub secret stores — **is
resolved and removed**. Success check passed on the terms it was written: snapshot run
[31246496587](https://github.com/in-c0/tuned/actions/runs/31246496587) authenticated with HTTP 200 and
committed `ops/metrics/latest.json` at `a00a8fe`. Open 2026-08-07 → 2026-08-08 (~1 day); last
surfaced in the run-14 escalation and as blocker #1 here.

The next owner-boundary item is **not yet required** and is deliberately not listed as an action:
payment-provider account creation only becomes the blocking step when there is paid demand to
collect, and there is none — see below. Nothing is being withheld from you pending a decision.

One screen of current state. Not a diary — the narrative lives in
[DECISIONS.md](DECISIONS.md), [EXPERIMENTS.md](EXPERIMENTS.md), [METRICS.md](METRICS.md) and
[issue #1](https://github.com/in-c0/tuned/issues/1). Update only when state **materially** changes.

## Phase and single active objective

**Phase:** first-baseline read. The funnel is instrumented **and readable**; three UTC days of
aggregate counts now exist in the repository.

**Active objective:** explain the **0-application funnel**. Traffic arrives and nobody applies. The
next intervention must distinguish *the apply path does not work / is not seen* from *the offer does
not land on whoever is arriving*. No pricing, billing or distribution work precedes that.

## Shipped and verified

| Capability | State | Evidence |
| --- | --- | --- |
| Production serving | healthy | `/` 200, `/api/version` = `3b9dcac`, [run 31245509086](https://github.com/in-c0/tuned/actions/runs/31245509086) |
| Deploy pipeline | working | Cloudflare Workers Builds on `master`; `npm ci && npm run check` → `wrangler deploy` |
| Clean-clone build gate | fixed + CI-enforced | run 1, `.github/workflows/check.yml` |
| Deploy verification by version identity | working | `verify-production.yml` polls `/api/version` for the pushed SHA, fails closed |
| Funnel telemetry (9 counters, 2 additive tables) | deployed and **read** | `feb6c4f`; `src/metrics.ts` |
| Aggregate read path `GET /api/metrics` | **working, authenticated** | HTTP 200 in [run 31246496587](https://github.com/in-c0/tuned/actions/runs/31246496587); key-gated, fails closed |
| Metrics snapshot → repository | **working** | `ops/metrics/latest.json`, `ops/metrics/2026-08-08.json` at `a00a8fe` |
| Automated tests | 23 passing, mutation-checked | `test/metrics.test.ts` |
| Production dependency advisories | none | `npm audit --omit=dev` clean; `hono ^4.12.34` |

## Real metrics and revenue

First observed baseline. Source: `ops/metrics/latest.json`, `generated_at` 2026-08-08T07:35:20Z.
Covers **3 UTC days** (2026-08-06 → 2026-08-08); the last is partial, ending 07:35 UTC.

| Stage | Observed | Note |
| --- | --- | --- |
| Landing views, human-flagged | **115** (29 / 69 / 17) | UA heuristic — **not** verified human traffic |
| Landing views, bot-flagged | **42** (15 / 23 / 4) | never merged with the above |
| Feed views | **7** human-flagged, 5 bot-flagged | 2026-08-06 and 08-07 only |
| **Applications submitted** | **0** | `application_submit` never fired; `waitlist` empty all-time |
| Member logins | **0** | counter never fired |
| Desk views | **0** | counter never fired |
| Attention actions since instrumentation | **0** | `attention_star` / `attention_skip` never fired |
| Members ever active (≥1 active day) | **0 of 1** member | `member_days` is empty |
| Return use (D1+ / 2+ active days) | **0** | nothing to return from |

- **Landing → application conversion: 0 / 115 = 0.0%.** With zero events in 115 trials the 95%
  one-sided upper bound is ~2.6%; the true rate could be small-but-positive, but it is **not** high.
- All-time content totals, which **predate** instrumentation and are not activity: 79 public items,
  27 queued, 5 feeds (1 human / 4 agent), 8 stars, 33 skips, 1 member, 0 followers, 1 connection.
- **Gross cash collected: AUD $0.** Source: *no billing exists*. Not an estimate, not a forecast.
- **Autonomous spend: AUD $0.00 of $500.**
- **No traction is claimed.** 115 human-flagged views on a product that has never been posted
  anywhere is most likely incidental and scanner traffic the UA heuristic did not catch. It is
  evidence that the counters work, **not** evidence of demand.

## Blockers, ordered by leverage

| # | Blocker | Owner | Cost | State |
| --- | --- | --- | --- | --- |
| 1 | **Zero applications from 115 landing views.** Unknown whether the apply path is broken/unseen or the offer does not land. No counter distinguishes "saw the CTA" from "saw the page", so the funnel's own data cannot yet answer it. | **Executor** | AUD $0 | Open, identified this run. Next candidate. |
| 2 | **No payment path.** No payment-provider account exists, so gross cash is structurally $0 regardless of demand. | Owner — account creation | unknown | Not started. Not yet blocking: there is no demand to collect. |
| 3 | **EXP-002 (first distribution test) is authored but unpublished** — needs owner authorization. Its measurement precondition (a readable funnel) is now **met**. | Owner authorizes, executor prepared | AUD $0 | Ready, held. Sending traffic into a 0%-conversion funnel would burn the channel. |
| 4 | **Executor has no direct egress to `justtuned.com`** (403 CONNECT at the proxy, 16 consecutive runs). Mitigated, not fixed: GitHub Actions is the production read path — and it now demonstrably works. | Environment | — | Standing limitation, not a stop condition. |

## Current experiment

- **EXP-001 — funnel telemetry baseline: PASSED / CLOSED.** Threshold was a non-zero `landing_view`
  or `landing_view_bot` on ≥1 day; observed non-zero on **all three** days. The instrumentation is
  confirmed working end to end in production, and the pre-registered "zero means no traffic" fork
  does not apply.
- **EXP-002 — Show HN distribution smoke test:** **NOT STARTED**, pre-registered, now
  measurement-*unblocked* but held on authorization and on blocker #1.

## Next action

Diagnose blocker #1 with the smallest honest instrument, not with a redesign: establish whether a
visitor can reach and complete the application in production today, and whether the CTA is seen at
all. Prefer one additive counter over any change to the landing page's content or claims.

## Not doing (deliberate holds)

- No pricing, positioning or broad feature work while landing → application is 0%.
- No publication of EXP-002 before owner authorization — and not into a 0%-conversion funnel.
- No secret read, hash, rotation, comparison or exposure — ever.
- No spend; the executor holds no payment credentials.
- No generic summarizer, content generator or enterprise agent-observability dashboard. Humans
  contribute attention, not content.
- No invented baseline, forecast, or traction claim — including any framing of the AUD $1M stretch
  target as a projection, and including any reading of 115 UA-flagged views as demand.
