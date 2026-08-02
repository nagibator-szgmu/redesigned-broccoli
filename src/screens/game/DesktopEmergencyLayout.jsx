import { FONT, CODE, SER } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { CAT_COLOR, DIAGNOSTICS } from "../../data/diagnostics";
import { r1 } from "../../engine/patient";
import { STitle, Btn, CheckRow, TimerCircle, ResultCard } from "../../ui/components";
import { useTranslate } from "../../locale/useTranslate";
import { PauseOverlay, LearningTipToast, HistoryPanel, TreatPanel, DiagFilterBar, TheoryModal } from "../../components/game";
import { ROUTE_ICONS } from "./OutpatientPanels";
import PatientSidebar from "../../components/PatientSidebar";

/** Desktop layout for EmergencyGameScreen */
export default function DesktopEmergencyLayout({
  cd, ps, prevPs, phase, setPhase, selDiag, setSelDiag, selTreat, toggleTreatment,
  orderedDiag, revealedResults, newResultIds, diagText, setDiagText,
  diagCat, setDiagCat, treatCat, setTreatCat, appliedFx, pendingFx,
  timeLeft, totalTime, eventLog, handleOrderTests, handleSubmit,
  processingTests, allResultsReady, learningMode, paused, setPaused,
  showTheory, setShowTheory, relatedTopics, activeTheoryTopic, setActiveTheoryTopic,
  learningTip, showInfo, setShowInfo,
  selectedRoute, setSelectedRoute, setExtraResult,
  handleRevealAnamnesis,
  audioEnabled, setAudioEnabled,
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const sev = cd.severity;
  const sevColor = { critical: C.red, moderate: C.yellow, mild: C.green }[sev] || C.yellow;
  const sevLabel = { critical: t("severity.critical"), moderate: t("severity.moderate"), mild: t("severity.mild") }[sev];

  const trend = (key) => {
    if (!ps || !prevPs) return 0;
    return ps[key] > prevPs[key] ? 1 : ps[key] < prevPs[key] ? -1 : 0;
  };

  const steps = [
    { key: "order_tests", label: t("phases.order_tests"), icon: "🔬" },
    { key: "awaiting_results", label: t("phases.awaiting_results"), icon: "⏳" },
    { key: "diagnose", label: t("phases.diagnose"), icon: "📋" },
  ];
  const activeStep = steps.findIndex(s => s.key === phase);
  const sharedTreatProps = { cd, selTreat, toggleTreatment, appliedFx, pendingFx, treatCat, setTreatCat, isMobile: false };

  return (
    <div style={{ height: "100vh", background: C.bgGrad, fontFamily: FONT, display: "flex", overflow: "hidden", position: "relative" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", left: "-5%", top: "-10%", width: 500, height: 500, background: C.glowBg1, borderRadius: "50%" }} />
        <div style={{ position: "absolute", right: "-5%", bottom: "-10%", width: 400, height: 400, background: C.glowBg2, borderRadius: "50%" }} />
      </div>
      <PatientSidebar phase={phase} setPhase={setPhase} cd={cd} ps={ps} timeLeft={timeLeft} totalTime={totalTime} eventLog={eventLog} steps={steps} activeStep={activeStep} trend={trend} C={C} FONT={FONT} CODE={CODE} SER={SER} r1={r1} TimerCircle={TimerCircle} sevColor={sevColor} sevLabel={sevLabel} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, zIndex: 1 }}>
        <DesktopHeader phase={phase} setPhase={setPhase} showTheory={showTheory} setShowTheory={setShowTheory} relatedTopics={relatedTopics} learningMode={learningMode} paused={paused} setPaused={setPaused} allResultsReady={allResultsReady} t={t} C={C} audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} />
        <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
          {phase === "order_tests" && <DesktopOrderTests cd={cd} ps={ps} selDiag={selDiag} setSelDiag={setSelDiag} orderedDiag={orderedDiag} diagCat={diagCat} setDiagCat={setDiagCat} handleOrderTests={handleOrderTests} processingTests={processingTests} showInfo={showInfo} setShowInfo={setShowInfo} sharedTreatProps={sharedTreatProps} C={C} t={t} handleRevealAnamnesis={handleRevealAnamnesis} />}
          {phase === "awaiting_results" && <DesktopResults orderedDiag={orderedDiag} revealedResults={revealedResults} newResultIds={newResultIds} allResultsReady={allResultsReady} setPhase={setPhase} sharedTreatProps={sharedTreatProps} C={C} t={t} cd={cd} />}
          {phase === "diagnose" && <DesktopDiagnose orderedDiag={orderedDiag} revealedResults={revealedResults} diagText={diagText} setDiagText={setDiagText} selTreat={selTreat} pendingFx={pendingFx} handleSubmit={handleSubmit} sharedTreatProps={sharedTreatProps} C={C} t={t} cd={cd} selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} setExtraResult={setExtraResult} />}
        </div>
      </div>
      {learningMode && learningTip && <LearningTipToast tip={learningTip} isMobile={false} />}
      {learningMode && paused && <PauseOverlay onResume={() => setPaused(false)} />}
      <TheoryModal relatedTopics={relatedTopics} showTheory={showTheory} setShowTheory={setShowTheory} activeTheoryTopic={activeTheoryTopic} setActiveTheoryTopic={setActiveTheoryTopic} isMobile={false} />
    </div>
  );
}

function DesktopHeader({ phase, setPhase, showTheory, setShowTheory, relatedTopics, learningMode, paused, setPaused, allResultsReady, t, C, audioEnabled, setAudioEnabled }) {
  return (
    <header style={{ height: 46, flexShrink: 0, padding: "0 20px", display: "flex", alignItems: "center", gap: 10, background: C.headerBg2, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,230,200,0.06)" }}>
      <span style={{ fontSize: 11, color: C.textDim, fontFamily: FONT }}>{t("brand.name")}</span>
      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>›</span>
      <span style={{ fontSize: 12, color: C.accent, fontFamily: FONT, fontWeight: 600 }}>{phase === "order_tests" ? "🔬" : phase === "awaiting_results" ? "⏳" : "📋"} {phase === "order_tests" ? t("phases.order_tests") : phase === "awaiting_results" ? t("phases.awaiting_results") : t("phases.diagnose")}</span>
      <div style={{ flex: 1 }} />
      {relatedTopics.length > 0 && <div onClick={() => setShowTheory(v => !v)} className="icon-btn" style={{ width: 30, height: 30, borderRadius: 8, background: showTheory ? "rgba(0,230,200,0.15)" : "transparent", border: "1px solid rgba(0,230,200,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginRight: 6 }}><span style={{ fontSize: 14 }}>📚</span></div>}
      <div onClick={() => setAudioEnabled(v => !v)} className="icon-btn" style={{ width: 30, height: 30, borderRadius: 8, background: !audioEnabled ? "rgba(255,61,90,0.15)" : "transparent", border: `1px solid ${!audioEnabled ? "rgba(255,61,90,0.3)" : "rgba(0,230,200,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginRight: 6 }} title={audioEnabled ? "Выключить звук монитора" : "Включить звук монитора"}>
        <span style={{ fontSize: 13 }}>{audioEnabled ? "🔊" : "🔇"}</span>
      </div>
      {learningMode && <span style={{ background: "rgba(245,200,66,0.15)", border: "1px solid rgba(245,200,66,0.3)", borderRadius: 5, padding: "3px 10px", fontSize: 11, color: C.yellow, fontWeight: 700, fontFamily: FONT }}>📚 {t("game.learning")}</span>}
      {learningMode && <div onClick={() => setPaused(v => !v)} className="icon-btn" style={{ width: 30, height: 30, borderRadius: 8, background: paused ? "rgba(245,200,66,0.2)" : "transparent", border: "1px solid rgba(245,200,66,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><span style={{ fontSize: 14 }}>{paused ? "▶" : "⏸"}</span></div>}
      {phase === "awaiting_results" && allResultsReady && <Btn onClick={() => setPhase("diagnose")} color={C.green} style={{ padding: "6px 16px", fontSize: 12 }}>{t("diagnose.toDiagnose")}</Btn>}
    </header>
  );
}

function DesktopOrderTests({ cd, ps, selDiag, setSelDiag, orderedDiag, diagCat, setDiagCat, handleOrderTests, processingTests, showInfo, setShowInfo, sharedTreatProps, C, t, handleRevealAnamnesis }) {
  return (<>
    <div data-tutorial="test_panel" style={{ flex: 1, overflowY: "auto", padding: "14px 16px", minWidth: 0 }}>
      <HistoryPanel cd={cd} ps={ps} selTreat={sharedTreatProps.selTreat} orderedDiag={orderedDiag} showInfo={showInfo} setShowInfo={setShowInfo} isMobile={false} onRevealAnamnesis={handleRevealAnamnesis} />
      <div style={{ background: C.accentDim, border: "1px solid rgba(0,230,200,0.18)", borderRadius: 10, padding: "9px 14px", marginBottom: 14, fontSize: 12, color: C.accent, lineHeight: 1.6, fontFamily: FONT }}>{t("orderTests.instructions")}</div>
      <STitle icon="🔬" label={t("orderTests.title")} color={C.accent} />
      <DiagFilterBar diagCat={diagCat} setDiagCat={setDiagCat} t={t} />
      <div>{(diagCat === "all" ? DIAGNOSTICS : DIAGNOSTICS.filter(d => d.cat === diagCat)).map(item => <CheckRow key={item.id} item={item} selected={selDiag.includes(item.id)} onToggle={id => setSelDiag(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])} color={CAT_COLOR[item.cat] || C.accent} disabled={processingTests || orderedDiag.includes(item.id)} />)}</div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(0,230,200,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: C.textDim, fontFamily: FONT }}>{t("orderTests.selected", { n: selDiag.length })}</span>
        <Btn onClick={handleOrderTests} disabled={selDiag.length === 0 || processingTests} color={C.accent}>{t("orderTests.send")}</Btn>
      </div>
    </div>
    <div data-tutorial="treatment_panel" style={{ width: 260, flexShrink: 0, borderLeft: "1px solid rgba(0,230,200,0.06)", overflowY: "auto", padding: "14px 12px", background: C.dimBg }}>
      <TreatPanel {...sharedTreatProps} />
    </div>
  </>);
}

function DesktopResults({ orderedDiag, revealedResults, newResultIds, allResultsReady, setPhase, sharedTreatProps, C, t, cd }) {
  return (<>
    <div data-tutorial="results_wait" style={{ flex: 1, overflowY: "auto", padding: "14px 16px", minWidth: 0 }}>
      {!allResultsReady && <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: C.yellowDim, border: "1px solid rgba(245,200,66,0.22)", borderRadius: 10, marginBottom: 14, fontSize: 13, color: C.yellow, fontFamily: FONT }}><div style={{ width: 12, height: 12, border: `2px solid ${C.yellow}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />{t("awaiting.title", { n: Object.keys(revealedResults).length, total: orderedDiag.length })}</div>}
      {allResultsReady && <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: C.greenDim, border: "1px solid rgba(0,229,160,0.22)", borderRadius: 10, marginBottom: 14, fontSize: 13, color: C.green, fontFamily: FONT }}><span>{t("awaiting.allReady")}</span><Btn onClick={() => setPhase("diagnose")} color={C.green} style={{ padding: "7px 16px", fontSize: 13 }}>{t("awaiting.toDiagnose")}</Btn></div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignItems: "start" }}>{orderedDiag.map(id => { const text = revealedResults[id]; if (!text) return <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "rgba(13,26,46,0.6)", border: "1px solid rgba(0,230,200,0.06)", borderRadius: 12, opacity: 0.6 }}><div style={{ width: 9, height: 9, border: `2px solid ${C.textDim}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} /><span style={{ fontSize: 13, color: C.textDim, fontFamily: FONT }}>{DIAGNOSTICS.find(d => d.id === id)?.name || id}...</span></div>; return <ResultCard key={id} id={id} text={text} isNew={newResultIds.includes(id)} cd={cd} />; })}</div>
    </div>
    <div data-tutorial="treatment_panel" style={{ width: 260, flexShrink: 0, borderLeft: "1px solid rgba(0,230,200,0.06)", overflowY: "auto", padding: "14px 12px", background: C.dimBg }}>
      <TreatPanel {...sharedTreatProps} />
    </div>
  </>);
}

function DesktopDiagnose({ orderedDiag, revealedResults, diagText, setDiagText, selTreat, pendingFx, handleSubmit, sharedTreatProps, C, t, cd, selectedRoute, setSelectedRoute, setExtraResult }) {
  const isAdmission = cd?.department === "admission";
  const canSubmit = isAdmission ? selTreat.length > 0 && selectedRoute !== null : selTreat.length > 0;
  const doSubmit = () => {
    if (isAdmission && setExtraResult) setExtraResult({ selectedRoute, routeOptions: cd.routeOptions, correctRoute: cd.correctRoute });
    handleSubmit(false);
  };
  return (<>
    <div style={{ flex: "0 0 50%", overflowY: "auto", padding: "14px 16px", borderRight: "1px solid rgba(0,230,200,0.06)" }}>
      <STitle icon="📋" label={t("results.title", { n: orderedDiag.length })} color={C.accent} />
      {orderedDiag.map(id => <ResultCard key={id} id={id} text={revealedResults[id] || ""} cd={cd} />)}
    </div>
    <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", minWidth: 0 }}>
      <div data-tutorial="diagnosis_input" style={{ background: C.panelBg, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(157,111,245,0.2)", borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
        <STitle icon="🩺" label={t("diagnose.title")} color={C.purple} />
        <textarea value={diagText} onChange={e => setDiagText(e.target.value)} placeholder={t("diagnose.placeholder")} style={{ width: "100%", minHeight: 100, background: C.headerBg2, border: `1px solid ${diagText ? "rgba(157,111,245,0.4)" : "rgba(0,230,200,0.1)"}`, borderRadius: 10, padding: "12px 14px", color: C.white, fontSize: 13, fontFamily: FONT, resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.8 }} />
      </div>
      <div style={{ background: C.panelBg, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(0,230,200,0.08)", borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
        <STitle icon="💊" label={t("component.prescriptions")} color={C.green} />
        <TreatPanel {...sharedTreatProps} showHeader={false} />
      </div>
      {isAdmission && (
        <div style={{ background: C.panelBg, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: `1px solid ${selectedRoute ? "rgba(0,229,160,0.3)" : "rgba(245,200,66,0.2)"}`, borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
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
      <div style={{ background: C.panelBg, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(0,230,200,0.08)", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: 13, color: C.textDim, fontFamily: FONT }}>
          {selTreat.length > 0 ? <span style={{ color: C.green }}>{t("diagnose.prescribed", { n: selTreat.length })}</span> : <span style={{ color: C.yellow }}>{t("diagnose.treatTab")}</span>}
          {pendingFx.size > 0 && <span style={{ color: C.yellow, marginLeft: 8 }}>{t("diagnose.active", { n: pendingFx.size })}</span>}
        </span>
        <Btn onClick={doSubmit} disabled={!canSubmit} color={C.green} style={{ padding: "11px 28px", fontSize: 14, flexShrink: 0 }}>{t("diagnose.complete")}</Btn>
      </div>
    </div>
  </>);
}
