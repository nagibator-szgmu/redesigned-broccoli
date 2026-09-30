import React from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";
import {
  IconAlertTriangle,
  IconActivity,
  IconClock,
  IconRefresh,
  IconChevronDown,
  IconChevronUp,
} from "../../../ui/icons";
import TimelineEventList, { getEventCategory } from "./TimelineEventList";

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
  const latestEvent = eventLog[0];
  const latestCat = latestEvent ? getEventCategory(latestEvent.type, C) : null;

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
        padding: "5px 12px",
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
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {isCritical ? (
              <>
                <IconAlertTriangle size={12} color={C.red} />
                <span>КРИТИЧЕСКИЙ СТАТУС</span>
              </>
            ) : isDeteriorating ? (
              <>
                <IconActivity size={12} color={C.yellow} />
                <span>УХУДШЕНИЕ</span>
              </>
            ) : (
              <>
                <IconClock size={12} color={C.accent} />
                <span>ПРОТОКОЛ</span>
              </>
            )}
          </span>

          {latestEvent && latestCat && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  fontFamily: CODE,
                  fontSize: 8.5,
                  fontWeight: 700,
                  padding: "1px 4px",
                  borderRadius: 3,
                  background: latestCat.bg,
                  color: latestCat.color,
                  letterSpacing: 0.5,
                }}
              >
                {latestCat.tag}
              </span>
              <span
                style={{
                  color: C.textDim,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "50vw",
                }}
              >
                [{latestEvent.elapsed}] {latestEvent.text}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={onOpenReassessment}
            style={{
              padding: "3px 8px",
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
            <IconRefresh size={12} color={C.accent} />
            <span>Оценить динамику</span>
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
            {timelineExpanded ? <IconChevronDown size={12} /> : <IconChevronUp size={12} />}
          </button>
        </div>
      </div>

      {timelineExpanded && <TimelineEventList eventLog={eventLog} C={C} />}
    </div>
  );
}
