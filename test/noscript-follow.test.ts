// The subscription control, for the clients that are actually walking these pages.
//
// Both public surfaces — `/:handle` and `/:handle/:id` — carry exactly one subscription control,
// and on both it is `<button id="follow-btn">`. A bare button has no default behaviour; the only
// thing that makes it do anything is a `click` listener in the page script, which calls
// `showModal()` on `<dialog id="follow-dlg">`. A dialog is `display: none` until that call. So for
// a client that does not execute the document, the button is inert and the dialog's entire
// contents — the RSS call to action, the desk form, the email list — are unreachable.
//
// That client is not a hypothetical. EXP-014's window has graded `item_render` = 0 on every whole
// UTC day read so far, against 168 unsuffixed `item_view` (105 / 21 / 42 across 2026-09-27 …
// 2026-09-29, ops/metrics/latest.json), and Amendment 2 established by direct browser observation
// that the beacon fires when a browser loads the page. The zeros are a fact about the clients, not
// about the instrument: every observed visitor to a find page in that window was handed a dead
// button.
//
// What these tests pin is the shape of the remedy rather than its prose. The fallback must be
// inside `<noscript>`, because that is the one branch an executing client never parses into nodes
// — which is what makes the scripted page unchanged. It must RETIRE the dead button rather than
// sit beside it. And it must point at the path that actually delivers today, which is RSS: the
// dialog says "RSS works today" and "Digests are not sending yet" in its own words, so a fallback
// leading anywhere else would promise more than the control it replaces.
//
// What they deliberately do not assert is that a browser with scripting disabled honours a
// `<style>` inside `<noscript>` in the body. No string comparison can see that; it was verified in
// Chromium with `javaScriptEnabled: false` against the served documents, and the reading is in the
// run's execution report. This file is the regression guard, not the proof of the mechanism.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";

const DB = env.DB as D1Database;

beforeAll(async () => {
  const statements = schemaSql
    .split("\n")
    .map((line) => line.replace(/--.*$/, ""))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const sql of statements) {
    await DB.prepare(sql).run();
  }
});

beforeEach(async () => {
  await DB.batch([
    DB.prepare("DELETE FROM items"),
    DB.prepare("DELETE FROM creators"),
    DB.prepare("DELETE FROM metric_days"),
  ]);
});

const HUMAN_UA = "Mozilla/5.0 (X11; Linux x86_64) Chrome/128.0.0.0";

async function seed(handle: string): Promise<number> {
  const c = await DB.prepare(
    "INSERT INTO creators (handle, name, token, kind, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id"
  )
    .bind(handle, handle, `tok-${handle}`, "agent", new Date().toISOString())
    .first<{ id: number }>();
  const i = await DB.prepare(
    `INSERT INTO items (creator_id, url, title, description, image_url, site_name, domain, category, note, visibility, via_creator_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`
  )
    .bind(c!.id, "https://example.com/a-find", "A find", "", "", "", "example.com", "Misc", "", "public", null, new Date().toISOString())
    .first<{ id: number }>();
  return i!.id;
}

async function get(path: string): Promise<string> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(
    new Request(`https://tuned.test${path}`, { headers: { "user-agent": HUMAN_UA } }),
    env as never,
    ctx
  );
  await waitOnExecutionContext(ctx);
  return res.text();
}

/** The `<noscript>` element's own source, so an assertion about "inside the fallback" cannot be
 *  satisfied by something that merely appears elsewhere on the page. The RSS URL in particular is
 *  on both pages twice already — the corner link and `<link rel="alternate">` — so a bare
 *  `toContain` on the href would pass on the unfixed page. */
function fallback(html: string): string {
  const m = html.match(/<noscript>[\s\S]*?<\/noscript>/);
  return m ? m[0] : "";
}

describe.each([
  ["the find page", (id: number) => `/sportstech/${id}`],
  ["the feed page", () => "/sportstech"],
])("%s offers a subscription a non-executing client can take", (_name, path) => {
  it("carries a no-script fallback at all", async () => {
    const id = await seed("sportstech");
    const html = await get(path(id));

    expect(fallback(html), "no <noscript> block on a page whose only control needs script").not.toBe("");
  });

  it("points it at RSS, the path that delivers today", async () => {
    const id = await seed("sportstech");
    const block = fallback(await get(path(id)));

    expect(block).toContain('href="/sportstech/rss.xml"');
  });

  it("retires the dead button instead of sitting next to it", async () => {
    const id = await seed("sportstech");
    const block = fallback(await get(path(id)));

    // Two controls where one is a lie is not a fallback. The rule has to target the button's id,
    // because that id is what the script binds to and is therefore the thing that is inert.
    expect(block).toMatch(/<style>[^<]*#follow-btn\s*\{[^}]*display\s*:\s*none/);
  });

  it("keeps the scripted control on the page, so an executing client is unaffected", async () => {
    const id = await seed("sportstech");
    const html = await get(path(id));

    expect(html).toContain('id="follow-btn"');
    expect(html).toContain('id="follow-dlg"');
  });

  it("puts nothing in the fallback that the script binds to", async () => {
    const id = await seed("sportstech");
    const block = fallback(await get(path(id)));

    // With scripting enabled a browser never parses this content into nodes, so an id in here
    // would be unreachable to `getElementById` while looking to a reader like a second binding.
    expect(block).not.toContain("id=");
  });
});
