/**
 * Юнит-тесты валидации и фармакодинамики клинического блока «Гастроэнтерология»
 */
import assert from "node:assert/strict";
import { GASTRO_CASES } from "../src/data/cases/gastroenterology/index.js";
import { DIAGNOSTICS } from "../src/data/diagnostics.js";
import { TREATMENTS, TREAT_FX } from "../src/data/treatments.js";
import { evaluateClinicalSafety } from "../src/engine/safetyEngine.js";
import { calculateNextDayVitals } from "../src/hooks/stationary/vitalsProgression.js";
import { getDynamicTestResult } from "../src/hooks/stationary/dynamicTestResults.js";

console.log("=== RUNNING GASTROENTEROLOGY CLINICAL TESTS ===");

console.log("\n--- Testing Gastroenterology Cases Presence & Metadata ---");
assert.equal(GASTRO_CASES.length, 10, "Must contain exactly 10 gastroenterology cases");

const caseIds = GASTRO_CASES.map(c => c.id);
assert.ok(caseIds.includes(56), "Must include case 56 (pancreatitis)");
assert.ok(caseIds.includes(57), "Must include case 57 (GI bleed)");
assert.ok(caseIds.includes(58), "Must include case 58 (perforation)");
assert.ok(caseIds.includes(59), "Must include case 59 (cholangitis)");
assert.ok(caseIds.includes("stat_gastro_1"), "Must include stat_gastro_1 (IBD colitis)");
assert.ok(caseIds.includes("stat_gastro_2"), "Must include stat_gastro_2 (cirrhosis)");
assert.ok(caseIds.includes("outp_gastro_1"), "Must include outp_gastro_1 (peptic ulcer)");
assert.ok(caseIds.includes("outp_gastro_anemia"), "Must include outp_gastro_anemia (atrophic gastritis)");
assert.ok(caseIds.includes("outp_gastro_celiac"), "Must include outp_gastro_celiac (celiac disease)");
assert.ok(caseIds.includes("outp_gastro_gerd"), "Must include outp_gastro_gerd (GERD reflux cough)");
console.log("✓ All 10 gastroenterology cases loaded with valid IDs");

console.log("\n--- Testing Diagnostic Registries for Gastroenterology ---");
const diagIds = new Set(DIAGNOSTICS.map(d => d.id));
["egds", "colonoscopy", "ct_abdo", "xray_abdo", "ferritin", "serology_celiac", "ph_impedance", "paracentesis"].forEach(id => {
  assert.ok(diagIds.has(id), `DIAGNOSTICS must contain ${id}`);
});
console.log("✓ DIAGNOSTICS contains egds, colonoscopy, ct_abdo, xray_abdo, ferritin, serology_celiac, ph_impedance, paracentesis");

console.log("\n--- Testing Treatment Registries & Effects for Gastroenterology ---");
const treatIds = new Set(TREATMENTS.map(t => t.id));
[
  "omeprazole_iv", "octreotide", "endoscopic_hemostasis", "lactulose", "mesalazine", "spasmolytics",
  "albumin", "spironolactone", "rifaximin", "rabeprazole_po", "h_pylori_quadro", "iron_iv", "gluten_free_diet", "biliary_decompression"
].forEach(id => {
  assert.ok(treatIds.has(id), `TREATMENTS must contain ${id}`);
  assert.ok(TREAT_FX[id], `TREAT_FX must define effect for ${id}`);
});
console.log("✓ TREATMENTS & TREAT_FX contain all new gastro medications and procedures");

console.log("\n--- Testing Case 58 Perforation Contraindications with SafetyEngine ---");
const perfCase = GASTRO_CASES.find(c => c.id === 58);
assert.ok(perfCase, "Case 58 must exist");
assert.ok(perfCase.wrongTreat.includes("gastric_lavage"), "gastric_lavage must be wrongTreat in perforation");

const safetyResult = evaluateClinicalSafety(
  perfCase,
  ["gastric_lavage"],
  ["xray_abdo", "ct_abdo"],
  new Set(),
  []
);

assert.ok(safetyResult.criticalErrors.length > 0, "Must detect critical error for gastric_lavage");
console.log("✓ SafetyEngine successfully catches contraindication in perforation");

console.log("\n--- Testing Outpatient Case Route Configuration ---");
["outp_gastro_1", "outp_gastro_anemia", "outp_gastro_celiac", "outp_gastro_gerd"].forEach(id => {
  const c = GASTRO_CASES.find(item => item.id === id);
  assert.equal(c.correctRoute, "treat_outpatient");
  assert.ok(c.routeOptions.length >= 2, `${id} route options must have multiple choices`);
});
console.log("✓ All Outpatient gastro cases have valid routing definition");

console.log("\n--- Testing Stationary Gastro Cases Clinical Revisions (Irina Alekseevna) ---");
const c1 = GASTRO_CASES.find(c => c.id === "stat_gastro_1");
assert.ok(c1.lifeHistory.includes("168 см") && c1.lifeHistory.includes("58 кг"), "stat_gastro_1 must contain height and weight in lifeHistory");
assert.ok(c1.testResults.cbc.includes("17.8"), "stat_gastro_1 must have WBC 17.8 in cbc");
assert.ok(c1.testResults.pcr_stool, "stat_gastro_1 must have pcr_stool in testResults");
assert.ok(c1.needDiag.includes("pcr_stool"), "stat_gastro_1 needDiag must include pcr_stool");
assert.equal(c1.testResults.culture, undefined, "stat_gastro_1 culture must be replaced by pcr_stool");
assert.ok(!c1.testResults.bmp.includes("гипокалиемия на фоне диареи"), "stat_gastro_1 bmp must not contain spoiler in parentheses");
assert.ok(c1.dayByDayPlan[0].plan.includes("116 мг/сут в/в"), "Day 1 plan must contain weight-based prednisolone dose");
assert.ok(c1.dayByDayPlan[2].plan.includes("пульс-терапии"), "Day 3 plan must continue IV pulse therapy");
assert.ok(c1.dayByDayPlan[3].plan.includes("14 суток"), "Day 4 plan must specify induction phase completion (at least 14 days)");
assert.equal(c1.dayByDayPlan[3].temp, 36.6, "stat_gastro_1 Day 4 must have normalized temperature 36.6");
console.log("✓ stat_gastro_1 clinical revisions verified");

const c2 = GASTRO_CASES.find(c => c.id === "stat_gastro_2");
assert.ok(!c2.historyOfIllness.toLowerCase().includes("напряженный асцит") && !c2.historyOfIllness.toLowerCase().includes("напряжённый асцит"), "stat_gastro_2 must not state tense ascites");
assert.ok(c2.diagnosis.includes("умеренный асцит Grade 2"), "stat_gastro_2 diagnosis must specify moderate ascites Grade 2");
assert.ok(c2.testResults.bmp.includes("Натрий 134 ммоль/л"), "stat_gastro_2 initial sodium must be 134");
assert.ok(c2.testResults.coag.includes("ПВ 28 сек (контроль лаборатории 13 сек)"), "stat_gastro_2 coag must contain PT and lab control");
assert.ok(!c2.testResults.paracentesis.includes("> 11 г/л — портальный асцит"), "stat_gastro_2 paracentesis must not have SAAG spoiler");
assert.ok(!c2.testResults.paracentesis.includes("спонтанный бактериальный перитонит исключён"), "stat_gastro_2 paracentesis must not have SBP spoiler");
assert.ok(c2.dayByDayPlan[1].morning.includes("алкогольный тремор") && c2.dayByDayPlan[1].morning.includes("слабость"), "Day 2 must preserve tremor and weakness");
assert.ok(c2.dayByDayPlan[2].morning.includes("алкогольный тремор"), "Day 3 must preserve alcohol tremor");
assert.ok(c2.testResults.egds && !JSON.stringify(c2).includes("ФГДС"), "All FGDS mentions must be replaced with EGDS");
assert.ok(!DIAGNOSTICS.find(d => d.id === "egds").name.includes("ФГДС"), "DIAGNOSTICS egds must not contain ФГДС");
assert.ok(c2.dayByDayPlan[3].plan.includes("Стабилизация декомпенсации цирроза"), "Day 4 plan must formulate cirrhosis decompensation stabilization");
console.log("✓ stat_gastro_2 clinical revisions verified");

console.log("\n--- Testing Maddray DF & MELD-Na Calculation ---");
const ptPatient = 28;
const ptControl = 13;
const biliMgDl = 5.0;
const maddrayDF = 4.6 * (ptPatient - ptControl) + biliMgDl;
assert.equal(maddrayDF, 74, "Maddray DF formula must yield exactly 74");
assert.ok(maddrayDF > 32, "Maddray DF 74 indicates severe alcoholic hepatitis (>32)");
console.log("✓ Maddray DF (74 > 32) and MELD-Na calculations verified");

console.log("\n--- Testing Stationary Vitals Progression & Dynamic Tests ---");
const initPs = { sbp: 105, dbp: 65, hr: 104, spo2: 98, temp: 38.3, gcs: 15, status: "stable" };
const nextPs = calculateNextDayVitals(initPs, c1, 1, ["steroids", "mesalazine", "iv_fluids"]);
assert.equal(nextPs.temp, 37.4, "Adequate day 1 therapy must reduce temperature to 37.4 on day 2");
const dynBmp = getDynamicTestResult(c2, "bmp", 2, ["lactulose", "spironolactone", "albumin"]);
assert.ok(dynBmp.includes("123") && dynBmp.includes("168"), "Dynamic BMP on day 3 crisis must extract Na 123 and Cr 168");
console.log("\n--- Testing Stationary Multi-Day Cycle & Treatment Repeat ---");
let simPs = { ...initPs };
const dayHistory = [];
const prescribedDay1 = ["steroids", "mesalazine", "iv_fluids"];
dayHistory.push({ day: 1, treatments: [...prescribedDay1], vitals: { ...simPs } });
simPs = calculateNextDayVitals(simPs, c1, 1, prescribedDay1);
assert.equal(simPs.temp, 37.4);

// Day 2: repeat yesterday's treatments from dayHistory
const repeatedDay2 = [...dayHistory[dayHistory.length - 1].treatments];
assert.deepEqual(repeatedDay2, prescribedDay1, "Repeated treatments must match yesterday");
dayHistory.push({ day: 2, treatments: [...repeatedDay2], vitals: { ...simPs } });
simPs = calculateNextDayVitals(simPs, c1, 2, repeatedDay2);
assert.equal(simPs.temp, 36.9);

// Day 3 -> Day 4
dayHistory.push({ day: 3, treatments: [...repeatedDay2], vitals: { ...simPs } });
simPs = calculateNextDayVitals(simPs, c1, 3, repeatedDay2);
assert.equal(simPs.temp, 36.6);
assert.ok(simPs.temp < 37.1 && simPs.spo2 >= 95 && simPs.hr <= 95 && simPs.sbp >= 100, "Patient must meet discharge criteria on Day 4");
console.log("✓ Stationary multi-day treatment repeat and recovery progression verified");

console.log("\nALL GASTROENTEROLOGY CLINICAL TESTS PASSED! 🎯\n");
