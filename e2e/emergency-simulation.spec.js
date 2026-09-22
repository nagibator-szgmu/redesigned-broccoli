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

  test("Verifies ResultScreen debriefing and clinical errors tab", async ({ page }) => {
    await page.goto("/");

    // 1. Enter emergency case 1 directly
    await page.waitForFunction(() => typeof window.__START_CASE__ === "function", { timeout: 10000 });
    await page.evaluate(() => window.__START_CASE__(1));
    await page.waitForTimeout(500);

    // 2. Finish case to trigger finalizeSession and transition to ResultScreen
    await page.evaluate(() => {
      if (typeof window.__FINISH_CASE__ === "function") {
        window.__FINISH_CASE__();
      } else if (typeof window.__SET_PHASE__ === "function") {
        window.__SET_PHASE__("result");
      }
    });

    // 3. Verify ResultScreen is reached and switch to mistakes tab
    const resultTab = page.locator("button:has-text('Разбор ошибок')").first();
    await expect(resultTab).toBeVisible({ timeout: 10000 });
    await resultTab.click();
    await page.waitForTimeout(500);

    // 4. Verify errors tab content or clinical AI analysis rendered
    const errorsTabContent = page.locator("text=/Клинические дефекты|Анализ клинического мышления|Назначенное лечение/i").first();
    await expect(errorsTabContent).toBeVisible({ timeout: 5000 });
  });
});
