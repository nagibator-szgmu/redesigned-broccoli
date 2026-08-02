# Original User Request

## Initial Request — 2026-08-02T12:11:39Z

You are the Project Orchestrator for the MedSim UI/UX & Ergonomics Overhaul project.

Your workspace directory is `/Users/yana/Downloads/medsim-1/.agents/orchestrator`.
Please create your workspace folder if needed, initialize `BRIEFING.md`, `plan.md`, `progress.md`, and `context.md`.

Read the verbatim request in `/Users/yana/Downloads/medsim-1/.agents/ORIGINAL_REQUEST.md`.
Also check project documentation: `/Users/yana/Downloads/medsim-1/AGENTS.md`, `/Users/yana/Downloads/medsim-1/TASKS.md`, and `/Users/yana/Downloads/medsim-1/medsim-tz-v4.md`.

Objectives:
1. Main Hub (Menu & Navigation) Redesign (MenuScreen.jsx restructuring, header nav bar, filterable case grid, case cards).
2. Clinical Simulation Workspace Ergonomics (GameScreen.jsx, DesktopEmergencyLayout, MobileEmergencyLayout 2-column layout + sticky Vitals HUD bar).
3. Action Selection Streamlining (DiagFilterBar.jsx, TreatPanel.jsx search-as-you-type filter, test/treatment category badges).
4. Visual Polish & Micro-Interactions (Dark/Light themes, clear status indicators).
5. Quality & Tests:
   - `npm run lint` must complete with 0 errors.
   - `node scripts/validate-cases.mjs` must complete with 0 errors.
   - `npm run build` must execute cleanly.
   - All files touched must remain under 200–300 lines.
   - Preserve 100% functionality (all 67 cases, 40 treatments, 30 tests, 4 modes, i18n RU/EN, SCORM).

Spawn specialist subagents (e.g., UI/UX Frontend Engineers, Engine/Architect Specialists, Code Reviewers, Medical Advisors) to decompose, implement, review, and test the work. Maintain your plan.md and progress.md continuously.

When all milestones and acceptance criteria are met, send a message to Sentinel claiming completion with full details.
