/**
 * String matching and Levenshtein distance utility for medical diagnosis validation.
 * Supports typo tolerance (edit distance <= 1 for short words <= 4-5 chars, edit distance <= 2 for words >= 6-7 chars).
 * Includes medical abbreviations expansion, case/punctuation normalization, and Russian character normalization.
 */

export {
  levenshteinDistance,
  normalizeRussianMedicalText,
  stemRu,
  isWordFuzzyMatch,
  matchDiagnosisSingle,
  matchDiagnosisFuzzy,
  QUALIFIERS,
} from "./matcher/index.js";
