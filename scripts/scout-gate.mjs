#!/usr/bin/env node
// Does `@sportstech`'s publication gate owe attention right now?
//
// WHY THIS EXISTS. Run 153 put the scout's publication behind an explicit dispatch — the cron
// screens, `--publish` does not come from the schedule — on the reasoning that an unattended
// publisher is admissible only under a bar whose pre-registered quality threshold has been met,
// and EXP-013's threshold 2 had not been. That reasoning holds and this file does not disturb it.
// The workflow says who the gate is for in its own words: *"Publication stays behind an explicit
// dispatch by someone who has read the screening record."*
//
// What it became is L-97. Between 2026-09-13 and 2026-09-20 the schedule fired eight times, every
// run succeeded, every run selected about nine publishable candidates out of about thirty-seven
// screened, and every one was discarded — because the screening records are workflow artifacts
// that nothing in this repository reads, and the operating card's read order reaches no artifact.
// **A gate nobody attends and a pipeline with nothing in it produce the same observable:** a feed
// that does not move. Runs 176, 177 and 178 each found a real defect in the plumbing between a
// feed and a member and none of them asked whether the feed had anything to put through it.
//
// So: an attended gate is a commitment to attend it, and the commitment needs a carrier a run is
// obliged to reach. CLAUDE.md is that carrier (the run-lock precedent, L-76); this is the reading
// it names. Nine days of a silent feed was the cost of it not existing.
//
// WHY THE REGISTRY AND NOT THE SCREENING RECORD. The record is the richer source — it carries the
// queue's *depth*, every rejection and its clause — and it is an Actions artifact: it needs the
// network and a credential, and it expires at 90 days. `qa/nominations/` is in the repository, is
// already validated by a gate in `check.yml`, and already carries this publisher's own
// publications under an ordering invariant. So this reads the part that decides **whether to go
// and read the record** — has a screen been delivered since the last publication? — and never
// claims to be the record itself.
//
// WHICH DIRECTION IT CAN BE WRONG IN. A `@sportstech` publication that was never registered here
// makes this report the feed staler than it is. It cannot make the feed look fresher than it is,
// because a missing entry can only move the newest publication backwards. The same holds for the
// delivery allowance below: it counts a screen only once that screen has *certainly* been
// delivered, so it under-reports discarded screens and can never invent one.
//
// **What run 180 wrote here next was wrong, and run 181 corrected it rather than softening it.**
// It said an unregistered publication "costs a run one look at a screening record and corrects
// itself" — true of the *reading*, false of what the reading is for. `ATTEND` is the verdict that
// sends the next run to the record **in order to publish**. So an unregistered publication does
// not cost a look, it buys a second publication; and the run after it a third, because nothing in
// that sequence registers anything either. Three scheduled runs a day against a one-item-per-run
// cap is how "recurring agent value *without attention overload*" stops holding — by way of the
// mechanism built to protect it. Under-reporting in the safe direction was the whole argument for
// reading the registry, and the argument only covers the sentence this prints, not the act it
// asks for.
//
// The registry is load-bearing twice over, which is the other half of why this matters:
// `publishedSources()` in scripts/agent-scout.mjs reads the same directory as the bar's
// `not-already-published` clause, so an unregistered publication is also invisible to the screen
// that must not re-select it. The plane's idempotency key catches that one at the far end; the
// gate has no such backstop.
//
// **The fix is not a louder instruction.** Runs 179 and 180 both read this file and neither had
// one. `nominationEntry()` in scripts/lib/agent-scout.mjs composes the entry inside the publisher,
// at the moment it publishes, and `agent-scout.mjs` leaves it in the working tree with its path in
// the log. A run still chooses to commit it — that is a claim about a publication and belongs to a
// run that looked — but nobody retypes it out of a log any more, which is where both of the
// registry's recorded transcription defects came from.
//
// WHY NEITHER VERDICT IS A FAILURE. This is a reading, not a gate: `ATTEND` and `CURRENT` both
// exit 0, and only a registry it cannot read at all exits non-zero. Failing a build — and so
// blocking an unrelated push — because a feed has gone quiet would be a worse defect than the one
// it reports, and it would put the executor under pressure to publish in order to get a build
// green, which is exactly the pressure the bar exists to keep off the publisher.

import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadNominations, NOMINATIONS_DIR } from "../qa/nominations/index.mjs";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** The one feed with a publisher. `.github/workflows/agent-scout.yml`, `ops/agents/sportstech.md`. */
export const SCOUT_HANDLE = "sportstech";

/** The screening schedule, from `agent-scout.yml`'s `cron: "40 2 * * *"`. Daily, UTC. */
export const SCREEN_CRON_UTC = Object.freeze({ hour: 2, minute: 40 });

// Scheduled runs in this repository have been delivered 1.6h–4.5h late on every firing since
// 2026-08-26 — measured, not assumed (scripts/executor-liveness.mjs). Five hours is past the
// worst of that, so a firing this counts as delivered has certainly happened. The cost of the
// allowance is that a screen delivered in the last five hours is not yet counted, which is the
// under-reporting direction.
export const DELIVERY_ALLOWANCE_HOURS = 5;

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

/** Guards the walk below against a nonsense clock turning a loop into a hang. */
const MAX_DAYS_WALKED = 4000;

function toMs(value, label) {
  const ms = value instanceof Date ? value.getTime() : Date.parse(value);
  if (!Number.isFinite(ms)) throw new Error(`${label} is not a readable instant: ${String(value)}`);
  return ms;
}

/**
 * Every scheduled screening instant strictly after `afterMs` and at or before `untilMs`.
 *
 * Returned as epoch-millisecond numbers, oldest first. An empty array means no screen has been
 * delivered since the publication — which is the only reading that lets the gate stay shut.
 */
export function screensBetween(afterMs, untilMs, cron = SCREEN_CRON_UTC) {
  const out = [];
  if (!(untilMs > afterMs)) return out;

  // The publication's own UTC day is the first candidate: `setUTCHours` moves the clock to that
  // day's cron instant, which is either already past the publication — and so a screen — or before
  // it, and dropped by the comparison below. Starting a day earlier is defensive and changes no
  // answer; it was written that way, no mutation could redden it, and it is not kept.
  const walk = new Date(afterMs);
  walk.setUTCHours(cron.hour, cron.minute, 0, 0);

  for (let day = 0; day <= MAX_DAYS_WALKED; day++) {
    const at = walk.getTime() + day * DAY_MS;
    if (at > untilMs) return out;
    if (at > afterMs) out.push(at);
  }
  throw new Error(
    `refusing to walk past ${MAX_DAYS_WALKED} days of screening instants — ` +
      `the window ${new Date(afterMs).toISOString()} … ${new Date(untilMs).toISOString()} is not credible`,
  );
}

/**
 * Whether the gate owes attention, from the nomination registry and a clock.
 *
 * Pure: it takes the registry and `now` rather than reading either, so the boundary cases below
 * are testable at instants no fixture written at `now` would ever hold (L-96).
 */
export function gateReading({
  nominations,
  now,
  handle = SCOUT_HANDLE,
  cron = SCREEN_CRON_UTC,
  allowanceHours = DELIVERY_ALLOWANCE_HOURS,
}) {
  const nowMs = toMs(now, "now");

  const mine = nominations.filter((n) => n.handle === handle);
  if (mine.length === 0) {
    // The vacuous pass this reading would otherwise make: an empty set has no stale publication in
    // it, so every emptiness would read CURRENT and the silent feed would be the calm answer.
    throw new Error(
      `no nomination in ${path.relative(REPO_ROOT, NOMINATIONS_DIR)} belongs to @${handle} — ` +
        `refusing to report a gate as current from an empty set`,
    );
  }

  let newest = null;
  let newestMs = -Infinity;
  for (const n of mine) {
    const ms = toMs(n.publishedAt, `${n.file ?? `item ${n.itemId}`}: publishedAt`);
    if (ms > newestMs) {
      newestMs = ms;
      newest = n;
    }
  }

  const deliveredUntil = nowMs - allowanceHours * HOUR_MS;
  const screens = screensBetween(newestMs, deliveredUntil, cron);

  return {
    handle,
    itemId: newest.itemId,
    title: newest.title,
    publishedAt: new Date(newestMs).toISOString(),
    ageHours: Math.round(((nowMs - newestMs) / HOUR_MS) * 10) / 10,
    screensDelivered: screens.length,
    lastScreenDelivered: screens.length ? new Date(screens[screens.length - 1]).toISOString() : null,
    verdict: screens.length >= 1 ? "ATTEND" : "CURRENT",
  };
}

function render(r) {
  const lines = [
    `publisher gate: @${r.handle} — ${r.verdict}`,
    `  newest registered publication: item ${r.itemId} at ${r.publishedAt} (${r.ageHours}h ago)`,
    `  scheduled screens certainly delivered since: ${r.screensDelivered}` +
      (r.lastScreenDelivered ? ` (latest ${r.lastScreenDelivered})` : ""),
  ];
  if (r.verdict === "ATTEND") {
    lines.push(
      "",
      "  A screen has come and gone since this feed last published. Open the latest `agent scout`",
      "  run, READ its scout-record artifact — what it screened, what it selected, why it refused",
      "  the rest — and then dispatch agent-scout.yml with publish: true if the record supports it.",
      "  Do NOT arm the schedule: EXP-013's threshold 2 is unruled and run 153's pre-commitment",
      "  stands. Attending the gate is not the same act as removing it.",
    );
  } else {
    lines.push("", "  Nothing owed. No screen has been delivered since the last publication.");
  }
  return lines.join("\n");
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  let reading;
  try {
    reading = gateReading({ nominations: loadNominations(), now: new Date() });
  } catch (e) {
    console.error(`scout-gate: ${e.message}`);
    process.exit(1);
  }
  console.log(process.argv.includes("--json") ? JSON.stringify(reading, null, 2) : render(reading));
}
