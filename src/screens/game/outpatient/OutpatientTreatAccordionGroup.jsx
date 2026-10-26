import React, { useState } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";
import { IconChevronDown, IconCheck } from "../../../ui/icons";

/**
 * Collapsible category accordion group for outpatient prescriptions.
 * Styled matching the ICU DiagAccordionGroup pattern.
 */
export default function OutpatientTreatAccordionGroup({
  title, icon, color, items = [], selTreat = [], onToggle, isOpen, onToggleOpen,
}) {
  const C = useTheme();
  const [hovered, setHovered] = useState(false);

  if (items.length === 0) return null;
  const selCount = items.filter((i) => selTreat.includes(i.id)).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 4 }}>
      {/* Category Accordion Header */}
      <button
        type="button"
        onClick={onToggleOpen}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 6, padding: "8px 12px",
          background: isOpen ? `${color}10` : hovered ? C.dimBg : "transparent",
          border: `1px solid ${isOpen ? color + "50" : hovered ? C.borderBright : C.border}`,
          borderRadius: 8, cursor: "pointer", outline: "none", transition: "all 0.15s ease",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, flexShrink: 0 }}>
          {icon}
        </span>
        <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: C.text, flex: 1, textAlign: "left" }}>
          {title}
        </span>

        {/* Selected count pill */}
        {selCount > 0 && (
          <span style={{ fontFamily: CODE, fontSize: 10, fontWeight: 700, color: "#FFFFFF", background: color, borderRadius: 9999, padding: "1px 6px", fontVariantNumeric: "tabular-nums" }}>
            {selCount}
          </span>
        )}

        {/* Total count badge */}
        <span style={{ fontFamily: CODE, fontSize: 10, color: C.textDim, background: C.dimBg, borderRadius: 4, padding: "1px 4px", fontVariantNumeric: "tabular-nums" }}>
          {items.length}
        </span>

        {/* Chevron icon */}
        <div style={{ color: isOpen ? color : C.textDim, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease, color 0.15s ease", display: "flex", alignItems: "center" }}>
          <IconChevronDown size={12} color="currentColor" />
        </div>
      </button>

      {/* Treatments inside category */}
      {isOpen && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingLeft: 4, paddingRight: 2 }}>
          {items.map((item) => {
            const isSelected = selTreat.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onToggle(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, minHeight: 40,
                  background: isSelected ? `${color}14` : "transparent",
                  border: `1px solid ${isSelected ? color + "70" : C.border}`,
                  borderRadius: 8, padding: "8px 12px", cursor: "pointer", marginBottom: 2,
                  boxShadow: isSelected ? `0 2px 8px -2px ${color}25` : "none",
                  transition: "all 0.15s ease", width: "100%", boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    width: 18, height: 18, borderRadius: 4,
                    border: `1.5px solid ${isSelected ? color : C.borderBright}`,
                    background: isSelected ? color : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, boxShadow: isSelected ? `0 0 6px ${color}66` : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {isSelected && <IconCheck size={12} color="#FFFFFF" strokeWidth={3} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: isSelected ? (C.isDark !== false ? C.white : C.accent) : C.text, fontSize: 13.5, fontFamily: FONT, fontWeight: isSelected ? 600 : 400, lineHeight: 1.35 }}>
                    {item.name}
                  </div>
                  {item.desc && (
                    <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, marginTop: 2 }}>
                      {item.desc}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
