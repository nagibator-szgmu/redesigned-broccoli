import assert from "node:assert/strict";
import { OUTPATIENT_CASES } from "../src/data/cases/outpatient.js";
import { OUTPATIENT_GASTRO_CASES } from "../src/data/cases/gastroenterology/outpatientCases.js";
import { THERAPEUTIC_NEW_CASES } from "../src/data/cases/gastroenterology/therapeuticNewCases.js";
import { OUTPATIENT_GASTRO_NEW_CASES } from "../src/data/cases/gastroenterology/outpatientGastroCases.js";
import { OUTPATIENT_GASTRO_PART2_CASES } from "../src/data/cases/gastroenterology/outpatientGastroPart2Cases.js";
import { computeScore } from "../src/engine/scoring.js";
import { getTopicsForCase } from "../src/data/topics.js";
import reviewRegistry from "../src/data/review-registry.json" with { type: "json" };

const ALL_GASTRO_OUTP = [...OUTPATIENT_GASTRO_NEW_CASES, ...OUTPATIENT_GASTRO_PART2_CASES];
assert.equal(ALL_GASTRO_OUTP.length, 6, "Total 6 outpatient gastro cases across Part 1 and Part 2");

const ALL_10_GASTRO_OUTP = [
  ...OUTPATIENT_GASTRO_CASES,
  ...THERAPEUTIC_NEW_CASES,
  ...OUTPATIENT_GASTRO_NEW_CASES,
  ...OUTPATIENT_GASTRO_PART2_CASES,
];
assert.equal(ALL_10_GASTRO_OUTP.length, 10, "Total 10 outpatient gastro cases in catalog");

const CANONICAL_ROUTES = ["treat_outpatient", "refer_specialist", "refer_hospitalization", "call_ems"];
const CANONICAL_LABELS = {
  treat_outpatient: "Лечить амбулаторно",
  refer_specialist: "Направить к специалисту",
  refer_hospitalization: "Направить на плановую госпитализацию",
  call_ems: "Вызвать СМП немедленно",
};

for (const c of ALL_10_GASTRO_OUTP) {
  assert.equal(c.department, "outpatient", `${c.id} department must be outpatient`);
  assert.ok(c.needDiag?.length > 0, `${c.id} must have needDiag`);
  assert.ok(Array.isArray(c.needTreat), `${c.id} needTreat must be array`);
  assert.ok(c.wrongTreat?.length > 0, `${c.id} must have wrongTreat`);
  assert.ok(c.diagnosisVariants?.length >= 3, `${c.id} must have at least 3 diagnosisVariants`);
  assert.ok(CANONICAL_ROUTES.includes(c.correctRoute), `${c.id} correctRoute must be canonical`);
  assert.equal(c.routeOptions?.length, 4, `${c.id} must have 4 routeOptions`);
  const optIds = c.routeOptions.map((r) => r.id);
  assert.deepEqual(optIds.sort(), [...CANONICAL_ROUTES].sort(), `${c.id} options must match canonical 4`);
  for (const opt of c.routeOptions) {
    assert.equal(opt.label, CANONICAL_LABELS[opt.id], `${c.id} route ${opt.id} label must be spoiler-free`);
  }
}

for (const c of ALL_GASTRO_OUTP) {
  assert.equal(reviewRegistry.cases[c.id]?.status, "reviewed", `${c.id} must be reviewed in registry`);
  assert.ok(getTopicsForCase(c.id).length > 0, `${c.id} must map to at least one topic`);
}

const outpIds = OUTPATIENT_CASES.map((c) => c.id);
for (const c of ALL_GASTRO_OUTP) {
  assert.ok(outpIds.includes(c.id), `OUTPATIENT_CASES must include ${c.id}`);
}

const choleCase = ALL_GASTRO_OUTP.find((c) => c.id === "outp_gastro_cholelithiasis");
const vitals = { status: "stable", hr: 76, bp: "125/80", spo2: 99, gcs: 15 };
const anamnesis = new Set(["historyOfIllness", "lifeHistory"]);

const scoreRouteOk = computeScore(choleCase, choleCase.needDiag, ["spasmolytics"], "", vitals, 900, anamnesis, { selectedRoute: "refer_specialist" });
const scoreRouteWrong = computeScore(choleCase, choleCase.needDiag, ["spasmolytics"], "", vitals, 900, anamnesis, { selectedRoute: "treat_outpatient" });
assert.equal(scoreRouteOk.score, 65, "Score with correct referral route must be 65 without diag");
assert.equal(scoreRouteWrong.score, 30, "Score with wrong route must be 30");
assert.equal(scoreRouteOk.score - scoreRouteWrong.score, 35, "Route + Rx diff must be 35 pts for referral");
assert.equal(scoreRouteOk.isRouteCorrect, true);
assert.equal(scoreRouteWrong.isRouteCorrect, false);

const ibsCase = ALL_GASTRO_OUTP.find((c) => c.id === "outp_gastro_ibs_diarrhea");
const scoreIbsFull = computeScore(ibsCase, ibsCase.needDiag, ["spasmolytics"], "", vitals, 900, anamnesis, { selectedRoute: "treat_outpatient" });
const scoreIbsNoMeds = computeScore(ibsCase, ibsCase.needDiag, [], "", vitals, 900, anamnesis, { selectedRoute: "treat_outpatient" });
const scoreIbsWrongRoute = computeScore(ibsCase, ibsCase.needDiag, ["spasmolytics"], "", vitals, 900, anamnesis, { selectedRoute: "refer_specialist" });

assert.equal(scoreIbsFull.score, 65, "treat_outpatient with correct Rx must be 65 without diag");
assert.equal(scoreIbsNoMeds.score, 50, "treat_outpatient without Rx must be 50");
assert.equal(scoreIbsWrongRoute.score, 30, "treat_outpatient with wrong route must be 30");
assert.equal(scoreIbsFull.score - scoreIbsNoMeds.score, 15, "Medication portion must be 15 pts");
assert.equal(scoreIbsFull.score - scoreIbsWrongRoute.score, 35, "Total route + Rx bonus must be 35 pts");

const nashCase = ALL_GASTRO_OUTP.find((c) => c.id === "outp_gastro_nash");
assert.equal(nashCase.needTreat.length, 0, "NASH must have empty needTreat");
const scoreNashOk = computeScore(nashCase, nashCase.needDiag, [], "", vitals, 900, anamnesis, { selectedRoute: "treat_outpatient" });
assert.equal(scoreNashOk.score, 65, "NASH treat_outpatient with 0 meds must score 65 without diag (20 route + 15 non-drug Rx + 30 tests/anamnesis)");
const scoreNashWrongDrug = computeScore(nashCase, nashCase.needDiag, ["aspirin"], "", vitals, 900, anamnesis, { selectedRoute: "treat_outpatient" });
assert.equal(scoreNashWrongDrug.score, 50, "NASH with contraindicated aspirin must lose 15 points (65 - 15 = 50)");

// Test: Missing 1 test out of 5 in outp_gastro_ibs_diarrhea must score 96, NOT 100!
const ibsMissedTest = computeScore(ibsCase, ["colonoscopy", "crp", "cbc", "bmp"], ["spasmolytics"], JSON.stringify({ main: "СРК с диареей" }), vitals, 900, anamnesis, { selectedRoute: "treat_outpatient" });
assert.equal(ibsMissedTest.score, 96, "Missing 1 test out of 5 must score 96/100, not 100/100");

// Test: Perfect completion must score 100/100
const ibsPerfect = computeScore(ibsCase, ibsCase.needDiag, ["spasmolytics"], JSON.stringify({ main: "СРК с диареей" }), vitals, 900, anamnesis, { selectedRoute: "treat_outpatient" });
assert.equal(ibsPerfect.score, 100, "Perfect outpatient appointment must score exactly 100/100");

// Test defensive handling of undefined selTreat and lifeHistoryContraindications
const caseWithContra = OUTPATIENT_GASTRO_CASES[0];
assert.ok(caseWithContra.lifeHistoryContraindications?.length > 0, "case must have lifeHistoryContraindications");
const scoreSafeUndefined = computeScore(caseWithContra, [], undefined, "", vitals);
assert.equal(typeof scoreSafeUndefined.score, "number", "computeScore must safely handle undefined selTreat");

const scoreVar = computeScore(choleCase, choleCase.needDiag, ["spasmolytics"], "ЖКБ", vitals, 120, anamnesis, { selectedRoute: "refer_specialist" });
assert.equal(scoreVar.diagCorrect, true, "Should match 'ЖКБ'");
assert.equal(scoreVar.score, 100, "Full score with diagnosis must be 100");

const scoreNull = computeScore(choleCase, choleCase.needDiag, [], "", vitals, 900, anamnesis, null);
assert.equal(scoreNull.score, 30);
assert.equal(scoreNull.isRouteCorrect, false);

const mockIcu = { ...choleCase, department: "icu", needTreat: ["spasmolytics"] };
const scoreIcu = computeScore(mockIcu, mockIcu.needDiag, ["spasmolytics"], "", vitals, 900, anamnesis);
assert.equal(scoreIcu.score, 60);

const noVarCase = { id: "test_no_var", diagnosis: "Аппендицит", department: "outpatient", correctRoute: "call_ems" };
const scoreNoVar = computeScore(noVarCase, [], [], "Аппендицит", { status: "stable" }, 900, new Set(), { selectedRoute: "call_ems" });
assert.equal(scoreNoVar.diagCorrect, true);
assert.equal(scoreNoVar.isRouteCorrect, true);

const scoreStr = computeScore(choleCase, [], [], "", vitals, 900, new Set(), "refer_specialist");
assert.equal(scoreStr.isRouteCorrect, true);

const scoreArr = computeScore(choleCase, [], ["spasmolytics"], "", vitals, 900, ["historyOfIllness", "lifeHistory"], "refer_specialist");
assert.equal(scoreArr.score, 45);

const scoreJson = computeScore(choleCase, choleCase.needDiag, ["spasmolytics"], JSON.stringify({ main: "ЖКБ" }), vitals, 900, anamnesis, "refer_specialist");
assert.equal(scoreJson.score, 100);

import { OUTPATIENT_TREATMENTS, OUTPATIENT_TREATMENTS_MAP } from "../src/data/outpatientTreatments.js";
import { DIAGNOSTICS } from "../src/data/diagnostics.js";

// Check that no outpatient treatments contain IV designations
for (const t of OUTPATIENT_TREATMENTS) {
  assert.equal(t.name.includes("в/в"), false, `Outpatient treatment ${t.id} must not contain 'в/в' in name`);
  assert.equal((t.desc || "").includes("в/в"), false, `Outpatient treatment ${t.id} must not contain 'в/в' in desc`);
}

// Check celiac serology test naming
const celiacTest = DIAGNOSTICS.find((d) => d.id === "serology_celiac");
assert.ok(celiacTest, "serology_celiac must exist in DIAGNOSTICS");
assert.ok(celiacTest.name.includes("Серология целиакии"), "serology_celiac name must include 'Серология целиакии'");

// Check all outpatient cases needTreat are covered by OUTPATIENT_TREATMENTS
for (const c of OUTPATIENT_CASES) {
  for (const tid of c.needTreat || []) {
    assert.ok(OUTPATIENT_TREATMENTS_MAP[tid], `Outpatient case ${c.id} needTreat '${tid}' must be in OUTPATIENT_TREATMENTS`);
  }
}

console.log("✓ ALL 10 OUTPATIENT GASTROENTEROLOGY & ADAPTIVE SCORING TESTS PASSED");
