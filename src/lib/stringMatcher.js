/**
 * String matching and Levenshtein distance utility for medical diagnosis validation.
 * Supports typo tolerance (edit distance <= 1 for short words <= 4-5 chars, edit distance <= 2 for words >= 6-7 chars).
 * Includes medical abbreviations expansion, case/punctuation normalization, and Russian character normalization.
 */

export function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (!a) return b ? b.length : 0;
  if (!b) return a.length;

  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

export function normalizeRussianMedicalText(text) {
  if (!text) return "";
  let s = String(text).toLowerCase();
  // Replace Russian 'ё' with 'е'
  s = s.replace(/ё/g, "е");

  // Medical abbreviations normalization (using lookbehind/lookahead for Cyrillic compatibility)
  s = s
    .replace(/(?<![а-яa-z0-9])оим(?![а-яa-z0-9])/g, "инфаркт миокарда")
    .replace(/(?<![а-яa-z0-9])оимпst(?![а-яa-z0-9])/g, "инфаркт миокарда с подъемом st")
    .replace(/(?<![а-яa-z0-9])оимбst(?![а-яa-z0-9])/g, "инфаркт миокарда без подъема st")
    .replace(/(?<![а-яa-z0-9])онмк(?![а-яa-z0-9])/g, "инсульт нарушение мозгового кровообращения")
    .replace(/(?<![а-яa-z0-9])тиа(?![а-яa-z0-9])/g, "транзиторная ишемическая атака")
    .replace(/(?<![а-яa-z0-9])тэла(?![а-яa-z0-9])/g, "тромбоэмболия легочной артерии")
    .replace(/(?<![а-яa-z0-9])хсн(?![а-яa-z0-9])/g, "хроническая сердечная недостаточность")
    .replace(/(?<![а-яa-z0-9])осн(?![а-яa-z0-9])/g, "острая сердечная недостаточность")
    .replace(/(?<![а-яa-z0-9])одн(?![а-яa-z0-9])/g, "острая дыхательная недостаточность")
    .replace(/(?<![а-яa-z0-9])дн(?![а-яa-z0-9])/g, "дыхательная недостаточность")
    .replace(/(?<![а-яa-z0-9])ибс(?![а-яa-z0-9])/g, "ишемическая болезнь сердца")
    .replace(/(?<![а-яa-z0-9])окс(?![а-яa-z0-9])/g, "острый коронарный синдром")
    .replace(/(?<![а-яa-z0-9])овп(?![а-яa-z0-9])/g, "острая воспалительная патология")
    .replace(/(?<![а-яa-z0-9])оа(?![а-яa-z0-9])/g, "острый аппендицит")
    .replace(/(?<![а-яa-z0-9])ож(?![а-яa-z0-9])/g, "острый живот")
    .replace(/(?<![а-яa-z0-9])пкс(?![а-яa-z0-9])/g, "посткоронарный синдром")
    .replace(/(?<![а-яa-z0-9])окн(?![а-яa-z0-9])/g, "острая кишечная непроходимость")
    .replace(/(?<![а-яa-z0-9])двс(?![а-яa-z0-9])/g, "двс синдром")
    .replace(/(?<![а-яa-z0-9])впг(?![а-яa-z0-9])/g, "впг герпетический герпес")
    .replace(/(?<![а-яa-z0-9])дка(?![а-яa-z0-9])/g, "диабетический кетоацидоз")
    .replace(/(?<![а-яa-z0-9])ггс(?![а-яa-z0-9])/g, "гиперосмолярное гипергликемическое")
    .replace(/(?<![а-яa-z0-9])ст(?![а-яa-z0-9])/g, "подъем st")
    .replace(/(?<![а-яa-z0-9])пst(?![а-яa-z0-9])/g, "подъем st")
    .replace(/(?<![а-яa-z0-9])нst(?![а-яa-z0-9])/g, "без подъема st");

  // Remove non-alphanumeric chars except space
  s = s.replace(/[^a-zа-я0-9\s]/g, " ");
  // Collapse whitespace
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

export function stemRu(word) {
  if (!word) return "";
  return word
    .replace(/(?:ого|ему|ой|ый|ий|ая|яя|ого|ому|ым|ом|ать|ять|ить|еть|уть|тся|ться|тся|сь|т|е|и|а|у|о|ы|ь)$/g, "")
    .replace(/(?:овск|евск|инск|ниц|тель|ость|ение|ание|ение)$/g, "");
}

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

const QUALIFIERS = new Set([
  "острый", "острая", "острое", "острые",
  "хронический", "хроническая", "хроническое", "хронические",
  "подострый", "подострая",
  "тяжелый", "тяжелая", "тяжелое", "легкий", "легкая", "средней",
  "степени", "стадии", "типа", "формы"
]);

function matchDiagnosisSingle(normRef, normUser) {
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

