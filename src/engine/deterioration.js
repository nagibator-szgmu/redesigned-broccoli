import { CLAMP_RANGES, clamp, r1 } from "./patient.js";
import { TREAT_FX, ADVERSE_FX } from "../data/treatments.js";

const STATUS_THRESHOLDS = { easy: 0.65, normal: 1, hard: 1.5 };

export function tickDeterioration(ps, caseData, difficulty, gameMode) {
  if (!ps || ps.status === "dead") return ps;
  const det = caseData?.deterioration || {};
  const dm = STATUS_THRESHOLDS[difficulty] || 1;
  const sm = gameMode === "stress" ? 2 : 1;
  const next = { ...ps };
  for (const k of Object.keys(CLAMP_RANGES)) {
    const delta = det[k] ?? 0;
    if (delta !== 0) next[k] = clamp(r1(ps[k] + delta * dm * sm), CLAMP_RANGES[k][0], CLAMP_RANGES[k][1]);
  }
  return next;
}

export function applyContinuousEffects(ps, activeTreatIds) {
  if (!ps) return ps;
  const next = { ...ps };
  for (const id of activeTreatIds) {
    const eff = TREAT_FX[id]?.eff || {};
    for (const [k, v] of Object.entries(eff)) {
      if (k in next && CLAMP_RANGES[k]) next[k] = clamp(r1(next[k] + v * 0.15), CLAMP_RANGES[k][0], CLAMP_RANGES[k][1]);
    }
  }
  return next;
}

export function applyTreatmentEffects(ps, caseData, treatId) {
  if (!ps) return ps;
  const isWrong = caseData.wrongTreat.includes(treatId);
  const fx = isWrong ? (ADVERSE_FX[treatId] || {}) : (TREAT_FX[treatId]?.eff || {});
  const next = { ...ps };
  for (const [k, v] of Object.entries(fx)) {
    if (k in next && CLAMP_RANGES[k]) next[k] = clamp(r1(next[k] + v), CLAMP_RANGES[k][0], CLAMP_RANGES[k][1]);
  }
  return next;
}

export function resolveStatus(ps, caseData) {
  if (!ps) return ps;
  const dt = caseData?.deathThresholds || {};
  const isArrest = caseData?.isClinicalArrest || false;
  const isBrady = dt.hr != null && (dt.hr < 50 || (caseData?.deterioration?.hr != null && caseData.deterioration.hr < 0));
  const isHyperBP = dt.sbp != null && (dt.sbp >= 180 || (caseData?.deterioration?.sbp != null && caseData.deterioration.sbp > 0 && dt.sbp > 150));

  const dead =
    (dt.sbp != null ? (dt.sbp < 0 ? false : (isHyperBP ? ps.sbp >= dt.sbp : ps.sbp <= dt.sbp)) : (isArrest ? false : ps.sbp < 50)) ||
    (dt.spo2 != null ? (dt.spo2 < 0 ? false : ps.spo2 <= dt.spo2) : (isArrest ? false : ps.spo2 < 60)) ||
    (dt.gcs != null ? (dt.gcs < 0 ? false : ps.gcs <= dt.gcs) : (isArrest ? false : ps.gcs <= 3)) ||
    (dt.hr != null && dt.hr > 0 ? (isBrady ? ps.hr <= dt.hr : ps.hr >= dt.hr) : false) ||
    (dt.rr != null && dt.rr > 0 ? ps.rr <= dt.rr : false) ||
    (dt.temp != null ? (dt.temp < 35 ? ps.temp <= dt.temp : ps.temp >= dt.temp) : false);

  if (dead) return { ...ps, status: "dead" };
  if (ps.sbp < 80 || ps.spo2 < 80 || ps.gcs < 8) return { ...ps, status: "critical" };
  if (ps.sbp > 100 && ps.spo2 > 90 && ps.gcs >= 12) return { ...ps, status: "stable" };
  return { ...ps, status: "deteriorating" };
}

export function applyUnfinishedTreatments(ps, caseData, treatIds, appliedSet) {
  if (!ps) return ps;
  let next = { ...ps };
  for (const id of treatIds) {
    if (appliedSet.has(id)) continue;
    next = applyTreatmentEffects(next, caseData, id);
  }
  return next;
}
