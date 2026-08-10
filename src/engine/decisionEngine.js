/**
 * decisionEngine.js
 * 
 * Чистый детерминированный движок анализа клинической ситуации и формирования плана (Clinical Decision Engine V2.5).
 * Оценивает результаты повторной оценки и предлагает структурированные направления для пересмотра тактики:
 * CONTINUE, ESCALATE, MODIFY, NEW_TEST, STOP / DE-ESCALATE, EMERGENCY_RESPONSE.
 */

/**
 * Анализирует физиологический ответ и генерирует структурированную клиническую сводку для принятия решений.
 * @param {Object} reassessmentReport - Отчет от reassessmentEngine
 * @param {Array<Object>} problemTransitions - Список проблем с динамическими статусами от problemListEngine
 * @param {Object} currentPS - Текущие виталы пациента для оценки критичности
 * @returns {Object} Структурированная клиническая оценка для принятия решения
 */
export function evaluateClinicalDecision(reassessmentReport = {}, problemTransitions = [], currentPS = {}) {
  const overall = reassessmentReport.overallResponse || "neutral";
  const params = reassessmentReport.parameters || [];

  const improvedParams = params.filter(p => p.direction === "improved");
  const worsenedParams = params.filter(p => p.direction === "worsened");

  const resolvedProblems = problemTransitions.filter(p => p.status === "resolved");
  const activeOrPersistent = problemTransitions.filter(p => p.status === "active" || p.status === "persistent" || p.status === "worsening");
  const improvingProblems = problemTransitions.filter(p => p.status === "improving");

  const isExtremeCritical = (currentPS.sbp != null && currentPS.sbp > 0 && currentPS.sbp < 75) ||
    (currentPS.spo2 != null && currentPS.spo2 < 85) ||
    (currentPS.gcs != null && currentPS.gcs <= 8);

  if (overall === "positive") {
    const plans = [
      { id: "continue", label: "Продолжить текущую поддерживающую терапию", description: "Сохранить параметры инфузии и оксигенации без изменений." },
      { id: "confirmatory_test", label: "Назначить уточняющую диагностику", description: "Провести инструментальные исследования для окончательной верификации." }
    ];

    if (activeOrPersistent.length === 0) {
      plans.push({ id: "deescalate", label: "Начать деэскалацию терапии (Stop / De-escalate)", description: "Постепенное титрование дозировок при стойкой стабилизации." });
    } else {
      plans.push({ id: "reassess_later", label: "Запланировать контрольную оценку", description: "Оценить динамику через следующий интервал симуляции." });
    }

    return {
      type: "IMPROVED",
      badge: "ПОЛОЖИТЕЛЬНЫЙ ОТВЕТ",
      headline: "Положительный физиологический ответ на проводимую терапию",
      improvedParams,
      worsenedParams: [],
      resolvedProblems,
      remainingProblems: [...activeOrPersistent, ...improvingProblems],
      recommendation: "Продолжить мониторинг. При стойкой нормоксии и нормотензии рассмотреть постепенную деэскалацию поддержки.",
      suggestedPlans: plans
    };
  }

  if (overall === "negative" || isExtremeCritical) {
    const plans = [];
    if (isExtremeCritical) {
      plans.push({ id: "emergency_response", label: "Экстренный реанимационный ответ (Emergency Response)", description: "Немедленная коррекция проходимости дыхательных путей, кислород 100%, болюс кристаллоидов / вазопрессоры." });
    }
    plans.push({ id: "escalate", label: "Экстренно эскалировать терапию", description: "Подключить инотропную/вазопрессорную поддержку, ИВЛ или инвазивные пособия." });
    plans.push({ id: "revise_diagnosis", label: "Пересмотреть рабочий диагноз", description: "Исключить альтернативные угрожающие жизни синдромы (ТЭЛА, тампонада, расслоение аорты)." });
    plans.push({ id: "urgent_test", label: "Экстренная визуализация / лаб. контроль", description: "Выполнить ЭКГ, КТ-ангиографию или УЗИ FAST." });

    return {
      type: "WORSENED",
      badge: isExtremeCritical ? "КРИТИЧЕСКИЙ РЕАНИМАЦИОННЫЙ СТАТУС" : "ФИЗИОЛОГИЧЕСКАЯ ДЕКОМПЕНСАЦИЯ",
      headline: isExtremeCritical ? "Критическое состояние: угроза остановки кровообращения" : "Отрицательная динамика: проводимые вмешательства недостаточны",
      improvedParams,
      worsenedParams,
      resolvedProblems,
      remainingProblems: activeOrPersistent,
      recommendation: "Критическая ситуация: нарастание органной гипоперфузии или гипоксемии. Требуется немедленная эскалация терапии и исключение угрожающих нозологий.",
      suggestedPlans: plans.slice(0, 3)
    };
  }

  return {
    type: "UNCHANGED",
    badge: "БЕЗ ЗНАЧИМОГО ОТВЕТА",
    headline: "Отсутствие выраженного физиологического ответа",
    improvedParams,
    worsenedParams,
    resolvedProblems,
    remainingProblems: activeOrPersistent,
    recommendation: "Витальные параметры остаются на прежнем уровне. Требуется пересмотреть дозировки, модифицировать терапию или расширить диагностический поиск.",
    suggestedPlans: [
      { id: "modify_therapy", label: "Скорректировать или добавить терапию (Modify)", description: "Увеличить объем инфузии, скорректировать анальгезию/вазоактивную поддержку." },
      { id: "broaden_differential", label: "Расширить дифференциальный поиск", description: "Оценить альтернативные гипотезы из клинического ряда." },
      { id: "new_test", label: "Назначить дополнительные диагностические тесты", description: "Провести маркеры некроза, газы крови или УЗИ." }
    ]
  };
}
