#!/usr/bin/env node
// `@sportstech`'s publisher, running without a person in it. The reasoning, the remit
// translation and the bar are in scripts/lib/agent-scout.mjs; this file is the hands.
//
//   node scripts/agent-scout.mjs                 # screen and report. Publishes NOTHING.
//   node scripts/agent-scout.mjs --publish       # also publish the top selection, if any
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
// on Tuned's behalf: one search request, then at most --max-reads full-text requests, with
// a pause between them, against Europe PMC's documented key-free REST API. It declares
// itself honestly in its User-Agent with a contact address, follows no links, and fetches no
// page a human would otherwise be served — `fullTextXML` is the archive's own machine
// endpoint. Nothing here retries a refusal or varies its identity to get a different answer.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_WINDOW_DAYS,
  buildSearchQuery,
  composeWhy,
  extractBodyText,
  fullTextUrl,
  grade,
  gradeMetadata,
  idempotencyKeyFor,
  parseSearchResults,
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
  if (!res.ok) throw new Error(`HTTP ${res.status} from Europe PMC search`);
  return await res.json();
}

async function getFullText(url, fetchImpl) {
  let res;
  try {
    res = await fetchImpl(url, { headers: { accept: "application/xml", "user-agent": USER_AGENT } });
  } catch (err) {
    return { xml: "", note: `fetch threw: ${String(err).slice(0, 200)}` };
  }
  if (!res.ok) return { xml: "", note: `HTTP ${res.status}` };
  const xml = await res.text();
  if (xml.length > MAX_FULL_TEXT_BYTES) return { xml: xml.slice(0, MAX_FULL_TEXT_BYTES), note: `truncated at ${MAX_FULL_TEXT_BYTES} bytes` };
  return { xml, note: "" };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** One screening cycle. Pure except for the injected `fetchImpl` and `pause`, so the whole
 *  pipeline — not merely the bar — is exercisable against recorded responses. */
export async function screen({
  now = new Date(),
  windowDays = DEFAULT_WINDOW_DAYS,
  pageSize = 50,
  maxReads = 12,
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
  const body = await getJson(searchUrl(query, { pageSize }), fetchImpl);
  const candidates = parseSearchResults(body);
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
  for (const { candidate } of passedMetadata) {
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
    if (reads > 0) await pause(1200);
    const { xml, note } = await getFullText(fullTextUrl(candidate.pmcid), fetchImpl);
    reads += 1;
    const fullText = extractBodyText(xml);
    const g = grade(candidate, { now: nowIso, fullText, fetchNote: note, windowDays, publishedUrls: published.urls, publishedDois: published.dois });
    observations.push({
      candidate,
      verdict: g.verdict,
      clause: g.clause,
      detail: g.detail ?? "",
      encountered: fullText.length > 0,
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
    observations,
    selected,
  };
}

/** Publish one selection through the operator plane. The plane, not a second code path: it
 *  already owns the owner scoping, the handle validation, the field budgets, the replay
 *  guard and the retract/restore audit trail, and an agent that published around it would be
 *  an authority this repository has never reviewed. */
async function publishOne({ handle, base, key, find, fetchImpl = fetch, log = console.log }) {
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
    return { status: res.status, published: false, duplicate: false, itemId: null };
  }
  log(`  publish: HTTP ${res.status} · published=${parsed.published ?? false} duplicate=${parsed.duplicate ?? false} item_id=${parsed.item_id ?? "none"}${parsed.error ? ` error=${parsed.error}` : ""}`);
  return { status: res.status, published: Boolean(parsed.published), duplicate: Boolean(parsed.duplicate), itemId: parsed.item_id ?? null, error: parsed.error };
}

function renderTable(report) {
  const rows = report.observations.map((o) => {
    const verdict = o.verdict === "selected" ? "SELECTED" : o.verdict;
    const reason = o.verdict === "selected" ? `${o.grade.statistics.length} stat families, ${o.bodyCharacters} chars` : `${o.clause}: ${o.detail}`;
    return `| ${verdict} | ${o.candidate.pmcid || o.candidate.id} | ${o.candidate.title.slice(0, 90)} | ${reason.slice(0, 150)} |`;
  });
  return ["| Verdict | Id | Title | Why |", "| --- | --- | --- | --- |", ...rows].join("\n");
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

  const report = await screen({ now, windowDays, pageSize, maxReads });

  const counts = report.observations.reduce((acc, o) => {
    acc[o.verdict] = (acc[o.verdict] ?? 0) + 1;
    return acc;
  }, Object.create(null));
  console.log("");
  console.log(renderTable(report));
  console.log("");
  console.log(
    `screened ${report.returned} · ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(" · ") || "nothing"} · full-text reads ${report.full_text_reads}`
  );

  let find = null;
  if (report.selected.length > 0) {
    const top = report.selected[0];
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
      console.log(`  why:   ${find.why}`);
      console.log(`  key:   ${find.idempotencyKey}`);
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
      "",
      renderTable(report),
      "",
      find ? `**Top selection:** [${find.title}](${find.url})\n\n> ${find.why}` : "**Nothing passed the bar this cycle.**",
      "",
      publication ? `Publication: HTTP ${publication.status} · published=${publication.published} · duplicate=${publication.duplicate} · item_id=${publication.itemId ?? "none"}` : "No publication attempted.",
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
