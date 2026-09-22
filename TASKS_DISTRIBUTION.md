# MedSim — Матрица распределения задач и зон ответственности разработчиков

> **Статус**: Готов к параллельной разработке  
> **Базовая ветка**: `main` (проверена: 0 ошибок ESLint, 14/14 E2E тестов Playwright пройдены, сборка Vite стабильна)  
> **Золотое правило проекта**: **Любой создаваемый или модифицируемый файл строго не должен превышать 180 строк** (средний целевой размер модулей: 45–120 строк).

---

## 🧭 Архитектурное разделение: «Нулевое пересечение» (0% File Conflicts)

Чтобы два разработчика могли работать полностью параллельно без merge-конфликтов:
- **Разработчик 2** берёт на себя **дизайн, UI/UX, экраны и рабочую станцию врача**.
- **Разработчик 1** берёт на себя **логику ИИ-пациента, дерево вопросов-ответов, связку с LLM и сбор анамнеза**.

---

## 🎨 РАЗРАБОТЧИК 2: ДИЗАЙН, UI/UX И РАБОЧАЯ СТАНЦИЯ ВРАЧА

### 🌿 Git-ветка:
```bash
git checkout main
git pull origin main
git checkout -b feat/ui-redesign-workstation
```

### 🎯 Задачи Разработчика 2:
1. **Этап 1 (Приоритет №1): Редизайн рабочей станции врача (Game Screen / Workstation)**
   - Эргономика левой колонки (карта больного, статус, жалобы).
   - Редизайн правой колонки (табы обследования, назначений, диагноза МКБ-10 и маршрутизации).
   - Оформление мониторов витальных функций (HUD, ЭКГ-полоса, графики динамики).
   - Нижний таймлайн событий, критические алерты и модальные окна реассессмента.
   - Адаптивность под мобильные экраны (MobileWorkstation).
2. **Этап 2: Редизайн экрана результатов (ResultScreen)**
   - Оформление 4 вкладок: Сводка (`ResultSummaryTab`), Разбор ошибок (`ResultErrorsTab`), Теория (`ResultTheoryTab`), Таймлайн (`ResultTimelineTab`).
3. **Этап 3: Редизайн главного меню и каталога кейсов (MenuScreen)**
   - Сетка карточек кейсов, фильтры по специальностям, сайдбары, шапка и окно настроек.

### 📁 ЗОНА РАЗРАБОТЧИКА 2 (Файлы, в которых работает только он):
```text
src/ui/                                        <-- Дизайн-система, темы, UI-компоненты
  ├── theme.js
  ├── ThemeContext.jsx
  ├── components.jsx
  └── icons.jsx (добавление иконок)
src/index.css                                  <-- Глобальные стили, анимации, HUD-эффекты

src/screens/game/                              <-- Контейнеры игровых экранов
  ├── EmergencyGameScreen.jsx
  ├── InpatientGameScreen.jsx
  ├── OutpatientGameScreen.jsx
  ├── ICUGameScreen.jsx
  ├── stationary/*                             <-- Модули стационара (PatientCard, StepBar, MorningPanel...)
  └── outpatient/*                             <-- Модули поликлиники (HistoryPanel, StepBar, DiagnosisForm...)

src/components/game/workstation/               <-- Рабочая станция врача
  ├── DesktopWorkstation.jsx
  ├── MobileWorkstation.jsx
  ├── WorkstationTimelineBar.jsx
  ├── WorkstationOverlays.jsx
  ├── PatientRecordColumn.jsx                  <-- Общая разметка левой колонки
  ├── DiagTab.jsx
  ├── treat/*                                  <-- Панель и группы назначений
  └── diagnosis/*                              <-- Секции диагноза, МКБ-10, критериев и маршрутизации

src/components/game/vitalMonitor/              <-- Мониторы и приборы
  ├── VitalSignsHUD.jsx
  ├── ECGCanvas.jsx
  ├── VitalsStrip.jsx
  └── VitalsGraphModal.jsx

src/components/game/abcde/                     <-- Панели осмотра ABCDE

(Позже в Этапах 2 и 3):
src/screens/ResultScreen.jsx
src/components/result/tabs/*
src/screens/MenuScreen.jsx
src/screens/menu/*
```

> 💡 **Свобода выбора стека:** Разработчик 2 обладает полной свободой в выборе инструментов стилизации (CSS-in-JS, CSS Modules, Tailwind CSS или чистый CSS) при условии сохранения модульности (<180 строк на файл) и отсутствия ошибок линтера.

---

## 🧠 РАЗРАБОТЧИК 1 (МЫ): ЛОГИКА ИИ-ПАЦИЕНТА, ДИАЛОГИ И МЕДИЦИНСКИЕ ДВИЖКИ

### 🌿 Git-ветка:
```bash
git checkout main
git pull origin main
git checkout -b feat/ai-patient-dialogue
```

### 🎯 Задачи Разработчика 1:
1. **Полноценный интерактивный виджет опроса (`PatientDialogueWidget`)**:
   - Быстрые чипсы опроса по клиническим доменам (жалобы, характер боли, анамнез заболевания, сопутствующие болезни, аллергии).
   - Свободный ввод вопросов врачом с интеллектуальной классификацией тем.
   - Учёт эмоционального и физического статуса больного (одышка, боль по ВАШ, уровень сознания ШКГ, паника).
2. **Движок вопросов-ответов и генерации реплик**:
   - Детерминированное извлечение анамнеза из структуры клинического кейса (`caseData.complaint`, `caseData.anamnesis`, `caseData.lifeHistory`, `caseData.exam`).
   - Локальный оффлайн-движок ответов пациента (`localPatientResponse.js`).
   - Интеграция с LLM API (через `llmService.js`) при наличии ключа/сети с бесшовным откатом на локальные ответы.
3. **Регистрация выявленных клинических фактов**:
   - Передача открытых данных в сессионный хук (`onRevealAnamnesis` -> `revealedAnamnesis`) для учёта в скоринге качества диагностики.
4. **Тестирование диалога**:
   - Автономные тесты сопоставления вопросов (`tests/patient-dialogue.test.mjs`).
   - E2E сценарий опроса пациента в Playwright (`e2e/patient-dialogue.spec.js`).

### 📁 ЗОНА РАЗРАБОТЧИКА 1 (Файлы, в которых работает только он):
```text
src/components/game/chat/                      <-- Все модули виджета ИИ-пациента
  ├── PatientDialogueWidget.jsx                <-- Контейнер и координатор опроса
  ├── DialogueMessageList.jsx                  <-- Рендер сообщений (доктор / пациент)
  ├── QuickInterviewChips.jsx                  <-- Чипсы быстрых вопросов по анатомии/симптомам
  ├── FreeformQuestionInput.jsx                <-- Инпут свободного вопроса
  └── index.js

src/engine/dialogue/                           <-- Движок клинического опроса
  ├── dialogueTreeEngine.js                    <-- Маппинг вопросов на симптомы и анамнез кейса
  ├── patientPersonalityEngine.js              <-- Модификаторы речи (одышка, оглушение, шок, боль)
  └── index.js

src/engine/                                    <-- Сервисы ИИ и промпты
  ├── llmService.js
  ├── llmPrompts.js
  └── localPatientResponse.js

src/hooks/                                     <-- Хук логики диалога
  └── usePatientDialogue.js

tests/                                         <-- Тесты диалога
  └── patient-dialogue.test.mjs

e2e/                                           <-- Playwright E2E тест диалога
  └── patient-dialogue.spec.js
```

---

## 🤝 ТОЧКА СТЫКОВКИ (Интерфейсный контракт без конфликтов)

Единственная точка соприкосновения двух зон — это подключение виджета `<PatientDialogueWidget />` в разметку [`src/components/game/workstation/PatientRecordColumn.jsx`](file:///c:/Users/мишка/Desktop/redesigned-broccoli-main/redesigned-broccoli/src/components/game/workstation/PatientRecordColumn.jsx).

Интерфейс вызова зафиксирован и неизменен:
```jsx
<PatientDialogueWidget
  caseData={cd}
  patientState={ps}
  mode={patientDialogueMode}
  onRevealAnamnesis={onRevealAnamnesis}
  isMobile={isMobile}
/>
```
- **Разработчик 2** отвечает за внешнее позиционирование, отступы и обрамление карточки в колонке.
- **Разработчик 1** отвечает за всё, что происходит **внутри** папки `src/components/game/chat/` и движков `src/engine/dialogue/`.
- Пересечение по строкам кода равно **0**.

---

## 🔒 ОБЩИЕ / ЗАМОРОЖЕННЫЕ ФАЙЛЫ (READ-ONLY)

Следующие файлы **запрещено изменять** без предварительного согласования обоими разработчиками:
- `src/data/cases/*` (клиническая база 67 кейсов)
- `src/engine/problemListEngine.js`
- `src/engine/reassessmentEngine.js`
- `playwright.config.js`
- `package.json` (добавление библиотек только по согласованию)

---

## ✅ КОНТРОЛЬНЫЙ ЧЕК-ЛИСТ ПЕРЕД КАЖДЫМ КОММИТОМ

Перед отправкой изменений в Git каждый разработчик обязан выполнить:
1. `npm run lint` — **0 ошибок, 0 warnings**.
2. `npm test` — **14 из 14 Playwright тестов пройдены**.
3. `npm run validate` — **все медицинские кейсы валидны**.
4. `npm run build` — **Vite собирает production-бандл без сбоев**.
5. Проверить размер изменённых файлов: **строго до 180 строк**.
