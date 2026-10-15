import { BMP_PARAMETERS, URINE_PARAMETERS, DEFAULT_BMP_PARAMS, DEFAULT_URINE_PARAMS } from "./labCatalog.js";

/** Очистка строки от спойлеров (стрелочек, эмодзи, диагнозов в скобках) */
export function cleanLabText(str) {
  if (!str) return "";
  return str
    .replace(/^🔴\s*/, "")
    .replace(/^(?:оам|биохимия|бх)\s*:\s*/i, "")
    .replace(/[↑↓]/g, "")
    .replace(/\s*\([^)]*(?:гипо|гипер|острое|отличие|норма|криз|сд|хбп|опп|тяжел|диаг)[^)]*\)/gi, "")
    .replace(/—\s*(?:острое|дилюцион|хбп|криз|сепсис)[^,.]*/gi, "")
    .replace(/[.,;]+$/, "")
    .trim();
}

/** Проверка, есть ли в строке явные маркеры патологии */
function hasAbnormalMarker(str) {
  if (!str) return false;
  const s = str.toLowerCase();
  return (
    str.includes("🔴") || str.includes("↑") || str.includes("↓") ||
    s.includes("повыш") || s.includes("сниж") || s.includes("патол") ||
    s.includes("+++") || s.includes("++") || s.includes(">100") ||
    s.includes("лейкоцитур") || s.includes("бактериур") || s.includes("протеинур") ||
    s.includes("ацидоз") || s.includes("гипо") || s.includes("гипер")
  );
}

/** Извлечение числового значения показателя */
function extractNumber(str) {
  const match = str.match(/([0-9]+(?:[.,][0-9]+)?)/);
  if (!match) return null;
  return parseFloat(match[1].replace(",", "."));
}

/** Поиск совпадения фрагмента текста с параметром */
function findParamMatch(param, text) {
  const lower = text.toLowerCase();
  for (const key of param.keys) {
    const idx = lower.indexOf(key);
    if (idx !== -1) return true;
  }
  return false;
}

/** Парсер параметров биохимии или мочи */
export function parseLabTest(testId, rawText = "", userSelectedParamIds = null, fullCaseTestResults = null) {
  const isBmp = testId === "bmp";
  const isUrine = testId === "urine";

  if (!isBmp && !isUrine) {
    const isCrit = rawText.startsWith("🔴") || hasAbnormalMarker(rawText);
    return [{
      id: testId,
      name: testId.toUpperCase(),
      unit: "",
      refRange: "В пределах нормы",
      displayValue: cleanLabText(rawText),
      isActuallyAbnormal: isCrit,
      explanation: isCrit ? "Выявлены патологические изменения." : "Показатели в норме.",
      group: "general",
    }];
  }

  const catalog = isBmp ? BMP_PARAMETERS : URINE_PARAMETERS;
  const defaultIds = isBmp ? DEFAULT_BMP_PARAMS : DEFAULT_URINE_PARAMS;
  const activeIds = userSelectedParamIds && userSelectedParamIds.length > 0 ? userSelectedParamIds : defaultIds;
  const targetParams = catalog.filter((p) => activeIds.includes(p.id));

  // Разбиваем текст кейса на сегменты по запятым, точкам с пробелом, точке с запятой (сохраняя десятичные дроби)
  const segments = rawText
    .split(/(?:;|,|\.\s+|\n)+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return targetParams.map((param) => {
    // Ищем сегмент, где упоминается данный параметр
    let matchedSegment = segments.find((seg) => findParamMatch(param, seg));

    // Фоллбэк: если параметр в общем тексте биохимии не найден, но в кейсе есть отдельный результат
    if (!matchedSegment && fullCaseTestResults?.[param.id]) {
      matchedSegment = fullCaseTestResults[param.id];
    }

    if (!matchedSegment) {
      // Параметр заказан врачом, но в кейсе нормален (не упомянут)
      return {
        id: param.id,
        name: param.name,
        unit: param.unit,
        refRange: param.refRange,
        displayValue: param.defaultVal,
        isActuallyAbnormal: false,
        explanation: `${param.name} в пределах физиологической нормы (${param.refRange}).`,
        group: param.group,
      };
    }

    const numVal = extractNumber(matchedSegment);
    let isAbnormal = hasAbnormalMarker(matchedSegment);

    if (numVal !== null) {
      if (param.refMax !== undefined && numVal > param.refMax) isAbnormal = true;
      if (param.refMin !== undefined && numVal < param.refMin) isAbnormal = true;
    }

    const cleanSeg = cleanLabText(matchedSegment);
    const explanation = isAbnormal
      ? `${param.name} (${cleanSeg}): патологическое отклонение от референса (${param.refRange}).`
      : `${param.name} (${cleanSeg}): в пределах нормы (${param.refRange}).`;

    return {
      id: param.id,
      name: param.name,
      unit: param.unit,
      refRange: param.refRange,
      displayValue: cleanSeg,
      isActuallyAbnormal: isAbnormal,
      explanation,
      group: param.group,
    };
  });
}
