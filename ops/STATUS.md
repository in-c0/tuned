# Tuned — STATUS

**Last updated:** 2026-08-11 08:20 Sydney (2026-08-10 22:20 UTC), run 26 · **Head:** [`f46105d`](https://github.com/in-c0/tuned/commit/f46105d78ebf896a17eee67e1920f35aaca25c4a)

> **Owner:** [**DASHBOARD.md**](DASHBOARD.md) is the one-screen view of everything below plus
> milestones, experiment, lessons and freshness. It **mirrors** this file — where the two disagree,
> this one is right.

## OWNER ACTION REQUIRED

### **justtuned.com is answering a Cloudflare challenge to every client we can test, including a real browser. Clear it before anything else.**

| | |
| --- | --- |
| **Severity** | **Highest, and it displaced the Show HN paste.** Every path tested returns `403` with `cf-mitigated: challenge` — `/`, `/api/version`, `/api/metrics`, and `/ava/rss.xml`. A real headless Chromium got `403` on `GET /` at **both** 1440×900 and 390×844. |
| **Blocked outcome** | Anything that is not an interactive browser session is refused: open RSS, agent fetchers, both production readers. Publishing the Show HN post into this state would spend the single attributable channel on a link that 403s — **do not publish until this is cleared.** |
| **Why owner authority** | The refusal happens at the Cloudflare edge, before the Worker. Changing it means changing zone security settings, which the executor holds no credential for and would not touch uninvited. The one thing that *would* have worked from our side — dressing the requests up as a browser — is evasion of a control you enabled, and is refused on principle, not on capability. |
| **Confirmed this run — you can skip the manual check** | Run 25 asked you to open the `workers.dev` URL yourself to find out whether the Worker was healthy. **Done, from Actions: it is.** `f46105d` is live and correct there — landing 200, `/api/metrics` 401, `/terms` and `/privacy` 200 carrying `legal@justtuned.com`. So **this is purely zone configuration. No redeploy will fix it, and no rollback is warranted** — reverting would only put your personal Gmail back on the public pages. |
| **A second thing worth knowing while you are in there** | The Worker answers the public on `attention-feed.wldud5192.workers.dev` **with none of the zone's protections in front of it** — that route is how this run verified anything at all. Whatever rule is challenging `justtuned.com` is not applied there. That is normal Cloudflare behaviour, not a break-in, and it is the reason the fallback was available. But if the challenge was switched on deliberately, the bypass is worth a decision: `workers_dev: false` in `wrangler.jsonc` closes it. **Not changed unilaterally** — it is also the only production vantage point the loop currently has, so closing it while the zone is down would leave Tuned unverifiable. |
| **Exact minimum action** | Cloudflare dashboard → `justtuned.com` → **Security → Events**, filter by any Ray ID below → read which rule fired and what enabled it. Most likely candidates: Bot Fight Mode, a Managed Challenge WAF rule, or Under Attack mode left on. Then either turn it off or scope it so it does not challenge `GET /`, `/ava/*` and `/api/*`. |
| **Ray IDs** | 2026-08-10 21:37:06 UTC, colo **IAD**: `/` → `a29223cf1b49492d` · `/api/version` → `a29223cfee915b41` · `/api/metrics` (authenticated) → `a29223d17905ab5c` · `/ava/rss.xml` → `a29223d238415df7`. Browser hit 21:33:30 UTC → `a2921e88dcf2c67f` (`cType: 'managed'`, `cZone: 'justtuned.com'`). **Run 26 adds two more colos** — 22:06:48 UTC **SJC** `a2924f531a38e16d`, 22:17:45 UTC **LAX** `a2925e55ea742973` — so this is zone-wide, not one edge location having a bad day. Any of them will find the rule. |
| **Success check** | [verify production](https://github.com/in-c0/tuned/actions/workflows/verify-production.yml) goes green — which now means specifically that its **Public availability** step stops failing, since every other check in it already passes from the origin. Both readers self-diagnose: their logs print status, content type and Ray ID per path, for the zone and the origin side by side. |
| **Onset** | Between 2026-08-09 21:05 UTC (last successful snapshot, `55ece3c`) and 2026-08-10 20:48 UTC (first failed verify). **No product commit falls in that window** — nothing we shipped caused it. |
| **Last surfaced** | Here, in the run-25 execution report, and — unlike the unchanged Show HN blocker — **by one push notification**, on the judgement that a new public-availability incident is not the "repeated unchanged blocker" the owner-interface rule suppresses. Correct me if that reading is wrong and I will not repeat it. |

The Show HN action is **not cancelled, only displaced** — it is written, checked and one paste away in
[EXP-002-PACKET.md](EXP-002-PACKET.md), and it returns to the top of this card the moment the site
serves 200 again. EXP-002 stays `AUTHORIZED / NOT STARTED`.

The previous entry — `METRICS_KEY` mismatch across the two secret stores — remains **resolved and
removed**. Note that this incident is **not** a recurrence of it: the key still matches, and the 403 is
served by the edge before the Worker ever evaluates it.

Payment-provider account creation is still **not** listed as an action: it becomes the blocking step
when there is paid demand to collect, and there is none. One action at a time, and this is the one.

One screen of current state. Not a diary — the narrative lives in
[DECISIONS.md](DECISIONS.md), [EXPERIMENTS.md](EXPERIMENTS.md), [METRICS.md](METRICS.md) and
[issue #1](https://github.com/in-c0/tuned/issues/1). Update only when state **materially** changes.

## Phase and single active objective

**Phase: incident.** The funnel was readable and the apply path was proven working in production
(run 18) — but as of 2026-08-10 nothing can read production at all. An edge challenge sits in front
of every path, so the funnel, the verifier and the public surfaces are all dark at once.

**Active objective: get production answering non-browser clients again.** The previous objective —
controlled, known-human traffic — is unchanged in importance and strictly downstream: known-human
traffic sent at a 403 is worse than none, because it spends the channel and teaches nothing.

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
| Production serving | **Worker healthy · zone DOWN** — no longer one unknown, but two separate facts | Run 26 read the Worker directly on its `workers.dev` origin from Actions ([run 31437633360](https://github.com/in-c0/tuned/actions/runs/31437633360)): `f46105d` live, landing 200, `/api/metrics` 401, `/terms` and `/privacy` 200. The **zone** answered `403 cf-ray a2925e55ea742973-LAX` in the same job. The code is fine; the edge in front of it is not, so **the public still cannot reach Tuned** and the job is red on exactly that. |
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
| 0 | **The Cloudflare edge challenges every request to justtuned.com.** 403 + `cf-mitigated: challenge` on `/`, `/api/version`, `/api/metrics` and `/ava/rss.xml`; a real Chromium is refused on `GET /` at both widths. Falsified this run: an honest, explicitly-identified request contract changes nothing (bare and contract variants both 403, [run 31434666722](https://github.com/in-c0/tuned/actions/runs/31434666722)). | Owner — zone security settings | AUD $0 | **Open. Top blocker, displacing #1.** See OWNER ACTION REQUIRED. |
| 1 | **No arrival is known to be human.** EXP-003 removed the mechanism explanation for 0/115 — the apply path works in production at both widths — so the denominator is the problem. **The authorization half is now resolved** (2026-08-08 13:56 UTC); what remains is the publication itself, which is an authentication boundary: the executor holds no Hacker News session and has no route to the host. | Owner publishes; executor measures | AUD $0 | **Open, still the top blocker — but its shape changed from a decision to a paste.** See OWNER ACTION REQUIRED. |
| 2 | **No payment path.** No payment-provider account exists, so gross cash is structurally $0 regardless of demand. | Owner — account creation | unknown | Not started. Not yet blocking: there is no demand to collect. |
| 3 | **EXP-002 is authorized and unpublished.** ~~Needs owner authorization~~ — **received 2026-08-08 13:56 UTC.** Measurement precondition met; no unfilled token; no unverified claim. The packet is now a single canonical file, [EXP-002-PACKET.md](EXP-002-PACKET.md), rather than a comment to scroll for. | Owner publishes | AUD $0 | **Merged into blocker #1** — same paste, same success check. Kept here only so the authorization is on the record as resolved. |
| 4 | **Executor has no direct egress to `justtuned.com`** (403 CONNECT at the proxy, 18 consecutive runs). Mitigated, not fixed: GitHub Actions is the production read path — and it now demonstrably works. | Environment | — | Standing limitation, not a stop condition. |

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
