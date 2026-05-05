import { TREATMENTS, ADVERSE_REASONS } from "../data/treatments";
import { computeOutcome } from "./patient";

export function computeScore(cd, selDiag, selTreat, diagText, finalPS) {
  let score = 0;
  const dangerous = [];

  if (diagText) {
    const words = cd.diagnosis.toLowerCase().split(/[\s,.()/\-]+/).filter(w => w.length > 4);
    const hits = words.filter(w => diagText.toLowerCase().includes(w)).length;
    const r = hits / Math.max(words.length, 1);
    if (r >= 0.6) score += 35;
    else if (r >= 0.3) score += 20;
    else if (r > 0) score += 10;
  }

  const dh = cd.needDiag.filter(id => selDiag.includes(id)).length;
  score += Math.round((dh / Math.max(cd.needDiag.length, 1)) * 20);

  const th = cd.needTreat.filter(id => selTreat.includes(id)).length;
  score += Math.round((th / Math.max(cd.needTreat.length, 1)) * 25);

  cd.wrongTreat.forEach(id => {
    if (selTreat.includes(id)) {
      score = Math.max(0, score - 15);
      dangerous.push(TREATMENTS.find(t => t.id === id)?.name || id);
    }
  });

  const outcome = computeOutcome(finalPS);
  if (outcome === "stable") score += 20;
  else if (outcome === "unstable") score += 10;
  else if (outcome === "critical") score += 3;
  else if (outcome === "dead") score = Math.max(0, score - 20);

  score = Math.min(100, Math.max(0, score));
  const grade = score >= 85 ? "Отлично" : score >= 70 ? "Хорошо" : score >= 50 ? "Удовлетворительно" : "Неудовлетворительно";

  const words2 = cd.diagnosis.toLowerCase().split(/[\s,.()/\-]+/).filter(w => w.length > 4);
  const r2 = diagText
    ? words2.filter(w => diagText.toLowerCase().includes(w)).length / Math.max(words2.length, 1)
    : 0;

  return { score, grade, dangerous, diagCorrect: r2 >= 0.6, diagPartial: r2 >= 0.3, outcome };
}
