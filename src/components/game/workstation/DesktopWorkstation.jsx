import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";
import VitalsHUD from "../vitals/VitalsHUD";
import PatientRecordColumn from "./PatientRecordColumn";
import ActionCommandCenter from "./ActionCommandCenter";
import PauseOverlay from "../PauseOverlay";
import LearningTipToast from "../LearningTipToast";
import TheoryModal from "../TheoryModal";
import ReassessmentModal from "../ReassessmentModal";
import { calculateMap } from "../../../engine/reassessmentEngine";
import { deriveProblemList } from "../../../engine/problemListEngine";

/** Two-column Clinical Workstation Container for Desktop view with sticky bottom Event Timeline */
export default function DesktopWorkstation({
  cd,
  ps,
  prevPs,
  trajectory = [],
  recordTrajectoryCheckpoint,
  phase,
  setPhase,
  selDiag,
  setSelDiag,
  selTreat,
  toggleTreatment,
  orderedDiag,
  revealedResults,
  newResultIds,
  diagText,
  setDiagText,
  diagCat,
  setDiagCat,
  treatCat,
  setTreatCat,
  appliedFx,
  pendingFx,
  timeLeft,
  handleOrderTests,
  handleSubmit,
  processingTests,
  learningMode,
  paused,
  setPaused,
  showTheory,
  setShowTheory,
  relatedTopics,
  activeTheoryTopic,
  setActiveTheoryTopic,
  learningTip,
  showInfo,
  setShowInfo,
  selectedRoute,
  setSelectedRoute,
  setExtraResult,
  handleRevealAnamnesis,
  audioEnabled,
  setAudioEnabled,
  addEvent,
  eventLog = [],
}) {
  const C = useTheme();
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const [reassessModalOpen, setReassessModalOpen] = useState(false);

  const reassessmentIteration = useMemo(() => {
    return (trajectory.filter(c => c.checkpointId?.startsWith("REASSESSMENT")).length) + 1;
  }, [trajectory]);

  const handleConfirmReassessment = (data) => {
    if (!data || !addEvent) return;
    const { report, chosenPlan, iteration } = data;
    const type = report.overallResponse === "positive" ? "result" : report.overallResponse === "negative" ? "critical" : "warn";
    addEvent(`[REASSESSMENT #${iteration}] ${report.summaryText} (Улучшено: ${report.improvedCount}, Ухудшено: ${report.worsenedCount}) → План: ${chosenPlan?.label || "Продолжить"}`, type);

    if (recordTrajectoryCheckpoint) {
      recordTrajectoryCheckpoint({
        checkpointId: `REASSESSMENT #${iteration}`,
        iteration,
        vitals: { ...ps },
        map: calculateMap(ps.sbp, ps.dbp),
        overallResponse: report.overallResponse,
        summaryText: report.summaryText,
        chosenPlan,
        activeProblems: deriveProblemList(ps, revealedResults),
        recentInterventions: [...selTreat]
      });
    }
  };

  const isCritical = ps?.status === "critical";
  const isDeteriorating = ps?.status === "deteriorating";

  const leftColRef = useRef(null);

  // Guarantee window and column scroll position reset on case entry
  useEffect(() => {
    window.scrollTo(0, 0);
    if (leftColRef.current) {
      leftColRef.current.scrollTop = 0;
    }
  }, [cd?.id]);

  return (
    <div style={{
      flex: 1,
      height: "100%",
      minHeight: 0,
      background: C.bgGrad,
      fontFamily: FONT,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Background Ambient Glow Effects */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "-5%", top: "-10%", width: 500, height: 500, background: C.glowBg1, borderRadius: "50%" }} />
        <div style={{ position: "absolute", right: 0, bottom: 0, width: 400, height: 400, background: C.glowBg2, borderRadius: "50%" }} />
      </div>

      {/* Top Clinical Telemetry Header Monitor (Firmly Fixed) */}
      <VitalsHUD
        ps={ps}
        prevPs={prevPs}
        cd={cd}
        mode={cd?.department || "icu"}
        phase={phase}
        setPhase={setPhase}
        timeLeft={timeLeft}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        learningMode={learningMode}
        paused={paused}
        setPaused={setPaused}
        showTheory={showTheory}
        setShowTheory={setShowTheory}
        relatedTopics={relatedTopics}
      />

      {/* Main 2-Column Clinical Workstation Grid */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        padding: "8px 12px 6px 12px",
        minHeight: 0,
        zIndex: 1,
        overflow: "hidden"
      }}>
        {/* Left Column: Patient Demographics, Structured History, Exam & Results */}
        <div
          ref={leftColRef}
          style={{
            height: "100%",
            maxHeight: "100%",
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            overscrollBehavior: "contain",
            borderRadius: 14,
            display: "flex",
            flexDirection: "column",
            background: "transparent",
            scrollbarWidth: "thin",
            scrollbarColor: `${C.accent}80 rgba(0,0,0,0.25)`
          }}
        >
          <PatientRecordColumn
            cd={cd}
            ps={ps}
            trajectory={trajectory}
            orderedDiag={orderedDiag}
            revealedResults={revealedResults}
            newResultIds={newResultIds}
            onRevealAnamnesis={handleRevealAnamnesis}
          />
        </div>

        {/* Right Column: Tabbed Action Command Center (Tabs permanently pinned at top) */}
        <div style={{
          height: "100%",
          maxHeight: "100%",
          minHeight: 0,
          overflow: "hidden",
          borderRadius: 14,
          display: "flex",
          flexDirection: "column"
        }}>
          <ActionCommandCenter
            phase={phase}
            selDiag={selDiag}
            setSelDiag={setSelDiag}
            orderedDiag={orderedDiag}
            diagCat={diagCat}
            setDiagCat={setDiagCat}
            handleOrderTests={handleOrderTests}
            processingTests={processingTests}
            cd={cd}
            selTreat={selTreat}
            toggleTreatment={toggleTreatment}
            appliedFx={appliedFx}
            pendingFx={pendingFx}
            treatCat={treatCat}
            setTreatCat={setTreatCat}
            diagText={diagText}
            setDiagText={setDiagText}
            handleSubmit={handleSubmit}
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
            setExtraResult={setExtraResult}
            learningTip={learningTip}
            relatedTopics={relatedTopics}
            setShowTheory={setShowTheory}
          />
        </div>
      </div>

      {/* Bottom Clinical Event Timeline & Critical Alerts Bar */}
      <div style={{
        zIndex: 2,
        background: isCritical ? "rgba(255,61,90,0.12)" : isDeteriorating ? "rgba(245,200,66,0.1)" : C.headerBg2,
        borderTop: `1px solid ${isCritical ? C.red : isDeteriorating ? C.yellow : C.border}`,
        backdropFilter: "blur(12px)",
        padding: "6px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        maxHeight: timelineExpanded ? 180 : 36,
        transition: "max-height 0.2s ease-in-out",
        overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontFamily: FONT }}>
            <span style={{ fontWeight: 700, color: isCritical ? C.red : isDeteriorating ? C.yellow : C.accent, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {isCritical ? "⚠️ КРИТИЧЕСКИЙ СТАТУС" : isDeteriorating ? "⚡ УХУДШЕНИЕ" : "⏱ ТАЙМЛАЙН"}
            </span>
            {eventLog[0] && (
              <span style={{ color: C.textDim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "60vw" }}>
                [{eventLog[0].elapsed}] {eventLog[0].text}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setReassessModalOpen(true)}
              style={{
                padding: "3px 10px",
                borderRadius: 6,
                background: `${C.accent}20`,
                border: `1px solid ${C.accent}55`,
                color: C.accent,
                fontSize: 10.5,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: FONT,
                display: "flex",
                alignItems: "center",
                gap: 4
              }}
            >
              🔄 Оценить динамику
            </button>
            <button
              onClick={() => setTimelineExpanded(prev => !prev)}
              style={{
                background: "transparent",
                border: "none",
                color: C.textDim,
                fontSize: 10,
                cursor: "pointer",
                fontFamily: FONT,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>{eventLog.length} событий</span>
              <span>{timelineExpanded ? "▼" : "▲"}</span>
            </button>
          </div>
        </div>

        {timelineExpanded && (
          <div style={{ display: "flex", flexDirection: "column", gap: 3, overflowY: "auto", maxHeight: 130, paddingTop: 4 }}>
            {eventLog.map((ev, i) => (
              <div key={ev.id || i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontFamily: FONT, color: ev.type === "critical" || ev.type === "danger" ? C.red : ev.type === "warning" || ev.type === "warn" ? C.yellow : ev.type === "result" ? C.accent : C.textDim }}>
                <span style={{ fontFamily: CODE, fontSize: 10, opacity: 0.8, minWidth: 36 }}>{ev.elapsed || "0:00"}</span>
                <span>•</span>
                <span style={{ color: ev.type === "critical" ? C.red : C.text }}>{ev.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Learning Mode Overlays */}
      {learningMode && learningTip && <LearningTipToast tip={learningTip} isMobile={false} />}
      {learningMode && paused && <PauseOverlay onResume={() => setPaused(false)} />}
      <TheoryModal
        relatedTopics={relatedTopics}
        showTheory={showTheory}
        setShowTheory={setShowTheory}
        activeTheoryTopic={activeTheoryTopic}
        setActiveTheoryTopic={setActiveTheoryTopic}
        isMobile={false}
      />
      <ReassessmentModal
        isOpen={reassessModalOpen}
        onClose={() => setReassessModalOpen(false)}
        baselinePS={prevPs || ps}
        currentPS={ps}
        prevProblems={deriveProblemList(prevPs || ps, revealedResults)}
        curProblems={deriveProblemList(ps, revealedResults)}
        iteration={reassessmentIteration}
        onConfirmReassessment={handleConfirmReassessment}
        isMobile={false}
      />
    </div>
  );
}
