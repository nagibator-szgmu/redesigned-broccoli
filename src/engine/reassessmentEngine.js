/**
 * reassessmentEngine.js
 * Чистый детерминированный движок физиологической повторной оценки (Iterative Reassessment Engine).
 */

export function calculateMap(sbp, dbp) {
  if (typeof sbp !== "number" || typeof dbp !== "number" || sbp <= 0 || dbp <= 0) return null;
  return Math.round((sbp + 2 * dbp) / 3);
}

function evaluateParam(paramKey, name, beforeVal, afterVal, unit, evalFn) {
  if (beforeVal == null || afterVal == null || isNaN(beforeVal) || isNaN(afterVal)) {
    return { parameter: paramKey, name, before: beforeVal ?? "—", after: afterVal ?? "—", delta: 0, unit, direction: "not_assessable", status: "Недостаточно данных" };
  }
  const b = Number(beforeVal);
  const a = Number(afterVal);
  const delta = Math.round((a - b) * 10) / 10;
  if (Math.abs(delta) < 0.1) {
    return { parameter: paramKey, name, before: b, after: a, delta: 0, unit, direction: "unchanged", status: "Без существенной динамики" };
  }
  const { direction, status } = evalFn(b, a, delta);
  return { parameter: paramKey, name, before: b, after: a, delta, unit, direction, status };
}

/**
 * Выполняет сравнение физиологических параметров между baseline и current состояниями.
 */
export function evaluateReassessment(baselinePS, currentPS) {
  if (!baselinePS || !currentPS) {
    return { parameters: [], improvedCount: 0, worsenedCount: 0, overallResponse: "neutral", summaryText: "Отсутствуют физиологические данные", timestamp: Date.now() };
  }

  const params = [];

  // 1. ЧСС (HR)
  params.push(evaluateParam("hr", "ЧСС", baselinePS.hr, currentPS.hr, "уд/мин", (b, a, d) => {
    if (b > 100) return d < 0 ? { direction: "improved", status: "Купирование тахикардии" } : { direction: "worsened", status: "Нарастание тахикардии" };
    if (b < 50) return d > 0 ? { direction: "improved", status: "Разрешение брадикардии" } : { direction: "worsened", status: "Усугубление брадикардии" };
    return Math.abs(a - 75) < Math.abs(b - 75) ? { direction: "improved", status: "Стабилизация ритма" } : { direction: "worsened", status: "Отклонение от нормы" };
  }));

  // 2. Систолическое АД (SBP)
  params.push(evaluateParam("sbp", "САД", baselinePS.sbp, currentPS.sbp, "мм рт.ст.", (b, a, d) => {
    if (b < 90) return d > 0 ? { direction: "improved", status: "Восстановление перфузии (рост САД)" } : { direction: "worsened", status: "Усугубление гипотензии / коллапс" };
    if (b > 160) return d < 0 ? { direction: "improved", status: "Снижение гипертензии" } : { direction: "worsened", status: "Нарастание криза" };
    return Math.abs(a - 120) < Math.abs(b - 120) ? { direction: "improved", status: "Нормализация АД" } : { direction: "worsened", status: "Дестабилизация АД" };
  }));

  // 3. Диастолическое АД (DBP)
  params.push(evaluateParam("dbp", "ДАД", baselinePS.dbp, currentPS.dbp, "мм рт.ст.", (b, a, d) => {
    if (b < 60) return d > 0 ? { direction: "improved", status: "Рост ДАД" } : { direction: "worsened", status: "Падение ДАД" };
    return Math.abs(a - 80) < Math.abs(b - 80) ? { direction: "improved", status: "Нормализация ДАД" } : { direction: "worsened", status: "Колебания ДАД" };
  }));

  // 4. MAP (Среднее артериальное давление) — Guard
  const baseMap = calculateMap(baselinePS.sbp, baselinePS.dbp);
  const curMap = calculateMap(currentPS.sbp, currentPS.dbp);
  params.push(evaluateParam("map", "MAP", baseMap, curMap, "мм рт.ст.", (b, a, d) => {
    if (b < 65) return d > 0 ? { direction: "improved", status: "Восстановление перфузии (MAP ≥ 65)" } : { direction: "worsened", status: "Критическая гипоперфузия" };
    return Math.abs(a - 90) <= Math.abs(b - 90) ? { direction: "improved", status: "Адекватное среднее давление" } : { direction: "worsened", status: "Отклонение среднего давления" };
  }));

  // 5. SpO2 (Сатурация)
  params.push(evaluateParam("spo2", "SpO₂", baselinePS.spo2, currentPS.spo2, "%", (b, a, d) => {
    if (b < 95) return d > 0 ? { direction: "improved", status: "Оксигенация улучшена" } : { direction: "worsened", status: "Нарастание гипоксемии" };
    return a >= 95 ? { direction: "unchanged", status: "Нормоксия сохранена" } : { direction: "worsened", status: "Десатурация" };
  }));

  // 6. ЧДД (RR)
  params.push(evaluateParam("rr", "ЧДД", baselinePS.rr, currentPS.rr, "/мин", (b, a, d) => {
    if (b > 22) return d < 0 ? { direction: "improved", status: "Снижение тахипноэ" } : { direction: "worsened", status: "Усугубление дыхательной недостаточности" };
    if (b < 10) return d > 0 ? { direction: "improved", status: "Восстановление вентиляции" } : { direction: "worsened", status: "Угнетение дыхания" };
    return { direction: "unchanged", status: "Адекватная частота дыхания" };
  }));

  // 7. GCS (Шкала комы Глазго)
  params.push(evaluateParam("gcs", "ШКГ", baselinePS.gcs, currentPS.gcs, "баллов", (b, a, d) => {
    return d > 0 ? { direction: "improved", status: "Прояснение сознания" } : { direction: "worsened", status: "Угнетение сознания" };
  }));

  // 8. Боль (NRS)
  params.push(evaluateParam("pain", "Боль (NRS)", baselinePS.pain, currentPS.pain, "/10", (b, a, d) => {
    return d < 0 ? { direction: "improved", status: "Адекватная анальгезия" } : { direction: "worsened", status: "Усиление болевого синдрома" };
  }));

  // 9. Температура
  params.push(evaluateParam("temp", "t°C", baselinePS.temp, currentPS.temp, "°C", (b, a, d) => {
    if (b > 38.0) return d < 0 ? { direction: "improved", status: "Лизис лихорадки" } : { direction: "worsened", status: "Гипертермический пик" };
    return { direction: "unchanged", status: "Нормотермия" };
  }));

  const improvedCount = params.filter(p => p.direction === "improved").length;
  const worsenedCount = params.filter(p => p.direction === "worsened").length;

  let overallResponse = "neutral";
  let summaryText = "Физиологические параметры стабильны без существенной динамики";

  if (improvedCount > worsenedCount && worsenedCount === 0) {
    overallResponse = "positive";
    summaryText = "Положительная динамика: стабилизация витальных функций";
  } else if (improvedCount > 0 && worsenedCount > 0) {
    overallResponse = "mixed";
    summaryText = "Разнонаправленная динамика: частичный ответ с остаточными нарушениями";
  } else if (worsenedCount > improvedCount) {
    overallResponse = "negative";
    summaryText = "Отрицательная динамика: прогрессирование физиологической декомпенсации";
  }

  return { parameters: params, improvedCount, worsenedCount, overallResponse, summaryText, timestamp: Date.now() };
}

/**
 * Формирует неизменяемый снимок контрольной точки траектории (Checkpoint Snapshot).
 */
export function createReassessmentCheckpoint({ iteration = 1, checkpointId, previousState, currentState, activeProblems = [], recentInterventions = [], timestamp = Date.now() }) {
  const report = evaluateReassessment(previousState, currentState);
  return {
    checkpointId: checkpointId || `REASSESSMENT_${iteration}`,
    iteration,
    timestamp,
    vitals: { ...currentState },
    map: calculateMap(currentState.sbp, currentState.dbp),
    previousVitals: { ...previousState },
    parameters: report.parameters,
    improvedCount: report.improvedCount,
    worsenedCount: report.worsenedCount,
    overallResponse: report.overallResponse,
    summaryText: report.summaryText,
    activeProblems: [...activeProblems],
    recentInterventions: [...recentInterventions],
    trend: report.overallResponse === "positive" ? "improving" : report.overallResponse === "negative" ? "deteriorating" : "stable"
  };
}
