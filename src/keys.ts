// Shared secret-key comparison for every key-authenticated surface (ADMIN_KEY,
// METRICS_KEY, AGENT_OPERATOR_KEY). Extracted from index.ts unchanged when the agent
// operator control plane landed, so a second surface could not drift into its own,
// subtly weaker comparison.

async function timingSafeEq(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  return crypto.subtle.timingSafeEqual(ha, hb);
}

// Compare a key arriving in an HTTP header against one stored in a Worker secret.
//
// These two sides are not symmetric, which is the whole reason this helper exists.
// HTTP strips leading and trailing whitespace from a field value in transit
// (RFC 9110 §5.5), so `provided` can never carry surrounding whitespace no matter
// what the client sends. A Worker secret can: `echo v | wrangler secret put` stores
// a trailing newline, and a dashboard paste can carry either. When that happens the
// stored value is unmatchable by *any* HTTP client — a permanent 401 that looks
// exactly like a wrong key from the outside, and that re-pasting only fixes by luck.
//
// So trim both sides before comparing. Surrounding whitespace is not entropy anyone
// provisions on purpose, and refusing to normalise it buys no security — it only
// converts an invisible typo into an undiagnosable outage.
export async function keyMatches(provided: string, configured: string | undefined): Promise<boolean> {
  const want = (configured ?? "").trim();
  if (!want) return false; // unset or whitespace-only: never authenticate
  return await timingSafeEq(provided.trim(), want);
}

// A secret that is present but whitespace-only is configured in name only; report it
// as absent so the unauthenticated status stays honest (503 = no key, 401 = wrong key).
export function keyConfigured(configured: string | undefined): boolean {
  return (configured ?? "").trim().length > 0;
}

/** True when two configured secrets are the same value — used to refuse a control plane
 *  that has been given an existing key rather than its own. Both sides are secrets here,
 *  so both are trimmed the same way `keyMatches` trims the stored side. */
export async function keysCollide(a: string | undefined, b: string | undefined): Promise<boolean> {
  if (!keyConfigured(a) || !keyConfigured(b)) return false;
  return await timingSafeEq((a ?? "").trim(), (b ?? "").trim());
}
