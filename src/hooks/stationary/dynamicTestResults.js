/**
 * Generates day-specific dynamic diagnostic test results
 * based on the case dayByDayPlan, treatment adequacy, and hospitalization day.
 */

function extractMetric(text, regex) {
  if (!text) return null;
  const match = text.match(regex);
  return match ? match[1].replace(",", ".") : null;
}

export function sanitizeMorningText(rawText) {
  if (!rawText) return "—";
  return rawText
    .replace(/(?:СРБ|CRP)\s*(?:снизился\s*)?(?:с\s*\d+\s*)?(?:до\s*)?\d+[.,]?\d*\s*мг\/л[.,]?\s*/gi, "")
    .replace(/Лейкоциты\s*(?:не\s*снижаются\s*)?(?:\(?\d+[.,]?\d*\)?)[.,]?\s*/gi, "")
    .replace(/Лактат\s*\d+[.,]?\d*(?:\s*ммоль\/л)?[.,]?\s*/gi, "")
    .replace(/Тромбоциты\s*\d+[.,]?\d*[.,]?\s*/gi, "")
    .replace(/Натрий\s*(?:упал\s*до|восстановился\s*до)?\s*\d+[.,]?\d*\s*ммоль\/л[.,]?\s*/gi, "")
    .replace(/Креатинин\s*(?:подскочил\s*со\s*\d+\s*до|снизился\s*до)?\s*\d+[.,]?\d*\s*мкмоль\/л[.,]?\s*/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function getDynamicTestResult(cd, testId, dayIndex, dailyTreatments = []) {
  const baseResult = cd?.testResults?.[testId];
  if (dayIndex === 0) return baseResult || `${testId}: в пределах нормы.`;

  const dayPlan = cd?.dayByDayPlan?.[dayIndex];
  const combinedText = [dayPlan?.morning, dayPlan?.plan, dayPlan?.text].filter(Boolean).join(" ");
  const needTreat = cd?.needTreat || [];
  const wrongTreat = cd?.wrongTreat || [];
  const isAdequate = dailyTreatments.some(t => needTreat.includes(t)) && !dailyTreatments.some(t => wrongTreat.includes(t));

  if (testId === "crp") {
    const crpVal = extractMetric(combinedText, /(?:СРБ|CRP)\s*(?:снизился\s*до\s*|с\s*\d+\s*до\s*)?(\d+[.,]?\d*)/i);
    if (crpVal) {
      return `Контроль СРБ (День ${dayIndex + 1}): ${crpVal} мг/л (норма <5.0) — положительная динамика системного воспаления.`;
    }
    return isAdequate
      ? `Контроль СРБ (День ${dayIndex + 1}): 28 мг/л (снижение более чем на 50% от исходного).`
      : `Контроль СРБ (День ${dayIndex + 1}): 🔴 78 мг/л (сохраняется высокий уровень воспаления).`;
  }

  if (testId === "cbc") {
    const wbc = extractMetric(combinedText, /(?:Лейкоцит\w*|Лейк)\s*(\d+[.,]?\d*)/i);
    const plt = extractMetric(combinedText, /Тромбоцит\w*\s*(\d+[.,]?\d*)/i);
    const details = [];
    if (wbc) details.push(`Лейкоциты ${wbc} × 10⁹/л`);
    if (plt) details.push(`Тромбоциты ${plt} × 10⁹/л`);
    if (details.length > 0) {
      return `Контроль ОАК (День ${dayIndex + 1}): ${details.join(", ")} (положительная динамика).`;
    }
    return isAdequate
      ? `Контроль ОАК (День ${dayIndex + 1}): Лейкоциты 8.6 × 10⁹/л (нормализация формулы крови).`
      : `Контроль ОАК (День ${dayIndex + 1}): 🔴 Лейкоциты 15.4 × 10⁹/л (сохраняется выраженный лейкоцитоз).`;
  }

  if (testId === "lactate") {
    const lac = extractMetric(combinedText, /Лактат\s*(\d+[.,]?\d*)/i);
    if (lac) return `Контроль лактата (День ${dayIndex + 1}): ${lac} ммоль/л.`;
    return isAdequate
      ? `Контроль лактата (День ${dayIndex + 1}): 1.6 ммоль/л (клиренс лактата достигнут, норма).`
      : `Контроль лактата (День ${dayIndex + 1}): 🔴 4.8 ммоль/л (тканевая гипоперфузия).`;
  }

  if (testId === "bmp") {
    const na = extractMetric(combinedText, /Натрий\s*(?:упал\s*до\s*|восстановился\s*до\s*)?(\d+[.,]?\d*)/i);
    const cr = extractMetric(combinedText, /Креатинин\s*(?:со\s*\d+\s*до\s*|снизился\s*до\s*)?(\d+[.,]?\d*)/i);
    if (na || cr) {
      const parts = [];
      if (na) parts.push(`Натрий ${na} ммоль/л`);
      if (cr) parts.push(`Креатинин ${cr} мкмоль/л`);
      return `Контроль БАК (День ${dayIndex + 1}): ${parts.join(", ")}.`;
    }
    return isAdequate
      ? `Контроль БАК (День ${dayIndex + 1}): Электролиты и азотистые шлаки в пределах нормы (Калий 4.1 ммоль/л, Креатинин 88 мкмоль/л).`
      : `Контроль БАК (День ${dayIndex + 1}): 🔴 Электролитные нарушения, нарастание азотемии.`;
  }

  if (testId === "coag" || testId === "coag_full") {
    return isAdequate
      ? `Контроль коагулограммы (День ${dayIndex + 1}): МНО 1.25, АПТВ 34 сек, Фибриноген 3.2 г/л (стабилизация гемостаза).`
      : `Контроль коагулограммы (День ${dayIndex + 1}): 🔴 МНО 2.4, Фибриноген 1.2 г/л (гипокоагуляция).`;
  }

  if (["xray", "ct_head", "ct_abdo", "usg_abdo", "colonoscopy"].includes(testId)) {
    return isAdequate
      ? `Контроль визуализации (${testId.toUpperCase()}, День ${dayIndex + 1}): положительная динамика, регресс патологических изменений.`
      : baseResult || `${testId}: без существенной динамики.`;
  }

  return baseResult || `${testId}: динамический контроль выполнен.`;
}
