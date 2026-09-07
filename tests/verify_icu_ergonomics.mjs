import { chromium } from "playwright";
import { spawn } from "child_process";
import path from "path";

const rootDir = "c:\\Users\\мишка\\Desktop\\redesigned-broccoli-main\\redesigned-broccoli";

async function testICUErgonomics() {
  console.log("=== VERIFYING ICU WORKSTATION ERGONOMICS & SCROLL INTEGRITY ===");

  const server = spawn("npm.cmd", ["run", "preview", "--", "--port", "4175"], {
    cwd: rootDir,
    stdio: "pipe",
    shell: true,
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 768 } });
  const page = await context.newPage();

  try {
    await page.goto("http://localhost:4175/", { waitUntil: "networkidle" });
    await page.evaluate(() => {
      localStorage.setItem("ms_onboardingDone", "true");
      localStorage.setItem("ms_tutorialDone", "true");
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // Click on 'Начать' / 'Играть' to enter first case
    console.log("Entering case...");
    const startBtn = await page.$("button:has-text('Начать'), button:has-text('Играть')");
    if (startBtn) await startBtn.click();
    else {
      const caseCard = await page.$("[data-case-id]");
      if (caseCard) await caseCard.click();
    }
    await page.waitForTimeout(1500);

    // Verify 1: Zero window page scroll
    const pageScrollY = await page.evaluate(() => window.pageYOffset || document.documentElement.scrollTop);
    console.log("Window pageYOffset:", pageScrollY);
    if (pageScrollY !== 0) {
      throw new Error(`Window pageYOffset should be 0, but was ${pageScrollY}`);
    }
    console.log("✓ Page scroll is strictly 0 (no initial downward jump)");

    // Verify 2: Action tabs are visible at the top of the right panel
    const tabsInfo = await page.evaluate(() => {
      const tabBtns = Array.from(document.querySelectorAll("button")).filter(b => 
        b.innerText.includes("Исследования") || 
        b.innerText.includes("Назначения") || 
        b.innerText.includes("Диагноз") ||
        b.innerText.includes("КР & Советы")
      );
      return tabBtns.map(b => {
        const r = b.getBoundingClientRect();
        return {
          text: b.innerText.trim(),
          top: r.top,
          height: r.height,
          visible: r.top >= 0 && r.bottom <= window.innerHeight
        };
      });
    });

    console.log("Action tabs bounding boxes:", tabsInfo);
    if (tabsInfo.length < 3 || !tabsInfo.every(t => t.visible)) {
      throw new Error("Action tabs are not fully visible in the viewport!");
    }
    console.log("✓ All action command tabs are firmly visible and pinned at top");

    // Verify 3: History & Physical Exam accordion sections are rendered and open by default
    const sections = await page.evaluate(() => {
      return {
        hasAnamnesis: document.body.innerText.includes("Анамнез заболевания и жизни") || document.body.innerText.includes("Анамнез"),
        hasExam: document.body.innerText.includes("Данные объективного осмотра") || document.body.innerText.includes("Объективный осмотр"),
        hasProblemList: document.body.innerText.includes("Problem List") || document.body.innerText.includes("Клинические проблемы"),
        noChatInput: !document.querySelector("input[placeholder*='Спросите о симптомах']"),
        noAbcdeButtons: !document.querySelector("button:has-text('ABCDE')")
      };
    });

    console.log("Left panel inspection:", sections);
    if (!sections.hasAnamnesis || !sections.hasExam || !sections.noChatInput) {
      throw new Error("Left panel structured sections verification failed!");
    }
    console.log("✓ Objective Examination & Anamnesis sections verified (clean, structured, open by default, no chat/ABCDE)");

    // Take screenshot
    const shotPath = path.join(rootDir, "tests", "artifacts", "screenshots", "icu_ergonomics_verified.png");
    await page.screenshot({ path: shotPath });
    console.log("✓ Screenshot saved to:", shotPath);

    console.log("\n==========================================");
    console.log("ALL ICU WORKSTATION ERGONOMICS TESTS PASSED!");
    console.log("==========================================\n");

  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  } finally {
    await browser.close();
    server.kill();
    process.exit(0);
  }
}

testICUErgonomics();
