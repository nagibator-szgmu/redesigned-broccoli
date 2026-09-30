import React from "react";
import { FONT } from "../../../ui/theme";
import { IconMicroscope, IconPill, IconClipboard } from "../../../ui/icons";

/**
 * Навигационная панель переключения рабочих столов врача в командном центре.
 */
export default function ActionTabBar({
  activeTab,
  setActiveTab,
  orderedCount = 0,
  treatCount = 0,
  hasDiag = false,
  t,
  C,
}) {
  const tabs = [
    {
      id: "diag",
      label: t("phases.order_tests") || "Исследования",
      Icon: IconMicroscope,
      badge: orderedCount > 0 ? orderedCount : null,
      badgeColor: C.accent,
    },
    {
      id: "treat",
      label: t("treatment.title") || "Назначения и лечение",
      Icon: IconPill,
      badge: treatCount > 0 ? treatCount : null,
      badgeColor: C.green,
    },
    {
      id: "diagnose",
      label: t("phases.diagnose") || "Диагноз и маршрут",
      Icon: IconClipboard,
      badge: hasDiag ? 1 : null,
      badgeColor: C.purple,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        padding: "4px 6px",
        background: C.panelBg2,
        borderBottom: `1px solid ${C.border}`,
        flexShrink: 0,
      }}
    >
      {tabs.map(({ id, label, Icon, badge, badgeColor }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "9px 12px",
              borderRadius: 6,
              background: isActive ? `${C.accent}1c` : "transparent",
              border: `1px solid ${isActive ? `${C.accent}45` : "transparent"}`,
              color: isActive ? C.white : C.textDim,
              cursor: "pointer",
              fontFamily: FONT,
              fontSize: 13.5,
              fontWeight: isActive ? 600 : 500,
              transition: "all 0.15s ease",
            }}
          >
            <Icon size={14} color={isActive ? C.accent : "currentColor"} />
            <span>{label}</span>
            {badge !== null && (
              <span
                style={{
                  background: `${badgeColor || C.accent}25`,
                  color: badgeColor || C.accent,
                  border: `1px solid ${badgeColor || C.accent}50`,
                  borderRadius: 9999,
                  fontSize: 9.5,
                  fontWeight: 700,
                  padding: "0 5px",
                  lineHeight: "14px",
                }}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
