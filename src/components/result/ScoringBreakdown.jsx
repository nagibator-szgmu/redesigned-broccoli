import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { diagMatchRatio, WRONG_TREATMENT_PENALTY } from "../../engine/scoring";
import { computeOutcome } from "../../engine/patient";

const CATEGORIES = (t) => [
  { key: "diagnosis", icon: "🩺", max: 35, label: t("scoring.diagnosis") },
  { key: "tests", icon: "🔬", max: 20, label: t("scoring.tests") },
  { key: "anamnesis", icon: "📋", max: 10, label: t("scoring.anamnesis") },
  { key: "treatment", icon: "💊", max: 20, label: t("scoring.treatment") },
  { key: "outcome", icon: "🏥", max: 20, label: t("scoring.outcome") },
  { key: "time", icon: "⏱️", max: 15, label: t("scoring.time") },
];

function computeBreakdown(cd, selDiag, selTreat, diagText, finalPS, elapsedSec, revealedAnamnesis) {
  const ratio = diagMatchRatio(cd.diagnosis, diagText);
  let diagScore = 0;
  if (ratio >= 0.6) diagScore = 35;
  else if (ratio >= 0.3) diagScore = 20;
  else if (ratio > 0) diagScore = 10;

  const dh = cd.needDiag.filter(id => selDiag.includes(id)).length;
  const testScore = Math.round((dh / Math.max(cd.needDiag.length, 1)) * 20);

  const rev = revealedAnamnesis || new Set();
  const anamnesisRequired = [];
  if (cd.department === "outpatient" || cd.department === "stationary") {
    if (cd.historyOfIllness) anamnesisRequired.push("historyOfIllness");
    if (cd.lifeHistory) anamnesisRequired.push("lifeHistory");
  } else if (cd.department === "admission") {
    if (cd.shortHistory) anamnesisRequired.push("shortHistory");
  }
  const anamnesisScore = Math.round((anamnesisRequired.filter(k => rev.has(k)).length / Math.max(anamnesisRequired.length, 1)) * 10);

  const th = cd.needTreat.filter(id => selTreat.includes(id)).length;
  const treatScore = Math.round((th / Math.max(cd.needTreat.length, 1)) * 20);

  let wrongPenalty = 0;
  cd.wrongTreat.forEach(id => { if (selTreat.includes(id)) wrongPenalty += WRONG_TREATMENT_PENALTY; });
  if (cd.lifeHistoryContraindications && !rev.has("lifeHistory")) {
    cd.lifeHistoryContraindications.forEach(id => { if (selTreat.includes(id) && !cd.wrongTreat.includes(id)) wrongPenalty += WRONG_TREATMENT_PENALTY; });
  }

  const limitSec = cd.timeLimit * 60;
  const remaining = Math.max(0, limitSec - (elapsedSec || 0));
  const ratio2 = remaining / limitSec;
  let timeScore = 0;
  if (ratio2 >= 0.7) timeScore = 15;
  else if (ratio2 >= 0.5) timeScore = 12;
  else if (ratio2 >= 0.3) timeScore = 8;
  else if (ratio2 >= 0.1) timeScore = 4;

  const outcome = computeOutcome(finalPS, cd, cd.department);
  let outcomeScore = 0;
  if (outcome === "stable") outcomeScore = 20;
  else if (outcome === "stabilized") outcomeScore = 20;
  else if (outcome === "unstable") outcomeScore = 10;
  else if (outcome === "critical") outcomeScore = 3;
  else if (outcome === "transferToICU") outcomeScore = 5;
  else if (outcome === "routed") outcomeScore = 15;
  else if (outcome === "timeout_no_route") outcomeScore = -10;
  else if (outcome === "dead") outcomeScore = -20;

  return { diagScore, testScore, anamnesisScore, treatScore, outcomeScore, timeScore, wrongPenalty, outcome };
}

export default function ScoringBreakdown({ cd, selDiag, selTreat, diagText, ps, elapsedSec, revealedAnamnesis }) {
  const C = useTheme();
  const { t } = useTranslate();
  const breakdown = computeBreakdown(cd, selDiag, selTreat, diagText, ps, elapsedSec, revealedAnamnesis);
  const cats = CATEGORIES(t);

  const pointsOf = (key) => {
    if (key === "diagnosis") return breakdown.diagScore;
    if (key === "tests") return breakdown.testScore;
    if (key === "anamnesis") return breakdown.anamnesisScore;
    if (key === "treatment") return Math.max(0, breakdown.treatScore - breakdown.wrongPenalty);
    if (key === "outcome") return breakdown.outcomeScore;
    if (key === "time") return breakdown.timeScore;
    return 0;
  };

  const total = cats.reduce((s, c) => s + pointsOf(c.key), 0);
  const clamped = Math.min(100, Math.max(0, total));

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 16 }}>📊</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: FONT }}>{t("scoring.title")}</span>
        <span style={{ marginLeft: "auto", fontSize: 15, fontWeight: 700, color: C.accent, fontFamily: FONT }}>
          {clamped} / 100
        </span>
      </div>
      {cats.map(cat => {
        const pts = pointsOf(cat.key);
        const pct = cat.max > 0 ? pts / cat.max : 0;
        const barColor = pct >= 0.8 ? C.green : pct >= 0.4 ? C.yellow : C.red;
        return (
          <div key={cat.key} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 12, flexShrink: 0 }}>{cat.icon}</span>
              <span style={{ fontSize: 12, color: C.text, fontFamily: FONT, flex: 1 }}>{cat.label}</span>
              <span style={{ fontSize: 12, color: pts < 0 ? C.red : C.textDim, fontFamily: FONT, fontWeight: 600 }}>
                {pts < 0 ? pts : `+${pts}`} / {cat.max > 0 ? cat.max : "—"}
              </span>
            </div>
            <div style={{ height: 4, background: C.dimBg, borderRadius: 2, overflow: "hidden", marginLeft: 20 }}>
              <div style={{ height: "100%", width: `${Math.max(0, Math.min(100, pct * 100))}%`, background: barColor, borderRadius: 2, transition: "width 0.3s" }} />
            </div>
          </div>
        );
      })}
      {breakdown.wrongPenalty > 0 && (
        <div style={{ marginTop: 8, padding: "8px 10px", background: `${C.red}12`, borderRadius: 8, fontSize: 11, color: C.red, fontFamily: FONT, lineHeight: 1.5 }}>
          {t("scoring.wrongPenalty")}: −{breakdown.wrongPenalty} {t("scoring.points")}
        </div>
      )}
    </div>
  );
}
