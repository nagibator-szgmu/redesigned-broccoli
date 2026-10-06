import React from "react";
import { FONT, CODE } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";
import {
  IconClock,
  IconMicroscope,
  IconClipboard,
  IconPill,
  IconChevronUp,
} from "../../../ui/icons";
import { DAY_COLORS } from "./constants";

/**
 * Вкладки действий врача в стационаре (как ActionTabBar в ОРИТ).
 * Открываются сверху по тапу, закрываются при повторном тапе, изначально свернуты.
 */
export default function StationaryActionTabs({
  openTab,
  onToggleTab,
  currentDay = 0,
  selDiagCount = 0,
  resultsCount = 0,
  selTreatCount = 0,
  children,
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const dayColor = DAY_COLORS[currentDay % 7];

  const tabs = [
    { id: "morning", label: t("stationary.morning") || "Обход", Icon: IconClock, badge: null, color: dayColor },
    { id: "order_tests", label: t("phases.order_tests") || "Исследования", Icon: IconMicroscope, badge: selDiagCount || null, color: C.accent },
    { id: "results", label: t("phases.awaiting_results") || "Результаты", Icon: IconClipboard, badge: resultsCount || null, color: C.purple },
    { id: "treat", label: t("stationary.treat") || "Лечение", Icon: IconPill, badge: selTreatCount || null, color: C.green },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
      {/* Верхняя навигационная панель вкладок (как в ОРИТ) */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 6px", background: C.panelBg2, border: `1px solid ${C.border}`, borderRadius: 8, flexShrink: 0 }}>
        {tabs.map(({ id, label, Icon, badge, color }) => {
          const isActive = openTab === id;
          const tabColor = color || C.accent;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onToggleTab(id)}
              style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 3, padding: "7px 4px", borderRadius: 6,
                background: isActive ? `${tabColor}1f` : "transparent",
                border: `1px solid ${isActive ? `${tabColor}50` : "transparent"}`,
                color: isActive ? C.white : C.textDim, cursor: "pointer", fontFamily: FONT,
                transition: "all 0.15s ease", minWidth: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Icon size={14} color={isActive ? tabColor : "currentColor"} />
                {badge !== null && (
                  <span style={{ background: `${tabColor}25`, color: tabColor, border: `1px solid ${tabColor}50`, borderRadius: 9999, fontSize: 9, fontWeight: 700, fontFamily: CODE, padding: "0 4px", lineHeight: "13px" }}>
                    {badge}
                  </span>
                )}
              </div>
              <span style={{ fontSize: 10.5, fontWeight: isActive ? 700 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Выпадающий сверху контент открытой вкладки */}
      {openTab && (
        <div style={{ marginTop: 8, background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 4px 16px -2px rgba(0,0,0,0.35)", animation: "fadeIn 0.15s ease" }}>
          {/* Полоса сворачивания сверху под вкладками */}
          <div
            onClick={() => onToggleTab(openTab)}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 12px", background: C.panelBg2, borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: C.textDim, fontFamily: FONT }}>
              {tabs.find((t) => t.id === openTab)?.label}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.accent, fontSize: 11, fontFamily: FONT, fontWeight: 600 }}>
              <span>{t("common.collapse") && t("common.collapse") !== "common.collapse" ? t("common.collapse") : "Свернуть"}</span>
              <IconChevronUp size={13} color="currentColor" />
            </div>
          </div>
          <div style={{ padding: "6px" }}>{children}</div>
        </div>
      )}
    </div>
  );
}
