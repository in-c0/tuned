# Tuned — STATUS

**Last updated:** 2026-08-13 08:30 Sydney (2026-08-12 22:30 UTC), run 32 — **blocker #0 opened and closed inside 25 minutes: one dropped Cloudflare build, not a broken pipeline; production is green and current** · **Head:** [`23b1f42`](https://github.com/in-c0/tuned/commit/23b1f42)

> **Run 32 closed the deploy scare and changed nothing else.** `ffe54b4` was never picked up by Workers
> Builds; the next push deployed in 61 seconds and `verify production` passed every step against it.
> Production serves `master` and the skipped commit's content is live inside its descendant. The owner
> action below is untouched and remains the only open one — **there is nothing to check in Cloudflare.**

> **Run 31 recorded a grade the loop had written down in advance, and changed nothing else.** On
> 2026-08-11 the 1-week horizon precommitted that if the Show HN paste had not happened by
> **2026-08-13**, the milestone would be **missed on its second condition**. It has not happened, so
> that grade is now applied as written — deadline, thresholds and EXP-002's bands all untouched.
> **EXP-002 remains `AUTHORIZED / NOT STARTED`:** a missed milestone is a fact about the calendar, not
> a failed experiment, and nothing in this run converts one into the other. The card below stands
> exactly as it did. No product, copy, billing, channel or workflow change was made.

> **Owner:** [**DASHBOARD.md**](DASHBOARD.md) is the one-screen view of everything below plus
> milestones, experiment, lessons and freshness. It **mirrors** this file — where the two disagree,
> this one is right.

## OWNER ACTION REQUIRED

### **Publish the Show HN. It is written, checked, and one paste away in [EXP-002-PACKET.md](EXP-002-PACKET.md).**

**Bot Fight Mode is off and the zone is serving.** The blocker that displaced this action for three
runs is resolved — verified twice from GitHub's network, 4½ hours apart, from two Cloudflare colos,
by both a plain `curl` and the named first-party contract. `/ava/rss.xml` returns 200 to a
non-browser client again, which is the fact that mattered. Evidence in the resolved entry below. The
paste returns to the top of this card exactly as promised.

| | |
| --- | --- |
| **Severity** | **Top blocker, and now the only one.** Applications remain **0** across every day the loop has measured, against **431** UA-flagged human-shaped landing views since 2026-08-06. Nothing in the funnel can be graded while the denominator is crawler traffic and referral-less direct hits. |
| **The blocked outcome** | EXP-002 is `AUTHORIZED / NOT STARTED`. Its 48-hour clock has never started and **will not start until a canonical `news.ycombinator.com/item?id=…` URL exists** — authorization is not publication, and treating it as such would produce a graded-looking experiment that never ran. |
| **Why owner authority** | The executor holds no Hacker News session and has no route to the host. Posting in your name would be impersonation, which is a standing stop condition — this is a boundary, not a capability gap. |
| **Exact minimum action** | Open [EXP-002-PACKET.md](EXP-002-PACKET.md); paste the title, the URL and the first comment into Show HN as written; then paste the resulting `item?id=…` URL into [issue #1](https://github.com/in-c0/tuned/issues/1). Nothing else is required of you. |
| **Why the packet is safe to paste now** | Its public claims were checked against live production by EXP-004 (run 19), and the one claim the incident put at risk — *"every feed has open RSS"* — is the exact thing re-verified green this run: `/ava/rss.xml` → `200 application/rss+xml`, 18,562 bytes, to bare `curl`. |
| **Success check** | A canonical HN item URL appears in issue #1. That URL starts EXP-002's 48-hour clock; the executor grades it on its pre-registered bands against the `55ece3c` pre-publication baseline, now supplemented by the fresh baseline at [`ae37b7e`](https://github.com/in-c0/tuned/commit/ae37b7e). |
| **Blocker age** | Authorized **2026-08-08 13:56 UTC** — unpublished for **4 days and 8 hours**, two of which were consumed by the Bot Fight Mode incident rather than by the decision. **It has now cost a milestone:** the 1-week horizon is graded missed on its publication condition as of 2026-08-13 Sydney, per a precommitment written on 2026-08-11. |
| **Honest caveat to carry into grading** | The baseline window now spans days when the zone challenged every non-browser client. That will be stated when EXP-002 is graded, rather than discovered afterwards. |
| **Last surfaced** | Run 25 report; one push notification 2026-08-10 21:53 UTC (about the incident, not this). This card was displaced, not withdrawn, in runs 25–28. |

**Resolved and kept on the record: Bot Fight Mode.** Closed **2026-08-11**, by the owner, between
04:59:48 and 05:06:18 UTC. Two independent readings settle it, and neither is an inference:

| Reading | Time (UTC) | Vantage | Result |
| --- | --- | --- | --- |
| [verify production 31460563014](https://github.com/in-c0/tuned/actions/runs/31460563014) | 05:06:19–05:07:02 | `vantage=public`, ray `a294b5e62f7b1039-IAD` | `/` 200 · `/api/version` 200 · `/api/metrics` **401** unauthenticated · `/terms` + `/privacy` 200 with `legal@justtuned.com` · `/ava/rss.xml` **200** `application/rss+xml` · **Public availability step skipped** because the zone was no longer blocked |
| [metrics snapshot 31478252880](https://github.com/in-c0/tuned/actions/runs/31478252880) | 09:33:53–09:33:57 | `vantage=public`, ray `a2963de05b50e51c-DFW` | same five paths green from a second colo · authenticated `/api/metrics` 200 · `zone_blocked=false` |

**`cf-mitigated` was empty on every row of both probe tables, and the `bare` variant — plain
`curl/8.x`, the client that was being challenged — now passes identically to the named contract.**
That is the signature of the toggle being off rather than of a client that learned to look
acceptable. The executor changed no Cloudflare setting, sent no disguised request, and dispatched no
`verify production` run: the 05:06 evidence was a byproduct of shipping [`1c3fe86`](https://github.com/in-c0/tuned/commit/1c3fe867f2a83903cf4bdeb9b3b3c12b1efbb519),
and the 09:33 evidence a byproduct of taking the baseline.

The custom *"Block PHP/WordPress/.env scanner probes"* rule and the managed `CVE-2025-55182` rule were
never implicated and remain untouched. The standing recommendation from run 28 stands: if bot
protection returns, use rate limiting or **Super Bot Fight Mode with path exemptions** for `GET /`,
`/ava/*`, `/*/rss.xml` and `/api/*` — plain Bot Fight Mode cannot be scoped at all, which is what
caused this.

Payment-provider account creation is still **not** listed as an action: it becomes the blocking step
when there is paid demand to collect, and there is none. One action at a time, and this is the one.

One screen of current state. Not a diary — the narrative lives in
[DECISIONS.md](DECISIONS.md), [EXPERIMENTS.md](EXPERIMENTS.md), [METRICS.md](METRICS.md) and
[issue #1](https://github.com/in-c0/tuned/issues/1). Update only when state **materially** changes.

## Phase and single active objective

**Phase: incident CLOSED 2026-08-11.** It ran from 2026-08-10 06:53 UTC to some point between
04:59:48 and 05:06:18 UTC on 2026-08-11 — roughly 22 hours, of which the last three runs were spent
correctly standing down rather than working around a control the owner had enabled. Both production
readers are green through the public zone from two colos. What it cost: two days of ungradeable
arrival counters, and one day where the loop believed the site was dark for everyone when it was
in fact dark only to machines.

**Active objective, restored: get one cohort of controlled, known-human traffic in front of the
landing page, and find out whether anybody applies.** This was the objective before the incident
displaced it, and nothing learned since has weakened it — 0 applications against 431 human-flagged
views is still the finding that governs everything downstream. It is now blocked on exactly one
thing, and that thing is a paste.

**The superseded objective, retained because it resumes unchanged the moment the edge clears:** EXP-003 answered the mechanism
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
| Production serving | **Green through the public zone**, most recently [run 31640663090](https://github.com/in-c0/tuned/actions/runs/31640663090) on 2026-08-12 at **21:03 UTC** — landing and legal pages 200, unauthenticated `/api/metrics` 401, and the challenge-only failure step correctly skipped because `zone_blocked=false`. The two readings that closed the incident are kept below as the record of that closure | [verify production 31460563014](https://github.com/in-c0/tuned/actions/runs/31460563014) at 05:06 UTC (`vantage=public`, ray `a294b5e62f7b1039-IAD`) and [metrics snapshot 31478252880](https://github.com/in-c0/tuned/actions/runs/31478252880) at 09:33 UTC (ray `a2963de05b50e51c-DFW`) both read `justtuned.com` directly: `1c3fe86` live, `/` 200, `/api/version` 200, unauthenticated `/api/metrics` 401, `/terms` and `/privacy` 200 with `legal@justtuned.com`, `/ava/rss.xml` 200 `application/rss+xml`. `cf-mitigated` empty on every row; the `bare` curl variant passes identically to the named contract. The origin route on `workers.dev` still answers and is no longer the only vantage. |
| Deploy pipeline | working | Cloudflare Workers Builds on `master`; `npm ci && npm run check` → `wrangler deploy` |
| Clean-clone build gate | fixed + CI-enforced | run 1, `.github/workflows/check.yml` |
| Deploy verification by version identity | **restored, and exercised for real** | `verify-production.yml` polls `/api/version` for the pushed SHA and fails closed. When the zone will not answer it reads identity and health from the Worker's `workers.dev` origin, then grades public availability **separately** — a step that failed [run 31437633360](https://github.com/in-c0/tuned/actions/runs/31437633360) while every other check in it passed. That is the intended shape: a green run still means the public can use Tuned |
| Funnel telemetry (9 counters, 2 additive tables) | deployed and **read** | `feb6c4f`; `src/metrics.ts` |
| Aggregate read path `GET /api/metrics` | **working, authenticated** | HTTP 200 in [run 31246496587](https://github.com/in-c0/tuned/actions/runs/31246496587); key-gated, fails closed |
| Metrics snapshot → repository | **working** | `ops/metrics/latest.json`, `ops/metrics/2026-08-08.json` at `a00a8fe` |
| **Application path, end to end in production** | **verified working** | EXP-003 [run 31251303499](https://github.com/in-c0/tuned/actions/runs/31251303499) — real Chromium, both widths, submit intercepted before mutation |
| **Public no-account surfaces** (demo feed + RSS) | **verified working** | EXP-004 [run 31252271974](https://github.com/in-c0/tuned/actions/runs/31252271974) — `/ava` 200 with 24 items, `/ava/rss.xml` 200 with 38, both widths |
| Browser QA harness | working, dispatch-only, **reusable** | `qa/`, `exp003-mechanism.yml` (pinned to its own spec) and `qa-browser.yml` (takes a spec as input); screenshots per run |
| Automated tests | 30 passing, mutation-checked | `test/metrics.test.ts`, `test/meta.test.ts` — now on vitest 4.1.10 |
| Production dependency advisories | none | `npm audit --omit=dev` clean; `hono ^4.12.34` |
| **Dev-toolchain advisories** | **none — 6 high cleared run 30** | [#27](https://github.com/in-c0/tuned/pull/27) → `92d850e`. `wrangler` 4.120.1 + `@cloudflare/vitest-pool-workers` 0.21.0 + `vitest` 4.1.10 collapse the tree to one wrangler and one miniflare, both out of the advisory range. `npm audit` **0 vulnerabilities**. No `src/` change — the deployed Worker is byte-identical |

## Real metrics and revenue

Source: `ops/metrics/latest.json` at [`567dad0`](https://github.com/in-c0/tuned/commit/567dad0),
`generated_at` **2026-08-12T21:24:27Z**. Covers **7 UTC days** (2026-08-06 → 2026-08-12, the last
partial — it was read at 21:24 UTC, before that day closed). Read through the **public zone**;
`zone_blocked=false`.

| Stage | Observed | Note |
| --- | --- | --- |
| Landing views, human-flagged | **431** (29 / 69 / 56 / 56 / 84 / 71 / 66) | UA heuristic — **not** verified human traffic |
| Landing views, bot-flagged | **140** (15 / 23 / 43 / 7 / 18 / 26 / 8) | never merged with the above |
| Feed views | **62** human-flagged, **58** bot-flagged | all seven days |
| **Applications submitted** | **0** | `application_submit` never fired; `waitlist` empty all-time |
| Member logins | **0** | counter never fired |
| Desk views | **0** | counter never fired |
| Attention actions since instrumentation | **0** | `attention_star` / `attention_skip` never fired |
| Members ever active (≥1 active day) | **0 of 1** member | `member_days` is empty |
| Return use (D1+ / 2+ active days) | **0** | nothing to return from |

- **Landing → application conversion: 0 / 431 = 0.0%.** With zero events in 431 trials the 95%
  one-sided upper bound is ~0.7% (was ~1.1% at n=285). The bound tightens; the estimate does not move,
  and the denominator is still UA-classified requests rather than known people.
- **08-11 finished far above where it was last read: 39 → 71 human-flagged, 11 → 26 bot-flagged, and
  feed views 0 → 15 human-flagged.** That is not new traffic and not a trend — the previous reading
  was taken at 09:33 UTC, a third of the way into the day. The same caution now applies to 08-12 (66),
  which is itself partial.
- **08-10 and 08-11 arrival counts remain censored, not merely noisy.** The zone challenged clients
  through part of that window; a request blocked at the edge never reached the Worker and was never
  counted. This is stated, not estimated, and it will be stated again when EXP-002 is graded against
  a baseline that includes those days.
- All-time content totals, which **predate** instrumentation and are not activity: 79 public items,
  **42** queued (up from 27 — the `*/30` cron is still ingesting, which is its own evidence the
  Worker never stopped), 5 feeds (1 human / 4 agent), 8 stars, 33 skips, 1 member, 0 followers,
  1 connection.
- **Gross cash collected: AUD $0.** Source: *no billing exists*. Not an estimate, not a forecast.
- **Autonomous spend: AUD $0.00 of $500.**
- **No traction is claimed.** 431 human-flagged views on a product that has never been posted
  anywhere is most likely incidental and scanner traffic the UA heuristic did not catch. It is
  evidence that the counters work, **not** evidence of demand.

## Blockers, ordered by leverage

| # | Blocker | Owner | Cost | State |
| --- | --- | --- | --- | --- |
| 0 | ~~**The deploy pipeline did not pick up `master`.**~~ **One build was dropped; the pipeline was never broken.** [`ffe54b4`](https://github.com/in-c0/tuned/commit/ffe54b4) merged 21:46 UTC and was never picked up — 72 consecutive `/api/version` probes across three runs of `verify production` over 32 minutes read the *previous* build every time. The next push, [`23b1f42`](https://github.com/in-c0/tuned/commit/23b1f42) at 22:11 UTC, **deployed in 61 seconds** and [verify production 31645872052](https://github.com/in-c0/tuned/actions/runs/31645872052) passed every step. Since `23b1f42` is a descendant of `ffe54b4`, the skipped commit's content is live regardless. **No owner action, and nothing to read in the Cloudflare dashboard** — the escalation written at 22:09 was falsified two minutes later by its own push. | — | AUD $0 | **Closed 2026-08-12 22:12 UTC**, same day it opened. Kept for the standing lesson below. |
| 1 | **No arrival is known to be human.** EXP-003 removed the mechanism explanation for 0 applications — the apply path works in production at both widths — so the denominator is the problem. The authorization half resolved 2026-08-08 13:56 UTC; what remains is the publication itself, an authentication boundary: the executor holds no Hacker News session and has no route to the host. **The incident that displaced this is closed, so it is once again the top blocker and once again a paste** — and as of 2026-08-13 Sydney it has cost the 1-week milestone its publication condition. | Owner publishes; executor measures | AUD $0 | **Open. Top blocker.** See OWNER ACTION REQUIRED. |
| 2 | **No payment path.** No payment-provider account exists, so gross cash is structurally $0 regardless of demand. | Owner — account creation | unknown | Not started. Not yet blocking: there is no demand to collect. |
| 3 | **EXP-002 is authorized and unpublished.** ~~Needs owner authorization~~ — **received 2026-08-08 13:56 UTC.** Measurement precondition met; no unfilled token; no unverified claim. The packet is now a single canonical file, [EXP-002-PACKET.md](EXP-002-PACKET.md), rather than a comment to scroll for. | Owner publishes | AUD $0 | **Merged into blocker #1** — same paste, same success check. Kept here only so the authorization is on the record as resolved. |
| 4 | **Executor has no direct egress to `justtuned.com`** — 403 CONNECT at the proxy, **27 consecutive runs**, re-tested this run. Run 28 confirmed the denial is upstream gateway policy, not local misconfiguration: `/__agentproxy/status` reports `connect_rejected`, *"gateway answered 403 to CONNECT"*, for `justtuned.com:443`. Nothing to fix on our side. Mitigated, not fixed: GitHub Actions is the production read path and demonstrably works. | Environment | — | Standing limitation, not a stop condition. |

**Standing lesson from blocker #0, kept because the next dropped build will look identical.** Workers
Builds can silently skip a single push. The signature is specific: `verify production` red on *"expected
commit never became live"* while every health probe in the same job returns 200 — the site is fine, the
*replacement* did not happen. **The first response is another push, not an owner escalation**, because
a later commit that carries the skipped one makes the skip moot and re-proves the pipeline in about a
minute. Escalate only if a second consecutive push is also not picked up; that is the reading that
distinguishes a dropped build from a broken pipeline, and it costs one commit to obtain.

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

**Owner:** publish the Show HN from [EXP-002-PACKET.md](EXP-002-PACKET.md) and paste the resulting
`item?id=…` URL into [issue #1](https://github.com/in-c0/tuned/issues/1). That is the whole action.

**Executor:** nothing further until that URL exists. On the run after it appears: start EXP-002's
48-hour clock from the publication timestamp, hold the daily snapshots, and grade on the
pre-registered bands against `55ece3c` plus the fresh baseline at `ae37b7e` — stating plainly that
the baseline window includes two days when the zone challenged non-browser clients.

Explicitly **not** a copy or positioning rewrite, **not** a CTA-reach counter, and **not** a second
distribution channel invented to fill the wait.

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
