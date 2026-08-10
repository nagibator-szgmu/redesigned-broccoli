import { spawn } from "child_process";
import http from "http";

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9222;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
      // If ws not in node_modules, we can use global WebSocket in Node 22+
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
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error("Eval exception: " + JSON.stringify(res.exceptionDetails));
    }
    return res.result?.value;
  }
}

async function runBrowserQA() {
  console.log("=== LAUNCHING REAL HEADLESS CHROME BROWSER ===");
  const chromeProcess = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--disable-gpu",
    "--no-sandbox",
    "--no-first-run",
    "--disable-extensions",
    "http://127.0.0.1:5173"
  ]);

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
      throw new Error("Could not connect to Chrome DevTools Protocol endpoint");
    }

    const pageTarget = targets.find(t => t.type === "page") || targets[0];
    console.log("Connected to Chrome page target:", pageTarget.url);

    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();
    await client.send("Runtime.enable");
    await client.send("Page.enable");
    await client.send("Console.enable");

    // Wait for page to initialize
    await sleep(1500);

    const consoleErrors = [];
    const consoleWarnings = [];
    client.events.forEach(ev => {
      if (ev.method === "Console.messageAdded") {
        if (ev.params.message.level === "error") consoleErrors.push(ev.params.message.text);
        if (ev.params.message.level === "warning") consoleWarnings.push(ev.params.message.text);
      }
    });

    console.log("\n1. BROWSER RUNTIME HEALTH CHECK:");
    console.log("Page title:", await client.eval("document.title"));
    console.log("Body exists:", await client.eval("!!document.body"));
    console.log("Initial Console Errors:", consoleErrors.length);
    console.log("Initial Console Warnings:", consoleWarnings.length);

    // Skip onboarding if present
    const hasOnboarding = await client.eval(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Пропустить') || b.textContent.includes('Далее'));
        if (btn) { btn.click(); return true; }
        return false;
      })()
    `);
    if (hasOnboarding) {
      await sleep(500);
      console.log("✓ Onboarding skipped");
    }

    // TEST CASE A: CARDIAC CASE WITH FULL ABCDE WORKFLOW
    console.log("\n2. CASE A — CARDIAC ICU (ABCDE Sequential Workflow & Summary):");
    await client.eval(`
      (() => {
        const startBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Начать') || b.textContent.includes('Старт'));
        if (startBtn) startBtn.click();
      })()
    `);
    await sleep(1000);

    // Check VitalsHUD presence
    const vitalsRendered = await client.eval(`
      (() => {
        const hud = document.querySelector('[style*="sticky"]');
        const text = hud ? hud.innerText : "";
        return text.includes("SpO") && text.includes("ЧСС");
      })()
    `);
    console.log("✓ VitalsHUD active telemetry rendered:", vitalsRendered);

    // Switch to ABCDE mode in HistoryPanel
    await client.eval(`
      (() => {
        const abcdeTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ABCDE'));
        if (abcdeTab) abcdeTab.click();
      })()
    `);
    await sleep(500);

    // Click A -> Airway assessment
    const airwayResult = await client.eval(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Оценить ВДП') || b.textContent.includes('Проходимость ВДП'));
        if (btn) { btn.click(); return true; }
        return false;
      })()
    `);
    console.log("✓ Step A (Airway assessment) performed:", airwayResult);
    await sleep(300);

    // Click B -> switch to tab B and perform auscultation
    await client.eval(`
      (() => {
        const tabB = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim().startsWith('B'));
        if (tabB) tabB.click();
      })()
    `);
    await sleep(300);
    const breathingResult = await client.eval(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Аускультация легких'));
        if (btn) { btn.click(); return true; }
        return false;
      })()
    `);
    console.log("✓ Step B (Breathing auscultation) performed:", breathingResult);
    await sleep(300);

    // Click C -> tab C and perform capillary refill
    await client.eval(`
      (() => {
        const tabC = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim().startsWith('C'));
        if (tabC) tabC.click();
      })()
    `);
    await sleep(300);
    const circResult = await client.eval(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Белое пятно') || b.textContent.includes('Симптом белого пятна'));
        if (btn) { btn.click(); return true; }
        return false;
      })()
    `);
    console.log("✓ Step C (Circulation capillary refill) performed:", circResult);
    await sleep(300);

    // Click D -> tab D and perform pupils
    await client.eval(`
      (() => {
        const tabD = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim().startsWith('D'));
        if (tabD) tabD.click();
      })()
    `);
    await sleep(300);
    const disResult = await client.eval(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Зрачки') || b.textContent.includes('фотореакция'));
        if (btn) { btn.click(); return true; }
        return false;
      })()
    `);
    console.log("✓ Step D (Disability pupils test) performed:", disResult);
    await sleep(300);

    // Click E -> tab E and perform skin
    await client.eval(`
      (() => {
        const tabE = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim().startsWith('E'));
        if (tabE) tabE.click();
      })()
    `);
    await sleep(300);
    const expResult = await client.eval(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Кожа') || b.textContent.includes('Осмотр кожи'));
        if (btn) { btn.click(); return true; }
        return false;
      })()
    `);
    console.log("✓ Step E (Exposure skin exam) performed:", expResult);
    await sleep(300);

    // Open ABCDE Summary view
    const summaryOpened = await client.eval(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Сводка ABCDE'));
        if (btn) { btn.click(); return true; }
        return false;
      })()
    `);
    await sleep(300);
    const summaryText = await client.eval(`
      (() => {
        return document.body.innerText.includes("Клинический протокол первичного осмотра");
      })()
    `);
    console.log("✓ ABCDE Summary view toggled and rendered:", summaryText);

    // TEST CASE B: DIAGNOSTICS & RESULT CARD METADATA
    console.log("\n3. CASE B — DIAGNOSTICS, TAT SIMULATION & RESULTCARD CLINICAL METADATA:");
    // Switch to Diagnostics tab in Action Command Center
    await client.eval(`
      (() => {
        const tab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Исследования') || b.textContent.includes('Тесты'));
        if (tab) tab.click();
      })()
    `);
    await sleep(500);

    // Select ECG and Troponin
    const testsSelected = await client.eval(`
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const ecg = buttons.find(b => b.textContent.includes('ЭКГ'));
        const trop = buttons.find(b => b.textContent.includes('Тропонин'));
        let count = 0;
        if (ecg) { ecg.click(); count++; }
        if (trop) { trop.click(); count++; }
        return count;
      })()
    `);
    console.log(`✓ Tests selected: ${testsSelected}`);
    await sleep(300);

    // Click Order Tests
    await client.eval(`
      (() => {
        const orderBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Назначить') || b.textContent.includes('Выполнить'));
        if (orderBtn) orderBtn.click();
      })()
    `);
    console.log("✓ Order tests dispatched into simulation state");

    // Wait for TAT sequential delivery
    await sleep(2500);

    // Check ResultCard metadata (Unit, Reference Range, Clinical Status)
    const resultCardDetails = await client.eval(`
      (() => {
        const cards = Array.from(document.querySelectorAll('.treat-row'));
        return cards.map(c => {
          return {
            text: c.innerText.slice(0, 100),
            hasRef: c.innerText.includes("Референс"),
            hasUnit: c.innerText.includes("Ед"),
            hasBadge: c.innerText.includes("КРИТИЧНО") || c.innerText.includes("ОТКЛОНЕНИЕ") || c.innerText.includes("НОРМА")
          };
        });
      })()
    `);
    console.log("✓ ResultCards delivered with clinical reference metadata:", JSON.stringify(resultCardDetails, null, 2));

    // TEST CASE C: TREATMENT 7-CATEGORY WORKSPACE
    console.log("\n4. CASE C — TREATMENT 7-CATEGORY WORKSPACE & RE-RENDER SAFETY:");
    await client.eval(`
      (() => {
        const tab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Назначения') || b.textContent.includes('Лечение'));
        if (tab) tab.click();
      })()
    `);
    await sleep(500);

    const categoriesFound = await client.eval(`
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const categories = ["Все", "Экстренные", "Кардио", "Анальгезия", "Дыхание", "Антимикробные", "Инфузии", "Прочие"];
        return categories.filter(c => buttons.some(b => b.textContent.trim() === c));
      })()
    `);
    console.log("✓ Treatment categories present:", categoriesFound.join(", "));

    // Select Oxygen
    await client.eval(`
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const o2 = buttons.find(b => b.textContent.includes('Кислород') || b.textContent.includes('Oxygen'));
        if (o2) o2.click();
      })()
    `);
    await sleep(300);

    // TEST DIFFERENTIAL DIAGNOSIS WORKSPACE
    console.log("\n5. DIFFERENTIAL DIAGNOSIS WORKSPACE & CHIP FILL:");
    await client.eval(`
      (() => {
        const tab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Диагноз') || b.textContent.includes('Маршрутизация'));
        if (tab) tab.click();
      })()
    `);
    await sleep(500);

    const diffDetails = await client.eval(`
      (() => {
        const hasLeading = document.body.innerText.includes("ВЕДУЩИЙ") || document.body.innerText.includes("Дифференциальный ряд");
        const hasEvidence = document.body.innerText.includes("Подтверждено") || document.body.innerText.includes("Требуется");
        const chip = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('%'));
        let clickedChip = null;
        if (chip) {
          clickedChip = chip.textContent;
          chip.click();
        }
        const textarea = document.querySelector('textarea');
        return {
          hasLeading,
          hasEvidence,
          clickedChip,
          textareaValue: textarea ? textarea.value : ""
        };
      })()
    `);
    console.log("✓ Differential Reasoning Workspace State:", JSON.stringify(diffDetails, null, 2));

    // TEST COMMAND PALETTE (CMD+K / CTRL+K / ESCAPE)
    console.log("\n6. GLOBAL COMMAND PALETTE (Cmd+K / Ctrl+K / Escape / Search):");
    await client.eval(`
      (() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
      })()
    `);
    await sleep(400);

    const paletteOpened = await client.eval(`
      (() => {
        const input = document.querySelector('input[placeholder*="Быстрый поиск"]');
        return !!input;
      })()
    `);
    console.log("✓ Command Palette opened with Cmd+K:", paletteOpened);

    // Close via Escape
    await client.eval(`
      (() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      })()
    `);
    await sleep(300);

    const paletteClosed = await client.eval(`
      (() => {
        const input = document.querySelector('input[placeholder*="Быстрый поиск"]');
        return !input;
      })()
    `);
    console.log("✓ Command Palette closed with Escape:", paletteClosed);

    // TEST VIEWPORTS & RESPONSIVENESS
    console.log("\n7. MULTI-VIEWPORT RESPONSIVENESS & OVERFLOW QA:");
    const viewports = [
      { width: 390, height: 844, name: "Mobile (iPhone 14)" },
      { width: 375, height: 812, name: "Mobile (iPhone X/12 Mini)" },
      { width: 412, height: 915, name: "Mobile (Samsung Galaxy S22)" },
      { width: 768, height: 1024, name: "Tablet (iPad Mini)" },
      { width: 1280, height: 720, name: "Desktop 720p" },
      { width: 1440, height: 900, name: "Desktop 900p" },
      { width: 1920, height: 1080, name: "Desktop 1080p FHD" },
    ];

    for (const vp of viewports) {
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.width < 800,
      });
      await sleep(300);

      const overflow = await client.eval(`
        (() => {
          const docW = document.documentElement.clientWidth;
          const scrollW = document.documentElement.scrollWidth;
          return {
            hasOverflow: scrollW > docW,
            docW,
            scrollW
          };
        })()
      `);
      console.log(`✓ ${vp.name} (${vp.width}x${vp.height}): Horizontal Overflow = ${overflow.hasOverflow ? "FAIL (Overflown)" : "PASS (Clean)"}`);
    }

    console.log("\n=== REAL BROWSER RUNTIME AUDIT COMPLETE ===");
  } catch (err) {
    console.error("Browser QA failed:", err);
  } finally {
    chromeProcess.kill();
  }
}

runBrowserQA();
