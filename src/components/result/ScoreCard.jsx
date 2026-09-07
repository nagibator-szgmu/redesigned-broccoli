import { FONT, CODE } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";

export default function ScoreCard({ result, cd, isMobile }) {
  const C = useTheme();
  const { t } = useTranslate();

  const gradeColor = { excellent: C.green, good: C.accent, satisfactory: C.yellow, unsatisfactory: C.red };
  const gCol = gradeColor[result.gradeId] || C.accent;

  const outcomeMap = {
    stabilized: { color: C.green, label: t("outcome.stabilized") || t("outcome.stable"), icon: "✓" },
    stable: { color: C.green, label: t("outcome.stable"), icon: "✓" },
    unstable: { color: C.yellow, label: t("outcome.unstable"), icon: "⚠" },
    critical: { color: C.red, label: t("outcome.critical"), icon: "🚨" },
    dead: { color: C.red, label: t("outcome.dead"), icon: "💀" },
    unknown: { color: C.textDim, label: t("outcome.unknown"), icon: "?" },
  };
  const oc = outcomeMap[result.outcome] || outcomeMap.unknown;

  const scoreSize = isMobile ? 64 : 72;
  const cardStyle = isMobile
    ? { background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 16px", marginBottom: 12, animation: "fadeIn 0.5s ease", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }
    : { background: C.panel, border: `1px solid ${C.border}`, borderRadius: 18, padding: "28px 32px", marginBottom: 14, animation: "fadeIn 0.5s ease", display: "flex", alignItems: "center", gap: 32 };

  return (
    <div style={cardStyle}>
      <div style={isMobile ? undefined : { textAlign: "center", flexShrink: 0 }}>
        <div style={{ fontSize: scoreSize, fontWeight: 700, color: gCol, fontFamily: CODE, lineHeight: 1, textShadow: `0 0 40px ${gCol}44` }}>{result.score}</div>
        <div style={{ fontSize: isMobile ? 11 : 12, color: C.textDim, fontFamily: FONT, marginTop: isMobile ? -6 : 4 }}>{t("result.score")}</div>
      </div>
      <div style={isMobile ? undefined : { flex: 1 }}>
        <div style={{ fontSize: isMobile ? 11 : 12, letterSpacing: isMobile ? 2 : 3, color: C.textDim, marginBottom: 8, textTransform: "uppercase", fontFamily: FONT, ...(isMobile ? { marginTop: -6 } : {}) }}>
          {cd.name} · {cd.age} л · {cd.gender}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: isMobile ? "center" : undefined, marginBottom: isMobile ? 0 : 8 }}>
          <span style={{ background: `${gCol}20`, border: `1px solid ${gCol}55`, borderRadius: 20, padding: `5px ${isMobile ? 16 : 18}px`, fontSize: isMobile ? 13 : 14, color: gCol, fontWeight: 700, fontFamily: FONT }}>{t(`grades.${result.gradeId}`)}</span>
          <span style={{ background: `${oc.color}20`, border: `1px solid ${oc.color}55`, borderRadius: 20, padding: `5px ${isMobile ? 16 : 18}px`, fontSize: isMobile ? 13 : 14, color: oc.color, fontWeight: 700, fontFamily: FONT }}>{oc.icon} {oc.label}</span>
        </div>
        {result.timeout && <div style={{ color: C.red, fontSize: 12, fontFamily: FONT }}>{t("result.timeout")}</div>}
        {result.died && <div style={{ color: C.red, fontSize: 12, fontFamily: FONT }}>{t("result.died")}</div>}
      </div>
    </div>
  );
}
