import React from "react";
import { FONT, CODE } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";
import { DAY_COLORS } from "./constants";

/** Morning phase panel in stationary game */
export default function MorningPanel({ morningInfo, cycle, setLocalPhase, currentPs }) {
  const C = useTheme();
  const { t } = useTranslate();
  const dayColor = DAY_COLORS[cycle.currentDay % 7];

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: dayColor, fontFamily: FONT, marginBottom: 6 }}>
        {t("stationary.morningDay", { n: cycle.currentDay + 1 })}
      </div>
      {currentPs && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {[
            { label: t("vitals.sbp"), value: `${Math.round(currentPs.sbp)}/${Math.round(currentPs.dbp)}`, warn: currentPs.sbp < 90 || currentPs.sbp > 200 },
            { label: t("vitals.hr"), value: `${Math.round(currentPs.hr)}`, warn: currentPs.hr > 110 || currentPs.hr < 50 },
            { label: t("vitals.spo2"), value: `${currentPs.spo2}%`, warn: currentPs.spo2 < 92 },
            { label: t("vitals.temp"), value: `${currentPs.temp}°C`, warn: currentPs.temp > 38 },
            { label: t("vitals.gcs"), value: `${Math.round(currentPs.gcs)}`, warn: currentPs.gcs < 13 },
          ].map(({ label, value, warn }) => (
            <div key={label} style={{ padding: "4px 8px", borderRadius: 6, background: warn ? `${C.red}10` : `${C.textDim}08`, border: `1px solid ${warn ? `${C.red}33` : C.border}`, textAlign: "center", minWidth: 50 }}>
              <div style={{ fontSize: 8, color: C.textDim, fontFamily: FONT, textTransform: "uppercase" }}>{label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: warn ? C.red : C.white, fontFamily: CODE, lineHeight: 1.2 }}>{value}</div>
            </div>
          ))}
        </div>
      )}
      {morningInfo ? (
        <>
          <p style={{ fontSize: 12, color: C.text, fontFamily: FONT, lineHeight: 1.5, marginBottom: 10, padding: "8px 10px", background: `${C.textDim}08`, borderRadius: 8, borderLeft: `3px solid ${dayColor}`, margin: 0 }}>
            {morningInfo.morningStatus || morningInfo.morning}
          </p>
          {(morningInfo.tasks?.length > 0 || morningInfo.plan) && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, marginBottom: 4 }}>{t("stationary.tasksOfDay")}</div>
              {(morningInfo.tasks || (morningInfo.plan ? [morningInfo.plan] : [])).map((task, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: dayColor, marginTop: 1 }}>▸</span>
                  <span style={{ fontSize: 11, color: C.text, fontFamily: FONT, lineHeight: 1.4 }}>{task}</span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p style={{ fontSize: 12, color: C.textDim, fontFamily: FONT, fontStyle: "italic", margin: 0 }}>—</p>
      )}
      {cycle.dischargeCriteria.length > 0 && (
        <div style={{ padding: "8px", borderRadius: 8, background: `${C.green}08`, border: `1px solid ${C.green}22`, fontSize: 10, color: C.green, fontFamily: FONT, textAlign: "center", marginTop: 8 }}>
          {t("stationary.dischargeReady", { n: cycle.dischargeCriteria.length })}
        </div>
      )}
      <button
        onClick={() => setLocalPhase("order_tests")}
        style={{ width: "100%", marginTop: 10, padding: "10px", borderRadius: 10, background: `linear-gradient(135deg,${dayColor},${C.accent})`, border: "none", fontSize: 13, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT }}
      >
        {t("stationary.startDay")}
      </button>
    </div>
  );
}
