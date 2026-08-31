#!/usr/bin/env node
// CLI for the executor run lock. See scripts/lib/run-claim.mjs for the mechanism and the
// reason it is shaped the way it is.
//
//   node scripts/run-claim.mjs claim     # step 0 of a run — before ANY commit, comment,
//                                        # dispatch or external action. Exit 0 won,
//                                        # exit 75 lost (clean, expected, no mutation).
//   node scripts/run-claim.mjs status    # who holds it right now
//   node scripts/run-claim.mjs release   # end of run; --outcome completed|aborted
//
// Options: --resource NAME  --cycle ID  --holder ID  --ttl SECONDS  --remote NAME  --json
//          --repo PATH  (test seam: contend from a scratch repo instead of this checkout)
//
// Defaults are chosen so two sessions that never speak to each other still contend for the
// same lock: resource `executor`, and a cycle label derived from the Sydney firing windows.

import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_RESOURCE,
  DEFAULT_TTL_SECONDS,
  EXIT_LOST,
  claim,
  defaultCycle,
  defaultHolder,
  readState,
  release,
  status,
  writeState,
} from "./lib/run-claim.mjs";

const CHECKOUT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const flags = Object.create(null);
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    if (key === "json") flags.json = true;
    else flags[key] = rest[++i];
  }
  return { command, flags };
}

function describe(holder) {
  if (!holder) return "nobody";
  const until = new Date(
    Date.parse(holder.at) + (holder.ttlSeconds ?? DEFAULT_TTL_SECONDS) * 1000,
  ).toISOString();
  return `${holder.holder} (cycle ${holder.cycle}, claimed ${holder.at}, lease to ${until})`;
}

const { command, flags } = parseArgs(process.argv.slice(2));
const REPO_ROOT = flags.repo ? path.resolve(flags.repo) : CHECKOUT_ROOT;
const remote = flags.remote ?? "origin";
const resource = flags.resource ?? DEFAULT_RESOURCE;
const cycle = flags.cycle ?? defaultCycle();
const holder = flags.holder ?? defaultHolder();
const ttlSeconds = flags.ttl ? Number(flags.ttl) : DEFAULT_TTL_SECONDS;

function emit(payload, humanLines) {
  if (flags.json) console.log(JSON.stringify(payload, null, 2));
  else for (const line of humanLines) console.log(line);
}

try {
  if (command === "claim") {
    const result = claim(REPO_ROOT, remote, { resource, cycle, holder, ttlSeconds });
    if (result.won) {
      writeState(REPO_ROOT, result.record);
      emit({ won: true, ...result }, [
        `CLAIMED ${resource} ${cycle}`,
        `  holder: ${holder}`,
        `  nonce:  ${result.record.nonce}`,
        result.reason === "takeover-stale"
          ? `  note:   took over an expired claim (${result.record.supersedes}) — the prior session left no release`
          : `  attempt: ${result.attempt}`,
      ]);
      process.exit(0);
    }
    emit({ won: false, ...result }, [
      `NOT CLAIMED ${resource} ${cycle} — ${result.reason}`,
      `  held by: ${describe(result.holder)}`,
      "  This session must stop here: no commit, no comment, no dispatch, no deploy.",
    ]);
    process.exit(EXIT_LOST);
  } else if (command === "release") {
    const held = readState(REPO_ROOT);
    if (!held) {
      console.error("no local claim state — this session never claimed, nothing to release");
      process.exit(1);
    }
    const result = release(REPO_ROOT, remote, {
      resource: held.resource,
      cycle: held.cycle,
      holder: held.holder,
      nonce: held.nonce,
      outcome: flags.outcome ?? "completed",
    });
    if (!result.won) {
      console.error(`release did not land after ${result.attempt} attempts (${result.reason})`);
      process.exit(1);
    }
    emit({ released: true, ...result }, [
      `RELEASED ${held.resource} ${held.cycle} (${flags.outcome ?? "completed"})`,
    ]);
  } else if (command === "status") {
    const state = status(REPO_ROOT, remote, { resource, cycle });
    const live = state.decision.reason === "lease-held";
    emit(state, [
      `resource: ${resource}`,
      `cycle:    ${cycle}`,
      `register: ${state.tip ?? "(branch does not exist yet)"} — ${state.records.length} record(s)`,
      `state:    ${state.decision.reason}`,
      `holder:   ${live || state.decision.reason === "cycle-complete" ? describe(state.decision.holder) : "nobody"}`,
    ]);
  } else {
    console.error("usage: run-claim.mjs <claim|release|status> [--resource N] [--cycle ID] [--holder ID] [--ttl S] [--remote R] [--json]");
    process.exit(2);
  }
} catch (err) {
  // Fail closed. If the guard cannot determine the lock state it must not report a win.
  console.error(`run-claim: ${err.message}`);
  process.exit(1);
}
