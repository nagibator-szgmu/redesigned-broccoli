import React, { useState } from "react";
import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";

/**
 * Панель шагов приёма в поликлинике с крупными векторными иконками и выверенной типографикой.
 */
export function StepBar({ steps, activeStep, onStepClick, canClickStep, isMobile = false }) {
  const C = useTheme();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const iconSize = isMobile ? 20 : 22;

  return (
    <div
      style={{
        display: "flex",
        gap: isMobile ? 6 : 8,
        marginBottom: 14,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {steps.map((s, i) => {
        const isActive = i === activeStep;
        const isClickable = canClickStep ? canClickStep(i) : i <= activeStep;
        const isHovered = hoveredIdx === i && isClickable;

        const IconComponent = s.Icon;
        const iconColor = isActive ? C.accent : isHovered ? C.text : C.textDim;
        const iconEl = IconComponent ? (
          <IconComponent size={iconSize} color={iconColor} strokeWidth={2} />
        ) : React.isValidElement(s.icon) ? (
          React.cloneElement(s.icon, { size: iconSize, color: iconColor, strokeWidth: 2 })
        ) : (
          s.icon
        );

        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onStepClick && isClickable && onStepClick(s.key)}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            disabled={!isClickable}
            style={{
              flex: 1,
              minWidth: 0,
              minHeight: isMobile ? 62 : 72,
              padding: isMobile ? "8px 4px" : "10px 8px",
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              background: isActive
                ? `${C.accent}1c`
                : isHovered
                ? C.dimBg || `${C.border}20`
                : C.panel,
              border: `1.5px solid ${isActive ? C.accent : isHovered ? C.borderBright : C.border}`,
              boxShadow: isActive ? `0 4px 16px -2px ${C.accent}30` : "none",
              cursor: isClickable && onStepClick ? "pointer" : "not-allowed",
              opacity: isClickable ? 1 : 0.4,
              transition: "all 0.18s ease",
              userSelect: "none",
              outline: "none",
            }}
          >
            {/* Центрированный контейнер иконки */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                flexShrink: 0,
                color: iconColor,
                transition: "color 0.15s ease",
              }}
            >
              {iconEl}
            </div>

            {/* Сбалансированный контейнер надписи */}
            <div
              style={{
                fontSize: isMobile ? 11 : 12,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? C.white : isHovered ? C.text : C.textDim,
                fontFamily: FONT,
                textAlign: "center",
                lineHeight: 1.25,
                minHeight: isMobile ? 24 : 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: "0 2px",
                boxSizing: "border-box",
                wordBreak: "break-word",
                transition: "color 0.15s ease",
              }}
            >
              {s.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
