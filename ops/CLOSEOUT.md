<!-- tuned-closeout -->

## Tuned — final closeout report

*This is the handover for the 60-day autonomous operating loop on
[issue #1](https://github.com/in-c0/tuned/issues/1). Loop started **2026-08-06**; final autonomous
operating date **2026-10-05 Australia/Sydney**.*

**Why this text was written before the date it reports on, and posted by a run that changed nothing.**
A run firing after the final operating date is bound to make no changes — it cannot commit, claim the
run lock, or dispatch anything. So the closeout could not be *composed* then: it would have been
assembled under exactly the conditions this record spends 138 lessons warning about, by a run with no
ability to verify a single number it printed. It was therefore written and gated on **2026-10-04**
(run 218), while a run could still run the checks, and committed as
[`ops/CLOSEOUT.md`](https://github.com/in-c0/tuned/blob/master/ops/CLOSEOUT.md). The post-date run's
whole job is to post this file's contents once and stop.

**The marker on line 1 is load-bearing.** The routine's cron is `0 4,10,22 * * *` UTC and nothing in
this repository disables it, so it keeps firing after the mission ends — three times a day,
indefinitely. The standing prompt says to *"post a final closeout report"*, and `final` means once.
Any run that fires after the date searches this issue for `<!-- tuned-closeout -->`, finds it on this
comment, and posts nothing. See
[L-134](https://github.com/in-c0/tuned/blob/master/ops/LESSONS.md#l-134).

**These are not the eight execution-report headings**, deliberately. Those headings describe a run
that did work; the run that posts this did none.

---

### 1. The commercial result

**No revenue, no customer, no activated user. Gross cash: AUD $0.00.**

That is the honest headline and nothing below softens it. Every figure here is from
[`ops/metrics/latest.json`](https://github.com/in-c0/tuned/blob/master/ops/metrics/latest.json),
`totals` and `retention`, `generated_at` **2026-10-04T04:15:07.776Z** — complete through the UTC day
**2026-10-03**, the last whole day of the operating window. No number in this report is a forecast, an
estimate or a reconstruction.

| | |
| --- | --- |
| Gross cash collected | **AUD $0** |
| Applications received | **0** |
| Members | **1** — the owner |
| Members ever active (`member_days` row ever written) | **0** |
| Members returned after first day | **0** |
| Active last 7 days / last 28 days | **0 / 0** |
| Email followers | **0** |
| Stars / skips | **8 / 33** — of which **owner: 8 / 33** |
| Public published finds | **101** |
| Queued finds | **180** |
| Feeds live | **5** — 1 human, 4 agent |
| Autonomous spend | **AUD $0.00 of the AUD $500 cap** |

**Gross cash is AUD $0 because no billing exists** — the snapshot's own words, not an inference. There
is no payment provider, no price, no checkout and no Stripe reference anywhere in `src/`. Creating one
was an owner/auth boundary the whole window, and was never crossed.

**Every attention event this service has ever recorded is the owner triaging their own desk.** `stars`
is 8 and `stars_owner` is 8; `skips` is 33 and `skips_owner` is 33, with `owner_resolved` 1. The
subtraction is exact and it is zero. Non-owner activation has **never been observed**.

**The $1,000,000 / 60-day figure in the mission was optimization pressure and is reported as what it
was.** It was never forecast, never claimed as a metric, and the gap between it and AUD $0 is the
result, stated plainly.

### 2. The cohort table the record promised

[`ops/MILESTONES.md`](https://github.com/in-c0/tuned/blob/master/ops/MILESTONES.md)'s 3-month horizon
and [`ops/DASHBOARD.md`](https://github.com/in-c0/tuned/blob/master/ops/DASHBOARD.md) both commit to
*"hand over an honest cohort table at closeout"* rather than a summary. Here it is. It is honest by
being empty.

| Cohort | Members | Week-1 return | Week-4 return | Renewed |
| --- | --- | --- | --- | --- |
| All time (2026-08-06 → 2026-10-02) | **1** (owner) | **0** | **0** | **0** — no billing exists |

There is no cohort to table. `members_total` 1, `members_ever_active` 0, so the desk has never written
a `member_days` row for anybody, the owner included. **The instrument that would observe retention is
deployed and silent, not missing** — retention became computable at `feb6c4f`, when a `member_days`
table replaced an overwritten `members.last_desk_at` timestamp. It has recorded nothing since. That
distinction is the whole value of the row: the next operator does not need to build measurement, they
need arrivals.

### 3. What exists, and works, in production

`https://justtuned.com`, Cloudflare Worker `attention-feed`. Pushes to `master` build
(`npm ci && npm run check`) and deploy automatically; the most recent `verify production` run at the
time of writing — [37116713056](https://github.com/in-c0/tuned/actions/runs/37116713056) — passed
**25 of 26** assertions with one skipped. The surfaces below are real and were exercised:

- **Public feeds** — `GET /:handle`, `/:handle/rss.xml`, and a per-find page at `/:handle/:id`, in
  `sitemap.xml`. **101** published finds across 5 feeds at the stamp above. Item **298** was published
  to `@sportstech` at `2026-10-04T10:16:17.520Z`, *after* that snapshot was taken, so the live count is
  **102** — the stamped **101** plus that one publication (HTTP **201**, `duplicate=false`) — while the
  stamped table above reads **101**. Both are correct; neither is an estimate.
- **Provenance, which is the product** — every item carries its chain: observed by agent → selected by
  agent → opened / starred / shared by a human, with an `AI AGENT` badge where the commentary is
  machine-written. Nothing conceals authorship.
- **The agent publisher** — `agent-scout.yml` screens sources daily and publishes through the operator
  plane, capped at **one publication per run**. 22 publications are registered in `qa/nominations/`.
- **A quotation bar that refuses** — `selectQuotation` will publish no quote rather than a bad one;
  item 297 carries the screen's own disclosure line because every candidate sentence overran the
  252-character budget. *No quote is a reason, never an absence.* Nothing is paraphrased and nothing is
  composed about a source's content.
- **The member desk** — `GET /today`, star/skip, and following a public feed onto your own desk.
- **Application and sign-in** — `POST /api/applications`, emailed sign-in links at `/enter/:token`.
  **Note the gap:** `followers` is a table nothing reads and no code in `src/` can deliver to — there
  is no mail provider and no digest job. An email follow is an expression of intent, and the page says
  so.
- **A deep funnel instrument** — **38 distinct counter names have fired** to date (**69** counting
  per-feed and per-tag splits), carrying bot/human, on-site/off-site, referred and search axes, plus a
  per-day referring-host table. Read the `note` field in `ops/metrics/latest.json`: it is long because
  every name carries what it does **not** prove.

### 4. What was actually learned

Four findings transfer. They are the ones backed by production data rather than by argument.

1. **The product's measurement is not the bottleneck; arrival is.** The funnel is instrumented end to
   end and reads zero at the top. Fourteen workflows, 139 recorded lessons and 1,037 passing tests sit above
   a site that **no stranger has been evidenced to use**. Any next operator who starts by improving
   instrumentation is repeating this loop's most expensive mistake
   ([L-08](https://github.com/in-c0/tuned/blob/master/ops/LESSONS.md#l-08)).
2. **One arrival channel has evidence, and it is organic search.** On **2026-09-30** and **2026-10-02**
   production recorded a rendering browser reaching a find page with a `www.google.com` referrer, not
   bot-flagged — the first non-bot off-site referring host on record anywhere in this service
   ([EXP-014](https://github.com/in-c0/tuned/blob/master/ops/EXPERIMENTS.md#exp-014), VERDICT B).
   **Its window closed 2026-10-03 with all seven days graded, and the denominator is the real finding:**
   of **517** unsuffixed off-site find-page views across the window, **6** were accompanied by a render
   of the document — **1.16%**. The other **511** presented no referrer and coincided with no render,
   which is the shape of a crawl. So the off-site figure is a machine count with two browser arrivals
   inside it, and anyone reading `item_view` as traffic will be wrong by about two orders of magnitude.
   **What it is not:** the owner is not excluded, since Tuned has exactly one member and an owner who
   searches for their own site writes precisely this shape; nor is a crawler that declines to declare
   itself. Conversion on it was **zero** — no follow, no RSS click, no application, no star, no login.
   It is one rendering browser from search, on two days. It is not a visitor count and not a person
   established.
3. **This loop could ship but could not reach anyone.** The executor can perform **no write at any
   third party** — re-tested repeatedly with a byte-identical `403 CONNECT`. Every distribution act
   available to Tuned therefore required a human to paste something, and that is why the open cards in
   §6 are all one-word answers rather than tasks.
4. **An obligation nobody is obliged to read is already dropped.** This repository's single most
   repeated failure, under six separate lesson numbers
   ([L-76](https://github.com/in-c0/tuned/blob/master/ops/LESSONS.md#l-76),
   [L-97](https://github.com/in-c0/tuned/blob/master/ops/LESSONS.md#l-97),
   [L-123](https://github.com/in-c0/tuned/blob/master/ops/LESSONS.md#l-123),
   [L-126](https://github.com/in-c0/tuned/blob/master/ops/LESSONS.md#l-126),
   [L-131](https://github.com/in-c0/tuned/blob/master/ops/LESSONS.md#l-131),
   [L-133](https://github.com/in-c0/tuned/blob/master/ops/LESSONS.md#l-133)): a correct instruction
   filed where no reader is compelled to reach it does not execute. Two runs shipped eight commits
   without the run lock because the instruction sat at line 2493 of a 3,000-line file. Eight screens
   selected finds and published none because the record was an artifact no run had to open. **The fix
   was never better prose — it was moving the obligation into a file that is always loaded, and making
   a test fail when it drifts.**

**And one about this loop's own judgment, which the next operator should apply to anything else it
wrote:** on three consecutive cycles it made confident forecasts about infrastructure it could not see,
and was wrong all three times
([L-135](https://github.com/in-c0/tuned/blob/master/ops/LESSONS.md#l-135),
[L-136](https://github.com/in-c0/tuned/blob/master/ops/LESSONS.md#l-136),
[L-137](https://github.com/in-c0/tuned/blob/master/ops/LESSONS.md#l-137)). The worst of them put a card
on the owner's phone about a condition that cleared itself 47 minutes later. **Where this record states
an observation, trust it; where it predicts a machine's behaviour, re-test it.**

### 5. Milestone grades — every one on the record

| Horizon | Outcome sought | Grade |
| --- | --- | --- |
| 1 day — 2026-08-09 | the funnel is readable; one snapshot succeeds | **ACHIEVED** 2026-08-08 |
| 1 week — 2026-08-15 | first honest funnel numbers; constraint identified | **SPLIT** — condition 1 **MET**, condition 2 **MISSED** |
| 2 weeks — 2026-08-22 | a real payment path and first willingness-to-pay evidence | **MISSED** |
| 1 month — 2026-09-08 | first gross cash; activation measured | **MISSED** |
| 3 months — 2026-11-08 | a small retained paying cohort | **NOT STARTED** — past this date; the owner's to carry |
| six sub-day windows (2026-08-08) | — | **RETIRED, closed ungraded** — anchored once at run 20 and carried unchanged for ~183 runs |

The sub-day ladder is the honest entry in that table rather than the embarrassing one: five of its six
windows describe things that *did* happen, and grading them from 46 days of hindsight would have been a
reconstruction, not a reading. **Inventing a retrospective achievement and inventing a retrospective
failure are the same error**, and the record refused both.

### 6. Open owner actions at closeout — three, all one word

Full text, unabridged, lives at
[`ops/STATUS.md` § OWNER ACTION REQUIRED](https://github.com/in-c0/tuned/blob/master/ops/STATUS.md#owner-action-required).

1. **Submit `/sportstech` to `plenaryapp/awesome-rss-feeds`** — already authorized by the owner on
   2026-08-20; needs the paste, not a decision. Packet:
   [`ops/SUBMISSION-awesome-rss-feeds.md`](https://github.com/in-c0/tuned/blob/master/ops/SUBMISSION-awesome-rss-feeds.md).
   No deadline.
2. **May Tuned be suggested to `ooh.directory` at all?** — the directory accepts link blogs with
   original commentary per link; `/sportstech` meets that on its face, but **the commentary is written
   by an agent**. The page discloses it; the venue's FAQ is silent either way, and silence is not
   permission. `A` proceeds, `N` retires it permanently. Packet:
   [`ops/SUBMISSION-ooh-directory.md`](https://github.com/in-c0/tuned/blob/master/ops/SUBMISSION-ooh-directory.md).
3. **`ARM` or `QUIET` for `@sportstech`'s publishing cadence** — **this one has a deadline and it has
   now passed.** `agent-scout.yml` screens daily but publishes only when a run dispatches it with
   `publish: true`, and no run exists after 2026-10-05. **So from 2026-10-06 the publisher screens
   every day and discards every selection.** `ARM` (a one-word change at the `PUBLISH:` env line in
   `agent-scout.yml`) makes the cadence outlive the executor; leaving it is `QUIET`, and `@sportstech`
   goes dormant. **`QUIET` has happened by default, chosen by a clock rather than by the owner** —
   which is the one outcome the card existed to prevent. It is still reversible by hand at any time.
   **Note what an `ARM` costs, undisguised:** EXP-013's pre-registered quality bar for this exact
   question was **not met** (the second live screen selected 9 of 35 against a 25% ceiling), and no run
   rewrote its own failed threshold after seeing the result. An `ARM` is the owner knowingly overriding
   an unmet pre-registration. The overload risk it was reaching for is separately bounded by the hard
   one-publication-per-run cap, and `agent operator` → `retract` hides any item without deleting it.

### 7. What keeps running after this loop stops

**This is the operationally important section.** The executor stops; the machinery does not. Nothing in
this repository disables any of it.

| What | Schedule (UTC) | What it does after 2026-10-05 | How to stop it |
| --- | --- | --- | --- |
| **The executor routine** | `0 4,10,22 * * *` | Fires 3x daily forever. Each firing reads this issue, finds the marker on this comment, and **posts nothing**. | Disable the Claude Code Routine (owner's account, outside this repo) |
| `executor-liveness.yml` | `35 * * * *` | Reads the claims register hourly. Because the newest claim belongs to a cycle on or before 2026-10-05, it returns **`stood-down`** — green and quiet — instead of paging about a shutdown announced in advance. | Disable the workflow |
| `agent-scout.yml` | `40 2 * * *` | Screens daily and **discards every selection**, unless card 3 is armed. | Disable the workflow, or arm it |
| `deploy-staleness.yml` | `5 * * * *` | Alarms once per outage if `master` stops deploying. **Its real detection latency is ~5h, not 90 minutes** — its hourly cron delivered **zero of five** firings during a genuine 6h16m outage. | Disable the workflow |
| `metrics-snapshot.yml` | `40 20 * * *`, `15 0 * * *` | Keeps committing snapshots to `master` twice daily. | Disable the workflow |
| `verify-production.yml` | `20 20 * * *` | Daily production health check; **writes 2 bot-flagged referred requests per run** to a find page, which is why `item_view_search_bot` is a liveness signal and never an arrival. | Disable the workflow |
| Cloudflare Workers Builds | on push | Deploys every push to `master`. | Disconnect in the Cloudflare dashboard |

**The stand-down and "post once" are one mechanism, and either half alone makes things worse.** Without
the stand-down verdict, posting once converts three comments a day into an hourly red job and a
permanent false `stale` alarm. Without "post once", the watchdog stays green by being fed claims from
runs whose only output is a duplicate comment. **A post-date run therefore claims nothing** — keeping
the register fresh is precisely what would prevent the stand-down verdict.
[L-134](https://github.com/in-c0/tuned/blob/master/ops/LESSONS.md#l-134).

**One experiment window outlives the reading that would grade it.** EXP-012 (would an `ooh.directory`
listing produce visible arrivals?) reads 14 complete UTC days after a submission, so any `A` on card 2
puts its reading past this date. Its pre-commitment stands as written for whoever grades it.

### 8. If someone picks Tuned up

In order, and the order is the finding:

1. **Do not improve the instrumentation.** It is adequate and it reads zero at the top. Rule 7 of
   [`ops/NORTH_STAR.md`](https://github.com/in-c0/tuned/blob/master/ops/NORTH_STAR.md).
2. **Get one stranger to a find page and watch what they do.** Search is the one channel with any
   evidence (§4.2). Two of the three open cards are distribution pastes that take two minutes.
3. **Only then build billing.** There is no price, no provider and no checkout — and with 0
   applications and 0 activated members, a payment path would be measuring nothing.
4. **Keep the doctrine.** Humans contribute **attention, not content**; provenance is explicit; notes
   are never required. Tuned is not a summarizer, not a content generator, not an enterprise
   agent-observability dashboard. The record is unanimous that the doctrine was never the problem.

### 9. Where the record lives

Canonical: [`ops/DECISIONS.md`](https://github.com/in-c0/tuned/blob/master/ops/DECISIONS.md) ·
[`ops/EXPERIMENTS.md`](https://github.com/in-c0/tuned/blob/master/ops/EXPERIMENTS.md) ·
[`ops/METRICS.md`](https://github.com/in-c0/tuned/blob/master/ops/METRICS.md) ·
[`ops/LESSONS.md`](https://github.com/in-c0/tuned/blob/master/ops/LESSONS.md) (138 lessons) ·
[`ops/MILESTONES.md`](https://github.com/in-c0/tuned/blob/master/ops/MILESTONES.md) ·
[`ops/STATUS.md`](https://github.com/in-c0/tuned/blob/master/ops/STATUS.md).
[`ops/DASHBOARD.md`](https://github.com/in-c0/tuned/blob/master/ops/DASHBOARD.md) mirrors them for the
owner and **is never a source of truth**. The owner's original strategy brief is preserved verbatim at
[`ops/BRIEF-2026-08-06.md`](https://github.com/in-c0/tuned/blob/master/ops/BRIEF-2026-08-06.md).
Every execution report of the window is in this issue's comment history.

---

**The loop ran its full 60 days, shipped under gates every time, and never once published a number it
could not source. It also never found a user or a dollar.** Both halves of that sentence are the
result, and the second half is the one that matters.
