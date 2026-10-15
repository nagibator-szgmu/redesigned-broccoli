import React from "react";
import { FONT, CODE } from "../../../ui/theme";
import { IconCheck } from "../../../ui/icons";

/** Элемент выбора конкретного параметра анализа */
export default function LabParamItem({ item, isChecked, onToggle, C }) {
  return (
    <div
      onClick={() => onToggle(item.id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 10px",
        borderRadius: 8,
        background: isChecked ? `${C.accent}14` : `${C.border}15`,
        border: `1px solid ${isChecked ? C.accent : C.border}`,
        cursor: "pointer",
        transition: "all 0.12s ease",
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          border: `2px solid ${isChecked ? C.accent : C.textDim}`,
          background: isChecked ? C.accent : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {isChecked && <IconCheck size={11} color={C.bg} strokeWidth={3} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: isChecked ? C.text : C.textDim, fontFamily: FONT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.name}
        </div>
        <div style={{ fontSize: 10, color: C.textDim, fontFamily: CODE }}>
          Норма: {item.refRange} {item.unit}
        </div>
      </div>
    </div>
  );
}
