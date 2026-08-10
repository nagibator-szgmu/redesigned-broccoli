/**
 * differentialEngine.js
 * 
 * Движок дифференциально-диагностического ранжирования гипотез.
 * Детерминированная модель клинического рассуждения, вычисляющая эвристические веса
 * конкурирующих нозологий на основе поступающих доказательств (симптомы, ЭКГ, маркеры).
 */

const ALTERNATIVE_POOLS = {
  cardiac: [
    { id: "alt_pe", name: "Тромбоэмболия легочной артерии (ТЭЛА)", baseWeight: 25, danger: true },
    { id: "alt_aorta", name: "Острое расслоение аорты", baseWeight: 15, danger: true },
    { id: "alt_pericarditis", name: "Острый перикардит", baseWeight: 20, danger: false },
    { id: "alt_pneu", name: "Спонтанный пневмоторакс", baseWeight: 10, danger: true },
  ],
  neuro: [
    { id: "alt_ischemic", name: "Ишемический инсульт", baseWeight: 30, danger: true },
    { id: "alt_hemorrhagic", name: "Субарахноидальное кровоизлияние", baseWeight: 25, danger: true },
    { id: "alt_meningitis", name: "Бактериальный менингит", baseWeight: 20, danger: true },
    { id: "alt_hypoglycemia", name: "Гипогликемическая кома", baseWeight: 15, danger: false },
  ],
  respiratory: [
    { id: "alt_copd_exac", name: "Обострение ХОБЛ с дыхательной недостаточностью", baseWeight: 35, danger: false },
    { id: "alt_asthma", name: "Тяжелый астматический статус", baseWeight: 25, danger: true },
    { id: "alt_pneumonia", name: "Внебольничная пневмония тяжелого течения", baseWeight: 25, danger: false },
    { id: "alt_pneumothorax", name: "Напряженный пневмоторакс", baseWeight: 15, danger: true },
  ],
  infectious: [
    { id: "alt_septic_shock", name: "Септический шок с полиорганной недостаточностью", baseWeight: 40, danger: true },
    { id: "alt_urosepsis", name: "Уросепсис тяжелого течения", baseWeight: 25, danger: false },
    { id: "alt_pneumosepsis", name: "Легочный сепсис", baseWeight: 25, danger: false },
  ],
  toxicology: [
    { id: "alt_opioid", name: "Острое отравление опиоидами", baseWeight: 35, danger: true },
    { id: "alt_benzo", name: "Интоксикация бензодиазепинами", baseWeight: 25, danger: false },
    { id: "alt_alcohol", name: "Тяжелая алкогольная кома", baseWeight: 20, danger: false },
    { id: "alt_co", name: "Отравление угарным газом (CO)", baseWeight: 20, danger: true },
  ],
  abdominal: [
    { id: "alt_pancreatitis", name: "Острый деструктивный панкреатит", baseWeight: 30, danger: true },
    { id: "alt_peritonitis", name: "Острый перитонит / Перфорация полого органа", baseWeight: 35, danger: true },
    { id: "alt_cholecystitis", name: "Острый деструктивный холецистит", baseWeight: 20, danger: false },
    { id: "alt_obstruction", name: "Острая кишечная непроходимость", baseWeight: 15, danger: true },
  ],
};

function calculateProbabilities(baseHypotheses, neededDiag, evidenceList) {
  const needed = new Set(neededDiag || []);
  let primaryDelta = 0;
  let altDelta = 0;

  evidenceList.forEach(evId => {
    if (needed.has(evId)) {
      primaryDelta += 18;
      altDelta -= 8;
    } else {
      primaryDelta += 5;
      altDelta += 2;
    }
  });

  const updated = baseHypotheses.map(h => {
    const delta = h.isPrimary ? primaryDelta : altDelta;
    const newWeight = Math.max(5, Math.min(95, h.baseWeight + delta));
    return { ...h, weight: newWeight };
  });

  const total = updated.reduce((acc, h) => acc + h.weight, 0) || 1;
  return updated.map(h => ({
    ...h,
    probabilityPct: Math.round((h.weight / total) * 100),
  }));
}

/**
 * Создает экземпляр дифференциального движка для клинического случая.
 * @param {Object} caseData - Данные клинического случая
 * @returns {Object} Экземпляр дифференциального движка
 */
export function createDifferentialEngine(caseData) {
  if (!caseData) return null;

  const primaryDiagnosis = caseData.diagnosis || "Основное заболевание";
  const category = caseData.category || "cardiac";
  const pool = ALTERNATIVE_POOLS[category] || ALTERNATIVE_POOLS.cardiac;

  const baseHypotheses = [
    { id: "primary", name: primaryDiagnosis, baseWeight: 45, isPrimary: true, danger: false },
    ...pool.slice(0, 3).map(p => ({ id: p.id, name: p.name, baseWeight: p.baseWeight, isPrimary: false, danger: p.danger })),
  ];

  const evidenceList = new Set();
  const hypotheses = calculateProbabilities(baseHypotheses, caseData.needDiag, evidenceList);

  return {
    caseId: caseData.id,
    caseData,
    baseHypotheses,
    evidenceList,
    hypotheses,
  };
}

/**
 * Добавляет доказательство в дифференциальный движок и пересчитывает веса.
 * @param {Object} engine - Экземпляр движка
 * @param {string} evidenceId - ID выполненного теста или осмотра
 * @returns {Object} Обновленный движок
 */
export function addClinicalEvidence(engine, evidenceId) {
  if (!engine || !evidenceId) return engine;
  const newEv = new Set(engine.evidenceList);
  newEv.add(evidenceId);

  const hypotheses = calculateProbabilities(engine.baseHypotheses, engine.caseData.needDiag, newEv);
  return {
    ...engine,
    evidenceList: newEv,
    hypotheses,
  };
}

/**
 * Удаляет доказательство из движка и пересчитывает веса.
 * @param {Object} engine - Экземпляр движка
 * @param {string} evidenceId - ID доказательства
 * @returns {Object} Обновленный движок
 */
export function removeClinicalEvidence(engine, evidenceId) {
  if (!engine || !evidenceId) return engine;
  const newEv = new Set(engine.evidenceList);
  newEv.delete(evidenceId);

  const hypotheses = calculateProbabilities(engine.baseHypotheses, engine.caseData.needDiag, newEv);
  return {
    ...engine,
    evidenceList: newEv,
    hypotheses,
  };
}

/**
 * Возвращает ранжированный список дифференциальных гипотез.
 * @param {Object} engine - Экземпляр движка
 * @returns {Array<Object>} Список гипотез от наибольшей вероятности к наименьшей
 */
export function getRankedHypotheses(engine) {
  if (!engine || !engine.hypotheses) return [];
  return [...engine.hypotheses].sort((a, b) => (b.probabilityPct || b.weight) - (a.probabilityPct || a.weight));
}

/**
 * Возвращает текущую ведущую диагностическую гипотезу.
 * @param {Object} engine - Экземпляр движка
 * @returns {Object|null} Ведущая гипотеза
 */
export function getLeadingHypothesis(engine) {
  const ranked = getRankedHypotheses(engine);
  return ranked[0] || null;
}
