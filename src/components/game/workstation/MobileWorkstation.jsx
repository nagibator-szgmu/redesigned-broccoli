import React, { useState } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import { useTranslate } from "../../../locale/useTranslate";
import VitalsHUD from "../vitals/VitalsHUD";
import PatientRecordColumn from "./PatientRecordColumn";
import DiagTab from "./DiagTab";
import TreatTab from "./TreatTab";
import DiagnosisRoutingTab from "./DiagnosisRoutingTab";
import MobileWorkstationDock from "./MobileWorkstationDock";
import WorkstationOverlays from "./WorkstationOverlays";
import { MobileTimelineBar } from "./MobileTimelineBar";
import { useWorkstationReassessment } from "./useWorkstationReassessment";
import { deriveProblemList } from "../../../engine/problemListEngine";

/** Responsive mobile clinical workstation component with compact HUD and iterative decision loop */
export default function MobileWorkstation({
  cd, ps, prevPs, trajectory = [], recordTrajectoryCheckpoint, phase, setPhase,
  selDiag, setSelDiag, selTreat, toggleTreatment, orderedDiag, revealedResults,
  newResultIds, diagText, setDiagText, diagCat, setDiagCat, treatCat, setTreatCat,
  appliedFx, pendingFx, timeLeft, handleOrderTests, handleSubmit, processingTests,
  learningMode, paused, setPaused, showTheory, setShowTheory, relatedTopics,
  activeTheoryTopic, setActiveTheoryTopic, learningTip, showInfo, setShowInfo,
  selectedRoute, setSelectedRoute, setExtraResult, handleRevealAnamnesis,
  audioEnabled, setAudioEnabled, patientDialogueMode, addEvent, eventLog = []
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const [activeTab, setActiveTab] = useState("main");

  const {
    reassessModalOpen,
    setReassessModalOpen,
    reassessmentIteration,
    handleConfirmReassessment,
  } = useWorkstationReassessment({
    trajectory,
    recordTrajectoryCheckpoint,
    ps,
    revealedResults,
    selTreat,
    addEvent,
  });

  const navItems = [
    { key: "main", label: t("sidebar.patient") || "Пациент", icon: "👤" },
    { key: "diag", label: t("phases.order_tests") || "Тесты", icon: "🔬", badge: selDiag.length },
    { key: "treat", label: t("treatment.title") || "Лечение", icon: "💊", badge: selTreat.length },
    { key: "diagnose", label: t("phases.diagnose") || "Диагноз", icon: "📋", badge: diagText ? 1 : 0 }
  ];

  const isCritical = ps?.status === "critical";

  return (
    <div style={{ height: "100vh", background: C.bgGrad, fontFamily: FONT, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Top Sticky Compact Vitals HUD */}
      <VitalsHUD
        ps={ps} prevPs={prevPs} cd={cd} mode={cd?.department || "icu"}
        phase={phase} setPhase={setPhase} timeLeft={timeLeft} audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled} learningMode={learningMode} paused={paused}
        setPaused={setPaused} showTheory={showTheory} setShowTheory={setShowTheory}
        relatedTopics={relatedTopics} compact
      />

      {/* Main Single Column Content Area */}
      <div style={{ flex: 1, overflowY: "auto", position: "relative", WebkitOverflowScrolling: "touch" }}>
        {activeTab === "main" && (
          <PatientRecordColumn
            cd={cd} ps={ps} trajectory={trajectory} orderedDiag={orderedDiag} revealedResults={revealedResults}
            newResultIds={newResultIds} selTreat={selTreat} showInfo={showInfo}
            setShowInfo={setShowInfo} onRevealAnamnesis={handleRevealAnamnesis}
            patientDialogueMode={patientDialogueMode}
            addEvent={addEvent} isMobile
          />
        )}
        {activeTab === "diag" && (
          <div style={{ padding: "10px 12px", height: "100%", boxSizing: "border-box" }}>
            <DiagTab
              selDiag={selDiag} setSelDiag={setSelDiag} orderedDiag={orderedDiag}
              diagCat={diagCat} setDiagCat={setDiagCat} handleOrderTests={handleOrderTests}
              processingTests={processingTests} t={t}
            />
          </div>
        )}
        {activeTab === "treat" && (
          <div style={{ padding: "10px 12px", height: "100%", boxSizing: "border-box" }}>
            <TreatTab
              cd={cd} selTreat={selTreat} toggleTreatment={toggleTreatment}
              appliedFx={appliedFx} pendingFx={pendingFx} treatCat={treatCat}
              setTreatCat={setTreatCat} t={t}
            />
          </div>
        )}
        {activeTab === "diagnose" && (
          <div style={{ padding: "10px 12px", height: "100%", boxSizing: "border-box" }}>
            <DiagnosisRoutingTab
              cd={cd} diagText={diagText} setDiagText={setDiagText}
              handleSubmit={handleSubmit} selectedRoute={selectedRoute}
              setSelectedRoute={setSelectedRoute} setExtraResult={setExtraResult}
              orderedDiag={orderedDiag} revealedResults={revealedResults}
              revealedAnamnesis={showInfo ? new Set(["complaints", "shortHistory", "lifeHistory", "exam"]) : new Set()}
              t={t} isMobile
            />
          </div>
        )}
      </div>

      {/* Collapsible Sticky Bottom Timeline Bar */}
      <MobileTimelineBar
        eventLog={eventLog}
        isCritical={isCritical}
        C={C}
        onOpenReassess={() => setReassessModalOpen(true)}
      />

      {/* Bottom Navigation Dock */}
      <MobileWorkstationDock activeTab={activeTab} setActiveTab={setActiveTab} navItems={navItems} />

      {/* Overlays */}
      <WorkstationOverlays
        learningMode={learningMode}
        learningTip={learningTip}
        paused={paused}
        setPaused={setPaused}
        showTheory={showTheory}
        setShowTheory={setShowTheory}
        relatedTopics={relatedTopics}
        activeTheoryTopic={activeTheoryTopic}
        setActiveTheoryTopic={setActiveTheoryTopic}
        reassessModalOpen={reassessModalOpen}
        setReassessModalOpen={setReassessModalOpen}
        baselinePS={prevPs || ps}
        currentPS={ps}
        prevProblems={deriveProblemList(prevPs || ps, revealedResults)}
        curProblems={deriveProblemList(ps, revealedResults)}
        iteration={reassessmentIteration}
        onConfirmReassessment={handleConfirmReassessment}
        isMobile
      />
    </div>
  );
}
