import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

// Tests run inside workerd against a local (simulated) D1 — the same runtime and the
// same SQL engine production uses, with no Cloudflare credentials and no network.
export default defineWorkersConfig({
  test: {
    // Scoped deliberately. Vitest's default glob also matches `qa/*.spec.mjs` — the Playwright
    // browser suite — which this pool then tries to load inside workerd, where `node:os` does not
    // exist. Two different runtimes, two different suites; only this one belongs to the Worker.
    include: ["test/**/*.test.ts"],
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.jsonc" },
        miniflare: {
          // Production reads METRICS_KEY as a secret; tests supply their own so the
          // auth behaviour of /api/metrics can be exercised in all three states.
          bindings: { METRICS_KEY: "test-metrics-key" },
        },
      },
    },
  },
});
