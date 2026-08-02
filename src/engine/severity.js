/**
 * Упрощённый расчётный индекс тяжести (на основе SOFA).
 * Использует 5 виталов: sbp, spo2, gcs, hr, rr.
 * Каждый параметр даёт 0–4 балла, итого 0–20.
 * НЕ является диагностической шкалой — учебный инструмент.
 */

function scoreSpO2(spo2) {
  if (spo2 >= 96) return 0;
  if (spo2 >= 90) return 1;
  if (spo2 >= 80) return 2;
  if (spo2 >= 70) return 3;
  return 4;
}

function scoreSBP(sbp) {
  if (sbp >= 120) return 0;
  if (sbp >= 100) return 1;
  if (sbp >= 80) return 2;
  if (sbp >= 60) return 3;
  return 4;
}

function scoreGCS(gcs) {
  if (gcs >= 15) return 0;
  if (gcs >= 13) return 1;
  if (gcs >= 10) return 2;
  if (gcs >= 6) return 3;
  return 4;
}

function scoreHR(hr) {
  if (hr >= 50 && hr <= 99) return 0;
  if ((hr >= 100 && hr <= 119) || (hr >= 40 && hr <= 49)) return 1;
  if ((hr >= 120 && hr <= 139) || hr < 40) return 2;
  return 3;
}

function scoreRR(rr) {
  if (rr >= 12 && rr <= 20) return 0;
  if ((rr >= 21 && rr <= 24) || (rr >= 10 && rr <= 11)) return 1;
  if ((rr >= 25 && rr <= 30) || rr < 10) return 2;
  return 3;
}

/**
 * Рассчитывает упрощённый индекс тяжести по текущим виталам.
 * @param {{sbp:number, spo2:number, gcs:number, hr:number, rr:number}} ps
 * @returns {{total:number, label:string, color:string, subs:{spO2:number,sbp:number,gcs:number,hr:number,rr:number}}}
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
  let label, color;
  if (total <= 4) { label = "mild"; color = "#66bb6a"; }
  else if (total <= 9) { label = "moderate"; color = "#ffa726"; }
  else if (total <= 14) { label = "severe"; color = "#ef5350"; }
  else { label = "critical"; color = "#e53935"; }
  return { total, label, color, subs };
}
