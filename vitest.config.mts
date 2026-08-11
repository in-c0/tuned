import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

// Tests run inside workerd against a local (simulated) D1 — the same runtime and the
// same SQL engine production uses, with no Cloudflare credentials and no network.
//
// As of @cloudflare/vitest-pool-workers 0.21 the workers pool is a Vite plugin rather than a
// `test.poolOptions.workers` block, and the `/config` subpath export is gone. What was
// `defineWorkersConfig({ test: { poolOptions: { workers: X } } })` is now
// `defineConfig({ plugins: [cloudflareTest(X)] })` — same options object, new seat.
export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.jsonc" },
      miniflare: {
        // Production reads METRICS_KEY as a secret; tests supply their own so the
        // auth behaviour of /api/metrics can be exercised in all three states.
        bindings: { METRICS_KEY: "test-metrics-key" },
      },
    }),
  ],
  test: {
    // Scoped deliberately. Vitest's default glob also matches `qa/*.spec.mjs` — the Playwright
    // browser suite — which this pool then tries to load inside workerd, where `node:os` does not
    // exist. Two different runtimes, two different suites; only this one belongs to the Worker.
    include: ["test/**/*.test.ts"],
  },
});
