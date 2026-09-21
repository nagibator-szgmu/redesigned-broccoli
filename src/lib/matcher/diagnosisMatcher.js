import { levenshteinDistance } from "./levenshtein.js";
import { normalizeRussianMedicalText } from "./normalizer.js";
import { isWordFuzzyMatch } from "./fuzzyWord.js";

export const QUALIFIERS = new Set([
  "острый", "острая", "острое", "острые",
  "хронический", "хроническая", "хроническое", "хронические",
  "подострый", "подострая",
  "тяжелый", "тяжелая", "тяжелое", "легкий", "легкая", "средней",
  "степени", "стадии", "типа", "формы"
]);

export function matchDiagnosisSingle(normRef, normUser) {
  if (!normRef || !normUser) return 0;
  if (normRef === normUser) return 1.0;

  // Direct full-string Levenshtein comparison if lengths are close
  const fullDist = levenshteinDistance(normRef, normUser);
  const fullMaxDist = normRef.length <= 5 ? 1 : 2;
  if (fullDist <= fullMaxDist) return 1.0;

  const refWords = normRef.split(" ").filter(w => w.length >= 3);
  const userWords = normUser.split(" ").filter(w => w.length >= 3);

  if (refWords.length === 0) return 0;

  // Separate qualifiers from core clinical terms
  const coreRefWords = refWords.filter(w => !QUALIFIERS.has(w));

  // Count how many reference keywords are matched by user words (with typo tolerance)
  let hits = 0;
  let coreHits = 0;
  for (const rWord of refWords) {
    const isCore = !QUALIFIERS.has(rWord);
    const matched = userWords.some(uWord => isWordFuzzyMatch(uWord, rWord)) || normUser.includes(rWord);
    if (matched) {
      hits++;
      if (isCore) coreHits++;
    }
  }

  // If there are core words in reference but 0 core words were matched by user, it is a false match
  if (coreRefWords.length > 0 && coreHits === 0) {
    return 0;
  }

  const ratio = hits / refWords.length;
  return ratio;
}

/**
 * Computes diagnostic match ratio between reference diagnosis and player input.
 * Handles Outpatient JSON format or plain text, typo tolerance (Levenshtein distance <= 1-2),
 * and multi-alternative reference strings (split by '/', '|', ';').
 */
export function matchDiagnosisFuzzy(referenceDiagnosis, playerInput) {
  if (!playerInput || !referenceDiagnosis) return 0;

  let userText = playerInput;
  if (typeof userText === "string" && userText.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(userText);
      userText = [parsed.main, parsed.complication, parsed.comorbidity].filter(Boolean).join(" ");
    } catch {
      // keep raw string
    }
  }

  const normUser = normalizeRussianMedicalText(userText);
  if (!normUser) return 0;

  // Split reference diagnosis if it contains alternatives (e.g. "ОКС / ОИМ" or "Аппендицит | Острый аппендицит")
  const refParts = String(referenceDiagnosis).split(/[/|;]+/).map(p => p.trim()).filter(Boolean);
  if (refParts.length === 0) return 0;

  let bestRatio = 0;
  for (const part of refParts) {
    const normRefPart = normalizeRussianMedicalText(part);
    const score = matchDiagnosisSingle(normRefPart, normUser);
    if (score > bestRatio) {
      bestRatio = score;
    }
    if (bestRatio >= 1.0) break;
  }

  // Also test against the full combined string if parts > 1
  if (refParts.length > 1) {
    const fullNormRef = normalizeRussianMedicalText(referenceDiagnosis);
    const fullScore = matchDiagnosisSingle(fullNormRef, normUser);
    if (fullScore > bestRatio) {
      bestRatio = fullScore;
    }
  }

  return bestRatio;
}
