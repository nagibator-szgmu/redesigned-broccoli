## 2026-08-02T09:13:25Z

You are Worker 1 for Milestone 2: Main Hub (Menu & Navigation) Redesign of MedSim.
Your working directory is `/Users/yana/Downloads/medsim-1/.agents/teamwork_preview_worker_m2`.
Please create your working directory and initialize your `progress.md` and `BRIEFING.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Goal:
Refactor `src/screens/MenuScreen.jsx` (currently 1,150 lines) into modular subcomponents inside `src/screens/menu/`, keeping every single file strictly under 200 lines (aim for 75-180 lines each).

Read architectural instructions from:
- `/Users/yana/Downloads/medsim-1/.agents/orchestrator/PROJECT.md`
- `/Users/yana/Downloads/medsim-1/.agents/teamwork_preview_explorer_m1_1/handoff.md`

Files to create / modify:
1. `src/screens/menu/menuUtils.js` (~75 lines): Pure functions (`makeCatMeta`, `makeNavSpec`, `DEPT_FILTERS`, `buildNotifications`).
2. `src/screens/menu/MenuHeader.jsx` (~130 lines): Top navigation bar with system tools, profile dropdown, search bar focus ring, bell icon badge, settings gear launcher, teacher dashboard launcher.
3. `src/screens/menu/CaseExplorerBar.jsx` (~135 lines): Unified Search & Filter bar (Department filter: ОРИТ, Приёмный покой, Поликлиника, Стационар; Specialty filter chips; Mode/Difficulty).
4. `src/screens/menu/CaseCard.jsx` (~115 lines): Redesigned high-impact case cards (Patient Name, Complaint, Triage Level Badge, Duration, Difficulty Stars, "Start Case" CTA).
5. `src/screens/menu/CaseGrid.jsx` (~95 lines): Responsive 2-column grid wrapper & empty search state.
6. `src/screens/menu/MenuHero.jsx` (~145 lines): Hero banner with cursor glow tracking & animated SVG radar.
7. `src/screens/menu/MenuSidebar.jsx` (~165 lines): Desktop navigation drawer (Brand, Links, Depts, Specs, Tutorial popover menu, Logout, 3D ticker widget).
8. `src/screens/menu/MenuRightSidebar.jsx` (~135 lines): Right stats panel (SVG circular progress charts, total score box, recent sessions list).
9. `src/screens/menu/MenuNotificationsModal.jsx` (~85 lines): Portal overlay for notifications.
10. `src/screens/menu/MenuSettingsModal.jsx` (~175 lines): Portal overlay for settings & Developer LLM key settings.
11. `src/screens/menu/MenuMobileView.jsx` (~150 lines): Mobile responsive layout container.
12. Refactor `src/screens/MenuScreen.jsx` (~110 lines): Clean top-level orchestrator component.
13. Update `src/locale/ru.js` & `src/locale/en.js`: Add missing translation keys (`nav.teacherDashboard`, `nav.departmentHeader`, `settings.devSection`, `settings.apiKeyPlaceholder`, `settings.openrouterGuide`, `tutorial.*`).

Verification Commands to execute:
- `npm run lint` -> must be 0 errors
- `node scripts/validate-cases.mjs` -> must be 0 errors
- `npm run build` -> clean build
- `wc -l src/screens/MenuScreen.jsx src/screens/menu/*.jsx src/screens/menu/*.js` -> verify every file < 200 lines.

Document all changes, commands run, and test results in `/Users/yana/Downloads/medsim-1/.agents/teamwork_preview_worker_m2/handoff.md`.
