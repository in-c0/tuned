// Can a visitor who lands on one feed reach any other attention on this service?
//
// Until this suite existed the answer was no, on every surface a stranger actually arrives at.
// `/<handle>` and `/<handle>/<id>` linked to their own feed, their own finds, their own RSS, `/`,
// `/terms` and `/privacy` — and to no other feed. `sitemap.xml` advertises one landing page, five
// feeds and every published find, so what search can send us to is overwhelmingly a find page, and
// a shared link is a find page by construction. Four of the five feeds on this service have
// published nothing since July. So for most arrivals, the whole reachable site was a feed with
// nothing to subscribe to — which is run 195's L-113 one level up: the page is right, the copy is
// honest about the age, and the person is still at the end of the road.
//
// GRADED AS A CLASS OVER A DERIVED SET (L-107). The pages under test are not named here. They are
// taken from `/sitemap.xml` — the service's own statement of what it publishes — so a public page
// class registered later is graded by this file without anybody adding it. The derivation is
// itself graded: a sitemap this test could not read, or one carrying no find page, would make
// every assertion below vacuously true, which is how a class check passes by checking nothing.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";

const DB = env.DB as D1Database;
const HUMAN_UA = "Mozilla/5.0 (X11; Linux x86_64) Chrome/128.0.0.0";

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

async function creator(handle: string, name: string, kind = "human"): Promise<number> {
  const row = await DB.prepare(
    "INSERT INTO creators (handle, name, token, kind, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id"
  )
    .bind(handle, name, `tok-${handle}`, kind, "2026-07-01T00:00:00.000Z")
    .first<{ id: number }>();
  return row!.id;
}

async function item(creatorId: number, createdAt: string, visibility = "public"): Promise<number> {
  const row = await DB.prepare(
    `INSERT INTO items (creator_id, url, title, description, image_url, site_name, domain, category, note, visibility, created_at)
     VALUES (?, ?, ?, '', '', '', 'example.com', 'Research', '', ?, ?) RETURNING id`
  )
    .bind(creatorId, `https://example.com/${creatorId}-${createdAt}`, `Find ${createdAt}`, visibility, createdAt)
    .first<{ id: number }>();
  return row!.id;
}

async function get(path: string): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(
    new Request(`https://tuned.test${path}`, { headers: { "user-agent": HUMAN_UA } }),
    env as never,
    ctx
  );
  await waitOnExecutionContext(ctx);
  return res;
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

/** Production's shape: one feed publishing now, several months dead, one that never published. */
async function seedSite(): Promise<void> {
  const live = await creator("sportstech", "Sports Tech", "agent");
  await item(live, daysAgo(0));
  await item(live, daysAgo(3));
  const stale = await creator("wearables", "Wearables", "agent");
  await item(stale, daysAgo(58));
  const older = await creator("ava", "Ava");
  await item(older, daysAgo(53));
  await creator("newbie", "New Member");
}

/** The public pages this service says it publishes, read off its own sitemap. */
async function advertisedPages(): Promise<{ feeds: string[]; finds: string[] }> {
  const xml = await (await get("/sitemap.xml")).text();
  const paths = [...xml.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1]);
  return {
    feeds: paths.filter((p) => /^\/[a-z0-9-]+$/.test(p) && !["/terms", "/privacy"].includes(p)),
    finds: paths.filter((p) => /^\/[a-z0-9-]+\/[0-9]+$/.test(p)),
  };
}

const hrefs = (html: string): Set<string> => {
  const body = html.slice(html.indexOf("<body"));
  return new Set([...body.matchAll(/href="(\/[a-z0-9-]*)"/g)].map((m) => m[1]));
};

describe("a visitor who lands on one feed can reach the others", () => {
  it("every page the sitemap advertises links to every other feed on the service", async () => {
    await seedSite();
    const { feeds, finds } = await advertisedPages();

    // The derivation is graded before anything is graded through it. Without these, a sitemap
    // that lost its find pages would leave the loop below iterating an empty list and passing.
    expect(feeds.sort()).toEqual(["/ava", "/sportstech", "/wearables"]);
    expect(finds.length).toBeGreaterThan(0);

    // `/newbie` has never published, so it is absent from the sitemap and still has to be
    // offered — it is a feed on this service, and a visitor deciding where to go is told its age
    // rather than having it withheld from them.
    const everyFeed = [...feeds, "/newbie"];

    for (const path of [...feeds, ...finds]) {
      const html = await (await get(path)).text();
      const links = hrefs(html);
      const ownFeed = `/${path.split("/")[1]}`;
      for (const feed of everyFeed) {
        if (feed === ownFeed) continue;
        expect(links.has(feed), `${path} does not link to ${feed}`).toBe(true);
      }
    }
  });

  it("never offers a feed its own page", async () => {
    await seedSite();
    const html = await (await get("/wearables")).text();
    const block = html.slice(html.indexOf("other-feeds"));
    expect(block).toContain('href="/sportstech"');
    expect(block).not.toContain('href="/wearables"');
  });

  it("states each feed's age, derived from the row and never hardcoded", async () => {
    await seedSite();
    for (const path of ["/wearables", "/sportstech"]) {
      const html = await (await get(path)).text();
      const block = html.slice(html.indexOf("other-feeds"), html.indexOf("<footer"));
      if (path !== "/sportstech") expect(block).toContain("last published today");
      expect(block).toContain("last published 53 days ago");
      // A feed that has never published says so rather than being dated or omitted.
      expect(block).toContain("nothing published yet");
    }
  });

  it("offers the freshest feed first, and never ranks by anything but recency", async () => {
    await seedSite();
    const block = (await (await get("/wearables")).text()).match(
      /other-feeds[\s\S]*?<footer/
    )![0];
    const order = [...block.matchAll(/href="\/([a-z0-9-]+)"/g)].map((m) => m[1]);
    expect(order).toEqual(["sportstech", "ava", "newbie"]);
  });

  it("renders no block at all when there is no other feed", async () => {
    const only = await creator("sportstech", "Sports Tech", "agent");
    await item(only, daysAgo(0));
    const id = (await DB.prepare("SELECT id FROM items LIMIT 1").first<{ id: number }>())!.id;
    for (const path of ["/sportstech", `/sportstech/${id}`]) {
      const html = await (await get(path)).text();
      expect(html, `${path} rendered an empty directory`).not.toContain("other-feeds");
      expect(hrefs(html).has("/sportstech")).toBe(path.includes("/" + id));
    }
  });

  it("leaves the machine surfaces exactly as they were", async () => {
    await seedSite();
    // A feed client asking for a feed document is not helped by a list of other feeds, and RSS
    // has no element for one. Same split as L-110: the surface decides, not the status.
    const rss = await (await get("/wearables/rss.xml")).text();
    expect(rss).not.toContain("other-feeds");
    expect(rss).not.toContain("Other feeds on");
    // The landing page's own picker IS this list; it must not grow a second copy of itself.
    const landing = await (await get("/")).text();
    expect(landing).not.toContain("other-feeds");
  });
});
