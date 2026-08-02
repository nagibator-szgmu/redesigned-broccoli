import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";
import { TREATMENTS, TREAT_FX, ADVERSE_REASONS, TREAT_NOTES } from "../../data/treatments";

export default function TreatmentAnalysis({ cd, selTreat, isMobile }) {
  const C = useTheme();
  const { t } = useTranslate();

  const missedTreat = cd.needTreat.filter(id => !selTreat.includes(id));
  const wrongGiven = cd.wrongTreat.filter(id => selTreat.includes(id));

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 10 }}>
      <STitle icon="💊" label={t("result.treatAnalysis")} color={C.green} />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 8 : 12 }}>
        <div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: C.textDim, marginBottom: isMobile ? 5 : 6, textTransform: "uppercase", fontFamily: FONT }}>{t("result.required")}</div>
          {cd.needTreat.map(id => {
            const given = selTreat.includes(id);
            const name = TREATMENTS.find(t => t.id === id)?.name || id;
            const fx = TREAT_FX[id];
            const note = TREAT_NOTES[id];
            return (
              <div key={id} style={{ marginBottom: isMobile ? 7 : 8, padding: "6px 8px", borderRadius: 7, background: given ? `${C.green}10` : `${C.red}10`, border: `1px solid ${given ? C.green : C.red}22` }}>
                <div style={{ fontSize: 13, color: given ? C.green : C.red, lineHeight: 1.4, fontFamily: FONT, fontWeight: 600 }}>
                  {given ? "✓" : "✗"} {name}
                  {given && fx && <span style={{ fontSize: 11, color: C.green, marginLeft: isMobile ? 5 : 6, fontWeight: 400 }}>→ {fx.desc}</span>}
                </div>
                {note && <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.5, fontFamily: FONT, marginTop: 3 }}>{note}</div>}
              </div>
            );
          })}
          {missedTreat.length === 0 && <div style={{ color: C.green, fontSize: 12, marginTop: 4, fontFamily: FONT }}>{t("result.allRequired")}</div>}
        </div>
        <div>
          {wrongGiven.length > 0 && (
            <>
              <div style={{ fontSize: isMobile ? 11 : 12, color: C.red, marginBottom: isMobile ? 5 : 6, textTransform: "uppercase", fontFamily: FONT }}>{t("result.dangerousLabel")}</div>
              {wrongGiven.map(id => {
                const name = TREATMENTS.find(t => t.id === id)?.name || id;
                const reason = ADVERSE_REASONS[id];
                return (
                  <div key={id} style={{ background: C.redDim, border: `1px solid ${C.red}55`, borderRadius: 6, padding: "8px 10px", marginBottom: 8 }}>
                    <div style={{ fontSize: 13, color: C.red, fontWeight: 700, marginBottom: 4, fontFamily: FONT }}>🚨 {name}</div>
                    {reason && <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6, fontFamily: FONT }}>{reason}</div>}
                    {!reason && <div style={{ fontSize: 12, color: C.text, fontFamily: FONT }}>{t("result.contraindicatedLabel")}</div>}
                  </div>
                );
              })}
            </>
          )}
          {wrongGiven.length === 0 && <div style={{ color: C.green, fontSize: isMobile ? 12 : 13, fontFamily: FONT }}>{t("result.noDangerous")}</div>}
        </div>
      </div>
    </div>
  );
}
