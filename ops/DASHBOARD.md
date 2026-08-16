# Tuned — OWNER DASHBOARD

**Public repository, no Tuned route.** This file lives in `in-c0/tuned`, which the owner **made public
on 2026-08-09**, and is served on no Tuned route. It said "Private" until run 26; that was written when
the repository was private and was simply never revisited. Write nothing here you would not publish.

**This is a mirror, not a source of truth.** Every number here is copied from a canonical file and
linked back to it. If this file and a canonical file disagree, **the canonical file is right and this
one is stale** — see [Freshness](#8-last-materially-updated-and-freshness).

| Question | Answered in | Canonical source |
| --- | --- | --- |
| What must I do? | [§1](#1-owner-action-required) | [STATUS.md](STATUS.md) |
| Where are we? | [§2](#2-current-phase-and-single-objective) | [STATUS.md](STATUS.md) |
| Nearest milestone? | [§3](#3-milestone-horizons) | [MILESTONES.md](MILESTONES.md) |
| What are the numbers? | [§4](#4-funnel-revenue-and-spend) | [METRICS.md](METRICS.md) · [`metrics/latest.json`](metrics/latest.json) |
| What is blocked? | [§5](#5-blockers-ordered-by-leverage) | [STATUS.md](STATUS.md) |
| What is being tested? | [§6](#6-current-experiment) | [EXPERIMENTS.md](EXPERIMENTS.md) |
| What did we learn? | [§7](#7-latest-three-lessons) | [LESSONS.md](LESSONS.md) |

> # **There is nothing for you to do.**
>
> **Newest thing you should know (run 46, 2026-08-16 08:30 Sydney).** **We have been working on the
> wrong obstacle.** The reason nobody can be pointed at Tuned was assumed to be that a stranger has to
> apply before they can see anything. That stopped being true a week ago — `justtuned.com/ava` and
> `justtuned.com/sportstech` work for anyone, no account needed. **The real reason is that there is
> nothing recent on them.** Your feed's newest item is from **2 August** (14 days ago); `@sportstech`'s
> is from **30 July** (17 days). Sending strangers to a feed that has not moved in two weeks does not
> test whether people want Tuned — it tests whether they will recommend something that looks
> abandoned.
>
> **What this changes:** the single publication that was already queued up behind Sunday's numbers is
> now the thing that unblocks *everything else*, not a nice-to-have. It was going to prove the agent
> machinery works. It turns out to also be the only thing that makes Tuned worth showing anyone.
>
> **One more thing found today, worth knowing before it costs us:** if we did point people at Tuned
> tomorrow, **we would not be able to tell whether it worked.** The only visitor counter is site-wide,
> and its ordinary day-to-day swing (2 to 22 people) is bigger than the number of visitors a first
> attempt would realistically bring. That gets fixed before any post goes out, not after — it is
> written down as a requirement now so it cannot be forgotten in the excitement of having somewhere to
> post.
>
> **Nothing changed on the site today**, deliberately: Sunday's landing-page measurement needed an
> undisturbed day and got one. Applications still **0**, cash still **AUD $0** because no billing
> exists, spend still **AUD $0.00 of $500**.
>
> ---
>
> **Previously (run 44, 2026-08-15 19:40 Sydney).** **Tuned's agent control plane
> just did something to production for the first time: it adopted your `@sportstech` feed. Nothing was
> published, and nothing on the feed changed.** Adoption means one thing only — the operator is now
> allowed to act on that feed, and it is the *first* of your feeds it has ever been allowed to act on.
> Production confirmed it back: **`owner: @ava · active 1/12`**, `@sportstech [active] source=adopted
> operator_publications=0`.
>
> **Your other three feeds were not touched** — `@graphics`, `@wearables` and `@wellbeing` are exactly
> where they were. **Nothing in your private queue was opened, read, approved or published**, and the
> site-wide public-item count is still **79**.
>
> **The next step is a single publication, and it is deliberately on hold until Sunday's numbers.**
> Run 43's landing-page counters need one complete, undisturbed day (UTC 08-16) before anyone reads
> them; publishing before that would change what a visitor sees mid-measurement. What a first
> publication must prove — one item, one source link, the AI label visible on both the web page and
> the RSS feed, nothing published twice, and a find genuinely encountered rather than written — was
> written down **before** the adoption, so it cannot be adjusted to fit whatever happens.
>
> **The honest part.** `@sportstech`'s newest public item is still from **2026-07-30** — 16 days ago —
> and today did not change that, because adoption publishes nothing. A control plane that works is a
> **capability**, not traction. Applications still **0**, cash still **AUD $0** because no billing
> exists, spend still **AUD $0.00 of $500**.
>
> **Previously (run 43, 2026-08-15 14:35 Sydney).** **For nine days the landing page
> has shown ~60–110 human-shaped visits a day and produced zero applications, and nobody — including
> this loop — could say why.** Three completely different problems produce that exact same pair of
> numbers: *nobody real is arriving*, *real people arrive and the pitch doesn't land*, or *people try
> to join and the form loses them*. We already proved the form itself works in a real browser
> ([EXP-003](EXPERIMENTS.md)), so it is one of those three — and until today Tuned recorded nothing
> between "someone loaded the page" and "someone successfully applied".
>
> **Now it records three things:** whether anything on the page gets touched at all (`landing_engage`),
> whether that reaches the application form (`application_start`), and whether anyone submitted and was
> **rejected** by the email check (`application_invalid`) — which until today left no trace whatsoever.
>
> **Nothing about your privacy commitments changed.** No cookie, no visitor tracking, no identifier of
> any kind, no new category of data — daily counts only. The privacy policy already describes this and
> was deliberately **not** amended.
>
> **There is no result yet, and there cannot be one until a full day has passed.** The first honest
> reading comes from the scheduled snapshot covering UTC day 08-16. What each possible answer means,
> and what happens next in each case, was written down **before** the counters existed
> ([EXP-007](EXPERIMENTS.md)) so the answer cannot be rationalised after the fact.
>
> **What this is not.** An instrument is not traction. Public items are still **79**, newest still
> **2026-08-02**, applications still **0**, cash still **AUD $0** because no billing exists, spend still
> **AUD $0.00 of $500**. **No agent was adopted, created, published or disabled**, and **nothing in your
> private queue was opened, read, approved or published.**
>
> **Previously (run 42, 2026-08-15 13:50 Sydney).** **The Cloudflare secret you
> installed is live, and the agent control plane answered for the first time:**
> **`owner: @ava · active 0/12`** ([run 31862547681](https://github.com/in-c0/tuned/actions/runs/31862547681),
> 03:43:10 UTC). Your 22:24 attempt last night hit `503` because the Worker had no value bound; by
> 03:42 the same route answered `401` — *key set, closed to anonymous callers* — and the read-only
> preflight then came back green. **[§1](#1-owner-action-required) is now NONE**, for the first time
> since 2026-08-14.
>
> **Nothing was done with it.** The preflight lists; it does not act. **No agent was adopted, created,
> published or disabled**, `active` is **0/12**, and the four feeds it named as adoptable
> (`@graphics`, `@sportstech`, `@wearables`, `@wellbeing`) are simply feeds you already own — nothing
> happened to them. The next step is a reviewer authorization plus a public remit, not another
> credential from you.
>
> **What this is not.** A working control plane is a **capability**, not traction. Public items are
> still **79**, the newest is still **2026-08-02**, applications are still **0**, cash is still
> **AUD $0** because no billing exists, and spend is still **AUD $0.00 of $500**. **Nothing in your
> private queue was opened, read, approved or published.**
>
> **Previously (run 41, 2026-08-15 07:45 Sydney).** **Your Spotify connection came
> back to life, and it is now the clearest picture of what Tuned is missing.** On 2026-08-14 the cron
> ran **30 times, succeeded 30 times, errored 0 times and captured 104 plays**. Your private queue went
> **42 → 146**. **Public items stayed at 79**, and the newest public item is still 2026-08-02.
> **0 of those 104 were published** — because publishing needs a person to approve from the queue, and
> nobody has. The machine half of Tuned works; the human half is not happening. That is not a bug to
> fix, it is the product doctrine showing up in the numbers. **Nothing in your queue was opened,
> read, approved or published by the executor** — it is your data and your attention, and 104 captures
> is one person listening to music for a day, not demand. [§1](#1-owner-action-required) is unchanged
> and still the only thing asked of you.
>
> **Previously (run 38, 2026-08-14 10:45 Sydney).** **The per-agent token plan was
> withdrawn before it was used, and the agent lifecycle is now automated.** Handing over one studio
> token per feed would have billed you an authentication step for every agent, forever, and copied a
> "publish anything to this feed" capability into a second system each time. Instead: **one stable,
> revocable, owner-scoped `AGENT_OPERATOR_KEY`** driving a narrow control plane — list, adopt, create,
> publish, disable — over agent feeds owned by `@ava` only. **Per-agent studio tokens never enter
> GitHub**; they stay in D1 and no endpoint returns one. Shipped **fail-closed**: with the secret
> absent every operator route answers 503 and the site is unchanged. 79 tests passing (28 new), and
> the whole path was proved locally through the real workflow script. **Nothing was created, adopted
> or published in production.** [§1](#1-owner-action-required) is the one thing left.
>
> **Previously (run 36, 2026-08-14 07:50 Sydney).** **The agent-activation question
> is answered: the contract works, and one secret is all that is missing.** Run 36 traced it end to end
> in workerd against a real D1 — brief → publish → public feed → RSS → landing demo, 8 assertions
> passing. Of the reviewer's four prerequisites, **identity exists** (4 agent feeds) and **credentials
> and permission are missing — both are yours**, which is [§1](#1-owner-action-required). The trace
> also found a real defect and fixed it: `/:handle/rss.xml` never selected `kind`, so **every agent
> feed syndicated with no AI label**, on the one surface that leaves the site ([L-19](LESSONS.md)).
> **Nothing was published, no agent identity was invented, and the 42 private queued items were not
> touched.**
>
> **Previously (run 35, 2026-08-13 20:15 Sydney).** **Nothing has been published on
> Tuned since 2026-08-02 — eleven days — and the landing page was heading that stale block *"Live demo
> — a real feed, right now"*.** [EXP-005](EXPERIMENTS.md) measured it: the demo's newest item was
> **270.6 hours** old, the other four feeds **13.5 days**. All five feeds serve and render; what they
> contain is old. **431 UA-flagged human-shaped landing views arrived while that heading was false.**
> Fixed by deriving the claim from data instead of asserting it — the heading now says only what the
> block is, and a pulse beneath it reads the real timestamp and degrades into *"last active 11d ago"*.
> **The executor did not manufacture items to make the demo look alive.** No conversion inference in
> either direction. See [L-18](LESSONS.md) and [STATUS.md](STATUS.md).

---

## 1. OWNER ACTION REQUIRED

### **NONE — the `AGENT_OPERATOR_KEY` card is closed.**

**You installed it, and it works.** Closed **2026-08-15 03:43:10 UTC** on its own stated success
check, not on anyone's opinion: `action=list` returned `HTTP 200` with **`owner: @ava · active 0/12`**
([run 31862547681](https://github.com/in-c0/tuned/actions/runs/31862547681)).

| | |
| --- | --- |
| **Opened** | 2026-08-14 (run 38) |
| **Closed** | 2026-08-15 03:43 UTC — age **~29 hours** |
| **How it was confirmed** | The unauthenticated route went **503 → 401** on a routine push check at 03:42:09, then one read-only `list` returned **200**. |
| **What it cost** | AUD $0. The executor never saw the value and cannot read it back. |

**Nothing was done with the new capability.** `active` is **0/12** and `operator_agents` is empty. The
run named four feeds as *adoptable* — `@graphics`, `@sportstech`, `@wearables`, `@wellbeing` — which
only means "you already own these and they are not yet managed". **None was adopted, created, published
or disabled.** No secret, charter, token or member data appeared in the log; the workflow prints named
fields only.

**What happens next is not yours.** The first agent needs a reviewer authorization plus a public remit
committed to [`ops/agents/`](agents/), and a pre-registration of what a working agent feed must show
before any number is read off it. If you ever want it switched off, `disable` is one dispatch and
destroys nothing — it revokes the operator's authority and leaves the feed, its items and your own
studio URL untouched.

**One limit worth carrying into that decision:** the executor's proxy blocks direct page fetches, so its
agent encounters material at result level, not page level. Real, but shallow — a reason to keep the
first remit narrow.

---

**Previously here, and still true — there is no Hacker News action.** The *email Hacker News
moderation about the dead item* card is withdrawn, and it
was never performed. Do not send it, and do not repost.

**Why.** The packet it was trying to recover cannot be posted to Hacker News at all, whatever
moderation would have said. Two defects, either one disqualifying, both in the executor's own work:

| | |
| --- | --- |
| **§3 was written by an AI** | ...and the packet instructed *you* to post it as your own first comment. HN asks people not to post generated or AI-edited text in comments. |
| **§2 was a landing page** | `https://justtuned.com/?src=shn-2026-08` is application-gated. Show HN asks for something a reader can try directly and treats landing/sign-up pages as off-topic. |

Restoring the item would have restored an **invalid test** — and an invalid test produces exactly the
flat counters a genuine rejection produces, which is how a defect in the executor's copy would have
entered the record as a finding about Tuned. It didn't. Recorded as [L-17](LESSONS.md).

**Nothing here is evidence about demand**, in either direction. EXP-002 is `INVALIDATED / NOT STARTED`
with no t0, no window and no grade; the zero baseline is intact and unspent.

**A future Hacker News attempt needs all three of these first** — standing constraint, not an action:
a **directly usable destination** that needs no application; **your own genuinely human-written words**
for the title and any comment, which the executor will not draft or edit; and **explicit moderator
permission** to submit again. None is urgent, and none is queued.

**Underneath, the real blocker is unchanged and is not yours right now:** 0 applications against 431
UA-flagged human-shaped landing views, so no arrival is known to be human. The channel meant to fix it
turned out to be inadmissible; the next candidate is a *different* channel, proposed openly by the
executor for authorization.

**Bot Fight Mode: closed 2026-08-11, and now retired from this card** as promised — the full record,
including the two colo readings that settled it and the standing recommendation to use path exemptions
if bot protection ever returns, lives in [STATUS.md](STATUS.md). Production has stayed green through
the public zone since, most recently [run 31640663090](https://github.com/in-c0/tuned/actions/runs/31640663090)
on 2026-08-12 at 21:03 UTC.

**Still deliberately *not* listed:** payment-provider account creation. It becomes the blocking step
when there is paid demand to collect. There is none — see [§4](#4-funnel-revenue-and-spend). One
action at a time.

**How this section behaves:** either `NONE`, or exactly one canonical action carrying severity, the
blocked outcome, why owner authority is required, the exact minimum action, an observable success
check, blocker age, and where it was last surfaced. It is removed the moment its success check passes,
not when the executor notices. New or materially changed actions are surfaced by the scheduled reviewer
directly in ChatGPT; unchanged ones are not repeated. Private channels (phone, email, SMS) are used
only with explicit owner authorization.

## 2. Current phase and single objective

**Phase:** incident **closed** 2026-08-11 (~22 hours, 2026-08-10 06:53 → 2026-08-11 ~05:00 UTC). The
funnel is readable again through the public zone, and as of run 18 the **apply path is proven to work
in production**. The constraint is not inside the product.

**Single active objective: obtain controlled, known-human traffic.** EXP-003 killed the mechanism
explanation for 0/115 — a real browser applied successfully at both mobile and desktop widths. What
remains is that **no arrival is known to be human**, and with an unknown denominator no conversion
figure is gradeable. **The one channel it had is gone.** It was authorized 2026-08-08, submitted
2026-08-13, killed at submission — and then **withdrawn on review** as inadmissible on Hacker News' own
rules. The objective is unchanged and so is the blocker; what changed is that there is now **no
prepared channel and no owner step in front of it** — see [§1](#1-owner-action-required).

**Explicitly not doing** (full list in [STATUS.md](STATUS.md)): no pricing/positioning/copy work
while the denominator is unknown; no CTA-reach counter yet — right instrument, wrong traffic; no
Hacker News activity at all — EXP-002 is withdrawn, and **no repost, no second account, no reworded
resubmission, no alternate link and no contact with moderation**, the last of which was itself
withdrawn this run; **no drafting of public copy for the owner to publish in their own name**, which
was the defect in EXP-002 rather than an incidental detail of it; no replacement channel invented and
executed this cycle, and no thread seeding; no secret read, hash, rotation or exposure, ever; no
spend; no generic summarizer, content generator or enterprise observability dashboard; no invented
baseline, forecast or traction claim.

## 3. Milestone horizons

All sixteen, from [MILESTONES.md](MILESTONES.md) — that file carries the full evidence conditions; this
is the index.

**Sub-day ladder anchor:** run 18, **2026-08-08 09:30 UTC / 19:30 Sydney**. It is rolling — re-anchored
at the start of each run. Run 17's rungs are graded below **by this run**, not by the one that set them. These six horizons did not exist before the owner requested them at
[07:04 UTC today](https://github.com/in-c0/tuned/issues/1#issuecomment-5225045057), so **no grade is
assigned to any sub-day window that closed before that**; inventing retrospective achievements is the
one thing this ladder must not do.

| Horizon | Target | Outcome in one line | Status | Blocker | Next action |
| --- | --- | --- | --- | --- | --- |
| 15 min | 09:45 UTC | EXP-003 pre-registered **and committed** before any production reading | **achieved** 09:38 UTC | cleared | — ([`b62bf08`](https://github.com/in-c0/tuned/commit/b62bf083cbdeeb74ab6e81b134a5473d2cd7fc3b)) |
| 30 min | 10:00 UTC | A real browser has answered *can a visitor apply?* against live production, at both widths | **achieved** 09:47 UTC | cleared | — ([run 31251303499](https://github.com/in-c0/tuned/actions/runs/31251303499)) |
| 1 hour | 10:30 UTC | Any defect the mechanism test exposes is fixed and verified live, or recorded as deliberately unfixed | **achieved** 09:47 UTC | cleared | — ([`5ef6970`](https://github.com/in-c0/tuned/commit/5ef6970b50487cace86fb4fbdbac8d7a33e2afba)) |
| 3 hours | 12:30 UTC | The next run does **not** spend its cycle on a copy rewrite or another instrument — falsified if the next claim picks either without a directive requiring it | active | needs a next run to grade | hold the line in the run-19 claim |
| 6 hours | 15:30 UTC | Owner has an explicit, single decision in front of them: authorize a first channel, or say what to do instead | active | owner is asleep — 19:30 Sydney | surfaced in the run-18 report; do not re-ask |
| 12 hours | 21:30 UTC | ≥1 arrival is **known** to be human, or a recorded reason none can be | not started | owner authorization for a first channel | nothing executor-side unblocks this |
| 1 day | 2026-08-09 | The funnel is readable — one authenticated snapshot | **achieved** 2026-08-08 | cleared | — |
| 1 week | 2026-08-15 | ≥3 consecutive daily snapshots; constraint identified as conversion or distribution; EXP-002 graded if it ran | **condition 1 MET** (5 snapshots) · **condition 2 MISSED**, graded 2026-08-13 Sydney per the 2026-08-11 precommitment. Run 34's withdrawal does not disturb the grade — it reinforces it: *"if it ran"* was never satisfied, and the experiment is now `INVALIDATED / NOT STARTED` and never will be | — | **No owner action.** The grade is recorded, not renegotiated; an inadmissible packet does not excuse a publication that never happened |
| 2 weeks | 2026-08-22 | A real payment path exists; first genuine willingness-to-pay evidence — or the wedge is falsified | not started | payment-provider account is an owner boundary | request the account once demand exists |
| 1 month | 2026-09-08 | First gross cash; activation measured, not assumed | not started | all of the above, in order | decided by the baseline |
| 3 months | 2026-11-08 | A small **retained paying cohort** | not started — *past the 2026-10-05 operating date; owner's to carry* | everything above | hand over an honest cohort table at closeout |
| 6 months | 2027-02-08 | Multiplayer earns its place: followed attention retains better than the solo desk | not started (directional) | wedge unproven | — |
| 1 year | 2027-08-08 | Provenance is the reason people stay; agent creators have identity and distribution | not started (directional) | — | — |
| 3 years | 2029-08 | Following an agent's attention is as ordinary as following a person's | not started (directional) | — | — |
| 5 years | 2031-08 | Attention provenance is infrastructure, verifiable rather than claimed | not started (directional) | — | — |
| Indefinite | — | Humans contribute **attention, not content**; provenance never blurred, never fabricated | standing doctrine | — | — |

**Nearest falsifiable milestone that is not this run's own paperwork: the 3-hour one** — establish
whether the apply path works at all.

## 4. Funnel, revenue and spend

**Two sources, deliberately not merged.** The **stage table below is still the 08-12 reading** —
[`567dad0`](https://github.com/in-c0/tuned/commit/567dad0), `generated_at` 2026-08-12T21:24:27Z,
covering 7 UTC days (2026-08-06 → 08-12, last partial). The **content totals and ingestion figures in
the bullets are the 08-14 reading** —
[`7a73982`](https://github.com/in-c0/tuned/commit/7a739827c21f9716765670f20f05fadeb1899ad3),
`generated_at` 2026-08-14T20:58:56Z. Both read through the public zone by the scheduled job. The
stage table was not re-derived this run because the directive was a bounded supply-side
reconciliation; it is **stale by two days and labelled so** rather than silently refreshed in part.
Full reading and caveats in [METRICS.md](METRICS.md).

| Stage | Observed | Note |
| --- | --- | --- |
| Landing views, human-flagged | **431** (29 / 69 / 56 / 56 / 84 / 71 / 66) | UA heuristic — **not** verified human traffic |
| Landing views, bot-flagged | **140** (15 / 23 / 43 / 7 / 18 / 26 / 8) | never merged with the above |
| Feed views | **62** human-flagged, **58** bot-flagged | 08-11's 32 bot-flagged feed views are the largest single day of either kind |
| **Applications submitted** | **0** | `application_submit` has never fired |
| Member logins · desk views | **0** · **0** | counters have never fired |
| Attention actions since instrumentation | **0** | `attention_star` / `attention_skip` never fired |
| Members ever active | **0 of 1** | `member_days` is empty |
| Return use (D1+, 2+ active days) | **0** | nothing to return from |

- **Landing → application: 0 / 431 = 0.0%.** 95% one-sided upper bound ~0.7% (was ~0.9% at n=333).
  The bound tightens; the estimate does not move. Do not treat "0%" as a measured constant.
- **08-11 revised upward as the day finished: 39 → 71 human-flagged, 11 → 26 bot-flagged, and feed
  views 0 → 15 human-flagged.** The previous reading was taken at 09:33 UTC, a third of the way into
  the day. Not new traffic, not a trend — the same day, finished. 08-12 (66) is partial for the same
  reason and will move too.
- **The 08-10 and 08-11 arrival counts remain censored, not merely noisy.** A challenged request never
  reached the Worker and was never counted, so the incident window is missing an unknown number of
  machine arrivals. This is stated, not estimated.
- **Gross cash collected: AUD $0.** Source: *no billing exists*. Not an estimate, not a forecast.
- **Autonomous spend: AUD $0.00 of the AUD $500 cap.** Running total in [DECISIONS.md](DECISIONS.md).
- **No traction is claimed.** 431 UA-flagged views on a product with no distribution proves **the
  counters work**, not that demand exists.
- **Content totals moved for the first time since instrumentation, on the queued side only** (08-14
  snapshot [`7a73982`](https://github.com/in-c0/tuned/commit/7a739827c21f9716765670f20f05fadeb1899ad3),
  `generated_at` 2026-08-14T20:58:56Z): **79 public items (unchanged), 146 queued (was 42, +104)**,
  5 feeds (1 human / 4 agent), 8 stars, 33 skips, 1 member, 0 followers, 1 connection. The +104 is
  Spotify ingestion — `spotify_items_captured = 104` on 08-14 across 30 successful polls with zero
  errors — and it matches the queue delta exactly. **Public items have been 79 on every snapshot ever
  committed.** Supply is not the constraint; publication is, and publication is a human act nobody has
  performed. **This is supply from one member's listening, not demand** — no conversion inference
  either way.
- **On the AUD $1,000,000 / 60-day stretch target:** it is optimization pressure and direction. No
  number on this dashboard forecasts it and none should be read as predicting it.

## 5. Blockers ordered by leverage

| # | Blocker | Owner | Cost | State |
| --- | --- | --- | --- | --- |
| 1 | **No arrival is known to be human.** EXP-003 proved the apply path works in production, so the zero is not explainable by a broken form — the denominator is the problem. **431** UA-flagged views on a product never posted anywhere is most likely crawler traffic. **The channel meant to fix this was withdrawn as inadmissible on 2026-08-13** (see #3), so there is now no prepared channel and no owner step: the next move is an executor proposal for a *different* one, with admissibility pre-registered. | Executor proposes; owner authorizes | AUD $0 | **Open. Top blocker, and nobody's queued action.** See §1. |
| 2 | **No payment path.** No provider account exists, so gross cash is structurally $0 regardless of demand. | Owner — account creation | unknown | Not started; **not yet blocking** — no demand to collect. |
| 3 | **EXP-002 authored, authorized, submitted, killed — and then withdrawn as inadmissible.** Run 34 found it unpublishable on HN's own rules whatever moderation said: AI-written body to be posted as the owner's own comment, application-gated landing page as the URL. Eleven runs verified its *claims* and none asked whether the venue permits that form by that author. | Closed — no owner action | AUD $0 | **Closed unperformed.** Packet fenced WITHDRAWN; EXP-002 `INVALIDATED / NOT STARTED`; checker retired. [L-17](LESSONS.md). |
| 4 | **Executor has no direct egress** — 403 CONNECT at the proxy, **36** consecutive runs, re-tested 2026-08-16 (run 47) against `justtuned.com` and `example.com`, and confirmed for `WebFetch` as well as `curl`. Every production and third-party reading in this loop comes from GitHub Actions. | Environment | — | Mitigated, not fixed, and **less limiting than this row implied for three runs**. Run 47: search works from the executor and page fetches do not, but the *loop* can now open a page too — [`source-read.yml`](../.github/workflows/source-read.yml) reads one third-party page in a real browser from Actions. What is still true is only that **the executor process** cannot fetch directly. [L-25](LESSONS.md). |

## 6. Current experiment

- **EXP-008 — can the operator control plane publish one real agent find? NOT STARTED / GATED**
  (run 44, pre-registered 2026-08-15 at adoption, **before any operator publication existed**).
  Baseline read back from production at adoption: `@sportstech` `source=adopted`, `public_items=11`,
  `operator_publications=0`, newest public item **2026-07-30**; site-wide `items_public` **79**. A
  first publication must show all six: 201 with an item id, **exactly one** new item,
  `operator_publications` 0 → 1, a replay that publishes **nothing**, the AI/agent label present on
  both the feed page and `/sportstech/rss.xml` (verified in a real browser and a real fetch — this is
  run 40's regression run forwards), and a find that was **genuinely encountered**. **Gated:** no
  publication until EXP-007's first complete-day reading is committed and graded. "Publish nothing" is
  pre-registered as an acceptable outcome. Capability evidence, explicitly **not** demand — and
  explicitly not a licence to publish because a feed looks stale.

- **EXP-007 — is there a human on the other side of the landing page? PENDING** (run 43,
  pre-registered 2026-08-15 04:20 UTC, **before the counters it reads existed**). Five mutually
  exclusive forks, each with its own next action: *the denominator is not human* → stop optimising the
  page, the constraint is distribution; *the offer does not land* → the proposition becomes testable
  for the first time; *intent exists and is being lost* → cut the form to email-only; *validation is
  eating applications* → a defect, fixed immediately; *under-powered* → grade nothing and wait. An
  **instrument validity gate** sits ahead of all five: zero engagement against non-zero views means the
  instrument is broken, not that nobody came. **Read from the snapshot covering the complete UTC day
  08-16 — not before, and not from a dispatched snapshot.** Nothing is graded against the 605
  historical views; the counters start at zero on their own deploy.

- **EXP-006 — is the flat queue a quiet member or a broken sync? GRADED: QUIET, NOT BROKEN / CLOSED**
  (run 37, 2026-08-13 22:32:24 UTC). Six mutually exclusive forks pre-registered before any counter
  existed, each with its own next action; fork 1 fired on n = 1 poll. **Not re-graded since, and it
  will not be** — but the same standing counters read very differently on **2026-08-14: 30 runs, 30
  successes, 104 plays captured, queue 42 → 146**. That later observation is filed beside the grade in
  [EXPERIMENTS.md](EXPERIMENTS.md), not merged into it. Its own pre-registered rule still binds: a high
  capture count is **one member listening to music — supply, not traction.**

- **EXP-005 — is the attention Tuned publishes actually recent? HYPOTHESIS SUPPORTED / CLOSED**
  (run 35). Pre-registered before any production read, threshold fixed first: the landing demo's
  newest item must be **< 48 h** old for the word *"now"* above it to be defensible. Measured
  **270.6 h** ([run 31689710757](https://github.com/in-c0/tuned/actions/runs/31689710757)) — 5.6× over,
  and **the red run is the finding**. Also caught a latent defect that was passing by luck: the demo
  was selected by creator registration date, not by content recency. GETs only; nothing written.
  Instrument kept — `qa/freshness.spec.mjs` is re-runnable and fails again the moment the page
  outruns its data.

- **EXP-001 — funnel telemetry baseline: PASSED / CLOSED** (run 16). Threshold was a non-zero
  `landing_view` or `landing_view_bot` on ≥1 day; observed non-zero on **all three**. Its pre-registered
  fork (*zero views → distribution problem*) **did not fire** — the constraint sits one stage further
  down than the experiment was built to see.
- **EXP-003 — application mechanism test: PASSED / CLOSED** (run 18). Pre-registered before any
  reading; all six criteria hold on live production at 390×844 and 1440×900
  ([run 31251303499](https://github.com/in-c0/tuned/actions/runs/31251303499), screenshots attached
  as artifacts). No application created, no counter incremented. One unrelated first-party 404 found
  on the first run and fixed in [`5ef6970`](https://github.com/in-c0/tuned/commit/5ef6970b50487cace86fb4fbdbac8d7a33e2afba).
  **Its finding in one line: a visitor who arrives can apply — nobody has.**
- **EXP-004 — public no-account surfaces: PASSED / CLOSED** (run 19). Pre-registered before any
  reading. All five criteria hold on live production at both widths
  ([run 31252271974](https://github.com/in-c0/tuned/actions/runs/31252271974)): demo link → `/ava`,
  feed 200 with **24 items** and no empty state, `/ava/rss.xml` 200 `application/rss+xml` with **38**,
  no first-party errors, no horizontal overflow. GETs only; nothing written.
- **EXP-002 — Show HN distribution smoke test: `INVALIDATED / NOT STARTED`, withdrawn 2026-08-13.**
  Authorized [13:56 UTC](https://github.com/in-c0/tuned/issues/1#issuecomment-5226414917), submitted
  **2026-08-13 00:13:23 UTC**, item `49280269` **`dead: true`**
  ([run 31654090210](https://github.com/in-c0/tuned/actions/runs/31654090210)) — and then found
  unpublishable on HN's own rules regardless (AI-written body posted as the owner's comment;
  application-gated landing page as the URL). **No t0, no window, no snapshot, no inference, no
  grade — and none will be created if the item is ever restored.** All bands unspent; the packet is
  fenced **WITHDRAWN** at [EXP-002-PACKET.md](EXP-002-PACKET.md).
- **No experiment is currently running, and none is queued.** That is the honest state of §6.

Details and grading rules: [EXPERIMENTS.md](EXPERIMENTS.md).

## 7. Latest three lessons

From [LESSONS.md](LESSONS.md), newest first. Each entry there carries the full problem → attempt →
mistake → why → evidence → lesson → next attempt → prevention check.

| # | Lesson | More elegant next attempt |
| --- | --- | --- |
| **L-25** | **A limitation restated verbatim three runs running is a decision nobody remembers making.** Runs 44, 45 and 46 each carried the same sentence forward — this executor encounters material *at result level, not page level* — and each correctly traced it to the whole commercial path: no page-level read → EXP-008 publishes nothing → A4 never clears → no channel is admissible at all. **None asked what removing it cost. It cost one spec and one workflow.** The sentence was true about the proxy and false about the loop, which has had a second network vantage since run 2 and has used it for every production statement it has ever made. Run 46 even wrote *"read from GitHub's network"* into DISTRIBUTION.md one section from recording page-level access as impossible — same commit. | The tell is the verbatim repetition: a constraint re-examined gets fresh words, a constraint copied forward has become scenery. **Carrying a limitation into a third report requires stating what removing it would cost, or stating that you have not priced it** — "blocked" and "not yet priced" are different claims. Narrow form: an environment restriction is a fact about one process, not the system; enumerate the vantages you already hold before recording a capability as unavailable. |
| **L-20** | **A log nobody can read is not an instrument.** Spotify ingestion — the only path on Tuned that currently makes items — reported every run, every failure and every capture to `console.log`, into Cloudflare's logs, which this loop holds no credentials for by design. Instrumented and unobserved at once, for its whole operating life, because a rising queue looked like health. When it stopped rising, a quiet member and a revoked token produced the identical flat line. | Ask not *does this path report what it did* but **who can read that report, and are they in this loop?** Any job that changes state on its own schedule needs one counter landing where the operator can read it without credentials they do not hold. And before trusting a derived signal, ask what a *broken* system would print: if it matches what a healthy quiet one prints, it was never an instrument. |
| **L-19** | **The surface that leaves your site is the one nobody checks.** `/:handle/rss.xml` omitted `kind` from its `SELECT`, so `creator.kind` was `undefined` in `rssFeed` and the `AI agent` branch — three lines away in `publicPage` — could never fire. Every agent feed syndicated **unlabelled**, into readers where the badge, the page and every other cue are gone. EXP-004 drove RSS and passed it: well-formed is well-formed either way. | Assert a product promise on **every** surface that reproduces the content — HTML, RSS, share/OG, API — with a test per surface that fails when it stops. When a route hand-writes its column list, check it against the renderer's branches: an omitted column does not error, it silently turns a branch off. |
| **L-18** | **A hardcoded claim about live data is a claim nobody can keep true.** The landing page headed its demo block *"Live demo — a real feed, right now"* over cards its own script stamped **"11d ago"**. It survived eleven days and **two browser QA passes** — EXP-003 and EXP-004 both drove this page and graded only whether it *rendered*. A stale page and a fresh page are structurally identical, so a suite that grades structure grades a corpse as healthy, forever, in green. | Delete the adjective and let the data speak: no branch to get wrong and no sentence that can rot. For any string containing *now/live/today/currently/active/fresh/latest*, ask **what query would falsify this, and does the page run it?** If nothing in the request path could make it false, it is a decoration. |

Older lessons, including L-08's control-plane warning and L-10's contamination rule, remain in
[LESSONS.md](LESSONS.md). L-08's forward test — *does the next run spend its cycle on demand evidence
rather than more control plane?* — is the one this run had to answer carefully: the instrument it
built exists to grade an owner action it cannot perform, and it is deliberately the smallest thing
that turns an attestation into a check.

## 8. Last materially updated and freshness

| | |
| --- | --- |
| **Last materially updated** | 2026-08-15 19:40 Sydney (2026-08-15 09:40 UTC) |
| **Run** | 44 — **the operator control plane made its first production mutation, and published nothing.** `@sportstech` adopted under the reviewer's exact public remit: **HTTP 201** (`adopted=True · source=adopted`), then one read-only `list` returning **`owner: @ava · active 1/12`**, `@sportstech [active] source=adopted public_items=11 operator_publications=0`, adoptable now `@graphics @wearables @wellbeing`. Every acceptance criterion read back from production rather than asserted. The remit ([`ops/agents/sportstech.md`](agents/sportstech.md)) and [EXP-008](EXPERIMENTS.md)'s first-publication contract were committed in [`9617bea`](https://github.com/in-c0/tuned/commit/9617bea) **before** the mutation; the publication itself is **gated** on EXP-007's first complete-day reading so nothing changes the landing surface inside that window. One documentation defect found and corrected: `ops/agents/README.md` claimed a remit is written to `creators.charter` "at adoption or creation" — false for adoption, where only `operator_agents.remit` is written, and **the code is the part that is right** ([L-22](LESSONS.md)). No agent created, no item published, no queued item touched, `items_public` still **79**; AUD $0. Previously, run 43 — **the middle of the acquisition funnel was instrumented for the first time.** Nine UTC days of 605 UA-flagged human-shaped landing views against **0** applications, with **nothing recorded in between**, so three unrelated causes were producing one indistinguishable reading. Three counters now separate them — `landing_engage`, `application_start` (page-reported, one-shot per page load, same-origin only) and `application_invalid` (server-side, a submit rejected by email validation, previously invisible because `application_submit` counts only the ones that worked). No schema change, no new table, no cookie, no identifier, no new data category, **so the privacy policy was deliberately not amended**. [EXP-007](EXPERIMENTS.md) pre-registered five exclusive forks and a validity gate **before the counters existed**; the first reading is the snapshot covering complete UTC day 08-16. `verify production` now asserts the instrument's own presence on every push — POST with no Origin must answer **403**; 404 (absent) and 204 (guard gone) are both roll-back signals. This **reverses** EXP-003's standing "not a CTA-reach counter" hold, struck rather than deleted in STATUS, on the grounds that the counter is run to *test* the crawler assumption EXP-003 made and that the known-human traffic it deferred to (EXP-002) has been owner-gated and NOT STARTED for eight days. No agent adopted, created, published or disabled; no queued item touched; AUD $0. Previously, run 42 — **the blocker narrowed, then closed, inside one run.** It began as an ops-only reconciliation: the owner's 08-14 22:24 `list` dispatch proved the GitHub secret present (it cleared the workflow's own guard) and the Worker binding absent (`error=operator key not configured`, the first check in `src/operator.ts`, which excludes mismatch, `ADMIN_KEY` collision and owner resolution), so §1 was rewritten to **Cloudflare only**. The push carrying that rewrite then triggered `verify production`, which read **401** instead of 503 at 03:42:09 — the pre-registered resumption signal, arriving naturally rather than by dispatch. One authorized read-only `action=list` followed at 03:43:10: **`HTTP 200 · owner: @ava · active 0/12`**, adoptable `@graphics @sportstech @wearables @wellbeing`. **§1 is now NONE.** Stopped there per directive — no adopt, create, publish or disable. Blocker #4's egress count also corrected to **31** in both files (they disagreed at 29/27). No source, schema, workflow, product, pricing, distribution, billing or experiment change; no queued item touched; AUD $0. Previously, run 41 — **ops-only evidence reconciliation.** The durable claim that Tuned has "one live connection with nothing to carry" was falsified by the 08-14 snapshot: ingestion ran 30×, succeeded 30×, captured **104** plays, and the private queue went **42 → 146** while `items_public` stayed at **79**. Corrected here, in STATUS and in METRICS; [EXP-006](EXPERIMENTS.md)'s original grade and timestamp preserved with the later reading filed separately. No source, schema, workflow or product change; no queued item opened or approved; no manual dispatch; §1 unchanged. Previously, run 37 — the ingestion cron, Tuned's only current producer of items, was made observable through the existing metrics path; [EXP-006](EXPERIMENTS.md) pre-registered before any reading. Graded the same run: **QUIET, NOT BROKEN** — the cron fires, the token still authenticates, and there was simply no new play to capture, so the flat `items_queued` is a true absence of supply rather than a defect (n = 1 poll; the three earlier flat days stay uninterpretable). Nothing was published, no owner card changed. Previously, run 36 — the agent publication contract was traced end to end and works; **credentials and permission are the missing prerequisites, both owner-only**, so §1 carries one card again. Agent provenance in RSS was found missing and fixed. Nothing was published |
| **Repository commit at time of writing** | [`9617bea`](https://github.com/in-c0/tuned/commit/9617bead978707864fac802c39e14c7533299e74) — confirmed by `verify production` [31877364330](https://github.com/in-c0/tuned/actions/runs/31877364330) to be the commit **actually serving**, by build stamp rather than by timing |
| **Data commit** | [`7a73982`](https://github.com/in-c0/tuned/commit/7a739827c21f9716765670f20f05fadeb1899ad3) — `generated_at` 2026-08-14T20:58:56Z, read through the public zone by the scheduled snapshot job. **This is the reading that moved:** content totals and ingestion counters in §4 come from it. The **§4 stage table still comes from [`567dad0`](https://github.com/in-c0/tuned/commit/567dad0) (08-12)** and is labelled stale in place. |
| **Freshness state** | **PARTIALLY RESYNCHRONIZED, and saying so rather than claiming FRESH.** §1, §6's EXP-008 entry and this section are current as of **run 44**; §6's EXP-007 entry as of **run 43**; §5's blocker #4 was corrected at run 42; §7 as of run 37. **§4 was deliberately not touched this run — no metric moved**, so its content totals and ingestion counters remain at the 08-14 snapshot and its **stage table** remains three days stale at the 08-12 snapshot, labelled in place. **§4 carries no row for the three counters added this run, and must not: they read zero on every day committed so far because they did not exist.** §2, §3's 1-week row and §5 are current as of run 34. **The rest of §3 was last written at run 20** and is stale. Read [STATUS.md](STATUS.md) and [MILESTONES.md](MILESTONES.md) for those. |

**What went wrong with this file, recorded because the next reader deserves it.** Between runs 20 and
26 this mirror drifted while STATUS moved, and the drift was not cosmetic: §1 spent a full day telling
the owner to publish a post pointing at a URL that was returning 403, and the header claimed the
repository was private after it had been made public. A mirror that is *sometimes* current is worse
than one that is honestly labelled stale, because it is read with the same confidence either way. Hence
the freshness row above now names which sections are current **by section**, not one word for the whole
file.

**Freshness rule, so a future reader can grade this without trusting it:** this dashboard is stale
whenever `ops/metrics/latest.json` has a newer `generated_at` than the data commit above, or `STATUS.md`
has been materially updated since. Snapshots run daily at 20:40 UTC, so a dashboard more than ~24h old
is presumed stale until re-synchronized. It is updated **only on material state change** — not every
run — and it never becomes a second source of truth.
