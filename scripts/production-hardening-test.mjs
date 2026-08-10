import { evaluateClinicalDecision } from "../src/engine/decisionEngine.js";
import { evaluateClinicalSafety } from "../src/engine/safetyEngine.js";
import { calculateMap, evaluateReassessment, createReassessmentCheckpoint } from "../src/engine/reassessmentEngine.js";
import { deriveProblemList, evaluateProblemTransitions } from "../src/engine/problemListEngine.js";
import { CASES } from "../src/data/cases/index.js";

console.log("=== MEDSIM V2.5 PRODUCTION HARDENING & CLOSED-LOOP SUITE ===");

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

// 1. MAP Safety Contract (Strict Guard)
check("Normal MAP: (120 + 2*80)/3 = 93", calculateMap(120, 80) === 93);
check("Shock MAP: (75 + 2*45)/3 = 55", calculateMap(75, 45) === 55);
check("Cardiac arrest (HR=0, BP=0/0) -> MAP is null", calculateMap(0, 0) === null);
check("Zero DBP (SBP=90, DBP=0) -> MAP is null", calculateMap(90, 0) === null);
check("Zero SBP (SBP=0, DBP=60) -> MAP is null", calculateMap(0, 60) === null);
check("Negative/Invalid vitals -> MAP is null", calculateMap(-20, 50) === null);

// 2. Decision Engine: Emergency Response vs De-escalation
const extremePS = { hr: 160, sbp: 65, dbp: 30, rr: 38, spo2: 78, temp: 39.0, gcs: 7, pain: 9 };
const basePS = { hr: 130, sbp: 80, dbp: 40, rr: 30, spo2: 84, temp: 37.0, gcs: 12, pain: 6 };
const repNegative = evaluateReassessment(basePS, extremePS);
const transNegative = evaluateProblemTransitions(deriveProblemList(basePS), deriveProblemList(extremePS));
const decExtreme = evaluateClinicalDecision(repNegative, transNegative, extremePS);

check("Extreme deterioration triggers EMERGENCY_RESPONSE option", decExtreme.suggestedPlans.some(p => p.id === "emergency_response"));
check("Extreme deterioration has critical badge", decExtreme.badge.includes("КРИТИЧЕСКИЙ"));

// De-escalation on stable recovery
const recoveredPS = { hr: 72, sbp: 120, dbp: 80, rr: 16, spo2: 98, temp: 36.6, gcs: 15, pain: 0 };
const repPositive = evaluateReassessment(basePS, recoveredPS);
const transPositive = evaluateProblemTransitions(deriveProblemList(basePS), deriveProblemList(recoveredPS));
const decRecovered = evaluateClinicalDecision(repPositive, transPositive, recoveredPS);

check("Full recovery triggers STOP / DE-ESCALATE plan", decRecovered.suggestedPlans.some(p => p.id === "deescalate"));
check("Decision for recovered patient is IMPROVED", decRecovered.type === "IMPROVED");

// 3. Safety Engine: Missed Escalation & Blind Polypharmacy
const sampleCase = CASES[0];
const criticalTrajectory = [
  { checkpointId: "INITIAL", vitals: { sbp: 65, spo2: 78, hr: 145, dbp: 30 } }
];

const reportMissedEscalation = evaluateClinicalSafety(
  sampleCase,
  ["aspirin"], // routine med, but missed emergency resuscitation
  [],
  new Set(["lifeHistory"]),
  criticalTrajectory
);

check("Missed emergency escalation detected during hemodynamic collapse", reportMissedEscalation.sequentialErrors.some(e => e.type === "missed_escalation"));

// 4. Closed-Loop Multi-checkpoint Immutability
const cp1 = createReassessmentCheckpoint({
  iteration: 1,
  checkpointId: "REASSESSMENT #1",
  previousState: basePS,
  currentState: extremePS,
  activeProblems: deriveProblemList(extremePS)
});

const cp1Frozen = JSON.stringify(cp1);
// Modify temporary object
extremePS.hr = 999;
check("Historical checkpoint remains strictly immutable after future state updates", JSON.stringify(cp1) === cp1Frozen);

console.log("\n==================================================");
console.log(`TOTAL PRODUCTION HARDENING CHECKS PASSED: ${passed}`);
console.log(`TOTAL PRODUCTION HARDENING CHECKS FAILED: ${failed}`);
console.log("==================================================");

if (failed > 0) process.exit(1);
