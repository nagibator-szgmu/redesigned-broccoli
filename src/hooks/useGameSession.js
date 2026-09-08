import { useState, useEffect, useRef, useCallback } from "react";
import { CASES } from "../data/cases";
import scormService from "../services/scormService";
import { TREAT_FX } from "../data/treatments";
import { initPS, computeOutcome } from "../engine/patient";
import { computeScore, diagMatchRatio } from "../engine/scoring";
import { tickDeterioration, applyContinuousEffects, resolveStatus, applyUnfinishedTreatments } from "../engine/deterioration";
import useTreatmentManager from "./useTreatmentManager";
import { analyzeCognitiveErrors } from "../engine/cognitiveAnalyzer";
import { evaluateDiagnosisWithAI } from "../engine/aiEvaluator";
import { calculateMap } from "../engine/reassessmentEngine";
import { deriveProblemList } from "../engine/problemListEngine";

export default function useGameSession({ difficulty, gameMode, learningMode, setTotalScore, setCasesPlayed, setSessionHistory }) {
  const [phase, setPhase] = useState("menu");
  const [cd, setCd] = useState(null);
  const [usedIds, setUsedIds] = useState([]);
  const [ps, setPs] = useState(null);
  const [prevPs, setPrevPs] = useState(null);
  const [eventLog, setEventLog] = useState([]);
  const [trajectory, setTrajectory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [selDiag, setSelDiag] = useState([]);
  const [orderedDiag, setOrderedDiag] = useState([]);
  const [revealedResults, setRevealedResults] = useState({});
  const [newResultIds, setNewResultIds] = useState([]);
  const [diagText, setDiagText] = useState("");
  const [diagCat, setDiagCat] = useState("all");
  const [treatCat, setTreatCat] = useState("all");
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [processingTests, setProcessingTests] = useState(false);
  const [result, setResult] = useState(null);
  const [paused, setPaused] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [revealedAnamnesis, setRevealedAnamnesis] = useState(new Set());

  const timerRef = useRef(null);
  const detRef = useRef(null);
  const fxTimersRef = useRef([]);
  const stateRef = useRef({});
  const submitRef = useRef(null);

  const addEvent = useCallback((text, type = "info") => {
    const { totalTime: tt, timeLeft: tl } = stateRef.current;
    const elapsed = tt - tl;
    const mm = Math.floor(elapsed / 60), ss = elapsed % 60;
    const timeStr = `${mm}:${String(ss).padStart(2, "0")}`;
    setEventLog(prev => [{ id: Date.now() + Math.random(), text, type, elapsed: timeStr }, ...prev.slice(0, 29)]);
  }, []);

  const treatment = useTreatmentManager({ addEvent, setPs, stateRef, fxTimersRef });

  stateRef.current = { timeLeft, totalTime, ps, cd, selTreat: treatment.selTreat, orderedDiag, diagText, appliedFx: treatment.appliedFx, difficulty, gameMode, usedIds, paused, learningMode, selectedRoute, revealedAnamnesis };

  const startGame = useCallback((caseId) => {
    clearInterval(timerRef.current);
    clearInterval(detRef.current);
    fxTimersRef.current.forEach(t => clearTimeout(t));
    fxTimersRef.current = [];
    const { difficulty: diff, gameMode: mode, usedIds: prevIds } = stateRef.current;
    const pool = prevIds.length >= CASES.length ? CASES : CASES.filter(c => !prevIds.includes(c.id));
    let chosen;
    if (caseId != null && (typeof caseId === "string" || typeof caseId === "number")) {
      chosen = CASES.find(c => String(c.id) === String(caseId)) || pool[Math.floor(Math.random() * pool.length)];
    } else if (mode === "random") {
      chosen = CASES[Math.floor(Math.random() * CASES.length)];
    } else {
      chosen = pool[Math.floor(Math.random() * pool.length)];
    }

    setCd(chosen);
    setUsedIds(prev => prev.length >= CASES.length ? [chosen.id] : [...prev, chosen.id]);
    const initialPS = initPS(chosen);
    setPs(initialPS);
    setPrevPs(initialPS);
    setGameOver(false);
    treatment.setAppliedFx(new Set());
    treatment.setPendingFx(new Set());
    setEventLog([{ id: 1, text: "Пациент поступил в приёмное отделение", type: "info", elapsed: "0:00" }]);
    setTrajectory([{
      checkpointId: "INITIAL",
      iteration: 0,
      timestamp: Date.now(),
      elapsed: "0:00",
      vitals: { ...initialPS },
      map: calculateMap(initialPS.sbp, initialPS.dbp),
      overallResponse: "neutral",
      summaryText: "Пациент поступил: мониторинг запущен",
      trend: "stable",
      activeProblems: deriveProblemList(initialPS),
      recentInterventions: []
    }]);
    setSelDiag([]); setOrderedDiag([]); setRevealedResults({}); setNewResultIds([]);
    treatment.setSelTreat([]); setDiagText(""); setDiagCat("all"); setTreatCat("all"); setResult(null);
    setSelectedRoute(null); setRevealedAnamnesis(new Set());
    const diffMult = { easy: 1.5, normal: 1, hard: 0.7 }[diff] || 1;
    const modeMult = mode === "stress" ? 0.5 : 1;
    const t = Math.round(chosen.timeLimit * 60 * diffMult * modeMult);
    setTotalTime(t); setTimeLeft(t);

    if (scormService.isConnected()) {
      scormService.startTime = Date.now();
      scormService.setStatus("incomplete");
      scormService.commit();
    }

    setPhase("order_tests");
  }, []);

  const handleSubmit = useCallback((timeout = false, died = false) => {
    clearInterval(timerRef.current);
    clearInterval(detRef.current);
    fxTimersRef.current.forEach(t => clearTimeout(t));
    const s = stateRef.current;
    if (!s.cd) return;
    const finalPS = applyUnfinishedTreatments(s.ps || initPS(s.cd), s.cd, s.selTreat, s.appliedFx);
    if (s.ps?.status === "dead") finalPS.status = "dead";
    let outcome;
    if (s.cd.department === "admission") {
      if (selectedRoute) {
        outcome = "routed";
      } else if (timeout) {
        outcome = "timeout_no_route";
      } else {
        outcome = computeOutcome(finalPS, s.cd, s.cd.department);
      }
    } else {
      outcome = computeOutcome(finalPS, s.cd, s.cd.department);
    }
    finalPS.status = outcome === "dead" ? "dead" : outcome === "stable" || outcome === "stabilized" ? "stable" : finalPS.status;
    const elapsedSec = s.totalTime - s.timeLeft;
    const res = computeScore(s.cd, s.orderedDiag, s.selTreat, s.diagText, finalPS, elapsedSec, s.revealedAnamnesis);
    const cogAnalysis = analyzeCognitiveErrors(s.cd, s.orderedDiag, s.selTreat, s.diagText, finalPS, elapsedSec);

    setResult({ ...res, timeout, died, outcome, selectedRoute, routeOptions: s.cd.routeOptions, correctRoute: s.cd.correctRoute, cogAnalysis });
    setPs(finalPS);
    setTotalScore(prev => prev + res.score);
    setCasesPlayed(prev => prev + 1);
    setSessionHistory(prev => [{
      id: Date.now(), caseId: s.cd.id, caseName: s.cd.name, category: s.cd.category,
      diagnosis: s.cd.diagnosis, score: res.score, gradeId: res.gradeId,
      date: new Date().toISOString(), difficulty: s.difficulty, gameMode: s.gameMode, timeout, died,
      cogAnalysis,
    }, ...prev].slice(0, 50));

    // LMS SCORM Integration
    if (scormService.isConnected()) {
      const passThreshold = scormService.getMasteryScore() || 70;
      const isPassed = !died && res.score >= passThreshold && res.gradeId !== "unsatisfactory" && outcome !== "timeout_no_route";
      const scormStatus = isPassed ? "passed" : "failed";

      scormService.setScore(res.score);
      scormService.setStatus(scormStatus);
      scormService.setSessionTime(elapsedSec);
      scormService.commit();
    }

    // Асинхронное оценивание диагноза с помощью ИИ
    evaluateDiagnosisWithAI(s.cd, s.diagText, s.orderedDiag, s.selTreat).then(aiRes => {
      if (aiRes.success) {
        setResult(prev => {
          if (!prev) return prev;
          const localRatio = diagMatchRatio(s.cd.diagnosis, s.diagText);
          const localDiagScore = localRatio >= 0.6 ? 35 : localRatio >= 0.3 ? 20 : localRatio > 0 ? 10 : 0;
          
          let newScore = prev.score - localDiagScore + aiRes.diagScore;
          newScore = Math.min(100, Math.max(0, newScore));
          const newGradeId = newScore >= 85 ? "excellent" : newScore >= 70 ? "good" : newScore >= 50 ? "satisfactory" : "unsatisfactory";
          
          // Обновляем общий прогресс
          setTotalScore(total => total - prev.score + newScore);
          
          // Обновляем историю сессий
          setSessionHistory(history => {
            const copy = [...history];
            if (copy.length > 0) {
              copy[0] = {
                ...copy[0],
                score: newScore,
                gradeId: newGradeId,
                aiEvaluated: true,
                aiFeedback: aiRes.feedback,
                aiErrors: aiRes.errors
              };
            }
            return copy;
          });

          // Обновляем SCORM
          if (scormService.isConnected()) {
            const passThreshold = scormService.getMasteryScore() || 70;
            const isPassed = !died && newScore >= passThreshold && newGradeId !== "unsatisfactory" && outcome !== "timeout_no_route";
            scormService.setScore(newScore);
            scormService.setStatus(isPassed ? "passed" : "failed");
            scormService.commit();
          }

          return {
            ...prev,
            score: newScore,
            gradeId: newGradeId,
            aiEvaluated: true,
            aiFeedback: aiRes.feedback,
            aiErrors: aiRes.errors,
            aiDiagScore: aiRes.diagScore,
            localDiagScore
          };
        });
      }
    });

    setPhase("result");
  }, [setTotalScore, setCasesPlayed, setSessionHistory, selectedRoute]);

  submitRef.current = handleSubmit;

  useEffect(() => {
    if (stateRef.current.cd?.department !== "outpatient" && (phase === "order_tests" || phase === "awaiting_results" || phase === "diagnose") && !stateRef.current.paused) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        if (stateRef.current.paused) return;
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); submitRef.current?.(true); return 0; }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [phase, paused]);

  useEffect(() => {
    if (stateRef.current.cd?.department === "outpatient" || !stateRef.current.cd || phase === "menu" || phase === "result" || gameOver || stateRef.current.paused) {
      clearInterval(detRef.current);
      return;
    }
    const interval = gameMode === "stress" ? 15000 : 30000;
    const startDet = () => {
      clearInterval(detRef.current);
      detRef.current = setInterval(() => {
        if (stateRef.current.paused) return;
        setPs(prev => {
          if (!prev || prev.status === "dead") return prev;
          setPrevPs({ ...prev });
          let next = tickDeterioration(prev, stateRef.current.cd, stateRef.current.difficulty, stateRef.current.gameMode);
          next = applyContinuousEffects(next, stateRef.current.selTreat.filter(id => TREAT_FX[id]?.continuous));
          next = resolveStatus(next, stateRef.current.cd);
          return next;
        });
      }, interval);
    };
    startDet();
    const onVisibility = () => {
      if (document.hidden) clearInterval(detRef.current);
      else if (!stateRef.current.paused) startDet();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(detRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [cd, phase, gameOver, gameMode, paused]);

  useEffect(() => {
    if (!ps || ps.status !== "dead" || gameOver) return;
    setGameOver(true);
    clearInterval(timerRef.current);
    clearInterval(detRef.current);
    fxTimersRef.current.forEach(t => clearTimeout(t));
    addEvent("💀 ПАЦИЕНТ ПОГИБ — лечение не было начато вовремя", "critical");
    setTimeout(() => submitRef.current?.(false, true), 2000);
  }, [ps?.status, gameOver, addEvent]);

  useEffect(() => {
    if (!ps || ps.status !== "critical") return;
    addEvent("⚠ Состояние критическое! Требуются немедленные действия", "warning");
  }, [ps?.status, addEvent]);

  const handleOrderTests = useCallback(async () => {
    if (selDiag.length === 0) return;
    setProcessingTests(true);
    setOrderedDiag(selDiag);
    setPhase("awaiting_results");
    addEvent(`Назначено ${selDiag.length} исследований`, "info");
    const ids = [...selDiag];
    const cCase = stateRef.current.cd;
    for (let i = 0; i < ids.length; i++) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
      const id = ids[i];
      const text = cCase.testResults[id] || `${id}: в пределах нормы.`;
      setRevealedResults(prev => ({ ...prev, [id]: text }));
      setNewResultIds(prev => [...prev, id]);
      const isCrit = text.startsWith("🔴");
      addEvent(`Результат: ${id}${isCrit ? " — КРИТИЧНО" : ""}`, isCrit ? "critical" : "result");
      setTimeout(() => setNewResultIds(prev => prev.filter(x => x !== id)), 2000);
    }
    setProcessingTests(false);
  }, [selDiag, addEvent]);

  const recordTrajectoryCheckpoint = useCallback((checkpointData) => {
    const { totalTime: tt, timeLeft: tl } = stateRef.current;
    const elapsed = tt - tl;
    const mm = Math.floor(elapsed / 60), ss = elapsed % 60;
    const timeStr = `${mm}:${String(ss).padStart(2, "0")}`;

    setTrajectory(prev => [
      ...prev,
      {
        ...checkpointData,
        elapsed: timeStr,
        timestamp: Date.now()
      }
    ]);
  }, []);

  const allResultsReady = orderedDiag.length > 0 && orderedDiag.every(id => revealedResults[id]);

  return {
    phase, setPhase,
    cd, ps, prevPs, eventLog, gameOver,
    trajectory, setTrajectory, recordTrajectoryCheckpoint,
    appliedFx: treatment.appliedFx, pendingFx: treatment.pendingFx,
    selDiag, setSelDiag,
    orderedDiag,
    revealedResults, newResultIds,
    selTreat: treatment.selTreat, toggleTreatment: treatment.toggleTreatment,
    diagText, setDiagText,
    diagCat, setDiagCat,
    treatCat, setTreatCat,
    timeLeft, totalTime,
    paused, setPaused, learningMode,
    selectedRoute, setSelectedRoute,
    revealedAnamnesis, setRevealedAnamnesis,
    processingTests,
    result,
    allResultsReady,
    addEvent,
    startGame, handleSubmit, handleOrderTests,
  };
}
