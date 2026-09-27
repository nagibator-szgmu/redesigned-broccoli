/**
 * Юнит-тесты валидации и фармакодинамики клинического блока «Гастроэнтерология»
 */
import assert from "node:assert/strict";
import { GASTRO_CASES } from "../src/data/cases/gastroenterology/index.js";
import { DIAGNOSTICS } from "../src/data/diagnostics.js";
import { TREATMENTS, TREAT_FX } from "../src/data/treatments.js";
import { evaluateClinicalSafety } from "../src/engine/safetyEngine.js";

console.log("=== RUNNING GASTROENTEROLOGY CLINICAL TESTS ===");

console.log("\n--- Testing Gastroenterology Cases Presence & Metadata ---");
assert.equal(GASTRO_CASES.length, 7, "Must contain exactly 7 gastroenterology cases");

const caseIds = GASTRO_CASES.map(c => c.id);
assert.ok(caseIds.includes(56), "Must include case 56 (pancreatitis)");
assert.ok(caseIds.includes(57), "Must include case 57 (GI bleed)");
assert.ok(caseIds.includes(58), "Must include case 58 (perforation)");
assert.ok(caseIds.includes(59), "Must include case 59 (cholangitis)");
assert.ok(caseIds.includes("stat_gastro_1"), "Must include stat_gastro_1 (IBD colitis)");
assert.ok(caseIds.includes("stat_gastro_2"), "Must include stat_gastro_2 (cirrhosis)");
assert.ok(caseIds.includes("outp_gastro_1"), "Must include outp_gastro_1 (peptic ulcer)");
console.log("✓ All 7 gastroenterology cases loaded with valid IDs");

console.log("\n--- Testing Diagnostic Registries for Gastroenterology ---");
const diagIds = new Set(DIAGNOSTICS.map(d => d.id));
["egds", "colonoscopy", "ct_abdo", "xray_abdo"].forEach(id => {
  assert.ok(diagIds.has(id), `DIAGNOSTICS must contain ${id}`);
});
console.log("✓ DIAGNOSTICS contains egds, colonoscopy, ct_abdo, xray_abdo");

console.log("\n--- Testing Treatment Registries & Effects for Gastroenterology ---");
const treatIds = new Set(TREATMENTS.map(t => t.id));
["omeprazole_iv", "octreotide", "endoscopic_hemostasis", "lactulose", "mesalazine", "spasmolytics"].forEach(id => {
  assert.ok(treatIds.has(id), `TREATMENTS must contain ${id}`);
  assert.ok(TREAT_FX[id], `TREAT_FX must define effect for ${id}`);
});
console.log("✓ TREATMENTS & TREAT_FX contain all new gastro medications and procedures");

console.log("\n--- Testing Case 58 Perforation Contraindications with SafetyEngine ---");
const perfCase = GASTRO_CASES.find(c => c.id === 58);
assert.ok(perfCase, "Case 58 must exist");
assert.ok(perfCase.wrongTreat.includes("gastric_lavage"), "gastric_lavage must be wrongTreat in perforation");

const safetyResult = evaluateClinicalSafety(
  perfCase,
  ["gastric_lavage"],
  ["xray_abdo", "ct_abdo"],
  new Set(),
  []
);

assert.ok(safetyResult.criticalErrors.length > 0, "Must detect critical error for gastric_lavage");
console.log("✓ SafetyEngine successfully catches contraindication in perforation");

console.log("\n--- Testing Outpatient Case Route Configuration ---");
const outpCase = GASTRO_CASES.find(c => c.id === "outp_gastro_1");
assert.equal(outpCase.correctRoute, "treat_outpatient");
assert.ok(outpCase.routeOptions.length >= 2, "Route options must have multiple choices");
console.log("✓ Outpatient peptic ulcer case has valid routing definition");

console.log("\nALL GASTROENTEROLOGY CLINICAL TESTS PASSED! 🎯\n");
