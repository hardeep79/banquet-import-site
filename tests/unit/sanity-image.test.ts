import { describe, it, expect, vi } from "vitest";

// vi.hoisted runs before all imports — required because `vi.stubEnv` is not
// hoisted and `client.ts` reads env vars at module top-level on import.
vi.hoisted(() => {
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "abc123";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
});

import { urlFor } from "@/lib/sanity/image";

describe("urlFor", () => {
  it("returns a Sanity CDN URL for a reference", () => {
    const url = urlFor({ _type: "image", asset: { _ref: "image-abc-100x100-jpg" } })?.width(800).url();
    expect(url).toContain("https://cdn.sanity.io");
    expect(url).toContain("w=800");
  });

  it("returns null for a falsy input", () => {
    expect(urlFor(null)).toBeNull();
  });
});
