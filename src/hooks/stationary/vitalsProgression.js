import { clamp, r1, CLAMP_RANGES } from "../../engine/patient.js";

/**
 * Calculates patient vitals progression for the next hospital day.
 * Rewards adequate therapy with case recovery; penalizes wrong/missing therapy.
 *
 * @param {Object} currentPs - Current patient state
 * @param {Object} cd - Clinical case data
 * @param {number} nextDayIndex - 0-indexed day index of the incoming day
 * @param {Array<string>} dailyTreatments - Treatments applied during the finished day
 * @returns {Object} Updated patient vitals and status
 */
export function calculateNextDayVitals(currentPs, cd, nextDayIndex, dailyTreatments = []) {
  if (!currentPs || currentPs.status === "dead") return currentPs;

  const nextPs = { ...currentPs };
  const needTreat = cd?.needTreat || [];
  const wrongTreat = cd?.wrongTreat || [];

  const appliedNeeded = dailyTreatments.filter(t => needTreat.includes(t));
  const appliedWrong = dailyTreatments.filter(t => wrongTreat.includes(t));

  const isAdequate = appliedNeeded.length > 0 && appliedWrong.length === 0;
  const isDangerous = appliedWrong.length > 0;
  const dayPlanItem = cd?.dayByDayPlan?.[nextDayIndex];

  if (isAdequate && dayPlanItem && (dayPlanItem.sbp || dayPlanItem.hr || dayPlanItem.temp)) {
    if (dayPlanItem.sbp != null) nextPs.sbp = dayPlanItem.sbp;
    if (dayPlanItem.dbp != null) nextPs.dbp = dayPlanItem.dbp;
    if (dayPlanItem.hr != null) nextPs.hr = dayPlanItem.hr;
    if (dayPlanItem.spo2 != null) nextPs.spo2 = dayPlanItem.spo2;
    if (dayPlanItem.temp != null) nextPs.temp = dayPlanItem.temp;
    else if (nextPs.temp > 36.8) nextPs.temp = r1(Math.max(36.6, nextPs.temp - 0.5));
    if (dayPlanItem.gcs != null) nextPs.gcs = dayPlanItem.gcs;
  } else if (isAdequate) {
    if (nextPs.temp > 36.8) nextPs.temp = r1(Math.max(36.6, nextPs.temp - 0.6));
    if (nextPs.spo2 < 98) nextPs.spo2 = Math.min(99, nextPs.spo2 + 2);
    if (nextPs.hr > 80) nextPs.hr = Math.max(72, nextPs.hr - 8);
    if (nextPs.hr < 60) nextPs.hr = Math.min(75, nextPs.hr + 5);
    if (nextPs.sbp < 115) nextPs.sbp = Math.min(120, nextPs.sbp + 5);
    if (nextPs.sbp > 135) nextPs.sbp = Math.max(125, nextPs.sbp - 6);
    if (nextPs.pain > 0) nextPs.pain = Math.max(0, nextPs.pain - 2);
    if (nextPs.gcs < 15) nextPs.gcs = Math.min(15, nextPs.gcs + 1);
  } else {
    const d = cd?.deterioration || { hr: 1, sbp: -1, rr: 1, spo2: -1, temp: 0.05, gcs: -0.1 };
    const mult = isDangerous ? 3 : 1.5;
    nextPs.hr = clamp(r1(nextPs.hr + (d.hr || 0) * mult), CLAMP_RANGES.hr[0], CLAMP_RANGES.hr[1]);
    nextPs.sbp = clamp(r1(nextPs.sbp + (d.sbp || 0) * mult), CLAMP_RANGES.sbp[0], CLAMP_RANGES.sbp[1]);
    nextPs.dbp = clamp(r1(nextPs.dbp + (d.dbp || 0) * mult), CLAMP_RANGES.dbp[0], CLAMP_RANGES.dbp[1]);
    nextPs.rr = clamp(r1(nextPs.rr + (d.rr || 0) * mult), CLAMP_RANGES.rr[0], CLAMP_RANGES.rr[1]);
    nextPs.spo2 = clamp(r1(nextPs.spo2 + (d.spo2 || 0) * mult), CLAMP_RANGES.spo2[0], CLAMP_RANGES.spo2[1]);
    nextPs.temp = clamp(r1(nextPs.temp + (d.temp || 0) * mult), CLAMP_RANGES.temp[0], CLAMP_RANGES.temp[1]);
    nextPs.gcs = clamp(r1(nextPs.gcs + (d.gcs || 0) * mult), CLAMP_RANGES.gcs[0], CLAMP_RANGES.gcs[1]);
  }

  const dt = cd?.deathThresholds || {};
  const dead =
    (dt.sbp != null ? nextPs.sbp <= dt.sbp : nextPs.sbp <= 55) ||
    (dt.spo2 != null ? nextPs.spo2 <= dt.spo2 : nextPs.spo2 <= 65) ||
    (dt.gcs != null ? nextPs.gcs <= dt.gcs : nextPs.gcs <= 4) ||
    (dt.hr != null ? nextPs.hr >= dt.hr : nextPs.hr >= 190);

  if (dead) {
    nextPs.status = "dead";
  } else if (nextPs.sbp < 90 || nextPs.spo2 < 90 || nextPs.gcs < 11) {
    nextPs.status = "critical";
  } else if (nextPs.sbp >= 100 && nextPs.spo2 >= 94 && nextPs.temp < 37.5) {
    nextPs.status = "stable";
  } else {
    nextPs.status = "deteriorating";
  }

  return nextPs;
}
