import React from "react";
import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";

/** Test results panel */
export function ResultsPanel({ orderedDiag, revealedResults, processingTests, handleNextFromResults }) {
  const C = useTheme();
  const { t } = useTranslate();
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: FONT, marginBottom: 10 }}>
        {t("results.title", { n: orderedDiag.length })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {orderedDiag.map(id => {
          const text = revealedResults[id];
          if (!text) return (
            <div key={id} style={{ padding: "8px 10px", borderRadius: 8, background: `${C.textDim}08`, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, border: `2px solid ${C.yellow}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <span style={{ fontSize: 12, color: C.textDim, fontFamily: FONT }}>{id} — {t("outpatient.loading")}</span>
            </div>
          );
          const isCrit = text.startsWith("🔴");
          return (
            <div key={id} style={{ padding: "8px 10px", borderRadius: 8, background: isCrit ? `${C.red}0a` : `${C.textDim}08`, borderLeft: `3px solid ${isCrit ? C.red : C.accent}` }}>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, textTransform: "uppercase", marginBottom: 2 }}>{id}</div>
              <div style={{ fontSize: 12.5, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>{text}</div>
            </div>
          );
        })}
      </div>
      {processingTests && <div style={{ textAlign: "center", padding: 8, fontSize: 12, color: C.textDim, fontFamily: FONT }}>{t("outpatient.loading")}</div>}
      {orderedDiag.length > 0 && orderedDiag.every(id => revealedResults[id]) && (
        <button
          onClick={handleNextFromResults}
          style={{
            width: "100%",
            marginTop: 12,
            padding: "11px",
            borderRadius: 10,
            background: `linear-gradient(135deg,${C.accent},${C.green})`,
            border: "none",
            fontSize: 13.5,
            fontWeight: 700,
            color: C.bg,
            cursor: "pointer",
            fontFamily: FONT,
            boxShadow: `0 4px 14px ${C.accent}30`,
          }}
        >
          {t("outpatient.toDiagnose")}
        </button>
      )}
    </div>
  );
}
