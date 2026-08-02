# MedSim — AGENTS.md

## КРИТИЧЕСКОЕ ПРАВИЛО: НАЧАЛО СЕССИИ

**ПЕРВЫМ ДЕЛОМ** при начале каждой сессии:
1. Прочитать `TASKS.md` — это трекер задач проекта
2. Прочитать `medsim-tz-v4.md` — это ТЗ, единственный источник истины
3. Убедиться, что `TASKS.md` и `AGENTS.md` синхронизированы

**ПЕРЕД КОММИТОМ** проверять:
1. `npm run lint` — 0 ошибок
2. Все файлы < 200 строк
3. `node scripts/validate-cases.mjs` — 0 ошибок

---

## Конвенции кода

1. **Early returns** — избегать вложенности `if/else`
2. **Native JS** — стандартная библиотека в приоритете над зависимостями
3. **Удалять мёртвый код** — `console.log`, закомментированное, неиспользуемые imports
4. **Файлы < 200 строк** — разбивать при превышении
5. **JSDoc** — комментарии для функций
6. Перед добавлением кода проверить, нельзя ли переиспользовать существующий

> ESLint + Prettier + Husky + lint-staged настроены: коммит автоматически прогоняет линт и формат.

---

## Roadmap — все блоки завершены

| № | Блок | Статус | Что делается |
|---|---|---|---|---|
| 0.5 | **П** | ✅ | Разделение `emergency` → `icu` + `admission` |
| 1 | **Р** | ✅ | Разделение анамнеза жизни/заболевания |
| 2 | **И** | ✅ | Закрытие 6 находок отчёта 23.07 (medsim-tz-gaps.md) |
| 3 | **К** | ✅ | Реестр ревью + сверка с cr.minzdrav.gov.ru |
| 4 | **Л** | ✅ | Curriculum mode |
| 5 | **Н** | ✅ | Прозрачность КР для игрока |
| 6 | **М** | ✅ | Обучающий режим |
| 7 | **У** | ✅ | Ревизия справочника диагностики (v5) |
| 8 | **Ф** | ✅ | Ревизия справочника лечений (v5) |
| 9 | **С** | ✅ | Новая механика Поликлиники (v5) |
| 10 | **Т** | ✅ | Медицинские правки кейсов (v5) |
| 11 | **Х** | ✅ | Прочие исправления (v5) |

---

## Архитектура (подробно)

```
src/
├── MedSimApp.jsx          # Главный компонент (фазы приложения)
├── main.jsx               # Точка входа + глобальные стили
├── ui/
│   ├── components.jsx     # UI-компоненты (Vital, GCSBadge, PainBadge, Btn, CheckRow, TimerCircle, ResultCard)
│   ├── ThemeContext.jsx   # Тема (dark/light) + useTheme hook
│   └── theme.js           # Цвета тем (DARK, LIGHT, FONT, CODE, SER)
├── screens/
│   ├── MenuScreen.jsx     # Меню + выбор случая + статистика + настройки
│   ├── GameScreen.jsx     # Тонкий диспетчер: маршрутизация по отделениям
│   ├── ResultScreen.jsx   # Результаты + дебрифинг (curriculum, route, stationary)
│   ├── TheoryScreen.jsx   # Теория + справочник + протоколы + курс (curriculum mode)
│   ├── QuizModal.jsx      # Модальное окно тестирования (onResult callback)
│   ├── LeaderboardScreen.jsx  # Достижения + статистика
│   ├── CertificateScreen.jsx  # Сертификаты (17 шт.)
│   ├── OnboardingScreen.jsx   # 7-шаговый онбординг
│   └── game/
│       ├── EmergencyGameScreen.jsx    # ОРИТ: order→results→diagnose→treat
│       ├── OutpatientGameScreen.jsx   # Поликлиника: order→results→diagnose+route
│       ├── StationaryGameScreen.jsx   # Стационар: morning→order→results→treat (суточный цикл)
│       ├── OutpatientPanels.jsx       # Панели поликлиники
│       ├── StationaryPanels.jsx       # Панели стационара
│       ├── StationaryHistoryPanel.jsx # Анамнез+осмотр стационара
│       ├── MobileEmergencyLayout.jsx  # Мобильный layout ОРИТ
│       └── DesktopEmergencyLayout.jsx # Десктоп layout ОРИТ
├── hooks/
│   ├── useGameSession.js  # Игровая логика (детериорация, таймер, подсчёт)
│   ├── useSettings.js     # Настройки + localStorage (learningMode, assessmentMode, progressionMode)
│   ├── useProgress.js     # Прогресс + Curriculum (localStorage: темы, тесты, очередь курса)
│   ├── useStationaryCycle.js  # Суточный цикл стационара (день, виталы, назначения, выписка)
│   └── useIsMobile.js     # Определение мобильного устройства
├── locale/
│   ├── t.js               # Функция перевода
│   ├── useTranslate.js    # Hook перевода
│   ├── LocaleContext.jsx   # Контекст локализации
│   ├── ru.js              # Русская локализация
│   └── en.js              # Английская локализация
├── engine/
│   ├── patient.js         # Детериорация, вычисление исхода, clamp
│   ├── scoring.js         # Оценка (баллы, звёзды, штрафы)
│   ├── deterioration.js   # Чистые функции детериорации
│   └── severity.js        # Упрощённый индекс тяжести (SOFA-like, 0–20)
├── context/
│   └── AuthContext.jsx    # Контекст авторизации
├── api/
│   └── authApi.js         # API авторизации (localStorage)
└── data/
    ├── cases/
    │   ├── index.js              # Barrel export (65 кейсов)
    │   ├── outpatient.js         # 6 поликлинических случаев (correctRoute, routeOptions)
    │   ├── stationary.js         # 5 стационарных случаев (dayByDayPlan, dischargeCriteria)
    │   ├── cases_legacy.js       # Старый файл 35 случаев (не используется)
    │   └── emergency/
    │       ├── cardiac.js        # 9 кардиология
    │       ├── neuro.js          # 10 неврология
    │       ├── respiratory.js    # 6 пульмонология
    │       ├── infectious.js     # 5 инфекции
    │       ├── endocrine.js      # 3 эндокринология
    │       ├── toxicology.js     # 5 токсикология
    │       └── abdominal.js      # 4 хирургия
    ├── diagnostics.js     # 30 диагностических тестов
    ├── treatments.js      # 40 лечений + эффекты
    ├── topics.js          # Дерево тем (7 категорий, 35 тем) + маппинг тема→кейсы
    ├── theory.js          # 35 полных конспектов по всем темам
    ├── drugReference.js   # Справочник 40 препаратов
    ├── quiz.js            # 35 тестов (130 вопросов, смешанный формат)
    ├── protocols.js       # 5 протоколов (BLS, ACLS, ATLS, Sepsis, Stroke)
    └── certificates.js    # 17 сертификатов (общие + серия + режимы + специальности)
```

---

## Структура случая (CASES[])

```js
{
  id,                    // номер
  name,                  // "Фамипостроиливич Иванов Иван Иваныч" 
  age, gender,
  complaint,             // клиническая картина
  vitals: { bp, hr, rr, temp, spo2 },  // начальные ЖП
  initialGCS, initialPain,
  deterioration: {       // как меняются ЖП каждые 30 сек
    hr:+2, sbp:-2, rr:+1, spo2:-1, ...
  },
  deathThresholds: {     // при каких значениях пациент умирает
    sbp:48, spo2:65, gcs:4, hr:195
  },
  anamnesis, exam,       // клинические данные
  severity, category,    // critical/moderate, cardiac/neuro/etc
  diagnosis,             // что это вообще
  testResults: {ecg:"...", troponin:"🔴 ..."},  // результаты тестов
  needDiag: ["ecg", "troponin"],   // нужные тесты для диагностики
  needTreat: ["aspirin", "heparin"], // нужные лечения
  wrongTreat: ["metoprolol"],      // опасные лечения (штрафы)
  timeLimit: 12,                  // начальное время (минут)
  tip, debrief: {explain:"..."}    // совет и разбор
}
```

---

## Система оценки

Итоговый балл `score` (0–100), считается в `engine/scoring.js → computeScore`.

- **Диагноз** — текстовый ввод, доля совпавших слов (`diagMatchRatio`):
  - ≥ 0.6 → +35 (`diagCorrect`)
  - ≥ 0.3 → +20 (`diagPartial`)
  - > 0 → +10
- **needDiag** — пропорционально: `(верных тестов / всего) × 20`
- **needTreat** — пропорционально: `(верных лечений / всего) × 25`
- **wrongTreat** — каждое опасное лечение = −15 (не ниже 0)
- **Исход пациента** (`computeOutcome`):
  - stable → +20 | unstable → +10 | critical → +3 | dead → −20
- **Бонус за время** — 0-15 баллов за скорость
- **Оценка** (`grade`): ≥85 Отлично | ≥70 Хорошо | ≥50 Удовлетворительно | иначе Неудовлетворительно

---

## Локализация

- Два языка: **RU** (по умолчанию) и **EN**
- Переключение: настройки (⚙️) → Язык / Language
- Все компоненты используют `t("key")` через `useTranslate` hook
- Переводы в `src/locale/ru.js` и `src/locale/en.js`

---

## Статистика проекта

| Метрика | Значение |
|---------|----------|
| Случаи | 67 (55 emergency + 6 outpatient + 5 stationary + 1 tutorial) |
| Лечения | 40 |
| Диагностические тесты | 30 |
| Темы теории | 35 |
| Препараты | 40 |
| Тесты (вопросы) | 35 (130) |
| Протоколы | 5 |
| Сертификаты | 17 |
| Режимы игры | 4 (обычный, стресс, случайный, курс) + Learning mode + Assessment mode |
| Языки | 2 (RU, EN) |
| Специальности | 7 (cardiac, neuro, respiratory, infectious, endocrine, toxicology, abdominal) |
| Отделения | 4 (icu, admission, outpatient, stationary) |

---

## Текущее состояние — ВСЕ БЛОКИ ВЫПОЛНЕНЫ

Проект полностью завершён. Подробный трекер — в `TASKS.md`.

**Roadmap v4 (П–М):**
- Блок П — Разделение ОРИТ/Приёмного ✅
- Блок Р — Разделение анамнеза ✅
- Блок И — Закрытие 6 находок отчёта 23.07 ✅
- Блок К — Реестр ревью + сверка с КР ✅
- Блок Л — Curriculum mode ✅
- Блок Н — Прозрачность КР для игрока ✅
- Блок М — Обучающий режим ✅

**Roadmap v5 (У–Х):**
- Блок У — Ревизия справочника диагностики ✅
- Блок Ф — Ревизия справочника лечений ✅
- Блок С — Новая механика Поликлиники ✅
- Блок Т — Медицинские правки кейсов ✅
- Блок Х — Прочие исправления ✅
---

## Координация субагентов (Subagents Coordination System)

При решении нетривиальных задач координировать команду специализированных субагентов:

1. **Разбивать работу на независимые подзадачи.**
2. **Использовать специализированные роли субагентов:**
   - **`Software Architect & Engine Specialist`**: Проектирование чистой архитектуры компонентов, хуков, логики движка в `src/engine/`.
   - **`Medical Accuracy Auditor (Clinical Advisor)`**: Валидация медицинских кейсов, тестов, дозировок препаратов согласно `medsim-tz-v4.md` и клин. рекомендациям РФ.
   - **`Senior Frontend Engineer (UI/UX)`**: Верстка премиального Stripe/Linear интерфейса, адаптивность (`useIsMobile`), чистый JSX, без хардкода текстов (строго перевод через `t()`).
   - **`Localization & Translation Specialist`**: Синхронизация `ru.js` и `en.js` файлов перевода.
   - **`Senior Code Reviewer & Style Guard`**: Проверка качества кода, строгое соблюдение лимита строк в файлах (всегда < 200 строк).
   - **`Medical Student & UX Reviewer (Глас Студента)`**: Оценка продукта с точки зрения студента-медика 1–6 курса Лечебного дела / Медико-профилактического направления в РФ. Проверяет применимость теории для подготовки к аккредитации, экзаменам и портфолио, сравнивает с аналогами (Clinical Sense, Болеслав, MedVR) и предлагает улучшения UX и геймификации.
3. **Пайплайн прохождения фичи**:
   `Архитектура/Медицинский чек` -> `Реализация` -> `Перевод` -> `Ревью (Размер/Линт)` -> `Финальный коммит`.
4. **Валидация перед коммитом**:
   - `npm run lint` — 0 ошибок и предупреждений.
   - `node scripts/validate-cases.mjs` — 0 ошибок.
   - Все новые/измененные файлы строго < 200 строк.

---

## UI/UX, Frontend Architecture & Engineering Standards (Premium Design & Production Quality)

### Core Mission
Create premium, modern, production-ready interfaces and applications with exceptional design quality, clean code, excellent UX, type-safety, scalability, and a strong visual identity matching Apple Design Team, Linear, Stripe, and Vercel.

### Spacing, Spanning, and Typography
- Use strict spacing systems and whitespace intentionally.
- Highly structured typography hierarchy using professional fonts (Inter, Geist, SF Pro).
- Ensure high accessibility (WCAG) and readability.

### Engineering & React Rules
- Write real production code (no demo/mock logic, fake implementations, or simplified examples).
- Always use functional components with TypeScript or clean JSX, avoiding unnecessary re-renders.
- Create reusable components and keep them focused. Maximum lines per file: 200–300.
- Handle debugging systematically: analyze error message, find root cause, explain, and apply the correct fix. Never hide errors.

### Implementation Workflow
- Think like a world-class designer, senior developer, and product strategist.
- Pre-analyze requirements, sitemap, user flows, and data structures.
- Create component architecture, separate UI and logic, and use semantic HTML.
- Ensure layouts are fully responsive (mobile, tablet, desktop) and performant.
- Incorporate premium transitions, subtle micro-interactions, and visual polish.

---

## Правила работы

1. **Каждый PR** — lint + validate + проверка < 200 строк
2. **Тесты** — все тесты из ТЗ (Т-1…Т-20) должны пройти
3. **Документация** — обновлять `TASKS.md` после завершения каждой задачи
4. **Не отклоняться от ТЗ** — medsim-tz-v4.md является единственным источником истины

