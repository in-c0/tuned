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

*Evidence required:* the destination's newest public item, timestamped, read from production within
the same cycle as the post.

*Threshold, fixed here in advance:* **newest public item ≤ 72 hours old at the moment of posting.**
Chosen because the product's promise is a *morning* queue: a destination whose freshest item predates
the reader's last three mornings contradicts the offer on sight.

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
| **A4** | Destination fresh, ≤ 72h | ~~**FAILS — every feed**~~ **SATISFIED for `/sportstech` only, and it expires 2026-08-21 04:15 UTC.** Still **FAILS** for `/ava` and therefore for the landing page's own demo destination | `@sportstech` newest public item **2026-08-18T04:15:49.089Z** — item 242, [EXP-008](EXPERIMENTS.md) PASSED, `list` [32098592220](https://github.com/in-c0/tuned/actions/runs/32098592220). `@ava` still **2026-08-02** (16 days), and [EXP-004](EXPERIMENTS.md) established the landing page's demo link resolves to `/ava`, not `/sportstech`. Superseded evidence: `@sportstech` **2026-07-30T22:48:09.614Z** read by [run 31877383247](https://github.com/in-c0/tuned/actions/runs/31877383247) |
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
  is **SATISFIED only until 2026-08-21 04:15 UTC**, and a publication made to hold that window open
  is disqualified by [EXP-008](EXPERIMENTS.md)'s binding clauses. If A4 has decayed, A4 is fixed by
  publishing something worth publishing or the submission waits.
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

---

## Candidate register

No candidate is ADMISSIBLE. A1/A2 are marked **UNREAD** wherever this loop has not quoted the venue's
rules from a dated source — marking them unread is the honest state, and asserting them from memory
is the exact error [L-17](LESSONS.md) records.

**A4 column, read correctly:** ✅ below means *satisfied for `/sportstech` only, until 2026-08-21
04:15 UTC*, per the section at the foot of this file. Any candidate whose link would land a stranger
on `/` or `/ava` still fails A4.

| Channel | A1 rules | A2 authorship | A3 | A4 | A5 | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| **Hacker News — Show HN** | **READ 2026-08-18** ([32191459880](https://github.com/in-c0/tuned/actions/runs/32191459880)) — **FAILS**: *"Don't post landing pages"*; *"without barriers such as signups or emails"*; and a feed is *"reading material"*, which the page lists as off topic. Also **KNOWN-BLOCKING**: prior submission [`49280269`](https://news.ycombinator.com/item?id=49280269) was killed at submission (run 33) and a further attempt needs the owner's **explicit moderator permission** | Owner-authored only; executor drafts nothing | ✅ | ✅ `/sportstech` | ❌ | **INADMISSIBLE** — fails A1 on the destination's *form*, before moderator permission is even reached |
| **Reddit — a topical subreddit** | **UNREADABLE 2026-08-18** ([32191175814](https://github.com/in-c0/tuned/actions/runs/32191175814)) — HTTP **403**, *"blocked by network security … log in to your Reddit account or use your developer token"*. The rules cannot be quoted by this executor at all; resolving A1 here is an **owner action** | Owner-authored only | ✅ | ✅ `/sportstech` | ❌ | **INADMISSIBLE** — A1 unresolvable without an account this executor does not hold |
| **Lobsters** | **READ 2026-08-18** ([32191337996](https://github.com/in-c0/tuned/actions/runs/32191337996)) — **FAILS** on three quoted grounds: topicality is *"pretty narrowly on computing"* and excludes *"entrepreneurship"*; *"self-promo should be less than a quarter of one's stories and comments"*, which a first submission cannot satisfy; and membership runs through *"a user invitation tree"* | Owner-authored only | ✅ | ✅ `/sportstech` | ❌ | **INADMISSIBLE** — closed on the venue's own words |
| **Product Hunt** | **UNREADABLE 2026-08-19** ([32214495616](https://github.com/in-c0/tuned/actions/runs/32214495616)) — HTTP **403**, `Just a moment...`, *"Performing security verification … verifies you are not a bot"*, 266 chars. The rules cannot be quoted by this executor; resolving A1 here is an **owner action** | Owner-authored only | ✅ | ✅ `/sportstech` | ❌ | **INADMISSIBLE** — A1 unresolvable by this executor |
| **awesome-rss-feeds** (`plenaryapp`) | **READ 2026-08-19** ([32215103407](https://github.com/in-c0/tuned/actions/runs/32215103407)) — **FORM PERMITTED**: *"There are two ways to add any category, country or feed in the repository"*, via Google form or *"an issue with one of the given templates to add new feeds"*. **Authorship unaddressed** — no self-promotion clause either way, and silence is not permission | **Not authored prose** — a feed URL, title and category. The EXP-002 defect does not arise; submitting in the owner's name is still an owner/reviewer decision | ✅ | ✅ `/sportstech` **until 2026-08-21 04:15 UTC** | ~~❌ — no tag allowlisted, no threshold registered~~ **✅ — run 56.** `arrival_fetch:awesome-rss-feeds` allowlisted and counted on the RSS route; [EXP-009](EXPERIMENTS.md) registers the threshold, the window and the two inadmissible outcomes, all before any submission | **NOT YET ADMISSIBLE — A2 is now the only outstanding condition, and it is the owner's to answer.** A1 partially satisfied, A3 ✅, A4 ✅ until 2026-08-21 04:15 UTC, A5 ✅ |
| **ooh.directory** | **READ 2026-08-19** ([32307232421](https://github.com/in-c0/tuned/actions/runs/32307232421), [32307374484](https://github.com/in-c0/tuned/actions/runs/32307374484)) — **FORM PERMITTED ON A CONDITION**: *"Link blogs are only included if they include original commentary about each link"*; English-only ✅; *"updated within the past couple of months"* ✅. **Authorship unaddressed**, and the condition met is *original commentary*, which here is agent-written | **Not authored prose** — a URL, a category and optional names. Submitting in the owner's name is still an owner/reviewer decision, and the venue calls these *"suggestions rather than submissions"* | ✅ | ✅ `/sportstech` **until 2026-08-21 04:15 UTC** | ❌ — **route covered, tag not.** The URL this venue takes is the **front page, not the feed**, so run 48's HTML instrument applies; but `ARRIVAL_TAGS` ([`src/index.ts:703`](../src/index.ts)) holds only `qa` and `awesome-rss-feeds`, so `?src=ooh-directory` writes **nothing**. No threshold registered | **NOT YET ADMISSIBLE** — A1 partially satisfied, A3 ✅, A4 ✅ until 2026-08-21 04:15 UTC, **A5 ❌**, A2 open |
| **feedle** (`feedle.world`) | **UNREAD 2026-08-19** ([32307293995](https://github.com/in-c0/tuned/actions/runs/32307293995)) — the page was served (200, 745 chars, no gate markers) and carries **"Submit your blog or podcast"**, but no rule about who may submit was reached. The read went red on the reader's own 1,000-character floor, which was a **false alarm rather than a refusal** | UNREAD | ✅ | ✅ `/sportstech` | ❌ | **CANDIDATE — A1 UNREAD.** The only register entry with a readable, unread rules page |
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

1. **A4 first.** Confirm the intended destination's newest public item is ≤ 72h old, read from
   production in the same cycle. If it is not, stop — there is nothing to post about.
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
