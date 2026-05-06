#!/usr/bin/env node
// Usage: node scripts/sync-cases.js <google-sheets-csv-url>
// Or:    SHEET_URL=... node scripts/sync-cases.js

import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const SHEET_URL = process.argv[2] || process.env.SHEET_URL;

if (!SHEET_URL) {
  console.error("❌  Укажи URL Google Sheets CSV:");
  console.error("   node scripts/sync-cases.js <url>");
  console.error("\nКак получить URL:");
  console.error("   Файл → Поделиться → Опубликовать в интернете → CSV → Копировать ссылку");
  process.exit(1);
}

// ── CSV parser (handles quoted fields with commas/newlines) ──────────────────

function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], next = text[i + 1];
    if (c === '"' && !inQ)              { inQ = true; }
    else if (c === '"' && inQ && next === '"') { field += '"'; i++; }
    else if (c === '"' && inQ)          { inQ = false; }
    else if (c === ',' && !inQ)         { row.push(field); field = ""; }
    else if ((c === '\n' || c === '\r') && !inQ) {
      if (c === '\r' && next === '\n') i++;
      row.push(field); field = "";
      if (row.some(f => f !== "")) rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field || row.length) { row.push(field); if (row.some(f => f !== "")) rows.push(row); }
  return rows;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const num  = (v, def = 0)  => v && v.trim() ? parseFloat(v) || def : def;
const int  = (v, def = 0)  => v && v.trim() ? parseInt(v)   || def : def;
const arr  = (v)            => v ? v.split(",").map(s => s.trim()).filter(Boolean) : [];
const has  = (v)            => v && v.trim() !== "";

// All test column suffixes used in the sheet
const TEST_KEYS = [
  "ecg","troponin","cbc","bmp","coag","echo","xray","bnp","glucose","spo2",
  "ct_head","ct_chest","lumbar","mri","abg","crp","culture","d_dimer",
  "thyroid","urine","usg_abdo",
];

function rowToCase(r, idx) {
  const testResults = {};
  TEST_KEYS.forEach(k => {
    const val = r[`test_${k}`];
    if (has(val)) testResults[k] = val.trim();
  });

  const deathThresholds = {};
  ["sbp","spo2","gcs","hr","rr"].forEach(k => {
    if (has(r[`death_${k}`])) deathThresholds[k] = num(r[`death_${k}`]);
  });

  const c = {
    id:       has(r.id) ? int(r.id) : idx + 1,
    name:     r.name.trim(),
    age:      int(r.age),
    gender:   r.gender.trim(),
    complaint: r.complaint.trim(),
    vitals: {
      bp:   r.bp.trim(),
      hr:   num(r.hr),
      rr:   num(r.rr),
      temp: num(r.temp, 36.6),
      spo2: num(r.spo2, 98),
    },
    deterioration: {
      hr:   num(r.det_hr),
      sbp:  num(r.det_sbp),
      dbp:  num(r.det_dbp),
      rr:   num(r.det_rr),
      spo2: num(r.det_spo2),
      temp: num(r.det_temp),
      gcs:  num(r.det_gcs),
      pain: num(r.det_pain),
    },
    anamnesis:  r.anamnesis.trim(),
    exam:       r.exam.trim(),
    severity:   r.severity.trim(),
    category:   r.category.trim(),
    diagnosis:  r.diagnosis.trim(),
    testResults,
    needDiag:   arr(r.needDiag),
    needTreat:  arr(r.needTreat),
    wrongTreat: arr(r.wrongTreat),
    timeLimit:  int(r.timeLimit, 12),
    tip:        r.tip.trim(),
  };

  if (has(r.initialGCS))  c.initialGCS  = int(r.initialGCS);
  if (has(r.initialPain)) c.initialPain = int(r.initialPain);
  if (Object.keys(deathThresholds).length) c.deathThresholds = deathThresholds;

  return c;
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log("⏳  Загружаю таблицу...");
const res = await fetch(SHEET_URL);
if (!res.ok) { console.error(`❌  HTTP ${res.status}: ${res.statusText}`); process.exit(1); }

const text = await res.text();
const rows = parseCSV(text);

if (rows.length < 2) { console.error("❌  Таблица пустая или не распарсилась"); process.exit(1); }

const headers = rows[0].map(h => h.trim());
const cases = rows.slice(1)
  .filter(row => row.some(f => f.trim()))
  .map((row, idx) => {
    const r = {};
    headers.forEach((h, i) => r[h] = row[i] ?? "");
    return rowToCase(r, idx);
  })
  .filter(c => c.name && c.complaint);

const __dir = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dir, "../src/data/cases.js");
writeFileSync(outPath, `export const CASES = ${JSON.stringify(cases, null, 2)};\n`);

console.log(`✓  Синхронизировано ${cases.length} кейсов → src/data/cases.js`);
console.log("   Запусти npm run build чтобы задеплоить изменения.");
