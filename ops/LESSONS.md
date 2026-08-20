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

## L-15 — `git fetch` does not move the branch you are standing on, and a stale base invents findings

**What happened.** Run 30 ran `git fetch origin master`, watched it report
`6c63da0..32f8ac2  master -> origin/master`, and read that as "the repo is current." It was current —
`origin/master` was. The **local** `master` ref was still at `6c63da0`, the bootstrap commit from five
days earlier, because a fetch updates remote-tracking refs and nothing else. `git rev-parse HEAD
origin/master` had agreed, which made the tree look right; local `master` was never in that comparison.

Branching with `git checkout -b <new> master` then cut from the five-day-old commit **and reverted the
working tree to it.** The dependency bump under test was applied to that tree.

**The finding it manufactured.** `npm audit` against the stale base reported a **moderate advisory in
`hono`** — a *production* runtime dependency, and therefore exactly the kind of result that would have
outranked the dev-toolchain work and redirected the run. It was an artifact: `6c63da0` declares
`hono ^4.6.0`, which resolves into the vulnerable range, while real master pins `^4.12.34` and is
clean. Had it been believed, the run would have shipped a "production security fix" for a
vulnerability production never had, and the report would have claimed a risk reduction that never
existed.

**What actually caught it** was not vigilance about git. It was an inconsistency too small to explain
away: the installed tree disagreed with the lockfile — `npm ci` had produced `wrangler@4.119.0` while
`git show master:package-lock.json` said `4.114.0`, and `hono@4.12.32` did not satisfy the declared
`^4.12.34`. A lockfile and its `node_modules` cannot legally disagree. That impossibility was the
thread; pulling it revealed the checkout was not the commit it was assumed to be.

**The rule.** Before branching, verify the base rather than the fetch: `git rev-parse master
origin/master` must agree, or branch from `origin/master` explicitly. And treat *any* impossibility in
tooling output — a lockfile contradicting its install, a declared range excluding the installed
version — as evidence about your environment before it is evidence about the code. The first
interpretation of a surprising audit result should be "am I looking at what I think I am looking at,"
because a wrong base does not fail loudly; it answers a different question fluently.

**Recurred 2026-08-14 (run 37), in a disguise worth recording.** Same root cause, different mechanism:
the session's checkout was a **detached HEAD** at `ed36307` while `refs/heads/master` still pointed at
`39e82b6`, so `git checkout -b <new> master` again cut from a stale base — this time dropping run 36's
RSS fix and its entire test file. The rule above would have prevented it and was not applied.

What makes it worth a second entry is how it nearly survived: `npm test` reported **"43 passing"**, the
exact number the previous run had reported, because 35 surviving tests plus 8 new ones happen to equal
43 old ones. **The total matched, so the total was not evidence.** What caught it was the test *file*
count — 4 where there should have been 5 — which is the same species of too-small-to-explain-away
inconsistency that caught it the first time. Add to the rule: when a suite total is unchanged after
adding tests, that is an impossibility, not a coincidence.

## L-16 — A URL proves a form was submitted, not that anything was published

**What happened.** The one owner action this loop had been asking for since 2026-08-08 was performed:
the Show HN was submitted, and a canonical `news.ycombinator.com/item?id=49280269` URL came back. That
URL was the exact success check written into the owner action card, on the reasoning that a canonical
item URL cannot be produced without publishing. It can. The item was **`dead: true`** — killed at
submission — and the pre-registered exposure never occurred. Item time 2026-08-13T00:13:23Z.

**The mistake is in the success check, not in the owner.** The card promised that the URL *"starts
EXP-002's 48-hour clock; the executor grades it on its pre-registered bands."* Had the URL arrived
while nobody was looking closely, this loop would have started a 48-hour clock over an empty page,
watched the flat counters it was always going to see, and graded a distribution experiment that had no
distribution in it. The bands would have been applied honestly to a number that meant nothing, and the
resulting *"Show HN produced no measurable arrivals"* would have entered durable state as a finding
about Tuned's positioning. It is a finding about a killed submission.

**Why the check was wrong.** It confused an artifact of the act with the effect of the act. Submitting
a form mints an item id whatever happens next — dead, flagged, buried, or fine. The thing EXP-002
needs is not a URL; it is *exposure*, and exposure is a property of the item's public state at a later
time, not of the moment it was created. Every success check in this loop that names an artifact rather
than an observable outcome has the same defect latent in it.

**Evidence and cost.** Firebase item record read from GitHub's network in
[run 31654090210](https://github.com/in-c0/tuned/actions/runs/31654090210):
`{"by":"avajiyo","dead":true,"id":49280269,"score":1,"time":1786580003,"type":"story"}` — no title, no
url, no descendants. Cost: the one-week milestone's publication condition, already graded missed
hours earlier, plus the channel itself pending moderation. AUD $0.

**A second, smaller mistake caught in the same hour.** The instrument built to check this
([`bbb9a4d`](https://github.com/in-c0/tuned/commit/bbb9a4d)) graded restoration partly on the public
item page, and Hacker News answered **HTTP 429** to GitHub's runner — it rate-limits datacenter IPs.
A success condition that depends on a reading unavailable by construction can never go green, so the
check would have reported "not restored" forever, including after a successful restoration. Corrected
in the same run to grade on the API record's `dead`, `title` and `url` fields, with the page kept as
non-deciding corroboration and marked `inconclusive` rather than `absent` on 429. This is [L-05](#l-05--this-loops-instruments-mislead-more-often-than-its-product-does)
again, one layer up: the instrument built to verify a claim needed verifying too.

**The lesson.** *Write success checks against the observable outcome, never against the receipt.* "A
URL appears in issue #1" is a receipt. "The item's public record is not dead, carries a title, and
still points at Tuned" is the outcome — and it is checkable repeatedly, by machine, days later, which
a receipt never is.

**More elegant next attempt.** Every owner action card's success check should be executable. If the
executor cannot express the check as something it can run and grade, the check is an attestation and
should be labelled one.

**Prevention check.** Before a success check is written into an owner action card, ask: *could this
condition be satisfied while the thing it is standing in for did not happen?* If yes, it is a receipt.
Replace it. And before an instrument's verdict is trusted, confirm each of its inputs is actually
obtainable from where it runs — an unobtainable input is not a failing condition, it is no condition
at all.

## L-17 — A channel can be invalid on its own terms, and that says nothing about the product

**What happened.** For five days this loop's single top blocker was publishing EXP-002, a Show HN.
The packet was authorized on 2026-08-08, pasted on 2026-08-13, killed at submission, and then held
open for eleven hours pending a moderation-review request. On review the packet turned out to be
**unpublishable on Hacker News' own rules regardless of what moderation said**: its §3 body was
AI-written and the packet instructed the owner to post it as their own first comment, and its §2 URL
was an application-gated landing page rather than something a reader can try. Either defect alone
disqualifies it. The recovery action the loop was pushing — *get it restored* — would have restored an
invalid test.

**The trap, and it was one step from being sprung.** The withdrawn state and the graded-failure state
produce the *same observable*: flat counters, zero applications. Had the item been restored, EXP-002
would have started a 48-hour clock over a submission that broke the venue's rules, watched the flat
numbers it was always going to see, and written *"the Show HN produced no measurable arrivals"* into
durable state as a finding about Tuned's positioning. It would have been a finding about a packet the
executor wrote wrong. [L-16](#l-16--a-url-proves-a-form-was-submitted-not-that-anything-was-published)
caught this at the receipt layer a day earlier; this is the same failure one layer further in — the
exposure could have been real and the *test* still invalid.

**Why it was missed for eleven runs.** The packet was checked hard, repeatedly, and always against the
wrong axis. Run 19 verified its **claims** — the apply path with a real browser, the RSS promise from a
datacenter client — and run 20 canonicalized it. Nobody checked its **compliance with the venue's
rules**, because the loop treated "is every sentence true?" as the whole of "is this postable?" A
truthful post into a channel that forbids its form is still unpostable, and the venue's rules were
readable the entire time. The executor's egress proxy blocks `news.ycombinator.com` — which is a reason
the check was awkward, not a reason it was skipped, since the loop has read from GitHub's network since
run 26 precisely for this.

**Sharper still: the executor wrote copy for a human to post under their own name, and never asked
whether it was allowed to.** That is a boundary question the doctrine already answers — humans
contribute attention, not content — and the packet inverted it, having the machine produce the words
and the human supply only the account.

**Evidence and cost.** Packet authorship: run 9's [DECISIONS](DECISIONS.md) entry, *"Action taken: a
distribution packet, and no code."* Submitted URL: `https://justtuned.com/?src=shn-2026-08` in
[EXP-002-PACKET.md](EXP-002-PACKET.md) §2, gated by §3's own *"membership is application-only right
now"*. Cost: five days of the loop's only top blocker spent on a channel that could not have worked,
plus the one-week milestone's publication condition. AUD $0. Nothing shipped to production, and no
metric was contaminated — the zero baseline is intact and unspent.

**The lesson.** *Distinguish channel/protocol invalidity from product invalidity, and refuse to let the
first masquerade as the second.* When a distribution attempt returns nothing, the first question is
whether the attempt was **admissible** — right venue, right form, rules obeyed — and only then whether
the offer failed to land. An inadmissible attempt produces no evidence about demand in either
direction, and recording it as a negative result is worse than recording nothing, because a fabricated
negative closes a question that was never opened.

**More elegant next attempt.** Pre-register a channel's **admissibility conditions** alongside its
thresholds, at the moment of pre-registration: the venue's stated rules for that post type, who must
author the words, and what the destination has to be. A channel whose admissibility is unstated is not
ready to be authorized, however well-checked its claims are.

**Prevention check.** Before authorizing any public channel, ask two questions the loop skipped:
*(1) does this venue permit a post of exactly this form, by exactly this author?* and *(2) if it
returns nothing, will I be able to tell "nobody wanted it" apart from "it was never admissible"?* If
the second answer is no, the experiment is ungradeable before it starts. And any text the executor
drafts for a human to publish under their own name carries a third: *is authorship by a machine
allowed here?*

---

## L-18 — a hardcoded claim about live data is a claim nobody can keep true (2026-08-13, run 35)

**What happened.** The landing page headed its demo block *"Live demo — a real feed, right now"*. That
sentence was a string constant. EXP-005 measured what was underneath it in production: the newest item
in that block was **270.6 hours — 11.3 days — old**, and the page's own script stamped each card
**"11d ago"** directly beneath the word *now*. Every other feed was 13.5 days stale. At least 431
UA-flagged human-shaped landing views had arrived on that page in that state.

**Why it survived eleven days.** Not for lack of checking. The landing page has been driven by a real
browser twice — EXP-003 at two viewports, EXP-004 against the very same demo block — and it passed
both. Every criterion asked *does this render?*: 200s, a card present rather than the empty state, no
console errors, no horizontal overflow, RSS with at least one `<item>`. **Not one of them looked at a
date.** A stale page and a fresh page are byte-for-byte identical in structure, so a suite that grades
structure will grade a corpse as healthy, forever, and report green while doing it.

**The lesson.** *A claim about live data must be derived from that data at render time, or it is not a
claim — it is a decoration that was true once.* Prose asserting freshness, activity, recency or volume
cannot be maintained by anyone: no reviewer re-reads a heading they have already approved, and no
structural test can see through it. The same page already had the honest version of this pattern in
`publicPage` — a presence pulse that reads the newest item and greys itself out past 24 hours — so the
fix was not an invention but a consistency: the landing page was the one surface allowed to look
fresher than the feed it was showing.

**More elegant version of the fix, which is what shipped.** Delete the adjective from the prose and
let the data speak in its place. The heading now says only what the block *is* (`Live demo — a real
feed`); the pulse underneath says how current it is, and degrades by itself into *"last active 11d
ago"*. There is no branch to get wrong and no sentence that can rot, because there is no longer a
sentence making the claim.

**Prevention check, added to the pre-ship list.** For any user-facing string containing *now, live,
today, currently, active, fresh, latest, real-time* or a sample reading like *"active 2h ago"*: **what
query would falsify this, and does the page run it?** If nothing in the request path could make the
sentence false, it is a decoration and must be replaced by a rendered value. And when a QA suite
declares a surface healthy, ask what it would look like if the content behind that surface had died —
if the answer is *identical*, the suite is measuring the frame and not the picture.

---

## L-19 — the surface that leaves your site is the one nobody checks (2026-08-13, run 36)

**What happened.** Tracing the agent publication contract before asking for a credential to use it,
one of eight assertions failed: `/:handle/rss.xml` served an agent's finds with **no indication an
agent chose them**. The route's `SELECT` listed `id, handle, name, bio, avatar_url, accent,
created_at` and omitted `kind`, so `creator.kind` arrived at `rssFeed` as `undefined` and the
`kind === "agent"` branch — which does exist, three lines away, in `publicPage` — could never be true.
Two lines of fix: select the column, and say the thing in the channel title and description.

**Why it matters more than a missing badge.** Tuned's whole claim is *follow human and agent attention
with explicit provenance*. RSS is the one surface where an item leaves Tuned entirely: it lands in
someone's reader, stripped of the page, the badge, the accent colour and every other cue, and is read
next to items chosen by people. **Provenance that only renders on a page you control is provenance the
subscriber never receives** — and the reader who most needs to be told a machine selected this is
exactly the reader who never sees the badge.

**Why it survived.** The same shape as [L-18](#l-18), one layer out. EXP-004 drove RSS with a real
browser and passed it: 200, `application/rss+xml`, at least one `<item>`. Structure again. A feed
labelled *AI agent* and a feed labelled nothing are both well-formed RSS, so nothing that grades
well-formedness can see the difference. It also cost nothing to date because **no agent has ever
published** — the defect was invisible precisely because the feature was dormant, and it would have
shipped its first real item straight into the gap.

**The lesson.** *When a claim is a product promise, assert it on every surface that carries the
content, not just the one you look at.* A per-surface `SELECT` is a per-surface decision about what a
reader is told, and dropping a column is a silent editorial choice. Syndication, share cards, the
JSON, the email — anything that reproduces an item elsewhere reproduces the promise or breaks it.

**Prevention check, added to the pre-ship list.** For any claim the product makes about an item or a
feed — provenance, authorship, freshness, licence — enumerate the surfaces that can reproduce it
(HTML, RSS, share/OG, API) and ask **does each one carry the claim, and is there a test that fails if
it stops?** When a route hand-writes its own column list, check it against the renderer's branches:
an omitted column does not error, it just quietly turns a branch off.

## L-20 — a log nobody can read is not an instrument (2026-08-14, run 37)

**What happened.** Spotify ingestion is the only path on Tuned that currently produces items. Its
half-hourly cron reported success, failure, and how much it captured — to `console.log`, into
Cloudflare's logs, which this loop holds no credentials to read and never will, by design. So for
every day of its operation the pipeline was **instrumented and unobserved at the same time**, and the
distinction never came up because the queue was rising and rising looked like health.

When it stopped rising, the gap opened. `items_queued` sat at 42 for three days. A quiet member and a
revoked token produce that identical line, and the loop had already published an inference off the
weaker instrument — *"the Spotify cron kept working — 27 → 42 is that cron"* — which was true of the
window it described and silently untrue as a present-tense claim.

**The general shape.** An observability surface belongs to whoever can actually read it. Code that
logs into a system your operators cannot open is, from the operating loop's point of view,
indistinguishable from code that logs nothing — and it is *more* dangerous than code that logs
nothing, because the `console.log` in the source reads as diligence and stops anyone asking the
question again. The audit question is not "does this path report what it did?" but **"who can read
that report, and are they in this loop?"**

**Related but distinct from [L-19](#l-19).** L-19 was about a surface that leaves your site and is
therefore never looked at. This is about a surface that never leaves the *vendor's* console and is
therefore never looked at either. Same failure — an output with no reader — approached from opposite
directions.

**The rule.** For any path that produces or destroys state on its own schedule, one counter must land
somewhere the loop can read without credentials it does not hold. If the only evidence a job ran is a
line in a log the operator cannot open, the job is unmonitored, whatever the source code suggests.

**Corollary that did the real work here.** A derived signal — a delta between two totals — can look
like an instrument for as long as it happens to move. Before trusting one, ask what a *broken* system
would print. If the answer matches what a *healthy quiet* system prints, it was never an instrument.

## L-21 — a credential whose unit is the thing you want to test is a tax on testing (2026-08-14, run 38)

The blocker was real: no agent feed could publish without a credential the executor cannot hold. The
first answer was the obvious one — put that agent's studio token in a repository secret. It would
have worked, once.

What it hid is that the *unit* was wrong. The token authorises one feed, so the credential cost is
paid per agent: every new agent is another owner interruption, another capability URL copied into a
second system, another thing to rotate. And the whole point of getting an agent live was to find out
whether agent feeds produce anything anyone wants — a question you answer by running the experiment
several times, with several remits. The design made the cheap part (trying another agent) expensive
and the expensive part (the owner's attention) recurring.

The fix was not a better token handoff. It was to move the credential up one level: one key scoped to
an *owner*, not a feed, with the per-feed secrets staying where they already were and never being
handed to anyone. The owner pays once; the executor gains no ability to read anything it could not
read before; and the twelfth agent costs exactly what the first one did.

The general form: when you are asked for a credential, check what its unit is against what you intend
to do repeatedly. If the credential's unit is the thing you want to iterate on, you have not removed a
blocker — you have installed a toll booth on it. Two smells give it away early: the request contains
the words "for this one", and the success check has to be re-run per instance.

Corollary, learned the same run: the replacement must be *narrower* than the thing it replaces, not
just more convenient. A single key that could do anything would have been easier to build and would
have traded a recurring interruption for an unbounded authority. What makes this trade honest is the
list of refusals — human feeds, other members, SQL, token reads, deletion, the thirteenth agent — and
the fact that each one is a test rather than a sentence in a document.

---

## L-22 — a document describing what code does is a claim, and it decays silently (2026-08-15, run 44)

[`ops/agents/README.md`](agents/README.md) said a remit "is written to `creators.charter` at adoption
or creation". The reviewer's directive repeated it. It was true of *creation* and false of *adoption*,
and it had been false since the file was written.

Nothing failed. No test caught it, because no test could: it was a sentence about behaviour, sitting
next to the behaviour, agreeing with it in half the cases. The only reason it surfaced at all is that
this run read `src/operator.ts` before dispatching rather than trusting the document that described
it — and read it to answer a different question (*will `cleanRemit()` alter this exact string?*).

What made it worth stopping for is what it would have cost later. The claim, believed, says adoption
overwrites a member's `creators.charter` from a **public workflow input**. Believing that leads
somewhere specific: either a future run "fixes" the code to match the doc and quietly destroys the
owner's private steering text, or a future run avoids adoption entirely on the grounds that it
mutates private data — a real capability abandoned for a false reason. A wrong document does not sit
inert; it gets acted on.

The correction went to the document, not the code, and that direction was not automatic — it was a
decision. The code implements the safer behaviour, and the operator plane's whole authority argument
rests on it: an adopted feed keeps what its owner gave it. When a document and an implementation
disagree, the question is not "which is older" but **"which one is right about what should happen"**,
and here that was the implementation.

The general form: documentation that describes runtime behaviour is untested code. Treat a sentence
about what a mutation writes with the same suspicion as an uncommented magic number — verify it
against the implementation at the moment you are about to rely on it, which is exactly the moment you
are least inclined to. And when the two disagree, fix the one that is wrong about the *desired*
behaviour, not reflexively the one that is easier to edit.

## L-23 — a validity gate protects the conclusion, not the experiment (2026-08-15, run 45)

[EXP-007](EXPERIMENTS.md) was pre-registered with an instrument validity gate: if `landing_engage`
reads 0 on the first complete UTC day while `landing_view` is non-zero, the instrument is broken, no
fork may be graded, and the next action is to fix the pulse. That gate is well designed and it did
its job — it is the reason a silent JavaScript failure could not have been reported as Fork A.

What it cannot do is save the experiment. It fires two days after deploy, and its remedy costs
EXP-007 the only uncontaminated first reading it will ever get, because the counters start at zero on
their own deploy and there is no second first day. A gate that says "do not believe this number"
protects the *reader*. It does nothing for the *measurement*.

The gap it left was specific and invisible. `test/pulse.test.ts` proved the route counts, holds its
allowlist and rejects foreign origins. Run 44 proved the deployed route answers 403 to a caller with
no `Origin`. Both are real evidence and both are about the **server**. Nobody had ever observed the
other half — the page-side listeners attaching in a real browser and the request being accepted — and
that half is where the plausible failure lived: the counters sit at the end of one inline `<script>`,
so anything throwing earlier detaches them and yields exactly the zeros the experiment's most
consequential fork predicts.

The general form: **when a pre-registration includes "if this reads zero the instrument is broken",
that sentence is naming a live risk, not disposing of it.** The gate is the last line of defence, and
the cheap move is to go and falsify the failure it anticipates *before* the reading window, on a day
whose counters nothing will be graded against. It cost one spec file and one dispatch here.

The corollary, learned the same run and nearly missed: the check itself must be checked. The spec
skips every project but one, and Playwright reports a run in which *all* projects skip as green. A
green apparatus-check that measured nothing would have been worse than none at all, so the run log
was read for `1 passed` rather than for the workflow's conclusion. Verifying an instrument with an
instrument moves the question one level up; it does not answer it.

---

## L-24 — an attempt can be admissible, succeed, and still be ungradeable (2026-08-16, run 46)

[L-17](#l-17--a-channel-can-be-invalid-on-its-own-terms-and-that-says-nothing-about-the-product) asks
whether an attempt was **admissible** — right venue, right form, rules obeyed — so that a flat result
is not misread as a verdict on the product. Writing the admissibility register that L-17 prescribed
surfaced a second way the same experiment can fail, and it is not the one L-17 names.

**Suppose every admissibility condition passes.** The venue permits the post, the owner writes it,
the destination is usable and fresh, real strangers arrive and look. `feed_view` is a **single
site-wide counter** with no per-handle split and no referral tag (`src/index.ts:672`). Its
human-flagged readings over the preceding ten days ran **2, 3, 5, 8, 11, 14, 15, 15, 21, 22**, against
a bot-flagged counterpart that has reached 32. **A dozen genuine arrivals land inside that band and
are indistinguishable from a quiet Tuesday.** The attempt would have worked and the loop would have
recorded nothing — or worse, recorded a null.

So L-17's prevention check needs a fourth question next to its three. Not only *would I be able to
tell a null from an inadmissible attempt?* but **would I be able to see a positive one?** An
instrument that cannot resolve success is as disqualifying as a venue that forbids the post, and it
fails more quietly, because nothing about it looks broken.

The timing is the sharp edge. Counters start at zero on the deploy that introduces them and there is
no backfill ([EXP-001](EXPERIMENTS.md)), so the instrument has to exist **before** the attempt, never
alongside it and never after. A channel like Show HN can be spent once; an attempt made without the
counter is spent *and* unreadable, and the loop has already burned one Show HN.

The general form: **before running an experiment, check the resolution of the instrument against the
size of the effect you expect.** A counter whose ordinary daily variation exceeds the outcome under
test is not a weak instrument, it is not an instrument. This is cheap to ask and it is asked at
pre-registration time, alongside the threshold — the threshold and the noise band are the same
question asked from two ends.

**What was *not* done with this finding, deliberately.** The counter was not built this run. Its
correct shape depends on the channel — a per-handle split and a `?src=` tag answer different
questions — and no channel is admissible yet, because every Tuned destination currently fails the
freshness condition. Building the instrument before the question is chosen is how you get an
instrument for the wrong question.

## L-25 — a limitation restated verbatim three runs running is a decision nobody remembers making (2026-08-16, run 47)

Runs 44, 45 and 46 each carried the same sentence forward, in nearly the same words: *this executor's
egress proxy means an agent it drives encounters material at **result level, not page level**.* Each
run drew the same consequence from it — [EXP-008](EXPERIMENTS.md)'s threshold 6 cannot be met
honestly, so the pre-registered outcome is *publish nothing* — and run 46 followed the chain further:
nothing published means [DISTRIBUTION.md](DISTRIBUTION.md)'s **A4** never clears, and while A4 fails,
**no channel is admissible for Tuned at all**.

Three runs correctly identified a constraint as load-bearing for the entire commercial path. **None of
them asked what it would cost to remove.** It cost one spec file and one workflow.

The sentence was true about the *proxy* and false about the *loop*. This executor has had a second
network vantage since run 2 and has used it for **every production statement it has ever made** —
`verify-production.yml`, `qa-browser.yml`, `exp003-mechanism.yml`, `metrics-snapshot.yml`, 36 runs of
it. Run 46 even wrote *"they are read from GitHub's network"* into DISTRIBUTION.md's own procedure for
A1/A2, one section away from recording page-level access as impossible. Both statements were in the
same commit.

**The tell is the verbatim repetition itself.** A constraint restated in fresh words each time is
being re-examined. A constraint copied forward unchanged has stopped being a finding and become
scenery — and the more consequential it is, the more it looks like a law of nature rather than a bug
report. The phrase *"the honest limit to state before that decision"* is what a real constraint and an
unexamined one both sound like.

The check is cheap and belongs in the same place as the restatement: **when carrying a limitation into
a third report, state what removing it would cost, or state that you have not priced it.** "Blocked"
and "not yet priced" are different claims, and only one of them is an excuse for standing still.

The narrower engineering form, worth keeping separately: **an environment restriction is a fact about
one process, not about the system.** Before recording a capability as unavailable, enumerate the
vantages the system already holds. This loop's blocker register said *the executor cannot fetch pages*
when what was true was *one of the executor's two network positions cannot fetch pages*.

---

## L-26 — a deferral is a limitation wearing a schedule, and L-25 did not sweep the file it was written in (2026-08-16, run 48)

**Known problem.** [DISTRIBUTION.md](DISTRIBUTION.md)'s condition **A5** — *if the attempt works,
would we see it?* — read **FAILS — no instrument** for two runs. `feed_view` is one site-wide counter
with no handle and no referral tag, and a distribution attempt made without a per-destination counter
is spent and ungradeable, because counters start at zero on the deploy that introduces them.

**Attempted approach.** Runs 46 and 47 both deferred building it, in the same words: *"its correct
shape depends on the channel chosen — a per-handle split and a `?src=` tag answer different questions
— and building the wrong one costs more than waiting."*

**Mistake.** The sentence contains its own refutation. **They answer different questions, and that is
the reason to build both** — they are two dimensions of one event, not two candidate designs to pick
between. A distribution link points at *some destination* from *some attempt*, whichever venue is
eventually chosen. The tag *value* is channel-specific; the mechanism is not. There was never a wrong
one to build.

**Why it happened, and this is the part worth keeping.** Run 47 wrote [L-25](#l-25--a-limitation-restated-verbatim-three-runs-running-is-a-decision-nobody-remembers-making-2026-08-16-run-47)
— *a limitation restated verbatim across runs is a decision nobody remembers making; price it or say
you have not* — and applied it, correctly and at some length, to the page-level-read constraint. **In
the same file, two sections down, an unpriced deferral sat untouched.** Applying a lesson to the
instance that provoked it feels like discharging it. It is not: the instance is a sample, and the
lesson is about a class.

The disguise is different from L-25's and worth naming separately. A *limitation* says "cannot", which
at least invites the question. A **deferral says "not yet", which sounds like a plan** — it carries an
implied ordering, an implied trigger, and the reassuring shape of a decision already made. Nobody
audits a queue. So the deferral survives re-reading better than the limitation does, and it survives
best when its stated trigger is an event nobody controls: *when a channel is chosen*, here, while every
channel was simultaneously blocked on the very condition the deferral was holding open.

**Evidence and cost.** Two runs. It cost one route change, one helper, one spec and thirteen tests —
`npm run check` 0, 103/103, deployed [`86cabdd`](https://github.com/in-c0/tuned/commit/86cabdd) and
verified in production the same cycle. A4 still fails and no channel is admissible, so nothing was lost
in the market; what was at risk was arriving at an authorized channel with the one instrument that
cannot be added afterwards still missing.

**Lesson.** **A deferral with an external trigger is an unpriced limitation, and it must be re-derived
rather than re-read.** When carrying one into a second run, restate what it is waiting for and ask
whether that thing is genuinely a *precondition* or merely *later in the story*. And when a lesson is
written, sweep the document it was written in — the instance that provoked it is a sample, not the
population.

**More elegant next attempt.** Split the deferral before deferring it. A5 was one condition holding two
separable halves: an *instrument* (buildable with no venue, and only buildable in advance) and a
*threshold* (a claim about how many people a specific venue should send, genuinely unwritable without
one). Deferring the compound deferred the half that had no reason to wait. The register now records
them separately, and A5 fails on the threshold alone.

**Prevention check, asked out loud when a run re-reads a deferral it did not write:** *what is this
waiting for; is that a precondition or a sequence; and does any part of it become impossible, rather
than merely harder, if it waits?* An instrument that cannot be backfilled always answers the last one
"yes".

---

## L-27 — a gate that prescribes a remedy has already made a diagnosis (2026-08-17, run 49)

**What happened.** [EXP-007](EXPERIMENTS.md)'s instrument validity gate reads: if
`landing_engage + landing_engage_bot` is 0 on the first complete UTC day while `landing_view` is
non-zero, *"the instrument is broken or blocked … the next action is to fix the pulse."* The gate is
sound as a **guard** — [L-23](#l-23--a-validity-gate-protects-the-conclusion-not-the-experiment-2026-08-15-run-45)
was written about it and it did its job. The defect is in its second clause. That zero has **two**
causes, they are opposite, and they produce an identical observable: *the emitter is broken*, and
*the emitter is live and nothing touched the page all day*. The second is the experiment's whole
question answering itself in the affirmative, and the gate as written routes it to repairing a
working instrument and discarding the only clean first reading the experiment will ever get.

Nobody added the diagnosis carelessly. It arrived attached to the remedy — *"the next action is X"*
is only writable if you already believe you know why, and the belief rides in unexamined because the
sentence is about what to **do** rather than about what is **true**. A gate is read as procedure, and
procedure is not audited the way a claim is.

**Cost.** None yet, and that is the only reason this is a lesson rather than an incident. The window
in which it could be fixed honestly was still open: after the measured day closed (08-17 00:00 UTC),
before the snapshot carrying its reading existed (08-17 20:40 UTC). Twenty hours, once, and it closes
silently — the loop had four runs of standing-wait in which nobody re-read the gate's second clause,
and one run in which it could still be repaired blind. Repairing it after the number lands is
indistinguishable from rationalising an inconvenient result, whatever the reasoning says.

**Lesson.** **Write a gate's observable and its discriminator; write its remedy only after
enumerating what else produces the same observable.** If a symptom has two causes and the gate names
one, the gate will confidently mis-route on exactly the half it was not thinking about — and it will
do it with the authority of something pre-registered. The narrow form: *the next action is X* is a
claim, not an instruction, and it needs the same evidence as any other claim in the file.

**More elegant next attempt.** State the causes at pre-registration and name the evidence that would
separate them, even when that evidence does not exist yet — here it was cheap and available the whole
time: the emitter's bytes are git-verifiable across the window, and the same production spec run on
both sides of it brackets the period. Two dispatches and one `git log` would have been written into
the gate at pre-registration for nothing, instead of retrofitted under time pressure with the partial
day already visible.

**Prevention check, asked when writing any gate or threshold that carries a next action:** *what else
produces this exact number, and what evidence — obtainable outside the measured window — tells them
apart?* If the answer is "nothing else could", say so explicitly, because that is a strong claim and
writing it down is what makes it checkable.

## L-28 — the check that names a failure mode and only reports it will meet that failure mode green (2026-08-17, run 50)

**What happened.** Run 50 pointed the page-level source reader at three candidate pages for
[EXP-008](EXPERIMENTS.md)'s threshold 6. Two publishers returned 403 Cloudflare challenges and failed
correctly. `pmc.ncbi.nlm.nih.gov` returned **HTTP 200** with the title *"Checking your browser -
reCAPTCHA"*, 131 characters of body, and `possible_gate_markers: []` — and
[`qa/source-read.spec.mjs`](../qa/source-read.spec.mjs) reported **`1 passed`**. The instrument built
to answer *"was the source actually on screen?"* answered *yes* about a bot check.

**Why it passed.** Not an oversight. Run 47 wrote the gate-marker list with the defect stated in the
file, in its own words: *"Reported, never asserted. A consent or paywall interstitial still 'loads'
with HTTP 200, and the difference between reading an article and reading its gate is the whole
question here."* It identified the exact failure mode, described it accurately, and then wired the
instrument so it could not act on it. And the five hints it did carry were consent- and paywall-shaped
(`accept cookies`, `subscribe to continue`, `sign in to read`, `paywall`, `verify you are human`);
the wording actually served was *"Checking your browser before accessing"*, which matches none of
them, so the field aimed at the problem read empty as well.

**This is [L-27](#l-27--a-gate-that-prescribes-a-remedy-has-already-made-a-diagnosis) inverted, and
it is worth keeping both.** L-27 is a gate that names one cause and prescribes a remedy for it. This
is a check that names a cause, prescribes *no* remedy, and calls that restraint. Both leave the
observable correctly described and the instrument unable to use the description. "Reported, never
asserted" reads as epistemic modesty — *this is a judgement, not a test* — and for a soft gate it
genuinely is: a paywalled abstract is a real, shallow encounter. For an interstitial it is not a
judgement at all. Nothing of the source was reached, there is nothing to weigh, and the modesty was
protecting a distinction that did not exist on that branch.

**Cost.** None realised, and only because the reads happened while the publication gate was shut. The
realised version is exact and short: a future run points the reader at a page, sees `1 passed`, and
publishes a find "characterised from what was actually encountered" where what was encountered was a
reCAPTCHA. That is a fabricated find with a passing test in front of it — which is worse than a
fabricated find, because the loop's own convention is that green means checked.

**Lesson.** **A failure mode you can describe is one you can assert on. If a check names a way it
could be fooled and then only reports it, the report is a note to a reader who is not there — and the
pass/fail line, which is what everything downstream keys on, still says the wrong thing.** The narrow
form: `expect` on the thing you wrote the comment about, or delete the comment, because leaving both
means the file documents a defect it is still shipping.

**Where the modesty was right and how to keep it.** Split the categories instead of softening the
check. *Soft gate* — page served, part of it visible — stays reported, because whether an abstract is
enough to characterise a find is a real judgement. *Interstitial* — nothing of the source reached —
is now fatal, matched on title and body signatures observed live, plus a fail-closed 1000-character
substance floor for the wording this loop has not met yet. Fail-closed matters here: a legitimately
terse page that trips the floor fails loudly with its text in the log and a human can overrule it on
the evidence; the opposite error passes silently and cannot be caught at all.

**And verify a fix that tightens a check in both directions.** A check that fails everything is not a
check. The fix was re-dispatched at the *same* PMC URL — still 200, now failing with all three signals
named — and at `arxiv.org`, which returned 3517 characters and passed. One of those runs alone would
have proved nothing.

**Prevention check, asked of any instrument whose green tick licenses a downstream claim:** *name the
most plausible way this returns green while the thing it certifies is false. If that scenario is
written anywhere in the file — a comment, a reported-only field, a known limitation — it is a live
defect, not documentation.*

## L-29 — a discriminator that lists files inherits the lister's mental model of the system (2026-08-18, run 51)

**What happened.** Run 49 pre-registered a discriminator so that a **0** on [EXP-007](EXPERIMENTS.md)'s
graded day could be told apart from a broken instrument. Its first part was an identity claim about
the emitter across the measured window, and it named the emitter as two files: the `pulse()` closure
and its listeners in [`src/pages.ts`](../src/pages.ts), and `/api/pulse/:name` plus `PULSE_COUNTERS`
in [`src/index.ts`](../src/index.ts). Both were verified unchanged. The rule was written, committed
and pushed before the reading existed, exactly as it should have been.

**A third file changed inside the window and was not on the list.** [`src/metrics.ts`](../src/metrics.ts)
— which holds `count()`, the function the pulse route calls to write the counter — was modified in
[`86cabdd`](https://github.com/in-c0/tuned/commit/86cabdd) and deployed at **2026-08-16 10:14 UTC**,
roughly ten hours into the twenty-four-hour day the discriminator speaks for. Nobody checked it,
because it was not in the enumeration, and the enumeration read as complete.

**It was inert, and that is luck rather than method.** The diff adds `countEach` (called only from
the feed route), corrects a docstring and extends the snapshot `note` string. `count()` and
`ensureTables` are untouched, so the write path `POST /api/pulse/:name` → `count()` → `metric_days`
really was byte-identical for the whole window and the discriminator's conclusion stands. A change to
`count()`'s error handling in the same commit would have been equally invisible to the check and
would have invalidated the reading four runs of work were waiting on.

**Why the shape of the error is worth keeping.** The discriminator's entire value is that it is
**checkable by someone other than its author** — that was the stated reason for expressing it as
`git log` invocations anyone can re-run. But a hand-listed file set is only checkable *against the
author's own model of the code*. Re-running the commands confirms the files named did not change; it
cannot notice a file that was never named. The check looked mechanical and was, underneath,
an assertion of knowledge about the system, wearing a command line.

**This is not [L-22](#l-22--a-document-describing-what-code-does-is-a-claim-and-it-decays-silently).**
L-22 is documentation going stale against code that moved. Here nothing decayed: the enumeration was
incomplete on the day it was written, and would have been incomplete even if re-read an hour later.

**Lesson.** **Scope a span-of-identity claim by the dependency closure of the behaviour, not by a
list of files someone remembered.** The question is never *"did these files change?"* — it is *"did
anything that can alter this observable change?"* Those coincide only when the author's model is
complete, which is the thing under test.

**The narrow, cheap form:** diff the whole source tree over the window and account for **every**
changed file, including the ones you expect to be irrelevant. `git diff A B -- src/` is not more
expensive than `git diff A B -- src/pages.ts src/index.ts`, and it fails loudly instead of silently.
Writing *"and `src/metrics.ts` changed but only additively, here is the diff"* is a stronger claim
than not mentioning it, and it costs one line.

**Prevention check, asked of any pre-registered identity or invariance claim:** *name the observable,
then trace what writes it end to end. If the claim enumerates artifacts rather than deriving them,
widen the net until the enumeration is a **result** of the trace rather than an input to it.*

## L-30 — a length limit enforced by truncation is a fabrication engine with a 201 on it (2026-08-18, run 52)

**What happened.** R-1's `why` line — the agent's public account of why it selected a source — was
415 characters. `src/operator.ts` bound `(b.why ?? "").slice(0, 280)` straight into the insert and
returned **201, published=true**. Had the nominated line been dispatched as written, `@sportstech`
would have published, under its own name:

> … CoTracker showed huge differences from the manual labels. The authors state the precision may n

Nothing in the surviving text is false. That is what makes it dangerous. It reads as a complete
thought that trails off, it is attributed to an agent as its own account of what it encountered, and
**the caller has no way to know it happened** — the response says the publication succeeded, and it
did. `title` (300), `description` (500) and `url` (2000) carried the identical pattern; a silently
truncated `url` publishes a link that resolves nowhere.

**Why this is not a validation nit.** [EXP-008](EXPERIMENTS.md)'s threshold 6 says the `why` line
*"describes what was actually encountered."* A truncation defeats that threshold **after** every
human check on it has passed. The nomination was reviewed, argued against by its own nominator, and
held open a full cycle for veto — and none of that scrutiny was aimed at the transport, because the
transport was assumed to carry what it was given.

**The general shape.** Silent truncation is the write-path twin of
[L-28](#l-28--the-check-that-names-a-failure-mode-and-only-reports-it-will-meet-that-failure-mode-green).
L-28 was a *read* path that observed a failure and declined to act on it. This is a *write* path that
detected an over-long value — it had to, in order to slice it — and resolved the detection by editing
the payload instead of reporting it. Both are code that knows something and keeps it to itself. The
tell is identical in both: a constant that encodes a rule (`1000`, `280`) sitting next to a branch
that does not raise.

**Lesson.** **A limit is a refusal or it is a corruption; there is no third behaviour.** When a value
exceeds a bound, either the caller is told and nothing is written, or something the caller never
authored is published in their name. Choosing `.slice()` is choosing the second while feeling like
neither.

**The narrow, cheap form:** `grep -n 'slice(0,' src/` and ask of every hit — *is this trimming a
display string, or is it editing data that will be stored, served, or attributed to someone?* The
first is fine. The second must 400.

**And the refusal must not consume the retry.** The fix returns 400 **before** the idempotency key is
claimed, so an operator can shorten the line and re-send the same find. A refusal that burns the key
turns one defect into a permanent one.

**Prevention check, asked of any field that reaches a public surface:** *if a caller sends one
character too many, does anyone find out?*

## L-31 — `innerText` is what a reader sees, `textContent` is what the document says, and provenance lives in the second (2026-08-18, run 52)

**What happened.** Threshold 5's instrument failed at both viewports on
`expect(badgeText).toBe("AI agent")` — received `"AI AGENT"`. `.ai-badge` carries
`text-transform: uppercase`, and Playwright's `innerText()` returns rendered text, transforms
applied. Production was correct; the assertion was not. Every substantive check in the same test had
already passed: the card links to the published URL, the heading matches byte-for-byte, and the whole
277-character `why` line is present.

**Why it is worth a lesson rather than a shrug.** It cost a dispatch, but the interesting part is
*which* of the two strings threshold 5 is actually about. Tuned's doctrine is that provenance is
explicit — and the consumers of that explicitness are not only people. A feed reader, a scraper, an
LLM summarising the page, and the RSS channel title all read the **document**. A CSS transform can
change what a human sees without changing what any of them get, and a spec that only checks the
rendered string would pass a page whose markup said something else entirely.

**Lesson.** **When asserting on text that carries meaning rather than styling, assert the source and
the rendering separately, and say which is which.** `textContent` exactly, because that is the claim
the document makes; `innerText` case-insensitively, because that is the claim a person receives. One
without the other leaves the next run to rediscover the difference from a red build.

**Prevention check:** *is this assertion about what the page says or about what it looks like? If the
answer is "both", it needs two assertions.*

## L-32 — an undo inherits the authority of whoever moved the state, so it must record who moved it (2026-08-18, run 53)

**What happened.** Building `retract`/`restore` for the operator plane raised a question that
building `publish` never had to answer. `retract` is easy to bound: it may touch only items this
plane published, so it needs an `operator_publications` row and nothing else. `restore` looked like
its mirror image — flip `hidden` back to `public` — and that reading is wrong in a way that is
invisible from the diff.

An item can be `hidden` for two reasons. The operator retracted it, or **the owner vetoed it from
their studio**, using the toggle that has existed since long before this plane did. Both produce the
identical row. A `restore` that only checks *"is it hidden, and is it mine to touch?"* answers *yes*
in both cases, and the second one is the operator overriding a human's decision — a power nobody
granted it, arriving through a feature whose entire justification was safety.

The fix is one table and one query: `operator_item_actions` records each retract and restore, and
`restore` refuses with 409 unless the **last** operator action on that item was `retract`.

**Lesson.** **An undo is not the inverse of an action; it is an authority over state that someone
else may also have moved.** The scope of a `do` is bounded by what it creates. The scope of an
`undo` is bounded by *who last changed the thing* — and if the system does not record that, the undo
silently takes authority over every actor who can reach the same field. Write the actor down at the
moment of the change, or the reversal cannot tell whose decision it is reversing.

**The general form, worth carrying past this codebase.** Any *toggle* shared between a privileged
human and an automated principal has this shape: hide/show, enable/disable, approve/unapprove,
mute/unmute. The dangerous half is always the one that moves state **back toward permissive**,
because that is where an override looks like a restoration.

**Prevention check, before shipping any reversal:** *who else can put this field in the state I am
about to reverse — and if it was them, am I allowed to?*

**A second thing this run got right, recorded because it is cheap to skip.** The undo was exercised
on the **real** artifact — item 242, in production — and put back, rather than asserted from unit
tests. The proof that it reached readers was the instrument for the opposite claim:
`qa/exp008-provenance.spec.mjs` proves the item is *present* on the HTML feed and in RSS, and while
the item was retracted it **failed** at both viewports and on the feed
([32126387432](https://github.com/in-c0/tuned/actions/runs/32126387432)), then went green again after
`restore` ([32126651069](https://github.com/in-c0/tuned/actions/runs/32126651069)). A retract that
only moved a database column would have left that spec passing — which is exactly how an undo in
name only would present.

---

## L-33 — a cheap disqualifying check belongs first, whatever the procedure says (2026-08-19, run 54)

`ops/DISTRIBUTION.md` had a five-condition admissibility test and an explicit order for working it:
A4 (destination freshness), then A5 (arrival instrument and threshold), then **"only then"** A1 (does
the venue permit this post at all). That order held for eight days and three runs named
"propose a channel" as the top blocker without moving it.

The order was wrong, and it was wrong on a property visible before any of it was attempted: **what
each check costs, and whether getting it wrong is recoverable.**

| Check | Cost to run | Can it be spent? | If the answer is "no", what was wasted |
| --- | --- | --- | --- |
| **A1** — does the venue permit this post? | one CI dispatch against a public rules page; no account, no counter moved | **never** — a public page can be read again tomorrow | nothing |
| **A5** — pre-register an arrival threshold | a per-venue claim about expected arrivals, plus a code change | the *attempt* it grades can be spent exactly once | the whole threshold, and possibly the channel |

Run 54 read three venues' rules in about six minutes of CI. **Two closed immediately** — Lobsters is
*"focused pretty narrowly on computing"* and excludes entrepreneurship, so a sports-technology feed is
off topic; Hacker News says *"Don't post landing pages"* and lists *"other reading material"* as off
topic for a Show HN, which is what a curated feed is. Under the file's own ordering, the loop would
first have pre-registered an arrival threshold for one of those venues and *then* discovered the post
was never permitted.

**Lesson.** **Order the gates by cost-to-check divided by chance-of-disqualifying, not by narrative
sequence.** A procedure written as a story — establish the destination, build the instrument, then
check the rules — reads as thoroughness and behaves as waste, because it puts the irreversible step
before the free one. The check that can kill the whole plan for the price of one page load goes
first, even when it feels like the detail you confirm at the end.

**The second half, which is the part that took eight days.** Run 53 escalated **A2** — the doctrine
that this executor writes no sentence a human posts under their own name — as *"the wall in front of
distribution"*, and asked the reviewer to overrule it if they disagreed. Three A1 reads later, **A2
was not reached at any venue**: two forbid the post regardless of who writes it, and the third would
not show its rules to this reader. The loop had spent runs arguing about an interpretation when the
binding constraint was a fact it could have looked up.

**Prevention check, before escalating any blocker as a judgement call:** *is there a cheaper check
that would make this judgement unnecessary — and have I run it?*

---

## L-34 — a green read is not an answered question, and a prefix is a guess about where the answer is (2026-08-19, run 55)

Run 55 opened `github.com/plenaryapp/awesome-rss-feeds` to settle **A1** for the first candidate
whose subject is a feed. The reading came back with every signal this loop has for *the page was
really on screen*:

```
http_status: 200        read_outcome: "page"        interstitial_signals: []
visible_text_chars: 69678                           1 passed (40.7s)
```

**And it answered nothing.** `qa/source-read.spec.mjs` reports `normalized.slice(0, EXCERPT_CHARS)` —
the first **4,000** characters — and on that page those are the directory tables: 25 countries, 33
categories, then the first rows of Australian newspapers. The contribution rules, the entire reason
for the read, begin at character **68,472** of 69,678. The compact alternative, `/issues/new/choose`,
served **279** characters to a logged-out reader and failed on the interstitial floor.

**The failure has a shape none of the existing instruments catch.** Run 50 taught the loop that a
200 is not a read, and built `classifyRead()` to separate a page from the bot check standing in front
of it. This is the next layer in: **the page was genuinely served, genuinely read, and the clause was
genuinely out of reach.** Not a bot check, not a paywall, not egress. Nothing was red, nothing was
suspicious, and the reading was worthless for the question asked.

**The fix that was rejected, because it is the obvious one.** Raise `EXCERPT_CHARS`. It fails twice:
it mirrors more of someone else's page into a public CI log for the sake of one clause, and it is
still a guess — whatever the new number is, the next venue's rules sit past it. A prefix answers
*"what does this page start with"*. Nobody has ever wanted to know that.

**What shipped instead** ([`cd2d4c6`](https://github.com/in-c0/tuned/commit/cd2d4c6)): an optional
literal `find`, reported as at most six bounded windows, counting every occurrence including the ones
it does not quote, and keeping *not asked* distinct from *asked and not found*. Never asserted — a
rules page that does not contain the word is a reading about that venue, not a failure of the
workflow. One dispatch later the rules were quoted with `find_total_occurrences: 2` and
`find_windows_truncated: false`, and A1 was answerable.

**Lesson.** **When an instrument reports a fixed slice of a variable thing, its green means "I
sampled", not "I checked".** Ask of every reading, before trusting it: *could this have come back
exactly like this while missing the thing I asked about?* If yes, the instrument measures its own
convenience, and the fix is to make it seek the answer rather than to widen the sample.

**Prevention check, before recording any read as evidence:** *did the instrument look where the
answer lives, or where it happened to be pointing?*

---

## L-35 — a capability is not a coverage claim, and "we have that instrument" is a memory, not a check (2026-08-19, run 56)

[Run 48](https://github.com/in-c0/tuned/commit/86cabdd) built arrival attribution: `feed_view:<handle>`
to name the destination, `arrival:<tag>` to name the attempt that sent someone. It was verified in
production, tested against a real D1 in workerd, and correct. Every run since has recorded
[A5](DISTRIBUTION.md)'s instrument half as **SHIPPED**, and run 55 wrote the sentence that made the
error visible only in hindsight: *"The instrument exists (run 48); the tag and threshold do not."*

**The instrument did not exist for the URL in the proposal.** Run 48 instrumented `GET /:handle` —
the HTML feed page. Run 55's proposal was to submit **`https://justtuned.com/sportstech/rss.xml`** to
a directory of RSS feeds, and `GET /:handle/rss.xml` had **no `track()` call at all**: the only
public route in the Worker with none. Not a broken counter, not a mis-named one — no counter.

**What made it invisible is that every summary of it was true.** *Tuned has arrival counters* — true.
*They were verified in production* — true. *`?src=` survives the edge* — true. *A5's instrument half
is shipped* — true of the product, and false of the route being submitted. Eight runs restated it
from the record, and the record was a **capability** where the question needed **coverage**.

**And the worst of it: the record said so.** [METRICS.md](METRICS.md)'s own heading for these
counters reads *"Arrival attribution counters — added 2026-08-16 (run 48) … **on the public feed
route only**."* The qualification was written down, correctly, by the run that shipped the counters —
and then summarised away. Every later citation carried the capability and dropped the scope, because
a scope qualifier is exactly the kind of clause a summary drops. **The defect was not an inaccurate
record. It was an accurate record read as a coverage claim**, which is a failure mode no amount of
careful writing prevents and only re-derivation catches.

**The consequence was worse than a missing number, and worth stating in full.** A5 asks *"if it
works, would I see it?"* The answer for this candidate was **no** — not "not yet", **no**. Had the
submission gone ahead on the register's own reading, the loop would have allowlisted a tag on a route
that never reads `?src=`, watched a permanently zero counter for fourteen days, and recorded a
**confident null result about demand** produced entirely by its own blind spot. The distinction A5
exists to protect — *nobody wanted it* versus *it was never admissible* — would have been destroyed
by the very condition written to protect it.

**The general shape.** A capability is a claim about the product; coverage is a claim about a
specific path through it. They are stated in the same words and they diverge silently, because
nothing goes red when an instrument is merely pointed somewhere else. The divergence widens every
time the claim is restated from the record rather than re-derived from the code, and a durable ops
file is an excellent machine for restating a claim.

**Lesson.** **Before depending on an instrument, open the handler for the exact path you are
depending on it for.** Not the feature, not the last run that verified it, not the file that says it
shipped — the route. The check that would have caught this cost one `grep` and was never run in eight
runs, because everybody involved already knew the answer.

**Prevention check, before any plan depends on a measurement:** *which line of code writes the number
I am counting on, for the exact URL, parameter and request shape I am counting on it for — and have I
looked at it this run, or am I remembering it?*

**Postscript, same run.** This lesson was violated by the run that wrote it, within the hour. The
commit shipping the RSS counters claimed — in the deployed code comment, in the public
`/api/metrics` description, and in [EXP-009](EXPERIMENTS.md)'s forks — that unsuffixed `feed_fetch`
carries this loop's own scheduled QA fetches. It does not:
[`qa/playwright.config.mjs`](../qa/playwright.config.mjs) sets a `HeadlessChrome` user agent on every
spec, `isBot()` matches it, and every QA fetch lands in `feed_fetch_bot`. **The config file was one
`grep` from being read and was recalled instead.** It surfaced only because the production check
printed its own expected footprint — *"feed_fetch_bot +2, feed_fetch_bot:sportstech +2"* — and that
contradicted the sentence in the file next to it. The forks were corrected before any counter had
produced a value, which is the only thing that made the correction legitimate rather than a post-hoc
edit. **A lesson written down is not a habit acquired**; the check has to be run, not cited.

## L-36 — a campaign tag measures a channel only while the tagged URL exists in one place, and an execution report is a place (2026-08-19, run 57)

[Run 56](https://github.com/in-c0/tuned/commit/b49a1fa) shipped `arrival_fetch:<tag>` on the RSS route
so that a listing at a third-party directory could be told apart from background traffic. It chose
`qa` as the tag safe to exercise in production, on sound reasoning: a real channel tag must never be
written by this loop's own checks, and `qa` is a tag only this loop would ever use.

**Nine minutes after the counters went live, the run's execution report printed the tagged URL in a
public GitHub issue** — `"url": "https://justtuned.com/sportstech/rss.xml?src=qa"` — as evidence that
the query string survived the edge. That is exactly the kind of quotation this loop is right to
publish: it is the proof, and hiding it would make the verification unauditable.

**By the evening snapshot the counter had moved, and not from anything this loop can identify.**
`feed_fetch 16 · feed_fetch:sportstech 16 · arrival_fetch:qa 16`, against a `_bot` half of 10 that is
fully accounted for by the loop's own dispatches. **Sixteen fetches, none declaring themselves a bot,
all sixteen carrying a tag no stranger could guess.** Ruled out by opening the files: local vitest
runs against a simulated D1 with no network; no scheduled workflow fetches a tagged URL; the Worker's
cron makes no request to its own routes. Not ruled out, and not reachable from here: the Cloudflare
request log. **The likely story is that something read the URL in the public issue and started polling
it, and the honest status is unattributed.**

**The general shape, and it is not about RSS.** A campaign tag is not a property of a link; it is a
property of *where the link exists*. `arrival:<tag>` answers "did the thing I published send anyone"
only while the tagged URL has exactly one publication — the channel. Every other place that URL
appears is a second, unmeasured channel wearing the first one's name. And a loop whose discipline is
to quote its evidence verbatim into a public record is a loop that reliably creates that second
place, **as a direct consequence of doing the transparency right.** The failure mode is not
carelessness; it is two good practices whose interaction nobody costed.

**It also inverts what a tagged counter means for confidentiality.** Before this, the loop's rule was
*never exercise a real channel tag* (run 56's preview-deployment hazard). That rule guards against
*writing* the counter. This one guards against *publishing the key* — and publishing the key is worse,
because the contamination arrives later, from outside, at a rate nobody controls, and looks exactly
like the success the experiment was registered to detect.

**Lesson.** **Before printing a URL as evidence, ask what that URL does when a stranger fetches it.**
If the answer includes "increments a counter I am going to grade", the URL is not evidence — it is a
publication. Quote the route and the parameter separately; the joined string belongs in one place
only.

**Prevention check, before any execution report, ops file, code comment or CI log is written:** *does
this text contain a URL that writes to a counter I intend to read? If so, is this the one place that
URL is supposed to exist?*

**Corollary, on the cost of getting this right.** The mitigation is *not* to stop quoting evidence,
and it is not to lower the standard of proof — run 56's check was correct and worth running. It is to
separate the two halves in writing, which costs a sentence and preserves both properties.

## L-37 — a loop that runs in the open cannot hold a secret, so its campaign counters need a control rather than a tag (2026-08-20, run 58)

[L-36](#l-36--a-campaign-tag-measures-a-channel-only-while-the-tagged-url-exists-in-one-place-and-an-execution-report-is-a-place-2026-08-19-run-57) diagnosed the leak and prescribed a writing rule: never
print the *joined* tagged URL; name the route and the tag separately. That rule is worth keeping and
it is not sufficient, for a reason the rule's own text demonstrates — **it names the route and the tag
one line apart, in a public file.** So does `src/index.ts`, where the allowlist and the handler that
reads it sit thirty lines apart. Joining them is not work.

**The general form is harder than a discipline problem.** This loop's every durable store is
world-readable by construction: a public repository, a public issue, public CI logs. Transparency is
not a policy it could relax; it is the thing that makes the record auditable and the reason anyone
could check its claims. **A loop with no private store cannot own a private campaign tag.** Not
"should be careful with" — *cannot*. Every `?src=` value it will ever write is published before it is
ever used, next to the route it works on.

**Which means `arrival:<tag>` was never the instrument it was described as.** It answers *how often
was a tagged URL fetched.* Reading that as *how many people the channel sent* requires the extra
premise that the only holders of the tagged URL are people the channel gave it to — and that premise
is false here for structural reasons, not because of one careless quotation.

**The repair is a control, not better secrecy.** Take one tag that is published exactly like a real
one and submitted to no venue, ever, and let it run. Its reading is what a tagged URL earns with no
channel behind it — the null every real tag must be read against. Tuned's `qa` tag is that control by
accident and is now that control by registration ([EXP-010](EXPERIMENTS.md)).

**And the confirming instance arrived within a day, on this loop's own data.** Run 57 read a partial
day of `arrival_fetch:qa` — 16 fetches, roughly one per forty minutes — and called it *"the shape of a
feed client or an indexer."* The day closed at 23; the next 4.1 hours produced **1**, against ~6.9
expected at that rate (P(X ≤ 1) ≈ 0.008). A burst that decayed, which is a crawl — **not** a
subscription. That is exactly the discrimination [EXP-009](EXPERIMENTS.md)'s Fork A is written to
make, and this loop got it the wrong way round on its own control inside twenty-four hours, from a
partial day read as though it were a rate.

**Two lessons, and the second is the cheaper one.**

1. **Before an experiment infers a cause from a counter, ask what else writes to that counter, and
   then go measure it rather than argue about it.** A control costs nothing when a suitable series is
   already running; here one was, and it had been filed as contamination.
2. **A partial day is not a rate.** Run 57's 16 was a correct read of an incomplete day; the error was
   dividing it by elapsed hours and calling the quotient a cadence. Nothing about a series' shape is
   knowable from its first partial day, and the second day is cheap — it costs one dispatch of a
   workflow that already exists.

---

## L-38 — a question asked four times into a file that says "nothing to do" has not been asked (2026-08-20, run 59)

- **Known problem:** get an answer to one owner decision — may the executor submit a feed record to a
  third-party directory in the owner's name — which is the only condition left on the loop's single
  objective.
- **Attempted approach:** ask it, clearly and completely, in the execution report on
  [issue #1](https://github.com/in-c0/tuned/issues/1). Then ask again at run 56, run 57 and run 58,
  each time with more context and a sharper framing.
- **Mistake:** the ask lived only in the *channel*, never in the *state*. `ops/STATUS.md`'s canonical
  `## OWNER ACTION REQUIRED` section — the one place the record designates as the answer to *"what
  must I do?"* — read **`### NONE.`** throughout, and `ops/DASHBOARD.md`'s headline read **"There is
  nothing for you to do."** An owner who opened either file to check was correctly told, by the
  system of record, that they were not needed.
- **Why it happened, and it is structural rather than careless:** the card was closed at run 42 on a
  card that genuinely passed its success check, and closing it was right. The section's own rule says
  it holds *"either `NONE`, or exactly one canonical action"* — it is designed to be emptied. Nothing
  in the loop re-opens it, because a *new* owner boundary is discovered mid-run by the run that hits
  it, and that run's instinct is to write the ask where it is thinking: the report. **Reports
  accumulate; state gets overwritten.** Four runs each added a better version of the ask to a
  chronological log nobody has to read, and none touched the file built to be read.
- **Evidence and cost:** the question opened **2026-08-19 04:30 UTC** and was unanswered across runs
  55–58 while STATUS's header, blocker #1 and *Next action* all said a decision was outstanding and
  its canonical card said NONE — **a contradiction inside a single file**, not merely between a
  source and its mirror. Found by the reviewer, not by this loop, in the first review after twelve
  executions. Cost: four runs and **~29 hours** of the top blocker sitting one word from testable
  while both files told the owner the opposite of the truth. **The empty card long predates the
  question** — STATUS's has read `NONE` since run 42 on 2026-08-15 and DASHBOARD's headline since run
  49 on 2026-08-17 — which is the point: an emptied card is the *normal* state, so nothing about it
  looks wrong until a boundary exists that it fails to name.
- **Lesson:** **an ask is not made until it exists in the state, not the stream.** A durable record
  has two kinds of surface — the append-only channel (issue comments, reports) and the overwritten
  card (STATUS §1, DASHBOARD §1) — and only the second is what a reader consults when they want to
  know what is true *now*. Writing a boundary into the channel and not the card produces a record
  that is individually accurate on every line and collectively false.
- **More elegant next attempt:** the run that *discovers* an owner boundary opens the canonical card
  in the same commit that reports it — before writing the report, not after — and states it as
  **named responses (A / B / C)** rather than an open question, so it carries its own observable
  success check: a comment naming one of them. Four runs of an open question produced nothing to
  observe, so nothing could be said to be waiting.
- **Prevention check, before ending any run that asks the owner for anything:** *does
  `STATUS.md § OWNER ACTION REQUIRED` say the thing I just asked for — and if I opened DASHBOARD §1
  as the owner, would it tell me I am needed?* If either says `NONE`, the ask has not been made.

---

## L-39 — "not urgent" and "not our lever" are different claims, and collapsing them removes a fact the decider needed (2026-08-20, run 60)

- **Known problem:** one owner decision (A / B / C) is the last condition on the loop's single
  objective, and one of its own preconditions — A4, `@sportstech`'s ≤72h freshness — expires
  **2026-08-21 04:15 UTC**.
- **Attempted approach:** run 59 stated the expiry in the card and then, correctly, refused to let the
  executor publish anything to hold the window open — EXP-008's binding clauses disqualify a
  publication made to move a number, and A4 decaying is a pre-registered acceptable outcome.
- **Mistake:** it wrote *"not a deadline, and **not a reason to answer quickly**"*, and the card's
  severity row said *"nothing degrades, nothing is lost."* Two different propositions were collapsed
  into one sentence. *The executor must not act on this clock* is true. *Therefore the clock is
  irrelevant to the owner's answer* does not follow and is false:
  [DISTRIBUTION.md](DISTRIBUTION.md) requires A4 to hold **before** the submission, so an **A** before
  04:15 UTC is submitted and an **A** after it waits on an unscheduled event.
- **Why it happened, and it is the shape that generalises:** the loop had just spent a run
  establishing a genuine discipline — *do not manufacture freshness to hold a window open* — and the
  discipline is about **the executor's own conduct**. When the same clock was described to **the
  owner**, the conduct rule was restated as though it were a fact about the world. **A rule
  constraining what I may do is not a description of what matters to someone else deciding.** The
  wrong sentence looked, from inside, like integrity: refusing to pressure the owner.
- **Evidence and cost:** written 2026-08-20 09:45 UTC into `STATUS.md`'s canonical card,
  `DASHBOARD.md` §1, and `DECISIONS.md`; corrected 10:35 UTC, ~50 minutes later, ~18 hours before the
  lapse. No decision was made on the bad text and nothing shipped on it, so the cost is the correction
  itself — caught only because run 60 re-derived the consequence instead of re-reading the sentence.
- **Lesson:** **when a card states a constraint on the executor, it must separately state what the
  reader's own choice does.** A card is read by someone deciding, and every clock in it needs its
  effect on *their* options spelled out, distinct from its effect on the executor's permissions.
  Suppressing a real consequence is not neutrality — an owner who answers twelve hours later because
  they were told timing did not matter was misinformed by the file built to inform them.
- **More elegant next attempt:** for any dated condition on an owner card, write the three-column
  answer before the prose — *what lapses* · *what the executor may do about it (often: nothing)* ·
  *what changes for each response if it lapses*. If the third column is empty, the date does not
  belong on the card at all.
- **Prevention check:** *this card names a date. If the owner answers after it, does any response
  behave differently?* If yes, that difference is stated in the card. If no, the date is noise and is
  cut.

## L-40 — an authorization is worth nothing until someone has checked the executor can physically perform the act (2026-08-20, run 61)

**What happened.** The owner answered **A** — *"executor may submit"* — at 15:04 UTC, closing a question
the loop had carried for ~35 hours across six runs. The reviewer scoped the transaction and the executor
began the preflight. **The submission could not be made**, and not for any reason the loop had ever
looked at: this executor's GitHub access is scoped to `in-c0/tuned`, so it holds no identity at
`plenaryapp/awesome-rss-feeds` and cannot open an issue there. That is a credential boundary and a
mandatory stop.

**Why it is a lesson and not just a bad break.** The admissibility test in
[DISTRIBUTION.md](DISTRIBUTION.md) is five careful conditions about *the venue* and *the measurement*:
does it permit this post (A1), by this author (A2), to a usable destination (A3), that is fresh (A4),
in a way whose result would be visible (A5). **Every one of them is about whether the act is
permissible or interpretable. Not one asks whether the actor can carry it out.** So the loop spent
runs 55–60 clearing permissions for a mechanism it had never confirmed it could reach, and the owner
spent a decision authorizing an act the executor could not perform. **The check that would have caught
it costs one tool call and could have been made at run 55, before A5 was built and before the card was
ever opened.**

**The generalisable shape.** *Permission and capability are different questions, and this loop had
instrumented only the first.* The A-series was built after EXP-002 — where the defect was posting
somewhere the rules forbade it — so it was designed entirely around *may we*. The failure mode it
cannot see is *can we*, and that one is invisible from inside the venue's rules: nothing on
`awesome-rss-feeds`' contribution page says anything about the reach of the reader looking at it.

**A second, sharper edge.** When the block appeared, an alternative was available and inside the
owner's authorization: the venue's Google form takes no account, no sign-in and no prose. Using it
would have been *permitted*. It was still declined, because it returns **no receipt and no canonical
URL**, which collapses EXP-009's Fork D into an unfalsifiable claim — *"nobody wanted it"*, *"it was
never admissible"* and *"it never arrived"* would be forever indistinguishable. **A blocked path is
the moment the loop is most tempted to take a worse-measured one**, and the fact that the substitute
is authorized is not the same as the fact that it is gradeable.

- **Shipped:** condition **A0** in [DISTRIBUTION.md](DISTRIBUTION.md)'s procedure, ahead of A1 — *name
  the exact mechanism the venue requires, and confirm the executor holds what it needs* — with its
  answer recorded as evidence. A **no** does not disqualify a venue; it changes who the owner action is
  *for*, and that belongs on the card from the first run rather than after the authorization arrives.
- **Prevention check:** *before asking anyone to authorize an act — have I confirmed, by trying the
  cheapest read against the real target, that I could perform it if the answer were yes?* If not, the
  card is asking for permission the executor may not be able to spend.

---

## L-41 — a rule written to catch an error does not catch the error in the sentence next to it (2026-08-20, run 62)

**What happened.** Run 61 discovered it could not open an issue at `awesome-rss-feeds`, and correctly
made that a mandatory stop. It then shipped **A0** — *"before any A1 read, confirm the executor holds
what the mechanism needs"* — and [L-40](#l-40--an-authorization-is-worth-nothing-until-someone-has-checked-the-executor-can-physically-perform-the-act-2026-08-20-run-61)'s
prevention check: *"before asking anyone to authorize an act, have I confirmed I could perform it if
the answer were yes?"* **In the same commit, in the same card, it offered the owner a fallback —
"use the Google form instead, the executor can submit it unaided" — without applying either.**

It cannot. Its egress answers **403 CONNECT to every host**, `docs.google.com` included; its one
third-party vantage is a **GET-only reader** that contains no `.fill()`, `.click()` or POST; the only
form-filling spec in the repository targets Tuned's own `baseURL`. **There is no instrument here that
can write to any third party.** So a second owner decision was queued against a second act the
executor could not perform — the identical failure, one run later, discovered *before* the owner
answered instead of after only because this run happened to look.

**Why it is a distinct lesson rather than L-40 repeated.** L-40 says *check capability before asking*.
This run shows that **writing that rule down does not apply it** — and specifically, that the rule was
applied to the option under examination and not to the option offered as its replacement. **A
substitute is a proposal, and it inherits every precondition of the thing it substitutes for.** The
loop's attention was entirely on the *primary* route, where the check had just failed painfully; the
fallback slipped through as an aside in the same paragraph, phrased as a reassurance rather than a
claim, and nobody re-ran the test on it.

**The generalisable shape.** *A new check gets applied to the case that motivated it, and the cases
sitting beside it stay unchecked.* A rule born from one incident inherits that incident's shape, so
the run that ships it is the run **least** likely to apply it evenly — the author is still reasoning
about the specific failure, not the class. **A remedy is not in force on the run that writes it; it is
in force on the run that audits everything the remedy now covers.**

**The second edge, and the sharper one.** Run 61 *did* decline the Google form — for A5, because a form
leaves no receipt. The reasoning was sound and the conclusion was right. **It was right for the
interesting reason while a plain one was also true and unexamined**, and a decision that lands correctly
on its subtle ground can conceal that its obvious ground was never checked. **Being right is not
evidence of having looked.** Had the owner answered A-2, the loop would have discovered the plain
reason at the moment of acting, for the second consecutive run.

- **Evidence and cost:** no owner decision was spent this time — the correction landed ~30 minutes
  after the card was posted and before any answer. Cost is one run, and one withdrawn option.
- **Shipped:** A0 amended from a per-venue question to a **per-mechanism** one with a single answer for
  every third-party venue — **NO** — recorded once in [DISTRIBUTION.md](DISTRIBUTION.md)'s register
  rather than seven times; the false sentence struck where it was published, in
  [STATUS.md](STATUS.md), [DASHBOARD.md](DASHBOARD.md) and DISTRIBUTION.md alike; **A-2 withdrawn** and
  replaced with **B**, which names building a submitting instrument as the capability decision it
  actually is.
- **Recorded and refused:** a Google Form accepts a `formResponse` over **GET**, so the read-only reader
  could mechanically be pointed at a submitting URL. **That route is not taken and is written down so no
  later run rediscovers it as a clever unblock** — it is using an instrument whose documented contract
  is *"this reads source material"* to perform a third-party write, the same shape as spoofing a user
  agent past a bot check.
- **Prevention check:** *when shipping a new gate, list every item it now applies to and run it against
  all of them in the same run — starting with anything the same document offers as an alternative.* And
  separately: *when declining something, name every reason it fails, not the most interesting one* — a
  single sufficient reason ends the analysis and hides whether the cheap checks were ever made.
