# Submission packet — `ooh.directory`

**For the owner. Prepared 2026-09-06 (run 143). There is no deadline on this.**

This is the **second** venue packet, alongside
[`SUBMISSION-awesome-rss-feeds.md`](SUBMISSION-awesome-rss-feeds.md). Both are now paste-ready, both
need about two minutes of account access, and neither can be performed by this executor
([A0](DISTRIBUTION.md), NO at every venue, re-tested five times).

**This one needs a decision first, and the other does not.** `awesome-rss-feeds` already has your
`A` from 2026-08-20 15:04 UTC. This venue has never been put to you. **A2 is open** — see
[Question 1](#question-1--a2-may-tuned-be-suggested-here-at-all) below. One comment on issue #1
answers it either way, and a `no` retires this file permanently.

---

## Question 1 — A2: may Tuned be suggested here at all?

ooh.directory is a curated **blog** directory. Its FAQ admits link blogs on one condition, quoted
from [32307374484](https://github.com/in-c0/tuned/actions/runs/32307374484):

> **Link blogs are only included if they include original commentary about each link.**

`/sportstech` meets that on its face — every item carries a `why` line, which is precisely what the
condition names. **The commentary is written by an agent**, and the page carries an `AI AGENT` badge
saying so, so nothing is concealed from a human curator reading it. But the FAQ has no clause about
machine-written text either way, and **silence is not permission**. That is why
[A1 reads PARTIALLY SATISFIED](DISTRIBUTION.md) and why A2 is yours rather than this executor's:
suggesting an agent-written link blog to a human-curated blog directory, in your name, is an
authorship decision.

**Answer `A` (proceed) or `N` (retire) on issue #1.** Nothing below happens without `A`.

---

## The submission, if the answer is `A`

1. Go to <https://ooh.directory/suggest/>
2. Fill exactly these values — **nothing else, and no prose**:

| Field | Value |
| --- | --- |
| **URL** — *"The URL of the blog's front page (not its feed)"* | the front page `https://justtuned.com/sportstech`, **with the query string `?src=ooh-directory` appended** — see below |
| Category | `Sport and exercise` |
| Country, if asked | `Australia` |
| Your name / email, if asked | yours, or blank — the form does not require it |

3. Send it in.
4. **Paste the submission timestamp into issue #1.** That timestamp is `t0` for
   [EXP-012](EXPERIMENTS.md); without it the arrival reading has no start and grades nothing.

### The `?src=` suffix is load-bearing — do not drop it

`arrival:ooh-directory` is the **only** counter that can attribute an arrival to this venue. It is
written by [`src/index.ts`](../src/index.ts)'s `ARRIVAL_TAGS` allowlist on `GET /:handle`, and an
unrecognised or absent tag counts **under no name at all** — there is no "other" bucket to recover it
from. Submitting the bare front-page URL makes the suggestion permanently ungradeable, which is the
exact failure [A5](DISTRIBUTION.md) exists to prevent. The page renders identically with the suffix;
it is a campaign label on the link, aggregated into a daily count, with no cookie and no visitor
identifier.

**Why the URL is written in two pieces above.** [A6](DISTRIBUTION.md)'s standing rule is that a real
channel tag's joined URL is never printed in an ops file — printing it publishes it, and a published
URL gets fetched by things that are not the venue. Splitting it is compliance with that rule and
**costs you nothing**; it is emphatically **not** a privacy measure, and run 58 already established
why one is impossible here. What makes the reading interpretable is the pair of controls EXP-012
registers, not secrecy.

---

## What must not go in the submission

Not caution — these are standing boundaries, and the honest version is the only version available.

- **No claim about traction, users, subscribers or revenue.** The true figures are `applications`
  **0**, `members` **1**, `members_ever_active` **0**, `followers` **0**, gross cash **AUD $0**. A
  suggestion may not imply otherwise.
- **No prose written by this executor and published as yours.** Everything above is a URL, a category
  and a country.
- **One suggestion.** Not a second entry in another category, and not a resubmission after silence.

## Preconditions, and when each was last read from production

| Condition | State | Read |
| --- | --- | --- |
| **A0** — can this executor perform the write? | **NO** — structural, and the reason this file exists | re-tested 2026-09-06, `CONNECT tunnel failed, response 403` |
| **A1** — venue permits a post of this form | **PARTIAL** — form invites suggestions; link blogs admitted *"if they include original commentary about each link"*; authorship of that commentary unaddressed | [32307232421](https://github.com/in-c0/tuned/actions/runs/32307232421) + [32307374484](https://github.com/in-c0/tuned/actions/runs/32307374484), 2026-08-19 |
| **A2** — authorship | **OPEN — the one question above** | never asked |
| **A3** — destination renders for a stranger | **✅** | standing |
| **A4** — destination not stale on arrival | **✅ — durable listing, no expiry.** The venue's own bar is *"updated within the past couple of months"*, looser than the cadence test applied | run 137, 2026-09-04 |
| **A5** — a null is separable and a positive is visible | **✅ — closed by run 143.** `arrival:ooh-directory` live on `GET /:handle`; threshold, window, two controls and four inadmissible outcomes pre-registered in [EXP-012](EXPERIMENTS.md) before any submission exists | run 143, 2026-09-06 |
| **Duplicate** — no prior `justtuned` entry at the venue | **UNREAD** — cheap, one `source-read` dispatch, and it belongs in the cycle of the submission rather than now | — |

**Re-read the duplicate check in the cycle of the submission.** It needs one `source-read` dispatch
and no owner action.

## After it is submitted

Nothing is expected quickly, and the venue says so itself: *"These are suggestions rather than
submissions… Suggesting a blog does not guarantee it will appear on the site."*
[EXP-012](EXPERIMENTS.md) registers **never-listed** as its expected modal outcome (Fork O-D), in
which case **nothing is graded** and no demand inference is made in either direction. The measured
null a tagged Tuned URL earns on this route with **no channel behind it** is **0 non-zero days across
21** — so a treatment must clear D ≥ 3 and V ≥ 8, both registered before the counter had ever been
written.
