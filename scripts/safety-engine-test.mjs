import { evaluateClinicalSafety } from "../src/engine/safetyEngine.js";
import { CASES } from "../src/data/cases/index.js";

console.log("=== SAFETY ENGINE VERIFICATION TEST ===");

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

// 1. Safe Scenario: all needed actions performed, 0 wrong treatments
const sampleCase = CASES[0];
const safeReport = evaluateClinicalSafety(
  sampleCase,
  sampleCase.needTreat,
  sampleCase.needDiag,
  new Set(["lifeHistory", "shortHistory"])
);

check("Safe execution produces safetyRating 'safe'", safeReport.safetyRating === "safe");
check("Zero critical errors in safe execution", safeReport.criticalErrors.length === 0);
check("Appropriate actions recorded for needTreat and needDiag", safeReport.appropriateActions.length === (sampleCase.needTreat.length + sampleCase.needDiag.length));

// 2. Critical Error Scenario: dangerous wrongTreat administered
const wrongTreats = sampleCase.wrongTreat || ["metoprolol"];
const criticalReport = evaluateClinicalSafety(
  sampleCase,
  [wrongTreats[0]],
  [],
  new Set()
);

check("Critical breach detected on wrongTreat", criticalReport.safetyRating === "critical_breach");
check("Critical error list contains the dangerous treatment", criticalReport.criticalErrors.some(e => e.id === wrongTreats[0]));

// 3. Major Error Scenario: contraindicated via life history without collecting it
const caseWithContra = {
  id: "test_contra",
  diagnosis: "Бронхиальная астма",
  needTreat: ["oxygen"],
  wrongTreat: [],
  lifeHistoryContraindications: ["aspirin"],
};

const missedHistoryReport = evaluateClinicalSafety(
  caseWithContra,
  ["aspirin", "oxygen"],
  [],
  new Set() // No lifeHistory gathered
);

check("Major error detected for missed life history contraindication", missedHistoryReport.majorErrors.some(e => e.id === "aspirin"));

// Gathered lifeHistory -> no major error
const withHistoryReport = evaluateClinicalSafety(
  caseWithContra,
  ["oxygen"],
  [],
  new Set(["lifeHistory"])
);
check("When lifeHistory is known, 0 major errors", withHistoryReport.majorErrors.length === 0);

console.log("\n==================================================");
console.log(`TOTAL SAFETY ENGINE CHECKS PASSED: ${passed}`);
console.log(`TOTAL SAFETY ENGINE CHECKS FAILED: ${failed}`);
console.log("==================================================");

if (failed > 0) process.exit(1);
