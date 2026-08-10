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

### **justtuned.com is answering a Cloudflare challenge to every client. Clear it before anything else.**

**This section said "Publish the Show HN post" until run 26, and following it would have spent the one
attributable channel on a link that 403s.** STATUS was corrected in run 25; this mirror was not. That is
the failure mode the mirror rule exists to catch, and it is recorded in §8 rather than quietly fixed.

| | |
| --- | --- |
| **Severity** | **Highest.** Every path on the zone returns `403 cf-mitigated: challenge`, including a real headless Chromium on `GET /`. |
| **Blocked outcome** | Open RSS, agent fetchers and every non-browser client are refused. The public cannot use Tuned. |
| **Why owner authority** | The refusal is at the Cloudflare edge, before the Worker — a zone security setting the executor holds no credential for. |
| **Exact minimum action** | Cloudflare → `justtuned.com` → **Security → Events**, filter Ray ID `a2925e55ea742973` (or `a2924f531a38e16d`, `a29223cf1b49492d`) → read which rule fired → turn it off or scope it away from `GET /`, `/ava/*`, `/api/*`. |
| **Confirmed, so you can skip a step** | The **Worker is healthy** — run 26 read it directly on its `workers.dev` origin: `f46105d` live, landing 200, `/api/metrics` 401, `/terms` and `/privacy` 200. This is purely zone configuration; **no redeploy or rollback will help.** |
| **Success check** | [verify production](https://github.com/in-c0/tuned/actions/workflows/verify-production.yml) goes green — specifically its **Public availability** step, which is the only one still failing. |
| **Blocker age** | Onset between 2026-08-09 21:05 UTC and 2026-08-10 20:48 UTC. No product commit falls in that window. |
| **Last surfaced** | [STATUS.md](STATUS.md), the run-25 report, and one push notification at 2026-08-10 21:53 UTC. **Not re-notified in run 26** — the action is unchanged, and contract rule 6 says escalate once. |

**The Show HN paste is displaced, not cancelled.** It is written and checked in
[EXP-002-PACKET.md](EXP-002-PACKET.md) and returns to the top of this card the moment the zone serves
200. EXP-002 stays `AUTHORIZED / NOT STARTED`.

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

**Phase:** the funnel is readable, and as of run 18 the **apply path is proven to work in
production**. The constraint is no longer inside the product.

**Single active objective: obtain controlled, known-human traffic.** EXP-003 killed the mechanism
explanation for 0/115 — a real browser applied successfully at both mobile and desktop widths. What
remains is that **no arrival is known to be human**, and with an unknown denominator no conversion
figure is gradeable. **The channel is now authorized** (2026-08-08 13:56 UTC), so the binding step
moved from *decide* to *publish* — see [§1](#1-owner-action-required).

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
| 1 week | 2026-08-15 | ≥3 consecutive daily snapshots; constraint identified as conversion or distribution | **active** — the constraint is now identified as **distribution**, on run-18 evidence | owner authorization for a first channel | publish one authorized channel and measure it separately |
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
[`92ff81e`](https://github.com/in-c0/tuned/commit/92ff81e), `generated_at` 2026-08-10T22:18:30Z.
Covers **5 UTC days** (2026-08-06 → 08-10). Read through the Worker's origin because the zone would not
answer — the counters are D1 state, unaffected by the route. Full reading and caveats in
[METRICS.md](METRICS.md).

| Stage | Observed | Note |
| --- | --- | --- |
| Landing views, human-flagged | **285** (29 / 69 / 56 / 56 / 75) | UA heuristic — **not** verified human traffic |
| Landing views, bot-flagged | **103** (15 / 23 / 43 / 7 / 15) | never merged with the above |
| Feed views | **32** human-flagged, 20 bot-flagged | all five days |
| **Applications submitted** | **0** | `application_submit` has never fired |
| Member logins · desk views | **0** · **0** | counters have never fired |
| Attention actions since instrumentation | **0** | `attention_star` / `attention_skip` never fired |
| Members ever active | **0 of 1** | `member_days` is empty |
| Return use (D1+, 2+ active days) | **0** | nothing to return from |

- **Landing → application: 0 / 285 = 0.0%.** 95% one-sided upper bound ~1.1% (was ~2.6% at n=115).
  The bound tightens; the estimate does not move. Do not treat "0%" as a measured constant.
- **08-10 is the highest day (75) and supports no conclusion.** Nothing has been published anywhere, so
  the arrivals are still most plausibly crawlers — and the zone began refusing clients partway through
  that same UTC day, so the day is **truncated**: blocked requests never reach the Worker and are never
  counted. Possibly inflated and definitely censored, in one number.
- **Gross cash collected: AUD $0.** Source: *no billing exists*. Not an estimate, not a forecast.
- **Autonomous spend: AUD $0.00 of the AUD $500 cap.** Running total in [DECISIONS.md](DECISIONS.md).
- **No traction is claimed.** 285 UA-flagged views on a product with no distribution proves **the
  counters work**, not that demand exists.
- All-time content totals **predate instrumentation and are inventory, not activity**: 79 public items,
  **42** queued (27 at the last reading — the `*/30` cron ingested straight through the outage, which is
  independent evidence the Worker never stopped), 5 feeds (1 human / 4 agent), 8 stars, 33 skips,
  1 member, 0 followers, 1 connection.
- **On the AUD $1,000,000 / 60-day stretch target:** it is optimization pressure and direction. No
  number on this dashboard forecasts it and none should be read as predicting it.

## 5. Blockers ordered by leverage

| # | Blocker | Owner | Cost | State |
| --- | --- | --- | --- | --- |
| 0 | **The Cloudflare edge challenges every client of `justtuned.com`.** `403 cf-mitigated: challenge` on `/`, `/api/version`, `/api/metrics` and `/ava/rss.xml`, across three colos (IAD, SJC, LAX), and a real Chromium refused on `GET /` at both widths. The Worker behind it is **healthy** — verified on its `workers.dev` origin in run 26 — so this is zone configuration, not code. | Owner — zone security settings | AUD $0 | **Open. Top blocker, displacing #1.** See §1. |
| 1 | **No arrival is known to be human.** EXP-003 proved the apply path works in production, so the zero is no longer explainable by a broken form — the denominator is the problem. **285** UA-flagged views on a product never posted anywhere is most likely crawler traffic. Every conversion figure is ungradeable. | Owner authorizes a channel; executor measures | AUD $0 | **Open, and now queued behind #0** — a channel cannot be spent while the destination 403s. |
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
| **Last materially updated** | 2026-08-11 08:25 Sydney (2026-08-10 22:25 UTC) |
| **Run** | 26 — no reviewer directive; self-selected work, claimed on [issue #1](https://github.com/in-c0/tuned/issues/1) before starting |
| **Repository commit at time of writing** | [`f46105d`](https://github.com/in-c0/tuned/commit/f46105d78ebf896a17eee67e1920f35aaca25c4a) |
| **Data commit** | [`92ff81e`](https://github.com/in-c0/tuned/commit/92ff81e) — `generated_at` 2026-08-10T22:18:30Z, read via the Worker origin while the zone was challenging. First successful snapshot since 2026-08-09 21:05 UTC. |
| **Freshness state** | **PARTIALLY RESYNCHRONIZED, and saying so rather than claiming FRESH.** §1, §4 and this section are current as of run 26. **§3 (milestones), §6 (experiment) and §7 (lessons) were last written at run 20 and are two runs stale** — they predate the edge-challenge incident and L-12/L-13. Read [STATUS.md](STATUS.md), [MILESTONES.md](MILESTONES.md), [EXPERIMENTS.md](EXPERIMENTS.md) and [LESSONS.md](LESSONS.md) for those. |

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
