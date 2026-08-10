import { deriveProblemList } from "../src/engine/problemListEngine.js";

console.log("=== PROBLEM LIST ENGINE VERIFICATION TEST ===");

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

// 1. Normal state -> 0 problems
const normalPS = { hr: 75, sbp: 120, dbp: 80, rr: 16, spo2: 98, temp: 36.6, gcs: 15, pain: 0 };
const normalProblems = deriveProblemList(normalPS);
check("Normal patient derives 0 problems", normalProblems.length === 0);

// 2. Severe Respiratory Failure & Hypoxemia
const respFailurePS = { hr: 110, sbp: 125, dbp: 80, rr: 34, spo2: 86, temp: 37.0, gcs: 14, pain: 2 };
const respProblems = deriveProblemList(respFailurePS);
const hypoxemia = respProblems.find(p => p.id === "hypoxemia");
check("Hypoxemia detected", hypoxemia !== undefined);
check("Hypoxemia is critical (<90%)", hypoxemia && hypoxemia.severity === "critical");
check("Evidence contains SpO2 value", hypoxemia && hypoxemia.evidence.some(e => e.includes("86%")));

// 3. Cardiogenic Shock
const shockPS = { hr: 130, sbp: 72, dbp: 40, rr: 24, spo2: 91, temp: 36.2, gcs: 12, pain: 8 };
const shockProblems = deriveProblemList(shockPS, { troponin: "🔴 Тропонин I: 4.8 нг/мл (ОИМ)" });
const shockProb = shockProblems.find(p => p.id === "hemodynamic_shock");
check("Hemodynamic shock detected", shockProb && shockProb.severity === "critical");

const painProb = shockProblems.find(p => p.id === "severe_pain");
check("Severe pain detected", painProb !== undefined);

const tropProb = shockProblems.find(p => p.id === "myocardial_necrosis");
check("Myocardial necrosis lab syndrome detected from troponin", tropProb !== undefined);

// 4. Coma / Neurological deficit
const comaPS = { hr: 60, sbp: 140, dbp: 85, rr: 12, spo2: 97, temp: 36.6, gcs: 6, pain: 0 };
const comaProblems = deriveProblemList(comaPS);
const comaProb = comaProblems.find(p => p.id === "altered_mental_status");
check("Coma / Airway risk detected when GCS <= 8", comaProb && comaProb.severity === "critical");

// 5. Severe Acidemia from ABG
const acidemiaProblems = deriveProblemList(normalPS, { abg: "Декомпенсированный метаболический ацидоз, pH 7.15" });
const acidProb = acidemiaProblems.find(p => p.id === "severe_acidemia");
check("Severe acidemia derived from ABG test result", acidProb !== undefined);

console.log("\n==================================================");
console.log(`TOTAL PROBLEM LIST CHECKS PASSED: ${passed}`);
console.log(`TOTAL PROBLEM LIST CHECKS FAILED: ${failed}`);
console.log("==================================================");

if (failed > 0) process.exit(1);
