/**
 * Справочник параметров биохимии крови и анализа мочи (СЗГМУ им. Мечникова / МЗ РФ).
 */
export const BIOCHEMICAL_TEST_IDS = ["crp", "lactate", "glucose", "ferritin", "ketones"];

export const LAB_GROUPS = {
  electrolytes: "Электролиты и микроэлементы",
  renal: "Функция почек / Азотистый обмен",
  hepatic: "Печеночный профиль / Ферменты",
  proteins: "Белки сыворотки и острая фаза",
  metabolism: "Углеводный, липидный и энергетический обмен",
  physical: "Физико-химические свойства мочи",
  chemical: "Биохимические маркеры мочи",
  microscopy: "Микроскопия осадка мочи",
};

export const BMP_PARAMETERS = [
  // Электролиты и микроэлементы
  { id: "potassium", name: "Калий (K⁺)", unit: "ммоль/л", refRange: "3.5–5.1", refMin: 3.5, refMax: 5.1, defaultVal: "4.1 ммоль/л", group: "electrolytes", keys: ["k+", "калий", " k "] },
  { id: "sodium", name: "Натрий (Na⁺)", unit: "ммоль/л", refRange: "135–145", refMin: 135, refMax: 145, defaultVal: "138 ммоль/л", group: "electrolytes", keys: ["na+", "натрий", " na "] },
  { id: "chloride", name: "Хлориды (Cl⁻)", unit: "ммоль/л", refRange: "98–107", refMin: 98, refMax: 107, defaultVal: "102 ммоль/л", group: "electrolytes", keys: ["cl-", "хлор", "хлориды"] },
  { id: "ferritin", name: "Ферритин / железо сыворотки", unit: "мкг/л", refRange: "30–250", refMin: 30, refMax: 250, defaultVal: "120 мкг/л", group: "electrolytes", keys: ["ферритин", "железо", "fe"] },

  // Азотистый обмен / Почки
  { id: "creatinine", name: "Креатинин (+ СКФ)", unit: "мкмоль/л", refRange: "62–115", refMin: 62, refMax: 115, defaultVal: "80 мкмоль/л", group: "renal", keys: ["креатинин", " cr ", "скф"] },
  { id: "urea", name: "Мочевина", unit: "ммоль/л", refRange: "2.5–8.3", refMin: 2.5, refMax: 8.3, defaultVal: "5.2 ммоль/л", group: "renal", keys: ["мочевина", "мочевины", "urea"] },

  // Печеночный профиль / Ферменты
  { id: "alt", name: "АЛТ", unit: "Ед/л", refRange: "0–41", refMin: 0, refMax: 41, defaultVal: "22 Ед/л", group: "hepatic", keys: ["алт", "alt"] },
  { id: "ast", name: "АСТ", unit: "Ед/л", refRange: "0–40", refMin: 0, refMax: 40, defaultVal: "24 Ед/л", group: "hepatic", keys: ["аст", "ast"] },
  { id: "bilirubin", name: "Билирубин общий", unit: "мкмоль/л", refRange: "3.4–20.5", refMin: 3.4, refMax: 20.5, defaultVal: "12.4 мкмоль/л", group: "hepatic", keys: ["билирубин", "билирубина"] },
  { id: "amylase", name: "Альфа-амилаза", unit: "Ед/л", refRange: "28–100", refMin: 28, refMax: 100, defaultVal: "52 Ед/л", group: "hepatic", keys: ["амилаза", "амилазы", "липаза"] },

  // Белки сыворотки и острая фаза
  { id: "protein", name: "Общий белок", unit: "г/л", refRange: "65–85", refMin: 65, refMax: 85, defaultVal: "72 г/л", group: "proteins", keys: ["общий белок", "белок сыворотки"] },
  { id: "albumin", name: "Альбумин", unit: "г/л", refRange: "35–50", refMin: 35, refMax: 50, defaultVal: "43 г/л", group: "proteins", keys: ["альбумин", "альбумина"] },
  { id: "crp", name: "СРБ (С-реактивный белок)", unit: "мг/л", refRange: "0–5.0", refMin: 0, refMax: 5.0, defaultVal: "1.2 мг/л", group: "proteins", keys: ["срб", "с-реактивный", "crp"] },

  // Углеводный, липидный и энергетический обмен
  { id: "glucose", name: "Глюкоза сыворотки", unit: "ммоль/л", refRange: "3.9–6.1", refMin: 3.9, refMax: 6.1, defaultVal: "4.9 ммоль/л", group: "metabolism", keys: ["глюкоза", "глюкозы", "сахар"] },
  { id: "cholesterol", name: "Холестерин общий", unit: "ммоль/л", refRange: "3.0–5.2", refMin: 3.0, refMax: 5.2, defaultVal: "4.4 ммоль/л", group: "metabolism", keys: ["холестерин", "лпнп"] },
  { id: "lactate", name: "Лактат крови", unit: "ммоль/л", refRange: "0.5–2.0", refMin: 0.5, refMax: 2.0, defaultVal: "1.1 ммоль/л", group: "metabolism", keys: ["лактат", "лактата"] },
  { id: "ketones", name: "Кетоны крови", unit: "ммоль/л", refRange: "< 0.6", refMax: 0.6, defaultVal: "0.2 ммоль/л", group: "metabolism", keys: ["кетон", "кетоны", "бета-оксибутират"] },
];

export const URINE_PARAMETERS = [
  { id: "urine_color", name: "Цвет и прозрачность", unit: "", refRange: "Соломенно-желтый, прозрачная", defaultVal: "Соломенно-желтый, прозрачная", group: "physical", keys: ["цвет", "прозрачность", "прозрачн"] },
  { id: "urine_sg", name: "Относительная плотность", unit: "", refRange: "1010–1025", refMin: 1010, refMax: 1025, defaultVal: "1018", group: "physical", keys: ["плотность", "удельный вес", "101", "102"] },
  { id: "urine_ph", name: "Реакция (pH)", unit: "", refRange: "5.0–7.0", refMin: 5.0, refMax: 7.0, defaultVal: "6.0", group: "physical", keys: ["ph", "реакция"] },
  { id: "urine_protein", name: "Белок (протеинурия)", unit: "г/л", refRange: "< 0.033 г/л (отр)", refMax: 0.033, defaultVal: "отрицательно (<0.033 г/л)", group: "chemical", keys: ["белок", "протеинурия", "микроальбумин"] },
  { id: "urine_glucose", name: "Глюкоза (глюкозурия)", unit: "", refRange: "Отрицательно", defaultVal: "отрицательно", group: "chemical", keys: ["глюкоза", "глюкозурия"] },
  { id: "urine_ketones", name: "Кетоновые тела", unit: "", refRange: "Отрицательно", defaultVal: "отрицательно", group: "chemical", keys: ["кетон", "кетоны", "кетонурия"] },
  { id: "urine_wbc", name: "Лейкоциты в п/з", unit: "в п/з", refRange: "0–5 в п/з", refMax: 5, defaultVal: "1–2 в п/з", group: "microscopy", keys: ["лейкоцит", "лейкоцитурия"] },
  { id: "urine_rbc", name: "Эритроциты в п/з", unit: "в п/з", refRange: "0–2 в п/з", refMax: 2, defaultVal: "0–1 в п/з", group: "microscopy", keys: ["эритроцит", "гематурия"] },
  { id: "urine_casts", name: "Цилиндры", unit: "", refRange: "Отсутствуют", defaultVal: "не обнаружены", group: "microscopy", keys: ["цилиндр", "цилиндры"] },
  { id: "urine_bacteria", name: "Бактерии / Нитриты", unit: "", refRange: "Не обнаружены (отр)", defaultVal: "не обнаружены", group: "microscopy", keys: ["бактери", "бактериурия", "нитрит"] },
];

export const DEFAULT_BMP_PARAMS = BMP_PARAMETERS.map(p => p.id);

export const DEFAULT_URINE_PARAMS = URINE_PARAMETERS.map(p => p.id);

/**
 * Расширяет список заказанных исследований биохимическими суб-параметрами (если заказана bmp)
 * для обеспечения прозрачной совместимости с базой клинических кейсов (needDiag).
 */
export function getEffectiveOrderedDiag(orderedDiag = [], selectedLabParams = {}) {
  if (!Array.isArray(orderedDiag)) return [];
  if (!orderedDiag.includes("bmp")) return orderedDiag;
  const bmpParams = selectedLabParams?.bmp && selectedLabParams.bmp.length > 0
    ? selectedLabParams.bmp
    : DEFAULT_BMP_PARAMS;
  return Array.from(new Set([...orderedDiag, ...bmpParams]));
}

export const LAB_PROFILES = {
  bmp_basic: { id: "bmp_basic", title: "Базовый профиль", paramIds: ["alt", "ast", "bilirubin", "creatinine", "urea", "glucose", "cholesterol", "protein", "crp"] },
  bmp_hepatic: { id: "bmp_hepatic", title: "Печеночные пробы", paramIds: ["alt", "ast", "bilirubin", "protein", "albumin", "amylase"] },
  bmp_renal: { id: "bmp_renal", title: "Почечный профиль", paramIds: ["creatinine", "urea", "potassium", "sodium", "chloride"] },
  bmp_electrolytes: { id: "bmp_electrolytes", title: "Электролиты и микроэлементы", paramIds: ["potassium", "sodium", "chloride", "ferritin"] },
  bmp_metabolic: { id: "bmp_metabolic", title: "Метаболизм и шок", paramIds: ["glucose", "lactate", "ketones", "cholesterol"] },
  bmp_full: { id: "bmp_full", title: "Развернутая биохимия (все 17 показателей)", paramIds: BMP_PARAMETERS.map(p => p.id) },
  urine_standard: { id: "urine_standard", title: "Общий анализ мочи (стандартный бланк)", paramIds: URINE_PARAMETERS.map(p => p.id) },
  urine_full: { id: "urine_full", title: "Общий анализ мочи (стандартный бланк)", paramIds: URINE_PARAMETERS.map(p => p.id) },
};
