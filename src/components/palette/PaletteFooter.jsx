import React from "react";
import { FONT } from "../../ui/theme";

export default function PaletteFooter({ C }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 18px",
        borderTop: `1px solid ${C.border}`,
        background: C.panelBg,
        fontSize: 11,
        color: C.textDim,
        fontFamily: FONT,
      }}
    >
      <span>↑↓ навигация</span>
      <span>↵ применить</span>
      <span>ESC закрыть</span>
    </div>
  );
}
