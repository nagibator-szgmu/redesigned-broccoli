import React from "react";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";

/** Пустое состояние при отсутствии решенных клинических кейсов */
export default function LeaderboardEmptyState({ setPhase, isMobile = false }) {
  const C = useTheme();

  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: isMobile ? 12 : 14,
        textAlign: "center",
        padding: isMobile ? "32px 16px" : "44px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
      }}
    >
      <div style={{ fontSize: 44 }}>🏆</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: C.white, fontFamily: FONT }}>
        История прохождений пуста
      </div>
      <div style={{ fontSize: 13, color: C.textDim, maxWidth: 460, lineHeight: 1.6, fontFamily: FONT }}>
        Вы ещё не решили ни одного клинического случая. Пройдите первый сценарий в тренажёре, чтобы открыть персональную статистику, дипломы и рейтинг врачебных навыков.
      </div>
      <button
        onClick={() => setPhase("menu")}
        style={{
          marginTop: 8,
          background: `linear-gradient(135deg, ${C.accent}, ${C.green})`,
          border: "none",
          borderRadius: 10,
          padding: "10px 24px",
          color: C.bg,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: FONT,
        }}
      >
        Перейти к клиническим кейсам
      </button>
    </div>
  );
}
