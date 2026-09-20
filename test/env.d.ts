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

// Run 175. Pointed at the deployment config, so a test can ask what the *deployed Worker* is
// wired to rather than what a constant claims. test/promises.test.ts reads it to establish that
// no mail binding exists, which is the premise every email disclosure on the public pages rests
// on — and a premise read from wrangler.jsonc cannot drift away from the deploy the way a
// hand-set boolean can.
declare module "*.jsonc?raw" {
  const content: string;
  export default content;
}

// Run 175. The narrowest possible declaration of Vite's glob, added instead of pulling in
// `vite/client` wholesale. test/promises.test.ts sweeps *every* file in src/ for an outbound mail
// call; a hand-written list of files to scan would silently stop covering a src/ file added
// later, which is the same drift the ?raw declarations above exist to prevent.
interface ImportMeta {
  glob(
    pattern: string,
    options: { query: "?raw"; import: "default"; eager: true }
  ): Record<string, string>;
}

// Run 173. Pointed at a shell script, for the same reason as the two above and one narrower
// one: scripts/prod-http.sh defines the user-agent every production probe sends, and whether
// that string matches BOT_UA in src/metrics.ts decides which counter bucket every probe lands
// in. Nothing links the two files. Reading the shell as text is what lets a TypeScript test
// assert the relationship.
declare module "*.sh?raw" {
  const content: string;
  export default content;
}

// Run 177. Pointed at a workflow, for the reason the four above exist. The desk offer this run
// adds to the follow dialog is member-only, so `verify production` cannot sign in to check it —
// all it can do is grep the anonymous document and require the member control to be absent. That
// makes the grep patterns load-bearing, and a pattern copied into a test keeps passing after the
// workflow's has drifted. test/desk-offer-render.test.ts reads them out of the workflow itself.
declare module "*.yml?raw" {
  const content: string;
  export default content;
}
