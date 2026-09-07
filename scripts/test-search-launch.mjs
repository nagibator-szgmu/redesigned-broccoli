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

  console.log('1. Searching for Мельников...');
  const searchInput = await page.locator('input[placeholder*="Поиск"]').first();
  await searchInput.fill('Мельников');
  await page.waitForTimeout(500);

  const count = await page.locator('.case-card').count();
  console.log('Cards matching Мельников:', count);

  const cardTitle = await page.locator('.case-card').first().innerText();
  console.log('Card header:', cardTitle.split('\n')[0], cardTitle.split('\n')[1]);

  await page.locator('.case-card button.start-btn').first().click();
  await page.waitForTimeout(1200);

  await page.screenshot({ path: 'test-artifacts/screenshots/04_melnikov_icu.png' });
  console.log('Saved 04_melnikov_icu.png');

  const pageText = await page.locator('body').innerText();
  console.log('Is in ICU session:', pageText.includes('Мельников') && (pageText.includes('ЧСС') || pageText.includes('SpO')));

  await browser.close();
}

main().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
