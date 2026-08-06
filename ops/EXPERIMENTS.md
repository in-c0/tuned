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
- **Result:** PENDING — blocked on the owner setting `METRICS_KEY` (see issue #1).
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
