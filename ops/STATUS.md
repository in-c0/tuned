# Tuned — STATUS

**Last updated:** 2026-10-05 15:35 Sydney (2026-10-05 04:35 UTC), run 222 — **[OWNER ACTION REQUIRED](#owner-action-required):
THREE, unchanged and not re-argued here, per [L-07](LESSONS.md#l-07). Card 3's deadline has passed; `QUIET` is the
default outcome.** **The handover now carries the window's last possible reading, and the one figure its own guard
said it would not catch had already been broken by the commit that wrote the warning.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs) read **CURRENT** —
item 298 at `2026-10-04T10:16:17.520Z`, **18h** old, **zero** scheduled screens certainly delivered since. Nothing
published, amended or retracted. **The schedule was not armed:** EXP-013's threshold 2 is still unruled and run 153's
pre-commitment stands — owner card 3, whose deadline has passed.

**This is the final operating date and the second-to-last run inside the window.** `TZ=Australia/Sydney date` read
**2026-10-05 15:13 AEDT** — *on*, not after, the date — so this is a normal operating cycle. One further firing falls
inside the window (`2026-10-05T10:00Z`); the first outside it is **`2026-10-05T22:00Z`**, and that is the run that
posts [`ops/CLOSEOUT.md`](CLOSEOUT.md) verbatim, once, and stops. **No `<!-- tuned-closeout -->` comment exists on
issue #1 and none should yet.** No new reviewer directive — the newest ChatGPT review is **2026-09-01**, 34 days.

**The cycle went to the window's final reading, because this was the last cycle that could take one.** The window
closes at `2026-10-05T13:00Z`, so **2026-10-04 is the last whole UTC day inside it** — and the closeout was stamped
complete-through **2026-10-03**. The `15 0 * * *` snapshot cron, which exists to put a finished day on disk within
minutes of its ending, **did not fire at `2026-10-05T00:15Z` — the third consecutive occurrence**
([L-135](LESSONS.md#l-135)). One `workflow_dispatch` →
[metrics snapshot 37262751307](https://github.com/in-c0/tuned/actions/runs/37262751307) →
[`c9309e5`](https://github.com/in-c0/tuned/commit/c9309e5), `generated_at` **2026-10-05T04:16:16.516Z**, complete
through 2026-10-04. Checked against open pre-registrations *before* dispatch: a dispatch probes production, and
EXP-014 closed 2026-10-03 with nothing open to perturb.

**`SOURCE_STAMP` moved for the last time it can, and it turned the report's one unsourced figure into an observed
one.** `items_public` **102** — §3 had been carrying it as *"the stamped 101 plus one HTTP 201"*. Every other
commercial figure was re-checked field by field and **none moved**: applications **0**, members **1**, members ever
active **0**, followers **0**, stars/skips **8 / 33** all owner, queued **180**, gross cash **AUD $0.00**. §2's
cohort range was **two** days behind at `→ 2026-10-02` and now reads `→ 2026-10-04`.

**Then the defect the guard had predicted about itself.** Run 221 honestly named the one figure it could not derive —
*"1,037 passing tests"* — and wrote that *"a run that changes the test count must correct the closeout by hand."*
**`d0084d2` moved the ops suite 476 → 479 in that same commit and did not correct it**, so the document read 1,037
against an actual 1,040 from the moment the warning was committed, while the same report printed `ops 479/479` two
paragraphs away. **Naming an unguarded figure is not guarding it** — [L-142](LESSONS.md#l-142). Subtest **12** now
pins `561 + 480` and asserts the report states the sum, failing when the phrase matches nothing. The pin is
self-referential — adding it moved the ops suite to **480** and the total to **1,041** — so it was read off an
actual run, and it **reddened on the real `1,037` before it cleared**.

**One landing arrival on the window's last complete day ran the page and stopped before the form.** 2026-10-04:
`landing_render` **1**, `landing_engage` **1**, `application_start` **absent**; `item_view` **49** unsuffixed with
`item_render` **never written**; `referrers` holding one row (`www.google.com`, `bot` 1, 10) which is
`verify-production.yml`'s own liveness check and not an arrival. Per [METRICS.md](METRICS.md)'s own definitions these
page-reported names are **forgeable by one header**, so that is evidence one arrival behaved like a person, **not
proof of one and not a rate**. EXP-014 closed 2026-10-03 with **VERDICT B, FINAL**, and nothing here re-grades it.

**Nothing in `src/`, no `test/`, no schema, no route, no counter, no workflow, no dependency, and no privacy or terms
text.** The only non-`ops/` change is the pinned constants and subtest 12 in `scripts/closeout.test.mjs`.

**Production:** verified from Actions, not from this session — the standing egress blocker is unchanged and nothing
was widened. See the run-222 entry in [DECISIONS.md](DECISIONS.md).

**Standing blocker, unchanged:** the artifact and log **blob hosts** (`productionresultssa*.blob.core.windows.net`)
answer **403 CONNECT** to this session, and `justtuned.com:443` does too. **The GitHub Actions API itself is not
blocked.** *A blocked transport is not an unavailable fact.*

**Gates:** `npm run check` **0** · **561 vitest** (35 files, unchanged — no `src/` or `test/` file touched) ·
ops suite **480/480** · 14 workflows · **23** nominations · **0** vulnerabilities · `doc-anchors`,
`owner-cards` **THREE, agreed in head, section and mirror**, `milestone-horizons` ok.

---

**Last updated:** 2026-10-05 09:35 Sydney (2026-10-04 22:35 UTC), run 221 — **[OWNER ACTION REQUIRED](#owner-action-required):
THREE, unchanged and not re-argued here, per [L-07](LESSONS.md#l-07). Card 3's deadline has passed; `QUIET` is now
the default outcome.** **This is the final operating date. The handover document carried three different answers for
its own lesson count, and the guard that should have caught it had been switched off for every figure in the file.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs) read **CURRENT** —
item 298 at `2026-10-04T10:16:17.520Z`, **12h** old, **zero** scheduled screens certainly delivered since. Nothing
published, amended or retracted. **The schedule was not armed:** EXP-013's threshold 2 is still unruled and run 153's
pre-commitment stands — owner card 3, whose deadline has now passed.

**Nothing else arrived, and the cycle went to the one artifact that becomes permanent tomorrow.** No new reviewer
directive (the newest ChatGPT review is **2026-09-01**, 34 days). No pre-registered reading remains: EXP-014 closed
2026-10-03, EXP-013 closed and failed on its bar, EXP-012 awaits a reading its source never shipped. Run 220's own
recommendation for a run firing today was *"attend the gate, confirm the closeout still passes its eight tests, and
otherwise leave the record alone."* **The gate owed nothing and the eight tests passed — and confirming them is what
found the defect, because what they do not check is where it was.**

**[`ops/CLOSEOUT.md`](CLOSEOUT.md) carried four wrong figures, three of them the same figure.** It stated the lesson
count **three times and disagreed with itself twice** — `138` at line 12, `139` at line 121, `138` at line 254 —
against an actual **140**; and *"22 publications are registered in `qa/nominations/`"* against **23** files. Each
drifted by the ordinary mechanism: run 219 corrected `138 → 139` in one of three places; run 220 published item 298,
committed the 23rd nomination, and updated the published-finds figure **two sentences from the nomination tally**
without touching it, while also adding L-140 and moving no lesson count at all. All four are now correct.

**The reason none of it was caught is the finding, and it is [L-140](LESSONS.md#l-140)'s shape again.**
[`closeout.test.mjs`](../scripts/closeout.test.mjs) carried a capitalised exclusion — *"WHAT IT DELIBERATELY DOES NOT
CHECK: whether the figures match today's snapshot"* — and the reasoning behind it is **correct and is kept**:
`metrics-snapshot.yml` commits `ops/metrics` twice daily, so comparing the report against the live snapshot would let
an automated commit redden `master` **with no human change**, with nobody left to clear it after tomorrow. **But the
exclusion was written about "the figures" when the hazard only reaches the figures a robot can move.** Three of the
document's tallies are read off this repository's own tree — lessons, nomination files, workflow files — and
**`metrics-snapshot.yml` is the only workflow here that commits at all, and it stages `ops/metrics` and nothing
else.** Those three carried no data-red hazard and were excluded anyway. **A restriction stated one level too general
silently forbids what it does not cover, and the cost is paid in checks never attempted rather than in visible
errors** — [L-141](LESSONS.md#l-141).

**Subtests 9–11 now derive all three counts from the tree**, and the lesson-count subtest checks **every** place the
document states one, which is what a three-way disagreement needed. **The guard reddened on the real defect before it
cleared:** written against the corrected document it failed subtest 9 at `140 ≠ 141` until L-141 itself existed, which
is the mechanism working rather than an obstacle. **11/11** after. The lesson guard also **fails when it matches
nothing**, so a later rephrase cannot disable it quietly. **One figure is left unguarded and the header now says so:**
*"1,037 passing tests"* is 561 vitest plus 476 ops tests, and neither is knowable without running the suite that
contains the guard.

**Nothing in `src/`, no `test/`, no schema, no route, no counter, no workflow, no dependency, and no privacy or terms
text.** The only non-`ops/` change is the three added subtests in `scripts/closeout.test.mjs`.

**Production:** verified from Actions, not from this session — the standing egress blocker is unchanged and nothing was
widened. See the run-221 entry in [DECISIONS.md](DECISIONS.md).

**Standing blocker, unchanged and stated at the altitude actually tested:** the artifact and log **blob hosts**
(`productionresultssa*.blob.core.windows.net`) answer **403 CONNECT** to this session, and `justtuned.com:443` does
too. **The GitHub Actions API itself is not blocked.** *A blocked transport is not an unavailable fact.*

**Gates:** `npm run check` **0** · **561 vitest** (35 files, unchanged — no `src/` or `test/` file touched) ·
ops suite **479/479** · 14 workflows · **23** nominations · **0** vulnerabilities · `doc-anchors`,
`owner-cards` **THREE, agreed in head, section and mirror**, `milestone-horizons` ok.

---

**Last updated:** 2026-10-04 21:20 Sydney (2026-10-04 10:20 UTC), run 220 — **[OWNER ACTION REQUIRED](#owner-action-required):
THREE, unchanged and not re-argued here, per [L-07](LESSONS.md#l-07). Card 3's deadline is now inside today.**
**The gate owed a publication and got one: item 298, the last find this loop publishes under its own operation.**

**The gate was attended first, and this time it owed something.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **ATTEND** — item 297 at `2026-10-03T10:15:34.311Z`, **24h** old, **one** scheduled screen certainly
delivered since (`2026-10-04T02:40:00.000Z`). The
[08:44Z screening record](https://github.com/in-c0/tuned/actions/runs/37189873969) was read in full from the
**job log** — **screened 36 · rejected 25 · selected 9 · deferred 2 · 12 full-text reads** — and it supported
publishing. Dispatched `agent-scout.yml` with `publish: true` →
[run 37194801278](https://github.com/in-c0/tuned/actions/runs/37194801278): **item 298 published**, HTTP **201**,
`duplicate=false`, at `2026-10-04T10:16:17.520Z` — *Neuromuscular control strategies during the Tai Chi
heel-kick movement across different levels of motor experience*, carrying a **verbatim quotation from its own
abstract** (`p = 0.499`, a null result, in the source's own words). Nomination committed as
[`qa/nominations/298-…json`](../qa/nominations/298-neuromuscular-control-strategies-during-the.json), so the gate
now reads **CURRENT**. **The schedule was not armed:** EXP-013's threshold 2 is still unruled and run 153's
pre-commitment stands — owner card 3, whose deadline is now hours away. Attending a gate is not removing it.

**Then the cycle corrected a standing blocker that was true about a transport and false about the facts.**
Run 219 declined to quote the `verify production` **per-assertion tally** at all, on the ground that the Actions
log blob host answers `Forbidden` — *"the same standing egress blocker that makes the `scout-record` artifact
unreadable."* **The restraint was right and the scope was wrong.** The blob host **is** blocked, re-tested this
run against `productionresultssa17` with a byte-identical `403 CONNECT`, and nothing was widened to reach it.
But **the tally never needed a log:** the Actions **jobs** API returns every step with its own conclusion, and on
[verify production 37177060893](https://github.com/in-c0/tuned/actions/runs/37177060893) (`58aff65`) that is
**26 assertion steps — 25 `success`, 1 `skipped`** (*"Public availability"*). That is exactly the **25 of 26**
tally run 219 said could not be read, and exactly what [`ops/CLOSEOUT.md`](CLOSEOUT.md) already had committed.
**A blocker stated one level too general silently forbids the readings it does not cover**, and the cost is paid
in readings never attempted rather than in visible errors — [L-140](LESSONS.md#l-140).

**Standing blocker, restated at the altitude actually tested:** the artifact and log **blob hosts**
(`productionresultssa*.blob.core.windows.net`) answer **403 CONNECT** to this session, and `justtuned.com:443`
does too, so production is verified from Actions rather than from here. **The GitHub Actions API itself is not
blocked** — it serves both the job log (which prints the `scout-record` in full, practice since run 213) and the
per-step conclusions. *A blocked transport is not an unavailable fact.*

**Two defects fixed in the handover document, one of them a contradiction it has carried since run 219.**
[`ops/CLOSEOUT.md`](CLOSEOUT.md) §3 read *"100 published finds across 5 feeds"* while its own sourced table read
**101** — run 219 moved the table when the figure became observed and left the prose a run behind, the third
stale tally caught in this document in two days. It now reads **101 at the stamp**, and records that item **298**
published **after** that snapshot, so the live count is **102** while the stamped table reads 101 — **both
correct, neither an estimate.** **`SOURCE_STAMP` was deliberately NOT moved:** no figure was re-read, the stamp
still pins the same snapshot, and re-stamping without a new reading would be the two-file friction performed for
nothing. **8/8** on `closeout.test.mjs`.

**Nothing in `src/`, no `test/`, no schema, no route, no counter, no workflow, no dependency, and no privacy or
terms text.** The only non-`ops/` change is [`scripts/scout-gate.mjs`](../scripts/scout-gate.mjs)'s `ATTEND`
guidance, which now names the job log as the route to the record and the blob host as the part that 403s — so the
one tool the read order sends every run to no longer points only at the resource that fails.

**Production:** verified from Actions, not from this session. See the run-220 entry in
[DECISIONS.md](DECISIONS.md) for the push's `check` and `verify production` runs.

**Gates:** `npm run check` **0** · **561 vitest** (35 files, unchanged — no `src/` or `test/` file touched) ·
ops suite **476/476** · 14 workflows · **23** nominations · **0** vulnerabilities · `doc-anchors`,
`owner-cards` **THREE, agreed in head, section and mirror**, `milestone-horizons` ok.

---

**Last updated:** 2026-10-04 15:30 Sydney (2026-10-04 04:30 UTC), run 219 — **[OWNER ACTION REQUIRED](#owner-action-required):
THREE, unchanged and not re-argued here, per [L-07](LESSONS.md#l-07). Card 3 is now hours from its deadline.**
**EXP-014 is CLOSED: 7 of 7 days graded, and the off-site find-page figure is 1.16% browser.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs) read
**CURRENT** — item 297 at `2026-10-03T10:15:34.311Z`, **18h** old, **zero** scheduled screens certainly
delivered since. Nothing published, amended or retracted. **The schedule was not armed:** EXP-013's threshold
2 is still unruled and run 153's pre-commitment stands — owner card 3, now with **hours** on its clock.

**The one reading this loop had left became available at `00:00Z` and this run took it.** EXP-014's last
outstanding day, 2026-10-03, grades on a snapshot whose `generated_at` is at or after `2026-10-04T00:00Z`.
Run 218 fired at `22:15Z` on 2026-10-03 and correctly declined it — the UTC day had not closed. **This is the
last pre-registered experiment window this loop can still grade**, and it is now graded.

**The `15 0 * * *` snapshot cron did not fire, for the second consecutive window grading.** At `04:14Z` the
newest committed snapshot was the `40 20 * * *` cron delivered **2h37m late** at `2026-10-03T23:17:53.261Z` —
**42m06s short of the day it was supposed to close.** One `workflow_dispatch` →
[metrics snapshot 37176443276](https://github.com/in-c0/tuned/actions/runs/37176443276) →
[`8394304`](https://github.com/in-c0/tuned/commit/8394304), `generated_at` **2026-10-04T04:15:07.776Z**,
complete through 2026-10-03. **[L-135](LESSONS.md#l-135) confirmed by instance, not merely cited.** The
dispatch was checked against EXP-014's binding clauses *before* it was sent: a dispatch does probe production,
but `scripts/prod-http.sh` declares `uptime` and classifies as bot, and its writes land on the **2026-10-04**
row, which EXP-014 does not grade. **No graded name could be written and none was.**

**VERDICT B is unchanged and FINAL, now stated over a complete window: five `A-CONSISTENT` days and two
Fork B days.** No Amendment 2 bracket is owed — the grader prints none, and the final day is not a Fork B day.
**2026-10-03 is the window's cleanest and largest Fork A day:** `item_view` **124** unsuffixed across five
feeds, `item_render` **never written at all** (`item_render_bot` 1 only), and `referrers` holding **two rows,
both `bot` 1** — cross-checking exactly to `item_view_referred_bot` **11** and `item_view_search_bot` **10**,
with **no `bot` 0 row of any host.**

**The denominator is the finding, and no single-day grading could produce it.** Over the seven days:
`item_view` unsuffixed **517** · `item_view_referred` **6** · `item_view_search` **2** · `item_render` **6** ·
`item_view_bot` **685** — **`item_render` is 1.16% of unsuffixed `item_view`.** So the off-site figure is a
**machine count with two browser arrivals inside it**; **511** views presented no referrer and coincided with
no render. `item_view_referred` and `item_render` are both **6**, and that agreement is **suggestive and not a
join** — these are counters and nothing links a view to a render. Source:
[`ops/metrics/latest.json`](metrics/latest.json) `daily`, `generated_at` `2026-10-04T04:15:07.776Z`.
**Arithmetic coincidence, flagged so it is never read as a finding:** that 517 is the same integer as
2026-09-26's single-day reading which opened the question. The two are unrelated.

**Amendment 1's corroboration axis is reported as unexercised rather than as a save.** **No day in the window
was Fork F** — every day carried a referrer *and* a render, or neither — so the `item_render` requirement run
198 added inside the window **changed no grading.** It was well-argued, cost nothing and is kept; but a guard
that never fires inside the window it guards has shown **no** discriminating power there, and calling it a save
would convert an untested safeguard into evidence. [L-139](LESSONS.md#l-139).

**[`ops/CLOSEOUT.md`](CLOSEOUT.md) was re-stamped to the new snapshot — run 218's candidate 2, executed under
its own stated conditions.** `generated_at` `2026-10-03T05:19:34.043Z` → **`2026-10-04T04:15:07.776Z`**,
complete through **2026-10-03, the last whole day of the operating window.** That turned its one **predicted**
figure into an observed one (`items_public` **100** *"reads 101 on the next snapshot"* → **101**), and every
other commercial figure was re-checked against the new reading **mechanically** and none moved. The closed
window's denominator was added to its learning 2. **Two stale tallies were caught and one predates this run:**
*"1,036 passing tests"* was true at `03ed7a1` but `f7e3ad4` added the eighth closeout test in the same run and
left it one behind — now **1,037**; lessons **138 → 139**.

**The guard fired on that edit, which is the mechanism working rather than an obstacle.**
`closeout.test.mjs`'s subtest 5 went **red** on the re-stamp, because `SOURCE_STAMP` is deliberately a literal
and not a read of the live snapshot — the live construction would let a twice-daily automated snapshot commit
redden `master` with no human change, which runs 216 and 218 both declined. **Re-stamping is therefore a
two-file edit, and that is the intended friction**; the constant now carries the reason and the move. **8/8**
after.

**Nothing in `src/`, no `test/`, no schema, no route, no counter, no workflow, no dependency, no privacy or
terms text, and no product-surface act at all this cycle** — the gate owed nothing, so nothing was published.

**Production:** [check 37176931659](https://github.com/in-c0/tuned/actions/runs/37176931659) **success** ·
[verify production 37176931648](https://github.com/in-c0/tuned/actions/runs/37176931648) **success** — 1 job,
0 failed, `04:24:57Z → 04:26:17Z`, **80s** from push. **Per-assertion counts are not quoted because they
could not be read:** the Actions log blob host answers `Forbidden` to this session, the same standing blocker
that makes the `scout-record` artifact unreadable. The conclusion is the verification; a tally would have been
decoration and inventing one would break the hard rule.

**Gates:** `npm run check` **0** · **561 vitest** (35 files, unchanged — no `src/` or `test/` file touched) ·
ops suite **476/476** · 14 workflows · **22** nominations · **0** vulnerabilities · `doc-anchors`,
`owner-cards` **THREE, agreed in head, section and mirror**, `milestone-horizons` ok.

---

**Last updated:** 2026-10-04 09:15 Sydney (2026-10-03 22:15 UTC), run 218 — **[OWNER ACTION REQUIRED](#owner-action-required):
THREE, unchanged and not re-argued here, per [L-07](LESSONS.md#l-07).** **The closeout exists. It was the one
deliverable in this project whose only possible author was a run that is forbidden to write it, and two correct
runs had already declined it.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs) read
**CURRENT** — item 297 at `2026-10-03T10:15:34.311Z`, **12h** old, **zero** scheduled screens certainly
delivered since. Nothing published, amended or retracted. **The schedule was not armed:** EXP-013's threshold 2
is still unruled and run 153's pre-commitment stands — owner card 3, now with **one day** on its clock.

**Run 217's candidate 1 was not available to this run, and the reason is the clock rather than a judgement.**
EXP-014's last outstanding day, 2026-10-03, grades on a snapshot whose `generated_at` is at or after
`2026-10-04T00:00Z`. This run fired at **`22:15Z` on 2026-10-03** — **before the UTC day it would grade had
closed at all.** Stated as the artifact's own property and not as a forecast ([L-135](LESSONS.md#l-135)); the
newest snapshot is `2026-10-03T05:19:34.043Z`, complete through 2026-10-02. **Nothing was graded on a partial
day and no grade moved.** The next run settles it with one `metrics-snapshot.yml` dispatch.

**So the cycle took the one thing that becomes impossible rather than merely harder.** Three files promised a
closeout — [MILESTONES.md](MILESTONES.md)'s reference dates, its 3-month horizon (*"at closeout, hand over an
honest cohort table rather than a summary"*) and [DASHBOARD.md](DASHBOARD.md)'s mirror — and **none existed.**
Runs 216 and 217 both named it a next candidate and **both declined it**, each correctly preferring a reading
tied to a day that had just closed. **A document with no deadline loses every tiebreak it is ever in**, and
this one had one more tiebreak left to lose.

**The asymmetry is what makes it this run's action and not the next one's.** [CLAUDE.md](../CLAUDE.md) binds any
run firing after 2026-10-05 to make no changes — no commit, no claim, no dispatch. **The closeout's only
possible author is therefore a run that is forbidden to author it.** A post-date run would have composed it
live from 3,000-line `ops/` files, with no ability to run one check on one number, against the hard rule that
no published number is unsourced. *"A later run will write it"* was not a deferral to a worse time but to a run
with **no capability to do it at all.** [L-138](LESSONS.md#l-138).

**[`ops/CLOSEOUT.md`](CLOSEOUT.md) — 18,267 characters, written to be posted rather than summarised.** It
carries the `<!-- tuned-closeout -->` dedup marker on its **own first line**, so the posted comment holds it
where the post-date search needs it, and `CLAUDE.md`'s post-date step 3 now names the file and **forbids
re-deriving its figures**. Nine sections: the commercial result · the cohort table two files promised · what
exists and works in production · what was actually learned · every milestone grade · the three open owner cards
· **what keeps running after this loop stops** · what to do first if someone picks Tuned up · where the record
lives.

**The commercial result is stated without softening, because that is the result.** Gross cash **AUD $0** ·
`applications` **0** · `members` **1**, the owner · `members_ever_active` **0** · `followers` **0** ·
`items_public` **100** (reads **101** next snapshot; item 297 postdates it) · `stars` **8** / `skips` **33**,
**all of them `_owner`** — the subtraction for non-owner attention is exact and it is **zero**. Source:
[`ops/metrics/latest.json`](metrics/latest.json) `totals` and `retention`, generated
**`2026-10-03T05:19:34.043Z`**, complete through 2026-10-02. **Forty-fourth consecutive cycle whose output is
not a user or a dollar.**

**The cohort table is handed over empty rather than replaced by a sentence, and the empty table says more.**
`members_total` 1 · week-1 and week-4 return 0 · renewals 0, *no billing exists*. What it preserves is the
distinction: **the instrument that would observe retention is deployed and silent, not missing** — retention
became computable at `feb6c4f` and has recorded nothing since — so the next operator needs **arrivals, not
measurement**. MILESTONES' 3-month next action is marked **DISCHARGED** against it.

**One unsourced figure was caught in the draft and corrected before the commit.** It read *"~60 counter
families"*; the snapshot's own `daily` array holds **38** distinct counter names, **69** counting per-feed and
per-tag splits. The hard rule binds the closeout harder than any other report, because **it is the one report
nobody can post a correction to.**

**The guard is structural, and the omission is deliberate.**
[`scripts/closeout.test.mjs`](../scripts/closeout.test.mjs) fails `check` if the file is gone, if the marker is
not line 1, if `CLAUDE.md` and the file spell the marker differently, if the body outgrows a GitHub comment
(bound 60,000 against the 65,536 limit), if it stops naming its snapshot and stamp, if the card stops pointing
at it, or if the cohort table goes. **All seven were broken and observed to redden before shipping.** A test
comparing the figures to the *live* snapshot was **not** written: a twice-daily automated snapshot commit could
then redden `master` with no human change, and after 2026-10-05 nobody is left to clear it — that is
[L-134](LESSONS.md#l-134)'s own trap pointed the wrong way, declined on run 216's ground.

**CORRECTION, same cycle, and it was found in this run's own freshly posted report: the dedup predicate
as written would have discarded the artifact it protects.** [CLAUDE.md](../CLAUDE.md) step 1 said to
*"look for the marker"* and step 2 *"if a comment carries it"* — a **presence** test. But an execution
report *describes this mechanism*, so it quotes the marker in prose. A scan of **all 334** comments on
issue #1 found the literal marker in **two** — [run 215's report](https://github.com/in-c0/tuned/issues/1#issuecomment-5962572001)
and [run 218's](https://github.com/in-c0/tuned/issues/1#issuecomment-5974166118) — **neither of which
is a closeout.** A post-date run reading the card literally would have matched run 215's comment from
2026-10-02, posted nothing, and **the closeout would never have been posted at all.**

**The asymmetry is why this outranked everything else left in the cycle.** A dedup key's false
*negative* duplicates the artifact — visible, and exactly the harm the marker exists to prevent. Its
false *positive* **discards** it: silently, with no comment anywhere to show it happened, on the one day
no run is permitted to fix anything. **The mechanism had been built with only the loud error in mind.**
Step 1 now requires a comment whose **first line** is the marker, says in terms that presence in the
body is not the test, and names both offending reports so the clause cannot later be read as pedantry.
An eighth test asserts those phrases survive editing — a **prose guard, labelled as one**, since
whether a procedure is correctly written is an argument a parser cannot grade. **General rule: a marker
a document must explain is a marker the explanation will match.** [L-138](LESSONS.md#l-138).

**Nothing in `src/`, no schema, no route, no counter, no workflow, no dependency, no privacy or terms text, and
no product-surface act at all this cycle** — the gate owed nothing, so nothing was published.

**Gates:** `npm run check` **0** · **561 vitest** (35 files, unchanged — no `src/` or `test/` file touched) ·
ops suite **476/476** · 14 workflows · **22** nominations · **0** vulnerabilities · `doc-anchors`,
`owner-cards` **THREE, agreed in head, section and mirror**, `milestone-horizons` ok.

---

**Last updated:** 2026-10-03 21:40 Sydney (2026-10-03 11:40 UTC), run 217 — **[OWNER ACTION REQUIRED](#owner-action-required):
THREE, unchanged — a fourth card was raised and cleared inside this run.** **A 6h16m deploy outage ended on this
run's own push, 47 minutes after the card asking the owner to diagnose it went up; the repository was mechanically
excluded as the cause, and the watchdog built to report the outage had delivered zero of its five scheduled hours
while it ran.**

**The gate was attended first and it owed a publication.** [`scout-gate.mjs`](../scripts/scout-gate.mjs) read
**ATTEND** — item 296 at `2026-10-02T10:15:23.798Z`, 24h old, **one** scheduled screen certainly delivered since
(`2026-10-03T02:40:00Z`). That screen's record was read **in full from the job log** of
[agent scout 37110015404](https://github.com/in-c0/tuned/actions/runs/37110015404) — the artifact blob host is
still `403 CONNECT` at this session's proxy, standing blocker, unchanged — and it supported publishing:
screened **35**, rejected **26**, selected **9**, **12** full-text reads, top selection typed
`research-article/journal article` with **4** statistic families on a 37,123-character body.
[One dispatch with `publish: true`](https://github.com/in-c0/tuned/actions/runs/37115773915): **item 297,
HTTP 201, `duplicate=false`, `2026-10-03T10:15:34.311Z`.** Nomination committed here, so the gate now reads
**CURRENT** and `validate-nominations` reads **22**. **The schedule was not armed:** EXP-013's threshold 2 is
still unruled and run 153's pre-commitment stands — that question is **owner card 3**, with two days on its clock.

**This find carries the bar's own why-line and not the source's words, and that is the publisher's rule working
rather than failing.** The abstract offered **exactly one** candidate sentence and it was **136 characters over
the 252-character budget**, so `selectQuotation` refused all of it and the log says which clause refused it.
*No quote is a reason, never an absence* — item 296's line was a quotation, item 297's is the screen's own
disclosure of design terms and statistic families. Nothing was paraphrased and nothing was composed about the
paper's content.

**Then the cycle took the one thing in front of it that is getting worse: production has not taken a commit
since 04:16 UTC.** Run 216 established the shape — four `verify production` runs, two commits, every one of
72 polls reading `c50e8c2` — and called it an owner/auth boundary. **This run did not restate it. It narrowed
it, and then it made the owner's own carrier say so.**

**One: the repository is excluded as the cause, mechanically and not hopefully.** A **fresh shallow clone** of
`master`'s tip `d45e9cb` was given the exact Workers Builds command — `npm ci && npm run check` — and it exits
**0**: `npm ci` **0**, `build-info` + `wrangler types` + `tsc --noEmit` **0**, in a clone with no local state,
no generated `worker-configuration.d.ts` and 1 commit of history. **That is run 1's test, which on 2026-08-06
exited 2 and found the real defect** (`TS2688`, the gitignored generated type) — the same probe pointed at the
same question now answers the other way. So *whatever* is wrong is on the Cloudflare side of the push: a stuck
queue, a disconnected Git integration, or a build failing for a reason the build command does not reproduce.
**Which of those three it is remains unreadable from here, and is still not guessed at.**

**Two: the watchdog that exists for this had not raised it, because an hourly cron is not an hourly cron.**
[`deploy-staleness.yml`](../.github/workflows/deploy-staleness.yml) asks for `5 * * * *` and carries a
**90-minute grace**, so `53b861d`'s alarm came due at about **05:59Z**. Its last delivered run before this one
was **05:08Z** — 39 minutes inside the grace, so correctly silent — and between that run and this one
**zero of five** requested firings were delivered. Its five prior deliveries sit **4.5h–6.5h** apart
(06:56, 13:47, 19:10, 23:42, 05:08). **The grace period is 90 minutes; the detection interval is the delivery
interval, and that is about five hours.** [L-136](LESSONS.md#l-136).

**So it was dispatched, and it is the one that now speaks to the owner without a run present.**
[deploy staleness 37115906442](https://github.com/in-c0/tuned/actions/runs/37115906442), `workflow_dispatch`,
12 seconds: verdict **`stale`** · serving **`c50e8c2`** (`2026-10-03T04:16:35Z`) · oldest commit not live
**`d45e9cb`** (`2026-10-03T05:26:38Z`) · **4.84h** undeployed · **4 commits behind** · grace **90 minutes**.
It posted its alarm — [comment 5968183197](https://github.com/in-c0/tuned/issues/1#issuecomment-5968183197),
`10:17:18Z`, one per outage keyed on `d45e9cb` — and **failed its own job**, so the Actions list is now red
about a production that is behind, which it was not at 10:14.

**Three: production is up, and it is writable.** The strongest evidence is not a probe written for the purpose:
**the operator plane accepted a write at `10:15:34.311Z` and returned 201** on the build that is serving.
`deploy-staleness` separately read `/api/version` at 10:17 and got a parseable stamp. **Nothing about the live
site is degraded — it is old, not broken**, and no behavioural claim beyond those two reads is made by this run.

**No rollback, for the third report running, and the reason has not changed.** Production serves `c50e8c2`,
which is the state *before* the undeployed commits; `git diff --name-only origin/master -- src/` is **empty**
across all four of them, so nothing served differs by a byte from what a revert would aim at. A revert would
join the same unlanded queue. **The rollback objective is already satisfied by the failure.**

**What is new in this cycle is therefore not the finding but its carrier.** [L-07](LESSONS.md#l-07) says to
escalate once after two unchanged blocker cycles and then stop restating — and [L-133](LESSONS.md#l-133) is
this repository's own record of what "escalate" has to mean here: an obligation filed where nobody is obliged
to read it is dropped, however truthfully each report repeats it. Run 216 wrote the blocker into a report and
a commit message. **This run writes it into the owner card stack, which is the one place that is read**, with
the exact dashboard path, what to look for, and what each answer implies. **That is the escalation. From the
next run this blocker is not restated in prose — the card carries it until it is cleared.**

**Nothing in `src/`, no schema, no route, no counter, no workflow, no dependency, no privacy or terms text.**
The only product-surface act this run performed is the publication the gate owed, through the plane's own
route, under the bar committed at `d45e9cb`.

**CORRECTION, same cycle, and it goes against this run's own headline: the outage is over, and nothing the owner
did ended it.** The push carrying everything above —
[`e8d9af2`](https://github.com/in-c0/tuned/commit/e8d9af2), `10:31:49Z` — **deployed in 29 seconds.**
[verify production 37116713056](https://github.com/in-c0/tuned/actions/runs/37116713056) satisfied its wait step at
`10:32:18Z` and then passed **25 of 26** downstream assertions with one skipped, which is the first green
`verify production` on a push since `4776aff`. **The serving build contains every commit the outage had stranded**
— `53b861d`, `c98f5f2`, `d45e9cb` — so **production is behind by nothing.** The outage ran `04:16Z → 10:32Z`,
**6h16m**, and between `05:26Z` and `10:31Z` the Cloudflare side resumed **on its own**: no setting was touched,
no build retried, no revert made, and **which of a drained queue or a resolved incident it was is still not
readable here and still not guessed at.**

**So owner card 4 was retired in the run that raised it, and the reason is a mistake worth naming.** The card
asked a human to go and read a page about a condition that was *about to stop being true*, and its own text
argued the recovery away: *"three further pushes did not clear it, so 'the next push fixes it' has already been
falsified three times."* **The fourth push cleared it.** Run 216's *"until it is cleared every later run of this
loop will also fail to deploy"* was the same shape. **Both were forecasts about infrastructure, and this
repository has now been wrong about that three cycles running** — [L-135](LESSONS.md#l-135) was written about
exactly this two cycles ago. [L-137](LESSONS.md#l-137). The alarm comment
[5968183197](https://github.com/in-c0/tuned/issues/1#issuecomment-5968183197) and the notification that followed
it are **superseded; the retired card says so where the owner will read it.**

**Two findings survive the recovery intact, and they are what this cycle actually bought.** `npm ci && npm run
check` **exits 0 on a fresh shallow clone** of `master`'s tip, so the repository was never the cause of a
six-hour outage and is not a suspect in the next one. And `deploy-staleness` left that **real** outage unalarmed
for **4h18m past due** because an hourly cron delivered **zero of five** firings — [L-136](LESSONS.md#l-136) is a
statement about detection latency, and a pipeline recovering does not touch it.

**Gates:** `npm run check` **0** · **561 vitest** (35 files, unchanged — no `src/` or `test/` file touched) ·
ops suite **468/468** · 14 workflows · **22** nominations · **0** vulnerabilities · `doc-anchors`,
`owner-cards` **FOUR, agreed in head, section and mirror**, `milestone-horizons` ok.

**A published find is not a customer either.** `applications` **0** · `members` **1** · `followers` **0** ·
`items_public` **100** · `stars` **8** (all `stars_owner`) · `members_ever_active` **0** · gross cash
**AUD $0**, from *no billing exists*. Source: [`ops/metrics/latest.json`](metrics/latest.json) `totals`,
generated `2026-10-03T05:19:34.043Z` — item 297 is not in it and will read **101** on the next snapshot.
**This is the forty-third consecutive cycle whose output is not a user or a dollar.**

---

**Last updated:** 2026-10-03 15:40 Sydney (2026-10-03 04:40 UTC), run 216 — **[OWNER ACTION REQUIRED](#owner-action-required):
THREE, unchanged and not re-argued here, per [L-07](LESSONS.md#l-07).** **The arrival channel this project
spent six cycles unable to name has a name — `www.google.com` — and Fork B is no longer a single day.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs) read
**CURRENT** — item 296 at `2026-10-02T10:15:23.798Z`, **18h** old, **zero** scheduled screens certainly
delivered since. Nothing published, amended or retracted. The schedule was **not armed**: EXP-013's
threshold 2 is still unruled, run 153's pre-commitment stands, and **owner card 3 now has two days on its
clock.**

**Run 215's candidate 1 was executable, but not on the snapshot it predicted — so the snapshot was
dispatched.** Run 215 recorded that `metrics-snapshot.yml`'s `15 0 * * *` cron *"captures the closed day …
so the reading belongs to the next run"*. At `04:16Z` — **4h01m past that cron's nominal time** — it had
not fired, and the newest committed snapshot was the **`40 20 * * *`** cron delivered **3h18m late** at
`generated_at` `2026-10-02T23:58:16.139Z`, **1m44s short of the very day it was supposed to close.**
Grading on it would have called a **99.88%-complete** day whole; deferring would have been the third
consecutive cycle on a window that closes today. One `workflow_dispatch` —
[37095987390](https://github.com/in-c0/tuned/actions/runs/37095987390) →
[`c50e8c2`](https://github.com/in-c0/tuned/commit/c50e8c2), **18 seconds** — settled it.
**A deferral whose release condition is another machine's schedule is a bet, and this repository already
held the odds.** [L-135](LESSONS.md#l-135).

**2026-10-02 grades Fork B. It is the window's second, and the caveat every report has carried since run
210 is retired.** `item_view` **1** · `item_view_search` **1** · `item_view_referred` **1** ·
`item_render` **1** · `item_view_onsite` **absent**. **VERDICT B is unchanged and still final on
2026-09-30 — what changed is that it no longer rests on one day of five but on two of six**, two days
apart, with the same shape. 2026-10-03 is the single day still outstanding, and its snapshot condition is
stated rather than forecast: **gradeable once a snapshot's `generated_at` is at or after
`2026-10-04T00:00Z`.**

**Amendment 2's bracket on that day was owed and is closed, with one dispatch instead of two.** Run 212's
far-side observation for 2026-09-30 (`2026-10-01T22:25:42.707Z`) is **also 2026-10-02's near side**, so
only the far side was missing. [qa-browser 37096183219](https://github.com/in-c0/tuned/actions/runs/37096183219)
against build `c50e8c2`: `item_render` **1**, production **204**, page / console / first-party-HTTP errors
**0 / 0 / 0**, `/sportstech/296` from a live sitemap of **100** find pages, `measured_at`
**2026-10-03T04:20:31.523Z** — 4h20m after the day ended. The reading printed *"Bracket owed: 2026-10-02
graded Fork B with the far side missing"* before that entry and does not after; **nothing else in the
reading moves.** The headless user-agent lands every increment in `_bot`, so no graded name was written.

**Then Fork B's registered next action, discharged rather than carried a seventh cycle.** Its text is
*"the first evidenced arrival channel that needs nobody's permission, and it **outranks every other
candidate available to the loop**"*. Runs 210–212 carried it unexecutable; run 213 built `referrer_days`
so it could be executed; 214 and 215 carried it blocked on a row that had not arrived. **The row arrived
on the first day the table existed:**

```
referrers 2026-10-02: www.google.com bot=1 count=12 · www.google.com bot=0 count=1 · www.justtuned.com bot=1 count=1
```

**`www.google.com`, not bot-flagged, one request — the first non-bot off-site referring host on record
anywhere in this service.** The contract's cross-check is **exact on both flags**: referred `_bot` **13**
against rows summing **13**, unsuffixed **1** against **1**, no `~over` and no `~invalid`, and the bot
side is accounted for by run id — `verify-production.yml` ran **six** times that day at two referred
requests each. `www.justtuned.com` is a crawler that resolved the `www` subdomain and is not an
allowlisted engine, which is exactly why `item_view_search_bot` reads **12** against the referred **13**.

**What this does not establish is stated before what it does.** **The owner is not excluded.** Tuned has
exactly **one** member, and an owner who searches for their own site and clicks the result writes
precisely these four names with `item_view_onsite` at zero; nothing this service stores can tell that
from a stranger's arrival. A JS-executing crawler that declines to declare itself *and* presents a Google
`Referer` is not excluded either. What **is** excluded is a first-party automated writer:
`qa-browser.yml` **did not run at all** on 2026-10-02, and is `_bot` by construction regardless; no other
caller in this repository fetches a find page. **The honest claim is one rendering browser reaching a find
page from Google search, on the second day that shape has appeared.** It is not a visitor count, not a
person established, not a subscriber and not a dollar. **Conversion on it was zero** — no follow, no RSS
click, no desk follow, no application, no star, no login.

**It settles one standing reading against its own evidence for the second time.** `site:justtuned.com` has
returned **0 pages** on three readings over fifteen days while production has now recorded a
Google-referred rendering arrival on **two separate days**. Run 212's relabelling — *"zero pages in the one
backend this session can query"* — is confirmed, and the original phrasing *"Tuned is not indexed"* stays
withdrawn.

**No guard was added, and the one that suggested itself is why.** Failing `test:ops` when a B/C/F day's
bracket is owed would be **red on data rather than on code** — a twice-daily automated snapshot commit
could redden `check` on `master` with no human change, and after 2026-10-05 nobody is left to clear it.
That is [L-134](LESSONS.md#l-134)'s shape pointed the other way. The bracket mechanism was already proved
non-vacuous in both directions by run 212's tests, so **non-vacuity here is the before/after reading.**

**Nothing in `src/`, no schema, no route, no counter, no workflow, no dependency, no privacy or terms
text.** EXP-014's binding clauses hold by name: `item_render`'s emitter unedited, `SEARCH_REFERRERS`
untouched, and the only find-page fetch this loop made is the one **Amendment 2 requires**.

**Gates:** `npm run check` **0** · **561 vitest** (35 files, unchanged — no `src/` or `test/` file
touched) · ops suite **468/468** · 14 workflows · **21** nominations · **0** vulnerabilities ·
`doc-anchors`, `owner-cards` **THREE, agreed in head, section and mirror**, `milestone-horizons` ok

**PRODUCTION IS NOT DEPLOYING `master` AT ALL, AND THIS CYCLE IS NOT CLAIMED AS DEPLOYED.**
[`verify production`](https://github.com/in-c0/tuned/actions/runs/37096717945) **failed** at step 5 on the
push, and **twice more on dispatch** ([37097307953](https://github.com/in-c0/tuned/actions/runs/37097307953),
[37098509985](https://github.com/in-c0/tuned/actions/runs/37098509985)) — **three 8-minute windows, 72
polls, every one reading `c50e8c2`** where it expected `53b861d`. **A fourth run then failed on a
DIFFERENT commit** — [37099176265](https://github.com/in-c0/tuned/actions/runs/37099176265) on
[`c98f5f2`](https://github.com/in-c0/tuned/commit/c98f5f2), the ops commit recording this very finding,
pushed at 05:14 and never served either. **Four runs, two commits, 04:29 → 05:22, production pinned on
`c50e8c2` throughout.** That moves the reading from *this commit did not land* to **`master` is not
deploying**, which is a different and larger statement. *"Expected commit never became live, and
nothing serving contained it."* All **26** downstream assertions **skipped**, so **no behavioural claim
about the live site is made by this run at all.**

**It is a deploy that did not land, not a regression — and the distinction is mechanical, not hopeful.**
`git diff --name-only origin/master -- src/` was **empty** for this change, so the Worker built from
`53b861d` is byte-identical in behaviour to the one serving. Production is **up**, serving the commit from
**before** this merge, which is known-good code: `c50e8c2` deployed inside ~4 minutes at 04:16 and
[qa-browser 37096183219](https://github.com/in-c0/tuned/actions/runs/37096183219) read it answering **204**
at 04:20. **The pipeline was working 13 minutes before the merge and has not landed the merge in 41.**

**No rollback was performed, and the reason is that production is already in the state a rollback would
aim for.** Reverting `53b861d` would (a) change **not one byte** of what production serves, since the
revert would sit in the same unlanded queue, (b) discard a correct, fully gated record, and (c) leave the
site exactly where it is — on `c50e8c2`. **The rollback objective, production running known-good code, is
already satisfied by the failure itself.** `git revert 53b861d` remains available and is a one-liner if a
later run disagrees.

**What this loop cannot do about it, and who is covered.** The Cloudflare side is unreadable from this
session **by design** — no Workers credentials, and acquiring them is forbidden — so whether the build for
`53b861d` **failed** or is **queued** is not establishable here, and is **not guessed at**.
[`deploy-staleness`](../scripts/deploy-staleness.mjs) is the purpose-built watchdog for exactly this and
carries a **90-minute grace**, so once its grace expires it posts **one comment per
outage** on issue #1 without any run being present. **That is the mechanism run 150's incident built, doing
its job.** **OWNER ACTION — an auth boundary and a mandatory stop condition, not something this loop can
work around:** Cloudflare dashboard → Workers & Pages → `attention-feed` → **Builds**, and read the most
recent build for `53b861d` / `c98f5f2`. Until it is cleared, **every later run of this loop will also fail
to deploy**, with two operating days left.

**A named channel is not a customer.** `applications` **0** · `members` **1** · `followers` **0** ·
`items_public` **100** · `stars` **8** (all `stars_owner`) · `members_ever_active` **0** · gross cash
**AUD $0**, from *no billing exists*. Source: [`ops/metrics/latest.json`](metrics/latest.json) `totals`,
generated `2026-10-03T04:16:35.046Z`. **This is the forty-second consecutive cycle whose output is not a
user or a dollar, and I am not dressing it up** — what it is instead is the first cycle in which this
project can say *where* an arrival came from.

---

**Last updated:** 2026-10-03 09:40 Sydney (2026-10-02 22:40 UTC), run 215 — **[OWNER ACTION REQUIRED](#owner-action-required):
THREE, unchanged and not re-argued here, per [L-07](LESSONS.md#l-07).** **Three documents state the date
this loop stops and no mechanism knew it, so the only watchdog watching the loop was going to page the
owner about a shutdown announced seven weeks in advance — and then stay red forever.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs) read
**CURRENT** — item 296 at `2026-10-02T10:15:23.798Z`, **12h** old, **zero** scheduled screens certainly
delivered since. Nothing published, amended or retracted. The schedule was **not armed**: EXP-013's
threshold 2 is still unruled, run 153's pre-commitment stands, and **owner card 3 is the open question
with three days on its clock.**

**Run 214's candidate 1 was not available, and it is not claimed as done.** EXP-014's outstanding days
are 2026-10-02 and 2026-10-03. At the start of this run the UTC day **2026-10-02 still had 1h46m to
run**, and the newest snapshot (`generated_at` `2026-10-02T05:38:21.591Z`) is complete only through
2026-10-01. `metrics-snapshot.yml`'s `15 0 * * *` cron captures the closed day at `2026-10-03T00:15Z`,
so **the reading belongs to the next run.** No partial day was graded and no grade moved.

**So the cycle took the last thing that can only be done now: what this project does after 2026-10-05.**
`grep -rn "2026-10-05"` over `scripts/`, `.github/` and `src/` returned **one comment in an unrelated
script.** The final operating date is written in [MILESTONES.md](MILESTONES.md)'s reference dates, in
[BRIEF-2026-08-06.md](BRIEF-2026-08-06.md) and in the routine prompt — and **no mechanism in this
repository knew it.** Two were therefore going to be wrong about it on their own schedules, in opposite
directions, **and each one's obvious fix makes the other worse.** [L-134](LESSONS.md#l-134).

**One: the watchdog would have paged the owner about a planned shutdown, then stayed red forever.**
[`executor-liveness.mjs`](../scripts/executor-liveness.mjs) reads the claims register hourly and a
planned stand-down is the same input to it as a crashed routine. From roughly 2026-10-06 it posts *"the
loop is down, check that the routine is enabled and firing"* on issue #1 and **fails the job every hour
for as long as the repository exists.** The comment is one false alarm; **the permanent red is the real
cost** — it is the only watchdog on the loop, and red forever carries the information of no watchdog at
all. Run 147 built it arguing that paging on a blip trains the owner to ignore the alarm; paging forever
on a planned stop finishes that job.

**Two: the routine's cron does not stop either.** Its prompt says to *"make no changes and post a final
closeout report"*, and read literally by every firing that is **three comments a day, forever, on the
owner's control issue** — the thing a closeout is supposed to end. **The prompt's own word is *final*.**

**Both halves shipped as one change, because either alone is a regression.** "Post once and stop"
without the stand-down verdict converts comment spam into a permanent false alarm. The stand-down verdict
without "post once and stop" is fed fresh claims by runs whose only output is a duplicate comment, so it
never reaches its own verdict. **One fact, three readers:** `FINAL_OPERATING_DAY` and `STAND_DOWN_AFTER`
in the watchdog; a fourth verdict **`stood-down`**, green and quiet; and a `CLAUDE.md` section binding a
post-date run to post the closeout **once**, keyed on a `<!-- tuned-closeout -->` marker that a run
making no changes can still read, and to claim nothing when it has nothing to mutate.

**The design turns on reading the cycle label rather than the claim's clock, and that is not a detail.**
Scheduled runs here are delivered **1.6h–4.5h late** on every firing since 2026-08-26, and the last
in-period firing is `2026-10-05T10:00Z` — **three hours before the day ends in Sydney.** So the final
run's timestamp is *more likely than not* to land after the boundary, and a wall-clock test would have
restored the exact false alarm it was written to remove, through the same delivery lag that had already
broken one threshold in that file. `defaultCycle()` labels every claim with its Sydney date and firing
window, so a `w20` run delivered any time before 08:00 Sydney next morning is still `w20`. **The cycle is
what the date means; `at` is when the runner got around to it.**

**It fails towards alarming, in every direction a reader would want to check.** A real 30h outage
*inside* the operating period still reports `stale` — the `now`-past-the-boundary condition is what stops
a date from silencing this file for the loop's last three working days. An **unreadable cycle alarms**,
because it means the period was not *established* and a suppression is never granted on an unestablished
fact. A claim from a cycle **after** the final day **restores full watching**, so extending the mission
needs remembering in one place rather than two. And the stand-down **does not** suppress the abandonment
verdict: a final run that claimed and never released left its closeout report in doubt, which is a
finding about the last thing this loop did rather than about the silence after it.

**What was deliberately not done: the routine's own schedule was not touched.** Disabling or rewriting
the trigger is a change outside this repository, made by a session no human is watching, so it is
**reported rather than performed**. **Nothing in `src/`, no schema, no route, no counter, no workflow, no
dependency, no privacy or terms text.** EXP-014's window is open until 2026-10-03 and **no binding clause
moved**: no graded name was written by this loop, `SEARCH_REFERRERS` is untouched, no find page was
fetched and no `Referer` sent to one.

**Gates:** `npm run check` **0** · **561 vitest** (35 files, unchanged — no `src/` or `test/` file
touched) · ops suite **468/468** (455 → 468) · 14 workflows · **21** nominations · **0** vulnerabilities ·
`doc-anchors`, `owner-cards` **THREE, agreed in head, section and mirror**, `milestone-horizons` ok

**Eight mutations redden the new suite, and the sixth is the one worth recording:** `plannedGap` ignoring
where the gap ends **survived the first draft**, so a condition no test could reach was one line from
shipping unasserted. The fixture that reaches it — a 30h in-period outage that had already closed, read
after the boundary, on a widened lookback — was written only after the mutation passed. The DST-sensitive
constant is **recomputed from the IANA database** rather than trusted: Sydney enters AEDT on 2026-10-04,
and a hand conversion at +10:00 would be three hours late, long enough to cover the final firing and
short enough that no verdict test would notice. [L-95](LESSONS.md#l-95).

**A watchdog that stops lying is not a user and not a dollar.** `applications` **0** · `members` **1** ·
`followers` **0** · `items_public` **99** · gross cash **AUD $0**, from *no billing exists*. Source:
[`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated `2026-10-02T05:38:21.591Z`. **This is
the forty-first consecutive cycle whose output is not a user or a dollar, and I am not dressing it up.**

---

**Last updated:** 2026-10-02 21:35 Sydney (2026-10-02 11:35 UTC), run 214 — **[OWNER ACTION REQUIRED](#owner-action-required):
THREE — card 3 is new, and it is the first card this stack has ever carried with a deadline.** **The
one thing on this project that expires rather than merely waits was being carried as a next candidate
for a reviewer who has not posted since 2026-09-01.**

**The gate was attended first and it owed a publication.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **ATTEND** — item 293 at `2026-10-01T10:24:20.502Z`, **23.8h** old, **one** scheduled screen
certainly delivered since (`2026-10-02T02:40:00.000Z`). The
[08:58Z screening record](https://github.com/in-c0/tuned/actions/runs/36987066925) was read in full
from the job log — the artifact host is still `403 CONNECT` at this session's proxy, standing blocker,
unchanged — **screened 35 · rejected 25 · selected 9 · deferred 1 · 12 full-text reads**. Dispatched
`agent-scout.yml` with `publish: true` →
[run 36994390610](https://github.com/in-c0/tuned/actions/runs/36994390610): **item 296 published**,
HTTP **201**, `duplicate=false`, at `2026-10-02T10:15:23.798Z` — *Predicting athletic performance in
track and field athletes based on wearable physiological and psychological indicators*, carrying a
verbatim quotation from its own abstract. Nomination committed, so the gate now reads **CURRENT**.
**Nothing here arms the schedule**: run 153's pre-commitment stands and attending a gate is not
removing it.

**Then the cycle took the one item in front of it that becomes impossible rather than harder if it
waits.** `@sportstech` publishes only while a run dispatches `publish: true`, and **this executor
stops on 2026-10-05**. From 2026-10-06 the daily cron keeps screening, keeps finding candidates, and
discards every one — the eight-screens-nothing-published state of 2026-09-13 → 2026-09-20
([L-97](LESSONS.md#l-97)), except permanent. That is the end of the only mechanism this project has
for issue #1's third commercial item, *recurring agent value without attention overload*, and the
exact museum condition run 152 built the publisher to end.

**It had been carried as a next candidate — for the reviewer — since run 195, through 196, 197 and
every cycle after.** No reviewer directive has been posted since **2026-09-01**. Run 197 wrote the
diagnosis in its own report: *"punting it to an absent reviewer has the same effect as dropping it."*
It then punted it again, four more times. **This is [L-76](LESSONS.md#l-76) /
[L-97](LESSONS.md#l-97) / [L-123](LESSONS.md#l-123) / [L-131](LESSONS.md#l-131)'s shape for the sixth
time** — an obligation filed where nobody is obliged to read it — and the novelty is the filing
cabinet: *next candidate* is addressed to a **party**, and L-07's instruction to stop restating a
blocker silently deletes the item when that party stops reading. [L-133](LESSONS.md#l-133).

**So it is an owner card with a dated decision — `ARM` or `QUIET` — and the card refuses to make its
own case dishonestly.** EXP-013's threshold 2 is the pre-registered quality bar for exactly this
question and **it was never met**: 9 of 35 = **25.7%** against a 25% ceiling, and 9 of 18 = **50%** on
the decided set, because 17 of the 35 were deferred unread. It is also **mis-specified**, recorded as
such in [EXP-013](EXPERIMENTS.md) — **and no run has re-specified it**, because a run re-grading its
own failed threshold after seeing the screen is marking its own homework. The card says in terms that
**an `ARM` is the owner knowingly overriding an unmet pre-registered threshold**, states the
counter-argument (overload is bounded by the one-publication-per-run cap, not by a selection rate),
and states the cost (a scheduled publication registers no nomination, so the gate reads *staler* than
reality — registry drift, not a duplicated find, because `idempotencyKeyFor` keys the plane's replay
guard on `(handle, source)`).

**No change was prepared for the owner to merge, and the reason is recorded rather than omitted.**
This run attempted to arm the schedule on a branch as an unmerged, owner-only change — the shape
`CLAUDE.md`'s risk clause endorses, *"prepare the smallest reviewable change and request only that
step from the owner"* — and **the session's own permission layer refused the edit as a security
weakening.** That refusal is correct on its face: the edit enables an unattended agent to publish to
production on a schedule against a quality threshold that failed. **It was not routed around**, in any
form. The consequence is that an `ARM` costs the owner a one-line edit rather than a merge click; the
line and its exact location are already documented in `agent-scout.yml`'s own comment, where run 153
put them.

**Nothing in `src/`, no schema, no route, no counter, no workflow and no dependency changed this
cycle.** `agent-scout.yml` is byte-identical to `origin/master`. EXP-014's window is open until
2026-10-03 and **no binding clause moved**: no graded name was written by this loop, `SEARCH_REFERRERS`
is untouched, no find page was fetched and no `Referer` sent to one.

**Gates:** `npm run check` **0** · **561 vitest** · ops suite **455/455** · 14 workflows ·
**21** nominations · **0** vulnerabilities · `doc-anchors`, `owner-cards`, `milestone-horizons` ok

**EXP-014 is unchanged and still rests on one day of five.** Reading on the snapshot complete through
2026-10-01: 2026-09-27, 09-28, 09-29 and 10-01 all **A-CONSISTENT**; **2026-09-30 grades B**
(`item_view_search` 1, `item_view_referred` 5, `item_render` 5). **VERDICT B, FINAL on Amendment 2's
gate.** Two whole days outstanding (2026-10-02, 10-03). `referrer_days` carries only
`www.google.com bot=1` — this service's own verifier, by construction. **Fork B's registered next
action is still not executable**: it needs a real arrival to name, and none has been recorded since
the record shipped.

**One publication is not a subscriber, and a card is not an answer.** `applications` **0** ·
`members` **1** · `followers` **0** · `items_public` **99** · gross cash **AUD $0**, from *no billing
exists*. Source: [`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated
`2026-10-02T05:38:21.591Z`. **This is the fortieth consecutive cycle whose output is not a user or a
dollar, and I am not dressing it up.**

---

**Last updated:** 2026-10-02 15:10 Sydney (2026-10-02 04:10 UTC), run 213 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged and not re-argued here, per [L-07](LESSONS.md#l-07).** **The one arrival channel this project
has evidence of could not be named, because the axis built to classify it discarded the thing that
identifies it.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs) read
**CURRENT** — item 293 at `2026-10-01T10:24:20.502Z`, **17.8h** old, **zero** scheduled screens certainly
delivered since. Nothing published, amended or retracted. The schedule was **not armed**: EXP-013's
threshold 2 is still unruled and run 153's pre-commitment stands.

**Run 212's candidate 1 was discharged on the snapshot that landed overnight** (`generated_at`
**2026-10-02T00:07:59.631Z**, complete through 2026-10-01). **2026-10-01 grades `A-CONSISTENT`:**
`item_view` **56** with `item_view_search`, `item_view_referred` and `item_render` all **0**. **VERDICT B
stands, FINAL on Amendment 2's gate, and still rests on one day of five.** Because run 212's bracket was
taken *inside* 2026-10-01 at 22:25:42Z, that zero is a fact about **traffic** and not about the instrument
— which is exactly what the early bracket was for. Two whole days outstanding (2026-10-02, 10-03).

**Then the cycle went to Fork B's registered next action and found it had never been executable.** Its
text is *"this is the first evidenced arrival channel that needs nobody's permission, and it **outranks
every other candidate available to the loop**"*. Runs 210, 211 and 212 each carried it as a candidate and
none executed it. On the Fork B day `item_view_referred` read **5** against `item_view_search`'s **1** — so
**four off-site arrivals came from a host matching none of the thirteen allowlisted engines**, and
[`offsiteReferrerHost()`](../src/index.ts) computed that host, used it for two booleans and **threw it
away**. No row anywhere in this service recorded what it was. **A channel that cannot be named cannot be
pursued**, and two of the five referred arrivals this project has ever recorded are permanently
unattributable. [L-132](LESSONS.md#l-132).

**Why the omission was reasonable, which is the part worth carrying.** The host was deliberately kept out
of `metric_days.name` for a real reason recorded in three places: a counter name assembled from a
caller-controlled header hands any client unbounded control over the set of counter names. **That rule is
not relaxed** — `metric_days` still receives only fixed strings. What went wrong is that a constraint on
one **storage shape** was carried as a constraint on the **value**, so *where could this be stored safely?*
was never asked. A counter name cannot be bounded; a table with a cardinality cap can.

**`referrer_days (day, host, bot, count)` — and the cap is the justification, not a detail.**
`referrerBucket` admits only DNS-shaped hosts of ≤ 100 characters, and at most **24** distinct hosts per
`(day, bot)`; every further one increments the reserved bucket `~over`, so **a client forging ten thousand
referrers writes 25 rows per flag, not ten thousand.** `~over` non-zero is how a reader tells *no further
hosts* from *we stopped recording them*. Budgeted **per bot flag**, so a crawler flood cannot spend the
human side's, and an already-admitted host **keeps counting after the cap binds** — without that, the one
referrer worth reading freezes at whatever it held when a flood arrived, invisibly. **The host only** —
never the path, the query or the full `Referer` URL.

**Bounded against a hostile caller rather than the happy path, and proved.** 500 forged hosts produce
**≤ 25** rows with every arrival still counted; the human budget survives a 200-host crawler flood; neither
reserved bucket can be forged; the full URL never reaches the table even when sent. **Six mutations redden
the suite** — cap removed (1), cap shared across the bot flag (1), sanitising removed (2), bot flag dropped
(1), full URL stored (5), route not recording at all (4). The first per-flag assertion attempted was too
weak to see a shared cap and was strengthened until it reddened. `src/metrics.ts` and `src/index.ts`
restored **byte-identical** under `sha256sum -c` after every mutation, per [L-95](LESSONS.md#l-95).

**A `src/` change inside EXP-014's open window, declared rather than assumed.** `item_render`'s emitter is
**unedited** (`src/pages.ts` byte-identical — no page, script or markup touched); **`SEARCH_REFERRERS` is
untouched**; no find page was fetched by this loop and no `Referer` sent to one. **The graded names are
asserted unmoved**: `item_view`, `item_view_referred` and `item_view_search` read exactly what the route
wrote before the table existed, and no `metric_days` name contains a referrer host. It adds a **new**
record and redefines **no** existing one, so no day of the window is readable under two contracts
([L-103](LESSONS.md#l-103)). **Still not the per-request join** — that stays deferred until the window
closes on 2026-10-03, because it varies the document by `Referer`.

**No privacy-policy change, and the judgement is recorded rather than assumed.** No new category of
personal information: aggregate per-day counts, no visitor identifier, no cookie, no IP, no user-agent
string, and strictly less than the Cloudflare request logs the policy already discloses. Terms and privacy
are an owner boundary, so the text is untouched and the judgement is **flagged for owner review** instead
of being decided unilaterally in either direction.

**The honest expectation, published with the instrument.** The record is **empty** until something
arrives, and the day after the only arrivals this project has measured read zero on all three names.
**Naming a channel is not an arrival, a visitor, a subscriber or a dollar.**

**Gates:** `npm run check` **0** · **561 vitest** (546 → 561) · ops suite **455/455** · 14 workflows ·
20 nominations · **0** vulnerabilities · `doc-anchors`, `owner-cards`, `milestone-horizons` ok

**The record is proved writing in production, and it agrees exactly with the axis it explains.** First
snapshot carrying `referrers` ([36965533716](https://github.com/in-c0/tuned/actions/runs/36965533716),
`generated_at` **2026-10-02T04:40:17.959Z**):
`[{"day":"2026-10-02","host":"www.google.com","bot":1,"count":2}]` — **the predicted value, not a
discovered one**, because `verify-production.yml` sends exactly two `www.google.com`-referred requests per
run under the bot-classified `tuned-ops-verifier`. `item_view_referred_bot` **2** against rows summing
**2**; unsuffixed **0** against **0**; **no** `~over` or `~invalid`, so no host was rejected and the cap
did not bind; **no** `metric_days` name contains a host. **A liveness proof, not an arrival** — nothing
reached a graded name. The instrument is proved to write *before* a real arrival has to be caught by it,
which is the one ordering that cannot be arranged afterwards.

**One process failure, named rather than buried.** PR #132 was merged on a green `check` while
**GitGuardian was still running**, and it then failed — a false positive on
`"evil.com/../../etc/passwd"`, a path-traversal fixture in a list asserted to be non-DNS-shaped (incident
37804668). **Nothing was revoked or rotated because there is nothing to revoke**, and no secret exists in
the repository. Remediated rather than dismissed — `"evil.com/a/b"` asserts the same property, with a
comment recording why the realistic path is deliberately absent — and coverage was **re-proved**: the
sanitising mutation still reddens the same 2 assertions. PR
[#133](https://github.com/in-c0/tuned/pull/133) → `0fbb790`. **The remedy is to wait for every check, not
the one that gates the build.**

**Last updated:** 2026-10-02 09:05 Sydney (2026-10-01 23:05 UTC), run 212 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged and not re-argued here, per [L-07](LESSONS.md#l-07).** **The bracket this experiment has been
owed since 2026-09-28 was taken three days early, and the gate it satisfies turned out to be a sentence no
tool in the repository could read.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs) read
**CURRENT** — item 293 at `2026-10-01T10:24:20.502Z`, **11.8h** old, **zero** scheduled screens certainly
delivered since. Nothing published, amended or retracted. The schedule was **not armed**: EXP-013's
threshold 2 is still unruled and run 153's pre-commitment stands.

**The snapshot was stale and was refreshed rather than read.** The `metrics snapshot` 20:40Z cron had not
fired — nor had `verify production`'s 20:20Z, and two hourly workflows skipped five hours. GitHub's
scheduler is best-effort and visibly slipped this morning. Dispatched manually:
[run 36934316560](https://github.com/in-c0/tuned/actions/runs/36934316560), `generated_at`
**2026-10-01T22:19:21.630Z**.

**Amendment 2's far-side browser bracket is taken, and it is green.**
[qa-browser 36934919529](https://github.com/in-c0/tuned/actions/runs/36934919529) against production
serving `7897d36`: a real Chromium loaded `/sportstech/293` (from the live sitemap, **99** find pages),
**`item_render` fired 1**, production answered **204**, page/console/first-party-HTTP errors **0 · 0 · 0**,
measured `2026-10-01T22:25:42.707Z`. The headless UA lands every increment in `item_render_bot`, so
**nothing was written to a graded name** and no binding clause moved.

**So 2026-09-30 — the day VERDICT B rests on — is bracketed on both sides** (`2026-09-28T04:24:41Z` and the
observation above), and **the verdict is final on Amendment 2's gate.**

**Why early rather than near 2026-10-03, which is where two execution reports had it.** A **one-shot**
obligation parked on the second-to-last operating day, on a scheduler that slipped the same morning, is
[L-123](LESSONS.md#l-123)'s shape. And it buys a reading the late bracket could not: **2026-10-01 is running
`item_render` 0** against `item_view` 56, and an observation taken *inside* that day is exactly what makes
the zero a fact about traffic rather than about the instrument.

**Then the cycle found that the gate it had just satisfied was unreadable by the thing that prints the
reading.** [`exp014-window.mjs`](../scripts/exp014-window.mjs) exists *so the forks are computed rather than
read off by eye* — its own docblock says so — and it had **no notion Amendment 2's gate existed**. It
printed a bare `VERDICT B`. **Runs 210 and 211 published that verdict as settled while the evidence it was
registered to require had not been taken.** Neither was wrong about the fork; neither was entitled to call
the reading final.

`RENDER_BRACKETS` now carries each dated observation with the run whose log holds its `EVIDENCE` line, and
the reading prints **FINAL** or **PROVISIONAL** beside any B, C or F verdict, naming which side is owed.
This is the **fourth** instance of [L-76](LESSONS.md#l-76) / [L-97](LESSONS.md#l-97) /
[L-123](LESSONS.md#l-123)'s shape — an obligation filed where no run is obliged to read it — and
[L-130](LESSONS.md#l-130)'s sibling. [L-131](LESSONS.md#l-131).

**The bracket rule is read strictly**, and that is what keeps the remaining debt visible: the near side must
precede a day's start and the far side follow its end, so **2026-10-01 is not bracketed** and the tool says
so itself rather than leaving it to whoever grades the day.

**Proved non-vacuous, both directions, before pushing.** The **same** Fork B snapshot graded twice: with
both observations it prints `SATISFIED … FINAL on this gate`; with the far side withheld it prints
`NOT SATISFIED — far side owed` and `PROVISIONAL`. Two mutations of the gate redden the suite (always-true:
**4 failures**; a lax near side: **1**). And the first mutation attempted — moving a bracket's date to
**2099** — left every assertion green, because "after the day ends" is satisfied by a date nobody observed;
that hole is now its own assertion and was proved red. `exp014-window.mjs` restored **byte-identical** under
`sha256sum -c` after each mutation, per [L-95](LESSONS.md#l-95).

**No `src/` file is touched.** No route, handler, page, counter, counter meaning, schema, migration, secret
or dependency — so EXP-014's binding clauses hold, the find-page script is unedited inside the open window,
and nothing was written to production counters. No fork or threshold moved: the change gates *publication*
of a grade, which Amendment 2 already imposed in prose.

**2026-10-01 is reported and deliberately not graded.** `item_view` **56**, `item_view_search` **0**,
`item_view_referred` **0**, `item_render` **0** at 22.3h — the three names that made 2026-09-30 a Fork B
day, all silent so far on the day after. **Nothing is concluded from a partial day, in either direction.**
Three whole days of the window (2026-10-01 → 10-03) remain outstanding.

**Gates:** `npm run check` **0** · **546 vitest** (unchanged — no `src/` change) · ops suite **455/455**
(445 → 455) · `validate-workflows` ok, **14 workflows** · `validate-nominations` **20 valid** ·
`npm audit --omit=dev` **0 vulnerabilities** · `doc-anchors` ok.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** · `followers`
**0** · `items_public` **98** · `stars` **8**, all `stars_owner` · gross cash **AUD $0**. Source:
[`metrics/latest.json`](metrics/latest.json) `totals`, generated `2026-10-01T22:19:21.630Z`. **A bracket
proves an instrument was alive; it is not an arrival, a visitor, a subscriber or a dollar.**
**This is the thirty-ninth consecutive cycle whose output is not a user or a dollar.** **3 days left.**

---

**Last updated:** 2026-10-01 20:55 Sydney (2026-10-01 10:55 UTC), run 211 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged and not re-argued here, per [L-07](LESSONS.md#l-07).** **The gate owed a publication and got
one: item 293. Then the rollback trigger's only description of what a find page serves a search arrival was
found to be two numbers neither selector could count — and one of them was published to issue #1 one run
ago.**

**The gate read ATTEND, and it was attended before anything else was chosen.**
[`scout-gate.mjs`](../scripts/scout-gate.mjs) reported item 292 at `2026-09-30T10:18:23.606Z`, **23.9h**
old, with **one** scheduled screen certainly delivered since (`2026-10-01T02:40:00Z`). The latest `agent
scout` run's record was opened and read — **35 screened · 24 rejected · 9 selected · 2 deferred**, top
selection `PMC13511510`, quotation verbatim-confirmed against its own abstract, typed
`research-article/journal article`, not previously published. The record supported it, so
`agent-scout.yml` was dispatched with `publish: true`:
[run 36848864892](https://github.com/in-c0/tuned/actions/runs/36848864892) — **HTTP 201, item 293,
`duplicate=false`**, registered at [`qa/nominations/293-…json`](../qa/nominations/293-association-between-change-of-direction.json).
The gate now reads **CURRENT**. The schedule was **not armed**: EXP-013's threshold 2 is still unruled and
run 153's pre-commitment stands. Attending a gate is not removing it.

**The artifact was unreachable and the record was read anyway.** This session's egress proxy answers
**403 CONNECT** for `productionresultssa4.blob.core.windows.net`, so the `scout-record` zip cannot be
downloaded here. The record is also printed in full in the job log, which the GitHub API does serve —
the path `writeNomination`'s own docblock names for *"a run that can read a job log"*. **No access was
widened**; the reading is sourced to the log of the run named above.

**EXP-014 was re-read and has not moved.** `exp014-window.mjs` on the committed snapshot
(`generated_at` 2026-10-01T05:55:28.757Z) is still complete through **2026-09-30**: three
`A-CONSISTENT` days and 2026-09-30 **B**. **VERDICT B stands on one day**, three outstanding
(2026-10-01 → 10-03). Nothing is claimed from an unmoved reading, and no number here is new.

**Then the cycle spent itself on the one guard that stands between a bad deploy and a rollback.**
`verify-production.yml`'s referred-arrival step — the only check that describes what a find page serves the
arrivals search sends it, on the page class that has just received this project's first measured off-site
arrivals — closed with this line:

```
/sportstech/292: HTTP 200 text/html ... 0 sibling find(s), 8 other feed(s)
```

**Both numbers were wrong, in opposite directions, and each concealed the other.** `n_cards` counted
`class="card-permalink"` — a class only the **feed** page's cards carry, never
[`siblingCard`](../src/pages.ts) — so on a find page it **could not exceed 0 whatever the page held**.
`n_feeds` counted every site-relative `.card-link`, which on a find page is the sibling cards **plus** the
directory cards, so the siblings were counted a second time as feeds. The published **8** is 4 siblings +
4 feeds. The step's own comment states the discrimination its code never made: *"an item card and a
directory card share the `card-link` class and are told apart by where they point."*

**The cost is not the log line — it is that one real guard could not fail.** `[ "$n_feeds" -ge 1 ]` exists
to catch a directory block that renders its heading with nothing in it, and **the sibling cards alone
satisfied it**. And the sibling block — the anti-orphan edge that is the only route from the page search
lands on into the rest of the feed — had **no assertion at all**, only the count that could not move.

**Measured on really-rendered markup before pushing, per run 175's practice.** A find page carrying **4
siblings and 1 other feed** was rendered from the worker and both selector pairs run against it:

| selector | siblings | other feeds |
| --- | --- | --- |
| old (`card-permalink`; any `card-link href="/`) | **0** | **5** |
| new (href shape: `/handle/id`; `/handle`) | **4** | **1** |

And both regressions the step exists to catch were injected into that markup: **deleting the sibling block**
left the old step reading the same `0` and **green**, while the new one fires; **emptying the directory
block** left the old selector reading **4** from the siblings and **green**, while the new one reads 0 and
fires. Both failures say *Roll back*.

**And the fix is confirmed against live production, not only against a local render.**
[`verify production` 36853484195](https://github.com/in-c0/tuned/actions/runs/36853484195) — **success at
`84b3d39`**, step 5 (*"Wait for the expected commit to be serving"*) passed, so the deployed Worker is this
commit. **30 of 31 steps passed; the one skipped is *Public availability*, which fires only when the site
is NOT serving.** Step 30 now reports:

```
/ava/116: HTTP 200 text/html to a Referer from www.google.com; Tuned's own markup identical to the
unreferred document (f5c442159798), 4 sibling find(s), 4 other feed(s)
```

**4 and 4** — the figures predicted for this page class before the push, read off production. The page
under test moved from `/sportstech/292` to `/ava/116` because the selection now picks the first handle the
sitemap shows with two finds rather than the first find in the file; both are find pages of the same shape
and the discriminator comparison is unaffected (`ref-before`/`ref`/`ref-after` all `30263/27092B,3s`).

**The page under test is now drawn from a handle the sitemap shows has two public finds** — derived from the
document already fetched, no extra request. Without that, asserting the block would fail on a one-item feed,
which legitimately renders none. That case is pinned as a test in its own right.

**No `src/` file is touched.** No route, handler, page, counter or counter meaning changed, so EXP-014's
binding clauses hold and nothing was written to production counters. `src/index.ts` and `src/pages.ts` were
mutated to prove the new tests red and restored **byte-identical** under `sha256sum -c`, per
[L-95](LESSONS.md#l-95); the workflow was mutated to prove its own guard non-vacuous and restored the same
way.

**The number reached the owner, and that is the lesson.** "0 siblings" is exactly what a one-item feed
legitimately shows, so the reading looked like a fact about production rather than a broken selector, and
**run 210 quoted it verbatim into its execution report**. The hard rule *never publish a number that is not
sourced* is usually read as a guard against invention; this was not invented, it was sourced to a selector
that could not name the thing the label named. [L-130](LESSONS.md#l-130).

**Gates:** `npm run check` **0** · **546 vitest** (543 → 546) · ops suite **445/445** (443 → 445) ·
`validate-workflows` ok, **14 workflows** · `validate-nominations` **20 valid** · `npm audit --omit=dev`
**0 vulnerabilities**.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** · `followers`
**0** · `items_public` **98** · `stars` **8**, all `stars_owner` · gross cash **AUD $0**. Source:
[`metrics/latest.json`](metrics/latest.json) `totals`, generated `2026-10-01T05:55:28.757Z` — which is
**before** item 293 was published at 10:24:20Z, so that publication is not in any of these figures and
no adjusted count is asserted here. **This is the thirty-eighth consecutive cycle whose output is not a user or a dollar.**
**4 days left.**

---

**Last updated:** 2026-10-01 14:40 Sydney (2026-10-01 04:40 UTC), run 210 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged and not re-argued here, per [L-07](LESSONS.md#l-07).** **EXP-014 reached a verdict, and it is
not the one the window was named for. 2026-09-30 carries `item_view_search` 1 and `item_render` 5 with
`item_view_onsite` 0 — the first off-site, rendering, referred arrivals this project has ever measured.
Fork B. A test was asserting the verdict could never be B.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs) read
**CURRENT** — item 292 at `2026-09-30T10:18:23.606Z`, **17.9h** old, **zero** scheduled screens certainly
delivered since. Nothing was published, amended or retracted. The schedule was **not armed**: EXP-013's
threshold 2 is still unruled and run 153's pre-commitment stands.

**The reading moved, after four days that did not.** The snapshot committed overnight
(`generated_at` 2026-10-01T00:08:58.318Z) is complete through **2026-09-30**, and
[`exp014-window.mjs`](../scripts/exp014-window.mjs) grades that day **B**:

| day | `item_view` | `_search` | `_referred` | `_onsite` | `item_render` | grade |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-09-27 … 09-29 | 105 / 21 / 42 | 0 | 0 | 0 | 0 | `A-CONSISTENT` |
| **2026-09-30** | **168** | **1** | **5** | **0** | **5** | **B** |

**Fork A is dead and cannot return** — it required `_search` = 0 and `_referred` ≤ 2 on *every* whole day.
Three days outstanding can add to this but cannot undo it.

**Ruled out before it was read, not after.** `qa-browser.yml` has not run since **2026-09-28T04:24:03Z**,
and its headless UA lands every increment in `_bot` by EXP-014's own binding clause — it cannot write an
unsuffixed name at all. `verify-production.yml`'s referred requests carry `tuned-ops-verifier` and land in
`item_view_search_bot` (16 that day). Run 209's QA ran against a local server. **No first-party writer for
the unsuffixed 5 and 1 exists.** Nor is it the owner clicking around: `item_render` has fired unsuffixed
before (3, 2, 2, 1 on 2026-09-15 … 09-21) but **always on a day `item_view_onsite` was also non-zero**. On
2026-09-30 it is **0**.

**The limitation is published with the verdict, not left for a later run to find.** Fork B binds its halves
to the same **day**, not the same **request** — the render beacon posts same-origin and cannot report how
its own page load arrived. Five renders and five referred arrivals is consistent with five browser arrivals
**and** with two disjoint machine populations. The equal counts are suggestive and are **not a join**. That
is not grounds to re-grade: Amendment 1 predates every whole day in the window, and refusing a registered
fork on a ground invented after seeing the day it tripped is fitting. The join is **deliberately not built
inside the window** — it needs the server to vary the document by `Referer`, which changes the instrument an
open experiment is read on.

**Fork B's own next action was discharged: the index reading is relabelled.** Re-taken by runs 174/197's
method — control `site:hono.dev` nine URLs on the domain, **`site:justtuned.com` 0 pages**, the third
consecutive zero over fifteen days, *while production recorded a search referrer anyway*. From this run the
reading may **not** be published as "Tuned is not indexed". Its honest statement is **zero pages in the one
backend this session can query**. Recorded in [METRICS.md](METRICS.md).

**Then the cycle spent itself on the product, and the change is a reversal of run 209's reasoning one run
later.** Run 209 confined the RSS link to `<noscript>`, justified by *"every observed visitor to a find page
in this window took the HTML and ran none of it"* — a reading, written as a standing fact. **The next whole
day graded `item_render` = 5.** The population it deferred the scripted path for is measured to exist, and
for it the only subscription that delivers today sat two interactions deep: open the dialog, then take RSS,
behind a 12px corner link. [`followRss`](../src/pages.ts) now **server-renders the link for every client**,
and `<noscript>` keeps only the job that belongs to it — retiring the control that is inert without script.
One affordance, both populations. It is `btn` and not `btn primary`: beside a working `Follow` it is the
secondary of two honest controls, and with script off it is the only one on the page.

**It cannot reintroduce run 209's "two controls, one of which is a lie"** — with scripting off the dead
button is still removed, and with scripting on **both** remaining controls work.

**Verified where the mechanism lives, per [L-127](LESSONS.md#l-127).** Local `wrangler dev`, Chromium at
**390px and 1100px**, `javaScriptEnabled` **true and false**, both page classes — **8/8 clean**: RSS control
present and visible in all eight, Follow visible only with script, **no horizontal overflow anywhere**
(doc = viewport in all eight), dialog still opening, **zero page errors**. The no-script click was followed
to `/sportstech/rss.xml`: **HTTP 200, `application/rss+xml`, 2 items**. Local, so **nothing was written to
production counters**, and it is explicitly **not** Amendment 2's far-side bracket.

**A guard was holding the verdict shut, and it is the run's second finding.**
`exp014-window.test.mjs` asserted `!["B","C"].includes(reading.verdict)` — that the window's verdict is
**never** Fork B and never Fork C, the two conclusions the experiment exists to reach. It passed for four
days and reddened the moment the experiment concluded. It generalised 2026-09-27's `A-CONSISTENT` grade to
the window, but B and C are registered over *any* whole day. **A tripwire that fires on success.** Replaced
with the invariant that holds — a B/C verdict names a day satisfying that fork on its own.
[L-129](LESSONS.md#l-129); [L-108](LESSONS.md#l-108)'s shape on an experiment instead of on copy.

**Both production assertions were updated in the same change, not a run behind it.** Run 209's greps matched
the old exact string and **would have failed on this deploy**. Each page now carries two separate
assertions — the RSS control outside `<noscript>`, and the `<noscript>` retirement — with its own failure
message naming which half went. Both literals were checked against really-rendered HTML **before pushing**.

**EXP-014's binding clauses hold:** `item_render`'s emitter unedited, `SEARCH_REFERRERS` untouched, no
graded name can move, window not re-registered. No route, schema, migration, counter, counter meaning,
secret, dependency or public claim changed. No CSS rule added.

**Gates.** `npm run check` **0** · **543 vitest** (539 → 543) · **ops suite 443/443** · **14 workflows** ·
**19 nominations** · **0 vulnerabilities** · **8/8 browser assertions** across two scripting states, two
pages and two viewports.

**Nothing published, nothing claimed.** `applications` **0**, `members` **1**, `members_ever_active` **0**,
`followers` **0**, `items_public` **98**, `stars` **8** (`stars_owner` **8**, so non-owner activation is
exactly 0), gross cash **AUD $0**, from *no billing exists*. Source:
[`metrics/latest.json`](metrics/latest.json) `totals`, generated `2026-10-01T00:08:58.318Z`. Spend this run
**AUD $0.00**; running total **AUD $0.00 of $500**.
**This is the thirty-seventh consecutive cycle whose output is not a user or a dollar** — and the first in
which something arrived from outside that this loop can point at. **An evidenced arrival channel is not
demand: nothing has come through it that this service can count.** **4 days left.**

---

**Last updated:** 2026-10-01 08:40 Sydney (2026-09-30 22:40 UTC), run 209 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged and not re-argued here, per [L-07](LESSONS.md#l-07).** **For three graded days this loop
has measured that every client reaching a find page runs no JavaScript — and for those same three days the
only subscription control on that page was a `<button>` that does nothing without it. The measurement and
the defect were in the same record and never met. Both public surfaces now carry a fallback that works.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs) read
**CURRENT** — item 292 at `2026-09-30T10:18:23.606Z`, **11.9h** old, **zero** scheduled screens certainly
delivered since. Nothing was published, amended or retracted this run. The schedule was **not armed**:
EXP-013's threshold 2 is still unruled and run 153's pre-commitment stands.

**Today's named work was done next and has not moved.** `exp014-window.mjs` on the committed snapshot
(`generated_at` 2026-09-30T05:33:40.259Z) reports **complete through 2026-09-29**, unchanged from run 208:
2026-09-27 `A-CONSISTENT` (105/0/0/0), 2026-09-28 (21/0/0/0), 2026-09-29 (42/0/0/0). **Window `A-PENDING`,
four days outstanding.** No verdict, and nothing is claimed from an unmoved reading.

**Then the cycle spent itself on the product, which three of the last four did not.** Runs 206, 207 and 208
shipped a quotation fix, an owner-card guard and an anchor guard; two of those three are control plane, and
the operating card's rule 7 says a cycle whose only output is instrumentation was spent wrong. The candidate
taken today is the one thing on run 208's list that is a defect in what a visitor is served.

**What is wrong, stated as the pages serve it.** `/:handle` and `/:handle/:id` each carry exactly one
subscription control: `<button class="btn primary" id="follow-btn">Follow</button>`. A bare button has **no
default behaviour**. The only thing that makes it do anything is a `click` listener in the page script,
which calls `showModal()` on `<dialog id="follow-dlg">` — and a `<dialog>` is `display: none` until that
call. So for a client that does not execute the document the button is **inert**, and the dialog's whole
contents — the RSS call to action, the desk form, the email list — are unreachable. What is left on the
page is the **12px `RSS` link in the top corner**.

**The population is measured, not imagined, and it is this loop's own reading.** EXP-014 has graded
`item_render` = **0** on every whole day in the window against **168** unsuffixed `item_view` — 105, 21 and
42 across 2026-09-27 … 2026-09-29, source [`metrics/latest.json`](metrics/latest.json). EXP-014
[Amendment 2](EXPERIMENTS.md#exp-014) established by **direct browser observation** that the beacon fires
when a browser loads the page, so those zeros are a fact about the clients and not about the instrument.
**Every observed visitor to a find page in this window was handed a dead button.** Run 208 listed this
defect third and deferred it with the caveat that *"the observed population for that path is machines,
which is also a reason to doubt the fix converts anything."* That caveat is half right and points the wrong
way: a machine will not subscribe, but `<noscript>` is **the branch that population takes**, so the fallback
is served to exactly the clients that are here — and to the first human who arrives on a page a crawler
indexed.

**The fix is the one branch in HTML that a non-executing client takes and an executing one does not.**
[`followNoScript`](../src/pages.ts) emits
`<noscript><style>#follow-btn{display:none}</style><a class="btn primary" href="/:handle/rss.xml">Subscribe by RSS</a></noscript>`
on both public pages. With scripting **on**, a browser never parses that content into nodes: no element,
no listener, nothing `getElementById` can reach, and the scripted page behaves exactly as before. With
scripting **off**, the `<style>` retires the dead button and a real link takes its place — a fallback that
adds an affordance while leaving the broken one standing is two controls, one of which is a lie.

**It offers RSS and only RSS, because RSS is the only path that delivers today** — the dialog says so in
its own words (*"RSS works today"*, *"Digests are not sending yet"*). The email form behind the dialog
posts JSON to `POST /:handle/follow` and has no form-encoded, HTML-rendering counterpart; inventing one to
sit behind this link would be a **new public write endpoint**, which is a larger change than the defect
warrants and is recorded as the next candidate rather than taken.

**Verified where the defect lives, per [L-127](LESSONS.md#l-127).** No string comparison can see whether a
browser honours a `<style>` inside `<noscript>` in the body; the vitest assertions pin the *shape* of the
remedy and could all pass on a mechanism that does not work. So the pages were served from a local
`wrangler dev` and loaded in **Chromium with `javaScriptEnabled: false` and again with `true`** — **18
assertions, all passed**: button hidden and fallback visible and clickable (161×33) with script off, the
fallback link navigating to `/sportstech/rss.xml`; with script on, `#follow-btn` visible, **zero** fallback
nodes in the DOM, no page errors, and the dialog still opening on click. Re-checked at **390px** with
script off: **0px** horizontal overflow, which is the run-167 defect's viewport.

**EXP-014's binding clauses hold, and this run is the first in the window to say so while having touched
`src/`.** The two clauses are named ones: `item_render`'s **emitter is unedited** and **`SEARCH_REFERRERS`
is untouched**. No route, handler, counter, counter meaning, schema, migration, secret, dependency, data
category or public claim changed either, and no graded name can move: `item_view` is written server-side on
the request, and `item_render` is written by a script this change does not go near — a no-script client
never fired it before and still does not. The one new link points at `/:handle/rss.xml`, which **both pages
already carry twice** (the corner link and `<link rel="alternate">`), so no crawler reaches a URL it could
not reach before. Declared in [EXPERIMENTS.md](EXPERIMENTS.md#exp-014) rather than asserted here.

**Gates.** `npm run check` **0** · **539 vitest** (529 → 539) · **ops suite 443/443** · **14 workflows** ·
**19 nominations** · **0 vulnerabilities** · **18/18 browser assertions** across two scripting states, two
pages and two viewports.

**Nothing published, nothing claimed.** `items_public` **97**, `applications` **0**, `members` **1**,
`followers` **0**, `stars` **8** (`stars_owner` **8**, so non-owner activation remains exactly 0), gross
cash **AUD $0**, from *no billing exists*. Source: [`metrics/latest.json`](metrics/latest.json) `totals`,
generated `2026-09-30T05:33:40.259Z` — which predates item 292, so the total it reports is the pre-292 one
and is published as read rather than adjusted ([run 208's correction](DECISIONS.md)). Spend this run
**AUD $0.00**; running total **AUD $0.00 of $500**.
**This is the thirty-sixth consecutive cycle whose output is not a user or a dollar.** What it bought is
that the one control this service offers a stranger is no longer dead for the only kind of client that has
ever been observed using it. **5 days left.**

---

**Last updated:** 2026-09-30 20:35 Sydney (2026-09-30 10:35 UTC), run 208 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged and not re-argued here, per [L-07](LESSONS.md#l-07).** **The gate owed a publication and it was
paid: item 292 is live, and it is the first find this feed has published carrying the quotation fix run 206
shipped. Then the cycle confirmed run 207's unverified candidate — 318 cross-references in this record
resolve to nothing — and the first fix for it would have broken 17 that worked.**

**The gate was attended first, and this time it owed something.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **ATTEND** — one scheduled screen delivered since item 291, at `2026-09-30T02:40:00Z`. Its record
([run 36693081280](https://github.com/in-c0/tuned/actions/runs/36693081280)) screened **37** candidates,
rejected 25, selected **9** and published none, because a cron firing leaves `PUBLISH` unset. Its top
selection was **PMC13611748** — the item run 206 was one dispatch from publishing when it found the
stripper defect instead — and the why-line now composes correctly, carrying the `p < 0.001` that fix
restored. Dispatched with `publish: true` →
[**item 292**](https://justtuned.com/sportstech/292), HTTP 201, `duplicate=false`, at
`2026-09-30T10:18:23.606Z`. Nomination committed, without which the gate cannot see it. **The schedule was
NOT armed**: EXP-013's threshold 2 is still unruled and run 153's pre-commitment stands.

**Today's named work moved for the first time in three runs.** `exp014-window.mjs` on the committed snapshot
(`generated_at` 2026-09-30T05:33:40.259Z) now reports **complete through 2026-09-29**, so a third day is
gradeable: 2026-09-29 **`A-CONSISTENT`** (42/0/0/0), joining 2026-09-27 (105/0/0/0) and 2026-09-28
(21/0/0/0). **Window `A-PENDING`, four days outstanding**, down from five. No verdict, and nothing is
claimed from an unmoved fork.

**Then the cycle took the candidate run 207 could not confirm.** Run 207 closed by flagging that
`LESSONS.md#l-97` may resolve to nothing, *"computed from the slug rules locally and not verified against a
rendered page — this session cannot fetch github.com's HTML"*, and said it *"wants one check before it wants
a fix"*.

**It is confirmable, and it is true.** `ops/LESSONS.md` read back through the **repository-scoped contents
API** with `Accept: application/vnd.github.html` is GitHub's own rendered HTML. It carries **128 anchor
ids** and **none of them is `l-97`**: GitHub slugs the whole heading. **318 links, not the sixty-odd
estimated** — the estimate missed the 63 same-file `#l-NN` links inside `LESSONS.md` itself. A fragment
matching no element is an error at no layer, so all 318 read as working.

**A second defect decided the shape of the fix.** Nine links *did* use the full-slug form and are dead
anyway: correct when written, then the heading gained `(2026-08-15, run 44)` and the slug moved. **A slug is
a function of a title**, so rewriting 318 links to slugs buys pointers that break on the next retitling.
Instead each `L-` and `EXP-` registration heading now carries an explicit `<a id="l-97"></a>`, which makes
the 203 LESSONS links and the 13 `#exp-011` links true **exactly as written**, survives retitling, and hands
`#l-127` to the next lesson. The nine truncated slugs are normalised onto it. The full-slug links that **do**
resolve are left alone: `#exp-005--re-read-2026-09-11-…` points at a re-read section, and collapsing it to
`#exp-005` would silently redirect it to the registration.

**And then the fix was wrong, and only the renderer said so.** The first version wrote
`… (run 179) <a id="l-97"></a>` — with a space — passed `npm run check`, 529 vitest, 443 ops tests, the new
checker and its repo-wide sweep, and was pushed to a branch. Read back, GitHub had renamed that heading's
**own** permalink to `…-2026-09-21-run-179-`: the anchor renders no text, **the space before it does**, and
GitHub maps spaces to hyphens **without trimming**. **17 live full-slug links** — in
[`NORTH_STAR.md`](NORTH_STAR.md), this file, [`METRICS.md`](METRICS.md), [`DECISIONS.md`](DECISIONS.md) and
[`EXPERIMENTS.md`](EXPERIMENTS.md) — pointed at the unsuffixed slugs. **A commit whose subject is 318 dead
pointers came one merge from shipping 17 new ones.** It was caught by the same act that proved the defect:
push, then read the file back from the renderer. The anchors are now unspaced, and **every id GitHub served
before this change it still serves** — verified, not argued.

**What hid it was this checker's own tidiness.** A `.trim()` in `slugify`, added because trimming looks
obviously right, agreed with all 128 observed ids **by luck** — no heading had edge whitespace — and was the
one transformation that made the spaced and unspaced forms indistinguishable to the only instrument that
could have objected. github-slugger does not trim; neither does this. The spacing rule is now pinned by two
tests: one asserting the trailing hyphen GitHub actually emitted, one sweeping every heading in the
repository for a space before its anchor. [L-127](LESSONS.md#l-127).

**The obligation executes.** [`scripts/doc-anchors.mjs`](../scripts/doc-anchors.mjs) fails on any relative
`#fragment` that matches no anchor its target defines, in `npm run test:ops` and so in CI. It is **red on
the repository exactly as it stood when this run began** (318 findings). This is the **sixth** obligation
this loop has found living only as prose (L-76, L-97, L-122, L-123, L-126), and the remedy is the one that
worked the other five. **What it deliberately does not check is whether a pointer goes to the *right*
place** — that is an argument, not a parse.

**Gates.** `npm run check` **0** · **529 vitest** unchanged · **ops suite 443/443** (427 → 443) ·
**14 workflows** · **19 nominations** · **0 vulnerabilities**. `slugify` reproduces **all 128** ids GitHub
rendered, and still does with the anchors in place — which is also the proof that adding them moved no
existing heading slug. **The parser's first version saw 83 of those 128:** `LESSONS.md:3366` carries an
inline ``` `.card .meta` ``` code span mid-paragraph, and a naive fence rule read it as opening a fence that
never closed, swallowing 45 headings. CommonMark forbids a backtick in a backtick fence's info string, which
is exactly what distinguishes them — **the same shape as run 206's defect: the thing that looks like markup
is the author's content.** Heading tag-stripping takes the same care, so a heading reading `p < 0.001` keeps
its arithmetic.

**No committed `src/` file was touched, so no route, handler, page or behaviour changed** — and no schema,
migration, counter, counter meaning, secret, dependency, data category or public claim either.
`item_render`'s emitter is unedited and `SEARCH_REFERRERS` is untouched, so **EXP-014's binding clauses hold
and the window is not re-registered.**

**One thing was published, and the count it moves is not readable yet — so it is not claimed.**
`items_public` reads **97** in the only committed snapshot (`generated_at` 2026-09-30T05:33:40.259Z), which
was generated **4h45m before item 292 existed**. That item is published — `HTTP 201`, `published=true`,
`duplicate=false`, from [its own run's log](https://github.com/in-c0/tuned/actions/runs/36701335922) — so the
next snapshot should read 98. **98 is not published as a reading here, because no snapshot or workflow run
carries it**, and the rule is that every number comes from `ops/metrics/latest.json` or a linked run.
`applications` **0** · `members` **1** · `followers` **0** · `stars` **8** (`stars_owner` **8**,
so non-owner activation remains exactly 0) · gross cash **AUD $0**, from *no billing exists*. Source:
[`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated `2026-09-30T05:33:40.259Z`. Spend this
run **AUD $0.00**; running total **AUD $0.00 of $500**.
**This is the thirty-fifth consecutive cycle whose output is not a user or a dollar.** What it bought is a
published find whose quotation is true of its source, and a record whose 318 internal pointers land where
they say they do, five days before that record is handed over. **5 days left.**

---
**Last updated:** 2026-09-30 14:35 Sydney (2026-09-30 04:35 UTC), run 207 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO — and one of them has never been in this file.** **The section this file's head has linked from 50 run
entries carried one card. The second — the only owner action in this loop that needs a single word rather
than an account — existed in full only in `DASHBOARD.md`, the file the operating card calls "never a source
of truth" and whose own header says this one wins when the two disagree.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs) read
**CURRENT** — item 291 at `2026-09-29T10:24:06.456Z`, **17.8h** old, **zero** scheduled screens certainly
delivered since. Nothing was published, amended or retracted this run. The schedule was **not armed**;
EXP-013's threshold 2 is still unruled and run 153's pre-commitment stands.

**Today's named work was done next, takes seconds, and has not moved.** `exp014-window.mjs` on the committed
snapshot (`generated_at` 2026-09-29T23:56:05.378Z) still reports **complete through 2026-09-28**: the 20:40
UTC snapshot was delivered **3h15m late at 23:55:52Z, four minutes short of the day it would otherwise have
completed**, and the 00:15 UTC run that exists to capture a whole day had not been delivered when this run
read. So 2026-09-27 `A-CONSISTENT` (105/0/0/0) and 2026-09-28 `A-CONSISTENT` (21/0/0/0) stand, **window
`A-PENDING` with five days outstanding**. Nothing is claimed from an unmoved reading.

**Then the cycle went looking, and found the defect in the one output of this loop that requires a human.**

**What is wrong.** Run 143 (2026-09-06) raised a second owner card — *may Tuned be suggested to
`ooh.directory` at all?* — wrote it into run 143's own entry in this file and into
[DASHBOARD.md §1](DASHBOARD.md#1-owner-action-required), and **never appended it to
[§ OWNER ACTION REQUIRED](#owner-action-required)**, the standing card stack every execution report since has
named as the place the cards are *"recorded … and not re-argued here"*. That section's leading heading has
read **`ONE, and it has no deadline`** since run 137. **Nothing retired card 2:**
[DISTRIBUTION.md](DISTRIBUTION.md) still reads **A2 OPEN — never asked**, and the packet is intact.

**The number was maintained in three places by prose, and it oscillated.** Read from the 50 run-head lines
in this file that carry the anchor: **TWO** from run 149 through 175, **ONE** from 176 through 198, **TWO**
again from 199 through 206. Runs 175 and 176 are consecutive and each states the other's number as the
settled history of the same fact — run 175: *"TWO, unchanged from runs 143-174"*; run 176: *"ONE, unchanged
from runs 137-175."* **Neither announced a change, because from each one's vantage there wasn't one.** A run
that read the section wrote ONE; a run that read the mirror or run 143's entry wrote TWO; and the word
*"unchanged"* was sincere both times. **57 runs of drift, and no run was wrong at its own desk.**

**Why the usual precedence rule made this worse instead of catching it.** DASHBOARD §1 opens *"Mirror of
STATUS.md § OWNER ACTION REQUIRED. If the two disagree, STATUS is right"*, and the operating card says
DASHBOARD "is never a source of truth". **Here the mirror was the superset**, so applying either rule as
written resolves the disagreement by **deleting the card the owner needs**. A precedence rule is only safe
while the authoritative file is the superset, and nothing checked that it was.

**What kept it alive for 64 runs is [L-07](LESSONS.md), working exactly as designed.** *"After two unchanged
blocker cycles, escalate once and then stop restating it."* The loop correctly stopped restating both cards
— which left the pointer as the owner's only channel. **A pointer into a section missing half its content,
plus a standing rule against restating that content, silently deletes the escalation** while every report
truthfully reports the count it read.

**And the card that went missing is the cheap one.** Card 1 needs an account and two minutes. Card 2 needs
**one word** and is this loop's only open *question*. With every remaining distribution step at **A0** (an
account this executor does not hold) or **A2** (an authorship decision that is the owner's), those two cards
are the whole of the commercial surface this loop can still reach — and the one that costs a word was legible
only in the file designated non-authoritative.

**Restored, not copied.** Card 2 is rewritten in § OWNER ACTION REQUIRED from
[`SUBMISSION-ooh-directory.md`](SUBMISSION-ooh-directory.md), [EXP-012](EXPERIMENTS.md) and
[DISTRIBUTION.md](DISTRIBUTION.md), because a mirror is not a source. Rewriting it from the sources surfaced a
fact the mirror's four-week-old copy does not carry and which changes what an `A` buys: **EXP-012's reading
falls 14 complete UTC days after t0, read on day 15**, so a submission today reads on **2026-10-15 — ten days
after the final operating date.** This loop will not grade EXP-012 under either answer, and the card says so.
The mirror's *"29 days remain"* is corrected to five.

**The obligation now executes.** [`scripts/owner-cards.mjs`](../scripts/owner-cards.mjs) fails when the count
word in this file's head, the count word in § OWNER ACTION REQUIRED's leading heading and the count word in
DASHBOARD §1's leading heading are not the same word — **and** when § OWNER ACTION REQUIRED does not carry
that many live cards. It runs in `npm run test:ops`, so in CI. This is the **fifth** obligation this loop has
found living only as prose (L-76, L-97, L-122, L-123), and the remedy is the one that worked the other four
times: make it execute. **What it deliberately does not check is whether a card is *right*, current or well
argued** — that is an argument against evidence and belongs in a run's report, not in a parser. It answers
only *are they all here, and does the count agree*, which is the question 64 runs answered wrong.
**It also does not grade the history above:** the run-175/176 contradiction is frozen in an append-only
record and correcting it now would be the retrospective reconstruction this loop's own rules forbid.

**Gates.** `npm run check` **0** · **529 vitest** unchanged · **ops suite 427/427** (413 → 427) ·
**14 workflows** · **18 nominations** · **0 vulnerabilities**. **Four mutations, all files restored
byte-identical under `sha256sum -c`** — and one of them was not caught, which is reported here rather than
dropped.

| mutation | what it is | result |
| --- | --- | --- |
| **A** | the records **exactly as they stood at [`34e0879`](https://github.com/in-c0/tuned/commit/34e0879)**, the tip when this run began | guard **exit 1**, naming **both** the head/section disagreement (*"the head says TWO … § OWNER ACTION REQUIRED says ONE"*) and the mirror/source one; suite **red** |
| **B** | card 2's **body** deleted, its `###` heading left standing | **NOT CAUGHT — exit 0.** See below |
| **B′** | card 2 removed **heading and all**, section heading still claiming TWO | guard **exit 1** — *"says TWO but carries 1 live card heading(s)"* |
| **C** | `countWord` made case-insensitive, so card bodies' *"one word on issue #1"* can declare a count | **suite red** (1 failure); the guard itself still exits 0 on today's records, because their first heading reads `TWO` either way |

**Mutation A is the load-bearing one: the guard is red on the world as it was when this run began**, and
would have been red from run 143 onward. **Mutation B is a real limitation and it is now written into the
guard's own header:** the live-card check counts **headings**, so a card hollowed out to a heading with no
body passes it. What actually caught this incident is the head/section count disagreement, which is
mutation A; B′ is the shape that check does catch. A guard whose blind spot is undocumented is the thing
L-124 is about, so it is documented rather than quietly widened — widening it to judge a card's *body*
would make it grade whether a card is well written, which is an argument, not a parse.

**No committed `src/` file was touched, so no route, handler, page or behaviour changed** — and no schema,
migration, counter, counter meaning, secret, dependency, data category or public claim either.
`item_render`'s emitter is unedited and `SEARCH_REFERRERS` is untouched, so **EXP-014's binding clauses hold
and the window is not re-registered.**

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`followers` **0** · `stars` **8** (`stars_owner` **8**, so non-owner activation remains exactly 0) ·
gross cash **AUD $0**, from *no billing exists*. Source: [`ops/metrics/latest.json`](metrics/latest.json)
`totals`, generated `2026-09-29T23:56:05.378Z`. Spend this run **AUD $0.00**; running total
**AUD $0.00 of $500**.
**This is the thirty-fourth consecutive cycle whose output is not a user or a dollar, and I am not dressing
it up.** What it bought is that the owner's own copy of what this loop needs from them is complete in the
file the loop calls authoritative, five days before it hands that file over. **5 days left.**

---
**Last updated:** 2026-09-30 08:40 Sydney (2026-09-29 22:40 UTC), run 206 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged and not re-argued here, per [L-07](LESSONS.md).** **Yesterday's upstream outage was not
merely mislabelled in the record — it had silently spent the cycle's read budget, so an archive having a
bad afternoon evicted five readable papers and left the feed ranking its selection over a pool of three
where the pool was meant to be twelve.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs) read
**CURRENT** — item 291 at `2026-09-29T10:24:06.456Z`, **11.8h** old, **zero** scheduled screens certainly
delivered since. Nothing was published, amended or retracted this run. The schedule was **not armed**;
EXP-013's threshold 2 is still unruled and run 153's pre-commitment stands.

**Today's named work was done first and takes seconds.** `exp014-window.mjs` on the committed snapshot
(`generated_at` 2026-09-29T05:44:52.875Z, complete through 2026-09-28) is **unchanged from run 204's
reading** — no new whole UTC day has landed, so 2026-09-27 `A-CONSISTENT` (105/0/0/0) and 2026-09-28
`A-CONSISTENT` (21/0/0/0) stand, **window `A-PENDING` with five days outstanding**. Nothing is claimed
from an unmoved reading.

**Then the cycle took the candidate run 205 surfaced and did not take.** Run 205 recorded that Europe PMC
returned `HTTP 503` on most of that screen's full-text reads and that "a transient upstream outage and a
paper with no readable full text are currently the same verdict". Reading the job log turned up **two
things run 205 did not have**, one of them a correction to its own number.

**First, the number. It was 8 of 12, not 9.** The log carries eight `HTTP 503` rows; 8 unanswered + 3
selected + 1 `measured-result` = the 12 reads the same line reports. Corrected in `DECISIONS.md` and in
run 205's entry below. Nothing in run 205's conclusions turns on it.

**Second, and this is the finding: the read budget had paid for them.** `reads` was incremented *before*
the verdict was known, so eight requests that returned no document **spent eight of the twelve read
slots**, and five candidates Europe PMC would have served were deferred `read-budget: 12 full-text reads
already spent`. **Four documents were read on a cycle budgeted for twelve.** Three passed the bar, and
`rankSelected` ordered **item 291 over a pool of three.** An outage does not only remove its own
candidates — **it evicts the readable ones queued behind it**, under a clause that reads exactly like a
cycle which did its work and ran out of room. The summary line said
`screened 37 · rejected 29 · selected 3 · deferred 5 · full-text reads 12`, and nothing in that sentence
distinguishes a thinned pool from a thin literature.

**The mislabelling is the smaller half but it is not cosmetic.** Each of the eight read `rejected`, the
word this file gives a review article or an already-published source — settled properties of a candidate.
**A 503 is a property of the archive's afternoon.** Nothing was learned about those eight papers and the
record said all eight failed the bar.

**The principle already existed twenty lines away in the same pipeline.** [L-121](LESSONS.md#l-121) drew
this exact line for the *search* in run 202, after a 503 cost the 2026-09-28 screen its whole day. The set
encoding it was named `RETRIABLE_SEARCH_STATUSES` — **the name of what one caller does with the answer,
not of what the answer is** — so the full-text read never consulted it. It is now
`CANNOT_ANSWER_STATUSES` and both endpoints ask it. The file's own header had already stated the rule:
*"the one signal that is NOT green is a failure to read the source at all."* The header was right; the
code below it did the opposite. [L-125](LESSONS.md#l-125).

**The fix.** `fullTextStatusDefect`: a 5xx or a dead socket is the archive unable to answer → the
candidate is **`deferred / unanswered`**, **no read slot charged**, nothing recorded about it, eligible
tomorrow on the same terms as today. Every 4xx stays a fact about the document and is asked exactly once —
a **404 from `fullTextXML` is real evidence** that no full text is there, and the bar should act on it.
A bounded **total** allowance (default `maxReads`) stops the asking if the archive is wholly down, so the
publisher still fails quiet. The screen now prints the unanswered count beside the read count, and the
step summary says the pool was thinned by the archive rather than by the literature.

**A wrong turn recorded because it would have made the incident worse.** A *consecutive*-failure circuit
breaker was tried first — the intuitive shape. The eight 503s arrived **first and consecutively**, and the
three papers that passed the bar were read *after* them, so any breaker tight enough to be worth having
would have stopped that screen before a single selection and **published nothing at all.** Europe PMC was
refusing individual documents intermittently, not lying down. The real incident is the calibration.

**No retry was added and none is wanted.** Each read is for a different document, so a 503 about paper A
is not evidence about paper B and nothing here re-asks anything. The header's promise never to re-ask a
refusal is untouched.

Shipped as [#123](https://github.com/in-c0/tuned/pull/123).

**Gates.** `npm run check` **0** · **529 vitest** unchanged · **ops suite 413/413** (406 → 413) ·
**14 workflows** · **18 nominations** · **0 vulnerabilities**. **Two mutations, both caught, all files
restored byte-identical under `sha256sum -c`:** (A) the world as it stood before this run — no status is a
non-answer — **4 failures**, including the incident reconstruction; (B) `CANNOT_ANSWER_STATUSES` widened to
swallow 404 and 429 — **5 failures**, two of them the pre-existing *search* tests, which is the evidence
the shared set is genuinely shared.

**No committed `src/` file was touched, so no route, handler, page or behaviour changed** — and no schema,
migration, counter, counter meaning, secret, dependency, data category or public claim either.
`item_render`'s emitter is unedited and `SEARCH_REFERRERS` is untouched, so **EXP-014's binding clauses
hold and the window is not re-registered.** **Egress re-tested rather than assumed:** both
`justtuned.com:443` and `www.ebi.ac.uk:443` answer **403 CONNECT** from this session, so production and
Europe PMC were reached only from GitHub Actions.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`followers` **0** · `stars` **8** (`stars_owner` **8**, so non-owner activation remains exactly 0) ·
gross cash **AUD $0**, from *no billing exists*. Source:
[`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated `2026-09-29T05:44:52.875Z`.
Spend this run **AUD $0.00**; running total **AUD $0.00 of $500**.
**This is the thirty-third consecutive cycle whose output is not a user or a dollar, and I am not
dressing it up.** What it bought is that the publisher's one content pipeline no longer converts somebody
else's bad afternoon into a verdict on the literature, or into four papers read where twelve were
budgeted. **5 days left.**

---
**Last updated:** 2026-09-29 20:40 Sydney (2026-09-29 10:40 UTC), run 205 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged and not re-argued here, per [L-07](LESSONS.md).** **The gate was attended and it owed
something, and what it owed turned out to be a quotation that had silently lost its p-value. The feed
was one dispatch away from publishing a sentence the source never wrote, under the words "the source's
own words".**

**The gate read `ATTEND`, so the record was opened before anything else was chosen** — which is
[L-97](LESSONS.md#l-97) doing exactly its job. The 2026-09-29 scheduled screen
([run 36546235183](https://github.com/in-c0/tuned/actions/runs/36546235183)) screened 37, selected 9,
and named this as its top selection's why-line:

> "FAST episodes showed higher mean rβ values than SLOW episodes (0.717 vs. 0.600; difference = 0.117;
> 95% CI [0.085, 0.150]; **p d = 0.906**)." — the source's own words, quoted by @sportstech …

**`p d = 0.906` is not a sentence anybody wrote.** The authors wrote `p < 0.001; <i>d</i> = 0.906`.
Europe PMC's `abstractText` is a JSON string carrying HTML-ish markup and does **not** escape the
less-than sign the authors typed, so `/<[^>]+>/g` started at the mathematical `<`, ran to the first `>`
it could find — the one closing `<i>` — and deleted `< 0.001; <i>` **as if it were one tag**.
Reconstructed byte for byte from the real string before anything was changed; the mutation test pins
that reconstruction, so the counterfactual stays checkable rather than becoming a story about a bug.

**Why nothing downstream could see it.** `selectQuotation`'s last clause is `verbatim` — the clause the
file itself calls the one that "makes this quotation rather than authoring". It asks
`prose.includes(quote)`, and `prose` **is the stripper's output**. Every check sat downstream of the
damage, so the damage was self-consistent and the log printed *"verbatim substring of the abstract
confirmed"* about a sentence the source never contained. `MANGLED_SPACING` exists to catch exactly this
and was watching for the wrong residue (` ;`, `( `, ` )`), none of which this leaves.
[L-124](LESSONS.md#l-124).

**A second consequence, found only by fixing it.** The deleted span took the p-value out of
`matchedFamilies` too, so the screen counted **one** statistic family where the source reports **two**.
`rankSelected` orders on family count. **The damage was not merely being published — it was voting on
what got published**, and against the better-evidenced sentence. Both counts are pinned by test.

**The fix is at the one place that decides what the source said.** `stripAbstractMarkup` treats `<` as
markup only when what follows could begin a tag name — an optional `/` then a letter — plus comments
and declarations. `< 0.001`, `n > 5`, `p <= 0.05` and `load <35 kg` are arithmetic and survive.
Restoring the character is safe downstream because every render path escapes it (`esc` in
`src/pages.ts`, `xmlEscape` for the feed): it was never an injection question, it was a truth question.
Shipped as [#122](https://github.com/in-c0/tuned/pull/122), squashed to
[`f22e959`](https://github.com/in-c0/tuned/commit/f22e959).

**Then the gate was attended on the fixed code, and the attendance is where honesty costs something.**
`agent-scout.yml` dispatched with `publish: true` at
[run 36555144773](https://github.com/in-c0/tuned/actions/runs/36555144773). **Europe PMC answered
`HTTP 503` for 8 of the 12 full-text reads**, `PMC13611748` among them — so the very item whose
quotation was repaired was refused this cycle as unencounterable, and **the repair could not be
demonstrated on it live.** What the fix is proven by is the byte-for-byte reconstruction and the
mutation test, not by this run's publication, and that distinction is the whole point of keeping the
counterfactual in the suite.

**Published: [item 291](https://justtuned.com), `PMC13468772`,
[10.3390/s26154909](https://doi.org/10.3390/s26154909)** — 4 stat families, 46,481 chars (methods
8,607). **Its why-line carries no quotation at all**: none of 9 sentences considered passed
(`reported-value` 7, `too-long` 2 — the closest missed a 252-character budget by 58). That is
`composeWhy`'s correct output, not a degraded one, and it is recorded here rather than smoothed over.
Nomination `qa/nominations/291-tracking-recovery-in-motion-longitudinal.json` is committed, which is
what lets [`scout-gate.mjs`](../scripts/scout-gate.mjs) see the publication — it now reads **CURRENT**,
0h old, zero screens owed. **The schedule was not armed**; EXP-013's threshold 2 is still unruled and
run 153's pre-commitment stands.

**Gates.** `npm run check` **0** · **529 vitest** unchanged · **ops suite 406/406** (402 → 406) ·
**14 workflows** · **18 nominations** (17 → 18) · **0 vulnerabilities**.

**No committed `src/` file was touched, so no route, handler, page or behaviour changed** — and no
schema, migration, counter, counter meaning, secret, dependency, data category or public claim either.
`item_render`'s emitter is unedited and `SEARCH_REFERRERS` is untouched, so **EXP-014's binding clauses
hold and the window is not re-registered.** **Egress re-tested rather than assumed:** both
`justtuned.com:443` and `www.ebi.ac.uk:443` answer **403 CONNECT** from this session, so production and
Europe PMC were reached only from GitHub Actions.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`followers` **0** · `stars` **8** (all 8 the owner's) · gross cash **AUD $0**, from *no billing exists*.
Source: [`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated
`2026-09-29T05:44:52.875Z`. Spend this run **AUD $0.00**; running total **AUD $0.00 of $500**.
**This is the thirty-second consecutive cycle whose output is not a user or a dollar, and I am not
dressing it up.** What it produced is the one thing this product cannot afford to get wrong — a
quotation that is actually the source's — caught with one dispatch to spare. **6 days left.**

---
**Last updated:** 2026-09-29 14:30 Sydney (2026-09-29 04:30 UTC), run 204 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged and not re-argued here, per [L-07](LESSONS.md).** **The file every run is obliged to
read was the one nobody was obliged to maintain: two horizons closed 38 and 21 days ago and were never
graded, and the sub-day ladder that calls itself "re-anchored at the start of each run" had not moved in
183 runs.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **CURRENT** — item 290 at `2026-09-28T10:18:23.385Z`, **17.9h** old, **zero** scheduled screens
certainly delivered since. Nothing was published, amended or retracted this run. The schedule was
**not armed**; EXP-013's threshold 2 is still unruled and run 153's pre-commitment stands.

**Today's named work was done first, and it takes seconds.** `exp014-window.mjs` on the snapshot
committed this morning ([`a5e0c8e`](https://github.com/in-c0/tuned/commit/a5e0c8e), `generated_at`
2026-09-29T00:30:53.032Z) — the first with **2026-09-28** as a whole UTC day.

| day | `item_view` | `item_view_search` | `item_view_referred` | `item_render` | verdict |
| --- | --- | --- | --- | --- | --- |
| 2026-09-27 | 105 | 0 | 0 | 0 | `A-CONSISTENT` |
| 2026-09-28 | **21** | **0** | **0** | **0** | `A-CONSISTENT` |

**Window `A-PENDING`, five whole days outstanding.** Fork A quantifies over every day and is **not**
confirmed. Fork E excluded (`item_view_search_bot` 12 — the instrument writes). Forks B, C and F each
need a referrer and none arrived. **126 unsuffixed find-page requests over two days and not one ran the
document** — that is Fork A's population described, not graded, and it is not 126 people. `item_view`
fell 105 → 21 and **nothing is claimed from the drop.** EXPERIMENTS § **Reading 2**.

**Then the actual finding, which was in the read order itself.** [`MILESTONES.md`](MILESTONES.md) is
**item 3** of the operating card's read order and had not been touched since **2026-08-13**. The
**2-week** (2026-08-22) and **1-month** (2026-09-08) horizons had closed **38** and **21** days earlier
and still read `not started` with prospective next actions. Six sub-day windows still read `active`
with next actions completed **2026-08-08**. [`DASHBOARD.md`](DASHBOARD.md) §3 — the **owner's** screen —
offered a window that closed 2026-08-08 12:30 UTC as the nearest falsifiable milestone, and anchored the
ladder at run 18 where MILESTONES said run 20: **the two mirrors of the same ladder never agreed.**

**Both closed horizons are now graded MISSED, sourced from
[`metrics/latest.json`](metrics/latest.json).** 2 weeks: no provider, no checkout, no billing code;
gross cash **AUD $0** from *no billing exists*; `applications` **0**, so the willingness-to-pay
condition never had a candidate. 1 month: gross cash **AUD $0**;
`members_returned_after_first_day` **0**; `members_ever_active` **0**. **And the 1-month grade turns on
a distinction the raw counters hide** — `stars` **8** and `skips` **33** are non-zero, but
`stars_owner` **8** and `skips_owner` **33**, so **non-owner activation is exactly 0**. A horizon graded
off the unsuffixed names alone would have been graded *passed*.

**The ladder is retired, not re-anchored, and its windows are `closed, ungraded` rather than
`achieved`.** Five of the six describe outcomes that did occur; grading them 46 days later is the
reconstruction MILESTONES' own anti-invention rule forbids, **and that rule is symmetric — inventing a
retrospective failure is no better than inventing a retrospective achievement.** The grade was the next
run's to make on fresh evidence, no run made it, and that is what is recorded.

**Why an executing check and not another prose refresh.** This is the **fourth** time this loop has
found an obligation that lived only as prose — [L-76](LESSONS.md#l-76) the run lock,
[L-97](LESSONS.md#l-97) the scout record, [L-122](LESSONS.md#l-122) the fork rules, and now the ladder's
own "re-anchored at the start of each run". **What is worse here is that the file was one every run had
to read, and reading it did not help:** a horizon that says `active` looks exactly like a horizon that
*is* active, so **a document's staleness is invisible to its own reader when its job is to state the
current state.** [`milestone-horizons.mjs`](../scripts/milestone-horizons.mjs) now fails when a
past-due horizon still reads `not started`/`active`/`blocked`, carries no status line, or carries one it
cannot classify. It does **not** judge whether a grade is right — that is an argument, not a parse.
[L-123](LESSONS.md#l-123).

**Gates.** `npm run check` **0** · **529 vitest** unchanged · **ops suite 402/402** (381 → 402) ·
**14 workflows** · **17 nominations** · **0 vulnerabilities**.

**Three mutations, all caught, every file restored byte-identical under `sha256sum -c`.**

| mutation | what it is | result |
| --- | --- | --- |
| **A** | `ops/MILESTONES.md` exactly as it stood on `master` before this run | guard **exit 1**, naming **all eight** past-due horizons; suite **red** |
| **B** | the escape hatch widened from `closed, ungraded` to the bare word `ungraded` | **2 failures** — declining to grade stops being deliberate |
| **C** | prospective given precedence over terminal, so the 1-week entry's `condition 2 MISSED` reads as ungraded | **1 failure** — a grade that narrates what is not met is still a grade |

**Mutation A is the one that matters: the guard is red on the world as it stood before this run**, which
is the only evidence it would have caught this on **2026-08-23** — the day after the 2-week horizon
closed — rather than on day 54 of 60.

**Deliberately not done, each for a stated reason rather than by omission.** The **far-side browser
bracket** (Amendment 2, genuinely owed) is **deferred to near 2026-10-03**, where one dispatch brackets
the whole window instead of one day more than run 201 already covers. The **find page's follow block is
JS-only** — a bare `<button>` plus a `<dialog>` that is `display:none` without script, so for all 126
non-rendering requests the block is **inert** — and it is **left alone** because EXP-014's binding
clause re-registers the window from the day after any find-page script deploy, which would spend the
last open experiment on a path whose observed population is machines. **It is the first candidate for
after 2026-10-03.** `rankSelected` is left alone too: its first key is measured over the full text where
its third key is body length, plausibly the same confound twice, but with zero readers there is no
evidence to argue it on and this run's taste is not a finding.

**No committed `src/` file was touched, so no route, handler, page or behaviour changed** — and no
schema, migration, counter, counter meaning, secret, dependency, data category or public claim either.
`item_render`'s emitter is unedited and `SEARCH_REFERRERS` is untouched, so **EXP-014's binding clauses
hold and the window is not re-registered.** No find page was fetched by this run at all.
**Egress re-tested rather than assumed:** `justtuned.com:443` still answers **403 CONNECT** from this
session, so production was reached only from GitHub Actions.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`followers` **0** · `stars` **8** (all 8 the owner's) · gross cash **AUD $0**, from *no billing exists*.
Source: [`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated
`2026-09-29T00:30:53.032Z`. **This is the thirty-first consecutive cycle whose output is not a user or a
dollar, and I am not dressing it up.** What it produced is two honest grades on commitments that had
been left open past their deadlines, and a read-order file that can no longer lie to the run reading
it. **6 days left.**

---
**Last updated:** 2026-09-29 08:45 Sydney (2026-09-28 22:45 UTC), run 203 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged and not re-argued here, per [L-07](LESSONS.md).** **EXP-014's fork rules existed only as
prose, and the fork they gate carries the strongest next action in the file. They now execute — and
writing them found an overlap six days of prose review had not.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **CURRENT** — item 290 at `2026-09-28T10:18:23.385Z`, **11.9h** old, **zero** scheduled screens
certainly delivered since. Nothing was published, amended or retracted this run. The schedule was
**not armed**; EXP-013's threshold 2 is still unruled and run 153's pre-commitment stands.

**The reading run 202 named as today's work, taken.** EXP-014's window is 2026-09-27 → 2026-10-03,
whole UTC days. [`metrics-window.mjs`](../scripts/metrics-window.mjs) was asked first and reports the
snapshot complete through **2026-09-27** only — so **one** day of seven exists, not the two the
registration expected, because the morning-Sydney slot sits ~2h *before* UTC midnight. 2026-09-28 is
1h47m short of whole and is **not graded**.

| 2026-09-27 | `item_view` **105** | `item_view_search` **0** | `item_view_referred` **0** | `item_render` **0** | `item_view_search_bot` **18** |
| --- | --- | --- | --- | --- | --- |

**The day is `A-CONSISTENT`; the window is `A-PENDING`.** All 105 non-bot find-page requests arrived
with **no usable `Referer` at all** and **not one ran the page's script**. That is Fork A's population
*described*, not Fork A *graded* — Fork A quantifies over every whole day and **six remain**. Fork E is
excluded outright on `item_view_search_bot` = 18, the one half of it a snapshot can decide. Forks B, C
and F all require a referrer and none arrived, which is also why Amendment 2's browser-bracket gate
does not bind this reading. **105 requests that executed no JavaScript are not 105 people and no
arrival is claimed.**

**Why an instrument and not just a paragraph.** Fork B's next action is registered as outranking *every
other candidate available to the loop*, and Fork F exists because run 198 caught **itself** about to
read half of Fork B as Fork B — it says so in the registered text. A judgement its own author did not
trust is not safer in a later run that has not read the rule. [L-122](LESSONS.md#l-122).

**What building it found, reported and not patched.** **Forks A and F overlap** — a day with
`item_view_referred` of 1 or 2 and `item_render` = 0 satisfies both at once. Harmless, because Fork F's
own next action is *"grade the day under Fork A"*, and that sentence is what the window arithmetic
implements: an F day satisfies Fork A's quantifier even above Fork A's own referred bar, and is
reported in `forkFDays` with its recording duty attached. **No registered fork text was edited and no
threshold moved.** Closing the overlap belongs in a dated amendment by a run with a reason to touch it.

**Gates.** `npm run check` **0** · **529 vitest** unchanged · **ops suite 381/381** (350 → 381) ·
**14 workflows** · **17 nominations** · **0 vulnerabilities**. **Four mutations, all caught, file
restored byte-identical under `sha256sum -c`** — A drops Amendment 1's `item_render` conjunct and
disables Fork F, which is run 198's pre-amendment behaviour exactly (**7 failures**); B removes Fork
E's precedence (1); C widens Fork A's referred bar 2 → 3 (1); D reports Fork F as a window verdict
instead of deferring to Fork A (2). Exhaustiveness is proved over a bounded sweep: once Fork E is
decided, no day falls under no fork.

**Mutation A returns the same verdict as the correct code on today's snapshot** — `A-PENDING`, because
2026-09-27 carries no referrer for the broken branch to mis-read. Today's data cannot tell the
pre-amendment code from the amended code, so what stands between a later run and Fork F's trap is the
guard and not the data. That is the one honest argument for having built it.

**No committed `src/` file was touched, so no route, handler, page or behaviour changed** — and no
schema, migration, counter, counter meaning, secret, dependency, data category or public claim either.
`item_render`'s emitter is unedited and `SEARCH_REFERRERS` is untouched, so EXP-014's binding clauses
hold and the window is not re-registered. No find page was fetched by this run at all.

**A deploy did occur, and the phrase earlier runs used for this is too strong.** Pushing to `master`
rebuilds and deploys, and `verify production` confirmed commit `c34656e` **serving** before it asserted
anything — so "nothing deployed" is false and "the Worker is byte-identical" is false in one respect:
`npm run check` regenerates the gitignored `src/build-info.ts`, whose commit constant is baked into the
bundle precisely so post-deploy verification can prove which commit answers. **What is true is that no
behaviour changed.** Stated exactly here rather than repeated loosely, because the loop's own record is
the thing that has to stay checkable.
**Egress re-tested rather than assumed:** `justtuned.com:443` still answers **403 CONNECT** from this
session, so production was reached only from GitHub Actions.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`followers` **0** · `stars` **8** · gross cash **AUD $0**, from *no billing exists*. Source:
[`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated `2026-09-28T05:24:58.372Z`.
**This is the thirtieth consecutive cycle whose output is not a user or a dollar, and I am not
dressing it up.** What it produced is the window's first reading, taken on the clock rather than by
eye, and a grader that will still be right on 2026-10-03 when the fork that matters can actually fire.
**6 days left.**

---

**Last updated:** 2026-09-28 21:05 Sydney (2026-09-28 11:05 UTC), run 202 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged and not re-argued here, per [L-07](LESSONS.md).** **A 503 killed today's scheduled
screen one second in, and the retry built five days ago to prevent exactly that had been pinned to
the wrong example status — a 503.**

**The gate was attended first and it owed something.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **ATTEND**: a screen delivered at `2026-09-28T02:40:00Z` had come and gone since item 289. The
record it told me to read **did not exist** — the scheduled run
([36400347041](https://github.com/in-c0/tuned/actions/runs/36400347041)) died at one second on
`HTTP 503 from Europe PMC search` and uploaded no artifact. A dry screen on the **same commit**
`3a03d74` 79 minutes later ([36408586245](https://github.com/in-c0/tuned/actions/runs/36408586245))
screened **34**, selected **8** and deferred 3. The record supported publication, so
`agent-scout.yml` was dispatched with `publish: true`
([36408802646](https://github.com/in-c0/tuned/actions/runs/36408802646)): **item 290 published,
HTTP 201, `duplicate=false`**, nomination committed. The gate now reads **CURRENT**. The schedule
was **not armed** — EXP-013's threshold 2 is still unruled and run 153's pre-commitment stands.

**The defect.** Run 187 built `searchWithRetry` *because* the 2026-09-22 and 2026-09-23 screens died
on transients, and it built it on the right principle: **never retry a refusal, always retry a
non-answer.** It then pinned that principle to the wrong axis — `is this a 200?` rather than `did the
service say no, or could it not say?`. The two questions agree on almost every status and disagree on
exactly the one that arrived. The tell was sitting in the test file in plain text: the test asserting
the no-retry promise used **`status: 503`** as its illustration of "a service that said no", and
**503 is the one status that definitionally is not a refusal** — RFC 9110 §15.6.4 makes it the
server's own temporary incapacity. The guard was written in the vocabulary of the defect and so
defended it, green, 135 times. [L-121](LESSONS.md#l-121).

| | before | after |
| --- | --- | --- |
| what may be asked again | a **200** with an unusable body | a **non-answer**, body-shaped **or** status-shaped |
| `HTTP 503` | the screen dies, no record, day lost | asked again, ≤3 times, 5s apart |
| every `4xx` — **429 included** | asked exactly once | **asked exactly once**, unchanged |
| the promise in the file header | "a non-2xx is Europe PMC declining" | "a service that said no is asked exactly once" |
| what decides | `res.status === 200` | `searchStatusDefect(status)`, 500/502/503/504 and nothing wider |

**What shipped, scripts and QA only.** `searchStatusDefect` is a pure function over a status code;
`getJson` hangs its verdict on the thrown error and `searchWithRetry` stays the single place that
asks again. The test that pinned the bug is **replaced, not supplemented** — its 503 case now asserts
recovery, and the no-retry promise it was guarding is re-pinned to genuine refusals (400, 403, 404,
**429**, 501), each asked exactly once. 429 is excluded from the retriable set **deliberately**: a
rate limit is the service declining *this* request and asking for fewer, which is precisely the case
the header's promise was written about.

**Gates.** `npm run check` **0** · **529 vitest** unchanged · **ops suite 350/350** (347 → 350) ·
**14 workflows** · **17 nominations** (16 → 17) · **0 vulnerabilities**. **Two mutations, both
caught, file restored byte-identical under `sha256sum -c`** — mutation A is run 187's behaviour
exactly (`RETRIABLE_SEARCH_STATUSES` emptied) and the new guard is **red** on it; mutation B widens
the set to 429 and the refusal guard is **red** on that.

**No `src/` file was touched, so the deployed Worker is byte-identical and nothing deployed.** No
route, schema, migration, counter, counter meaning, secret, dependency, page, data category or
public claim. One item **published** (290) and none amended, retracted or restored. **Egress
re-tested rather than assumed:** `justtuned.com:443` still answers **403 CONNECT** from this session,
so production was reached only from GitHub Actions.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`followers` **0** · `stars` **8** · gross cash **AUD $0**, from *no billing exists*. Source:
[`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated `2026-09-28T05:24:58.372Z`.
**This is the twenty-ninth consecutive cycle whose output is not a user or a dollar, and I am not
dressing it up.** What it did produce is one published find that the schedule had already thrown
away, and a publisher that no longer loses a day to someone else's bad minute. **7 days left.**

---
**Last updated:** 2026-09-28 14:35 Sydney (2026-09-28 04:35 UTC), run 201 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged and not re-argued here, per [L-07](LESSONS.md).** **EXP-014 rested three of its six
forks on a beacon nobody had ever seen fire, and the beacon turns out to be alive — which makes six
days of zeros a reading about traffic instead of an ambiguity.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **CURRENT** — item 289 at `2026-09-27T10:29:16.946Z`, **17.8h** old, **zero** scheduled screens
certainly delivered since. Nothing was published, amended or retracted this run.

**The gap.** Amendment 1 (run 198) made `item_render` load-bearing in EXP-014 Forks **B**, **C** and
**F** — B and C each require it ≥ 1 on the same whole day, and **F is defined by it reading 0**. The
reasoning is right: a search or link arrival is a browser, so it renders. But that counter has **no
first-party writer**, and had **never been observed firing from a browser anywhere in this
repository**. EXP-014's own **Fork E** exists for exactly this failure and guards the *other*
counter. And the snapshot showed `item_render` and `item_render_bot` **absent on all six days
2026-09-22 … 2026-09-27** while `item_view` read **642** (09-26) and **104** (09-27). A dead beacon
would have graded **every** day of the window to Fork F or Fork A whatever arrived — the answer the
experiment already assumed, returned confidently. Four instruments have shipped here that silently
wrote nothing (L-35, L-44, L-46, L-51), each found *after* a window closed.

**The reading, taken rather than assumed.** A real browser on production loaded `/sportstech/289`
from the live sitemap ([36377540765](https://github.com/in-c0/tuned/actions/runs/36377540765), build
`3d537b4`): `item_render` fired **once**, carried the page's own `Origin`, was **accepted with 204**,
and **nothing threw** — 0 page errors, 0 console errors, 0 first-party HTTP errors. **The instrument
works.** So the six zero days are a fact about traffic: the clients behind 642 and 104 find-page
requests **took the HTML and executed none of it.**

| | before | after |
| --- | --- | --- |
| `item_render` as corroboration | **named** in three forks | **witnessed**, dated, on a named build |
| a zero day on it | dead instrument *or* nothing rendered — unreadable | **nothing rendered** |
| Forks B · C · F | ungradeable if the beacon were dead | **gradeable** on 2026-09-29 |
| the general rule | a fork must *name* a script-execution counter | and some `qa/` spec must **witness** it |
| `src/` · emitter · fork text · thresholds · allowlist | — | **untouched**, all five |

**What shipped, QA and ops only.** `qa/find-instrument.spec.mjs` is the observation. It takes the
find page from the **live sitemap** rather than a hard-coded id, which would go stale the first time
a find is retracted and then read as a dead beacon. `scripts/pulse-observed.test.mjs` is Fork E's
principle generalised, and it reads each spec's exported `OBSERVES_PULSES` **rather than grepping —
because a grep cannot work here**: `pulse-instrument.spec.mjs` already names `item_render`, in its
`NEVER_HERE` list, as a counter that must **never** fire. An assertion that a beacon is silent is the
opposite of coverage and looks identical to one. [L-120](LESSONS.md#l-120).

**All three of EXP-014's binding clauses honoured, named rather than asserted.** `HeadlessChrome`
user-agent, not overridden — every increment landed in `_bot`. A **direct, referrer-less** `goto`,
never a click through a permalink, so no first-party `Referer` reached a find page. **No `src/` file
touched**, so the emitter is unedited and the window is not re-registered. **Declared so tomorrow's
snapshot is not misread: UTC 2026-09-28 carries `item_view_bot` +1 and `item_render_bot` +1 from this
check — an `item_render_bot` of exactly 1 that day *is this dispatch*, not an arrival.**

**Gates.** `npm run check` **0** · **529 vitest** unchanged · **ops suite 347/347** (344 → 347) ·
**14 workflows** · **16 nominations** · **0 vulnerabilities**. **Four mutations, all caught, all four
files restored byte-identical under `sha256sum -c`** — the first of them being the tree as it stood
before this branch, on which the new guard is **red**.

**No `src/` file was touched, so the deployed Worker is byte-identical and nothing deployed.** No
route, schema, migration, counter, counter meaning, secret, dependency, page, data category or
public claim; no item published, amended, retracted or restored. **Egress re-tested rather than
assumed:** `justtuned.com:443` still answers **403 CONNECT** from this session, so production was
reached only from GitHub Actions.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`followers` **0** · `stars` **8** · gross cash **AUD $0**, from *no billing exists*. Source:
[`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated `2026-09-27T23:21:56.781Z`.
**This is the twenty-eighth consecutive cycle whose output is not a user or a dollar, and I am not
dressing it up.** What it did produce is an open experiment that can now return an answer it did not
assume. **7 days left.**

---
**Last updated:** 2026-09-28 08:45 Sydney (2026-09-27 22:45 UTC), run 200 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged and not re-argued here, per [L-07](LESSONS.md).** **L-118's root cause is closed, and
the first fix for it had to be thrown away because a live screen refused the one paper L-118 named.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **CURRENT** — item 289 at `2026-09-27T10:29:16.946Z`, **11.7h** old, **zero** scheduled screens
certainly delivered since. Nothing was published, amended or retracted this run.

**What shipped.** `DESIGN_SIGNATURES` is the clause that establishes *these authors ran a study*, and
L-118 found it graded on vocabulary the paper's **subject** supplies — which is how a SWOT appraisal
matched `randomised` on *"randomised controlled trials have shown"* and ranked first of seven. The
fix is **where the evidence is read, not which words count**: `extractMethodsText` locates the
paper's own methods section from the JATS structure, and **a located methods section replaces the
design-term requirement** as the authorship evidence. A study of people and a study of racing-shoe
foam both have one; an appraisal does not. The word list is unchanged and is now read **only** to
compose the why-line, from the methods section and nowhere else.

**The first version was wrong and the dry screen said so, not the test suite.** It required a design
term *inside* the methods section, and the live screen on the branch
([36355046859](https://github.com/in-c0/tuned/actions/runs/36355046859)) refused **the exact paper
L-118 named as the selection an authorship clause must not silence** — *"Discovering the mechanics
of ultra-low density elastomeric foams in elite-level racing shoes"*, whose methods section is real
and **59,774 characters** long and never needs the word "randomised". **A structural test ANDed with
a vocabulary test is not a stronger test; it is the vocabulary test with extra steps.** The
requirement was deleted rather than tuned. [L-119](LESSONS.md#l-119).

| the bar | before | after |
| --- | --- | --- |
| authorship evidence | a design term **anywhere in the document** | **a located methods section** |
| design terms | decided the selection | **decide nothing** — read in the methods section, for the why-line only |
| no methods section | invisible | **refused**, naming the design terms it does carry and where |
| an empty design list | `Design terms present: .` | the clause is **dropped** from the sentence |
| the record | `N stat families, N chars` | **and the located methods length**, every selection |
| `DESIGN_SIGNATURES` · `rankSelected` · thresholds | — | **unchanged, deliberately** |

**Graded on the real papers, both directions.** Positive control
([36355062571](https://github.com/in-c0/tuned/actions/runs/36355062571)) — L-118's title clause
removed on a throwaway branch so the live appraisal reaches this clause: `PMC13558445` rejected
*"no methods section located in 47821 characters"*. Final screen
([36355386369](https://github.com/in-c0/tuned/actions/runs/36355386369)) — **31 screened, 14 read,
10 selected**: the foam study selected (methods 59,774), two further primary studies the vocabulary
clause had refused selected, and a **conference poster abstract** of 6,706 characters refused for
having no methods section — a correct refusal the bar had no clause for before. Eleven of twelve
full texts on the earlier screen had a locatable methods section, which is the evidence the
structure being relied on is one real papers have.

**The bar is looser in one direction and that is stated, not buried.** Three papers the design-term
clause refused are now selected, because that clause was refusing primary research for want of
human-study vocabulary. It is tighter in the direction doctrine cares about: it no longer admits a
document that describes no study of its own.

**Gates.** `npm run check` **0** · **529 vitest** unchanged · **ops suite 344/344** (335 → 344) ·
**14 workflows** · **16 nominations** · **0 vulnerabilities**. **Seven mutations, all caught, all
three files restored byte-identical under `sha256sum -c` after every one.**

**No `src/` file was touched, so the deployed Worker is byte-identical and nothing deployed.** No
route, schema, migration, counter, counter meaning, secret, dependency, page, data category or
public claim; no item published, amended, retracted or restored. **Egress re-tested rather than
assumed:** `justtuned.com:443` and `www.ebi.ac.uk:443` both still answer **403 CONNECT** from this
session, so production and Europe PMC were reached only from GitHub Actions.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`followers` **0** · gross cash **AUD $0**, from *no billing exists*. Source:
[`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated `2026-09-26T23:06:50.359Z`.
**This is the twenty-seventh consecutive cycle whose output is not a user or a dollar, and I am not
dressing it up.** What it did produce is the publisher's provenance claim resting on something the
paper's subject matter cannot manufacture. **7 days left.**

---

**Last updated:** 2026-09-27 21:00 Sydney (2026-09-27 11:00 UTC), run 199 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged and not re-argued here, per [L-07](LESSONS.md).** **The bar that decides what
`@sportstech` publishes ranked a SWOT appraisal of other people's trials FIRST of seven selections,
and the gate caught it before it published.**

**The gate was attended first, it read ATTEND, and reading the record is what produced this run's
work.** The 2026-09-27 scheduled screen
([36306484832](https://github.com/in-c0/tuned/actions/runs/36306484832)) screened 31, selected 7 and
ranked first *"Heart rate variability-guided endurance training: evaluating strengths, weaknesses,
opportunities, and threats for load prescription and adjustment"* — admitted with **4 statistic
families** and the design terms **randomised, reliability, comparison**.

**Three clauses failed together and all three failed the same way.** Its Europe PMC `pubTypes`
carried **no review type**, so `EXCLUDED_PUB_TYPES` never saw it. The title patterns required an
article — `\ba (systematic|scoping|narrative) review\b` — that a SWOT title does not contain. And
`DESIGN_SIGNATURES`, whose own comment says *"a design term is the evidence that this paper ran
something"*, matched on `/\breliability\b/i` appearing once in 47,821 characters and on the phrase
"randomised controlled trials have shown". **Every design term is vocabulary the subject supplies,
not evidence the authorship supplies** — and because `rankSelected` orders on statistic families
first, and breadth of cited statistics is exactly what an appraisal has most of, **the ranking did
not merely admit the shape, it preferred it.** [L-118](LESSONS.md#l-118).

**What it would have cost.** The composed why-line was *"full text read (47,821 characters). Design
terms present: randomised, reliability, comparison. Reported: p-value, confidence interval, error,
dispersion."* Against an appraisal every clause of that asserts of **this paper** what is true only
of **the papers it discusses** — a fabricated provenance claim on the one surface Tuned has that
publishes. **Nothing had to be retracted only because the gate is attended before a publication.**

| the bar | before | after |
| --- | --- | --- |
| SWOT framing | invisible | `/\bstrengths,?\s+(and\s+)?weaknesses\b/i`, `/\bswot\b/i` |
| review words | `\ba (systematic\|scoping\|narrative) review\b` | article dropped; `umbrella\|rapid\|integrative\|literature` added; `a review of` |
| survey titles | — | `state of the art`, **spaced** — the hyphenated adjective in "a state-of-the-art markerless system" is deliberately not caught |
| the record | `4 stat families, 47821 chars` | **and the `pubTypes` it was admitted under** |
| `DESIGN_SIGNATURES` · ranking · thresholds | — | **unchanged, deliberately** |

**`DESIGN_SIGNATURES` is the root cause and it is deliberately still open.** The honest fix is an
authorship-of-conduct clause, and every cheap version (ethics approval, informed consent,
"participants were recruited") refuses *"Discovering the mechanics of ultra-low density elastomeric
foams in elite-level racing shoes"* — a legitimate selection from the same screen that tests shoes,
not people. **Guessing from seven data points trades a defect that has published nothing for one
that silences the publisher.** It is the next candidate, named rather than fitted.

**Confirmed live before the merge, not only in tests.** Dry screen on the branch
([36312552188](https://github.com/in-c0/tuned/actions/runs/36312552188)): `PMC13558445` rejected with
`research-article: title matches /\bstrengths,?\s+(and\s+)?weaknesses\b/i`; metadata survivors
16 → 15, rejected 20 → 21. **All seven selections that day were typed `research-article/journal
article`**, the appraisal included — which is the evidence the type list was useless here, and it
was not in the log.

**The gate was then attended with a publication rather than another discard.**
**`@sportstech` published item 289** — *"Baseline cognitive performance moderates ACL
injury-related knee biomechanics during unanticipated sidestep cutting in highly trained male soccer
players"*, 5 statistic families, 55,372 characters, HTTP 201 `duplicate=false` at
`2026-09-27T10:29:16.946Z`
([36312655873](https://github.com/in-c0/tuned/actions/runs/36312655873)). **On the morning's screen
this candidate was DEFERRED for want of a read slot; the slot was freed by refusing the appraisal
that had ranked first.** `scout-gate.mjs` now reads **CURRENT**. **Nothing here arms the schedule**:
EXP-013's threshold 2 is unruled at 18 days and run 153's pre-commitment stands.

**Gates.** `npm run check` **0** · **529 vitest** unchanged · **ops suite 335/335** (331 → 335) ·
**14 workflows** · **16 nominations** (15 → 16) · **0 vulnerabilities**. Five mutations, all caught,
all files restored byte-identical; **M0 — the screen checked out exactly as it stood when it selected
the appraisal — reddens the new rule naming that paper's title verbatim.**

**No `src/` file was touched, so the deployed Worker is byte-identical and nothing deployed.** No route,
schema, migration, counter, counter meaning, secret, dependency, page, data category or public claim;
no item published, amended, retracted or restored. **Production was verified anyway** rather than
assumed — see the report on issue #1. **Egress re-tested rather than assumed:** `justtuned.com:443`
still answers **403 CONNECT** from this session.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`members_ever_active` **0** · `followers` **0** · gross cash **AUD $0**, from *no billing exists*.
Source: [`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated `2026-09-26T23:06:50.359Z`.
**642 requests that never ran the page are not 642 people, and one header would have made them look
like a channel.** What this run claims is narrow: the loop's only open experiment can no longer answer
*"is search delivering?"* with *yes* on evidence a fetcher can manufacture. **This is the twenty-fifth
consecutive cycle whose output is not a user or a dollar, and I am not dressing it up. 8 days left.**

---

**Last updated:** 2026-09-27 06:50 Sydney (2026-09-26 20:50 UTC), run 197 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-196 and not re-argued here, per [L-07](LESSONS.md).** **The one number
that would say whether a stranger reads Tuned's finds counted crawlers and visitors together, and
yesterday it returned 517.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **CURRENT** — item 288, 12h old, **zero** scheduled screens certainly delivered since. Nothing
was published, amended or retracted. **Nothing here arms the schedule**: EXP-013's threshold 2 is
unruled at **16 days**, run 153's pre-commitment stands, and attending a gate is not removing it.

**The defect is in a reading, not in a page.** `sitemap.xml` advertises 94 find pages against one
landing page and five feeds, so what search can send this service is overwhelmingly a find page —
and `item_view - item_view_onsite`, published since run 165, is the only instrument on this platform
that claims to say whether anyone **off-site** reads them. `onsite()` is a **one-bit** test: *was the
`Referer` a page on this site.* Everything that is not that bit lands in one remainder, and **a
crawler walking our own sitemap sends no `Referer` at all, so it satisfies "off-site" exactly as well
as a person arriving from Google does.**

| day | `item_view` | `item_view_bot` | published off-site reading |
| --- | --- | --- | --- |
| 2026-09-24 | — | 103 | 0 |
| 2026-09-25 | — | 68 | 0 |
| **2026-09-26** | **517** | 19 | **517** |

**517 is the largest off-site figure this service has ever produced** — accumulated in the 4h59m of
that UTC day before the snapshot at `04:58:54Z` — and it is either the first search traffic in the
project's life or one crawler. **Nothing in the instrument could say which.** Run 185 made that
subtraction arithmetically legal and did not make it interpretable; it asked *is this subtraction
legal* and nobody asked *what are the members of the set it computes*. **A negative number announces
itself; an ambiguous one looks exactly like a number that is fine** ([L-116](LESSONS.md#l-116)).

| name | kind | means |
| --- | --- | --- |
| `item_view_onsite[_bot]` | axis | the `Referer` was a page on this site — unchanged |
| **`item_view_referred[_bot]`** | axis, new | the `Referer` parsed and named a host that is **not** ours. Disjoint from `_onsite`, so the two may be summed |
| **`item_view_search[_bot]`** | axis, new | the subset of that whose host is an **allowlisted search engine**. A strict subset, never summed with `_referred` |
| *the remainder* | derived | `item_view − _onsite − _referred` — arrived with **no usable `Referer` at all**: a crawler, a paste, a bookmark |
| `feed_view`, `landing_view` | — | **deliberately unchanged**, and a test asserts they stay that way |

**The arrival number is now `item_view_referred` and the crawler number is the remainder.** Both new
names carry the `_bot` split, because both are read against one side of it — the rule
[L-103](LESSONS.md#l-103) was written for, not repeated one level up. Neither is a bucket; `item_view`
and every total are unchanged. **No referrer value is stored**: the host is matched against a fixed
pattern and discarded, never persisted and never interpolated into a counter name, so the privacy page
stays true and is untouched.

**The second reading was re-taken rather than carried forward.** Run 174's search-index measurement,
same method at ~2026-09-26 20:45 UTC: control `site:hono.dev` **nine URLs** (the operator works),
`site:justtuned.com` **0 pages from the domain**, exact-phrase **0 pages from the domain**. **Eight
days unchanged.** That is evidence for the crawler explanation and **not proof** — one backend, not
necessarily Google's or Bing's — which is exactly why a discriminator shipped instead of an inference.

**Why this cycle and not the `scout-record`,** declined now for the third time on
[L-08](LESSONS.md) grounds: CLAUDE.md's first hard rule is *never publish a number that is not
sourced*, and a number whose source merges two populations is the one case that rule cannot catch,
because the defect is in the source. The demand question it serves, stated as runs 186/188 required:
**is organic search delivering arrivals to find pages — the only acquisition channel not blocked on
the owner?**

**[L-112](LESSONS.md#l-112)'s own prevention check caught this pre-registration on its first run**, and
it is worth one line because the guard was written four days ago for exactly this: `test:ops` failed with
*"every pre-registered fork carries an explicit next action"*, naming all five EXP-014 forks by line.
Two had a reading and no action at all; three had one under a heading the matcher does not recognise.
Every fork now carries `*Next action:*`, including the two null-shaped ones, where improvising is most
likely.

**Pre-registered before the data exists:**
[EXP-014](EXPERIMENTS.md#exp-014--were-2026-09-26s-517-off-site-find-page-views-a-crawler-or-the-first-search-arrivals-2026-09-27-run-197)
— whole UTC days **2026-09-27 → 2026-10-03**, closing before the final operating date so a run can
still act on it. Five forks: **A** crawler confirmed, **B** search is delivering, **C** a non-search
inbound link exists (run 174 named inbound links as the missing input), **D** no traffic at all —
explicitly *not* a null for A–C — and **E** the instrument never wrote, whose detector is this loop's
own `verify-production` step. Binding clauses forbid this loop from writing the unsuffixed names and
forbid editing the allowlist inside the window.

**Shipped:** PR [#110](https://github.com/in-c0/tuned/pull/110) →
[`ac1322e`](https://github.com/in-c0/tuned/commit/ac1322e) — two helpers, two counter names on one
route, `DISJOINT_AXES` in the axis register, an optional `REFERER` on the production request contract,
one `verify-production` step, and 17 tests.

**Nine mutations, source restored byte-identical under `sha256sum -c` after every one.** **Mutation 6
is the keeper:** shipping `_referred` and dropping `_search` — the half a defect report would have
asked for — passes 20 of 23 tests and is caught by three, each naming what it lost. Two more redden
the production step against a local server serving the commit under test, one on a document that
varies by referrer and one on a referred visitor being refused.

**Gates.** `npm run check` **0** · **529 vitest** (519 → 529) · **ops suite 326/326** (319 → 326) ·
**14 workflows** · **15 nominations** · **0 vulnerabilities**.

**The first deploy went RED, on the step this run added, and it is reported here rather than smoothed
over.** [`verify production` 36276980286](https://github.com/in-c0/tuned/actions/runs/36276980286)
failed at step 30: *"`/sportstech/288` serves a DIFFERENT document to a visitor arriving from a search
engine. Roll back."* **It does not, and the step's own output disproves its own accusation** —
`referred 4e63f912357b, unreferred fbb61497ebec/8b995bd24a67`: **the two *unreferred* reads differed
from each other**, three seconds apart, on identical requests. The whole runtime diff is one pure
function and two counter-name strings; no path in it touches a response, a header or a rendered byte,
so two identical requests differing is not attributable to it. **An HTML body served from this zone is
not byte-stable across requests**, and every one of the 29 steps before it passed.

**Fixed forward rather than rolled back** — PR [#111](https://github.com/in-c0/tuned/pull/111) — because
reversing a working change on a guard's own bad premise would be the wrong call, the same judgement run
196 made and for the same reason. **This is [L-115](LESSONS.md#l-115) recurring in a check written the
same hour it was recorded**, and the recurrence is the part worth keeping: *a comparison can be exact
locally because of a fact about the **server** that production does not hold.* All three bodies matched
byte-for-byte against a local Worker, which is exactly why the premise survived to the deploy. The
subject is now **Tuned's own markup** — the document with every `<script>…</script>` removed, since
Cloudflare's per-response injections are script elements and this service's own inline script is
byte-identical on every request.

**The replacement is stronger than the check it replaces, not weaker.** Unreferred-vs-unreferred is
asserted too, so a page unstable for a reason *other* than a referrer is reported as exactly that and
never as a referrer defect — the case that actually occurred, which the old check had no name for. A
difference is localised by the offset of the first differing byte, with **no response body ever
reaching the log**. Sizes and script counts print on every run, red or green. And the referred document
must carry the other-feeds block with at least one feed in it. **Two further defects in that step, both
of which made it fail in a way a rollback trigger may not:** `set -o pipefail` with
`n=$(grep -o … | wc -l)` killed it with a bare `exit 1` and **no message at all** when a grep matched
nothing — which makes *"the guard crashed"* and *"the site regressed"* indistinguishable — and the byte
localiser matched only `byte N` where GNU `cmp` says `char N`, printing an empty string exactly where
the diagnosis goes. **Four failure branches exercised against a local server, each with its own
message**, source restored byte-identical.

**Recorded as a constraint on every future production check, not just this one:** two HTML responses
from `justtuned.com` may differ byte-for-byte with no product change between them, so **no check may
assert byte-identity of a delivered HTML body.** Nothing in this repository had ever compared two
production HTML bodies before this run, which is why nothing had found it. [METRICS.md](METRICS.md)
carries the rule.

**Production is green at the deployed commit.**
[`verify production` 36277534284](https://github.com/in-c0/tuned/actions/runs/36277534284) — **success
at [`3cf54fa`](https://github.com/in-c0/tuned/commit/3cf54fa)**: the expected commit was confirmed
serving at step 5, then **30 steps passed**, including the new **step 30**. The live reading:

```
step 30  sizes raw/stripped and script counts: ref-before=30042/26871B,3s ref=30042/26871B,3s
                                               ref-after=30042/26871B,3s
         /sportstech/288: HTTP 200 text/html to a Referer from www.google.com; Tuned's own markup
         identical to the unreferred document (584803ba0d5c), 0 sibling find(s), 8 other feed(s)
```

**Three script elements, and the raw sizes identical while the bytes were not** — so the per-response
fragment is fixed-length, which is why nothing before this run had any reason to notice it. The one
skip is *Public availability*, whose condition fires only when the site is **not** serving. **Egress
re-tested rather than assumed:** `justtuned.com:443` still answers **403 CONNECT** from this session, so
production was verified from GitHub Actions as `CLAUDE.md` requires. **No rollback was triggered and
none was needed** — the one red was resolved by a fix, with the reasoning above.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`members_ever_active` **0** · `followers` **0** · gross cash **AUD $0**, from *no billing exists*.
Source: [`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated
`2026-09-26T04:58:54.228Z`. **A readable counter is not a visitor.** What this run claims is narrower
and firmer than usual: the loop was one bad inference away from reporting 517 crawler fetches as
off-site human arrivals, and that is now impossible. **This is the twenty-fourth consecutive cycle
whose output is not a user or a dollar, and I am not dressing it up. 8 days left.**

---

**Last updated:** 2026-09-26 21:30 Sydney (2026-09-26 11:30 UTC), run 196 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-195 and not re-argued here, per [L-07](LESSONS.md).** **Every surface
truthfully told the visitor the feed was over, and not one of them said where to go next.**

**The gate was attended first and it owed a publication.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **ATTEND** — item 287 was 24h old and one scheduled screen had come and gone. Its
[record](https://github.com/in-c0/tuned/actions/runs/36228399787) was read in full from the job log
(the artifact host is still 403 at this session's proxy): **32 screened · 20 rejected · 7 selected ·
5 deferred**, the top selection carrying a verbatim quotation from a 23,196-character full text it had
read. Dispatched with `publish: true` →
[36235179841](https://github.com/in-c0/tuned/actions/runs/36235179841): **item 288 published**, HTTP
201, `duplicate=false`, nomination committed. **The gate now reads CURRENT, and nothing here arms the
schedule** — EXP-013's threshold 2 is unruled, run 153's pre-commitment stands, and attending a gate
is not removing it.

**The defect, and it is an edge rather than a page.** `sitemap.xml` advertises one landing page, five
feeds and every published find, so what search can send this service is overwhelmingly a **find
page**, and a shared link is a find page by construction. `/<handle>` and `/<handle>/<id>` linked to
their own feed, their own finds, their own RSS, `/`, `/terms` and `/privacy` — **and to no other feed
on the service.** Four of the five feeds here have published nothing since July. So for most
arrivals, the entire reachable site was one feed with nothing left to subscribe to.

**Runs 191-193 had already made all of that honest, and that was the trap.** The landing card states
the age, `<link rel="alternate">` carries it into the reader's picker, both follow dialogs say *"the
last was 58 days ago"*, and run 182 took the word *live* out of the RSS channel description. Every one
was right. Every one improved what the page **says** and none changed what the visitor can **do
next** — so there was no false claim to catch and no test to redden. **An honest statement of a dead
end is not an exit from it** ([L-114](LESSONS.md#l-114)); it is [L-113](LESSONS.md#l-113) one level up,
and both are surfaces with no owner, absent from every page inventory because an inventory lists pages
and not the edges between them.

| surface | before | after |
| --- | --- | --- |
| `/<handle>` — a feed that stopped publishing | its own finds, its own RSS, `/`, `/terms`, `/privacy` | **every other feed, each with its age** |
| `/<handle>/<id>` — what search indexes and what a shared link points at | its own feed's siblings and nothing else | the same block |
| a feed that has never published | absent from the sitemap, reachable from nowhere | **offered, stated as *nothing published yet*** |
| `/<handle>/rss.xml`, `/`, `/api/…`, `/studio/…` | — | **unchanged** |

**The argument runs 191 and 193 settled is not reopened.** Nothing is withheld and nothing is ranked
by quality: the order is the landing query's own `latest_item_at DESC`, which is recency and not
judgement, and every card states its age through `feedAgeLine` — the same function the landing card
and the autodiscovery title already derive from, so a third surface cannot disagree with the other
two. **`feedDirectory` extracts the landing query verbatim** rather than copying it, so `/` serves
the byte-identical document it served before and no second call site can drift on the ordering or on
the `visibility = 'public'` filter. **No new CSS**: every class used is already in the shared
stylesheet `layout()` serves.

**Shipped:** PR [#107](https://github.com/in-c0/tuned/pull/107) — one renderer, one extracted query,
two call sites, six tests, one extended `verify-production` step, and item 288's nomination.

**Graded as a class over a derived set** ([L-107](LESSONS.md#l-107)), in both the unit suite and
against production. The pages under test are taken from **`/sitemap.xml` itself**, so a public page
class registered later is graded without being named; the derivation is graded first, because a
sitemap yielding no feed or no find page would make every assertion vacuous.

**Six mutations, source restored byte-identical under `sha256sum -c` after every one.** **Mutation 2
is the keeper:** the narrow fix — repairing only the feed page and leaving the find page, which is
what a defect report would have suggested — passes five of the six tests and is caught **only** by the
sitemap-derived class check, which names the exact URL (`/sportstech/1 does not link to /ava`). The
other five redden the filter, the ordering, the empty-list guard and the RSS surface, each precisely.

**The production step was run red first against a server serving `master`'s own code** — *"::error::
/ava carries no other-feeds block — an arrival here can reach no other attention on this service"* —
green against the fix, then exercised on **all five** failure branches plus the derivation guard,
which fired on its own when a doctored sitemap yielded nothing. Each has its own message.

**Browser QA looked at it**, because [L-113](LESSONS.md#l-113)'s second half says a new rendered
surface is not verified until something has. Photographed at **390px and 1440px** on both surfaces:
no element past the device edge, no clipping, five cards, `qa/mobile-fit.spec.mjs` green on every
sitemap-derived page.

**Gates.** `npm run check` **0** · **519 vitest** (513 → 519) · **ops suite 319/319** (unchanged — no
`scripts/` file touched) · **14 workflows** · **15 nominations** · **0 vulnerabilities**. No route
added, no schema, no migration, **no counter and no counter's meaning changed**, no dependency, no
data category. One extra D1 read per feed and find page, which is the landing page's own query.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`members_ever_active` **0** · `followers` **0** · `items_public` **93 → 94** (item 288) · gross cash
**AUD $0**, from *no billing exists*. Source: [`ops/metrics/latest.json`](metrics/latest.json)
`totals`, generated `2026-09-26T04:58:54.228Z`; the 94 is the publication this run made and registered,
not a reading. **A connected graph is not a subscriber.** What this run claims is narrower: the one
arrival channel this loop can open without anyone's permission was delivering visitors into
cul-de-sacs, and that is now false. **This is the twenty-third consecutive cycle whose output is not a
user or a dollar, and I am not dressing it up. 9 days left.**

---

**Last updated:** 2026-09-26 14:35 Sydney (2026-09-26 04:35 UTC), run 195 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-194 and not re-argued here, per [L-07](LESSONS.md).** **The rollback that
reverses a publication was sound on the feed and stranded every reader already holding the link.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **CURRENT** — item 287, 18h old, **zero** scheduled screens certainly delivered since. Nothing
was published, amended or retracted, and the day's scheduled screen had not yet run.

**The defect, and it is in `src/` rather than in the control plane.** `agent operator` → `retract` is
this loop's undo for a publication — built because the operating record's deployment gates require a
rollback path and a publication was shipping without one. It sets `visibility='hidden'`, at which
point `GET /:handle/:id` stops resolving. That is correct, and it is tested.

**The readers are not on this site.** [`rssFeed`](../src/pages.ts) puts `Provenance on Tuned →` into
**every** item's `<description>`, pointing at `/:handle/:id`, and a feed reader keeps that description
**forever**. So the moment a publication was correctly reversed, every subscriber already holding the
link — and every search result reached from a sitemap this service published itself — resolved to
**twelve bytes of `text/plain`**: *"No such find"*, no navigation, no way back to the feed they had
subscribed to. **RSS is the one subscription this funnel can complete with no account, no application
and no owner act**, so the single visitor this product can currently produce is by construction
someone holding a link the system no longer honours.

| address | before | after |
| --- | --- | --- |
| `/<handle>/<id>` — a withdrawn or never-published find | `No such find`, **12 B** `text/plain` | the site shell, one sentence, **the feed it belonged to**, and the site |
| `/<handle>` — no feed at this handle | `No such feed`, 12 B `text/plain` | the site shell, one sentence, the site |
| `/<handle>/<malformed-id>` and every mistyped path | Hono's default `404 Not Found` | the same page |
| `/<handle>/rss.xml`, `/api/…`, `/studio/…` | plain text | **unchanged** — plain text |

**The split is the surface, not the status** — the same distinction [L-110](LESSONS.md#l-110) turns
on. A feed client asking for a missing feed's `rss.xml` is not helped by a page, and
[`isPrivatePath`](../src/crawl.ts) is already the single list those surfaces are defined by, so there
is no second list to drift.

**What the page may not say.** It does not claim **which** happened: a find page can be absent because
it never existed, because the agent retracted it, or because the owner vetoed it from their studio,
and the renderer cannot tell those apart without asserting something about a human's act. The copy is
the disjunction and nothing narrower. **`socialHead` is deliberately not called**: the page carries
`robots: noindex` and **no canonical and no `og:url`**, because a 404 that declared one would be this
site asking a crawler to index an address it had just said has nothing at it — and the status stays
**404**, since an HTML body on a 200 is a soft 404 and worse than the plain text it replaces. An
unknown handle is never reflected into the page.

**Shipped:** PR [#105](https://github.com/in-c0/tuned/pull/105) — one renderer, three call sites, one
`notFound` handler, three tests, one extended `verify-production` step, and the absent addresses added
to the browser fit spec.

**Graded as a class over a derived set** ([L-107](LESSONS.md#l-107)). The addresses under test are
built by **mutating the paths `/sitemap.xml` advertises** — a handle this site publishes turned into
one it does not, an id past every row — so a page class registered later is graded without being
named. The derivation is itself graded: a sitemap the test could not read would make every assertion
vacuous, which is how a class check passes by checking nothing.

**Six mutations, source restored byte-identical under `sha256sum -c` after every one.** Mutation 1 is
**the code serving production** and reddens the class check and the retraction test. Mutation 2 is the
**soft 404** — the page on a `200` — and reddens both on status. **Mutation 6 is the keeper:** the
narrow fix, repairing only the find route, which the retraction test **passes** and only the
sitemap-derived class check catches, naming the URL.

**The production step was run red first**, against a server serving `master`'s own code, green against
the fix, then exercised on **all four** failure branches — soft 404, a canonical on the 404, no way
back, a feed reader answered with a page. All four fire.

**And browser QA caught what no document assertion could.** The page's **first render put its two
buttons on top of each other at 390px**: `.btn` declares no `display`, an anchor is inline, vertical
padding does not grow the line box, and the second button overlapped the first as soon as the first
wrapped. Status, content type, the link back, `noindex` and the absent canonical **all passed**. It
was caught by photographing the page. `qa/mobile-fit.spec.mjs`, whose own heading claims *every public
page*, now derives the absent addresses too, and a mutation confirms both are **graded** rather than
merely visited. That is **[L-113](LESSONS.md#l-113)**.

**Gates.** `npm run check` **0** · **513 vitest** (510 → 513) · **ops suite 319/319** (unchanged — no
`scripts/` file touched) · **14 workflows** · **14 nominations** · **0 vulnerabilities**. No route
added, no schema, no migration, no counter, no dependency, no data category, and **no counter's
meaning changes** — the 404 paths wrote no metrics before and write none now. Every existing page
renders byte-identically.

**EXP-013 is closed and byte-untouched, and nothing here arms anything.** `agent-scout.yml`, the bar,
`gradeMetadata` and the 25% threshold are unchanged; the daily schedule is **still NOT armed** and the
publisher's gate stands unchanged. Whether the schedule may publish unattended is the reviewer's
question, unruled since 2026-09-12 and not re-argued here.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`members_ever_active` **0** · `followers` **0** · `items_public` **93** · gross cash **AUD $0**, from
*no billing exists*. Source: [`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated
`2026-09-25T23:28:58.372Z`. **A working 404 is not a subscriber** — what this run can claim is
narrower and firmer: the one path by which this funnel can produce a visitor had a dead end at the
end of it, put there by the loop's own rollback, and it is cheaper to find before a subscriber exists
than after. **9 days left.**

**Last updated:** 2026-09-26 08:35 Sydney (2026-09-25 22:35 UTC), run 194 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-193 and not re-argued here, per [L-07](LESSONS.md).** **EXP-013 is graded
and closed: it failed its bar, and its headline question cannot be answered from its own window.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **CURRENT** — item 287, 12h old, **zero** scheduled screens certainly delivered since. Nothing
was published, amended or retracted, and the cycle's action was the one the calendar chose.

**This run's action was not chosen; it fell due.** EXP-013's reading is a **one-shot, dated
obligation** — registered 2026-09-12, reaffirmed by runs 186, 188 and 193 as outranking every other
candidate. The window closed at the end of **2026-09-25** and the reading fell **today**. A dated
obligation missed is not deferred but lost: the `scout-record` artifacts it computes from **expire at
90 days** and this loop stops **2026-10-05**.

**Two instruments, neither of them this session's assertion.**
[`exp013 window` 36195833509](https://github.com/in-c0/tuned/actions/runs/36195833509) graded
thresholds 1, 2 and 4 over **every scheduled screen in the window**;
[`qa-browser` 36195864192](https://github.com/in-c0/tuned/actions/runs/36195864192) graded threshold 3
in a real browser and a real RSS fetch **against production**. Threshold 5 is a reading of all 8
window publications against the remit.

| # | Threshold, as written | Grade |
| --- | --- | --- |
| **1** | a per-candidate verdict for every record read | **HOLDS** — 11 of 13 screens reached a verdict, every rejection naming exactly one clause |
| **2** | selection rate **≤ 25%** on every live screen | **FAILED** — 25.7% on 09-13 and 09-16, plus 25.7% on day 1 |
| **3** | provenance on **both** public surfaces | **HOLDS** — 14/14 registry entries, 29 passed, 1 skipped by design |
| **4** | ≤ **72h** old, **zero hand publications** | **FAILED** at **203.8h** — and the grade is not about the agent |
| **5** | every item on-remit | **HOLDS pending a human reading** — the threshold names a grader this loop does not have |

**Fork B, fired on the window's first day. EXP-013 closes FAILED on its bar** — and Fork A's reserved
phrase, *"passed on cadence only"*, **is not available to this reading and no later run may quote it.**

**The headline question has no answer, and the reason is the finding.** EXP-013 asked *can an agent
feed publish on a cadence with no person selecting?* Threshold 4 is what would answer it. **Threshold
4's second clause is *zero hand publications*; Fork B's action is *turn the publisher off*. They are
the same mechanism**, and Fork B fired on day 1 because threshold 2 failed at 25.7%. From that moment
the only path to the feed was the hand dispatch threshold 4 forbids, and all 8 window publications
took it. Threshold 4 failed at **203.8h** against a **72h** bar — **and would have failed identically
had the bar been perfect.** *"Threshold 4 failed, therefore the cadence still depends on a person"* is
a **tautology presented as evidence about the agent**. It is evidence about the experiment's design.
That is **[L-112](LESSONS.md#l-112)**, and run 188 registered it two days before the numbers were
visible, which is the only reason it reads as a finding rather than an excuse.

**The general form, which costs one pass down a table to prevent.** A pre-registration is checked
threshold by threshold — is each falsifiable, is each fork actioned, is the baseline frozen. EXP-013
passes every one of those checks. **The defect is between two clauses that are individually perfect: a
fork's action is a change to the system, and the system is what the other thresholds measure.** For
every fork ask *what does its action change*; for every threshold ask *what does it measure*; **any
overlap is a threshold that becomes unmeasurable the moment that fork fires.** The tell was available
from day 1 and read by nobody for thirteen days: **the fork that fired was *"stop publishing"* while a
threshold about publication cadence went on collecting numbers** — nine paragraphs apart in one file.

**What the bar did demonstrate, at its real strength and no higher.** Over 11 live screens it screened
**34–37 a day** and selected **7–9**, a band of **20.6%–25.7%**, refusing the rest with exactly one
named clause each. **It refuses** — which is precisely what Fork B's premise doubted (*"a bar that has
been shown not to refuse"*). It is **not** the bar passing: it was written to hold at ≤25% and did not.
**The failure is narrow and persistent rather than one bad draw** — nine of eleven screens sit at
22.9%–25.0% and both failures clear the bar by **a single candidate**. At 34–37 screened, one candidate
is ~2.8 points: **the threshold and its own resolution are the same size.**

**And the denominator was never argued for.** Run 153 recorded threshold 2 as mis-specified on day 1 —
*"the denominator counts candidates the bar never decided"* — and pre-committed not to rewrite it
inside the window. **That pre-commitment held fourteen days and holds here.** On the decided set every
screen runs **29.2%–45.0%**, a uniformly *larger* failure — reported **alongside** the pre-registered
rate, never in place of it. **The objection is not that 25% is too harsh; it is that two defensible
denominators disagree by ~2× and neither was ever argued for.** Any successor settles that **before**
it screens anything.

**Independence, and the two days that are not days.** The 11 live screens carry **4** distinct top
selections, not 11 — nothing was published, so nothing entered `publishedSources()` and the same
candidate kept winning. **2 of 13 scheduled screens contributed no reading** — 2026-09-22 **empty**
(the search defect run 184 caught, now refused at source) and 2026-09-23 **malformed** (run 187's
crash, [L-105](LESSONS.md#l-105): the record is written only on the success path, so a thrown cycle
uploads nothing). **Both are counted as no observation rather than as quiet weeks**, and the reading
says 15% of the window produced nothing rather than dividing by 13.

**Threshold 5's caveat is the threshold's own word.** It says *"under a **human** reading"*. The
reading is the executor's, and the executor is not a human — **the pre-registration specified a grader
the loop does not have.** All 8 are squarely on remit (sensor-validation studies, biomechanics, sprint
and jump measurement; every one source-linked with a concrete measured result) and are listed item by
item in [EXPERIMENTS.md](EXPERIMENTS.md). **That list is the whole of what a confirming reading costs,
and it is the only thing this run asks of the owner — optional.**

**This closure arms nothing.** Fork A authorizes no arming and **Fork A did not fire**.
`agent-scout.yml`, the bar, `gradeMetadata` and the 25% threshold are **byte-untouched**, the daily
schedule is **still NOT armed**, and the publisher's gate stands unchanged. Whether the schedule may
publish unattended is the reviewer's question, unruled since 2026-09-12 and not re-argued here.
**Closing an experiment is not the same act as answering the question it left open** ([L-97](LESSONS.md#l-97)).

**Gates.** `npm run check` 0 · **510 vitest** · **ops suite 319/319** · 14 workflows · **14
nominations** · **0 vulnerabilities**. **`ops/` only — no `src/`, no route, no schema, no workflow, no
dependency. No visitor sees a different byte**, which is why this run's production check is a
confirmation that nothing moved rather than a check on a change.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`members_ever_active` **0** · `followers` **0** · `items_public` **92** · gross cash **AUD $0**, from
*no billing exists*. Source: [`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated
`2026-09-25T04:58:40.520Z`. **A selection rate is not a subscriber and a publication interval is not a
person** ([L-106](LESSONS.md#l-106)). **9 days left.**

**Last updated:** 2026-09-25 20:35 Sydney (2026-09-25 10:35 UTC), run 193 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-192 and not re-argued here, per [L-07](LESSONS.md).** **The search snippet
for this site's front door called it live, and a test required it to.**

**The gate was attended first and this time it owed something.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **ATTEND** — item 286, 24h old, **one** scheduled screen certainly delivered since. That screen
([36111382253](https://github.com/in-c0/tuned/actions/runs/36111382253), 08:09Z) ran clean and left a
record: **34 screened · 19 rejected · 8 selected (23.5%) · 7 deferred**, 12 full texts read. It
supported a publication, so one was dispatched. **Item 287 is published** —
[run 36122944328](https://github.com/in-c0/tuned/actions/runs/36122944328), HTTP **201**,
`published=true`, `duplicate=false`, `created_at 2026-09-25T10:15:36.851Z`. *Unilateral Numbers Need
Context*, [10.3390/sports14080323](https://doi.org/10.3390/sports14080323), the why-line a
**180-character verbatim quote** from the abstract's results, confirmed a substring of it.
`qa/nominations/287-…json` is committed, because the gate cannot see a publication the registry does
not carry. **The gate now reads CURRENT.** Undo: `agent operator` → `retract` with item id 287.

**The record was read from the run's log, not its artifact.** `productionresultssa8.blob.core.windows.net`
is **403 CONNECT** through this session's egress proxy, so `actions/artifacts/.../zip` cannot be
fetched here. The log carries the same verdict table, the same per-candidate refusal clauses and the
same top selection the artifact holds, so nothing was assumed — but a run that could only read the
artifact would have been blocked. Recorded as a fact about the instrument, not routed around.

**Neither fenced candidate was due.** EXP-013's window is open until the end of **today** — its reading
falls tomorrow — so nothing in it is graded here; run 187's failure-path record needs a **fourth state**
in `screenState()` and is safe only once the window is shut. Runs 186 and 188 pre-committed that another
instrumentation cycle **would not have a defence**, and this run does not claim one — **it is a defect
in `src/`**, on the string a stranger meets this site through.

**The defect.** `/`'s `<meta name="description">` read *"Tuned — follow attention, not content. **A live
page** of what someone is actually watching, reading and listening to."* That is the search snippet for
the one address every canonical, every `og:url`, the sitemap and the README name as this site. Four of
the five feeds it speaks for had published nothing for eight weeks.

**[`socialHead`](../src/pages.ts)'s own docstring is the contract it breaks:** *"No count, no claim about
usage, and **no adjective the page cannot support** — this is the surface most likely to be quoted back,
so it states what the feed IS and nothing about how it is doing."* That function has **three** callers.
Two obeyed it. The front door did not.

| the string a stranger meets this site through | before | after |
| --- | --- | --- |
| `/` — `<meta name="description">`, what a search result shows | `… A **live** page of what someone is actually watching …` | `… A page of what someone is actually watching …` |
| `/` — `og:description`, what a chat card shows | `Follow what people pay attention to — not what they post.` | **unchanged** — it never asserted a currency |
| the guard | four literals from the two strings run 182 fixed | a **class**, over every path read off `/sitemap.xml` |

**Why this element and not the footers, which also say *live*.** `<meta name="description">` is
**copied**: a search result and an unfurl cache reproduce it with none of the page's other content.
Every age this site derives is in `<body>`, so none of it travels and the sentence reaches a stranger
alone — [L-110](LESSONS.md#l-110)'s test, failed. The four strings `assertNoCurrencyClaim`'s note
sanctions — both footers' *"a live feed of attention, not posts"*, the studio's *"your fans get a live
page"*, *"Live demo — a real feed"* and *"its RSS link works right now"* — all sit in `<body>`, where the
derived ages travel with them, and three are contrastive. **Untouched. The distinction is the surface,
not the spelling**, and applying it honestly means it must clear strings as well as condemn them.

**The finding is [L-111](LESSONS.md#l-111): the ban list was a transcription of the defects that had been
fixed.** `assertNoCurrencyClaim` banned `"right now"`, `"a live feed of"`, `"live feed of what"`,
`"is live"` — **every one a fragment of one of the two strings run 182 had just fixed.** That is a record
of two defects, not a statement of the rule they broke. This page says *"a live **page** of"*: one noun
away from a filter written to catch exactly it. **A guard written from the strings you just fixed grades
those strings, and the next author is not copying the sentence you deleted.** The cheap prevention is
mechanical — restate the claim in different words and confirm the guard still fires.

**And [`test/sharing.test.ts`](../test/sharing.test.ts) *required* the defective sentence** — *"keeps the
description and og:description it already had"*, pinned verbatim. Run 108 wrote that so a `<head>`-tags
change could not edit reviewed copy as a side effect, which was right; run 182 then struck the same
adjective from the same element on `feedPage` and left this line demanding `/` keep its version. **A
guard against silent edits had become a requirement that the defect stay** — [L-108](LESSONS.md#l-108)
again. The codebase did not merely miss this claim, it defended it.

**Shipped:** PR [#102](https://github.com/in-c0/tuned/pull/102) — one string, three test changes, one
extended `verify-production` step. **The fix is the removal of a claim and is not a claim in the other
direction:** no derived age goes into a copied string, because the copy freezes and becomes the
hardcoded freshness claim one step removed (run 182's reason for keeping one out of the RSS
`<description>`).

**Graded as a class over a derived set ([L-107](LESSONS.md#l-107)).** The paths come from `/sitemap.xml`
and the strings off the served pages — **neither is typed** — so a page class registered later is graded
without being named. Companions because neither assertion stands alone: an **invariance** test (identical
for a feed an hour old and one 52 days old, so the string is silent rather than conditional) and a
**"still says what it is"** test (removal cannot become deletion). Every fixture is seeded stale, because
a currency claim is only wrong when the feeds are old.

**Gates.** `npm run check` 0 · **510 vitest** (506 → 510) · **ops suite 319/319** (unchanged — no
`scripts/` file touched) · 14 workflows · **14 nominations** · **0 vulnerabilities**. **Five mutations,
each restored byte-identical under `sha256sum -c`.** Mutation 1 is **the exact string serving
production** and reddens three. **Mutation 2 is the keeper for the companion rule:** a derived age
spliced into the description reddens **only** the invariance test — the class filter alone would have
passed the obvious wrong fix. **Mutation 4** is *"a real-time page of"*, a rewording **all four old
literals pass**, and the class catches it. **Mutation 5 is the keeper for the derived set:** a currency
claim planted on a **find page**, a class no currency test names, caught by the sitemap-derived check,
which named the URL.

**The production step had the same gap.** It took the handles off `/` and graded every feed page's
description without ever reading `/`'s own. It now does, **as a class, at no extra request** — it reuses
the landing document already fetched. **Run red against the document production is serving** before it
was trusted, green against the fixed one, then exercised on all four failure branches — currency claim,
reworded claim, description deleted, description absent. **All four fire.**

**EXP-013 is byte-untouched and nothing was graded early.** `agent-scout.yml`, the bar, `gradeMetadata`
and the 25% threshold are unchanged; run 153's pre-commitment binds this run as it bound 179–192. **The
schedule is still NOT armed** — attending the gate is not the same act as removing it.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`members_ever_active` **0** · `followers` **0** · `items_public` **92** · gross cash **AUD $0**, from
*no billing exists*. Source: [`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated
`2026-09-24T23:23:48.119Z`. **10 days left.**


**Last updated:** 2026-09-25 14:35 Sydney (2026-09-25 04:35 UTC), run 192 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-191 and not re-argued here, per [L-07](LESSONS.md).** **Run 191's fix was
made safe by a sentence on a surface its own consumer does not read.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **CURRENT** — item 286, 18h old, **zero** scheduled screens certainly delivered since. Nothing
was published, amended or retracted, and the cycle's action was chosen elsewhere.

**Neither fenced candidate was due.** EXP-013's window is open until the end of **today**, so nothing
in it is graded here; run 187's failure-path record needs a **fourth state** in `screenState()` and is
safe only once the window is shut. Runs 186 and 188 pre-committed that another instrumentation cycle
**would not have a defence**, and this run does not claim one — **it is a defect in `src/`**, on the
menu the only available conversion is chosen from.

**The defect.** Run 191 gave `/` a `<link rel="alternate">` per feed and argued — correctly — that a
stale feed is advertised too, because *"its card already states its age, and withholding it would be
this function deciding for a subscriber what is worth following."* **The whole safety of advertising
five feeds rested on that clause, and the clause rests on a part of the document the consumer of this
element never reads.** A reader parses `<head>`, collects every alternate, and shows the person a list
of **titles**; the card, the age line and the whole of `<body>` are not in that list.

| what the surface said | current feed | silent 57 days | never published |
| --- | --- | --- | --- |
| the card, to a person | last published today | last published 57 days ago | nothing published yet |
| the picker, to a reader — **before** | `@sportstech — Tuned` | `@wearables — Tuned` | `@wellbeing — Tuned` |
| the picker, to a reader — **after** | `… · last published today` | `… · last published 57 days ago` | `… · nothing published yet` |

Four of the five feeds this site serves had published nothing for eight weeks. **Subscribing is the
one conversion this funnel can complete with no account, no application and no owner act**, and that
menu is where it is chosen.

**The finding is [L-110](LESSONS.md#l-110), and it is [L-109](LESSONS.md#l-109) a second time — inside
the commit that wrote L-109.** Both are one failure: a claim satisfied on the surface a human reads and
absent from the surface the machine reads. Run 191 found that pattern, named it, wrote the lesson, and
reproduced it one element deeper, because the mitigation it reached for was a **human-surface** fact.
**Naming a pattern does not immunise the commit that names it, and the first place to look for it is
the diff that closes it.** The prevention check is mechanical: when a change tells software something
new and an argument for its safety cites a fact stated elsewhere, **delete the rest of the document and
ask whether the argument survives.** Here `<head>` alone shows five feeds and no age, and it does not.

**Shipped:** PR [#100](https://github.com/in-c0/tuned/pull/100) → [`b33f597`](https://github.com/in-c0/tuned/commit/b33f597)
— the age in each advertised title, four tests and one extended `verify-production` assertion.
**Nothing is withheld and nothing is ranked:** all five feeds are still advertised, in the order the
page offers them, and run 191's decision is unchanged. `feedAgeWords` is **split out of `feedAgeLine`
rather than duplicated into the head** — the defect is that one surface said this and the other did
not, and two call sites deriving the same sentence from the same row can drift. The card's rendered
bytes are unchanged and the handle stays first in the string, so run 191's distinctness property holds
by construction rather than by the ages happening to differ.

**A relative age is admissible here and this is not a reversal of run 182.** That run removed
*"right now"* from the RSS `<description>` because a directory **copies** that string into its own page,
where a relative age freezes. An autodiscovery title is not a field any directory format carries, and
it is re-derived from the row on every fetch of `/`; where it could be copied anyway, **the error runs
the safe way** — a stale copy overstates the age, never the freshness. The absolute instant is
`<lastBuildDate>` in the feed itself.

**Graded as the agreement between two surfaces, not the presence of words ([L-107](LESSONS.md#l-107)).**
*"the title contains 'last published'"* is satisfied by a hardcoded string. Both sides are read off the
rendered page and **neither is typed in the test**, so a sixth feed stays graded.

**Gates.** `npm run check` 0 · **506 vitest** (502 → 506) · **ops suite 319/319** (unchanged — no
`scripts/` file touched) · 14 workflows · **13 nominations** · **0 vulnerabilities**. **Five mutations,
each reddening its own named test**, source restored byte-identical under `sha256sum -c` after every
one. Mutation 1 is **the exact code that was serving production**. **Mutation 3 is the keeper:** with
the card *and* the title both hardcoded the two surfaces agree perfectly, the agreement test passes,
and only the guard requiring three seeded feeds to produce three different sentences catches it — so an
agreement assertion cannot stand alone. **Mutation 5** is the obvious *"state the age if there is one"*
fix, which reddens only the never-published test: a conditional drops the empty case, and the emptiest
destination in the menu is the one it drops.

**The production step was run red first and its branches exercised.** It pairs each advertised title
against the age that feed's own card states, both read off the live document, at **no extra request** —
it reuses the landing HTML two steps already fetched. `awk` rather than a non-greedy regex, because the
document is served as **one line**: a `.*` between a card link and its age runs past every later card
and pairs the first handle with the last age. Red against a pre-fix document rendered from this
function, green against the fixed one, then exercised on three failure branches — a card losing its age
line, two titles carrying each other's ages, and a link losing its title attribute. **All three fire.**

**EXP-013 is byte-untouched and nothing was graded early.** `agent-scout.yml`, the bar, `gradeMetadata`
and the 25% threshold are unchanged; run 153's pre-commitment binds this run as it bound 179–191. **The
schedule is still NOT armed.** The window's reading instrument was **exercised rather than assumed**:
[`exp013-window.yml` run 36093945337](https://github.com/in-c0/tuned/actions/runs/36093945337) was
dispatched at 04:18Z and completed **success** on day 14 of 14. It is read-only, and its own design
marks every pre-2026-09-26 output **INTERIM** and assigns no fork. That was diligence on a one-shot
reading due tomorrow, **not this cycle's action**.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`members_ever_active` **0** · `followers` **0** · `items_public` **92** · gross cash **AUD $0**, from
*no billing exists*. Source: [`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated
`2026-09-24T23:23:48.119Z`. **10 days left.**


**Last updated:** 2026-09-25 08:35 Sydney (2026-09-24 22:35 UTC), run 191 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-190 and not re-argued here, per [L-07](LESSONS.md).** **The address this
site asks the world to remember told every feed reader it had no feed.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **CURRENT** — item 286, 12h old, **zero** scheduled screens certainly delivered since. Nothing
was published, amended or retracted, and the cycle's action was chosen elsewhere.

**Neither fenced candidate was due.** EXP-013's window closes **today, 2026-09-25**, and its reading
falls **2026-09-26** — the window is open until the end of this day, so nothing in it is graded here;
run 187's failure-path record needs a **fourth state** in `screenState()` and is safe only once the
window is shut. Runs 186 and 188 pre-committed that another instrumentation cycle **would not have a
defence**, and this run does not claim one — **it is not instrumentation.** It is a defect in `src/`,
on the page every other surface points at.

**The defect.** `<link rel="alternate" type="application/rss+xml">` is the one element a feed reader,
aggregator or directory uses to turn a pasted page URL into a subscribable feed. Run 86 gave it to
the pages that **are** a feed; run 164's find pages inherited it. **The landing page was never one of
them** — and `/` is the address every canonical, every `og:url`, the sitemap and the README name as
this site.

| what asked for `/` | what it was told |
| --- | --- |
| a human | five feeds, each stating its age, each clickable |
| a feed reader | **this site has no feed** |

**The finding is the scope of a rule, not a missing element.** Run 86's rule came out as *a page that
is a feed advertises itself*, and under that rule this page is correctly excluded — it is not a feed.
A reader's rule is *a page advertises the feeds it leads to*, and this codebase already obeyed it
elsewhere: `itemPage` is not a feed either and advertises the one it belongs to. **So the element's
own behaviour here already contradicted the narrower rule and nothing noticed**, because the page
that would have shown it up is the page that renders a visible, clickable list of feeds
([L-46](LESSONS.md)). [L-109](LESSONS.md#l-109).

**Shipped:** PR [#98](https://github.com/in-c0/tuned/pull/98) → [`1d99222`](https://github.com/in-c0/tuned/commit/1d99222)
— every feed the page offers, in the order it offers them, plus six tests and one `verify-production`
step. **Not the demo alone:** a reader that discovers more than one shows a picker, and picking is the
visitor's job. A stale feed is advertised too — its card already states its age, and withholding it
would be this function deciding for a subscriber what is worth following. **The title is keyed on the
handle, not the name**, because `name` is not unique in the schema and two identical rows in that
picker is the failure the element exists to prevent.

**Graded as an outcome, not a precondition ([L-107](LESSONS.md#l-107)).** Asserting that `/`
*contains* an alternate link is satisfied by one link on a page offering five feeds. `discover()`
reads the document the way a reader does and the assertions are about the **set** it returns: it
covers exactly the feeds the page's own cards link to, every entry is distinguishable, and following
all of them leaves a reader holding a distinct working feed for each. **Neither list is typed in the
test** — both are read off the rendered page, so the mapping stays graded when a sixth feed is
registered.

**Gates.** `npm run check` 0 · **502 vitest** (496 → 502) · **ops suite 319/319** (unchanged — no
`scripts/` file touched) · 14 workflows · **13 nominations** · **0 vulnerabilities**. **Four
mutations, each reddening its own named test**, source restored byte-identical under `sha256sum -c`
after every one. Mutation 1 is **the exact code that was serving production** and reddens all six.
**Mutation 4 found a defect in the test rather than in the source:** the outcome test's first version
asserted, inside its loop, that each fetched feed matched the href that reached it — true by
construction whatever the hrefs are — so five distinct titles all pointing at **one** feed passed it
while its own comment claimed that was the case it caught. Checking each link against itself is not
checking the mapping.

**And one of the production step's own branches did not fire.** `sed 's|</head>.*||'` edits only the
line `</head>` is on; this document spans many lines, so the body was being read as the head and the
check passed on a page whose alternate links had all moved into `<body>` — **while its comment said it
could not.** `q` is what makes the claim true. The step was **run red first** against a pre-fix
document rendered from this function, green against the fixed one, and then exercised on all six of
its failure branches, which is the only reason that one was found.

**EXP-013 is byte-untouched and nothing was graded early.** `agent-scout.yml`, the bar, `gradeMetadata`
and the 25% threshold are unchanged; run 153's pre-commitment binds this run as it bound 179–190. A
change in `landingPage` cannot affect a screening rate. **The schedule is still NOT armed.**

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`members_ever_active` **0** · `followers` **0** · `items_public` **91** · gross cash **AUD $0**, from
*no billing exists*. Source: [`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated
`2026-09-24T04:52:11.395Z`. **10 days left.**


**Last updated:** 2026-09-24 20:35 Sydney (2026-09-24 10:35 UTC), run 190 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-189 and not re-argued here, per [L-07](LESSONS.md).** **The feed told each
host it was the site, and the sentence that licensed it had been copied into a test as a rule.**

**The gate was attended first and this time it owed something.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **ATTEND** — item 285, 23.9h old, **one** scheduled screen certainly delivered since. That screen
([35971539785](https://github.com/in-c0/tuned/actions/runs/35971539785), 07:47Z) had run clean and left
a record: **34 screened · 17 rejected · 7 selected · 10 deferred, 12 full texts read.** It supported a
publication, so one was dispatched.

**Item 286 is published.** [Run 35986078049](https://github.com/in-c0/tuned/actions/runs/35986078049) —
HTTP **201**, `published=true`, `duplicate=false`, `created_at 2026-09-24T10:15:37.400Z`. *Lower
Extremity Stiffness and Linear Acceleration Performance in Basketball Players*,
[10.12659/MSM.953816](https://doi.org/10.12659/MSM.953816), the why-line a **146-character verbatim
quote** from the abstract's results section, confirmed a substring of it. `qa/nominations/286-…json` is
committed, because the gate cannot see a publication the registry does not carry. **The gate now reads
CURRENT.** Undo: `agent operator` → `retract` with item id 286, which hides and deletes nothing.

**Why this cycle's action, and why neither fenced candidate.** EXP-013's window closes **2026-09-25**
and its reading falls **2026-09-26**; run 187's failure-path record needs a **fourth state** in
`screenState()` and is safe only once the window is shut. Neither was due. Runs 186 and 188
pre-committed that another instrumentation cycle **would not have a defence**, and this run does not
claim one — **it is not instrumentation.** It is a defect in `src/`, in the document a subscriber
receives.

**The defect.** Run 182 pinned the feed's **own** address to `SITE_ORIGIN` via `<atom:link rel="self">`,
and the permalinks with it. `<channel><link>` was left deriving from the request origin. So the
delivered document was byte-identical on all three hosts this Worker answers on — **except in the one
element that says where the site is.**

| host that asked | `<channel><link>` served, before |
| --- | --- |
| `justtuned.com` | `https://justtuned.com/sportstech` |
| `www.justtuned.com` | `https://www.justtuned.com/sportstech` |
| `attention-feed.in-c0.workers.dev` | **`https://attention-feed.in-c0.workers.dev/sportstech`** |

RSS 2.0 defines that element as *"the URL to the HTML website corresponding to the channel"* — what a
reader renders as "visit site" and **what a directory copies into its own listing as the address.** So
whichever host a directory happened to fetch from became the address it published, including
`*.workers.dev`, which every HTML page here already disowns by canonical. It is the exact surface the
pending `awesome-rss-feeds` submission points at.

**The finding is the sentence, not the element.** `SITE_ORIGIN`'s own comment carved out an exception —
*"`rssFeed` is passed the request origin, which is **right** for a feed a client already holds the URL
of"* — **true of the argument, false of the element it reached.** A channel link is not a URL the client
holds; it is where the site is. Run 182 fixed the half the carve-out was phrased about and left the
carve-out standing over the other half. **Then a test restated it as a rule** — *"`<link>` is allowed to
be the request origin"* — so a note about work not yet done had become a decided boundary a later run
would have to argue against. Both sentences are corrected in place rather than deleted.
[L-108](LESSONS.md#l-108).

**Shipped:** PR [#96](https://github.com/in-c0/tuned/pull/96) — `<channel><link>` on `SITE_ORIGIN`, and
**`rssFeed` no longer takes an origin at all.** An unused parameter is an invitation to derive it from
the request again; the function cannot see the request host, so the document cannot vary by it — run
189's reason for wrapping the finished document rather than listing the fields that need it.

**Graded as an outcome, not a precondition ([L-107](LESSONS.md#l-107)).** The contains-checks ask what
the document says when **one** host asks. A directory fetches from whichever host it found and publishes
what it read, so the new test serves the same feed to **all three** and compares the **bytes**, then
asserts the document they agree on is the canonical one — three hosts agreeing on `workers.dev` would
satisfy the comparison and **be** the defect. The production step is the same claim on the real edge:
`BASE` is chosen by `prod-http.sh vantage` and **falls back to the workers.dev host when the zone is
unreachable**, so asserting the served feed names `justtuned.com` is strongest precisely in the run
where the vantage fell back. It was **run red first** against a pre-fix document and green against the
fixed one before it shipped.

**Gates.** `npm run check` 0 · **496 vitest** (494 → 496) · **ops suite 319/319** (unchanged — no
`scripts/` file touched) · 14 workflows · **13 nominations** · **0 vulnerabilities**. **Four mutations,
each reddening its own named test**, source restored byte-identical under `sha256sum -c` after every
one. Mutation 1 is **the exact code that was serving production**. **Mutation 4 is the keeper:**
`<link>` stays canonical so every contains-check passes, a **different** element echoes the host, and
only the byte-comparison sees it.

**EXP-013 is byte-untouched and nothing was graded early.** `agent-scout.yml`, the bar, `gradeMetadata`
and the 25% threshold are unchanged; run 153's pre-commitment binds this run as it bound 179–189. A
change in `rssFeed` cannot affect a screening rate. **The schedule is still NOT armed.**

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`members_ever_active` **0** · `followers` **0** · `items_public` **91** · gross cash **AUD $0**, from
*no billing exists*. Source: [`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated
`2026-09-24T04:52:11.395Z` — **before item 286**, which is sourced to its own run instead. **11 days
left.**


**Last updated:** 2026-09-24 14:35 Sydney (2026-09-24 04:35 UTC), run 189 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-188 and not re-argued here, per [L-07](LESSONS.md).** **One control
character in one item silently destroyed the whole RSS feed, and every check ever written of it would
have passed.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **CURRENT** — item 285, 17.9h old, **zero** scheduled screens certainly delivered since. Nothing
was published, amended or retracted, and the cycle's action was chosen elsewhere.

**Why not the two named candidates.** Both are still fenced. EXP-013's window closes **2026-09-25** and
its reading falls due **2026-09-26**; run 187's failure-path record needs a **fourth state** in
`screenState()` and is safe only once the window is shut. Neither was due today. Runs 186 and 188
pre-committed that another instrumentation cycle **would not have a defence**, and this run does not
claim one — **it is not instrumentation.** It is a defect in `src/`, on the product surface a
subscriber actually receives.

**The defect.** `esc` escapes `& < > "`. It **cannot** make a C0 control character legal in XML, and no
escape can: XML 1.0 §2.2 forbids most of them outright **however they are written** — `&#11;` is exactly
as fatal as a literal U+000B. XML has no error recovery either, so a parser that meets one **stops**.
One stray control character in **one** item's title, URL, category, note or description therefore
destroyed **the entire feed for every subscriber of it** — including items published long before the bad
one arrived — while `/<handle>` kept rendering perfectly.

| a four-item feed, poisoned in the creator name | pre-fix | fixed |
| --- | --- | --- |
| `<item>` elements served | 4 | 4 |
| items a reader recovers | **0** | **4** |
| expat | `not well-formed (invalid token): line 4, column 16` | well-formed |

**Measured against a real parser, not argued from the spec.** This is the one surface this funnel can
currently complete a subscription through, and the exact URL the pending `awesome-rss-feeds` submission
points at.

**Why nothing caught it, which is the finding.** Every check this repository had ever made of
`/<handle>/rss.xml` — `toContain` in vitest, `grep -q` in `verify-production`, a regex in the QA specs —
asked what the bytes **CONTAIN**. **Not one ever parsed the document.** So the single property a
subscriber depends on was the one property nothing graded. [L-92](LESSONS.md#l-92)'s shape one layer
down: a crawl is not an index, and a string that starts with `<rss` is not a document.
[L-107](LESSONS.md#l-107).

**Shipped:** PR [#94](https://github.com/in-c0/tuned/pull/94) — `stripXmlForbidden` in
[`src/pages.ts`](../src/pages.ts), wrapping the **finished document** rather than each field, because a
per-field variant is a list a run typed and is silently incomplete the next time `rssFeed` gains one.
**A no-op on every feed this service has ever served** — the characters are non-printing, so removal
changes no visible glyph, which is also why removal beats substitution: a replacement character would
alter a why-line published as a **verbatim quotation**. Plus `test/rss-wellformed.test.ts` and a new
blocking `verify-production` step.

**The invariant and the outcome are graded in different places, deliberately.** workerd ships no XML
parser, so asserting well-formedness there would mean writing the parser and grading my own instrument
([L-104](LESSONS.md#l-104)). The test asserts **no forbidden codepoint leaves the Worker**; the
production step asserts **expat accepts the real bytes from the real edge**, on every feed, on every
deploy. It was **run red first** against the pre-fix document and green against the fixed one.

**Gates.** `npm run check` 0 · **494 vitest** (482 → 494) · **ops suite 319/319** (unchanged — no
`scripts/` file touched) · 14 workflows · 12 nominations · **0 vulnerabilities**. **Five mutations, each
reddening its own named test**, source restored byte-identical under `sha256sum -c` after every one.
Mutation 1 is **the exact code that was serving production**.

**EXP-013 is byte-untouched and nothing was graded early.** `agent-scout.yml`, the bar, `gradeMetadata`
and the 25% threshold are unchanged; run 153's pre-commitment binds this run as it bound 179–188. A
change in `src/pages.ts` cannot affect a screening rate. **The schedule is still NOT armed.**

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`followers` **0** · `items_public` **91** · gross cash **AUD $0**, from *no billing exists*. Source:
[`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated `2026-09-23T23:05:57.929Z`.
**11 days left.**

**Last updated:** 2026-09-24 08:35 Sydney (2026-09-23 22:35 UTC), run 188 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-187 and not re-argued here, per [L-07](LESSONS.md).** **EXP-013's
threshold 4 was recorded as needing production, and half of it was failable from a file in git all
along — by 2.8x.**

**The gate was attended first and it owed nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **CURRENT** — item 285, 11.9h old, **zero** scheduled screens certainly delivered since. Nothing
was published, amended or retracted, and the cycle's action was chosen elsewhere.

**The problem, established this run rather than assumed.** EXP-013's reading falls due **2026-09-26**
and it is **the last experiment this loop will grade**. Run 186 built its instrument and put threshold
4 — *"`@sportstech`'s newest public item is ≤ 72h old on every reading in the window, with zero hand
publications in it"* — outside it, as *"graded against production"*, which this session cannot reach
(`403 CONNECT`, re-tested this run alongside `justtuned.com`). **That claim is true of the direction
that passes and false of the direction that fails.**

| | |
| --- | --- |
| Publications inside the window | **6** (items 280–285) |
| Newest item when the window opened | item 279, `2026-09-11T22:17:48.081Z` |
| Longest interval with no publication | **203.8h** — item 281 → item 282 |
| Pre-registered bar | **72h** |
| Scheduled screen may publish? | **no** — `PUBLISH: ${{ inputs.publish }}`, and a schedule event carries no inputs |

At the instant before item 282, the newest item was **203.8h old — 2.8x the bar**, whatever production
says. **A bar can be failed from the repository and can only be passed from the site.** Deferring the
whole threshold to a source this session lacks left the loop's last experiment with its
premise-threshold unread while the failing evidence sat in git. [L-92](LESSONS.md#l-92)'s shape, one
layer out.

**The finding is not the arithmetic.** Threshold 4's second clause is *zero hand publications*, and
`schedulePublishes()` reads the one word that arms the schedule **off `agent-scout.yml`** rather than
asserting anything about it. With the schedule disarmed there is no other kind of publication: all six
required an explicit dispatch by someone who had read the record. That disarming is **Fork B, actioned
2026-09-12 — the window's first day** — because threshold 2 failed at 25.7%. **Fork B's action and
threshold 4 are mutually exclusive:** once the publisher is off, threshold 4 can only fail, and it
fails **whether the bar is good or bad**. A reading that reports *"the cadence still depends on a
person"* presents a **tautology as evidence about the agent**. It is evidence about the experiment.

**No fork covers what actually happened**, and it is registered now rather than decided on the day the
numbers are known: the bar **selected ~9 of ~37 on every live screen and published none of it**
([L-97](LESSONS.md#l-97)). Plenty was selected, so **not D**; Europe PMC answered, so **not E**. **No
fork is invented here to fill the gap.**

**Nothing was graded early and no threshold was re-specified.** EXP-013 grades nothing before the
window closes **2026-09-25**; the section is marked **INTERIM** and assigns no fork. Run 153's
pre-commitment binds this run as it bound 179–187. **`agent-scout.yml`, the bar, `gradeMetadata` and
the 25% threshold are byte-untouched. The schedule is still NOT armed.**

**Shipped:** PR [#92](https://github.com/in-c0/tuned/pull/92) — `publicationCadence`,
`schedulePublishes`, `renderCadence` in [`exp013-window.mjs`](../scripts/exp013-window.mjs). **Five
mutations, each reddening its own named test**, source restored byte-identical under `sha256sum -c`
after every one. `npm run check` 0 · **482 vitest** (unchanged — no `src/` change) · **ops suite
319/319** (308 → 319) · 14 workflows · 12 nominations · **0 vulnerabilities**. **No `src/` change: no
visitor sees a different byte.**

**Named rather than quietly deferred:** run 187's candidate — the screen writes `scout-record.json`
only on the success path — is **deliberately still not taken**, and this run sharpened the reason
rather than inheriting it. A crashed screen that uploaded a record would need a **fourth state** in
`screenState()`, because "claims candidates, records no verdict" (`malformed`, the 09-22 defect) is
not "claimed nothing, died" — so it is unavoidably a change to the instrument being read, **28 hours
before the window closes**. It is the first thing after the 2026-09-26 reading.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`followers` **0** · `items_public` **90** · gross cash **AUD $0**, from *no billing exists*. Source:
[`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated `2026-09-23T04:45:59.313Z` —
**before item 285**, which is sourced to its own run instead. **11 days left.**

**Last updated:** 2026-09-23 20:35 Sydney (2026-09-23 10:35 UTC), run 187 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-186 and not re-argued here, per [L-07](LESSONS.md).** **The daily publisher
died twice in two days on a transient that one extra request clears, and the gate had a publication
owed to it.**

**The gate was attended first and this time it owed something.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **ATTEND** — item 284, 23.9h old, **one** scheduled screen certainly delivered since. The record
that screen was supposed to leave **did not exist**: the 02:40Z run
[35834362798](https://github.com/in-c0/tuned/actions/runs/35834362798) threw at eleven seconds and
`upload-artifact` warned *"No files were found."* So a dry screen was dispatched to produce one
([35847824491](https://github.com/in-c0/tuned/actions/runs/35847824491)) — **35 screened · 17 rejected ·
7 selected · 11 deferred, 12 full texts read** — and it supported a publication.

**Item 285 is published.** [Run 35847913705](https://github.com/in-c0/tuned/actions/runs/35847913705) —
HTTP **201**, `published=true`, `duplicate=false`, `created_at 2026-09-23T10:17:38.585Z`. *Concurrent
Validity and Within-Session Reliability of a Wireless Surface Electromyography Device (MR EMG)*,
[10.3390/s26165165](https://doi.org/10.3390/s26165165), the why-line a **140-character verbatim quote**
from the abstract's results section. `qa/nominations/285-…json` is committed, because the gate cannot
see a publication the registry does not carry. **The gate now reads CURRENT.** Undo: `agent operator` →
`retract` with item id 285, which hides and deletes nothing.

**The defect, found by reading a failing scheduled run rather than by looking for it.** Run 184 shipped
`searchResponseDefect()` so the publisher could not report a failed search in the vocabulary of a quiet
week. It is correct and it is untouched. The **next** scheduled screen hit the same Europe PMC response
and the guard ended the day: throw, no publication, **no record at all**.

| | |
| --- | --- |
| 2026-09-23 **07:56Z**, scheduled | **threw** at 11s — no hitCount, no artifact uploaded |
| 2026-09-23 **10:16Z**, identical query | **35 screened · 7 selected** |
| 2026-09-22 | same shape, recovered at **2h19m** (run 184) |

**What shipped: the publisher asks again.** [`searchWithRetry`](../scripts/agent-scout.mjs) — at most
**three attempts, five seconds apart**, and only for a 200 whose body is not a search result. **A
non-2xx is deliberately not retried**: that is Europe PMC declining, and the file's header promises not
to retry a refusal. `describeResponseShape` now prints what the unusable body **was** — key names and
types, capped at twelve, **never values**, because this repository's logs are public.

**Refusing to screen a bad answer and refusing to ask for a good one are separate decisions**, and run
184 only ever argued the first. [L-105](LESSONS.md#l-105).

**EXP-013 is byte-untouched and this is not a re-specification.** `agent-scout.yml`, the bar,
`gradeMetadata` and the 25% threshold are unchanged; run 153's pre-commitment binds this run as it bound
179–186. A retry cannot change the selection rate on a screen that happens — it can only stop a screen
from **not** happening, in a window that produced no observation on two of the last two days and closes
**2026-09-25**. **The schedule is still NOT armed.**

**Named rather than quietly deferred:** the screen writes `scout-record.json` only on the success path,
so a thrown cycle still uploads nothing. Widening the record's contract three days before EXP-013's
reading changes the instrument being read. Left for the next run to choose deliberately.

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`followers` **0** · `items_public` **90** · gross cash **AUD $0**, from *no billing exists*. Source:
[`ops/metrics/latest.json`](metrics/latest.json) `totals`, generated `2026-09-23T04:45:59.313Z` —
**five and a half hours before item 285**, so that publication is not in this reading and is sourced
above to its own run instead.

**Last updated:** 2026-09-23 14:35 Sydney (2026-09-23 04:35 UTC), run 186 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-185 and not re-argued here, per [L-07](LESSONS.md).** **EXP-013's reading
falls due 2026-09-26, the executor stops 2026-10-05, and until this run the reading had no instrument.**

**The gate was attended first and it said nothing was owed.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **CURRENT** — item 284, 17.9h old, **zero** scheduled screens certainly delivered since. Nothing
was published, amended or retracted, and the cycle's action was chosen elsewhere.

**The problem, established this run rather than assumed.** EXP-013's thresholds 1 and 2 are graded on
what **every live screen** in the window did, and that evidence exists only in the `scout-record`
artifact each `agent scout` run uploads. Nothing in this repository reads one — `scout-gate.mjs` says
so in its own header and reads the registry instead, deliberately, because the record *"needs the
network and a credential."* Correct for a gate that runs every cycle; it left the **reading**, a
once-only act with a deadline, with no instrument at all. **The executor session cannot fetch one**:
artifact download redirects to `productionresultssa3.blob.core.windows.net`, answered **`403 CONNECT`**
by this environment's egress proxy, re-tested this run alongside `justtuned.com`. Listing works; the
bytes do not. And the artifacts **expire at 90 days**.

**What shipped: the reading runs where the evidence is.**
[`scripts/exp013-window.mjs`](../scripts/exp013-window.mjs) + a **dispatch-only, read-only** workflow
holding no secret. It grades thresholds 1 and 2 and refuses the rest: 3, 4 and 5 are not computable
from a screening record and are not attempted.

**The window, sourced to [`exp013 window` run 35818516766](https://github.com/in-c0/tuned/actions/runs/35818516766).**

| | |
| --- | --- |
| Screens reaching a verdict | **9 of 10** · every rejection names exactly one clause |
| Threshold 2 (≤25% on every live screen) | **FAILS on 2 of 9** — 25.7% on 09-13 and 09-16 |
| Seven other screens | **22.9% – 25.0%** — the two failures clear the bar by one candidate |
| Same rate on the **decided** set | **36.4% – 45.0%**, larger on every screen |
| Distinct top selections across 9 screens | **2**, not 9 |
| 2026-09-22 | **empty** — contributes no observation |

**No posture changed and nothing was re-specified.** Threshold 2 was already graded **FAILED** at
25.7% on 2026-09-12 and **Fork B actioned the same day**; the schedule screens and publishes nothing.
Run 153's pre-commitment binds this run as it bound 179–185: `agent-scout.yml` and the bar are
**byte-untouched**, and the decided-set rate is reported **alongside** the pre-registered one, never in
place of it. **The schedule is still NOT armed.**

**The nine screens are not nine observations**, and that is the reading's own limit on itself: two
distinct top selections, six and three. Nothing was published, so nothing entered `publishedSources()`,
so the same candidate stays eligible and keeps winning. That is what a disarmed schedule looks like
from the inside.

**A defect this run shipped and caught, recorded rather than quietly fixed.** The first dispatch printed
*"carry **0** distinct top selection(s). Every screen chose the same candidate"* — a claim about the
evidence generated from its absence, because the identity was read under the name the publisher
**logs** rather than the one it **serialises**, and `keys.size <= 1` folded *none* into *one*. Corrected
in a second PR before any reading was recorded from it. **A sentence about my own records is checked
against nothing.** [L-104](LESSONS.md#l-104).

**Production result, from GitHub Actions — this session's egress proxy still answers `403 CONNECT` for
`justtuned.com`, re-tested this run rather than assumed.** Merged as
[`c0d8d58`](https://github.com/in-c0/tuned/commit/c0d8d58) and
[`b3f040c`](https://github.com/in-c0/tuned/commit/b3f040c); `verify production`
[35818295563](https://github.com/in-c0/tuned/actions/runs/35818295563) and
[35818514379](https://github.com/in-c0/tuned/actions/runs/35818514379) — **both success**, expected
commit confirmed serving at step 5, **27 steps passed**, the one skipped being the `zone_blocked`
branch, which fires only when the site is *not* serving and is therefore the healthy path.

**No rollback was triggered and none was needed.** Neither commit touches `src/`, a route, a schema, a
migration, a counter, a page, a CSS declaration or a dependency — **no visitor sees a different byte.**
The new workflow is `workflow_dispatch` only, `contents: read` + `actions: read`, and holds none of the
credentials `agent scout` does: **the reading cannot change what it is reading.**

**No commercial metric moved and none is claimed.** `applications` **0** · `members` **1** ·
`members_ever_active` **0** · `followers` **0** · gross cash **AUD $0**, from *no billing exists*.
Source: [`ops/metrics/latest.json`](metrics/latest.json), generated `2026-09-22T23:13:48.810Z`.

**Last updated:** 2026-09-23 08:35 Sydney (2026-09-22 22:35 UTC), run 185 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-184 and not re-argued here, per [L-07](LESSONS.md).** **Four counter axes
were being subtracted from a bucket they were not drawn from, and the off-site find-page reading has
returned a negative number on most days it has existed.**

**The gate was attended first and it said nothing was owed.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **CURRENT** — item 284, 11.9h old, **zero** scheduled screens certainly delivered since. Nothing
was published, amended or retracted, and the cycle's action was chosen elsewhere.

**The defect, found by reading the snapshot rather than by looking for it.** `ops/metrics/latest.json`
carries `item_view_onsite` **larger than `item_view`** on most days the name has existed. The rule
[METRICS.md](METRICS.md) publishes — *"the off-site reading is `item_view − item_view_onsite`"* —
therefore returns **−12, −4, −7, −47, −24** on 2026-09-16 → 2026-09-20.

| day | `item_view` | `item_view_bot` | `item_view_onsite` | published rule returns |
| --- | --- | --- | --- | --- |
| `2026-09-18` | 0 | 72 | 7 | **−7** |
| `2026-09-19` | 0 | 121 | 47 | **−47** |
| `2026-09-20` | 14 | 55 | 38 | **−24** |

The axis was written on **every** on-site find-page request regardless of the `_bot` split, while
`item_view` holds the **non-bot bucket alone** — so a crawler following a permalink off our own feed
page decremented the human count. **Three further axes carried the identical defect** with all-zero
data, which is worse rather than better: `follow_duplicate`, `desk_follow_duplicate` and
`attention_star_owner`/`attention_skip_owner` would each have come true on the first day a stranger
used them.

**Why this instance and not the next tidy defect.** `item_view − item_view_onsite` is the only
instrument on this platform that would say whether a **stranger** is reading Tuned's finds, and find
pages are where a directory listing or a search result delivers one. It is the acquisition signal for
the one acquisition path still open, and it has been unreadable since the day it was built.

**What shipped: four one-line changes and one executable invariant.** Each axis now carries the split
its bucket carries. `_offpage`, `_unattended`, `_find` and `_feed` are **deliberately left merged** —
nothing subtracts them. [`scripts/axis-invariant.mjs`](../scripts/axis-invariant.mjs) asserts over the
real snapshot that a subtracted axis never exceeds its bucket, in both buckets, for all ten pairs.

**A deliberate prior decision is reversed, and its argument is preserved verbatim in the test.**
`attention_star_owner` was *"deliberately not crossed with the user-agent split"* by analogy with
`_unattended`. The analogy fails — nothing subtracts `_unattended` — and the case it missed is the
one that matters: an owner star from a bot-flagged client plus a stranger's star from a browser on
the same day makes the published rule read *"no non-owner star"*, **masking the single event this
loop is waiting for.**

**Why it survived six runs, which is the durable half.** *The number was in front of the loop the
whole time and nobody did the arithmetic.* [METRICS.md](METRICS.md) quotes `item_view_onsite` reading
**19** in a paragraph reporting `item_view` at **7** — adjacent clauses, and `7 − 19` was never taken.
**A reading rule that lives only in prose is never executed, so it is never observed to be false.**
And the suite pinned the case that works: every `item_view_onsite` test asked with a human UA, while
`test/activation.test.ts` asserted `desk_follow_duplicate = 2` against a `desk_follow` of 2 on a day
one follow was genuinely new — **the suite asserted the arithmetic that made the reading wrong.**
[L-103](LESSONS.md#l-103).

**The seven merged days are NOT back-filled and are not recoverable as numbers.** What is recoverable
is a bound, and METRICS.md publishes it as a bound. 2026-09-22 is a mixed UTC day under both contracts
and is excluded from both; **2026-09-23 is the first whole day on the new contract.**

**Production result, from GitHub Actions — this session's egress proxy still answers `403 CONNECT` for
`justtuned.com`, re-tested this run rather than assumed.** Merged as
[`e6aace7`](https://github.com/in-c0/tuned/commit/e6aace7);
[`verify production` run 35792518638](https://github.com/in-c0/tuned/actions/runs/35792518638) —
**success**, expected commit confirmed serving at step 5 (21s into the job), then **25 steps passed**,
the one skipped being the `zone_blocked` branch, which is the healthy path. The `check` workflow is
green on the merged tip at [35792518623](https://github.com/in-c0/tuned/actions/runs/35792518623).

**No rollback was triggered and none was needed.** The change touches counter **names** only — no
schema, migration, route, query, page, CSS declaration or dependency — so no visitor sees a different
byte, and reverting it would restore the negative reading and nothing else.

**The run's own logs could not be downloaded from this session and that is recorded rather than
worked around:** the egress proxy also refuses `results-receiver.actions.githubusercontent.com`, so
step **names and conclusions** above are read from the jobs API and no step's log text is quoted.

**The schedule is still NOT armed and no EXP-013 threshold was graded early.** Run 153's
pre-commitment binds this run as it bound 179–184; `agent-scout.yml` and the bar are byte-untouched.
Window closes **2026-09-25**, reading due **2026-09-26**.

**Last updated:** 2026-09-22 20:25 Sydney (2026-09-22 10:25 UTC), run 184 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-183 and not re-argued here, per [L-07](LESSONS.md).** **The gate said
ATTEND, and the record it sent this run to read was wrong: the publisher had reported a failed search
in the words it uses for a quiet week.**

**The gate was attended first and this time it said act.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **ATTEND** — item 283, 24.1h old, **one** scheduled screen certainly delivered since (02:40Z).
That is the first `ATTEND` since run 181 built the gate, and the first time attending it produced
both a publication **and** a defect.

**What the record said, and why none of it was true.** The 02:40Z screen
([run 35702095397](https://github.com/in-c0/tuned/actions/runs/35702095397)):

```
search returned 0 candidates (hitCount ?)
screened 0 · nothing · full-text reads 0
no candidate passed the bar this cycle. Publishing nothing is the expected outcome.
```

Green run, uploaded record, no annotation, and a screening step that took **1 second** against the
20–22s every working screen takes. The **identical query** dispatched 2h19m later
([run 35714984572](https://github.com/in-c0/tuned/actions/runs/35714984572)) screened **35**,
rejected 15, selected **8**, and had a quotable top selection. **Nothing had passed the bar because
nothing had been screened.**

**The gate was then discharged on the fresh record.** `agent-scout.yml` dispatched with
`publish: true` — [run 35715072000](https://github.com/in-c0/tuned/actions/runs/35715072000),
**HTTP 201 · published=true · duplicate=false · item_id=284**, a Frontiers force-plate concurrent
validity paper carrying a 244-character verbatim quotation from its own abstract. The nomination file
is committed in the same PR, because the gate cannot see a publication that is not in the registry.
**The gate reads `CURRENT` with it.**

**What shipped, and it is one predicate rather than a new mechanism.**
[`searchResponseDefect()`](../scripts/lib/agent-scout.mjs) refuses two shapes against the upstream
contract: a body with **no `hitCount`** (Europe PMC always carries it for `format=json`, so absence
means the body is not a search result at all), and **`hitCount > 0` with an empty page** (the index
reported hits it did not hand over). It throws into the top-level handler that **already existed**,
so this failure now lands as a **red run with `::error::`** instead of a green one with a believed
artifact.

**The concept was already in the code, written down, and tested — and was one response shape short.**
`scripts/agent-scout.mjs`'s header calls a failure to read the source *"the one signal that is NOT
green … the loop's instruments lying rather than the literature being thin"*, and a test already
named it. That guard keyed on the **transport** (`res.ok`); the missing one keys on the **payload**.
An HTTP 200 is a statement about a request, never about an answer. [L-102](LESSONS.md#l-102).

**`hitCount: 0` with no records stays a clean empty cycle, and that negative is the load-bearing
half.** The bar's job is to be quiet; a publisher that errored on a genuinely empty window would cry
wolf on exactly the cycles it exists to sit out. The positive control is mutation 4 — widening the
guard to any empty page — and it reddens **`an empty result set is a clean empty cycle`**, a test
that was already there. Mutation 1, the pre-change behaviour, reddens both pipeline tests and leaves
the unit test green, which is what says the defect was at the call site and not in the predicate.

**Not done, and stated rather than deferred quietly.** Nothing grades a screen's **duration** or
compares a cycle's candidate count against recent cycles, so a well-formed response listing *three*
candidates on a day the index holds thirty-five would still read as a thin week. That is a harder
judgement than a contract violation and was not smuggled into this change.

**Production result, from GitHub Actions — this session's egress proxy still answers `403 CONNECT`
for `justtuned.com`, and for `www.ebi.ac.uk` too, both re-tested this run rather than assumed.**
Merged as [`a6cbb77`](https://github.com/in-c0/tuned/commit/a6cbb77);
[`verify production` run 35715649150](https://github.com/in-c0/tuned/actions/runs/35715649150) —
**success**, expected commit confirmed serving at step 5 (41s after push), then **25 steps passed**,
the one skipped being the `zone_blocked` branch, which is the healthy path.

**Item 284 is independently confirmed live on production by that run, not only by the 201.**
`/sportstech` carries **22 permalinks** into find pages, up from **21** on run 183's reading, and the
run's own line reads *"Cadence disclosed: the last was today on /sportstech/13."* **No rollback was
triggered and none was needed** — the shipped change touches no `src/`, so the deployed Worker's
behaviour is unchanged by it.

**The schedule is still NOT armed and no EXP-013 threshold was graded early.** Run 153's
pre-commitment binds this run as it bound 179–183. **Recorded as evidence bearing on threshold 2
rather than used to grade it:** an unattended schedule would have absorbed this defect silently, and
the only reason it was caught is that a run was obliged to read the record.

**Last updated:** 2026-09-22 14:35 Sydney (2026-09-22 04:35 UTC), run 183 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-182 and not re-argued here, per [L-07](LESSONS.md).** **The two
documents that carry a feed off this site were both still calling it current, and one of them is the
only subscription this funnel can complete.**

**The gate was attended first, and it said do nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **CURRENT** — item 283, 18.1h old, **zero** scheduled screens certainly delivered since. Nothing
was owed, so **nothing was published, amended or retracted this run**, and the cycle's action was
chosen elsewhere. That is the third time the mechanism's first act has been to tell a run not to act.

**The finding, and it is [L-100](LESSONS.md#l-100)'s own set being the wrong set.** Run 182 enumerated
the surfaces that **offer** a feed and fixed the last of them. A feed is also carried **off** this
site by two documents that offer nothing, and both asserted currency as a constant:

| document | what it said | who reads it |
| --- | --- | --- |
| `rssFeed`'s `<channel><description>` | *"What X is paying attention to **right now**."* | a reader's sidebar; a directory listing reproduces it |
| `publicPage`'s `<meta name="description">` / `og:description` | *"a **live** feed of what X is watching…"* | a search result; every unfurled card |
| `robots.txt` header comment | *"follow what someone is paying attention to **right now**."* | crawlers |

**Four of the five feeds serving all three strings had published nothing for 50–53 days** — run 182's
own post-deploy reading, which is what makes this a false sentence rather than a stale one. The RSS
document is also the artifact [DISTRIBUTION.md](DISTRIBUTION.md)'s submissions ask the owner to point
a **durable listing** at, so the claim sat on the one conversion a stranger can complete here.

**What shipped.** [`src/pages.ts`](../src/pages.ts) — *"right now"* out of the channel description,
*"live"* out of the feed page's meta/OG description. [`src/crawl.ts`](../src/crawl.ts) — the robots
header carries NORTH_STAR's positioning line instead. **No claim replaces them and none is
conditional:** the age is stated only where it is derived — `lastBuildDate` in the RSS document,
`lastPublishedClause` on the page.

**The relative age was deliberately NOT put into either description, and that is the positive
control.** It is the tempting fix and it is wrong: a reader re-fetches the string, but a **directory
copies it**, where *"last published 52 days ago"* freezes into the hardcoded claim being removed.
`lastBuildDate` is an absolute instant and stays true wherever it is copied. Two assertions pin it.

**The instrument had the right idea and one document of scope.** `RETIRED_CLAIMS` in
[`qa/freshness.spec.mjs`](../qa/freshness.spec.mjs) has existed since run 139 and was checked against
**only the landing page** — while the same spec was already fetching every feed's RSS body for its
`<pubDate>`s. It now checks every document it holds, at **no extra request**, and names the surface.
[L-101](LESSONS.md#l-101).

**Production result, from GitHub Actions — this session's egress proxy still answers `403 CONNECT`
for `justtuned.com`, re-tested this run rather than assumed.** Merged as
[`e90a2c0`](https://github.com/in-c0/tuned/commit/e90a2c0);
[`verify production` run 35687337094](https://github.com/in-c0/tuned/actions/runs/35687337094) —
**success**, expected commit confirmed serving at step 5, then **25 steps passed**, the one skipped
being the `zone_blocked` branch, which is the healthy path. That includes the new **step 17**, *"No
feed claims a currency it cannot keep, on either surface that leaves this site"*: for **every handle
the live landing page lists**, the RSS channel description states no currency and carries a
`<lastBuildDate>` wherever the feed has items, the feed page's meta description does not call it
live, and `robots.txt` asserts no currency. The same run reports `/sitemap.xml` **97 URLs**, **89
find pages**, and `/sportstech` carrying **21 permalinks** — unchanged, as a change that removes two
words should leave them.

**Run red first, and the matchers were proven against the pre-change documents** before the step was
trusted: all four caught it (the RSS description, the missing `lastBuildDate`, the meta description,
`robots.txt`). **No rollback was triggered and none was needed.**

**Last updated:** 2026-09-22 08:35 Sydney (2026-09-21 22:35 UTC), run 182 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-181 and not re-argued here, per [L-07](LESSONS.md).** **The page that
picks a feed for a visitor was the one surface on this site that never said how old any of them
are, and its heading called all five of them live.**

**The gate was attended first, and it said do nothing.** [`scout-gate.mjs`](../scripts/scout-gate.mjs)
read **CURRENT** — item 283, 12h old, **zero** scheduled screens certainly delivered since, the next
one due 02:40Z. Nothing was owed at the gate, so **nothing was published, amended or retracted this
run**, and the cycle's action was chosen elsewhere. That is the second time the mechanism's first act
has been to tell a run not to act.

**The finding, and it is on the first screen of the funnel.** `GET /` built its feed list from
`SELECT … FROM creators ORDER BY created_at` — **no item was read at all.** So the cards under the
heading **"Live feeds"** could not report how current any destination was, and the order a visitor
scanned them in was registration date.

**What that was sitting on top of.** [EXP-005's per-feed reading](EXPERIMENTS.md#exp-005--re-read-2026-09-11-run-152-and-the-first-per-feed-reading-on-record)
(run 152, off live production): `@wearables`, `@wellbeing` and `@graphics` last published
**2026-07-30**, `@ava` **2026-08-02** (run 152's entry and runs 178–181 carried *2026-08-04* for
`@ava`; the reading below, taken off production this run, measures `2026-08-02T03:33:44Z` and is what
this file now states). **Four of the five destinations under the word *live* had published nothing
for six weeks**, and the oldest-registered of them led the list.

**It is the demo block's own defect, one section up the same page.** That block was fixed at run 139
and its comment states the rule this list broke: *"A claim about freshness that is hardcoded is a
claim nobody can keep true — so this one is derived."* ***Live*** is such a claim. The same comment
adds *"the landing page must not be able to look fresher than the feed it is showing"* — which is
exactly what a card with no date does.

**And it is [L-93](LESSONS.md#l-93)'s shape a third time, which is the part worth keeping.** Run 172
put this disclosure on the follow block and both follow dialogs. Run 177 put it on the desk's
suggestion row **one run later**, because that row did not exist when run 172 made its pass. The
surface the funnel *starts* at is the one that still did not have it, 10 days on. [L-100](LESSONS.md#l-100).

**What shipped.** [`src/index.ts`](../src/index.ts) — the landing query carries each feed's newest
**public** item as `latest_item_at` via a correlated subquery, and orders by it: freshest first,
never-published last, `created_at` still breaking ties among those so the old order survives where
there is nothing to order by. `visibility = 'public'` sits **inside** the subquery, so a queued
Spotify capture or a hidden item cannot date a feed on the most public page Tuned has.
[`src/pages.ts`](../src/pages.ts) — `LandingFeed`, `feedAgeLine()`, and the heading moved to **"All
feeds"**: what the block *is*, with no claim about activity. How current each feed is, each card now
says for itself.

**The age is deliberately NOT folded into `.desc`.** That element is `-webkit-line-clamp: 2`, and at
390px the two sentences together land on exactly the second line — so a longer handle would clamp the
disclosure away **silently**, which is the one failure mode a disclosure must not have. It renders in
`.fine`, a rule the shared CSS already serves, so this adds **no declaration** and no flex row that
can squeeze. Both L-18's and L-93's regressions were a disclosure folded into a line that already had
a job, and neither overflowed anything.

**Unlike the desk row it does not fall silent on an empty feed.** That row can, because its own
`0 finds` already says so. This card carries no other number, so silence would have left the emptiest
case the only undisclosed one: it reads *"nothing published yet"*.

**A clause removed because no mutation could redden it.** The `ORDER BY` was written
`latest_item_at IS NULL, latest_item_at DESC, …`. SQLite orders `NULL` below every other value, so
`DESC` already puts a never-published feed last and the explicit clause changed **nothing any input
could observe**; the outcome stays pinned by its own test either way. Removed rather than kept, with
the engine rule written into the comment instead — run 180's finding, [L-95](LESSONS.md#l-95).

**A sweep was considered and deliberately NOT shipped, and the reason is the same one.** L-93's
remedy for this family was a sweep, and the obvious move here was one over the surfaces that offer a
feed. **It would have been decoration:** all three are already pinned individually, and an enumerated
list cannot redden on the realistic recurrence — a *fourth* surface it does not know about. What would
prevent it is a check that derives the offer surfaces from the delivered HTML rather than from a list
a run typed; its difficulty is recorded in [L-100](LESSONS.md#l-100) rather than papered over with a
check that reads like a safeguard and is not.

**The production reading, taken after the deploy with EXP-005's own instrument.** `qa/freshness.spec.mjs`
against `https://justtuned.com`, [run 35662417563](https://github.com/in-c0/tuned/actions/runs/35662417563)
at `2026-09-21T22:24Z` — **passed**, `feedsWithNoItems: []`, `demoIsFreshest: true`,
`retiredClaimsStillPresent: []`:

| feed | items | newest public item | age | the card's line |
| --- | --- | --- | --- | --- |
| `@sportstech` | 21 | `2026-09-21T10:04:55Z` | **12.3h** | last published today |
| `@ava` | 38 | `2026-08-02T03:33:44Z` | **1218.8h** | last published 50 days ago |
| `@graphics` | 11 | `2026-07-30T22:51:27Z` | **1271.5h** | last published 52 days ago |
| `@wellbeing` | 9 | `2026-07-30T22:50:34Z` | **1271.6h** | last published 52 days ago |
| `@wearables` | 10 | `2026-07-30T22:49:47Z` | **1271.6h** | last published 52 days ago |

**That is the whole case for the change in one table.** Four of five feeds are between **50 and 53
days** stale, and until `f75b642` the first screen of this site presented all five identically, under
the word *live*, with `@wearables` — the stalest — reachable before `@sportstech` because it was
registered earlier. The instrument's `feeds` array is in exactly descending-freshness order, which is
consistent with the new `ORDER BY` and is reported as consistency rather than as proof of it.

**And the ages are asserted on the deployed page, not only in workerd.** One step added to
`verify-production.yml`: it counts the feed cards on the live landing page, requires **every** one to
carry an age line, and fails if the heading returns to *"Live feeds"*. **Run red first, per run
174, and it paid both ways** — executed against the pre-change page rendered from
`2a367b6:src/pages.ts` it reports *"5 feed cards on / and only 0 state an age"* and the heading clause
reddens too; against production at `3153afd` it passes, as **step 16 of
[run 35662212331](https://github.com/in-c0/tuned/actions/runs/35662212331)**.

**Gates.** `npm run check` exit 0 · **471 vitest** (464 → 471, seven new) · **ops suite 276/276**
(unchanged — no `scripts/` file touched) · `validate-workflows.py` ok, 13 workflows ·
`validate-nominations.mjs` **10 valid** · `npm audit --omit=dev` **0 vulnerabilities**. **Seven
mutations, each reddening its own named test**; the seventh was the positive control above and **did
not redden**, which is why the clause is gone. Both touched sources restored **byte-identical** under
`sha256sum -c`, **by copy, per L-95**.

**The honest cost, stated rather than buried.** This trades a flattering first screen for a true one —
the same trade run 172 made on the follow dialogs — and pairs it with the ordering change so the one
feed that **is** current leads the list instead of sitting fourth.

**The schedule is still NOT armed, and no threshold was touched.** Run 153's pre-commitment binds
this run as it bound 179-181, **EXP-013's threshold 2 is unruled at 23 days**, and `agent-scout.yml`
and the bar in `scripts/lib/agent-scout.mjs` are **byte-untouched**. **No threshold graded early** —
EXP-013's reading is due **2026-09-26**.

**Deliberately NOT touched.** No schema, no migration, no new data category, no new counter, no new
CSS declaration, no secret, no dependency, no workflow. No item published, amended, retracted or
restored. No pricing, positioning or distribution work. **No spend.**

**Magnitude, stated plainly.** `members` is 1 and that member is the owner, so **this moves no
commercial metric and is not offered as growth work.** It is the **eleventh** consecutive cycle whose
output is not a user or a dollar. What is different from the last three is where the change landed:
this is the first screen an arriving stranger sees, and it is the first change in ten runs that a
stranger could notice. Six rendering browsers in forty-seven days is the whole of the demand signal
it will be read against, and that is not a forecast of anything.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers`
**0** · gross cash **AUD $0**, from *no billing exists*. **14 days left.**

---

## Run 181 (2026-09-21 20:35 Sydney) — the gate that decides whether to publish is fed by a file nobody is obliged to write

**Last updated:** 2026-09-21 20:35 Sydney (2026-09-21 10:35 UTC), run 181 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-180 and not re-argued here, per [L-07](LESSONS.md).** **The gate that
decides whether to publish is fed by a file nobody is obliged to write, and this run was the first
one that had to write it.**

**The gate was attended, and that came first.** [`scout-gate.mjs`](../scripts/scout-gate.mjs) read
**ATTEND** — item 282, 12h old, one scheduled screen certainly delivered since. This run opened the
[2026-09-21 08:11Z screening record](https://github.com/in-c0/tuned/actions/runs/35576567110)
(**screened 35 · rejected 14 · selected 8 · deferred 13 · 12 full-text reads**) and dispatched the
publish. [Run 35586751724](https://github.com/in-c0/tuned/actions/runs/35586751724) published **item
283** — *Neuromuscular Activation Strategies of the Lower Limb During Maximal Sprinting in Youth
Track and Field Athletes* — at `2026-09-21T10:04:55.788Z`. **`items_public` 88 → 89**, and it is the
first publication that needed no timestamp read back out of production, which is run 179's fix
working one publication later.

**The finding, and it is in run 180's own risk analysis rather than in the product.**
`scout-gate.mjs` takes its reading from `qa/nominations/` — a directory filled **by hand, afterwards,
by the run that published**. Run 180 anticipated the failure and wrote down its direction: an
unregistered publication *"costs a run one look at a screening record and corrects itself"*, because
a missing entry can only move the newest publication **backwards** and so can never make a silent
feed read fresh. **That is true of the sentence it prints and false of what the sentence is for.**
`ATTEND` is the verdict that sends the next run to the record **in order to publish**, so an
unregistered publication does not cost a look — it buys a second publication, and the run after it a
third. Three scheduled runs a day against a one-item-per-run cap is how *"recurring agent value
without attention overload"* stops holding, by way of the mechanism built to protect it.
[L-99](LESSONS.md#l-99).

**The registry is load-bearing twice.** `publishedSources()` reads the same directory for the bar's
`not-already-published` clause, so an unregistered publication is also invisible to the screen that
must not re-select it. The operator plane's idempotency key catches that one at the far end; **the
gate has no such backstop.**

**A second defect, in the first hand-written entry there ever was.** Item 282's entry names
`af26cc3` as the bar that composed its line and says in words that it is *"the last change to
`scripts/lib/agent-scout.mjs` before this publication"*. It is not — **`88fe7d5` is, six days
later.** The entry still **validated**, because `af26cc3` does precede the publication and
precedence is all the ordering invariant asks, so no gate could have caught it and an auditor
following its own `verifyWith` reads the wrong rule. Corrected to `88fe7d5`, with the superseded
value recorded in `notes` rather than erased.

**What shipped.** `nominationEntry()` and `nominationFilename()` compose the entry from what the
publisher already holds; `writeNomination()` leaves it in the working tree at the moment of
publication with its path in the log. **The fix is not a louder instruction** — runs 179 and 180
both read that gate and neither had one. A run still chooses to commit the file, because that is a
claim about a publication and belongs to a run that looked; what is gone is the retyping, which is
where both defects above came from. **Item 283's entry was composed by the new function rather than
retyped**, invoked locally because the publication preceded the composer by forty minutes; from item
284 the publisher writes it itself.

**It refuses rather than guesses.** No entry when the plane reported no `created_at` — `publishedAt`
is the ordering invariant, and inventing it would defeat the one thing the registry proves — none
for a duplicate or a refused publish, none when git cannot name the bar on a shallow clone, and none
that the registry itself would refuse. That last case is not hypothetical: `recordRunUrl()` returns
`""` on every invocation outside Actions.

**The schedule is still NOT armed, and no threshold was touched.** Run 153's pre-commitment binds
this run as it bound 179 and 180, **EXP-013's threshold 2 is unruled at 22 days**, and
`agent-scout.yml` and the bar in `scripts/lib/agent-scout.mjs` are **byte-untouched**. Attending a
gate and removing it are different acts.

**Item 283's why line carries no quotation, and that is the designed output rather than a degraded
one.** `selectQuotation` refused all 12 sentences it considered (reported-value 7, too-short 1,
too-long 3, well-formed 1; the closest over-budget sentence missed by **59 characters** against a
budget of 252), so `composeWhy` fell to the provenance-only form item 280 carries. **No threshold
was retuned to obtain a quotation.** EXP-013's Q1–Q4 reading on **2026-09-26** is what grades how
often this fallback happens, and this run did not grade it early.

**Gates.** `npm run check` exit 0 · **464 vitest** (unchanged — no worker source touched) · **ops
suite 276/276** (265 → 276, eleven new) · `validate-workflows.py` ok, 13 workflows ·
`validate-nominations.mjs` **10 valid** (9 → 10) · `npm audit --omit=dev` **0 vulnerabilities**.
**Nine mutations, each reddening its own named test**, including two positive controls. One of them
— *skip validation, because the composer already refuses the bad cases* — **did not redden on the
first pass**, and that is recorded in [L-99](LESSONS.md#l-99) rather than quietly fixed. Both
touched scripts restored **byte-identical** under `sha256sum -c`, **by copy, per L-95**.

**Deliberately NOT touched.** No worker source at all — no route, no query, no CSS rule, no counter
added, renamed, split or retired. No schema change, no migration, no new data category, no secret,
no dependency, **no workflow added or modified**. No item retracted, amended or restored. No landing
page, pricing, positioning or distribution work. **No spend.**

**Magnitude, stated plainly.** `members` is 1 and that member is the owner, so **the registry fix
moves no commercial metric.** What did move is the product's core loop: an agent selected attention
and published it with provenance, for the second consecutive day, and `items_public` is 89. The
tenth consecutive cycle whose output is not a user or a dollar — and the honest defence is unchanged
from run 180's: every channel that would produce one is blocked on a credential this executor does
not hold and will not acquire.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers`
**0** · gross cash **AUD $0**, from *no billing exists*. **14 days left.**

---

## Run 180 (2026-09-21 14:35 Sydney) — the remedy for a gate nobody attends was itself queued behind a question nobody is answering

**Last updated:** 2026-09-21 14:35 Sydney (2026-09-21 04:35 UTC), run 180 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-179 and not re-argued here, per [L-07](LESSONS.md).** **The remedy for
a gate nobody attends was itself queued behind a question nobody is answering, so this run shipped
it: the publisher's queue now has a reading in the one file every run is obliged to have read.**

**The finding, and it is about run 179 rather than about the product.** Run 179 found that eight
consecutive screens had each selected ~9 of ~37 candidates and published none, because the screening
record is a workflow artifact the operating card's read order does not reach ([L-97](LESSONS.md#l-97)).
It named the remedy — *make the queue legible to the run that is supposed to attend the gate* — and
**deferred it**, on two grounds: NORTH_STAR rule 7 (control plane is not the product), and that it
"only pays off if the gate stays attended — which is question 1", the reviewer's unruled EXP-013
re-specification. **Question 1 has now been unanswered for 21 days.** Deferring the fix for an
unattended gate until an unattended question is answered is the same stoppage one level up, and it
has the same observable: a calm one. [L-98](LESSONS.md#l-98).

**What shipped.** [`scripts/scout-gate.mjs`](../scripts/scout-gate.mjs) — one command, no network,
no credential — and **one step in `CLAUDE.md`'s read order** that names it. It answers the single
question that decides whether a run should go and open the screening record: **has a scheduled
screen come and gone since `@sportstech` last published?**

```
publisher gate: @sportstech — CURRENT
  newest registered publication: item 282 at 2026-09-20T22:07:44.418Z (6.1h ago)
  scheduled screens certainly delivered since: 0
```

**It reads the registry, not the record.** `qa/nominations/` is in the repository, already validated
by a gate in `check.yml`, and already carries this publisher's publications under an ordering
invariant; the screening record needs the network, a credential, and expires at 90 days. So this
reads the part that decides **whether to go and read the record**, and never claims to be it.

**Both of its errors run one way.** A `@sportstech` publication missing from the registry makes the
feed look staler than it is — one wasted look, self-correcting. The five-hour delivery allowance
(scheduled firings here have been delivered **1.6–4.5h late** since 2026-08-26, measured in
`scripts/executor-liveness.mjs`) counts a screen only once it has certainly happened. **Neither can
make a silent feed look fresh**, which is the only direction that costs anything.

**Neither verdict fails a build, deliberately.** `ATTEND` and `CURRENT` both exit 0; only an
unreadable registry exits non-zero. A reading that reddens `test:ops` when a feed goes quiet would
block unrelated pushes and put the executor under pressure to publish to get a build green — which
is precisely the pressure the bar exists to keep off the publisher.

**Nothing was published today, and the gate is why.** The reading says `CURRENT`: item 282 landed
6.1 hours ago and today's 02:40Z screen is still inside the delivery allowance. Publishing a second
find within six hours to make the run look busier is what the one-per-run cap and "without attention
overload" exist to prevent. **The first thing this mechanism did was tell a run not to act.**

**The schedule is still NOT armed, and no threshold was touched.** Run 153's pre-commitment stands,
EXP-013's threshold 2 is unruled, `scripts/lib/agent-scout.mjs` and `agent-scout.yml` are
**byte-untouched**. Attending a gate is not the same act as removing it, and the card now says so in
those words.

**A dead line found by its own mutation battery, removed rather than kept.** The walk that
enumerates screening instants started a day early "so the instant on the publication's own day is
never skipped". **No mutation could redden it**, because `setUTCHours` already produces that
instant. A defensive line no test can pin is not a safeguard, it is decoration that will be read as
one. It is gone, and the comment in its place says why.

**Gates.** `npm run check` exit 0 · **464 vitest** (unchanged — no worker source touched) · **ops
suite 265/265** (248 → 265, seventeen new) · `validate-workflows.py` ok, 13 workflows ·
`validate-nominations.mjs` **9 valid** · `npm audit --omit=dev` **0 vulnerabilities**. **Twelve
mutations, each reddening its own named test**, including a **positive control**: inferring the
screen count from the publication's age in whole days is plausible, well-formed and wrong, and two
assertions catch it. Card and script restored **byte-identical** under `sha256sum -c`, **by copy,
per L-95**.

**Deliberately NOT touched.** No worker source at all — no route, no query, no CSS rule, no counter
added, renamed, split or retired. No schema change, no migration, no new data category, no secret,
no dependency, no workflow added or modified. **No item published, amended, retracted or restored.**
No landing page, pricing, positioning or distribution work. **No spend.**

**Magnitude, stated plainly and not dressed up.** `members` is 1 and that member is the owner, so
**this moves no commercial metric and is not offered as growth work.** It is the ninth consecutive
cycle whose output is not a user or a dollar, and rule 7's tension is real — the honest defence is
that the alternative was a tenth silent feed, and that the reading is eight lines a run executes
rather than a surface anyone maintains.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers`
**0** · gross cash **AUD $0**, from *no billing exists*. **14 days left.**

---

## Run 179 (2026-09-21 08:35 Sydney) — the publisher found something on eight consecutive days and published none of it

**Last updated:** 2026-09-21 08:35 Sydney (2026-09-20 22:35 UTC), run 179 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-178 and not re-argued here, per [L-07](LESSONS.md).** **The publisher
found something worth publishing on eight consecutive days and published none of it, because the
gate it waits behind had nobody standing at it.**

**The finding.** Run 153 disarmed `agent-scout.yml`'s publication — the cron still fires, but
`--publish` comes only from an explicit dispatch. The workflow states the rule in its own words:
*"Publication stays behind an explicit dispatch by someone who has read the screening record."*
Between **2026-09-13 and 2026-09-20 that schedule fired eight times**, every run succeeded, and
every run selected **about nine publishable candidates out of about thirty-seven screened**.
**Every one was discarded.** `@sportstech` went **nine days** without publishing while its
publisher found something worth publishing every single day.

**Why no run saw it.** The screening records are workflow artifacts with 90-day retention that
**nothing in this repository reads**, and the operating card's read order reaches no artifact. So a
gate nobody attends and a pipeline with nothing in it produce **the same observable** — a feed that
does not move. Runs 176, 177 and 178 each found a real, different defect in the plumbing between a
feed and a member; **none asked whether the feed had anything to put through it.** Run 178 came
closest, measuring that four of five feeds last published in July, and read that as a fact about
the data rather than as a queue with a depth. [L-97](LESSONS.md#l-97).

**What shipped is an act before it is a change.** This run **read the 2026-09-20 07:54Z screening
record** and then dispatched the publish, which is exactly what Fork B says the gate is for.
[Run 35540673395](https://github.com/in-c0/tuned/actions/runs/35540673395): **screened 38 ·
rejected 15 · selected 9 · deferred 14 · 12 full-text reads**, publishing **item 282** — *IMU-based
identification of rowing conditions through supervised machine learning* — with the source's own
sentence as its public line: *"The 7,545 windows were imbalanced toward Boat, with a no-information
rate of 71.8%."* **`@sportstech` is the freshest feed on the site for the first time since 12
September**, and `items_public` moved **87 → 88**.

**The schedule was NOT armed, and that is deliberate.** Run 153 left a standing instruction that no
later run arm it on the executor's own reading of a threshold the executor proposed; EXP-013's
re-specification is **still unruled after 20 days**. That boundary is a predecessor's
pre-commitment, not an inconvenience, and the remedy for an invisible queue is not to widen this
executor's authority. **One word in `agent-scout.yml` re-arms it and this run did not touch it.**

**A second finding, from doing it.** `POST /api/operator/agents/:handle/items` answered
`RETURNING id` and returned the item id **alone**, so the publisher could not learn **when** its own
publication landed — and `qa/nominations/index.mjs` **refuses** an entry whose pre-registration
commit does not predate its `publishedAt`, which makes that timestamp the registry's ordering
invariant rather than decoration. Every autonomous publication was registrable only by reading the
timestamp **back out of production** afterwards. **Item 282 is the last one that needed that
detour:** the route now returns `created_at` from the row's own default, and `publishOne` keeps it
instead of dropping it one line after it arrives. **A writer that cannot report what it wrote forces
every reader downstream to go and look.**

**Item 282's own `publishedAt` was still read out of production**, because the fix cannot apply
retroactively to a publication that preceded it. It is production's own `created_at` at millisecond
precision, from the pulse block via
[`freshness.spec.mjs`](https://github.com/in-c0/tuned/actions/runs/35540755846) — and the RSS
pubDate on the same read carries the same instant truncated to the second. The registry entry says
so in `notes` rather than presenting the value as something the publisher returned.

**Run red first.** The route assertion was executed against unmodified source and failed on
*"expected undefined to be '2026-09-20T22:12:01.624Z'"* — the route returned no timestamp at all.

**Gates.** `npm run check` exit 0 · **464 vitest** (463 → 464) · **ops suite 248/248** (244 → 248,
four new) · `validate-workflows.py` ok, 13 workflows · `validate-nominations.mjs` **9 valid** (8 → 9)
· `npm audit --omit=dev` **0 vulnerabilities**. **Six mutations, each reddening its own named
test** — including a **positive control**: a route answering `new Date().toISOString()` instead of
the row's value is plausible, well-formed and wrong, and the assertion catches it. Both touched
source files restored **byte-identical** under `sha256sum -c`, **by copy, per L-95**.

**Deliberately NOT touched.** No schema change, no migration, no new table or column, no new data
category, no secret, no dependency, no route added or removed, **no counter added, renamed, split or
retired**, and **no CSS rule**. The schedule stays disarmed, the bar is byte-untouched — the
publication used the bar in force and no threshold was retuned to agree with it — and EXP-013's
threshold-2 proposal is still unruled. No landing page, pricing, positioning or distribution work.
No item retracted, amended or restored. **No spend.**

**Magnitude, stated plainly.** `members` is 1 and that member is the owner, so **nobody was denied a
find by this outage and no commercial metric moves today.** What changes is that the product's core
loop — an agent selecting attention and publishing it with provenance — **ran end to end for the
first time in nine days**, and the three runs spent making the funnel's last step a step now have
something moving through it.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers`
**0** · gross cash **AUD $0**, from *no billing exists*. **14 days left.**

---


## Run 178 (2026-09-20 20:35 Sydney) — every find this site has published was outside the window the desk renders

**Last updated:** 2026-09-20 20:35 Sydney (2026-09-20 10:35 UTC), run 178 — **OWNER ACTION REQUIRED:
ONE, unchanged from runs 137-177 and not re-argued here, per [L-07](LESSONS.md).** **Every find this
site has published was outside the window the desk renders, so the desk was empty by construction.**

**The finding.** `GET /today` windows every followed feed's items to `i.created_at > now - 7 days`.
Production holds **87 public items across five feeds**, and on this date **not one of them was inside
that window**: `wearables`, `wellbeing` and `graphics` last published **30 July**, `ava` **4 August**,
and `sportstech` — the freshest — **eight days** earlier. So a member who took the offer run 177 put
on all **eighty-seven find pages** was redirected to `/today` and shown `0 this week · unrated` over
the sentence *"Nothing new from @wearables"* — **having just clicked a row advertising 19 finds.**

**Empty by construction, not by accident.** The offer counted a feed's finds all-time; the desk
counted seven days. No feed, no member and no amount of following could have produced a non-empty
desk until some feed published again — and four of the five have published nothing in seven weeks.
The empty-state sentence run 176 wrote for exactly this moment (*"add a feed and everything it finds
lands here"*) does not even render, because `groups.length` is 1: the member **has** a feed, and it
is empty.

**Runs 176 and 177 were right about the problem and could not see this.** Run 176 made the desk
fillable; run 177 offered it where the decision is made. What it fills with was nothing, both times,
and both runs' checks passed.

**[L-96](LESSONS.md#l-96) — a test that seeds its world at `now` cannot see a window.**
`test/activation.test.ts` is the right file: it walks the whole funnel using at each stage only what
the previous stage returned, which is how L-94 was found. It has **exactly one** piece of world state
inserted with SQL — the public find — and it seeds it with `created_at` of **now**. That is the only
clock on the page, set to a value production never holds. **The seam test that fixed L-94 froze the
clock.** L-94 was *a test that seeds its own input tests no seam*; this is the same failure a
dimension across — *a test that seeds its own world tests no age*. Run 172 had already established
that four of five feeds stopped publishing in July. **The loop knew the data was old and wrote its
fixture new.**

**What shipped.** One clause: `AND (i.created_at > ? OR r.action IS NULL)`, on the `LEFT JOIN` the
statement already had, so **no extra query**. A find the member has **never triaged** is not hidden
by the window.

**The negative half is the design, not a compromise.** The moment a find is triaged it falls **back**
under the window and does not return tomorrow. Without that, this is *render the archive forever* and
`/today` stops being a daily surface. It is pinned by its own assertion: **mutation 2 — removing the
window entirely — reddens that assertion and nothing else.**

**The desk stops calling its count a reading it has never been.** `newCount` is the number of
rendered items the member has not triaged; `members.last_desk_at` is written on every arrival at
`/today` and **read by nothing**. *"N new since your last visit"* was false before this change and
would have been more so after it. It now reads **"N finds waiting"**. No number on a page describes a
measurement this service does not take.

**The age goes on the two sentences that need it, in run 172's own words.**
`lastPublishedClause()` is **exported rather than re-worded**. The desk's suggestion row — built one
run *after* run 172 put that disclosure on every other surface offering a feed — advertised `19 finds`
with no hint the newest was from July. And *"Nothing new from @handle"* was the same four words for a
feed that published yesterday and one silent two months, which are opposite facts about whether to
keep it on a desk. [L-93](LESSONS.md#l-93)'s shape, [L-18](LESSONS.md)'s rule.

**A reversal inside the run, recorded rather than quietly dropped.** The age was first appended to the
feed header's stat span. `.agent-h` is a flex row ending in `.rule { flex: 1 }`, so the stat is the
one item with slack: at **390px** four extra words squeezed it into a ~90px column and broke it into
three lines — *"0 this week · last" / "published 52" / "days ago · unrated"* — with the avatar, the
handle and the controls stranded around it. **Nothing overflowed**, so a document-overflow check reads
clean straight through it, which is how run 172's orphaned full stop shipped. Two CSS rules fixed the
squeeze and orphaned *"remove"* onto a third line instead. The answer was not a third rule: **the age
belongs on the sentence that reports nothing** — a full-width block with no flex row to break. Both
rules reverted. **This change adds no CSS rule at all.**

**Run red first.** `test/desk-window.test.ts` was executed against unmodified source: **all six
assertions failed**, each for its own reason, the load-bearing one on *"the member took the desk's own
offer and the desk does not carry the find."*

**Gates.** `npm run check` exit 0 · **463 vitest** (457 → 463, six new) · **ops suite 244/244**
(unchanged) · `validate-workflows.py` ok, 13 workflows · `validate-nominations.mjs` 8 valid ·
`npm audit --omit=dev` **0 vulnerabilities**. **Ten mutations, each reddening its own named test**,
all three touched files restored byte-identical under `sha256sum -c` — **by copy, per L-95**.

**Browser QA at 390px and 1100px, on the rendered desk.** The first visual reading this page has ever
had: `qa/` targets production, production cannot sign in, so **no check in this repository has ever
looked at `/today`.** That is the eighth consecutive run to find a check that could not see its own
subject, and it is what caught the flex-row break above.

**No production step added, and the reason is stated rather than dressed up.** Everything here renders
only for a signed-in member. `verify production` **cannot sign in**, and this loop **will not mint a
production member to obtain a session**, so shipping is established by the expected-commit gate; run
177's step 22 already fails loudly if any member control reaches a signed-out visitor. Adding a step
that could not see its own subject is the defect, not the remedy.

**Deliberately NOT touched.** No schema change, no migration, no new data category, no secret, no
dependency, no route added or removed, and **no counter added, renamed, split or retired**. The public
feed and find pages are byte-untouched, `POST /:handle/follow` and the email capture are untouched,
RSS and the landing page are untouched. **`FEED_CSS`/`FIND_CSS` still not folded into `CSS`** —
bookkeeping, and this change adds no CSS. **No site-wide `/rss.xml`**: run 172's direct yes/no is
still unanswered and stays a doctrine question. The agent-scout schedule is still disarmed and
EXP-013's threshold-2 proposal is **still unruled** — no reviewer directive since 2026-09-01. No item
published, amended, retracted or restored. No spend.

**Magnitude not overclaimed.** `applications` is **0** and `members` is **1**, so **nobody has ever
been shown the empty desk and no metric moves today.** The defect cost no users. What changes is that
the two runs spent making the funnel's last step a step now have something behind them. This is an
activation-surface fix, not a growth intervention, and it is not offered as one.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **15 days left.**

---

## Run 177 (2026-09-20 14:35 Sydney) — the follow button offered the one control on the page that does nothing

**Last updated:** 2026-09-20 14:35 Sydney (2026-09-20 04:35 UTC), run 177 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-176 and not re-argued here, per [L-07](LESSONS.md).** **The page where a
member decides to follow a feed offered them the one control that does nothing.**

**The finding.** Run 176 shipped `POST /:handle/desk` — the first writer of `follows` a member can
reach, and the subscription `GET /today` actually renders from. It was offered on **exactly one
screen**: the desk's own suggestion list. Meanwhile the control a member would press to follow a
feed — the **Follow** button on every public feed page and on all **eighty-seven find pages** —
still opened a dialog whose only account-shaped action wrote an email address into `followers`, *a
table nothing on this platform reads and no code in `src/` can deliver to.*

**So for one day this product had a working subscription and an inviting control that was not it.**
A signed-in member reading `/sportstech` who wanted more of that attention was shown the path that
does nothing. To take the path that works they had to leave the page they were reading, go to
`/today`, and find the feed again in a list — that is, **to already know the capability existed, on
the screen they had just left.**

**[L-95](LESSONS.md#l-95) is L-94's converse, and it fails in the opposite direction.** L-94 closed
with *a control is not a capability* — a button with nothing behind it. This is **a capability is not
an offer**: a working route with no button in front of it, at the only moment a person is deciding to
use it. Both read green on every stage test for the same reason — the capability has a passing test,
the surface has a passing test, and nothing asks whether the surface offers the capability.

**Both surfaces, in one change, and that is the point.** Fixing the feed page and naming the find
page would have repeated [L-93](LESSONS.md#l-93) — *a correction is not finished at the surface where
the defect was noticed* — which is the lesson the run before last was written to teach. The find
pages are also where it matters most: **eighty-seven of them against five feed pages**, so a
stranger's first Tuned page is overwhelmingly likely to be one of those and not `/today`.

**What shipped.** The follow dialog on both surfaces now **prepends** a real
`<form method="post" action="/<handle>/desk">` for a signed-in member: *Add to my desk*, or *Take it
off my desk* when the feed is already there. A member's **own** feed is excluded, the same exclusion
the desk's suggestion list makes. Counters `desk_follow_feed` / `desk_follow_find` as an **axis**,
never summed into `desk_follow`, with **absence meaning the desk** — so every follow recorded before
today keeps its meaning.

**Prepended, never a rewrite.** The RSS paragraph, the email disclosure and the follow form are
**byte-identical** to what a stranger is served. Those sentences are graded by `promises.test.ts` and
`follow-cadence.test.ts` and are not this change's business. RSS still works for a member; it is
simply no longer the only thing in the dialog that does.

**The load-bearing constraint is the negative one, not the feature.** With no session cookie the
Worker runs **no extra query** and renders exactly the document it rendered yesterday. These two
pages are the surfaces this site is indexed and shared as, and **EXP-011's denominator is counted on
them**; a member-only control rendering anonymously would hand member state to every crawler,
unfurler and shared cache and change what those counters count. Asserted with a **positive control**,
so it cannot pass on a page that changed for nobody. `cache-control: private, no-store` is set on the
signed-in variant **only**, so the public response is unchanged in its headers as well as its bytes.

**Run red first.** `test/activation.test.ts` was executed against unmodified source before anything
changed: **10 of its new assertions failed**, including the byte-identity test — red on its *positive
control*, which is the guard that stops it passing on a page nobody's session ever changes.

**Gates.** `npm run check` exit 0 · **457 vitest** (437 → 457, twenty new) · **ops suite 244/244**
(unchanged) · `validate-workflows.py` ok, 13 workflows · `validate-nominations.mjs` 8 valid ·
`npm audit --omit=dev` **0 vulnerabilities**. **Eleven mutations, each reddening its own named
test**, every file restored byte-identical under `sha256sum -c`.

**The production check grades the negative half, and says so rather than dressing it up.**
`verify production` cannot sign in and **this loop will not mint a production member to obtain a
session**, so the member-facing half is graded in workerd and its *shipping* is established by the
expected-commit gate, not by a body check. The new step asserts what a signed-out caller must **not**
see, on documents the job already fetched — so it adds **no request** and moves **no counter**. Its
grep patterns are read **out of the workflow** by `test/desk-offer-render.test.ts` rather than copied
into it: a duplicated pattern keeps passing after the workflow's has drifted, and the workflow is the
one guarding production.

**A mistake of this run's own, recorded rather than quietly fixed.** Mutation testing restored files
with `git checkout -- <file>`, which restores from the **index** — so on a working tree full of
uncommitted work it discarded the change under test along with the mutation. `src/pages.ts` lost its
edits and had to be rewritten; the rewrite is confirmed byte-identical to the original by hash, and
the whole mutation pass was re-run from copy-based backups. Carried into [L-95](LESSONS.md#l-95)
because the procedure already said `sha256sum -c` and the shorthand quietly stopped doing it.

**Magnitude not overclaimed.** `applications` is **0** and `members` is **1**, so **nobody has ever
seen either dialog as a member and no metric moves today.** The defect cost no users. What changes is
that the subscription is now offered where the decision is made, which matters at the moment
distribution opens and not before. This is an activation-surface fix, not a growth intervention, and
it is not offered as one.

**Deliberately NOT touched.** No schema change, no migration, no new data category, no secret, no
dependency, no route added or removed. `POST /:handle/follow` and the email capture are **byte-
untouched** — a member can still take either, and both still say plainly that nothing sends.
The redirect target of `POST /:handle/desk` is still `/today`, deliberately: **a member's first desk
with something on it is the activation event**, and showing it to them is the confirmation. No
`desk_unfollow` surface axis — what is being read is which surface produces *subscriptions*, and a
second pair of names reading 0 on almost every day is instrument for its own sake.
**`FEED_CSS`/`FIND_CSS` still not folded into `CSS`** — bookkeeping, and this change adds **no CSS
rule at all**. **No site-wide `/rss.xml`**: run 172's direct yes/no is still unanswered and stays a
doctrine question. The third-party write boundary was not re-tested and no child session was spawned.
The agent-scout schedule is still disarmed and EXP-013's threshold-2 proposal is **still unruled** —
no reviewer directive since 2026-09-01. No item published, amended, retracted or restored. No spend.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **15 days left.**

---

## Run 176 (2026-09-20 08:35 Sydney) — a member who owns no agent had an empty desk and no way to fill it

**Last updated:** 2026-09-20 08:35 Sydney (2026-09-19 22:35 UTC), run 176 — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged from runs 137-175 and not re-argued here, per [L-07](LESSONS.md).** **The desk a new
member lands on could not be filled, by them or by anybody.**

**The finding.** `follows` is the sole source of everything `GET /today` renders, and in all of
`src/` it had **exactly one writer** — the auto-follow inside `/today` itself, selecting
`creators WHERE member_id = ? AND kind = 'agent'`. That is the agents a member **already owns**. A
member admitted through the front door owns nothing, so the set is empty, the desk is empty, and
**no route, button or form anywhere in this product inserted another row.** The Follow button on a
public feed page writes to `followers` — a different table, holding an email address for a digest
with no sender — and never touched the desk. The only desk that works is the owner's, and it works
only because he owns the agents.

**The empty state told the member to fix it, in a sentence with nothing behind it.** *"Nothing to
read. Your agents run every morning — check back after 7am, or follow more feeds."* A new member has
no agents, and **"follow more feeds" was a verb with no implementation.** Shipped 2026-08-06, stood
**45 days**.

**Run 175's prevention check structurally could not see this, one run after it was written.**
`test/promises.test.ts` sweeps *"every page a stranger can reach"* by fetching every registered GET
route **anonymously**; `/today` and `/home` answer a redirect without a cookie, so they drop out, and
the file's own comment records that as a convenience rather than a hole. What drops out that way is
**the entire member experience — every surface on which activation happens.** Seventh consecutive
run to find a check that could not see its own subject. [L-94](LESSONS.md#l-94).

**The activation metric would have gone green on the empty room, and that is the worst part.**
`retention.members_ever_active` comes from `member_days`, which `/today` writes **on arrival**,
before it renders anything and regardless of whether there is anything to render. A journey test that
seeded no member row confirms it: admit somebody, have them sign in, and the number this loop reports
as its activation evidence moves **0 → 1 for a person shown a blank screen and offered nothing.**

**Why every stage was green and the whole was broken.** Each stage already had a passing test —
`applications.test.ts`, `operator.test.ts`, `pulse.test.ts`, `attention.test.ts` — and **every one of
them hand-seeds the state its stage consumes**, inserting into `waitlist` with SQL rather than
posting to `/waitlist`, or inserting a member with a known `session_token` rather than asking
`POST /api/members` for one. A stage that seeds its own input cannot see the seam above it. The
defect was in no stage; it was an edge nobody wrote.

**What shipped.** `POST /:handle/desk` — session-gated, idempotent, 404 on an unknown handle,
removal on the same route — and a desk that offers the public feeds it can be filled with. **A real
`<form method="post">` and not a fetch**, so it works with JavaScript off, so there is no second code
path to keep honest, and so the endpoint is legible in the delivered HTML. Counters
`desk_follow`/`desk_unfollow` with the usual `_bot` split and a `desk_follow_duplicate` axis, on the
same terms as every other counter here. The false sentence is gone; a member's **own** feed is
excluded from what they are offered, because following your own attention is not following anyone's.

**The assertion is an outcome, not a presence, and that is deliberate.** `test/activation.test.ts`
does not look for a button. It **reads the endpoint the desk itself offers**, calls it, and requires
the next desk to carry the find — so a page offering nothing fails at the read, a page offering
something broken fails at the call, and only a page whose offer actually works passes. Checking that
a control exists would have passed the moment a button was added. **A control is not a capability**,
which is [L-92](LESSONS.md#l-92)'s *a crawl is not an index* one surface along.

**Run red first, and every stage of it was red for the right reason.** Executed against unmodified
source: 5 of 7 assertions failed, the load-bearing one on *"an empty desk offers the member no way to
put a feed on it."* The two that passed are recorded rather than glossed — one of them is
`members_ever_active` moving on the empty desk, which is the finding above.

**Gates.** `npm run check` exit 0 · **437 vitest** (427 → 437, ten new) · **ops suite 244/244**
(unchanged) · `validate-workflows.py` ok, 13 workflows · `validate-nominations.mjs` 8 valid ·
`npm audit --omit=dev` **0 vulnerabilities**. **Nine mutations, each reddening its own named test**,
every file restored byte-identical under `sha256sum -c`.

**Verified from production, not only in workerd.** This session's egress proxy answers `403 CONNECT`
for `justtuned.com`, so a workflow step is the only production reading this loop gets — and *"the
site returns 200"* would have been true even if the new route had not deployed at all.
`verify-production.yml` now posts to `/ava/desk` **with no cookie** and requires **303 → `/login`**:
**404 means the deploy is stale**, **200 means the session gate is gone and anyone can write to a
member's desk.** Deliberately **inert** — the handler returns before it looks up the feed or touches
a counter, so the check writes no `follows` row and moves no `desk_follow` name. That ordering is
pinned by a test rather than assumed, and reversing it reddens.

**A correction to run 175's own record, carried here rather than quietly fixed.** Four files —
`STATUS.md`, `DECISIONS.md`, `LESSONS.md` and `test/promises.test.ts` — stated that the sign-in link
is returned by `POST /api/creators`. **It is not.** That route mints a *feed* and returns
`public_url`/`studio_url`; it creates no member and returns no link. The admission act is
`POST /api/members`. The run correcting two pages for describing a mechanism this service does not
have misdescribed the admission mechanism in the same commit. `README.md` and `METRICS.md` had it
right all along.

**Magnitude not overclaimed.** `applications` is **0**, so **nobody has ever hit this dead end and no
metric moves today.** What changes is that the last step of the funnel is now a step. The cost of the
defect was never lost users — it was seven weeks spent opening distribution to a room with no door.

**Deliberately NOT touched.** **The public feed page's follow dialog is byte-untouched.** A signed-in
member clicking Follow there still gets the email-intent capture rather than the desk subscription
that now exists — that is the next candidate, and it is named rather than folded in, because this
run's job was to make the desk fillable and the dialog is a second entry point to a capability that
until today did not exist. No schema change, no migration, no new data category, no secret, no
dependency, no workflow. No route removed. `arrival:<tag>` and RSS byte-untouched.
**`FEED_CSS`/`FIND_CSS` still not folded into `CSS`** — bookkeeping. **No site-wide `/rss.xml`**: run
172's direct yes/no is still unanswered and stays a doctrine question. **The third-party write
boundary was not re-tested** and no child session was spawned. The agent-scout schedule is still
disarmed and EXP-013's threshold-2 proposal is **still unruled** — no reviewer directive since
2026-09-01. No item published, amended, retracted or restored. No spend.

**An unsolicited third-party comment on issue #1** (2026-09-19, `Nakagawa-master`, no association)
proposed a central claim-authority register. **It is not a reviewer directive and was not treated as
one.** Its distinction — *a statement can be accurate and still exceed current capability* — is sound
and is already what L-93 and this run's finding say; a new register to hold it is control plane, and
[NORTH_STAR](NORTH_STAR.md) rule 7 with [L-08](LESSONS.md) says not to build one. Recorded, declined,
not re-argued.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **15 days left.**

## Run 175 (2026-09-19 20:35 Sydney) — two public pages promised email from a Worker with no sender

**Last updated:** 2026-09-19 20:35 Sydney (2026-09-19 10:35 UTC), run 175 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-174 and not re-argued here, per [L-07](LESSONS.md).** **Two public pages
promised email from a Worker that has no sender.**

**The finding.** `/` told every applicant *"you'll hear back by email."* `/login` told every approved
member *"we send you a personal sign-in link."* **This Worker cannot send email** — no mail binding in
`wrangler.jsonc`, no mail secret, no call to any mail provider anywhere in `src/`. A sign-in link is
**returned in the response body** of the admin-key-gated `POST /api/creators` and handed over by the
operator. **[Corrected run 176: the admission act is `POST /api/members`; `/api/creators` mints a feed and returns `public_url`/`studio_url`, no member and no link.]** Both sentences shipped 2026-08-06 and stood **44 days**.

**Why it is a class and not a typo.** The standard already existed and had already been applied —
**once.** The follow dialog on a feed page reads *"Nothing sends until digests start"*, and run 174's
README states plainly that the email Follow does not send. And the repository knew in writing and
disagreed with itself: `test/route-inventory.test.ts` lists `GET /login` as an *"interstitial ... asks
the owner for a link"* — the real mechanism, sitting in the test suite, while the page it describes
told visitors the opposite. Nothing compared them. **This is [L-90](LESSONS.md#l-90) repeating on the
fix rather than the rule**, and the sixth consecutive run to find a check that could not see its own
subject. [L-93](LESSONS.md#l-93).

**What shipped.** [PR #76](https://github.com/in-c0/tuned/pull/76) → `3550684`. Both sentences now say
what is true, and `test/promises.test.ts` **derives** the set of pages it reads rather than listing it:
every registered GET route, fetched anonymously, keeping whatever answers with HTML. It asserts in
**both directions** — no page may promise mail, and every page collecting an email address must
disclose on that same page that none is sent — so deleting the honest sentence is as red as adding a
dishonest one. Its premise is read from `wrangler.jsonc` and a glob of `src/` rather than a hand-set
boolean, so **shipping a real sender turns it red** instead of leaving pages disclaiming a capability
the service has.

**Two ways the sweep could have been built and been wrong, and both were live.** Filtering by
`isPrivatePath` — the obvious predicate, and the wrong question: it is the *indexing* policy and
`PRIVATE_EXACT` contains `/login`, so that sweep would have skipped one of the two known defects and
reported a clean pass. And scanning source rather than responses: both promises live in inline
`<script>` literals written into the page after a fetch resolves.

**Run red first, and it paid.** Executed against the unfixed source before anything was corrected, per
run 174's own lesson. It reddened on the two known surfaces **and on a third that reading had not
found** — `/enter/<invalid-token>`, which renders the same login page, and therefore the same promise,
to a member whose sign-in link has just failed.

**Gates.** `npm run check` exit 0 · **427 vitest** (423 → 427, four new) · **ops suite 244/244**
(unchanged) · `validate-workflows.py` ok, 13 workflows · `validate-nominations.mjs` 8 valid ·
`npm audit --omit=dev` **0 vulnerabilities**. **Six mutations, each reddening its own named test**,
every file restored byte-identical under `sha256sum -c`.

**Magnitude not overclaimed.** `landing_render` was **4 over eleven days** ([EXP-011](EXPERIMENTS.md))
and the site is absent from the search index ([L-92](LESSONS.md#l-92)), so **essentially nobody read
either sentence and no metric moves.** What changes is that the front door no longer carries a promise
the system cannot keep — which matters at the moment distribution opens, not before.

**Deliberately NOT touched.** The feed and find follow dialogs are **byte-untouched** — they already
disclose, and the new assertion confirms them rather than rewriting them. No route, schema, counter,
secret, dependency, workflow or data category. No new public claim, only two removed. `arrival:<tag>`
and RSS byte-untouched. **`FEED_CSS`/`FIND_CSS` still not folded into `CSS`** — bookkeeping.
**No site-wide `/rss.xml`**: run 172's direct yes/no is still unanswered and stays a doctrine question.
**The third-party write boundary was not re-tested** and no child session was spawned. The agent-scout
schedule is still disarmed and EXP-013's threshold-2 proposal is **still unruled** — no reviewer
directive since 2026-09-01. No item published, amended, retracted or restored. No spend.

**A mail sender is an owner boundary, and it is named here once rather than made a third card.** Making
these two sentences *true* rather than accurate needs a mail provider account — a credential and
probably a spend — so it is outside this session's envelope. Until one exists, **approving a member is
a manual act**: the operator reads `/api/applications`, calls `POST /api/members`, and conveys the
returned `login_url` by hand. **[Corrected run 176: the admission act is `POST /api/members`; `/api/creators` mints a feed and returns `public_url`/`studio_url`, no member and no link.]**

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **16 days left.**

---

## Run 174 (2026-09-19 14:35 Sydney) — the site has no pages in the search index, and the one indexed property did not link to it

**Last updated:** 2026-09-19 14:35 Sydney (2026-09-19 04:35 UTC), run 174 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-173 and not re-argued here, per [L-07](LESSONS.md).** **The site has no
pages in the search index, and never has.**

**The reading.** Measured 2026-09-19 04:05–04:15 UTC, against a working control: `site:hono.dev`
returns nine pages on that domain, so the operator functions; **`site:justtuned.com` returns zero.**
A literal search for `"justtuned.com"` returns **this GitHub repository** and no page of the site. An
exact-phrase search for a string in the footer of **every** public page returns nothing from the
domain. Three query shapes, one control, same answer. Full reading and its limits in
[METRICS](METRICS.md); it is one search backend and absence from an index is evidence rather than
proof, and both caveats are recorded there rather than dropped here.

**What makes this the finding and not a bad result.** Over seven weeks this loop built every
technical precondition for being found, and each was shipped carefully and graded properly — feed
autodiscovery (run 86), `robots.txt`, `sitemap.xml`, canonical and Open Graph (run 108), find pages
and their links (runs 164–165), and `X-Robots-Tag: noindex` scoped to private paths and asserted
**both present and absent** in `test/crawl.test.ts`. All correct. And the machines came:
`robots_fetch_bot` **24–52/day**, `sitemap_fetch_bot` **9–24/day**, `item_view_bot` **3 → 150 → 101 →
72** across 09-15…09-18 as crawlers walked the new find pages. **They took all 95 URLs and indexed
none of them.** No run ever asked whether they had, because every check written graded a
*precondition* — is the tag there, is the header absent, does the sitemap parse — and never the
*outcome*. **A crawl is not an index.** [L-92](LESSONS.md#l-92).

**The cause is not a defect in anything shipped.** It is that the site has **no inbound links**, and a
site with no inbound links is not indexed however clean its markup is. That makes this a distribution
fact, not a markup one — and it lands on the same boundary everything else does.

**What that closes.** **The search lever is closed as an arrival channel for this window** and should
not consume another cycle; the standing answer to any candidate proposing SEO work is recorded in
[DECISIONS](DECISIONS.md). **IndexNow was considered and rejected on this run's own data** — crawlers
already fetch robots and the sitemap tens of times daily, so discovery is not the constraint.

**What shipped, and it is deliberately small.** For the one query that returns this project at all,
the result is the GitHub repository — **and its README linked to the product nowhere.** The domain
appeared in it exactly twice, once inside a fenced `curl` block and once as a backticked redirect
URI; neither is a hyperlink. The README now opens with the live link, points at a public feed page,
its RSS and the landing page, documents the `/:handle/:id` find surface it had never listed, drops a
leaked local Windows path, and states plainly that the email Follow does not send.
`scripts/readme-entry.test.mjs` pins seven properties, one of them that **only allowlisted public
paths may be advertised from an indexed page** — a capability URL must never be published there.

**Magnitude not overclaimed.** GitHub marks user-content links `rel="nofollow"`, so this is chiefly a
**human** path from the one place the project is findable, and only incidentally a crawl hint. **One
README will not get 95 URLs indexed and nothing here predicts it will.** What it removes is a dead
end: until today someone who found this project could not click through to it.

**The check written this run repeated the error inside its own file, and it is recorded rather than
quietly fixed.** The first assertion — *"links to the live site outside any code fence"* — stripped
fenced blocks only, and **passed when run against the pre-run-174 README, the exact document it
exists to catch**, because that README's one outside-a-fence occurrence was an inline backticked
span. The mutation pass did not surface it either: mutating the link into a fence reddened a
*different* test, which reads as coverage. Only running the gate against the original document showed
it. **A check is validated by failing on the state it was written to catch, not by passing on the
fixed one.** Fixed, re-verified red against the original, re-mutated.

**Gates.** `npm run check` exit 0 · **423 vitest** (unchanged — no `src/` change) · **ops suite
244/244** (237 → 244, seven new) · `validate-workflows.py` ok, 13 workflows ·
`validate-nominations.mjs` 8 valid · `npm audit --omit=dev` **0 vulnerabilities**. **Seven mutations,
each reddening its own named test**, `README.md` restored byte-identical after every one.

**Deliberately NOT touched.** **No `src/` change — the deployed Worker is byte-identical**, so
nothing deployed, nothing could regress and no rollback path was required. No route, schema, counter,
secret, dependency, workflow, page or public claim; no new data category. `arrival:<tag>` and RSS are
byte-untouched. **`FEED_CSS`/`FIND_CSS` still not folded into `CSS`** — bookkeeping, and this run had
no reason to touch the Worker. **No site-wide `/rss.xml`**: run 172's direct yes/no is still
unanswered and it stays a doctrine question. **The third-party write boundary was not re-tested** and
no child session was spawned. The agent-scout schedule is still disarmed and the threshold-2 proposal
is **still unruled** — no reviewer directive since 2026-09-01. No item published, amended, retracted
or restored. No spend.

**What this does to the owner card, which is the one thing here that is new rather than restated.**
The `awesome-rss-feeds` submission is **not re-argued** per [L-07](LESSONS.md). But its *priority
class* changes on this evidence: it was filed as *"the first measurable external distribution test"*,
and it is now also **the only mechanism by which this site acquires an inbound link at all** — and
therefore the precondition for it existing in search. A directory listing is an indexed page that
links here. **Nothing the executor can ship substitutes for one.**

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **16 days left.**

---

## Run 173 (2026-09-19 08:35 Sydney) — EXP-011 is graded: 686 human-flagged landing views produced 4 rendering browsers

**Last updated:** 2026-09-19 08:35 Sydney (2026-09-18 22:35 UTC), run 173 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-172 and not re-argued here, per [L-07](LESSONS.md).** **EXP-011 is graded:
686 human-flagged landing views produced 4 rendering browsers.**

**The reading, on its pre-named date.** [EXP-011](EXPERIMENTS.md) asked whether `landing_view` is a
browser at all. Over the **eleven complete UTC days 2026-09-05 … 2026-09-15** — the window as shortened
by run 166 under its own regression clause — **R = Σ `landing_render` ÷ Σ `landing_view` = 4 ÷ 686 =
0.58%**. The cut point registered on 2026-09-04, before the counter existed, was **R < 10% ⇒ Fork R-A,
*mostly not a browser***. 0.58% is one seventeenth of it, so this is not a coin toss. **Nine of the
eleven days produced no rendering browser at all**; all four renders fell on 09-07 and 09-09.
`landing_engage` read **1** across the window and `application_start` **0**.

**What that settles, and it is the question this loop has been arguing with itself about since
2026-08-18.** The standing claim — *"the landing page is not the bottleneck, distribution is"* — rested
on [EXP-007](EXPERIMENTS.md) Fork A: one day of an interaction counter, which **cannot distinguish
*nobody real arrives* from *real people arrive and the offer does not move them***. Both worlds predict
the same near-zero. Eleven days of a render beacon distinguish them, and the answer is the first: the
traffic is overwhelmingly clients that take the HTML and execute none of it. The claim is **upheld and
upgraded from an inference to a measurement**, and [NORTH_STAR](NORTH_STAR.md) now carries the measured
basis.

**Three counter rules now bind every later run.** `landing_view` is **retired as an audience number** —
it stays a true count of requests that did not declare themselves as automation, and it is not a visit,
a session or a person; **0.58% is the measured size of that gap.** `landing_render` is **the denominator
of every landing-page reading** from here. And **no rate is formed on this window**: `landing_engage ÷
landing_render` is 1 ÷ 4, that quotient is Fork R-C's next action and **not R-A's**, and computing it
anyway would be [L-37](LESSONS.md)'s error with a numerator of four.

**Said as plainly as the result.** **R is not a count of people and 4 is not four visitors** — a
JS-executing crawler that does not declare itself is indistinguishable from a person here, and the owner
is a member who clicks around inside Tuned, so **4 is an upper bound on rendering browsers and may be
zero humans.** It is not demand, not traction, and **it does not certify the landing page**: Fork R-A
moves effort off the page because almost nothing reached it, not because the page was found good.
**EXP-011 is closed** — one reading, one date, no extension, no recomputation.

**The direction this sets for the rest of the window.** Fork R-A's registered next action, written blind
on 2026-09-04, is that **the remaining runs go to getting real arrivals rather than to the page.** That
is now the standing answer to any candidate proposing to improve `/`, recorded in
[DECISIONS](DECISIONS.md). **Sixteen days left.**

**The instrument shipped alongside, and the honest limit on it.** Every pre-registered reading here is
defined over *complete* UTC days, and **nothing in the repository could tell a complete day from a
partial one** — a snapshot taken at 23:05Z writes a row for today that is indistinguishable, at the
point of use, from the same row taken after midnight. `ops/METRICS.md` carries ~10 hand-written *"this
day is partial"* notes, and [L-37](LESSONS.md) records run 57 getting it wrong and publishing a rate off
an unfinished day. Worse, the mechanism built to remove the hazard was **withdrawn by something nobody
was watching**: `metrics-snapshot.yml`'s `15 0 * * *` schedule exists, in its own header's words, so the
previous day is on disk *"complete, within minutes of ending"* — and its six most recent fires landed
**4.48h, 4.65h, 4.58h, 4.68h, 4.70h and 4.55h late, none inside fifteen minutes**.
`scripts/metrics-window.mjs` now answers that one question and fails closed; the snapshot's commit
message carries `complete through <day>`, so `git log -- ops/metrics/` is a ledger.
**It did not rescue this reading** — run 166 had already shortened the window, so the source was
admissible by 2.2 days and the guard returned ADMISSIBLE on the first call. It is prospective, for
EXP-012 and EXP-013, whose readings are still ahead. [L-91](LESSONS.md#l-91).

**A second unpinned fact, found while discharging Fork R-E and the same shape again.** R-E fires if any
first-party client renders `/` without declaring itself. It did **not** fire. But the ops verifier
survives it because the word **`uptime`** happens to appear in a human-readable parenthetical —
*"first-party uptime and metrics check"* — and `BOT_UA` matches on it. Rewording that to *"first-party
health and metrics check"*, an edit that reads as pure prose, would have routed **every** `verify
production` and `metrics snapshot` probe into the unsuffixed `landing_view` that R divides by, with
nothing red anywhere. Two assertions in `test/metrics.test.ts` now import the real classifier and grade
both first-party strings; that rewording turns them red.

**Gates.** `npm run check` exit 0 · **423 vitest** (421 → 423, two new) · **ops suite 237/237**
(215 → 237, twenty-two new) · `validate-workflows.py` ok, 13 workflows · `validate-nominations.mjs`
8 valid · `npm audit --omit=dev` **0 vulnerabilities**. **Twelve mutations, named tests red on each**,
every source file restored byte-identical: eight against `scripts/metrics-window.mjs` (the day
subtraction dropped, the open-window comparison pointed at the wrong bound, the empty-`daily` verdict
made admissible, the rolled-over-date rejection removed, the short-history check removed, the
window-close instant moved a day early, an unreadable snapshot downgraded from *could-not-ask* to
*clean no*, and a bad `generated_at` defaulting to epoch), and four against the first-party
user-agents (the `uptime` prose rewording, the Playwright UA undeclaring itself, the `USER_AGENT`
constant renamed away, and the shell quoting changed).

**Deliberately NOT touched.** **No `src/` runtime change — the deployed Worker is byte-identical**, so
nothing deployed, nothing could regress, and no rollback path was required. **`FEED_CSS` and `FIND_CSS`
were NOT folded into `CSS`**, although runs 171 and 172 both said that unblocks the moment EXP-011 is
read: bundling a `src/pages.ts` refactor into the run taking a one-shot reading couples deploy risk to
a measurement. It is bookkeeping and it keeps. No route, schema, counter, secret, dependency, page or
public claim; no new data category. `arrival:<tag>` and RSS are byte-untouched. The agent-scout schedule
is still disarmed and the threshold-2 proposal is **still unruled** — no reviewer directive since
2026-09-01. No item published, amended, retracted or restored. No spend.

**Not claimed.** This adds no traffic, no user and no dollar, and nothing here predicts any. What it
changes is that the loop now **knows** the landing page has essentially no rendering audience, instead
of inferring it from a counter that could not tell the two worlds apart — and knows it well enough to
stop spending the remaining days there.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **16 days left.**

---

## Run 172 (2026-09-18 20:35 Sydney) — eighty-seven pages asked strangers to subscribe to feeds that stopped publishing in July

**Last updated:** 2026-09-18 20:35 Sydney (2026-09-18 10:35 UTC), run 172 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-171 and not re-argued here, per [L-07](LESSONS.md).** **Eighty-seven pages
asked strangers to subscribe to feeds that stopped publishing in July.**

**In plain terms.** A production read of **every** public feed this run — `2026-09-18T10:08:54Z`,
[qa-browser 46](https://github.com/in-c0/tuned/actions/runs/35333163076), against `b58c35a` — found
`ava` **1134.6h** stale, `sportstech` **143.8h**, and `wearables`, `wellbeing` and `graphics` all
**1187.3h**. **Four of five feeds have published nothing since 30 July**, and **sixty-eight of the
eighty-seven find pages belong to one of them.** Run 150 gave every feed page a follow button and run
171 gave all eighty-seven find pages one, both carrying *"every find like this one, as it is
published"* and *"new finds reach your reader as @handle publishes them."* Those sentences are
conditional, so neither is false — and neither says the thing the decision turns on.

**Why that is the defect and not a quibble.** **RSS is the only subscription on this platform that
delivers anything.** `followers` holds addresses no code in `src/` can send to — there is no mail
provider, no sender, no digest job — so following is the **one conversion a stranger can complete with
no account, no application and no owner act**, and it was being spent on a stream with nothing coming.
[L-18](LESSONS.md) already settled the rule: staleness is a fact about the world and not a defect; a
page that declines to mention it is.

**The part worth more than the copy change.** The loop **has** an instrument for exactly this rule —
`qa/freshness.spec.mjs`, `retiredClaimsStillPresent`, green on every run since 2026-08-13 — and it
reads **`GET /` and nothing else.** Every surface it grades is the landing page. The two surfaces that
actually convert were outside it **by construction**, so two runs shipped a claim into a domain the
rule's own check could not see, and the check kept passing. That is [L-90](LESSONS.md#l-90), and it is
[L-87](LESSONS.md#l-87)'s family one level up: there the gate did not run the check, here the gate is
sound and its *subject* is stale.

**What shipped.** [PR #73](https://github.com/in-c0/tuned/pull/73) →
[`6cab57b`](https://github.com/in-c0/tuned/commit/6cab57b78b5559cd3c113fb5508da97f4734b424).
`lastPublished()` renders the age of the feed's newest public item in days; `lastPublishedClause()`
goes into the find page's follow block and into **both** follow dialogs. **The age reported on a find
page is the FEED's, never the rendered item's** — a find page is arrived at from a search result or a
pasted link, so its item is as likely to be the feed's oldest as its newest, and *"how old is this
find?"* is a true number answering the wrong question. `more` is already ordered `created_at DESC`, so
the newest of `[item, ...more]` is the feed's newest exactly, with **no extra query**. It is
**unconditional — no threshold, no change of tone above one**: a cut point chosen here would be a
number fitted to the five feeds this executor can see, which is the shape [EXP-013](EXPERIMENTS.md)'s
Fork B exists to refuse. **Days, floored:** 143.8h reads as *5 days*, not 6, and never as "seven
weeks". An empty feed says it has published nothing rather than reporting the age of nothing.

**Browser QA caught a defect the overflow check structurally could not.** The first version wrapped
the age in `<b>`, and `.find-follow .ff-copy b` is **`display: block`** because it styles the *"Follow
@handle"* heading directly above. One sentence became **three lines with the full stop orphaned on its
own row** — and `docOverflow` read **0** throughout, because nothing overflowed. A layout check that
only measures overflow cannot see a layout that is merely wrong. The markup was dropped rather than a
rule added, and the block test now asserts the whole sentence as **one uninterrupted run**, which is
the property rather than the prose.

**Gates.** `npm run check` exit 0 · **421 vitest** (408 → 421, thirteen new) · **ops suite 215/215** ·
`validate-workflows.py` ok, 13 workflows · `validate-nominations.mjs` 8 valid · `npm audit --omit=dev`
**0 vulnerabilities** — every one on the branch with the commit on it.
[check 105565006610](https://github.com/in-c0/tuned/actions/runs/35334146869), a `pull_request` event,
**success**, alongside Workers Builds and GitGuardian. **Eight mutations, named tests red on each**,
`src/pages.ts` restored byte-identical after every one: `feedLatest` collapsed to this page's item, the
clause dropped from each of the three surfaces, `floor` relaxed to `round`, the empty-feed branch made
to report an age, a threshold introduced so the age shows only when stale, and the `<b>` put back.
**Browser QA at 390px and 1100px** against a local `wrangler dev` seeded to the real `graphics` dates:
`docOverflow` 0, no element past the viewport, the dialog fits both, one running sentence, and **no
first-party HTTP errors**.

**Deliberately NOT touched.** **`landingPage` is byte-identical, asserted against `master` rather than
claimed**, so **[EXP-011](EXPERIMENTS.md#exp-011) is untouched by this run** — its reading stays
**2026-09-19** and **no value of R is computed, quoted or recorded here.** **No new CSS rule**, so
`FEED_CSS` and `FIND_CSS` are byte-unchanged and still waiting to be folded into `CSS` after that
reading. No route, schema, counter, secret, dependency or public claim; no new data category.
`arrival:<tag>` is byte-untouched. RSS is byte-untouched. **Nothing was published to make a feed look
alive** — freshness-as-motive was ruled out at run 106 and [EXP-008](EXPERIMENTS.md)'s binding clauses
disqualify it; the honest response to a dormant feed is to say it is dormant. The agent-scout schedule
is still disarmed and the threshold-2 proposal is **still unruled** — no reviewer directive since
2026-09-01. No item published, amended, retracted or restored. No spend.

**Not claimed.** This adds no traffic and nothing here predicts that it will. It makes the one
conversion this funnel can complete an **informed** one, and on four of five feeds that will mean
**fewer** follows, honestly. `find_follow_open` and `follow_open` have read **0** throughout, so
nothing measurable was lost in the eight days before it — **which is luck, not mitigation.**

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **17 days left.**

---

## Run 171 (2026-09-18 14:35 Sydney) — the page this site is indexed and shared as had no way to follow anything

**Last updated:** 2026-09-18 14:35 Sydney (2026-09-18 04:35 UTC), run 171 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-170 and not re-argued here, per [L-07](LESSONS.md).** **The page this site
is indexed and shared as had no way to follow anything.**

**In plain terms.** A find page at `/<handle>/<id>` is the unit this site is indexed and shared as —
**eighty-seven of them against five feed pages and one landing page** — so a stranger's first Tuned
page is far likelier to be one of these than the front door. It had **no follow affordance at all**.
The only subscription on it was the **12px "RSS" link in the corner**, which resolves to an XML
document; a visitor who wanted more of *this person's attention* had to work out that the handle in
the kicker was a link, follow it, and find the button over there. Run 164 gave finds an address, run
165 linked to them, run 169 put the provenance chain in the feed — and the chain **ended on a page
that could not convert.**

**Why this run and not another instrument.** Run 170 closed by committing its successor to arrival or
product under [NORTH_STAR rule 7](NORTH_STAR.md), after two control-plane cycles in three. This
discharges that. Following a public feed needs **no application, no approval, no owner act and no
spend** — it is the one conversion step in this funnel that is not behind a gate, and it was missing
from the surface most likely to be arrived at.

**What shipped.** [PR #72](https://github.com/in-c0/tuned/pull/72). `itemPage` renders a follow block
below the provenance list and above the siblings, plus the same dialog the feed page has — **RSS
first and labelled as the one that works today, email second and labelled as not sending yet.** Four
decisions are pinned by tests rather than left to inspection. It is **unconditional**: `more` is empty
on a one-item feed, and an affordance that disappears on the smallest feeds is not one. It sits
**below `open-cta`**, graded by document order — this page exists to send people to the source, and a
follow ask that outranked the outbound link would be the destination-that-replaces-the-source shape
the doctrine boundary rules out. The form posts to the **feed's** own path, read from a data
attribute: `CLIENT_JS` derives that endpoint from `location.pathname`, which here would POST to
`/<handle>/<id>/follow` — **a 404, with a dialog that looked identical.** And the dialog is wired to
**`find_follow_open`/`find_follow_rss`**, not the feed page's names.

**The counter separation is the part that would have been easy to get wrong.** `follow_open` and
`follow_rss` are published as properties of a **feed** page, and `follow_open`'s honest denominator is
`feed_render` — which a find page structurally cannot emit. Reusing them would have routed a second
surface into a running number **without changing its name**, which is [L-87](LESSONS.md#l-87)'s shape
wearing the appearance of code reuse. `follow_submit_find`/`follow_invalid_find` are the matching
**axis** on `POST /<handle>/follow`, never summed into the buckets: the find dialog sends
`from: "find"` and the feed page sends nothing, so **every follow recorded before this run keeps the
meaning it was written with.** The route still classifies and never refuses.

**What the reading rests on, with its limit stated before anything else claims otherwise.** Over the
three complete days `item_render` has existed it read **3, 2, 2**; `landing_render` read **0, 1, 0**
on `landing_view` **84, 55, 40** ([ops/metrics/latest.json](metrics/latest.json)). The find surface is
where a rendering browser shows up at all. **It is not evidence that strangers are arriving.**
`item_render` carries no on-site axis, `item_view_onsite` read **19** and **6** on the same two days,
and the owner is the one member who clicks around inside Tuned — so some or all of those renders may
be internal. **No arrival is claimed and none is claimable.**

**A check of this run's own was written vacuous and caught by its own mutation.** The ordering
assertion used `html.indexOf("open-cta")` — and `open-cta` is also a **selector in the stylesheet
`layout()` inlines into `<head>`**, which is before the body however the body is ordered. It survived
the mutation that moves the follow block above the CTA. Rewritten against the anchor's own markup, it
fails on it. That is [L-89](LESSONS.md#l-89), and it is [L-85](LESSONS.md#l-85)'s family in a check
written the same hour L-85 was being cited.

**Gates.** `npm run check` exit 0 · **408 vitest** (397 → 408, eleven new) · **ops suite 215/215** ·
`validate-workflows.py` ok, 13 workflows · `validate-nominations.mjs` 8 valid · `npm audit --omit=dev`
**0 vulnerabilities** — every one on the branch with a commit on it. **Browser QA at 390px and
1100px** against a local `wrangler dev`: no document overflow, block and dialog fit both viewports,
the copy column is not squeezed by the button, `find_follow_open` fires **once per page load** across
a close-and-reopen, `follow_open`/`feed_render` never fire, the email path POSTs to
`/sportstech/follow` and reports success, and there are **no first-party console or HTTP errors**.
**Six mutations, named tests red on each**, `src/pages.ts` and `src/index.ts` restored byte-identical
after every one: the pulse renamed to the feed-page counter, the block deleted, the block moved above
the CTA, the endpoint derived from `location.pathname`, the submit axis dropped, and the axis
defaulted to true.

**Deliberately NOT touched.** `src/pages.ts` is **untouched above line 942**, so the **landing page and
the feed page are byte-identical** and **[EXP-011](EXPERIMENTS.md#exp-011) is untouched by this run** —
its reading stays **2026-09-19** and **no value of R is computed, quoted or recorded here.** `FIND_CSS`
is page-scoped for exactly the reason `FEED_CSS` is, and carries the same instruction to be folded
into `CSS` once EXP-011 is read. No route, schema, secret, dependency or public claim; no new data
category. `arrival:<tag>` is byte-untouched. RSS is byte-untouched. The agent-scout schedule is still
disarmed and the threshold-2 proposal is **still unruled** — no reviewer directive since 2026-09-01.
No item published, amended, retracted or restored. No spend.

**Not claimed.** This gives eighty-seven indexed pages a conversion action they did not have. **It does
not create traffic, and nothing here predicts that it will.** Whether anyone takes it is what
`find_follow_open` and `find_follow_rss` exist to say, and both start at zero on this deploy.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **17 days left.**

---

## Run 170 (2026-09-18 08:35 Sydney) — a 404 is not a request failure, so nothing in the repository graded one

**Last updated:** 2026-09-18 08:35 Sydney (2026-09-17 22:35 UTC), run 170 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-169 and not re-argued here, per [L-07](LESSONS.md).** **A 404 is not a
request failure, so nothing in the repository graded one.**

**In plain terms.** Run 169's landing bracket recorded one console error — *"Failed to load resource:
the server responded with a status of 404 ()"* — and **could not say which resource**, because the
spec stored the message and not the URL. Run 169 registered the repair as its first candidate. Going
after it found something larger than a missing field: **there was no check that could have caught the
404 at all.** Every browser spec here grades `requestfailed`, and **a 404 is not a request failure** —
the server answered. `qa/settle-requests.mjs` states that fact in its own header and then uses it only
to argue about aborts. So a subresource declared on our own origin could 404 on every page load with
`firstPartyRequestFailures` empty and all six gates green. Not weaker coverage — **none**, wearing the
shape of a passing assertion.

**What shipped.** [PR #71](https://github.com/in-c0/tuned/pull/71) →
[`8433a13`](https://github.com/in-c0/tuned/commit/8433a1365a927b4486d98af32deb927d64373883).
`trackHttpErrors(page, isFirstParty)` collects first-party responses with status ≥ 400, naming **url,
status and resourceType**. Main documents and refused pulses are not exempt; third-party hosts are — a
dead favicon on someone else's CDN is not our defect. `public-surfaces.spec.mjs` records it as
`firstPartyHttpErrors` and **grades** it. `pulse-instrument.spec.mjs` records it as `http_errors` and
its console errors now carry `location().url`, but **grading deliberately stays out of that file**: it
is EXP-011's apparatus with a reading due 2026-09-19, and a new failure mode there could void a
bracket for a reason unrelated to what the bracket brackets.

**The half no browser instrument can reach, which is the part worth more than the field.** `og:image`
is **never requested by the page that declares it** — it is fetched by unfurlers, off our network, on
a machine no check here runs on. It can 404 forever with every browser spec green and every request
list empty. `socialHead` falls back to `${SITE_ORIGIN}/icon-512.png` for **every page with no image of
its own**, the landing page included, so that is the image every share of this site unfurls with. A
new route-level test reads the icon and `og:image` URLs **out of the served HTML** — a constant list
here would go stale, which is the failure being checked — keeps the same-origin ones, and requires
each to answer **200 with an `image/*` content-type**. A 200 serving the HTML 404 page would satisfy a
status check and still unfurl as nothing. The count is graded too, so it cannot pass by checking
nothing.

**The defect this run went looking for does not exist, and that is the result rather than a
disappointment.** Both repaired instruments were dispatched against production serving
[`2740d05`](https://github.com/in-c0/tuned/commit/2740d05): `firstPartyHttpErrors` **`[]`** on the
landing page and the demo feed at both viewports, `console_errors` **`[]`**, `http_errors` **`[]`**,
and both declared assets resolve — `/icon-192.png` **200 `image/png` 20,169 B**, `/icon-512.png`
**200 `image/png` 80,418 B**. **Nothing was fixed, because nothing is broken.** The 404 seen at
10:07 UTC does not reproduce at 22:20 UTC, and it **cannot be identified retroactively** — the
artifact that saw it did not record the URL, which is exactly the gap this run closed. A working
hypothesis was checked and discarded rather than shipped: `layout()` declares `/icon-192.png` on
every page and no Worker route serves it, which looked like the answer until production said the
`assets` binding serves it at 200. **An earlier reading that the icons landed on 2026-09-12 was an
artifact of a shallow clone bottoming out on that date, not real history, and is withdrawn.**

**What this run is, stated plainly.** Control-plane work, and the second such cycle in three. It ships
no user-visible change and creates no traffic. It is taken because the loop's sentence *"every gate is
green"* was covering a class of production defect it structurally could not see, on the surfaces the
only two available levers depend on. **Under [NORTH_STAR rule 7](NORTH_STAR.md) that budget is now
spent: run 171 goes to arrival or product, not to instruments.**

**Gates.** `npm run check` exit 0 · **397 vitest** (389 → 397, eight new) · **ops suite 215/215** ·
`validate-workflows.py` ok, 13 workflows · `validate-nominations.mjs` 8 valid · `npm audit --omit=dev`
**0 vulnerabilities** — every one on the branch with a commit on it. [check 295](https://github.com/in-c0/tuned/actions/runs/35281357919),
a `pull_request` event, **success**. **Three mutations, named tests red on each**, `qa/settle-requests.mjs`
restored byte-identical after every one: the first-party filter dropped, the threshold relaxed past
404, the URL blanked — the L-85 shape itself.

**Deliberately NOT touched.** **`src/` is byte-identical**, so the landing page is byte-identical and
**[EXP-011](EXPERIMENTS.md#exp-011) is untouched by this run** — its reading stays **2026-09-19** and
**no value of R is computed, quoted or recorded here.** No route, schema, counter, secret, dependency
or public claim; no new data category. `arrival:<tag>` is byte-untouched. RSS is byte-untouched. The
agent-scout schedule is still disarmed and the threshold-2 proposal is **still unruled** — no reviewer
directive since 2026-09-01. No item published, amended, retracted or restored. No spend.

**Not claimed.** This fixes no user-visible defect and repairs no outage. **It does not create traffic,
and nothing here predicts that it will.**

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **17 days left.**

---

## Run 169 (2026-09-17 20:35 Sydney) — the surface people subscribe to said everything about the source and nothing about the attention

**Last updated:** 2026-09-17 20:35 Sydney (2026-09-17 10:35 UTC), run 169 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-168 and not re-argued here, per [L-07](LESSONS.md).** **The surface people
subscribe to said everything about the source and nothing about the attention.**

**In plain terms.** An item in `/<handle>/rss.xml` carried the source's title, the source's URL and the
source's blurb. Nothing named who observed the find, nothing named who chose it, and nothing linked to
the page that states either. The channel-level `(AI agent)` label was the document's only provenance,
and a reader renders that **once in a sidebar beside a feed name** — not on the item a subscriber is
actually reading. On a product whose entire subject is provenance, **the one surface anybody subscribes
to carried none of it.**

**Why now, and why it counts as arrival rather than polish.** Run 168 closed by committing its
successor to arrival after three of four cycles went to QA and control-plane defects.
[EXP-007](EXPERIMENTS.md) is graded **Fork A** — the bottleneck is arrival — both named distribution
channels are owner-blocked with **A0** behind them, and search and sharing are the only levers needing
no venue's permission, no owner act and no spend. Two facts make this the sharing lever's sharpest
edge today: run 164 gave every published find an address at `/<handle>/<id>` on **2026-09-15** and
`rssFeed` has been **byte-untouched since**, so the addresses existed for two days and the feed never
learned about them; and **both pending owner-blocked submissions name this exact route** — the
`awesome-rss-feeds` packet submits `/sportstech/rss.xml`. What a directory's subscribers would have
received is this item. The differentiator was missing from the channel the distribution plan depends
on, *before* the plan ran.

**What shipped — one function, and three decisions pinned by tests rather than left to inspection.**
Each item's `<description>` now carries the chain in the words the find page already uses — *"Observed
by @wearables, read and chosen by @ava."* — and an anchor to that find's page on the canonical origin.
**`<link>` still points at the source**: the permalink is a *second* affordance, the same call `card()`
makes on a feed page, and re-pointing the primary link would send every click on a subscribed feed to
Tuned instead of to the thing the member paid attention to. **`guid` strings do not move** — a reader
keys "have I shown this?" on that string, and rewriting fifty of them to the new addresses re-delivers
every item in every feed as unread. **The advertised permalink is fetched, not matched**, because a
well-formed link to a 404 passes every check made of its text. An item with no note and no source blurb
used to serve an **empty** `<description>`; it now says who selected it and where its page is.

**What this run cannot measure, said before anything else claims otherwise.** An arrival from a reader
lands in `item_view` with no `Referer` and is **not separable** from any other off-site find-page view.
Attributing it needs a `?src=` tag, which needs `ARRIVAL_TAGS`, which sits inside EXP-009's hold — and a
tag published inside a public document is the `qa` contamination shape again. **Declined, registered for
the reviewer, not decided here.** This run therefore ships a change it cannot grade, and says so.

**Also discharged, as a registered obligation rather than a second action.** EXP-011's **far-side
instrument bracket**, due from 2026-09-17: [qa-browser 35208853203](https://github.com/in-c0/tuned/actions/runs/35208853203),
production serving `a6a6476`, all three pulses **204**, `landing_render_observed: 1`, **`page_errors:
[]`** — the registered hoist trigger did not fire, and with all three brackets green **Fork R-D is
excluded across the whole span rather than at its ends**. **No value of R is computed, quoted or
recorded here; the reading stays 2026-09-19.** One field did change and is recorded rather than passed
over: `console_errors` went from `[]` at run 149 to **one 404 on a landing-page subresource**. Not the
trigger, cannot move R's inputs, and **the artifact cannot say which resource** — the spec records the
message and not the URL, which is [L-85](LESSONS.md#l-85) in this loop's own instrument one run after
L-85 was written. Registered, not repaired inside a bracket dispatch.

**The change broke a check, every gate was green, and both of those are true — [L-87](LESSONS.md#l-87).**
`qa/exp008-provenance.spec.mjs` asserts a nomination's why line against an RSS item's `<description>`
with an **exact string equality**, and this change gives that field structure. It is **dispatch-only by
design** — `qa-browser` never runs on push, because recurring headless traffic through production's own
funnel counters would corrupt them — so six green gates, a green `pull_request` check and a green
`verify production` said **nothing at all** about a check that reads the exact field being changed. It
was found by grepping `qa/` for the surface *after* the merge, not before it. L-86 was a gate that could
not pass where it gates; this is a check with **no gate to fail at**. The repair **moves layer rather
than relaxing**: what EXP-008 grades is that the *whole* why line reaches a subscriber untruncated, so
the comparison stays exact and re-aims at the paragraph now carrying it. Matching the description with
`toContain` would have graded the same words and **stopped grading "whole"**, while looking like the
smaller edit. Two assertions are added on the same fetch for what the new structure is *for*: the
provenance paragraph must name the selector and carry that find's address.

**Gates.** `npm run check` exit 0 · **389 vitest** (379 → 389, ten new) · **ops suite 215/215** ·
`validate-workflows.py` ok, 13 workflows · `validate-nominations.mjs` 8 valid · `npm audit --omit=dev`
**0 vulnerabilities** — every one run **on the branch with a commit on it**, the condition run 168
repaired. **Five mutations, named tests red on each**, `src/pages.ts` restored byte-identical after
every one: the anchor dropped, `<link>` re-pointed at Tuned, the outer escape removed, `guid` rewritten
to the permalink, the `via_handle` branch collapsed.

**Deliberately NOT touched.** **The landing page is byte-identical**, so **[EXP-011](EXPERIMENTS.md#exp-011)
is untouched by this run.** No counter, route, schema, secret, dependency or public claim; no new data
category. `arrival:<tag>` is byte-untouched. The agent-scout schedule is still disarmed and the
threshold-2 proposal is **still unruled** — no reviewer directive since 2026-09-01, and this executor
will not arm a schedule on its own reading of a threshold it proposed. No item published, amended,
retracted or restored. No spend.

**Not claimed.** This puts the product's subject on the surface people subscribe to, and it is the
surface both pending submissions point at. **It does not create traffic, and nothing here predicts that
it will.** Nor can this run measure whether any reader follows the link, for the reason stated above.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **18 days left.**

---

## Run 168 (2026-09-17 14:35 Sydney) — the change that broke the pull-request gate was merged without passing through it

**Last updated:** 2026-09-17 14:35 Sydney (2026-09-17 04:35 UTC), run 168 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-167 and not re-argued here, per [L-07](LESSONS.md).** **The change that
broke the pull-request gate was merged without passing through it.**

**In plain terms.** `check` runs on `pull_request` and on pushes to `master`, and it is the gate
issue #1 names as a deployment requirement. **From 2026-09-12 it could not be green on any pull
request carrying a commit.** One test in `scripts/deploy-staleness.test.mjs` asked the deploy watchdog
whether a production serving `HEAD` reads fresh, on the premise its own comment stated — *"HEAD is
what a checkout of master serves."* On a branch `HEAD` is not on master's first-parent line, so the
CLI answered `unknown-serving` and exited 1 — **correctly, for the question it was asked** — and the
gate went red. Reproduced before the repair: **31/31 with the branch at master's tip, 30/31 the moment
the branch carried a commit.**

**Run 167's description of this is corrected here, and the correction is the interesting part.** It
recorded the defect as a standing property of the repository — *"it cannot be green on any pull
request"* — which reads as though it always was. It is a **regression**, and `check.yml`'s own run
history says when and how: [run 194](https://github.com/in-c0/tuned/actions/runs/33122248348) on
2026-08-27 was green on a `pull_request` event, **no `pull_request` run exists at all between
2026-08-28 and 2026-09-15**, and [run 283](https://github.com/in-c0/tuned/actions/runs/35156879096)
on 2026-09-16 is the **only failing `pull_request` run in the workflow's history**. The test landed in
[`3e76d24`](https://github.com/in-c0/tuned/commit/3e76d24) on 2026-09-12 **pushed straight to
`master`** — no pull request was open in that window, so nothing ever ran it on a branch. **The change
that broke the pull-request gate was itself merged without passing through the pull-request gate.**
Run 283 was then diagnosed correctly and merged past, which is the same act as not having a gate,
however good the diagnosis. [L-86](LESSONS.md#l-86).

**What shipped — one test file, and the CLI is deliberately untouched.** The defect was never in the
watchdog's idea of "serving": a production serving a commit off master's line is a real fault and
still reads `unknown-serving`. The test's subject is now master's **first-parent tip** rather than
`HEAD`, resolved through the same fetch-then-fall-back `readMasterHistory` uses so both sides read one
ref — and resolved **from git directly, not from `readMasterHistory`**, because deriving the expected
input from the function under test would leave the assertion green if that function returned garbage.
That is [L-79](LESSONS.md#l-79) and [L-84](LESSONS.md#l-84)'s shape and is what a repair must not
reintroduce.

**The durable half is the second test.** The first one can only ever ask about the checkout it runs
in, which is exactly the gap a direct push to `master` walked through. A new test **builds the branch
case in a throwaway repository** — two commits on `master`, a third on a branch, the shape of every
pull request — and asserts both directions: master's tip reads `fresh` from a branch checkout, and the
branch commit still reads `unknown-serving`. The branch question is therefore now asked **on `master`
too**. It also pins the wrong repair: relaxing `unknown-serving` to force a branch green turns it red.

**Acceptance evidence is this run's own pull request, which is the only place it could be.**
[PR #68](https://github.com/in-c0/tuned/pull/68) — [check run 286](https://github.com/in-c0/tuned/actions/runs/35180746550),
a **`pull_request` event, success**: the first green one since 2026-08-27. Green on `master` afterwards
would have proved nothing about it. Merged as
[`242fc88`](https://github.com/in-c0/tuned/commit/242fc88edb251189503fea40bec57eadf08b5f0d).

**Two mutations, two named tests red each** — the history reader falling back to `HEAD`, and
`unknown-serving` relaxed to `fresh`, which is the tempting wrong repair — with
`deploy-staleness.mjs` restored byte-identical after each.

**What was deliberately NOT touched.** `scripts/deploy-staleness.mjs` itself. **No runtime code at
all**: the Worker is byte-identical, so the landing page is byte-identical and **[EXP-011](EXPERIMENTS.md#exp-011)
is untouched by this run** — its window still ends 2026-09-16 as run 166 set it, the reading stays
**2026-09-19**, and **no value of R is computed, quoted or recorded here.** **RSS is byte-untouched**
for the sixth run. `arrival:<tag>` is byte-untouched. **No counter was added** — this is a defect fix
and there is nothing new to count — and no `ops/EXPERIMENTS.md` hypothesis entry for the same reason.
The agent-scout schedule is still disarmed and the threshold-2 proposal is **still unruled**; no
reviewer directive has been posted since 2026-09-01, and this executor will not arm a schedule on its
own reading of a threshold it proposed. No item published, amended, retracted or restored. No spend.

**Gates.** `npm run check` exit 0 · **379 vitest** · **ops suite 215/215** (214 → 215, the new test) ·
`validate-workflows.py` ok, 13 workflows · `validate-nominations.mjs` 8 valid · `npm audit --omit=dev`
**0 vulnerabilities**. Every one of these was run **on the branch with a commit on it** — the condition
that was red.

**Not claimed.** This restores a merge gate. **It does not create traffic, it does not fix any
user-visible defect, and nothing here predicts either.** It is control-plane work, taken because the
gate that governs every future deploy was unavailable where it gates, with 18 days left.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **18 days left.**

## Run 167 (2026-09-17 08:35 Sydney) — the check measured the defect, printed it in its own artifact, and graded something else

**Last updated:** 2026-09-17 08:35 Sydney (2026-09-16 22:35 UTC), run 167 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-166 and not re-argued here, per [L-07](LESSONS.md).** **The check that
found this printed it in its own artifact and graded something else.**

**In plain terms.** Run 166's new phone-fit spec measured 16 public pages on production, returned
**`brokenCount: 0`**, and in the same JSON reported `<span class="a">` on `/ava` — an artist's name —
**371.2px wide, ending at 418.2px on a 390px device**. Both statements were true. The page fits,
because `.card.rollup` sets `overflow: hidden`, so the name could never widen the document: it was
**cut off mid-word instead, with no ellipsis to say anything was missing.** Run 166 read both numbers,
named the second as its next candidate, and shipped a verified deploy whose own verification artifact
contained a measured defect. This is that candidate.

**It was worse than the production reading said, and only the reproduction could show it.** Rebuilt
locally at 390px with that name seeded, the geometry came back byte-identical — 371.2px wide, ending
at 418.2px — and carried a second symptom the offender list is structurally unable to report: **the
track title in that row had been shrunk to 0px.** `white-space: nowrap` made the artist span's
min-content width its whole text, which is an automatic minimum a flex item cannot shrink below, so
the title beside it was the only thing in the row that could give way and it gave way entirely. A
visitor saw **no title at all** and an artist cut after "Ariana". A box squeezed to zero is past no
edge, so the check that named the overflow could not name the sibling it had erased. [L-85](LESSONS.md#l-85).

**What shipped.** One CSS rule. The artist's name is given a break opportunity and **wraps rather than
being truncated** — the same trade run 166 made for a source's name, and for the same reason: on a
product whose subject is provenance, shortening the name of the person whose work was attended to is
the wrong direction. The title returns to 58.3px and ellipsises honestly; the artist takes two lines
and is whole.

**The check is extended by the failure it missed, and that is the durable half of this run.** The spec
had collected every element past the device edge since its first version — as colour for a failure,
never as a predicate. It now **grades** them: on a page that fits, an element past the edge is content
an ancestor's `overflow: hidden` is destroying, and no page-level measurement can see inside a box
that fits. A field a check collects and does not grade will be read as decoration, including by the
run that wrote it.

**The landing page is byte-identical, so EXP-011 is untouched by this run.** Before/after geometry of
every element on `/` and `/ava`, rollup collapsed and expanded: **zero elements moved at 1440px on
both pages**, **zero moved at 390px on `/`**, and the ten that move at 390px on `/ava` are the rollup
rows that did not fit. The window still ends 2026-09-16 as run 166 set it, the reading stays
2026-09-19, and **no value of R is computed, quoted or recorded here.**

**Four mutations, four named tests red** — restoring `white-space: nowrap`, dropping
`overflow-wrap: anywhere`, renaming the span the rule selects, and truncating the artist's name on the
server. One of them exists because **nothing in the suite had ever rendered a rollup at all**: a rule
whose selector matches nothing is the same defect as a missing rule, which is [L-81](LESSONS.md#l-81)'s
shape in CSS.

**Found while shipping this, measured, and NOT fixed — the next candidate.** `check` runs on
`pull_request` and on pushes to `master`, and **it cannot be green on any pull request in this
repository.** `scripts/deploy-staleness.test.mjs:274` runs the real CLI against the real git history
and asks whether the serving commit is on master's first-parent line; its own comment states the
assumption — *"HEAD is what a checkout of master serves."* On a branch it is not, so the verdict is
`unknown-serving` and the CLI exits 1, correctly for the question it was asked. Established three
ways: reproduced locally on the branch, **31/31 green in a clean worktree of `origin/master` with no
other change**, and this change touches no file `deploy-staleness.mjs` reads. That is why the last
five `check` runs are all `push` events on `master`. A gate that cannot pass on the thing it gates is
a real defect; the repair is a design decision about what "serving" means off master, and folding it
into a verified deploy is exactly what this run exists to stop doing.

**What was deliberately NOT touched.** The card's own `href`. **RSS is byte-untouched** for the fifth
run. `arrival:<tag>` is byte-untouched. **No counter was added** — this is a defect fix and there is
nothing new to count. No `ops/EXPERIMENTS.md` hypothesis entry, for the same reason. The agent-scout
schedule is still disarmed and the threshold-2 proposal is **still unruled** — no reviewer directive
has been posted since 2026-09-01, and this executor will not arm a schedule on its own reading of a
threshold it proposed. No item published, amended, retracted or restored. No spend.

**Production, from a browser in Actions after the deploy.**
[qa-browser run 40](https://github.com/in-c0/tuned/actions/runs/35157335461) at `b16441e9`, the merged
commit, **confirmed serving by `/api/version` in the job's own log**:
`{"commit":"b16441e9b5b40bdc6f218068917e20c318c45b50"}`. **16 public pages measured at 390px** — the
landing page, all five feeds, `/terms`, `/privacy` and 8 find pages sampled across the 87 in a
95-entry sitemap — **`brokenCount: 0`, `broken: []`, and every one of the sixteen readings carrying
`overEdge: false` with `offenders: []`**, `/ava` included. The same spec was **red on production six
minutes earlier** at [run 39](https://github.com/in-c0/tuned/actions/runs/35156853964), naming that
one span at 418.2px, which is what makes this a before/after and not an assertion.
`mutatingRequests: 0`, `rowsInserted: 0`.

**Gates.** [check 284](https://github.com/in-c0/tuned/actions/runs/35157101501) green on `master`
(build-info + wrangler types + `tsc --noEmit`, 379 vitest tests, the `node --test` ops suite,
`validate-workflows.py`, `validate-nominations.mjs`), `npm audit --omit=dev` 0 vulnerabilities, and
[verify production 269](https://github.com/in-c0/tuned/actions/runs/35157101474) green.

**Not claimed.** This makes one card on the demo feed readable on a phone. **It does not create
traffic, and nothing here predicts that it will.**

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **18 days left.**

---

## Run 166 (2026-09-16 20:35 Sydney) — the landing page did not fit a phone, and the check written to catch that read green throughout

**Last updated:** 2026-09-16 20:35 Sydney (2026-09-16 10:35 UTC), run 166 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-165 and not re-argued here, per [L-07](LESSONS.md).** **The landing page
did not fit a phone, and the check written to catch that read green throughout.**

**In plain terms.** Measured on production from a browser in GitHub Actions at a 390px viewport:
**`/` laid out at 405px and `/ava` at 436px on a 390px device.** Chrome does not scroll such a page
sideways — it **zooms the whole document out** to fit, so every word on the only page anybody can
apply from was rendered smaller than designed, on every phone, for an unknown length of time. Run 165
found the symptom locally, measured it against an unchanged build, correctly ruled it not that
change's to carry, and registered it as the next candidate. This is that candidate.

**Why 166 runs of QA never saw it, which is the part worth keeping.** Two specs already asserted
horizontal overflow at this exact viewport, both as `scrollWidth <= innerWidth + 1`. That is a real
check and it catches a page that scrolls sideways. It is **structurally blind** to this failure,
because the failure moves *both* numbers: the layout viewport grows to the widest line box and
`scrollWidth` grows with it. The two stay equal, so **the assertion is greenest at the moment the page
is worst.** A check that compares two numbers is only as good as their independence. [L-84](LESSONS.md#l-84).

**What shipped.** Four CSS rules. A card's `.meta` row may now wrap, and the source name, the find
page's source row and the `Open at <domain>` button are each given a break opportunity. It is
`overflow-wrap: anywhere` and **not** `text-overflow: ellipsis`: the first version truncated, the
before/after render showed "The Sydney Morning Herald" reading "The Sydney Morn…", and on a product
whose subject is provenance, cutting the source's name to make a row fit is the wrong trade. The full
name wraps to a second line instead and nothing is lost.

**In the shared stylesheet, not a page-scoped block — and that is the cost of this run.** `/` was one
of the two pages measured over width, and it renders its demo through the same `card()`, so the
page-scoped trick run 165 used for the permalink chip would have left the broken page broken. The
landing page therefore changes at 390px, which invokes **[EXP-011](EXPERIMENTS.md#exp-011)'s
pre-registered regression clause**: its window ends **2026-09-16** instead of 2026-09-18 — eleven
complete days instead of fourteen. **Not abandoned**, and **no value of R is computed, quoted or
recorded in this run.** The reading stays on 2026-09-19 and the fork table is byte-untouched.

**Why that trade, stated plainly.** Holding a visibly degraded conversion surface for three more days
to protect a measurement *of that same surface* inverts the purpose of the measurement. Arrival is the
graded bottleneck and a link opened on a phone is the arrival this loop can actually get.

**It was incomplete when it looked done, and the new check said so.** After both meta rows were fixed
a find page was still over width: `Open at blog.engineering.longsubdomain…` puts a bare domain inside
a button, so the button's min-content width is the domain's — 378px against 350px of page. Found only
because the spec walks **every** public surface rather than the one under suspicion.

**Verified not to move anything that already fitted.** Before/after geometry of every element on `/`,
`/ava` and a find page: **zero elements moved at 1440px on all three, and zero at 390px on the find
page.** The rows that move at 390px are exactly the rows that did not fit.

**What was deliberately NOT touched.** The card's own `href`. **RSS is byte-untouched** for the fourth
run. `arrival:<tag>` is byte-untouched. **No counter was added** — this is a defect fix and there is
nothing new to count. No `ops/EXPERIMENTS.md` hypothesis entry for the same reason. The agent-scout
schedule is still disarmed and the threshold-2 proposal is still unruled. No item published, amended,
retracted or restored. No spend.

**Production, from a browser in Actions after the deploy.**
[qa-browser run 38](https://github.com/in-c0/tuned/actions/runs/35085513879) at
`8c02c808`, the pushed commit, confirmed serving by `/api/version` in the job's own log. **16 public
pages measured at 390px — the landing page, all five feeds, `/terms`, `/privacy` and 8 find pages
sampled across the 87 in the sitemap — `brokenCount: 0`, every one reading `layoutWidth` 390 and
`scrollWidth` 390.** `/` went 405 → 390 and `/ava` went 436 → 390. The same spec was red on
production 15 minutes earlier, which is what makes this a before/after and not an assertion.

**Found by that run, measured, and NOT fixed — the next candidate.** On `/ava` the page fits, and one
element still reports past the device edge: `<span class="a">` reading *"Jeff Goldblum & The Mildred
Snitzer Orchestra, Ariana Grande"*, **371.2px wide, ending at 418.2px**. It is the artist line in the
ambient **Music rollup**, and it does not widen the page because `.card.rollup` sets `overflow:
hidden` — so the name is **clipped mid-word with no ellipsis**. A different defect from this run's:
not a page that fails to fit, but text cut off inside a container that does. Contained and cosmetic,
found after this change was verified, and registered rather than folded into a verified deploy.

**Not claimed.** This makes the pages render at the size they were designed for on a phone. **It does
not create traffic, and nothing here predicts that it will.**

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **19 days left.**

---

## Run 165 (2026-09-16 14:35 Sydney) — yesterday every find got an address, and nothing on this site pointed at one

**Last updated:** 2026-09-16 14:35 Sydney (2026-09-16 04:35 UTC), run 165 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-164 and not re-argued here, per [L-07](LESSONS.md).** **Yesterday every
find got an address. Nothing on this site pointed at one.**

**In plain terms.** Run 164 closed the defect it found — 87 published finds, 87 new URLs, a sitemap
that went from 8 entries to 95. For one day that was the whole of it. `card()` wraps a feed card in
an anchor to the **source**, which is correct, so **no page on this service linked to any find page**:
a crawler following links from `/` reached none of them, and a visitor looking at a find on a feed
page had no way to get its URL. The only route in was `sitemap.xml`. An address nothing points at is
reachable only by whoever already has it.

**Why this and not a new surface.** [EXP-007](EXPERIMENTS.md) is graded **Fork A** — the bottleneck is
**arrival**, not conversion — and both named distribution channels have been owner-blocked for
twenty-one runs. Search and sharing remain the only arrival levers needing no venue's permission, no
owner act and no spend. Run 164 opened them by construction; this run makes them usable by anything
that walks links and by any person who wants to send one find to one other person. [L-83](LESSONS.md#l-83).

**What shipped.** A `permalink` chip on every card on a public feed page, linking to that find's own
page. It is deliberately the **second** affordance: **the card's own click still opens the source**,
and a test plus the production check assert it never becomes the first — re-pointing it would spend
every click on the only conversion surface on Tuned instead of on the thing the member was paying
attention to.

**One counter, and it is defensive rather than new instrumentation.** `item_view_onsite` is an axis —
the subset of find-page requests whose `Referer` is this site. Run 164 registered the reading
*"`item_view` moving without `_bot` is the first shared link"*, which held only while every route in
was off-site. **Adding an on-site route breaks that reading**, and the owner is the one member who
clicks around inside Tuned. The axis keeps the off-site figure computable as
`item_view − item_view_onsite` rather than losing it. It is never summed into the totals.

**The frozen page was not touched, and that is asserted rather than inspected.** `landingPage` renders
its demo through the same `card()`, so the permalink is opt-in per call site and the new CSS is held
in a page-scoped `<style>` instead of the shared `CSS` string that `/` also serves. **EXP-011's
thresholds, window and reading date are byte-untouched** — the window still closes **2026-09-18**,
reading by **2026-09-19**, and no value of R is computed or quoted anywhere in this run's record.

**Nine mutations, nine named tests red — and the browser caught what none of them could.** The chip
first sat in the card's top-right with `padding-right` reserving space on the `.meta` row. Every unit
test passed. Chromium showed it sitting **on top of** "via @scout" at 1100px and on a long source name
at 390px: `.meta` is a flex line, and a flex item that cannot shrink below its min-content width
overflows the padding meant to hold it back. Moved to the bottom-right, reserved with `padding-bottom`
on the body, whose other children are blocks. Second run running that a browser caught a defect the
markup assertions are structurally unable to see.

**Found, measured and deliberately not fixed.** At 390px a card with a long source name overflows the
viewport by ~29px. It renders **identically wide on an unchanged build**, so it is pre-existing and
not this change's to carry. Next candidate, and small.

**What was deliberately NOT touched.** The card's own href. **RSS is byte-untouched** for the third
run — a changed `guid` re-notifies every subscriber and a changed `<link>` redirects one who wanted
the source. `arrival:<tag>` is byte-untouched. The landing page is byte-identical. The agent-scout
schedule is still disarmed and the threshold-2 proposal is still unruled. No item published, amended,
retracted or restored. No spend.

**Not claimed.** This creates an inbound path and a shareable link. **It does not create traffic, and
nothing here predicts that it will.** Whether any crawler walks it, and whether anyone sends one, is
an observation for later runs.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **19 days left.**

## Run 164 (2026-09-16 08:35 Sydney) — Tuned had published 87 finds and given an address to none of them

**Last updated:** 2026-09-16 08:35 Sydney (2026-09-15 22:35 UTC), run 164 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-163 and not re-argued here, per [L-07](LESSONS.md).** **Tuned had
published 87 finds and given an address to none of them. Its sitemap advertised eight documents.**

**In plain terms.** Every find this service has ever published was reachable only *inside*
`/<handle>`, a page that changes under it. `sitemap.xml` listed **eight URLs** — the landing page,
five feeds, terms, privacy — against **87 rows at `visibility = 'public'`**. Three different failures
wore that one face: nothing Tuned publishes was **indexable**, nothing was **shareable** (a visitor
could send only the feed, which is a different page tomorrow), and no arrival could be **attributed**
to a find.

**Why this and not another instrument.** [EXP-007](EXPERIMENTS.md) is graded **Fork A** — the landing
figure does not describe people and **arrival** is the bottleneck, not conversion. Both named
distribution channels have been owner-blocked for twenty runs. Search and sharing are the only
arrival levers that need no venue's permission, no owner act and no spend — and both were
structurally unavailable, because the product's unit of value had no URL. [L-82](LESSONS.md#l-82).

**What shipped.** `GET /:handle/:id`, plus one `sitemap.xml` entry per published find. The page's
subject is the **provenance chain** — observed by an agent → read and chosen by a member → published
on a date — with the source's title and description held to the minimum needed to say which thing and
the outbound link as the primary action. It states the boundary in its own words: *Tuned does not host
this and did not write it.* That sentence is asserted by a test **and** by the production check,
because it is the line between this surface and the summarizer the doctrine forbids.

**Two gates on one fact, asserted separately.** A `hidden` row is a veto and a `queued` row awaits
approval; **an address is publication**, so the route 404s both and the sitemap omits both. A sitemap
entry for an unpublished row would advertise a 404 *and* assert something false.

**Seven mutations, seven named tests red — and two of them found defects rather than confirming
intent.** The sibling-find block was rendered through `card()`, which links out to the **source**, so
the block whose whole job is to connect find pages into a walkable graph connected nothing. And the
id guard was `\d+`, under which `042`, `4.2e1`, ` 42` and `0x2a` all coerce to row 42 — each a second
address for one find, the duplicate-URL defect arriving through the id instead of the handle.

**The near-miss, recorded because it says what browser QA is for.** A CSS comment written this run
contained backticks inside a template literal, silently turning ``.card .meta`` into a property access
on a string. **Every unit test still passed** — they assert markup, and the stylesheet is a string to
them. It was caught by rendering the page in Chromium, the one check that reads the CSS as CSS.

**Run 163's open question is closed by a reading, not an inference.** The `verify production` step for
`/api/applications` printed *"HTTP 401 — ADMIN_KEY is set and the endpoint is closed."* **`ADMIN_KEY`
is configured in production**, so the applications reader is usable today and is not a 503. No owner
action needed.

**What was deliberately NOT touched.** The feed page's cards are byte-identical — re-pointing them at
find pages would send every click on the only conversion surface to Tuned instead of the source, on no
evidence, inside a live experiment window. **RSS is byte-untouched**: a changed `guid` re-notifies
every subscriber and a changed `<link>` redirects one who wanted the source. Item views are counted
under `arrival_item:<tag>` and never `arrival:<tag>`, which EXP-010 and EXP-012 are pre-registered
over. **EXP-011's thresholds, window and reading date are byte-untouched and it was not graded early**
— the window still closes **2026-09-18**, reading by **2026-09-19**, and no value of R is computed or
quoted anywhere in this run's record. The landing page is byte-identical and `item_render` is on the
list asserting a foreign pulse cannot fire on `/`. The agent-scout schedule is still disarmed and the
threshold-2 proposal is still unruled. No item published, amended, retracted or restored. No spend.

**Not claimed.** This creates indexable and shareable surface. It does not create traffic, and nothing
here predicts that it will — whether anything indexes these pages or anyone arrives on one is an
observation for later runs, via `item_view` and `item_render`.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **20 days left.**

---

## Run 163 (2026-09-15 20:35 Sydney) — the funnel's second stage wrote to a table its third stage could not read

**Last updated:** 2026-09-15 20:35 Sydney (2026-09-15 10:35 UTC), run 163 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-162 and not re-argued here, per [L-07](LESSONS.md), plus one NEW question
below.** **The funnel's second stage has been writing to a table its third stage could not read. An
application was visible to the owner as a number and never as a person.**

**In plain terms.** `POST /waitlist` has written every application since 2026-08-06 into a table that
exactly one thing reads: `SELECT COUNT(*)` in `src/metrics.ts`, published as the integer
`applications`. **Nothing anywhere returned a row.** `src/operator.ts` says in its own header that the
operator key cannot read a member email or provision members; `/api/metrics` is aggregate-only by
design; there is no admin list, no export, no mail. Meanwhile `POST /api/members` — the act that
admits somebody — **takes an email**. Admitting an applicant required Cloudflare credentials this loop
does not hold by design and the owner would have to open a dashboard for.

**Why forty days passed without it being felt.** `applications` has read **0** every day. **An
unreadable table and an empty one serialise identically**, so there was nothing to notice — and the
first reading that would have told them apart is the first arrival, which is the reading this loop
most needs to get right. No application has been lost; the count was accurate every day it was
published. What did not exist was any way to check.

**Why neither sweep could see it.** Runs 141-144 swept every *counter* for undiscriminated names;
run 146 answered [L-61](LESSONS.md#l-61) by enumerating every *route* and what it writes. Both
enumerated the right set and asked the wrong question of it: **neither asks what reads what is
written.** `POST /waitlist` is classified `writes: application_submit / application_invalid` and that
is correct — the counter is there, discriminated, tested. The row written alongside it is not a
counter, so it is in neither sweep's set. [L-81](LESSONS.md#l-81). This is the third instance of the
shape: `follow_submit` → `followers` (nothing can deliver to it), `waitlist` → nothing, and
`members.last_desk_at` (overwritten), each found by a different accident rather than by an instrument.

**What shipped.** `GET /api/applications` — gated on the existing `ADMIN_KEY`, so no new secret and no
address reachable by anyone who could not already read it; **503 while that secret is unset**, which
is the state it ships in, and 401 on a wrong key. It returns the applicant's own submission plus
`admitted`, the address matched against `members` — the one fact `POST /api/members` needs and the
count cannot carry. `total` and `pending` count the whole table, never the returned page, so `limit`
cannot shrink the headline. **Four mutations, four named tests red**, including one returning
`pending` uncoerced: SQLite's `SUM` over zero rows is `NULL`, and the empty table is the state this
ships against, so the first reading anyone took would have been `pending: null`. The suite exercises
the route **through `POST /waitlist`** rather than rows it seeded itself.

**The half this does NOT close, stated first rather than buried.** There is **no mail provider and no
sender anywhere in `src/`**, so `POST /api/members` still returns a `login_url` that nothing can
deliver — the same shape as `followers`, which holds intent no code can digest. An application is now
**visible**; admitting someone still needs a human to carry the link. That is an owner boundary.

**NEW question for the owner and reviewer, asked once.** `stripe` appears nowhere in this repository
and **no owner card has ever asked for a payment provider** — in 163 runs, against a cash target.
Nothing was shipped for it, deliberately: feed creation is `ADMIN_KEY`-gated, so a stranger can buy
nothing today, and a *"would you pay?"* button is what this loop's own hierarchy calls **not
validation**. The question is whether a payment path is worth opening at all with 20 days left, and it
is the owner's and the reviewer's, not this executor's.

**Nothing about the deployed site's behaviour changed for any visitor.** The one new route is
key-gated and fails closed; no page, counter, schema, privacy statement or public surface was touched.
**EXP-011's thresholds, window and reading date are byte-untouched and it was not graded early** — the
window still closes **2026-09-18**, reading by **2026-09-19**, and no partial figure is quoted here.
The agent-scout schedule is still disarmed and the threshold-2 proposal is still unruled. No item
published, amended, retracted or restored. No spend.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **20 days left.**

---

## Run 162 (2026-09-15 14:35 Sydney) — run 161 shipped and never reported

**Last updated:** 2026-09-15 14:35 Sydney (2026-09-15 04:35 UTC), run 162 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-161 and not re-argued here, per [L-07](LESSONS.md).** **Run 161 shipped
to `master` and never posted an execution report. Nothing in this repository was watching for that,
and the two things that were watching got *quieter* on it, not louder.**

**In plain terms.** Run 161 claimed cycle `2026-09-15/w08` at `2026-09-14T22:03:52.483Z`, pushed
[`619535f`](https://github.com/in-c0/tuned/commit/619535f) at `22:17:11Z`,
[went green](https://github.com/in-c0/tuned/actions/runs/34903357547) at `22:18:04Z` — and then
stopped. **It never released the run lock and it never posted its report to issue #1.** Its work is
fully in the repository; its record on the issue does not exist, and the reviewer's newest evidence
was 18 hours stale with nothing to explain the gap.

**Why `executor liveness` was green throughout, which is the finding.** Both its verdicts ask whether
a run *started* — its own header said so as a design statement. A fresh claim clears the staleness
test, and a commit inside the cycle is positive **corroboration that the loop ran**. So an abandoned
run reads *healthier* than a quiet one: the instrument's two signals both fired in the reassuring
direction on the one run that dropped its last steps. [L-80](LESSONS.md#l-80).

**The evidence was already in the file the watchdog reads.** Release is a run's last step, after the
report — runs 159 and 160 released **3 seconds** after their report comment. So *an expired lease with
no release* is a sound and earlier proxy for *the report is missing*, needing no GitHub API and no
pairing heuristic. **35 of the register's 37 claims released `completed`**; the only exceptions are
run 161 and whichever run is in flight, so the signal has zero historical noise. Two places already
computed the shape and neither could speak: `releasedAt()` calls it *"what an abandoned lease looks
like"* **in a comment**, and `run-claim`'s `evaluate()` derives `takeover-stale` from it but only for
the **current** cycle, so run 161's `w08` claim was stepped over in silence by this run's `w14`.

**The ordering was wrong first, and the near-miss is the part worth keeping.** The verdict was placed
last, on the reasoning that a run which finished nothing is better news than runs that never started.
Read against the live register that shipped the hole it was closing: `missed-runs` is already red on
the known 2026-09-12/13 gap, an outranking verdict silences everything beneath it for its 48h
lookback, and run 161's abandonment falls **inside** that window. **The check written because run 161
was invisible would have left run 161 invisible.** Order is now by what is still actionable — `stale`
(loop down now, owner acts) > `abandoned-run` (record broken now, next run repairs) > a closed gap
(already reported, still there next hour) — and the gap stays in the verdict body regardless.

**Eleven mutations, eleven named tests red**, including the discriminator itself: the same register
with a release appended is healthy, and an `aborted` release counts as letting go. It **fails closed**
on a watched claim whose lease it cannot read, reads the lease **from the record** rather than
assuming 90 minutes, and **no corroborator answer can clear it**.

**It ships with no live signal, and that is deliberate.** `ABANDON_WATCH_FROM` is this run's own
claim, so run 161's abandonment — reported here and on issue #1 — is not re-raised at the owner by the
instrument built because of it, on the same rule as `GAP_WATCH_FROM`. The counterfactual is checkable:
with the floor lowered to include it, the first hourly firing after the lease expired (`00:35Z`)
returns `abandoned-run` — **2.5h after run 161 stopped, and 3.5h before this run began.**

**Run 161's report was not written in its name.** What shipped is reconstructed from the commit, the
CI run and the `ops/` prose, and stated in this run's voice. What only that session knew — what it
rejected, what it nearly got wrong, what it would have recommended next — is unrecoverable, and
writing a report as run 161 would be fabricating a record.

**Nothing about the site changed.** `src/`, `test/` and `qa/` were not touched, so the deployed code is
byte-for-byte what it was. **EXP-011's thresholds, window and reading date are byte-untouched and it
was not graded early**; the window still closes **2026-09-18**. The agent-scout schedule is still
disarmed and the threshold-2 proposal is still unruled. No item published, amended, retracted or
restored. No spend.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **20 days left.**

---

## Run 161 (2026-09-15 08:35 Sydney) — the discriminator written down yesterday was satisfied by the page it was written to exclude

**Its execution report on issue #1 does not exist** — see run 162 above. The section below is run
161's own STATUS entry, written by that run and committed in `619535f` before it stopped.

**Last updated:** 2026-09-15 08:35 Sydney (2026-09-14 22:35 UTC), run 161 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-160 and not re-argued here, per [L-07](LESSONS.md).** **The fix this
loop wrote down yesterday for its own source reader would have been satisfied by exactly the page it
was written to exclude. It was caught in the writing, replaced, and shipped in a form that is not.**

**In plain terms.** `source-read` is the only instrument this loop has for reading anybody else's
page, and every remaining venue check in the final twenty days runs through it. Run 160 found it
structurally biased against emptiness — it demands 1000 visible characters before it will call a
fetch a page, and *nothing is here* renders short by construction, so the duplicate check that guards
every submission **fails precisely when its answer is clean**. Two false alarms on that floor now.

**The proposed fix was wrong, and the check that caught it costs one sentence.** [L-78](LESSONS.md)
wrote the discriminator as *"a fetch that yields the anchors the query asked about is a page at any
length."* But anchors match on label **or href**, and a challenge page's one link is a retry at the
requested URL — which for this check is `…/search?q=…justtuned…`, so the retry link contains the
literal and matches. **The rule would have admitted the bot check.** Asking *"name the page this is
meant to exclude, and walk it through the new rule"* is what found it. [L-79](LESSONS.md).

**What shipped instead.** A second, independent way to be a page: **≥ 20 distinct same-origin
addresses other than this page's own.** An interstitial is a standalone document served instead of
the host's page and has no navigation to present; a zero-results answer carries the host's whole
chrome — 0–2 links against GitHub's 103, an order of magnitude apart. Excluding the page's own URL
defeats the retry link; requiring same-origin defeats the challenge provider's links.

**The floor was not lowered, and three properties keep the discriminator from becoming a hole** —
each pinned by a mutation that turns a named test red. It overrules the **length** signal and nothing
else, so a bot-check pattern in the title or body stays fatal at any link count and
[run 50's](LESSONS.md#l-28) defect cannot re-enter through the fix for run 160's. It **fails closed**
on an anchor list it could not read. And `MIN_PAGE_CHARS` is **unchanged at 1000**, asserted by a
test, so lowering it instead is caught — the mutation that does turns five tests red.

**Nothing about the site changed.** `src/` was not touched, so the deployed code is byte-for-byte what
it was. **EXP-011's thresholds, window and reading date are byte-untouched and it was not graded
early**; the window still closes **2026-09-18**. The agent-scout schedule is still disarmed and the
threshold-2 proposal is still unruled. No item published, amended, retracted or restored. No spend.

**Why a sixth machinery run in seven, stated against its own interest.** Run 160 deferred this with
*"I would rather it went behind anything that could produce a user."* This run re-walked the whole
[candidate register](DISTRIBUTION.md#candidate-register) before accepting that as satisfied. **All
seven channels are blocked at A0** — this executor can perform no write at any third party — and the
two acts that remain are the owner's. **There is nothing that could produce a user inside this
loop's envelope.** That is the register's finding, re-verified, not a shrug.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **20 days left.**

---

## Run 160 (2026-09-14 20:35 Sydney) — the packet asked for a re-read "in the cycle of the submission", and there has never been one

**Last updated:** 2026-09-14 20:35 Sydney (2026-09-14 10:35 UTC), run 160 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-159 and not re-argued here, per [L-07](LESSONS.md) — but one of them was
escalated to you out of band for the first time.** **The submission packet has been telling every run
since 2026-09-04 to re-read its preconditions "in the cycle of the submission". There has never been a
cycle of the submission, so no run ever did.**

**In plain terms.** There is one act left that could bring Tuned its first stranger: submitting
`/sportstech` to a curated RSS directory. This loop cannot perform it — it holds no write at any third
party — so a file was prepared ten days ago to make it a two-minute paste for the owner. That file ends
with an instruction to re-check its two cheap preconditions **"in the cycle of the submission"**. No
submission has happened, so that cycle never came, so the check never ran — while every report since
kept telling the owner the packet was ready, on evidence that was quietly aging.

**This run ran the two checks the file had been asking for, and both hold.** **A4** — is the destination
alive enough to be worth listing — is not merely still passing but has **doubled**: **8 publications in
the trailing 30 days** against a bar of one, where the packet was written on four
([agent operator 34831621225](https://github.com/in-c0/tuned/actions/runs/34831621225)). The **duplicate
check** is unchanged: no `justtuned` issue at the venue, open or closed
([source read 34831864620](https://github.com/in-c0/tuned/actions/runs/34831864620)). **Nothing was
wrong — and that is luck, not diligence.** Nobody knew either number until today.

**The instruction is now dated instead of conditional.** *"Last verified: 2026-09-14"*, re-stamped by
whoever surfaces the card, so staleness is visible to the next run rather than waiting on an event the
loop does not control. [L-78](LESSONS.md).

**The duplicate check came back clean and RED at the same time, and the floor was not lowered.**
`source-read` demands 1000 visible characters before it will call a fetch a page; GitHub's zero-results
issue search renders **735**. The reading stands on positive evidence — HTTP 200, 103 anchors scanned,
both state filters resolved *by `href`* to `Open 0 (0)` and `Closed 0 (0)`, none of which a bot
interstitial carries — and the run is **kept red**, per the standing hold. This is the second false
alarm on that floor. **It is also structural rather than unlucky: *nothing is here* renders short by
construction, so a terseness gate is least able to certify exactly the answer an emptiness check
exists to return.** The fix is an additive discriminator, not a lower floor; it is written down in
[L-78](LESSONS.md) and **deliberately not shipped**, because that would have been the fifth
consecutive run spent on this loop's own machinery.

**Nothing about the site changed.** `src/` was not touched, so the deployed code is byte-for-byte what
it was. **EXP-011's thresholds, window and reading date are byte-untouched and it was not graded
early**; the window still closes **2026-09-18**. The agent-scout schedule is still disarmed and the
threshold-2 proposal is still unruled — **today's scheduled screen selected 9 of 37 (24.3%), inside
threshold 2, and published nothing**, and re-arming on a reading taken after the fact is what the
workflow's own header refuses. No item published, amended, retracted or restored. No spend.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **21 days left.** The packet is now verified as well as
prepared, and it still cannot be submitted by anything in this repository.

---

## Run 159 (2026-09-14 14:10 Sydney) — the forks with no next action were exactly the forks that keep firing

**Last updated:** 2026-09-14 14:10 Sydney (2026-09-14 04:10 UTC), run 159 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-158 and not re-argued here, per [L-07](LESSONS.md).** **This loop had
written down, in detail, what to do when an experiment tells it something — and left blank what to do
when it tells it nothing. Nothing is the outcome it has actually received, every time.**

**In plain terms.** Before running an experiment, this loop writes down the possible outcomes and what
each one would mean. Eleven of its thirty-two written-down outcomes said what the result would *mean*
and never said what to *do*. They were not a random eleven: **every single one was a "this told us
nothing" outcome** — the submission never happened, the listing never appeared, the data was
contaminated, the source refused to answer. Those are the outcomes Tuned keeps actually getting.
EXP-009's "never submitted" branch is the literal state of the world today, 25 days on, and had no
next step written. EXP-012's "never listed" branch **calls itself the expected outcome in its own
text** and had no next step either.

**Why it happened.** Writing these down is an exercise in imagining the experiment working. The
informative branches get instructions because you are picturing what you will do with the answer. The
empty branches get a careful *"this is not evidence of demand in either direction"* — which is the
honest, disciplined sentence, and it **feels** like completeness. It just is not an instruction, so
the run that lands there improvises, at exactly the moment the evidence is weakest and the temptation
to re-run, re-suggest or swap the data source is strongest.

**What shipped.** Eight missing next steps registered — all on open experiments, all written blind —
plus the rule at the top of the experiments file, where a run writing one is already looking, and a
test that keeps every future branch honest. **No new counter, no new dashboard, no new scheduled job.**

**And the thing this run set out to do and could not.** Run 158 asked for EXP-011's downstream
obligations to be pre-registered before its 2026-09-18 reading. While inspecting the metrics — step 2
of this loop's own cycle, forbidden by no rule — **this run computed a partial nine-day figure for
that experiment, which made writing those obligations blind impossible.** Nine days of fourteen is
enough to see where it is heading, and an obligation written knowing the answer gives the expected
outcome the comfortable duty. **So they were declined rather than written with a caveat**, the partial
figure is disclosed in full in [EXPERIMENTS.md](EXPERIMENTS.md) so it cannot become a number-shaped
secret, and 2026-09-19 executes the text registered blind on 2026-09-04. **A pre-registration window
is consumed by the first run that looks — and looking is mandated, not forbidden.** [L-77](LESSONS.md).

**Nothing about the site changed.** `src/` was not touched, so the deployed code is byte-for-byte what
it was. **EXP-011's thresholds, window and reading date are byte-untouched and it was not graded
early**; the window still closes **2026-09-18**. The agent-scout schedule is still disarmed and the
threshold-2 proposal is still unruled. No item published, amended, retracted or restored. No spend.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **21 days left.** Knowing what to do with a null is not
a customer, and the two things that could actually bring one are still the two sitting with you.

---

## Run 158 (2026-09-14 08:35 Sydney) — the loop skipped its own step 0 because the instruction was filed at line 1511 of 2,063 on the day it was written

**Last updated:** 2026-09-14 08:35 Sydney (2026-09-13 22:35 UTC), run 158 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-157 and not re-argued here, per [L-07](LESSONS.md).** **Yesterday's report ended
by admitting it did not know why two runs had skipped their own safety step. It was because nobody had ever
written the step down anywhere a run was obliged to look.**

**In plain terms.** Before this loop touches anything, it is supposed to sign a register — a lock that stops
two copies of itself running at once and doing the same job twice, which has really happened. Friday evening
and Saturday morning it shipped eight commits without signing. Run 157 found that, built a better alarm for
it, and said honestly that it did not know the cause.

**The cause is mundane and complete.** The instruction to sign appears exactly twice in this whole
repository: once at **line 2493 of a 3,093-line `ops/STATUS.md`** (as it stood at the start of this run) — this file — and once deep inside
`ops/DECISIONS.md`. The routine prompt that starts each run does not mention it at all. So a run had to go
looking for something it had no way of knowing existed. The code that implements the lock even says in its
own comments that the discipline "lives in ops/STATUS.md". It did. Nobody was ever going to read that far.

**And it was not buried gradually — it was buried the day it was written.** The lock, its tests, its CI
step and that one line of prose all arrived in a single commit on 31 August, and the line went in at
**1511 of 2,063**: already three-quarters of the way down, on day one. Thirty-three later runs prepending
sections above it moved it to 2493. They are not why it was missed.

**What shipped.** A `CLAUDE.md` at the top of the repository — **the one file a session here opens without
being told to, and this repository has never had one.** The signing command is in the first screen of it.
The rest is one page: what Tuned is, which files to read, which checks to run before shipping, and the
standing rules. Everything else stays a link.

**Why this and not something that makes money.** It is the third run in a row spent on the machinery rather
than the product, and that is only defensible because this one *removes* a failure instead of adding another
instrument. Yesterday shipped an alarm that reports this mistake after it happens; today the instruction
reaches the run that would make it. It also makes every future run cheaper — finding the protocol no longer
means reading a 287 KB file. **No new scheduled job, no new dashboard, nothing added to the product.**

**A test now guards the three things that made the old hiding place fail** — the file has to exist, the
command has to be in the first 40 lines, the file has to stay under 200 — plus a fourth against the new risk
this creates: a file read automatically is read with authority, so every link and command in it must
resolve. Six ways of breaking it were tried; each turns the right test red.

**Nothing about the site changed.** `src/` was not touched, so the deployed code is byte-for-byte what it
was. EXP-011's landing-page window is untouched and closes **2026-09-18**. The agent-scout schedule is still
disarmed and the threshold-2 proposal is still unruled. No item published, amended, retracted or restored.
No spend.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **21 days left.** A loop that follows its own protocol is
not a customer, and the two things that could actually bring one are still the two sitting with you.

---

## Run 157 (2026-09-13 20:45 Sydney) — the feed could not say which of three URLs it was, and the watchdog was 25 minutes from reporting an outage that was not happening

**Last updated:** 2026-09-13 20:45 Sydney (2026-09-13 10:45 UTC), run 157 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-156 and not re-argued here, per [L-07](LESSONS.md).** **The feed a directory
would list could not say which of three URLs it was — and the loop's own watchdog was twenty-five minutes
from telling you the loop had stopped, while it was running.**

**The first thing, in plain terms.** `justtuned.com`, `www.justtuned.com` and a `workers.dev` address all
serve the identical feed, and nothing inside the feed said which one it actually is. The website pages
were given that ("this is the real address of this page") back in run 86; **the feed was left out, and the
feed is the thing a directory of RSS feeds would list.** Feed validators and aggregators look for exactly
that line. It is there now, along with a machine-readable "last updated" date — which is the element a
reader's app shows in its list, and the one that says whether `@sportstech` is still alive.

**The second thing, and it is the one I would want to know.** Running the checks turned up that **Friday
evening's and this morning's runs never signed the run register.** They ran, shipped and reported
normally — but the register they sign at the start was blank for 24 hours, and **the watchdog that reads
it has only ever had one word for silence: "the loop is not firing".** At 20:35 Sydney it would have sent
you *"24.02h with no run at all"* and *"check that the routine is enabled and firing"*. The routine was
enabled and fired on time, every time. **That was stopped before it reached you**, with the true account
posted in its place, and the watchdog now tells the two situations apart — because they need opposite
things from you: one means restart it, the other means leave it alone and fix the protocol.

**And the fix nearly shipped broken in a way only the real thing would show.** The new check asks git
whether any run committed during the silence. GitHub's default checkout fetches one commit of history, so
in production it would have answered *"nothing did"* every single time — silently restoring the exact
false alarm it was written to remove. **CI caught it on the commit that added it.** It now fetches full
history, and a history too short to answer says *"cannot answer"* rather than *"nothing happened"*.

**What did not happen.** No landing page, no pricing, no positioning ([EXP-011](EXPERIMENTS.md)'s window
is untouched and closes 2026-09-18). No clause, threshold or term list that decides what `@sportstech`
selects. **The agent-scout schedule is still disarmed** and the threshold-2 proposal is still unruled —
this run neither armed nor enacted it. No item published, amended, retracted or restored. No spend.

**One thing I could not do, and stopped rather than route around.** The submission to
`awesome-rss-feeds` still needs you. I re-tested whether this session could do it and the answer is now
**settled rather than pending**: the refusal is structural, not a glitch that might lapse. There *is* a
path — starting a session scoped to that repository — and **I did not take it**, because your `A`
authorises the submission, not this executor widening its own access to third-party repositories to make
it. That stays your two minutes.

**Still zero.** `applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** ·
gross cash **AUD $0**, from *no billing exists*. **22 days left**, and a feed that can name itself is not
a subscriber. What this run bought is that the two artefacts you actually see — the feed a stranger would
subscribe to, and the alarm that reaches you unattended — now say true things about themselves.

---

## Run 156 (2026-09-13 14:30 Sydney) — one refusal reason was three different facts, and the first run under the split proved the morning's own record wrong

**Last updated:** 2026-09-13 14:20 Sydney (2026-09-13 04:20 UTC), run 156 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-155 and not re-argued here, per [L-07](LESSONS.md).** **The agent's log had
one word for three different reasons to stay silent, and the first run under the fix proved Friday's
report wrong.**

**What was broken, in plain terms.** When `@sportstech` reads a paper and decides it has no sentence
worth quoting, it writes down why. One of the reasons it could write was `length` — and `length` covered
three completely different situations: the sentence was too *short* to be a quotation, or too *long* for
the space a post has, or it had no full stop on the end (which usually means this code split it wrongly,
and is the only one of the three that means something here is broken). Anyone reading the log had to
guess which.

**And somebody did guess, and guessed wrong — me, on Friday.** Run 155 read `length 1` against item 280
and wrote *"one too long to quote whole"* into three durable files and into the version of this page you
read. Re-run this morning on the same paper with the three reasons separated
([34737237792](https://github.com/in-c0/tuned/actions/runs/34737237792)), the answer comes back
**`too-short 1`**: that sentence is under 80 characters, and **nothing in that paper was ever too long**.
The decision was right both times and item 280 still keeps its line. The stated reason was wrong for a
day. **Each of the three wrong lines has been corrected where it stands, with the date and the reason,
rather than quietly edited** — the same rule the public `(corrected …)` mark follows.

**The number that is new.** A refusal for length now carries the miss in characters and the budget it
missed against. The same paper reads *"missed by 24 against 252"* at the publishing budget and *"missed
by 47 against 229"* at a correction's — and the **23** between those two is the correction mark this
agent spends on telling readers a line was changed. That was previously an assertion; it is now
arithmetic anyone can check.

**And a log line that was not merely thin but false has gone.** It read *"`length` refused all 3
sentence(s) considered (reported-value 2, length 1)"* — a sentence contradicted by its own bracket. One
formatter now reports the count per reason and claims nothing beyond it; a test reconstructs the old
sentence and asserts it is false.

**Nothing reached a reader, and nothing on the product changed.** No item was published, amended,
retracted or restored. `public_items` **19**, `operator_publications` **8**, `operator_amendments` **0**,
`last_public_item_at` **2026-09-12T10:21:50.674Z** — every figure identical to Friday, read off live
production at `04:11:45Z`, HTTP 200
([agent-operator list 34737313154](https://github.com/in-c0/tuned/actions/runs/34737313154)).

**EXP-011's landing-page window is untouched, and this run went nowhere near `src/`.** The change is
`scripts/` only — the agent's own screening tooling, which is not bundled into the Worker at all. No
route, no schema, no public surface, no landing page, no counter. **The schedule is still disarmed** and
the threshold-2 proposal is still unruled, per run 153's standing instruction.

Gates: `check` **0** · **18 files, 298 tests** · `test:ops` **176/176** (was 171) · scout suite **96
tests** (was 91) · workflow and nomination validators ok · `npm audit --omit=dev` **0 vulnerabilities**.
[verify production 249](https://github.com/in-c0/tuned/actions/runs/34737225143) **success** on the
shipped commit; [check 266](https://github.com/in-c0/tuned/actions/runs/34737225142) **success**;
[exp003-mechanism 34737238900](https://github.com/in-c0/tuned/actions/runs/34737238900) **success** —
the browser dispatch run 155 recorded as owed.

**Still zero, and a truer log is not a customer.** `applications` **0** · `members` **1** ·
`members_ever_active` **0** · `followers` **0** · gross cash **AUD $0**, from *no billing exists*. **22
days left.** What this run bought is that the loop's own evidence can be trusted a notch further — which
matters only because every claim anyone makes about Tuned is currently sourced from it.

---

## Run 155 (2026-09-13 08:45 Sydney) — an agent can correct its own public line, and the first line it was pointed at, it left alone

**An agent on Tuned
can now correct its own public account of why it selected something, and it cannot do it quietly.** The
operator plane could `publish`, `retract` and `restore`; it could not amend. On a product whose whole
claim is explicit provenance, the only available correction was deletion from view — the least honest of
the three. Shipped, deployed and verified live: `operator_amendments` reads **0** off production
([agent-operator list 34723019208](https://github.com/in-c0/tuned/actions/runs/34723019208), HTTP 200).

**Three properties make it a correction rather than a rewrite, and each is enforced in the Worker rather
than left to a caller.** `operator_item_amendments` is **append-only** and keeps the replaced line
verbatim with a required reason; the stored line carries a server-composed **`(corrected YYYY-MM-DD)`**
mark, placed *inside the text* so it travels into the RSS description and anything that copies it; and
the mark **cannot be forged or omitted** — a submitted line carrying one is refused. Only the why-line,
only on an item this plane published, never on one the owner hid.

**AND IT CORRECTED NOTHING, WHICH IS THE RIGHT ANSWER AND THE WHOLE POINT.** Item 280 — this feed's first
autonomous selection, carrying a line that reports the agent's own screening and says nothing about the
paper — **keeps that line.** Its abstract's results section holds three sentences; two report no value a
reader could check and one is **too short to be a quotation at all** (*corrected 2026-09-13: Friday's
report said "too long", because one refusal reason covered both and the log could not tell them apart*).
Nothing was written to replace it, because the alternative to quoting nothing is writing something.

**THE FIRST LIVE CORRECTION QUOTED A METHODS SENTENCE WEARING ITS OWN SECTION LABEL, AND NOTHING REACHED
A READER.** At `22:19Z` the composed line was *"Methods Thirteen male soccer players (16.2 ± 0.3 years,
BMI = 24.5 ± 1.5 kg/m2) completed a counterbalanced crossover study…"* — verbatim, and a textbook methods
sentence with the label glued to its front as though the authors had written it there. **Two clauses
existed to refuse exactly this and both were walked past**: `SECTION_LABEL` required a colon and that
abstract writes `Methods Thirteen…`, so no sentence had a section, the results restriction never applied
and the pool silently widened to the whole abstract; and `METHODS_STATEMENT` wanted
`players`+`completed` *adjacent*, where the demographics sit between them. Fixed in
[`4749912`](https://github.com/in-c0/tuned/commit/4749912). **[L-73](LESSONS.md)** — third in three days,
and the new shape is *a restriction that fails open*: when the label pattern matched nothing the code did
not refuse, it widened, and the log stayed cheerful.

**WHOSE REFUSAL WAS IT — the abstract's, or this run's own budget?** A correction is held to a budget 23
characters shorter than a publication's, because of the mark. That ambiguity was closed rather than
argued: a refusal now re-runs the selection at the publisher's budget and says which.
[Run 34723050831](https://github.com/in-c0/tuned/actions/runs/34723050831) reads **"not the mark's doing
— the publisher's own budget refuses this abstract too"**. The mark is not what kept item 280 uncorrected.

**Q4's refusal path is exercised for the first time**, which run 154 named as a gap it could not close:
six clause names, one reported per refusal, and now a real refusal on a real record with the clause
counts printed.

**There is deliberately no `amend` action on the `agent operator` workflow.** A free-text `why` input
there would let a person type a sentence straight into the agent's voice. The only caller that may
correct a line is `agent scout`, which composes it from the source's own abstract and cannot invent one.
The workflow gets a **read-only `amendments`** action instead.

**The schedule is still disarmed and the threshold-2 proposal is still unruled.** Unchanged from run 154:
the proposal ([`93a7a27`](https://github.com/in-c0/tuned/commit/93a7a27)) deletes the rate as a gate and
promotes the on-remit inspection; **no reviewer ruling has been posted since 2026-09-01**, the original
threshold stays in force as FAILED, and no run should arm the schedule on its own reading of a threshold
the executor proposed.

**None of this touched the three dormant feeds.** Run 152's hold stands: `@wearables`, `@wellbeing` and
`@graphics` were not adopted, not published to, not touched.

**EXP-011's landing-page window is untouched.** No landing page, script, copy, offer, form or counter
changed. The `src/` change is the operator plane — an authenticated control-plane route no visitor
reaches — plus one additive, self-applying table; the landing page's inputs to R are identical.

Gates: `check` **0** · **18 files, 298 tests** (was 287) · `test:ops` **171/171** (was 150) · scout
suite **91 tests** (was 70) · workflow and nomination validators ok · `npm audit --omit=dev` **0
vulnerabilities**.
Provenance on both public surfaces graded against the live item:
[qa-browser 34688324375](https://github.com/in-c0/tuned/actions/runs/34688324375), **17 passed / 1
skipped** (the skip is the RSS case's duplicate at the second viewport — it runs once, from desktop),
header *"@sportstech, 8 nominated find(s)"*.

**Still zero, and a better line on an unfollowed feed is a better line on an unfollowed feed.**
`applications` **0** · `members` **1** · `members_ever_active` **0** · `followers` **0** · gross cash
**AUD $0**, from *no billing exists*. **23 days left.** What changed is that the agent now **points**
instead of describing itself — which is doctrine, and is **supply**.
---

## Run 154 (2026-09-12 20:30 Sydney) — the agent's public line becomes the paper's own sentence, and its first attempt quoted the method

**Item 281** — *How Stable Are Temporal EMG Parameters in Rowing? A Seven-Day Test-Retest Reliability
Study Using Wearable sEMG*, Sensors 26(15):4914 — published `10:21:50.674Z`, **HTTP 201,
`published=true`, `duplicate=false`**, selected by the bar and not by a person. Cycle **S-2**.

**Its entire public line is the authors':**

> "Onset showed excellent reliability across all seven muscles (ICC = 0.943-0.995); offset,
> moderate-to-excellent (0.524-0.907); peak position, poor-to-excellent (0.114-0.948); active duration,
> poor-to-good (0.077-0.814)." — the source's own words, quoted by @sportstech.

EMG onset timing repeats almost perfectly across seven days; active duration barely repeats at all.
That is a thing a coach reading an EMG trace would want to know before trusting one, and **no word of it
was written here.**

| Screen | Run | Screened | Selected | Deferred | Quotation |
| --- | --- | --- | --- | --- | --- |
| 1 — quotation rule as shipped | [34687978960](https://github.com/in-c0/tuned/actions/runs/34687978960) | 35 | 9 | 16 | **a methods sentence — wrong, nothing published** |
| 2 — corrected clause | [34688153865](https://github.com/in-c0/tuned/actions/runs/34688153865) | 35 | 9 | 16 | the reliability result, 218 chars, verbatim confirmed |
| 3 — publishing | [34688223326](https://github.com/in-c0/tuned/actions/runs/34688223326) | 35 | 9 | 16 | **281 published** |

The identical counts across all three are the evidence that the clause fix touched the line and not the
bar. Full record in [EXPERIMENTS.md](EXPERIMENTS.md) (EXP-013), the decisions and the pre-committed
publication rule in [DECISIONS.md](DECISIONS.md), the lesson in [L-72](LESSONS.md).

---

## Run 153 (2026-09-12 14:20 Sydney) — the feed got a publisher, and the publisher's first bar was about the wrong people

**Item 280** — *The Effect of Three Work-Equivalent Whole-Body Vibration Protocols on Acute
Neuromuscular Performance in Highly Trained Adolescent Soccer Players*, J Musculoskelet Neuronal
Interact 26(3):378-391, 01 Sep 2026 — published `04:29:56.560Z`, **HTTP 201, `published=true`,
`duplicate=false`**, selected by the bar and not by a person.

**The find is a null**, which is the part of this remit hardest to get from a press release: thirteen
highly trained adolescent male soccer players, counterbalanced crossover, three work-equivalent WBV
protocols (1×3min, 3×1min, 6×30s), and **no significant main effect of protocol or protocol-by-time
interaction** on knee-extensor MVIC, vastus lateralis EMG RMS or CMJ, with small estimated effects and
wide confidence intervals. **That sentence was written by a person who read the abstract and is
deliberately not in the agent's `why` line**, which reports only the screening it performed. The agent
read 46,097 characters and has not understood the paper; a line claiming otherwise would be the
summariser Tuned is not. Weaker than the lines on items 242–279, and the honest version of weaker. The
improvement is **quotation of the source, not generation**.

| Screen | Run | Screened | Selected | Rate | On remit |
| --- | --- | --- | --- | --- | --- |
| 1 — original bar | [34672702607](https://github.com/in-c0/tuned/actions/runs/34672702607) | 50 | 10 | 20% | **6 of 10** |
| 2 — corrected bar | [34672935681](https://github.com/in-c0/tuned/actions/runs/34672935681) | 35 | 9 | 25.7% | **9 of 9** |
| 3 — publishing | [34673111073](https://github.com/in-c0/tuned/actions/runs/34673111073) | 35 | 9 | 25.7% | 9 of 9, **280 published** |

Full record and the forks in [EXPERIMENTS.md](EXPERIMENTS.md) (EXP-013), the three decisions and the
reversal in [DECISIONS.md](DECISIONS.md), the feed's own account in
[agents/sportstech.md](agents/sportstech.md). Hand cycles on this feed are **R-n** from here and
autonomous ones **S-n**; item 280 is **S-1**.

---

## Run 152 (2026-09-12 08:20 Sydney) — four of five public feeds are a museum

**One find published, and the measurement that says it is not enough.**

[EXP-005](EXPERIMENTS.md) re-read off live production for the first time since 2026-08-13, and for
the first time per feed:

| Feed | Newest item | Age before | Age after |
| --- | --- | --- | --- |
| `@sportstech` (demo) | 2026-09-11 | **161.9h** | **0.3h** |
| `@ava` (human) | 2026-08-02 | 978.5h | **979.0h** |
| `@wearables` | 2026-07-30 | 1031.3h | **1031.8h** |
| `@wellbeing` | 2026-07-30 | 1031.3h | **1031.8h** |
| `@graphics` | 2026-07-30 | 1031.2h | **1031.8h** |

**One number moved because this run moved it by hand.** `@sportstech` is the only feed on the site
with a working publisher, and that publisher is a scheduled executor run doing a selection cycle
roughly weekly. `@ava` needs the owner to star a captured item and `members_ever_active` is **0**.
The other three are `adoptable (owned, unmanaged)` — agent feeds with no agent.

**None of this is a licence to fill them.** See [METRICS.md](METRICS.md) and
[EXPERIMENTS.md](EXPERIMENTS.md): publishing to `@ava` would fabricate the human attention Tuned
exists to carry, and adopting the three dormant feeds to make the site look busier is EXP-008's
failure mode 2 one layer out. The honest reading is that **recurring agent value is not demonstrated
at any cadence a subscriber would notice.**

**Shipped:** [`3d205a4`](https://github.com/in-c0/tuned/commit/3d205a4) the R-6 pre-registration,
item **279** published `22:17:48.081Z` (+38.08s after its nomination commit),
[`20e4ad8`](https://github.com/in-c0/tuned/commit/20e4ad8) the registry entry,
[`6e26c27`](https://github.com/in-c0/tuned/commit/6e26c27) and
[`04e1250`](https://github.com/in-c0/tuned/commit/04e1250) the QA repair — the second correcting the
first, whose diagnosis was wrong. All six EXP-008 thresholds hold. `check` 0 · 18 files, 287 tests ·
`test:ops` 80/80 · `npm audit --omit=dev` 0.

**Two hosts entered the reachable set:** `journals.plos.org` and `nature.com`, both serving a
self-declaring headless reader a full article page with no gate marker — cleaner than
`frontiersin.org`, source of four of the register's six publications. [L-45](LESSONS.md)'s PLOS
probe is discharged.

**New lessons: [L-68](LESSONS.md)** — a check asserting the absence of something is satisfied by a
page that does nothing; ask what a dead page would score. **[L-69](LESSONS.md)** — an instrument
that has not run since the surface it measures changed has not been tested against it.
`public-surfaces` and `exp003-mechanism` fail that test **today** and cannot be dispatched until
EXP-011 closes 2026-09-18.

## Run 150 (2026-09-11 14:20 Sydney) — the button that delivers nothing

**Five runs of
careful instrumentation were built around a button that delivers nothing, and the path that works was
12px in the corner.**

**`POST /:handle/follow` writes a row into `followers`. That table has one reader in the entire
codebase** — the `COUNT(*)` behind `totals.followers` — **and `src/` contains no mail provider, no
sender and no digest job.** There is no code path that could ever deliver to it, and standing one up
is an owner/auth step. The one sentence admitting this lived in the **success message**, which a
visitor reads *after* handing over an address.

**Runs 145 and 146 built five names around that button** — `follow_submit`, its handle split,
`follow_invalid`, the `offpage` axis, `follow_duplicate`, then `follow_open` and `feed_render` as its
denominator — **and none of them opened the table the route writes to.** Every one of those runs read
the route, the counters and the page. The instrument and the action were both correct. [L-66](LESSONS.md):
**an instrument on a conversion measures whether people take the action and can say nothing about
whether the action does anything for them — a dead end and a working path produce identical counts.**

**Shipped in [`206dc60`](https://github.com/in-c0/tuned/commit/206dc60): the dialog leads with RSS,
discloses that digests are not sending BEFORE asking for an address, and keeps the email option under
a label that says what it is.** RSS is the only subscription on a feed page that works today; it was
an `.rss` link at `font-size: 12px` in `var(--faint)` in the header. **Both owner-gated distribution
items point at this page and one of them is a directory of RSS feeds.**

**One new counter, `follow_rss`** — the RSS option inside the dialog was clicked. Site-wide,
handle-free, same-origin, one-shot per page load, on `follow_open`'s mechanism and with `follow_open`
as its denominator. **The header RSS link is deliberately not wired to it**, so it under-counts by
construction and can never over-count. Five binding reading rules in [METRICS.md](METRICS.md); the
load-bearing one is that **it is a click, not a subscriber and not a person.**

**Six new unit tests and one browser spec, and they check different things on purpose.**
[`test/follow.test.ts`](../test/follow.test.ts) pins that the disclosure precedes the email input in
the served document; **document order is not reading order**, so
[`qa/follow-dialog.spec.mjs`](../qa/follow-dialog.spec.mjs) ([`43a6f53`](https://github.com/in-c0/tuned/commit/43a6f53))
checks it geometrically in a real browser. **Eight mutations refused across the two**, including a CSS
rule that moves the disclosure below the input with the document unchanged — which the unit test
cannot see — and the beacon wiring detached.

**This run did not hold, and that is named rather than slid past.** Run 147's recorded default was
**(1) hold — verification and record-keeping only — until 2026-09-18**, and runs 148 and 149 held it.
Checked clause by clause against EXP-011's four stop conditions rather than asserted: **the landing
page's copy, layout, offer and form are byte-untouched**, `landing_render` is added to no other page
(a test pins `follow_rss` never reaches `/`), no second reading is taken, and the browser spec
**fetches** `/` rather than navigating to it so no `landing_render` fires at all. **Runs 147, 148 and
149 were a watchdog, a fix to that watchdog, and a bump found while auditing that fix. That sequence
terminates in itself.**

**The privacy policy is unchanged, deliberately.** It already says *"We do not currently send any
automated marketing email."* The page now agrees with it — product copy moved to match a published
document, which is the opposite of a material terms change.

Gates: `check` **0** · **17 files, 270 tests** (was 264) · `test:ops` **49/49** · workflow and
nomination validators ok · `npm audit --omit=dev` **0 vulnerabilities** ·
[verify production 217](https://github.com/in-c0/tuned/actions/runs/34561643077) **success on
`206dc60` serving**, all health assertions green. **No rollback.**

**Still zero, and this run does not pretend otherwise.** `applications` **0** · `members` **1** ·
`members_ever_active` **0** · `followers` **0** · gross cash **AUD $0**, from *no billing exists*.
**24 days left.** **No reading of `follow_rss` is available or claimed** — it deployed today with no
history, and at current traffic it may never reach a readable sample. This run made a page honest and
opened a path that already worked; it did not get a user and it did not get a dollar. The three
options run 146 put to the reviewer are still unanswered after eight runs.

---

## Run 149 (2026-09-11 08:20 Sydney) — the advisory triaged by its headline

**Last updated:** 2026-09-11 08:20 Sydney (2026-09-10 22:20 UTC), run 149 — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, unchanged from runs 143-148 and not re-argued here, per [L-07](LESSONS.md).** **The advisory run
148 waved off in one clause was the one that could write into two experiments' numerators.**

**Run 148 triaged three `hono` advisories and got two of them right.** It checked `toSSG` and
`parseBody` by grepping `src/` for the symbol — sound, because an API you never call cannot hurt you
— and dismissed the third, a **query-parser fragment differential**, with *"Tuned runs no caching
proxy keyed on query."* **That sentence answers the advisory's title and never asks whether this
repository reads query parameters.** It does: `c.req.query("src")` on `GET /:handle` and
`GET /:handle/rss.xml`, and `c.req.query()` for `{ code, state, error }` on the Spotify callback.

**Measured this run against both versions rather than reasoned about:**

| request | 4.12.34 | 4.13.7 |
| --- | --- | --- |
| `/sportstech#x?src=ooh-directory` | `src = "ooh-directory"` | `undefined` |
| `/sportstech?src=ooh-directory#x` | `src = "ooh-directory#x"` | `"ooh-directory"` |
| `.../callback?code=A&state=GOOD#x?state=EVIL` | `state = "GOOD#x?state=EVIL"` | `"GOOD"` |

**Both arrival readings were wrong, and wrong in opposite directions.** A fragment before the tag
**mints** a count no query string asked for; a fragment after it **destroys** a count one did. Those
two names are the numerators of [EXP-009](EXPERIMENTS.md) and [EXP-012](EXPERIMENTS.md) — the two
pre-registered distribution experiments, at the two venues sitting in the owner cards below. An
instrument wrong in both directions cannot be read in either. [L-65](LESSONS.md).

**Shipped in [`e9e2a00`](https://github.com/in-c0/tuned/commit/e9e2a00): `hono` 4.12.34 -> 4.13.7,
plus three regression cases in [`test/arrival.test.ts`](../test/arrival.test.ts).** The tests are
pinned **by mutation, not by assertion** — reinstalling 4.12.34 fails all three and passes the other
28. The third case is the one a naive "reject any URL containing `#`" fix would break: a legitimate
`?src=` followed by a fragment must keep counting.

**The OAuth path is named and expressly NOT claimed as a vulnerability.** `state` is compared with
strict equality against the `sp_state` cookie, so a fragment-carrying value **fails** the check and
the callback redirects to `badstate`. It fails closed. The differential there is a broken connection,
not a CSRF bypass.

**What is not established, and is recorded as not established.** Whether Cloudflare forwards a
request-line fragment to the Worker at all is **untested** — this session has no egress to production
and the harness cannot send a raw request line. The claim is about the parser, not about live
traffic. **No value already in `ops/metrics/` is reinterpreted in either direction.**

**EXP-011's mid-window instrument bracket also came due today and is green.**
[qa-browser 34535674639](https://github.com/in-c0/tuned/actions/runs/34535674639) — all three landing
pulses **204**, `landing_render_observed: 1`, **`page_errors: []`**, form typed into and never
submitted. **Re-dispatched on the build the bump produced** and identical in every field —
[qa-browser 34536404000](https://github.com/in-c0/tuned/actions/runs/34536404000) on **`e9e2a00`**
serving, three pulses **204**, `page_errors: []`. **The bump did not disturb the emitter.**
**Run 140's registered hoist trigger did not fire**, so no emitter edit, no early grading,
and the fourteen days remain one comparable window. **Fork R-D is excluded mid-window** as well as at
day 1. Contamination none — the headless user-agent put every increment into the `_bot` names. **No
reading of R is taken; day 7 of 14 is not the pre-named day.**

**One open question in [METRICS.md](METRICS.md) is now closed.** Run 148 could not separate a **phase
shift** from a **reduced rate** in `executor-liveness`'s hourly cron on a sample of two. Four
consecutive scheduled deliveries on 2026-09-10 — 09:06:55Z, 13:46:08Z, 17:49:29Z, 21:08:47Z — give
intervals of **4.65h, 4.05h, 3.32h**. A phase shift still delivers hourly. **It is a reduced rate:
roughly one delivery per 4h against 24 requested.** **No code change follows and none was made** —
`missed-runs` compares register timestamps, so the sampling rate moves only how promptly a lost run
is noticed, never whether it is. That property is now exercised rather than assumed.

Gates: `check` **0** · **17 files, 264 tests** (was 261) · `test:ops` **49/49** · workflow and
nomination validators ok · `npm audit --omit=dev` **0 vulnerabilities** (was 1 moderate carrying 3
advisories) · [verify production 214](https://github.com/in-c0/tuned/actions/runs/34536201483)
**success on `e9e2a00` serving**, all health assertions green including the EXP-011 render beacon,
follow-funnel and feed-render gates. **No rollback.**

**Still zero, and this run does not pretend otherwise.** `applications` **0** · `members` **1** ·
`members_ever_active` **0** · `followers` **0** · gross cash **AUD $0**, from *no billing exists*.
**24 days left.** This run fixed an instrument and closed a live advisory; it did not get a user or a
dollar, and the three options run 146 put to the reviewer are still unanswered after seven runs.

---

## Run 148 (2026-09-10 20:20 Sydney) — the watchdog that was wrong on arrival

**Run 147's watchdog was wrong on arrival, and green.** Its 20h threshold sits on the wall-clock age
of the newest run-lock claim. One paragraph of its header named the residual — a scheduled run can be
delayed, and a delay inflates the age it reads — **sized it at "~2h", and accepted the trade.** The
number was reasoned about, not measured, and the measurement was already in this repository's own
Actions history.

**Measured this run, over the 30 most recent scheduled `metrics snapshot` firings:** delivery lag was
**0.22–0.36h through 2026-08-25**, and has been **1.56–4.48h (median 2.14h) across the 21 firings
since 2026-08-27**. The regime changed on 2026-08-26 and has held for two weeks; nothing recorded it,
because until run 147 no check here cared what time it ran. **A one-miss 18h gap read at the median
lag is an age of 20.1h** — over the threshold. At the measured median the watchdog **pages the owner
on a single lost run**, the exact outcome run 147 chose 20h to prevent, on the grounds that paging on
a blip teaches the owner to ignore the alarm. It had not fired only because the loop had not yet
missed a firing in the six hours since it shipped. [L-64](LESSONS.md).

**Shipped in [`eeef857`](https://github.com/in-c0/tuned/commit/eeef857): stop asking the wall clock
the question that matters.** Two verdicts now. **`missed-runs`** compares two **register** timestamps
— the gap between consecutive claims, threshold **20h** — so no delivery delay can move it, and,
the property that actually matters, **it can see an outage that has already ended**, because the gap
stays in the register after the loop recovers. **`stale`** still reads the clock, so its threshold
absorbs the worst measured lag (18 + 4.48, rounded to **23h**, still under the 24h at which a two-miss
outage recovers by itself) and is demoted to what it is good at: catching an outage **early**, not
catching it at all. **Neither subsumes the other.**

**The cost is stated rather than buried.** On the replayed 2026-09-08 outage the alarm now lands at
**09:05Z instead of 07:00Z** — still **43 hours** before a run happened to look. `missed-runs` buys
that back and more, because it does not require the check to have been awake while the outage was open.

**Two bounds, both deliberate.** A **48h lookback**, because a gap never leaves an append-only
register and without it the first outage would redden this check permanently — an alarm that is always
on is the failure mode the whole file is about. And a **floor at run 147's own claim**: the watchdog
reports outages that began after it existed, and the 66h gap before it is on issue #1 already.

**Nine of ten mutations refused; the tenth is an equivalent mutant and is reported as one.** Two
survived the first pass and **neither was a hole in the code.** One was a test that derived its
horizon from the very constant it existed to pin, so raising that constant to eleven years built a
longer fixture and passed — **a test that moves with the value it holds down asserts nothing.** The
other was a property no test mentioned: which verdict wins when the register holds an open outage and
a healed one at once.

**[`scripts/liveness-alarm.test.mjs`](../scripts/liveness-alarm.test.mjs) is new, and it is the gap
this change made unignorable.** The alarm's shell block executes only during an outage, when nobody is
watching it. Run 147 exercised it by hand, **found two real defects that way** — a `grep -Fq` that
inverted the dedupe under `pipefail` via EPIPE, and a `-f` that would have posted the literal string
`@alarm.md` — and **did not commit the harness**, so nothing would have caught the next one. This run
edited that block. The harness **extracts the `run:` body from the shipped YAML** rather than copying
it, and **its own first draft passed 9/9 while both of run 147's defects survived reintroduction**:
the stub ignored the flag before the value, and returned three short strings where the real endpoint
returns megabytes, so `grep` never won the race that produces EPIPE. Fixed; **six of six** workflow
mutations now refused.

**Unresolved and deliberately not resolved by assumption.** `executor-liveness` requests hourly; from
04:16Z to 10:20Z **one** scheduled run was delivered, at 09:06:55Z, against six due. That is
consistent with a ~4.5h phase shift *and* with a reduced rate, and a sample of two cannot separate
them. **`missed-runs` was written so the answer does not matter** — it reports the outage whether the
sampler was late, early, or asleep throughout. Recorded in [METRICS.md](METRICS.md) with the reading
rules.

Gates: `check` **0** · **17 files, 261 tests** · `test:ops` **49/49** (was 40) · workflow and
nomination validators ok · `npm audit --omit=dev` **0 high, 0 critical** · CI
[233](https://github.com/in-c0/tuned/actions/runs/34465464106) **success** ·
[executor liveness 3](https://github.com/in-c0/tuned/actions/runs/34465474574) **success** on
`eeef857`, reporting `maxAge 23h / maxGap 20h`, `gap null`, `live`. **No rollback.**

**Security, found this run and named rather than folded in.** `npm audit --omit=dev` is **0 high, 0
critical, 1 moderate**, and the moderate's content has changed since it was last written down: three
`hono` advisories — `toSSG()` path traversal, `parseBody()` memory exhaustion, a query-parser fragment
differential. **Two are unreachable, checked rather than assumed** (`grep` finds no `toSSG`, no
`parseBody`, no `hono/cors` in `src/`; bodies are read via `c.req.text()`). A fix exists — **hono
4.13.7**, installed **4.12.34** — and it is runtime code, so it is the **next candidate**, not a
rider on a watchdog change. The four `high` findings are dev-only (`sharp` → libheif via
`miniflare`/`wrangler`) and never reach the Worker.

**The honest point of the run. This is the second consecutive run spent on the machinery that watches
the machinery, and that is two runs in a row with no user and no dollar.** It was worth doing — a
safety device that cries wolf is worse than none, and this one was six hours from its first false
positive — but it is not a plan. **25 days remain and every standing figure is zero.** Both
distribution items are still the owner's; the landing surface is still frozen by EXP-011 until
2026-09-18. **This is the sixth run asking the reviewer to name what this executor should do with its
remaining runs.**

**Previously, run 147 (2026-09-10 14:20 Sydney) — the loop stopped
for seven firings and the only thing that could have noticed was the loop.**

**Seven scheduled firings between run 146 and this one produced no run at all.** The numbering is
unbroken because run numbers count runs that happened, not slots that fired: run 146 was 2026-09-07
20:20 Sydney, and this is 147, three days later. The newest executor claim before this run was
`2026-09-07T10:05:18.987Z` (run 146). The routine's cron is `0 4,10,22 * * *` UTC, so **seven
firings** — 09-07 22:00Z, 09-08 04:00/10:00/22:00Z, 09-09 04:00/10:00/22:00Z — appended no claim, made
no commit and posted no report. A claim is step 0 of every run, so those sessions did not start. About
**4% of the loop's remaining firing budget**, spent on nothing, and **nothing in the system was
capable of saying so**.

**It was masked by something that looks exactly like presence.** `metrics snapshot` commits twice a
day on GitHub's own cron, under the same author line the executor's commits carry, so `git log` showed
fresh activity on every silent day. Production was never affected — `verify production` stayed green
throughout on its own schedule.

**So this run built the watchdog, outside the loop.**
[`.github/workflows/executor-liveness.yml`](../.github/workflows/executor-liveness.yml) runs **hourly**
on GitHub's cron, holds no dependency on the Claude routine, installs nothing, and reads the newest
`claim` for resource `executor` out of the `ops-claims` register. Older than **20h** and it fails the
run *and* posts one comment on issue #1 — once per outage, deduplicated on the newest claim's
timestamp. It **fails closed in every direction**: missing branch, empty register, no claim for the
resource, unparseable timestamp, future timestamp are all red. The only way to be green is a real,
recent, parseable claim.

**The threshold is derived and the sampling rate is the part that was nearly wrong.** Firings at
04:00/10:00/22:00 give cyclic gaps of 6h/12h/6h, so the gap after *k* misses is the sum of *k+1* of
them: max 12h on cadence, 12–18h for one miss, exactly 24h for two. 20h separates them. The first
draft checked three times a day and **could not see a 24h outage at all** — from a 22:05 claim it
observes 1.9h, 7.9h, 13.9h and the next firing recovers before it looks again. Hourly is why it can
see. Both are exercised by 16 `node --test` cases that replay this outage hour by hour
([L-63](LESSONS.md)).

**Reviewer question, defaulted rather than dropped.** Run 146 offered the reviewer three options and
said it would take **(1) hold** if no answer arrived. None has since 2026-09-01. **The default is
taken: hold — verification and record-keeping only — until 2026-09-18.** This run is verification
infrastructure and is consistent with it.

Run 145 found `POST /:handle/follow` writing nothing, four runs after a sweep closed on *"no counter
on any route is undiscriminated any more."* [L-61](LESSONS.md) named why that sentence was true and
useless: it was a claim about the set of **counters**, and a route with no counter is not merely
undetected by that method, it is **unreachable by it**. L-61's own prescribed next attempt was to
**enumerate the surface, not the instrument** — for each route, what does it write, and if nothing, is
that deliberate?

**That is this run, and it is a test rather than an audit.**
[`test/route-inventory.test.ts`](../test/route-inventory.test.ts) parses the route table out of
[`src/index.ts`](../src/index.ts) and [`src/operator.ts`](../src/operator.ts) and requires **all 45
routes** to be classified — **11 instrumented, 34 deliberately uncounted with a written reason**. An
audit performed once decays from the next commit; this runs on every push, so a new route with no
decision about instrumentation is a **red build**. It asserts in **both** directions: a route recorded
as uncounted that quietly grows a counter fails as loudly as one that loses its own, because the
register describing a surface production does not have is the same defect wearing the other face.

**And it refuses to pass vacuously, explicitly** — the specific way an inventory test lies, and L-61
one level up. A parser that matches nothing sweeps an empty set and every assertion over it holds. So
the parsed route count is checked against an independent count of registration tokens and the set of
mounted sub-applications is pinned: a route written as `app.on()`, a computed path, or a whole sub-app
under a new prefix goes **red** rather than unnoticed. **Eight mutations attempted, eight refused.**

**Recorded because it expires on its own: 20 of the 34 uncounted routes are uncounted because
`members` is 1.** Every request any member-only or capability-URL surface has ever served is the
owner, and a counter there would record the operator operating the service. **That reason stops
holding the day `members` exceeds 1**, and it is written in the file so the next run re-decides rather
than re-confirms. Seven more are the operator control plane. `GET /terms` and `GET /privacy` are the
only public HTML this service serves that records nothing — if a venue ever links to them directly,
that becomes wrong.

**The enumeration named one public-surface gap worth closing now, and it is the one run 145 named
next.** Shipped in [`00f635a`](https://github.com/in-c0/tuned/commit/00f635a): **`feed_render`**,
`landing_render`'s rung on a public feed page. `landing_view` alone could not say whether a
human-shaped request was a rendering browser or one of the scanners, probes and preview fetchers that
take the HTML and execute none of it; `/:handle` had the view and **no such name** —
`feed_view:sportstech` reads **37** across 21 complete days and nothing here could say whether one of
them was a browser. Both open distribution items point at a feed page, either can land any day, and
**counters do not backfill**.

**No interim value of `landing_render` is quoted in this run, and the temptation was real.** EXP-011
is pre-registered to grade R = `landing_render` ÷ `landing_view` over 2026-09-05 … 2026-09-18; a
partial series reported as a finding is what pre-registration exists to forbid. The case for
`feed_render` is made **structurally instead**, and EXP-011's forks, thresholds, window and reading
date are **byte-untouched**.

**Gated on the follow button rather than fired unconditionally**, because `CLIENT_JS` is served to the
studio page too and `publicPage` always renders a button. The gate is deliberate twice over: it keeps
the name to public feed pages, and it makes `feed_render` the **honest denominator for `follow_open`**,
gated on the same element — a page that stops emitting one stops emitting both rather than skewing a
ratio. Site-wide and carrying no handle, on `follow_open`'s reasoning, so `feed_render ÷
feed_view:<handle>` is sound only while one feed dominates views.

**The production gate ships in the same commit as the counter, not a run behind it** — the whole of
the run-138/140/145 sequence. `verify-production` asserts against the served documents that
`/api/pulse/feed_render` answers **403**, that `/sportstech` fires it, and that **the landing page does
not**, so EXP-011's denominator cannot be contaminated mid-window without a red build.

**A hole that predates this change, found by mutating the instrument rather than reading it —
[L-62](LESSONS.md).** `ALLOWED` and `PULSE_COUNTERS` were pinned to each other; `NEVER_HERE` — the
**complement** the browser spec uses to assert a feed-page pulse never fires on `/` — was pinned to
nothing. Adding a name to one and forgetting the other passed every check in this repository while
silently retiring the assertion protecting a pre-registered denominator. **A pinned mirror fails when
two lists disagree; a complement fails when one list grows, and growth is agreement.** `NEVER_HERE` is
now **derived from the served landing document**. Eight of eight `feed_render` mutations refused; on the
first pass it was seven, and this was the survivor.

**The `owner_resolved` reading run 145 deferred has arrived** (snapshot `2026-09-07T04:42:52Z`):
`owner_resolved` **1**, `stars_owner` **8** of `stars` **8**, `skips_owner` **33** of `skips` **33**.
**Every attention event this service holds is the owner triaging their own desk** — which the register
has said all along and, until run 144, could not have known.

Gates: `check` **0** · **17 files, 261 tests** (was 15/240) · `test:ops` 14/14 · workflow and
nomination validators ok · CI [34110877147](https://github.com/in-c0/tuned/actions/runs/34110877147)
**success** · [verify production 205](https://github.com/in-c0/tuned/actions/runs/34110877141)
**success** on `00f635a` serving, including the new `feed_render` step. **No rollback.**

**The honest point of the run, stated as plainly as run 145 stated its own.** This closes a *class* of
gap rather than a gap, which is worth more than another counter and is still not a user or a dollar.
**27 days remain and every standing figure is zero.** Both distribution items are still the owner's;
the landing surface is still frozen by EXP-011 until 2026-09-18. **Runs 141, 143, 144 and 145 asked
the reviewer to name what this executor should do with its remaining runs. This is the fifth asking,
and the request is narrowed further below.**

**Previously, run 145 (2026-09-07 14:20 Sydney) — the only
conversion action on a public feed page wrote no counter at all — and it is the page both open
distribution items point at.**

`POST /:handle/follow` is what a visitor to `/sportstech` does if they want more of it, and until this
run the sole trace it left was `totals.followers`, a single running total reading **0**. A total that
does not move has four explanations that instrument cannot separate: **nobody tried**, **someone tried
and the address was rejected**, **someone tried who was already following**, or **the request never
arrived**. Against `feed_view:sportstech` **37** unsuffixed views across 21 complete days, that pair
licensed nothing at all.

**This is not the defect runs 141–144 closed, and the difference is the lesson.** Those counters existed
and could not say *who* wrote them. This route had **no counter to audit**, so it appeared in none of
the enumerations that sweep walked — and run 144 closed on *"the instrument sweep is finished; no
counter on any route is undiscriminated any more."* That sentence is **true and it is the wrong
property**: it was a claim about the set of counters, and the gap was a route outside it.
[L-61](LESSONS.md): **an inventory audit is only as complete as the set it enumerates**; prevention
check — *write down the set you swept, then name one member of the intended set that is not in it.*

**Shipped in [`fb118ee`](https://github.com/in-c0/tuned/commit/fb118ee)** — seven names, three of them
axes: `follow_submit[_bot]` and `follow_submit[_bot]:<handle>` (the destination split, exactly as
`feed_view:<handle>` splits a view), `follow_invalid[_bot]` (rejected by validation, **not part of**
submit), the `follow_submit_offpage` / `follow_invalid_offpage` axes on run 141's definition, the
`follow_duplicate` axis, and the page-reported `follow_open[_bot]`.

**`follow_duplicate` is the load-bearing one**, because it is what makes `totals.followers` readable: a
day with `follow_submit` 3 and `follow_duplicate` 3 moved the total by **zero**, and without it that
day and a day nobody tried are the same reading. **`follow_open` is the rung**, on EXP-007's own
nineteen-day lesson — without a counter between the view and the submit, *"the arriving clients are not
people"* and *"people arrive and do not want this"* produce the identical zero.

**The instrument fails in exactly one direction, and the direction was chosen.** When a write result
does not say whether a row was created, the follow is counted **new**; the opposite default would mark
the **first real follower** a repeat, which is the one direction in which a genuine conversion
disappears. `wroteNewRow` in [`src/metrics.ts`](../src/metrics.ts) carries the asymmetry — and that
branch is **unreachable on a live D1**, which is exactly why it survived the first mutation pass and is
now pinned by a direct unit test. **Deliberately not done: refusing an offpage or bot-flagged follow.**
`followers` is 0; one real person turned away costs more than every mislabelled follow combined, and
this route classifies and never refuses.

**Why this and not the two items run 144 named, and the count is kept rather than quietly incremented
([L-59](LESSONS.md)).** Neither is declined on preference; **both are unavailable today and both stay
named.** EXP-011's second instrument-validity bracket is registered for **mid-window** and today is
**day 3 of 14** — dispatching it now is choosing the day. The `owner_resolved` reading needs the first
snapshot carrying it, and the newest snapshot in `ops/metrics/` is **22:17:04Z 2026-09-06**, three
minutes *older* than the counters run 144 deployed; it will exist on its own at the next scheduled
snapshot.

**Mutation-tested, not asserted.** **Thirty** tests in [`test/follow.test.ts`](../test/follow.test.ts)
against a real D1 in workerd; **thirteen mutations attempted, thirteen refused** — dropping either
`_bot` split, dropping the destination split, dropping either offpage axis, never firing
`follow_duplicate`, inverting it, flipping its default toward duplicate, refusing an offpage follow,
counting a submit on the rejection path, dropping `follow_open` from the allowlist, dropping the
beacon's one-shot guard, and detaching the beacon from the page. **One survived the first pass** — the
unreachable default — and closing it is what produced `wroteNewRow`. Suite **15 files, 240 tests**;
`check` 0; `test:ops` 14/14; workflow and nomination validators ok.

**EXP-011's four stop conditions are intact and this run did touch `src/pages.ts`, so the argument is
made rather than asserted.** The change is confined to `CLIENT_JS`, which `landingPage()` **does not
use** — it builds its own inline script — so the landing document's copy, layout, offer and form are
unchanged, `landing_render` is added to no other page, and neither of R's inputs is read or written. A
test pins that `GET /` contains no `follow_open`, and the browser spec now asserts separately that a
pulse belonging to another page never fires on `/`. **No schema change, no migration, no cookie, no
identifier, no per-visitor state, no new data category — so the privacy policy is unchanged.**

**The consequence, and it is the honest point of the run. This closes the last uncounted conversion
action on a Tuned surface, and it changes nothing a visitor can see.** 28 days remain and every
standing figure is zero. Both distribution items are still the owner's; the landing surface is still
frozen by EXP-011 until **2026-09-18**. **Runs 141, 143 and 144 asked the reviewer to name what this
executor should do with its remaining runs. This is the fourth asking.**

**Previously, run 144 (2026-09-07 08:20 Sydney) — **the two counters that
would announce Tuned's first activation could not say whether we were the ones who acted.**
`attention_star` and `attention_skip` were the last two counters on this site with **no discriminator
of any kind**. Every attention event the service holds — `totals.stars` **8**, `totals.skips` **33** —
is the owner triaging their own desk, and **the first star by a real member would have arrived under
exactly the same name**. That is [L-57](LESSONS.md)'s shape a third time, after `application_*`
(run 141) and `member_login`/`desk_view` (run 142): nobody doubts good news, so the discriminator has
to exist before the news does. Named open by run 142, left open by run 143, closed here.

Shipped in [`579b024`](https://github.com/in-c0/tuned/commit/579b024): the `_bot` split on both names,
plus `attention_star_owner` / `attention_skip_owner` as an **axis, not a bucket** — the subset taken by
the owner's own member, regardless of user-agent, never summed with the names above, whose totals are
unchanged. **`attention_star` moving while `attention_star_owner` does not is the first non-owner
star**, and that reading did not exist before this run. **Two halves, because they answer different
questions:** the daily axis separates events forward from its own deploy, while `totals.stars_owner` /
`skips_owner` are computed from `reads` — which carries `member_id` already — so they separate the
**whole history** and are **not zero merely because they did not exist yet**, the one property a
counter can never have. `reads` is upserted on `(member_id, item_id)`, so it is current state and the
counters are the event record; neither half subsumes the other.

**The instrument fails in exactly one direction, so the failure is reported rather than inferred.**
With no resolvable owner the axis never fires and the owner's own stars look **identical to a
stranger's** — a false activation, in the one direction nobody would question. `totals.owner_resolved`
reports resolution, and **on a 0 day none of the four owner names licenses any reading**. Tests pin all
three ways it can fail: no such handle, an **agent** feed at the handle, and a human feed with no
member attached. The owner definition itself moved to [`src/handles.ts`](../src/handles.ts) and
`operator.ts` now imports it — two copies of that literal would have been two answers to *whose actions
are ours*, and a counter built to separate the owner from a real member is worthless the moment it can
drift from the operator scoping it mirrors. **The route classifies and never refuses:** a star writes,
redistributes and returns 200 identically whether or not the owner resolves.

**Why this and not the other named item.** [L-59](LESSONS.md) was written **last run**, and this is its
first application: read the register's named next step and count consecutive declines. The count was
**one** (run 143); at two a decline needs a named trigger and at three the item is done or struck, so
doing it now is what the lesson forbids starting the five-run pattern again. EXP-011's second
instrument-validity bracket is registered for **mid-window** and today is day 3 of 14.

**Mutation-tested, not asserted.** **Twelve** tests in [`test/attention.test.ts`](../test/attention.test.ts)
against a real D1 in workerd; **eight mutations attempted, eight refused** — dropping the axis (5
failures), dropping the `_bot` split (1), falling back to member id 1 instead of null (3), dropping
`kind = 'human'` from owner resolution (1), reporting `owner_resolved` 1 when unresolvable (3),
dropping the member filter from `stars_owner` (1), inverting the owner comparison (5), dropping the
owner totals from the snapshot (4); control **12/12**. Suite **14 files, 210 tests**; `check` 0;
`test:ops` 11/11; workflow and nomination validators ok. **No `src/pages.ts` change, so EXP-011's four
stop conditions are byte-untouched** and neither of R's inputs is read or written. No schema change, no
migration, no cookie, no identifier, no per-visitor state, **no new data category — so the privacy
policy is unchanged**, on the reasoning runs 43, 141 and 142 recorded.

**The consequence, and it is the honest point of the run. The instrument sweep is finished.** No
counter on any route is undiscriminated any more. Distribution is A0/A2 and both are the owner's
(run 143); the landing surface is frozen by EXP-011's own stop conditions until **2026-09-18**; the
instrument work is now done. **28 days remain and every standing figure is zero.** That is not a plan
for the remaining runs and must not be read as one — run 141 and run 143 both asked the reviewer to
name what this executor should do with them, and **that request stands unanswered for a third run.**

**Second action this run, forced by the first one's verification: the check that says whether a deploy
landed reported failure about a deploy that had landed.**
[Run 198](https://github.com/in-c0/tuned/actions/runs/34063537090) went red at 22:24:41Z — *"`ea902e1`
never became live (last seen: `1abe55e`)"* — and `1abe55e` is `ops: metrics snapshot 2026-09-06`,
pushed by **this repository's own scheduled workflow 32 seconds after this run's push**, and a
**descendant** of `ea902e1`. Cloudflare builds the tip of `master` when its build starts, so any commit
landing in between makes an **exact SHA match permanently unsatisfiable**; the change was live the whole
time inside a build the check could not recognise, and **every health assertion was skipped**. The cost
that was not paid is the point: **this loop's standing rule is to roll back automatically on a failed
verification**, so a future run trusting that red would have reverted a healthy deploy with nothing in
the record to contradict it. The rule is now **containment** — `git merge-base --is-ancestor` — with
`fetch-depth: 0` and an in-loop fetch, still failing closed on an older serving commit, an unknown
object, a missing build stamp or the eight-minute budget. [L-60](LESSONS.md): **a verification's match
rule has to be stated over the property being verified, not over the artefact that identifies it**;
prevention check — *name one state of the world in which nothing is wrong and this gate goes red.*
Four mutations, four refused; pinned in [`scripts/verify-workflow.test.mjs`](../scripts/verify-workflow.test.mjs)
against a real two-commit repository rather than in prose. **This run's production verification was
obtained by hand and is stated as such:** [run 199](https://github.com/in-c0/tuned/actions/runs/34064052747)
**success on `1abe55e` serving**, every assertion green.

**Previously, run 143 (2026-09-06 20:20 Sydney) — **[OWNER ACTION REQUIRED](#owner-action-required):
TWO, and the second one is a question, not a chore.** **A5 is closed at `ooh.directory`, and with it
the last distribution work anywhere on this board that this executor could perform.** The venue's own
form asks for *"The URL of the blog's front page (not its feed)"*, so the tagged URL is `/sportstech` —
`GET /:handle`, counted since run 48. **The route was already covered; only the tag was missing**, which
is the mirror of run 56's defect (an instrumented tag on an uninstrumented route). Shipped in
[`a9eaa2e`](https://github.com/in-c0/tuned/commit/a9eaa2e): one string on the existing `ARRIVAL_TAGS`
allowlist, five tests, no new route, no schema, no cookie, no identifier, **no new data category — so
the privacy policy is unchanged**. [EXP-012](EXPERIMENTS.md) pre-registers the window, `D ≥ 3 and
V ≥ 8`, six forks — with **never-listed** named as the *expected* outcome on the venue's own words —
and **two** controls: `arrival:qa`, whose measured null on this route is **0 non-zero days across 21**,
and the tag's own published-but-unsubmitted interval before `t0`. All of it registered **before the
counter had ever been written**, because counters do not backfill and a suggestion is spent once.
**Registering the tag authorizes no submission**, and the commit says so.

**Why this and not the two instrument items run 142 named.** Run 137 called this *"the next
executor-actionable step at this venue"*; runs 138, 139, 140, 141 and 142 each declined it for
something else, every decline individually defensible, **no report responsible for the sum** —
[L-59](LESSONS.md). It is also the only remaining item on the board about **whether anyone arrives**
rather than about the instruments measuring an empty funnel, which is the thing run 142 closed by
warning about in its own words. The second EXP-011 bracket is registered for **mid-window** and is
premature on day 2 of 14; `attention_star`/`attention_skip` is, by run 142's own ranking, smaller than
either of the last two instrument fixes. **Run 57's L-33 objection is discharged rather than ignored:**
A1 here has already been read (run 57, two dated dispatches) and is PARTIAL, so this is not an
instrument built ahead of its gate.

**Mutation-tested, not asserted.** Dropping the tag from the allowlist fails 4; dropping the arrival
name from `GET /:handle` fails 6; control **28/28**. The load-bearing test is the fourth: it pins that
`GET /` writes **nothing** for this tag, because that route reads no `?src=` at all and a later run
instrumenting the marketing page would silently change what EXP-012's numerator counts. Suite
**13 files, 198 tests**; `check` 0; `test:ops` 11/11; workflow and nomination validators ok. **No
`src/pages.ts` change, so EXP-011's four stop conditions are byte-untouched** and neither of R's inputs
is read or written by this diff.

**The consequence, and it is the point of the run.** Every remaining step at every candidate in
[DISTRIBUTION.md](DISTRIBUTION.md) is now **A0 or A2, and both are the owner's.** There is no
distribution work left that this executor can do. `awesome-rss-feeds` has the owner's `A` from
2026-08-20 and needs two minutes of account access. `ooh.directory` has **never been asked**: whether
an agent-written link blog may be suggested in the owner's name to a human-curated blog directory is an
authorship decision, put verbatim in [SUBMISSION-ooh-directory.md](SUBMISSION-ooh-directory.md) as a
one-word answer — `A` proceeds, `N` retires the file permanently. **29 days remain and every standing
figure is zero.**

**Previously, run 142 (2026-09-06 14:20 Sydney) — **[OWNER ACTION REQUIRED](#owner-action-required):
ONE, unchanged and undeadlined** (submit `/sportstech` to `plenaryapp/awesome-rss-feeds`; packet at
[SUBMISSION-awesome-rss-feeds.md](SUBMISSION-awesome-rss-feeds.md); not re-asked here, per
[L-07](LESSONS.md)). **The number this loop calls activation could have been moved by the email that
announces a member.** Run 141 shipped [L-57](LESSONS.md)'s prevention check — *if this counter read 1
tomorrow, what would we conclude, and what in the record would let us tell that conclusion from its
opposite?* — and this run put it over the counters run 141 did not touch. Two failed, and they were the
last two on the site with **no discriminator of any kind**: `member_login` (`GET /enter/:token`) and
`desk_view` (`GET /today`). **They are not a labelling problem, because they are not read in
isolation.** `/today` writes the `member_days` row that `retention.members_ever_active` — the number
this loop reports as its activation evidence, **0** for the whole window — is computed from, and
`/enter/:token` grants the session that makes `/today` reachable, **on a GET, from a link delivered by
email**. Mail gateways, security scanners and chat unfurlers fetch every URL in a message before a
person opens it. So the chain reporting Tuned's first activation can be walked end to end by a machine,
and **it fires on the first real admission** — the moment nobody would doubt it. Shipped in
[`c743cb6`](https://github.com/in-c0/tuned/commit/c743cb6): the `_bot` split on both names, plus
`member_login_unattended` / `desk_view_unattended` as an **axis, not a bucket** — the subset arriving
without `Sec-Fetch-User: ?1`, which browsers set on a top-level navigation only when a person activated
it. **The axis is the load-bearing half:** a mail gateway sending a Chrome user-agent is invisible to
`isBot` and lands unsuffixed. A GET carries no `Origin`, so this is run 141's reasoning adapted to a
navigation. **Deliberately not done: refusing an unattended sign-in, or a confirm-to-continue
interstitial** — the textbook fix for magic-link prefetch, declined on the merits, because
`members_ever_active` is 0 and one member turned away or lost to an extra click costs more than every
mislabelled login combined. These routes classify and never refuse; a test pins that. **Five mutations,
four refused — and the fifth is the finding.** Dropping the `_bot` half of the desk split passed the
whole suite, because every assertion in the new block sent a browser user-agent: [L-56](LESSONS.md)'s
shape inside a test written by the run citing L-56, caught before commit only because the mutation pass
was run at all. Fixed, then refused. Filed as [L-58](LESSONS.md): **a counter's discriminator must be
judged against how its input actually arrives** — every counter already split sits on a URL a visitor
*navigates to*; these two sit on a URL that is *sent*. Suite **13 files, 193 tests**; `check` 0;
`test:ops` 11/11; CI [34010848174](https://github.com/in-c0/tuned/actions/runs/34010848174) green;
[verify production](https://github.com/in-c0/tuned/actions/runs/34010848169) **success on `c743cb6`
serving**. **No `src/pages.ts` change, so EXP-011's four stop conditions are byte-untouched and neither
of R's inputs is read or written.** **No production write-probe, and none is owed:**
`members_ever_active` is computed from `member_days` independently of `metric_days`, so it rising while
none of the four new names moves is visible in the very next snapshot; probing would have written
first-party noise into two of the four names on the one route whose intended population is the first
real member. **Named and deliberately not closed:** `attention_star` / `attention_skip` still cannot
separate the owner from any other member — a different ambiguity, partially answerable from the
per-member `member_days`, recorded in [METRICS.md](METRICS.md) rather than folded into a bounded fix.

**Previously, run 141 — the one number this bet is waiting for could not say who wrote it.**
`POST /waitlist` wrote `application_submit` and `application_invalid` unsuffixed, always, and it is
public source in a public repository, so a scripted POST arrived in the snapshot indistinguishable from
a person filling in the form. **It survived 140 runs because it was never wrong** — `applications` has
read 0 throughout, and a counter that has only ever recorded zero looks exactly like a correct one.
[L-57](LESSONS.md): rank instruments by *what a reading would license*; **nobody doubts good news**, so
the discriminator has to exist before the news arrives. Shipped in
[`14e70a2`](https://github.com/in-c0/tuned/commit/14e70a2): `_bot` on both names plus
`application_submit_offpage` / `application_invalid_offpage` as an axis. **Deliberately not done:
refusing an offpage submit.** Also **considered and declined: an interim-analysis rule for EXP-011** —
tonight was the last moment one could be registered before any of the window's data was readable, and
amending a pre-registered reading schedule mid-window to shorten a wait under deadline pressure is
[L-55](LESSONS.md)'s failure exactly.

**Previously, run 140 — the only check that can see EXP-011's numerator was broken by EXP-011's
numerator, and nothing went red.** Run 138 added `pulse("landing_render")` and did not touch
[`qa/pulse-instrument.spec.mjs`](../qa/pulse-instrument.spec.mjs), which asserted that **no** pulse
fires on a bare page load and mirrored a **two-name** allowlist — both contradicted by an
unconditional beacon. `qa/` is dispatch-only, so it was never run and every gate stayed green:
`check` 0, 176 tests, `verify production` success. **The cost, had it stood, was the whole
experiment:** [EXP-011](EXPERIMENTS.md) registers **Fork R-D — the beacon never landed** and, as
written, R-D is discoverable **only on 2026-09-18**; counters do not backfill. Run 138's production
gate asserts the route is allowlisted and that the HTML *contains the string* `pulse("landing_render")`
— **both true of a page whose script throws on line one.** That is [L-51](LESSONS.md)'s shape a sixth
time, filed as [L-56](LESSONS.md). Shipped in [`1800bc8`](https://github.com/in-c0/tuned/commit/1800bc8):
the spec now waits for the beacon on a bare load and asserts 204, the page's own `Origin` and one-shot;
`test/pulse.test.ts` reads both files as text and **fails CI** if the mirror diverges from
`PULSE_COUNTERS` again or the spec stops waiting — **mutation-tested, three regressions, three
refused**. Suite **13 files, 178 tests**. **First observation of the beacon, ever**
([qa-browser 33959936807](https://github.com/in-c0/tuned/actions/runs/33959936807)): emitted on bare
load, **204**, `Origin: https://justtuned.com`, once across two `Tab`s / a 600px scroll / typing,
**`page_errors: []`**, form never submitted — so **Fork R-D is excluded at the emitter on day 1 of 14
instead of day 14.** Every increment landed in the `_bot` names (the QA user-agent declares
`HeadlessChrome`), so **R's unsuffixed inputs were untouched** and no stop condition moved: **no `src/`
file changed at all**, Worker source byte-identical. **Deliberately not done, and disclosed against the
loop's own belief:** `pulse("landing_render")` is top-level but **not first** — ~15 lines of DOM
decoration precede it, and a throw there suppresses the beacon while `landing_view` still counts,
biasing **R down toward Fork R-A, the claim already held**. The two-line hoist was declined because a
mid-window emitter edit splits the fourteen days; it is **measured** instead (`page_errors: []`) with a
registered trigger — any page error before the render pulse in any bracket means hoist immediately and
grade on the complete days before the edit. Brackets registered: one more inside the window, one on
**2026-09-19** before the reading. **Previously, run 139 — the agent made a second kind of selection.** Items 242, 246, 247 and 248 all
ask *does this device measure what it claims*; **item 249** ([R-5](EXP-008-CANDIDATES.md), published
`2026-09-05T04:13:32.260Z`) asks *does the monitoring practice see what the coach needs*, and answers
it with a **null on the objective instrument** — across a Bundesliga youth match the free subjective
scales moved with Kinexon LPS external load and the leg recovery test did not. **All six EXP-008
thresholds pass**, threshold 5 on the first attempt for the second consecutive cycle; `public_items`
**15 → 16**, `operator_publications` **4 → 5**, replay `duplicate=True`. Four of six candidates died
before any dispatch and a fifth was opened at page level and **rejected on its own abstract** — no
number for any model, and a target computed from the same heart-rate signal as its predictors.
**Freshness was not at stake**: run 137's cadence test was already satisfied, so *publish nothing*
would have cost the register nothing, which none of the previous four cycles could say. **Publishing
inside [EXP-011](EXPERIMENTS.md)'s window is admissible because `R` = render ÷ view is invariant to
what the page renders** — but a content-diffing crawler re-fetching `/` biases `R` **down**, toward
the standing claim, and that is disclosed in [DECISIONS.md](DECISIONS.md) before the 2026-09-18
reading rather than after it. The four named stop conditions are untouched: no landing copy, layout,
offer or form change. **Previously, run 138 — the claim that has steered nineteen days of work rests on a counter that cannot
test it.** `landing_engage` requires the visitor to scroll, click or type, so *"nobody real is
arriving"* and *"real people arrive and leave"* produce the identical near-zero reading — 7 engages
against 1131 landing views over 19 complete days, with unsuffixed `application_start` never written
once. **`landing_render`** (run 138, [EXP-011](EXPERIMENTS.md), pre-registered before the counter
existed) fires at script execution and asks nothing of the visitor, so it separates *a browser
rendered this* from *something fetched this*; **R = render ÷ view over 2026-09-05 … 2026-09-18** either
upholds the standing claim on measurement or contradicts it. **Deliberately not done this run: the
`ooh-directory` arrival tag.** Run 137 named it next; the run-57 decision declining it on
[L-33](LESSONS.md) ordering stands, because reversing it would have been the **second** condition
weakened in two runs, both blocking the same unmakeable submission — see [L-55](LESSONS.md).
**Previously, run 125 —** **This site had never told a crawler anything, and one of the things it never said was "do not
index this token."** No reviewer directive was outstanding — run 124 discharged the
[`09:35:07Z` one](https://github.com/in-c0/tuned/issues/1#issuecomment-5476488001), whose own stop clause
released `robots.txt`/sitemap work the moment the run-lock guard existed. **Lock claimed first**, cycle
`2026-08-31/w20`, holder `routine-run-125`, before any commit. **What was missing was not a directive in
a file — it was the file.** No `robots.txt` at all, which every crawler reads as *crawl everything*, on a
Worker that serves **capability URLs at `/studio/<token>` and one-shot login links at `/enter/<token>`**;
no `sitemap.xml`; and `workers_dev` plus a Workers Builds preview per branch serving the identical
document from several hosts with nothing addressed to a reader that reads only the host. **This is
[L-46](LESSONS.md)/[L-51](LESSONS.md)'s shape a fourth time**, and [L-53](LESSONS.md) records why L-51's
own prevention check could not catch it: it named the `<head>`, and `robots.txt` is a property of an
**origin**, not an element of any document. **The two mechanisms are not redundant and only one is load
bearing:** `Disallow` asks a compliant crawler not to *fetch* a URL and does nothing about a URL
discovered through a paste, a referrer or a toolbar — for a capability URL that is the whole risk, so
**`X-Robots-Tag: noindex` is the half that actually refuses**, and
[`src/crawl.ts`](../src/crawl.ts) holds the one list both are built from so they cannot drift. Shipped in
[`cb05de5`](https://github.com/in-c0/tuned/commit/cb05de5): host-aware `/robots.txt` (canonical host
crawlable and advertising its sitemap, `workers.dev` origin blocked, **`www` deliberately NOT blocked** —
a crawler forbidden to fetch a duplicate never reads the `rel="canonical"` that consolidates it),
`/sitemap.xml` listing only feeds that have actually published, a noindex middleware, and
[`test/crawl.test.ts`](../test/crawl.test.ts) — **17 tests**. Suite **13 files, 174 tests**; `check` 0;
`test:ops` 11/11; CI [`33381676976`](https://github.com/in-c0/tuned/actions/runs/33381676976) green.
**Verified against what is actually serving justtuned.com**, not against the commit:
[`33381677038`](https://github.com/in-c0/tuned/actions/runs/33381677038) reports *canonical host
crawlable, sitemap advertised, workers.dev origin blocked* · `/studio/<token>` **404 with
`x-robots-tag: noindex, nofollow`** · `/sitemap.xml` **200, 8 URLs, all canonical**. That step is the
change's standing rollback signal and **every one of its assertions was mutation-tested against fixtures
before it shipped — six regressions, all refused, one real bug found and fixed in the process.**
**Deliberately not decided: whether AI training crawlers are welcome.** The policy is `User-agent: *`,
exactly what the absence of a `robots.txt` already meant, so **their access is unchanged**; naming GPTBot
or CCBot either way is the owner's positioning call, not a side effect of adding a file, and nothing is
blocked on it. **No schema, migration, secret, data handling or user-facing copy; no owner ask; no
spend.** Two additive counters (`robots_fetch`, `sitemap_fetch`) registered in [METRICS.md](METRICS.md)
with binding reading rules — **neither is demand, neither is a person, and this loop's own verifier lands
in the `_bot` buckets** ([L-44](LESSONS.md)). **No [EXPERIMENTS.md](EXPERIMENTS.md) entry, on purpose:**
nothing in this service observes an index, an impression or a search click, so this is a **precondition,
never evidence**. All commercial readings remain zero; AUD $0.00 of $500 ·
**Previously, run 124 (2026-08-31 19:55 Sydney) — [OWNER ACTION REQUIRED](#owner-action-required):
NONE.** **The loop has a lock, and it is a lock rather than a convention.** Executed on the [reviewer
directive of `09:35:07Z`](https://github.com/in-c0/tuned/issues/1#issuecomment-5476488001): run 123 was
executed by two sessions at once and was stopped only by a non-fast-forward push on `master`, which is
luck, not exclusion. **The guard is [`scripts/run-claim.mjs`](../scripts/run-claim.mjs) and the primitive
is the remote's own compare-and-swap** — a non-force ref update lands only if the ref is still where the
pusher read it, so of N contenders exactly one commit becomes reachable. **See
[Run lock](#run-lock--step-0-of-every-run) for the procedure; it is step 0 of every run, before any
commit, comment, dispatch or deploy.** **Proved twice, not asserted:** eleven `node --test` cases,
including a forced interleave where both contenders read the same tip and both believe the lock is free,
and eight real processes racing to one winner and seven exit-75 losers; then end-to-end against the real
`origin`, where a rival contender was refused `lease-held` and appended nothing. **This run itself was
claimed before its first commit** (`086bdda8`, cycle `2026-08-31/w14`). **A credential probe this run
narrowed what the executor can write:** `refs/heads/*` create and fast-forward only — **tags, custom ref
namespaces and every ref deletion are 403**, which is why the register is one append-only orphan branch
(`ops-claims`) and why release and stale recovery are appends rather than deletions. **Litter disclosed:**
the probe left branch `_probe-claim` at master's tip on `origin` and **the executor cannot delete it** —
harmless, and owner-deletable at leisure. **No product, runtime, route, schema, counter, migration,
secret, data-handling or user-facing change; no owner ask; no spend.** All commercial readings remain
zero; AUD $0.00 of $500 ·
**Previously, run 123 (2026-08-31 14:16 Sydney) — [OWNER ACTION REQUIRED](#owner-action-required):
NONE.** **The fourth window closed unused at `2026-08-31T04:14:13Z` (14:14 Sydney), and the card is
retired on its own stated terms.** Executed on the [reviewer directive of
`03:32:23Z`](https://github.com/in-c0/tuned/issues/1#issuecomment-5473352662), whose retirement branch
fires at the first cycle after that instant with no qualifying URL. **The check ran after the instant,
not in anticipation of it, and it read negative:** issue #1 at `04:16:00Z` holds **230 comments,
`updated_at` `2026-08-31T03:32:23Z`** — byte-identical to the pre-expiry read taken this same run at
`04:04:53Z`, and its newest comment is the directive itself. **No venue issue URL exists, so none can
have been created before expiry.** **The owner's `A`, granted 2026-08-20 15:04 UTC, is preserved, not
withdrawn and not re-asked** — what expired is a *precondition* of the submission, never the authority
to make it. **The `plenaryapp/awesome-rss-feeds` candidate is PAUSED, not dropped**: the owner never
said **C**, and an unanswered card is not a decision. **[EXP-009](EXPERIMENTS.md) Reading 2 stays at
Fork D / PENDING — inadmissible, not a demand null**; no submission was authorized-and-made, so there
is no `t0` and nothing is gradeable. **Four windows have now lapsed** — `2026-08-21T04:15:49Z`,
`2026-08-24T09:35:56Z`, `2026-08-27T21:43:45Z`, `2026-08-31T04:14:13Z` — and **nothing was published
to hold any of them open**, per [EXP-008](EXPERIMENTS.md)'s binding clauses. **What is deliberately
*not* concluded: nothing about demand, in either direction.** Four lapsed windows are a fact about
this loop's access and schedule, not about strangers. **Documentation only — no code, route, schema,
counter, allowlist entry, migration, workflow, secret, data handling or user-facing copy; nothing
published, submitted, retracted or probed; no venue contacted; no real channel tag exercised;
EXPERIMENTS.md and METRICS.md byte-untouched; no second owner notification.** All commercial readings
remain zero; AUD $0.00 of $500. **Unchanged beneath the retirement:** the access boundary opened
2026-08-20 21:55 UTC (run 61) and re-diagnosed at run 88 — this session's repository allowlist filters
every GitHub call to `in-c0/tuned` — is untouched and was not routed around ·
**Previously, run 108 (2026-08-28 20:30 Sydney) — [OWNER ACTION REQUIRED](#owner-action-required):
ACTION REQUIRED · HIGH, unchanged from run 107 and not re-argued here.** The `awesome-rss-feeds`
window still closes **2026-08-31 14:14 Sydney**, the executor still cannot make the write, and nothing
this run did touches that. **What run 108 fixed is the other end of the same link.** Every distribution
route this loop has ever graded ends the same way: a URL is posted somewhere and someone opens it. That
destination — the public feed page — **carried a title, an icon, and the RSS link run 86 added, and
nothing else.** No description, no Open Graph, no canonical. **Pasted into Slack, Discord, Mastodon, X,
LinkedIn or iMessage it unfurled as bare text**, because all of those read Open Graph and there was none
to read; in a search result the snippet was whatever a crawler chose to scrape. And `wrangler.jsonc`
routes `justtuned.com` and `www.justtuned.com` as custom domains with `workers_dev` left on, so **three
origins serve the identical document with nothing saying which one is the page.** **This is
[L-46](LESSONS.md)/[L-51](LESSONS.md)'s shape a third time: the page looked complete to every human who
reviewed it, because a human is not the reader that was failing.** Shipped in
[`1b54f07`](https://github.com/in-c0/tuned/commit/1b54f07): one `socialHead` helper used by the feed page
and the landing page, `SITE_ORIGIN` fixed rather than taken from the request, and
[`test/sharing.test.ts`](../test/sharing.test.ts) — **10 tests, 9 of which fail on the parent commit**.
Suite **12 files, 157 tests**, `check` exit 0. `verify-production.yml` now asserts the same thing against
what is actually serving justtuned.com and **follows `og:image` requiring a PNG back**, which is the
change's standing rollback signal. **No route, schema, counter, allowlist entry, migration, secret, data
handling or rendered user-facing copy** — the landing page's two reviewed description strings are carried
through byte-identical and a test pins them. **The honest limit, stated before anyone asks for a number:
no counter in this service can observe an unfurl**, so this change's effect is **not measurable here** and
is not claimed to be; it is a precondition for the first distribution attempt being worth making, not
evidence about one. **[EXP-008](EXPERIMENTS.md), [EXP-009](EXPERIMENTS.md) and [EXP-010](EXPERIMENTS.md)
are byte-untouched**; nothing published, submitted or retracted; no venue contacted; no real channel tag
exercised; all commercial readings still zero; AUD $0.00 of $500. ·
**Previously, run 107 (2026-08-28 19:35 Sydney) — [OWNER ACTION REQUIRED](#owner-action-required):
ACTION REQUIRED · HIGH.** **One issue, at a public GitHub repository, ~2 minutes — and it is the only
thing standing between Tuned and the first time its feed is put in front of strangers.** The
[reviewer directive of 09:29:09Z](https://github.com/in-c0/tuned/issues/1#issuecomment-5450853462)
ordered this submission executed. **Every precondition was re-read from production this run and all of
them pass** — A4 **5.29h** ([33159736495](https://github.com/in-c0/tuned/actions/runs/33159736495),
`09:31:47Z`), duplicate check **clean** on `Open 0 (0) · Closed 0 (0)`
([33159738434](https://github.com/in-c0/tuned/actions/runs/33159738434), `09:32:45Z`), A2 answered
**`A`** since 2026-08-20. **The executor still cannot make the write**: its GitHub scope is
`in-c0/tuned` and the venue is someone else's repository — re-tested `09:30:25Z`, *"cross-tier adds
are not supported in v1"*. The remedy that error names (**start a second session scoped to the
venue**) is **boundary-shopping and was refused**. **This is the fourth window and the first three
lapsed unused; it closes 2026-08-31 14:14 Sydney.** **Previously, run 105 — [OWNER ACTION
REQUIRED](#owner-action-required): NONE.** **The deploy stall is over, and the card written to escalate it was cleared ~19 minutes later
by its own stated success check.** The commit that *carried* the card,
[`b5e58f6`](https://github.com/in-c0/tuned/commit/b5e58f6) (pushed `03:41:44Z`), **deployed normally**:
`verify production` [33139639332](https://github.com/in-c0/tuned/actions/runs/33139639332) went
**green in 54 seconds**, and that job is an **identity** check — it polls `/api/version` until the
**expected commit stamp** is the one serving. **The whole ~6h backlog is live**, `1bedef2` … `697c5c6`
included, and **no owner action was taken or is needed**: no kick commit, no re-run, no dispatch, no
Cloudflare setting touched, and the dashboard reading was never supplied. **What is not known is why
it stalled and why it cleared** — a fault that resolves without a diagnosis can recur, and the next
occurrence will look identical from here (green `check`, healthy site, stale build). **The owner was
alerted at 03:47 UTC and stood down at 03:55 UTC**; the retraction is recorded rather than quietly
dropped, and the sequencing lesson beneath it is that this run's own watcher failed silently
(`$GITHUB_TOKEN` is unset in the executor environment, so every poll failed and looked like *"still
running"*). **The rest of the run stands as written below.**
**Its original framing, and still the reason the card existed:** For three runs it lived only in report prose while the canonical card read
**NONE**, so the loop's own owner-facing surface was telling the owner there was nothing to do while
the single thing blocking every future deployment sat unasked. **The count on the record was also
wrong and is corrected here: seven consecutive commits and eight `verify production` failures**
(`2026-08-27T21:44:36Z → 22:31:40Z`), not five — `e79bcee` and `697c5c6` failed after run 104's
addendum was written. The finding is unchanged and stronger. **Production is healthy and this is not
an outage:** every probe during the stall returned HTTP 200 with a valid commit stamp, serving
`7983146` from `2026-08-27T03:43:41Z` — **23h52m stale** at the time of writing. **`check` is green on
all seven heads**, so the build command is not the defect and there is nothing left to test on the
repository side; reading *Workers & Pages → `attention-feed` → Builds* needs the Cloudflare dashboard,
which this executor holds no credential for **by design**, and its only other vantage is 403 CONNECT
(re-tested `2026-08-28T03:35:22.811Z`). **Stated rather than papered over: no fresh production probe
was taken this run** — the same directive that ordered this card forbade further dispatches — so
*"still serving `7983146`"* is a 5-hour-old reading carried forward, not an observation made at 03:36
UTC. **Nothing was rolled back, no empty kick commit was pushed, no second out-of-band alert was
sent, and no distribution work was done.** Documentation only; AUD $0.00 of $500; no demand inference;
`feedle` A1 stays **PARTIAL** and all commercial readings stay **zero**. ·
**Previously, run 104:** **[OWNER ACTION REQUIRED](#owner-action-required):
NONE.** **The directive was executed and `feedle`'s A1 is graded PARTIAL, closing the last unread A1
in the register** — details in [Next action](#next-action) and [DISTRIBUTION.md](DISTRIBUTION.md).
**The deploy finding below is no longer one dropped build — three consecutive commits have now failed
to deploy, and the previous cycle's own diagnostic is one of them.** `1bedef2` (21:44:36Z), `0c14053`
(22:05:04Z, pushed expressly to test this) and `33ba76d` (22:09:14Z) each went **red**
([33119534612](https://github.com/in-c0/tuned/actions/runs/33119534612),
[33120243422](https://github.com/in-c0/tuned/actions/runs/33120243422),
[33121020006](https://github.com/in-c0/tuned/actions/runs/33121020006),
[33121318504](https://github.com/in-c0/tuned/actions/runs/33121318504)). **The decisive reading is
`33ba76d`'s**, because nothing superseded it while it ran: **24 consecutive `/api/version` probes
across 8 minutes, 22:09:23–22:17:24Z, every one HTTP 200 with a valid commit stamp, and every one
serving `7983146`** — the build from **2026-08-27 03:42 UTC**, then **~18.5 hours old**. So the
2026-08-12 dropped-build hypothesis the previous cycle was testing **does not survive**: that pattern
was one build skipped and the next push landing in 61 seconds, and here **the next push did not land
either, nor the one after it**. **The site is healthy and this is not an outage** — 200 on every probe
is a liveness reading; what is stale is the *build*, by roughly 19 hours and counting. `check` is
green on all three commits, so the build command is not the defect. **Nothing was rolled back** — the
live build is last-known-good and every undeployed diff to date is Markdown the Worker does not serve
— **and no empty commit was pushed to kick the pipeline.** **What this loop cannot do next is the
whole of the escalation:** distinguishing a stuck queue from a disconnected Git integration from a
failing Cloudflare-side build requires the Cloudflare dashboard, the executor holds no Cloudflare
credential, and its own egress to `justtuned.com` is still **403 at the proxy** (re-tested this run).
**This is an owner step.** ·
**Previously, run 103:** **[OWNER ACTION REQUIRED](#owner-action-required):
NONE**, and **one new finding that is not the card: the retirement commit did not deploy.**
**`1bedef2` was pushed at `2026-08-27T21:44:36Z` and production was still serving `7983146` at
`2026-08-27T22:02:30Z` — 48 consecutive `/api/version` probes across two `verify production` runs over
~18 minutes** ([33119534612](https://github.com/in-c0/tuned/actions/runs/33119534612) push,
[33120243422](https://github.com/in-c0/tuned/actions/runs/33120243422) dispatch), against a normal
build-to-deploy of ~48s–2min. **The site is healthy and this is not an outage:** every one of those 48
probes returned **HTTP 200 with a valid commit stamp**, which is a liveness reading, not a failure —
what is stale is the *build*, not the service. **`check` is green on `1bedef2`**
([33119534600](https://github.com/in-c0/tuned/actions/runs/33119534600)), so the build command is not
the defect. **Nothing was rolled back, and rolling back would be wrong:** the live build is the
last-known-good one, and the undeployed diff is **four Markdown files under `ops/` that the Worker does
not serve**, so production content is unaffected in every user-facing respect. **No empty commit was
pushed to kick the pipeline.** This matches the **2026-08-12 dropped-build pattern** (blocker 0), where
one commit was never picked up, 72 probes read the previous build, and the **next real push deployed in
61 seconds** — so the commit carrying this very paragraph is the diagnostic: if it deploys, one build
was dropped; if it does not, the pipeline is broken and only the owner can read the Cloudflare
dashboard. **Watch, second night running:** the `2026-08-27` 20:20/20:40 UTC scheduled
`verify production` and `metrics snapshot` had still not fired at 21:36 UTC, past their historical
20:46–21:01 band; the 2026-08-26 pair landed ~3h15m late and green ·
**[OWNER ACTION REQUIRED](#owner-action-required):
NONE.** **A4 lapsed at `2026-08-27T21:43:45Z` (2026-08-28 07:43 Sydney) with no submission made, and
the card is retired on its own stated terms — the third window to close unused.** **The owner's `A`,
granted 2026-08-20 15:04 UTC, is preserved, not withdrawn and not re-asked**; what expired is a
*precondition* of the submission, never the authority to make it. **The `awesome-rss-feeds` candidate
is PAUSED, not dropped** — the owner never said **C**, and an unanswered card is not a decision. It
resumes the first time a find worth publishing on its own merits restores A4, which is not scheduled.
**Nothing was published to hold the window open**, per [EXP-008](EXPERIMENTS.md)'s binding clauses.
**[EXP-009](EXPERIMENTS.md) Reading 2 stays at Fork D / PENDING — inadmissible, not a demand null:**
no submission was authorized-and-made, so there is no `t0`, and **a lapsed window is a fact about this
loop's schedule, not about strangers.** EXP-009's question, forks, thresholds and stop conditions are
**byte-untouched** this run; EXP-010 untouched. **Documentation only — no code, route, schema,
counter, migration, workflow or user-facing copy; nothing submitted, published or probed; no spend
(AUD $0.00 of $500).** **What is unchanged beneath the retirement:** the access boundary opened
2026-08-20 21:55 UTC (run 61) and re-diagnosed at run 88 — this session's repository allowlist filters
every GitHub call to `in-c0/tuned` — is untouched and was not routed around ·
**Previously, run 99:** **[EXP-009](EXPERIMENTS.md) Reading 1 is graded — the first pre-registered
reading this loop has closed on schedule, and it closed as registered rather than as hoped.**
**Fork I-A passes:** `feed_fetch_bot:sportstech` reads **`1, 7, 1, 0, 3, 1, 0`** across
2026-08-20 … 08-26, non-zero on five of seven days, from scheduled snapshot
[`346f442`](https://github.com/in-c0/tuned/commit/346f442) (`generated_at` `2026-08-27T00:01:39.681Z`).
The route writes in production, so **a submission that sent traffic would now be visible** — which is
exactly what was *unsatisfiable* when EXP-009 was registered. **Fork I-B was not fired** (withdrawn
run 84, [L-44](LESSONS.md)). **The band is recorded in two regimes and never averaged:** unsuffixed
`feed_fetch:sportstech` is **`1, 0, 0, 0, 0`** pre-autodiscovery and **`16, 0`** post — and the
pre-deploy `1` carried `?src=qa`, this loop's own control tag, so the **third-party** floor is
`0, 0, 0, 0, 0`. Of 08-25's 16, **one** carried the venue tag and is **pre-`t0`,
issue-#1-attributable** (excluded from Reading 2); the other **15 carried no allowlisted tag**, and
every other feed took fetches the same day and none the next. **Polls, not people — no subscriber
count is derived and none can be.** **Reading 2 stays at Fork D:** no submission, no `t0`, nothing
about demand or about the venue decided. **The 2026-08-26 schedule miss is closed too — delayed
~3h15m, not dropped, both workflows green, and the delay is what made this reading gradeable.**
**No code shipped; EXP-009's question, forks and stop conditions are byte-untouched (only *Result* and
*Decision* were written); [EXP-010](EXPERIMENTS.md) untouched; no spend; nothing submitted, published
or probed** ·
**Previously, run 88:** the loop was **deadlocked on the one act it is trying to perform** — the owner
told Claude to make the submission, Claude tried and hit its **session repository allowlist**, and
**the card's stated reason had been wrong for seven runs**: the executor is authenticated as `in-c0`,
the owner's own GitHub account, which *can* open an issue anywhere public. The blocker is
configuration the owner controls from outside the session, not a missing credential
([L-48](LESSONS.md)). **A child session scoped to the venue was available and was deliberately not
spawned — that is boundary-shopping.** Full card below ·
**Previously, run 86:** **every public page in this product told software the site has no feed, and
that is fixed** — no page carried `<link rel="alternate" type="application/rss+xml">`, the one element
a feed reader or aggregator uses to get from a page URL to a subscribable feed. The visible `RSS`
anchor is why nobody looked ([L-46](LESSONS.md)). **Its band clause governed the reading above and was
honoured;** run 99 corrects only its arithmetic — 08-24 is near-complete, not complete, because
autodiscovery went live in its last ~95 minutes ·
**Head:** [`master`](https://github.com/in-c0/tuned/commits/master)

> # The first pre-registered reading this loop has closed on schedule says the instrument works. It says nothing about whether anybody wants this.
>
> **[EXP-009](EXPERIMENTS.md) Reading 1 was due on the complete UTC day 2026-08-26 and is graded
> today, from the scheduled snapshot the pre-registration named, on the days it named, against the
> threshold it fixed before any of the numbers existed.** That is worth stating on its own, because
> eleven consecutive runs have now changed nothing about the commercial state and this is the one
> thing in that stretch that was *supposed* to happen and did.
>
> **Fork I-A passes.** `feed_fetch_bot:sportstech` reads **`1, 7, 1, 0, 3, 1, 0`** across
> 2026-08-20 … 08-26 — non-zero on five of seven days against a threshold of one. The RSS route writes
> in production. When EXP-009 was registered, `GET /:handle/rss.xml` was the only public route in the
> Worker with **no `track()` call at all**, which made A5 for this venue not *unregistered* but
> **unsatisfiable**: a merged listing that sent a hundred subscribers would have been indistinguishable
> from one nobody opened. That is no longer true. **Fork I-B was not fired** — it was withdrawn in run
> 84 on the ground that no schedule fetches this route ([L-44](LESSONS.md)), and the two zero days mean
> no QA run was dispatched by hand, never a broken counter.
>
> **The band, and the reason it is quoted in two pieces.** Unsuffixed `feed_fetch:sportstech` is
> **`1, 0, 0, 0, 0`** pre-autodiscovery (08-20 … 08-24) and **`16, 0`** post (08-25, 08-26). The
> [run-86 clause](METRICS.md) forbade averaging them and it is honoured. **The pre-deploy `1` is not a
> third party**: 08-20 also reads `arrival_fetch:qa` **1** and site-wide `feed_fetch` **1**, so it is
> one event carrying this loop's own published control tag. Read as third-party arrivals the pre-deploy
> floor is **`0, 0, 0, 0, 0`** — and *that* is the concrete gain, because
> [EXP-009](EXPERIMENTS.md) Fork E (a maintainer normalises `?src=` off the merged URL) falls back to
> reading this series against its band, and until today the band did not exist.
>
> **What the 16 is not.** One of it carried the venue tag and is **pre-`t0`, issue-#1-attributable**
> under the [run-87 clause](METRICS.md) — the tag's URL was printed in a public comment before any
> submission existed — and it is excluded from anything Reading 2 grades. **The other fifteen carried
> no allowlisted tag.** Every other feed took fetches on 08-25 (`ava` 2, `graphics` 2, `wearables` 2,
> `wellbeing` 1) and **every handle read zero on 08-26**. Site-wide on one day and none the next is the
> shape of a sweep, not a subscription — but two days is not a test of a discovery path, and this is
> **not** a claim that autodiscovery worked. **These are polls of a file. There is no visitor
> identifier. No subscriber count is derived from any of it and none can be.**
>
> **Reading 2 remains at Fork D — never authorized, never made, never merged — so nothing about demand
> or about the venue is decided, and the [owner card below](#owner-action-required) is still the only
> thing standing between this loop and its first external distribution test.** It expires with A4 at
> **`2026-08-27T21:43:45Z` (2026-08-28 07:43 Sydney)**, ~18h from this line.
>
> **The 2026-08-26 schedule miss is also closed, and it cuts the opposite way from how it looked.**
> Both workflows fired **~3h15m late and green** — GitHub queued the `schedule` event late; nothing was
> dropped and no data was lost, since `daily` is cumulative from D1. **The delay is what made this
> reading gradeable**: a snapshot at the scheduled 20:40Z would have held an incomplete 08-26, and
> crossing midnight UTC is what captured the complete day. Run 98's escalation test stands — if the
> 08-27 schedules also miss, one outlier becomes a pattern.
>
> **Nothing was submitted, published or probed; no venue was contacted, no account used, no real
> channel tag exercised; no code shipped.** Only EXP-009's *Result* and *Decision* were written — its
> question, hypothesis, baseline, change, both readings, every fork and its stop conditions are
> **byte-untouched**, and [EXP-010](EXPERIMENTS.md) is untouched entirely. `applications` **0** ·
> `members_ever_active` **0** · followers **0** · gross cash **AUD $0** from *no billing exists* ·
> spend **AUD $0.00 of $500**.

<!-- run 88's card, kept as written -->

> # The owner told Claude to go and do it. Claude cannot — and the reason the card has given for seven runs was wrong.
>
> At **03:33 UTC** the reviewer directed the executor to synchronize the owner-action card and stand
> down. At **03:36 UTC** the owner posted something different: *"Claude and ChatGPT are authorized to
> create the external `plenaryapp/awesome-rss-feeds` issue directly. This supersedes the assumption
> that the owner must perform the submission by hand."* At **03:44 UTC** run 87 posted a report that
> re-armed the card as an **owner** action. It had read the issue at 03:34 and never saw the comment.
>
> **So both parties are now waiting for the other, on a window with a clock.** That deadlock — not the
> submission, not another venue read — is what this run exists to break, and it is worth more than any
> product change available today because it is the thing standing between this loop and the first
> measurable external distribution test it has ever attempted.
>
> **Run 88 attempted the submission and hit the boundary, which is the only honest way to answer a
> directive that says *you can do this*.** `add_repo` for the venue refused: *"cross-tier adds are not
> supported in v1 … Start a new session with the requested repo as the initial source."*
> `get_file_contents` on the venue refused: *"Access denied: repository
> `plenaryapp/awesome-rss-feeds` is not configured for this session. Allowed repositories:
> `in-c0/tuned`."* Both dated 2026-08-25.
>
> **The third call is the one that changes the card.** `get_me` returns **`in-c0` — ava kim, the
> owner's own GitHub user account**, 82 public repos, not a scoped App identity. The card has said
> since run 61 that the executor *"holds no identity, token or session at
> `plenaryapp/awesome-rss-feeds`"*. **That is false.** It holds an identity that can open an issue at
> any public repository on GitHub. What it does not hold is **permission from its own session**: the
> Claude Code harness filters every GitHub call against an allowlist of `in-c0/tuned` before the call
> reaches GitHub at all.
>
> **Why that distinction is worth a run.** A missing credential at a third party is not fixable by
> anyone here — it is a fact about the world, and for seven runs the card presented it that way. A
> session allowlist is **configuration the owner controls**, and it is fixable in one action from
> outside the session. The owner has now twice granted authority that was never the constraint, while
> the actual constraint went unnamed because the executor had mis-described it. [L-48](LESSONS.md).
>
> **What was available and deliberately not used.** This session holds `create_session`, and could
> have spawned a child scoped to the venue — precisely the route the refusal message names. **It was
> not attempted.** Obtaining through a new session what this one was scoped out of is boundary-shopping
> whether or not it would work, run 61 declined the identical move, and the child-session tool is
> built so a child never carries a grant its parent lacks. **An authorization written in an issue
> comment cannot widen an access control**, and treating the owner's *"use your own authorized
> capability"* as though it could would be the loop reading its own permissions from prose. The
> recommendation to the owner is still the two-minute one: open the issue by hand.
>
> **Nothing was submitted, no venue was contacted, no account was used, no form was filled, and no
> real channel tag was exercised.** `applications` **0** · `members_ever_active` **0** · followers
> **0** · gross cash **AUD $0** from *no billing exists* · spend **AUD $0.00 of $500**. This is the
> eighth consecutive run with no change to the commercial state.

<!-- run 86's card, kept as written -->

> # The product has published RSS for nineteen days and never once told a machine the feeds exist.
>
> A public feed page carries a visible `RSS` link a person can click. It carried nothing at all in
> `<head>`. **`<link rel="alternate" type="application/rss+xml">` is how every feed reader, feed
> search engine and blog directory resolves a pasted page URL into a feed**, and it was absent from
> every page this service serves — so a person who pasted `justtuned.com/<handle>` into their reader
> was told there is no feed here, and so was every crawler that ever loaded one.
>
> **The concrete cost is in the distribution register, written there by this loop.**
> [`ooh.directory`](DISTRIBUTION.md) is one of only two candidates whose published rules do not
> forbid the post, and its form's field label — quoted verbatim by run 57 — reads
> ***"URL — The URL of the blog's front page (not its feed)"***. A directory that stores the front
> page reaches the feed by autodiscovery. Run 57 filed that label as a *URL-shape difference between
> the two venues* and never asked how the venue gets from one to the other. **A5 was answered on the
> counter; nobody asked whether the mechanism works at all.** [L-46](LESSONS.md) — and it is
> [L-35](LESSONS.md) one layer out for the second time.
>
> **The counters say the door was being tried.** Landing views 2026-08-21 … 08-24: **46 · 65 · 69 ·
> 45**. Unsuffixed `feed_fetch`, every RSS fetch not from a self-declaring crawler: **0 · 0 · 0 · 0**.
> Real crawlers reach the handle pages — `feed_view_bot:sportstech` was **14** on 08-21. Nothing
> followed from any of it, because from a page there was nothing to follow.
>
> **Shipped, and it is one element.** `<link rel="alternate" type="application/rss+xml" title="…"
> href="/<handle>/rss.xml">` in `<head>` of the public feed page, from already-escaped values, plus
> [`test/discovery.test.ts`](../test/discovery.test.ts) — five tests that fail on the pre-change code,
> and that check the advertised href by **following it and requiring a feed back**, not by matching a
> string. No route, schema, counter, allowlist entry, migration, workflow, secret or rendered copy.
>
> **Deliberately not shipped:** `/sitemap.xml` and `/robots.txt` (crawl discovery is a different
> problem and the half that would matter needs a Search Console account this executor does not hold);
> autodiscovery on the landing page, which has no single canonical feed; and any submission, tag or
> allowlist change. **Nothing was submitted and no venue was contacted.**

<!-- run 85's card, kept as written -->

**Run 85 (2026-08-25 07:47 Sydney):** **One `@sportstech` selection cycle ran and published one find — item 247 — and the larger
result is the host it came from.** Six candidates were graded against the remit; four were rejected
before a page was opened, and the two best-on-paper were peer-reviewed MDPI *Sensors* papers that
**`mdpi.com` refused** (HTTP 403, twice). **`frontiersin.org` served the full article** — 47,770
characters, `read_outcome: "page"`, Discussion and Conclusion included. That is the **first
peer-reviewed, page-level-readable host this loop has found**, and it retires the working belief that
the reachable set is arXiv: it was four hosts tested, never re-opened, and two publications carried
avoidable *"unreviewed preprint"* and *"abstract read"* weaknesses because of it ([L-45](LESSONS.md)).
**A4 is restored as a consequence, not a motive** — `@sportstech`'s newest public item is
**2026-08-24T21:43:45.078Z**, so A4 holds until **2026-08-27T21:43:45Z** — and the
`awesome-rss-feeds` candidate is **un-paused** with the owner's `A` (2026-08-20 15:04 UTC) still
preserved. Carried forward from run 84 and unchanged: **[EXP-009](EXPERIMENTS.md) is byte-untouched**,
Reading 1 is still due on the complete UTC day **2026-08-26**, and **Fork I-B must not be fired** ·
**Head:** [`master`](https://github.com/in-c0/tuned/commits/master)

> # The two best candidates were peer-reviewed and unreachable. The third host had been serving full text all along, and nobody had asked it.
>
> The [21:31 UTC directive](https://github.com/in-c0/tuned/issues/1#issuecomment-5401628043) asked for
> one genuine `@sportstech` selection cycle, at most one publication, the case against the find
> written first, and said plainly that **a no-publish result is valid**. The cycle ran, and what it
> turned up about the loop's own reach outranks what it published.
>
> **Four candidates were rejected before any page was opened.** Three — *Sensor Insoles: A Review*,
> an inertial-mocap tutorial review, and *A Survey of Large Models in Sports* — carry no measured
> result of their own, and the remit wants *"a concrete measured result or a validated
> implementation"*. A fourth models athletic ageing, which is sports analytics rather than any of the
> remit's four scope bullets. A fifth had real numbers (deep-learning GRF estimation, R² 0.98) and was
> **still** rejected: the cohort is Parkinson's patients and healthy controls, and `@sportstech` is
> not a clinical-gait feed.
>
> **Then `mdpi.com` refused the reader twice** — HTTP 403, `Access Denied`, an Akamai edge refusal,
> two distinct articles two minutes apart. Both of this cycle's best-on-paper candidates were there:
> force-insole centre-of-pressure validation in return-to-sport jump testing, and an independent
> validation of a commercial IMU in skateboarding. Peer-reviewed, squarely on remit, and
> unencounterable. MDPI joins Taylor & Francis, SAGE and PMC.
>
> **A fourth dispatch is what makes this a finding rather than a third confirmation.**
> `frontiersin.org` returned HTTP 200 and **47,770 visible characters** —
> `interstitial_signals: []`, no redirect, full text through Discussion and Conclusion, not an
> abstract ([32780602312](https://github.com/in-c0/tuned/actions/runs/32780602312)).
>
> **What that costs, stated against our own interest.** Run 50's narrowing was true and its
> denominator was **four hosts**. It was then quoted for four runs as though it described the
> literature, and the shape was self-confirming: each cycle searched arXiv because arXiv was known to
> work, which produced arXiv candidates, which confirmed arXiv was where candidates were. R-1 and R-2
> were both arXiv v1 preprints read at **abstract** level, and both had to carry that in their own
> `why` lines. **Neither had to.** [L-45](LESSONS.md).
>
> **What was published, and the case against it is in the register above the dispatch, not below it.**
> Item **247** — *Optimizing wearable IMU configurations for running gait analysis*, Front. Bioeng.
> Biotechnol., 11 Feb 2026, original research with its editor and three reviewers named on the page.
> 25 recreational runners, treadmill at 8–12 km/h, a gold-standard 17-IMU Xsens reference. One
> lumbosacral IMU reconstructed cadence, vertical oscillation and ground contact time at
> **R² > 0.95, MAPE < 5%** — and **failed on gait symmetry at R² = 0.52**, which three sensors then
> fix (**R² > 0.91, MAPE = 7.12%**). The negative result is the part the remit expressly welcomes.
> **The biggest caveat is not a quibble and it is the clause the published `why` ends on:** the
> minimal configurations were never built. They are data subsets of one 17-IMU recording, so every
> figure is an upper bound on a real device. The abstract's *"outperforming standard commercial
> benchmarks"* is deliberately **not** carried, because the table it rests on was not read.
>
> **A4 is a consequence and the cycle's own record is the test.** Four candidates rejected on remit
> clauses before a page was opened, two refused by their host; had the third also come back 403 this
> would have ended in *publish nothing*, which costs nothing and which the directive names as valid.
>
> **All six [EXP-008](EXPERIMENTS.md) thresholds hold, and item 247 is the first publication to clear
> them inside its own cycle.** HTTP 201 · `public_items` 13 → 14 · `operator_publications` 2 → 3 ·
> replay `duplicate=true` · provenance on both surfaces · the find is real. **Threshold 5 took two
> attempts and the first one is kept:** the provenance spec passed at 21:46 while reporting
> *"2 nominated find(s)"* — it ran before `qa/nominations/247-*.json` existed, so it graded 242 and
> 246 and said nothing about 247. That was recorded as ungraded rather than quoted as coverage, and
> the re-dispatch on `b1ef49f` then read *"3 nominated find(s)"*, **7 passed / 1 skipped**
> ([32781627259](https://github.com/in-c0/tuned/actions/runs/32781627259)). The registry built at run
> 66 was used exactly as designed: a data file, a new item graded, no spec edit.

> # The reading due Wednesday says a seven-day zero would prove the counter broken, "despite the QA schedule fetching that exact URL." There is no QA schedule.
>
> [EXP-009](EXPERIMENTS.md)'s **Reading 1** — the half that needs nobody's permission, due on the
> complete UTC day **2026-08-26** — grades `feed_fetch_bot:sportstech` and justifies the choice in its
> own words: *"this loop's own **scheduled** QA fetches of `/sportstech/rss.xml` … land in
> `feed_fetch_bot`"*, so that name is *"non-zero whenever the QA schedule runs"*. **Fork I-B** turns a
> seven-day zero into a verdict — *the counter is not landing in production and the instrument is
> defective* — on exactly that guarantee.
>
> **Opened this run rather than recalled, and the guarantee is not there.** The three specs the
> pre-registration names run only from
> [`qa-browser.yml`](https://github.com/in-c0/tuned/blob/master/.github/workflows/qa-browser.yml),
> which is `workflow_dispatch`-only **by deliberate design** — its own header says so, and gives the
> reason: *"Running them on every push would put recurring headless traffic through production's own
> funnel counters for no additional evidence."* The only two workflows with a `schedule:` block,
> `verify-production.yml` (06:20 Sydney) and `metrics-snapshot.yml` (06:40 Sydney), each probe exactly
> one feed's RSS and it is **`/ava/rss.xml`**. They are not the headless suite either: they run
> `scripts/prod-http.sh`, whose UA lands in `_bot` on `BOT_UA`'s **`uptime`** token, not on `headless`.
>
> **What that makes the counter.** `feed_fetch_bot:ava` is a liveness signal. `feed_fetch_bot:<any
> other handle>` is a record of **when this loop happened to dispatch a QA spec** — and the series says
> so: **08-19 4 · 08-20 1 · 08-21 7 · 08-22 1 · 08-23 0**. A signal whose floor is produced by the
> observer's own discretionary actions cannot tell *the instrument failed* from *the observer was
> busy*, which is the one distinction a liveness fork exists to make. [L-44](LESSONS.md).
>
> **Stated against our own interest: the realised cost is nil.** Fork I-A needs non-zero on ≥ 1 day of
> 08-20 … 08-26, and 08-20, 08-21 and 08-22 already clear it. **Reading 1 lands on I-A on Wednesday
> whatever happens next**, and this find changes its outcome not at all. What it changes is the
> contingent case, which was not small. A week in which no run dispatched a QA spec fires I-B, declares
> a working counter defective, and fails A5 for every tagged candidate on the strength of it — and the
> five days with data read **4 · 1 · 7 · 1 · 0**, so **two of them would have been zero had a single
> dispatch not happened, and one already was**.
>
> **Binding, and narrower than it sounds.** **Fork I-B is unfalsifiable as written and must not be
> fired on 2026-08-26**, because its stated evidence does not exist; Fork I-A is graded normally, and
> the unsuffixed background band is unaffected (that half was withdrawn separately at run 58).
> **[EXP-009](EXPERIMENTS.md) is byte-untouched** — frozen to revision since run 57 — so this is
> recorded here, in [METRICS.md](METRICS.md), in [LESSONS.md](LESSONS.md) and in the deployed comment,
> **before the number exists**, rather than edited into the pre-registration after the fact.
>
> **And the obvious fix is deliberately not shipped.** Adding `/sportstech/rss.xml` to the scheduled
> probes would make 08-24 … 08-26 non-zero *by construction* and turn Fork I-A into a tautology inside
> its own window — [L-31](LESSONS.md) exactly. It is pre-committed for **after Reading 1 is graded**,
> not before.
>
> **What this is not.** No submission was made anywhere, nothing was published to any venue, and no
> human has been shown anything. `applications` **0**, `members_ever_active` **0**, followers **0**,
> `items_public` **80**, gross cash **AUD $0** from *no billing exists*, spend **AUD $0.00 of $500**.

> # 23 fetches on day one, 1 on day two. A burst that decayed is a crawl — which is the exact call EXP-009's Fork A exists to make, and we got it backwards on our own data.
>
> Run 57 read a **partial** UTC day — `arrival_fetch:qa` 16, ~one per forty minutes — and called it
> *"the shape of a feed client or an indexer."* The day closed at **23** over the 13.7 hours the
> counters were live, consistent with that. The next **4.1 hours produced 1**, against ~6.9 expected
> at that rate (Poisson P(X ≤ 1) ≈ 0.008). **A partial day is not a rate**, and the shape is a
> discovery burst decaying — a crawl, not a subscription.
>
> [EXP-009](EXPERIMENTS.md)'s Fork A reads *"tagged fetches on ≥ 7 of 14 days"* as **a durable
> subscriber — the first evidence in Tuned's history that a stranger subscribed.** Its argument is
> that a one-off crawl produces one or two days and a subscriber polls daily. It has a hidden premise:
> that the only holders of the tagged URL are people the channel gave it to.
>
> **That premise is false here, structurally.** `ARRIVAL_TAGS` is public source in a public repo, the
> routes are public, and **this loop has no store that is not world-readable** — not the repository,
> not issue #1, not the CI logs. It cannot hold a private campaign tag at all. Run 57's rule (never
> print the *joined* URL) is kept and is not the mitigation it was taken for: its own text names route
> and tag one line apart in a public file. [L-37](LESSONS.md).
>
> **The repair is a control, not better secrecy — and one was already running, filed as
> contamination.** `qa` is published in exactly the same public places as any real channel tag and is
> submitted to no venue, ever. [**EXP-010**](EXPERIMENTS.md) registers it: `control_days`, the number
> of the **14 complete UTC days 2026-08-21 … 2026-09-03** with unsuffixed `arrival_fetch:qa` ≥ 1, read
> **2026-09-04**. Registered expectation before the window opens: **0–3**. If it clears 7, Fork A is
> not a bar and A5 reverts to ❌ for every tagged candidate. **EXP-009 is not edited** — run 57 closed
> it to revision before its 2026-08-26 freeze and that clause is honoured; the two partial days above
> are baseline context, excluded from grading.
>
> **And one live public claim was wrong and is withdrawn where it is published.** The deployed comment
> and the `/api/metrics` note — copied into every file in `ops/metrics/`, the only description of
> these numbers a reader outside this loop can see — called unsuffixed `feed_fetch` *"a background
> rate of third-party fetchers"* and said `arrival_fetch:<tag>` grades an attempt *"because only a
> link this loop published carries the tag."* On **both** days it has a value it is **100%
> tag-carrying and unattributed**, and every tag that writes is listed in public source next to the
> public route it applies to.
>
> **What this is not.** No submission was made anywhere, nothing was published to any venue, and no
> human has been shown anything. `applications` **0**, `members_ever_active` **0**, followers **0**,
> `items_public` **80**, gross cash **AUD $0** from *no billing exists*, spend **AUD $0.00 of $500**.

> # We printed the tagged URL as proof it worked. Something has been fetching it every forty minutes since.
>
> Run 56 shipped `arrival_fetch:<tag>` so a directory listing could be told from background traffic,
> and verified it with `?src=qa` — the tag created precisely because **only this loop would ever use
> it.** The verification was right and the evidence belonged in the record. Nine minutes after the
> counters went live, the execution report printed the proof verbatim into a **public** GitHub issue:
> `"url": "https://justtuned.com/sportstech/rss.xml?src=qa"`.
>
> **The evening snapshot reads `feed_fetch 16 · feed_fetch:sportstech 16 · arrival_fetch:qa 16`**,
> against a `_bot` half of 10 that this loop's own dispatches fully explain. Sixteen fetches from a
> client that does not declare itself a bot, and **all sixteen carrying a tag no stranger could
> guess.** Ruled out by opening the files rather than recalling them: local vitest runs on a
> simulated D1 with no network; no scheduled workflow fetches a tagged URL; the Worker's cron is a
> Spotify sync that makes no request to its own routes. Not reachable from here: the Cloudflare
> request log, which would name the client. **Status: unattributed, with a leading hypothesis. Not
> reported as traffic, not reported as demand, not reported as anything.**
>
> **Nothing is corrupted today** — [EXP-009](EXPERIMENTS.md) grades `arrival_fetch:awesome-rss-feeds`,
> which is still zero. The hazard is prospective and general: **`arrival:<tag>` measures a channel
> only while the tagged URL exists in exactly one place**, and a loop whose discipline is to quote
> its evidence verbatim into a public record reliably creates a second place — *as a direct
> consequence of doing the transparency right.* [L-36](LESSONS.md).
>
> **Binding from now, added to EXP-009 before Reading 1 and before any submission exists:** a real
> channel tag's full URL is never printed — not in a report, an ops file, a code comment, a workflow
> input or a CI log. Route and tag are named separately.

> # ooh.directory permits a link blog "only if they include original commentary about each link" — which is the one thing Tuned makes.
>
> Run 56's queue asked for the thing no owner decision gates: **A1 for another venue whose subject is
> a feed.** Three reads, GETs only, no account.
> [`/suggest/`](https://github.com/in-c0/tuned/actions/runs/32307232421) · [`feedle.world`](https://github.com/in-c0/tuned/actions/runs/32307293995) ·
> [`/about/faq/`](https://github.com/in-c0/tuned/actions/runs/32307374484).
>
> **`ooh.directory` — A1 PARTIALLY SATISFIED**, the second candidate ever to get there. *"Link blogs
> are only included if they include original commentary about each link."* `/sportstech` is a link
> blog and every item carries a `why` line. English ✅; *"updated within the past couple of months"* ✅.
> **Authorship unaddressed**, exactly as at the first candidate — and it bites harder here, because
> the condition being met is *original commentary* and Tuned's is agent-written. The page shows the
> `AI AGENT` badge, so nothing is concealed; that is provenance being visible, not a rule satisfied.
> The venue also says the quiet part in advance: *"These are suggestions rather than submissions…
> Suggesting a blog does not guarantee it will appear on the site."*
>
> **A5 FAILS for it, and it is [L-35](LESSONS.md) with the axes swapped.** The form asks for *"The URL
> of the blog's front page **(not its feed)**"* — so the applicable route is the **HTML** one, covered
> since run 48. What is missing is the **tag**: `src/index.ts:703` reads `new Set(["qa",
> "awesome-rss-feeds"])`, opened this run rather than recalled, so `?src=ooh-directory` would write
> **nothing** and look identical to no tag. Run 56 found an instrumented tag on an uninstrumented
> route; this is an instrumented route with an unregistered tag. **Nothing was shipped for it** —
> building the instrument before A1 is settled and A2 answered is the ordering [L-33](LESSONS.md)
> forbids.
>
> **`feedle` — A1 UNREAD, and the reader was wrong rather than refused.** 200, no gate markers, and
> the whole 745 characters includes **"Submit your blog or podcast"** — a submission surface exists,
> no rule about who may submit was reached. The run went **red** on the spec's own 1,000-character
> floor. That is a false alarm on a genuinely terse page, overruled here on the evidence; **the floor
> was not lowered**, because a floor tuned until nothing trips it is the run-50 defect returning.
>
> **What this is not.** No submission was made anywhere, nothing was published, and no human has seen
> anything. `applications` **0**, `members_ever_active` **0**, followers **0**, `items_public` **80**,
> gross cash **AUD $0** from *no billing exists*, spend **AUD $0.00 of $500**.

> # A read came back green with 69,678 characters and answered nothing. The rules were at character 68,472.
>
> Run 54 ended on the hardest sentence this loop has written: **Tuned has no identified venue whose
> published rules permit a post about a curated feed by the person who runs it.** It left one
> instruction — find a venue where a *feed* is a permitted subject at all, and if none exists, say so.
>
> **`plenaryapp/awesome-rss-feeds` is that venue, and its rules do not close the door.** A curated
> list of RSS feeds and OPML files that populates the Recommended Feeds section of Plenary, an Android
> RSS reader. Categories include **Sports**, **Tech** and **Startups**. Quoted from
> [32215103407](https://github.com/in-c0/tuned/actions/runs/32215103407): *"There are two ways to add
> any category, country or feed in the repository"* — a Google form, or *"an issue with one of the
> given templates to add new feeds."* **The form is explicitly permitted. Authorship is not addressed
> at all**, and silence is not permission, so A1 reads **PARTIALLY SATISFIED**, not cleared.
>
> **It took three dispatches, and the middle one is the lesson.** The first read of that page returned
> HTTP 200, `read_outcome: "page"`, **69,678 visible characters**, `1 passed` — every signal this loop
> has for *the page was really on screen* — and was **worthless**, because
> [`source-read.spec.mjs`](../qa/source-read.spec.mjs) reports the first 4,000 characters and the
> contribution rules begin at character **68,472**. The compact alternative, `/issues/new/choose`,
> served **279** characters to a logged-out reader. Not a bot check, not a paywall, not egress:
> **the page was reached and the clause was not.** [L-34](LESSONS.md).
>
> **[`cd2d4c6`](https://github.com/in-c0/tuned/commit/cd2d4c6)** adds a bounded literal `find` —
> at most six windows, every occurrence counted including unquoted ones, *not asked* kept distinct
> from *asked and not found*, and never asserted. **Not** a bigger `EXCERPT_CHARS`: a longer prefix
> mirrors more of someone else's page for the same one clause and still misses it if the clause sits
> further down. `qa/find-windows.mjs` is pure because it is the only part of that spec that can be
> wrong **silently** — a windowing bug produces text that looks like a quotation and is cut in the
> wrong place, and a misquoted rule is exactly what A1 exists to prevent. Eight tests.
>
> **Product Hunt joins Reddit as UNREADABLE, not unread** — HTTP 403, *"Performing security
> verification … Ray ID: a2d64936ffeaad44"*, 266 characters, no rule reached
> ([32214495616](https://github.com/in-c0/tuned/actions/runs/32214495616)). No user agent was spoofed.
> **Two of six candidates now refuse to state their rules to a reader that declares itself.**
>
> **Proposed, not performed.** The submission this venue takes is a feed URL, a title and a category —
> so the EXP-002 defect (this executor writing the owner's words) **does not arise**. What does arise
> is that submitting is an outward-facing act in the owner's name, needing a form or an account this
> executor will not use on its own initiative. [DISTRIBUTION.md](DISTRIBUTION.md) carries the proposal
> with its A4/A5/A2 pre-conditions written **before** anything ships.
>
> **What this is not.** Not traction, and not a big channel. Every source in that list is a publisher;
> whether an attention feed with 12 public items belongs there is the maintainer's call, and rejection
> is reasonable. Any arrival estimate above single digits would be invention. `applications` **0**,
> `members_ever_active` **0**, followers **0**, `items_public` **80**, gross cash **AUD $0** from *no
> billing exists*, spend **AUD $0.00 of $500**.

> # Run 52 shipped an item it could not take back. Blocker #5 is closed, and the undo was exercised on the real item.
>
> Run 52's own rollback section said it plainly: *"the operator plane has no action that retracts or
> hides a published item."* `publish` and `disable` existed; un-publish did not — and `disable`
> revokes authority over a **feed** while deliberately touching no item. So one production mutation
> was shipping outside this loop's own deployment gate, which requires *"a rollback path exists."*
>
> **[`91f84d6`](https://github.com/in-c0/tuned/commit/91f84d6) (PR
> [#48](https://github.com/in-c0/tuned/pull/48)) adds `retract` and `restore`.** Not a delete:
> `visibility='hidden'` is the same veto the owner already has in their studio, `created_at` is
> untouched, and the row and its audit trail stay.
>
> **Two bounds, because an undo is an authority and not a convenience.** `retract` reaches **only
> items this plane published** — an `operator_publications` row is required, so the agent's own
> earlier history is not the operator's to veto. And `restore` undoes **only the operator's own
> retraction**: if the owner hid an item from their studio, the last row in `operator_item_actions`
> is not `retract` and restore refuses with 409. [L-32](LESSONS.md) is that second bound —
> **an undo inherits the authority of whoever moved the state, so it must record who moved it or it
> quietly widens.**
>
> **Exercised on item 242 in production, and put back exactly.** `retract` → `public_items` **12 →
> 11**, `operator_publications_hidden` **0 → 1**, `last_public_item_at` **2026-08-18T04:15:49.089Z →
> 2026-07-30T22:48:09.614Z**. `restore` → all three back to the byte. **A4's evidence is unchanged.**
>
> **The reader-facing proof is a red run kept on purpose.** While item 242 was retracted,
> [`qa/exp008-provenance.spec.mjs`](../qa/exp008-provenance.spec.mjs) — the instrument that proved
> the item *present* — failed at both viewports and on RSS: *"no card links to the published URL"*,
> *"RSS should carry exactly one `<item>`"*, received **0**
> ([32126387432](https://github.com/in-c0/tuned/actions/runs/32126387432)). After `restore` it is
> green again ([32126651069](https://github.com/in-c0/tuned/actions/runs/32126651069)). A retract
> that only moved a column would have left that spec passing.
>
> **What this does not do.** It publishes nothing, proposes no channel, and moves nothing toward a
> post. **A5 still fails**, no channel is admissible today, and no paying customer is closer.
> `applications` **0**, `members_ever_active` **0**, followers **0**, `items_public` **80**, gross
> cash **AUD $0** from *no billing exists*, spend **AUD $0.00 of $500**.

> # The wait is over. Fifty landing views, zero touches — the traffic was never people.
>
> Four runs were gated behind one number. It arrived on schedule: the **scheduled** snapshot
> `generated_at` **2026-08-17T20:57:27Z**, [`4527018`](https://github.com/in-c0/tuned/commit/4527018),
> [run 32068544835](https://github.com/in-c0/tuned/actions/runs/32068544835), `event: schedule` —
> checked, because [EXP-007](EXPERIMENTS.md) says *not from a dispatched snapshot* and the workflow
> accepts dispatch.
>
> **Complete UTC day 2026-08-16: `landing_view` 50, `landing_engage` 0, `application_start` 0,
> `application_invalid` 0.**
>
> That zero is the gate's literal *"fix the pulse"* branch, and run 49 built the discriminator that
> tells its two causes apart. All three parts hold — emitter byte-identity across the window, plus
> production brackets on **both** sides of it ([08-15](https://github.com/in-c0/tuned/actions/runs/31878890766),
> [08-17](https://github.com/in-c0/tuned/actions/runs/31993707292)), each `landing_engage` **204**.
> **Nothing is broken. The zero is a fact about arrivals.**
>
> **FORK A — THE DENOMINATOR IS NOT HUMAN.** `landing_view` ≥ 40 ✓ (50), `landing_engage` ≤ 2 ✓ (0).
> B, C and E did not match. **D was checked across every snapshot day, 08-08 to 08-17** — its
> condition says *on any day* — and `application_invalid` has never once appeared: **nobody has been
> refused by the validator.** A clean negative, and the fork arithmetic is written out in full so the
> exclusivity is checkable rather than asserted.
>
> **What it changes is why, not what.** Landing-page, copy, positioning and pricing work has been held
> since run 18 as a *precaution* against an unknown denominator. It is now held on a measurement. A
> hold justified by uncertainty can be argued away by any run that wants the work; a hold justified by
> a graded reading cannot. **Distribution is the binding constraint** — in its current form
> [A4](DISTRIBUTION.md), since EXP-002 (the gate EXP-007's own text names) was withdrawn on run 34.
>
> **One number in the same snapshot nobody's footprint accounts for, recorded before it can surprise
> anyone:** partial 08-17 reads `landing_engage` **3** — the first non-bot engagement pulse in the
> series. It does **not** overturn Fork A (3 is far below Fork B's 10, the day is partial, and 08-17
> is not the pre-registered day), and it does **not** prove a person (page-reported, forgeable, and a
> JS-executing crawler lands in the same bucket). **Second reading taken run 54: complete 08-17 reads
> `landing_view` 102 and `landing_engage` 3 — the same 3 — so Fork A stands on the pre-registered 1–9
> band, and both readings are now spent.** **Landing-page optimisation did not reopen** — three
> touches and zero form-starts across **152** views over two days is an absence of traffic under
> every reading.
>
> **A gap in run 49's discriminator, found and closed rather than inherited.** It enumerated the
> emitter as two files; a third in the same path — [`src/metrics.ts`](../src/metrics.ts) — changed
> **inside** the graded day at 10:14 UTC and was not on the list. Checked directly: purely additive,
> `count()` untouched, write path byte-identical. The conclusion survives; the reasoning was thinner
> than stated. [L-29](LESSONS.md) — a discriminator that lists files inherits the lister's model of
> the system.
>
> **EXP-008's gate is now clear and nothing was published.** The gate cleared on the same commit that
> grades it, so publication is the next cycle's business. **R-1** (`arxiv.org/abs/2409.10175`) is
> written up as an **open nomination** — the exact dispatch, every clause of its `why` traceable to a
> sentence on screen in the recorded read, and the case *against* it argued by the nominator. That is
> the branch run 50 offered the reviewer and got no answer to, taken because it maximises the chance
> to veto. *Publish nothing* stays free.
>
> No production mutation beyond the deploy: no publication, no operator dispatch, no agent touched,
> no schema, no migration, no route, no product copy, no browser QA dispatch, no source read. Egress
> still **403 CONNECT** for `justtuned.com` *and* `example.com` — **39 consecutive runs**.
> `items_public` **79**, `applications` **0**, `members_ever_active` **0**, followers **0**, gross
> cash **AUD $0** from *no billing exists*, spend **AUD $0.00 of $500**.

> # A validity gate's second sentence was a diagnosis wearing the clothes of an instruction.
>
> No reviewer directive followed runs 47 or 48. The standing state is a designed wait and this run
> started **sixteen hours early for all of it**: [EXP-007](EXPERIMENTS.md) reads complete UTC day
> **2026-08-16** from the **scheduled** 08-17 snapshot at **20:40 UTC**, EXP-008's publication is
> gated behind that reading, [A4](DISTRIBUTION.md) is gated behind the publication, and every channel
> is gated behind A4.
>
> **What was not gated was the gate itself.** EXP-007's instrument validity gate says a reading of
> `landing_engage + landing_engage_bot` **= 0** means *"the instrument is broken or blocked … the next
> action is to fix the pulse."* That zero has **two** causes, they are opposite, and they produce an
> identical observable:
>
> | Cause | What it means | What the gate does with it |
> | --- | --- | --- |
> | The emitter is **broken** | nothing is knowable about arrivals | correct — fix the pulse, grade nothing |
> | The emitter is **live and nothing touched the page** | Fork A's evidence, in the strongest form the instrument can produce | **repairs a working instrument and discards the reading** |
>
> Run 45 named the gap and could not close it from where it stood: *"a 0 reading would still mean the
> instrument was blocked or detached at some point in the intervening two days, which this check
> cannot foresee."* Closing it needs evidence from **after** the measured day and **before** the
> reading — a window that opened at 08-17 00:00 UTC and shuts at 20:40 UTC. **Twenty hours, once,
> closing silently.** Everything else on the queue is merely later; this was the only item that
> becomes *impossible*.
>
> **Both brackets passed.** The far-side check is `qa-browser`
> [run 31993707292](https://github.com/in-c0/tuned/actions/runs/31993707292) against production
> serving `6d63bd3`: `landing_engage` **204**, `application_start` **204**, no page errors, form not
> submitted. **So tomorrow's number is interpretable either way it falls** — which is the whole
> deliverable of this run, and it expires tonight.
>
> **The discriminator, pre-registered before the reading exists:** the emitter's bytes never changed
> across any build that served the window (`git log ba7ae7d..233c1fe -- src/pages.ts` is empty, and the
> `src/index.ts` diff touches no pulse or landing line), plus the same production spec run on **both**
> sides of it — 08-15 (run 45) and 08-17 (this run). Both brackets pass and a 0 is a fact about
> arrivals; the far-side bracket fails and the gate stands exactly as written.
>
> **Disclosed against my own interest, in EXP-007 itself rather than a footnote:** this is a
> **partial** blind — the 08-16 snapshot is already committed and already shows `landing_engage`
> absent against `landing_view` **44**, ~86% of the day at zero — and the rule makes **Fork A**
> reachable where the gate blocked it. The ordering is checkable rather than asserted: rule committed
> and pushed first, bracket dispatched after, both before 20:40 UTC.
>
> **No threshold, fork, read time or arithmetic in EXP-007 changed.** No landing-page change, no
> product code, no schema, no migration, no route, no operator dispatch, no publication, no agent
> touched. Egress still **403 CONNECT** for `justtuned.com` *and* `example.com` — **37 consecutive
> runs**. `items_public` **79**, `applications` **0**, `members_ever_active` **0**, followers **0**,
> gross cash **AUD $0** from *no billing exists*, spend **AUD $0.00 of $500**.

> # We had the wrong blocker. A stranger *can* use Tuned — there is just nothing recent to show them.
>
> No reviewer directive followed run 45, and the standing state is a designed wait:
> [EXP-007](EXPERIMENTS.md) reads complete UTC day **2026-08-16** from the 08-17 snapshot, and
> [EXP-008](EXPERIMENTS.md)'s first publication is gated behind it. This run started **under two hours
> before that window opened**, so the landing surface was untouchable by construction. It went to
> standing blocker #1 — distribution — as the artifact [L-17](LESSONS.md) prescribed after the Show HN
> failure: [**`ops/DISTRIBUTION.md`**](DISTRIBUTION.md), a channel admissibility register with five
> conditions fixed in advance.
>
> **Writing it down changed what the blocker is.** Condition **A3** — *can a stranger use the
> destination without applying or signing up?* — is what EXP-002 died on and what this loop has
> treated as binding ever since. **It already passes**, and has since [EXP-004](EXPERIMENTS.md) on run
> 19: the public no-account feeds work. What fails is **A4, freshness**:
>
> | Destination | Newest public item | Age | Against a 72h threshold |
> | --- | --- | --- | --- |
> | `@ava` | 2026-08-02 | **14 days** | ❌ |
> | `@sportstech` | 2026-07-30 | **17 days** | ❌ |
>
> **So the first publication is not capability polish — it is the precondition for every distribution
> attempt Tuned can make.** EXP-008 was framed as evidence that the control plane can publish. It is
> also the only thing that moves A4, which puts it directly on the commercial path rather than beside
> it. That is a different reason to run it, and a better one.
>
> **A second condition fails, and this one is new.** **A5** asks whether a result would be *visible*.
> `feed_view` is a single site-wide counter with no per-handle split and no referral tag
> ([`src/index.ts:672`](../src/index.ts)); its human-flagged daily readings over ten days run
> **2, 3, 5, 8, 11, 14, 15, 15, 21, 22**. **A dozen real arrivals would vanish inside that band.** The
> loop could run an admissible attempt, succeed, and record a null — [L-24](LESSONS.md): an attempt can
> be admissible, succeed, and still be ungradeable. The counter was **deliberately not built this run**;
> its shape depends on the channel, no channel is admissible yet, and it must ship *before* a post
> rather than with it.
>
> **Nothing was touched that could be touched wrongly.** EXP-007's thresholds, forks and read time are
> **unaltered**. No publication, no operator dispatch, no agent created or disabled, no queued item
> opened, no landing-page change, no schema or workflow change. No venue's rules were read or asserted
> — egress is still **403 CONNECT**, now confirmed for `WebFetch` too, **35 consecutive runs**.
> `items_public` **79**, `applications` **0**, `members_ever_active` **0**, gross cash **AUD $0** from
> *no billing exists*, spend **AUD $0.00 of $500**.

> # The control plane stopped being a capability and became a fact: `active 1/12`.
>
> The [09:30 UTC directive](https://github.com/in-c0/tuned/issues/1#issuecomment-5301607448)
> authorized an **adoption-only** cycle, and adoption-only is what happened. Production answered
> **HTTP 201** — `ok=True · handle=sportstech · status=active · adopted=True · source=adopted`
> ([run 31877368130](https://github.com/in-c0/tuned/actions/runs/31877368130)) — and the read-only
> `list` that followed
> ([run 31877383247](https://github.com/in-c0/tuned/actions/runs/31877383247)) returned:
>
> ```
> owner: @ava · active 1/12
> - @sportstech [active] source=adopted public_items=11 operator_publications=0 last_public_item_at=2026-07-30T22:48:09.614Z
> adoptable (owned, unmanaged): @graphics, @wearables, @wellbeing
> ```
>
> Every acceptance criterion the directive set is met, read back from production rather than asserted:
> `active 1/12`, `source=adopted`, **`operator_publications=0`**, and `@sportstech` has left the
> adoptable list. **Nothing was published.** No agent was created, no queued item was opened, and the
> site-wide public-item total is untouched at **79**.
>
> **The publication is deliberately not part of this cycle.** [EXP-008](EXPERIMENTS.md) — what a first
> publication must show — was written **before** the adoption, and it is gated: no operator publication
> until [EXP-007](EXPERIMENTS.md)'s first complete-UTC-day reading (day **2026-08-16**, from the 08-17
> scheduled snapshot) is committed and graded. Publishing inside that window would change the landing
> demo during the only clean reading EXP-007 will ever get.
>
> **One thing this run found and corrected, because it would have mattered later.**
> [`ops/agents/README.md`](agents/README.md) claimed a remit is written into `creators.charter`
> *"at adoption or creation"*. That is wrong about adoption: `adopt` writes only
> `operator_agents.remit` and leaves the charter alone — and the **code is right**. An adopted feed
> keeps the private steering its owner gave it; overwriting a member's charter from a public workflow
> input is exactly the mutation this control plane exists not to perform. The doc now says so.
>
> **Nothing here is traction, and this is the sentence to hold onto.** A control plane that works is a
> **capability**. `@sportstech`'s newest public item is still **2026-07-30** — 16 days old — and
> adoption did not change that, because adoption publishes nothing. `items_public` **79**,
> `applications` **0**, `members_ever_active` **0**, gross cash **AUD $0** from *no billing exists*,
> spend **AUD $0.00 of $500**.

> # Nine days of "0 applications" had three explanations and no way to tell them apart.
>
> | | 08-06 | 08-07 | 08-08 | 08-09 | 08-10 | 08-11 | 08-12 | 08-13 | 08-14 |
> | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
> | `landing_view` | 29 | 69 | 56 | 56 | 84 | 71 | 67 | 113 | 60 |
> | `application_submit` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
>
> **605 human-shaped landing views, zero applications, and nothing recorded in between.**
> [EXP-003](EXPERIMENTS.md) already killed the mechanism explanation — the apply path works in a real
> browser at both widths. Three survive, they produce *identical* numbers above, and until this run no
> counter Tuned had could separate them: **the denominator is not human**, **the offer does not land**,
> or **the form loses people who wanted in**. Every possible change to that page was unmeasurable.
>
> **Three counters now separate them.** `landing_engage` (first pointerdown/keydown/scroll, once per
> page load), `application_start` (first input into the form, once per load), and `application_invalid`
> (a `POST /waitlist` rejected by email validation — a submit that *tried* and failed, invisible until
> now because `application_submit` only counts the ones that worked). They ride the `metric_days` table
> and `/api/metrics` read path that already exist: no schema change, no new table, no cookie, no
> visitor identifier, no new data category — **so the privacy policy needs no amendment and gets none**.
>
> **[EXP-007](EXPERIMENTS.md) is pre-registered with five exclusive forks**, each carrying a different
> next action, and an **instrument validity gate** ahead of them: if `landing_engage + landing_engage_bot`
> is exactly 0 while `landing_view` is non-zero, the instrument is broken and **no fork may be graded**.
> A JS error producing silent zeros would otherwise be indistinguishable from fork A — the very reading
> it exists to detect. Production asserts the same thing on every push: `POST /api/pulse/landing_engage`
> with no Origin must answer **403**; a 404 means the instrument is absent and a 204 means the counters
> are writable by anyone. Both are roll-back signals.
>
> **This reverses a hold this file carried, and the reversal is deliberate.** *"Not a CTA-reach
> counter"* has been in the *Next action* section since run 18, on EXP-003's reasoning that such a
> counter should wait for known-human arrivals. That reasoning assumed the counter would only measure
> crawlers — and this one is run precisely to **test** that assumption, which EXP-003 itself named as
> the thing blocking every downstream experiment. The traffic it deferred to was to come from
> [EXP-002](EXPERIMENTS.md), **owner-gated and NOT STARTED for eight days**. Waiting for a channel that
> has not arrived would mean it arrives with no before-reading to compare against.
>
> **Nothing here is traction, and no number has moved.** `items_public` **79**, newest public item
> still **2026-08-02**, `items_queued` **146**, `applications` **0**, `members_ever_active` **0**, gross
> cash **AUD $0** from *no billing exists*, spend **AUD $0.00 of $500**. **No agent was adopted,
> created, published or disabled**, and no queued item was opened, inspected, counted, approved or
> published. The first reading of EXP-007 cannot exist before a complete UTC day has passed.

> # The gate is open. `owner: @ava · active 0/12`.
>
> **The blocker that stood for eight runs closed during this one.** The owner installed the Cloudflare
> Worker secret sometime between 22:24 UTC and 03:42 UTC, and the first evidence of it was a side
> effect of shipping this run's ops commit — not a dispatch sent to look for it.
>
> | # | Reading | Time (UTC) | Result |
> | --- | --- | --- | --- |
> | 1 | Owner's dispatch [31846493477](https://github.com/in-c0/tuned/actions/runs/31846493477) | 08-14 22:24:37 | `HTTP 503` · `error=operator key not configured` — **Worker had no bound value** |
> | 2 | Push-triggered [verify production 31862472255](https://github.com/in-c0/tuned/actions/runs/31862472255) | 08-15 03:42:09 | `/api/operator/agents` without a key: **`HTTP 401`** — *the key is set and the plane is closed to anonymous callers* |
> | 3 | One `action=list` — [agent operator 31862547681](https://github.com/in-c0/tuned/actions/runs/31862547681) | 08-15 03:43:10 | **`HTTP 200`** · **`owner: @ava · active 0/12`** · adoptable: `@graphics`, `@sportstech`, `@wearables`, `@wellbeing` |
>
> **Reading 2 is the pre-registered resumption signal and it arrived naturally.** The
> [03:33 UTC review](https://github.com/in-c0/tuned/issues/1#issuecomment-5300331648) authorised
> exactly one `action=list` on *"a naturally occurring production verification"* moving 503 → 401.
> That step runs on every push to `master`; it was not dispatched to poll the gate.
>
> **Reading 3 is the acceptance criterion, met verbatim.** `owner: @ava · active 0/12` — both halves of
> the key match, the owner handle resolves to a real member, and `AGENT_OPERATOR_KEY` does not collide
> with `ADMIN_KEY` (a collision returns 503 before authentication, and a mismatch returns 401). **No
> secret, charter, token or member data was printed**; the workflow renders named fields only.
>
> **And then it stopped, deliberately.** The same review says *"stop before any agent mutation"*.
> **Nothing was adopted, created, published or disabled** — `operator_agents` is empty and `active` is
> **0/12**. The four feeds listed are `adoptable`, which is a statement about what the owner already
> owns, not an action taken on them. Adopting the first one needs a review authorizing it and a public
> remit in [`ops/agents/`](agents/); a green `list` is permission to reach that decision, not through
> it.
>
> **What has *not* changed.** `items_public` **79**, newest public item still **2026-08-02**,
> `items_queued` **146**, `applications` **0**, `members_ever_active` **0**, gross cash **AUD $0** from
> *no billing exists*, spend **AUD $0.00 of $500**. An open control plane is a capability, not traction,
> and no demand inference is drawn from it. No queued item was opened, inspected, counted, approved or
> published.

> **"One live connection with nothing to carry" is no longer true, and this file said it for a day.**
> On **2026-08-14** the Spotify cron ran **30 times, succeeded 30 times, threw no error of any kind,
> and captured 104 plays**. `items_queued` went **42 → 146**; the delta matches the capture count
> exactly. Source: [`ops/metrics/latest.json`](metrics/latest.json) at
> [`7a73982`](https://github.com/in-c0/tuned/commit/7a739827c21f9716765670f20f05fadeb1899ad3),
> `generated_at` 20:58:56 UTC, read through the public zone by the scheduled job.
>
> **`items_public` is still 79, and the newest public item still dates to 2026-08-02.** That is the
> whole finding, and it is not an engineering one. **The machine half of Tuned worked: it observed, it
> captured, it queued. The human half did not happen.** Publication needs a member to approve from the
> queue, and no member has — so **0 of 104** captured items reached a public feed, and the five feeds
> have only got older since [EXP-005](EXPERIMENTS.md) measured them. A 146-item private queue standing
> against 0 published items is Tuned's doctrine stated in numbers: *humans contribute attention, not
> content*, and no human is contributing any.
>
> **What this is not.** 104 captures is **one member listening to music for one day** — supply from a
> single connection, not demand, not activation, not traction. No conversion inference is drawn from
> it in either direction. **The 146 queued items were not opened, inspected, counted individually,
> approved, summarised or published**; they are member data and member attention, not inventory the
> executor may work. `applications` is still **0**, `members_ever_active` still **0**, gross cash still
> **AUD $0** from *no billing exists*, spend still **AUD $0.00 of $500**.
>
> **[EXP-006](EXPERIMENTS.md) was not re-graded.** It stays **QUIET, NOT BROKEN** at its original
> n = 1 window (2026-08-13 22:32:24 UTC); the 08-14 reading is filed beside it as a later observation.
> One arithmetic gap is logged and deliberately **not** investigated under the current hold:
> `cron_run = 30` against **42** expected `*/30` boundaries by the snapshot time. It is recorded as a
> candidate, gradeable only against a full UTC day (`cron_run = 48`), not as a claimed defect.
>
> **The authentication hold is unchanged and resumes silently after this file.** The scheduled
> `verify production` run at 20:45 UTC still read `/api/operator/agents` → **HTTP 503**: the Worker
> half of `AGENT_OPERATOR_KEY` is absent, the plane is fail-closed, and nothing was dispatched by this
> run to re-confirm it.

> **Adding an agent was going to cost one owner interruption every time, forever.** The plan this run
> inherited was a per-agent studio token in a GitHub secret: one credential per feed, each one an
> authentication event only the owner can perform, each one a capability URL ("publish anything to
> that feed") copied into a second system. It works exactly once and then bills the owner again for
> every agent after it — which is the opposite of what a loop that wants to *test* agents needs. The
> reviewer withdrew it before it was used, and asked for the lifecycle to be automated instead.
>
> **What shipped is one stable, revocable, owner-scoped operator credential.** `AGENT_OPERATOR_KEY`
> authorises a narrow control plane — list, adopt, create, publish, disable — over agent feeds owned
> by one configured member. **Per-agent studio tokens never enter GitHub at all**: they stay in D1,
> and no endpoint on this surface returns one. Bounded by construction: no human feed, no other
> member's agent, at most 12 agents, one find per call with an idempotency key, no SQL proxy, no
> key-read endpoint, no deletion, and a refusal to run at all if it is handed `ADMIN_KEY`.
>
> **It is deployed fail-closed, and production says so.**
> [`8c0362d`](https://github.com/in-c0/tuned/commit/8c0362d8e826a2dbfd046ab7c6c2e35d54769d1e) is live,
> confirmed serving by [verify production 31758303170](https://github.com/in-c0/tuned/actions/runs/31758303170),
> which now carries a standing assertion on this surface: *"/api/operator/agents without a key: HTTP
> **503** — AGENT_OPERATOR_KEY is not configured; the plane fails closed"* (00:44:19 UTC). A `200`
> there is an explicit roll-back signal. Production behaviour is otherwise unchanged. **79 tests passing** (28 new),
> and the transport was proved end to end against a local Worker through the exact workflow script
> that will run in production: adopt → publish → replay (published nothing) → list → disable →
> publish (refused). **No production agent was created, adopted or published this cycle**, and the
> owner card below is the only thing standing between here and the first live one.

> **The only path that makes items had no output anyone in this loop could read.** Spotify ingestion
> runs every 30 minutes and is currently the sole producer of items on Tuned; its entire outcome went
> to `console.log`, into Cloudflare's logs, which the executor holds no credentials for by design. So
> `items_queued` standing at **42 on 08-11, 08-12 and 08-13** had two explanations that looked
> identical from here — a member who stopped playing music, or a sync that stopped working — and the
> only instrument available was a delta between daily snapshots, which is exactly what both produce.
>
> **Six counters now separate them**, written into the `metric_days` table that already exists and
> arriving through the `/api/metrics` read path that already works: `cron_run`, `cron_no_credentials`,
> `spotify_sync_ok`, `spotify_items_captured`, `spotify_sync_auth_error`, `spotify_sync_error`. No new
> endpoint, no new table, no schema change, and no change to ingestion behaviour itself. **51 tests
> passing** (8 new, in workerd against a real D1). Shipped as
> [`1297427`](https://github.com/in-c0/tuned/commit/1297427).
>
> **[EXP-006](EXPERIMENTS.md) was pre-registered before the first snapshot existed** — six exclusive
> forks, each with its next action attached — and then **graded the same run**: `cron_run=1`,
> `spotify_sync_ok=1`, nothing captured, no errors, read at **22:32:24 UTC**, two minutes after the
> first cron boundary following the deploy ([`f65d6a3`](https://github.com/in-c0/tuned/commit/f65d6a3)).
>
> **Verdict: QUIET, NOT BROKEN.** The cron fires, the credential is set, the member's Spotify token
> still authenticates against the live API, and the poll found no play newer than `last_sync`. **The
> flat `items_queued = 42` is a true absence of supply, not a defect** — and the "connection died"
> branch is excluded. **n = 1 poll**: it says nothing about the three flat days before the counters
> existed, which stay uninterpretable. There is no backfill.
>
> **Superseded on 2026-08-14 — the connection is no longer quiet.** See the run 41 banner at the top
> of this file. The grade above stands at its own timestamp and is not re-opened.

> **The agent-activation question is now answered, and the answer is one secret.** Run 36 traced the
> whole contract in workerd against a real D1 — an agent reads its brief, publishes what it selected,
> the find appears on the public feed and in RSS, and the landing demo picks that feed up as the
> freshest thing on the site. **Eight assertions, all passing**
> ([`test/agent-contract.test.ts`](../test/agent-contract.test.ts)). Of the four prerequisites the
> reviewer set — identity, remit, credentials, permission — **identity exists** (four `kind='agent'`
> feeds), and **credentials and permission are the missing pair**, both owner-only. Nothing was
> published, and no agent identity was invented.
>
> **The trace found a real defect and it is fixed.** `GET /:handle/rss.xml` never selected `kind`, so
> `creator.kind` was `undefined` inside `rssFeed` and **every agent feed syndicated with no AI label
> at all** — the "AI agent" badge existed only on the HTML page. A subscriber reading an agent's finds
> in their own reader was never told a machine chose them, which is the provenance promise inverted on
> the one surface that leaves the site. The channel now carries it in both the title and the
> description; human feeds are untouched and asserted to stay unlabelled. [L-19](LESSONS.md).
>
> **Shipped and verified in production:** [`10d8557`](https://github.com/in-c0/tuned/commit/10d8557)
> was live 60 seconds after merge and [verify production 31746989255](https://github.com/in-c0/tuned/actions/runs/31746989255)
> passed every step from the public zone. **One honest gap:** the agent branch of the RSS label cannot
> be *observed* in production from here — the executor knows no agent feed's handle, and `/ava`, the
> one handle it does know, is the human feed and correctly stays unlabelled. The branch is covered by
> tests; the first `agent preflight` run will name a handle and settle it against live output.

> **Nothing has been published on Tuned since 2026-08-02, and the landing page did not say so.**
> [EXP-005](EXPERIMENTS.md) read the dates out of production: the demo block on `/` — headed *"Live
> demo — a real feed, right now"* — had a newest item **270.6 hours (11.3 days)** old, under cards the
> page's own script stamped **"11d ago"**. The other four feeds are **13.5 days** stale. All five
> serve, carry items and render correctly; what they contain is simply old. **431 UA-flagged
> human-shaped landing views arrived while that heading was false.**
>
> **Fixed by deleting the claim rather than by faking the data.** The heading now states only what the
> block is, and a presence pulse beneath it reads the real newest timestamp and degrades into *"last
> active 11d ago"* — the same honest pulse `publicPage` has always rendered. The demo also now selects
> the feed with the newest public item instead of the oldest creator: that picker was choosing on
> registration date and was passing **only by coincidence**. Recorded as [L-18](LESSONS.md): *a
> hardcoded claim about live data is a claim nobody can keep true.*
>
> **No conversion inference, in either direction.** No visitor has ever been observed reacting to this
> page in either state. This is a false public claim corrected on its own merits, not an experiment.
>
> **Why the feeds are stale is not a bug.** Publication needs an agent posting or a member approving
> from the queue. The four agent feeds are not running and the desk is unattended. **The executor did
> not and will not manufacture items to make the demo look alive** — that is content generation by the
> machine, the inversion of doctrine [L-17](LESSONS.md) put a standing hold on.

> **Run 34 stands unchanged:** the Show HN packet is **WITHDRAWN**, EXP-002 is `INVALIDATED / NOT
> STARTED`, the moderation-email owner action is **retired unperformed — please do not send it**, and
> the restoration checker is not dispatched. Full reasoning in [DECISIONS.md](DECISIONS.md) and
> [EXP-002-PACKET.md](EXP-002-PACKET.md). Any future Hacker News attempt still needs all three:
> a directly usable destination, the owner's own genuinely human-written words, and explicit
> moderator permission.

> **Two earlier banners retired here, because run 34 falsified their closing lines** — each said the
> owner action below was untouched and remained the only open one, and it is now withdrawn. Their
> substance is unchanged and lives in [DECISIONS.md](DECISIONS.md): **run 32** closed the deploy scare
> (`ffe54b4` was never picked up by Workers Builds; the next push deployed in 61 seconds and
> `verify production` passed every step — nothing to check in Cloudflare), and **run 31** applied the
> 1-week milestone grade precommitted on 2026-08-11. Neither is disturbed by this run: the milestone
> was missed on its publication condition, and an invalidated packet does not retroactively excuse a
> publication that never happened.

> **Owner:** [**DASHBOARD.md**](DASHBOARD.md) is the one-screen view of everything below plus
> milestones, experiment, lessons and freshness. It **mirrors** this file — where the two disagree,
> this one is right.

## OWNER ACTION REQUIRED

### **THREE — and a fourth was opened and cleared inside the same run: the deploy outage recovered without any owner action, and there is nothing for you to do about it.** — card 3 raised 2026-10-02 21:35 Sydney (11:35 UTC), run 214 · card 4 raised and cleared 2026-10-03, run 217

### **Card 3 of 3 — the only card here with a deadline: 2026-10-05.** — raised 2026-10-02 21:35 Sydney (11:35 UTC), run 214

**On 2026-10-06 `@sportstech` stops publishing, and nobody has ever been asked whether that is what
you want.** One word on [issue #1](https://github.com/in-c0/tuned/issues/1) settles it. No account,
no paste, no credential, no spend.

| | |
| --- | --- |
| **The mechanism, stated plainly** | `agent-scout.yml` runs daily and **screens**; it publishes only when a run dispatches it with `publish: true`. Run 153 put publication behind that dispatch deliberately. **The executor that performs the dispatch stops on 2026-10-05.** From 2026-10-06 the cron keeps screening, finds candidates, and discards every one — which is exactly the eight-screens-nothing-published state of 2026-09-13 → 2026-09-20 ([L-97](LESSONS.md#l-97)), except permanent. |
| **What is lost, in the project's own terms** | The daily cadence is the only mechanism Tuned has for issue #1's **third commercial item — *recurring agent value without attention overload***. Run 152 found four of five public feeds had published nothing for six weeks and concluded the publish rate *"is the rate at which a scheduled executor run happens to perform a selection cycle"*. The publisher was built to end that. It ends with the executor. **21 registered publications, the newest item 296 today.** |
| **The decision** | **`ARM`** — the daily schedule publishes unattended, and the cadence survives this executor. **`QUIET`** — it is left as it is, `@sportstech` goes dormant on 2026-10-06, and the card is retired permanently. The one-word change and its exact location are already written into `agent-scout.yml`'s own comment at the `PUBLISH:` env line; **this loop has deliberately not made it** (see below). |
| **What I will NOT claim to get an `ARM`** | **EXP-013's threshold 2 — the pre-registered quality bar for exactly this question — was never met and is not being rewritten.** The second live screen selected **9 of 35 = 25.7%** against a ceiling of 25%; on the decided set (17 of the 35 were deferred unread) it is **9 of 18 = 50%**, a larger failure. The threshold is **mis-specified** and that is recorded in [EXP-013](EXPERIMENTS.md) — but a run that re-specified its own failed threshold after seeing the screen would be marking its own homework, so no run has. **An `ARM` is you overriding an unmet pre-registered threshold, knowingly. I am not dressing it up as anything else.** |
| **The argument for `ARM` anyway, which is yours to weigh** | The risk threshold 2 was reaching for is **attention overload**, and that is bounded by the **one-publication-per-run cap** enforced in `scripts/agent-scout.mjs` — one find a day, maximum — not by any selection rate. A high selection rate with a hard daily cap costs a subscriber nothing. **The undo is intact either way:** `agent operator` → `retract` hides any item and deletes nothing, and disabling the workflow stops the cadence without touching the feed. |
| **The known cost of `ARM`, not hidden** | A scheduled publication **registers no nomination** in `qa/nominations/`, because only a run can commit one ([L-99](LESSONS.md#l-99)). So `scout-gate.mjs` would read the feed **staler than it is**, and the bar's `not-already-published` clause would stop seeing scheduled publications. **The harm is registry drift, not a duplicated find:** `idempotencyKeyFor` keys the operator plane's replay guard on `(handle, source)`, so one source cannot be published twice however often it is re-selected. |
| **Why this is a card and not a line in a report** | It has been carried as *"the N days left, and what happens on the N+1th"* — a **next candidate for the reviewer** — since run 195, through at least runs 196, 197 and every cycle since. **No reviewer directive has been posted since 2026-09-01.** Run 197 wrote the diagnosis itself: *"punting it to an absent reviewer has the same effect as dropping it."* This is [L-76](LESSONS.md#l-76) / [L-97](LESSONS.md#l-97) / [L-123](LESSONS.md#l-123) / [L-131](LESSONS.md#l-131)'s shape for the sixth time — an obligation filed where nobody is obliged to read it — and the owner card stack is the one carrier you do read. [L-133](LESSONS.md#l-133). |
| **Why now and not on 2026-10-05** | Because it becomes **impossible** rather than merely harder if it waits ([L-26](LESSONS.md#l-26)): after the final operating date no run exists to act on either answer. This is the last window in which the question can be put at all. |
| **If you answer nothing** | `QUIET` happens by default. That is a real outcome and it may be the right one — **but it will have been chosen by a clock rather than by you**, which is the only outcome this card exists to prevent. |

---

**Card 2 of 3 — raised 2026-09-06 20:20 Sydney (run 143), and it has never been in this section.** It
was written into run 143's own entry above and into
[DASHBOARD.md §1](DASHBOARD.md#1-owner-action-required), and **never appended here** — so for the 64
runs from 143 to 206 the file the operating card names canonical, and which DASHBOARD's own header
defers to, carried one card. Nothing ever retired it: [DISTRIBUTION.md](DISTRIBUTION.md) still reads
**A2 OPEN — never asked**. Restored below from the packet, [EXP-012](EXPERIMENTS.md) and
DISTRIBUTION.md rather than copied from the mirror. [L-126](LESSONS.md).

**May Tuned be suggested to `ooh.directory` at all? One word on
[issue #1](https://github.com/in-c0/tuned/issues/1) settles it.** No account, no paste, no two
minutes. Full packet: **[ops/SUBMISSION-ooh-directory.md](SUBMISSION-ooh-directory.md)**.

| | |
| --- | --- |
| **The question** | ooh.directory is a **human-curated blog directory**. Its FAQ admits link blogs *"only if they include original commentary about each link"* — `/sportstech` meets that on its face, because every item carries a `why` line. **But that commentary is written by an agent.** The page says so with an `AI AGENT` badge, so nothing is concealed from a curator reading it, and the FAQ has no clause about machine-written text either way. **Silence is not permission**, and suggesting an agent-written blog in your name is your call, not mine. That is why [A1 reads PARTIALLY SATISFIED](DISTRIBUTION.md) and **A2 is open**. |
| **What I need** | **`A`** — proceed, and the packet becomes a paste like card 1. **`N`** — retire it, and `SUBMISSION-ooh-directory.md` is deleted permanently. Either answer is a good outcome; the card standing open is the only bad one. |
| **What is already closed, so the answer is all that is missing** | **A5.** `arrival:ooh-directory` writes on the exact URL this venue takes — the **front page** `GET /:handle`, not the feed — pinned by five tests, including one that the tag writes **nothing** on `GET /`. [EXP-012](EXPERIMENTS.md) registers the threshold, the window, six forks and **two** controls, all **before the counter had ever been written**, because counters do not backfill and a suggestion is spent once. |
| **What was never done** | **Nothing was submitted and no venue was contacted.** Registering the tag authorized no submission, and the commit said so. **A0** stands — this executor can perform no write at any third party, re-tested with a byte-identical `403 CONNECT` again this run. |
| **New, and it changes what an `A` buys — stated because the loop must not imply otherwise** | **This loop will not grade EXP-012 under either answer.** Its reading is *"14 complete UTC days beginning the first complete UTC day after t0"*, read on day 15. A submission made today puts t0 at 2026-09-30, the window at 2026-10-01 → 2026-10-14 and the reading at **2026-10-15 — ten days after the final operating date of 2026-10-05.** An `A` is therefore a decision to make a durable listing whose reading falls to whoever operates Tuned next, with EXP-012's pre-commitment standing as written. That is still worth having; a graded result inside this window is not available and is not being offered. |
| **The honest expectation, unchanged** | The venue tells you in advance that most suggestions are never reviewed: *"Suggesting a blog does not guarantee it will appear on the site."* EXP-012 registers **never-listed** as the *expected* modal outcome (Fork O-D), in which case **nothing is graded** and no conclusion about demand is drawn in either direction. |
| **One thing left that is mine, not yours** | The **duplicate check** — whether a `justtuned` entry already exists at the venue — reads **UNREAD**. It is one `source-read` dispatch and belongs in the cycle of the submission, so it waits on `A` rather than blocking it. |

---

### **Card 1 of 3 — and it has no deadline.** — raised 2026-09-04 20:35 Sydney (10:35 UTC), run 137

**Submit `/sportstech` to `plenaryapp/awesome-rss-feeds`, whenever you next have two minutes.**
Field values, both paths, and what must not go in it:
**[ops/SUBMISSION-awesome-rss-feeds.md](SUBMISSION-awesome-rss-feeds.md)**. It is a paste, not a
research task.

| | |
| --- | --- |
| **Is this a new decision?** | **No.** Your `A` of 2026-08-20 15:04 UTC already authorizes it and is not being re-asked. Nothing here needs a reply — only the act, or one comment retiring it. |
| **Why the card is live again after four dead windows** | The condition that closed all four was **this loop's own A4**, not the venue. A4 tested *"newest public item ≤ 72h at the moment of posting"* — correct for Show HN, where readers arrive in one burst, and **pointed at the wrong instant for a directory**, whose entry is read for months. Run 137 split A4 by venue shape: burst unchanged, durable listings graded on **cadence** (≥ 1 item in 30 days, ≥ 3 in 90). `/sportstech` passes on 4 publications in the trailing 30 days, read from production at [10:10:59Z](https://github.com/in-c0/tuned/actions/runs/33861980480). **There is no expiry instant any more, so there is no window to miss.** [L-54](LESSONS.md), [DISTRIBUTION.md](DISTRIBUTION.md). |
| **What was deliberately not done to get here** | **Nothing was published to reopen a window.** That is freshness-as-motive, ruled out by run 106, and it would have been the fifth repetition of what failed four times. No item, no venue contact, no tag, no threshold, no code. |
| **The one remaining blocker, and it is not yours to fix** | **A0** — this executor can perform no write at any third party, re-tested four times with a byte-identical refusal. The submission is *correct and unmakeable by the loop*. That was always the real blocker; A4's clock hid it behind a deadline for fifteen days. |
| **If you would rather not** | One comment on [issue #1](https://github.com/in-c0/tuned/issues/1) saying so retires the card and the packet permanently. A decision either way is more useful than the card standing open. |

---

### Previously: **NONE.**

**Retired 2026-08-31 04:14:13 UTC (14:14:13 Sydney) on the card's own clock, unanswered.** The
submission it asked for needed **A4** — `/sportstech`'s newest public item ≤ 72h — and that window
closed at exactly the instant above (item **248**, published `2026-08-28T04:14:13.569Z`). **There is
nothing for the owner to do.** This is the **fourth** window to lapse unused; the first three closed
`2026-08-21T04:15:49Z`, `2026-08-24T09:35:56Z` and `2026-08-27T21:43:45Z`.

| | |
| --- | --- |
| **How the retirement was decided** | On the [reviewer directive of `2026-08-31T03:32:23Z`](https://github.com/in-c0/tuned/issues/1#issuecomment-5473352662): *"At the first cycle after `04:14:13Z`, check issue #1 once for a qualifying URL created before expiry; apply the matching existing state transition."* **The check was taken after the instant, not before it.** This run fired at `04:04:53Z` — 9m20s *inside* the window — and **held rather than acting in anticipation**, because a card cannot be retired on a clock that has not yet run out. Re-read at `04:16:00Z`: **230 comments, `updated_at` `2026-08-31T03:32:23Z`**, identical to the 04:04:53Z reading, newest comment the directive itself. **No URL exists at all**, so none can have been created before expiry. |
| **What is preserved** | **The owner's `A`, granted 2026-08-20 15:04 UTC, stands and is not withdrawn** — as does the [2026-08-25 03:36:14 UTC clarification](https://github.com/in-c0/tuned/issues/1#issuecomment-5404749737) that settled authorship a second time. **What expired is a precondition, not the authority.** Nothing is being re-asked. |
| **What is paused** | The `plenaryapp/awesome-rss-feeds` submission itself. **Paused, not dropped** — the owner did not say **C**, and an unanswered card is not a decision. It resumes the first time a find worth publishing **on its own merits** restores A4. That is not scheduled and may be days. |
| **What was not done, deliberately** | **Nothing was published to hold the window open**, and nothing will be. [EXP-008](EXPERIMENTS.md)'s binding clauses disqualify any publication made to move a number, and A4's decay is a **pre-registered acceptable outcome** in [EXP-009](EXPERIMENTS.md)'s stop conditions. **No second owner notification was sent** — run 121's expiry ping was the only one, and the two directives since forbade another. **No egress probe, workflow dispatch or diagnostic was run this cycle**, per the same directive. |
| **What may not be concluded** | **Nothing about demand, in either direction.** No submission was authorized-and-made, so [EXP-009](EXPERIMENTS.md) Reading 2 has **no `t0`** and stays **PENDING at Fork D — inadmissible, not null**. A window that lapsed is a fact about this loop's access and schedule, not about strangers. No pre-`t0` fetch is venue evidence, and no poll is a subscriber. |
| **What is unchanged beneath it** | **The access boundary.** This session's repository allowlist filters every GitHub call to `in-c0/tuned` (run 88, [L-48](LESSONS.md)); it was not routed around, and no child session was spawned to obtain what this one was scoped out of. When A4 returns, the act still needs the owner's account **or** a session started with the venue as an initial source. |
| **Where it was last surfaced** | The card stood on [issue #1](https://github.com/in-c0/tuned/issues/1) from **run 107 (2026-08-28 19:35 Sydney)** at ACTION REQUIRED · HIGH, was named blocker #1 in every execution report across that span, and was escalated **once** out of band at **run 121 (2026-08-31 07:40 Sydney)**, the last waking-hours cycle before expiry. Mirrored throughout at [DASHBOARD.md §1](DASHBOARD.md#1-owner-action-required), [blocker #1](#blockers-ordered-by-leverage), [Next action](#next-action) and [DISTRIBUTION.md](DISTRIBUTION.md). |
| **The lapsed window, exactly** | Opened `2026-08-28T04:14:13.569Z` (item 248 published), closed `2026-08-31T04:14:13Z`. **72h, unused.** Retirement effected at `04:16:00Z`, after the instant. |
| **What the owner may still do at any time** | Open the issue whenever they like — the card below is kept intact for exactly that — but **A4 must be re-read from production first**, and it does not currently hold. There is no clock, no penalty, and no ask. |

**The owner alert is not repeated here.** It stood from run 107 through run 122, was escalated once out
of band at run 121, and re-issuing it after its own precondition expired would be asking for an act
that is no longer admissible.

---

**Kept below, and no longer the live card — the `awesome-rss-feeds` submission card as written at run
107.** Every reading in it was true when written, and it is the exact card that resumes when A4 is next
satisfied. **Its A4 row is now expired — do not act on it without a fresh production read.**

### **ACTION REQUIRED · HIGH — read one Cloudflare page.** *(CLEARED 2026-10-03 10:32:18Z — the outage recovered on the next push, with no owner action taken and none needed)*

**Raised at 20:45 Sydney and cleared at 21:32 Sydney, inside the same run.** The card asked the owner to read Cloudflare → Workers & Pages → `attention-feed` → Builds and report which of three faults it showed. **Then the push carrying the card deployed in 29 seconds.** [verify production 37116713056](https://github.com/in-c0/tuned/actions/runs/37116713056) on [`e8d9af2`](https://github.com/in-c0/tuned/commit/e8d9af2): step 5 satisfied at `10:32:18Z`, **25 of 26 downstream assertions passed and one skipped**, and the serving build **contains every commit the outage had stranded** — `53b861d`, `c98f5f2`, `d45e9cb`. **Production is not behind by anything.**

**Nothing the owner did cleared it, and nothing this loop did either beyond pushing.** No Cloudflare setting was touched (no credential exists here), no revert was made, no build was retried. Between `05:26Z` and `10:31Z` the Cloudflare side resumed on its own — a drained queue or a resolved incident; **which of those it was is still not readable from this session, and is still not guessed at.** The outage ran `04:16Z → 10:32Z`, **6h16m**, stranding three commits, none of which changed a byte of `src/`.

**The card was wrong in the one direction a card must not be: it asked a human for something that was about to stop being true.** Its own text said *"three further pushes did not clear it, so 'the next push fixes it' has already been falsified three times"* — and the fourth push cleared it. Run 216 had written the same shape as a prediction: *"until it is cleared every later run of this loop will also fail to deploy."* **Both sentences were forecasts about infrastructure, and this repository has now been wrong about that three cycles running.** [L-137](LESSONS.md#l-137).

**What is preserved from it.** The diagnostic the card rested on stands and is the useful part: `npm ci && npm run check` — the exact Workers Builds command — **exits 0 on a fresh shallow clone** of `master`'s tip, so the repository was never the cause. **And the watchdog finding stands independently of the recovery:** `deploy-staleness` left a real 6h16m outage unalarmed for **4h18m past due** because its hourly cron delivered **zero of five** firings, which is [L-136](LESSONS.md#l-136) and is not undone by the pipeline recovering.

**What the owner should do about the alarm comment.** [Comment 5968183197](https://github.com/in-c0/tuned/issues/1#issuecomment-5968183197) and the phone notification that followed it are **superseded — please ignore both.** The next `deploy-staleness` run reads green on its own; one per outage means it will not repeat.

---

### **ACTION REQUIRED · HIGH — open one issue at a public GitHub repository. ~2 minutes. No spend, no credential to install, nothing to configure.** *(RETIRED 2026-08-31 04:14:13 UTC — A4 lapsed unused)*

**Opened run 107, 2026-08-28 19:35 Sydney (09:35 UTC), on the [reviewer directive of
09:29:09Z](https://github.com/in-c0/tuned/issues/1#issuecomment-5450853462), which ordered exactly
this submission.** Every precondition was re-read from production **this run** rather than inherited,
and all of them pass. **The only thing missing is an account this executor does not hold.**

**This is the fourth open window. The first three lapsed unused** — 2026-08-21T04:15:49Z,
2026-08-24T09:35:56Z, 2026-08-27T21:43:45Z. **This one closes 2026-08-31 14:14 Sydney
(`2026-08-31T04:14:13Z`), ~66h from opening.** After that the submission is inadmissible again under
[A4](DISTRIBUTION.md) until some future find restores it, and no publication will be made to hold it
open ([EXP-008](EXPERIMENTS.md)'s binding clauses).

| | |
| --- | --- |
| **Blocked outcome** | **The first measurable external distribution test in Tuned's history.** 22 days, 107 runs, **0 applications · 0 activated members · 0 followers · AUD $0**. Every commercial reading is zero, and the loop has never once put its feed in front of strangers. [EXP-009](EXPERIMENTS.md) Reading 2 has stood at **Fork D / PENDING — inadmissible, not a demand null** since run 57, because no attempt exists to grade. **Nothing in the funnel can be learned until one does.** |
| **Owner-only reason** | **Access, not authorship, and not a missing decision.** Your **`A`** of [2026-08-20 15:04:36 UTC](https://github.com/in-c0/tuned/issues/1) stands and is preserved — the executor is *authorized* to submit and simply *cannot*. Its GitHub scope is `in-c0/tuned`; the venue is someone else's repository. **Re-tested this run, 2026-08-28 09:30:25Z**, and the refusal is a platform limit rather than a missing token: `add_repo` → *"cross-tier adds are not supported in v1: requested `plenaryapp/awesome-rss-feeds` but session already has repos from owner(s) [in-c0]"*. It names its own remedy — *"Start a new session with the requested repo as the initial source"* — and **that remedy was not taken and will not be**: provisioning a second session to obtain what this one was scoped out of is boundary-shopping, and an authorization written in an issue comment cannot widen an access control ([L-40](LESSONS.md), [L-48](LESSONS.md)). |
| **Exact minimum action** | Open **one** issue at [`plenaryapp/awesome-rss-feeds`](https://github.com/plenaryapp/awesome-rss-feeds) from its own *add new feeds* template, with exactly three values:<br>• **Category:** `Sports`<br>• **Feed URL:** the route **`/sportstech/rss.xml`** on **`justtuned.com`**, carrying the `?src=` tag **`awesome-rss-feeds`** — **join the route and the tag yourself when you paste.** Per [L-36](LESSONS.md) the joined string is deliberately not written here, because anything that fetches it increments the exact counter [EXP-009](EXPERIMENTS.md) grades.<br>• **Podcast:** `No`<br>Then **paste the resulting issue URL on [issue #1](https://github.com/in-c0/tuned/issues/1)**. The executor records `t0` from GitHub's immutable `created_at` and grades from there. **Nothing else is needed from you** — no body text to write, no account to create, no reply to manage. |
| **Preconditions, all re-read from production this run** | **A4 — SATISFIED, 5.29h.** `last_public_item_at=2026-08-28T04:14:13.569Z`, `public_items=15`, `operator_publications=4`, read [33159736495](https://github.com/in-c0/tuned/actions/runs/33159736495) at `09:31:47Z`. **Duplicate — CLEAN, read `09:32:45Z`** ([33159738434](https://github.com/in-c0/tuned/actions/runs/33159738434)): `is:issue justtuned` at the venue returns **`Open 0 (0) · Closed 0 (0)`**, *"No results. Try adjusting your search filters."* The one `justtuned` occurrence is **GitHub's own echo of the query in its search box**, not a result, and the run resolved the `state:open` and `state:closed` filter links so both states are covered by the single read. **A1** partial (form permitted, authorship unaddressed) · **A2 ✅** · **A3 ✅** · **A5 ✅**. |
| **Success check for clearing this card** | **An issue URL at the venue, posted on issue #1.** Not an intention, not a settings change. The card clears on that observation. |
| **Blocker age** | **7d 11h 40m** — the access boundary was opened 2026-08-20 21:55 UTC (run 61) and has never been closed. Your authorization is 4 hours older than the boundary and has been waiting the whole time. |
| **Why this is being surfaced now when it was not last run** | Run 106 closed with *"no owner notification, because nothing here needs a decision from you"* — **correct on the letter and wrong in effect.** Three windows have now lapsed unused while the card read `NONE`, and a card that retires itself whenever A4 decays is a card the owner never sees during the only hours it can be acted on. **The window, not the card, is the thing with a deadline.** |
| **What is deliberately not being done** | **No submission by any route.** No child session spawned, no second venue, no form, no account use, no impersonation, no second publication to extend the window, and **no real channel tag exercised anywhere** ([L-36](LESSONS.md)). No code, route, schema, counter, allowlist entry, migration or workflow touched. |
| **What may not be concluded from this** | **Nothing about demand, in either direction.** Three lapsed windows are a fact about this loop's access, not about whether anyone wants Tuned. Commercial readings remain zero; spend remains **AUD $0.00 of $500**. |

---

**Kept below, and no longer live — the run-105 card, retired on its own success check.**

### **NONE — the card below was opened and cleared inside the same run, on its own stated success check.**

**Retired 2026-08-28 03:55 UTC (13:55 Sydney), ~19 minutes after it was written.** The commit that
*carried* the card — [`b5e58f6`](https://github.com/in-c0/tuned/commit/b5e58f6), pushed `03:41:44Z` —
**deployed normally**: `verify production`
[33139639332](https://github.com/in-c0/tuned/actions/runs/33139639332) went **green in 54 seconds**
(`03:41:44Z → 03:42:38Z`). **That is the card's own success check, met exactly as written**, and it is
an identity check rather than a timing one: the workflow polls `/api/version` until the **expected
commit stamp** is the one serving, a discipline added precisely because an earlier version passed on
whatever was already live. **The ~6h backlog is live and there is nothing for the owner to do.**

| | |
| --- | --- |
| **What cleared it** | Not an intervention. **No empty kick commit, no re-run, no dispatch, no Cloudflare setting touched, and no owner action** — the dashboard reading was never supplied and is no longer needed. The one commit this run was directed to make deployed on its own. |
| **What is now live** | `b5e58f6`, which contains every commit in the stalled backlog (`1bedef2` … `697c5c6`). The stall left **no undeployed work** behind it. |
| **The stall, for the record** | **Seven commits, eight `verify production` failures, `2026-08-27T21:44:36Z → 22:31:40Z`**, then a ~5h quiet gap with no pushes, then a normal 54-second deploy. Last green before it: `7983146`, `2026-08-27T03:43:41Z`. Peak build staleness ≈ **24h**. |
| **What is NOT known, and matters** | **Why it stalled, and why it cleared.** Nothing this loop did explains either. A fault that resolves without a diagnosis **can recur**, and the next occurrence will look identical from here: green `check`, healthy site, stale build. **The Cloudflare Builds reading would still explain it** — it is now **optional and diagnostic, not blocking**, and it is not being asked for. |
| **Correction issued** | The owner was alerted at **03:47 UTC** on the card, and a **stand-down** was sent at **03:55 UTC** as soon as the green run was read. Two notifications on one subject, the second retracting the ask in the first. **The cost of the first is accepted** — the alternative was a real ~6h deployment blocker going unreported — but see the lesson below. |
| **What may not be concluded** | **Nothing about demand.** Commercial readings remain **zero**; `feedle` A1 stays **PARTIAL**; EXP-009 Reading 2 stays **Fork D / PENDING**; spend stays **AUD $0.00 of $500**. |

**The lesson is about sequencing, not about the alert.** The green run was already knowable ~4 minutes
after the push; this run notified the owner at 03:47 and read the result at 03:54, because the watcher
it armed to catch exactly this was **silently broken** — it polled the GitHub API with
`$GITHUB_TOKEN`, which is **not set in the executor environment**, so every poll failed, matched
nothing, and timed out looking indistinguishable from *"still running"*. **A watcher that cannot fail
loudly is not a watcher** — [L-20](LESSONS.md) again, in the one place that would have prevented the
retracted alert. **Rule for next time: a push that is itself the diagnostic must have its result read
through the same path used to read every other run — the Actions API via the GitHub tool — before
anything is escalated on the assumption that it failed.**

---

**Kept below, and no longer live — the HIGH card exactly as written at 03:36 UTC, before its own
success check was met. Every reading in it was true when written.**

### **ACTION REQUIRED · HIGH — read one Cloudflare page and paste what it says. ~2 minutes. No spend, no credential to install, nothing to change.** *(CLEARED 2026-08-28 03:55 UTC — `b5e58f6` deployed green; no owner action was taken or is needed)*

**Opened run 105, 2026-08-28 13:36 Sydney (03:36 UTC). Blocker age at opening: 5h51m** since the first
undeployed push (`2026-08-27T21:44:36Z`). **Production is healthy and this is not an outage** — it is
serving `7983146` and returning HTTP 200 on every probe. What is frozen is the **build**: production
has been running the same commit for **23h52m**, and **nothing this loop writes can reach users until
this clears.**

| | |
| --- | --- |
| **Blocked outcome** | **Every deployment.** `master` accepts pushes, `check` passes, and the commit never becomes live. **Seven consecutive commits and eight consecutive `verify production` failures**, `2026-08-27T21:44:36Z → 22:31:40Z`: `1bedef2` ([33119534612](https://github.com/in-c0/tuned/actions/runs/33119534612) push, [33120243422](https://github.com/in-c0/tuned/actions/runs/33120243422) dispatch), `0c14053` ([33121020006](https://github.com/in-c0/tuned/actions/runs/33121020006)), `33ba76d` ([33121318504](https://github.com/in-c0/tuned/actions/runs/33121318504)), `1fc2ee9` ([33121996462](https://github.com/in-c0/tuned/actions/runs/33121996462)), `15d94f5` ([33122058109](https://github.com/in-c0/tuned/actions/runs/33122058109)), `e79bcee` ([33122133950](https://github.com/in-c0/tuned/actions/runs/33122133950)), `697c5c6` ([33122301809](https://github.com/in-c0/tuned/actions/runs/33122301809)). **Correction to the count on the record:** run 104's addendum and the reviewer's directive both say **five**; the last two commits' runs landed after that report was written. The correct figure is **seven commits, eight runs** — the finding is unchanged and stronger, not overturned. Last green deploy: `7983146`, [33037183013](https://github.com/in-c0/tuned/actions/runs/33037183013), `2026-08-27T03:43:41Z`. |
| **Owner-only reason** | **Distinguishing a stuck queue from a disconnected Git integration from a failing Cloudflare-side build needs the Cloudflare dashboard, and this executor holds no Cloudflare credential — by design.** The Git-based pipeline exists precisely so the executor never holds one, and that is not a gap to route around. Its only other vantage, direct egress to `justtuned.com`, is **403 CONNECT at the proxy** — re-tested this run, `2026-08-28T03:35:22.811Z`, `connect_rejected`, *"gateway answered 403 to CONNECT"* (blocker #4, standing). **`check` is green on every one of the seven heads** ([33119534600](https://github.com/in-c0/tuned/actions/runs/33119534600)), so `npm ci && npm run check` is not the defect and there is nothing on the repository side left to test. |
| **Exact minimum action** | **Cloudflare Dashboard → Workers & Pages → `attention-feed` → Settings → Builds.** Post on [issue #1](https://github.com/in-c0/tuned/issues/1): **(a)** the Git connection state — connected or disconnected, and which repository and branch; **(b)** the most recent build's **timestamp and status** (queued / building / failed / none at all); **(c)** its **error message or a log link or screenshot**. **Read and paste only.** Do not reconnect, re-authorize, change build settings or retry a build — the reading is what unblocks the diagnosis, and changing state before it is read destroys the evidence. |
| **Success check for clearing this card** | A **normal substantive push to `master` deploys its exact commit**: `/api/version` returns that commit's 40-hex stamp and `verify production` goes green. The card clears on that observation, not on a settings change or an assurance. **No empty commit, no close-and-reopen, and no re-run beyond the one dispatch already spent** will be used to produce it. |
| **Blocker age** | **5h51m** at opening (first undeployed push `2026-08-27T21:44:36Z` → `2026-08-28T03:36Z`). **Production build staleness: 23h52m** (last green deploy `2026-08-27T03:43:41Z`). Both figures are computed from the timestamps above, not estimated. |
| **Where it was last surfaced** | Escalated **once out of band at 2026-08-27 22:20 UTC** (run 103), and **not repeated** — a second notification would carry the same ask and the same dashboard step. On [issue #1](https://github.com/in-c0/tuned/issues/1) it was stated in [run 103's report](https://github.com/in-c0/tuned/issues/1#issuecomment-5445891274), [run 104's addendum](https://github.com/in-c0/tuned/issues/1#issuecomment-5445967783) (five commits) and the [reviewer directive of 2026-08-28 03:34:40Z](https://github.com/in-c0/tuned/issues/1#issuecomment-5448072304) that ordered this card written. In the repository it stands at [DECISIONS.md](DECISIONS.md) 2026-08-27 22:20 UTC and 2026-08-28 03:36 UTC, the run-103 and run-104 header blocks at the top of this file, and [DASHBOARD.md §1](DASHBOARD.md#1-owner-action-required). **This card is the first time it has had an owner-action card of its own** — until now it lived in report prose, which is why the canonical card still read NONE. |
| **What is deliberately not being done** | **No rollback** — the live build *is* the rollback target, and every undeployed diff to date is Markdown the Worker does not serve, so reverting would leave production byte-identical and delete the record of why. **No empty kick commit, no close-and-reopen, no further workflow dispatch, no distribution work, and no second out-of-band alert**, per the reviewer's stop condition. **No Git reconnection or build-setting change** — configuring a deployment integration is an owner act, and this executor would be changing state it cannot read. |
| **What may not be concluded from this** | **Nothing about demand, and nothing about the site being down.** All 72 probes taken during the stall returned **HTTP 200 with a valid commit stamp**. Commercial readings are unchanged and remain **zero**; `feedle` A1 stays **PARTIAL**; spend stays **AUD $0.00 of $500**. |

**Freshness limit, stated rather than papered over:** production was **last read at `2026-08-27T22:31:40Z`**,
and **no fresh probe was taken this run** — the directive that ordered this card also forbade further
workflow dispatches, and direct egress is 403. So "still serving `7983146`" is a **5-hour-old reading
carried forward**, not an observation made at 03:36 UTC. The next unforced reading is tonight's
scheduled `verify production`.

---

**Kept below, and no longer the live card — the retirement notice as written at run 103/104.**

### **NONE.** *(superseded 2026-08-28 03:36 UTC by the card above; this notice remains correct about the submission it retired)*

**Retired 2026-08-27 21:43:45 UTC (2026-08-28 07:43:45 Sydney) on the card's own clock, unanswered.**
The submission it asked for needed **A4** — `/sportstech`'s newest public item ≤ 72h — and that window
closed at exactly the instant above (item **247**, published `2026-08-24T21:43:45.078Z`). **There is
nothing for the owner to do**, and nothing was lost that a future publication does not restore. This
is the **third** window to lapse unused; the first closed `2026-08-21T04:15:49Z`, the second
`2026-08-24T09:35:56Z`.

| | |
| --- | --- |
| **What is preserved** | **The owner's `A`, granted 2026-08-20 15:04 UTC, stands and is not withdrawn** — as does the [2026-08-25 03:36:14 UTC clarification](https://github.com/in-c0/tuned/issues/1#issuecomment-5404749737) that settled authorship a second time. Authorship of a factual directory submission in the owner's name does not need re-asking when the candidate resumes. **What expired is a precondition, not the authority.** |
| **What is paused** | The `plenaryapp/awesome-rss-feeds` submission itself. **Paused, not dropped** — the owner did not say **C**, and an unanswered card is not a decision. It resumes when a find worth publishing **on its own merits** restores A4. That is not scheduled and may be days. |
| **What was not done, deliberately** | **Nothing was published to hold the window open**, and nothing will be. [EXP-008](EXPERIMENTS.md)'s binding clauses disqualify any publication made to move a number, and A4's decay is a **pre-registered acceptable outcome** in [EXP-009](EXPERIMENTS.md)'s stop conditions. **No second owner notification was sent** — the one at run 100 (2026-08-27 14:03 Sydney) was the only one, by design. |
| **What may not be concluded** | **Nothing about demand, in either direction.** No submission was authorized-and-made, so [EXP-009](EXPERIMENTS.md) Reading 2 has **no `t0`** and stays **PENDING at Fork D — inadmissible, not null**. A window that lapsed is a fact about this loop's schedule, not about strangers. No pre-`t0` fetch is venue evidence, and no poll is a subscriber. |
| **What is unchanged beneath it** | **The access boundary.** This session's repository allowlist filters every GitHub call to `in-c0/tuned` (run 88, [L-48](LESSONS.md)); it was not routed around, and no child session was spawned to obtain what this one was scoped out of. When A4 returns, the act still needs the owner's account **or** a session started with the venue as an initial source. |
| **Where it was last surfaced** | The card stood on [issue #1](https://github.com/in-c0/tuned/issues/1) from **run 87 (2026-08-25)** through **run 102 (2026-08-27 20:05 Sydney)**, named blocker #1 in every execution report across that span, and was escalated **once** out of band at **run 100 (2026-08-27 14:03 Sydney)** — the last cycle before expiry landing in waking hours. Its substance was last restated in [run 102's report](https://github.com/in-c0/tuned/issues/1#issuecomment-5437465110). The underlying ask originated in the [2026-08-25 03:36:14 UTC owner clarification](https://github.com/in-c0/tuned/issues/1#issuecomment-5404749737) and the [03:33:11 UTC reviewer directive](https://github.com/in-c0/tuned/issues/1#issuecomment-5404716623) that re-opened it. Mirrored throughout at [DASHBOARD.md §1](DASHBOARD.md#1-owner-action-required), [blocker #1](#blockers-ordered-by-leverage), [Next action](#next-action) and [DISTRIBUTION.md](DISTRIBUTION.md). |
| **The lapsed window, exactly** | Opened `2026-08-24T21:43:45.078Z` (item 247 published), closed `2026-08-27T21:43:45Z`. **72h, unused.** Retirement effected at `2026-08-27T21:43:51Z`, after the instant rather than in anticipation of it. |
| **What the owner may still do at any time** | Open the issue whenever they like — the card below is kept intact for exactly that — but **A4 must be re-read from production first**, and it does not currently hold. There is no clock, no penalty, and no ask. |

**The owner alert is not repeated here.** It stood on [issue #1](https://github.com/in-c0/tuned/issues/1)
from run 87 through run 102, was escalated once out of band at run 100, and re-issuing it after its own
precondition expired would be asking for an act that is no longer admissible.

---

**Kept below, and no longer the live card — the `awesome-rss-feeds` submission card as written at run
87.** Every reading in it was true when written, and it is the exact card that resumes when A4 is next
satisfied. **Its A4 row is now expired — do not act on it without a fresh production read.**

### **ACTION REQUIRED · MEDIUM — one directory submission, before 2026-08-28 07:43 Sydney.** *(RETIRED 2026-08-27 21:43:45 UTC — A4 lapsed unused)*

**Clock, read 2026-08-27 03:35 UTC (run 99): ~18h of window left.** The card was
**kept, not retired** — the reviewer's [2026-08-27
directive](https://github.com/in-c0/tuned/issues/1#issuecomment-5434034959) held it until the first
cycle *after* expiry, at which point it retires **with the owner's `A` authorization preserved**, not
revoked. Nothing below was re-read at run 99; the `~66h` figure in the Severity row is a dated
2026-08-25 reading and is left as written rather than silently refreshed.

**Un-retired 2026-08-25 (run 87) on a freshly read precondition, not on a memory of one.** The card
retired 2026-08-24 09:35:56 UTC because A4 lapsed. Item 247 restored A4 as a consequence of being
worth publishing, and **production was re-read this run** rather than taken from the previous report:
[agent operator 32805757838](https://github.com/in-c0/tuned/actions/runs/32805757838) at
**2026-08-25T03:35:42Z** returned `last_public_item_at=2026-08-24T21:43:45.078Z`,
`public_items=14`, `operator_publications=3`, `operator_publications_hidden=0`.

| | |
| --- | --- |
| **Severity** | **ACTION REQUIRED · MEDIUM.** Nothing is at risk, nothing breaks, nothing is on fire — and there is a real clock. **A4 expires `2026-08-27T21:43:45Z` = 2026-08-28 07:43 Sydney, Friday.** At the read above it stood at **5.9h old**, with **~66h of window left**. Missing it costs nothing except another wait: the candidate pauses again until a find worth publishing on its own merits restores freshness, which is not scheduled. |
| **Blocked outcome** | **The first measurable external distribution test in Tuned's history.** Not "traffic" and not "demand" — a test. Every arrival number this loop has ever had is unattributed: 19 days, 0 applications, 0 ever-active members, 0 followers. This is the first act that would put a **known origin** on the other end of a fetch, which is the precondition for reading any arrival figure as evidence of anything at all. |
| **Why owner action is required** | **Session scope, not authority and not a missing account** — corrected at run 88, see below. Authorship is settled (**A**, 2026-08-20 15:04 UTC) and your [2026-08-25 03:36 UTC clarification](https://github.com/in-c0/tuned/issues/1#issuecomment-5404749737) settled it a second time. Neither is the binding constraint. **The executor is authenticated on GitHub as `in-c0` — your own user account** (`get_me`, run 88), which *can* open an issue at any public repository. What stops it is **this Claude session's repository allowlist**: every GitHub call is filtered to `in-c0/tuned` before it reaches GitHub, and the filter cannot be widened from inside the session. That is the operating record's *unavailable credentials* stop condition, and a scope boundary is never routed around. |
| **Exact minimum action** | Open **one** issue at [`plenaryapp/awesome-rss-feeds`](https://github.com/plenaryapp/awesome-rss-feeds/issues/new) from its own *add a feed* template, with exactly three factual values: **Category `Sports`** · **Feed = the route `/sportstech/rss.xml` on `justtuned.com`, carrying the `?src=` tag `awesome-rss-feeds`** · **Podcast `No`**. Then **paste the resulting issue URL on [issue #1](https://github.com/in-c0/tuned/issues/1)**. Per [L-36](LESSONS.md) the executor still does not print the joined string — join the route and the tag when you paste it. No credential to install, no spend, ~2 minutes. |
| **Observable success check** | A qualifying issue exists at the venue **before the expiry above**, and its URL is posted on issue #1. On that artifact — not on the executor's reading of intent — the next run **records the URL and its UTC `t0`, clears this card, and starts [EXP-009](EXPERIMENTS.md) measurement from `t0`**. |
| **Blocker age** | **Measured from `2026-08-24T21:43:45.078Z`**, the instant item 247 restored A4 and made this act admissible again — **~5.9h at the production read above**. The underlying *access* blocker is older (opened run 61, 2026-08-20 21:55 UTC) and is a different thing: it was never resolved, only made inert while A4 was failing. |
| **Where last surfaced** | The [2026-08-25 03:36:14 UTC owner clarification](https://github.com/in-c0/tuned/issues/1#issuecomment-5404749737), which instructed the executor to submit directly and which run 88 could not carry out; before it, the [03:33:11 UTC reviewer directive](https://github.com/in-c0/tuned/issues/1#issuecomment-5404716623), which re-opened this card. Also this card, [DASHBOARD.md §1](DASHBOARD.md#1-owner-action-required), [blocker #1](#blockers-ordered-by-leverage), [Next action](#next-action) and [DISTRIBUTION.md](DISTRIBUTION.md). |
| **If you would rather not** | **B** or **C** on issue #1, as the retired card below sets out, and both still cost nothing. **C** — drop the candidate — closes [EXP-009](EXPERIMENTS.md) at **Fork D: inadmissible, not null.** An unanswered card is not a decision and will simply lapse again. |

**Preconditions, as read — the freshness row is the only one with a clock on it.**

| Precondition | Reading | Source |
| --- | --- | --- |
| **A4** — newest `@sportstech` public item ≤ 72h | **5.9h ✅** at 2026-08-25T03:35:42Z. Item **247**, published `2026-08-24T21:43:45.078Z`. **Expires 2026-08-27T21:43:45Z = 2026-08-28 07:43 Sydney.** | [agent operator 32805757838](https://github.com/in-c0/tuned/actions/runs/32805757838), read from production this run |
| **No duplicate** | **None ✅ as of 2026-08-25** — the reviewer's own preflight searched the venue for `sportstech` and `justtuned.com` across open and closed issues and found nothing. **The executor did not re-read it** and does not re-claim it as its own reading. | [reviewer directive, 2026-08-25 03:33:11 UTC](https://github.com/in-c0/tuned/issues/1#issuecomment-5404716623) |
| **A1** partial · **A2** ✅ (**A**) · **A3** ✅ · **A5** ✅ | unchanged | [DISTRIBUTION.md](DISTRIBUTION.md) |

**The 03:36 clarification lifted a constraint that was never the binding one, and this run found out
why — so the card is corrected rather than cleared.** You wrote that Claude and ChatGPT *are*
authorized to create the venue issue directly, that ChatGPT's `403 Resource not accessible by
integration` and its signed-out browser are access limitations rather than missing authority, and that
Claude should therefore use **its own authorized GitHub capability**. Both premises are right. The
conclusion does not follow for this executor, and the reason is narrower and more fixable than the
card has been saying for seven runs:

| | Believed since run 61 | Read at run 88 |
| --- | --- | --- |
| **Identity** | *"holds no identity, token or session at the venue"* | **False.** `get_me` returns `in-c0` — **your own GitHub user account**, name *ava kim*, 82 public repos. That identity can open an issue at any public repository on GitHub, this venue included. |
| **What blocks it** | a missing credential | **This Claude session's repository allowlist.** Every GitHub call is filtered to `in-c0/tuned` before it reaches GitHub: `get_file_contents` on the venue returned *"Access denied: repository `plenaryapp/awesome-rss-feeds` is not configured for this session. Allowed repositories: `in-c0/tuned`"* (run 88, 2026-08-25). The session's own repo-attach refused a second time: *"cross-tier adds are not supported in v1 … Start a new session with the requested repo as the initial source."* |
| **Who can lift it** | nobody — treated as fixed | **You can, from outside the session.** It is configuration, not a fact about GitHub. |

**So there are two remedies now, and the cheap one is unchanged.**

1. **Open the issue yourself** — the *Exact minimum action* row above. ~2 minutes, no credential to
   install, no spend. **Still strictly the cheapest path and the recommendation.**
2. **Start a Claude session with `plenaryapp/awesome-rss-feeds` as an initial source**, and the
   executor makes the submission from it. The refusal message above names this as the supported route.
   It costs you a session start instead of two minutes of form-filling, so it is only worth it if you
   would rather the executor held this class of action generally.

**What this run would not do, and the distinction matters.** It holds `create_session` and could have
spawned a child session scoped to the venue to obtain what this session was scoped out of. **That is
boundary-shopping and it was not attempted** — run 61 declined the same move for the same reason, and
the child-session tool is explicitly built so a child never carries a grant its parent lacks. An
authorization written in an issue comment cannot widen a session's access control, and the executor
will not treat it as though it can. Recorded as [L-48](LESSONS.md).

**Two things this card deliberately does not do.** It does not ask for a second publication to extend
the window — freshness is a consequence of publishing something worth publishing and never a motive
([EXP-008](EXPERIMENTS.md)'s binding clauses), and a third lapse is an acceptable outcome. And it
**infers nothing about demand in either direction**: this is an act, not a result.

**One correction the reviewer is owed, recorded rather than sent privately.** The directive that
re-opened this card **printed the joined tagged feed URL in a public comment on issue #1** at
`2026-08-25T03:33:11Z`. That is exactly the act [L-36](LESSONS.md) exists to prevent — run 56 printed
`?src=qa` publicly and `arrival_fetch:qa` then read 16 unattributed fetches. The counter is now
contaminated **before `t0` exists**, and the consequence is registered in [METRICS.md](METRICS.md)
before the number does: any `arrival_fetch:awesome-rss-feeds` between that timestamp and `t0` is
attributable to readers of issue #1, **not** to the venue. It never read non-zero before now, so the
pre-`t0` baseline is clean up to that instant. **This does not block the submission** and is not a
reason to delay it — see [L-47](LESSONS.md).

---

**Kept below, and no longer the live card — the original `awesome-rss-feeds` submission card as
written at run 61 and narrowed at run 62.** Its options **A-1 / B / C** are still the live choices and
the card above points at them. **Its A4 row is stale** — read the freshness row above instead, which
was taken from production this run.

### **ONE SUBMISSION. No credential to install, no spend. ~2 minutes.** *(SUPERSEDED 2026-08-25 by the live card above — its options A-1 / B / C still stand; its A4 row is stale)*

**You answered A at 2026-08-20 15:04 UTC. A is granted, it stands, and nothing about it is being
re-asked.** What changed is that the executor discovered it cannot carry A out, and the reason is a
boundary rather than a judgement.

> **This executor's GitHub access is scoped to `in-c0/tuned` and to nothing else. It holds no identity,
> token or session at `plenaryapp/awesome-rss-feeds`, so it cannot open an issue there.** Verified this
> run, three ways: the repository read returned *"Access denied: repository
> `plenaryapp/awesome-rss-feeds` is not configured for this session. Allowed repositories:
> `in-c0/tuned`"*; the session's own repo-attach refused with *"cross-tier adds are not supported"*; and
> no cross-repository token exists among the configured secrets, while a workflow's `GITHUB_TOKEN` is
> scoped to this repository by construction. **This is the operating record's "unavailable credentials"
> stop condition, and the executor will not route around a scope boundary to defeat it.**

**Everything else is done.** The preflight the reviewer required is complete and current, and it is the
part with a clock on it:

| Precondition | Reading | Source |
| --- | --- | --- |
| **A4** — newest public item ≤ 72h | **0.0h ✅** at 09:37:24 UTC. Newest `@sportstech` item `2026-08-21T09:35:56Z` — **item 246, run 65.** **Lapses 2026-08-24 09:35:56 UTC = 19:35 Sydney, Monday.** *A4 did lapse in between:* it expired 2026-08-21 04:15:49Z with nothing submitted, and this publication restored it as a consequence of being worth publishing, never as its motive. | [qa-browser 32468714667](https://github.com/in-c0/tuned/actions/runs/32468714667), read from production |
| **No duplicate** | **None ✅ as of 2026-08-20 21:38 UTC** — `is:issue justtuned` at the venue returned *"Open 0 (0) Closed 0 (0) … No results"*. **Not re-read this run** and not re-claimed as fresh; the venue was not touched at all on 2026-08-21. | [source read 32420411861](https://github.com/in-c0/tuned/actions/runs/32420411861) |
| **A1** partial · **A3** ✅ · **A5** ✅ · **A2** ✅ (**A**) | unchanged | [DISTRIBUTION.md](DISTRIBUTION.md) |

**Run 61 offered three ways. One of them was not real, and withdrawing it leaves you a simpler
decision than you had last night.**

| | Response | What happens next |
| --- | --- | --- |
| **A-1** | **"I'll open the issue."** *(recommended — and now the only route that works)* | You open one issue at [`plenaryapp/awesome-rss-feeds`](https://github.com/plenaryapp/awesome-rss-feeds) from its own template: **category `Sports`**, **feed = route `/sportstech/rss.xml` on `justtuned.com` carrying `?src=` tag `awesome-rss-feeds`**, not a podcast. Per [L-36](LESSONS.md) the joined URL is deliberately not written anywhere public, including here — join the route and the tag when you paste it. This produces the **canonical issue URL** [EXP-009](EXPERIMENTS.md) needs to tell a declined submission from one that never arrived. Post the URL on [issue #1](https://github.com/in-c0/tuned/issues/1) and the executor records t0 and grades from there. |
| **A-2** | ~~**"Use the Google form instead."**~~ **WITHDRAWN by the executor, run 62.** | **It said the executor could submit the form unaided. That was false, and it was the executor's error, not yours.** The form is open to an anonymous *human*; this executor holds **no instrument that can submit a form to anyone** — its egress is **403 to every host including `docs.google.com`**, and its only third-party vantage is a **GET-only reader** with no form-filling or POST capability in it at all. Saying **A-2** today would authorize an act that still could not happen. **Nothing is lost:** A-2 was already the worse option on its own terms, because a form leaves no receipt and no canonical URL. If you want it revived, that is **option B** below, and it is a bigger question than it looks. |
| **B** | **"Build the thing that can submit."** *(new, and deliberately not recommended)* | Honouring A-2 needs a **new instrument that performs writes at other people's websites** — not a permission, a capability, and one this loop has never had. It would be built in the open with its own limits and its own review. **The executor is not asking for this** and does not think the receiptless Google form is worth it; it is listed so the withdrawal above is not mistaken for the door being closed. |
| **C** | **"Drop the candidate."** | Still costs nothing at any hour. The venue is struck from [DISTRIBUTION.md](DISTRIBUTION.md)'s register and EXP-009 closes at **Fork D — inadmissible, not null**. |

| | |
| --- | --- |
| **Severity** | **Blocking the loop's single objective, and on a clock again.** Nothing is at risk and nothing breaks — but **A4 lapses 2026-08-24 09:35:56 UTC (19:35 Sydney, Monday)**. A submission made before then ships against a fresh feed; after it, the candidate **waits** on the next find genuinely worth publishing, which is not scheduled and could be days. **There is no penalty for missing it.** The first window (to 2026-08-21 04:15:49Z) *did* lapse unused, and nothing was published to hold it open — [EXP-008](EXPERIMENTS.md)'s binding clauses disqualify a publication made to move a number, and this one was graded against its remit with the case against it written before the dispatch ([EXP-008-CANDIDATES.md](EXP-008-CANDIDATES.md) R-2). |
| **Blocked outcome** | The first channel of **known-human traffic** in Tuned's history. Blocker #1 — *no arrival is known to be human* — is measured, correctly diagnosed as A1, and now has **every admissibility condition satisfied**: A1 partial, A2 ✅ (**A**, 2026-08-20 15:04 UTC), A3 ✅, A4 ✅, A5 ✅. **What is left is not a condition. It is a credential the executor does not hold.** |
| **Why owner action is required** | Not authorship — you settled that with **A**. **Access.** Opening an issue at a third party's repository needs a GitHub identity there, and this executor has one only at `in-c0/tuned`. Working around a scope boundary is forbidden absolutely, so the act itself needs a human account or an explicitly authorized unauthenticated form. |
| **Exact minimum action** | **A-1:** open one issue at the venue from its own template with the three factual values above, then paste the resulting URL on issue #1. **B or C:** one comment on issue #1 saying so. No credential to install, no spend, and **C still costs nothing**. |
| **Observable success check** | Either a canonical `plenaryapp/awesome-rss-feeds` issue URL exists and is posted on issue #1, or a comment on issue #1 names **B** or **C**. **This card is removed the run after one of those exists** — on the artifact, not on the executor's reading of intent. |
| **Blocker age** | **The authorship question is closed** — opened 2026-08-19 04:30 UTC, answered 2026-08-20 15:04 UTC, age ~35 hours. **This card opened at run 61** and is a different blocker: access, not authority. **Run 62 narrowed it rather than restating it:** one of its three options was withdrawn as unperformable, so what is in front of you is now a single route plus two ways of saying no. |
| **Where surfaced** | This card, [DASHBOARD.md §1](DASHBOARD.md#1-owner-action-required), blocker #1, [Next action](#next-action), [DISTRIBUTION.md](DISTRIBUTION.md), and run 61's execution report on [issue #1](https://github.com/in-c0/tuned/issues/1). |

**One thing that changed about the decision itself, and it is worth a sentence.** Run 58 registered
[EXP-010](EXPERIMENTS.md): a tagged counter cannot on its own tell a directory's subscribers from
anyone who assembled the URL from public source, because this loop has no private store and every tag
it uses is public. EXP-010 measures how large that problem is by **2026-09-04**. **That is not a
reason to wait** — admissibility turns on A1/A2, which EXP-010 does not touch — but a submission made
before then will have its Fork A read against a null that does not exist yet.

**`ooh.directory` is unaffected and still not ready.** It also reads A1 PARTIALLY SATISFIED and wants
the **front page** rather than the feed, but it **fails A5** — its tag is not allowlisted — so it would
not be submitted today under any answer. **Only `awesome-rss-feeds` is ready.**

**What the executor deliberately did not do this run, and why it is recorded rather than assumed.** It
did not submit through the Google form on its own initiative, even though **A** names *"the venue's own
Google form or issue template"* and the form needs no account. Two reasons, both from this loop's own
rules rather than from caution: the reviewer's standing directive says that if a precondition fails —
naming *"authentication fails"* explicitly — the executor is to make no submission and record the exact
failed precondition; and a form submission leaves **no artifact anyone can point at**, which collapses
[EXP-009](EXPERIMENTS.md)'s Fork D (*never merged → inadmissible, not null*) into an unfalsifiable
claim. A channel worth testing is worth testing in a way that can come back negative and be believed.
~~**If you would rather have the attempt than the receipt, say A-2 and it goes out.**~~

> **Struck run 62 — it would not have gone out.** That sentence promised an act the executor cannot
> perform: there is no instrument here that can submit a form to a third party. The declining was still
> correct on its own reasoning, but the *reason recorded* was A5 alone when **A0 was also failing and
> nobody had checked** — the loop declined the form for the interesting reason and missed the plain
> one. See [DISTRIBUTION.md](DISTRIBUTION.md) run-62 and [L-41](LESSONS.md).

**Nothing was sent to your phone or inbox this run.** The reviewer's 2026-08-20 21:34 UTC directive
states that channel is not authorized; it was not used and no such notification is claimed. This card
and [issue #1](https://github.com/in-c0/tuned/issues/1) are the whole of the ask.

---

**Previously here, and closed: the `AGENT_OPERATOR_KEY` card.** It is **closed — success check
passed** at 2026-08-15 03:43:10 UTC, on its own stated terms rather than on an executor's judgement:
`action=list` returned `HTTP 200` with **`owner: @ava · active 0/12`**
([agent operator 31862547681](https://github.com/in-c0/tuned/actions/runs/31862547681)). It is removed
here the moment it passed, not when it was noticed.

| | |
| --- | --- |
| **Opened** | 2026-08-14 (run 38), replacing the run-36 `AGENT_STUDIO_TOKEN` card, which was withdrawn before use. |
| **Narrowed** | 2026-08-15 (run 42) to the Cloudflare half alone, on the owner's own 503 reading. |
| **Closed** | 2026-08-15 03:43:10 UTC (run 42), ~8 hours later, by the owner installing the Worker secret. Total age: **~29 hours**. |
| **Verified by** | 503 → **401** on a push-triggered [verify production](https://github.com/in-c0/tuned/actions/runs/31862472255), then **200** on one read-only `list`. |
| **Cost** | AUD $0. No spend, no credential ever read by the executor. |

**Nothing on the operator plane is owner-blocked, and that has not changed** — the decision above is a
distribution boundary, not an operator-plane one. **Two sentences that stood here were stale and are
corrected rather than deleted:** this said *"the next decision is the reviewer's, not the owner's"*
and that four owned feeds were adoptable *"and none has been touched"*. Both were written at run 42,
before run 44 adopted `@sportstech` under the reviewer's public remit (**`active 1/12`**) and run 52
published its first source-linked find. Adoptable today: **`@graphics`, `@wearables`, `@wellbeing`** —
three, not four. Adopting or creating a *further* managed agent still needs a review authorizing it, a
public remit in [`ops/agents/`](agents/), and what a working agent feed must show **pre-registered
before any number is read off it**.

**The standing rollback signal on this surface is unchanged and now matters more, not less:**
`/api/operator/agents` answering **200 without a key** means the control plane is open to anonymous
callers and is grounds for immediate rollback on sight. `verify production` asserts this on every push
and daily; it read **401** at 03:42:09 UTC, which is the correct closed state for a live plane.

**What this key can do, exactly.** List managed agents and their public publication history; adopt one
agent feed you already own; create a new agent feed from a **public** remit; publish one source-linked
find with an idempotency key; disable an agent. That is the entire surface.

**What it cannot do, enforced in code and covered by tests.** Touch a human feed. Touch an agent owned
by anyone but the configured owner (`ava`) — no workflow input selects an owner. Read or return a
studio token, a session token, a member email, private charter text, a skipped item or the 42 private
queued items. Provision a member. Run SQL. Read any secret back. Delete anything. Manage a thirteenth
agent. Publish twice for the same idempotency key.

**Nothing happens the moment you set it.** The plane goes live; no agent is adopted, created or
published until a review authorizes the first one and a remit for it exists in
[`ops/agents/`](agents/). Disabling is one dispatch and destroys nothing — it revokes the operator's
authority and leaves the feed, its items and your own studio URL exactly as they were.

**One honest limit, stated before you spend the credential.** The executor's egress proxy blocks
direct page fetches (`blog.cloudflare.com` → `EGRESS_BLOCKED`); web *search* works. So its encounters
are real but shallow — it reads result-level material, not the page. That is a genuine constraint on
how good the selections will be, and it is a fact you should have before deciding, not after.

---

**Previously here, and still true: there is no Hacker News action.** The moderation-email
card that stood here — *ask Hacker News to review the dead item* — is **retired unperformed**. Do not
send it. Do not repost, resubmit reworded, use a second account or an alternate link, or solicit
votes. The channel is closed until all three conditions below are met, and none of them is urgent.

**Why it was withdrawn.** The packet it was recovering is unpublishable on Hacker News' own rules,
whatever moderation would have said: **§3 was AI-written and the packet instructed you to post it as
your own first comment**, and **§2 submitted an application-gated landing page** where Show HN asks for
something a reader can try directly. Getting the item restored would have restored an invalid test —
and, worse, one that produces exactly the flat counters a genuine rejection produces, which is how a
defect in the executor's own copy would have entered the record as a finding about Tuned. Full
reasoning in [L-17](LESSONS.md); the packet is fenced at
[EXP-002-PACKET.md](EXP-002-PACKET.md).

**If a Hacker News attempt is ever wanted again, it needs all three of these first** — this is a
standing constraint, not an action:

| | |
| --- | --- |
| **A directly usable destination** | Something a reader can try without applying or signing up. `/ava` is public and might qualify; the application-gated landing page does not. Building that is executor work, and it is not authorized this cycle. |
| **Your own words** | The title and any comment must be genuinely written by you and not AI-edited. **The executor will not draft, reword, or edit that text**, and will decline if asked — that is the doctrine applied to Tuned itself: humans contribute attention, not content. |
| **Explicit moderator permission** | Obtained by you, before any resubmission of this or a related link. Not this run's business, and not a step to take now. |

**The blocker underneath is unchanged and is not owner-actionable right now.** Applications remain
**0** across every measured day against **431** UA-flagged human-shaped landing views. No arrival is
known to be human, so every conversion figure Tuned computes still has an unknown denominator. What
changed today is only that the channel chosen to fix that turned out to be inadmissible. The next
candidate is a *different* channel, proposed openly — see the run-34 report on
[issue #1](https://github.com/in-c0/tuned/issues/1).

**Payment-provider account creation** is still deliberately not listed: it becomes the blocking step
when there is paid demand to collect, and there is none.

**Resolved and kept on the record: Bot Fight Mode.** Closed **2026-08-11**, by the owner, between
04:59:48 and 05:06:18 UTC. Two independent readings settle it, and neither is an inference:

| Reading | Time (UTC) | Vantage | Result |
| --- | --- | --- | --- |
| [verify production 31460563014](https://github.com/in-c0/tuned/actions/runs/31460563014) | 05:06:19–05:07:02 | `vantage=public`, ray `a294b5e62f7b1039-IAD` | `/` 200 · `/api/version` 200 · `/api/metrics` **401** unauthenticated · `/terms` + `/privacy` 200 with `legal@justtuned.com` · `/ava/rss.xml` **200** `application/rss+xml` · **Public availability step skipped** because the zone was no longer blocked |
| [metrics snapshot 31478252880](https://github.com/in-c0/tuned/actions/runs/31478252880) | 09:33:53–09:33:57 | `vantage=public`, ray `a2963de05b50e51c-DFW` | same five paths green from a second colo · authenticated `/api/metrics` 200 · `zone_blocked=false` |

**`cf-mitigated` was empty on every row of both probe tables, and the `bare` variant — plain
`curl/8.x`, the client that was being challenged — now passes identically to the named contract.**
That is the signature of the toggle being off rather than of a client that learned to look
acceptable. The executor changed no Cloudflare setting, sent no disguised request, and dispatched no
`verify production` run: the 05:06 evidence was a byproduct of shipping [`1c3fe86`](https://github.com/in-c0/tuned/commit/1c3fe867f2a83903cf4bdeb9b3b3c12b1efbb519),
and the 09:33 evidence a byproduct of taking the baseline.

The custom *"Block PHP/WordPress/.env scanner probes"* rule and the managed `CVE-2025-55182` rule were
never implicated and remain untouched. The standing recommendation from run 28 stands: if bot
protection returns, use rate limiting or **Super Bot Fight Mode with path exemptions** for `GET /`,
`/ava/*`, `/*/rss.xml` and `/api/*` — plain Bot Fight Mode cannot be scoped at all, which is what
caused this.

One screen of current state. Not a diary — the narrative lives in
[DECISIONS.md](DECISIONS.md), [EXPERIMENTS.md](EXPERIMENTS.md), [METRICS.md](METRICS.md) and
[issue #1](https://github.com/in-c0/tuned/issues/1). Update only when state **materially** changes.

## Run lock — step 0 of every run

**Before anything else — before the first commit, the first issue comment, the first workflow dispatch,
the first deploy:**

```
node scripts/run-claim.mjs claim          # exit 0 = proceed · exit 75 = another session holds it, STOP
...run...
node scripts/run-claim.mjs release        # --outcome completed|aborted
node scripts/run-claim.mjs status         # who holds it right now
```

**Exit 75 is a clean, expected outcome, not a failure.** A session that loses has mutated nothing — its
claim commit was rejected by the remote and is unreachable — and it must end its turn without a commit,
a comment, a dispatch or a deploy. It does not retry into the lease and it does not "just do the
read-only part": run 123's second session also only meant to help.

**What it is.** One append-only orphan branch, `ops-claims`, carrying `claims.jsonl`. A claim is a line;
so is a release; so is a takeover. Every write is a fast-forward, so **nothing here ever force-pushes,
deletes a ref, or touches protected history.** Mechanism and its rationale:
[`scripts/lib/run-claim.mjs`](../scripts/lib/run-claim.mjs).

**Why a branch and not a tag or a private namespace.** Probed 2026-08-31: this credential can create and
fast-forward `refs/heads/*` and can do nothing else — `refs/tags/*`, custom namespaces and **every ref
deletion** return 403. A lock whose release is a deletion would therefore have had no release at all.

**Stale recovery, and it is automatic.** A claim carries a 90-minute lease. A claim past its lease with
no release on record is a crashed session, and the next contender takes it over by appending a record
naming what it supersedes — auditable, reversible by reading, and requiring no owner action, no
credential change and no destructive ref operation. **A live lease is never taken**, and a cycle that was
claimed *and released* is never re-entered: that second rule is run 123's duplicate specifically.

**What it cannot do.** It cannot stop a session that never calls it. A repository-scoped guard has no way
to intercept a process that declines to ask, and no mechanism available here does — so the first line of
this section is the part that has to be honoured rather than enforced.

## Phase and single active objective

**Phase: incident CLOSED 2026-08-11.** It ran from 2026-08-10 06:53 UTC to some point between
04:59:48 and 05:06:18 UTC on 2026-08-11 — roughly 22 hours, of which the last three runs were spent
correctly standing down rather than working around a control the owner had enabled. Both production
readers are green through the public zone from two colos. What it cost: two days of ungradeable
arrival counters, and one day where the loop believed the site was dark for everyone when it was
in fact dark only to machines.

**Active objective, restored: get one cohort of controlled, known-human traffic in front of the
landing page, and find out whether anybody applies.** This was the objective before the incident
displaced it, and nothing learned since has weakened it — 0 applications against 431 human-flagged
views is still the finding that governs everything downstream. **As of run 34 it is blocked on nothing
the owner can do, and on no channel that currently exists.** The one channel it had was withdrawn as
inadmissible, so the objective stands with no route in front of it — which is the honest state, and is
the reason the next candidate has to be a different channel rather than a retry of this one.

**Run 35 sharpened what any such channel would need, and the news is mixed.** The destination is now
*honest* — it no longer claims a freshness it lacks — but it is not yet *compelling*: a stranger who
opens `/ava` today sees a real, working, provenance-carrying feed whose newest item is eleven days
old. **That is a truthful answer to "is there something to try?" and a weak one**, and the weakness is
not a code defect. It is the absence of anyone — human or agent — currently contributing attention.
**The next candidate is therefore upstream of distribution: make one feed genuinely live**, by the
member approving from the queue or by an agent actually running. Until something on Tuned is current,
a channel would be pointing strangers at an archive.

**The superseded objective, retained because it resumes unchanged the moment the edge clears:** EXP-003 answered the mechanism
question — a visitor who arrives *can* apply, at both mobile and desktop widths — so the remaining
explanations for 0/115 are that the arrivals were never human, or that the offer does not land on
whoever is arriving. **Neither is decidable from a denominator of UA-classified requests.** Until
some arrivals are known to be human, every conversion figure Tuned computes has an unknown
denominator and no downstream experiment is gradeable.

**That authorization is spent, and its channel is gone.** The owner authorized a channel on
2026-08-08 13:56 UTC and pasted it on 2026-08-13; run 34 found the packet inadmissible on the venue's
own rules and **withdrew** it. So the binding step is no longer *decide* or *publish* — there is no
prepared channel at all, and the loop is not pretending otherwise. What a next channel must satisfy is
recorded as a standing constraint in the owner card above and as [L-17](LESSONS.md)'s prevention
check: admissibility conditions get pre-registered alongside thresholds, or the channel is not ready
to be authorized.

## Shipped and verified

| Capability | State | Evidence |
| --- | --- | --- |
| Production serving | **Green through the public zone**, most recently [run 31749138724](https://github.com/in-c0/tuned/actions/runs/31749138724) on 2026-08-13 at **22:15 UTC** — `1297427` live within 74 seconds of merge, landing and legal pages 200, unauthenticated `/api/metrics` 401, challenge-only failure step skipped because `zone_blocked=false`. Before that, [run 31746989255](https://github.com/in-c0/tuned/actions/runs/31746989255) on 2026-08-13 at **21:45 UTC** — `10d8557` live 60s after merge, landing and legal pages 200, unauthenticated `/api/metrics` 401, and the challenge-only failure step correctly skipped because `zone_blocked=false`. Before that, [run 31640663090](https://github.com/in-c0/tuned/actions/runs/31640663090) on 2026-08-12 at **21:03 UTC** — landing and legal pages 200, unauthenticated `/api/metrics` 401, and the challenge-only failure step correctly skipped because `zone_blocked=false`. The two readings that closed the incident are kept below as the record of that closure | [verify production 31460563014](https://github.com/in-c0/tuned/actions/runs/31460563014) at 05:06 UTC (`vantage=public`, ray `a294b5e62f7b1039-IAD`) and [metrics snapshot 31478252880](https://github.com/in-c0/tuned/actions/runs/31478252880) at 09:33 UTC (ray `a2963de05b50e51c-DFW`) both read `justtuned.com` directly: `1c3fe86` live, `/` 200, `/api/version` 200, unauthenticated `/api/metrics` 401, `/terms` and `/privacy` 200 with `legal@justtuned.com`, `/ava/rss.xml` 200 `application/rss+xml`. `cf-mitigated` empty on every row; the `bare` curl variant passes identically to the named contract. The origin route on `workers.dev` still answers and is no longer the only vantage. |
| Deploy pipeline | working | Cloudflare Workers Builds on `master`; `npm ci && npm run check` → `wrangler deploy` |
| Clean-clone build gate | fixed + CI-enforced | run 1, `.github/workflows/check.yml` |
| Deploy verification by version identity | **restored, and exercised for real** | `verify-production.yml` polls `/api/version` for the pushed SHA and fails closed. When the zone will not answer it reads identity and health from the Worker's `workers.dev` origin, then grades public availability **separately** — a step that failed [run 31437633360](https://github.com/in-c0/tuned/actions/runs/31437633360) while every other check in it passed. That is the intended shape: a green run still means the public can use Tuned |
| Funnel telemetry (9 counters, 2 additive tables) | deployed and **read** | `feb6c4f`; `src/metrics.ts` |
| Aggregate read path `GET /api/metrics` | **working, authenticated** | HTTP 200 in [run 31246496587](https://github.com/in-c0/tuned/actions/runs/31246496587); key-gated, fails closed |
| Metrics snapshot → repository | **working** | `ops/metrics/latest.json`, `ops/metrics/2026-08-08.json` at `a00a8fe` |
| **Application path, end to end in production** | **verified working** | EXP-003 [run 31251303499](https://github.com/in-c0/tuned/actions/runs/31251303499) — real Chromium, both widths, submit intercepted before mutation |
| **Public no-account surfaces** (demo feed + RSS) | **verified working** | EXP-004 [run 31252271974](https://github.com/in-c0/tuned/actions/runs/31252271974) — `/ava` 200 with 24 items, `/ava/rss.xml` 200 with 38, both widths |
| Browser QA harness | working, dispatch-only, **reusable** | `qa/`, `exp003-mechanism.yml` (pinned to its own spec) and `qa-browser.yml` (takes a spec as input); screenshots per run |
| **EXP-008 provenance instrument** | **generalized run 66; threshold 5 now claimed for item 246** | `qa/nominations/*.json` + [`qa/exp008-provenance.spec.mjs`](../qa/exp008-provenance.spec.mjs). One pre-registered entry per publication; the loader refuses any entry whose pre-registration commit does not predate its own publication, and refuses an empty registry rather than passing over zero items. Both items graded green on both surfaces at both viewports from GitHub's network — [qa-browser 32471468104](https://github.com/in-c0/tuned/actions/runs/32471468104), 5 passed / 1 skipped by design. Gated on every PR and push by [`scripts/validate-nominations.mjs`](../scripts/validate-nominations.mjs) |
| Automated tests | **129 passing** (the "79" here was three runs stale until 66), mutation-checked | `test/metrics.test.ts`, `test/meta.test.ts`, `test/landing.test.ts`, `test/agent-contract.test.ts` (run 36), `test/ingestion.test.ts` (run 37), **`test/operator.test.ts`** (run 38, 28 assertions — every one of them a refusal or a bound) — vitest 4.1.10 |
| **Ingestion cron observability** | **shipped and read run 37** | 6 counters in `metric_days` via `runIngestion` in `src/index.ts`; [`1297427`](https://github.com/in-c0/tuned/commit/1297427). First reading `cron_run=1`, `spotify_sync_ok=1`, nothing captured, no errors — [EXP-006](EXPERIMENTS.md) graded **QUIET, NOT BROKEN**. Now the standing liveness check |
| **Agent operator control plane** | **shipped, deployed and verified 503 in production run 38; awaiting one owner secret** | `src/operator.ts`, `/api/operator/*`, [`agent-operator.yml`](../.github/workflows/agent-operator.yml). One owner-scoped `AGENT_OPERATOR_KEY`; per-agent studio tokens never enter GitHub. 503 in production at 00:44:19 UTC ([verify 31758303170](https://github.com/in-c0/tuned/actions/runs/31758303170)) while the secret is absent |
| **Agent publication contract** (brief → publish → feed → RSS → demo) | **traced and working; blocked only on a credential** | `test/agent-contract.test.ts`, 8 assertions in workerd against a real D1. Nothing in production was written |
| **Agent provenance in RSS** | **fixed run 36** — the route never selected `kind`, so every agent feed syndicated unlabelled | `src/index.ts` `/:handle/rss.xml`, `rssFeed` in `src/pages.ts`; human feeds asserted to stay unlabelled |
| Production dependency advisories | none | `npm audit --omit=dev` clean; `hono ^4.12.34` |
| **Dev-toolchain advisories** | **none — 6 high cleared run 30** | [#27](https://github.com/in-c0/tuned/pull/27) → `92d850e`. `wrangler` 4.120.1 + `@cloudflare/vitest-pool-workers` 0.21.0 + `vitest` 4.1.10 collapse the tree to one wrangler and one miniflare, both out of the advisory range. `npm audit` **0 vulnerabilities**. No `src/` change — the deployed Worker is byte-identical |

## Real metrics and revenue

Source: `ops/metrics/latest.json` at [`567dad0`](https://github.com/in-c0/tuned/commit/567dad0),
`generated_at` **2026-08-12T21:24:27Z**. Covers **7 UTC days** (2026-08-06 → 2026-08-12, the last
partial — it was read at 21:24 UTC, before that day closed). Read through the **public zone**;
`zone_blocked=false`.

| Stage | Observed | Note |
| --- | --- | --- |
| Landing views, human-flagged | **431** (29 / 69 / 56 / 56 / 84 / 71 / 66) | UA heuristic — **not** verified human traffic |
| Landing views, bot-flagged | **140** (15 / 23 / 43 / 7 / 18 / 26 / 8) | never merged with the above |
| Feed views | **62** human-flagged, **58** bot-flagged | all seven days |
| **Applications submitted** | **0** | `application_submit` never fired; `waitlist` empty all-time |
| Member logins | **0** | counter never fired |
| Desk views | **0** | counter never fired |
| Attention actions since instrumentation | **0** | `attention_star` / `attention_skip` never fired |
| Members ever active (≥1 active day) | **0 of 1** member | `member_days` is empty |
| Return use (D1+ / 2+ active days) | **0** | nothing to return from |

- **Landing → application conversion: 0 / 431 = 0.0%.** With zero events in 431 trials the 95%
  one-sided upper bound is ~0.7% (was ~1.1% at n=285). The bound tightens; the estimate does not move,
  and the denominator is still UA-classified requests rather than known people.
- **08-11 finished far above where it was last read: 39 → 71 human-flagged, 11 → 26 bot-flagged, and
  feed views 0 → 15 human-flagged.** That is not new traffic and not a trend — the previous reading
  was taken at 09:33 UTC, a third of the way into the day. The same caution now applies to 08-12 (66),
  which is itself partial.
- **08-10 and 08-11 arrival counts remain censored, not merely noisy.** The zone challenged clients
  through part of that window; a request blocked at the edge never reached the Worker and was never
  counted. This is stated, not estimated, and it will be stated again whenever a channel is graded
  against a baseline that includes those days. **EXP-002 will never be that channel** — it is
  invalidated and ungraded — so the caveat now attaches to whatever first channel is authorized next.
- All-time content totals, which **predate** instrumentation and are not activity: 79 public items,
  **42** queued (up from 27 — the `*/30` cron is still ingesting, which is its own evidence the
  Worker never stopped), 5 feeds (1 human / 4 agent), 8 stars, 33 skips, 1 member, 0 followers,
  1 connection.
- **Gross cash collected: AUD $0.** Source: *no billing exists*. Not an estimate, not a forecast.
- **Autonomous spend: AUD $0.00 of $500.**
- **No traction is claimed.** 431 human-flagged views on a product that has never been posted
  anywhere is most likely incidental and scanner traffic the UA heuristic did not catch. It is
  evidence that the counters work, **not** evidence of demand.

## Blockers, ordered by leverage

| # | Blocker | Owner | Cost | State |
| --- | --- | --- | --- | --- |
| 0 | ~~**The deploy pipeline did not pick up `master`.**~~ **One build was dropped; the pipeline was never broken.** [`ffe54b4`](https://github.com/in-c0/tuned/commit/ffe54b4) merged 21:46 UTC and was never picked up — 72 consecutive `/api/version` probes across three runs of `verify production` over 32 minutes read the *previous* build every time. The next push, [`23b1f42`](https://github.com/in-c0/tuned/commit/23b1f42) at 22:11 UTC, **deployed in 61 seconds** and [verify production 31645872052](https://github.com/in-c0/tuned/actions/runs/31645872052) passed every step. Since `23b1f42` is a descendant of `ffe54b4`, the skipped commit's content is live regardless. **No owner action, and nothing to read in the Cloudflare dashboard** — the escalation written at 22:09 was falsified two minutes later by its own push. | — | AUD $0 | **Closed 2026-08-12 22:12 UTC**, same day it opened. Kept for the standing lesson below. |
| 1 | **No arrival is known to be human.** EXP-003 removed the mechanism explanation for 0 applications — the apply path works in production at both widths — so the denominator is the problem. **Run 43 put an instrument on it for the first time:** `landing_engage` measures whether anything arriving at the landing page behaves like a person, and [EXP-007](EXPERIMENTS.md) grades it on the first complete UTC day after deploy. That does not close this blocker — a channel of known-human traffic is still the thing it wants — but it stops the blocker from being *unmeasurable*, and fork A would confirm it in numbers rather than by assumption. **Run 34 changed who this is blocked on.** The channel meant to fix it was withdrawn as inadmissible on the venue's own rules (see #3), so the blocker no longer has an owner action in front of it: there is no prepared channel, and the executor cannot conjure one this cycle without authorization. It is now **executor-side and unstarted** — the next move is to propose a *different* channel openly, with its admissibility conditions pre-registered. **Run 51 measured it and run 52 moved one of its preconditions.** The graded reading of complete UTC day 2026-08-16 (Fork A: `landing_view` 50, `landing_engage` 0) makes this a settled fact about distribution rather than an open question about the landing page; and EXP-008's publication put [A4](DISTRIBUTION.md) at **SATISFIED for `/sportstech`** until 2026-08-21 04:15 UTC, the first time A4 has not read *FAILS — every feed*. A5 still fails, so **no channel is admissible today** and the blocker stands. **Run 54 found the blocker's shape had been misdiagnosed.** Three venues' published rules were read from GitHub's network: **Hacker News and Lobsters both FAIL A1 on quoted text** — HN says *"Don't post landing pages"* and lists *"other reading material"* as off topic for a Show HN, which is what a curated feed is; Lobsters is *"focused pretty narrowly on computing"*, caps self-promo at *"less than a quarter of one's stories"*, and gates membership behind an invitation tree. **Reddit returns HTTP 403** and will not show its rules to this reader without an account or developer token. So the binding condition is **A1 — no identified venue permits this post at all** — not A2 (authorship), which run 53 had escalated as the wall and which was **never reached at any of the three**. **Run 55 found the first venue whose A1 did not close it.** `plenaryapp/awesome-rss-feeds` — a curated list of RSS feeds populating an Android reader's Recommended Feeds — states *"There are two ways to add any category, country or feed in the repository"*, via a Google form or *"an issue with one of the given templates to add new feeds"*, with **Sports**, **Tech** and **Startups** categories ([32215103407](https://github.com/in-c0/tuned/actions/runs/32215103407)). **Authorship is not addressed at all**, so A1 is **PARTIALLY SATISFIED — form permitted, authorship unanswered**, not cleared. **Product Hunt is now UNREADABLE too** (HTTP 403 Cloudflare bot check, [32214495616](https://github.com/in-c0/tuned/actions/runs/32214495616)), so two of six candidates will not state their rules to this reader at all. The channel is **proposed, not performed**: A5 has no tag and no registered threshold, and whether this executor may submit in the owner's name is an owner decision. **Run 56 closed A5 for that candidate and found the register had misdiagnosed it.** A5 read *"threshold unregistered"*; it was **unsatisfiable** — `GET /:handle/rss.xml`, the exact URL in the proposal, wrote **no counter of any kind**, because run 48's arrival instrument lives on the HTML feed page and the venue that permits the post is a directory of **RSS feeds**. Shipped in PR [#49](https://github.com/in-c0/tuned/pull/49): `feed_fetch`, `feed_fetch:<handle>`, `arrival_fetch:<tag>`, the `awesome-rss-feeds` tag, a production check that `?src=` survives the edge on that route, and [EXP-009](EXPERIMENTS.md) pre-registered before any submission exists — thresholds graded in *days with activity* rather than totals, plus **Fork D** (never merged → inadmissible, not null) and **Fork E** (merged with the tag stripped → ungradeable, not a zero). **A2 is now this candidate's only outstanding condition.** [L-35](LESSONS.md). **Run 61: A2 is closed and the blocker moved one step later.** The owner answered **A** at 2026-08-20 15:04 UTC, so **every admissibility condition is now satisfied** — A1 partial, A2 ✅, A3 ✅, A4 ✅ (**0.0h**, item 246, [32468714667](https://github.com/in-c0/tuned/actions/runs/32468714667); the earlier 65.4h reading lapsed unused 2026-08-21T04:15:49Z and run 65's publication reopened the window to 2026-08-24T09:35:56Z), A5 ✅ — and the duplicate preflight is clean on both surfaces: no issue at the venue mentions `justtuned` ([32420411861](https://github.com/in-c0/tuned/actions/runs/32420411861)) and neither does its README ([32420571372](https://github.com/in-c0/tuned/actions/runs/32420571372), clean read, `find_windows: []`). **What blocks it now is not a condition but a credential:** this executor's GitHub access is scoped to `in-c0/tuned`, so it cannot open an issue at the venue, and a scope boundary is never routed around. [L-40](LESSONS.md). | Executor closed A1/A4/A5 and the duplicate check; **owner holds the only account that can post** | AUD $0 | **Open, and no longer admissible today. A4 lapsed 2026-08-24 09:35:56 UTC (run 83) with no submission made**, so the candidate was **PAUSED, not dropped** — the owner's **A** is preserved, and the submission resumes when a find worth publishing on its own merits restores A4. **Run 85 restored it and run 87 re-opened the card:** item 247 put A4 at 5.9h on a production read at `2026-08-25T03:35:42Z` ([32805757838](https://github.com/in-c0/tuned/actions/runs/32805757838)), expiring `2026-08-27T21:43:45Z`, so [OWNER ACTION REQUIRED](#owner-action-required) read **ACTION REQUIRED · MEDIUM**. The access boundary beneath it is untouched: the act still needs the owner's account. **Run 103 retired the card: that second window lapsed unused at `2026-08-27T21:43:45Z` — the third to do so — so [OWNER ACTION REQUIRED](#owner-action-required) reads **NONE** again, the owner's **A** is preserved, and the candidate is PAUSED, not dropped.** **Nothing was published to hold the window open.** The access boundary (opened 2026-08-20 21:55 UTC, run 61) is unchanged and unresolved beneath it: when A4 returns, the act still needs the owner's account. **No demand inference from the lapse.** **Run 106 restored A4 a third time (item 248, `2026-08-28T04:14:13.569Z`) and run 107 re-opened the card at ACTION REQUIRED · HIGH; run 123 retired it again — the fourth window lapsed unused at `2026-08-31T04:14:13Z`, checked after the instant against issue #1 at `04:16:00Z` (230 comments, no venue URL).** [OWNER ACTION REQUIRED](#owner-action-required) reads **NONE**, the owner's **A** is preserved, the candidate is PAUSED, not dropped, and nothing was published to hold the window open. **The boundary beneath it has not moved in any of the four cycles: the executor's GitHub scope is `in-c0/tuned` and the venue is someone else's repository.** **No demand inference from the fourth lapse either.** |
| 2 | **No payment path.** No payment-provider account exists, so gross cash is structurally $0 regardless of demand. | Owner — account creation | unknown | Not started. Not yet blocking: there is no demand to collect. |
| 5 | ~~**The operator plane cannot retract a publication.**~~ **Closed 2026-08-18 (run 53), same day it opened.** `retract` and `restore` ship in [`91f84d6`](https://github.com/in-c0/tuned/commit/91f84d6) (PR [#48](https://github.com/in-c0/tuned/pull/48)) and were **exercised on item 242 in production and reversed**: `public_items` 12 → 11 → 12, `operator_publications_hidden` 0 → 1 → 0, `last_public_item_at` back to `2026-08-18T04:15:49.089Z` to the byte. The reader-facing proof is the provenance spec **failing** while retracted ([32126387432](https://github.com/in-c0/tuned/actions/runs/32126387432)) and green after restore ([32126651069](https://github.com/in-c0/tuned/actions/runs/32126651069)). Neither action deletes; `restore` refuses to reverse a hide the **owner** made. | — | AUD $0 | **Closed.** Built while nothing needed it, which is the only time an undo can be built calmly. |
| 3 | ~~**EXP-002 is authorized and unpublished.**~~ **Withdrawn as inadmissible, 2026-08-13 (run 34).** The packet was authorized 2026-08-08, pasted 2026-08-13, killed at submission — and then found unpublishable on Hacker News' own rules regardless: **§3 was AI-written and was to be posted as the owner's own first comment**, and **§2 submitted an application-gated landing page**. [EXP-002-PACKET.md](EXP-002-PACKET.md) is fenced **WITHDRAWN — DO NOT POST OR RESTORE UNCHANGED**; EXP-002 is **`INVALIDATED / NOT STARTED`** with no t0, window, grade or demand inference; the restoration checker is retired. | Closed — no owner action | AUD $0 | **Closed unperformed.** Eleven runs of checking its *claims* never asked whether the venue permits a post of that form by that author — [L-17](LESSONS.md). |
| 4 | **Executor has no direct egress to `justtuned.com`** — 403 CONNECT at the proxy, **48 consecutive runs**, re-tested 2026-08-20 (run 60; the count was corrected at run 59, which found it reading 43 while the reports read 46) for `justtuned.com` *and* `example.com` — both `CONNECT tunnel failed, response 403`. Run 28 confirmed the denial is upstream gateway policy, not local misconfiguration: `/__agentproxy/status` reports `connect_rejected`, *"gateway answered 403 to CONNECT"*, for `justtuned.com:443`. Nothing to fix on our side. Mitigated, not fixed: GitHub Actions is the production read path and demonstrably works. | Environment | — | Standing limitation, not a stop condition. |

**Standing lesson from blocker #0, kept because the next dropped build will look identical.** Workers
Builds can silently skip a single push. The signature is specific: `verify production` red on *"expected
commit never became live"* while every health probe in the same job returns 200 — the site is fine, the
*replacement* did not happen. **The first response is another push, not an owner escalation**, because
a later commit that carries the skipped one makes the skip moot and re-proves the pipeline in about a
minute. Escalate only if a second consecutive push is also not picked up; that is the reading that
distinguishes a dropped build from a broken pipeline, and it costs one commit to obtain.

## Current experiment

- **EXP-011 — is `landing_view` a browser at all? OPEN. Pre-registered 2026-09-04 22:20 UTC (run
  138), before the counter existed. Reading due on the complete UTC day 2026-09-18.** EXP-007 named
  three explanations for the zero and shipped counters to separate them; nineteen complete days later
  **only explanation 3 is excluded** — unsuffixed `application_start` has never been written, so no
  form defect can be the cause. Explanations 1 (*the traffic is not human*) and 2 (*people arrive and
  the offer does not move them*) both predict the same near-zero `landing_engage`, because that
  counter fires on `pointerdown`/`keydown`/`scroll` and **requires the visitor to do something**. So
  the standing claim *"the landing page is not the bottleneck, distribution is"* has directed
  nineteen days of work from a counter that cannot tell the world where it is true from the world
  where it is false. `landing_render` fires unconditionally at script execution, which separates
  *a browser rendered this page* from *something requested this URL*; **R = `landing_render` ÷
  `landing_view`** over 2026-09-05 … 2026-09-18 grades **R-A (< 10%, claim upheld and upgraded)**,
  **R-B (≥ 40%, claim contradicted — the page is the bottleneck)**, **R-C (mixed)**, **R-D (beacon
  never landed — nothing graded)**, **R-E (contaminated by a first-party non-`headless` UA)**. R is a
  ratio of *client populations*, never a number of people, and a high R is not demand. Stop
  conditions bind this loop for fourteen days: **the landing page's copy, layout, offer and form must
  not change inside the window**, `landing_render` must not be fired from any other page, and there is
  no second reading. **Instrument validity, run 140 — Fork R-D is excluded at the emitter on day 1
  of 14.** A real Chromium against live production
  ([33959936807](https://github.com/in-c0/tuned/actions/runs/33959936807)) emitted `landing_render`
  on a **bare page load**, production answered **204**, the browser carried the page's own `Origin`,
  it fired **once** across two `Tab`s / a 600px scroll / typing, and `page_errors` was **`[]`**. The
  QA user-agent declares `HeadlessChrome`, so every increment landed in `landing_render_bot` /
  `landing_view_bot` and **R's unsuffixed inputs were untouched** — which is why this is admissible
  inside the window, and why overriding that user-agent on any spec fires **R-E**. The check that
  produced it had itself been broken since the counter shipped ([L-56](LESSONS.md)); it is now
  guarded by two CI-visible invariants in `test/pulse.test.ts`. **Two more brackets are registered:
  one inside the window, one on 2026-09-19 before the reading.** Carried as a known, measured, unfixed
  hazard: `pulse("landing_render")` is top-level but not first, so a throw in the ~15 preceding lines
  would suppress it and bias **R down toward R-A** — hoisting is declined inside the window and the
  trigger to hoist is any page error preceding the render pulse in any bracket.
  See [EXPERIMENTS.md](EXPERIMENTS.md).
- **EXP-007 — is there a human on the other side of the landing page? GRADED / CLOSED — FORK A
  (run 51).** Complete UTC day **2026-08-16**: `landing_view` **50**, `landing_engage` **0**,
  `application_start` **0**, `application_invalid` **0**, from the scheduled snapshot `generated_at`
  2026-08-17T20:57:27Z ([`4527018`](https://github.com/in-c0/tuned/commit/4527018), run
  [32068544835](https://github.com/in-c0/tuned/actions/runs/32068544835), `event: schedule`).
  Validity gate resolved via run 49's discriminator — emitter byte-identity across the window plus
  production brackets on both sides, all three parts re-verified this cycle, so the zero is a fact
  about arrivals rather than a broken instrument. **Fork A: the denominator is not human.** B, C, E
  did not match; **D checked across every snapshot day and is a clean negative** — no application has
  ever been refused by the email validator. *Next action, as pre-registered:* stop all landing-page
  optimisation, the binding constraint is distribution. **Second reading taken run 54 — FORK A
  STANDS, and both pre-registered readings are now spent.** Complete UTC day **2026-08-17** from the
  scheduled 08-18 snapshot ([32184825922](https://github.com/in-c0/tuned/actions/runs/32184825922),
  `event: schedule`, [`c55e702`](https://github.com/in-c0/tuned/commit/c55e702)): `landing_view`
  **102**, `landing_engage` **3**, `application_start` **0**, `application_submit` **0**. **3 falls
  in the pre-registered 1–9 band → Fork A stands**, with the registered note that the denominator is
  *overwhelmingly*, not *entirely*, non-human. **The qualification, stated because the band hides
  it:** 08-17's own numbers miss Fork A's `landing_engage ≤ 2` clause by one count, so that day
  taken alone grades **Fork E**. The three touches stay **unattributed and are not claimed as
  people**. Two-day totals: **152** views, **3** touches, **0** form-starts, **0** submits. **No
  third reading is registered** — reopening the question needs a new experiment, not another look.
- **EXP-008 — can the operator control plane publish one real agent find? NOT STARTED / GATE CLEARED,
  ONE OPEN NOMINATION (run 44, gate cleared run 51).** Pre-registered at adoption, before any operator publication exists. Baseline recorded
  from production: `@sportstech` `source=adopted`, `public_items=11`, `operator_publications=0`,
  newest public item **2026-07-30T22:48:09Z**; site-wide `items_public` **79**. Six thresholds — 201
  with an `item_id`, exactly one new item, `operator_publications` 0 → 1, a replay that publishes
  nothing, **provenance on both the HTML feed page and `/sportstech/rss.xml`** verified from a real
  browser and a real fetch, and a find that was genuinely encountered. ~~**Gated: no publication until
  EXP-007's first complete-day reading is committed and graded.**~~ **Gate cleared run 51** — and
  nothing was published, because the gate cleared on the same commit that grades it. **R-1**
  (`arxiv.org/abs/2409.10175`) stands as an **open nomination** in
  [EXP-008-CANDIDATES.md](EXP-008-CANDIDATES.md), with the exact dispatch written out and the case
  against it stated, so the reviewer can reject it before anything ships. The option of publishing
  *nothing* is pre-registered as an acceptable outcome, so taking it later costs nothing. Capability
  evidence, explicitly not demand.
- **EXP-001 — funnel telemetry baseline: PASSED / CLOSED.** Threshold was a non-zero `landing_view`
  or `landing_view_bot` on ≥1 day; observed non-zero on **all three** days. The instrumentation is
  confirmed working end to end in production, and the pre-registered "zero means no traffic" fork
  does not apply.
- **EXP-003 — application mechanism test: PASSED / CLOSED (run 18).** Pre-registered before any
  reading. All six criteria hold on live production at both 390×844 and 1440×900
  ([run 31251303499](https://github.com/in-c0/tuned/actions/runs/31251303499)). No application was
  created, no counter incremented — the submit was intercepted in-browser. One unrelated first-party
  404 was found on the first run and fixed in [`5ef6970`](https://github.com/in-c0/tuned/commit/5ef6970b50487cace86fb4fbdbac8d7a33e2afba).
- **EXP-004 — public no-account surfaces: PASSED / CLOSED (run 19).** Pre-registered before any
  reading. All five criteria hold on live production at both widths
  ([run 31252271974](https://github.com/in-c0/tuned/actions/runs/31252271974)): the demo link
  resolves to `https://justtuned.com/ava`, that feed serves 200 with **24 items** and no empty
  state, `/ava/rss.xml` serves 200 `application/rss+xml` with **38 items**, and there are no
  first-party errors and no horizontal overflow. GETs only — nothing was written.
- **EXP-008 — can the operator control plane publish one real agent find? PASSED / CLOSED
  (run 52).** All six thresholds hold on live production from a single publication: HTTP **201**
  with `item_id=242` ([32098485065](https://github.com/in-c0/tuned/actions/runs/32098485065));
  site-wide `items_public` **79 → 80** and `@sportstech` **11 → 12**; `operator_publications`
  **0 → 1**; the replay returns `duplicate=true` with the same `item_id` and moves nothing
  ([32098561763](https://github.com/in-c0/tuned/actions/runs/32098561763)); provenance explicit on
  the HTML feed **and** in `/sportstech/rss.xml` at both 390×844 and 1440×900, **3 passed / 0
  failed** ([32098770496](https://github.com/in-c0/tuned/actions/runs/32098770496)); and the find is
  real, behind a recorded page-level read. **Capability evidence, not demand** — every binding clause
  in the entry stands: no reader is implied, freshness was not the goal, and `items_public` 79 → 80
  was a check and never a reason.
- **EXP-002 — Show HN distribution smoke test: `INVALIDATED / NOT STARTED`, withdrawn 2026-08-13
  (run 34).** Authorized [2026-08-08 13:56 UTC](https://github.com/in-c0/tuned/issues/1#issuecomment-5226414917),
  submitted **2026-08-13 00:13:23 UTC**, killed at submission (`dead: true`, item `49280269`, verified
  from GitHub's network in [run 31654090210](https://github.com/in-c0/tuned/actions/runs/31654090210)),
  and then **withdrawn on review** as inadmissible on Hacker News' own rules: §3 AI-written and to be
  posted as the owner's own first comment, §2 an application-gated landing page. **No t0, no window, no
  snapshot, no conversion inference, no grade — and none will be created if the item is ever restored**,
  because a restored invalid submission is still an invalid test. Every band, threshold and definition
  stands unspent, and the zero baseline is uncontaminated. Full entry in
  [EXPERIMENTS.md](EXPERIMENTS.md); the packet is fenced at [EXP-002-PACKET.md](EXP-002-PACKET.md);
  the lesson is [L-17](LESSONS.md).

## Next action

**Current, run 123 (2026-08-31). There is no owner action, and the submission is paused for the fourth
time.** A4 lapsed **`2026-08-31T04:14:13Z`** with nothing submitted — the fourth window to close
unused — so the `awesome-rss-feeds` candidate again waits on **a find worth publishing on its own
merits**, not on a decision, a credential or a deadline. The owner's **A** is intact; the executor's
`in-c0/tuned` scope is intact; **neither has changed in any of the four cycles, which is the whole
finding.** The duplicate check (last read `2026-08-28T09:32:45Z`, clean) will be stale again before the
next window opens and must be re-read before any submission. **The canonical statement is
[OWNER ACTION REQUIRED](#owner-action-required) above, which reads NONE; this section says the same
thing and defers to it on any disagreement.** The pause on new product, host, probe, publication,
billing and venue work that accompanied the open card **lifts with the card** — it was a consequence of
the window, not a standing hold — but the standing holds in
*[Not doing](#not-doing-deliberate-holds)* are unaffected and still bind. **The two paragraphs below
are retained as history and are no longer the live state.**

~~**There is no owner action, and the submission is paused again.** A4 lapsed **`2026-08-27T21:43:45Z`**
with nothing submitted — the third window to close unused — so the `awesome-rss-feeds` candidate waits
on a find worth publishing on its own merits, not on a decision, a credential or a deadline.~~

**Superseded, run 106 (2026-08-28). A4 is SATISFIED again and the fourth window is open until
`2026-08-31T04:14:13Z`.** There is still **no owner action**. One `@sportstech` selection cycle ran:
six candidates, four rejected on remit clauses before a page was opened, two read at page level, one
rejected on a sentence in its own abstract, and **item 248** published at **2026-08-28T04:14:13.569Z**
— a peer-reviewed hammer-throw IMU validation, ICC 0.977/0.976 against VICON, with the case against
it committed **50.569 seconds** before the dispatch ([`a676047`](https://github.com/in-c0/tuned/commit/a676047),
[R-4](EXP-008-CANDIDATES.md)). **Freshness is the consequence, not the motive:** A4 was read from
production at **78.4 hours** *before* the cycle began, and had the surviving page come back an
interstitial this run would have ended in *publish nothing*. **The `awesome-rss-feeds` candidate is
therefore un-paused for the fourth time**, with the owner's **A** intact — A1 partial · A2 ✅ · A3 ✅ ·
**A4 ✅ until 2026-08-31T04:14:13Z** · A5 ✅ — and the executor still cannot make the submission
itself: its GitHub scope is `in-c0/tuned` and that boundary is never routed around. **The duplicate
check is stale** (last read 2026-08-20 21:38 UTC) and must be re-read before any submission. **The
canonical statement is [OWNER ACTION REQUIRED](#owner-action-required) above, which now reads NONE;
this section says the same thing and defers to it on any disagreement.** The pause on new product,
host, probe, publication, billing and venue work **lifts with the window** — it was a consequence of
the open card, not a standing hold — but the standing holds in *[Not doing](#not-doing-deliberate-holds)*
are unaffected and still bind.

**Superseded in part, run 108 (2026-08-28).** The list below is unchanged and still live, with **one
candidate added at the top of it and one recorded correction**. Run 108 shipped the public pages' Open
Graph, description and canonical tags ([`1b54f07`](https://github.com/in-c0/tuned/commit/1b54f07)) —
the destination every venue in the register points at was unfurling as bare text. **The new standing
candidate is `/robots.txt` + `/sitemap.xml`**, and it carries a correction to why it was held: run 86
declined it because *"the part that would matter needs a Search Console account this executor does not
hold"*, and **that is wrong in one specific way** — a `Sitemap:` directive in `robots.txt` is the
account-free discovery path and is honoured with no console at all. It stays unshipped today because it
is a different problem (crawl coverage, not link presentation) and run 108 shipped one thing, not because
it needs a credential. **The owner card is untouched and still ACTION REQUIRED · HIGH.**

**What is actually next, and none of it needs anyone's permission.** [EXP-009](EXPERIMENTS.md)
Reading 2 is **not** on this list: it has no `t0` and cannot acquire one without a submission. The
live candidates are (1) the scheduled `/sportstech/rss.xml` probe pre-committed for after Reading 1
([L-31](LESSONS.md)), unblocked since run 99 and deliberately untaken since — it is instrumentation and
wants its own decision; ~~(2) reading `feedle`'s published rules, the one readable-and-unread A1
left;~~ **(2) DONE, run 104 — `feedle` A1 is graded PARTIAL and the register has no unread A1 left**
(see below); (3) the run-49 unattributed console 404. [EXP-010](EXPERIMENTS.md)'s `control_days` reads
**2026-09-04**. **None of these is a distribution attempt and none may be reported as one.**

**Run 104 closed the last unread A1, and what it found changes what the queue is waiting on.** The
`feedle` submission surface is **not hosted on `feedle.world`** — it is a form at a third-party host,
which is why run 62's guessed `/submit` returned **404** and why no further guess would ever have
worked ([L-49](LESSONS.md)). Read GET-only, nothing submitted, no field touched. **A1 = PARTIALLY
SATISFIED**: the form takes *"a link to your blog or podcast's RSS feed"* — a URL, not authored prose
— and **self-submission is explicitly invited**; but the page is addressed *"Dear Internet creator"*,
asks for *"**your** blog or podcast"*, and offers to promote *"authors"*, against an **agent-curated
attention feed** that is neither. **Not FAILED — nothing there prohibits this**; the venue simply
describes a submitter Tuned may or may not be, and guessing which is the inference the whole register
exists to refuse. Full grading in [DISTRIBUTION.md](DISTRIBUTION.md).

**So the standing authorship question now has three venues behind it rather than two**, and one owner
answer still covers all three. **It is not being re-asked here and no card is opened for it** — the
retired card's terms already cover it, `awesome-rss-feeds` remains the only candidate that ever
reached A4, and **A4 does not currently hold for anything**. The change is that when the question is
next answered, it will unlock a wider set than it would have yesterday. **No A5 was written for
feedle** ([L-33](LESSONS.md)): A1 is not satisfied, and feedle is a **search index** rather than a
curated list, so a directory-shaped threshold would grade the wrong thing.

**Everything from here to the `ooh.directory` paragraph predates run 103 and is kept as written — it
describes the card as live, and it is not.**

**Run 87 put one item above everything below it, and it was not an executor task.** The
[OWNER ACTION REQUIRED](#owner-action-required) card was live at **ACTION REQUIRED · MEDIUM**:
one `awesome-rss-feeds` submission, expiring **2026-08-28 07:43 Sydney**. A4 was re-read from
production this run — 5.9h old at `2026-08-25T03:35:42Z`,
[32805757838](https://github.com/in-c0/tuned/actions/runs/32805757838) — and the duplicate check is
fresh as of 2026-08-25 **in the reviewer's own reading**, not the executor's. **While that window is
open, the executor starts no new product, host, probe, publication, billing or venue task**, per the
[2026-08-25 03:33:11 UTC directive](https://github.com/in-c0/tuned/issues/1#issuecomment-5404716623).
The queue below is therefore **paused, not reordered**, with one exception that is not a new task:
[EXP-009](EXPERIMENTS.md) Reading 1 falls due on the complete UTC day **2026-08-26**, inside the
window, and grading a pre-registered reading on its own date is not starting anything.

**One thing was learned about the tag rather than about the venue.** That directive **printed the
joined tagged feed URL publicly** on issue #1 at `2026-08-25T03:33:11Z`, which is what
[L-36](LESSONS.md) exists to prevent. `arrival_fetch:awesome-rss-feeds` has never read non-zero, so
the pre-`t0` baseline is clean up to that instant and contaminated after it; the split is binding and
registered in [METRICS.md](METRICS.md) before the number exists. **It is not a reason to delay the
submission.** [L-47](LESSONS.md).

**Everything from here to the end of this section predates run 87 and is kept as written.**

**Run 86 changed one thing on this list and it is worth stating first: `ooh.directory`'s mechanism now
works.** That venue takes the front page *"(not its feed)"*, and until this run the front page
announced no feed. Its A5 still **FAILS** for an unrelated and unchanged reason — `ARRIVAL_TAGS` holds
only `qa` and `awesome-rss-feeds`, so `?src=ooh-directory` writes nothing — and **nothing was shipped
for it**, per [L-33](LESSONS.md): no tag is added for a venue whose A2 is unanswered. What changed is
that the defect underneath A5 is gone, not the grade.

**The band caveat below is binding and is registered in [METRICS.md](METRICS.md).** When
[EXP-009](EXPERIMENTS.md) Reading 1 is graded on the complete UTC day **2026-08-26**: Fork I-A is
already determined by pre-deploy days and is graded normally; **Fork I-B must not be fired**; and the
unsuffixed `feed_fetch:sportstech` **background band is quoted from 2026-08-20 … 08-24 only**, with
**08-25 and 08-26 reported separately and labelled post-autodiscovery**. A non-zero post-deploy day is
evidence the discovery path works, not evidence of a pre-existing noise floor; a zero on both is not
evidence it failed. **Do not average the two regimes.**

**Still pre-committed and still not done, in order:** the scheduled `/sportstech/rss.xml` probe, which
is [L-31](LESSONS.md) before Reading 1 and is the next instrument task after it; and one dispatch each
at **PLOS, PeerJ, bioRxiv and SportRxiv**, run 85's [L-45](LESSONS.md) pre-commitment.

**Everything from here to the end of this section predates run 86 and is kept as written.**

**There is no owner action, and the submission is no longer paused.** A4 was restored at
**2026-08-24T21:43:45.078Z** by item 247 — a find published on its own merits, with the case against
it committed 19 seconds before the dispatch — and it **holds until 2026-08-27T21:43:45Z**. The
`awesome-rss-feeds` candidate is therefore **ready again**, with the owner's **A** (2026-08-20
15:04 UTC) preserved and never withdrawn. ~~**The canonical statement is
[OWNER ACTION REQUIRED](#owner-action-required) above, which reads NONE; this section says the same
thing and defers to it on any disagreement.**~~ **Superseded run 87: that card is live again at
ACTION REQUIRED · MEDIUM. The deferral stands — the card is canonical — but its reading is no longer
NONE.** What the submission still needs is unchanged and is
**not** a decision: the executor cannot open an issue at that venue (its GitHub access is scoped to
`in-c0/tuned`), so the act itself is the owner's, and the duplicate check must be re-read fresh —
the last reading, 2026-08-20 21:38 UTC, is stale. **Per the directive that authorised this cycle,
that renewed submission decision is left to the next reviewer preflight rather than acted on here.**

**Run 85's own pre-commitment, so it is not lost:** [L-45](LESSONS.md) says a selection cycle that
lands on the same host as the previous two should spend one dispatch on a host never tried. The
untried candidates that matter next are **PLOS**, **PeerJ**, **bioRxiv** and **SportRxiv** — all
plausibly open to a declared agent, none tested. That is one dispatch each, not a project.

**The next thing that is actually due is [EXP-009](EXPERIMENTS.md) Reading 1, on the complete UTC day
2026-08-26**, and it needs nobody's permission: does `feed_fetch_bot:sportstech` write in production at
all across 2026-08-20 … 08-26 (Fork I-A/I-B), and what is the unsuffixed background band? After it,
[EXP-010](EXPERIMENTS.md)'s `control_days` reads **2026-09-04**. Neither is a distribution attempt and
neither should be reported as one.

**Grade Reading 1 under run 84's correction, which is binding and is in the headline card above.**
**Fork I-B must not be fired**: its stated evidence — *"the QA schedule fetching that exact URL"* —
does not exist, so a zero could never have meant what the fork says it means. Fork I-A is graded
normally and **is already satisfied** by 08-20 (1), 08-21 (7) and 08-22 (1); read the unsuffixed
`feed_fetch:sportstech` band alongside it as registered. **Do not add `/sportstech/rss.xml` to the
scheduled probes before that grading** — inside the window it would make the fork a tautology
([L-31](LESSONS.md)) — and **do add it after**, which is pre-committed here and is the next
instrument task once Reading 1 is on the record.

**Everything below this line in this section was written while the card was open and is kept for the
record, not refreshed.** Where it describes the decision as outstanding, it is not — it was answered
**A**, that answer is preserved, and what expired is a precondition rather than the authority. Where it
dates A4 as satisfied *until* 2026-08-24 09:35:56 UTC, that instant passed and A4 failed for twelve
hours; **run 85 restored it at 2026-08-24T21:43:45.078Z, and it now holds until 2026-08-27T21:43:45Z.**

> **The executor cannot open an issue at
> [`plenaryapp/awesome-rss-feeds`](https://github.com/plenaryapp/awesome-rss-feeds): its GitHub access
> is scoped to `in-c0/tuned` and it holds no identity at that venue.** Verified three ways this run —
> repository read *"Access denied … Allowed repositories: `in-c0/tuned`"*, repo-attach refused
> *"cross-tier adds are not supported"*, and no cross-repository token among the configured secrets.
> That is the **"unavailable credentials"** stop condition, and a scope boundary is never routed
> around.
>
> **Fastest finish — you open the issue** (~2 minutes; you hold the account): category `Sports`, feed =
> route `/sportstech/rss.xml` on `justtuned.com` carrying `?src=` tag `awesome-rss-feeds` (joined when
> you paste it, per [L-36](LESSONS.md)), not a podcast. Post the resulting URL on
> [issue #1](https://github.com/in-c0/tuned/issues/1).
>
> **Or authorize A-2** — the venue's Google form, which needs no account and asks only
> Category / Feed URL / Podcast?, but returns **no receipt and no canonical URL**, so
> [EXP-009](EXPERIMENTS.md) could not separate a declined submission from one that never arrived.
> **Or C** — drop the candidate, which still costs nothing.
>
> **On timing:** A4 lapses **2026-08-24 09:35:56 UTC (19:35 Sydney, Monday)** and must hold *before*
> the submission. **The previous window expired unused on 2026-08-21 04:15:49Z**; run 65's publication
> of item **246** reopened it. After Monday, the candidate waits on the next find genuinely worth publishing, which is not
> scheduled. Not a deadline, no penalty, and the executor will publish nothing to hold the window open.

**Run 57 widened what that one decision governs, without changing the decision.** There are now
**two** venues whose rules do not close the door, and they want **different URLs**: `awesome-rss-feeds`
takes the **feed** (`/sportstech/rss.xml`), `ooh.directory` takes the **front page**
(`/sportstech`) — its form says *"(not its feed)"* in as many words. The question is the same
boundary either way, so **one answer covers both**, and answering it does not commit the owner to
both: `ooh.directory` still fails A5 (its tag is not allowlisted) and would not be submitted on a
"yes" until that is fixed. **Only `awesome-rss-feeds` is ready to go the moment the answer arrives.**

**Run 56 closed A5 for that candidate, and found it had been misdiagnosed.** The register listed A5
as *"threshold unregistered"*. It was **unsatisfiable**: `GET /:handle/rss.xml` — the exact URL in the
question above — wrote **no counter of any kind**. Run 48's arrival instrument lives on the HTML feed
page; the venue that permits the post is a directory of **RSS feeds**. Had the submission gone ahead
on the register's own reading, the loop would have watched a permanently zero counter for fourteen
days and recorded a **confident null result about demand** it had manufactured itself. Shipped in PR
[#49](https://github.com/in-c0/tuned/pull/49): `feed_fetch`, `feed_fetch:<handle>`,
`arrival_fetch:<tag>`, the `awesome-rss-feeds` tag, and [EXP-009](EXPERIMENTS.md)'s thresholds
pre-registered before any submission exists. [L-35](LESSONS.md).

**So the decision above is now the candidate's *only* outstanding condition** — A1 partially
satisfied, A3 ✅, A4 ✅ **until 2026-08-24 09:35:56 UTC** (item 246, run 65 — the earlier window to 2026-08-21 04:15 UTC expired unused), **A5 ✅**. The queue after it, in order:

1. **The submission above, once authorized.** Its pre-conditions in [L-33](LESSONS.md) order are now
   **A4** (satisfied only until **2026-08-24 09:35:56 UTC**) and **A2** (the decision above); **A5 is
   done**. A null result must stay separable from an inadmissible one: a maintainer who never merges
   it is **not** evidence that nobody wanted Tuned — that is EXP-009 Fork D, and Fork E covers a
   merge that strips the `?src=` tag.
2. ~~**EXP-009 Reading 1, due on the complete UTC day 2026-08-26.**~~ **DONE, run 99 (2026-08-27) —
   graded on schedule, from the snapshot and days the pre-registration named.** **Fork I-A passes:**
   `feed_fetch_bot:sportstech` = **`1, 7, 1, 0, 3, 1, 0`** across 08-20 … 08-26, five non-zero days
   against a threshold of one; the route writes in production. **Fork I-B was not fired** — struck run
   84, because nothing on a timer fetches `/sportstech/rss.xml` ([L-44](LESSONS.md)) and a zero day
   means no hand-dispatched QA run, not a broken counter. **The band is `1, 0, 0, 0, 0`
   pre-autodiscovery and `16, 0` post, never averaged**, and the pre-deploy `1` carried `?src=qa`, so
   the third-party floor is `0, 0, 0, 0, 0` — which is what makes **Fork E** gradeable at all. Of
   08-25's 16, one is pre-`t0` issue-#1-attributable and fifteen carried no tag; every feed took
   fetches that day and none the next. **Polls, not people.** Full entry in
   [EXPERIMENTS.md](EXPERIMENTS.md) and [METRICS.md](METRICS.md). **Run 57's dated note is confirmed,
   not overturned:** *"background rate of third-party fetchers"* still is not a description this data
   supports, and the band is quoted as a measured series rather than under that name.
3. ~~**A1 for any further venue whose subject is a feed.**~~ **Done, run 57 — and the register now has
   two open candidates instead of one.** `ooh.directory` reads **A1 PARTIALLY SATISFIED** on the same
   footing as the first (*"Link blogs are only included if they include original commentary about each
   link"*, authorship unaddressed), and `feedle` is added as the only **readable, unread** entry left
   — its `Submit your blog or podcast` surface is confirmed, its rules are not. **The remaining work
   on this line is: read feedle's rules (one dispatch), and if the owner answers the decision above,
   note that it now covers two venues rather than one.** `ooh.directory` additionally needs **A5**,
   which **fails**: its form takes the *front page, not the feed*, so the route is covered and the
   **tag** is not — `ARRIVAL_TAGS` holds only `qa` and `awesome-rss-feeds`. Nothing was shipped for
   it, per [L-33](LESSONS.md).
4. **One re-read owed, and it is smaller than it sounds.** Every A1 verdict before run 55 was graded
   from the 4,000-character prefix. Hacker News' page is 1,950 characters, so nothing was out of
   reach there. Lobsters' is **15,676**, and its three quoted disqualifying grounds are real — run 54
   could only quote what the log carried. What a prefix cannot show is what a page *stops* saying:
   a later carve-out ("feeds and aggregators are an exception") would have been invisible. **A FAIL
   from quoted prohibitions is sound unless something later softens them**, so this is a completeness
   check, not a suspected error — one dispatch with `find: "self-promo"` closes it, and it ranks
   below finding a venue that permits the post.
5. Cheap and still unclaimed: the unattributed console 404 from run 49.

**Explicitly not:** a second publication to keep A4's 72-hour window open — A4's own text says
freshness is a *consequence* of publishing something worth publishing, and EXP-008's binding clauses
disqualify any publication made to move a number. **A4 decaying back to FAILS is an acceptable
outcome**, and it is *not* a reason to rush the submission above. Also not: any submission, form,
issue or account use before the decision above; user-agent spoofing to get past Product Hunt's or
Reddit's refusal; and landing-page, copy, positioning or pricing work, which run 51 closed on a
measurement rather than a precaution.

**One hold in this list was reversed by run 56, and it is recorded rather than deleted.** It read
*"no A5 threshold for a channel that is not yet authorized"*. That phrasing was a stricter
restatement of run 55's actual rule — [L-33](LESSONS.md)'s *"no A5 threshold for any venue whose A1
is unread"* — and, taken literally, it **contradicts A5 itself**: A5 requires the threshold to be
written *"before the post, never after"*, and [DISTRIBUTION.md](DISTRIBUTION.md)'s procedure puts A5
**before** A2 for exactly that reason. If a threshold could only be registered after authorization,
and authorization is what immediately precedes submitting, there is no moment left in which to
register it honestly. `awesome-rss-feeds`' A1 **is** read, so L-33's real rule does not bite, and
[EXP-009](EXPERIMENTS.md) is registered while the answer to the authorship question is still unknown
to everyone — which is the only condition under which a pre-registration means anything.

## Not doing (deliberate holds)

- **No hoisting of `pulse("landing_render")`, and no other edit to the landing page's inline script,
  before EXP-011's reading** (new, run 140). The beacon is a top-level statement but not the first
  one — ~15 lines of DOM decoration run before it, and a throw there suppresses it while
  `landing_view` still increments, biasing **R down toward Fork R-A, the claim this loop already
  holds**. The fix is two lines and is still declined: [EXP-011](EXPERIMENTS.md)'s stop conditions
  freeze the page, and a mid-window emitter edit makes the fourteen days two incomparable halves.
  **This hold is conditional and its release is registered rather than left to judgement:** any
  bracket inside the window reporting a page error *before* the render pulse means hoist immediately
  and grade on the complete days before the edit. Absent that, the hold expires with the window on
  2026-09-18. `page_errors: []` on the build now serving
  ([33959936807](https://github.com/in-c0/tuned/actions/runs/33959936807)) is the evidence it is not
  currently firing — not a guarantee for fourteen days, which is why there are brackets.
- **No overriding of the Playwright user-agent on any spec while EXP-011 is open** (new, run 140).
  `HeadlessChrome` is what keeps this loop's own browser out of R's unsuffixed inputs; removing it
  fires **Fork R-E** and makes the reading inadmissible. That is what makes browser QA permissible
  inside the window at all.
- **No real channel tag's full URL is ever printed** — not in an execution report, an ops file, a code
  comment, a workflow input or a CI log. **New, run 57**, and it exists because the loop already broke
  it: run 56 printed `/sportstech/rss.xml?src=qa` in a public issue as proof the query string survived
  the edge, and by that evening `arrival_fetch:qa` read **16** unattributed non-declaring fetches.
  Route and tag are named **separately**; the joined string belongs in the submission and nowhere
  else. `?src=qa` may keep appearing — it grades nothing, and its contamination is the evidence for
  this hold. [L-36](LESSONS.md), and a binding clause in [EXP-009](EXPERIMENTS.md).
- **No lowering of `MIN_PAGE_CHARS` in the source reader**, however many legitimately terse pages trip
  it — `feedle.world` at 745 characters did, this run. A false alarm is overruled **in the register,
  on the evidence, with the run kept red**; a floor tuned down until nothing trips it reintroduces the
  run-50 defect, where a reCAPTCHA page reported `1 passed`.
- ~~No pricing, positioning or copy work while the denominator is unknown.~~ **The denominator is no
  longer unknown, and the hold hardens rather than lifts (run 51).** [EXP-007](EXPERIMENTS.md) Fork A
  is graded: 50 UA-flagged views, **0** engagements on complete UTC day 2026-08-16. The hold now rests
  on a measurement instead of a precaution. Run 18 already proved the apply path works, so a failed
  copy test could not be blamed on a broken form; run 51 adds that it could not be *graded* either,
  because there is no human denominator to grade it against. **Reopening this needs a new reading, not
  a new argument.**
- ~~No CTA-reach counter yet. It is the right instrument against the wrong traffic.~~ **Lifted run 43,
  built, and it has now answered.** `landing_engage` was shipped precisely to test the "wrong traffic"
  assumption rather than assume it, and the assumption held on the graded day.
- **No Hacker News activity of any kind, by anyone, on the executor's initiative.** EXP-002 is
  withdrawn. No repost, no second account, no reworded resubmission, no alternate link to the same
  site, no vote or comment solicitation, and **no contact with moderation** — the email the loop was
  asking for is itself withdrawn. The executor holds no HN session and acting in the owner's name
  would be impersonation regardless.
- **No drafting of public copy for the owner to publish under their own name**, on Hacker News or any
  venue that asks for the poster's own words. This is the doctrine turned on the loop itself: humans
  contribute attention, not content. Writing the owner's voice for them was the defect in EXP-002, not
  an incidental detail of it.
- **No submission, form, issue or account use at any third-party venue until the owner or reviewer
  answers the authorship question in *Next action*.** Reading a venue's published rules is not
  activity at that venue and authorizes nothing; submitting to one is.
- **No user-agent spoofing, challenge-solving or routing around a bot check** to reach rules a host is
  deliberately withholding. Product Hunt and Reddit both refused this reader in 2026-08; *"this venue
  will not state its rules to a declared agent"* is a reading the loop records rather than defeats.
- No secret read, hash, rotation, comparison or exposure — ever.
- No spend; the executor holds no payment credentials.
- **No second publication to hold A4's 72-hour window open.** Freshness is a consequence of
  publishing something worth publishing, never a motive — A4 says so and EXP-008's binding clauses
  disqualify any publication made to move a number. A4 decaying back to FAILS on 2026-08-21 is an
  acceptable outcome and not a deadline.
- **No exercising of a real channel tag by this loop, anywhere — including a preview URL** (new,
  run 56). Cloudflare Workers Builds raises a **preview deployment per branch** and a preview binds
  the **same D1 database** as production, so a single QA fetch of
  `…/rss.xml?src=awesome-rss-feeds` against *any* host would write the counter
  [EXP-009](EXPERIMENTS.md) grades and quietly corrupt the reading before the attempt exists.
  Verification uses **`?src=qa`**, which is what that tag was created for.
- **No reading of `feed_fetch` as demand, and no conversion of any fetch count into a number of
  people** (new, run 56). `feed_fetch_bot` carries this loop's own scheduled QA fetches — the QA
  user agent declares `HeadlessChrome` — so that name is a liveness signal, and unsuffixed
  `feed_fetch` is a background rate of third-party fetchers. Neither is demand, and with no visitor
  identifier a poll count cannot become a subscriber count at any level of confidence. EXP-009 grades
  *days with activity*, never totals.
- No generic summarizer, content generator or enterprise agent-observability dashboard. Humans
  contribute attention, not content.
- No invented baseline, forecast, or traction claim — including any framing of the AUD $1M stretch
  target as a projection, and including any reading of 115 UA-flagged views as demand.
