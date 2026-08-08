# Tuned — MILESTONES

**Last updated:** 2026-08-08 (run 15). Update when evidence, status, timing or strategy changes —
not every run. Current state lives in [STATUS.md](STATUS.md); reasoning lives in
[DECISIONS.md](DECISIONS.md) and [EXPERIMENTS.md](EXPERIMENTS.md).

**Reference dates.** Loop started 2026-08-06. Final autonomous operating date **2026-10-05**; after it
the executor makes no changes and posts a closeout report. Horizons beyond that date are the owner's
to carry, and are directional rather than executor commitments.

**On the AUD $1,000,000 / 60-day stretch target.** It is optimization pressure and direction. **No
horizon below forecasts it, and none should be read as predicting it.** Every near-term milestone is
written so it can be *failed* on evidence. Status vocabulary:
`not started / active / blocked / achieved / missed / revised`.

---

## 1 day — by 2026-08-09

- **Outcome:** the funnel is readable. One authenticated metrics snapshot succeeds.
- **Evidence of completion:** a `metrics-snapshot` run exits green with authenticated HTTP 200 **and**
  `ops/metrics/latest.json` exists at `master` containing aggregate counts.
- **Status:** **blocked** — owner authentication boundary.
- **Progress:** telemetry deployed (`feb6c4f`), proven by 23 tests, endpoint live and failing closed;
  key comparison hardened (`68cd28d`). Everything except the secret values is done.
- **Blocker:** `METRICS_KEY` differs between the Worker and GitHub secret stores (STATUS.md #1).
- **Next action:** owner runs the same-source sync command; executor then dispatches exactly once.
- **Last evidence-linked update:** 2026-08-08 — snapshot run
  [31223053290](https://github.com/in-c0/tuned/actions/runs/31223053290) failed 401 after the
  whitespace fix was confirmed live.

## 1 week — by 2026-08-15

- **Outcome:** the first honest funnel numbers exist, and the loop knows whether its constraint is
  **conversion** or **distribution**. EXP-002 published if authorized.
- **Evidence of completion:** ≥3 consecutive daily snapshots in `ops/metrics/`; EXP-001 graded in
  EXPERIMENTS.md against its written threshold (non-zero `landing_view` or `landing_view_bot` on ≥1
  day within 48h of a readable key); if EXP-002 ran, it is graded on its pre-registered bands.
- **Status:** **blocked** (downstream of the 1-day milestone).
- **Progress:** EXP-002 packet — audience, exact post, CTA, grading rules — pre-registered before any
  result can be seen. Zero channels posted to date.
- **Blocker:** the 1-day milestone, plus owner authorization to publish.
- **Next action:** grade EXP-001 the day the first snapshot lands; do not publish EXP-002 into an
  unreadable funnel.
- **Last evidence-linked update:** 2026-08-07 — EXP-002 pre-registered (run 9).

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
