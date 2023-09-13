import { test, expect } from "@playwright/test";

test("guess the number", async ({ page }) => {
  await page.goto("http://localhost:8080/");

  await page.getByRole("textbox").type("50");

  await page.getByRole("button").click();
});
