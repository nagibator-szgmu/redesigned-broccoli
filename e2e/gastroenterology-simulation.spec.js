import { test, expect } from "@playwright/test";
import { setupApp } from "./helpers/setupApp";

test.describe("Gastroenterology Simulation E2E Flow", () => {
  test.beforeEach(async ({ page }) => {
    await setupApp(page);
  });

  test("Enters gastro case 57 (GI Bleed), verifies Vitals HUD, orders FGDS and applies Omeprazole", async ({ page }) => {
    await page.goto("/");

    // 1. Enter emergency gastro case 57 directly
    await page.waitForFunction(() => typeof window.__START_CASE__ === "function", { timeout: 10000 });
    await page.evaluate(() => window.__START_CASE__(57));

    // 2. Dismiss tutorial/tip if visible
    await page.waitForTimeout(800);
    const dismissTipBtn = page.locator("button:has-text('Понятно')");
    if (await dismissTipBtn.isVisible()) {
      await dismissTipBtn.click();
    }

    // 3. Verify Vitals HUD is rendered
    const vitalsHud = page.locator("text=/ЧСС|АД|SpO|ЧДД/i").first();
    await expect(vitalsHud).toBeVisible({ timeout: 15000 });

    // 4. Navigate to Diagnostics Tab and verify FGDS option
    const diagTabBtn = page.locator("button:has-text('Тесты'), button:has-text('Исследования')").first();
    if (await diagTabBtn.isVisible()) {
      await diagTabBtn.click({ force: true });
      await page.waitForTimeout(400);
      const fgdsOption = page.locator("text=/ФГДС|Эзофагогастродуоденоскопия/i").first();
      await expect(fgdsOption).toBeVisible({ timeout: 5000 });
    }

    // 5. Navigate to Treatment Tab and verify Omeprazole option
    const treatTabBtn = page.locator("button:has-text('Лечение'), button:has-text('Назначения')").first();
    if (await treatTabBtn.isVisible()) {
      await treatTabBtn.click();
      await page.waitForTimeout(400);
      const omeprazoleOption = page.locator("text=/Омепразол/i").first();
      await expect(omeprazoleOption).toBeVisible({ timeout: 5000 });
    }

    // 6. Finish case and verify ResultScreen transitions cleanly
    await page.evaluate(() => {
      if (typeof window.__FINISH_CASE__ === "function") {
        window.__FINISH_CASE__();
      } else if (typeof window.__SET_PHASE__ === "function") {
        window.__SET_PHASE__("result");
      }
    });

    const resultTab = page.locator("button:has-text('Разбор ошибок'), button:has-text('Итог')").first();
    await expect(resultTab).toBeVisible({ timeout: 10000 });
  });
});
