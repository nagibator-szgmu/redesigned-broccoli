import { CASES } from "../src/data/cases/index.js";
import { DIAGNOSTICS, MISSED_TEST_REASONS } from "../src/data/diagnostics.js";
import { TREATMENTS, TREAT_FX, ADVERSE_FX, ADVERSE_REASONS } from "../src/data/treatments.js";

/**
 * Enhanced case validator per medsim-tz-gaps.md Block В (FR-В.1–В.6).
 *
 * Checks:
 * - Mandatory fields on every case: department, sourceReference (object w/ name+year),
 *   checklistItems (non-empty array), diagnosisVariants
 * - Department-specific fields: outpatient (correctRoute, routeOptions),
 *   stationary (dayByDayPlan, dischargeCriteria, maxDays)
 * - Cross-references against DIAGNOSTICS / TREATMENTS / effects tables
 * - Duplicate case IDs
 * - Vitals and death-threshold range sanity
 *
 * Usage:
 *   node scripts/validate-cases.mjs            # strict: exit 1 on any error
 *   node scripts/validate-cases.mjs --fix      # dry-run: show what --fix would change
 */

const diagIds = new Set(DIAGNOSTICS.map(d => d.id));
const treatIds = new Set(TREATMENTS.map(t => t.id));
const VALID_CAT = new Set(["cardiac", "neuro", "respiratory", "infectious", "endocrine", "toxicology", "abdominal"]);
const VALID_SEV = new Set(["critical", "moderate", "mild"]);
const VALID_DEPT = new Set(["emergency", "outpatient", "stationary", "icu", "admission"]);
const VALID_DT = new Set(["sbp", "spo2", "gcs", "hr", "rr", "dbp", "temp", "pain"]);
const VALID_VITALS = new Set(["sbp", "dbp", "hr", "rr", "spo2", "temp", "pain", "gcs"]);

const issues = [];
const fixes = [];
const fixMode = process.argv.includes("--fix");

/**
 * Format a validation error with case id, name and the specific field.
 * @param {object} c - case object
 * @param {string} field - missing/invalid field name
 * @param {string} detail - additional explanation
 */
function err(c, field, detail) {
  const id = c.id ?? "(no id)";
  const name = c.name ?? "(no name)";
  issues.push(`case ${id} "${name}": ${field} — ${detail}`);
}

/**
 * Format a dry-run fix description.
 * @param {object} c - case object
 * @param {string} field - field to fix
 * @param {string} desc - human-readable description of what would be done
 */
function noteFix(c, field, desc) {
  const id = c.id ?? "(no id)";
  fixes.push(`case ${id}: ${field} — ${desc}`);
}

// ── Per-case checks ──────────────────────────────────────────────────────────
for (const c of CASES) {
  const id = c.id ?? "(no id)";

  // ── Basic presence checks ────────────────────────────────────────────────
  if (!c.id) err(c, "id", "missing");
  if (!c.name) err(c, "name", "missing");
  if (!c.diagnosis) err(c, "diagnosis", "missing");

  // ── FR-В.1: department — mandatory, one of allowed values ────────────────
  if (!c.department) {
    err(c, "department", "missing (FR-В.1)");
  } else if (!VALID_DEPT.has(c.department)) {
    err(c, "department", `invalid value "${c.department}", expected emergency|outpatient|stationary|icu|admission`);
  }

  // ── FR-В.1: sourceReference — mandatory object with name + year ──────────
  if (!c.sourceReference) {
    err(c, "sourceReference", "missing (FR-В.1)");
  } else {
    if (!c.sourceReference.name) err(c, "sourceReference.name", "missing");
    if (!c.sourceReference.year) err(c, "sourceReference.year", "missing");
    if (c.sourceReference.url !== undefined && typeof c.sourceReference.url !== "string") {
      err(c, "sourceReference.url", "must be a string if present");
    }
  }

  // ── FR-В.1: checklistItems — mandatory non-empty array ───────────────────
  if (!Array.isArray(c.checklistItems)) {
    err(c, "checklistItems", "missing or not an array (FR-В.1)");
  } else if (c.checklistItems.length === 0) {
    err(c, "checklistItems", "empty array — at least 1 item required (FR-В.1)");
  }

  // ── FR-В.2: diagnosisVariants — mandatory on all departments ─────────────
  if (!Array.isArray(c.diagnosisVariants) || c.diagnosisVariants.length === 0) {
    err(c, "diagnosisVariants", "missing or empty array (FR-В.2)");
  }

  // ── Severity / category ──────────────────────────────────────────────────
  if (!VALID_SEV.has(c.severity)) err(c, "severity", `invalid "${c.severity}"`);
  if (!VALID_CAT.has(c.category)) err(c, "category", `invalid "${c.category}"`);

  // ── Vitals format ────────────────────────────────────────────────────────
  if (!c.vitals?.bp?.includes("/")) err(c, "vitals.bp", `invalid format "${c.vitals?.bp}"`);
  if (c.vitals?.bp && c.vitals.bp !== "---/---") {
    const [sys, dia] = c.vitals.bp.split("/").map(Number);
    if (isNaN(sys) || sys < 40 || sys > 300) err(c, "vitals.bp", `systolic ${sys} out of 40–300`);
    if (isNaN(dia) || dia < 15 || dia > 200) err(c, "vitals.bp", `diastolic ${dia} out of 15–200`);
  }
  if (c.vitals?.hr !== undefined && c.vitals.hr !== 0 && (c.vitals.hr < 20 || c.vitals.hr > 250))
    err(c, "vitals.hr", `${c.vitals.hr} out of 20–250`);
  if (c.vitals?.spo2 !== undefined && c.vitals.spo2 !== 0 && (c.vitals.spo2 < 50 || c.vitals.spo2 > 100))
    err(c, "vitals.spo2", `${c.vitals.spo2} out of 50–100`);
  if (c.vitals?.rr !== undefined && c.vitals.rr !== 0 && (c.vitals.rr < 2 || c.vitals.rr > 60))
    err(c, "vitals.rr", `${c.vitals.rr} out of 2–60`);
  if (c.vitals?.temp !== undefined && (c.vitals.temp < 26 || c.vitals.temp > 44))
    err(c, "vitals.temp", `${c.vitals.temp} out of 26–44`);

  // ── Arrays: needDiag / needTreat / wrongTreat ────────────────────────────
  if (!Array.isArray(c.needDiag)) err(c, "needDiag", "not an array");
  if (!Array.isArray(c.needTreat)) err(c, "needTreat", "not an array");
  if (!Array.isArray(c.wrongTreat)) err(c, "wrongTreat", "not an array");

  // ── Time limit ───────────────────────────────────────────────────────────
  if (c.timeLimit !== undefined && c.timeLimit <= 0) err(c, "timeLimit", `must be > 0, got ${c.timeLimit}`);

  // ── testResults ──────────────────────────────────────────────────────────
  if (!c.testResults || Object.keys(c.testResults).length === 0)
    err(c, "testResults", "empty or missing");

  // ── FR-В.2: department-specific mandatory fields ──────────────────────────
  if (c.department === "outpatient") {
    if (!c.correctRoute) err(c, "correctRoute", "missing on outpatient case (FR-В.2)");
    if (!Array.isArray(c.routeOptions) || c.routeOptions.length === 0)
      err(c, "routeOptions", "missing or empty on outpatient case (FR-В.2)");
  }

  if (c.department === "stationary") {
    if (!Array.isArray(c.dayByDayPlan) || c.dayByDayPlan.length === 0)
      err(c, "dayByDayPlan", "missing or empty on stationary case (FR-В.2)");
    if (!Array.isArray(c.dischargeCriteria) || c.dischargeCriteria.length === 0)
      err(c, "dischargeCriteria", "missing or empty on stationary case (FR-В.2)");
    if (c.maxDays === undefined || typeof c.maxDays !== "number" || c.maxDays <= 0)
      err(c, "maxDays", "missing or invalid on stationary case (FR-В.2)");
    if (!c.historyOfIllness) err(c, "historyOfIllness", "missing on stationary case (FR-Р.4)");
    if (!c.lifeHistory) err(c, "lifeHistory", "missing on stationary case (FR-Р.4)");
  }

  if (c.department === "outpatient") {
    if (!c.historyOfIllness) err(c, "historyOfIllness", "missing on outpatient case (FR-Р.4)");
    if (!c.lifeHistory) err(c, "lifeHistory", "missing on outpatient case (FR-Р.4)");
  }

  if (c.department === "admission") {
    if (!c.shortHistory) err(c, "shortHistory", "missing on admission case (FR-Р.4)");
  }

  // ── Cross-reference: needDiag vs DIAGNOSTICS + testResults ────────────────
  for (const id of c.needDiag || []) {
    if (!diagIds.has(id)) err(c, `needDiag[${id}]`, "not in DIAGNOSTICS");
    if (!(id in (c.testResults || {}))) err(c, `needDiag[${id}]`, "has no testResults entry");
  }

  // ── Cross-reference: needTreat vs TREATMENTS + TREAT_FX ───────────────────
  for (const id of c.needTreat || []) {
    if (!treatIds.has(id)) err(c, `needTreat[${id}]`, "not in TREATMENTS");
    if (!TREAT_FX[id]) err(c, `needTreat[${id}]`, "no TREAT_FX entry");
  }

  // ── Cross-reference: wrongTreat vs TREATMENTS + ADVERSE_FX ────────────────
  for (const id of c.wrongTreat || []) {
    if (!treatIds.has(id)) err(c, `wrongTreat[${id}]`, "not in TREATMENTS");
    if (!ADVERSE_FX[id]) err(c, `wrongTreat[${id}]`, "no ADVERSE_FX entry");
  }

  // ── lifeHistoryContraindications vs TREATMENTS ───────────────────────────
  if (c.lifeHistoryContraindications && !Array.isArray(c.lifeHistoryContraindications)) {
    err(c, "lifeHistoryContraindications", "not an array");
  }
  for (const id of c.lifeHistoryContraindications || []) {
    if (!treatIds.has(id)) err(c, `lifeHistoryContraindications[${id}]`, "not in TREATMENTS");
  }

  // ── testResults keys vs DIAGNOSTICS ──────────────────────────────────────
  for (const key of Object.keys(c.testResults || {})) {
    if (!diagIds.has(key)) err(c, `testResults[${key}]`, "not in DIAGNOSTICS");
  }

  // ── deathThresholds keys ─────────────────────────────────────────────────
  for (const k of Object.keys(c.deathThresholds || {})) {
    if (!VALID_DT.has(k)) err(c, `deathThresholds[${k}]`, "unknown key");
  }
  const dt = c.deathThresholds || {};
  if (dt.rr !== undefined && dt.rr > 20)
    err(c, "deathThresholds.rr", `rr uses '<=' so value ${dt.rr} kills immediately`);

  // ── deterioration keys ───────────────────────────────────────────────────
  for (const k of Object.keys(c.deterioration || {})) {
    if (!VALID_VITALS.has(k)) err(c, `deterioration[${k}]`, "unknown key");
  }
}

// ── Orphan checks (MISSED_TEST_REASONS / ADVERSE_REASONS) ────────────────────
for (const id of Object.keys(MISSED_TEST_REASONS)) {
  if (!diagIds.has(id)) issues.push(`MISSED_TEST_REASONS has orphan key "${id}" not in DIAGNOSTICS`);
}
for (const id of Object.keys(ADVERSE_REASONS)) {
  if (!treatIds.has(id)) issues.push(`ADVERSE_REASONS has orphan key "${id}" not in TREATMENTS`);
}

// ── Duplicate case IDs ──────────────────────────────────────────────────────
const caseIds = CASES.map(c => c.id);
const dupes = caseIds.filter((id, i) => caseIds.indexOf(id) !== i);
if (dupes.length > 0) issues.push(`duplicate case IDs: ${dupes.join(", ")}`);

// ── Output ──────────────────────────────────────────────────────────────────
console.log(`\nCases: ${CASES.length}`);
const deptCounts = {};
for (const c of CASES) { deptCounts[c.department] = (deptCounts[c.department] || 0) + 1; }
for (const [d, n] of Object.entries(deptCounts)) console.log(`  ${d}: ${n}`);
console.log(`Diagnostics: ${DIAGNOSTICS.length}`);
console.log(`Treatments: ${TREATMENTS.length}`);

if (issues.length === 0) {
  console.log("\n✓ No issues found");
  process.exit(0);
}

console.log(`\n✗ ${issues.length} issue(s):\n`);
for (const issue of issues) {
  console.log(`  - ${issue}`);
}

if (fixMode && fixes.length > 0) {
  console.log(`\n${fixes.length} fix(es) would be applied (dry-run):`);
  for (const fix of fixes) {
    console.log(`  ~ ${fix}`);
  }
}

process.exit(1);
