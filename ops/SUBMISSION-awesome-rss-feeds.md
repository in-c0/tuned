# Submission packet — `plenaryapp/awesome-rss-feeds`

**For the owner. Prepared 2026-09-04 (run 137). There is no deadline on this.**

Every condition this loop can satisfy is satisfied. The act itself needs a GitHub account, and this
executor holds no instrument that can perform a write at any third party ([A0](DISTRIBUTION.md), NO
at every venue, re-tested four times). So this file exists to make the act a paste rather than a
research task — the four authorized windows that lapsed between 2026-08-21 and 2026-08-31 each asked
for two minutes of account access **inside 72 hours**, and that clock is now gone
([A4](DISTRIBUTION.md), durable-listing test, run 137).

**Authorization already on record:** the owner's **`A`**, 2026-08-20 15:04 UTC, naming *"the venue's
own Google form or issue template"*. Nothing here asks for a new decision. If the answer has changed,
one comment on issue #1 saying so retires this file.

---

## Path A — the venue's GitHub issue template (preferred)

Preferred for one reason: it produces a **canonical URL**. [EXP-009](EXPERIMENTS.md) Fork D exists to
keep *"the maintainer never merged it"* separable from *"it was never admissible"*, and a URL is the
receipt that keeps those apart. Path B cannot.

1. Go to <https://github.com/plenaryapp/awesome-rss-feeds/issues/new/choose>
2. Choose the template for adding a new feed.
3. Fill exactly these values — **nothing else, and no prose**:

| Field | Value |
| --- | --- |
| Category | `Sports` |
| Feed URL | `https://justtuned.com/sportstech/rss.xml?src=awesome-rss-feeds` |
| Title / name, if the template asks | `Tuned — @sportstech` |
| Is this a podcast? | `No` |

4. Submit.
5. **Paste the issue URL and the submission timestamp into issue #1.** That timestamp is `t0` for
   [EXP-009](EXPERIMENTS.md); without it the arrival reading has no start and grades nothing.

### The `?src=` suffix is load-bearing — do not drop it

`arrival_fetch:awesome-rss-feeds` is the **only** counter that can attribute an arrival to this
venue. It is written by [`src/index.ts`](../src/index.ts)'s `ARRIVAL_TAGS` allowlist on
`GET /:handle/rss.xml`, and an unrecognised or absent tag counts **under no name at all** — there is
no "other" bucket to recover it from. Submitting the bare `…/rss.xml` makes the attempt permanently
ungradeable, which is the exact failure [A5](DISTRIBUTION.md) exists to prevent. The URL renders
identically with the suffix; it is a campaign label on the link, aggregated daily, with no cookie and
no visitor identifier.

## Path B — the venue's Google form (authorized, and second choice)

<https://github.com/plenaryapp/awesome-rss-feeds> links a `Recommended Feed Suggestion` form:
`Category *` → `Sports`, `Feed *` → the tagged URL above, `Is this a Podcast?` → `No`, then Submit.
No sign-in gates the Submit control. There is no title field and no free-text field of any kind.

**Its cost, stated so the trade is yours to make and not made for you:** a form submission produces
**no receipt and no canonical URL**. A third outcome — *"the submission never arrived"* — becomes
permanently indistinguishable from *"nobody wanted it"* and from *"the maintainer declined"*. If
Path B is used, EXP-009's Fork D grading must record that the null is uninterpretable in that
direction.

---

## What must not go in the submission

Not caution — these are standing boundaries, and the honest version is the only version available.

- **No claim about traction, users, subscribers or revenue.** The true figures are `applications` 0,
  `members` 1, `members_ever_active` 0, `followers` 0, gross cash AUD $0. A submission may not imply
  otherwise.
- **No prose written by this executor and published as yours.** Everything above is a URL, a category
  and a name. That is [A2](DISTRIBUTION.md), and it is why this venue was reachable at all when Show
  HN was not.
- **One submission.** Not both paths, and not a second entry in another category.

## Preconditions, and when each was last read from production

| Condition | State | Read |
| --- | --- | --- |
| **A0** — can this executor perform the write? | **NO** — the only unresolved blocker | re-tested 2026-08-28, byte-identical refusal to run 88's |
| **A1** — venue permits a post of this form | **PARTIAL** — *"two ways to add any category, country or feed"*; authorship unaddressed, and silence is not permission | [32215103407](https://github.com/in-c0/tuned/actions/runs/32215103407), 2026-08-19 |
| **A2** — authorship | **✅** — not authored prose; owner's `A` on record | 2026-08-20 15:04 UTC |
| **A3** — destination renders for a stranger | **✅** | standing |
| **A4** — destination not stale on arrival | **✅ — durable listing, no expiry.** 4 publications in the trailing 30 days, 4 in the trailing 90 | [33861980480](https://github.com/in-c0/tuned/actions/runs/33861980480), 2026-09-04T10:10:59Z |
| **A5** — a null is separable and a positive is visible | **✅** — `arrival_fetch:awesome-rss-feeds` live; threshold, window and both inadmissible outcomes pre-registered in [EXP-009](EXPERIMENTS.md) | run 56 |
| **Duplicate** — no prior `justtuned` issue at the venue | **NONE.** `is:issue justtuned` → **`Open 0 (0)` · `Closed 0 (0)`**, *"No results. Try adjusting your search filters."* One query covered both states (both filter links resolved by `href`). The venue itself is live — 7 open issues | [33862204937](https://github.com/in-c0/tuned/actions/runs/33862204937), 2026-09-04T10:21:47Z |

**Re-read A4 and the duplicate check in the cycle of the submission.** Both are cheap: one
`agent-operator` `list` dispatch and one `source-read` dispatch. Neither needs the owner.

## After it is submitted

Nothing is expected quickly and nothing should be inferred from silence. [EXP-009](EXPERIMENTS.md)
holds the arrival threshold, the window and the two inadmissible outcomes, all registered before any
submission existed. The measured null a tagged Tuned URL earns with **no channel behind it** is
`control_days` = **1 day in 14** ([EXP-010](EXPERIMENTS.md), graded 2026-09-04): a treatment must
**exceed** that floor, not reach it.
