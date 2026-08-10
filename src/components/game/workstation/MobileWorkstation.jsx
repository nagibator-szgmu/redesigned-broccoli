import React, { useState, useMemo } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";
import { useTranslate } from "../../../locale/useTranslate";
import VitalsHUD from "../vitals/VitalsHUD";
import PatientRecordColumn from "./PatientRecordColumn";
import DiagTab from "./DiagTab";
import TreatTab from "./TreatTab";
import DiagnosisRoutingTab from "./DiagnosisRoutingTab";
import MobileWorkstationDock from "./MobileWorkstationDock";
import LearningTipToast from "../LearningTipToast";
import PauseOverlay from "../PauseOverlay";
import TheoryModal from "../TheoryModal";
import ReassessmentModal from "../ReassessmentModal";
import { calculateMap } from "../../../engine/reassessmentEngine";
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
  audioEnabled, setAudioEnabled, addEvent, eventLog = []
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const [activeTab, setActiveTab] = useState("main");
  const [timelineOpen, setTimelineOpen] = useState(false);
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
      {eventLog.length > 0 && (
        <div style={{
          background: C.panel, borderTop: `1px solid ${C.border}`, padding: "6px 12px",
          fontSize: 10, flexShrink: 0, zIndex: 10, display: "flex", flexDirection: "column",
          gap: 2, fontFamily: FONT,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              onClick={() => setTimelineOpen(prev => !prev)}
              style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", flex: 1, minWidth: 0 }}
            >
              <span style={{ color: isCritical ? C.red : C.accent, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                ⏱ {eventLog[0]?.elapsed} {eventLog[0]?.text}
              </span>
              <span style={{ color: C.textDim, fontSize: 9 }}>{timelineOpen ? "▼" : `▲ (${eventLog.length})`}</span>
            </div>
            <button
              onClick={() => setReassessModalOpen(true)}
              style={{
                padding: "2px 6px", borderRadius: 4, background: `${C.accent}25`,
                border: `1px solid ${C.accent}55`, color: C.accent, fontSize: 9.5,
                fontWeight: 700, cursor: "pointer", fontFamily: FONT, flexShrink: 0
              }}
            >
              🔄 Оценить
            </button>
          </div>
          {timelineOpen && (
            <div style={{ display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", marginTop: 4 }}>
              {eventLog.slice(0, 10).map((ev, i) => (
                <div key={ev.id || i} style={{ display: "flex", gap: 6, color: ev.type === "critical" ? C.red : C.textDim }}>
                  <span style={{ fontFamily: CODE, opacity: 0.8 }}>{ev.elapsed}</span>
                  <span>{ev.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom Navigation Dock */}
      <MobileWorkstationDock activeTab={activeTab} setActiveTab={setActiveTab} navItems={navItems} />

      {/* Overlays */}
      {learningMode && learningTip && <LearningTipToast tip={learningTip} isMobile />}
      {learningMode && paused && <PauseOverlay onResume={() => setPaused(false)} />}
      <TheoryModal
        relatedTopics={relatedTopics} showTheory={showTheory} setShowTheory={setShowTheory}
        activeTheoryTopic={activeTheoryTopic} setActiveTheoryTopic={setActiveTheoryTopic} isMobile
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
        isMobile
      />
    </div>
  );
}
