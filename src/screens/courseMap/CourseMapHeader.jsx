import React from "react";
import { FONT, CODE } from "../../ui/theme";
import { HeaderBackBtn } from "../../ui/components";

/**
 * Header for Course Map Screen with clean progress HUD.
 */
export default function CourseMapHeader({
  onBack,
  title,
  completedCount,
  totalCount,
  C,
}) {
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header
      style={{
        height: 58,
        background: C.headerBg,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        flexShrink: 0,
        zIndex: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <HeaderBackBtn onClick={onBack} label="Меню" />
        <div style={{ width: 1, height: 20, background: C.border }} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.white, fontFamily: FONT, letterSpacing: -0.2 }}>
            {title}
          </div>
          <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT }}>
            Клинический трек подготовки
          </div>
        </div>
      </div>

      {/* Progress HUD Widget */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: `${C.panelBg}cc`,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "6px 14px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.white, fontFamily: CODE }}>
              {completedCount} / {totalCount}
            </span>
            <span style={{ fontSize: 11, color: C.textDim, fontFamily: FONT }}>
              пройдено
            </span>
          </div>
          {/* Progress bar line */}
          <div
            style={{
              width: 100,
              height: 4,
              borderRadius: 2,
              background: `${C.borderDim}55`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${percent}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${C.accent}, ${C.green})`,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `${C.green}15`,
            border: `1px solid ${C.green}35`,
            color: C.green,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: CODE,
          }}
        >
          {percent}%
        </div>
      </div>
    </header>
  );
}
