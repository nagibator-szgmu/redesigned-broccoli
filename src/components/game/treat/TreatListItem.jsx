import React from "react";
import { FONT } from "../../../ui/theme";
import { IconAlertTriangle, IconCheck, IconClock } from "../../../ui/icons";

export default function TreatListItem({
  item,
  isSelected,
  isPending,
  isApplied,
  isBad,
  hideWarnings,
  onToggle,
  isMobile,
  color: colorProp,
  C,
}) {
  const color = colorProp || C.accent;

  return (
    <div
      onClick={onToggle}
      className="treat-row"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        minHeight: 39,
        background: isSelected
          ? isBad && !hideWarnings
            ? `${C.red}18`
            : `${color}18`
          : "transparent",
        border: `1px solid ${
          isSelected
            ? isBad && !hideWarnings
              ? C.red
              : color + "70"
            : C.border
        }`,
        borderRadius: 8,
        padding: isMobile ? "8px 10px" : "8px 12px",
        cursor: "pointer",
        marginBottom: 4,
        boxShadow: isSelected ? `0 2px 8px -2px ${color}25` : "none",
        transition: "all 0.15s ease",
        userSelect: "none",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
        {/* Checkbox box - exact 18x18 match with CheckRow */}
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 4,
            border: `1.5px solid ${
              isSelected
                ? isBad && !hideWarnings
                  ? C.red
                  : color
                : C.borderBright
            }`,
            background: isSelected
              ? isBad && !hideWarnings
                ? C.red
                : color
              : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: isSelected ? `0 0 6px ${color}66` : "none",
            transition: "all 0.15s ease",
          }}
        >
          {isSelected && <IconCheck size={12} color="#FFFFFF" strokeWidth={3} />}
        </div>

        {/* Title */}
        <span
          style={{
            color: isSelected
              ? C.white
              : isBad && isSelected && !hideWarnings
              ? C.red
              : "#E2E8F0",
            fontSize: 14,
            fontFamily: FONT,
            flex: 1,
            fontWeight: isSelected ? 500 : 400,
            lineHeight: 1.35,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.name}
        </span>

        {isBad && isSelected && !hideWarnings && (
          <span
            style={{
              fontSize: 10.5,
              color: C.red,
              fontFamily: FONT,
              fontWeight: 600,
              background: `${C.red}18`,
              padding: "1px 6px",
              borderRadius: 4,
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              flexShrink: 0,
            }}
          >
            <IconAlertTriangle size={10} color={C.red} />
            <span>опасно</span>
          </span>
        )}
      </div>

      {/* Status Badges */}
      {(isPending || isApplied) && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: 8 }}>
          {isPending && (
            <span
              style={{
                fontSize: 10,
                color: C.yellow,
                background: `${C.yellow}15`,
                border: `1px solid ${C.yellow}33`,
                padding: "2px 6px",
                borderRadius: 4,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontFamily: FONT,
                fontWeight: 600,
              }}
            >
              <IconClock size={11} color={C.yellow} />
              {item.delaySec ? `${item.delaySec}с` : "..."}
            </span>
          )}
          {isApplied && (
            <span
              style={{
                fontSize: 10,
                color: C.green,
                background: `${C.green}15`,
                border: `1px solid ${C.green}33`,
                padding: "2px 6px",
                borderRadius: 4,
                fontWeight: 600,
                fontFamily: FONT,
              }}
            >
              Активно
            </span>
          )}
        </div>
      )}
    </div>
  );
}
