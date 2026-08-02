# Handoff Report — Explorer 1: Main Hub & Navigation System Refactoring Analysis

**Milestone**: Milestone 1 — MedSim UI/UX & Ergonomics Overhaul (Main Hub & Navigation)  
**Agent**: Explorer 1 (`teamwork_preview_explorer_m1_1`)  
**Date**: 2026-08-02  
**Target Component**: `src/screens/MenuScreen.jsx`  

---

## 1. Observation

### 1.1 Line Count & File Size Violation
- **File**: `src/screens/MenuScreen.jsx`
- **Current Total Lines**: **1,150 lines** (87,381 bytes).
- **Rule Violation**: `AGENTS.md` strictly mandates **"Файлы < 200 строк — разбивать при превышении"**. `MenuScreen.jsx` is almost 6x over the allowed 200-line ceiling.

### 1.2 Monolithic Architecture Breakdown
Direct examination of `src/screens/MenuScreen.jsx` (lines 1–1150) reveals that a single file handles at least 10 distinct UI/UX responsibilities:

1. **Utility & Notification Engine** (lines 14–89):
   - Category metadata helper `makeCatMeta(t)` (lines 14–22).
   - Navigation specialty list `makeNavSpec(t)` (lines 23–31).
   - Department filter options `DEPT_FILTERS(t)` (lines 33–39).
   - Notification calculation logic `buildNotifications(...)` (lines 41–89).
2. **Mobile Screen Layout** (lines 165–452):
   - Mobile top header bar (lines 169–204).
   - Mobile inline notifications portal (lines 207–225).
   - Mobile inline settings portal with developer API key settings (lines 226–312).
   - Search input (lines 314–339).
   - Horizontal department scroll filter & spec chips (lines 341–356).
   - Compact Mobile Hero banner (lines 358–370).
   - Single-column case card list (lines 372–435).
   - Fixed bottom stats bar with "NEW PATIENT" CTA (lines 437–451).
3. **Desktop Navigation Sidebar** (lines 470–609):
   - Brand logo & title ("МедСим СИМУЛЯТОР").
   - Navigation links: Main Menu, Theory, Course (Curriculum), Map, Leaderboard, Certificates, Teacher Dashboard ("Кабинет преподавателя").
   - Interactive Tutorial popover menu (lines 531–554) with course reset, tips launcher, and department mini-tutorials.
   - Department filter links (All, ICU, Admission, Outpatient, Stationary).
   - Specialty category filter links (Cardiac, Neuro, Respiratory, Infectious, Endocrine, Toxicology, Abdominal).
   - Logout action button & `ThreeDTicker` ("designed by") widget.
4. **Desktop Header Navigation Bar** (lines 614–658):
   - Section breadcrumbs ("Главное меню").
   - Integrated search bar with focus ring styling (`theorySearchFocused`).
   - Notification bell icon button with unread count badge dot.
   - Settings gear icon button.
5. **Desktop Notifications Modal Portal** (lines 660–689):
   - `createPortal` overlay anchored under the top header.
   - Notification cards with icons, read/unread status indicator, subtexts.
6. **Desktop Settings Modal Portal** (lines 691–843):
   - `createPortal` overlay for app preferences.
   - Difficulty level buttons (Easy, Normal, Hard).
   - Game Mode buttons (Normal, Random, Stress).
   - Learning Mode toggle, Audio toggle, Hide Warnings toggle, Theme selector (Dark, Light), Language selector (RU, EN).
   - Developer settings accordion toggle: LLM Provider selection (Gemini, OpenAI, OpenRouter), API key input, link to OpenRouter.ai.
   - Assessment mode toggle.
7. **Quick Specialization Filters Bar** (lines 849–879):
   - Horizontal chip list for instant filtering by specialty.
8. **Desktop Hero Section** (lines 882–967):
   - Cursor-position tracking radial glow (`onHeroMove`, `onHeroLeave`).
   - Animated SVG radar graphic with counter-rotating dashed rings, pulse dot, rotating arcs.
   - Headline banner ("КЛИНИЧЕСКИЙ СИМУЛЯТОР МедСим"), subtext, primary CTA ("▶ Начать"), secondary CTA ("🎯 Курс"), feature tags.
9. **Desktop Case Explorer Grid** (lines 969–1057):
   - Case section title ("Клинические кейсы" / search results count).
   - Case count badge, clear filter button, collapse/show-all toggle button.
   - 2-Column CSS Grid displaying case cards:
     - Category icon & color.
     - Severity rating dots (1–3 dots).
     - Patient name & age ("Иванов Иван, 54 л").
     - 2-line truncated complaint preview (`WebkitLineClamp: 2`).
     - Time limit badge (⏱ 12 мин with tooltip).
     - Severity triage badge (Critical, Moderate, Mild).
     - Best previous score badge (✓ 85).
     - "Старт" CTA button.
10. **Desktop Right Sidebar (Progress & Recent Sessions)** (lines 1060–1145):
    - Player Progress Card with SVG circular ring charts (cases completed vs total, average score).
    - Total points highlight box.
    - Large primary CTA button ("▶ НОВЫЙ ПАЦИЕНТ").
    - Recent Sessions list (last 5 played sessions with category icon, score, grade color, date, retry button).

### 1.3 Localization Audit Findings
Inspection of `src/locale/ru.js` and `src/locale/en.js` revealed hardcoded Russian strings in `MenuScreen.jsx` that lack translation keys:
- Line 191 & Line 529: `"Кабинет преподавателя"` (title / label).
- Line 255 & Line 781: `"🛠️ Для разработчиков (Свой ключ)"`.
- Line 275 & Line 802: `"Свой API-ключ (необязательно)..."`.
- Line 282 & Line 809: `"Для бесплатной игры без VPN зарегистрируйтесь на openrouter.ai..."`.
- Lines 538–549: `"ОСНОВНОЙ КУРС"`, `"Пройти заново"`, `"Показать подсказки"`, `"МИНИ-ТУТОРИАЛЫ"`.
- Line 556: Department sidebar header string split logic (`t("department.all").split(" ")[0]==="Все"?"ОТДЕЛЕНИЕ":"DEPARTMENT"`).

---

## 2. Logic Chain

1. **Line Count Constraint**: `AGENTS.md` requires every source file to be under 200 lines. `MenuScreen.jsx` is 1,150 lines. Therefore, refactoring into subcomponents is mandatory.
2. **Cohesion & Separation of Concerns**:
   - Helper functions (`makeCatMeta`, `makeNavSpec`, `DEPT_FILTERS`, `buildNotifications`) are pure functions and should live in a utility file (`menuUtils.js`).
   - The Desktop Header bar, Explorer Bar, Case Card, Case Grid, Hero, Sidebar, Right Sidebar, Notifications Modal, Settings Modal, and Mobile Layout perform distinct, independent tasks.
3. **Subcomponent Sizing Strategy**:
   - If we decompose `MenuScreen.jsx` into 12 targeted, single-responsibility files inside `src/screens/menu/`, each file will range between 75 and 180 lines, fully satisfying the < 200 lines rule.
4. **Localization Completeness**:
   - Adding missing keys (`nav.teacherDashboard`, `settings.devSection`, `settings.apiKeyPlaceholder`, `settings.openrouterGuide`, `tutorial.*`, `nav.departmentHeader`) to `ru.js` and `en.js` guarantees strict adherence to MedSim rule: "zero hardcoded user-facing strings".

---

## 3. Proposed Refactoring Architecture

We propose creating a modular subdirectory `src/screens/menu/` containing 11 subcomponents and utilities, with `src/screens/MenuScreen.jsx` serving as the clean top-level orchestrator under 120 lines.

### 3.1 Modular File Structure & Responsibilities

```
src/screens/
├── MenuScreen.jsx                    # (~110 lines) Top-level screen & view dispatcher
└── menu/
    ├── menuUtils.js                  # (~75 lines) Category meta, nav spec, buildNotifications
    ├── MenuHeader.jsx                # (~130 lines) Header nav bar (Search, Bell, Settings, Profile)
    ├── CaseExplorerBar.jsx           # (~135 lines) Unified search & filter bar (Depts, Specs, Modes)
    ├── CaseCard.jsx                  # (~115 lines) Modern case card (Triage badge, info, time, CTA)
    ├── CaseGrid.jsx                  # (~95 lines) Responsive 2-column grid wrapper & empty state
    ├── MenuHero.jsx                  # (~145 lines) Hero banner with cursor glow & animated SVG radar
    ├── MenuSidebar.jsx               # (~165 lines) Desktop navigation drawer (Brand, Links, Depts, Specs)
    ├── MenuRightSidebar.jsx          # (~135 lines) Right stats panel (SVG charts, total score, recent sessions)
    ├── MenuNotificationsModal.jsx    # (~85 lines) Portal overlay for notifications
    ├── MenuSettingsModal.jsx         # (~175 lines) Portal overlay for settings & LLM Dev key
    └── MenuMobileView.jsx            # (~150 lines) Mobile responsive layout container
```

### 3.2 Detailed Component Specs

#### 1. `src/screens/menu/menuUtils.js` (~75 lines)
- **Exports**: `makeCatMeta(t)`, `makeNavSpec(t)`, `DEPT_FILTERS(t)`, `buildNotifications(sessionHistory, casesPlayed, totalScore, t, catMeta)`.
- **Purpose**: Pure data transformations and notification engine logic, removing 80 lines of boilerplate from JSX components.

#### 2. `src/screens/menu/MenuHeader.jsx` (~130 lines)
- **Props**: `searchQuery`, `setSearchQuery`, `showNotif`, `openNotif`, `showSettings`, `setShowSettings`, `setShowNotif`, `unreadCount`, `setPhase`, `t`, `C`.
- **Features**: Top bar with brand label/breadcrumb, search input with focus state styling, notification bell button with unread red badge dot, settings gear launcher, teacher dashboard launcher.

#### 3. `src/screens/menu/CaseExplorerBar.jsx` (~135 lines)
- **Props**: `department`, `setDepartment`, `specFilter`, `setSpecFilter`, `deptFilters`, `navSpec`, `checkDeptTutorial`, `t`, `C`.
- **Features**: Filter controls bar:
  - Department filter buttons: All (🏥), ICU (🚑), Admission (🩻), Outpatient (🩺), Stationary (🛏️).
  - Specialization chip filters: All, Cardiology, Neurology, Pulmonology, Infectious, Endocrinology, Toxicology, Surgery.
  - Active selection indicators (accent border, glow dot).

#### 4. `src/screens/menu/CaseCard.jsx` (~115 lines)
- **Props**: `caseData`, `catMeta`, `caseScore`, `startGame`, `t`, `C`.
- **Features**: Modern, high-impact clinical case card:
  - Category icon & colored category badge (e.g. ❤️ Кардиология).
  - Severity dots rating (1–3 dots).
  - Patient Name & Age (`c.name, c.age л`).
  - 2-line clamped complaint preview (`c.complaint`).
  - Time limit badge (⏱ `c.timeLimit` мин) with hover tooltip.
  - Triage severity badge (Critical / Moderate / Mild).
  - Past score badge if completed (`✓ 92`).
  - Accent "Старт" CTA button.

#### 5. `src/screens/menu/CaseGrid.jsx` (~95 lines)
- **Props**: `cases`, `catMeta`, `caseScores`, `startGame`, `searchQuery`, `t`, `C`.
- **Features**: Responsive CSS grid wrapper (`gridTemplateColumns: "1fr 1fr"`). Displays empty search/filter result state when `visible.length === 0`, or maps `cases` to `CaseCard`.

#### 6. `src/screens/menu/MenuHero.jsx` (~145 lines)
- **Props**: `startGame`, `setProgressionMode`, `setPhase`, `theme`, `t`, `C`.
- **Features**: Premium showcase card:
  - Dynamic cursor-tracking glowing border effect (`heroMouse` state).
  - Animated 3D/SVG medical radar graphic with rotating concentric rings, dashed counter-rotating ring, and pulsing target dot.
  - Serifed Georgia title ("МедСим"), tagline, subtext.
  - Primary CTA button ("▶ Начать"), secondary CTA button ("🎯 Курс"), feature tags.

#### 7. `src/screens/menu/MenuSidebar.jsx` (~165 lines)
- **Props**: `setPhase`, `progressionMode`, `setProgressionMode`, `showTutorialMenu`, `setShowTutorialMenu`, `tutorialMenuRef`, `restartTutorial`, `showTutorialTips`, `forceShowDeptTutorial`, `department`, `setDepartment`, `checkDeptTutorial`, `specFilter`, `setSpecFilter`, `deptFilters`, `navSpec`, `logout`, `t`, `C`.
- **Features**: Left sidebar drawer with branding, main navigation links, tutorial popover dropdown menu, department menu items, specialty filter list, logout action button, `ThreeDTicker` widget.

#### 8. `src/screens/menu/MenuRightSidebar.jsx` (~135 lines)
- **Props**: `casesPlayed`, `totalScore`, `totalCasesCount`, `sessionHistory`, `catMeta`, `startGame`, `setShowAllCases`, `t`, `C`.
- **Features**: Right column dashboard:
  - Player Progress card featuring dual SVG circular progress rings (cases played vs total, average score), streak badge, total points card.
  - Large primary CTA button ("▶ НОВЫЙ ПАЦИЕНТ").
  - Recent Sessions history list (5 latest sessions, category icon, date, grade color, score, retry button).

#### 9. `src/screens/menu/MenuNotificationsModal.jsx` (~85 lines)
- **Props**: `showNotif`, `setShowNotif`, `notifications`, `readNotifIds`, `t`, `C`.
- **Features**: Overlay modal using `createPortal(..., document.body)`. Shows notifications list, unread indicators, close button.

#### 10. `src/screens/menu/MenuSettingsModal.jsx` (~175 lines)
- **Props**: `showSettings`, `setShowSettings`, `difficulty`, `setDifficulty`, `gameMode`, `setGameMode`, `learningMode`, `setLearningMode`, `assessmentMode`, `setAssessmentMode`, `audioEnabled`, `setAudioEnabled`, `hideWarnings`, `setHideWarnings`, `theme`, `setTheme`, `locale`, `setLocaleGlobal`, `LOCALES`, `llmProvider`, `setLlmProvider`, `llmKey`, `setLlmKey`, `showDevSettings`, `setShowDevSettings`, `t`, `C`.
- **Features**: Overlay modal for game preferences: Difficulty, Game Mode, Learning Mode toggle, Assessment Mode toggle, Audio, Hide Warnings, Theme, Language, Developer Settings accordion (LLM provider, custom API Key input).

#### 11. `src/screens/menu/MenuMobileView.jsx` (~150 lines)
- **Props**: All relevant state & handlers passed down from `MenuScreen`.
- **Features**: Responsive mobile-optimized view reusing sub-components where applicable or serving as dedicated touch-friendly container.

#### 12. `src/screens/MenuScreen.jsx` (~110 lines)
- **Purpose**: Main entry point component. Reads hooks (`useTheme`, `useLocale`, `useTranslate`, `useAuth`, `useIsMobile`), computes notification list & scores, and renders `MenuMobileView` (if mobile) or Desktop layout (`MenuSidebar`, `MenuHeader`, `CaseExplorerBar`, `MenuHero`, `CaseGrid`, `MenuRightSidebar`, `MenuNotificationsModal`, `MenuSettingsModal`).

---

## 4. Required Translation Keys (`ru.js` & `en.js`)

To eliminate hardcoded UI strings, the following keys must be added during implementation:

```javascript
// src/locale/ru.js additions
nav: {
  ...
  teacherDashboard: "Кабинет преподавателя",
  departmentHeader: "ОТДЕЛЕНИЕ",
},
settings: {
  ...
  devSection: "🛠️ Для разработчиков (Свой ключ)",
  apiKeyPlaceholder: "Свой API-ключ (необязательно)...",
  openrouterGuide: "Для бесплатной игры без VPN зарегистрируйтесь на openrouter.ai, создайте бесплатный ключ (API Key) в разделе Keys и вставьте его сюда.",
},
tutorial: {
  mainCourse: "ОСНОВНОЙ КУРС",
  restart: "Пройти заново",
  showTips: "Показать подсказки",
  miniTutorials: "МИНИ-ТУТОРИАЛЫ",
}
```

```javascript
// src/locale/en.js additions
nav: {
  ...
  teacherDashboard: "Teacher Dashboard",
  departmentHeader: "DEPARTMENT",
},
settings: {
  ...
  devSection: "🛠️ Developer Settings (Custom Key)",
  apiKeyPlaceholder: "Custom API Key (optional)...",
  openrouterGuide: "For free play without VPN, register on openrouter.ai, create a free API Key in the Keys section, and paste it here.",
},
tutorial: {
  mainCourse: "MAIN COURSE",
  restart: "Restart Tutorial",
  showTips: "Show Tips",
  miniTutorials: "MINI-TUTORIALS",
}
```

---

## 5. Caveats

1. **Read-Only Scope**: In accordance with Explorer role rules, no code changes in `src/` were made during this investigation phase.
2. **CSS Animation Keyframes**: `fadeUp` and `@keyframes glowPulse` keyframes are currently declared inline inside `<style>` tags in `MenuScreen.jsx`. During refactoring, these should be placed in `src/ui/global.css` or kept cleanly in a top-level shared styles block to avoid duplicated keyframe declarations.

---

## 6. Conclusion

- `src/screens/MenuScreen.jsx` is currently an unmaintainable 1,150-line monolith that violates the project's strict < 200 lines rule.
- The proposed 12-file modular architecture breaks down `MenuScreen` into clean, single-responsibility components where **every single file is strictly under 200 lines** (ranging from 75 to 180 lines).
- The refactoring plan preserves 100% of existing functionality, UI visuals, state bindings, mobile support, developer settings, and interactive animations, while ensuring full localization compliance.

---

## 7. Verification Method

To independently verify the architecture and codebase compliance once implemented:

1. **Line Count Compliance**:
   ```bash
   wc -l src/screens/MenuScreen.jsx src/screens/menu/*.jsx src/screens/menu/*.js
   ```
   *Expected result*: Every file output must be strictly `< 200`.

2. **Case Data Validation**:
   ```bash
   node scripts/validate-cases.mjs
   ```
   *Expected result*: `✓ No issues found` (67 cases, 29 diagnostics, 44 treatments).

3. **Functionality Verification**:
   - Launch application, navigate to Main Hub (`phase === "menu"`).
   - Test department filters (ОРИТ, Приёмное, Поликлиника, Стационар).
   - Test specialty filter chips.
   - Test search query filtering.
   - Open Notifications modal and verify unread badge clearing.
   - Open Settings modal, toggle theme (Dark/Light), language (RU/EN), difficulty, and Developer key inputs.
   - Click "Start Case" / "▶ НОВЫЙ ПАЦИЕНТ" to ensure game transition operates identically.
