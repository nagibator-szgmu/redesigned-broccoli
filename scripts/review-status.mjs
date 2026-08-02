import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const registryPath = resolve(__dirname, "../src/data/review-registry.json");

const registry = JSON.parse(readFileSync(registryPath, "utf-8"));
const cases = registry.cases || {};
const ids = Object.keys(cases);

let reviewed = 0;
let pending = 0;

ids.forEach((id) => {
  const entry = cases[id];
  if (entry.status === "reviewed") reviewed++;
  else pending++;
});

console.log("=== Review Registry Status ===");
console.log(`Total: ${ids.length}`);
console.log(`Reviewed: ${reviewed}`);
console.log(`Pending: ${pending}`);
console.log(`Reviewed: ${((reviewed / ids.length) * 100).toFixed(1)}%`);
console.log("");

if (pending > 0) {
  console.log("Pending cases:");
  ids.filter((id) => cases[id].status !== "reviewed").forEach((id) => {
    console.log(`  - ${id}`);
  });
}
