/**
 * rxCriteria.js
 * Детальный разбор критерия фармакотерапии и рецептурного листа
 * с точным указанием ошибок в дозе, пути, кратности и длительности.
 */

import { findMatchingOption } from "../../../engine/drugMatcher.js";

export function buildRxBuilderCriterion(cd, result, extraResult) {
  const rxPlan = cd.rxPlan;
  if (!rxPlan) return null;

  const options = rxPlan.options || [];
  const targetOpt = options.find((o) => o.id === rxPlan.targetDrug) ||
    options.find((o) => o.isCorrect) || options[0];

  const prescriptions = extraResult?.prescriptions || result?.extraResult?.prescriptions || {};
  const rxList = Object.values(prescriptions);
  const rx = extraResult?.rxBuilder || result?.extraResult?.rxBuilder || rxList[0] || null;

  if (!rx || (!rx.id && !rx.mnn && !rx.isCorrect)) {
    return {
      id: "rx_builder",
      title: "Фармакотерапия и рецептурный лист",
      max: 10,
      earned: 0,
      lost: 10,
      status: "failed",
      details: "Рецептурный лист не был оформлен врачом в ходе приёма",
      recommendation: targetOpt
        ? `Препарат выбора по КР: ${targetOpt.mnn} (${targetOpt.correctDose}, ${targetOpt.correctFrequency}, ${targetOpt.correctDuration})`
        : null,
    };
  }

  // Find matching option for this prescription in case rxPlan
  const matchedOpt = rx.id ? findMatchingOption(rx.id, rxPlan) : null;
  const isCorrectDrug = Boolean(matchedOpt?.isCorrect);

  let rxEarned = 0;
  if (rx && !rx.id && rx.isCorrect) {
    rxEarned = 10;
  } else if (!isCorrectDrug) {
    rxEarned = 0;
  } else {
    const doseOk = !matchedOpt.correctDose || rx.dose === matchedOpt.correctDose;
    const freqOk = !matchedOpt.correctFrequency || rx.frequency === matchedOpt.correctFrequency;
    rxEarned = (doseOk && freqOk) ? (matchedOpt.score || 10) : 5;
  }

  const lost = 10 - rxEarned;
  let details = "";
  let recommendation = null;

  if (rxEarned === 10) {
    details = `Препарат выписан верно: ${rx.mnn} (${rx.dose}, ${rx.frequency}, курс: ${rx.duration || "по КР"})`;
  } else if (isCorrectDrug && matchedOpt) {
    const flaws = [];
    if (rx.dose && matchedOpt.correctDose && rx.dose !== matchedOpt.correctDose) {
      flaws.push(`доза: «${rx.dose}» (требовалось: «${matchedOpt.correctDose}»)`);
    }
    if (rx.frequency && matchedOpt.correctFrequency && rx.frequency !== matchedOpt.correctFrequency) {
      flaws.push(`кратность: «${rx.frequency}» (требовалось: «${matchedOpt.correctFrequency}»)`);
    }
    if (rx.duration && matchedOpt.correctDuration && rx.duration !== matchedOpt.correctDuration) {
      flaws.push(`курс: «${rx.duration}» (требовалось: «${matchedOpt.correctDuration}»)`);
    }
    const flawText = flaws.length > 0 ? flaws.join("; ") : "неоптимальный режим дозирования";
    details = `Препарат «${rx.mnn}» выбран верно, но допущены дефекты схемы: ${flawText}`;
    recommendation = `Стандарт по КР: ${matchedOpt.mnn} — ${matchedOpt.correctDose}, ${matchedOpt.correctFrequency}, курс: ${matchedOpt.correctDuration}`;
  } else {
    details = `Назначен нерациональный препарат: «${rx.mnn || rx.id}» (не входит в стандарты первой линии при данном диагнозе)`;
    if (targetOpt) {
      recommendation = `Препарат выбора по КР: ${targetOpt.mnn} (${targetOpt.correctDose}, ${targetOpt.correctFrequency}, ${targetOpt.correctDuration})`;
    }
  }

  return {
    id: "rx_builder",
    title: "Фармакотерапия и рецептурный лист",
    max: 10,
    earned: rxEarned,
    lost,
    status: rxEarned === 10 ? "perfect" : rxEarned > 0 ? "partial" : "failed",
    details,
    recommendation,
  };
}
