import { chromium } from "playwright";
import { spawn } from "child_process";
import path from "path";

const rootDir = "c:\\Users\\мишка\\Desktop\\redesigned-broccoli-main\\redesigned-broccoli";
const artifactDir = "C:\\Users\\мишка\\.gemini\\antigravity\\brain\\a176f61b-c2d6-48ea-a0e6-40b8de8c432c";

async function captureAll() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();

  try {
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      const user = { id: "u_dev", email: "doctor@medsim.ru", nickname: "Врач-реаниматолог" };
      const token = "tok_valid_session";
      localStorage.setItem("medsim_token", token);
      localStorage.setItem("medsim_current_user", JSON.stringify({ user, token }));
      localStorage.setItem("ms_onboardingDone", "true");
      localStorage.setItem("ms_tutorialDone", "true");
    });
    await page.goto("http://localhost:3000/app", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    // 1. Menu screenshot
    await page.screenshot({ path: path.join(artifactDir, "01_menu_screen.png") });
    console.log("✓ Saved 01_menu_screen.png");

    // 2. Open ICU Case
    console.log("Opening ICU Case (case_acs_01)...");
    const startBtn = await page.$("button.start-btn, button:has-text('Начать')");
    if (startBtn) {
      await startBtn.click();
    } else {
      const card = await page.$("[data-case-id]");
      if (card) await card.click();
    }
    await page.waitForTimeout(2000);

    // 2. ICU Workstation main (Tests tab)
    await page.screenshot({ path: path.join(artifactDir, "02_icu_workstation_main.png") });
    console.log("✓ Saved 02_icu_workstation_main.png");

    // 3. Treatments Tab
    const treatTab = await page.$("button:has-text('Экстренное лечение'), button:has-text('лечение')");
    if (treatTab) {
      await treatTab.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(artifactDir, "03_icu_treatments_tab.png") });
      console.log("✓ Saved 03_icu_treatments_tab.png");
    }

    // 4. Diagnosis Tab
    const diagTab = await page.$("button:has-text('Диагноз+Лечение'), button:has-text('Диагноз')");
    if (diagTab) {
      await diagTab.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(artifactDir, "04_icu_diagnosis_tab.png") });
      console.log("✓ Saved 04_icu_diagnosis_tab.png");
    }

    console.log("SUCCESS: All screenshots saved!");

    console.log("SUCCESS: All screenshots saved!");
  } catch (err) {
    console.error("Capture error:", err);
  } finally {
    await browser.close();
    process.exit(0);
  }
}

captureAll();
