import React from "react";
import { createPortal } from "react-dom";
import { FONT } from "../../../ui/theme";
import { SpotlightOverlay } from "./TutorialOverlays";
import { VITAL_TIPS } from "./tutorialData";

export default function VitalSeqModal({
  sub,
  inVitalSub,
  vitalRect,
  onDismiss,
  onNext,
  C,
}) {
  return createPortal(
    <>
      {vitalRect ? (
        <SpotlightOverlay rect={vitalRect} accent={C.accent} />
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
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 99999,
          maxWidth: 420,
          width: "90%",
          background: "rgba(18,28,43,0.97)",
          border: `1px solid ${C.accent}44`,
          borderRadius: 14,
          padding: "20px 22px",
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 20px ${C.accent}22`,
          fontFamily: FONT,
        }}
      >
        <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, marginBottom: 8 }}>
          Витальные показатели · {inVitalSub + 1} / {VITAL_TIPS.length}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 8 }}>
          {sub.label}
        </div>
        <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{sub.default}</div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
          <button
            onClick={onDismiss}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: "transparent",
              fontSize: 12,
              color: C.textDim,
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            {inVitalSub < VITAL_TIPS.length - 1 ? "Пропустить" : "Готово"}
          </button>
          <button
            onClick={onNext}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: `linear-gradient(135deg,${C.accent},${C.green})`,
              fontSize: 13,
              fontWeight: 600,
              color: C.bg,
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            {inVitalSub < VITAL_TIPS.length - 1 ? "Далее →" : "Понятно"}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
