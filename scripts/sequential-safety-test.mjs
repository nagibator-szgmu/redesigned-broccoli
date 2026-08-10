import { evaluateClinicalSafety } from "../src/engine/safetyEngine.js";
import { CASES } from "../src/data/cases/index.js";

console.log("=== SEQUENTIAL SAFETY ENGINE VERIFICATION TEST ===");

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

const sampleCase = CASES[0]; // Cardiac case

// 1. Single Action Checks
const reportSafe = evaluateClinicalSafety(
  sampleCase,
  sampleCase.needTreat,
  sampleCase.needDiag,
  new Set(["lifeHistory"]),
  []
);
check("Appropriate clinical actions recognized", reportSafe.safetyRating === "safe");
check("Zero critical and zero sequential errors in safe pass", reportSafe.criticalErrors.length === 0 && reportSafe.sequentialErrors.length === 0);

// 2. Sequential Error: Deterioration + Contraindicated Therapy Continuation
const deterioratingTrajectory = [
  { checkpointId: "INITIAL", vitals: { ...sampleCase.vitals } },
  { checkpointId: "REASSESSMENT #1", overallResponse: "negative", trend: "deteriorating" }
];

const reportSequential = evaluateClinicalSafety(
  sampleCase,
  sampleCase.wrongTreat || ["metoprolol"],
  [],
  new Set(),
  deterioratingTrajectory
);

check("Sequential safety error detected when therapy continued despite deterioration", reportSequential.sequentialErrors.length > 0);
check("Sequential error rated as critical severity", reportSequential.sequentialErrors.some(e => e.severity === "critical"));
check("Overall safety rating is critical_breach", reportSequential.safetyRating === "critical_breach");

// 3. Blind Polypharmacy without Reassessment in Critical Case
const criticalCase = { ...sampleCase, severity: "critical" };
const reportBlind = evaluateClinicalSafety(
  criticalCase,
  ["aspirin", "heparin", "morphine", "nitroglycerin"],
  [],
  new Set(),
  [{ checkpointId: "INITIAL" }] // No reassessments recorded
);

check("Blind polypharmacy in critical patient without reassessment identified", reportBlind.sequentialErrors.some(e => e.type === "blind_polypharmacy_no_reassessment"));

console.log("\n==================================================");
console.log(`TOTAL SEQUENTIAL SAFETY CHECKS PASSED: ${passed}`);
console.log(`TOTAL SEQUENTIAL SAFETY CHECKS FAILED: ${failed}`);
console.log("==================================================");

if (failed > 0) process.exit(1);
