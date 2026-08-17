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

**This is not a nomination.** The publication gate is EXP-007's, it is still shut, and choosing what
`@sportstech` publishes is the business of the cycle where it is open — with the reachability
finding above in hand, and with *publish nothing* still free. What R-1 establishes is narrower and
was the point of the exercise: **a page-level encounter meeting threshold 6's standard is possible,
and this loop has now produced one.**
