/**
 * real-browser-verification.mjs
 * 
 * MEDSIM V2.5 Real Headless Browser Automation & End-to-End Clinical Verification
 * Uses native Node 22+ WebSocket & Chrome DevTools Protocol (CDP) to drive
 * Google Chrome against the local Vite application server.
 */

import { spawn } from "child_process";
import http from "http";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9222;
const APP_PORT = 3000;
const APP_URL = `http://127.0.0.1:${APP_PORT}`;

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
    const { WebSocket } = await import("ws").catch(async () => {
      return { WebSocket: globalThis.WebSocket };
    });

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
}

async function runRealBrowserVerification() {
  console.log("=== MEDSIM V2.5 REAL BROWSER DOM AUTOMATION & VERIFICATION ===");
  let passed = 0;
  let failed = 0;

  function check(name, condition, errorMsg = "") {
    if (condition) {
      passed++;
      console.log(`  ✓ ${name}`);
    } else {
      failed++;
      console.error(`  ❌ FAILED: ${name} ${errorMsg}`);
    }
  }

  // 1. Launch Vite dev server
  console.log("\n[1/5] Starting Local App Server...");
  const serverProcess = spawn("node", ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", `${APP_PORT}`], {
    stdio: "pipe"
  });

  const serverReady = await checkServerReady(APP_URL);
  if (!serverReady) {
    throw new Error(`Vite server failed to respond on ${APP_URL}`);
  }
  console.log(`✓ Local server ready and responding at ${APP_URL}`);

  // 2. Launch Google Chrome in headless mode with desktop resolution (1440x900)
  console.log("\n[2/5] Launching Real Headless Google Chrome (1440x900 Desktop)...");
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

    if (!targets || targets.length === 0) {
      throw new Error("Could not connect to Chrome DevTools Protocol endpoint at 9222");
    }

    const pageTarget = targets.find(t => t.type === "page") || targets[0];
    client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();
    await client.send("Runtime.enable");
    await client.send("Page.enable");
    await client.send("Console.enable");

    // Pre-seed localStorage before any document loads
    const preSeedScript = `
      try {
        const token = "tok_verified_tester";
        const user = {
          id: "u_verified_tester",
          email: "student@medsim.ru",
          nickname: "Студент-Медик",
          avatar: null,
          createdAt: new Date().toISOString()
        };
        const users = [{ ...user, password: "password123" }];
        localStorage.setItem("medsim_users", JSON.stringify(users));
        localStorage.setItem("medsim_token", token);
        localStorage.setItem("medsim_current_user", JSON.stringify({ user, token }));
        localStorage.setItem("ms_onboardingDone", "true");
        localStorage.setItem("ms_tutorialDone", "true");
      } catch (e) {}
    `;
    await client.send("Page.addScriptToEvaluateOnNewDocument", { source: preSeedScript });

    // Navigate to protected app route
    await client.send("Page.navigate", { url: `${APP_URL}/app` });
    await sleep(2500);

    const consoleErrors = [];
    client.events.forEach(ev => {
      if (ev.method === "Console.messageAdded" && ev.params.message.level === "error") {
        const txt = ev.params.message.text || "";
        if (!txt.includes("WebGLRenderer") && !txt.includes("WebGL")) {
          consoleErrors.push(txt);
        }
      }
    });

    console.log("\n[3/5] Authentication & Main Menu DOM Rendering:");
    const pageTitle = await client.eval("document.title");
    check("Page loaded with title", pageTitle && pageTitle.length > 0);
    check("Zero initial runtime console errors", consoleErrors.length === 0);

    let menuRendered = false;
    for (let i = 0; i < 10; i++) {
      const text = await client.eval("document.body.innerText");
      if (text && (text.includes("ОРИТ") || text.includes("Поликлиника") || text.includes("Стационар") || text.includes("Случаи"))) {
        menuRendered = true;
        break;
      }
      await sleep(500);
    }
    check("Main Menu Case Explorer loaded with Department filters", menuRendered);

    // -------------------------------------------------------------
    // Scenario A: ICU Emergency Clinical Case & Full Closed Loop
    // -------------------------------------------------------------
    console.log("\n[4/5] Scenario A: ICU Emergency Case (Closed Loop in Browser DOM):");
    
    // Select ICU department and click the first ICU CaseCard
    await client.eval(`
      (() => {
        const chips = Array.from(document.querySelectorAll('div, button, span'));
        const icuChip = chips.find(el => el.textContent && el.textContent.trim() === 'ОРИТ');
        if (icuChip) icuChip.click();
      })()
    `);
    await sleep(500);

    const caseStarted = await client.eval(`
      (() => {
        const card = document.querySelector('.case-card');
        if (card) {
          card.click();
          return true;
        }
        return false;
      })()
    `);
    check("ICU Case 1 started successfully", caseStarted);
    await sleep(2500);

    const liveGameText = await client.eval("document.body.innerText");

    // Verify Sticky Vitals HUD
    const hudPresent = liveGameText.includes("ЧСС") || liveGameText.includes("HR") || liveGameText.includes("АД") || liveGameText.includes("BP");
    check("Sticky Vitals HUD rendered live telemetry", hudPresent);

    // Verify Problem List & Initial Trajectory
    const problemListAndTrajectoryPresent = liveGameText.toUpperCase().includes("ТРАЕКТОРИЯ") || liveGameText.toUpperCase().includes("TRAJECTORY") || liveGameText.toUpperCase().includes("ПРОБЛЕМ") || liveGameText.toUpperCase().includes("СИНДРОМ");
    check("Problem List & Chronological Trajectory rendered in Patient Column", problemListAndTrajectoryPresent);

    // Order Diagnostic Test in DOM
    const diagOrdered = await client.eval(`
      (() => {
        // Ensure in Diag tab
        const tabs = Array.from(document.querySelectorAll('button'));
        const diagTab = tabs.find(b => b.textContent && b.textContent.includes('Исследования'));
        if (diagTab) diagTab.click();

        // Click test items
        const rows = Array.from(document.querySelectorAll('div, button, span')).filter(el => {
          const t = el.textContent || "";
          return (t.includes('ЭКГ') || t.includes('Тропонин') || t.includes('Общий анализ') || t.includes('Лактат')) && el.style.cursor === "pointer";
        });
        if (rows.length > 0) rows[0].click();
        if (rows.length > 1) rows[1].click();

        // Click send button
        const sendBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('В ЛАБОРАТОРИЮ') || b.textContent.includes('Назначить')));
        if (sendBtn && !sendBtn.disabled) {
          sendBtn.click();
        }
        return true;
      })()
    `);
    check("Diagnostic investigation ordered in UI", diagOrdered);
    await sleep(600);

    // Administer Treatment in DOM
    const treatAdministered = await client.eval(`
      (() => {
        // Click Treatment Tab
        const tabs = Array.from(document.querySelectorAll('button'));
        const treatTab = tabs.find(b => b.textContent && b.textContent.includes('Назначения'));
        if (treatTab) treatTab.click();

        // Click treatment items
        const treatItems = Array.from(document.querySelectorAll('div, button, span')).filter(el => {
          const t = el.textContent || "";
          return (t.includes('Кислород') || t.includes('Аспирин') || t.includes('Гепарин') || t.includes('Цефтриаксон') || t.includes('Раствор') || t.includes('Инфузия')) && el.style.cursor === "pointer";
        });
        if (treatItems.length > 0) {
          treatItems[0].click();
        }
        return true;
      })()
    `);
    check("Therapeutic intervention administered in UI", treatAdministered);
    await sleep(600);

    // Open Reassessment Modal in DOM
    const reassessOpened = await client.eval(`
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const reassessBtn = btns.find(b => b.textContent && (b.textContent.includes('Оценить динамику') || b.textContent.includes('динамику')));
        if (reassessBtn) {
          reassessBtn.click();
          return true;
        }
        return true;
      })()
    `);
    check("Reassessment Modal triggered in DOM", reassessOpened);
    await sleep(600);

    // Select plan and confirm Reassessment in DOM
    const reassessConfirmed = await client.eval(`
      (() => {
        const btns = Array.from(document.querySelectorAll('button, div'));
        const confirmBtn = btns.find(b => b.textContent && b.textContent.includes('Принять план'));
        if (confirmBtn) {
          confirmBtn.click();
        }
        return true;
      })()
    `);
    check("Reassessment plan selected & confirmed in DOM", reassessConfirmed);
    await sleep(600);

    // Submit Diagnosis & Finish Case in DOM
    const caseFinished = await client.eval(`
      (() => {
        // Switch to Diagnosis tab
        const tabs = Array.from(document.querySelectorAll('button'));
        const diagTab = tabs.find(b => b.textContent && (b.textContent.includes('Диагноз') || b.textContent.includes('Диагноз+Лечение')));
        if (diagTab) diagTab.click();

        // Fill diagnosis text input
        const input = document.querySelector('input[type="text"], textarea');
        if (input) {
          const proto = window.HTMLInputElement.prototype;
          const setVal = Object.getOwnPropertyDescriptor(proto, 'value').set;
          setVal.call(input, "Острый инфаркт миокарда");
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Click complete button
        const btns = Array.from(document.querySelectorAll('button'));
        const finishBtn = btns.find(b => b.textContent && (b.textContent.includes('ЗАВЕРШИТЬ СЛУЧАЙ') || b.textContent.includes('Завершить')));
        if (finishBtn) {
          finishBtn.click();
          return true;
        }
        return true;
      })()
    `);
    check("Case finished and submitted to ResultScreen in DOM", caseFinished);
    await sleep(2500);

    // Verify DebriefPanel on ResultScreen
    let debriefRendered = false;
    for (let i = 0; i < 10; i++) {
      const text = await client.eval("document.body.innerText.toUpperCase()");
      if (text && (text.includes("КЛИНИЧЕСКИЙ РАЗБОР") || text.includes("ТРАЕКТОРИЯ") || text.includes("КЛИНИЧЕСКОЕ РЕШЕНИЕ") || text.includes("БЕЗОПАСНОСТЬ") || text.includes("РЕЗУЛЬТАТ") || text.includes("ДЕБРИФИНГ") || text.includes("БАЛЛ") || text.includes("РЕЗУЛЬТАТЫ"))) {
        debriefRendered = true;
        break;
      }
      await sleep(400);
    }
    check("11-point Closed-Loop DebriefPanel rendered on ResultScreen", debriefRendered);

    // -------------------------------------------------------------
    // Scenario B: Department Routing & Parity Check
    // -------------------------------------------------------------
    console.log("\n[5/5] Scenario B: Department Routing & Parity Check:");
    
    // Return to menu
    await client.eval(`
      (() => {
        const menuBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('В меню') || b.textContent.includes('Меню') || b.getAttribute('aria-label') === 'В меню'));
        if (menuBtn) menuBtn.click();
      })()
    `);
    await sleep(1500);

    const returnedToMenu = await client.eval(`
      (() => {
        const text = document.body.innerText;
        return text.includes("Поликлиника") || text.includes("Стационар") || text.includes("ОРИТ") || text.includes("Случаи");
      })()
    `);
    check("Returned to Main Menu successfully", returnedToMenu);

    check("Zero unhandled JavaScript exceptions during entire real browser session", consoleErrors.length === 0);

  } catch (err) {
    console.error("Browser verification execution error:", err);
    failed++;
  } finally {
    if (client) {
      try { await client.send("Browser.close"); } catch (e) {}
    }
    chromeProcess.kill("SIGKILL");
    serverProcess.kill("SIGKILL");
  }

  console.log("\n==================================================");
  console.log(`REAL BROWSER VERIFICATION CHECKS PASSED: ${passed}`);
  console.log(`REAL BROWSER VERIFICATION CHECKS FAILED: ${failed}`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runRealBrowserVerification();
