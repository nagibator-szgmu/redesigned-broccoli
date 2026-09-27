/**
 * Экспорт всех данных симулятора MedSim в JSON для генератора документа Word.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CASES } from "../src/data/cases/index.js";
import { DIAGNOSTICS, DIAGNOSTIC_REFS } from "../src/data/diagnostics.js";
import { TREATMENTS, TREAT_FX, ADVERSE_FX } from "../src/data/treatments.js";
import { ADVERSE_REASONS, TREAT_NOTES } from "../src/data/treatmentsMeta.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, "cases_bundle.json");

const payload = {
  cases: CASES,
  diagnostics: DIAGNOSTICS,
  diagnosticRefs: DIAGNOSTIC_REFS,
  treatments: TREATMENTS,
  treatFx: TREAT_FX,
  adverseFx: ADVERSE_FX,
  adverseReasons: ADVERSE_REASONS,
  treatNotes: TREAT_NOTES,
};

fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), "utf-8");
console.log(`✓ Экспортировано ${CASES.length} кейсов в ${outputPath}`);
