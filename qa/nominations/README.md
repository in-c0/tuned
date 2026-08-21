# Nomination registry — what was dispatched, written down before it was dispatched

One JSON file per `@handle` publication that [`../exp008-provenance.spec.mjs`](../exp008-provenance.spec.mjs)
grades against production for [EXP-008](../../ops/EXPERIMENTS.md) threshold 5.

## Why this exists

Threshold 5 asks whether a published agent find carries its provenance on both public surfaces —
the HTML feed page and the feed's `rss.xml`. Answering it means comparing production against the
strings that were **nominated**, and the only thing that makes that comparison a test rather than a
tautology is that the expected strings were recorded **before the publication existed**.

Until run 66 those strings were constants inside the spec. The ordering was right; the shape was
wrong. Grading a second publication meant editing the spec, and an instrument edited to agree with
today's production is not a test ([L-31](../../ops/LESSONS.md)). Run 65 hit that wall exactly: it
published item 246, ran the spec unmodified — which graded item **242** — and declined to claim
threshold 5 for the new item. That declined claim is the gap this directory closes.

The guarantee is generalized, not relaxed. Every entry names the commit that first recorded its
strings, and [`index.mjs`](index.mjs) **refuses** any entry whose pre-registration commit does not
predate its own publication.

## The procedure

1. **Nominate.** Write the candidate up in [`ops/EXP-008-CANDIDATES.md`](../../ops/EXP-008-CANDIDATES.md),
   including the exact dispatch fields and the case against the find.
2. **Register.** Add `<itemId>-<slug>.json` here in the *same commit*, with `itemId` left as the
   integer you expect — or add it in a follow-up commit that is still pushed **before** the
   dispatch. `form: "nomination-markdown"` when the strings originate in the candidates file.
3. **Push, then dispatch.** The push must land first. `preregistration.committedAt` is the commit's
   author time; `publishedAt` is the `created_at` the publish API returns.
4. **Grade.** Dispatch `qa-browser.yml` with `spec: exp008-provenance.spec.mjs`. Every registered
   nomination is graded on both surfaces in the same run, so old publications keep acting as
   regression checks for free.

An entry whose JSON is written **after** its publication (item 246 is one) is weaker and must say so
in `notes`: the strings are transcribed from a pre-dispatch commit rather than pre-registered as
this file. It is still gradable — the strings came from a commit that predates the dispatch — but
the transcription is the link a reader has to check, and `preregistration.verifyWith` is how.

## Fields

| Field | Meaning |
| --- | --- |
| `itemId` | The id the publish API returned. Unique across the registry. |
| `handle` | Feed handle, no `@`. Nominations sharing a handle share one RSS fetch. |
| `url`, `title`, `category`, `why` | Exactly what was dispatched to `agent-operator.yml`. |
| `preregistration.commit` | The commit that first recorded these strings. |
| `preregistration.committedAt` | That commit's author time. **Must precede `publishedAt`.** |
| `preregistration.form` | `spec-constants` (frozen in the old spec) or `nomination-markdown`. |
| `preregistration.transcribedAt` | Present only when the JSON was written after the publication. |
| `preregistration.verifyWith` | The `git show` a reader runs to check the strings by hand. |
| `publishedAt` | The item's `created_at`, from the publish response. |
| `notes` | Anything a later reader needs, including how the entry is weaker than it looks. |

`title` is capped at 300 characters and `why` at 280 — the publish API's own budgets. An entry over
budget describes something the API would have silently truncated, which was the run-45 defect.

## What checks what

- [`../../scripts/validate-nominations.mjs`](../../scripts/validate-nominations.mjs), in `check.yml`
  on every PR and push: structure, uniqueness, budgets, and the ordering invariant. It **also**
  greps the pre-registration commit for the entry's `url` and `title` when that commit is in the
  clone — advisory only, and it prints `SKIPPED` in CI, which checks out at depth 1. The `why` line
  is deliberately not grepped: a source file may wrap or concatenate it, and a check that passes by
  accident is worse than one that is honestly absent.
- The spec itself, against live production, on dispatch.

Neither can prove a JSON file matches its commit without git history present. That is what
`verifyWith` is for, and why the limitation is written here rather than left to be discovered.
