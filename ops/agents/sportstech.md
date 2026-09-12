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
- **2026-08-18 → 2026-09-05 — five selections, listed here because an agent's own file should say
  what it has actually pointed at.** Each has a `read_outcome: "page"` dispatch behind it, a case
  written against it before the dispatch, and a registry entry in
  [`qa/nominations/`](../../qa/nominations/) that the provenance spec grades against production. The
  full record for each is in [EXP-008-CANDIDATES.md](../EXP-008-CANDIDATES.md).

  | Item | Date | Find | Cycle |
  | --- | --- | --- | --- |
  | 242 | 2026-08-18 | VideoRun2D — markerless sprint biomechanics vs Kinovea labelling | R-1 |
  | 246 | 2026-08-21 | Synchronized multi-IMU joint-angle wearable, vision-referenced | R-2 |
  | 247 | 2026-08-24 | Optimising IMU configurations for running gait, sensor fusion | R-3 |
  | 248 | 2026-08-28 | Hammer-throw IMU biomechanics vs VICON, ICC 0.977 / 0.976 | R-4 |
  | 249 | 2026-09-05 | In-game handball monitoring: Kinexon LPS load vs fatigue markers | R-5 |

  **Item 249 is the first that is not a sensor-validation study.** The first four ask whether a
  device measures what it claims; 249 asks whether a monitoring practice sees what the coach needs,
  and reports a null on the objective instrument. **Four of the five are from `frontiersin.org`** —
  host reachability, recorded as a standing weakness rather than an editorial preference, on the
  limitation stated above.

## What adoption does and does not change

Recorded here because the distinction is easy to get wrong, and getting it wrong would mean
overwriting a member's private steering text:

- **Adoption writes `operator_agents.remit`.** It does **not** touch `creators.charter`. An adopted
  feed keeps whatever charter its owner already gave it; the operator remit sits alongside, as the
  public statement of what the operator is authorised to do with the feed.
- Only `create` writes the remit into `creators.charter`, because a created feed has no prior
  charter to destroy.
- Adoption publishes nothing, opens no queued item, mints no token and changes no public count.

- **2026-09-11 (run 152) — R-6, the sixth selection cycle.** Item **279**, a PLOS ONE randomized
  trial on warm-up protocols and drop-jump biomechanics in elite Taekwondo athletes. Two firsts for
  this feed, both recorded because they change what the register can reach:

  | Item | Date | Find | Cycle |
  | --- | --- | --- | --- |
  | 279 | 2026-09-11 | Warm-up modality vs drop-jump SSC mechanics: force and power move, jump height does not | R-6 |

  **First item from neither `frontiersin.org` nor `arxiv.org`.** `journals.plos.org` and
  `nature.com` were both opened at page level by a self-declaring headless reader with
  `possible_gate_markers: []` — cleaner than every `frontiersin.org` read, each of which carries
  `["accept cookies"]`. PLOS is one of the four hosts run 85 pre-committed this loop to probing
  ([L-45](../LESSONS.md)); **that probe is made and it succeeded.** The "practical reachable set is
  narrower than the remit's subject matter" limitation above is therefore **wider than it was**,
  and it was tested rather than argued.

  **First item whose selected finding is a null on the outcome everyone measures.** Items 242–248
  ask whether a device measures what it claims; 249 asks whether a monitoring practice sees what
  the coach needs; 279 reports that the three numbers a coach reads off a drop jump — height,
  flight time, contact time — did not move (trivial, n.s., η² ≤ 0.104) while the concentric force
  and power components did (η² = 0.186 / 0.211).

  **The adjacency this one carries, stated rather than glossed.** Warm-up protocols sit next door
  to *"generic fitness advice"*, which is out of scope by name. The distinction the remit is drawing
  is **advice versus measurement**, and a randomized trial reporting effect sizes against a stated
  statistical model with an explicit null is the second. It is the closest to that boundary anything
  on this feed has come, and a later cycle that wants to go further should have to argue for it.

- **2026-09-12 (run 153) — this feed acquired a publisher, and the first thing it did was select four
  papers about the wrong people.**

  Everything above was published by a person reading a research session's notes. From this run the
  selection is made by [`scripts/lib/agent-scout.mjs`](../../scripts/lib/agent-scout.mjs) — the remit
  on this page, translated into an explicit bar and applied to the **open-access full text** the agent
  fetches for itself from Europe PMC's archive. The bar is pre-registered as
  [EXP-013](../EXPERIMENTS.md) and shipped in
  [`efae10d`](https://github.com/in-c0/tuned/commit/efae10d) before it had screened a single candidate.

  | Item | Date | Find | Cycle |
  | --- | --- | --- | --- |
  | 280 | 2026-09-12 | Three work-equivalent whole-body vibration protocols, 13 highly trained adolescent soccer players: no protocol-dependent change in MVIC, EMG or CMJ | **S-1** — first autonomous selection |

  **The cycle label changes from R to S, because the guarantee behind it is different.** R-1 … R-6
  each carry a pre-registration commit containing the four dispatched strings, written before the
  dispatch. An autonomous selector cannot pre-register an item it has not seen; what its commit
  contains is the **rule**, which does predate the selection. `qa/nominations/` records this as the
  third pre-registration form, `autonomous-bar`, and an entry of that form must name the Actions run
  whose log shows the selection being made.

  **The encounter is stronger than the browser reads above, not weaker.** The limitation recorded on
  this page — that the hosts carrying most on-remit material refuse a self-declaring headless reader —
  is sidestepped rather than solved: Europe PMC's `fullTextXML` is the archive's own machine endpoint
  for open-access articles, so the agent read **46,097 characters** of item 280's full text. A
  candidate whose full text cannot be fetched is rejected as unencounterable and never selected on its
  abstract. The reader-facing URL was separately confirmed to open at page level with no gate marker
  ([34673030785](https://github.com/in-c0/tuned/actions/runs/34673030785)).

  **Why the bar had to be corrected between its first and second screen, recorded here because it is a
  statement about this remit rather than about the code.** The first screen selected 10 of 50, and four
  were clinical rehabilitation — paediatric cerebral palsy, robot-aided physiotherapy, stroke, neck
  pain. All four are instrumented movement science with proper statistics. **Clinical movement labs use
  the same instruments and the same vocabulary as sport science**, so "gait", "kinematic" and
  "neuromuscular" cannot be what admits a candidate to *this* feed; an athlete or a named competitive
  sport has to be. The scope section above has always said so in prose. The first translation of it
  into terms did not. See [L-70](../LESSONS.md) and [L-71](../LESSONS.md).

  **What item 280's `why` line does and does not say.** It reports the screening: 35 candidates, full
  text read, 46,097 characters, which design and statistic families the text contained. It does **not**
  say what the paper found, because the agent has not understood the paper. The finding — a null:
  three work-equivalent WBV protocols produced no clear protocol-dependent change, with small effects
  and wide confidence intervals on 13 players — is in this table and in EXP-013, written by a person
  who read the abstract, and it is deliberately not in the agent's own voice. **This is weaker than
  the lines on 242–279 and it is the honest version.** The improvement is quotation of the source, not
  generation.

  **Two publishers now exist for this feed and the register must not blur them.** Hand cycles are
  `R-n` and carry a human's reading of the paper; autonomous cycles are `S-n` and carry the bar's
  record. A later run comparing "what this feed publishes" across the two has to compare them as two
  things.
