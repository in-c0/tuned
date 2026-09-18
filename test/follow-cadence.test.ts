// What the follow ask tells a stranger about whether subscribing will deliver anything.
//
// Run 150 gave every public feed page a follow button and run 171 gave all eighty-seven find
// pages one. Both carried a conditional sentence — "every find like this one, as it is
// published", "new finds reach your reader as @handle publishes them" — and neither is false.
// What neither said is the fact the decision turns on. A production read of every public feed at
// 2026-09-18T10:08:54Z (qa-browser 46, EXP005_SUMMARY) found the newest item on `ava` 47.3 days
// old and on `wearables`, `wellbeing` and `graphics` 49.5 days old. Sixty-eight of the
// eighty-seven find pages belong to a feed that had published nothing in seven weeks, and RSS is
// the only subscription on this platform that delivers at all — `followers` holds addresses no
// code in `src/` can send to. So the one conversion a visitor can complete without an account,
// an application or an owner act was being spent on a stream with nothing coming.
//
// Staleness is a fact about the world and not a defect; a page that declines to mention it is
// the defect (L-18). These tests run the real Worker against a real D1 in workerd and pin four
// decisions a later run could undo without noticing:
//
//   1. THE AGE REPORTED IS THE FEED'S, NEVER THE RENDERED ITEM'S. A find page is arrived at from
//      a search result or a pasted link, so its item is as likely to be the feed's oldest as its
//      newest. "How old is this find?" is a true number answering the wrong question.
//   2. IT IS ON BOTH SURFACES THAT ASK. The feed page's dialog and the find page's block *and*
//      dialog — a stranger's first Tuned page is far likelier to be a find page than the feed.
//   3. IT IS UNCONDITIONAL. No threshold, no change of tone above one. A cut point chosen by the
//      executor is a number fitted to the five feeds it can see.
//   4. AN EMPTY FEED SAYS SO rather than reporting the age of nothing.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";
import { lastPublished } from "../src/pages";

const DB = env.DB as D1Database;

beforeAll(async () => {
  const statements = schemaSql
    .split("\n")
    .map((line) => line.replace(/--.*$/, ""))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const sql of statements) await DB.prepare(sql).run();
});

beforeEach(async () => {
  await DB.batch([
    DB.prepare("DELETE FROM items"),
    DB.prepare("DELETE FROM creators"),
    DB.prepare("DELETE FROM metric_days"),
  ]);
});

const DAY = 86_400_000;
const daysAgo = (n: number) => new Date(Date.now() - n * DAY).toISOString();

async function creator(handle: string, kind = "agent"): Promise<number> {
  const row = await DB.prepare(
    "INSERT INTO creators (handle, name, token, kind, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id"
  )
    .bind(handle, handle, `tok-${handle}`, kind, new Date().toISOString())
    .first<{ id: number }>();
  return row!.id;
}

/** One public find, at a stated age. `created_at` is the whole point of this file, so unlike the
 *  other suites' helpers it is required rather than defaulted to now. */
async function item(creatorId: number, createdAt: string, title = "A find"): Promise<number> {
  const row = await DB.prepare(
    `INSERT INTO items (creator_id, url, title, domain, category, visibility, created_at)
     VALUES (?, ?, ?, 'example.com', 'Misc', 'public', ?) RETURNING id`
  )
    .bind(creatorId, `https://example.com/${encodeURIComponent(title)}`, title, createdAt)
    .first<{ id: number }>();
  return row!.id;
}

const HUMAN_UA = "Mozilla/5.0 (X11; Linux x86_64) Chrome/128.0.0.0";

async function html(path: string): Promise<string> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(
    new Request(`https://tuned.test${path}`, { headers: { "user-agent": HUMAN_UA } }),
    env as never,
    ctx
  );
  await waitOnExecutionContext(ctx);
  expect(res.status, `GET ${path}`).toBe(200);
  return res.text();
}

describe("lastPublished — the words, and the rounding direction", () => {
  const now = Date.parse("2026-09-18T10:00:00.000Z");

  it("says days, and floors them", () => {
    // Both dates are real: the newest item on `graphics` and on `sportstech` as production served
    // them at 2026-09-18T10:08:54Z. 1187.3h floors to 49 and 143.8h floors to 5 — five, not six,
    // because 143.8h is 5.99 days. Flooring is the direction that cannot overstate the gap, and
    // days do not round into a flattering unit the way "seven weeks" would.
    expect(lastPublished("2026-07-30T22:49:47.000Z", now)).toBe("49 days ago");
    expect(lastPublished("2026-09-12T10:21:50.000Z", now)).toBe("5 days ago");
  });

  it("has words for the two ages that are not a count", () => {
    expect(lastPublished(new Date(now - 3 * 3_600_000).toISOString(), now)).toBe("today");
    expect(lastPublished(new Date(now - 30 * 3_600_000).toISOString(), now)).toBe("yesterday");
  });

  it("returns nothing for an absent or unparseable date rather than an age of nothing", () => {
    expect(lastPublished(null, now)).toBe("");
    expect(lastPublished(undefined, now)).toBe("");
    expect(lastPublished("not a date", now)).toBe("");
  });

  it("never reports a negative age for a clock that disagrees", () => {
    expect(lastPublished(new Date(now + 5 * DAY).toISOString(), now)).toBe("today");
  });
});

describe("the feed page's follow dialog", () => {
  it("states how long ago the feed last published", async () => {
    const id = await creator("museum");
    await item(id, daysAgo(49));
    const page = await html("/museum");
    expect(page).toContain("the last was 49 days ago.");
  });

  it("says so plainly when the feed has published nothing at all", async () => {
    await creator("empty");
    const page = await html("/empty");
    expect(page).toContain("@empty has not published anything yet.");
    expect(page).not.toContain("the last was");
  });

  it("reports the newest item, not the one at the bottom of the page", async () => {
    const id = await creator("mixed");
    await item(id, daysAgo(200), "ancient");
    await item(id, daysAgo(3), "recent");
    const page = await html("/mixed");
    expect(page).toContain("the last was 3 days ago.");
    expect(page).not.toContain("200 days ago");
  });
});

describe("the find page's follow block and dialog", () => {
  // Asserted as one uninterrupted run of text through to the sentence after it, which is the
  // property rather than the prose. `.find-follow .ff-copy b` is `display: block` — it styles the
  // "Follow @handle" heading above — so a `<b>` around the age turns this into three lines with
  // the full stop orphaned on its own row. Nothing overflows when that happens, so the
  // document-overflow check reads clean through it; only a browser eye or this assertion sees it.
  it("carries the age in the block a reader sees without opening anything, as running text", async () => {
    const id = await creator("museum");
    const find = await item(id, daysAgo(49));
    const page = await html(`/museum/${find}`);
    expect(page).toContain(
      "Every find like this one, as it is published — the last was 49 days ago. No account, nothing to apply for."
    );
  });

  it("carries it in the dialog too, where the RSS button is", async () => {
    const id = await creator("museum");
    const find = await item(id, daysAgo(49));
    const page = await html(`/museum/${find}`);
    expect(page).toContain("publishes them — the last was 49 days ago.");
  });

  // The decision this file exists for. A stranger reaches a find page from a search result or a
  // pasted link, so the item in front of them says nothing about whether the feed is alive.
  it("reports the FEED's newest item, not the age of the find being read", async () => {
    const id = await creator("alive");
    const old = await item(id, daysAgo(120), "the one that got indexed");
    await item(id, daysAgo(2), "what they actually published since");
    const page = await html(`/alive/${old}`);
    expect(page).toContain("the last was 2 days ago.");
    expect(page).not.toContain("120 days ago");
  });

  // `more` is capped at four siblings. The newest of them is still the feed's newest, because the
  // route orders by `created_at DESC` — but a later run reordering that query would silently turn
  // this number into "the newest of four arbitrary items", which is why the cap is exercised.
  it("is still the feed's newest when the sibling list is at its cap", async () => {
    const id = await creator("busy");
    const read = await item(id, daysAgo(90), "the indexed one");
    for (const d of [5, 9, 14, 20, 40, 60]) await item(id, daysAgo(d), `sibling-${d}`);
    const page = await html(`/busy/${read}`);
    expect(page).toContain("the last was 5 days ago.");
  });

  it("reports the find's own age when it is the only thing in the feed", async () => {
    const id = await creator("lonely");
    const only = await item(id, daysAgo(49));
    const page = await html(`/lonely/${only}`);
    expect(page).toContain("the last was 49 days ago.");
  });

  // Unconditional: the same sentence on a feed that published this morning. An affordance that
  // only discloses bad news is a tone, and a tone is a threshold with no number written down.
  it("states the age on a fresh feed too, rather than only on a stale one", async () => {
    const id = await creator("fresh");
    const find = await item(id, daysAgo(0));
    const page = await html(`/fresh/${find}`);
    expect(page).toContain("the last was today.");
  });
});
