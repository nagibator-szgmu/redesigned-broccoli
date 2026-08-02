import { FONT, CODE } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";

const DAY_COLORS = ["#e8e8e8", "#4fc3f7", "#81c784", "#ffcc02", "#ffb74d", "#ef5350", "#ce93d8", "#4dd0e1"];

export default function StationaryDaySummary({ cd, extraResult, isMobile }) {
  const C = useTheme();
  const { t } = useTranslate();

  if (cd.department !== "stationary" || !extraResult?.dayHistory?.length) return null;

  const outcomeColor = extraResult.cycleOutcome === "discharge" ? C.green : extraResult.cycleOutcome === "dead" ? C.red : extraResult.cycleOutcome === "transferToICU" ? C.yellow : C.textDim;
  const outcomeText = extraResult.cycleOutcome === "discharge"
    ? t("stationary.discharged")
    : extraResult.cycleOutcome === "dead"
      ? t("stationary.died")
      : extraResult.cycleOutcome === "transferToICU"
        ? t("stationary.transferredToICU", { n: extraResult.dayHistory.length })
        : t("stationary.maxDaysReached", { n: extraResult.maxDays });

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 10 }}>
      <STitle icon="🏨" label={t("stationary.diary")} color={C.accent} />
      {!isMobile && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
          {extraResult.dayHistory.map((h, i) => {
            const dayColor = DAY_COLORS[i % 8];
            return (
              <div key={i} style={{ padding: "10px 12px", borderRadius: 10, borderLeft: `3px solid ${dayColor}`, background: `${dayColor}08` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: dayColor, fontFamily: FONT, marginBottom: 4 }}>{t("stationary.day", { n: h.day })}</div>
                <div style={{ fontSize: 11, color: C.text, fontFamily: CODE, marginBottom: 4 }}>
                  АД:{Math.round(h.vitals.sbp)}/{Math.round(h.vitals.dbp)} {t("vitals.hr")}:{Math.round(h.vitals.hr)} SpO2:{Math.round(h.vitals.spo2)}%
                </div>
                {h.treatments.length > 0 && <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT }}>💊 {h.treatments.join(", ")}</div>}
              </div>
            );
          })}
        </div>
      )}
      {isMobile && extraResult.dayHistory.map((h, i) => {
        const dayColor = DAY_COLORS[i % 8];
        return (
          <div key={i} style={{ marginBottom: 8, padding: "8px 10px", borderRadius: 8, borderLeft: `3px solid ${dayColor}`, background: `${dayColor}08` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: dayColor, fontFamily: FONT }}>{t("stationary.day", { n: h.day })}</span>
              <span style={{ fontSize: 10, color: C.textDim, fontFamily: CODE }}>
                АД:{Math.round(h.vitals.sbp)}/{Math.round(h.vitals.dbp)} {t("vitals.hr")}:{Math.round(h.vitals.hr)} SpO2:{Math.round(h.vitals.spo2)}%
              </span>
            </div>
            {h.treatments.length > 0 && <div style={{ fontSize: 11, color: C.text, fontFamily: FONT }}>💊 {h.treatments.join(", ")}</div>}
          </div>
        );
      })}
      <div style={{ fontSize: isMobile ? 11 : 12, color: outcomeColor, fontFamily: FONT, fontWeight: 600, marginTop: isMobile ? 4 : 10 }}>{outcomeText}</div>
    </div>
  );
}
