import React from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import { IconMicroscope, IconPill, IconClipboard } from "../../../ui/icons";

/**
 * Компактный нижний командный бар для мобильного экрана.
 * Обеспечивает быстрый доступ к обследованию, препаратам и диагнозу в 1 клик.
 */
export default function UnifiedMobileActionBar({
  onOpenDiag,
  onOpenTreat,
  onOpenDiagnose,
  orderedCount = 0,
  treatCount = 0,
  hasDiag = false,
  activeMode = null, // "diag" | "treat" | "diagnose"
  diagnoseLabel = "Диагноз",
}) {
  const C = useTheme();

  return (
    <div
      style={{
        flexShrink: 0,
        height: 50,
        background: C.headerBg2,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "4px 8px",
        gap: 6,
        boxSizing: "border-box",
        paddingBottom: "max(4px, env(safe-area-inset-bottom, 4px))",
        zIndex: 600,
        position: "relative",
      }}
    >
      {/* 1. Кнопка «+ Анализы» */}
      <button
        type="button"
        onClick={onOpenDiag}
        style={{
          flex: 1,
          height: 38,
          borderRadius: 8,
          background: activeMode === "diag" ? `${C.accent}30` : `${C.accent}14`,
          border: `1px solid ${activeMode === "diag" ? C.accent : `${C.accent}45`}`,
          color: C.white,
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          cursor: "pointer",
          padding: "0 6px",
        }}
      >
        <IconMicroscope size={14} color={C.accent} />
        <span>Анализы</span>
        {orderedCount > 0 && (
          <span style={{ fontSize: 9.5, background: C.accent, color: "#000", borderRadius: 10, padding: "1px 5px", fontWeight: 700 }}>
            {orderedCount}
          </span>
        )}
      </button>

      {/* 2. Кнопка «+ Лечение» */}
      <button
        type="button"
        onClick={onOpenTreat}
        style={{
          flex: 1,
          height: 38,
          borderRadius: 8,
          background: activeMode === "treat" ? `${C.green}30` : `${C.green}14`,
          border: `1px solid ${activeMode === "treat" ? C.green : `${C.green}45`}`,
          color: C.white,
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          cursor: "pointer",
          padding: "0 6px",
        }}
      >
        <IconPill size={14} color={C.green} />
        <span>Лечение</span>
        {treatCount > 0 && (
          <span style={{ fontSize: 9.5, background: C.green, color: "#000", borderRadius: 10, padding: "1px 5px", fontWeight: 700 }}>
            {treatCount}
          </span>
        )}
      </button>

      {/* 3. Кнопка «Диагноз» */}
      <button
        type="button"
        onClick={onOpenDiagnose}
        style={{
          flex: 1.1,
          height: 38,
          borderRadius: 8,
          background: activeMode === "diagnose"
            ? `linear-gradient(135deg, ${C.purple}55, ${C.accent}55)`
            : `linear-gradient(135deg, ${C.purple}30, ${C.accent}30)`,
          border: `1px solid ${activeMode === "diagnose" ? C.accent : hasDiag ? C.green : C.purple}`,
          color: hasDiag ? C.green : C.white,
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          cursor: "pointer",
          padding: "0 6px",
        }}
      >
        <IconClipboard size={14} color={hasDiag ? C.green : C.purple} />
        <span>{diagnoseLabel}</span>
      </button>
    </div>
  );
}
