import assert from "node:assert/strict";
import {
  BMP_PARAMETERS,
  URINE_PARAMETERS,
  DEFAULT_BMP_PARAMS,
  DEFAULT_URINE_PARAMS,
  LAB_PROFILES,
  BIOCHEMICAL_TEST_IDS,
  getEffectiveOrderedDiag,
  parseLabTest,
  scoreLabEvaluation,
  cleanLabText,
  isLabReportSupported,
  TEG_PARAMETERS,
  CBC_PARAMETERS,
  COAG_PARAMETERS,
  ABG_PARAMETERS,
} from "../src/engine/labAnalysisEngine.js";

console.log("--- TEST: Lab Catalog Validation ---");
assert.equal(BMP_PARAMETERS.length, 17, "BMP_PARAMETERS must have exactly 17 clinical parameters");
assert.ok(URINE_PARAMETERS.length >= 8, "URINE_PARAMETERS must have >= 8 parameters");
assert.equal(DEFAULT_BMP_PARAMS.length, 17, "Default BMP profile must include all 17 items");
assert.ok(DEFAULT_URINE_PARAMS.length >= 5, "Default Urine profile must have >= 5 items");
assert.ok(LAB_PROFILES.bmp_basic && LAB_PROFILES.urine_standard && LAB_PROFILES.bmp_metabolic, "Standard profiles exist");
assert.deepEqual(BIOCHEMICAL_TEST_IDS, ["crp", "lactate", "glucose", "ferritin", "ketones"]);
assert.equal(TEG_PARAMETERS.length, 5, "TEG has 5 standard parameters");
assert.equal(CBC_PARAMETERS.length, 9, "CBC has 9 core parameters");
assert.equal(COAG_PARAMETERS.length, 5, "COAG has 5 standard parameters");
assert.equal(ABG_PARAMETERS.length, 7, "ABG has 7 blood gas parameters");

console.log("--- TEST: Supported Tests Registry ---");
assert.ok(isLabReportSupported("coag_full"), "TEG is supported as lab report");
assert.ok(isLabReportSupported("cbc"), "CBC is supported as lab report");
assert.ok(isLabReportSupported("coag"), "COAG is supported as lab report");
assert.ok(isLabReportSupported("abg"), "ABG is supported as lab report");
assert.ok(isLabReportSupported("thyroid"), "Thyroid is supported as lab report");
assert.ok(isLabReportSupported("troponin"), "Troponin is supported as lab report");
assert.ok(isLabReportSupported("d_dimer"), "D-dimer is supported as lab report");
assert.ok(isLabReportSupported("spo2"), "SpO2 is supported as lab report");
assert.equal(isLabReportSupported("ct_head"), false, "CT head is an imaging modality, not lab report");

console.log("--- TEST: Effective Ordered Diag Expansion ---");
const expanded = getEffectiveOrderedDiag(["bmp", "ecg"]);
assert.ok(expanded.includes("bmp") && expanded.includes("ecg"));
assert.ok(expanded.includes("crp") && expanded.includes("lactate") && expanded.includes("glucose"));

console.log("--- TEST: Spoiler Cleaner ---");
assert.equal(cleanLabText("🔴 Креатинин 142 мкмоль/л ↑ (гипокалиемия!)"), "Креатинин 142 мкмоль/л");
assert.equal(cleanLabText("ОАМ: лейкоцитурия >100/п.з."), "лейкоцитурия >100/п.з");

console.log("--- TEST: BMP Parsing Real Case ---");
const bmpCaseText = "🔴 Креатинин 142 мкмоль/л (СКФ 48 мл/мин — острое повреждение почек на фоне криза), Мочевина 9.4 ммоль/л, K+ 4.0 ммоль/л, Na+ 141 ммоль/л.";
const parsedBmp = parseLabTest("bmp", bmpCaseText, ["creatinine", "urea", "potassium", "sodium", "alt"]);

assert.equal(parsedBmp.length, 5);
const cr = parsedBmp.find((p) => p.id === "creatinine");
const k = parsedBmp.find((p) => p.id === "potassium");
const alt = parsedBmp.find((p) => p.id === "alt");

assert.equal(cr.isActuallyAbnormal, true, "Creatinine 142 is abnormal");
assert.equal(k.isActuallyAbnormal, false, "K+ 4.0 is normal");
assert.equal(alt.isActuallyAbnormal, false, "ALT is default normal");
assert.ok(!cr.displayValue.includes("🔴"), "No red marker in displayValue");

console.log("--- TEST: TEG (coag_full) Parsing Real Case & Default Normal ---");
const tegRealText = "Тромбоэластограмма (TEG): R-время 4 мин (укорочено), K-время 1.5 мин (укорочено), MA 72 мм (повышен). Гиперкоагуляция, характерная для ДВС-синдрома.";
const parsedTegReal = parseLabTest("coag_full", tegRealText);
assert.equal(parsedTegReal.length, 5);
const tegR = parsedTegReal.find((p) => p.id === "teg_r");
const tegMa = parsedTegReal.find((p) => p.id === "teg_ma");
const tegLy = parsedTegReal.find((p) => p.id === "teg_ly30");

assert.equal(tegR.isActuallyAbnormal, true, "R 4 min is abnormal (<5)");
assert.equal(tegMa.isActuallyAbnormal, true, "MA 72 is abnormal (>70)");
assert.equal(tegLy.isActuallyAbnormal, false, "LY30 default is normal");
assert.equal(tegR.displayValue, "4 мин");
assert.equal(tegR.unit, "мин");
assert.equal(tegR.refRange, "5.0–10.0");

// Default normal when ordered as rule-out
const parsedTegDefault = parseLabTest("coag_full", "coag_full: в пределах нормы.");
assert.equal(parsedTegDefault.length, 5);
assert.ok(parsedTegDefault.every((p) => !p.isActuallyAbnormal), "All default TEG parameters are normal");
assert.equal(parsedTegDefault[0].displayValue, "6.2 мин");

console.log("--- TEST: CBC (ОАК) Parsing ---");
const cbcCaseText = "🔴 Hb 72 г/л ↓↓ (кровопотеря). Тромбоциты 42 ↓↓. Лейк 24.8.";
const parsedCbc = parseLabTest("cbc", cbcCaseText);
assert.equal(parsedCbc.length, 9);
const cbcHb = parsedCbc.find((p) => p.id === "cbc_hb");
const cbcPlt = parsedCbc.find((p) => p.id === "cbc_plt");
const cbcWbc = parsedCbc.find((p) => p.id === "cbc_wbc");
assert.equal(cbcHb.isActuallyAbnormal, true);
assert.equal(cbcPlt.isActuallyAbnormal, true);
assert.equal(cbcWbc.isActuallyAbnormal, true);
assert.equal(cbcHb.unit, "г/л");

console.log("--- TEST: ABG (КЩС) Parsing ---");
const abgCaseText = "🔴 pH 7.18 ↓↓, PaCO₂ 68 ↑↑, PaO₂ 48 ↓↓. Тяжёлый дыхательный ацидоз — угроза апноэ.";
const parsedAbg = parseLabTest("abg", abgCaseText);
assert.equal(parsedAbg.length, 7);
const abgPh = parsedAbg.find((p) => p.id === "abg_ph");
const abgPaco2 = parsedAbg.find((p) => p.id === "abg_paco2");
assert.equal(abgPh.isActuallyAbnormal, true);
assert.equal(abgPaco2.isActuallyAbnormal, true);

console.log("--- TEST: Urine Parsing Real Case ---");
const urineCaseText = "🔴 ОАМ: лейкоцитурия >100/п.з., бактериурия +++, нитриты (+).";
const parsedUrine = parseLabTest("urine", urineCaseText);
const wbc = parsedUrine.find((p) => p.id === "urine_wbc");
const bact = parsedUrine.find((p) => p.id === "urine_bacteria");
const sg = parsedUrine.find((p) => p.id === "urine_sg");

assert.equal(wbc.isActuallyAbnormal, true, "WBC >100 is abnormal");
assert.equal(bact.isActuallyAbnormal, true, "Bacteria +++ is abnormal");
assert.equal(sg.isActuallyAbnormal, false, "SG is normal");

console.log("--- TEST: Doctor Interpretation Scoring ---");
const perfectScore = scoreLabEvaluation(parsedBmp, {
  creatinine: "abnormal",
  urea: "abnormal",
  potassium: "normal",
  sodium: "normal",
  alt: "normal",
});
assert.equal(perfectScore.scorePercent, 100);
assert.equal(perfectScore.allCorrect, true);
assert.equal(perfectScore.mistakes.length, 0);

// 2. Missed pathology (marked creatinine as normal)
const missedScore = scoreLabEvaluation(parsedBmp, {
  creatinine: "normal",
  urea: "abnormal",
  potassium: "normal",
  sodium: "normal",
  alt: "normal",
});
assert.equal(missedScore.scorePercent, 80);
assert.equal(missedScore.allCorrect, false);
assert.equal(missedScore.mistakes.length, 1);
assert.equal(missedScore.mistakes[0].type, "missed_pathology");
assert.ok(missedScore.feedbackText.includes("пропущено 1 патологических отклонений"));

console.log("--- TEST: Clinical Edge Cases (Thyroid, Paracentesis, Culture, SpO2) ---");
const thyParsed = parseLabTest("thyroid", "🔴 ТТГ <0.01 мМЕ/л (подавлен). Т4 своб. = 82 пмоль/л ↑↑↑. АТ к рецепторам ТТГ = 35 МЕ/л ↑↑.");
assert.equal(thyParsed.find(p => p.id === "thy_ft4").displayValue, "82 пмоль/л");
assert.equal(thyParsed.find(p => p.id === "thy_ft4").isActuallyAbnormal, true);

const ascParsed = parseLabTest("paracentesis", "🟡 Диагностический лапароцентез: Жидкость прозрачная, соломенно-жёлтая. Общий белок 16 г/л, альбумин асцита 8 г/л (SAAG 16 г/л). Нейтрофилы 110 клеток/мкл.");
assert.ok(ascParsed.find(p => p.id === "asc_neutro").displayValue.includes("110"));

const cultParsed = parseLabTest("culture", "Посев крови: Streptococcus pneumoniae. Рост через 18 ч.");
assert.ok(cultParsed.some(p => p.isActuallyAbnormal), "Culture with bacterial growth must be flagged abnormal");

const spo2Parsed = parseLabTest("spo2", "🔴 SpO₂ 82% — тяжёлая гипоксемия.");
assert.equal(spo2Parsed[0].displayValue, "82%");
assert.equal(spo2Parsed[0].isActuallyAbnormal, true);

console.log("ALL LAB ANALYSIS TESTS PASSED! [OK]");
