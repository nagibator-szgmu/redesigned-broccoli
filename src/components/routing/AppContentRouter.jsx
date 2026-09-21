import { lazy } from "react";
import MenuScreen from "../../screens/MenuScreen";
import ResultScreen from "../../screens/ResultScreen";
import { TutorialGuide } from "../game";
import GameScreenWrapper from "./GameScreenWrapper";
import { IS_DEV_MODE } from "../../config";

const TheoryScreen = lazy(() => import("../../screens/TheoryScreen"));
const LeaderboardScreen = lazy(() => import("../../screens/LeaderboardScreen"));
const CertificateScreen = lazy(() => import("../../screens/CertificateScreen"));
const OnboardingScreen = lazy(() => import("../../screens/OnboardingScreen"));
const CourseMapScreen = lazy(() => import("../../screens/CourseMapScreen"));
const TeacherDashboardScreen = lazy(() => import("../../screens/TeacherDashboardScreen"));

export default function AppContentRouter({
  game,
  settings,
  progress,
  tutorial,
  startGameWrapped,
  extraResult,
  setExtraResult,
}) {
  if (tutorial.showOnboarding) {
    return <OnboardingScreen onComplete={tutorial.handleOnboardingComplete} />;
  }

  if (game.phase === "menu") {
    return (
      <>
        <MenuScreen
          startGame={startGameWrapped}
          setPhase={game.setPhase}
          totalScore={settings.totalScore}
          casesPlayed={settings.casesPlayed}
          searchQuery={settings.searchQuery}
          setSearchQuery={settings.setSearchQuery}
          department={settings.department}
          setDepartment={settings.setDepartment}
          specFilter={settings.specFilter}
          setSpecFilter={settings.setSpecFilter}
          showAllCases={settings.showAllCases}
          setShowAllCases={settings.setShowAllCases}
          showNotif={settings.showNotif}
          setShowNotif={settings.setShowNotif}
          showSettings={settings.showSettings}
          setShowSettings={settings.setShowSettings}
          difficulty={settings.difficulty}
          setDifficulty={settings.setDifficulty}
          gameMode={settings.gameMode}
          setGameMode={settings.setGameMode}
          theme={settings.theme}
          setTheme={settings.setTheme}
          learningMode={settings.learningMode}
          setLearningMode={settings.setLearningMode}
          assessmentMode={settings.assessmentMode}
          setAssessmentMode={settings.setAssessmentMode}
          patientDialogueMode={settings.patientDialogueMode}
          setPatientDialogueMode={settings.setPatientDialogueMode}
          progressionMode={settings.progressionMode}
          setProgressionMode={settings.setProgressionMode}
          audioEnabled={settings.audioEnabled}
          setAudioEnabled={settings.setAudioEnabled}
          hideWarnings={settings.hideWarnings}
          setHideWarnings={settings.setHideWarnings}
          sessionHistory={settings.sessionHistory}
          isDevMode={IS_DEV_MODE}
          checkDeptTutorial={tutorial.checkDeptTutorial}
          forceShowDeptTutorial={tutorial.forceShowDeptTutorial}
          restartTutorial={tutorial.restartTutorial}
          showTutorialTips={tutorial.showTutorialTips}
        />
        {tutorial.showTourMenu && (
          <TutorialGuide
            phase={game.phase}
            seenTips={tutorial.tutorialSeenTips}
            onSkip={tutorial.handleTutorialSkip}
            showTourMenu
            onTourComplete={tutorial.handleTourComplete}
          />
        )}
      </>
    );
  }

  if (game.phase === "teacher_dashboard") {
    return (
      <TeacherDashboardScreen
        setPhase={game.setPhase}
        sessionHistory={settings.sessionHistory}
      />
    );
  }

  if (game.phase === "theory") {
    return (
      <TheoryScreen
        setPhase={game.setPhase}
        startGame={startGameWrapped}
        progress={progress}
        progressionMode={settings.progressionMode}
        setProgressionMode={settings.setProgressionMode}
        progressionChosen={settings.progressionChosen}
        setProgressionChosen={settings.setProgressionChosen}
      />
    );
  }

  if (game.phase === "leaderboard") {
    return (
      <LeaderboardScreen
        setPhase={game.setPhase}
        sessionHistory={settings.sessionHistory}
      />
    );
  }

  if (game.phase === "certificates") {
    return (
      <CertificateScreen
        setPhase={game.setPhase}
        sessionHistory={settings.sessionHistory}
      />
    );
  }

  if (game.phase === "map") {
    return <CourseMapScreen setPhase={game.setPhase} progress={progress} />;
  }

  if (game.phase === "result" && game.result && game.cd) {
    return (
      <ResultScreen
        result={game.result}
        cd={game.cd}
        ps={game.ps}
        trajectory={game.trajectory}
        orderedDiag={game.orderedDiag}
        selTreat={game.selTreat}
        diagText={game.diagText}
        eventLog={game.eventLog}
        extraResult={extraResult}
        setPhase={game.setPhase}
        startGame={startGameWrapped}
        assessmentMode={settings.assessmentMode}
        curriculum={progress.curriculum}
        advanceCurriculum={progress.advanceCurriculum}
        getNextCurriculumCase={progress.getNextCurriculumCase}
        clearCurriculum={progress.clearCurriculum}
        getNextCurriculumTopic={progress.getNextCurriculumTopic}
        tutorialMode={tutorial.isTutorial}
        elapsedSec={game.totalTime - game.timeLeft}
        revealedAnamnesis={game.revealedAnamnesis}
      />
    );
  }

  if (!game.cd || !game.ps) return null;

  return (
    <GameScreenWrapper
      game={game}
      settings={settings}
      progress={progress}
      tutorial={tutorial}
      setExtraResult={setExtraResult}
    />
  );
}
