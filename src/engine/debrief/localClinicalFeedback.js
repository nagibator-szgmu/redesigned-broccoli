/**
 * localClinicalFeedback.js
 * Автономный детерминированный генератор экспертного клинического заключения
 * без необходимости подключения к внешним LLM API.
 */

import { diagMatchRatio } from "../scoring.js";
import { DIAGNOSTICS } from "../../data/diagnostics.js";
import { TREATMENTS } from "../../data/treatments.js";

/**
 * Генерирует экспертную клиническую рецензию на действия студента.
 * @param {Object} cd - Клинический кейс
 * @param {string} diagText - Введенный студентом диагноз
 * @param {Array<string>} selDiag - Назначенные исследования
 * @param {Array<string>} selTreat - Назначенное лечение
 * @param {Object} [safety] - Результаты evaluateClinicalSafety
 * @returns {{ diagScore: number, feedback: string, errors: string[] }}
 */
export function generateLocalClinicalFeedback(cd = {}, diagText = "", selDiag = [], selTreat = [], safety = {}) {
  const cleanDiag = String(diagText || "").trim();
  const ratio = diagMatchRatio(cd.diagnosis || "", cleanDiag);

  let diagScore = 0;
  let feedback = "";
  const errors = [];

  // 1. Оценка точности диагноза
  if (ratio >= 0.6) {
    diagScore = 35;
    feedback = "Клинический диагноз сформулирован точно. Ведущий патологический синдром и нозологическая форма распознаны верно, что позволило выстроить обоснованную тактику.";
  } else if (ratio >= 0.3) {
    diagScore = 20;
    feedback = `Основное заболевание распознано верно, однако упущены важные клинические детали или осложнения. Эталонная формулировка: «${cd.diagnosis}».`;
  } else if (cleanDiag.length > 0) {
    diagScore = 5;
    feedback = `Сформулированный диагноз не соответствует клинической картине. Ведущая патология: «${cd.diagnosis}». Требуется пересмотреть дифференциальный ряд.`;
  } else {
    diagScore = 0;
    feedback = `Клинический диагноз не был сформулирован. По совокупности симптомов и обследований: «${cd.diagnosis}».`;
  }

  // 2. Формирование перечня конкретных клинических замечаний
  (safety.criticalErrors || []).forEach((e) => {
    errors.push(`Введение противопоказанного препарата «${e.name}» создало риск летального исхода.`);
  });

  (safety.majorErrors || []).forEach((e) => {
    errors.push(`Назначение «${e.name}» при наличии скрытых противопоказаний из анамнеза жизни.`);
  });

  // 3. Анализ невыполненных обязательных тестов
  const needDiag = cd.needDiag || [];
  const missedDiag = needDiag.filter((id) => !selDiag.includes(id));
  if (missedDiag.length > 0) {
    const names = missedDiag.slice(0, 2).map((id) => DIAGNOSTICS.find((d) => d.id === id)?.name || id);
    errors.push(`Не проведены обязательные диагностические исследования: ${names.join(", ")}.`);
  }

  // 4. Анализ невыполненного ключевого лечения
  const needTreat = cd.needTreat || [];
  const missedTreat = needTreat.filter((id) => !selTreat.includes(id));
  if (missedTreat.length > 0) {
    const names = missedTreat.slice(0, 2).map((id) => TREATMENTS.find((t) => t.id === id)?.name || id);
    errors.push(`Упущены протокольные жизнеспасающие вмешательства: ${names.join(", ")}.`);
  }

  return {
    diagScore,
    feedback,
    errors,
  };
}
