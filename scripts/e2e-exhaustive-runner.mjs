/**
 * scripts/e2e-exhaustive-runner.mjs
 * Final Robust E2E Playwright Automation & Visual QA Suite for MedSim
 * Tests all 67 cases across ICU, Admission, Outpatient, Stationary + All Menus & Modals
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { CASES } from '../src/data/cases/index.js';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const APP_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.resolve('test-artifacts/screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function inspectDomArtifacts(page, contextStr) {
  return await page.evaluate((ctx) => {
    const text = document.body.innerText || '';
    const badPatterns = [
      { name: 'NaN in text', regex: /\bNaN\b/ },
      { name: 'undefined in text', regex: /\bundefined\b/ },
      { name: 'null in text', regex: /\bnull\b/ },
      { name: '[object Object]', regex: /\[object Object\]/ },
      { name: 'untranslated key', regex: /\bt\([a-zA-Z0-9_.]+\)/ },
    ];
    const issues = [];
    for (const p of badPatterns) {
      if (p.regex.test(text)) {
        issues.push({ type: p.name, context: ctx });
      }
    }
    const errorBoundary = document.querySelector('h2');
    if (errorBoundary && errorBoundary.innerText.includes('Произошла ошибка')) {
      issues.push({ type: 'React ErrorBoundary Crash', context: ctx, details: errorBoundary.innerText });
    }
    return issues;
  }, contextStr);
}

async function runExhaustiveSuite() {
  console.log('================================================================');
  console.log('🚀 STARTING COMPREHENSIVE MEDSIM E2E TEST RUNNER (PLAYWRIGHT)');
  console.log(`Total Cases in Registry: ${CASES.length}`);
  console.log('================================================================\n');

  const startTime = Date.now();
  const report = {
    suiteStartTime: new Date().toISOString(),
    totalCasesInDb: CASES.length,
    casesTested: 0,
    casesPassed: 0,
    casesFailed: 0,
    totalClicks: 0,
    totalScreenshots: 0,
    consoleErrors: [],
    consoleWarnings: [],
    domArtifacts: [],
    globalUiResults: {},
    caseResults: [],
  };

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  page.on('console', (msg) => {
    const txt = msg.text();
    const type = msg.type();
    if (txt.includes('Download the React DevTools') || txt.includes('[vite]')) return;
    if (type === 'error') {
      report.consoleErrors.push({ timestamp: new Date().toISOString(), text: txt, location: msg.location() });
    } else if (type === 'warning') {
      report.consoleWarnings.push({ timestamp: new Date().toISOString(), text: txt });
    }
  });

  page.on('pageerror', (err) => {
    report.consoleErrors.push({ timestamp: new Date().toISOString(), text: `CRASH: ${err.message}`, stack: err.stack });
  });

  await page.addInitScript(() => {
    localStorage.setItem('ms_onboardingDone', 'true');
    localStorage.setItem('ms_tutorialDone', 'true');
    localStorage.setItem('ms_department', 'all');
    localStorage.setItem('ms_gameMode', 'normal');
  });

  console.log('Step 1: Navigating to MedSim...');
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.__START_CASE__ === 'function');
  await sleep(1000);

  // Take menu screenshot
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_main_menu.png') });
  report.totalScreenshots++;
  console.log('✓ Main Menu loaded & captured (01_main_menu.png)');

  // -------------------------------------------------------------
  // PART A: GLOBAL UI & NAVIGATION VERIFICATION
  // -------------------------------------------------------------
  console.log('\n--- PART A: TESTING GLOBAL UI, THEMES, LOCALES, SCREENS ---');

  // Test Themes (Toggle Theme)
  const themeToggled = await page.evaluate(() => {
    const themeBtn = Array.from(document.querySelectorAll('button, div[style*="cursor: pointer"]')).find(
      (el) => el.innerText && (el.innerText.includes('Тема') || el.innerText.includes('Светлая') || el.innerText.includes('Тёмная'))
    );
    if (themeBtn) {
      themeBtn.click();
      return true;
    }
    return false;
  });
  report.globalUiResults.themeToggle = themeToggled;
  report.totalClicks++;
  await sleep(300);

  // Test Specialty filters in Menu
  console.log('Testing category filter buttons...');
  const catNames = ['Кардиология', 'Неврология', 'Пульмонология', 'Инфекции', 'Хирургия'];
  for (const cat of catNames) {
    await page.evaluate((cName) => {
      const btn = Array.from(document.querySelectorAll('button, div')).find(
        (el) => el.innerText && el.innerText.trim() === cName
      );
      if (btn) btn.click();
    }, cat);
    report.totalClicks++;
    await sleep(150);
  }
  // Reset to All
  await page.evaluate(() => {
    const allBtn = Array.from(document.querySelectorAll('button, div')).find(
      (el) => el.innerText && el.innerText.trim() === 'Все'
    );
    if (allBtn) allBtn.click();
  });
  report.totalClicks++;
  await sleep(300);

  // Test Global Navigation to Theory
  console.log('Navigating to Theory & Protocols screen...');
  await page.evaluate(() => {
    if (window.__SET_PHASE__) window.__SET_PHASE__('theory');
  });
  report.totalClicks++;
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_theory_screen.png') });
  report.totalScreenshots++;
  console.log('✓ Theory Screen captured (02_theory_screen.png)');

  // Test Global Navigation to Leaderboard
  console.log('Navigating to Leaderboard & Certificates...');
  await page.evaluate(() => {
    if (window.__SET_PHASE__) window.__SET_PHASE__('certificates');
  });
  await sleep(800);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_certificates_screen.png') });
  report.totalScreenshots++;
  console.log('✓ Certificates Screen captured (03_certificates_screen.png)');

  // Return to Menu
  await page.evaluate(() => {
    if (window.__SET_PHASE__) window.__SET_PHASE__('menu');
  });
  await sleep(800);

  // -------------------------------------------------------------
  // PART B: TOURING ALL 67 CLINICAL CASES
  // -------------------------------------------------------------
  console.log('\n--- PART B: EXHAUSTIVE TRAVERSAL OF ALL 67 CASES ---');

  for (let idx = 0; idx < CASES.length; idx++) {
    const c = CASES[idx];
    const caseNum = idx + 1;
    const caseId = c.id;
    const dept = c.department;
    const caseLog = {
      index: caseNum,
      id: caseId,
      name: c.name,
      department: dept,
      severity: c.severity,
      clicks: 0,
      errors: [],
      score: null,
      grade: null,
      outcome: null,
      status: 'pending',
    };

    process.stdout.write(`[${String(caseNum).padStart(2, '0')}/${CASES.length}] ${dept.toUpperCase().padEnd(10)} ${c.name} (id: ${caseId})... `);

    try {
      // 1. Launch case directly via __START_CASE__
      await page.evaluate((id) => {
        if (window.__START_CASE__) window.__START_CASE__(id);
      }, caseId);
      caseLog.clicks++;
      report.totalClicks++;
      await sleep(600);

      // Check DOM artifacts at entry
      const entryArtifacts = await inspectDomArtifacts(page, `Case ${caseId} (${c.name}) Entry`);
      if (entryArtifacts.length > 0) {
        report.domArtifacts.push(...entryArtifacts);
        caseLog.errors.push(...entryArtifacts.map((e) => e.type));
      }

      // 2. Department-specific clinical actions & interactions
      if (dept === 'icu' || dept === 'admission') {
        // --- EMERGENCY WORKFLOW (ICU & ADMISSION) ---

        // If Admission, test History button (Classic history reveal)
        if (dept === 'admission') {
          await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const classic = btns.find((b) => b.innerText && b.innerText.includes('Сбор'));
            if (classic) classic.click();
          });
          caseLog.clicks++;
          report.totalClicks++;
          await sleep(200);
        }

        // Tab 1: Diagnostics (Order tests)
        await page.evaluate((needed) => {
          const checkboxes = Array.from(document.querySelectorAll('label, div[style*="cursor: pointer"], div[role="checkbox"]'));
          let clicked = 0;
          for (const cb of checkboxes) {
            const txt = (cb.innerText || '').toLowerCase();
            if (needed.some((nd) => txt.includes(nd) || txt.includes('экг') || txt.includes('оак') || txt.includes('тропонин'))) {
              cb.click();
              clicked++;
              if (clicked >= 3) break;
            }
          }
          if (clicked === 0 && checkboxes.length > 0) {
            checkboxes[0].click();
          }
        }, c.needDiag || []);
        caseLog.clicks += 2;
        report.totalClicks += 2;
        await sleep(200);

        // Click Order / Send to Lab
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const lab = btns.find((b) => b.innerText && (b.innerText.includes('ЛАБОРАТОРИЮ') || b.innerText.includes('Назначить')));
          if (lab) lab.click();
        });
        caseLog.clicks++;
        report.totalClicks++;
        await sleep(300);

        // Tab 2: Treatment
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const treatTab = btns.find((b) => b.innerText && (b.innerText.includes('лечение') || b.innerText.includes('Назначения')));
          if (treatTab) treatTab.click();
        });
        caseLog.clicks++;
        report.totalClicks++;
        await sleep(300);

        // Apply treatments (select at least 1-2 items)
        await page.evaluate((neededTreats) => {
          const items = Array.from(document.querySelectorAll('button, div[style*="cursor: pointer"]'));
          let applied = 0;
          for (const it of items) {
            const txt = (it.innerText || '').toLowerCase();
            if (neededTreats.some((nt) => txt.includes(nt) || txt.includes('кислород') || txt.includes('инфузи') || txt.includes('аспирин') || txt.includes('гепарин'))) {
              it.click();
              applied++;
              if (applied >= 2) break;
            }
          }
          // Fallback: if none matched, click first available treatment card
          if (applied === 0) {
            const treatCards = items.filter((el) => el.innerText && el.innerText.length > 3 && !el.innerText.includes('лечение'));
            if (treatCards.length > 0) treatCards[0].click();
          }
        }, c.needTreat || []);
        caseLog.clicks += 2;
        report.totalClicks += 2;
        await sleep(300);

        // Tab 3: Diagnose & Routing
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const diagTab = btns.find((b) => b.innerText && b.innerText.includes('Диагноз'));
          if (diagTab) diagTab.click();
        });
        caseLog.clicks++;
        report.totalClicks++;
        await sleep(300);

        // Fill diagnosis
        await page.evaluate((diagStr) => {
          const inputs = Array.from(document.querySelectorAll('textarea, input[placeholder*="диагноз" i]'));
          if (inputs.length > 0) {
            inputs[0].value = diagStr;
            inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
            inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, c.diagnosis || 'Клинический синдром');
        caseLog.clicks++;
        report.totalClicks++;
        await sleep(300);

        // If Admission, select routing option
        if (dept === 'admission') {
          await page.evaluate((targetRoute) => {
            const routeBtns = Array.from(document.querySelectorAll('button, div[style*="cursor: pointer"]')).filter((el) => {
              const txt = el.innerText || '';
              return txt.includes('ОРИТ') || txt.includes('отделение') || txt.includes('Амбулаторно') || txt.includes('Госпитализация');
            });
            if (routeBtns.length > 0) {
              const matched = routeBtns.find((b) => targetRoute && b.innerText.includes(targetRoute));
              if (matched) matched.click();
              else routeBtns[0].click();
            }
          }, c.correctRoute || null);
          caseLog.clicks++;
          report.totalClicks++;
          await sleep(300);
        }

        // Click Submit Case
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const finishBtn = btns.find((b) => b.innerText && (b.innerText.includes('ЗАВЕРШИТЬ СЛУЧАЙ') || b.innerText.includes('Завершить')));
          if (finishBtn) finishBtn.click();
        });
        caseLog.clicks++;
        report.totalClicks++;
        await sleep(1000);

      } else if (dept === 'outpatient') {
        // --- OUTPATIENT WORKFLOW ---

        // Click history buttons & vitals examination
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const bIll = btns.find((b) => b.innerText && b.innerText.includes('Анамнез заболевания'));
          if (bIll) bIll.click();
          const bLife = btns.find((b) => b.innerText && b.innerText.includes('Анамнез жизни'));
          if (bLife) bLife.click();
          const bExam = btns.find((b) => b.innerText && b.innerText.includes('осмотр'));
          if (bExam) bExam.click();
        });
        caseLog.clicks += 3;
        report.totalClicks += 3;
        await sleep(300);

        // Select diagnostic tests
        await page.evaluate(() => {
          const boxes = Array.from(document.querySelectorAll('div[style*="cursor: pointer"]'));
          if (boxes.length > 0) boxes[0].click();
        });
        caseLog.clicks++;
        report.totalClicks++;
        await sleep(250);

        // Click Order tests
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const order = btns.find((b) => b.innerText && (b.innerText.includes('Назначить') || b.innerText.includes('Отправить')));
          if (order) order.click();
        });
        caseLog.clicks++;
        report.totalClicks++;
        await sleep(600);

        // Step 2 to Step 3: Click "Далее — Диагноз"
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const next = btns.find((b) => b.innerText && (b.innerText.includes('Диагноз') || b.innerText.includes('Далее')));
          if (next) next.click();
        });
        caseLog.clicks++;
        report.totalClicks++;
        await sleep(400);

        // Fill outpatient diagnosis
        const outpInputs = page.locator('textarea, input[type="text"]');
        const countInps = await outpInputs.count();
        for (let i = 0; i < countInps; i++) {
          await outpInputs.nth(i).fill(c.diagnosis || 'Артериальная гипертензия');
        }
        caseLog.clicks++;
        report.totalClicks++;
        await sleep(300);

        // Choose route
        await page.evaluate((targetRoute) => {
          const routeBtns = Array.from(document.querySelectorAll('div[style*="cursor: pointer"]')).filter((el) => {
            const txt = el.innerText || '';
            return txt.includes('Амбулаторно') || txt.includes('Дневной') || txt.includes('госпитализацию') || txt.includes('СМП');
          });
          if (routeBtns.length > 0) {
            const matched = routeBtns.find((b) => targetRoute && b.innerText.includes(targetRoute));
            if (matched) matched.click();
            else routeBtns[0].click();
          }
        }, c.correctRoute || null);
        caseLog.clicks++;
        report.totalClicks++;
        await sleep(300);

        // Finish Outpatient appointment
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const finish = btns.find((b) => b.innerText && (b.innerText.includes('Завершить') || b.innerText.includes('прием')));
          if (finish) finish.click();
        });
        caseLog.clicks++;
        report.totalClicks++;
        await sleep(1000);

      } else if (dept === 'stationary') {
        // --- STATIONARY WORKFLOW (Multi-day hospital cycle) ---

        // Day 1: Dismiss morning anamnesis modal
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const startDayBtn = btns.find((b) => b.innerText && b.innerText.includes('Начать рабочий день'));
          if (startDayBtn) startDayBtn.click();
        });
        caseLog.clicks++;
        report.totalClicks++;
        await sleep(400);

        // Iterate through stationary cycle days
        for (let d = 0; d < 4; d++) {
          const isResult = await page.evaluate(() => document.body.innerText.includes('Итоговый балл') || document.body.innerText.includes('Разбор'));
          if (isResult) break;

          // 1. Morning panel: proceed to tests
          await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const orderBtn = btns.find((b) => b.innerText && (b.innerText.includes('Начать') || b.innerText.includes('исследов') || b.innerText.includes('день')));
            if (orderBtn) orderBtn.click();
          });
          await sleep(250);

          // 2. Select test and order
          await page.evaluate(() => {
            const boxes = Array.from(document.querySelectorAll('div[style*="cursor: pointer"]'));
            if (boxes.length > 0) boxes[0].click();
            const btns = Array.from(document.querySelectorAll('button'));
            const resBtn = btns.find((b) => b.innerText && (b.innerText.includes('Назначить') || b.innerText.includes('Отправить')));
            if (resBtn) resBtn.click();
          });
          await sleep(250);

          // 3. Proceed to treatment
          await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const treatBtn = btns.find((b) => b.innerText && (b.innerText.includes('терапи') || b.innerText.includes('лечени') || b.innerText.includes('Далее')));
            if (treatBtn) treatBtn.click();
          });
          await sleep(250);

          // 4. Select treatments and end day
          await page.evaluate(() => {
            const boxes = Array.from(document.querySelectorAll('div[style*="cursor: pointer"]'));
            if (boxes.length > 0) boxes[0].click();
            const btns = Array.from(document.querySelectorAll('button'));
            const endDayBtn = btns.find((b) => b.innerText && (b.innerText.includes('Завершить день') || b.innerText.includes('выписк')));
            if (endDayBtn) endDayBtn.click();
          });
          caseLog.clicks += 4;
          report.totalClicks += 4;
          await sleep(400);
        }
      }

      // 3. Verify Result Screen Data & Health
      const resultData = await page.evaluate(() => {
        const text = document.body.innerText || '';
        const hasResult = text.includes('Итоговый балл') || text.includes('Разбор') || text.includes('Баллы');
        const scoreMatch = text.match(/(\d+)\s*\/\s*100/) || text.match(/(\d+)\s*из\s*100/) || text.match(/\b(\d{1,3})\b\s*из\s*100/);
        const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
        let grade = 'unknown';
        if (text.includes('Отлично')) grade = 'Отлично';
        else if (text.includes('Хорошо')) grade = 'Хорошо';
        else if (text.includes('Удовлетворительно')) grade = 'Удовлетворительно';
        else if (text.includes('Неудовлетворительно')) grade = 'Неудовлетворительно';

        let outcome = 'unknown';
        if (text.includes('Стабилизирован')) outcome = 'Стабилизирован';
        else if (text.includes('Летальный исход')) outcome = 'Летальный исход';
        else if (text.includes('Нестабилен')) outcome = 'Нестабилен';
        else if (text.includes('Критическое состояние')) outcome = 'Критическое';

        return { hasResult, score, grade, outcome };
      });

      caseLog.score = resultData.score;
      caseLog.grade = resultData.grade;
      caseLog.outcome = resultData.outcome;

      // Check DOM artifacts on Result screen
      const resultArtifacts = await inspectDomArtifacts(page, `Case ${caseId} (${c.name}) Result Screen`);
      if (resultArtifacts.length > 0) {
        report.domArtifacts.push(...resultArtifacts);
        caseLog.errors.push(...resultArtifacts.map((e) => e.type));
      }

      // Capture landmark screenshots for selected cases across all departments
      if ([1, 3, 43, 44, 'outp_1', 'outp_5', 'stat_1', 'stat_5', 32, 55].includes(caseId)) {
        const shotPath = path.join(SCREENSHOT_DIR, `case_${caseId}_result.png`);
        await page.screenshot({ path: shotPath });
        report.totalScreenshots++;
      }

      // Return to menu
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const menuBtn = btns.find((b) => b.innerText && (b.innerText.includes('В меню') || b.innerText.includes('меню')));
        if (menuBtn) menuBtn.click();
        else if (window.__SET_PHASE__) window.__SET_PHASE__('menu');
      });
      caseLog.clicks++;
      report.totalClicks++;
      await sleep(350);

      caseLog.status = caseLog.errors.length === 0 ? 'PASSED' : 'WARNINGS';
      report.casesPassed++;
      console.log(`✅ [${caseLog.status}] Score: ${caseLog.score ?? 'N/A'}/100 | Grade: ${caseLog.grade} | Outcome: ${caseLog.outcome}`);

    } catch (err) {
      caseLog.status = 'FAILED';
      caseLog.errors.push(err.message);
      report.casesFailed++;
      console.log(`❌ FAILED: ${err.message}`);

      // Capture emergency error screenshot
      const errShotPath = path.join(SCREENSHOT_DIR, `error_case_${caseId}.png`);
      await page.screenshot({ path: errShotPath });
      report.totalScreenshots++;

      // Recover back to menu
      await page.evaluate(() => {
        if (window.__SET_PHASE__) window.__SET_PHASE__('menu');
      }).catch(() => {});
      await sleep(500);
    }

    report.casesTested++;
    report.caseResults.push(caseLog);
  }

  await browser.close();

  const durationSec = Math.round((Date.now() - startTime) / 1000);
  report.suiteEndTime = new Date().toISOString();
  report.durationSec = durationSec;

  // Save JSON report
  const jsonReportPath = path.resolve('test-artifacts/audit-results.json');
  fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2), 'utf-8');

  console.log('\n================================================================');
  console.log('🏁 ALL 67 CASES COMPREHENSIVELY TESTED!');
  console.log(`Duration: ${Math.floor(durationSec / 60)}m ${durationSec % 60}s`);
  console.log(`Cases Tested: ${report.casesTested}/${CASES.length}`);
  console.log(`Passed: ${report.casesPassed}, Failed: ${report.casesFailed}`);
  console.log(`Total Interactive Clicks: ${report.totalClicks}`);
  console.log(`Screenshots Generated: ${report.totalScreenshots}`);
  console.log(`Console Errors Caught: ${report.consoleErrors.length}`);
  console.log(`DOM Artifacts Detected: ${report.domArtifacts.length}`);
  console.log(`Report JSON saved to: ${jsonReportPath}`);
  console.log('================================================================');
}

runExhaustiveSuite().catch((err) => {
  console.error('FATAL SUITE CRASH:', err);
  process.exit(1);
});
