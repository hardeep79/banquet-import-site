import { test, expect } from "@playwright/test";

test("catalog index lists 10 categories", async ({ page }) => {
  await page.goto("/catalog");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  // The catalog index renders a CategoryCard per category. Each is an <a href="/catalog/<slug>">.
  // Count links whose href matches /^\/catalog\/[a-z-]+$/ (the *index* of a category).
  const allLinks = page.locator('a[href^="/catalog/"]');
  const hrefs = await allLinks.evaluateAll((els) =>
    els.map((el) => (el as HTMLAnchorElement).getAttribute("href") ?? ""),
  );
  const categoryRouteLinks = hrefs.filter((h) => /^\/catalog\/[a-z0-9-]+$/.test(h));
  // 10 categories, expect at least 10 (header sticky shows /catalog, etc., but those don't match the regex above).
  expect(new Set(categoryRouteLinks).size).toBeGreaterThanOrEqual(10);
});

test("category page shows the category heading", async ({ page }) => {
  await page.goto("/catalog/chiavari-chairs");
  await expect(page.getByRole("heading", { level: 1, name: /chiavari/i })).toBeVisible();
});

test("product detail shows quote CTA with prefilled product slug", async ({ page }) => {
  await page.goto("/catalog/chiavari-chairs/gold-luxe-chiavari");
  await expect(page.getByRole("heading", { level: 1, name: /chiavari/i })).toBeVisible();
  // The SpecSheet CTA carries ?product=<slug>; the header CTA goes to /quote plain.
  // Filter to find the SpecSheet one specifically.
  const quoteCta = page.locator('a[href*="/quote?product="]').first();
  await expect(quoteCta).toBeVisible();
  const href = await quoteCta.getAttribute("href");
  expect(href).toContain("/quote?product=");
});
