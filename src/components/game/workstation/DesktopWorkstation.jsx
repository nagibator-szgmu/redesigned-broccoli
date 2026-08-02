import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import VitalsHUD from "../vitals/VitalsHUD";
import PatientRecordColumn from "./PatientRecordColumn";
import ActionCommandCenter from "./ActionCommandCenter";
import PauseOverlay from "../PauseOverlay";
import LearningTipToast from "../LearningTipToast";
import TheoryModal from "../TheoryModal";

/** Two-column Clinical Workstation Container for Desktop view */
export default function DesktopWorkstation({
  cd,
  ps,
  prevPs,
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
  setAudioEnabled
}) {
  const C = useTheme();

  return (
    <div style={{
      height: "100vh",
      background: C.bgGrad,
      fontFamily: FONT,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative"
    }}>
      {/* Background Ambient Glow Effects */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", left: "-5%", top: "-10%", width: 500, height: 500, background: C.glowBg1, borderRadius: "50%" }} />
        <div style={{ position: "absolute", right: "-5%", bottom: "-10%", width: 400, height: 400, background: C.glowBg2, borderRadius: "50%" }} />
      </div>

      {/* Top Clinical Telemetry Header Monitor */}
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
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 12, minHeight: 0, zIndex: 1 }}>
        {/* Left Column: Patient Demographics, History, Exam & Results */}
        <div style={{ overflow: "hidden", borderRadius: 14 }}>
          <PatientRecordColumn
            cd={cd}
            ps={ps}
            orderedDiag={orderedDiag}
            revealedResults={revealedResults}
            newResultIds={newResultIds}
            selTreat={selTreat}
            showInfo={showInfo}
            setShowInfo={setShowInfo}
            onRevealAnamnesis={handleRevealAnamnesis}
          />
        </div>

        {/* Right Column: Tabbed Action Command Center */}
        <div style={{ overflow: "hidden", borderRadius: 14 }}>
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
    </div>
  );
}
