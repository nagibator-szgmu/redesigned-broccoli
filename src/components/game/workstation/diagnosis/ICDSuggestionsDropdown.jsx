import React from "react";
import { useTheme } from "../../../../ui/ThemeContext";
import { FONT, CODE } from "../../../../ui/theme";

/**
 * Выпадающий список подсказок нозологий и кодов МКБ-10.
 */
export default function ICDSuggestionsDropdown({
  suggestions = [],
  activeSuggestionIdx = -1,
  onSelect,
}) {
  const C = useTheme();

  if (suggestions.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        marginTop: 6,
        background: C.panelBg2,
        border: `1px solid ${C.accent}`,
        borderRadius: 10,
        boxShadow: `0 12px 36px rgba(0,0,0,0.35), 0 0 15px ${C.accent}25`,
        zIndex: 100,
        overflow: "hidden",
        maxHeight: 250,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "6px 12px",
          background: `${C.accent}18`,
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 10.5,
          fontFamily: FONT,
          color: C.accent,
          fontWeight: 600,
        }}
      >
        <span>Подсказки нозологий и кодов МКБ-10:</span>
        <span style={{ fontSize: 9.5, color: C.textDim }}>Нажмите для выбора (или Enter)</span>
      </div>
      {suggestions.map((item, idx) => {
        const isSelected = idx === activeSuggestionIdx;
        return (
          <div
            key={`${item.code}-${idx}`}
            onClick={() => onSelect(item)}
            style={{
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              cursor: "pointer",
              background: isSelected ? `${C.accent}22` : "transparent",
              borderBottom: `1px solid ${C.border}22`,
              transition: "background 0.15s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <span
                style={{
                  background: `${C.purple}33`,
                  border: `1px solid ${C.purple}77`,
                  color: C.purple,
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: CODE,
                  padding: "2px 6px",
                  borderRadius: 4,
                  flexShrink: 0,
                }}
              >
                {item.code}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: isSelected ? C.accent : C.text,
                  fontFamily: FONT,
                  fontWeight: 500,
                  lineHeight: 1.3,
                  wordBreak: "break-word",
                }}
              >
                {item.name}
              </span>
            </div>
            <span
              style={{
                fontSize: 9.5,
                color: C.textDim,
                fontFamily: FONT,
                flexShrink: 0,
                background: C.btnBg,
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              {item.category}
            </span>
          </div>
        );
      })}
    </div>
  );
}
