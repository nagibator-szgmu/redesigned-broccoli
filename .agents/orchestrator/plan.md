# Project Plan — MedSim UI/UX & Ergonomics Overhaul

## Objectives Summary
Overhaul the UI/UX, Navigation, Simulation Workspace, and Action Selection of MedSim to deliver a Linear/Stripe/Apple-grade UI experience while maintaining 100% functionality across all 67 cases, 40 treatments, 30 tests, 4 game modes, i18n (RU/EN), and SCORM integration. Strict code limits (<200-300 lines per file) and 0 lint / 0 validation errors.

## Work Breakdown & Milestones

### Milestone 1: Exploration & System Architecture (In-Progress)
- Spawn 3 parallel Explorers to analyze codebase structure:
  - Explorer 1: MenuScreen.jsx, sidebar, header, screens navigation, modals.
  - Explorer 2: GameScreen.jsx, DesktopEmergencyLayout.jsx, MobileEmergencyLayout.jsx, Vitals components, OutpatientPanels.jsx, StationaryPanels.jsx.
  - Explorer 3: Action Selection (DiagFilterBar.jsx, TreatPanel.jsx, components.jsx), theme system, i18n keys.
- Output: `PROJECT.md` at root defining architecture, code layout, component boundaries, line count constraints, and test runner setup.

### Milestone 2: Main Hub (Menu & Navigation) Redesign
- Streamline `MenuScreen.jsx` by refactoring into sub-components (<200 lines each):
  - `MenuHeader.jsx`: Top navigation bar with system tools (Theory, Leaderboard, Certificates, Calculator, Settings, Notifications) & Profile dropdown.
  - `CaseExplorerBar.jsx`: Search & filter bar (Departments: ОРИТ, Приёмный покой, Поликлиника, Стационар; Specialty filter; Mode/Difficulty).
  - `CaseCard.jsx` & `CaseGrid.jsx`: Redesigned high-impact cards (Patient Name, Complaint, Triage Badge, Duration, Difficulty Stars, "Start Case" CTA).
  - Modal drawers / tab views for secondary tools.
- Verification: Lint, case validation, build, unit/functional tests.

### Milestone 3: Clinical Simulation Workspace Ergonomics (Game Workspace & Vitals HUD)
- Refactor `GameScreen.jsx`, `DesktopEmergencyLayout.jsx`, `MobileEmergencyLayout.jsx`:
  - `VitalsHUD.jsx`: Sticky/fixed top bar with real-time vital signs (HR, BP, SpO2, RR, Temp, GCS, Pain), warning/critical states, pulse/ECG animation.
  - Two-Column Layout (Desktop):
    - Left Column: Patient Demographics, Chief Complaint, History & Physical Exam tabs, Test Results Timeline, Active Interventions.
    - Right Column (Action Center): Tabbed panel ([Diagnostics], [Treatments], [Diagnosis & Routing], [AI Consultation]).
  - Mobile layout optimization (responsive 2-column or tabbed views).
- Verification: Lint, case validation, build, functional tests.

### Milestone 4: Action Selection Streamlining (DiagFilterBar & TreatPanel)
- Update `DiagFilterBar.jsx` & `TreatPanel.jsx`:
  - Add search-as-you-type filter input for instant lookup of tests ("Тропонин", "ЭКГ") and drugs ("Аспирин", "Гепарин").
  - Add category badges and quick filter chips.
  - Apply to both Emergency (ICU/Admission) and Stationary/Outpatient panels.
- Verification: Lint, case validation, build, search UX verification.

### Milestone 5: Visual Polish, Theme System & Status Indicators
- Refactor/enhance Theme system (`ThemeContext.jsx`, `theme.js`, CSS/inline styles):
  - Modern dark (`#0b0f19`) & light theme palettes, crisp borders, subtle glassmorphism.
  - Clear patient status indicators (Stable, Deteriorating, Critical, Resuscitated, Deceased).
  - Ensure zero color glitches and full WCAG contrast compliance.
- Verification: Lint, case validation, build, theme audit.

### Milestone 6: Quality, Linting, Validation & E2E Forensic Audit
- Run comprehensive check:
  - `npm run lint` — 0 errors.
  - `node scripts/validate-cases.mjs` — 0 errors.
  - `npm run build` — Clean execution.
  - File line counts: All modified files < 200–300 lines.
  - Integrity & functionality verification: 67 cases, 40 treatments, 30 tests, 4 modes, RU/EN, SCORM.
- Forensic Auditor execution & Veto verification.
