// The rules that keep a page inside a phone, asserted where a browser is not available.
//
// These are NOT the check. The check is qa/mobile-fit.spec.mjs, which drives a real Chromium at
// 390px and reads geometry, because whether a page fits is a fact about layout and no assertion
// over a string can decide it. That spec is dispatch-only against production; this file is the
// part of it that CI can run on every push, and it asserts exactly one thing: that the rules are
// still being served. A rule deleted during some unrelated refactor is the realistic way this
// regression comes back, and it is the one failure mode a string can see.
//
// So: each `it` names the hazard, not the declaration, and fails with the reason the rule exists.
// Read them as "if this is red, the browser check is about to go red too, and this one is cheaper".

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
  await DB.batch([DB.prepare("DELETE FROM items"), DB.prepare("DELETE FROM creators")]);
});

async function seed(): Promise<void> {
  await DB.prepare(
    "INSERT INTO creators (handle, name, bio, avatar_url, accent, token, created_at) VALUES (?, ?, '', '', '#7c6cff', 'tok', ?)",
  )
    .bind("fits", "Fits Test", new Date(Date.now() - 86_400_000).toISOString())
    .run();
  const row = await DB.prepare("SELECT id FROM creators WHERE handle = ?").bind("fits").first<{ id: number }>();
  // A source that called itself nothing, so the page falls back to the bare domain — the single
  // unbreakable token that is the whole reason these rules exist.
  await DB.prepare(
    `INSERT INTO items (creator_id, url, title, description, image_url, site_name, domain, kind, category, note, visibility, created_at)
     VALUES (?, 'https://blog.engineering.longsubdomain.example.com/x', 'A find', '', '', '', 'blog.engineering.longsubdomain.example.com', 'article', 'Research', '', 'public', ?)`,
  )
    .bind(row!.id, new Date(Date.now() - 3_600_000).toISOString())
    .run();
}

async function get(path: string): Promise<string> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`https://justtuned.com${path}`), env, ctx);
  await waitOnExecutionContext(ctx);
  return res.text();
}

describe("the rules that keep a page inside a phone are served", () => {
  beforeEach(seed);

  // Every public page is checked separately rather than asserting on the CSS constant, because
  // the constant being right and the page being served it are two different facts, and run 165
  // shipped a stylesheet that only one page got. A rule that exists and does not reach the
  // document is the same defect as a rule that does not exist.
  for (const [name, path] of [
    ["the landing page", "/"],
    ["a feed page", "/fits"],
  ] as const) {
    it(`${name} can wrap a meta row instead of widening the document`, async () => {
      const html = await get(path);
      // Without this a row with one chip too many pushes its line box past the card, the initial
      // containing block grows to the widest line, and Chrome on a phone zooms the whole document
      // out. Measured on production 2026-09-16: "/" at 405px and "/ava" at 436px on a 390px phone.
      expect(html).toContain(".card .meta { flex-wrap: wrap;");
    });

    it(`${name} gives an unbreakable source name somewhere to break`, async () => {
      const html = await get(path);
      // Wrapping cannot rescue a single item wider than the card. `overflow-wrap: anywhere` is
      // what lowers the span's min-content width, which is what lets a flex item shrink at all.
      expect(html).toContain(".card .meta > span { min-width: 0; overflow-wrap: anywhere; }");
    });
  }

  it("a find page gives its source row and its open button somewhere to break", async () => {
    const id = await DB.prepare("SELECT id FROM items").first<{ id: number }>();
    const html = await get(`/fits/${id!.id}`);
    expect(html).toContain(".find-source > span { min-width: 0; overflow-wrap: anywhere; }");
    // "Open at <domain> →" is a bare domain inside a button, so the button's min-content width is
    // the domain's. This was still over width after the meta rows were fixed.
    expect(html).toContain(".open-cta { display: inline-block; margin-top: 20px; text-decoration: none; overflow-wrap: anywhere; }");
  });

  // The rules live in the shared `CSS` string deliberately: the landing page renders its demo
  // through the same `card()` and was one of the two pages measured over width. A page-scoped
  // stylesheet, which is how the permalink chip was shipped, would have left it broken.
  // The rollup list is the same hazard one layer in, and it failed differently: the row fits
  // inside a card that sets `overflow: hidden`, so the name could never widen the document — it
  // was cut off mid-word instead, with no ellipsis, and the track title next to it was squeezed
  // to zero width. Measured on production 2026-09-16 and reproduced at 390px: the artist span
  // 371.2px wide ending at 418.2px, the title 0px. A page-fit check cannot see either, which is
  // why the browser spec now grades elements past the device edge and not only page width.
  it("an artist's name in a rollup can shrink and break instead of being cut off", async () => {
    const html = await get("/fits");
    expect(html).toContain(
      ".rollup-list .a { color: var(--faint); font-size: 12px; margin-left: auto; min-width: 0; overflow-wrap: anywhere; text-align: right; }",
    );
    // Named separately because this is the declaration that caused it: `white-space: nowrap`
    // makes the span's min-content width its whole text, and a flex item cannot shrink below
    // its automatic minimum. Re-adding it would restore the defect with every other rule intact.
    expect(html).not.toContain(".rollup-list .a { color: var(--faint); font-size: 12px; margin-left: auto; white-space: nowrap; }");
  });

  // A rule whose selector matches nothing is the same defect as a missing rule, and nothing in
  // this suite rendered a rollup at all before this. So the element the rule is written for is
  // asserted to exist, and to carry the whole name: the fix is that the name WRAPS, and a name
  // shortened on the server would make the stylesheet look right while losing what it protects.
  it("a rollup renders the span that rule selects, carrying the artist's whole name", async () => {
    const row = await DB.prepare("SELECT id FROM creators WHERE handle = ?").bind("fits").first<{ id: number }>();
    const artist = "Jeff Goldblum & The Mildred Snitzer Orchestra, Ariana Grande";
    // ROLLUP_MIN is 3 items of an ambient category on one day; below that they render as cards
    // and there is no `.rollup-list` to check.
    for (let i = 0; i < 3; i++) {
      await DB.prepare(
        `INSERT INTO items (creator_id, url, title, description, image_url, site_name, domain, kind, category, note, visibility, created_at)
         VALUES (?, ?, ?, ?, '', 'Spotify', 'open.spotify.com', 'music', 'Music', '', 'public', ?)`,
      )
        .bind(
          row!.id,
          `https://open.spotify.com/track/${i}`,
          `Track ${i}`,
          `${artist} · An Album`,
          `2026-09-16T0${i}:00:00.000Z`,
        )
        .run();
    }
    const html = await get("/fits");
    expect(html, "three ambient items on one day should collapse into a rollup").toContain('class="rollup-list"');
    expect(html, "the rule targets `.rollup-list .a` — that span has to be what renders").toContain('<span class="a">');
    // `&` is escaped in the served HTML, so the name is compared in the form the page carries it.
    expect(html, "the artist's name must reach the page whole, so that wrapping is what shortens it").toContain(
      artist.replace(/&/g, "&amp;"),
    );
  });

  it("the shared stylesheet carries them, not a per-page block", async () => {
    const landing = await get("/");
    const feed = await get("/fits");
    for (const rule of [
      ".card .meta { flex-wrap: wrap;",
      ".card .meta > span { min-width: 0; overflow-wrap: anywhere; }",
    ]) {
      expect(landing, `landing page is missing: ${rule}`).toContain(rule);
      expect(feed, `feed page is missing: ${rule}`).toContain(rule);
    }
  });
});
