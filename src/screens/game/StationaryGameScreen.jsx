import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import useIsMobile from "../../hooks/useIsMobile";
import useStationaryCycle from "../../hooks/useStationaryCycle";
import { getTopicsForCase } from "../../data/topics";
import { PatientCard, StepBar, MorningPanel, TestSelection, ResultsPanel, TreatPanel } from "./StationaryPanels";
import StationaryHistoryPanel from "./StationaryHistoryPanel";
import { LearningTipToast, TheoryModal } from "../../components/game";
import { getExplanationForCase } from "../../hooks/useReviewRegistry";

const DAY_COLORS = ["#e8e8e8", "#4fc3f7", "#81c784", "#ffcc02", "#ffb74d", "#ef5350", "#ce93d8", "#4dd0e1"];

/**
 * Stationary department game screen.
 * FR-Е.1 (decision): Diagnosis is NOT entered by the player in stationary cases.
 * Rationale: the patient is admitted with an established diagnosis from emergency/outpatient.
 * The stationary game focuses on daily management (treatment, monitoring, escalation),
 * not diagnostic workup. The `diagnosisVariants` field exists in case data for assessment
 * scoring but is not exposed as an interactive step in this screen.
 */
export default function StationaryGameScreen({ cd, ps, selDiag, setSelDiag, orderedDiag, revealedResults, processingTests, handleOrderTests: handleOrderTestsRaw, selTreat, toggleTreatment, setPhase, setExtraResult, setRevealedAnamnesis, learningMode, appliedFx, pendingFx, treatCat, setTreatCat }) {
  const C = useTheme();
  const { t } = useTranslate();
  const isMobile = useIsMobile();
  const [localPhase, setLocalPhase] = useState("morning");
  const [learningTip, setLearningTip] = useState(null);
  const [showTheory, setShowTheory] = useState(false);
  const [activeTheoryTopic, setActiveTheoryTopic] = useState(null);
  const relatedTopics = getTopicsForCase(cd.id);
  const [shownAnamnesisDay, setShownAnamnesisDay] = useState(-1);

  const cycle = useStationaryCycle(cd);

  const anamnesisItems = [];
  if (cd.historyOfIllness) anamnesisItems.push({ title: t("history.illness"), text: cd.historyOfIllness });
  if (cd.lifeHistory) anamnesisItems.push({ title: t("history.life"), text: cd.lifeHistory });
  if (cd.anamnesis && !cd.historyOfIllness) anamnesisItems.push({ title: t("history.short"), text: cd.anamnesis });
  const showAnamnesisOverlay = localPhase === "morning" && cycle.currentDay !== shownAnamnesisDay && anamnesisItems.length > 0;

  const handleOrderTests = useCallback(() => {
    handleOrderTestsRaw();
    setLocalPhase("results");
  }, [handleOrderTestsRaw]);

  useEffect(() => {
    if (localPhase === "morning") setPhase("morning");
    else if (localPhase === "order_tests") setPhase("order_tests");
    else if (localPhase === "results") setPhase("awaiting_results");
    else if (localPhase === "treat") setPhase("treat");
  }, [localPhase, setPhase]);

  useEffect(() => { cycle.setDayVitals(ps); }, []);

  const handleRevealAnamnesis = (type) => {
    setRevealedAnamnesis(prev => new Set([...prev, type]));
  };

  const currentPs = cycle.dayVitals || ps;

  useEffect(() => {
    if (!learningMode || !cd) return;
    if (localPhase === "treat") {
      const explanation = getExplanationForCase(cd.id, "needTreatMatchesKR") || (cd.sourceReference ? `${cd.sourceReference.name} (${cd.sourceReference.year})` : "");
      setLearningTip(explanation);
      const timer = setTimeout(() => setLearningTip(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [localPhase, learningMode, cd]);

  const handleEndDay = () => {
    if (selTreat.length === 0) return;
    const res = cycle.endDay(currentPs);
    if (res.gameOver) {
      setExtraResult && setExtraResult({ dayHistory: cycle.dayHistory, cycleOutcome: res.outcome, dischargeCriteria: cd.dischargeCriteria, maxDays: cd.maxDays });
      setPhase("result");
    } else {
      setLocalPhase("morning");
    }
  };

  const steps = [
    { key: "morning", label: t("stationary.morning"), icon: "🌅" },
    { key: "order_tests", label: t("phases.order_tests"), icon: "🔬" },
    { key: "results", label: t("phases.awaiting_results"), icon: "📋" },
    { key: "treat", label: t("stationary.treat"), icon: "💊" },
  ];
  const activeStep = steps.findIndex(s => s.key === localPhase);

  const panelProps = { cd, cycle, selDiag, setSelDiag, selTreat, toggleTreatment, handleOrderTests, handleEndDay, orderedDiag, revealedResults, processingTests, setLocalPhase, canProceedFromTreat: selTreat.length > 0, appliedFx, pendingFx, treatCat, setTreatCat };

  const phaseContent = (
    <>
      {localPhase === "morning" && <MorningPanel morningInfo={cycle.morningInfo} cycle={cycle} setLocalPhase={setLocalPhase} currentPs={currentPs} />}
      {localPhase === "order_tests" && <TestSelection {...panelProps} />}
      {localPhase === "results" && <ResultsPanel {...panelProps} />}
      {localPhase === "treat" && <TreatPanel {...panelProps} />}
    </>
  );

  const anamnesisOverlay = showAnamnesisOverlay && createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 99998, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShownAnamnesisDay(cycle.currentDay)}>
      <div style={{ background: C.overlayBg, backdropFilter: "blur(24px)", border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 24px", maxWidth: 500, width: "100%", maxHeight: "80vh", overflowY: "auto", fontFamily: FONT }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{t("history.title")}</span>
          <span onClick={() => setShownAnamnesisDay(cycle.currentDay)} style={{ fontSize: 12, color: C.textDim, cursor: "pointer", padding: "3px 10px", borderRadius: 6, background: C.dimBg }}>✕</span>
        </div>
        {anamnesisItems.map((item, i) => (
          <div key={i} style={{ marginBottom: i < anamnesisItems.length - 1 ? 12 : 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, marginBottom: 4 }}>{item.title}</div>
            <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, margin: 0, padding: "8px 10px", background: `${C.textDim}08`, borderRadius: 8, borderLeft: `3px solid ${C.green}` }}>{item.text}</p>
          </div>
        ))}
        <button onClick={() => setShownAnamnesisDay(cycle.currentDay)}
          style={{ width: "100%", marginTop: 14, padding: "10px", borderRadius: 10, background: `linear-gradient(135deg,${C.accent},${C.green})`, border: "none", fontSize: 14, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT }}>
          {t("stationary.startDay")}
        </button>
      </div>
    </div>,
    document.body
  );

  if (isMobile) return (
    <div style={{ height: "100vh", background: C.bgGrad, fontFamily: FONT, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>{anamnesisOverlay}
      <header style={{ flexShrink: 0, padding: "0 14px", height: 48, display: "flex", alignItems: "center", gap: 10, background: C.headerBg, borderBottom: `1px solid ${C.border}` }}>
        <div onClick={() => setPhase("menu")} style={{ fontSize: 18, color: C.accent, cursor: "pointer", padding: "4px 8px" }}>←</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: FONT }}>{cd.name}</div>
          <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT }}>🏨 {t("department.stationary")} · {t("stationary.dayN", { n: cycle.currentDay + 1, max: cycle.maxDays })}</div>
        </div>
        {learningMode && <span style={{ fontSize: 9, color: C.yellow, background: `${C.yellow}15`, padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>📚 {t("game.learning")}</span>}
        <div onClick={() => setShowTheory(v => !v)} style={{ fontSize: 16, cursor: "pointer", color: C.accent, padding: "2px 6px" }}>📚</div>
      </header>
      {learningMode && learningTip && <LearningTipToast tip={learningTip} isMobile />}
      <TheoryModal relatedTopics={relatedTopics} showTheory={showTheory} setShowTheory={setShowTheory} activeTheoryTopic={activeTheoryTopic} setActiveTheoryTopic={setActiveTheoryTopic} isMobile />
      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        <PatientCard cd={cd} currentPs={currentPs} cycle={cycle} />
        <StationaryHistoryPanel cd={cd} onReveal={handleRevealAnamnesis} />
        <StepBar steps={steps} activeStep={activeStep} currentDay={cycle.currentDay} />
        {phaseContent}
      </div>
    </div>
  );

  return (
    <div style={{ height: "100vh", background: C.bgGrad, fontFamily: FONT, display: "flex", overflow: "hidden" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>{anamnesisOverlay}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ flexShrink: 0, padding: "0 20px", height: 52, display: "flex", alignItems: "center", gap: 12, background: C.headerBg, borderBottom: `1px solid ${C.border}` }}>
          <div onClick={() => setPhase("menu")} style={{ fontSize: 18, color: C.accent, cursor: "pointer", padding: "4px 8px" }}>←</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: FONT }}>{cd.name} · {cd.age} {t("cases.ageSuffix")} · {cd.gender}</div>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT }}>🏨 {t("department.stationary")} · {t("stationary.dayN", { n: cycle.currentDay + 1, max: cycle.maxDays })}</div>
          </div>
          <span style={{ background: `${DAY_COLORS[cycle.currentDay % 7]}20`, border: `1px solid ${DAY_COLORS[cycle.currentDay % 7]}44`, borderRadius: 5, padding: "2px 8px", fontSize: 10, color: DAY_COLORS[cycle.currentDay % 7], fontWeight: 700, fontFamily: FONT }}>
            {t("stationary.dayN", { n: cycle.currentDay + 1, max: cycle.maxDays })}
          </span>
          {learningMode && <span style={{ fontSize: 9, color: C.yellow, background: `${C.yellow}15`, padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>📚 {t("game.learning")}</span>}
          <div onClick={() => setShowTheory(v => !v)} style={{ fontSize: 16, cursor: "pointer", color: C.accent, padding: "2px 6px" }}>📚</div>
        </header>
        {learningMode && learningTip && <LearningTipToast tip={learningTip} isMobile={false} />}
        <TheoryModal relatedTopics={relatedTopics} showTheory={showTheory} setShowTheory={setShowTheory} activeTheoryTopic={activeTheoryTopic} setActiveTheoryTopic={setActiveTheoryTopic} isMobile={false} />
        <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px", minWidth: 0 }}>
            <StepBar steps={steps} activeStep={activeStep} currentDay={cycle.currentDay} />
            {phaseContent}
          </div>
          <div style={{ width: 260, flexShrink: 0, borderLeft: `1px solid ${C.border}`, overflowY: "auto", padding: "14px 12px", background: C.sidebarBg || C.bgGrad }}>
            <PatientCard cd={cd} currentPs={currentPs} cycle={cycle} />
        <StationaryHistoryPanel cd={cd} onReveal={handleRevealAnamnesis} />
          </div>
        </div>
      </div>
    </div>
  );
}
