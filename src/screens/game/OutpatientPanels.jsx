import { useState } from "react";
import { FONT, CODE } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";

export const ROUTE_ICONS = {
  treat_outpatient: "💊",
  refer_specialist: "👨‍⚕️",
  refer_hospitalization: "🏥",
  call_ems: "🚑",
  stationary: "🏥",
  icu: "🫀",
  home: "🏠",
  urgent_surgery: "🔪",
};

export { TestSelection, ResultsPanel, RouteSelection } from "./OutpatientPanelsExtra";

/** Patient vitals card with examination flow (FR-С.2–FR-С.4) */
export function PatientCard({ cd, examinedVitals = [], setExaminedVitals }) {
  const C = useTheme();
  const { t } = useTranslate();
  const [showExamModal, setShowExamModal] = useState(false);
  const [pendingExam, setPendingExam] = useState([]);

  const VITAL_ITEMS = [
    { id: "bp", label: t("vitals.sbp"), value: cd.vitals.bp, unit: "мм рт.ст." },
    { id: "hr", label: t("vitals.hr"), value: cd.vitals.hr, unit: " уд/мин" },
    { id: "rr", label: t("vitals.rr"), value: cd.vitals.rr, unit: "/мин" },
    { id: "temp", label: t("vitals.temp"), value: cd.vitals.temp, unit: "°C" },
    { id: "spo2", label: t("vitals.spo2"), value: cd.vitals.spo2, unit: "%" },
  ];

  const togglePending = (id) => {
    if (examinedVitals.includes(id)) return;
    setPendingExam(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const confirmExam = () => {
    setExaminedVitals(prev => {
      const existing = new Set(prev);
      const newOnes = pendingExam.filter(id => !existing.has(id));
      return [...prev, ...newOnes];
    });
    setShowExamModal(false);
    setPendingExam([]);
  };

  const openExamModal = () => {
    setPendingExam([]);
    setShowExamModal(true);
  };

  const headerPart = (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.accent}15`, border: `1px solid ${C.accent}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 16 }}>🏥</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: FONT }}>{cd.name}</div>
          <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT }}>{cd.age} {t("cases.ageSuffix")} · {cd.gender} · {t("department.outpatient")}</div>
        </div>
        <span style={{ background: `${C.accent}20`, border: `1px solid ${C.accent}44`, borderRadius: 5, padding: "2px 8px", fontSize: 10, color: C.accent, fontWeight: 700, fontFamily: FONT }}>{t("outpatient.appointment")}</span>
      </div>
      <div style={{ fontSize: 12, color: C.text, fontFamily: FONT, lineHeight: 1.5, marginBottom: 10, padding: "8px 10px", background: `${C.textDim}08`, borderRadius: 8, borderLeft: `3px solid ${C.accent}` }}>{cd.complaint}</div>
    </>
  );

  const examModal = (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowExamModal(false)}>
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, minWidth: 300, maxWidth: 400, maxHeight: "80vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: FONT, marginBottom: 12 }}>{t("outpatient.examSelect")}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {VITAL_ITEMS.map(({ id, label }) => {
            const alreadyExamined = examinedVitals.includes(id);
            const isSelected = pendingExam.includes(id) || alreadyExamined;
            return (
              <div key={id} onClick={() => !alreadyExamined && togglePending(id)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: alreadyExamined ? "default" : "pointer", background: isSelected ? `${C.accent}15` : "transparent", border: `1px solid ${isSelected ? C.accent : C.border}`, opacity: alreadyExamined ? 0.6 : 1 }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${isSelected ? C.accent : C.textDim}`, background: isSelected ? C.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {isSelected && <span style={{ fontSize: 10, color: C.bg, fontWeight: 900 }}>✓</span>}
                </div>
                <span style={{ fontSize: 12, color: C.text, fontFamily: FONT, flex: 1 }}>{label}</span>
                {alreadyExamined && <span style={{ fontSize: 10, color: C.green, fontFamily: FONT }}>{t("outpatient.measured")}</span>}
              </div>
            );
          })}
        </div>
        <button onClick={confirmExam} disabled={pendingExam.length === 0}
          style={{ width: "100%", marginTop: 12, padding: "10px", borderRadius: 10, background: pendingExam.length > 0 ? `linear-gradient(135deg,${C.accent},${C.green})` : `${C.textDim}30`, border: "none", fontSize: 13, fontWeight: 700, color: pendingExam.length > 0 ? C.bg : C.textDim, cursor: pendingExam.length > 0 ? "pointer" : "not-allowed", fontFamily: FONT }}>
          {t("outpatient.examConfirm")}
        </button>
      </div>
    </div>
  );

  if (examinedVitals.length === 0) {
    return (
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
        {headerPart}
        <button onClick={openExamModal}
          style={{ width: "100%", padding: "14px", borderRadius: 12, background: `linear-gradient(135deg,${C.accent},${C.green})`, border: "none", fontSize: 14, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT }}>
          {t("outpatient.examButton")}
        </button>
        {showExamModal && examModal}
      </div>
    );
  }

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
      {headerPart}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {VITAL_ITEMS.filter(v => examinedVitals.includes(v.id)).map(({ id, label, value, unit }) => {
          const warn = (id === "hr" && (value > 100 || value < 50)) ||
            (id === "spo2" && value < 94) ||
            (id === "temp" && value > 37.5);
          return (
            <div key={id} style={{ padding: "6px 12px", borderRadius: 8, background: warn ? `${C.red}10` : `${C.textDim}08`, border: `1px solid ${warn ? `${C.red}33` : C.border}`, textAlign: "center", minWidth: 60 }}>
              <div style={{ fontSize: 9, color: C.textDim, fontFamily: FONT, textTransform: "uppercase" }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: warn ? C.red : C.white, fontFamily: CODE }}>{value}{unit}</div>
            </div>
          );
        })}
      </div>
      {examinedVitals.length < VITAL_ITEMS.length && (
        <button onClick={openExamModal}
          style={{ width: "100%", padding: "10px", borderRadius: 10, background: "transparent", border: `1px dashed ${C.accent}`, fontSize: 12, fontWeight: 600, color: C.accent, cursor: "pointer", fontFamily: FONT }}>
          {t("outpatient.examAdd")}
        </button>
      )}
      {showExamModal && examModal}
    </div>
  );
}

/** Anamnesis + examination panel with clickable anamnesis buttons (FR-Р.2.1/Р.2.2) */
export function HistoryPanel({ cd, onReveal }) {
  const C = useTheme();
  const { t } = useTranslate();
  const [showIllness, setShowIllness] = useState(false);
  const [showLife, setShowLife] = useState(false);

  const handleReveal = (type) => {
    if (type === "illness" && !showIllness) {
      setShowIllness(true);
      onReveal && onReveal("historyOfIllness");
    }
    if (type === "life" && !showLife) {
      setShowLife(true);
      onReveal && onReveal("lifeHistory");
    }
  };

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 12 }}>
      {cd.historyOfIllness && (
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => handleReveal("illness")}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, border: `1px solid ${showIllness ? C.green : C.border}`, background: showIllness ? `${C.green}10` : "transparent", cursor: "pointer", fontFamily: FONT }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: showIllness ? C.green : C.accent }}>{t("history.illness")}</span>
            <span style={{ fontSize: 12, color: showIllness ? C.green : C.textDim }}>{showIllness ? "▼" : "▶"}</span>
          </button>
          {showIllness && (
            <p style={{ fontSize: 13, color: C.text, fontFamily: FONT, lineHeight: 1.7, margin: 0, padding: "10px 14px", background: `${C.textDim}08`, borderRadius: 10, borderLeft: `3px solid ${C.green}`, marginTop: 8 }}>{cd.historyOfIllness}</p>
          )}
        </div>
      )}
      {cd.lifeHistory && (
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => handleReveal("life")}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, border: `1px solid ${showLife ? C.green : C.border}`, background: showLife ? `${C.green}10` : "transparent", cursor: "pointer", fontFamily: FONT }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: showLife ? C.green : C.accent }}>{t("history.life")}</span>
            <span style={{ fontSize: 12, color: showLife ? C.green : C.textDim }}>{showLife ? "▼" : "▶"}</span>
          </button>
          {showLife && (
            <p style={{ fontSize: 13, color: C.text, fontFamily: FONT, lineHeight: 1.7, margin: 0, padding: "10px 14px", background: `${C.textDim}08`, borderRadius: 10, borderLeft: `3px solid ${C.green}`, marginTop: 8 }}>{cd.lifeHistory}</p>
          )}
        </div>
      )}
      <div style={{ fontSize: 12, fontWeight: 600, color: C.accent, fontFamily: FONT, marginBottom: 8 }}>{t("history.exam")}</div>
      <p style={{ fontSize: 13, color: C.text, fontFamily: FONT, lineHeight: 1.7, margin: 0 }}>{cd.exam}</p>
    </div>
  );
}

/** Step indicator bar */
export function StepBar({ steps, activeStep }) {
  const C = useTheme();
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
      {steps.map((s, i) => (
        <div key={s.key} style={{ flex: 1, padding: "8px 6px", borderRadius: 8, background: i === activeStep ? `${C.accent}15` : "transparent", border: `1px solid ${i === activeStep ? C.accent : C.border}`, textAlign: "center", cursor: i <= activeStep ? "pointer" : "default", opacity: i > activeStep ? 0.4 : 1 }}>
          <div style={{ fontSize: 12 }}>{s.icon}</div>
          <div style={{ fontSize: 10, color: i === activeStep ? C.accent : C.textDim, fontFamily: FONT, marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/** Structured diagnosis input form */
export function DiagnosisForm({ diagMain, setDiagMain, diagComplication, setDiagComplication, diagComorbidity, setDiagComorbidity }) {
  const C = useTheme();
  const { t } = useTranslate();
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, fontFamily: FONT, marginBottom: 10 }}>{t("outpatient.structuredDiag")}</div>
      {[
        { label: t("outpatient.mainDiag"), value: diagMain, set: setDiagMain, placeholder: t("outpatient.mainDiagPlaceholder") },
        { label: t("outpatient.complication"), value: diagComplication, set: setDiagComplication, placeholder: t("outpatient.complicationPlaceholder") },
        { label: t("outpatient.comorbidity"), value: diagComorbidity, set: setDiagComorbidity, placeholder: t("outpatient.comorbidityPlaceholder") },
      ].map(({ label, value, set, placeholder }) => (
        <div key={label} style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, marginBottom: 4 }}>{label}</div>
          <input value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bgGrad, color: C.white, fontSize: 13, fontFamily: FONT, outline: "none", boxSizing: "border-box" }} />
        </div>
      ))}
    </div>
  );
}
