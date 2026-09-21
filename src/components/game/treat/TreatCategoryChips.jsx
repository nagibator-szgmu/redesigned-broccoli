import React from "react";
import { FONT } from "../../../ui/theme";
import { TREAT_GROUPS } from "./treatGroups";

export default function TreatCategoryChips({ treatCat, setTreatCat, C }) {
  return (
    <div
      className="no-scrollbar"
      style={{
        display: "flex",
        gap: 4,
        overflowX: "auto",
        paddingBottom: 6,
        marginBottom: 8,
        flexShrink: 0,
        WebkitOverflowScrolling: "touch",
      }}
    >
      {TREAT_GROUPS.map((g) => {
        const isActive = (treatCat || "all") === g.id;
        return (
          <button
            key={g.id}
            onClick={() => setTreatCat?.(g.id)}
            style={{
              padding: "4px 10px",
              borderRadius: 8,
              border: `1px solid ${isActive ? C.green : C.btnBorder}`,
              background: isActive ? `${C.green}20` : C.btnBg,
              color: isActive ? C.green : C.textDim,
              fontSize: 11,
              fontWeight: isActive ? 700 : 500,
              fontFamily: FONT,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {g.label}
          </button>
        );
      })}
    </div>
  );
}
