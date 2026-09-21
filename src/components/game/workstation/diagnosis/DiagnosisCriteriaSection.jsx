import React from "react";
import { useTheme } from "../../../../ui/ThemeContext";
import { FONT, CODE } from "../../../../ui/theme";
import { STitle } from "../../../../ui/components";

/**
 * Чеклист опорных клинических критериев для обоснования диагноза.
 */
export default function DiagnosisCriteriaSection({
  availableCriteria = [],
  selectedCriteria = new Set(),
  toggleCriterion,
}) {
  const C = useTheme();

  return (
    <div
      style={{
        background: C.panelBg,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
        <STitle icon="📋" label="Опорные диагностические критерии" color={C.accent} />
        <span style={{ fontSize: 11, color: selectedCriteria.size > 0 ? C.green : C.textDim, fontFamily: FONT, fontWeight: 600 }}>
          Выбрано: {selectedCriteria.size} из {availableCriteria.length}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: 11, color: C.textDim, fontFamily: FONT, lineHeight: 1.4 }}>
        Отметьте данные анамнеза, осмотра и исследований, на которых базируется ваш диагноз:
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
        {availableCriteria.length === 0 ? (
          <div
            style={{
              padding: "12px",
              textAlign: "center",
              color: C.textDim,
              fontSize: 12,
              fontStyle: "italic",
              background: C.headerBg2,
              borderRadius: 8,
            }}
          >
            Назначьте исследования во вкладке «Исследования», чтобы получить объективные данные для обоснования.
          </div>
        ) : (
          availableCriteria.map((crit) => {
            const isChecked = selectedCriteria.has(crit.id);
            return (
              <div
                key={crit.id}
                onClick={() => toggleCriterion(crit.id)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 8,
                  cursor: "pointer",
                  background: isChecked ? `${C.accent}14` : C.btnBg,
                  border: `1px solid ${isChecked ? `${C.accent}66` : C.btnBorder}`,
                  transition: "all 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    border: `1.5px solid ${isChecked ? C.accent : C.textDim}`,
                    background: isChecked ? C.accent : "transparent",
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 800,
                    marginTop: 2,
                    flexShrink: 0,
                  }}
                >
                  {isChecked ? "✓" : ""}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 12 }}>{crit.icon}</span>
                    <span
                      style={{
                        fontSize: 10,
                        color: isChecked ? C.accent : C.textDim,
                        textTransform: "uppercase",
                        fontWeight: 700,
                        fontFamily: CODE,
                        letterSpacing: 0.5,
                      }}
                    >
                      {crit.category}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: isChecked ? C.white : C.text, fontFamily: FONT, lineHeight: 1.4, wordBreak: "break-word" }}>
                    {crit.label}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
