import { useState, useEffect, useCallback, useMemo } from "react";
import { FONT } from "../../ui/theme";
import { HeaderBackBtn } from "../../ui/components";
import { IconMicroscope, IconClipboard, IconFileText, IconBook, IconStethoscope, IconPill } from "../../ui/icons";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import useIsMobile from "../../hooks/useIsMobile";
import { getTopicsForCase } from "../../data/topics";
import { PatientCard, HistoryPanel, StepBar, TestSelection, ResultsPanel, DiagnosisForm, RouteSelection, OutpatientTreatPanel } from "./OutpatientPanels";
import { LearningTipToast, TheoryModal } from "../../components/game";
import { getExplanationForCase } from "../../hooks/useReviewRegistry";

export default function OutpatientGameScreen({
  cd, selDiag, setSelDiag, orderedDiag, revealedResults, processingTests,
  handleOrderTests: handleOrderTestsRaw, setPhase, handleSubmit, setDiagText,
  setExtraResult, setRevealedAnamnesis, setSelectedRoute: setSelectedRouteProp, learningMode,
  selTreat = [], setSelTreat, toggleTreatment,
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const isMobile = useIsMobile();
  const [localPhase, setLocalPhase] = useState("order_tests");
  const [maxReachedStep, setMaxReachedStep] = useState(0);
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
    if (setRevealedAnamnesis) setRevealedAnamnesis((prev) => new Set([...(prev || []), type]));
  };

  const handleSelectRoute = (routeId) => {
    setSelectedRoute(routeId);
    if (setSelectedRouteProp) setSelectedRouteProp(routeId);
  };

  useEffect(() => {
    if (setDiagText) setDiagText(JSON.stringify({ main: diagMain.trim(), complication: diagComplication.trim(), comorbidity: diagComorbidity.trim() }));
  }, [diagMain, diagComplication, diagComorbidity, setDiagText]);

  const handleOrderTests = useCallback(() => {
    handleOrderTestsRaw();
    setLocalPhase("results");
  }, [handleOrderTestsRaw]);

  useEffect(() => {
    if (localPhase === "order_tests") setPhase("order_tests");
    else if (localPhase === "results") setPhase("awaiting_results");
    else if (localPhase === "diagnose" || localPhase === "treat") setPhase("diagnose");
  }, [localPhase, setPhase]);

  useEffect(() => {
    if (!learningMode || !cd || localPhase !== "diagnose") return;
    const explanation = getExplanationForCase(cd.id, "diagnosisMatchesKR") || (cd.sourceReference ? `${cd.sourceReference.name} (${cd.sourceReference.year})` : "");
    setLearningTip(explanation);
    const timer = setTimeout(() => setLearningTip(null), 4000);
    return () => clearTimeout(timer);
  }, [localPhase, learningMode, cd]);

  const canSubmit = diagMain.trim().length > 0 && selectedRoute !== null;
  const isTreatRoute = selectedRoute === "treat_outpatient";

  const steps = useMemo(() => [
    { key: "order_tests", label: t("phases.order_tests"), icon: <IconMicroscope size={14} color="currentColor" /> },
    { key: "results", label: t("phases.awaiting_results"), icon: <IconClipboard size={14} color="currentColor" /> },
    { key: "diagnose", label: t("outpatient.phases.diagnose"), icon: <IconFileText size={14} color="currentColor" /> },
    { key: "treat", label: t("outpatient.phases.treat") || "Рецепт", icon: <IconPill size={14} color="currentColor" /> },
  ], [t]);

  const activeStep = steps.findIndex((s) => s.key === localPhase);

  useEffect(() => {
    if (activeStep > maxReachedStep) setMaxReachedStep(activeStep);
  }, [activeStep, maxReachedStep]);

  const canClickStep = useCallback((i) => {
    if (i === 0) return true;
    if (i === 1) return (orderedDiag && orderedDiag.length > 0) || maxReachedStep >= 1;
    if (i === 2) return (orderedDiag && orderedDiag.length > 0) || maxReachedStep >= 2;
    if (i === 3) return isTreatRoute && maxReachedStep >= 2;
    return false;
  }, [orderedDiag, maxReachedStep, isTreatRoute]);

  const doSubmit = () => {
    const formatted = JSON.stringify({ main: diagMain.trim(), complication: diagComplication.trim(), comorbidity: diagComorbidity.trim() });
    if (setDiagText) setDiagText(formatted);
    const extra = { selectedRoute, routeOptions: cd.routeOptions, correctRoute: cd.correctRoute };
    if (setExtraResult) setExtraResult(extra);
    handleSubmit(false, false, { diagText: formatted, selectedRoute, extraResult: extra });
  };

  const renderPhase = () => {
    if (localPhase === "order_tests") return (<>
      <TestSelection cd={cd} selDiag={selDiag} setSelDiag={setSelDiag} handleOrderTests={handleOrderTests} />
      {orderedDiag?.length > 0 && (
        <button type="button" onClick={() => setLocalPhase("results")}
          style={{ width: "100%", padding: 11, borderRadius: 10, background: `${C.accent}18`, border: `1px solid ${C.accent}44`, color: C.accent, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: FONT, marginBottom: 12 }}>
          {t("phases.awaiting_results") || "К результатам исследований"} →
        </button>
      )}
    </>);
    if (localPhase === "results") return <ResultsPanel cd={cd} orderedDiag={orderedDiag} revealedResults={revealedResults} processingTests={processingTests} handleNextFromResults={() => setLocalPhase("diagnose")} />;
    if (localPhase === "treat") return <OutpatientTreatPanel cd={cd} selTreat={selTreat} setSelTreat={setSelTreat} toggleTreatment={toggleTreatment} onSubmit={doSubmit} onBack={() => setLocalPhase("diagnose")} />;
    return (<>
      <DiagnosisForm diagMain={diagMain} setDiagMain={setDiagMain} diagComplication={diagComplication} setDiagComplication={setDiagComplication} diagComorbidity={diagComorbidity} setDiagComorbidity={setDiagComorbidity} />
      <RouteSelection routeOptions={cd.routeOptions} selectedRoute={selectedRoute} setSelectedRoute={handleSelectRoute} />
      <button type="button" onClick={isTreatRoute ? () => setLocalPhase("treat") : doSubmit} disabled={!canSubmit}
        style={{ width: "100%", padding: 14, borderRadius: 12, background: canSubmit ? `linear-gradient(135deg,${C.accent},${C.green})` : `${C.textDim}30`, border: "none", fontSize: 15, fontWeight: 700, color: canSubmit ? C.bg : C.textDim, cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: FONT, marginBottom: 12 }}>
        {isTreatRoute ? (t("outpatient.toTreat") || "К назначению терапии →") : (t("outpatient.submitRefer") || "Завершить приём и направить пациента")}
      </button>
    </>);
  };

  const headerRight = (<>
    {learningMode && (
      <span style={{ fontSize: 9, color: C.yellow, background: `${C.yellow}15`, padding: "2px 6px", borderRadius: 4, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 3 }}>
        <IconBook size={10} color="currentColor" /> {t("game.learning")}
      </span>
    )}
    <div onClick={() => setShowTheory((v) => !v)} style={{ cursor: "pointer", color: C.accent, padding: "2px 6px", display: "flex", alignItems: "center" }}>
      <IconBook size={16} color="currentColor" />
    </div>
  </>);

  const sidePanels = (<><PatientCard cd={cd} examinedVitals={examinedVitals} setExaminedVitals={setExaminedVitals} /><HistoryPanel cd={cd} onReveal={handleRevealAnamnesis} /></>);
  const mainContent = (<><StepBar steps={steps} activeStep={activeStep} onStepClick={setLocalPhase} canClickStep={canClickStep} />{renderPhase()}</>);

  return (
    <div style={{ height: "100vh", background: C.bgGrad, fontFamily: FONT, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <header style={{ flexShrink: 0, padding: isMobile ? "0 14px" : "0 20px", height: isMobile ? 52 : 54, display: "flex", alignItems: "center", gap: isMobile ? 10 : 12, background: C.headerBg, borderBottom: `1px solid ${C.border}` }}>
        <HeaderBackBtn onClick={() => setPhase("menu")} label={t("theory.back")} isMobile={isMobile} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: C.white, fontFamily: FONT }}>
            {cd.name} {!isMobile && `· ${cd.age} ${t("cases.ageSuffix")} · ${cd.gender}`}
          </div>
          <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, display: "flex", alignItems: "center", gap: 4 }}>
            <IconStethoscope size={11} color="currentColor" /> {t("department.outpatient")} · {t("outpatient.appointment")}
          </div>
        </div>
        {!isMobile && (
          <span style={{ background: `${C.accent}20`, border: `1px solid ${C.accent}44`, borderRadius: 5, padding: "2px 8px", fontSize: 10, color: C.accent, fontWeight: 700, fontFamily: FONT }}>
            {t("outpatient.appointment")}
          </span>
        )}
        {headerRight}
      </header>
      {learningMode && learningTip && <LearningTipToast tip={learningTip} isMobile={isMobile} />}
      <TheoryModal relatedTopics={relatedTopics} showTheory={showTheory} setShowTheory={setShowTheory} activeTheoryTopic={activeTheoryTopic} setActiveTheoryTopic={setActiveTheoryTopic} isMobile={isMobile} />
      {isMobile ? (
        <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>{sidePanels}{mainContent}</div>
      ) : (
        <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px", minWidth: 0 }}>{mainContent}</div>
          <div style={{ width: 260, flexShrink: 0, borderLeft: `1px solid ${C.border}`, overflowY: "auto", padding: "14px 12px", background: C.sidebarBg || C.bgGrad }}>{sidePanels}</div>
        </div>
      )}
    </div>
  );
}
