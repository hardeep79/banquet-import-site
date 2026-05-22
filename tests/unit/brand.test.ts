import { describe, it, expect } from "vitest";
import { brand } from "@/lib/brand";

describe("brand module", () => {
  it("exposes a placeholder name and tagline", () => {
    expect(brand.name).toBe("Maison Banquet Co.");
    expect(brand.tagline.length).toBeGreaterThan(0);
  });
  it("exposes a service area copy line referencing Canada", () => {
    expect(brand.serviceArea).toMatch(/Canada/i);
  });
  it("flags itself as placeholder", () => {
    expect(brand.isPlaceholder).toBe(true);
  });
  it("exposes a default CTA label mentioning Quote", () => {
    expect(brand.ctaPrimary).toMatch(/Quote/i);
  });
});
