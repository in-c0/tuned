# Metrics

Every metric here must name its source. Never invent, extrapolate, or manually inflate a number. If a metric cannot be sourced yet, it stays listed as UNMEASURED.

## Definitions

- **Applications submitted** — rows in the D1 applications table (source: `wrangler d1 execute attention_feed --remote`). UNMEASURED as of 2026-08-06.
- **Members activated** — members with ≥1 session after approval (source: D1 sessions). UNMEASURED.
- **Attention events** — stars/skips/opens recorded (source: D1). UNMEASURED.
- **Human traffic** — Cloudflare `/cdn-cgi/rum` or Worker-side instrumentation only. Raw CF request counts are scanner-dominated and must never be cited as human traffic.
- **Gross cash collected** — payment provider records only. Currently **$0 and unmeasurable: no billing exists**. No other source may ever back this number.

## Snapshots

_Append dated snapshots below; each line cites its source query._
