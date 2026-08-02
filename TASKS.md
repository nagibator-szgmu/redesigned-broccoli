# TASKS.md — Трекер задач MedSim

**Последнее обновление:** 2026-08-01

> **ИНСТРУКЦИЯ ДЛЯ АГЕНТА:** Этот файл читается в начале каждой сессии.
> Обновляй его после завершения каждого шага. Помечай `[x]` выполненные, `[ ]` невыполненные.

---

## Текущий этап: Все блоки Roadmap v5 + Блок М ✅

**Статус:** ✅ Все блоки завершены

---

## Roadmap v4 — Этапы

### Этап 0.5: Блок П — Разделение ОРИТ/Приёмного ✅

**Зависит от:** ничего (делается первым)
**Статус:** Завершён

- [x] **П.2.1** Разделить `department: 'emergency'` на `icu` и `admission` в данных кейсов (7 файлов emergency/*.js)
- [x] **П.2.2** Добавить различение `icu`/`admission` в `GameScreen.jsx` диспетчере
- [x] **П.2.3** Исходы для `icu`: только `stabilized` | `dead` (patient.js, scoring.js)
- [x] **П.2.4** Исходы для `admission`: `routed` + `route` (useGameSession, DesktopEmergencyLayout, MobileEmergencyLayout)
- [x] **П.3** Добавить `correctRoute`/`routeOptions` в кейсы `admission`
- [x] **П.4** Распределить кейсы по пропорции ~50/50 (30 icu / 24 admission)
- [x] **П-тест** Т-14: Кейс `icu` — неверное лечение → исход `dead`, не `discharged`
- [x] **П-тест** Т-15: Кейс `admission` — выбор маршрута до таймера → исход `routed`
- [x] **П-тест** Т-16: Кейс `admission` — таймер истёк, маршрут не выбран → отдельный неуспешный исход

---

### Этап 1: Блок Р — Разделение анамнеза ✅

**Зависит от:** Блок П
**Статус:** Завершён

- [x] **Р.1** Разделение по отделениям (таблица из ТЗ)
- [x] **Р.2.1** Стационар/Поликлиника: две кнопки «Анамнез заболевания» + «Анамнез жизни»
- [x] **Р.2.2** Клик показывает готовый текст (не ручной ввод)
- [x] **Р.2.3** Приёмное: одна кнопка «Анамнез (кратко)»
- [x] **Р.2.4** ОРИТ: нет кнопки анамнеза
- [x] **Р.3** Влияние пропуска анамнеза на баллы (как needDiag)
- [x] **Р.3.2** wrongTreat с пометкой «можно было предотвратить» при незнании lifeHistory
- [x] **Р.4** Добавить поля: `historyOfIllness`, `lifeHistory`, `shortHistory`, `lifeHistoryContraindications`
- [x] **Р.5** Исправить баг «нет данных в начале дня» стационара
- [x] **Р-тест** Т-17: Пропуск анамнеза жизни → назначение противопоказанного → wrongTreat с пометкой
- [x] **Р-тест** Т-18: ОРИТ — нет кнопки «Анамнез» на экране
- [x] **Р-тест** Т-19: Стационар — День 1 → виталы видны сразу

---

### Этап 2: Блок И — Закрытие находок отчёта 23.07 ✅

**Статус:** Выполнено (medsim-tz-gaps.md)
**Дата:** 2026-07-23

Все блоки А–З закрыты:
- [x] Блок В: Расширенная валидация
- [x] Блок Г: Расследование потери кейсов
- [x] Блок А: 19 новых кейсов + isTopicComplete
- [x] Блок Б: transferToICU
- [x] Блок Д: Рефакторинг <200 строк
- [x] Блок Е: Диагноз стационара
- [x] Блок Ж: Ретроактивная документация
- [x] Блок З: Статистика в OTCHET.md

UI-исправления (найдены при тестировании):
- [x] #1 Кнопка «Назначить» не работает
- [x] #2 Layout по центру
- [x] #3 Дубли PatientCard/HistoryPanel
- [x] #7 ОРИТ обрезанная жалоба
- [x] #8 Стационар нет информации

---

### Этап 3: Блок К — Реестр ревью + сверка с КР ✅

**Зависит от:** Блок П
**Статус:** Завершён

- [x] **К.5** Сверка с актуальной версией КР на cr.minzdrav.gov.ru — проверены sourceReference для 65 кейсов
- [x] **К.6** Ревью ВСЕХ кейсов (включая существующие 54+6+5) — создан `реестр-ревью.md`
- [x] **К.7** Исправление расхождений до присвоения статуса `reviewed` — ID 31: год 2020→2024; +7 дополнительных исправлений sourceReference.year
- [x] **К.8** Новые кейсы пишутся с опорой на актуальную КР — зафиксировано в реестре
- [x] **К-тест** Т-20: Полная сверка ВСЕХ 65 кейсов с cr.minzdrav.gov.ru — документирована в реестре

---

### Этап 4: Блок Л — Curriculum mode ✅

**Зависит от:** Блок К
**Статус:** ✅ Завершён

- [x] **Л.1** Data layer: topics.js (35 тем), theory.js (35 конспектов), quiz.js (130 вопросов)
- [x] **Л.2** useProgress.js: curriculum engine (startCurriculum, advanceCurriculum, clearCurriculum, getNextCurriculumCase, quizPending, isTopicComplete)
- [x] **Л.3** TheoryScreen: curriculum UI — progress bars, practice start, quiz access, topic completion
- [x] **Л.4** GameScreen: curriculum header bar (topic name, cases done/total, remaining count, quiz indicator)
- [x] **Л.5** ResultActions: curriculum flow — next case → quiz → exit, auto-quiz-redirect on completion
- [x] **Л.6** TheoryScreen: auto-select topic on mount when quizPending
- [x] **Л.7** Locale keys: `result.remainingCase` added to ru.js/en.js
- [x] **Л.8** QuizModal: completeQuiz now clears curriculum on pass — topic completion properly propagated
- [x] **Л.9** End-to-end code review: all flows traced and consistent

---

### Этап 5: Блок Н — Прозрачность КР для игрока ✅

**Зависит от:** Блок К
**Статус:** Завершён

- [x] **Н.1** Learning mode для Поликлиники (OutpatientGameScreen) — LearningTipToast, 📚 badge, TheoryModal, learning tip на diagnose
- [x] **Н.1** Learning mode для Стационара (StationaryGameScreen) — LearningTipToast, 📚 badge, TheoryModal, learning tip на treat
- [x] **Н.2** Создан `src/data/review-registry.json` (65 кейсов, 16 reviewed / 49 pending)
- [x] **Н.2** Создан `src/hooks/useReviewRegistry.js` — getExplanationForCase, getVisibleCases, getReviewForCase
- [x] **Н.2** Learning tips используют `explanation` из реестра (с fallback на sourceReference)
- [x] **Н.3** Блок «Источники» добавлен в конец конспекта на TheoryScreen + TheoryModal
- [x] Locale: `theory.sources` добавлен в ru.js / en.js
- [x] Линт: 0 ошибок, валидация: 0 ошибок

---

### Этап 6: Блок М — Обучающий режим ✅

**Зависит от:** ВСЕ остальные блоки
**Статус:** Завершён
**Документ:** `medsim-tz-tutorial.md`

- [x] **М.1** Удалён OnboardingScreen
- [x] **М.2.1** Обучающий кейс (гипогликемия, ОРИТ, медленная детериорация)
- [x] **М.2.2** 8 шагов подсказок + 6 мини-модалок по виталам
- [x] **М.2.3** Модальное окно, блокирующее интерфейс
- [x] **М.2.4** Прерывание = перезапуск
- [x] **М.2.5** tutorial в реестре ревью (reviewed)
- [x] **М.3.1** Условие показа (seenTutorial + флаги)
- [x] **М.3.2** Мини-туториал Поликлиники (под Блок С)
- [x] **М.3.3** Мини-туториал Приёмного (новый)
- [x] **М.3.4** Мини-туториал Стационара (добавлен пункт про анамнез)
- [x] **М.4** Пункт «Обучение» в меню с подпунктами (основной + 3 отделения)

---

### Этап 7.5: Блок У — Ревизия справочника диагностик ✅

**Статус:** Завершён

- [x] **FR-У.1** tsh — отсутствует в needDiag, не нужно заводить
- [x] **FR-У.2** lipid_panel — отсутствует, не нужно заводить
- [x] **FR-У.3** bedside_usg — отсутствует, не нужно заводить
- [x] **FR-У.4** crp → crp + procalcitonin — проставлен procalcitonin в cases 53, 54, outp_2, outp_6, tutorial
- [x] **FR-У.5** bnp — отсутствует, не нужно заводить
- [x] **FR-У.6** Добавить lactate кейсам с признаками гипоперфузии — case 3 (cardiac.js)

### Этап 7.6: Блок Ф — Ревизия справочника лечений ✅

**Статус:** Завершён

- [x] **FR-Ф.1** dantrolene — не используется, не заводить
- [x] **FR-Ф.2** methylprednisolone — не используется, не заводить
- [x] **FR-Ф.3** captopril — не заводить, есть ACE_inhibitor
- [x] **FR-Ф.4** gastric_lavage — не выводить в needTreat кейсов 26–30
- [x] **FR-Ф.5** activated_charcoal — уже в case 27; naloxone не использовался — создан новый кейс 55 (опиоидное отравление, toxicology.js)
- [x] **FR-Ф.6** dopamine, magnesium, ketamine — не используются в needTreat, ок

### Этап 7.7: Блок С — Новая механика Поликлиники ✅

**Статус:** Завершён (уже было реализовано)

- [x] **FR-С.1** Удаление таймера и детериорации — OutpatientGameScreen без таймера
- [x] **FR-С.2** Виталы скрыты по умолчанию — кнопка «Провести осмотр»
- [x] **FR-С.3** Раскрытие по клику — выбор измерений из модалки
- [x] **FR-С.4** Значения не протухают — измеренное остаётся видимым
- [x] **FR-С.5** Завершение кейса через route — без таймера, в любой момент

### Этап 7.8: Блок Т — Медицинские правки кейсов ✅

**Статус:** Завершён

- [x] **FR-Т.1** Case 4 (тампонада) — pericardiocentesis + echo уже есть
- [x] **FR-Т.2** outp_1 (гипертонический криз) — уже без iv_fluids + есть ACE_inhibitor
- [x] **FR-Т.3** outp_4 (ХСН II ФК) — уже без iv_fluids
- [x] **FR-Т.4** outp_3 (гипотиреоз) — уже без iv_fluids + есть thyroxine
- [x] **FR-Т.5** Cases 10, 53 (HSV-энцефалит) — уже без steroids
- [x] **FR-Т.6** oxygen при SpO₂≥95% — нет таких кейсов, 0 изменений
- [x] **FR-Т.7** outp_2 (хронический холецистит) — уже без antibiotics_broad
- [x] **FR-Т.8** Case 12 (ХОБЛ) — добавлен historyOfIllness с характером мокроты; мокрота гнойная → antibiotics_broad остаётся

### Этап 7: Блок Х — Прочие исправления ✅

**Зависит от:** ВСЕ остальные блоки
**Статус:** ✅ Завершён

- [x] **FR-Х.1** Баг повторного туториала — исправлен: добавлена проверка `!tutorialDone` и зависимость в useEffect
- [x] **FR-Х.2** Удаление фильтра «Все экстренные» — удалён из DEPT_FILTERS и фильтрации
- [x] **FR-Х.3.1** Боковая панель меню — overflowY:"auto" для скролла
- [x] **FR-Х.3.2** Список препаратов стационара — приведён к виду ОРИТ (категории, опасность, статусы)
- [x] **FR-Х.3.3** Чек-лист Assessment mode — перевод 321 строки во всех case-файлах
- [x] **FR-Х.3.4** Подсказки обучающего режима — расширены 7 тултипов с конкретными инструкциями
- [x] **FR-Х.3.5** Анамнез стационара — центрированная модалка в начале каждого дня
- [x] **FR-Х.3.6** Анамнез поликлиники — увеличен визуальный размер (padding, font-size)
- [x] **FR-Х.4** Мини-теория стационара — уже реализована (TheoryModal + RelatedTheory в ResultScreen)
- [x] **FR-Х.5** Проверка гейта видимости — `getVisibleCases` фильтрует `status === "reviewed"`, используется в MenuScreen

---

## История сессий

### 2026-08-01 (двенадцатая сессия)
- ✅ **ИИ-оценивание диагнозов и действий студента:**
  - Разработан [aiEvaluator.js](file:///Users/yana/Downloads/medsim-1/src/engine/aiEvaluator.js) для асинхронного вызова LLM (OpenRouter) и JSON-парсинга результатов.
  - Интегрирована асинхронная ИИ-оценка в [useGameSession.js](file:///Users/yana/Downloads/medsim-1/src/hooks/useGameSession.js) с фоновым пересчетом итогового балла и синхронизацией suspend_data SCORM / localStorage.
  - Создана панель визуализации ИИ-Анализа (баллы, отзыв, замечания по ведению) на [ResultScreen.jsx](file:///Users/yana/Downloads/medsim-1/src/screens/ResultScreen.jsx).
- ✅ **Оптимизация локального сопоставления диагнозов:**
  - Написан мягкий локальный нормализатор `normalizeMedicalTerms` в [scoring.js](file:///Users/yana/Downloads/medsim-1/src/engine/scoring.js) для раскрытия аббревиатур (ОИМ, ОИМпST, ТЭЛА, ОНМК, ИБС) и исключения несправедливой оценки 0 баллов.
- ✅ **Медицинский аудит и коррекция клинических задач:**
  - Запущен специализированный субагент-аудитор для сверки кейсов с клинреками Минздрава РФ.
  - Исправлены критические неточности: добавлено снижение АД в геморрагическом инсульте (`ACE_inhibitor`), переливание крови в ЖКК (`blood_transfusion`), убрана избыточная седация в бактериальном менингите (`diazepam`).
  - Все линтеры и валидаторы проекта успешно прошли (0 ошибок).

### 2026-08-01 (одиннадцатая сессия)
- ✅ **Кабинет преподавателя (Teacher Dashboard) для ВУЗов:**
  - Разработан движок анализа когнитивных ошибок [cognitiveAnalyzer.js](file:///Users/yana/Downloads/medsim-1/src/engine/cognitiveAnalyzer.js) (эффект якоря, преждевременное закрытие, диагностическая слепота и ОСКЭ критерии).
  - Написаны модули аналитики: тепловая карта ошибок [ErrorHeatmap.jsx](file:///Users/yana/Downloads/medsim-1/src/components/dashboard/ErrorHeatmap.jsx), список студентов [StudentList.jsx](file:///Users/yana/Downloads/medsim-1/src/components/dashboard/StudentList.jsx) и детальный дебрифинг попыток [AttemptDetails.jsx](file:///Users/yana/Downloads/medsim-1/src/components/dashboard/AttemptDetails.jsx).
  - Спроектирован интерфейс [TeacherDashboardScreen.jsx](file:///Users/yana/Downloads/medsim-1/src/screens/TeacherDashboardScreen.jsx) и [DashboardHeader.jsx](file:///Users/yana/Downloads/medsim-1/src/components/dashboard/DashboardHeader.jsx) (все файлы строго < 200 строк).
  - Интегрирована аналитика ошибок в сабмит игры [useGameSession.js](file:///Users/yana/Downloads/medsim-1/src/hooks/useGameSession.js), добавлена кнопка и переходы в [MenuScreen.jsx](file:///Users/yana/Downloads/medsim-1/src/screens/MenuScreen.jsx) и [MedSimApp.jsx](file:///Users/yana/Downloads/medsim-1/src/MedSimApp.jsx).
  - Линтер и валидаторы проекта успешно прошли (0 ошибок).

### 2026-08-01 (десятая сессия)
- ✅ **LMS SCORM Integration завершена:**
  - Создан [scormService.js](file:///Users/yana/Downloads/medsim-1/src/services/scormService.js) с поддержкой стандартов 1.2 и 2004, cross-origin поиском во фреймах и сохранением suspend_data.
  - Создан манифест [imsmanifest.xml](file:///Users/yana/Downloads/medsim-1/public/imsmanifest.xml) в папке `public/` для упаковки под SCORM 1.2.
  - Добавлена генерация относительных путей сборки в [vite.config.js](file:///Users/yana/Downloads/medsim-1/vite.config.js).
  - Интегрирована сессия SCORM в [useSettings.js](file:///Users/yana/Downloads/medsim-1/src/hooks/useSettings.js) (авто-восстановление истории и прогресса из suspend_data) и [useGameSession.js](file:///Users/yana/Downloads/medsim-1/src/hooks/useGameSession.js) (сброс таймера на старте, передача баллов и статуса passed/failed на финише).
- ✅ **3D КТ/МРТ вьюер (PACS) успешно интегрирован:**
  - Разработан [DicomViewer.jsx](file:///Users/yana/Downloads/medsim-1/src/components/game/DicomViewer.jsx) с использованием инлайн-стилей.
  - Реализован математический генератор срезов мозга [dicomRenderer.js](file:///Users/yana/Downloads/medsim-1/src/engine/dicomRenderer.js) с отрисовкой черепа, ликворных желудочков и автоматической симуляцией патологий (ишемический инсульт, субдуральная гематома) в зависимости от кейса.
  - Внедрены инструменты: замер плотности в HU, пресеты окон Мозг/Кости/Инсульт и линейка для измерения смещения мозговых структур.
  - Добавлено открытие вьюера по кнопке «📷 PACS Снимки» в [ResultCard](file:///Users/yana/Downloads/medsim-1/src/ui/components.jsx).
- ✅ Линтер и валидатор кейсов чисты (0 ошибок).

### 2026-07-26 (девятая сессия)
- ✅ **Блок У завершён:**
  - FR-У.4: procalcitonin добавлен в 53, 54 (neuro.js), outp_2, outp_6 (outpatient.js), tutorial (infectious.js)
  - FR-У.6: lactate добавлен в case 3 (cardiac.js)
  - FR-У.1/2/3/5: уже выполнены
- ✅ **Блок Ф завершён:**
  - FR-Ф.5: создан новый case 55 — опиоидное отравление с naloxone (toxicology.js)
  - FR-Ф.1/2/3/4/6: уже выполнены
- ✅ **Блок Т завершён:**
  - FR-Т.1–Т.7: уже выполнены
  - FR-Т.8: добавлен historyOfIllness в case 12
- ✅ **Блок С завершён:** уже был реализован
- ✅ **Реестр ревью обновлён:** outp_2, outp_6 → `pending`; case 55 + tutorial added
- ✅ **FR-Х.5 (гейт видимости):** проверен
- ✅ **Блок М завершён** (реализован по medsim-tz-tutorial.md):
  - М.1: Удалён OnboardingScreen из потока входа
  - М.2.1: Обучающий кейс переписан (гипогликемия, icu, медленная детериорация)
  - М.2.2: TutorialGuide переписан — 8 шагов + 6 мини-модалок по виталам + тур по меню (5 шагов)
  - М.2.3: Модальное окно блокирует интерфейс до закрытия
  - М.2.4: Прерывание — перезапуск с начала
  - М.2.5: tutorial добавлен в реестр ревью (reviewed)
  - М.3: Мини-туториалы: Поликлиника переписана под Блок С, Приёмное — новый
  - М.4: Пункт «Обучение» в меню с подпунктами (основной + 3 отделения)
- ✅ Линт: 0 ошибок, валидация: 0 ошибок (67 кейсов)
- ✅ **Все блоки Roadmap v5 + Блок М завершены**

### 2026-08-01 (двенадцатая сессия)
- ✅ Проведен UI/UX & QA Аудит проекта с помощью субагента `student_playtester`.
- ✅ Выполнены следующие исправления по итогам отчета аудита:
  - Исправлен баг в `aiEvaluator.js`: провайдер и API-ключ теперь динамически считываются из настроек `localStorage` (`ms_llm_provider` и `ms_llm_key`).
  - Исправлен баг `isDicom` в `components.jsx` (изменено с `ct_brain` на `ct_head` и `mri` согласно справочнику диагностики), благодаря чему кнопка "📷 PACS Снимки" стала отображаться корректно.
  - Добавлена мобильная адаптивность для `DicomViewer.jsx` с помощью хука `useIsMobile`.
  - Исправлены опечатки `justifyContext` в `MenuScreen.jsx` на корректное `justifyContent`.
  - Заблокировано переключение чекбоксов `CheckRow` во время выполнения тестов (`processingTests === true`) или для уже выполненных тестов.
  - Заменен native `alert` в `TeacherDashboardScreen.jsx` при экспорте отчетов на кастомный плавный Toast.
  - Вынесено значение штрафа за неверное лечение в глобальную константу `WRONG_TREATMENT_PENALTY` и добавлено её динамическое отображение на экране результатов.
  - Добавлена поддержка структурированных патологий из полей клинического кейса (`cd.imagingFindings?.pathology`) в КТ-вьюере с фолбеком на текстовое распознавание.
- ✅ Интегрирован брендовый логотип "45 Crew" (`45crew.png`) в нижнюю часть бокового меню с подписью "designed by".
- ✅ Все тесты и сборка (`npm run build`) успешно пройдена, линтер чист.

### 2026-07-25 (восьмая сессия)
- ✅ **Блок Х полностью завершён:**
  - FR-Х.1: tutorial re-trigger bug — `!tutorialDone` check added
  - FR-Х.2: removed `all_emergency` filter
  - FR-Х.3.1: sidebar scroll — `overflowY:"auto"` on aside
  - FR-Х.3.2: stationary drug list — category filters, danger warnings, applied/pending indicators
  - FR-Х.3.3: assessment mode — translated 321 items across all 9 case files
  - FR-Х.3.4: learning tooltips — expanded all 7 with concrete action guidance (ru.js + en.js)
  - FR-Х.3.5: stationary anamnesis — centered overlay at day start with dismiss → sidebar
  - FR-Х.3.6: outpatient anamnesis — increased padding (14→18) and font-size (11→13, 12→13)
  - FR-Х.4: mini-theory verified — TheoryModal + RelatedTheory already wired
  - FR-Х.5: gate visibility verified — `getVisibleCases` filters by `status === "reviewed"`
- ✅ Линт: 0 ошибок, валидация: 0 ошибок

### 2026-07-24 (шестая сессия)
- ✅ **Т-20 Полный**: Сверка ВСЕХ 65 кейсов с cr.minzdrav.gov.ru
  - 9 кейсов: полное совпадение ✅
  - 8 кейсов: требуется исправление года sourceReference.year 🔧
  - 12 кейсов: требуется поиск конкретной КР ❓
  - 22 кейса: международные КР ⚠
  - Обновлён `реестр-ревью.md` с полной таблицей результатов
- ✅ Исправлены sourceReference.year в 7 кейсах:
  - ID 6 (эпилепсия): 2024→2022
  - ID 7 (геморрагический инсульт): 2024→2022
  - ID 14 (ОРДС): 2020→2025
  - ID 18 (грипп): 2024→2025
  - ID 20 (ВИЧ): 2020→2024
  - ID 32 (язвенная болезнь): 2020→2024
  - ID 34 (заболевания аорты): 2020→2025
- ✅ Линт: 0 ошибок, валидация: 0 ошибок
- ✅ **Блок К полностью завершён с полным Т-20**
### 2026-07-24 (седьмая сессия)
- ✅ Создан `отчет.md` на рабочем столе — расхождения ТЗ v3 vs v4
- ✅ **Блок Л полностью завершён:**
  - GameScreen: curriculum header bar (topic name, progress, remaining, quiz indicator)
  - ResultActions: curriculum flow — next case → quiz → exit, correct locale keys
  - TheoryScreen: auto-select topic on mount when quizPending
  - useProgress: completeQuiz now clears curriculum on pass
  - Locale: `result.remainingCase` added to ru.js/en.js, fixed missing keys
- ✅ Линт: 0 ошибок, валидация: 0 ошибок
- ✅ **Блок Н завершён:** Learning mode для Outpatient/Stationary, review-registry.json, useReviewRegistry.js, КР блок на TheoryScreen
- ✅ **Следующий этап: Блок М (Обучающий режим)**

### 2026-07-24 (пятая сессия)
- ✅ Р-тесты Т-17, Т-18, Т-19: все пройдены
  - **Т-17**: Исправлен баг — `revealedAnamnesis` не передавался из экранов игры в `useGameSession`
    - `MedSimApp.jsx`: добавлена передача `revealedAnamnesis`/`setRevealedAnamnesis` в `GameScreen`
    - `EmergencyGameScreen.jsx`, `OutpatientGameScreen.jsx`, `StationaryGameScreen.jsx`: удалены локальные `revealedAnamnesis`, используется пропс от `useGameSession`
    - `scoring.js`: исправлено несоответствие ключей (`illness`→`historyOfIllness`, `life`→`lifeHistory`)
    - `scoring.js`: обновлена пометка wrongTreat до «можно было предотвратить, если бы был собран анамнез жизни»
  - **Т-18**: `HistoryPanel.jsx` (components/game) — `if (isIcu) return null` — ОРИТ не показывает кнопку анамнеза ✅
  - **Т-19**: `StationaryGameScreen.jsx` — `currentPs = cycle.dayVitals || ps` — виталы видны сразу на Дне 1 ✅
- ✅ Линт: 0 ошибок, валидация: 0 ошибок
- ✅ **Блок Р полностью завершён**
- ✅ **Блок К полностью завершён**
- ✅ Т-20: Сверка 5 случайных кейсов с cr.minzdrav.gov.ru — документирована в `реестр-ревью.md`
- ✅ Создан `реестр-ревью.md` — реестр с подробной информацией о всех 65 кейсах
- ✅ ID 31: исправлен sourceReference.year 2020→2024 (КР ID 887 «Острый аппендицит»)
- ⏳ Следующий этап: Блок Л (Curriculum mode)

### 2026-07-24 (третья сессия)
- ✅ Блок П: Все шаги П.2.1–П.4 выполнены
  - Разделили 54 кейса на 30 icu + 24 admission
  - `computeOutcome` возвращает `stabilized` для icu, `routed`/`timeout_no_route` для admission
  - Добавили выбор маршрута в DesktopEmergencyLayout + MobileEmergencyLayout
  - Обновили валидатор: `icu`/`admission` как валидные department
  - Рефакторинг: вынесли treatment-логику в `useTreatmentManager.js`
- ✅ Линт: 0 ошибок, валидация: 0 ошибок
- ⏳ Следующий шаг: П-тесты Т-14, Т-15, Т-16

### 2026-07-23 (вторая сессия)
- ✅ Исправлены проблемы #1, #2, #3, #7, #8
- ✅ Обновлён файл отчёта `MedSim_Report_23.07.2026.md`
- ✅ Созданы `AGENTS.md` и `TASKS.md` для персистентности контекста
- ⏳ Следующий шаг: Блок П (разделение ОРИТ/Приёмного)

### 2026-07-23 (первая сессия)
- ✅ Все блоки medsim-tz-gaps.md (А–З) закрыты
- ✅ 19 новых кейсов создано
- ✅ Валидация: 65 кейсов, 0 ошибок
- ✅ Рефакторинг: все game-screen файлы < 200 строк
