# Tuned — STATUS

**Last updated:** 2026-08-08 17:10 Sydney (07:10 UTC), run 15 · **Head:** [`7753eeb`](https://github.com/in-c0/tuned/commit/7753eeb3cb2b8861b33e5b3d6d28bebf8f5e7975) at the time of writing

One screen of current state. Not a diary — the narrative lives in
[DECISIONS.md](DECISIONS.md), [EXPERIMENTS.md](EXPERIMENTS.md), [METRICS.md](METRICS.md) and
[issue #1](https://github.com/in-c0/tuned/issues/1). Update only when state **materially** changes.

## Phase and single active objective

**Phase:** pre-baseline. The product is deployed and instrumented; nothing about its funnel has ever
been read.

**Active objective:** obtain **one** authenticated metrics snapshot, so a first honest baseline exists
(EXP-001). Everything downstream — distribution, pricing, payment — is deliberately held behind it.

## Shipped and verified

| Capability | State | Evidence |
| --- | --- | --- |
| Production serving | healthy | `/` 200, `/api/version` = `7753eeb`, reviewer reading 2026-08-08 03:27 UTC |
| Deploy pipeline | working | Cloudflare Workers Builds on `master`; `npm ci && npm run check` → `wrangler deploy` |
| Clean-clone build gate | fixed + CI-enforced | run 1, `.github/workflows/check.yml` |
| Deploy verification by version identity | working | `verify-production.yml` polls `/api/version` for the pushed SHA, fails closed ([run 6](DECISIONS.md)) |
| Funnel telemetry (9 counters, 2 additive tables) | deployed, **unread** | `feb6c4f`; `src/metrics.ts` |
| Aggregate read path `GET /api/metrics` | deployed, **closed** | key-gated, fails closed; whitespace-tolerant since `68cd28d` |
| Automated tests | 23 passing, mutation-checked | `test/metrics.test.ts` |
| Production dependency advisories | none | `npm audit --omit=dev` clean; `hono ^4.12.34` |

## Real metrics and revenue

- **Every funnel metric is UNMEASURED**, covering **zero** UTC dates: landing views (human and bot),
  application submits, activation, attention actions, return-day aggregates.
  `ops/metrics/latest.json` **does not exist** — no snapshot has ever succeeded.
- **Gross cash collected: AUD $0.** Source: *no billing exists*. Not an estimate, not a forecast.
- **Autonomous spend: AUD $0.00 of $500.**
- No conversion, retention, demand or traction number is claimed anywhere, because none has been
  observed. See [METRICS.md](METRICS.md).

## Blockers, ordered by leverage

| # | Blocker | Owner | Cost | State |
| --- | --- | --- | --- | --- |
| 1 | **`METRICS_KEY` differs between the Worker secret and the GitHub Actions secret.** Both are set; the values are genuinely different strings (whitespace eliminated by `68cd28d`). Authenticated snapshots return 401. | **Owner** — authentication boundary | ~2 min, AUD $0 | Open since 2026-08-07; escalated once (run 14). Fix: the same-source sync command in the [run-13 report](https://github.com/in-c0/tuned/issues/1#issuecomment-5224304595). |
| 2 | **No payment path.** No payment-provider account exists, so gross cash is structurally $0 regardless of demand. | **Owner** — account creation | unknown | Not started. Blocks any revenue milestone. |
| 3 | **EXP-002 (first distribution test) is authored but unpublished** — needs owner authorization *and* blocker 1 cleared, or the funnel it generates cannot be read afterwards. | Owner authorizes, executor prepared | AUD $0 | Ready, held. |
| 4 | **Executor has no direct egress to `justtuned.com`** (403 CONNECT at the proxy, 14 consecutive runs). Mitigated, not fixed: GitHub Actions is the production read path. | Environment | — | Standing limitation, not a stop condition. |

## Current experiment

- **EXP-001 — funnel telemetry baseline:** **PENDING**. Clock has not started; it starts at a
  *readable* key, not at a key that merely exists.
- **EXP-002 — Show HN distribution smoke test:** **NOT STARTED**, pre-registered, measurement-blocked.

## Next action

Stand down on blocker 1 (no further diagnosis, patching or re-dispatch — reviewer directive
2026-08-08 03:29 UTC). On owner confirmation of secret synchronization: dispatch `metrics-snapshot`
**exactly once**, then record the first honest baseline. Success = authenticated HTTP 200 **and**
`ops/metrics/latest.json` committed. Unauthenticated 401 alone proves nothing.

## Not doing (deliberate holds)

- No pricing, positioning or broad feature work until a baseline exists (reviewer hold, standing).
- No further diagnosis of, or workaround for, the `METRICS_KEY` mismatch.
- No secret read, hash, rotation, comparison or exposure — ever.
- No publication of EXP-002 before owner authorization and a readable funnel.
- No spend; the executor holds no payment credentials.
- No generic summarizer, content generator or enterprise agent-observability dashboard. Humans
  contribute attention, not content.
- No invented baseline, forecast, or traction claim — including any framing of the AUD $1M stretch
  target as a projection.
