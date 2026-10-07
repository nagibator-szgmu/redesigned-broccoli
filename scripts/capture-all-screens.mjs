import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:5173";
const OUT_DIR = path.resolve(process.cwd(), "reports/screenshots");

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, isMobile: false },
  { name: "tablet", width: 820, height: 1180, isMobile: true },
  { name: "mobile", width: 390, height: 844, isMobile: true },
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function capture() {
  console.log("Starting full comprehensive screenshot run...");
  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    console.log(`\n======================================================`);
    console.log(`=== Viewport: ${vp.name.toUpperCase()} (${vp.width}x${vp.height}) ===`);
    console.log(`======================================================`);
    const dir = path.join(OUT_DIR, vp.name);
    ensureDir(dir);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
      deviceScaleFactor: 2,
    });

    const page = await context.newPage();

    async function snap(name) {
      const file = path.join(dir, `${name}.png`);
      await page.waitForTimeout(400);
      await page.screenshot({ path: file });
      console.log(`✓ [${vp.name}] ${name}.png`);
    }

    // 1. Setup clean session
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.setItem("medsim_onboarding_done", "true");
      localStorage.setItem("medsim_difficulty", "intern");
      localStorage.setItem("medsim_theme", "dark");
      localStorage.setItem("medsim_audio_enabled", "false");
    });
    await page.reload();
    await page.waitForTimeout(1000);

    // ==========================================
    // 1. ГЛАВНОЕ МЕНЮ И ВСЕ ЕГО ФИЛЬТРЫ / МОДАЛКИ
    // ==========================================
    console.log(`--- Menu section ---`);
    await snap("01_menu_main_all");

    // Фильтры по отделениям
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button, div"));
      const icu = btns.find((b) => b.textContent?.trim() === "ОРИТ" || b.textContent?.includes("ОРИТ"));
      if (icu) icu.click();
    });
    await page.waitForTimeout(400);
    await snap("02_menu_dept_icu");

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button, div"));
      const adm = btns.find((b) => b.textContent?.includes("Приёмное") || b.textContent?.includes("Приемное"));
      if (adm) adm.click();
    });
    await page.waitForTimeout(400);
    await snap("03_menu_dept_admission");

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button, div"));
      const stat = btns.find((b) => b.textContent?.includes("Стационар"));
      if (stat) stat.click();
    });
    await page.waitForTimeout(400);
    await snap("04_menu_dept_stationary");

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button, div"));
      const out = btns.find((b) => b.textContent?.includes("Поликлиника"));
      if (out) out.click();
    });
    await page.waitForTimeout(400);
    await snap("05_menu_dept_outpatient");

    // Возврат ко всем отделениям
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button, div"));
      const all = btns.find((b) => b.textContent?.includes("Все отделения") || b.textContent?.includes("Все"));
      if (all) all.click();
    });
    await page.waitForTimeout(300);

    // Модальное окно настроек (Settings Modal)
    await page.evaluate(() => {
      const gear = document.querySelector('button[title*="Настройки"], button[aria-label*="Настройки"], svg[class*="IconGear"]')?.closest("button");
      if (gear) {
        gear.click();
      } else {
        const anyGear = Array.from(document.querySelectorAll("button")).find((b) => b.innerHTML.includes("15a3") || b.title?.includes("Настройки"));
        if (anyGear) anyGear.click();
      }
    });
    await page.waitForTimeout(500);
    await snap("06_menu_settings_modal");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);

    // Модальное окно уведомлений (Notifications Modal)
    await page.evaluate(() => {
      const bell = document.querySelector('button[title*="Уведомления"], button[aria-label*="Уведомления"]');
      if (bell) bell.click();
    });
    await page.waitForTimeout(400);
    await snap("07_menu_notifications_modal");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);

    // Профиль врача / аккаунт (если виден)
    await page.evaluate(() => {
      const profile = Array.from(document.querySelectorAll("div, button")).find((el) => el.textContent?.includes("Студент-Медик") || el.textContent?.includes("Профиль врача"));
      if (profile) profile.click();
    });
    await page.waitForTimeout(400);
    await snap("08_menu_account_modal");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);

    // Боковое меню на мобилке (Mobile Drawer)
    if (vp.isMobile) {
      await page.evaluate(() => {
        const burger = document.querySelector('button[aria-label="Меню"], button[title="Меню"]');
        if (burger) burger.click();
      });
      await page.waitForTimeout(400);
      await snap("09_menu_mobile_drawer");
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
    }

    // ==========================================
    // 2. ОНБОРДИНГ (OnboardingScreen)
    // ==========================================
    console.log(`--- Onboarding section ---`);
    await page.evaluate(() => localStorage.removeItem("medsim_onboarding_done"));
    await page.reload();
    await page.waitForTimeout(800);
    await snap("10_onboarding_step");

    await page.evaluate(() => localStorage.setItem("medsim_onboarding_done", "true"));
    await page.reload();
    await page.waitForTimeout(800);

    // ==========================================
    // 3. ТЕОРИЯ И СПРАВОЧНИКИ (TheoryScreen)
    // ==========================================
    console.log(`--- Theory section ---`);
    await page.evaluate(() => window.__SET_PHASE__("theory"));
    await page.waitForTimeout(800);
    await snap("11_theory_hub");

    // Открытая клиническая тема
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll("div, button, li"));
      const topic = items.find((el) => el.textContent?.includes("Инфаркт") || el.textContent?.includes("ОКС"));
      if (topic) topic.click();
    });
    await page.waitForTimeout(600);
    await snap("12_theory_topic_content");

    // Справочник препаратов
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll("button, div"));
      const drugs = items.find((el) => el.textContent?.includes("Препараты") || el.textContent?.includes("Справочник препаратов"));
      if (drugs) drugs.click();
    });
    await page.waitForTimeout(500);
    await snap("13_theory_drug_reference");

    // Протоколы (ACLS / BLS)
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll("button, div"));
      const proto = items.find((el) => el.textContent?.includes("Протоколы"));
      if (proto) proto.click();
    });
    await page.waitForTimeout(500);
    await snap("14_theory_protocols");

    // Калькуляторы (GCS)
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll("button, div"));
      const calc = items.find((el) => el.textContent?.includes("Глазго") || el.textContent?.includes("GCS"));
      if (calc) calc.click();
    });
    await page.waitForTimeout(500);
    await snap("15_theory_calculator_gcs");

    // ==========================================
    // 4. КАРТА КУРСА (CourseMapScreen)
    // ==========================================
    console.log(`--- Course Map section ---`);
    await page.evaluate(() => window.__SET_PHASE__("map"));
    await page.waitForTimeout(800);
    await snap("16_course_map");

    // ==========================================
    // 5. ДОСТИЖЕНИЯ И ЛИДЕРБОРД
    // ==========================================
    console.log(`--- Leaderboard section ---`);
    await page.evaluate(() => window.__SET_PHASE__("leaderboard"));
    await page.waitForTimeout(800);
    await snap("17_leaderboard");

    // ==========================================
    // 6. СЕРТИФИКАТЫ
    // ==========================================
    console.log(`--- Certificates section ---`);
    await page.evaluate(() => window.__SET_PHASE__("certificates"));
    await page.waitForTimeout(800);
    await snap("18_certificates");

    // ==========================================
    // 7. КАБИНЕТ ПРЕПОДАВАТЕЛЯ
    // ==========================================
    console.log(`--- Teacher Dashboard section ---`);
    await page.evaluate(() => window.__SET_PHASE__("teacher_dashboard"));
    await page.waitForTimeout(800);
    await snap("19_teacher_dashboard");

    // ==========================================
    // 8. ИГРА: ОРИТ (ICU) — ВСЕ ВКЛАДКИ
    // ==========================================
    console.log(`--- Game: ICU ---`);
    await page.evaluate(async () => {
      const mod = await import("/src/data/cases/index.js");
      const icuCase = mod.CASES.find((c) => c.department === "icu");
      window.__START_CASE__(icuCase);
    });
    await page.waitForTimeout(1000);
    await snap("20_game_icu_workspace_abcde");

    if (vp.isMobile) {
      // Мобильная шторка диагностики
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const diagBtn = btns.find((b) => b.textContent?.includes("Диагностика") || b.textContent?.includes("Анализы"));
        if (diagBtn) diagBtn.click();
      });
      await page.waitForTimeout(400);
      await snap("21_game_icu_mobile_diag_drawer");

      // Мобильная шторка лечения
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const treatBtn = btns.find((b) => b.textContent?.includes("Лечение") || b.textContent?.includes("Терапия"));
        if (treatBtn) treatBtn.click();
      });
      await page.waitForTimeout(400);
      await snap("22_game_icu_mobile_treat_drawer");

      // Закрыть шторку и открыть диагноз
      await page.keyboard.press("Escape");
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const diagBtn = btns.find((b) => b.textContent?.includes("Поставить диагноз") || b.textContent?.includes("Диагноз"));
        if (diagBtn) diagBtn.click();
      });
      await page.waitForTimeout(400);
      await snap("23_game_icu_mobile_diagnose_view");
    } else {
      // Десктоп/планшет вкладка Диагностика
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll("button, div[role='tab']"));
        const diagTab = tabs.find((t) => t.textContent?.includes("Диагностика"));
        if (diagTab) diagTab.click();
      });
      await page.waitForTimeout(400);
      await snap("21_game_icu_diagnostics_tab");

      // Вкладка Лечение
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll("button, div[role='tab']"));
        const treatTab = tabs.find((t) => t.textContent?.includes("Лечение"));
        if (treatTab) treatTab.click();
      });
      await page.waitForTimeout(400);
      await snap("22_game_icu_treatment_tab");

      // Вкладка Постановка диагноза
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll("button, div[role='tab']"));
        const diagTab = tabs.find((t) => t.textContent?.includes("Диагноз"));
        if (diagTab) diagTab.click();
      });
      await page.waitForTimeout(400);
      await snap("23_game_icu_diagnosis_tab");
    }

    // ==========================================
    // 9. ИГРА: ПРИЁМНОЕ ОТДЕЛЕНИЕ (ADMISSION)
    // ==========================================
    console.log(`--- Game: Admission ---`);
    await page.evaluate(async () => {
      const mod = await import("/src/data/cases/index.js");
      const admCase = mod.CASES.find((c) => c.department === "admission");
      if (admCase) window.__START_CASE__(admCase);
    });
    await page.waitForTimeout(1000);
    await snap("24_game_admission_workspace");

    // ==========================================
    // 10. ИГРА: СТАЦИОНАР (STATIONARY)
    // ==========================================
    console.log(`--- Game: Stationary ---`);
    await page.evaluate(async () => {
      const mod = await import("/src/data/cases/index.js");
      const statCase = mod.CASES.find((c) => c.department === "stationary");
      if (statCase) window.__START_CASE__(statCase);
    });
    await page.waitForTimeout(1000);
    await snap("25_game_stationary_workspace");

    // Раскрытие анамнеза заболевания
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const btnIll = btns.find((b) => b.textContent?.includes("Анамнез заболевания"));
      if (btnIll) btnIll.click();
    });
    await page.waitForTimeout(400);
    await snap("26_game_stationary_anamnesis_illness");

    // Раскрытие анамнеза жизни
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const btnLife = btns.find((b) => b.textContent?.includes("Анамнез жизни"));
      if (btnLife) btnLife.click();
    });
    await page.waitForTimeout(400);
    await snap("27_game_stationary_anamnesis_life");

    // ==========================================
    // 11. ИГРА: ПОЛИКЛИНИКА (OUTPATIENT)
    // ==========================================
    console.log(`--- Game: Outpatient ---`);
    await page.evaluate(async () => {
      const mod = await import("/src/data/cases/index.js");
      const outCase = mod.CASES.find((c) => c.department === "outpatient");
      if (outCase) window.__START_CASE__(outCase);
    });
    await page.waitForTimeout(1000);
    await snap("28_game_outpatient_workspace");

    // ==========================================
    // 12. ЭКРАН РЕЗУЛЬТАТОВ (ResultScreen) — ВСЕ ВКЛАДКИ
    // ==========================================
    console.log(`--- ResultScreen section ---`);
    await page.evaluate(() => {
      if (typeof window.__FINISH_CASE__ === "function") {
        window.__FINISH_CASE__();
      }
    });
    await page.waitForTimeout(1000);
    await snap("29_result_summary_overview");

    // Вкладка Дебрифинг / Ошибки
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const errBtn = btns.find((b) => b.textContent?.includes("Ошибки") || b.textContent?.includes("Дебрифинг") || b.textContent?.includes("Анализ"));
      if (errBtn) errBtn.click();
    });
    await page.waitForTimeout(400);
    await snap("30_result_errors_tab");

    // Вкладка Теория и КР
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const theoryBtn = btns.find((b) => b.textContent?.includes("Теория") || b.textContent?.includes("Клинические рекомендации"));
      if (theoryBtn) theoryBtn.click();
    });
    await page.waitForTimeout(400);
    await snap("31_result_theory_tab");

    // Вкладка Таймлайн / Хронология
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const timelineBtn = btns.find((b) => b.textContent?.includes("Хронология") || b.textContent?.includes("Таймлайн"));
      if (timelineBtn) timelineBtn.click();
    });
    await page.waitForTimeout(400);
    await snap("32_result_timeline_tab");

    await context.close();
  }

  await browser.close();
  console.log("\nAll comprehensive screenshots captured across Desktop, Tablet, and Mobile successfully!");
}

capture().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
