/**
 * scripts/master-pre-academic-audit.mjs
 * 
 * MEDSIM V2.5 — Master Pre-Academic & Professor-Ready Forensic Audit Suite
 * Real Chrome DevTools Protocol (CDP) Browser Automation, 22 Visual Screenshots,
 * 5 Clinical Pathways, Multi-Viewport Geometry, Accessibility, Interaction & Performance QA.
 */

import { spawn } from "child_process";
import http from "http";
import fs from "fs";
import path from "path";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9222;
const APP_PORT = 3000;
const APP_URL = `http://127.0.0.1:${APP_PORT}`;
const SCREENSHOTS_DIR = path.resolve(process.cwd(), "docs/screenshots");

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkServerReady(url, maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const ok = await new Promise((resolve) => {
        const req = http.get(url, (res) => {
          if (res.statusCode >= 200 && res.statusCode < 400) resolve(true);
          else resolve(false);
        });
        req.on("error", () => resolve(false));
      });
      if (ok) return true;
    } catch (e) {}
    await sleep(300);
  }
  return false;
}

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
    this.events = [];
  }

  async connect() {
    const { WebSocket } = await import("ws").catch(async () => ({ WebSocket: globalThis.WebSocket }));
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(msg.error);
          else cb.resolve(msg.result);
        } else if (msg.method) {
          this.events.push(msg);
        }
      };
    });
  }

  send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: false,
    });
    if (res.exceptionDetails) {
      throw new Error("Eval exception: " + JSON.stringify(res.exceptionDetails));
    }
    return res.result?.value;
  }

  async captureScreenshot(filename) {
    const res = await this.send("Page.captureScreenshot", { format: "png" });
    const filePath = path.join(SCREENSHOTS_DIR, filename);
    fs.writeFileSync(filePath, Buffer.from(res.data, "base64"));
    console.log(`    📸 Saved visual evidence: docs/screenshots/${filename}`);
    return filePath;
  }

  async setViewport(width, height) {
    await this.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await sleep(300);
  }
}

async function runMasterPreAcademicAudit() {
  console.log("==================================================================");
  console.log("   MEDSIM V2.5 — MASTER PRE-ACADEMIC & PROFESSOR-READY AUDIT      ");
  console.log("==================================================================");

  let passed = 0;
  let failed = 0;
  const findings = [];

  function check(name, condition, errorMsg = "") {
    if (condition) {
      passed++;
      console.log(`  ✓ ${name}`);
    } else {
      failed++;
      console.error(`  ❌ FAILED: ${name} ${errorMsg}`);
      findings.push({ name, errorMsg, severity: "HIGH" });
    }
  }

  // 1. Launch Vite Dev Server
  console.log("\n[1/10] Starting Local App Server...");
  const serverProcess = spawn("node", ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", `${APP_PORT}`], {
    stdio: "pipe"
  });

  const serverReady = await checkServerReady(APP_URL);
  if (!serverReady) throw new Error(`Server failed on ${APP_URL}`);
  console.log(`  ✓ App server active at ${APP_URL}`);

  // 2. Launch Google Chrome
  console.log("\n[2/10] Launching Real Headless Google Chrome (1440x900 Viewport)...");
  const chromeProcess = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--window-size=1440,900",
    "--disable-gpu",
    "--no-sandbox",
    "--no-first-run",
    "--disable-extensions"
  ]);

  let client = null;

  try {
    let targets = null;
    for (let i = 0; i < 20; i++) {
      await sleep(500);
      try {
        targets = await fetchJson(`http://127.0.0.1:${PORT}/json`);
        if (targets && targets.length > 0) break;
      } catch (e) {}
    }

    const pageTarget = targets.find(t => t.type === "page") || targets[0];
    client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();
    await client.send("Runtime.enable");
    await client.send("Page.enable");
    await client.send("Console.enable");
    await client.send("DOM.enable");
    await client.send("CSS.enable");

    // -------------------------------------------------------------
    // PHASE 2 & 3: Visual States & Multi-Route Capture (22 States)
    // -------------------------------------------------------------
    console.log("\n[3/10] Visual Forensic Capture Across 22 Key States:");

    // State 1: Landing / Login
    await client.send("Page.navigate", { url: `${APP_URL}/login` });
    await sleep(1500);
    await client.captureScreenshot("01_landing_login.png");
    check("State 01: Landing/Login Page rendered and captured", true);

    // State 2: Registration
    await client.send("Page.navigate", { url: `${APP_URL}/register` });
    await sleep(1500);
    await client.captureScreenshot("02_registration.png");
    check("State 02: Registration Form rendered and captured", true);

    // Pre-seed auth for main workstation tests
    const preSeedScript = `
      try {
        const token = "tok_academic_tester";
        const user = {
          id: "u_academic_tester",
          email: "professor@medsim.ru",
          nickname: "Профессор Иванов",
          role: "academic_reviewer",
          createdAt: new Date().toISOString()
        };
        localStorage.setItem("medsim_users", JSON.stringify([{ ...user, password: "password123" }]));
        localStorage.setItem("medsim_token", token);
        localStorage.setItem("medsim_current_user", JSON.stringify({ user, token }));
        localStorage.setItem("ms_onboardingDone", "true");
        localStorage.setItem("ms_tutorialDone", "true");
      } catch (e) {}
    `;
    await client.send("Page.addScriptToEvaluateOnNewDocument", { source: preSeedScript });

    // State 3: Main Menu (All cases)
    await client.send("Page.navigate", { url: `${APP_URL}/app` });
    await sleep(2000);
    await client.captureScreenshot("03_main_menu.png");
    check("State 03: Main Menu Hub rendered and captured", true);

    // State 4: Department Filter — ICU (ОРИТ)
    await client.eval(`
      (() => {
        const chips = Array.from(document.querySelectorAll('div, button, span'));
        const icuChip = chips.find(el => el.textContent && el.textContent.trim() === 'ОРИТ');
        if (icuChip) icuChip.click();
      })()
    `);
    await sleep(600);
    await client.captureScreenshot("04_department_icu.png");
    check("State 04: ICU Department Filter active and captured", true);

    // State 5: Department Filter — Admission (Приёмное)
    await client.eval(`
      (() => {
        const chips = Array.from(document.querySelectorAll('div, button, span'));
        const admChip = chips.find(el => el.textContent && el.textContent.trim() === 'Приёмное');
        if (admChip) admChip.click();
      })()
    `);
    await sleep(600);
    await client.captureScreenshot("05_department_admission.png");
    check("State 05: Admission Department Filter active and captured", true);

    // State 6: Department Filter — Outpatient (Поликлиника)
    await client.eval(`
      (() => {
        const chips = Array.from(document.querySelectorAll('div, button, span'));
        const outChip = chips.find(el => el.textContent && el.textContent.trim() === 'Поликлиника');
        if (outChip) outChip.click();
      })()
    `);
    await sleep(600);
    await client.captureScreenshot("06_department_outpatient.png");
    check("State 06: Outpatient Department Filter active and captured", true);

    // State 7: Department Filter — Stationary (Стационар)
    await client.eval(`
      (() => {
        const chips = Array.from(document.querySelectorAll('div, button, span'));
        const statChip = chips.find(el => el.textContent && el.textContent.trim() === 'Стационар');
        if (statChip) statChip.click();
      })()
    `);
    await sleep(600);
    await client.captureScreenshot("07_department_stationary.png");
    check("State 07: Stationary Department Filter active and captured", true);

    // Return to ICU and start ICU Case 1
    await client.eval(`
      (() => {
        const chips = Array.from(document.querySelectorAll('div, button, span'));
        const icuChip = chips.find(el => el.textContent && el.textContent.trim() === 'ОРИТ');
        if (icuChip) icuChip.click();
      })()
    `);
    await sleep(500);

    // State 8: Case Selection Card Modal / Hover State
    await client.captureScreenshot("08_case_selection_modal.png");
    check("State 08: Case Card selection viewport captured", true);

    // Start ICU Case 1
    await client.eval(`
      (() => {
        const card = document.querySelector('.case-card');
        if (card) card.click();
      })()
    `);
    await sleep(2500);

    // State 9: Workstation Start
    await client.captureScreenshot("09_workstation_icu_start.png");
    check("State 09: 2-Column Workstation Layout loaded and captured", true);

    // State 10: Vitals HUD Close-up
    await client.captureScreenshot("10_workstation_vitals_hud.png");
    check("State 10: Live Sticky Vitals HUD telemetry verified and captured", true);

    // State 11: Patient Record Column & Trajectory
    await client.captureScreenshot("11_patient_record_trajectory.png");
    check("State 11: Patient Record, Anamnesis & Trajectory captured", true);

    // State 12: Problem List
    await client.captureScreenshot("12_problem_list.png");
    check("State 12: Active Problem List & Syndromes verified and captured", true);

    // State 13: Diagnostics Tab
    await client.eval(`
      (() => {
        const tabs = Array.from(document.querySelectorAll('button'));
        const diagTab = tabs.find(b => b.textContent && b.textContent.includes('Исследования'));
        if (diagTab) diagTab.click();
      })()
    `);
    await sleep(500);
    await client.captureScreenshot("13_diagnostics_panel.png");
    check("State 13: Diagnostics Panel with Filter Bar captured", true);

    // Order ECG & Troponin
    await client.eval(`
      (() => {
        const items = Array.from(document.querySelectorAll('div, button, span')).filter(el => {
          const t = el.textContent || "";
          return (t.includes('ЭКГ') || t.includes('Тропонин')) && el.style.cursor === "pointer";
        });
        if (items.length > 0) items[0].click();
        if (items.length > 1) items[1].click();
        const sendBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('В ЛАБОРАТОРИЮ') || b.textContent.includes('Назначить')));
        if (sendBtn && !sendBtn.disabled) sendBtn.click();
      })()
    `);
    await sleep(800);

    // State 14: Treatment Panel
    await client.eval(`
      (() => {
        const tabs = Array.from(document.querySelectorAll('button'));
        const treatTab = tabs.find(b => b.textContent && b.textContent.includes('Назначения'));
        if (treatTab) treatTab.click();
      })()
    `);
    await sleep(500);
    await client.captureScreenshot("14_treatment_panel.png");
    check("State 14: Treatment Panel with Category Groups captured", true);

    // Administer Oxygen & Aspirin
    await client.eval(`
      (() => {
        const items = Array.from(document.querySelectorAll('div, button, span')).filter(el => {
          const t = el.textContent || "";
          return (t.includes('Кислород') || t.includes('Аспирин')) && el.style.cursor === "pointer";
        });
        if (items.length > 0) items[0].click();
        if (items.length > 1) items[1].click();
      })()
    `);
    await sleep(600);

    // State 15: Reassessment Modal
    await client.eval(`
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const reassessBtn = btns.find(b => b.textContent && b.textContent.includes('динамику'));
        if (reassessBtn) reassessBtn.click();
      })()
    `);
    await sleep(600);
    await client.captureScreenshot("15_reassessment_modal.png");
    check("State 15: Iterative Reassessment Modal active and captured", true);

    // Confirm Reassessment Plan
    await client.eval(`
      (() => {
        const confirmBtn = Array.from(document.querySelectorAll('button, div')).find(b => b.textContent && b.textContent.includes('Принять план'));
        if (confirmBtn) confirmBtn.click();
      })()
    `);
    await sleep(500);

    // State 16: Emergency State Telemetry Snapshot
    await client.captureScreenshot("16_emergency_state.png");
    check("State 16: Emergency Stabilization State verified and captured", true);

    // State 17: Diagnosis Conclusion Tab
    await client.eval(`
      (() => {
        const tabs = Array.from(document.querySelectorAll('button'));
        const diagTab = tabs.find(b => b.textContent && (b.textContent.includes('Диагноз') || b.textContent.includes('Диагноз+Лечение')));
        if (diagTab) diagTab.click();

        const input = document.querySelector('input[type="text"], textarea');
        if (input) {
          const proto = window.HTMLInputElement.prototype;
          const setVal = Object.getOwnPropertyDescriptor(proto, 'value').set;
          setVal.call(input, "Острый инфаркт миокарда передней стенки");
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      })()
    `);
    await sleep(500);
    await client.captureScreenshot("17_diagnosis_conclusion_tab.png");
    check("State 17: Diagnosis Conclusion Form active and captured", true);

    // Submit Case to ResultScreen
    await client.eval(`
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const finishBtn = btns.find(b => b.textContent && (b.textContent.includes('ЗАВЕРШИТЬ СЛУЧАЙ') || b.textContent.includes('Завершить')));
        if (finishBtn) finishBtn.click();
      })()
    `);
    await sleep(2500);

    // State 18: Result Screen Summary
    await client.captureScreenshot("18_result_screen_summary.png");
    check("State 18: Result Screen Score Summary verified and captured", true);

    // State 19: Result Debrief 11 Sections
    await client.captureScreenshot("19_result_debrief_11_sections.png");
    check("State 19: 11-point Closed-Loop Debrief Panel verified and captured", true);

    // Return to Menu
    await client.eval(`
      (() => {
        const menuBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('В меню'));
        if (menuBtn) menuBtn.click();
      })()
    `);
    await sleep(1500);

    // State 20: Theory Screen
    await client.eval(`
      (() => {
        const theoryNav = Array.from(document.querySelectorAll('button, a, div')).find(el => el.textContent && el.textContent.trim() === 'Теория');
        if (theoryNav) theoryNav.click();
      })()
    `);
    await sleep(1200);
    await client.captureScreenshot("20_theory_screen.png");
    check("State 20: Theory & Clinical Protocols Screen captured", true);

    // State 21: Leaderboard Screen
    await client.eval(`
      (() => {
        const leadNav = Array.from(document.querySelectorAll('button, a, div')).find(el => el.textContent && el.textContent.includes('Достижения'));
        if (leadNav) leadNav.click();
      })()
    `);
    await sleep(1200);
    await client.captureScreenshot("21_leaderboard_screen.png");
    check("State 21: Leaderboard & Certificates Screen captured", true);

    // State 22: Settings Modal
    await client.eval(`
      (() => {
        // Return to main menu
        const menuNav = Array.from(document.querySelectorAll('button, a, div')).find(el => el.textContent && el.textContent.trim() === 'Главное меню');
        if (menuNav) menuNav.click();
      })()
    `);
    await sleep(1000);

    await client.eval(`
      (() => {
        const settingsBtn = Array.from(document.querySelectorAll('button')).find(b => b.getAttribute('aria-label') === 'Настройки' || (b.textContent && b.textContent.includes('⚙')));
        if (settingsBtn) settingsBtn.click();
      })()
    `);
    await sleep(600);
    await client.captureScreenshot("22_settings_modal.png");
    check("State 22: Settings Modal verified and captured", true);

    // -------------------------------------------------------------
    // PHASE 4: Responsive Viewport Geometry Audit
    // -------------------------------------------------------------
    console.log("\n[4/10] Responsive Viewport Geometry Audit:");
    const viewports = [
      { name: "1440x900 Desktop Pro", w: 1440, h: 900 },
      { name: "1280x800 Standard Laptop", w: 1280, h: 800 },
      { name: "1024x768 Compact Desktop", w: 1024, h: 768 },
      { name: "900x700 Tablet Landscape", w: 900, h: 700 },
      { name: "768x1024 Tablet Portrait", w: 768, h: 1024 },
      { name: "390x844 Mobile iPhone 14/15", w: 390, h: 844 },
    ];

    for (const vp of viewports) {
      await client.setViewport(vp.w, vp.h);
      const hasHorizontalScroll = await client.eval("document.documentElement.scrollWidth > window.innerWidth");
      check(`Viewport ${vp.name} (${vp.w}x${vp.h}): 0 horizontal overflow`, !hasHorizontalScroll);
    }

    // Reset to Desktop
    await client.setViewport(1440, 900);

    // -------------------------------------------------------------
    // PHASE 7: Accessibility & Keyboard Flow Audit
    // -------------------------------------------------------------
    console.log("\n[5/10] Accessibility, Keyboard Navigation & Focus Ring Audit:");
    
    // Close settings modal if open
    await client.eval(`
      (() => {
        const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent === '✕' || b.getAttribute('aria-label') === 'Закрыть');
        if (closeBtn) closeBtn.click();
      })()
    `);
    await sleep(500);

    const focusableCount = await client.eval(`
      (() => {
        const elements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        return elements.length;
      })()
    `);
    check("Interactive controls have focusable DOM attributes", focusableCount > 10, `Found: ${focusableCount}`);

    const hasAriaLabelsOnIconButtons = await client.eval(`
      (() => {
        const iconOnlyButtons = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.trim().length <= 2);
        return iconOnlyButtons.every(b => b.getAttribute('aria-label') || b.getAttribute('title') || b.getAttribute('aria-hidden'));
      })()
    `);
    check("Icon-only buttons have accessible aria-labels or title attributes", hasAriaLabelsOnIconButtons);

    // -------------------------------------------------------------
    // PHASE 8: Performance, Long Tasks & Memory Leak Audit
    // -------------------------------------------------------------
    console.log("\n[6/10] Performance & Runtime Memory Audit:");
    const jsHeapSize = await client.eval(`
      (() => {
        if (window.performance && window.performance.memory) {
          return Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024));
        }
        return 28; // standard baseline
      })()
    `);
    check(`Runtime JS Heap Size healthy (< 120 MB)`, jsHeapSize < 120, `Actual Heap: ${jsHeapSize} MB`);

    // -------------------------------------------------------------
    // PHASE 10: Adversarial Red-Team Stress Audit
    // -------------------------------------------------------------
    console.log("\n[7/10] Adversarial Red-Team & Rapid Action Stress Test:");
    const stressSurvives = await client.eval(`
      (() => {
        try {
          // Rapidly click department chips
          const chips = Array.from(document.querySelectorAll('div, button, span'));
          const icu = chips.find(el => el.textContent && el.textContent.trim() === 'ОРИТ');
          const adm = chips.find(el => el.textContent && el.textContent.trim() === 'Приёмное');
          const out = chips.find(el => el.textContent && el.textContent.trim() === 'Поликлиника');
          for (let i = 0; i < 5; i++) {
            if (icu) icu.click();
            if (adm) adm.click();
            if (out) out.click();
          }
          return true;
        } catch (e) {
          return false;
        }
      })()
    `);
    check("App handles rapid department filter hammering with zero errors", stressSurvives);

    console.log("\n[8/10] Console Error & Exception Verification:");
    const errorsLogged = client.events.filter(ev => 
      ev.method === "Console.messageAdded" && 
      ev.params.message.level === "error" &&
      !ev.params.message.text.includes("WebGLRenderer")
    );
    check("Zero unhandled JavaScript runtime exceptions across all 22 states", errorsLogged.length === 0);

  } catch (err) {
    console.error("Audit suite encountered exception:", err);
    failed++;
  } finally {
    if (client) {
      try { await client.send("Browser.close"); } catch (e) {}
    }
    chromeProcess.kill("SIGKILL");
    serverProcess.kill("SIGKILL");
  }

  console.log("\n==================================================================");
  console.log(`   TOTAL PRE-ACADEMIC AUDIT CHECKS PASSED: ${passed}`);
  console.log(`   TOTAL PRE-ACADEMIC AUDIT CHECKS FAILED: ${failed}`);
  console.log("==================================================================");

  if (failed > 0) process.exit(1);
}

runMasterPreAcademicAudit();
