import React from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";
import { STitle } from "../../../ui/components";

/**
 * Панель визуализации клинической траектории пациента (Clinical Trajectory Panel).
 */
export default function TrajectoryPanel({ trajectory = [], isMobile = false }) {
  const C = useTheme();
  if (!trajectory || trajectory.length === 0) return null;

  const getCheckpointBadge = (cp) => {
    if (cp.trend === "improving" || cp.overallResponse === "positive") return { label: "IMPROVED", color: C.green };
    if (cp.trend === "deteriorating" || cp.overallResponse === "negative") return { label: "WORSENED", color: C.red };
    return { label: cp.checkpointId || "CHECKPOINT", color: C.accent };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <STitle icon="📈" label="Клиническая траектория (Trajectory)" color={C.accent} />
        <span style={{ fontSize: 9.5, color: C.textDim, fontFamily: CODE }}>
          {trajectory.length} точек
        </span>
      </div>

      <div style={{
        display: "flex", flexDirection: "column", gap: 6,
        background: C.panel, border: `1px solid ${C.border}`,
        borderRadius: 10, padding: isMobile ? "8px 10px" : "10px 12px",
        maxHeight: 220, overflowY: "auto"
      }}>
        {trajectory.map((cp, idx) => {
          const badge = getCheckpointBadge(cp);
          return (
            <div
              key={cp.checkpointId || idx}
              style={{
                display: "flex", flexDirection: "column", gap: 3,
                padding: "6px 8px", borderRadius: 6,
                background: C.btnBg, border: `1px solid ${C.btnBorder}`
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 9.5, fontFamily: CODE, color: C.textDim }}>
                    {cp.elapsed || `${idx + 1}.`}
                  </span>
                  <strong style={{ fontSize: 10.5, color: C.white, fontFamily: FONT }}>
                    {cp.checkpointId || `Оценка #${idx}`}
                  </strong>
                </div>
                <span style={{
                  fontSize: 8.5, fontWeight: 700, padding: "1px 5px", borderRadius: 4,
                  background: `${badge.color}20`, color: badge.color, fontFamily: FONT
                }}>
                  {badge.label}
                </span>
              </div>

              {/* Vitals Snapshot */}
              {cp.vitals && (
                <div style={{ display: "flex", gap: 8, fontSize: 9.5, fontFamily: CODE, color: C.textDim }}>
                  {cp.map != null && <span>MAP: <strong style={{ color: C.text }}>{cp.map}</strong></span>}
                  {cp.vitals.spo2 != null && <span>SpO₂: <strong style={{ color: C.text }}>{Math.round(cp.vitals.spo2)}%</strong></span>}
                  {cp.vitals.hr != null && <span>ЧСС: <strong style={{ color: C.text }}>{Math.round(cp.vitals.hr)}</strong></span>}
                </div>
              )}

              {/* Plan note */}
              {cp.chosenPlan && (
                <div style={{ fontSize: 9, color: C.accent, fontFamily: FONT }}>
                  → План: {cp.chosenPlan.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
