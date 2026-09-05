/// <reference types="@cloudflare/vitest-pool-workers/types" />

// `env` from cloudflare:test carries the bindings declared in wrangler.jsonc (DB),
// plus the METRICS_KEY the test config supplies.
declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {
    DB: D1Database;
    METRICS_KEY: string;
  }
}

// Vite serves ?raw imports as strings; the tests read the committed schema this way
// so applying it is part of what gets verified.
declare module "*.sql?raw" {
  const content: string;
  export default content;
}

// Run 140. The same trick, pointed at source files this time, so a test can assert a
// relationship *between two files* that no import can express: qa/ is a separate Playwright
// package that nothing in CI executes, and its mirror of the pulse allowlist went stale for a
// day without a single check failing. Reading both as text is what makes that divergence a
// build failure instead of a discovery.
declare module "*.ts?raw" {
  const content: string;
  export default content;
}

declare module "*.mjs?raw" {
  const content: string;
  export default content;
}
