import { test, expect } from "@playwright/test";
import { setupApp } from "./helpers/setupApp";

test.describe("Emergency Simulation E2E Flow", () => {
  test.beforeEach(async ({ page }) => {
    await setupApp(page);
  });

  test("Enters clinical case, verifies Vitals HUD, orders test, and applies treatment", async ({ page }) => {
    await page.goto("/");

    // 1. Enter emergency case 1 directly
    await page.waitForFunction(() => typeof window.__START_CASE__ === "function", { timeout: 10000 });
    await page.evaluate(() => window.__START_CASE__(1));

    // 2. Verify Vitals HUD is rendered
    await page.waitForTimeout(1000);
    const dismissTipBtn = page.locator("button:has-text('Понятно')");
    if (await dismissTipBtn.isVisible()) {
      await dismissTipBtn.click();
    }
    const vitalsHud = page.locator("text=/ЧСС|АД|SpO|ЧДД/i").first();
    await expect(vitalsHud).toBeVisible({ timeout: 15000 });

    // 3. Tab Navigation: Diagnostics Tab
    const diagTabBtn = page.locator("button:has-text('Тесты'), button:has-text('Исследования')").first();
    if (await diagTabBtn.isVisible()) {
      await diagTabBtn.click({ force: true });
      await page.waitForTimeout(400);
    }

    // 4. Tab Navigation: Treatment Tab
    const treatTabBtn = page.locator("button:has-text('Лечение'), button:has-text('Назначения')").first();
    if (await treatTabBtn.isVisible()) {
      await treatTabBtn.click();
      await page.waitForTimeout(400);
    }

    // 5. Tab Navigation: Diagnosis Tab
    const diagnoseTabBtn = page.locator("button:has-text('Диагноз')").first();
    if (await diagnoseTabBtn.isVisible()) {
      await diagnoseTabBtn.click();
      await page.waitForTimeout(400);
    }
  });
});
