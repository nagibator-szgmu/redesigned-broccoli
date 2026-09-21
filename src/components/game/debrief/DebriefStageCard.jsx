import { FONT } from "../../../ui/theme";
import DebriefStageItem from "./DebriefStageItem";

export default function DebriefStageCard({ stage, isExpanded, toggleStage, C }) {
  const color =
    stage.statusColor === "green" ? C.green : stage.statusColor === "yellow" ? C.yellow : C.red;

  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${
          stage.status === "done" ? `${C.green}40` : stage.status === "partial" ? `${C.yellow}40` : `${C.red}40`
        }`,
        borderRadius: 14,
        overflow: "hidden",
        transition: "all 0.15s ease",
      }}
    >
      {/* Stage Header */}
      <div
        onClick={() => toggleStage(stage.id)}
        style={{
          padding: "12px 16px",
          background: `${color}0c`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>{stage.icon}</span>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.white, fontFamily: FONT }}>
              {stage.title}
            </div>
            <div style={{ fontSize: 10.5, color: C.textDim, fontFamily: FONT, marginTop: 1 }}>
              {stage.krReference}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: color,
              background: `${color}18`,
              border: `1px solid ${color}44`,
              borderRadius: 6,
              padding: "3px 10px",
              fontFamily: FONT,
            }}
          >
            {stage.status === "done" ? "🟢 " : stage.status === "partial" ? "🟡 " : "🔴 "}
            {stage.statusLabel}
          </span>
          <span style={{ color: C.textDim, fontSize: 11 }}>{isExpanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Stage Content */}
      {isExpanded && (
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Guideline Rationale */}
          <div
            style={{
              fontSize: 12,
              color: C.text,
              lineHeight: 1.6,
              fontFamily: FONT,
              padding: "8px 12px",
              background: C.headerBg2,
              borderRadius: 8,
              borderLeft: `3px solid ${color}`,
            }}
          >
            <strong>Клиническое обоснование:</strong> {stage.rationale}
          </div>

          {/* Item Breakdown */}
          {stage.items && stage.items.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
              {stage.items.map((item, idx) => (
                <DebriefStageItem key={idx} item={item} C={C} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
