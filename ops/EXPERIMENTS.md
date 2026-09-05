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
  maintainer who never merges an entry has told us nothing about strangers.
- **Fork E — inadmissible on the URL.** The listing merges but the merged entry's URL does not carry
  `?src=awesome-rss-feeds` — a maintainer normalising the URL is an ordinary thing to do. *Reading:*
  the attempt is real but ungradeable by this instrument; `feed_fetch:sportstech` against its Reading-1
  band is the only remaining evidence and it is weaker. **The merged entry's exact URL must be checked
  before grading, and Fork E must not be reported as Fork C.**

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
