import { CASES } from "../src/data/cases/index.js";
import { TREATMENTS, ADVERSE_FX } from "../src/data/treatments.js";

console.log("=== WRONG TREAT USAGE AUDIT ===");
const allWrongTreats = new Set();
for (const c of CASES) {
  if (Array.isArray(c.wrongTreat)) {
    c.wrongTreat.forEach(id => allWrongTreats.add(id));
  }
}

console.log("All unique treatments in wrongTreat across 67 cases:");
console.log(Array.from(allWrongTreats).sort());

console.log("\nTreatments without explicit ADVERSE_FX entry:");
for (const t of TREATMENTS) {
  if (ADVERSE_FX[t.id] === undefined) {
    const isUsedInWrong = allWrongTreats.has(t.id);
    console.log(`- ${t.id} (${t.name}): used in wrongTreat? ${isUsedInWrong ? "YES" : "NO"}`);
  }
}
