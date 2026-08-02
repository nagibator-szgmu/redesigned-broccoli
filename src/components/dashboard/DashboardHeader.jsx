import React from "react";
import { useTheme } from "../../ui/ThemeContext";
import { FONT, CODE } from "../../ui/theme";

export default function DashboardHeader({ selectedGroup, setSelectedGroup, stats, onExport, onBack }) {
  const C = useTheme();

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button 
            onClick={onBack}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "8px 16px",
              color: C.accent,
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            ← Назад в меню
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.white, margin: 0 }}>Кабинет Преподавателя</h1>
        </div>

        {/* Group Selector & Export */}
        <div style={{ display: "flex", gap: 12 }}>
          <select 
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            style={{
              background: C.panel,
              border: `1px solid ${C.border}`,
              color: C.white,
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 13,
              outline: "none",
              fontFamily: FONT,
              cursor: "pointer"
            }}
          >
            <option value="302-Л">Группа 302-Л (Лечебное дело)</option>
            <option value="301-Л">Группа 301-Л (Педиатрия)</option>
            <option value="303-П">Группа 303-П (Проф. медицина)</option>
          </select>
          <button 
            onClick={onExport}
            style={{
              background: C.accent,
              border: "none",
              borderRadius: 10,
              padding: "8px 18px",
              color: C.bg,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: FONT
            }}
          >
            📥 Экспорт отчета
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 28 }}>
        {[
          { label: "Всего симуляций пройдено", val: stats.totalPlayed, color: C.accent },
          { label: "Средний балл группы", val: `${stats.avgScore}/100`, color: stats.avgScore >= 75 ? C.green : C.yellow },
          { label: "Критических ошибок совершено", val: stats.totalCritErrors, color: stats.totalCritErrors > 0 ? C.red : C.textDim }
        ].map((item, idx) => (
          <div key={idx} style={{
            background: C.panelBg,
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            padding: "16px 20px"
          }}>
            <div style={{ fontSize: 12, color: C.textDim, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>{item.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: item.color, marginTop: 8, fontFamily: CODE }}>{item.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
