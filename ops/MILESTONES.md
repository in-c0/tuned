# Tuned — MILESTONES

**Last updated:** 2026-08-08 (run 17 — six sub-day horizons added). Update when evidence, status,
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
Current anchor: **run 17, 2026-08-08 07:50 UTC / 17:50 Sydney**. Each window is written so the *next*
run can grade it `achieved` or `missed` against evidence that already exists by then.

These six horizons did not exist before the owner requested them at
[07:04 UTC on 2026-08-08](https://github.com/in-c0/tuned/issues/1#issuecomment-5225045057). **No grade
is assigned to any sub-day window that closed before that time.** Reconstructing targets for windows
that had none, and then marking them achieved, would be exactly the invented retrospective
accomplishment this file exists to prevent — and marking them *missed* would invent a failure just as
freely. What happened before the anchor is in [DECISIONS.md](DECISIONS.md) and issue #1, ungraded.

---

## 15 minutes — by 2026-08-08 09:45 UTC (19:45 Sydney)

*Run-17 rungs, graded by run 18 rather than by the run that set them: the 15-minute rung (PR open,
CI green) and the 30-minute rung (merged, production verified unchanged at 22,075 bytes) both
**achieved** — [PR #14](https://github.com/in-c0/tuned/pull/14), [run 31247233604](https://github.com/in-c0/tuned/actions/runs/31247233604).
The run-17 1-hour rung — "the next selected action is the conversion diagnosis, not more
documentation" — is **achieved**: this run shipped the diagnosis and touched documentation only to
record its result.*

- **Outcome:** EXP-003 is pre-registered **and committed** before any production reading exists.
- **Evidence of completion:** the pre-registration is in `ops/EXPERIMENTS.md` on `master`, with a
  commit timestamp earlier than the first EXP-003 workflow run.
- **Status:** **achieved** at 09:38 UTC, 7 minutes inside the window.
- **Progress:** merged as [`b62bf08`](https://github.com/in-c0/tuned/commit/b62bf083cbdeeb74ab6e81b134a5473d2cd7fc3b);
  first reading dispatched afterwards as [run 31251017621](https://github.com/in-c0/tuned/actions/runs/31251017621).
- **Blocker:** cleared.
- **Next action:** —
- **Last evidence-linked update:** 2026-08-08 09:38 UTC.

## 30 minutes — by 2026-08-08 10:00 UTC (20:00 Sydney)

- **Outcome:** a real browser has answered *can a visitor actually apply?* against live production, at
  both mobile and desktop widths, without creating an application.
- **Evidence of completion:** an Actions run driving Chromium at `https://justtuned.com` that records
  the submit's URL and JSON payload, at 390×844 and 1440×900, with screenshots attached and
  `submitReachedServer false`.
- **Status:** **achieved** at 09:47 UTC.
- **Progress:** [run 31251303499](https://github.com/in-c0/tuned/actions/runs/31251303499) — all six
  criteria hold. **A visitor who arrives can apply.**
- **Blocker:** cleared.
- **Next action:** —
- **Last evidence-linked update:** 2026-08-08 09:47 UTC.

## 1 hour — by 2026-08-08 10:30 UTC (20:30 Sydney)

- **Outcome:** any defect the mechanism test exposes is either fixed and verified live, or recorded as
  deliberately unfixed with the reason.
- **Evidence of completion:** for each defect, a merged commit plus a production verification at that
  SHA — or a written decision not to fix it.
- **Status:** **achieved** at 09:47 UTC.
- **Progress:** one defect found (arXiv's root-relative `og:image` 404ing on our own origin), fixed in
  [`5ef6970`](https://github.com/in-c0/tuned/commit/5ef6970b50487cace86fb4fbdbac8d7a33e2afba), verified
  live by [run 31251251027](https://github.com/in-c0/tuned/actions/runs/31251251027), and confirmed gone
  by re-running the test. The remaining console error is a third-party favicon 404 — recorded, not
  fixed, because it cannot affect the apply path.
- **Blocker:** cleared.
- **Next action:** —
- **Last evidence-linked update:** 2026-08-08 09:47 UTC.

## 3 hours — by 2026-08-08 12:30 UTC (22:30 Sydney)

- **Outcome:** the loop does **not** answer a proven-working mechanism by rewriting the message. This
  rung exists to bind the next run, and it is the one most likely to be broken in good faith.
- **Evidence of completion:** the next claim in issue #1 selects neither a copy/positioning change nor
  another counter. **Falsified** if it selects either without a reviewer directive requiring it.
- **Status:** **active.**
- **Blocker:** needs a subsequent run to grade; run 18 cannot mark its own rung.
- **Next action:** hold the line in the run-19 claim.
- **Last evidence-linked update:** 2026-08-08 09:58 UTC — set this run.

## 6 hours — by 2026-08-08 15:30 UTC (2026-08-09 01:30 Sydney)

- **Outcome:** the owner has one explicit decision in front of them — authorize a first channel, or say
  what to do instead — stated once, with the evidence that makes it the binding step.
- **Evidence of completion:** the run-18 execution report states it, and `STATUS.md` carries it as
  blocker #1. Per contract rule 6, it is **not** restated in later runs until the state changes.
- **Status:** **active** — stated; awaiting the owner.
- **Blocker:** it is 19:30 Sydney; the owner is reasonably asleep. Nothing executor-side unblocks this.
- **Next action:** none. Do not re-ask.
- **Last evidence-linked update:** 2026-08-08 09:58 UTC.

## 12 hours — by 2026-08-08 21:30 UTC (2026-08-09 07:30 Sydney)

- **Outcome:** at least one arrival at justtuned.com is **known** to be human — or there is a recorded
  reason why none can be, which is itself the finding.
- **Evidence of completion:** a landing view attributable to a specific authorized channel, separable
  in the counters from background traffic, in a committed snapshot.
- **Status:** **not started.**
- **Blocker:** owner authorization for a first channel. This is the real one — no amount of executor
  work substitutes for it.
- **Next action:** none available to the executor.
- **Last evidence-linked update:** 2026-08-08 09:58 UTC.

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
- **Status:** **active** — unblocked, and **half the outcome is already answered.**
- **Progress:** EXP-001 graded **PASSED** and closed (run 16). One snapshot committed, covering 3 UTC
  days; ≥3 *consecutive daily* snapshots still need the 20:40 UTC schedule to run twice more. The
  constraint question is answered in a direction neither branch of EXP-001 predicted: **not
  distribution volume and not broken instrumentation, but conversion** — 0 applications from 115
  human-flagged views (0.0%, 95% upper bound ~2.6%). EXP-002 packet remains pre-registered, unpublished.
- **Blocker:** owner authorization to publish EXP-002 — and, deliberately, the 0% conversion itself:
  posting the one attributable channel into a funnel nobody applies through would spend it for an
  uninterpretable result (EXPERIMENTS.md, EXP-002 status revision).
- **Next action:** diagnose why arrival → application is 0% before adding traffic to it.
- **Last evidence-linked update:** 2026-08-08 — EXP-001 passed and closed on run
  [31246496587](https://github.com/in-c0/tuned/actions/runs/31246496587).

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
