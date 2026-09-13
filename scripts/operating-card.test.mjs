#!/usr/bin/env node --test
// Proof that the executor operating card still works as a carrier.
//
// WHY THIS EXISTS. The run lock is real mutual exclusion, and runs 155 and 156 shipped eight
// commits without ever calling it. The instruction to call it was not missing — it was at line
// 2493 of a 3,093-line ops/STATUS.md, and the operating-memory contract tells a run to read that
// file's head. A procedure a run is not obliged to reach is not a procedure.
//
// CLAUDE.md is the one file a session in this repository always loads, so the procedure was moved
// there. That only helps while three properties hold, and each is a way the old carrier failed:
//
//   1. the file exists and names the claim command verbatim   — it was never in a loaded file
//   2. the command is near the top                            — depth 2493 is what broke it
//   3. the file stays short enough to be read whole           — 287 KB is what made depth possible
//
// The fourth test is about a different failure: a pointer file whose pointers rot is worse than no
// pointer file, because it is read with the authority of having been loaded automatically.

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CARD_PATH = path.join(REPO_ROOT, "CLAUDE.md");

// The depth at which the claim command must appear. Deliberately generous — the point is not a
// style rule, it is that a run skimming the top of the file cannot miss it. The failure this
// replaces sat 60x deeper than this bound in a file 30x longer than the bound below.
const MAX_LINES_TO_CLAIM_COMMAND = 40;
// The whole card, in lines. A carrier that grows without limit becomes the thing it replaced.
const MAX_CARD_LINES = 200;

const CLAIM_COMMAND = "node scripts/run-claim.mjs claim";
const RELEASE_COMMAND = "node scripts/run-claim.mjs release";

function readCard() {
  return fs.readFileSync(CARD_PATH, "utf8");
}

describe("executor operating card (CLAUDE.md)", () => {
  it("exists at the repository root, where a session loads it without being told to", () => {
    assert.ok(
      fs.existsSync(CARD_PATH),
      "CLAUDE.md is the only file every run is guaranteed to have read; without it the run-lock " +
        "protocol has no carrier a run is obliged to reach",
    );
  });

  it("names the claim and release commands verbatim, so they can be run without guessing", () => {
    const card = readCard();
    assert.ok(card.includes(CLAIM_COMMAND), `CLAUDE.md must contain \`${CLAIM_COMMAND}\``);
    assert.ok(card.includes(RELEASE_COMMAND), `CLAUDE.md must contain \`${RELEASE_COMMAND}\``);
  });

  it("puts the claim command near the top — depth is what made the old carrier fail", () => {
    const lines = readCard().split("\n");
    const at = lines.findIndex((line) => line.includes(CLAIM_COMMAND));
    assert.notEqual(at, -1, "claim command absent");
    assert.ok(
      at < MAX_LINES_TO_CLAIM_COMMAND,
      `claim command is at line ${at + 1}; it must appear within the first ` +
        `${MAX_LINES_TO_CLAIM_COMMAND} lines. ops/STATUS.md carried it at line 2493 and two runs ` +
        `in a row never reached it.`,
    );
  });

  it("stays short enough to be read whole", () => {
    const lines = readCard().split("\n").length;
    assert.ok(
      lines <= MAX_CARD_LINES,
      `CLAUDE.md is ${lines} lines; the cap is ${MAX_CARD_LINES}. Detail belongs in ops/ behind a ` +
        `pointer — a card that grows without limit becomes ops/STATUS.md, which is how the ` +
        `instruction got buried in the first place.`,
    );
  });

  it("references only paths and npm scripts that exist", () => {
    const card = readCard();
    const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8"));

    // Repository-relative paths the card points a run at. Matches `ops/x.md`, `scripts/x.mjs`,
    // `.github/workflows/x.yml` and the like, wherever they appear — prose, links or fenced code.
    const referenced = new Set(
      (card.match(/(?:\.github\/|ops\/|scripts\/|test\/)[A-Za-z0-9._/-]+/g) ?? []).map((m) =>
        // Trailing punctuation from prose ("…in `ops/DECISIONS.md`.") is not part of the path.
        m.replace(/[.]+$/, ""),
      ),
    );
    assert.ok(referenced.size > 0, "the card should point at ops/ and scripts/ — none found");
    for (const rel of referenced) {
      assert.ok(
        fs.existsSync(path.join(REPO_ROOT, rel)),
        `CLAUDE.md points at ${rel}, which does not exist. A card that is always loaded is read ` +
          `with authority; a dead pointer in it is worse than no card.`,
      );
    }

    // npm scripts named in the gate list, e.g. `npm run test:ops`.
    const scripts = new Set(
      (card.match(/npm run ([a-z0-9:_-]+)/g) ?? []).map((m) => m.replace("npm run ", "")),
    );
    assert.ok(scripts.size > 0, "the card should list the gate commands — none found");
    for (const name of scripts) {
      assert.ok(
        pkg.scripts?.[name],
        `CLAUDE.md tells a run to execute \`npm run ${name}\`, which package.json does not define`,
      );
    }
  });
});
