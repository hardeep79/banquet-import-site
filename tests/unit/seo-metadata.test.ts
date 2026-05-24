import { describe, it, expect } from "vitest";
import { metadataFromSeo } from "@/lib/seo/metadata";

describe("metadataFromSeo", () => {
  it("uses Sanity SEO fields when present", () => {
    const m = metadataFromSeo(
      { metaTitle: "Custom", metaDescription: "Custom desc" },
      { title: "Fallback", description: "Fallback desc" },
    );
    expect(m.title).toBe("Custom");
    expect(m.description).toBe("Custom desc");
  });

  it("falls back when Sanity SEO is missing", () => {
    const m = metadataFromSeo(undefined, { title: "Fallback", description: "Fallback desc" });
    expect(m.title).toBe("Fallback");
    expect(m.description).toBe("Fallback desc");
  });

  it("merges OG fields", () => {
    const m = metadataFromSeo(
      { metaTitle: "T", metaDescription: "D" },
      { title: "fallback", description: "fallback" },
    );
    expect(m.openGraph?.title).toBe("T");
    expect(m.openGraph?.description).toBe("D");
  });
});
