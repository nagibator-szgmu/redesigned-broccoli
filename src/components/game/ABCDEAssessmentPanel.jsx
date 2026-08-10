import React, { useState, useMemo } from "react";
import { useTheme } from "../../ui/ThemeContext";
import { FONT, CODE } from "../../ui/theme";

const STATUS_CONFIG = {
  NOT_ASSESSED: { label: "НЕ ОЦЕНЕНО", bg: "rgba(120,130,140,0.15)", text: "#94a3b8", border: "rgba(148,163,184,0.3)" },
  ASSESSED: { label: "НОРМА", bg: "rgba(0,230,160,0.12)", text: "#00e5a0", border: "rgba(0,230,160,0.35)" },
  ABNORMAL: { label: "ОТКЛОНЕНИЕ", bg: "rgba(245,200,66,0.12)", text: "#f5c842", border: "rgba(245,200,66,0.35)" },
  CRITICAL: { label: "КРИТИЧНО", bg: "rgba(255,61,90,0.15)", text: "#ff3d5a", border: "rgba(255,61,90,0.4)" },
};

function formatTime(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

export default function ABCDEAssessmentPanel({ cd, ps, addEvent }) {
  const C = useTheme();
  const [activeTab, setActiveTab] = useState("A");
  const [results, setResults] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const recordStep = (stepKey, section, actionName, details, isAbnormal = false, isCritical = false) => {
    const now = Date.now();
    const entry = { key: stepKey, section, action: actionName, details, timestamp: now, isAbnormal, isCritical };
    setResults(prev => ({ ...prev, [stepKey]: entry }));
    if (addEvent) {
      addEvent(`[ABCDE ${section}] ${actionName}: ${details}`, isCritical ? "danger" : isAbnormal ? "warn" : "result");
    }
  };

  const statuses = useMemo(() => {
    const res = { A: "NOT_ASSESSED", B: "NOT_ASSESSED", C: "NOT_ASSESSED", D: "NOT_ASSESSED", E: "NOT_ASSESSED" };
    const stepKeys = Object.keys(results);

    // Section A
    if (stepKeys.some(k => k.startsWith("a_"))) {
      res.A = cd?.exam?.includes("стридор") || cd?.complaint?.includes("удушье") ? "CRITICAL" : "ASSESSED";
    }
    // Section B
    if (stepKeys.some(k => k.startsWith("b_"))) {
      if ((ps?.spo2 != null && ps.spo2 < 90) || (ps?.rr != null && (ps.rr < 8 || ps.rr > 30))) res.B = "CRITICAL";
      else if ((ps?.spo2 != null && ps.spo2 < 94) || (ps?.rr != null && (ps.rr < 12 || ps.rr > 22))) res.B = "ABNORMAL";
      else res.B = "ASSESSED";
    }
    // Section C
    if (stepKeys.some(k => k.startsWith("c_"))) {
      if ((ps?.sbp != null && ps.sbp > 0 && ps.sbp < 80) || (ps?.hr != null && (ps.hr > 140 || (ps.hr > 0 && ps.hr < 40)))) res.C = "CRITICAL";
      else if ((ps?.sbp != null && ps.sbp > 0 && ps.sbp < 90) || (ps?.hr != null && (ps.hr > 100 || (ps.hr > 0 && ps.hr < 50)))) res.C = "ABNORMAL";
      else res.C = "ASSESSED";
    }
    // Section D
    if (stepKeys.some(k => k.startsWith("d_"))) {
      if (ps?.gcs != null && ps.gcs <= 8) res.D = "CRITICAL";
      else if ((ps?.gcs != null && ps.gcs < 15) || (ps?.pain != null && ps.pain >= 7)) res.D = "ABNORMAL";
      else res.D = "ASSESSED";
    }
    // Section E
    if (stepKeys.some(k => k.startsWith("e_"))) {
      if ((ps?.temp != null && (ps.temp > 39.5 || ps.temp < 35.0)) || cd?.exam?.includes("перитонит")) res.E = "CRITICAL";
      else if ((ps?.temp != null && (ps.temp > 38.0 || ps.temp < 36.0)) || cd?.exam?.includes("сыпь")) res.E = "ABNORMAL";
      else res.E = "ASSESSED";
    }
    return res;
  }, [results, cd, ps]);

  const criticalFindings = useMemo(() => {
    return Object.values(results).filter(r => r.isCritical || r.isAbnormal);
  }, [results]);

  const tabs = [
    { key: "A", label: "A — Airway", title: "Дыхательные пути" },
    { key: "B", label: "B — Breathing", title: "Дыхание" },
    { key: "C", label: "C — Circulation", title: "Кровообращение" },
    { key: "D", label: "D — Disability", title: "Неврология" },
    { key: "E", label: "E — Exposure", title: "Осмотр тела" },
  ];

  const hasSbp = ps?.sbp != null && ps.sbp > 0;
  const hasDbp = ps?.dbp != null && ps.dbp > 0;
  const bpText = hasSbp && hasDbp ? `${ps.sbp}/${ps.dbp}` : hasSbp ? `${ps.sbp}/—` : "---/---";
  const mapText = hasSbp && hasDbp ? `${Math.round((ps.sbp + 2 * ps.dbp) / 3)} мм рт.ст.` : "—";

  return (
    <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Top Header with Summary Toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
        <div style={{ fontSize: 11, color: C.accent, fontWeight: 700, fontFamily: FONT, letterSpacing: 0.8, textTransform: "uppercase" }}>
          Первичный осмотр ABCDE
        </div>
        <button
          onClick={() => setShowSummary(prev => !prev)}
          style={{
            padding: "3px 8px",
            borderRadius: 6,
            background: showSummary ? `${C.accent}22` : C.btnBg,
            border: `1px solid ${showSummary ? C.accent : C.btnBorder}`,
            color: showSummary ? C.accent : C.textDim,
            fontSize: 10,
            fontFamily: FONT,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {showSummary ? "← К шагам" : "📋 Сводка ABCDE"}
        </button>
      </div>

      {/* Tabs Row with Visual Badges */}
      <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.key && !showSummary;
          const st = STATUS_CONFIG[statuses[tab.key]];
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setShowSummary(false); }}
              style={{
                flex: 1,
                minWidth: 54,
                padding: "6px 4px",
                borderRadius: 8,
                background: isActive ? `${C.accent}1c` : C.btnBg,
                border: `1px solid ${isActive ? C.accent : C.btnBorder}`,
                color: isActive ? C.accent : C.text,
                fontSize: 11,
                fontFamily: FONT,
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <span>{tab.key}</span>
              <span style={{ fontSize: 8, padding: "1px 4px", borderRadius: 4, background: st.bg, color: st.text, border: `1px solid ${st.border}`, whiteSpace: "nowrap" }}>
                {st.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Summary View Mode */}
      {showSummary ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, fontFamily: FONT }}>
          <div style={{ fontWeight: 600, color: C.white, borderBottom: `1px solid ${C.border}`, paddingBottom: 4 }}>
            Клинический протокол первичного осмотра (Summary):
          </div>
          {tabs.map(t => {
            const st = STATUS_CONFIG[statuses[t.key]];
            const sectionSteps = Object.values(results).filter(r => r.section === t.key);
            return (
              <div key={t.key} style={{ padding: "6px 8px", borderRadius: 8, background: C.btnBg, border: `1px solid ${C.btnBorder}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <strong>{t.label}: {t.title}</strong>
                  <span style={{ fontSize: 9, padding: "1px 4px", borderRadius: 4, background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
                    {st.label}
                  </span>
                </div>
                {sectionSteps.length > 0 ? (
                  sectionSteps.map((s, i) => (
                    <div key={i} style={{ fontSize: 11, color: s.isCritical ? C.red : s.isAbnormal ? C.yellow : C.textDim }}>
                      • {s.action}: {s.details} <span style={{ fontSize: 9, opacity: 0.7 }}>({formatTime(s.timestamp)})</span>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: 10, color: C.textDim, fontStyle: "italic" }}>Действия не выполнялись</div>
                )}
              </div>
            );
          })}
          {criticalFindings.length > 0 && (
            <div style={{ marginTop: 4, padding: "8px", borderRadius: 8, background: "rgba(255,61,90,0.1)", border: `1px solid rgba(255,61,90,0.3)` }}>
              <div style={{ color: C.red, fontWeight: 700, fontSize: 11, marginBottom: 4 }}>⚠️ Выявленные критические находки:</div>
              {criticalFindings.map((f, idx) => (
                <div key={idx} style={{ fontSize: 11, color: C.white, marginBottom: 2 }}>
                  • [{f.section}] {f.action} — {f.details}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Sequential Active Tab Content */
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {activeTab === "A" && (
            <>
              <div style={{ fontSize: 12, color: C.textDim, fontFamily: FONT }}>
                Оценка проходимости верхних дыхательных путей (ВДП), обструкции, стридора.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button
                  onClick={() => recordStep("a_patency", "A", "Проходимость ВДП", cd?.exam?.includes("стридор") ? "Стридор, выраженная угроза асфиксии" : "ВДП проходимы, западения языка нет", false, !!cd?.exam?.includes("стридор"))}
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
                  onClick={() => recordStep("b_auscult", "B", "Аускультация легких", cd?.exam?.includes("хрип") ? "Выслушиваются рассеянные влажные хрипы" : "Везикулярное дыхание, хрипов нет", !!cd?.exam?.includes("хрип"), false)}
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
                  onClick={() => recordStep("e_skin", "E", "Осмотр кожи и сыпи", cd?.exam?.includes("сыпь") ? "Геморрагическая звездчатая сыпь" : "Кожные покровы чистые, повреждений нет", !!cd?.exam?.includes("сыпь"), !!cd?.exam?.includes("сыпь"))}
                  style={{ padding: "8px 10px", borderRadius: 8, background: results.e_skin ? C.accentDim : C.btnBg, border: `1px solid ${results.e_skin ? C.accent : C.btnBorder}`, color: C.white, cursor: "pointer", fontSize: 11, fontFamily: FONT, textAlign: "left" }}
                >
                  🔍 Кожа и сыпь
                </button>
                <button
                  onClick={() => recordStep("e_abdomen", "E", "Пальпация живота", cd?.exam?.includes("живот") ? "Болезненность в правой подвздошной / эпигастрии" : "Живот мягкий, перитонеальных знаков нет", !!cd?.exam?.includes("живот"), !!cd?.exam?.includes("Щёткин"))}
                  style={{ padding: "8px 10px", borderRadius: 8, background: results.e_abdomen ? C.accentDim : C.btnBg, border: `1px solid ${results.e_abdomen ? C.accent : C.btnBorder}`, color: C.white, cursor: "pointer", fontSize: 11, fontFamily: FONT, textAlign: "left" }}
                >
                  🖐 Пальпация живота
                </button>
              </div>
            </>
          )}

          {/* Action History for Current Tab */}
          {Object.values(results).filter(r => r.section === activeTab).length > 0 && (
            <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
              {Object.values(results).filter(r => r.section === activeTab).map((s, idx) => (
                <div key={idx} style={{ padding: "6px 8px", borderRadius: 6, background: C.btnBg, border: `1px solid ${s.isCritical ? `${C.red}40` : s.isAbnormal ? `${C.yellow}40` : C.btnBorder}`, fontSize: 11, fontFamily: FONT }}>
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
      )}
    </div>
  );
}
