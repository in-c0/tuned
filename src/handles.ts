// Handle rules, shared by every surface that can mint a feed. A handle is a public URL
// slug at the site root, so anything that could shadow a real route is refused.

export const RESERVED_HANDLES = new Set([
  "api",
  "studio",
  "favicon.ico",
  "robots.txt",
  "rss.xml",
  "sitemap.xml",
  "terms",
  "privacy",
  "waitlist",
  "home",
  "login",
  "logout",
  "enter",
  "today",
  "read",
  "queue",
  "connect",
]);

/** Normalised handle, or null when it is unusable. Same rule the admin creator API has
 *  always applied: 2–31 chars, lowercase alphanumeric plus dashes, not a reserved route. */
export function normalizeHandle(raw: string | undefined): string | null {
  const handle = (raw ?? "").toLowerCase().trim();
  if (!/^[a-z0-9][a-z0-9-]{1,30}$/.test(handle)) return null;
  if (RESERVED_HANDLES.has(handle)) return null;
  return handle;
}
