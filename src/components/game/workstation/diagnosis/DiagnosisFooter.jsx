import React from "react";
import { useTheme } from "../../../../ui/ThemeContext";
import { FONT } from "../../../../ui/theme";
import { Btn } from "../../../../ui/components";

/**
 * Подвал вкладки диагноза: статус назначенных препаратов, активные эффекты и кнопка завершения.
 */
export default function DiagnosisFooter({
  selTreat = [],
  pendingFx,
  canSubmit,
  doSubmit,
  t,
}) {
  const C = useTheme();

  return (
    <div
      style={{
        background: C.panelBg,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "auto",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      <div style={{ fontSize: 12, fontFamily: FONT, display: "flex", flexDirection: "column", gap: 2 }}>
        <div>
          {selTreat.length > 0 ? (
            <span style={{ color: C.green }}>{t("diagnose.prescribed", { n: selTreat.length })}</span>
          ) : (
            <span style={{ color: C.yellow }}>{t("diagnose.treatTab")}</span>
          )}
        </div>
        {pendingFx?.size > 0 && (
          <div style={{ color: C.yellow, fontSize: 11 }}>
            {t("diagnose.active", { n: pendingFx.size })}
          </div>
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
  );
}
