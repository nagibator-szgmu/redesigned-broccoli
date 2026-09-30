import React, { useState } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";
import { IconChevronDown } from "../../../ui/icons";
import TreatListItem from "./TreatListItem";

/**
 * Collapsible category group for treatments and drug therapies.
 */
export default function TreatAccordionGroup({
  title,
  icon,
  color,
  items = [],
  selTreat = [],
  toggleTreatment,
  appliedFx,
  pendingFx,
  cd,
  isOpen,
  onToggleOpen,
  hideWarnings,
  isMobile,
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
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          background: isOpen ? `${color}10` : hovered ? C.dimBg : "transparent",
          border: `1px solid ${isOpen ? color + "50" : hovered ? C.borderBright : C.border}`,
          borderRadius: 8,
          cursor: "pointer",
          outline: "none",
          transition: "all 0.15s ease",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, flexShrink: 0 }}>
          {icon}
        </span>
        <span
          style={{
            fontFamily: FONT,
            fontSize: 15,
            fontWeight: 600,
            color: C.text,
            flex: 1,
            textAlign: "left",
          }}
        >
          {title}
        </span>

        {/* Selected count badge */}
        {selCount > 0 && (
          <span
            style={{
              fontFamily: CODE,
              fontSize: 10,
              fontWeight: 700,
              color: "#FFFFFF",
              background: color,
              borderRadius: 9999,
              padding: "1px 6px",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {selCount}
          </span>
        )}

        {/* Total count badge */}
        <span
          style={{
            fontFamily: CODE,
            fontSize: 10,
            color: C.textDim,
            background: C.dimBg,
            borderRadius: 4,
            padding: "1px 4px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {items.length}
        </span>

        {/* Chevron icon */}
        <div
          style={{
            color: isOpen ? color : C.textDim,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease, color 0.15s ease",
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconChevronDown size={12} color="currentColor" />
        </div>
      </button>

      {/* Treatments inside category */}
      {isOpen && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingLeft: 4, paddingRight: 2 }}>
          {items.map((item) => {
            const isSelected = selTreat.includes(item.id);
            const isPending = pendingFx?.has(item.id);
            const isApplied = appliedFx?.has(item.id);
            const isDangerous = cd?.wrongTreat?.includes(item.id);
            const isContraindicated = cd?.contraindicatedTreat?.includes(item.id);
            const isBad = isDangerous || isContraindicated;

            return (
              <TreatListItem
                key={item.id}
                item={item}
                isSelected={isSelected}
                isPending={isPending}
                isApplied={isApplied}
                isBad={isBad}
                hideWarnings={hideWarnings}
                onToggle={() => toggleTreatment(item.id)}
                isMobile={isMobile}
                color={color}
                C={C}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
