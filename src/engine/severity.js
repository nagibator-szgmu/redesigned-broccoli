/**
 * Упрощённый расчётный индекс тяжести (на основе SOFA).
 * Использует 5 виталов: sbp, spo2, gcs, hr, rr (0–20 баллов).
 */

const scoreSpO2 = (v) => (v >= 96 ? 0 : v >= 90 ? 1 : v >= 80 ? 2 : v >= 70 ? 3 : 4);
const scoreSBP = (v) => (v >= 120 ? 0 : v >= 100 ? 1 : v >= 80 ? 2 : v >= 60 ? 3 : 4);
const scoreGCS = (v) => (v >= 15 ? 0 : v >= 13 ? 1 : v >= 10 ? 2 : v >= 6 ? 3 : 4);
const scoreHR = (v) => (v >= 50 && v <= 99 ? 0 : (v >= 100 && v <= 119) || (v >= 40 && v <= 49) ? 1 : (v >= 120 && v <= 139) || v < 40 ? 2 : 3);
const scoreRR = (v) => (v >= 12 && v <= 20 ? 0 : (v >= 21 && v <= 24) || (v >= 10 && v <= 11) ? 1 : (v >= 25 && v <= 30) || v < 10 ? 2 : 3);

const SEV_LEVELS = [
  { max: 4, label: "mild", color: "#66bb6a" },
  { max: 9, label: "moderate", color: "#ffa726" },
  { max: 14, label: "severe", color: "#ef5350" },
  { max: Infinity, label: "critical", color: "#e53935" },
];

/**
 * Рассчитывает упрощённый индекс тяжести по текущим виталам.
 * @param {{sbp:number, spo2:number, gcs:number, hr:number, rr:number}} ps
 * @returns {{total:number, label:string, color:string, subs:{spo2:number,sbp:number,gcs:number,hr:number,rr:number}}}
 */
export function computeSeverity(ps) {
  if (!ps) return { total: 0, label: "mild", color: "#66bb6a", subs: {} };
  const subs = {
    spo2: scoreSpO2(ps.spo2),
    sbp: scoreSBP(ps.sbp),
    gcs: scoreGCS(ps.gcs),
    hr: scoreHR(ps.hr),
    rr: scoreRR(ps.rr),
  };
  const total = subs.spo2 + subs.sbp + subs.gcs + subs.hr + subs.rr;
  const { label, color } = SEV_LEVELS.find((lvl) => total <= lvl.max);
  return { total, label, color, subs };
}
