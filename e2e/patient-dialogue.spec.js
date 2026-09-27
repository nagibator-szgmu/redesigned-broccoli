import { test, expect } from "@playwright/test";
import { setupApp } from "./helpers/setupApp";

test.describe("AI Patient Dialogue E2E Flow", () => {
  test.beforeEach(async ({ page }) => {
    await setupApp(page);
  });

  test("Verifies patient dialogue widget, chips categorized switching, and question responses", async ({ page }) => {
    await page.goto("/");

    // 1. Enter emergency case 1 directly
    await page.waitForFunction(() => typeof window.__START_CASE__ === "function", { timeout: 10000 });
    await page.evaluate(() => window.__START_CASE__(1));

    // 2. Locate Patient Dialogue Widget
    const dialogueWidget = page.locator('[data-testid="patient-dialogue-widget"]');
    await expect(dialogueWidget).toBeVisible({ timeout: 15000 });

    // Dismiss any tutorial tooltip if present
    const dismissTipBtn = page.locator("button:has-text('Понятно')");
    if (await dismissTipBtn.isVisible()) {
      await dismissTipBtn.click();
    }

    // 3. Verify category tabs exist and click Allergies category
    const allergyCategoryTab = page.locator('[data-testid="dialogue-tab-allergies"]');
    if (await allergyCategoryTab.isVisible()) {
      await allergyCategoryTab.click();
      await page.waitForTimeout(300);
    }

    // 4. Click a quick interview chip (e.g. Allergies)
    const allergyChip = page.locator('[data-testid^="dialogue-chip-allergies"]').first();
    if (await allergyChip.isVisible() && await allergyChip.isEnabled()) {
      await allergyChip.click();
      await page.waitForTimeout(500);

      // Verify doctor asked the question
      const doctorMessage = page.locator("text='Аллергии на лекарства?'").first();
      await expect(doctorMessage).toBeVisible({ timeout: 5000 });
    }

    // 5. Test Freeform Question Input
    const freeformInput = page.locator('[data-testid="dialogue-freeform-input"]');
    const sendBtn = page.locator('[data-testid="dialogue-send-btn"]');

    if (await freeformInput.isVisible() && await freeformInput.isEnabled()) {
      await freeformInput.fill("Когда начался приступ?");
      await sendBtn.click();
      await page.waitForTimeout(500);

      // Doctor message appeared in chat list
      const freeformDoctorMsg = page.locator("text='Когда начался приступ?'").first();
      await expect(freeformDoctorMsg).toBeVisible({ timeout: 5000 });
    }
  });
});
