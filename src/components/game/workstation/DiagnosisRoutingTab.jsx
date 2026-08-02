import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import { STitle, Btn } from "../../../ui/components";
import { ROUTE_ICONS } from "../../../screens/game/OutpatientPanels";

/** Diagnosis entry & patient routing tab component */
export default function DiagnosisRoutingTab({
  diagText,
  setDiagText,
  selTreat = [],
  pendingFx,
  handleSubmit,
  cd,
  selectedRoute,
  setSelectedRoute,
  setExtraResult,
  t
}) {
  const C = useTheme();

  const isAdmission = cd?.department === "admission";
  const canSubmit = isAdmission ? selTreat.length > 0 && selectedRoute !== null : selTreat.length > 0;

  const doSubmit = () => {
    if (isAdmission && setExtraResult) {
      setExtraResult({ selectedRoute, routeOptions: cd.routeOptions, correctRoute: cd.correctRoute });
    }
    handleSubmit(false);
  };

  return (
    <div style={{ height: "100%", padding: "12px 14px", overflowY: "auto", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Diagnosis Textarea */}
      <div style={{ background: C.panelBg, border: `1px solid ${C.purple}33`, borderRadius: 12, padding: "12px 14px" }}>
        <STitle icon="🩺" label={t("diagnose.title")} color={C.purple} />
        <textarea
          value={diagText}
          onChange={e => setDiagText(e.target.value)}
          placeholder={t("diagnose.placeholder")}
          style={{
            width: "100%",
            minHeight: 90,
            background: C.headerBg2,
            border: `1px solid ${diagText ? `${C.purple}55` : "rgba(0,230,200,0.1)"}`,
            borderRadius: 10,
            padding: "10px 12px",
            color: C.white,
            fontSize: 13,
            fontFamily: FONT,
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
            lineHeight: 1.6
          }}
        />
      </div>

      {/* Patient Routing (Admission / Outpatient Mode) */}
      {isAdmission && (
        <div style={{ background: C.panelBg, border: `1px solid ${selectedRoute ? `${C.green}44` : `${C.yellow}33`}`, borderRadius: 12, padding: "12px 14px" }}>
          <STitle icon="🚶" label={t("outpatient.routeTitle")} color={selectedRoute ? C.green : C.yellow} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {(cd.routeOptions || []).map(opt => {
              const sel = selectedRoute === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedRoute(opt.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 12px",
                    borderRadius: 10,
                    cursor: "pointer",
                    background: sel ? `${C.green}18` : "transparent",
                    border: `1px solid ${sel ? C.green : C.border}`,
                    transition: "all 0.15s"
                  }}
                >
                  <span style={{ fontSize: 18 }}>{ROUTE_ICONS[opt.id] || "📋"}</span>
                  <span style={{ fontSize: 13, color: sel ? C.green : C.text, fontWeight: sel ? 600 : 400, fontFamily: FONT, flex: 1 }}>
                    {opt.label}
                  </span>
                  {sel && <span style={{ fontSize: 14, color: C.green }}>✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary & Submit Action */}
      <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <div style={{ fontSize: 12, fontFamily: FONT }}>
          {selTreat.length > 0 ? (
            <span style={{ color: C.green }}>{t("diagnose.prescribed", { n: selTreat.length })}</span>
          ) : (
            <span style={{ color: C.yellow }}>{t("diagnose.treatTab")}</span>
          )}
          {pendingFx?.size > 0 && (
            <span style={{ color: C.yellow, marginLeft: 8 }}>
              {t("diagnose.active", { n: pendingFx.size })}
            </span>
          )}
        </div>
        <Btn
          onClick={doSubmit}
          disabled={!canSubmit}
          color={C.green}
          style={{ padding: "10px 24px", fontSize: 13 }}
        >
          {t("diagnose.complete")}
        </Btn>
      </div>
    </div>
  );
}
