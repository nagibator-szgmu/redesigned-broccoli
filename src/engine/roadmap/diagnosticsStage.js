import { DIAGNOSTICS } from "../../data/diagnostics.js";

export function buildDiagnosticsStage({
  cd,
  sourceRef,
  selDiag = [],
  revealedResults = {},
}) {
  const needDiag = cd.needDiag || [];
  const orderedSet = new Set(selDiag || []);
  const diagItems = needDiag.map((testId) => {
    const diagDef = DIAGNOSTICS.find((d) => d.id === testId) || { id: testId, name: testId };
    const done = orderedSet.has(testId);
    return {
      id: testId,
      name: diagDef.name,
      done,
      krStatus: done ? "success" : "danger",
      resultText:
        revealedResults[testId] ||
        (cd.testResults && cd.testResults[testId]) ||
        "В пределах нормы",
      rationale: `Обязательный диагностический критерий стандарта: ${diagDef.name}.`,
    };
  });

  const diagDoneCount = diagItems.filter((i) => i.done).length;
  const isDiagFullyDone = diagItems.length > 0 && diagDoneCount === diagItems.length;
  const isDiagPartial = diagDoneCount > 0 && !isDiagFullyDone;

  return {
    id: "diagnostics",
    stepNumber: 3,
    title: "3. Лабораторная и инструментальная диагностика",
    icon: "🔬",
    status: isDiagFullyDone ? "done" : isDiagPartial ? "partial" : "missed",
    statusLabel: isDiagFullyDone
      ? "Выполнено полностью (хорошо)"
      : isDiagPartial
      ? `Выполнено частично (${diagDoneCount}/${diagItems.length})`
      : "Не выполнено (пропущено)",
    statusColor: isDiagFullyDone ? "green" : isDiagPartial ? "yellow" : "red",
    krReference: `${sourceRef} · Раздел 3. Диагностика`,
    rationale: `Клинические рекомендации предписывают обязательное выполнение ${diagItems.length} ключевых исследований для верификации диагноза и исключения жизнеугрожающих состояний.`,
    items: diagItems,
  };
}
