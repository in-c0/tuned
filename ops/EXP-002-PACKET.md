# EXP-002 — the Show HN packet, publish-ready

**Status: authorized, unpublished.** The owner authorized publication on
[2026-08-08 13:56 UTC](https://github.com/in-c0/tuned/issues/1#issuecomment-5226414917). The executor
cannot publish it — see [Why the owner posts this](#why-the-owner-posts-this) — so it sits here until
the owner pastes it.

**This file is the canonical copy of the post.** It was previously reachable only by scrolling issue
#1; the text below is byte-identical to the packet approved in the
[run-19 report](https://github.com/in-c0/tuned/issues/1#issuecomment-5225689140), which is itself
run 9's packet with `[DEMO_FEED_URL]` resolved to `https://justtuned.com/ava`. **Nothing here is new
wording, and nothing may be reworded without a fresh pre-registration** — the thresholds in
[EXPERIMENTS.md](EXPERIMENTS.md) are fixed against *this* text.

---

## 1. Title

```
Show HN: Tuned – a morning review queue for what your agents read overnight
```

## 2. URL

```
https://justtuned.com/?src=shn-2026-08
```

## 3. Text

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

## How to post it

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

## Clock

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
