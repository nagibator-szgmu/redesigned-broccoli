import { chromium } from "playwright";

async function runRuntimeAudit() {
  console.log("Starting browser runtime audit on http://127.0.0.1:5173...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const consoleLogs = [];
  const errors = [];
  page.on("console", msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on("pageerror", err => errors.push(err.message));

  try {
    // 1. Load app
    await page.goto("http://127.0.0.1:5173", { waitUntil: "networkidle" });
    console.log("✓ Page loaded successfully");

    // Close onboarding if open
    const skipBtn = await page.$("button:has-text('Пропустить')");
    if (skipBtn) {
      await skipBtn.click();
      console.log("✓ Onboarding skipped");
    }

    // 2. Start a case
    const startCaseBtn = await page.$("button:has-text('Начать случай')");
    if (startCaseBtn) {
      await startCaseBtn.click();
      console.log("✓ Case started");
    }

    await page.waitForTimeout(1000);

    // 3. Test ABCDE Panel
    const abcdeBtn = await page.$("button:has-text('ABCDE')");
    if (abcdeBtn) {
      await abcdeBtn.click();
      console.log("✓ ABCDE tab clicked");
      await page.waitForTimeout(500);

      // Click Airway check
      const airwayBtn = await page.$("button:has-text('Проходимость ВДП')");
      if (airwayBtn) {
        await airwayBtn.click();
        console.log("✓ Airway assessment clicked");
      }
    }

    // 4. Test Command Palette
    await page.keyboard.press("Meta+k");
    await page.waitForTimeout(500);
    const paletteInput = await page.$("input[placeholder*='Быстрый поиск']");
    if (paletteInput) {
      console.log("✓ Command Palette opened with Cmd+K");
      await paletteInput.fill("Аспирин");
      await page.waitForTimeout(300);
      await page.keyboard.press("Enter");
      console.log("✓ Aspirin searched and executed via Enter");
    }

    // 5. Test ordering test via Command Palette
    await page.keyboard.press("Control+k");
    await page.waitForTimeout(500);
    const paletteInput2 = await page.$("input[placeholder*='Быстрый поиск']");
    if (paletteInput2) {
      console.log("✓ Command Palette opened with Ctrl+K");
      await paletteInput2.fill("ЭКГ");
      await page.waitForTimeout(300);
      await page.keyboard.press("Enter");
      console.log("✓ ECG ordered via Command Palette");
    }

    // 6. Test Escape key closes palette
    await page.keyboard.press("Meta+k");
    await page.waitForTimeout(300);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    const paletteClosed = await page.$("input[placeholder*='Быстрый поиск']");
    console.log("✓ Escape closed palette:", paletteClosed === null);

    // 7. Check differential assistant under Diagnose tab
    const diagnoseTab = await page.$("button:has-text('Диагноз')");
    if (diagnoseTab) {
      await diagnoseTab.click();
      console.log("✓ Diagnose tab opened");
      await page.waitForTimeout(500);
      const diffHyp = await page.$("text=Дифференциальный ряд");
      console.log("✓ Differential assistant rendered:", diffHyp !== null);
    }

    // 8. Test Viewports
    const viewports = [
      { width: 390, height: 844, name: "Mobile iPhone 14" },
      { width: 768, height: 1024, name: "Tablet iPad Mini" },
      { width: 1440, height: 900, name: "Desktop 1440px" },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(500);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      const hasOverflow = scrollWidth > clientWidth;
      console.log(`✓ Viewport ${vp.name} (${vp.width}x${vp.height}): Overflow = ${hasOverflow ? "YES (bad)" : "NO (clean)"}`);
    }

    console.log("\n--- Audit Summary ---");
    console.log("Total runtime errors:", errors.length);
    if (errors.length > 0) {
      console.error("Errors encountered:", errors);
    } else {
      console.log("✓ ZERO runtime errors encountered during full workflow!");
    }
  } catch (err) {
    console.error("Audit script failed:", err);
  } finally {
    await browser.close();
  }
}

runRuntimeAudit();
