// The desk, seeded with the finds this site actually has.
//
// `test/activation.test.ts` walks the whole funnel with no state seeded between stages, and it is
// the right file. But it seeds its one world fact — the public find a member can put on their desk
// — with `created_at` of **now**, and there is no such find on this site. On 2026-09-20 the five
// public feeds hold 87 public items: `wearables`, `wellbeing` and `graphics` last published on
// 30 July, `ava` on 4 August, and `sportstech` — the freshest of them — eight days ago. `GET /today`
// windows every followed feed to `i.created_at > now - 7 days`.
//
// So **every public find on this site is outside the desk's window, and has been for eight days.**
// A member who takes the offer run 177 put on all eighty-seven find pages is redirected to `/today`
// and shown a feed header reading `0 this week · unrated` over the sentence *"Nothing new from
// @wearables."* — after clicking a row that advertised **19 finds**. The empty-state copy run 176
// wrote for this exact moment ("add a feed and everything it finds lands here") does not even
// render, because `groups.length` is 1: the member has a feed, and it is empty.
//
// The journey test cannot see this, one run after it was written, for the same reason every check
// this loop has found blind was blind: it supplies the world it grades. Seeding the find at `now`
// makes the only clock on the page read a value production never holds.
//
// So this file seeds the world with the ages production has, and asserts an outcome and not a
// presence: take the desk's own offer, and the desk must carry what the offer was counting.
//
// The negative control is what keeps this from being "show the archive forever": a find the member
// has already triaged and which is outside the window must NOT come back. The window still governs
// everything the member has seen. What it stops governing is the find they never saw.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import worker from "../src/index";

const DB = env.DB as D1Database;
const ADMIN_KEY = "test-admin-key";
const ORIGIN = "https://justtuned.com";
const DAY = 86_400_000;

const CLICKED = { "user-agent": "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120", "sec-fetch-user": "?1" };

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

/** The site as it is, not as a fixture would like it. One public feed, three public finds, and the
 *  newest of them older than the desk's seven-day window — which is the state of all five feeds in
 *  production and has been since 12 September. Ages are spread so that "the newest" and "the
 *  oldest" are distinguishable in an assertion. */
const FEED = "atlas";
const AGES = [52, 57, 61]; // days old, newest first
let itemIds: number[] = [];

beforeEach(async () => {
  await DB.batch([
    DB.prepare("DELETE FROM reads"),
    DB.prepare("DELETE FROM follows"),
    DB.prepare("DELETE FROM items"),
    DB.prepare("DELETE FROM creators"),
    DB.prepare("DELETE FROM members"),
    DB.prepare("DELETE FROM waitlist"),
    DB.prepare("DELETE FROM member_days"),
    DB.prepare("DELETE FROM metric_days"),
  ]);
  const creator = await DB.prepare(
    "INSERT INTO creators (handle, name, token, kind, created_at) VALUES (?, ?, ?, 'agent', ?) RETURNING id"
  )
    .bind(FEED, "Atlas", `tok-${FEED}`, new Date(Date.now() - 70 * DAY).toISOString())
    .first<{ id: number }>();

  itemIds = [];
  for (const days of AGES) {
    const row = await DB.prepare(
      `INSERT INTO items (creator_id, url, title, description, image_url, site_name, domain, category, note, visibility, via_creator_id, created_at)
       VALUES (?, ?, ?, '', '', '', 'example.com', 'Misc', '', 'public', NULL, ?) RETURNING id`
    )
      .bind(
        creator!.id,
        `https://example.com/find-${days}`,
        `A find from ${days} days ago`,
        new Date(Date.now() - days * DAY).toISOString()
      )
      .first<{ id: number }>();
    itemIds.push(row!.id);
  }
});

async function call(path: string, init: RequestInit = {}): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`${ORIGIN}${path}`, init), { ...env, ADMIN_KEY } as never, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

/* ---------- the journey, with nothing passed by hand ---------- */

async function signedInMember(email: string): Promise<string> {
  const applied = await call("/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json", origin: ORIGIN, ...CLICKED },
    body: JSON.stringify({ email, role: "fan", note: "found you somewhere" }),
  });
  expect(applied.status, "POST /waitlist did not accept a valid application").toBe(200);

  const queue = await call("/api/applications", { headers: { "x-admin-key": ADMIN_KEY } });
  expect(queue.status).toBe(200);
  const listed = (await queue.json<{ applications: { email: string }[] }>()).applications.find(
    (a) => a.email.toLowerCase() === email.toLowerCase()
  );
  expect(listed, `the application for ${email} is not readable at /api/applications`).toBeTruthy();

  const admitted = await call("/api/members", {
    method: "POST",
    headers: { "content-type": "application/json", "x-admin-key": ADMIN_KEY },
    body: JSON.stringify({ email: listed!.email, name: "A Stranger" }),
  });
  expect(admitted.status, "POST /api/members did not admit the address the queue returned").toBe(201);
  const loginUrl = (await admitted.json<{ login_url?: string }>()).login_url;
  expect(loginUrl, "admission returned no sign-in link").toBeTruthy();

  const entered = await call(new URL(loginUrl!).pathname, { headers: CLICKED, redirect: "manual" });
  expect(entered.status, "the sign-in link granted no session").toBe(302);
  const cookie = (entered.headers.get("set-cookie") ?? "").split(";")[0];
  expect(cookie).toMatch(/^tuned_session=.+/);
  return cookie;
}

async function desk(cookie: string): Promise<string> {
  const res = await call("/today", { headers: { cookie, ...CLICKED } });
  expect(res.status, "a signed-in member was not served their desk").toBe(200);
  return await res.text();
}

/** The offer, read off the page the member is shown — never written here. A desk that offers
 *  nothing has to fail at this line rather than quietly pass a weaker assertion. */
function deskOfferFor(html: string, handle: string): string {
  const re = /<form\b([^>]*)>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const action = /\baction=["']([^"']+)["']/i.exec(m[1])?.[1];
    const method = /\bmethod=["']([^"']+)["']/i.exec(m[1])?.[1] ?? "";
    if (action && method.toLowerCase() === "post" && action === `/${handle}/desk`) return action;
  }
  throw new Error(`the desk offers no route to @${handle}`);
}

async function takeTheOffer(cookie: string, action: string): Promise<void> {
  const res = await call(action, {
    method: "POST",
    headers: { cookie, origin: ORIGIN, "content-type": "application/x-www-form-urlencoded", ...CLICKED },
    body: "",
    redirect: "manual",
  });
  expect([200, 302, 303]).toContain(res.status);
}

const titleOf = (days: number) => `A find from ${days} days ago`;

describe("a member adds a feed whose finds are older than the desk's window", () => {
  it("is shown what the offer was counting", async () => {
    const cookie = await signedInMember("windowed@example.com");
    const before = await desk(cookie);

    // The offer, as made. This is the row run 176 added and run 177 put on eighty-seven find pages.
    await takeTheOffer(cookie, deskOfferFor(before, FEED));

    const after = await desk(cookie);
    for (const days of AGES) {
      expect(
        after,
        `the member took the desk's own offer and the desk does not carry @${FEED}'s find from ${days} days ago — every public find on this site is older than the window, so the desk they are redirected to is empty by construction`
      ).toContain(titleOf(days));
    }
  });

  it("does not report the feed as having found nothing while it holds finds the member has never seen", async () => {
    const cookie = await signedInMember("nothingnew@example.com");
    await takeTheOffer(cookie, deskOfferFor(await desk(cookie), FEED));

    expect(
      await desk(cookie),
      `the desk says "Nothing new from @${FEED}" to a member who has never been shown any of its three finds`
    ).not.toContain(`Nothing new from @${FEED}`);
  });

  // The negative control, and the reason this is a window fix and not an archive. What the member
  // has already triaged stays governed by the seven-day window: it does not come back tomorrow.
  it("does not re-surface a find the member has already triaged", async () => {
    const cookie = await signedInMember("triaged@example.com");
    await takeTheOffer(cookie, deskOfferFor(await desk(cookie), FEED));

    const starred = await call(`/read/${itemIds[0]}`, {
      method: "POST",
      headers: { cookie, "content-type": "application/json", origin: ORIGIN, ...CLICKED },
      body: JSON.stringify({ action: "star" }),
    });
    expect(starred.status, "a member could not star a find on their own desk").toBe(200);

    const next = await desk(cookie);
    expect(
      next,
      `a find from ${AGES[0]} days ago that the member already starred is still on the desk — the window has stopped governing what the member has seen`
    ).not.toContain(titleOf(AGES[0]));
    expect(next, "triaging one find hid the two the member has not seen").toContain(titleOf(AGES[1]));
    expect(next).toContain(titleOf(AGES[2]));
  });

  // L-18, and run 172's sentence on the one offer surface that never got it. The follow dialog on
  // a feed page and on all eighty-seven find pages says how old the feed is. The desk's own
  // suggestion row — built one run later — advertises a count of finds and says nothing about when
  // any of them arrived.
  it("says how stale a feed is before the member adds it, as every other offer surface does", async () => {
    const cookie = await signedInMember("stale@example.com");
    const before = await desk(cookie);

    const row = /<div class="suggest-row">[\s\S]*?<\/div>\s*<\/div>/i.exec(before)?.[0] ?? "";
    expect(row, "the desk offers no suggestion row to grade").toContain(FEED);
    expect(
      row,
      `the desk's suggestion row offers @${FEED} on a count of finds and never says the newest is ${AGES[0]} days old`
    ).toMatch(new RegExp(`${AGES[0]} days ago`));
  });

  // Having changed what the window governs, the number the page prints over it has to mean what it
  // says. It never did: `newCount` counts untriaged items in the rendered set, `last_desk_at` is
  // written on every visit and read by nothing, and the sub-line called the result "new since your
  // last visit".
  it("does not call the count on the page a reading it has never been", async () => {
    const cookie = await signedInMember("count@example.com");
    await takeTheOffer(cookie, deskOfferFor(await desk(cookie), FEED));
    const after = await desk(cookie);

    expect(
      after,
      "the desk prints a number it describes as measured since the member's last visit, and nothing on this route measures that"
    ).not.toContain("since your last visit");
    expect(after, "the desk does not say how many finds are waiting").toMatch(/3 finds? waiting/i);
  });

  // The other end of the same sentence. Once the member has triaged everything the feed has ever
  // published, the desk says "Nothing new from @atlas" — and with four of five feeds on this site
  // silent since July, "nothing new" is the same words for *the agent published yesterday and you
  // read it* and *this feed has been dead for two months*. Those are opposite facts about whether
  // it is worth keeping on a desk, and the member is steering on them.
  it("says how long a feed has been silent when it reports nothing new", async () => {
    const cookie = await signedInMember("silent@example.com");
    await takeTheOffer(cookie, deskOfferFor(await desk(cookie), FEED));

    for (const id of itemIds) {
      const res = await call(`/read/${id}`, {
        method: "POST",
        headers: { cookie, "content-type": "application/json", origin: ORIGIN, ...CLICKED },
        body: JSON.stringify({ action: "skip" }),
      });
      expect(res.status).toBe(200);
    }

    const after = await desk(cookie);
    expect(after, "a feed whose every find the member has triaged still renders cards").toContain(
      `Nothing new from @${FEED}`
    );
    const sentence = new RegExp(`Nothing new from @${FEED}[^<]*${AGES[0]} days ago`);
    expect(
      after.match(new RegExp(`Nothing new from @${FEED}[^<]*`))?.[0] ?? "",
      `the desk reports @${FEED} as having nothing new and never says it last published ${AGES[0]} days ago — the same four words for a feed that published yesterday and one silent since July`
    ).toMatch(sentence);
  });
});
