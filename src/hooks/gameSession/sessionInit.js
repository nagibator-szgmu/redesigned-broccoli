import { CASES } from "../../data/cases";
import { calculateMap } from "../../engine/reassessmentEngine";
import { deriveProblemList } from "../../engine/problemListEngine";

export function formatElapsed(totalTime, timeLeft) {
  const elapsed = totalTime - timeLeft;
  const mm = Math.floor(elapsed / 60);
  const ss = elapsed % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}

export function selectCase(caseId, gameMode, usedIds) {
  const pool = usedIds.length >= CASES.length ? CASES : CASES.filter((c) => !usedIds.includes(c.id));
  if (caseId != null && (typeof caseId === "string" || typeof caseId === "number")) {
    return CASES.find((c) => String(c.id) === String(caseId)) || pool[Math.floor(Math.random() * pool.length)];
  }
  if (gameMode === "random") {
    return CASES[Math.floor(Math.random() * CASES.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

export function computeCaseDuration(timeLimitMinutes, difficulty, gameMode) {
  const diffMult = { easy: 1.5, normal: 1, hard: 0.7 }[difficulty] || 1;
  const modeMult = gameMode === "stress" ? 0.5 : 1;
  return Math.round(timeLimitMinutes * 60 * diffMult * modeMult);
}

export function buildInitialTrajectory(initialPS) {
  return [
    {
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
      recentInterventions: [],
    },
  ];
}
