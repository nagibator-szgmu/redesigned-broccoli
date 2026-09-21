import React from "react";
import { FONT, CODE } from "../../../ui/theme";

export default function ProblemListLoading({ timeLeft, progress, C }) {
  return (
    <div
      style={{
        marginBottom: 12,
        padding: "12px 14px",
        borderRadius: 12,
        background: C.panelBg,
        border: `1px solid ${C.accent}60`,
        boxShadow: `0 4px 18px rgba(0,0,0,0.35), 0 0 12px ${C.accent}15`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              border: `2px solid ${C.accent}40`,
              borderTopColor: C.accent,
              animation: "spinGear 0.8s linear infinite",
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, fontFamily: FONT }}>
            Запрос к наставнику...
          </span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, fontFamily: CODE }}>
          {timeLeft} сек
        </span>
      </div>

      {/* Полоса прогресса */}
      <div
        style={{
          width: "100%",
          height: 6,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${C.accent} 0%, ${C.purple} 100%)`,
            borderRadius: 4,
            transition: "width 0.1s linear",
          }}
        />
      </div>

      <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, lineHeight: 1.3 }}>
        Сопоставление витальных функций, гемодинамики и данных осмотра...
      </div>
    </div>
  );
}
