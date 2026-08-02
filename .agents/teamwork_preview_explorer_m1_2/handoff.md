# Handoff Report: Clinical Simulation Workspace Ergonomics Investigation & Redesign Architecture

**Agent**: Explorer 2 (Milestone 1 — MedSim UI/UX & Ergonomics Overhaul)  
**Working Directory**: `/Users/yana/Downloads/medsim-1/.agents/teamwork_preview_explorer_m1_2`  
**Date**: 2026-08-02  

---

## 1. Observation

### Current Workspace Architecture & Component Line Counts

Direct observation of workspace screens and layout components:

| File Path | Line Count | Current Role / Responsibility | Observations & Structural Notes |
|---|---|---|---|
| `src/screens/GameScreen.jsx` | 71 lines | Top-level case routing dispatcher | Maps department string (`icu`, `admission`, `emergency`, `outpatient`, `stationary`) to department screens. Renders curriculum banner when active. |
| `src/screens/game/EmergencyGameScreen.jsx` | 97 lines | Emergency/ICU state dispatcher | Calculates mentor tips (SpO2 < 90, SBP < 90, HR > 120), passes shared state to `DesktopEmergencyLayout` or `MobileEmergencyLayout` based on `useIsMobile()`. |
| `src/screens/game/DesktopEmergencyLayout.jsx` | 164 lines | Desktop layout for Emergency/ICU | Combines `PatientSidebar` (left vertical bar, 224px width) with 3 step-dependent views (`DesktopOrderTests`, `DesktopResults`, `DesktopDiagnose`). Uses 50%/50% column split during diagnose phase. |
| `src/screens/game/MobileEmergencyLayout.jsx` | 195 lines | Mobile layout for Emergency | Top header (52px) + `MobileVitalsBar` (horizontal overflow scroll) + step bar + scrollable view + bottom 2-tab dock (`main`, `treatment`). **Nearing line limit (195/200)**. |
| `src/screens/game/OutpatientGameScreen.jsx` | 131 lines | Polyclinic/Outpatient screen | Top header + `StepBar` + left test/diagnosis selection panel + right `PatientCard` & `HistoryPanel` (260px). Vitals examined via `examinedVitals` state array inside `PatientCard`. |
| `src/screens/game/StationaryGameScreen.jsx` | 179 lines | Hospital ward screen | Top header + `StepBar` + daily phase views (`morning`, `order_tests`, `results`, `treat`) + right `PatientCard` & `StationaryHistoryPanel` (260px). Anamnesis modal overlay rendered via `createPortal`. |
| `src/components/PatientSidebar.jsx` | 187 lines | Left sidebar for desktop Emergency | Renders logo/menu btn, patient avatar card, 2-column vitals grid (`sbp`, `hr`, `spo2`, `rr`, `temp`, `gcs`), pain bar, severity index (0-20), timer circle, phase steps, and mini event log. |
| `src/ui/components.jsx` | 147 lines | General UI elements | Exports `STitle`, `Btn`, `CheckRow`, `TimerCircle`, `ResultCard`. Contains no unified sticky vitals HUD or telemetry component. |
| `src/screens/game/OutpatientPanels.jsx` | **223 lines** | Outpatient UI panels | **EXCEEDS LIMIT (223 > 200)**. Contains `PatientCard`, `HistoryPanel`, `StepBar`, `TestSelection`, `ResultsPanel`, `DiagnosisForm`, `RouteSelection`. |
| `src/screens/game/StationaryPanels.jsx` | **252 lines** | Ward UI panels | **EXCEEDS LIMIT (252 > 200)**. Contains `PatientCard`, `StepBar`, `MorningPanel`, `TestSelection`, `ResultsPanel`, `TreatPanel`. |

---

## 2. Logic Chain

### Step-by-Step Reasoning from Observations to Proposed Redesign Architecture

1. **Observation**: Vitals display is currently fragmented across three different formats:
   - Emergency desktop uses a 224px left sidebar grid (`PatientSidebar.jsx:93-110`).
   - Emergency mobile uses a horizontally scrolling bar (`MobileEmergencyLayout.jsx:79-98`).
   - Outpatient & Stationary embed vitals inside a right-hand card (`PatientCard` in `OutpatientPanels.jsx` and `StationaryPanels.jsx`).
2. **Inference 1**: The lack of a single, standardized Vitals HUD creates UX inconsistency and cognitive friction for players switching between departments. A clinician needs an immediate, clear telemetry view regardless of whether they are in Emergency, Outpatient, or Stationary.
3. **Observation**: In `DesktopEmergencyLayout.jsx`, transitioning between phases (`order_tests` -> `awaiting_results` -> `diagnose`) changes the layout structure entirely. In `order_tests`, history and test filtering occupy the center while treatments are in a 260px right column. In `diagnose`, test results take 50% left width, and diagnosis/treatments/routing occupy the right 50%.
4. **Inference 2**: These layout shifts force the user to re-orient themselves on every phase transition. A stable **Two-Column Workstation Layout** (Left Column: Patient Context & Medical Record; Right Column: Action Command Center) eliminates layout jumping and provides an intuitive, professional clinical workstation experience (similar to Epic/Cerner EHR and modern telemetry monitors).
5. **Observation**: Existing panel files `OutpatientPanels.jsx` (223 lines) and `StationaryPanels.jsx` (252 lines) violate the repository constraint of < 200 lines per file (AGENTS.md Rule 4). `MobileEmergencyLayout.jsx` is at 195 lines.
6. **Inference 3**: Refactoring the workspace ergonomics provides an opportunity to modularize these files into clean sub-components that strictly remain under 150-170 lines each.

---

## 3. Modular Architecture Proposals

### A. Unified Sticky `VitalsHUD.jsx` (< 150 lines)

A top-sticky clinical monitor telemetry bar compatible across all 4 department modes (ICU, Admission, Outpatient, Stationary).

#### Design Specs & Features:
- **Location**: Top-fixed directly below the main header bar.
- **Visual Styling**: Dark clinical telemetry theme (`#0b0f17`), neon-coded vital metrics:
  - **HR / Pulse**: Neon Green (`#00e5a0`) with animated ECG wave SVG ticker. Warns if > 100 or < 50 bpm.
  - **BP (SBP/DBP & MAP)**: Cyan (`#00e6c8`) displaying SBP/DBP and calculated MAP ($MAP = DBP + \frac{1}{3}(SBP - DBP)$). Warns if SBP < 90 or > 160.
  - **SpO₂**: Light Blue (`#4fc3f7`) with pulse oxygen saturation. Warns if < 94% (flashing alert if < 90%).
  - **RR**: Yellow (`#f5c842`) respiratory rate. Warns if > 20 or < 10.
  - **t°C**: Orange (`#ff9800`) body temperature. Warns if > 38.0 or < 36.0 °C.
  - **GCS**: Purple (`#9d6ff5`) Glasgow Coma Scale (3-15). Warns if < 10.
  - **Pain Scale**: Rose (`#ff3d5a`) 10-point visual analog scale.
- **Department Modes**:
  - **ICU / Admission**: Real-time continuous monitoring with trend arrows (`▲/▼`) computed from `prevPs`.
  - **Outpatient**: Shows unexamined vitals state until examined via an interactive "Examine Vitals" toggle button.
  - **Stationary**: Displays current day's morning/updated vitals alongside Day indicator (`Day X/Y`).
- **Sub-component Breakdown**:
  1. `VitalsHUD.jsx` (~120 lines): Container, layout, pulse animation sync, department mode logic.
  2. `VitalsMetricCard.jsx` (~70 lines): Individual metric renderer with warning borders, trend icons, and thresholds.
  3. `EcgWaveform.jsx` (~60 lines): Lightweight SVG animated ECG pulse waveform canvas.

```
[ VitalsHUD Sticky Top Bar ]
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 🫀 HR 78 bpm [~~~] │ 🩸 BP 115/75 (88) │ 🫁 SpO₂ 97% │ 🌬️ RR 16 │ 🌡️ 36.6°C │ 🧠 GCS 15 │ ⚡ PAIN 3/10 │ 🟢 STABLE │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### B. Two-Column Desktop Workstation Layout (`DesktopWorkstation.jsx`)

Replaces shifting layouts with a permanent, ergonomic split view:

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top App Header (Brand, Navigation, Audio Toggle, Theory Modal, Learning Mode Status)                             │
├───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [ VitalsHUD Sticky Telemetry Bar ]                                                                                │
├──────────────────────────────────────────────────────┬────────────────────────────────────────────────────────────┤
│ LEFT COLUMN: Patient Record & Context (50%)          │ RIGHT COLUMN: Action Command Center (50%)                  │
│                                                      │                                                            │
│ ┌──────────────────────────────────────────────────┐ │ ┌────────────────────────────────────────────────────────┐ │
│ │ 👤 Patient Demographics & Severity Badge          │ │ │ [ 🔬 Diag ] [ 💊 Treat ] [ 📋 Route ] [ 🤖 Protocol ]   │ │
│ ├──────────────────────────────────────────────────┤ │ ├────────────────────────────────────────────────────────┤ │
│ │ Tabs: [Complaints & History] [Timeline] [Active] │ │ │ Action Tab Content Area                                │ │
│ │                                                  │ │ │                                                        │ │
│ │ • Chief Complaint & Organ Systems                │ │ │ • Diagnostic Test Selection & Category Filters         │ │
│ │ • Revealed Anamnesis (Life, Disease, Exam)       │ │ │ • Treatment & Drug Prescriptions                       │ │
│ │ • Diagnostic Test Results Feed (ECG, PACS Dicom) │ │ │ • Diagnosis Text Input & Department Routing          │ │
│ │ • Active Treatments & Infusions Feed             │ │ │ • Clinical Protocol Flowcharts & Guidelines          │ │
│ └──────────────────────────────────────────────────┘ │ └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────┘
```

#### Left Column: `PatientRecordColumn.jsx` (~150 lines)
- **Persistent Header Card**: Patient Avatar (gender/age badge), Full Name, Severity Tag, Timer Circle with countdown.
- **Tabbed Record Views**:
  - `[Chief Complaint & Anamnesis]`: Interactive reveal buttons for history of illness, life history, and physical examination.
  - `[Results Timeline]`: Chronological timeline of ordered diagnostic tests with status indicators (Pending/Ready), result cards, and PACS DicomViewer triggers.
  - `[Active Interventions]`: Feed of prescribed medications, oxygen therapy, fluids, and active dynamic physiological effects.

#### Right Column: `ActionCommandCenter.jsx` (~140 lines)
- **Tabbed Control Hub**:
  - **Tab 1: 🔬 [Diagnostics]** (`DiagTab.jsx`, ~120 lines): Category filter pills (`All`, `Lab`, `Instrument`, `Imaging`, `Consult`), checkable test list, order button with selection count.
  - **Tab 2: 💊 [Treatments]** (`TreatTab.jsx`, ~130 lines): Category filter pills (`Emergency`, `Airway`, `Drugs`, `Fluids`), treatment options, active pending infusion feedback.
  - **Tab 3: 📋 [Diagnosis & Routing]** (`DiagnosisRoutingTab.jsx`, ~130 lines): Clinical diagnosis text box, structured sub-fields (Main, Complications, Comorbidities for Outpatient), department routing selector (ICU, Admission, Ward, Discharge), and submit action.
  - **Tab 4: 🤖 [Protocols & AI]** (`ConsultationTab.jsx`, ~110 lines): Clinical guidelines (КР Минздрава РФ) reference lookup, protocol flowcharts (BLS/ACLS/ATLS/Sepsis/Stroke), and mentor tip toasts.

---

### C. Mobile Layout Adaptivity (`MobileWorkstationLayout.jsx`)

Refactoring `MobileEmergencyLayout.jsx` into a modular, responsive architecture:
- **Mobile Header Bar**: Compact patient info, timer countdown, theory modal trigger.
- **Collapsible Telemetry Ribbon**: Sticky top ribbon rendering a compact version of `VitalsHUD`.
- **Bottom Navigation Dock**: 4 persistent tabs with notification badges:
  - `👤 Context`: Patient history, complaints, exam details.
  - `🔬 Diag`: Diagnostic test selection & results feed.
  - `💊 Treat`: Treatment selection & active interventions.
  - `📋 Submit`: Diagnosis input, routing options, final submit button.

---

## 4. Proposed File Hierarchy & Line Count Guarantees

All newly proposed components will be created under `src/components/game/workstation/` and `src/components/game/vitals/`:

```
src/components/game/
├── vitals/
│   ├── VitalsHUD.jsx            (~120 lines) - Unified sticky top bar
│   ├── VitalsMetricCard.jsx     (~70 lines)  - Telemetry card element
│   └── EcgWaveform.jsx          (~60 lines)  - Animated SVG pulse wave
└── workstation/
    ├── DesktopWorkstation.jsx   (~130 lines) - Main 2-column desktop wrapper
    ├── PatientRecordColumn.jsx  (~150 lines) - Left column context & record
    ├── ActionCommandCenter.jsx  (~140 lines) - Right column action tabs container
    ├── DiagTab.jsx              (~120 lines) - Diagnostics action tab
    ├── TreatTab.jsx             (~130 lines) - Treatments action tab
    ├── DiagnosisRoutingTab.jsx  (~130 lines) - Diagnosis & route selection tab
    ├── ConsultationTab.jsx      (~110 lines) - Guidelines & protocol reference tab
    └── MobileWorkstation.jsx    (~150 lines) - Mobile responsive layout wrapper
```

**Line Count Compliance**: Every single proposed file is designed to be under 160 lines, well below the project limit of 200 lines.

---

## 5. Caveats

1. **State Wiring**: The state management hooks (`useGameSession.js`, `useStationaryCycle.js`, `useProgress.js`) must remain unchanged to preserve existing game engine logic, scoring (`computeScore`), and case validation.
2. **Review Registry & Guidelines**: `ConsultationTab` will read clinical guidelines and explanations using `getExplanationForCase` from `useReviewRegistry.js` without mutating data formats.
3. **Legacy Panel Refactoring**: `OutpatientPanels.jsx` (223 lines) and `StationaryPanels.jsx` (252 lines) should be split by the implementer into smaller sub-components to restore 100% compliance with the 200-line limit across the entire codebase.

---

## 6. Conclusion

The proposed **Clinical Simulation Workspace Ergonomics Architecture**:
1. Introduces a **Unified Sticky `VitalsHUD`** providing clinical telemetry (HR with ECG wave, BP with MAP, SpO2, RR, Temp, GCS, Pain) across Emergency, Outpatient, and Stationary modes.
2. Replaces shifting phase layouts with a **Stable Two-Column Desktop Workstation** (Left: Patient Record & Context; Right: Action Command Center with 4 clean tabs).
3. Delivers a clean **Mobile Workstation Layout** with a bottom navigation dock and compact telemetry ribbon.
4. Structurally guarantees that **all 9 new/refactored files stay strictly under 150–160 lines** (well below the 200 line limit).

---

## 7. Verification Method

To independently verify the ergonomic redesign implementation:

1. **Line Count Verification**:
   ```bash
   node scripts/validate-cases.mjs
   find src/components/game/vitals src/components/game/workstation -name "*.jsx" | xargs wc -l
   ```
   *Expected result*: `validate-cases.mjs` outputs 0 errors, and all files report < 200 lines.

2. **Lint & Build Verification**:
   ```bash
   npm run lint
   ```
   *Expected result*: 0 errors, 0 warnings.

3. **UI / Ergonomics Functional Checks**:
   - **Emergency (ICU/Admission)**: Launch an emergency case (e.g. Case #1), verify `VitalsHUD` renders sticky at top with animated ECG waveform, left column shows patient record and test timeline, right column allows switching tabs between Diagnostics, Treatments, Diagnosis & Route, and AI Consultation.
   - **Outpatient**: Launch an outpatient case (e.g. Case #36), verify `VitalsHUD` shows unexamined/examined state toggle, and action center displays outpatient diagnosis sub-fields (Main, Complications, Comorbidities) and routing buttons.
   - **Stationary**: Launch a ward case (e.g. Case #42), verify `VitalsHUD` displays morning vitals with Day counter, and workstation allows daily treatment and test management.
   - **Mobile Responsiveness**: Test at viewport width < 768px, verify `MobileWorkstation` renders bottom navigation dock without overflow or layout overlap.
