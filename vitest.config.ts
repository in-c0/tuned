import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

// Tests run inside workerd against a local (simulated) D1 — the same runtime and the
// same SQL engine production uses, with no Cloudflare credentials and no network.
export default defineWorkersConfig({
  test: {
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
