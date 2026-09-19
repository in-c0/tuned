// What this service tells a stranger it will do, checked against what it can actually do.
//
// This Worker has no way to send an email. There is no mail binding in wrangler.jsonc, no mail
// secret, and no call to any mail provider anywhere in src/. A sign-in link is *returned in the
// response body* of the admin-key-gated `POST /api/creators` (src/index.ts, `login_url`) — it is
// handed to the operator, who conveys it by hand. The route inventory already records this
// correctly: `GET /login` is listed there as "interstitial ... asks the owner for a link".
//
// The pages said something else. Until this file existed, `/` told every applicant "you'll hear
// back by email" and `/login` told every approved member "we send you a personal sign-in link".
// Both are commitments to deliver mail from a service with no sender.
//
// The follow dialog on a feed page had already been corrected — "Nothing sends until digests
// start" — which is the part that makes this a *class* and not a typo. The honesty standard was
// adopted and then applied to exactly one of the surfaces that makes the promise. That is
// [L-90](../ops/LESSONS.md) again, whose whole content is that a check which reads one page
// grades one page.
//
// So this file reads every page a stranger can reach, and it derives that set rather than listing
// it. Two ways it could have been written and been wrong:
//
//   1. **Filtering by `isPrivatePath`.** That is the *indexing* policy, and `/login` is on it —
//      `PRIVATE_EXACT` includes it so crawlers skip it. It is still a public, unauthenticated
//      page that any applicant is sent to, and a sweep that reused that predicate as its
//      definition of "public" would have skipped one of the two defective surfaces. The question
//      here is not "may a crawler index this" but "can someone with no credentials read it", so
//      the filter is the response: fetch every registered GET route anonymously and keep whatever
//      answers with HTML.
//   2. **Scanning the source instead of the response.** Both promises live in inline `<script>`
//      string literals that are written into the page after a fetch resolves, not in the static
//      markup. These assertions run the real Worker in workerd and scan the delivered bytes.
//
// It asserts in both directions, because only one of them catches a removal: no surface may make
// a promise the Worker cannot keep, *and* every surface that collects an email address must say
// on that same surface what will not be sent. Deleting the honest sentence is as red as adding a
// dishonest one.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import schemaSql from "../schema.sql?raw";
import wranglerSource from "../wrangler.jsonc?raw";
import indexSource from "../src/index.ts?raw";
import worker from "../src/index";

const DB = env.DB as D1Database;

const srcFiles = import.meta.glob("../src/*.ts", { query: "?raw", import: "default", eager: true }) as Record<
  string,
  string
>;

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

const HANDLE = "promises";
let itemId = 0;

beforeEach(async () => {
  await DB.batch([
    DB.prepare("DELETE FROM items"),
    DB.prepare("DELETE FROM creators"),
    DB.prepare("DELETE FROM metric_days"),
  ]);
  const creator = await DB.prepare(
    "INSERT INTO creators (handle, name, token, kind, created_at) VALUES (?, ?, ?, 'human', ?) RETURNING id"
  )
    .bind(HANDLE, "Promises", `tok-${HANDLE}`, new Date().toISOString())
    .first<{ id: number }>();
  const row = await DB.prepare(
    `INSERT INTO items (creator_id, url, title, description, image_url, site_name, domain, category, note, visibility, via_creator_id, created_at)
     VALUES (?, 'https://example.com/a-find', 'A find', '', '', '', 'example.com', 'Misc', '', 'public', NULL, ?) RETURNING id`
  )
    .bind(creator!.id, new Date().toISOString())
    .first<{ id: number }>();
  itemId = row!.id;
});

/* ---------- can this Worker send mail at all? ---------- */

// Deliberately not a hand-set boolean. A constant saying "we cannot send email" is a mirror of a
// fact rather than the fact, and mirrors drift ([L-56](../ops/LESSONS.md)) — someone ships a
// sender, forgets the constant, and this file goes on requiring the page to disclaim a capability
// the service now has. These two reads are the capability itself: a binding in the deployment
// config, and an outbound call to something that delivers mail.
const MAIL_BINDING = /"send_email"|\bEMAIL_BINDING\b|"email"\s*:\s*\[/i;
const MAIL_PROVIDER =
  /api\.resend\.com|api\.mailgun\.net|api\.sendgrid\.com|api\.postmarkapp\.com|api\.mailchannels\.net|email\.[a-z0-9-]+\.amazonaws\.com|smtp\./i;

const mailProviderHits = Object.entries(srcFiles)
  .filter(([, source]) => MAIL_PROVIDER.test(source))
  .map(([path]) => path);

const CAN_SEND_MAIL = MAIL_BINDING.test(wranglerSource) || mailProviderHits.length > 0;

/* ---------- every page a stranger can read ---------- */

/** Registered GET routes, straight off the route table, concretised so they can be fetched. The
 *  parse is the same shape `test/route-inventory.test.ts` uses on the same file. */
function registeredGetPaths(): string[] {
  const re = /^app\.get\("([^"]+)"/gm;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(indexSource))) out.push(m[1]);
  return out;
}

function concretise(route: string): string {
  return route
    .replace(":handle", HANDLE)
    .replace(":id", String(itemId))
    // An unguessable capability URL, deliberately wrong: what a stranger holds is nothing, and
    // whatever the Worker renders for nothing is a page strangers reach.
    .replace(":token", "not-a-real-token");
}

async function fetchPath(path: string): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request(`https://justtuned.com${path}`), env as never, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

/** Path → delivered body, for every registered GET route that answers an anonymous request with
 *  HTML. Redirects to /login, JSON, RSS and plain text all drop out here by answering with
 *  something that is not a page. */
async function publicPages(): Promise<Map<string, string>> {
  const pages = new Map<string, string>();
  for (const route of registeredGetPaths()) {
    const path = concretise(route);
    if (path.includes(":")) continue; // an unrecognised parameter shape, not silently substituted
    const res = await fetchPath(path);
    if (!(res.headers.get("content-type") ?? "").includes("text/html")) continue;
    pages.set(path, await res.text());
  }
  return pages;
}

/* ---------- the claims ---------- */

/** Phrasings that commit this service to putting something in someone's inbox. Each is written to
 *  match an assertion and not its negation: `legal.ts` says "We do not currently send any
 *  automated marketing email", which is true, is the one place on this site that was already
 *  precise about mail, and must not be caught here. */
const UNBACKED_PROMISE: { pattern: RegExp; what: string }[] = [
  { pattern: /\bwe(?:'ll| will)? send you\b/i, what: "we send you …" },
  { pattern: /\bwe(?:'ll| will)? email you\b/i, what: "we'll email you" },
  { pattern: /\bhear back by email\b/i, what: "you'll hear back by email" },
  { pattern: /\bcheck your inbox\b/i, what: "check your inbox" },
  { pattern: /\b(?:sent|emailed) to your (?:email|inbox)\b/i, what: "sent to your inbox" },
  { pattern: /\bwatch your (?:email|inbox)\b/i, what: "watch your inbox" },
  { pattern: /\bin your inbox shortly\b/i, what: "in your inbox shortly" },
];

/** A surface that asks for an email address has to say what will not be sent. Either wording is
 *  accepted: the follow dialog's "Nothing sends until digests start" was already there and is
 *  left byte-untouched, and the surfaces corrected alongside this file say "sends no automated
 *  email". */
const DISCLOSURE = [/\bnothing sends\b/i, /\bsends? no automated email\b/i];

const COLLECTS_EMAIL = /<input[^>]+type=["']?email/i;

describe("the Worker cannot send email, and no page may say otherwise", () => {
  it("has no mail binding and no mail provider in src/", () => {
    // Not an aspiration — the premise every assertion below rests on. The day a real sender
    // ships, this goes red, and the copy those pages carry has to be re-decided rather than
    // silently left disclaiming a capability the service has.
    expect(
      { binding: MAIL_BINDING.test(wranglerSource), providers: mailProviderHits },
      "a mail capability appeared — revisit every disclosure this file enforces before flipping it"
    ).toEqual({ binding: false, providers: [] });
  });

  it("serves the pages a stranger can reach, and they include the ones that ask for an email", async () => {
    // The vacuity guard. A sweep whose set came back empty passes every assertion over it.
    const pages = await publicPages();
    const paths = [...pages.keys()];
    expect(paths).toContain("/");
    expect(paths).toContain("/login");
    expect(paths).toContain(`/${HANDLE}`);
    expect(paths).toContain(`/${HANDLE}/${itemId}`);
    expect(paths.filter((p) => COLLECTS_EMAIL.test(pages.get(p)!)).length).toBeGreaterThan(0);
  });

  it("promises no email on any page a stranger can reach", async () => {
    if (CAN_SEND_MAIL) return;
    const pages = await publicPages();
    const broken: string[] = [];
    for (const [path, html] of pages) {
      for (const { pattern, what } of UNBACKED_PROMISE) {
        if (pattern.test(html)) broken.push(`${path} — "${what}"`);
      }
    }
    expect(
      broken,
      "a public page commits this service to sending mail it has no sender for"
    ).toEqual([]);
  });

  it("says what will not be sent, on every page that asks for an email address", async () => {
    if (CAN_SEND_MAIL) return;
    const pages = await publicPages();
    const silent = [...pages]
      .filter(([, html]) => COLLECTS_EMAIL.test(html))
      .filter(([, html]) => !DISCLOSURE.some((d) => d.test(html)))
      .map(([path]) => path);
    expect(
      silent,
      "a page collects an email address without saying on that same page that nothing is sent to it"
    ).toEqual([]);
  });
});
