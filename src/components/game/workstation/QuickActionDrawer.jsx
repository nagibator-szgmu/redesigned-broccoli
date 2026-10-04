import React from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import { IconMicroscope, IconPill } from "../../../ui/icons";
import DiagTab from "./DiagTab";
import TreatPanel from "../TreatPanel";
import { useSwipeDownDismiss } from "./useSwipeDownDismiss";

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
  const { dragY, isDragging, gestureProps } = useSwipeDownDismiss(onClose);

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
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle & Header */}
        <div
          {...gestureProps}
          style={{
            flexShrink: 0,
            padding: "8px 14px 10px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
            cursor: "grab",
          }}
        >
          <div
            style={{
              alignSelf: "center",
              width: 40,
              height: 4.5,
              borderRadius: 3,
              background: C.borderBright,
              opacity: 0.7,
            }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <span
              style={{
                fontSize: 13.5,
                fontWeight: 700,
                color: C.white,
                fontFamily: FONT,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Icon size={15} color={accentColor} />
              {title}
            </span>
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
