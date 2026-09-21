import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";

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
