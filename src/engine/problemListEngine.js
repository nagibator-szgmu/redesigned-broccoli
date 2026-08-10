/**
 * problemListEngine.js
 * Чистый детерминированный движок списка клинических проблем и отслеживания их статусов.
 */

export function deriveProblemList(ps, revealedResults = {}) {
  if (!ps) return [];
  const problems = [];

  // 1. Дыхание
  if (ps.spo2 != null && ps.spo2 < 94) {
    const isCritical = ps.spo2 < 90;
    const evidence = [`SpO₂ ${Math.round(ps.spo2)}% (норма ≥ 95%)`];
    if (ps.rr != null && ps.rr > 22) evidence.push(`ЧДД ${Math.round(ps.rr)}/мин`);
    problems.push({
      id: "hypoxemia",
      label: isCritical ? "Тяжелая острая гипоксемия" : "Умеренная гипоксемия",
      category: "airway_breathing",
      severity: isCritical ? "critical" : "moderate",
      evidence,
      status: "active"
    });
  } else if (ps.rr != null && (ps.rr > 26 || ps.rr < 10)) {
    problems.push({
      id: "ventilatory_failure",
      label: ps.rr > 26 ? "Тахипноэ / Респираторный дистресс" : "Угнетение дыхания / Брадипноэ",
      category: "airway_breathing",
      severity: ps.rr > 32 || ps.rr < 8 ? "critical" : "moderate",
      evidence: [`ЧДД ${Math.round(ps.rr)}/мин`],
      status: "active"
    });
  }

  // 2. Гемодинамика
  if (ps.sbp != null && ps.sbp > 0 && ps.sbp < 90) {
    const isCritical = ps.sbp < 75;
    const evidence = [`АД ${Math.round(ps.sbp)}/${Math.round(ps.dbp || 0)} мм рт.ст.`];
    if (ps.hr != null) evidence.push(`ЧСС ${Math.round(ps.hr)} уд/мин`);
    problems.push({
      id: "hemodynamic_shock",
      label: isCritical ? "Острый циркуляторный коллапс / Шок" : "Артериальная гипотензия",
      category: "circulation",
      severity: isCritical ? "critical" : "moderate",
      evidence,
      status: "active"
    });
  } else if (ps.sbp != null && ps.sbp > 170) {
    problems.push({
      id: "severe_hypertension",
      label: "Тяжелая артериальная гипертензия",
      category: "circulation",
      severity: ps.sbp >= 200 ? "critical" : "moderate",
      evidence: [`САД ${Math.round(ps.sbp)} мм рт.ст.`],
      status: "active"
    });
  }

  // 3. Ритм
  if (ps.hr != null) {
    if (ps.hr > 105) {
      problems.push({
        id: "tachycardia",
        label: ps.hr > 135 ? "Выраженная тахикардия" : "Синусовая тахикардия",
        category: "circulation",
        severity: ps.hr > 135 ? "critical" : "moderate",
        evidence: [`ЧСС ${Math.round(ps.hr)} уд/мин`],
        status: "active"
      });
    } else if (ps.hr > 0 && ps.hr < 50) {
      problems.push({
        id: "bradycardia",
        label: ps.hr < 40 ? "Критическая брадикардия" : "Умеренная брадикардия",
        category: "circulation",
        severity: ps.hr < 40 ? "critical" : "moderate",
        evidence: [`ЧСС ${Math.round(ps.hr)} уд/мин`],
        status: "active"
      });
    }
  }

  // 4. Сознание
  if (ps.gcs != null && ps.gcs < 14) {
    const isComa = ps.gcs <= 8;
    problems.push({
      id: "altered_mental_status",
      label: isComa ? "Кома / Угнетение сознания" : "Оглушение / Сопор",
      category: "disability",
      severity: isComa ? "critical" : "moderate",
      evidence: [`Шкала Глазго: ${Math.round(ps.gcs)}`],
      status: "active"
    });
  }

  // 5. Боль
  if (ps.pain != null && ps.pain >= 5) {
    problems.push({
      id: "severe_pain",
      label: ps.pain >= 8 ? "Интенсивный болевой синдром" : "Умеренная боль",
      category: "disability",
      severity: ps.pain >= 8 ? "critical" : "moderate",
      evidence: [`Шкала боли: ${Math.round(ps.pain)}/10`],
      status: "active"
    });
  }

  // 6. Температура
  if (ps.temp != null) {
    if (ps.temp >= 38.5) {
      problems.push({
        id: "hyperthermia",
        label: ps.temp >= 39.5 ? "Высокая лихорадка" : "Фебрильная температура",
        category: "metabolic",
        severity: ps.temp >= 39.5 ? "critical" : "moderate",
        evidence: [`t°C ${ps.temp}`],
        status: "active"
      });
    } else if (ps.temp < 35.5) {
      problems.push({
        id: "hypothermia",
        label: "Гипотермия",
        category: "metabolic",
        severity: ps.temp < 34.0 ? "critical" : "moderate",
        evidence: [`t°C ${ps.temp}`],
        status: "active"
      });
    }
  }

  // 7. Лабораторные синдромы
  if (revealedResults.troponin && (revealedResults.troponin.includes("🔴") || revealedResults.troponin.includes("ОИМ") || revealedResults.troponin.includes("повышен"))) {
    problems.push({
      id: "myocardial_necrosis",
      label: "Острое повреждение миокарда",
      category: "laboratory",
      severity: "critical",
      evidence: ["Положительный hs-cTnI"],
      status: "active"
    });
  }

  if (revealedResults.abg && (revealedResults.abg.includes("ацидоз") || revealedResults.abg.includes("pH <") || revealedResults.abg.includes("7.2"))) {
    problems.push({
      id: "severe_acidemia",
      label: "Декомпенсированный ацидоз",
      category: "laboratory",
      severity: "critical",
      evidence: ["КЩС: ацидоз"],
      status: "active"
    });
  }

  return problems;
}

/**
 * Оценивает переходы статусов клинических проблем между двумя контрольными точками.
 * @param {Array<Object>} prevProblems - Проблемы в предыдущей точке
 * @param {Array<Object>} curProblems - Проблемы в текущей точке
 * @returns {Array<Object>} Полный список проблем с динамическими статусами (ACTIVE, IMPROVING, RESOLVED, WORSENING, PERSISTENT)
 */
export function evaluateProblemTransitions(prevProblems = [], curProblems = []) {
  const result = [];
  const curMap = new Map(curProblems.map(p => [p.id, p]));

  prevProblems.forEach(prev => {
    const cur = curMap.get(prev.id);
    if (!cur) {
      result.push({ ...prev, status: "resolved", transitionNote: "Синдром успешно купирован / разрешён" });
    } else {
      let status = "persistent";
      let transitionNote = "Синдром сохраняется";
      if (prev.severity === "critical" && cur.severity === "moderate") {
        status = "improving";
        transitionNote = "Тяжесть снизилась с критической до умеренной";
      } else if (prev.severity === "moderate" && cur.severity === "critical") {
        status = "worsening";
        transitionNote = "Нарастание тяжести синдрома до критической";
      }
      result.push({ ...cur, status, transitionNote });
      curMap.delete(prev.id);
    }
  });

  curMap.forEach(newProb => {
    result.push({ ...newProb, status: "active", transitionNote: "Вновь возникший синдром" });
  });

  return result;
}
