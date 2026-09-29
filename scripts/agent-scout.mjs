#!/usr/bin/env node
// `@sportstech`'s publisher, running without a person in it. The reasoning, the remit
// translation and the bar are in scripts/lib/agent-scout.mjs; this file is the hands.
//
//   node scripts/agent-scout.mjs                 # screen and report. Publishes NOTHING.
//   node scripts/agent-scout.mjs --publish       # also publish the top selection, if any
//   node scripts/agent-scout.mjs --amend-item 280 --amend-source 10.3390/x  # correct one line
//                                               # ...and --apply to actually send it
//
// Options: --handle NAME  --window-days N  --page-size N  --max-reads N  --now ISO
//          --base URL  --out PATH  --json
//
// PUBLISHING NOTHING IS THE NORMAL OUTCOME AND EXIT 0. The bar's job is to be quiet. A run
// that screens 40 papers and selects none has done its work; a selector that publishes
// something every time it runs is a feed filler, which is EXP-008's failure mode 2 and the
// thing run 152 refused to do by hand. The one signal that is NOT green is a failure to
// read the source at all, because that is the loop's instruments lying rather than the
// literature being thin — the distinction the whole operating record keeps paying for.
//
// AT MOST ONE PUBLICATION PER RUN, ENFORCED HERE AND NOT IN THE SCHEDULE. The cap is in the
// code because a schedule is a configuration a later edit can widen without anyone noticing,
// and "recurring agent value WITHOUT attention overload" is a doctrine constraint rather
// than a tuning parameter. Combined with the daily schedule in
// .github/workflows/agent-scout.yml, the ceiling on this agent is one find a day, and its
// expected rate is well under that.
//
// HOW MUCH OF SOMEONE ELSE'S SERVICE THIS USES, stated because it is a third party acting
// on Tuned's behalf: one search request, then at most --max-reads full-text requests that the
// archive ANSWERS plus at most as many again that it does not, with a pause between them,
// against Europe PMC's documented key-free REST API. A request the archive could not answer
// costs no read slot, because it read nothing — see `fullTextStatusDefect`, run 206 — so the
// ceiling on requests is two per read slot and the ceiling on documents graded is one.
//
// It declares itself honestly in its User-Agent with a contact address, follows no links, and
// fetches no page a human would otherwise be served — `fullTextXML` is the archive's own machine
// endpoint. Nothing here varies its identity to get a different answer, and NOTHING HERE
// RETRIES A REFUSAL: a service that said no is asked exactly once, and asking it again is
// exactly the behaviour that sentence was written to forbid. What IS asked again, at most
// twice and five seconds apart, is a NON-ANSWER — the service unable to answer rather than
// declining to. That arrives in two forms and both take the same path: a 200 whose body is
// not a search result (`searchResponseDefect`, run 187) and a 5xx that means "could not"
// (`searchStatusDefect`, run 202, after a 503 cost the 2026-09-28 screen its whole day).
// The distinction is load-bearing, it is refusal-vs-stutter and never 2xx-vs-not, and
// `searchWithRetry` is where the two meet.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateNomination } from "../qa/nominations/index.mjs";
import {
  AMEND_WHY_MAX,
  DEFAULT_WINDOW_DAYS,
  buildSearchQuery,
  composeAmendedWhy,
  composeWhy,
  describeRefusal,
  describeResponseShape,
  recordQuery,
  selectQuotation,
  extractBodyText,
  extractMethodsText,
  fullTextStatusDefect,
  fullTextUrl,
  grade,
  gradeMetadata,
  idempotencyKeyFor,
  nominationEntry,
  nominationFilename,
  parseSearchResults,
  searchResponseDefect,
  searchStatusDefect,
  rankSelected,
  searchUrl,
} from "./lib/agent-scout.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// An honest, contactable identity. The loop's standing rule for every fetcher it owns
// (scripts/prod-http.sh) is that it never borrows a browser's user agent, and a reader that
// declares itself is the only kind this repository ships.
export const USER_AGENT = "TunedAgentScout/1.0 (+https://justtuned.com; agent feed @sportstech; legal@justtuned.com)";

const MAX_FULL_TEXT_BYTES = 3_000_000;

function parseArgs(argv) {
  const flags = Object.create(null);
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) flags[key] = true;
    else {
      flags[key] = next;
      i += 1;
    }
  }
  return flags;
}

function isoDay(date) {
  return date.toISOString().slice(0, 10);
}

/** Sources this feed has already published, read from the nomination registry.
 *
 *  The registry is the repository's record of what was put in front of a reader, so it is
 *  also the only dedupe list that cannot drift from production without CI noticing
 *  (scripts/validate-nominations.mjs). The operator plane's idempotency key is the second
 *  guard; this one exists so a duplicate is REJECTED WITH A REASON in the run record rather
 *  than silently swallowed by a replay guard at the far end. */
export function publishedSources(dir = path.join(REPO_ROOT, "qa", "nominations")) {
  const urls = [];
  const dois = [];
  let files = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  } catch {
    return { urls, dois };
  }
  for (const file of files) {
    try {
      const entry = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      if (typeof entry.url === "string") {
        urls.push(entry.url);
        const doi = entry.url.match(/10\.\d{4,9}\/[^\s"?&]+/);
        if (doi) dois.push(doi[0]);
      }
      if (typeof entry.doi === "string") dois.push(entry.doi);
    } catch {
      // A malformed registry entry is validate-nominations.mjs's failure to report, not
      // this run's to swallow into a wrong dedupe list — but it must not stop the screen.
      console.log(`  note: could not read ${file} for the dedupe list`);
    }
  }
  return { urls, dois };
}

async function getJson(url, fetchImpl) {
  const res = await fetchImpl(url, { headers: { accept: "application/json", "user-agent": USER_AGENT } });
  if (!res.ok) {
    // A refusal and a stutter both arrive here as a status line. `searchStatusDefect` is the
    // only thing that tells them apart, and it hangs its verdict on the error rather than
    // deciding the retry itself — the loop stays the single place that asks again.
    const defect = searchStatusDefect(res.status);
    const err = new Error(defect === "" ? `HTTP ${res.status} from Europe PMC search` : defect);
    if (defect !== "") err.searchDefect = defect;
    throw err;
  }
  return await res.json();
}

/** One full-text read. `unanswered` is the load-bearing field and it is NOT "did I get an
 *  XML document" — it is "did the archive answer the question". A document the archive says it
 *  does not have is an answer, and the bar is entitled to act on it. A 503, or a socket that
 *  died, is not an answer about the document at all, and anything the screen concludes from it
 *  is a conclusion about Europe PMC's afternoon. `fullTextStatusDefect` holds the line. */
async function getFullText(url, fetchImpl) {
  let res;
  try {
    res = await fetchImpl(url, { headers: { accept: "application/xml", "user-agent": USER_AGENT } });
  } catch (err) {
    // Nothing was read and the archive did not decline: the same side of the line as a 5xx.
    return { xml: "", note: `fetch threw: ${String(err).slice(0, 200)}`, unanswered: true };
  }
  if (!res.ok) {
    const defect = fullTextStatusDefect(res.status);
    return { xml: "", note: defect === "" ? `HTTP ${res.status}` : defect, unanswered: defect !== "" };
  }
  const xml = await res.text();
  if (xml.length > MAX_FULL_TEXT_BYTES) return { xml: xml.slice(0, MAX_FULL_TEXT_BYTES), note: `truncated at ${MAX_FULL_TEXT_BYTES} bytes`, unanswered: false };
  return { xml, note: "", unanswered: false };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** How many times the one search may be asked before the cycle is abandoned, and how long
 *  to wait between. Three and five seconds: enough to cross a transient, small enough that a
 *  genuinely broken endpoint costs the daily screen fifteen seconds rather than a retry storm. */
const SEARCH_ATTEMPTS = 3;
const SEARCH_RETRY_PAUSE_MS = 5_000;

/** The one search, asked again when what comes back is not an answer.
 *
 *  WHAT WENT WRONG WITHOUT THIS. Run 184 established that Europe PMC intermittently answers
 *  200 with a body carrying no `hitCount`, and built `searchResponseDefect` so the publisher
 *  would stop reporting that as a quiet week. Correct, and it left the screen dying instead:
 *  the 2026-09-23 02:40Z scheduled screen threw at eleven seconds, published nothing, and
 *  uploaded NO record at all. The identical query dispatched twenty minutes later
 *  (run 35847824491) screened 35, reached a verdict on every one and selected 7 — the same
 *  recovery run 184 measured at 2h19m on 2026-09-22. Two of the last two days, the feed's only
 *  content pipeline was killed by a hiccup that a second request clears.
 *
 *  WHY A RETRY AND NOT A LOUDER FAILURE. The bar's refusal is about HONESTY — never call a
 *  failed search a quiet cycle — and that is fully preserved: the defect still decides, the
 *  cycle still dies if the answer never arrives, and nothing unusable is ever screened. The
 *  cadence is the thing EXP-013 is actually asking about, and a publisher that skips a day
 *  whenever an upstream stutters answers that question with an artefact of someone else's
 *  uptime. Refusing to screen a bad answer and refusing to ask again are separate decisions,
 *  and only the first one was ever argued for.
 *
 *  WHAT A STATUS LINE CHANGED, AND WHAT IT DID NOT. Run 187 left every non-2xx unretried on
 *  the reasoning that it is Europe PMC declining. That is true of a 4xx and false of a 503,
 *  which RFC 9110 defines as the server temporarily unable — and on 2026-09-28 a 503 killed
 *  the scheduled screen one second in, with no record uploaded, exactly as the body defect
 *  had five days earlier. So the retriable set is now decided by `searchStatusDefect` rather
 *  than by the status being 200, and a refusal — every 4xx, 429 among them — is still asked
 *  exactly once and rethrown untouched. The promise did not move; the test of what counts as
 *  a refusal did. */
async function searchWithRetry({ query, pageSize, fetchImpl, pause, log }) {
  const url = searchUrl(query, { pageSize });
  let defect = "";
  let shape = "";
  for (let attempt = 1; attempt <= SEARCH_ATTEMPTS; attempt += 1) {
    let body;
    try {
      body = await getJson(url, fetchImpl);
    } catch (err) {
      // A REFUSAL is rethrown untouched and never asked again; that promise is unchanged and
      // `searchStatusDefect` is what keeps it. A NON-ANSWER that arrived as a status rather
      // than as a body joins the path the unusable body already takes, because it is the same
      // event wearing a different hat.
      if (!err?.searchDefect) throw err;
      defect = err.searchDefect;
      shape = "the request returned no body to describe";
      log(`search attempt ${attempt} of ${SEARCH_ATTEMPTS} was not an answer: ${defect}`);
      if (attempt < SEARCH_ATTEMPTS) await pause(SEARCH_RETRY_PAUSE_MS);
      continue;
    }
    const candidates = parseSearchResults(body);
    defect = searchResponseDefect(body, candidates);
    if (defect === "") {
      if (attempt > 1) log(`search answered on attempt ${attempt} of ${SEARCH_ATTEMPTS}`);
      return { body, candidates };
    }
    // The run holding the unusable body is the only one that will ever see it. Say what it
    // was, in key names and types, so the next diagnosis does not start from nothing.
    shape = describeResponseShape(body);
    log(`search attempt ${attempt} of ${SEARCH_ATTEMPTS} was not an answer: ${defect} — ${shape}`);
    if (attempt < SEARCH_ATTEMPTS) await pause(SEARCH_RETRY_PAUSE_MS);
  }
  throw new Error(
    `unusable Europe PMC search response after ${SEARCH_ATTEMPTS} attempts: ${defect} — ${shape}`
  );
}

/** One screening cycle. Pure except for the injected `fetchImpl` and `pause`, so the whole
 *  pipeline — not merely the bar — is exercisable against recorded responses. */
export async function screen({
  now = new Date(),
  windowDays = DEFAULT_WINDOW_DAYS,
  pageSize = 50,
  maxReads = 12,
  maxUnanswered = null,
  fetchImpl = fetch,
  pause = sleep,
  published = publishedSources(),
  log = console.log,
} = {}) {
  const to = isoDay(now);
  const from = isoDay(new Date(now.getTime() - windowDays * 86_400_000));
  const query = buildSearchQuery({ from, to });
  const nowIso = now.toISOString();

  log(`query: ${query}`);

  // A 200 is not the same as an answer. Refusing to screen one, rather than counting zero
  // candidates and reporting a quiet cycle, is `searchResponseDefect`'s whole point; asking
  // again before giving up the day is `searchWithRetry`'s.
  const { body, candidates } = await searchWithRetry({ query, pageSize, fetchImpl, pause, log });

  log(`search returned ${candidates.length} candidate${candidates.length === 1 ? "" : "s"} (hitCount ${body?.hitCount ?? "?"})`);

  const observations = [];
  const passedMetadata = [];

  for (const candidate of candidates) {
    const meta = gradeMetadata(candidate, { now: nowIso, windowDays, publishedUrls: published.urls, publishedDois: published.dois });
    if (meta.verdict === "rejected") {
      observations.push({ candidate, verdict: "rejected", clause: meta.clause, detail: meta.detail, encountered: false });
      continue;
    }
    passedMetadata.push({ candidate, meta });
  }

  log(`${passedMetadata.length} passed metadata screening; reading full text for at most ${maxReads}`);

  let reads = 0;
  let unanswered = 0;
  // How many non-answers this screen will absorb before it stops asking. A separate allowance
  // and not a share of `maxReads`, because a read the archive did not answer taught the bar
  // nothing and must not spend a slot that a readable candidate is queued for.
  //
  // WHY A TOTAL AND NOT A RUN OF CONSECUTIVE ONES, which was the first thing tried. On
  // 2026-09-29 the eight 503s arrived FIRST and consecutively, and the three papers that
  // passed the bar were read after them. Any consecutive-failure breaker tight enough to be
  // worth having (four, five) would have stopped that screen before it reached a single one of
  // its selections and published nothing at all. Europe PMC was refusing individual documents
  // intermittently, not lying down, and a breaker that cannot tell those apart makes the
  // outage worse. The real incident is the calibration: at `maxReads` the screen rides out
  // eight non-answers and still reads its full twelve.
  //
  // This is not a retry and nothing here retries anything. Each request is for a DIFFERENT
  // document, and a 503 about paper A is not evidence about paper B. The allowance is a bound
  // on total work, so an archive that is wholly down costs the cycle a bounded number of
  // requests and then silence, which is what a publisher that must fail quiet should do.
  const unansweredAllowance = Number.isFinite(maxUnanswered) ? maxUnanswered : maxReads;
  for (const { candidate } of passedMetadata) {
    if (unanswered >= unansweredAllowance) {
      observations.push({
        candidate,
        verdict: "deferred",
        clause: "archive-unavailable",
        detail: `not read this cycle — the archive could not answer ${unanswered} read${unanswered === 1 ? "" : "s"}, so this screen stopped asking`,
        encountered: false,
      });
      continue;
    }
    if (reads >= maxReads) {
      observations.push({
        candidate,
        verdict: "deferred",
        clause: "read-budget",
        detail: `not read this cycle — ${maxReads} full-text reads already spent`,
        encountered: false,
      });
      continue;
    }
    if (reads + unanswered > 0) await pause(1200);
    const { xml, note, unanswered: nonAnswer } = await getFullText(fullTextUrl(candidate.pmcid), fetchImpl);
    if (nonAnswer) {
      // Deferred, not rejected, and the clause says whose failure it was. Nothing was learned
      // about this candidate, so nothing is recorded about it: it is eligible tomorrow on the
      // same terms it was eligible today.
      unanswered += 1;
      observations.push({
        candidate,
        verdict: "deferred",
        clause: "unanswered",
        detail: note,
        encountered: false,
      });
      continue;
    }
    reads += 1;
    const fullText = extractBodyText(xml);
    // The methods section is extracted from the same XML and passed separately, because
    // `DESIGN_SIGNATURES` is graded there and nowhere else (LESSONS L-119). `grade` fails
    // closed on an empty one, so forgetting this argument would silence the publisher
    // rather than loosen it — `agent-scout.test.mjs` asserts this call site passes it.
    const methodsText = extractMethodsText(xml);
    const g = grade(candidate, { now: nowIso, fullText, methodsText, fetchNote: note, windowDays, publishedUrls: published.urls, publishedDois: published.dois });
    observations.push({
      candidate,
      verdict: g.verdict,
      clause: g.clause,
      detail: g.detail ?? "",
      encountered: fullText.length > 0,
      methodsCharacters: methodsText.length,
      bodyCharacters: fullText.length,
      grade: g.verdict === "selected" ? g : undefined,
    });
  }

  const selected = rankSelected(observations.filter((o) => o.verdict === "selected").map((o) => ({ candidate: o.candidate, grade: o.grade })));

  return {
    ran_at: nowIso,
    window: { from, to, days: windowDays },
    query,
    hit_count: body?.hitCount ?? null,
    returned: candidates.length,
    full_text_reads: reads,
    full_text_unanswered: unanswered,
    observations,
    selected,
  };
}

/** Publish one selection through the operator plane. The plane, not a second code path: it
 *  already owns the owner scoping, the handle validation, the field budgets, the replay
 *  guard and the retract/restore audit trail, and an agent that published around it would be
 *  an authority this repository has never reviewed. */
export async function publishOne({ handle, base, key, find, fetchImpl = fetch, log = console.log }) {
  const payload = {
    url: find.url,
    title: find.title,
    category: "Research",
    why: find.why,
    idempotency_key: find.idempotencyKey,
  };
  const res = await fetchImpl(`${base}/api/operator/agents/${handle}/items`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "x-operator-key": key,
      "x-operator-principal": "agent-scout",
      "user-agent": USER_AGENT,
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    // Deliberately not echoed: an unexpected body from a credentialed endpoint is the one
    // thing that must not reach a public log.
    log(`  publish: HTTP ${res.status} with a body that is not JSON (${text.length} bytes, not printed)`);
    return { status: res.status, published: false, duplicate: false, itemId: null, createdAt: null };
  }
  log(`  publish: HTTP ${res.status} · published=${parsed.published ?? false} duplicate=${parsed.duplicate ?? false} item_id=${parsed.item_id ?? "none"} created_at=${parsed.created_at ?? "none"}${parsed.error ? ` error=${parsed.error}` : ""}`);
  return {
    status: res.status,
    published: Boolean(parsed.published),
    duplicate: Boolean(parsed.duplicate),
    itemId: parsed.item_id ?? null,
    // The one field qa/nominations/ cannot be written without, kept rather than dropped.
    // An older plane that does not send it reads `null` here, which is the honest answer
    // and not a clock this process invents to fill the gap.
    createdAt: typeof parsed.created_at === "string" ? parsed.created_at : null,
    error: parsed.error,
  };
}

// ---------------------------------------------------------------------------
// Correcting a line that is already in front of readers
// ---------------------------------------------------------------------------
//
// Item 280 — this feed's first autonomous selection — carries a line that reports the
// agent's own screening and says nothing about the paper: true, checkable, and useless to
// the stranger who arrives from a directory of RSS feeds. The quotation rule shipped a day
// later and could not reach it, because the operator plane could publish and retract and had
// no way to correct.
//
// WHAT THIS MODE MAY AND MAY NOT DO. It re-reads ONE record's abstract, runs the same
// `selectQuotation` the publisher runs, and sends the composed line to the plane's amend
// route. It selects nothing, publishes nothing, and screens nothing. It never edits the
// title, the url or the source — a "correction" that changed which paper a find pointed at
// would be a different find wearing the same row — and it refuses outright when the
// identifier does not resolve to exactly one record, because an amendment quoting the wrong
// paper is worse than the line it replaced.
//
// REFUSING IS A NORMAL OUTCOME AND EXIT 0. When no sentence in the abstract qualifies, the
// existing line stays exactly as it is. The alternative to quoting nothing is writing
// something, and writing something about a result this agent has not understood is the
// summariser Tuned is not.

/** Exactly one Europe PMC record for one identifier, or a refusal with the reason. */
export async function fetchRecord({ source, fetchImpl = fetch }) {
  const query = recordQuery(source);
  if (query === "") {
    return { record: null, error: "source must be a PMCID (PMC1234567) or carry a DOI" };
  }
  const body = await getJson(searchUrl(query, { pageSize: 5 }), fetchImpl);
  const records = parseSearchResults(body);
  if (records.length !== 1) {
    return { record: null, query, error: `expected exactly one record for this identifier, got ${records.length}` };
  }
  return { record: records[0], query };
}

/** Send one corrected line through the operator plane's amend route. */
async function amendOne({ handle, base, key, itemId, why, reason, fetchImpl = fetch, log = console.log }) {
  const res = await fetchImpl(`${base}/api/operator/agents/${handle}/items/${itemId}/why`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      "x-operator-key": key,
      "x-operator-principal": "agent-scout",
      "user-agent": USER_AGENT,
    },
    body: JSON.stringify({ why, reason }),
  });
  const text = await res.text();
  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    log(`  amend: HTTP ${res.status} with a body that is not JSON (${text.length} bytes, not printed)`);
    return { status: res.status, changed: false };
  }
  log(
    `  amend: HTTP ${res.status} · changed=${parsed.changed ?? false} item_id=${parsed.item_id ?? "none"} why_length=${parsed.why_length ?? "?"}${parsed.error ? ` error=${parsed.error}` : ""}`
  );
  return { status: res.status, changed: Boolean(parsed.changed), why: parsed.why ?? "", error: parsed.error };
}

/** The `--amend-item` cycle end to end. Dry unless `--apply`. */
export async function amendCycle({ handle, base, itemId, source, apply, fetchImpl = fetch, log = console.log }) {
  log(`amending the public why-line of item ${itemId} on @${handle} from its own source`);
  const { record, query, error } = await fetchRecord({ source, fetchImpl });
  if (!record) {
    log(`::error::${error}${query ? ` (query ${query})` : ""}`);
    return { amended: false, exitCode: 1 };
  }
  log(`  record: ${record.title}`);
  log(`  url:    ${record.url}`);

  const { why, quotation } = composeAmendedWhy(record.abstract);
  if (why === "") {
    log(`  quote:  ${describeRefusal(quotation)}`);
    // WHOSE REFUSAL WAS IT — the source's, or this design's? A correction is held to a budget
    // 23 characters shorter than a publication's, because the operator plane appends its own
    // mark. So a refusal can mean "this abstract has no quotable finding" or "it has one and
    // the mark I chose to spend is what excluded it", and those are different facts about
    // different things. The second is a cost of a decision made in this run and has to be
    // visible rather than folded into the first.
    const atPublishBudget = selectQuotation(record.abstract ?? "");
    log(
      atPublishBudget.quote === ""
        ? `  budget: not the mark's doing — the publisher's own budget refuses this abstract too (${atPublishBudget.refusedBecause})`
        : `  budget: THE CORRECTION MARK IS WHAT REFUSED IT. A ${atPublishBudget.quote.length}-character sentence qualifies at the publisher's budget and not at the correction's`
    );
    log("  NOTHING AMENDED. The line stays as it is: an agent with no quotable sentence has nothing to correct it to.");
    return { amended: false, quotation, atPublishBudget, exitCode: 0 };
  }

  log(`  quote:  ${quotation.quote.length} chars from the ${quotation.source}, ${quotation.families.join(" + ")}; verbatim substring of the abstract confirmed`);
  log(`  why:    ${why}`);
  log(`  length: ${why.length} of ${AMEND_WHY_MAX} (the plane appends its own correction mark)`);

  if (!apply) {
    log("  dry run — nothing sent. Re-dispatch with apply to send this line.");
    return { amended: false, why, quotation, exitCode: 0 };
  }

  const key = process.env.AGENT_OPERATOR_KEY ?? "";
  if (key.trim() === "") {
    log("::error::apply was requested but AGENT_OPERATOR_KEY is absent. Refusing to report a correction that did not happen.");
    return { amended: false, why, quotation, exitCode: 1 };
  }
  // Composed from what this run did and nothing else. The reason is the field a human reads
  // when auditing an amendment months later, so it states the mechanism — which rule chose
  // the sentence, out of how many, and that it was checked — rather than characterising the
  // line it replaced, which this run never read.
  const reason = `agent-scout: line replaced by one sentence of ${quotation.considered} considered in the ${quotation.source}, ${quotation.quote.length} characters, verbatim substring confirmed, chosen by the same rule the publisher uses`;
  const result = await amendOne({ handle, base, key, itemId, why, reason, fetchImpl, log });
  return {
    amended: result.changed,
    why: result.why || why,
    quotation,
    result,
    exitCode: result.status === 200 ? 0 : 1,
  };
}

export function renderTable(report) {
  const rows = report.observations.map((o) => {
    const verdict = o.verdict === "selected" ? "SELECTED" : o.verdict;
    // A selection reports the type Europe PMC gave it, because that is the evidence the
    // `research-article` clause acted on and it is the one thing a reader of this table
    // cannot infer from the title. Run 199 had to read the library to learn that its top
    // selection was typed as a research article; the record should have said so.
    const reason =
      o.verdict === "selected"
        ? `${o.grade.statistics.length} stat families, ${o.bodyCharacters} chars (methods ${o.grade.methodsCharacters}), typed ${(o.candidate.pubTypes || []).join("/") || "(none)"}`
        : `${o.clause}: ${o.detail}`;
    return `| ${verdict} | ${o.candidate.pmcid || o.candidate.id} | ${o.candidate.title.slice(0, 90)} | ${reason.slice(0, 150)} |`;
  });
  return ["| Verdict | Id | Title | Why |", "| --- | --- | --- | --- |", ...rows].join("\n");
}

/** The commit that last changed the bar, which is what an `autonomous-bar` entry must name.
 *  Returns null on a shallow clone or a missing git — a publication still succeeds; what is
 *  lost is the emitted entry, and saying so beats guessing a sha. */
function barCommit() {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%H %cI", "--", "scripts/lib/agent-scout.mjs"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
    }).trim();
    const [commit, committedAt] = out.split(" ");
    if (!/^[0-9a-f]{40}$/.test(commit ?? "") || !committedAt) return null;
    return { commit, committedAt };
  } catch {
    return null;
  }
}

/** The Actions run whose log shows this selection being made. `autonomous-bar` entries are
 *  refused without it, because the strings live in that log rather than in the commit. */
function recordRunUrl() {
  const server = process.env.GITHUB_SERVER_URL ?? "";
  const repo = process.env.GITHUB_REPOSITORY ?? "";
  const id = process.env.GITHUB_RUN_ID ?? "";
  if (!server || !repo || !id) return "";
  return `${server}/${repo}/actions/runs/${id}`;
}

/** Compose this publication's registry entry and leave it on disk for a run to commit.
 *
 *  Not committed here and not uploaded as an artifact: the file lands in the working tree next
 *  to the nine already there, and the log prints its path and its contents so a run that can
 *  read a job log — which is how this loop reads a screening record at all — can reproduce it
 *  exactly. Writing nothing is a normal outcome and never fails the publication. */
export function writeNomination({
  handle,
  find,
  publication,
  dir = path.join(REPO_ROOT, "qa", "nominations"),
  bar = barCommit(),
  recordRun = recordRunUrl(),
  log = console.log,
}) {
  const entry = nominationEntry({
    handle,
    find,
    publication,
    bar,
    recordRun,
    notes:
      "Emitted by scripts/agent-scout.mjs at the moment of publication rather than transcribed from this run's log afterwards. The screening record is the run named in preregistration.recordRun.",
  });
  if (entry === null) {
    log("  nomination: not composed — a publication needs an item id, the plane's created_at and a bar commit before it can be registered");
    return null;
  }
  const problems = validateNomination(entry, `item ${entry.itemId}`);
  if (problems.length > 0) {
    // Printed, not thrown. The publication has already happened; a registry rule this entry
    // cannot satisfy is a thing a run must see, not a reason to exit non-zero after the fact.
    log(`::warning::the composed nomination does not validate and was not written: ${problems.join("; ")}`);
    return null;
  }
  const file = path.join(dir, nominationFilename(entry));
  fs.writeFileSync(file, `${JSON.stringify(entry, null, 2)}\n`);
  log(`  nomination: qa/nominations/${path.basename(file)} — COMMIT THIS, or scout-gate.mjs cannot see this publication`);
  log(JSON.stringify(entry, null, 2));
  return file;
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const handle = typeof flags.handle === "string" ? flags.handle : "sportstech";
  const base = typeof flags.base === "string" ? flags.base : "https://justtuned.com";
  const now = typeof flags.now === "string" ? new Date(flags.now) : new Date();
  const windowDays = Number(flags["window-days"] ?? DEFAULT_WINDOW_DAYS);
  const pageSize = Number(flags["page-size"] ?? 50);
  const maxReads = Number(flags["max-reads"] ?? 12);
  const wantPublish = flags.publish === true || flags.publish === "true";

  // The correction mode runs INSTEAD of a screen, not alongside one. A run that screened and
  // amended in the same pass would make "this run selected nothing" and "this run corrected
  // something" share a log, and the counts EXP-013 grades come from screens only.
  const amendItem = flags["amend-item"];
  if (amendItem !== undefined && amendItem !== true) {
    const itemId = Number(amendItem);
    if (!Number.isSafeInteger(itemId) || itemId <= 0) {
      console.log("::error::--amend-item must be a positive item id");
      process.exitCode = 1;
      return;
    }
    const outcome = await amendCycle({
      handle,
      base,
      itemId,
      source: typeof flags["amend-source"] === "string" ? flags["amend-source"] : "",
      apply: flags.apply === true || flags.apply === "true",
    });
    if (outcome.exitCode !== 0) process.exitCode = outcome.exitCode;
    if (process.env.GITHUB_STEP_SUMMARY) {
      fs.appendFileSync(
        process.env.GITHUB_STEP_SUMMARY,
        [
          `### agent scout — correcting item ${itemId} on @${handle}`,
          "",
          outcome.why ? `Composed line (**${outcome.why.length}** chars):\n\n> ${outcome.why}` : "**No sentence in the abstract qualified. Nothing amended.**",
          "",
          outcome.amended ? "**Amended in production.**" : "Nothing was sent.",
          "",
        ].join("\n")
      );
    }
    return;
  }

  const report = await screen({ now, windowDays, pageSize, maxReads });

  const counts = report.observations.reduce((acc, o) => {
    acc[o.verdict] = (acc[o.verdict] ?? 0) + 1;
    return acc;
  }, Object.create(null));
  console.log("");
  console.log(renderTable(report));
  console.log("");
  // The unanswered count is printed only when it is non-zero, and it is printed next to the
  // read count on purpose: those are the two halves of what the cycle's budget actually bought,
  // and a screen whose pool was thinned by an outage must not read as a thin literature.
  console.log(
    `screened ${report.returned} · ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(" · ") || "nothing"} · full-text reads ${report.full_text_reads}` +
      (report.full_text_unanswered > 0 ? ` · unanswered by the archive ${report.full_text_unanswered}` : "")
  );
  if (report.full_text_unanswered > 0) {
    console.log(
      `  NOTE: Europe PMC could not answer ${report.full_text_unanswered} full-text read(s) this cycle. Those candidates are deferred, not rejected — nothing was learned about them, and they cost no read slot.`
    );
  }

  let find = null;
  if (report.selected.length > 0) {
    const top = report.selected[0];
    // Recorded before the line is composed, so a screen's log says whether the agent quoted
    // the source and, when it did not, which clause refused every sentence it considered.
    // "No quote" must read as a reason, never as an absence — the same discipline the bar's
    // own rejections follow.
    const quotation = selectQuotation(top.candidate.abstract ?? "");
    const why = composeWhy({
      candidate: top.candidate,
      grade: top.grade,
      observed: report.returned,
      observedOn: report.window.to,
    });
    if (why === "") {
      console.log("::warning::the top selection's why line could not be composed inside 280 characters — publishing nothing");
    } else {
      find = {
        url: top.candidate.url,
        title: top.candidate.title,
        why,
        doi: top.candidate.doi,
        pmcid: top.candidate.pmcid,
        journal: top.candidate.journal,
        firstPublicationDate: top.candidate.firstPublicationDate,
        idempotencyKey: idempotencyKeyFor(handle, top.candidate.url),
      };
      console.log("");
      console.log("top selection");
      console.log(`  title: ${find.title}`);
      console.log(`  url:   ${find.url}`);
      console.log(`  typed: ${(top.candidate.pubTypes || []).join("/") || "(none)"}`);
      console.log(`  why:   ${find.why}`);
      console.log(`  key:   ${find.idempotencyKey}`);
      console.log(
        quotation.quote === ""
          ? `  quote: ${describeRefusal(quotation)}`
          : `  quote: ${quotation.quote.length} chars from the ${quotation.source}, ${quotation.families.join(" + ")}; verbatim substring of the abstract confirmed`
      );
    }
  } else {
    console.log("");
    console.log("no candidate passed the bar this cycle. Publishing nothing is the expected outcome.");
  }

  let publication = null;
  if (wantPublish && find) {
    const key = process.env.AGENT_OPERATOR_KEY ?? "";
    if (key.trim() === "") {
      console.log("::error::--publish was requested but AGENT_OPERATOR_KEY is absent. Refusing to report a publication that did not happen.");
      process.exitCode = 1;
    } else {
      publication = await publishOne({ handle, base, key, find });
      if (publication.status !== 201 && publication.status !== 200) process.exitCode = 1;
      writeNomination({ handle, find, publication });
    }
  } else if (wantPublish) {
    console.log("publish requested, but there is nothing to publish. Exit 0 — an empty cycle is not a failure.");
  }

  const out = typeof flags.out === "string" ? flags.out : "";
  if (out) {
    const serialisable = {
      ...report,
      handle,
      observations: report.observations.map((o) => ({
        verdict: o.verdict,
        clause: o.clause,
        detail: o.detail,
        pmcid: o.candidate.pmcid,
        doi: o.candidate.doi,
        title: o.candidate.title,
        url: o.candidate.url,
        journal: o.candidate.journal,
        first_publication_date: o.candidate.firstPublicationDate,
        body_characters: o.bodyCharacters ?? 0,
        statistics: o.grade?.statistics ?? [],
        designs: o.grade?.designs ?? [],
      })),
      selected: report.selected.map((s) => ({ pmcid: s.candidate.pmcid, title: s.candidate.title, url: s.candidate.url })),
      find,
      publication,
    };
    fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
    fs.writeFileSync(path.resolve(out), `${JSON.stringify(serialisable, null, 2)}\n`);
    console.log(`record written to ${out}`);
  }

  if (process.env.GITHUB_STEP_SUMMARY) {
    const lines = [
      `### agent scout — @${handle}`,
      "",
      `Screened **${report.returned}** candidates from Europe PMC (${report.window.from} → ${report.window.to}), read **${report.full_text_reads}** full texts.`,
      ...(report.full_text_unanswered > 0
        ? ["", `⚠️ Europe PMC could not answer **${report.full_text_unanswered}** full-text read(s). Those candidates are **deferred, not rejected** — this cycle's pool was thinned by the archive, not by the literature.`]
        : []),
      "",
      renderTable(report),
      "",
      find ? `**Top selection:** [${find.title}](${find.url})\n\n> ${find.why}` : "**Nothing passed the bar this cycle.**",
      "",
      publication
        ? `Publication: HTTP ${publication.status} · published=${publication.published} · duplicate=${publication.duplicate} · item_id=${publication.itemId ?? "none"} · created_at=${publication.createdAt ?? "none"}`
        : "No publication attempted.",
    ];
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().catch((err) => {
    console.log(`::error::agent scout failed before it could decide anything: ${String(err)}`);
    process.exit(1);
  });
}
