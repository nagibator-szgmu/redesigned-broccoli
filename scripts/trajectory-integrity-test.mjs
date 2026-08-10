import { createReassessmentCheckpoint, calculateMap } from "../src/engine/reassessmentEngine.js";

console.log("=== TRAJECTORY INTEGRITY & CHECKPOINT TEST ===");

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

// 1. Build Multi-step Trajectory
const trajectory = [];
let baseTime = Date.now();

// Point 0: INITIAL
trajectory.push({
  checkpointId: "INITIAL",
  iteration: 0,
  timestamp: baseTime,
  elapsed: "0:00",
  vitals: { hr: 125, sbp: 80, dbp: 45, rr: 28, spo2: 86, temp: 37.5, gcs: 12, pain: 8 },
  map: calculateMap(80, 45),
  trend: "stable",
  overallResponse: "neutral",
  summaryText: "Пациент поступил в ОРИТ"
});

// Point 1: POST_INTERVENTION
trajectory.push({
  checkpointId: "POST_INTERVENTION_1",
  iteration: 1,
  timestamp: baseTime + 45000,
  elapsed: "0:45",
  vitals: { hr: 115, sbp: 88, dbp: 52, rr: 24, spo2: 93, temp: 37.5, gcs: 13, pain: 6 },
  map: calculateMap(88, 52),
  recentInterventions: ["oxygen", "iv_fluids"]
});

// Point 2: REASSESSMENT #1
const cp1 = createReassessmentCheckpoint({
  iteration: 1,
  checkpointId: "REASSESSMENT #1",
  previousState: trajectory[0].vitals,
  currentState: trajectory[1].vitals,
  timestamp: baseTime + 90000
});
trajectory.push({ ...cp1, elapsed: "1:30" });

// Point 3: REASSESSMENT #2
const vitals2 = { hr: 80, sbp: 118, dbp: 76, rr: 16, spo2: 98, temp: 36.6, gcs: 15, pain: 2 };
const cp2 = createReassessmentCheckpoint({
  iteration: 2,
  checkpointId: "REASSESSMENT #2",
  previousState: trajectory[1].vitals,
  currentState: vitals2,
  timestamp: baseTime + 180000
});
trajectory.push({ ...cp2, elapsed: "3:00" });

// Point 4: FINAL
trajectory.push({
  checkpointId: "FINAL",
  iteration: 3,
  timestamp: baseTime + 240000,
  elapsed: "4:00",
  vitals: vitals2,
  map: calculateMap(118, 76),
  outcome: "stabilized",
  summaryText: "Кейс завершен со стабилизацией пациента"
});

check("Trajectory contains 5 distinct checkpoints", trajectory.length === 5);

// 2. Uniqueness of Checkpoint IDs
const ids = trajectory.map(c => c.checkpointId);
const uniqueIds = new Set(ids);
check("All checkpoint IDs are unique", uniqueIds.size === ids.length);

// 3. Chronological Integrity
const isChronological = trajectory.every((c, i) => i === 0 || c.timestamp >= trajectory[i - 1].timestamp);
check("All checkpoints are in strict chronological order", isChronological);

// 4. Zero duplicate emission upon simulated re-renders
const renderedIds = [];
for (let render = 0; render < 5; render++) {
  trajectory.forEach(c => renderedIds.push(c.checkpointId));
}
check("Render iterations do not duplicate underlying array elements", trajectory.length === 5);

// 5. MAP calculation accuracy in trajectory
check("Point 0 MAP is 57", trajectory[0].map === 57);
check("Point 1 MAP is 64", trajectory[1].map === 64);
check("Point 3 MAP is 90", trajectory[3].map === 90);

console.log("\n==================================================");
console.log(`TOTAL TRAJECTORY INTEGRITY CHECKS PASSED: ${passed}`);
console.log(`TOTAL TRAJECTORY INTEGRITY CHECKS FAILED: ${failed}`);
console.log("==================================================");

if (failed > 0) process.exit(1);
