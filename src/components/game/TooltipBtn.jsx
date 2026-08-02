import { useState } from "react";
import { createPortal } from "react-dom";
import { FONT } from "../../ui/theme";

export default function TooltipBtn({ text, C, style }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", ...style }}>
      <span onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 14, height: 14, borderRadius: "50%", background: `${C.textDim}30`,
          color: C.textDim, fontSize: 9, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>?</span>
      {open && createPortal(<>
        <div style={{ position: "fixed", inset: 0, zIndex: 9999 }} onClick={() => setOpen(false)} />
        <div style={{ position: "fixed", bottom: 60, left: "50%", transform: "translateX(-50%)",
          zIndex: 10000, maxWidth: 260, background: C.panelBg, border: `1px solid ${C.border}`,
          borderRadius: 10, padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          fontFamily: FONT, fontSize: 12, color: C.text, lineHeight: 1.6 }}>{text}</div>
      </>, document.body)}
    </span>
  );
}
