import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";
import { IconPill, IconCheck, IconX, IconSiren } from "../../ui/icons";
import { TREATMENTS, TREAT_FX, ADVERSE_REASONS, TREAT_NOTES } from "../../data/treatments";
import { OUTPATIENT_TREATMENTS_MAP } from "../../data/outpatientTreatments";

export default function TreatmentAnalysis({ cd, selTreat = [], isMobile }) {
  const C = useTheme();
  const { t } = useTranslate();
  const isOutpatient = cd?.department === "outpatient";
  const safeSelTreat = selTreat || [];

  const needTreatList = cd?.needTreat || [];
  const missedTreat = needTreatList.filter((id) => !safeSelTreat.includes(id));
  const wrongGiven = (cd?.wrongTreat || []).filter((id) => safeSelTreat.includes(id));
  const correctRouteOpt = cd?.routeOptions?.find((o) => o.id === cd.correctRoute);
  const isTreatOutpatient = !isOutpatient || cd?.correctRoute === "treat_outpatient";

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 10 }}>
      <STitle icon={<IconPill size={15} color={C.green} />} label={t("result.treatAnalysis")} color={C.green} />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 8 : 12 }}>
        <div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: C.textDim, marginBottom: isMobile ? 5 : 6, textTransform: "uppercase", fontFamily: FONT }}>
            {isOutpatient ? t("result.recommendedOutpatient") : t("result.required")}
          </div>

          {!isTreatOutpatient && (
            <div style={{ padding: "8px 10px", borderRadius: 8, background: `${C.accent}12`, border: `1px solid ${C.accent}33`, marginBottom: 8 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: C.accent, fontFamily: FONT, marginBottom: 4 }}>
                {correctRouteOpt?.label || t("result.routeDefaultLabel")}
              </div>
              <div style={{ fontSize: 11.5, color: C.text, lineHeight: 1.5, fontFamily: FONT }}>
                {correctRouteOpt?.reason || t("result.routeDefaultReason")}
              </div>
            </div>
          )}

          {isTreatOutpatient && needTreatList.length === 0 && (
            <div style={{ padding: "8px 10px", borderRadius: 8, background: `${C.green}12`, border: `1px solid ${C.green}33`, marginBottom: 8 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: C.green, fontFamily: FONT, display: "flex", alignItems: "center", gap: 6 }}>
                <IconCheck size={14} color={C.green} />
                <span>{t("result.noMedsRequired")}</span>
              </div>
              <div style={{ fontSize: 11.5, color: C.textDim, lineHeight: 1.5, fontFamily: FONT, marginTop: 3 }}>
                {t("result.noMedsLifestyle")}
              </div>
            </div>
          )}

          {isTreatOutpatient && needTreatList.map((id) => {
            const given = safeSelTreat.includes(id);
            const name = (isOutpatient ? OUTPATIENT_TREATMENTS_MAP[id]?.name : null) || TREATMENTS.find((t) => t.id === id)?.name || id;
            const fx = TREAT_FX[id];
            const note = cd?.treatNotes?.[id] || TREAT_NOTES[id];
            const itemBg = given ? `${C.green}10` : `${C.red}10`;
            const itemBorder = given ? `${C.green}22` : `${C.red}22`;
            const itemColor = given ? C.green : C.red;
            return (
              <div key={id} style={{ marginBottom: isMobile ? 7 : 8, padding: "6px 8px", borderRadius: 7, background: itemBg, border: `1px solid ${itemBorder}` }}>
                <div style={{ fontSize: 13, color: itemColor, lineHeight: 1.4, fontFamily: FONT, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  {given ? <IconCheck size={13} color={C.green} /> : <IconX size={13} color={C.red} />}
                  <span>{name}</span>
                  {given && fx && <span style={{ fontSize: 11, color: C.green, marginLeft: isMobile ? 2 : 4, fontWeight: 400 }}>→ {fx.desc}</span>}
                </div>
                {note && <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.5, fontFamily: FONT, marginTop: 3 }}>{note}</div>}
              </div>
            );
          })}

          {isTreatOutpatient && needTreatList.length > 0 && missedTreat.length === 0 && (
            <div style={{ color: C.green, fontSize: 12, marginTop: 4, fontFamily: FONT }}>{t("result.allRequired")}</div>
          )}
        </div>

        <div>
          {wrongGiven.length > 0 && (
            <>
              <div style={{ fontSize: isMobile ? 11 : 12, color: C.red, marginBottom: isMobile ? 5 : 6, textTransform: "uppercase", fontFamily: FONT }}>{t("result.dangerousLabel")}</div>
              {wrongGiven.map((id) => {
                const name = (isOutpatient ? OUTPATIENT_TREATMENTS_MAP[id]?.name : null) || TREATMENTS.find((t) => t.id === id)?.name || id;
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
