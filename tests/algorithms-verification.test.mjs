import assert from "assert";
import { levenshteinDistance, matchDiagnosisFuzzy, normalizeRussianMedicalText, isWordFuzzyMatch } from "../src/lib/stringMatcher.js";
import { computeEarnedCertificates } from "../src/data/certificates.js";
import { buildClinicalRoadmap } from "../src/engine/clinicalRoadmapEngine.js";
import { CASES } from "../src/data/cases/index.js";

console.log("=== RUNNING UNIT & ALGORITHM VERIFICATION TESTS ===");

// 1. Levenshtein Distance & Typo Tolerance (Task 9)
console.log("\n--- Testing Levenshtein & Typo Tolerance ---");
assert.strictEqual(levenshteinDistance("инфаркт", "инфаркт"), 0);
assert.strictEqual(levenshteinDistance("инфаркт", "инфакт"), 1); // missing 'р'
assert.strictEqual(levenshteinDistance("инфаркт", "инфоркт"), 1); // typo 'о'
assert.strictEqual(levenshteinDistance("аппендицит", "апендицит"), 1); // single 'п'
assert.strictEqual(levenshteinDistance("анафилаксия", "анафилаксия"), 0);

// Word fuzzy matching
assert.strictEqual(isWordFuzzyMatch("инфоркт", "инфаркт"), true);
assert.strictEqual(isWordFuzzyMatch("миакарда", "миокарда"), true);
assert.strictEqual(isWordFuzzyMatch("шок", "ком"), false); // Short word <=3 chars: exact only
assert.strictEqual(isWordFuzzyMatch("астма", "язва"), false); // Different diseases

// matchDiagnosisFuzzy test
const refDiag1 = "Острый коронарный синдром / Острый инфаркт миокарда";
// Exact match
assert(matchDiagnosisFuzzy(refDiag1, "Острый инфаркт миокарда") >= 0.5);
// 1 typo in 'инфоркт'
assert(matchDiagnosisFuzzy(refDiag1, "Острый инфоркт миокарда") >= 0.5);
// 1 typo in 'миакарда'
assert(matchDiagnosisFuzzy(refDiag1, "Острый инфаркт миакарда") >= 0.5);
// Medical abbreviation 'ОИМ'
assert(matchDiagnosisFuzzy(refDiag1, "ОИМ") >= 0.5);
// Completely wrong diagnosis
assert(matchDiagnosisFuzzy(refDiag1, "Острый аппендицит") === 0);
console.log("✓ Task 9 Typo Tolerance passed all assertions");

// 2. Achievements & Empty Profile Safe Parsing (Task 5)
console.log("\n--- Testing Achievements & Empty Profile ---");
assert.strictEqual(computeEarnedCertificates(null).size, 0);
assert.strictEqual(computeEarnedCertificates(undefined).size, 0);
assert.strictEqual(computeEarnedCertificates([]).size, 0);
assert.strictEqual(computeEarnedCertificates([{ score: 100, gradeId: "excellent", category: "cardiac", caseId: "stemi_ant" }]).size > 0, true);
console.log("✓ Task 5 Achievements empty profile safe parsing passed");

// 3. Clinical Guidelines Roadmap Engine (Task 4)
console.log("\n--- Testing Clinical Roadmap Engine ---");
const testCase = CASES[0];
const roadmap = buildClinicalRoadmap({
  cd: testCase,
  selTreat: testCase.needTreat || ["aspirin"],
  selDiag: testCase.needDiag || ["ecg"],
  revealedResults: { ecg: "Тахикардия" },
  revealedAnamnesis: new Set(["shortHistory"]),
  diagText: testCase.diagnosis,
  trajectory: [{ checkpointId: "INITIAL" }],
});

assert.strictEqual(roadmap.length, 6);
assert.strictEqual(roadmap[0].id, "anamnesis");
assert.strictEqual(roadmap[1].id, "exam");
assert.strictEqual(roadmap[2].id, "diagnostics");
assert.strictEqual(roadmap[3].id, "diagnosis");
assert.strictEqual(roadmap[4].id, "treatment");
assert.strictEqual(roadmap[5].id, "routing");
assert.strictEqual(roadmap[3].status, "done"); // Diagnosis matched

const missedRoadmap = buildClinicalRoadmap({
  cd: testCase,
  diagText: "Неправильный диагноз",
});
assert.strictEqual(missedRoadmap[3].status, "missed");
console.log("✓ Task 4 Clinical Roadmap 6-stage breakdown passed");

// 4. Case Investigations Accessibility (Task 6)
console.log("\n--- Testing All 67 Cases Diagnostics Integrity ---");
CASES.forEach((c) => {
  assert(Array.isArray(c.needDiag), `Case ${c.id} missing needDiag`);
  assert(Array.isArray(c.needTreat), `Case ${c.id} missing needTreat`);
});
console.log("✓ Task 6 All 67 cases diagnostics accessibility passed");

console.log("\n========================================================");
console.log("ALL ALGORITHM & DEEP LOGIC VERIFICATION TESTS PASSED!");
console.log("========================================================\n");
