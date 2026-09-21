import React from "react";
import { FONT, CODE } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";

/** Шаги A (Airway) и B (Breathing) протокола ABCDE */
export default function ABCDEStepsAirBreathing({ activeTab, cd, ps, results, recordStep }) {
  const C = useTheme();

  if (activeTab === "A") {
    return (
      <>
        <div style={{ fontSize: 12, color: C.textDim, fontFamily: FONT }}>
          Оценка проходимости верхних дыхательных путей (ВДП), обструкции, стридора.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button
            onClick={() =>
              recordStep(
                "a_patency",
                "A",
                "Проходимость ВДП",
                cd?.exam?.includes("стридор") ? "Стридор, выраженная угроза асфиксии" : "ВДП проходимы, западения языка нет",
                false,
                !!cd?.exam?.includes("стридор")
              )
            }
            style={{ padding: "8px 10px", borderRadius: 8, background: results.a_patency ? C.accentDim : C.btnBg, border: `1px solid ${results.a_patency ? C.accent : C.btnBorder}`, color: C.white, cursor: "pointer", fontSize: 11, fontFamily: FONT, textAlign: "left" }}
          >
            🔍 Оценить ВДП
          </button>
          <button
            onClick={() => recordStep("a_suction", "A", "Санация ротоглотки", "Ротоглотка санирована, инородных тел нет", false, false)}
            style={{ padding: "8px 10px", borderRadius: 8, background: results.a_suction ? C.accentDim : C.btnBg, border: `1px solid ${results.a_suction ? C.accent : C.btnBorder}`, color: C.white, cursor: "pointer", fontSize: 11, fontFamily: FONT, textAlign: "left" }}
          >
            🧹 Санация ротоглотки
          </button>
        </div>
      </>
    );
  }

  if (activeTab === "B") {
    return (
      <>
        <div style={{ display: "flex", gap: 10, padding: "8px 10px", borderRadius: 8, background: C.btnBg, border: `1px solid ${C.btnBorder}` }}>
          <div>
            <span style={{ fontSize: 10, color: C.textDim }}>ЧДД: </span>
            <strong style={{ fontSize: 13, fontFamily: CODE, color: ps?.rr > 22 || ps?.rr < 10 ? C.red : C.green }}>
              {ps?.rr != null ? `${ps.rr}/мин` : "—"}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: 10, color: C.textDim }}>SpO2: </span>
            <strong style={{ fontSize: 13, fontFamily: CODE, color: ps?.spo2 < 92 ? C.red : C.green }}>
              {ps?.spo2 != null ? `${ps.spo2}%` : "—"}
            </strong>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button
            onClick={() =>
              recordStep(
                "b_auscult",
                "B",
                "Аускультация легких",
                cd?.exam?.includes("хрип") ? "Выслушиваются рассеянные влажные хрипы" : "Везикулярное дыхание, хрипов нет",
                !!cd?.exam?.includes("хрип"),
                false
              )
            }
            style={{ padding: "8px 10px", borderRadius: 8, background: results.b_auscult ? C.accentDim : C.btnBg, border: `1px solid ${results.b_auscult ? C.accent : C.btnBorder}`, color: C.white, cursor: "pointer", fontSize: 11, fontFamily: FONT, textAlign: "left" }}
          >
            🩺 Аускультация легких
          </button>
          <button
            onClick={() => recordStep("b_symmetry", "B", "Симметричность дыхания", "Грудная клетка симметрично участвует в акте дыхания", false, false)}
            style={{ padding: "8px 10px", borderRadius: 8, background: results.b_symmetry ? C.accentDim : C.btnBg, border: `1px solid ${results.b_symmetry ? C.accent : C.btnBorder}`, color: C.white, cursor: "pointer", fontSize: 11, fontFamily: FONT, textAlign: "left" }}
          >
            👁 Симметричность
          </button>
        </div>
      </>
    );
  }

  return null;
}
