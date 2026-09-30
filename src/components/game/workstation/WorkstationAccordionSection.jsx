import React, { useState } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, FONT_HEADING, CODE } from "../../../ui/theme";
import { IconChevronDown } from "../../../ui/icons";

/**
 * Robust collapsible workstation accordion section.
 * Guarantees all sections remain visible, supports multi-open with dynamic flex-split and internal scrolling.
 */
export default function WorkstationAccordionSection({
  id,
  isOpen,
  onToggle,
  icon,
  title,
  subtitle,
  badgeCount = 0,
  badgeColor,
  accentColor,
  fillSpace = false,
  children,
}) {
  const C = useTheme();
  const [hovered, setHovered] = useState(false);
  const color = accentColor || C.accent;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: fillSpace && isOpen ? "1 1 0px" : "0 0 auto",
        minHeight: fillSpace ? 0 : "fit-content",
        overflow: "hidden",
        borderRadius: 10,
        border: `1px solid ${isOpen ? color + "60" : hovered ? C.borderBright : C.border}`,
        background: isOpen ? C.panelBg2 : hovered ? C.dimBg : C.headerBg2,
        transition: "border-color 0.2s ease, background 0.2s ease",
        boxShadow: isOpen ? `0 2px 12px -2px ${color}20` : "none",
      }}
    >
      {/* Header Button: always fixed height, never crushed */}
      <button
        type="button"
        id={`section-btn-${id}`}
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          outline: "none",
          textAlign: "left",
          flexShrink: 0,
        }}
      >
        {/* Icon Pill */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isOpen ? `${color}25` : `${color}14`,
            border: `1px solid ${isOpen ? color + "50" : color + "25"}`,
            color: color,
            flexShrink: 0,
            transition: "all 0.15s ease",
          }}
        >
          {icon}
        </div>

        {/* Title and Subtitle */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 13.5,
              fontWeight: 600,
              color: C.text,
              letterSpacing: "0.01em",
              lineHeight: 1.2,
            }}
          >
            {title}
          </span>
          {subtitle && (
            <span style={{ fontFamily: FONT, fontSize: 10.5, color: C.textDim, marginTop: 1, lineHeight: 1.2 }}>
              {subtitle}
            </span>
          )}
        </div>

        {/* Selected Items Badge */}
        {badgeCount > 0 && (
          <span
            style={{
              background: badgeColor || color,
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: CODE,
              borderRadius: 9999,
              padding: "2px 7px",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1.1,
              boxShadow: `0 2px 6px ${badgeColor || color}40`,
            }}
          >
            {badgeCount}
          </span>
        )}

        {/* Chevron Indicator */}
        <div
          style={{
            color: isOpen ? color : C.textDim,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 2,
          }}
        >
          <IconChevronDown size={14} color="currentColor" />
        </div>
      </button>

      {/* Accordion Content: scrollable if fillSpace, else natural content flow */}
      {isOpen && (
        <div
          id={`section-content-${id}`}
          style={{
            flex: fillSpace ? 1 : "0 0 auto",
            minHeight: 0,
            overflowY: fillSpace ? "auto" : "visible",
            display: "flex",
            flexDirection: "column",
            padding: "4px 8px 8px 8px",
            borderTop: `1px solid ${color}30`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
