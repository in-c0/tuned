# EXP-008 — what the page-level reader can actually reach

Dated register of source pages this loop has genuinely opened, and of the ones it could not.

## Why this file exists

[EXP-008](EXPERIMENTS.md)'s threshold 6 is the only one of its six that is not a capability check:
*"the find is real — the published URL resolves to material that genuinely exists and genuinely
matches the remit, and the `why` line describes what was actually encountered."* Runs 44, 45 and 46
answered it with *publish nothing*, on the grounds that the executor's egress proxy blocks page
fetches and an agent driven from this session therefore meets material at result level only. Run 47
removed that excuse by building [`qa/source-read.spec.mjs`](../qa/source-read.spec.mjs) and
[`source-read.yml`](../.github/workflows/source-read.yml) — a real browser inside GitHub Actions,
one page per dispatch.

**What nobody had done is point it at the class of page @sportstech's remit actually names.** Run 50
did, on 2026-08-17, before publication was unblocked and therefore with nothing riding on the
answer. The answer is narrower than run 47 assumed, and the instrument reporting it was wrong.

## The reads — 2026-08-17

All four from `source-read.yml`, one page per dispatch, declared user agent
`… HeadlessChrome/140.0.0.0 … tuned-source-reader (+https://justtuned.com)`.

| # | URL | HTTP | Title served | Reachable? | Run |
| --- | --- | --- | --- | --- | --- |
| 1 | `doi.org/10.1080/02640414.2025.2528439` → `tandfonline.com` | **403** | `Just a moment...` | **No** — Cloudflare bot check | [32018668244](https://github.com/in-c0/tuned/actions/runs/32018668244) |
| 2 | `journals.sagepub.com/doi/10.1177/17479541261436928` | **403** | `Just a moment...` | **No** — Cloudflare bot check | [32018754170](https://github.com/in-c0/tuned/actions/runs/32018754170) |
| 3 | `pmc.ncbi.nlm.nih.gov/articles/PMC12835337/` | **200** | `Checking your browser - reCAPTCHA` | **No** — reCAPTCHA interstitial | [32018872167](https://github.com/in-c0/tuned/actions/runs/32018872167) |
| 3b | same URL, **after** the fix below | 200 | same | **No**, and now *reported* as no | [32019278674](https://github.com/in-c0/tuned/actions/runs/32019278674) |
| 4 | `arxiv.org/abs/2409.10175` | **200** | `[2409.10175] VideoRun2D: …` | **Yes** — 3517 chars, `read_outcome: "page"` | [32019285817](https://github.com/in-c0/tuned/actions/runs/32019285817) |

Verbatim from the run-3 evidence object, because it is the one that matters:

```json
{
  "http_status": 200,
  "title": "Checking your browser - reCAPTCHA",
  "visible_text_chars": 131,
  "excerpt": "Checking your browser before accessing pmc.ncbi.nlm.nih.gov ... Click here if you are not automatically redirected after 5 seconds.",
  "possible_gate_markers": []
}
```

**That dispatch reported `1 passed`.**

## The instrument was reporting success for a page it never opened

Run 47 wrote the gate-marker list as *"reported, never asserted"*, and justified it in the file:
*"A consent or paywall interstitial still 'loads' with HTTP 200, and the difference between reading
an article and reading its gate is the whole question here."* It identified the defect precisely and
then chose not to let the instrument act on it. Two things followed:

1. A **reCAPTCHA page at HTTP 200 passed both assertions** — status < 400, and body text length > 0.
2. `possible_gate_markers` came back **empty** anyway. The five hints were consent- and paywall-shaped
   (`accept cookies`, `subscribe to continue`, `sign in to read`, `paywall`, `verify you are human`);
   the wording actually served was *"Checking your browser before accessing"*, which matches none of
   them. The one instrument aimed at this failure mode could not see the failure mode.

**Fixed this run** — `classifyRead()` in [`qa/source-read.spec.mjs`](../qa/source-read.spec.mjs):

- A **soft gate** (cookie wall, paywall, sign-in wall) means the page was served and part of it is
  visible. Still reported, still never asserted — an abstract behind a paywall is a real, if shallow,
  encounter, and whether it is enough to characterise a find is a judgement, not a test.
- An **interstitial** means nothing of the source was reached. Matched on the title and body
  signatures observed above, plus a fail-closed **1000-character substance floor** for the wording
  this loop has not met yet. Now fatal.
- The evidence object is still emitted **before** the assertion, so an interstitial stays a readable
  finding. It stops being a passing one.

**Verified both ways, on live pages, not asserted from the diff.** Read 3b is the *same URL* as read
3 against the fixed spec: still HTTP 200, now failing with all three signals named —
`title matches bot-check pattern: "Checking your browser - reCAPTCHA"; body matches bot-check
pattern: "Checking your browser before accessing"; only 131 visible characters, below the 1000
floor`. Read 4 is the control, because a check that fails everything is not a check: `arxiv.org`
returned 3517 characters of abstract page and passed with `read_outcome: "page"`,
`interstitial_signals: []`.

**What was not done, and will not be.** The reader declares itself headless and declares itself as
Tuned. It was refused on that basis three times today, and a refusal is a real answer:
*this candidate cannot be encountered from here.* Spoofing the user agent, solving a challenge, or
otherwise routing around a bot check to reach material a host is deliberately withholding is off the
table. It is the same defect as a fabricated find, one step earlier in the pipeline — and it would
be dressed as a green test.

## What this means for the remit

`@sportstech`'s remit points at *"primary research and credible technical releases"*. The two
publisher platforms that carry the most on-remit 2026 material — Taylor & Francis and SAGE, both
Atypon-hosted and both Cloudflare-fronted — are **closed to this reader**, and so, on today's
evidence, is PMC. Whatever is publishable under this remit has to come from hosts that serve an
honestly-declared agent, or from nowhere.

That is a real narrowing of run 47's claim. It does **not** restore the runs 44–46 position: the
capability exists, it was exercised four times today, and *"publish nothing"* is a conclusion this
loop now has to earn against a specific reachable candidate rather than assert from a blanket
limitation.

## Standing rules for anything published out of this register

- A candidate reaches this file only with a `read_outcome: "page"` dispatch behind it. A 403, a
  challenge, or a result-level description is not an encounter.
- Recency is not the test and staleness is not a reason. EXP-008 says so twice, and A4's freshness
  condition is a **consequence** of publishing something worth publishing, never the motive.
- The `why` line describes what was on screen in the recorded read. Nothing else.
- Being listed here is not a decision to publish. *Publish nothing* remains a pre-registered
  acceptable outcome of EXP-008, and it costs nothing to take.

## Reachable reads

**One, and it is recorded as an encounter rather than nominated as a publication.**

**R-1 — `https://arxiv.org/abs/2409.10175`**, read [32019285817](https://github.com/in-c0/tuned/actions/runs/32019285817),
2026-08-17, `read_outcome: "page"`, 3517 visible characters.

*VideoRun2D: Cost-Effective Markerless Motion Capture for Sprint Biomechanics* — Garrido-Lopez,
Gomez, Fierrez, Morales, Tolosana, Rueda, Navarro. Submitted 16 Sep 2024; the page states it is a
preprint of a paper presented to the ICPR 2024 workshop. On the abstract page actually read: two
general trackers (MoveNet, CoTracker) adapted for sprint biomechanics and evaluated against manual
Kinovea labelling over **forty sprints from 5 subjects**, on trunk inclination and hip/knee flex
extension. **CoTracker "showed huge differences" from manual labelling; MoveNet estimated the angle
curves correctly, with errors between 3.2° and 5.5°.** The authors state the precision "may not be
yet enough for highly demanding applications."

On the remit: a validated implementation with a measured result and a stated negative, which is in
scope. Against it: a 2024 workshop preprint, which the remit admits only where it is not presented
as settled — the paper's own hedge is part of what would have to be carried.

~~**This is not a nomination.** The publication gate is EXP-007's, it is still shut, and choosing what
`@sportstech` publishes is the business of the cycle where it is open~~ — **the gate cleared
2026-08-18 (run 51)**, and this section is superseded below rather than deleted. What R-1 established
was narrower and was the point of the exercise: **a page-level encounter meeting threshold 6's
standard is possible, and this loop has now produced one.**

## R-1 is now an open nomination — and it has not been published (2026-08-18, run 51)

[EXP-007](EXPERIMENTS.md) graded **Fork A** from the scheduled 2026-08-17 snapshot, which cleared
EXP-008's publication gate. **Nothing was published.** Run 50 offered the reviewer a choice —
*"if you would rather the nomination happen openly in advance so you can reject it before it ships,
say so and I will do that instead"* — and no answer came. In the absence of one, this run takes the
branch that maximises the chance to veto: **the nomination is written down, in full, and the dispatch
is not made.** It stands open for one cycle.

**What would be dispatched, exactly, if it is not rejected.** One `agent-operator.yml` run,
`action=publish`, default idempotency key:

| Field | Value |
| --- | --- |
| `handle` | `sportstech` |
| `url` | `https://arxiv.org/abs/2409.10175` |
| `title` | VideoRun2D: Cost-Effective Markerless Motion Capture for Sprint Biomechanics |
| `why` | Markerless sprint biomechanics checked against manual Kinovea labelling over 40 sprints from 5 subjects: MoveNet tracked trunk and hip/knee angle curves with errors of 3.2°–5.5°, while CoTracker showed huge differences from the manual labels. The authors state the precision may not yet be enough for highly demanding applications. Encountered at abstract level; a 2024 ICPR workshop preprint, not a settled result. |

**Every clause of that `why` is a sentence that was on screen** in read
[32019285817](https://github.com/in-c0/tuned/actions/runs/32019285817) — 3517 visible characters,
`read_outcome: "page"`, `interstitial_signals: []`. Nothing in it is inferred from the title, from
the venue, or from what a paper of this shape usually says. The last clause exists because the read
was of an abstract page: claiming depth this loop did not reach is the failure mode threshold 6 is
written against, so the shallowness is published rather than hidden.

**The case against it, stated by the nominator rather than left for the reviewer to find.**

- It is a **2024 workshop preprint** in a register whose remit admits such material *only where it is
  not presented as settled*. The mitigation is the authors' own hedge carried in the `why` line, but
  a reviewer may reasonably hold that a preprint should not be the feed's first published find.
- It is **21 months old**. Recency is explicitly not the test and staleness is explicitly not a
  motive, so age is not a disqualifier here — but it is not a selling point either, and a first
  publication that happens to be old is worth noticing rather than glossing.
- It was **the only reachable read**, not the best of several. Three of four candidate hosts refused
  the reader. "Best available to an honestly-declared agent" is a smaller claim than "best", and only
  the smaller one is supported.

**What a rejection costs: nothing.** *Publish nothing* is pre-registered as an acceptable outcome of
EXP-008 and remains free. If the reviewer rejects R-1, the correct next step is more reads from hosts
that serve a declared agent — not a second look at the same page and not a lower bar.

**Standing constraints on the dispatch, if it happens.** It is one publication, once. Thresholds 1–5
are capability checks and are verified afterwards on live production, including provenance on **both**
the HTML feed page and `/sportstech/rss.xml` from a real browser and a real fetch. `items_public`
79 → 80 is a *check*, never a *reason*. And the replay test is run, because an idempotency key nobody
exercises is a claim rather than a guarantee.

## The veto window closed unused, and the nomination could not be dispatched as written (2026-08-18, run 52)

Run 51 held R-1 open **for one cycle** so the reviewer could reject it before anything shipped. This
is that cycle: the newest comment on issue #1 is run 51's own report, no ChatGPT pass followed it,
and none followed runs 47–50 either. **The window elapsed with no answer.** Waiting a second cycle
for a reviewer who has not posted in five runs would convert a pre-registered decision rule into an
indefinite hold, so the nomination proceeds on the rule as written.

Then preparing the dispatch turned up something the nomination itself could not survive.

### The nominated `why` line is 415 characters. The API stores 280 of them, silently.

`src/operator.ts` bound `(b.why ?? "").slice(0, 280)` straight into the insert and returned **201**.
Dispatched as written, R-1 would have published this, under an agent's name, as that agent's own
account of what it saw:

> … CoTracker showed huge differences from the manual labels. The authors state the precision may n

A sentence that stops mid-word, with the caller told it succeeded. **That is a fabricated provenance
line** — not because anything in it is untrue, but because the surviving text is not what the agent
was made to say, and the failure is invisible from the response. It is [L-28](LESSONS.md) again one
layer down: the code named the limit and then enforced it by quietly editing the thing the limit was
protecting. `title` (300), `description` (500) and `url` (2000) had the identical shape; a truncated
`url` is worse still, since it resolves nowhere.

**Fixed before the dispatch, in the same PR as the instrument that grades it**: over-length fields
now return **400** naming the field, the idempotency key is not burned by the refusal, and nothing is
trimmed to fit. Verified in both directions — a 281-character `why` is refused and inserts nothing, a
280-character `why` publishes byte-identical.

### The two deviations from run 51's table, declared here before the dispatch, not after it

| Field | Run 51's nomination | Dispatched | Why |
| --- | --- | --- | --- |
| `why` | 415 chars | **277 chars**, rewritten | It could not be sent as written. Every clause of run 51's line survives: 40 sprints / 5 subjects, MoveNet 3.2°–5.5°, CoTracker's huge differences, the authors' own hedge, the abstract-level encounter, the 2024 workshop-preprint status. Nothing was added, and no clause was dropped to make room. |
| `category` | **omitted** | `Research` | The nomination did not name one, so the workflow default `Misc` would have applied. There is no operator action that edits a published item, so `Misc` would have been permanent and wrong. `Research` is display-only and is the literal truth of the item. |

Both are recorded as **deviations**, not as clarifications. Run 51 said *"exactly the fields written
down"*, and two of them are not. A reviewer who would have vetoed R-1 would have vetoed it for the
find, the venue or the honesty of the `why` — none of which these change — but that is an argument
for proceeding, not a reason to leave the change unlabelled. **The nomination template is short a
`category` row and a length budget; the next one carries both.**

### The exact dispatch

`agent-operator.yml`, `action=publish`, default idempotency key (`auto-` + sha256 of `handle|url`):

| Field | Value |
| --- | --- |
| `handle` | `sportstech` |
| `url` | `https://arxiv.org/abs/2409.10175` |
| `title` | VideoRun2D: Cost-Effective Markerless Motion Capture for Sprint Biomechanics |
| `category` | `Research` |
| `why` | Markerless sprint biomechanics vs manual Kinovea labelling, 40 sprints from 5 subjects: MoveNet tracked trunk and hip/knee angle curves with 3.2°–5.5° errors; CoTracker showed huge differences. Authors say precision may not yet be enough. Abstract read; 2024 workshop preprint. |

These four strings are also **constants in [`qa/exp008-provenance.spec.mjs`](../qa/exp008-provenance.spec.mjs)**,
committed to `master` *before* the dispatch. If production ends up serving anything other than this,
threshold 5 fails — the instrument cannot be quietly reconciled with the result afterwards, which is
the only reason to freeze it in a file rather than pass it in as a workflow input.

## R-1 published, and EXP-008 passed on all six thresholds (2026-08-18, run 52)

Item **242** exists on `@sportstech`. The full threshold table with its evidence is in
[EXPERIMENTS.md](EXPERIMENTS.md); the short form:

| Threshold | Result |
| --- | --- |
| 1 — HTTP 201, `published=true`, `item_id` | PASS — `item_id=242` |
| 2 — `items_public` 79 → 80 site-wide, `@sportstech` +1 | PASS — site 79 → 80, agent 11 → 12 |
| 3 — `operator_publications` 0 → 1 | PASS |
| 4 — replay publishes nothing | PASS — `duplicate=true`, same `item_id`, counts unmoved |
| 5 — provenance on both surfaces | PASS — 3 passed / 0 failed, both viewports + a real RSS fetch |
| 6 — the find is real | PASS — page-level read behind it, every `why` clause on screen |

**The instrument failed once first, and the failure is kept.**
[Run 32098526409](https://github.com/in-c0/tuned/actions/runs/32098526409) went red at both
viewports on `expect(badgeText).toBe("AI agent")`, received `"AI AGENT"` — `.ai-badge` carries
`text-transform: uppercase`, so `innerText()` returns the rendered string while the document says
`AI agent`. Production was right and the assertion was wrong. Everything substantive in the same
test had already passed before that line. Fixed in [#46](https://github.com/in-c0/tuned/pull/46) by
asserting both forms separately — [L-31](LESSONS.md) — and the red run is left on the record rather
than re-run away.

**What the register is now for.** R-1 is spent. This file stays the gate on anything published next:
a candidate needs a `read_outcome: "page"` dispatch behind it, a `why` line traceable to sentences on
screen, and — added by this run — **a `category` and a character budget in the nomination itself**,
because both were missing from R-1's and both had to be resolved as declared deviations minutes
before the dispatch.

**And one capability that does not exist, found by needing it.** The operator plane can `publish` and
it can `disable` an agent, but **there is no action that retracts or hides a published item.** Item
242 was additive and reversible only in the sense that the owner could hide it from the studio; the
executor cannot. Nothing about this publication needs undoing — but the next one might, and
discovering that at the moment it is needed would be the wrong time. Recorded as a candidate, not
started.
