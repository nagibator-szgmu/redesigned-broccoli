import React from "react";
import { FONT, CODE } from "../../ui/theme";
import { IconCheck, IconLock } from "../../ui/icons";

/**
 * Individual Node on Course Map Path.
 */
export default function CourseMapNode({
  step,
  index,
  status, // "completed" | "current" | "unlocked" | "locked"
  isSelected,
  onSelect,
  isMobile,
  C,
}) {
  const isPassed = status === "completed";
  const isCurrent = status === "current";
  const isLocked = status === "locked";

  const nodeSize = isMobile ? 58 : 66;
  const iconSize = isMobile ? 22 : 26;

  let nodeBg = C.btnBg;
  let nodeBorder = C.btnBorder;
  let nodeShadow = "none";

  if (isPassed) {
    nodeBg = `${C.green}18`;
    nodeBorder = `${C.green}88`;
    nodeShadow = `0 4px 16px ${C.green}30`;
  } else if (isCurrent) {
    nodeBg = `${C.accent}20`;
    nodeBorder = C.accent;
    nodeShadow = `0 0 22px ${C.accent}50, inset 0 0 12px ${C.accent}25`;
  } else if (isLocked) {
    nodeBg = `${C.dimBg}aa`;
    nodeBorder = `${C.borderDim}55`;
  }

  if (isSelected) {
    nodeBorder = C.accent;
    nodeShadow = `0 0 24px ${C.accent}80`;
  }

  return (
    <div
      onClick={() => onSelect(step)}
      style={{
        display: "flex", alignItems: "center", width: "100%", maxWidth: 440,
        margin: "0 auto", cursor: isLocked ? "default" : "pointer", padding: "6px 12px",
        borderRadius: 16, background: isSelected ? `${C.accent}12` : "transparent",
        border: isSelected ? `1px solid ${C.accent}40` : "1px solid transparent",
        transition: "all 0.25s ease", opacity: isLocked ? 0.45 : 1, gap: 16,
      }}
    >
      {/* Node Circle Container */}
      <div
        style={{
          width: nodeSize, height: nodeSize, borderRadius: "50%", background: nodeBg,
          border: `2px solid ${nodeBorder}`, boxShadow: nodeShadow, display: "flex",
          alignItems: "center", justifyContent: "center", position: "relative",
          flexShrink: 0, color: isPassed ? C.green : isCurrent ? C.accent : step.catColor,
        }}
      >
        {isPassed ? (
          <IconCheck size={iconSize} color={C.green} strokeWidth={2.5} />
        ) : isLocked ? (
          <IconLock size={iconSize - 4} color={C.textDim} />
        ) : (
          React.cloneElement(step.icon, {
            size: iconSize,
            color: isCurrent ? C.accent : step.catColor,
          })
        )}

        {/* Index badge */}
        <div
          style={{
            position: "absolute", bottom: -3, right: -3, width: 20, height: 20,
            borderRadius: "50%", background: C.panel,
            border: `1.5px solid ${isPassed ? C.green : isCurrent ? C.accent : C.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9.5, fontWeight: 700, fontFamily: CODE,
            color: isPassed ? C.green : isCurrent ? C.accent : C.textDim,
          }}
        >
          {index + 1}
        </div>
      </div>

      {/* Label and Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: step.catColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}>
          <span>{step.catName}</span>
          {isCurrent && (
            <span style={{ fontSize: 9, color: C.accent, background: `${C.accent}20`, padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>
              ТЕКУЩИЙ
            </span>
          )}
        </div>

        <div style={{ fontSize: isMobile ? 14 : 15, color: isCurrent ? C.white : isPassed ? C.text : C.textDim, fontWeight: isCurrent || isSelected ? 700 : 500, fontFamily: FONT, lineHeight: 1.3, marginBottom: 4 }}>
          {step.name}
        </div>

        <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT }}>
          {isPassed ? "Пройден" : isCurrent ? `${step.cases.length} клинических кейсов` : isLocked ? "Требуется завершить предыдущий" : `${step.cases.length} кейса`}
        </div>
      </div>
    </div>
  );
}
