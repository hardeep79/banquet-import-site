import { test, expect } from "@playwright/test";

test("quote form happy path posts to /api/lead and redirects to thanks", async ({ page }) => {
  await page.route("**/api/lead", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    }),
  );

  await page.goto("/quote");

  // Step 1 — Event basics
  await page.getByLabel(/Event type/i).selectOption("wedding");
  await page.getByLabel(/Event date/i).fill("2026-09-12");
  await page.getByLabel(/Headcount/i).fill("220");
  await page.getByLabel(/Delivery city/i).fill("Toronto");
  await page.getByLabel(/Province/i).selectOption("ON");
  await page.getByRole("button", { name: /^next$/i }).click();

  // Step 2 — Product interest
  await page.getByRole("button", { name: /chiavari chairs/i }).click();
  await page.getByLabel(/Budget/i).selectOption("15-50k");
  await page.getByLabel(/Need-by/i).fill("Flexible");
  await page.getByRole("button", { name: /^next$/i }).click();

  // Step 3 — Contact
  await page.getByLabel(/Full name/i).fill("Jane Doe");
  await page.getByLabel(/Company \/ venue/i).fill("Northwood Banquet Hall");
  await page.getByLabel(/Email/i).fill("jane@northwood.com");
  await page.getByLabel(/Phone/i).fill("416-555-0100");
  await page.getByText(/I agree to be contacted/).click();

  // Turnstile is in dev-bypass mode (NEXT_PUBLIC_TURNSTILE_SITE_KEY is empty in .env.local).
  // The form auto-sets a "dev-bypass-token", so the Submit button becomes enabled.
  await page.getByRole("button", { name: /submit request/i }).click();
  await expect(page).toHaveURL(/\/quote\/thanks$/);
});
