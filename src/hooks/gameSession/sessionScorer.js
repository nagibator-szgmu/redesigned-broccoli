import { initPS, computeOutcome } from "../../engine/patient";
import { computeScore, diagMatchRatio } from "../../engine/scoring";
import { applyUnfinishedTreatments } from "../../engine/deterioration";
import { analyzeCognitiveErrors } from "../../engine/cognitiveAnalyzer";
import { evaluateClinicalSafety } from "../../engine/safetyEngine";
import { mapSafetyToMistakes } from "../../engine/debrief/safetyMistakesMapper";
import { evaluateDiagnosisWithAI } from "../../engine/aiEvaluator";
import { getEffectiveOrderedDiag } from "../../engine/labAnalysisEngine";
import scormService from "../../services/scormService";
import { DIAGNOSTICS } from "../../data/diagnostics";

const toGradeId = (score) => (score >= 85 ? "excellent" : score >= 70 ? "good" : score >= 50 ? "satisfactory" : "unsatisfactory");

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

  const elapsedSec = s.cd?.department === "outpatient" ? 0 : s.totalTime - s.timeLeft;
  const routeResult = s.extraResult || (selectedRoute ? { selectedRoute } : null);
  const effectiveOrdered = getEffectiveOrderedDiag(s.orderedDiag, s.selectedLabParams);
  const res = computeScore(s.cd, effectiveOrdered, s.selTreat, s.diagText, finalPS, elapsedSec, s.revealedAnamnesis, routeResult);
  const cogAnalysis = analyzeCognitiveErrors(s.cd, effectiveOrdered, s.selTreat, s.diagText, finalPS, elapsedSec);
  const safety = evaluateClinicalSafety(s.cd, s.selTreat, effectiveOrdered, s.revealedAnamnesis, s.trajectory);
  const mistakes = mapSafetyToMistakes(safety, s.cd);

  (res.unjustifiedPenalties || []).forEach((up, idx) => {
    const diagName = DIAGNOSTICS.find((d) => d.id === up.id)?.name || up.id;
    mistakes.push({
      id: `unjustified_${up.id || idx}`,
      title: `Гипердиагностика: ${diagName}`,
      severity: "major",
      penalty: up.penalty || 5,
      reason: up.reason,
      guidelineRef: s.cd.sourceReference?.name || "Клинические рекомендации Минздрава РФ",
    });
  });

  if (s.cd.rxPlan && routeResult?.rxBuilder && !routeResult.rxBuilder.isCorrect) {
    mistakes.push({
      id: "rx_builder_error",
      title: "Неверная схема фармакотерапии",
      severity: "minor",
      penalty: Math.max(0, 10 - (res.rxScore || 0)),
      reason: `Выписано: ${routeResult.rxBuilder.mnn || "—"} (${routeResult.rxBuilder.dose || "—"}, ${routeResult.rxBuilder.frequency || "—"}). Не соответствует протоколу КР.`,
      guidelineRef: s.cd.sourceReference?.name || "Клинические рекомендации Минздрава РФ",
    });
  }

  if (s.cd.followUpPlan && routeResult?.followUp && (res.followUpScore || 0) < 10) {
    mistakes.push({
      id: "followup_defect",
      title: "Дефект диспансерного контроля",
      severity: "minor",
      penalty: Math.max(0, 10 - (res.followUpScore || 0)),
      reason: "Неверно выбран срок контрольной явки или перечень контрольных биомаркеров эффективности лечения.",
      guidelineRef: s.cd.sourceReference?.name || "Клинические рекомендации Минздрава РФ",
    });
  }


  setResult({
    ...res, orderedDiag: effectiveOrdered, timeout, died, outcome,
    selectedRoute, routeOptions: s.cd.routeOptions, correctRoute: s.cd.correctRoute,
    cogAnalysis, safety, mistakes,
  });
  setPs(finalPS);
  setTotalScore((prev) => prev + res.score);
  setCasesPlayed((prev) => prev + 1);

  setSessionHistory((prev) => [
    {
      id: Date.now(), caseId: s.cd.id, caseName: s.cd.name, category: s.cd.category,
      diagnosis: s.cd.diagnosis, score: res.score, gradeId: res.gradeId,
      date: new Date().toISOString(), difficulty: s.difficulty, gameMode: s.gameMode,
      timeout, died, cogAnalysis, safety, mistakes,
    },
    ...prev,
  ].slice(0, 50));

  syncScorm(res.score, res.gradeId, died, outcome, elapsedSec);

  // Asynchronous AI & Clinical evaluation
  evaluateDiagnosisWithAI(s.cd, s.diagText, effectiveOrdered, s.selTreat, safety).then((aiRes) => {
    if (!aiRes.success) return;
    setResult((prev) => {
      if (!prev) return prev;
      const allVariants = [s.cd.diagnosis, ...(s.cd.diagnosisVariants || [])];
      const localRatio = Math.max(...allVariants.map((v) => diagMatchRatio(v, s.diagText)));
      const localDiagScore = localRatio >= 0.6 ? 35 : localRatio >= 0.3 ? 20 : localRatio > 0 ? 10 : 0;
      const newScore = Math.min(100, Math.max(0, prev.score - localDiagScore + aiRes.diagScore));
      const newGradeId = toGradeId(newScore);

      setTotalScore((total) => total - prev.score + newScore);
      setSessionHistory((history) => {
        const copy = [...history];
        if (copy.length > 0) {
          copy[0] = { ...copy[0], score: newScore, gradeId: newGradeId, aiEvaluated: true, aiFeedback: aiRes.feedback, aiErrors: aiRes.errors };
        }
        return copy;
      });
      syncScorm(newScore, newGradeId, died, outcome);

      return {
        ...prev, score: newScore, gradeId: newGradeId, aiEvaluated: true,
        aiFeedback: aiRes.feedback, aiErrors: aiRes.errors,
        aiDiagScore: aiRes.diagScore, localDiagScore,
      };
    });
  });

  setPhase("result");

}
