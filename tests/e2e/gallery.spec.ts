import { test, expect } from "@playwright/test";

test("gallery opens lightbox on click and closes on Escape", async ({ page }) => {
  await page.goto("/gallery");
  // Wait for at least one gallery thumbnail to render
  const thumb = page.locator("button img").first();
  await expect(thumb).toBeVisible();
  await thumb.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
