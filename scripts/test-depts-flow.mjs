import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
      errors.push(msg.text());
    }
  });

  await page.addInitScript(() => {
    localStorage.setItem('ms_onboardingDone', 'true');
    localStorage.setItem('ms_tutorialDone', 'true');
  });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // ================= ADMISSION CASE =================
  console.log('--- TESTING ADMISSION CASE (Орлов) ---');
  await page.locator('input[placeholder*="Поиск"]').first().fill('Орлов Виктор');
  await page.waitForTimeout(400);
  await page.locator('.case-card button.start-btn').first().click();
  await page.waitForTimeout(1200);

  await page.screenshot({ path: 'test-artifacts/screenshots/06_admission_game.png' });
  console.log('Saved 06_admission_game.png');

  // Test History mode buttons
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const classicBtn = btns.find(b => b.innerText && b.innerText.includes('Сбор'));
    if (classicBtn) classicBtn.click();
  });
  await page.waitForTimeout(300);

  // Switch to Diagnosis tab
  await page.locator('button').filter({ hasText: /диагноз/i }).first().click();
  await page.waitForTimeout(500);

  // Fill diagnosis and select route
  const diagInput = page.locator('textarea, input[placeholder*="диагноз" i]').first();
  await diagInput.fill('Нестабильная стенокардия');
  await page.waitForTimeout(300);

  // Select route
  await page.evaluate(() => {
    const routeBtns = Array.from(document.querySelectorAll('button, div[style*="cursor: pointer"]')).filter(el => {
      const txt = el.innerText || '';
      return txt.includes('ОРИТ') || txt.includes('отделение') || txt.includes('Амбулаторно') || txt.includes('Госпитализация');
    });
    if (routeBtns.length > 0) routeBtns[0].click();
  });
  await page.waitForTimeout(500);

  // Submit case
  const submitBtn = page.locator('button').filter({ hasText: /завершить случай/i }).first();
  if (await submitBtn.count() > 0) {
    await submitBtn.click();
  }
  await page.waitForTimeout(1200);

  await page.screenshot({ path: 'test-artifacts/screenshots/07_admission_result.png' });
  console.log('Saved 07_admission_result.png');

  // Return to menu
  await page.locator('button').filter({ hasText: /меню/i }).first().click();
  await page.waitForTimeout(1000);

  // ================= OUTPATIENT CASE =================
  console.log('--- TESTING OUTPATIENT CASE (Петрова) ---');
  await page.locator('input[placeholder*="Поиск"]').first().fill('Петрова Мария');
  await page.waitForTimeout(400);
  await page.locator('.case-card button.start-btn').first().click();
  await page.waitForTimeout(1200);

  await page.screenshot({ path: 'test-artifacts/screenshots/08_outpatient_game.png' });
  console.log('Saved 08_outpatient_game.png');

  // Click Anamnesis buttons
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btnIllness = btns.find(b => b.innerText && b.innerText.includes('Анамнез заболевания'));
    if (btnIllness) btnIllness.click();
    const btnLife = btns.find(b => b.innerText && b.innerText.includes('Анамнез жизни'));
    if (btnLife) btnLife.click();
    const btnExam = btns.find(b => b.innerText && b.innerText.includes('осмотр'));
    if (btnExam) btnExam.click();
  });
  await page.waitForTimeout(400);

  // Order tests
  await page.evaluate(() => {
    const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"], div[style*="cursor: pointer"]'));
    if (checkboxes.length > 0) checkboxes[0].click();
  });
  await page.waitForTimeout(300);

  // Click proceed to results or order
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const orderBtn = btns.find(b => b.innerText && (b.innerText.includes('Назначить') || b.innerText.includes('Перейти') || b.innerText.includes('Результат')));
    if (orderBtn) orderBtn.click();
  });
  await page.waitForTimeout(800);

  // Step 2 to Step 3 (Diagnose)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find(b => b.innerText && (b.innerText.includes('диагноз') || b.innerText.includes('Далее') || b.innerText.includes('Перейти')));
    if (nextBtn) nextBtn.click();
  });
  await page.waitForTimeout(800);

  // Fill outpatient diagnosis
  const outpInputs = page.locator('textarea, input[type="text"]');
  const countInputs = await outpInputs.count();
  for (let i = 0; i < countInputs; i++) {
    await outpInputs.nth(i).fill('Гипертоническая болезнь II стадии');
  }
  await page.waitForTimeout(400);

  // Select route
  await page.evaluate(() => {
    const routeBtns = Array.from(document.querySelectorAll('button, div[style*="cursor: pointer"]')).filter(el => {
      const txt = el.innerText || '';
      return txt.includes('Амбулаторно') || txt.includes('Дневной') || txt.includes('Стационар');
    });
    if (routeBtns.length > 0) routeBtns[0].click();
  });
  await page.waitForTimeout(400);

  // Finish consultation
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const finishBtn = btns.find(b => b.innerText && (b.innerText.includes('Завершить') || b.innerText.includes('прием')));
    if (finishBtn) finishBtn.click();
  });
  await page.waitForTimeout(1200);

  await page.screenshot({ path: 'test-artifacts/screenshots/09_outpatient_result.png' });
  console.log('Saved 09_outpatient_result.png');

  // Return to menu
  await page.locator('button').filter({ hasText: /меню/i }).first().click();
  await page.waitForTimeout(1000);

  console.log('Total Console Errors across depts:', errors.length);
  await browser.close();
}

main().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
