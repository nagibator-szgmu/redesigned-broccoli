import React from "react";
import { FONT, CODE } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";

/** Шаги D (Disability) и E (Exposure) протокола ABCDE */
export default function ABCDEStepsDisabilityExposure({ activeTab, cd, ps, results, recordStep }) {
  const C = useTheme();

  if (activeTab === "D") {
    return (
      <>
        <div style={{ display: "flex", gap: 10, padding: "8px 10px", borderRadius: 8, background: C.btnBg, border: `1px solid ${C.btnBorder}` }}>
          <div>
            <span style={{ fontSize: 10, color: C.textDim }}>Шкала Глазго: </span>
            <strong style={{ fontSize: 13, fontFamily: CODE, color: ps?.gcs < 13 ? C.red : C.green }}>
              {ps?.gcs != null ? `${ps.gcs} баллов` : "15"}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: 10, color: C.textDim }}>Боль (NRS): </span>
            <strong style={{ fontSize: 13, fontFamily: CODE, color: ps?.pain > 5 ? C.red : C.yellow }}>
              {ps?.pain != null ? `${ps.pain}/10` : "0/10"}
            </strong>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button
            onClick={() => recordStep("d_pupils", "D", "Зрачковые реакции", "Зрачки D = S, фотореакция сохранена", false, false)}
            style={{ padding: "8px 10px", borderRadius: 8, background: results.d_pupils ? C.accentDim : C.btnBg, border: `1px solid ${results.d_pupils ? C.accent : C.btnBorder}`, color: C.white, cursor: "pointer", fontSize: 11, fontFamily: FONT, textAlign: "left" }}
          >
            👁 Зрачки и фотореакция
          </button>
          <button
            onClick={() => recordStep("d_glucose", "D", "Экспресс-глюкометрия", "Глюкоза крови: 5.6 ммоль/л (норма)", false, false)}
            style={{ padding: "8px 10px", borderRadius: 8, background: results.d_glucose ? C.accentDim : C.btnBg, border: `1px solid ${results.d_glucose ? C.accent : C.btnBorder}`, color: C.white, cursor: "pointer", fontSize: 11, fontFamily: FONT, textAlign: "left" }}
          >
            🩸 Глюкоза крови
          </button>
        </div>
      </>
    );
  }

  if (activeTab === "E") {
    return (
      <>
        <div style={{ display: "flex", gap: 10, padding: "8px 10px", borderRadius: 8, background: C.btnBg, border: `1px solid ${C.btnBorder}` }}>
          <div>
            <span style={{ fontSize: 10, color: C.textDim }}>Температура: </span>
            <strong style={{ fontSize: 13, fontFamily: CODE, color: ps?.temp > 38 ? C.red : C.green }}>
              {ps?.temp != null ? `${ps.temp}°C` : "36.6°C"}
            </strong>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <button
            onClick={() =>
              recordStep(
                "e_skin",
                "E",
                "Осмотр кожи и сыпи",
                cd?.exam?.includes("сыпь") ? "Геморрагическая звездчатая сыпь" : "Кожные покровы чистые, повреждений нет",
                !!cd?.exam?.includes("сыпь"),
                !!cd?.exam?.includes("сыпь")
              )
            }
            style={{ padding: "8px 10px", borderRadius: 8, background: results.e_skin ? C.accentDim : C.btnBg, border: `1px solid ${results.e_skin ? C.accent : C.btnBorder}`, color: C.white, cursor: "pointer", fontSize: 11, fontFamily: FONT, textAlign: "left" }}
          >
            🔍 Кожа и сыпь
          </button>
          <button
            onClick={() =>
              recordStep(
                "e_abdomen",
                "E",
                "Пальпация живота",
                cd?.exam?.includes("живот") ? "Болезненность в правой подвздошной / эпигастрии" : "Живот мягкий, перитонеальных знаков нет",
                !!cd?.exam?.includes("живот"),
                !!cd?.exam?.includes("Щёткин")
              )
            }
            style={{ padding: "8px 10px", borderRadius: 8, background: results.e_abdomen ? C.accentDim : C.btnBg, border: `1px solid ${results.e_abdomen ? C.accent : C.btnBorder}`, color: C.white, cursor: "pointer", fontSize: 11, fontFamily: FONT, textAlign: "left" }}
          >
            🖐 Пальпация живота
          </button>
        </div>
      </>
    );
  }

  return null;
}
