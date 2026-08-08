# Tuned — STATUS

**Last updated:** 2026-08-08 20:20 Sydney (10:20 UTC), run 19 · **Head:** [`644c23a`](https://github.com/in-c0/tuned/commit/644c23acb741eeafa8b17d8f4b172af47a777efc)

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

**Phase:** the funnel is readable, and as of run 18 the **apply path is proven to work in
production**. The constraint is no longer inside the product.

**Active objective: obtain controlled, known-human traffic.** EXP-003 answered the mechanism
question — a visitor who arrives *can* apply, at both mobile and desktop widths — so the remaining
explanations for 0/115 are that the arrivals were never human, or that the offer does not land on
whoever is arriving. **Neither is decidable from a denominator of UA-classified requests.** Until
some arrivals are known to be human, every conversion figure Tuned computes has an unknown
denominator and no downstream experiment is gradeable. That makes a first authorized channel the
binding step — an owner decision — not more instrumentation and not a copy rewrite.

## Shipped and verified

| Capability | State | Evidence |
| --- | --- | --- |
| Production serving | healthy | `/` 200, `/api/version` = `5ef6970`, [run 31251251027](https://github.com/in-c0/tuned/actions/runs/31251251027) |
| Deploy pipeline | working | Cloudflare Workers Builds on `master`; `npm ci && npm run check` → `wrangler deploy` |
| Clean-clone build gate | fixed + CI-enforced | run 1, `.github/workflows/check.yml` |
| Deploy verification by version identity | working | `verify-production.yml` polls `/api/version` for the pushed SHA, fails closed |
| Funnel telemetry (9 counters, 2 additive tables) | deployed and **read** | `feb6c4f`; `src/metrics.ts` |
| Aggregate read path `GET /api/metrics` | **working, authenticated** | HTTP 200 in [run 31246496587](https://github.com/in-c0/tuned/actions/runs/31246496587); key-gated, fails closed |
| Metrics snapshot → repository | **working** | `ops/metrics/latest.json`, `ops/metrics/2026-08-08.json` at `a00a8fe` |
| **Application path, end to end in production** | **verified working** | EXP-003 [run 31251303499](https://github.com/in-c0/tuned/actions/runs/31251303499) — real Chromium, both widths, submit intercepted before mutation |
| **Public no-account surfaces** (demo feed + RSS) | **verified working** | EXP-004 [run 31252271974](https://github.com/in-c0/tuned/actions/runs/31252271974) — `/ava` 200 with 24 items, `/ava/rss.xml` 200 with 38, both widths |
| Browser QA harness | working, dispatch-only, **reusable** | `qa/`, `exp003-mechanism.yml` (pinned to its own spec) and `qa-browser.yml` (takes a spec as input); screenshots per run |
| Automated tests | 30 passing, mutation-checked | `test/metrics.test.ts`, `test/meta.test.ts` |
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
| 1 | **No arrival is known to be human.** EXP-003 removed the mechanism explanation for 0/115 — the apply path works in production at both widths — so the denominator is now the problem. 115 UA-flagged views on a product never posted anywhere is most likely crawler traffic the heuristic missed. **Every conversion figure Tuned computes is currently ungradeable**, and a copy experiment run against it would produce an unreadable number. | Owner authorizes a first channel; executor measures | AUD $0 | **Open, and now the top blocker.** Superseded the run-17 entry, which is answered. |
| 2 | **No payment path.** No payment-provider account exists, so gross cash is structurally $0 regardless of demand. | Owner — account creation | unknown | Not started. Not yet blocking: there is no demand to collect. |
| 3 | **EXP-002 (first distribution test) is authored but unpublished** — needs owner authorization. Measurement precondition met; the run-18 objection ("do not send traffic into a funnel that may be broken") is retired; and as of run 19 the packet has **no unfilled token and no unverified claim** — `[DEMO_FEED_URL]` = `https://justtuned.com/ava`, and the "live feed + open RSS" promise is checked. | Owner authorizes, executor prepared | AUD $0 | Ready, held **only** on authorization. Nothing left for the owner to look up. |
| 4 | **Executor has no direct egress to `justtuned.com`** (403 CONNECT at the proxy, 18 consecutive runs). Mitigated, not fixed: GitHub Actions is the production read path — and it now demonstrably works. | Environment | — | Standing limitation, not a stop condition. |

## Current experiment

- **EXP-001 — funnel telemetry baseline: PASSED / CLOSED.** Threshold was a non-zero `landing_view`
  or `landing_view_bot` on ≥1 day; observed non-zero on **all three** days. The instrumentation is
  confirmed working end to end in production, and the pre-registered "zero means no traffic" fork
  does not apply.
- **EXP-003 — application mechanism test: PASSED / CLOSED (run 18).** Pre-registered before any
  reading. All six criteria hold on live production at both 390×844 and 1440×900
  ([run 31251303499](https://github.com/in-c0/tuned/actions/runs/31251303499)). No application was
  created, no counter incremented — the submit was intercepted in-browser. One unrelated first-party
  404 was found on the first run and fixed in [`5ef6970`](https://github.com/in-c0/tuned/commit/5ef6970b50487cace86fb4fbdbac8d7a33e2afba).
- **EXP-004 — public no-account surfaces: PASSED / CLOSED (run 19).** Pre-registered before any
  reading. All five criteria hold on live production at both widths
  ([run 31252271974](https://github.com/in-c0/tuned/actions/runs/31252271974)): the demo link
  resolves to `https://justtuned.com/ava`, that feed serves 200 with **24 items** and no empty
  state, `/ava/rss.xml` serves 200 `application/rss+xml` with **38 items**, and there are no
  first-party errors and no horizontal overflow. GETs only — nothing was written.
- **EXP-002 — Show HN distribution smoke test:** **NOT STARTED**, pre-registered, measurement-
  unblocked, the "0%-conversion funnel" objection retired by run 18, and as of run 19 **complete**:
  no blank to fill, and its "live feed + open RSS" claim verified before the owner makes it. Held on
  owner authorization alone.

## Next action

**Get known-human arrivals, from one authorized channel, and measure them separately.** Not another
instrument, and explicitly **not** a copy or positioning rewrite — the mechanism is proven, so the
next uncertainty is who is arriving, and that cannot be resolved by editing the page. A CTA-reach
counter remains worth adding, but *second*, and only against traffic known to contain humans;
shipped now it would measure crawlers.

## Not doing (deliberate holds)

- No pricing, positioning or copy work while the denominator is unknown. Run 18 makes this sharper,
  not weaker: the apply path is proven, so a failed copy test could no longer even be blamed on a
  broken form — it would simply be ungradeable against crawler traffic.
- No CTA-reach counter yet. It is the right instrument against the wrong traffic.
- No publication of EXP-002 before owner authorization — and not into a 0%-conversion funnel.
- No secret read, hash, rotation, comparison or exposure — ever.
- No spend; the executor holds no payment credentials.
- No generic summarizer, content generator or enterprise agent-observability dashboard. Humans
  contribute attention, not content.
- No invented baseline, forecast, or traction claim — including any framing of the AUD $1M stretch
  target as a projection, and including any reading of 115 UA-flagged views as demand.
