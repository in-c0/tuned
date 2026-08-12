# Tuned — MILESTONES

**Last updated:** 2026-08-13 Sydney / 2026-08-12 UTC (run 31 — the 1-week horizon's **second condition is graded MISSED** at its precommitted 2026-08-13 cutoff; the six sub-day windows below remain **stale, anchored at run 20, and deliberately left ungraded** rather than back-filled). Update when evidence, status,
timing or strategy changes — not every run. Current state lives in [STATUS.md](STATUS.md); the owner's
one-screen view is [DASHBOARD.md](DASHBOARD.md); reasoning lives in [DECISIONS.md](DECISIONS.md) and
[EXPERIMENTS.md](EXPERIMENTS.md).

**Reference dates.** Loop started 2026-08-06. Final autonomous operating date **2026-10-05**; after it
the executor makes no changes and posts a closeout report. Horizons beyond that date are the owner's
to carry, and are directional rather than executor commitments.

**On the AUD $1,000,000 / 60-day stretch target.** It is optimization pressure and direction. **No
horizon below forecasts it, and none should be read as predicting it.** Every near-term milestone is
written so it can be *failed* on evidence. Status vocabulary:
`not started / active / blocked / achieved / missed / revised`.

**On the six sub-day horizons.** They are a **rolling execution ladder, re-anchored at the start of
each run** — a 15-minute milestone fixed to a date three days ago would be noise, not a commitment.
Current anchor: **run 20, 2026-08-08 14:00 UTC / 2026-08-09 00:00 Sydney**. Each window is written so the *next*
run can grade it `achieved` or `missed` against evidence that already exists by then.

These six horizons did not exist before the owner requested them at
[07:04 UTC on 2026-08-08](https://github.com/in-c0/tuned/issues/1#issuecomment-5225045057). **No grade
is assigned to any sub-day window that closed before that time.** Reconstructing targets for windows
that had none, and then marking them achieved, would be exactly the invented retrospective
accomplishment this file exists to prevent — and marking them *missed* would invent a failure just as
freely. What happened before the anchor is in [DECISIONS.md](DECISIONS.md) and issue #1, ungraded.

---

## 15 minutes — by 2026-08-08 14:15 UTC (2026-08-09 00:15 Sydney)

*Run-17/18 rungs, graded before they are replaced. The 3-hour rung — "the loop does not answer a
proven-working mechanism by rewriting the message" — is **achieved**: run 19 chose packet verification
and run 20 chose the authentication boundary; neither touched copy, positioning or a counter. The
6-hour rung — "the owner has one explicit decision in front of them, stated once" — is **achieved and
answered**: the decision was stated once and not re-argued, and the owner authorized publication at
[13:56 UTC](https://github.com/in-c0/tuned/issues/1#issuecomment-5226414917). The 12-hour rung — "at
least one arrival is known to be human" — is **missed**, honestly: nothing has been published, so no
arrival is attributable. It is re-set below rather than quietly extended.*

- **Outcome:** the owner action is surfaced where the owner-interface rule says it must be, and the
  post is a single canonical file rather than a comment to scroll for.
- **Evidence of completion:** `STATUS.md` and `DASHBOARD.md` open with the publish action carrying all
  seven required fields, `ops/EXP-002-PACKET.md` exists with the approved text byte-identical, and a PR
  is open with CI green.
- **Status:** **active** — set this run.
- **Blocker:** none.
- **Next action:** open the PR.
- **Last evidence-linked update:** 2026-08-08 14:15 UTC.

## 30 minutes — by 2026-08-08 14:30 UTC (2026-08-09 00:30 Sydney)

- **Outcome:** that change is merged and production is verified **unchanged** — an ops-only commit must
  not move a byte of the site hours before a channel points at it.
- **Evidence of completion:** `verify-production` passes at the merged SHA with the landing page the
  same size as at `c6def8d` (21,974 bytes).
- **Status:** **active.**
- **Blocker:** none.
- **Next action:** merge, then read the verification job log rather than the status API ([L-05](LESSONS.md)).
- **Last evidence-linked update:** 2026-08-08 14:15 UTC.

## 1 hour — by 2026-08-08 15:00 UTC (2026-08-09 01:00 Sydney)

- **Outcome:** the run ends with EXP-002 recorded **NOT STARTED**, no clock running, and no
  publication claimed — the boundary reported rather than worked around.
- **Evidence of completion:** the run-20 execution report states the boundary; `EXPERIMENTS.md`,
  `STATUS.md` and `DASHBOARD.md` all say NOT STARTED. **Falsified** if any file or comment describes
  EXP-002 as started, or reports a window, without a `news.ycombinator.com/item?id=…` URL.
- **Status:** **active.**
- **Blocker:** none.
- **Next action:** post the report and stop.
- **Last evidence-linked update:** 2026-08-08 14:15 UTC.

## 3 hours — by 2026-08-08 17:00 UTC (2026-08-09 03:00 Sydney)

- **Outcome:** the loop waits well. Waiting on an owner paste is the exact condition under which
  [L-08](LESSONS.md) predicts invented work, and the packet is finished, so there is nothing honest
  left to polish.
- **Evidence of completion:** the next claim in issue #1 selects a stand-down or measurement-only work.
  **Falsified** by a copy/positioning change, a new counter, a second channel, outreach, or any edit to
  the approved packet text.
- **Status:** **active** — this rung binds the next run, which cannot grade itself.
- **Blocker:** none.
- **Next action:** none.
- **Last evidence-linked update:** 2026-08-08 14:15 UTC.

## 6 hours — by 2026-08-08 20:00 UTC (2026-08-09 06:00 Sydney)

- **Outcome:** the distinction between *authorized* and *published* survives contact with an impatient
  loop, through the whole window in which the owner is asleep.
- **Evidence of completion:** EXP-002 is still `NOT STARTED` everywhere, no 48-hour window is described
  as open, and no private channel (phone, email, SMS) has been used to chase the paste.
- **Status:** **active.**
- **Blocker:** none — this is a discipline rung, not a capability one.
- **Next action:** none.
- **Last evidence-linked update:** 2026-08-08 14:15 UTC.

## 12 hours — by 2026-08-09 02:00 UTC (12:00 Sydney)

- **Outcome:** the pre-publication baseline in force at publication time is fresh, so the time-window
  contrast EXP-002 is graded on has a clean zero immediately behind it.
- **Evidence of completion:** the scheduled 20:40 UTC `metrics-snapshot` commits a new dated file under
  `ops/metrics/`, aggregate-only, with `application_submit` still 0.
- **Status:** **not started** — it runs unattended.
- **Blocker:** none. No dispatch is needed and none was made.
- **Next action:** read it next run; if `application_submit` is non-zero **before** any publication,
  that is a finding about the existing traffic, not about EXP-002.
- **Last evidence-linked update:** 2026-08-08 14:15 UTC.

## 1 day — by 2026-08-09

*This horizon predates the sub-day ladder and keeps its original anchor. It is already **achieved**, so
the ladder above feeds the 1-week horizon rather than this one.*

- **Outcome:** the funnel is readable. One authenticated metrics snapshot succeeds.
- **Evidence of completion:** a `metrics-snapshot` run exits green with authenticated HTTP 200 **and**
  `ops/metrics/latest.json` exists at `master` containing aggregate counts.
- **Status:** **achieved** 2026-08-08, a day inside the window.
- **Progress:** complete. Telemetry deployed (`feb6c4f`), proven by 23 tests; key comparison hardened
  (`68cd28d`); owner synchronized the two secrets; one dispatch from current `master` returned 200.
- **Blocker:** none — cleared.
- **Next action:** none for this horizon. The reading itself sets the next one: **0 applications from
  115 human-flagged landing views**, so the constraint is arrival → application (STATUS.md #1).
- **Last evidence-linked update:** 2026-08-08 — snapshot run
  [31246496587](https://github.com/in-c0/tuned/actions/runs/31246496587) authenticated **HTTP 200** and
  committed `ops/metrics/latest.json` at
  [`a00a8fe`](https://github.com/in-c0/tuned/commit/a00a8fe0da9989cee53ec5800fa0a0f01229fdf9).

## 1 week — by 2026-08-15

- **Outcome:** the first honest funnel numbers exist, and the loop knows whether its constraint is
  **conversion** or **distribution**. EXP-002 published if authorized.
- **Evidence of completion:** ≥3 consecutive daily snapshots in `ops/metrics/`; EXP-001 graded in
  EXPERIMENTS.md against its written threshold (non-zero `landing_view` or `landing_view_bot` on ≥1
  day within 48h of a readable key); if EXP-002 ran, it is graded on its pre-registered bands.
- **Status:** **split, and now half-graded: condition 1 MET, condition 2 MISSED.** The window itself
  stays open until 2026-08-15 and its thresholds are unchanged — what closed on 2026-08-13 is the
  publication precommitment recorded under *Risk to the window* below, which was written in advance
  precisely so this grade would not be negotiated after the fact.
- **Progress:**
  - **Snapshot condition: MET.** Five daily snapshots now exist in `ops/metrics/` — `2026-08-08`,
    `2026-08-09`, `2026-08-10`, `2026-08-11`, `2026-08-12` — clearing the "≥3 consecutive" bar with
    room to spare. The 08-11 snapshot
    ([`ae37b7e`](https://github.com/in-c0/tuned/commit/ae37b7e)) was the first since the incident read
    through the **public zone** rather than the Worker origin; `2026-08-12`
    ([`567dad0`](https://github.com/in-c0/tuned/commit/567dad0), `generated_at` 2026-08-12T21:24:27Z)
    is the current one.
  - **Publication condition: MISSED, graded 2026-08-13 Sydney.** No canonical
    `news.ycombinator.com/item?id=…` URL exists in [issue #1](https://github.com/in-c0/tuned/issues/1),
    so EXP-002 was never published, its 48-hour clock never started, and it cannot be graded on its
    pre-registered bands inside this horizon. **EXP-002 stays `AUTHORIZED / NOT STARTED` and its bands
    are untouched** — a missed milestone is not a failed experiment, and nothing here converts one into
    the other.
  - **EXP-001: PASSED and closed** (run 16).
  - **Constraint question: answered, in a direction neither branch of EXP-001 predicted** — not
    distribution volume and not broken instrumentation, but **conversion**: 0 applications from 431
    human-flagged views (0.0%, 95% one-sided upper bound ~0.7%). The denominator is UA-heuristic
    traffic, so the ratio remains ungradeable as a conversion rate; that is the whole reason the
    publication condition mattered.
  - **EXP-002: still pre-registered and unpublished.** This is the half that is not met.
  - **Cost of the incident, recorded rather than smoothed over:** 2026-08-10 and 08-11 arrival counts
    are censored — challenged requests never reached the Worker and were never counted.
- **Blocker:** **publication.** Owner authorization arrived 2026-08-08 13:56 UTC; the run-18 objection
  (do not post into a possibly-broken funnel) was retired by EXP-003; and the Bot Fight Mode objection
  (do not point HN at a zone that challenges RSS readers) was retired **2026-08-11** when the toggle
  came off. All three objections are now spent. What is left is a paste into a Hacker News session the
  executor does not hold.
- **Risk to the window: REALIZED 2026-08-13.** The precommitment read: *if the paste does not happen by
  **2026-08-13**, EXP-002's 48-hour clock cannot close inside this horizon and the milestone will be
  graded **missed on its second condition** — stated in advance so the grade is not negotiated
  afterwards.* The paste did not happen. The grade is applied as written: **missed on condition 2**,
  with the deadline, the thresholds and EXP-002's bands all left exactly where they were. Even a
  publication today could not close a 48-hour clock and be graded before 2026-08-15.
- **Next action:** unchanged, and unchanged deliberately — owner publishes from
  [EXP-002-PACKET.md](EXP-002-PACKET.md). The missed grade removes nothing from the packet's value: it
  records that a week passed without known-human traffic, not that the channel was tried and failed.
  When the URL appears, the executor starts the 48-hour clock from the publication timestamp and grades
  EXP-002 on its pre-registered bands against the `55ece3c` baseline plus `ae37b7e`.
- **Last evidence-linked update:** 2026-08-12 UTC / 2026-08-13 Sydney — condition 1 re-confirmed and
  condition 2 graded missed against snapshot
  [`567dad0`](https://github.com/in-c0/tuned/commit/567dad0); production verified green on
  [run 31640663090](https://github.com/in-c0/tuned/actions/runs/31640663090) at 21:03 UTC.

## 2 weeks — by 2026-08-22

- **Outcome:** a real payment path exists and the first genuine willingness-to-pay evidence is on the
  record — or the wedge audience is falsified and the loop turns.
- **Evidence of completion:** a payment provider account exists and a checkout that can accept a live
  AUD charge is deployed behind the existing gates; **and** either ≥1 completed payment or ≥3 distinct
  people who named a price/budget (per EXP-002's WTP definition).
- **Status:** **not started.**
- **Progress:** pricing frame drafted in NORTH_STAR.md (Free / Pro ~$17/mo / Team / creators). No
  billing code, no provider, no checkout. Gross cash AUD $0, source: no billing exists.
- **Blocker:** payment-provider account creation is an owner/auth boundary; also gated on knowing the
  funnel is non-empty, since shipping billing into zero traffic is polish.
- **Next action:** once a baseline exists, request the provider account in issue #1 with the smallest
  reviewable integration scoped in advance.
- **Last evidence-linked update:** 2026-08-06 — run-1 audit recorded "payment: does not exist".

## 1 month — by 2026-09-08

- **Outcome:** first gross cash collected, and activation is measured rather than assumed — an owner
  reaches a morning desk and stars/skips real finds, repeatedly.
- **Evidence of completion:** payment-provider records show gross cash > AUD $0 (that source only);
  **and** `retention.members_returned_after_first_day` ≥ 1 with `attention_star`/`attention_skip`
  non-zero across ≥2 distinct UTC days, from committed snapshots.
- **Status:** **not started.**
- **Progress:** retention became *computable* at `feb6c4f` (`member_days` replaced the overwritten
  `members.last_desk_at`). Nothing observed yet.
- **Blocker:** all of the above, in order.
- **Next action:** decided by the first baseline — conversion work if traffic exists, distribution if
  it does not.
- **Last evidence-linked update:** 2026-08-06 — retention made measurable at the schema level (run 2).

## 3 months — by 2026-11-08

- **Outcome:** a small **retained paying cohort** — evidence that the single-player wedge (the daily
  desk for delegated attention) holds attention week after week without prompting, and that people renew.
- **Evidence of completion:** ≥1 renewal or second billing period collected; and a cohort whose
  week-4 return rate is reported from `member_days`, whatever it says.
- **Status:** **not started.** *Note: this horizon extends past the 2026-10-05 autonomous operating
  date — the executor will have closed out; this is the owner's to carry.*
- **Blocker:** everything above.
- **Next action:** at closeout, hand over an honest cohort table rather than a summary.
- **Last evidence-linked update:** none yet — no cohort exists.

## 6 months — by 2027-02-08

- **Outcome (directional):** multiplayer begins to earn its place — following a person's curated
  attention, or one of their agents, produces measurably more retained attention than the solo desk.
- **Evidence:** a follow relationship exists in production and followed feeds show higher star rates
  than self-only feeds, sourced from instrumentation, not impression.
- **Status:** **not started.** Sequencing is explicit in NORTH_STAR.md: single-player wedge first,
  multiplayer second — no social cold-start dependency before the wedge is proven.

## 1 year — by 2027-08-08

- **Outcome (directional):** the provenance layer is the reason people stay. "Observed by agent /
  selected by agent / opened / starred / shared by human" is legible in every surface, and agent
  creators have identity and distribution.
- **Evidence:** creators with public agent remits that others clone; provenance states never blurred
  in any shipped view.
- **Status:** **not started.**

## 3 years — by 2029-08

- **Outcome (directional):** Tuned is the public attention network between machine-scale perception
  and human-scale attention — following an agent's attention is as ordinary as following a person's.
- **Evidence:** sustained multi-party feeds and cross-agent convergence in normal use.
- **Status:** **not started.**

## 5 years — by 2031-08

- **Outcome (directional):** attention provenance is infrastructure — agents publish what they looked
  at and why, humans follow the few things worth their attention, and the attribution is verifiable
  rather than claimed.
- **Evidence:** external systems consuming Tuned's provenance; the doctrine survives scale.
- **Status:** **not started.**

## Indefinite — vision and direction

Humans contribute **attention, not content**. As machines read more than any person ever can, the
scarce and human thing is judgment about what deserves a look — and the durable product is the
**explicit provenance** of that judgment, human and agent alike, never blurred, never fabricated.
Tuned exists to make attention followable. It does not become a summarizer, a content generator, or
an enterprise observability dashboard, no matter how much easier those would be to sell.
