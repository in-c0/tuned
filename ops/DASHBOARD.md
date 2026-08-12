# Tuned — OWNER DASHBOARD

**Public repository, no Tuned route.** This file lives in `in-c0/tuned`, which the owner **made public
on 2026-08-09**, and is served on no Tuned route. It said "Private" until run 26; that was written when
the repository was private and was simply never revisited. Write nothing here you would not publish.

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

### **Publish the Show HN. It is one paste, from [EXP-002-PACKET.md](EXP-002-PACKET.md).**

**Bot Fight Mode is off — the incident is closed.** Verified twice from GitHub's network, 4½ hours
apart, from two Cloudflare colos, by both a plain `curl` and the named first-party contract.
`/ava/rss.xml` answers 200 to a non-browser client again. The paste returns to the top of this card
exactly as run 28 promised it would.

| | |
| --- | --- |
| **Severity** | **Top blocker, and now the only one — and it has now cost a milestone.** **0 applications** against **431** human-flagged landing views over 7 days. Nothing downstream is gradeable until some known-human traffic arrives, and the 1-week horizon is graded **missed on its publication condition** as of 2026-08-13 Sydney. |
| **The blocked outcome** | EXP-002 is `AUTHORIZED / NOT STARTED`. Its 48-hour clock has never started and will not start until a canonical `news.ycombinator.com/item?id=…` URL exists. Authorization is not publication. |
| **Why owner authority** | The executor holds no Hacker News session. Posting in your name would be impersonation — a standing stop condition, not a capability gap. |
| **Exact minimum action** | Paste the title, URL and first comment from [EXP-002-PACKET.md](EXP-002-PACKET.md) into Show HN as written, then paste the resulting `item?id=…` URL into [issue #1](https://github.com/in-c0/tuned/issues/1). |
| **Why it is safe to paste now** | The packet's public claims were checked against live production by EXP-004. The one claim the incident put at risk — *"every feed has open RSS"* — is the exact thing re-verified green this run. |
| **Success check** | A canonical HN item URL in issue #1. It starts the 48-hour clock; the executor grades on the pre-registered bands. |
| **Blocker age** | Authorized **2026-08-08 13:56 UTC**; unpublished **4 days and 8 hours**, two of them consumed by the incident. |
| **Last surfaced** | Run 25 report; displaced but never withdrawn in runs 25–28; carried unchanged through runs 29–31. |

**Bot Fight Mode: closed 2026-08-11, and now retired from this card** as promised — the full record,
including the two colo readings that settled it and the standing recommendation to use path exemptions
if bot protection ever returns, lives in [STATUS.md](STATUS.md). Production has stayed green through
the public zone since, most recently [run 31640663090](https://github.com/in-c0/tuned/actions/runs/31640663090)
on 2026-08-12 at 21:03 UTC.

**Still deliberately *not* listed:** payment-provider account creation. It becomes the blocking step
when there is paid demand to collect. There is none — see [§4](#4-funnel-revenue-and-spend). One
action at a time.

**How this section behaves:** either `NONE`, or exactly one canonical action carrying severity, the
blocked outcome, why owner authority is required, the exact minimum action, an observable success
check, blocker age, and where it was last surfaced. It is removed the moment its success check passes,
not when the executor notices. New or materially changed actions are surfaced by the scheduled reviewer
directly in ChatGPT; unchanged ones are not repeated. Private channels (phone, email, SMS) are used
only with explicit owner authorization.

## 2. Current phase and single objective

**Phase:** incident **closed** 2026-08-11 (~22 hours, 2026-08-10 06:53 → 2026-08-11 ~05:00 UTC). The
funnel is readable again through the public zone, and as of run 18 the **apply path is proven to work
in production**. The constraint is not inside the product.

**Single active objective: obtain controlled, known-human traffic.** EXP-003 killed the mechanism
explanation for 0/115 — a real browser applied successfully at both mobile and desktop widths. What
remains is that **no arrival is known to be human**, and with an unknown denominator no conversion
figure is gradeable. **The channel is authorized** (2026-08-08 13:56 UTC) and the incident that
displaced it is closed, so the binding step is once again a single paste — see
[§1](#1-owner-action-required).

**Explicitly not doing** (full list in [STATUS.md](STATUS.md)): no pricing/positioning/copy work
while the denominator is unknown; no CTA-reach counter yet — right instrument, wrong traffic; no
EXP-002 publication **by the executor**, which holds no HN session; no second channel and no thread
seeding; no secret read, hash, rotation or exposure, ever; no
spend; no generic summarizer, content generator or enterprise observability dashboard; no invented
baseline, forecast or traction claim.

## 3. Milestone horizons

All sixteen, from [MILESTONES.md](MILESTONES.md) — that file carries the full evidence conditions; this
is the index.

**Sub-day ladder anchor:** run 18, **2026-08-08 09:30 UTC / 19:30 Sydney**. It is rolling — re-anchored
at the start of each run. Run 17's rungs are graded below **by this run**, not by the one that set them. These six horizons did not exist before the owner requested them at
[07:04 UTC today](https://github.com/in-c0/tuned/issues/1#issuecomment-5225045057), so **no grade is
assigned to any sub-day window that closed before that**; inventing retrospective achievements is the
one thing this ladder must not do.

| Horizon | Target | Outcome in one line | Status | Blocker | Next action |
| --- | --- | --- | --- | --- | --- |
| 15 min | 09:45 UTC | EXP-003 pre-registered **and committed** before any production reading | **achieved** 09:38 UTC | cleared | — ([`b62bf08`](https://github.com/in-c0/tuned/commit/b62bf083cbdeeb74ab6e81b134a5473d2cd7fc3b)) |
| 30 min | 10:00 UTC | A real browser has answered *can a visitor apply?* against live production, at both widths | **achieved** 09:47 UTC | cleared | — ([run 31251303499](https://github.com/in-c0/tuned/actions/runs/31251303499)) |
| 1 hour | 10:30 UTC | Any defect the mechanism test exposes is fixed and verified live, or recorded as deliberately unfixed | **achieved** 09:47 UTC | cleared | — ([`5ef6970`](https://github.com/in-c0/tuned/commit/5ef6970b50487cace86fb4fbdbac8d7a33e2afba)) |
| 3 hours | 12:30 UTC | The next run does **not** spend its cycle on a copy rewrite or another instrument — falsified if the next claim picks either without a directive requiring it | active | needs a next run to grade | hold the line in the run-19 claim |
| 6 hours | 15:30 UTC | Owner has an explicit, single decision in front of them: authorize a first channel, or say what to do instead | active | owner is asleep — 19:30 Sydney | surfaced in the run-18 report; do not re-ask |
| 12 hours | 21:30 UTC | ≥1 arrival is **known** to be human, or a recorded reason none can be | not started | owner authorization for a first channel | nothing executor-side unblocks this |
| 1 day | 2026-08-09 | The funnel is readable — one authenticated snapshot | **achieved** 2026-08-08 | cleared | — |
| 1 week | 2026-08-15 | ≥3 consecutive daily snapshots; constraint identified as conversion or distribution; EXP-002 graded if it ran | **condition 1 MET** (5 snapshots) · **condition 2 MISSED**, graded 2026-08-13 Sydney per the 2026-08-11 precommitment — EXP-002 was never published, so no 48-hour clock can close inside the window | the paste (owner) | unchanged: publish from [EXP-002-PACKET.md](EXP-002-PACKET.md); the grade is recorded, not renegotiated |
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
[`567dad0`](https://github.com/in-c0/tuned/commit/567dad0), `generated_at` 2026-08-12T21:24:27Z.
Covers **7 UTC days** (2026-08-06 → 08-12, the last partial). **Read through the public zone.** Full
reading and caveats in [METRICS.md](METRICS.md).

| Stage | Observed | Note |
| --- | --- | --- |
| Landing views, human-flagged | **431** (29 / 69 / 56 / 56 / 84 / 71 / 66) | UA heuristic — **not** verified human traffic |
| Landing views, bot-flagged | **140** (15 / 23 / 43 / 7 / 18 / 26 / 8) | never merged with the above |
| Feed views | **62** human-flagged, **58** bot-flagged | 08-11's 32 bot-flagged feed views are the largest single day of either kind |
| **Applications submitted** | **0** | `application_submit` has never fired |
| Member logins · desk views | **0** · **0** | counters have never fired |
| Attention actions since instrumentation | **0** | `attention_star` / `attention_skip` never fired |
| Members ever active | **0 of 1** | `member_days` is empty |
| Return use (D1+, 2+ active days) | **0** | nothing to return from |

- **Landing → application: 0 / 431 = 0.0%.** 95% one-sided upper bound ~0.7% (was ~0.9% at n=333).
  The bound tightens; the estimate does not move. Do not treat "0%" as a measured constant.
- **08-11 revised upward as the day finished: 39 → 71 human-flagged, 11 → 26 bot-flagged, and feed
  views 0 → 15 human-flagged.** The previous reading was taken at 09:33 UTC, a third of the way into
  the day. Not new traffic, not a trend — the same day, finished. 08-12 (66) is partial for the same
  reason and will move too.
- **The 08-10 and 08-11 arrival counts remain censored, not merely noisy.** A challenged request never
  reached the Worker and was never counted, so the incident window is missing an unknown number of
  machine arrivals. This is stated, not estimated.
- **Gross cash collected: AUD $0.** Source: *no billing exists*. Not an estimate, not a forecast.
- **Autonomous spend: AUD $0.00 of the AUD $500 cap.** Running total in [DECISIONS.md](DECISIONS.md).
- **No traction is claimed.** 431 UA-flagged views on a product with no distribution proves **the
  counters work**, not that demand exists.
- All-time content totals **predate instrumentation and are inventory, not activity**: 79 public items,
  42 queued, 5 feeds (1 human / 4 agent), 8 stars, 33 skips, 1 member, 0 followers, 1 connection.
  Unchanged from the last reading.
- **On the AUD $1,000,000 / 60-day stretch target:** it is optimization pressure and direction. No
  number on this dashboard forecasts it and none should be read as predicting it.

## 5. Blockers ordered by leverage

| # | Blocker | Owner | Cost | State |
| --- | --- | --- | --- | --- |
| 1 | **No arrival is known to be human.** EXP-003 proved the apply path works in production, so the zero is not explainable by a broken form — the denominator is the problem. **431** UA-flagged views on a product never posted anywhere is most likely crawler traffic. Every conversion figure is ungradeable. It has now cost the 1-week milestone its publication condition. | Owner publishes; executor measures | AUD $0 | **Open. Top blocker.** See §1. |
| 2 | **No payment path.** No provider account exists, so gross cash is structurally $0 regardless of demand. | Owner — account creation | unknown | Not started; **not yet blocking** — no demand to collect. |
| 3 | **EXP-002 (first distribution test) authored but unpublished.** Measurement precondition met; the "do not publish into a possibly-broken funnel" objection **retired** by run 18; and as of run 19 the packet is **complete** — `[DEMO_FEED_URL]` = `https://justtuned.com/ava`, verified live, and its "open RSS" claim checked. | Owner authorizes; executor prepared | AUD $0 | Ready, held on **authorization alone**. Nothing left to look up. |
| 4 | **Executor has no direct egress to `justtuned.com`** (403 CONNECT at the proxy, **22** consecutive runs; `*.workers.dev` refused identically). GitHub's REST API is likewise blocked to direct `curl`. | Environment | — | Mitigated, not fixed: Actions is the production read path and it works. Standing limitation, not a stop condition. |

## 6. Current experiment

- **EXP-001 — funnel telemetry baseline: PASSED / CLOSED** (run 16). Threshold was a non-zero
  `landing_view` or `landing_view_bot` on ≥1 day; observed non-zero on **all three**. Its pre-registered
  fork (*zero views → distribution problem*) **did not fire** — the constraint sits one stage further
  down than the experiment was built to see.
- **EXP-003 — application mechanism test: PASSED / CLOSED** (run 18). Pre-registered before any
  reading; all six criteria hold on live production at 390×844 and 1440×900
  ([run 31251303499](https://github.com/in-c0/tuned/actions/runs/31251303499), screenshots attached
  as artifacts). No application created, no counter incremented. One unrelated first-party 404 found
  on the first run and fixed in [`5ef6970`](https://github.com/in-c0/tuned/commit/5ef6970b50487cace86fb4fbdbac8d7a33e2afba).
  **Its finding in one line: a visitor who arrives can apply — nobody has.**
- **EXP-004 — public no-account surfaces: PASSED / CLOSED** (run 19). Pre-registered before any
  reading. All five criteria hold on live production at both widths
  ([run 31252271974](https://github.com/in-c0/tuned/actions/runs/31252271974)): demo link → `/ava`,
  feed 200 with **24 items** and no empty state, `/ava/rss.xml` 200 `application/rss+xml` with **38**,
  no first-party errors, no horizontal overflow. GETs only; nothing written.
- **EXP-002 — Show HN distribution smoke test: AUTHORIZED, NOT STARTED.** Pre-registered;
  measurement-unblocked; packet canonical and checked in [EXP-002-PACKET.md](EXP-002-PACKET.md).
  Authorized [13:56 UTC](https://github.com/in-c0/tuned/issues/1#issuecomment-5226414917).
  **The 48h clock has not started and will not until a `news.ycombinator.com/item?id=…` URL exists** —
  authorization is not publication.

Details and grading rules: [EXPERIMENTS.md](EXPERIMENTS.md).

## 7. Latest three lessons

From [LESSONS.md](LESSONS.md), newest first. Each entry there carries the full problem → attempt →
mistake → why → evidence → lesson → next attempt → prevention check.

| # | Lesson | More elegant next attempt |
| --- | --- | --- |
| **L-10** | **An experiment that writes into its own measurement is worthless — so make that structural.** EXP-003 had to submit an application to test the application path, against the very counter whose zero is the finding. Interception + an invalid-email negative control + a headless UA kept all three funnel figures untouched. | Give every QA harness a **contamination block** in its output — what it wrote, what it incremented, how its traffic is classified — so the answer is in the log, not in someone's memory of the design. |
| **L-09** | **Two explanations that produce the same number are one unanswered question.** A broken form and an unpersuasive offer produce byte-identical funnel data. Every instrument proposed against 0/115 measured the *message* while assuming the *mechanism* away — and the mechanism turned out to be fine, at the first attempt, in ~11 seconds of browser time. | Before instrumenting a funnel stage, write the two sentences that would both explain the number. If the proposed instrument cannot separate them, it is the wrong instrument however cheap. |
| **L-08** | **Control-plane work is the easiest thing to keep choosing.** By day 3: build gate, CI, telemetry, 23 tests, version-stamped deploys, trigger guards, claim protocol — and zero distribution, no payment capability, no funnel ever read. Every step locally justified; the aggregate spent days on the machine that produces evidence rather than on evidence. | When the next-best action is control-plane work, **first name the demand experiment it unblocks** and check whether that experiment could run without it. |

L-08's test from run 17 — *does the next run spend its cycle on the conversion diagnosis instead of on
more dashboard?* — **passed.** Run 18 shipped the diagnosis, and the only documentation it touched was
the record of the result. The same test now points forward: run 19 passes only if it does **not**
reach for a copy rewrite or another counter.

## 8. Last materially updated and freshness

| | |
| --- | --- |
| **Last materially updated** | 2026-08-13 07:40 Sydney (2026-08-12 21:40 UTC) |
| **Run** | 31 — a bounded state reconciliation: consume the 08-12 snapshot, apply the precommitted 1-week grade, refresh blocker age, then return to the silent URL gate |
| **Repository commit at time of writing** | [`567dad0`](https://github.com/in-c0/tuned/commit/567dad0) |
| **Data commit** | [`567dad0`](https://github.com/in-c0/tuned/commit/567dad0) — `generated_at` 2026-08-12T21:24:27Z, read through the public zone, covering 7 UTC days with 08-12 partial. |
| **Freshness state** | **PARTIALLY RESYNCHRONIZED, and saying so rather than claiming FRESH.** §1, §4, §5 and this section are current as of run 31, and §3's 1-week row carries this run's grade. **§2 (phase), the rest of §3, §6 (experiment) and §7 (lessons) were last written at run 20** and are stale. Read [STATUS.md](STATUS.md), [MILESTONES.md](MILESTONES.md), [EXPERIMENTS.md](EXPERIMENTS.md) and [LESSONS.md](LESSONS.md) for those. |

**What went wrong with this file, recorded because the next reader deserves it.** Between runs 20 and
26 this mirror drifted while STATUS moved, and the drift was not cosmetic: §1 spent a full day telling
the owner to publish a post pointing at a URL that was returning 403, and the header claimed the
repository was private after it had been made public. A mirror that is *sometimes* current is worse
than one that is honestly labelled stale, because it is read with the same confidence either way. Hence
the freshness row above now names which sections are current **by section**, not one word for the whole
file.

**Freshness rule, so a future reader can grade this without trusting it:** this dashboard is stale
whenever `ops/metrics/latest.json` has a newer `generated_at` than the data commit above, or `STATUS.md`
has been materially updated since. Snapshots run daily at 20:40 UTC, so a dashboard more than ~24h old
is presumed stale until re-synchronized. It is updated **only on material state change** — not every
run — and it never becomes a second source of truth.
