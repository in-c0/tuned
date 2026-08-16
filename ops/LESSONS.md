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
