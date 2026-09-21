import React from "react";
import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { DAY_COLORS } from "./constants";

/** Step indicator bar for stationary workflow */
export default function StepBar({ steps, activeStep, currentDay }) {
  const C = useTheme();
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
      {steps.map((s, i) => (
        <div
          key={s.key}
          style={{
            flex: 1,
            padding: "8px 6px",
            borderRadius: 8,
            background: i === activeStep ? `${DAY_COLORS[currentDay % 7]}15` : "transparent",
            border: `1px solid ${i === activeStep ? DAY_COLORS[currentDay % 7] : C.border}`,
            textAlign: "center",
            cursor: i <= activeStep ? "pointer" : "default",
            opacity: i > activeStep ? 0.4 : 1,
          }}
        >
          <div style={{ fontSize: 12 }}>{s.icon}</div>
          <div style={{ fontSize: 10, color: i === activeStep ? DAY_COLORS[currentDay % 7] : C.textDim, fontFamily: FONT, marginTop: 2 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
