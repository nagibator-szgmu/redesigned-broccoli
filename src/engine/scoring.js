import { TREATMENTS } from "../data/treatments";
import { computeOutcome } from "./patient";

export const WRONG_TREATMENT_PENALTY = 15;

function stemRu(word) {
  return word
    .replace(/(?:ого|ему|ой|ый|ий|ая|яя|ого|ому|ым|ом|ать|ять|ить|еть|уть|тся|ться|тся|сь|т|е|и|а|у|о|ы|ь)$/g, "")
    .replace(/(?:овск|евск|инск|ниц|тель|ость|ение|ание|ение)$/g, "");
}

function normalizeMedicalTerms(text) {
  if (!text) return "";
  return text.toLowerCase()
    .replace(/\bоим\b/g, "острый инфаркт миокарда")
    .replace(/\bоимпst\b/g, "инфаркт миокарда с подъемом st")
    .replace(/\bоимбst\b/g, "инфаркт миокарда без подъема st")
    .replace(/\bонмк\b/g, "инсульт нарушение мозгового кровообращения")
    .replace(/\bтиа\b/g, "транзиторная ишемическая атака")
    .replace(/\bтэла\b/g, "тромбоэмболия легочной артерии")
    .replace(/\bхсн\b/g, "хроническая сердечная недостаточность")
    .replace(/\bодн\b/g, "острая дыхательная недостаточность")
    .replace(/\bдн\b/g, "дыхательная недостаточность")
    .replace(/\bибс\b/g, "ишемическая болезнь сердца")
    .replace(/\bовп\b/g, "острая воспалительная патология")
    .replace(/\bоа\b/g, "острый аппендицит")
    .replace(/\bож\b/g, "острый живот")
    .replace(/\bпкс\b/g, "посткоронарный синдром")
    .replace(/\bабсцесс\b/g, "гнойник")
    .replace(/\bокн\b/g, "острая кишечная непроходимость")
    .replace(/\bст\b/g, "подъем сегмента st")
    .replace(/\bпst\b/g, "подъем st")
    .replace(/\bнst\b/g, "без подъема st");
}

/** Доля слов диагноза (длинее 2 символов), встретившихся в ответе игрока (со стеммингом и нормализацией). */
export function diagMatchRatio(diagnosis, diagText) {
  if (!diagText) return 0;
  
  const normDiag = normalizeMedicalTerms(diagnosis);
  const normUser = normalizeMedicalTerms(diagText);
  
  const words = normDiag.split(/[\s,.()/ -]+/).filter(w => w.length >= 3);
  const patientStems = new Set(normUser.split(/[\s,.()/ -]+/).map(stemRu));
  
  const hits = words.filter(w => normUser.includes(w) || patientStems.has(stemRu(w))).length;
  return hits / Math.max(words.length, 1);
}

/**
 * Вычисляет бонус за время (0-15 баллов).
 * Чем быстрее завершён случай, тем выше бонус.
 * @param {number} elapsed - прошедшее время в секундах
 * @param {number} timeLimit - лимит времени в минутах
 */
export function computeTimeBonus(elapsed, timeLimit) {
  const limitSec = timeLimit * 60;
  const remaining = Math.max(0, limitSec - elapsed);
  const ratio = remaining / limitSec;
  if (ratio >= 0.7) return 15;
  if (ratio >= 0.5) return 12;
  if (ratio >= 0.3) return 8;
  if (ratio >= 0.1) return 4;
  return 0;
}

export function computeScore(cd, selDiag, selTreat, diagText, finalPS, elapsedSec, revealedAnamnesis) {
  let score = 0;
  const dangerous = [];

  const ratio = diagMatchRatio(cd.diagnosis, diagText);
  if (ratio >= 0.6) score += 35;
  else if (ratio >= 0.3) score += 20;
  else if (ratio > 0) score += 10;

  const dh = cd.needDiag.filter(id => selDiag.includes(id)).length;
  score += Math.round((dh / Math.max(cd.needDiag.length, 1)) * 20);

  const rev = revealedAnamnesis || new Set();
  const anamnesisRequired = [];
  if (cd.department === "outpatient" || cd.department === "stationary") {
    if (cd.historyOfIllness) anamnesisRequired.push("historyOfIllness");
    if (cd.lifeHistory) anamnesisRequired.push("lifeHistory");
  } else if (cd.department === "admission") {
    if (cd.shortHistory) anamnesisRequired.push("shortHistory");
  }
  const anamnesisRevealed = anamnesisRequired.filter(k => rev.has(k)).length;
  score += Math.round((anamnesisRevealed / Math.max(anamnesisRequired.length, 1)) * 10);

  const th = cd.needTreat.filter(id => selTreat.includes(id)).length;
  score += Math.round((th / Math.max(cd.needTreat.length, 1)) * 20);

  cd.wrongTreat.forEach(id => {
    if (selTreat.includes(id)) {
      score = Math.max(0, score - WRONG_TREATMENT_PENALTY);
      dangerous.push(TREATMENTS.find(t => t.id === id)?.name || id);
    }
  });

  if (cd.lifeHistoryContraindications && cd.lifeHistoryContraindications.length > 0) {
    const lifeRevealed = rev.has("lifeHistory");
    if (!lifeRevealed) {
      cd.lifeHistoryContraindications.forEach(id => {
        if (selTreat.includes(id) && !cd.wrongTreat.includes(id)) {
          score = Math.max(0, score - WRONG_TREATMENT_PENALTY);
          dangerous.push(`${TREATMENTS.find(t => t.id === id)?.name || id} — можно было предотвратить, если бы был собран анамнез жизни`);
        }
      });
    }
  }

  const outcome = computeOutcome(finalPS, cd, cd.department);
  if (outcome === "stable") score += 20;
  else if (outcome === "stabilized") score += 20;
  else if (outcome === "unstable") score += 10;
  else if (outcome === "critical") score += 3;
  else if (outcome === "transferToICU") score += 5;
  else if (outcome === "routed") score += 15;
  else if (outcome === "timeout_no_route") score = Math.max(0, score - 10);
  else if (outcome === "dead") score = Math.max(0, score - 20);

  if (elapsedSec !== undefined) {
    score += computeTimeBonus(elapsedSec, cd.timeLimit);
  }

  score = Math.min(100, Math.max(0, score));
  const gradeId = score >= 85 ? "excellent" : score >= 70 ? "good" : score >= 50 ? "satisfactory" : "unsatisfactory";

  return { score, gradeId, dangerous, diagCorrect: ratio >= 0.6, diagPartial: ratio >= 0.3, outcome };
}
