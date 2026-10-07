import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve(process.cwd(), "reports");
const SCREENSHOTS_DIR = path.join(OUT_DIR, "screenshots");

const sections = [
  {
    category: "1. Главное меню и навигация",
    items: [
      { id: "01_menu_main_all", title: "Главное меню (Все кейсы)", desc: "Стартовый экран, каталог клинических кейсов, строка поиска, сайдбар, фильтры" },
      { id: "02_menu_dept_icu", title: "Меню: Фильтр ОРИТ", desc: "Отображение только экстренных реанимационных кейсов" },
      { id: "03_menu_dept_admission", title: "Меню: Фильтр Приёмное", desc: "Кейсы приемного покоя с диагностикой и маршрутизацией" },
      { id: "04_menu_dept_stationary", title: "Меню: Фильтр Стационар", desc: "Кейсы отделений стационара с суточным ведением" },
      { id: "05_menu_dept_outpatient", title: "Меню: Фильтр Поликлиника", desc: "Амбулаторный прием пациентов" },
      { id: "06_menu_settings_modal", title: "Модальное окно: Настройки", desc: "Уровни сложности, режимы игры, обучение, ассистент, тема, звук" },
      { id: "07_menu_notifications_modal", title: "Модальное окно: Уведомления", desc: "Клинические напоминания, анонсы и обновления базы" },
      { id: "08_menu_account_modal", title: "Модальное окно: Профиль врача", desc: "Роль, аватар, специальность, опыт XP" },
      { id: "09_menu_mobile_drawer", title: "Мобильное меню (Drawer)", desc: "Выдвижная боковая панель на планшете/смартфоне" },
    ]
  },
  {
    category: "2. Обучение, Онбординг и Карта курсов",
    items: [
      { id: "10_onboarding_step", title: "Онбординг (Вводный тур)", desc: "Интерактивное обучение новым механикам симулятора" },
      { id: "16_course_map", title: "Интерактивная карта курсов", desc: "Древо специализаций, прогресс прохождения клинических блоков" },
    ]
  },
  {
    category: "3. Теория, Справочники и Протоколы",
    items: [
      { id: "11_theory_hub", title: "Теоретический хаб", desc: "Каталог конспектов, классификаций и рекомендаций" },
      { id: "12_theory_topic_content", title: "Конспект клинической темы", desc: "Детальный конспект по нозологии с привязкой к КР Минздрава" },
      { id: "13_theory_drug_reference", title: "Справочник препаратов", desc: "40 лекарственных средств, показания, дозировки, антидоты" },
      { id: "14_theory_protocols", title: "Клинические протоколы", desc: "Протоколы ACLS, BLS, ATLS, Sepsis, Stroke" },
      { id: "15_theory_calculator_gcs", title: "Медицинский калькулятор GCS", desc: "Интерактивная шкала ком Глазго" },
    ]
  },
  {
    category: "4. Статистика, Сертификаты и Преподаватель",
    items: [
      { id: "17_leaderboard", title: "Таблица лидеров и статистика", desc: "Очки ОСКЭ, статистика сессий, рейтинг врачей" },
      { id: "18_certificates", title: "Витрина сертификатов", desc: "17 профессиональных дипломов и сертификатов симулятора" },
      { id: "19_teacher_dashboard", title: "Кабинет преподавателя", desc: "Групповая аналитика, тепловая карта когнитивных ошибок" },
    ]
  },
  {
    category: "5. Игровой режим: ОРИТ (ICU Workstation)",
    items: [
      { id: "20_game_icu_workspace_abcde", title: "ОРИТ: Рабочая станция & ABCDE", desc: "Витальный монитор, ЭКГ в реальном времени, статус больного, ABCDE" },
      { id: "21_game_icu_diagnostics_tab", title: "ОРИТ: Вкладка Диагностика (Desktop)", desc: "Назначение тестов: ЭКГ, тропонин, газы крови, КТ" },
      { id: "21_game_icu_mobile_diag_drawer", title: "ОРИТ: Диагностика (Mobile Drawer)", desc: "Мобильная шторка экспресс-заказа лабораторных тестов" },
      { id: "22_game_icu_treatment_tab", title: "ОРИТ: Вкладка Лечение (Desktop)", desc: "Выбор экстренной медикаментозной терапии" },
      { id: "22_game_icu_mobile_treat_drawer", title: "ОРИТ: Терапия (Mobile Drawer)", desc: "Мобильная шторка введения медикаментов" },
      { id: "23_game_icu_diagnosis_tab", title: "ОРИТ: Вкладка Постановка диагноза", desc: "Диагностическое заключение и верификация гипотезы" },
      { id: "23_game_icu_mobile_diagnose_view", title: "ОРИТ: Диагноз (Mobile)", desc: "Мобильный интерфейс постановки окончательного диагноза" },
    ]
  },
  {
    category: "6. Игровые режимы: Приёмное, Стационар, Поликлиника",
    items: [
      { id: "24_game_admission_workspace", title: "Приёмное отделение (Admission)", desc: "Краткий анамнез, triage, ABCDE и выбор маршрута госпитализации" },
      { id: "25_game_stationary_workspace", title: "Стационар: Обход и суточный цикл", desc: "Дневники курации, виталы по дням, план лечения" },
      { id: "26_game_stationary_anamnesis_illness", title: "Стационар: Анамнез заболевания", desc: "История развития настоящего заболевания" },
      { id: "27_game_stationary_anamnesis_life", title: "Стационар: Анамнез жизни", desc: "Хронические заболевания, аллергии, противопоказания" },
      { id: "28_game_outpatient_workspace", title: "Поликлиника (Outpatient Desk)", desc: "Амбулаторный прием, план обследования и маршрутизация" },
    ]
  },
  {
    category: "7. Дебрифинг и Экран результатов (ResultScreen)",
    items: [
      { id: "29_result_summary_overview", title: "Результаты: Обзор и оценка ОСКЭ", desc: "Итоговый балл (0-100), исход пациента, дельты виталов, звезды" },
      { id: "30_result_errors_tab", title: "Результаты: Анализ ошибок & Дебрифинг", desc: "Опасные назначения, пропущенные тесты, когнитивные ловушки" },
      { id: "31_result_theory_tab", title: "Результаты: Рекомендации Минздрава", desc: "Связанные протоколы и клинреки по завершенному диагнозу" },
      { id: "32_result_timeline_tab", title: "Результаты: Поминутный таймлайн", desc: "Хронология каждого решения, заказа теста и введения препарата" },
    ]
  }
];

function buildHtml() {
  const devices = [
    { key: "desktop", label: "💻 Desktop (1440 × 900)" },
    { key: "tablet", label: "📱 Tablet (820 × 1180)" },
    { key: "mobile", label: "📱 Mobile (390 × 844)" }
  ];

  let html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MedSim — Полный визуальный аудит интерфейсов</title>
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111827;
      --accent: #06b6d4;
      --border: #1f2937;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 24px;
    }
    header {
      max-width: 1400px;
      margin: 0 auto 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    h1 { font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
    .subtitle { font-size: 14px; color: var(--text-muted); margin-top: 4px; }
    .device-switcher {
      display: flex;
      background: var(--card-bg);
      padding: 4px;
      border-radius: 10px;
      border: 1px solid var(--border);
      gap: 4px;
    }
    .device-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .device-btn.active {
      background: var(--accent);
      color: #000;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    .category-title {
      font-size: 19px;
      font-weight: 700;
      color: var(--accent);
      margin: 36px 0 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(6, 182, 212, 0.2);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 20px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, border-color 0.2s;
    }
    .card:hover {
      border-color: rgba(6, 182, 212, 0.5);
      transform: translateY(-2px);
    }
    .img-box {
      width: 100%;
      height: 240px;
      background: #000;
      overflow: hidden;
      position: relative;
      cursor: zoom-in;
    }
    .img-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      transition: transform 0.3s;
    }
    .img-box:hover img {
      transform: scale(1.03);
    }
    .info {
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .item-title { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 4px; }
    .item-desc { font-size: 12px; color: var(--text-muted); line-height: 1.4; margin-bottom: 12px; }
    .open-btn {
      margin-top: auto;
      display: inline-block;
      text-align: center;
      padding: 7px 12px;
      background: rgba(255,255,255,0.06);
      color: #38bdf8;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      border-radius: 6px;
      border: 1px solid rgba(56, 189, 248, 0.2);
      transition: background 0.2s;
    }
    .open-btn:hover { background: rgba(56, 189, 248, 0.15); }
    /* Modal Zoom */
    #lightbox {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.92);
      z-index: 9999;
      justify-content: center;
      align-items: center;
      padding: 20px;
      cursor: zoom-out;
    }
    #lightbox img {
      max-width: 95vw;
      max-height: 95vh;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.8);
      object-fit: contain;
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>MedSim — Фотоотчет интерфейсов и режимов</h1>
      <div class="subtitle">Полноэкранный визуальный аудит всех экранов, вкладок и модальных окон (96 снимков)</div>
    </div>
    <div class="device-switcher">
      ${devices.map((d, i) => `<button class="device-btn ${i === 0 ? "active" : ""}" onclick="switchDevice('${d.key}', this)">${d.label}</button>`).join("\n")}
    </div>
  </header>

  <div class="container">
`;

  for (const sec of sections) {
    html += `    <div class="category-title">${sec.category}</div>\n    <div class="grid">\n`;
    for (const item of sec.items) {
      // Check if image exists for desktop
      const imgPathDesktop = `screenshots/desktop/${item.id}.png`;
      html += `      <div class="card" data-id="${item.id}">
        <div class="img-box" onclick="zoomImage(this)">
          <img src="${imgPathDesktop}" alt="${item.title}" loading="lazy" />
        </div>
        <div class="info">
          <div class="item-title">${item.title}</div>
          <div class="item-desc">${item.desc}</div>
          <a class="open-btn" href="${imgPathDesktop}" target="_blank">Открыть в полном разрешении ↗</a>
        </div>
      </div>\n`;
    }
    html += `    </div>\n`;
  }

  html += `  </div>

  <div id="lightbox" onclick="this.style.display='none'">
    <img id="lightbox-img" src="" alt="Zoomed view" />
  </div>

  <script>
    let currentDevice = 'desktop';

    function switchDevice(device, btn) {
      currentDevice = device;
      document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.card').forEach(card => {
        const id = card.getAttribute('data-id');
        const img = card.querySelector('img');
        const link = card.querySelector('.open-btn');
        const newSrc = 'screenshots/' + device + '/' + id + '.png';
        img.src = newSrc;
        link.href = newSrc;
      });
    }

    function zoomImage(box) {
      const src = box.querySelector('img').src;
      const lb = document.getElementById('lightbox');
      const lbImg = document.getElementById('lightbox-img');
      lbImg.src = src;
      lb.style.display = 'flex';
    }
  </script>
</body>
</html>`;

  return html;
}

const html = buildHtml();
fs.writeFileSync(path.join(OUT_DIR, "gallery.html"), html, "utf-8");
console.log("Visual gallery generated at: " + path.join(OUT_DIR, "gallery.html"));
