import React, { useState } from "react";
import { FONT, RADIUS } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { getCategorizedChips } from "../../../engine/dialogue/dialogueTreeEngine";

/**
 * QuickInterviewChips — Категоризированные чипсы клинического опроса.
 */
export default function QuickInterviewChips({ caseData = {}, onSelectQuestion, disabled = false }) {
  const C = useTheme();
  const categories = getCategorizedChips(caseData);
  const [activeTab, setActiveTab] = useState(categories[0]?.id || "complaints");

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
      {/* Вкладки категорий опроса */}
      <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 2 }}>
        {categories.map((cat) => {
          const isActive = cat.id === activeTab;
          return (
            <button
              key={cat.id}
              type="button"
              data-testid={`dialogue-tab-${cat.id}`}
              onClick={() => setActiveTab(cat.id)}
              style={{
                background: isActive ? `${C.accent}25` : C.dimBg,
                border: `1px solid ${isActive ? C.accent : "transparent"}`,
                borderRadius: RADIUS.sm,
                padding: "3px 7px",
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? C.accent : C.textDim,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: FONT,
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {cat.title}
            </button>
          );
        })}
      </div>

      {/* Быстрые вопросы выбранной категории */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {currentCategory?.questions?.map((q, idx) => (
          <button
            key={`${currentCategory.id}-${idx}`}
            type="button"
            data-testid={`dialogue-chip-${currentCategory.id}-${idx}`}
            disabled={disabled}
            onClick={() => onSelectQuestion(q)}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: RADIUS.sm,
              padding: "4px 8px",
              fontSize: 11,
              color: disabled ? C.textDim : C.accent,
              cursor: disabled ? "not-allowed" : "pointer",
              fontFamily: FONT,
              opacity: disabled ? 0.5 : 1,
              transition: "border-color 0.15s, background 0.15s",
            }}
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}
