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
      console.log('BROWSER ERROR:', msg.text());
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    console.log('BROWSER CRASH:', err.message);
    errors.push(err.message);
  });

  await page.addInitScript(() => {
    localStorage.setItem('ms_onboardingDone', 'true');
    localStorage.setItem('ms_tutorialDone', 'true');
  });

  console.log('1. Loading Menu...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  console.log('2. Clicking first case Start button...');
  const firstStartBtn = await page.locator('button.start-btn').first();
  await firstStartBtn.click();
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'test-artifacts/screenshots/02_icu_game.png' });
  console.log('Saved 02_icu_game.png');

  // Check vitals HUD
  const vitalsText = await page.locator('body').innerText();
  console.log('Has Vitals HUD:', vitalsText.includes('ЧСС') || vitalsText.includes('SpO'));

  // Switch to Treat tab
  console.log('3. Switching to Treatments tab...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const treatBtn = btns.find(b => b.innerText.includes('Назначения') || b.innerText.includes('Лечение'));
    if (treatBtn) treatBtn.click();
  });
  await page.waitForTimeout(500);

  // Switch to Diagnose tab
  console.log('4. Switching to Diagnose tab...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const diagBtn = btns.find(b => b.innerText.includes('Диагноз'));
    if (diagBtn) diagBtn.click();
  });
  await page.waitForTimeout(500);

  // Fill diagnosis and submit
  console.log('5. Entering diagnosis and submitting...');
  const input = await page.locator('input[placeholder*="диагноз" i], textarea[placeholder*="диагноз" i], input[type="text"]').last();
  if (await input.count() > 0) {
    await input.fill('Острый коронарный синдром');
  }

  // Click Submit case
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const submitBtn = btns.find(b => b.innerText.includes('Завершить') || b.innerText.includes('Подтвердить'));
    if (submitBtn) submitBtn.click();
  });
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'test-artifacts/screenshots/03_icu_result.png' });
  console.log('Saved 03_icu_result.png');

  // Check if ResultScreen appeared
  const resultText = await page.locator('body').innerText();
  console.log('On Result Screen:', resultText.includes('Результат') || resultText.includes('Итоговый балл') || resultText.includes('Баллы') || resultText.includes('В меню'));

  // Click Back to Menu
  console.log('6. Returning to Menu...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const menuBtn = btns.find(b => b.innerText.includes('В меню') || b.innerText.includes('меню'));
    if (menuBtn) menuBtn.click();
  });
  await page.waitForTimeout(1000);

  console.log('Errors caught during cycle:', errors.length);
  await browser.close();
}

main().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
