# Tuned — LESSONS

Append-only learning ledger. **Add an entry only after a real mistake, failed attempt, invalid
assumption, or avoidable cost** — not after an ordinary successful run. Consolidate related incidents
into one lesson rather than narrating every occurrence. Link outward to
[DECISIONS.md](DECISIONS.md), [EXPERIMENTS.md](EXPERIMENTS.md), commits, runs and issue comments
instead of reproducing them.

Each entry: **problem · attempt · mistake · why · evidence and cost · lesson · more elegant next
attempt · prevention check.**

---

## L-01 — The build gate was broken on a fresh clone, and only a fresh clone could see it
*Backfilled 2026-08-08 from run 1 (2026-08-06).*

- **Known problem:** connect Cloudflare Workers Builds so pushes to `master` deploy.
- **Attempted approach:** treat the missing Git integration as the whole blocker and hand it to the owner.
- **Mistake:** nobody ran the actual build command in a clean environment. `npm ci && npm run check`
  exited 2 — `tsconfig.json` required `worker-configuration.d.ts`, which `wrangler types` generates
  and `.gitignore` excludes. It existed only on machines where someone had run it locally.
- **Why it happened:** the repository was only ever built where its own side effects had already run.
  Developer machines are stateful; build runners are not.
- **Evidence and cost:** run 1; connecting the integration would have produced a permanently failing
  build presenting as a Cloudflare fault. Caught before that, at the cost of one cycle.
- **Lesson:** **a gate you have never executed in a clean environment is not a gate.** Gitignored
  generated files are the usual culprit.
- **More elegant next attempt:** make the build generate its own inputs (`check` now runs
  `wrangler types` first) rather than committing a placeholder that drifts.
- **Prevention check:** `.github/workflows/check.yml` runs the exact deploy build command on every PR
  from a clean checkout.

## L-02 — An autonomous loop that ships by pushing, and wakes on pushes, has no stopping point
*Backfilled from runs 3 and 6 (2026-08-06/07). Consolidates the self-sustaining trigger and the duplicate-session incidents.*

- **Known problem:** let the executor continue work without waiting for the next scheduled run.
- **Attempted approach:** fire a new session on every successful check run for a push to `master`.
- **Mistake:** the executor's normal output *is* a push, so the trigger fed itself:
  push → check → fire → push. Three fires in six minutes; two sessions deploying to production
  concurrently; two writers on the same durable ops files, resolved only by a rejected non-fast-forward
  push. Separately, two independent triggers (schedule + `issue_comment`) implemented the *same*
  directive twice, then the same follow-up fix twice (#7/#8, #9/#10).
- **Why it happened:** the intended bound was the executor's own judgement about when to stop.
  Judgement is not a control. And nothing in issue #1 distinguished "unclaimed" from "already
  being worked", so two sessions reading identical state made identical choices.
- **Evidence and cost:** run 3 sessions A/B; run 6 sessions A/B; `4c43f9e`. Cost: duplicated
  inference, two concurrent unattended deploys, discarded work.
- **Lesson:** **bound autonomy with a mechanism, not an intention** — and when concurrency is possible
  at all, publishing intent must precede acting on it.
- **More elegant next attempt:** push-driven continuation now defaults closed and requires an explicit
  opt-in marker in the head commit; a `<!-- tuned-run-claim -->` comment claims a directive before work
  starts; duplicates resolve by *earliest opened wins* — a symmetric rule both sides can apply without
  communicating.
- **Prevention check:** re-read issue #1's newest comments before selecting an action; if a claim is
  newer than the latest directive, stand down or choose disjoint work.

## L-03 — A freshness check that stops discriminating silently keeps passing
*Backfilled from run 6 (2026-08-07).*

- **Known problem:** verify production *after* a deploy, not before it.
- **Attempted approach:** `sleep 120`, then wait for `/api/metrics` to stop returning 404.
- **Mistake:** that proved freshness for exactly one deploy — the one introducing the route. From
  `feb6c4f` on, every version had it, so the gate passed instantly against whatever was already
  serving, and the health steps beneath it graded the **old** Worker while reading as confirmation of
  the new one.
- **Why it happened:** the check tested a property that was true of the new version *and soon of all
  versions*, instead of testing identity.
- **Evidence and cost:** the old gate was reconstructed and run against a stale-but-healthy version —
  it printed `deploy is live` and exited 0. Every "verified green" claim since `feb6c4f` had rested on
  a fixed sleep, including two readings used to diagnose the missing `METRICS_KEY`.
- **Lesson:** **verify identity, not liveness** — and an unverifiable deploy must be treated as a
  failed one. A green health result on an unknown version is worse than no result.
- **More elegant next attempt:** stamp the build commit into the Worker at build time, expose it at
  `/api/version`, and poll until it equals the pushed SHA; fail closed after 8 minutes with the health
  steps skipped.
- **Prevention check:** the gate script was run against 8 stubbed production states — old version,
  wrong SHA, `unknown` stamp, empty body, HTML error page, total curl failure all fail closed.

## L-04 — GitHub's response to an unparseable workflow is silence
*Backfilled from run 6 (2026-08-07).*

- **Known problem:** ship the verification workflow above.
- **Attempted approach:** embed a multi-line Python script inside a `run: |` block.
- **Mistake:** continuation lines at column 0 ended the YAML block scalar. `b8a1277` shipped a
  workflow that did not parse — and GitHub simply stopped running it, reporting an *absence* rather
  than an error.
- **Why it happened:** invalid CI config fails outside the system that would have caught it; there is
  no run to be red.
- **Evidence and cost:** `8fc52ce` (#9) fixed it and gated the class. Cost: a verification gap where
  the loop believed it had a verifier.
- **Lesson:** **a missing signal is a signal.** Absence of a run is a failure mode, not a quiet pass.
- **More elegant next attempt:** keep multi-line scripts out of inline `run:` blocks, and lint workflow
  YAML in CI so the break surfaces as red rather than as nothing.
- **Prevention check:** after touching any workflow, confirm a run actually appears for the pushed SHA
  — do not infer from the absence of failures.

## L-05 — This loop's instruments mislead more often than its product does
*Backfilled from runs 6 and 9 (2026-08-06/07).*

- **Known problem:** read whether a workflow run succeeded.
- **Attempted approach:** trust `get_check_run` / `list_workflow_jobs` status.
- **Mistake:** the Actions status API reported a finished job as `in_progress` for ~15 minutes; a claim
  was made from the stale status and corrected within the hour. Separately, run 6 recorded
  "push-triggered runs are not firing" as a standing constraint from one night's observation; runs 7
  and 8 both saw them firing and neither retired it, so a false constraint instructed sessions for
  three runs.
- **Why it happened:** single readings from an eventually-consistent API, promoted to durable facts.
- **Evidence and cost:** the job log endpoint 404s until a run genuinely completes, which makes it the
  reliable source; `7753eeb` retired the false constraint with run-list evidence inline.
- **Lesson:** **never conclude from one reading of an instrument, and prefer a test that discriminates
  between two named outcomes.** Constraints written into durable state must carry their evidence, so a
  later session can retire them.
- **More elegant next attempt:** read run results from the job log; when recording a constraint, record
  what observation would falsify it.
- **Prevention check:** before acting on a standing constraint in NORTH_STAR.md, re-test it if it is
  cheap to re-test.

## L-06 — A two-sided secret fails identically for three different reasons
*Backfilled from runs 5, 11 and 12 (2026-08-06 → 2026-08-08). This is the loop's longest-running blocker.*

- **Known problem:** the executor cannot read `/api/metrics` without `METRICS_KEY` set in two stores.
- **Attempted approach:** report "the owner hasn't set the secret" off an unauthenticated status code,
  repeatedly.
- **Mistake:** three distinct states — secret absent (503), secret present but never rolled into a
  deployed version, secret present but different from GitHub's (401) — were collapsed into one
  narrative for several runs. Eleven runs reported "not set" off a 503; the state had already moved.
- **Why it happened:** the verifier printed the *unauthenticated* status, which cannot distinguish a
  wrong key from a matched one. The loop watched the wrong signal.
- **Evidence and cost:** run 5 (503, redeploy diagnostic); run 11 (401 — key live, values disagree);
  run 12 (`68cd28d` trims both sides, eliminating whitespace as a cause; snapshot still 401, so the
  values genuinely differ). Cost: ~4 cycles, no baseline for 3 days.
- **Lesson:** **when a secret is provisioned in two places, the only meaningful test is an authenticated
  one** — and design the surface so distinct failures stay distinguishable (`503` = unconfigured,
  `401` = wrong). Note the asymmetry: HTTP strips surrounding whitespace from a header value in transit
  (RFC 9110 §5.5) but a secret store retains it, so `echo v | wrangler secret put` can produce a key no
  client can ever match.
- **More elegant next attempt:** provision both stores from **one** read of one value in a single
  authenticated shell (`printf %s "$K" | ...` to both), rather than pasting twice and hoping.
- **Prevention check:** use `keyMatches()`/`keyConfigured()` for any new key-gated surface; never
  compare `c.env.<KEY>` directly. Never print, hash, inspect or rotate a secret to diagnose it.

## L-07 — Fourteen reports to an unread channel look exactly like a blocked loop
*Backfilled from runs 9–14 (2026-08-07/08).*

- **Known problem:** an owner-side blocker the executor cannot clear.
- **Attempted approach:** write the blocker, clearly and at length, into issue #1 every run.
- **Mistake:** the same blocker was re-described to the same private surface fourteen times over three
  days. The loop modelled this as "owner hasn't acted" when the better-supported reading was "the
  message isn't arriving".
- **Why it happened:** from inside the loop, an undelivered message and an ignored one are
  indistinguishable — and re-reporting *feels* like diligence.
- **Evidence and cost:** run 14 escalated once to push/email; the escalation cost nothing and should
  have happened around run 9. Cost: up to ~3 days of no baseline.
- **Lesson:** **after two unchanged blocker cycles, stop re-describing it — escalate once through an
  authorized channel, then suppress repeated reports and stand down until state changes.** Repetition
  is not persistence.
- **More elegant next attempt:** first report → full detail; second → unchanged, one line; third →
  escalate on a different channel; thereafter → silence until state changes.
- **Prevention check:** before writing a blocker section, compare it to the previous run's. If it is
  the same, escalate or shorten — do not restate.

## L-08 — Control-plane work is the easiest thing to keep choosing
*Backfilled 2026-08-08, spanning runs 1–14.*

- **Known problem:** find real paid demand within 60 days.
- **Attempted approach:** fix the build gate, add CI, add telemetry, add tests, add version stamping,
  add trigger guards, add claim protocol, patch an advisory — then wait on one secret.
- **Mistake:** by day 3, **zero** distribution had been attempted, zero payment capability existed, and
  the funnel had never been read. Most of the work was genuinely necessary and each step was locally
  justified; the aggregate still spent the scarce resource — days — on the machine that produces
  evidence rather than on evidence.
- **Why it happened:** control-plane work is always available, always passes its own gates, and always
  feels like progress. Demand work is blocked, external, and needs someone else's authorization.
- **Evidence and cost:** METRICS.md records every funnel metric UNMEASURED over zero UTC dates; gross
  cash AUD $0 with no billing path; EXP-002 pre-registered but unpublished. Loop ends 2026-10-05.
- **Lesson:** **stop improving the control plane once it is adequate for the next demand experiment.**
  Adequate, not good. Prefer the simplest externally falsifiable test over another internal guarantee.
- **More elegant next attempt:** when the next-best action is control-plane work, first name the demand
  experiment it unblocks and check whether that experiment could run without it.
- **Prevention check:** STATUS.md carries a single active objective and an explicit "not doing" list;
  the nearest milestone in MILESTONES.md must be a demand or measurement outcome, never a tooling one.

---

## L-09 — Two explanations that produce the same number are one unanswered question

- **Problem.** `0 applications / 115 landing views` was treated for two runs as *the conversion
  problem*, and the next candidate proposed against it was a CTA-reach counter and, behind that, a
  message change.
- **Attempt.** Run 18 asked instead whether the apply path physically works, by driving a real
  browser at production from Actions and intercepting the submit before it could mutate anything.
- **Mistake this avoided, stated as the lesson rather than as a near-miss.** A broken form and an
  unpersuasive offer produce **byte-identical funnel data**. Every instrument the loop had proposed
  measured the *second* explanation while assuming the first away. A copy experiment run first would
  have "failed", and the failure would have been unattributable: the message might be fine and the
  form broken, or the reverse, and no counter added to that page could tell the two apart afterwards.
- **Why it happens.** Instrumenting is the move that feels like progress, and the loop already owns
  the tools for it. Asking "does the thing physically work?" feels beneath the question — until you
  notice nobody has ever checked.
- **Evidence and cost.** EXP-003, [run 31251303499](https://github.com/in-c0/tuned/actions/runs/31251303499):
  criteria 2–6 all passed **at the first attempt**, at both widths. The mechanism was never broken —
  so the day of instrumentation queued behind it would have measured a non-problem. Cost of finding
  out: one dispatch, ~11 seconds of browser time, zero rows written. The same run also surfaced a
  real first-party 404 nobody was looking for.
- **Lesson.** When two hypotheses predict the same observation, the next action is **not** a better
  measurement of one of them — it is the cheapest experiment that can *distinguish* them. Prefer the
  one that tests the physical, falsifiable half first: it is usually faster, and a pass makes the
  remaining hypothesis sharper rather than merely more likely.
- **More elegant next attempt.** Before instrumenting a funnel stage, write the two sentences that
  would both explain the current number. If a proposed instrument cannot separate them, it is the
  wrong instrument no matter how cheap it is.
- **Prevention check.** For any experiment: *if this returns the result I expect, which competing
  explanation does it eliminate?* If the answer is "none", do not run it.

## L-10 — An experiment that writes into its own measurement is worthless, so make that structural

- **Problem.** EXP-003 had to submit an application to test the application path — against the exact
  counter (`application_submit`) whose value at 0 is the finding under study.
- **Attempt.** The submit was intercepted inside Chromium and fulfilled locally, so it never reached
  the Worker; the only live request was a deliberately invalid email the route rejects with 400
  *before* both the `INSERT` and the counter; and the harness announced a headless user-agent so its
  own landing views were classified as `landing_view_bot`.
- **The part worth keeping.** The contamination controls were **verified against a real D1 before the
  test ever ran against production**, not asserted in a comment: after 5 harness page loads and 2 form
  submissions on a local build, `waitlist_rows 0 · application_submit 0 · landing_view 0 ·
  landing_view_bot 5`. Both production runs then reported the same three zeros.
- **Why it matters here specifically.** This loop's one durable asset is a funnel whose numbers can be
  believed. A single test row in `waitlist` would have made "0 applications" permanently ambiguous —
  and no later run could have distinguished the loop's own row from a real one.
- **Lesson.** When a test must exercise the thing it measures, design the *isolation* first and prove
  it on a real datastore, then run against production. A comment claiming "this doesn't write" is not
  evidence; a query returning zero is.
- **More elegant next attempt.** Give every QA harness a contamination block in its output — what it
  wrote, what it incremented, how its traffic is classified — so the answer is in the log rather than
  in someone's memory of the design.
- **Prevention check.** Before pointing any harness at production: *which counter or table could this
  touch, and what query proves it did not?*

## L-11 — A claim you are about to ask someone else to make in public is yours to check

**Where it came from:** run 19, EXP-004.

The Show HN packet sat ready for nine runs containing this sentence: *"[DEMO_FEED_URL] is a live
feed, and every feed has open RSS."* Three runs re-read that packet, judged it ready, and escalated
it to the owner. **None of them noticed that nobody had ever checked the sentence** — nor that the
packet still contained a blank the owner was expected to fill by hand from a page the executor
could not see.

The reason is not carelessness, and that is what makes it worth writing down. The sentence was
unverifiable when it was written: egress to justtuned.com was blocked, and run 9 correctly refused
to guess a handle into a post about to carry someone else's name. **The flaw was that "I cannot
check this" quietly became "this is fine" as the packet was handed forward.** An unverifiable claim
does not become verified by being restated in three consecutive reports; it just stops looking like
a question.

It cost one dispatch and nine seconds of browser time the moment the capability existed — a
capability that had existed for **fourteen minutes** when this run started, built for an unrelated
purpose.

**The rule:** when the loop is about to ask a human to say something publicly in their own name,
every factual claim in that text is the executor's to verify or to visibly mark unverified — and
when a blocked check is what forced the deferral, the check goes on a list that is re-read whenever
the environment changes. **A new capability is a prompt to re-ask what was previously unanswerable,
not only a tool for the question that motivated it.**

Corollary, learned the same run: leaving a `[TOKEN]` in a deliverable is a debt, not a handoff. It
looks like collaboration and reads like an unfinished job.

## L-12 — A green instrument and a reachable subject are two different assumptions, and only one of them was ever checked

**Where it came from:** run 25, the 2026-08-10 edge-challenge incident.

For nineteen runs this loop treated GitHub Actions as *the* production vantage point, because the
executor's own egress to justtuned.com has been blocked since run 1. That was a sound workaround and
it worked. What went unexamined is that it left the loop with **one** eye — and no way to tell the
difference between "the instrument broke" and "the subject became unreachable".

On 2026-08-10 both readers went red within 20 minutes of each other. The natural reading, and the
one the reviewer directive encoded, was an access regression *between GitHub and Cloudflare* — a
request-contract defect on our side. It was not. A managed challenge had been switched on for the
whole zone, and it was refusing **everything**: our verifier, our snapshot, open RSS, and a real
Chromium on `GET /` at both widths. The instrument was fine. The site was dark.

**What made the difference was costing one dispatch:** pointing the existing browser harness at
production *before* building the fix. That took 48 seconds and turned "our CI is broken" into "our
public site is refusing real browsers" — a different severity, a different owner action, and a
different answer to whether the Show HN post should go out.

**The rule:** when every instrument aimed at a subject fails at once, the first hypothesis is not
that every instrument broke — it is that the subject changed. Test the subject with the most
*unlike* instrument available before believing a diagnosis about the instruments. Two readers that
share a network path and a client library are one observation, not two.

**Prevention check.** Before accepting "our checks are broken": *what is the least-similar client I
can point at this, and what did it see?*

**Second, smaller lesson from the same run, worth separating out.** The directive proposed fixing
the 403 with "a shared explicit request contract (for example User-Agent/Accept/cache headers)".
Built honestly — a named first-party monitor linking to this repository — that contract changed
nothing: bare and contract variants both returned 403. Built dishonestly, a borrowed browser
user-agent might well have worked. **That a workaround exists is not an argument that it is
available.** Passing a security control by disguise would have evaded a control the owner enabled,
hidden the incident from the very dashboard meant to surface it, and left the request looking
legitimate the next time something was genuinely wrong. The correct output of a blocked fix is an
accurate escalation, not a quieter symptom.

## L-13 — An outage takes away more than the thing it breaks, and the second loss is the quiet one

**Where it came from:** run 26, the day after the 2026-08-10 edge challenge began.

The visible cost of the challenge was obvious and got all the attention: the public cannot reach
Tuned. The cost nobody named for a full run is that the loop **also lost the ability to verify its
own deploys** — and it kept deploying. `16d522b` changed the address printed on the public terms and
privacy pages, shipped, and was recorded as *"unverified, not green"*. That was honest. It was also
left there, as a fact about the incident rather than a problem with a fix.

There was a fix, and it had been sitting in `wrangler.jsonc` the whole time. `workers_dev: true`
means the same Worker answers on a second route that is not inside the challenged zone. Run 25
looked straight at it, tested it **from the executor** — where egress has been blocked since run 1 —
found it blocked, and wrote *"I could not check it myself."* True, and beside the point: the loop had
not read production from the executor in nineteen runs. Every production fact it holds came from
GitHub Actions, which has egress, and which was never asked.

**The rule:** when an incident disables a capability, list what *else* went dark with it and fix the
recoverable ones — degraded is not the same as gone. And when a check is refused, re-ask it from
every vantage point you own before recording it as impossible. "I could not check it" is a statement
about a client, not about a question.

**The trap to avoid while doing it.** The restored path must not quietly widen what a green result
claims. Reading health from the origin proves the code is deployed and behaving; it proves nothing
about whether anyone can reach the site. So `vantage` returns the zone's state as a separate fact and
`verify production` grades on it **last**, in a step that can fail a job in which every other check
passed. A restored instrument that reports a healthy Worker as a healthy site would be worse than the
outage — the outage at least announced itself.

**Prevention check.** After any incident: *what capability did this quietly remove, and is it
recoverable from a vantage point I already own — without changing what a pass means?*

## L-14 — A defence that filters by "is this a bot" filters out whatever your product is made of

**What happened.** Cloudflare Bot Fight Mode was switched on for `justtuned.com` around 2026-08-10
06:53 UTC. The loop spent three runs (25, 26, 27) treating it as a public-availability outage —
*"the public still cannot reach Tuned"* — escalated it as the top blocker, displaced the Show HN
paste behind it, and pushed the owner about it once. When the owner supplied the firewall export,
323 challenges in 24 hours resolved to: 322 from Azure (GitHub Actions), 1 from Alibaba, **none from
a consumer ISP**. 135 of the 323 were Tuned's own verifier, `curl` and QA browser challenging
themselves. The humans were probably never affected.

**The first mistake was reading a control's *intent* off its *effect on us*.** Every client the loop
owns runs in a datacenter, so every client the loop owns was challenged, so the loop concluded
everything was challenged. The instruments were a biased sample of exactly the population the rule
targeted, and nothing in the evidence chain flagged that — "a real headless Chromium got 403" reads
like a statement about browsers and was actually a statement about Azure IP ranges.

**The second mistake is the one worth carrying forward, because it points the other way.** While the
severity was overstated, the *importance* was understated. `/ava/rss.xml` was challenged 12 times, and
open RSS plus agent fetchers are not a peripheral integration for Tuned — they are the doctrine made
concrete. Hosted feed readers and agent fetchers originate from datacenter IPs, so a bot filter cannot
distinguish a subscriber's Feedly from a scanner. Bot Fight Mode did not degrade the product; **it
deleted the product's primary surface while leaving the marketing site apparently fine.** The
dashboard-visible symptom and the commercially important symptom were different symptoms.

**The rule.** Before treating any traffic filter as neutral hardening, ask what fraction of *intended*
users it classifies as the thing being blocked. For a product whose users are programs, "block
non-browsers" is not a security setting, it is a product removal. And when a control appears to break
everything, check whether "everything" is just everything you happen to own — the population your
instruments sample is rarely the population your users belong to.

**Corollary, for severity claims specifically.** A severity that was inferred from your own tooling's
experience should carry that provenance in the sentence, not just in the reasoning behind it. *"Every
path we can test returns 403"* was true and was read by three runs as *"every path returns 403."* The
words that would have prevented a week of misdirection were already available: **say who was refused,
not just what.**
