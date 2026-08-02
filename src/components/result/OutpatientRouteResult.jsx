import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";

export default function OutpatientRouteResult({ cd, extraResult, isMobile }) {
  const C = useTheme();
  const { t } = useTranslate();

  if (!["outpatient", "admission"].includes(cd.department) || !extraResult?.selectedRoute) return null;

  const correct = extraResult.selectedRoute === extraResult.correctRoute;
  const selectedLabel = extraResult.routeOptions?.find(o => o.id === extraResult.selectedRoute)?.label || extraResult.selectedRoute;
  const correctLabel = extraResult.routeOptions?.find(o => o.id === extraResult.correctRoute)?.label || extraResult.correctRoute;

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 10 }}>
      <STitle icon="🚶" label={t("outpatient.route")} color={correct ? C.green : C.red} />
      <div style={{ display: "grid", gridTemplateColumns: !correct && !isMobile ? "1fr 1fr" : "1fr", gap: isMobile ? 8 : 16 }}>
        <div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: C.textDim, marginBottom: isMobile ? 4 : 5, textTransform: "uppercase", fontFamily: FONT }}>{t("outpatient.yourChoice")}</div>
          <div style={{ color: correct ? C.green : C.red, fontSize: 13, fontWeight: 600, fontFamily: FONT }}>{selectedLabel}</div>
        </div>
        {!correct && (
          <div>
            <div style={{ fontSize: isMobile ? 11 : 12, color: C.textDim, marginBottom: isMobile ? 4 : 5, textTransform: "uppercase", fontFamily: FONT }}>{t("outpatient.correctRoute")}</div>
            <div style={{ color: C.green, fontSize: 13, fontWeight: 600, fontFamily: FONT }}>{correctLabel}</div>
          </div>
        )}
      </div>
    </div>
  );
}
