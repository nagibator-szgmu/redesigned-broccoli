import { useState } from "react";
import { FONT } from "../../ui/theme";

/**
 * Filter chip with clean typography, refined padding, and smooth active/hover states.
 */
function SpecChip({ active, onClick, label, C }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "7px 16px",
        borderRadius: 20,
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        letterSpacing: "-0.01em",
        lineHeight: 1.2,
        fontFamily: FONT,
        cursor: "pointer",
        userSelect: "none",
        outline: "none",
        transform: pressed ? "scale(0.97)" : "none",
        background: active
          ? `${C.accent}22`
          : hovered
          ? (C.dimBg || `${C.accent}10`)
          : C.btnBg,
        border: `1px solid ${
          active
            ? C.accent
            : hovered
            ? (C.borderBright || C.border)
            : C.border
        }`,
        color: active
          ? C.accent
          : hovered
          ? C.text
          : C.textDim,
        boxShadow: active
          ? `0 2px 10px ${C.accent}30`
          : hovered
          ? "0 2px 8px rgba(0, 0, 0, 0.12)"
          : "none",
        transition:
          "background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease, transform 0.1s ease",
      }}
    >
      {label}
    </button>
  );
}

/**
 * CaseExplorerBar component for quick specialization filter chips.
 * Pure typography and sleek minimalist aesthetic without visual clutter.
 */
export default function CaseExplorerBar({ specFilter, setSpecFilter, navSpec, t, C }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
      <SpecChip
        active={!specFilter}
        onClick={() => setSpecFilter(null)}
        label={t("filter.all")}
        C={C}
      />
      {navSpec.map(({ label, cat }) => (
        <SpecChip
          key={cat}
          active={specFilter === cat}
          onClick={() => setSpecFilter(specFilter === cat ? null : cat)}
          label={label}
          C={C}
        />
      ))}
    </div>
  );
}

