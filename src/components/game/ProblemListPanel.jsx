import React from "react";
import { useTheme } from "../../ui/ThemeContext";
import { FONT, CODE } from "../../ui/theme";
import { STitle, Tooltip } from "../../ui/components";
import { deriveProblemList } from "../../engine/problemListEngine";

/**
 * Панель объективного списка клинических проблем пациента (Problem List).
 */
export default function ProblemListPanel({ ps, revealedResults = {} }) {
  const C = useTheme();
  const problems = deriveProblemList(ps, revealedResults);

  const getEvidenceTooltip = (evText = "") => {
    if (evText.includes("Глазго") || evText.includes("GCS")) {
      return "Шкала ком Глазго: 15 (ясное), 13-14 (оглушение), 9-12 (сопор), <=8 (кома)";
    }
    if (evText.includes("MAP") || evText.includes("АД")) {
      return "Среднее артериальное давление (норма: 70–105 мм рт. ст.)";
    }
    if (evText.includes("SpO₂")) {
      return "Сатурация кислорода крови (норма: 95–100%)";
    }
    return `Критерий подтверждения синдрома: ${evText}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Tooltip text="Автоматически определяемые клинические синдромы на основе показателей пациента" position="top">
          <STitle icon="📋" label="Клинические проблемы (Problem List)" color={C.accent} />
        </Tooltip>
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
                  <Tooltip text={`Клинический синдром: ${prob.label}`} position="top">
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.white, fontFamily: FONT }}>
                      {prob.label}
                    </span>
                  </Tooltip>
                  <Tooltip text={isCrit ? "Жизнеугрожающее нарушение, требующее немедленной помощи" : "Умеренное отклонение витальных или лабораторных функций"} position="top">
                    <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: `${tagCol}25`,
                      color: tagCol,
                      fontFamily: FONT,
                      textTransform: "uppercase",
                      cursor: "help"
                    }}>
                      {isCrit ? "Критично" : "Умеренно"}
                    </span>
                  </Tooltip>
                </div>

                {prob.evidence && prob.evidence.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 2 }}>
                    {prob.evidence.map((ev, i) => (
                      <Tooltip key={i} text={getEvidenceTooltip(ev)} position="bottom">
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: C.btnBg,
                            border: `1px solid ${C.btnBorder}`,
                            color: C.textDim,
                            fontFamily: CODE,
                            cursor: "help"
                          }}
                        >
                          {ev}
                        </span>
                      </Tooltip>
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
