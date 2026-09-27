import assert from "assert";
import {
  matchQuestionToCaseFact,
  getCategorizedChips,
} from "../src/engine/dialogue/dialogueTreeEngine.js";
import {
  applyVitalsSpeechFilter,
  isPatientUnconscious,
} from "../src/engine/dialogue/patientPersonalityEngine.js";
import { askPatientQuestion } from "../src/engine/dialogue/llmDialogueClient.js";

console.log("=== RUNNING AI PATIENT DIALOGUE ENGINE TESTS ===");

const sampleCase = {
  id: 1,
  name: "Мельников Сергей Павлович",
  complaint: "Давящая боль за грудиной 2 часа, одышка, холодный пот.",
  anamnesis: "Боль в покое 2 часа, иррадиация в левое плечо. ИБС 5 лет.",
  lifeHistory: "Аллергии на лекарства нет. Курит 30 лет. Гипертония 2 ст.",
  exam: "Кожа бледная, влажная. АД 80/55, ЧСС 115.",
};

// 1. Тестирование распознавания интентов вопросов
console.log("\n--- Testing Dialogue Tree Intent Recognition ---");

// Жалобы
const res1 = matchQuestionToCaseFact("Где именно у вас болит?", sampleCase);
assert.strictEqual(res1.revealedKey, "complaint");
assert.ok(res1.text.includes("Давящая боль"));

// Анамнез заболевания
const res2 = matchQuestionToCaseFact("Когда начался приступ и сколько часов болит?", sampleCase);
assert.strictEqual(res2.revealedKey, "historyOfIllness");
assert.ok(res2.text.includes("Боль в покое"));

// Аллергии и анамнез жизни
const res3 = matchQuestionToCaseFact("Есть ли у вас аллергия на антибиотики или новокаин?", sampleCase);
assert.strictEqual(res3.revealedKey, "lifeHistory");
assert.ok(res3.text.includes("Аллергии на лекарства"));

// Постоянные препараты
const res4 = matchQuestionToCaseFact("Какие таблетки вы принимаете регулярно?", sampleCase);
assert.strictEqual(res4.revealedKey, "lifeHistory");

// Объективный статус / дыхание
const res5 = matchQuestionToCaseFact("Как сейчас с дыханием, есть одышка?", sampleCase);
assert.strictEqual(res5.revealedKey, "exam");

console.log("✓ Dialogue Tree Intent Recognition tests passed");

// 2. Тестирование категоризированных чипсов
console.log("\n--- Testing Categorized Chips Structure ---");
const chips = getCategorizedChips(sampleCase);
assert.strictEqual(chips.length, 4);
assert.strictEqual(chips[0].id, "complaints");
assert.strictEqual(chips[1].id, "history");
assert.strictEqual(chips[2].id, "allergies");
assert.strictEqual(chips[3].id, "meds");
assert.ok(chips[0].questions.length >= 2);
console.log("✓ Categorized chips structure verified");

// 3. Тестирование уровня сознания и витальных фильтров
console.log("\n--- Testing Vitals Speech Filter & Unconsciousness ---");
assert.strictEqual(isPatientUnconscious({ gcs: 15 }), false);
assert.strictEqual(isPatientUnconscious({ gcs: 8 }), true);
assert.strictEqual(isPatientUnconscious({ gcs: 3 }), true);

// Кома (ШКГ 6)
const comaSpeech = applyVitalsSpeechFilter("Болит сердце", { gcs: 6, pain: 10 });
assert.ok(comaSpeech.includes("без сознания"));

// Сильная боль (pain 9)
const painSpeech = applyVitalsSpeechFilter("Болит в груди", { gcs: 15, pain: 9 });
assert.ok(painSpeech.includes("Ох-х-х") || painSpeech.includes("болит"));

// Дыхательная недостаточность (SpO2 85%)
const hypoxiaSpeech = applyVitalsSpeechFilter("Началось два часа назад на работе", { gcs: 15, pain: 4, spo2: 85, rr: 30 });
assert.ok(hypoxiaSpeech.includes("воздуха не хватает") || hypoxiaSpeech.includes("трудно... дышать"));

// Облегчение боли
const reliefSpeech = applyVitalsSpeechFilter("Спасибо", { gcs: 15, pain: 1, spo2: 98 });
assert.ok(reliefSpeech.includes("отпустила"));

console.log("✓ Vitals speech filter & unconsciousness tests passed");

// 4. Тестирование клиента LLM (локальный фоллбэк без ключа)
console.log("\n--- Testing LLM Client Local Fallback ---");
const localRes = await askPatientQuestion({
  question: "Была ли аллергия на аспирин?",
  caseData: sampleCase,
  patientState: { gcs: 15, pain: 4, spo2: 97, rr: 16 },
  apiKey: "",
});
assert.strictEqual(localRes.source, "local");
assert.strictEqual(localRes.revealedKey, "lifeHistory");
assert.ok(localRes.text.includes("Аллергии на лекарства"));

// Проверка вызова в коме
const comaRes = await askPatientQuestion({
  question: "Вы меня слышите?",
  caseData: sampleCase,
  patientState: { gcs: 6 },
  apiKey: "some-key",
});
assert.strictEqual(comaRes.source, "unconscious");
assert.strictEqual(comaRes.revealedKey, null);
assert.ok(comaRes.text.includes("без сознания"));

console.log("✓ LLM Client Local Fallback tests passed");
console.log("\nALL AI PATIENT DIALOGUE TESTS PASSED SUCCESSFULLY! 🎯");
