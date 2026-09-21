# MedSim — Живой трекер проекта (PROJECT_TRACKER)

> **Статус проекта**: Фаза 0 в процессе подготовки  
> **Последний стабильный коммит**: `01172b5`  
> **Окружение**: GitHub Actions CI подключен, MCP-серверы проверены и настроены.

---

## 📌 Текущий активный этап: ФАЗА 0 (Архитектурный фундамент в `main`)

Цель: Зафиксировать точки расширения, каркасы и контракты в `main`, чтобы оба разработчика не пересекались по общим файлам.

| Шаг | Подзадача | Файлы | Статус |
| :---: | :--- | :--- | :---: |
| **0.1** | Создать файл-якорь и систему фиксации контекста | `PROJECT_TRACKER.md`, `GEMINI.md` | [x] Выполнено |
| **0.2** | Настроить CI/CD и окружение (`.env.example`, `ci.yml`) | `.github/workflows/ci.yml`, `.env.example` | [x] Выполнено |
| **0.3** | Отключить неиспользуемый Postgres MCP, активировать проект в Serena | `mcp_config.json`, Serena memory | [x] Выполнено |
| **0.4** | Добавить локализацию специальности «Гастроэнтерология» | `src/locale/ru.js`, `src/locale/en.js` | [ ] В очереди |
| **0.5** | Добавить категорию и иконку ЖКТ в меню | `src/screens/menu/menuUtils.js` | [ ] В очереди |
| **0.6** | Создать каталог специальности с пустым реестром `GASTRO_CASES = []` | `src/data/cases/gastroenterology/index.js` | [ ] В очереди |
| **0.7** | Подключить `GASTRO_CASES` в общий реестр кейсов | `src/data/cases/index.js` | [ ] В очереди |
| **0.8** | Добавить настройку `patientDialogueMode` в стейт | `src/hooks/useSettings.js` | [ ] В очереди |
| **0.9** | Добавить тумблер ИИ-пациента в модалку настроек | `src/screens/menu/MenuSettingsModal.jsx` | [ ] В очереди |
| **0.10**| Создать каркас виджета ИИ-пациента | `src/components/game/chat/PatientDialogueWidget.jsx` | [ ] В очереди |
| **0.11**| Создать 4 компонента-вкладки экрана результатов | `src/components/result/tabs/*.jsx` | [ ] В очереди |
| **0.12**| Перевести `ResultScreen.jsx` на табовый рендер | `src/screens/ResultScreen.jsx` | [ ] В очереди |
| **0.13**| Финальная верификация сборки и коммит в `main` | `npm run build`, `npm run validate` | [ ] В очереди |

---

## 🎯 Контракты данных (НЕ ИЗМЕНЯТЬ БЕЗ СОГЛАСОВАНИЯ)

### 1. Формат объекта ошибки в `result.mistakes[]`
```javascript
{
  id: "string",             // e.g. "err_wrong_nsaid"
  category: "treatment" | "diagnostic" | "anamnesis" | "tactical",
  severity: "critical" | "warning" | "info",
  title: "string",          // Краткое название ошибки
  reason: "string",         // Клиническое объяснение
  penalty: number,          // Штраф в баллах (0, 5, 15)
  guidelineRef: "string"    // Ссылка на пункт КР Минздрава РФ
}
```

### 2. Пропсы виджета ИИ-пациента (`PatientDialogueWidget`)
```javascript
<PatientDialogueWidget
  caseData={cd}
  patientState={ps}
  mode={settings.patientDialogueMode} // "hybrid" | "standard"
  onRevealAnamnesis={(key) => {}}
/>
```

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
