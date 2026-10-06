import React from "react";

/**
 * Connecting guideline SVG path for Course Map.
 * Renders glowing active line up to current node and subtle line beyond.
 */
export default function CourseMapPathSvg({
  stepsCount,
  currentIndex,
  nodeSpacing,
  nodeCenterX,
  startY,
  C,
}) {
  if (stepsCount <= 1) return null;

  const totalHeight = (stepsCount - 1) * nodeSpacing;
  const currentY = startY + Math.min(currentIndex, stepsCount - 1) * nodeSpacing;

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: startY + totalHeight + 100,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <defs>
        <linearGradient id="activeTrackGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.green} stopOpacity="0.8" />
          <stop offset="100%" stopColor={C.accent} stopOpacity="1" />
        </linearGradient>
        <filter id="trackGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={C.accent} floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Inactive guide track */}
      <line
        x1={nodeCenterX}
        y1={startY}
        x2={nodeCenterX}
        y2={startY + totalHeight}
        stroke={`${C.borderDim}40`}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Active completed/current track */}
      {currentIndex > 0 && (
        <line
          x1={nodeCenterX}
          y1={startY}
          x2={nodeCenterX}
          y2={currentY}
          stroke="url(#activeTrackGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          filter="url(#trackGlow)"
        />
      )}
    </svg>
  );
}
