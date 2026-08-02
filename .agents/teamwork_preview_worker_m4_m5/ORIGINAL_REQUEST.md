## 2026-08-02T13:01:27Z
You are teamwork_preview_worker assigned to execute Milestone 4 (Action Selection Streamlining) and Milestone 5 (Visual Polish & Theme Integration) for MedSim.

Working directory: /Users/yana/Downloads/medsim-1
Your folder: /Users/yana/Downloads/medsim-1/.agents/teamwork_preview_worker_m4_m5

Read project documentation:
- /Users/yana/Downloads/medsim-1/AGENTS.md
- /Users/yana/Downloads/medsim-1/.agents/orchestrator/PROJECT.md
- /Users/yana/Downloads/medsim-1/.agents/orchestrator/plan.md

TASKS:
1. Implement Milestone 4 (Action Selection Streamlining):
   - `src/components/game/DiagFilterBar.jsx`: Enhance with instant search-as-you-type filter input (`searchQuery`), quick category badges (`All`, `Lab`, `Cardiac`, `Imaging`, `Respiratory`, `Neuro`), match counters, and clear button.
   - `src/components/game/TreatPanel.jsx`: Enhance with instant search-as-you-type filter input (`searchQuery`), 6 group chips (`All`, `Meds`, `Invasive`, `Airway`, `Fluid`, `Surgery`), danger badges (`⚠ dangerous`), match counters, and smooth layout.
2. Implement Milestone 5 (Visual Polish & Theme Integration):
   - `src/ui/theme.js` & `src/ui/ThemeContext.jsx`: Refine dark (`#0b0f19`, panel `#111c2e`, `#182840`, border `#233854`) and light (`#f4f7fa`, panel `#ffffff`, border `#e2e8f0`) theme color tokens.
   - `src/components/game/PatientStatusBadge.jsx`: Implement standard status indicator for all 5 patient states (`Stable`, `Deteriorating`, `Critical`, `Resuscitated`, `Deceased`).
   - `src/locale/ru.js` & `src/locale/en.js`: Ensure all new UI labels, status names, and search placeholders are localized.
3. STRICT LINE COUNT LIMIT: Every single file created or modified MUST be strictly under 200 lines (aim for < 150 lines).
4. MANDATORY INTEGRITY WARNING:
   DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
5. Verify your implementation by running:
   - `wc -l` on all modified/created files to ensure < 200 lines per file.
   - `node node_modules/eslint/bin/eslint.js "src/**/*.{js,jsx}"` (must be 0 errors, 0 warnings).
   - `node scripts/validate-cases.mjs` (must be 0 errors).
   - `npm run build` (must succeed cleanly).
6. Write your handoff report to `/Users/yana/Downloads/medsim-1/.agents/teamwork_preview_worker_m4_m5/handoff.md` and report back via send_message.
