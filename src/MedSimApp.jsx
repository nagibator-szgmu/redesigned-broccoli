import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { ThemeCtx } from "./ui/ThemeContext";
import { DARK, LIGHT } from "./ui/theme";
import useSettings from "./hooks/useSettings";
import useGameSession from "./hooks/useGameSession";
import useProgress from "./hooks/useProgress";
import useCommandPalette from "./hooks/useCommandPalette";
import { TOPICS } from "./data/topics";
import { DepartmentTutorial } from "./components/game";
import CommandPalette from "./components/CommandPalette";
import useGameAudio from "./hooks/useGameAudio";
import { IS_DEV_MODE } from "./config";
import ScreenFallback from "./components/ui/ScreenFallback";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import useTutorialLifecycle from "./hooks/useTutorialLifecycle";
import AppContentRouter from "./components/routing/AppContentRouter";

const DevInspector = lazy(() => import("./ui/inspector/DevInspector"));

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
  const cmdPalette = useCommandPalette();
  useGameAudio(game.phase, game.paused, game.cd?.department, game.ps, settings.audioEnabled);

  const origStartGame = game.startGame;
  const startGameWrapped = useCallback(
    (...args) => {
      setExtraResult(null);
      return origStartGame(...args);
    },
    [origStartGame]
  );

  const tutorial = useTutorialLifecycle({ settings, game, startGameWrapped });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__START_CASE__ = startGameWrapped;
      window.__SET_PHASE__ = game.setPhase;
    }
  }, [startGameWrapped, game.setPhase]);

  useEffect(() => {
    if (game.phase !== "result" || !game.cd) return;
    const topic = TOPICS.flatMap((c) => c.children).find((t) => t.cases.includes(game.cd.id));
    if (topic) progress.completeCase(topic.id, game.cd.id);
  }, [game.phase, game.cd?.id, progress]);

  const themeValue = settings.theme === "light" ? LIGHT : DARK;

  return (
    <ErrorBoundary>
      <ThemeCtx.Provider value={themeValue}>
        {IS_DEV_MODE && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 99999,
              paddingTop: "env(safe-area-inset-top)",
              background: "linear-gradient(90deg,#ff3d5a,#f57c42)",
              textAlign: "center",
              paddingBottom: 4,
              paddingLeft: 0,
              paddingRight: 0,
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'Inter',sans-serif",
              letterSpacing: 1,
            }}
          >
            🔧 РЕЖИМ РАЗРАБОТЧИКА — Весь контент открыт
          </div>
        )}
        <div
          style={{
            height: IS_DEV_MODE ? "calc(100vh - 26px)" : "100vh",
            marginTop: IS_DEV_MODE ? 26 : 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Suspense fallback={<ScreenFallback />}>
            <AppContentRouter
              game={game}
              settings={settings}
              progress={progress}
              tutorial={tutorial}
              startGameWrapped={startGameWrapped}
              extraResult={extraResult}
              setExtraResult={setExtraResult}
            />
          </Suspense>

          {tutorial.showDeptTutorial && (
            <DepartmentTutorial
              dept={tutorial.showDeptTutorial}
              onClose={() => tutorial.setShowDeptTutorial(null)}
            />
          )}

          <CommandPalette
            isOpen={cmdPalette.isOpen}
            onClose={() => cmdPalette.setIsOpen(false)}
            phase={game.phase}
            setPhase={game.setPhase}
            cd={game.cd}
            selTreat={game.selTreat}
            toggleTreatment={game.toggleTreatment}
            orderedDiag={game.orderedDiag}
            handleOrderTests={game.handleOrderTests}
          />

          {(import.meta.env.DEV || IS_DEV_MODE) && (
            <Suspense fallback={null}>
              <DevInspector />
            </Suspense>
          )}
        </div>
      </ThemeCtx.Provider>
    </ErrorBoundary>
  );
}
