import { initPS, computeOutcome } from "../../engine/patient";
import { computeScore, diagMatchRatio } from "../../engine/scoring";
import { applyUnfinishedTreatments } from "../../engine/deterioration";
import { analyzeCognitiveErrors } from "../../engine/cognitiveAnalyzer";
import { evaluateDiagnosisWithAI } from "../../engine/aiEvaluator";
import scormService from "../../services/scormService";

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

  finalPS.status =
    outcome === "dead"
      ? "dead"
      : outcome === "stable" || outcome === "stabilized"
      ? "stable"
      : finalPS.status;

  const elapsedSec = s.totalTime - s.timeLeft;
  const res = computeScore(
    s.cd,
    s.orderedDiag,
    s.selTreat,
    s.diagText,
    finalPS,
    elapsedSec,
    s.revealedAnamnesis
  );
  const cogAnalysis = analyzeCognitiveErrors(
    s.cd,
    s.orderedDiag,
    s.selTreat,
    s.diagText,
    finalPS,
    elapsedSec
  );

  setResult({
    ...res,
    timeout,
    died,
    outcome,
    selectedRoute,
    routeOptions: s.cd.routeOptions,
    correctRoute: s.cd.correctRoute,
    cogAnalysis,
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
    },
    ...prev,
  ].slice(0, 50));

  // SCORM Integration
  if (scormService.isConnected()) {
    const passThreshold = scormService.getMasteryScore() || 70;
    const isPassed =
      !died &&
      res.score >= passThreshold &&
      res.gradeId !== "unsatisfactory" &&
      outcome !== "timeout_no_route";
    scormService.setScore(res.score);
    scormService.setStatus(isPassed ? "passed" : "failed");
    scormService.setSessionTime(elapsedSec);
    scormService.commit();
  }

  // Asynchronous AI evaluation
  evaluateDiagnosisWithAI(s.cd, s.diagText, s.orderedDiag, s.selTreat).then((aiRes) => {
    if (aiRes.success) {
      setResult((prev) => {
        if (!prev) return prev;
        const localRatio = diagMatchRatio(s.cd.diagnosis, s.diagText);
        const localDiagScore =
          localRatio >= 0.6 ? 35 : localRatio >= 0.3 ? 20 : localRatio > 0 ? 10 : 0;

        let newScore = prev.score - localDiagScore + aiRes.diagScore;
        newScore = Math.min(100, Math.max(0, newScore));
        const newGradeId =
          newScore >= 85
            ? "excellent"
            : newScore >= 70
            ? "good"
            : newScore >= 50
            ? "satisfactory"
            : "unsatisfactory";

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

        if (scormService.isConnected()) {
          const passThreshold = scormService.getMasteryScore() || 70;
          const isPassed =
            !died &&
            newScore >= passThreshold &&
            newGradeId !== "unsatisfactory" &&
            outcome !== "timeout_no_route";
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
          localDiagScore,
        };
      });
    }
  });

  setPhase("result");
}
