import React from "react";
import { FONT, CODE } from "../../../ui/theme";

/**
 * Категоризация события для визуального протокола таймлайна.
 */
export function getEventCategory(type, C) {
  if (type === "critical" || type === "danger") {
    return { tag: "CRIT", bg: `${C.red}25`, color: C.red };
  }
  if (type === "warning" || type === "warn") {
    return { tag: "WARN", bg: `${C.yellow}25`, color: C.yellow };
  }
  if (type === "result") {
    return { tag: "RESULT", bg: `${C.accent}25`, color: C.accent };
  }
  if (type === "action" || type === "treatment") {
    return { tag: "ACTION", bg: `${C.green}25`, color: C.green };
  }
  return { tag: "INFO", bg: C.btnBg, color: C.textDim };
}

/**
 * Развернутый список событий клинического протокола.
 */
export default function TimelineEventList({ eventLog = [], C }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, overflowY: "auto", maxHeight: 130, paddingTop: 4 }}>
      {eventLog.map((ev, i) => {
        const cat = getEventCategory(ev.type, C);
        return (
          <div
            key={ev.id || i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 10.5,
              fontFamily: FONT,
            }}
          >
            <span style={{ fontFamily: CODE, fontSize: 9.5, color: C.textDim, minWidth: 32 }}>
              {ev.elapsed || "0:00"}
            </span>
            <span
              style={{
                fontFamily: CODE,
                fontSize: 8,
                fontWeight: 700,
                padding: "0 4px",
                borderRadius: 3,
                background: cat.bg,
                color: cat.color,
              }}
            >
              {cat.tag}
            </span>
            <span style={{ color: ev.type === "critical" ? C.red : C.text }}>{ev.text}</span>
          </div>
        );
      })}
    </div>
  );
}
