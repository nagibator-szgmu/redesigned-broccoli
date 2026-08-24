import React from "react";
import { useTheme } from "../../ui/ThemeContext";
import { FONT, CODE } from "../../ui/theme";
import { Tooltip } from "../../ui/components";

export default function DashboardHeader({ selectedGroup, setSelectedGroup, stats, onExport, onBack, realCount = 0 }) {
  const C = useTheme();

  const statItems = [
    {
      label: "Всего симуляций пройдено",
      val: stats.totalPlayed,
      color: C.accent,
      title: "ОБЩИЙ ОБЪЕМ СИМУЛЯЦИЙ",
      refRange: "Показатель активности группы",
      text: "Суммарное количество завершенных клинических сценариев студентом или академической группой"
    },
    {
      label: "Средний балл группы",
      val: `${stats.avgScore}/100`,
      color: stats.avgScore >= 75 ? C.green : C.yellow,
      title: "УСПЕВАЕМОСТЬ ПО ШКАЛЕ ОСКЭ",
      refRange: "Норма освоения: >= 70 / 100 б.",
      text: "Среднеарифметическая оценка выполнения диагностического алгоритма и подбора терапии"
    },
    {
      label: "Критических ошибок совершено",
      val: stats.totalCritErrors,
      color: stats.totalCritErrors > 0 ? C.red : C.textDim,
      title: "КРИТИЧЕСКИЕ НАРУШЕНИЯ (FAILS)",
      refRange: "Допустимый лимит: 0 ошибок",
      text: "Общее число опасных жизнеугрожающих назначений, противопоказанных медикаментов или гибели пациентов"
    }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
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
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Tooltip title="ИСТОЧНИК ДАННЫХ" text="Переключение между сохраненными реальными сессиями локального студента и контрольными демо-группами" position="bottom">
            <select 
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              style={{
                background: C.panel,
                border: `1px solid ${selectedGroup === "real" ? C.accent : C.border}`,
                color: selectedGroup === "real" ? C.accent : C.white,
                borderRadius: 10,
                padding: "8px 16px",
                fontSize: 13,
                outline: "none",
                fontFamily: FONT,
                fontWeight: selectedGroup === "real" ? 700 : 400,
                cursor: "pointer"
              }}
            >
              <option value="real">📍 Реальные данные ({realCount} сессий)</option>
              <option value="302-Л">Группа 302-Л (Лечебное дело - Демо)</option>
              <option value="301-Л">Группа 301-Л (Педиатрия - Демо)</option>
              <option value="303-П">Группа 303-П (Проф. медицина - Демо)</option>
            </select>
          </Tooltip>

          <Tooltip title="ЭКСПОРТ АНАЛИТИКИ" text="Скачать детализированную ведомость успеваемости и ошибок группы в формате CSV (Excel)" position="bottom">
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
          </Tooltip>
        </div>
      </div>

      {/* Stats Widgets */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 28 }}>
        {statItems.map((item, idx) => (
          <Tooltip key={idx} title={item.title} refRange={item.refRange} text={item.text} position="top" style={{ width: "100%" }}>
            <div style={{
              width: "100%",
              background: C.panelBg,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: "16px 20px",
              boxSizing: "border-box"
            }}>
              <div style={{ fontSize: 12, color: C.textDim, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.color, marginTop: 8, fontFamily: CODE }}>{item.val}</div>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

