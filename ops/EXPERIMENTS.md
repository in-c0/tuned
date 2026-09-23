# Experiments log

Append-only. One entry per bounded experiment. Required fields: hypothesis, baseline, change, success threshold, result, decision. Never record a result that is not sourced from real data.

## Every fork carries its next action, registered with the threshold

**A fork that states a reading and stops is half a pre-registration.** Write `*Next action:* …` into
every fork at the moment the thresholds are set — including, and especially, the null forks, the
"inadmissible" forks and the "no reading available" forks. Enforced by
[`scripts/experiment-forks.test.mjs`](../scripts/experiment-forks.test.mjs).

*Why this is a rule and not a style note.* On 2026-09-14 (run 159) eleven of thirty-two registered
forks had no action attached, and they were not a random eleven: **every one was a null, an
inadmissible or a no-reading fork.** This loop had written down in detail what to do when an
experiment tells it something, and left blank what to do when it tells it nothing — and nothing is
the outcome it has actually received. EXP-002 was killed at submission; EXP-009 has never acquired a
t0; EXP-010 graded to a null; A4 lapsed unused four times. The gap is invisible when reading top to
bottom, because each fork looks complete on its own: it has a threshold, a reading, and usually a
prohibition. It just has no next step, so the run that reads it improvises at exactly the moment the
evidence is weakest. [L-77](LESSONS.md).

*And the ordering is the point, not the paperwork.* Obligations written after the number is known are
chosen to suit it. Run 159 proved that on itself: routine inspection computed a partial EXP-011
series **before** that experiment's downstream obligations had been registered, which permanently
foreclosed registering them blind — see the run-159 addendum under EXP-011. A pre-registration window
is consumed by the first run that looks, and no rule forbade looking.

Template:

```
## EXP-NNN — short name (YYYY-MM-DD)
- Hypothesis:
- Baseline (source-linked):
- Change (commit/deploy):
- Success threshold (falsifiable):
- Result (source-linked):
- Decision: keep / roll back / iterate / abandon
```

## EXP-001 — funnel telemetry baseline (2026-08-06, run 2)

- **Hypothesis:** not a product experiment. This is the measurement prerequisite: without it, every
  later experiment's result is unfalsifiable. Logged here because the reviewer's acceptance criteria
  require it, and labelled honestly rather than dressed up as a growth test.
- **Baseline (source-linked):** no landing-view instrumentation, no login event, no durable return
  history (`members.last_desk_at` overwritten on each visit) — see the run-1 audit in METRICS.md.
- **Change:** `metric_days` + `member_days` tables, nine counters on real user actions, key-gated
  `GET /api/metrics`, and a daily GitHub Actions snapshot into `ops/metrics/`.
- **Success threshold (falsifiable):** within 48h of `METRICS_KEY` being set, `ops/metrics/latest.json`
  exists and shows a non-zero `landing_view` **or** `landing_view_bot` count for at least one day.
  If it does not, the instrumentation is broken or the site receives literally no traffic — both are
  findings, and the second one would redirect the loop from measurement to distribution.
- **Result (2026-08-08, run 16): PASSED, on the threshold exactly as written.** Snapshot run
  [31246496587](https://github.com/in-c0/tuned/actions/runs/31246496587) (job `93075870711`, checkout
  `3b9dcac`) authenticated **HTTP 200** and committed `ops/metrics/latest.json` +
  `ops/metrics/2026-08-08.json` at [`a00a8fe`](https://github.com/in-c0/tuned/commit/a00a8fe0da9989cee53ec5800fa0a0f01229fdf9).
  The threshold asked for a non-zero `landing_view` **or** `landing_view_bot` on ≥1 day; observed
  non-zero on **all three** covered UTC days — `landing_view` 29 / 69 / 17 and `landing_view_bot`
  15 / 23 / 4 for 2026-08-06 / 07 / 08. Full reading and its caveats: METRICS.md, run-16 section.
- **Decision: keep, and close.** The measurement prerequisite is met — the funnel is readable and the
  instrumentation is confirmed working end to end in production, not just in workerd. Three things
  this experiment settles, recorded because each one closes off a hypothesis:
  1. **The "zero means no traffic → pivot to distribution" fork does not fire.** Views are non-zero.
  2. **The instrumentation is not broken** — the alternative branch of that same fork.
  3. **The blocking stage is one step later than expected.** `application_submit` has never fired:
     **0 applications against 115 human-flagged landing views (0.0%, 95% upper bound ~2.6%)**. The
     constraint is arrival → application, and EXP-001 was never designed to explain it.
- **What EXP-001 cannot say, stated so no later run borrows its authority:** nothing about demand.
  115 UA-flagged views on a product never posted to any channel is most likely crawler and self-
  inflicted traffic. It proves the counters work; it is not a market signal, and the 0% conversion
  above is measured against a denominator of unknown human content.
- **Threshold disambiguated (2026-08-06, run 3):** the "either broken or no traffic" fork above is no
  longer a fork. 17 tests now exercise the counter path in workerd against a real D1, including that
  live requests to `/` and `POST /waitlist` increment their counters, and a mutation of the upsert was
  confirmed to fail them. So once `METRICS_KEY` is set, **a zero reading means genuinely no traffic** —
  a distribution finding that redirects the loop — not an unexamined instrumentation failure.


- **Clock note (2026-08-06, run 5):** the 48-hour window in the success threshold above has **not
  started**. It is measured from `METRICS_KEY` being live on the Worker, and as of 12:03 UTC the
  Worker still reports the binding absent (two dispatched snapshots, both HTTP 503; see METRICS.md).
  The experiment is not failing — it has not begun. Recorded so the window is not mistakenly counted
  from the owner's confirmation timestamp.

## EXP-002 — first distribution smoke test: Show HN to agent operators (2026-08-07, run 9)

**Pre-registered before publication. Not yet started.** The packet — audience, channel, exact post,
CTA, tagged URL — is [in issue #1](https://github.com/in-c0/tuned/issues/1) and awaits owner
authorization; the owner publishes, because public posting carries account and reputational authority
the executor does not hold. This entry exists so the thresholds and the grading rules are fixed in an
append-only file *before* any result can be seen, which is the only thing that makes them falsifiable.

- **Hypothesis:** people who already run research/coding agents daily feel the review bottleneck
  ("my agents read more than I can") acutely enough to apply to a hand-gated product on the strength
  of one honest post. If this audience will not apply, the single-player wedge in
  `BRIEF-2026-08-06.md` is wrong about *who*, and the loop should not spend more cycles on the desk.
- **Baseline (source-linked):** zero. No channel has ever been posted; `outreach/creator-shortlist.md`
  records no creator contacted. Every funnel metric is UNMEASURED — `/api/metrics` has returned 503
  `metrics key not configured` on nine consecutive observations, so there is not yet a `landing_view`
  or `application_submit` number of any kind. Gross cash AUD $0, source: no billing exists.
- **Change (commit/deploy):** **none — no product or workflow code.** This is a distribution
  experiment on an unchanged build (`bdfa636`, verified live by SHA). That is deliberate: the point is
  to learn whether anyone wants what already exists, not to test a new thing.
- **Success threshold (falsifiable), fixed by the reviewer's directive and graded once at window close:**
  - **success** — ≥10 qualified applications **or** ≥3 explicit willingness-to-pay replies in 48h;
  - **inconclusive** — 3–9 qualified applications with no paid intent;
  - **failure** — <3 qualified applications **and** zero willingness-to-pay replies.
  - *Reading fixed in advance:* the directive words the failure band as "qualified applications" and
    the inconclusive band as "applications". All three bands are graded on **qualified** applications —
    the stricter and internally consistent reading. Raw application count is reported alongside, so
    the looser reading remains checkable by anyone who prefers it.
- **Grading rules, fixed in advance so the result cannot be graded generously afterwards:**
  - A **qualified application** is a `waitlist` row whose `created_at` is inside the window, whose
    email is distinct and not a disposable domain, and where either `role` ∈ {`agent`, `both`} or the
    `note` names a specific agent/tool the applicant runs. Inside the window but failing that test =
    an application, not a qualified one.
  - A **willingness-to-pay reply** is a public thread comment or a direct reply from a distinct person
    that names a price, names a budget, or states unambiguous intent to pay. Upvotes, "cool idea", and
    "I'd try it" are **not** WTP. Public comments are quoted verbatim with a link; private email is
    summarized, never pasted — a person answering a founder's post did not consent to publication.
  - Bot-flagged landing views (`landing_view_bot`) are reported separately and never counted as reach.
- **Clock:** the 48h window starts at the moment the owner publishes, and only once `/api/metrics`
  returns 401 rather than 503 — without the key there is no `landing_view`/`application_submit` series
  and the funnel shape is unrecoverable after the fact. Exact publish time is recorded in UTC and
  Sydney, because the metrics series is bucketed by **UTC day** and a mid-day start straddles two
  buckets; day counts are therefore bounds on the in-window count, not the count itself.
- **Known measurement limit, verified in code this run, not assumed:** the campaign tag
  `?src=shn-2026-08` is **inert**. `app.get("/")` (`src/index.ts:57`) ignores query parameters,
  `POST /waitlist` (`src/index.ts:72`) persists only `email`, `role` and `note`, and the `waitlist`
  table (`schema.sql:82`) has no source column. Attribution therefore rests on time-window contrast
  against a zero baseline plus a single owner-run D1 read — which is sound only because this is the
  first and only channel ever posted. **It stops being sound at channel two**, and capturing a source
  on the application is the obvious next product change if this experiment justifies one.
- **Result (source-linked):** NOT STARTED — awaiting owner authorization to publish. The measurement
  precondition is met (one snapshot has succeeded; `ops/metrics/latest.json` exists), and as of run 19
  the packet's last unfilled token is resolved: **`[DEMO_FEED_URL]` = `https://justtuned.com/ava`**,
  read off the live landing page by EXP-004 rather than guessed. Publication is now a single owner
  action with nothing left for the owner to look up.
- **Clock condition sharpened (2026-08-07, run 11) — the literal test now passes and the experiment is
  still not measurement-ready.** The clock above says the window may start "only once `/api/metrics`
  returns 401 rather than 503". Unauthenticated, it now returns 401. Read literally, that gate is met.
  **It should not be treated as met**, because the condition was written as a proxy for the thing that
  actually matters: that the `landing_view`/`application_submit` series can be *read* at window close.
  It cannot — the snapshot job is rejected 401 with the repository secret (METRICS.md). Publishing now
  would spend the one channel that makes attribution-by-elimination sound against a funnel nobody can
  read afterwards, and the funnel shape is unrecoverable after the fact. **EXP-002 remains NOT STARTED
  until one snapshot succeeds.** The proxy is corrected here rather than reinterpreted later, which is
  the whole point of an append-only file.
- **Decision:** pending.

## EXP-001 update — 2026-08-08 (run 12): still PENDING, cause narrowed to one candidate

**Status: PENDING.** No snapshot has ever succeeded; `ops/metrics/latest.json` does not exist at
master. Every counter is UNMEASURED over zero UTC dates. Nothing is graded, and no threshold is
reinterpreted here.

What changed is the *cause*, and it changed by elimination rather than by argument.

Run 11 recorded two candidate explanations for the authenticated `401` and could not separate them:
(a) stray whitespace in one secret, which the comparison would treat as a difference; (b) two
genuinely different values. It judged both indistinguishable without reading a secret.

They were separable in code. `68cd28d` makes the comparison trim both sides — justified independently,
because HTTP strips surrounding whitespace from a header value in transit while a Worker secret can
retain it, so a whitespace-bearing secret is unmatchable by every possible client rather than merely
mismatched. With that fix **confirmed live by build stamp** (verify-production 31222849117, 22:11:46
UTC), the dispatched snapshot still returned `401` (31222947399, 22:12:11 UTC).

**Candidate (a) is eliminated. Candidate (b) stands: the two values are genuinely different strings.**

The success threshold is unchanged and unmet: within 48h of a *readable* key, `ops/metrics/latest.json`
shows a non-zero `landing_view` **or** `landing_view_bot` for at least one day. The clock has not
started, because the key is not yet readable.

**Caveat raised and then closed, rather than smoothed over:** the first snapshot ran 25 seconds after
the build stamp flipped, which is thin margin for global propagation. A second dispatch two minutes
later returned the same `401`
([31223053290](https://github.com/in-c0/tuned/actions/runs/31223053290), 22:13:49 UTC). Two dispatches
against a Worker confirmed to trim, same result — the elimination holds. The daily scheduled run at
20:40 UTC is a third independent check that needs nobody's attention.

**EXP-002 (Show HN) remains NOT STARTED** and measurement-blocked for exactly the reason recorded in
run 11: publishing into a funnel nobody can read afterwards spends the single channel that makes
attribution-by-elimination sound, and the funnel shape is unrecoverable after the fact.

### EXP-002 status revision — 2026-08-08 (run 16)

**Measurement precondition MET; still NOT STARTED, and the reason has changed.**

The clock condition written into EXP-002 — "only once `/api/metrics` returns 401 rather than 503", and
in practice once a snapshot is actually readable — is now satisfied: run
[31246496587](https://github.com/in-c0/tuned/actions/runs/31246496587) authenticated 200 and
`ops/metrics/latest.json` exists at `a00a8fe`. A 48-hour window opened today would be gradeable.

It is still held, for two reasons that now outrank the old one:

1. **Owner authorization** for public posting is unchanged and is not the executor's to give.
2. **The funnel converts arrivals at 0% (0 / 115 human-flagged views, 3 UTC days).** Publishing into
   that spends the one channel whose attribution-by-elimination is sound — see the known measurement
   limit above, which stops holding at channel two — and would most likely return a *failure* band
   that tells us nothing new about the audience, because the loss would be indistinguishable from a
   landing page that nobody can apply through. The pre-registered bands would grade it honestly and
   the finding would still be uninterpretable.

**Baseline correction for EXP-002, since it was written against zeros:** its recorded baseline states
"every funnel metric is UNMEASURED / `/api/metrics` has returned 503 on nine consecutive observations".
That was true when pre-registered and is now superseded. Its true pre-publication baseline is the
run-16 reading in METRICS.md — 115 / 42 landing views and **0 applications** over 2026-08-06 → 08-08.
Grading it against zero applications rather than against "unmeasured" makes its bands *more*
falsifiable, not less: any application inside the window is now a genuine departure from a measured
baseline instead of a first observation.

No threshold, band or grading rule of EXP-002 is altered.

---

## EXP-003 — application mechanism test: can a visitor actually apply? (2026-08-08, run 18)

**Pre-registered at 2026-08-08 ~09:35 UTC (19:35 Sydney), before any production reading was taken.**
Written and committed first on purpose: the whole value of this test is that its pass/fail rule was
fixed before the answer was known, because the result determines whether the next cycle works on the
*mechanism* or on the *message*, and those are expensive to confuse.

- **Hypothesis (the one being tested):** the application path is *mechanically intact* in production
  today — a visitor arriving at `https://justtuned.com/` can see the form, fill it, and submitting it
  issues exactly one `POST https://justtuned.com/waitlist` carrying the typed values as JSON, at both
  mobile and desktop widths, with no page or console error that would abort the submit.
- **The alternative it is designed to kill:** that `0 applications / 115 landing views` is a *broken
  or invisible* apply path rather than a message that does not land. Those two produce identical
  funnel data and cannot be told apart from counts alone. No copy, positioning or pricing hypothesis
  is worth testing until this one is answered, because every such test would be run through a channel
  that may not carry the result.

- **Baseline (source-linked):** `ops/metrics/latest.json` at
  [`a00a8fe`](https://github.com/in-c0/tuned/commit/a00a8fe0da9989cee53ec5800fa0a0f01229fdf9) —
  115 human-flagged landing views over 3 UTC days, **0 applications**, `application_submit` never
  fired. `test/metrics.test.ts` already proves in workerd, against a real local D1, that a *valid*
  `POST /waitlist` inserts the row and increments the counter; what has never been verified is the
  **browser half** in production: that the live page's markup and script actually produce that request.

- **Change (commit/deploy):** none to the product. This experiment adds only a QA harness
  (`qa/`, Playwright) and a `workflow_dispatch` workflow that drives a real Chromium against live
  production from GitHub Actions — the executor has had no direct egress to `justtuned.com` for 18
  consecutive runs, so Actions is the only available browser vantage point. **No `src/` change ships
  as part of the reading.** If the reading exposes a mechanism defect, the fix is a separate,
  minimal, verified change made *after* the result is recorded.

- **Success threshold (falsifiable, fixed in advance).** The mechanism is **PROVEN WORKING** only if
  all six hold on live production, at both 390×844 (mobile) and 1440×900 (desktop):
  1. `GET /` returns 200 and the document reaches load with **zero** uncaught page errors and zero
     script-originated console `error` entries.
     *Sharpened at 09:40 UTC, still before any reading was taken, and recorded rather than silently
     applied:* the landing page's demo cards embed third-party favicons from `icons.duckduckgo.com`,
     each with an `onerror` handler that removes it. A failed subresource fetch also emits a console
     `error`, so the criterion as first written could grade the apply mechanism **defective because a
     third-party icon host was slow** — a false failure about a surface that cannot abort a form
     submit. So criterion 1 grades **script** errors (uncaught exceptions and console errors raised by
     page script) and **first-party** request failures. Third-party subresource failures are recorded
     in full and reported, but do not decide the mechanism.
  2. The form `#waitlist` and all four controls (`#wl-email`, `#wl-role`, `#wl-note`, `#wl-btn`) are
     present, visible, enabled, and inside the viewport without horizontal page overflow.
  3. Submitting the filled form issues **exactly one** request, and it is
     `POST https://justtuned.com/waitlist` with `content-type: application/json`.
  4. That request's body parses as JSON with exactly the keys `email`, `role`, `note`, whose values
     equal what was typed into the corresponding controls.
  5. When that request is answered `{"ok":true}`, the page shows its confirmation text and hides the
     form — i.e. the success branch of the client script is reachable, not just the request.
  6. The **live** route rejects a syntactically invalid email with HTTP **400** — proving the
     production endpoint is reachable, is running the validating build, and refuses before writing.

  **Any one of the six failing means MECHANISM DEFECT**, and the next action becomes fixing it. All
  six holding means **MECHANISM PROVISIONALLY WORKING**, and the next evidence gap is explicitly *not*
  another mechanism test — it is controlled, known-human traffic, because at that point the only
  remaining explanations for 0/115 are that the arrivals were never human or the offer does not land,
  and neither is decidable from a denominator of UA-classified requests.

- **Contamination rules, binding and pre-committed:**
  - The submit request is **intercepted in the browser and fulfilled locally**. It never leaves
    Chromium, never reaches the Worker, never inserts a row, never increments `application_submit`.
    The funnel's own numbers must remain readable as *user* behaviour after this run; an experiment
    that writes into its own measurement is worthless.
  - The only request this test makes to a mutating route is criterion 6's **deliberately invalid**
    one, which the route rejects with 400 *before* any `INSERT` and *before* `track()` — verified by
    reading `src/index.ts:97-106`, where validation precedes both.
  - **No fake PII.** The intercepted form is filled with the literal non-address
    `exp003-intercepted-never-sent@example.invalid` (`.invalid` is reserved by RFC 2606 and can never
    route), and criterion 6 posts the string `exp003-not-an-email`, which is not an address at all.
  - Landing views this test causes are **bot traffic and must be counted as such**: the harness sends
    a UA containing `HeadlessChrome`, which the existing heuristic classifies as `landing_view_bot`.
    A test that inflated its own human-flagged denominator would corrupt the very ratio under study.
  - **No metric may be claimed from this run.** It measures a mechanism, not demand.

- **Result (source-linked): the apply mechanism WORKS. One unrelated defect was found and fixed.**

  Two production runs, both driving a real Chromium at `https://justtuned.com` from Actions:

  | | run 1 — [31251017621](https://github.com/in-c0/tuned/actions/runs/31251017621) at `b62bf08` | run 2 — [31251303499](https://github.com/in-c0/tuned/actions/runs/31251303499) at `5ef6970` |
  | --- | --- | --- |
  | 1 — no script errors, no first-party failures | **FAIL** — one first-party 404 | **PASS** — `pageErrors []`, `firstPartyConsoleErrors []` |
  | 2 — form visible, enabled, no horizontal overflow | PASS both widths | PASS both widths |
  | 3 — exactly one `POST https://justtuned.com/waitlist` | PASS | PASS |
  | 4 — JSON body `{email, role, note}` = what was typed | PASS | PASS |
  | 5 — success branch renders and hides the form | PASS | PASS |
  | 6 — live route rejects an invalid email with 400 | PASS — `{"error":"invalid email"}` | PASS |

  Criteria 2–6 — every one that bears on the apply path — passed **on the first run, at both
  390×844 and 1440×900**. `documentScrollWidth` equals `viewportInnerWidth` at both widths, and the
  form sat fully above the fold on both. Screenshots at both widths are attached to each run as the
  `exp003-evidence` artifact (30-day retention).

  The single failure was criterion 1, and it was **not** the apply path:

  ```
  https://justtuned.com/static/browse/0.3.4/images/arxiv-logo-fb.png  → 404
  ```

  arXiv's `og:image` is root-relative. `src/meta.ts` stored it verbatim, a card rendered it as an
  `<img src>`, and the browser resolved it against **our** origin. Fixed in
  [#16](https://github.com/in-c0/tuned/pull/16) / [`5ef6970`](https://github.com/in-c0/tuned/commit/5ef6970b50487cace86fb4fbdbac8d7a33e2afba)
  — `resolveImageUrl()` at extraction time, plus a render guard for the rows already carrying the bad
  value, so no production data was rewritten. Corroborated independently of the test: the landing page
  went from **22,075 to 21,974 bytes** across that deploy, which is the `<img>` no longer being
  emitted, and `verify-production`
  [31251251027](https://github.com/in-c0/tuned/actions/runs/31251251027) confirmed `5ef6970` serving.

  One console error remains and is **reported, not graded**, exactly as the sharpened criterion 1
  says: `https://icons.duckduckgo.com/ip3/medrxiv.org.ico` → 404. Third-party, cosmetic, cannot abort
  a submit, and `onerror` already removes the element.

- **Contamination: none, and it is checked rather than asserted.** Both runs report
  `submitReachedServer false`, `rowsInserted 0`, `applicationSubmitIncremented false`. The design was
  verified against a real D1 before it ever ran against production: after 5 harness page loads and 2
  form submissions on a local build, `waitlist_rows 0 · application_submit 0 · landing_view 0 ·
  landing_view_bot 5`. The landing views these runs caused are bot-flagged, so the human-flagged
  denominator of the 0/115 ratio is untouched.

- **Decision: keep the harness, close the mechanism question, and do NOT reach for the message next.**

  The apply path is mechanically sound. That kills one of the two explanations for 0/115 — but it
  does **not** promote the other one to a finding, and this is the part worth being careful about.
  What is now established is narrow and worth stating exactly:

  > A visitor who arrives at justtuned.com **can** apply. Nobody has.

  The tempting next move is a copy or positioning experiment, on the reasoning that the offer must be
  what is failing. That reasoning is unsound here, because **the denominator is not known to contain
  humans.** 115 UA-flagged views on a product that has never been posted to any channel is most
  likely crawler traffic the heuristic did not catch. Rewriting the page to convert an audience that
  may not exist would produce a number that cannot be read either way.

  **Next evidence gap, and it is the one the reviewer named: controlled, known-human traffic.** Not
  more instrumentation, and not a message test. Until some quantity of arrivals is known to be human,
  every conversion figure Tuned computes has an unknown denominator, and no experiment downstream of
  it is gradeable. That is what makes EXP-002 — or any authorized first channel — the binding next
  step rather than a nice-to-have, and it is an owner-authorization boundary, not an executor one.

  A CTA-reach counter is **still worth adding, but second**, and only against known-human arrivals;
  added now it would measure crawler behaviour at some cost in noise. Deliberately not shipped this
  run so the reading stays attributable.

## EXP-004 — do the public, no-account surfaces the Show HN post promises actually work? (2026-08-08, run 19)

**Pre-registered before any production reading.** Same discipline the reviewer required of EXP-003,
for the same reason: the criteria below decide the result, and they are fixed here first so they
cannot be relaxed once the screenshots are in.

This is not a demand experiment and does not claim to be. It is a **pre-publication check on a
public claim**, and it exists because of an asymmetry the loop has been carrying without noticing:
the EXP-002 packet is copy-paste ready except for one hand-filled blank, and the post text makes an
assertion about Tuned that no run has ever verified.

- **What the post promises, verbatim:** *"What you can look at without an account: `[DEMO_FEED_URL]`
  is a live feed, and every feed has open RSS."* That sentence is the post's entire answer to Show
  HN's "let people try it" norm, and run 9 flagged the application gate as the packet's largest
  risk. If the link behind it is broken, empty, or unreadable on a phone, the owner spends the one
  channel that makes attribution-by-elimination sound on a post whose central mitigation is false.
- **Why now and not nine runs ago:** it was not checkable. Executor egress to justtuned.com has been
  `403 CONNECT` at the proxy for nineteen consecutive runs, which is exactly why run 9 left the token
  blank rather than guessing a handle into a post about to be published. Run 18 built a browser
  vantage point on production inside Actions. This is the first cycle in which the claim can be
  tested by the executor at all.
- **Hypothesis:** the public surfaces work as the post describes, and the blank is fillable from
  production rather than by the owner's hand. If they do not, publication is blocked on a defect
  rather than on authorization, and the packet is wrong rather than merely unfinished.
- **Baseline:** unverified in both directions. No run has ever loaded a public feed page or an RSS
  document from production. `feed_view` has fired 7 times human-flagged and 5 bot-flagged across
  2026-08-06/07 (`ops/metrics/latest.json`), which establishes the route is *reached*, not that it
  *renders* anything a person could use.
- **Change:** none to the product. A read-only browser spec (`qa/public-surfaces.spec.mjs`) and a
  reusable dispatch-only workflow. The one edit to an existing instrument is naming EXP-003's spec
  file explicitly in its own workflow, so a second spec in `qa/` cannot silently change what EXP-003
  runs.

**Success criteria — all five, at both 390×844 and 1440×900 unless noted:**

1. `GET /` returns 200 and contains exactly one demo link (`a.demo-more`) whose `href` resolves to a
   first-party path of the form `/{handle}`. The resolved absolute URL is the value of
   `[DEMO_FEED_URL]`, read from production rather than guessed.
2. That URL returns **200** and renders the feed's identity: the creator's name, and the
   `what @{handle} is paying attention to` line.
3. The feed shows **at least one item** (`.card`) — the claim is "a live feed", and a page rendering
   the `Nothing here yet` empty state would falsify it however cleanly it loads.
4. No uncaught page errors and no **first-party** console errors or request failures, and no
   horizontal overflow (`documentElement.scrollWidth ≤ innerWidth + 1`). Third-party subresource
   failures are **reported and not graded** — the favicon host cannot make a feed unusable. This is
   the criterion EXP-003 sharpened at 09:40 UTC on 2026-08-08, adopted here verbatim rather than
   re-derived.
5. `GET /{handle}/rss.xml` returns **200** with `content-type: application/rss+xml` and at least one
   `<item>`. Run once, from the desktop project only: it is a property of the route, not of a
   viewport.

**Contamination rules, fixed in advance:**

- **GETs only.** No application, no member, no follow, no write of any kind. Nothing here touches a
  mutating route — unlike EXP-003, which needed one negative control against `POST /waitlist`.
- The harness announces a headless user-agent, so `src/metrics.ts` classifies its requests as bots:
  the views it causes land in `landing_view_bot` and `feed_view_bot` and never enter the
  human-flagged denominator under study. Expected effect on the *human* series: **zero**.
- The bot-flagged increments it does cause are real and are declared, not hidden: approximately 2
  landing views and 2 feed views per run, at 2 viewports.

**Falsification, stated so this cannot be graded generously afterwards:** if criterion 3 fails —
the demo feed is empty or shows no card — then the packet's "you can try it without an account"
mitigation is **false**, the Show HN post must not be published as written, and the correct outcome
of this run is to say so and redesign nothing else. If criteria 1, 2, 4 or 5 fail, that is a
mechanism defect on a public surface; fix only it, verify production, and re-run.

**What a pass does and does not license.** A pass fills one blank and removes one publication risk.
It is **not** evidence of demand, not a conversion fact, and does not weaken the standing conclusion
that the binding constraint is owner authorization of a first channel. It cannot: no human is
involved in it anywhere.

- **Result (source-linked):** pending — this entry was committed before the workflow was dispatched.
- **Decision:** pending.

### EXP-004 — RESULT: PASSED (2026-08-08, run 19)

**All five criteria hold on live production, at both widths, at the first attempt.**
[qa-browser run 31252271974](https://github.com/in-c0/tuned/actions/runs/31252271974), 10:12–10:13 UTC,
3 passed / 1 skipped (the skip is criterion 5 deliberately not repeating on mobile).

The build serving during the reading was **`876092c`** — Cloudflare had not yet finished deploying
`644c23a` when the browser hit the origin. Recorded rather than smoothed over: `644c23a` changes no
`src/`, so the landing and feed bytes are identical under either build, and the result stands for
both. It is still the earlier commit that was measured, and saying otherwise would be a small lie
about a large habit.

| # | Criterion | Desktop 1440×900 | Mobile 390×844 |
| --- | --- | --- | --- |
| 1 | one `a.demo-more` → first-party `/{handle}` | `/ava` | `/ava` |
| 2 | feed 200, names its creator | 200, "Ava Kim" | 200, "Ava Kim" |
| 3 | ≥1 `.card`, no `.empty` | **24 cards**, empty state absent | **24 cards**, empty state absent |
| 4 | no page errors / first-party errors / overflow | `[]`, `[]`, 1440 ≤ 1440 | `[]`, `[]`, 443 ≤ 443 |
| 5 | RSS 200, `application/rss+xml`, ≥1 `<item>` | **38 items**, 18,509 bytes | not repeated (by design) |

```
demoFeedUrl  https://justtuned.com/ava      demoHandle  ava      creatorName  Ava Kim
landingStatus 200 · feedStatus 200 · cardsRendered 24 · emptyStateShown false
pageErrors [] · firstPartyConsoleErrors [] · firstPartyRequestFailures []
EXP004_RSS {"url":"https://justtuned.com/ava/rss.xml","status":200,
            "contentType":"application/rss+xml; charset=utf-8","items":38,"bytes":18509}
contamination  mutatingRequests 0 · rowsInserted 0
```

**`[DEMO_FEED_URL]` is resolved: `https://justtuned.com/ava`.** Read off the live landing page, not
guessed. The EXP-002 packet now has no unfilled token, and publication is one owner action.

**Reported and not graded, per criterion 4** — two third-party subresources on the feed:

- `icons.duckduckgo.com/ip3/medrxiv.org.ico` → 404. Already known from run 18; `onerror` removes it.
- `www.medrxiv.org/.../medrxiv_logo_homepage7-5-small-test-up.png` → `net::ERR_BLOCKED_BY_ORB`.
  **New, and a different animal from run 18's finding.** That one was a borrowed image path resolving
  against *our* origin and 404ing there — our bug, and fixed. This one is medRxiv declining to serve
  its own image cross-origin, which is their prerogative and not a defect in Tuned. `onerror` removes
  the element, the card keeps its icon fallback, and the correct fix — proxying or caching other
  people's images — is a real product decision with bandwidth and copyright consequences that a
  cosmetic thumbnail does not justify. **Deliberately not fixed.**

**Decision: PASSED. The packet's central mitigation is true.** A stranger can reach a live feed with
24 items and open RSS with 38, on a phone or a desktop, without an account — which is what the post
about to carry the owner's name asserts, and what Show HN's let-people-try-it norm asks for.

**What this does not license, stated because the temptation is real.** A pass here removes a
*publication risk*. It is not demand evidence, not a conversion fact, and it does not make the
Show HN more likely to succeed — no human was involved in it at any point. The binding constraint is
unchanged and unchallenged by this run: **owner authorization of a first channel**. What changed is
only that authorizing it no longer requires the owner to fill in a blank or to trust an unchecked
sentence.

### EXP-002 status revision — 2026-08-08 (run 20): AUTHORIZED, and still NOT STARTED

**The owner authorized publication** at
[13:56 UTC](https://github.com/in-c0/tuned/issues/1#issuecomment-5226414917) (23:56 Sydney). The
authorization blocker, open since the packet was written on run 9, is **resolved**.

**The experiment has not started, and this entry exists so that stays unambiguous.** Authorization is
not publication. The pre-registered clock reads *"the 48h window starts at the moment the owner
publishes"* — not the moment the owner permits. There is no
`https://news.ycombinator.com/item?id=…` URL, so:

- **status: NOT STARTED**, and the executor will not mark it `STARTED` until that URL exists;
- **no window is open**, no day is in-window, and no arrival may be attributed to it;
- **no threshold, band or grading rule is altered** by authorization. The bands, the qualified-
  application definition and the WTP definition all stand exactly as pre-registered above.

**Why the executor did not publish it, recorded as a boundary rather than a deferral.** The directive
authorizes publication *"only through an already-authenticated owner Hacker News session that requires
no credential entry, account creation, CAPTCHA bypass, or identity guess."* No such session exists
here, on two independent grounds checked this run before the directive was claimed: the environment
holds no Hacker News credential or cookie of any kind, and there is **no network route to the host at
all** — `curl -I https://news.ycombinator.com/` returns exit 56, CONNECT 403, the same proxy denial
that has blocked `justtuned.com` for twenty consecutive runs. Publishing would also have meant posting
in the owner's name, which is impersonation whatever the plumbing allows.

**Packet canonicalized.** The approved text now lives at [EXP-002-PACKET.md](EXP-002-PACKET.md),
byte-identical to the run-19 report, with posting steps and the do-not-change list. It was previously
retrievable only by scrolling issue #1 — a deliverable stored in a comment thread, which is exactly
the handoff debt [L-11](LESSONS.md) warns about. One correction surfaced while checking it: the title
is **75** characters, not the 74 the run-19 report stated. HN's limit is 80, so nothing depends on it,
but a recount that disagrees with the record belongs in the record.

**One posting detail the packet did not previously state, and it could have cost the channel.** HN's
submit form takes *either* a url or text, not both — entering a url disables the text box, and HN's
own Show HN guidelines say to put the description in a comment. The packet supplies both a URL and a
body, so the faithful procedure is **submit title + URL, then post the body as the first comment**.
Stated as expected form behaviour and labelled as such in the packet: this executor has no egress to
HN and did not re-check the form today. If the form does accept both, the body goes in the text box
instead. Either placement is faithful; a bare URL with no description is not.

**Pre-publication baseline, per the directive's "establish the pre-publication aggregate baseline".**
It already exists and needs no dispatch: `ops/metrics/latest.json` at
[`a00a8fe`](https://github.com/in-c0/tuned/commit/a00a8fe0da9989cee53ec5800fa0a0f01229fdf9),
`generated_at` 2026-08-08T07:35:20Z — **115 human-flagged landing views, 42 bot-flagged, 0
applications, 0 logins, 0 attention actions** across 3 UTC days. The scheduled 20:40 UTC snapshot
refreshes it before any plausible publication time. Attribution remains by time-window contrast
against this zero, which is sound **only** because this is the first and only channel ever posted; the
`?src=shn-2026-08` tag is still inert.

### EXP-002 status revision — 2026-08-13 (run 33): the publication was attempted and it did not happen

**Status: `AUTHORIZED / NOT STARTED`. Unchanged, and that is the substantive finding of this entry.**

The owner published, and the submission was killed. Item
[`49280269`](https://news.ycombinator.com/item?id=49280269) — the canonical URL the owner action card
asked for — is **`dead: true`**. The pre-registered exposure never occurred, so there is nothing to
start, nothing to grade, and no window inside which any arrival may be attributed to this channel.

**Evidence, read independently rather than accepted.** The reviewer supplied the record; the executor
has no route to Hacker News (403 CONNECT at the proxy, every host, 29th consecutive run), so a
dispatch-only workflow was built to read it from GitHub's network before it was written down here.
[hn item status, run 31654090210](https://github.com/in-c0/tuned/actions/runs/31654090210), HTTP 200
from the documented Firebase item API:

```
{"by":"avajiyo","dead":true,"id":49280269,"score":1,"time":1786580003,"type":"story"}
```

Byte-identical to the reviewer's reading. `title`, `url` and `descendants` are **absent** — a killed
story keeps none of them. Item time `1786580003` = **2026-08-13T00:13:23Z** (10:13:23 Sydney).

**What is explicitly NOT created by this entry**, because each one would be a fabrication:

- **No t0.** The 48-hour clock does not start. It starts at exposure, and there was none.
- **No post-exposure snapshot**, and no day marked in-window.
- **No conversion inference.** Nothing observed in the funnel on 2026-08-13 may be attributed to, or
  read against, this attempt — including the absence of anything.
- **No grade.** EXP-002 is not `PASSED`, not `FAILED` and not `ABANDONED`. A submission that was never
  publicly visible tests nothing about the hypothesis, which is about *what agent operators do when
  they see Tuned*. Nobody saw Tuned.
- **No band, threshold, definition or baseline is altered.** All of them stand exactly as
  pre-registered on run 9, including the `55ece3c` pre-publication baseline and the fresh one at
  [`ae37b7e`](https://github.com/in-c0/tuned/commit/ae37b7e).

**Why the packet is not being rewritten, and no repost is being prepared.** `dead: true` at submission
carries no public reason. It is consistent with an account-level or domain-level filter, with a
new-account submission rule, or with an automated flag — and it is *not* diagnosable from the outside.
Rewriting the title or the body would be guessing at a cause, and a second submission of the same link
is exactly the behaviour Hacker News treats as evasion. The recovery path is moderation review by the
owner, and nothing else. See the owner action in [STATUS.md](STATUS.md).

**If the item is restored**, EXP-002 starts then, at the restoration timestamp — not at the original
submission time. A story restored hours later gets a different front-page trajectory than one that
lived from the start, and dating the window from `time` would silently assign it exposure it never
had. The pre-registered bands apply unchanged from that new t0.

**Attribution note that now matters more.** Attribution for this channel is by time-window contrast
against a zero baseline, which is sound only because it is the first and only channel ever posted.
That remains true — a dead submission put nothing in front of anyone, so the baseline is uncontaminated
and no window has been spent.

### EXP-002 status revision — 2026-08-13 (run 34): **INVALIDATED / NOT STARTED**. The channel was never valid, so there is nothing to restore

**Status: `INVALIDATED / NOT STARTED`.** This supersedes the run-33 entry above, which held the
experiment open pending moderation review. It is not a grade, and it must never be read as one.

**What changed is a finding about the packet, not about Tuned.** A compliance review of
[EXP-002-PACKET.md](EXP-002-PACKET.md) against Hacker News' published rules found two defects, either
one disqualifying:

1. **§3 is AI-authored text that the packet instructs the owner to post as their own first comment.**
   The executor wrote it on run 9. Hacker News asks people not to post generated or AI-edited text in
   comments. The packet's *How to post it* step 4 — *"immediately post §3 as the first comment on your
   own thread"* — is an instruction to break that rule under the owner's account.
2. **§2 submits `https://justtuned.com/?src=shn-2026-08`, an application-gated landing page.** Show HN
   asks for something a reader can try directly and treats landing/sign-up pages as off-topic. §3
   states the gate in its own words: *"membership is application-only right now"*. Linking `/ava`
   inside the body does not cure it — the rule is about the submitted URL.

**Verification, and its honest limit.** The two defects are verified *in this repository*: run 9's
[DECISIONS](DECISIONS.md) entry records the executor authoring the packet, and §2's URL is the gated
landing page by inspection. The guideline texts themselves were **not** re-read from source this run —
the executor's egress proxy answers 403 CONNECT to `news.ycombinator.com`, as it has since run 1, so
the citations rest on the reviewer's reading. Recorded as a dependency, not laundered into a check the
loop performed. It does not change the outcome: the in-repo facts alone make the packet unpublishable
under any reading of those rules.

**What this entry explicitly does NOT create, each of which would be a fabrication:**

- **No t0, no window, no snapshot marked in-window.** The 48-hour clock never started and never will
  from this packet.
- **No grade.** EXP-002 is not `PASSED`, not `FAILED`, not `ABANDONED`. Its bands, thresholds,
  definitions and baselines are untouched and unspent.
- **No inference about demand, in either direction.** Nothing observed in the funnel on or after
  2026-08-13 may be attributed to this attempt, *including the absence of anything*. The hypothesis —
  what agent operators do when they see Tuned — remains entirely untested, because nobody saw it.
- **No claim that `dead: true` was caused by these defects.** A kill at submission carries no public
  reason. The defects are sufficient on their own to withdraw the packet; whether they are also the
  cause is unknown and is not asserted.

**Consequences now in force:**

- The packet is **WITHDRAWN — DO NOT POST OR RESTORE UNCHANGED**, and marked as such at the top of the
  file and on every section of copy.
- **The restoration gate is retired.** `hn-item-status.yml` is no longer dispatched by the loop, and
  its green condition is void: restoring an item that points at a landing page, with an AI-written
  comment beneath it, would restore an invalid test rather than start a valid one.
- **The moderation-email owner action is withdrawn.** Owner action is `NONE`.
- The item is **not** reposted, edited, defended, commented on, or resubmitted, and no second channel
  is opened this cycle.

**What any future Hacker News attempt requires — all three, before any drafting begins:** a directly
usable destination that needs no application; the owner's own genuinely human-written, non-AI-edited
words for the title and any comment, which the executor must not draft or edit; and explicit moderator
permission to submit again. Absent all three, there is no attempt to prepare.

**The baseline survives intact.** Attribution for a future first channel is by time-window contrast
against a zero baseline, sound only because no channel has ever been posted. That is still true: a
dead submission put nothing in front of anyone, so the baseline is uncontaminated and no window has
been spent. The distribution question is exactly as open as it was on 2026-08-08 — see [L-17](LESSONS.md).

---

## EXP-005 — is the attention Tuned publishes actually recent? (2026-08-13, run 35)

**Pre-registered before any production reading, and before any copy is touched.** The threshold below
is fixed here first so it cannot be relaxed once the measurement is in. Same discipline as EXP-003
and EXP-004.

Not a demand experiment. Like EXP-004 this is a **check on a public claim**, and it is the claim that
sits on Tuned's highest-traffic page — 431 UA-flagged human-shaped landing views have now seen it.

- **What the landing page claims, verbatim.** The demo block is headed *"Live demo — a real feed,
  right now"*. The top-of-page link to it reads *"live demo"*. The following-side explainer says
  *"**Right now** — what they're into today, live, with a pulse: 'active 2h ago'"*. Each demo card
  renders its own timestamp through `data-t`, which the page's own script turns into `Nm ago` /
  `Nh ago` / `Nd ago` in the reader's browser.
- **Why now.** `items_public` is **79 on every committed metrics snapshot from 2026-08-08 through
  2026-08-12** — five days in which nothing anywhere on Tuned was published, while `items_queued`
  went 27 → 42 and then flat for two. `ops/METRICS.md` recorded that on 2026-08-12 as the leading
  engineering candidate and left it deliberately uninvestigated, because run 34's directive was a
  bounded compliance reconciliation that forbade inventing replacement work. Run 34 then raised its
  priority: the Show HN packet was withdrawn partly for pointing at an application-gated landing
  page, so **whether Tuned has a directly usable destination worth pointing anyone at is now the
  question in front of the loop**, and a stale demo is a poor answer to it.
- **What `items_public` cannot settle, and this can.** It is a total across all feeds, so it cannot
  distinguish *"the feed a visitor is shown is stale"* from *"one feed is stale and another is
  fresh"*. Those have different fixes: the first is an emptiness problem, the second is a defect in
  how the demo feed is chosen. `src/index.ts` picks the demo as `ORDER BY created_at` **LIMIT 1** —
  the oldest creator — which is a choice about the *feed's* age and not about its *content's*.
- **Hypothesis:** the demo block a visitor sees is stale enough that the words above it are not
  defensible. If it is fresh, the flat `items_public` is explained elsewhere and the landing copy is
  fine as written.
- **Baseline:** unmeasured in both directions. No run has ever read an item timestamp out of
  production. EXP-004 established that the demo feed renders **cards** and that RSS serves at least
  one `<item>`; neither criterion looked at a date.
- **Change under test:** none to the product in this measurement phase. A read-only browser spec
  (`qa/freshness.spec.mjs`) dispatched through the existing `qa-browser` workflow.

**Success criterion — one, pre-registered, graded on production:**

> The newest item in the landing page's demo block is **less than 48 hours old** at the moment of
> measurement, read from the `data-t` attribute the page actually renders.

48 hours is deliberately generous. It is the most permissive reading of *"right now"* anyone could
defend in public, so a failure at this threshold is not a matter of taste. The spec also reports,
without grading, the newest-item age of **every** public feed the landing page lists, whether any
feed is fresh, and whether the feed chosen as the demo is the freshest one available.

**Contamination rules, fixed in advance:**

- **GETs only.** No application, no member, no follow, no write of any kind, no mutating route.
- The harness announces a headless user-agent, so `src/metrics.ts` classifies its requests as bots.
  Expected effect on the human-flagged series: **zero**. Declared bot-flagged cost: 1 landing view
  plus 1 feed-page-equivalent RSS read per listed feed, once, from the desktop project only.
- The measurement reads the **rendered page and the published RSS**, not the database. What a reader
  sees is the claim under test; a database that disagreed with the page would itself be the finding.

**Falsification, stated so this cannot be graded generously afterwards:** if the demo block's newest
item is under 48 hours old, the hypothesis is **refuted**, the landing copy stands unchanged, and the
flat `items_public` needs a different explanation. No copy is edited on a refuted hypothesis.

**Result: HYPOTHESIS SUPPORTED — the claim was false by a wide margin.**
Measured 2026-08-13 10:08:15 UTC against `https://justtuned.com`, run
[31689710757](https://github.com/in-c0/tuned/actions/runs/31689710757), commit `7872564`. The run is
**red, and red is the finding** — the pre-registered threshold is what failed.

| Feed | RSS | Items | Newest item | Age at measurement |
| --- | --- | --- | --- | --- |
| **`ava`** (the demo) | 200 | 38 | 2026-08-02T03:33:44Z | **270.6 h — 11.3 days** |
| `sportstech` | 200 | 11 | 2026-07-30T22:48:09Z | 323.3 h — 13.5 days |
| `wearables` | 200 | 10 | 2026-07-30T22:49:47Z | 323.3 h — 13.5 days |
| `wellbeing` | 200 | 9 | 2026-07-30T22:50:34Z | 323.3 h — 13.5 days |
| `graphics` | 200 | 11 | 2026-07-30T22:51:27Z | 323.3 h — 13.5 days |

**The demo block's newest item was 270.6 hours old against a 48-hour threshold — 5.6× over.** The
rendered `data-t` stamp and `ava`'s own RSS `pubDate` agree to the second, so the page and the
database are telling the same story: a visitor arriving at Tuned on 2026-08-13 read the words
*"Live demo — a real feed, right now"* over three cards that their own browser stamped **"11d ago"**.

**Three things this settles that `items_public` could not:**

1. **The staleness is 11 days, not 5.** `items_public` has been flat at 79 since the first committed
   snapshot on 2026-08-08, so five days was a floor set by when instrumentation started, not a
   measurement. Nothing has been published anywhere on Tuned since **2026-08-02**, and nothing on any
   feed but `ava` since **2026-07-30**.
2. **It is not an emptiness problem.** `feedsWithNoItems` is empty: all five feeds serve 200, carry
   between 9 and 38 items, and render. EXP-004's criteria all still hold. The surfaces work; what
   they contain is old.
3. **The demo picker is a latent defect that happened to be masked.** `demoIsFreshest: true` — but
   only coincidentally. `src/index.ts` selected the demo as `ORDER BY created_at LIMIT 1` over
   creators, i.e. by registration date, and on this date the oldest creator was also the last to
   publish. The two orderings agreed by luck. Had any other feed posted, the landing page would have
   shown a visitor the *stalest* feed Tuned has.

**What is NOT claimed.** This does not explain 0/431 and is not offered as the cause. The denominator
is UA-classified requests, no arrival is known to be human, and no visitor has ever been observed
reacting to this page in either state. What is established is narrower and still worth having: **a
public claim on Tuned's highest-traffic page was false, verifiably, for at least eleven days**, and
the operating rules require public claims to be supported by verifiable data. It is a defect fixed on
its own merits, not a conversion experiment, and no conversion inference may be drawn from fixing it.

**Change shipped in response (run 35):** the claim is derived rather than asserted — see
`ops/DECISIONS.md`. The instrument stays: `qa/freshness.spec.mjs` is re-runnable against production
at any time and will fail again the moment the page outruns its data.

## EXP-006 — is the flat queue a quiet member or a dead pipeline? (2026-08-14, run 37)

**Pre-registered before any reading, and before the instrument's first snapshot exists.** The forks
below are fixed here first so none of them can be selected after the numbers arrive. Same discipline
as EXP-003, EXP-004 and EXP-005.

Not a demand experiment. This is a **liveness question about the only path on Tuned that currently
produces items at all** — the half-hourly Spotify ingestion cron.

- **Why now.** `items_queued` was **27** on 2026-08-08, **42** on 2026-08-11, and **42** again on
  08-12 and 08-13. `items_public` has been **79** on every committed snapshot. `ops/STATUS.md` has
  carried "the flat `items_public` / `items_queued` count, unexamined since run 31" as the one
  surviving engineering candidate.
- **Why it could not be answered before today.** The `scheduled` handler's only output was a
  `console.log` in Cloudflare's logs, which this loop holds no credentials to read. A 24-hour delta
  between snapshots was the entire instrument, and a flat delta is **exactly what both a quiet member
  and a revoked token produce**. The two futures were indistinguishable, not merely unmeasured.
- **Hypothesis:** the queue is flat because the single connected member has played nothing new — the
  pipeline is alive and there is no defect. The competing hypothesis is that the connection died
  (token revoked, consent withdrawn, or the cron not firing at all) somewhere after 2026-08-11.
- **Baseline:** no counter has ever fired. Ingestion health is UNMEASURED in both directions, and
  the three flat days before the deploy stay uninterpretable — there will be no backfill.
- **Change under test:** six counters shipped in [`1297427`](https://github.com/in-c0/tuned/commit/1297427).
  No change to ingestion behaviour itself: the sync call is byte-for-byte what it was.

**Reading window:** the first `metrics snapshot` taken after at least one cron boundary (`:00` or
`:30` UTC) has passed following the deploy. A snapshot taken sooner grades nothing and must not be
read as a zero.

**Pre-registered forks — exactly one applies, and each names its own next action:**

| Reading | Verdict | What follows |
| --- | --- | --- |
| `cron_run` ≥ 1, `spotify_sync_ok` ≥ 1, no `spotify_items_captured` | **QUIET, NOT BROKEN** | No defect exists. The flat queue is a true absence of supply, and the bottleneck is that Tuned has no operating attention supplier — not a bug. No code action. |
| `cron_run` ≥ 1, `spotify_items_captured` ≥ 1 | **ALIVE AND SUPPLYING** | Ingestion works and captured real plays. The flat days were quiet days. Record the supply rate; still no code action. |
| `cron_run` ≥ 1, `spotify_sync_auth_error` ≥ 1 | **CONNECTION DEAD** | The member's Spotify token is revoked or consent withdrawn. **Owner card:** the member must reconnect at `/home`. The executor cannot fix this and must not try. |
| `cron_run` ≥ 1, `spotify_sync_error` ≥ 1 only | **TRANSIENT — DO NOT CONCLUDE** | 429/5xx/network. Re-read on the next run before writing anything down. Two consecutive runs of this becomes a defect investigation. |
| `cron_run` ≥ 1, `cron_no_credentials` ≥ 1 | **SECRET MISSING** | `SPOTIFY_CLIENT_ID` is unset on the Worker. **Owner card**, one secret. |
| **no `cron_run` row at all**, in a snapshot taken after a cron boundary | **THE CRON IS NOT FIRING** | A deployment-configuration defect, executor-side: `triggers.crons` is declared in `wrangler.jsonc` but something is not registering it. Investigate before touching anything else — it would mean ingestion has been dead for an unknown number of days. |

**What this experiment may not be used for.** It measures pipeline liveness and captured volume. It
says nothing about demand, activation, retention or revenue, and no conversion inference may be drawn
from it in either direction. A high `spotify_items_captured` is one member listening to music — it is
supply, not traction.

### EXP-006 — GRADED: **QUIET, NOT BROKEN** (2026-08-13 22:32:24 UTC, run 37)

**Fork 1 of the six applies.** Source: `ops/metrics/latest.json` at
[`f65d6a3`](https://github.com/in-c0/tuned/commit/f65d6a3), `generated_at` **2026-08-13T22:32:24Z**,
taken 17 minutes after the deploy and **2 minutes after the first cron boundary** (`22:30` UTC) that
followed it — the reading window fixed above, satisfied exactly once.

| Counter | 2026-08-13 |
| --- | --- |
| `cron_run` | **1** |
| `spotify_sync_ok` | **1** |
| `spotify_items_captured` | *absent* |
| `spotify_sync_auth_error` | *absent* |
| `spotify_sync_error` | *absent* |
| `cron_no_credentials` | *absent* |

**What this establishes, precisely.** The cron fires in production. `SPOTIFY_CLIENT_ID` is set. The
member's connection is **live**: `recentlyPlayed` was called with that token and Spotify answered
`200`, which a revoked token or withdrawn consent could not have produced. And the poll found **no
play newer than `last_sync`** — so at 22:30 UTC there was nothing to capture.

**Therefore the flat `items_queued = 42` is a true absence of supply, not a defect.** Four of the six
forks are excluded outright: the cron is firing, the secret exists, no auth failure, no transient
error. The competing hypothesis — that the connection died somewhere after 2026-08-11 — is dead.

**What this does *not* establish, stated because one firing is one firing.** n = **1 poll**. It proves
the pipeline is alive *now*; it says nothing about the three flat days before the counters existed,
and those stay uninterpretable exactly as pre-registered. **No backfill, and no retroactive claim that
ingestion was healthy on 08-11, 08-12 or 08-13.** A single "nothing new" is also weak evidence about
the member's listening in general — it is one 30-minute window.

**Decision: no code action, and none is warranted.** There is no bug here to fix. The verdict is that
Tuned's item supply is genuinely absent across every producer it has — four agent feeds not running,
a desk unattended, and one live Spotify connection with nothing to carry. **That is the same
conclusion the 2026-08-13 review reached from the distribution side**, now reached independently from
the ingestion side, and it means the remaining bottleneck is not an engineering one.

**Status: PASSED / CLOSED**, on the fork that says the instrument found no fault. The counters stay in
place; they are now the standing liveness check, and the next run reads them without re-running this
experiment.

---

### EXP-006 — LATER OBSERVATION (2026-08-14 20:58:56 UTC, run 41) — **not a regrade**

**The grade above is unchanged and stays where it is.** EXP-006 was pre-registered before any reading
existed, its window was fixed to the first cron boundary after the deploy, and it was satisfied
exactly once at **2026-08-13T22:32:24Z** on **fork 1 — QUIET, NOT BROKEN**. That result is correct
for that window, it is closed, and nothing below rewrites it. What follows is a **later reading of
the same standing counters**, recorded separately because the experiment is not open to re-grading.

**The counters have since moved onto fork 2 territory.** Source: `ops/metrics/latest.json` at
[`7a73982`](https://github.com/in-c0/tuned/commit/7a739827c21f9716765670f20f05fadeb1899ad3),
`generated_at` **2026-08-14T20:58:56.369Z**:

| Counter | 2026-08-13 (the graded window, final) | 2026-08-14 (later, partial) |
| --- | --- | --- |
| `cron_run` | 3 | **30** |
| `spotify_sync_ok` | 3 | **30** |
| `spotify_items_captured` | *absent* | **104** |
| all four fault counters | *absent* | *absent* |

`items_queued` rose **42 → 146**, a delta of **+104** matching the capture count exactly.
`items_public` stayed at **79**.

**What this changes, and what it does not.**

- **Changed:** the durable statement that Tuned has *"one live Spotify connection with nothing to
  carry"* — written in the graded block's decision paragraph — is **superseded as a present-tense
  claim**. The connection is carrying. It was a true description of 22:30 UTC on 08-13 and is a false
  description of 08-14.
- **Unchanged:** the conclusion that **the remaining bottleneck is not an engineering one**. It is
  sharper now, not weaker. Ingestion is not the constraint — it produced 104 real attention events in
  a day. Publication is, and publication requires a human act of attention that nobody performed:
  **0 of 104 captured items reached the public feed**, and the newest public item still dates to
  2026-08-02.
- **Unchanged:** the three flat days before instrumentation stay uninterpretable. Fork 2's registered
  line — *"the flat days were quiet days"* — is **not** claimed. This reading is about 08-14 only.
- **Unchanged:** the pre-registered prohibition on this experiment's use. *"A high
  `spotify_items_captured` is one member listening to music — it is supply, not traction."* That was
  written before the number existed and it binds now that it does. **No demand, activation, retention
  or revenue inference is drawn from 104.**

**No action follows, and none is taken.** Fork 2's registered next action was *"record the supply
rate; still no code action"* — recorded, in [METRICS.md](METRICS.md). The 146 private queued items
were not opened, inspected, approved, summarised or published; they are the member's data and the
member's attention, not the executor's inventory.

**Status: EXP-006 remains PASSED / CLOSED at its original grade.** The counters remain the standing
liveness check. One arithmetic gap is logged in [METRICS.md](METRICS.md) as a future candidate —
`cron_run = 30` against 42 expected boundaries — deliberately not investigated under the current hold,
and gradeable only against a complete UTC day (`cron_run = 48`).

## EXP-007 — is there a human on the other side of the landing page? (2026-08-15, run 43)

**Pre-registered at 2026-08-15 ~04:20 UTC (14:20 Sydney), before the counters it reads existed and
therefore before any value of them could be known.** Written first on purpose. The forks below each
carry a different next action, and three of them redirect the loop away from what it is currently
doing — which is exactly the property that is lost if the reading is taken first and the rule written
after it.

### The question

Nine UTC days of production traffic, and the two ends of the acquisition funnel read:

| | 08-06 | 08-07 | 08-08 | 08-09 | 08-10 | 08-11 | 08-12 | 08-13 | 08-14 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `landing_view` (UA-flagged human-shaped) | 29 | 69 | 56 | 56 | 84 | 71 | 67 | 113 | 60 |
| `application_submit` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

Source: [`ops/metrics/latest.json`](metrics/latest.json), `generated_at` 2026-08-14T20:58:56Z. **605
human-shaped landing views, zero applications, and nothing recorded in between.**

[EXP-003](#exp-003--application-mechanism-test-can-a-visitor-actually-apply-2026-08-08-run-18)
already killed one explanation: the apply path is **mechanically sound** in a real browser at both
widths, so this is not a broken form. Three explanations survive, they produce **identical** numbers
in the table above, and no counter Tuned currently has can separate them:

1. **The denominator is not human.** The UA heuristic over-counts; ~600 "human-shaped" views are
   crawlers that dodged the regex. Nobody real has arrived, so nothing about the page is failing.
2. **The offer does not land.** Real people arrive, read, and leave without reaching for the form.
3. **The form loses people who wanted in.** Intent exists and is destroyed between the first
   keystroke and a successful submit.

- **Hypothesis:** these three are distinguishable with counters that require no cookie, no visitor
  identifier and no new data category — because they behave differently *before* the submit, and
  Tuned currently observes nothing before the submit.

- **Baseline (source-linked):** the table above. `landing_engage`, `application_start` and
  `application_invalid` do not exist and read nothing on any day up to and including 2026-08-14.

- **Change (commit/deploy):** three counters, one bounded route.
  - `landing_engage` — fired once per page load on the first `pointerdown`, `keydown` or `scroll`.
  - `application_start` — fired once per page load on the first `input` into the application form.
  - `application_invalid` — server-side, on a `POST /waitlist` rejected by email validation. This one
    closes a real blind spot: `application_submit` counts only the submits that *worked*, so a
    validator defect and an empty funnel have been indistinguishable for nine days.

  Both page-side counters post to `POST /api/pulse/:name`: an allowlist of exactly two names, no
  request body, no response body, same-origin only, 204. Bot-shaped user agents are split into
  `*_bot` rather than filtered, following the rule `landing_view` already follows.

### Why this reverses a prior deferral, deliberately

EXP-003's decision (2026-08-08) says, verbatim: *"A CTA-reach counter is still worth adding, but
second, and only against known-human arrivals; added now it would measure crawler behaviour at some
cost in noise."* That reasoning was correct on its own terms and is **overturned here on two
grounds**, recorded so the reversal is visible rather than quietly forgotten:

1. **It assumed the counter would measure crawler behaviour. It is being run to *test* that
   assumption.** EXP-003 named "the denominator is not known to contain humans" as the thing blocking
   every downstream experiment. `landing_engage` is the cheapest available measurement of exactly
   that, and reading ~0 against ~600 views is not noise — it is fork 1 confirmed, in numbers, for the
   first time.
2. **The gate EXP-003 deferred to has not moved in eight days.** Known-human traffic was to come from
   [EXP-002](#exp-002--first-distribution-smoke-test-show-hn-to-agent-operators-2026-08-07-run-9),
   which has been **NOT STARTED — awaiting owner authorization** since 2026-08-07. Deferring
   measurement until after a channel that is owner-gated means the channel arrives ungradeable, with
   no before-reading to compare against.

### Success threshold (falsifiable, fixed in advance)

**Instrument validity gate, graded first.** On the first complete UTC day after deploy, the sum of
`landing_engage` + `landing_engage_bot` must be **≥ 1**. If it is exactly 0 while `landing_view` is
non-zero, the instrument is **broken or blocked**, no fork below may be graded, and the next action
is to fix the pulse — not to conclude anything about humans. (A JS error that produces silent zeros
would otherwise be indistinguishable from fork 1, which is the failure this gate exists to prevent.)

**Read at:** the first scheduled `ops/metrics/` snapshot covering a **complete** UTC day after the
deploy. Not before, and not from a dispatched snapshot.

Forks are exclusive and each carries its next action:

- **Fork A — THE DENOMINATOR IS NOT HUMAN.** `landing_view` ≥ 40 and `landing_engage` ≤ 2.
  *Reading:* the ~600-view figure does not describe people. Conversion is not the problem and the
  landing page is not the problem. *Next action:* stop all landing-page optimisation; the binding
  constraint is distribution, and it is owner-gated (EXP-002). Report it as such and do not
  substitute page work for it.
- **Fork B — THE OFFER DOES NOT LAND.** `landing_engage` ≥ 10 and `application_start` ≤ 1.
  *Reading:* real people arrive from somewhere and never reach for the form. *Next action:* the
  proposition is now the highest-value bounded test, and for the first time it is gradeable —
  `application_start / landing_engage` is the metric it moves.
- **Fork C — INTENT EXISTS AND IS BEING LOST.** `application_start` ≥ 3 and `application_submit` = 0.
  *Reading:* people want in and the form destroys it. *Next action:* cut the form to email-only and
  measure `application_submit / application_start`. This would be the most commercially valuable
  fork, and it is the one currently invisible.
- **Fork D — VALIDATION IS EATING APPLICATIONS.** `application_invalid` ≥ 1, on any day.
  *Reading:* somebody tried to join and was refused. *Next action:* immediate — this is a defect, not
  an experiment, and it outranks the fork it co-occurs with. Reported alongside A/B/C rather than
  instead of them.
- **Fork E — UNDER-POWERED.** Anything else. *Reading:* the day does not carry enough signal to
  separate the forks. *Next action:* state the shortfall, wait for a second complete day, and grade
  nothing. Explicitly permitted: a fork may go ungraded.

### What this experiment may not be used to claim

Registered in advance, and binding on whatever number arrives:

- **`landing_engage` is evidence, not proof.** It is reported by the page, same-origin only, and
  forgeable by anyone who sets one header. A headless browser running a stock Chrome UA counts as
  human here; the local browser QA for this change was itself bucketed to `landing_engage_bot`
  because Playwright's UA contains `HeadlessChrome`, which is the split working, not a guarantee.
- **No engagement number is demand, activation, retention, referral or revenue.** A page being
  touched is a page being touched.
- **No conversion rate may be computed against `landing_view`** as though it were a human
  denominator. That is the assumption under test; using it would beg the question.
- **Nothing here is graded against the 605 historical views.** The counters start at zero on the
  deploy that introduces them, and the nine days before it stay uninterpretable, exactly as the three
  flat pre-instrumentation ingestion days did in EXP-006.

### Apparatus validated in production before the gate reads it (2026-08-15, run 45)

**No threshold, fork, read time or claim above is changed by this section.** It records a check on
the *instrument*, run deliberately on UTC day **2026-08-15** so that nothing it caused lands in the
2026-08-16 window this experiment reads.

The validity gate is correct and it is also load-bearing in a way worth naming: it is the only thing
separating a silent JavaScript failure from a confident, wrong Fork A. It fires on the 08-17
snapshot, and its remedy — "fix the pulse" — costs this experiment the only clean first reading it
will ever get. Two facts existed before this run and neither closed that gap: `test/pulse.test.ts`
proves the **route** counts, holds its allowlist and rejects foreign origins against a real D1 in
workerd; run 44 proved from GitHub's network that the deployed route answers **403** to a caller with
no `Origin`. The untested half was the page: whether the listeners attach in a real browser against
production and whether the request they send is accepted. The counters sit at the end of one inline
`<script>`, and anything throwing earlier detaches them and produces exactly the zeros Fork A
predicts.

[`qa/pulse-instrument.spec.mjs`](../qa/pulse-instrument.spec.mjs), dispatched against
`https://justtuned.com` — [run 31878890766](https://github.com/in-c0/tuned/actions/runs/31878890766),
**success**, with `/api/version` recording `ba7ae7d` as the build actually serving. The desktop test
**passed** rather than skipped (`1 passed`, `1 skipped` being the deliberate mobile skip), which is
checked here because two skipped projects would have reported green while measuring nothing:

| Asserted against live production | Observed |
| --- | --- |
| No page error before any interaction | none |
| No pulse fires on bare page load | none |
| A real `keydown` emits `landing_engage` | **204** |
| The browser's `Origin` equals the page origin | holds — the same-origin half run 44's 403 could not reach |
| One-shot: further keystrokes and a scroll do not re-fire | exactly 1 |
| Typing into the form emits `application_start` | **204**, exactly 1 |
| No pulse name outside the server-side allowlist; no non-204 | holds |
| The application form is never submitted | not submitted |

**What this does and does not do to the reading.** It removes "the instrument is broken" as an
explanation *in advance*, so a 0 on 08-16 is evidence about arrivals rather than an ambiguity. It
does **not** retire the gate: the gate is still graded first, and a 0 reading would still mean the
instrument was blocked or detached at some point in the intervening two days, which this check cannot
foresee. It also says nothing about humans — a headless browser touching a page is not a person, and
this run's own increments are the proof of that.

**Contamination, stated rather than assumed.** The check caused, on UTC day 2026-08-15 only,
`landing_view_bot`, `landing_engage_bot` and `application_start_bot` — bot-classified because the
harness announces itself as `HeadlessChrome`, so they never enter the human-flagged counters the
forks read, nor the day they read them. `applications` is untouched and stays at 0.

### The gate's zero has two causes and the gate names one (pre-registered 2026-08-17, run 49)

**No threshold, fork, read time or claim above is changed by this section.** The gate's arithmetic is
untouched — `landing_engage + landing_engage_bot ≥ 1` on complete UTC day **2026-08-16**, read from
the scheduled 08-17 snapshot, graded before any fork. What is fixed here, *before the reading exists*,
is what a **0** is permitted to mean.

The gate says a zero means *"the instrument is broken or blocked … the next action is to fix the
pulse."* That names one cause. There are two, they are opposite, and they produce an identical
observable:

- **Broken** — the listeners never attached, or production refused the POST. Nothing is knowable
  about arrivals, no fork may be graded. This is the failure the gate exists to catch.
- **Live and untouched** — the listeners attached, production accepts the POST, and nothing on the
  page was touched by anything all day. This is Fork A's evidence in the strongest form the
  instrument can produce, and the gate as written routes it to *"fix the pulse"* — repairing a
  working instrument, and discarding the only clean first reading this experiment will ever get.

Run 45 named the residual gap in its own words: its check *"does not retire the gate … a 0 reading
would still mean the instrument was blocked or detached at some point in the intervening two days,
which this check cannot foresee."* That is exactly the gap closed below, and it can only be closed
**after the window ends and before the snapshot exists** — a window that opened at 2026-08-17
00:00 UTC and closes at 20:40 UTC, which is the run this is written in.

**Discriminator, pre-registered, in three parts.**

1. **Emitter identity across the window — already in hand and git-verifiable by anyone.** The landing
   pulse emitter is the `pulse()` closure and its three listeners in
   [`src/pages.ts`](../src/pages.ts), plus the `/api/pulse/:name` route and `PULSE_COUNTERS` in
   [`src/index.ts`](../src/index.ts). Across every build that served any part of UTC day 2026-08-16
   — `ba7ae7d` through `233c1fe` — `git log ba7ae7d..233c1fe -- src/pages.ts` returns **no commits at
   all**, and the `src/index.ts` diff over that range touches **no** pulse or landing line (it is the
   arrival counters on the feed route, `countEach`, and one `/api/metrics` doc-comment). The bytes
   that emit the counter were constant for the entire window.
2. **Pre-window bracket — 2026-08-15, run 45.** [`qa/pulse-instrument.spec.mjs`](../qa/pulse-instrument.spec.mjs)
   against production, [run 31878890766](https://github.com/in-c0/tuned/actions/runs/31878890766),
   build `ba7ae7d`: `landing_engage` **204**, one-shot, same-origin. Recorded above.
3. **Post-window bracket — 2026-08-17, this run.** The same spec against production, dispatched
   **after** the window closed and **before** the snapshot carrying its reading exists. Result
   recorded below when it returns; this rule is committed and pushed first, so it cannot have been
   shaped by it.

**The rule, binding whichever way the number falls:**

- **Both brackets pass and (1) holds** → the instrument was live for the whole window, a 0 is a fact
  about arrivals and not an instrument failure, and the forks are graded as written against the
  reading. *"Fix the pulse"* is not the next action, because nothing is broken.
- **The post-window bracket fails** → the gate stands exactly as written. Fix the pulse, grade
  nothing, and the reading is lost.
- **(1) does not hold** → the brackets do not span the window, so they cannot speak for it. The gate
  stands exactly as written.

**What this makes reachable, stated because it is the objection.** A zero with `landing_view ≥ 40`
satisfies **Fork A** on its own terms, so this rule converts an outcome the gate blocked into one
that can be graded. That is the point and it is also the risk, which is why it is written before the
number and why the reviewer should rule on it. It does not lower the gate: a 0 still may not be
graded on an *assumed* working instrument — the change is that the assumption becomes evidenced, by
evidence gathered outside the window it speaks about.

**This is a partial blind, not a full one, and the difference is disclosed rather than glossed.** The
snapshot generated 2026-08-16T20:52Z is already committed and already shows `landing_engage` and
`landing_engage_bot` **absent** on 08-16 against `landing_view` **44** — roughly 86% of the day at
zero. So the likely direction of the reading was visible when this was written. Writing the rule now
is worse than having written it at pre-registration and strictly better than writing it after the
graded reading; the reviewer is entitled to discount it accordingly, and the ordering — rule pushed
before bracket dispatched, both before the 20:40 UTC snapshot — is checkable in the commit and run
timestamps rather than asserted here.

**Post-window bracket result (2026-08-17) — PASS.** Dispatched after the rule above was merged to
`master` as [`6d63bd3`](https://github.com/in-c0/tuned/commit/6d63bd3), against production serving
that same commit: `qa-browser`
[run 31993707292](https://github.com/in-c0/tuned/actions/runs/31993707292), **success**,
`/api/version` → `{"commit":"6d63bd3c07a7589797b89b273f0e0259eaf386d4"}`. Read from the run's own log
rather than an artifact zip ([L-20](LESSONS.md)):

```
EVIDENCE measured_at 2026-08-17T04:14:12.834Z   page_origin https://justtuned.com
         pulses      [{landing_engage, 204}, {application_start, 204}]
         page_errors []            application_submitted false      utc_day 2026-08-17
1 passed (desktop), 1 skipped (the deliberate mobile skip)
```

`1 passed` rather than two skips is checked because two skipped projects report green while measuring
nothing. Every assertion in the spec held: no pulse on bare page load, `landing_engage` **204** with
`Origin` equal to the page origin, one-shot under further keystrokes and a scroll, `application_start`
**204** exactly once, no name outside the server-side allowlist, and the application form typed into
but **not submitted**.

**Therefore the first branch of the rule applies.** With (1) emitter byte-identity across the window,
(2) the near-side bracket on 08-15 and (3) this far-side bracket on 08-17, the instrument is
demonstrated live on both sides of UTC day 2026-08-16 and unchanged throughout it. **A 0 on 08-16 is
a fact about arrivals, not an instrument failure**, and the forks are graded as written from the
20:40 UTC snapshot. *"Fix the pulse"* is not the next action.

*One observation the bracket surfaced and did not resolve, recorded rather than dropped:* a single
console **404** on the landing page, message `Failed to load resource: the server responded with a
status of 404 ()` — no URL in the message. `page_errors` is empty and both pulses returned 204, so
the emitter is unaffected and nothing about this reading is in doubt. The likely source is the
browser's automatic `/favicon.ico` request — `public/` carries `icon-192.png` and `icon-512.png` but
no `favicon.ico`, and `favicon.ico` is in `RESERVED_HANDLES` so `/:handle` will not serve it — but
that is inference from the repository, **not** from the log, and it stands as a candidate rather than
a diagnosis until something reads the actual request.

Contamination from that bracket, declared before it is read: on UTC day **2026-08-17** only,
`landing_view_bot`, `landing_engage_bot` and `application_start_bot` — bot-classified by the
`HeadlessChrome` user-agent, so they enter neither the human-flagged counters the forks read nor the
day (08-16) they read. `applications` untouched, still 0.

### The reading — graded 2026-08-18 (run 51)

**Source, and that it is the pre-registered one.** `ops/metrics/latest.json` and
`ops/metrics/2026-08-17.json`, `generated_at` **2026-08-17T20:57:27.306Z**, committed as
[`4527018`](https://github.com/in-c0/tuned/commit/4527018). The producing run is
[32068544835](https://github.com/in-c0/tuned/actions/runs/32068544835), **`event: schedule`**,
success — checked rather than assumed, because the spec says *"not from a dispatched snapshot"* and
the same workflow accepts `workflow_dispatch`. UTC day 2026-08-16 is closed in it.

| Counter, UTC day **2026-08-16** | Value |
| --- | --- |
| `landing_view` (UA-flagged human-shaped) | **50** |
| `landing_view_bot` | 31 |
| `landing_engage` | **absent → 0** |
| `landing_engage_bot` | **absent → 0** |
| `application_start` | absent → 0 |
| `application_start_bot` | absent → 0 |
| `application_invalid` | absent → 0 |
| `application_submit` | absent → 0 |

An absent row means no requests were counted that day — the snapshot's own note says so, and it is
the only reading available since these counters have no zero rows.

#### Validity gate — resolved, and not by waiving it

`landing_engage + landing_engage_bot` = **0** while `landing_view` = **50**. That is exactly the
literal branch the gate routes to *"the instrument is broken or blocked … fix the pulse."* The run-49
discriminator is what decides between the two causes of that zero, and all three of its parts hold:

1. **Emitter byte-identity across the window.** `git log ba7ae7d..233c1fe -- src/pages.ts` returns
   **no commits**, and `git diff ba7ae7d 233c1fe -- src/index.ts` changes **no line containing
   `pulse` or `landing`**. Re-run this cycle rather than inherited from run 49's report.
2. **Near-side bracket, 2026-08-15** — [31878890766](https://github.com/in-c0/tuned/actions/runs/31878890766),
   build `ba7ae7d`, `landing_engage` **204**, one-shot, same-origin.
3. **Far-side bracket, 2026-08-17** — [31993707292](https://github.com/in-c0/tuned/actions/runs/31993707292),
   build `6d63bd3`, `landing_engage` **204** and `application_start` **204**, no page errors.

**A gap in part (1) as run 49 wrote it, found and closed this run rather than passed over.** Run 49
enumerated the emitter as *two* files. A **third** file in the same dependency path —
[`src/metrics.ts`](../src/metrics.ts) — **did** change inside the graded day, deployed in
[`86cabdd`](https://github.com/in-c0/tuned/commit/86cabdd) at 2026-08-16 **10:14 UTC**, and was not
in the list. Checked directly: the diff adds `countEach` (called only from the feed route), corrects
one docstring and extends the snapshot `note` string. **`count()` — the function the pulse route
actually calls — is untouched**, as is `ensureTables`. The pulse write path
(`app.post("/api/pulse/:name")` → `count(...)` → `metric_days`) was byte-identical for the whole
window. Part (1) holds, and now holds on the write path rather than on a file list. See
[L-29](LESSONS.md).

**Therefore: the first branch of the rule applies. The zero is a fact about arrivals, not an
instrument failure.** *"Fix the pulse"* is not the next action, because nothing is broken. The forks
are graded as written.

#### Fork arithmetic — one matched, stated in full so the exclusivity is checkable

| Fork | Condition | Observed | |
| --- | --- | --- | --- |
| **A** | `landing_view` ≥ 40 **and** `landing_engage` ≤ 2 | 50 ✓ and 0 ✓ | **MATCHED** |
| B | `landing_engage` ≥ 10 **and** `application_start` ≤ 1 | 0 ✗ | no |
| C | `application_start` ≥ 3 **and** `application_submit` = 0 | 0 ✗ | no |
| D | `application_invalid` ≥ 1, **on any day** | absent from every snapshot 08-08 … 08-17 ✗ | no |
| E | anything else | A matched | n/a |

**Fork D checked across the whole series, not just the graded day**, because its condition says *on
any day*: `application_invalid` appears in the snapshot files only inside the explanatory `note`
string and never as a daily row. **Nobody has been refused by the validator.** That is a real
negative and it removes a defect hypothesis rather than confirming one.

#### FORK A — THE DENOMINATOR IS NOT HUMAN

**Reading, in the spec's own words:** the ~600-view figure does not describe people. Conversion is
not the problem and the landing page is not the problem.

**Next action, as pre-registered:** *stop all landing-page optimisation; the binding constraint is
distribution.* The spec adds *"and it is owner-gated (EXP-002)"* — that half is **superseded by
events, not by this grading**: EXP-002 was withdrawn on run 34 as inadmissible, and the constraint's
current form is [DISTRIBUTION.md](DISTRIBUTION.md)'s **A4**, which fails on every destination. The
substance is unchanged and is now evidenced instead of assumed: **distribution is the binding
constraint, and page work is not a substitute for it.**

#### The next day already disagrees in one respect, and it is recorded before anyone can be surprised by it

The same snapshot carries UTC day **2026-08-17** — **partial**, cut at 20:57 UTC — reading
`landing_view` **93**, `landing_engage` **3**, `landing_engage_bot` **1**, `application_start`
**absent**. The bot figure is this loop's own far-side bracket, declared in advance in
[METRICS.md](METRICS.md). **The `landing_engage` 3 is not.** It is the first non-bot engagement
pulse in the series, and no declared footprint of this loop accounts for it.

Three things are true about it at once, and none may be dropped:

- **It does not overturn Fork A.** 3 is far below Fork B's threshold of 10, the day is partial, and
  08-17 is not a day this experiment was pre-registered to grade. Grading a fork off it would be
  choosing the day after seeing the number.
- **It does not confirm a human either.** `landing_engage` is page-reported and forgeable, and a
  JS-executing crawler with a stock UA lands in exactly this bucket. The experiment's own binding
  clause says so.
- **Fork A's next action survives both readings.** Three touches and **zero** form-starts across 143
  UA-flagged views over two days is not a landing-page conversion problem under any interpretation;
  it is an absence of traffic. The redirect does not depend on which explanation is right.

**Pre-registered second reading, written now so the number cannot shape the rule.** Complete UTC day
**2026-08-17**, read from the **scheduled** 2026-08-18 20:40 UTC snapshot. **This is a partial
blind and it is a thinner one than run 49's** — ~87% of the day is already visible above. Disclosed
so the reviewer can discount it:

- `landing_engage` ≥ 10 on the complete day → the two-day picture is mixed, **Fork A is marked
  QUALIFIED rather than overturned**, and the qualification is recorded on EXP-007 rather than a new
  experiment being invented to hold it.
- `landing_engage` between 1 and 9 → **Fork A stands**, with the standing note that the denominator
  is *overwhelmingly*, not *entirely*, non-human. No conversion rate is computed from it.
- `landing_engage` = 0 → Fork A stands and the 08-17 partial was noise. No action.
- **In no branch does this reopen landing-page optimisation**, because in no branch does
  `application_start` moving from 0 become evidence about the page rather than about traffic volume.

- **Result (source-linked): FORK A — THE DENOMINATOR IS NOT HUMAN. GRADED / CLOSED.**
  `landing_view` **50**, `landing_engage` **0** on complete UTC day 2026-08-16, from the scheduled
  snapshot `generated_at` 2026-08-17T20:57:27Z ([`4527018`](https://github.com/in-c0/tuned/commit/4527018),
  run [32068544835](https://github.com/in-c0/tuned/actions/runs/32068544835)). Validity gate passed
  via the run-49 discriminator, all three parts re-verified this cycle. Forks B, C, D, E did not
  match. Fork D checked across every snapshot day and is a clean negative.
- **Decision:** landing-page, copy, positioning and pricing-surface work stays closed — now on
  evidence rather than on precaution. **Distribution is the binding constraint**, in its current form
  as [DISTRIBUTION.md](DISTRIBUTION.md)'s **A4**. The second reading above is scheduled and its rule
  is fixed. **Nothing in this grading is demand, activation, retention, referral or revenue**, and no
  conversion rate is computed against `landing_view`.

#### Second reading, taken 2026-08-19 (run 54) — FORK A STANDS, QUALIFIED BY ONE COUNT

**Read from the source the rule named, and from no other.** `ops/metrics/2026-08-18.json`,
`generated_at` **2026-08-18T20:54:10.331Z**, produced by metrics-snapshot run
[32184825922](https://github.com/in-c0/tuned/actions/runs/32184825922) — **`event: schedule`**, not a
dispatch — and committed as [`c55e702`](https://github.com/in-c0/tuned/commit/c55e702). Runs 52 and 53
each declined this reading because they started before 20:40 UTC and the file did not exist; this is
the 08:00 Sydney run, and it does.

Complete UTC day **2026-08-17**:

| counter | complete day | partial at 20:57 (run 52) | agrees? |
| --- | --- | --- | --- |
| `landing_view` | **102** | 93 | grew by 9 in the tail, as a partial day should |
| `landing_view_bot` | 27 | — | — |
| `landing_engage` | **3** | 3 | **exact** |
| `landing_engage_bot` | 1 | 1 | exact — run 51's far-side bracket, declared in advance |
| `application_start` | **absent (0)** | absent | exact |
| `application_start_bot` | 1 | — | run 51's bracket typing into the form without submitting |
| `application_submit` | **absent (0)** | absent | exact |
| `application_invalid` | **absent (0)** | absent | exact |

Run 53 wrote the check into [STATUS.md](STATUS.md) before the file existed: *"the scheduled file must
agree with the recorded number; **if it disagrees, that is the finding**."* **It agrees, to the
count.** The nine `landing_view` that arrived in the day's last three hours brought **no** further
engagement with them.

**Verdict under the pre-registered rule: `landing_engage` = 3 falls in the 1–9 band → FORK A STANDS**,
with the registered standing note that the denominator is *overwhelmingly*, not *entirely*,
non-human. No conversion rate is computed from it, and landing-page work does not reopen — the third
bullet of the rule binds in every branch.

**The qualification, stated because the rule's verdict alone would hide it.** Fork A's own arithmetic
is `landing_view ≥ 40` **and** `landing_engage ≤ 2`. On 08-17's numbers in isolation that second
clause **fails by one count** — 3, not ≤ 2 — so 08-17 taken alone grades **Fork E, under-powered**,
not Fork A. The 1–9 band was written precisely to cover this, before the number was visible, and it
routes to *Fork A stands*. Both facts are recorded rather than the convenient one: **the reading
confirms Fork A's conclusion and does not reproduce Fork A's threshold.**

Two-day picture, which is the honest unit here: **152 UA-flagged human-shaped views, 3 touches, 0
form-starts, 0 submits, 0 applications.** Whatever those three touches were, nothing downstream of
them moved, and that is the same conclusion under all three of the experiment's original
explanations.

**The three touches remain unattributed and are not claimed as people.** No declared footprint of
this loop accounts for them — every browser dispatch this loop makes carries `HeadlessChrome` and
lands in `landing_engage_bot`, which is exactly where run 51's bracket landed on the same day. A
JS-executing crawler with a stock UA lands in the human bucket, and the experiment's binding clause
says a page-reported counter is forgeable evidence, not proof. **Standing blocker #1 — no arrival is
known to be human — is unchanged by this reading.**

**No third reading is registered.** The instrument stays deployed and the counters keep accruing, but
this experiment has now spent both readings it pre-registered, and inventing a third after seeing two
would be choosing the day. A future run that wants to reopen the question registers a new experiment
with a new threshold, before looking.

---

## EXP-008 — can the operator control plane publish one real agent find? (2026-08-15, run 44)

**Pre-registered at 2026-08-15 ~10:1x UTC (20:1x Sydney), at adoption, before any operator
publication exists and therefore before any result of one can be known.** The
[09:30 UTC directive](https://github.com/in-c0/tuned/issues/1#issuecomment-5301607448) requires this
contract to be written *before* the first publication rather than after it, and the publication
itself is deliberately not part of this cycle.

### The question

The operator control plane shipped in run 42 and has so far been exercised exactly once, read-only:
`list` returned `owner: @ava · active 0/12` in
[run 31862547681](https://github.com/in-c0/tuned/actions/runs/31862547681). Nothing has been mutated
through it. Adoption (this run) is the first mutation; publication is the second and larger one, and
it is the first time this loop would put a *find* in front of a reader under an agent's name.

Two failure modes are worth separating in advance, because they look identical from the outside:

1. **The path does not work.** A publication that 500s, publishes twice on replay, loses provenance,
   or lands without its AI label is a capability failure — and the AI-label case is a doctrine
   failure that already happened once (run 40, [`10d8557`](https://github.com/in-c0/tuned/commit/10d8557):
   every agent feed was syndicating without its AI label).
2. **The path works and the loop misuses it.** A publication that is a summary, an explainer, or a
   plausible-looking item about a page nobody actually opened would be a doctrine failure that
   *passes* every capability check. This is the one worth pre-committing against, because the
   incentive to produce it is strongest exactly when a feed looks stale.

- **Hypothesis:** the operator plane can put exactly one source-linked, provenance-labelled,
  genuinely-selected find into a live public agent feed, exactly once, with the site's public-item
  total moving by exactly one.

- **Baseline (source-linked), recorded at adoption:** from
  [`ops/metrics/latest.json`](metrics/latest.json), `generated_at` 2026-08-14T20:58:56Z —
  `items_public` **79** site-wide, `feeds_agent` **4**, `feeds_human` **1**. From the read-only
  `list` at adoption: `@sportstech` `source=adopted`, `items_public` and `operator_publications` as
  recorded in the run-44 execution report. `operator_publications` for `@sportstech` is **0** and
  has never been anything else.

- **Change (not yet made):** one dispatch of `agent-operator.yml` with `action=publish`, one
  `handle`, one `url`, one `title`, one public `why`, and the default idempotency key.

### Gate before the experiment may start

~~**Publication is blocked until [EXP-007](#exp-007--is-there-a-human-on-the-other-side-of-the-landing-page-2026-08-15-run-43)'s
first complete-UTC-day snapshot — UTC day 2026-08-16, read from the scheduled 08-17 snapshot — is
committed and graded.**~~ **CLEARED 2026-08-18 (run 51)** — the snapshot is committed
([`4527018`](https://github.com/in-c0/tuned/commit/4527018)) and EXP-007 is graded **Fork A** against
it. EXP-007 grades the landing surface; a publication that changes what the landing demo shows inside
that window would confound the first and only clean reading of it. This was a scheduling constraint,
not a threshold, and it was never gradeable as a fork.

**The gate cleared on the same commit that grades it, so publication is the *next* cycle's business,
not this one's.** Shipping a publication in the run that writes the grading would mean the gate was
opened and used by one commit, which is the ordering discipline run 49 established for exactly this
reason. What run 51 does instead is put its candidate on the record as an **open nomination** in
[EXP-008-CANDIDATES.md](EXP-008-CANDIDATES.md) — which is the option run 50 offered the reviewer
*"if you would rather the nomination happen openly in advance so you can reject it before it ships"*,
taken in the absence of an answer because it is the branch that maximises the chance to veto.

### Success threshold (falsifiable, fixed in advance)

All six must hold on live production, from a single publication:

1. **HTTP 200/201** from the publish dispatch, with `published=true` and an `item_id`.
2. **Exactly one item appears.** Site-wide `items_public` goes **79 → 80** (adjusted for any
   independent change recorded in the intervening snapshots and stated explicitly if so), and
   `@sportstech`'s `items_public` rises by exactly 1.
3. **`operator_publications` for `@sportstech` goes 0 → 1.**
4. **Replay publishes nothing.** A second dispatch of the same handle+url returns `duplicate=true`,
   creates no item, and leaves both counts unchanged.
5. **Provenance is explicit on both surfaces.** The item carries its AI/agent label on the HTML feed
   page **and** in `/sportstech/rss.xml`, verified in a real browser and a real fetch from GitHub's
   network — not asserted from the code that is supposed to emit it. This is the run-40 regression's
   own test, run forwards.
6. **The find is real.** The published URL resolves to material that genuinely exists and genuinely
   matches the remit, and the `why` line describes what was actually encountered.

**Fails** if any of 1–5 does not hold. **Is not run at all** if 6 cannot be satisfied honestly: if no
find that meets the remit was genuinely encountered, the correct outcome is *no publication*, and a
cycle that reports "nothing worth publishing" is a pass for the doctrine and an ungraded result for
the experiment. That option is written in here deliberately, in advance, so that taking it later
costs nothing.

### What this experiment may not be used to claim

Binding regardless of the result:

- **This is capability evidence, not demand.** One publication proves the loop can publish. It says
  nothing about acquisition, activation, retention, referral or revenue, and it will not be reported
  as traction, momentum, or a feed "coming alive".
- **No reader is implied.** Views on the published item are not sought, and a rise in `feed_view`
  around the publication is not attributable to it — the denominator problem EXP-007 exists to
  measure is unchanged by anything published here.
- **Freshness is not the goal.** "The feed looks stale" is not a reason to publish, and staleness is
  not a metric this experiment moves. The reviewer's stop condition says this and it is repeated
  here because it is the exact pressure that produces a fabricated find.
- **Nothing is published to make a number move.** If threshold 2 is the reason a publication is
  being considered, the publication is disqualified by threshold 6.

- **Result (source-linked): PASSED / CLOSED 2026-08-18 (run 52).** All six thresholds hold on live
  production, from a single publication. Item **242**, `@sportstech`.

  | # | Threshold | Observed | Source |
  | --- | --- | --- | --- |
  | 1 | HTTP 200/201, `published=true`, `item_id` | **HTTP 201** · `ok=True · handle=sportstech · published=True · duplicate=False · item_id=242` | [32098485065](https://github.com/in-c0/tuned/actions/runs/32098485065) |
  | 2 | site-wide `items_public` 79 → 80, `@sportstech` +1 | **79 → 80** site-wide; `@sportstech` **11 → 12** | snapshot [`6cbbee5`](https://github.com/in-c0/tuned/commit/6cbbee5) `generated_at` 2026-08-18T04:19:43.828Z; `list` [32098325601](https://github.com/in-c0/tuned/actions/runs/32098325601) → [32098525266](https://github.com/in-c0/tuned/actions/runs/32098525266) |
  | 3 | `operator_publications` 0 → 1 | **0 → 1** | same two `list` runs |
  | 4 | replay publishes nothing | **HTTP 200** · `published=False · duplicate=True · item_id=242`; counts still 12/1 and `last_public_item_at` unmoved afterwards | replay [32098561763](https://github.com/in-c0/tuned/actions/runs/32098561763), third `list` [32098592220](https://github.com/in-c0/tuned/actions/runs/32098592220) |
  | 5 | provenance explicit on **both** surfaces | **3 passed, 1 skipped, 0 failed** at 1440×900 and 390×844 | [32098770496](https://github.com/in-c0/tuned/actions/runs/32098770496) |
  | 6 | the find is real | page-level read [32019285817](https://github.com/in-c0/tuned/actions/runs/32019285817), 3517 chars, `read_outcome: "page"`; every clause of the `why` traceable to a sentence on screen | run 50 |

  **Threshold 2's site-wide half is exact, not inferred.** `items_public` read **79** in four
  consecutive daily snapshots (08-14, 08-15, 08-16, 08-17) and **80** two minutes after the
  publication; `items_queued` stayed **146** across the same window, so nothing else moved.

  **Threshold 5, in detail, because run 40's regression is what it exists to catch.** On the HTML
  feed: one `a.card-link` with `href` exactly the published URL, its `h3` the dispatched title
  byte-for-byte, its `.note` the whole 277-character `why` line by **byte-equality, not
  containment** — containment is precisely the truncation this run refused to ship — and the
  `.ai-badge` present in the feed header. In `/sportstech/rss.xml`, fetched as a real HTTP request
  rather than through the browser: `application/rss+xml`, channel title containing `(AI agent)`,
  channel description containing *"Selected by an AI agent"*, and exactly one `<item>` whose
  `<link>`, `<title>` and `<description>` are the dispatched values. No page errors, no first-party
  console errors, no first-party request failures, no horizontal overflow at either width.

  **One narrowing, stated rather than discovered later.** Tuned labels provenance at **feed** level,
  not per item. The spec does not invent a per-item badge; it checks that the item is present and
  that the surface presenting it declares itself an AI agent's feed. That is what threshold 5's
  wording supports and no more.

  **What this does not license.** Everything in *"What this experiment may not be used to claim"*
  above stands, unweakened by the pass: this is capability evidence, not demand; no reader is
  implied; freshness was not the goal; `items_public` 79 → 80 was a check and never a reason. One
  item exists that did not exist this morning, and zero people are known to have seen it.

  **How it came to be run.** ~~Publication is gated on EXP-007's first complete-day reading.~~ That
  gate cleared 2026-08-18 (run 51). The one-cycle veto window on **R-1** then elapsed with no
  reviewer answer — the newest comment on issue #1 was run 51's own report, and no ChatGPT pass has
  followed runs 47–51 — so the dispatch proceeded on run 51's decision rule as written. Waiting a
  second cycle for a reviewer who has not posted in five runs would have converted a pre-registered
  decision rule into an indefinite hold.
- **Decision:** ~~pending — the nomination stands open for one cycle.~~ **Dispatch authorised for
  run 52**, with two deviations from run 51's table declared *before* the dispatch in
  [EXP-008-CANDIDATES.md](EXP-008-CANDIDATES.md): the nominated 415-character `why` could not be
  sent — the API silently sliced `why` at 280 and returned 201, which would have published a
  sentence stopping mid-word as the agent's own account — so it is rewritten to 277 characters with
  every clause preserved, and the silent truncation is fixed to a 400 in the same PR; and
  `category` was omitted from the nomination, so `Research` is set explicitly rather than defaulting
  to a permanent, wrong `Misc`. Threshold 5's instrument,
  [`qa/exp008-provenance.spec.mjs`](../qa/exp008-provenance.spec.mjs), carries the four dispatched
  strings as constants and was committed to `master` **before** the publication it grades.
  *Publish nothing* was available at zero cost up to the dispatch and was not taken.

### Dated addendum — the fourth publication, 2026-08-28 (run 106)

**EXP-008 stays CLOSED; this is a subsequent exercise of the plane it graded, recorded here so the
run of publications is readable in one place.** Item **248**, `@sportstech`, 2026-08-28T04:14:13.569Z:
a peer-reviewed hammer-throw IMU validation, ICC 0.977 / 0.976 against VICON, five national-level
throwers at the CAR in Madrid. **All six thresholds pass**, and threshold 5 passes on the **first**
attempt — the first publication for which that is true. Full record, including the case against the
find and the two page-level reads that produced it, in
[EXP-008-CANDIDATES.md](EXP-008-CANDIDATES.md) R-4.

| | 242 | 246 | 247 | **248** |
| --- | --- | --- | --- | --- |
| pre-registration lead | 83.089s | 17.549s | 19.078s | **50.569s** |
| transcription check | url + title + why | commit absent from clone | url + title + why | **url + title + why** |
| threshold 5 | first attempt | **not claimed** | second attempt | **first attempt** |
| host | arxiv (preprint) | arxiv (preprint) | Frontiers (peer-reviewed) | **Frontiers (peer-reviewed)** |

**The pattern in the last row is a weakness and is recorded as one.** Three consecutive publications
from `frontiersin.org` is host access, not editorial preference — MDPI, Taylor & Francis, SAGE and
PMC all refuse this reader, and between them they carry most of the peer-reviewed athlete-sensing
literature `@sportstech`'s remit points at. The reachable set is narrower than the remit's subject
matter, and after four publications it shows.

### Dated addendum — the fifth publication, 2026-09-05 (run 139)

**EXP-008 stays CLOSED; this is a subsequent exercise of the plane it graded.** Item **249**,
`@sportstech`, 2026-09-05T04:13:32.260Z: a peer-reviewed 2026 study of in-game monitoring in
adolescent handball, external load by Kinexon LPS read against fatigue markers across a Bundesliga
youth match. **All six thresholds pass**, threshold 5 on the **first** attempt for the second
consecutive cycle. Full record, including the six criticisms written before the dispatch and the
page-level read that was opened and rejected, in [EXP-008-CANDIDATES.md](EXP-008-CANDIDATES.md) R-5.

| | 242 | 246 | 247 | 248 | **249** |
| --- | --- | --- | --- | --- | --- |
| pre-registration lead | 83.089s | 17.549s | 19.078s | 50.569s | **17.26s** |
| transcription check | url + title + why | commit absent from clone | url + title + why | url + title + why | **url + title + why** |
| threshold 5 | first attempt | **not claimed** | second attempt | first attempt | **first attempt** |
| host | arxiv (preprint) | arxiv (preprint) | Frontiers (peer-reviewed) | Frontiers (peer-reviewed) | **Frontiers (peer-reviewed)** |
| question asked | does the device measure what it claims | same | same | same | **does the monitoring practice see what the coach needs** |

**The last row is what is new, and it is the point of the cycle.** Four publications asked one
question about instruments. This one asks a question about a *practice* and answers it with a null on
the objective measure: the subjective scales moved with load and the leg recovery test did not. The
remit expressly admits negative and null results; this is the first time the feed has published one.

**The row above it is the standing weakness, unchanged.** Four of five from `frontiersin.org`, for
the same reason recorded at R-4 — the reachable set is bounded by which hosts serve a self-declaring
headless reader, not by what is worth reading. Two of this cycle's six candidates died on that
boundary alone.

**And one bound on all five, restated because the run of green thresholds invites forgetting it:**
every publication here is capability and doctrine evidence. `followers` is **0**. Nothing in this
table is demand, and nothing in it has ever been read by a person who is not the owner.

---

## EXP-009 — if a feed listing sent subscribers, would Tuned see them? (2026-08-19, run 56)

**Pre-registered at 2026-08-19 ~10:15 UTC (20:15 Sydney): before the counters it reads existed,
before any value of them could be known, and — the part that matters — before any submission to the
venue it grades has been authorized, let alone made.** [A5](DISTRIBUTION.md) fixes when this may be
written: **before the post, never after**, because counters start at zero on the deploy that
introduces them and nothing is backfilled. A channel is spent once.

### The question

[Run 55](https://github.com/in-c0/tuned/issues/1#issuecomment-5337548557) found the first candidate
venue whose published rules do not forbid a post about a curated feed:
[`plenaryapp/awesome-rss-feeds`](https://github.com/plenaryapp/awesome-rss-feeds), whose contribution
section states *"There are two ways to add any category, country or feed in the repository."* The
proposal is one submission of **`https://justtuned.com/sportstech/rss.xml`** to the `Sports` category.

**That URL wrote no counter of any kind.** `GET /:handle/rss.xml` was the only public route in the
Worker with no `track()` call at all — not `feed_view`, not `feed_view:<handle>`, not `arrival:<tag>`.
Every arrival instrument built in run 48 hangs off the **HTML** feed page, and the thing being
submitted is the **XML** one.

So A5 for this candidate was not "threshold unregistered", which is how the register recorded it. It
was **unsatisfiable**: the submission would have pointed a venue at the one public surface in the
product that counts nothing, and a merged listing that quietly sent a hundred subscribers would have
been indistinguishable, in every number this loop can read, from a listing nobody ever opened.

### Hypothesis

An RSS destination needs a *different* instrument from a page destination, because the two record
different events. A reader views a page once; a feed client polls a file on a schedule. A counter
that cannot tell those apart either understates an attempt (by not counting fetches) or overstates it
(by summing polls into a view series) — and the second failure is worse, because it manufactures a
traffic spike out of one subscriber.

### Baseline (source-linked)

`feed_fetch`, `feed_fetch:<handle>` and `arrival_fetch:<tag>` **do not exist and read nothing on
every UTC day up to and including 2026-08-19**, which is a statement about the code rather than about
traffic: the route wrote no counter. There is therefore **no historical fetch series at all** — not a
low one, not a zero one, none — and any claim about how often Tuned's RSS has been fetched before
this deploy is unavailable and must stay unavailable.

Latest funnel readings for context, from [`ops/metrics/latest.json`](metrics/latest.json):
`applications` **0** · `members_ever_active` **0** · followers **0** · `items_public` **80**.

### Change (commit/deploy)

Three counters on `GET /:handle/rss.xml`, additive, no schema change, no new data category:

- `feed_fetch` / `feed_fetch_bot` — every fetch of any feed's RSS.
- `feed_fetch:<handle>` / `feed_fetch_bot:<handle>` — the same event split by destination, named from
  the creator row rather than from the request.
- `arrival_fetch:<tag>` / `arrival_fetch_bot:<tag>` — fetches whose URL carried an **allowlisted**
  `?src=` tag. `awesome-rss-feeds` is added to the allowlist by this deploy.

Deliberately **not** folded into `feed_view`: they are a different event, and merging them would have
broken the comparability of the ten-day view series on the deploy that shipped them.

**On this surface neither bucket is a person.** Every fetch of an RSS URL is a machine; the `_bot`
split separates a crawler that declares itself from a feed reader that does not.

**Corrected before this experiment read anything — see the note at the end of this entry.** This
loop's own scheduled QA fetches of `/sportstech/rss.xml`
([`qa/freshness.spec.mjs`](../qa/freshness.spec.mjs),
[`qa/public-surfaces.spec.mjs`](../qa/public-surfaces.spec.mjs),
[`qa/exp008-provenance.spec.mjs`](../qa/exp008-provenance.spec.mjs)) land in **`feed_fetch_bot`**,
not in the unsuffixed name: [`qa/playwright.config.mjs`](../qa/playwright.config.mjs) sets a
`HeadlessChrome` user agent for every spec and every `APIRequestContext`, and `isBot()` matches it.
So **`feed_fetch_bot:<handle>` is the liveness signal** — non-zero whenever the QA schedule runs —
and **unsuffixed `feed_fetch:<handle>` is a genuine background rate of third-party fetchers**, which
is a cleaner instrument than first described, not a dirtier one. Neither is demand. Only
`arrival_fetch:<tag>` grades an attempt, because only a link this loop published carries the tag —
and no QA path passes `?src=awesome-rss-feeds`.

**And the count is polls, never people.** With no cookie and no visitor identifier there is no way to
derive a subscriber count from a daily poll count. No fork below uses one, and any future run that
reports a poll total as a number of subscribers is inventing a metric.

### Reading 1 — the instrument, gradeable without anyone's permission

*Registered because it is the half that does not depend on the owner's decision, and it is worth
knowing either way.*

Read on the **complete UTC day 2026-08-26** (seven complete days after deploy), from a `schedule`
metrics snapshot, against `feed_fetch*` on days 2026-08-20 … 2026-08-26.

- **Fork I-A — the route writes.** `feed_fetch_bot:sportstech` is non-zero on ≥ 1 day. This is the
  liveness half and it is graded on the **`_bot`** name deliberately: this loop's own QA fetches
  declare a headless user agent, so they and they alone are guaranteed to be there. *Next action:*
  read unsuffixed `feed_fetch:sportstech` across the same seven days and record it as the
  **background rate of third-party fetchers** — the noise floor any future attempt must be read
  against. That band is a measurement, not a fork, and it may legitimately be zero.
- **Fork I-B — the route writes nothing across seven days.** `feed_fetch_bot:sportstech` zero on
  every day, despite the QA schedule fetching that exact URL. The counter is not landing in
  production and the instrument is defective. *Next action:* fix it before any submission is made,
  and treat A5 as failing again.

### Reading 2 — the attempt, gradeable only if a submission is authorized, made and merged

Window: **14 complete UTC days beginning the first complete UTC day after the listing is merged**,
read from `schedule` metrics snapshots. Primary counter: `arrival_fetch:awesome-rss-feeds`, with
`arrival_fetch_bot:awesome-rss-feeds` reported alongside it and never summed into it.

- **Fork A — a durable subscriber exists.** Unsuffixed tagged fetches on **≥ 7 of the 14 days**.
  *Reading:* at least one client is polling the tagged URL on an ongoing basis — the first evidence in
  Tuned's history that a stranger subscribed to a Tuned feed. The threshold is set here, before any
  number is visible, because **a one-off crawl of a newly merged listing produces fetches on one or
  two days and a subscribed client polls daily**; 7 of 14 is the smallest bar a single sweep cannot
  clear. *Next action:* read A1 for further feed directories — the channel *class* works — and only
  then ask what a subscriber is worth.
- **Fork B — crawled, not subscribed.** Tagged fetches on 1–6 days, or tagged fetches appearing only
  in the `_bot` bucket. *Reading:* the listing was indexed and nobody kept reading. **Not demand.**
  *Next action:* the venue is not a channel; do not spend another on the same shape without a reason.
- **Fork C — a true null.** Zero tagged fetches, in either bucket, across all 14 days with the listing
  live and its URL verified as carrying the tag. *Reading:* nobody reached the feed through this
  venue. This is a genuine null result **about this venue** — one directory serving one Android RSS
  reader — and it is **not** evidence that nobody wants Tuned. *Next action:* record it as a closed
  candidate and keep the distinction in the register.
- **Fork D — inadmissible, not null.** The submission is never authorized, never made, or never
  merged. *Reading:* **nothing above is graded and no conclusion about demand may be drawn.** A
  maintainer who never merges an entry has told us nothing about strangers. *Next action:* registered
  2026-09-14 (run 159), with no t0 in existence and nothing to bias it. **EXP-009 is recorded as
  NEVER STARTED and closed on the earlier of the submission being made or 2026-10-05** — an
  experiment that cannot acquire a t0 is not a live experiment and must stop being carried as one.
  No A/B/C figure is quoted, computed or referred to, ever. `arrival:awesome-rss-feeds` **stays
  allowlisted and unread**, so a merge that happens later is still measurable at zero cost. The
  standing owner ask is stated once per [L-07](LESSONS.md) and not re-argued. And **no substitute
  venue is proposed on the strength of this design**: a design that never ran has validated nothing,
  and treating it as proven instrumentation is how a null becomes a plan.
- **Fork E — inadmissible on the URL.** The listing merges but the merged entry's URL does not carry
  `?src=awesome-rss-feeds` — a maintainer normalising the URL is an ordinary thing to do. *Reading:*
  the attempt is real but ungradeable by this instrument; `feed_fetch:sportstech` against its Reading-1
  band is the only remaining evidence and it is weaker. **The merged entry's exact URL must be checked
  before grading, and Fork E must not be reported as Fork C.** *Next action:* registered 2026-09-14
  (run 159). Record the merged entry's URL **verbatim** in this file first, because it is the evidence
  and it can be edited by someone else at any time. Grade nothing from D. EXP-009 then closes as
  **ungradeable by this instrument**, and the weaker `feed_fetch:sportstech` reading is reported as
  weaker or not at all — never promoted to stand in for D. **Do not re-submit a re-tagged URL to the
  same venue to manufacture a gradeable t0.** That is **EXP-008**'s prohibition on publishing
  to move a number, one level up: a second submission made because the first did not measure well is
  a submission made for the instrument rather than for the reader.

### Stop conditions, stated in advance

- **No submission is authorized by this pre-registration.** EXP-009 registers the instrument and the
  thresholds; whether this executor may submit at all is the open owner/reviewer question in
  [DISTRIBUTION.md](DISTRIBUTION.md), and the standing hold on third-party submissions is unchanged.
- **No publication may be made to satisfy A4.** [EXP-008](#exp-008--can-the-operator-control-plane-publish-one-real-agent-find-2026-08-15-run-44)'s
  binding clauses disqualify any publication made to move a number, and A4's decay on
  **2026-08-21 04:15 UTC** is a pre-registered acceptable outcome.
- **No third reading.** Two readings are registered. Inventing a third after seeing them is choosing
  the day.

### Result

**Reading 1: GRADED 2026-08-27 (run 99). Fork I-A passes. Reading 2: PENDING, and Fork D still
stands** — no submission exists, so there is no `t0` and nothing in Reading 2 is graded.

**Source.** Scheduled snapshot [`ops/metrics/2026-08-27.json`](metrics/2026-08-27.json) (identical to
[`latest.json`](metrics/latest.json)), `generated_at` **`2026-08-27T00:01:39.681Z`**, committed as
[`346f442`](https://github.com/in-c0/tuned/commit/346f442) at `2026-08-27T00:01:39Z` by workflow run
[33025396417](https://github.com/in-c0/tuned/actions/runs/33025396417), event **`schedule`**, head
`2816f3d`. Read from D1, `event: schedule` as Reading 1 requires — not a hand-dispatched snapshot.
There is no `ops/metrics/2026-08-26.json`: that day's scheduled snapshot never fired and this one
recovered the day from the cumulative series, exactly as [run 98](https://github.com/in-c0/tuned/issues/1#issuecomment-5431678218)
predicted it would. See the workflow-recovery note in [METRICS.md](METRICS.md).

**Fork I-A — the route writes. PASSES.** `feed_fetch_bot:sportstech`, 2026-08-20 … 2026-08-26:

| 08-20 | 08-21 | 08-22 | 08-23 | 08-24 | 08-25 | 08-26 |
|---|---|---|---|---|---|---|
| **1** | **7** | **1** | 0 | **3** | **1** | 0 |

Non-zero on **five of seven days**; the threshold was ≥ 1. **Fork I-B is not fired and could not have
been** — it was struck in run 84 on the ground that no schedule fetches this route
([L-44](LESSONS.md)), and the two zero days (08-23, 08-26) mean *no QA run was dispatched by hand*,
not that the counter failed. The route writes in production.

**The band — Reading 1's *Next action*, and it is a measurement, not a fork.** Unsuffixed
`feed_fetch:sportstech` across the same seven days, **kept in two regimes and never averaged across
them** (binding clause registered in [METRICS.md](METRICS.md) on 2026-08-25, before these numbers
existed):

- **Pre-autodiscovery, 2026-08-20 … 08-24: `1, 0, 0, 0, 0`.** The single fetch on 08-20 carried
  **`?src=qa`** — `arrival_fetch:qa` reads `1` that day and `feed_fetch` site-wide reads `1`, so it is
  the same event: this loop's own published control tag, not a third party. **Read as third-party
  arrivals the pre-deploy floor is therefore `0, 0, 0, 0, 0`.** One imprecision in the 2026-08-25
  binding clause is corrected rather than repeated: it called these *"five complete pre-deploy days"*,
  but autodiscovery went live at ~`2026-08-24T22:26Z`–`22:39Z`, so 08-24's last ~95 minutes are
  post-deploy. The value is `0` either way and no reading turns on it.
- **Post-autodiscovery, reported separately and labelled: 08-25 = `16`, 08-26 = `0`.**

**What the 16 is, and what it is not.** Of the 16, **one** carried the venue tag
(`arrival_fetch:awesome-rss-feeds` = 1 on 08-25) and is **pre-`t0`, issue-#1-attributable** under the
2026-08-25 binding clause — the tag's full URL was printed in a public comment on issue #1 at
`2026-08-25T03:33:11Z`, before any submission existed. It is **excluded** from anything Reading 2 will
grade. The other **15 carried no allowlisted tag at all**. On the same day every other feed also took
unsuffixed fetches — `ava` 2, `graphics` 2, `wearables` 2, `wellbeing` 1, summing with sportstech's 16
to `feed_fetch` 23 — and on 08-26 **every** handle read zero. Site-wide arrival on one day and none
the next is the shape of a sweep, not of a subscription; but **two days is not a test of a discovery
path**, no crawler owes a page a second visit, and this claims nothing about whether autodiscovery
"worked". **No subscriber count is derived from any of it, and none can be**: these are polls, there
is no visitor identifier, and the site-wide 08-25 total of 23 is not 23 people.

### Decision

**Reading 1 is closed and Reading 2's fallback is now defined — that is this reading's whole value.**

1. **The instrument is sound.** `feed_fetch_bot:<handle>` writes in production. A5 for
   `awesome-rss-feeds` is satisfied on the mechanical half: a submission that sent traffic would now
   be visible, which is precisely what was **unsatisfiable** when this experiment was registered.
2. **Fork E is no longer weaker than nothing.** Fork E — the listing merges but the maintainer
   normalises `?src=` off the URL — falls back to reading `feed_fetch:sportstech` *"against its
   Reading-1 band"*. That band did not exist until now. It does: **zero third-party arrivals on every
   pre-deploy day**, against which a post-merge non-zero series would be legible. This is the
   concrete thing the loop gained today.
3. **Nothing about demand is decided, and nothing about the venue is decided.** Fork D — never
   authorized, never made, never merged — remains the standing state of Reading 2.
4. **No third reading is invented.** Two were registered; two remain.

**Unchanged from before either reading:** A5's verdict for `awesome-rss-feeds` was wrong in the
register, not merely incomplete. It read *"no tag allowlisted, no threshold registered"*, which
describes paperwork. The truth was that the destination was uninstrumented and the paperwork could
not have fixed it.

**Scope of this edit.** Only *Result* and *Decision* are written. The question, hypothesis, baseline,
change, both readings, every fork, and the stop conditions are **byte-untouched** — as is
[EXP-010](#exp-010--what-does-a-published-but-never-submitted-tagged-url-earn-on-its-own-2026-08-20-run-58),
whose `control_days` reading is due 2026-09-04 and is unaffected by anything above.

### Correction to this entry, made before it read anything (2026-08-19, run 56)

As first written, this entry claimed that unsuffixed `feed_fetch` *"carries this loop's own scheduled
QA fetches, so it is a liveness signal, not a demand signal"*, and Fork I-A/I-B were graded on
`feed_fetch:sportstech` with the suffix left unstated.

**That was wrong.** [`qa/playwright.config.mjs`](../qa/playwright.config.mjs) sets
`userAgent: "…HeadlessChrome/140.0.0.0 Safari/537.36 tuned-qa-exp003"` on `use` and on both projects,
and `isBot()` matches `/headless/i`. Every fetch this loop makes therefore lands in
**`feed_fetch_bot`**. The production check that shipped with this experiment
([32242080703](https://github.com/in-c0/tuned/actions/runs/32242080703)) says so in its own footprint
line — *"the expected writes are feed_fetch_bot +2, feed_fetch_bot:sportstech +2,
arrival_fetch_bot:qa +1"* — which is how the error was caught.

**The consequence for the forks was real, not cosmetic.** Fork I-B's whole argument is *"our own QA
fetches this URL on a schedule, so silence means the counter is broken."* That argument holds for
`feed_fetch_bot:sportstech` and **does not hold** for the unsuffixed name, which can be legitimately
zero for seven days simply because no third-party fetcher arrived. Graded as originally written, a
perfectly healthy instrument could have been declared defective — or, worse, this loop's own traffic
could have been mistaken for a background rate.

**Corrected as above:** liveness is graded on `feed_fetch_bot:sportstech`; the unsuffixed name is
read as the background rate of third-party fetchers and may legitimately be zero. The instrument is
**cleaner** than first described, not dirtier — nothing this loop does contaminates the unsuffixed
name.

**This is [L-35](LESSONS.md) applied to the run that wrote L-35.** The lesson says: *before depending
on an instrument, open the handler for the exact path you are depending on it for — do not remember
it.* The claim about which bucket QA traffic lands in was asserted from memory about a config file
that was one `grep` from being read. The correction is recorded here rather than quietly edited in,
because **a pre-registration that can be revised silently is not a pre-registration** — and the only
reason this revision is legitimate is that **no counter has produced a single value yet**. After
2026-08-26 this entry is frozen.

### Dated note — 2026-08-19 (run 57), before Reading 1 and before any submission exists

**A tag is only private until this loop publishes it, and on day one of these counters it published
one.** The scheduled snapshot for UTC day 2026-08-19 (`generated_at` 2026-08-19T20:57:30.181Z) reads
`feed_fetch 16 · feed_fetch:sportstech 16 · arrival_fetch:qa 16` against `feed_fetch_bot 10 ·
arrival_fetch_bot:qa 2`. The `_bot` half is fully accounted for by this loop's two `qa-browser`
dispatches and the `verify production` / `metrics snapshot` curls of `/ava/rss.xml`. **The sixteen
unsuffixed fetches are not accounted for, and every one of them carried `?src=qa`** — a tag no third
party could invent, printed verbatim in run 56's **public** execution report nine minutes after the
counters went live.

**What this does and does not do to this pre-registration.**

- **It does not corrupt EXP-009.** This experiment grades `arrival_fetch:awesome-rss-feeds`, not
  `arrival_fetch:qa`, and that counter is still at **zero** as the entry requires. No fork is
  re-worded, no band is moved, and no reading has been taken.
- **It does falsify one sentence in the deployed comment and in this entry's framing**, which is
  recorded rather than edited away: unsuffixed `feed_fetch` was described as *"a genuine background
  rate of third-party fetchers."* On the only day of data that exists, that name is **16, entirely
  tag-carrying, and unattributed**. It may be a third party; it may be something of this loop's that
  has not been identified. **Fork I-B's liveness argument is unaffected** — it rests on
  `feed_fetch_bot:sportstech`, which behaved exactly as registered.
- **It adds one binding clause, and it is a clause about writing, not about counting:** from this run
  the full tagged URL `/<handle>/rss.xml?src=awesome-rss-feeds` is **never printed** — not in an
  execution report, an ops file, a code comment, a workflow input, or a CI log. Route and tag are
  named separately. If that URL is ever found published anywhere by this loop before the submission
  exists, **Reading 1 grades Fork E, not Fork C** — a real attempt this instrument can no longer
  read — because a zero could no longer be distinguished from a tag that leaked and was polled.

**Why this is legitimate to add now rather than a post-hoc edit:** `arrival_fetch:awesome-rss-feeds`
has produced no value, no submission has been authorized or made, and the clause added *narrows* what
may be claimed rather than widening it. The 2026-08-26 freeze is unchanged and this is the last
revision permitted before it.

### Cross-reference — 2026-08-20 (run 58). No fork, band, window or clause above is altered.

Run 57 closed the note above with *"this is the last revision permitted before it [the 2026-08-26
freeze]"*, and that clause is honoured here: **nothing in EXP-009 is edited.** The day-2 reading of
the `qa` series contradicts the *inference* run 57 drew from day 1, and the correct place for that is
a new pre-registration with its own window, not an amendment to a frozen one. See
[EXP-010](#exp-010--what-does-a-published-but-never-submitted-tagged-url-earn-on-its-own-2026-08-20-run-58).

One consequence is worth stating here even though it changes nothing above: **Reading 2's Fork A
should not be graded until EXP-010 has reported.** Fork A infers a durable subscriber from tagged
fetches on ≥ 7 of 14 days; EXP-010 measures what that day-count reaches with no channel at all. If
the null is loud, Fork A's bar is not a bar. Reading 1 is unaffected — it grades `feed_fetch_bot`
liveness and needs no null — and its 2026-08-26 date is unchanged.

### EXP-009 — the feed's self link and the `?src=` tag: registered 2026-09-13 (run 157), BEFORE any submission exists

**This is a change to the instrument's surface, written down before the channel is spent.** A5's
rule is *before the post, never after*; no submission to `plenaryapp/awesome-rss-feeds` has been
made, so this is before, and it is recorded here rather than only in the commit.

**What changed.** `/<handle>/rss.xml` now carries `<atom:link rel="self">`, naming
`https://justtuned.com/<handle>/rss.xml` — the canonical URL, built on `SITE_ORIGIN` and **carrying
no query**. See [DECISIONS.md](DECISIONS.md) for why the alternatives are worse: a request-derived
self link makes the canonical whatever host asked, and a tag-bearing one asserts a campaign URL as
the feed's identity and hands that label to everything that copies the document.

**The interaction with this experiment, stated plainly.** `arrival_fetch:awesome-rss-feeds` is
written only by a fetch whose URL carries `?src=awesome-rss-feeds`. A client that re-pointed itself
at the self href would stop sending the tag, and its later polls would land in
`feed_fetch:sportstech` instead.

**How that is graded, decided now rather than when a number is inconvenient.** It is **Fork E** —
*the attempt is real but ungradeable by this instrument* — and **never Fork C**, the true null.
Reporting a real subscriber as "nobody reached the feed through this venue" is the specific error
that would make this whole register worthless, and it is the error a silent instrument change
invites. Fork E already carries the right response: `feed_fetch:sportstech` against its Reading-1
band is the remaining evidence and it is weaker.

**The risk is judged small and the judgement is recorded so it can be wrong in public.** Feed
readers overwhelmingly keep polling the URL a person gave them; `rel="self"` is used by validators,
by aggregators for de-duplication, and by hub-based push (which needs `rel="hub"` alongside it, and
this feed declares none). No reader is *known* to rewrite a subscription from it. If Reading 2 ever
lands on Fork B with `feed_fetch:sportstech` visibly above its band on the same days, this paragraph
is the first thing to re-read.

**Pinned in code, not in prose.** `test/discovery.test.ts` asserts the self href is the untagged
canonical **even when the request carries `?src=awesome-rss-feeds`**, so the decision cannot drift
without a red build, and `verify production` asserts the same string against the served document.

**Unchanged:** Reading 1 and Reading 2, their windows, thresholds, counters and all five forks. No
number in this experiment moved, and nothing here is a result.

## EXP-010 — what does a published-but-never-submitted tagged URL earn on its own? (2026-08-20, run 58)

**Pre-registered at 2026-08-20 ~04:30 UTC (14:30 Sydney): before the graded window opens, before any
submission to any venue has been authorized, and — the part that makes it a control rather than a
rationalisation — on a series this loop did not create for this purpose and cannot now adjust.**

### The question

[EXP-009](#exp-009--if-a-feed-listing-sent-subscribers-would-tuned-see-them-2026-08-19-run-56)
Reading 2 Fork A reads *"unsuffixed tagged fetches on ≥ 7 of the 14 days"* as **a durable subscriber
exists — the first evidence in Tuned's history that a stranger subscribed to a Tuned feed.** Its
stated logic is that *"a one-off crawl of a newly merged listing produces fetches on one or two days
and a subscribed client polls daily."*

That logic has a hidden premise: **that the only way a stranger's client comes to hold the tagged URL
is that the channel gave it to them.** The premise is false for this service, and not by accident.
`ARRIVAL_TAGS` is public source in a public repository ([`src/index.ts`](../src/index.ts)), the routes
it applies to are public, and **this loop has no store that is not world-readable** — not the repo,
not issue #1, not the CI logs. It therefore cannot hold a private campaign tag at all. Run 57's
[A6](DISTRIBUTION.md) mitigation — never print the *joined* URL, name route and tag separately — is
worth keeping, but it is a speed bump for a naive link-extractor, not a secret.

So a tagged counter answers *"how often was a tagged URL fetched"*, and the step from there to
*"the channel sent them"* needs a control: **what does a tagged URL earn when no channel exists?**

### Hypothesis

The `qa` tag is that control, and it is already running. It is published in exactly the same public
places, at the same transparency cadence, as any real channel tag — and it is **submitted to no venue,
ever.** Unsuffixed `arrival_fetch:qa` is therefore, by construction, the day-count a
published-but-never-submitted tagged Tuned URL attracts on its own: the null for Fork A, in Fork A's
own unit.

**Stated as a falsifiable expectation before the window opens:** the 2026-08-19 burst was a discovery
event that decays, so the control lands in **Fork N-3 or the low half of N-2** — fetches on 0–3 of
the 14 days. If it clears 7, Fork A is not a bar and this run's expectation was wrong.

### Baseline (source-linked) — observed, and deliberately *outside* the graded window

From [`ops/metrics/2026-08-19.json`](metrics/2026-08-19.json) and
[`ops/metrics/2026-08-20.json`](metrics/2026-08-20.json), `generated_at` 2026-08-20T04:06:30.501Z:

| UTC day | `feed_fetch` | `feed_fetch:sportstech` | `arrival_fetch:qa` | `feed_fetch_bot:sportstech` | `arrival_fetch_bot:qa` |
| --- | --- | --- | --- | --- | --- |
| 2026-08-19 (counters live from 10:19:44Z — **partial**) | 23 | 23 | **23** | 4 | 2 |
| 2026-08-20 (read at 04:06:30Z — **partial**) | 1 | 1 | **1** | 0 | 0 |

Three facts, and the third is the one that matters.

**One: on both days, every unsuffixed RSS fetch carried the tag.** 23 of 23, then 1 of 1. The
unsuffixed name has never once recorded an untagged third-party fetch. Whatever this population is,
it is not a background rate of feed readers finding Tuned on their own.

**Two: none of it is this loop's.** The `_bot` halves are fully accounted for — two `qa-browser`
dispatches × two fetches (one tagged each), plus the `/ava/rss.xml` curls from `verify production`
and `metrics snapshot`. Re-verified this run by opening the files rather than recalling them:
`vitest.config.mts` runs workerd against a simulated D1 with **no network**;
[`metrics-snapshot.yml`](../.github/workflows/metrics-snapshot.yml) and
[`verify-production.yml`](../.github/workflows/verify-production.yml) are the only scheduled fetchers
of any `rss.xml` and both probe **`/ava/rss.xml` untagged**; the Worker's cron is a Spotify sync that
makes no request to its own routes.

**Three: run 57's inference is contradicted by day 2, before it could ever be relied on.** Run 57 read
the day's partial value of 16 and described it as *"roughly one every forty minutes, which is the
shape of a feed client or an indexer."* The day in fact closed at **23** over the 13.7 hours the
counters were live — one per ~35.7 minutes, consistent with that reading. The next 4.1 hours then
produced **1**, where the same rate predicts ~6.9. That is not noise: for a Poisson process at that
rate, P(X ≤ 1) ≈ 0.008. **The shape is a burst that decayed, which is a crawl or a short-lived agent
run — not a subscription.**

That distinction is *precisely* the one Fork A exists to make, and this loop got it wrong on its own
data in under a day. It is the strongest available argument that Fork A needs a measured null rather
than an argued one.

**And the arithmetic above is a reason to run the experiment, not a substitute for it.** The Poisson
figure assumes a homogeneous process, and it is compared across two *different parts of the day*
(13.7 h ending at midnight UTC, against the first 4.1 h after it) — a comparison a diurnal pattern
alone could produce. **Two partial days cannot settle this**, which is exactly why the graded window
below is fourteen complete ones and why nothing is being concluded today. What the day-2 reading
establishes is narrower and sufficient: run 57's cadence claim is **not supported**, and a series
whose shape is unknown cannot be the basis for reading a fork that turns on shape.

### Change (commit/deploy)

**No counter, name, allowlist entry or behaviour changes.** The control already writes; creating it
now would make it a treatment. What ships is a correction and a pin:

- [`src/index.ts`](../src/index.ts) — the deployed comment's claims that unsuffixed `feed_fetch` is
  *"a genuine background rate of third-party fetchers"* and that `arrival_fetch:<tag>` grades an
  attempt *"because only a link this loop published carries the tag"* are **withdrawn on the data
  above**, and `qa`'s role as the control is written next to the allowlist that keeps it alive.
- [`src/metrics.ts`](../src/metrics.ts) — the same withdrawal in the **published** `/api/metrics`
  note, which is the copy every snapshot in `ops/metrics/` carries and the only description of these
  numbers a reader outside this loop can see.
- [`test/arrival.test.ts`](../test/arrival.test.ts) — one test pinning `qa` in `ARRIVAL_TAGS`, because
  it is the most deletable-looking entry there and removing it would take the null to zero silently,
  which reads identically to a quiet internet.

**Exposure disclosure, since the control's validity depends on it:** that test adds one occurrence of
the joined `?src=qa` URL to a file that already contained one. No new file, no new venue, no new
publication surface. Under the stop conditions below this is the last such addition permitted while
the window is open.

### Reading — one, on a fixed date, in Fork A's own unit

Read on the complete UTC day **2026-09-04**, from a `schedule` metrics snapshot, over the **14
complete UTC days 2026-08-21 … 2026-09-03**. The two partial days above are baseline context and are
**excluded from grading** — a window that included the discovery burst would grade the publication
event rather than the decay.

**Primary statistic:** `control_days` = the number of days in the window on which unsuffixed
`arrival_fetch:qa` ≥ 1. Day-count, not volume, because that is the unit Fork A is written in. Total
volume is reported alongside it and never substituted for it.

- **Fork N-1 — the null is loud.** `control_days` ≥ 7. *Reading:* a tagged URL with **no channel
  behind it** clears Fork A's bar unaided. Fork A cannot distinguish a subscriber from a publication
  and is **void as written**; it must be re-derived from this band before any submission is
  authorized, and A5 in the register reverts to ❌ for every tagged candidate until it is.
- **Fork N-2 — the null is quiet but real.** `control_days` is 1–6. *Reading:* Fork A's 7/14 bar
  survives, and `control_days` is the floor a treatment must **exceed**, not merely reach. *Next
  action:* record the exact band in [DISTRIBUTION.md](DISTRIBUTION.md); a treatment landing inside it
  grades **Fork B**, not Fork A.
- **Fork N-3 — the null is silent.** `control_days` = 0 across all 14 days. *Reading:* the 2026-08-19
  burst was a one-off discovery that decayed to nothing; a published tagged URL attracts nothing
  durable unaided; Fork A's threshold is validated **by measurement** instead of by argument. *Next
  action:* Fork A stands exactly as written.
- **Fork N-4 — inadmissible, not null.** Any of: `qa` is submitted to a venue; `qa` is removed from
  `ARRIVAL_TAGS`; this loop fetches the tagged URL with a user agent `isBot()` does not match; the
  joined `?src=qa` URL is published somewhere new during the window; or a snapshot day is missing so
  `control_days` cannot be counted. *Reading:* **no null is established.** EXP-009 Fork A stays
  unvalidated and must not be graded as though it were, and this experiment is re-run on a clean
  window rather than salvaged.

### Stop conditions, stated in advance

- **This authorizes no submission of anything, anywhere.** It is a measurement of a series that
  already exists. The standing owner decision on third-party submissions is untouched.
- **`qa` is never submitted to a venue.** The moment it is, it stops being a control and this entry
  grades Fork N-4.
- **The control's exposure is neither increased nor decreased during the window.** Existing
  publications of the joined URL stay where they are — removing them would be tuning the null. No new
  ones are created.
- **One reading, on 2026-09-04.** Reading it early is choosing the day; adding a second is choosing
  the answer. If the series is obviously loud on 2026-08-25 that is not a result, and it does not
  license acting before the date.
- **Nothing here may be reported as traffic, demand, subscribers or interest.** The whole point of a
  control is that it counts things that are *not* demand. Any run reporting `arrival_fetch:qa` as
  users is inventing a metric.

### Admissibility note (2026-09-03, run 134 — the window, the statistic and the four forks above are unchanged)

**The reading had no admissible source on the date it was pre-registered for, and the cause was the
snapshot cadence, not the data.** `metrics-snapshot.yml` ran once a day on `40 20 * * *`, so the day a
snapshot is named after is always partial — captured hours before that UTC day ends. The last day of
this window, **2026-09-03**, would first have appeared *complete* in the snapshot taken at ~20:40 UTC
on 2026-09-04, which is **after all three of that date's executor runs** (22:00 UTC 09-03, 04:00 and
10:00 UTC 09-04). Grading on 2026-09-04 would therefore have had to read 2026-09-03 from a snapshot
that stopped ~2 hours short of midnight: a `qa` count of 0 on that day could not be distinguished from
an uncounted one, which is **Fork N-4 — inadmissible**, and fourteen days of control would have been
spent for nothing.

**Fixed by adding a second, inert snapshot run** at `15 0 * * *` — see the header of
[`metrics-snapshot.yml`](../.github/workflows/metrics-snapshot.yml). `daily` in the payload is 60 days
of history, so any snapshot generated at or after `2026-09-04T00:00:00Z` carries 2026-09-03 complete.

**Why this is not tuning the null.** Its first firing is 2026-09-04 00:15 UTC — *after* the window
closes at 2026-09-03 24:00 UTC — so it adds nothing inside the graded window at all. Independently of
that, it cannot move the series in any window: the probe step is skipped on this schedule, and
`/api/version` and `/api/metrics` write no counters, so the run makes no counter write of any kind. It
touches no tag, no allowlist, no threshold, no exposure and no route.

**Precondition for grading, in place of "read from a `schedule` snapshot":** the grading run must read
a snapshot whose `generated_at` is **≥ `2026-09-04T00:00:00Z`**. If none exists yet — a scheduled run
on this repository has landed as much as 2h14m late — dispatch `metrics-snapshot.yml` once and wait
for it. Grading a 2026-09-03 row from an earlier snapshot is Fork N-4; so is imputing it.

### Result — read 2026-09-04 (run 136). **Fork N-2, at its floor.**

**`control_days` = 1 of 14. Total volume = 2 fetches.** Both on 2026-09-02; the other thirteen days
are zero.

**Source.** [`ops/metrics/2026-09-04.json`](metrics/2026-09-04.json) / `latest.json`, `generated_at`
**2026-09-04T04:04:54.310Z** — after the window closed, so every one of the fourteen days is complete.
The 00:15 UTC schedule added by run 134 had not fired by 04:04Z (last scheduled snapshot:
2026-09-03T22:47:04Z), so the admissibility note's fallback was used: **one** `workflow_dispatch` of
`metrics-snapshot.yml`, [run 33835474660](https://github.com/in-c0/tuned/actions/runs/33835474660),
success. That dispatch fetches `/ava/rss.xml` **untagged** and on 2026-09-04, outside the window; it
cannot write `arrival_fetch:qa` at all.

| UTC day | `arrival_fetch:qa` | `arrival_fetch_bot:qa` | `feed_fetch` | `feed_fetch:sportstech` |
| --- | --- | --- | --- | --- |
| 2026-08-21 | 0 | 0 | 0 | 0 |
| 2026-08-22 | 0 | 0 | 0 | 0 |
| 2026-08-23 | 0 | 0 | 0 | 0 |
| 2026-08-24 | 0 | 0 | 0 | 0 |
| 2026-08-25 | 0 | 0 | 23 | 16 |
| 2026-08-26 | 0 | 0 | 0 | 0 |
| 2026-08-27 | 0 | 0 | 2 | 2 |
| 2026-08-28 | 0 | 0 | 13 | 13 |
| 2026-08-29 | 0 | 0 | 2 | 2 |
| 2026-08-30 | 0 | 0 | 0 | 0 |
| 2026-08-31 | 0 | 0 | 0 | 0 |
| 2026-09-01 | 0 | 0 | 5 | 1 |
| 2026-09-02 | **2** | 0 | 2 | 2 |
| 2026-09-03 | 0 | 0 | 0 | 0 |
| **window** | **2 · 1 day** | 0 | 47 · 6 days | 36 · 6 days |

**Fork N-4 was checked clause by clause before grading, and none of the five fires.**

1. **`qa` submitted to a venue** — no. No submission of anything to any venue has occurred; runs
   128–135 each recorded no venue action, and the standing owner boundary is unchanged.
2. **`qa` removed from `ARRIVAL_TAGS`** — no. [`src/index.ts:785`](../src/index.ts#L785) still reads
   `new Set(["qa", "awesome-rss-feeds"])`, and `test/arrival.test.ts` still pins it.
3. **This loop fetched the tagged URL with a UA `isBot()` does not match** — no, and this was checked
   against the one day that could have been contaminated. On 2026-09-02 this loop's only production
   fetchers were `verify production` (22:38:52Z) and `metrics snapshot` (22:48:28Z); both probe
   **`/ava/rss.xml` untagged**, so neither can write any `arrival_fetch:<tag>` name. The three
   executor runs that day (129, 130, 131) were idle by directive — no dispatch, no probe.
   `arrival_fetch_bot:qa` is **0** across all fourteen days, so there was no bot-UA tagged fetch
   either. The vitest suite runs workerd against a simulated D1 with no network.
4. **The joined `?src=qa` URL published somewhere new during the window** — no, and this is the clause
   that needed measuring rather than asserting. Counting the *joined* URL (a route immediately
   followed by `?src=qa`) at the window-open commit `fff7ee5` against the window-close commit
   `2c40d2b`: **10 → 10**, in the same six files, none gained and none lost.
   **Disclosed, because it is the looser reading of the same clause:** bare occurrences of the
   *string* `src=qa` in prose rose **19 → 31** across seven ops files, and `ops/DASHBOARD.md` gained
   its first. That is this loop writing about its own control in its own public record. It is not a
   new publication of the URL, and it is recorded here rather than left for a later run to find,
   because the direction of the bias matters: looser exposure can only push the null **up**. A
   result of 1 day out of 14 is therefore an **upper bound** on the unaided null, not an
   underestimate.
5. **A snapshot day missing** — no. All fourteen days carry rows in `daily`.

**The pre-registered expectation was correct.** The entry committed itself in advance to *"Fork N-3 or
the low half of N-2 — fetches on 0–3 of the 14 days"*, on the argument that the 2026-08-19 burst was a
discovery event that decays. It decayed to **1 day and 2 fetches**. This is recorded because the
opposite outcome would have been recorded: the loop had already been wrong once on this series (run
57's cadence claim, falsified inside a day), and a pre-registration only earns anything if its hits
are reported in the same voice as its misses.

**One claim in this entry's own baseline is falsified by the window it graded, and is withdrawn here
rather than edited above.** The baseline said *"the unsuffixed name has never once recorded an
untagged third-party fetch"* and drew from it that *"whatever this population is, it is not a
background rate of feed readers finding Tuned on their own."* Over the fourteen graded days,
unsuffixed `feed_fetch` totals **47** across six days, of which **2** carried `qa` and **1** carried
`awesome-rss-feeds` — so **44 untagged non-bot-UA feed fetches** occurred. A background rate of
untagged fetchers demonstrably exists now; it did not on the two partial days the baseline was drawn
from. This strengthens the control rather than weakening it: the tagged share of unsuffixed feed
traffic is **3 of 47**, and the tagged day-count is 1 of the 6 days that saw any unsuffixed fetch at
all.

**Reported and not claimed as anything else:** `arrival_fetch:awesome-rss-feeds` read **1**, on
2026-08-25, its only non-zero day ever. That is the real channel tag, it belongs to EXP-009 and not to
this entry, and [METRICS.md](METRICS.md) already registered — before the number existed — that any
value after `t0` = 2026-08-25T03:33:11Z is **issue-#1-attributable, not venue traffic**, because the
reviewer directive printed the joined tagged URL publicly at that timestamp. It is one fetch on the
day of that publication. It is not demand, not a subscriber, and not evidence about any venue.

### Decision — Fork N-2's registered next action, taken

**The null is quiet but real, and it is quiet at the very bottom of the band.**

1. **EXP-009 Fork A's 7-of-14 bar survives, validated by measurement rather than by argument.** A
   published-but-never-submitted tagged Tuned URL earned **1 day of 14** unaided. Fork A's threshold
   of ≥ 7 sits six days clear of the measured null. The premise EXP-010 was registered to test — that
   a tagged counter cannot distinguish a subscriber from a publication — is **not** load-bearing at
   Fork A's threshold on this evidence.
2. **`control_days = 1` is a floor a treatment must exceed, not reach.** Per Fork N-2's own text, a
   treatment landing **inside** the 0–1 band grades **Fork B**, not Fork A. Recorded in
   [DISTRIBUTION.md](DISTRIBUTION.md).
3. **A5's conditional resolves to satisfied.** DISTRIBUTION recorded that *"if EXP-010 lands on Fork
   N-1 (a loud null), A5 reverts to ❌ for every tagged candidate."* It did not land on N-1. A5 stands
   for tagged candidates, with the band attached. **No candidate's verdict changes today**, because
   none was admissible on A2 anyway — this removes a hypothetical blocker, it does not authorize a
   submission.
4. **What this does not decide.** Nothing here is traffic, demand, subscribers or interest — a control
   counts things that are *not* demand, and 2 fetches over 14 days is the strongest possible statement
   that there is nothing here to mistake for a user. `applications` **0**, `members` **1**,
   `members_ever_active` **0**, `followers` **0**, gross cash **$0**.

**This experiment is closed.** No re-run, no second reading, no extension.

---

## EXP-011 — is `landing_view` a browser at all? (2026-09-05, run 138)

**Pre-registered at 2026-09-04 ~22:20 UTC (2026-09-05 08:20 Sydney): before the counter it reads
exists, before any value of it can be known, and before the deploy that introduces it.** The ordering
is [A5](DISTRIBUTION.md)'s and it is not a formality here — page counters start at zero on the deploy
that introduces them, nothing is backfilled, and a threshold chosen after the first day's reading is
not a threshold.

### The question

[EXP-007](#exp-007--is-there-a-human-on-the-other-side-of-the-landing-page-2026-08-15-run-43) named
three explanations for the same zero and shipped two counters to separate them:

1. the traffic is not human — the user-agent heuristic over-counts, and nobody real is arriving;
2. real people arrive, read the page, and the offer does not move them;
3. people want in and the form loses them before it is submitted.

Nineteen complete days later, **explanation 3 is excluded and 1 and 2 are not.** `application_start`
has never been written in its unsuffixed form on any day, so nobody reaches the form and no form
defect can be the cause. But `landing_engage` fires on the first `pointerdown`, `keydown` or
`scroll` — **it requires the visitor to do something** — and explanations 1 and 2 predict the same
near-zero reading against it. A path scanner carrying a Chrome user-agent never scrolls. Neither does
a real person who reads a short page and leaves.

**So the register's standing conclusion — *"the landing page is not the bottleneck, distribution is"*
([NORTH_STAR](NORTH_STAR.md), from EXP-007 Fork A on one day) — rests on a counter that cannot
distinguish the world in which it is true from the world in which it is false.** It has directed
nineteen days of work.

### Hypothesis

The rung missing between "something requested this URL" and "somebody did something on this page" is
**whether a browser engine ever parsed the page and ran its script.** Almost everything that inflates
`landing_view` — port and path scanners, uptime probes, link-preview fetchers, header-spoofing
crawlers — takes the HTML and executes none of it. A beacon fired unconditionally at script execution
therefore separates the two populations that `landing_engage` folds together, and the pair
(`landing_view`, `landing_render`) is a ratio whose denominator means something.

**What it cannot do, registered here so no later run claims it:** `landing_render` is **not a count of
people.** A JS-executing crawler that declares itself lands in `landing_render_bot`; one that does not
declare itself lands unsuffixed and is indistinguishable from a visitor. It is strictly more
discriminating than a user-agent string and strictly weaker than proof of a human, and it is forgeable
on the same single header as the other two page-reported counters.

### Baseline (source-linked, frozen before deploy)

From the committed scheduled snapshots in [`ops/metrics/`](metrics/), complete UTC days only.

**Window 2026-08-07 … 2026-09-03 (28 complete days), both `landing_*` view counters live throughout:**

| Counter | Total | Non-zero days |
| --- | --- | --- |
| `landing_view` | **1763** | 28 of 28 |
| `landing_view_bot` | 792 | 28 of 28 |

**Window 2026-08-16 … 2026-09-03 (19 complete days), the days on which every counter below existed —
`landing_engage` and `application_start` shipped 2026-08-15 (run 43), so their earlier zeros mean
*the counter did not exist* and are excluded:**

| Counter | Total | Non-zero days |
| --- | --- | --- |
| `landing_view` | **1131** | 19 of 19 |
| `landing_engage` | **7** | 5 of 19 |
| `landing_engage_bot` | 4 | 2 of 19 |
| `application_start` (unsuffixed) | **0** | 0 of 19 |
| `application_submit` | **0** | 0 of 19 |
| `application_invalid` | **0** | 0 of 19 |

`landing_render` **does not exist and reads nothing on every UTC day up to and including
2026-09-04.** That is a statement about the code, not about traffic: the page fired no such beacon.
There is no historical render series, not a low one and not a zero one, and no claim about how many
browsers have rendered this page before the deploy is available or may be made.

Funnel context, unchanged: `applications` **0** · `members` **1** · `members_ever_active` **0** ·
`followers` **0** · `items_public` **83** · gross cash **AUD $0**, from *no billing exists*.

### Change (commit/deploy)

One name added to the existing `PULSE_COUNTERS` allowlist and one call added to the landing page's
existing script block. No schema change, no new table, no cookie, no identifier, no per-visitor state,
no new data category — **so the privacy policy is deliberately not amended**, on the same reasoning
run 43 recorded for the two counters this joins.

- `landing_render` / `landing_render_bot` — one write per landing-page load whose script executed,
  same-origin only, split by the same user-agent heuristic as every other counter here.

Fired as a **top-level statement**, gated by nothing and attached to no listener. That is the whole
design: bind it to an interaction and it becomes a second `landing_engage`, which is the defect it
exists to fix. [`test/pulse.test.ts`](../test/pulse.test.ts) pins both properties — exactly one call
site, and no `addEventListener` around it — so the failure cannot be reintroduced silently.

### Reading — one, on the complete UTC day 2026-09-18

Window: **14 complete UTC days, 2026-09-05 … 2026-09-18**, read from a `schedule` metrics snapshot
generated after the window closes. Primary quantity, both names unsuffixed:

**R = Σ `landing_render` ÷ Σ `landing_view`** over the window.

`landing_render_bot` and `landing_view_bot` are reported alongside and **never summed into R**.

The cut points are set here, before any value exists, from what each explanation predicts. A world in
which `landing_view` is dominated by non-executing automation puts R in low single-digit percent,
because the rendering browsers are the few real arrivals inside a large noise total. A world in which
`landing_view` is mostly real browsers puts R near its ceiling. Both cut points are placed well clear
of the middle so that a reading near either is not a coin toss.

- **Fork R-A — mostly not a browser. R < 10%.** *Reading:* `landing_view` is dominated by clients
  that never execute the page, and explanation 1 is the live one. The register's standing claim is
  **upheld and upgraded** from an inference on one day's interaction counter to a measured property
  of fourteen. *Next action:* `landing_view` stops being quoted as an audience number anywhere in this
  repository; `landing_render` becomes the denominator of every landing-page reading; and the
  remaining runs go to getting real arrivals rather than to the page.
- **Fork R-B — a browser audience exists and does not act. R ≥ 40%.** *Reading:* hundreds of
  rendering browsers a week reach this page and essentially none of them scroll, click or type. That
  **contradicts** the standing claim: the page or the offer is a bottleneck, and it is the largest one
  measurable from Tuned's own surface without anyone's permission. *Next action:* one landing-page or
  offer experiment, graded on `landing_engage ÷ landing_render` — the first honest conversion rate
  this loop has been able to compute — and the standing claim is struck rather than deleted.
- **Fork R-C — mixed. 10% ≤ R < 40%.** *Reading:* both populations are present and neither dominates.
  The ratio is the denominator either way and that is the durable gain. *Next action:* recompute and
  record the engage rate against `landing_render`; **do not** conclude which bottleneck dominates from
  this reading, and **do not** invent a fourth quantitative fork to break the tie after seeing it.
- **Fork R-D — the instrument did not ship. `landing_render` and `landing_render_bot` both zero on
  all 14 days while `landing_view` is non-zero.** *Reading:* the beacon is not landing in production.
  Nothing above is graded and R is undefined. *Next action:* fix it before any further landing-page
  claim, and treat every statement made from R as withdrawn. This is the fork this loop has hit four
  times in other shapes ([L-35](LESSONS.md), [L-44](LESSONS.md), [L-46](LESSONS.md),
  [L-51](LESSONS.md)) and it is registered as an expected outcome, not an accident.
- **Fork R-E — inadmissible on contamination.** Any first-party client renders the landing page inside
  the window under a user-agent that does **not** match `BOT_UA` in [`src/metrics.ts`](../src/metrics.ts).
  *Reading:* the unsuffixed name carries this loop looking at itself and R is not a measurement of
  third parties. **Fork R-E must not be reported as R-B.** Playwright's default headless user-agent
  contains `headless` and therefore lands in `landing_render_bot`, which is why browser QA is
  permitted inside the window — but overriding that user-agent, on any spec, fires this fork.
  *Next action:* registered 2026-09-14 (run 159), and see the run-159 addendum below for why this one
  fork could still be registered blind while R-A/R-B/R-C could not. **R is not computed, quoted or
  recorded** — not even as "contaminated, but roughly N%", because a number published with a caveat
  is a number that gets quoted without one. Identify the contaminating client and restore its
  declaring user-agent before anything else. Then **re-run on a clean 14-day window only if the
  landing page is still frozen for all of it**; if it is not, EXP-011 is **abandoned rather than
  salvaged**, on the same reasoning [EXP-010](#exp-010--what-does-a-published-but-never-submitted-tagged-url-earn-on-its-own-2026-08-20-run-58)
  Fork N-4 already registers. A contaminated window is not a shorter clean one.

### Stop conditions, stated in advance

- **The landing page's copy, layout, offer and form must not change inside the window.** R is a
  property of the traffic, not of the page, but the engage and start rates read against it are not —
  and a mid-window edit makes the fourteen days two incomparable halves. A change forced by a
  regression is permitted and **ends the window early**, graded on the complete days before it.
- **`landing_render` must not be added to any other page inside the window.** It is registered as a
  landing-page counter with `landing_view` as its denominator; firing it elsewhere silently changes
  what the numerator counts.
- **No second reading and no extension.** One reading, on one pre-named day. Reading again after an
  unwelcome number is choosing the day.
- **R is not a number of people, and no fork above licenses saying it is.** Every fork's reading is
  about *populations of clients*. `applications`, `members_ever_active` and gross cash are the numbers
  that would be about people, and they are 0, 0 and $0.
- **A high R is not demand.** Fork R-B says a bottleneck is visible and locally fixable; it says
  nothing about whether anyone wants Tuned, and it must not be reported as traction.

### Instrument validity — addendum, run 140 (2026-09-05 20:10 Sydney)

**Fork R-D is excluded at the emitter on day 1 of 14, and it was very nearly not discoverable until
day 14.**

This addendum changes **no threshold, no fork, no cut point, no window and no reading date.** It is a
check on the apparatus, in the same shape as EXP-007's brackets, and it is recorded here because R-D
is the one fork the experiment cannot recover from: counters do not backfill, so a beacon that never
lands costs the whole window.

**What was actually verified before this run.** Run 138's `verify production` step asserts that
`POST /api/pulse/landing_render` answers **403** to a caller sending no `Origin` — proving the name is
allowlisted — and that `GET /` returns HTML **containing the string** `pulse("landing_render")`. Both
of those are equally true of a page whose script throws before reaching that line. Nothing anywhere
had observed a browser engine execute it.

**The check that could have has been broken since the counter shipped.**
[`qa/pulse-instrument.spec.mjs`](../qa/pulse-instrument.spec.mjs) asserted that **no** pulse fires on a
bare page load, and mirrored a two-name allowlist. An unconditional beacon contradicts both. It is a
`workflow_dispatch` suite, so it was never run and nothing went red. [L-56](LESSONS.md).

**The observation, from a real Chromium against live production**
([qa-browser 33959936807](https://github.com/in-c0/tuned/actions/runs/33959936807), spec
`pulse-instrument.spec.mjs`, `10:11:07Z → 10:11:13Z`, production serving `1800bc8` per
`/api/version`):

| Assertion | Result |
| --- | --- |
| `landing_render` emitted on a **bare page load**, no interaction | **yes** |
| Production's response to it | **204** |
| `Origin` the browser attached | `https://justtuned.com` — the page's own, which is what the route requires |
| One-shot across two `Tab`s, a 600px scroll and typing | **yes** — `landing_render_observed: 1` |
| Interaction-gated pulses before any interaction | **none** |
| `page_errors` | **`[]`** |
| `console_errors` | **`[]`** |
| Application form | typed into, **never submitted** |

**Contamination: none, by construction.** The Playwright user-agent declares `HeadlessChrome`, so
`src/metrics.ts` classifies every request this caused as bot traffic. The increments landed in
`landing_view_bot`, `landing_render_bot`, `landing_engage_bot` and `application_start_bot` on
2026-09-05, and **not one of them entered the unsuffixed names R is computed from.** This is the case
the stop conditions expressly permit inside the window; **Fork R-E fires the moment that user-agent
stops declaring `headless`, on any spec.**

**What this does and does not establish.** It establishes that the emitter works — that a rendering
browser reaching this page sends the beacon and production records it. It establishes **nothing about
R**, which is a property of the traffic and is not readable before 2026-09-18. A low R after this
check means *the arriving clients are not rendering browsers*; before this check it could also have
meant *the beacon is broken*, and those two are no longer confusable.

**The ordering hazard, disclosed rather than fixed.** `pulse("landing_render")` is a top-level
statement but it is **not the first one**: roughly fifteen lines of DOM decoration run before it in the
same inline script, and anything throwing there suppresses the beacon while `landing_view` still
increments — biasing R **down, toward Fork R-A, the claim the loop already holds.** `page_errors: []`
above is direct evidence the hazard is not firing on the build now serving. It was **deliberately not
hoisted**: this experiment's stop conditions freeze the page, and an emitter edit mid-window splits the
fourteen days into two incomparable halves. **Registered trigger, so no later run has to decide it
fresh:** if any bracket inside the window reports a page error preceding the render pulse, hoist it
immediately and grade EXP-011 on the complete days before the edit, under the regression clause above.

**Cadence, registered now rather than chosen later:** dispatch this spec **once more inside the
window** and **once after it closes on 2026-09-19, before the reading is recorded** — the far-side
bracket EXP-007 needed, for the same reason. A single pre-window check cannot see an emitter that
detached in between.

### Instrument validity — mid-window bracket, run 149 (2026-09-11 08:20 Sydney)

**The registered mid-window bracket, dispatched on its date. It is green, and the registered hoist
trigger did not fire.** This addendum changes **no threshold, no fork, no cut point, no window and no
reading date**, and takes **no reading of R** — day 7 of 14 is not the pre-named day, and reading
early is choosing the day.

Run 140 registered the cadence: dispatch this spec *"once more inside the window"* and *"once after
it closes on 2026-09-19, before the reading is recorded"*. Runs 141-147 fell before the trigger; run
148 deferred it to *the first run on or after 2026-09-11*, on a date rather than a preference. This
is that run.

**The observation, from a real Chromium against live production**
([qa-browser 34535674639](https://github.com/in-c0/tuned/actions/runs/34535674639), spec
`pulse-instrument.spec.mjs`, `22:06:10Z -> 22:06:16Z`, production serving `63e2fa9` per
`/api/version`):

| Assertion | Result |
| --- | --- |
| `landing_render` emitted on a **bare page load**, no interaction | **yes**, HTTP **204** |
| `landing_engage` on interaction, `application_start` on a keystroke | **yes**, **204** each |
| One-shot across the run | **yes** — `landing_render_observed: 1` |
| `page_errors` | **`[]`** |
| `console_errors` | **`[]`** |
| Application form | typed into, **never submitted** |

**The registered trigger did not fire, which is the point of the bracket.** Run 140 disclosed an
ordering hazard — roughly fifteen lines of DOM decoration run before `pulse("landing_render")` in the
same inline script, and anything throwing there suppresses the beacon while `landing_view` still
increments, biasing R **down toward Fork R-A, the claim the loop already holds**. The registered
response was: *if any bracket inside the window reports a page error preceding the render pulse,
hoist it immediately and grade EXP-011 on the complete days before the edit.* `page_errors: []`, so
**no hoist, no early grading, and the fourteen days remain one comparable window.**

**Contamination: none, by construction, unchanged from run 140.** The Playwright user-agent declares
`HeadlessChrome`, so `src/metrics.ts` classified every increment this caused as bot traffic — it
landed in `landing_view_bot`, `landing_render_bot`, `landing_engage_bot` and `application_start_bot`
on 2026-09-10, and **not one entered the unsuffixed names R is computed from.** Fork R-E remains
armed and unfired. The mobile projection is skipped by
`test.skip(testInfo.project.name !== "desktop-1440x900", "instrument check runs once")` —
deliberate, so the instrument fires exactly once, and identical to the day-1 bracket.

**Fork R-D is excluded mid-window as well as at day 1**, and by two independent means: this browser
observation, and the committed snapshots, in which `landing_render` has written a **non-zero
unsuffixed value on 2 of the 6 window days so far**. That second figure is a presence/absence check
on the instrument and **nothing else** — the sums are deliberately not quoted here, because quoting
both R's numerator and its denominator on day 7 is taking the reading early under another name.

**A dependency bump landed on production during the window, and it is admissible.** Run 149 shipped
`hono` 4.12.34 -> 4.13.7 ([`e9e2a00`](https://github.com/in-c0/tuned/commit/e9e2a00)). Checked clause
by clause against the stop conditions rather than asserted: **no `src/` file is touched**, so the
landing page's copy, layout, offer and form are unchanged; `landing_render` is not added to any other
page; no second reading is taken and the window is not extended. Neither of R's inputs passes through
the changed code — the fixed function is hono's query parser, and neither `landing_render` nor
`landing_view` reads a query parameter.

**The bracket was re-dispatched on the build the bump produced, and this is an addition to the
registered cadence rather than a substitution — recorded as such rather than folded into the number
above.** Leaving the window's only mid-window bracket describing a build that had stopped serving
would have been worse than one extra dispatch, and the extra dispatch costs only `_bot` increments,
which R does not read.
[qa-browser 34536404000](https://github.com/in-c0/tuned/actions/runs/34536404000),
`22:14:51Z -> 22:14:58Z`, production serving **`e9e2a00`** per `/api/version`: `landing_render`,
`landing_engage` and `application_start` all **204**, `landing_render_observed: 1`,
**`page_errors: []`**, `console_errors: []`, form typed into and never submitted. **Identical to the
pre-bump reading in every field — the bump did not disturb the emitter.** The far-side bracket
registered for 2026-09-19 stands unchanged.

### Instrument validity — far-side bracket, run 169 (2026-09-17 20:35 Sydney)

**The registered far-side bracket, dispatched after the window closed and before the reading. It is
green, and the registered hoist trigger did not fire.** This addendum changes **no threshold, no
fork, no cut point, no window and no reading date**, and takes **no reading of R.** The reading stays
**2026-09-19**.

Run 140 registered the cadence: *"once more inside the window"* (taken at run 149) and *"once after it
closes on 2026-09-19, before the reading is recorded"*. Run 166 shortened the window to
**2026-09-05 … 2026-09-15** under the regression clause, so the far side opened on **2026-09-17** —
the date run 168 recorded as the bracket becoming due. This is the first run on or after it.

**The observation, from a real Chromium against live production**
([qa-browser 35208853203](https://github.com/in-c0/tuned/actions/runs/35208853203), spec
`pulse-instrument.spec.mjs`, `10:08:21Z -> 10:08:28Z`, production serving **`a6a6476`** per
`/api/version` in the job's own log):

| Assertion | Result |
| --- | --- |
| `landing_render` emitted on a **bare page load**, no interaction | **yes**, HTTP **204** |
| `landing_engage` on interaction, `application_start` on a keystroke | **yes**, **204** each |
| One-shot across the run | **yes** — `landing_render_observed: 1` |
| `page_errors` | **`[]`** |
| `console_errors` | **one**, see below |
| Application form | typed into, **never submitted** |

**The registered trigger did not fire, and it is the `page_errors` field that carries it.** Run 140's
disclosed hazard is that ~15 lines of DOM decoration run before `pulse("landing_render")` in the same
inline script, and anything throwing there suppresses the beacon while `landing_view` still
increments — biasing R **down, toward Fork R-A, the claim the loop already holds.** The registered
response was *"if any bracket inside the window reports a page error preceding the render pulse, hoist
it immediately and grade EXP-011 on the complete days before the edit."* `page_errors: []` on the
near side, the middle and now the far side, so **no hoist, and the eleven days remain one comparable
window.**

**With all three brackets green, Fork R-D — the instrument is broken — is excluded across the whole
span rather than at its ends.** That is what this bracket buys and it is the whole of what it buys:
it establishes that a rendering browser reaching this page emits the beacon and production records
it. It establishes **nothing about R**, which is a property of the traffic.

**One field changed between the mid-window bracket and this one, and it is recorded here rather than
passed over.** Run 149 reported `console_errors: []`; this run reports exactly one —
`"Failed to load resource: the server responded with a status of 404 ()"`. So **a subresource of the
landing page began 404ing somewhere between 2026-09-11 and 2026-09-17.** Three things are true about
it at once and all three are stated rather than the convenient one:

- It is **not** the registered trigger. `page_errors` is script execution; this is a network fetch,
  and the pulses that followed it all returned 204, so the emitter demonstrably ran.
- It does **not** touch R's admissibility. Both of R's inputs are counted server-side on this same
  request, and a 404 subresource moves neither.
- **The artifact cannot say which resource it is**, because the spec records the console message and
  not the URL — which is [L-85](LESSONS.md#l-85) in this loop's own instrument, one run after L-85 was
  written. That is registered as a next candidate, not repaired inside a bracket dispatch.

**Contamination, declared as always:** the Playwright user-agent declares `HeadlessChrome`, so
`src/metrics.ts` classified every increment this caused as bot traffic — `landing_view_bot`,
`landing_render_bot`, `landing_engage_bot`, `application_start_bot` on **2026-09-17**, and none in the
unsuffixed names R is computed from. **2026-09-17 is outside the window in any case.** Fork R-E
remains armed and unfired.

### Downstream obligations — declined, and the disclosure that forces it, run 159 (2026-09-14 14:10 Sydney)

**This addendum changes no threshold, no cut point, no fork reading, no window and no reading date.**
R is still Σ `landing_render` ÷ Σ `landing_view` over the 14 complete UTC days 2026-09-05 … 2026-09-18,
read once, from a snapshot generated after the window closes. Nothing below grades anything.

**What run 158 asked for, and why it is not here.** Run 158's closing recommendation was to
pre-register, before the number exists, what each fork obliges the remaining days to do — so that
2026-09-19 is an action rather than a deliberation. **That is the right thing to want and it can no
longer be done honestly for R-A, R-B or R-C.**

**The disclosure, in full, because a number-shaped secret is worse than the number.** While inspecting
available analytics — step 2 of this loop's own operating cycle, forbidden by no rule here — run 159
computed the **partial** series over the **nine** complete days 2026-09-05 … 2026-09-13 from
[`ops/metrics/latest.json`](metrics/latest.json) (`2026-09-13T22:34:52.428Z`): Σ `landing_render` = **4**,
Σ `landing_view` = **543**.

**That figure is NOT R and must never be quoted as R.** It covers 9 of 14 days, not 14; R is read from
a post-window snapshot, and this one is not. It grades nothing, fires no fork, and moves no date. It
is recorded here because the alternative — saying "a number was seen, but not which" — invites
guessing and lets this run claim candour without accountability.

**The consequence, stated plainly against this run's own interest.** Nine days of a fourteen-day
series is enough to make the likely fork obvious. So any obligation written now for R-A, R-B or R-C
would be written by an author who effectively knows which one pays — and the failure mode of a
post-hoc obligation is that the fork you expect gets the comfortable duty and the forks you don't get
the heroic ones. **The blind text already in this file is therefore better than anything run 159 could
add to it**, and 2026-09-19 executes each fork's *Next action:* exactly as registered on 2026-09-04,
unelaborated and unamended. Declining to write is the honest move; writing with a caveat is not.

**Fork R-E is the exception and it is a real one, not a loophole.** R-E fires on a first-party client
rendering the page under a user-agent that does not match `BOT_UA` — a fact about this loop's own QA
configuration, entirely orthogonal to the partial series above, which tells nobody anything about
whether contamination occurred. It was registered blind this run, and is the only fork here that was.

**And the general rule this cost.** A pre-registration window is consumed by the first run that looks,
and looking was mandated rather than forbidden. Downstream obligations therefore belong in the same
commit as the thresholds — now enforced for every future fork by
[`scripts/experiment-forks.test.mjs`](../scripts/experiment-forks.test.mjs) and recorded as
[L-77](LESSONS.md).

### Window ended early, 2026-09-16 (run 166) — the registered regression clause, invoked

**The stop condition that fired, quoted from this file above:** *"The landing page's copy, layout,
offer and form must not change inside the window… **A change forced by a regression is permitted and
ends the window early, graded on the complete days before it.**"*

**The regression.** Measured on production from a browser in Actions
([qa-browser run 37](https://github.com/in-c0/tuned/actions/runs/35084104986)) at a 390px viewport,
verbatim from the job log:

> `/: layout 405px vs device 390px, scrollWidth 405px`
> `/ava: layout 436px vs device 390px, scrollWidth 436px`

The landing page did not fit a phone. A card's `.meta` row is a flex line whose items cannot shrink
below their own min-content width, so the row pushed its line box past the card, the initial
containing block grew to the widest line, and Chrome zoomed the whole document out to fit. This is
**pre-existing, not introduced by any run inside the window** — it is older than the window and was
never seen, for the reason recorded as [L-84](LESSONS.md#l-84): the two overflow assertions this loop
already owned compare `scrollWidth` against `innerWidth`, and this failure moves both together.

**Why it was fixed rather than deferred three days to 2026-09-18.** `/` is the only surface on which
anybody can apply, arrival is the bottleneck [EXP-007](#exp-007--is-there-a-human-on-the-other-side-of-the-landing-page-2026-08-15-run-43)
grades as Fork A, and a link sent to a phone is the arrival this loop can actually obtain. Holding a
visibly degraded conversion surface for three more days to protect a measurement **of that same
surface** inverts the purpose of the measurement. The clause exists so that no run has to decide this
fresh, and it decides it this way.

**What this costs and what it does not.** The window is **2026-09-05 … 2026-09-15**, eleven complete
UTC days instead of fourteen. EXP-011 is **not abandoned** — abandonment is Fork R-E's remedy for
contamination, and nothing here is contaminated: every day inside the shortened window was served the
frozen page. R is still Σ `landing_render` ÷ Σ `landing_view` over the complete days named here, read
**once**, from a snapshot generated after the window closes.

**Deliberately not done in this run, each for a stated reason.**

- **No value of R is computed, quoted or recorded anywhere in run 166's record.** The reading is one
  reading on one day, and a run that ends a window is the worst-placed run to also read it.
- **The reading date is left at 2026-09-19 and the fork table is byte-untouched.** *"No second reading
  and no extension"* forbids moving a date after seeing something; it does not invite moving one
  before. The forks execute exactly as registered on 2026-09-04.
- **The registered far-side `qa-browser` bracket still applies**, and its trigger has moved with the
  window: it was *"once after it closes on 2026-09-19"*, and the window now closes 2026-09-16, so the
  bracket is due from 2026-09-17 and before the reading is recorded. Its purpose — catching an
  emitter that detached mid-window — is unaffected by the window being shorter.
- **The engage and start rates read against R now describe a page that changed on 2026-09-16 at
  390px and did not change at all at 1440px** (asserted: zero elements moved on `/`, `/ava` and a
  find page at desktop width, before/after, measured). A later run reading those rates must not pool
  days across that boundary for phone-width traffic. The counters carry no viewport, so **this note is
  the only thing that records the boundary** — which is why it is here and not only in STATUS.

---

### The graded reading — **R = 0.58%**, Fork R-A (2026-09-19 08:35 Sydney, run 173)

**The one reading, on the pre-named date, over the registered window. R = Σ `landing_render` ÷ Σ
`landing_view` = 4 ÷ 686 = 0.58%.** Fork **R-A** fires: *mostly not a browser.*

**Source and its admissibility, established mechanically rather than by eye.**
[`ops/metrics/latest.json`](metrics/latest.json), `generated_at` **`2026-09-18T04:44:34.001Z`**, from the
`schedule` snapshot committed as [`b58c35a`](https://github.com/in-c0/tuned/commit/b58c35a). The window
is **2026-09-05 … 2026-09-15**, eleven complete UTC days, as shortened by run 166 under the regression
clause. A snapshot reports a UTC day completely only if it was generated at or after that day's end;
this one was generated **2.2 days** after the window closed:

```
$ node scripts/metrics-window.mjs admits 2026-09-05 2026-09-15
ADMISSIBLE 2026-09-05..2026-09-15 (11 complete UTC days)
  generated_at 2026-09-18T04:44:34.001Z, complete through 2026-09-17
```

That check is this run's own and is described under [L-91](LESSONS.md#l-91). It grades the clock and
nothing else — it says every day in the window had finished, not that its contents are clean.

**The series, both unsuffixed names and the bot names reported alongside and never summed into R.**

| UTC day | `landing_view` | `landing_render` | `landing_view_bot` | `landing_render_bot` | `landing_engage` |
| --- | --- | --- | --- | --- | --- |
| 2026-09-05 | 57 | **0** | 47 | 1 | 0 |
| 2026-09-06 | 71 | **0** | 39 | 0 | 0 |
| 2026-09-07 | 76 | **2** | 43 | 0 | 0 |
| 2026-09-08 | 61 | **0** | 20 | 0 | 0 |
| 2026-09-09 | 47 | **2** | 17 | 0 | 1 |
| 2026-09-10 | 56 | **0** | 37 | 2 | 0 |
| 2026-09-11 | 56 | **0** | 64 | 0 | 0 |
| 2026-09-12 | 52 | **0** | 85 | 2 | 0 |
| 2026-09-13 | 68 | **0** | 47 | 2 | 0 |
| 2026-09-14 | 58 | **0** | 22 | 0 | 0 |
| 2026-09-15 | 84 | **0** | 36 | 0 | 0 |
| **Total** | **686** | **4** | 457 | 7 | 1 |

**R = 4 ÷ 686 = 0.58%.** The cut point for R-A is **10%**, and the register placed both cut points
"well clear of the middle so that a reading near either is not a coin toss." 0.58% is not near it: it
is **one seventeenth** of the boundary. Nine of the eleven days produced **no rendering browser at
all**, and every render in the window landed on two days, 2026-09-07 and 2026-09-09.

**Consistency with the figure run 159 was forced to disclose.** That run computed a partial nine-day
series during routine inspection — `landing_render` **4**, `landing_view` **543** over
2026-09-05…09-13 — and disclosed it in full rather than letting it become a number-shaped secret. The
final eleven-day numerator is **also 4**: no rendering browser reached the landing page after
2026-09-09. The disclosed partial did not mislead, and the reading is what was registered on
2026-09-04 regardless.

**Fork R-D is excluded across the whole span, not merely at its ends** — all three registered
instrument brackets (runs 140, 149, 169) observed a real Chromium emit `landing_render` and production
answer 204, with `page_errors: []` on each, so the registered hoist trigger never fired. A zero on a
day is a statement about arrivals, not about the beacon.

**Fork R-E is discharged, and the way it survives is now graded rather than trusted.** Two first-party
clients load the landing page: the browser QA suite and the ops verifier. Both classify as automation
under `BOT_UA` in [`src/metrics.ts`](../src/metrics.ts), so every increment they caused landed in the
`_bot` names R does not read. Checked mechanically this run, not by inspection:

| first-party client | user-agent matched on |
| --- | --- |
| `qa/playwright.config.mjs` | `Headless` |
| `scripts/prod-http.sh` | `uptime` |

**The second of those is a hazard and is recorded as one.** The ops verifier is classified as
automation because the word *"uptime"* appears inside a human-readable parenthetical — *"first-party
uptime and metrics check"*. Nothing pinned that. Rewording it to *"first-party health and metrics
check"*, an edit that reads as pure prose, would have sent every `verify production` and
`metrics snapshot` probe into the **unsuffixed** `landing_view` that R divides by, silently. Two
assertions in [`test/metrics.test.ts`](../test/metrics.test.ts) now import the real classifier and
grade both strings; the prose rewording above turns them red.

### What Fork R-A's registered text obliges, executed as written

Quoted from the pre-registration of 2026-09-04, before any value of R existed:

> *`landing_view` is dominated by clients that never execute the page, and explanation 1 is the live
> one. The register's standing claim is **upheld and upgraded** from an inference on one day's
> interaction counter to a measured property of fourteen [eleven, as shortened]. Next action:
> `landing_view` stops being quoted as an audience number anywhere in this repository;
> `landing_render` becomes the denominator of every landing-page reading; and the remaining runs go to
> getting real arrivals rather than to the page.*

1. **The standing claim — *"the landing page is not the bottleneck, distribution is"* — is upheld and
   upgraded.** It rested on EXP-007 Fork A, an inference from one day of an interaction counter that
   could not distinguish "nobody real arrives" from "real people arrive and do not act". Eleven days
   of a render beacon distinguish them: **686 human-flagged landing views produced 4 rendering
   browsers.** [NORTH_STAR](NORTH_STAR.md) is updated to carry the measured basis in place of the
   inferred one.
2. **`landing_view` is retired as an audience number** and is recorded as such in
   [METRICS.md](METRICS.md). It remains a true count of requests that did not declare themselves as
   automation. It is not an audience, not a visit and not a person, and 0.58% is the measured size of
   the gap.
3. **`landing_render` is the denominator of every landing-page reading from here.**
4. **The remaining days go to getting real arrivals, not to the page.** Recorded in
   [DECISIONS.md](DECISIONS.md) as the standing direction for the final sixteen days.

### What this reading does not say, stated as forcefully as what it does

- **R is not a number of people and 4 is not four visitors.** The pre-registration says so and the
  stop conditions repeat it. A JS-executing crawler that does not declare itself lands unsuffixed and
  is indistinguishable from a person; the owner is a member who clicks around inside Tuned. **4 is an
  upper bound on rendering browsers, not a count of humans**, and it may be zero humans.
- **No engage rate is computed.** Fork R-C's next action asks for one; **R-A's does not**, and
  `landing_engage` read **1** over the window. A rate formed on a numerator of 4 would be the error
  [L-37](LESSONS.md) records — a quotient given the authority of a measurement. It is not computed
  here and must not be computed later from this window.
- **This is not a finding about demand, and it is not traction.** It says what the arriving *clients*
  are. `applications` **0**, `members_ever_active` **0**, gross cash **AUD $0** are the numbers that
  would be about people.
- **A low R does not license a claim that the page is good.** The page was never measured against
  rendering browsers, because there were almost none. Fork R-A moves effort off the page; it does not
  certify it.

**EXP-011 is closed.** One reading, on the pre-named date, over the registered window, from an
admissible source. No second reading, no extension, no recomputation of R from this window under any
later framing.

---

## EXP-012 — if ooh.directory listed `/sportstech`, would Tuned see the arrivals? (2026-09-06, run 143)

**Pre-registered before the counter it reads has ever been written, before any submission exists, and
before A2 has been answered at this venue.** That ordering is [A5](DISTRIBUTION.md)'s and it is the
whole reason this file is written today rather than after a listing: `arrival:<tag>` starts at zero on
the deploy that introduces it, nothing is backfilled, and a suggestion to this venue can be made once.

### The question

[DISTRIBUTION.md](DISTRIBUTION.md) has held ooh.directory as a candidate since run 57 with **A5 as the
only condition this executor could still move**. Run 137 named registering the tag and its threshold
as *"the next executor-actionable step at this venue"*; runs 138–142 each declined it for something
else. It is done here.

The venue's form field says *"The URL of the blog's front page **(not its feed)**"*. The blog is
`/sportstech` — the HTML route `GET /:handle`, counted since run 48 — **not** the marketing page at
`/`, which reads no `?src=` at all and is pinned in `test/arrival.test.ts` not to. So the route was
already covered and only the tag was missing. That is the exact mirror of run 56's defect, where an
instrumented tag sat on an uninstrumented route.

### Hypothesis

If ooh.directory lists `/sportstech`, arrivals from that listing land in **`arrival:ooh-directory`**
(unsuffixed) and are separable from the site's own traffic. If it lists it and nobody comes, the same
counter says so. If it never lists it, no reading is available and none is invented.

**What this cannot do, registered here so no later run claims it.** `arrival:ooh-directory` is **not a
count of people** and not a count of subscribers. It counts HTML views of one URL carrying one
query parameter, split by the same forgeable user-agent heuristic as every other counter here. There
is no cookie, no visitor identifier and no per-visitor state, so nothing in it distinguishes ten
arrivals from one client returning ten times.

### Baseline (source-linked, frozen before any submission)

From the committed scheduled snapshots in [`ops/metrics/`](metrics/), complete UTC days only, window
**2026-08-16 … 2026-09-05 (21 complete days)** — the days on which the `arrival:` family existed
(`arrival_bot:qa` first wrote 2026-08-16).

| Counter | Total | Non-zero days |
| --- | --- | --- |
| `arrival:qa` (unsuffixed) | **0** | **0 of 21** |
| `arrival_bot:qa` | 3 | 2 of 21 |
| `arrival:awesome-rss-feeds` | **0** | 0 of 21 |
| `feed_view:sportstech` | 37 | 17 of 21 |
| `feed_view_bot:sportstech` | 84 | 18 of 21 |

`arrival:ooh-directory` **does not exist and reads nothing on every UTC day up to and including
2026-09-06.** That is a statement about the allowlist, not about traffic. There is no historical
series for it, not a low one and not a zero one.

**The HTML-route null is measured and it is zero.** `qa` is published in exactly the same public
places as a real channel tag and is submitted to no venue, ever — that is its whole job
([A6](DISTRIBUTION.md), run 58). On the RSS route [EXP-010](#exp-010) measured its null at
`control_days` = 1 of 14. **On this route, over 21 days, it is 0 of 21.** A tighter floor, on the
same surface EXP-012 grades, and it is a baseline rather than a graded result.

Funnel context, unchanged: `applications` **0** · `members` **1** · `members_ever_active` **0** ·
`followers` **0** · `items_public` **84** · gross cash **AUD $0**, from *no billing exists*.

### Change (commit/deploy)

One string added to the existing `ARRIVAL_TAGS` allowlist in [`src/index.ts`](../src/index.ts). No new
route, no new counter family, no schema change, no cookie, no identifier, no per-visitor state, **no
new data category — so the privacy policy is deliberately not amended**, on the same reasoning runs 48
and 56 recorded for the tags this joins.

Five tests in [`test/arrival.test.ts`](../test/arrival.test.ts) pin the four properties the reading
depends on: the tagged front-page view writes `arrival:ooh-directory`; a crawler splits into
`arrival_bot:ooh-directory`; the RSS route writes the **different** name `arrival_fetch:ooh-directory`
so a poll can never be read as an arrival; and `GET /` writes nothing for the tag at all.

### t0, and the control this design gets for free

**t0 is the submission timestamp the owner posts to issue #1** — not the deploy, and not the date of
this file.

Between this deploy and t0 the tag is **published but unsubmitted**, which is precisely the condition
`qa` is kept in permanently. That interval is therefore a **second control, on the real tag itself**,
and it is strictly better than `qa` because it is the same string on the same URL. Its reading is
recorded at t0 as `presubmission_days` and `presubmission_total`.

**If A2 is never answered and no submission is made, EXP-012 is never run.** It is then recorded as
**UNRUN**, never as a null and never as a zero, and nothing about demand may be read from it.

### Reading — one, on the complete UTC day fifteen days after t0

Window: **14 complete UTC days beginning the first complete UTC day after t0**, read from a `schedule`
metrics snapshot generated after the window closes. Quantities, both unsuffixed:

- **D = non-zero days of `arrival:ooh-directory`** in the window.
- **V = Σ `arrival:ooh-directory`** over the window.

`arrival_bot:ooh-directory` and `arrival_fetch:ooh-directory` are reported alongside and **never
summed into D or V**.

The cut points are set here, before any value exists. The measured null on this route is 0 days and 0
volume; the RSS-route null is 1 day in 14. A threshold that merely beat zero would grade a single
URL-assembling crawler as a channel, so both cut points clear both nulls with room.

- **Fork O-A — the listing sent people. D ≥ 3 and V ≥ 8.** *Reading:* arrivals attributable to this
  listing exceed everything a published-but-unsubmitted tagged URL has ever earned on this route, on
  both axes. *Next action:* ooh.directory becomes the first channel with evidence behind it; the same
  packet shape is prepared for the next venue, and the reading is quoted with D, V and both controls
  or not at all.
- **Fork O-B — inside the band. D ≤ 2, or V < 8.** *Reading:* nothing separable from a URL nobody
  sent anywhere. *Next action:* the candidate is not re-run and not re-argued; a second suggestion to
  the same venue is **not** admissible.
- **Fork O-C — silent. D = 0 across all 14 days**, with the venue listing confirmed present.
  *Reading:* a listed link blog sent nobody. That is a real and reportable null about the channel, and
  it is **not** a statement about Tuned's demand. *Next action:* registered 2026-09-14 (run 159),
  before the suggestion exists and with D undefined. Record the null against **this venue** in
  [DISTRIBUTION.md](DISTRIBUTION.md) and propose it no further. **Do not generalise it to directory
  listings as a class** — one venue's silence is one venue's silence, and EXP-009 is the other data
  point this loop does not have. The durable consequence is narrower and firmer than a verdict on
  channels: **a listing is not distribution**, so no later run may count "we are listed somewhere" as
  progress against the active objective, which asks for arrivals and not for placements.
- **Fork O-D — inadmissible: never listed.** `/sportstech` does not appear on ooh.directory at the
  reading, verified by one `source-read` dispatch in the reading's own cycle. *Reading:* **nothing is
  graded.** The venue states this outcome in advance — *"These are suggestions rather than
  submissions… Suggesting a blog does not guarantee it will appear on the site"* — so this is the
  **expected modal outcome**, registered as such rather than discovered as a disappointment. No
  demand inference in either direction. *Next action:* registered 2026-09-14 (run 159). **Do not
  re-suggest.** The venue told us in advance that suggesting guarantees nothing, so a second
  suggestion is not new evidence — it is the same act repeated because the first did not produce a
  number, which is the prohibition EXP-008 carries and Fork E above restates. EXP-012 closes as
  **never listed**, `arrival:ooh-directory` **stays allowlisted and unread** so a later listing is
  still measurable at zero cost, and the packet in
  [`ops/SUBMISSION-ooh-directory.md`](SUBMISSION-ooh-directory.md) is left exactly as it is rather
  than rewritten to be more persuasive. **Nothing here is evidence about Tuned**, and a run that
  reports this fork as a setback has misread it: the expected outcome arriving on schedule is the
  one result that was never in question.
- **Fork O-E — the instrument did not land.** `arrival:ooh-directory` and `arrival_bot:ooh-directory`
  both zero on all 14 days *while* `feed_view:sportstech` is non-zero. *Reading:* the tag is not
  writing in production and nothing above is graded. *Next action:* fix it, and treat every statement
  made from D or V as withdrawn. This is the fork this loop has hit five times in other shapes
  ([L-35](LESSONS.md), [L-44](LESSONS.md), [L-46](LESSONS.md), [L-51](LESSONS.md),
  [L-56](LESSONS.md)) and it is an expected outcome, not an accident.
- **Fork O-F — inadmissible on contamination.** `presubmission_days` ≥ 2, or any first-party client
  fetches the tagged URL inside the window under a user-agent that does not match `BOT_UA` in
  [`src/metrics.ts`](../src/metrics.ts). *Reading:* the unsuffixed name is carrying URL-assemblers or
  this loop looking at itself, and D is not a measurement of the venue. **Fork O-F must not be
  reported as Fork O-A.** *Next action:* registered 2026-09-14 (run 159), on the same shape as
  EXP-011 Fork R-E. **D is not computed, quoted or recorded**, caveated or otherwise. Identify what
  fetched the tagged URL and stop it. Then re-run on a clean 14-day window **only if the listing is
  still present for all of it** — a window whose venue state changed mid-flight is not clean either —
  and otherwise abandon rather than salvage. The one thing that must not happen is the repair being
  counted as the reading: fixing contamination tells us about this loop, never about the venue.

### Stop conditions, stated in advance

- **Registering the tag authorizes no submission.** A2 at this venue is **unanswered**: whether the
  owner may be named as the suggester of an **agent-written** link blog is the owner's decision and
  nobody else's. A1 is only PARTIALLY satisfied on the same point — the venue admits link blogs *"if
  they include original commentary about each link"*, and Tuned's commentary is written by an agent
  and labelled `AI AGENT` on the page. Nothing is concealed; that is provenance being visible, not a
  rule being satisfied.
- **One suggestion.** Not a second entry in another category, and not a resubmission after silence.
- **No second reading and no extension.** One reading, on one day derived from t0 before t0 exists.
- **D and V are not numbers of people**, and no fork above licenses saying they are. `applications`,
  `members_ever_active` and gross cash are the numbers that would be about people, and they are 0, 0
  and $0.
- **A listing is not demand.** Fork O-A says a channel produced arrivals; it says nothing about
  whether anyone wants Tuned, and it must not be reported as traction.
- **The tag is not private and must not be treated as though it were.** It is public source in a
  public repository, as is every route it applies to ([A6](DISTRIBUTION.md), amended run 58). The
  standing rule against printing the joined URL is kept — [`SUBMISSION-ooh-directory.md`](SUBMISSION-ooh-directory.md)
  names the route and the tag on separate lines — but that is compliance, **not** a privacy measure,
  and the reading's interpretability rests on the two controls above rather than on secrecy.

## EXP-005 — re-read 2026-09-11 (run 152), and the first per-feed reading on record

**EXP-005 stays CLOSED; this is a subsequent exercise of its instrument, recorded here so the
reading is dated and does not get quoted as the 2026-08-13 one.**

**Before:** the demo feed's newest item was **161.9 hours** old against the pre-registered 48-hour
threshold — [34652430880](https://github.com/in-c0/tuned/actions/runs/34652430880), `22:06:08Z`,
**red**. **After** item 279: **0.3 hours**, [34654799670](https://github.com/in-c0/tuned/actions/runs/34654799670),
`22:37:51Z`, **green**. The threshold is at its pre-registered value; nothing was softened.

`retiredClaimsStillPresent: []` in both readings — the two sentences production falsified on
2026-08-13 ([L-18](LESSONS.md)) are still absent, which is the half of this instrument that keeps
working after a feed goes stale again.

**The reading that matters is not the one that changed.** Per-feed ages are in
[METRICS.md](METRICS.md): the other four public feeds are **979–1031.8 hours** old and did not move.
`@ava` is the human feed and may not be published to by this loop at all — a star is the attention
Tuned carries, and manufacturing one would fabricate the only signal the product has. The other
three are agent feeds that `agent-operator list` reports as `adoptable (owned, unmanaged)`: no
operator, no publisher, seeded 2026-07-30 and never fed.

**Binding on any later run: this is not an argument for adopting them.** An adopted feed with
nothing genuinely selected for it is EXP-008's failure mode 2 one layer out — *"the path works and
the loop misuses it"*. Four live-looking feeds fed by nobody would be worse than three dormant ones
that are honestly dormant.

## EXP-005 — re-read 2026-09-18 (run 172), and the reading a conversion surface was contradicting

**EXP-005 stays CLOSED; this is a subsequent exercise of its instrument, recorded here so the
reading is dated and does not get quoted as the 2026-08-13 or 2026-09-11 one.**

Read at **`2026-09-18T10:08:54.487Z`** against production serving
[`b58c35a`](https://github.com/in-c0/tuned/commit/b58c35af59768641a535fda8ddfdfd63847245ad) —
[qa-browser 46](https://github.com/in-c0/tuned/actions/runs/35333163076), `EXP005_SUMMARY`. The
threshold is at its pre-registered 48 hours; nothing was softened, and the run is **red** at
**143.8h** on the demo feed, which is a true statement about Tuned and not a defect in the page.

| feed | kind | items | newest item | age |
| --- | --- | --- | --- | --- |
| `ava` | human | 38 | `2026-08-02T03:33:44Z` | **1134.6h** — 47.3 days |
| `sportstech` | agent, demo | 19 | `2026-09-12T10:21:50Z` | **143.8h** — 6.0 days |
| `wearables` | agent | 10 | `2026-07-30T22:49:47Z` | **1187.3h** — 49.5 days |
| `wellbeing` | agent | 9 | `2026-07-30T22:50:34Z` | **1187.3h** |
| `graphics` | agent | 11 | `2026-07-30T22:51:27Z` | **1187.3h** |

`retiredClaimsStillPresent: []`, `pulseServesNewestItem: true`, `demoIsFreshest: true`,
`feedsWithNoItems: []`. The two sentences production falsified on 2026-08-13 ([L-18](LESSONS.md))
are still absent from the landing page.

**What is new is not a number, it is what the numbers were being read against.** Since run 152 the
three seeded agent feeds have not moved at all — 1187.3h against that run's 979–1031.8h is the same
2026-07-30 rows, six days older. `@sportstech` moved once, on 2026-09-12, and then EXP-013 took Fork
B and disarmed the scout. `@ava` is the human feed and **may not be published to by this loop**; that
clause is unchanged and is not being re-argued.

**The consequence this run acted on.** Between run 152 and now, run 150 put a follow button on every
feed page and run 171 put one on all eighty-seven find pages, both carrying a conditional promise
about future publication. Sixty-eight of those pages belong to a feed in the 1134.6–1187.3h band.
**The instrument that grades exactly this class of claim reads `GET /` and nothing else**, so the two
surfaces that convert were outside it by construction. Fixed in
[PR #73](https://github.com/in-c0/tuned/pull/73) by having the pages state the age rather than by
widening the instrument — see [L-90](LESSONS.md#l-90) and [DECISIONS.md](DECISIONS.md).

**Binding on any later run, carried forward from run 152 and strengthened:** none of this is an
argument for adopting the dormant feeds or publishing into them. **It is specifically not a licence
to publish because a feed looks stale** — freshness-as-motive was ruled out at run 106 and EXP-008's
binding clauses disqualify any publication made to move a number. The honest response to a dormant
feed is to say it is dormant, which is what shipped.

## EXP-008 — sixth exercise of the operator plane, 2026-09-11 (run 152)

**EXP-008 stays CLOSED; this is a subsequent exercise of the plane it graded.** Item **279**, all six
thresholds hold against live production, full record and the case against the find in
[EXP-008-CANDIDATES.md](EXP-008-CANDIDATES.md) R-6.

**The cycle ran from the worst motive position of the six and named it first.** A4 was failing —
161.9h against a 72h bar, read from production *before* any candidate was surfaced. R-5 could open by
recording that freshness was not at stake; this one could not. The rule bound unchanged: **four of
six candidates were rejected at result level on remit clauses, and one of the two pages actually
opened was rejected on its own abstract** (no cohort, no observation period, no injury count, and
91.5% accuracy quoted for a rare event with no base rate). *Publish nothing* was live until the
dispatch and would have left A4 exactly where it already was.

**Two hosts entered the reachable set**, which is the durable result independent of what published:
`journals.plos.org` and `nature.com` both served a self-declaring headless reader a complete article
page with `possible_gate_markers: []`. PLOS is one of the four hosts run 85 pre-committed this loop
to probing ([L-45](LESSONS.md)); that probe is discharged. The standing "hosts carrying most
on-remit material do not allow it" limitation is **narrower than it was**, tested rather than argued.

**Threshold 5 took three dispatches and none of the reasons concerned item 279** — see
[L-68](LESSONS.md) and [L-69](LESSONS.md). Every provenance assertion passed on every attempt; the
red was a QA assertion that read a delivered fire-and-forget beacon as a failed request.

---

## EXP-013 — can an agent feed publish on a cadence with no person selecting? (2026-09-12, run 153)

**Pre-registered before the selector has screened a single candidate, in the same commit that ships
the bar.** That ordering is the whole point and it replaces a guarantee the six hand-made
publications had and an autonomous one cannot: each of those carries a pre-registration commit that
predates its dispatch, because the registry's guarantee is that the strings were written down before
the item existed ([qa/nominations/index.mjs](../qa/nominations/index.mjs)). A selector cannot
pre-register an item it has not yet seen. What it can do — and what this commit does — is **make the
rule predate the selection**: the bar is code, in git, and a bar later edited to agree with a
candidate set would appear as a diff.

### The question

Run 152 measured the thing this tests. [EXP-005](#exp-005--re-read-2026-09-11-run-152-and-the-first-per-feed-reading-on-record),
read per feed off live production for the first time: four of five public feeds had published nothing
for six weeks, and `@sportstech` moved only because that run published to it by hand. Its own
conclusion, quoted because it is this experiment's premise: *"the rate at which `@sportstech`
publishes is the rate at which a scheduled executor run happens to perform a selection cycle"* — six
publications in 24 days — so **"recurring agent value without attention overload", third in issue
#1's commercial hierarchy, is not demonstrated at any cadence a subscriber would notice.**

Tuned's positioning is that agents can consume vastly more information than humans can review. Until
this commit **no agent on Tuned consumed anything**: every item on every agent feed was placed by a
person reading a research session's notes. So the question is not whether the operator plane works —
[EXP-008](#exp-008--can-the-operator-control-plane-publish-one-real-agent-find-2026-08-15-run-44)
answered that six times — but whether **an agent feed can publish on its own at a rate and a quality
a subscriber would notice, without drifting off remit and without becoming the firehose Tuned exists
to remove.**

### Hypothesis

A remit translated into an explicit public bar, applied to material the agent actually fetched, will
**select a small minority of what it screens** and will keep `@sportstech` continuously fresh without
any hand publication. The two ways that can fail are named in advance and neither is a bug: the bar
may be so loose that the feed becomes a search alert (Fork B), or so tight that it never publishes
(Fork D). Both are readings about the bar.

### What this cannot show, registered here so no later run claims it

**Nothing in this experiment is demand.** `followers` is **0** and there is no subscriber to notice
any cadence. EXP-013 measures **supply** — whether Tuned can produce agent attention at a rate worth
following — and a green reading on every threshold below leaves `applications`, `members_ever_active`,
`followers` and gross cash exactly where they are. It must never be cited as traction, and a
publication count is not an activation.

It is also not a claim that the selections are *good*. The bar can prove a full text contained a
randomised design and two families of reported statistics. It cannot prove the paper matters, and the
`why` line it composes deliberately says only what the agent did — see the limitation below.

### Baseline (source-linked, frozen before the first screen)

Publication cadence on `@sportstech`, from [ops/agents/sportstech.md](agents/sportstech.md) and the
nomination registry — **every one placed by hand**:

| | |
| --- | --- |
| Publications, 2026-08-18 → 2026-09-11 | **6** (items 242, 246, 247, 248, 249, 279) |
| Mean interval | **~4 days**, and the real distribution is "whenever a run chose to" |
| Longest gap | **2026-08-28 → 2026-09-05**, 8 days; then **2026-09-05 → 2026-09-11**, 6.7 days (161.9h, failing a 72h bar when run 152 read it) |
| Autonomous publications ever | **0** |
| Other public agent feeds with any publisher | **0 of 3** (`@wearables`, `@wellbeing`, `@graphics` — last item 2026-07-30) |

Funnel context, unchanged and not expected to move: `applications` **0** · `members` **1** ·
`members_ever_active` **0** · `followers` **0** · `items_public` **85** · gross cash **AUD $0**, from
*no billing exists*. Source: [ops/metrics/latest.json](metrics/latest.json), generated
`2026-09-11T22:45:54Z`.

### Change (commit/deploy)

[`scripts/lib/agent-scout.mjs`](../scripts/lib/agent-scout.mjs) (the bar, pure),
[`scripts/agent-scout.mjs`](../scripts/agent-scout.mjs) (the hands), and
[`.github/workflows/agent-scout.yml`](../.github/workflows/agent-scout.yml) (the cadence: daily,
**at most one publication per run**, capped in the script and not in the schedule). **No `src/` file
is touched, no route, no schema, no counter and no page** — so EXP-011's landing-page window is
untouched by construction.

The encounter standard is the strict one. `ops/agents/sportstech.md` says "genuinely encountered"
means a page-level read, because *"a search result is a pointer, never an encounter"*. This selector
fetches the **open-access full text** from Europe PMC's archive and grades the bar against that text;
a candidate whose full text cannot be fetched is **rejected as unencounterable**, never selected on
its abstract. That is the clause most likely to keep the agent quiet, which is the right direction for
a clause to fail in.

### Thresholds, all falsifiable, graded on the complete 14 days 2026-09-12 … 2026-09-25

| # | Threshold | Fails if |
| --- | --- | --- |
| **1** | A live screen completes against Europe PMC and reports a per-candidate verdict for every record it read | no reading is available at all → **Fork E** |
| **2** | **Selection rate ≤ 25%** of screened candidates on every live screen, and every rejection names exactly one clause | the bar admits most of what it sees → **Fork B**, the schedule is disabled the same day |
| **3** | Any published selection carries its provenance on **both** public surfaces — feed page and RSS — graded by the existing [`qa/exp008-provenance.spec.mjs`](../qa/exp008-provenance.spec.mjs) against a registry entry | provenance is absent on either surface |
| **4** | `@sportstech`'s newest public item is **≤ 72h old** on every reading in the window, **with zero hand publications in it** | the cadence still depends on a person → the premise is unchanged |
| **5** | **Every** published item is on-remit under a human reading at the 2026-09-26 reading | one off-remit item → **Fork C**: retract, disable, report |

### Forks, decided in advance

- **A — cadence demonstrated.** 1–5 hold. The agent is real, and the next question is the one this
  cannot answer: whether anybody follows it. No claim of demand. *Next action:* registered 2026-09-14
  (run 159), before the 2026-09-26 reading. EXP-013 closes **passed on cadence only**, and that
  phrase is the whole of what may be reported — **a feed that publishes on schedule is not traction,
  not demand, and not a user**, and any run quoting Fork A as commercial progress has misread it.
  The successor question is followers, graded on `follow_rss` and `feed_fetch:<handle>` against a
  pre-registered band, never on publication count, which measures only this loop's own diligence.
  **This fork authorizes no arming of `agent-scout.yml`**: whether the daily schedule may publish
  unattended is the reviewer's open decision and is not settled by the bar having held.
- **B — firehose.** Threshold 2 fails. The bar is a pass-through. *Next action:* disable the schedule
  the same day, tighten, and do not publish under a bar that has been shown not to refuse.
- **C — drift.** Threshold 5 fails. *Next action:* `retract` the item, disable the schedule, and
  record it as the remit failing rather than as a bad day.
- **D — starved.** 1 holds, 2 is vacuous because nothing was ever selected, 4 fails. A reading about
  the bar or about the literature, not about Tuned; *next action:* the response is to widen the
  window or the term lists, never to relax the `measured-result` clause.
- **E — unavailable.** Europe PMC refuses a self-declaring client. **No reading**, recorded as a
  blocker; it is not a zero and not evidence about anything. *Next action:* registered 2026-09-14
  (run 159). Record the blocker and stop — **do not substitute a different source to manufacture a
  reading**, because a bar calibrated on one corpus and read against another grades neither, and a
  swapped denominator is how a null becomes a pass. **Do not re-run against an undeclared or spoofed
  user-agent**; that is the standing hold in [STATUS.md](STATUS.md) and it is not suspended by an
  experiment being inconvenient to grade. EXP-013 re-runs **only** when the source answers a
  declaring client, and is otherwise closed as **unavailable** — which is a fact about Europe PMC's
  access policy and about nothing else.

### Known limitation, stated before the first publication rather than after it

**The `why` line is weaker than the hand-written ones and that is deliberate.** Items 242–279 carry a
sentence describing the finding — a human read the paper. This agent has not understood the paper, so
its line says what it *did*: how many candidates it screened, that it read the full text, how long
that text was, which design and statistic families the text contained. A line claiming more would be
the summariser Tuned is not, and generating a paraphrase of a result nothing here verified is the
doctrine failure, not the missing prose. **This is the first thing to improve and the improvement is
quotation, not generation** — a verbatim sentence from the source is pointing; a paraphrase is
authoring.

**Reading due 2026-09-26.** No threshold above is graded before the window closes, and Fork B and
Fork C act immediately rather than waiting for it.

### EXP-013 — interim record, 2026-09-12 (run 153). NOT a graded reading; the window closes 2026-09-25

Three live screens and one publication on the day the bar shipped. Recorded now because two of the
thresholds were answered immediately and one of them was answered against this run's own interest.

| Screen | Run | Screened | Selected | Rate | On remit, by human reading |
| --- | --- | --- | --- | --- | --- |
| 1 — original bar | [34672702607](https://github.com/in-c0/tuned/actions/runs/34672702607) | 50 | 10 | **20%** | **6 of 10** — four were clinical rehabilitation |
| 2 — corrected bar | [34672935681](https://github.com/in-c0/tuned/actions/runs/34672935681) | 35 | 9 | **25.7%** | **9 of 9** |
| 3 — publishing | [34673111073](https://github.com/in-c0/tuned/actions/runs/34673111073) | 35 | 9 | 25.7% | 9 of 9; **item 280 published** |

**Threshold 1 — satisfied.** A live screen completes against Europe PMC and reports a per-candidate
verdict for every record it read, with exactly one named clause per rejection. Fork E is excluded: the
archive serves a self-declaring client without a challenge, for both search and `fullTextXML`.

**Threshold 2 — FAILED, at 25.7% against a bar of 25%, and the failure is recorded rather than
argued away.** Fork B says disable the schedule the same day. **Done**: scheduled runs now screen and
publish nothing ([`agent-scout.yml`](../.github/workflows/agent-scout.yml)), and publication requires
an explicit dispatch by someone who has read the screening record.

The threshold is also **mis-specified, and it is not being rewritten inside its own window.** Two
independent reasons, both visible in the table:

1. **The denominator counts candidates the bar never decided.** 17 of screen 2's 35 were deferred
   unread against the read budget. On the decided set the rate is **9 of 18 = 50%**, a larger failure.
   Whether 25% was ever the right number cannot be answered while the two denominators differ by 2x.
2. **It measures a risk that is already bounded elsewhere.** The worry behind it was attention
   overload. The cap on this agent is **one publication per run**, enforced in code, so the feed's
   volume is bounded whether the selection rate is 5% or 50%.

And the sharpest evidence against it is screen 1 versus screen 2, four minutes apart: **the ratio was
green when the output was wrong and red when the output was right.** [L-70](LESSONS.md).

**Threshold 5 — the only threshold that caught anything, and it was written as an afterthought.** Six
of screen 1's ten selections were on remit; four were clinical rehabilitation with impeccable
instruments and statistics. The scope clause had been written as one list mixing "athlete" with
"gait", "kinematic" and "neuromuscular", so a term describing a **method** satisfied a clause meant to
ask **about whom**. Corrected in [`e0918ba`](https://github.com/in-c0/tuned/commit/e0918ba) before any
reader saw anything: sport context required, movement vocabulary demoted to description only, clinical
populations refused unless an athlete or named competitive sport is present, `TITLE_ABS` instead of
unfielded search terms, and the full-text read given the scope question to answer as well. **Fork C
was not triggered, because nothing off-remit was ever published.**

**Threshold 3 — provenance on both public surfaces.** Item **280** is in the registry as
[`280-wbv-soccer-neuromuscular.json`](../qa/nominations/280-wbv-soccer-neuromuscular.json), the first
entry of pre-registration form `autonomous-bar`, and it is graded by the existing provenance spec
alongside the six hand-made publications.

**Threshold 4 — cannot be met, and saying so now rather than at the reading.** Continuous freshness
with zero hand publications requires the schedule to publish, and the schedule is disarmed under Fork
B. What this run demonstrated is the **capability**, not the cadence: one publication, at the moment a
person dispatched it, from a selection a person did not make.

**The state of the bar, measured rather than predicted** — and the prediction was wrong, which is
[L-71](LESSONS.md). The commit that shipped it named the full-text encounter and the statistics clauses
as *"the clause most likely to keep this agent quiet"*. They refused **0 of 10** on screen 1. After the
correction they refused **3 of 12** on screen 2 — a conference poster with no design term, an
association study with none, and an elite para-kayaker study reporting one statistic family — and the
expensive read now also answers the scope question. A clause that refuses nothing is either wrong or
unnecessary, and only counting says which.

**Nothing commercial moved and nothing is claimed.** `applications` **0** · `members` **1** ·
`members_ever_active` **0** · `followers` **0** · gross cash **AUD $0**. `public_items` **17 → 18**,
which is supply.

### EXP-013 — threshold 2, re-specification PROPOSED (2026-09-12, run 154). NOT in force; not graded against; the schedule stays disarmed

Run 153 failed threshold 2 at **25.7%** against a bar of 25%, took Fork B, disarmed the schedule, and
then refused to rewrite the threshold inside its own window. It left its successor one instruction,
quoted because it is the whole authority for this section: *"the next run will propose one in a commit
before screening and will not arm the schedule on its own reading of a threshold it wrote itself."*
**No reviewer ruling has been posted** — the newest comment on issue #1 is run 153's own report — so
this is the proposal, committed **before this run's first screen**, and it is the discharge of that
promise and nothing more.

**What is in force right now, unchanged by this section:** threshold 2 as originally written, FAILED,
Fork B taken, `agent-scout.yml` disarmed. Nothing below is graded against, used to arm anything, or
cited as a pass.

**The proposal: delete the rate as a gate, promote the inspection to one.**

| | Original | Proposed |
| --- | --- | --- |
| **Gate** | selection rate ≤ 25% of **screened** candidates, every screen | **every selected candidate is on remit under a human reading** — selected, not merely published — and every rejection names exactly one clause. One off-remit selection is Fork C |
| **Rate** | the gate | **reported, never graded**: selections over the **decided** set (metadata-refused + full-text-read), with candidates deferred unread against the read budget excluded from the denominator and stated separately |
| **Pass-through detector** | the rate | **per-clause refusal counts every screen.** A clause that refuses nothing across the window is either wrong or unnecessary, and the record says which it was ([L-71](LESSONS.md)) |

**Why this shape, and the argument does not depend on any number this run has seen.** Three reasons,
in descending order of how much they would survive a reviewer disagreeing with me:

1. **The rate measures a risk that is bounded in code elsewhere.** The worry behind 25% was attention
   overload. `@sportstech` publishes **at most one item per run**, enforced in
   [`scripts/agent-scout.mjs`](../scripts/agent-scout.mjs) and deliberately not in the schedule. The
   feed's volume is identical whether the bar selects 5% or 50%, so the rate gates nothing that is
   actually at risk.
2. **A rate cannot say whether the refusals were the right refusals**, and on 2026-09-12 it said the
   opposite: green at 20% when four of ten selections were about stroke and cerebral-palsy patients,
   red at 25.7% when nine of nine were on remit, four minutes apart ([L-70](LESSONS.md)).
3. **The inspection is the only threshold that has ever caught anything here** — it caught the scope
   bug before a reader saw it. It was written as an afterthought at the bottom of the table.

**What this proposal deliberately does not do, because it would be the sin Fork B exists to prevent.**
It does not choose a new number. A band picked by the executor *after* seeing 20%, 25.7% and 50% is a
threshold fitted to its own candidate set, and no amount of prose makes that falsifiable. So the
proposal removes the number rather than retuning it, and the one new gate is a human reading that this
executor cannot grade in its own favour without the grading being inspectable in the log.

**The cost of the proposal, stated.** Dropping the rate gives up the one gate that could have fired
automatically, same-day, with no human in it. Fork B acted within minutes on 2026-09-12 precisely
because a number is cheap to check. The inspection gate is slower and needs a reader. That is a real
loss and it is the reason this is a proposal rather than an edit.

**Two questions only the reviewer can answer, and the executor will not answer either of them for
itself:**

1. **Is this re-specification accepted** — or is a re-tuned rate over the decided set preferred, in
   which case the reviewer should state the number?
2. **May the daily schedule publish unattended under it?** The schedule is disarmed. Re-arming is one
   expression in [`agent-scout.yml`](../.github/workflows/agent-scout.yml) with the condition written
   beside it. **This run does not arm it**, and no later run should arm it on its own reading of a
   threshold the executor proposed.

### EXP-013 — the known limitation discharged: the agent now quotes the source (2026-09-12, run 154)

EXP-013 registered one limitation **before** its first publication and named its fix in the same
breath: *"The `why` line is weaker than the hand-written ones and that is deliberate… **This is the
first thing to improve and the improvement is quotation, not generation** — a verbatim sentence from
the source is pointing; a paraphrase is authoring."* This is that improvement, shipped before the
selector has quoted anything, so the rule again predates the output.

**The baseline is one line, and it is the whole argument for doing this.** Item 280's public `why`, on
the only feed a stranger arriving from a directory of RSS feeds would land on:

> Selected by @sportstech from 35 open-access candidates screened 2026-09-12: full text read (46,097
> characters). Design terms present: randomised, repeated measures, comparison. Reported: p-value,
> confidence interval, effect size, agreement, error, dispersion.

Every word of that is true and checkable, and it tells a reader nothing about the paper. The six
hand-made lines on items 242–279 describe the finding because a person read it.

### Change

[`scripts/lib/agent-scout.mjs`](../scripts/lib/agent-scout.mjs) only — `selectQuotation`,
`splitSentences`, `quoteFrames` and a rewritten `composeWhy`, plus the screen log line in
[`scripts/agent-scout.mjs`](../scripts/agent-scout.mjs). **The bar is not touched.** No clause, term
list, threshold, ranking or query changed, so which candidates are selected this window is
unaffected and EXP-013's thresholds 1, 2, 4 and 5 are unaffected by construction. **No `src/` file,
route, schema, counter, page or secret**, so EXP-011's landing-page window is untouched too.

### The one invariant, and it is a substring check

The agent never composes a sentence about a source. It selects one the authors wrote and reproduces
it character for character, in quotation marks, labelled *"the source's own words"*, beside the link.
`selectQuotation`'s last clause is `abstract.includes(quote)` applied to the string that would be
published, so **the failure mode of this code is silence, not invention**: when no sentence qualifies,
the line falls back to the provenance-only form item 280 carries.

Six clauses refuse, each named in the run log the way the bar's own rejections are — `no-abstract`,
`length`, `reported-number`, `self-contained`, `resolvable`, `verbatim`. Two of them are the ones that
matter:

- **Only the abstract, and where the abstract is structured, only its results section.** A sentence
  lifted from a results *paragraph* is unreadable alone — "there was no significant main effect
  (p = 0.43)" of what, in whom — because the surrounding prose carries the subject. An abstract is
  written to be read detached from the paper. Restricting to the declared results section is what
  stops the agent reaching past a null finding for the livelier sentence in the discussion, and there
  is a mutation test that demonstrates the optimistic conclusion becomes quotable the moment the
  restriction is dropped.
- **A quotation is never truncated, not even on a clause boundary.** An abridged sentence inside
  quotation marks is a misquotation, so an over-long sentence is refused and the line falls back.
  `QUOTE_MAX_CHARS` is derived from the shortest frame rather than hardcoded, and no composed line
  can contain an ellipsis.

### Thresholds, graded at EXP-013's reading on 2026-09-26

| # | Threshold | Fails if |
| --- | --- | --- |
| **Q1** | every quotation published in the window is a verbatim substring of the source's abstract, checkable by a reader against the linked page | one quotation is not verbatim → revert the change, retract the item |
| **Q2** | every published line states that the sentence is the source's, not the agent's | one line is readable as the agent's own prose → revert |
| **Q3** | no published line contains a truncated sentence or an ellipsis | one does → revert |
| **Q4** | where no sentence qualifies, the line falls back to the provenance-only form and the run log names the clause that refused | a quotation appears that no clause admitted, or an absence is recorded without a reason |

**Q1–Q3 are absolute rather than rates**, which is deliberate and is the shape
[L-70](LESSONS.md) argues for: a misquotation is not a tolerable fraction of a feed.

### What this does not fix, recorded now rather than discovered later

**One sentence from a paper reporting many outcomes is a selection, and a selection can mislead by
omission even when every word is the authors'.** Three things bound that and none removes it: the line
labels the quote as one sentence rather than as a summary, the item carries the link, and the ranking
prefers the sentence carrying the most reported statistics — which in a structured results section is
normally the primary outcome. The honest reading is that quoting is better than paraphrasing, **not
that it is safe.**

**It does not reach item 280.** The operator plane publishes, retracts and restores; it has no
`why`-update path, and adding one is a `src/` change inside EXP-011's window for a single row. Item 280
keeps the provenance-only line and stands as the record of the limitation this discharges.

**It is not demand.** `followers` is **0**. A better line on an unfollowed feed is a better line on an
unfollowed feed.

### EXP-013 — quotation: interim record, 2026-09-12 (run 154). NOT a graded reading; Q1–Q4 are read on 2026-09-26

Three live screens against Europe PMC, one publication, and the rule was wrong on its first screen in a
way that reached no reader.

| Screen | Run | Screened | Rejected | Selected | Deferred | Quotation on the top selection |
| --- | --- | --- | --- | --- | --- | --- |
| 1 — rule as shipped (`687c631`) | [34687978960](https://github.com/in-c0/tuned/actions/runs/34687978960) | 35 | 10 | 9 | 16 | **a methods sentence — wrong; nothing published** |
| 2 — corrected clause (`fa5d467`) | [34688153865](https://github.com/in-c0/tuned/actions/runs/34688153865) | 35 | 10 | 9 | 16 | the reliability result, 218 chars, verbatim confirmed |
| 3 — publishing | [34688223326](https://github.com/in-c0/tuned/actions/runs/34688223326) | 35 | 10 | 9 | 16 | **item 281 published**, HTTP 201 |

**THE FIRST LIVE SCREEN QUOTED A METHOD.** The line it composed was, verbatim and faithfully:

> "Reliability was assessed by ICC(A,1) with 95% CIs, SEM, MDC 95 , CV%, and Bland-Altman analysis."

It passed because the quotation clause borrowed `STATISTIC_SIGNATURES`, which matches `ICC` and `95% CI`
as strings. That is the correct question for the bar — *does this paper report statistics at all* — and
the wrong one here, where the question is *does this sentence report a result*. **It is run 153's scope
bug exactly one layer in**: there, a term describing a method satisfied a clause meant to ask about
whom; here, a term naming a method satisfied a clause meant to ask about an outcome. [L-72](LESSONS.md).

It is also **worse than the line it would have replaced**, which is why it mattered rather than merely
being thin: the provenance-only form claims only to describe screening, while a sentence in quotation
marks makes a claim about its own significance.

Corrected in [`fa5d467`](https://github.com/in-c0/tuned/commit/fa5d467): a separate table in which
**every pattern binds a digit** (asserted as a property of the table, so a later addition cannot
reintroduce a bare procedure name), outright refusal of sentences whose subject is the analysis
pipeline even when they carry a real number, and refusal of quotes carrying the fingerprints of
stripped inline markup — `MDC<sub>95</sub>,` arrives as `MDC 95 ,` and reads as a transcription error,
which is corrosive in precisely the change that asks a reader to trust a quotation.

**Two defects the tests found and reading did not**, both in the new table: a bound (`η² < 0.09`) is as
much a reported value as an equality, and `95%` inside "95% confidence intervals" was matching the
magnitude pattern — so every sentence merely *naming* an interval looked like one that reported a value.

**THE BAR WAS NOT TOUCHED, AND THE EVIDENCE IS IN THE TABLE ABOVE.** All three screens report
byte-identical counts. The claim "only the line changed" is therefore a measurement, not an assurance.

**Q1 — verbatim.** Satisfied for item 281: `selectQuotation` confirmed the 218-character string is an
exact substring of the abstract, the run log records it, and a reader can check it against
[the article](https://doi.org/10.3390/s26154914).

**Q2 — attribution.** Satisfied: the published line reads *"… — the source's own words, quoted by
@sportstech."* Every rung of the frame ladder carries "the source's own words"; the handle drops off the
shortest rung and the attribution does not, because the page and the RSS channel already name the agent
on every item and nothing but this line can say who wrote the sentence.

**Q3 — no truncation.** Satisfied for item 281 (269 characters composed, inside the 280 budget, on the
third rung). The general guarantee is structural rather than observed: `QUOTE_MAX_CHARS` is derived from
the shortest frame, and a quotation that does not fit falls back instead of being abridged.

**Q4 — a refusal is a reason.** Satisfied in form: six clause names, one reported per refusal, printed
in every screen's log. **Not yet exercised on a published item**, because the top selection on screens 2
and 3 did carry a quotation. The first screen is the only evidence so far that the refusal path runs at
all, and it refused the *wrong* sentence for the *right* reason only after being corrected.

**Threshold 3 (provenance on both surfaces) re-graded with item 281 on it.**
[qa-browser 34688324375](https://github.com/in-c0/tuned/actions/runs/34688324375) — **17 passed / 1
skipped**, header *"EXP-008 threshold 5 — @sportstech, 8 nominated find(s)"*, including *"item 281
appears on the HTML feed, on a page that declares itself an AI agent's"* at both viewports and the RSS
route. Contamination: `mutatingRequests: 0`, `rowsInserted: 0`, `campaignTagsExercised: 0`.

**Threshold 4 still cannot be met** — the schedule is disarmed under Fork B, so freshness still depends
on a person dispatching. Items 280 and 281 are both **capability**, not cadence.

**Nothing commercial moved and nothing is claimed.** `applications` **0** · `members` **1** ·
`members_ever_active` **0** · `followers` **0** · gross cash **AUD $0**. `public_items` **18 → 19**,
which is supply.

### EXP-013 — correction: interim record, 2026-09-13 (run 155). NOT a graded reading; Q1–Q4 are still read on 2026-09-26

**The limitation this discharges is the one run 154 wrote down and could not close:** *"An agent on Tuned
can publish and retract, but never amend. Item 280 keeps its screening-log line permanently… On a product
whose central claim is provenance, 'the agent cannot correct its own public account of why it selected
something' is a real limitation."* The capability exists now. **It was used, and it corrected nothing.**

| Dry correction | Run | Sentences considered | Outcome |
| --- | --- | --- | --- |
| 1 — rule as shipped | [34722373207](https://github.com/in-c0/tuned/actions/runs/34722373207) | 3 of the whole abstract | **a methods sentence carrying its own section label — wrong; nothing sent** |
| 2 — corrected clauses (`4749912`) | [34722784224](https://github.com/in-c0/tuned/actions/runs/34722784224) | 3, results section only | refused: `reported-value` 2, `length` 1 |
| — | [34722924308](https://github.com/in-c0/tuned/actions/runs/34722924308) | — | **HTTP 503 from Europe PMC**, exit 1, nothing sent |
| 3 — with budget attribution (`d7893e8`) | [34723050831](https://github.com/in-c0/tuned/actions/runs/34723050831) | 3, results section only | refused; **"not the mark's doing"** |

**THE FIRST LIVE CORRECTION COMPOSED A METHODS SENTENCE.** Verbatim:

> "Methods Thirteen male soccer players (16.2 ± 0.3 years, BMI = 24.5 ± 1.5 kg/m2) completed a
> counterbalanced crossover study, performing on separate visits three WBV protocols: (P1) 1 x 3 min,
> (P2) 3 x 1 min, and (P3) 6 x 30 s."

Two clauses existed to refuse precisely this and both were walked past — one because the abstract labels
its sections without colons so the results restriction never engaged, the other because a parenthetical
sat between the noun and its verb. **[L-73](LESSONS.md)**, and the shape worth naming is *a restriction
that fails open*: when the label pattern matched nothing, the pool silently widened to the whole abstract
and the log said nothing was wrong.

**Q4 IS EXERCISED FOR THE FIRST TIME.** Run 154 recorded it as *"satisfied in form and unexercised in
fact — the refusal path has never produced a published item with the fallback line"*. It still has not
produced a published item, and that is now for a better reason: a real record was screened, every
sentence was refused, **each refusal named its clause with a count**, and the item kept the line it had.
An absence with a reason is what Q4 asks for.

**Whose refusal it was, answered rather than assumed.** A correction is held to **257** characters against
a publication's **280**, because the operator plane appends its own `(corrected YYYY-MM-DD)` mark. So a
refusal could mean the abstract carries no checkable finding, or that it carries one and the 23 characters
spent on the mark excluded it — a cost of a design decision made in this run. The diagnostic answers it
directly: **the publisher's own budget refuses this abstract too.** Item 280's results section holds three
sentences, two reporting no value a reader could check and one too long to quote whole.

> **Corrected 2026-09-13 (run 156): the third sentence is too SHORT, not too long.** The line above was
> written from a log that printed `length 1`, and `length` was one clause covering three different
> failures. Re-run under the split clauses
> ([34737237792](https://github.com/in-c0/tuned/actions/runs/34737237792), same item, same source) the
> same screen reports **`reported-value 2, too-short 1`**. The third results sentence is under
> `QUOTE_MIN_CHARS` (80) — a fragment this agent declines to call a quotation — and nothing in this
> abstract was ever over budget. The conclusion is unchanged and the item still keeps its line; the
> stated reason was wrong, and the clause that hid it is the one run 156 split. Left in place with this
> note rather than edited away, on the same rule the correction mark follows.

**What is NOT claimed.** No threshold moved. Q1–Q3 are unexercised by this run because **no quotation was
published or amended** — they remain absolute and remain read on 2026-09-26. Threshold 2's re-specification
is still a proposal awaiting the reviewer, the original stays in force as FAILED, and the schedule stays
disarmed. **The bar is untouched**: no clause, term list, threshold, ranking or query deciding *which
candidates* are selected changed — only which sentence may be quoted, and only in the stricter direction.

**What the correction route still cannot do, recorded now rather than discovered later.** It cannot change
a title, a url, a description or a category — a correction that changed which source a find pointed at
would be a different find wearing the same row. It cannot touch an item the owner hid. And it cannot
improve a line whose source has no quotable sentence, which is exactly the case it met first: **the
capability to correct is not the ability to have something better to say.**

---

### EXP-013 — the window reading, computed rather than read off by eye (2026-09-23, run 186). Interim: the window closes 2026-09-25 and the reading is still due 2026-09-26

**This is not the graded reading.** Three scheduled screens (2026-09-23, 09-24, 09-25) have not fired,
and thresholds 3, 4 and 5 are not computable from a screening record. It is thresholds 1 and 2 over
the nine screens delivered so far, taken three days early because the evidence was about to need an
instrument that did not exist.

**Why it needed one.** The evidence for thresholds 1 and 2 exists in exactly one place — the
`scout-record` artifact each `agent scout` run uploads. Nothing in this repository reads one:
[`scripts/scout-gate.mjs`](../scripts/scout-gate.mjs) says so in its own header and reads
`qa/nominations/` instead, deliberately, because the record *"needs the network and a credential."*
That is the right call for a gate that runs every cycle, and it left the **reading** — a once-only act
with a deadline — with no instrument at all. The executor session cannot fetch one either: artifact
download redirects to `productionresultssa3.blob.core.windows.net`, which this environment's egress
proxy answers with **`403 CONNECT`** (re-tested run 186, alongside `justtuned.com`). Listing works; the
bytes do not. And the artifacts expire at **90 days**, while the executor stops **2026-10-05**.

So [`scripts/exp013-window.mjs`](../scripts/exp013-window.mjs) runs inside Actions, where the evidence
is. Source: [`exp013 window` run 35818516766](https://github.com/in-c0/tuned/actions/runs/35818516766).

| date | run | screened | selected | rate | decided | rate on decided | top selection |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-09-13 | [34745731838](https://github.com/in-c0/tuned/actions/runs/34745731838) | 35 | 9 | **25.7%** | 21 | 42.9% | `scout-b2aee844368bb449` |
| 2026-09-14 | [34820950934](https://github.com/in-c0/tuned/actions/runs/34820950934) | 37 | 9 | **24.3%** | 21 | 42.9% | `scout-b2aee844368bb449` |
| 2026-09-15 | [34944645762](https://github.com/in-c0/tuned/actions/runs/34944645762) | 36 | 9 | **25.0%** | 21 | 42.9% | `scout-b2aee844368bb449` |
| 2026-09-16 | [35070858671](https://github.com/in-c0/tuned/actions/runs/35070858671) | 35 | 9 | **25.7%** | 20 | 45.0% | `scout-b2aee844368bb449` |
| 2026-09-17 | [35197138595](https://github.com/in-c0/tuned/actions/runs/35197138595) | 36 | 9 | **25.0%** | 21 | 42.9% | `scout-b2aee844368bb449` |
| 2026-09-18 | [35320189568](https://github.com/in-c0/tuned/actions/runs/35320189568) | 37 | 9 | **24.3%** | 22 | 40.9% | `scout-55f5e66dee918436` |
| 2026-09-19 | [35429540744](https://github.com/in-c0/tuned/actions/runs/35429540744) | 37 | 9 | **24.3%** | 22 | 40.9% | `scout-55f5e66dee918436` |
| 2026-09-20 | [35498118335](https://github.com/in-c0/tuned/actions/runs/35498118335) | 37 | 9 | **24.3%** | 23 | 39.1% | `scout-55f5e66dee918436` |
| 2026-09-21 | [35576567110](https://github.com/in-c0/tuned/actions/runs/35576567110) | 35 | 8 | **22.9%** | 22 | 36.4% | `scout-b2aee844368bb449` |
| 2026-09-22 | [35702095397](https://github.com/in-c0/tuned/actions/runs/35702095397) | — | — | — | — | — | **empty — the search returned no candidates, so the bar decided nothing** |

**Threshold 1 — holds on the nine screens that reached a verdict, and one screen contributes no
reading.** Every rejection names exactly one clause across all nine. The 2026-09-22 screen is the one
run 184 caught: a green run, an uploaded record, and a screening step that took 1 second against the
20–22s every working screen takes. **The record itself cannot tell that from a quiet week** — it says
`returned: 0` and nothing else, which is why `searchResponseDefect()` had to go in at the source
rather than here. What this reading can say, and does, is that the day **contributes no observation**;
it is not counted as a legitimate zero.

**Threshold 2 — FAILS on 2 of the 9 live screens**, at **25.7%** on 2026-09-13 and 2026-09-16 against
a bar of 25%. This does not change the experiment's posture: threshold 2 was already graded **FAILED**
at 25.7% on 2026-09-12 (run 153) and **Fork B was actioned the same day** — the schedule screens and
publishes nothing. What the window adds is that the failure is **narrow and persistent rather than
one bad draw**: seven of nine screens sit between 22.9% and 25.0%, and the two failures clear the bar
by a single candidate. A bar this close to the observed distribution separates almost nothing.

**The denominator objection now has its numbers.** Run 153 recorded threshold 2 as mis-specified
because *"the denominator counts candidates the bar never decided"*, and pre-committed not to rewrite
it inside its own window. That pre-commitment stands and this is not a rewrite: the decided-set rate is
reported **alongside** the pre-registered one, never in place of it. On the decided set the rate runs
**36.4%–45.0%** — a uniformly larger failure than the pre-registered reading, on every single screen.
**The objection is not that 25% is too harsh. It is that the two denominators disagree by roughly 2x
and neither has been argued for.**

**Independence — the nine live screens carry two distinct top selections, not nine.**
`scout-b2aee844368bb449` on six screens, `scout-55f5e66dee918436` on three. The agent's top pick
drifted once and drifted back. **These are not nine independent observations of the bar**, and a
reading that treated them as nine would overstate its evidence by about 4x. The mechanism is not a
defect: nothing was published, so nothing entered `publishedSources()`, so the same candidate stays
eligible and keeps winning. It is what a disarmed schedule looks like from the inside.

**Run 186's own first dispatch got the independence line wrong and it is recorded rather than
quietly corrected.** It read the identity as `record.find.key` — the label `agent-scout.mjs` *logs* —
while the record *serialises* `idempotencyKey`, so every screen came back anonymous and the renderer
printed *"carry 0 distinct top selection(s). Every screen chose the same candidate."* A sentence about
the evidence, generated from its absence. See [L-104](LESSONS.md#l-104).

**What this reading may not be used to claim.** Nothing here is demand. `followers` is **0**, and
EXP-013's own pre-registration says a green reading on every threshold leaves `applications`,
`members_ever_active`, `followers` and gross cash exactly where they are. A screening count is not an
activation, and a selection rate is not a subscriber.

### EXP-013 — threshold 4, INTERIM reading from the registry (2026-09-24, run 188). NOT graded; the window closes 2026-09-25

**Threshold 4 was recorded as not computable, and half of it always was.** Run 186's instrument drew
the line at the screening records and put threshold 4 outside it — *"graded against production"* —
which this session cannot reach (`403 CONNECT`, re-tested run 188). **That is true of the direction
that passes and false of the direction that fails.** Confirming freshness *held* needs production,
because only production knows what was serving at each moment; showing it *lapsed* needs arithmetic on
`publishedAt` timestamps already committed to `qa/nominations/`.

Source: [`scripts/exp013-window.mjs`](../scripts/exp013-window.mjs) `publicationCadence()`, offline,
no network and no credential.

| | |
| --- | --- |
| Publications inside the window | **6** (items 280, 281, 282, 283, 284, 285) |
| Newest item when the window opened | item 279, `2026-09-11T22:17:48.081Z` |
| Longest interval with no publication | **203.8h** — item 281 `2026-09-12T10:21:50.674Z` → item 282 `2026-09-20T22:07:44.418Z` |
| Pre-registered bar | **72h** |
| Scheduled screen may publish? | **no** — `PUBLISH: ${{ inputs.publish }}`, and a schedule event carries no inputs |

At the instant before item 282, `@sportstech`'s newest item was **203.8h old — 2.8x the bar**,
whatever production says. **A bar can be failed from the repository and can only be passed from the
site.**

**This is not graded here.** EXP-013 states that no threshold is graded before the window closes
**2026-09-25**, and the reading falls due **2026-09-26**. The section is marked INTERIM, assigns no
fork, and **re-specifies no threshold** — run 153's pre-commitment binds run 188 as it bound 179–187.
The bar, `gradeMetadata`, `agent-scout.yml` and the schedule are **byte-untouched**, and thresholds 1
and 2 compute exactly as they did.

**And the number is not an observation about the agent — this is the finding.** Threshold 4's second
clause is *zero hand publications*. With the schedule disarmed there is no other kind: every one of the
six publications required an explicit dispatch by someone who had read the screening record. That
disarming is **Fork B, actioned 2026-09-12 — the window's first day** — because threshold 2 failed at
25.7%.

**Fork B's action and threshold 4 are mutually exclusive.** Once the publisher is off, threshold 4 can
only fail, and it fails **whether the bar is good or bad**. A reading that reports *"threshold 4
failed, so the cadence still depends on a person"* presents a **tautology as evidence about the
agent**. It is evidence about the experiment. The 2026-09-26 reading must record it that way.

**No fork covers what actually happened, and that is registered now rather than decided on the day the
numbers are known.** Fork A is all-hold, B is threshold 2, C is threshold 5, **D requires threshold 2
be *"vacuous because nothing was ever selected"***, E is the source refusing. What happened is that the
bar **selected ~9 of ~37 on every live screen and published none of it**, because Fork B had already
turned the publisher off ([L-97](LESSONS.md#l-97)). Plenty was selected, so **not D**; Europe PMC
answered, so **not E**. A pre-registration can be complete on its thresholds and still have **no fork
for the state its own remedy creates**. No fork is invented here to fill the gap — inventing one two
days before the reading, with the numbers already visible, is the thing pre-registration exists to
prevent. It is named so the reading confronts it.

**What this reading may not be used to claim.** Nothing here is demand, and a publication interval is
not a subscriber. `followers` is **0** and gross cash is **AUD $0**, from *no billing exists*. See
[L-106](LESSONS.md#l-106).
