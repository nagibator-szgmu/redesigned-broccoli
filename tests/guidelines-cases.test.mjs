/**
 * Юнит-тесты валидации и фармакодинамики 5 новых ургентных кейсов по КР Минздрава РФ
 */
import assert from "node:assert/strict";
import { CASES } from "../src/data/cases/index.js";
import { TOPICS } from "../src/data/topics.js";
import { TREATMENTS, TREAT_FX, ADVERSE_FX } from "../src/data/treatments.js";
import { ADVERSE_REASONS, TREAT_NOTES } from "../src/data/treatmentsMeta.js";
import { evaluateClinicalSafety } from "../src/engine/safetyEngine.js";

console.log("=== RUNNING GUIDELINES EMERGENCY CASES TESTS ===");

console.log("\n--- Testing Cases Presence & Metadata (60–64) ---");
const targetIds = [60, 61, 62, 63, 64];
const targetCases = targetIds.map(id => {
  const c = CASES.find(item => item.id === id);
  assert.ok(c, `Case ${id} must exist in CASES`);
  return c;
});

targetCases.forEach(c => {
  assert.ok(c.sourceReference?.name, `Case ${c.id} must have sourceReference.name`);
  assert.equal(c.sourceReference.year, 2024, `Case ${c.id} must be dated 2024`);
  assert.ok(Array.isArray(c.checklistItems) && c.checklistItems.length >= 4, `Case ${c.id} checklist >= 4`);
  assert.ok(Array.isArray(c.diagnosisVariants) && c.diagnosisVariants.length >= 2, `Case ${c.id} variants >= 2`);
  assert.ok(c.timeLimit && c.timeLimit <= 7, `Case ${c.id} must have aggressive timeLimit <= 7`);
  assert.ok(c.deathThresholds && Object.keys(c.deathThresholds).length >= 2, `Case ${c.id} deathThresholds`);
  assert.ok(c.deterioration && Object.keys(c.deterioration).length >= 4, `Case ${c.id} deterioration`);
});
console.log("✓ All 5 emergency cases have valid metadata, resuscitation dynamics and death thresholds");

console.log("\n--- Testing salbutamol_inh and urapidil_iv Pharmacology ---");
["salbutamol_inh", "urapidil_iv"].forEach(id => {
  const treat = TREATMENTS.find(t => t.id === id);
  assert.ok(treat, `TREATMENTS must contain ${id}`);
  assert.ok(TREAT_FX[id], `TREAT_FX must define effect for ${id}`);
  assert.ok(ADVERSE_FX[id], `ADVERSE_FX must define adverse effect for ${id}`);
  assert.ok(ADVERSE_REASONS[id], `ADVERSE_REASONS must explain ${id}`);
  assert.ok(TREAT_NOTES[id], `TREAT_NOTES must describe ${id}`);
});
console.log("✓ salbutamol_inh and urapidil_iv are fully registered with effects, notes and adverse reasons");

console.log("\n--- Testing Clinical Safety Engine with Contraindications ---");
// Case 60 (Asthma): metoprolol contraindication
const asthmaCase = targetCases.find(c => c.id === 60);
const asthmaSafety = evaluateClinicalSafety(asthmaCase, ["metoprolol"], ["abg", "spo2"], new Set(), []);
assert.ok(asthmaSafety.criticalErrors.length > 0, "SafetyEngine must catch metoprolol in severe asthma");

// Case 62 (Pulmonary Edema): iv_fluids contraindication
const hfCase = targetCases.find(c => c.id === 62);
const hfSafety = evaluateClinicalSafety(hfCase, ["iv_fluids"], ["bnp", "echo"], new Set(), []);
assert.ok(hfSafety.criticalErrors.length > 0, "SafetyEngine must catch iv_fluids in pulmonary edema");

// Case 63 (Urosepsis): furosemide contraindication
const sepsisCase = targetCases.find(c => c.id === 63);
const sepsisSafety = evaluateClinicalSafety(sepsisCase, ["furosemide"], ["usg_abdo"], new Set(), []);
assert.ok(sepsisSafety.criticalErrors.length > 0, "SafetyEngine must catch furosemide in septic shock");
console.log("✓ SafetyEngine successfully catches contraindications across guidelines cases");

console.log("\n--- Testing Topics Mapping for Cases 60–64 ---");
const topicMappings = [
  { topicId: "asthma_exac", expectedCase: 60 },
  { topicId: "hypertension_crisis", expectedCase: 61 },
  { topicId: "hf_chronic", expectedCase: 62 },
  { topicId: "pyelonephritis", expectedCase: 63 },
  { topicId: "hypothyroidism", expectedCase: 64 },
];

topicMappings.forEach(({ topicId, expectedCase }) => {
  let found = false;
  for (const cat of TOPICS) {
    const child = cat.children.find(ch => ch.id === topicId);
    if (child) {
      assert.ok(child.cases.includes(expectedCase), `Topic ${topicId} must contain case ${expectedCase}`);
      found = true;
      break;
    }
  }
  assert.ok(found, `Topic ${topicId} must exist in TOPICS`);
});
console.log("✓ All 5 topics correctly link to their respective emergency cases");
console.log("\n=== ALL GUIDELINES EMERGENCY CASES TESTS PASSED ===");
