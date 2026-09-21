import React from "react";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { IconTrophy, IconGraduationCap } from "../../ui/icons";

/** Переключатель вкладок: Статистика и Сертификаты */
export default function LeaderboardTabSwitcher({ activeTab, setActiveTab, earnedCount, totalCerts }) {
  const C = useTheme();

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
      <button
        onClick={() => setActiveTab("stats")}
        className="filter-pill"
        style={{
          flex: 1,
          padding: "11px 16px",
          borderRadius: 12,
          fontFamily: FONT,
          fontSize: 13,
          fontWeight: 700,
          background: activeTab === "stats" ? `${C.accent}20` : C.panel,
          border: `1px solid ${activeTab === "stats" ? C.accent : C.border}`,
          color: activeTab === "stats" ? C.accent : C.textDim,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <IconTrophy size={16} color={activeTab === "stats" ? C.accent : C.textDim} />
        Достижения и рейтинг
      </button>
      <button
        onClick={() => setActiveTab("certs")}
        className="filter-pill"
        style={{
          flex: 1,
          padding: "11px 16px",
          borderRadius: 12,
          fontFamily: FONT,
          fontSize: 13,
          fontWeight: 700,
          background: activeTab === "certs" ? `${C.accent}20` : C.panel,
          border: `1px solid ${activeTab === "certs" ? C.accent : C.border}`,
          color: activeTab === "certs" ? C.accent : C.textDim,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <IconGraduationCap size={16} color={activeTab === "certs" ? C.accent : C.textDim} />
        Сертификаты ({earnedCount}/{totalCerts})
      </button>
    </div>
  );
}
