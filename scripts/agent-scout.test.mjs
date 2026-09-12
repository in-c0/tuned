// Tests for @sportstech's autonomous selector.
//
// WHAT THESE HAVE TO PROVE, AND IT IS NOT "THE CODE RUNS". This selector publishes to a
// public feed with no human between it and a reader, so the only interesting question is
// what it REFUSES. Every clause therefore has a case that it rejects and a case that it
// admits, and the suite ends with mutations: thresholds deliberately loosened, each of which
// must break tests. A bar nothing can falsify is a bar nobody should trust with a feed.
//
// Nothing here touches the network. `screen()` takes its fetch, so the pipeline is graded
// against recorded shapes rather than against whatever Europe PMC is serving this week —
// which is also the only way a test of a literature filter can mean the same thing twice.

import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_WINDOW_DAYS,
  MIN_BODY_CHARACTERS,
  MIN_SPORT_MENTIONS,
  MIN_STATISTIC_FAMILIES,
  countSportMentions,
  hasStrongSportTerm,
  buildSearchQuery,
  composeWhy,
  selectQuotation,
  splitSentences,
  quoteFrames,
  QUOTE_MAX_CHARS,
  QUOTE_MIN_CHARS,
  QUOTE_CLAUSES,
  REPORTED_VALUE_SIGNATURES,
  extractBodyText,
  fullTextUrl,
  grade,
  gradeMetadata,
  idempotencyKeyFor,
  parseSearchResults,
  rankSelected,
  readerUrl,
  sameSource,
  searchUrl,
} from "./lib/agent-scout.mjs";
import { screen, publishedSources, USER_AGENT } from "./agent-scout.mjs";

const NOW = "2026-09-12T04:00:00.000Z";

// ---------------------------------------------------------------------------
// Fixtures. Shaped from Europe PMC's documented `resultType=core` response.
// ---------------------------------------------------------------------------

function record(overrides = {}) {
  return {
    source: "MED",
    id: "40999111",
    pmcid: "PMC12345678",
    doi: "10.3389/fspor.2026.1551234",
    title: "Concurrent validity of a wearable IMU system for sprint kinematics in elite athletes",
    abstractText: "<p>This study examined the concurrent validity of an inertial measurement unit against an optoelectronic reference during maximal sprint running in 24 athletes.</p>",
    journalInfo: { journal: { title: "Frontiers in Sports and Active Living" } },
    firstPublicationDate: "2026-09-02",
    isOpenAccess: "Y",
    inEPMC: "Y",
    pubTypeList: { pubType: ["research-article", "Journal Article"] },
    fullTextUrlList: {
      fullTextUrl: [
        { site: "Europe_PMC", url: "https://europepmc.org/article/MED/40999111", documentStyle: "html", availability: "Open access" },
        { site: "Frontiers", url: "https://www.frontiersin.org/articles/10.3389/fspor.2026.1551234/full", documentStyle: "html", availability: "Open access" },
      ],
    },
    ...overrides,
  };
}

function candidateOf(overrides) {
  return parseSearchResults({ resultList: { result: [record(overrides)] } })[0];
}

/** A full text that passes `measured-result`: two statistic families and a design term,
 *  padded to clear the body-length floor the way a real paper's methods section does. */
function goodFullText({ stats = "Agreement was excellent (ICC = 0.97) and differences were trivial (p = 0.41).", design = "A repeated-measures validation study was conducted against a gold standard system.", extra = "" } = {}) {
  const filler = "Participants completed three maximal sprint efforts over thirty metres while instrumented. ".repeat(120);
  return `<article><body><sec><title>Methods</title><p>${design} ${filler}</p></sec><sec><title>Results</title><p>${stats} Mean velocity was 8.4 ± 0.3 m/s. ${extra}</p></sec></body></article>`;
}

// ---------------------------------------------------------------------------
// Query and parsing
// ---------------------------------------------------------------------------

test("the search query carries the window and both structural filters", () => {
  const q = buildSearchQuery({ from: "2026-07-14", to: "2026-09-12" });
  assert.match(q, /FIRST_PDATE:\[2026-07-14 TO 2026-09-12\]/);
  assert.match(q, /OPEN_ACCESS:y/);
  assert.match(q, /IN_EPMC:y/);
  // Both halves of the remit are asked of the server too, so the 50 records we pay to read
  // are not 50 records about industrial vibration.
  assert.match(q, /"accelerometer"/);
  assert.match(q, /"athlete"/);
});

test("the search URL asks for core results and is a real URL", () => {
  const u = new URL(searchUrl("x", { pageSize: 7 }));
  assert.equal(u.searchParams.get("resultType"), "core");
  assert.equal(u.searchParams.get("pageSize"), "7");
  assert.equal(u.searchParams.get("format"), "json");
});

test("the full-text URL encodes the identifier it is given", () => {
  assert.equal(fullTextUrl("PMC1"), "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC1/fullTextXML");
  assert.match(fullTextUrl("PMC../../secret"), /PMC\.\.%2F\.\.%2Fsecret/);
});

test("parsing strips the abstract's markup and normalises the title", () => {
  const c = candidateOf({ title: "A  study   of things." });
  assert.equal(c.title, "A study of things");
  assert.ok(!c.abstract.includes("<p>"));
  assert.match(c.abstract, /^This study examined/);
});

test("parsing accepts a single pubType as well as a list", () => {
  const c = candidateOf({ pubTypeList: { pubType: "Review" } });
  assert.deepEqual(c.pubTypes, ["review"]);
});

test("the reader URL prefers the publisher's own page over the archive we read it from", () => {
  assert.equal(readerUrl(record()), "https://www.frontiersin.org/articles/10.3389/fspor.2026.1551234/full");
});

test("the reader URL falls back to the DOI, then to Europe PMC, then to nothing", () => {
  assert.equal(readerUrl({ ...record(), fullTextUrlList: undefined }), "https://doi.org/10.3389/fspor.2026.1551234");
  assert.equal(readerUrl({ source: "MED", id: "1" }), "https://europepmc.org/article/MED/1");
  assert.equal(readerUrl({}), "");
});

// ---------------------------------------------------------------------------
// extractBodyText — the reference-list exclusion is load-bearing
// ---------------------------------------------------------------------------

test("the reference list is removed before the bar sees the text", () => {
  const xml = `<article><body><p>Nothing was measured here.</p></body><ref-list><ref><title>Validity and reliability of IMUs (p &lt; 0.001, ICC = 0.98)</title></ref></ref-list></article>`;
  const text = extractBodyText(xml);
  assert.match(text, /Nothing was measured here/);
  assert.ok(!/ICC/.test(text), "a cited title must not be able to satisfy the statistics clause");
});

test("entities are decoded and whitespace collapsed", () => {
  assert.equal(extractBodyText("<p>a &amp;  b\n\nc</p>"), "a & b c");
  assert.equal(extractBodyText(""), "");
  assert.equal(extractBodyText(null), "");
});

// ---------------------------------------------------------------------------
// Each clause, refusing something
// ---------------------------------------------------------------------------

const base = { now: NOW, windowDays: DEFAULT_WINDOW_DAYS };

function metaClause(overrides, opts = {}) {
  return gradeMetadata(candidateOf(overrides), { ...base, ...opts });
}

test("a candidate with no PMC identifier is refused as unaddressable, before any fetch", () => {
  const r = metaClause({ pmcid: "" });
  assert.equal(r.verdict, "rejected");
  assert.equal(r.clause, "identifiable");
});

test("a preprint is refused on the remit's own words", () => {
  const r = metaClause({ source: "PPR" });
  assert.equal(r.clause, "peer-reviewed");
  assert.match(r.detail, /preprint/);
});

test("reviews, protocols, editorials and corrections are refused by type", () => {
  for (const type of ["review", "systematic review", "meta-analysis", "editorial", "comment", "published erratum", "study protocol", "case reports"]) {
    const r = metaClause({ pubTypeList: { pubType: ["research-article", type] } });
    assert.equal(r.clause, "research-article", `type "${type}" should be refused`);
  }
});

test("a title that announces itself as not-a-paper is refused even when the type list is clean", () => {
  for (const title of [
    "Correction: Validity of IMU sprint kinematics in athletes",
    "Erratum to wearable gait analysis in runners",
    "Comment on the validity of accelerometer training load in athletes",
    "Wearable sensors in sport: a systematic review of athlete gait",
    "Protocol for a randomised trial of IMU feedback in sprint athletes",
  ]) {
    const r = metaClause({ title });
    assert.equal(r.clause, "research-article", `title "${title}" should be refused`);
  }
});

test("in-remit needs BOTH an instrument term and a sport context term", () => {
  // Instrument without a subject: an accelerometer on a bridge.
  const noSport = metaClause({
    title: "Accelerometer-based structural health monitoring of a steel footbridge",
    abstractText: "An inertial measurement unit recorded vibration of the deck.",
  });
  assert.equal(noSport.clause, "in-remit");
  assert.match(noSport.detail, /no sport or athlete term/);

  // Subject without instrument: the generic fitness advice the remit excludes by name.
  const noInstrument = metaClause({
    title: "Motivational climate and enjoyment in youth sport participation",
    abstractText: "A questionnaire study of athletes and their coaches.",
  });
  assert.equal(noInstrument.clause, "in-remit");
  assert.match(noInstrument.detail, /instrument or sensing/);
});

// The four that got through the first live screen. Each is real instrumented movement
// science with proper statistics, and none of them belongs on a feed about athletes.
// https://github.com/in-c0/tuned/actions/runs/34672702607
test("movement science with no sport context is refused, and the clause says which it was", () => {
  const r = metaClause({
    title: "A robotic perturbation trainer for transverse-plane gait perturbations in pediatric cerebral palsy",
    abstractText: "Instrumented gait analysis with motion capture measured kinematic responses in children.",
  });
  assert.equal(r.clause, "in-remit");
  assert.match(r.detail, /movement science without a sport context/);
  assert.match(r.detail, /gait/, "the rejection should name what it did match");
});

test("a clinical population is refused even with impeccable instruments and statistics", () => {
  for (const [title, abstractText] of [
    ["Foot muscle size and balance in stroke: evidence of structural-functional dissociation", "Ultrasound and force plate measures in stroke patients during sprint-style stepping drills."],
    ["Intelligent robot-aided physiotherapy for upper limb rehabilitation", "EMG-instrumented training load progression in patients after cerebral injury."],
    ["Physical and psychological features during remission from non-specific neck pain", "Accelerometer-measured physically active time in patients with neck pain."],
  ]) {
    const r = metaClause({ title, abstractText });
    assert.equal(r.clause, "clinical-population", `"${title}" should be refused as clinical`);
  }
});

test("an athlete population survives the clinical clause even when an injury is the subject", () => {
  const r = metaClause({
    title: "Hamstring strain injury risk in professional footballers measured with a wearable IMU",
    abstractText: "Elite soccer athletes were monitored across a competitive season; patients referred for imaging were excluded.",
  });
  assert.equal(r.verdict, "passed-metadata", "a named competitive sport overrides the clinical terms");
});

test("the clinical override is narrower than the sport list, so a rehab intervention cannot rescue itself", () => {
  assert.ok(hasStrongSportTerm("elite soccer athletes"));
  assert.ok(!hasStrongSportTerm("resistance training in physically active older adults"));
});

test("short instrument abbreviations match as words, not as substrings", () => {
  const immunology = metaClause({
    title: "Immunology of overtraining in endurance athletes",
    abstractText: "Immunoglobulin responses were measured in runners. No emgality was used.",
  });
  assert.equal(immunology.clause, "in-remit", "IMU must not fire on 'immunology', EMG must not fire on 'emgality'");
});

test("a paper outside the recency window is refused, and one in the future is too", () => {
  assert.equal(metaClause({ firstPublicationDate: "2026-01-02" }).clause, "recent");
  assert.equal(metaClause({ firstPublicationDate: "2027-01-02" }).clause, "recent");
  assert.equal(metaClause({ firstPublicationDate: "nonsense" }).clause, "recent");
  // The boundary itself is admitted rather than refused.
  assert.equal(metaClause({ firstPublicationDate: "2026-07-15" }).verdict, "passed-metadata");
});

test("a paywalled record or one with no archived full text is refused", () => {
  assert.equal(metaClause({ isOpenAccess: "N" }).clause, "open-access-full-text");
  assert.equal(metaClause({ inEPMC: "N" }).clause, "open-access-full-text");
});

test("a source this feed already published is refused with a reason, not silently deduped", () => {
  const c = candidateOf();
  const byUrl = gradeMetadata(c, { ...base, publishedUrls: [c.url] });
  assert.equal(byUrl.clause, "not-already-published");
  const byDoi = gradeMetadata(c, { ...base, publishedDois: ["10.3389/FSPOR.2026.1551234"] });
  assert.equal(byDoi.clause, "not-already-published", "DOI comparison must be case-insensitive");
});

test("a clean candidate passes metadata screening and reports what it matched", () => {
  const r = metaClause({});
  assert.equal(r.verdict, "passed-metadata");
  assert.ok(r.instrument.includes("inertial measurement unit"));
  assert.ok(r.sport.includes("athlete"));
  assert.ok(r.ageDays > 0 && r.ageDays < DEFAULT_WINDOW_DAYS);
});

test("sameSource ignores tracking parameters but not article identifiers", () => {
  assert.ok(sameSource("https://journals.plos.org/a?id=10.1371/x", "https://journals.plos.org/a?id=10.1371/x&utm_source=q"));
  assert.ok(sameSource("https://www.nature.com/articles/x", "https://nature.com/articles/x/"));
  assert.ok(!sameSource("https://journals.plos.org/a?id=10.1371/x", "https://journals.plos.org/a?id=10.1371/y"));
  assert.ok(!sameSource("not a url", "https://example.com"));
});

// ---------------------------------------------------------------------------
// The encounter and the measured result
// ---------------------------------------------------------------------------

test("a full text that could not be fetched is refused as unencounterable, never selected on its abstract", () => {
  const r = grade(candidateOf(), { ...base, fullText: "", fetchNote: "HTTP 404" });
  assert.equal(r.clause, "encountered");
  assert.match(r.detail, /HTTP 404/);
});

test("a full text shorter than the floor is refused", () => {
  const r = grade(candidateOf(), { ...base, fullText: "x".repeat(MIN_BODY_CHARACTERS - 1) });
  assert.equal(r.clause, "encountered");
});

test("one statistic family is not a measured result", () => {
  const text = extractBodyText(goodFullText({ stats: "Agreement was excellent (ICC = 0.97).", design: "A validation study was performed." }));
  const r = grade(candidateOf(), { ...base, fullText: text });
  assert.equal(r.clause, "measured-result");
  assert.match(r.detail, new RegExp(`need ${MIN_STATISTIC_FAMILIES}`));
});

test("statistics with no design term is a commentary quoting numbers, and is refused", () => {
  const text = extractBodyText(
    goodFullText({
      stats: "Others have reported ICC = 0.97 and p = 0.03 in this setting.",
      design: "We reflect on the state of the field.",
    })
  );
  const r = grade(candidateOf(), { ...base, fullText: text });
  assert.equal(r.clause, "measured-result");
  assert.match(r.detail, /no design term/);
});

test("two statistic families plus a design term is selected, and reports its evidence", () => {
  const text = extractBodyText(goodFullText());
  const r = grade(candidateOf(), { ...base, fullText: text });
  assert.equal(r.verdict, "selected");
  assert.equal(r.clause, null);
  assert.ok(r.statistics.length >= MIN_STATISTIC_FAMILIES);
  assert.ok(r.designs.length >= 1);
  assert.equal(r.bodyCharacters, text.length);
});

test("metadata clauses are applied before the encounter, so a review with a perfect full text is still refused", () => {
  const r = grade(candidateOf({ pubTypeList: { pubType: ["review"] } }), { ...base, fullText: extractBodyText(goodFullText()) });
  assert.equal(r.clause, "research-article");
});

// ---------------------------------------------------------------------------
// Ranking, the why line, and the replay key
// ---------------------------------------------------------------------------

test("ranking prefers more statistic families, then recency, then length, then DOI", () => {
  const mk = (doi, date, stats, chars) => ({
    candidate: { ...candidateOf(), doi, firstPublicationDate: date },
    grade: { statistics: stats, designs: ["validation"], bodyCharacters: chars },
  });
  const ranked = rankSelected([
    mk("10.1/b", "2026-09-01", ["p-value", "agreement"], 20000),
    mk("10.1/a", "2026-09-05", ["p-value", "agreement"], 20000),
    mk("10.1/c", "2026-09-09", ["p-value", "agreement", "effect size"], 9000),
  ]);
  assert.deepEqual(ranked.map((r) => r.candidate.doi), ["10.1/c", "10.1/a", "10.1/b"]);
});

test("the why line stays inside the publish route's budget and says what the agent did", () => {
  const g = grade(candidateOf(), { ...base, fullText: extractBodyText(goodFullText()) });
  const why = composeWhy({ candidate: candidateOf(), grade: g, observed: 38, observedOn: "2026-09-12" });
  assert.ok(why.length > 0 && why.length <= 280, `why was ${why.length} characters`);
  assert.match(why, /Selected by @sportstech from 38 open-access candidates screened 2026-09-12/);
  assert.match(why, /full text read/);
  // The doctrine line: it describes the screening, never the finding.
  assert.ok(!/\b(shows|suggests|proves|demonstrates|finds that|concludes)\b/i.test(why), `why must not characterise the result: ${why}`);
});

test("the why line drops whole clauses rather than slicing a sentence", () => {
  const g = grade(candidateOf(), { ...base, fullText: extractBodyText(goodFullText({ extra: "Cohen's d = 0.8, 95% CI, Pearson r = 0.91, RMSE 0.04, coefficient of variation 2%, randomised crossover, compared with the reference." })) });
  const long = composeWhy({ candidate: candidateOf({ journalInfo: { journal: { title: "A Journal With A Very Long Name Indeed For Testing Budgets In Composition" } } }), grade: g, observed: 9999, observedOn: "2026-09-12" });
  assert.ok(long.length <= 280);
  assert.ok(long.endsWith("."), "every composition must end on a finished clause");
});

test("a why line that cannot fit at all is refused rather than truncated", () => {
  const g = { statistics: ["x".repeat(400)], designs: ["y".repeat(400)], bodyCharacters: 10000 };
  assert.equal(composeWhy({ candidate: candidateOf(), grade: g, observed: 1, observedOn: "2026-09-12" }), "");
});

test("the replay key is stable for a source and different across sources", () => {
  const a = idempotencyKeyFor("sportstech", "https://example.org/a");
  assert.equal(a, idempotencyKeyFor("sportstech", "https://example.org/a"));
  assert.notEqual(a, idempotencyKeyFor("sportstech", "https://example.org/b"));
  assert.notEqual(a, idempotencyKeyFor("wearables", "https://example.org/a"));
  assert.match(a, /^scout-[0-9a-f]{16}$/);
});

// ---------------------------------------------------------------------------
// The pipeline
// ---------------------------------------------------------------------------

function fakeFetch(routes) {
  const calls = [];
  return {
    calls,
    impl: async (url, init) => {
      calls.push(url);
      assert.equal(init.headers["user-agent"], USER_AGENT, "every request must declare this agent honestly");
      for (const [pattern, response] of routes) {
        if (url.includes(pattern)) return response();
      }
      return { ok: false, status: 404, async text() { return ""; }, async json() { return {}; } };
    },
  };
}

const searchResponse = (records) => () => ({
  ok: true,
  status: 200,
  async json() {
    return { hitCount: records.length, resultList: { result: records } };
  },
});

const xmlResponse = (xml) => () => ({ ok: true, status: 200, async text() { return xml; } });

test("the pipeline reads full text only for candidates that passed metadata screening", async () => {
  const f = fakeFetch([
    ["/search", searchResponse([record(), record({ pmcid: "PMC2", id: "2", doi: "10.1/r", pubTypeList: { pubType: ["review"] } })])],
    ["/fullTextXML", xmlResponse(goodFullText())],
  ]);
  const report = await screen({ now: new Date(NOW), fetchImpl: f.impl, pause: async () => {}, published: { urls: [], dois: [] }, log: () => {} });

  assert.equal(report.returned, 2);
  assert.equal(report.full_text_reads, 1, "the review must not cost a network call");
  assert.equal(f.calls.filter((u) => u.includes("fullTextXML")).length, 1);
  assert.equal(report.selected.length, 1);
  assert.equal(report.observations.find((o) => o.candidate.pmcid === "PMC2").clause, "research-article");
});

test("the read budget defers rather than silently dropping, and is honoured exactly", async () => {
  const records = [1, 2, 3, 4].map((n) => record({ pmcid: `PMC${n}`, id: String(n), doi: `10.1/${n}` }));
  const f = fakeFetch([
    ["/search", searchResponse(records)],
    ["/fullTextXML", xmlResponse(goodFullText())],
  ]);
  const report = await screen({ now: new Date(NOW), maxReads: 2, fetchImpl: f.impl, pause: async () => {}, published: { urls: [], dois: [] }, log: () => {} });

  assert.equal(report.full_text_reads, 2);
  const deferred = report.observations.filter((o) => o.verdict === "deferred");
  assert.equal(deferred.length, 2);
  assert.equal(deferred[0].clause, "read-budget");
  assert.equal(report.selected.length, 2);
});

test("a full-text endpoint that refuses produces a rejection, not a crash and not a selection", async () => {
  const f = fakeFetch([["/search", searchResponse([record()])]]);
  const report = await screen({ now: new Date(NOW), fetchImpl: f.impl, pause: async () => {}, published: { urls: [], dois: [] }, log: () => {} });
  assert.equal(report.selected.length, 0);
  assert.equal(report.observations[0].clause, "encountered");
  assert.match(report.observations[0].detail, /HTTP 404/);
});

test("a failed search is an error, because that is the loop's instrument failing and not a thin week", async () => {
  const f = fakeFetch([["/search", () => ({ ok: false, status: 503, async json() { return {}; } })]]);
  await assert.rejects(
    () => screen({ now: new Date(NOW), fetchImpl: f.impl, pause: async () => {}, published: { urls: [], dois: [] }, log: () => {} }),
    /HTTP 503/
  );
});

test("an empty result set is a clean empty cycle", async () => {
  const f = fakeFetch([["/search", searchResponse([])]]);
  const report = await screen({ now: new Date(NOW), fetchImpl: f.impl, pause: async () => {}, published: { urls: [], dois: [] }, log: () => {} });
  assert.equal(report.returned, 0);
  assert.equal(report.selected.length, 0);
  assert.equal(report.full_text_reads, 0);
});

test("the dedupe list is read from the live nomination registry and contains the published DOIs", () => {
  const { urls, dois } = publishedSources();
  assert.ok(urls.length >= 6, `expected the six hand-made publications, got ${urls.length}`);
  assert.ok(dois.some((d) => d.startsWith("10.1371/journal.pone.0351884")), "item 279's DOI should be in the dedupe list");
});

test("every published source in the registry would now be refused as already published", () => {
  const { urls, dois } = publishedSources();
  for (const url of urls) {
    const c = { ...candidateOf(), url, doi: "" };
    const r = gradeMetadata(c, { ...base, publishedUrls: urls, publishedDois: dois });
    assert.equal(r.clause, "not-already-published", `${url} should be refused`);
  }
});

// ---------------------------------------------------------------------------
// Mutations. Each of these is a loosening someone could plausibly make; each must break
// something, or the threshold it loosens was decoration.
// ---------------------------------------------------------------------------

test("MUTATION: accepting one statistic family would admit a paper that merely reports agreement", () => {
  const text = extractBodyText(goodFullText({ stats: "Agreement was excellent (ICC = 0.97).", design: "A validation study was performed." }));
  const r = grade(candidateOf(), { ...base, fullText: text });
  assert.equal(r.verdict, "rejected");
  assert.equal(MIN_STATISTIC_FAMILIES, 2, "if this becomes 1 the case above starts passing");
});

test("MUTATION: keeping the reference list would let a citation satisfy the statistics clause", () => {
  const xml = `<article><body><sec><title>Methods</title><p>A validation study of sprint athletes. ${"athlete sprint sport data ".repeat(400)}</p></sec></body><ref-list><ref><title>IMU validity: ICC = 0.98, p &lt; 0.001, 95% CI reported</title></ref></ref-list></article>`;
  const withStrip = grade(candidateOf(), { ...base, fullText: extractBodyText(xml) });
  assert.equal(withStrip.clause, "measured-result", "with ref-list stripped there are no statistics");
  // And the counterfactual: the same text with references included would have passed.
  const naive = xml.replace(/<[^>]+>/g, " ").replace(/&lt;/g, "<").replace(/\s+/g, " ");
  const withoutStrip = grade(candidateOf(), { ...base, fullText: naive });
  assert.equal(withoutStrip.verdict, "selected", "which is exactly why the strip is load-bearing");
});

test("MUTATION: dropping the open-access requirement would select a paper whose text cannot be read", () => {
  const r = grade(candidateOf({ isOpenAccess: "N" }), { ...base, fullText: extractBodyText(goodFullText()) });
  assert.equal(r.clause, "open-access-full-text");
});

test("MUTATION: a body-length floor of zero would let an empty fetch be selected", () => {
  assert.ok(MIN_BODY_CHARACTERS > 0);
  const r = grade(candidateOf(), { ...base, fullText: "" });
  assert.equal(r.clause, "encountered");
});

// ---------------------------------------------------------------------------
// about-sport: the clause the first live screen added, and the one that makes the expensive
// read earn its place. On run 34672702607 the statistics clauses refused 0 of the 10
// candidates that reached them, so the full-text fetch was buying a number nobody needed.
// ---------------------------------------------------------------------------

test("a full text that merely mentions sport is refused, however good its statistics", () => {
  const body = `<article><body><sec><title>Methods</title><p>A randomised repeated-measures study compared two groups (p = 0.02, 95% CI, ICC = 0.91). ${"Measurements were recorded in the laboratory. ".repeat(200)} One sentence notes that similar methods are used in sport.</p></sec></body></article>`;
  const r = grade(candidateOf(), { ...base, fullText: extractBodyText(body) });
  assert.equal(r.clause, "about-sport");
  assert.match(r.detail, /mentioned, not about/);
});

test("a full text that is about sport passes, and the count is reported", () => {
  const r = grade(candidateOf(), { ...base, fullText: extractBodyText(goodFullText()) });
  assert.equal(r.verdict, "selected");
  assert.ok(r.sportMentions >= MIN_SPORT_MENTIONS, `expected at least ${MIN_SPORT_MENTIONS} mentions, got ${r.sportMentions}`);
});

test("counting sport mentions is across terms, not per term, and respects word boundaries", () => {
  assert.equal(countSportMentions("sport sport soccer athlete athlete"), 5);
  assert.equal(countSportMentions("transport reported deportment"), 0, "substring matches must not count");
});

test("the scope clause is asked before the statistics clauses, so the cheaper reason wins", () => {
  // No statistics at all AND no sport: the run record should say the scope failed, because
  // that is the fact a reader needs, not "it had one statistic family".
  const body = `<article><body><p>${"A descriptive laboratory note. ".repeat(300)}</p></body></article>`;
  const r = grade(candidateOf(), { ...base, fullText: extractBodyText(body) });
  assert.equal(r.clause, "about-sport");
});

test("MUTATION: a sport-mention floor of zero re-admits every clinical paper the first screen selected", () => {
  assert.ok(MIN_SPORT_MENTIONS >= 5);
  const body = `<article><body><sec><title>Methods</title><p>A randomised controlled comparison in stroke survivors (p = 0.01, ICC = 0.88, 95% CI). ${"Gait was recorded with motion capture. ".repeat(200)}</p></sec></body></article>`;
  const r = grade(candidateOf({ title: "Markerless gait analysis in stroke survivors", abstractText: "Instrumented gait in sprint-cadence walking trials." }), { ...base, fullText: extractBodyText(body) });
  assert.notEqual(r.verdict, "selected");
});

test("MUTATION: putting movement terms back in the admitting list re-opens the clinical door", () => {
  // The regression test for the correction itself: a candidate whose ONLY subject term is a
  // movement term must be refused, in the clause that says so.
  const r = metaClause({
    title: "Kinematic and neuromuscular responses to a countermovement task measured by motion capture",
    abstractText: "Joint angle and muscle activation were recorded in twenty adults.",
  });
  assert.equal(r.clause, "in-remit");
  assert.match(r.detail, /movement science without a sport context/);
});

test("MUTATION: matching a term as a bare substring counts 'transport' as a mention of sport", () => {
  assert.equal(countSportMentions("transport reported deportment"), 0);
  // And the stems that have to keep working, which is why the trailing boundary is not
  // symmetric with the leading one.
  assert.ok(countSportMentions("athletes") > 0);
  assert.ok(countSportMentions("sporting") > 0);
});

// ---------------------------------------------------------------------------
// Quotation — the agent points with the source's own sentence (run 154)
//
// EXP-013 registered the weak `why` line as this agent's known limitation before it published
// anything, and named the fix: quotation, not generation. So the question these cases have to
// answer is not "does a quote appear" but **can this code ever emit a sentence the source did
// not write** — including by truncating one, stitching two together, or reaching into a
// section where one sentence does not stand alone. Every refusal below is a sentence a loop
// optimising for a livelier feed would have taken.
// ---------------------------------------------------------------------------

/** A structured abstract in Europe PMC's shape: section labels inline, one results section. */
const RESULTS_SENTENCE =
  "There was no significant main effect of protocol on knee-extensor maximal voluntary isometric contraction or countermovement jump height (all p > 0.05, partial eta squared < 0.09).";

function structuredAbstract({
  background = "Whole-body vibration is widely used as a warm-up modality in team sports.",
  methods = "Thirteen highly trained adolescent male soccer players completed three work-equivalent protocols in a counterbalanced crossover design.",
  results = RESULTS_SENTENCE,
  extraResults = "These results were consistent across all three protocols.",
  conclusion = "Work-equivalent vibration protocols suggest a promising warm-up avenue for youth athletes (p = 0.41, 95% CI).",
} = {}) {
  return `BACKGROUND: ${background} METHODS: ${methods} RESULTS: ${results} ${extraResults} CONCLUSION: ${conclusion}`;
}

const quotableCandidate = (abstractText) => candidateOf({ abstractText });

test("the quotation is the source's own sentence, verbatim, inside the publish budget", () => {
  const abstract = structuredAbstract();
  const q = selectQuotation(abstract);
  assert.equal(q.quote, RESULTS_SENTENCE);
  assert.ok(abstract.includes(q.quote), "the published string must be a substring of the abstract");
  assert.equal(q.source, "abstract results section");
  assert.deepEqual(q.families.sort(), ["effect size", "p-value"]);

  const g = grade(candidateOf(), { ...base, fullText: extractBodyText(goodFullText()) });
  const why = composeWhy({ candidate: quotableCandidate(abstract), grade: g, observed: 35, observedOn: "2026-09-12" });
  assert.ok(why.length <= 280, `why was ${why.length} characters`);
  assert.ok(why.includes(RESULTS_SENTENCE), "the whole sentence, not part of it");
  assert.match(why, /the source's own words/, "the reader must be told whose sentence this is");
  // And the agent must not have authored a characterisation around it.
  assert.ok(!/\b(shows|suggests|proves|demonstrates|we found|concludes)\b/i.test(why.replace(RESULTS_SENTENCE, "")), why);
});

test("a quotation is never truncated to fit — an over-long sentence is refused and the line falls back", () => {
  const long = `Across every outcome the analysis returned no detectable difference between the three protocols at any timepoint, with p values above the alpha level throughout and partial eta squared values below the smallest effect considered worthwhile, ${"and the confidence intervals were wide in every case".repeat(2)} (p = 0.41, 95% CI).`;
  assert.ok(long.length > QUOTE_MAX_CHARS);
  const q = selectQuotation(structuredAbstract({ results: long, extraResults: "" }));
  assert.equal(q.quote, "");
  assert.equal(q.refusedBecause, "length");

  const g = grade(candidateOf(), { ...base, fullText: extractBodyText(goodFullText()) });
  const why = composeWhy({ candidate: quotableCandidate(structuredAbstract({ results: long, extraResults: "" })), grade: g, observed: 35, observedOn: "2026-09-12" });
  // The fallback is the provenance-only form item 280 carries — not a shortened quote.
  assert.match(why, /^Selected by @sportstech/);
  assert.ok(!/[…]|\.\.\./.test(why), `no ellipsis may ever appear in a why line: ${why}`);
  assert.ok(!why.includes("“"), "a refused quotation must leave no quotation marks behind");
});

test("no qualifying sentence falls back to the provenance line rather than writing one", () => {
  const q = selectQuotation("BACKGROUND: Vibration training is popular. METHODS: We tested it. CONCLUSION: It is interesting.");
  assert.equal(q.quote, "");
  const g = grade(candidateOf(), { ...base, fullText: extractBodyText(goodFullText()) });
  const why = composeWhy({ candidate: candidateOf(), grade: g, observed: 12, observedOn: "2026-09-12" });
  assert.match(why, /^Selected by @sportstech from 12 open-access candidates/);
  assert.ok(why.length > 0 && why.length <= 280);
});

test("an empty or missing abstract refuses by clause rather than throwing", () => {
  for (const input of ["", "   ", undefined, null, 42]) {
    const q = selectQuotation(input);
    assert.equal(q.quote, "");
    assert.equal(q.refusedBecause, "no-abstract");
  }
});

test("sentence splitting survives decimals, abbreviations and initials", () => {
  const s = splitSentences("Velocity differed (p = 0.03). Peak force was 1.2 vs. 1.4 N. Smith J. reported the same effect in 2024.");
  assert.deepEqual(s, [
    "Velocity differed (p = 0.03).",
    "Peak force was 1.2 vs. 1.4 N.",
    "Smith J. reported the same effect in 2024.",
  ]);
});

test("the quotation is deterministic, and prefers more reported statistics then the earlier sentence", () => {
  const thin = "Sprint time improved by a small margin across the intervention period in this cohort (p = 0.04).";
  const rich = "Jump height increased by 2.1 cm relative to the control condition in this cohort (p = 0.01, 95% CI 0.8 to 3.4, Cohen's d = 0.62).";
  const abstract = structuredAbstract({ results: `${thin} ${rich}`, extraResults: "" });
  const first = selectQuotation(abstract);
  assert.equal(first.quote, rich, "two statistic families outrank the earlier sentence's one");
  assert.equal(selectQuotation(abstract).quote, first.quote, "the same record must quote the same sentence twice");

  const tie = structuredAbstract({ results: `${rich} Knee extensor torque also increased in this cohort (p = 0.02, 95% CI 1.1 to 4.0, Cohen's d = 0.58).`, extraResults: "" });
  assert.equal(selectQuotation(tie).quote, rich, "on a tie the earlier sentence wins");
});

test("MUTATION: quoting outside the results section lets the agent reach past a null for a livelier sentence", () => {
  // The conclusion of the fixture is upbeat AND carries two statistic families, so it would
  // outrank nothing but would be admitted the moment the section restriction is dropped.
  const abstract = structuredAbstract();
  const restricted = selectQuotation(abstract);
  assert.equal(restricted.source, "abstract results section");
  assert.ok(!restricted.quote.includes("promising"), "the discussion's optimism must not be quotable");

  // Same sentences, no section labels: now everything is in the pool, and the optimistic
  // sentence becomes reachable. This is the behaviour the labels are there to prevent.
  const unlabelled = selectQuotation(abstract.replace(/\b(BACKGROUND|METHODS|RESULTS|CONCLUSION): /g, ""));
  assert.equal(unlabelled.source, "abstract");
  assert.ok(unlabelled.quote.length > 0);
});

test("MUTATION: dropping the reported-value clause admits a background sentence that measures nothing", () => {
  const claim = "Whole-body vibration has been proposed as an effective warm-up strategy for adolescent athletes in team sports worldwide.";
  const q = selectQuotation(structuredAbstract({ results: claim, extraResults: "" }));
  assert.equal(q.quote, "");
  assert.equal(q.refusedBecause, "reported-value");
  // Same sentence with a reported number attached is admitted, so the clause is the thing
  // doing the work rather than the sentence being unusable.
  assert.notEqual(selectQuotation(structuredAbstract({ results: `${claim.slice(0, -1)} (p = 0.02, 95% CI 0.1 to 0.4).`, extraResults: "" })).quote, "");
});

test("MUTATION: dropping the self-contained clause admits a sentence whose subject is left in the paper", () => {
  for (const opener of ["These", "This", "However, this", "Therefore these"]) {
    const dependent = `${opener} differences remained below the smallest worthwhile change across every protocol tested (p = 0.44, 95% CI -0.2 to 0.3).`;
    const q = selectQuotation(structuredAbstract({ results: dependent, extraResults: "" }));
    assert.equal(q.quote, "", `"${opener}" must not open a quotation`);
    assert.equal(q.refusedBecause, "self-contained");
  }
});

test("MUTATION: dropping the resolvable clause admits a sentence pointing at a table the reader cannot see", () => {
  for (const sentence of [
    "Peak power output differed between the three protocols as shown in Table 2 of the present analysis (p = 0.03, 95% CI 0.2 to 1.1).",
    "Jump height was unchanged across protocols, consistent with Ferreira et al. in a comparable cohort (p = 0.51, Cohen's d = 0.08).",
    "Contact time was unaffected by the vibration stimulus in this cohort [14], as previously reported (p = 0.62, 95% CI).",
  ]) {
    const q = selectQuotation(structuredAbstract({ results: sentence, extraResults: "" }));
    assert.equal(q.quote, "", sentence);
    assert.equal(q.refusedBecause, "resolvable");
  }
});

test("MUTATION: a fragment is not a quotation — a sentence with no terminal punctuation is refused", () => {
  const q = selectQuotation("RESULTS: Jump height was unchanged across all three protocols in this cohort (p = 0.44, 95% CI -0.2 to 0.3)");
  // The tail of an abstract with no final period is a fragment by this file's rule, and the
  // honest outcome is silence rather than a sentence the agent closed itself.
  assert.equal(q.quote, "");
});

test("the quote budget is derived from the shortest frame, so the floor always fits", () => {
  const longest = "x".repeat(QUOTE_MAX_CHARS);
  const frames = quoteFrames({ quote: longest, observed: 99, observedOn: "2026-09-12", bodyCharacters: 123456 });
  assert.equal(frames.at(-1).length, 280, "the floor must use the budget exactly");
  for (let i = 1; i < frames.length; i++) {
    assert.ok(frames[i].length < frames[i - 1].length, "every rung must be strictly shorter than the last");
  }
  assert.ok(QUOTE_MIN_CHARS < QUOTE_MAX_CHARS);
  assert.ok(QUOTE_CLAUSES.includes("verbatim"), "the clause that makes this quotation must be named in the log");
});

// ---------------------------------------------------------------------------
// The first live screen of the quotation rule picked a METHODS sentence (run 154)
//
// Run 154 shipped the rule, dispatched a dry screen, and the top selection's quotation was
// https://github.com/in-c0/tuned/actions/runs/34687978960 — faithful, verbatim, and about the
// analysis pipeline rather than about any athlete. `STATISTIC_SIGNATURES` matches `ICC` and
// `95% CI` as strings, which is right for the bar (does this paper report statistics at all)
// and wrong for a quotation (does THIS SENTENCE report a result). The same accident as run
// 153's scope bug one layer in: a term naming a METHOD satisfying a clause meant to ask about
// an OUTCOME. These cases are the live sentences, kept verbatim so the regression is the real
// one and not a paraphrase of it.
// ---------------------------------------------------------------------------

const LIVE_METHODS_SENTENCE =
  "Reliability was assessed by ICC(A,1) with 95% CIs, SEM, MDC 95 , CV%, and Bland-Altman analysis.";

test("the methods sentence that passed the first live screen is refused now", () => {
  const q = selectQuotation(`RESULTS: ${LIVE_METHODS_SENTENCE} Agreement between sessions was high for every channel examined in this cohort (ICC = 0.91, 95% CI 0.84 to 0.95).`);
  assert.notEqual(q.quote, LIVE_METHODS_SENTENCE, "a procedure list is not a finding");
  assert.match(q.quote, /Agreement between sessions was high/, "and the sentence reporting a value is taken instead");
});

test("naming a statistical procedure is not reporting a value", () => {
  // The bar's table and the quotation's table must disagree about exactly this, because they
  // are asking different questions of the same words.
  for (const named of [
    "Reliability was quantified with the intraclass correlation coefficient and Bland-Altman limits of agreement across all channels tested.",
    "Differences between the three protocols were examined with repeated-measures analysis of variance and 95% confidence intervals throughout.",
    "Effect sizes were expressed as Cohen's d and interpreted against established thresholds for trained populations.",
  ]) {
    const q = selectQuotation(`RESULTS: ${named}`);
    assert.equal(q.quote, "", named);
    assert.ok(["reported-value", "not-methods"].includes(q.refusedBecause), `${q.refusedBecause}: ${named}`);
  }
  // And a bound number is admitted, which is what makes the clause discriminating rather than
  // merely strict.
  const reported = "Agreement between the two sessions was excellent for every channel in this cohort (ICC = 0.94, 95% CI 0.88 to 0.97).";
  assert.equal(selectQuotation(`RESULTS: ${reported}`).quote, reported);
});

test("MUTATION: a methods sentence carrying a real number is still not a finding", () => {
  const both = "Knee extensor torque was calculated using a dynamometer at three angular velocities in this cohort (ICC = 0.93, 95% CI 0.87 to 0.96).";
  const q = selectQuotation(`RESULTS: ${both}`);
  assert.equal(q.quote, "", "the subject of the sentence is the method, so the quote is about the method");
  assert.equal(q.refusedBecause, "not-methods");
});

test("stripped inline markup makes a faithful quote look like a transcription error, and is refused", () => {
  // `MDC<sub>95</sub>,` arrives from the archive as `MDC 95 ,`. The text is faithful; it does
  // not read as a quotation, which matters most in the change that asks a reader to trust one.
  const mangled = "Session-to-session variation was small across every channel in this cohort: MDC 95 , CV% 4.1 and agreement throughout (ICC = 0.94).";
  const q = selectQuotation(`RESULTS: ${mangled}`);
  assert.equal(q.quote, "");
  assert.equal(q.refusedBecause, "well-formed");
});

test("the two statistic tables are deliberately different, and the quotation's is the stricter", () => {
  assert.ok(Object.keys(REPORTED_VALUE_SIGNATURES).length > 0);
  for (const [family, patterns] of Object.entries(REPORTED_VALUE_SIGNATURES)) {
    assert.ok(patterns.length > 0, family);
    for (const re of patterns) {
      assert.match(re.source, /\\d/, `${family}: every reported-value pattern must bind a digit — ${re}`);
    }
  }
});
