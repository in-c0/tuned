// The half of "agent" Tuned has never had: a selector that runs without a person in it.
//
// WHAT WAS MISSING, MEASURED RATHER THAN ASSUMED. Run 152 read EXP-005 per feed off live
// production for the first time and found that four of the five public feeds had published
// nothing for six weeks, and that the fifth — `@sportstech` — moved only because that run
// published to it by hand. Its conclusion is the reason this file exists: *"the rate at
// which @sportstech publishes is the rate at which a scheduled executor run happens to
// perform a selection cycle"* — six publications in 24 days — so *"recurring agent value
// without attention overload"*, third in issue #1's commercial hierarchy, is **not
// demonstrated at any cadence a subscriber would notice.** Tuned's own positioning is that
// agents can consume vastly more information than humans can review. Until this file, no
// agent on Tuned consumed anything: every item on every agent feed was placed by a human
// reading a research session's notes.
//
// WHAT AN AGENT IS HERE, AND WHAT IT IS NOT. Doctrine: humans contribute attention, not
// content. An agent contributes *its own* attention, labelled as such, and provenance state
// 2 is "selected by agent — the agent judged it relevant". That is what this is: a remit
// translated into an explicit, public, falsifiable bar, applied to material the agent
// actually fetched. It is NOT a summariser and NOT a generator — it writes no prose about a
// source, it points at one. The `why` line it composes says what it *did* (what it read,
// what the text contained, what it rejected) and never characterises a finding it has not
// verified, because a machine that paraphrases a result it cannot check is authoring.
//
// WHY THE BAR IS IN A FILE AND NOT IN A PROMPT. The six hand-made publications on
// `@sportstech` each carry a pre-registration commit that predates the dispatch, because the
// registry's whole guarantee is that the strings were written down before the item existed
// (qa/nominations/index.mjs). An autonomous selector cannot pre-register an item it has not
// yet seen. The equivalent guarantee, and the one this file provides, is that **the rule
// predates the selection**: the bar is code, in git, and every run records which clause
// decided each candidate. A bar edited to agree with today's candidate set would show up as
// a diff.
//
// THE ENCOUNTER STANDARD IS THE STRICT ONE, NOT A RELAXATION. ops/agents/sportstech.md says
// "genuinely encountered" means a dispatch whose evidence records `read_outcome: "page"` —
// a real page, not a search result, because *"a search result is a pointer, never an
// encounter"*. This selector holds a higher standard than the browser reads it replaces: it
// fetches the **open-access full text** of each candidate from Europe PMC's archive and
// grades the bar against that text. A candidate whose full text cannot be fetched is
// rejected as unencounterable rather than selected on its abstract — which is the opposite
// of what a loop optimising for publication volume would do, and is the clause most likely
// to keep this agent quiet on any given day.
//
// WHY EUROPE PMC. Run 50 measured the reachable host set and found the hosts carrying most
// on-remit material refuse a self-declaring headless reader: Taylor & Francis and SAGE
// returned Cloudflare bot checks, PMC a reCAPTCHA interstitial. Europe PMC publishes a
// documented, key-free REST API *for programmatic access* — so using it is neither evading
// a control nor pretending to be a browser. It also carries the field this bar needs most:
// `inEPMC`, which says whether a full text exists to be read at all.
//
// WHAT THIS FILE DELIBERATELY DOES NOT DO. It performs no IO. Every function here is pure,
// so the bar can be exercised against recorded fixtures instead of against whatever Europe
// PMC happens to be serving — the alternative is a test whose result depends on this week's
// literature. The fetching, the publishing and the spending of a network call live in
// scripts/agent-scout.mjs.

// ---------------------------------------------------------------------------
// The remit, translated into terms. This is the public scope statement from
// ops/agents/sportstech.md expressed as something a machine can apply, and it is the part a
// reader should argue with if they think the feed is off-remit.
//
// A candidate must match an instrument term (how the measurement was taken) AND a sport
// context term (who was measured, and in what setting). One list alone is what makes a feed
// drift — "accelerometer" alone admits industrial vibration monitoring, "athlete" alone
// admits the generic fitness advice the remit excludes by name.
//
// THE THIRD LIST IS THE ONE THE FIRST LIVE SCREEN PUT HERE. Movement vocabulary — gait,
// kinematic, neuromuscular — was originally mixed in with the sport terms, and it let
// clinical rehabilitation through: a paediatric cerebral palsy gait trainer, robot-aided
// physiotherapy, stroke, neck pain, all with real instruments and real statistics. Clinical
// movement labs use the same words as sport science. So movement terms now describe and
// admit nothing, and a clinical population is refused outright unless an athlete or a named
// competitive sport is also present.
// ---------------------------------------------------------------------------

/** How the measurement was made. Instrumentation, capture and sensing. */
export const INSTRUMENT_TERMS = [
  "inertial measurement unit",
  "imu",
  "accelerometer",
  "gyroscope",
  "magnetometer",
  "wearable",
  "markerless",
  "marker-less",
  "motion capture",
  "mocap",
  "force plate",
  "force platform",
  "pressure insole",
  "instrumented",
  "optoelectronic",
  "optical tracking",
  "global positioning system",
  "gnss",
  "local positioning system",
  "pose estimation",
  "electromyograph",
  "emg",
  "photoplethysmograph",
  "heart rate monitor",
  "smartwatch",
  "depth camera",
  "video analysis",
  "video-based",
  "linear position transducer",
  "isokinetic dynamometer",
];

/** WHO was measured, and in what context. Sport and athletes — not movement science.
 *
 *  CORRECTED ON ITS FIRST LIVE SCREEN, which is the only reason this list is separate from
 *  the one below. Run 153's dry screen
 *  (https://github.com/in-c0/tuned/actions/runs/34672702607) selected 10 of 50 candidates —
 *  a respectable-looking 20% — and **four of the ten were clinical rehabilitation**: a gait
 *  trainer for paediatric cerebral palsy, robot-aided upper-limb physiotherapy, foot muscle
 *  size in stroke, and remission from non-specific neck pain. Every one of them is real
 *  instrumented movement science with proper statistics, and none of them belongs on a feed
 *  about athlete sensing and sport performance.
 *
 *  The defect was that the old single list mixed "athlete" with "gait", "kinematic" and
 *  "neuromuscular", so a term that describes *a method* could satisfy a clause that was
 *  supposed to ask *about whom*. Clinical movement labs use the same instruments and the
 *  same words. So the bar now requires a term from THIS list, and the movement vocabulary
 *  below carries no admitting power of its own. */
export const SPORT_CONTEXT_TERMS = [
  "athlete",
  "athletic performance",
  "sport",
  "sporting",
  "sprint",
  "sprinting",
  "training load",
  "external load",
  "internal load",
  "workload",
  "match play",
  "match-play",
  "competitive season",
  "competition",
  "strength and conditioning",
  "resistance training",
  "resistance-trained",
  "endurance training",
  "soccer",
  "football",
  "basketball",
  "handball",
  "rugby",
  "volleyball",
  "baseball",
  "cricket",
  "tennis",
  "swimming",
  "cycling",
  "rowing",
  "weightlifting",
  "powerlifting",
  "track and field",
  "taekwondo",
  "judo",
  "marathon",
  "distance runner",
  "trained men",
  "trained women",
  "physically active",
];

/** HOW the movement was described. Retained because the run record is more useful when it
 *  says what a candidate matched, and deliberately NOT a clause: nothing is admitted for
 *  being about gait. See SPORT_CONTEXT_TERMS for the correction this split came from. */
export const MOVEMENT_TERMS = [
  "gait",
  "jump",
  "biomechanic",
  "kinematic",
  "kinetic",
  "neuromuscular",
  "countermovement",
  "running economy",
  "stride",
  "ground reaction force",
  "joint angle",
  "muscle activation",
];

/** Populations this feed is not about. A clinical cohort is refused even when the
 *  instrumentation and the statistics are impeccable — *especially* then, because that is the
 *  paper most likely to slip through. The override is a real sport term in the same title or
 *  abstract: "hamstring injury in professional footballers" is squarely on remit and
 *  "post-stroke balance" is not, and the difference is whether the paper is about athletes
 *  who are injured or about patients who move. */
export const CLINICAL_POPULATION_TERMS = [
  "stroke",
  "cerebral palsy",
  "parkinson",
  "dementia",
  "alzheimer",
  "multiple sclerosis",
  "arthroplasty",
  "osteoarthritis",
  "amputee",
  "amputation",
  "spinal cord injury",
  "cancer",
  "diabet",
  "obesity",
  "copd",
  "cardiac rehabilitation",
  "physiotherapy",
  "neuropathy",
  "cerebral",
  "frailty",
  "fall risk",
  "older adults",
  "nursing home",
  "chronic pain",
  "low back pain",
  "neck pain",
  "fibromyalgia",
  "patients",
];

/** A sport term appearing this many times in the full text is the evidence that the paper is
 *  ABOUT sport rather than mentioning it. One pass in a discussion paragraph is not a
 *  subject. This is the clause that makes the expensive full-text read earn its place on a
 *  scope question: on run 153's first live screen the statistics clauses refused **0 of 10**
 *  candidates that reached them, so the read was buying a number nobody needed. */
export const MIN_SPORT_MENTIONS = 5;

/** Publication types that are not a measured result. A review synthesises other people's
 *  numbers, a protocol has none yet, and a correction is an edit to a paper rather than a
 *  paper. All are out of scope by the remit's own words, not by preference. */
export const EXCLUDED_PUB_TYPES = [
  "review",
  "systematic review",
  "meta-analysis",
  "editorial",
  "comment",
  "letter",
  "news",
  "published erratum",
  "correction",
  "retraction of publication",
  "retracted publication",
  "preprint",
  "case reports",
  "study protocol",
  "protocol",
  "historical article",
  "bibliography",
];

/** Titles that announce themselves as not-a-paper, whatever the type list says. */
const EXCLUDED_TITLE_PATTERNS = [
  /^correction\b/i,
  /^corrigendum\b/i,
  /^erratum\b/i,
  /^retraction\b/i,
  /^editorial\b/i,
  /^comment on\b/i,
  /^reply to\b/i,
  /^response to\b/i,
  /^letter to the editor\b/i,
  /\bstudy protocol\b/i,
  /\bprotocol for a\b/i,
  /\ba (systematic|scoping|narrative) review\b/i,
  /\bmeta-analysis\b/i,
];

/** Signatures of a reported number with uncertainty attached. The remit asks for "a
 *  concrete measured result", and what distinguishes one from a claim is that somebody
 *  reported how sure they were. Two distinct families are required, so a single stray "p <"
 *  in a discussion of someone else's work cannot carry a candidate. */
export const STATISTIC_SIGNATURES = {
  "p-value": [/\bp\s*[=<>≤≥]\s*0?\.\d/i, /\bp-value/i, /\bp\s*<\s*0\.0/i],
  "confidence interval": [/\b95\s*%\s*(ci|confidence)/i, /\bconfidence interval/i],
  "effect size": [/\bcohen'?s\s*d/i, /\bpartial\s*(η|eta)/i, /\bη\s*2|\bη²/i, /\beta[- ]squared/i, /\bhedges/i, /\beffect size/i],
  correlation: [/\bpearson/i, /\bspearman/i, /\br\s*=\s*[-0]?\.\d/i, /\bR\s*²|\bR2\s*=/],
  agreement: [/\bicc\b/i, /\bintraclass/i, /\bbland[–-]?altman/i, /\blimits of agreement/i, /\bkappa\b/i],
  error: [/\brmse\b/i, /\broot mean square/i, /\bmean absolute error/i, /\bmae\b/i, /\bcoefficient of variation/i, /\btypical error/i],
  dispersion: [/\bstandard deviation/i, /\b±\s*\d/, /\bsd\s*=\s*\d/i, /\binterquartile/i],
};

/** Signatures of a design that produced those numbers on purpose. A paper can carry
 *  statistics and still be a commentary quoting them; a design term is the evidence that
 *  this paper ran something. */
export const DESIGN_SIGNATURES = {
  randomised: [/\brandomi[sz]ed/i, /\brandomly assigned/i, /\bcross-?over design/i],
  "repeated measures": [/\brepeated[- ]measures/i, /\bwithin-subject/i, /\bpre-?post\b/i, /\btest-?re-?test/i],
  validation: [/\bconcurrent validity/i, /\bcriterion validity/i, /\bvalidation study/i, /\bvalidity and reliability/i, /\bagainst a (gold standard|reference)/i, /\bgold standard/i, /\breference system/i],
  reliability: [/\breliability\b/i, /\breproducibility\b/i],
  comparison: [/\bcompared (with|to|against)\b/i, /\bbetween-groups?\b/i, /\bcontrol group\b/i],
  longitudinal: [/\bprospective (cohort|study)/i, /\bover (a|the) (season|competitive season)/i, /\bfollow-up period/i],
};

export const MIN_STATISTIC_FAMILIES = 2;
export const MIN_BODY_CHARACTERS = 6000;
export const DEFAULT_WINDOW_DAYS = 60;

/** The clause names, in the order they are applied. A rejection reports exactly one — the
 *  first that refused it — so a run's record reads as a reason rather than a score, and two
 *  runs disagreeing about a candidate point at one clause rather than at a threshold. */
export const CLAUSES = [
  "identifiable",
  "peer-reviewed",
  "research-article",
  "in-remit",
  "clinical-population",
  "recent",
  "open-access-full-text",
  "not-already-published",
  "encountered",
  "about-sport",
  "measured-result",
];

// ---------------------------------------------------------------------------
// Query construction
// ---------------------------------------------------------------------------

/** Europe PMC's search query for this remit.
 *
 *  Narrow on the server where the server can be trusted, and nowhere else. `OPEN_ACCESS:y`
 *  and `IN_EPMC:y` are structural facts the archive knows better than we do, and filtering
 *  on them there instead of here is the difference between reading 25 candidates and reading
 *  25 pages of candidates we cannot open. Everything judgemental — scope, type, recency — is
 *  re-checked locally against the returned record, because a query that is also the bar
 *  leaves no record of what was refused. */
export function buildSearchQuery({ from, to }) {
  // TITLE_ABS, not an unfielded term. Run 153's first live screen asked unfielded and got
  // back conference abstracts on dementia and a paper on liver fibrosis in type 2 diabetes:
  // an unfielded term matches anywhere in an indexed full text, so "athlete" in one sentence
  // of someone's discussion was enough to spend a record on. Asking the title and abstract
  // is asking what the paper is *about*.
  const field = (terms) => terms.map((t) => `TITLE_ABS:"${t}"`).join(" OR ");
  const instrument = field(["inertial measurement unit", "IMU", "accelerometer", "wearable", "markerless", "motion capture", "force plate", "GNSS", "pose estimation", "EMG", "isokinetic dynamometer"]);
  const sport = field(["athlete", "sport", "sprint", "training load", "match play", "soccer", "football", "resistance-trained", "strength and conditioning"]);
  return [
    `(${instrument})`,
    `AND (${sport})`,
    "AND (OPEN_ACCESS:y AND IN_EPMC:y)",
    `AND (FIRST_PDATE:[${from} TO ${to}])`,
  ].join(" ");
}

export function searchUrl(query, { pageSize = 50, cursorMark = "*" } = {}) {
  const u = new URL("https://www.ebi.ac.uk/europepmc/webservices/rest/search");
  u.searchParams.set("query", query);
  u.searchParams.set("resultType", "core");
  u.searchParams.set("format", "json");
  u.searchParams.set("pageSize", String(pageSize));
  u.searchParams.set("cursorMark", cursorMark);
  u.searchParams.set("sort", "P_PDATE_D desc");
  return u.toString();
}

export function fullTextUrl(pmcid) {
  return `https://www.ebi.ac.uk/europepmc/webservices/rest/${encodeURIComponent(pmcid)}/fullTextXML`;
}

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

function asArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

/** The link a reader should be sent to: the publisher's own page for the article.
 *
 *  Preference order, and the reason for it. The publisher's page is where the paper lives
 *  and is what the six hand-made publications on this feed link to, so the feed stays
 *  consistent and the card shows a real publisher domain. `doi.org` is the stable fallback.
 *  Europe PMC's own reader is last, because linking a reader to the archive we happened to
 *  read it from, rather than to the source of record, is an artefact of our plumbing. */
export function readerUrl(record) {
  const urls = asArray(record?.fullTextUrlList?.fullTextUrl);
  const publisher = urls.find(
    (u) =>
      typeof u?.url === "string" &&
      u.url.startsWith("https://") &&
      String(u.site || "").toLowerCase() !== "europe_pmc" &&
      !u.url.includes("europepmc.org") &&
      !u.url.includes("ncbi.nlm.nih.gov")
  );
  if (publisher) return publisher.url;
  if (record?.doi) return `https://doi.org/${record.doi}`;
  if (record?.source && record?.id) return `https://europepmc.org/article/${record.source}/${record.id}`;
  return "";
}

/** One search response into candidate records this module understands. */
export function parseSearchResults(body) {
  const results = asArray(body?.resultList?.result);
  return results.map((r) => ({
    source: String(r.source || ""),
    id: String(r.id || ""),
    pmcid: String(r.pmcid || ""),
    doi: String(r.doi || ""),
    title: String(r.title || "").replace(/\s+/g, " ").replace(/\.$/, "").trim(),
    abstract: String(r.abstractText || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    journal: String(r.journalInfo?.journal?.title || ""),
    firstPublicationDate: String(r.firstPublicationDate || ""),
    isOpenAccess: String(r.isOpenAccess || ""),
    inEPMC: String(r.inEPMC || ""),
    pubTypes: asArray(r.pubTypeList?.pubType).map((t) => String(t).toLowerCase()),
    url: readerUrl(r),
  }));
}

/** JATS full text into the plain prose the bar is applied to.
 *
 *  `<ref-list>` goes first and deliberately: a reference list is the densest source of
 *  statistical-looking strings in any paper — every title containing "p < 0.05" that the
 *  authors merely cited — and grading a bar against other people's titles is how a bar
 *  stops meaning anything. Tables and figure captions are kept, because that is where the
 *  numbers this remit asks for actually are. */
export function extractBodyText(xml) {
  if (typeof xml !== "string" || xml === "") return "";
  let text = xml;
  for (const tag of ["ref-list", "back", "front-stub", "journal-meta"]) {
    text = text.replace(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`, "gi"), " ");
  }
  text = text.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ");
  text = text.replace(/<[^>]+>/g, " ");
  text = text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x?[0-9a-fA-F]+;/g, " ")
    .replace(/&[a-zA-Z]+;/g, " ");
  return text.replace(/\s+/g, " ").trim();
}

// ---------------------------------------------------------------------------
// The bar
// ---------------------------------------------------------------------------

/** One term into the regular expression that matches it, and the two boundary rules are both
 *  there because a plain substring match got one of them wrong.
 *
 *  A LEADING boundary, always. `countSportMentions` originally matched "sport" as a bare
 *  substring and counted **"transport"** as a mention of sport, which is exactly the class of
 *  accident that lets an unrelated paper satisfy a scope clause.
 *
 *  A TRAILING boundary only for short abbreviations. Most terms here are deliberate stems —
 *  "athlete" has to match "athletes", "biomechanic" has to match "biomechanics", "diabet" has
 *  to match both "diabetes" and "diabetic" — so closing the end would break them. For a
 *  three- or four-letter abbreviation the opposite is true: "emg" must not fire on
 *  "emgality". */
export function termPattern(term, flags = "i") {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const closed = term.length <= 4 && /^[a-z]+$/.test(term);
  return new RegExp(`\\b${escaped}${closed ? "\\b" : ""}`, flags);
}

function matchedTerms(haystack, terms) {
  const lower = haystack.toLowerCase();
  return terms.filter((term) => termPattern(term).test(lower));
}

/** The override for the clinical-population clause, and it is deliberately narrower than
 *  SPORT_CONTEXT_TERMS. "Physically active" and "resistance training" appear in clinical
 *  trials constantly — they are how a rehabilitation paper describes its intervention — so
 *  they cannot be what rescues a clinical cohort. An athlete, a player or a named competitive
 *  sport can. */
export const STRONG_SPORT_TERMS = [
  "athlete",
  "athletic performance",
  "competitive season",
  "match play",
  "match-play",
  "elite",
  "professional player",
  "soccer",
  "football",
  "basketball",
  "handball",
  "rugby",
  "volleyball",
  "baseball",
  "cricket",
  "tennis",
  "taekwondo",
  "judo",
  "sprinter",
  "weightlifting",
  "powerlifting",
  "track and field",
  "marathon",
];

export function hasStrongSportTerm(text) {
  return matchedTerms(text, STRONG_SPORT_TERMS).length > 0;
}

/** How many times the full text says it is about sport. Counted across every sport term
 *  rather than per term, because a paper on football says "football", "players" and "match"
 *  and no single one of them has to carry the whole count. */
export function countSportMentions(text) {
  const lower = text.toLowerCase();
  let total = 0;
  for (const term of SPORT_CONTEXT_TERMS) {
    total += (lower.match(termPattern(term, "g")) || []).length;
  }
  return total;
}

function matchedFamilies(text, table) {
  const hits = [];
  for (const [family, patterns] of Object.entries(table)) {
    if (patterns.some((re) => re.test(text))) hits.push(family);
  }
  return hits;
}

function daysBetween(laterIso, earlierIso) {
  const a = Date.parse(laterIso);
  const b = Date.parse(earlierIso);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return Number.POSITIVE_INFINITY;
  return (a - b) / 86_400_000;
}

/** Everything the bar can decide before a byte of full text is fetched.
 *
 *  Split out from `grade` for one operational reason: a network call per candidate is the
 *  expensive part, and a candidate already refused on its type, its scope or its date does
 *  not deserve one. The run record keeps these rejections — a clause that rejects nothing
 *  is a clause nobody can check. */
export function gradeMetadata(candidate, { now, windowDays = DEFAULT_WINDOW_DAYS, publishedUrls = [], publishedDois = [] } = {}) {
  const reject = (clause, detail) => ({ verdict: "rejected", clause, detail });

  if (!candidate.title || !candidate.url) return reject("identifiable", "no title or no resolvable reader URL");
  if (!candidate.pmcid) return reject("identifiable", "no PMC identifier, so no full text can be addressed");

  // PPR is Europe PMC's preprint source. The remit excludes "an unreviewed preprint
  // presented as settled" by name, and a feed cannot present one any other way.
  if (candidate.source === "PPR") return reject("peer-reviewed", "Europe PMC source PPR — preprint");

  const excludedType = candidate.pubTypes.find((t) => EXCLUDED_PUB_TYPES.includes(t));
  if (excludedType) return reject("research-article", `publication type "${excludedType}"`);
  const badTitle = EXCLUDED_TITLE_PATTERNS.find((re) => re.test(candidate.title));
  if (badTitle) return reject("research-article", `title matches ${badTitle}`);

  const scopeText = `${candidate.title} ${candidate.abstract}`;
  const instrument = matchedTerms(scopeText, INSTRUMENT_TERMS);
  const sport = matchedTerms(scopeText, SPORT_CONTEXT_TERMS);
  const movement = matchedTerms(scopeText, MOVEMENT_TERMS);
  if (instrument.length === 0) return reject("in-remit", "no instrument or sensing term in title or abstract");
  if (sport.length === 0) {
    return reject(
      "in-remit",
      movement.length > 0
        ? `movement science without a sport context (matched ${movement.join(", ")}) — this feed is about athletes, not about gait`
        : "no sport or athlete term in title or abstract"
    );
  }

  // A clinical cohort is refused even when the instruments and the statistics are
  // impeccable. The override is a real sport term, so "hamstring injury in professional
  // footballers" passes and "post-stroke balance" does not.
  const clinical = matchedTerms(scopeText, CLINICAL_POPULATION_TERMS);
  if (clinical.length > 0 && !hasStrongSportTerm(scopeText)) {
    return reject("clinical-population", `clinical population (${clinical.join(", ")}) with no athlete or competitive-sport term`);
  }

  const age = daysBetween(now, candidate.firstPublicationDate);
  if (!Number.isFinite(age)) return reject("recent", `unparseable first publication date ${JSON.stringify(candidate.firstPublicationDate)}`);
  if (age > windowDays) return reject("recent", `first published ${age.toFixed(0)} days ago, window is ${windowDays}`);
  // A date in the future is a record we do not understand, not a fresh paper.
  if (age < -1) return reject("recent", `first publication date is ${Math.abs(age).toFixed(0)} days in the future`);

  if (candidate.isOpenAccess !== "Y" || candidate.inEPMC !== "Y") {
    return reject("open-access-full-text", `isOpenAccess=${candidate.isOpenAccess || "?"} inEPMC=${candidate.inEPMC || "?"}`);
  }

  const seenUrl = publishedUrls.some((u) => sameSource(u, candidate.url));
  const seenDoi = candidate.doi && publishedDois.some((d) => d.toLowerCase() === candidate.doi.toLowerCase());
  if (seenUrl || seenDoi) return reject("not-already-published", "this feed has already published this source");

  return { verdict: "passed-metadata", instrument, sport, movement, ageDays: age };
}

/** Two URLs pointing at the same article. Query strings carry article ids at several
 *  publishers, so a bare origin+path comparison would call two PLOS articles the same
 *  source; a full string comparison would miss the same article with a tracking parameter. */
export function sameSource(a, b) {
  const norm = (value) => {
    try {
      const u = new URL(value);
      u.hash = "";
      for (const key of [...u.searchParams.keys()]) {
        if (/^(utm_|src$|ref$|fbclid$|gclid$)/i.test(key)) u.searchParams.delete(key);
      }
      return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/+$/, "")}?${[...u.searchParams.entries()].sort().map(([k, v]) => `${k}=${v}`).join("&")}`;
    } catch {
      return String(value);
    }
  };
  return norm(a) === norm(b);
}

/** The whole bar, metadata plus the encounter. `fullText` is the extracted prose; pass an
 *  empty string for a fetch that failed, and the clause that refuses it says so. */
export function grade(candidate, { now, fullText, fetchNote = "", windowDays = DEFAULT_WINDOW_DAYS, publishedUrls = [], publishedDois = [] } = {}) {
  const meta = gradeMetadata(candidate, { now, windowDays, publishedUrls, publishedDois });
  if (meta.verdict === "rejected") return meta;

  const body = typeof fullText === "string" ? fullText : "";
  if (body.length < MIN_BODY_CHARACTERS) {
    return {
      verdict: "rejected",
      clause: "encountered",
      detail: `full text unreadable or too short (${body.length} chars, need ${MIN_BODY_CHARACTERS})${fetchNote ? ` — ${fetchNote}` : ""}`,
    };
  }

  // The scope question, asked of the full text rather than of the abstract. This is what the
  // expensive read buys: an abstract can mention athletes once while the study ran on a
  // clinical cohort, and on run 153's first live screen the statistics clauses below refused
  // 0 of the 10 candidates that reached them — so the read was paying for nothing.
  const sportMentions = countSportMentions(body);
  if (sportMentions < MIN_SPORT_MENTIONS) {
    return {
      verdict: "rejected",
      clause: "about-sport",
      detail: `the full text mentions sport or athletes ${sportMentions} time${sportMentions === 1 ? "" : "s"} in ${body.length} characters, need ${MIN_SPORT_MENTIONS} — mentioned, not about`,
    };
  }

  const statistics = matchedFamilies(body, STATISTIC_SIGNATURES);
  const designs = matchedFamilies(body, DESIGN_SIGNATURES);
  if (statistics.length < MIN_STATISTIC_FAMILIES) {
    return { verdict: "rejected", clause: "measured-result", detail: `only ${statistics.length} statistic famil${statistics.length === 1 ? "y" : "ies"} reported (${statistics.join(", ") || "none"}), need ${MIN_STATISTIC_FAMILIES}` };
  }
  if (designs.length === 0) {
    return { verdict: "rejected", clause: "measured-result", detail: "no design term — statistics present with nothing saying the authors ran the study" };
  }

  return {
    verdict: "selected",
    clause: null,
    instrument: meta.instrument,
    sport: meta.sport,
    movement: meta.movement,
    sportMentions,
    ageDays: meta.ageDays,
    statistics,
    designs,
    bodyCharacters: body.length,
  };
}

// ---------------------------------------------------------------------------
// Choosing among the selected, and saying so
// ---------------------------------------------------------------------------

/** Rank the passing candidates. Stated here rather than implied by array order.
 *
 *  1. More statistic families reported — the clause the remit actually cares about.
 *  2. More recent first publication.
 *  3. Longer full text, as a proxy for a complete report rather than a brief.
 *  4. DOI, so the order is deterministic and two runs over the same candidate set agree. */
export function rankSelected(graded) {
  return [...graded].sort((x, y) => {
    const a = x.grade;
    const b = y.grade;
    if (b.statistics.length !== a.statistics.length) return b.statistics.length - a.statistics.length;
    const dateDiff = Date.parse(y.candidate.firstPublicationDate) - Date.parse(x.candidate.firstPublicationDate);
    if (Number.isFinite(dateDiff) && dateDiff !== 0) return dateDiff;
    if (b.bodyCharacters !== a.bodyCharacters) return b.bodyCharacters - a.bodyCharacters;
    return x.candidate.doi.localeCompare(y.candidate.doi);
  });
}

export const WHY_MAX = 280;

/** The public "why selected" line.
 *
 *  This is the sentence a reader sees under the agent's name, so it is held to the rule the
 *  remit sets for everything this agent produces: **it describes what the agent did, never
 *  what the paper found.** The agent read the full text and can prove the text contained a
 *  randomised design and 95% confidence intervals; it has not understood the result, and a
 *  line claiming otherwise would be the summariser Tuned is not. Less useful than the
 *  hand-written lines on items 242–279, and honest in a way a generated paraphrase would
 *  not be — recorded as this agent's known limitation rather than as a finished answer.
 *
 *  Composed by dropping whole clauses, never by slicing mid-sentence: the publish route
 *  refuses an over-long `why` rather than truncating it (src/operator.ts), and the same
 *  reasoning applies to building one. */
export function composeWhy({ candidate, grade: g, observed, observedOn }) {
  const chars = g.bodyCharacters.toLocaleString("en-US");
  const head = `Selected by @sportstech from ${observed} open-access candidate${observed === 1 ? "" : "s"} screened ${observedOn}: full text read (${chars} characters).`;
  const design = `Design terms present: ${g.designs.join(", ")}.`;
  const stats = `Reported: ${g.statistics.join(", ")}.`;
  const where = candidate.journal ? `${candidate.journal}, ${candidate.firstPublicationDate}.` : `${candidate.firstPublicationDate}.`;

  // The ladder stops at `[head, stats]` rather than at `[head]` alone, and that floor is
  // deliberate: the statistics are the clause that justified the selection, so a line
  // without them tells a reader that something was chosen and nothing about on what
  // evidence. The family names come from this file's own table and are short, so the floor
  // fits in every real case; if it ever does not, refusing is correct.
  for (const parts of [
    [head, design, stats, where],
    [head, design, stats],
    [head, stats, where],
    [head, stats],
  ]) {
    const line = parts.join(" ");
    if (line.length <= WHY_MAX) return line;
  }
  // Every composition overflowed. Refuse rather than publish a sentence that stops
  // mid-word: the publish route refuses an over-long `why` for the same reason.
  return "";
}

/** A stable idempotency key for one (handle, source) pair. The operator plane's replay
 *  guard is per key, so two runs that independently select the same article publish once. */
export function idempotencyKeyFor(handle, url) {
  let hash = 0n;
  const bytes = new TextEncoder().encode(`${handle}|${url}`);
  for (const byte of bytes) hash = (hash * 1099511628211n + BigInt(byte)) & 0xffffffffffffffffn;
  return `scout-${hash.toString(16).padStart(16, "0")}`;
}
