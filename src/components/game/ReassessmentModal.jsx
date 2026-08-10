import React, { useMemo, useState } from "react";
import { useTheme } from "../../ui/ThemeContext";
import { FONT, CODE } from "../../ui/theme";
import { evaluateReassessment } from "../../engine/reassessmentEngine";
import { evaluateProblemTransitions } from "../../engine/problemListEngine";
import { evaluateClinicalDecision } from "../../engine/decisionEngine";
import { Btn, STitle } from "../../ui/components";

/**
 * Модальное окно повторной оценки и формирования клинического решения (Iterative Reassessment & Decision).
 */
export default function ReassessmentModal({
  isOpen,
  onClose,
  baselinePS,
  currentPS,
  prevProblems = [],
  curProblems = [],
  iteration = 1,
  onConfirmReassessment,
  isMobile = false
}) {
  const C = useTheme();
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const report = useMemo(() => evaluateReassessment(baselinePS, currentPS), [baselinePS, currentPS]);
  const transitions = useMemo(() => evaluateProblemTransitions(prevProblems, curProblems), [prevProblems, curProblems]);
  const decision = useMemo(() => evaluateClinicalDecision(report, transitions), [report, transitions]);

  if (!isOpen) return null;

  const handleRecord = () => {
    const chosenPlan = decision.suggestedPlans.find(p => p.id === selectedPlanId) || decision.suggestedPlans[0];
    onConfirmReassessment?.({ report, decision, chosenPlan, iteration, transitions });
    onClose();
  };

  const getDirColor = (dir) => (dir === "improved" ? C.green : dir === "worsened" ? C.red : dir === "unchanged" ? C.accent : C.textDim);
  const getDirLabel = (dir) => (dir === "improved" ? "УЛУЧШЕНИЕ" : dir === "worsened" ? "УХУДШЕНИЕ" : dir === "unchanged" ? "БЕЗ ДИНАМИКИ" : "—");

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: isMobile ? 10 : 20, boxSizing: "border-box"
    }}>
      <div style={{
        background: C.panel, border: `1px solid ${C.border}`,
        borderRadius: 14, width: "100%", maxWidth: 580, maxHeight: "88vh",
        display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
      }}>
        {/* Header */}
        <div style={{
          padding: "12px 16px", borderBottom: `1px solid ${C.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center", background: C.headerBg2
        }}>
          <STitle icon="🔄" label={`Повторная оценка #${iteration} (Reassessment)`} color={C.accent} />
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: C.textDim, fontSize: 16, cursor: "pointer" }}>✕</button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Headline Banner */}
          <div style={{
            padding: "10px 12px", borderRadius: 8,
            background: decision.type === "IMPROVED" ? `${C.green}15` : decision.type === "WORSENED" ? `${C.red}15` : `${C.accent}12`,
            border: `1px solid ${decision.type === "IMPROVED" ? C.green : decision.type === "WORSENED" ? C.red : C.accent}50`
          }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: C.white, fontFamily: FONT }}>{decision.headline}</div>
            <div style={{ fontSize: 10.5, color: C.textDim, marginTop: 4, fontFamily: FONT, lineHeight: 1.4 }}>{decision.recommendation}</div>
          </div>

          {/* Vitals Delta Table */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {report.parameters.map(p => {
              const col = getDirColor(p.direction);
              return (
                <div key={p.parameter} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: 8, background: C.btnBg, border: `1px solid ${C.btnBorder}` }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.white, fontFamily: FONT }}>{p.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11.5, fontFamily: CODE, color: C.textDim }}>{p.before} → <strong style={{ color: C.white }}>{p.after}</strong> {p.unit}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: `${col}20`, color: col, fontFamily: FONT }}>{getDirLabel(p.direction)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Problem List Transitions */}
          {transitions.length > 0 && (
            <div style={{ padding: "8px 10px", borderRadius: 8, background: C.btnBg, border: `1px solid ${C.btnBorder}` }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: C.accent, marginBottom: 4, fontFamily: FONT }}>Динамика синдромов:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {transitions.map(t => (
                  <span key={t.id} style={{
                    fontSize: 9.5, padding: "2px 6px", borderRadius: 4,
                    background: t.status === "resolved" ? `${C.green}20` : t.status === "worsening" ? `${C.red}20` : `${C.accent}15`,
                    color: t.status === "resolved" ? C.green : t.status === "worsening" ? C.red : C.text,
                    fontFamily: FONT
                  }}>
                    {t.status === "resolved" ? "✓ " : "• "}{t.label} ({t.status.toUpperCase()})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Revised Plan Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.white, fontFamily: FONT }}>Дальнейший клинический план (Revised Plan):</div>
            {decision.suggestedPlans.map(plan => {
              const isSelected = (selectedPlanId || decision.suggestedPlans[0].id) === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  style={{
                    padding: "8px 10px", borderRadius: 8, cursor: "pointer",
                    background: isSelected ? `${C.accent}20` : C.btnBg,
                    border: `1px solid ${isSelected ? C.accent : C.btnBorder}`,
                    display: "flex", flexDirection: "column", gap: 2
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: isSelected ? C.accent : C.textDim, fontSize: 11 }}>{isSelected ? "◉" : "○"}</span>
                    <strong style={{ fontSize: 11.5, color: isSelected ? C.white : C.text, fontFamily: FONT }}>{plan.label}</strong>
                  </div>
                  <span style={{ fontSize: 9.5, color: C.textDim, marginLeft: 16, fontFamily: FONT }}>{plan.description}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "10px 16px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", gap: 8, background: C.headerBg2 }}>
          <Btn label="Отмена" onClick={onClose} secondary />
          <Btn label="Принять план и зафиксировать" onClick={handleRecord} color={C.green} />
        </div>
      </div>
    </div>
  );
}
