# Tuned — STATUS

**Last updated:** 2026-08-11 14:55 Sydney (04:55 UTC), run 28 · **Head:** [`d9b7d4f`](https://github.com/in-c0/tuned/commit/d9b7d4f2ec649e22ce645c3c16bbd9377ca753f4)

> **Owner:** [**DASHBOARD.md**](DASHBOARD.md) is the one-screen view of everything below plus
> milestones, experiment, lessons and freshness. It **mirrors** this file — where the two disagree,
> this one is right.

## OWNER ACTION REQUIRED

### **Bot Fight Mode is on for `justtuned.com`. Turn it off — it challenges agent fetchers and RSS readers, which are the product.**

**Corrected in run 28, from firewall data the owner supplied.** Runs 25–27 recorded this as
*"the public cannot reach Tuned."* **That was overstated**, and the correction matters more than the
outage: what Bot Fight Mode actually stopped was Tuned's own instruments, its own QA browser, and
datacenter vulnerability scanners. No request from a residential or consumer ISP was challenged in
24 hours. Evidence and its limits:
[2026-08-10-cloudflare-firewall-bot-fight-mode.md](evidence/2026-08-10-cloudflare-firewall-bot-fight-mode.md).

| | |
| --- | --- |
| **The rule, no longer a guess** | `ruleId: bot_fight_mode`, `source: botFight`, `rulesetId: ""` — the zone toggle under **Security → Bots**. Not a WAF custom rule, not a managed ruleset, not Under Attack mode. All seven rays the loop recorded across three colos carry it. |
| **Severity** | **High, but not the outage we called it.** 323 challenges in 24h: **322 from Microsoft AS8075 (Azure — GitHub Actions), 1 from Alibaba.** By user-agent: 187 blank (PHP scanner probes), 78 `tuned-ops-verifier` (**ours**), 52 `curl/8.5.0` (**ours**), 5 HeadlessChrome (**ours**), 1 other. A human clicking the link was probably always fine. |
| **The real blocked outcome, and it is permanent, not an incident** | **`/ava/rss.xml` was challenged 12 times.** Bot Fight Mode challenges *every* non-browser client, and non-browser clients **are Tuned's product** — agent fetchers and open RSS on every feed. Hosted readers (Feedly, Inoreader, NewsBlur) fetch from datacenters and will be challenged exactly as our verifier was. This is a standing conflict with the doctrine, not a one-off. |
| **What it means for Show HN** | The risk is **not** that the link 403s for HN readers — it likely does not. It is that the packet's sentence *"every feed has open RSS"* breaks for precisely the audience most likely to test it with a hosted reader. That argues for leaving bot protection off permanently rather than toggling it for the launch. |
| **Why owner authority** | It is a zone security setting; the executor holds no Cloudflare credential and would not touch it uninvited. The one thing that would have worked from our side — dressing our requests up as a browser — is evasion of a control you enabled, and is refused on principle, not capability. |
| **Exact minimum action** | Cloudflare → `justtuned.com` → **Security → Bots** → turn **Bot Fight Mode** off. If you want to keep something on, **Super Bot Fight Mode** is the one to use — it can allow verified bots and be scoped by path. Plain Bot Fight Mode cannot be scoped at all, which is the root of this. |
| **Leave alone** | Your custom rule *"Block PHP/WordPress/.env scanner probes"* (82 blocks of `xmlrpc.php`, `.env`, `.git/config`) and the managed `CVE-2025-55182` rule are doing real work and are **not** implicated. |
| **Worker health — settled, skip the manual check** | The Worker is fine. Run 26 read it on its `workers.dev` origin: `f46105d` live, landing 200, `/api/metrics` 401, `/terms` and `/privacy` 200 with `legal@justtuned.com`. **No redeploy or rollback helps** — reverting would only put your personal Gmail back on the public legal pages. |
| **A second decision while you are in there** | The Worker answers on `attention-feed.wldud5192.workers.dev` with **none of the zone's protections in front of it** — that route is how runs 26–27 verified anything. Normal Cloudflare behaviour, not a break-in. `workers_dev: false` in `wrangler.jsonc` closes it. **Not changed unilaterally:** it is currently the loop's only production vantage point. |
| **Ray IDs** | LAX `a2925e55ea742973` · SJC `a2924f531a38e16d` · IAD `a29223cf1b49492d`, `a29223cfee915b41`, `a29223d17905ab5c`, `a29223d238415df7`. **Correction:** `a2921e88dcf2c67f` was recorded here as the browser hit; the export shows it is `/api/version` from `curl/8.5.0`. The real browser rays are `a2921e953bfc77a8`, `a2921e952bd177a8`, `a2921e9cdb6b78ff`, `a2921ea13f718acf`, `a2921ea12f3e8acf`. |
| **Success check** | [verify production](https://github.com/in-c0/tuned/actions/workflows/verify-production.yml) goes green — specifically its **Public availability** step, the only one still failing. Both readers self-diagnose: their logs print status, content type and Ray ID per path, zone and origin side by side. |
| **Onset** | First challenge **2026-08-10 06:53 UTC** — narrower than the previous 2026-08-09 21:05 → 2026-08-10 20:48 window, though not proof of the toggle's flip, since no Bot-Fight-eligible traffic is recorded in the preceding 100 minutes. **No product commit falls in the window** — nothing we shipped caused it. |
| **Current state** | **Undetermined.** The export's last challenge is 2026-08-10 23:55 UTC and it runs to 02:26 UTC, but everything after 23:55 is scanner traffic caught by the custom rule, which evaluates *before* Bot Fight Mode — so the quiet tail is not evidence the toggle is off. Only a fresh request settles it. |
| **Last surfaced** | One push notification 2026-08-10 21:53 UTC; restated in the run-26/27 reports without re-notifying. Diagnosis delivered by the owner in-session 2026-08-11 ~04:40 UTC. |

The Show HN action is **not cancelled, only displaced** — it is written, checked and one paste away in
[EXP-002-PACKET.md](EXP-002-PACKET.md), and it returns to the top of this card the moment the toggle
is off and `verify production` is green. EXP-002 stays `AUTHORIZED / NOT STARTED`.

**One thing run 28 does not license.** The severity correction says the *humans* were probably fine;
it does **not** say publish now. The packet's RSS claim is still exposed while Bot Fight Mode is on,
and the loop still has no confirmation of the zone's current state. Both close with the same toggle.

The previous entry — `METRICS_KEY` mismatch across the two secret stores — remains **resolved and
removed**. Note that this incident is **not** a recurrence of it: the key still matches, and the 403 is
served by the edge before the Worker ever evaluates it.

Payment-provider account creation is still **not** listed as an action: it becomes the blocking step
when there is paid demand to collect, and there is none. One action at a time, and this is the one.

One screen of current state. Not a diary — the narrative lives in
[DECISIONS.md](DECISIONS.md), [EXPERIMENTS.md](EXPERIMENTS.md), [METRICS.md](METRICS.md) and
[issue #1](https://github.com/in-c0/tuned/issues/1). Update only when state **materially** changes.

## Phase and single active objective

**Phase: incident, downgraded in run 28 — from "production is dark" to "production is closed to
machines."** Bot Fight Mode challenges every non-browser client, so the funnel readers, the verifier
and the **agent/RSS surfaces** went dark together; interactive human browsers most likely did not.
That is a narrower incident and a wider product problem, because non-browser clients are what Tuned
is for.

**Active objective: get production answering non-browser clients again** — unchanged in wording,
sharpened in meaning. It is not "restore the site"; the site was probably up for people the whole
time. It is "stop challenging the clients the doctrine is built on." The previous objective —
controlled, known-human traffic — remains strictly downstream, now for one reason rather than two:
not because arrivals would hit a 403, but because the packet's open-RSS claim breaks under the toggle.

**The superseded objective, retained because it resumes unchanged the moment the edge clears:** EXP-003 answered the mechanism
question — a visitor who arrives *can* apply, at both mobile and desktop widths — so the remaining
explanations for 0/115 are that the arrivals were never human, or that the offer does not land on
whoever is arriving. **Neither is decidable from a denominator of UA-classified requests.** Until
some arrivals are known to be human, every conversion figure Tuned computes has an unknown
denominator and no downstream experiment is gradeable.

**As of 2026-08-08 13:56 UTC that objective has an owner decision behind it and a publication step in
front of it.** The channel is authorized; the post is written, checked and canonical in
[EXP-002-PACKET.md](EXP-002-PACKET.md); what remains is a paste into a session only the owner holds.
The binding step moved from *decide* to *publish*, and no executor work substitutes for it.

## Shipped and verified

| Capability | State | Evidence |
| --- | --- | --- |
| Production serving | **Worker healthy · zone closed to non-browser clients** — two separate facts, and the second one is narrower than run 26 recorded it | Run 26 read the Worker directly on its `workers.dev` origin from Actions ([run 31437633360](https://github.com/in-c0/tuned/actions/runs/31437633360)): `f46105d` live, landing 200, `/api/metrics` 401, `/terms` and `/privacy` 200. The **zone** answered `403 cf-ray a2925e55ea742973-LAX` in the same job. Run 28's firewall evidence names the cause — **Bot Fight Mode** — and shows every challenge went to a datacenter client, none to a consumer ISP. So the code is fine, **people could probably still use Tuned, and machines could not** — which for this product is the half that matters. The job stays red on exactly that. |
| Deploy pipeline | working | Cloudflare Workers Builds on `master`; `npm ci && npm run check` → `wrangler deploy` |
| Clean-clone build gate | fixed + CI-enforced | run 1, `.github/workflows/check.yml` |
| Deploy verification by version identity | **restored, and exercised for real** | `verify-production.yml` polls `/api/version` for the pushed SHA and fails closed. When the zone will not answer it reads identity and health from the Worker's `workers.dev` origin, then grades public availability **separately** — a step that failed [run 31437633360](https://github.com/in-c0/tuned/actions/runs/31437633360) while every other check in it passed. That is the intended shape: a green run still means the public can use Tuned |
| Funnel telemetry (9 counters, 2 additive tables) | deployed and **read** | `feb6c4f`; `src/metrics.ts` |
| Aggregate read path `GET /api/metrics` | **working, authenticated** | HTTP 200 in [run 31246496587](https://github.com/in-c0/tuned/actions/runs/31246496587); key-gated, fails closed |
| Metrics snapshot → repository | **working** | `ops/metrics/latest.json`, `ops/metrics/2026-08-08.json` at `a00a8fe` |
| **Application path, end to end in production** | **verified working** | EXP-003 [run 31251303499](https://github.com/in-c0/tuned/actions/runs/31251303499) — real Chromium, both widths, submit intercepted before mutation |
| **Public no-account surfaces** (demo feed + RSS) | **verified working** | EXP-004 [run 31252271974](https://github.com/in-c0/tuned/actions/runs/31252271974) — `/ava` 200 with 24 items, `/ava/rss.xml` 200 with 38, both widths |
| Browser QA harness | working, dispatch-only, **reusable** | `qa/`, `exp003-mechanism.yml` (pinned to its own spec) and `qa-browser.yml` (takes a spec as input); screenshots per run |
| Automated tests | 30 passing, mutation-checked | `test/metrics.test.ts`, `test/meta.test.ts` |
| Production dependency advisories | none | `npm audit --omit=dev` clean; `hono ^4.12.34` |

## Real metrics and revenue

Source: `ops/metrics/latest.json`, `generated_at` **2026-08-10T22:18:30Z** — **unfrozen this run.**
Covers **5 UTC days** (2026-08-06 → 2026-08-10). Read through the Worker's own origin, because the
zone would not answer; the counters are D1 state and are unaffected by which route read them
([snapshot run 31437732863](https://github.com/in-c0/tuned/actions/runs/31437732863), committed as
[`92ff81e`](https://github.com/in-c0/tuned/commit/92ff81e) with the vantage in its message).

| Stage | Observed | Note |
| --- | --- | --- |
| Landing views, human-flagged | **285** (29 / 69 / 56 / 56 / 75) | UA heuristic — **not** verified human traffic |
| Landing views, bot-flagged | **103** (15 / 23 / 43 / 7 / 15) | never merged with the above |
| Feed views | **32** human-flagged, 20 bot-flagged | all five days |
| **Applications submitted** | **0** | `application_submit` never fired; `waitlist` empty all-time |
| Member logins | **0** | counter never fired |
| Desk views | **0** | counter never fired |
| Attention actions since instrumentation | **0** | `attention_star` / `attention_skip` never fired |
| Members ever active (≥1 active day) | **0 of 1** member | `member_days` is empty |
| Return use (D1+ / 2+ active days) | **0** | nothing to return from |

- **Landing → application conversion: 0 / 285 = 0.0%.** With zero events in 285 trials the 95%
  one-sided upper bound is ~1.1%; the true rate could be small-but-positive, but it is **not** high.
- **08-10 is the highest day so far (75) and that means nothing yet.** Two reasons to hold it
  loosely rather than one: nothing has been published anywhere, so the arrivals are still most
  plausibly crawlers the UA heuristic missed; and the zone began refusing clients partway through
  that same UTC day, so the day is **truncated, not complete** — requests blocked at the edge never
  reach the Worker and are never counted. A rise and a censored tail in the same number is not a
  trend.
- All-time content totals, which **predate** instrumentation and are not activity: 79 public items,
  **42** queued (up from 27 — the `*/30` cron is still ingesting, which is its own evidence the
  Worker never stopped), 5 feeds (1 human / 4 agent), 8 stars, 33 skips, 1 member, 0 followers,
  1 connection.
- **Gross cash collected: AUD $0.** Source: *no billing exists*. Not an estimate, not a forecast.
- **Autonomous spend: AUD $0.00 of $500.**
- **No traction is claimed.** 285 human-flagged views on a product that has never been posted
  anywhere is most likely incidental and scanner traffic the UA heuristic did not catch. It is
  evidence that the counters work, **not** evidence of demand.

## Blockers, ordered by leverage

| # | Blocker | Owner | Cost | State |
| --- | --- | --- | --- | --- |
| 0 | **Bot Fight Mode challenges every non-browser request to justtuned.com** — named from owner-supplied firewall data in run 28 (`ruleId: bot_fight_mode`), no longer inferred. 403 + `cf-mitigated: challenge` on `/`, `/api/version`, `/api/metrics` and `/ava/rss.xml`. **Restated severity:** all 323 challenges in 24h hit datacenter clients (322 Azure/Actions, 1 Alibaba) and none hit a consumer ISP, so this closed Tuned to *machines* — including the agent fetchers and RSS readers the product exists for — rather than to people. Falsified earlier: an honest, explicitly-identified request contract changes nothing ([run 31434666722](https://github.com/in-c0/tuned/actions/runs/31434666722)). | Owner — Security → Bots toggle | AUD $0 | **Open. Top blocker, displacing #1.** See OWNER ACTION REQUIRED. |
| 1 | **No arrival is known to be human.** EXP-003 removed the mechanism explanation for 0/115 — the apply path works in production at both widths — so the denominator is the problem. **The authorization half is now resolved** (2026-08-08 13:56 UTC); what remains is the publication itself, which is an authentication boundary: the executor holds no Hacker News session and has no route to the host. | Owner publishes; executor measures | AUD $0 | **Open, still the top blocker — but its shape changed from a decision to a paste.** See OWNER ACTION REQUIRED. |
| 2 | **No payment path.** No payment-provider account exists, so gross cash is structurally $0 regardless of demand. | Owner — account creation | unknown | Not started. Not yet blocking: there is no demand to collect. |
| 3 | **EXP-002 is authorized and unpublished.** ~~Needs owner authorization~~ — **received 2026-08-08 13:56 UTC.** Measurement precondition met; no unfilled token; no unverified claim. The packet is now a single canonical file, [EXP-002-PACKET.md](EXP-002-PACKET.md), rather than a comment to scroll for. | Owner publishes | AUD $0 | **Merged into blocker #1** — same paste, same success check. Kept here only so the authorization is on the record as resolved. |
| 4 | **Executor has no direct egress to `justtuned.com`** — 403 CONNECT at the proxy, **24 consecutive runs**. Run 28 confirmed the denial is upstream gateway policy, not local misconfiguration: `/__agentproxy/status` reports `connect_rejected`, *"gateway answered 403 to CONNECT"*, for `justtuned.com:443`. Nothing to fix on our side. Mitigated, not fixed: GitHub Actions is the production read path and demonstrably works. | Environment | — | Standing limitation, not a stop condition. |

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
- **EXP-002 — Show HN distribution smoke test: AUTHORIZED, NOT STARTED.** Pre-registered; measurement-
  unblocked; the "0%-conversion funnel" objection retired by run 18; packet complete and its public
  claims checked by EXP-004. Owner authorized publication
  [2026-08-08 13:56 UTC](https://github.com/in-c0/tuned/issues/1#issuecomment-5226414917).
  **Its 48-hour clock has NOT started and will not start until a canonical
  `news.ycombinator.com/item?id=…` URL exists** — authorization is not publication, and the
  distinction is the difference between a graded experiment and a fabricated one.

## Next action

**Owner:** clear the edge challenge (above). **Executor:** nothing until it clears — and specifically
not a second attempt at the 403. The one bounded workflow-side attempt was made and falsified this
run, and the remaining ways to get a 200 out of a managed challenge are disguise, which is off the
table on principle.

When it clears, in order: confirm both readers green, take a fresh aggregate baseline, then hand the
Show HN paste back to the owner as the top card. The pre-publication baseline for EXP-002 already
exists at `55ece3c` and is not invalidated by this incident — but the days it spans now include days
production was unreachable, and that will be stated when EXP-002 is graded rather than discovered
afterwards.

Explicitly **not** a copy or positioning rewrite, and **not** a CTA-reach counter.

## Not doing (deliberate holds)

- No pricing, positioning or copy work while the denominator is unknown. Run 18 makes this sharper,
  not weaker: the apply path is proven, so a failed copy test could no longer even be blamed on a
  broken form — it would simply be ungradeable against crawler traffic.
- No CTA-reach counter yet. It is the right instrument against the wrong traffic.
- No publication of EXP-002 **by the executor** — authorization is now given, but the executor holds
  no Hacker News session and posting in the owner's name would be impersonation. No second channel,
  no outreach, no seeding of the thread, no reword of the approved text.
- No secret read, hash, rotation, comparison or exposure — ever.
- No spend; the executor holds no payment credentials.
- No generic summarizer, content generator or enterprise agent-observability dashboard. Humans
  contribute attention, not content.
- No invented baseline, forecast, or traction claim — including any framing of the AUD $1M stretch
  target as a projection, and including any reading of 115 UA-flagged views as demand.
