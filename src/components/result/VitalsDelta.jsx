import { FONT, CODE } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";
import { r1 } from "../../engine/patient";

export default function VitalsDelta({ cd, ps, isMobile }) {
  const C = useTheme();
  const { t } = useTranslate();

  const initSbp = parseInt(cd.vitals.bp);
  const vitalDeltas = ps ? [
    { label: t("vitals.sbp"), init: cd.vitals.bp, final: `${Math.round(ps.sbp)}/${Math.round(ps.dbp)}`, delta: Math.round(ps.sbp) - initSbp, warn: ps.sbp < 90 || ps.sbp > 160 },
    { label: t("vitals.hr"), init: cd.vitals.hr, final: Math.round(ps.hr), delta: Math.round(ps.hr) - cd.vitals.hr, warn: ps.hr > 100 || ps.hr < 50 },
    { label: t("vitals.spo2"), init: `${cd.vitals.spo2}%`, final: `${r1(ps.spo2)}%`, delta: r1(ps.spo2 - cd.vitals.spo2), warn: ps.spo2 < 94 },
    { label: t("vitals.rr"), init: cd.vitals.rr, final: Math.round(ps.rr), delta: Math.round(ps.rr) - cd.vitals.rr, warn: ps.rr > 20 },
    { label: t("vitals.gcs"), init: cd.initialGCS ?? 15, final: Math.round(ps.gcs), delta: r1(ps.gcs - (cd.initialGCS ?? 15)), warn: ps.gcs < 10 },
    { label: t("vitals.pain"), init: cd.initialPain ?? 6, final: r1(ps.pain), delta: r1(ps.pain - (cd.initialPain ?? 6)), warn: ps.pain > 7 },
  ] : [];

  if (vitalDeltas.length === 0) return null;

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 10 }}>
      <STitle icon="📈" label={t("result.vitals")} color={C.yellow} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 3}, 1fr)`, gap: isMobile ? 7 : 8 }}>
        {vitalDeltas.map(({ label, init, final, delta, warn }) => {
          const isGood = label === t("vitals.spo2") || label === t("vitals.gcs") ? delta >= 0 : label === t("vitals.pain") ? delta <= 0 : !warn;
          const dColor = isGood ? C.green : (warn ? C.red : C.yellow);
          const fs1 = isMobile ? 10 : 11;
          return (
            <div key={label} style={{ background: C.panel2, border: `1px solid ${warn ? C.red + "44" : C.border}`, borderRadius: 8, padding: isMobile ? "7px 8px" : "8px 10px", textAlign: "center" }}>
              <div style={{ fontSize: fs1, color: C.textDim, textTransform: "uppercase", marginBottom: isMobile ? 3 : 4, fontFamily: FONT }}>{label}</div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: isMobile ? 4 : 6 }}>
                <span style={{ fontSize: isMobile ? 11 : 13, color: C.textDim, fontFamily: CODE }}>{init}</span>
                <span style={{ fontSize: isMobile ? 10 : 11, color: C.textDim }}>→</span>
                <span style={{ fontSize: isMobile ? 13 : 15, fontWeight: 700, color: warn ? C.red : C.accent, fontFamily: CODE }}>{final}</span>
              </div>
              {delta !== 0 && <div style={{ fontSize: isMobile ? 10 : 11, color: dColor, marginTop: 2, fontFamily: CODE }}>{delta > 0 ? "+" : ""}{delta}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Returns raw vitalDeltas array for use in other components (DocLayer etc.) */
export function computeVitalDeltas(cd, ps, t) {
  if (!ps) return [];
  const initSbp = parseInt(cd.vitals.bp);
  return [
    { label: t("vitals.sbp"), init: cd.vitals.bp, final: `${Math.round(ps.sbp)}/${Math.round(ps.dbp)}`, delta: Math.round(ps.sbp) - initSbp, warn: ps.sbp < 90 || ps.sbp > 160 },
    { label: t("vitals.hr"), init: cd.vitals.hr, final: Math.round(ps.hr), delta: Math.round(ps.hr) - cd.vitals.hr, warn: ps.hr > 100 || ps.hr < 50 },
    { label: t("vitals.spo2"), init: `${cd.vitals.spo2}%`, final: `${r1(ps.spo2)}%`, delta: r1(ps.spo2 - cd.vitals.spo2), warn: ps.spo2 < 94 },
    { label: t("vitals.rr"), init: cd.vitals.rr, final: Math.round(ps.rr), delta: Math.round(ps.rr) - cd.vitals.rr, warn: ps.rr > 20 },
    { label: t("vitals.gcs"), init: cd.initialGCS ?? 15, final: Math.round(ps.gcs), delta: r1(ps.gcs - (cd.initialGCS ?? 15)), warn: ps.gcs < 10 },
    { label: t("vitals.pain"), init: cd.initialPain ?? 6, final: r1(ps.pain), delta: r1(ps.pain - (cd.initialPain ?? 6)), warn: ps.pain > 7 },
  ];
}
