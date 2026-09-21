import React from "react";
import { createPortal } from "react-dom";
import { FONT } from "../../../ui/theme";
import { SpotlightOverlay, TooltipCard } from "./TutorialOverlays";
import { MENU_TOUR_STEPS } from "./tutorialData";

export default function MenuTourModal({
  step,
  inMenuTour,
  menuRect,
  onNext,
  onSkip,
  C,
}) {
  return createPortal(
    <>
      <SpotlightOverlay rect={menuRect} accent={C.accent} />
      <TooltipCard accent={C.accent}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>📍</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, marginBottom: 4 }}>
              Тур по меню · {inMenuTour} / {MENU_TOUR_STEPS.length}
            </div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{step.default}</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
          {inMenuTour <= MENU_TOUR_STEPS.length && (
            <button
              onClick={onSkip}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: "transparent",
                fontSize: 12,
                color: C.textDim,
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              Пропустить
            </button>
          )}
          <button
            onClick={onNext}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border: "none",
              background: `linear-gradient(135deg,${C.accent},${C.green})`,
              fontSize: 12,
              fontWeight: 600,
              color: C.bg,
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            {inMenuTour < MENU_TOUR_STEPS.length ? "Далее" : "Понятно"}
          </button>
        </div>
      </TooltipCard>
    </>,
    document.body
  );
}
