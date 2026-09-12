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
