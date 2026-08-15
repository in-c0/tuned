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
and a pre-registered arrival threshold read against it. **This does not exist yet.** It is not built
here, because its correct shape depends on the channel chosen — a per-handle split and a `?src=` tag
answer different questions — and building the wrong one costs more than waiting. It is one bounded
change to a **non-landing** surface, and it must ship **before** the post, never after: counters
start at zero on the deploy that introduces them and there is no backfill, so a first attempt made
without it is spent and ungradeable. Channels like Show HN can only be spent once.

---

## Standing state of the shared conditions — 2026-08-16

A3, A4 and A5 are properties of Tuned, not of any venue, so they gate **every** channel at once.

| | Condition | State | Evidence |
| --- | --- | --- | --- |
| **A3** | A stranger can use the destination | **SATISFIED** | `/ava`, `/sportstech` and the other public feeds render with no account and no application; [EXP-004](EXPERIMENTS.md) PASSED (run 19), and `/:handle` + `/:handle/rss.xml` are unauthenticated routes |
| **A4** | Destination fresh, ≤ 72h | **FAILS — every feed** | `@ava` newest public item **2026-08-02** (14 days); `@sportstech` **2026-07-30T22:48:09.614Z** (17 days), read from production by [run 31877383247](https://github.com/in-c0/tuned/actions/runs/31877383247); `items_public` **79** and unmoved since 08-02 |
| **A5** | A result would be visible | **FAILS — no instrument** | `feed_view` is site-wide and untagged; its human-flagged range is 2–22/day. No per-destination counter exists |

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
3. **A5's instrument must ship before the post, not with it.** One bounded change, non-landing, whose
   shape is decided when the channel is.
4. **Only then** are A1 and A2 worth the read for a specific venue — and they are read from GitHub's
   network and quoted here, not recalled.

**A note on the pointer this replaces.** [EXP-007](EXPERIMENTS.md)'s Fork A names its next action as
*"the binding constraint is distribution, and it is owner-gated (EXP-002)"*. EXP-002 is
**INVALIDATED / NOT STARTED** and withdrawn, so that pointer resolves to a dead artifact. **No
threshold, fork, read time or claim in EXP-007 is altered by this file** — its pre-registration is
untouched, exactly as run 45 left it. This register is what Fork A's next action resolves to when it
is read on 08-17.

---

## Candidate register

No candidate is ADMISSIBLE. A1/A2 are marked **UNREAD** wherever this loop has not quoted the venue's
rules from a dated source — marking them unread is the honest state, and asserting them from memory
is the exact error [L-17](LESSONS.md) records.

| Channel | A1 rules | A2 authorship | A3 | A4 | A5 | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| **Hacker News — Show HN** | **KNOWN-BLOCKING**: prior submission [`49280269`](https://news.ycombinator.com/item?id=49280269) was killed at submission (run 33). Per the withdrawal, a further attempt needs the owner's **explicit moderator permission** first | Owner-authored only; executor drafts nothing | ✅ | ❌ | ❌ | **INADMISSIBLE** — needs moderator permission, a fresh destination, and an arrival counter |
| **Reddit — a topical subreddit** | UNREAD — per-subreddit self-promotion rules must be quoted, not assumed | Owner-authored only | ✅ | ❌ | ❌ | **INADMISSIBLE** |
| **Lobsters** | UNREAD — invite-only membership and authored-by-you rules must be quoted | Owner-authored only | ✅ | ❌ | ❌ | **INADMISSIBLE** |
| **Product Hunt** | UNREAD | Owner-authored only | ✅ | ❌ | ❌ | **INADMISSIBLE** |
| **Paid acquisition** | n/a | n/a | ✅ | ❌ | ❌ | **INADMISSIBLE** *and* owner-gated — no ad account exists (an auth boundary) and any spend must be requested in issue #1 against the AUD $500 cap, of which **$0.00** is spent |
| **Tuned's own public RSS** | n/a — it is Tuned's surface | n/a | ✅ | ❌ | ❌ | Not a channel; it is a destination. Listed so it is not mistaken for reach |

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
2. **A5's instrument.** Ship the arrival counter for that destination, verify it in production, and
   pre-register the arrival threshold and the window. Never after the post.
3. **A1.** Read the venue's rules from GitHub's network. Quote them here with URL, date and run link.
   Answer explicitly: *does this venue permit a post of exactly this form, by exactly this author?*
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

- **2026-08-16 (run 46)** — created. Test A1–A5 fixed in advance; A3 recorded as already satisfied;
  A4 and A5 recorded as failing with their evidence; A5's visibility half identified this run from
  `src/index.ts:672` and the ten-day `feed_view` range. No channel authorized, no venue rules read
  (egress blocked, 35 consecutive runs), no production change, AUD $0.00 spent.
