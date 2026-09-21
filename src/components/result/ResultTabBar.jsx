import React from "react";
import { FONT, RADIUS } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";

export function ResultTabBar({ tabs, activeTab, setActiveTab, isMobile }) {
  const C = useTheme();

  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        marginBottom: 16,
        padding: 4,
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: RADIUS.md,
        overflowX: "auto",
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: isMobile ? "8px 10px" : "10px 14px",
              borderRadius: RADIUS.xs,
              border: isActive ? `1px solid ${C.accent}` : "1px solid transparent",
              background: isActive ? `${C.accent}18` : "transparent",
              color: isActive ? C.accent : C.textDim,
              fontSize: isMobile ? 12 : 13,
              fontWeight: isActive ? 700 : 500,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
              fontFamily: FONT,
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
