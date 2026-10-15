import assert from "node:assert/strict";
import {
  BMP_PARAMETERS, URINE_PARAMETERS, DEFAULT_BMP_PARAMS, DEFAULT_URINE_PARAMS,
  LAB_PROFILES, BIOCHEMICAL_TEST_IDS, getEffectiveOrderedDiag, parseLabTest,
  scoreLabEvaluation, cleanLabText, isLabReportSupported, TEG_PARAMETERS,
  CBC_PARAMETERS, COAG_PARAMETERS, ABG_PARAMETERS, resolveDiagnosticResult,
  isProcedureCancelled, hasIntracranialHerniationRisk, PROCEDURE_CANCELLATIONS,
  getRestrictedProcedureNotice,
} from "../src/engine/labAnalysisEngine.js";
import { getDynamicTestResult } from "../src/hooks/stationary/dynamicTestResults.js";
import { evaluateClinicalSafety } from "../src/engine/safetyEngine.js";

console.log("--- TEST: Lab Catalog Validation ---");
assert.equal(BMP_PARAMETERS.length, 17, "BMP_PARAMETERS must have 17 parameters");
assert.ok(URINE_PARAMETERS.length >= 8 && DEFAULT_BMP_PARAMS.length === 17);
assert.ok(LAB_PROFILES.bmp_basic && LAB_PROFILES.urine_standard);
assert.deepEqual(BIOCHEMICAL_TEST_IDS, ["crp", "lactate", "glucose", "ferritin", "ketones"]);
assert.equal(TEG_PARAMETERS.length, 5); assert.equal(CBC_PARAMETERS.length, 9);
assert.equal(COAG_PARAMETERS.length, 5); assert.equal(ABG_PARAMETERS.length, 7);

console.log("--- TEST: Supported Tests Registry & Expansion ---");
["coag_full", "cbc", "coag", "abg", "thyroid", "troponin", "d_dimer", "spo2"].forEach(id => {
  assert.ok(isLabReportSupported(id), `${id} is supported as lab report`);
});
assert.equal(isLabReportSupported("ct_head"), false);
const expanded = getEffectiveOrderedDiag(["bmp", "ecg"]);
assert.ok(expanded.includes("bmp") && expanded.includes("crp") && expanded.includes("lactate"));

console.log("--- TEST: Spoiler Cleaner ---");
assert.equal(cleanLabText("🔴 Креатинин 142 мкмоль/л ↑ (гипокалиемия!)"), "Креатинин 142 мкмоль/л");
assert.equal(cleanLabText("ОАМ: лейкоцитурия >100/п.з."), "лейкоцитурия >100/п.з");

console.log("--- TEST: BMP & Profiles Parsing ---");
const bmpCaseText = "🔴 Креатинин 142 мкмоль/л (СКФ 48 — острое повреждение), K+ 4.0, Na+ 141.";
const parsedBmp = parseLabTest("bmp", bmpCaseText, ["creatinine", "potassium", "sodium", "alt"]);
assert.equal(parsedBmp.find((p) => p.id === "creatinine").isActuallyAbnormal, true);
assert.equal(parsedBmp.find((p) => p.id === "potassium").isActuallyAbnormal, false);
assert.equal(parsedBmp.find((p) => p.id === "alt").isActuallyAbnormal, false);

console.log("--- TEST: TEG, CBC, ABG, Urine Parsing ---");
const parsedTeg = parseLabTest("coag_full", "TEG: R-время 4 мин, MA 72 мм. ДВС-синдром.");
assert.equal(parsedTeg.find((p) => p.id === "teg_r").isActuallyAbnormal, true);
assert.ok(parseLabTest("coag_full", "coag_full: в пределах нормы.").every(p => !p.isActuallyAbnormal));

const parsedCbc = parseLabTest("cbc", "🔴 Hb 72 г/л ↓↓. Тромбоциты 42 ↓↓. Лейк 24.8.");
assert.equal(parsedCbc.find((p) => p.id === "cbc_hb").isActuallyAbnormal, true);
assert.equal(parsedCbc.find((p) => p.id === "cbc_plt").isActuallyAbnormal, true);

const parsedAbg = parseLabTest("abg", "🔴 pH 7.18 ↓↓, PaCO₂ 68 ↑↑. Тяжёлый ацидоз.");
assert.equal(parsedAbg.find((p) => p.id === "abg_ph").isActuallyAbnormal, true);

const parsedUrine = parseLabTest("urine", "🔴 ОАМ: лейкоцитурия >100/п.з., бактериурия +++.");
assert.equal(parsedUrine.find((p) => p.id === "urine_wbc").isActuallyAbnormal, true);

console.log("--- TEST: Doctor Interpretation Scoring ---");
const perfectScore = scoreLabEvaluation(parsedBmp, { creatinine: "abnormal", potassium: "normal", sodium: "normal", alt: "normal" });
assert.equal(perfectScore.scorePercent, 100); assert.equal(perfectScore.allCorrect, true);
const missedScore = scoreLabEvaluation(parsedBmp, { creatinine: "normal", potassium: "normal", sodium: "normal", alt: "normal" });
assert.equal(missedScore.scorePercent, 75); assert.equal(missedScore.mistakes.length, 1);

console.log("--- TEST: Substrate Validation & Procedure Restrictions (6 Requirements) ---");
// 1. Paracentesis without ascites -> Cancellation protocol
const noAscites = resolveDiagnosticResult("paracentesis", { testResults: {} });
assert.equal(noAscites, PROCEDURE_CANCELLATIONS.paracentesis);
const parsedNoAscites = parseLabTest("paracentesis", noAscites);
assert.equal(parsedNoAscites[0].isCancelled, true);
assert.equal(isProcedureCancelled(noAscites), true);

// Paracentesis with actual ascites -> normal parsing without triage spoiler leakage
const realAscites = "🟡 Лапароцентез: Белок 16 г/л, альбумин 8 г/л. Нейтрофилы 110/мкл.";
const parsedRealAscites = parseLabTest("paracentesis", realAscites);
assert.ok(parsedRealAscites.find(p => p.id === "asc_neutro").displayValue.includes("110"));
assert.equal(parsedRealAscites.find(p => p.id === "asc_appearance").isActuallyAbnormal, false, "Appearance is normal");
assert.equal(parsedRealAscites[0].isCancelled, undefined);

// 2. PCR stool without diarrhea -> Refusal notice
const noStool = resolveDiagnosticResult("pcr_stool", { testResults: {} });
assert.equal(noStool, PROCEDURE_CANCELLATIONS.pcr_stool);
assert.equal(parseLabTest("pcr_stool", noStool)[0].isCancelled, true);

// 3. Colonoscopy without bowel prep -> Aborted protocol
const noPrepColo = resolveDiagnosticResult("colonoscopy", { testResults: {} });
assert.equal(noPrepColo, PROCEDURE_CANCELLATIONS.colonoscopy);
assert.equal(isProcedureCancelled(noPrepColo), true);

// 4. 24-h pH-impedance in acute/emergency status -> Cancelled
const noIndPh = resolveDiagnosticResult("ph_impedance", { testResults: {} });
assert.equal(noIndPh, PROCEDURE_CANCELLATIONS.ph_impedance);
assert.equal(isProcedureCancelled(noIndPh), true);

// 5. Lumbar puncture in intracranial mass effect / herniation risk -> Contraindicated
const ichCase = {
  diagnosis: "Геморрагический инсульт. Внутримозговое кровоизлияние.",
  testResults: { ct_head: "массивное ВК 45 мл, смещение срединных структур 8 мм" },
};
assert.equal(hasIntracranialHerniationRisk(ichCase), true);
const lumbarCancel = resolveDiagnosticResult("lumbar", ichCase);
assert.equal(lumbarCancel, PROCEDURE_CANCELLATIONS.lumbar_herniation);
assert.equal(isProcedureCancelled(lumbarCancel), true);
assert.equal(parseLabTest("lumbar", lumbarCancel)[0].isCancelled, true);

// Ischemic stroke with malignant edema and midline shift -> also contraindicated
const ischemicEdemaCase = {
  diagnosis: "Ишемический инсульт. Малигнизированный отёк полушария.",
  testResults: { ct_head: "КТ: смещение срединных структур вправо на 9 мм, компрессия желудочка" },
};
assert.equal(hasIntracranialHerniationRisk(ischemicEdemaCase), true);
assert.equal(resolveDiagnosticResult("lumbar", ischemicEdemaCase), PROCEDURE_CANCELLATIONS.lumbar_herniation);

// Non-brain cases with "передозировка", "остановка" or GI "геморрагический шок" must NOT trigger herniation risk
assert.equal(hasIntracranialHerniationRisk({ diagnosis: "Кома. Передозировка инсулина.", testResults: { ct_head: "Норма" } }), false);
assert.equal(hasIntracranialHerniationRisk({ diagnosis: "Язва желудка. Геморрагический шок.", testResults: {} }), false);

// Safety Engine detection for contraindicated lumbar
const safetyResult = evaluateClinicalSafety(ichCase, [], ["lumbar"]);
assert.ok(safetyResult.criticalErrors.some(e => e.id === "lumbar"), "SafetyEngine must catch lumbar in herniation");

// Meningitis case where lumbar is indicated
const menCase = { needDiag: ["lumbar"], testResults: { lumbar: "ЦСЖ: лейкоциты 3200" } };
assert.equal(hasIntracranialHerniationRisk(menCase), false);
assert.equal(resolveDiagnosticResult("lumbar", menCase), "ЦСЖ: лейкоциты 3200");

// 6. Urine (ОАМ) standard catheterization remains available
const urineStd = resolveDiagnosticResult("urine", { testResults: {} });
assert.ok(!isProcedureCancelled(urineStd));

// 7. Stationary Department multi-day cycle substrate enforcement
const statUcCase = { id: "stat_uc", testResults: { colonoscopy: "Колит" } }; // no ascites
assert.equal(getDynamicTestResult(statUcCase, "paracentesis", 1, []), PROCEDURE_CANCELLATIONS.paracentesis);
assert.equal(getDynamicTestResult(statUcCase, "pcr_stool", 1, []), PROCEDURE_CANCELLATIONS.pcr_stool);
const statCirrhosis = { id: "stat_cirrhosis", testResults: { paracentesis: "Асцит" } }; // no bowel prep
assert.equal(getDynamicTestResult(statCirrhosis, "colonoscopy", 1, []), PROCEDURE_CANCELLATIONS.colonoscopy);

// 8. Morphology check for isProcedureCancelled
assert.equal(isProcedureCancelled("Пункция невозможна: асцита нет"), true);
assert.equal(isProcedureCancelled("Проведение исследования невозможно"), true);
assert.equal(isProcedureCancelled("Лапароцентез отменен"), true);
assert.equal(isProcedureCancelled("Колоноскопия прекращена врачом"), true);
assert.equal(isProcedureCancelled("Рентген: очаговых теней не выявлено"), false);

console.log("--- TEST: Clinical Edge Cases (Thyroid, Culture, SpO2) ---");
const thyParsed = parseLabTest("thyroid", "🔴 ТТГ <0.01. Т4 своб. = 82 пмоль/л ↑↑↑.");
assert.equal(thyParsed.find(p => p.id === "thy_ft4").isActuallyAbnormal, true);
const cultParsed = parseLabTest("culture", "Посев крови: Streptococcus pneumoniae.");
assert.ok(cultParsed.some(p => p.isActuallyAbnormal));
const spo2Parsed = parseLabTest("spo2", "🔴 SpO₂ 82% — гипоксемия.");
assert.equal(spo2Parsed[0].displayValue, "82%");

console.log("ALL LAB ANALYSIS AND PROCEDURE RESTRICTION TESTS PASSED! [OK]");
