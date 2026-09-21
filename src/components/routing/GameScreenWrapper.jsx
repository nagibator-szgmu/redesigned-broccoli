import GameScreen from "../../screens/GameScreen";
import { TutorialGuide, DepartmentTutorial } from "../game";

export default function GameScreenWrapper({
  game,
  settings,
  progress,
  tutorial,
  setExtraResult,
}) {
  return (
    <>
      <GameScreen
        phase={game.phase}
        setPhase={game.setPhase}
        cd={game.cd}
        ps={game.ps}
        prevPs={game.prevPs}
        trajectory={game.trajectory}
        recordTrajectoryCheckpoint={game.recordTrajectoryCheckpoint}
        selDiag={game.selDiag}
        setSelDiag={game.setSelDiag}
        selTreat={game.selTreat}
        toggleTreatment={game.toggleTreatment}
        orderedDiag={game.orderedDiag}
        revealedResults={game.revealedResults}
        newResultIds={game.newResultIds}
        diagText={game.diagText}
        setDiagText={game.setDiagText}
        diagCat={game.diagCat}
        setDiagCat={game.setDiagCat}
        treatCat={game.treatCat}
        setTreatCat={game.setTreatCat}
        appliedFx={game.appliedFx}
        pendingFx={game.pendingFx}
        timeLeft={game.timeLeft}
        totalTime={game.totalTime}
        eventLog={game.eventLog}
        handleOrderTests={game.handleOrderTests}
        handleSubmit={game.handleSubmit}
        processingTests={game.processingTests}
        allResultsReady={game.allResultsReady}
        gameMode={settings.gameMode}
        learningMode={settings.learningMode}
        assessmentMode={settings.assessmentMode}
        patientDialogueMode={settings.patientDialogueMode}
        paused={game.paused}
        setPaused={game.setPaused}
        selectedRoute={game.selectedRoute}
        setSelectedRoute={game.setSelectedRoute}
        revealedAnamnesis={game.revealedAnamnesis}
        setRevealedAnamnesis={game.setRevealedAnamnesis}
        setExtraResult={setExtraResult}
        curriculum={progress.curriculum}
        getNextCurriculumCase={progress.getNextCurriculumCase}
        topicsProgress={progress.topicsProgress}
        audioEnabled={settings.audioEnabled}
        setAudioEnabled={settings.setAudioEnabled}
        addEvent={game.addEvent}
      />
      {tutorial.isTutorial && (
        <TutorialGuide
          phase={game.phase}
          seenTips={tutorial.tutorialSeenTips}
          onSkip={tutorial.handleTutorialSkip}
        />
      )}
      {tutorial.showDeptTutorial && (
        <DepartmentTutorial
          dept={tutorial.showDeptTutorial}
          onClose={() => tutorial.setShowDeptTutorial(null)}
        />
      )}
    </>
  );
}
