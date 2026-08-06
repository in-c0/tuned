/// <reference types="@cloudflare/vitest-pool-workers" />

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
