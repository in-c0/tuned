# Tuned — STATUS

**Last updated:** 2026-08-09 00:15 Sydney (2026-08-08 14:15 UTC), run 20 · **Head:** [`c6def8d`](https://github.com/in-c0/tuned/commit/c6def8d7f4575b65b6c3f8f9deb7a72613e27022)

> **Owner:** [**DASHBOARD.md**](DASHBOARD.md) is the one-screen view of everything below plus
> milestones, experiment, lessons and freshness. It **mirrors** this file — where the two disagree,
> this one is right.

## OWNER ACTION REQUIRED

### **Publish the Show HN post. It is written, checked and one paste away.**

| | |
| --- | --- |
| **Severity** | **Highest.** It is the only step between the loop and its first known-human traffic, and every other open question is downstream of it. |
| **Blocked outcome** | EXP-002 cannot start. Without it no arrival is known to be human, so the 0/115 conversion figure stays ungradeable and no demand, pricing or retention experiment below it is readable. |
| **Why owner authority** | Public posting carries account and reputational authority the executor does not hold — and holds no session for: no Hacker News credential, no cookie, and no network route to the host (`curl` exit 56, CONNECT 403, run 20). Posting on your behalf would be impersonation. |
| **Exact minimum action** | Open <https://news.ycombinator.com/submit> signed in → paste the title and URL from **[EXP-002-PACKET.md](EXP-002-PACKET.md)** → submit → post the body text as the first comment → paste the resulting `item?id=…` URL into [issue #1](https://github.com/in-c0/tuned/issues/1). Nothing to look up, nothing to fill in, nothing to word. ~3 minutes. |
| **Success check** | A canonical `https://news.ycombinator.com/item?id=…` URL exists and is recorded in issue #1. Authorization alone does not satisfy it, and the executor will not mark EXP-002 `STARTED` before that URL exists. |
| **Blocker age** | Opened 2026-08-08 13:56 UTC (23:56 Sydney), when authorization arrived. The packet itself has been ready since run 9 (2026-08-07). |
| **Last surfaced** | Here, and in the run-20 execution report. Per the owner-interface rule, no private channel was used: **no phone, email or SMS alert was sent.** |

The previous entry — `METRICS_KEY` mismatch across the two secret stores — remains **resolved and
removed**; its success check passed at snapshot run
[31246496587](https://github.com/in-c0/tuned/actions/runs/31246496587) (HTTP 200, `ops/metrics/latest.json`
committed at `a00a8fe`).

Payment-provider account creation is still **not** listed as an action: it becomes the blocking step
when there is paid demand to collect, and there is none. One action at a time, and this is the one.

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
denominator and no downstream experiment is gradeable.

**As of 2026-08-08 13:56 UTC that objective has an owner decision behind it and a publication step in
front of it.** The channel is authorized; the post is written, checked and canonical in
[EXP-002-PACKET.md](EXP-002-PACKET.md); what remains is a paste into a session only the owner holds.
The binding step moved from *decide* to *publish*, and no executor work substitutes for it.

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
| 1 | **No arrival is known to be human.** EXP-003 removed the mechanism explanation for 0/115 — the apply path works in production at both widths — so the denominator is the problem. **The authorization half is now resolved** (2026-08-08 13:56 UTC); what remains is the publication itself, which is an authentication boundary: the executor holds no Hacker News session and has no route to the host. | Owner publishes; executor measures | AUD $0 | **Open, still the top blocker — but its shape changed from a decision to a paste.** See OWNER ACTION REQUIRED. |
| 2 | **No payment path.** No payment-provider account exists, so gross cash is structurally $0 regardless of demand. | Owner — account creation | unknown | Not started. Not yet blocking: there is no demand to collect. |
| 3 | **EXP-002 is authorized and unpublished.** ~~Needs owner authorization~~ — **received 2026-08-08 13:56 UTC.** Measurement precondition met; no unfilled token; no unverified claim. The packet is now a single canonical file, [EXP-002-PACKET.md](EXP-002-PACKET.md), rather than a comment to scroll for. | Owner publishes | AUD $0 | **Merged into blocker #1** — same paste, same success check. Kept here only so the authorization is on the record as resolved. |
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
- **EXP-002 — Show HN distribution smoke test: AUTHORIZED, NOT STARTED.** Pre-registered; measurement-
  unblocked; the "0%-conversion funnel" objection retired by run 18; packet complete and its public
  claims checked by EXP-004. Owner authorized publication
  [2026-08-08 13:56 UTC](https://github.com/in-c0/tuned/issues/1#issuecomment-5226414917).
  **Its 48-hour clock has NOT started and will not start until a canonical
  `news.ycombinator.com/item?id=…` URL exists** — authorization is not publication, and the
  distinction is the difference between a graded experiment and a fabricated one.

## Next action

**Owner:** publish (above). **Executor:** nothing that competes with it. The pre-publication baseline
is already committed and current — `ops/metrics/latest.json` at `a00a8fe` — so the contrast EXP-002
grades against exists, and the daily 20:40 UTC snapshot keeps it fresh without a dispatch.

Explicitly **not** a copy or positioning rewrite, and **not** a CTA-reach counter: the mechanism is
proven, the denominator is about to change, and both would be measuring or persuading crawlers a few
hours before real arrivals make the same work gradeable.

## Not doing (deliberate holds)

- No pricing, positioning or copy work while the denominator is unknown. Run 18 makes this sharper,
  not weaker: the apply path is proven, so a failed copy test could no longer even be blamed on a
  broken form — it would simply be ungradeable against crawler traffic.
- No CTA-reach counter yet. It is the right instrument against the wrong traffic.
- No publication of EXP-002 **by the executor** — authorization is now given, but the executor holds
  no Hacker News session and posting in the owner's name would be impersonation. No second channel,
  no outreach, no seeding of the thread, no reword of the approved text.
- No secret read, hash, rotation, comparison or exposure — ever.
- No spend; the executor holds no payment credentials.
- No generic summarizer, content generator or enterprise agent-observability dashboard. Humans
  contribute attention, not content.
- No invented baseline, forecast, or traction claim — including any framing of the AUD $1M stretch
  target as a projection, and including any reading of 115 UA-flagged views as demand.
