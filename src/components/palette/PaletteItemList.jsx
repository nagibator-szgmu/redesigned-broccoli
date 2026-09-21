import React from "react";
import { FONT } from "../../ui/theme";

export default function PaletteItemList({
  listRef,
  items,
  selectedIndex,
  setSelectedIndex,
  query,
  C,
}) {
  return (
    <div
      ref={listRef}
      style={{
        maxHeight: 380,
        overflowY: "auto",
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {items.length === 0 ? (
        <div
          style={{
            padding: "32px 16px",
            textAlign: "center",
            color: C.textDim,
            fontSize: 13,
            fontFamily: FONT,
          }}
        >
          По запросу «{query}» ничего не найдено.
        </div>
      ) : (
        items.map((item, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <div
              key={item.id}
              onClick={item.action}
              onMouseEnter={() => setSelectedIndex(idx)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderRadius: 10,
                cursor: "pointer",
                background: isSelected ? C.accentDim : "transparent",
                border: `1px solid ${isSelected ? `${C.accent}40` : "transparent"}`,
                transition: "background 0.1s ease",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? C.accent : C.white,
                    fontFamily: FONT,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.textDim,
                    fontFamily: FONT,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.sub}
                </div>
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: isSelected ? C.accent : C.textDim,
                  fontFamily: FONT,
                  background: C.btnBg,
                  padding: "3px 8px",
                  borderRadius: 6,
                  flexShrink: 0,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {item.cat}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
