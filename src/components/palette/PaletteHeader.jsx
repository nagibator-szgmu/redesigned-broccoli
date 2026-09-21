import React from "react";
import { FONT } from "../../ui/theme";

export default function PaletteHeader({ query, setQuery, C }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 18px",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: C.accentDim,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.accent,
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        ⌘
      </div>
      <input
        autoFocus
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Быстрый поиск препарата, анализа, ABCDE или действия... (⌘K)"
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          fontSize: 15,
          color: C.white,
          fontFamily: FONT,
        }}
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          style={{
            background: "transparent",
            border: "none",
            color: C.textDim,
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          ✕
        </button>
      )}
      <span
        style={{
          fontSize: 11,
          color: C.textDim,
          fontFamily: FONT,
          padding: "2px 6px",
          borderRadius: 4,
          background: C.btnBg,
        }}
      >
        ESC
      </span>
    </div>
  );
}
