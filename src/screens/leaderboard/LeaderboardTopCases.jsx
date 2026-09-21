import React from "react";
import { FONT, CODE } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { IconTrophy } from "../../ui/icons";
import { CAT_META } from "./leaderboardUtils";

/** Список лучших результатов клинических сценариев */
export default function LeaderboardTopCases({ topCases = [], isMobile = false }) {
  const C = useTheme();

  if (!topCases || topCases.length === 0) return null;

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <IconTrophy size={14} color={C.yellow} />
        <span style={{ fontFamily: FONT, fontSize: 11, letterSpacing: 1, color: C.yellow, textTransform: "uppercase", fontWeight: 600 }}>
          Лучшие результаты
        </span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${C.yellow}55,transparent)` }} />
      </div>
      {topCases.map((s, i) => {
        const cm = CAT_META[s.category] || { icon: "🏥", color: C.accent };
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`;
        return (
          <div
            key={s.id || i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 8 : 12,
              padding: isMobile ? "7px 0" : "8px 0",
              borderBottom: i < topCases.length - 1 ? `1px solid ${C.border}22` : "none",
            }}
          >
            <span style={{ fontSize: isMobile ? 14 : 16, width: 28, textAlign: "center", fontFamily: CODE }}>{medal}</span>
            <span style={{ fontSize: 14 }}>{cm.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: isMobile ? 12 : 13, color: C.white, fontFamily: FONT, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {s.caseName || s.caseId || "Клинический случай"}
              </div>
              <div style={{ fontSize: isMobile ? 10 : 11, color: C.textDim, fontFamily: FONT, marginTop: 1 }}>
                {s.date ? new Date(s.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" }) : "—"}
              </div>
            </div>
            <span
              style={{
                fontSize: isMobile ? 15 : 17,
                fontWeight: 700,
                color: (s.score || 0) >= 85 ? C.green : (s.score || 0) >= 70 ? C.accent : (s.score || 0) >= 50 ? C.yellow : C.red,
                fontFamily: CODE,
              }}
            >
              {s.score || 0}
            </span>
          </div>
        );
      })}
    </div>
  );
}
