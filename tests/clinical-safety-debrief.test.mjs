import assert from "assert";
import { evaluateClinicalSafety } from "../src/engine/safetyEngine.js";
import { mapSafetyToMistakes } from "../src/engine/debrief/safetyMistakesMapper.js";
import { generateLocalClinicalFeedback } from "../src/engine/debrief/localClinicalFeedback.js";
import { evaluateDiagnosisWithAI } from "../src/engine/aiEvaluator.js";

console.log("=== RUNNING CLINICAL SAFETY & DEBRIEFING TESTS ===");

const testCase = {
  id: 1,
  name: "Мельников Сергей Павлович",
  diagnosis: "Острый инфаркт миокарда с подъёмом ST. Кардиогенный шок.",
  needDiag: ["ecg", "troponin", "echo"],
  needTreat: ["aspirin", "heparin", "norepinephrine"],
  wrongTreat: ["nitroglycerin", "metoprolol"],
  lifeHistoryContraindications: ["morphine"],
  sourceReference: {
    name: "Клинические рекомендации: Острый инфаркт миокарда с подъемом сегмента ST электрокардиограммы",
    year: 2024,
  },
};

// 1. Тестирование выявления критических ошибок и противопоказаний
console.log("\n--- Testing Safety Engine Contraindication Detection ---");
const safety1 = evaluateClinicalSafety(
  testCase,
  ["nitroglycerin", "aspirin"], // Назначен противопоказанный нитроглицерин при кардиогенном шоке
  ["ecg"],
  new Set(["lifeHistory"]),
  []
);

assert.strictEqual(safety1.criticalErrors.length, 1);
assert.strictEqual(safety1.safetyRating, "critical_breach");
console.log("✓ Contraindication detection verified");

// 2. Тестирование скрытых противопоказаний из анамнеза жизни
console.log("\n--- Testing Missed Life History Contraindication ---");
const safety2 = evaluateClinicalSafety(
  testCase,
  ["morphine"], // Назначен морфин при несобранном анамнезе жизни
  ["ecg", "troponin"],
  new Set(), // lifeHistory не раскрыт
  []
);

assert.strictEqual(safety2.majorErrors.length, 1);
assert.ok(safety2.majorErrors[0].explanation.includes("анамнеза жизни"));
console.log("✓ Missed life history contraindication verified");

// 3. Тестирование маппера ошибок в формат result.mistakes[]
console.log("\n--- Testing Safety Mistakes Mapper ---");
const mistakes = mapSafetyToMistakes(safety1, testCase);
assert.strictEqual(mistakes.length, 1);
assert.strictEqual(mistakes[0].severity, "critical");
assert.strictEqual(mistakes[0].penalty, 15);
assert.ok(mistakes[0].guidelineRef.includes("2024"));
console.log("✓ Safety mistakes mapper structure verified");

// 4. Тестирование локального клинического эксперта
console.log("\n--- Testing Local Clinical Feedback Generator ---");
const fbAccurate = generateLocalClinicalFeedback(
  testCase,
  "Острый инфаркт миокарда кардиогенный шок",
  ["ecg", "troponin", "echo"],
  ["aspirin", "heparin", "norepinephrine"],
  safety1
);
assert.strictEqual(fbAccurate.diagScore, 35);
assert.ok(fbAccurate.feedback.includes("сформулирован точно"));
assert.ok(fbAccurate.errors.length > 0); // Содержит замечание о нитроглицерине

const fbEmpty = generateLocalClinicalFeedback(testCase, "", [], [], {});
assert.strictEqual(fbEmpty.diagScore, 0);
assert.ok(fbEmpty.feedback.includes("не был сформулирован"));
console.log("✓ Local clinical feedback generator verified");

// 5. Тестирование гибридного aiEvaluator в оффлайн-режиме
console.log("\n--- Testing Hybrid AI Evaluator Offline Fallback ---");
const aiRes = await evaluateDiagnosisWithAI(
  testCase,
  "Инфаркт миокарда",
  ["ecg"],
  ["aspirin"],
  safety1
);
assert.strictEqual(aiRes.success, true);
assert.strictEqual(aiRes.source, "local");
assert.ok(typeof aiRes.diagScore === "number");
assert.ok(typeof aiRes.feedback === "string" && aiRes.feedback.length > 10);
assert.ok(Array.isArray(aiRes.errors));
console.log("✓ Hybrid AI Evaluator offline fallback verified");

console.log("\nALL CLINICAL SAFETY & DEBRIEFING TESTS PASSED! 🎯");
