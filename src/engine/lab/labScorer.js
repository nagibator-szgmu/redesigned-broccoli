/**
 * Оценка точности интерпретации лабораторных анализов пользователем.
 */
export function scoreLabEvaluation(parsedItems = [], userEvaluations = {}) {
  if (parsedItems.length === 0) {
    return {
      totalCount: 0,
      evaluatedCount: 0,
      correctCount: 0,
      scorePercent: 0,
      isComplete: false,
      mistakes: [],
      allCorrect: false,
      feedbackText: "Исследования не загружены.",
    };
  }

  let evaluatedCount = 0;
  let correctCount = 0;
  const mistakes = [];

  parsedItems.forEach((item) => {
    const userChoice = userEvaluations[item.id];
    if (userChoice) {
      evaluatedCount += 1;
      const expected = item.isActuallyAbnormal ? "abnormal" : "normal";
      const isCorrect = userChoice === expected;

      if (isCorrect) {
        correctCount += 1;
      } else {
        mistakes.push({
          id: item.id,
          name: item.name,
          userChoice,
          expected,
          type: item.isActuallyAbnormal ? "missed_pathology" : "false_alarm",
          explanation: item.explanation,
        });
      }
    }
  });

  const totalCount = parsedItems.length;
  const isComplete = evaluatedCount === totalCount;
  const scorePercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const allCorrect = isComplete && mistakes.length === 0;

  let feedbackText = "";
  if (!isComplete) {
    feedbackText = `Оценено ${evaluatedCount} из ${totalCount} показателей. Завершите анализ всех строк.`;
  } else if (allCorrect) {
    feedbackText = `Безупречный анализ: все ${totalCount} показателей интерпретированы верно!`;
  } else {
    const missedCount = mistakes.filter((m) => m.type === "missed_pathology").length;
    if (missedCount > 0) {
      feedbackText = `Внимание: пропущено ${missedCount} патологических отклонений! Обратите внимание на референсные нормы.`;
    } else {
      feedbackText = `Допущена гипердиагностика (${mistakes.length} ложных отклонений). Внимательно сверяйте референсы.`;
    }
  }

  return {
    totalCount,
    evaluatedCount,
    correctCount,
    scorePercent,
    isComplete,
    mistakes,
    allCorrect,
    feedbackText,
  };
}
