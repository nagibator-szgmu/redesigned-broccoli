import { DIAGNOSTICS } from "../../../data/diagnostics.js";
import { diagMatchRatio } from "../../../engine/scoring.js";

export function computeDiagnosisAndDiagCriteria({
  cd,
  result,
  orderedDiag = [],
  diagText = "",
  revealedAnamnesis,
}) {
  const criteria = [];
  const rev = revealedAnamnesis instanceof Set ? revealedAnamnesis : new Set(revealedAnamnesis || []);
  const isInteractiveGastro = cd.department === "outpatient" && (cd.rxPlan || cd.followUpPlan || cd.unjustifiedDiag);

  // 1. Clinical diagnosis
  const allVariants = [cd.diagnosis, ...(cd.diagnosisVariants || [])];
  const ratio = Math.max(...allVariants.map((v) => diagMatchRatio(v, diagText || "")));
  let diagEarned = result?.aiDiagScore != null
    ? result.aiDiagScore
    : ratio >= 0.6 ? 35 : ratio >= 0.3 ? 20 : ratio > 0 ? 10 : 0;
  diagEarned = Math.min(35, Math.max(0, diagEarned));
  const diagLost = 35 - diagEarned;
  criteria.push({
    id: "diagnosis",
    title: "Клинический диагноз",
    max: 35,
    earned: diagEarned,
    lost: diagLost,
    status: diagLost === 0 ? "perfect" : diagEarned > 0 ? "partial" : "failed",
    details: diagLost === 0
      ? "Диагноз сформулирован верно и полностью соответствует картине"
      : diagEarned > 0
        ? "Диагноз сформулирован частично (основная форма распознана)"
        : "Диагноз не распознан или не был сформулирован",
    recommendation: diagLost > 0 ? `Эталон по КР: ${cd.diagnosis}` : null,
  });

  // 2. Mandatory diagnostics
  const needDiag = cd.needDiag || [];
  const diagMax = isInteractiveGastro ? 25 : 20;
  const safeOrdered = orderedDiag || [];
  const dh = needDiag.filter((id) => safeOrdered.includes(id)).length;
  const diagBaseEarned = Math.round((dh / Math.max(needDiag.length, 1)) * diagMax);
  const missedDiag = needDiag.filter((id) => !safeOrdered.includes(id));
  const diagPointsLost = diagMax - diagBaseEarned;
  const missedNames = missedDiag.map((id) => DIAGNOSTICS.find((d) => d.id === id)?.name || id);

  criteria.push({
    id: "need_diag",
    title: `Обязательная диагностика (${diagMax} б.)`,
    max: diagMax,
    earned: diagBaseEarned,
    lost: diagPointsLost,
    status: diagPointsLost === 0 ? "perfect" : diagBaseEarned > 0 ? "partial" : "failed",
    details: diagPointsLost === 0
      ? "Все необходимые лабораторные и инструментальные исследования назначены"
      : `Не назначены: ${missedNames.join(", ")}`,
  });

  // 3. Hyperdiagnosis penalties
  const unjust = result?.unjustifiedPenalties || (isInteractiveGastro ? (cd.unjustifiedDiag || []).filter((u) => safeOrdered.includes(u.id)) : []);
  if (unjust && unjust.length > 0) {
    const penaltyTotal = unjust.reduce((acc, u) => acc + (u.penalty || 5), 0);
    const names = unjust.map((u) => {
      const dName = DIAGNOSTICS.find((d) => d.id === u.id)?.name || u.id;
      const baseUnjust = (cd.unjustifiedDiag || []).find((x) => x.id === u.id);
      const reason = u.reason || baseUnjust?.reason;
      return reason ? `${dName} (−${u.penalty || 5} б.): ${reason}` : `${dName} (−${u.penalty || 5} б.)`;
    });
    criteria.push({
      id: "hyperdiagnosis",
      title: "Гипердиагностика и лучевая нагрузка",
      max: 0,
      earned: -penaltyTotal,
      lost: penaltyTotal,
      status: "penalty",
      details: `Необоснованные исследования: ${names.join("; ")}`,
    });
  }

  // 4. Anamnesis
  const anamnesisRequired = [];
  if (cd.department === "outpatient" || cd.department === "stationary") {
    if (cd.historyOfIllness) anamnesisRequired.push({ key: "historyOfIllness", label: "анамнез заболевания" });
    if (cd.lifeHistory) anamnesisRequired.push({ key: "lifeHistory", label: "анамнез жизни" });
  } else if (cd.department === "admission" && cd.shortHistory) {
    anamnesisRequired.push({ key: "shortHistory", label: "краткий анамнез" });
  }
  if (anamnesisRequired.length > 0) {
    const revealedCount = anamnesisRequired.filter((item) => rev.has(item.key)).length;
    const anamnesisEarned = Math.round((revealedCount / anamnesisRequired.length) * 10);
    const anamnesisLost = 10 - anamnesisEarned;
    const missedAnamnesis = anamnesisRequired.filter((item) => !rev.has(item.key)).map((i) => i.label);
    criteria.push({
      id: "anamnesis",
      title: "Сбор анамнеза",
      max: 10,
      earned: anamnesisEarned,
      lost: anamnesisLost,
      status: anamnesisLost === 0 ? "perfect" : "failed",
      details: anamnesisLost === 0
        ? "Анамнез собран в полном объёме"
        : `Пропущены разделы: ${missedAnamnesis.join(", ")}`,
    });
  }

  return criteria;
}
