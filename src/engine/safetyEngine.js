/**
 * safetyEngine.js
 * Чистый аналитический движок оценки клинической безопасности (Safety Analytics Engine V2.5).
 */

import { TREATMENTS } from "../data/treatments.js";
import { DIAGNOSTICS } from "../data/diagnostics.js";

const RESUSCITATION_IDS = ["oxygen", "oxygen_mask", "intubation", "iv_fluids", "norepinephrine", "epinephrine", "defibrillation", "cpr"];

/**
 * Оценивает безопасность клинических действий пользователя с учетом последовательности решений.
 */
export function evaluateClinicalSafety(cd = {}, selTreat = [], selDiag = [], revealedAnamnesis = new Set(), trajectoryCheckpoints = []) {
  const criticalErrors = [];
  const majorErrors = [];
  const sequentialErrors = [];
  const missedOpportunities = [];
  const appropriateActions = [];

  const wrongTreat = cd.wrongTreat || [];
  const needTreat = cd.needTreat || [];
  const needDiag = cd.needDiag || [];

  // 1. Критические ошибки (Прямые противопоказания)
  wrongTreat.forEach(id => {
    if (selTreat.includes(id)) {
      const drug = TREATMENTS.find(t => t.id === id);
      criticalErrors.push({
        id,
        name: drug?.name || id,
        type: "contraindicated_intervention",
        severity: "critical",
        explanation: `Введение противопоказанного препарата/процедуры при нозологии «${cd.diagnosis}». Высокий риск летального исхода.`
      });
    }
  });

  // 2. Ошибки анамнеза жизни
  if (cd.lifeHistoryContraindications && cd.lifeHistoryContraindications.length > 0) {
    const hasLifeHistory = revealedAnamnesis.has("lifeHistory");
    if (!hasLifeHistory) {
      cd.lifeHistoryContraindications.forEach(id => {
        if (selTreat.includes(id) && !wrongTreat.includes(id)) {
          const drug = TREATMENTS.find(t => t.id === id);
          majorErrors.push({
            id,
            name: drug?.name || id,
            type: "missed_anamnesis_contraindication",
            severity: "major",
            explanation: `Назначение «${drug?.name || id}» при наличии скрытых противопоказаний из анамнеза жизни.`
          });
        }
      });
    }
  }

  // 3. Последовательные ошибки ведения (Sequential Safety Errors)
  const trajectory = trajectoryCheckpoints || [];
  const reassessments = trajectory.filter(c => c.checkpointId?.startsWith("REASSESSMENT"));
  const deteriorations = reassessments.filter(c => c.overallResponse === "negative");

  if (trajectory.length > 0) {
    if (deteriorations.length > 0 && selTreat.some(id => wrongTreat.includes(id))) {
      sequentialErrors.push({
        type: "deterioration_with_contraindication",
        severity: "critical",
        explanation: "Продолжение неадекватной терапии на фоне зафиксированной физиологической декомпенсации пациента."
      });
    } else if (selTreat.length >= 4 && reassessments.length === 0 && cd.severity === "critical") {
      sequentialErrors.push({
        type: "blind_polypharmacy_no_reassessment",
        severity: "major",
        explanation: "Множественные назначения без промежуточной оценки физиологического ответа нестабильного пациента."
      });
    }

    const hasCriticalCollapse = trajectory.some(c => c.vitals && ((c.vitals.sbp != null && c.vitals.sbp > 0 && c.vitals.sbp < 75) || (c.vitals.spo2 != null && c.vitals.spo2 < 85)));
    const hasResuscitation = selTreat.some(id => RESUSCITATION_IDS.includes(id));
    if (hasCriticalCollapse && !hasResuscitation && needTreat.some(id => RESUSCITATION_IDS.includes(id))) {
      sequentialErrors.push({
        type: "missed_escalation",
        severity: "critical",
        explanation: "Пропуск экстренной реанимационной эскалации при жизнеугрожающей декомпенсации гемодинамики или оксигенации."
      });
    }
  }

  // 4. Упущенные возможности
  needTreat.forEach(id => {
    if (!selTreat.includes(id)) {
      const drug = TREATMENTS.find(t => t.id === id);
      missedOpportunities.push({
        id,
        name: drug?.name || id,
        category: "treatment",
        explanation: `Не выполнено жизнеспасающее вмешательство: ${drug?.name || id}.`
      });
    } else {
      const drug = TREATMENTS.find(t => t.id === id);
      appropriateActions.push({ id, name: drug?.name || id, category: "treatment", status: "Верное целевое назначение" });
    }
  });

  needDiag.forEach(id => {
    if (!selDiag.includes(id)) {
      const test = DIAGNOSTICS.find(d => d.id === id);
      missedOpportunities.push({
        id,
        name: test?.name || id,
        category: "diagnostic",
        explanation: `Не проведено ключевое диагностическое исследование: ${test?.name || id}.`
      });
    } else {
      const test = DIAGNOSTICS.find(d => d.id === id);
      appropriateActions.push({ id, name: test?.name || id, category: "diagnostic", status: "Обоснованное диагностическое исследование" });
    }
  });

  let safetyRating = "safe";
  let summary = "Действия соответствуют протоколам безопасности.";

  if (criticalErrors.length > 0 || sequentialErrors.some(e => e.severity === "critical")) {
    safetyRating = "critical_breach";
    summary = `Зафиксированы критические нарушения безопасности пациента (${criticalErrors.length + sequentialErrors.length})!`;
  } else if (majorErrors.length > 0 || sequentialErrors.length > 0 || missedOpportunities.length >= 3) {
    safetyRating = "caution";
    summary = "Зафиксированы существенные дефекты тактики или упущенные ключевые назначения.";
  }

  return {
    criticalErrors,
    majorErrors,
    sequentialErrors,
    missedOpportunities,
    appropriateActions,
    safetyRating,
    summary,
    totalErrors: criticalErrors.length + majorErrors.length + sequentialErrors.length
  };
}
