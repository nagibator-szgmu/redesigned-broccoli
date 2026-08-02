import { FONT, CODE, SER } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { CAT_COLOR, DIAGNOSTICS } from "../../data/diagnostics";
import { r1 } from "../../engine/patient";
import { STitle, Btn, CheckRow, ResultCard } from "../../ui/components";
import { useTranslate } from "../../locale/useTranslate";
import { TooltipBtn, PauseOverlay, LearningTipToast, HistoryPanel, TreatPanel, DiagFilterBar, TheoryModal } from "../../components/game";
import { ROUTE_ICONS } from "./OutpatientPanels";

/** Mobile layout for EmergencyGameScreen */
export default function MobileEmergencyLayout({
  cd, ps, phase, setPhase, selDiag, setSelDiag, selTreat, toggleTreatment,
  orderedDiag, revealedResults, diagText, setDiagText,
  diagCat, setDiagCat, treatCat, setTreatCat, appliedFx, pendingFx,
  timeLeft, handleOrderTests, handleSubmit, processingTests, allResultsReady,
  learningMode, paused, setPaused, showTheory, setShowTheory, relatedTopics,
  activeTheoryTopic, setActiveTheoryTopic, learningTip, mobileTab, setMobileTab, showInfo, setShowInfo,
  selectedRoute, setSelectedRoute, setExtraResult,
  handleRevealAnamnesis,
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const sev = cd.severity;
  const sevColor = { critical: C.red, moderate: C.yellow, mild: C.green }[sev] || C.yellow;
  const sevLabel = { critical: t("severity.critical"), moderate: t("severity.moderate"), mild: t("severity.mild") }[sev];
  const steps = [
    { key: "order_tests", label: t("phases.order_tests"), icon: "🔬" },
    { key: "awaiting_results", label: t("phases.awaiting_results"), icon: "⏳" },
    { key: "diagnose", label: t("phases.diagnose"), icon: "📋" },
  ];
  const activeStep = steps.findIndex(s => s.key === phase);
  const sharedTreatProps = { cd, selTreat, toggleTreatment, appliedFx, pendingFx, treatCat, setTreatCat, isMobile: true };

  return (
    <div style={{ height: "100vh", background: C.bgGrad, fontFamily: FONT, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <MobileHeader cd={cd} sevColor={sevColor} sevLabel={sevLabel} timeLeft={timeLeft} setPhase={setPhase} gameMode={cd.gameMode} learningMode={learningMode} paused={paused} setPaused={setPaused} showTheory={showTheory} setShowTheory={setShowTheory} relatedTopics={relatedTopics} t={t} C={C} />
      <MobileVitalsBar ps={ps} t={t} C={C} />
      <MobileStepBar steps={steps} phase={phase} activeStep={activeStep} C={C} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px 12px", minHeight: 0 }}>
        {mobileTab === "main" && <>
          {phase === "order_tests" && <MobileOrderTests cd={cd} ps={ps} selDiag={selDiag} setSelDiag={setSelDiag} orderedDiag={orderedDiag} selTreat={selTreat} diagCat={diagCat} setDiagCat={setDiagCat} handleOrderTests={handleOrderTests} processingTests={processingTests} showInfo={showInfo} setShowInfo={setShowInfo} C={C} t={t} handleRevealAnamnesis={handleRevealAnamnesis} />}
          {phase === "awaiting_results" && <MobileResults orderedDiag={orderedDiag} revealedResults={revealedResults} allResultsReady={allResultsReady} setPhase={setPhase} C={C} t={t} cd={cd} />}
          {phase === "diagnose" && <MobileDiagnose orderedDiag={orderedDiag} revealedResults={revealedResults} diagText={diagText} setDiagText={setDiagText} selTreat={selTreat} handleSubmit={handleSubmit} C={C} t={t} cd={cd} selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} setExtraResult={setExtraResult} />}
        </>}
        {mobileTab === "treatment" && <TreatPanel {...sharedTreatProps} showHeader={false} />}
      </div>
      {learningMode && learningTip && <LearningTipToast tip={learningTip} isMobile />}
      {learningMode && paused && <PauseOverlay onResume={() => setPaused(false)} />}
      <MobileTabBar mobileTab={setMobileTab} activeTab={mobileTab} phase={phase} selTreat={selTreat} orderedDiag={orderedDiag} t={t} C={C} />
      <TheoryModal relatedTopics={relatedTopics} showTheory={showTheory} setShowTheory={setShowTheory} activeTheoryTopic={activeTheoryTopic} setActiveTheoryTopic={setActiveTheoryTopic} isMobile />
    </div>
  );
}

function MobileHeader({ cd, sevColor, sevLabel, timeLeft, setPhase, gameMode, learningMode, paused, setPaused, showTheory, setShowTheory, relatedTopics, t, C }) {
  return (
    <header style={{ flexShrink: 0, padding: "0 14px", height: 52, display: "flex", alignItems: "center", gap: 10, background: C.headerBg, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,230,200,0.08)" }}>
      <div onClick={() => setPhase("menu")} className="icon-btn" style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: "linear-gradient(135deg,rgba(0,230,200,0.2),rgba(0,150,200,0.1))", border: "1px solid rgba(0,230,200,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <span style={{ fontFamily: SER, fontSize: 15, color: C.accent, fontStyle: "italic", fontWeight: 700 }}>М</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: FONT, lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cd.name}</div>
        <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, marginTop: 1 }}>{cd.age}{t("cases.ageSuffix")} · {cd.gender}</div>
      </div>
      <span style={{ background: `${sevColor}20`, border: `1px solid ${sevColor}44`, borderRadius: 5, padding: "2px 8px", fontSize: 10, color: sevColor, fontWeight: 700, fontFamily: FONT, flexShrink: 0 }}>{sevLabel}</span>
      {gameMode !== "normal" && <span style={{ background: gameMode === "stress" ? "rgba(255,61,90,0.15)" : "rgba(157,111,245,0.15)", border: `1px solid ${gameMode === "stress" ? "rgba(255,61,90,0.3)" : "rgba(157,111,245,0.3)"}`, borderRadius: 5, padding: "2px 8px", fontSize: 10, color: gameMode === "stress" ? C.red : "#9d6ff5", fontWeight: 700, fontFamily: FONT, flexShrink: 0 }}>{gameMode === "stress" ? t("game.stress") : t("game.random")}</span>}
      {learningMode && <span style={{ background: "rgba(245,200,66,0.15)", border: "1px solid rgba(245,200,66,0.3)", borderRadius: 5, padding: "2px 8px", fontSize: 10, color: C.yellow, fontWeight: 700, fontFamily: FONT, flexShrink: 0 }}>📚 {t("game.learning")}</span>}
      {learningMode && <div onClick={() => setPaused(v => !v)} style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: paused ? "rgba(245,200,66,0.2)" : "transparent", border: "1px solid rgba(245,200,66,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><span style={{ fontSize: 14 }}>{paused ? "▶" : "⏸"}</span></div>}
      {relatedTopics.length > 0 && <div onClick={() => setShowTheory(v => !v)} className="icon-btn" style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: showTheory ? "rgba(0,230,200,0.15)" : "transparent", border: "1px solid rgba(0,230,200,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><span style={{ fontSize: 14 }}>📚</span></div>}
      <div style={{ flexShrink: 0, textAlign: "right" }}>
        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: CODE, lineHeight: 1, color: timeLeft < 60 ? C.red : timeLeft < 180 ? C.yellow : C.accent }}>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</div>
        <div style={{ fontSize: 9, color: C.textDim, fontFamily: FONT }}>{t("game.timeRemaining")}</div>
      </div>
    </header>
  );
}

function MobileVitalsBar({ ps, t, C }) {
  return (
    <div className="no-scrollbar" style={{ flexShrink: 0, display: "flex", overflowX: "auto", background: C.sidebarBg, borderBottom: "1px solid rgba(0,230,200,0.06)", alignItems: "center" }}>
      <div style={{ padding: "7px 6px 7px 14px", flexShrink: 0 }}>
        <div style={{ fontSize: 8, color: C.textDim, textTransform: "uppercase", letterSpacing: 0.8, fontFamily: FONT, display: "flex", alignItems: "center", gap: 4 }}>{t("sidebar.vitals")}<TooltipBtn text={t("onboarding.tooltipVitals")} C={C} /></div>
      </div>
      {[{ label: t("vitals.sbp"), value: `${Math.round(ps.sbp)}/${Math.round(ps.dbp)}`, warn: ps.sbp < 90 || ps.sbp > 160 }, { label: t("vitals.hr"), value: `${Math.round(ps.hr)}`, warn: ps.hr > 100 || ps.hr < 50 }, { label: t("vitals.spo2"), value: `${r1(ps.spo2)}%`, warn: ps.spo2 < 94 }, { label: t("vitals.rr"), value: `${Math.round(ps.rr)}`, warn: ps.rr > 20 || ps.rr < 10 }, { label: t("vitals.gcs"), value: `${Math.round(ps.gcs)}`, warn: ps.gcs < 10 }, { label: t("vitals.pain"), value: `${r1(ps.pain)}/10`, warn: ps.pain > 7 }].map(({ label, value, warn }) => (
        <div key={label} style={{ flexShrink: 0, padding: "7px 14px", borderRight: "1px solid rgba(0,230,200,0.06)", background: warn ? `${C.red}0a` : "transparent", textAlign: "center" }}>
          <div style={{ fontSize: 8, color: warn ? C.red : C.textDim, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2, fontFamily: FONT }}>{label}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: warn ? C.red : C.accent, fontFamily: CODE, lineHeight: 1 }}>{value}</div>
        </div>
      ))}
      {(ps.status === "critical" || ps.status === "dead" || ps.status === "stable") && (
        <div style={{ flexShrink: 0, padding: "7px 14px", display: "flex", alignItems: "center", background: ps.status === "stable" ? `${C.green}0a` : `${C.red}0a` }}>
          <span style={{ fontSize: 11, color: ps.status === "stable" ? C.green : C.red, fontWeight: 700, fontFamily: FONT, whiteSpace: "nowrap" }}>{ps.status === "critical" ? t("game.critical") : ps.status === "dead" ? t("game.fatal") : t("game.stable")}</span>
        </div>
      )}
    </div>
  );
}

function MobileStepBar({ steps, phase, activeStep, C }) {
  return (
    <div style={{ flexShrink: 0, display: "flex", alignItems: "center", padding: "5px 14px", gap: 4, background: C.headerBg2, borderBottom: "1px solid rgba(0,230,200,0.04)" }}>
      {steps.map((s, i) => (
        <span key={s.key} style={{ display: "inline-flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontFamily: FONT, color: s.key === phase ? C.accent : i < activeStep ? C.green : C.textDim, fontWeight: s.key === phase ? 700 : 400, opacity: s.key === phase ? 1 : i < activeStep ? 0.85 : 0.4 }}>{s.icon} {s.label}</span>
          {i < 2 && <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 11, marginLeft: 2 }}>›</span>}
        </span>
      ))}
    </div>
  );
}

function MobileOrderTests({ cd, ps, selDiag, setSelDiag, orderedDiag, selTreat, diagCat, setDiagCat, handleOrderTests, processingTests, showInfo, setShowInfo, C, t, handleRevealAnamnesis }) {
  return (<>
    <HistoryPanel cd={cd} ps={ps} selTreat={selTreat} orderedDiag={orderedDiag} showInfo={showInfo} setShowInfo={setShowInfo} isMobile onRevealAnamnesis={handleRevealAnamnesis} />
    <STitle icon="🔬" label={t("orderTests.title")} color={C.accent} />
    <DiagFilterBar diagCat={diagCat} setDiagCat={setDiagCat} t={t} />
    <div>{[...new Set(DIAGNOSTICS.map(d => d.cat))].includes(diagCat) || diagCat === "all" ? DIAGNOSTICS.filter(d => diagCat === "all" || d.cat === diagCat).map(item => <CheckRow key={item.id} item={item} selected={selDiag.includes(item.id)} onToggle={id => setSelDiag(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])} color={CAT_COLOR[item.cat] || C.accent} disabled={processingTests || orderedDiag.includes(item.id)} />) : null}</div>
    <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(0,230,200,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 13, color: C.textDim, fontFamily: FONT }}>{t("orderTests.selected", { n: selDiag.length })}</span>
      <Btn onClick={handleOrderTests} disabled={selDiag.length === 0 || processingTests} color={C.accent} style={{ padding: "10px 18px", fontSize: 13 }}>{t("orderTests.send")}</Btn>
    </div>
  </>);
}

function MobileResults({ orderedDiag, revealedResults, allResultsReady, setPhase, C, t, cd }) {
  return (<>
    {!allResultsReady && <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: C.yellowDim, border: "1px solid rgba(245,200,66,0.22)", borderRadius: 10, marginBottom: 12, fontSize: 13, color: C.yellow, fontFamily: FONT }}><div style={{ width: 12, height: 12, border: `2px solid ${C.yellow}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />{t("awaiting.title", { n: Object.keys(revealedResults).length, total: orderedDiag.length })}</div>}
    {allResultsReady && <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 14px", background: C.greenDim, border: "1px solid rgba(0,229,160,0.22)", borderRadius: 10, marginBottom: 12, fontSize: 13, color: C.green, fontFamily: FONT }}><span>{t("awaiting.allReady")}</span><Btn onClick={() => setPhase("diagnose")} color={C.green} style={{ padding: "10px", fontSize: 13, width: "100%" }}>{t("awaiting.toDiagnose")}</Btn></div>}
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>{orderedDiag.map(id => { const text = revealedResults[id]; if (!text) return <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "rgba(13,26,46,0.6)", border: "1px solid rgba(0,230,200,0.06)", borderRadius: 12, opacity: 0.6, marginBottom: 8 }}><div style={{ width: 9, height: 9, border: `2px solid ${C.textDim}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} /><span style={{ fontSize: 13, color: C.textDim, fontFamily: FONT }}>{DIAGNOSTICS.find(d => d.id === id)?.name || id}...</span></div>; return <ResultCard key={id} id={id} text={text} isNew={false} cd={cd} />; })}</div>
  </>);
}

function MobileDiagnose({ orderedDiag, revealedResults, diagText, setDiagText, selTreat, handleSubmit, C, t, cd, selectedRoute, setSelectedRoute, setExtraResult }) {
  const isAdmission = cd?.department === "admission";
  const canSubmit = isAdmission ? selTreat.length > 0 && selectedRoute !== null : selTreat.length > 0;
  const doSubmit = () => {
    if (isAdmission && setExtraResult) setExtraResult({ selectedRoute, routeOptions: cd.routeOptions, correctRoute: cd.correctRoute });
    handleSubmit(false);
  };
  return (<>
    <div style={{ background: C.panelBg, border: "1px solid rgba(0,230,200,0.08)", borderRadius: 12, padding: "10px 12px", marginBottom: 12 }}>
      <STitle icon="📋" label={t("results.title", { n: orderedDiag.length })} color={C.accent} />
      {orderedDiag.slice(0, 2).map(id => <ResultCard key={id} id={id} text={revealedResults[id] || ""} cd={cd} />)}
      {orderedDiag.length > 2 && <div style={{ fontSize: 12, color: C.textDim, fontFamily: FONT, textAlign: "center", paddingTop: 4 }}>{t("component.more")} {orderedDiag.length - 2}</div>}
    </div>
    <div style={{ background: C.panelBg, border: "1px solid rgba(157,111,245,0.2)", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
      <STitle icon="🩺" label={t("diagnose.title")} color={C.purple} />
      <textarea value={diagText} onChange={e => setDiagText(e.target.value)} placeholder={t("diagnose.placeholder")} style={{ width: "100%", minHeight: 90, background: C.headerBg2, border: `1px solid ${diagText ? "rgba(157,111,245,0.4)" : "rgba(0,230,200,0.1)"}`, borderRadius: 10, padding: "10px 12px", color: C.white, fontSize: 13, fontFamily: FONT, resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.8 }} />
    </div>
    {isAdmission && (
      <div style={{ background: C.panelBg, border: `1px solid ${selectedRoute ? "rgba(0,229,160,0.3)" : "rgba(245,200,66,0.2)"}`, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
        <STitle icon="🚶" label={t("outpatient.routeTitle")} color={selectedRoute ? C.green : C.yellow} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {(cd.routeOptions || []).map(opt => {
            const sel = selectedRoute === opt.id;
            return (
              <div key={opt.id} onClick={() => setSelectedRoute(opt.id)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer", background: sel ? `${C.green}15` : "transparent", border: `1px solid ${sel ? C.green : C.border}`, transition: "all 0.15s" }}>
                <span style={{ fontSize: 18 }}>{ROUTE_ICONS[opt.id] || "📋"}</span>
                <span style={{ fontSize: 13, color: sel ? C.green : C.text, fontWeight: sel ? 600 : 400, fontFamily: FONT, flex: 1 }}>{opt.label}</span>
                {sel && <span style={{ fontSize: 14, color: C.green }}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    )}
    <div style={{ background: C.panelBg, border: "1px solid rgba(0,230,200,0.08)", borderRadius: 12, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
      <span style={{ fontSize: 13, color: selTreat.length > 0 ? C.green : C.yellow, fontFamily: FONT }}>{selTreat.length > 0 ? t("diagnose.prescribed", { n: selTreat.length }) : t("diagnose.treatTab")}</span>
      <Btn onClick={doSubmit} disabled={!canSubmit} color={C.green} style={{ padding: "12px", fontSize: 14, width: "100%" }}>{t("diagnose.complete")}</Btn>
    </div>
  </>);
}

function MobileTabBar({ activeTab, setMobileTab, phase, selTreat, orderedDiag, t, C }) {
  const steps = [
    { key: "order_tests", icon: "🔬" },
    { key: "awaiting_results", icon: "⏳" },
    { key: "diagnose", icon: "📋" },
  ];
  return (
    <div style={{ flexShrink: 0, height: 52, display: "flex", background: C.headerBg, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(0,230,200,0.1)" }}>
      <button onClick={() => setMobileTab("main")} style={{ flex: 1, border: "none", background: activeTab === "main" ? "rgba(0,230,200,0.04)" : "transparent", borderTop: activeTab === "main" ? `2px solid ${C.accent}` : "2px solid transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
        <span style={{ fontSize: 14 }}>{steps.find(s => s.key === phase)?.icon || "📋"}</span>
        <span style={{ fontSize: 10, fontFamily: FONT, fontWeight: activeTab === "main" ? 600 : 400, color: activeTab === "main" ? C.accent : C.textDim }}>{phase === "order_tests" ? t("phases.order_tests") : phase === "awaiting_results" ? t("results.title", { n: orderedDiag.length }) : t("diagnose.title")}</span>
      </button>
      <button onClick={() => setMobileTab("treatment")} style={{ flex: 1, border: "none", background: activeTab === "treatment" ? "rgba(0,229,160,0.04)" : "transparent", borderTop: activeTab === "treatment" ? `2px solid ${C.green}` : "2px solid transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, position: "relative" }}>
        <span style={{ fontSize: 14 }}>💊</span>
        <span style={{ fontSize: 10, fontFamily: FONT, fontWeight: activeTab === "treatment" ? 600 : 400, color: activeTab === "treatment" ? C.green : C.textDim }}>{t("treatment.title")}</span>
        {selTreat.length > 0 && <div style={{ position: "absolute", top: 6, right: "calc(50% - 20px)", width: 16, height: 16, background: C.green, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#000", fontWeight: 700 }}>{selTreat.length}</div>}
      </button>
    </div>
  );
}
