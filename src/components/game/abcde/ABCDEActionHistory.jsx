import React from "react";
import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { formatTime } from "./abcdeEngine";

/** История выполненных действий для текущего выбранного шага ABCDE */
export default function ABCDEActionHistory({ activeTab, results }) {
  const C = useTheme();
  const stepActions = Object.values(results).filter((r) => r.section === activeTab);

  if (stepActions.length === 0) return null;

  return (
    <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
      {stepActions.map((s, idx) => (
        <div
          key={idx}
          style={{
            padding: "6px 8px",
            borderRadius: 6,
            background: C.btnBg,
            border: `1px solid ${
              s.isCritical ? `${C.red}40` : s.isAbnormal ? `${C.yellow}40` : C.btnBorder
            }`,
            fontSize: 11,
            fontFamily: FONT,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: s.isCritical ? C.red : s.isAbnormal ? C.yellow : C.text,
            }}
          >
            <strong>{s.action}</strong>
            <span style={{ fontSize: 9, opacity: 0.7 }}>{formatTime(s.timestamp)}</span>
          </div>
          <div style={{ color: C.textDim, marginTop: 2 }}>{s.details}</div>
        </div>
      ))}
    </div>
  );
}
