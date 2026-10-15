/**
 * Справочник параметров биохимии крови и анализа мочи (СЗГМУ им. Мечникова / МЗ РФ).
 */
export const LAB_GROUPS = {
  electrolytes: "Электролиты",
  renal: "Функция почек / Азотистый обмен",
  hepatic: "Печеночный профиль / Ферменты",
  metabolism: "Углеводный и липидный обмен",
  proteins: "Белки и маркеры воспаления",
  physical: "Физико-химические свойства мочи",
  chemical: "Биохимические маркеры мочи",
  microscopy: "Микроскопия осадка мочи",
};

export const BMP_PARAMETERS = [
  { id: "potassium", name: "Калий (K⁺)", unit: "ммоль/л", refRange: "3.5–5.1", refMin: 3.5, refMax: 5.1, defaultVal: "4.1 ммоль/л", group: "electrolytes", keys: ["k+", "калий", " k "] },
  { id: "sodium", name: "Натрий (Na⁺)", unit: "ммоль/л", refRange: "135–145", refMin: 135, refMax: 145, defaultVal: "138 ммоль/л", group: "electrolytes", keys: ["na+", "натрий", " na "] },
  { id: "chloride", name: "Хлориды (Cl⁻)", unit: "ммоль/л", refRange: "98–107", refMin: 98, refMax: 107, defaultVal: "102 ммоль/л", group: "electrolytes", keys: ["cl-", "хлор", "хлориды"] },
  { id: "creatinine", name: "Креатинин", unit: "мкмоль/л", refRange: "62–115", refMin: 62, refMax: 115, defaultVal: "80 мкмоль/л", group: "renal", keys: ["креатинин", " cr "] },
  { id: "urea", name: "Мочевина", unit: "ммоль/л", refRange: "2.5–8.3", refMin: 2.5, refMax: 8.3, defaultVal: "5.2 ммоль/л", group: "renal", keys: ["мочевина", "мочевины", "urea"] },
  { id: "alt", name: "АЛТ", unit: "Ед/л", refRange: "0–41", refMin: 0, refMax: 41, defaultVal: "22 Ед/л", group: "hepatic", keys: ["алт", "alt"] },
  { id: "ast", name: "АСТ", unit: "Ед/л", refRange: "0–40", refMin: 0, refMax: 40, defaultVal: "24 Ед/л", group: "hepatic", keys: ["аст", "ast"] },
  { id: "bilirubin", name: "Билирубин общий", unit: "мкмоль/л", refRange: "3.4–20.5", refMin: 3.4, refMax: 20.5, defaultVal: "12.4 мкмоль/л", group: "hepatic", keys: ["билирубин", "билирубина"] },
  { id: "glucose", name: "Глюкоза", unit: "ммоль/л", refRange: "3.9–6.1", refMin: 3.9, refMax: 6.1, defaultVal: "4.9 ммоль/л", group: "metabolism", keys: ["глюкоза", "глюкозы", "сахар"] },
  { id: "protein", name: "Общий белок", unit: "г/л", refRange: "65–85", refMin: 65, refMax: 85, defaultVal: "72 г/л", group: "proteins", keys: ["общий белок", "белок сыворотки"] },
  { id: "albumin", name: "Альбумин", unit: "г/л", refRange: "35–50", refMin: 35, refMax: 50, defaultVal: "43 г/л", group: "proteins", keys: ["альбумин", "альбумина"] },
  { id: "crp", name: "СРБ", unit: "мг/л", refRange: "0–5.0", refMin: 0, refMax: 5.0, defaultVal: "1.5 мг/л", group: "proteins", keys: ["срб", "с-реактивный", "crp"] },
  { id: "amylase", name: "Амилаза / Липаза", unit: "Ед/л", refRange: "28–100", refMin: 28, refMax: 100, defaultVal: "52 Ед/л", group: "hepatic", keys: ["амилаза", "амилазы", "липаза"] },
  { id: "cholesterol", name: "Холестерин общий", unit: "ммоль/л", refRange: "3.0–5.2", refMin: 3.0, refMax: 5.2, defaultVal: "4.4 ммоль/л", group: "metabolism", keys: ["холестерин", "лпнп"] },
  { id: "lactate", name: "Лактат", unit: "ммоль/л", refRange: "0.5–2.0", refMin: 0.5, refMax: 2.0, defaultVal: "1.2 ммоль/л", group: "metabolism", keys: ["лактат", "лактата"] },
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

export const DEFAULT_BMP_PARAMS = [
  "potassium", "sodium", "creatinine", "urea", "glucose", "alt", "ast", "bilirubin"
];

export const DEFAULT_URINE_PARAMS = [
  "urine_color", "urine_sg", "urine_protein", "urine_glucose", "urine_wbc", "urine_rbc", "urine_bacteria"
];

export const LAB_PROFILES = {
  bmp_basic: { id: "bmp_basic", title: "Базовый биохимический профиль", paramIds: ["potassium", "sodium", "creatinine", "urea", "glucose", "alt", "ast", "bilirubin"] },
  bmp_renal: { id: "bmp_renal", title: "Почечный профиль + электролиты", paramIds: ["creatinine", "urea", "potassium", "sodium", "chloride", "albumin"] },
  bmp_hepatic: { id: "bmp_hepatic", title: "Печеночные пробы", paramIds: ["alt", "ast", "bilirubin", "protein", "albumin", "amylase"] },
  bmp_full: { id: "bmp_full", title: "Развернутая биохимия (все)", paramIds: BMP_PARAMETERS.map(p => p.id) },
  urine_standard: { id: "urine_standard", title: "Стандартный ОАМ", paramIds: ["urine_color", "urine_sg", "urine_protein", "urine_glucose", "urine_wbc", "urine_rbc"] },
  urine_full: { id: "urine_full", title: "ОАМ с микроскопией и нитритами", paramIds: URINE_PARAMETERS.map(p => p.id) },
};
