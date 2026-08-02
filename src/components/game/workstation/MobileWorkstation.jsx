import { useState } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
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

/** Responsive mobile clinical workstation component */
export default function MobileWorkstation({
  cd, ps, prevPs, phase, setPhase, selDiag, setSelDiag, selTreat, toggleTreatment,
  orderedDiag, revealedResults, newResultIds, diagText, setDiagText,
  diagCat, setDiagCat, treatCat, setTreatCat, appliedFx, pendingFx,
  timeLeft, handleOrderTests, handleSubmit, processingTests, learningMode,
  paused, setPaused, showTheory, setShowTheory, relatedTopics, activeTheoryTopic,
  setActiveTheoryTopic, learningTip, showInfo, setShowInfo, selectedRoute,
  setSelectedRoute, setExtraResult, handleRevealAnamnesis, audioEnabled, setAudioEnabled
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const [activeTab, setActiveTab] = useState("main");

  const navItems = [
    { key: "main", label: t("sidebar.patient") || "Пациент", icon: "👤" },
    { key: "diag", label: t("phases.order_tests"), icon: "🔬", badge: selDiag.length },
    { key: "treat", label: t("treatment.title") || "Лечение", icon: "💊", badge: selTreat.length },
    { key: "diagnose", label: t("phases.diagnose"), icon: "📋", badge: diagText ? 1 : 0 }
  ];

  return (
    <div style={{ height: "100vh", background: C.bgGrad, fontFamily: FONT, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <VitalsHUD
        ps={ps} prevPs={prevPs} cd={cd} mode={cd?.department || "icu"}
        phase={phase} setPhase={setPhase} timeLeft={timeLeft} audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled} learningMode={learningMode} paused={paused}
        setPaused={setPaused} showTheory={showTheory} setShowTheory={setShowTheory}
        relatedTopics={relatedTopics} compact
      />

      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {activeTab === "main" && (
          <PatientRecordColumn
            cd={cd} ps={ps} orderedDiag={orderedDiag} revealedResults={revealedResults}
            newResultIds={newResultIds} selTreat={selTreat} showInfo={showInfo}
            setShowInfo={setShowInfo} onRevealAnamnesis={handleRevealAnamnesis}
          />
        )}
        {activeTab === "diag" && (
          <DiagTab
            selDiag={selDiag} setSelDiag={setSelDiag} orderedDiag={orderedDiag}
            diagCat={diagCat} setDiagCat={setDiagCat} handleOrderTests={handleOrderTests}
            processingTests={processingTests} t={t}
          />
        )}
        {activeTab === "treat" && (
          <TreatTab
            cd={cd} selTreat={selTreat} toggleTreatment={toggleTreatment}
            appliedFx={appliedFx} pendingFx={pendingFx} treatCat={treatCat}
            setTreatCat={setTreatCat} isMobile
          />
        )}
        {activeTab === "diagnose" && (
          <DiagnosisRoutingTab
            diagText={diagText} setDiagText={setDiagText} selTreat={selTreat}
            pendingFx={pendingFx} handleSubmit={handleSubmit} cd={cd}
            selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute}
            setExtraResult={setExtraResult} t={t}
          />
        )}
      </div>

      <MobileWorkstationDock activeTab={activeTab} setActiveTab={setActiveTab} navItems={navItems} />

      {learningMode && learningTip && <LearningTipToast tip={learningTip} isMobile />}
      {learningMode && paused && <PauseOverlay onResume={() => setPaused(false)} />}
      <TheoryModal
        relatedTopics={relatedTopics} showTheory={showTheory} setShowTheory={setShowTheory}
        activeTheoryTopic={activeTheoryTopic} setActiveTheoryTopic={setActiveTheoryTopic} isMobile
      />
    </div>
  );
}
