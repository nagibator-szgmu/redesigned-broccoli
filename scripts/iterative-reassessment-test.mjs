import { evaluateReassessment, createReassessmentCheckpoint } from "../src/engine/reassessmentEngine.js";

console.log("=== ITERATIVE REASSESSMENT ENGINE VERIFICATION TEST ===");

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

// 1. Initial baseline state
const ps0 = { hr: 140, sbp: 75, dbp: 40, rr: 32, spo2: 84, temp: 37.0, gcs: 11, pain: 8 };

// Checkpoint 1: After Oxygen & Fluid bolus -> Partial improvement
const ps1 = { hr: 120, sbp: 88, dbp: 50, rr: 26, spo2: 92, temp: 37.0, gcs: 13, pain: 7 };
const cp1 = createReassessmentCheckpoint({
  iteration: 1,
  checkpointId: "REASSESSMENT #1",
  previousState: ps0,
  currentState: ps1,
  activeProblems: [{ id: "hypoxemia", severity: "moderate" }, { id: "hemodynamic_shock", severity: "moderate" }],
  recentInterventions: ["oxygen", "iv_fluids"]
});

check("Checkpoint #1 generated", cp1.checkpointId === "REASSESSMENT #1");
check("Checkpoint #1 response is positive", cp1.overallResponse === "positive");
check("Checkpoint #1 improvedCount > 0", cp1.improvedCount >= 4);
check("Checkpoint #1 MAP computed correctly: (88 + 2*50)/3 = 63", cp1.map === 63);

// Checkpoint 2: After Vasopressor & Analgesia -> Full stabilization
const ps2 = { hr: 85, sbp: 115, dbp: 75, rr: 16, spo2: 98, temp: 36.8, gcs: 15, pain: 2 };
const cp2 = createReassessmentCheckpoint({
  iteration: 2,
  checkpointId: "REASSESSMENT #2",
  previousState: ps1,
  currentState: ps2,
  activeProblems: [],
  recentInterventions: ["norepinephrine", "morphine"]
});

check("Checkpoint #2 generated", cp2.checkpointId === "REASSESSMENT #2");
check("Checkpoint #2 response is positive", cp2.overallResponse === "positive");
check("Checkpoint #2 MAP is 88", cp2.map === 88);

// Checkpoint 3: After Adverse Event (Deterioration)
const ps3 = { hr: 150, sbp: 65, dbp: 30, rr: 36, spo2: 80, temp: 38.5, gcs: 8, pain: 9 };
const cp3 = createReassessmentCheckpoint({
  iteration: 3,
  checkpointId: "REASSESSMENT #3",
  previousState: ps2,
  currentState: ps3,
  activeProblems: [{ id: "hemodynamic_shock", severity: "critical" }, { id: "hypoxemia", severity: "critical" }],
  recentInterventions: ["wrong_med"]
});

check("Checkpoint #3 generated", cp3.checkpointId === "REASSESSMENT #3");
check("Checkpoint #3 response is negative", cp3.overallResponse === "negative");
check("Checkpoint #3 trend is deteriorating", cp3.trend === "deteriorating");

// 2. Snapshot immutability check
const cp1SnapshotBefore = JSON.stringify(cp1);
const cp2SnapshotBefore = JSON.stringify(cp2);

// Simulate future state modifications
ps1.hr = 999;
ps2.sbp = 0;

check("Historical Checkpoint #1 was not mutated retroactively", JSON.stringify(cp1) === cp1SnapshotBefore);
check("Historical Checkpoint #2 was not mutated retroactively", JSON.stringify(cp2) === cp2SnapshotBefore);
check("Checkpoint #1 vitals remain immutable: HR 120", cp1.vitals.hr === 120);

console.log("\n==================================================");
console.log(`TOTAL ITERATIVE REASSESSMENT CHECKS PASSED: ${passed}`);
console.log(`TOTAL ITERATIVE REASSESSMENT CHECKS FAILED: ${failed}`);
console.log("==================================================");

if (failed > 0) process.exit(1);
