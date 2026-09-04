# Distribution — channel admissibility register

**Standing:** every public distribution channel must pass the test below **before** it is proposed to
the reviewer, drafted, or shown to the owner. A channel whose admissibility is unstated is not ready
to be authorized, however well-checked its claims are ([L-17](LESSONS.md)).

**This file authorizes nothing.** It records which channels *could* be used and what is still false
about each. Posting anywhere still needs a review authorizing that specific channel, and any text a
human publishes under their own name is written by that human — not by this executor
([doctrine: humans contribute attention, not content](NORTH_STAR.md)).

**Created 2026-08-16 (run 46).** No channel is admissible today, and the binding condition is not the
one this loop spent five days on.

---

## Why this file exists

[EXP-002](EXP-002-PACKET.md) — a Show HN — was the loop's single top blocker for five days. It was
authorized on 2026-08-08, pasted on 2026-08-13, killed at submission, and then found on review to be
**unpublishable on the venue's own rules regardless of what moderation said**: an AI-written body the
owner was instructed to post as their own comment, and an application-gated landing page as the
submitted URL. Either defect alone disqualifies it.

The trap that was one step from springing: a withdrawn post and a *graded-failure* post produce the
**same observable** — flat counters, zero applications. Restoring the item would have started a
48-hour clock over an inadmissible submission and written *"the Show HN produced no measurable
arrivals"* into durable state as a finding about Tuned's positioning. It would have been a finding
about a packet this executor wrote wrong.

[L-17](LESSONS.md)'s prescription is this file: *pre-register a channel's admissibility conditions
alongside its thresholds, at the moment of pre-registration.*

---

## The admissibility test

Five conditions. **All five, or the channel is inadmissible.** Each is checkable before a word is
drafted, and each names what counts as evidence — an unevidenced pass is a fail.

### A1 — The venue permits a post of exactly this form, by exactly this author

*The question:* do the venue's own published rules allow this post type, about a product, by someone
connected to it?

*Why:* run 19 verified EXP-002's **claims** — the apply path in a real browser, the RSS promise from
a datacenter client — and run 20 canonicalized it. Nobody checked its **compliance**, because the
loop treated *"is every sentence true?"* as the whole of *"is this postable?"* A truthful post into a
channel that forbids its form is still unpostable, and the rules were readable the entire time.

*Evidence required:* the venue's rules **quoted verbatim in this file, with the URL and the date
read**. Not paraphrased, not recalled.

*Standing obstacle, and the mechanism around it:* this executor's egress proxy answers **403 CONNECT**
to every external host — re-tested 2026-08-16, **35 consecutive runs**, and confirmed this run for
`WebFetch` as well as `curl` (`news.ycombinator.com` → `EGRESS_BLOCKED`, `example.com` → refused
identically, so it is the general allowlist state and not a venue-specific rule). That is a reason
the read is awkward, **not a reason to skip it** — the loop has read from GitHub's network since run
26 precisely for this. Rules are read from a workflow run on GitHub's network and quoted here with
its run link.

### A2 — Authorship is permitted, and correctly attributed

*The question:* does the venue allow machine-written text at all; and if a human posts it, are the
words genuinely theirs?

*Why:* EXP-002 inverted the product's own doctrine — the machine produced the words and the human
supplied only the account. That is a boundary question the doctrine already answers.

*Evidence required:* a statement of who writes each posted string. **Where a human posts under their
own name, this executor drafts, rewords and edits nothing** — it may supply facts, links and figures
to be checked, and no sentences. Where the venue permits disclosed machine authorship, the disclosure
is part of the post.

### A3 — The destination is directly usable by a stranger

*The question:* can a reader who arrives do the thing **without applying, signing up, or waiting for
approval**?

*Why:* the submitted URL is what the rule is about. Mentioning a usable page elsewhere in the post
does not fix a gated submitted URL.

*Evidence required:* the exact URL, and a check that it renders and works for an unauthenticated
client.

### A4 — The destination is not stale on arrival

*The question:* is what the stranger sees actually current, or does the post's claim become false the
moment it is read?

*Why:* [L-18](LESSONS.md). The landing page once headed its demo *"Live demo — a real feed, right
now"* while the newest item under it was **11.3 days old** and the page's own script stamped
*"11d ago"* directly beneath the word *now*. At least 431 human-shaped views arrived in that state. A
distribution attempt aimed at a dead feed does not test the product; it tests whether people will
recommend a corpse.

*Evidence required:* the destination's publication record, timestamped, read from production within
the same cycle as the post.

*Threshold — split by venue shape, 2026-09-04 (run 137). The question is unchanged; the original test
was valid for only one of the two shapes and was applied to both.* See
[the correction below](#a4-was-measuring-the-wrong-instant-for-half-the-register--2026-09-04-run-137)
and [L-54](LESSONS.md).

| Venue shape | When its readers arrive | Test |
| --- | --- | --- |
| **Burst** — the post is read in one window and then falls off a feed (Show HN, Reddit, Product Hunt, any social repost) | ≈ the moment of posting | **Unchanged: newest public item ≤ 72 hours old at the moment of posting.** Arrival ≈ posting, so a point-in-time reading *is* what the stranger sees. |
| **Durable listing** — the entry persists and is read for months (`awesome-rss-feeds`, `ooh.directory`, any directory or awesome-list) | spread over months, mostly long after posting | **Cadence: ≥ 1 public item in the trailing 30 days AND ≥ 3 in the trailing 90**, re-read from production in the same cycle as the post. |

*Why the burst threshold is 72 hours:* the product's promise is a *morning* queue: a destination whose
freshest item predates the reader's last three mornings contradicts the offer on sight.

*Why a durable listing needs a different test rather than a looser one:* its readers do not arrive at
the moment of posting, so **the age of one item on the day of submission predicts nothing about what
the 400th reader sees three months later.** A point-in-time test does not achieve A4's own stated goal
for this shape — it is aimed at the wrong instant, not merely set too tight. What does predict it is
**whether the feed keeps publishing**, which is what the cadence bar measures.

*Why 30/90 specifically, and that it is stricter than the only venue rule this register has quoted:*
`ooh.directory` states its own freshness bar — *"updated within the past couple of months"*
([source read 32307232421](https://github.com/in-c0/tuned/actions/runs/32307232421), read 2026-08-19).
30 days is roughly half that. `awesome-rss-feeds` publishes **no** freshness rule, so the loop sets its
own and sets it below the only quoted comparator rather than at it. The bar still expires — a feed that
stops publishing fails it within 30 days — and any single on-remit publication re-satisfies it.

*What this does not change.* It is a test of the **destination**, and nothing else. A0 (this executor
can perform no write at any third party) and A2 (authorship, and whose account posts) are untouched, so
**this correction authorizes no submission by this executor and moves no other condition.** That it
hands the ability to act to the owner and not to the loop is the reason it can be trusted as a
correction rather than a convenience.

### A5 — A null result is separable from an inadmissible one, and a positive result is visible

*The question, in two halves.* If the attempt returns nothing, can we tell *"nobody wanted it"* from
*"it was never admissible"*? And if it works, would we **see** it?

*Why the first half:* an inadmissible attempt produces no evidence about demand in either direction,
and recording it as a negative result is worse than recording nothing — a fabricated negative closes
a question that was never opened.

*Why the second half — this is new, and it is the failure this register found rather than inherited:*
`feed_view` is a **single site-wide counter**. It does not split by handle and carries no referral
tag ([`src/index.ts:672`](../src/index.ts)). Its human-flagged daily readings over the last ten days,
sorted, run **2, 3, 5, 8, 11, 14, 15, 15, 21, 22** — a range of 2 to 22 against a bot-flagged
counterpart that has run as high as 32. (Two of the ten are partial days — the counter's deploy day
and the day read at 20:53 UTC — and neither is the maximum, so the range is not inflated by them.) **A cohort of a dozen real arrivals would land inside that noise band and
be indistinguishable from a quiet Tuesday.** So the loop could run an admissible attempt into a live
channel, succeed modestly, and be unable to prove it — the same ungradeability as L-17, one layer
further out.

*Evidence required, before any post:* a counter that moves **only** for arrivals from that attempt,
and a pre-registered arrival threshold read against it. It must ship **before** the post, never
after: counters start at zero on the deploy that introduces them and there is no backfill, so a
first attempt made without it is spent and ungradeable. Channels like Show HN can only be spent once.

*State — the instrument exists as of run 48; the threshold does not.* Two counters ship on the feed
route ([`src/index.ts`](../src/index.ts),
[`86cabdd`](https://github.com/in-c0/tuned/commit/86cabdd), PR
[#41](https://github.com/in-c0/tuned/pull/41)):

| Counter | Answers |
| --- | --- |
| `feed_view:<handle>` | which destination was arrived at |
| `arrival:<tag>` | which attempt sent them |

`feed_view` itself is untouched, so the ten-day series this condition was written against stays
comparable across the deploy; the split is additive and the two are **not** additive with each other.
The handle comes from the creator row rather than the request, so one destination cannot accumulate
under as many names as it has spellings. Only allowlisted `?src=` tags are ever written — an
unrecognised tag counts under **no name at all**, never an "other" bucket, because a tag reading zero
for want of registration must not be mistakable for a tag reading zero for want of demand. Both keep
the bot/human split: a posted link is crawled within seconds, and a counter that could not separate
the sweep from the readers would overstate the first hour of any attempt graded against it.

*What run 46 got wrong here, recorded because it cost two runs.* This section previously read *"it is
not built here, because its correct shape depends on the channel chosen — a per-handle split and a
`?src=` tag answer different questions — and building the wrong one costs more than waiting."* They do
answer different questions, and that is the reason to build **both**: they are two dimensions of one
event, not two candidate designs to choose between. The tag *value* differs by channel; the mechanism
does not. See [L-26](LESSONS.md).

*Still outstanding, and it is the half that needs a channel:* **the arrival threshold and its window
are not pre-registered**, because a threshold is a claim about how many people a specific venue should
send and there is no venue yet. A5 therefore still **FAILS** — on the threshold, no longer on the
instrument. Registering the channel's tag in `ARRIVAL_TAGS` is a one-line code change and belongs in
the same cycle as pre-registering its threshold.

---

## Standing state of the shared conditions — 2026-08-16

A3, A4 and A5 are properties of Tuned, not of any venue, so they gate **every** channel at once.

| | Condition | State | Evidence |
| --- | --- | --- | --- |
| **A3** | A stranger can use the destination | **SATISFIED** | `/ava`, `/sportstech` and the other public feeds render with no account and no application; [EXP-004](EXPERIMENTS.md) PASSED (run 19), and `/:handle` + `/:handle/rss.xml` are unauthenticated routes |
| **A4** | Destination fresh, ≤ 72h | ~~**FAILS — every feed**~~ ~~**SATISFIED for `/sportstech` … until 2026-08-24 09:35:56 UTC**~~ ~~**LAPSED at that instant (run 83), unused. FAILS for every feed again**~~ ~~**RE-SATISFIED for `/sportstech` at 2026-08-24T21:43:45.078Z (run 85), lapses 2026-08-27T21:43:45Z**~~ ~~**LAPSED at that instant (run 103), unused. FAILS for every feed again.** **Third lapse; the first was 2026-08-21T04:15:49Z, the second 2026-08-24T09:35:56Z.**~~ — ~~**RE-SATISFIED for `/sportstech` at 2026-08-28T04:14:13.569Z (run 106), lapses 2026-08-31T04:14:13Z.**~~ — **LAPSED at that instant (run 123), unused. FAILS for every feed again.** **Fourth lapse; the first three were 2026-08-21T04:15:49Z, 2026-08-24T09:35:56Z and 2026-08-27T21:43:45Z.** Retirement effected `2026-08-31T04:16:00Z`, after the instant rather than in anticipation of it, on the [reviewer directive of `03:32:23Z`](https://github.com/in-c0/tuned/issues/1#issuecomment-5473352662); issue #1 re-read at `04:16:00Z` held **230 comments** and **no venue URL**, so no qualifying submission was created before expiry. The owner card retired to **NONE** with the owner's **A** preserved and the `awesome-rss-feeds` candidate **PAUSED, not dropped**; [EXP-009](EXPERIMENTS.md) Reading 2 stays **Fork D / PENDING — inadmissible, not a demand null**. **Nothing was published to hold the window open** ([EXP-008](EXPERIMENTS.md)'s binding clauses), and **no demand is inferred from the lapse in either direction.** Item **248**, published from a page-level read of a peer-reviewed Frontiers article after four candidates were rejected on remit clauses and a fifth was rejected on a sentence in its own abstract; the case against it was committed **50.569s** before the dispatch ([`a676047`](https://github.com/in-c0/tuned/commit/a676047)). Counts moved by exactly one — `public_items` 14 → 15, `operator_publications` 3 → 4 — read from `list` [33141249807](https://github.com/in-c0/tuned/actions/runs/33141249807) at 04:14:47Z against the pre-dispatch [33141193861](https://github.com/in-c0/tuned/actions/runs/33141193861) at 04:13:36Z. **The 78.4-hour reading that preceded it was taken from production this run, not carried forward.** **Still FAILS for every other feed**, `/ava` included. The owner card retired with the owner's **A** preserved and the `awesome-rss-feeds` candidate **PAUSED, not dropped**; [EXP-009](EXPERIMENTS.md) Reading 2 stays **Fork D / PENDING — inadmissible, not a demand null**. Item **247**, published from a page-level read of a peer-reviewed Frontiers article after four candidates were rejected on remit clauses and two were refused by their host; the case against it was committed 19.078s before the dispatch ([`1692fc6`](https://github.com/in-c0/tuned/commit/1692fc6)). Counts moved by exactly one — `public_items` 13 → 14, `operator_publications` 2 → 3 — read from `list` [32781124002](https://github.com/in-c0/tuned/actions/runs/32781124002) at 21:44:49Z against the pre-dispatch [32780854198](https://github.com/in-c0/tuned/actions/runs/32780854198) at 21:41:47Z. **Still FAILS for every other feed**, `/ava` included. Superseded text follows, including the landing page's own demo destination and `/ava`. **Not a defect and not a regression:** A4 decays by construction whenever nothing new is worth publishing, and no publication was made to hold it open ([EXP-008](EXPERIMENTS.md)'s binding clauses). **Second lapse; the first was 2026-08-21 04:15:49Z.** It is restored only by a find that clears its feed's remit on its own merits, which is not scheduled | `@sportstech` newest public item **2026-08-21T09:35:56.549Z** — item 246, run 65, `list` [32468701244](https://github.com/in-c0/tuned/actions/runs/32468701244). **One durable claim here was false and is corrected rather than deleted:** this row read *"[EXP-004](EXPERIMENTS.md) established the landing page's demo link resolves to `/ava`, not `/sportstech`"*. The demo block is picked at request time as the feed with the **newest public item** (`src/index.ts`, the run-33 fix), so it switched to `/sportstech` the moment item 242 published on 2026-08-18 — and nothing re-read it for three days. Read from the live landing HTML this run: `demoHandle: "sportstech"`, `demoBlockAgeHours: 0`, `demoIsFreshest: true` ([qa-browser 32468714667](https://github.com/in-c0/tuned/actions/runs/32468714667)). `@ava` is still **2026-08-02T03:33:44Z** (462.1h) and a direct `/ava` link still fails. [L-42](LESSONS.md). Superseded evidence: `@sportstech` **2026-08-18T04:15:49.089Z** (item 242), and **2026-07-30T22:48:09.614Z** read by [run 31877383247](https://github.com/in-c0/tuned/actions/runs/31877383247) |
| **A5** | A result would be visible | ~~**FAILS — threshold unregistered.** The instrument half is **SHIPPED**~~ **This row was wrong, and run 56 found out why.** The instrument half was shipped **for the HTML feed page only**; `GET /:handle/rss.xml` wrote no counter at all. For the one candidate whose A1 did not close it — a directory of **RSS feeds** — A5 was therefore not *unregistered*, it was **unsatisfiable**. Now: **instrument SHIPPED for both surfaces, threshold PRE-REGISTERED for `awesome-rss-feeds`** | Run 48 shipped `feed_view:<handle>` and `arrival:<tag>` ([`86cabdd`](https://github.com/in-c0/tuned/commit/86cabdd), PR [#41](https://github.com/in-c0/tuned/pull/41)) — HTML page only. Run 56 shipped `feed_fetch`, `feed_fetch:<handle>` and `arrival_fetch:<tag>` on the RSS route, allowlisted `awesome-rss-feeds`, and pre-registered [EXP-009](EXPERIMENTS.md)'s thresholds **before** any submission (PR [#49](https://github.com/in-c0/tuned/pull/49)). Still **FAILS for every other candidate** — a threshold is per-attempt and none is registered for any other venue |

**A3 was the condition this loop believed was binding, and it is the one that already passes.** The
public, no-account surfaces have worked since run 19. What EXP-002 lacked was not a usable
destination — it was pointing at the wrong one.

---

## What this forces, in order

1. **No channel is admissible today**, and no channel becomes admissible by writing better copy. A4
   fails for every destination Tuned has.
2. **The first operator publication is not capability polish — it is the precondition for standing
   blocker #1.** [EXP-008](EXPERIMENTS.md) is currently framed as evidence that the control plane can
   publish. It is also the only thing that can move A4 from FAILS to SATISFIED, which makes it the
   gate on every distribution attempt. That reorders the dependency graph and is the most useful
   thing in this file.
3. ~~**A5's instrument must ship before the post, not with it.** One bounded change, non-landing, whose
   shape is decided when the channel is.~~ **Instrument shipped run 48** — `feed_view:<handle>` and
   `arrival:<tag>`, non-landing, deployed and verified in production before any channel exists. What
   remains of A5 is the **arrival threshold**, which genuinely cannot be written without a venue: it
   is a claim about how many people that venue should send. Register the channel's tag in
   `ARRIVAL_TAGS` in the same cycle as its threshold, and both still precede the post.
4. ~~**Only then** are A1 and A2 worth the read for a specific venue.~~ **Reversed 2026-08-19 (run
   54): A1 goes first, not last.** An A1 read is free, needs no account, moves no counter and cannot
   spend a channel; A5's threshold is a per-venue claim that is thrown away entirely if the venue
   forbids the post. Read the rules from GitHub's network and quote them here — never recall them —
   **before** any threshold work for that venue. Two candidates were closed this way at a cost of
   three dispatches ([L-33](LESSONS.md)). A2 still follows A1, because a venue that forbids the post
   makes its authorship moot.

**A note on the pointer this replaces.** [EXP-007](EXPERIMENTS.md)'s Fork A names its next action as
*"the binding constraint is distribution, and it is owner-gated (EXP-002)"*. EXP-002 is
**INVALIDATED / NOT STARTED** and withdrawn, so that pointer resolves to a dead artifact. **No
threshold, fork, read time or claim in EXP-007 is altered by this file** — its pre-registration is
untouched, exactly as run 45 left it. This register is what Fork A's next action resolves to when it
is read on 08-17.

---

## A1 read from a dated source for the first time — 2026-08-19 (run 54)

Every A1 cell in the register below had read **UNREAD** since this file was created on 2026-08-16,
and the procedure above names exactly what would change that: *dispatch `source-read.yml` with the
rules URL, quote from that run's log, cite the run.* Three runs of runs 47–53 named "propose a
channel" as the top item and did something else. **This run performed step 3 instead of naming it.**

Three venues were read from GitHub's network on **2026-08-18** (UTC), one page per dispatch, GETs
only, no link following, no account and no credential:

| Venue | Page read | HTTP | `read_outcome` | Run |
| --- | --- | --- | --- | --- |
| Reddit | `https://www.reddit.com/wiki/selfpromotion` | **403** | `interstitial` | [32191175814](https://github.com/in-c0/tuned/actions/runs/32191175814) |
| Lobsters | `https://lobste.rs/about` | **200** | `page`, 15,676 visible chars | [32191337996](https://github.com/in-c0/tuned/actions/runs/32191337996) |
| Hacker News | `https://news.ycombinator.com/showhn.html` | **200** | `page`, 1,950 visible chars | [32191459880](https://github.com/in-c0/tuned/actions/runs/32191459880) |

**Reading a venue's published rules is not activity at that venue and authorizes nothing** — the
procedure above says so, and it is restated here because one of the three pages is Hacker News'. The
standing hold on *any* HN activity by anyone on the executor's initiative is unchanged: no
submission, no repost, no comment, no contact with moderation. What changed is that the loop's
account of why is now quoted from the venue instead of recalled from its own withdrawal note.

### Reddit — A1 is not merely UNREAD, it is UNREADABLE BY THIS EXECUTOR

The reader was refused before any rule was visible. Quoted from the run log verbatim, the whole of
what the page carried — 221 characters, below the spec's 1000-character floor:

> You've been blocked by network security. To continue, log in to your Reddit account or use your
> developer token If you think you've been blocked by mistake, file a ticket below and we'll look
> into it. Log in File a ticket

**What this is and is not.** It is **not** evidence that Reddit forbids the post; nothing about the
post's form was reached. It is evidence that **the mechanism this file relies on cannot resolve A1
for Reddit at all** — the venue conditions reading its own rules on an account or a developer token,
and this executor holds neither and will not spoof a user agent to get past a refusal
([`qa/source-read.spec.mjs`](../qa/source-read.spec.mjs) refuses to on principle, and that principle
is not being revisited to win an argument about distribution).

So Reddit's A1 moves from **UNREAD — not yet done** to **UNREADABLE — cannot be done by the
executor**. That is a different kind of blocker and it names its own remedy precisely: a human who
holds a Reddit account reads the subreddit's rules and quotes them, or the venue is dropped. It is
recorded as an owner-boundary item rather than a to-do this loop can keep deferring to itself.

### Lobsters — A1 READ, and the answer is no, on the venue's own words

Read cleanly: HTTP 200, title `About | Lobsters`, `read_outcome: "page"`, `interstitial_signals: []`.
**Three independent grounds, each quoted from the log, and any one of them alone is disqualifying.**

1. **Topicality excludes the subject.** *"Lobsters is focused pretty narrowly on computing … Some
   things that are off-topic here but popular on larger, similar sites: entrepreneurship, management,
   news about companies that employ a lot of programmers, investing, world events, anthropology,
   self-help, personal productivity systems …"* — The one destination that currently satisfies A4 is
   **`/sportstech`**, a sports-technology feed. It is not a computing story, and a post about Tuned
   *as a product* is the entrepreneurship case the same sentence excludes.
2. **Self-promotion is capped as a ratio, which a first post cannot satisfy.** *"It's great to have
   authors participate in the community, but not to exploit it as a write-only tool for product
   announcements or driving traffic to their work. As a rule of thumb, self-promo should be less than
   a quarter of one's stories and comments."* — A brand-new account whose first submission is its own
   product is at **100%**, and no drafting fixes an arithmetic condition on an account's history.
3. **Membership is invite-gated.** The page describes *"a user invitation tree to combat spam"*, so
   "by exactly this author" is not a property the executor can establish from outside — it depends on
   whether the owner already holds an account.

**Verdict: Lobsters is INADMISSIBLE, and its A1 is now READ rather than assumed.** This is the first
venue in the register closed on quoted evidence instead of on absence of evidence, and the finding is
a **negative** — which is the outcome this file exists to produce cheaply, before a channel is spent
rather than after ([L-17](LESSONS.md)).

### Hacker News — A1 READ, and it retroactively convicts EXP-002 in the venue's own words

EXP-002 was withdrawn on 2026-08-13 (run 34) as inadmissible, and the grounds were stated from
**recollection** of HN's rules — the exact [L-17](LESSONS.md) error, committed in the act of
correcting an L-17 error. The page is now read, dated and quoted, and the withdrawal holds on the
venue's own text:

- **The submitted URL was disqualified twice over.** *"Please make it easy for users to try your
  thing out, ideally without barriers such as signups or emails."* and, flatly, *"Don't post landing
  pages or fundraisers."* EXP-002's submitted URL was `justtuned.com` — an **application-gated
  landing page**. Both sentences name it.
- **It must be your own work, and you must be present for it.** *"The project must be something
  you've worked on personally and which you're around to discuss."* and *"Don't post
  quickly-generated one-offs; anybody can do that now."* An executor-drafted body posted as the
  owner's own first comment is the shape those sentences exclude.

**And one constraint that is new information rather than confirmation, which is why this read was
worth taking.** *"Show HN is for something you've made that other people can play with … On topic:
things people can run on their computers or hold in their hands … Off topic: blog posts, sign-up
pages, newsletters, lists, and other reading material. Those can't be tried out, so can't be Show
HNs."*

A public Tuned feed is **reading material**. `/sportstech` is a page of links with provenance — the
closest thing in that off-topic list is "lists", and the nearest on-topic category, something you run
or hold, is not what Tuned is. So even with a fresh destination, moderator permission and an arrival
counter — all three of which are absent — **`/sportstech` is not obviously a Show HN at all**, and a
future run that clears the other blockers must answer this sentence before treating HN as reopened.
Recorded now, while nothing depends on the answer.

**Verdict: Hacker News stays INADMISSIBLE**, its A1 is now **READ**, and the reason has widened from
*needs moderator permission* to *needs moderator permission and a destination that is a thing rather
than a reading list*.

### What the three reads together say about the top blocker

**The wall in front of distribution is not drafting, and it is not A4.** Run 53 put A2 — *"every
listed venue requires a human's own words"* — to the reviewer as the single interpretation deciding
what this loop can do, and asked the reviewer to overrule it if they disagreed. **Three reads later
the question is close to moot: A2 was not reached at any of the three venues.** Lobsters fails A1 on
subject matter, Hacker News fails A1 on what a Show HN may be *about*, and Reddit will not state its
rules to this reader at all. A venue that does not permit the post makes the authorship of the post
irrelevant.

That is a correction to this loop's own diagnosis, and it is the useful part of this run: **A2 was
never the binding constraint. A1 is** — and A1 is answerable with evidence rather than with an
interpretation, which is why it should have been read five runs ago instead of argued about.

**No channel is admissible today**, and the register below is shorter in substance than it looks: of
six candidates, **two are now closed on quoted rules**, one is unreadable without an owner's account,
and the rest remain unread. The honest summary is that Tuned has **no identified venue** whose
published rules permit a post about a curated feed by the person who runs it — not "no venue chosen
yet".

---

## A1 read where the venue's subject is a feed — 2026-08-19 (run 55)

Run 54 ended on a statement that was worse news than the loop had been carrying: **Tuned has no
identified venue whose published rules permit a post about a curated feed by the person who runs
it.** It left one instruction with it — *find a venue where a feed is a permitted subject at all, and
if none exists, that is the finding.* This run went looking. Four dispatches: one venue refused the
reader outright, one was read cleanly and answered nothing, one shorter page turned out to need an
account, and the fourth — after the reader was fixed — got the rules.

| Venue | Page read | HTTP | `read_outcome` | Run |
| --- | --- | --- | --- | --- |
| Product Hunt | `help.producthunt.com/en/articles/3615694-community-guidelines` | **403** | `interstitial` | [32214495616](https://github.com/in-c0/tuned/actions/runs/32214495616) |
| awesome-rss-feeds | `github.com/plenaryapp/awesome-rss-feeds` | 200 | `page`, 69,678 chars — **and it answered nothing** | [32214622360](https://github.com/in-c0/tuned/actions/runs/32214622360) |
| awesome-rss-feeds | `…/issues/new/choose` | 200 | `interstitial` — **279 chars** to a logged-out reader | [32214769752](https://github.com/in-c0/tuned/actions/runs/32214769752) |
| awesome-rss-feeds | the README again, `find: "contribut"` | 200 | `page`, rules quoted | [32215103407](https://github.com/in-c0/tuned/actions/runs/32215103407) |

### Product Hunt — A1 is UNREADABLE BY THIS EXECUTOR, the same category as Reddit

The last never-read entry in the register, and the reader never reached a rule. HTTP **403**, title
`Just a moment...`, 266 visible characters, and the whole of what the page carried:

> help.producthunt.com Performing security verification This website uses a security service to
> protect against malicious bots. This page is displayed while the website verifies you are not a
> bot. Ray ID: a2d64936ffeaad44 Performance and Security by Cloudflare Privacy

As with Reddit, this is **not** evidence that Product Hunt forbids the post — nothing about the
post's form was reached. It is evidence that **A1 for Product Hunt cannot be resolved by this
executor.** No user agent was spoofed to get past it, and none will be.

**Two of six candidates now sit in "unreadable" rather than "unread".** That is worth stating as its
own fact: the constraint is not only *what venues permit*, it is increasingly *which venues will
speak to a declared agent at all*. A loop that reads rules honestly, from a browser that announces
itself, is refused by exactly the venues with the most traffic.

### awesome-rss-feeds — the first candidate whose subject is a feed, and A1 says the form is permitted

`https://github.com/plenaryapp/awesome-rss-feeds` — a curated list of RSS feeds and OPML files that
populates the Recommended Feeds and local-news sections of Plenary, an Android RSS reader. CC0-1.0,
2.7k stars, 199 forks. Read 2026-08-19, HTTP 200, `read_outcome: "page"`, `interstitial_signals: []`.

Its stated purpose, quoted from the run log: *"Using Plenary, we are trying to solve discovability of
RSS feeds for first time users."* Its category list includes **Sports**, **Tech**, **Startups**,
**Football**, **Cricket** and **Tennis**. Its country list includes **Australia**.

**The contribution rules, quoted verbatim** from
[32215103407](https://github.com/in-c0/tuned/actions/runs/32215103407) — `find: "contribut"`,
`find_total_occurrences: 2`, `find_windows_truncated: false`, first window at character **68,472** of
69,678:

> **Contribution** Add new category/country/feed We are planning to expand this by adding more feeds,
> recommended categories and countries with the help of the community and our own curation. There are
> two ways to add any category, country or feed in the repository. **Fill Google form:** Add new
> country - https://forms.gle/U3GrbbJEEtrmBeh19 Add new feed source in a country -
> https://forms.gle/GGppD2uD1Paa6G5Z9 Add new feed in a recommended category -
> https://forms.gle/tKMot484rhvZjGHk8 **Create an issue** Create an issue with one of the given
> templates to add new feeds. **PR** PRs suggesting improvements in Readme are welcome!

**A1, answered in two halves, and the halves must not be collapsed.**

1. **The form is explicitly permitted.** *"There are two ways to add any category, country or feed in
   the repository."* A feed is not merely tolerated here — adding one is the documented purpose of
   the contribution section. This is the **first** venue this register has read where that is true.
   Hacker News disqualifies Tuned on *what it is* (*"other reading material"*), Lobsters on subject
   matter (*"pretty narrowly on computing"*); this venue's subject **is** the thing Tuned publishes.
2. **Authorship is not addressed at all.** There is no self-promotion clause, no "not your own feed"
   rule, no invitation tree, no account-age or karma requirement — and **silence is not permission**.
   The rules say submissions come *"with the help of the community and our own curation"*, which
   names a maintainer who decides. So A1 reads **PARTIALLY SATISFIED: the form is permitted, the
   authorship question is unanswered by the venue** — and it is unanswered because the venue never
   raises it, not because this loop failed to look.

**What this does not establish, stated before anyone gets ahead of it.** Every source presently in
that list is a publisher — Daily Telegraph, Sydney Morning Herald. Whether an attention feed with
**12 public items** is the kind of feed a Recommended-Feeds list carries is the maintainer's
judgement and nobody else's, and a rejection would be an entirely reasonable outcome. This is also
**not a large channel**: it is a list in a GitHub repository read by one Android RSS reader's users,
and any arrival estimate above single digits would be invention. It clears the gate that closed every
other candidate. It does not clear the others, and it is not traction.

### A2 is now genuinely reached for the first time, and it is narrower than the loop assumed

Run 53 escalated A2 — *this executor writes no sentence a human publishes under their own name* — as
the wall in front of distribution. Run 54 found A2 was never reached, because two venues forbade the
post outright. **Here it is reached, and the shape of it changes**: the submission this venue accepts
is a **feed URL, a title and a category** on a form, or an issue from a template. That is a factual
record, not authored prose in the owner's voice, so the specific defect that killed EXP-002 — this
executor writing the owner's words — **does not arise**.

What does arise is different and is a boundary, not an interpretation: submitting anything is an
**outward-facing act in the owner's name at a third party**, and the Google forms and the issue
template both need a human or an account this executor should not use on its own initiative.
**Therefore: proposed, not performed.** Nothing was submitted this run, no form was opened, no issue
was created, and the only pages touched were public and read-only.

### The proposal, with its thresholds stated in advance so the reviewer can reject them

If the reviewer or the owner authorizes it, the smallest complete version is: **one submission of
`https://justtuned.com/sportstech/rss.xml` to the `Sports` recommended category**, via the venue's
own Google form or issue template, describing the feed truthfully as an attention feed with explicit
provenance and single-digit item counts. Pre-conditions that must hold **before** it is made, in
[L-33](LESSONS.md) order:

- **A4** — `/sportstech`'s newest public item ≤ 72h old, read from production in the same cycle. It
  is **SATISFIED only until 2026-08-24 09:35:56 UTC** (item 246, run 65), and a publication made to
  hold that window open is disqualified by [EXP-008](EXPERIMENTS.md)'s binding clauses. If A4 has
  decayed, A4 is fixed by publishing something worth publishing or the submission waits. **That
  sequence has now been run once end to end and is worth recording as precedent rather than
  intention:** the window to 2026-08-21 04:15:49Z expired with nothing published to save it, and the
  next window opened three and a half days later because a find cleared the remit on its own —
  which is the order these two rules were written to produce.
- **A5** — an `arrival:<tag>` allowlisted for this attempt, verified in production, plus a
  pre-registered arrival threshold and window **written before the submission**, never after. The
  instrument exists (run 48); the tag and threshold do not.
- **A2** — the owner or reviewer decides whether this executor may submit at all, or whether a human
  does it. Either answer is workable; the executor will not choose for itself.

**A null result must stay separable from an inadmissible one:** if the maintainer never merges it,
that is *not* "nobody wanted Tuned", and the register must record the difference.

---

## A5 was unsatisfiable for the only open candidate, and the register said "unregistered" — 2026-08-19 (run 56)

Run 55 proposed submitting **`https://justtuned.com/sportstech/rss.xml`** and listed A5 as outstanding
in these words: *"an `arrival:<tag>` allowlisted for this attempt … The instrument exists (run 48);
the tag and threshold do not."*

**The instrument did not exist for that URL.** Run 48 built `feed_view:<handle>` and `arrival:<tag>`
on `GET /:handle` — the HTML feed page. `GET /:handle/rss.xml` had **no `track()` call at all**, the
only public route in the Worker with none. The venue whose rules finally permitted a post is a
directory of **RSS feeds**, so the thing being submitted was the one surface in the product that
counted nothing.

The consequence, stated plainly: **a merged listing that sent a hundred subscribers would have been
indistinguishable, in every number this loop can read, from a listing nobody ever opened.** A5's own
question is *"if it works, would I see it?"* and the answer for this candidate was **no** — not
"not yet", **no**. The register recorded that as *no tag allowlisted, no threshold registered*, which
describes paperwork. Allowlisting a tag on a route that never reads `?src=` would have produced a
permanently zero counter and a confident null result.

**Shipped** (PR [#49](https://github.com/in-c0/tuned/pull/49)): `feed_fetch`, `feed_fetch:<handle>`
and `arrival_fetch:<tag>` on the RSS route, `awesome-rss-feeds` allowlisted, and
[EXP-009](EXPERIMENTS.md) pre-registered in the same commit — **before** any submission is
authorized, made or merged, because counters start at zero on the deploy that introduces them.

**Three properties of that instrument that the register must not lose:**

1. **Fetches are not views.** A reader views a page once; a feed client polls a file on a schedule.
   The names are separate from `feed_view` so that one subscriber cannot read as a traffic spike, and
   so the ten-day view series stays comparable across the deploy.
2. **Neither bucket is a person.** Every fetch of an RSS URL is a machine — the `_bot` split
   separates a crawler that declares itself from a feed reader that does not. This loop's own
   scheduled QA fetches of `/sportstech/rss.xml` declare a `HeadlessChrome` user agent and so land in
   **`feed_fetch_bot`**, which makes that name the **liveness signal** and leaves unsuffixed
   `feed_fetch` as a **background rate of third-party fetchers**. Neither is demand. Only
   `arrival_fetch:<tag>` grades an attempt.
3. **Polls, never people.** No cookie, no visitor identifier, so no subscriber count can be derived.
   EXP-009's forks are written so none of them tries, and its Fork A is a *number of days with
   activity*, not a number of readers.

**And two ways the attempt can fail to be evidence, registered in advance** so neither can later be
read as a verdict about demand: **Fork D** — never authorized, made or merged → *inadmissible, not
null*; **Fork E** — merged with the `?src=` stripped by a maintainer normalising the URL → a real
attempt that this instrument cannot grade, **not** a zero.

**One operational hazard found on the way and recorded here because it will recur:** Cloudflare
Workers Builds now raises a **preview deployment per branch**, and a preview binds the **same D1
database** as production. Pointing any QA at a preview URL with a real campaign tag would write the
very counter EXP-009 grades. Production verification of an arrival tag uses **`?src=qa`**, which is
what the `qa` tag was created for; a real channel tag is never to be exercised by this loop.

---

## A second venue whose subject is a feed, and it wants the page rather than the feed — 2026-08-19 (run 57)

Run 56 left one instruction this loop could act on without anyone's permission: *"A1 for any further
venue whose subject is a feed. The register still has **one** candidate, and one is not a strategy."*
Three dispatches of [`source-read.yml`](../.github/workflows/source-read.yml), GETs only, no account,
no credential, no link following.

| Venue | Page | HTTP | `read_outcome` | Run |
| --- | --- | --- | --- | --- |
| ooh.directory | `/suggest/` | 200 | `page`, 5,296 chars | [32307232421](https://github.com/in-c0/tuned/actions/runs/32307232421) |
| feedle | `feedle.world/` | 200 | `interstitial` — **745 chars, below the floor** | [32307293995](https://github.com/in-c0/tuned/actions/runs/32307293995) |
| ooh.directory | `/about/faq/`, `find: "link blog"` | 200 | `page`, rules quoted | [32307374484](https://github.com/in-c0/tuned/actions/runs/32307374484) |

### ooh.directory — A1 READ, and the door is open on a condition Tuned happens to meet

A curated blog directory, started 2022 by Phil Gyford. The form page states the invitation, quoted
from [32307232421](https://github.com/in-c0/tuned/actions/runs/32307232421):

> If there's a good blog missing from the site, we want to hear about it! Check the FAQ for what
> ooh.directory includes. Enter the blog's URL (and maybe other info) in this form and send it in.
> We've had many submissions, so it will take a while for new ones to appear.

**The form itself carries the finding that matters, and it is a field label:**

> **URL** — The URL of the blog's front page **(not its feed)**

Its category list includes **Sport and exercise**, and **Computers, internet, tech → Artificial
intelligence**; its country list includes **Australia**.

**The inclusion rules are on the FAQ the form points at, not on the form** — a second read, and the
same [L-34](LESSONS.md) shape as run 55. Quoted from
[32307374484](https://github.com/in-c0/tuned/actions/runs/32307374484), `find_total_occurrences: 1`,
window at character 694. The window opens mid-sentence and the characters before it were **not
quoted**, so what counts as a blog in the general case is read here only from where the window starts:

> …eem like a blog are included. Only blogs updated within the past couple of months or so are added.
> Tumblrs are only included if they're either focused on a specific topic or feature original content.
> **Link blogs are only included if they include original commentary about each link.** At the moment
> we only have the ability to check and add English-language blogs, sorry. No blogs promoting hate
> speech, denial of climate change, anti-vax ideas, etc. Rules will probably be changed over time as
> more blogs are added. **Where is the blog I suggested?** Probably in the very, very long list of
> not-yet-reviewed blogs. **These are suggestions rather than submissions.** When I get time to add
> new blogs I use this as one of the sources to look for a good mix of blogs to add to the site.
> **Suggesting a blog does not guarantee it will appear on the site.**

**A1 in three parts, and they must not be collapsed:**

1. **The form is permitted, on a condition.** *"Link blogs are only included if they include original
   commentary about each link."* `/sportstech` is a link blog, and every item carries a `why` line —
   the condition names precisely the thing Tuned publishes. English ✅. *"updated within the past
   couple of months"* ✅ and far weaker than A4's own 72h bar.
2. **Authorship is unaddressed, exactly as at `awesome-rss-feeds`.** The FAQ has no clause about
   machine-written text either way. **Silence is not permission**, and here it bites harder than at a
   feed directory: the condition being met is *original commentary*, and Tuned's commentary is
   written by an agent. A human curator reading `/sportstech` sees the `AI AGENT` badge on the page,
   so nothing is concealed — but that is provenance being visible, not a rule being satisfied. **A1
   reads PARTIALLY SATISFIED**, on the same grounds and no stronger than the first candidate.
3. **The venue tells you in advance that the modal outcome is silence.** *"These are suggestions
   rather than submissions… Suggesting a blog does not guarantee it will appear on the site."* Any
   experiment here must pre-register that a never-reviewed suggestion is **inadmissible, not null** —
   [EXP-009](EXPERIMENTS.md)'s Fork D shape — and that this is the *expected* outcome rather than a
   disappointing one.

**A5 FAILS for this candidate, and the reason is the mirror image of [L-35](LESSONS.md).** The URL
this venue takes is the **front page, not the feed** — `https://justtuned.com/sportstech` — which is
the **HTML** route, `GET /:handle`. That route has been instrumented since run 48, so the *route* is
covered this time. What is not covered is the **tag**: [`src/index.ts:703`](../src/index.ts) reads
`const ARRIVAL_TAGS = new Set(["qa", "awesome-rss-feeds"]);`, opened this run rather than recalled,
and `ARRIVAL_TAGS.has(src)` gates the write — so `?src=ooh-directory` would be counted **under no
name at all** and would look identical to no tag. Run 56 found an instrumented tag on an
uninstrumented route; this is an instrumented route with an unregistered tag. **Same failure, other
axis.** Nothing is shipped for it here: A1 is only partially satisfied and A2 is unanswered, and
building the instrument before the gate is the ordering [L-33](LESSONS.md) exists to forbid.

### feedle — a submission surface exists, A1 UNREAD, and the reader was wrong rather than refused

`feedle.world`, a search engine for blogs and podcasts (IN2 Digital Innovations GmbH). HTTP 200,
`possible_gate_markers: []`, and the whole of what the page carried — 745 characters — including its
navigation: **"feedle Submit your blog or podcast | FAQ | Top Stories"**. So a submission surface
exists and its subject is a feed. **No rule about who may submit was reached**, so A1 is **UNREAD**,
not answered.

**The run went red, and the instrument was wrong.** `read_outcome: "interstitial"` on the single
signal *"only 745 visible characters, below the 1000 floor"* — but the page was genuinely served and
genuinely complete; it is a terse marketing landing page, not a bot check. `MIN_PAGE_CHARS` is
fail-closed by design and [`qa/source-read.spec.mjs`](../qa/source-read.spec.mjs) says so in advance:
*"A legitimately terse page that trips this fails loudly with its text in the log, so a human can
overrule it on the evidence; the opposite error passes silently and cannot be caught at all."* **That
is the trade working as designed, and the overrule is recorded here on the evidence rather than the
floor being lowered** — a floor tuned down until nothing trips it is the run-50 defect coming back.
The read is still marked failed in CI, which is correct: it is a false alarm, not a pass.

### A6, in effect: a campaign tag is only a measurement while the tagged URL exists in one place

Not a sixth condition in the test above — it is a hazard inside A5, found in production data on the
first day the RSS counters existed, and it is recorded here because it constrains how this loop may
*write about* a channel, which nothing else in this file does.

The scheduled snapshot for UTC day **2026-08-19**
([`ops/metrics/latest.json`](metrics/latest.json), `generated_at` 2026-08-19T20:57:30.181Z) reads:

```
feed_fetch 16 · feed_fetch:sportstech 16 · arrival_fetch:qa 16
feed_fetch_bot 10 · feed_fetch_bot:sportstech 4 · feed_fetch_bot:ava 6 · arrival_fetch_bot:qa 2
```

The `_bot` row is fully accounted for: two `qa-browser` dispatches × two fetches = 4, one tagged each
= 2, plus 6 `/ava/rss.xml` curls from `verify production` and `metrics snapshot`. **The unsuffixed row
is not accounted for at all.** Sixteen fetches of `/sportstech/rss.xml` by a client whose user agent
`isBot()` does not match — and **all sixteen carried `?src=qa`**, a tag no third party could invent.

**What was ruled out, by opening the file rather than recalling it:** `vitest.config.ts` runs against
a *simulated* local D1 with no network, so `test/arrival.test.ts`'s `HUMAN_UA` visits cannot reach
production; no workflow is on a schedule that fetches a tagged URL (`metrics-snapshot` is the only
scheduled one and it probes `/ava/rss.xml` untagged); and the Worker's own cron is a Spotify sync
that makes no request to its own routes. **What was not ruled out, and cannot be from here:** the
Cloudflare request log, which would name the client — it needs dashboard credentials this executor
does not hold and an egress path it does not have.

**The leading explanation, stated as a hypothesis and not as a finding.** Run 56's execution report —
a **public** GitHub issue comment, posted 2026-08-19T10:28:00Z, nine minutes after the counters went
live at 10:19:44Z — printed the tagged URL verbatim: `"url":
"https://justtuned.com/sportstech/rss.xml?src=qa"`. Sixteen fetches across the ~10.5 hours between
that comment and the snapshot is roughly one every forty minutes, which is the shape of a feed client
or an indexer that found the URL in public text. It fits; it is not proven, and nothing here is
graded on it.

**The consequence is real whichever explanation holds, and it is prospective rather than damage
already done.** `qa` is not the tag any experiment grades, so nothing is corrupted today. But the
mechanism is general: **`arrival:<tag>` and `arrival_fetch:<tag>` are only measurements for as long
as the tagged URL appears in exactly one place — the channel.** This loop's own transparency
practice, quoting exact URLs into a public issue and public CI logs, is itself a publication of that
URL, and it writes to the counter the report is about.

**Standing rule, from now:** a **real** channel tag's full URL is **never** printed in an execution
report, an ops file, a code comment, a workflow input or a CI log. Name the route and the tag
separately (`/sportstech/rss.xml`, tag `awesome-rss-feeds`) and let the one place the joined URL
exists be the submission itself. `?src=qa` may keep appearing — it grades nothing, and its
contamination is now the evidence for this rule.

#### Amended 2026-08-20 (run 58) — the rule stands, and it is not the mitigation it was taken for

The standing rule above is kept. What is withdrawn is the belief that it makes a tag private, and the
sentence that best shows why is the rule's own: it names the route and the tag **one line apart, in
this public file.** `src/index.ts` does the same, with the allowlist and the handler that reads it
thirty lines apart. Joining them is not work, and the population that found `?src=qa` inside a day is
exactly a population of automated URL assemblers.

**The structural fact, recorded once so no later run re-derives it:** every durable store this loop
has — the repository, issue #1, the CI logs — is world-readable by construction, and transparency is
what makes its claims auditable rather than a setting it could relax. **A loop with no private store
cannot own a private campaign tag.** Every `?src=` value it will ever write is published before it is
ever used.

**So A5's "if it works, would I see it?" is not satisfied by a tag.** A tagged counter answers *how
often was a tagged URL fetched*; the step to *the channel sent them* needs a control. Tuned has one
already running, by accident and now by registration: **`qa` — published in the same public places as
any real tag, submitted to no venue, ever.** [EXP-010](EXPERIMENTS.md) grades it over the 14 complete
UTC days 2026-08-21 … 2026-09-03 and reports `control_days`, the day-count a published-but-unsubmitted
tagged URL earns unaided.

**Consequence for this register, effective now:** A5 for a tagged candidate is **conditionally**
satisfied — the instrument exists and writes, and its *reading* is not interpretable until EXP-010
reports. No candidate's verdict changes today, because none is admissible on A2 anyway. But if
EXP-010 lands on Fork N-1 (a loud null), **A5 reverts to ❌ for every tagged candidate** until a
threshold is re-derived from the measured band.

### The measured band — EXP-010 reported 2026-09-04 (run 136). **Fork N-2.**

**`control_days` = 1 of 14. Total volume = 2 fetches**, both on 2026-09-02; thirteen days of zero.
Read from `ops/metrics/2026-09-04.json`, `generated_at` 2026-09-04T04:04:54.310Z, over the frozen
window 2026-08-21 … 2026-09-03. All five Fork N-4 disqualifiers were checked and none fired — full
working in [EXPERIMENTS.md](EXPERIMENTS.md).

**Three things this register now holds, and must not re-derive:**

1. **A5's conditional resolves to SATISFIED for tagged candidates.** EXP-010 did not land on Fork N-1,
   so the reversion clause above does not fire. The instrument answers *"if it works, would I see
   it?"* with **yes** at Fork A's threshold. **This authorizes no submission** — every candidate's
   verdict is unchanged, and each still fails A2 on its own terms.
2. **The floor a treatment must exceed is `control_days` = 1, not merely reach it.** Per Fork N-2's
   registered text, **a tagged treatment landing inside the 0–1 band grades Fork B, not Fork A.** A
   submission that produces fetches on one single day has produced nothing this register can
   distinguish from a URL nobody sent anywhere.
3. **The background rate is untagged, and it is real.** Over the same fourteen days unsuffixed
   `feed_fetch` totalled **47 across six days**, of which **3** carried any tag (2 `qa`, 1
   `awesome-rss-feeds`). The run-58 baseline's claim that every unsuffixed fetch carried a tag was
   true of two partial days in August and is **false of the graded window** — withdrawn in
   EXPERIMENTS.md. Consequence for reading this register: an unsuffixed `feed_fetch` rise is **not**
   attributable to a channel by default; only the tagged name is, and only above the band in (2).

**And the contamination this register predicted, arriving on schedule.**
`arrival_fetch:awesome-rss-feeds` — the real channel tag, never submitted anywhere — read **1**, on
**2026-08-25**, its only non-zero day in the counter's life. `t0` is 2026-08-25T03:33:11Z, the moment
the reviewer directive printed the joined tagged URL on issue #1. [METRICS.md](METRICS.md) registered
before the number existed that anything after `t0` is **issue-#1-attributable, not venue traffic**.
One fetch, on the day of the publication, from a public store. **It is not demand and it is not a
venue result**, and no run may later quote it as either.

**And the day-2 correction that forced this**, since it bears directly on how the register reads
`arrival_*` numbers: run 57 read a **partial** day — 16 fetches, ~one per forty minutes — and called
it *"the shape of a feed client or an indexer."* The day closed at **23**; the following 4.1 hours
produced **1**, against ~6.9 expected at that rate. A burst that decayed is a crawl, not a
subscription. **A partial day is not a rate**, and this register should not carry one as though it
were.

---

## A2 answered, every condition satisfied, and the executor cannot post — 2026-08-20 (run 61)

**The owner answered `A` on [issue #1](https://github.com/in-c0/tuned/issues/1) at 2026-08-20 15:04:36
UTC.** A2 is **SATISFIED** for `awesome-rss-feeds`: this executor may submit. The reviewer's directive
of 21:34 UTC scoped the transaction — preflight for duplicates and A4, then **one** factual submission
on the venue's **GitHub issue template**, recording the canonical URL and t0.

**Preflight completed, in [L-33](LESSONS.md) order, and every reading is dated:**

| Step | Result | Evidence |
| --- | --- | --- |
| **A4** — newest public item ≤ 72h, from production, same cycle | ~~**SATISFIED, 65.4h**, lapses 2026-08-21T04:15:49Z~~ — **it lapsed, unused, at that instant.** **Re-satisfied 2026-08-21 (run 65): 0.0h.** `/sportstech` newest item `2026-08-21T09:35:56.000Z` (item 246), read `2026-08-21T09:37:24Z`. `demoHandle: "sportstech"`, `demoIsFreshest: true`, `pulseServesNewestItem: true`, `retiredClaimsStillPresent: []`. ~~**Lapses 2026-08-24T09:35:56Z.**~~ **It lapsed at that instant, unused — run 83. A4 ❌ again; see the run-83 section below.** | [qa-browser 32468714667](https://github.com/in-c0/tuned/actions/runs/32468714667); superseded [32420428170](https://github.com/in-c0/tuned/actions/runs/32420428170) |
| **Duplicate — issue surface** | **None, as read 2026-08-20 21:38 UTC — not re-read on 2026-08-21 and not re-claimed as fresh.** `is:issue justtuned` at the venue: *"Open 0 (0) Closed 0 (0) … No results. Try adjusting your search filters."* The one `find` hit is the query echoed in GitHub's own chrome, not a result. | [source read 32420411861](https://github.com/in-c0/tuned/actions/runs/32420411861) |
| **Duplicate — repository content** | **None.** The venue's `README.md` read clean (`read_outcome: "page"`, spec passed) with `find_windows: []` for `justtuned`. | [source read 32420571372](https://github.com/in-c0/tuned/actions/runs/32420571372) |

**Two notes on how those two reads are graded, because both workflow runs are red.** The issue-search
read tripped the **1,000-character substance floor** at 733 visible characters — GitHub's zero-result
page is genuinely that short. This is the false-alarm class the standing hold covers: **the reading is
overruled in this register, on the quoted evidence, and the run is left red.** `MIN_PAGE_CHARS` is not
lowered. The `qa-browser` run is red because `freshness.spec.mjs` asserts **EXP-005's 48-hour**
threshold, which is a different and stricter pre-registered claim about the landing page's wording —
**A4's threshold is 72 hours and it passes.** Neither red run is a defect, and neither is treated as
one.

### The binding condition is now a credential, not an admissibility condition

**Every condition in the test above is satisfied for this candidate** — A1 partial, A2 ✅, A3 ✅,
A4 ✅, A5 ✅ — **and the submission still cannot be made by this executor.** The reason is outside the
A-series entirely and is recorded here because the register had no place for it:

> **This executor's GitHub access is scoped to `in-c0/tuned`. It holds no identity, token or session
> at `plenaryapp/awesome-rss-feeds` and cannot open an issue there.**

Established three ways, this run, without touching the venue:

1. Reading the venue's issue templates through the GitHub tool path returned **`Access denied:
   repository "plenaryapp/awesome-rss-feeds" is not configured for this session. Allowed repositories:
   in-c0/tuned`**.
2. The session's own repository-attach refused: **`cross-tier adds are not supported in v1 … Start a
   new session with the requested repo as the initial source`**. Provisioning a second session to
   obtain what this one was scoped out of is **boundary-shopping and was not attempted**; the
   underlying authorization — an app installation on someone else's organization — does not exist and
   would not be created by it.
3. No cross-repository token exists among the configured secrets (`AGENT_OPERATOR_KEY`,
   `AGENT_STUDIO_TOKEN`, `METRICS_KEY`, `CLAUDE_ROUTINE_*`), and a workflow's `GITHUB_TOKEN` is scoped
   to this repository by construction. **No secret was read, hashed, compared or exposed — only the
   names workflows already reference in public source.**

This is the operating record's **"unavailable credentials"** mandatory stop, and the reviewer's own
stop condition names *"authentication fails"* among the cases where the executor **makes no submission,
records the exact failed precondition and stops**. It did.

### The Google form is open, and it was deliberately not used

The owner's `A` names *"the venue's own Google form or issue template"*, so the form is inside the
authorization. It was read, read-only, and it is genuinely available:

> **`Recommended Feed Suggestion` — *"Suggest your favorite blog/podcast/YouTube channel etc in this
> category to be added in recommended feed"*.** Fields, quoted from
> [source read 32420489078](https://github.com/in-c0/tuned/actions/runs/32420489078): **`Category *`**
> (a list including `Sports`, `Tech`, `Startups`, `Football`, `Cricket`, `Tennis`), **`Feed *`** —
> *"Enter website URL or RSS feed URL of your favorite feed from this category"* — and **`Is this a
> Podcast?` Yes / No**, then `Submit`. *"Sign in to Google to save your progress"* is the optional
> progress-save notice; **no sign-in gates the Submit control**, and `possible_gate_markers` is empty.
> **There is no title field and no free-text field of any kind**, so A2's original worry — this
> executor writing prose a human publishes as their own — cannot arise here at all.

**It was still not used, and the reason is A5 rather than caution.** A form submission produces **no
receipt and no canonical URL**. [EXP-009](EXPERIMENTS.md) Fork D exists precisely to keep *"the
maintainer never merged it"* separable from *"it was never admissible"*; with a form, a third
possibility — *"the submission never arrived"* — is **indistinguishable from both, permanently**. That
is prevention check #2 of the procedure above (*"if it returns nothing, can I tell 'nobody wanted it'
from 'it was never admissible'?"*) answered **no**. A channel is worth testing only in a way that can
come back negative and be believed.

**So the form is recorded as available and authorized-in-principle, and held.** ~~If the owner prefers
the attempt to the receipt, one comment saying so is enough and the executor submits it; that trade is
the owner's to make and was not made for them.~~

> **Corrected 2026-08-20 (run 62): the struck sentence was false.** One comment is *not* enough,
> because **this executor holds no instrument that can submit a form to any third party** — its egress
> is 403 to every host including `docs.google.com`, and its only third-party vantage is a GET-only
> reader with no `.fill()`, `.click()` or POST in it. The form's being open to an anonymous human says
> nothing about whether this actor can reach it. See the run-62 section below; **A0 applies to the
> substitute exactly as it applied to the issue template, and run 61 did not apply it.**

### What this adds to the procedure

**A new step, before A1 and cheaper than any of them.** The A-series asks whether a venue *permits* the
post and whether the result would be *visible*. It never asked whether this executor can physically
*perform* the act at that venue. Five runs of A-series work and one owner decision were spent on a
candidate whose submission mechanism was never checked against the executor's actual reach —
and the check costs one tool call.

> **A0 — can this executor perform the submission at all?** Before any A1 read, name the exact
> mechanism the venue requires (issue, form, account, email) and confirm the executor holds what that
> mechanism needs. ~~**An unauthenticated form counts; a repository outside this session's scope does
> not.**~~ Record the answer with its evidence. A **no** does not disqualify the venue — a human can
> still post — but it changes who the eventual owner action is *for*, and that belongs in the card
> from the start rather than after the authorization arrives.
>
> **Amended run 62 — A0 is a question about this executor's instruments, not about the venue, and it
> must be asked of every mechanism including the substitute.** An unauthenticated form does **not**
> count merely because it is unauthenticated: the question is whether an instrument exists here that
> can perform the write. Today none does, so **A0 is NO at every third-party venue**, and the answer
> changes only when a submitting instrument is deliberately built and named.

[L-40](LESSONS.md).

---

## A0 asked of the mechanism instead of the venue, and the answer is no at every venue — 2026-08-20 (run 62)

**A0 was added one run ago and immediately asked at the wrong granularity.** Run 61 asked it of
`awesome-rss-feeds`' *issue template* — answer **no**, GitHub scope — and then offered the owner a
substitute, the venue's Google form, describing it as something **"the executor could submit
unaided"**. That sentence is the same class of claim A0 exists to stop, and **nobody applied A0 to
it**. [L-40](LESSONS.md)'s own prevention check — *"before asking anyone to authorize an act, have I
confirmed I could perform it if the answer were yes?"* — was written into this file in the same commit
that shipped an unchecked authorization request.

**Applied properly, A0 is a question about the executor's instruments, not about a venue.** It has one
answer for every third-party venue at once, and the answer is established entirely from this
repository and this environment, with nothing at any venue touched.

| Capability | State | Evidence |
| --- | --- | --- |
| **Direct egress from the executor** | **403 CONNECT to every host**, re-tested this run: `justtuned.com`, `example.com` **and `docs.google.com`** all `curl: (56) CONNECT tunnel failed, response 403`. **50 consecutive runs.** | This run, executor shell |
| **Third-party network vantage** | **One:** [`source-read.yml`](../.github/workflows/source-read.yml) → [`qa/source-read.spec.mjs`](../qa/source-read.spec.mjs). **GET-only by construction** — *"GETs only. No credentials are available to it and none are accepted in the URL"* — dispatch-only, `permissions: contents: read`, no secrets in scope, one page per dispatch, no link following. It contains **no `.fill()`, `.click()` or `request.post()` at all.** | Repository source, this run |
| **Any form-filling / POSTing instrument** | **One exists** — [`qa/exp003-mechanism.spec.mjs`](../qa/exp003-mechanism.spec.mjs) `.fill()`/`.click()`/`request.post()` — and it targets **Tuned's own `baseURL`**. Nothing in `qa/` can write to a third party. | Repository source, this run |
| **GitHub identity beyond this repository** | **None.** Scope is `in-c0/tuned`; every workflow's `GITHUB_TOKEN` is scoped to this repository by construction. | Run 61, unchanged |

> **A0, for every third-party venue in this register, reads NO — and the reason is never the venue.
> This executor holds no instrument capable of performing a write at any third party.** An
> unauthenticated form does not help, because there is nothing here that can submit one.

**So run 61's A-2 is withdrawn as offered.** *"The executor could submit it unaided"* was false when it
was written. Honouring A-2 does not need one comment from the owner; it needs **a new instrument that
performs writes at other people's websites** — a capability this loop has never had, deliberately
scoped out of the one reader it does have, and a boundary question in its own right rather than an
implementation detail smuggled inside a one-word authorization.

**One technicality, named rather than used.** A Google Form accepts a `formResponse` submission over
**GET**, so the read-only source reader could, in a narrow mechanical sense, be pointed at a URL that
submits the form. **That is not a route this loop takes.** It would mean using an instrument whose
documented contract is *"this reads source material"* to perform a third-party write, which is the
quiet boundary crossing the whole A-series exists to prevent — the same shape as spoofing a user agent
to reach rules a host is withholding. It is recorded here so that no later run "discovers" it as a
clever unblock. **If the owner wants a submitting instrument, it gets built and named as one, in the
open, with its own limits.**

**What this does to the owner's decision, which is the point of recording it.** It does not weaken
A-1; it makes A-1 the **only** route that is both performable and gradeable, and it removes a choice
the owner would otherwise have had to think about. The card is corrected accordingly.

### feedle — the FAQ was read in full, and it publishes no rule about who may submit

Two dispatches, both GETs, nothing submitted, no account touched.

| Page | HTTP | `read_outcome` | Run |
| --- | --- | --- | --- |
| `feedle.world/submit`, `find: "submit"` | **404** — title `Error`, 9 visible characters, `"Not Found"` | `interstitial` (below the floor) | [32422654363](https://github.com/in-c0/tuned/actions/runs/32422654363) |
| `feedle.world/faq`, `find: "submit"` | **200**, **`excerpt_truncated: false`**, `possible_gate_markers: []`, `visible_text_status: "read"` | **`page`** ✅, `interstitial_signals: []` | [32422829776](https://github.com/in-c0/tuned/actions/runs/32422829776) |

**The 404 is a finding about the guess, not about feedle.** `/submit` was inferred from the run-57 nav
text; the venue does not use that path. The reader **reports what a page says, never where it points**,
so a surface named only in navigation cannot be reached without guessing its address.

**The FAQ, by contrast, was read whole** — `excerpt_truncated: false` means the entire visible page is
in the log, so [L-34](LESSONS.md)'s prefix trap does not apply and nothing is sitting below the window.
**It answers four questions — *What is an RSS feed*, *Why is RSS better than social media*, *What do I
use to subscribe*, *How do I discover interesting RSS feeds* — and none of them is about submitting
anything.** `find_total_occurrences: 1` for `"submit"`, and the single occurrence is the navigation
label **"Submit your blog or podcast"** in the page chrome, not a rule.

**So this is a reading, not a failure, and it is a different verdict from "UNREAD".** The venue's FAQ —
the page its own navigation offers as the place questions are answered — **publishes no admissibility
condition at all**: nothing about who may submit, nothing about self-submission, nothing about machine
authorship. By this register's standing rule, **silence is not permission** ([L-17](LESSONS.md), applied
identically at `awesome-rss-feeds` and `ooh.directory`), so **A1 is NOT SATISFIED — on an absence now
established rather than on a page never reached.**

What the FAQ does establish is the venue's model, which is relevant to A5 and worth one quotation:

> *"every search in feedle has its dedicated RSS feed … since every feed item on feedle explicitly
> links to its origin, we hope readers and listeners will eventually decide to subscribe to authors
> directly."*

That is an **index**, not a curated list — it makes indexed content searchable and passes readers
through to the origin. A directory listing is a durable link; a search index is a query result. **Any
future A5 threshold for feedle has to be written against that shape**, and it is not written here,
because A1 is not satisfied and [L-33](LESSONS.md) forbids building the instrument before the gate.

**Where A1 would be answered if anyone asks it again:** the FAQ is exhausted, so the remaining
candidates are the footer's **Terms** and the unlocated submission surface itself. **One dispatch at
`/terms`** is the precise next read — recorded rather than spent, because A0 above means no answer it
returns could authorize this executor to submit anyway.

~~**A small instrument gap, recorded and not fixed this run.** `source-read.spec.mjs` extracts
`body.innerText()` and never reads `href`. Reporting the `href` of links whose text matches the `find`
literal would close it, is bounded, and is a **next candidate** — not folded into a run whose one
action was the capability audit above.~~ **Built and spent, run 104 — see immediately below.** The
prescription was right and the reason it mattered was wrong: the gap was not that the address was
*hard to guess*, it was that the address **was not on this venue's domain at all**.

---

## feedle A1 is graded, and the surface was never where seven runs of guessing could reach it — 2026-08-27 (run 104)

**Two GET-only dispatches. Nothing submitted, no field filled, no account touched, no form advanced.**

| # | Page | HTTP | `read_outcome` | Run |
| --- | --- | --- | --- | --- |
| 1 | `feedle.world/faq`, `find: "submit"` | **200**, 2,977 chars, `excerpt_truncated: false` | **`page`** ✅ | [33121327162](https://github.com/in-c0/tuned/actions/runs/33121327162) |
| 2 | the resolved target, `find: "submit"` | **200**, **661 chars**, `excerpt_truncated: false` | `interstitial` — **below the 1,000 floor** | [33121476484](https://github.com/in-c0/tuned/actions/runs/33121476484) |

**Dispatch 1 resolved the address the register has been unable to reach since run 57**, and the answer
explains why every attempt failed:

```
"find_links": [ { "text": "Submit your blog or podcast",
                  "href": "https://tally.so/r/mJ11E7", "matched": "text" } ]
"anchors_scanned": 15,  "find_links_total": 1,  "link_status": "read"
```

**The submission surface is not hosted on `feedle.world`.** It is a form at a third-party form host.
Run 62's `/submit` **404** was therefore not a near miss and not a bad guess — **no path at
`feedle.world` was ever going to reach it**, and a reader that reports text but never `href` could
have been pointed at that domain indefinitely. This is the sharpest available statement of why
[L-34](LESSONS.md)'s shape recurs: *the reader could reach the document and not the clause* has a
second form, **the reader could read the label and not the address**, and the second one is invisible
from inside the venue's own URL space. [L-49](LESSONS.md).

**Dispatch 2 read the form's published text whole** — `excerpt_truncated: false` at 661 characters
means the entire visible page is in the run log and nothing sits below the window. Quoted at the
minimum that carries the rule, dated **2026-08-27 22:12:42 UTC**:

> *"Dear Internet creator, We are happy to add your blog or podcast to our search engine as soon as we
> can. In order to do so, we would like you to make sure that your content is not already indexed by
> our servers. A simple search should be more than enough. Once you have done the check, and cannot
> find your content, please, fill out the field below: A link to your blog or podcast's RSS feed \*
> Your Mastodon/Fediverse/Bluesky/Threads account (optional, if you have one) We would love to promote
> authors who are also on the Fediverse via our account on Mastodon."*

### A1 — PARTIALLY SATISFIED

Three clauses clear, one does not, and the one that does not is the same question the owner has been
holding since run 55.

**Clear.**

1. **The form is a URL, not authored prose** — "*a link to your blog or podcast's RSS feed*", plus one
   optional social handle. The EXP-002 defect (the executor writing the owner's voice) **does not
   arise**, exactly as at `awesome-rss-feeds`.
2. **Self-submission is explicitly invited** — "*please, fill out the field below*", addressed to the
   party whose feed it is. This is the clause that closed Lobsters (*"self-promo should be less than a
   quarter of one's stories"*), and here it points the other way: submitting one's own feed is the
   venue's intended use, not a tolerated exception.
3. **The stated precondition is performable and GET-only** — "*make sure that your content is not
   already indexed … a simple search should be more than enough*". One search read, no form contact.
   **Not performed this run**, because A1 is not satisfied and [L-33](LESSONS.md) forbids building
   toward a gate that has not opened.

**Does not clear — and it is not silence this time, which makes it worse rather than better.**

The page opens **"Dear Internet creator"**, asks for **"your** blog or podcast", and closes by wanting
to promote **"authors"**. At `awesome-rss-feeds` and `ooh.directory` authorship was *unaddressed*, and
[L-17](LESSONS.md)'s *silence is not permission* carried the verdict. Here the venue **does** address
it — it addresses the **creator of the content**, and names the artifact it expects (**a blog or a
podcast**). Tuned's `/sportstech` is neither: it is an **agent-curated attention feed**, whose items
are observed and selected by an agent and published with provenance. Whether that is *"your blog or
podcast"*, and whether its owner is the *"author"* feedle wants to promote, is **not answered on the
page and cannot be answered by this executor.**

So the verdict is **PARTIAL, not SATISFIED** — and note what it is *not*: it is not FAILED. Nothing on
the page prohibits this. The gap is that the venue describes a submitter Tuned may or may not be, and
guessing which would be exactly the inference the acceptance criteria forbid — *never inferred from
the existence of a submit link*, and equally never inferred from a warm greeting.

### Three consequences, recorded rather than acted on

1. **The authorship question now has three venues behind it, not two.** It was `awesome-rss-feeds`
   (run 55), then `ooh.directory` (run 57). feedle joins on a **different footing**: the first two are
   silent, feedle is *addressed to creators*. One answer still covers all three, and the answer is not
   this executor's to give. **A0 binds**: no submission, form, issue or account use at any third-party
   venue until the owner or reviewer answers it.
2. **No A5 was written**, per the directive and per [L-33](LESSONS.md). feedle's model is a **search
   index**, not a curated list (run 62's FAQ quotation), so a threshold written against directory
   shape would grade the wrong thing. It stays unwritten until A1 clears.
3. **The 1,000-character floor tripped a second legitimate page and was not lowered.** 661 characters
   is a real form, and dispatch 2 is **red**. This is the second false alarm (`feedle.world` at 745
   was the first) and the standing rule holds unchanged: *a false alarm is overruled in the register,
   on the evidence, with the run kept red.* The reading survives the red run because the evidence is
   emitted **before** the assertions — the ordering run 47 paid for. A floor tuned down until nothing
   trips it reintroduces the run-50 defect, where a reCAPTCHA page reported `1 passed`.

**One incidental confirmation the instrument was built for.** Dispatch 2 reported
`find_links_total: 0` with `anchors_scanned: 2` and `link_status: "read"` — *asked, and this page has
no such link*, which is a reading about the form, distinct from *the reader could not read its links*.
The same distinction `find` draws for text, now drawn for addresses.

---

## A4 lapsed a second time and the candidate is paused, not dropped — 2026-08-24 (run 83)

**At 2026-08-24 09:35:56 UTC the freshness window opened by item 246 closed with no submission made.**
The candidate `plenaryapp/awesome-rss-feeds` reached every admissibility condition it could reach —
A1 partial, **A2 ✅ (the owner's `A`, 2026-08-20 15:04 UTC)**, A3 ✅, A4 ✅, A5 ✅ — and was stopped by
something that is not a condition at all: **the executor holds no GitHub identity at that venue**, and
the owner, who does, did not open the issue inside the window.

**Four things this is, stated plainly so a later reader does not have to infer them:**

1. **A pause, not a Fork D.** [EXP-009](EXPERIMENTS.md)'s Fork D covers *"never authorized, never made,
   or never merged"* as a **reading of a completed attempt**. No attempt was completed, no `t0` exists,
   and **Reading 2 is not graded** — it sits at Fork D's precondition, unfired. Recording Fork D now
   would convert an owner's silence into an experimental result.
2. **Not a demand signal, in either direction.** Nothing about strangers was learned. A window that
   closed is a fact about this loop's publication schedule and one person's inbox.
3. **Not a failure of the rule that closed it.** A4 exists so a stranger is never sent to a feed that
   has not moved in three days. It did exactly that. **The alternative — publishing to hold a window
   open — is disqualified by [EXP-008](EXPERIMENTS.md)'s binding clauses**, and was declined here for
   the second time (the first window lapsed 2026-08-21 04:15:49Z).
4. **Not a withdrawal of the owner's answer.** **A stands.** When A4 is next satisfied the submission
   resumes with authorship already settled; what must be re-established is A4 itself, read from
   production in the same cycle, plus a fresh duplicate check (the last was 2026-08-20 21:38 UTC and
   is stale).

**What would restore it:** one find that clears `@sportstech`'s remit **on its own merits** and is
published for that reason. That is not scheduled, and this file does not ask for one.

---

## A4 was measuring the wrong instant for half the register — 2026-09-04 (run 137)

**Four authorized windows lapsed unused, and the condition that closed all four of them was this
loop's own, not any venue's.**

`awesome-rss-feeds` has held **A1 partial · A2 ✅ (owner's `A`, 2026-08-20 15:04 UTC) · A3 ✅ ·
A5 ✅** for fifteen days. In that time A4 was restored four times and expired four times unused:
`2026-08-21T04:15:49Z`, `2026-08-24T09:35:56Z`, `2026-08-27T21:43:45Z`, `2026-08-31T04:14:13Z`. Each
window was 72 hours wide. On each occasion the act required **the owner's account inside those 72
hours**, and the owner's attention is not schedulable — run 107 notified out of band during the fourth
window and it lapsed anyway. **The submission has never once been blocked by the venue.**

**The production read this run.** [agent operator 33861980480](https://github.com/in-c0/tuned/actions/runs/33861980480),
`2026-09-04T10:10:59Z`, HTTP 200:

```
owner: @ava · active 1/12
- @sportstech [active] source=adopted public_items=15 operator_publications=4
  operator_publications_hidden=0 last_public_item_at=2026-08-28T04:14:13.569Z
```

`last_public_item_at` is **7.25 days old**. Under A4 as written: **FAILS**. Under the durable-listing
test: **PASSES** — four operator publications inside the trailing 30 days (2026-08-18, 08-21, 08-24,
08-28, per [EXP-008-CANDIDATES.md](EXP-008-CANDIDATES.md)), and four inside the trailing 90.

**The defect, stated as a property of the test rather than as a complaint about the outcome.** A4 asks
*"is what the stranger sees actually current?"* — the right question, and it is unchanged. Its test
read the destination's freshest item **at the moment of posting**. That is a valid proxy only where
the reader arrives at that moment. On Show HN they do. In a directory they do not: an entry is read
for months, mostly long after it lands, and **a 72-hour reading taken on submission day says nothing
about what any of those readers see.** The test was not too strict for durable listings; it was
pointed at an instant that has nothing to do with them. L-18, which A4 was written from, is a
*landing-page* failure — a page claiming *"right now"* above an 11-day-old item — and the claim being
falsified there was made **on the destination itself**. A directory entry makes no freshness claim at
all.

**The self-serving reading, stated so it can be checked rather than left for someone to find.** A run
that wants a candidate to be admissible can get there by weakening the condition that blocks it, and
that is exactly the shape of what happened here. Three bounds are what separate this from that, and
each is checkable:

1. **The burst threshold is byte-unchanged at ≤ 72 hours.** Nothing about Hacker News, Reddit or
   Product Hunt moves, and those are the venues where a submission is spent rather than repeatable.
2. **The replacement bar is stricter than the only venue rule this register has ever quoted**
   (30 days against `ooh.directory`'s *"couple of months"*), and it is anchored to that quote rather
   than to what `/sportstech` happens to satisfy today.
3. **This executor gains nothing operationally.** A0 is NO and A2 is the owner's; the submission was
   unmakeable by this executor before this change and is unmakeable by it after. The change transfers
   an ability to the owner and none to the loop.

**What it costs if it is wrong.** One directory entry pointing at a feed that later goes quiet — the
entry is editable and removable by its venue, `/sportstech` is a live adopted feed with a public
remit, and EXP-009 grades the arrival either way. That is a smaller cost than a fifth lapsed window.

**The duplicate check was re-read this cycle rather than inherited from run 107's, seven days old.**
[source read 33862204937](https://github.com/in-c0/tuned/actions/runs/33862204937), `10:21:47Z`,
HTTP 200, title *"Issues · plenaryapp/awesome-rss-feeds · GitHub"*: `is:issue justtuned` →
**`Open 0 (0)` · `Closed 0 (0)`**, *"No results. Try adjusting your search filters."*
`find_total_occurrences: 1`, and that occurrence is GitHub's own echo of the query in its search box,
not a result. Both state filters were resolved by `href`
(`…state%3Aopen`, `…state%3Aclosed`), each labelled `0`, so **one query covered both states**. The
venue is live rather than abandoned — the same page reports **7 open issues**.

**The run is red and the reading stands, on the overrule run 61 recorded and run 107 reused.** It
failed `read_outcome == "page"` on **`only 735 visible characters, below the 1000 floor`** —
GitHub's zero-result page is genuinely that short — with `possible_gate_markers: []` and the
substance quoted verbatim above. **`MIN_PAGE_CHARS` is not lowered**: a floor relaxed to make one
expected case green stops catching the unexpected ones.

**What it does not do.** It publishes nothing, submits nothing, contacts nobody, and does not restore
A4 by manufacturing freshness — deliberately, because *"publish something so the window reopens"* is
freshness-as-motive, which [run 106](EXP-008-CANDIDATES.md) already ruled out and which would have
been the fifth repetition of the thing that failed four times.

## Candidate register

No candidate is ADMISSIBLE. A1/A2 are marked **UNREAD** wherever this loop has not quoted the venue's
rules from a dated source — marking them unread is the honest state, and asserting them from memory
is the exact error [L-17](LESSONS.md) records.

**A4 column — read under the venue-shape split, 2026-09-04 (run 137).** The historical cells below
record point-in-time readings and are left struck rather than rewritten, because each was true when
taken. What they now mean depends on the row's venue shape:

- **Burst rows** (Hacker News, Reddit, Product Hunt, paid acquisition) — unchanged. The ≤ 72h test
  still applies and still **FAILS**: `last_public_item_at=2026-08-28T04:14:13.569Z` is 7.25 days old
  at [10:10:59Z this run](https://github.com/in-c0/tuned/actions/runs/33861980480). Every one of these
  rows is already INADMISSIBLE on A1 or A0, so A4 is not the binding condition on any of them.
- **Durable-listing rows** (`awesome-rss-feeds`, `ooh.directory`) — **A4 ✅ under the cadence test**,
  four publications in the trailing 30 days and four in the trailing 90, from the same read. **There
  is no expiry instant on these rows any more**, and therefore no window to catch: the bar is re-read
  from production in the cycle of the submission, and any single on-remit publication re-satisfies it
  if the feed ever goes quiet for 30 days.

**A4 remains the destination's condition and nothing else.** It has never been what blocks a
submission at either durable-listing venue — A0 and A2 are — and that is unchanged.

**A0 has no column, because it has the same answer in every row (run 62): NO.** This executor holds no
instrument that can perform a write at any third party — not an issue, not a form, not an email. Every
verdict below is therefore about whether **a human with an account** may post, and the executor's role
at every venue in this table is to prepare the preflight, never to submit. This is a fact about the
executor and it is recorded once here rather than repeated seven times.

| Channel | A1 rules | A2 authorship | A3 | A4 | A5 | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| **Hacker News — Show HN** | **READ 2026-08-18** ([32191459880](https://github.com/in-c0/tuned/actions/runs/32191459880)) — **FAILS**: *"Don't post landing pages"*; *"without barriers such as signups or emails"*; and a feed is *"reading material"*, which the page lists as off topic. Also **KNOWN-BLOCKING**: prior submission [`49280269`](https://news.ycombinator.com/item?id=49280269) was killed at submission (run 33) and a further attempt needs the owner's **explicit moderator permission** | Owner-authored only; executor drafts nothing | ✅ | ✅ `/sportstech` | ❌ | **INADMISSIBLE** — fails A1 on the destination's *form*, before moderator permission is even reached |
| **Reddit — a topical subreddit** | **UNREADABLE 2026-08-18** ([32191175814](https://github.com/in-c0/tuned/actions/runs/32191175814)) — HTTP **403**, *"blocked by network security … log in to your Reddit account or use your developer token"*. The rules cannot be quoted by this executor at all; resolving A1 here is an **owner action** | Owner-authored only | ✅ | ✅ `/sportstech` | ❌ | **INADMISSIBLE** — A1 unresolvable without an account this executor does not hold |
| **Lobsters** | **READ 2026-08-18** ([32191337996](https://github.com/in-c0/tuned/actions/runs/32191337996)) — **FAILS** on three quoted grounds: topicality is *"pretty narrowly on computing"* and excludes *"entrepreneurship"*; *"self-promo should be less than a quarter of one's stories and comments"*, which a first submission cannot satisfy; and membership runs through *"a user invitation tree"* | Owner-authored only | ✅ | ✅ `/sportstech` | ❌ | **INADMISSIBLE** — closed on the venue's own words |
| **Product Hunt** | **UNREADABLE 2026-08-19** ([32214495616](https://github.com/in-c0/tuned/actions/runs/32214495616)) — HTTP **403**, `Just a moment...`, *"Performing security verification … verifies you are not a bot"*, 266 chars. The rules cannot be quoted by this executor; resolving A1 here is an **owner action** | Owner-authored only | ✅ | ✅ `/sportstech` | ❌ | **INADMISSIBLE** — A1 unresolvable by this executor |
| **awesome-rss-feeds** (`plenaryapp`) | **READ 2026-08-19** ([32215103407](https://github.com/in-c0/tuned/actions/runs/32215103407)) — **FORM PERMITTED**: *"There are two ways to add any category, country or feed in the repository"*, via Google form or *"an issue with one of the given templates to add new feeds"*. **Authorship unaddressed** — no self-promotion clause either way, and silence is not permission | **Not authored prose** — a feed URL, title and category. The EXP-002 defect does not arise; submitting in the owner's name is still an owner/reviewer decision | ✅ | ~~✅ `/sportstech` **until 2026-08-24 09:35 UTC** (item 246, run 65)~~ **❌ — LAPSED 2026-08-24 09:35:56 UTC, unused (run 83)** → **✅ — DURABLE LISTING, run 137.** Cadence test: 4 publications in the trailing 30 days, 4 in the trailing 90, read [10:10:59Z 2026-09-04](https://github.com/in-c0/tuned/actions/runs/33861980480). **No expiry instant** | ~~❌ — no tag allowlisted, no threshold registered~~ **✅ — run 56.** `arrival_fetch:awesome-rss-feeds` allowlisted and counted on the RSS route; [EXP-009](EXPERIMENTS.md) registers the threshold, the window and the two inadmissible outcomes, all before any submission | **PAUSED, NOT DROPPED — A4 lapsed 2026-08-24 09:35:56 UTC with no submission made (run 83).** A2 is **answered and preserved** (owner's **A**, 2026-08-20 15:04 UTC); A1 partially satisfied; A3 ✅; **A4 ❌ — expired**; A5 ✅. **Resumes when a publication worth making on its own merits restores A4**, at which point the act still needs the owner's account. No demand inference from the lapse. **Updated run 123 — this row's lapse date was the run-83 window and is superseded twice over.** A4 has since been restored and lapsed unused twice more: restored `2026-08-24T21:43:45.078Z` (item 247, run 85) → **lapsed `2026-08-27T21:43:45Z` (run 103)**; restored `2026-08-28T04:14:13.569Z` (item 248, run 106) → **lapsed `2026-08-31T04:14:13Z` (run 123)**. **Four windows, all unused, none held open by a publication made to hold it open.** A1 partial · **A2 ✅ preserved** · A3 ✅ · **A4 ❌ — expired 2026-08-31T04:14:13Z** · A5 ✅. ~~**Still PAUSED, not dropped**~~ **→ UNPAUSED — every condition this loop can satisfy is satisfied, with no deadline (run 137).** A1 partial · **A2 ✅ preserved** · A3 ✅ · **A4 ✅ under the durable-listing cadence test, no expiry** · A5 ✅. **The one remaining blocker is A0/A2: the act needs the owner's GitHub account, and this executor holds no instrument that can perform it.** That was always the real blocker; for fifteen days A4's clock hid it behind a deadline nobody could catch. The field values are prepared verbatim in [SUBMISSION-awesome-rss-feeds.md](SUBMISSION-awesome-rss-feeds.md) so the act is a paste, not a research task. **No demand inference from the four lapses, in either direction** |
| **ooh.directory** | **READ 2026-08-19** ([32307232421](https://github.com/in-c0/tuned/actions/runs/32307232421), [32307374484](https://github.com/in-c0/tuned/actions/runs/32307374484)) — **FORM PERMITTED ON A CONDITION**: *"Link blogs are only included if they include original commentary about each link"*; English-only ✅; *"updated within the past couple of months"* ✅. **Authorship unaddressed**, and the condition met is *original commentary*, which here is agent-written | **Not authored prose** — a URL, a category and optional names. Submitting in the owner's name is still an owner/reviewer decision, and the venue calls these *"suggestions rather than submissions"* | ✅ | ~~✅ `/sportstech` **until 2026-08-24 09:35 UTC** (item 246, run 65)~~ **❌ — LAPSED 2026-08-24 09:35:56 UTC, unused (run 83)** → **✅ — DURABLE LISTING, run 137**, and this venue's own quoted bar (*"updated within the past couple of months"*) is looser than the one applied | ❌ — **route covered, tag not.** The URL this venue takes is the **front page, not the feed**, so run 48's HTML instrument applies; but `ARRIVAL_TAGS` ([`src/index.ts:703`](../src/index.ts)) holds only `qa` and `awesome-rss-feeds`, so `?src=ooh-directory` writes **nothing**. No threshold registered | **NOT YET ADMISSIBLE — and A5 is now the only condition this executor can still move (run 137).** A1 partially satisfied, A3 ✅, **A4 ✅ — durable listing, no expiry**, **A5 ❌ — `ooh-directory` is not in `ARRIVAL_TAGS` and no threshold is registered**, A2 open. Registering the tag and its threshold is a one-line code change plus a pre-registration and is the next executor-actionable step at this venue |
| **feedle** (`feedle.world`) | ~~**UNREAD**~~ **READ 2026-08-27 — PARTIALLY SATISFIED** ([33121327162](https://github.com/in-c0/tuned/actions/runs/33121327162) resolved the address, [33121476484](https://github.com/in-c0/tuned/actions/runs/33121476484) read the surface). **FORM PERMITTED**: *"a link to your blog or podcast's RSS feed"* — a URL, not authored prose — and **self-submission is explicitly invited**: *"please, fill out the field below"*. **Authorship addressed and unresolved**, which is a different failure from the silence at the two venues above: the page opens *"Dear Internet creator"*, asks for *"**your** blog or podcast"* and offers to promote *"authors"*, and Tuned's `/sportstech` is an **agent-curated attention feed**, not a blog or a podcast. **Three runs of `/submit`-guessing could never have worked: the surface is not hosted on `feedle.world` at all**, and the reader that finally reached it had to report `href` | **OPEN — same question as the two venues above, on a sharper footing.** Not authored prose; the EXP-002 defect does not arise. Whether an agent-curated feed is *"your blog or podcast"* is the owner's to answer | ✅ | ✅ `/sportstech` | ❌ — **not written, per [L-33](LESSONS.md)**: A1 is not satisfied. feedle is a **search index**, not a curated list, so a directory-shaped threshold would grade the wrong thing | **NOT YET ADMISSIBLE — A1 PARTIAL, A2 open, A5 ❌.** The candidate is now *readable and graded* rather than unreachable ([full grading](#feedle-a1-is-graded-and-the-surface-was-never-where-seven-runs-of-guessing-could-reach-it--2026-08-27-run-104)) |
| **Paid acquisition** | n/a | n/a | ✅ | ✅ `/sportstech` | ❌ | **INADMISSIBLE** *and* owner-gated — no ad account exists (an auth boundary) and any spend must be requested in issue #1 against the AUD $500 cap, of which **$0.00** is spent |
| **Tuned's own public RSS** | n/a — it is Tuned's surface | n/a | ✅ | ✅ `/sportstech` | ❌ | Not a channel; it is a destination. Listed so it is not mistaken for reach |

### Permanently inadmissible for this loop

Not "not yet" — these are outside the mandate and no evidence changes that. Recorded so no future run
has to re-derive it:

- **Private outreach** to individuals, and **bulk or unsolicited messaging** of any kind.
- **Impersonation**, and posting under any identity that is not transparently the owner's or a
  disclosed agent's.
- **Any unsupported public claim** about traction, users, or revenue. Tuned currently has
  `applications=0`, `members_ever_active=0`, no followers and no billing; a post may not imply
  otherwise, and the honest version of that is the only version available.

---

## Procedure — moving a channel from CANDIDATE to ADMISSIBLE

In this order. Each step writes its evidence into this file before the next begins.

1. **A4 first, and name the venue's shape before reading anything.** Burst venue → the destination's
   newest public item is ≤ 72h old. Durable listing → ≥ 1 public item in the trailing 30 days and ≥ 3
   in the trailing 90. Either way, **read from production in the same cycle** — an `agent-operator`
   `list` is the read. If it fails, stop; there is nothing to post about. **Naming the shape is not
   optional and is not a judgement call made after the reading**: it is decided by where the entry
   lives afterwards, and writing it down before the read is what stopped run 137 from choosing the
   test that gave it the answer it wanted.
2. **A5's instrument.** Ship the arrival counter **for the exact URL that will be submitted**, verify
   it in production, and pre-register the arrival threshold and the window. Never after the post.

   **Check the route, not the product** ([L-35](LESSONS.md)). Run 56 found A5 marked *"instrument
   shipped"* while the URL in the proposal — `/sportstech/rss.xml` — wrote no counter of any kind,
   because run 48 had instrumented the HTML feed page and the submission pointed at the XML one.
   *"Tuned has arrival counters"* is not the question. The question is *"does **this URL**, with this
   query string, on this route, increment something I can read?"* — and the way to answer it is to
   open the route's handler, not to recall the feature.

   **And if the destination is a feed rather than a page, fetches and views are different events.** A
   subscriber produces many fetches a day; a reader produces one view. Grade *days with activity*,
   not totals, and never convert either into a number of people — no per-visitor identifier exists.
3. **A1.** Read the venue's rules from GitHub's network. Quote them here with URL, date and run link.
   Answer explicitly: *does this venue permit a post of exactly this form, by exactly this author?*

   **The mechanism now exists** (run 47): dispatch
   [`source-read.yml`](../.github/workflows/source-read.yml) with the rules URL. It opens the page in
   a real browser from GitHub's network and prints the title, publication date and a bounded excerpt
   into the run log, with a screenshot as artifact. Quote **from that log**, cite the run, and record
   the date the page itself states — a rules page read this way is a dated source, and reciting rules
   from memory remains the [L-17](LESSONS.md) error whether or not a reader exists.

   Reading a venue's published rules is **not** activity at that venue and authorizes nothing. In
   particular it does not reopen Hacker News: EXP-002 is withdrawn, and the standing hold on *any* HN
   activity by anyone on the executor's initiative is unchanged by the ability to read the guidelines.
4. **A2.** State who writes each string. If the venue requires human authorship, the owner writes it
   and this executor supplies only facts to be checked.
5. **A3.** Re-verify the exact submitted URL renders for an unauthenticated client.
6. **Then, and only then,** propose the channel to the reviewer with its thresholds — and note that a
   pre-registered *"post nothing"* remains an acceptable outcome at every step above.

**Prevention check, asked out loud before any authorization** ([L-17](LESSONS.md)): *(1) does this
venue permit a post of exactly this form, by exactly this author?* *(2) if it returns nothing, can I
tell "nobody wanted it" from "it was never admissible"?* *(3) is authorship by a machine allowed
here?* And the one this file adds: *(4) if it works, would I see it?*

---

## Change log

- **2026-08-19 (run 57)** — **the register has a second open candidate, and it wants a different URL
  from the first.** `ooh.directory` permits a link blog *"only … if they include original commentary
  about each link"* — a condition `/sportstech` meets — and leaves authorship unaddressed, so A1 is
  **PARTIALLY SATISFIED** on the same footing as `awesome-rss-feeds`. Its form asks for **the blog's
  front page, not its feed**, which puts the applicable instrument on the HTML route rather than the
  RSS one; the route is covered and **the tag is not**, so A5 **FAILS** — found by running
  [L-35](LESSONS.md)'s prevention check rather than by recalling the feature. `feedle`
  added as **A1 UNREAD** — a submission surface confirmed, no rule reached, and the read went red on
  the reader's own terse-page floor rather than on anything the host did. Three reads
  ([32307232421](https://github.com/in-c0/tuned/actions/runs/32307232421),
  [32307293995](https://github.com/in-c0/tuned/actions/runs/32307293995),
  [32307374484](https://github.com/in-c0/tuned/actions/runs/32307374484)). **Nothing submitted, and
  no instrument built ahead of its gate.**
- **2026-08-19 (run 56)** — **A5 was unsatisfiable for the only open candidate, not unregistered.**
  `GET /:handle/rss.xml` — the exact URL run 55 proposed submitting — wrote no counter of any kind,
  while the register recorded A5's instrument half as *shipped*. Run 48's arrival counters live on
  the HTML feed page; the venue that permits the post is a directory of RSS feeds. Shipped
  `feed_fetch`, `feed_fetch:<handle>` and `arrival_fetch:<tag>` on the RSS route, allowlisted
  `awesome-rss-feeds`, and pre-registered [EXP-009](EXPERIMENTS.md) — thresholds, window, and the two
  inadmissible outcomes (never merged; merged with the tag stripped) — **before** any submission
  exists. A5 now reads ✅ for that candidate and **A2 is the only outstanding condition**, which is
  the owner's to answer. [L-35](LESSONS.md); PR [#49](https://github.com/in-c0/tuned/pull/49).
- **2026-08-19 (run 55)** — **the first candidate whose A1 did not close it, and an instrument
  defect found by a read that succeeded.** Product Hunt joins Reddit as **UNREADABLE** (HTTP 403,
  Cloudflare bot check, [32214495616](https://github.com/in-c0/tuned/actions/runs/32214495616)).
  `plenaryapp/awesome-rss-feeds` **permits the form** — *"There are two ways to add any category,
  country or feed in the repository"* — and does not address authorship at all
  ([32215103407](https://github.com/in-c0/tuned/actions/runs/32215103407)). Registered above as
  **NOT YET ADMISSIBLE** with A5 and A2 outstanding, and **proposed rather than performed**.

  **The instrument correction, which is the transferable part.** The first read of that page came
  back HTTP 200, `read_outcome: "page"`, **69,678 visible characters** — every signal this loop has
  for *"the page was really on screen"* — and answered nothing, because
  [`source-read.spec.mjs`](../qa/source-read.spec.mjs) reports the first 4,000 characters and the
  contribution rules sat at character **68,472**. The compact alternative, `/issues/new/choose`,
  served **279** characters to a logged-out reader. **A green read is not an answered question.**
  Fixed in [`cd2d4c6`](https://github.com/in-c0/tuned/commit/cd2d4c6) with a bounded literal `find`
  input rather than a bigger excerpt — a longer prefix mirrors more of someone else's page for the
  same one clause and still misses it if the clause sits further down. See [L-34](LESSONS.md).

- **2026-08-19 (run 54)** — **A1 read for three venues, and the file's own ordering found wrong.**
  Hacker News and Lobsters **FAIL A1 on quoted rules**; Reddit is **unreadable** by this executor
  (HTTP 403 demanding an account or developer token). Runs
  [32191175814](https://github.com/in-c0/tuned/actions/runs/32191175814),
  [32191337996](https://github.com/in-c0/tuned/actions/runs/32191337996),
  [32191459880](https://github.com/in-c0/tuned/actions/runs/32191459880). The A4 column was also
  corrected: it had read ❌ for every candidate since 2026-08-16 while the section at the foot of this
  file has said **SATISFIED for `/sportstech`** since run 52 — a stale table contradicting its own
  document.

  **The ordering correction, which is the transferable part.** *"What this forces, in order"* step 4
  says A1 and A2 are *"only then"* worth reading — after A4 and A5 are satisfied. That is backwards,
  and this run is the evidence. **An A1 read is free, unspendable and repeatable**: it opens a public
  rules page, needs no account, moves no counter, and cannot consume a channel that can only be spent
  once. **A5's threshold work is none of those things** — it is a per-venue claim about expected
  arrivals, and it is wasted entirely if the venue turns out to forbid the post. Reading A1 first
  cost three dispatches and closed two candidates; reading it last would have meant pre-registering
  an arrival threshold for Lobsters and *then* discovering that a sports-technology feed is off topic
  on a site *"focused pretty narrowly on computing"*. **Cheap disqualifying checks go first.**
  See [L-33](LESSONS.md).

- **2026-08-16 (run 48)** — **A5's instrument shipped and verified in production**
  ([`86cabdd`](https://github.com/in-c0/tuned/commit/86cabdd), PR
  [#41](https://github.com/in-c0/tuned/pull/41)): `feed_view:<handle>` splits the destination,
  `arrival:<tag>` identifies the attempt, both bot/human split, only allowlisted tags written,
  `feed_view` untouched. A5's verdict moves from *no instrument* to *threshold unregistered* — it
  still **FAILS**, and every candidate is still **INADMISSIBLE**, because A4 also still fails on every
  Tuned destination and A1/A2 stay **UNREAD**. What changed is that the half which could only be built
  *before* a post now exists, so choosing a channel no longer costs a spent-and-ungradeable attempt.
  Run 46's reason for deferring it is recorded above as wrong rather than quietly dropped
  ([L-26](LESSONS.md)). No landing surface touched, no product copy, no schema, no spend.
- **2026-08-16 (run 47)** — A1's read mechanism built and proved:
  [`source-read.yml`](../.github/workflows/source-read.yml) +
  [`qa/source-read.spec.mjs`](../qa/source-read.spec.mjs). No condition, threshold or verdict in this
  file changed — every candidate is still INADMISSIBLE, A4 still fails on every Tuned destination, and
  A1/A2 stay **UNREAD** until a venue's rules are actually quoted from a dated read. What changed is
  that step 3 is now performable instead of aspirational, and the same instrument is what lets
  EXP-008's threshold 6 be answered honestly rather than conceded — which is the only thing that can
  move A4.
- **2026-08-16 (run 46)** — created. Test A1–A5 fixed in advance; A3 recorded as already satisfied;
  A4 and A5 recorded as failing with their evidence; A5's visibility half identified this run from
  `src/index.ts:672` and the ten-day `feed_view` range. No channel authorized, no venue rules read
  (egress blocked, 35 consecutive runs), no production change, AUD $0.00 spent.

## A4 moved for the first time — 2026-08-18 (run 52)

[EXP-008](EXPERIMENTS.md) PASSED and `@sportstech`'s newest public item is now **minutes old**
instead of seventeen days old. A4 has read *"FAILS — every feed"* in every prior reading of this
file; it now reads **SATISFIED for `/sportstech`**.

**Four things must be held together, and dropping any one of them misreads it.**

1. **It is one destination, not the destination.** The landing page's demo link resolves to `/ava`
   ([EXP-004](EXPERIMENTS.md)), whose newest public item is still **2026-08-02**. Any channel whose
   link lands a stranger on `/` or `/ava` still fails A4 exactly as before.
2. **It expires on a clock.** The threshold is ≤ 72 hours. Item 242 was published
   2026-08-18T04:15:49Z, so `/sportstech` fails A4 again from **2026-08-21 04:15 UTC** unless
   something else is genuinely worth publishing by then.
3. **Publishing to hold A4 open would invert the rule.** A4's own text says freshness is a
   *consequence* of publishing something worth publishing, never the motive, and EXP-008's binding
   clauses say a publication made to move a number is disqualified by threshold 6. **A4 decaying
   back to FAILS is an acceptable outcome.** It is not a reason to lower the bar on the next find.
4. **A4 satisfied is not admissibility.** A5 still **FAILS** — no arrival threshold or window is
   pre-registered, and none can be until a channel is chosen. **No channel is admissible today**,
   and the reason has simply changed from *two conditions fail* to *one does*.

**What this makes possible that was not possible yesterday.** A channel proposal can now name a
destination that is not stale on arrival, provided it points at `/sportstech` and is posted inside
the window. That is a precondition being met, not a channel existing — the proposal itself is still
unwritten and still needs authorisation.

**A4's evidence survived a deliberate reversal — 2026-08-18 (run 53).** Item 242 was retracted and
restored in production to prove the operator plane's new undo works
([DECISIONS.md](DECISIONS.md), blocker #5). During the ~4-minute window `@sportstech`'s
`last_public_item_at` reverted to **2026-07-30T22:48:09.614Z** and **A4 failed for every feed again**,
exactly as it should. After `restore` it reads **2026-08-18T04:15:49.089Z** to the byte
([32126644562](https://github.com/in-c0/tuned/actions/runs/32126644562)), so **nothing in the reading
above changed and the 2026-08-21 04:15 UTC expiry is unmoved.** Recorded because the window is
visible in the counters and a later run finding it should not have to reconstruct why.

**A4 lapsed unused, then reopened on a find rather than on paperwork — 2026-08-21 (runs 64–65).**

The window above **expired at 2026-08-21T04:15:49Z with no submission made**, because the one act
that could have used it needed a GitHub identity this executor does not hold. Run 64 waited to that
instant rather than reporting it as pending, and published nothing to hold it open — which is what
this file and [EXP-008](EXPERIMENTS.md) both require, and which cost the loop the first window it
ever had.

**Five hours and twenty minutes later A4 is satisfied again**, on the only route these rules allow:
one `@sportstech` selection cycle produced a find that clears the remit on its own, and freshness
followed. `arxiv.org/abs/2607.26027` — read at page level ([32468312666](https://github.com/in-c0/tuned/actions/runs/32468312666),
`read_outcome: "page"`, 3655 visible characters, no interstitial) and nominated **before** the
dispatch with the case against it written by the nominator ([EXP-008-CANDIDATES.md](EXP-008-CANDIDATES.md),
R-2) — published as **item 246** at **2026-08-21T09:35:56.549Z**, HTTP 201, replay `duplicate=true`.

| Reading | Before | After |
| --- | --- | --- |
| `@sportstech` `public_items` | 12 | **13** |
| `@sportstech` `operator_publications` | 1 | **2** |
| `last_public_item_at` | 2026-08-18T04:15:49.089Z | **2026-08-21T09:35:56.549Z** |
| A4 | **FAILS** — every feed | **SATISFIED** to 2026-08-24T09:35:56Z |

Sources: `list` [32468489106](https://github.com/in-c0/tuned/actions/runs/32468489106) (09:33:51Z,
before) and [32468701244](https://github.com/in-c0/tuned/actions/runs/32468701244) (09:36:30Z, after);
production reading [qa-browser 32468714667](https://github.com/in-c0/tuned/actions/runs/32468714667).

**And the same reading falsified a durable claim in this file**, which is corrected in the A4 row
above rather than deleted. The landing page's demo destination is **not** `/ava`. `demoHandle` is read
off the live landing HTML and came back **`sportstech`**, `demoBlockAgeHours` **0**,
`demoIsFreshest: true`. The demo is chosen at request time as the feed with the newest public item, so
it moved to `/sportstech` when item 242 published on 2026-08-18 — and this file went on asserting the
old routing for three days, in the row whose whole subject is whether a stranger lands somewhere
fresh. [L-42](LESSONS.md).

## A4 restored a second time, and the candidate is un-paused — 2026-08-24 (run 85)

**`awesome-rss-feeds` is ready again.** A4 lapsed unused at 2026-08-24T09:35:56Z (run 83, the second
lapse) and was restored at **2026-08-24T21:43:45.078Z** by item 247. The admissibility row for that
candidate therefore reads **A1 partial · A2 ✅ (the owner's `A`, 2026-08-20 15:04 UTC, preserved
throughout) · A3 ✅ · A4 ✅ · A5 ✅** — the same state it held on 2026-08-21, reached again.

**Three things this does not mean, stated because the loop has misread each of them before.**

1. **A4 was not the reason for the publication.** The test is [EXP-008-CANDIDATES.md](EXP-008-CANDIDATES.md)'s
   R-3 section: the case against the find was written and committed **before** the dispatch, four
   candidates were rejected on remit clauses before a page was opened, and two more were refused by
   their host. Had the third read also come back 403, this cycle would have ended in *publish
   nothing* and A4 would still be failing. That is the shape of a consequence, not a motive.
2. **The submission is not therefore made.** The executor cannot open an issue at that venue — its
   GitHub access is scoped to `in-c0/tuned` and it holds no identity there. That is unchanged, is a
   credentials boundary, and is never routed around. The act is the owner's.
3. **The directive that authorised this cycle explicitly parked the decision.** It says: *"If
   published, record the restored A4 timestamp and stop; leave any renewed external-submission
   decision to the next reviewer preflight."* Recorded, and stopped. **No venue was contacted, no
   form submitted, no account used, and no real channel tag was exercised anywhere** — the QA
   dispatches in this cycle used `?src=qa`, and the two operator publishes carried no tag at all.

**The duplicate check is stale and must be re-read before any submission.** Last read 2026-08-20
21:38 UTC. A four-day-old duplicate reading is exactly the kind of claim [L-42](LESSONS.md) is about.

---

## 2026-08-25 (run 86) — a mechanism defect under `ooh.directory`, found in this register's own quote

**No grade in the table above changes.** `ooh.directory` still reads **A5 ❌** for the reason already
recorded — the URL it takes is the **front page**, so run 48's HTML instrument applies to the route,
but `ARRIVAL_TAGS` holds only `qa` and `awesome-rss-feeds`, so `?src=ooh-directory` writes nothing.
**Nothing was shipped for that tag**, per [L-33](LESSONS.md): no A5 threshold and no allowlist entry
for a venue whose A2 is unanswered. Its A2 is unanswered.

**What was wrong sits one layer below A5, and it was quoted into this file by run 57 and read for the
wrong thing.** The form's field label:

> **URL** — The URL of the blog's front page **(not its feed)**

That was filed as a *URL-shape difference between the two open candidates* — `awesome-rss-feeds` takes
`/sportstech/rss.xml`, `ooh.directory` takes `/sportstech` — and the register's procedure moved on to
whether the route counted. **The question never asked is how a directory that stores a front page
gets to the feed.** It is `<link rel="alternate" type="application/rss+xml">`, and until run 86 **no
page this service serves carried one.** A submission to `ooh.directory` would have been admissible
under A1, correct in every field, and mechanically inert: the venue would have had a URL and no feed.

**Shipped this run:** autodiscovery on `/:handle`, pointing at that handle's own `rss.xml`, with a
test that follows the advertised href and requires a feed back. **Consequence for this register:** the
*mechanism* under `ooh.directory` now works; its **A5 grade is unchanged and still fails**, and its A2
is still open. **No venue was contacted, no form submitted, no account used and no real channel tag
exercised** by this run.

**Procedural amendment, and it applies to every future candidate.** The A-conditions grade whether a
post is *permitted* (A1), *fresh* (A4) and *visible to us* (A5). Add, before A5 is graded: **if
someone follows this venue's stated rules exactly, does the mechanism work end to end on Tuned's
side?** A5 asks *would I see it*. This asks *would it work*. `ooh.directory` passed the first question's
ancestor for six days while failing this one. [L-46](LESSONS.md).

**The duplicate check for `awesome-rss-feeds` remains stale** — last read 2026-08-20 21:38 UTC — and
must be re-read before any submission. Unchanged by this run.

---

## 2026-08-25 (run 87) — the card is live again, the duplicate check is no longer stale, and the tag went public before `t0`

**No grade in the register changes, and nothing was submitted.** `awesome-rss-feeds` holds
**A1 partial · A2 ✅ (the owner's `A`, 2026-08-20 15:04 UTC) · A3 ✅ · A4 ✅ · A5 ✅**. What changed
this run is the state of the two readings with clocks on them, and one fact about the tag.

**A4, re-read from production rather than carried forward.** The previous two readings in this file
came from run 85's report. This run read it again:
[agent operator 32805757838](https://github.com/in-c0/tuned/actions/runs/32805757838) at
`2026-08-25T03:35:42Z` returned `last_public_item_at=2026-08-24T21:43:45.078Z`, `public_items=14`,
`operator_publications=3`, `operator_publications_hidden=0`. **Age 5.9h. Expires
`2026-08-27T21:43:45Z` = 2026-08-28 07:43 Sydney, Friday, with ~66h of window left at the read.**

**The duplicate check is fresh, and it is not this executor's reading.** The
[reviewer directive of 2026-08-25T03:33:11Z](https://github.com/in-c0/tuned/issues/1#issuecomment-5404716623)
records searches of the venue on 2026-08-25 for `sportstech` and `justtuned.com` across open and
closed issues, returning nothing. **The executor did not re-read it and does not restate it as its
own** — the attribution is the point, per [L-42](LESSONS.md). The four-day-old reading of
2026-08-20 21:38 UTC is superseded by that one, with its source named.

**The `?src=` tag's full URL is now public, printed before any submission exists.** The same directive
stated the joined tagged feed URL in its *Minimum action* clause, on a public issue. This is what
[L-36](LESSONS.md) exists to prevent, and it was written as a rule the executor keeps — nothing told
the reviewer it existed. **Consequence for this register:** a post-submission
`arrival_fetch:awesome-rss-feeds` reading can no longer be attributed to the venue without first
subtracting whatever the public print produces. The counter has **never read non-zero**, so the
baseline is clean up to `2026-08-25T03:33:11Z`; the split is registered in [METRICS.md](METRICS.md)
before the number exists. **This does not change any A-grade and is not a reason to delay the
submission** — see [L-47](LESSONS.md).

**Still true, and unchanged by this run:** the act needs the owner's account. The executor's GitHub
access is scoped to `in-c0/tuned` and it holds no identity at the venue. **No venue was contacted, no
form submitted, no account used, nothing published or retracted, and no real channel tag exercised
anywhere** by this run.

## The access finding is corrected: it was never a missing credential — 2026-08-25 (run 88)

**Run 61 recorded the `awesome-rss-feeds` blocker as *unavailable credentials* and this register has
carried that wording for seven runs.** It is wrong in the way that matters.

| Call, run 88, 2026-08-25 | Result |
| --- | --- |
| `get_me` | **`in-c0`** — *ava kim*, Sydney, 82 public repos. **The owner's own GitHub user account**, not a scoped App identity. |
| `get_file_contents` on `plenaryapp/awesome-rss-feeds` | *"Access denied: repository `plenaryapp/awesome-rss-feeds` is not configured for this session. Allowed repositories: `in-c0/tuned`"* |
| `add_repo` for the same venue, `access: push` | *"cross-tier adds are not supported in v1 … Start a new session with the requested repo as the initial source, or add a repo from the same owner as the existing sources"* |

**The identity is sufficient and the session is not.** A GitHub user account can open an issue at any
public repository; `plenaryapp/awesome-rss-feeds` is public, CC0-1.0, 2.7k stars, and invites
submissions through its own issue template. Nothing at the venue refuses this executor — **the venue
has never been asked**, and was not asked this run either. The refusal is imposed by the Claude Code
session's repository allowlist, before any call leaves for GitHub.

**Consequences for the register, stated plainly against its own prior text:**

1. **Row A2 and the owner-action card were asking for the wrong thing.** Authority was granted on
   2026-08-20 and re-granted on 2026-08-25; neither grant could have worked, because neither addressed
   the allowlist. The card now names the layer that stops the act and gives the owner two remedies
   instead of one.
2. **"Verified three ways" (run 61) verified one thing three times.** All three probes established
   *that* the call fails. None established *where*. [L-48](LESSONS.md).
3. **The A-series needs no change.** A0–A5 grade the venue and the destination; this is a property of
   the executor's harness and belongs here, not in the conditions table.
4. **The boundary still holds and was not tested against.** A child session scoped to the venue —
   named by the refusal message itself — was available via `create_session` and was **not** spawned.

**Nothing was submitted and no venue was contacted.** A4 stands as read at run 87
(`2026-08-24T21:43:45.078Z`, expiring `2026-08-27T21:43:45Z` = 2026-08-28 07:43 Sydney); this run made
no production read of its own and does not restate one as fresh.

## The fourth window opens with every condition fresh and the same layer still stopping the act — 2026-08-28 (run 107)

**The [reviewer directive of 09:29:09Z](https://github.com/in-c0/tuned/issues/1#issuecomment-5450853462)
ordered the submission executed** — re-read A4, search the venue's open and closed issues, and if both
pass, create one `Sports` feed issue and record `t0`. **Both preconditions were re-read from
production this run and both pass. The write is still refused at the session boundary.**

| Step | Result, read this run | Evidence |
| --- | --- | --- |
| **A4** — newest public item ≤ 72h | **SATISFIED, 5.29h.** `last_public_item_at=2026-08-28T04:14:13.569Z`, `public_items=15`, `operator_publications=4`, `operator_publications_hidden=0`, `owner: @ava · active 1/12`. **Expires `2026-08-31T04:14:13Z` = 2026-08-31 14:14 Sydney.** | [agent operator 33159736495](https://github.com/in-c0/tuned/actions/runs/33159736495), `09:31:47Z` |
| **Duplicate — issue surface, open *and* closed** | **NONE.** `is:issue justtuned` at the venue: **`Open 0 (0)` · `Closed 0 (0)`**, *"No results. Try adjusting your search filters."* `find_total_occurrences: 1`, and that one occurrence is **GitHub's own echo of the query in its search box** — *"Issues Search Issues is:issue justtuned Search results"* — not a result. | [source read 33159738434](https://github.com/in-c0/tuned/actions/runs/33159738434), `09:32:45Z` |
| **Coverage of both states, checked rather than assumed** | The read resolved the two filter links by `href`: `…?q=is%3Aissue%20justtuned%20state%3Aopen` and `…state%3Aclosed`, both labelled `0`. **One query covered both states**, and `justtuned` is a superset of both the bare host and the tagged feed URL, so a zero here excludes every spelling of the submission. | same run, `find_links` |

**The duplicate run is red and the reading stands, on the same overrule run 61 recorded.** It failed
`read_outcome == "page"` on **`only 735 visible characters, below the 1000 floor`** — GitHub's
zero-result page is genuinely that short, `possible_gate_markers: []`, HTTP 200, title *"Issues ·
plenaryapp/awesome-rss-feeds · GitHub"*. **This is the known false-alarm class, not an unread page:
the substance the check exists to guarantee is quoted verbatim above.** `MIN_PAGE_CHARS` is not
lowered — a floor that is relaxed to make one expected case green stops catching the unexpected ones.

### The refusal, re-tested rather than inherited

`add_repo` for `plenaryapp/awesome-rss-feeds`, `access: push`, **2026-08-28 09:30:25Z**:

> *"cross-tier adds are not supported in v1: requested `plenaryapp/awesome-rss-feeds` but session
> already has repos from owner(s) [in-c0]. Start a new session with the requested repo as the initial
> source, or add a repo from the same owner as the existing sources"*

**Byte-for-byte the run-88 refusal, eight days later.** Nothing about the boundary has decayed,
and nothing about it is going to. Three things follow, and none of them is new — they are re-confirmed
because a directive asked the loop to act as though they had changed:

1. **The remedy the error names was again not taken.** A session scoped to the venue is exactly the
   thing the allowlist exists to prevent, and reaching for it because the loop is impatient is
   boundary-shopping ([L-48](LESSONS.md) §4). **The refusal is respected, not routed around.**
2. **The venue has still never been contacted.** No form, no issue, no account, no draft left
   anywhere. Every reading above is of a public page from GitHub's network.
3. **Nothing is owed by the venue and nothing is wrong with the submission.** A1 partial, A2 ✅,
   A3 ✅, A4 ✅, A5 ✅, duplicate clean. **The submission is correct and unmakeable by this executor.**

### What actually changed this run, and it is not a grade

**The owner card.** [STATUS.md](STATUS.md) reads **ACTION REQUIRED · HIGH** for the first time on this
subject since run 87, and the owner was notified out of band. **The reason is a sequencing defect in
how this loop surfaces the card, not a new fact about the venue:** the card retires itself whenever A4
decays, so it has read `NONE` through most of the hours in which the act was possible, and **three
windows have now lapsed unused** (`2026-08-21T04:15:49Z`, `2026-08-24T09:35:56Z`,
`2026-08-27T21:43:45Z`). Run 106 closed with *"no owner notification, because nothing here needs a
decision from you"* — true of decisions, and the wrong test, because what was needed was not a
decision but two minutes of account access inside a window with a deadline. **The window, not the
card, is the thing with a clock.** [L-50](LESSONS.md).

**No grade in the register changes. `awesome-rss-feeds` holds A1 partial · A2 ✅ · A3 ✅ · A4 ✅
(until `2026-08-31T04:14:13Z`) · A5 ✅**, and [EXP-009](EXPERIMENTS.md) Reading 2 stays **Fork D /
PENDING — inadmissible, not a demand null**. No other candidate was touched, nothing was published,
no real channel tag was exercised, and no demand is inferred from the three lapses in either
direction.

## The destination was failing every venue in the register at once — 2026-08-28 (run 108)

**No grade in this register changes**, and that is the point worth stating first: this is not a channel
finding, it is a finding about the thing every channel points at.

Every candidate graded here terminates the same way — a URL is posted at a venue and someone opens it.
Until [`1b54f07`](https://github.com/in-c0/tuned/commit/1b54f07) that destination, the public feed page,
carried a `<title>`, an icon and the `<link rel="alternate">` run 86 added, and **nothing else**: no
description, no Open Graph, no canonical.

**What that cost each venue shape in the register, concretely:**

| venue shape | what the reader gets | before |
| --- | --- | --- |
| a list whose entries are pasted/shared as links (`awesome-rss-feeds` readers, any social repost) | an unfurled card | **bare text** — every major client reads Open Graph and there was none |
| a directory storing a **front page** (`ooh.directory`: *"the URL of the blog's front page (not its feed)"*) | title + description for its own listing | title only; the description was scraped or absent |
| a **search index** (`feedle`) | a snippet | whatever a crawler chose to scrape |
| any crawler at all | one canonical URL | three origins serving the identical document (`justtuned.com`, `www.justtuned.com`, `workers_dev`) with nothing naming the page |

**This is the run-86 defect one layer out and it is the second time this register has recorded one.**
Run 86's note here read: *"a directory that stores a front page reaches the feed by autodiscovery"* —
true, and it says nothing about what that directory's own listing, or a reader's chat client, displays
for the page. See [L-51](LESSONS.md).

**Standing consequence for the `awesome-rss-feeds` submission when it is made.** Its A-conditions are
unchanged — **A1 partial · A2 ✅ · A3 ✅ · A4 ✅ (until `2026-08-31T04:14:13Z`) · A5 ✅** — and the
window still closes **2026-08-31 14:14 Sydney** with the write still outside this executor's GitHub
scope. What has changed is only that the link is now worth the click it may get.
[EXP-009](EXPERIMENTS.md) Reading 2 stays **Fork D / PENDING — inadmissible, not a demand null**.

**Not inferred, in either direction.** No venue was contacted, nothing was submitted, no real channel tag
was exercised, and **no counter here can observe an unfurl** — this change produces no reading and must
never be reported as one.
