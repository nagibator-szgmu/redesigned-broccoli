import { BMP_PARAMETERS, URINE_PARAMETERS, DEFAULT_BMP_PARAMS, DEFAULT_URINE_PARAMS } from "./labCatalog.js";
import { getLabParametersForTest } from "./labRegistry.js";

/** Очистка строки от спойлеров (стрелочек, эмодзи, диагнозов в скобках) */
export function cleanLabText(str) {
  if (!str) return "";
  return str
    .replace(/^🔴\s*/, "")
    .replace(/^[\u{1F7E1}\u{26A0}]\s*/u, "")
    .replace(/^(?:оам|биохимия|бх|цсж|лп|оак|тэг|teg|пцр)\s*:\s*/i, "")
    .replace(/[↑↓]/g, "")
    .replace(/\s*\([^)]*(?:гипо|гипер|острое|отличие|норма|криз|сд|хбп|опп|тяжел|диаг|кровопот|укороч|удлин|повыш|сниж|компонент|двс|гиперсплен|дефицит|исключен|анеми)[^)]*\)/gi, "")
    .replace(/—\s*(?:острое|дилюцион|хбп|криз|сепсис|маркер|тяжел)[^,.]*/gi, "")
    .replace(/[.,;]+$/, "")
    .trim();
}

/** Проверка, есть ли в строке явные маркеры патологии */
function hasAbnormalMarker(str) {
  if (!str) return false;
  const s = str.toLowerCase();
  const hasYellow = str.includes("\uD83D\uDFE1");
  if (s.includes("не обнаружен") || s.includes("отрицательн") || s.includes("в пределах нормы") || s.includes("норма")) {
    if (!str.includes("🔴") && !hasYellow && !str.includes("↑") && !str.includes("↓") && !s.includes("положител") && !s.includes(">100")) return false;
  }
  return (
    str.includes("🔴") || hasYellow || str.includes("↑") || str.includes("↓") ||
    s.includes("повыш") || s.includes("сниж") || s.includes("патол") || s.includes("укороч") || s.includes("удлин") ||
    s.includes("положител") || s.includes("обнаружен") || s.includes("+++") || s.includes("++") || s.includes(">100") ||
    s.includes("лейкоцитур") || s.includes("бактериур") || s.includes("протеинур") || s.includes("ацидоз") ||
    s.includes("streptococcus") || s.includes("staphylococcus") || s.includes("e.coli") || s.includes("klebsiella") ||
    s.includes("neisseria") || s.includes("bacteroides") || s.includes("диплококк") || s.includes("палочки") ||
    s.includes("менингококк") || s.includes("пневмококк") || s.includes("впг") || s.includes("anti-nmda") ||
    (s.includes("рост") && !s.includes("нет роста"))
  );
}

/** Извлечение числового значения показателя с поддержкой пробелов между разрядами */
function extractNumber(str) {
  if (!str) return null;
  const match = str.match(/([0-9]+(?:\s[0-9]{3})*(?:[.,][0-9]+)?)/);
  if (!match) return null;
  return parseFloat(match[1].replace(/\s/g, "").replace(",", "."));
}

/** Поиск совпадения фрагмента текста с параметром с учетом границ слов для акронимов */
function findParamMatch(param, text) {
  const lower = text.toLowerCase();
  for (const key of param.keys) {
    const k = key.trim().toLowerCase();
    if (!k) continue;
    if (k.length <= 4) {
      const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp("(?:^|[^А-Яа-яA-Za-z0-9_])" + escaped + "(?=[^А-Яа-яA-Za-z0-9_]|$)", "i");
      if (re.test(lower)) return true;
    } else if (lower.includes(k)) {
      return true;
    }
  }
  return false;
}

/** Извлечение чистого числового/клинического значения для отображения в ячейке */
function formatLabValue(seg, param) {
  let val = cleanLabText(seg);
  const dashMatch = val.match(/^(.+?)\s*—\s*([^—]+)$/);
  if (dashMatch) {
    const before = dashMatch[1].trim();
    const after = dashMatch[2].trim();
    if (/\d/.test(before) && !/\d/.test(after)) {
      val = before;
    } else if (/\d/.test(after) || after.includes("положительн") || after.includes("отрицательн")) {
      val = after;
    }
  }
  const sepMatch = val.match(/^[^:=]+[:=]\s*(.+)$/);
  if (sepMatch && sepMatch[1] && (/\d/.test(sepMatch[1]) || /[А-Яа-я]/.test(sepMatch[1]))) {
    val = sepMatch[1].trim();
  }
  const valMatch = val.match(/^[^0-9><~]+\s+([><~]?\s*\d.*)$/);
  if (valMatch && valMatch[1]) {
    val = valMatch[1].trim();
  }
  val = val.replace(/\s*\([^)]*\)\s*/g, " ").replace(/[.,;]+$/, "").trim();
  return val || param.defaultVal;
}

function createNormalParam(param) {
  return {
    id: param.id,
    name: param.name,
    unit: param.unit,
    refRange: param.refRange,
    displayValue: param.defaultVal,
    isActuallyAbnormal: false,
    explanation: `${param.name} в пределах физиологической нормы (${param.refRange}).`,
    group: param.group || "general",
  };
}

/** Парсер лабораторных параметров всех зарегистрированных профилей и моно-тестов */
export function parseLabTest(testId, rawText = "", userSelectedParamIds = null, fullCaseTestResults = null) {
  const isBmp = testId === "bmp";
  const isUrine = testId === "urine";

  let catalog = getLabParametersForTest(testId);
  if (!catalog) {
    if (isBmp) catalog = BMP_PARAMETERS;
    else if (isUrine) catalog = URINE_PARAMETERS;
  }

  if (!catalog) {
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

  let targetParams = catalog;
  if (isBmp) {
    const activeIds = userSelectedParamIds && userSelectedParamIds.length > 0 ? userSelectedParamIds : DEFAULT_BMP_PARAMS;
    targetParams = catalog.filter((p) => activeIds.includes(p.id));
  } else if (isUrine) {
    const activeIds = userSelectedParamIds && userSelectedParamIds.length > 0 ? userSelectedParamIds : DEFAULT_URINE_PARAMS;
    targetParams = catalog.filter((p) => activeIds.includes(p.id));
  }

  const isDefaultNormal = !rawText || (rawText.toLowerCase().includes("в пределах нормы") && !rawText.includes("🔴"));
  const normalized = (rawText || "")
    .replace(/([А-Яа-яA-Za-z]+)\.\s*(?=[=:—\d])/g, (m, p) => p + " ")
    .replace(/(?:вод\.)\s*ст\./gi, "вод.ст");

  const segments = normalized.split(/(?:;|,|\.\s+|\n)+/).map((s) => s.trim()).filter(Boolean);

  return targetParams.map((param) => {
    if (isDefaultNormal) return createNormalParam(param);

    let matchedSegment = segments.find((seg) => findParamMatch(param, seg));
    if (!matchedSegment && fullCaseTestResults?.[param.id]) {
      matchedSegment = fullCaseTestResults[param.id];
    }
    if (!matchedSegment) return createNormalParam(param);

    const numVal = extractNumber(matchedSegment);
    let isAbnormal = hasAbnormalMarker(matchedSegment);
    if (numVal !== null) {
      if (param.refMax !== undefined && numVal > param.refMax) isAbnormal = true;
      if (param.refMin !== undefined && numVal < param.refMin) isAbnormal = true;
    }

    const displayVal = formatLabValue(matchedSegment, param);
    const explanation = isAbnormal
      ? `${param.name} (${displayVal}): патологическое отклонение от референса (${param.refRange}).`
      : `${param.name} (${displayVal}): в пределах нормы (${param.refRange}).`;

    return {
      id: param.id,
      name: param.name,
      unit: param.unit,
      refRange: param.refRange,
      displayValue: displayVal,
      isActuallyAbnormal: isAbnormal,
      explanation,
      group: param.group || "general",
    };
  });
}
