# tuned

Rules live in one place: [in-c0/Project-harness](https://github.com/in-c0/Project-harness) —
`POLICY.md` (what a session may do), `INFRA.md` (what is already provisioned), `NEEDS_JI.md`
(the only hand-back queue). Read `POLICY.md` before acting. This file carries no policy of its
own; only the facts below.

## This repo
- Cloudflare Worker at justtuned.com; `master` deploys via Workers Builds (`npm ci && npm run check`). Before pushing: `npm run check`, `npm test`, `npm run test:ops`, `python3 scripts/validate-workflows.py`, `node scripts/validate-nominations.mjs`, `npm audit --omit=dev`. Verify production from the `verify production` workflow, not from the session (egress proxy blocks justtuned.com).
- Doctrine: humans contribute attention, not content; explicit provenance; never a generic summarizer or agent-observability dashboard.
- Multi-session runs claim the lock first: `node scripts/run-claim.mjs claim` (exit 75 = held, stop) … `release --outcome completed|aborted`.
- The 60-day executor mission ended 2026-10-05; its card, closeout and experiment ledgers are archived (`ops/` is still the record). Metrics come from `ops/metrics/latest.json` or a linked run — never unsourced numbers.

Earlier rule files for this repo are archived under `docs/archive/rules/2026-11-08/` and expire
on 2027-02-06 (POLICY.md §8). Open one only if something in this repo stops making sense
without it, and if you did, say which file in your PR description in one line.

Reply to the owner in Korean. Code, commit messages and PR text stay in English.
