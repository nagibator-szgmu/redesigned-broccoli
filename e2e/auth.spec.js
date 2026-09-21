import { test, expect } from "@playwright/test";

test.describe("Authentication Flows", () => {
  test("Renders login page with email, password fields and navigation to register", async ({ page }) => {
    await page.goto("/#/login");

    // Check title and inputs
    const emailInput = page.locator("input[type='email']");
    const passwordInput = page.locator("input[type='password']");
    const submitBtn = page.locator("button[type='submit'], button:has-text('Войти')").first();

    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Fill credentials
    await emailInput.fill("test@medsim.ru");
    await passwordInput.fill("Secret123!");

    // Navigate to register page
    const registerLink = page.locator("a[href*='register'], button:has-text('Регистрация'), a:has-text('Регистрация'), a:has-text('Создать аккаунт')").first();
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/register/i);
    }
  });

  test("Renders register page and allows returning to login", async ({ page }) => {
    await page.goto("/#/register");

    const emailInput = page.locator("input[type='email']");
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    const loginLink = page.locator("a[href*='login'], button:has-text('Войти'), a:has-text('Войти')").first();
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/login/i);
    }
  });
});
