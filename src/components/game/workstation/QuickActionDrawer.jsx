import React from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import { IconX, IconMicroscope, IconPill } from "../../../ui/icons";
import DiagTab from "./DiagTab";
import TreatPanel from "../TreatPanel";

/**
 * Выдвижная шторка для быстрого назначения анализов и препаратов.
 * Размещается над нижней панелью действий (bottom: 50px) без перекрытия кнопок.
 */
export default function QuickActionDrawer({
  isOpen,
  onClose,
  mode = "diag", // "diag" | "treat"
  selDiag,
  setSelDiag,
  orderedDiag,
  handleOrderTests,
  processingTests,
  t,
  cd,
  selTreat,
  toggleTreatment,
  appliedFx,
  pendingFx,
  treatCat,
  setTreatCat,
}) {
  const C = useTheme();

  if (!isOpen) return null;

  const isDiag = mode === "diag";
  const title = isDiag ? "Назначение обследования" : "Экстренная помощь и терапия";
  const Icon = isDiag ? IconMicroscope : IconPill;
  const accentColor = isDiag ? C.accent : C.green;

  const handleConfirmDiag = () => {
    if (selDiag.length > 0) {
      handleOrderTests();
    }
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: "calc(50px + env(safe-area-inset-bottom, 4px))",
        zIndex: 500,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxHeight: "100%",
          height: "76vh",
          background: C.panelBg,
          borderTop: `1px solid ${C.borderBright}`,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 -8px 30px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle & Header */}
        <div style={{ flexShrink: 0, padding: "8px 14px 6px", borderBottom: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ alignSelf: "center", width: 36, height: 4, borderRadius: 2, background: C.borderBright, opacity: 0.6 }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: C.white, fontFamily: FONT, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Icon size={15} color={accentColor} />
              {title}
            </span>
            <button
              onClick={onClose}
              aria-label="Закрыть"
              style={{
                width: 28, height: 28, borderRadius: 14, background: C.btnBg, border: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.textDim, padding: 0
              }}
            >
              <IconX size={14} />
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {isDiag ? (
            <DiagTab
              selDiag={selDiag}
              setSelDiag={setSelDiag}
              orderedDiag={orderedDiag}
              handleOrderTests={handleConfirmDiag}
              processingTests={processingTests}
              t={t}
            />
          ) : (
            <TreatPanel
              cd={cd}
              selTreat={selTreat}
              toggleTreatment={toggleTreatment}
              appliedFx={appliedFx}
              pendingFx={pendingFx}
              treatCat={treatCat}
              setTreatCat={setTreatCat}
              isMobile
            />
          )}
        </div>
      </div>
    </div>
  );
}
