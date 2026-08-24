import React, { useMemo } from "react";
import { useTheme } from "../../ui/ThemeContext";
import { FONT } from "../../ui/theme";
import { STitle } from "../../ui/components";
import { evaluateClinicalSafety } from "../../engine/safetyEngine";
import { deriveProblemList } from "../../engine/problemListEngine";

/**
 * Детальная панель клинического дебрифинга полного цикла (V2.5 11-Point Closed-Loop Debrief).
 */
export default function DebriefPanel({
  cd,
  initialPS,
  trajectory = [],
  selTreat = [],
  selDiag = [],
  revealedResults = {},
  revealedAnamnesis = new Set()
}) {
  const C = useTheme();

  const safety = useMemo(() => {
    return evaluateClinicalSafety(cd, selTreat, selDiag, revealedAnamnesis, trajectory);
  }, [cd, selTreat, selDiag, revealedAnamnesis, trajectory]);

  const initialProblems = useMemo(() => {
    return deriveProblemList(initialPS, revealedResults);
  }, [initialPS, revealedResults]);

  const reassessments = trajectory.filter(c => c.checkpointId?.startsWith("REASSESSMENT"));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
      <STitle icon="🩺" label="Клинический разбор полного цикла (Closed-Loop Debrief)" color={C.accent} />

      {/* 1. Safety Alert Summary */}
      <div style={{
        padding: "10px 14px", borderRadius: 10,
        background: safety.safetyRating === "critical_breach" ? `${C.red}18` : safety.safetyRating === "caution" ? `${C.yellow}15` : `${C.green}15`,
        border: `1px solid ${safety.safetyRating === "critical_breach" ? C.red : safety.safetyRating === "caution" ? C.yellow : C.green}60`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ fontSize: 13, color: C.white, fontFamily: FONT }}>
            {safety.safetyRating === "critical_breach" ? "⚠️ Критические замечания по безопасности" : safety.safetyRating === "caution" ? "⚡ Замечания по тактике ведения" : "✓ Безопасная клиническая тактика"}
          </strong>
          <span style={{ fontSize: 10, fontFamily: FONT, color: C.textDim }}>
            Ошибок: {safety.totalErrors} · Оценок: {reassessments.length}
          </span>
        </div>
        <div style={{ fontSize: 11, color: C.textDim, marginTop: 4, fontFamily: FONT }}>
          {safety.summary}
        </div>
      </div>

      {/* 2. Critical & Major Errors */}
      {safety.criticalErrors.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.red, fontFamily: FONT }}>
            Критические ошибки (противопоказанные вмешательства):
          </div>
          {safety.criticalErrors.map((err, i) => (
            <div key={i} style={{ padding: "6px 10px", borderRadius: 6, background: `${C.red}12`, border: `1px solid ${C.red}40`, fontSize: 11, color: C.text, fontFamily: FONT }}>
              <strong>{err.name}</strong>: {err.explanation}
            </div>
          ))}
        </div>
      )}

      {/* 3. Sequential & Escalation Safety Errors */}
      {safety.sequentialErrors.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.red, fontFamily: FONT }}>
            Дефекты последовательности решений (Sequential Safety & Escalation):
          </div>
          {safety.sequentialErrors.map((err, i) => (
            <div key={i} style={{ padding: "6px 10px", borderRadius: 6, background: `${C.red}12`, border: `1px solid ${C.red}40`, fontSize: 11, color: C.text, fontFamily: FONT }}>
              ⚠️ {err.explanation}
            </div>
          ))}
        </div>
      )}



      {/* 5. Initial Problems Identified */}
      <div style={{ padding: "10px 12px", borderRadius: 8, background: C.btnBg, border: `1px solid ${C.btnBorder}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, marginBottom: 4, fontFamily: FONT }}>
          Исходные синдромы и проблемы пациента (Problem Representation):
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {initialProblems.map(p => (
            <span key={p.id} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: C.headerBg2, border: `1px solid ${C.border}`, color: C.textDim, fontFamily: FONT }}>
              • {p.label}
            </span>
          ))}
        </div>
      </div>

      {/* 6. Missed Opportunities */}
      {safety.missedOpportunities.length > 0 && (
        <div style={{ padding: "10px 12px", borderRadius: 8, background: C.btnBg, border: `1px solid ${C.btnBorder}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.yellow, marginBottom: 4, fontFamily: FONT }}>
            Упущенные ключевые действия (Missed Opportunities):
          </div>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 10.5, color: C.textDim, fontFamily: FONT, lineHeight: 1.4 }}>
            {safety.missedOpportunities.slice(0, 4).map((m, i) => (
              <li key={i}>{m.explanation}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
