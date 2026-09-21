import { levenshteinDistance } from "./levenshtein.js";
import { stemRu } from "./normalizer.js";

/**
 * Checks if candidate word matches target word with typo tolerance:
 * - Length <= 3: exact match only
 * - Length 4-5: edit distance <= 1
 * - Length >= 6: edit distance <= 2
 */
export function isWordFuzzyMatch(cand, target) {
  if (!cand || !target) return false;
  if (cand === target) return true;

  const stemCand = stemRu(cand);
  const stemTarget = stemRu(target);
  if (stemCand && stemTarget && stemCand === stemTarget) return true;

  const maxLen = Math.max(cand.length, target.length);
  if (maxLen <= 3) return cand === target;

  const maxDist = maxLen <= 5 ? 1 : 2;
  const dist = levenshteinDistance(cand, target);
  if (dist <= maxDist) return true;

  // Also test stemmed distance
  if (stemCand.length >= 4 && stemTarget.length >= 4) {
    const stemMaxLen = Math.max(stemCand.length, stemTarget.length);
    const stemMaxDist = stemMaxLen <= 5 ? 1 : 2;
    if (levenshteinDistance(stemCand, stemTarget) <= stemMaxDist) return true;
  }

  return false;
}
