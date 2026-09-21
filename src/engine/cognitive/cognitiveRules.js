/**
 * cognitiveRules.js
 * Analyzes simulation sessions for diagnostic blindness, anchoring effect, and premature closure.
 */

export function analyzeCognitiveErrors(
  caseData,
  orderedDiag = [],
  selTreat = [],
  diagText = "",
  finalPS = {},
  elapsedSec = 0
) {
  const errors = {
    anchoring: false,
    prematureClosure: false,
    diagnosticBlindness: false,
  };

  const complaint = (caseData.complaint || "").toLowerCase();
  const diagnosis = (caseData.diagnosis || "").toLowerCase();
  const enteredDiag = (diagText || "").toLowerCase();

  // 1. Диагностическая слепота (Diagnostic Blindness)
  const hasChestPain =
    complaint.includes("груд") ||
    complaint.includes("сердц") ||
    complaint.includes("стенокард");
  const hasAlteredMental =
    complaint.includes("сознан") ||
    complaint.includes("кома") ||
    complaint.includes("сопор") ||
    complaint.includes("путает");
  const hasAbdominalPain =
    complaint.includes("живот") ||
    complaint.includes("эпигастр") ||
    complaint.includes("рвот");

  if (hasChestPain && !orderedDiag.includes("ecg")) {
    errors.diagnosticBlindness = true;
  }
  if (
    hasAlteredMental &&
    !orderedDiag.includes("glucose") &&
    !orderedDiag.includes("glu")
  ) {
    errors.diagnosticBlindness = true;
  }
  if (
    hasAbdominalPain &&
    !orderedDiag.includes("us_abd") &&
    !orderedDiag.includes("ct_abd") &&
    !orderedDiag.includes("ultrasound_abdomen") &&
    !orderedDiag.includes("usg_abdo")
  ) {
    errors.diagnosticBlindness = true;
  }

  // 2. Эффект якоря (Anchoring Effect)
  const wordsEntered = enteredDiag.split(/[\s,.-]+/).filter((w) => w.length > 3);
  let matchCount = 0;
  wordsEntered.forEach((word) => {
    if (diagnosis.includes(word)) matchCount++;
  });
  const isDiagCorrect = wordsEntered.length > 0 && matchCount / wordsEntered.length >= 0.3;

  const wrongTreatsCount = selTreat.filter((t) =>
    (caseData.wrongTreat || []).includes(t)
  ).length;
  if (!isDiagCorrect && wrongTreatsCount >= 1) {
    errors.anchoring = true;
  }

  // 3. Преждевременное закрытие (Premature Closure)
  const neededDiagCount = (caseData.needDiag || []).length;
  const performedNeededCount = orderedDiag.filter((d) =>
    (caseData.needDiag || []).includes(d)
  ).length;

  if (
    neededDiagCount > 0 &&
    performedNeededCount / neededDiagCount < 0.5 &&
    elapsedSec < 120
  ) {
    errors.prematureClosure = true;
  }

  // Расчет чек-листа ОСКЭ
  const diagTotal = (caseData.needDiag || []).length;
  const diagPassed = orderedDiag.filter((d) =>
    (caseData.needDiag || []).includes(d)
  ).length;
  const treatTotal = (caseData.needTreat || []).length;
  const treatPassed = selTreat.filter((t) =>
    (caseData.needTreat || []).includes(t)
  ).length;

  // Опасные действия
  const criticalErrors = [];
  selTreat.forEach((t) => {
    if ((caseData.wrongTreat || []).includes(t)) {
      criticalErrors.push(t);
    }
  });
  if (finalPS.status === "dead") {
    criticalErrors.push("death");
  }

  return {
    cognitiveErrors: errors,
    checklist: {
      diagPassed,
      diagTotal,
      treatPassed,
      treatTotal,
    },
    criticalErrors,
    timeToAction: Math.max(15, Math.min(180, Math.floor(elapsedSec * 0.4))),
  };
}
