## 2026-08-02T12:58:45Z
You are teamwork_preview_worker assigned to execute Milestone 3: Clinical Simulation Workspace Ergonomics (Game Workspace & Vitals HUD) for MedSim.

Working directory: /Users/yana/Downloads/medsim-1
Your folder: /Users/yana/Downloads/medsim-1/.agents/teamwork_preview_worker_m3

Read project documentation:
- /Users/yana/Downloads/medsim-1/AGENTS.md
- /Users/yana/Downloads/medsim-1/.agents/orchestrator/PROJECT.md
- /Users/yana/Downloads/medsim-1/.agents/orchestrator/plan.md

TASKS:
1. Implement Vitals HUD components in `src/components/game/vitals/`:
   - `VitalsHUD.jsx`: Fixed/sticky clinical header monitor bar showing HR, BP (SBP/DBP), SpO2, RR, Temp, GCS, Pain badges with color-coded warning/critical states and animated pulse SVG.
   - `VitalsMetricCard.jsx`: Individual telemetry card subcomponent.
   - `EcgWaveform.jsx`: Animated SVG ECG pulse indicator component.
2. Implement Workstation Layout subcomponents in `src/components/game/workstation/`:
   - `DesktopWorkstation.jsx`: 2-column workstation container (Left: Patient Record Column, Right: Action Command Center).
   - `PatientRecordColumn.jsx`: Patient demographics, complaint, history/exam tabs, test results timeline, active interventions.
   - `ActionCommandCenter.jsx`: Tabbed action panel ([Diagnostics], [Treatments], [Diagnosis & Routing], [AI Consultation]).
   - `DiagTab.jsx`: Diagnostics selection tab.
   - `TreatTab.jsx`: Treatments selection tab.
   - `DiagnosisRoutingTab.jsx`: Diagnosis entry & patient routing tab.
   - `ConsultationTab.jsx`: Guidelines & AI consultation tab.
   - `MobileWorkstation.jsx`: Responsive mobile view with bottom navigation dock and compact telemetry ribbon.
3. Refactor `src/screens/game/DesktopEmergencyLayout.jsx`, `src/screens/game/MobileEmergencyLayout.jsx`, and `src/screens/GameScreen.jsx` to delegate layout and rendering to these clean subcomponents.
4. STRICT LINE COUNT LIMIT: Every single file created or modified MUST be strictly under 200 lines (aim for < 150 lines).
5. MANDATORY INTEGRITY WARNING:
   DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
6. Verify your implementation by running:
   - `wc -l` on all modified/created files to ensure < 200 lines per file.
   - `node node_modules/eslint/bin/eslint.js "src/**/*.{js,jsx}"` (must be 0 errors, 0 warnings).
   - `node scripts/validate-cases.mjs` (must be 0 errors).
   - `npm run build` (must succeed cleanly).
7. Write your handoff report to `/Users/yana/Downloads/medsim-1/.agents/teamwork_preview_worker_m3/handoff.md` and report results back via send_message.
