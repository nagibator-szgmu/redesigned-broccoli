import { TREATMENTS } from "../data/treatments.js";
import { computeOutcome } from "./patient.js";
import { matchDiagnosisFuzzy } from "../lib/stringMatcher.js";
import { findMatchingOption } from "./drugMatcher.js";

export const WRONG_TREATMENT_PENALTY = 15;

/** Доля слов диагноза, встретившихся в ответе игрока с учетом расстояния Левенштейна */
export function diagMatchRatio(diagnosis, diagText) {
  return matchDiagnosisFuzzy(diagnosis, diagText);
}

/** Вычисляет бонус за время (0-15 баллов) */
export function computeTimeBonus(elapsed, timeLimit) {
  const limitSec = timeLimit * 60, remaining = Math.max(0, limitSec - elapsed), ratio = remaining / limitSec;
  if (ratio >= 0.7) return 15;
  if (ratio >= 0.5) return 12;
  if (ratio >= 0.3) return 8;
  if (ratio >= 0.1) return 4;
  return 0;
}

export function computeScore(cd, selDiag, selTreat, diagText, finalPS, elapsedSec, revealedAnamnesis, extraResult) {
  let score = 0;
  const dangerous = [];

  const allVariants = [cd.diagnosis, ...(cd.diagnosisVariants || [])];
  const ratio = Math.max(...allVariants.map((v) => diagMatchRatio(v, diagText)));
  if (ratio >= 0.6) score += 35;
  else if (ratio >= 0.3) score += 20;
  else if (ratio > 0) score += 10;

  const safeSelTreat = selTreat || [], safeSelDiag = selDiag || [];
  const needDiag = cd.needDiag || [], dh = needDiag.filter((id) => safeSelDiag.includes(id)).length;
  const isInteractiveGastro = cd.department === "outpatient" && (cd.rxPlan || cd.followUpPlan || cd.unjustifiedDiag);

  const unjustifiedPenalties = isInteractiveGastro ? (cd.unjustifiedDiag || []).filter((u) => safeSelDiag.includes(u.id)) : [];
  if (isInteractiveGastro) {
    const penaltyTotal = unjustifiedPenalties.reduce((acc, u) => acc + (u.penalty || 5), 0);
    score += Math.max(0, Math.round((dh / Math.max(needDiag.length, 1)) * 25) - penaltyTotal);
  } else {
    score += Math.round((dh / Math.max(needDiag.length, 1)) * 20);
  }

  const rev = revealedAnamnesis instanceof Set ? revealedAnamnesis : new Set(revealedAnamnesis || []);
  const anamnesisRequired = [];
  if (cd.department === "outpatient" || cd.department === "stationary") {
    if (cd.historyOfIllness) anamnesisRequired.push("historyOfIllness");
    if (cd.lifeHistory) anamnesisRequired.push("lifeHistory");
  } else if (cd.department === "admission" && cd.shortHistory) {
    anamnesisRequired.push("shortHistory");
  }
  const anamnesisRevealed = anamnesisRequired.filter((k) => rev.has(k)).length;
  score += Math.round((anamnesisRevealed / Math.max(anamnesisRequired.length, 1)) * 10);

  const selRoute = typeof extraResult === "string" ? extraResult : extraResult?.selectedRoute;
  let rxScore = 0, followUpScore = 0;

  if (cd.department === "outpatient") {
    const isRouteCorrect = selRoute === cd.correctRoute;
    if (isInteractiveGastro) {
      if (isRouteCorrect) score += 10;
      const prescriptions = extraResult?.prescriptions || {};
      const rxList = Object.values(prescriptions);
      const rx = extraResult?.rxBuilder || rxList[0] || null;

      if (cd.rxPlan) {
        if (rx && !rx.id && rx.isCorrect) {
          rxScore = 10;
        } else {
          const candidateRxs = rxList.length > 0 ? rxList : (rx ? [rx] : []);
          let bestOpt = null, bestRx = null;
          for (const cand of candidateRxs) {
            const matched = findMatchingOption(cand.id, cd.rxPlan);
            if (matched && matched.isCorrect) { bestOpt = matched; bestRx = cand; break; }
          }
          if (bestOpt && bestRx) {
            const doseOk = !bestOpt.correctDose || bestRx.dose === bestOpt.correctDose;
            const freqOk = !bestOpt.correctFrequency || bestRx.frequency === bestOpt.correctFrequency;
            rxScore = (doseOk && freqOk) ? (bestOpt.score || 10) : 5;
          } else {
            rxScore = 0;
          }
        }
      }
      score += rxScore;

      const fu = extraResult?.followUp, plan = cd.followUpPlan;
      if (plan && fu) {
        const correctTiming = plan.correctTiming || plan.timingOptions?.find((o) => o.isCorrect)?.id;
        if (fu.timingId && fu.timingId === correctTiming) followUpScore += 5;
        const cb = plan.correctBiomarkers || plan.biomarkers?.filter((b) => b.isCorrect).map((b) => b.id) || [];
        const sb = fu.selectedBiomarkers || [];
        const hits = cb.filter((b) => sb.includes(b)).length, falsePos = sb.filter((b) => !cb.includes(b)).length;
        followUpScore += Math.max(0, Math.round((hits / Math.max(cb.length, 1)) * 5) - falsePos * 2);
      }
      score += followUpScore;
    } else if (isRouteCorrect) {
      score += 20;
      const needTreat = cd.needTreat || [];
      if (needTreat.length === 0) score += 15;
      else {
        const th = needTreat.filter((id) => safeSelTreat.includes(id)).length;
        score += Math.round((th / needTreat.length) * 15);
      }
    }
  } else {
    const needTreat = cd.needTreat || [], th = needTreat.filter((id) => safeSelTreat.includes(id)).length;
    score += Math.round((th / Math.max(needTreat.length, 1)) * 20);
  }

  const wrongTreat = cd.wrongTreat || [];
  wrongTreat.forEach((id) => {
    if (safeSelTreat.includes(id)) {
      score = Math.max(0, score - WRONG_TREATMENT_PENALTY);
      dangerous.push(TREATMENTS.find((t) => t.id === id)?.name || id);
    }
  });

  if (cd.lifeHistoryContraindications?.length > 0 && !rev.has("lifeHistory")) {
    cd.lifeHistoryContraindications.forEach((id) => {
      if (safeSelTreat.includes(id) && !(cd.wrongTreat || []).includes(id)) {
        score = Math.max(0, score - WRONG_TREATMENT_PENALTY);
        dangerous.push(`${TREATMENTS.find((t) => t.id === id)?.name || id} — можно было предотвратить, если бы был собран анамнез жизни`);
      }
    });
  }

  const outcome = computeOutcome(finalPS, cd, cd.department);
  if (cd.department !== "outpatient") {
    if (outcome === "stable" || outcome === "stabilized") score += 20;
    else if (outcome === "unstable") score += 10;
    else if (outcome === "critical") score += 3;
    else if (outcome === "transferToICU") score += 5;
    else if (outcome === "routed") score += 15;
    else if (outcome === "timeout_no_route") score = Math.max(0, score - 10);
    else if (outcome === "dead") score = Math.max(0, score - 20);
  }

  if (elapsedSec !== undefined && cd.department !== "outpatient") {
    score += computeTimeBonus(elapsedSec, cd.timeLimit);
  }

  score = Math.min(100, Math.max(0, score));
  const gradeId = score >= 85 ? "excellent" : score >= 70 ? "good" : score >= 50 ? "satisfactory" : "unsatisfactory";
  const isRouteCorrect = cd.department === "outpatient" ? selRoute === cd.correctRoute : undefined;

  return {
    score, gradeId, dangerous, diagCorrect: ratio >= 0.6, diagPartial: ratio >= 0.3,
    outcome, isRouteCorrect, unjustifiedPenalties, rxScore, followUpScore,
  };
}
