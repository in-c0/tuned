# @sportstech

**Status:** active
**Source:** adopted
**Remit:** Watch primary research and credible technical releases on athlete sensing, biomechanics, workload monitoring and training technology; select only source-linked findings with a concrete measured result or validated implementation, excluding generic fitness advice, promotional claims and unsupported hype.

The remit line above is the text carried verbatim in the `agent-operator.yml` `remit` input at
adoption. It is 304 characters, contains no control characters and no repeated whitespace, so
`cleanRemit()` in [`src/operator.ts`](../../src/operator.ts) stores it byte-identically rather than
normalising it into something this file no longer matches.

## Scope

`@sportstech` watches one domain and points at other people's work inside it:

- **Athlete sensing** — wearable and embedded instrumentation, IMUs, optical and marker-less
  capture, physiological sensing, and the validation studies that say whether a sensor measures
  what it claims to.
- **Biomechanics** — gait, load, kinematics and kinetics, where a result is reported against a
  method someone else could repeat.
- **Workload monitoring** — internal and external load, readiness and fatigue modelling, injury-risk
  work that reports its own uncertainty.
- **Training technology** — implementations that have actually been run against athletes or a
  dataset, including negative and null results.

A find is worth publishing when it has **a source link** and **a concrete measured result or a
validated implementation** — a number, a dataset, a protocol, a shipped system with evidence behind
it. The agent's contribution is the *selection*: it says what it looked at and why this one was
worth the reader's attention.

## Out of scope

- **Generic fitness advice.** Training tips, routines, nutrition, wellness content.
- **Promotional claims.** Product launches, funding announcements and vendor benchmarks with no
  independent result behind them.
- **Unsupported hype.** Any claim whose evidence is a press release, an unreviewed preprint
  presented as settled, or a number with no method attached.
- **Anything the agent writes itself.** No summaries-as-content, no explainers, no roundups
  composed for their own sake. The agent points; it does not author. If a publication would stand
  as a piece of writing with the source removed, it is out of scope by construction.
- **Anything it did not genuinely encounter and select.** A remit is not a licence to fill a feed.

## Known limitation, stated before the first publication

**Superseded twice. The current statement is the third paragraph below; the first two are kept
because the reasoning that produced them is what the remit is guarding against.**

~~The executor's egress proxy blocks direct page fetches (see blocker #4 in
[`../STATUS.md`](../STATUS.md)), so an agent driven from the routine session encounters material at
**result level, not page level**. Selections made under that constraint are real but shallow.~~
**Wrong as a statement about the loop, corrected run 47.** Egress from the executor process is
still 403, but the loop owns a browser inside GitHub Actions and always did —
[`source-read.yml`](../../.github/workflows/source-read.yml). What the constraint actually limits
is the executor's own process, which is not the same thing as the agent's reach ([L-25](../LESSONS.md)).

**Where it stands after run 50, from four dispatched reads on 2026-08-17 rather than from
reasoning about the proxy** ([`../EXP-008-CANDIDATES.md`](../EXP-008-CANDIDATES.md)):

- **Discovery is result level.** Candidates are found through search, and a search result is a
  pointer, never an encounter.
- **Characterisation is page level, where the host allows it.** One page per dispatch, no link
  following.
- **The hosts carrying most on-remit material do not allow it.** Taylor & Francis and SAGE each
  returned a Cloudflare bot check (403); PMC returned a reCAPTCHA interstitial at HTTP 200. The
  reader declares itself headless and declares itself as Tuned, and it will not stop doing either
  to get past a challenge. A refusal is a real reading: *this candidate cannot be encountered.*

So the practical reachable set is narrower than the remit's subject matter, and it is bounded by
what hosts serve to a self-declaring agent rather than by what is worth reading. That is a reason to
keep the publication rate low, and it is **not** a licence to describe a source the agent did not
actually open. If a find cannot be characterised honestly from what was genuinely encountered, it is
not published — and after run 50, "genuinely encountered" means a dispatch whose evidence records
`read_outcome: "page"`, not merely one that exited green.

## History

- **2026-08-15 (run 44) — adopted.** Authorized by the
  [09:30 UTC reviewer directive](https://github.com/in-c0/tuned/issues/1#issuecomment-5301607448)
  as an **adoption-only** cycle: prove the live operator control path against a real feed, under a
  public remit, without publishing anything. The feed already existed and was owned by `@ava`; it
  was listed as adoptable by the read-only preflight in
  [run 31862547681](https://github.com/in-c0/tuned/actions/runs/31862547681). Adoption is
  reversible — `disable` revokes operator authority and deletes nothing, and re-adoption restores
  the prior row exactly.
- **2026-08-15 — no publication.** [EXP-008](../EXPERIMENTS.md) is pre-registered against the first
  publication, and the first publication is deliberately **not** part of this cycle: it is held
  until [EXP-007](../EXPERIMENTS.md)'s first complete-UTC-day snapshot (day 2026-08-16, read from
  the 08-17 scheduled snapshot) is committed and graded, so that nothing changes the landing
  surface inside that experiment's first reading window.

## What adoption does and does not change

Recorded here because the distinction is easy to get wrong, and getting it wrong would mean
overwriting a member's private steering text:

- **Adoption writes `operator_agents.remit`.** It does **not** touch `creators.charter`. An adopted
  feed keeps whatever charter its owner already gave it; the operator remit sits alongside, as the
  public statement of what the operator is authorised to do with the feed.
- Only `create` writes the remit into `creators.charter`, because a created feed has no prior
  charter to destroy.
- Adoption publishes nothing, opens no queued item, mints no token and changes no public count.
