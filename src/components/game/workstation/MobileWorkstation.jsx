import React, { useState, useEffect } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import { useTranslate } from "../../../locale/useTranslate";
import { IconChevronLeft } from "../../../ui/icons";
import VitalsHUD from "../vitals/VitalsHUD";
import VitalsStatusStrip from "../vitals/VitalsStatusStrip";
import PatientRecordColumn from "./PatientRecordColumn";
import DiagnosisRoutingTab from "./DiagnosisRoutingTab";
import UnifiedMobileActionBar from "./UnifiedMobileActionBar";
import QuickActionDrawer from "./QuickActionDrawer";
import WorkstationOverlays from "./WorkstationOverlays";
import { MobileTimelineBar } from "./MobileTimelineBar";
import { useWorkstationReassessment } from "./useWorkstationReassessment";
import { deriveProblemList } from "../../../engine/problemListEngine";

/**
 * Единая клиническая рабочая станция врача для мобильных устройств (Unified Clinical Desk).
 * Все действия (диалог, готовые анализы, терапия) доступны в едином контексте пациента.
 */
export default function MobileWorkstation({
  cd, ps, prevPs, trajectory = [], recordTrajectoryCheckpoint, phase, setPhase,
  selDiag, setSelDiag, selTreat, toggleTreatment, orderedDiag, revealedResults,
  newResultIds, diagText, setDiagText, treatCat, setTreatCat,
  appliedFx, pendingFx, timeLeft, handleOrderTests, handleSubmit, processingTests,
  learningMode, paused, setPaused, showTheory, setShowTheory, relatedTopics,
  activeTheoryTopic, setActiveTheoryTopic, learningTip, showInfo, setShowInfo,
  selectedRoute, setSelectedRoute, setExtraResult, handleRevealAnamnesis,
  audioEnabled, setAudioEnabled, patientDialogueMode, addEvent, eventLog = []
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const [viewMode, setViewMode] = useState("patient"); // "patient" | "diagnose"
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("diag"); // "diag" | "treat"

  useEffect(() => {
    if (phase === "diagnose") setViewMode("diagnose");
  }, [phase]);

  const {
    reassessModalOpen, setReassessModalOpen,
    reassessmentIteration, handleConfirmReassessment,
  } = useWorkstationReassessment({
    trajectory, recordTrajectoryCheckpoint, ps, revealedResults, selTreat, addEvent,
  });

  const isCritical = ps?.status === "critical";

  const toggleDrawer = (mode) => {
    if (drawerOpen && drawerMode === mode) {
      setDrawerOpen(false);
    } else {
      setDrawerMode(mode);
      setDrawerOpen(true);
      setViewMode("patient");
    }
  };

  const handleOpenDiagnose = () => {
    setDrawerOpen(false);
    setViewMode((prev) => (prev === "diagnose" ? "patient" : "diagnose"));
  };

  return (
    <div style={{ height: "100vh", background: C.bgGrad, fontFamily: FONT, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* 1. Верхний компактный монитор витальных функций (все 6 показателей) */}
      <VitalsHUD
        ps={ps} prevPs={prevPs} cd={cd} mode={cd?.department || "icu"}
        phase={phase} setPhase={setPhase} timeLeft={timeLeft} audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled} learningMode={learningMode} paused={paused}
        setPaused={setPaused} showTheory={showTheory} setShowTheory={setShowTheory}
        relatedTopics={relatedTopics} compact
      />

      {/* 2. Синдромальная строка ведущих нарушений */}
      <VitalsStatusStrip ps={ps} cd={cd} />

      {/* 3. Основная рабочая область */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", position: "relative", WebkitOverflowScrolling: "touch" }}>
        {viewMode === "patient" ? (
          <div style={{ padding: "4px 8px" }}>
            <PatientRecordColumn
              cd={cd} ps={ps} orderedDiag={orderedDiag} revealedResults={revealedResults}
              newResultIds={newResultIds} selTreat={selTreat} showInfo={showInfo}
              setShowInfo={setShowInfo} onRevealAnamnesis={handleRevealAnamnesis}
              patientDialogueMode={patientDialogueMode} isMobile
              onOpenDiag={() => toggleDrawer("diag")} onOpenTreat={() => toggleDrawer("treat")}
            />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: `${C.accent}12`, borderBottom: `1px solid ${C.border}` }}>
              <button
                type="button"
                onClick={() => setViewMode("patient")}
                style={{
                  background: "transparent", border: "none", color: C.accent, fontSize: 12.5,
                  fontFamily: FONT, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3, padding: 0
                }}
              >
                <IconChevronLeft size={15} color={C.accent} />
                <span>К пациенту</span>
              </button>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.white, fontFamily: FONT }}>
                Постановка диагноза
              </span>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "8px 12px" }}>
              <DiagnosisRoutingTab
                cd={cd} diagText={diagText} setDiagText={setDiagText}
                handleSubmit={handleSubmit} selectedRoute={selectedRoute}
                setSelectedRoute={setSelectedRoute} setExtraResult={setExtraResult}
                orderedDiag={orderedDiag} revealedResults={revealedResults}
                selTreat={selTreat} pendingFx={pendingFx}
                t={t} isMobile
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Компактный таймлайн событий */}
      <MobileTimelineBar
        eventLog={eventLog} isCritical={isCritical} C={C}
        onOpenReassess={() => setReassessModalOpen(true)}
      />

      {/* 5. Нижняя панель быстрых действий (1 клик) */}
      <UnifiedMobileActionBar
        onOpenDiag={() => toggleDrawer("diag")}
        onOpenTreat={() => toggleDrawer("treat")}
        onOpenDiagnose={handleOpenDiagnose}
        orderedCount={orderedDiag.length}
        treatCount={selTreat.length}
        hasDiag={Boolean(diagText)}
        activeMode={viewMode === "diagnose" ? "diagnose" : drawerOpen ? drawerMode : "patient"}
      />

      {/* 6. Выдвижная шторка быстрого назначения анализов и препаратов */}
      <QuickActionDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        mode={drawerMode}
        selDiag={selDiag}
        setSelDiag={setSelDiag}
        orderedDiag={orderedDiag}
        handleOrderTests={handleOrderTests}
        processingTests={processingTests}
        t={t}
        cd={cd}
        selTreat={selTreat}
        toggleTreatment={toggleTreatment}
        appliedFx={appliedFx}
        pendingFx={pendingFx}
        treatCat={treatCat}
        setTreatCat={setTreatCat}
      />

      {/* 7. Оверлеи */}
      <WorkstationOverlays
        learningMode={learningMode} learningTip={learningTip} paused={paused} setPaused={setPaused}
        showTheory={showTheory} setShowTheory={setShowTheory} relatedTopics={relatedTopics}
        activeTheoryTopic={activeTheoryTopic} setActiveTheoryTopic={setActiveTheoryTopic}
        reassessModalOpen={reassessModalOpen} setReassessModalOpen={setReassessModalOpen}
        baselinePS={prevPs || ps} currentPS={ps}
        prevProblems={deriveProblemList(prevPs || ps, revealedResults)}
        curProblems={deriveProblemList(ps, revealedResults)}
        iteration={reassessmentIteration} onConfirmReassessment={handleConfirmReassessment}
        isMobile
      />
    </div>
  );
}
