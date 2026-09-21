# MedSim — Живой трекер проекта (PROJECT_TRACKER)

> **Статус проекта**: ✅ ФАЗА 0 УСПЕШНО ЗАВЕРШЕНА  
> **Окружение**: GitHub Actions CI подключен, MCP-серверы проверены и настроены.  
> **Готовность**: Репозиторий готов к безопасному ветвлению для двух разработчиков.

---

## 📌 Завершённый этап: ФАЗА 0 (Архитектурный фундамент в `main`)

Цель: Зафиксировать точки расширения, каркасы и контракты в `main`, чтобы оба разработчика не пересекались по общим файлам.

| Шаг | Подзадача | Файлы | Статус |
| :---: | :--- | :--- | :---: |
| **0.1** | Создать файл-якорь и систему фиксации контекста | `PROJECT_TRACKER.md`, `GEMINI.md` | [x] Выполнено |
| **0.2** | Настроить CI/CD и окружение (`.env.example`, `ci.yml`) | `.github/workflows/ci.yml`, `.env.example` | [x] Выполнено |
| **0.3** | Отключить неиспользуемый Postgres MCP, активировать проект в Serena | `mcp_config.json`, Serena memory | [x] Выполнено |
| **0.4** | Добавить локализацию специальности «Гастроэнтерология» | `src/locale/ru.js`, `src/locale/en.js` | [x] Выполнено |
| **0.5** | Добавить категорию и иконку ЖКТ в меню | `src/screens/menu/menuUtils.js`, `icons.jsx` | [x] Выполнено |
| **0.6** | Создать каталог специальности с пустым реестром `GASTRO_CASES = []` | `src/data/cases/gastroenterology/index.js` | [x] Выполнено |
| **0.7** | Подключить `GASTRO_CASES` в общий реестр кейсов | `src/data/cases/index.js` | [x] Выполнено |
| **0.8** | Добавить настройку `patientDialogueMode` в стейт | `src/hooks/useSettings.js` | [x] Выполнено |
| **0.9** | Добавить тумблер ИИ-пациента в модалку настроек | `src/screens/menu/MenuSettingsModal.jsx` | [x] Выполнено |
| **0.10**| Создать каркас виджета ИИ-пациента | `src/components/game/chat/PatientDialogueWidget.jsx` | [x] Выполнено |
| **0.11**| Создать 4 компонента-вкладки экрана результатов | `src/components/result/tabs/*.jsx` | [x] Выполнено |
| **0.12**| Перевести `ResultScreen.jsx` на табовый рендер | `src/screens/ResultScreen.jsx` | [x] Выполнено |
| **0.13**| Финальная верификация сборки и коммит в `main` | `npm run build`, `npm run validate` | [x] Выполнено |

---

## 📌 Завершённый этап: Декомпозиция GameScreen, Workstation и Панелей (`ab6d70a`)

Цель: Разгрузить монолитные компоненты рабочей станции врача (>300–460 строк), разбить их на модули до 150 строк и подготовить чистую эргономику под редизайн и ИИ-пациента.

| Шаг | Модуль | Исходный размер | Результат | Статус |
| :---: | :--- | :---: | :--- | :---: |
| **1.1** | `DiagnosisRoutingTab.jsx` | 468 строк | **103 строки** (вынесены `criteriaUtils.js`, `DiagnosisSearchSection.jsx`, `DiagnosisCriteriaSection.jsx`, `RoutingSection.jsx`, `DiagnosisFooter.jsx`) | [x] Выполнено |
| **1.2** | `DesktopWorkstation.jsx` | 323 строки | **263 строки** (вынесены `WorkstationTimelineBar.jsx` и `WorkstationOverlays.jsx`) | [x] Выполнено |
| **1.3** | `StationaryPanels.jsx` | 323 строки | **14 строк** (декомпозировано в `src/screens/game/stationary/`: `PatientCard`, `StepBar`, `MorningPanel`, `TestSelection`, `ResultsPanel`, `TreatPanel`) | [x] Выполнено |
| **1.4** | `ABCDEAssessmentPanel.jsx` | 358 строк | **119 строк** (вынесены `abcdeEngine.js`, `ABCDESummaryView.jsx`, `ABCDEStepTab.jsx`) | [x] Выполнено |
| **1.5** | Интеграция `PatientDialogueWidget` | — | Встроен в `PatientRecordColumn.jsx`, проброшен `patientDialogueMode` через `EmergencyGameScreen` и `MobileWorkstation` | [x] Выполнено |
| **1.6** | Верификация качества | — | ESLint (0 ошибок), Validator (67 кейсов валидны), Vite build (успешно 2.5с) | [x] Выполнено |

---

## 👥 Разделение зон ответственности после Фазы 0

### Разработчик 1 (Ветка: `feat/ui-redesign-results`)
* `src/screens/game/*` (редизайн игрового интерфейса под десктоп и мобилки)
* `src/components/result/tabs/*` (наполнение вкладок результатами без свалки)
* `src/screens/ResultScreen.jsx`
* `src/ui/*`

### Разработчик 2 (Ветка: `feat/gastro-ai-patient-scoring`)
* `src/data/cases/gastroenterology/*` (кейсы панкреатита, ЖКК, колита, цирроза)
* `src/components/game/chat/PatientDialogueWidget.jsx` (чипсы + запрос в LLM)
* `src/engine/scoring.js` (генерация единого массива `result.mistakes[]`)
* `src/engine/llmService.js`
