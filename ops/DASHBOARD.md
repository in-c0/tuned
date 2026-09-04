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

> # **Still nothing for you to do. We found a measurement due Wednesday that was resting on something that does not exist, and caught it before the number landed.**
>
> **[§1](#1-owner-action-required) is NONE** and stays NONE. This run changed no product behaviour,
> published nothing, submitted nothing and spent nothing.
>
> **What happened.** Wednesday's scheduled measurement asks a simple question: *does the counter on
> `@sportstech`'s RSS feed actually work?* Its rule said that if the counter reads zero for seven days
> straight, the counter must be broken — **because our own automated checks fetch that feed on a
> timer, so it can never legitimately be zero.**
>
> **We do not have that timer.** The checks that fetch every feed only run when someone presses the
> button, deliberately so — it is written into the workflow, with the reason. The two things that
> genuinely run on a schedule each fetch exactly **one** feed, and it is `@ava`'s, not `@sportstech`'s.
>
> **Said plainly, and against our own interest: this costs us nothing on Wednesday.** The counter has
> already written on three days inside the window, so the measurement lands on *"the counter works"*
> whatever else happens, and the find does not change its answer. What it prevents is the other branch:
> a quiet week would have had us declare a perfectly healthy counter broken, and shut down a
> distribution route on the strength of it. That was not far off: of the five days with data, **two
> would have read zero if one button-press had not happened, and one already read zero**.
>
> **What we did about it.** Corrected the wrong description everywhere it is actually published,
> including on the live site. Wrote down, *before Wednesday's number exists*, that the "seven days of
> silence" branch may not be used. **We deliberately did not add the missing timer** — switching it on
> now would make Wednesday's number true by construction, which is the same as not measuring at all.
> It goes in after the reading, not before.
>
> **Previously (run 83, 2026-08-24 19:45 Sydney).**

> # **The window closed at 19:35 tonight. There is nothing for you to do, and nothing broke.**
>
> **[§1](#1-owner-action-required) is NONE.** The submission the last four days' card asked for needed
> `@sportstech` to have published something in the previous 72 hours. That ran out **2026-08-24 19:35
> Sydney (09:35:56 UTC)**, so the ask is retired rather than repeated — asking you to do a thing that
> is no longer admissible would be worse than saying it lapsed.
>
> **Your "A" is preserved. It was not withdrawn and it will not be re-asked.** You settled whether the
> executor may put a factual entry about your feed in front of a directory in your name; that answer
> stands and carries forward. What expired is a precondition, not your permission.
>
> **The candidate is paused, not dropped.** `plenaryapp/awesome-rss-feeds` stays in the register with
> every condition it can hold still held. It resumes the first time `@sportstech` publishes a find
> that is worth publishing on its own merits — which is not scheduled and may be days.
>
> **Nothing was published to keep the window open, and that was deliberate.** Publishing something in
> order to make a number look right is disqualified by this loop's own rules, and this is the **second**
> window it has let lapse rather than break them (the first was Friday afternoon).
>
> **What must not be read into this:** nothing about whether anyone wants Tuned. No submission was ever
> made, so no directory, maintainer or stranger has told us anything. The measurement that *is* due
> needs nobody's permission — [EXP-009](EXPERIMENTS.md) Reading 1 on **2026-08-26**, asking only whether
> the RSS counter writes in production at all.
>
> **If you would still like to open the issue** — you may, any time, and the full instructions are kept
> intact in [§1](#1-owner-action-required). Just tell the loop, so freshness can be re-read from
> production first; **it does not hold right now**.
>
> **This headline said *"There is nothing for you to do"* while [STATUS.md](STATUS.md) and the rest of
> this file said a decision was outstanding.** Written at run 49 on 2026-08-17, false from **2026-08-19
> 04:30 UTC** — the moment the decision was first asked — so **~29 hours wrong**, on top of §1's card
> below reading `NONE` since run 42 on 2026-08-15. That was a real defect in the mirror, not a wording
> choice, and it is the whole substance of run 59 — recorded here rather than quietly overwritten.
>
> **Previously here (run 49, 2026-08-17 14:40 Sydney).** **Tomorrow morning's number
> arrives, and this afternoon we caught a rule that would have thrown it away.**
>
> Since Saturday the loop has been waiting on one measurement: of the ~44 apparent visitors a day to
> the landing page, is *anybody* actually a person? A counter went in that fires the moment a real
> hand touches the page. It reads for the first time tonight at **06:40 Sydney tomorrow**.
>
> The rule guarding it said: *if that counter reads zero, the counter is broken — go fix it.* That is
> right half the time. A zero has **two** meanings, and they are opposites: *the counter is broken*,
> or **the counter works fine and not one visitor was a person all day**. The second one is the
> answer we have been waiting a week for — and the rule as written would have sent us off to repair a
> working counter and bin the result.
>
> **It is fixed, and the timing is the whole point.** The honest window to fix it was after the day
> being measured ended (10:00 Sydney this morning) and before the number lands (06:40 tomorrow) —
> about twenty hours, once. The fix is written down *before* the number exists, along with the
> evidence that tells the two meanings apart: the counter's code has not changed a byte all week, and
> the same live browser test that passed before the measured day was run again after it. Both sides
> check out.
>
> **Said plainly, against our own interest:** we can already see most of yesterday — the counter read
> zero for about 86% of the day — so this was not written completely blind, and it is recorded that
> way rather than dressed up. It also makes "nobody real is arriving" a conclusion we are now allowed
> to reach. That is not a conclusion yet. It is a number due tomorrow morning.
>
> **Previously (run 46, 2026-08-16 08:30 Sydney).** **We have been working on the
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
> **Update (run 48, 2026-08-16 20:20 Sydney).** **That counting problem is fixed, and it had to be
> fixed today rather than later.** Tuned can now tell *which* feed a visitor arrived at, and whether
> they came from a link we posted somewhere — neither of which it could do this morning. Live and
> checked on the real site.
>
> **Why not wait until we actually have somewhere to post?** Because these counters only start
> counting from the moment they exist, and there is no way to fill in the past. If we had posted first
> and counted second, the first attempt would have produced no usable answer — and something like a
> Show HN can only be spent once. Two earlier runs put this off waiting for a channel to be picked;
> that was the wrong call, and it is written up so it does not recur.
>
> **What has *not* changed: we still have nowhere to point anyone.** The feeds are still stale — that
> is unchanged and it is still the thing that matters. Knowing how to count visitors does not give us
> a reason for them to come. **Nothing was posted anywhere, and no channel is any closer to being
> authorized.**
>
> **Nothing you need to do, and nothing on the landing page moved** — Sunday's measurement is still
> running undisturbed and reads tomorrow. Applications still **0**, cash still **AUD $0** because no
> billing exists, spend still **AUD $0.00 of $500**.
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

**Mirror of [STATUS.md § OWNER ACTION REQUIRED](STATUS.md#owner-action-required). If the two
disagree, STATUS is right.**

### **NONE.**

**Retired 2026-08-31 04:14:13 UTC = 14:14:13 Sydney (run 123), on the card's own clock, unanswered.**
The submission needed **A4** — `/sportstech`'s newest public item ≤ 72h — and that window closed at
exactly that instant (item **248**, `2026-08-28T04:14:13.569Z`). **Nothing for you to do.**

| | |
| --- | --- |
| **What is preserved** | **Your `A` (2026-08-20 15:04 UTC) stands**, and so does your [03:36 UTC clarification](https://github.com/in-c0/tuned/issues/1#issuecomment-5404749737). What expired is a **precondition**, not the authority. Nothing is being re-asked. |
| **What is paused** | The `plenaryapp/awesome-rss-feeds` submission — **paused, not dropped.** You never said **C**, and an unanswered card is not a decision. It resumes when a find worth publishing on its own merits restores A4; that is not scheduled. |
| **What was not done** | **Nothing was published to hold the window open.** [EXP-008](EXPERIMENTS.md)'s binding clauses forbid publishing to move a number. **No second notification was sent** — run 121's was the only one. **Fourth window to lapse unused** (21 Aug, 24 Aug, 27 Aug, 31 Aug). |
| **How this was checked** | I waited out the window rather than retiring the card early: this cycle fired at `04:04:53Z`, **9 minutes inside** it, and held. Re-read at `04:16:00Z` — issue #1 unchanged at **230 comments**, no venue URL from you or anyone. |
| **What may not be concluded** | **Nothing about demand.** [EXP-009](EXPERIMENTS.md) Reading 2 has no `t0` and stays **Fork D / PENDING — inadmissible, not a null.** Four lapsed windows are a fact about my access and schedule, not about whether anyone wants Tuned. Commercial readings **zero**; spend **AUD $0.00 of $500**. |
| **If you still want it** | Open the issue any time — the card below is kept intact — but **A4 must be re-read from production first** and does not currently hold. No clock, no penalty, no ask. |

---

**Kept below, and no longer live — the card as written at run 107. Its A4 row and its clock are expired.**

### **ACTION REQUIRED · HIGH — one issue at a public GitHub repo, about two minutes. It's the only thing left between Tuned and its first real audience.** *(RETIRED 2026-08-31 04:14:13 UTC — A4 lapsed unused)*

**Opened 2026-08-28 19:35 Sydney (09:35 UTC).** You already said yes to this on **20 August**. I have
never been able to do it, and I still can't — **not because anything is wrong with the submission, but
because my GitHub access is scoped to `in-c0/tuned` and the venue is someone else's repository.** I
re-tested that this morning and got the same refusal as eight days ago.

**Everything else is checked and green, this morning, from production:**

| | |
| --- | --- |
| **What to do** | Open **one** issue at [`plenaryapp/awesome-rss-feeds`](https://github.com/plenaryapp/awesome-rss-feeds) using its *add new feeds* template. Three fields: **Category `Sports`**; **Feed URL** = the route **`/sportstech/rss.xml`** on **`justtuned.com`** with the `?src=` tag **`awesome-rss-feeds`** — please join those two yourself when you paste, since anything that fetches the joined link moves the very counter I'm going to measure; **Podcast: `No`**. Then paste the issue URL on [issue #1](https://github.com/in-c0/tuned/issues/1). That's all — no body text to write, nothing to follow up. |
| **Why it's worth two minutes** | It is **the first time Tuned's feed would be put in front of strangers.** 22 days, 107 runs, **0 applications, 0 active members, 0 followers, $0**. I can keep improving the product indefinitely and none of those numbers can move, because nobody has ever been shown it. |
| **Checked before asking** | **Freshness ✅ 5.3 hours old** — the feed published a new find this morning, so it isn't a dead link ([evidence](https://github.com/in-c0/tuned/actions/runs/33159736495)). **No duplicate ✅** — I searched the venue's open *and* closed issues at 09:32 UTC; **zero results** for `justtuned` ([evidence](https://github.com/in-c0/tuned/actions/runs/33159738434)). Their rules permit this submission. |
| **The clock** | **Closes Monday 2026-08-31, 14:14 Sydney.** After that the feed counts as stale for directory purposes and it's inadmissible again until some future find happens to restore it. **Three earlier windows already lapsed** — on 21 Aug, 24 Aug and 27 Aug — largely because this card kept quietly retiring itself before you saw it. That's my defect, and it's written up. |
| **If you'd rather not** | Say so on issue #1 and I'll close it out honestly as *inadmissible, never tested* rather than let it lapse silently a fourth time. **A fourth lapse is an acceptable outcome** — I will not publish anything just to hold the window open. |
| **Second remedy, if you prefer** | Start a Claude session with **`plenaryapp/awesome-rss-feeds` as an initial source** and I'll submit from it. The refusal message names this route. **I did not do this myself on purpose** — spinning up a second session to get around my own access scope is exactly the kind of shortcut I shouldn't take. |
| **What this does not mean** | **Nothing about demand, either way.** Three lapsed windows say something about my access, not about whether anyone wants Tuned. Commercial readings **zero**; spend **AUD $0.00 of $500**. |

---

**Superseded — the run-105 card, kept as history.**

### **NONE — please ignore the alert you may have just received. Deploys are working again and there is nothing for you to do.**

**Cleared 2026-08-28 13:55 Sydney (03:55 UTC).** I raised a HIGH card and alerted you at 13:47 Sydney
about deploys being stuck for ~6 hours. **Minutes later it fixed itself**, and I sent a stand-down at
13:55. **The Cloudflare dashboard check I asked for is no longer needed.**

| | |
| --- | --- |
| **What happened** | The commit carrying that card ([`b5e58f6`](https://github.com/in-c0/tuned/commit/b5e58f6), pushed 03:41:44Z) **deployed normally — green in 54 seconds.** The check is a strict one: it waits until `/api/version` reports **that exact commit** is the one serving, so this is a real deploy, not a guess from timing. |
| **Where that leaves things** | **Everything is live.** The whole ~6-hour backlog shipped with it. Nothing is blocked, nothing was lost, and **you took no action** — no setting was changed by anyone. |
| **The honest caveat** | **I don't know why it stalled, or why it cleared.** A fault that fixes itself without explanation **can come back**, and it will look the same from my side: checks green, site healthy, build silently stale. If you ever want the answer, the Builds page would still have it — **but that's curiosity now, not a task.** |
| **Two alerts, one subject** | You got an alert and then a retraction ~8 minutes apart. That's on me: the watcher I set up to catch this exact outcome was broken and stayed silent, so I escalated on the assumption the push had failed too. Fixed in the record; the sequencing rule is written down. |
| **Unchanged** | Commercial readings **zero**. Spend **AUD $0.00 of $500**. |

---

**Kept below, and no longer live — the card exactly as written at 13:36 Sydney, before it cleared.**

### **ACTION REQUIRED · HIGH — read one Cloudflare page and paste what it says. ~2 minutes. No spend, nothing to install, nothing to change.** *(CLEARED 2026-08-28 03:55 UTC — no action needed)*

**Opened run 105, 2026-08-28 13:36 Sydney (03:36 UTC).** **Your site is fine — this is not an outage.**
`justtuned.com` returns HTTP 200 on every probe. What is stuck is the **build**: production has been
serving the same commit (`7983146`) for **23h52m**, and **nothing we ship can reach users until this
clears.**

| | |
| --- | --- |
| **What is blocked** | **Every deployment.** Seven consecutive commits pushed to `master` passed all repository checks and **none became live** — eight straight `verify production` failures between `2026-08-27T21:44:36Z` and `22:31:40Z`. Last successful deploy: `2026-08-27T03:43:41Z`. |
| **Why only you can do it** | The answer is on the **Cloudflare dashboard**, and this executor holds **no Cloudflare credential — by design** (the Git pipeline exists so it never does). Its only other route, direct egress to `justtuned.com`, is blocked at the proxy (403, re-tested this run). Repository-side checks are **green on all seven commits**, so the build command is not the fault and there is nothing further to test from here. |
| **Exactly what to do (~2 min)** | **Cloudflare Dashboard → Workers & Pages → `attention-feed` → Settings → Builds.** Then post on [issue #1](https://github.com/in-c0/tuned/issues/1): **(a)** is the Git connection still connected, and to which repo/branch; **(b)** the latest build's **time and status** (queued / building / failed / none); **(c)** its **error or a log link or screenshot**. **Read and paste only — please don't reconnect, re-authorize or retry a build first**; changing state before it is read destroys the evidence that identifies the cause. |
| **How we'll know it's fixed** | A normal push to `master` **deploys that exact commit** and `verify production` goes green. Nothing else counts — no empty commit or re-run will be used to manufacture it. |
| **Age** | **5h51m** at opening. Build staleness: **23h52m**. |
| **Where this was already raised** | Escalated **once** out of band at **2026-08-27 22:20 UTC**, and deliberately **not repeated**. On issue #1 it appears in the run 103 report, the run 104 addendum, and the 2026-08-28 03:34 UTC reviewer directive that ordered this card. **This is the first time it has had a card of its own** — until now it lived in report prose, which is why this section still said NONE. |
| **What we are not doing** | **No rollback** (the live build *is* the rollback target, and every undeployed change is Markdown the site does not serve), no empty kick commit, no further workflow dispatches, no distribution work, no second alert, and **no changes to your Cloudflare settings**. |
| **What this does not mean** | **Nothing about demand, and nothing about the site being down.** Commercial readings are unchanged and remain **zero**. Spend: **AUD $0.00 of $500**. |

**One honest limit:** production was **last read at `2026-08-27T22:31:40Z`**. No fresh probe was taken
this run — the directive that ordered this card also stopped further dispatches, and direct egress is
blocked — so *"still serving `7983146`"* is a 5-hour-old reading carried forward, not a fresh
observation.

---

**Kept below, and no longer live — the retirement notice from run 103/104. It remains correct about
the submission it retired.**

### **NONE.** *(superseded 2026-08-28 03:36 UTC by the card above)*

**Retired 2026-08-27 21:43:45 UTC = 2026-08-28 07:43:45 Sydney (run 103), on the card's own clock,
unanswered.** The submission needed **A4** — `/sportstech`'s newest public item ≤ 72h — and that window
closed at exactly that instant (item **247**, `2026-08-24T21:43:45.078Z`). **Nothing for you to do.**

| | |
| --- | --- |
| **What is preserved** | **Your `A` (2026-08-20 15:04 UTC) stands**, and so does your [03:36 UTC clarification](https://github.com/in-c0/tuned/issues/1#issuecomment-5404749737). What expired is a **precondition**, not the authority. Nothing is being re-asked. |
| **What is paused** | The `plenaryapp/awesome-rss-feeds` submission — **paused, not dropped.** You never said **C**, and an unanswered card is not a decision. It resumes when a find worth publishing on its own merits restores A4; that is not scheduled. |
| **What was not done** | **Nothing was published to hold the window open.** [EXP-008](EXPERIMENTS.md)'s binding clauses forbid publishing to move a number. **No second notification was sent** — run 100's was the only one. Third window to lapse unused (2026-08-21, 2026-08-24, 2026-08-27). |
| **What may not be concluded** | **Nothing about demand.** [EXP-009](EXPERIMENTS.md) Reading 2 has no `t0` and stays **Fork D / PENDING — inadmissible, not a null.** A lapsed window is a fact about this loop's schedule, not about strangers. |
| **If you still want it** | Open the issue any time — the card below is kept intact. ~~**A4 must be re-read from production first** and does not currently hold.~~ **Updated 2026-08-28 14:14 Sydney (run 106): A4 holds again until 2026-08-31 14:14 Sydney**, restored by **item 248** — a peer-reviewed hammer-throw IMU study that cleared the remit on its own, with the case against it committed 50 seconds before it went out. It was read from production, not carried forward. Still **no clock, no penalty, no ask** — the fourth window may lapse unused like the first three, and that is fine. |

---

**Kept below, and no longer live — the card as written at run 87. Its A4 row is expired.**

### **ACTION REQUIRED · MEDIUM — one directory submission. ~2 minutes. Expires 2026-08-28 07:43 Sydney.** *(RETIRED 2026-08-27 21:43:45 UTC — A4 lapsed unused)*

**Was live as of 2026-08-25 (run 87), on a freshness reading taken from production that run** —
[agent operator 32805757838](https://github.com/in-c0/tuned/actions/runs/32805757838) at
`2026-08-25T03:35:42Z`: item **247**, `last_public_item_at=2026-08-24T21:43:45.078Z`, **5.9h old**,
**~66h of window left**.

| | |
| --- | --- |
| **What you do** | Open **one** issue at [`plenaryapp/awesome-rss-feeds`](https://github.com/plenaryapp/awesome-rss-feeds/issues/new) from its *add a feed* template: **Category `Sports`** · **Feed = the route `/sportstech/rss.xml` on `justtuned.com` carrying the `?src=` tag `awesome-rss-feeds`** · **Podcast `No`**. Paste the resulting issue URL on [issue #1](https://github.com/in-c0/tuned/issues/1). Per [L-36](LESSONS.md) the joined string is not printed here — join the route and the tag yourself. |
| **What it unblocks** | **The first measurable external distribution test in Tuned's history.** Every arrival number so far is unattributed; this is the first act that puts a known origin on the other end of a fetch. |
| **Why it needs you** | **Session scope — not authority, and not a missing account. Corrected at run 88.** Your **A** (2026-08-20 15:04 UTC) stands, and your [03:36 UTC clarification](https://github.com/in-c0/tuned/issues/1#issuecomment-5404749737) settled authority a second time; neither is the blocker. The executor is authenticated as **`in-c0` — your own GitHub account** (`get_me`, run 88), which *can* open an issue at any public repo. **This Claude session's repository allowlist** filters every call to `in-c0/tuned` first, and cannot be widened from inside. Owner-controlled configuration, not an unfixable fact — see [L-48](LESSONS.md) and the two remedies in [STATUS](STATUS.md#owner-action-required). |
| **Clock** | **A4 expires `2026-08-27T21:43:45Z` = 2026-08-28 07:43 Sydney, Friday.** No penalty for missing it; the candidate just pauses again until a find worth publishing on its own merits restores freshness, which is not scheduled. |
| **Blocker age** | From **`2026-08-24T21:43:45.078Z`**, the instant item 247 made the act admissible again. Last surfaced in the [2026-08-25 03:36:14 UTC owner clarification](https://github.com/in-c0/tuned/issues/1#issuecomment-5404749737), which told the executor to submit directly — **run 88 tried and could not**, so this card is the answer to it. |
| **Second remedy, if you prefer** | Start a Claude session with **`plenaryapp/awesome-rss-feeds` as an initial source** and the executor submits from it. The `add_repo` refusal names this route. Costs a session start rather than two minutes of form-filling — only worth it if you want the executor to hold this class of action generally. **A child session was *not* spawned from here: that is boundary-shopping.** |
| **If you would rather not** | **B** or **C** on issue #1 — both still free. **C** closes [EXP-009](EXPERIMENTS.md) at **Fork D: inadmissible, not null.** An unanswered card is not a decision and will lapse again. |
| **What may not be concluded** | Anything about demand. Nothing has been submitted, so [EXP-009](EXPERIMENTS.md) Reading 2 still has no `t0` and is **not graded**. |

**One caveat you may as well know about.** The reviewer directive that re-opened this card printed the
**joined tagged feed URL publicly** on issue #1 at `2026-08-25T03:33:11Z` — the thing
[L-36](LESSONS.md) exists to stop. So `arrival_fetch:awesome-rss-feeds` can now be written by readers
of that issue before any submission exists. It has never read non-zero, so the baseline is clean up to
that instant, and the split is registered in [METRICS.md](METRICS.md) before the number exists.
**It does not block the submission and is not a reason to wait.**

---

**Kept below — the original card as written at run 61 and narrowed at run 62.** Its **A-1 / B / C**
options are the live choices; **its A4 row is stale**, read the freshness reading above instead.

### **ONE SUBMISSION. No credential to install, no spend. ~2 minutes.** *(SUPERSEDED 2026-08-25 — see the live card above)*

> **You answered A at 2026-08-20 15:04 UTC. It is granted and stands.** What changed is that the
> executor found it cannot carry A out: **its GitHub access is scoped to `in-c0/tuned` and it holds no
> identity at [`plenaryapp/awesome-rss-feeds`](https://github.com/plenaryapp/awesome-rss-feeds)**, so it
> cannot open an issue there. Checked three ways this run — the repository read returned *"Access
> denied … Allowed repositories: `in-c0/tuned`"*, the session's repo-attach refused *"cross-tier adds
> are not supported"*, and no cross-repository token exists among the configured secrets. **That is a
> credential boundary, which is a mandatory stop and is never routed around.**

**The preflight is complete and current — this is the part with the clock on it:**

| Precondition | Reading | Source |
| --- | --- | --- |
| Feed is fresh (≤72h) | **0.0h ✅**, newest item `2026-08-21T09:35:56Z` — **item 246, published this run.** **Lapses 19:35 Sydney, Monday 2026-08-24.** | [32468714667](https://github.com/in-c0/tuned/actions/runs/32468714667) |
| Not a duplicate | **Clear ✅ as of 2026-08-20 21:38 UTC** — no issue at the venue mentioned `justtuned`, and neither did its README. **Not re-read today.** | [32420411861](https://github.com/in-c0/tuned/actions/runs/32420411861) · [32420571372](https://github.com/in-c0/tuned/actions/runs/32420571372) |
| Everything else | A1 partial · A2 ✅ (**your A**) · A3 ✅ · A5 ✅ | [DISTRIBUTION.md](DISTRIBUTION.md) |

| | Response | What happens next |
| --- | --- | --- |
| **A-1** | **"I'll open the issue."** *(recommended)* | You open one issue from the venue's template: category **`Sports`**, feed = route **`/sportstech/rss.xml`** on `justtuned.com` with **`?src=` tag `awesome-rss-feeds`** (joined when you paste, per [L-36](LESSONS.md)), not a podcast. Paste the resulting URL on [issue #1](https://github.com/in-c0/tuned/issues/1) and the executor records t0 and grades [EXP-009](EXPERIMENTS.md) from there. **This is the only option that produces a link anyone can check later.** |
| **A-2** | ~~**"Use the Google form instead."**~~ **WITHDRAWN run 62.** | It claimed *"the executor can submit it unaided the moment you say so."* **That was false.** The form is open to an anonymous *human*; this executor has **no instrument that can submit a form to anyone** — egress **403 to every host including `docs.google.com`**, and one GET-only external reader with no form-filling or POST in it. **Nothing is lost:** A-2 was already the weaker option, since a form leaves no receipt and no link. |
| **B** | **"Build the thing that can submit."** *(new, not recommended)* | Reviving A-2 needs a **new instrument that writes to other people's websites** — a capability, not a permission, and one this loop has never had. Listed only so the withdrawal is not read as the door closing. The executor is **not** asking for it. |
| **C** | **"Drop the candidate."** | Still costs nothing at any hour. The venue leaves the register and EXP-009 closes at **Fork D — inadmissible, not null**. |

| | |
| --- | --- |
| **Severity** | **Blocking the loop's single objective, and on a clock.** Nothing is at risk and nothing breaks, but the freshness condition lapses **2026-08-24 09:35:56 UTC, 19:35 Sydney Monday** (the earlier window lapsed unused at 2026-08-21 04:15:49 UTC and run 65's item 246 reopened it); after that the submission waits on the next find genuinely worth publishing, which is not scheduled. **No penalty for missing it**, and the executor will publish nothing to hold it open. |
| **Blocked outcome** | The first channel of **known-human traffic** in Tuned's history. Blocker #1 — *no arrival is known to be human* ([§5](#5-blockers-ordered-by-leverage)) — now has **every admissibility condition satisfied**. What is left is not a condition; it is an account the executor does not have. |
| **Why it needs you** | Not authorship — you settled that. **Access, and now capability.** Posting at a third party's repository needs an identity there, and the executor has one only at `in-c0/tuned`. **Run 62 adds the wider fact:** it holds no instrument that can write to *any* third party, so no venue and no form changes this. |
| **Exact minimum action** | **A-1:** open the issue, paste its URL on issue #1. **B or C:** one comment saying so. No credential to install, no spend. |
| **Observable success check** | A `plenaryapp/awesome-rss-feeds` issue URL posted on issue #1, or a comment naming **B** or **C**. **This card is removed the run after one of those exists.** |
| **Blocker age** | **Opened run 61 (2026-08-20 21:55 UTC).** The authorship question that preceded it is **closed** — asked 2026-08-19 04:30 UTC, answered 2026-08-20 15:04 UTC, age ~35 hours. **Run 62 narrowed the card** by withdrawing one unperformable option rather than restating it. |
| **Where surfaced** | This card, [STATUS.md's canonical card](STATUS.md#owner-action-required), blocker #1, STATUS's Next action, [DISTRIBUTION.md](DISTRIBUTION.md), and run 61's report on [issue #1](https://github.com/in-c0/tuned/issues/1). |

**One thing that changed about the decision, worth a sentence before you answer.** Run 58 registered
EXP-010: a tagged link cannot on its own tell a directory's readers from anyone who assembled the URL
from this loop's public source, because nothing this loop holds is private. EXP-010 measures how big
that problem is by **2026-09-04**. **That is not a reason to wait** — whether the submission is
allowed at all does not depend on it — but a submission made before then gets read against a
comparison that does not exist yet.

**`ooh.directory` is unaffected and still not ready.** The second directory wants the feed's **web
page** rather than its RSS file, and its arrival counter is not wired up, so it would not be submitted
today under any answer. **Only `awesome-rss-feeds` is ready.**

**Why the executor did not just use the form, since your A allowed it.** Two reasons from this loop's
own rules rather than from caution. The standing reviewer directive says that when a precondition
fails — naming *"authentication fails"* explicitly — the executor makes no submission and records the
exact failure instead of finding another way. And a form leaves **no artifact anyone can point at**,
which would make a silent result unfalsifiable: *"the maintainer declined"* and *"the form never
arrived"* would look identical forever. A channel worth testing is worth testing in a way that can come
back negative and be believed. **If you would rather have the attempt than the receipt, say A-2 and it
goes out.**

**Nothing was sent to your phone or inbox this run**, and none is claimed — that channel is not
authorized, and this card plus [issue #1](https://github.com/in-c0/tuned/issues/1) are the whole ask.

---

**Previously here, and closed — the `AGENT_OPERATOR_KEY` card.**

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

**Nothing on this plane is yours to decide — and two sentences here were stale, corrected rather than
deleted.** This said the first agent still needed authorizing and that none of the four owned feeds had
been touched. Both were written at run 42: run 44 adopted **`@sportstech`** under the reviewer's public
remit and run 52 published its first source-linked find, so adoptable today is **`@graphics`,
`@wearables`, `@wellbeing`** — three, not four. A *further* agent needs a reviewer authorization plus a
public remit committed to [`ops/agents/`](agents/), and a pre-registration of what a working agent feed
must show before any number is read off it. If you ever want it switched off, `disable` is one dispatch and
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

**Underneath, the real blocker is unchanged — and since run 55 it *is* yours:** 0 applications against
431 UA-flagged human-shaped landing views, so no arrival is known to be human. The Hacker News channel
meant to fix that was withdrawn as inadmissible; a different candidate was found, its rules read, and
its counter built and verified in production. **The one condition left on it is the A/B/C decision at
the top of this section.** This paragraph said *"not yours right now"* for five runs after that stopped
being true.

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
| 1 | **[Run 83, 2026-08-24 09:35:56 UTC: A4 lapsed and the candidate is PAUSED, not dropped.** The submission below reached every admissibility condition and was never made — the executor holds no account at the venue and the owner did not open the issue inside the window. **`A` is preserved**, §1 is **NONE**, and it resumes when a find worth publishing on its own merits restores freshness. **No demand inference; [EXP-009](EXPERIMENTS.md) Reading 2 is not graded.]** **No arrival is known to be human.** EXP-003 proved the apply path works in production, so the zero is not explainable by a broken form — the denominator is the problem. **431** UA-flagged views on a product never posted anywhere is most likely crawler traffic. **The Hacker News channel meant to fix this was withdrawn as inadmissible on 2026-08-13** (see #3). **Runs 55–56 replaced it and closed every condition the executor controls:** `plenaryapp/awesome-rss-feeds` permits the post on its published rules, and the arrival counter for the exact URL was built and verified against the deployed build. **The single remaining condition is the owner's A/B/C answer — see [§1](#1-owner-action-required).** This row said *"no owner step"* for five runs after that stopped being true; corrected run 59. | **Owner decides — A/B/C on [issue #1](https://github.com/in-c0/tuned/issues/1)** | AUD $0 | **Open. Top blocker, and one word from testable.** Opened 2026-08-19 04:30 UTC, unanswered across runs 55–58. See §1. |
| 2 | **No payment path.** No provider account exists, so gross cash is structurally $0 regardless of demand. | Owner — account creation | unknown | Not started; **not yet blocking** — no demand to collect. |
| 3 | **EXP-002 authored, authorized, submitted, killed — and then withdrawn as inadmissible.** Run 34 found it unpublishable on HN's own rules whatever moderation said: AI-written body to be posted as the owner's own comment, application-gated landing page as the URL. Eleven runs verified its *claims* and none asked whether the venue permits that form by that author. | Closed — no owner action | AUD $0 | **Closed unperformed.** Packet fenced WITHDRAWN; EXP-002 `INVALIDATED / NOT STARTED`; checker retired. [L-17](LESSONS.md). |
| 5 | ~~**The operator plane cannot retract a publication.**~~ **Opened run 52 and closed run 53, same day (2026-08-18).** `retract`/`restore` ship in [`91f84d6`](https://github.com/in-c0/tuned/commit/91f84d6) and were exercised on item 242 in production and reversed exactly. Neither deletes; `restore` refuses to reverse a hide the **owner** made. [L-32](LESSONS.md). | — | AUD $0 | **Closed.** Full evidence in [STATUS.md](STATUS.md) and [DECISIONS.md](DECISIONS.md). |
| 4 | **Executor has no direct egress** — 403 CONNECT at the proxy, **36** consecutive runs, re-tested 2026-08-16 (run 47) against `justtuned.com` and `example.com`, and confirmed for `WebFetch` as well as `curl`. Every production and third-party reading in this loop comes from GitHub Actions. | Environment | — | Mitigated, not fixed, and **less limiting than this row implied for three runs**. Run 47: search works from the executor and page fetches do not, but the *loop* can now open a page too — [`source-read.yml`](../.github/workflows/source-read.yml) reads one third-party page in a real browser from Actions. What is still true is only that **the executor process** cannot fetch directly. [L-25](LESSONS.md). |

## 6. Current experiment

- **EXP-011 — is `landing_view` a browser at all? OPEN. Reading due on the complete UTC day
  2026-09-18** (run 138, pre-registered 2026-09-04 22:20 UTC, **before the counter existed**).
  Canonical: [EXPERIMENTS.md](EXPERIMENTS.md). **The claim that has steered nineteen days of work
  rests on a counter that cannot test it.** `landing_engage` needs the visitor to scroll, click or
  type, so *"nobody real is arriving"* and *"real people arrive and leave"* read the same near-zero —
  7 engages against 1131 landing views over 2026-08-16 … 2026-09-03, unsuffixed `application_start`
  never written once. `landing_render` fires at script execution and asks nothing of the visitor, so
  **R = render ÷ view** over 2026-09-05 … 2026-09-18 either upholds *"distribution is the
  bottleneck"* on measurement (**R-A, < 10%**) or contradicts it (**R-B, ≥ 40%: the page is the
  bottleneck**), with **R-C** mixed, **R-D** the beacon never landing, **R-E** contamination by our
  own QA. **R is a ratio of client populations, never a count of people, and a high R is not
  demand.** Binding on this loop until 2026-09-18: the landing page's copy, layout, offer and form
  must not change, and `landing_render` must not fire from any other page.
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
| **L-55** | **A counter that cannot separate two explanations was read for nineteen days as though it had.** EXP-007 named three explanations and shipped `landing_engage` to separate them; explanations 1 and 2 produce the *same* reading against it, and the grade that followed became the standing claim that directed every run since. | For each explanation, write the reading this instrument gives **if that explanation is true**. Two explanations on one row means the instrument does not separate them, however exclusive the forks look. Prevention check: **name the explanation that would be wrongly convicted at the low end.** |
| **L-54** | **A threshold designed for one venue shape was applied to every venue, and it closed four windows the venues themselves never closed.** A4's 72-hour freshness test measures the right thing where the reader arrives at the moment of posting, and nothing at all for a directory entry read for months. | Name **the mechanism by which the original failure happened** before reusing its threshold, and ask **when the people this bar protects actually arrive, relative to the moment it is read** — before reading the value, not after. |
| **L-53** | **The enumeration of non-human readers stopped at the edge of the document.** L-51's prevention check named the `<head>`; `robots.txt` is a property of an **origin**, so the site had never told a crawler anything — including *do not index this token*. | Enumerate readers by **what they fetch**, not by what they parse: origin-level files count, and a capability URL needs `X-Robots-Tag`, not only `Disallow`. |


Older lessons, including L-08's control-plane warning and L-10's contamination rule, remain in
[LESSONS.md](LESSONS.md). L-08's forward test — *does the next run spend its cycle on demand evidence
rather than more control plane?* — is the one run 138 had to answer, and the answer is not automatic:
`landing_render` is an instrument, and this loop has built many. What separates it is that it is the
**only** measurement available here that can change what the remaining runs do without anyone's
permission — it decides whether the next thirty days go to the page or to distribution, and the
counter that has been answering that question for nineteen days cannot.

## 8. Last materially updated and freshness

| | |
| --- | --- |
| **Last materially updated** | 2026-09-05 08:20 Sydney (2026-09-04 22:20 UTC) |
| **Run** | 138 — **the counter that has answered *"is the landing page the bottleneck?"* for nineteen days cannot answer it.** `landing_engage` needs the visitor to scroll, click or type, so *the traffic is not human* and *real people arrive and the offer does not move them* read identically near zero; only the third explanation (*the form loses them*) was ever excluded, and `application_start` — never written unsuffixed on any day — had already done that. Shipped [`a7b73a5`](https://github.com/in-c0/tuned/commit/a7b73a5): **`landing_render`**, one name on the existing same-origin pulse allowlist and one top-level call on the landing page, fired at script execution and gated by nothing, so it counts *a browser engine ran this page* and not *something fetched this URL*. Pre-registered first, in [`b95b13e`](https://github.com/in-c0/tuned/commit/b95b13e), as **[EXP-011](EXPERIMENTS.md)** — **R = render ÷ view over 2026-09-05 … 2026-09-18**, five exclusive forks including *the beacon never landed* and *our own QA contaminated it*, baseline frozen from committed snapshots (`landing_view` **1763**/28 days; over the 19 days every counter existed **1131** views, **7** engages, **0** starts, **0** submits). **R is a ratio of client populations, never a count of people, and a high R is a bottleneck becoming visible, not demand.** Binding until 2026-09-18: **no change to the landing page's copy, layout, offer or form**, and `landing_render` fires from no other page. No schema, table, cookie, identifier or new data category, so the privacy policy is unamended on run 43's reasoning. **Deliberately not done: the `ooh-directory` arrival tag** run 137 named as next — it would have been the second condition weakened in two runs, both blocking the same submission that A0 makes unmakeable and that has sat authorized and unmade for fifteen days; the run-57 [L-33](LESSONS.md) ordering stands and A2, not the instrument, is the binding constraint there. **The owner card is unchanged and deliberately not re-asked** ([L-07](LESSONS.md)). Lesson [L-55](LESSONS.md). Spend **AUD $0.00**, total **AUD $0.00 of $500**. **This file remains stale in sections not touched here** — §1–§5 were last rewritten at run 87 and the canonical files are right where they disagree. Previously, run 87 — **the owner action card is live again at ACTION REQUIRED · MEDIUM, on a freshness reading taken from production this run rather than inherited from the previous report.** The [reviewer directive of 2026-08-25T03:33:11Z](https://github.com/in-c0/tuned/issues/1#issuecomment-5404716623) asked for exactly this synchronization and for the executor to stand down while the window is open. **A4 re-read:** [agent operator 32805757838](https://github.com/in-c0/tuned/actions/runs/32805757838) at `2026-08-25T03:35:42Z` — `last_public_item_at=2026-08-24T21:43:45.078Z`, `public_items=14`, `operator_publications=3`, `operator_publications_hidden=0`; **age 5.9h, expiry `2026-08-27T21:43:45Z` = 2026-08-28 07:43 Sydney, ~66h left.** The card names the blocked outcome (**the first measurable external distribution test in Tuned's history**), the authority reason (**access, not authorship** — the owner's **A** of 2026-08-20 15:04 UTC stands; the executor's GitHub access is scoped to `in-c0/tuned` and it holds no identity at the venue), the exact minimum action, the observable success check, and blocker age measured from **`2026-08-24T21:43:45.078Z`**. **One divergence from the directive's literal text, recorded rather than silently taken either way:** that directive **printed the joined tagged feed URL publicly** on issue #1, which is what [L-36](LESSONS.md) exists to prevent — run 56 printed `?src=qa` in the same place and `arrival_fetch:qa` read **16** unattributed non-declaring fetches the same evening. The card states all three field values exactly while naming **route and tag separately**, and the consequence is registered in [METRICS.md](METRICS.md) before the number exists: `arrival_fetch:awesome-rss-feeds` has **never read non-zero** (verified against [`metrics/2026-08-24.json`](metrics/2026-08-24.json)), so the pre-`t0` baseline is clean up to `2026-08-25T03:33:11Z` and **issue-#1-attributable after it** — reported separately, never as venue traffic, and **not a reason to delay the submission** ([L-47](LESSONS.md)). **Documentation only. No source file, route, schema, counter, migration, workflow, allowlist entry, secret, data handling or rendered user-facing copy was touched.** Nothing published, submitted or retracted; **no venue contacted, no account used, no form submitted, no real channel tag exercised anywhere**; the duplicate check is cited to the reviewer's own 2026-08-25 searches and **was not re-read by the executor** ([L-42](LESSONS.md)). **[EXP-009](EXPERIMENTS.md) and [EXP-010](EXPERIMENTS.md) byte-untouched**; the scheduled `/sportstech/rss.xml` probe still **not** added ([L-31](LESSONS.md)); the PLOS/PeerJ/bioRxiv/SportRxiv host tests **paused, not dropped**, while the window is open. No demand inferred in either direction; AUD $0.00 of $500. Previously, run 86 — **every public page in this product told software the site has no feed, and that is fixed.** No page carried `<link rel="alternate" type="application/rss+xml">` — the single element a feed reader, aggregator or feed search engine uses to turn a pasted page URL into a subscribable feed. **The visible `RSS` anchor is why nobody looked:** it made the product appear feed-enabled to every human who reviewed the page, and no reader parses page text hunting for the word "RSS". **The concrete cost is in this loop's own distribution register:** [`ooh.directory`](DISTRIBUTION.md), one of only two candidates whose published rules do not forbid the post, states on its form ***"URL — The URL of the blog's front page (not its feed)"***. A directory that stores a front page reaches the feed by autodiscovery; run 57 quoted that label verbatim, filed it as a URL-shape difference between the two venues, and never asked how the venue gets from one to the other. **A submission there would have been admissible, correct in every field, and mechanically inert** ([L-46](LESSONS.md), which is [L-35](LESSONS.md) one layer out for the second time). **The counters say the door was being tried:** landing views 2026-08-21 … 08-24 ran **46 · 65 · 69 · 45** a day while unsuffixed `feed_fetch` — every RSS fetch not from a self-declaring crawler — read **0 · 0 · 0 · 0**, with real crawlers demonstrably reaching the handle pages (`feed_view_bot:sportstech` = **14** on 08-21). **Shipped: one element**, built from already-escaped values, plus [`test/discovery.test.ts`](../test/discovery.test.ts) — five tests that fail on the pre-change code and that verify the advertised href by **following it and requiring a feed back**, not by matching a string. Suite **10 files, 134 tests**, all passing. **No route, schema, counter, allowlist entry, migration, workflow, secret, data handling or rendered user-facing copy.** **Registered before the number exists, in [METRICS.md](METRICS.md):** this deploy lands inside [EXP-009](EXPERIMENTS.md) Reading 1's window, so **Fork I-A is already determined by pre-deploy days and is graded normally, Fork I-B must not be fired, and the unsuffixed background band is quoted from 08-20 … 08-24 only with 08-25/08-26 reported separately as post-autodiscovery** — the two regimes must not be averaged. **This is not [L-31](LESSONS.md):** the scheduled `/sportstech/rss.xml` probe is still not added and still waits for Reading 1, because it would make the fork true by construction with this loop's own timer; this deploy fetches nothing and counts nothing. **[EXP-009](EXPERIMENTS.md) and [EXP-010](EXPERIMENTS.md) byte-untouched.** **Deliberately not shipped:** `/sitemap.xml` and `/robots.txt` (a different problem, and the half that would matter needs a Search Console account this executor does not hold); autodiscovery on the landing page, which has no single canonical feed; any tag, allowlist change or submission. **`ooh.directory`'s A5 grade is unchanged and still fails** — its tag is still not allowlisted and its A2 is still open, and nothing was shipped for it per [L-33](LESSONS.md). No venue contacted, nothing published or retracted, no demand inferred, AUD $0.00 of $500. Previously, run 85 — **one selection cycle published one find, and the bigger result is that the loop had been reading a four-host sample as if it were the literature.** The [21:31 UTC directive](https://github.com/in-c0/tuned/issues/1#issuecomment-5401628043) asked for exactly one `@sportstech` selection cycle, at most one publication, the case against the find written first, and said a no-publish result is valid. Six candidates were graded against the remit. **Four were rejected before a page was opened** — three are reviews or surveys and carry no measured result of their own, one models athletic ageing (sports analytics, not any of the remit's four scope bullets), and a fifth with real numbers (deep-learning GRF estimation, R² 0.98) was rejected anyway because its cohort is Parkinson's patients, and `@sportstech` is not a clinical-gait feed. **The two best-on-paper candidates were peer-reviewed MDPI *Sensors* papers and `mdpi.com` refused the reader twice** — HTTP 403, `Access Denied`, an Akamai edge refusal, two distinct articles two minutes apart. Stopping there would have confirmed *arXiv or nothing* a third time. **`frontiersin.org` instead served the whole article** — HTTP 200, **47,770 visible characters**, `read_outcome: "page"`, no interstitial, full text through Discussion and Conclusion ([32780602312](https://github.com/in-c0/tuned/actions/runs/32780602312)). Run 50's narrowing was true and its denominator was **four hosts**; it was then quoted for four runs as though it described the literature, in a self-confirming shape — each cycle searched arXiv because arXiv was known to work. **Realised cost, stated plainly: two publications carried avoidable weaknesses.** R-1 and R-2 were both arXiv v1 preprints read at *abstract* level and neither had to be ([L-45](LESSONS.md)). **Published: item 247** — *Optimizing wearable IMU configurations for running gait analysis*, Front. Bioeng. Biotechnol., 11 Feb 2026, original research with editor and three reviewers named on the page. 25 recreational runners, treadmill 8–12 km/h, against a 17-IMU Xsens reference: one lumbosacral IMU reconstructed cadence, vertical oscillation and ground contact time at **R² > 0.95, MAPE < 5%** and **failed on gait symmetry at R² = 0.52**, which three sensors fix (**R² > 0.91, MAPE = 7.12%**). The negative result is the part the remit expressly welcomes. **The biggest caveat is carried in the published `why`:** the minimal configurations were never built — they are data subsets of one 17-IMU recording, so every figure is an upper bound on a real device. The abstract's *"outperforming standard commercial benchmarks"* was deliberately not carried, because the table behind it was not read. HTTP 201, replay `duplicate=true`, `public_items` **13 → 14**, `operator_publications` **2 → 3**; the case against it committed at [`1692fc6`](https://github.com/in-c0/tuned/commit/1692fc6) **19.078 seconds before** the dispatch. **A4 restored at 2026-08-24T21:43:45.078Z**, holding until **2026-08-27T21:43:45Z**, and the `awesome-rss-feeds` candidate is un-paused with the owner's **A** preserved — **as a consequence, not a motive**: had the third read also come back 403 this cycle would have ended in *publish nothing*. Per the directive, the renewed submission decision is **left to the next reviewer preflight** and was not acted on. No source file, route, schema, counter, migration, workflow or rendered user-facing copy changed; the scheduled `/sportstech/rss.xml` probe was **not** added ([L-31](LESSONS.md)); **[EXP-009](EXPERIMENTS.md) and [EXP-010](EXPERIMENTS.md) byte-untouched**; no venue contacted, no real channel tag exercised, no demand inferred; AUD $0.00 of $500. Previously, run 84 — **a measurement due Wednesday was resting on a schedule that does not exist, and the premise was withdrawn before the number landed.** [EXP-009](EXPERIMENTS.md) Reading 1 grades `feed_fetch_bot:sportstech` on the stated guarantee that *"this loop's own **scheduled** QA fetches of `/sportstech/rss.xml`"* keep it non-zero, and Fork I-B converts a seven-day zero into *the instrument is defective*. **There is no such schedule:** the three specs named run only from `qa-browser.yml`, which is `workflow_dispatch`-only by deliberate design (its own header gives the reason), and the only two scheduled workflows each probe exactly one feed's RSS — `/ava/rss.xml` — through `scripts/prod-http.sh`, which lands in `_bot` on `BOT_UA`'s `uptime` token, not `headless`. The series agrees: **08-19 4 · 08-20 1 · 08-21 7 · 08-22 1 · 08-23 0**. **Realised cost is nil and is reported as nil** — Fork I-A needs ≥ 1 non-zero day of 08-20 … 08-26 and three already qualify, so Reading 1 lands on I-A regardless; the averted cost was the contingent branch, where a week without a dispatch fires I-B and fails A5 for every tagged candidate. Shipped: the false description corrected in the deployed comment, in the published `/api/metrics` note and in [METRICS.md](METRICS.md); [L-44](LESSONS.md); the binding rule that **Fork I-B must not be fired on 2026-08-26**. **[EXP-009](EXPERIMENTS.md) and [EXP-010](EXPERIMENTS.md) byte-untouched** — the run-57 freeze holds, so the correction is recorded outside the pre-registration rather than edited into it. **The obvious fix was deliberately not shipped:** adding `/sportstech/rss.xml` to the scheduled probes inside the window would make Fork I-A true by construction ([L-31](LESSONS.md)), and it is pre-committed for after Reading 1. No route, schema, counter, allowlist entry or user-facing copy changed; nothing published, submitted or retracted; no venue contacted; no demand inference; AUD $0.00 of $500. Previously, run 83 — **the owner card retired itself on its own clock, and §1 is NONE for the first time since run 61.** A4 lapsed at **2026-08-24 09:35:56 UTC** with no submission made; the owner's **A** is preserved, the `awesome-rss-feeds` candidate is **paused, not dropped**, and nothing was published to hold the window open. Documentation only — no runtime surface, route, schema, counter, allowlist entry or public copy touched; nothing published, retracted or restored; no venue contacted; **[EXP-009](EXPERIMENTS.md) and [EXP-010](EXPERIMENTS.md) byte-untouched** (EXP-009 has been frozen to revision since run 57 and its Reading 2 stays ungraded — Fork D is *not* recorded, because no attempt was completed); no demand inference; AUD $0.00 of $500. Previously, run 66 — **nothing here changed for you, and that is the finding.** Run 66 shipped a QA-only change: the EXP-008 provenance instrument, which could grade only item 242, now grades every pre-registered publication, so **threshold 5 is claimed for item 246 from production** ([qa-browser 32471468104](https://github.com/in-c0/tuned/actions/runs/32471468104), 5 passed / 1 skipped by design) instead of left as the honest gap run 65 recorded. Doing it surfaced a defect in the instrument's own RSS assertion — it compared raw XML to the dispatched why-line, which passed only because item 242's line contains no character `esc()` escapes; item 246's ends `error only "low"`, and the old check would have gone red on the next publication for a reason unrelated to provenance ([L-43](LESSONS.md)). **§1 is unchanged, A-1 is unchanged, and the A4 window still closes 2026-08-24 19:35 Sydney.** No runtime surface, route, schema, counter or copy touched; nothing published, retracted or restored; no venue contacted; EXP-009 and EXP-010 byte-untouched; AUD $0. Previously, run 65 — **`@sportstech` published its second find, and the freshness window the submission needs is open again until Monday 19:35 Sydney.** One selection cycle under the reviewer's directive: one candidate, read at page level from GitHub's network ([32468312666](https://github.com/in-c0/tuned/actions/runs/32468312666), `read_outcome: "page"`, 3655 visible characters, no interstitial), nominated **before** the dispatch with four arguments against it written by the nominator, and published only because it clears the feed's remit on its own — a synchronized multi-IMU wearable validated against a YOLOv11 markerless vision reference, with drift of 1.5e-6 deg/min over a 2h12min elbow hold and 0.6442° noise-limited resolution. **Item 246**, HTTP 201, replay `duplicate=true`, `public_items` 12 → 13, `operator_publications` 1 → 2. The prior A4 window **expired unused at 14:15 Sydney** and nothing was published to save it. One durable claim was falsified by this run's own reading and corrected in place: [DISTRIBUTION.md](DISTRIBUTION.md) said the landing demo resolves to `/ava`; it has resolved to `/sportstech` since 2026-08-18, because the demo is picked at request time as the freshest feed ([L-42](LESSONS.md)). A second stale sentence in this file's own headline — that the executor could submit the venue's Google form unaided — was struck; it was withdrawn at run 62 and survived here three days. **EXP-009 and EXP-010 byte-untouched**; no schema, route, counter, allowlist entry or public copy changed; no submission made anywhere; AUD $0. Previously, run 59 — **the owner card said NONE for five runs while every other line said a decision was outstanding.** No product change and no experiment change: the reviewer's directive was to synchronize the owner boundary and stop. §1 now carries the canonical A/B/C decision — may the executor submit `@sportstech`'s feed record to `plenaryapp/awesome-rss-feeds`, or does the owner — with severity, blocked outcome, why owner authority is required, an observable success check (a comment on issue #1 naming A, B or C), blocker age (opened 2026-08-19 04:30 UTC) and where it was surfaced. The headline card, §1, §5's blocker #1 and [STATUS.md](STATUS.md)'s canonical card, blocker #1 and Next action now say the same thing, with STATUS named as authoritative. Four stale claims were corrected in place rather than deleted: the headline's *"There is nothing for you to do"*, §1's *"what happens next is not yours"*, §1's *"the real blocker … is not yours right now"*, and §5 blocker #1's *"no owner step"*. §1 also corrected the adoptable-feed list to **three** (`@graphics`, `@wearables`, `@wellbeing`) — `@sportstech` was adopted at run 44 and published at run 52. **EXP-009 and EXP-010 were deliberately not touched**; no counter, name, allowlist entry, route, schema or public surface changed; no submission was made anywhere; AUD $0. Previously, run 44 — **the operator control plane made its first production mutation, and published nothing.** `@sportstech` adopted under the reviewer's exact public remit: **HTTP 201** (`adopted=True · source=adopted`), then one read-only `list` returning **`owner: @ava · active 1/12`**, `@sportstech [active] source=adopted public_items=11 operator_publications=0`, adoptable now `@graphics @wearables @wellbeing`. Every acceptance criterion read back from production rather than asserted. The remit ([`ops/agents/sportstech.md`](agents/sportstech.md)) and [EXP-008](EXPERIMENTS.md)'s first-publication contract were committed in [`9617bea`](https://github.com/in-c0/tuned/commit/9617bea) **before** the mutation; the publication itself is **gated** on EXP-007's first complete-day reading so nothing changes the landing surface inside that window. One documentation defect found and corrected: `ops/agents/README.md` claimed a remit is written to `creators.charter` "at adoption or creation" — false for adoption, where only `operator_agents.remit` is written, and **the code is the part that is right** ([L-22](LESSONS.md)). No agent created, no item published, no queued item touched, `items_public` still **79**; AUD $0. Previously, run 43 — **the middle of the acquisition funnel was instrumented for the first time.** Nine UTC days of 605 UA-flagged human-shaped landing views against **0** applications, with **nothing recorded in between**, so three unrelated causes were producing one indistinguishable reading. Three counters now separate them — `landing_engage`, `application_start` (page-reported, one-shot per page load, same-origin only) and `application_invalid` (server-side, a submit rejected by email validation, previously invisible because `application_submit` counts only the ones that worked). No schema change, no new table, no cookie, no identifier, no new data category, **so the privacy policy was deliberately not amended**. [EXP-007](EXPERIMENTS.md) pre-registered five exclusive forks and a validity gate **before the counters existed**; the first reading is the snapshot covering complete UTC day 08-16. `verify production` now asserts the instrument's own presence on every push — POST with no Origin must answer **403**; 404 (absent) and 204 (guard gone) are both roll-back signals. This **reverses** EXP-003's standing "not a CTA-reach counter" hold, struck rather than deleted in STATUS, on the grounds that the counter is run to *test* the crawler assumption EXP-003 made and that the known-human traffic it deferred to (EXP-002) has been owner-gated and NOT STARTED for eight days. No agent adopted, created, published or disabled; no queued item touched; AUD $0. Previously, run 42 — **the blocker narrowed, then closed, inside one run.** It began as an ops-only reconciliation: the owner's 08-14 22:24 `list` dispatch proved the GitHub secret present (it cleared the workflow's own guard) and the Worker binding absent (`error=operator key not configured`, the first check in `src/operator.ts`, which excludes mismatch, `ADMIN_KEY` collision and owner resolution), so §1 was rewritten to **Cloudflare only**. The push carrying that rewrite then triggered `verify production`, which read **401** instead of 503 at 03:42:09 — the pre-registered resumption signal, arriving naturally rather than by dispatch. One authorized read-only `action=list` followed at 03:43:10: **`HTTP 200 · owner: @ava · active 0/12`**, adoptable `@graphics @sportstech @wearables @wellbeing`. **§1 is now NONE.** Stopped there per directive — no adopt, create, publish or disable. Blocker #4's egress count also corrected to **31** in both files (they disagreed at 29/27). No source, schema, workflow, product, pricing, distribution, billing or experiment change; no queued item touched; AUD $0. Previously, run 41 — **ops-only evidence reconciliation.** The durable claim that Tuned has "one live connection with nothing to carry" was falsified by the 08-14 snapshot: ingestion ran 30×, succeeded 30×, captured **104** plays, and the private queue went **42 → 146** while `items_public` stayed at **79**. Corrected here, in STATUS and in METRICS; [EXP-006](EXPERIMENTS.md)'s original grade and timestamp preserved with the later reading filed separately. No source, schema, workflow or product change; no queued item opened or approved; no manual dispatch; §1 unchanged. Previously, run 37 — the ingestion cron, Tuned's only current producer of items, was made observable through the existing metrics path; [EXP-006](EXPERIMENTS.md) pre-registered before any reading. Graded the same run: **QUIET, NOT BROKEN** — the cron fires, the token still authenticates, and there was simply no new play to capture, so the flat `items_queued` is a true absence of supply rather than a defect (n = 1 poll; the three earlier flat days stay uninterpretable). Nothing was published, no owner card changed. Previously, run 36 — the agent publication contract was traced end to end and works; **credentials and permission are the missing prerequisites, both owner-only**, so §1 carries one card again. Agent provenance in RSS was found missing and fixed. Nothing was published |
| **Repository commit at time of writing** | [`9617bea`](https://github.com/in-c0/tuned/commit/9617bead978707864fac802c39e14c7533299e74) — confirmed by `verify production` [31877364330](https://github.com/in-c0/tuned/actions/runs/31877364330) to be the commit **actually serving**, by build stamp rather than by timing |
| **Data commit** | [`7a73982`](https://github.com/in-c0/tuned/commit/7a739827c21f9716765670f20f05fadeb1899ad3) — `generated_at` 2026-08-14T20:58:56Z, read through the public zone by the scheduled snapshot job. **This is the reading that moved:** content totals and ingestion counters in §4 come from it. The **§4 stage table still comes from [`567dad0`](https://github.com/in-c0/tuned/commit/567dad0) (08-12)** and is labelled stale in place. |
| **Freshness state** | **PARTIALLY RESYNCHRONIZED, and saying so rather than claiming FRESH.** **Run 87 rewrote §1 and §8's own two rows, and nothing else in this file.** §1 is current as of run 87; §7 still lists L-25/L-20/L-19 and is now **twelve** lessons stale — L-46 and L-47 are in [LESSONS.md](LESSONS.md) and not here. **§4 was deliberately not touched: no metric moved this run**, and it still carries no row for RSS autodiscovery or for `arrival_fetch:awesome-rss-feeds`, which has never read non-zero. **Previously, run 86: only §8's own two rows above were rewritten** — the headline `Run` cell and the timestamp. **§7 still lists L-25/L-20/L-19 and is eleven lessons stale**; L-46 is in [LESSONS.md](LESSONS.md) and not here. **§4 carries no row for RSS autodiscovery and must not** — the change ships today, so any counter it moves has no pre-deploy value in any committed snapshot.  **The headline card, §1 and §5's blocker #1 are current as of run 59**, and are the sections this file exists to get right; §6's EXP-008 entry as of **run 44**; §6's EXP-007 entry as of **run 43**; §5's blocker #4 was corrected at run 42 and its *count* is stale — STATUS carries the current figure; §7 as of run 37. **§6 does not list EXP-009 or EXP-010**, both registered since; read [EXPERIMENTS.md](EXPERIMENTS.md) for those, and note run 59 was directed not to touch them. **§4 was deliberately not touched this run — no metric moved**, so its content totals and ingestion counters remain at the 08-14 snapshot and its **stage table** remains three days stale at the 08-12 snapshot, labelled in place. **§4 carries no row for the three counters added this run, and must not: they read zero on every day committed so far because they did not exist.** §2 and §3's 1-week row are current as of run 34; **§5's blocker rows 1–4 are also as of run 34, and only its new row 5 was written at run 53** — the rest of §5 has not been re-verified since.  **The rest of §3 was last written at run 20** and is stale. Read [STATUS.md](STATUS.md) and [MILESTONES.md](MILESTONES.md) for those. |

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
