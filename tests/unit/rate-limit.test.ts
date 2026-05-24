import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

describe("createRateLimiter", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("allows up to N hits per window", () => {
    const rl = createRateLimiter({ max: 3, windowMs: 60_000 });
    expect(rl.check("a")).toBe(true);
    expect(rl.check("a")).toBe(true);
    expect(rl.check("a")).toBe(true);
    expect(rl.check("a")).toBe(false);
  });

  it("isolates buckets by key", () => {
    const rl = createRateLimiter({ max: 1, windowMs: 60_000 });
    expect(rl.check("a")).toBe(true);
    expect(rl.check("a")).toBe(false);
    expect(rl.check("b")).toBe(true);
  });

  it("resets after the window expires", () => {
    const rl = createRateLimiter({ max: 1, windowMs: 1000 });
    expect(rl.check("a")).toBe(true);
    expect(rl.check("a")).toBe(false);
    vi.advanceTimersByTime(1001);
    expect(rl.check("a")).toBe(true);
  });
});
