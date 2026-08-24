# Tuned — STATUS

**Last updated:** 2026-08-25 07:47 Sydney (2026-08-24 21:47 UTC), run 85 — **[OWNER ACTION REQUIRED](#owner-action-required):
NONE.** **One `@sportstech` selection cycle ran and published one find — item 247 — and the larger
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

### **NONE.**

**Retired 2026-08-24 09:35:56 UTC on the card's own clock, without being answered.** The submission it
asked for needed A4 — `/sportstech`'s newest public item ≤ 72h — and that window closed at exactly the
instant above (item 246, published 2026-08-21T09:35:56Z). There is nothing for the owner to do, and
nothing was lost that a future publication does not restore.

| | |
| --- | --- |
| **What is preserved** | **The owner's `A`, granted 2026-08-20 15:04 UTC, stands and is not withdrawn.** Authorship of a factual directory submission in the owner's name is settled; it does not need re-asking when the candidate resumes. |
| **What is paused** | The `plenaryapp/awesome-rss-feeds` submission itself. **Paused, not dropped** — the owner did not say **C**, and an unanswered card is not a decision. It resumes when a find worth publishing **on its own merits** restores A4. That is not scheduled and may be days. |
| **What was not done, deliberately** | **Nothing was published to hold the window open.** [EXP-008](EXPERIMENTS.md)'s binding clauses disqualify any publication made to move a number, and A4's decay is a **pre-registered acceptable outcome** in [EXP-009](EXPERIMENTS.md)'s stop conditions. This is the second window to lapse under that rule; the first was 2026-08-21 04:15:49Z. |
| **What may not be concluded** | **Nothing about demand, in either direction.** No submission was authorized-and-made, so [EXP-009](EXPERIMENTS.md) Reading 2 has no t0 and stays ungraded at Fork D's precondition. A window that lapsed is a fact about this loop's schedule, not about strangers. |
| **What the owner may still do at any time** | Open the issue whenever they like — the card below is kept intact for exactly that — but **A4 must be re-read from production first**, and it does not currently hold. There is no clock, no penalty, and no ask. |

**The owner alert is not repeated here.** It was surfaced on runs 61–66 and stood on
[issue #1](https://github.com/in-c0/tuned/issues/1) for four days; re-issuing it after its own
precondition expired would be asking for an act that is no longer admissible.

---

**Previously here, and retired unused — the `awesome-rss-feeds` submission card.** Kept verbatim
below rather than deleted: every reading in it was true when written, and it is the exact card that
resumes when A4 is next satisfied. **Its A4 row is now expired — do not act on it without a fresh
production read.**

### **ONE SUBMISSION. No credential to install, no spend. ~2 minutes.** *(RETIRED 2026-08-24 09:35:56 UTC — A4 lapsed)*

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
| 1 | **No arrival is known to be human.** EXP-003 removed the mechanism explanation for 0 applications — the apply path works in production at both widths — so the denominator is the problem. **Run 43 put an instrument on it for the first time:** `landing_engage` measures whether anything arriving at the landing page behaves like a person, and [EXP-007](EXPERIMENTS.md) grades it on the first complete UTC day after deploy. That does not close this blocker — a channel of known-human traffic is still the thing it wants — but it stops the blocker from being *unmeasurable*, and fork A would confirm it in numbers rather than by assumption. **Run 34 changed who this is blocked on.** The channel meant to fix it was withdrawn as inadmissible on the venue's own rules (see #3), so the blocker no longer has an owner action in front of it: there is no prepared channel, and the executor cannot conjure one this cycle without authorization. It is now **executor-side and unstarted** — the next move is to propose a *different* channel openly, with its admissibility conditions pre-registered. **Run 51 measured it and run 52 moved one of its preconditions.** The graded reading of complete UTC day 2026-08-16 (Fork A: `landing_view` 50, `landing_engage` 0) makes this a settled fact about distribution rather than an open question about the landing page; and EXP-008's publication put [A4](DISTRIBUTION.md) at **SATISFIED for `/sportstech`** until 2026-08-21 04:15 UTC, the first time A4 has not read *FAILS — every feed*. A5 still fails, so **no channel is admissible today** and the blocker stands. **Run 54 found the blocker's shape had been misdiagnosed.** Three venues' published rules were read from GitHub's network: **Hacker News and Lobsters both FAIL A1 on quoted text** — HN says *"Don't post landing pages"* and lists *"other reading material"* as off topic for a Show HN, which is what a curated feed is; Lobsters is *"focused pretty narrowly on computing"*, caps self-promo at *"less than a quarter of one's stories"*, and gates membership behind an invitation tree. **Reddit returns HTTP 403** and will not show its rules to this reader without an account or developer token. So the binding condition is **A1 — no identified venue permits this post at all** — not A2 (authorship), which run 53 had escalated as the wall and which was **never reached at any of the three**. **Run 55 found the first venue whose A1 did not close it.** `plenaryapp/awesome-rss-feeds` — a curated list of RSS feeds populating an Android reader's Recommended Feeds — states *"There are two ways to add any category, country or feed in the repository"*, via a Google form or *"an issue with one of the given templates to add new feeds"*, with **Sports**, **Tech** and **Startups** categories ([32215103407](https://github.com/in-c0/tuned/actions/runs/32215103407)). **Authorship is not addressed at all**, so A1 is **PARTIALLY SATISFIED — form permitted, authorship unanswered**, not cleared. **Product Hunt is now UNREADABLE too** (HTTP 403 Cloudflare bot check, [32214495616](https://github.com/in-c0/tuned/actions/runs/32214495616)), so two of six candidates will not state their rules to this reader at all. The channel is **proposed, not performed**: A5 has no tag and no registered threshold, and whether this executor may submit in the owner's name is an owner decision. **Run 56 closed A5 for that candidate and found the register had misdiagnosed it.** A5 read *"threshold unregistered"*; it was **unsatisfiable** — `GET /:handle/rss.xml`, the exact URL in the proposal, wrote **no counter of any kind**, because run 48's arrival instrument lives on the HTML feed page and the venue that permits the post is a directory of **RSS feeds**. Shipped in PR [#49](https://github.com/in-c0/tuned/pull/49): `feed_fetch`, `feed_fetch:<handle>`, `arrival_fetch:<tag>`, the `awesome-rss-feeds` tag, a production check that `?src=` survives the edge on that route, and [EXP-009](EXPERIMENTS.md) pre-registered before any submission exists — thresholds graded in *days with activity* rather than totals, plus **Fork D** (never merged → inadmissible, not null) and **Fork E** (merged with the tag stripped → ungradeable, not a zero). **A2 is now this candidate's only outstanding condition.** [L-35](LESSONS.md). **Run 61: A2 is closed and the blocker moved one step later.** The owner answered **A** at 2026-08-20 15:04 UTC, so **every admissibility condition is now satisfied** — A1 partial, A2 ✅, A3 ✅, A4 ✅ (**0.0h**, item 246, [32468714667](https://github.com/in-c0/tuned/actions/runs/32468714667); the earlier 65.4h reading lapsed unused 2026-08-21T04:15:49Z and run 65's publication reopened the window to 2026-08-24T09:35:56Z), A5 ✅ — and the duplicate preflight is clean on both surfaces: no issue at the venue mentions `justtuned` ([32420411861](https://github.com/in-c0/tuned/actions/runs/32420411861)) and neither does its README ([32420571372](https://github.com/in-c0/tuned/actions/runs/32420571372), clean read, `find_windows: []`). **What blocks it now is not a condition but a credential:** this executor's GitHub access is scoped to `in-c0/tuned`, so it cannot open an issue at the venue, and a scope boundary is never routed around. [L-40](LESSONS.md). | Executor closed A1/A4/A5 and the duplicate check; **owner holds the only account that can post** | AUD $0 | **Open, and no longer admissible today. A4 lapsed 2026-08-24 09:35:56 UTC (run 83) with no submission made**, so the candidate is **PAUSED, not dropped** — the owner's **A** is preserved, [OWNER ACTION REQUIRED](#owner-action-required) reads **NONE**, and the submission resumes when a find worth publishing on its own merits restores A4. **Nothing was published to hold the window open.** The access boundary (opened 2026-08-20 21:55 UTC, run 61) is unchanged and unresolved beneath it: when A4 returns, the act still needs the owner's account. **No demand inference from the lapse.** |
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

**There is no owner action, and the submission is no longer paused.** A4 was restored at
**2026-08-24T21:43:45.078Z** by item 247 — a find published on its own merits, with the case against
it committed 19 seconds before the dispatch — and it **holds until 2026-08-27T21:43:45Z**. The
`awesome-rss-feeds` candidate is therefore **ready again**, with the owner's **A** (2026-08-20
15:04 UTC) preserved and never withdrawn. **The canonical statement is
[OWNER ACTION REQUIRED](#owner-action-required) above, which reads NONE; this section says the same
thing and defers to it on any disagreement.** What the submission still needs is unchanged and is
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
2. **EXP-009 Reading 1, due on the complete UTC day 2026-08-26** and gradeable without anyone's
   permission: does `feed_fetch:sportstech` write in production at all, and what is the background
   fetch rate? ~~Fork I-B — seven days of silence on a route this loop's own QA fetches on a schedule —
   would mean the instrument is defective and A5 fails again.~~ **Struck run 84: there is no such
   schedule.** Nothing on a timer fetches `/sportstech/rss.xml` — the two scheduled workflows probe
   `/ava/rss.xml` only, and the specs that cover every handle are dispatch-only by design. **Fork I-B
   must not be fired** ([L-44](LESSONS.md)); Fork I-A is graded normally and is already satisfied by
   08-20, 08-21 and 08-22. **Read it against run 57's dated note:**
   the counters' first day shows unsuffixed `feed_fetch` at **16, all tag-carrying and unattributed**,
   so *"background rate of third-party fetchers"* is not a description that survived contact with
   data. The liveness half behaved as registered; the baseline half did not.
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
