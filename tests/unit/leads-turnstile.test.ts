import { describe, it, expect, vi, beforeEach } from "vitest";

beforeEach(() => {
  vi.unstubAllEnvs();
  process.env.TURNSTILE_SECRET_KEY = "secret-x";
  vi.restoreAllMocks();
});

import { verifyTurnstile } from "@/lib/leads/turnstile";

describe("verifyTurnstile", () => {
  it("returns true when Cloudflare reports success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ success: true }),
    } as Response) as typeof fetch;
    await expect(verifyTurnstile("tok", "1.2.3.4")).resolves.toBe(true);
  });

  it("returns false when Cloudflare reports failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ success: false, "error-codes": ["invalid"] }),
    } as Response) as typeof fetch;
    await expect(verifyTurnstile("tok", "1.2.3.4")).resolves.toBe(false);
  });

  it("returns false when secret key is missing", async () => {
    process.env.TURNSTILE_SECRET_KEY = "";
    await expect(verifyTurnstile("tok", "1.2.3.4")).resolves.toBe(false);
  });

  it("returns false on network failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("net")) as typeof fetch;
    await expect(verifyTurnstile("tok", "1.2.3.4")).resolves.toBe(false);
  });
});
