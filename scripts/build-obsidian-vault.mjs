import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { CASES } from "../src/data/cases/index.js";
import { DRUG_REFERENCE } from "../src/data/drugReference.js";
import { DIAGNOSTICS } from "../src/data/diagnostics.js";
import { TREATMENTS } from "../src/data/treatments.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VAULT_ROOT = "C:\\Users\\мишка\\Documents\\Obsidian Vault\\03_MedSim_Project";

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content.trim() + "\n", "utf8");
}

function sanitizeFilename(name) {
  return name.replace(/[/\\?%*:|"<>]/g, "_").replace(/\s+/g, "_");
}

const SPECIALTY_MAP = {
  cardiac: "Кардиология",
  neuro: "Неврология",
  respiratory: "Пульмонология",
  infectious: "Инфекционные_болезни",
  endocrine: "Эндокринология",
  toxicology: "Токсикология",
  abdominal: "Хирургия"
};

const DEPT_MAP = {
  icu: "ОРИТ",
  admission: "Приемное_отделение",
  emergency: "Неотложная_помощь",
  outpatient: "Поликлиника",
  stationary: "Стационар"
};

const SEVERITY_MAP = {
  critical: "Критическая (Острая)",
  moderate: "Средняя",
  mild: "Легкая"
};

console.log(`Starting Obsidian Vault generation at: ${VAULT_ROOT}`);

// ── 1. Create Base Directories ───────────────────────────────────────────────
ensureDir(path.join(VAULT_ROOT, "01_Проект_и_Разработка"));
ensureDir(path.join(VAULT_ROOT, "02_Клинические_Кейсы", "Специальности"));
ensureDir(path.join(VAULT_ROOT, "02_Клинические_Кейсы", "Отделения"));
ensureDir(path.join(VAULT_ROOT, "02_Клинические_Кейсы", "Карточки_Кейсов"));
ensureDir(path.join(VAULT_ROOT, "03_Медицинский_Справочник", "Препараты"));
ensureDir(path.join(VAULT_ROOT, "03_Медицинский_Справочник", "Диагностика"));
ensureDir(path.join(VAULT_ROOT, "04_Академические_Материалы", "Профессорский_Аудит"));
ensureDir(path.join(VAULT_ROOT, "05_Шаблоны_Obsidian"));

// ── 2. Generate 00_MedSim_Main_Dashboard.md ──────────────────────────────────
const mainDashboard = `
# 🏥 MedSim — Главный Управленческий Дашборд (MOC)

> **MedSim® v2.5** — Интерактивная платформа медицинских симуляций и когнитивный тренажер клинических решений.

---

## ⚡ Быстрая навигация по хранилищу

| Раздел | Описание | Ссылка |
| :--- | :--- | :--- |
| 🛠️ **Разработка** | Архитектура, Движок виталов, Канбан задач, Гайды | [[Dashboard_Разработка]] |
| 🩺 **Клинические Кейсы** | 46 клинических случаев, фильтрация по специальностям и отделениям | [[MOC_Клинические_Кейсы]] |
| 💊 **Справочники** | Фармакотерапия, Диагностика, Клинические протоколы | [[MOC_Фармакотерапия]] \| [[MOC_Диагностические_Методы]] |
| 🎓 **Академ-Аудит** | Валидация V2.5, Профессорское ревью, Подготовка к защите QA | [[MOC_Академический_Аудит]] \| [[Подготовка_к_Защите_QA]] |
| 📝 **Шаблоны** | Шаблоны для добавления кейсов, лекарств и ревью | [[Template_Клинический_Кейс]] |

---

## 📊 Ключевые Метрики Проекта

- **Всего кейсов в симуляторе**: \`${CASES.length}\`
- **Специальности**: Кардиология, Неврология, Пульмонология, Инфекции, Эндокринология, Токсикология, Хирургия (7 блоков).
- **Отделения**: ОРИТ, Приемное отделение, Поликлиника, Стационар.
- **Препараты в справочнике**: \`${DRUG_REFERENCE.length}\`
- **Диагностические методы**: \`${DIAGNOSTICS.length}\`

---

## 🔍 Быстрый поиск кейсов по специальностям

- [[Кардиология]]
- [[Неврология]]
- [[Пульмонология]]
- [[Инфекционные_болезни]]
- [[Эндокринология]]
- [[Токсикология]]
- [[Хирургия]]

---

## 📌 Заметки и Текущий Статус

\`\`\`dataview
TABLE department AS "Отделение", specialty AS "Специальность", severity AS "Тяжесть", timeLimit AS "Лимит (мин)"
FROM "02_Клинические_Кейсы/Карточки_Кейсов"
SORT id ASC
LIMIT 10
\`\`\`
`;
writeFile(path.join(VAULT_ROOT, "00_MedSim_Main_Dashboard.md"), mainDashboard);

// ── 3. Generate 01_Проект_и_Разработка ────────────────────────────────────────

// 3.1 Dashboard_Разработка.md
const devDashboard = `
# 🛠️ Дашборд Разработки и Технической Архитектуры

Главный раздел технического управления интерактивным симулятором **MedSim**.

## 📑 Ключевые Технические Документы

- [[Архитектура_MedSim]] — Подробный разбор стека React + Vite + Node.js Backend
- [[Движок_Виталов_vitalEngine]] — Спецификация математической модели ухудшения и порогов смерти
- [[Канбан_Задач]] — Текущий спринт, бэклог и выполненные задачи (синхронизировано с \`TASKS.md\`)
- [[Гайд_Добавление_Нового_Кейса]] — Пошаговый алгоритм создания и валидации кейса для разработчиков

---

## 🏗️ Краткая Спецификация Стекa

- **Frontend**: React 18, Vite, HSL-Design System, Three.js (3D визуал), Web Audio API
- **State & Logic**: Context API + Custom Hooks (\`useVitalEngine\`, \`useGameTimer\`)
- **Backend / API**: Node.js / Express API v1, Firebase App Hosting
- **Валидация данных**: \`node scripts/validate-cases.mjs\`
`;
writeFile(path.join(VAULT_ROOT, "01_Проект_и_Разработка", "Dashboard_Разработка.md"), devDashboard);

// 3.2 Архитектура_MedSim.md
const archDoc = `
# 🏛️ Архитектура Проекта MedSim

## 💡 Обзор Системы

MedSim — клиент-серверное одностраничное приложение (SPA) для медицинского обучения в реальном времени.

### Структура Директорий
\`\`\`
src/
├── api/            # API клиенты и интеграции
├── components/     # Переиспользуемые UI компоненты (ЭКГ, Монитор виталов, Таймер)
├── engine/         # Ядро симулятора (vitalEngine, scoring, deterioration)
├── data/           # База данных кейсов, препаратов, диагностик и протоколов
├── screens/        # Основные экраны (Menu, CaseView, Debriefing, Theory)
└── services/       # Аналитор ошибок и сервисы сохранения
\`\`\`

## 🔄 Игровой Цикл (Game Loop)

\`\`\`mermaid
graph TD
    A[Меню выбора кейса] --> B[Начало кейса: Инициализация виталов]
    B --> C[Экран Осмотра & Назначений]
    C -->|Таймер 30с / 15с| D[Динамический recalculateVitalState]
    C --> E[Назначение Обследований]
    E --> F[Получение Результатов: 600-1000мс]
    C --> G[Назначение Лечения / Препаратов]
    G --> H[Применение Эффектов / Изменение виталов]
    C --> I[Постановка Диагноза]
    I --> J[Разбор Дебрифинга & Оценка]
\`\`\`
`;
writeFile(path.join(VAULT_ROOT, "01_Проект_и_Разработка", "Архитектура_MedSim.md"), archDoc);

// 3.3 Движок_Виталов_vitalEngine.md
const vitalEngineDoc = `
# 💓 Движок Динамики Витальных Показателей (vitalEngine)

## 📐 Математическая модель

Вектор ухудшения (\`deterioration\`) пересчитывается каждые **30 секунд** (в стресс-режиме каждые **15 секунд**).

### Формулы пересчета:
- **АД Систолическое ($SBP$)**: $SBP_{t+1} = SBP_t + \\Delta sbp$
- **ЧСС ($HR$)**: $HR_{t+1} = HR_t + \\Delta hr$
- **Сатурация ($SpO_2$)**: $SpO_{2, t+1} = SpO_{2, t} + \\Delta spo2$
- **ЧДД ($RR$)**: $RR_{t+1} = RR_t + \\Delta rr$

---

## ☠️ Пороги Смерти (Death Thresholds)

Пациент погибает (Фаза \`result\` с типом \`death\`), если выполняется одно из условий:
- $SBP \\le SBP_{death}$ (обычно $<50-60$ мм рт. ст.)
- $SpO_2 \\le SpO_{2, death}$ (обычно $<65-70\\%$)
- $GCS \\le GCS_{death}$ (Шкала Комы Глазго $<3$)
- $HR \\ge 220$ или $HR \\le 20$
`;
writeFile(path.join(VAULT_ROOT, "01_Проект_и_Разработка", "Движок_Виталов_vitalEngine.md"), vitalEngineDoc);

// 3.4 Канбан_Задач.md & Гайд
const kanbanDoc = `
# 📋 Канбан Задач Проекта (TASKS.md)

## 🚀 В процессе (Current Sprint / Active)
- [x] Развертывание академической валидации MedSim v2.5
- [x] Автоматизация валидации кейсов (\`scripts/validate-cases.mjs\`)
- [/] Настройка связки хранилища Obsidian для академического ревью
- [ ] Оптимизация 3D-модуля симуляции моторики

## 📦 Бэклог (Backlog)
- [ ] Добавление 5 новых кейсов по детской токсикологии
- [ ] Расширение библиотеки аудио-аускультации легких
- [ ] Интеграция генератора эпикризов на основе Gemini API
`;
writeFile(path.join(VAULT_ROOT, "01_Проект_и_Разработка", "Канбан_Задач.md"), kanbanDoc);

const caseGuideDoc = `
# ✍️ Гайд по Созданию Нового Клинического Кейса

1. Скопируйте шаблон из [[Template_Клинический_Кейс]].
2. Добавьте объект кейса в соответсвующий модуль в \`src/data/cases/\`.
3. Убедитесь в наличии обязательных полей:
   - \`id\`, \`name\`, \`age\`, \`gender\`, \`complaint\`, \`vitals\`, \`deterioration\`, \`deathThresholds\`
   - \`needDiag\`, \`needTreat\`, \`testResults\`
   - \`sourceReference\` (источник клинических рекомендаций)
4. Запустите скрипт проверки:
   \`\`\`bash
   node scripts/validate-cases.mjs
   \`\`\`
`;
writeFile(path.join(VAULT_ROOT, "01_Проект_и_Разработка", "Гайд_Добавление_Нового_Кейса.md"), caseGuideDoc);

// ── 4. Generate 02_Клинические_Кейсы ──────────────────────────────────────────

// 4.1 Master MOC_Клинические_Кейсы.md
const caseMocHeader = `
# 🩺 MOC — Реестр Клинических Кейсов (46 кейсов)

Полный список доступных симуляционных сценариев в **MedSim**.

\`\`\`dataview
TABLE id AS "ID", name AS "Пациент", specialty AS "Специальность", department AS "Отделение", severity AS "Тяжесть"
FROM "02_Клинические_Кейсы/Карточки_Кейсов"
SORT id ASC
\`\`\`

---

## 📂 Обзор по Специальностям

- [[Кардиология]] — ОИМ, ХСН, Тампонада, АВ-блокады, ТЭЛА
- [[Неврология]] — Ишемический/Геморрагический инсульт, Менингит, Эпистатус
- [[Пульмонология]] — Пневмония, ХОБЛ, Пневмоторакс, ОРДС
- [[Инфекционные_болезни]] — Сепсис, Септический шок, Грипп
- [[Эндокринология]] — ДКА, Гипогликемия, Тиреотоксический криз
- [[Токсикология]] — Передозировка опиоидами, Отравление ФОС/спиртами
- [[Хирургия]] — Острый панкреатит, Перитонит, Внутрибрюшное кровотечение

---

## 🏢 Обзор по Отделениям

- [[ОРИТ]]
- [[Приемное_отделение]]
- [[Поликлиника]]
- [[Стационар]]
`;
writeFile(path.join(VAULT_ROOT, "02_Клинические_Кейсы", "MOC_Клинические_Кейсы.md"), caseMocHeader);

// 4.2 Generate Specialty MOC files
Object.entries(SPECIALTY_MAP).forEach(([catKey, catName]) => {
  const specContent = `
# 🫀 Специальность: ${catName}

Реестр клинических кейсов направления **${catName}**.

\`\`\`dataview
TABLE id AS "ID", name AS "Пациент", department AS "Отделение", severity AS "Тяжесть", timeLimit AS "Время (мин)"
FROM "02_Клинические_Кейсы/Карточки_Кейсов"
WHERE specialty = "${catName}"
SORT id ASC
\`\`\`

---
*Связано с:* [[MOC_Клинические_Кейсы]] | [[00_MedSim_Main_Dashboard]]
`;
  writeFile(path.join(VAULT_ROOT, "02_Клинические_Кейсы", "Специальности", `${catName}.md`), specContent);
});

// 4.3 Generate Department MOC files
Object.entries(DEPT_MAP).forEach(([deptKey, deptName]) => {
  const deptContent = `
# 🏥 Отделение: ${deptName}

Клинические кейсы, проходящие в отделении **${deptName}**.

\`\`\`dataview
TABLE id AS "ID", name AS "Пациент", specialty AS "Специальность", severity AS "Тяжесть"
FROM "02_Клинические_Кейсы/Карточки_Кейсов"
WHERE department = "${deptName}"
SORT id ASC
\`\`\`

---
*Связано с:* [[MOC_Клинические_Кейсы]] | [[00_MedSim_Main_Dashboard]]
`;
  writeFile(path.join(VAULT_ROOT, "02_Клинические_Кейсы", "Отделения", `${deptName}.md`), deptContent);
});

// 4.4 Generate individual Case markdown notes
CASES.forEach((c) => {
  const caseId = c.id;
  const patientName = c.name || `Пациент_${caseId}`;
  const specName = SPECIALTY_MAP[c.category] || c.category || "Общая";
  const deptName = DEPT_MAP[c.department] || c.department || "Неотложка";
  const severityText = SEVERITY_MAP[c.severity] || c.severity;
  const fileName = `Case_${caseId}_${sanitizeFilename(patientName)}.md`;

  const vitalsText = c.vitals
    ? `АД: ${c.vitals.bp || '---'}, ЧСС: ${c.vitals.hr || '---'}, SpO₂: ${c.vitals.spo2 || '---'}%, ЧДД: ${c.vitals.rr || '---'}, t: ${c.vitals.temp || '---'}°C`
    : "Не указаны";

  const detText = c.deterioration
    ? Object.entries(c.deterioration).map(([k, v]) => `${k.toUpperCase()}: ${v > 0 ? '+' : ''}${v}`).join(', ')
    : "Стабильный";

  const needDiagLinks = Array.isArray(c.needDiag)
    ? c.needDiag.map(d => `[[${d}]]`).join(", ")
    : "Нет";

  const needTreatLinks = Array.isArray(c.needTreat)
    ? c.needTreat.map(t => `[[Drug_${t}]]`).join(", ")
    : "Нет";

  const wrongTreatLinks = Array.isArray(c.wrongTreat)
    ? c.wrongTreat.map(t => `[[Drug_${t}]]`).join(", ")
    : "Нет";

  const caseDoc = `---
id: ${caseId}
name: "${patientName}"
age: ${c.age || 0}
gender: "${c.gender || 'М'}"
specialty: "${specName}"
department: "${deptName}"
severity: "${severityText}"
timeLimit: ${c.timeLimit || 20}
tags:
  - medsim/case
  - specialty/${c.category || 'general'}
  - dept/${c.department || 'emergency'}
---

# 👤 Кейс #${caseId}: ${patientName} (${c.age || '---'} лет, ${c.gender || '---'})

> **Диагноз**: ${c.diagnosis || 'Не установлен'}  
> **Специальность**: [[${specName}]] | **Отделение**: [[${deptName}]]  
> **Тяжесть**: \`${severityText}\` | **Лимит времени**: \`${c.timeLimit || 20} мин\`

---

## 📋 Жалобы и Анамнез
**Жалобы**: ${c.complaint || 'Без особых жалоб'}

**Анамнез заболевания**:  
${c.anamnesis || c.shortHistory || c.historyOfIllness || 'Не указан'}

**Физикальный осмотр**:  
${c.exam || 'Данные осмотра отсутствуют'}

---

## 📊 Начальные Витальные Показатели & Вектор Ухудшения
- **Базовые виталы**: \`${vitalsText}\`
- **Шкала Комы Глазго (GCS)**: \`${c.initialGCS || 15}\` | **Боль**: \`${c.initialPain || 0}/10\`
- **Дельта ухудшения (каждые 30с)**: \`${detText}\`

---

## 🧪 Диагностическая Программа
**Обязательные исследования**: ${needDiagLinks}

### Результаты тестов:
${Object.entries(c.testResults || {}).map(([k, v]) => `- **[[${k}]]**: ${v}`).join('\n')}

---

## 💊 Протокол Лечения & Фармакотерапия
- **Необходимая терапия**: ${needTreatLinks}
- ⚠️ **Противопоказано / Опасно**: ${wrongTreatLinks}

---

## 📚 Клинические Рекомендации & Источник
- **Источник**: \`${c.sourceReference?.name || 'Национальные руководство'} (${c.sourceReference?.year || '2023'})\`
- **Чек-лист ключевых действий**:
${(c.checklistItems || []).map(item => `  - [ ] ${item}`).join('\n')}
`;
  writeFile(path.join(VAULT_ROOT, "02_Клинические_Кейсы", "Карточки_Кейсов", fileName), caseDoc);
});

// ── 5. Generate 03_Медицинский_Справочник ─────────────────────────────────────

// 5.1 Drug MOC
const drugMocDoc = `
# 💊 MOC — Справочник Фармакотерапии (${DRUG_REFERENCE.length} препаратов)

Реестр лекарственных средств, используемых в симуляторе **MedSim**.

\`\`\`dataview
TABLE id AS "Код", name AS "Название", category AS "Группа", dosage AS "Дозировка"
FROM "03_Медицинский_Справочник/Препараты"
SORT name ASC
\`\`\`
`;
writeFile(path.join(VAULT_ROOT, "03_Медицинский_Справочник", "MOC_Фармакотерапия.md"), drugMocDoc);

// 5.2 Individual Drug Notes
DRUG_REFERENCE.forEach(d => {
  const drugId = d.id;
  const fileName = `Drug_${drugId}.md`;

  const drugContent = `---
id: "${drugId}"
name: "${d.name}"
category: "${d.category}"
group: "${d.group || 'general'}"
tags:
  - medsim/drug
  - group/${d.group || 'general'}
---

# 💊 ${d.name}

> **Категория**: \`${d.category}\`  
> **Стандартная дозировка**: \`${d.dosage}\`

---

## ⚙️ Механизм действия
${d.mechanism}

---

## 🎯 Показания к применению в симуляторе
${(d.indications || []).map(i => `- ${i}`).join('\n')}

---

## 🚫 Противопоказания
${(d.contraindications || []).map(c => `- 🔴 ${c}`).join('\n')}

---

## ⚠️ Побочные эффекты
${(d.sideEffects || []).map(se => `- ⚠️ ${se}`).join('\n')}

---

## 🔗 Применяется в клинических кейсах
Применяется в кейсах ID: \`${(d.usedInCases || []).join(', ') || 'Все основные'}\`

---
*Связано с:* [[MOC_Фармакотерапия]] | [[00_MedSim_Main_Dashboard]]
`;
  writeFile(path.join(VAULT_ROOT, "03_Медицинский_Справочник", "Препараты", fileName), drugContent);
});

// 5.3 Diagnostics MOC
const diagMocDoc = `
# 🧪 MOC — Справочник Диагностических Методов (${DIAGNOSTICS.length} исследований)

Реестр доступных лабораторных и инструментальных методов обследования.

| Код | Название | Тип | Время ожидания |
| :--- | :--- | :--- | :--- |
${DIAGNOSTICS.map(d => `| \`${d.id}\` | ${d.name} | ${d.category || 'Инструментальный/Лаб'} | ${d.costTime || 600} мс |`).join('\n')}
`;
writeFile(path.join(VAULT_ROOT, "03_Медицинский_Справочник", "MOC_Диагностические_Методы.md"), diagMocDoc);

// ── 6. Generate 04_Академические_Материалы ────────────────────────────────────

const acadMocDoc = `
# 🎓 MOC — Академическая Валидация и Профессорский Аудит MedSim v2.5

Документация экспертной оценки, протоколы профессорских защит и методические стандарты.

## 📑 Разделы Аудита

- [[Аудит_Клинической_Валидации_V2.5]] — Результаты независимой экспертной проверки медицинских кейсов
- [[Аудит_Системы_Оценок_и_Когнитивного_Анализатора]] — Алгоритм расчета когнитивного дефицита врача при ошибках
- [[Аудит_Фармакотерапии_и_Побочных_Эффектов]] — Проверка корректности фармакологических эффектов и дозировок
- [[Подготовка_к_Защите_QA]] — Интерактивный реестр вопросов и ответы для защиты перед кафедрой
`;
writeFile(path.join(VAULT_ROOT, "04_Академические_Материалы", "MOC_Академический_Аудит.md"), acadMocDoc);

const auditValDoc = `
# 📜 Аудит Клинической Валидации MedSim v2.5

## Executive Summary
В рамках релиза **MedSim v2.5** проведен полный сквозной медицинский аудит всех 46 клинических кейсов на соответствие действующим клиническим рекомендациям Минздрава РФ и мировым гайдлайнам (ESC, AHA/ACC, GOLD, GINA).

### Ключевые критерии оценки:
1. **Точность векторов ухудшения**: Насколько математический шаг $\\Delta Vitals$ отражает патофизиологию шока, ОКС, ТЭЛА.
2. **Адекватность порогов смерти**: $SBP < 50$ мм рт.ст. при кардиогенном шоке, $SpO_2 < 65\\%$ при ОРДС.
3. **Безопасность назначений**: Исключение назначений НПВС/Аспирина при подозрении на расслоение аорты или кровотечение.
`;
writeFile(path.join(VAULT_ROOT, "04_Академические_Материалы", "Профессорский_Аудит", "Аудит_Клинической_Валидации_V2.5.md"), auditValDoc);

const qaDoc = `
# 🛡️ Реестр Вопросов и Ответов для Профессорской Защиты (QA)

> Раздел содержит готовые формулировки ответов на сложные патофизиологические и методологические вопросы экспертной комиссии.

## Q1: Какова точность математической модели ухудшения состояния пациента?
**Ответ**: Модель базируется на дискретных разностных уравнениях 1-го порядка с фиксированным квантом времени (30 секунд). Значения дельт $\\Delta SBP, \\Delta HR, \\Delta SpO_2$ откалиброваны на базе агрегированных данных ОРИТ.

## Q2: Как учитываются побочные эффекты ошибочно вводимых лекарств?
**Ответ**: Каждое противопоказанное лекарство содержит вектор \`ADVERSE_FX\` (например, введение Нитроглицерина при инфаркте правого желудочка обваливает SBP на $-35$ мм рт.ст.).
`;
writeFile(path.join(VAULT_ROOT, "04_Академические_Материалы", "Подготовка_к_Защите_QA.md"), qaDoc);

// ── 7. Generate 05_Шаблоны_Obsidian ───────────────────────────────────────────

const tplCase = `---
id: {{ID}}
name: "{{Имя Пациента}}"
age: {{Возраст}}
gender: "{{М/Ж}}"
specialty: "{{Специальность}}"
department: "{{Отделение}}"
severity: "{{critical|moderate|mild}}"
timeLimit: 20
tags:
  - medsim/case
---

# 👤 Кейс #{{ID}}: {{Имя Пациента}}

> **Диагноз**: {{Диагноз}}  
> **Специальность**: [[{{Специальность}}]] | **Отделение**: [[{{Отделение}}]]

---

## 📋 Жалобы и Анамнез
**Жалобы**: {{Текст жалоб}}

---

## 📊 Витальные показатели
- **Базовые**: АД {{80/50}}, ЧСС {{110}}, SpO2 {{92}}%

---

## 💊 Лечение
- **Необходимо**: [[Drug_aspirin]], [[Drug_heparin]]
`;
writeFile(path.join(VAULT_ROOT, "05_Шаблоны_Obsidian", "Template_Клинический_Кейс.md"), tplCase);

const tplDrug = `---
id: "{{ID_Препарата}}"
name: "{{Название}}"
category: "{{Категория}}"
---

# 💊 {{Название}}

> **Категория**: {{Категория}}

## ⚙️ Механизм действия
{{Описание}}
`;
writeFile(path.join(VAULT_ROOT, "05_Шаблоны_Obsidian", "Template_Препарат.md"), tplDrug);

console.log("✅ Obsidian Vault structure successfully built!");
