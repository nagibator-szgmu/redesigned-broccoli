import { computeDiagnosisAndDiagCriteria } from "./breakdown/diagnosisAndDiagCriteria";
import { computeManagementCriteria } from "./breakdown/managementCriteria";

/**
 * Computes structured breakdown of score criteria for debriefing.
 */
export function computeScoreCriteriaBreakdown({
  cd,
  result,
  orderedDiag = [],
  selTreat = [],
  diagText = "",
  revealedAnamnesis,
  extraResult,
}) {
  if (!cd) return [];
  const p1 = computeDiagnosisAndDiagCriteria({
    cd,
    result,
    orderedDiag,
    diagText,
    revealedAnamnesis,
  });
  const p2 = computeManagementCriteria({
    cd,
    result,
    selTreat,
    extraResult,
  });
  return [...p1, ...p2];
}
