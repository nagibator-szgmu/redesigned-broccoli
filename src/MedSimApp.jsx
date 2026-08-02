import { useState, useEffect, useCallback, Component } from "react";
import { ThemeCtx } from "./ui/ThemeContext";
import { DARK, LIGHT } from "./ui/theme";
import useSettings from "./hooks/useSettings";
import useGameSession from "./hooks/useGameSession";
import useProgress from "./hooks/useProgress";
import { TOPICS } from "./data/topics";
import { TutorialGuide, DepartmentTutorial } from "./components/game";
import MenuScreen from "./screens/MenuScreen";
import GameScreen from "./screens/GameScreen";
import ResultScreen from "./screens/ResultScreen";
import TheoryScreen from "./screens/TheoryScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import CertificateScreen from "./screens/CertificateScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import CourseMapScreen from "./screens/CourseMapScreen";
import TeacherDashboardScreen from "./screens/TeacherDashboardScreen";
import useGameAudio from "./hooks/useGameAudio";
import { IS_DEV_MODE } from "./config";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{minHeight:"100vh",background:"#070d18",color:"#e8f4ff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',sans-serif",padding:24}}>
          <div style={{maxWidth:520,width:"100%",background:"#0d1a2e",border:"1px solid #1a3050",borderRadius:16,padding:32,textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:16}}>⚠️</div>
            <h2 style={{fontSize:18,fontWeight:700,color:"#ff3d5a",marginBottom:12}}>Произошла ошибка</h2>
            <p style={{fontSize:13,color:"#a8c8e0",lineHeight:1.6,marginBottom:20}}>
              {this.state.error?.message || "Неизвестная ошибка приложения"}
            </p>
            <button onClick={() => {this.setState({hasError:false,error:null});window.location.reload();}} style={{background:"#00e6c8",border:"none",borderRadius:10,padding:"12px 28px",fontSize:14,fontWeight:700,color:"#070d18",cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>
              Перезагрузить
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function MedSimApp() {
  const settings = useSettings();
  const game = useGameSession({
    difficulty: settings.difficulty,
    gameMode: settings.gameMode,
    learningMode: settings.learningMode,
    setTotalScore: settings.setTotalScore,
    setCasesPlayed: settings.setCasesPlayed,
    setSessionHistory: settings.setSessionHistory,
  });

  const [extraResult, setExtraResult] = useState(null);
  const progress = useProgress();
  useGameAudio(game.phase, game.paused, game.cd?.department, game.ps, settings.audioEnabled);

  const origStartGame = game.startGame;
  const startGameWrapped = useCallback((...args) => {
    setExtraResult(null);
    return origStartGame(...args);
  }, [origStartGame]);

  useEffect(() => {
    if (game.phase !== "result" || !game.cd) return;
    const topic = TOPICS.flatMap(c => c.children).find(t => t.cases.includes(game.cd.id));
    if (topic) progress.completeCase(topic.id, game.cd.id);
  }, [game.phase, game.cd?.id]);

  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return localStorage.getItem("ms_onboardingDone") !== "true"; }
    catch { return true; }
  });
  const [tutorialSeenTips, setTutorialSeenTips] = useState(new Set());
  const [showDeptTutorial, setShowDeptTutorial] = useState(null);
  const [tutorialDone, setTutorialDone] = useState(() => {
    try { return localStorage.getItem("ms_tutorialDone") === "true"; }
    catch { return false; }
  });
  const [showTourMenu, setShowTourMenu] = useState(false);
  const isTutorial = game.cd?.id === "tutorial";

  const handleOnboardingComplete = useCallback((action) => {
    try {
      localStorage.setItem("ms_onboardingDone", "true");
      if (action === "skip") {
        localStorage.setItem("ms_tutorialDone", "true");
        setTutorialDone(true);
      }
    } catch { /* ignore */ }
    setShowOnboarding(false);
    if (action === "start") {
      settings.setLearningMode(true);
      startGameWrapped("tutorial");
    }
  }, [settings, startGameWrapped]);

  const handleTutorialSkip = (tipKey) => {
    setTutorialSeenTips(prev => new Set([...prev, tipKey]));
  };

  const handleTutorialComplete = () => {
    if (!tutorialDone) {
      setTutorialDone(true);
      try { localStorage.setItem("ms_tutorialDone", "true"); } catch { /* ignore */ }
    }
    setShowTourMenu(true);
  };

  const handleTourComplete = () => {
    setShowTourMenu(false);
  };

  const checkDeptTutorial = useCallback((dept) => {
    if (dept !== "outpatient" && dept !== "stationary" && dept !== "admission") return;
    if (!settings.seenTutorial[dept]) {
      setShowDeptTutorial(dept);
      settings.markSeenTutorial(dept);
    }
  }, [settings.seenTutorial, settings.markSeenTutorial]);

  const forceShowDeptTutorial = useCallback((dept) => {
    if (dept !== "outpatient" && dept !== "stationary" && dept !== "admission") return;
    setShowDeptTutorial(dept);
    settings.markSeenTutorial(dept);
  }, [settings.markSeenTutorial]);

  const restartTutorial = useCallback(() => {
    setTutorialSeenTips(new Set());
    settings.setLearningMode(true);
    startGameWrapped("tutorial");
  }, [startGameWrapped, settings]);

  const showTutorialTips = useCallback(() => {
    setTutorialSeenTips(new Set());
    settings.resetSeenTutorial();
    settings.setLearningMode(true);
  }, [settings]);

  useEffect(() => {
    if (isTutorial && game.phase === "result" && !tutorialDone) {
      handleTutorialComplete();
    }
  }, [isTutorial, game.phase, tutorialDone]);

  const themeValue = settings.theme === "light" ? LIGHT : DARK;

  const content = (() => {
    if (game.phase === "menu") return (<>
      <MenuScreen
        startGame={startGameWrapped}
        setPhase={game.setPhase}
        totalScore={settings.totalScore}
        casesPlayed={settings.casesPlayed}
        searchQuery={settings.searchQuery} setSearchQuery={settings.setSearchQuery}
        department={settings.department} setDepartment={settings.setDepartment}
        specFilter={settings.specFilter} setSpecFilter={settings.setSpecFilter}
        showAllCases={settings.showAllCases} setShowAllCases={settings.setShowAllCases}
        showNotif={settings.showNotif} setShowNotif={settings.setShowNotif}
        showSettings={settings.showSettings} setShowSettings={settings.setShowSettings}
        difficulty={settings.difficulty} setDifficulty={settings.setDifficulty}
        gameMode={settings.gameMode} setGameMode={settings.setGameMode}
        theme={settings.theme} setTheme={settings.setTheme}
        learningMode={settings.learningMode} setLearningMode={settings.setLearningMode}
        assessmentMode={settings.assessmentMode} setAssessmentMode={settings.setAssessmentMode}
        progressionMode={settings.progressionMode} setProgressionMode={settings.setProgressionMode}
        audioEnabled={settings.audioEnabled} setAudioEnabled={settings.setAudioEnabled}
        hideWarnings={settings.hideWarnings} setHideWarnings={settings.setHideWarnings}
        sessionHistory={settings.sessionHistory}
        isDevMode={IS_DEV_MODE}
        checkDeptTutorial={checkDeptTutorial}
        forceShowDeptTutorial={forceShowDeptTutorial}
        restartTutorial={restartTutorial}
        showTutorialTips={showTutorialTips}
      />
      {showTourMenu && <TutorialGuide phase={game.phase} seenTips={tutorialSeenTips} onSkip={handleTutorialSkip} showTourMenu onTourComplete={handleTourComplete} />}
    </>);
    if (game.phase === "teacher_dashboard") return (
      <TeacherDashboardScreen setPhase={game.setPhase} />
    );
    if (game.phase === "theory") return (
      <TheoryScreen setPhase={game.setPhase} startGame={startGameWrapped}
        progress={progress} progressionMode={settings.progressionMode} setProgressionMode={settings.setProgressionMode}
        progressionChosen={settings.progressionChosen} setProgressionChosen={settings.setProgressionChosen} />
    );
    if (game.phase === "leaderboard") return (
      <LeaderboardScreen setPhase={game.setPhase} sessionHistory={settings.sessionHistory} />
    );
    if (game.phase === "certificates") return (
      <CertificateScreen setPhase={game.setPhase} sessionHistory={settings.sessionHistory} />
    );
    if (game.phase === "map") return (
      <CourseMapScreen setPhase={game.setPhase} progress={progress} />
    );
    if (game.phase === "result" && game.result && game.cd) return (
      <ResultScreen
        result={game.result} cd={game.cd} ps={game.ps}
        orderedDiag={game.orderedDiag} selTreat={game.selTreat} diagText={game.diagText}
        eventLog={game.eventLog} extraResult={extraResult}
        setPhase={game.setPhase} startGame={startGameWrapped}
        assessmentMode={settings.assessmentMode}
        curriculum={progress.curriculum} advanceCurriculum={progress.advanceCurriculum}
        getNextCurriculumCase={progress.getNextCurriculumCase} clearCurriculum={progress.clearCurriculum}
        getNextCurriculumTopic={progress.getNextCurriculumTopic}
        tutorialMode={isTutorial}
        elapsedSec={game.totalTime - game.timeLeft}
        revealedAnamnesis={game.revealedAnamnesis}
      />
    );
    if (!game.cd || !game.ps) return null;
    const gameScreen = (
      <GameScreen
        phase={game.phase} setPhase={game.setPhase}
        cd={game.cd} ps={game.ps} prevPs={game.prevPs}
        selDiag={game.selDiag} setSelDiag={game.setSelDiag}
        selTreat={game.selTreat} toggleTreatment={game.toggleTreatment}
        orderedDiag={game.orderedDiag}
        revealedResults={game.revealedResults} newResultIds={game.newResultIds}
        diagText={game.diagText} setDiagText={game.setDiagText}
        diagCat={game.diagCat} setDiagCat={game.setDiagCat}
        treatCat={game.treatCat} setTreatCat={game.setTreatCat}
        appliedFx={game.appliedFx} pendingFx={game.pendingFx}
        timeLeft={game.timeLeft} totalTime={game.totalTime}
        eventLog={game.eventLog}
        handleOrderTests={game.handleOrderTests} handleSubmit={game.handleSubmit}
        processingTests={game.processingTests} allResultsReady={game.allResultsReady}
        gameMode={settings.gameMode}
        learningMode={settings.learningMode} assessmentMode={settings.assessmentMode}
        paused={game.paused} setPaused={game.setPaused}
        selectedRoute={game.selectedRoute} setSelectedRoute={game.setSelectedRoute}
        revealedAnamnesis={game.revealedAnamnesis} setRevealedAnamnesis={game.setRevealedAnamnesis}
        setExtraResult={setExtraResult}
        curriculum={progress.curriculum} getNextCurriculumCase={progress.getNextCurriculumCase}
        topicsProgress={progress.topicsProgress}
        audioEnabled={settings.audioEnabled} setAudioEnabled={settings.setAudioEnabled}
      />
    );
    return (<>
      {gameScreen}
      {isTutorial && <TutorialGuide phase={game.phase} seenTips={tutorialSeenTips} onSkip={handleTutorialSkip} />}
      {showDeptTutorial && <DepartmentTutorial dept={showDeptTutorial} onClose={() => setShowDeptTutorial(null)} />}
    </>);
  })();

  return (
    <ErrorBoundary>
      <ThemeCtx.Provider value={themeValue}>
        {IS_DEV_MODE && (
          <div style={{position:"fixed",top:0,left:0,right:0,zIndex:99999,paddingTop:"env(safe-area-inset-top)",background:"linear-gradient(90deg,#ff3d5a,#f57c42)",textAlign:"center",paddingBottom:4,paddingLeft:0,paddingRight:0,fontSize:11,fontWeight:700,color:"#fff",fontFamily:"'Inter',sans-serif",letterSpacing:1}}>
            🔧 РЕЖИМ РАЗРАБОТЧИКА — Весь контент открыт
          </div>
        )}
        <div style={IS_DEV_MODE ? {marginTop:26} : undefined}>
          {showOnboarding ? <OnboardingScreen onComplete={handleOnboardingComplete} /> : content}
        </div>
      </ThemeCtx.Provider>
    </ErrorBoundary>
  );
}
