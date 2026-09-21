import React from "react";
import { FONT, CODE } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";

/** Шаг C (Circulation) протокола ABCDE */
export default function ABCDEStepsCirculation({ activeTab, ps, results, recordStep }) {
  const C = useTheme();

  if (activeTab !== "C") return null;

  const hasSbp = ps?.sbp != null && ps.sbp > 0;
  const hasDbp = ps?.dbp != null && ps.dbp > 0;
  const bpText = hasSbp && hasDbp ? `${ps.sbp}/${ps.dbp}` : hasSbp ? `${ps.sbp}/—` : "---/---";
  const mapText = hasSbp && hasDbp ? `${Math.round((ps.sbp + 2 * ps.dbp) / 3)} мм рт.ст.` : "—";

  return (
    <>
      <div style={{ display: "flex", gap: 10, padding: "8px 10px", borderRadius: 8, background: C.btnBg, border: `1px solid ${C.btnBorder}`, flexWrap: "wrap" }}>
        <div>
          <span style={{ fontSize: 10, color: C.textDim }}>АД: </span>
          <strong style={{ fontSize: 13, fontFamily: CODE, color: ps?.sbp < 90 ? C.red : C.white }}>{bpText}</strong>
        </div>
        <div>
          <span style={{ fontSize: 10, color: C.textDim }}>ЧСС: </span>
          <strong style={{ fontSize: 13, fontFamily: CODE, color: ps?.hr > 100 || ps?.hr < 50 ? C.yellow : C.green }}>
            {ps?.hr != null ? `${ps.hr}/мин` : "—"}
          </strong>
        </div>
        <div>
          <span style={{ fontSize: 10, color: C.textDim }}>MAP: </span>
          <strong style={{ fontSize: 13, fontFamily: CODE, color: C.accent }}>{mapText}</strong>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <button
          onClick={() =>
            recordStep(
              "c_capillary",
              "C",
              "Симптом белого пятна",
              ps?.sbp < 90 ? "Симптом > 3 сек (тканевая гипоперфузия)" : "Симптом < 2 сек (норма)",
              ps?.sbp < 90,
              ps?.sbp < 80
            )
          }
          style={{ padding: "8px 10px", borderRadius: 8, background: results.c_capillary ? C.accentDim : C.btnBg, border: `1px solid ${results.c_capillary ? C.accent : C.btnBorder}`, color: C.white, cursor: "pointer", fontSize: 11, fontFamily: FONT, textAlign: "left" }}
        >
          ⏱ Белое пятно
        </button>
        <button
          onClick={() =>
            recordStep(
              "c_periphery",
              "C",
              "Пальпация пульса",
              ps?.sbp < 85 ? "Пульс на лучевых артериях нитевидный" : "Пульс удовлетворительного наполнения",
              ps?.sbp < 85,
              ps?.sbp < 75
            )
          }
          style={{ padding: "8px 10px", borderRadius: 8, background: results.c_periphery ? C.accentDim : C.btnBg, border: `1px solid ${results.c_periphery ? C.accent : C.btnBorder}`, color: C.white, cursor: "pointer", fontSize: 11, fontFamily: FONT, textAlign: "left" }}
        >
          🖐 Периферический пульс
        </button>
      </div>
    </>
  );
}
