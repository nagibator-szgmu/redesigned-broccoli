import { evaluateReassessment, calculateMap } from "../src/engine/reassessmentEngine.js";

console.log("=== REASSESSMENT ENGINE VERIFICATION TEST ===");

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

// 1. MAP calculation guards
check("Normal MAP: (120 + 2*80)/3 = 93", calculateMap(120, 80) === 93);
check("Shock MAP: (70 + 2*40)/3 = 50", calculateMap(70, 40) === 50);
check("Cardiac arrest (SBP=0, DBP=0) -> MAP is null", calculateMap(0, 0) === null);
check("Missing DBP (SBP=90, DBP=0) -> MAP is null", calculateMap(90, 0) === null);
check("Negative/Invalid values -> MAP is null", calculateMap(-10, 80) === null);

// 2. Improvement scenario
const baselineShock = {
  hr: 135,
  sbp: 78,
  dbp: 44,
  rr: 30,
  spo2: 88,
  temp: 38.8,
  gcs: 11,
  pain: 8
};

const postFluidPS = {
  hr: 105,
  sbp: 96,
  dbp: 58,
  rr: 22,
  spo2: 96,
  temp: 37.6,
  gcs: 14,
  pain: 3
};

const resultImproved = evaluateReassessment(baselineShock, postFluidPS);
check("Improved response detected", resultImproved.overallResponse === "positive");
check("Parameters count is 9 (HR, SBP, DBP, MAP, SpO2, RR, GCS, Pain, Temp)", resultImproved.parameters.length === 9);

const sbpEval = resultImproved.parameters.find(p => p.parameter === "sbp");
check("SBP improved: 78 -> 96 (delta +18)", sbpEval && sbpEval.direction === "improved" && sbpEval.delta === 18);

const spo2Eval = resultImproved.parameters.find(p => p.parameter === "spo2");
check("SpO2 improved: 88 -> 96 (delta +8)", spo2Eval && spo2Eval.direction === "improved" && spo2Eval.delta === 8);

const painEval = resultImproved.parameters.find(p => p.parameter === "pain");
check("Pain improved: 8 -> 3 (delta -5)", painEval && painEval.direction === "improved" && painEval.delta === -5);

// 3. Worsening scenario
const deterioratingPS = {
  hr: 155,
  sbp: 62,
  dbp: 32,
  rr: 36,
  spo2: 82,
  temp: 39.6,
  gcs: 7,
  pain: 9
};

const resultWorsened = evaluateReassessment(baselineShock, deterioratingPS);
check("Worsened response detected", resultWorsened.overallResponse === "negative");
check("Worsened count > improved count", resultWorsened.worsenedCount > resultWorsened.improvedCount);

// 4. Unchanged scenario
const identicalPS = { ...baselineShock };
const resultUnchanged = evaluateReassessment(baselineShock, identicalPS);
check("Unchanged response detected", resultUnchanged.overallResponse === "neutral");
check("All active params unchanged", resultUnchanged.parameters.every(p => p.direction === "unchanged" || p.direction === "not_assessable"));

// 5. Cardiac arrest / Not assessable MAP
const arrestBase = { hr: 0, sbp: 0, dbp: 0, rr: 0, spo2: 0, temp: 35.0, gcs: 3, pain: 0 };
const arrestCur = { hr: 0, sbp: 0, dbp: 0, rr: 0, spo2: 0, temp: 35.0, gcs: 3, pain: 0 };
const resultArrest = evaluateReassessment(arrestBase, arrestCur);
const mapArrest = resultArrest.parameters.find(p => p.parameter === "map");
check("Cardiac arrest MAP is not_assessable", mapArrest && mapArrest.direction === "not_assessable");

console.log("\n==================================================");
console.log(`TOTAL REASSESSMENT CHECKS PASSED: ${passed}`);
console.log(`TOTAL REASSESSMENT CHECKS FAILED: ${failed}`);
console.log("==================================================");

if (failed > 0) process.exit(1);
