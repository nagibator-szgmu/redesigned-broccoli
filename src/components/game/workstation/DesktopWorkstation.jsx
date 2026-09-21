import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import VitalsHUD from "../vitals/VitalsHUD";
import PatientRecordColumn from "./PatientRecordColumn";
import ActionCommandCenter from "./ActionCommandCenter";
import WorkstationTimelineBar from "./WorkstationTimelineBar";
import WorkstationOverlays from "./WorkstationOverlays";
import { useWorkstationReassessment } from "./useWorkstationReassessment";
import { deriveProblemList } from "../../../engine/problemListEngine";

/** Двухколоночная клиническая рабочая станция врача для десктопа с нижним таймлайном */
export default function DesktopWorkstation(props) {
  const {
    cd, ps, prevPs, trajectory = [], recordTrajectoryCheckpoint,
    phase, setPhase, selDiag, setSelDiag, selTreat, toggleTreatment,
    orderedDiag, revealedResults, newResultIds, diagText, setDiagText,
    diagCat, setDiagCat, treatCat, setTreatCat, appliedFx, pendingFx,
    timeLeft, handleOrderTests, handleSubmit, processingTests,
    learningMode, patientDialogueMode, paused, setPaused,
    showTheory, setShowTheory, relatedTopics, activeTheoryTopic, setActiveTheoryTopic,
    learningTip, selectedRoute, setSelectedRoute, setExtraResult,
    handleRevealAnamnesis, audioEnabled, setAudioEnabled, addEvent, eventLog = [],
  } = props;

  const C = useTheme();
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const leftColRef = useRef(null);

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

  const isCritical = ps?.status === "critical";
  const isDeteriorating = ps?.status === "deteriorating";

  useEffect(() => {
    window.scrollTo(0, 0);
    if (leftColRef.current) leftColRef.current.scrollTop = 0;
  }, [cd?.id]);

  return (
    <div style={{ flex: 1, height: "100%", minHeight: 0, background: C.bgGrad, fontFamily: FONT, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      {/* Фоновые эффекты свечения */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "-5%", top: "-10%", width: 500, height: 500, background: C.glowBg1, borderRadius: "50%" }} />
        <div style={{ position: "absolute", right: 0, bottom: 0, width: 400, height: 400, background: C.glowBg2, borderRadius: "50%" }} />
      </div>

      {/* Верхний клинический монитор витальных функций */}
      <VitalsHUD
        ps={ps} prevPs={prevPs} cd={cd} mode={cd?.department || "icu"}
        phase={phase} setPhase={setPhase} timeLeft={timeLeft}
        audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled}
        learningMode={learningMode} paused={paused} setPaused={setPaused}
        showTheory={showTheory} setShowTheory={setShowTheory} relatedTopics={relatedTopics}
      />

      {/* Основная двухколоночная сетка рабочей станции */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "8px 12px 6px 12px", minHeight: 0, zIndex: 1, overflow: "hidden" }}>
        {/* Левая колонка: Демография, анамнез, статус, ИИ-опрос и результаты тестов */}
        <div
          ref={leftColRef}
          style={{
            height: "100%", maxHeight: "100%", minHeight: 0, overflowY: "auto", overflowX: "hidden",
            overscrollBehavior: "contain", borderRadius: 14, display: "flex", flexDirection: "column",
            background: "transparent", scrollbarWidth: "thin", scrollbarColor: `${C.accent}80 rgba(0,0,0,0.25)`,
          }}
        >
          <PatientRecordColumn
            cd={cd} ps={ps} trajectory={trajectory} orderedDiag={orderedDiag}
            revealedResults={revealedResults} newResultIds={newResultIds}
            onRevealAnamnesis={handleRevealAnamnesis} patientDialogueMode={patientDialogueMode}
          />
        </div>

        {/* Правая колонка: Вкладки командного центра */}
        <div style={{ height: "100%", maxHeight: "100%", minHeight: 0, overflow: "hidden", borderRadius: 14, display: "flex", flexDirection: "column" }}>
          <ActionCommandCenter
            phase={phase} selDiag={selDiag} setSelDiag={setSelDiag} orderedDiag={orderedDiag}
            diagCat={diagCat} setDiagCat={setDiagCat} handleOrderTests={handleOrderTests}
            processingTests={processingTests} cd={cd} selTreat={selTreat} toggleTreatment={toggleTreatment}
            appliedFx={appliedFx} pendingFx={pendingFx} treatCat={treatCat} setTreatCat={setTreatCat}
            diagText={diagText} setDiagText={setDiagText} handleSubmit={handleSubmit}
            selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} setExtraResult={setExtraResult}
            learningTip={learningTip} relatedTopics={relatedTopics} setShowTheory={setShowTheory}
          />
        </div>
      </div>

      {/* Нижняя полоса таймлайна событий и вызова переоценки */}
      <WorkstationTimelineBar
        isCritical={isCritical} isDeteriorating={isDeteriorating} eventLog={eventLog}
        timelineExpanded={timelineExpanded} setTimelineExpanded={setTimelineExpanded}
        onOpenReassessment={() => setReassessModalOpen(true)}
      />

      {/* Оверлеи и модальные окна */}
      <WorkstationOverlays
        learningMode={learningMode} learningTip={learningTip} paused={paused} setPaused={setPaused}
        showTheory={showTheory} setShowTheory={setShowTheory} relatedTopics={relatedTopics}
        activeTheoryTopic={activeTheoryTopic} setActiveTheoryTopic={setActiveTheoryTopic}
        reassessModalOpen={reassessModalOpen} setReassessModalOpen={setReassessModalOpen}
        baselinePS={prevPs || ps} currentPS={ps}
        prevProblems={deriveProblemList(prevPs || ps, revealedResults)}
        curProblems={deriveProblemList(ps, revealedResults)}
        iteration={reassessmentIteration} onConfirmReassessment={handleConfirmReassessment}
      />
    </div>
  );
}
