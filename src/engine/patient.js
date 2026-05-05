export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const r1 = v => Math.round(v * 10) / 10;

export const CLAMP_RANGES = {
  hr:[15,230],sbp:[30,280],dbp:[15,170],rr:[2,60],
  spo2:[40,100],temp:[32,43],gcs:[3,15],pain:[0,10],
};

export function initPS(cd) {
  const [sbp, dbp] = cd.vitals.bp.split("/").map(Number);
  return {
    hr:cd.vitals.hr, sbp, dbp, rr:cd.vitals.rr,
    spo2:cd.vitals.spo2, temp:cd.vitals.temp,
    gcs:cd.initialGCS ?? 15, pain:cd.initialPain ?? 6,
    status:"deteriorating",
  };
}

export function computeOutcome(ps) {
  if (!ps) return "unknown";
  if (ps.status === "dead" || ps.sbp < 50 || ps.spo2 < 60 || ps.gcs <= 3) return "dead";
  if (ps.sbp < 80 || ps.spo2 < 78 || ps.gcs < 7) return "critical";
  if (ps.sbp < 100 || ps.spo2 < 88 || ps.gcs < 12) return "unstable";
  return "stable";
}
