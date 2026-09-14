# Submission packet — `plenaryapp/awesome-rss-feeds`

**For the owner. Prepared 2026-09-04 (run 137). Preconditions re-read from source 2026-09-14 (run
160) and all still hold. There is no deadline on this.**

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
| **A0** — can this executor perform the write? | **NO, and CLOSED rather than pending (2026-09-13, run 157).** The refusal is structural, not transient: `add_repo` refuses cross-owner attachment outright, and a direct read of the venue is refused by the session's repository allowlist independently of it. It will not lapse on its own, so re-testing it each cycle is a one-line confirmation and not an investigation. A path exists — a session scoped to the venue — and it was **escalated rather than taken**: the owner's `A` authorises the submission, not this executor widening its own access to a third party to make it. | re-tested 2026-09-13 (run 157); previously 2026-08-28, byte-identical refusal to run 88's |
| **A1** — venue permits a post of this form | **PARTIAL** — *"two ways to add any category, country or feed"*; authorship unaddressed, and silence is not permission | [32215103407](https://github.com/in-c0/tuned/actions/runs/32215103407), 2026-08-19 |
| **A2** — authorship | **✅** — not authored prose; owner's `A` on record | 2026-08-20 15:04 UTC |
| **A3** — destination renders for a stranger | **✅** | standing |
| **A4** — destination not stale on arrival | **✅ — durable listing, no expiry, and stronger than when this file was written.** **8** publications in the trailing 30 days and **8** in the trailing 90, against a bar of ≥ 1 and ≥ 3. Production reports `public_items=19 · operator_publications=8 · operator_publications_hidden=0 · last_public_item_at=2026-09-12T10:21:50.674Z`; the per-item dates behind the 30/90-day split come from [`qa/nominations/`](../qa/nominations), whose 8 entries reconcile exactly with production's `operator_publications=8` | [34831621225](https://github.com/in-c0/tuned/actions/runs/34831621225), **2026-09-14T10:08:20Z** (was 4-in-30 at [33861980480](https://github.com/in-c0/tuned/actions/runs/33861980480), 2026-09-04) |
| **A5** — a null is separable and a positive is visible | **✅** — `arrival_fetch:awesome-rss-feeds` live; threshold, window and both inadmissible outcomes pre-registered in [EXP-009](EXPERIMENTS.md) | run 56 |
| **Duplicate** — no prior `justtuned` issue at the venue | **NONE, re-read today and unchanged.** `is:issue justtuned` → **`Open 0 (0)` · `Closed 0 (0)`**, both filter links resolved by `href` (`…state%3Aopen`, `…state%3Aclosed`), 103 anchors scanned, HTTP 200. **The spec that carried this read finished RED and the reading stands anyway** — see the note below | [34831864620](https://github.com/in-c0/tuned/actions/runs/34831864620), **2026-09-14T10:12:06Z** (was [33862204937](https://github.com/in-c0/tuned/actions/runs/33862204937), 2026-09-04) |

**Last verified: 2026-09-14 (run 160). Both cheap preconditions above were re-read from source on
that date** — one `agent-operator` `list` dispatch and one `source-read` dispatch, neither needing
the owner.

**This replaces an instruction that could never fire.** The line here previously read *"re-read A4
and the duplicate check **in the cycle of the submission**"* — an obligation conditioned on an event
that has not happened and may not, so in the ten days this packet sat ready it never once fired, and
the card was surfaced to the owner in every report over that span on evidence that was aging. The
obligation is now **dated rather than conditional**: whoever surfaces the card re-reads both and
stamps the date, because the trigger for the re-read must be something the loop actually does.
[L-78](LESSONS.md).

### Why the duplicate-check spec finished red, and why the reading is still good

`source-read`'s classifier requires **1000 visible characters** before it will call a fetch a `page`
rather than an `interstitial`. GitHub's zero-results issue search renders **735**, so the spec threw
`HTTP 200 but the source was not on screen` and the run is **red**.

**The floor was not lowered, and must not be.** That is the standing hold in
[STATUS.md](STATUS.md#not-doing-deliberate-holds): a false alarm is overruled *in the register, on the
evidence, with the run kept red*, because a floor tuned down until nothing trips it reintroduces the
run-50 defect in which a reCAPTCHA page reported `1 passed`. This is the **second** recorded false
alarm on that floor (`feedle.world`, 745 characters, was the first).

**What makes the reading admissible despite the red** is positive evidence rather than a waived
assertion: the page returned **HTTP 200**, 103 anchors were scanned, and the two state filters
resolved **by `href`** to `…is%3Aissue%20justtuned%20state%3Aopen` → `Open 0 (0)` and
`…state%3Aclosed` → `Closed 0 (0)`. A bot interstitial carries none of those. It is the same method
and the same result as the 2026-09-04 read, which did not trip the floor. **Why that read passed and
this one did not has not been established** — the rendered length that day was not recorded, and
guessing at it would be inventing a cause.

**And the failure is structural, not incidental** — a terseness floor is least able to certify
exactly the answer an emptiness check exists to return, because *nothing is here* renders short by
construction. Recorded as [L-78](LESSONS.md) with a proposed discriminator; **deliberately not
shipped that run**, per the hold above.

**Shipped 2026-09-15 (run 161), and not in the form L-78 proposed** — L-78's version was satisfiable
by the retry link a challenge page carries. The classifier now has a second, independent way to call
a fetch a page: **≥ 20 distinct same-origin addresses other than the page's own**, which this venue's
zero-results search satisfies at 103 anchors and a challenge document cannot. The 1000-character
floor is unchanged, a bot-check pattern in the title or body is still fatal at any link count, and
the overrule is recorded in the read's own JSON as `length_floor_overruled` rather than passing
silently. [L-79](LESSONS.md). **The next duplicate re-read should therefore finish green on the same
evidence; if it finishes red again, that is a new finding and not this one.**

## After it is submitted

Nothing is expected quickly and nothing should be inferred from silence. [EXP-009](EXPERIMENTS.md)
holds the arrival threshold, the window and the two inadmissible outcomes, all registered before any
submission existed. The measured null a tagged Tuned URL earns with **no channel behind it** is
`control_days` = **1 day in 14** ([EXP-010](EXPERIMENTS.md), graded 2026-09-04): a treatment must
**exceed** that floor, not reach it.
