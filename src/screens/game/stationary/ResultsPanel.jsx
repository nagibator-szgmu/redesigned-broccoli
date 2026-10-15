import React from "react";
import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";
import { DAY_COLORS } from "./constants";
import { ResultCard } from "../../../ui/components";

/** Test results panel in stationary game with interactive doctor interpretation */
export default function ResultsPanel({
  cd,
  orderedDiag = [],
  revealedResults = {},
  processingTests,
  cycle,
  selectedLabParams = {},
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const dayColor = DAY_COLORS[cycle.currentDay % 7];

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: dayColor, fontFamily: FONT, marginBottom: 8 }}>
        {t("results.title", { n: orderedDiag.length })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {orderedDiag.map((id) => {
          const text = cycle?.testsByDay?.[cycle?.currentDay]?.[id] || revealedResults[id];
          if (!text) {
            return (
              <div key={id} style={{ padding: "8px 10px", borderRadius: 8, background: `${C.textDim}08`, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, border: `2px solid ${C.yellow}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <span style={{ fontSize: 12, color: C.textDim, fontFamily: FONT }}>{id} — загрузка...</span>
              </div>
            );
          }
          return (
            <ResultCard
              key={id}
              id={id}
              text={text}
              cd={cd}
              selectedLabParams={selectedLabParams}
            />
          );
        })}
      </div>
      {processingTests && <div style={{ textAlign: "center", padding: 8, fontSize: 12, color: C.textDim, fontFamily: FONT }}>{t("outpatient.loading")}</div>}
    </div>
  );
}
