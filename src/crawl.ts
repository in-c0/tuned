// What this site tells the readers that are not people.
//
// Every distribution route this loop has graded ends the same way: a URL is posted somewhere
// and something opens it. Run 86 gave the public feed page a `<link rel="alternate">` so feed
// readers stop being told the site has no feed; run 108 gave it Open Graph and a canonical so
// unfurlers and crawlers stop being told nothing. Both were the same defect — a page that
// looks complete to a human because a human is not the reader that is failing — and both left
// the *site-level* half of it untouched:
//
//   1. There is no `robots.txt`. A missing one is read as "crawl everything", and this Worker
//      serves capability URLs at `/studio/<token>` and one-shot login links at `/enter/<token>`.
//      Nothing today tells a crawler not to walk into either.
//   2. There is no `sitemap.xml`. The feed pages are the destination of every link this product
//      will ever post, and the only path to them is the landing page's own markup.
//   3. `wrangler.jsonc` leaves `workers_dev` on and Workers Builds raises a preview per branch,
//      so several hosts serve this identical document. The canonical tag consolidates them for
//      a crawler that reads the page; nothing yet speaks to one that reads only the host.
//
// Two rules that are easy to conflate and are doing different jobs here:
//
//   `Disallow` in robots.txt asks a compliant crawler not to *fetch* a URL. It does not stop
//   that URL from being indexed when it is discovered another way — a paste into a chat client,
//   a referrer, a toolbar — because the crawler never has to fetch it to list it. For a
//   capability URL that is the whole risk, so the `X-Robots-Tag: noindex` header is what
//   actually refuses indexing, and `isPrivatePath` below is the single list both are built
//   from. They cannot drift, because there is only one of them.
//
// What is deliberately *not* decided here: whether AI training crawlers are welcome. The
// policy is written for `User-agent: *`, which is what the absence of a robots.txt already
// meant, so this ships no change to that. Naming GPTBot, CCBot or ClaudeBot either way is a
// positioning decision for the owner, not a side effect of adding a file.

import { SITE_ORIGIN } from "./pages";

/** The one host that is the site. Everything else serving this Worker is a duplicate. */
export const CANONICAL_HOST = new URL(SITE_ORIGIN).host;

/** `www` is a duplicate, but it is a duplicate the owner configured as a custom domain and one
 *  that real links will use. It is deliberately *not* blocked: a crawler that cannot fetch the
 *  page cannot read the `rel="canonical"` on it, so blocking a duplicate host is how you strand
 *  the signal that would have consolidated it. Blocking is for hosts with no public purpose —
 *  `*.workers.dev` and per-branch previews, which are neither linked nor meant to be found. */
const PUBLIC_HOSTS = new Set([CANONICAL_HOST, `www.${CANONICAL_HOST}`]);

/** Path prefixes that are gated, capability-scoped, or an API. Trailing slash is required so
 *  `/read/` cannot also match a feed handle that merely starts with those letters. */
export const PRIVATE_PREFIXES = ["/api/", "/connect/", "/enter/", "/queue/", "/read/", "/studio/"] as const;

/** Single-segment private routes. Matched exactly, for the same reason: `/home` must not also
 *  claim a creator whose handle is `homebrew`.
 *
 *  `/waitlist` here is the POST endpoint, not the signup surface — the application form itself
 *  lives on the landing page, which stays fully crawlable. Nothing in this list is on the
 *  acquisition path. */
export const PRIVATE_EXACT = ["/home", "/login", "/logout", "/today", "/waitlist"] as const;

/** True when a path is member-, token- or key-gated and must never be indexed. */
export function isPrivatePath(pathname: string): boolean {
  return (
    (PRIVATE_EXACT as readonly string[]).includes(pathname) ||
    (PRIVATE_PREFIXES as readonly string[]).some((prefix) => pathname.startsWith(prefix))
  );
}

/** The crawl policy for the host that asked. `host` is the request's `URL.host`, so it may
 *  carry a port; a hostless or unrecognised value falls through to the blocking policy, which
 *  is the fail-closed direction. */
export function robotsTxt(host: string): string {
  if (!PUBLIC_HOSTS.has(host)) {
    return [
      "# Not the canonical host for this site. https://justtuned.com is.",
      "User-agent: *",
      "Disallow: /",
      "",
    ].join("\n");
  }
  return [
    "# Tuned — follow what someone is paying attention to right now.",
    "# Humans contribute attention, not content.",
    "#",
    "# The paths below are member sessions, capability URLs and APIs. They are not content and",
    "# they are not public; responses on them also carry X-Robots-Tag: noindex.",
    "User-agent: *",
    ...[...PRIVATE_PREFIXES, ...PRIVATE_EXACT].sort().map((p) => `Disallow: ${p}`),
    "",
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    "",
  ].join("\n");
}

export interface SitemapEntry {
  /** Path only, leading slash. The URL is always built on SITE_ORIGIN — never on the host that
   *  made the request, which is the mistake run 108 fixed one layer up. */
  path: string;
  /** Any parseable timestamp, or null/undefined to omit `<lastmod>` rather than invent one. */
  lastmod?: string | null;
}

function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** W3C datetime at second precision, or null when the input is not a date. D1 writes
 *  `strftime('%Y-%m-%dT%H:%M:%fZ')`, whose milliseconds are valid but needlessly precise for a
 *  hint about when a page last changed. A row that predates a column, or holds anything else,
 *  drops its `<lastmod>` instead of emitting a fabricated one. */
export function w3cDate(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const ms = Date.parse(raw);
  if (Number.isNaN(ms)) return null;
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, "Z");
}

export function sitemapXml(entries: SitemapEntry[]): string {
  const urls = entries.map((e) => {
    const lastmod = w3cDate(e.lastmod);
    return `  <url><loc>${xmlEscape(SITE_ORIGIN + e.path)}</loc>${
      lastmod ? `<lastmod>${lastmod}</lastmod>` : ""
    }</url>`;
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}
