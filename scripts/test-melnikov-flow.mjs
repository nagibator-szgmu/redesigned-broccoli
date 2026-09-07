import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.addInitScript(() => {
    localStorage.setItem('ms_onboardingDone', 'true');
    localStorage.setItem('ms_tutorialDone', 'true');
  });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Search and start Melnikov
  await page.locator('input[placeholder*="Поиск"]').first().fill('Мельников');
  await page.waitForTimeout(400);
  await page.locator('.case-card button.start-btn').first().click();
  await page.waitForTimeout(1000);

  // 1. Order tests: Click checkboxes for ECG and Troponin
  console.log('1. Ordering ECG and Troponin...');
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label, div, span'));
    const ecg = labels.find(l => l.innerText && l.innerText.trim() === 'ЭКГ');
    if (ecg) ecg.click();
    const trop = labels.find(l => l.innerText && l.innerText.includes('Тропонин'));
    if (trop) trop.click();
  });
  await page.waitForTimeout(300);

  // Click "В ЛАБОРАТОРИЮ"
  const labBtn = page.locator('button').filter({ hasText: /лаборатори/i });
  if (await labBtn.count() > 0) {
    await labBtn.first().click();
  }
  await page.waitForTimeout(600);

  // 2. Switch to Emergency Treatment tab
  console.log('2. Switching to Treatments tab...');
  await page.locator('button').filter({ hasText: /лечени/i }).first().click();
  await page.waitForTimeout(400);

  // Click treatment items
  await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('button, div[style*="cursor: pointer"]'));
    const asp = items.find(i => i.innerText && i.innerText.includes('Аспирин'));
    if (asp) asp.click();
    const hep = items.find(i => i.innerText && i.innerText.includes('Гепарин'));
    if (hep) hep.click();
  });
  await page.waitForTimeout(400);

  // 3. Switch to Diagnosis tab
  console.log('3. Switching to Diagnosis tab...');
  await page.locator('button').filter({ hasText: /диагноз/i }).first().click();
  await page.waitForTimeout(400);

  // Enter diagnosis
  const diagInput = page.locator('textarea, input[placeholder*="диагноз" i]').first();
  await diagInput.fill('Острый инфаркт миокарда с подъёмом ST передней стенки (ПМЖА)');
  await page.waitForTimeout(500);

  // 4. Click Submit case
  console.log('4. Clicking Submit Case...');
  const finishBtn = page.locator('button').filter({ hasText: /завершить случай/i }).first();
  await finishBtn.click();
  await page.waitForTimeout(1500);

  // 5. Screenshot result screen
  await page.screenshot({ path: 'test-artifacts/screenshots/05_melnikov_result.png' });
  console.log('Saved 05_melnikov_result.png');

  const pageText = await page.locator('body').innerText();
  const hasResult = pageText.includes('Итоговый балл') || pageText.includes('Результат') || pageText.includes('Баллы');
  console.log('Result Screen displayed successfully:', hasResult);

  // 6. Return to menu
  const menuBtn = page.locator('button').filter({ hasText: /меню/i }).first();
  if (await menuBtn.count() > 0) {
    await menuBtn.click();
    console.log('Clicked В меню');
  }
  await page.waitForTimeout(1000);

  await browser.close();
}

main().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
