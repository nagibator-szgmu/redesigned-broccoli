# Architectural Context & Key Notes

## MedSim Codebase Architecture
- Workspace root: `/Users/yana/Downloads/medsim-1`
- Entry point: `src/main.jsx`, `src/MedSimApp.jsx`
- Screens: `src/screens/`
  - `MenuScreen.jsx`: Hub screen for case selection, stats, navigation to options/theory/certificates/leaderboard.
  - `GameScreen.jsx`: Dispatcher routing cases to Emergency, Outpatient, or Stationary layout.
  - `screens/game/`: `EmergencyGameScreen.jsx`, `OutpatientGameScreen.jsx`, `StationaryGameScreen.jsx`, `DesktopEmergencyLayout.jsx`, `MobileEmergencyLayout.jsx`.
- Action Panels: `src/screens/game/OutpatientPanels.jsx`, `StationaryPanels.jsx`, `src/ui/components.jsx` (`DiagFilterBar.jsx` or diagnostic components, `TreatPanel.jsx` / treatment rendering).
- UI Components & Theme: `src/ui/components.jsx`, `ThemeContext.jsx`, `theme.js`.
- Localization: `src/locale/ru.js`, `src/locale/en.js`, `useTranslate.js`, `t.js`.
- Engine & Data: `src/engine/` (`patient.js`, `scoring.js`, `deterioration.js`, `severity.js`), `src/data/` (cases, diagnostics, treatments, theory, quiz, etc.).

## Key Constraints & Guardrails
1. File line count limit: Every touched/created file MUST be under 200–300 lines (aim for <200 lines). Break large screens/components into clean sub-components.
2. 100% functionality preservation: 67 cases (55 emergency, 6 outpatient, 5 stationary, 1 tutorial), 40 treatments, 30 tests, 4 game modes, i18n RU/EN, SCORM.
3. 0 lint errors (`npm run lint`), 0 case validation errors (`node scripts/validate-cases.mjs`), clean `npm run build`.
4. Hard veto on cheating / fake implementations — Forensic Auditor verification mandatory.
