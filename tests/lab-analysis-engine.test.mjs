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
} from "../src/engine/labAnalysisEngine.js";

console.log("--- TEST: Lab Catalog Validation ---");
assert.equal(BMP_PARAMETERS.length, 17, "BMP_PARAMETERS must have exactly 17 clinical parameters");
assert.ok(URINE_PARAMETERS.length >= 8, "URINE_PARAMETERS must have >= 8 parameters");
assert.equal(DEFAULT_BMP_PARAMS.length, 17, "Default BMP profile must include all 17 items");
assert.ok(DEFAULT_URINE_PARAMS.length >= 5, "Default Urine profile must have >= 5 items");
assert.ok(LAB_PROFILES.bmp_basic && LAB_PROFILES.urine_standard && LAB_PROFILES.bmp_metabolic, "Standard profiles exist");
assert.deepEqual(BIOCHEMICAL_TEST_IDS, ["crp", "lactate", "glucose", "ferritin", "ketones"]);

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
// 1. Perfect evaluation
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
  creatinine: "normal", // MISTAKE!
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

console.log("ALL LAB ANALYSIS TESTS PASSED! ✅");
