// Stamps the commit being built into src/build-info.ts, so the deployed Worker can
// state which commit it was built from and post-deploy verification can prove the
// expected version is actually serving instead of inferring it from a sleep.
//
// Run by wrangler as the `build.command` hook (wrangler.jsonc), so it fires inside
// Cloudflare Workers Builds immediately before the bundle is produced.
//
// It deliberately does NOTHING without a CI commit signal: a local `wrangler dev`
// must not leave a dirty working tree. The committed placeholder value is "dev".

import { writeFileSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(dirname(fileURLToPath(import.meta.url))), "src", "build-info.ts");

/** Last resort inside a build container: the checkout itself knows what it is. */
function shaFromGit() {
  if (!process.env.CI) return "";
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

// WORKERS_CI_COMMIT_SHA is set by Cloudflare Workers Builds; GITHUB_SHA by Actions.
const sha = process.env.WORKERS_CI_COMMIT_SHA || process.env.GITHUB_SHA || shaFromGit();

if (!/^[0-9a-f]{40}$/.test(sha)) {
  console.log(`build-info: no CI commit sha in the environment — leaving ${OUT} untouched`);
  process.exit(0);
}

const body = `// GENERATED at build time by scripts/build-info.mjs — do not edit by hand.
// The committed value is "dev"; Cloudflare Workers Builds overwrites it with the
// commit it is building, which /api/version then reports.
export const BUILD_COMMIT = "${sha}";
`;

const before = (() => {
  try {
    return readFileSync(OUT, "utf8");
  } catch {
    return "";
  }
})();

if (before !== body) writeFileSync(OUT, body);
console.log(`build-info: stamped ${sha}`);
