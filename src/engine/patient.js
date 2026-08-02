export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const r1 = v => Math.round(v * 10) / 10;

export const CLAMP_RANGES = {
  hr:[15,230],sbp:[30,280],dbp:[15,170],rr:[2,60],
  spo2:[40,100],temp:[32,43],gcs:[3,15],pain:[0,10],
};

export function initPS(cd) {
  const [sbp, dbp] = (cd.vitals.bp === "---/---" || !cd.vitals.bp)
    ? [0, 0]
    : cd.vitals.bp.split("/").map(Number);
  return {
    hr: cd.vitals.hr, sbp: sbp || 0, dbp: dbp || 0, rr: cd.vitals.rr,
    spo2: cd.vitals.spo2, temp: cd.vitals.temp,
    gcs: cd.initialGCS ?? 15, pain: cd.initialPain ?? 6,
    status: "deteriorating",
  };
}

/**
 * Вычисляет исход пациента.
 * @param {Object} ps - состояние пациента
 * @param {Object} caseData - данные кейса
 * @param {string} [department] - отделение ('icu'|'admission')
 * @returns {string} исход: 'dead'|'stabilized'|'critical'|'unstable'|'stable'
 */
export function computeOutcome(ps, caseData, department) {
  if (!ps) return "unknown";
  if (ps.status === "dead") return "dead";
  const dt = caseData?.deathThresholds || {};
  const isArrest = caseData?.isClinicalArrest || false;

  const dead =
    (dt.sbp !== undefined ? (dt.sbp < 0 ? false : ps.sbp <= dt.sbp) : (isArrest ? false : ps.sbp < 50)) ||
    (dt.spo2 !== undefined ? (dt.spo2 < 0 ? false : ps.spo2 <= dt.spo2) : (isArrest ? false : ps.spo2 < 60)) ||
    (dt.gcs !== undefined ? (dt.gcs < 0 ? false : ps.gcs <= dt.gcs) : (isArrest ? false : ps.gcs <= 3)) ||
    (dt.hr != null && dt.hr > 0 ? ps.hr >= dt.hr : false) ||
    (dt.rr != null && dt.rr > 0 ? ps.rr <= dt.rr : false);

  if (dead) return "dead";
  if (department === "icu") return "stabilized";
  if (ps.sbp < 80 || ps.spo2 < 80 || ps.gcs < 8) return "critical";
  if (ps.sbp < 100 || ps.spo2 < 88 || ps.gcs < 12) return "unstable";
  return "stable";
}
