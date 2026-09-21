import { useState, useRef, useCallback } from "react";
import { CASES } from "../data/cases";
import scormService from "../services/scormService";
import { initPS } from "../engine/patient";
import useTreatmentManager from "./useTreatmentManager";
import { useSessionTimers } from "./gameSession/useSessionTimers";
import { useDiagnosticOrders } from "./gameSession/useDiagnosticOrders";
import { finalizeSession } from "./gameSession/sessionScorer";
import { selectCase, computeCaseDuration, buildInitialTrajectory, formatElapsed } from "./gameSession/sessionInit";

export default function useGameSession({
  difficulty,
  gameMode,
  learningMode,
  setTotalScore,
  setCasesPlayed,
  setSessionHistory,
}) {
  const [phase, setPhase] = useState("menu");
  const [cd, setCd] = useState(null);
  const [usedIds, setUsedIds] = useState([]);
  const [ps, setPs] = useState(null);
  const [prevPs, setPrevPs] = useState(null);
  const [eventLog, setEventLog] = useState([]);
  const [trajectory, setTrajectory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [diagText, setDiagText] = useState("");
  const [diagCat, setDiagCat] = useState("all");
  const [treatCat, setTreatCat] = useState("all");
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [result, setResult] = useState(null);
  const [paused, setPaused] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [revealedAnamnesis, setRevealedAnamnesis] = useState(new Set());

  const timerRef = useRef(null);
  const detRef = useRef(null);
  const fxTimersRef = useRef([]);
  const stateRef = useRef({});

  const addEvent = useCallback((text, type = "info") => {
    const timeStr = formatElapsed(stateRef.current.totalTime, stateRef.current.timeLeft);
    setEventLog((prev) => [{ id: Date.now() + Math.random(), text, type, elapsed: timeStr }, ...prev.slice(0, 29)]);
  }, []);

  const treatment = useTreatmentManager({ addEvent, setPs, stateRef, fxTimersRef });
  const diagnostics = useDiagnosticOrders({ stateRef, setPhase, addEvent });

  stateRef.current = {
    timeLeft,
    totalTime,
    ps,
    cd,
    selTreat: treatment.selTreat,
    orderedDiag: diagnostics.orderedDiag,
    diagText,
    appliedFx: treatment.appliedFx,
    difficulty,
    gameMode,
    usedIds,
    paused,
    learningMode,
    selectedRoute,
    revealedAnamnesis,
  };

  const handleSubmit = useCallback(
    (timeout = false, died = false) => {
      clearInterval(timerRef.current);
      clearInterval(detRef.current);
      fxTimersRef.current.forEach((t) => clearTimeout(t));

      finalizeSession({
        state: stateRef.current,
        timeout,
        died,
        selectedRoute,
        setResult,
        setPs,
        setTotalScore,
        setCasesPlayed,
        setSessionHistory,
        setPhase,
      });
    },
    [setTotalScore, setCasesPlayed, setSessionHistory, selectedRoute]
  );

  useSessionTimers({
    stateRef,
    phase,
    paused,
    gameOver,
    setPs,
    setPrevPs,
    setGameOver,
    setTimeLeft,
    addEvent,
    onSubmit: handleSubmit,
    timerRef,
    detRef,
    fxTimersRef,
  });

  const startGame = useCallback(
    (caseId) => {
      clearInterval(timerRef.current);
      clearInterval(detRef.current);
      fxTimersRef.current.forEach((t) => clearTimeout(t));
      fxTimersRef.current = [];

      const { difficulty: diff, gameMode: mode, usedIds: prevIds } = stateRef.current;
      const chosen = selectCase(caseId, mode, prevIds);

      setCd(chosen);
      setUsedIds((prev) => (prev.length >= CASES.length ? [chosen.id] : [...prev, chosen.id]));
      const initialPS = initPS(chosen);
      setPs(initialPS);
      setPrevPs(initialPS);
      setGameOver(false);
      treatment.setAppliedFx(new Set());
      treatment.setPendingFx(new Set());
      setEventLog([{ id: 1, text: "Пациент поступил в приёмное отделение", type: "info", elapsed: "0:00" }]);
      setTrajectory(buildInitialTrajectory(initialPS));

      diagnostics.resetDiagnostics();
      treatment.setSelTreat([]);
      setDiagText("");
      setDiagCat("all");
      setTreatCat("all");
      setResult(null);
      setSelectedRoute(null);
      setRevealedAnamnesis(new Set());

      const t = computeCaseDuration(chosen.timeLimit, diff, mode);
      setTotalTime(t);
      setTimeLeft(t);

      if (scormService.isConnected()) {
        scormService.startTime = Date.now();
        scormService.setStatus("incomplete");
        scormService.commit();
      }

      setPhase("order_tests");
    },
    [diagnostics, treatment]
  );

  const recordTrajectoryCheckpoint = useCallback((checkpointData) => {
    const timeStr = formatElapsed(stateRef.current.totalTime, stateRef.current.timeLeft);
    setTrajectory((prev) => [...prev, { ...checkpointData, elapsed: timeStr, timestamp: Date.now() }]);
  }, []);

  return {
    phase,
    setPhase,
    cd,
    ps,
    prevPs,
    eventLog,
    gameOver,
    trajectory,
    setTrajectory,
    recordTrajectoryCheckpoint,
    appliedFx: treatment.appliedFx,
    pendingFx: treatment.pendingFx,
    selDiag: diagnostics.selDiag,
    setSelDiag: diagnostics.setSelDiag,
    orderedDiag: diagnostics.orderedDiag,
    revealedResults: diagnostics.revealedResults,
    newResultIds: diagnostics.newResultIds,
    selTreat: treatment.selTreat,
    toggleTreatment: treatment.toggleTreatment,
    diagText,
    setDiagText,
    diagCat,
    setDiagCat,
    treatCat,
    setTreatCat,
    timeLeft,
    totalTime,
    paused,
    setPaused,
    learningMode,
    selectedRoute,
    setSelectedRoute,
    revealedAnamnesis,
    setRevealedAnamnesis,
    processingTests: diagnostics.processingTests,
    result,
    allResultsReady: diagnostics.allResultsReady,
    addEvent,
    startGame,
    handleSubmit,
    handleOrderTests: diagnostics.handleOrderTests,
  };
}
