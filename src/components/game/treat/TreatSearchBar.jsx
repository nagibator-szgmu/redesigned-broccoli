import React from "react";
import { FONT } from "../../../ui/theme";

export default function TreatSearchBar({
  searchQuery,
  setSearchQuery,
  placeholder,
  C,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: C.headerBg2,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "6px 12px",
        marginBottom: 8,
        backdropFilter: "blur(8px)",
      }}
    >
      <span style={{ fontSize: 13, color: C.textDim }}>🔍</span>
      <input
        className="seamless-input"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder || "Фильтр списка..."}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          color: C.text,
          fontFamily: FONT,
          fontSize: 13,
        }}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          style={{
            background: "transparent",
            border: "none",
            color: C.textDim,
            cursor: "pointer",
            padding: "2px 4px",
            fontSize: 13,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
