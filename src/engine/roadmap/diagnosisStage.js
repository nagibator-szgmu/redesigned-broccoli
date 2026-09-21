import { matchDiagnosisFuzzy } from "../../lib/stringMatcher.js";

export function buildDiagnosisStage({ cd, sourceRef, diagText = "" }) {
  const matchRatio = matchDiagnosisFuzzy(cd.diagnosis, diagText);
  const isDiagCorrect = matchRatio >= 0.5;

  let userEnteredSummary = diagText;
  if (typeof diagText === "string" && diagText.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(diagText);
      userEnteredSummary = parsed.main || diagText;
    } catch {
      // keep raw
    }
  }

  return {
    id: "diagnosis",
    stepNumber: 4,
    title: "4. Постановка клинического диагноза по КР",
    icon: "📝",
    status: isDiagCorrect ? "done" : "missed",
    statusLabel: isDiagCorrect
      ? "Диагноз верен (хорошо)"
      : "Диагноз ошибочен / не поставлен",
    statusColor: isDiagCorrect ? "green" : "red",
    krReference: `${sourceRef} · Раздел 4. Формулировка диагноза`,
    rationale: `Эталонный диагноз по клиническим рекомендациям: «${cd.diagnosis}».`,
    items: [
      {
        name: "Соответствие клинической нозологии",
        done: isDiagCorrect,
        detail: `Ваш ответ: «${userEnteredSummary || "(не введен)"}» → Эталон: «${cd.diagnosis}»`,
        krStatus: isDiagCorrect ? "success" : "danger",
      },
    ],
  };
}
