/**
 * safetyMistakesMapper.js
 * Преобразует результаты анализа safetyEngine в структурированный массив ошибок result.mistakes[].
 */

function formatSeqTitle(type) {
  switch (type) {
    case "deterioration_with_contraindication":
      return "Терапия на фоне декомпенсации";
    case "blind_polypharmacy_no_reassessment":
      return "Полипрагмазия без повторной оценки";
    case "missed_escalation":
      return "Пропуск реанимационной эскалации";
    default:
      return "Нарушение протокола этапности";
  }
}

/**
 * Преобразует вывод evaluateClinicalSafety в нормализованный список ошибок для ResultErrorsTab.
 * @param {Object} safety - Результат evaluateClinicalSafety
 * @param {Object} cd - Клинический кейс
 * @returns {Array<Object>} Массив структурированных ошибок с баллами и клинреками
 */
export function mapSafetyToMistakes(safety = {}, cd = {}) {
  const mistakes = [];
  const defaultRef = cd.sourceReference?.name
    ? `${cd.sourceReference.name} (${cd.sourceReference.year || 2024})`
    : "Клинические рекомендации Минздрава РФ";

  // 1. Критические ошибки (прямые противопоказания)
  (safety.criticalErrors || []).forEach((e, idx) => {
    mistakes.push({
      id: `crit_${e.id || idx}`,
      title: `Критическая ошибка: ${e.name || "Противопоказание"}`,
      severity: "critical",
      penalty: 15,
      reason: e.explanation || "Препарат категорически противопоказан при данной патологии.",
      guidelineRef: defaultRef,
    });
  });

  // 2. Дефекты анамнеза жизни и скрытые противопоказания
  (safety.majorErrors || []).forEach((e, idx) => {
    mistakes.push({
      id: `maj_${e.id || idx}`,
      title: `Дефект тактики: ${e.name || "Скрытое противопоказание"}`,
      severity: "major",
      penalty: 10,
      reason: e.explanation || "Назначение при несобранном анамнезе жизни и аллергоанамнезе.",
      guidelineRef: defaultRef,
    });
  });

  // 3. Последовательные ошибки и реанимация
  (safety.sequentialErrors || []).forEach((e, idx) => {
    const isCrit = e.severity === "critical";
    mistakes.push({
      id: `seq_${e.type || idx}`,
      title: `Тактический дефект: ${formatSeqTitle(e.type)}`,
      severity: e.severity || "major",
      penalty: isCrit ? 15 : 10,
      reason: e.explanation || "Нарушение этапности контроля гемодинамики пациента.",
      guidelineRef: "Стандарты безопасности и реанимационной помощи РФ",
    });
  });

  return mistakes;
}
