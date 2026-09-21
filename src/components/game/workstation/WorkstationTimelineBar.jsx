import React from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";

/**
 * Нижняя полоса клинического таймлайна, критических оповещений и вызова переоценки динамики.
 */
export default function WorkstationTimelineBar({
  isCritical,
  isDeteriorating,
  eventLog = [],
  timelineExpanded,
  setTimelineExpanded,
  onOpenReassessment,
}) {
  const C = useTheme();

  return (
    <div
      style={{
        zIndex: 2,
        background: isCritical
          ? "rgba(255,61,90,0.12)"
          : isDeteriorating
          ? "rgba(245,200,66,0.1)"
          : C.headerBg2,
        borderTop: `1px solid ${isCritical ? C.red : isDeteriorating ? C.yellow : C.border}`,
        backdropFilter: "blur(12px)",
        padding: "6px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        maxHeight: timelineExpanded ? 180 : 36,
        transition: "max-height 0.2s ease-in-out",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontFamily: FONT }}>
          <span
            style={{
              fontWeight: 700,
              color: isCritical ? C.red : isDeteriorating ? C.yellow : C.accent,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {isCritical ? "⚠️ КРИТИЧЕСКИЙ СТАТУС" : isDeteriorating ? "⚡ УХУДШЕНИЕ" : "⏱ ТАЙМЛАЙН"}
          </span>
          {eventLog[0] && (
            <span
              style={{
                color: C.textDim,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "60vw",
              }}
            >
              [{eventLog[0].elapsed}] {eventLog[0].text}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={onOpenReassessment}
            style={{
              padding: "3px 10px",
              borderRadius: 6,
              background: `${C.accent}20`,
              border: `1px solid ${C.accent}55`,
              color: C.accent,
              fontSize: 10.5,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            🔄 Оценить динамику
          </button>
          <button
            onClick={() => setTimelineExpanded((prev) => !prev)}
            style={{
              background: "transparent",
              border: "none",
              color: C.textDim,
              fontSize: 10,
              cursor: "pointer",
              fontFamily: FONT,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>{eventLog.length} событий</span>
            <span>{timelineExpanded ? "▼" : "▲"}</span>
          </button>
        </div>
      </div>

      {timelineExpanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3, overflowY: "auto", maxHeight: 130, paddingTop: 4 }}>
          {eventLog.map((ev, i) => (
            <div
              key={ev.id || i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 11,
                fontFamily: FONT,
                color:
                  ev.type === "critical" || ev.type === "danger"
                    ? C.red
                    : ev.type === "warning" || ev.type === "warn"
                    ? C.yellow
                    : ev.type === "result"
                    ? C.accent
                    : C.textDim,
              }}
            >
              <span style={{ fontFamily: CODE, fontSize: 10, opacity: 0.8, minWidth: 36 }}>
                {ev.elapsed || "0:00"}
              </span>
              <span>•</span>
              <span style={{ color: ev.type === "critical" ? C.red : C.text }}>{ev.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
