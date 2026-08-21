// The nomination registry — what was dispatched, recorded before it was dispatched.
//
// EXP-008 threshold 5 asks whether a published agent find carries its provenance on both public
// surfaces. Grading that means comparing production against the strings that were *nominated*,
// and the only thing that makes such a comparison a test rather than a tautology is that the
// expected strings were written down before the publication existed.
//
// Until run 66 those strings were constants inside qa/exp008-provenance.spec.mjs. That froze the
// ordering correctly but made the instrument single-item: grading a second publication required
// editing the spec, and an instrument edited to agree with today's production is not a test
// (L-31). So run 65 published item 246 and deliberately did NOT claim threshold 5 for it — the
// honest gap this file exists to close.
//
// The registry generalizes the guarantee instead of relaxing it. One JSON file per nomination,
// each carrying the commit that first recorded its strings and the time that commit was made;
// the loader below refuses any entry whose pre-registration commit does not predate its own
// publication. Adding a publication is a data file, not a code edit.
//
// Load-bearing limitation, stated here rather than discovered later: this module proves the
// *ordering* of a commit against a publication. It cannot, on its own, prove that the strings in
// the JSON are the strings in that commit — a JSON file is editable like any other. Two things
// narrow that gap and neither is hidden: every entry carries a `verifyWith` command a reader can
// run against git history, and scripts/validate-nominations.mjs runs the url/title half of that
// comparison automatically whenever the pre-registration commit is present in the clone.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const NOMINATIONS_DIR = path.dirname(fileURLToPath(import.meta.url));

// The publish API's own field budgets, from src/operator.ts. A nomination that exceeds them
// describes something the API would have silently truncated, which is the run-45 defect.
export const TITLE_MAX = 300;
export const WHY_MAX = 280;

const REQUIRED_STRINGS = ["handle", "url", "title", "category", "why"];
const PREREG_FORMS = new Set(["spec-constants", "nomination-markdown"]);

function isIsoInstant(value) {
  return typeof value === "string" && value !== "" && Number.isFinite(Date.parse(value));
}

/**
 * Validate one parsed nomination. Returns an array of human-readable problems; empty means valid.
 * Kept pure and dependency-free so both the Playwright spec and the CI validator use the same
 * rules — a nomination the gate accepts is exactly a nomination the instrument will grade.
 */
export function validateNomination(n, label) {
  const problems = [];
  const bad = (msg) => problems.push(`${label}: ${msg}`);

  if (!Number.isInteger(n.itemId) || n.itemId <= 0) bad(`itemId must be a positive integer, got ${JSON.stringify(n.itemId)}`);

  for (const key of REQUIRED_STRINGS) {
    if (typeof n[key] !== "string" || n[key].trim() === "") bad(`${key} must be a non-empty string`);
  }

  if (typeof n.handle === "string" && !/^[a-z0-9-]+$/.test(n.handle)) bad(`handle ${JSON.stringify(n.handle)} is not a feed handle`);
  if (typeof n.url === "string" && !n.url.startsWith("https://")) bad(`url must be https, got ${JSON.stringify(n.url)}`);
  if (typeof n.title === "string" && n.title.length > TITLE_MAX) bad(`title is ${n.title.length} chars, over the ${TITLE_MAX} the API accepts`);
  if (typeof n.why === "string" && n.why.length > WHY_MAX) bad(`why is ${n.why.length} chars, over the ${WHY_MAX} the API accepts — it would have been truncated`);

  if (!isIsoInstant(n.publishedAt)) bad("publishedAt must be an ISO instant");

  const prereg = n.preregistration;
  if (!prereg || typeof prereg !== "object") {
    bad("preregistration is required — an expected string with no recorded origin grades nothing");
    return problems;
  }
  if (typeof prereg.commit !== "string" || !/^[0-9a-f]{7,40}$/.test(prereg.commit)) bad("preregistration.commit must be a git sha");
  if (!isIsoInstant(prereg.committedAt)) bad("preregistration.committedAt must be an ISO instant");
  if (!PREREG_FORMS.has(prereg.form)) bad(`preregistration.form must be one of ${[...PREREG_FORMS].join(", ")}`);
  if (typeof prereg.verifyWith !== "string" || prereg.verifyWith.trim() === "") bad("preregistration.verifyWith must name the command that checks this entry against git");
  if ("transcribedAt" in prereg && !isIsoInstant(prereg.transcribedAt)) bad("preregistration.transcribedAt, when present, must be an ISO instant");

  // The one invariant the whole instrument rests on.
  if (isIsoInstant(prereg.committedAt) && isIsoInstant(n.publishedAt)) {
    if (Date.parse(prereg.committedAt) >= Date.parse(n.publishedAt)) {
      bad(
        `pre-registration ${prereg.committedAt} does not precede publication ${n.publishedAt} — ` +
          "an expectation recorded after the fact cannot grade the fact",
      );
    }
  }

  return problems;
}

/**
 * Read every nomination in this directory, validated and sorted by publication time.
 * Throws on an invalid or empty registry: a green run over zero nominations would report
 * "provenance holds" while checking nothing, which is the failure mode this loop keeps meeting.
 */
export function loadNominations() {
  const files = fs
    .readdirSync(NOMINATIONS_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  if (files.length === 0) {
    throw new Error(`no nominations in ${NOMINATIONS_DIR} — refusing to report a vacuous pass`);
  }

  const problems = [];
  const seen = new Map();
  const nominations = [];

  for (const file of files) {
    const full = path.join(NOMINATIONS_DIR, file);
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(full, "utf8"));
    } catch (e) {
      problems.push(`${file}: not valid JSON — ${e.message}`);
      continue;
    }
    problems.push(...validateNomination(parsed, file));
    if (seen.has(parsed.itemId)) problems.push(`${file}: itemId ${parsed.itemId} already declared in ${seen.get(parsed.itemId)}`);
    else seen.set(parsed.itemId, file);
    nominations.push({ ...parsed, file });
  }

  if (problems.length) {
    throw new Error(`invalid nomination registry:\n  - ${problems.join("\n  - ")}`);
  }

  return nominations.sort((a, b) => Date.parse(a.publishedAt) - Date.parse(b.publishedAt));
}
