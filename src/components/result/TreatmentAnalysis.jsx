import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";
import { IconPill, IconCheck, IconX, IconSiren } from "../../ui/icons";
import { TREATMENTS, TREAT_FX, ADVERSE_REASONS, TREAT_NOTES } from "../../data/treatments";

export default function TreatmentAnalysis({ cd, selTreat = [], isMobile }) {
  const C = useTheme();
  const { t } = useTranslate();
  const isOutpatient = cd?.department === "outpatient";
  const safeSelTreat = selTreat || [];

  const missedTreat = (cd?.needTreat || []).filter(id => !safeSelTreat.includes(id));
  const wrongGiven = (cd?.wrongTreat || []).filter(id => safeSelTreat.includes(id));

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 10 }}>
      <STitle icon={<IconPill size={15} color={C.green} />} label={t("result.treatAnalysis")} color={C.green} />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 8 : 12 }}>
        <div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: C.textDim, marginBottom: isMobile ? 5 : 6, textTransform: "uppercase", fontFamily: FONT }}>
            {isOutpatient ? t("result.recommendedOutpatient") : t("result.required")}
          </div>
          {(cd?.needTreat || []).map(id => {
            const given = safeSelTreat.includes(id);
            const name = TREATMENTS.find(t => t.id === id)?.name || id;
            const fx = TREAT_FX[id];
            const note = cd?.treatNotes?.[id] || TREAT_NOTES[id];
            const itemBg = isOutpatient ? `${C.accent}10` : given ? `${C.green}10` : `${C.red}10`;
            const itemBorder = isOutpatient ? `${C.accent}22` : given ? `${C.green}22` : `${C.red}22`;
            const itemColor = isOutpatient ? C.accent : given ? C.green : C.red;
            return (
              <div key={id} style={{ marginBottom: isMobile ? 7 : 8, padding: "6px 8px", borderRadius: 7, background: itemBg, border: `1px solid ${itemBorder}` }}>
                <div style={{ fontSize: 13, color: itemColor, lineHeight: 1.4, fontFamily: FONT, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  {isOutpatient ? <IconPill size={13} color={C.accent} /> : given ? <IconCheck size={13} color={C.green} /> : <IconX size={13} color={C.red} />}
                  <span>{name}</span>
                  {given && fx && <span style={{ fontSize: 11, color: C.green, marginLeft: isMobile ? 2 : 4, fontWeight: 400 }}>→ {fx.desc}</span>}
                </div>
                {note && <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.5, fontFamily: FONT, marginTop: 3 }}>{note}</div>}
              </div>
            );
          })}
          {isOutpatient && (
            <div style={{ color: C.textDim, fontSize: 11, marginTop: 4, fontFamily: FONT }}>
              {t("result.outpatientStandard")}
            </div>
          )}
          {!isOutpatient && missedTreat.length === 0 && (
            <div style={{ color: C.green, fontSize: 12, marginTop: 4, fontFamily: FONT }}>{t("result.allRequired")}</div>
          )}
        </div>
        <div>
          {wrongGiven.length > 0 && (
            <>
              <div style={{ fontSize: isMobile ? 11 : 12, color: C.red, marginBottom: isMobile ? 5 : 6, textTransform: "uppercase", fontFamily: FONT }}>{t("result.dangerousLabel")}</div>
              {wrongGiven.map(id => {
                const name = TREATMENTS.find(t => t.id === id)?.name || id;
                const reason = cd?.adverseReasons?.[id] || ADVERSE_REASONS[id];
                return (
                  <div key={id} style={{ background: C.redDim, border: `1px solid ${C.red}55`, borderRadius: 6, padding: "8px 10px", marginBottom: 8 }}>
                    <div style={{ fontSize: 13, color: C.red, fontWeight: 700, marginBottom: 4, fontFamily: FONT, display: "flex", alignItems: "center", gap: 6 }}>
                      <IconSiren size={14} color={C.red} />
                      <span>{name}</span>
                    </div>
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
