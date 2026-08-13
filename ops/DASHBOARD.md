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

### **Ask Hacker News moderation to review the dead item. One email, and do not repost.**

**You did the paste this morning and it published nothing.** Item
[`49280269`](https://news.ycombinator.com/item?id=49280269), submitted **10:13:23 Sydney**, came back
**`dead: true`** — killed at submission, no title, no url, no comments on its record. Verified from
GitHub's network in [run 31654090210](https://github.com/in-c0/tuned/actions/runs/31654090210), not
taken on report. Not a Tuned fault and not a mistake you made.

| | |
| --- | --- |
| **Severity** | **Top blocker, and still the only one.** **0 applications** against **431** human-flagged landing views over 7 days. The channel meant to change that reached nobody. |
| **The blocked outcome** | EXP-002 is `AUTHORIZED / NOT STARTED`. **No 48-hour clock started**, no window is open, nothing today is attributable to it, and **no grade was assigned** — a submission nobody could see tests nothing. |
| **Why owner authority** | Contacting moderation is private outbound correspondence in your name — a standing stop condition. The executor also has no session and no route to the host. |
| **Exact minimum action** | Email **`hn@ycombinator.com`** about item `49280269`: submitted once, own project, no votes solicited, came back dead — ask whether a filter caught it and whether anything should be fixed. Full suggested wording in [STATUS.md](STATUS.md). Then paste their reply into [issue #1](https://github.com/in-c0/tuned/issues/1). |
| **Do not** | Repost, resubmit reworded, use a second account or an alternate link, or solicit votes. That converts a recoverable filter into a durable one. |
| **Success check** | **Executable, not a receipt.** Dispatch [`hn-item-status.yml`](../.github/workflows/hn-item-status.yml) with item `49280269`. **Green = restored** (`dead: false`, titled, `url` still points at `justtuned.com`). The executor runs it each cycle; you do not have to. |
| **Blocker age** | Authorized **2026-08-08 13:56 UTC**; attempted **2026-08-13 00:13 UTC**; still unpublished. Already cost the 1-week milestone its publication condition. |
| **Last surfaced** | Run 33 report and a push notification. The previous card — *publish the Show HN* — is retired: its action was performed. |

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
figure is gradeable. **The channel was authorized** (2026-08-08 13:56 UTC) **and published on
2026-08-13 — and Hacker News killed the submission at submission.** The objective is unchanged and so
is the blocker; only the shape of the remaining step moved, from *publish* to *ask moderation to
review* — see [§1](#1-owner-action-required).

**Explicitly not doing** (full list in [STATUS.md](STATUS.md)): no pricing/positioning/copy work
while the denominator is unknown; no CTA-reach counter yet — right instrument, wrong traffic; no
EXP-002 publication **by the executor**, which holds no HN session; **no repost, no second account,
no reworded resubmission, no alternate link and no contact with moderation by the executor**; no
second channel and no thread seeding; no secret read, hash, rotation or exposure, ever; no
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
| 1 week | 2026-08-15 | ≥3 consecutive daily snapshots; constraint identified as conversion or distribution; EXP-002 graded if it ran | **condition 1 MET** (5 snapshots) · **condition 2 MISSED**, graded 2026-08-13 Sydney per the 2026-08-11 precommitment. The paste happened hours later and was **killed at submission**, which does not disturb the grade: the condition was a graded experiment, and *"if it ran"* was never satisfied | HN moderation review (owner) | email `hn@ycombinator.com` about item `49280269`; the grade is recorded, not renegotiated |
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
| 1 | **No arrival is known to be human.** EXP-003 proved the apply path works in production, so the zero is not explainable by a broken form — the denominator is the problem. **431** UA-flagged views on a product never posted anywhere is most likely crawler traffic. **The channel meant to fix this was submitted 2026-08-13 and killed at submission** (`dead: true`, item 49280269), so the blocker did not move: what was missing was exposure, and there still is none. | Owner requests moderation review; executor measures | AUD $0 | **Open. Top blocker.** See §1. |
| 2 | **No payment path.** No provider account exists, so gross cash is structurally $0 regardless of demand. | Owner — account creation | unknown | Not started; **not yet blocking** — no demand to collect. |
| 3 | **EXP-002 authored, authorized, submitted — and killed at submission.** Authorization arrived 2026-08-08 13:56 UTC; the packet is complete and its public claims verified by EXP-004; the owner submitted it 2026-08-13 00:13 UTC and Hacker News marked the item `dead`. Nothing about the packet has been tested, because nobody saw it. | Owner emails `hn@ycombinator.com`; executor checks restoration by dispatch | AUD $0 | **Merged into blocker #1** — same channel, new success check. Kept so the sequence authorize → publish → killed stays on the record. |
| 4 | **Executor has no direct egress** — 403 CONNECT at the proxy, **29** consecutive runs, re-tested this run and now confirmed for `hacker-news.firebaseio.com` as well as `justtuned.com` and `*.workers.dev`. Every production and third-party reading in this loop comes from GitHub Actions. | Environment | — | Mitigated, not fixed: Actions is the read path and it works. Standing limitation, not a stop condition. |

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
- **EXP-002 — Show HN distribution smoke test: AUTHORIZED, NOT STARTED — attempted and killed.**
  Pre-registered; packet canonical and checked in [EXP-002-PACKET.md](EXP-002-PACKET.md). Authorized
  [13:56 UTC](https://github.com/in-c0/tuned/issues/1#issuecomment-5226414917), submitted
  **2026-08-13 00:13:23 UTC**, and item `49280269` is **`dead: true`** —
  [run 31654090210](https://github.com/in-c0/tuned/actions/runs/31654090210). **No t0, no window, no
  snapshot, no inference, no grade.** If moderation restores it, the experiment starts **at the
  restoration timestamp**, not at submission time. All bands unchanged.

Details and grading rules: [EXPERIMENTS.md](EXPERIMENTS.md).

## 7. Latest three lessons

From [LESSONS.md](LESSONS.md), newest first. Each entry there carries the full problem → attempt →
mistake → why → evidence → lesson → next attempt → prevention check.

| # | Lesson | More elegant next attempt |
| --- | --- | --- |
| **L-16** | **A URL proves a form was submitted, not that anything was published.** The owner action's success check was *"a canonical `item?id=…` URL appears in issue #1"*. It did — and the item was `dead: true`. Had nobody looked closely, this loop would have started a 48-hour clock over an empty page and written *"Show HN produced no arrivals"* into durable state as a finding about Tuned's positioning. | Write success checks against the observable outcome, never the receipt — and make them executable. If the executor cannot run and grade the check, it is an attestation and should be labelled one. |
| **L-15** | **`git fetch` does not move the branch you are standing on, and a stale base invents findings.** Run 30 branched from a five-day-old local `master` and `npm audit` reported a *production* `hono` advisory that real master never had. What caught it was an impossibility — a lockfile disagreeing with its own install — not vigilance about git. | Verify the base, not the fetch: `git rev-parse master origin/master` must agree, or branch from `origin/master`. Treat any impossibility in tooling output as evidence about your environment first. |
| **L-14** | **A defence that filters by "is this a bot" filters out whatever your product is made of.** Bot Fight Mode challenged every non-browser client for ~22 hours, and Tuned's RSS and agent surfaces *are* non-browser clients. The product's own traffic looked exactly like the thing being blocked. | Before enabling a generic bot defence, enumerate the first-party non-browser clients the product ships, and exempt their paths explicitly rather than discovering them through an outage. |

Older lessons, including L-08's control-plane warning and L-10's contamination rule, remain in
[LESSONS.md](LESSONS.md). L-08's forward test — *does the next run spend its cycle on demand evidence
rather than more control plane?* — is the one this run had to answer carefully: the instrument it
built exists to grade an owner action it cannot perform, and it is deliberately the smallest thing
that turns an attestation into a check.

## 8. Last materially updated and freshness

| | |
| --- | --- |
| **Last materially updated** | 2026-08-13 10:50 Sydney (00:50 UTC) |
| **Run** | 33 — the Show HN was submitted and killed at submission; record the failed attempt, replace the owner action with a moderation review, and give its success check an executable form |
| **Repository commit at time of writing** | [`bbb9a4d`](https://github.com/in-c0/tuned/commit/bbb9a4d) |
| **Data commit** | [`567dad0`](https://github.com/in-c0/tuned/commit/567dad0) — `generated_at` 2026-08-12T21:24:27Z, read through the public zone, covering 7 UTC days with 08-12 partial. **Unchanged this run: no new snapshot was taken and no metric moved.** |
| **Freshness state** | **PARTIALLY RESYNCHRONIZED, and saying so rather than claiming FRESH.** §1, §3's 1-week row, §5, §6 and §7 are current as of run 33; §4 and this section are current as of the 08-12 snapshot. **§2 (phase) and the rest of §3 were last written at run 20** and are stale. Read [STATUS.md](STATUS.md) and [MILESTONES.md](MILESTONES.md) for those. |

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
