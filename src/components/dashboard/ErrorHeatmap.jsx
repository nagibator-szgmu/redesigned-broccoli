import React from "react";
import { useTheme } from "../../ui/ThemeContext";
import { FONT, CODE } from "../../ui/theme";

export default function ErrorHeatmap({ students }) {
  const C = useTheme();

  // Вычисляем частоту ошибок в группе
  const totalCases = students.reduce((acc, s) => acc + s.casesPlayed, 0);
  
  let anchoringCount = 0;
  let closureCount = 0;
  let blindnessCount = 0;
  let criticalCount = 0;

  students.forEach(s => {
    s.history.forEach(h => {
      if (h.cognitiveErrors?.anchoring) anchoringCount++;
      if (h.cognitiveErrors?.prematureClosure) closureCount++;
      if (h.cognitiveErrors?.diagnosticBlindness) blindnessCount++;
      if (h.criticalErrorsCount > 0) criticalCount++;
    });
  });

  const getPercent = (count) => {
    if (!totalCases) return 0;
    return Math.round((count / totalCases) * 100);
  };

  const errorCategories = [
    {
      name: "Диагностическая слепота (Blindness)",
      desc: "Пропуск базовых/критических исследований (например, глюкометрии при нарушениях сознания или ЭКГ при боли в груди)",
      pct: getPercent(blindnessCount),
      color: C.red
    },
    {
      name: "Эффект якоря (Anchoring Effect)",
      desc: "Студент следовал неверной гипотезе и назначал нецелевые препараты, игнорируя реальное состояние",
      pct: getPercent(anchoringCount),
      color: C.orange || C.yellow
    },
    {
      name: "Преждевременное закрытие (Premature Closure)",
      desc: "Диагностический поиск завершен слишком рано, выполнено менее 50% обязательных тестов по чек-листу",
      pct: getPercent(closureCount),
      color: C.yellow
    },
    {
      name: "Критические ошибки (Fails)",
      desc: "Назначение абсолютно противопоказанных препаратов или летальный исход пациента в ходе симуляции",
      pct: getPercent(criticalCount),
      color: C.red
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 13, color: C.textDim, fontFamily: FONT, marginBottom: 4 }}>
        Анализ ошибок на основе {totalCases} симуляций, пройденных студентами этой группы:
      </div>
      {errorCategories.map((cat, idx) => (
        <div key={idx} style={{
          background: C.panel2,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: FONT }}>{cat.name}</div>
              <div style={{ fontSize: 12, color: C.text, fontFamily: FONT, marginTop: 4, lineHeight: 1.5 }}>{cat.desc}</div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: cat.color, fontFamily: CODE }}>
              {cat.pct}%
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              width: `${cat.pct}%`,
              height: "100%",
              backgroundColor: cat.color,
              borderRadius: 4,
              boxShadow: `0 0 8px ${cat.color}88`
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}
