import { test, expect } from "@playwright/test";
import { setupApp } from "./helpers/setupApp";

test.describe("Russian Clinical Guidelines Emergency Cases Simulation Flow", () => {
  test.beforeEach(async ({ page }) => {
    await setupApp(page);
  });

  test("Runs Case 60 (Asthma Status) and verifies Salbutamol neb therapy", async ({ page }) => {
    await page.goto("/");

    // 1. Enter emergency case 60 directly
    await page.waitForFunction(() => typeof window.__START_CASE__ === "function", { timeout: 10000 });
    await page.evaluate(() => window.__START_CASE__(60));

    // 2. Dismiss tutorial/tip if visible
    await page.waitForTimeout(600);
    const dismissTipBtn = page.locator("button:has-text('Понятно')");
    if (await dismissTipBtn.isVisible()) {
      await dismissTipBtn.click();
    }

    // 3. Verify Vitals HUD is rendered
    const vitalsHud = page.locator("text=/ЧСС|АД|SpO|ЧДД/i").first();
    await expect(vitalsHud).toBeVisible({ timeout: 15000 });

    // 4. Navigate to Treatment Tab and verify Salbutamol
    const treatTabBtn = page.locator("button:has-text('Лечение'), button:has-text('Назначения')").first();
    if (await treatTabBtn.isVisible()) {
      await treatTabBtn.click();
      let salbutamolOption = page.locator("text=/Сальбутамол/i").first();
      if (!(await salbutamolOption.isVisible())) {
        const catHeader = page.locator("button:has-text('Дыхание')").first();
        if (await catHeader.isVisible()) await catHeader.click();
        await page.waitForTimeout(300);
      }
      await expect(salbutamolOption).toBeVisible({ timeout: 5000 });
    }

    // 5. Cleanly finish case
    await page.evaluate(() => {
      if (typeof window.__FINISH_CASE__ === "function") {
        window.__FINISH_CASE__();
      } else if (typeof window.__SET_PHASE__ === "function") {
        window.__SET_PHASE__("result");
      }
    });
    const resultIndicator = page.locator("text=/из 100 баллов|Разбор ошибок|Клинические дефекты/i").first();
    await expect(resultIndicator).toBeVisible({ timeout: 10000 });
  });

  test("Runs Case 61 (Hypertensive Encephalopathy) and verifies Urapidil IV", async ({ page }) => {
    await page.goto("/");

    // 1. Enter emergency case 61 directly
    await page.waitForFunction(() => typeof window.__START_CASE__ === "function", { timeout: 10000 });
    await page.evaluate(() => window.__START_CASE__(61));

    // 2. Dismiss tutorial/tip if visible
    await page.waitForTimeout(600);
    const dismissTipBtn = page.locator("button:has-text('Понятно')");
    if (await dismissTipBtn.isVisible()) {
      await dismissTipBtn.click();
    }

    // 3. Verify Vitals HUD is rendered
    const vitalsHud = page.locator("text=/ЧСС|АД|SpO|ЧДД/i").first();
    await expect(vitalsHud).toBeVisible({ timeout: 15000 });

    // 4. Navigate to Treatment Tab and verify Urapidil
    const treatTabBtn = page.locator("button:has-text('Лечение'), button:has-text('Назначения')").first();
    if (await treatTabBtn.isVisible()) {
      await treatTabBtn.click();
      let urapidilOption = page.locator("text=/Урапидил/i").first();
      if (!(await urapidilOption.isVisible())) {
        const catHeader = page.locator("button:has-text('Кардиоваскулярные')").first();
        if (await catHeader.isVisible()) await catHeader.click();
        await page.waitForTimeout(300);
      }
      await expect(urapidilOption).toBeVisible({ timeout: 5000 });
    }
  });
});
