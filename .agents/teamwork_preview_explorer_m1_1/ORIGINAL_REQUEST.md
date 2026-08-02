## 2026-08-02T09:12:08Z
<USER_REQUEST>
You are Explorer 1 for Milestone 1 of MedSim UI/UX & Ergonomics Overhaul.
Your working directory is `/Users/yana/Downloads/medsim-1/.agents/teamwork_preview_explorer_m1_1`.
Please create your working directory and initialize your `progress.md` and `BRIEFING.md`.

Investigate the Main Hub & Navigation system in MedSim:
1. Analyze `src/screens/MenuScreen.jsx` line count, its component structure, header bar, department filters, case card grid, sidebar, and secondary tool modals (Theory, Leaderboard, Certificates, Settings, etc.).
2. Propose a precise refactoring architecture to break `MenuScreen.jsx` into modular components, all under 200 lines:
   - `MenuHeader.jsx`: Consolidated header nav bar with profile dropdown, system tool launchers.
   - `CaseExplorerBar.jsx`: Unified Search & Filter bar (Department filter: ОРИТ, Приёмный покой, Поликлиника, Стационар; Specialty filter; Mode/Difficulty).
   - `CaseGrid.jsx` & `CaseCard.jsx`: Modern, high-impact case cards with Patient Name, Complaint, Triage Badge, Duration, Difficulty Stars, "Start Case" CTA.
   - Secondary tool drawer / tab integration.
3. Check translation keys needed in `src/locale/ru.js` and `src/locale/en.js`.
4. Document all findings, current line counts, file dependencies, and step-by-step refactoring proposal in your handoff report `/Users/yana/Downloads/medsim-1/.agents/teamwork_preview_explorer_m1_1/handoff.md`.
</USER_REQUEST>
