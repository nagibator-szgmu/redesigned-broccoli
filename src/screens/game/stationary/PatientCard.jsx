import React from "react";
import { FONT, CODE, RADIUS } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";
import { IconHospital } from "../../../ui/icons";
import { DAY_COLORS } from "./constants";

/** Patient vitals card with day history in stationary department */
export default function PatientCard({ cd, currentPs, cycle }) {
  const C = useTheme();
  const { t } = useTranslate();
  const dayColor = DAY_COLORS[cycle.currentDay % 7];

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: RADIUS.md, padding: 16, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: RADIUS.sm, background: `${dayColor}15`, border: `1px solid ${dayColor}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconHospital size={18} color={dayColor} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: FONT }}>{cd.name}</div>
          <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT }}>{cd.age} {t("cases.ageSuffix")} · {cd.gender} · {t("department.stationary")}</div>
        </div>
        <span style={{ background: `${dayColor}20`, border: `1px solid ${dayColor}44`, borderRadius: 5, padding: "2px 8px", fontSize: 10, color: dayColor, fontWeight: 700, fontFamily: FONT }}>
          {t("stationary.dayN", { n: cycle.currentDay + 1, max: cycle.maxDays })}
        </span>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { label: t("vitals.sbp"), value: currentPs.bp || `${currentPs.sbp}/${currentPs.dbp || "?"}`, warn: currentPs.sbp < 90 || currentPs.sbp > 200 },
          { label: t("vitals.hr"), value: currentPs.hr, warn: currentPs.hr > 110 || currentPs.hr < 50 },
          { label: t("vitals.spo2"), value: `${currentPs.spo2}%`, warn: currentPs.spo2 < 92 },
          { label: t("vitals.temp"), value: `${currentPs.temp}°C`, warn: currentPs.temp > 38 },
          { label: t("vitals.gcs"), value: currentPs.gcs, warn: currentPs.gcs < 13 },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{ padding: "6px 10px", borderRadius: 8, background: warn ? `${C.red}10` : `${C.textDim}08`, border: `1px solid ${warn ? `${C.red}33` : C.border}`, textAlign: "center", minWidth: 56 }}>
            <div style={{ fontSize: 9, color: C.textDim, fontFamily: FONT, textTransform: "uppercase" }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: warn ? C.red : C.white, fontFamily: CODE }}>{value}</div>
          </div>
        ))}
      </div>
      {cycle.dayHistory.length > 0 && (
        <div style={{ marginTop: 10, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
          <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, marginBottom: 4 }}>{t("stationary.dayHistory")}</div>
          {cycle.dayHistory.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
              <span style={{ fontSize: 10, color: DAY_COLORS[i % 7], fontFamily: FONT, fontWeight: 600 }}>{t("stationary.day", { n: h.day })}:</span>
              <span style={{ fontSize: 10, color: C.textDim, fontFamily: FONT }}>
                {h.treatments.length > 0 ? h.treatments.join(", ") : "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
