import { DIAGNOSTICS } from "../../../../data/diagnostics";

/**
 * Извлекает опорные клинические критерии (жалобы, гемодинамику, дыхание, выполненные исследования)
 * для формулирования обоснования диагноза.
 *
 * @param {Object} cd - Данные клинического кейса
 * @param {Array<string>} [orderedDiag=[]] - Идентификаторы заказанных диагностических тестов
 * @returns {Array<{id: string, category: string, icon: string, label: string}>}
 */
export function deriveAvailableCriteria(cd, orderedDiag = []) {
  if (!cd) return [];
  const items = [];

  // 1. Жалобы и ведущие симптомы
  if (cd.complaint) {
    items.push({
      id: "complaint",
      category: "Жалобы",
      icon: "💬",
      label: cd.complaint,
    });
  }

  // 2. Гемодинамические и витальные маркеры
  if (cd.vitals) {
    const sbp = parseInt(String(cd.vitals.bp || "").split("/")[0], 10);
    if (sbp && sbp < 90) {
      items.push({
        id: "vital_hypotension",
        category: "Гемодинамика",
        icon: "🚨",
        label: `Гипотензия / шок (АД ${cd.vitals.bp} мм рт. ст.)`,
      });
    }
    if (cd.vitals.hr >= 100) {
      items.push({
        id: "vital_tachycardia",
        category: "Гемодинамика",
        icon: "⚡",
        label: `Тахикардия (ЧСС ${cd.vitals.hr} уд/мин)`,
      });
    } else if (cd.vitals.hr < 50) {
      items.push({
        id: "vital_bradycardia",
        category: "Гемодинамика",
        icon: "⚡",
        label: `Брадикардия (ЧСС ${cd.vitals.hr} уд/мин)`,
      });
    }
    if (cd.vitals.spo2 && cd.vitals.spo2 < 93) {
      items.push({
        id: "vital_hypoxia",
        category: "Дыхание",
        icon: "🫁",
        label: `Острая гипоксемия (SpO₂ ${cd.vitals.spo2}%)`,
      });
    }
    if (cd.vitals.rr && cd.vitals.rr >= 24) {
      items.push({
        id: "vital_tachypnea",
        category: "Дыхание",
        icon: "🫁",
        label: `Тахипноэ / одышка (ЧД ${cd.vitals.rr} в мин)`,
      });
    }
  }

  // 3. Выполненные исследования и их результаты
  orderedDiag.forEach(testId => {
    const diagInfo = DIAGNOSTICS.find(d => d.id === testId);
    const testName = diagInfo?.name || testId;
    const resultText = cd.testResults?.[testId];

    if (resultText) {
      items.push({
        id: `test_${testId}`,
        category: "Исследования",
        icon: "🔬",
        label: `${testName}: ${resultText}`,
      });
    }
  });

  return items;
}
