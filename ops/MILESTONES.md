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

## 15 minutes — by 2026-08-08 08:05 UTC (18:05 Sydney)

- **Outcome:** the owner-interface change this run was directed to make is open and mechanically sound.
- **Evidence of completion:** a PR exists containing `ops/DASHBOARD.md` plus the sixteen-horizon
  correction, and CI `check` on it is green.
- **Status:** **active.**
- **Progress:** `DASHBOARD.md` written against the committed snapshot; this file corrected.
- **Blocker:** none.
- **Next action:** open the PR and read the `check` result from the job log, not the status API
  ([LESSONS.md L-05](LESSONS.md)).
- **Last evidence-linked update:** 2026-08-08 07:50 UTC — anchored at run 17's claim,
  [issue #1](https://github.com/in-c0/tuned/issues/1#issuecomment-5225194650).

## 30 minutes — by 2026-08-08 08:20 UTC (18:20 Sydney)

- **Outcome:** merged, with production proven **unchanged** — a documentation change must move nothing
  a visitor can see.
- **Evidence of completion:** merge commit on `master`; `verify-production` confirms that exact SHA is
  serving; landing page still HTTP 200 at 22,075 bytes; `/terms` and `/privacy` 200.
- **Status:** **active.**
- **Blocker:** none.
- **Next action:** merge on green, then read the `verify-production` job log for the SHA and byte count.
- **Last evidence-linked update:** 2026-08-08 07:50 UTC — anchored this run.

## 1 hour — by 2026-08-08 08:50 UTC (18:50 Sydney)

- **Outcome:** control-plane work **stops here**, and the next selected action is the conversion
  diagnosis rather than more documentation. This horizon exists to make [L-08](LESSONS.md) enforceable
  instead of merely written down.
- **Evidence of completion:** the run-17 execution report and `STATUS.md` both name the conversion
  diagnosis as the next action, and no further ops-documentation work is queued behind it. Falsified if
  the next claim in issue #1 selects another control-plane task without a reviewer directive requiring it.
- **Status:** **active.**
- **Blocker:** none. This one is a self-imposed constraint, not an external dependency.
- **Next action:** state it explicitly in the report, then stop.
- **Last evidence-linked update:** 2026-08-08 07:50 UTC — anchored this run.

## 3 hours — by 2026-08-08 10:50 UTC (20:50 Sydney)

- **Outcome:** the first half of blocker #1 is answered: **can a visitor actually reach and complete an
  application in production today?** Mechanism before message.
- **Evidence of completion:** a recorded production walk of the apply path — landing → application form
  → submit → the `application_submit` counter incrementing, or the exact step where it fails — with the
  log linked from `METRICS.md` or `DECISIONS.md`. A submission made by the loop must be labelled as a
  test in the record and must never be counted as demand.
- **Status:** **not started.**
- **Progress:** none. Named as the recommended next candidate by run 16.
- **Blocker:** executor egress to `justtuned.com` is blocked (403 CONNECT, 16 consecutive runs), so the
  walk must run inside GitHub Actions, which is the working production read path.
- **Next action:** script the walk against production and run it once; read the job log.
- **Last evidence-linked update:** 2026-08-08 — run 16 recorded 0 applications from 115 views and
  identified the ambiguity, [report](https://github.com/in-c0/tuned/issues/1#issuecomment-5225182389).

## 6 hours — by 2026-08-08 13:50 UTC (23:50 Sydney)

- **Outcome:** CTA reach is measurable, so *"saw the page"* and *"saw the call to action"* stop being
  the same number — **or** it is recorded why one additive counter is the wrong instrument.
- **Evidence of completion:** one additive counter deployed through the existing gates and verified
  live by SHA, appearing in the next snapshot; **no landing copy changed in the same step**. Changing
  the message and the measurement together makes the result unattributable.
- **Status:** **not started.**
- **Blocker:** depends on the 3-hour answer — if the apply path is broken, fixing the mechanism
  outranks measuring reach.
- **Next action:** decided by the 3-hour result.
- **Last evidence-linked update:** none yet.

## 12 hours — by 2026-08-08 19:50 UTC (2026-08-09 05:50 Sydney)

- **Outcome:** the conversion diagnosis is a **pre-registered experiment (EXP-003)** rather than an
  after-the-fact reading, with bands fixed before any data arrives.
- **Evidence of completion:** EXP-003 exists in `EXPERIMENTS.md` with hypothesis, baseline
  (0 / 115, 95% upper bound ~2.6%), the change, falsifiable success and failure bands, and the decision
  each band triggers — written and committed **before** the first reading is taken.
- **Status:** **not started.**
- **Blocker:** depends on the 3-hour and 6-hour results.
- **Next action:** write it before looking, as EXP-001 and EXP-002 were.
- **Last evidence-linked update:** none yet.

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
