import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER CONSOLE ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('BROWSER PAGE ERROR:', err.message);
  });

  await page.addInitScript(() => {
    localStorage.setItem('ms_onboardingDone', 'true');
    localStorage.setItem('ms_tutorialDone', 'true');
  });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const title = await page.title();
  console.log('Page Title:', title);

  const caseCards = await page.$$('.case-card');
  console.log('Rendered .case-card count:', caseCards.length);

  await page.screenshot({ path: 'test-artifacts/screenshots/01_menu_probe.png' });
  console.log('Saved screenshot 01_menu_probe.png');

  await browser.close();
}

main().catch(err => {
  console.error('PROBE ERROR:', err);
  process.exit(1);
});
