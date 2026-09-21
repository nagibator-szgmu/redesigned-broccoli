import React from "react";
import { IconAlertTriangle } from "../../../ui/icons";

export default function TreatListItem({
  item,
  isSelected,
  isPending,
  isApplied,
  isBad,
  hideWarnings,
  onToggle,
  isMobile,
  C,
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "8px 10px" : "8px 12px",
        borderRadius: 10,
        background: isSelected
          ? isBad && !hideWarnings
            ? `${C.red}18`
            : `${C.green}15`
          : C.panelBg,
        border: `1px solid ${
          isSelected ? (isBad && !hideWarnings ? C.red : C.green) : C.border
        }`,
        cursor: "pointer",
        transition: "all 0.15s ease",
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            border: `1.5px solid ${
              isSelected ? (isBad && !hideWarnings ? C.red : C.green) : C.border
            }`,
            background: isSelected
              ? isBad && !hideWarnings
                ? C.red
                : C.green
              : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {isSelected && <span style={{ color: C.bg, fontSize: 10, fontWeight: 900 }}>✓</span>}
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: isSelected ? 700 : 500,
              color: isSelected ? C.white : C.text,
              lineHeight: 1.3,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.name}
            </span>
            {isBad && isSelected && !hideWarnings && (
              <IconAlertTriangle size={13} color={C.red} />
            )}
          </div>
          {item.desc && (
            <div
              style={{
                fontSize: 10,
                color: C.textDim,
                marginTop: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.desc}
            </div>
          )}
        </div>
      </div>

      {/* Status Badges */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {isPending && (
          <span
            style={{
              fontSize: 9.5,
              color: C.yellow,
              background: `${C.yellow}15`,
              border: `1px solid ${C.yellow}33`,
              padding: "1px 6px",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>
              ⏳
            </span>
            {item.delaySec ? `${item.delaySec}с` : "..."}
          </span>
        )}
        {isApplied && (
          <span
            style={{
              fontSize: 9.5,
              color: C.green,
              background: `${C.green}15`,
              border: `1px solid ${C.green}33`,
              padding: "1px 6px",
              borderRadius: 4,
              fontWeight: 600,
            }}
          >
            Активно
          </span>
        )}
      </div>
    </div>
  );
}
