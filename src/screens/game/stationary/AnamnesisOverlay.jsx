import React from "react";
import { createPortal } from "react-dom";
import { FONT } from "../../../ui/theme";
import { IconX } from "../../../ui/icons";

/** Anamnesis modal overlay for stationary day start */
export default function AnamnesisOverlay({
  show,
  onClose,
  anamnesisItems = [],
  C,
  t,
}) {
  if (!show) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99998,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.overlayBg,
          backdropFilter: "blur(24px)",
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: "20px 24px",
          maxWidth: 500,
          width: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
          fontFamily: FONT,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{t("history.title")}</span>
          <button
            onClick={onClose}
            style={{
              background: C.dimBg,
              border: "none",
              color: C.textDim,
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconX size={13} color={C.textDim} />
          </button>
        </div>
        {anamnesisItems.map((item, i) => (
          <div key={i} style={{ marginBottom: i < anamnesisItems.length - 1 ? 12 : 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, marginBottom: 4 }}>{item.title}</div>
            <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, margin: 0, padding: "8px 10px", background: `${C.textDim}08`, borderRadius: 8, borderLeft: `3px solid ${C.green}` }}>
              {item.text}
            </p>
          </div>
        ))}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: 14,
            padding: "10px",
            borderRadius: 10,
            background: `linear-gradient(135deg,${C.accent},${C.green})`,
            border: "none",
            fontSize: 14,
            fontWeight: 700,
            color: C.bg,
            cursor: "pointer",
            fontFamily: FONT,
          }}
        >
          {t("stationary.startDay")}
        </button>
      </div>
    </div>,
    document.body
  );
}
