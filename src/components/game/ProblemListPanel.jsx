import React from "react";
import { useTheme } from "../../ui/ThemeContext";
import { FONT, CODE } from "../../ui/theme";
import { STitle } from "../../ui/components";
import { deriveProblemList } from "../../engine/problemListEngine";

/**
 * Панель объективного списка клинических проблем пациента (Problem List).
 */
export default function ProblemListPanel({ ps, revealedResults = {} }) {
  const C = useTheme();
  const problems = deriveProblemList(ps, revealedResults);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <STitle icon="📋" label="Клинические проблемы (Problem List)" color={C.accent} />
        <span style={{ fontSize: 10, color: C.textDim, fontFamily: FONT }}>
          Активно: <strong>{problems.length}</strong>
        </span>
      </div>

      {problems.length === 0 ? (
        <div style={{ padding: "8px 12px", borderRadius: 8, background: C.btnBg, border: `1px solid ${C.btnBorder}`, fontSize: 11, color: C.green, fontFamily: FONT }}>
          ✓ Острых синдромных нарушений не выявлено
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {problems.map(prob => {
            const isCrit = prob.severity === "critical";
            const borderCol = isCrit ? `${C.red}60` : `${C.yellow}50`;
            const bgCol = isCrit ? `${C.red}12` : `${C.yellow}10`;
            const tagCol = isCrit ? C.red : C.yellow;

            return (
              <div
                key={prob.id}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: bgCol,
                  border: `1px solid ${borderCol}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.white, fontFamily: FONT }}>
                    {prob.label}
                  </span>
                  <span style={{
                    fontSize: 9,
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: `${tagCol}25`,
                    color: tagCol,
                    fontFamily: FONT,
                    textTransform: "uppercase"
                  }}>
                    {isCrit ? "Критично" : "Умеренно"}
                  </span>
                </div>

                {prob.evidence && prob.evidence.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 2 }}>
                    {prob.evidence.map((ev, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 10,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: C.btnBg,
                          border: `1px solid ${C.btnBorder}`,
                          color: C.textDim,
                          fontFamily: CODE
                        }}
                      >
                        {ev}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
