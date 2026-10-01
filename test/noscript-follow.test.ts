// The subscription control, for every client that walks these pages — not only for one of them.
//
// Both public surfaces — `/:handle` and `/:handle/:id` — carry a `<button id="follow-btn">` whose
// only behaviour is a `click` listener in the page script, calling `showModal()` on
// `<dialog id="follow-dlg">`. A dialog is `display: none` until that call, so for a client that does
// not execute the document the button is inert and the dialog's entire contents — the RSS call to
// action, the desk form, the email list — are unreachable. Run 209 fixed that with a `<noscript>`
// block that retired the dead button and carried an RSS link in its place.
//
// What changed, and why these assertions moved with it. Run 209 confined the link to `<noscript>` on
// the strength of a reading: EXP-014 had graded `item_render` = 0 on every whole UTC day in its
// window, so the observed population ran none of the document and a scripted client needed nothing.
// The next whole day graded `item_render` = 5, with `item_view_onsite` = 0 and
// `item_view_referred` = 5 (ops/metrics/latest.json, EXP-014 Fork B): five loads that ran the page,
// none of them an internal click. For that population the only path that delivers today was two
// interactions deep — open the dialog, then take RSS — behind a 12px corner link.
//
// So the contract pinned here is now two-part, and the second half is what these tests gained:
//   1. `<noscript>` still RETIRES the dead button, because it is still inert without script.
//   2. The RSS control is server-rendered OUTSIDE `<noscript>`, so every client is served it.
// It must point at the path that actually delivers, which is RSS: the dialog says "RSS works today"
// and "Digests are not sending yet" in its own words. And it must be an `<a href>` rather than a
// `<button>` — the whole defect was a control with no default behaviour.
//
// What these tests deliberately do not assert is that a browser with scripting disabled honours a
// `<style>` inside `<noscript>` in the body. No string comparison can see that; it is verified in
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

/** An `<a>` carrying `.btn` and the feed's RSS URL. Deliberately narrow: that URL is already on
 *  both pages twice — the 12px corner link and `<link rel="alternate">` — so a bare `toContain` on
 *  the href passes on a page that offers no such control at all. */
const rssControl = /<a class="btn"[^>]*href="\/sportstech\/rss\.xml"[^>]*>[^<]*<\/a>/;

/** The document as a scripting client effectively sees it: `<noscript>` contents are never parsed
 *  into nodes by such a client, so anything asserted about what IT is served must be found with
 *  that block removed. */
function scripted(html: string): string {
  return html.replace(/<noscript>[\s\S]*?<\/noscript>/g, "");
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

  it("serves the RSS control to every client, not only to one inside <noscript>", async () => {
    const id = await seed("sportstech");
    const html = await get(path(id));

    // Outside the fallback is the whole point: a link confined to <noscript> is never parsed into
    // nodes by a scripting client, and 2026-09-30 measured five find-page loads that ran the
    // document. Matched off the page with the <noscript> block REMOVED, so this cannot be satisfied
    // by run 209's version of the same link.
    expect(scripted(html)).toMatch(rssControl);
  });

  it("points it at RSS, the path that delivers today", async () => {
    const id = await seed("sportstech");

    expect(scripted(await get(path(id)))).toContain('href="/sportstech/rss.xml"');
  });

  it("makes it a link and not another button with no default behaviour", async () => {
    const id = await seed("sportstech");
    const m = scripted(await get(path(id))).match(rssControl);

    // The defect being fixed was a control that does nothing until script binds it. A <button>
    // here would reproduce it exactly, one element over.
    expect(m, "no <a class=\"btn\"> pointing at the feed's RSS URL").not.toBeNull();
    expect(m![0].startsWith("<a ")).toBe(true);
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
