import { FONT, CODE } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";
import { TREATMENTS } from "../../data/treatments";

export default function DocLayer({ cd, extraResult, vitalDeltas, selTreat, isMobile }) {
  const C = useTheme();
  const { t } = useTranslate();

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 10 }}>
      <STitle icon="📄" label={t("docLayer.title")} color={C.accent} />
      {cd.department === "outpatient" && <OutpatientDoc cd={cd} extraResult={extraResult} C={C} t={t} isMobile={isMobile} />}
      {cd.department === "stationary" && <StationaryDoc cd={cd} extraResult={extraResult} C={C} t={t} isMobile={isMobile} />}
      {cd.department === "emergency" && <EmergencyDoc vitalDeltas={vitalDeltas} selTreat={selTreat} C={C} t={t} isMobile={isMobile} />}
    </div>
  );
}

function OutpatientDoc({ cd, extraResult, C, t, isMobile }) {
  const fields = [
    { label: t("docLayer.complaints"), value: cd.complaint },
    { label: t("docLayer.anamnesis"), value: cd.anamnesis },
    { label: t("docLayer.objective"), value: cd.exam },
  ].filter(x => x.value);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: isMobile ? 11 : 12, color: C.accent, fontWeight: 600, fontFamily: FONT }}>{t("docLayer.ambCard")}</div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 6 : 8 }}>
        {fields.map(({ label, value }) => (
          <div key={label} style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 8px" }}>
            <div style={{ fontSize: isMobile ? 9 : 10, color: C.textDim, textTransform: "uppercase", marginBottom: 2, fontFamily: FONT }}>{label}</div>
            <div style={{ fontSize: isMobile ? 11 : 12, color: C.text, fontFamily: FONT, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: isMobile ? 2 : 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{value}</div>
          </div>
        ))}
        <div style={{ background: `${C.green}0a`, border: `1px solid ${C.green}33`, borderRadius: 6, padding: "6px 8px" }}>
          <div style={{ fontSize: isMobile ? 9 : 10, color: C.textDim, textTransform: "uppercase", marginBottom: 2, fontFamily: FONT }}>{t("docLayer.diagnosisLabel")}</div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: C.green, fontWeight: 600, fontFamily: FONT }}>{cd.diagnosis}</div>
        </div>
        {extraResult?.selectedRoute && (
          <div style={{ background: `${C.accent}0a`, border: `1px solid ${C.accent}33`, borderRadius: 6, padding: "6px 8px" }}>
            <div style={{ fontSize: isMobile ? 9 : 10, color: C.textDim, textTransform: "uppercase", marginBottom: 2, fontFamily: FONT }}>{t("docLayer.routing")}</div>
            <div style={{ fontSize: isMobile ? 11 : 12, color: C.accent, fontWeight: 600, fontFamily: FONT }}>{extraResult.routeOptions?.find(o => o.id === extraResult.selectedRoute)?.label || extraResult.selectedRoute}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function StationaryDoc({ cd, extraResult, C, t, isMobile }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: isMobile ? 11 : 12, color: C.accent, fontWeight: 600, fontFamily: FONT }}>{t("docLayer.hospHistory")}</div>
      <div style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 8px" }}>
        <div style={{ fontSize: isMobile ? 9 : 10, color: C.textDim, textTransform: "uppercase", marginBottom: 2, fontFamily: FONT }}>{t("docLayer.admission")}</div>
        <div style={{ fontSize: isMobile ? 11 : 12, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>{cd.diagnosis}</div>
      </div>
      {extraResult?.dayHistory?.length > 0 && (
        <div style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 8px" }}>
          <div style={{ fontSize: isMobile ? 9 : 10, color: C.textDim, textTransform: "uppercase", marginBottom: isMobile ? 2 : 3, fontFamily: FONT }}>{t("docLayer.dayPlan")}</div>
          {!isMobile && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 6 }}>
              {extraResult.dayHistory.map((h, i) => (
                <div key={i} style={{ fontSize: 11, color: C.text, fontFamily: CODE, lineHeight: 1.5 }}>
                  {t("stationary.day", { n: h.day })}: АД {Math.round(h.vitals.sbp)}/{Math.round(h.vitals.dbp)}, ЧСС {Math.round(h.vitals.hr)}{h.treatments.length > 0 ? `\n  💊 ${h.treatments.join(", ")}` : ""}
                </div>
              ))}
            </div>
          )}
          {isMobile && extraResult.dayHistory.map((h, i) => (
            <div key={i} style={{ fontSize: 10, color: C.text, fontFamily: CODE, marginBottom: 2 }}>
              {t("stationary.day", { n: h.day })}: АД {Math.round(h.vitals.sbp)}/{Math.round(h.vitals.dbp)}, ЧСС {Math.round(h.vitals.hr)}{h.treatments.length > 0 ? ` — ${h.treatments.join(", ")}` : ""}
            </div>
          ))}
        </div>
      )}
      <div style={{ background: extraResult?.cycleOutcome === "discharge" ? `${C.green}0a` : `${C.red}0a`, border: `1px solid ${extraResult?.cycleOutcome === "discharge" ? C.green : C.red}33`, borderRadius: 6, padding: "6px 8px" }}>
        <div style={{ fontSize: isMobile ? 9 : 10, color: C.textDim, textTransform: "uppercase", marginBottom: 2, fontFamily: FONT }}>{t("docLayer.discharge")}</div>
        <div style={{ fontSize: isMobile ? 11 : 12, color: extraResult?.cycleOutcome === "discharge" ? C.green : C.red, fontWeight: 600, fontFamily: FONT }}>
          {extraResult?.cycleOutcome === "discharge" ? t("stationary.discharged") : extraResult?.cycleOutcome === "dead" ? t("stationary.died") : t("stationary.maxDaysReached", { n: extraResult?.maxDays })}
        </div>
      </div>
    </div>
  );
}

function EmergencyDoc({ vitalDeltas, selTreat, C, t, isMobile }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 8 : 10 }}>
      <div>
        <div style={{ fontSize: isMobile ? 11 : 12, color: C.accent, fontWeight: 600, fontFamily: FONT, marginBottom: isMobile ? 4 : 6 }}>{t("docLayer.icuSheet")}</div>
        {vitalDeltas.length > 0 && (
          <div style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 8px" }}>
            <div style={{ fontSize: isMobile ? 9 : 10, color: C.textDim, textTransform: "uppercase", marginBottom: 3, fontFamily: FONT }}>{t("docLayer.vitalsOverTime")}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              {vitalDeltas.map(({ label, init, final }) => (
                <div key={label} style={{ fontSize: isMobile ? 10 : 11, color: C.text, fontFamily: CODE }}>
                  {label}: {init} → {final}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div>
        {selTreat.length > 0 && (
          <div style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 8px" }}>
            <div style={{ fontSize: isMobile ? 9 : 10, color: C.textDim, textTransform: "uppercase", marginBottom: 3, fontFamily: FONT }}>{t("docLayer.treatLog")}</div>
            {selTreat.map(id => {
              const name = TREATMENTS.find(t => t.id === id)?.name || id;
              return <div key={id} style={{ fontSize: isMobile ? 10 : 11, color: C.green, fontFamily: FONT, marginBottom: isMobile ? 1 : 2 }}>✓ {name}</div>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
