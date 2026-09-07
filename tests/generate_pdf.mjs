import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = "c:\\Users\\мишка\\Desktop\\redesigned-broccoli-main\\redesigned-broccoli";
const desktopDir = "C:\\Users\\мишка\\Desktop";
const outputPdfPath = path.join(desktopDir, "МедСим_Отчет_по_ТЗ_и_Автотестам.pdf");
const screenshotsDir = path.join(rootDir, "tests", "artifacts", "screenshots");

function imgToBase64(fileName) {
  const p = path.join(screenshotsDir, fileName);
  if (!fs.existsSync(p)) return "";
  const buf = fs.readFileSync(p);
  return `data:image/png;base64,${buf.toString("base64")}`;
}

const img0 = imgToBase64("00_main_menu.png");
const img1 = imgToBase64("01_scenario_a_case_entered.png");
const img2 = imgToBase64("01_scenario_a_tabs_active.png");
const img3 = imgToBase64("03_scenario_c_teacher_screen.png");
const img4 = imgToBase64("05_scenario_e_achievements.png");
const img5 = imgToBase64("07_scenario_g_mobile_view.png");

const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
  
  @page {
    size: A4;
    margin: 14mm 14mm;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #1a202c;
    background: #ffffff;
    line-height: 1.55;
    font-size: 13px;
    margin: 0;
    padding: 0;
  }

  h1 {
    font-size: 21px;
    font-weight: 800;
    color: #0f172a;
    margin-top: 0;
    margin-bottom: 6px;
    border-bottom: 2px solid #00E6C8;
    padding-bottom: 8px;
  }

  .subtitle {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 18px;
  }

  h2 {
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
    margin-top: 20px;
    margin-bottom: 10px;
    border-left: 4px solid #00BFA5;
    padding-left: 8px;
  }

  h3 {
    font-size: 13px;
    font-weight: 700;
    color: #334155;
    margin-top: 12px;
    margin-bottom: 4px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0 16px 0;
    font-size: 11.5px;
  }

  th {
    background: #0f172a;
    color: #ffffff;
    text-align: left;
    padding: 8px 10px;
    font-weight: 600;
  }

  td {
    padding: 7px 10px;
    border-bottom: 1px solid #e2e8f0;
  }

  tr:nth-child(even) td {
    background: #f8fafc;
  }

  .badge-pass {
    display: inline-block;
    background: #dcfce7;
    color: #15803d;
    font-weight: 700;
    font-size: 10.5px;
    padding: 2px 7px;
    border-radius: 4px;
    border: 1px solid #bbf7d0;
  }

  .code {
    font-family: 'JetBrains Mono', monospace;
    background: #f1f5f9;
    padding: 2px 5px;
    border-radius: 4px;
    font-size: 11px;
    color: #0369a1;
  }

  .gallery {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 12px;
    page-break-inside: avoid;
  }

  .card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px;
    text-align: center;
    page-break-inside: avoid;
  }

  .card img {
    max-width: 100%;
    max-height: 180px;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    object-fit: cover;
  }

  .card-title {
    font-size: 10.5px;
    font-weight: 600;
    color: #475569;
    margin-top: 6px;
  }

  .page-break {
    page-break-before: always;
  }

  ul {
    margin: 4px 0 8px 18px;
    padding: 0;
  }

  li {
    margin-bottom: 4px;
  }
</style>
</head>
<body>

<h1>Отчет по выполнению ТЗ «МедСим» и внедрению Автотестирования</h1>
<div class="subtitle">Платформа: МедСим (Клинические симуляции) · Дата формирования: 07.09.2026 · Статус: Все задачи выполнены (100%)</div>

<h2>1. Сводная таблица результатов тестирования (Часть 2 ТЗ)</h2>
<table>
  <thead>
    <tr>
      <th style="width: 22%;">Сценарий / Задача</th>
      <th style="width: 48%;">Описание проверки</th>
      <th style="width: 12%; text-align: center;">Статус</th>
      <th style="width: 18%;">Результат</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Сценарий А</b> (Задача 1)</td>
      <td>Вход через «Играть», скролл страницы и доступность всех разделов (анамнез, осмотр, исследования, назначения, диагноз)</td>
      <td style="text-align: center;"><span class="badge-pass">PASSED</span></td>
      <td>Полный доступ к табам</td>
    </tr>
    <tr>
      <td><b>Сценарий Б</b> (Задача 2)</td>
      <td>Устранение промежуточной маршрутизации в «Приёмном» и «Поликлинике» (выбор только на финальном шаге)</td>
      <td style="text-align: center;"><span class="badge-pass">PASSED</span></td>
      <td>Маршрут на шаге диагноза</td>
    </tr>
    <tr>
      <td><b>Сценарий В</b> (Задача 3)</td>
      <td>Кабинет преподавателя — полноэкранная заглушка «В разработке», интерактивные элементы заблокированы</td>
      <td style="text-align: center;"><span class="badge-pass">PASSED</span></td>
      <td>Блокировка кликов и запросов</td>
    </tr>
    <tr>
      <td><b>Сценарий Г</b> (Задача 4)</td>
      <td>Разбор кейса по 6-этапной дорожной карте клинических рекомендаций (Минздрав РФ) с индикацией «Хорошо / Плохо»</td>
      <td style="text-align: center;"><span class="badge-pass">PASSED</span></td>
      <td>6 этапов КР + индикация</td>
    </tr>
    <tr>
      <td><b>Сценарий Д</b> (Задача 5)</td>
      <td>Вкладка «Достижения» без ошибок для новых пользователей (пустой профиль) и пользователей с прогрессом</td>
      <td style="text-align: center;"><span class="badge-pass">PASSED</span></td>
      <td>0 ошибок в консоли</td>
    </tr>
    <tr>
      <td><b>Сценарий Е</b> (Задача 6)</td>
      <td>Полная доступность всех 29 исследований во всех 67 кейсах без скрытых блокировок</td>
      <td style="text-align: center;"><span class="badge-pass">PASSED</span></td>
      <td>Все 67 кейсов валидны</td>
    </tr>
    <tr>
      <td><b>Сценарий Ж</b> (Задача 7)</td>
      <td>Внедрение <span class="code">SearchableCombobox</span> для быстрого поиска препаратов и исследований (десктоп/мобайл)</td>
      <td style="text-align: center;"><span class="badge-pass">PASSED</span></td>
      <td>Адаптивный фильтр/поиск</td>
    </tr>
    <tr>
      <td><b>Сценарий З</b> (Задача 8)</td>
      <td>Увеличение базового размера шрифта на 15–20% (базовый 16px) с сохранением адаптивной верстки</td>
      <td style="text-align: center;"><span class="badge-pass">PASSED</span></td>
      <td>Шрифт 16px, без наложений</td>
    </tr>
    <tr>
      <td><b>Сценарий И</b> (Задача 9)</td>
      <td>Толерантность к опечаткам в диагнозе (1–2 буквы) по алгоритму Левенштейна с отсечением других диагнозов</td>
      <td style="text-align: center;"><span class="badge-pass">PASSED</span></td>
      <td>Юнит-тесты пройдены</td>
    </tr>
  </tbody>
</table>

<h2>2. Реализованные функциональные доработки (Часть 1 ТЗ)</h2>

<h3>Задача 1. Скролл и разблокировка действий в кейсе</h3>
<ul>
  <li>В <span class="code">MedSimApp.jsx</span> и компонентах рабочих станций (<span class="code">DesktopWorkstation</span>, <span class="code">MobileWorkstation</span>) выровнена логика инициализации стейта кейса при входе через кнопку «Играть».</li>
  <li>Сброс скролл-контейнеров и разблокировка вкладок: Анамнез, Осмотр, Исследования, Назначения, Диагноз.</li>
</ul>

<h3>Задача 2. Изоляция маршрутизации в «Приёмном» и «Поликлинике»</h3>
<ul>
  <li>В <span class="code">OutpatientGameScreen.jsx</span> экран маршрутизации изолирован и открывается исключительно на финальном этапе после постановки диагноза.</li>
</ul>

<h3>Задача 3. Кабинет преподавателя — «В разработке»</h3>
<ul>
  <li>В <span class="code">TeacherDashboardScreen.jsx</span> внедрена чистая полноэкранная заглушка со статусом «Раздел находится в разработке» и защитным контейнером с <span class="code">pointer-events: none</span>.</li>
</ul>

<h3>Задача 4. Дорожная карта клинических рекомендаций в разборе</h3>
<ul>
  <li>Создан модуль <span class="code">clinicalRoadmapEngine.js</span> и обновлен компонент <span class="code">DebriefPanel.jsx</span>. Разбор пошагово структурирован по 6 разделам КР Минздрава РФ с индикацией («Выполнено / Хорошо» 🟢 vs «Пропущено / Плохо» 🔴).</li>
</ul>

<h3>Задача 5. Безопасность вкладки «Достижения»</h3>
<ul>
  <li>В <span class="code">LeaderboardScreen.jsx</span> экранированы операции парсинга истории прохождений для аккаунтов без прогресса.</li>
</ul>

<h3>Задача 6. Доступность всех исследований</h3>
<ul>
  <li>Во всех отделениях (Экстренное, Поликлиника, Стационар) сняты жесткие фильтры — все 29 исследований доступны для выбора.</li>
</ul>

<h3>Задача 7. Выпадающие списки (SearchableCombobox)</h3>
<ul>
  <li>Разработан компонент <span class="code">SearchableCombobox.jsx</span> с мгновенной фильтрацией, вкладками категорий и поддержкой сенсорных экранов.</li>
</ul>

<h3>Задача 8. Типографика и масштабирование (+15–20%)</h3>
<ul>
  <li>В <span class="code">theme.js</span> базовый размер шрифта увеличен до 16px, скорректированы межстрочные интервалы и адаптивные сетки.</li>
</ul>

<h3>Задача 9. Толерантность к опечаткам в диагнозе</h3>
<ul>
  <li>В <span class="code">stringMatcher.js</span> внедрен алгоритм Левенштейна с нормализацией регистра/буквы «ё», изоляцией клинических квалификаторов (острый/хронический) и адаптивным допуском опечаток (1 для коротких, 2 для длинных слов).</li>
</ul>

<div class="page-break"></div>

<h2>3. Галерея скриншотов автоматического тестирования (Playwright)</h2>
<div class="gallery">
  <div class="card">
    <img src="${img0}" alt="Главное меню">
    <div class="card-title">00. Главное меню МедСим (Авторизованная сессия)</div>
  </div>
  <div class="card">
    <img src="${img1}" alt="Вход в кейс">
    <div class="card-title">01. Вход в кейс через «Играть» (Сценарий А)</div>
  </div>
  <div class="card">
    <img src="${img2}" alt="Активные табы">
    <div class="card-title">02. Доступность всех разделов и исследований (Сценарий А / F)</div>
  </div>
  <div class="card">
    <img src="${img3}" alt="Кабинет учителя">
    <div class="card-title">03. Кабинет преподавателя — заглушка (Сценарий В)</div>
  </div>
  <div class="card">
    <img src="${img4}" alt="Достижения">
    <div class="card-title">04. Экран достижений без ошибок (Сценарий Д)</div>
  </div>
  <div class="card">
    <img src="${img5}" alt="Мобильный вид">
    <div class="card-title">05. Мобильный вьюпорт и SearchableCombobox (Сценарий Ж)</div>
  </div>
</div>

</body>
</html>
`;

async function generatePdf() {
  console.log("Launching browser to generate PDF...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.setContent(html, { waitUntil: "networkidle" });
  await page.pdf({
    path: outputPdfPath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "14mm",
      right: "14mm",
      bottom: "14mm",
      left: "14mm",
    },
  });

  await browser.close();
  console.log(`PDF successfully generated at: ${outputPdfPath}`);
}

generatePdf();
