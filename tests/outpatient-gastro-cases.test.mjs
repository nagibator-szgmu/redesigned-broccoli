import assert from "node:assert/strict";
import { OUTPATIENT_CASES } from "../src/data/cases/outpatient.js";
import { OUTPATIENT_GASTRO_NEW_CASES } from "../src/data/cases/gastroenterology/outpatientGastroCases.js";
import { computeScore } from "../src/engine/scoring.js";
import { getTopicsForCase } from "../src/data/topics.js";
import reviewRegistry from "../src/data/review-registry.json" with { type: "json" };

console.log("=== RUNNING OUTPATIENT GASTROENTEROLOGY & SCORING TESTS ===");

console.log("\n--- 1. Testing Outpatient Gastro Cases Integrity ---");
assert.equal(OUTPATIENT_GASTRO_NEW_CASES.length, 2, "Must contain exactly 2 new outpatient cases");

const choleCase = OUTPATIENT_GASTRO_NEW_CASES.find(c => c.id === "outp_gastro_cholelithiasis");
assert.ok(choleCase, "outp_gastro_cholelithiasis must exist");
assert.equal(choleCase.department, "outpatient");
assert.equal(choleCase.correctRoute, "refer_specialist");
assert.ok(choleCase.needDiag.includes("usg_abdo"));
assert.ok(choleCase.needTreat.includes("spasmolytics"));
assert.ok(choleCase.wrongTreat.includes("morphine"));
assert.ok(choleCase.diagnosisVariants.length >= 3);

const ibsCase = OUTPATIENT_GASTRO_NEW_CASES.find(c => c.id === "outp_gastro_ibs_diarrhea");
assert.ok(ibsCase, "outp_gastro_ibs_diarrhea must exist");
assert.equal(ibsCase.department, "outpatient");
assert.equal(ibsCase.correctRoute, "treat_outpatient");
assert.ok(ibsCase.needDiag.includes("colonoscopy"));
assert.ok(ibsCase.needDiag.includes("serology_celiac"));
assert.ok(ibsCase.needTreat.includes("spasmolytics"));
assert.ok(ibsCase.wrongTreat.includes("antibiotics_broad"));
assert.ok(ibsCase.diagnosisVariants.length >= 3);
console.log("✓ Case data, department, routing and diagnostics validated");

console.log("\n--- 2. Testing Integration into OUTPATIENT_CASES ---");
const outpIds = OUTPATIENT_CASES.map(c => c.id);
assert.ok(outpIds.includes("outp_gastro_cholelithiasis"), "OUTPATIENT_CASES must include outp_gastro_cholelithiasis");
assert.ok(outpIds.includes("outp_gastro_ibs_diarrhea"), "OUTPATIENT_CASES must include outp_gastro_ibs_diarrhea");
console.log("✓ New cases successfully integrated into OUTPATIENT_CASES");

console.log("\n--- 3. Testing Topics Mapping ---");
const choleTopics = getTopicsForCase("outp_gastro_cholelithiasis");
assert.ok(choleTopics.some(t => t.id === "cholelithiasis"), "outp_gastro_cholelithiasis must map to cholelithiasis topic");

const ibsTopics = getTopicsForCase("outp_gastro_ibs_diarrhea");
assert.ok(ibsTopics.some(t => t.id === "ibs"), "outp_gastro_ibs_diarrhea must map to ibs topic");
console.log("✓ Topics properly registered under gastroenterology");

console.log("\n--- 4. Testing Review Registry ---");
assert.equal(reviewRegistry.cases.outp_gastro_cholelithiasis?.status, "reviewed");
assert.equal(reviewRegistry.cases.outp_gastro_ibs_diarrhea?.status, "reviewed");
console.log("✓ Both cases have reviewed status in review-registry.json");

console.log("\n--- 5. Testing Outpatient Scoring with Route Selection ---");
// Correct route awards 20 points
const scoreCorrectRoute = computeScore(
  choleCase,
  choleCase.needDiag,
  [], // selTreat is empty in outpatient
  "", // no diagnosis to test route differential clearly
  { status: "stable", hr: 76, bp: "125/80", spo2: 99, gcs: 15 },
  900, // 0 time bonus
  new Set(["historyOfIllness", "lifeHistory"]),
  { selectedRoute: "refer_specialist" }
);
assert.equal(scoreCorrectRoute.score, 70, "Score with correct route must be 70");
assert.equal(scoreCorrectRoute.isRouteCorrect, true);

// Wrong route gets 0 for routing
const scoreWrongRoute = computeScore(
  choleCase,
  choleCase.needDiag,
  [],
  "",
  { status: "stable", hr: 76, bp: "125/80", spo2: 99, gcs: 15 },
  900,
  new Set(["historyOfIllness", "lifeHistory"]),
  { selectedRoute: "treat_outpatient" }
);
assert.equal(scoreWrongRoute.score, 50, "Score with wrong route must be 50");
assert.equal(scoreCorrectRoute.score - scoreWrongRoute.score, 20, "Difference between correct and wrong route must be 20 points");
assert.equal(scoreWrongRoute.isRouteCorrect, false);
console.log("✓ Outpatient routing score logic verified (20 points awarded only on match)");

console.log("\n--- 6. Testing diagnosisVariants Matching ---");
// Match by synonym variant "ЖКБ"
const scoreVariantMatch = computeScore(
  choleCase,
  choleCase.needDiag,
  [],
  "ЖКБ",
  { status: "stable", hr: 76, bp: "125/80", spo2: 99, gcs: 15 },
  120,
  new Set(["historyOfIllness", "lifeHistory"]),
  { selectedRoute: "refer_specialist" }
);
assert.equal(scoreVariantMatch.diagCorrect, true, "Should match diagnosis variant 'ЖКБ'");

// Match by synonym variant "СРК-Д"
const scoreIbsVariant = computeScore(
  ibsCase,
  ibsCase.needDiag,
  [],
  "СРК-Д",
  { status: "stable", hr: 74, bp: "120/75", spo2: 99, gcs: 15 },
  120,
  new Set(["historyOfIllness", "lifeHistory"]),
  { selectedRoute: "treat_outpatient" }
);
assert.equal(scoreIbsVariant.diagCorrect, true, "Should match diagnosis variant 'СРК-Д'");
console.log("✓ diagnosisVariants matching verified for both cases");

console.log("\n--- 7. Testing Edge Cases ---");
// Edge Case A: extraResult is undefined/null in outpatient mode (no crash, 0 route score)
const scoreNullExtra = computeScore(
  choleCase,
  choleCase.needDiag,
  [],
  "",
  { status: "stable", hr: 76, bp: "125/80", spo2: 99, gcs: 15 },
  900,
  new Set(["historyOfIllness", "lifeHistory"]),
  null
);
assert.equal(scoreNullExtra.score, 50, "Without route selection score must be 50");
assert.equal(scoreNullExtra.isRouteCorrect, false);

// Edge Case B: Non-outpatient department (ICU/emergency) still awards treatment points normally
const mockIcuCase = {
  ...choleCase,
  department: "icu",
  needTreat: ["spasmolytics"],
};
const scoreIcuTreat = computeScore(
  mockIcuCase,
  mockIcuCase.needDiag,
  ["spasmolytics"],
  "",
  { status: "stable", hr: 76, bp: "125/80", spo2: 99, gcs: 15 },
  900,
  new Set(["historyOfIllness", "lifeHistory"])
);
assert.equal(scoreIcuTreat.score, 60, "ICU case must score 60 (20 diag + 20 treat + 20 stabilized)");
assert.equal(scoreIcuTreat.isRouteCorrect, undefined);

// Edge Case C: Case without diagnosisVariants does not throw and matches cd.diagnosis
const caseWithoutVariants = { id: "test_no_var", diagnosis: "Острый аппендицит", department: "outpatient", correctRoute: "call_ems" };
const scoreNoVariants = computeScore(caseWithoutVariants, [], [], "Острый аппендицит", { status: "stable" }, 900, new Set(), { selectedRoute: "call_ems" });
assert.equal(scoreNoVariants.diagCorrect, true);
assert.equal(scoreNoVariants.isRouteCorrect, true);

// Edge Case D: extraResult as direct string ID
const scoreStringRoute = computeScore(choleCase, [], [], "", { status: "stable" }, 900, new Set(), "refer_specialist");
assert.equal(scoreStringRoute.isRouteCorrect, true);

// Edge Case E: revealedAnamnesis as Array
const scoreArrayAnamnesis = computeScore(choleCase, [], [], "", { status: "stable" }, 900, ["historyOfIllness", "lifeHistory"], "refer_specialist");
assert.equal(scoreArrayAnamnesis.score, 50);

// Edge Case F: JSON formatted diagText matches correctly
const scoreJsonDiag = computeScore(choleCase, choleCase.needDiag, [], JSON.stringify({ main: "ЖКБ", complication: "", comorbidity: "" }), { status: "stable" }, 900, new Set(["historyOfIllness", "lifeHistory"]), "refer_specialist");
assert.equal(scoreJsonDiag.score, 100, "Full outpatient score with JSON diagText must be 100");
console.log("✓ Edge cases (null/string extraResult, array anamnesis, JSON diagText) verified");

console.log("\nALL OUTPATIENT GASTROENTEROLOGY & SCORING TESTS PASSED! 🎯\n");
