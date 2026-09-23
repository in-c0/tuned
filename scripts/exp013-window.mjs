#!/usr/bin/env node
// EXP-013's reading, computed from the screening records rather than read off them by eye.
//
// WHY THIS FILE EXISTS. EXP-013 asks whether an agent feed can publish on a cadence with no
// person selecting, and its reading falls due 2026-09-26. Thresholds 1 and 2 are graded on what
// every live screen in the window did — "a per-candidate verdict for every record it read", and
// "selection rate <= 25% of screened candidates on EVERY live screen". That evidence exists in
// exactly one place: the `scout-record` artifact each `agent scout` run uploads.
//
// Three facts about that place, each established rather than assumed:
//
//   1. Nothing in this repository reads it. `scripts/scout-gate.mjs` says so in its own header
//      and reads `qa/nominations/` instead, deliberately, because the record "needs the network
//      and a credential". That is the right call for a gate that runs every cycle. It leaves the
//      READING — a once-only act with a deadline — with no instrument at all.
//   2. The executor session cannot fetch one. Artifact download redirects to
//      `productionresultssa3.blob.core.windows.net`, which this environment's egress proxy
//      answers with `403 CONNECT` (re-tested run 186, alongside `justtuned.com`). The API that
//      LISTS artifacts is reachable; the bytes are not. So the reading has to run where the
//      evidence is, which is inside Actions.
//   3. The artifacts expire at 90 days, and the executor stops on 2026-10-05. EXP-013's evidence
//      outlives neither the reading nor the reader unless something puts it in the repository.
//
// WHY A SCREEN'S OWN LOG IS NOT ENOUGH, which is the load-bearing half. Run 184 found the
// 2026-09-22 02:40Z scheduled screen reporting `search returned 0 candidates (hitCount ?)` — a
// green run, an uploaded record, no annotation, and a screening step that took 1 second against
// the 20-22s every working screen takes. It read as a thin week and was an instrument failure.
// `searchResponseDefect()` in scripts/lib/agent-scout.mjs now refuses that response shape at the
// source, so no FUTURE screen can write that record. It does nothing for the nine screens already
// in the window, and a reading that trusts every record it is handed would have counted that day
// as a legitimate zero. `screenState()` below is the same judgement applied to a record after the
// fact: a screen that decided nothing is reported as contributing NO reading, never as a quiet
// one. L-102's shape, one layer further out.
//
// WHAT THIS DOES NOT GRADE, so that no later run mistakes its output for the whole reading.
// Thresholds 3 (provenance on both public surfaces), 4 (freshness with zero hand publications)
// and 5 (every published item on remit under a HUMAN reading) are not computable from a screening
// record and are not attempted here. 3 is graded by qa/exp008-provenance.spec.mjs against the
// registry, 4 against production, and 5 by a person. This grades 1 and 2, which are the two only
// the records can answer.
//
// It also does not rewrite the threshold it grades. EXP-013 already recorded threshold 2 as
// FAILED at 25.7% and its denominator as mis-specified — "the denominator counts candidates the
// bar never decided" — and pre-committed not to rewrite it inside its own window. So the decided
// -set rate is reported ALONGSIDE the pre-registered one and never in place of it: the bar being
// graded is the bar as written, and the second column is the evidence for the objection already
// on record, not a quiet substitution of a kinder number.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/** EXP-013's pre-registered window, from ops/EXPERIMENTS.md. Complete days, UTC. */
export const WINDOW = Object.freeze({ from: "2026-09-12", to: "2026-09-25" });

/** The pre-registered bar for threshold 2, as written. Not adjusted here. */
export const SELECTION_RATE_BAR = 0.25;

/**
 * What a record is, as evidence. Three states, because "the bar refused everything" and "the bar
 * was never asked" are the same observable in a count and must never be the same row in a reading.
 *
 *   ok        — the screen reached a verdict on at least one candidate.
 *   empty     — the search returned nothing. A legitimate quiet cycle for the PUBLISHER (run 184
 *               deliberately kept `hitCount: 0` a clean exit so the bar does not cry wolf), but it
 *               contributes NO observation to a threshold graded "on every live screen".
 *   malformed — the record contradicts itself: it claims candidates and carries no verdicts. This
 *               is the 2026-09-22 shape and the reason this function exists.
 */
export function screenState(record) {
  if (!record || typeof record !== "object") return { state: "malformed", why: "record is not an object" };
  const returned = record.returned;
  const observations = Array.isArray(record.observations) ? record.observations : null;
  if (!Number.isInteger(returned) || returned < 0) {
    return { state: "malformed", why: `\`returned\` is ${JSON.stringify(returned)}, not a count` };
  }
  if (observations === null) return { state: "malformed", why: "`observations` is absent" };
  if (returned > 0 && observations.length === 0) {
    return { state: "malformed", why: `claims ${returned} candidate(s) and records no verdict for any of them` };
  }
  if (returned === 0) return { state: "empty", why: "the search returned no candidates, so the bar decided nothing" };
  return { state: "ok", why: "" };
}

/** One screen's contribution to thresholds 1 and 2. `null` when the record yields no reading. */
export function gradeScreen(record) {
  const { state, why } = screenState(record);
  if (state !== "ok") return { state, why, reading: null };

  const verdicts = record.observations.reduce((acc, o) => {
    acc[o.verdict] = (acc[o.verdict] ?? 0) + 1;
    return acc;
  }, Object.create(null));

  const screened = record.returned;
  const selected = verdicts.selected ?? 0;
  const rejected = verdicts.rejected ?? 0;
  const deferred = verdicts.deferred ?? 0;
  const decided = selected + rejected;

  // Threshold 1 has two clauses and the second is the one that can fail quietly: every rejection
  // must name EXACTLY ONE clause. A rejection with no clause is a verdict with no reason.
  const unclaused = record.observations.filter(
    (o) => o.verdict === "rejected" && (typeof o.clause !== "string" || o.clause.trim() === "")
  ).length;

  return {
    state,
    why,
    reading: {
      screened,
      selected,
      rejected,
      deferred,
      decided,
      rate: screened === 0 ? null : selected / screened,
      decidedRate: decided === 0 ? null : selected / decided,
      unclaused,
      fullTextReads: record.full_text_reads ?? 0,
      // The identity of the top selection. Screens that all select the same paper are one
      // observation repeated, not several independent ones, and a reading that does not say so
      // overstates its own evidence. The field is `idempotencyKey` — `agent-scout.mjs` logs it
      // as `key:` but serialises it under its real name, and reading the log's label instead of
      // the record's cost this file one wrong reading before anyone saw it.
      topKey: record.find?.idempotencyKey ?? record.find?.url ?? null,
      topUrl: record.find?.url ?? null,
      // Whether the screen reached a publishable top selection at all. `find` is null when
      // nothing passed the bar, and also when the `why` line could not be composed inside its
      // budget — a screen that selected nine and could publish none.
      top: record.find != null,
      // NOT reported: whether the agent quoted its source. EXP-013's "known limitation" names
      // quotation as the first thing to improve, so it is the column this reading most wants —
      // and the record does not carry it. `selectQuotation()`'s result is logged and never
      // serialised, so the only honest thing to print about it here is nothing. Recovering it
      // means writing it into the record, which is a change to the publisher inside the
      // experiment's own window and is therefore not made here.
    },
  };
}

const pct = (r) => (r === null ? "—" : `${(r * 100).toFixed(1)}%`);

/** The window table and the two verdicts it supports. `rows` are {date, runId, record}. */
export function renderWindow(rows) {
  const graded = rows.map((r) => ({ ...r, ...gradeScreen(r.record) }));
  const live = graded.filter((g) => g.reading !== null);

  const lines = [];
  lines.push(`| date | run | screened | selected | rate | decided | rate on decided | top selection | state |`);
  lines.push(`| --- | --- | --- | --- | --- | --- | --- | --- | --- |`);
  for (const g of graded) {
    const r = g.reading;
    lines.push(
      r
        ? `| ${g.date} | [${g.runId}](https://github.com/in-c0/tuned/actions/runs/${g.runId}) | ${r.screened} | ${r.selected} | **${pct(r.rate)}** | ${r.decided} | ${pct(r.decidedRate)} | ${r.topKey ?? "none"} | ok |`
        : `| ${g.date} | [${g.runId}](https://github.com/in-c0/tuned/actions/runs/${g.runId}) | — | — | — | — | — | — | **${g.state}** — ${g.why} |`
    );
  }

  const overBar = live.filter((g) => g.reading.rate > SELECTION_RATE_BAR);
  const unclaused = live.reduce((n, g) => n + g.reading.unclaused, 0);
  const keys = new Set(live.map((g) => g.reading.topKey).filter(Boolean));
  const noReading = graded.filter((g) => g.reading === null);

  lines.push("");
  lines.push(
    `**Threshold 1** — ${live.length} of ${graded.length} screen(s) reached a verdict; ` +
      (unclaused === 0
        ? "every rejection names exactly one clause."
        : `**${unclaused} rejection(s) name no clause.**`) +
      (noReading.length === 0
        ? ""
        : ` **${noReading.length} screen(s) contribute no reading** (${noReading.map((g) => `${g.date} ${g.state}`).join(", ")}).`)
  );
  lines.push("");
  lines.push(
    `**Threshold 2** — selection rate <= ${pct(SELECTION_RATE_BAR)} on every live screen: ` +
      (overBar.length === 0
        ? `**held on all ${live.length}**.`
        : `**FAILS on ${overBar.length} of ${live.length}** — ${overBar.map((g) => `${g.date} ${pct(g.reading.rate)}`).join(", ")}.`)
  );
  lines.push("");
  // Three cases, and the first is the one that matters: NO identity is not the same claim as ONE
  // identity. An earlier version collapsed them under `<= 1` and printed "every screen chose the
  // same candidate" over nine records that carried no key at all — a sentence about the evidence,
  // generated from its absence. That is precisely the unsourced number CLAUDE.md forbids, and it
  // is easiest to write about one's own instrument.
  lines.push(
    keys.size === 0
      ? `**Independence** — cannot be read: none of the ${live.length} live screen(s) records a top-selection identity.`
      : keys.size === 1
        ? `**Independence** — the ${live.length} live screen(s) carry **1** distinct top selection. Every screen chose the same candidate, so these are one observation repeated, not independent readings.`
        : `**Independence** — the ${live.length} live screen(s) carry **${keys.size}** distinct top selection(s).`
  );

  return lines.join("\n");
}

// ---------------------------------------------------------------------------------------------
// Everything below needs the network and a credential, and runs inside Actions. Nothing above
// does, which is why the grading is what carries the tests.
// ---------------------------------------------------------------------------------------------

const API = "https://api.github.com";
const REPO = process.env.GITHUB_REPOSITORY ?? "in-c0/tuned";

async function api(pathname) {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is unset; this reads the Actions API");
  const res = await fetch(`${API}${pathname}`, {
    headers: { authorization: `Bearer ${token}`, accept: "application/vnd.github+json" },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`GET ${pathname} -> ${res.status}`);
  return res.json();
}

/** The scheduled screens in the window. Dispatches are excluded: the cadence is what EXP-013 tests. */
async function scheduledScreens() {
  const workflows = await api(`/repos/${REPO}/actions/workflows`);
  const scout = workflows.workflows.find((w) => w.path.endsWith("agent-scout.yml"));
  if (!scout) throw new Error("agent-scout.yml not found among the repository's workflows");
  const runs = await api(`/repos/${REPO}/actions/workflows/${scout.id}/runs?per_page=100`);
  return runs.workflow_runs
    .filter((r) => r.event === "schedule")
    .map((r) => ({ runId: r.id, date: r.created_at.slice(0, 10), createdAt: r.created_at }))
    .filter((r) => r.date >= WINDOW.from && r.date <= WINDOW.to)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/** The one `scout-record` a run uploaded, parsed. `null` when the run uploaded none. */
async function fetchRecord(runId, tmp) {
  const { artifacts } = await api(`/repos/${REPO}/actions/runs/${runId}/artifacts`);
  const art = artifacts.find((a) => a.name === "scout-record" && !a.expired);
  if (!art) return null;

  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  const res = await fetch(art.archive_download_url, {
    headers: { authorization: `Bearer ${token}` },
    redirect: "follow",
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) throw new Error(`artifact ${art.id} -> ${res.status}`);

  const zip = path.join(tmp, `${runId}.zip`);
  fs.writeFileSync(zip, Buffer.from(await res.arrayBuffer()));
  // `unzip -p` rather than a hand-rolled inflate: the runner has it, and a zip parser written
  // here would be a second thing that can be wrong about a record this reading depends on.
  const out = spawnSync("unzip", ["-p", zip, "scout-record.json"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (out.status !== 0) throw new Error(`unzip ${zip}: ${out.stderr}`);
  try {
    return JSON.parse(out.stdout);
  } catch (err) {
    // A record that will not parse is itself a reading, and a malformed one.
    return { __unparseable: String(err) };
  }
}

async function main() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "exp013-"));
  const screens = await scheduledScreens();
  console.log(`${screens.length} scheduled screen(s) in ${WINDOW.from} → ${WINDOW.to}\n`);

  const rows = [];
  for (const s of screens) {
    const record = await fetchRecord(s.runId, tmp);
    rows.push({ ...s, record });
  }

  const table = renderWindow(rows);
  console.log(table);

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `### EXP-013 — window reading (${WINDOW.from} → ${WINDOW.to})\n\n${table}\n`
    );
  }
}

if (process.argv[1] && path.resolve(process.argv[1]).endsWith("exp013-window.mjs")) {
  main().catch((err) => {
    console.log(`::error::EXP-013 window reading failed: ${String(err)}`);
    process.exit(1);
  });
}
