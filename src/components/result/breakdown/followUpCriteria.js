/**
 * followUpCriteria.js
 * Детальный разбор критерия диспансерного наблюдения (Follow-up)
 * с точным указанием ошибок по сроку явки и биомаркерам.
 */

export function buildFollowUpCriterion(cd, result, extraResult) {
  const plan = cd.followUpPlan;
  if (!plan) return null;

  const fu = extraResult?.followUp || result?.extraResult?.followUp;
  const fuEarned = result?.followUpScore != null ? result.followUpScore : 0;
  const lost = 10 - fuEarned;

  const timingOpts = plan.timingOptions || [];
  const correctTimingObj = timingOpts.find((o) => o.isCorrect) ||
    timingOpts.find((o) => o.id === plan.correctTiming);
  const selectedTimingObj = timingOpts.find((o) => o.id === fu?.timingId);
  const isTimingCorrect = fu?.timingId && (
    fu.timingId === plan.correctTiming || selectedTimingObj?.isCorrect
  );

  const bioList = plan.biomarkers || [];
  const correctBioObjs = bioList.filter((b) => b.isCorrect);
  const correctBioIds = plan.correctBiomarkers || correctBioObjs.map((b) => b.id);
  const selectedBioIds = fu?.selectedBiomarkers || [];

  const missedIds = correctBioIds.filter((id) => !selectedBioIds.includes(id));
  const missedLabels = missedIds.map((id) => bioList.find((b) => b.id === id)?.label || id);

  const excessIds = selectedBioIds.filter((id) => !correctBioIds.includes(id));
  const excessLabels = excessIds.map((id) => bioList.find((b) => b.id === id)?.label || id);

  const correctBioLabels = correctBioIds.map((id) => bioList.find((b) => b.id === id)?.label || id);

  let details = "";
  let recommendation = null;

  const hasAnySelection = Boolean(fu?.timingId || selectedBioIds.length > 0);

  if (!hasAnySelection) {
    details = "План диспансерного наблюдения не был заполнен врачом в ходе приёма";
    recommendation = `Стандарт по КР: контрольная явка «${correctTimingObj?.label || "в срок"}», биомаркеры: ${correctBioLabels.join(", ")}`;
  } else if (fuEarned === 10) {
    details = `Срок повторной явки («${correctTimingObj?.label}») и все контрольные биомаркеры выбраны верно`;
  } else {
    const flaws = [];
    if (!isTimingCorrect) {
      flaws.push(`неверный срок явки: «${selectedTimingObj?.label || "не выбран"}» (требовалось: «${correctTimingObj?.label}»)`);
    }
    if (missedLabels.length > 0) {
      flaws.push(`не назначены обязательные маркеры: ${missedLabels.join(", ")}`);
    }
    if (excessLabels.length > 0) {
      flaws.push(`избыточно назначены тесты: ${excessLabels.join(", ")}`);
    }
    details = `Дефект диспансерного плана: ${flaws.join("; ")}`;
    recommendation = `Стандарт по КР: повторная явка «${correctTimingObj?.label}», биомаркеры: ${correctBioLabels.join(", ")}`;
  }

  return {
    id: "follow_up",
    title: "Диспансерный контроль",
    max: 10,
    earned: fuEarned,
    lost,
    status: fuEarned === 10 ? "perfect" : fuEarned > 0 ? "partial" : "failed",
    details,
    recommendation,
  };
}
