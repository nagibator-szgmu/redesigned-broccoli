# Original User Request

## Initial Request — 2026-08-02T12:57:23Z

# Teamwork Project Prompt — MedSim UI/UX & Ergonomics Overhaul

Working Directory: /Users/yana/Downloads/medsim-1
Integrity Mode: development

## 🎯 Objectives & Key Improvements

### 1. Main Hub (Menu & Navigation) Redesign
* **Clean Top Navigation Bar:** Consolidate system tools (Theory, Leaderboard, Certificates, Calculator, Settings, Notifications) into a clean, modern header navigation bar and user profile dropdown.
* **Unified Case Explorer:** Replace cluttered filters with an elegant Search & Filter bar (Filter by Department: ОРИТ, Приёмный покой, Поликлиника, Стационар; Filter by Specialty; Filter by Difficulty/Mode).
* **High-Impact Case Cards:** Redesign case cards with clear visual hierarchy (Patient Name, Chief Complaint, Triage Level Badge, Estimated Duration, Difficulty Stars, "Start Case" CTA).

### 2. Clinical Simulation Workspace (Game Screen) Ergonomics
* **Top Vitals HUD (Heads-Up Display):** Fixed top bar with real-time vital signs (HR, BP, SpO2, RR, Temp, GCS, Pain) featuring color-coded warning/critical states and animated pulse/ECG indicator.
* **Two-Column Workstation Layout:**
  * **Left Column (Patient & Clinical Picture):** Patient Demographics, Chief Complaint, History & Physical Exam tabs, Test Results Timeline, Active Interventions.
  * **Right Column (Action Center):** Clean tabbed panel for **[Diagnostics]**, **[Treatments]**, **[Diagnosis & Routing]**, and **[AI Consultation]**.
* **Quick Search & Filter:** Instant search input inside Diagnostics and Treatments panels to find tests (e.g. "Тропонин", "ЭКГ") or drugs (e.g. "Аспирин", "Гепарин") instantly.

### 3. Visual Polish & Micro-Interactions
* **Design System & Theme Consistency:** Unified dark (`#0b0f19`) and light theme palettes, crisp borders, subtle glassmorphism, and clean typography (Inter/SF Pro style).
* **Clear State Indicators:** High-visibility indicators for patient status (Stable, Deteriorating, Critical, Resuscitated, Deceased).

## 📋 Requirements

### R1. Restructure `MenuScreen.jsx` for Better Navigation
- Create a streamlined Header, Hero Section, Quick Stats, and Filterable Case Grid.
- Move secondary tools into clean modal drawers or dedicated tab views.

### R2. Reorganize `GameScreen.jsx` & Layouts (`DesktopEmergencyLayout`, `MobileEmergencyLayout`)
- Implement a 2-column layout (Left: Patient & Clinical History/Results; Right: Action Command Center).
- Make Vitals sticky at the top as an Emergency Monitored HUD with animated status.

### R3. Streamline Action Selection (`DiagFilterBar.jsx`, `TreatPanel.jsx`)
- Add a unified search-as-you-type filter for fast action selection during high-pressure emergency cases.
- Group tests and treatments by category with quick-access badges.

### R4. Preserve 100% Functionality & Code Quality
- All 67 cases, 40 treatments, 30 tests, 4 modes, i18n (RU/EN), and SCORM integration must remain fully functional and pass all tests and linters.
- Keep all touched files under 200–300 lines by breaking large components into sub-components.

## ✅ Acceptance Criteria

### Ergonomics & UI
- [ ] Main menu is clean, un-cluttered, and easy to navigate on both desktop and mobile.
- [ ] Game screen presents a clear 2-column layout with a top Vitals HUD bar.
- [ ] Instant search for tests/medications reduces click-fatigue in time-critical scenarios.
- [ ] Dark and Light themes exhibit high contrast and consistent styling without color glitches.

### Quality & Tests
- [ ] `npm run lint` completes with **0 errors**.
- [ ] `node scripts/validate-cases.mjs` completes with **0 errors**.
- [ ] `npm run build` executes cleanly.
