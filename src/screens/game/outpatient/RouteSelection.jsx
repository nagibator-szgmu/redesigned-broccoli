import React from "react";
import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";
import { ROUTE_ICONS } from "./routeIcons";

/** Route selection panel */
export function RouteSelection({ routeOptions, selectedRoute, setSelectedRoute }) {
  const C = useTheme();
  const { t } = useTranslate();
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: FONT, marginBottom: 10 }}>
        {t("outpatient.routeTitle")}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {(routeOptions || []).map(opt => {
          const sel = selectedRoute === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => setSelectedRoute(opt.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                cursor: "pointer",
                background: sel ? `${C.accent}18` : "transparent",
                border: `1px solid ${sel ? C.accent : C.border}`,
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: 18 }}>{ROUTE_ICONS[opt.id] || "📋"}</span>
              <span style={{ fontSize: 13, color: sel ? C.accent : C.text, fontWeight: sel ? 700 : 400, fontFamily: FONT, flex: 1 }}>
                {opt.label}
              </span>
              {sel && <span style={{ fontSize: 14, color: C.accent, fontWeight: 900 }}>✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
