// /api/version is what post-deploy verification uses to prove the expected commit is
// the one actually serving. Two properties have to hold for that to be worth anything:
// it must answer without a key (the verifier holds no secrets), and it must expose the
// commit and nothing else — it is the one deliberately public endpoint on the Worker.

import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import worker from "../src/index";
import { BUILD_COMMIT } from "../src/build-info";

async function version(): Promise<Response> {
  const ctx = createExecutionContext();
  const res = await worker.fetch(new Request("https://justtuned.com/api/version"), env as never, ctx);
  await waitOnExecutionContext(ctx);
  return res;
}

describe("/api/version", () => {
  it("reports the build commit without a key", async () => {
    const res = await version();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ commit: BUILD_COMMIT });
  });

  it("carries exactly one field, so a deploy check can never read anything else", async () => {
    // The verifier asserts this same shape against production. If a binding, an env
    // value or a build path ever leaked in here, this fails before it ships.
    const body = (await (await version()).json()) as Record<string, unknown>;
    expect(Object.keys(body)).toEqual(["commit"]);
    expect(typeof body.commit).toBe("string");
    expect((body.commit as string).length).toBeGreaterThan(0);
  });

  it("is never cached, so the verifier reads the live version", async () => {
    // A cached response would make the freshness check assert the previous deploy.
    expect((await version()).headers.get("cache-control")).toBe("no-store");
  });

  it("does not shadow a creator handle", async () => {
    // /api/* must not fall through to the /:handle catch-all.
    expect((await version()).headers.get("content-type")).toContain("application/json");
  });
});
