// Whether the feed is a document at all — as opposed to a string that looks like one.
//
// Every check this repository had ever made of `/<handle>/rss.xml` asked what the bytes
// CONTAIN: 482 vitest assertions, eight Playwright specs and twenty-seven production steps,
// and all of them `toContain`, `grep -q`, or a regex. **Not one of them ever parsed it.** So
// the property a subscriber actually depends on — that a conforming XML parser accepts the
// document — was the one property nothing graded. L-92's shape exactly: a crawl is not an
// index, and a string is not a document.
//
// What that left open. XML 1.0 §2.2 forbids most C0 control characters outright, and forbids
// them *however they are written* — `&#11;` is as fatal as a literal U+000B, so `esc` is the
// wrong tool for the class and no amount of escaping was ever going to be the right one. XML
// also has no error recovery. A parser that meets one illegal character stops, which means a
// single stray control character in ONE item's title, URL, category, note or description
// destroys **the entire feed for every subscriber of it** — while `/<handle>` keeps rendering
// perfectly, so the site looks healthy from every surface anyone was watching.
//
// Five routes write `items` and not one of them sanitises: the operator plane `agent scout`
// publishes through, the studio's two paste routes, `share-api`, and Spotify ingestion. The
// scout's why-line is a verbatim quotation lifted out of publisher-supplied full text, which
// is both the thing this product is built on and the kind of string that carries typesetting
// residue. The exposure is RSS alone: `sitemap.xml` is the only other XML document served and
// it carries no free text — its entries are a handle (`/^[a-z0-9][a-z0-9-]{1,30}$/`, enforced
// in `src/handles.ts`), a row id and a timestamp.
//
// THESE TESTS GRADE THE INVARIANT, NOT THE OUTCOME, AND THE SPLIT IS DELIBERATE. workerd has
// no XML parser, so asserting "a parser accepts this" here would mean writing the parser — and
// then grading my own instrument, which is the whole of L-104. So the property is asserted on
// the delivered bytes here, where it is directly checkable, and the outcome is asserted by a
// real parser on the real document in the `RSS is a parseable XML document` step of
// `verify-production.yml`, which runs on every deploy and blocks.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";
import { stripXmlForbidden } from "../src/pages";

const DB = env.DB as D1Database;

/** Every codepoint XML 1.0 forbids in a document and that survives UTF-8 encoding. Written out
 *  rather than reusing the source's regex: a test that imports the pattern it is checking
 *  agrees with the implementation by construction and grades nothing. */
const FORBIDDEN = [
  ...Array.from({ length: 0x09 }, (_, i) => i), // U+0000–U+0008
  0x0b,
  0x0c,
  ...Array.from({ length: 0x12 }, (_, i) => 0x0e + i), // U+000E–U+001F
  0xfffe,
  0xffff,
];

/** The three control characters XML 1.0 admits, plus the first printable one. */
const PERMITTED = [0x09, 0x0a, 0x0d, 0x20];

function hasForbidden(s: string): boolean {
  return FORBIDDEN.some((cp) => s.includes(String.fromCodePoint(cp)));
}

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
  await DB.batch([DB.prepare("DELETE FROM items"), DB.prepare("DELETE FROM creators")]);
});

async function creator(handle: string, name: string, bio = "", kind = "human"): Promise<number> {
  const row = await DB.prepare(
    "INSERT INTO creators (handle, name, bio, token, kind, created_at) VALUES (?, ?, ?, ?, ?, ?) RETURNING id"
  )
    .bind(handle, name, bio, `tok-${handle}`, kind, new Date().toISOString())
    .first<{ id: number }>();
  return row!.id;
}

async function item(
  creatorId: number,
  o: { title?: string; note?: string; description?: string; url?: string; category?: string } = {}
): Promise<number> {
  const row = await DB.prepare(
    `INSERT INTO items (creator_id, url, title, description, note, category, domain, visibility, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'example.com', 'public', ?) RETURNING id`
  )
    .bind(
      creatorId,
      o.url ?? "https://example.com/a",
      o.title ?? "a find",
      o.description ?? "",
      o.note ?? "",
      o.category ?? "Research",
      new Date().toISOString()
    )
    .first<{ id: number }>();
  return row!.id;
}

/** The bytes a subscriber's reader actually receives, decoded the way it decodes them. Read
 *  through the response body rather than by calling `rssFeed` directly, because the question
 *  is what leaves the Worker — UTF-8 encoding happens on the way out and is part of the
 *  answer, as the lone-surrogate case below turns on. */
async function served(path: string): Promise<string> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`https://tuned.test${path}`), env as never, ctx);
  await waitOnExecutionContext(ctx);
  const bytes = await res.arrayBuffer();
  return new TextDecoder().decode(bytes);
}

describe("stripXmlForbidden draws the line where XML 1.0 draws it", () => {
  it("removes every forbidden codepoint", () => {
    for (const cp of FORBIDDEN) {
      const ch = String.fromCodePoint(cp);
      expect(stripXmlForbidden(`a${ch}b`), `U+${cp.toString(16).padStart(4, "0")} survived`).toBe("ab");
    }
  });

  it("keeps the whitespace XML 1.0 permits", () => {
    for (const cp of PERMITTED) {
      const ch = String.fromCodePoint(cp);
      expect(stripXmlForbidden(`a${ch}b`), `U+${cp.toString(16).padStart(4, "0")} was removed`).toBe(`a${ch}b`);
    }
  });

  it("leaves U+007F alone, because XML 1.0 permits it", () => {
    // DEL is a control character and is NOT forbidden by XML 1.0 — only XML 1.1 restricts it,
    // and then only by requiring it be escaped. Removing it would be this function inventing a
    // rule, and a later run would have no way to tell that from the rule it is meant to apply.
    expect(stripXmlForbidden("a\u007fb")).toBe("a\u007fb");
  });

  it("does not touch text that was already legal", () => {
    const s = "Effects of “sprint” training & recovery — 2.8× <b> ✓ 🏃";
    expect(stripXmlForbidden(s)).toBe(s);
  });

  it("joins the text either side of what it removes, rather than substituting", () => {
    // Substitution would alter a why-line this feed publishes as a verbatim quotation. These
    // characters are non-printing, so removal preserves every visible glyph exactly.
    expect(stripXmlForbidden("verbat\u0008im")).toBe("verbatim");
  });
});

describe("the delivered feed is free of characters no parser will accept", () => {
  it("carries no forbidden character when an item title holds one", async () => {
    const c = await creator("sportstech", "Sports Tech", "", "agent");
    await item(c, { title: "Effects of \u000bsprint\u0008 training" });

    const xml = await served("/sportstech/rss.xml");
    expect(hasForbidden(xml)).toBe(false);
    expect(xml).toContain("Effects of sprint training");
  });

  it("strips them from every field, not only the title", async () => {
    // Each of these is a field a write route fills from somewhere outside this service, and
    // each sits in the document as XML text. A per-field guard is what this would need if the
    // strip were not applied to the finished document; the point of the position is that this
    // test cannot be made to pass by a list that forgot one.
    // `creator.bio` is deliberately absent from the assertions: `rssFeed` does not emit it, so
    // asserting on it would pass for the wrong reason. It is still carried in the fixture, to
    // pin that a field which never reaches the document cannot poison it either.
    const c = await creator("wearables", "Wear\u000bables", "A bio\u001f with residue", "agent");
    await item(c, {
      title: "title\u0001",
      url: "https://example.com/a\u0002b",
      category: "Res\u0003earch",
      note: "note\u0004",
      description: "desc\u0005",
    });

    const xml = await served("/wearables/rss.xml");
    expect(hasForbidden(xml)).toBe(false);
    expect(xml).toContain("<title>Wearables (AI agent) — attention feed</title>");
    expect(xml).toContain("<title>title</title>");
    expect(xml).toContain("<link>https://example.com/ab</link>");
    expect(xml).toContain("<category>Research</category>");
    expect(xml).toContain("&lt;p&gt;note&lt;/p&gt;");
  });

  it("removes U+FFFE and U+FFFF, which survive UTF-8 encoding and are still forbidden", async () => {
    const c = await creator("graphics", "Graphics", "", "agent");
    await item(c, { title: "a￾b￿c" });

    const xml = await served("/graphics/rss.xml");
    expect(hasForbidden(xml)).toBe(false);
    expect(xml).toContain("abc");
  });

  it("keeps one poisoned item from taking the other items with it", async () => {
    // The whole severity of this defect in one assertion. XML has no error recovery, so before
    // the strip a parser stopped at the first illegal character and every later item in the
    // document was lost to every subscriber — including items published long before the bad
    // one arrived.
    const c = await creator("sportstech", "Sports Tech", "", "agent");
    await item(c, { title: "clean find one" });
    await item(c, { title: "poisoned \u000c find" });
    await item(c, { title: "clean find two" });

    const xml = await served("/sportstech/rss.xml");
    expect(hasForbidden(xml)).toBe(false);
    expect(xml).toContain("clean find one");
    expect(xml).toContain("clean find two");
    expect(xml).toContain("poisoned  find");
    expect([...xml.matchAll(/<item>/g)]).toHaveLength(3);
  });

  it("preserves the tab, newline and carriage return a description may legitimately carry", async () => {
    const c = await creator("ava", "Ava");
    await item(c, { note: "line one\nline\ttwo" });

    const xml = await served("/ava/rss.xml");
    expect(xml).toContain("line one\nline\ttwo");
  });

  it("never delivers a lone surrogate, which is illegal and which this function does not strip", async () => {
    // Pinned as an OBSERVATION, not as a belief, and the first draft of this test got the
    // mechanism wrong in a way worth keeping. An unpaired surrogate is not a legal XML
    // character either, and `stripXmlForbidden` deliberately does not handle it — on the
    // reasoning that the Worker's UTF-8 encoding substitutes U+FFFD on the way out. It does
    // not get that far: the substitution happens at the D1 boundary, on the way IN, and it
    // yields one replacement character per ill-formed byte rather than one per surrogate. So
    // the count is asserted as a range it cannot be zero in, and never as an exact number —
    // the guarantee this rests on is "no surrogate survives round-tripping", not "U+FFFD once".
    //
    // If a surrogate ever does reach the document, this test says so, and the remedy then
    // belongs in `stripXmlForbidden` next to U+FFFE rather than in a comment.
    const c = await creator("sportstech", "Sports Tech", "", "agent");
    await item(c, { title: "half \ud800 pair" });

    const xml = await served("/sportstech/rss.xml");
    expect(xml).toMatch(/<title>half �+ pair<\/title>/);
    expect(/[\ud800-\udfff]/.test(xml)).toBe(false);
    expect(hasForbidden(xml)).toBe(false);
  });

  it("emits a valid document from a feed with no items at all", async () => {
    await creator("wellbeing", "Wellbeing", "", "agent");

    const xml = await served("/wellbeing/rss.xml");
    expect(hasForbidden(xml)).toBe(false);
    expect(xml).toContain("<rss version=\"2.0\"");
    expect(xml).not.toContain("<lastBuildDate>");
  });
});
