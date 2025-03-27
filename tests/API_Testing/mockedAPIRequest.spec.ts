import { test, expect } from "@playwright/test";

/**
 * Author: Anuvrat Singh
 */

test("API request mocking", async ({ page }) => {
  await page.route("*/**/api/v1/fruits", async (route) => {
    const json = [
      { name: "mock1", id: 21 },
      { name: "mock2", id: 71 },
      { name: "mock3", id: 72 },
      { name: "mock4", id: 73 },
      { name: "mock5", id: 74 },
    ];
    await route.fulfill({ json });
  });
  // Go to the page
  await page.goto("https://demo.playwright.dev/api-mocking");

  // Assert that the mocked values
  await expect(page.getByText("mock1")).toBeVisible();
  await expect(page.getByText("mock2")).toBeVisible();
  await expect(page.getByText("mock3")).toBeVisible();
  await expect(page.getByText("mock4")).toBeVisible();
  await expect(page.getByText("mock5")).toBeVisible();
});
