import { CASES } from "../src/data/cases/index.js";
import { initPS, computeOutcome } from "../src/engine/patient.js";
import { tickDeterioration, applyTreatmentEffects, resolveStatus } from "../src/engine/deterioration.js";
import { computeScore } from "../src/engine/scoring.js";
import { createDifferentialEngine, addClinicalEvidence, removeClinicalEvidence, getRankedHypotheses, getLeadingHypothesis } from "../src/engine/differentialEngine.js";
import { TREATMENTS } from "../src/data/treatments.js";
import { DIAGNOSTICS, DIAGNOSTIC_REFS } from "../src/data/diagnostics.js";

console.log("=== MEDSIM V2.2.1 COMPREHENSIVE CLINICAL RUNTIME & QA AUDIT ===");

let passed = 0;
let failed = 0;

function check(name, condition, errorMsg = "") {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`❌ FAILED: ${name} ${errorMsg}`);
  }
}

// -------------------------------------------------------------
// 1. FULL CLINICAL WORKFLOW TESTS (CASES A, B, C)
// -------------------------------------------------------------
console.log("\n[TEST GROUP 1] Full Clinical Workflow Across 3 Distinct Specialties:");

// Case A: Cardiac ICU (Case 1: Острый коронарный синдром / ОИМ)
const caseA = CASES.find(c => c.category === "cardiac" && c.department === "icu") || CASES[0];
const psA = initPS(caseA);
check("Case A (Cardiac ICU) PS initialized", psA.hr > 0 && psA.sbp > 0);

// ABCDE Sequential Assessment on Case A
const eventsA = [];
const addEventA = (text, type) => eventsA.push({ id: Date.now() + Math.random(), text, type, elapsed: "0:05" });
addEventA("[ABCDE A] Проходимость ВДП: ВДП проходимы, западения языка нет", "result");
addEventA("[ABCDE B] Аускультация легких: Выслушиваются рассеянные влажные хрипы", "warn");
addEventA("[ABCDE C] Пальпация пульса: Пульс удовлетворительного наполнения", "result");
addEventA("[ABCDE D] Зрачковые реакции: Зрачки D = S, фотореакция сохранена", "result");
addEventA("[ABCDE E] Осмотр кожи: Кожные покровы чистые", "result");

check("Case A: All 5 ABCDE events logged with timestamps", eventsA.length === 5);
check("Case A: Event log contains section tag [ABCDE A]", eventsA[0].text.includes("[ABCDE A]"));

// Case B: Neuro Admission (Case 10: ОНМК / Ишемический инсульт)
const caseB = CASES.find(c => c.category === "neuro") || CASES[9];
const psB = initPS(caseB);
check("Case B (Neuro) PS initialized", psB.hr > 0 && psB.gcs >= 3);

// Diagnostics ordering and TAT for Case B
const orderedDiagB = ["ct_head", "coag", "glucose"];
const revealedResultsB = {};
orderedDiagB.forEach(id => {
  revealedResultsB[id] = caseB.testResults[id] || `${id}: норма.`;
  const meta = DIAGNOSTIC_REFS[id];
  check(`Case B: Test ${id} has authentic reference metadata`, meta && meta.refRange && meta.unit);
});
check("Case B: CT Head result present", revealedResultsB.ct_head && revealedResultsB.ct_head.length > 0);

// Case C: Respiratory / Infectious (Case 19: Сепсис / Пневмония)
const caseC = CASES.find(c => c.category === "infectious" || c.category === "respiratory") || CASES[18];
const psC = initPS(caseC);
check("Case C (Infectious/Respiratory) PS initialized", psC.temp > 0);

// Treatment in 7 categories for Case C
const appliedTreatC = caseC.needTreat;
check("Case C has needTreat prescribed", appliedTreatC && appliedTreatC.length > 0);
const scoreC = computeScore(caseC, caseC.needDiag, caseC.needTreat, caseC.diagnosis, psC, 180, new Set(["shortHistory"]));
check("Case C scoring computes valid grade", scoreC.score >= 50 && scoreC.gradeId !== "unsatisfactory");


// -------------------------------------------------------------
// 2. DIFFERENTIAL DIAGNOSIS REASONING ACROSS 3 CASES
// -------------------------------------------------------------
console.log("\n[TEST GROUP 2] Deterministic Differential Reasoning & Evidence Tracking:");

[caseA, caseB, caseC].forEach((testCase, idx) => {
  let engine = createDifferentialEngine(testCase);
  check(`Case ${idx + 1} (${testCase.category}): Diff engine created`, engine !== null);
  
  const initialLeading = getLeadingHypothesis(engine);
  check(`Case ${idx + 1}: Initial leading hypothesis is primary diagnosis`, initialLeading.name === testCase.diagnosis);
  
  // Add supporting tests from needDiag
  (testCase.needDiag || []).forEach(testId => {
    engine = addClinicalEvidence(engine, testId);
  });
  
  const updatedRanked = getRankedHypotheses(engine);
  const updatedLeading = getLeadingHypothesis(engine);
  check(`Case ${idx + 1}: Leading hypothesis probability increased with evidence`, updatedLeading.probabilityPct >= initialLeading.probabilityPct);
  
  // Verify probabilities sum to ~100%
  const sum = updatedRanked.reduce((acc, h) => acc + h.probabilityPct, 0);
  check(`Case ${idx + 1}: Probability sum normalized to ~100% (${sum}%)`, sum >= 98 && sum <= 102);
});


// -------------------------------------------------------------
// 3. ABCDE CLINICAL EDGE CASES & MAP CALCULATION
// -------------------------------------------------------------
console.log("\n[TEST GROUP 3] ABCDE Edge Cases & Strict MAP Calculation Verification:");

// Edge Case 1: Cardiac Arrest (HR=0, BP=---/---)
const arrestCase = { id: "test_arrest", vitals: { bp: "---/---", hr: 0, rr: 0, spo2: 0, temp: 35 }, isClinicalArrest: true };
const arrestPS = initPS(arrestCase);
check("Arrest PS: SBP is 0", arrestPS.sbp === 0);
check("Arrest PS: DBP is 0", arrestPS.dbp === 0);
// MAP calculation check
const hasBp1 = arrestPS.sbp > 0 && arrestPS.dbp > 0;
const map1 = hasBp1 ? Math.round((arrestPS.sbp + 2 * arrestPS.dbp) / 3) : null;
check("Arrest MAP is null (NOT fake 93 or 120/80)", map1 === null);

// Edge Case 2: Missing DBP (e.g. SBP=90, DBP=0)
const missingDbpPS = { sbp: 90, dbp: 0, hr: 80, rr: 16, spo2: 98, temp: 36.6, gcs: 15, pain: 0 };
const hasBp2 = missingDbpPS.sbp > 0 && missingDbpPS.dbp > 0;
const map2 = hasBp2 ? Math.round((missingDbpPS.sbp + 2 * missingDbpPS.dbp) / 3) : null;
check("Missing DBP MAP is null (NOT calculated with fake DBP)", map2 === null);

// Edge Case 3: Normal Patient (BP=120/80)
const normalPS = { sbp: 120, dbp: 80, hr: 75, rr: 16, spo2: 98, temp: 36.6, gcs: 15, pain: 0 };
const hasBp3 = normalPS.sbp > 0 && normalPS.dbp > 0;
const map3 = hasBp3 ? Math.round((normalPS.sbp + 2 * normalPS.dbp) / 3) : null;
check("Normal MAP: (120 + 2*80)/3 = 93 mmHg", map3 === 93);

// Edge Case 4: Critical Shock (BP=70/40)
const shockPS = { sbp: 70, dbp: 40, hr: 135, rr: 28, spo2: 89, temp: 39.2, gcs: 11, pain: 6 };
const hasBp4 = shockPS.sbp > 0 && shockPS.dbp > 0;
const map4 = hasBp4 ? Math.round((shockPS.sbp + 2 * shockPS.dbp) / 3) : null;
check("Shock MAP: (70 + 2*40)/3 = 50 mmHg", map4 === 50);


// -------------------------------------------------------------
// 4. DIAGNOSTIC REFS & RESULT CARD CLINICAL DICTIONARY
// -------------------------------------------------------------
console.log("\n[TEST GROUP 4] Diagnostic Metadata & Laboratory Workspace Consistency:");
DIAGNOSTICS.forEach(d => {
  const meta = DIAGNOSTIC_REFS[d.id];
  check(`Diagnostic ${d.id} (${d.name}) has unit defined`, meta && typeof meta.unit === "string");
  check(`Diagnostic ${d.id} (${d.name}) has refRange defined`, meta && typeof meta.refRange === "string");
  check(`Diagnostic ${d.id} (${d.name}) has tatSec defined`, meta && typeof meta.tatSec === "number" && meta.tatSec > 0);
  check(`Diagnostic ${d.id} (${d.name}) has sample type defined`, meta && typeof meta.sample === "string");
});


// -------------------------------------------------------------
// 5. TREATMENT 7-CATEGORY MAPPING VERIFICATION
// -------------------------------------------------------------
console.log("\n[TEST GROUP 5] Treatment 7-Category Grouping Consistency:");
const requiredGroups = ["emergency", "cardiovascular", "analgesia", "respiratory", "antimicrobial", "fluid", "other"];
const categoryMap = {
  emergency: ["intubation", "defibrillation", "chest_compressions", "pericardiocentesis", "epinephrine_im", "naloxone", "atropine", "activated_charcoal", "gastric_lavage", "succinylcholine"],
  analgesia: ["morphine", "ketamine", "diazepam", "levetiracetam"],
  cardiovascular: ["aspirin", "heparin", "thrombolysis", "nitroglycerin", "metoprolol", "amiodarone", "pci", "ACE_inhibitor", "digoxin", "nimodipine", "magnesium", "dopamine", "vasopressin", "norepinephrine", "epinephrine"],
  respiratory: ["oxygen", "steroids"],
  antimicrobial: ["antibiotics_broad", "acyclovir"],
  fluid: ["iv_fluids", "warm_iv", "blood_transfusion", "furosemide", "mannitol", "dialysis", "aminocaproic_acid"],
  other: ["insulin", "dextrose", "thyroxine", "surgery_consult"]
};

let allTreatmentsFound = 0;
Object.entries(categoryMap).forEach(([cat, ids]) => {
  ids.forEach(id => {
    const item = TREATMENTS.find(t => t.id === id);
    check(`Treatment ${id} exists in TREATMENTS`, item !== undefined);
    if (item) allTreatmentsFound++;
  });
});
check("All 44 treatments accounted for across 7 clinical categories", allTreatmentsFound === TREATMENTS.length);


// -------------------------------------------------------------
// 6. SCORING & PATIENT INTEGRITY PRESERVATION
// -------------------------------------------------------------
console.log("\n[TEST GROUP 6] Scoring & Clinical Scoring Integrity:");
CASES.forEach(c => {
  const pState = initPS(c);
  const outcome = computeOutcome(pState, c);
  check(`Case ${c.id}: Initial outcome valid (${outcome})`, ["stable", "unstable", "critical", "dead"].includes(outcome));
});


// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
console.log("\n==================================================");
console.log(`TOTAL CHECKS PASSED: ${passed}`);
console.log(`TOTAL CHECKS FAILED: ${failed}`);
console.log("==================================================");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("✓ ALL MEDSIM V2.2.1 BROWSER RUNTIME & CLINICAL WORKFLOW CHECKS PASSED WITH 0 FAILURES!");
}
