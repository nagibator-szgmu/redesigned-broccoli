import React from "react";
import { useTheme } from "../../../../ui/ThemeContext";
import { FONT } from "../../../../ui/theme";
import { STitle } from "../../../../ui/components";
import { ROUTE_ICONS } from "../../../../screens/game/OutpatientPanels";

/**
 * Секция выбора маршрутизации пациента (только если доступна для отделения).
 */
export default function RoutingSection({ routeOptions = [], selectedRoute, setSelectedRoute, t }) {
  const C = useTheme();

  return (
    <div
      style={{
        background: C.panelBg,
        border: `1px solid ${selectedRoute ? `${C.green}44` : `${C.yellow}33`}`,
        borderRadius: 12,
        padding: "12px 14px",
      }}
    >
      <STitle icon="🚶" label={t("outpatient.routeTitle")} color={selectedRoute ? C.green : C.yellow} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
        {routeOptions.map((opt) => {
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
                transition: "all 0.15s",
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
  );
}
