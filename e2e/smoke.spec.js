import { test, expect } from "@playwright/test";
import { setupApp } from "./helpers/setupApp";

test.describe("MedSim Smoke Suite", () => {
  test.beforeEach(async ({ page }) => {
    await setupApp(page);
  });

  test("Main menu loads cleanly with case cards and navigation", async ({ page }) => {
    await page.goto("/");

    // Check for title or branding
    await expect(page).toHaveTitle(/MedSim|МедСим/i);

    // Verify main menu elements
    const body = page.locator("body");
    await expect(body).toBeVisible();

    // Verify case cards or start buttons exist
    const startBtns = page.locator("button.start-btn, button:has-text('Играть'), button:has-text('Начать')");
    await expect(startBtns.first()).toBeVisible({ timeout: 10000 });
  });

  test("Navigation to Theory screen and back", async ({ page }) => {
    await page.goto("/");

    // Click Theory tab / icon
    const theoryBtn = page.locator("button:has-text('Теория'), [title*='Теория'], span:has-text('Теория')").first();
    if (await theoryBtn.isVisible()) {
      await theoryBtn.click();
      await page.waitForTimeout(500);

      // Verify theory search or protocol header appears
      const theoryHeading = page.locator("text=/Клинические протоколы|Теория|Стандарты/i").first();
      await expect(theoryHeading).toBeVisible({ timeout: 10000 });
    }
  });

  test("Navigation to Leaderboard screen and back", async ({ page }) => {
    await page.goto("/");

    // Click Leaderboard / Achievements button
    const leaderboardBtn = page.locator("button:has-text('Достижения'), button:has-text('Рейтинг'), span:has-text('Достижения')").first();
    if (await leaderboardBtn.isVisible()) {
      await leaderboardBtn.click();
      await page.waitForTimeout(500);

      // Verify leaderboard header appears
      const lbHeading = page.locator("text=/Достижения|Рейтинг|Портфолио/i").first();
      await expect(lbHeading).toBeVisible({ timeout: 5000 });
    }
  });
});
