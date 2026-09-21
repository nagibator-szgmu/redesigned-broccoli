export const STATUS_CONFIG = {
  NOT_ASSESSED: { label: "НЕ ОЦЕНЕНО", bg: "rgba(120,130,140,0.15)", text: "#94a3b8", border: "rgba(148,163,184,0.3)" },
  ASSESSED: { label: "НОРМА", bg: "rgba(0,230,160,0.12)", text: "#00e5a0", border: "rgba(0,230,160,0.35)" },
  ABNORMAL: { label: "ОТКЛОНЕНИЕ", bg: "rgba(245,200,66,0.12)", text: "#f5c842", border: "rgba(245,200,66,0.35)" },
  CRITICAL: { label: "КРИТИЧНО", bg: "rgba(255,61,90,0.15)", text: "#ff3d5a", border: "rgba(255,61,90,0.4)" },
};

export const ABCDE_TABS = [
  { key: "A", label: "A — Airway", title: "Дыхательные пути" },
  { key: "B", label: "B — Breathing", title: "Дыхание" },
  { key: "C", label: "C — Circulation", title: "Кровообращение" },
  { key: "D", label: "D — Disability", title: "Неврология" },
  { key: "E", label: "E — Exposure", title: "Осмотр тела" },
];

export function formatTime(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

export function evaluateABCDEStatuses(results, cd, ps) {
  const res = { A: "NOT_ASSESSED", B: "NOT_ASSESSED", C: "NOT_ASSESSED", D: "NOT_ASSESSED", E: "NOT_ASSESSED" };
  const stepKeys = Object.keys(results);

  // Section A
  if (stepKeys.some((k) => k.startsWith("a_"))) {
    res.A = cd?.exam?.includes("стридор") || cd?.complaint?.includes("удушье") ? "CRITICAL" : "ASSESSED";
  }
  // Section B
  if (stepKeys.some((k) => k.startsWith("b_"))) {
    if ((ps?.spo2 != null && ps.spo2 < 90) || (ps?.rr != null && (ps.rr < 8 || ps.rr > 30))) res.B = "CRITICAL";
    else if ((ps?.spo2 != null && ps.spo2 < 94) || (ps?.rr != null && (ps.rr < 12 || ps.rr > 22))) res.B = "ABNORMAL";
    else res.B = "ASSESSED";
  }
  // Section C
  if (stepKeys.some((k) => k.startsWith("c_"))) {
    if ((ps?.sbp != null && ps.sbp > 0 && ps.sbp < 80) || (ps?.hr != null && (ps.hr > 140 || (ps.hr > 0 && ps.hr < 40)))) res.C = "CRITICAL";
    else if ((ps?.sbp != null && ps.sbp > 0 && ps.sbp < 90) || (ps?.hr != null && (ps.hr > 100 || (ps.hr > 0 && ps.hr < 50)))) res.C = "ABNORMAL";
    else res.C = "ASSESSED";
  }
  // Section D
  if (stepKeys.some((k) => k.startsWith("d_"))) {
    if (ps?.gcs != null && ps.gcs <= 8) res.D = "CRITICAL";
    else if ((ps?.gcs != null && ps.gcs < 15) || (ps?.pain != null && ps.pain >= 7)) res.D = "ABNORMAL";
    else res.D = "ASSESSED";
  }
  // Section E
  if (stepKeys.some((k) => k.startsWith("e_"))) {
    if ((ps?.temp != null && (ps.temp > 39.5 || ps.temp < 35.0)) || cd?.exam?.includes("перитонит")) res.E = "CRITICAL";
    else if ((ps?.temp != null && (ps.temp > 38.0 || ps.temp < 36.0)) || cd?.exam?.includes("сыпь")) res.E = "ABNORMAL";
    else res.E = "ASSESSED";
  }
  return res;
}
