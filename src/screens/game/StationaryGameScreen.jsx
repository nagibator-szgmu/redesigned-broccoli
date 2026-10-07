import { useState, useEffect, useCallback } from "react";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import useIsMobile from "../../hooks/useIsMobile";
import useStationaryCycle from "../../hooks/useStationaryCycle";
import { getTopicsForCase } from "../../data/topics";
import { PatientCard, MorningPanel, TestSelection, ResultsPanel, TreatPanel, StationaryActionTabs } from "./StationaryPanels";
import { StationaryHeader } from "./stationary";
import StationaryHistoryPanel from "./StationaryHistoryPanel";
import AnamnesisOverlay from "./stationary/AnamnesisOverlay";
import UnifiedMobileActionBar from "../../components/game/workstation/UnifiedMobileActionBar";
import QuickActionDrawer from "../../components/game/workstation/QuickActionDrawer";
import { LearningTipToast, TheoryModal } from "../../components/game";
import { getExplanationForCase } from "../../hooks/useReviewRegistry";

/** Stationary department game screen: daily management, monitoring and treatment. */
export default function StationaryGameScreen({ cd, ps, selDiag, setSelDiag, orderedDiag, revealedResults, processingTests, handleOrderTests: handleOrderTestsRaw, selTreat, setSelTreat, toggleTreatment, setPhase, setExtraResult, setRevealedAnamnesis, learningMode, appliedFx, pendingFx, treatCat, setTreatCat }) {
  const C = useTheme();
  const { t } = useTranslate();
  const isMobile = useIsMobile();
  const [localPhase, setLocalPhase] = useState("morning");
  const [openTab, setOpenTab] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("diag");
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

  const toggleDrawer = (mode) => {
    if (drawerOpen && drawerMode === mode) setDrawerOpen(false);
    else { setDrawerMode(mode); setDrawerOpen(true); }
  };

  const handleOrderTests = useCallback(() => {
    handleOrderTestsRaw();
    cycle.orderDailyTests?.(selDiag, selTreat);
    setLocalPhase("results");
    setOpenTab("results");
  }, [handleOrderTestsRaw, cycle, selDiag, selTreat]);

  useEffect(() => {
    if (localPhase === "morning") setPhase("morning");
    else if (localPhase === "order_tests") setPhase("order_tests");
    else if (localPhase === "results") setPhase("awaiting_results");
    else if (localPhase === "treat") setPhase("treat");
  }, [localPhase, setPhase]);

  useEffect(() => { cycle.setDayVitals(ps); }, []);

  const handleRevealAnamnesis = (type) => setRevealedAnamnesis(prev => new Set([...prev, type]));
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
    const res = cycle.endDay(currentPs, selTreat);
    if (res.gameOver) {
      const history = res.dayHistory || cycle.dayHistory;
      setExtraResult && setExtraResult({ dayHistory: history, cycleOutcome: res.outcome, dischargeCriteria: cd.dischargeCriteria, maxDays: cd.maxDays });
      setPhase("result");
    } else {
      setSelTreat?.([]);
      setSelDiag?.([]);
      setLocalPhase("morning");
      setOpenTab(null);
      setDrawerOpen(false);
    }
  };

  const panelProps = { cd, cycle, selDiag, setSelDiag, selTreat, setSelTreat, toggleTreatment, handleOrderTests, handleEndDay, orderedDiag, revealedResults, processingTests, setLocalPhase, canProceedFromTreat: selTreat.length > 0, appliedFx, pendingFx, treatCat, setTreatCat };

  const actionTabs = (
    <StationaryActionTabs openTab={openTab} onToggleTab={(id) => { setOpenTab(p => p === id ? null : id); setLocalPhase(id); }} currentDay={cycle.currentDay} selDiagCount={selDiag.length} resultsCount={orderedDiag.length} selTreatCount={selTreat.length}>
      {openTab === "morning" && <MorningPanel cd={cd} morningInfo={cycle.morningInfo} cycle={cycle} setLocalPhase={(p) => { setLocalPhase(p); setOpenTab(p); }} currentPs={currentPs} />}
      {openTab === "order_tests" && <TestSelection {...panelProps} />}
      {openTab === "results" && <ResultsPanel {...panelProps} />}
      {openTab === "treat" && <TreatPanel {...panelProps} />}
    </StationaryActionTabs>
  );

  return (
    <div style={{ height: "100vh", background: C.bgGrad, fontFamily: FONT, display: "flex", flexDirection: isMobile ? "column" : "row", overflow: "hidden" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <AnamnesisOverlay show={showAnamnesisOverlay} onClose={() => setShownAnamnesisDay(cycle.currentDay)} anamnesisItems={anamnesisItems} C={C} t={t} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <StationaryHeader cd={cd} cycle={cycle} setPhase={setPhase} learningMode={learningMode} setShowTheory={setShowTheory} t={t} C={C} isMobile={isMobile} />
        {learningMode && learningTip && <LearningTipToast tip={learningTip} isMobile={isMobile} />}
        <TheoryModal relatedTopics={relatedTopics} showTheory={showTheory} setShowTheory={setShowTheory} activeTheoryTopic={activeTheoryTopic} setActiveTheoryTopic={setActiveTheoryTopic} isMobile={isMobile} />
        {isMobile ? (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
              <PatientCard cd={cd} currentPs={currentPs} cycle={cycle} />
              <MorningPanel cd={cd} morningInfo={cycle.morningInfo} cycle={cycle} setLocalPhase={(p) => { if (p === "order_tests") toggleDrawer("diag"); else if (p === "treat") toggleDrawer("treat"); else setLocalPhase(p); }} currentPs={currentPs} />
              {orderedDiag.length > 0 && <ResultsPanel {...panelProps} />}
              <StationaryHistoryPanel cd={cd} onReveal={handleRevealAnamnesis} />
            </div>
            <UnifiedMobileActionBar onOpenDiag={() => toggleDrawer("diag")} onOpenTreat={() => toggleDrawer("treat")} onOpenDiagnose={() => toggleDrawer("diagnose")} orderedCount={orderedDiag.length} treatCount={selTreat.length} hasDiag={selTreat.length > 0} activeMode={drawerOpen ? drawerMode : null} diagnoseLabel="Итог дня" />
            <QuickActionDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} mode={drawerMode} selDiag={selDiag} setSelDiag={setSelDiag} orderedDiag={orderedDiag} handleOrderTests={() => { handleOrderTests(); setDrawerOpen(false); }} processingTests={processingTests} t={t} cd={cd} selTreat={selTreat} toggleTreatment={toggleTreatment} appliedFx={appliedFx} pendingFx={pendingFx} treatCat={treatCat} setTreatCat={setTreatCat} renderDiagnose={() => (
              <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: FONT, marginBottom: 8 }}>{t("stationary.dayN", { n: cycle.currentDay + 1, max: cycle.maxDays })} · Итоги суток</div>
                <p style={{ fontSize: 12, color: C.text, fontFamily: FONT, lineHeight: 1.5, marginBottom: 12 }}>{cycle.morningInfo?.morningStatus || cd.diagnosis}</p>
                <button onClick={handleEndDay} disabled={selTreat.length === 0} style={{ width: "100%", padding: "10px", borderRadius: 8, background: selTreat.length > 0 ? `linear-gradient(135deg, ${C.purple}, ${C.accent})` : `${C.textDim}30`, border: "none", fontSize: 13, fontWeight: 700, color: C.white, cursor: selTreat.length > 0 ? "pointer" : "not-allowed" }}>
                  {t("stationary.endDay")} ({selTreat.length > 0 ? `назначено: ${selTreat.length}` : "требуется лечение"})
                </button>
              </div>
            )} />
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px", minWidth: 0 }}>{actionTabs}</div>
            <div style={{ width: 260, flexShrink: 0, borderLeft: `1px solid ${C.border}`, overflowY: "auto", padding: "14px 12px", background: C.sidebarBg || C.bgGrad }}>
              <PatientCard cd={cd} currentPs={currentPs} cycle={cycle} />
              <StationaryHistoryPanel cd={cd} onReveal={handleRevealAnamnesis} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
