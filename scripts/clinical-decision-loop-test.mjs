import { deriveProblemList, evaluateProblemTransitions } from "../src/engine/problemListEngine.js";
import { evaluateReassessment } from "../src/engine/reassessmentEngine.js";
import { evaluateClinicalDecision } from "../src/engine/decisionEngine.js";

console.log("=== CLINICAL DECISION LOOP VERIFICATION TEST ===");

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

// 1. Initial State: Acute Hypoxemic Respiratory Failure
const ps0 = { hr: 130, sbp: 85, dbp: 45, rr: 34, spo2: 82, temp: 37.2, gcs: 13, pain: 6 };
const initialProblems = deriveProblemList(ps0);
check("Initial problems derived: hypoxemia, shock, tachycardia, ventilatory_failure, pain", initialProblems.length >= 4);

// Intervention #1: Oxygen 15L mask
const ps1 = { hr: 110, sbp: 90, dbp: 50, rr: 24, spo2: 95, temp: 37.2, gcs: 14, pain: 6 };
const curProblems1 = deriveProblemList(ps1);
const reassess1 = evaluateReassessment(ps0, ps1);
const transitions1 = evaluateProblemTransitions(initialProblems, curProblems1);
const decision1 = evaluateClinicalDecision(reassess1, transitions1);

check("Reassessment #1 overall positive", reassess1.overallResponse === "positive");
check("Decision #1 is IMPROVED", decision1.type === "IMPROVED");
check("Hypoxemia is resolved (SpO2 95%)", transitions1.some(t => t.id === "hypoxemia" && t.status === "resolved"));
check("Pain remains persistent", transitions1.some(t => t.id === "severe_pain" && t.status === "persistent"));
check("Decision #1 suggests continuation & confirmatory testing", decision1.suggestedPlans.some(p => p.id === "continue"));

// Intervention #2: Analgesia & Fluid challenge
const ps2 = { hr: 78, sbp: 120, dbp: 75, rr: 16, spo2: 98, temp: 36.6, gcs: 15, pain: 1 };
const curProblems2 = deriveProblemList(ps2);
const reassess2 = evaluateReassessment(ps1, ps2);
const transitions2 = evaluateProblemTransitions(curProblems1, curProblems2);
const decision2 = evaluateClinicalDecision(reassess2, transitions2);

check("Reassessment #2 overall positive", reassess2.overallResponse === "positive");
check("All remaining initial problems resolved in cycle 2", transitions2.filter(t => t.status === "active").length === 0);
check("Pain resolved", transitions2.some(t => t.id === "severe_pain" && t.status === "resolved"));

// Deterioration Scenario: Adverse response (WORSENED)
const psDeteriorating = { hr: 160, sbp: 60, dbp: 30, rr: 38, spo2: 76, temp: 39.0, gcs: 7, pain: 9 };
const curProblemsDet = deriveProblemList(psDeteriorating);
const reassessDet = evaluateReassessment(ps2, psDeteriorating);
const transitionsDet = evaluateProblemTransitions(curProblems2, curProblemsDet);
const decisionDet = evaluateClinicalDecision(reassessDet, transitionsDet);

check("Deterioration recognized as WORSENED", decisionDet.type === "WORSENED");
check("Decision suggests escalation", decisionDet.suggestedPlans.some(p => p.id === "escalate"));
check("New critical problems activated", transitionsDet.some(t => t.severity === "critical"));

console.log("\n==================================================");
console.log(`TOTAL CLINICAL DECISION LOOP CHECKS PASSED: ${passed}`);
console.log(`TOTAL CLINICAL DECISION LOOP CHECKS FAILED: ${failed}`);
console.log("==================================================");

if (failed > 0) process.exit(1);
