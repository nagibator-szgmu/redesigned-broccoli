import { chromium } from 'playwright';
import path from 'path';

const artifactDir = 'C:/Users/мишка/.gemini/antigravity/brain/a176f61b-c2d6-48ea-a0e6-40b8de8c432c';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    serviceWorkers: 'block',
  });
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000/app', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('ms_onboardingDone', 'true');
    localStorage.setItem('ms_tutorialDone', 'true');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click on the first case in the list
  const startBtn = page.getByRole('button', { name: /Старт|Начать|Играть/i }).first();
  if (await startBtn.isVisible()) {
    await startBtn.click();
  } else {
    const card = page.locator('div[style*="cursor: pointer"]').first();
    await card.click();
  }
  console.log("Clicked case");
  await page.waitForTimeout(1500);

  // 1. Order tests so evidence is populated
  const ecgBtn = page.getByRole('button', { name: /ЭКГ/i }).first();
  if (await ecgBtn.isVisible()) {
    await ecgBtn.click();
    console.log("Selected ECG");
  }
  const tropBtn = page.getByRole('button', { name: /Тропонин/i }).first();
  if (await tropBtn.isVisible()) {
    await tropBtn.click();
    console.log("Selected Troponin");
  }

  const sendBtn = page.getByRole('button', { name: /В ЛАБОРАТОРИЮ/i }).first();
  if (await sendBtn.isVisible()) {
    await sendBtn.click();
    console.log("Sent tests to lab");
    await page.waitForTimeout(1000);
  }

  // 2. Click Diagnosis Tab
  const diagTab = page.getByRole('button', { name: /Диагноз/i }).first();
  await diagTab.waitFor({ timeout: 5000 });
  await diagTab.click();
  console.log("Clicked Diagnosis tab");
  await page.waitForTimeout(1000);

  // Click the first 2 criteria checkboxes to show active selection
  const critCards = page.locator('div[style*="cursor: pointer"]');
  const count = await critCards.count();
  for (let i = 0; i < Math.min(3, count); i++) {
    try {
      await critCards.nth(i).click();
    } catch (e) {}
  }
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: path.join(artifactDir, '04_icu_diagnosis_tab.png') });
  console.log('✓ Successfully saved 04_icu_diagnosis_tab.png');

  // 3. Treatments tab
  const treatTab = page.getByRole('button', { name: /Экстренное лечение|Назначения/i }).first();
  await treatTab.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(artifactDir, '03_icu_treatments_tab.png') });
  console.log('✓ Successfully saved 03_icu_treatments_tab.png');

  // 4. Investigations tab
  const invTab = page.getByRole('button', { name: /Исследования/i }).first();
  await invTab.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(artifactDir, '02_icu_workstation_main.png') });
  console.log('✓ Successfully saved 02_icu_workstation_main.png');

  await browser.close();
  console.log('All captures done successfully!');
}

run().catch(e => {
  console.error("FATAL:", e);
  process.exit(1);
});
