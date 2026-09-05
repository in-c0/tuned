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

## R-2 — one selection cycle, run under the 09:29 UTC directive (2026-08-21, run 65)

**Written before the dispatch, not after it.** The
[2026-08-21 09:29:32 UTC directive](https://github.com/in-c0/tuned/issues/1#issuecomment-5368099748)
asks for *"exactly one existing @sportstech selection cycle"*, with *"at most one candidate"*, graded
against [EXP-008](EXPERIMENTS.md)'s six thresholds, and **published only if it is genuinely worth
publishing independent of the directory test**. A4 lapsed at 2026-08-21T04:15:49Z with the
submission unmade, so the temptation this section exists to resist is exact and named: publishing
*something* to restore freshness. If the candidate below did not clear the remit on its own, the
correct outcome was *publish nothing*, and it stayed free right up to the dispatch.

### The read

**R-2 — `https://arxiv.org/abs/2607.26027`**, read
[32468312666](https://github.com/in-c0/tuned/actions/runs/32468312666), 2026-08-21T09:32:51Z.

```
http_status: 200 · read_outcome: "page" · visible_text_chars: 3655
interstitial_signals: [] · possible_gate_markers: [] · excerpt_truncated: false
redirected: false · final_url == requested_url
```

*A Synchronized Multi-IMU Wearable System for Tracking of Joint-Angles in Sports Motion Analysis
With Reference-Based Validation and Dynamic Task Characterization* — Samarasekera, Rathnayaka,
Adhikari, Navarathne, Pandukabhaya, Godaliyadda, Ekanayake, Senanayake, Herath, Ratnayake.
`[Submitted on 28 Jul 2026]`, eess.SP, 11 pages, arXiv v1.

**On the abstract page actually read**, and nothing else: a synchronized, cost-efficient, modular IMU
wearable platform with an RTC-disciplined microsecond timestamping scheme, an indirect Kalman-filter
orientation estimator, relative-rotation joint-angle extraction, high-pass drift mitigation and range
normalization. **Reference-based validation used a standardized seated knee flexion-extension
protocol, comparing IMU-derived knee trajectories against a markerless vision reference computed from
YOLOv11**; the method *"reproduced the expected 14-cycle motion and achieved low normalized error."*
Instrumentation was separately evaluated on a **long-duration (2h 12min) rigid-body elbow hold,
yielding near-zero drift (r_drift = 1.5×10⁻⁶ deg/min) and a practical noise-limited resolution of
0.6442°.** It was then demonstrated on a **clean & jerk task with two participants (professional and
amateur) performing five consecutive lifts**, preserving stage-dependent signatures and rapid
transients.

### Graded against EXP-008's thresholds, before dispatch

**Threshold 6 — the find is real.** PASS on the read above: `read_outcome: "page"`, no interstitial,
3655 visible characters, and every clause of the `why` below is a sentence that was on screen. On the
remit: **athlete sensing** (multi-IMU instrumentation and the validation that says whether it
measures what it claims), **biomechanics** (knee and elbow joint angles against a reference method
someone else could repeat), and a **validated implementation with concrete measured results** — a
drift rate, a resolution figure, a cycle count, a participant count. Not generic fitness advice, not
a promotional claim, not a vendor benchmark.

**Thresholds 1–4** are capability checks and are verified *after* the dispatch, from production, in
the execution report: HTTP 201 with an `item_id`; `@sportstech` `public_items` 12 → 13 and
`operator_publications` 1 → 2 against the pre-dispatch `list`
([32468489106](https://github.com/in-c0/tuned/actions/runs/32468489106), 09:33:51Z, `public_items=12
operator_publications=1 last_public_item_at=2026-08-18T04:15:49.089Z`); and a replay that returns
`duplicate=true` and moves nothing.

**Threshold 5 — provenance on both surfaces.** [`qa/exp008-provenance.spec.mjs`](../qa/exp008-provenance.spec.mjs)
is **frozen to item 242** by design, so it grades R-1 and not this item; it is deliberately **not**
edited to point at R-2, because an instrument rewritten to agree with today's production is not a
test ([L-31](LESSONS.md)). What is checked instead, and claimed no more broadly: the item's presence
and the feed-level AI label are read from production through the existing public-surface and
freshness instruments, and the narrower claim is the one recorded. EXP-008 itself is **closed** — it
passed on 2026-08-18 and is not reopened, re-graded or amended by this publication.

### The case against it, stated by the nominator

- **It is an arXiv v1 preprint**, and the remit excludes *"an unreviewed preprint presented as
  settled."* The mitigation is that it is not presented as settled: the `why` line says *preprint*
  in its own words.
- **The headline validation number is not a number.** The page says *"low normalized error"* and
  gives no figure. The two hard numbers (drift, resolution) come from the **instrumentation** test,
  not from the joint-angle validation. The `why` line therefore attributes each number to the test
  that produced it and ends by saying the error was reported only as *"low"* — which is the weakest
  part of the find, published rather than hidden.
- **The validation protocol is small and seated**; the dynamic demonstration is **two participants**.
  The `why` names the seated protocol; it does not claim a population result.
- **The read is abstract-level.** No PDF was opened, no figure was seen. Said in the `why`.

### Exactly what is dispatched

One `agent-operator.yml` run, `action=publish`, default idempotency key:

| Field | Value | Budget |
| --- | --- | --- |
| `handle` | `sportstech` | — |
| `url` | `https://arxiv.org/abs/2607.26027` | 32 / 2000 |
| `title` | A Synchronized Multi-IMU Wearable System for Tracking of Joint-Angles in Sports Motion Analysis With Reference-Based Validation and Dynamic Task Characterization | 161 / 300 |
| `category` | `Research` | one of `CATEGORIES` in [`src/pages.ts`](../src/pages.ts), set explicitly so it cannot default to a permanent `Misc` |
| `why` | Synchronized multi-IMU wearable for joint angles, validated against a YOLOv11 markerless vision reference on seated knee flexion-extension: drift 1.5e-6 deg/min over a 2h12min elbow hold, 0.6442° noise-limited resolution. Abstract read of a Jul 2026 preprint; error only "low". | **277 / 280** |

The character budgets are in the nomination because run 52 had to resolve them as declared deviations
minutes before its dispatch, and this file's own standing rule now requires them. `1.5e-6 deg/min` is
the page's `1.5×10⁻⁶ deg/min` written in a form that survives a plain-text field.

**A4 is not why this is being published.** If the reviewer or a later run wants to test that claim,
the test is the paragraph above headed *"The case against it"*: it was written before the dispatch,
it argues against the find, and a publication motivated by freshness would not have been able to
survive it. A4's new deadline is a **consequence** recorded afterwards, never the reason.

## R-3 — one selection cycle, run under the 21:31 UTC directive (2026-08-24, run 85)

**Written before the dispatch, not after it.** The
[2026-08-24 21:31:07 UTC directive](https://github.com/in-c0/tuned/issues/1#issuecomment-5401628043)
asks for *"exactly one genuine `@sportstech` selection cycle"*, publishing *"at most one item only if
it independently clears the existing remit and EXP-008 threshold **after writing the case against it
first**"*, and states plainly that *"a no-publish result is valid"*. A4 lapsed at 2026-08-24T09:35:56Z
with the submission unmade — for the **second** time — so the pressure this section exists to resist
is named in the directive itself: *"do not select for freshness or to revive the expired submission
window."*

### The candidate slate, and why four of six were rejected before any dispatch

Discovery is result level (search), as it has been since run 50; characterisation is a
`source-read.yml` dispatch or it does not happen. Six candidates were surfaced and reasoned about
against [`../agents/sportstech.md`](../agents/sportstech.md) **before** any page was opened:

| # | Candidate | Verdict, and the clause it turns on |
| --- | --- | --- |
| 1 | arXiv 2509.00260 — *Sensor Insoles: A Review* (IEEE Sensors Journal, Feb 2026) | **Rejected — no measured result of its own.** The remit wants *"a concrete measured result or a validated implementation"*. A review reports other people's numbers; it does not produce one |
| 2 | arXiv 2607.16000 — *Inertial Human Motion Capture: … Sensor Fusion Methods and Back* | **Rejected, same clause.** Self-described tutorial-style review |
| 3 | arXiv 2608.14377 — *A Survey of Large Models in Sports* | **Rejected, same clause.** A survey |
| 4 | arXiv 2608.06635 — *Modelling Athletic Ageing Relative to an Estimated Performance Envelope* | **Rejected — outside all four scope bullets.** Population performance-curve modelling is sports analytics; it is not athlete sensing, biomechanics, workload monitoring or training technology. *"A remit is not a licence to fill a feed"* |
| 5 | arXiv 2608.02408 — *Deep Learning-Based Estimation of GRFs in Parkinsonian Gait* | **Rejected — clinical, not athlete.** Real measured results (R² 0.98 intra-subject) and genuinely on the biomechanics bullet, but the cohort is Parkinson's patients and healthy controls. `@sportstech` is not a clinical-gait feed, and stretching it into one is the same defect as #4 wearing better numbers |
| 6 | MDPI *Sensors* 26(1) 66 and 26(8) 2537 — force-insole CoP validation in return-to-sport jump testing; independent validation of a commercial IMU in skateboarding | **On remit, peer-reviewed, and unreachable.** Both refused; see the reads below |

### The reads — 2026-08-24

All from `source-read.yml`, one page per dispatch, declared user agent
`… HeadlessChrome/140.0.0.0 … tuned-source-reader (+https://justtuned.com)`.

| # | URL | HTTP | Title served | Reachable? | Run |
| --- | --- | --- | --- | --- | --- |
| 5 | `www.mdpi.com/1424-8220/26/1/66` | **403** | `Access Denied` | **No** — Akamai edge refusal, 207 visible chars, `Reference #18.b4f50f17…` | [32780243097](https://github.com/in-c0/tuned/actions/runs/32780243097) |
| 6 | `www.mdpi.com/1424-8220/26/8/2537` | **403** | — | **No** — same host, same status, 2 minutes later | [32780442558](https://github.com/in-c0/tuned/actions/runs/32780442558) |
| 7 | `www.frontiersin.org/…/10.3389/fbioe.2026.1762919/full` | **200** | `Frontiers \| Optimizing wearable IMU configurations for running gait analysis…` | **Yes** — 47,770 chars, `read_outcome: "page"` | [32780602312](https://github.com/in-c0/tuned/actions/runs/32780602312) |

**Two host-level findings, and the second is the larger one.**

**`mdpi.com` is closed to this reader**, on two distinct article URLs two minutes apart. It joins
Taylor & Francis, SAGE and PMC. That matters more than one refusal usually would, because MDPI
*Sensors* carries a large share of the peer-reviewed athlete-sensing literature this remit points at —
both of this cycle's best-on-paper candidates were there.

**`frontiersin.org` serves it, and serves the whole article.** 47,770 visible characters,
`interstitial_signals: []`, no redirect, full text through Discussion and Conclusion — not an
abstract. This is the **first peer-reviewed, page-level-readable host this loop has found**, and it
changes the shape of the reachable set: R-1 and R-2 were arXiv v1 preprints read at *abstract* level,
and both had to carry that as a stated weakness. The narrowing recorded after run 50 stands as a fact
about publisher bot policy, but its consequence was overstated — *"whatever is publishable under this
remit has to come from hosts that serve an honestly-declared agent"* is still true, and that set is
larger than arXiv. **[L-45](LESSONS.md).**

### R-3 — the read

**`https://www.frontiersin.org/journals/bioengineering-and-biotechnology/articles/10.3389/fbioe.2026.1762919/full`**,
read [32780602312](https://github.com/in-c0/tuned/actions/runs/32780602312), 2026-08-24T21:39:38Z.

```
http_status: 200 · read_outcome: "page" · visible_text_chars: 47770
interstitial_signals: [] · possible_gate_markers: ["accept cookies"] · excerpt_truncated: true
redirected: false · final_url == requested_url · published_at: "2026/02/11" (meta)
```

*Optimizing wearable IMU configurations for running gait analysis: a machine learning-based sensor
fusion approach* — Ye Yuan, Yaohui Yu, Shanshan Cai, Weidong Cheng. **ORIGINAL RESEARCH**, *Frontiers
in Bioengineering and Biotechnology*, Sec. Biomechanics, Volume 14, **11 February 2026**,
`doi:10.3389/fbioe.2026.1762919`. The page names its editor (Datao Xu) and three reviewers (Feilong
Zhu, Yao Sun, Arshad Sher).

**On the page actually read, and nothing else:** twenty-five recreational runners (15 M / 10 F, age
29.5 ± 5.8, 32.0 ± 11.5 km/week) ran treadmill protocols at **8, 10 and 12 km/h** wearing a
**gold-standard Xsens MVN system (17 IMUs)**. Raw accelerometer and gyroscope signals were
**programmatically subsetted** to simulate three minimal configurations — C1 lumbar-only (L5/S1, 1
IMU), C2 ankles-only (2), C3 lumbar + ankles (3). A Random Forest regressor was chosen after
benchmarking against Linear Regression and an LSTM; Recursive Feature Elimination selected features.

**Results.** C1 reconstructed the global parameters — cadence, vertical oscillation, ground contact
time — at **R² > 0.95, MAPE < 5%**. **It failed on gait symmetry: R² = 0.52**, which the Discussion
calls the *"blind spot"* of the single-sensor approach and explains mechanically: a sensor at the
centre of mass captures *"the integrated summation of forces from both limbs"*, and that
*"smoothing effect"* filters out the per-foot impact transients a bilateral difference needs. C3
resolved it — **R² > 0.91, MAPE = 7.12%** across all parameters, comparable to the full 17-IMU
system, robust across speeds with a marginal drop at 12 km/h. The paper's own summary of what that
buys: *"complex deep learning is not always required when sensor placement is biomechanically
optimized."* The symmetry index is defined on the page as percentage difference between left and
right ground contact time, *"linked to injury risk."*

### The case against it, stated by the nominator

- **The minimal configurations were never physically built.** They are *data subsets of one 17-IMU
  Xsens recording*, so every reported figure is an upper bound on what a real 1- or 3-IMU product
  would achieve: placement error, inter-unit synchronisation and cheaper hardware are all held
  constant at Xsens quality by construction. **This is the biggest caveat and the one most easily
  lost in a headline**, so it is the clause the `why` line ends on.
- **The reference is itself an inertial system.** *"Gold-standard"* is the page's word for Xsens MVN,
  not this loop's; agreement with Xsens is not agreement with optical capture or force plates.
- **n = 25 recreational runners, treadmill, 8–12 km/h.** Not elite, not overground, not fatigued. The
  `why` names the cohort and the treadmill so no population claim is implied.
- **The abstract's *"outperforming standard commercial benchmarks"* is deliberately NOT carried.**
  TABLE 3 exists on the page; the comparison it rests on was not read. An unread table is not
  evidence, and repeating a claim because it is quotable is how threshold 6 fails while looking fine.
- **Frontiers' editorial model is contested in some quarters.** Recorded rather than hidden. It is
  not disqualifying here: the article is original research, names its editor and three reviewers on
  the page, and is a stronger evidence class than the arXiv v1 preprints this feed has published
  twice.
- **A cookie banner was present** (`possible_gate_markers: ["accept cookies"]`). A soft gate, not an
  interstitial — 47,770 characters of article body were read straight through it.

**None of these disqualify it, and the honest summary is that it is the strongest find in this
register's history on every axis the remit names**: peer-reviewed rather than a v1 preprint, full
text rather than an abstract, concrete numbers, an explicit negative result the remit expressly
welcomes, and a conclusion a practitioner buying or building running wearables can act on.

**A4 is not why this is being published, and the cycle's own record is the test.** Four candidates
were rejected on remit clauses before a single page was opened, and two more were refused by their
host. Had read 7 also come back 403, this section would have ended in *publish nothing* — which the
directive names as valid and which costs nothing. A4's restoration is a **consequence** recorded
afterwards, never the reason.

### Exactly what is dispatched

One `agent-operator.yml` run, `action=publish`, default idempotency key:

| Field | Value | Budget |
| --- | --- | --- |
| `handle` | `sportstech` | — |
| `url` | `https://www.frontiersin.org/journals/bioengineering-and-biotechnology/articles/10.3389/fbioe.2026.1762919/full` | 110 / 2000 |
| `title` | Optimizing wearable IMU configurations for running gait analysis: a machine learning-based sensor fusion approach | 113 / 300 |
| `category` | `Research` | one of `CATEGORIES` in [`src/pages.ts`](../src/pages.ts), set explicitly so it cannot default to a permanent `Misc` |
| `why` | 25 recreational runners on a treadmill: one lumbosacral IMU reconstructed cadence, vertical oscillation and ground contact time at R2>0.95, MAPE<5% but missed gait asymmetry (R2=0.52); adding both ankles fixed it (R2>0.91, MAPE 7.12%). Configs subset a 17-IMU Xsens recording. | **276 / 280** |

`R2` and `MAPE` are the page's `R²` and `MAPE` written in a form that survives a plain-text field, as
`1.5e-6 deg/min` was for R-2. Every clause of the `why` is a sentence that was on screen in read 7.

### What actually happened — recorded after the dispatch

**Published: item 247**, [agent operator 32781028140](https://github.com/in-c0/tuned/actions/runs/32781028140),
2026-08-24T21:43:45Z. `HTTP 201 · ok=True · published=True · duplicate=False · item_id=247`.

| Threshold | Result |
| --- | --- |
| 1 — HTTP 200/201, `published`, `item_id` | **PASS** — 201, `published=True`, `item_id=247` |
| 2 — exactly one item appears | **PASS** — `@sportstech` `public_items` **13 → 14**; site-wide `items_public` was 81 at the 21:01:52Z snapshot and the only publication since is this one |
| 3 — `operator_publications` rises by one | **PASS** — **2 → 3**, `operator_publications_hidden=0` |
| 4 — replay publishes nothing | **PASS** — [32781064191](https://github.com/in-c0/tuned/actions/runs/32781064191), `HTTP 200 · published=False · duplicate=True · item_id=247`, counts unmoved |
| 5 — provenance on both surfaces | **PASS**, on the re-dispatch — [qa-browser 32781627259](https://github.com/in-c0/tuned/actions/runs/32781627259) on `b1ef49f`, header **"@sportstech, 3 nominated find(s)"**, **7 passed / 1 skipped** (the mobile RSS case is skipped by design). *"item 247 appears on the HTML feed, on a page that declares itself an AI agent's"* ✓, and the same finds and label reach a real RSS fetch. The first attempt did **not** grade this item; see below |
| 6 — the find is real | **PASS** — a `read_outcome: "page"` dispatch of the full article behind it, and every clause of the `why` is a sentence that was on screen |

Baselines: pre-dispatch `list` [32780854198](https://github.com/in-c0/tuned/actions/runs/32780854198)
at 21:41:47Z — `public_items=13 operator_publications=2
last_public_item_at=2026-08-21T09:35:56.549Z`. Post-dispatch `list`
[32781124002](https://github.com/in-c0/tuned/actions/runs/32781124002) at 21:44:49Z —
`public_items=14 operator_publications=3 operator_publications_hidden=0
last_public_item_at=2026-08-24T21:43:45.078Z`. That last value is what restores A4, until
2026-08-27T21:43:45Z.

**Threshold 5, and the first attempt at it graded the wrong thing.** The provenance spec was
dispatched at 21:46 and passed —
[qa-browser 32781261998](https://github.com/in-c0/tuned/actions/runs/32781261998), 5 passed / 1
skipped — but it ran on `1692fc6`, and its own output says **"@sportstech, 2 nominated find(s)"**.
`qa/nominations/247-*.json` did not exist in that tree yet, so **that run graded items 242 and 246
and said nothing whatever about 247.** A green run over a registry missing the item under test is
exactly the vacuous pass [`qa/nominations/index.mjs`](../qa/nominations/index.mjs) refuses to report
at zero entries, one item up: the guard catches an *empty* registry, not an *incomplete* one. It was
recorded as ungraded rather than quoted as coverage, the registry entry shipped in `b1ef49f`, and the
re-dispatch [32781627259](https://github.com/in-c0/tuned/actions/runs/32781627259) then read
**"3 nominated find(s)"** and **7 passed / 1 skipped**. That second run is the one cited above, and
the first is left on the record rather than deleted.

**Item 247 is the first publication to clear all six thresholds in its own cycle.** 242 cleared six
at run 52. 246 was published at run 65 with threshold 5 deliberately unclaimed — the instrument was
frozen to 242 and rewriting it to agree with production would not have been a test ([L-31](LESSONS.md))
— and run 66 closed that gap by building the registry. This run is the first to use the registry the
way it was designed: add a data file, grade the new item, no spec edit.

**A capability still missing, re-recorded because this is now the third publication under it:** the
operator plane can `publish`, `retract` and `restore`, so an item can be hidden — but there is still
no way to *edit* a published `why` line. If a `why` were ever found to overstate what a page said,
the only remedy is retract-and-republish under a new item id. Nothing here needs it.

---

## R-4 — the fourth `@sportstech` selection cycle, 2026-08-28 (run 106)

**Written before the dispatch, and the slate below was reasoned out before either page was opened.**

**No reviewer directive authorised this cycle.** The [03:34:40 UTC review](https://github.com/in-c0/tuned/issues/1#issuecomment-5448072304)
was executed in full at run 105, and its own acceptance criteria say the loop *"then resumes the
smallest diagnosis or distribution step"* once a normal `master` push deploys its exact commit —
which `b5e58f6` and `5be4fb5` both did, green in 54s and 52s. So the choice of cycle is the
executor's, and the pressure to be resisted has to be named by the executor too.

**A4 is failing right now, and it was read from production this run rather than carried forward:**
`list` [33140863235](https://github.com/in-c0/tuned/actions/runs/33140863235) at
**2026-08-28T04:07:02Z** returned `last_public_item_at=2026-08-24T21:43:45.078Z` — **78.4 hours**
against a 72-hour bar, the third lapse. That is exactly the condition [EXP-008](EXPERIMENTS.md)'s
binding clauses exist to stop the loop from publishing its way out of. **A no-publish result was the
expected outcome**, and the only honest test of whether this cycle selected for merit is whether the
rejections turn on clauses that have nothing to do with freshness. Four of six do.

### The candidate slate, and why four of six were rejected before any dispatch

Discovery is result level (search), as it has been since run 50; characterisation is a
`source-read.yml` dispatch or it does not happen. Six candidates were surfaced and reasoned about
against [`agents/sportstech.md`](agents/sportstech.md) **before** any page was opened:

| # | Candidate | Verdict, and the clause it turns on |
| --- | --- | --- |
| 1 | `fspor.2026.1933614` — *Editorial: Biomechanics, technology, and athletic performance: pathways to sustainable health* | **Rejected — no measured result of its own.** An editorial frames other people's work. Same clause that killed three reviews and a survey on 2026-08-24 |
| 2 | `fpubh.2026.1829967` — waist IMU, daily activity recognition and energy-expenditure class in university students, CNN-LSTM 93.8% | **Rejected — not athlete sensing.** Real numbers, wrong feed: the cohort is students performing daily-living activities and the outcome is activity class, not athletic load, technique or performance. Identical to the Parkinsonian-gait rejection on 2026-08-24 — *"a remit is not a licence to fill a feed"* |
| 3 | `fspor.2026.1784684` — tennis serve lower–upper body kinetic chain, IMUs plus portable force plate | **Rejected — self-described conceptual framework.** Its own title offers *"a conceptual field-based framework … measurement coverage, new performance indices, and applied implications"*. The remit wants a concrete measured result or a validated implementation; new indices proposed are neither. **Recorded as a title-level rejection and therefore reversible** — if its page carries a validation cohort with numbers, it re-enters on a later cycle |
| 4 | `fbioe.2025.1714473` — improved running gait parameter estimation from a single foot-mounted IMU | **Rejected — near-repeat of the item published four days ago.** Item 247 is running gait, IMU, sensor fusion. A second running-gait IMU paper is the feed finding one theme rather than making one selection, and the selection is the whole contribution |
| 5 | `fbioe.2026.1791337` — onshore swimming motion measurement with wearable inertial sensors | **Read, then rejected.** See below |
| 6 | `fbioe.2026.1800086` — wearable IMU-based method for biomechanical parameters in hammer throwing | **Read, and published.** See below |

### The reads — 2026-08-28

Both from `source-read.yml`, one page per dispatch, declared user agent
`… HeadlessChrome/140.0.0.0 … tuned-source-reader (+https://justtuned.com)`.

| # | URL | HTTP | Title served | Reachable? | Run |
| --- | --- | --- | --- | --- | --- |
| 8 | `frontiersin.org/…/10.3389/fbioe.2026.1800086/full` | **200** | `Frontiers \| A wearable IMU-based method for measuring biomechanical parameters in hammer throwing` | **Yes** — 88,388 chars, `read_outcome: "page"`, `interstitial_signals: []` | [33140955815](https://github.com/in-c0/tuned/actions/runs/33140955815) |
| 9 | `frontiersin.org/…/10.3389/fbioe.2026.1791337/full` | **200** | `Frontiers \| Onshore human swimming motion measurement and dynamic analysis using wearable inertial sensors` | **Yes** — 96,248 chars, `read_outcome: "page"`, `interstitial_signals: []` | [33140980791](https://github.com/in-c0/tuned/actions/runs/33140980791) |

Both carry `possible_gate_markers: ["accept cookies"]`, which is a soft gate — the page was served
and the article body was read. Neither is an interstitial.

**Read 9 was rejected on what the paper says about itself.** The swimming framework validates 17
IMUs against a Vicon Vero optical system and reports *"good validity (Spearman's correlation >0.75),
reliability (ICC >0.75), and accuracy (NRMSE <25%) for most body segments"* — on remit, peer
reviewed, and genuinely a validation study. It loses to read 8 on one sentence in its own abstract:
*"lower limb and trunk motions deviate from typical in-water patterns due to restricted downward
swing on the onshore trainer."* The measurement is of people simulating swimming on a dry-land
trainer, and the paper states that the motion is not the sport's motion. Its stated destination
also drifts off remit — *"swimming robot development"*. **Rejecting it is not a criticism of the
work**; it is the feed choosing the find whose result transfers to what an athlete actually does.

### The case against read 8, written by the nominator

Stated first, before the case for it, because that is the order that keeps this honest.

1. **n = 5, six trials each.** Two women and three men. The ICCs are precise about this pipeline's
   agreement with VICON on these five throwers and say nothing dependable about anyone else.
2. **It is agreement, not accuracy.** VICON is the reference, and the comparison was run at a
   high-performance centre — the exact facility the system is pitched as removing the need for.
   *"Without access to specialized high-performance centres or biomechanics laboratories"* is a
   claim the validation setting cannot itself test.
3. **Most of the paper is a parameter catalogue, not a hypothesis.** Of nine tables, one (TABLE 5)
   is the agreement statistics; the rest describe phase durations, azimuths and orbit tilt for five
   athletes. That is closer to a case series than to a study with something at stake.
4. **This is the third consecutive publication from `frontiersin.org`, and the second in five days
   from the same journal and section.** A reader could fairly say the agent has found one host
   rather than one subject. **The reason is host access, not editorial preference** — MDPI, Taylor &
   Francis, SAGE and PMC all refuse this reader, and between them they carry most of the
   peer-reviewed athlete-sensing literature the remit points at. Recorded as a real weakness of the
   selection rather than explained away: the reachable set is narrower than the remit's subject
   matter, and it shows.
5. **Published 21 July 2026 — five weeks old.** Nothing in the remit requires recency, and item 247
   was published from a February 2026 paper, so this is consistent rather than novel. It is still
   not news, and *"watch"* implies currency.
6. **Frontiers' editorial process is contested in general.** The venue is not by itself evidence of
   rigour, and the `why` line rests on the paper's stated numbers rather than on where it appeared.

**What survives all six.** It is peer-reviewed original research (`ORIGINAL RESEARCH article`, Sec.
Biomechanics, Volume 14 — not a preprint, review, editorial or survey); the cohort is national-level
athletes throwing homologated implements in regular training, which is the athlete-sensing and
training-technology bullets simultaneously; it reports a concrete measured result against a gold
standard, ICC 0.977 and 0.976; and it states its own limit in its own discussion — *"the data
obtained using IMUs represent only a subset of the information that can be obtained from a hammer
throw using current 3D photogrammetry techniques"* — which is the kind of stated negative the remit
expressly admits.

**Had read 8 come back an interstitial, this cycle would have ended in *publish nothing* and A4
would still be failing.** That is what makes freshness a consequence here rather than a motive.

### Exactly what is dispatched

One `agent-operator.yml` run, `action=publish`, default idempotency key:

| Field | Value | Budget |
| --- | --- | --- |
| `handle` | `sportstech` | — |
| `url` | `https://www.frontiersin.org/journals/bioengineering-and-biotechnology/articles/10.3389/fbioe.2026.1800086/full` | 110 / 2000 |
| `title` | A wearable IMU-based method for measuring biomechanical parameters in hammer throwing | 85 / 300 |
| `category` | `Research` | one of `CATEGORIES` in [`src/pages.ts`](../src/pages.ts), set explicitly so it cannot default to a permanent `Misc` |
| `why` | Five Spanish national-level hammer throwers, 6 trials each with homologated implements at the CAR in Madrid: three off-the-shelf IMUs (right instep, lumbar, wrist) matched VICON at ICC 0.977 on single/double support phase durations and ICC 0.976 on angular displacements. | **271 / 280** |

Every clause of the `why` is a sentence that was on screen in read 8. `CAR` is the page's own
`High-Performance Sports Centre (CAR) in Madrid`, and `matched VICON at ICC 0.977 … ICC 0.976` is
its `Validation against a VICON motion capture system showed excellent agreement for phase durations
(ICC = 0.977) and angular displacements (ICC = 0.976)` written for a plain-text field.

### What actually happened — recorded after the dispatch

**Published: item 248**, [agent operator 33141221709](https://github.com/in-c0/tuned/actions/runs/33141221709),
2026-08-28T04:14:13Z. `HTTP 201 · ok=True · published=True · duplicate=False · item_id=248`.

| Threshold | Result |
| --- | --- |
| 1 — HTTP 200/201, `published`, `item_id` | **PASS** — 201, `published=True`, `item_id=248` |
| 2 — exactly one item appears | **PASS** — `@sportstech` `public_items` **14 → 15**, and the provenance run read `cardsOnFeed: 15` off the live feed page |
| 3 — `operator_publications` rises by one | **PASS** — **3 → 4**, `operator_publications_hidden=0` |
| 4 — replay publishes nothing | **PASS** — [33141289139](https://github.com/in-c0/tuned/actions/runs/33141289139), `HTTP 200 · published=False · duplicate=True · item_id=248` |
| 5 — provenance on both surfaces | **PASS on the first attempt** — [qa-browser 33141345668](https://github.com/in-c0/tuned/actions/runs/33141345668) on `961f57f`, header **"@sportstech, 4 nominated find(s)"**, **9 passed / 1 skipped** (the mobile RSS case is skipped by design). `publishedItemPresent: true`, `noteMatchesDispatched: true`, `aiBadgePresent: true` |
| 6 — the find is real | **PASS** — a `read_outcome: "page"` dispatch of the full article, 88,388 visible characters, and every clause of the `why` is a sentence that was on screen |

Baselines: pre-dispatch `list` [33141193861](https://github.com/in-c0/tuned/actions/runs/33141193861)
at 04:13:36Z — `public_items=14 operator_publications=3
last_public_item_at=2026-08-24T21:43:45.078Z`. Post-dispatch `list`
[33141249807](https://github.com/in-c0/tuned/actions/runs/33141249807) at 04:14:47Z —
`public_items=15 operator_publications=4 operator_publications_hidden=0
last_public_item_at=2026-08-28T04:14:13.569Z`. That last value restores A4 until
2026-08-31T04:14:13Z.

**The ordering is checkable rather than asserted.** `a676047` is authored **2026-08-28T04:13:23Z**
and the publication is **04:14:13.569Z** — **+50.569s**. `scripts/validate-nominations.mjs` reports
`transcription OK: url and title verbatim in a676047; why verbatim: yes`, which is a stronger link
than item 247 could offer and much stronger than 246's, whose pre-registration commit is not in a
shallow clone at all.

**Threshold 5 passed on the first attempt, which is new.** Run 85 needed a second dispatch because
`qa/nominations/247-*.json` did not exist in the tree the first run checked out, so a green result
graded items 242 and 246 and said nothing about 247 — the vacuous pass the empty-registry guard does
not catch. This run pushed `961f57f` (the registry entry) **before** dispatching the spec, and the
header read **"4 nominated find(s)"** rather than three. That is the registry used the way run 66
designed it: add a data file, grade the new item, no spec edit, and the earlier three keep grading as
regressions for free.

**One reading this run does not claim.** `thirdPartyConsoleErrors: []` and
`firstPartyConsoleErrors: []` on the `@sportstech` feed page at both viewports. That is **not** a
resolution of the run-49 unattributed console 404, which was seen on a different surface; it is one
page coming back clean and is recorded as that.

---

## R-5 — the fifth `@sportstech` selection cycle, 2026-09-05 (run 139)

**Written before the dispatch, not after it.** No reviewer directive is outstanding; run 138 named
*"agent selection cycles on `@sportstech` under EXP-008's contract"* as admissible work inside
[EXP-011](EXPERIMENTS.md)'s open window, and this is that. The standing rules at the head of this
file apply unchanged: a candidate reaches a dispatch only with a `read_outcome: "page"` behind it,
the `why` must be traceable to sentences that were on screen, and **publish nothing** stays live
until the dispatch is actually made.

**The motive risk this cycle carries, named before the reads rather than after them.** Run 137 split
A4 by venue shape, and `@sportstech` now passes the durable-listing cadence test on four
publications in the trailing 30 days. **So freshness is not at stake this run** — nothing here
restores a threshold, and a *publish nothing* outcome would have cost the register nothing at all.
That is the cleanest motive position any of these five cycles has started from, and it is recorded
because the previous four could not say it.

### The candidate slate, and why four of six were rejected before any dispatch

Discovery is result level — a search result is a pointer, never an encounter — so the rejections
below are made on what a result page states about itself, and only survivors were opened.

| # | Candidate | Verdict |
| --- | --- | --- |
| 1 | `pmc.ncbi.nlm.nih.gov/articles/PMC12487117/` — ACWR for predicting sports injury risk, systematic review and meta-analysis | **Rejected — unencounterable by this reader.** PMC serves a reCAPTCHA interstitial at HTTP 200 to a self-declaring headless client (run 50). The remit's threshold 6 cannot be met for a page that cannot be opened, and the reader will not stop declaring itself to get past a challenge |
| 2 | `link.springer.com/article/10.1186/s13102-025-01332-x` — the same meta-analysis at its publisher | **Rejected — subject overlap with a claim this feed cannot support.** The interesting reading is *the field's dominant load metric may not predict injury*, which is a claim about a literature rather than a measured result of the paper's own; the remit selects findings with a concrete measured result. Kept on the record as the strongest candidate this cycle did **not** pursue |
| 3 | `tandfonline.com/doi/full/10.1080/02640414.2025.2497678` — concurrent validity of markerless motion capture in dual-athlete team-sport movements | **Rejected twice over.** Taylor & Francis returns a Cloudflare bot check to this reader (run 50); and it is a near-repeat of item 242's subject, which is the feed finding one theme rather than making one selection |
| 4 | `sciencedirect.com/…/S0021929025005779` — agreement between markerless and marker-based capture during jumping | **Rejected — same two grounds**, host and near-repeat |
| 5 | `frontiersin.org/…/fspor.2026.1765225/full` — in-game monitoring of adolescent handball players | **Read, and published.** See below |
| 6 | `frontiersin.org/…/fpubh.2026.1843963/full` — physiological load estimation from ECG features and gradient-boosted modelling | **Read at page level, and rejected on its own abstract.** See below |

Also considered and not read: `arxiv.org/pdf/2603.26935`, *The Load Management Paradox: Correcting
the Healthy-Worker Survivor Effect in NBA Injury Modeling*. It is the most methodologically
interesting thing this cycle saw. It is a preprint, and two of this feed's four items are already
preprints carrying that caveat, while peer-reviewed material was reachable this cycle. Recorded so a
later run can pick it up rather than rediscover it.

### The reads — 2026-09-05

| # | URL | Status | Title as served | Page-level? | Run |
| --- | --- | --- | --- | --- | --- |
| 5 | `frontiersin.org/…/10.3389/fspor.2026.1765225/full` | **200** | `Frontiers \| In-game monitoring of adolescent handball players: a preliminary examination of associations between external load parameters and objective and subjective fatigue markers` | **Yes** — 84,912 chars, `read_outcome: "page"`, `interstitial_signals: []` | [33943790863](https://github.com/in-c0/tuned/actions/runs/33943790863) |
| 6 | `frontiersin.org/…/10.3389/fpubh.2026.1843963/full` | **200** | `Frontiers \| Physiological load estimation in athletes using ECG-derived features and gradient-boosted modeling` | **Yes** — 60,423 chars, `read_outcome: "page"`, `interstitial_signals: []` | [33943794214](https://github.com/in-c0/tuned/actions/runs/33943794214) |

Both reads carry `possible_gate_markers: ["accept cookies"]` and `read_outcome: "page"`. A cookie
banner is not a gate — the article text was served and read either side of it, which is what the two
fields are kept separate to distinguish.

### Why read 6 was rejected, from its own abstract

Read 6 opened cleanly and is a 2026 peer-reviewed original research article, so nothing about access
or venue disqualifies it. **Its abstract reports no number.** The result is stated as *"XGBoost
showed the strongest overall cross-validation performance among the tested models"* and
*"strong predictive performance"* — no R², no error, no interval, for any model. The remit selects
*"a concrete measured result or a validated implementation"*, and a benchmark table named in the
outline is not a result the reader was shown.

The second ground is the target. The paper predicts **TRIMP**, which is itself computed from heart
rate and session duration, using heart-rate and HRV descriptors — and it says so, excluding
TRIMP-derived predictors *"to reduce circularity"* and stating the framework is *"not … a model to
predict an independent physiological outcome."* That is an honest disclosure and it is also the
finding: heart-rate features reconstruct a heart-rate score. **The open dataset and interpretable
pipeline are genuine merits**, and if a later cycle can quote actual figures off its Table 5, this
is a defensible pick. Today it fails threshold 6's *"concrete measured result"* on the text that was
on screen.

### R-5 — the read

**`https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2026.1765225/full`**,
read [33943790863](https://github.com/in-c0/tuned/actions/runs/33943790863), 2026-09-05T04:10:06Z.

```
http_status: 200 · read_outcome: "page" · visible_text_chars: 84912
interstitial_signals: [] · possible_gate_markers: ["accept cookies"] · excerpt_truncated: true
redirected: false · final_url == requested_url · published_at: "2026/03/11" (meta)
```

`ORIGINAL RESEARCH article · Front. Sports Act. Living, 11 March 2026 · Sec. Elite Sports and
Performance Enhancement · Volume 8 - 2026`. Peer-reviewed, not a preprint, review or editorial.

**What is on remit.** Workload monitoring — the remit's third bullet — read against fatigue, in
competition rather than in a lab. The measured content quoted in the `why` is verbatim from the
abstract that was on screen: `n = 11; 8 complete cases; age: 16.1 ± 0.4 years`, *"monitored during a
Bundesliga-level youth match"*, external load *"recorded via the Kinexon LPS"*, `RPE increased (T0:
8.0 ± 2.45; T1: 14.6 ± 2.20; T2: 16.1 ± 2.85)`, `PRSS decreased (T0: 8.25 ± 1.91; T1: 6.12 ± 1.89;
T2: 4.75 ± 2.43)`, *"PRSS and RPE showed moderate-to-strong associations with both volume- and
intensity-based external load measures"*, and *"LRT scores remained largely unchanged and showed
minimal associations."*

**Why it is worth a reader's attention, in one line the agent is willing to own:** the expensive
objective instrument did not detect what the free subjective one did, in the only setting that
counts — a real match.

### The case against it, stated by the nominator

1. **The sample is very small and the paper says so in its title.** `n = 11`, **8 complete cases**,
   and the agreement analysis runs on **7**. *"Preliminary examination"* is the authors' own framing,
   and `Preliminary, n=8` is in the published `why` for that reason rather than as hedging.
2. **One match, one squad, one sex, one age band.** Highly trained adolescent male players at
   Bundesliga youth level. Nothing here generalises to seniors, to women, or to a season.
3. **It is correlational and the direction is not established.** *"Associations"* is the paper's
   word and it is the one used. A reader who takes this as *load causes perceived fatigue* is
   reading more than the design supports.
4. **The null on the leg recovery test is the interesting half and the weakest half.** A test that
   *"remained largely unchanged"* across a match is consistent with the athletes not being
   neuromuscularly fatigued, with the test being insensitive, and with an administration effect at
   half-time in a live fixture. The find does not distinguish them and neither does the `why`.
5. **`frontiersin.org` is now four of the five publications on this feed.** Same weakness recorded at
   R-4, same cause: the reachable set is bounded by which hosts serve a self-declaring headless
   reader, and selecting on host politics instead of merit would be worse. It stays a real weakness
   and it is not explained away.
6. **The abstract is the read.** 84,912 characters were on the page; the reader reports a bounded
   prefix, and every figure quoted comes from the abstract. No figure, table or full result section
   was inspected, and the `why` claims nothing that was not on screen.

**What survives all six.** Peer-reviewed 2026 original research, on remit, in competition, with
concrete measured numbers against a named commercial instrument (Kinexon LPS), reporting a **null on
its own objective measure** — the class of result the remit expressly admits and the class the
literature under-publishes. It is also the first `@sportstech` publication that is **not** a sensor
validation study: items 242, 246, 247 and 248 all ask *does this device measure what it claims*;
this one asks *does the monitoring practice see what the coach needs*. That is the feed making a
second kind of selection rather than repeating its first.

### Exactly what is dispatched

One `agent-operator.yml` run, `action=publish`, default idempotency key:

| Field | Value | Budget |
| --- | --- | --- |
| `handle` | `sportstech` | — |
| `url` | `https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2026.1765225/full` | 102 / 2000 |
| `title` | In-game monitoring of adolescent handball players: a preliminary examination of associations between external load parameters and objective and subjective fatigue markers | 170 / 300 |
| `category` | `Research` | one of `CATEGORIES` in [`src/pages.ts`](../src/pages.ts), set explicitly so it cannot default to a permanent `Misc` |
| `why` | One Bundesliga-level youth match, 11 adolescent handball players (8 complete cases): Kinexon LPS external load vs fatigue markers. RPE rose 8.0→14.6→16.1 and PRSS fell 8.25→6.12→4.75, both associated with load; the leg recovery test stayed largely unchanged. Preliminary, n=8. | **276 / 280** |

The three arrows are the abstract's three time points `T0; T1; T2` written for a plain-text field,
and `vs` replaces *"associations between … and …"* for the same reason. Nothing else is compressed.

### What actually happened — recorded after the dispatch

*(This section is written by the same run, after the dispatch, and is the only part of R-5 that
post-dates it.)*
