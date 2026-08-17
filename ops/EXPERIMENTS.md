# Experiments log

Append-only. One entry per bounded experiment. Required fields: hypothesis, baseline, change, success threshold, result, decision. Never record a result that is not sourced from real data.

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

**Post-window bracket result (2026-08-17):** *NOT YET RUN at the time this rule was committed.* The
dispatch follows this commit; its run link, the build `/api/version` reports as serving, and the
observed statuses are written into this section from the run's own log when it returns — pass or
fail, and a fail sends the rule to its second branch.

Contamination from that bracket, declared before it is read: on UTC day **2026-08-17** only,
`landing_view_bot`, `landing_engage_bot` and `application_start_bot` — bot-classified by the
`HeadlessChrome` user-agent, so they enter neither the human-flagged counters the forks read nor the
day (08-16) they read. `applications` untouched, still 0.

- **Result (source-linked):** PENDING — the complete UTC day 2026-08-16 is not yet readable from a
  scheduled snapshot; the 08-17 scheduled snapshot (20:40 UTC) is the read. The apparatus is verified
  live at 2026-08-15 10:11 UTC and byte-identical across the window; the far-side bracket is
  dispatched immediately after this commit.
- **Decision:** pending the reading above.

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

**Publication is blocked until [EXP-007](#exp-007--is-there-a-human-on-the-other-side-of-the-landing-page-2026-08-15-run-43)'s
first complete-UTC-day snapshot — UTC day 2026-08-16, read from the scheduled 08-17 snapshot — is
committed and graded.** EXP-007 grades the landing surface; a publication that changes what the
landing demo shows inside that window would confound the first and only clean reading of it. This is
a scheduling constraint, not a threshold, and it is not gradeable as a fork.

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

- **Result (source-linked):** NOT STARTED — adoption only this cycle; publication is gated on
  EXP-007's first complete-day reading.
- **Decision:** pending.
