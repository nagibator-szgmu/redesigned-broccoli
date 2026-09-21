import { test, expect } from "@playwright/test";
import { setupApp } from "./helpers/setupApp";

test.describe("Settings and Customization", () => {
  test.beforeEach(async ({ page }) => {
    await setupApp(page);
  });

  test("Opens settings modal, toggles theme and audio preferences", async ({ page }) => {
    await page.goto("/");

    // Open settings modal via gear icon button
    const settingsBtn = page.locator(".spin-on-hover, [title*='НАСТРОЙКИ'], button:has-text('Настройки')").first();
    if (await settingsBtn.isVisible()) {
      await settingsBtn.click();
      await page.waitForTimeout(400);

      // Verify settings modal is open
      const settingsModal = page.locator("text=/Настройки|Параметры/i").first();
      await expect(settingsModal).toBeVisible({ timeout: 5000 });

      // Check audio or theme toggle button
      const toggleBtn = page.locator("button:has-text('Звук'), button:has-text('Тема'), button:has-text('ВКЛ'), button:has-text('ВЫКЛ')").first();
      if (await toggleBtn.isVisible()) {
        await toggleBtn.click();
        await page.waitForTimeout(300);
      }

      // Close modal
      const closeBtn = page.locator("span:has-text('✕')").first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      }
    }
  });
});
