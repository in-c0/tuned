# EXP-002 — the Show HN packet — **WITHDRAWN — DO NOT POST OR RESTORE UNCHANGED**

> # ⛔ WITHDRAWN 2026-08-13 (run 34). This is not publishable text.
>
> **Nobody should paste any part of this file into Hacker News — not the title, not the URL, not the
> body — and the killed item [`49280269`](https://news.ycombinator.com/item?id=49280269) must not be
> restored while it points at this packet.** The file is kept only as the record of what was written
> and why it was wrong. It is no longer a plan, an instruction, or an owner action.
>
> **Two defects, either one disqualifying, and both are properties of the packet rather than of Tuned:**
>
> 1. **§3 was written by an AI, and it was to be posted as the owner's own first comment.** The
>    executor authored it on run 9 ([DECISIONS](DECISIONS.md), *"Action taken: a distribution packet,
>    and no code"*). Hacker News asks people not to post generated or AI-edited text in comments. The
>    whole delivery mechanism in *How this was to be posted* below — "immediately post §3 as the first
>    comment on your own thread" — is therefore an instruction to break that rule in the owner's name.
> 2. **§2 submits an application-gated landing page.** Show HN asks for something a reader can try
>    directly, and says landing and sign-up pages are off-topic. `https://justtuned.com/?src=shn-2026-08`
>    is the marketing/application surface; §3 concedes the point in its own words — *"membership is
>    application-only right now"*. That the packet also *mentions* `/ava` does not fix it, because the
>    submitted URL is what the rule is about.
>
> **What a future Hacker News attempt requires, all three, before anything is drafted:**
>
> - a **directly usable destination** — something a reader can try without applying or signing up, not
>   a landing page;
> - the **owner's own words**, genuinely human-written and not AI-edited, for the title and for any
>   comment. The executor must not draft, reword, or edit that text;
> - **explicit moderator permission to submit again**, obtained by the owner, before any resubmission
>   of this or any related link.
>
> **What this withdrawal does not mean.** It says nothing about whether Tuned is wanted. The channel
> and the protocol were invalid; the product hypothesis was never tested, and is neither supported nor
> weakened by any of this. See [L-17](LESSONS.md).

**Status: `INVALIDATED / NOT STARTED`, withdrawn 2026-08-13.** The owner authorized publication on
[2026-08-08 13:56 UTC](https://github.com/in-c0/tuned/issues/1#issuecomment-5226414917) and pasted it
on 2026-08-13 00:13 UTC; Hacker News killed the item at submission, and the packet has now been found
non-compliant on review. It has **no t0, no window, no grade and no implication about demand.**

**Historical note on provenance.** The text below is byte-identical to the packet approved in the
[run-19 report](https://github.com/in-c0/tuned/issues/1#issuecomment-5225689140), which is itself
run 9's packet with `[DEMO_FEED_URL]` resolved to `https://justtuned.com/ava`. It is preserved
unaltered **as evidence, not as copy** — rewriting it now would destroy the record of the defect.

---

## 1. Title — **WITHDRAWN, do not post**

```
Show HN: Tuned – a morning review queue for what your agents read overnight
```

## 2. URL — **WITHDRAWN, do not post: application-gated landing page**

```
https://justtuned.com/?src=shn-2026-08
```

## 3. Text — **WITHDRAWN, do not post: AI-authored, and it was to be the owner's own comment**

```
I run a couple of agents that read overnight — one on a schedule, one I kick off
before bed. The problem I kept hitting isn't that they miss things. It's the
opposite: by morning there is far more output than I will ever read, and it all
arrives as undifferentiated text.

Tuned is my attempt at the other end of that pipe. It's a morning queue of what
your agents actually looked at, with the provenance kept separate rather than
flattened: observed by the agent, selected by the agent, opened by you, starred
by you, shared by you. You star, skip or hide. The ones you star land on your own
feed credited "via @agent". Your stars and skips come back to the agent as part
of the brief it fetches before its next run, alongside a charter you write in
plain language.

The design bet is that the scarce thing is human attention, not content — so the
product never asks you to produce any. It doesn't summarize for you and it never
makes you write a caption. Notes are optional everywhere.

What you can look at without an account: https://justtuned.com/ava is a live
feed, and every feed has open RSS. What's gated: membership is application-only
right now, because I read every application by hand — including agents, which
join as members with their own feeds and their own public provenance. I'd rather
say that plainly at the top than bury it behind a signup.

What I don't actually know, and what I'm here to ask: for those of you already
running agents daily — is a morning review queue the thing you'd want, or have
you already solved this with a folder of markdown files and a habit? And if you'd
pay for it, what would you expect it to cost?
```

---

## How this was to be posted — **WITHDRAWN. Do not follow these steps.**

**Step 4 below is the defect, stated in its own words:** it instructs the owner to post
executor-written text as their first comment. Preserved verbatim because the instruction is the
evidence. Nobody should execute it.

Open <https://news.ycombinator.com/submit> while signed in, then:

1. **Title** → paste §1 verbatim (**75** characters; HN's limit is 80 — it fits, with 5 to spare.
   The run-19 report said 74; recounted here, it is 75. Nothing depends on the difference).
2. **url** → paste §2 verbatim.
3. **Submit.**
4. **Immediately post §3 as the first comment on your own thread.**

**Step 4 is not a stylistic preference — it is how HN's form works.** The submit page accepts *either*
a url or text, not both; entering a url disables the text box. HN's own
[Show HN guidelines](https://news.ycombinator.com/showhn.html) say to put the description in a comment.
**Stated as expected form behaviour, not as something re-checked today:** this executor has no egress
to `news.ycombinator.com` (CONNECT 403), so if the form does accept both fields, paste §3 into the
text box instead and skip step 4. Either placement is faithful to the packet; posting the URL with no
description at all is not.

Then **paste the resulting `https://news.ycombinator.com/item?id=…` URL into
[issue #1](https://github.com/in-c0/tuned/issues/1)**, with the time you posted. That URL is what
starts the experiment's clock — see §*Clock* below.

### Timing, offered as advice and not a requirement

Weekday mornings US Pacific (roughly 23:00–02:00 UTC, 09:00–12:00 Sydney the next day) are the
conventional window. **Do not delay a day to chase it** — a posted experiment beats an optimally-timed
unposted one, and the packet has now been ready for eleven runs.

---

## What must not change

- **Do not edit the wording to make it stronger.** Every claim in §3 is checked: the apply path was
  driven by a real browser in [EXP-003](EXPERIMENTS.md), and the "live feed + open RSS" sentence by
  [EXP-004](EXPERIMENTS.md) — `https://justtuned.com/ava` served 200 with 24 items and
  `/ava/rss.xml` served 200 `application/rss+xml` with 38 items, at both widths.
- **Do not post it to a second channel.** Attribution rests on this being the only channel ever
  posted; the `?src=shn-2026-08` tag is **inert** (the app ignores query parameters and the `waitlist`
  table has no source column, EXPERIMENTS.md). A second simultaneous channel makes the result
  unattributable.
- **Do not vote-ring, ask for upvotes, or seed the thread.** It would invalidate the result and
  violate HN's rules.

## Clock — **void. No clock will ever start from this packet.**

EXP-002 is `INVALIDATED / NOT STARTED`. There is no t0, no window and no grade, and none will be
created retroactively if the item is ever restored — a restored item pointing at a landing page, with
an AI-written comment beneath it, would be the same invalid test. The rule below is kept only to show
what was pre-registered.

The 48-hour window starts at the **actual publication time**, recorded in UTC and Sydney. It is not
started by authorization, and the executor will not mark EXP-002 `STARTED` until the canonical item
URL exists. Because the metrics series buckets by **UTC day**, a mid-day start straddles two buckets,
so per-day counts are bounds on the in-window count rather than the count itself.

## Why the owner posts this

Public posting carries account and reputational authority the executor does not hold, and the
executor holds no Hacker News session: no credential, no cookie, and no network route to the host
(`curl` exit 56, CONNECT 403, checked run 20). Publishing on the owner's behalf would be
impersonation even if it were technically possible. This is an authentication boundary the loop stops
at by design — not a task it deferred.
