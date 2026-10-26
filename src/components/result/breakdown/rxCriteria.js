/**
 * rxCriteria.js
 * Детальный разбор критерия фармакотерапии и рецептурного листа
 * с точным указанием ошибок в дозе, пути, кратности и длительности.
 */

export function buildRxBuilderCriterion(cd, result, extraResult) {
  const rxPlan = cd.rxPlan;
  if (!rxPlan) return null;

  const options = rxPlan.options || [];
  const targetOpt = options.find((o) => o.id === rxPlan.targetDrug) ||
    options.find((o) => o.isCorrect) || options[0];

  const rx = extraResult?.rxBuilder || result?.extraResult?.rxBuilder ||
    (targetOpt?.id && (extraResult?.prescriptions?.[targetOpt.id] || result?.extraResult?.prescriptions?.[targetOpt.id])) ||
    (extraResult?.prescriptions ? Object.values(extraResult.prescriptions)[0] : null) ||
    (result?.extraResult?.prescriptions ? Object.values(result.extraResult.prescriptions)[0] : null);

  const matchedOpt = rx?.id ? options.find((o) => o.id === rx.id) : null;
  const isCorrectDrug = Boolean(matchedOpt?.isCorrect);

  let rxEarned = 0;
  if (result?.rxScore != null) {
    rxEarned = result.rxScore;
  } else if (rx?.isCorrect) {
    rxEarned = 10;
  } else if (isCorrectDrug) {
    rxEarned = 5;
  }

  const lost = 10 - rxEarned;
  let details = "";
  let recommendation = null;

  if (!rx?.id && !rx?.mnn) {
    details = "Рецептурный лист не был оформлен врачом в ходе приёма";
    if (targetOpt) {
      recommendation = `Препарат выбора по КР: ${targetOpt.mnn} (${targetOpt.correctDose}, ${targetOpt.correctFrequency}, ${targetOpt.correctDuration})`;
    }
  } else if (rxEarned === 10) {
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
    details = `Назначен нерациональный препарат: «${rx.mnn || rx.id}» (не входит в стандарты первой линии)`;
    if (targetOpt) {
      recommendation = `Препарат выбора по КР: ${targetOpt.mnn} (${targetOpt.correctDose}, ${targetOpt.correctFrequency})`;
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
