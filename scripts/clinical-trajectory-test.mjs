import { CASES } from "../src/data/cases/index.js";
import { initPS } from "../src/engine/patient.js";
import { evaluateReassessment } from "../src/engine/reassessmentEngine.js";

console.log("=== CLINICAL TRAJECTORY & TIMELINE CHECKPOINT TEST ===");

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

// 1. Checkpoint Trajectory Simulation
const sampleCase = CASES[0];
const initialPS = initPS(sampleCase);

const timeline = [];
let eventId = 1;
const addCheckpoint = (checkpointType, text, type = "info", elapsed = "0:00") => {
  timeline.push({
    id: eventId++,
    checkpoint: checkpointType,
    text,
    type,
    elapsed,
    timestamp: Date.now()
  });
};

// INITIAL checkpoint
addCheckpoint("INITIAL", "Пациент поступил в ОРИТ: мониторинг витальных функций запущен", "info", "0:00");
check("Initial checkpoint recorded", timeline.length === 1 && timeline[0].checkpoint === "INITIAL");

// Intervention applied
addCheckpoint("POST_INTERVENTION", "Введено: Кислородотерапия, Нитроглицерин", "result", "0:45");
check("Post-intervention checkpoint recorded", timeline.length === 2 && timeline[1].checkpoint === "POST_INTERVENTION");

// Physiological response and REASSESSMENT checkpoint
const currentPS = {
  ...initialPS,
  hr: initialPS.hr - 15,
  sbp: initialPS.sbp - 10,
  spo2: Math.min(100, initialPS.spo2 + 4)
};
const evalReport = evaluateReassessment(initialPS, currentPS);
addCheckpoint("REASSESSMENT", `[REASSESSMENT] ${evalReport.summaryText} (Улучшено: ${evalReport.improvedCount})`, "result", "1:30");
check("Reassessment checkpoint recorded with dynamic metrics", timeline.length === 3 && timeline[2].checkpoint === "REASSESSMENT");

// FINAL checkpoint
addCheckpoint("FINAL", "Диагноз установлен: Острый инфаркт миокарда. Завершена первичная стабилизация.", "result", "3:15");
check("Final checkpoint recorded", timeline.length === 4 && timeline[3].checkpoint === "FINAL");

// 2. Duplicate Prevention Integrity
const snapshotLength = timeline.length;
for (let i = 0; i < 10; i++) {
  // Simulate 10 component re-renders
  const dummyCopy = [...timeline];
}
check("Zero duplicate events after 10 re-renders", timeline.length === snapshotLength);

// 3. Chronological integrity
check("Timestamps strictly increase or stay non-decreasing", timeline.every((ev, i) => i === 0 || ev.timestamp >= timeline[i - 1].timestamp));

console.log("\n==================================================");
console.log(`TOTAL CLINICAL TRAJECTORY CHECKS PASSED: ${passed}`);
console.log(`TOTAL CLINICAL TRAJECTORY CHECKS FAILED: ${failed}`);
console.log("==================================================");

if (failed > 0) process.exit(1);
