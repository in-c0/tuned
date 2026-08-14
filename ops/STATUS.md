# Tuned — STATUS

**Last updated:** 2026-08-15 07:45 Sydney (2026-08-14 21:45 UTC), run 41 — **ingestion is supplying
again; the human half of the loop is where the finding is** · **OWNER ACTION REQUIRED: ONE —
[install `AGENT_OPERATOR_KEY` twice](#owner-action-required)** (unchanged, still the only card) ·
**Head:** [`master`](https://github.com/in-c0/tuned/commits/master)

> **"One live connection with nothing to carry" is no longer true, and this file said it for a day.**
> On **2026-08-14** the Spotify cron ran **30 times, succeeded 30 times, threw no error of any kind,
> and captured 104 plays**. `items_queued` went **42 → 146**; the delta matches the capture count
> exactly. Source: [`ops/metrics/latest.json`](metrics/latest.json) at
> [`7a73982`](https://github.com/in-c0/tuned/commit/7a739827c21f9716765670f20f05fadeb1899ad3),
> `generated_at` 20:58:56 UTC, read through the public zone by the scheduled job.
>
> **`items_public` is still 79, and the newest public item still dates to 2026-08-02.** That is the
> whole finding, and it is not an engineering one. **The machine half of Tuned worked: it observed, it
> captured, it queued. The human half did not happen.** Publication needs a member to approve from the
> queue, and no member has — so **0 of 104** captured items reached a public feed, and the five feeds
> have only got older since [EXP-005](EXPERIMENTS.md) measured them. A 146-item private queue standing
> against 0 published items is Tuned's doctrine stated in numbers: *humans contribute attention, not
> content*, and no human is contributing any.
>
> **What this is not.** 104 captures is **one member listening to music for one day** — supply from a
> single connection, not demand, not activation, not traction. No conversion inference is drawn from
> it in either direction. **The 146 queued items were not opened, inspected, counted individually,
> approved, summarised or published**; they are member data and member attention, not inventory the
> executor may work. `applications` is still **0**, `members_ever_active` still **0**, gross cash still
> **AUD $0** from *no billing exists*, spend still **AUD $0.00 of $500**.
>
> **[EXP-006](EXPERIMENTS.md) was not re-graded.** It stays **QUIET, NOT BROKEN** at its original
> n = 1 window (2026-08-13 22:32:24 UTC); the 08-14 reading is filed beside it as a later observation.
> One arithmetic gap is logged and deliberately **not** investigated under the current hold:
> `cron_run = 30` against **42** expected `*/30` boundaries by the snapshot time. It is recorded as a
> candidate, gradeable only against a full UTC day (`cron_run = 48`), not as a claimed defect.
>
> **The authentication hold is unchanged and resumes silently after this file.** The scheduled
> `verify production` run at 20:45 UTC still read `/api/operator/agents` → **HTTP 503**: the Worker
> half of `AGENT_OPERATOR_KEY` is absent, the plane is fail-closed, and nothing was dispatched by this
> run to re-confirm it.

> **Adding an agent was going to cost one owner interruption every time, forever.** The plan this run
> inherited was a per-agent studio token in a GitHub secret: one credential per feed, each one an
> authentication event only the owner can perform, each one a capability URL ("publish anything to
> that feed") copied into a second system. It works exactly once and then bills the owner again for
> every agent after it — which is the opposite of what a loop that wants to *test* agents needs. The
> reviewer withdrew it before it was used, and asked for the lifecycle to be automated instead.
>
> **What shipped is one stable, revocable, owner-scoped operator credential.** `AGENT_OPERATOR_KEY`
> authorises a narrow control plane — list, adopt, create, publish, disable — over agent feeds owned
> by one configured member. **Per-agent studio tokens never enter GitHub at all**: they stay in D1,
> and no endpoint on this surface returns one. Bounded by construction: no human feed, no other
> member's agent, at most 12 agents, one find per call with an idempotency key, no SQL proxy, no
> key-read endpoint, no deletion, and a refusal to run at all if it is handed `ADMIN_KEY`.
>
> **It is deployed fail-closed, and production says so.**
> [`8c0362d`](https://github.com/in-c0/tuned/commit/8c0362d8e826a2dbfd046ab7c6c2e35d54769d1e) is live,
> confirmed serving by [verify production 31758303170](https://github.com/in-c0/tuned/actions/runs/31758303170),
> which now carries a standing assertion on this surface: *"/api/operator/agents without a key: HTTP
> **503** — AGENT_OPERATOR_KEY is not configured; the plane fails closed"* (00:44:19 UTC). A `200`
> there is an explicit roll-back signal. Production behaviour is otherwise unchanged. **79 tests passing** (28 new),
> and the transport was proved end to end against a local Worker through the exact workflow script
> that will run in production: adopt → publish → replay (published nothing) → list → disable →
> publish (refused). **No production agent was created, adopted or published this cycle**, and the
> owner card below is the only thing standing between here and the first live one.

> **The only path that makes items had no output anyone in this loop could read.** Spotify ingestion
> runs every 30 minutes and is currently the sole producer of items on Tuned; its entire outcome went
> to `console.log`, into Cloudflare's logs, which the executor holds no credentials for by design. So
> `items_queued` standing at **42 on 08-11, 08-12 and 08-13** had two explanations that looked
> identical from here — a member who stopped playing music, or a sync that stopped working — and the
> only instrument available was a delta between daily snapshots, which is exactly what both produce.
>
> **Six counters now separate them**, written into the `metric_days` table that already exists and
> arriving through the `/api/metrics` read path that already works: `cron_run`, `cron_no_credentials`,
> `spotify_sync_ok`, `spotify_items_captured`, `spotify_sync_auth_error`, `spotify_sync_error`. No new
> endpoint, no new table, no schema change, and no change to ingestion behaviour itself. **51 tests
> passing** (8 new, in workerd against a real D1). Shipped as
> [`1297427`](https://github.com/in-c0/tuned/commit/1297427).
>
> **[EXP-006](EXPERIMENTS.md) was pre-registered before the first snapshot existed** — six exclusive
> forks, each with its next action attached — and then **graded the same run**: `cron_run=1`,
> `spotify_sync_ok=1`, nothing captured, no errors, read at **22:32:24 UTC**, two minutes after the
> first cron boundary following the deploy ([`f65d6a3`](https://github.com/in-c0/tuned/commit/f65d6a3)).
>
> **Verdict: QUIET, NOT BROKEN.** The cron fires, the credential is set, the member's Spotify token
> still authenticates against the live API, and the poll found no play newer than `last_sync`. **The
> flat `items_queued = 42` is a true absence of supply, not a defect** — and the "connection died"
> branch is excluded. **n = 1 poll**: it says nothing about the three flat days before the counters
> existed, which stay uninterpretable. There is no backfill.
>
> **Superseded on 2026-08-14 — the connection is no longer quiet.** See the run 41 banner at the top
> of this file. The grade above stands at its own timestamp and is not re-opened.

> **The agent-activation question is now answered, and the answer is one secret.** Run 36 traced the
> whole contract in workerd against a real D1 — an agent reads its brief, publishes what it selected,
> the find appears on the public feed and in RSS, and the landing demo picks that feed up as the
> freshest thing on the site. **Eight assertions, all passing**
> ([`test/agent-contract.test.ts`](../test/agent-contract.test.ts)). Of the four prerequisites the
> reviewer set — identity, remit, credentials, permission — **identity exists** (four `kind='agent'`
> feeds), and **credentials and permission are the missing pair**, both owner-only. Nothing was
> published, and no agent identity was invented.
>
> **The trace found a real defect and it is fixed.** `GET /:handle/rss.xml` never selected `kind`, so
> `creator.kind` was `undefined` inside `rssFeed` and **every agent feed syndicated with no AI label
> at all** — the "AI agent" badge existed only on the HTML page. A subscriber reading an agent's finds
> in their own reader was never told a machine chose them, which is the provenance promise inverted on
> the one surface that leaves the site. The channel now carries it in both the title and the
> description; human feeds are untouched and asserted to stay unlabelled. [L-19](LESSONS.md).
>
> **Shipped and verified in production:** [`10d8557`](https://github.com/in-c0/tuned/commit/10d8557)
> was live 60 seconds after merge and [verify production 31746989255](https://github.com/in-c0/tuned/actions/runs/31746989255)
> passed every step from the public zone. **One honest gap:** the agent branch of the RSS label cannot
> be *observed* in production from here — the executor knows no agent feed's handle, and `/ava`, the
> one handle it does know, is the human feed and correctly stays unlabelled. The branch is covered by
> tests; the first `agent preflight` run will name a handle and settle it against live output.

> **Nothing has been published on Tuned since 2026-08-02, and the landing page did not say so.**
> [EXP-005](EXPERIMENTS.md) read the dates out of production: the demo block on `/` — headed *"Live
> demo — a real feed, right now"* — had a newest item **270.6 hours (11.3 days)** old, under cards the
> page's own script stamped **"11d ago"**. The other four feeds are **13.5 days** stale. All five
> serve, carry items and render correctly; what they contain is simply old. **431 UA-flagged
> human-shaped landing views arrived while that heading was false.**
>
> **Fixed by deleting the claim rather than by faking the data.** The heading now states only what the
> block is, and a presence pulse beneath it reads the real newest timestamp and degrades into *"last
> active 11d ago"* — the same honest pulse `publicPage` has always rendered. The demo also now selects
> the feed with the newest public item instead of the oldest creator: that picker was choosing on
> registration date and was passing **only by coincidence**. Recorded as [L-18](LESSONS.md): *a
> hardcoded claim about live data is a claim nobody can keep true.*
>
> **No conversion inference, in either direction.** No visitor has ever been observed reacting to this
> page in either state. This is a false public claim corrected on its own merits, not an experiment.
>
> **Why the feeds are stale is not a bug.** Publication needs an agent posting or a member approving
> from the queue. The four agent feeds are not running and the desk is unattended. **The executor did
> not and will not manufacture items to make the demo look alive** — that is content generation by the
> machine, the inversion of doctrine [L-17](LESSONS.md) put a standing hold on.

> **Run 34 stands unchanged:** the Show HN packet is **WITHDRAWN**, EXP-002 is `INVALIDATED / NOT
> STARTED`, the moderation-email owner action is **retired unperformed — please do not send it**, and
> the restoration checker is not dispatched. Full reasoning in [DECISIONS.md](DECISIONS.md) and
> [EXP-002-PACKET.md](EXP-002-PACKET.md). Any future Hacker News attempt still needs all three:
> a directly usable destination, the owner's own genuinely human-written words, and explicit
> moderator permission.

> **Two earlier banners retired here, because run 34 falsified their closing lines** — each said the
> owner action below was untouched and remained the only open one, and it is now withdrawn. Their
> substance is unchanged and lives in [DECISIONS.md](DECISIONS.md): **run 32** closed the deploy scare
> (`ffe54b4` was never picked up by Workers Builds; the next push deployed in 61 seconds and
> `verify production` passed every step — nothing to check in Cloudflare), and **run 31** applied the
> 1-week milestone grade precommitted on 2026-08-11. Neither is disturbed by this run: the milestone
> was missed on its publication condition, and an invalidated packet does not retroactively excuse a
> publication that never happened.

> **Owner:** [**DASHBOARD.md**](DASHBOARD.md) is the one-screen view of everything below plus
> milestones, experiment, lessons and freshness. It **mirrors** this file — where the two disagree,
> this one is right.

## OWNER ACTION REQUIRED

### **ONE: install `AGENT_OPERATOR_KEY` — the same value, in two places, once.**

| | |
| --- | --- |
| **Severity** | **High.** It is the only thing standing between Tuned and a live agent feed — and unlike the card it replaces, this is the **last** time an agent costs you an authentication step. |
| **Blocked outcome** | Every public feed stays an archive. Four agent feeds are registered, none has ever published, and the newest item on the site still dates from **2026-08-02**. The landing demo shows a visitor an archive and *"last active 11d ago"* — honest, and not a product. |
| **Why only you** | A Worker secret can only be set by someone holding Cloudflare credentials, and a repository secret only by a repository admin. The executor holds neither, by design. It also never reads this value back: it can only cause it to be *used*, inside a workflow. |
| **Minimum action** | Three steps, ~2 minutes. **(1)** Generate one high-entropy value — e.g. `openssl rand -base64 32`. **(2)** Cloudflare → Workers & Pages → `attention-feed` → Settings → Variables and Secrets → add secret `AGENT_OPERATOR_KEY` with that value. **(3)** GitHub → Settings → Secrets and variables → Actions → New repository secret, named exactly `AGENT_OPERATOR_KEY`, **same value**. |
| **Do NOT** | Do not paste it into issue #1, a comment, a commit or a file — this repository and that issue are public. Do not reuse `ADMIN_KEY` or `METRICS_KEY`: the control plane **refuses to run** (503) if its key equals `ADMIN_KEY`, because a bounded authority sharing an unbounded key is a fiction. |
| **Success check** | Executable, not an attestation: dispatch **[agent operator](../.github/workflows/agent-operator.yml)** with `action=list`. Green with `owner: @ava · active 0/12` means both halves match and the plane is live; it reads only, publishes nothing, and prints no secret, charter or member data. Without the secret it exits green with a NOT BOOTSTRAPPED notice. |
| **Age** | Opened 2026-08-14 (run 38). Replaces the run-36 `AGENT_STUDIO_TOKEN` card, which is **withdrawn before use** — do not action it. |
| **Surfaced at** | Here, [DASHBOARD.md §1](DASHBOARD.md), and the run-38 report on [issue #1](https://github.com/in-c0/tuned/issues/1). |

**What this key can do, exactly.** List managed agents and their public publication history; adopt one
agent feed you already own; create a new agent feed from a **public** remit; publish one source-linked
find with an idempotency key; disable an agent. That is the entire surface.

**What it cannot do, enforced in code and covered by tests.** Touch a human feed. Touch an agent owned
by anyone but the configured owner (`ava`) — no workflow input selects an owner. Read or return a
studio token, a session token, a member email, private charter text, a skipped item or the 42 private
queued items. Provision a member. Run SQL. Read any secret back. Delete anything. Manage a thirteenth
agent. Publish twice for the same idempotency key.

**Nothing happens the moment you set it.** The plane goes live; no agent is adopted, created or
published until a review authorizes the first one and a remit for it exists in
[`ops/agents/`](agents/). Disabling is one dispatch and destroys nothing — it revokes the operator's
authority and leaves the feed, its items and your own studio URL exactly as they were.

**One honest limit, stated before you spend the credential.** The executor's egress proxy blocks
direct page fetches (`blog.cloudflare.com` → `EGRESS_BLOCKED`); web *search* works. So its encounters
are real but shallow — it reads result-level material, not the page. That is a genuine constraint on
how good the selections will be, and it is a fact you should have before deciding, not after.

---

**Previously here, and still true: there is no Hacker News action.** The moderation-email
card that stood here — *ask Hacker News to review the dead item* — is **retired unperformed**. Do not
send it. Do not repost, resubmit reworded, use a second account or an alternate link, or solicit
votes. The channel is closed until all three conditions below are met, and none of them is urgent.

**Why it was withdrawn.** The packet it was recovering is unpublishable on Hacker News' own rules,
whatever moderation would have said: **§3 was AI-written and the packet instructed you to post it as
your own first comment**, and **§2 submitted an application-gated landing page** where Show HN asks for
something a reader can try directly. Getting the item restored would have restored an invalid test —
and, worse, one that produces exactly the flat counters a genuine rejection produces, which is how a
defect in the executor's own copy would have entered the record as a finding about Tuned. Full
reasoning in [L-17](LESSONS.md); the packet is fenced at
[EXP-002-PACKET.md](EXP-002-PACKET.md).

**If a Hacker News attempt is ever wanted again, it needs all three of these first** — this is a
standing constraint, not an action:

| | |
| --- | --- |
| **A directly usable destination** | Something a reader can try without applying or signing up. `/ava` is public and might qualify; the application-gated landing page does not. Building that is executor work, and it is not authorized this cycle. |
| **Your own words** | The title and any comment must be genuinely written by you and not AI-edited. **The executor will not draft, reword, or edit that text**, and will decline if asked — that is the doctrine applied to Tuned itself: humans contribute attention, not content. |
| **Explicit moderator permission** | Obtained by you, before any resubmission of this or a related link. Not this run's business, and not a step to take now. |

**The blocker underneath is unchanged and is not owner-actionable right now.** Applications remain
**0** across every measured day against **431** UA-flagged human-shaped landing views. No arrival is
known to be human, so every conversion figure Tuned computes still has an unknown denominator. What
changed today is only that the channel chosen to fix that turned out to be inadmissible. The next
candidate is a *different* channel, proposed openly — see the run-34 report on
[issue #1](https://github.com/in-c0/tuned/issues/1).

**Payment-provider account creation** is still deliberately not listed: it becomes the blocking step
when there is paid demand to collect, and there is none.

**Resolved and kept on the record: Bot Fight Mode.** Closed **2026-08-11**, by the owner, between
04:59:48 and 05:06:18 UTC. Two independent readings settle it, and neither is an inference:

| Reading | Time (UTC) | Vantage | Result |
| --- | --- | --- | --- |
| [verify production 31460563014](https://github.com/in-c0/tuned/actions/runs/31460563014) | 05:06:19–05:07:02 | `vantage=public`, ray `a294b5e62f7b1039-IAD` | `/` 200 · `/api/version` 200 · `/api/metrics` **401** unauthenticated · `/terms` + `/privacy` 200 with `legal@justtuned.com` · `/ava/rss.xml` **200** `application/rss+xml` · **Public availability step skipped** because the zone was no longer blocked |
| [metrics snapshot 31478252880](https://github.com/in-c0/tuned/actions/runs/31478252880) | 09:33:53–09:33:57 | `vantage=public`, ray `a2963de05b50e51c-DFW` | same five paths green from a second colo · authenticated `/api/metrics` 200 · `zone_blocked=false` |

**`cf-mitigated` was empty on every row of both probe tables, and the `bare` variant — plain
`curl/8.x`, the client that was being challenged — now passes identically to the named contract.**
That is the signature of the toggle being off rather than of a client that learned to look
acceptable. The executor changed no Cloudflare setting, sent no disguised request, and dispatched no
`verify production` run: the 05:06 evidence was a byproduct of shipping [`1c3fe86`](https://github.com/in-c0/tuned/commit/1c3fe867f2a83903cf4bdeb9b3b3c12b1efbb519),
and the 09:33 evidence a byproduct of taking the baseline.

The custom *"Block PHP/WordPress/.env scanner probes"* rule and the managed `CVE-2025-55182` rule were
never implicated and remain untouched. The standing recommendation from run 28 stands: if bot
protection returns, use rate limiting or **Super Bot Fight Mode with path exemptions** for `GET /`,
`/ava/*`, `/*/rss.xml` and `/api/*` — plain Bot Fight Mode cannot be scoped at all, which is what
caused this.

One screen of current state. Not a diary — the narrative lives in
[DECISIONS.md](DECISIONS.md), [EXPERIMENTS.md](EXPERIMENTS.md), [METRICS.md](METRICS.md) and
[issue #1](https://github.com/in-c0/tuned/issues/1). Update only when state **materially** changes.

## Phase and single active objective

**Phase: incident CLOSED 2026-08-11.** It ran from 2026-08-10 06:53 UTC to some point between
04:59:48 and 05:06:18 UTC on 2026-08-11 — roughly 22 hours, of which the last three runs were spent
correctly standing down rather than working around a control the owner had enabled. Both production
readers are green through the public zone from two colos. What it cost: two days of ungradeable
arrival counters, and one day where the loop believed the site was dark for everyone when it was
in fact dark only to machines.

**Active objective, restored: get one cohort of controlled, known-human traffic in front of the
landing page, and find out whether anybody applies.** This was the objective before the incident
displaced it, and nothing learned since has weakened it — 0 applications against 431 human-flagged
views is still the finding that governs everything downstream. **As of run 34 it is blocked on nothing
the owner can do, and on no channel that currently exists.** The one channel it had was withdrawn as
inadmissible, so the objective stands with no route in front of it — which is the honest state, and is
the reason the next candidate has to be a different channel rather than a retry of this one.

**Run 35 sharpened what any such channel would need, and the news is mixed.** The destination is now
*honest* — it no longer claims a freshness it lacks — but it is not yet *compelling*: a stranger who
opens `/ava` today sees a real, working, provenance-carrying feed whose newest item is eleven days
old. **That is a truthful answer to "is there something to try?" and a weak one**, and the weakness is
not a code defect. It is the absence of anyone — human or agent — currently contributing attention.
**The next candidate is therefore upstream of distribution: make one feed genuinely live**, by the
member approving from the queue or by an agent actually running. Until something on Tuned is current,
a channel would be pointing strangers at an archive.

**The superseded objective, retained because it resumes unchanged the moment the edge clears:** EXP-003 answered the mechanism
question — a visitor who arrives *can* apply, at both mobile and desktop widths — so the remaining
explanations for 0/115 are that the arrivals were never human, or that the offer does not land on
whoever is arriving. **Neither is decidable from a denominator of UA-classified requests.** Until
some arrivals are known to be human, every conversion figure Tuned computes has an unknown
denominator and no downstream experiment is gradeable.

**That authorization is spent, and its channel is gone.** The owner authorized a channel on
2026-08-08 13:56 UTC and pasted it on 2026-08-13; run 34 found the packet inadmissible on the venue's
own rules and **withdrew** it. So the binding step is no longer *decide* or *publish* — there is no
prepared channel at all, and the loop is not pretending otherwise. What a next channel must satisfy is
recorded as a standing constraint in the owner card above and as [L-17](LESSONS.md)'s prevention
check: admissibility conditions get pre-registered alongside thresholds, or the channel is not ready
to be authorized.

## Shipped and verified

| Capability | State | Evidence |
| --- | --- | --- |
| Production serving | **Green through the public zone**, most recently [run 31749138724](https://github.com/in-c0/tuned/actions/runs/31749138724) on 2026-08-13 at **22:15 UTC** — `1297427` live within 74 seconds of merge, landing and legal pages 200, unauthenticated `/api/metrics` 401, challenge-only failure step skipped because `zone_blocked=false`. Before that, [run 31746989255](https://github.com/in-c0/tuned/actions/runs/31746989255) on 2026-08-13 at **21:45 UTC** — `10d8557` live 60s after merge, landing and legal pages 200, unauthenticated `/api/metrics` 401, and the challenge-only failure step correctly skipped because `zone_blocked=false`. Before that, [run 31640663090](https://github.com/in-c0/tuned/actions/runs/31640663090) on 2026-08-12 at **21:03 UTC** — landing and legal pages 200, unauthenticated `/api/metrics` 401, and the challenge-only failure step correctly skipped because `zone_blocked=false`. The two readings that closed the incident are kept below as the record of that closure | [verify production 31460563014](https://github.com/in-c0/tuned/actions/runs/31460563014) at 05:06 UTC (`vantage=public`, ray `a294b5e62f7b1039-IAD`) and [metrics snapshot 31478252880](https://github.com/in-c0/tuned/actions/runs/31478252880) at 09:33 UTC (ray `a2963de05b50e51c-DFW`) both read `justtuned.com` directly: `1c3fe86` live, `/` 200, `/api/version` 200, unauthenticated `/api/metrics` 401, `/terms` and `/privacy` 200 with `legal@justtuned.com`, `/ava/rss.xml` 200 `application/rss+xml`. `cf-mitigated` empty on every row; the `bare` curl variant passes identically to the named contract. The origin route on `workers.dev` still answers and is no longer the only vantage. |
| Deploy pipeline | working | Cloudflare Workers Builds on `master`; `npm ci && npm run check` → `wrangler deploy` |
| Clean-clone build gate | fixed + CI-enforced | run 1, `.github/workflows/check.yml` |
| Deploy verification by version identity | **restored, and exercised for real** | `verify-production.yml` polls `/api/version` for the pushed SHA and fails closed. When the zone will not answer it reads identity and health from the Worker's `workers.dev` origin, then grades public availability **separately** — a step that failed [run 31437633360](https://github.com/in-c0/tuned/actions/runs/31437633360) while every other check in it passed. That is the intended shape: a green run still means the public can use Tuned |
| Funnel telemetry (9 counters, 2 additive tables) | deployed and **read** | `feb6c4f`; `src/metrics.ts` |
| Aggregate read path `GET /api/metrics` | **working, authenticated** | HTTP 200 in [run 31246496587](https://github.com/in-c0/tuned/actions/runs/31246496587); key-gated, fails closed |
| Metrics snapshot → repository | **working** | `ops/metrics/latest.json`, `ops/metrics/2026-08-08.json` at `a00a8fe` |
| **Application path, end to end in production** | **verified working** | EXP-003 [run 31251303499](https://github.com/in-c0/tuned/actions/runs/31251303499) — real Chromium, both widths, submit intercepted before mutation |
| **Public no-account surfaces** (demo feed + RSS) | **verified working** | EXP-004 [run 31252271974](https://github.com/in-c0/tuned/actions/runs/31252271974) — `/ava` 200 with 24 items, `/ava/rss.xml` 200 with 38, both widths |
| Browser QA harness | working, dispatch-only, **reusable** | `qa/`, `exp003-mechanism.yml` (pinned to its own spec) and `qa-browser.yml` (takes a spec as input); screenshots per run |
| Automated tests | **79 passing**, mutation-checked | `test/metrics.test.ts`, `test/meta.test.ts`, `test/landing.test.ts`, `test/agent-contract.test.ts` (run 36), `test/ingestion.test.ts` (run 37), **`test/operator.test.ts`** (run 38, 28 assertions — every one of them a refusal or a bound) — vitest 4.1.10 |
| **Ingestion cron observability** | **shipped and read run 37** | 6 counters in `metric_days` via `runIngestion` in `src/index.ts`; [`1297427`](https://github.com/in-c0/tuned/commit/1297427). First reading `cron_run=1`, `spotify_sync_ok=1`, nothing captured, no errors — [EXP-006](EXPERIMENTS.md) graded **QUIET, NOT BROKEN**. Now the standing liveness check |
| **Agent operator control plane** | **shipped, deployed and verified 503 in production run 38; awaiting one owner secret** | `src/operator.ts`, `/api/operator/*`, [`agent-operator.yml`](../.github/workflows/agent-operator.yml). One owner-scoped `AGENT_OPERATOR_KEY`; per-agent studio tokens never enter GitHub. 503 in production at 00:44:19 UTC ([verify 31758303170](https://github.com/in-c0/tuned/actions/runs/31758303170)) while the secret is absent |
| **Agent publication contract** (brief → publish → feed → RSS → demo) | **traced and working; blocked only on a credential** | `test/agent-contract.test.ts`, 8 assertions in workerd against a real D1. Nothing in production was written |
| **Agent provenance in RSS** | **fixed run 36** — the route never selected `kind`, so every agent feed syndicated unlabelled | `src/index.ts` `/:handle/rss.xml`, `rssFeed` in `src/pages.ts`; human feeds asserted to stay unlabelled |
| Production dependency advisories | none | `npm audit --omit=dev` clean; `hono ^4.12.34` |
| **Dev-toolchain advisories** | **none — 6 high cleared run 30** | [#27](https://github.com/in-c0/tuned/pull/27) → `92d850e`. `wrangler` 4.120.1 + `@cloudflare/vitest-pool-workers` 0.21.0 + `vitest` 4.1.10 collapse the tree to one wrangler and one miniflare, both out of the advisory range. `npm audit` **0 vulnerabilities**. No `src/` change — the deployed Worker is byte-identical |

## Real metrics and revenue

Source: `ops/metrics/latest.json` at [`567dad0`](https://github.com/in-c0/tuned/commit/567dad0),
`generated_at` **2026-08-12T21:24:27Z**. Covers **7 UTC days** (2026-08-06 → 2026-08-12, the last
partial — it was read at 21:24 UTC, before that day closed). Read through the **public zone**;
`zone_blocked=false`.

| Stage | Observed | Note |
| --- | --- | --- |
| Landing views, human-flagged | **431** (29 / 69 / 56 / 56 / 84 / 71 / 66) | UA heuristic — **not** verified human traffic |
| Landing views, bot-flagged | **140** (15 / 23 / 43 / 7 / 18 / 26 / 8) | never merged with the above |
| Feed views | **62** human-flagged, **58** bot-flagged | all seven days |
| **Applications submitted** | **0** | `application_submit` never fired; `waitlist` empty all-time |
| Member logins | **0** | counter never fired |
| Desk views | **0** | counter never fired |
| Attention actions since instrumentation | **0** | `attention_star` / `attention_skip` never fired |
| Members ever active (≥1 active day) | **0 of 1** member | `member_days` is empty |
| Return use (D1+ / 2+ active days) | **0** | nothing to return from |

- **Landing → application conversion: 0 / 431 = 0.0%.** With zero events in 431 trials the 95%
  one-sided upper bound is ~0.7% (was ~1.1% at n=285). The bound tightens; the estimate does not move,
  and the denominator is still UA-classified requests rather than known people.
- **08-11 finished far above where it was last read: 39 → 71 human-flagged, 11 → 26 bot-flagged, and
  feed views 0 → 15 human-flagged.** That is not new traffic and not a trend — the previous reading
  was taken at 09:33 UTC, a third of the way into the day. The same caution now applies to 08-12 (66),
  which is itself partial.
- **08-10 and 08-11 arrival counts remain censored, not merely noisy.** The zone challenged clients
  through part of that window; a request blocked at the edge never reached the Worker and was never
  counted. This is stated, not estimated, and it will be stated again whenever a channel is graded
  against a baseline that includes those days. **EXP-002 will never be that channel** — it is
  invalidated and ungraded — so the caveat now attaches to whatever first channel is authorized next.
- All-time content totals, which **predate** instrumentation and are not activity: 79 public items,
  **42** queued (up from 27 — the `*/30` cron is still ingesting, which is its own evidence the
  Worker never stopped), 5 feeds (1 human / 4 agent), 8 stars, 33 skips, 1 member, 0 followers,
  1 connection.
- **Gross cash collected: AUD $0.** Source: *no billing exists*. Not an estimate, not a forecast.
- **Autonomous spend: AUD $0.00 of $500.**
- **No traction is claimed.** 431 human-flagged views on a product that has never been posted
  anywhere is most likely incidental and scanner traffic the UA heuristic did not catch. It is
  evidence that the counters work, **not** evidence of demand.

## Blockers, ordered by leverage

| # | Blocker | Owner | Cost | State |
| --- | --- | --- | --- | --- |
| 0 | ~~**The deploy pipeline did not pick up `master`.**~~ **One build was dropped; the pipeline was never broken.** [`ffe54b4`](https://github.com/in-c0/tuned/commit/ffe54b4) merged 21:46 UTC and was never picked up — 72 consecutive `/api/version` probes across three runs of `verify production` over 32 minutes read the *previous* build every time. The next push, [`23b1f42`](https://github.com/in-c0/tuned/commit/23b1f42) at 22:11 UTC, **deployed in 61 seconds** and [verify production 31645872052](https://github.com/in-c0/tuned/actions/runs/31645872052) passed every step. Since `23b1f42` is a descendant of `ffe54b4`, the skipped commit's content is live regardless. **No owner action, and nothing to read in the Cloudflare dashboard** — the escalation written at 22:09 was falsified two minutes later by its own push. | — | AUD $0 | **Closed 2026-08-12 22:12 UTC**, same day it opened. Kept for the standing lesson below. |
| 1 | **No arrival is known to be human.** EXP-003 removed the mechanism explanation for 0 applications — the apply path works in production at both widths — so the denominator is the problem. **Run 34 changed who this is blocked on.** The channel meant to fix it was withdrawn as inadmissible on the venue's own rules (see #3), so the blocker no longer has an owner action in front of it: there is no prepared channel, and the executor cannot conjure one this cycle without authorization. It is now **executor-side and unstarted** — the next move is to propose a *different* channel openly, with its admissibility conditions pre-registered, and that proposal is the run-34 next candidate rather than something already underway. | Executor proposes; owner authorizes | AUD $0 | **Open. Top blocker, and now nobody's queued action.** |
| 2 | **No payment path.** No payment-provider account exists, so gross cash is structurally $0 regardless of demand. | Owner — account creation | unknown | Not started. Not yet blocking: there is no demand to collect. |
| 3 | ~~**EXP-002 is authorized and unpublished.**~~ **Withdrawn as inadmissible, 2026-08-13 (run 34).** The packet was authorized 2026-08-08, pasted 2026-08-13, killed at submission — and then found unpublishable on Hacker News' own rules regardless: **§3 was AI-written and was to be posted as the owner's own first comment**, and **§2 submitted an application-gated landing page**. [EXP-002-PACKET.md](EXP-002-PACKET.md) is fenced **WITHDRAWN — DO NOT POST OR RESTORE UNCHANGED**; EXP-002 is **`INVALIDATED / NOT STARTED`** with no t0, window, grade or demand inference; the restoration checker is retired. | Closed — no owner action | AUD $0 | **Closed unperformed.** Eleven runs of checking its *claims* never asked whether the venue permits a post of that form by that author — [L-17](LESSONS.md). |
| 4 | **Executor has no direct egress to `justtuned.com`** — 403 CONNECT at the proxy, **27 consecutive runs**, re-tested this run. Run 28 confirmed the denial is upstream gateway policy, not local misconfiguration: `/__agentproxy/status` reports `connect_rejected`, *"gateway answered 403 to CONNECT"*, for `justtuned.com:443`. Nothing to fix on our side. Mitigated, not fixed: GitHub Actions is the production read path and demonstrably works. | Environment | — | Standing limitation, not a stop condition. |

**Standing lesson from blocker #0, kept because the next dropped build will look identical.** Workers
Builds can silently skip a single push. The signature is specific: `verify production` red on *"expected
commit never became live"* while every health probe in the same job returns 200 — the site is fine, the
*replacement* did not happen. **The first response is another push, not an owner escalation**, because
a later commit that carries the skipped one makes the skip moot and re-proves the pipeline in about a
minute. Escalate only if a second consecutive push is also not picked up; that is the reading that
distinguishes a dropped build from a broken pipeline, and it costs one commit to obtain.

## Current experiment

- **EXP-001 — funnel telemetry baseline: PASSED / CLOSED.** Threshold was a non-zero `landing_view`
  or `landing_view_bot` on ≥1 day; observed non-zero on **all three** days. The instrumentation is
  confirmed working end to end in production, and the pre-registered "zero means no traffic" fork
  does not apply.
- **EXP-003 — application mechanism test: PASSED / CLOSED (run 18).** Pre-registered before any
  reading. All six criteria hold on live production at both 390×844 and 1440×900
  ([run 31251303499](https://github.com/in-c0/tuned/actions/runs/31251303499)). No application was
  created, no counter incremented — the submit was intercepted in-browser. One unrelated first-party
  404 was found on the first run and fixed in [`5ef6970`](https://github.com/in-c0/tuned/commit/5ef6970b50487cace86fb4fbdbac8d7a33e2afba).
- **EXP-004 — public no-account surfaces: PASSED / CLOSED (run 19).** Pre-registered before any
  reading. All five criteria hold on live production at both widths
  ([run 31252271974](https://github.com/in-c0/tuned/actions/runs/31252271974)): the demo link
  resolves to `https://justtuned.com/ava`, that feed serves 200 with **24 items** and no empty
  state, `/ava/rss.xml` serves 200 `application/rss+xml` with **38 items**, and there are no
  first-party errors and no horizontal overflow. GETs only — nothing was written.
- **EXP-002 — Show HN distribution smoke test: `INVALIDATED / NOT STARTED`, withdrawn 2026-08-13
  (run 34).** Authorized [2026-08-08 13:56 UTC](https://github.com/in-c0/tuned/issues/1#issuecomment-5226414917),
  submitted **2026-08-13 00:13:23 UTC**, killed at submission (`dead: true`, item `49280269`, verified
  from GitHub's network in [run 31654090210](https://github.com/in-c0/tuned/actions/runs/31654090210)),
  and then **withdrawn on review** as inadmissible on Hacker News' own rules: §3 AI-written and to be
  posted as the owner's own first comment, §2 an application-gated landing page. **No t0, no window, no
  snapshot, no conversion inference, no grade — and none will be created if the item is ever restored**,
  because a restored invalid submission is still an invalid test. Every band, threshold and definition
  stands unspent, and the zero baseline is uncontaminated. Full entry in
  [EXPERIMENTS.md](EXPERIMENTS.md); the packet is fenced at [EXP-002-PACKET.md](EXP-002-PACKET.md);
  the lesson is [L-17](LESSONS.md).

## Next action

**Owner:** **one card, at the top of this file — install `AGENT_OPERATOR_KEY` once as a Cloudflare
Worker secret and once as a GitHub Actions repository secret, same value.** Two minutes, and it is the
last time an agent costs you an authentication step. Still do not email HN moderation, and do not
repost.

**Executor, once the secret exists:** dispatch `agent operator` with `action=list` — the read-only
preflight. Green means both halves match and the plane is live. Then **stop**: creating or adopting
the first agent needs a review authorizing it and a public remit in [`ops/agents/`](agents/), and a
green `list` is permission to proceed to that decision, not through it. Once one is authorized:
publish finds the agent genuinely encountered and selected, label them as the agent's, and
pre-register what a working agent feed would have to show before reading any number off it.

**Executor, while the secret does not exist: hold silently.** Per the [2026-08-14 09:33 UTC
review](https://github.com/in-c0/tuned/issues/1#issuecomment-5291773039) this means **no manual
dispatch of `verify production` or `agent operator` to re-confirm the 503, no substitute task, no
executor report** while the gate is unchanged. Resume only on (a) the owner reporting both copies
installed, or (b) a **naturally scheduled** verification showing 503 → 401 — then one `action=list`
run, recorded, and stop before any agent mutation. Nothing about agent activation in the meantime: do
not create a creator, do not ask for `ADMIN_KEY`, do not invent an agent identity or a remit, do not
publish under the owner, do not approve the member's **146** private queued items, and do not
manufacture items. Do not ask for `AGENT_STUDIO_TOKEN` — that card is withdrawn. The credential is the
work; there is no version of this the executor can do alone, and pretending otherwise is how the last
invalid experiment got built.

**Also standing: stop dispatching [`hn-item-status.yml`](../.github/workflows/hn-item-status.yml)** —
it is retired in place, its green condition is void, and no run should read item `49280269` again. The
next candidate is to **propose a different distribution channel openly**, with its admissibility
conditions pre-registered alongside its thresholds per [L-17](LESSONS.md): what the venue permits, who
must author the words, and what the destination has to be. That is a proposal for the reviewer and the
owner to authorize, not something to start unasked — and the honest precondition underneath it is that
Tuned currently has **no directly usable destination** for a stranger, which is itself a candidate
piece of work rather than a copy change.

Explicitly **not** a copy or positioning rewrite, **not** a CTA-reach counter, **not** a reworded
resubmission, **not** a second Hacker News account or a second link to the same site, and **not** a
replacement channel invented and executed this cycle. ~~The one engineering candidate that survives is
the flat `items_public` / `items_queued` count, unexamined since run 31 recorded it.~~ **Taken up in
run 37** — the count was flat because nobody in this loop could see the pipeline behind it. ~~The
instrument is shipped and [EXP-006](EXPERIMENTS.md) is pre-registered, so the next run's first job is
to read the counters and grade the fork.~~ **Done — graded run 37 (QUIET, NOT BROKEN), and read again
run 41: the queue is no longer flat.** 08-14 captured **104** plays and `items_queued` went 42 → 146
while `items_public` stayed at **79**. Ingestion is not the constraint; publication is, and
publication is a human act.

**The candidate that replaces it is small, engineering-shaped and deliberately parked:** `cron_run`
recorded **30** on 08-14 against **42** expected `*/30` boundaries by the 20:58 UTC snapshot — about
29% unaccounted for. Not a claimed defect (Cloudflare crons are best-effort, and one partial day is
thin), not investigated under the current silent hold, and **gradeable only against a complete UTC
day, where a healthy cron reads `cron_run = 48`**. Reading that costs nothing but waiting for the next
scheduled snapshot; it needs no owner and no dispatch.

## Not doing (deliberate holds)

- No pricing, positioning or copy work while the denominator is unknown. Run 18 makes this sharper,
  not weaker: the apply path is proven, so a failed copy test could no longer even be blamed on a
  broken form — it would simply be ungradeable against crawler traffic.
- No CTA-reach counter yet. It is the right instrument against the wrong traffic.
- **No Hacker News activity of any kind, by anyone, on the executor's initiative.** EXP-002 is
  withdrawn. No repost, no second account, no reworded resubmission, no alternate link to the same
  site, no vote or comment solicitation, and **no contact with moderation** — the email the loop was
  asking for is itself withdrawn. The executor holds no HN session and acting in the owner's name
  would be impersonation regardless.
- **No drafting of public copy for the owner to publish under their own name**, on Hacker News or any
  venue that asks for the poster's own words. This is the doctrine turned on the loop itself: humans
  contribute attention, not content. Writing the owner's voice for them was the defect in EXP-002, not
  an incidental detail of it.
- No secret read, hash, rotation, comparison or exposure — ever.
- No spend; the executor holds no payment credentials.
- No generic summarizer, content generator or enterprise agent-observability dashboard. Humans
  contribute attention, not content.
- No invented baseline, forecast, or traction claim — including any framing of the AUD $1M stretch
  target as a projection, and including any reading of 115 UA-flagged views as demand.
