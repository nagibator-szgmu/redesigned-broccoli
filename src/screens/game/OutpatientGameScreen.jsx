import { useState, useEffect, useCallback } from "react";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import useIsMobile from "../../hooks/useIsMobile";
import { getTopicsForCase } from "../../data/topics";
import { PatientCard, HistoryPanel, StepBar, TestSelection, ResultsPanel, DiagnosisForm, RouteSelection } from "./OutpatientPanels";
import { LearningTipToast, TheoryModal } from "../../components/game";
import { getExplanationForCase } from "../../hooks/useReviewRegistry";

export default function OutpatientGameScreen({ cd, selDiag, setSelDiag, orderedDiag, revealedResults, processingTests, handleOrderTests: handleOrderTestsRaw, setPhase, handleSubmit, setDiagText, setExtraResult, setRevealedAnamnesis, learningMode }) {
  const C = useTheme();
  const { t } = useTranslate();
  const isMobile = useIsMobile();
  const [localPhase, setLocalPhase] = useState("order_tests");
  const [diagMain, setDiagMain] = useState("");
  const [diagComplication, setDiagComplication] = useState("");
  const [diagComorbidity, setDiagComorbidity] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [learningTip, setLearningTip] = useState(null);
  const [showTheory, setShowTheory] = useState(false);
  const [activeTheoryTopic, setActiveTheoryTopic] = useState(null);
  const [examinedVitals, setExaminedVitals] = useState([]);
  const relatedTopics = getTopicsForCase(cd.id);

  const handleRevealAnamnesis = (type) => {
    setRevealedAnamnesis(prev => new Set([...prev, type]));
  };

  const handleOrderTests = useCallback(() => {
    handleOrderTestsRaw();
    setLocalPhase("results");
  }, [handleOrderTestsRaw]);

  useEffect(() => {
    if (localPhase === "order_tests") setPhase("order_tests");
    else if (localPhase === "results") setPhase("awaiting_results");
    else if (localPhase === "diagnose") setPhase("diagnose");
  }, [localPhase, setPhase]);

  useEffect(() => {
    if (!learningMode || !cd) return;
    if (localPhase === "diagnose") {
      const explanation = getExplanationForCase(cd.id, "diagnosisMatchesKR") || (cd.sourceReference ? `${cd.sourceReference.name} (${cd.sourceReference.year})` : "");
      setLearningTip(explanation);
      const timer = setTimeout(() => setLearningTip(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [localPhase, learningMode, cd]);

  const canSubmit = diagMain.trim().length > 0 && selectedRoute !== null;

  const doSubmit = () => {
    setDiagText(JSON.stringify({ main: diagMain.trim(), complication: diagComplication.trim(), comorbidity: diagComorbidity.trim() }));
    setExtraResult && setExtraResult({ selectedRoute, routeOptions: cd.routeOptions, correctRoute: cd.correctRoute });
    handleSubmit();
  };

  const steps = [
    { key: "order_tests", label: t("phases.order_tests"), icon: "🔬" },
    { key: "results", label: t("phases.awaiting_results"), icon: "📋" },
    { key: "diagnose", label: t("outpatient.phases.diagnose"), icon: "📝" },
  ];
  const activeStep = steps.findIndex(s => s.key === localPhase);

  const renderPhase = () => {
    if (localPhase === "order_tests") return <TestSelection cd={cd} selDiag={selDiag} setSelDiag={setSelDiag} handleOrderTests={handleOrderTests} />;
    if (localPhase === "results") return <ResultsPanel orderedDiag={orderedDiag} revealedResults={revealedResults} processingTests={processingTests} handleNextFromResults={() => setLocalPhase("diagnose")} />;
    return (<>
      <DiagnosisForm diagMain={diagMain} setDiagMain={setDiagMain} diagComplication={diagComplication} setDiagComplication={setDiagComplication} diagComorbidity={diagComorbidity} setDiagComorbidity={setDiagComorbidity} />
      <button onClick={doSubmit} disabled={!canSubmit}
        style={{ width: "100%", padding: "14px", borderRadius: 12, background: canSubmit ? `linear-gradient(135deg,${C.accent},${C.green})` : `${C.textDim}30`, border: "none", fontSize: 15, fontWeight: 700, color: canSubmit ? C.bg : C.textDim, cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: FONT, marginBottom: 12 }}>
        {t("outpatient.submit")}
      </button>
    </>);
  };

  if (isMobile) return (
    <div style={{ height: "100vh", background: C.bgGrad, fontFamily: FONT, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <header style={{ flexShrink: 0, padding: "0 14px", height: 48, display: "flex", alignItems: "center", gap: 10, background: C.headerBg, borderBottom: `1px solid ${C.border}` }}>
        <div onClick={() => setPhase("menu")} style={{ fontSize: 18, color: C.accent, cursor: "pointer", padding: "4px 8px" }}>←</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: FONT }}>{cd.name}</div>
          <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT }}>🏥 {t("department.outpatient")} · {t("outpatient.appointment")}</div>
        </div>
        {learningMode && <span style={{ fontSize: 9, color: C.yellow, background: `${C.yellow}15`, padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>📚 {t("game.learning")}</span>}
        <div onClick={() => setShowTheory(v => !v)} style={{ fontSize: 16, cursor: "pointer", color: C.accent, padding: "2px 6px" }}>📚</div>
      </header>
      {learningMode && learningTip && <LearningTipToast tip={learningTip} isMobile />}
      <TheoryModal relatedTopics={relatedTopics} showTheory={showTheory} setShowTheory={setShowTheory} activeTheoryTopic={activeTheoryTopic} setActiveTheoryTopic={setActiveTheoryTopic} isMobile={isMobile} />
      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        <PatientCard cd={cd} examinedVitals={examinedVitals} setExaminedVitals={setExaminedVitals} />
        <StepBar steps={steps} activeStep={activeStep} />
        {renderPhase()}
        <RouteSelection routeOptions={cd.routeOptions} selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} />
      </div>
    </div>
  );

  return (
    <div style={{ height: "100vh", background: C.bgGrad, fontFamily: FONT, display: "flex", overflow: "hidden" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ flexShrink: 0, padding: "0 20px", height: 52, display: "flex", alignItems: "center", gap: 12, background: C.headerBg, borderBottom: `1px solid ${C.border}` }}>
          <div onClick={() => setPhase("menu")} style={{ fontSize: 18, color: C.accent, cursor: "pointer", padding: "4px 8px" }}>←</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: FONT }}>{cd.name} · {cd.age} {t("cases.ageSuffix")} · {cd.gender}</div>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT }}>🏥 {t("department.outpatient")} · {t("outpatient.appointment")}</div>
          </div>
          <span style={{ background: `${C.accent}20`, border: `1px solid ${C.accent}44`, borderRadius: 5, padding: "2px 8px", fontSize: 10, color: C.accent, fontWeight: 700, fontFamily: FONT }}>{t("outpatient.appointment")}</span>
          {learningMode && <span style={{ fontSize: 9, color: C.yellow, background: `${C.yellow}15`, padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>📚 {t("game.learning")}</span>}
          <div onClick={() => setShowTheory(v => !v)} style={{ fontSize: 16, cursor: "pointer", color: C.accent, padding: "2px 6px" }}>📚</div>
        </header>
        {learningMode && learningTip && <LearningTipToast tip={learningTip} isMobile={false} />}
        <TheoryModal relatedTopics={relatedTopics} showTheory={showTheory} setShowTheory={setShowTheory} activeTheoryTopic={activeTheoryTopic} setActiveTheoryTopic={setActiveTheoryTopic} isMobile={false} />
        <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px", minWidth: 0 }}>
            <StepBar steps={steps} activeStep={activeStep} />
            {renderPhase()}
            <RouteSelection routeOptions={cd.routeOptions} selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} />
          </div>
          <div style={{ width: 260, flexShrink: 0, borderLeft: `1px solid ${C.border}`, overflowY: "auto", padding: "14px 12px", background: C.sidebarBg || C.bgGrad }}>
            <PatientCard cd={cd} examinedVitals={examinedVitals} setExaminedVitals={setExaminedVitals} />
            <HistoryPanel cd={cd} onReveal={handleRevealAnamnesis} />
          </div>
        </div>
      </div>
    </div>
  );
}
