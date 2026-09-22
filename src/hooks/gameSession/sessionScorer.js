import { initPS, computeOutcome } from "../../engine/patient";
import { computeScore, diagMatchRatio } from "../../engine/scoring";
import { applyUnfinishedTreatments } from "../../engine/deterioration";
import { analyzeCognitiveErrors } from "../../engine/cognitiveAnalyzer";
import { evaluateClinicalSafety } from "../../engine/safetyEngine";
import { mapSafetyToMistakes } from "../../engine/debrief/safetyMistakesMapper";
import { evaluateDiagnosisWithAI } from "../../engine/aiEvaluator";
import scormService from "../../services/scormService";

function toGradeId(score) {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "satisfactory";
  return "unsatisfactory";
}

function syncScorm(score, gradeId, died, outcome, elapsedSec) {
  if (!scormService.isConnected()) return;
  const passThreshold = scormService.getMasteryScore() || 70;
  const isPassed = !died && score >= passThreshold && gradeId !== "unsatisfactory" && outcome !== "timeout_no_route";
  scormService.setScore(score);
  scormService.setStatus(isPassed ? "passed" : "failed");
  if (elapsedSec != null) scormService.setSessionTime(elapsedSec);
  scormService.commit();
}

export function finalizeSession({
  state,
  timeout = false,
  died = false,
  selectedRoute,
  setResult,
  setPs,
  setTotalScore,
  setCasesPlayed,
  setSessionHistory,
  setPhase,
}) {
  const s = state;
  if (!s.cd) return;

  const finalPS = applyUnfinishedTreatments(s.ps || initPS(s.cd), s.cd, s.selTreat, s.appliedFx);
  if (s.ps?.status === "dead") finalPS.status = "dead";

  let outcome;
  if (s.cd.department === "admission") {
    outcome = selectedRoute ? "routed" : timeout ? "timeout_no_route" : computeOutcome(finalPS, s.cd, s.cd.department);
  } else {
    outcome = computeOutcome(finalPS, s.cd, s.cd.department);
  }

  finalPS.status = outcome === "dead" ? "dead" : outcome === "stable" || outcome === "stabilized" ? "stable" : finalPS.status;

  const elapsedSec = s.totalTime - s.timeLeft;
  const res = computeScore(s.cd, s.orderedDiag, s.selTreat, s.diagText, finalPS, elapsedSec, s.revealedAnamnesis);
  const cogAnalysis = analyzeCognitiveErrors(s.cd, s.orderedDiag, s.selTreat, s.diagText, finalPS, elapsedSec);
  const safety = evaluateClinicalSafety(s.cd, s.selTreat, s.orderedDiag, s.revealedAnamnesis, s.trajectory);
  const mistakes = mapSafetyToMistakes(safety, s.cd);

  setResult({
    ...res,
    timeout,
    died,
    outcome,
    selectedRoute,
    routeOptions: s.cd.routeOptions,
    correctRoute: s.cd.correctRoute,
    cogAnalysis,
    safety,
    mistakes,
  });
  setPs(finalPS);
  setTotalScore((prev) => prev + res.score);
  setCasesPlayed((prev) => prev + 1);

  setSessionHistory((prev) => [
    {
      id: Date.now(),
      caseId: s.cd.id,
      caseName: s.cd.name,
      category: s.cd.category,
      diagnosis: s.cd.diagnosis,
      score: res.score,
      gradeId: res.gradeId,
      date: new Date().toISOString(),
      difficulty: s.difficulty,
      gameMode: s.gameMode,
      timeout,
      died,
      cogAnalysis,
      safety,
      mistakes,
    },
    ...prev,
  ].slice(0, 50));

  syncScorm(res.score, res.gradeId, died, outcome, elapsedSec);

  // Asynchronous AI & Clinical evaluation
  evaluateDiagnosisWithAI(s.cd, s.diagText, s.orderedDiag, s.selTreat, safety).then((aiRes) => {
    if (aiRes.success) {
      setResult((prev) => {
        if (!prev) return prev;
        const localRatio = diagMatchRatio(s.cd.diagnosis, s.diagText);
        const localDiagScore = localRatio >= 0.6 ? 35 : localRatio >= 0.3 ? 20 : localRatio > 0 ? 10 : 0;

        const newScore = Math.min(100, Math.max(0, prev.score - localDiagScore + aiRes.diagScore));
        const newGradeId = toGradeId(newScore);

        setTotalScore((total) => total - prev.score + newScore);

        setSessionHistory((history) => {
          const copy = [...history];
          if (copy.length > 0) {
            copy[0] = {
              ...copy[0],
              score: newScore,
              gradeId: newGradeId,
              aiEvaluated: true,
              aiFeedback: aiRes.feedback,
              aiErrors: aiRes.errors,
            };
          }
          return copy;
        });

        syncScorm(newScore, newGradeId, died, outcome);

        return {
          ...prev,
          score: newScore,
          gradeId: newGradeId,
          aiEvaluated: true,
          aiFeedback: aiRes.feedback,
          aiErrors: aiRes.errors,
          aiDiagScore: aiRes.diagScore,
          localDiagScore,
        };
      });
    }
  });

  setPhase("result");
}
