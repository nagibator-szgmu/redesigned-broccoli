import React from "react";
import { createPortal } from "react-dom";
import { FONT } from "../../../ui/theme";
import { SpotlightOverlay, TooltipCard } from "./TutorialOverlays";

export default function GameTipModal({ tip, gameTipRect, onDismiss, C }) {
  return createPortal(
    <>
      {gameTipRect ? (
        <SpotlightOverlay rect={gameTipRect} accent={C.accent} />
      ) : (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99998,
            background: "rgba(0,0,0,0.6)",
          }}
          onClick={() => {}}
        />
      )}
      <TooltipCard accent={C.accent}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>📖</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, marginBottom: 4 }}>
              Обучение
            </div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{tip.default}</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button
            onClick={onDismiss}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: "transparent",
              fontSize: 12,
              color: C.textDim,
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            Понятно
          </button>
        </div>
      </TooltipCard>
    </>,
    document.body
  );
}
