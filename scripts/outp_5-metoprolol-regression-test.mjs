/**
 * scripts/outp_5-metoprolol-regression-test.mjs
 * 
 * Targeted E2E Browser Regression Test for Case outp_5 (Graves' Disease / Thyrotoxicosis).
 * Verifies that Metoprolol is correctly credited as indicated (needTreat) without penalty,
 * and Amiodarone is properly identified as contraindicated (wrongTreat).
 */

import { spawn } from "child_process";
import http from "http";
import { CASES } from "../src/data/cases/index.js";
import { computeScore } from "../src/engine/scoring.js";

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
    const res = await this.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: false });
    if (res.exceptionDetails) throw new Error("Eval error: " + JSON.stringify(res.exceptionDetails));
    return res.result?.value;
  }
}

async function runOutp5RegressionTest() {
  console.log("==========================================================================");
  console.log("   CASE outp_5 (THYROTOXICOSIS) METOPROLOL REGRESSION E2E AUDIT           ");
  console.log("==========================================================================");

  let passed = 0;
  let failed = 0;

  function check(name, condition, errorDetail = "") {
    if (condition) {
      passed++;
      console.log(`  ✓ ${name}`);
    } else {
      failed++;
      console.error(`  ❌ FAILED: ${name} ${errorDetail}`);
    }
  }

  // 1. In-memory case definition check
  const outp5 = CASES.find(c => c.id === "outp_5");
  check("Step 1: Case outp_5 exists in clinical registry", !!outp5);
  check("Step 2: Metoprolol is present in needTreat", outp5.needTreat.includes("metoprolol"));
  check("Step 3: Metoprolol is REMOVED from wrongTreat", !outp5.wrongTreat.includes("metoprolol"));
  check("Step 4: Amiodarone remains in wrongTreat", outp5.wrongTreat.includes("amiodarone"));

  // 2. Scoring verification
  const scoreWithMetoprolol = computeScore(
    outp5,
    outp5.needDiag,
    ["metoprolol", "iv_fluids"],
    outp5.diagnosis,
    { ...outp5.vitals, status: "stable" },
    120,
    new Set(["historyOfIllness", "lifeHistory"])
  );
  check("Step 5: Prescribing Metoprolol achieves Grade 'excellent' (score >= 85)", scoreWithMetoprolol.score >= 85, `Score: ${scoreWithMetoprolol.score}`);
  check("Step 6: Zero dangerous treatment warnings for Metoprolol", scoreWithMetoprolol.dangerous.length === 0, `Dangerous: ${JSON.stringify(scoreWithMetoprolol.dangerous)}`);

  const scoreWithAmiodarone = computeScore(
    outp5,
    outp5.needDiag,
    ["amiodarone"],
    outp5.diagnosis,
    { ...outp5.vitals, status: "stable" },
    120,
    new Set(["historyOfIllness", "lifeHistory"])
  );
  check("Step 7: Prescribing Amiodarone triggers dangerous penalty (-15)", scoreWithAmiodarone.dangerous.length > 0);

  // 3. Real Browser Execution
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
    await client.send("Console.enable");

    const preSeedScript = `
      try {
        const token = "tok_regression_tester";
        const user = { id: "u_tester", email: "endocrinologist@medsim.ru", nickname: "Эндокринолог", createdAt: new Date().toISOString() };
        localStorage.setItem("medsim_users", JSON.stringify([{ ...user, password: "password123" }]));
        localStorage.setItem("medsim_token", token);
        localStorage.setItem("medsim_current_user", JSON.stringify({ user, token }));
        localStorage.setItem("ms_onboardingDone", "true");
        localStorage.setItem("ms_tutorialDone", "true");
      } catch (e) {}
    `;
    await client.send("Page.addScriptToEvaluateOnNewDocument", { source: preSeedScript });

    await client.send("Page.navigate", { url: `${APP_URL}/app` });
    await sleep(2000);

    // Filter to Outpatient Department
    await client.eval(`
      (() => {
        const chips = Array.from(document.querySelectorAll('div, button, span'));
        const outChip = chips.find(el => el.textContent && el.textContent.trim() === 'Поликлиника');
        if (outChip) outChip.click();
      })()
    `);
    await sleep(800);

    // Select Case outp_5 (Болезнь Грейвса)
    await client.eval(`
      (() => {
        const cards = Array.from(document.querySelectorAll('.case-card, div'));
        const target = cards.find(c => c.textContent && (c.textContent.includes('Грейвса') || c.textContent.includes('Зоб') || c.textContent.includes('Тиреотоксикоз') || c.textContent.includes('Ковалёва')));
        if (target) target.click();
      })()
    `);
    await sleep(2500);

    const isCaseOpen = await client.eval(`
      document.body.innerText.includes("Грейвса") || document.body.innerText.includes("Тиреотоксикоз") || document.body.innerText.includes("потеря веса") || document.body.innerText.includes("ЧСС")
    `);
    check("Step 8: Case outp_5 successfully loaded in browser DOM", isCaseOpen);

    // Check debrief text consistency
    const debriefExplain = outp5.debrief.explain;
    check("Step 9: Debrief explains beta-blockers role and Graves pathophysiology", debriefExplain.includes("β-блокаторы") && debriefExplain.includes("Грейвса"));

    // Check console errors
    const errors = client.events.filter(ev => 
      ev.method === "Console.messageAdded" && 
      ev.params.message.level === "error" &&
      !ev.params.message.text.includes("WebGLRenderer")
    );
    if (errors.length > 0) {
      console.log("Logged Console Errors:", JSON.stringify(errors.map(e => e.params.message.text)));
    }
    check("Step 10: Zero JavaScript console errors during Case outp_5 session", errors.length === 0);

  } catch (err) {
    console.error("Browser regression test error:", err);
    failed++;
  } finally {
    if (client) try { await client.send("Browser.close"); } catch (e) {}
    chromeProcess.kill("SIGKILL");
    serverProcess.kill("SIGKILL");
  }

  console.log("\n==========================================================================");
  console.log(`CASE outp_5 REGRESSION CHECKS PASSED: ${passed} / 10`);
  console.log(`CASE outp_5 REGRESSION CHECKS FAILED: ${failed}`);
  console.log("==========================================================================");

  if (failed > 0) process.exit(1);
}

runOutp5RegressionTest();
