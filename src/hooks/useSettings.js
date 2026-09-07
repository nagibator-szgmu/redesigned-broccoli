import { useState, useEffect, useCallback } from "react";
import scormService from "../services/scormService";

function loadNum(key, fallback) {
  try { return parseInt(localStorage.getItem(key) || String(fallback)); }
  catch { return fallback; }
}
function loadStr(key, fallback) { return localStorage.getItem(key) || fallback; }
function loadArr(key) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); }
  catch { return []; }
}
function loadObj(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "null") || fallback; }
  catch { return fallback; }
}

export default function useSettings() {
  const [difficulty, setDifficulty] = useState(() => loadStr("ms_difficulty", "normal"));
  const [theme, setTheme] = useState(() => loadStr("ms_theme", "dark"));
  const [gameMode, setGameMode] = useState(() => loadStr("ms_gameMode", "normal"));
  const [totalScore, setTotalScore] = useState(() => loadNum("ms_totalScore", 0));
  const [casesPlayed, setCasesPlayed] = useState(() => loadNum("ms_casesPlayed", 0));
  const [sessionHistory, setSessionHistory] = useState(() => loadArr("ms_history"));
  const [department, setDepartment] = useState(() => {
    const d = loadStr("ms_department", "all");
    return d === "emergency" ? "all" : d;
  });
  const [learningMode, setLearningMode] = useState(() => loadStr("ms_learningMode", "false") === "true");
  const [assessmentMode, setAssessmentMode] = useState(() => loadStr("ms_assessmentMode", "false") === "true");
  const [progressionMode, setProgressionMode] = useState(() => loadStr("ms_progressionMode", "free"));
  const [progressionChosen, setProgressionChosen] = useState(() => {
    try { return localStorage.getItem("ms_progressionChosen") === "true"; }
    catch { return false; }
  });
  const [audioEnabled, setAudioEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem("ms_audioEnabled");
      return saved === null ? true : saved === "true";
    } catch { return true; }
  });
  const [hideWarnings, setHideWarnings] = useState(() => {
    try {
      const saved = localStorage.getItem("ms_hideWarnings");
      return saved === "true";
    } catch { return false; }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [specFilter, setSpecFilter] = useState(null);
  const [showAllCases, setShowAllCases] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [seenTutorial, setSeenTutorial] = useState(() => loadObj("ms_seenTutorial", { outpatient: false, admission: false, stationary: false }));

  const markSeenTutorial = useCallback((dept) => {
    setSeenTutorial(prev => {
      const next = { ...prev, [dept]: true };
      try { localStorage.setItem("ms_seenTutorial", JSON.stringify(next)); }
      catch { /* ignore */ }
      return next;
    });
  }, []);

  const resetSeenTutorial = useCallback(() => {
    setSeenTutorial({ outpatient: false, admission: false, stationary: false });
    try { localStorage.removeItem("ms_seenTutorial"); } catch { /* ignore */ }
  }, []);

  // Инициализация SCORM сессии при первом запуске
  useEffect(() => {
    const scormConnected = scormService.initialize();
    if (scormConnected) {
      const savedData = scormService.loadSuspendData();
      if (savedData) {
        if (savedData.totalScore !== undefined) setTotalScore(savedData.totalScore);
        if (savedData.casesPlayed !== undefined) setCasesPlayed(savedData.casesPlayed);
        if (savedData.sessionHistory !== undefined) setSessionHistory(savedData.sessionHistory);
        if (savedData.difficulty !== undefined) setDifficulty(savedData.difficulty);
      }
    }

    const handleUnload = () => {
      if (scormService.isConnected()) {
        scormService.terminate();
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  // Синхронизация suspend_data при изменении прогресса
  useEffect(() => {
    if (scormService.isConnected()) {
      scormService.saveSuspendData({
        totalScore,
        casesPlayed,
        sessionHistory,
        difficulty
      });
      scormService.commit();
    }
  }, [totalScore, casesPlayed, sessionHistory, difficulty]);

  useEffect(() => { document.body.setAttribute("data-theme", theme); }, [theme]);
  useEffect(() => { localStorage.setItem("ms_totalScore", totalScore); }, [totalScore]);
  useEffect(() => { localStorage.setItem("ms_casesPlayed", casesPlayed); }, [casesPlayed]);
  useEffect(() => { localStorage.setItem("ms_history", JSON.stringify(sessionHistory)); }, [sessionHistory]);
  useEffect(() => { localStorage.setItem("ms_difficulty", difficulty); }, [difficulty]);
  useEffect(() => { localStorage.setItem("ms_theme", theme); }, [theme]);
  useEffect(() => { localStorage.setItem("ms_gameMode", gameMode); }, [gameMode]);
  useEffect(() => { localStorage.setItem("ms_department", department); }, [department]);
  useEffect(() => { localStorage.setItem("ms_learningMode", String(learningMode)); }, [learningMode]);
  useEffect(() => { localStorage.setItem("ms_assessmentMode", String(assessmentMode)); }, [assessmentMode]);
  useEffect(() => { localStorage.setItem("ms_progressionMode", progressionMode); }, [progressionMode]);
  useEffect(() => { localStorage.setItem("ms_progressionChosen", String(progressionChosen)); }, [progressionChosen]);
  useEffect(() => { localStorage.setItem("ms_audioEnabled", String(audioEnabled)); }, [audioEnabled]);
  useEffect(() => { localStorage.setItem("ms_hideWarnings", String(hideWarnings)); }, [hideWarnings]);

  return {
    difficulty, setDifficulty,
    theme, setTheme,
    gameMode, setGameMode,
    department, setDepartment,
    learningMode, setLearningMode,
    assessmentMode, setAssessmentMode,
    progressionMode, setProgressionMode,
    progressionChosen, setProgressionChosen,
    audioEnabled, setAudioEnabled,
    hideWarnings, setHideWarnings,
    totalScore, setTotalScore,
    casesPlayed, setCasesPlayed,
    sessionHistory, setSessionHistory,
    searchQuery, setSearchQuery,
    specFilter, setSpecFilter,
    showAllCases, setShowAllCases,
    showNotif, setShowNotif,
    showSettings, setShowSettings,
    seenTutorial, markSeenTutorial, resetSeenTutorial,
  };
}
