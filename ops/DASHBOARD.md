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

> # **Yesterday I gave every find its own web address. Today I found that nothing on the site pointed at a single one of them.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **What was wrong.** Yesterday's work was real: 87 finds, 87 new addresses, and the list Tuned hands
> search engines went from 8 pages to 95. But a feed page's cards all link **outward**, to the
> original article — which is right, and which meant that no page on Tuned linked to any of the new
> find pages. Google could only learn they existed from the list; it could never walk to one by
> following links, the way it learns that a page matters. And a person reading a feed still had no
> way to get the link to a single find. The addresses existed and nothing led to them.
>
> **What I built.** A small "permalink" link on every card on a feed page, pointing at that find's own
> page. That is all it needed. It is the smallest thing that turns 87 addresses into 87 addresses
> somebody can actually reach.
>
> **What I deliberately did not touch — again.** I did not change what the card itself does when you
> click it. It still opens the original article, and there is now an automatic check that fails the
> deploy if that ever changes. Sending Tuned's only clicks to Tuned instead of to the source would be
> worse than having no permalink at all. I did not touch RSS, and I did not touch the landing page,
> which is mid-experiment until 18 September.
>
> **One number I added, and why it is not more dashboard-building.** Yesterday I wrote down that "if
> the find-page view counter moves, that is somebody sharing a link." Adding a link *inside* Tuned
> breaks that, because now the counter also moves when you click around your own site. So I split it:
> visits that came from Tuned are counted separately, and the interesting number is still readable.
> Without that, the first genuinely interesting reading this surface could produce would have been
> indistinguishable from you browsing.
>
> **The mistake I caught, and what caught it.** I first put the permalink in the card's top-right
> corner. Every automated test passed. Opening the page in a real browser showed it sitting **on top
> of** the "via @scout" label on wide screens and on top of the source's name on a phone. That is the
> second run in a row where the only thing that caught a real defect was looking at the page. I moved
> it to the bottom-right, where the space is reserved properly.
>
> **Something I found and chose not to fix.** On a narrow phone, a card with a very long source name
> pushes about 29 pixels off the side of the screen. I checked it against the old version: it was
> already doing that, so it is not from this change. It is small and it is next on the list.
>
> **The number that has not moved in forty-three days.** Nobody has applied, nobody follows
> `@sportstech`, and there is no money. **19 days left.** The two items in §1 are still the only
> things on this list that could produce a customer. This change, like yesterday's, does not bring
> anyone by itself — it finishes making it possible to be found, which took two runs rather than one.
>
> ---
>
> # **Tuned has published 87 finds. Until today not one of them had a web address you could send anyone, and the list Tuned hands search engines had eight pages on it.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **What was wrong.** A find — a thing an agent noticed and somebody chose — only ever existed
> *inside* a feed page, and that page changes every time something new is published. So there was no
> link for a single find. If you wanted to send a friend the one interesting paper `@sportstech`
> picked up on Tuesday, the only thing you could send was the feed, and by the time they opened it
> the paper had moved down or off. The same gap meant Google had almost nothing to index: the file
> Tuned gives search engines listed **eight** pages — the front page, five feeds, terms and privacy —
> for a service whose entire output is 87 published finds.
>
> **Why this is the thing I worked on.** My own earlier experiment already concluded that the problem
> is not persuading visitors — it is that **nobody arrives**. The two ways of fixing that which I
> have prepared are both sitting with you (§1). Being found in search, and being passed from one
> person to another, are the only two ways of being arrived at that need nobody's permission, no
> spending and nothing from you. Both were impossible, because the thing Tuned makes had no address.
>
> **What I built.** Every published find now has its own page. The page is about **the attention**,
> not the article: who noticed it, who read it and chose it, and when it was published — with the
> source's headline only so you know which thing it is, and a prominent link out to the original. It
> says on the page, in plain words, *"Tuned does not host this and did not write it."* That sentence
> is now checked automatically on every deploy, because it is the line between Tuned and a content
> site that reposts other people's work, and a line nobody checks is not a line.
>
> **What I deliberately did not touch.** I did not re-point the feed pages' links at these new pages —
> that would send every click that currently goes to the source to Tuned instead, and I have no
> evidence that is better. I did not touch the RSS feeds, because changing them would re-notify every
> subscriber about articles they have already seen. And I did not touch the landing page, which is
> mid-experiment until 18 September.
>
> **Two mistakes I caught in my own work, both worth telling you about.** The "more finds like this"
> block at the bottom of each page was linking out to other websites rather than to Tuned's own find
> pages — which would have quietly defeated the entire point of building them. And a stray character
> in a comment broke the page's stylesheet *without breaking a single automated test*, because the
> tests check the page's structure and treat the styling as text. That one was only caught by opening
> the page in a real browser and looking at it.
>
> **One question from last time is now answered.** I asked whether the admin key was set up in
> production, which decided whether the "see who applied" screen I built yesterday actually works.
> **It is set, and the screen works today.** Nothing needed from you.
>
> **The number that has not moved in forty-two days.** Nobody has applied, nobody follows
> `@sportstech`, and there is no money. **20 days left.** The two items in §1 are still the only
> things on this list that could produce a customer — and this change is the first arrival work that
> does not depend on them. It does not by itself bring anyone; it makes being found possible, which
> it was not.
>
> ---
>
> # **If a stranger had applied to Tuned any time in the last forty days, I could have told you that somebody applied — and never who. The application form writes to a table nothing could read back.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here. **There is one new question at the bottom of this block.**
>
> **What was wrong.** The "apply" form on the landing page saves the person's email, what they want to
> use Tuned for, and their note. Exactly one thing has ever read that table: a **count**. No screen, no
> export, no email — nothing anywhere hands back a row. Meanwhile the step that *admits* somebody needs
> their **email address** to work. So the second step of the funnel was writing to a place the third
> step could not read, and letting someone in would have meant you opening the Cloudflare dashboard and
> querying the database by hand.
>
> **Why nobody noticed for forty days.** Nobody has applied. **An empty table and an unreadable one look
> exactly the same from the outside** — both report zero — so there was never anything to feel. Nothing
> was lost and no number I have published was wrong. What did not exist was any way to *check*, and the
> first moment it would have mattered is the first stranger, which is the moment I would least want to
> be discovering it.
>
> **Why my own audits missed it.** I have swept every counter, and I have a test that lists every route
> and what it records. Both ask *what does this write?* **Neither asks what reads it.** The form is
> correctly listed as writing its counters — the row it saves alongside them is not a counter, so it was
> in neither list.
>
> **What I shipped.** A private, key-protected way to read the applications: who applied, what they
> said, when, and whether they have already been let in. It uses the admin key that already exists, so
> there is nothing for you to set up, and it refuses to answer at all until that key is configured.
>
> **The half I did not fix, and you should know it.** There is **no email sending anywhere in Tuned**.
> Admitting someone produces a sign-in link that nothing can deliver — somebody has to carry it by hand.
> Same as the "follow by email" box, which collects addresses no digest can ever reach. I can now *see*
> an application; I still cannot *answer* one.
>
> **The new question, asked once and not repeated.** Tuned has **no payment provider, and I have never
> once asked you for one** — 163 runs, against a cash target. I deliberately did not build a pricing
> page: there is nothing a stranger could buy today, because creating a feed is admin-only, and a
> "would you pay?" button is not evidence of anything. **With 20 days left, is opening a payment path
> worth it at all?** That is your call and the reviewer's, not mine. Answer on issue #1, or ignore it.
>
> **The number that has not moved in forty-two days.** Nobody has applied, nobody follows
> `@sportstech`, and there is no money. **20 days left.** The two items in §1 are still the only things
> on this list that could produce a customer.
>
> ---
>
> # **The previous run did its work, pushed it, and then vanished without filing its report. The two alarms I have for "has the loop stopped?" both said everything was fine — and on this failure they say it more confidently, not less.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **What happened.** Every run of this loop must post a report to issue #1 — it is the only place you
> or the reviewer can see what a cycle did. Last night's run signed in at 08:03 Sydney, pushed its
> change, watched the build go green at 08:18 — **and then stopped without filing anything.** Its
> code is safely in the repository. Its account of itself does not exist and cannot be recovered,
> because only that session knew what it had decided and why.
>
> **Why nothing caught it.** I have a watchdog that asks *"is the loop still firing?"* It works by
> checking that runs **sign in**. Last night's run did sign in, and it did commit — and a commit is
> treated as proof the loop is alive. **So a run that starts, works, and abandons its last steps
> looks healthier to the watchdog than a quiet one.** Both of its signals pointed the reassuring way
> on the one run that dropped the ball.
>
> **The fix, and it needed no new machinery.** Signing out is the *last* thing a run does, right after
> filing its report — the two runs before this one signed out **three seconds** after posting. So a
> run that signed in, ran out its time, and never signed out is a run that did not finish, and its
> report is in doubt. That fact was already sitting in the file the watchdog reads. **35 of the 37
> sign-ins on record signed out cleanly** — the only exceptions are last night's run and whichever
> run is currently working — so this is a clean signal, not a noisy one.
>
> **I got the priority wrong first and caught it against the real data.** I filed the new alarm as the
> least urgent of three. But a *different*, older alarm is already lit, and a louder alarm hides a
> quieter one for two days — which is exactly the window last night's failure falls in. **The check I
> wrote to catch this would have missed this.** Reordered: *the loop is down* still comes first, then
> *a run left the record broken*, then *an outage that already ended and is already reported*.
>
> **What this does not do.** It does not read issue #1, so "the report is missing" is an inference
> from the ordering, not something it saw. It cannot make a half-finished run finish. And it is
> deliberately **silent about last night's run** — you are reading about that here, and an alarm that
> pages you about something already in front of you is how alarms get ignored.
>
> **The number that has not moved in forty-one days.** Nobody has applied, nobody follows
> `@sportstech`, and there is no money. **20 days left.** A loop that notices its own missing
> paperwork is not a customer. The two items in §1 are still the only things on this list that could
> produce one.
>
> ---
>
> # **The fix I wrote down yesterday for my own reading tool would have been fooled by exactly the page it was written to keep out. I caught it before shipping it.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **What the tool does.** This loop cannot open web pages directly, so it drives a real browser on
> GitHub's machines to read anyone else's page — a venue's rules, or the check that asks *"has
> someone already submitted Tuned here?"* It has to tell a real page apart from the "are you a
> robot?" screen some sites serve instead, or it will happily report a robot screen as an answer.
>
> **The flaw found yesterday.** It decided that by length: under 1,000 characters, call it a robot
> screen. But *"nothing found"* **is** a short page. So the duplicate check fails exactly when its
> answer is clean — which it did, twice.
>
> **Yesterday's proposed fix, and why it was wrong.** *"If the page contains links matching what we
> searched for, it's a real page."* A robot screen carries one link: **retry**, pointing back at the
> address you asked for — and that address contains the word we searched for. **The rule would have
> waved the robot screen straight through.** I found it by asking one question I should have asked
> yesterday: *name the page this is meant to keep out, and walk it through the new rule.*
>
> **What shipped instead.** A real page carries the site's own navigation — twenty or more distinct
> links elsewhere on the same site. A robot screen carries none, because it isn't the site's page.
> GitHub's "nothing found" page has 103. The length rule is **unchanged**, a named robot screen is
> still rejected however many links it has, and eight tests hold each of those in place.
>
> **The number that has not moved in forty days.** Nobody has applied, nobody follows `@sportstech`,
> and there is no money. **20 days left.** A more honest reading tool is not a customer. The two
> items in §1 are still the only things on this list that could produce one — and I checked the whole
> channel register again this run rather than assume it: **every other route needs an account I do
> not have.**
>
> ---
>
> # **I had written down in detail what to do when an experiment tells me something, and left blank what to do when it tells me nothing. Nothing is what keeps happening.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **What this is about.** Before running any experiment, this loop writes down the possible outcomes
> in advance and what each would mean — so it cannot move the goalposts once it sees the result.
> There are thirty-two such written-down outcomes. **Eleven of them said what the result would mean
> and never said what to do next.** And they were not a random eleven: **every one was a "this told us
> nothing" outcome** — the submission never happened, the listing never appeared, the data was
> contaminated, the source refused to answer.
>
> **Which are precisely the outcomes Tuned keeps getting.** The `awesome-rss-feeds` branch marked
> *"never submitted"* is the literal state of the world today, 25 days on, and had no next step
> written. The `ooh.directory` branch marked *"never listed"* **describes itself as the expected
> outcome** in its own text — and had no next step either. So the branch this loop actually walks
> down is the one with no directions on it, and whoever arrives there improvises at the exact moment
> the evidence is weakest.
>
> **Why it happened, which I think is the interesting part.** Writing these down is an act of
> imagining the experiment *working*. The informative branches get instructions because you are
> picturing what you will do with the answer. The empty branches get a careful *"this is not evidence
> of demand in either direction"* — the honest, disciplined sentence — and that **feels** like
> finishing the job. It is not an instruction.
>
> **What shipped.** The eight missing next steps, all on experiments still open, all written without
> knowing how they will turn out; the rule itself at the top of the experiments file, where a run
> writing one is already looking; and a test that fails if any future branch is left without one. **No
> new counter, no new dashboard, no new scheduled job, and `src/` was not touched — the site is
> byte-for-byte what it was.**
>
> **One thing I set out to do and could not, which you should know about.** Yesterday's run asked me
> to decide in advance what each outcome of the landing-page experiment (reading 18 September) would
> commit the remaining days to. While checking the metrics — a normal part of every run — **I
> computed a partial nine-day figure for that experiment first.** Nine days of fourteen is enough to
> see where it is heading, and a commitment written knowing the answer quietly gives the likely
> outcome the easy job. **So I declined to write them rather than write them with a disclaimer**, put
> the partial figure on the record in full so it cannot become a number-shaped secret, and left the
> 18 September reading to run on the text written blind on 4 September. The lesson is filed: a window
> for deciding-in-advance is used up by the first run that looks, and looking is part of the job.
>
> **And the number that has not moved in thirty-nine days.** Nobody has applied, nobody follows
> `@sportstech`, and there is no money. **21 days left.** Knowing what to do with a null is not a
> customer. The two items in §1 are still the only things on this list that could produce one.
>
> ---
>
> # **Yesterday I told you I did not know why two runs had skipped the loop's own safety step. The answer is that nobody had ever written the step down anywhere a run was obliged to look.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **What the safety step is.** Before this loop changes anything, it signs a register — a lock that
> stops two copies of itself running at once and doing the same job twice. That has really happened
> before, and it produced two competing pull requests for one instruction. Friday evening and
> Saturday morning, the loop shipped eight commits without signing. Yesterday's run caught that,
> rebuilt the alarm so it can no longer confuse *"the loop died"* with *"the loop skipped a step"*,
> and finished by saying plainly that it did not know the cause.
>
> **The cause turns out to be mundane and complete.** The instruction to sign existed in exactly one
> place in this repository: **line 2493 of a 3,093-line file** — and the contract that tells a run
> which files to read describes that file as *"one screen"*. The routine prompt that starts each run
> does not mention the lock at all. The code implementing the lock even states in its own comments
> that the discipline *"lives in ops/STATUS.md"*. It did. Nobody was ever going to read that far.
>
> **And it did not end up there by drift — it was buried the day it was written.** The lock, its
> tests, its CI step and that one line of prose all arrived in a single commit on 31 August, and the
> line went in at **1511 of 2,063**: already three-quarters of the way down, on day one. Thirty-three
> later runs prepending sections above it moved it to 2493. They are not why it was missed.
>
> **What shipped.** A `CLAUDE.md` at the top of the repository — **the one file a session here opens
> without being told to, and this repository has never had one in its life.** The signing command is
> in its first screen. The rest is a single page: what Tuned is, which files to read, which checks to
> run before shipping, the report format, and the standing rules. Everything else stays a link. A
> test guards the three properties whose absence buried the instruction — it must exist, the command
> must be in the first 40 lines, the file must stay under 200 — and a fourth against the new risk a
> file like this creates: something read automatically is read with authority, so every link and
> command inside it has to resolve. Six ways of breaking it were tried; each turns the right test red.
>
> **Why this rather than something that makes money.** This is the third run in a row spent on the
> machinery rather than the product, and it is only defensible because it **takes a failure away**
> rather than adding another instrument. Yesterday added an alarm that reports this mistake after it
> happens; today the instruction reaches the run that would make it. No new scheduled job, no new
> dashboard, nothing added to the product — and **`src/` was not touched, so the site is byte-for-byte
> what it was.**
>
> **And the number that has not moved in thirty-nine days.** Nobody has applied, nobody follows
> `@sportstech`, and there is no money. **21 days left.** A loop that follows its own protocol is not
> a customer. The two items in §1 are still the only things on this list that could produce one.
>
> ---
>
> # **The feed a directory would list could not say which of three addresses it was — and the alarm that watches this loop was 25 minutes from telling you it had stopped, while it was running.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **The first thing, in plain terms.** `justtuned.com`, `www.justtuned.com` and a `workers.dev`
> address all serve the identical feed file, and **nothing inside that file said which of them it
> actually is.** The website's pages were given that line back in run 86 — *"this is the real address
> of this page"* — and the note explaining why even says the feed has the same problem. **The feed was
> left out of the fix, and the feed is the thing an RSS directory lists.** It is what validators check
> and what aggregators use to tell two copies of a feed apart. It is there now, along with a
> machine-readable *last updated* date: the field a reader's app shows in its list, which is how
> somebody months from now can see whether `@sportstech` is still alive.
>
> **The second thing, and it is the one I would want to know.** Running the checks turned up that
> **Friday evening's run and this morning's run never signed the run register.** They ran, shipped and
> reported normally — but the register they sign at the start sat blank for 24 hours, and **the
> watchdog that reads it has only ever had one word for silence: "the loop is not firing".** At 20:35
> tonight it would have sent you *"24.02h with no run at all"* and *"check that the routine is enabled
> and firing"*. The routine was enabled and fired on time, every time.
>
> **That was stopped before it reached you**, with the true account posted in its place, and the
> watchdog can now tell the two situations apart — because they need opposite things from you. *No
> run happened* means restart it. *A run happened and skipped the signature* means leave it alone;
> it is mine to fix. It still alarms on both: the change renames an alarm and can never silence one.
>
> **And the fix nearly shipped broken in the one way only the real thing would show.** The new check
> asks the repository's history whether any run committed during the silence. GitHub's default
> checkout fetches a single commit of history — so in production it would have answered *"nothing
> did"* every single time, silently restoring the exact false alarm it was written to remove, while
> passing every test on my machine. **The build caught it on the commit that added it.** It now
> fetches full history, and a history too short to answer says *"cannot answer"* instead of *"nothing
> happened"*.
>
> **What did not happen.** No landing page, no pricing, no positioning — that window is untouched and
> closes Friday 18th. Nothing that decides what `@sportstech` selects. The daily publishing schedule
> is **still switched off** and the replacement threshold is still waiting on review; this run neither
> armed nor enacted it. No find published, corrected, hidden or restored. Nothing was spent.
>
> **One thing I could not do, and stopped rather than work around.** I re-tested whether this session
> could make the `awesome-rss-feeds` submission itself. The answer is now **settled rather than
> pending**: the refusal is structural, not a glitch that might lapse. There *is* a way — starting a
> session scoped to that repository — and **I did not take it.** Your `A` authorises the submission,
> not this executor widening its own access to other people's repositories in order to make it. That
> stays your two minutes.
>
> **And the number that has not moved in thirty-eight days.** Nobody has applied, nobody follows
> `@sportstech`, and there is no money. **22 days left.** A feed that can name itself is not a
> subscriber. The two items in §1 are still the only things on this list that could produce one.
>
> ---
>
> **Previously (run 156).** The agent had one word — "length" — for three different reasons to
> stay quiet, and on Friday that word made this page tell you something untrue: a sentence reported
> as *too long to quote* was in fact **too short**, under eighty characters, and nothing in that
> paper was ever too long. The decision was right both times and no reader saw anything wrong, but
> the write-up was confidently wrong about a fact it had every means to get right. The one word is
> now three, a length refusal states the miss and the budget it missed (*"missed by 24 against
> 252"*), and each wrong line was corrected where it stands rather than quietly edited out.
>
> ---
>
> **Previously (run 155).** The agent got the ability to correct its own public line — the old text
> kept forever, a visible `(corrected …)` mark the server adds so it cannot be left off, and no way
> to change which paper a find points at. Pointed at Friday's item it read the abstract, looked at
> the three sentences in the results section and **refused all three**, so the weak line stayed. *(Two
> report nothing a reader could check; the third is too short to quote — Friday's report said "too
> long", which is the error this run found.)* Its first attempt had produced a description of the
> experiment with the word "Methods" glued to the front; two rules existed to stop that and both
> missed, and it was caught on a dry run before anything reached the site.
>
> ---
>
> **Previously (run 145).** `/sportstech` has a **Follow** button. Someone who likes what an agent is
> pointing at presses it, leaves an email, and that is the whole conversion this site currently
> offers a stranger. It has never been counted. The only record was one running total of followers,
> reading **0** — and a total that does not move cannot tell you *nobody tried* from *someone tried
> and the form rejected them* from *someone tried who was already on the list*.
>
> **Why it matters this week and not in general.** Both items in §1 point at that page. If either
> lands and people arrive, arrivals are counted — run 143 saw to that — and what they **did** would
> not have been. These counters start at zero on the day they ship and nothing fills in the past, so
> the only time to build them is before a listing lands.
>
> **What was actually shipped:** seven counter names covering the follow button being opened, a follow
> being accepted, a follow being rejected by the email check, and a follow from someone already on the
> list. That last one is the one that makes the follower total mean something.
>
> **The uncomfortable half, in plain terms.** Three previous runs swept the site for counters that
> could not say who wrote them, and the last one reported the sweep finished. It was — over the set of
> *counters*. This route had none, so it was never in the set being checked. The sweep was honest and
> the sentence describing it was too small a claim to notice that.
>
> **The background.** When you let someone into Tuned, they get an email with a sign-in link. Clicking
> it signs them in and drops them on their desk. Two counts follow from that: *someone signed in*, and
> *someone opened their desk*. The second one feeds the single number we have been calling **activation**
> — has anybody actually started using this — and it has read **0** every day of this bet.
>
> **What we found.** Neither of those two counts recorded anything about who caused it. They were the
> last two on the site like that; everything else already says whether it came from a person's browser
> or from a machine.
>
> **Why that is worse than it sounds, and it is not a paperwork problem.** Email links are fetched
> automatically before anyone reads the message — by spam filters, corporate security scanners, and by
> Slack or WhatsApp when the link gets pasted somewhere. That is ordinary infrastructure, not an
> attack. But our sign-in link works on being fetched: whatever opens it gets signed in and lands on
> the desk. **So a security scanner opening the welcome email could have flipped our activation number
> from 0 to 1, and it would have looked exactly like our first real user.** It would have happened on
> the very first person we admitted — the one moment nobody would think to question it.
>
> **What we did.** Both counts now record two things. The weaker one is whether the fetcher declared
> itself a machine — easily faked, there for consistency. The stronger one is whether a person actually
> *clicked* something: browsers say so explicitly, and nothing automated does. That second marker is
> what catches the realistic case, because a scanner pretending to be Chrome defeats the first one.
>
> **What we deliberately did not do: add a "click here to continue" step.** That is the standard fix
> for this problem, and it would work. We turned it down. Activation is at zero, so one person who
> gives up at an extra click — or gets wrongly turned away — costs more than every mislabelled sign-in
> combined. **The site now labels sign-ins; it never blocks them.** A test will fail if any future
> change makes it block one.
>
> **Something that went wrong in our own checking, reported because it went wrong.** We test these
> fixes by deliberately breaking them to confirm the tests notice. Five attempts, four caught — and
> the fifth was not. One of the new markers could be deleted entirely with every test still passing,
> because all of them happened to use a normal browser. That is the *same* mistake this run was written
> to point out, made inside the run pointing it out. It was found before anything shipped, and fixed.
>
> **Nothing about Wednesday's measurement moved.** Not one line of the landing page changed, so the
> reading due **18 September** is unaffected.
>
> **Previously (run 141, 2026-09-06 08:35 Sydney).** The application form was the only counter on the
> site that recorded nothing about where an application came from — so a script could have written an
> entry that arrived looking exactly like a real person. It survived 140 runs because it had only ever
> counted zero, and a counter that has only ever said zero looks exactly like a correct one.
> Applications now carry the same two markers, and here too the site labels and never refuses.
>
> **Previously (run 140, 2026-09-05 20:25 Sydney).**
>
> # **The one test that could tell us our new measurement is working had been broken by that same measurement, since the day it shipped. Nothing failed, because nothing ran it.**
>
> **[§1](#1-owner-action-required) is ONE, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, which only you can make. **That section had wrongly read NONE for
> three runs; it is corrected below and named rather than quietly fixed.** This run changed no product
> behaviour, published nothing, submitted nothing and spent nothing.
>
> **The background.** For nineteen days, everything this loop did rested on one claim: *the landing
> page isn't the problem, getting anyone to it is.* Yesterday we found that claim was resting on a
> counter that couldn't actually test it, and shipped a new one — `landing_render`, which fires when a
> real browser runs the page, as opposed to something merely downloading it. The reading it feeds is
> due **18 September** and it decides where the last weeks go.
>
> **What we found today.** Adding that counter broke the only check in the repository that could
> confirm it works — a browser test that asserted *nothing fires on page load*, which the new counter
> does by design. That test is run by hand, not automatically, so nobody ran it and nothing went red.
> Every routine gate stayed green the whole time, because they only check that the *instruction* is in
> the page, which is equally true of a page that crashes before reaching it.
>
> **Why that mattered more than it sounds.** The experiment already anticipates *"the counter never
> worked"* as a possible outcome — but as written, we'd only have discovered it **on 18 September**,
> and these counters cannot be backfilled. A silent failure would have cost the whole fortnight, with
> 30 days left on the clock.
>
> **What we did.** Fixed the browser test, then ran it against the live site: a real browser loaded
> justtuned.com, the counter fired once, and the server accepted it — with no errors on the page. **So
> that failure is ruled out on day 1 of 14 rather than day 14.** We also added two small automatic
> checks that will fail the build the next time this test drifts out of date, so it can't go stale in
> silence again. The test browser identifies itself as automated, so nothing it did counts toward the
> real reading.
>
> **Said against our own interest.** The new counter is *supposed* to run before anything else on the
> page, and it doesn't quite — about fifteen lines run first, and if any of them ever fail, the counter
> stays silent while the visit still counts. That would push the result **toward the answer we already
> believe**. The fix is two lines and **we deliberately didn't make it**: changing the page mid-measurement
> would split the fortnight into two halves that can't be compared. Today's run confirms it isn't
> happening, we'll re-check twice more, and we've written down in advance exactly what would make us
> change it anyway.
>
> **Previously (run 84, 2026-08-24 20:30 Sydney).**

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

### **TWO now, and the new one is a question rather than a chore.** — raised 2026-09-06 20:20 Sydney (run 143)

**Card 2 of 2 — new. May Tuned be suggested to `ooh.directory` at all?** This is **not** a repeat of
the card below and it needs no account, no paste and no two minutes — **one word on
[issue #1](https://github.com/in-c0/tuned/issues/1) settles it.** Full packet:
**[SUBMISSION-ooh-directory.md](SUBMISSION-ooh-directory.md)**.

| | |
| --- | --- |
| **The question** | ooh.directory is a **human-curated blog directory**. Its FAQ admits link blogs *"only if they include original commentary about each link"* — `/sportstech` meets that on its face, because every item carries a `why` line. **But that commentary is written by an agent.** The page says so with an `AI AGENT` badge, so nothing is concealed from a curator reading it, and the FAQ has no clause about machine-written text either way. **Silence is not permission**, and suggesting an agent-written blog in your name is your call, not mine. |
| **What I need** | **`A`** — proceed, and the packet becomes a paste like the card below. **`N`** — retire it, and the file is deleted permanently. Either answer is a good outcome; the card standing open is the only bad one. |
| **What I already did, so the answer is all that is missing** | A5 is **closed**: `arrival:ooh-directory` now writes on the exact URL this venue takes, with five tests, and [EXP-012](EXPERIMENTS.md) registers the threshold, the window, six outcomes and **two** controls — all **before the counter had ever been written**, because counters do not backfill and a suggestion is spent once. |
| **What I did not do** | **Nothing was submitted and no venue was contacted.** Registering the tag authorizes no submission, and the commit says so. |
| **The honest expectation** | The venue tells you in advance that most suggestions are never reviewed: *"Suggesting a blog does not guarantee it will appear on the site."* EXP-012 registers **never-listed** as the *expected* outcome, in which case **nothing is graded** and no conclusion about demand is drawn in either direction. |

**And the thing worth saying plainly alongside both cards.** After this run there is **no distribution
work left that I can perform**. Every remaining step at every candidate is A0 (an account I do not
hold) or A2 (an authorship decision that is yours). **29 days remain; `applications` 0, active members
0, followers 0, AUD $0.** Improving the product further cannot change any of those, because nobody has
been shown it.

---

### **ONE, and it has no deadline.** — raised 2026-09-04 20:35 Sydney (run 137) · **preconditions re-verified 2026-09-14 (run 160)**

**Submit `/sportstech` to `plenaryapp/awesome-rss-feeds`, whenever you next have two minutes.** Field
values and both paths: **[SUBMISSION-awesome-rss-feeds.md](SUBMISSION-awesome-rss-feeds.md)**. It is a
paste, not a research task.

| | |
| --- | --- |
| **Verified today, not ten days ago** | Run 160 re-read both cheap preconditions from source, which the packet had been asking for since 2026-09-04 and which no run had done. **A4 has doubled** — **8** publications in the trailing 30 days against a bar of one, where the packet was written on four ([34831621225](https://github.com/in-c0/tuned/actions/runs/34831621225)). **No duplicate** at the venue, open or closed ([34831864620](https://github.com/in-c0/tuned/actions/runs/34831864620)). Both held; nobody knew that until today. [L-78](LESSONS.md#l-78). |
| **Is this new?** | **No.** Your `A` of 2026-08-20 15:04 UTC already authorizes it. Nothing here needs a reply — only the act, or one comment retiring the card permanently. |
| **Why it is live again after four dead windows** | The condition that closed all four was **this loop's own threshold**, not the venue. A4 tested *"newest item ≤ 72h at the moment of posting"* — right for a burst venue, wrong for a directory entry that is read for months. Run 137 split it by venue shape; `/sportstech` passes the durable-listing test on four publications in the trailing 30 days. **There is no expiry instant any more, so there is no window to miss.** |
| **The remaining blocker, and it is not yours** | This executor can perform no write at any third party — re-tested four times, byte-identical refusal. The submission is **correct and unmakeable by the loop.** |
| **If you would rather not** | One comment on [issue #1](https://github.com/in-c0/tuned/issues/1) retires the card and the packet permanently. A decision either way beats the card standing open. |

**Corrected at run 140:** this section still read **NONE** for three runs after run 137 re-opened the
card. [STATUS.md](STATUS.md) was right throughout and this mirror was stale — exactly the failure the
header warns about, so it is named here rather than quietly overwritten.

---

**Kept below and no longer live — the retirement notice from run 123.**

### **NONE.** *(superseded by the card above)*

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

**Two are open.**

- **EXP-013 — can an agent feed publish on a cadence with no person selecting? OPEN. Reading due on
  the complete 14 days 2026-09-12 … 2026-09-25** (run 153, pre-registered **in the same commit as the
  bar, before it had screened a candidate**). Canonical: [EXPERIMENTS.md](EXPERIMENTS.md).
  `@sportstech`'s publisher was a scheduled executor run doing a cycle whenever it chose to — six
  publications in 24 days. It now has a selector: a remit translated into an explicit public bar,
  applied to the **open-access full text the agent fetches for itself**, publishing at most **one**
  find per run through the operator plane. **Interim, and not a graded reading:** threshold 1
  satisfied, threshold 3 satisfied (item **280** carries its provenance on feed page and RSS, 15
  assertions green), **threshold 2 FAILED at 25.7% against a 25% bar** so Fork B was taken and
  scheduled runs now publish nothing, threshold 5 is the one that caught the defect — four clinical
  rehabilitation papers in the first screen's ten selections — and **threshold 4 cannot be met while
  the schedule is disarmed.** What is demonstrated is the capability, not yet the cadence. **None of
  it is demand:** `followers` is **0**, so no subscriber noticed.

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
  must not change, and `landing_render` must not fire from any other page. **Run 140 — R-D is ruled
  out at the emitter on day 1 of 14.** A real Chromium against live justtuned.com
  ([33959936807](https://github.com/in-c0/tuned/actions/runs/33959936807)) emitted `landing_render`
  on a bare page load, production answered **204**, it fired exactly **once**, and the page threw
  **no errors**. The check that produced this had itself been broken since the counter shipped and is
  now guarded by two CI-visible invariants ([L-56](LESSONS.md)); **two more brackets are registered,
  one inside the window and one on 2026-09-19 before the reading.** Our QA browser declares itself
  automated, so its increments land in the `_bot` names and **never in the numbers R is computed
  from** — overriding that identification on any spec fires **R-E**. Carried as a known, measured,
  deliberately unfixed hazard: the beacon is top-level but not first, so a throw in the ~15 preceding
  lines would suppress it and bias **R toward R-A, the answer we already hold**; hoisting it is
  declined inside the window, and the registered trigger to do it anyway is any page error preceding
  the render pulse in any bracket.
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
| **L-83** | **The addresses shipped, and nothing on the site pointed at them.** [L-82](LESSONS.md#l-82) closed the defect it named — 87 finds, 87 URLs, `sitemap.xml` from 8 entries to 95. For one day that was the whole of it: `card()` wraps a feed card in an anchor to the **source**, so **no page on this service linked to any find page.** A crawler following links from `/` reached none of them and a visitor could not obtain a find's URL. Run 164 had asked the right question one level too low — it linked the find pages **to each other**, which makes a connected component, not an edge from the rest of the site, and an island whose members all link to one another is still an island. Every check written that run was scoped inside the new surface; none asked what points *in*. Cost carried, not paid: **0 inbound links** against 95 sitemap URLs. | **Shipping an address is half a change; the other half is something that points at it.** A URL nothing links to is reachable only by whoever already has it — and "it is in the sitemap" is an answer about machines only. Shipped: a `permalink` chip on every feed-page card, **opt-in per call site** because `landingPage` renders its demo through the same `card()` and is frozen until EXP-011's reading on 2026-09-19 — byte-identity asserted by a test, not inspected. Deliberately the **second** affordance: the card's own click still opens the source, and both a test and the production step fail if it ever becomes a Tuned path. `item_view_onsite` keeps run 164's registered off-site reading computable as `item_view − item_view_onsite`. **Nine mutations, nine named tests red.** **Caught by the browser and by nothing else, for the second run running:** the chip first sat top-right with `padding-right` reserving space on `.meta`; every unit test passed and Chromium showed it **on top of** "via @scout" — a flex item that cannot shrink below min-content width overflows the padding meant to hold it back. **Not claimed:** this creates an inbound path, not traffic. |
| **L-82** | **The product published 87 units of value and gave none of them an address.** `items` held 87 rows at `visibility = 'public'` and the route table had an address for none; a find was reachable only *inside* `/:handle`, a document that changes under it, so `sitemap.xml` advertised **eight URLs** as the complete indexable surface of a service whose entire output is published attention. Every check this loop owns asks whether a *surface* behaves — all green, on all five feeds — and **none asks whether the thing the product makes can be pointed at.** Three failures wore one face: nothing indexable, nothing shareable, no arrival attributable to a find. | **Ask what the product's unit of value is, then ask whether that unit has a URL.** Shipped: `GET /:handle/:id`, whose subject is the **provenance chain** — observed by an agent → read and chosen by a member → published on a date — with the source's title held to the minimum needed to say which thing, the outbound link as the primary action, and the boundary in the page's own words: *Tuned does not host this and did not write it*, asserted by a test **and** by the production check. An address **is** publication, so the route 404s a `hidden` or `queued` row and the sitemap omits it — two gates asserted separately. **Seven mutations, and two found real defects:** the sibling block was rendered through `card()` and so connected nothing, and the id guard `\d+` gave `042`, `4.2e1` and `0x2a` each a second address for row 42. |
| **L-81** | **The route inventory enumerates writers, and the gap it could never see is a table whose only reader is `COUNT(*)`.** [L-61](LESSONS.md#l-61) found `POST /:handle/follow` writing nothing, and run 146's answer was to enumerate every route and what it writes. The same class of defect was on the funnel's second stage the whole time: **`POST /waitlist` has written every application since 2026-08-06 into a table read by exactly one thing — `SELECT COUNT(*)` in `src/metrics.ts`.** No surface returns a row; `src/operator.ts` says in its own header that the operator key cannot read a member email; `/api/metrics` is aggregate-only by design. And `POST /api/members`, the admission act, **takes an email**. Both sweeps enumerated the right set and asked the wrong question of it — **neither asks what reads what is written** — and the row written alongside a counter is not a counter. Cost **carried, not paid**: `applications` is 0, so nothing was lost; an unreadable table and an empty one serialise identically, which is why forty days passed without it being felt. | **A write with no reader is storage, not instrumentation; the test that a conversion stage works is that the stage *after* it can consume what the stage *before* it produced.** Shipped: `GET /api/applications`, gated on the existing `ADMIN_KEY` (no new secret, no address reachable by anyone who could not already read it), **503 while unset** and 401 on a wrong key, returning the applicant's own submission plus `admitted` — the address matched against `members`, the one fact `POST /api/members` needs and the count cannot carry. `total`/`pending` count the whole table, never the returned page. **Four mutations, four named tests red**, including `pending` returned uncoerced: SQLite's `SUM` over zero rows is `NULL`, and the empty table is the state this ships against. The suite runs end to end **through `POST /waitlist`**, not against rows it seeded itself. **Not claimed, and it is the larger half:** there is no mail provider and no sender in `src/`, so the `login_url` admission returns still cannot be delivered — an application is now *visible*, not *answerable*. |



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
| **Last materially updated** | 2026-09-16 14:35 Sydney (2026-09-16 04:35 UTC) |
| **Run** | 165 — **the addresses shipped yesterday, and nothing on the site pointed at them.** Run 164 gave all 87 published finds a URL and grew `sitemap.xml` from 8 entries to 95; for one day the only route in was that sitemap, because a feed card is an anchor to the **source**. A crawler following links from `/` reached no find page and a visitor could not obtain one's URL. A `permalink` chip on every feed-page card closes it; the card's own click still opens the source, asserted by a test and by the production check. `item_view_onsite` splits the on-site arrivals this creates from the off-site ones run 164's reading depends on. [L-83](LESSONS.md#l-83). |
| **Run 164** | **Tuned had published 87 finds and given an address to none of them.** `GET /:handle/:id` plus one sitemap entry per published find; the page's subject is the provenance chain and it states *"Tuned does not host this and did not write it"* in its own words. [L-82](LESSONS.md#l-82). |
| **Run 163** | **the funnel's second stage wrote to a table its third stage could not read.** `POST /waitlist` has saved every application since 2026-08-06 into a table read by exactly one thing, `SELECT COUNT(*)` in `src/metrics.ts`; no surface returned a row, while `POST /api/members` — the act that admits somebody — takes an **email**. An unreadable table and an empty one serialise identically, which is why forty days passed without it being felt. `GET /api/applications` closes the read half. [L-81](LESSONS.md#l-81). |
| **Repository commit at time of writing** | run 165's inbound edge — `src/pages.ts` (an opt-in `permalink` on `card()`, threaded from `publicPage` only, plus a page-scoped `FEED_CSS`), `src/index.ts` (`onsite()` and the `item_view_onsite` axis), `test/find-inbound.test.ts` (+10 tests, **nine mutations each turning a named test red**) and a `verify-production` step asserting the edge from the other end. **The landing page is byte-identical** — it renders its demo through the same `card()` and is frozen until EXP-011's reading on 2026-09-19 — and that is asserted by a test rather than inspected. Earlier: run 163's reader — `src/index.ts` (`GET /api/applications`, key-gated and fail-closed), `test/applications.test.ts` (+13 tests, four mutations each turning a named test red) and `test/route-inventory.test.ts` (the route classified `uncounted` with its reason; confirmed load-bearing by deleting it). **No page, counter, schema, secret, privacy statement or public surface was touched**, so nothing a visitor can reach behaves differently. |
| **Data commit** | [`09b0ea8`](https://github.com/in-c0/tuned/commit/09b0ea8) — [`metrics/latest.json`](metrics/latest.json), snapshot of `2026-09-15T23:08:34.556Z`. **No commercial metric moved this run and none is claimed.** Nothing was published, amended, retracted or restored. |
| **Freshness state** | **RESYNCHRONIZED for the header, §7 and §8, and not for §1–§6.** §1 is TWO and unchanged since run 143 and is not re-argued, per [L-07](LESSONS.md). §4's funnel figures are unchanged: `applications` 0, `members` 1, `members_ever_active` 0, `followers` 0, gross cash AUD $0 — read from the same snapshot as the data commit row. |

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

---

## 2026-09-07 (run 144) — the attention counters can now say whether the star was ours

Mirror only; canonical in [METRICS.md](METRICS.md) and [DECISIONS.md](DECISIONS.md).

| Row | Was | Is |
| --- | --- | --- |
| Attention actions since instrumentation | **0** — `attention_star` / `attention_skip` never fired | **0**, and now separable: `attention_star` moving while `attention_star_owner` does not is **the first non-owner star** |
| Stars · skips, all time | **8** · **33**, first-party by assumption | **8** · **33**, first-party **by reading** — `totals.stars_owner` / `skips_owner` computed from `reads`, retroactively over the whole history |
| Can a first activation be told from our own use? | **no** | **yes, while `totals.owner_resolved` is 1.** On a 0 day it is **no**, and the snapshot says so rather than leaving it to be inferred |

**Nothing commercial moved.** `applications` **0** · `members` **1** · `members_ever_active` **0** ·
`active_last_7d` **0** · `followers` **0** · gross cash **AUD $0**, from *no billing exists*. Spend
this run **AUD $0.00**; running total **AUD $0.00 of $500**.

**The one thing worth carrying out of this run:** the instrument sweep is **finished** — no counter on
any route is undiscriminated. Distribution is A0/A2 and both are yours; the landing page is frozen by
[EXP-011](EXPERIMENTS.md)'s own stop conditions until **2026-09-18**. **28 days remain, every standing
figure is zero, and the two cards in [§ OWNER ACTION REQUIRED](STATUS.md) are the only things on this
board that can change that.**
