# Experiments log

Append-only. One entry per bounded experiment. Required fields: hypothesis, baseline, change, success threshold, result, decision. Never record a result that is not sourced from real data.

Template:

```
## EXP-NNN — short name (YYYY-MM-DD)
- Hypothesis:
- Baseline (source-linked):
- Change (commit/deploy):
- Success threshold (falsifiable):
- Result (source-linked):
- Decision: keep / roll back / iterate / abandon
```

## EXP-001 — funnel telemetry baseline (2026-08-06, run 2)

- **Hypothesis:** not a product experiment. This is the measurement prerequisite: without it, every
  later experiment's result is unfalsifiable. Logged here because the reviewer's acceptance criteria
  require it, and labelled honestly rather than dressed up as a growth test.
- **Baseline (source-linked):** no landing-view instrumentation, no login event, no durable return
  history (`members.last_desk_at` overwritten on each visit) — see the run-1 audit in METRICS.md.
- **Change:** `metric_days` + `member_days` tables, nine counters on real user actions, key-gated
  `GET /api/metrics`, and a daily GitHub Actions snapshot into `ops/metrics/`.
- **Success threshold (falsifiable):** within 48h of `METRICS_KEY` being set, `ops/metrics/latest.json`
  exists and shows a non-zero `landing_view` **or** `landing_view_bot` count for at least one day.
  If it does not, the instrumentation is broken or the site receives literally no traffic — both are
  findings, and the second one would redirect the loop from measurement to distribution.
- **Result:** PENDING — **no longer blocked on the Worker key, now blocked on the two keys matching.**
  As of 2026-08-07 20:59:07 UTC the Worker's `METRICS_KEY` is live (unauthenticated `/api/metrics`
  returns 401, not 503 — see METRICS.md). The single dispatched snapshot at 21:32:34 UTC, and the
  scheduled one at 21:18:54 UTC, both authenticated with the GitHub repository secret and were
  **rejected 401**. `ops/metrics/latest.json` was never written and does not exist. No baseline value
  of any kind has been observed, so nothing is recorded here as a number.
- **Decision:** pending.
- **Threshold disambiguated (2026-08-06, run 3):** the "either broken or no traffic" fork above is no
  longer a fork. 17 tests now exercise the counter path in workerd against a real D1, including that
  live requests to `/` and `POST /waitlist` increment their counters, and a mutation of the upsert was
  confirmed to fail them. So once `METRICS_KEY` is set, **a zero reading means genuinely no traffic** —
  a distribution finding that redirects the loop — not an unexamined instrumentation failure.


- **Clock note (2026-08-06, run 5):** the 48-hour window in the success threshold above has **not
  started**. It is measured from `METRICS_KEY` being live on the Worker, and as of 12:03 UTC the
  Worker still reports the binding absent (two dispatched snapshots, both HTTP 503; see METRICS.md).
  The experiment is not failing — it has not begun. Recorded so the window is not mistakenly counted
  from the owner's confirmation timestamp.

## EXP-002 — first distribution smoke test: Show HN to agent operators (2026-08-07, run 9)

**Pre-registered before publication. Not yet started.** The packet — audience, channel, exact post,
CTA, tagged URL — is [in issue #1](https://github.com/in-c0/tuned/issues/1) and awaits owner
authorization; the owner publishes, because public posting carries account and reputational authority
the executor does not hold. This entry exists so the thresholds and the grading rules are fixed in an
append-only file *before* any result can be seen, which is the only thing that makes them falsifiable.

- **Hypothesis:** people who already run research/coding agents daily feel the review bottleneck
  ("my agents read more than I can") acutely enough to apply to a hand-gated product on the strength
  of one honest post. If this audience will not apply, the single-player wedge in
  `BRIEF-2026-08-06.md` is wrong about *who*, and the loop should not spend more cycles on the desk.
- **Baseline (source-linked):** zero. No channel has ever been posted; `outreach/creator-shortlist.md`
  records no creator contacted. Every funnel metric is UNMEASURED — `/api/metrics` has returned 503
  `metrics key not configured` on nine consecutive observations, so there is not yet a `landing_view`
  or `application_submit` number of any kind. Gross cash AUD $0, source: no billing exists.
- **Change (commit/deploy):** **none — no product or workflow code.** This is a distribution
  experiment on an unchanged build (`bdfa636`, verified live by SHA). That is deliberate: the point is
  to learn whether anyone wants what already exists, not to test a new thing.
- **Success threshold (falsifiable), fixed by the reviewer's directive and graded once at window close:**
  - **success** — ≥10 qualified applications **or** ≥3 explicit willingness-to-pay replies in 48h;
  - **inconclusive** — 3–9 qualified applications with no paid intent;
  - **failure** — <3 qualified applications **and** zero willingness-to-pay replies.
  - *Reading fixed in advance:* the directive words the failure band as "qualified applications" and
    the inconclusive band as "applications". All three bands are graded on **qualified** applications —
    the stricter and internally consistent reading. Raw application count is reported alongside, so
    the looser reading remains checkable by anyone who prefers it.
- **Grading rules, fixed in advance so the result cannot be graded generously afterwards:**
  - A **qualified application** is a `waitlist` row whose `created_at` is inside the window, whose
    email is distinct and not a disposable domain, and where either `role` ∈ {`agent`, `both`} or the
    `note` names a specific agent/tool the applicant runs. Inside the window but failing that test =
    an application, not a qualified one.
  - A **willingness-to-pay reply** is a public thread comment or a direct reply from a distinct person
    that names a price, names a budget, or states unambiguous intent to pay. Upvotes, "cool idea", and
    "I'd try it" are **not** WTP. Public comments are quoted verbatim with a link; private email is
    summarized, never pasted — a person answering a founder's post did not consent to publication.
  - Bot-flagged landing views (`landing_view_bot`) are reported separately and never counted as reach.
- **Clock:** the 48h window starts at the moment the owner publishes, and only once `/api/metrics`
  returns 401 rather than 503 — without the key there is no `landing_view`/`application_submit` series
  and the funnel shape is unrecoverable after the fact. Exact publish time is recorded in UTC and
  Sydney, because the metrics series is bucketed by **UTC day** and a mid-day start straddles two
  buckets; day counts are therefore bounds on the in-window count, not the count itself.
- **Known measurement limit, verified in code this run, not assumed:** the campaign tag
  `?src=shn-2026-08` is **inert**. `app.get("/")` (`src/index.ts:57`) ignores query parameters,
  `POST /waitlist` (`src/index.ts:72`) persists only `email`, `role` and `note`, and the `waitlist`
  table (`schema.sql:82`) has no source column. Attribution therefore rests on time-window contrast
  against a zero baseline plus a single owner-run D1 read — which is sound only because this is the
  first and only channel ever posted. **It stops being sound at channel two**, and capturing a source
  on the application is the obvious next product change if this experiment justifies one.
- **Result (source-linked):** NOT STARTED — awaiting owner authorization to publish, and a **readable**
  metrics path.
- **Clock condition sharpened (2026-08-07, run 11) — the literal test now passes and the experiment is
  still not measurement-ready.** The clock above says the window may start "only once `/api/metrics`
  returns 401 rather than 503". Unauthenticated, it now returns 401. Read literally, that gate is met.
  **It should not be treated as met**, because the condition was written as a proxy for the thing that
  actually matters: that the `landing_view`/`application_submit` series can be *read* at window close.
  It cannot — the snapshot job is rejected 401 with the repository secret (METRICS.md). Publishing now
  would spend the one channel that makes attribution-by-elimination sound against a funnel nobody can
  read afterwards, and the funnel shape is unrecoverable after the fact. **EXP-002 remains NOT STARTED
  until one snapshot succeeds.** The proxy is corrected here rather than reinterpreted later, which is
  the whole point of an append-only file.
- **Decision:** pending.

## EXP-001 update — 2026-08-08 (run 12): still PENDING, cause narrowed to one candidate

**Status: PENDING.** No snapshot has ever succeeded; `ops/metrics/latest.json` does not exist at
master. Every counter is UNMEASURED over zero UTC dates. Nothing is graded, and no threshold is
reinterpreted here.

What changed is the *cause*, and it changed by elimination rather than by argument.

Run 11 recorded two candidate explanations for the authenticated `401` and could not separate them:
(a) stray whitespace in one secret, which the comparison would treat as a difference; (b) two
genuinely different values. It judged both indistinguishable without reading a secret.

They were separable in code. `68cd28d` makes the comparison trim both sides — justified independently,
because HTTP strips surrounding whitespace from a header value in transit while a Worker secret can
retain it, so a whitespace-bearing secret is unmatchable by every possible client rather than merely
mismatched. With that fix **confirmed live by build stamp** (verify-production 31222849117, 22:11:46
UTC), the dispatched snapshot still returned `401` (31222947399, 22:12:11 UTC).

**Candidate (a) is eliminated. Candidate (b) stands: the two values are genuinely different strings.**

The success threshold is unchanged and unmet: within 48h of a *readable* key, `ops/metrics/latest.json`
shows a non-zero `landing_view` **or** `landing_view_bot` for at least one day. The clock has not
started, because the key is not yet readable.

**Caveat raised and then closed, rather than smoothed over:** the first snapshot ran 25 seconds after
the build stamp flipped, which is thin margin for global propagation. A second dispatch two minutes
later returned the same `401`
([31223053290](https://github.com/in-c0/tuned/actions/runs/31223053290), 22:13:49 UTC). Two dispatches
against a Worker confirmed to trim, same result — the elimination holds. The daily scheduled run at
20:40 UTC is a third independent check that needs nobody's attention.

**EXP-002 (Show HN) remains NOT STARTED** and measurement-blocked for exactly the reason recorded in
run 11: publishing into a funnel nobody can read afterwards spends the single channel that makes
attribution-by-elimination sound, and the funnel shape is unrecoverable after the fact.
