import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";
import { IconRoute, IconPill, IconClipboard } from "../../ui/icons";

export default function OutpatientRouteResult({ cd, extraResult, isMobile }) {
  const C = useTheme();
  const { t } = useTranslate();

  if (!["outpatient", "admission"].includes(cd.department) || !extraResult?.selectedRoute) return null;

  const correct = extraResult.selectedRoute === extraResult.correctRoute;
  const selectedLabel = extraResult.routeOptions?.find((o) => o.id === extraResult.selectedRoute)?.label || extraResult.selectedRoute;
  const correctLabel = extraResult.routeOptions?.find((o) => o.id === extraResult.correctRoute)?.label || extraResult.correctRoute;

  const rx = extraResult.rxBuilder;
  const fu = extraResult.followUp;

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 10, display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <STitle icon={<IconRoute size={15} color={correct ? C.green : C.red} />} label={t("outpatient.route")} color={correct ? C.green : C.red} />
        <div style={{ display: "grid", gridTemplateColumns: !correct && !isMobile ? "1fr 1fr" : "1fr", gap: isMobile ? 8 : 16, marginTop: 6 }}>
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

      {rx && (
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
          <STitle icon={<IconPill size={15} color={rx.isCorrect ? C.green : C.yellow} />} label="Рецепт и режим дозирования" color={rx.isCorrect ? C.green : C.yellow} />
          <div style={{ fontSize: 12.5, color: C.text, fontFamily: FONT, marginTop: 4 }}>
            {rx.mnn ? `${rx.mnn} (${rx.dose || "—"}, ${rx.frequency || "—"}, ${rx.duration || "—"})` : "Рецепт не был оформлен"}
          </div>
        </div>
      )}

      {fu && (fu.timingId || fu.selectedBiomarkers?.length > 0) && (
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
          <STitle icon={<IconClipboard size={15} color={C.accent} />} label="Диспансерный контроль (Follow-up)" color={C.accent} />
          <div style={{ fontSize: 12, color: C.textDim, fontFamily: FONT, marginTop: 4 }}>
            Повторный визит: <span style={{ color: C.text, fontWeight: 600 }}>{fu.timingId || "не указан"}</span>
            {fu.selectedBiomarkers?.length > 0 && (
              <div style={{ marginTop: 2 }}>
                Контрольные биомаркеры: <span style={{ color: C.text, fontWeight: 600 }}>{fu.selectedBiomarkers.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

