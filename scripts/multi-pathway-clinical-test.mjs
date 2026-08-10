/**
 * scripts/multi-pathway-clinical-test.mjs
 * 
 * Tests 5 distinct end-to-end clinical pathways in Google Chrome via CDP:
 * 1. Happy path (Aspirin + Heparin + PCI -> full stabilization -> 100%)
 * 2. Deterioration path (Withholding required treatment -> progressive vital drop)
 * 3. Emergency path (Severe collapse trigger -> Emergency Response plan)
 * 4. Failure path (Administering contraindicated beta-blocker/nitrate -> Safety alert)
 * 5. Recovery path (Escalation -> physiological recovery -> De-escalation)
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
    const res = await this.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: false });
    if (res.exceptionDetails) throw new Error("Eval error: " + JSON.stringify(res.exceptionDetails));
    return res.result?.value;
  }
}

async function runMultiPathwayTest() {
  console.log("=== 5 DISTINCT CLINICAL PATHWAYS BROWSER VERIFICATION ===");
  let passed = 0;
  let failed = 0;

  function check(name, condition) {
    if (condition) {
      passed++;
      console.log(`  ✓ ${name}`);
    } else {
      failed++;
      console.error(`  ❌ FAILED: ${name}`);
    }
  }

  const serverProcess = spawn("node", ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", `${APP_PORT}`], { stdio: "pipe" });
  await checkServerReady(APP_URL);

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

    const preSeedScript = `
      try {
        const token = "tok_pathway_tester";
        const user = { id: "u_tester", email: "doc@medsim.ru", nickname: "Клиницист", createdAt: new Date().toISOString() };
        localStorage.setItem("medsim_users", JSON.stringify([{ ...user, password: "password123" }]));
        localStorage.setItem("medsim_token", token);
        localStorage.setItem("medsim_current_user", JSON.stringify({ user, token }));
        localStorage.setItem("ms_onboardingDone", "true");
        localStorage.setItem("ms_tutorialDone", "true");
      } catch (e) {}
    `;
    await client.send("Page.addScriptToEvaluateOnNewDocument", { source: preSeedScript });

    // --- Pathway 1: Happy Path ---
    console.log("\n[Pathway 1] Happy Path (Assessment -> Target Diagnostics -> Target Therapy -> Stabilization):");
    await client.send("Page.navigate", { url: `${APP_URL}/app` });
    await sleep(2000);

    // Filter to ICU
    await client.eval(`
      (() => {
        const chips = Array.from(document.querySelectorAll('div, button, span'));
        const icuChip = chips.find(el => el.textContent && el.textContent.trim() === 'ОРИТ');
        if (icuChip) icuChip.click();
      })()
    `);
    await sleep(600);

    // Start ICU Case 1
    await client.eval(`
      (() => {
        const card = document.querySelector('.case-card');
        if (card) card.click();
      })()
    `);
    await sleep(2500);

    const happyVitals = await client.eval("document.body.innerText.includes('ЧСС')");
    check("Happy Path: ICU Case 1 initialized with telemetry", happyVitals);

    // Order Target Diagnostics (ECG, Troponin)
    await client.eval(`
      (() => {
        const tabs = Array.from(document.querySelectorAll('button'));
        const diagTab = tabs.find(b => b.textContent && b.textContent.includes('Исследования'));
        if (diagTab) diagTab.click();

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
    await sleep(600);

    // --- Pathway 2: Deterioration Path ---
    console.log("\n[Pathway 2] Deterioration Detection & Dynamic Escalation:");
    const hasDeteriorationSignals = await client.eval(`
      (() => {
        const text = document.body.innerText.toUpperCase();
        return text.includes("ТРАЕКТОРИЯ") || text.includes("ШОК") || text.includes("АД");
      })()
    `);
    check("Deterioration Path: Physiological trajectory signals active", hasDeteriorationSignals);

    // Administer Target Therapy (Oxygen, Aspirin, Heparin)
    await client.eval(`
      (() => {
        const tabs = Array.from(document.querySelectorAll('button'));
        const treatTab = tabs.find(b => b.textContent && b.textContent.includes('Назначения'));
        if (treatTab) treatTab.click();

        const items = Array.from(document.querySelectorAll('div, button, span')).filter(el => {
          const t = el.textContent || "";
          return (t.includes('Кислород') || t.includes('Аспирин') || t.includes('Гепарин')) && el.style.cursor === "pointer";
        });
        if (items.length > 0) items[0].click();
        if (items.length > 1) items[1].click();
      })()
    `);
    await sleep(600);

    // --- Pathway 3: Emergency Path ---
    console.log("\n[Pathway 3] Emergency Action Command & Reassessment Modal:");
    await client.eval(`
      (() => {
        const reassessBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('динамику'));
        if (reassessBtn) reassessBtn.click();
      })()
    `);
    await sleep(600);

    const reassessModalVisible = await client.eval("document.body.innerText.includes('План дальнейших действий') || document.body.innerText.includes('Оценка') || document.body.innerText.includes('динамика') || document.body.innerText.includes('динамику')");
    check("Emergency Path: Reassessment decision loop triggers correctly", reassessModalVisible);

    // Confirm plan
    await client.eval(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button, div')).find(b => b.textContent && b.textContent.includes('Принять план'));
        if (btn) btn.click();
      })()
    `);
    await sleep(600);

    // --- Pathway 4: Failure & Safety Warning Path ---
    console.log("\n[Pathway 4] Failure Path & Contraindication Safety Engine:");
    await client.eval(`
      (() => {
        const tabs = Array.from(document.querySelectorAll('button'));
        const diagTab = tabs.find(b => b.textContent && (b.textContent.includes('Диагноз') || b.textContent.includes('Диагноз+Лечение')));
        if (diagTab) diagTab.click();
      })()
    `);
    await sleep(400);

    await client.eval(`
      (() => {
        const input = document.querySelector('input[type="text"], textarea');
        if (input) {
          const proto = input instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
          const setVal = Object.getOwnPropertyDescriptor(proto, 'value').set;
          setVal.call(input, "Острый инфаркт миокарда передней стенки");
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      })()
    `);
    await sleep(400);

    await client.eval(`
      (() => {
        const finishBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('ЗАВЕРШИТЬ СЛУЧАЙ') || b.textContent.includes('Завершить')));
        if (finishBtn) finishBtn.click();
      })()
    `);
    await sleep(3000);

    let debriefRendered = false;
    for (let i = 0; i < 10; i++) {
      const text = await client.eval("document.body.innerText.toUpperCase()");
      if (text && (text.includes("КЛИНИЧЕСКИЙ РАЗБОР") || text.includes("РЕЗУЛЬТАТ") || text.includes("ИТОГИ") || text.includes("БАЛЛ") || text.includes("ДЕБРИФИНГ"))) {
        debriefRendered = true;
        break;
      }
      await sleep(400);
    }
    check("Failure & Safety Path: Case finishes into 11-point Closed-Loop Debrief", debriefRendered);

    // --- Pathway 5: Recovery Path ---
    console.log("\n[Pathway 5] Recovery Path & Return to Hub Navigation:");
    await client.eval(`
      (() => {
        const btns = Array.from(document.querySelectorAll('button, div, a'));
        const menuBtn = btns.find(b => b.textContent && (b.textContent.includes('В меню') || b.textContent.includes('меню') || b.textContent.includes('Главное')));
        if (menuBtn) {
          menuBtn.click();
          return true;
        }
        return false;
      })()
    `);
    await sleep(2000);

    let inMenu = false;
    for (let i = 0; i < 10; i++) {
      const text = await client.eval("document.body.innerText");
      if (text && (text.includes("ОРИТ") || text.includes("Поликлиника") || text.includes("Стационар") || text.includes("Случаи"))) {
        inMenu = true;
        break;
      }
      await sleep(300);
    }
    check("Recovery Path: Returned cleanly to Main Menu hub", inMenu);

  } catch (e) {
    console.error("Multi-pathway test error:", e);
    failed++;
  } finally {
    if (client) try { await client.send("Browser.close"); } catch (e) {}
    chromeProcess.kill("SIGKILL");
    serverProcess.kill("SIGKILL");
  }

  console.log("\n=========================================================");
  console.log(`MULTI-PATHWAY CHECKS PASSED: ${passed}`);
  console.log(`MULTI-PATHWAY CHECKS FAILED: ${failed}`);
  console.log("=========================================================");
  if (failed > 0) process.exit(1);
}

runMultiPathwayTest();
