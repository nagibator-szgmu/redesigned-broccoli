import REVIEW_REGISTRY from "../data/review-registry.json";

export function getReviewForCase(caseId) {
  if (!REVIEW_REGISTRY?.cases) return null;
  return REVIEW_REGISTRY.cases[caseId] || null;
}

export function isCaseReviewed(caseId) {
  const entry = getReviewForCase(caseId);
  return entry?.status === "reviewed";
}

export function getVisibleCases(allCases) {
  if (!REVIEW_REGISTRY?.cases) return allCases;
  return allCases.filter(c => {
    const entry = REVIEW_REGISTRY.cases[c.id];
    return entry && entry.status === "reviewed";
  });
}

export function getExplanationForCase(caseId, field) {
  const entry = getReviewForCase(caseId);
  if (!entry?.checklistResults) return null;
  const fieldData = entry.checklistResults[field];
  if (!fieldData || !fieldData.passed) return null;
  return fieldData.explanation || null;
}

export default REVIEW_REGISTRY;
