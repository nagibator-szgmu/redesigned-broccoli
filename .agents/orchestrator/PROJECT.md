# Project Specification: MedSim UI/UX & Ergonomics Overhaul

## Architecture Overview
The MedSim UI/UX & Ergonomics Overhaul modernizes the user interface across the Main Navigation Hub, Clinical Simulation Workstation, Action Selection Panels, and Design System while maintaining 100% functionality across all 67 cases, 40 treatments, 30 tests, 4 game modes, i18n (RU/EN), and SCORM integration.

### Core Architectural Pillars
1. **Main Navigation Hub Architecture (`src/screens/menu/`)**:
   - Refactor `src/screens/MenuScreen.jsx` from a 1,150-line monolith into 12 single-responsibility subcomponents, each strictly under 200 lines.
   - Introduce a consolidated top header bar (`MenuHeader.jsx`), unified search & filter bar (`CaseExplorerBar.jsx`), modern case cards (`CaseCard.jsx` & `CaseGrid.jsx`), hero banner (`MenuHero.jsx`), navigation sidebar (`MenuSidebar.jsx`), right stats panel (`MenuRightSidebar.jsx`), and portal modals (`MenuNotificationsModal.jsx`, `MenuSettingsModal.jsx`).
2. **Clinical Workstation Ergonomics Architecture (`src/components/game/workstation/` & `vitals/`)**:
   - `VitalsHUD.jsx`: A top-fixed sticky clinical telemetry monitor with animated ECG pulse SVG, displaying HR, BP (with MAP), SpO2, RR, Temp, GCS, Pain, and trend indicators across ICU, Admission, Outpatient, and Stationary modes.
   - `DesktopWorkstation.jsx`: A two-column workstation layout (Left: Patient Record & Context; Right: Action Command Center with 4 clean tabs for Diagnostics, Treatments, Diagnosis & Route, Protocols/AI).
   - `MobileWorkstation.jsx`: Responsive mobile workstation layout with bottom navigation dock and compact telemetry ribbon.
3. **Action Selection Streamlining (`src/components/game/`)**:
   - `DiagFilterBar.jsx`: Glassmorphic search-as-you-type filter input (`searchQuery`), quick category badges (`All`, `Lab`, `Cardiac`, `Imaging`, `Respiratory`, `Neuro`), and dynamic match counters.
   - `TreatPanel.jsx`: Search-as-you-type filter input (`searchQuery`) for drugs/procedures, 6 high-level domain group chips, and danger badges (`⚠ dangerous`).
4. **Design System & Theme Polish (`src/ui/theme.js` & `PatientStatusBadge.jsx`)**:
   - Dark theme canvas background aligned to `#0b0f19` (elevated panels `#111c2e`, `#182840`, crisp borders `#233854`). Light theme canvas background aligned to `#f4f7fa` (panel `#ffffff`, card `#f8fafc`, crisp border `#e2e8f0`).
   - Standardized `PatientStatusBadge.jsx` for all 5 patient states (`Stable`, `Deteriorating`, `Critical`, `Resuscitated`, `Deceased`).

---

## Milestones & Roadmap

| # | Milestone Name | Scope & Deliverables | Dependencies | Status |
|---|---|---|---|---|
| 1 | Exploration & Architecture Plan | Codebase exploration, architectural design, component specs | none | DONE |
| 2 | Main Hub (Menu & Navigation) Redesign | Modularize `MenuScreen.jsx` into 12 subcomponents (<200 lines each) in `src/screens/menu/` | M1 | DONE |
| 3 | Clinical Simulation Workspace Ergonomics | Implement sticky `VitalsHUD`, 2-column `DesktopWorkstation`, and `MobileWorkstation` | M1, M2 | DONE |
| 4 | Action Selection Streamlining | Implement search-as-you-type and group badges in `DiagFilterBar` & `TreatPanel` | M1, M3 | DONE |
| 5 | Visual Polish & Theme Integration | Refine `theme.js` palettes, implement `PatientStatusBadge`, add i18n keys in `ru.js`/`en.js` | M1, M4 | DONE |
| 6 | Quality, Validation & E2E Forensic Audit | `npm run lint` (0 errors), `validate-cases.mjs` (0 errors), `npm run build` clean, lines < 200, Forensic Audit CLEAN | M2–M5 | DONE |

---

## Interface Contracts & Data Flow

### 1. Main Hub Interfaces
- `MenuScreen`: Consumes `useTheme`, `useLocale`, `useTranslate`, `useAuth`, `useIsMobile`, `useProgress`, `useSettings`.
- `MenuHeader`: Receives `searchQuery`, `setSearchQuery`, `unreadCount`, `openNotif`, `openSettings`, `setPhase`.
- `CaseExplorerBar`: Receives `department`, `setDepartment`, `specFilter`, `setSpecFilter`, `deptFilters`, `navSpec`.
- `CaseCard` / `CaseGrid`: Receives `cases`, `catMeta`, `caseScores`, `startGame`.

### 2. Workstation & Telemetry Interfaces
- `VitalsHUD`: Receives `vitals` (`{hr, sbp, dbp, spo2, rr, temp, gcs, pain}`), `prevPs`, `mode` (`icu`|`admission`|`outpatient`|`stationary`), `examinedVitals`, `cycle`.
- `PatientRecordColumn`: Receives `patient`, `anamnesis`, `revealedAnamnesis`, `testResults`, `activeTreatments`, `dicomViewerTrigger`.
- `ActionCommandCenter`: Receives `step`, `needDiag`, `needTreat`, `orderTests`, `applyTreatment`, `setDiagnosis`, `selectRoute`, `guidelines`.

### 3. Action Selection Interfaces
- `DiagFilterBar`: Receives `searchQuery`, `setSearchQuery`, `selectedCategory`, `setSelectedCategory`, `totalCount`, `matchCount`.
- `TreatPanel`: Receives `searchQuery`, `setSearchQuery`, `selectedGroup`, `setSelectedGroup`, `treatments`, `onSelectTreatment`, `activeTreatments`.

---

## Code Layout & Line Count Limits

Strict project rule: **Every file touched or created must remain under 200 lines** (aim for < 150 lines).

```
src/
├── screens/
│   ├── MenuScreen.jsx                (~110 lines)
│   └── menu/
│       ├── menuUtils.js              (~75 lines)
│       ├── MenuHeader.jsx            (~130 lines)
│       ├── CaseExplorerBar.jsx       (~135 lines)
│       ├── CaseCard.jsx              (~115 lines)
│       ├── CaseGrid.jsx              (~95 lines)
│       ├── MenuHero.jsx              (~145 lines)
│       ├── MenuSidebar.jsx           (~165 lines)
│       ├── MenuRightSidebar.jsx      (~135 lines)
│       ├── MenuNotificationsModal.jsx (~85 lines)
│       ├── MenuSettingsModal.jsx     (~175 lines)
│       └── MenuMobileView.jsx        (~150 lines)
├── components/
│   └── game/
│       ├── PatientStatusBadge.jsx    (~85 lines)
│       ├── DiagFilterBar.jsx         (~130 lines)
│       ├── TreatPanel.jsx            (~145 lines)
│       ├── vitals/
│       │   ├── VitalsHUD.jsx         (~120 lines)
│       │   ├── VitalsMetricCard.jsx  (~70 lines)
│       │   └── EcgWaveform.jsx       (~60 lines)
│       └── workstation/
│           ├── DesktopWorkstation.jsx  (~130 lines)
│           ├── PatientRecordColumn.jsx (~150 lines)
│           ├── ActionCommandCenter.jsx (~140 lines)
│           ├── DiagTab.jsx             (~120 lines)
│           ├── TreatTab.jsx            (~130 lines)
│           ├── DiagnosisRoutingTab.jsx (~130 lines)
│           ├── ConsultationTab.jsx     (~110 lines)
│           └── MobileWorkstation.jsx   (~150 lines)
├── ui/
│   ├── theme.js                      (~65 lines)
│   └── ThemeContext.jsx              (~35 lines)
└── locale/
    ├── ru.js                         (dictionary additions)
    └── en.js                         (dictionary additions)
```
