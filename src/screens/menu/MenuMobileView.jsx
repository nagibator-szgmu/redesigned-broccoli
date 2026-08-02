import { SER, FONT, CODE } from "../../ui/theme";
import { CASES } from "../../data/cases";
import { IS_DEV_MODE } from "../../config";
import { getVisibleCases } from "../../hooks/useReviewRegistry";
import MenuNotificationsModal from "./MenuNotificationsModal";
import MenuSettingsModal from "./MenuSettingsModal";

/**
 * MenuMobileView component for responsive mobile layout.
 */
export default function MenuMobileView(props) {
  const {
    startGame, setPhase, totalScore, casesPlayed, searchQuery, setSearchQuery,
    searchFocused, setSearchFocused, department, setDepartment, specFilter, setSpecFilter,
    showAllCases, setShowAllCases, showNotif, setShowNotif, showSettings, setShowSettings,
    difficulty, setDifficulty, gameMode, setGameMode, theme, setTheme, learningMode, setLearningMode,
    assessmentMode, setAssessmentMode, progressionMode, setProgressionMode, audioEnabled, setAudioEnabled,
    hideWarnings, setHideWarnings, isDevMode, checkDeptTutorial, unreadCount,
    readNotifIds, notifications, openNotif, logout, locale, setLocaleGlobal, LOCALES,
    llmProvider, setLlmProvider, llmKey, setLlmKey, showDevSettings, setShowDevSettings,
    catMeta, navSpec, deptFilters, caseScores, t, C,
  } = props;

  const q = searchQuery.toLowerCase();
  const baseCases = IS_DEV_MODE ? CASES : getVisibleCases(CASES);
  const visible = baseCases.filter((c) => {
    if (department !== "all" && c.department !== department) return false;
    if (specFilter && c.category !== specFilter) return false;
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.complaint.toLowerCase().includes(q) || (catMeta[c.category]?.label || "").toLowerCase().includes(q);
  });
  const displayCases = specFilter || department !== "all" || searchQuery || showAllCases || isDevMode ? visible : visible.slice(0, 4);

  return (
    <div style={{ minHeight: "100vh", background: C.bgGrad, fontFamily: FONT, overflowY: "auto", position: "relative" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, height: 54, background: C.headerBg, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,230,200,0.06)", display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,rgba(0,230,200,0.2),rgba(0,150,200,0.1))", border: "1px solid rgba(0,230,200,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: SER, fontSize: 16, color: C.accent, fontStyle: "italic", fontWeight: 700 }}>М</span>
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: C.white, fontFamily: FONT, letterSpacing: -0.3 }}>{t("brand.name")}</span>
        <div style={{ flex: 1 }} />
        <div onClick={() => setPhase("theory")} className="icon-btn" style={{ width: 34, height: 34, background: C.btnBg, border: "1px solid rgba(0,230,200,0.08)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><span style={{ fontSize: 15 }}>📚</span></div>
        <div onClick={() => { setProgressionMode("strict"); setPhase("theory"); }} className="icon-btn" style={{ width: 34, height: 34, background: progressionMode === "strict" ? `${C.accent}20` : C.btnBg, border: `1px solid ${progressionMode === "strict" ? `${C.accent}30` : "rgba(0,230,200,0.08)"}`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><span style={{ fontSize: 15 }}>🎯</span></div>
        <div onClick={() => setPhase("map")} className="icon-btn" style={{ width: 34, height: 34, background: C.btnBg, border: "1px solid rgba(0,230,200,0.08)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><span style={{ fontSize: 15 }}>🗺️</span></div>
        <div onClick={() => setPhase("leaderboard")} className="icon-btn" style={{ width: 34, height: 34, background: C.btnBg, border: "1px solid rgba(0,230,200,0.08)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><span style={{ fontSize: 15 }}>🏆</span></div>
        <div onClick={() => setPhase("certificates")} className="icon-btn" style={{ width: 34, height: 34, background: C.btnBg, border: "1px solid rgba(0,230,200,0.08)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><span style={{ fontSize: 15 }}>🎓</span></div>
        <div onClick={() => setPhase("teacher_dashboard")} className="icon-btn" style={{ width: 34, height: 34, background: C.btnBg, border: "1px solid rgba(0,230,200,0.08)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title={t("nav.teacherDashboard")}><span style={{ fontSize: 15 }}>📊</span></div>
        <div onClick={openNotif} className="icon-btn" style={{ position: "relative", width: 34, height: 34, background: showNotif ? `${C.accent}1a` : C.btnBg, border: `1px solid ${showNotif ? `${C.accent}55` : "rgba(0,230,200,0.08)"}`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <span style={{ fontSize: 15, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 15, height: 15, lineHeight: 1 }}>🔔</span>
          {unreadCount > 0 && <div style={{ position: "absolute", top: 5, right: 5, width: 6, height: 6, background: C.red, borderRadius: "50%", border: "1px solid #070d18" }} />}
        </div>
        <div id="tutorial-other" onClick={() => { setShowSettings((v) => !v); setShowNotif(false); }} className="icon-btn" style={{ width: 34, height: 34, background: showSettings ? `${C.accent}1a` : C.btnBg, border: `1px solid ${showSettings ? `${C.accent}55` : "rgba(0,230,200,0.08)"}`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <span style={{ fontSize: 15, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 15, height: 15, lineHeight: 1 }}>⚙️</span>
        </div>
        <div onClick={logout} className="icon-btn" style={{ width: 34, height: 34, background: C.btnBg, border: "1px solid rgba(0,230,200,0.08)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <span style={{ fontSize: 15, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 15, height: 15, lineHeight: 1 }}>🚪</span>
        </div>
      </header>

      <MenuNotificationsModal showNotif={showNotif} setShowNotif={setShowNotif} notifications={notifications} readNotifIds={readNotifIds} isMobile={true} t={t} C={C} />
      <MenuSettingsModal showSettings={showSettings} setShowSettings={setShowSettings} difficulty={difficulty} setDifficulty={setDifficulty} gameMode={gameMode} setGameMode={setGameMode} learningMode={learningMode} setLearningMode={setLearningMode} assessmentMode={assessmentMode} setAssessmentMode={setAssessmentMode} audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} hideWarnings={hideWarnings} setHideWarnings={setHideWarnings} theme={theme} setTheme={setTheme} locale={locale} setLocaleGlobal={setLocaleGlobal} LOCALES={LOCALES} llmProvider={llmProvider} setLlmProvider={setLlmProvider} llmKey={llmKey} setLlmKey={setLlmKey} showDevSettings={showDevSettings} setShowDevSettings={setShowDevSettings} isMobile={true} t={t} C={C} />

      {/* Search */}
      <div style={{ padding: "12px 16px 6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.panel, border: `1px solid ${searchFocused ? `${C.accent}55` : C.border}`, boxShadow: searchFocused ? `0 0 16px -2px ${C.accent}15, 0 4px 20px rgba(0,0,0,0.3)` : "none", borderRadius: 12, padding: "8px 12px", marginBottom: 20, transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <span style={{ fontSize: 14 }}>🔍</span>
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} placeholder={t("search.placeholder")} style={{ background: "transparent", border: "none", outline: "none", color: C.white, fontSize: 13, fontFamily: FONT, flex: 1, caretColor: C.accent }} />
          {searchQuery && <span onClick={() => setSearchQuery("")} style={{ fontSize: 11, color: C.textDim, cursor: "pointer", padding: "2px 8px", borderRadius: 6, background: C.dimBg }}>✕</span>}
        </div>
      </div>

      {/* Department filter */}
      <div id="tutorial-filters" className="no-scrollbar" style={{ display: "flex", gap: 7, overflowX: "auto", padding: "10px 16px 4px" }}>
        {deptFilters.map(({ key, label, icon }) => {
          const isA = department === key;
          return <div key={key} onClick={() => { setDepartment(key); if (key !== "all") checkDeptTutorial?.(key); }} style={{ flexShrink: 0, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontFamily: FONT, cursor: "pointer", background: isA ? "rgba(0,230,200,0.15)" : C.btnBg, border: `1px solid ${isA ? "rgba(0,230,200,0.3)" : "rgba(0,230,200,0.1)"}`, color: isA ? C.accent : C.textDim }}>{icon} {label}</div>;
        })}
      </div>

      {/* Spec chips */}
      <div className="no-scrollbar" style={{ display: "flex", gap: 7, overflowX: "auto", padding: "6px 16px 10px" }}>
        <div onClick={() => setSpecFilter(null)} style={{ flexShrink: 0, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontFamily: FONT, cursor: "pointer", background: !specFilter ? "rgba(0,230,200,0.15)" : C.btnBg, border: `1px solid ${!specFilter ? "rgba(0,230,200,0.3)" : "rgba(0,230,200,0.1)"}`, color: !specFilter ? C.accent : C.textDim }}>{t("filter.all")}</div>
        {navSpec.map(({ icon, label, cat }) => {
          const isA = specFilter === cat;
          return <div key={cat} onClick={() => setSpecFilter(isA ? null : cat)} style={{ flexShrink: 0, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontFamily: FONT, cursor: "pointer", background: isA ? "rgba(0,230,200,0.15)" : C.btnBg, border: `1px solid ${isA ? "rgba(0,230,200,0.3)" : "rgba(0,230,200,0.1)"}`, color: isA ? C.accent : C.textDim }}>{icon} {label}</div>;
        })}
      </div>

      {/* Hero */}
      <div style={{ margin: "0 16px 20px", borderRadius: 18, overflow: "hidden", background: C.heroGrad, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", position: "relative", padding: "22px 20px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,230,200,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,230,200,0.03) 1px,transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 9, color: C.heroLabel, letterSpacing: 4, textTransform: "uppercase", marginBottom: 8, fontFamily: FONT, fontWeight: 600 }}>{t("brand.tagline")}</div>
          <div key={theme} style={{ fontSize: 34, fontWeight: 700, fontFamily: SER, fontStyle: "italic", lineHeight: 1.1, background: C.heroTitleGrad, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent", marginBottom: 8 }}>{t("brand.name")}</div>
          <div style={{ fontSize: 12, color: C.heroText, fontFamily: FONT, marginBottom: 16, lineHeight: 1.5 }}>{t("hero.desc1")}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <button className="start-btn" onClick={startGame} style={{ background: C.accent, border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT, letterSpacing: 0.3, boxShadow: `0 4px 16px rgba(0,230,200,0.3)` }}>{t("hero.start")}</button>
            {t("hero.tags").map((tag) => <span key={tag} style={{ background: C.heroTagBg, border: `1px solid ${C.heroTagBorder}`, borderRadius: 20, padding: "4px 10px", fontSize: 11, color: C.heroTagText, fontFamily: FONT }}>{tag}</span>)}
          </div>
        </div>
      </div>

      {/* Cases */}
      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.white, fontFamily: FONT }}>{specFilter ? catMeta[specFilter]?.label : searchQuery ? t("cases.searchResults") : t("cases.title")}</div>
          <div onClick={() => setShowAllCases((v) => !v)} style={{ fontSize: 12, color: C.accent, fontFamily: FONT, cursor: "pointer", padding: "4px 11px", borderRadius: 8, border: "1px solid rgba(0,230,200,0.2)", background: "rgba(0,230,200,0.06)" }}>{showAllCases ? t("cases.collapse") : t("cases.showAll", { n: CASES.length })}</div>
        </div>
        {visible.length === 0 ? (
          <div style={{ color: C.textDim, fontSize: 14, fontFamily: FONT, padding: "20px 0" }}>{t("cases.empty")}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 110 }}>
            {displayCases.map((c) => {
              const cm = catMeta[c.category] || { icon: "🏥", label: c.category, color: C.accent };
              const sc = { critical: C.red, moderate: C.yellow, mild: C.green }[c.severity] || C.yellow;
              const dots = { critical: 3, moderate: 2, mild: 1 }[c.severity] || 2;
              return (
                <div key={c.id} className="case-card" onClick={() => startGame(c.id)} style={{ background: `linear-gradient(135deg, ${C.panelBg} 0%, ${C.dimBg} 100%)`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", cursor: "pointer", boxShadow: "0 8px 32px 0 rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)", transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: `${cm.color}18`, border: `1px solid ${cm.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>{cm.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: cm.color, fontFamily: FONT, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6 }}>{cm.label}</span>
                        <div style={{ display: "flex", gap: 3 }}>{[1, 2, 3].map((d) => <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: d <= dots ? sc : `${sc}30` }} />)}</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.white, fontFamily: FONT, marginBottom: 4, lineHeight: 1.3 }}>{c.name}, {c.age} л</div>
                      <div style={{ fontSize: 12, color: C.textDim, fontFamily: FONT, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{c.complaint}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid rgba(0,230,200,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, cursor: "help" }} title={t("cases.timeLimitTooltip")}>⏱ {c.timeLimit} {t("cases.minutes")}</span>
                      <span style={{ fontSize: 11, color: sc, fontFamily: FONT, background: `${sc}15`, borderRadius: 5, padding: "2px 7px" }}>{{ critical: t("severity.critical"), moderate: t("severity.moderate"), mild: t("severity.mild") }[c.severity]}</span>
                      {caseScores[c.id] != null && <span style={{ fontSize: 11, color: C.green, fontFamily: FONT, fontWeight: 600, background: `${C.green}15`, borderRadius: 5, padding: "2px 7px" }}>✓ {caseScores[c.id]}</span>}
                    </div>
                    <button className="start-btn" onClick={(e) => { e.stopPropagation(); startGame(c.id); }} style={{ background: C.accent, border: "none", borderRadius: 9, padding: "7px 18px", fontSize: 13, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT, boxShadow: `0 3px 12px rgba(0,230,200,0.25)` }}>{t("cases.start")}</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed bottom bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 90, background: C.headerBg, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(0,230,200,0.1)", padding: "12px 16px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {[{ v: casesPlayed, l: t("progress.cases"), c: C.accent }, { v: casesPlayed ? Math.round(totalScore / casesPlayed) : 0, l: t("progress.avgScore"), c: C.green }, { v: totalScore, l: t("progress.totalPoints"), c: C.yellow }].map(({ v, l, c }) => (
            <div key={l} style={{ flex: 1, background: C.btnBg, borderRadius: 10, padding: "7px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: c, fontFamily: CODE, lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        <button className="start-btn" onClick={startGame} style={{ background: `linear-gradient(135deg,${C.accent},${C.green})`, border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT, letterSpacing: 0.5, width: "100%", boxShadow: `0 6px 24px rgba(0,230,200,0.3)` }}>
          {t("cta.newPatient")}
        </button>
      </div>
    </div>
  );
}
