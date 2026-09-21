import React, { useState } from "react";
import { FONT, CODE } from "../../../ui/theme";

export function MobileTimelineBar({ eventLog, isCritical, C, onOpenReassess }) {
  const [timelineOpen, setTimelineOpen] = useState(false);

  if (!eventLog || eventLog.length === 0) return null;

  return (
    <div
      style={{
        background: C.panel,
        borderTop: `1px solid ${C.border}`,
        padding: "6px 12px",
        fontSize: 10,
        flexShrink: 0,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        fontFamily: FONT,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          onClick={() => setTimelineOpen((prev) => !prev)}
          style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", flex: 1, minWidth: 0 }}
        >
          <span
            style={{
              color: isCritical ? C.red : C.accent,
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            ⏱ {eventLog[0]?.elapsed} {eventLog[0]?.text}
          </span>
          <span style={{ color: C.textDim, fontSize: 9 }}>{timelineOpen ? "▼" : `▲ (${eventLog.length})`}</span>
        </div>
        <button
          onClick={onOpenReassess}
          style={{
            padding: "2px 6px",
            borderRadius: 4,
            background: `${C.accent}25`,
            border: `1px solid ${C.accent}55`,
            color: C.accent,
            fontSize: 9.5,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: FONT,
            flexShrink: 0,
          }}
        >
          🔄 Оценить
        </button>
      </div>
      {timelineOpen && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", marginTop: 4 }}>
          {eventLog.slice(0, 10).map((ev, i) => (
            <div key={ev.id || i} style={{ display: "flex", gap: 6, color: ev.type === "critical" ? C.red : C.textDim }}>
              <span style={{ fontFamily: CODE, opacity: 0.8 }}>{ev.elapsed}</span>
              <span>{ev.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
