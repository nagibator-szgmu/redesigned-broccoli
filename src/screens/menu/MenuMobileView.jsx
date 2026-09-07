import React, { useState } from "react";
import { SER, FONT, CODE, RADIUS } from "../../ui/theme";
import PillEmblem from "../../ui/PillEmblem";
import { CASES } from "../../data/cases";
import { IS_DEV_MODE } from "../../config";
import { getVisibleCases } from "../../hooks/useReviewRegistry";
import MenuNotificationsModal from "./MenuNotificationsModal";
import MenuSettingsModal from "./MenuSettingsModal";
import {
  IconTheory, IconTarget, IconMap, IconTrophy, IconGraduationCap,
  IconChartBar, IconBell, IconGear, IconLogOut, IconSearch, IconMenu, IconX, IconClock, IconCheck
} from "../../ui/icons";

/**
 * MenuMobileView — Clean, ergonomic mobile layout with Drawer navigation and safe-area support.
 */
export default function MenuMobileView(props) {
  const {
    startGame, setPhase, totalScore, casesPlayed, searchQuery, setSearchQuery,
    searchFocused, setSearchFocused, department, setDepartment, specFilter, setSpecFilter,
    showAllCases, setShowAllCases, showNotif, setShowNotif, showSettings, setShowSettings,
    difficulty, setDifficulty, gameMode, setGameMode, theme, setTheme, learningMode, setLearningMode,
    assessmentMode, setAssessmentMode, setProgressionMode, audioEnabled, setAudioEnabled,
    hideWarnings, setHideWarnings, isDevMode, checkDeptTutorial, unreadCount,
    readNotifIds, notifications, openNotif, logout, locale, setLocaleGlobal, LOCALES,
    llmProvider, setLlmProvider, llmKey, setLlmKey, showDevSettings, setShowDevSettings,
    catMeta, navSpec, deptFilters, caseScores, t, C,
  } = props;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const q = searchQuery.toLowerCase();
  const baseCases = IS_DEV_MODE ? CASES : getVisibleCases(CASES);
  const visible = baseCases.filter((c) => {
    if (department !== "all" && c.department !== department) return false;
    if (specFilter && c.category !== specFilter) return false;
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.complaint.toLowerCase().includes(q) || (catMeta[c.category]?.label || "").toLowerCase().includes(q);
  });
  const displayCases = specFilter || department !== "all" || searchQuery || showAllCases || isDevMode ? visible : visible.slice(0, 4);

  const navItems = [
    { label: t("nav.theory"), icon: <IconTheory size={18} color={C.accent} />, action: () => { setPhase("theory"); setDrawerOpen(false); } },
    { label: t("nav.curriculum"), icon: <IconTarget size={18} color={C.accent} />, action: () => { setProgressionMode("strict"); setPhase("theory"); setDrawerOpen(false); } },
    { label: t("nav.courseMap"), icon: <IconMap size={18} color={C.accent} />, action: () => { setPhase("map"); setDrawerOpen(false); } },
    { label: t("nav.leaderboard"), icon: <IconTrophy size={18} color={C.accent} />, action: () => { setPhase("leaderboard"); setDrawerOpen(false); } },
    { label: t("nav.certificates"), icon: <IconGraduationCap size={18} color={C.accent} />, action: () => { setPhase("certificates"); setDrawerOpen(false); } },
    { label: t("nav.teacherDashboard"), icon: <IconChartBar size={18} color={C.accent} />, action: () => { setPhase("teacher_dashboard"); setDrawerOpen(false); } },
    { label: t("nav.settings"), icon: <IconGear size={18} color={C.accent} />, action: () => { setShowSettings(true); setDrawerOpen(false); } },
    { label: t("auth.logout"), icon: <IconLogOut size={18} color={C.red} />, action: () => { logout(); setDrawerOpen(false); }, danger: true },
  ];

  return (
    <div style={{ minHeight: "100dvh", background: C.bgGrad, fontFamily: FONT, overflowY: "auto", position: "relative", WebkitTapHighlightColor: "transparent" }}>
      {/* Mobile Sticky Header (Strictly responsive, no overflow) */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100, height: 56,
        background: C.headerBg, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", paddingTop: "env(safe-area-inset-top, 0px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <PillEmblem size={34} />
          <span style={{ fontSize: 16, fontWeight: 700, color: C.white, fontFamily: FONT, letterSpacing: -0.3 }}>{t("brand.name")}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={openNotif}
            aria-label="Уведомления"
            className="icon-btn"
            style={{
              position: "relative", minWidth: 44, minHeight: 44, width: 44, height: 44,
              background: showNotif ? `${C.accent}1a` : C.btnBg,
              border: `1px solid ${showNotif ? `${C.accent}55` : C.border}`,
              borderRadius: RADIUS.sm, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", padding: 0
            }}
          >
            <IconBell size={18} color={showNotif ? C.accent : C.textDim} />
            {unreadCount > 0 && <div style={{ position: "absolute", top: 10, right: 10, width: 7, height: 7, background: C.red, borderRadius: RADIUS.full, border: `1px solid ${C.bg}` }} />}
          </button>

          <button
            onClick={() => setDrawerOpen((v) => !v)}
            aria-label="Меню"
            className="icon-btn"
            style={{
              minWidth: 44, minHeight: 44, width: 44, height: 44,
              background: drawerOpen ? `${C.accent}1a` : C.btnBg,
              border: `1px solid ${drawerOpen ? `${C.accent}55` : C.border}`,
              borderRadius: RADIUS.sm, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", padding: 0
            }}
          >
            {drawerOpen ? <IconX size={20} color={C.accent} /> : <IconMenu size={20} color={C.white} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {drawerOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 120, display: "flex" }}>
          <div onClick={() => setDrawerOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />
          <div style={{
            position: "relative", marginLeft: "auto", width: "80%", maxWidth: 300, height: "100%",
            background: C.panel2, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column",
            boxShadow: "-8px 0 32px rgba(0,0,0,0.5)", paddingTop: "env(safe-area-inset-top, 16px)",
            paddingBottom: "env(safe-area-inset-bottom, 16px)", zIndex: 121
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.white, textTransform: "uppercase", letterSpacing: 1 }}>{t("nav.menuTitle") || "Навигация"}</span>
              <button onClick={() => setDrawerOpen(false)} style={{ width: 36, height: 36, background: "transparent", border: "none", color: C.textDim, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconX size={18} color={C.textDim} />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  style={{
                    minHeight: 46, display: "flex", alignItems: "center", gap: 14, padding: "10px 14px",
                    borderRadius: RADIUS.sm, background: "transparent", border: "none", cursor: "pointer",
                    color: item.danger ? C.red : C.white, fontSize: 14, fontFamily: FONT, fontWeight: 500,
                    textAlign: "left", width: "100%", transition: "background 0.15s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = C.dimBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <MenuNotificationsModal showNotif={showNotif} setShowNotif={setShowNotif} notifications={notifications} readNotifIds={readNotifIds} isMobile={true} t={t} C={C} />
      <MenuSettingsModal showSettings={showSettings} setShowSettings={setShowSettings} difficulty={difficulty} setDifficulty={setDifficulty} gameMode={gameMode} setGameMode={setGameMode} learningMode={learningMode} setLearningMode={setLearningMode} assessmentMode={assessmentMode} setAssessmentMode={setAssessmentMode} audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} hideWarnings={hideWarnings} setHideWarnings={setHideWarnings} theme={theme} setTheme={setTheme} locale={locale} setLocaleGlobal={setLocaleGlobal} LOCALES={LOCALES} llmProvider={llmProvider} setLlmProvider={setLlmProvider} llmKey={llmKey} setLlmKey={setLlmKey} showDevSettings={showDevSettings} setShowDevSettings={setShowDevSettings} isMobile={true} t={t} C={C} />

      {/* Search Input (16px font to prevent iOS Safari auto-zoom) */}
      <div style={{ padding: "14px 16px 6px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, background: C.panel,
          border: `1px solid ${searchFocused ? C.accent : C.border}`,
          boxShadow: searchFocused ? `0 0 16px -2px ${C.accent}20` : "none",
          borderRadius: RADIUS.md, minHeight: 46, padding: "0 14px", transition: "all 0.2s ease"
        }}>
          <IconSearch size={16} color={searchFocused ? C.accent : C.textDim} />
          <input
            className="seamless-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder={t("search.placeholder")}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            style={{ background: "transparent", border: "none", outline: "none", color: C.white, fontSize: 16, fontFamily: FONT, flex: 1, caretColor: C.accent }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} aria-label="Очистить поиск" style={{ width: 28, height: 28, borderRadius: RADIUS.full, background: C.dimBg, border: "none", color: C.textDim, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
              <IconX size={12} color={C.textDim} />
            </button>
          )}
        </div>
      </div>

      {/* Department filter chips (Touch target & momentum scroll) */}
      <div id="tutorial-filters" className="no-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "8px 16px 4px", WebkitOverflowScrolling: "touch" }}>
        {deptFilters.map(({ key, label }) => {
          const isA = department === key;
          return (
            <button
              key={key}
              onClick={() => { setDepartment(key); if (key !== "all") checkDeptTutorial?.(key); }}
              style={{
                flexShrink: 0, minHeight: 38, padding: "0 16px", borderRadius: RADIUS.full, fontSize: 13,
                fontFamily: FONT, fontWeight: 500, cursor: "pointer",
                background: isA ? `${C.accent}20` : C.btnBg,
                border: `1px solid ${isA ? C.accent : C.border}`,
                color: isA ? C.accent : C.textDim, display: "flex", alignItems: "center", gap: 6
              }}
            >
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Spec chips */}
      <div className="no-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "6px 16px 12px", WebkitOverflowScrolling: "touch" }}>
        <button
          onClick={() => setSpecFilter(null)}
          style={{
            flexShrink: 0, minHeight: 34, padding: "0 14px", borderRadius: RADIUS.full, fontSize: 12,
            fontFamily: FONT, fontWeight: 500, cursor: "pointer",
            background: !specFilter ? `${C.accent}20` : C.btnBg,
            border: `1px solid ${!specFilter ? C.accent : C.border}`,
            color: !specFilter ? C.accent : C.textDim
          }}
        >
          {t("filter.all")}
        </button>
        {navSpec.map(({ label, cat }) => {
          const isA = specFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setSpecFilter(isA ? null : cat)}
              style={{
                flexShrink: 0, minHeight: 34, padding: "0 14px", borderRadius: RADIUS.full, fontSize: 12,
                fontFamily: FONT, fontWeight: 500, cursor: "pointer",
                background: isA ? `${C.accent}20` : C.btnBg,
                border: `1px solid ${isA ? C.accent : C.border}`,
                color: isA ? C.accent : C.textDim
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Hero */}
      <div style={{ margin: "0 16px 20px", borderRadius: RADIUS.lg, overflow: "hidden", background: C.heroGrad, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", position: "relative", padding: "20px 18px" }}>
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 10, color: C.heroLabel, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6, fontFamily: FONT, fontWeight: 600 }}>{t("brand.tagline")}</div>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: SER, fontStyle: "italic", lineHeight: 1.15, background: C.heroTitleGrad, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent", marginBottom: 8 }}>{t("brand.name")}</div>
          <div style={{ fontSize: 13, color: C.heroText, fontFamily: FONT, marginBottom: 14, lineHeight: 1.5 }}>{t("hero.desc1")}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <button className="start-btn" onClick={startGame} style={{ background: C.accent, border: "none", borderRadius: RADIUS.sm, minHeight: 44, padding: "0 22px", fontSize: 14, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT }}>{t("hero.start")}</button>
            {t("hero.tags").map((tag) => <span key={tag} style={{ background: C.heroTagBg, border: `1px solid ${C.heroTagBorder}`, borderRadius: RADIUS.full, padding: "5px 11px", fontSize: 11, color: C.heroTagText, fontFamily: FONT }}>{tag}</span>)}
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div style={{ padding: "0 16px", paddingBottom: "calc(160px + env(safe-area-inset-bottom, 16px))" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.white, fontFamily: FONT }}>{specFilter ? catMeta[specFilter]?.label : searchQuery ? t("cases.searchResults") : t("cases.title")}</div>
          <button onClick={() => setShowAllCases((v) => !v)} style={{ fontSize: 12, color: C.accent, fontFamily: FONT, cursor: "pointer", padding: "6px 12px", borderRadius: RADIUS.sm, border: `1px solid ${C.accent}40`, background: `${C.accent}12` }}>{showAllCases ? t("cases.collapse") : t("cases.showAll", { n: CASES.length })}</button>
        </div>
        {visible.length === 0 ? (
          <div style={{ color: C.textDim, fontSize: 14, fontFamily: FONT, padding: "20px 0", textAlign: "center" }}>{t("cases.empty")}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {displayCases.map((c) => {
              const cm = catMeta[c.category] || { label: c.category, color: C.accent };
              const sc = { critical: C.red, moderate: C.yellow, mild: C.green }[c.severity] || C.yellow;
              const dots = { critical: 3, moderate: 2, mild: 1 }[c.severity] || 2;
              return (
                <div key={c.id} className="case-card" onClick={() => startGame(c.id)} style={{ background: `linear-gradient(135deg, ${C.panelBg} 0%, ${C.dimBg} 100%)`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: `1px solid ${C.border}`, borderRadius: RADIUS.md, padding: "16px", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: cm.color, fontFamily: FONT, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6 }}>{cm.label}</span>
                        <div style={{ display: "flex", gap: 3 }}>{[1, 2, 3].map((d) => <div key={d} style={{ width: 6, height: 6, borderRadius: RADIUS.full, background: d <= dots ? sc : `${sc}30` }} />)}</div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: C.white, fontFamily: FONT, marginBottom: 4, lineHeight: 1.3, wordBreak: "break-word" }}>{c.name}, {c.age} л</div>
                      <div style={{ fontSize: 12, color: C.textDim, fontFamily: FONT, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{c.complaint}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, display: "flex", alignItems: "center", gap: 4 }}>
                        <IconClock size={12} color={C.textDim} /> {c.timeLimit} {t("cases.minutes")}
                      </span>
                      <span style={{ fontSize: 11, color: sc, fontFamily: FONT, background: `${sc}15`, borderRadius: RADIUS.xs, padding: "2px 7px", fontWeight: 500 }}>
                        {{ critical: t("severity.critical"), moderate: t("severity.moderate"), mild: t("severity.mild") }[c.severity]}
                      </span>
                      {caseScores[c.id] != null && <span style={{ fontSize: 11, color: C.green, fontFamily: FONT, fontWeight: 600, background: `${C.green}15`, borderRadius: RADIUS.xs, padding: "2px 7px", display: "flex", alignItems: "center", gap: 3 }}><IconCheck size={11} color={C.green} /> {caseScores[c.id]}</span>}
                    </div>
                    <button className="start-btn" onClick={(e) => { e.stopPropagation(); startGame(c.id); }} style={{ background: C.accent, border: "none", borderRadius: RADIUS.sm, minHeight: 36, padding: "0 18px", fontSize: 13, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT }}>{t("cases.start")}</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed bottom bar (with safe area inset support) */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 90,
        background: C.headerBg, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid ${C.border}`, padding: "10px 16px calc(10px + env(safe-area-inset-bottom, 10px))"
      }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {[{ v: casesPlayed, l: t("progress.cases"), c: C.accent }, { v: casesPlayed ? Math.round(totalScore / casesPlayed) : 0, l: t("progress.avgScore"), c: C.green }, { v: totalScore, l: t("progress.totalPoints"), c: C.yellow }].map(({ v, l, c }) => (
            <div key={l} style={{ flex: 1, background: C.btnBg, borderRadius: RADIUS.sm, padding: "6px 8px", textAlign: "center", border: `1px solid ${C.border}` }}>
              <div className="tabular-nums" style={{ fontSize: 16, fontWeight: 700, color: c, fontFamily: CODE, lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        <button className="start-btn" onClick={startGame} style={{ background: `linear-gradient(135deg,${C.accent},${C.green})`, border: "none", borderRadius: RADIUS.sm, minHeight: 46, padding: "0 16px", fontSize: 15, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT, letterSpacing: 0.3, width: "100%", boxShadow: `0 4px 20px ${C.accent}30` }}>
          {t("cta.newPatient")}
        </button>
      </div>
    </div>
  );
}
