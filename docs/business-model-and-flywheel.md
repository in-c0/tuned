# Tuned — business model and flywheel architecture (stage 1 → 2)

Written 2026-11-11 for CVF issue
[#300](https://github.com/in-c0/combinatory-venture-farming/issues/300) — Ji's stage-1→2 criteria
`bizmodel` ("비즈니스 모델") and `flywheel` ("자원이 더 많은 자원을 부르는 구조의 아키텍처").

It builds on decisions already made, and does not reopen them:

- **First paying customer = niche B2B teams** (coaches, clubs, labs) subscribing to topic-specific agent
  feeds — Ji, 2026-11-09 ([DECISIONS](../ops/DECISIONS.md#2026-11-09--owner-decisions-b2b-teams-first-ai-labelled-why-it-matters-the-flywheel-turns-once)).
- **Doctrine** — humans contribute attention, not content; provenance is explicit; never a generic
  summarizer ([NORTH_STAR](../ops/NORTH_STAR.md#doctrine-non-negotiable)).
- **The smallest flywheel already turns once in code** (`src/requests.ts`, `test/flywheel.test.ts`):
  find page → search arrival → team CTA → agent request → owner approves → new agent feed → more find pages.

What was missing, per Ji's note on the stage card ("프리뷰는 있지만 자원이 자원을 부르는 구조는 설계 안 됨"),
is (1) who pays what and how the money arrives, and (2) the *set* of loops in which each resource Tuned
accumulates makes the next unit of that resource cheaper to get. Both are below. Every current number is
from [`ops/metrics/latest.json`](../ops/metrics/latest.json) (`generated_at` 2026-11-11T00:37Z, the 31
UTC days 2026-10-12 → 2026-11-11); everything else is labelled as a design target or an assumption.

---

## 1. Business model

### 1.1 Who pays, for what

| | |
| --- | --- |
| **Customer** | A small team that must keep up with a narrow, fast literature it cannot read in full: a club's sports-science staff, a physio clinic, a university lab, a wearables product team. 2–15 people, one shared topic. |
| **Job** | "Tell us, every week, the few new things in *our* niche worth our attention — and show us why, and where it came from." |
| **What they buy** | A **managed topic agent**: an agent feed that screens open sources for their remit, selects with stated reasons, publishes with the provenance chain, and learns from the team's stars/skips. |
| **Why not a free alert / generic AI summary** | Google Scholar alerts and RSS give volume, not selection; AI summarizers give text, not provenance. Tuned's unit is *a selection with its chain* ("observed → selected by agent → starred by human"), and the team's own attention is what tunes it. |
| **Why Tuned can serve it cheaply** | The agent pipeline (`agent-scout.yml`, `src/operator.ts`), the find pages, RSS, the AI "why it matters" note and the request→approve→mint path all exist. A new team is a new remit, not new software. |

### 1.2 Plans (design; prices are a recommendation for Ji)

| Plan | Price (recommended default) | Includes | Role in the loop |
| --- | --- | --- | --- |
| **Public** | Free | Every public feed page, find page and RSS. No account. | Acquisition surface: each public find is an indexable page (Loop A). |
| **Team** | **AUD $49 / month per topic agent**, first 30 days free | One managed agent on the team's remit; public *or* unlisted feed; up to 10 team members who can star/skip/hide; weekly "few things" digest; the team's name on the feed ("curated for …") if public. | The paying unit. |
| **Team+** | AUD $149 / month | Up to 5 topic agents, shared review queue, coverage view ("what we screened vs. selected"). | Expansion revenue from the same account. |
| **Pro (later)** | ~AUD $17 / month (existing [NORTH_STAR](../ops/NORTH_STAR.md#commercial-hypothesis-owner-brief-2026-08-06--see-brief-2026-08-06md-for-verbatim) frame) | Personal private desk. | Deferred: the single-player desk measured 0 activation in 60 days ([CLOSEOUT](../ops/CLOSEOUT.md)). |

Why per-topic pricing: cost and value both scale with the number of remits screened, not seats; seats
are free so the whole team stars and skips — which is exactly the signal Loop B needs.

**Discount for public feeds.** A team that keeps its agent public (free find pages for Loop A) gets the
first plan year at the same price with no unlisted option needed — public is the default; *unlisted* is
the premium, not public. This keeps the acquisition surface growing with every customer.

### 1.3 Unit economics (assumptions, to be replaced by measured cost)

- Marginal cost per topic agent: one scheduled screen per day (GitHub Actions minutes, free tier) +
  Workers AI calls for the publish-time note (≤ 1 per published find) + D1 rows. **Assumption:** under
  AUD $2 / agent / month at today's volumes; the first paying month must replace this with the Cloudflare
  bill line.
- At AUD $49 the gross margin target is ≥ 90 %. The binding cost is **Ji's review time** on approvals and
  remit set-up, which is why §2 Loop D exists.
- Break-even on Ji's attention, not on infra: 10 Team plans ≈ AUD $490 / month is the first milestone
  that proves the model; 100 is the stage-3 bar to propose.

### 1.4 How the money arrives (path, in order)

1. **Now — concierge pilot, no billing code.** An approved agent request becomes a 30-day free pilot.
   At day 30 the team is sent a **payment link**. Nothing is charged automatically.
2. **Payment link = Tier 0 for Ji.** Creating a Stripe (or Lemon Squeezy) account and one Payment Link per
   plan is an account/payment step only Ji can take (Project-harness `POLICY.md`). No price is shown on
   any page until that link exists.
3. **Then — entitlement in code.** A `team_plans` row (team, plan, status, `paid_through`) written by the
   provider's webhook; the feed keeps publishing while `paid_through` is in the future. Unlisted
   visibility and Team+ seats key off it. This is a small additive table; no auth or pricing logic moves
   until Ji has chosen the provider.

### 1.5 The model's falsifiable test

| Step | Counter (exists?) | Pass bar for stage 2 → 3 |
| --- | --- | --- |
| Search arrival on a find page | `item_view_search` (exists) | ≥ 1 / day sustained over 14 days |
| Team CTA used | `agent_request` (exists) | ≥ 5 non-bot requests |
| Approved pilot | `agent_requests_approved` (exists) | ≥ 3 |
| Paid after pilot | `team_plan_paid` (to build with §1.4.3) | ≥ 1 |

**Current reading (31 days):** `item_view` 1,355 but `item_render` 16 and `item_view_referred` 30;
`agent_request` **0**. The binding constraint is arrivals that are people, not the conversion page —
consistent with [EXP-011](../ops/EXPERIMENTS.md). That is what Loop A and Loop C below are designed against.

---

## 2. Flywheel architecture — "resources that call more resources"

Tuned accumulates five resources. The design rule is: **every resource must be an input to producing
more of at least one other resource, through code, without Ji in the loop except at one bounded
approval.**

| Resource | Where it lives | Feeds which loop |
| --- | --- | --- |
| **R1 Finds** — published selections with provenance | `items`, `/:handle/:id`, sitemap | A, C |
| **R2 Feeds / remits** — what each agent watches | `creators`, agent remit config | A, C, D |
| **R3 Attention signals** — stars, skips, hides by humans | `stars`, `skips`, desk | B |
| **R4 Teams** — paying accounts | `agent_requests` → `team_plans` | B, D, E |
| **R5 Money** | provider → `team_plans` | E |

```
              ┌──────────────── Loop A: search ────────────────┐
              ▼                                                │
   R2 feeds ──screen──▶ R1 finds ──index──▶ search arrivals ──CTA──▶ R4 teams
      ▲  ▲                 │  ▲                                    │   │
      │  │     Loop C      │  │ Loop B: taste                      │   │ Loop E
      │  └──cross-link─────┘  └──── R3 stars/skips ◀── team review ┘   │ money
      │                                                                ▼
      └──────── Loop D: remit templates (a team's remit is cloned) ◀── R5 ──▶ more screens/topics
```

### Loop A — Search (built, turning once)

`R2 feed → screen → R1 find page → sitemap → crawl → searcher lands → "Get an agent watching this topic
for your team" → agent request → approve → new R2 feed`.

- **Compounding:** each new feed adds pages on an adjacent long-tail topic; each page is another search
  entry point. More feeds → more pages → more arrivals → more feeds.
- **Code:** exists (`src/requests.ts`, `mintManagedAgent`, `test/flywheel.test.ts`).
- **Gap:** pages are thin entry points (16 rendered item views in 31 days). Fixed by Loop C, not by more
  pages.

### Loop B — Taste (team attention makes the agent better, which keeps the team)

`R4 team reviews → R3 stars/skips/hides → agent's selection prompt/threshold for that remit updates →
higher share of finds starred → team keeps paying and invites colleagues (free seats) → more R3`.

- **Compounding:** the agent for a remit improves with every review, and a better agent earns more
  reviews. It is also the moat: a competitor can copy the pipeline, not a team's accumulated taste.
- **Code to build:** (1) team members on a feed (seats, session-authenticated, extends `src/auth.ts`
  members); (2) per-remit preference record = the last N starred/skipped finds with reasons, fed to the
  scout's selection step; (3) counter `star_rate:<handle>` = stars ÷ (stars + skips) per week.
- **Guard:** signals change *selection*, never the provenance state — a find stays "selected by agent"
  until a human stars it ([doctrine](../ops/NORTH_STAR.md#doctrine-non-negotiable)).

### Loop C — Convergence (feeds make each other's pages richer)

`Two feeds independently select the same source → the find page shows "also selected by @x, @y" and links
both feeds → the page is stronger evidence (and a stronger search result) → visitors traverse to an
adjacent feed → each feed's audience is every other feed's audience`.

- **Compounding:** value grows with the *number of pairs* of feeds, not the number of feeds — the
  classic network term. This is the "attention network" step of the product sequence.
- **Code to build:** (1) canonical source key (DOI, else normalized URL) on `items`; (2) a convergence
  query at render time; (3) "also selected by" block + cross-links on `/:handle/:id`; (4) counter
  `item_view_crossfeed` (traversals between feeds).
- **Why it fixes Loop A's gap:** convergent finds are the pages most worth landing on; cross-links turn
  one arrival into several page views and expose the team CTA on adjacent topics.

### Loop D — Remit templates (one team's set-up becomes another team's one-tap start)

`A team's remit (topic, sources, inclusion rules) is published as a template on its feed page → a
similar team clones it from the CTA ("Get this agent for your team") → the approval is pre-filled →
Ji's review time per new team falls → more teams per hour of Ji`.

- **Compounding:** set-up cost — the binding cost in §1.3 — falls with every remit already built.
- **Code to build:** remit stored as structured data on the feed; "clone this agent" CTA that files an
  `agent_request` with `template_of=<handle>`; the `/home` queue shows template requests as one-tap.
- **Guard:** the existing caps (3 pending per address, 30 per UTC day, `MAX_MANAGED_AGENTS` per owner)
  stay; a template request is still a draft until approved.

### Loop E — Money (revenue buys coverage)

`R5 → budget for more screens per day / more sources / a larger model for the note on paid remits →
better finds → Loops A–C turn faster`.

- **Rule:** a fixed share (proposed 20 %) of Team revenue is the compute/source budget, recorded as a line
  in [DECISIONS](../ops/DECISIONS.md) like the old spend cap, so growth in coverage is paid by customers,
  not by Ji.

### 2.1 What "the flywheel is turning" means, measurably

| Loop | Health counter | Turning when |
| --- | --- | --- |
| A | `agent_request` (non-bot) per 30 days | > 0, then rising month on month |
| B | weekly `star_rate` per paid remit | rising over a pilot's first 4 weeks |
| C | `item_view_crossfeed` ÷ `item_render` | > 0.3 page views per arrival from cross-links |
| D | share of approvals that are template clones; Ji minutes per approval | rising share / falling minutes |
| E | revenue → compute line in DECISIONS | exists every paid month |

### 2.2 Build order (small shipped steps)

1. **Loop C, step 1 — canonical source key + "also selected by".** Uses only existing data (5 feeds,
   107 public finds), no account, no price; directly targets the measured bottleneck (arrivals that render).
2. **Loop D — "Get this agent for your team" clone CTA** on feed pages, filing a templated request.
3. **§1.4 step 1 — concierge pilot** wording on the approval message (30 days free, then a link).
4. **Loop B — team seats + per-remit preference record**, once the first pilot team exists.
5. **§1.4 step 3 — `team_plans` entitlement**, once Ji has created the payment link.

Each step is one PR with its own test, behind the existing gates (`npm run check`, `npm test`,
`npm run test:ops`). None changes auth settings, prices on a page, or refunds.

### 2.3 What Ji decides (and the default if she does nothing)

- **Price** — default: Team AUD $49 / topic agent / month, 30-day free pilot; Team+ AUD $149.
- **Payment provider** — default: Stripe Payment Links (Tier 0: Ji creates the account and links).
- Until both are decided, Tuned runs pilots for free and shows no price anywhere.
