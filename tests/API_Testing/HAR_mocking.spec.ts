import { test, expect } from "@playwright/test";

/**
 * Author: Anuvrat Singh
 */

test("Mocking via HAR file", async ({ page }) => {
  //record a har file
  await page.routeFromHAR("./har/fruits.har", {
    url: "*/**/api/v1/fruits",
    update: false,
  });
  //goto url
  await page.goto("https://demo.playwright.dev/api-mocking");
  // Assert that the fruit is visible
  await expect(page.getByText("Strawberry")).toBeVisible();
  await expect(page.getByText("Anuvrat")).toBeVisible();
  await expect(page.getByText("Singh")).toBeVisible();
  await expect(page.getByText("HAR mocking")).toBeVisible();
});
