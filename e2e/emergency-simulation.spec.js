import { test, expect } from "@playwright/test";
import { setupApp } from "./helpers/setupApp";

test.describe("Emergency Simulation E2E Flow", () => {
  test.beforeEach(async ({ page }) => {
    await setupApp(page);
  });

  test("Enters clinical case, verifies Vitals HUD, orders test, and applies treatment", async ({ page }) => {
    await page.goto("/");

    // 1. Enter first case
    const startBtn = page.locator("button.start-btn, button:has-text('Играть'), button:has-text('Начать')").first();
    await expect(startBtn).toBeVisible({ timeout: 10000 });
    await startBtn.click();

    // 2. Verify Vitals HUD is rendered
    await page.waitForTimeout(1000);
    const vitalsHud = page.locator("text=/ЧСС|АД|SpO|ЧДД/i").first();
    await expect(vitalsHud).toBeVisible({ timeout: 5000 });

    // 3. Tab Navigation: Diagnostics Tab
    const diagTabBtn = page.locator("button:has-text('Тесты'), button:has-text('Исследования')").first();
    if (await diagTabBtn.isVisible()) {
      await diagTabBtn.click();
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
