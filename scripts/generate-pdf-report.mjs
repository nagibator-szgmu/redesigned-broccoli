import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve(process.cwd(), "reports");
const PDF_FILE = path.join(OUT_DIR, "medsim-screens-report.pdf");
const screenshotsBase = path.join(OUT_DIR, "screenshots");

const screens = [
  { id: "01_menu_main_all", title: "Главное меню — Все отделения", desc: "Каталог 67 клинических кейсов, строка поиска, фильтры и сайдбар навигации" },
  { id: "02_menu_dept_icu", title: "Меню — Отделение ОРИТ", desc: "Критические реанимационные пациенты, экстренная сортировка" },
  { id: "03_menu_dept_admission", title: "Меню — Приёмное отделение", desc: "Пациенты первичного приемного покоя, triage и диагностический поиск" },
  { id: "04_menu_dept_stationary", title: "Меню — Стационар", desc: "Клинические профильные отделения стационара с суточным ведением" },
  { id: "05_menu_dept_outpatient", title: "Меню — Поликлиника", desc: "Первичный амбулаторный прием пациентов в поликлинике" },
  { id: "06_menu_settings_modal", title: "Модальное окно: Настройки симулятора", desc: "Выбор сложности, режима игры, режима обучения, диалога с пациентом, темы и звука" },
  { id: "07_menu_notifications_modal", title: "Модальное окно: Клинические уведомления", desc: "Системные оповещения, анонсы и напоминания" },
  { id: "08_menu_account_modal", title: "Модальное окно: Профиль и аккаунт врача", desc: "Выбор одной из 5 ролей/аватаров: Студент, Терапевт, Кардиолог, Реаниматолог, Профессор" },
  { id: "09_menu_mobile_drawer", title: "Мобильная боковая навигационная шторка (Drawer)", desc: "Выдвижная панель меню на мобильных устройствах со списком всех модулей" },
  { id: "10_onboarding_step", title: "Обучающий онбординг (Вводный тур)", desc: "Пошаговое знакомство с функционалом симулятора и клинической станцией" },
  { id: "16_course_map", title: "Интерактивная карта курсов и специализаций", desc: "Древо клинических модулей и прогресс прохождения" },
  { id: "11_theory_hub", title: "Теоретический хаб и клиническая база", desc: "Каталог 35 нозологических конспектов, гайдлайнов и классификаций" },
  { id: "12_theory_topic_content", title: "Конспект нозологии (Клинические рекомендации)", desc: "Развернутый клинический конспект темы с диагностикой и лечением по стандартам Минздрава" },
  { id: "13_theory_drug_reference", title: "Справочник лекарственных средств", desc: "База 40 препаратов с механизмами действия, дозировками и противопоказаниями" },
  { id: "14_theory_protocols", title: "Протоколы сердечно-легочной реанимации", desc: "Пошаговые алгоритмы ACLS, BLS, ATLS, Сепсис, Инсульт" },
  { id: "15_theory_calculator_gcs", title: "Медицинский калькулятор шкалы Глазго (GCS)", desc: "Интерактивная оценка уровня сознания" },
  { id: "17_leaderboard", title: "Таблица лидеров и история сессий", desc: "Статистика сыгранных кейсов, баллы ОСКЭ, аналитика" },
  { id: "18_certificates", title: "Витрина дипломов и сертификатов", desc: "17 профессиональных сертификатов по направлениям и достижениям" },
  { id: "19_teacher_dashboard", title: "Кабинет преподавателя (Аналитика группы)", desc: "Статистика группы студентов, тепловая карта когнитивных ошибок" },
  { id: "20_game_icu_workspace_abcde", title: "ОРИТ: Клиническая станция и монитор виталов", desc: "Монитор ЖП в реальном времени, ЭКГ-полоса, статус-стрип, жалоба, диалог с больным" },
  { id: "21_game_icu_diagnostics", title: "ОРИТ: Вкладка / Шторка лабораторной диагностики", desc: "Заказ лабораторных анализов, газов крови, ЭКГ, КТ и просмотр готовых результатов" },
  { id: "22_game_icu_treatments", title: "ОРИТ: Вкладка / Шторка экстренной терапии", desc: "Выбор экстренных фармакологических средств по группам и введение пациенту" },
  { id: "23_game_icu_diagnosis", title: "ОРИТ: Постановка клинического диагноза", desc: "Формулирование окончательного диагноза и обоснование клинической гипотезы" },
  { id: "24_game_admission_workspace", title: "Приёмное отделение: Сортировка и маршрутизация", desc: "Первичный осмотр, краткий анамнез и маршрутизация (ОРИТ, профильное, амбулаторно)" },
  { id: "25_game_stationary_workspace", title: "Стационар: Суточный цикл и утренний обход", desc: "Дневник курации, виталы по суткам, динамика состояния" },
  { id: "26_game_stationary_anamnesis_illness", title: "Стационар: Анамнез заболевания", desc: "Раскрытая история развития настоящего заболевания" },
  { id: "27_game_stationary_anamnesis_life", title: "Стационар: Анамнез жизни", desc: "Хронические болезни, аллергоанамнез, противопоказания" },
  { id: "28_game_outpatient_workspace", title: "Поликлиника: Амбулаторный прием врача", desc: "Сбор жалоб, объективный осмотр, выбор тактики и плана обследования" },
  { id: "29_result_summary_overview", title: "Экран результатов: Обзор и оценка ОСКЭ", desc: "Итоговый балл (0-100), исход пациента, дельты витальных показателей" },
  { id: "30_result_errors_tab", title: "Экран результатов: Анализ клинических ошибок", desc: "Дефекты тактики, опасные препараты, пропущенные диагностические маркеры" },
  { id: "31_result_theory_tab", title: "Экран результатов: Рекомендации Минздрава", desc: "Связанные протоколы и клинреки Минздрава по завершенной нозологии" },
  { id: "32_result_timeline_tab", title: "Экран результатов: Хронология действий (Таймлайн)", desc: "Поминутный таймлайн всех принятых врачебных решений" }
];

function resolveImg(dirName, baseId) {
  // Try exact match
  let p = path.join(screenshotsBase, dirName, `${baseId}.png`);
  if (fs.existsSync(p)) return p;

  // Fallbacks for diagnostic / treat tabs naming
  if (baseId === "21_game_icu_diagnostics") {
    let p1 = path.join(screenshotsBase, dirName, "21_game_icu_diagnostics_tab.png");
    if (fs.existsSync(p1)) return p1;
    let p2 = path.join(screenshotsBase, dirName, "21_game_icu_mobile_diag_drawer.png");
    if (fs.existsSync(p2)) return p2;
  }
  if (baseId === "22_game_icu_treatments") {
    let p1 = path.join(screenshotsBase, dirName, "22_game_icu_treatment_tab.png");
    if (fs.existsSync(p1)) return p1;
    let p2 = path.join(screenshotsBase, dirName, "22_game_icu_mobile_treat_drawer.png");
    if (fs.existsSync(p2)) return p2;
  }
  if (baseId === "23_game_icu_diagnosis") {
    let p1 = path.join(screenshotsBase, dirName, "23_game_icu_diagnosis_tab.png");
    if (fs.existsSync(p1)) return p1;
    let p2 = path.join(screenshotsBase, dirName, "23_game_icu_mobile_diagnose_view.png");
    if (fs.existsSync(p2)) return p2;
  }
  return null;
}

function toBase64(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null;
  const data = fs.readFileSync(filePath);
  return `data:image/png;base64,${data.toString("base64")}`;
}

function buildHtml() {
  let html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>MedSim — Полный визуальный отчет интерфейсов</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 8mm 10mm 10mm 10mm;
      @bottom-right {
        content: counter(page);
        font-size: 8pt;
        color: #64748b;
      }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #090d16;
      color: #f8fafc;
      font-size: 9pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ОБЛОЖКА */
    .cover-page {
      page-break-after: always;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 30px;
    }
    .brand-pill {
      display: inline-block;
      padding: 6px 20px;
      background: rgba(6, 182, 212, 0.15);
      border: 1px solid #06b6d4;
      color: #38bdf8;
      border-radius: 999px;
      font-size: 13pt;
      font-weight: 700;
      letter-spacing: 2px;
      margin-bottom: 20px;
    }
    .cover-title {
      font-size: 34pt;
      font-weight: 900;
      letter-spacing: -1px;
      color: #fff;
      margin-bottom: 12px;
    }
    .cover-subtitle {
      font-size: 13pt;
      color: #94a3b8;
      max-width: 800px;
      margin-bottom: 30px;
      line-height: 1.5;
    }
    .cover-meta {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 18px 30px;
      text-align: left;
      font-size: 10pt;
      display: inline-grid;
      grid-template-columns: auto auto;
      gap: 8px 30px;
    }
    .cover-meta .label { color: #64748b; font-weight: 600; }
    .cover-meta .val { color: #f1f5f9; font-weight: 700; }

    /* ОГЛАВЛЕНИЕ */
    .toc-page {
      page-break-after: always;
      padding: 10px 15px;
    }
    .toc-title {
      font-size: 18pt;
      font-weight: 800;
      color: #38bdf8;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 6px;
      margin-bottom: 16px;
    }
    .toc-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 24px;
    }
    .toc-item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #1f2937;
      padding: 4px 0;
      font-size: 9pt;
    }
    .toc-item span.title { font-weight: 600; color: #f1f5f9; }
    .toc-item span.id { color: #06b6d4; font-family: monospace; }

    /* РАЗДЕЛИТЕЛЬ СЕКЦИИ */
    .section-cover {
      page-break-after: always;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: #0b1120;
    }
    .section-badge {
      font-size: 11pt;
      font-weight: 800;
      letter-spacing: 2px;
      color: #06b6d4;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .section-title {
      font-size: 30pt;
      font-weight: 900;
      color: #fff;
      margin-bottom: 12px;
    }
    .section-desc {
      font-size: 13pt;
      color: #94a3b8;
      max-width: 650px;
    }

    /* ПОЛНОРАЗМЕРНАЯ СТРАНИЦА DESKTOP */
    .desktop-page {
      page-break-after: always;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 1px solid #1f2937;
      padding-bottom: 5px;
      margin-bottom: 8px;
    }
    .title-box { display: flex; flex-direction: column; }
    .page-title { font-size: 13pt; font-weight: 800; color: #fff; }
    .page-desc { font-size: 8.5pt; color: #94a3b8; margin-top: 2px; }
    .device-badge {
      background: #0284c7;
      color: #fff;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }
    .desktop-img-box {
      flex: 1;
      width: 100%;
      background: #000;
      border: 1px solid #1f2937;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .desktop-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    /* СТРАНИЦА TABLET + MOBILE (БОЛЬШОЕ СРАВНЕНИЕ РЯДОМ) */
    .mobile-tablet-page {
      page-break-after: always;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .compare-container {
      flex: 1;
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 16px;
      min-height: 0;
    }
    .device-panel {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 8px;
      padding: 6px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .device-panel-header {
      font-size: 8.5pt;
      font-weight: 700;
      color: #38bdf8;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .compare-img {
      flex: 1;
      width: 100%;
      object-fit: contain;
      background: #000;
      border-radius: 6px;
      min-height: 0;
    }
  </style>
</head>
<body>

  <!-- ОБЛОЖКА -->
  <div class="cover-page">
    <div class="brand-pill">MEDSIM CLINICAL SIMULATOR</div>
    <div class="cover-title">Визуальный атлас интерфейсов<br>и клинических станций</div>
    <div class="cover-subtitle">Полноразмерный сравнительный фотоотчет всех экранов, игровых режимов, модальных окон и вкладок симулятора на ПК (1440×900), планшете (820×1180) и смартфоне (390×844).</div>
    <div class="cover-meta">
      <span class="label">Дата ревизии:</span><span class="val">05 октября 2026</span>
      <span class="label">Формат альбома:</span><span class="val">A4 Landscape (Полноразмерный)</span>
      <span class="label">Количество экранов:</span><span class="val">32 ключевых экрана в 3 разрешениях (96 снимков)</span>
      <span class="label">Движок рендера:</span><span class="val">Playwright Chromium Retina @2x</span>
      <span class="label">Клинические отделения:</span><span class="val">ОРИТ, Приёмное отделение, Стационар, Поликлиника</span>
    </div>
  </div>

  <!-- ОГЛАВЛЕНИЕ -->
  <div class="toc-page">
    <div class="toc-title">Оглавление клинического атласа</div>
    <div class="toc-grid">
`;

  screens.forEach((s, idx) => {
    html += `      <div class="toc-item"><span class="title">${idx + 1}. ${s.title}</span><span class="id">${s.id}</span></div>\n`;
  });

  html += `    </div>
  </div>
`;

  // РАЗДЕЛ 1: DESKTOP (ПОЛНОРАЗМЕРНЫЕ ЭКРАНЫ НА ВЕСЬ ЛИСТ)
  html += `
  <div class="section-cover">
    <div class="section-badge">РАЗДЕЛ I</div>
    <div class="section-title">DESKTOP WORKSTATION</div>
    <div class="section-desc">Полноразмерные скриншоты для ПК и ноутбуков (1440 × 900). Каждый экран представлен во весь лист формата A4 Landscape для детальной инспекции виталов, шрифтов и контролов.</div>
  </div>
`;

  for (const s of screens) {
    const imgPath = resolveImg("desktop", s.id);
    const b64 = toBase64(imgPath);
    if (!b64) continue;

    html += `
  <div class="desktop-page">
    <div class="page-header">
      <div class="title-box">
        <div class="page-title">${s.title}</div>
        <div class="page-desc">${s.desc}</div>
      </div>
      <div class="device-badge">💻 DESKTOP 1440 × 900</div>
    </div>
    <div class="desktop-img-box">
      <img class="desktop-img" src="${b64}" alt="${s.title}" />
    </div>
  </div>
`;
  }

  // РАЗДЕЛ 2: TABLET & MOBILE (КРУПНОЕ СРАВНЕНИЕ РЯДОМ НА АЛЬБОМНОМ ЛИСТЕ)
  html += `
  <div class="section-cover">
    <div class="section-badge">РАЗДЕЛ II</div>
    <div class="section-title">TABLET & MOBILE ADAPTATION</div>
    <div class="section-desc">Сравнительный срез адаптивности: слева Планшет / iPad (820 × 1180), справа Смартфон / iPhone (390 × 844) в полную высоту страницы.</div>
  </div>
`;

  for (const s of screens) {
    const tabPath = resolveImg("tablet", s.id);
    const mobPath = resolveImg("mobile", s.id);
    const tabB64 = toBase64(tabPath);
    const mobB64 = toBase64(mobPath);

    if (!tabB64 && !mobB64) continue;

    html += `
  <div class="mobile-tablet-page">
    <div class="page-header">
      <div class="title-box">
        <div class="page-title">${s.title}</div>
        <div class="page-desc">${s.desc}</div>
      </div>
      <div class="device-badge">📱 TABLET vs MOBILE</div>
    </div>
    <div class="compare-container">
      <div class="device-panel">
        <div class="device-panel-header"><span>📱 Планшет / iPad (820 × 1180)</span></div>
        ${tabB64 ? `<img class="compare-img" src="${tabB64}" alt="${s.title} Tablet" />` : '<div style="color:#64748b;margin:auto;">Адаптировано</div>'}
      </div>
      <div class="device-panel">
        <div class="device-panel-header"><span>📱 Смартфон / iPhone (390 × 844)</span></div>
        ${mobB64 ? `<img class="compare-img" src="${mobB64}" alt="${s.title} Mobile" />` : '<div style="color:#64748b;margin:auto;">Адаптировано</div>'}
      </div>
    </div>
  </div>
`;
  }

  html += `
</body>
</html>`;

  return html;
}

async function renderPdf() {
  console.log("Generating high-resolution landscape A4 HTML...");
  const html = buildHtml();
  const tempHtmlPath = path.join(OUT_DIR, "report_temp_landscape.html");
  fs.writeFileSync(tempHtmlPath, html, "utf-8");

  console.log("Launching Playwright Chromium for rendering...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`file://${tempHtmlPath}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  console.log("Generating full-scale PDF: " + PDF_FILE);
  await page.pdf({
    path: PDF_FILE,
    format: "A4",
    landscape: true,
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: "8mm",
      bottom: "8mm",
      left: "8mm",
      right: "8mm",
    },
  });

  await browser.close();
  try {
    fs.unlinkSync(tempHtmlPath);
  } catch {}
  console.log("SUCCESS! Full-size landscape PDF created at: " + PDF_FILE);
}

renderPdf().catch((err) => {
  console.error("PDF generation error:", err);
  process.exit(1);
});
