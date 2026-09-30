import React from "react";
import { FONT } from "../../../ui/theme";
import { IconSearch, IconX } from "../../../ui/icons";

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
        flexShrink: 0,
      }}
    >
      <IconSearch size={14} color={C.textDim} />
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
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconX size={12} />
        </button>
      )}
    </div>
  );
}
