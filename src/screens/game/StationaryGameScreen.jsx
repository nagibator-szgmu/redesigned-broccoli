import { useState, useEffect, useCallback } from "react";
import { FONT } from "../../ui/theme";
import { HeaderBackBtn } from "../../ui/components";
import { IconClock, IconMicroscope, IconClipboard, IconPill, IconBook, IconBed } from "../../ui/icons";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import useIsMobile from "../../hooks/useIsMobile";
import useStationaryCycle from "../../hooks/useStationaryCycle";
import { getTopicsForCase } from "../../data/topics";
import { PatientCard, StepBar, MorningPanel, TestSelection, ResultsPanel, TreatPanel } from "./StationaryPanels";
import StationaryHistoryPanel from "./StationaryHistoryPanel";
import AnamnesisOverlay from "./stationary/AnamnesisOverlay";
import { LearningTipToast, TheoryModal } from "../../components/game";
import { getExplanationForCase } from "../../hooks/useReviewRegistry";

const DAY_COLORS = ["#e8e8e8", "#4fc3f7", "#81c784", "#ffcc02", "#ffb74d", "#ef5350", "#ce93d8", "#4dd0e1"];

/** Stationary department game screen: daily management, monitoring and treatment. */
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
    { key: "morning", label: t("stationary.morning"), icon: <IconClock size={14} color="currentColor" /> },
    { key: "order_tests", label: t("phases.order_tests"), icon: <IconMicroscope size={14} color="currentColor" /> },
    { key: "results", label: t("phases.awaiting_results"), icon: <IconClipboard size={14} color="currentColor" /> },
    { key: "treat", label: t("stationary.treat"), icon: <IconPill size={14} color="currentColor" /> },
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

  const anamnesisOverlay = (
    <AnamnesisOverlay
      show={showAnamnesisOverlay}
      onClose={() => setShownAnamnesisDay(cycle.currentDay)}
      anamnesisItems={anamnesisItems}
      C={C}
      t={t}
    />
  );

  if (isMobile) return (
    <div style={{ height: "100vh", background: C.bgGrad, fontFamily: FONT, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>{anamnesisOverlay}
      <header style={{ flexShrink: 0, padding: "0 14px", minHeight: 52, display: "flex", alignItems: "center", gap: 10, background: C.headerBg, borderBottom: `1px solid ${C.border}` }}>
        <HeaderBackBtn onClick={() => setPhase("menu")} label={t("theory.back")} isMobile={true} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: FONT }}>{cd.name}</div>
          <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, display: "flex", alignItems: "center", gap: 4 }}>
            <IconBed size={11} color="currentColor" /> {t("department.stationary")} · {t("stationary.dayN", { n: cycle.currentDay + 1, max: cycle.maxDays })}
          </div>
        </div>
        {learningMode && (
          <span style={{ fontSize: 9, color: C.yellow, background: `${C.yellow}15`, padding: "2px 6px", borderRadius: 4, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 3 }}>
            <IconBook size={10} color="currentColor" /> {t("game.learning")}
          </span>
        )}
        <div onClick={() => setShowTheory(v => !v)} style={{ cursor: "pointer", color: C.accent, padding: "2px 6px", display: "flex", alignItems: "center" }}>
          <IconBook size={16} color="currentColor" />
        </div>
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
        <header style={{ flexShrink: 0, padding: "0 20px", height: 54, display: "flex", alignItems: "center", gap: 12, background: C.headerBg, borderBottom: `1px solid ${C.border}` }}>
          <HeaderBackBtn onClick={() => setPhase("menu")} label={t("theory.back")} isMobile={false} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: FONT }}>{cd.name} · {cd.age} {t("cases.ageSuffix")} · {cd.gender}</div>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, display: "flex", alignItems: "center", gap: 4 }}>
              <IconBed size={11} color="currentColor" /> {t("department.stationary")} · {t("stationary.dayN", { n: cycle.currentDay + 1, max: cycle.maxDays })}
            </div>
          </div>
          <span style={{ background: `${DAY_COLORS[cycle.currentDay % 7]}20`, border: `1px solid ${DAY_COLORS[cycle.currentDay % 7]}44`, borderRadius: 5, padding: "2px 8px", fontSize: 10, color: DAY_COLORS[cycle.currentDay % 7], fontWeight: 700, fontFamily: FONT }}>
            {t("stationary.dayN", { n: cycle.currentDay + 1, max: cycle.maxDays })}
          </span>
          {learningMode && (
            <span style={{ fontSize: 9, color: C.yellow, background: `${C.yellow}15`, padding: "2px 6px", borderRadius: 4, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 3 }}>
              <IconBook size={10} color="currentColor" /> {t("game.learning")}
            </span>
          )}
          <div onClick={() => setShowTheory(v => !v)} style={{ cursor: "pointer", color: C.accent, padding: "2px 6px", display: "flex", alignItems: "center" }}>
            <IconBook size={16} color="currentColor" />
          </div>
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
