import { useState, useEffect, useCallback } from "react";

export default function useTutorialLifecycle({ settings, game, startGameWrapped }) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tutorialSeenTips, setTutorialSeenTips] = useState(new Set());
  const [showDeptTutorial, setShowDeptTutorial] = useState(null);
  const [tutorialDone, setTutorialDone] = useState(true);
  const [showTourMenu, setShowTourMenu] = useState(false);

  const isTutorial = game.cd?.id === "tutorial";

  const handleOnboardingComplete = useCallback(
    (action) => {
      try {
        localStorage.setItem("ms_onboardingDone", "true");
        if (action === "skip") {
          localStorage.setItem("ms_tutorialDone", "true");
          setTutorialDone(true);
        }
      } catch {
        /* ignore */
      }
      setShowOnboarding(false);
      if (action === "start") {
        settings.setLearningMode(true);
        startGameWrapped("tutorial");
      }
    },
    [settings, startGameWrapped]
  );

  const handleTutorialSkip = useCallback((tipKey) => {
    setTutorialSeenTips((prev) => new Set([...prev, tipKey]));
  }, []);

  const handleTutorialComplete = useCallback(() => {
    if (!tutorialDone) {
      setTutorialDone(true);
      try {
        localStorage.setItem("ms_tutorialDone", "true");
      } catch {
        /* ignore */
      }
    }
    setShowTourMenu(true);
  }, [tutorialDone]);

  const handleTourComplete = useCallback(() => {
    setShowTourMenu(false);
  }, []);

  const checkDeptTutorial = useCallback(
    (dept) => {
      if (dept !== "outpatient" && dept !== "stationary" && dept !== "admission") return;
      if (!settings.seenTutorial[dept]) {
        setShowDeptTutorial(dept);
        settings.markSeenTutorial(dept);
      }
    },
    [settings]
  );

  const forceShowDeptTutorial = useCallback(
    (dept) => {
      if (dept !== "outpatient" && dept !== "stationary" && dept !== "admission") return;
      setShowDeptTutorial(dept);
      settings.markSeenTutorial(dept);
    },
    [settings]
  );

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
  }, [isTutorial, game.phase, tutorialDone, handleTutorialComplete]);

  return {
    showOnboarding,
    setShowOnboarding,
    tutorialSeenTips,
    showDeptTutorial,
    setShowDeptTutorial,
    tutorialDone,
    showTourMenu,
    isTutorial,
    handleOnboardingComplete,
    handleTutorialSkip,
    handleTutorialComplete,
    handleTourComplete,
    checkDeptTutorial,
    forceShowDeptTutorial,
    restartTutorial,
    showTutorialTips,
  };
}
