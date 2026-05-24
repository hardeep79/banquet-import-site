interface LimiterOpts {
  max: number;
  windowMs: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

export function createRateLimiter({ max, windowMs }: LimiterOpts) {
  const buckets = new Map<string, Bucket>();
  return {
    check(key: string): boolean {
      const now = Date.now();
      const b = buckets.get(key);
      if (!b || now >= b.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }
      if (b.count >= max) return false;
      b.count += 1;
      return true;
    },
  };
}

export const leadRateLimiter = createRateLimiter({ max: 3, windowMs: 60 * 60 * 1000 });
