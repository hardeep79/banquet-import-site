import { test, expect } from "@playwright/test";

test.describe("Home", () => {
  test("renders hero with primary CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /request a quote/i }).first()).toBeVisible();
  });

  test("category grid links to /catalog/[slug]", async ({ page }) => {
    await page.goto("/");
    const firstCategoryLink = page.locator('a[href^="/catalog/"]').first();
    await expect(firstCategoryLink).toBeVisible();
    const href = await firstCategoryLink.getAttribute("href");
    expect(href).toMatch(/^\/catalog\/[a-z-]+/);
  });

  test("footer has legal links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Privacy" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Terms" })).toBeVisible();
  });
});
