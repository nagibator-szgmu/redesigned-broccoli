import React from "react";
import { FONT, CODE } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { formatTime } from "./abcdeEngine";

/** Активный шаг протокола первичного обследования ABCDE */
export default function ABCDEStepTab({ activeTab, cd, ps, results, recordStep }) {
  const C = useTheme();

  const hasSbp = ps?.sbp != null && ps.sbp > 0;
  const hasDbp = ps?.dbp != null && ps.dbp > 0;
  const bpText = hasSbp && hasDbp ? `${ps.sbp}/${ps.dbp}` : hasSbp ? `${ps.sbp}/—` : "---/---";
  const mapText = hasSbp && hasDbp ? `${Math.round((ps.sbp + 2 * ps.dbp) / 3)} мм рт.ст.` : "—";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {activeTab === "A" && (
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
      )}

      {activeTab === "B" && (
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
      )}

      {activeTab === "C" && (
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
              onClick={() => recordStep("c_capillary", "C", "Симптом белого пятна", ps?.sbp < 90 ? "Симптом > 3 сек (тканевая гипоперфузия)" : "Симптом < 2 сек (норма)", ps?.sbp < 90, ps?.sbp < 80)}
              style={{ padding: "8px 10px", borderRadius: 8, background: results.c_capillary ? C.accentDim : C.btnBg, border: `1px solid ${results.c_capillary ? C.accent : C.btnBorder}`, color: C.white, cursor: "pointer", fontSize: 11, fontFamily: FONT, textAlign: "left" }}
            >
              ⏱ Белое пятно
            </button>
            <button
              onClick={() => recordStep("c_periphery", "C", "Пальпация пульса", ps?.sbp < 85 ? "Пульс на лучевых артериях нитевидный" : "Пульс удовлетворительного наполнения", ps?.sbp < 85, ps?.sbp < 75)}
              style={{ padding: "8px 10px", borderRadius: 8, background: results.c_periphery ? C.accentDim : C.btnBg, border: `1px solid ${results.c_periphery ? C.accent : C.btnBorder}`, color: C.white, cursor: "pointer", fontSize: 11, fontFamily: FONT, textAlign: "left" }}
            >
              🖐 Периферический пульс
            </button>
          </div>
        </>
      )}

      {activeTab === "D" && (
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
      )}

      {activeTab === "E" && (
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
      )}

      {/* История действий текущего таба */}
      {Object.values(results).filter((r) => r.section === activeTab).length > 0 && (
        <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
          {Object.values(results)
            .filter((r) => r.section === activeTab)
            .map((s, idx) => (
              <div
                key={idx}
                style={{
                  padding: "6px 8px",
                  borderRadius: 6,
                  background: C.btnBg,
                  border: `1px solid ${s.isCritical ? `${C.red}40` : s.isAbnormal ? `${C.yellow}40` : C.btnBorder}`,
                  fontSize: 11,
                  fontFamily: FONT,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", color: s.isCritical ? C.red : s.isAbnormal ? C.yellow : C.text }}>
                  <strong>{s.action}</strong>
                  <span style={{ fontSize: 9, opacity: 0.7 }}>{formatTime(s.timestamp)}</span>
                </div>
                <div style={{ color: C.textDim, marginTop: 2 }}>{s.details}</div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
