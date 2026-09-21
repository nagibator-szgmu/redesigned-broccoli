import React from "react";
import { RADIUS } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { TestAnalysis, TreatmentAnalysis, ChecklistBlock } from "../index";

/**
 * ResultErrorsTab — Вкладка «Разбор ошибок и рекомендаций».
 * 
 * Собирает в одном месте без дублирования:
 * 1. Нормализованный список ошибок из result.mistakes[] (или фоллбэк к тестам/лечению).
 * 2. Замечания и рекомендации искусственного интеллекта.
 * 3. Чек-лист критериев оценки.
 */
export default function ResultErrorsTab({
  result,
  cd,
  orderedDiag,
  selTreat,
  isMobile,
  assessmentMode,
  checklistItems,
  checklistDone,
  isChecklistDone,
}) {
  const C = useTheme();

  const mistakes = result?.mistakes || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Если Разработчик 2 уже передал структурированные ошибки */}
      {mistakes.length > 0 ? (
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.red}44`,
            borderRadius: isMobile ? RADIUS.sm : RADIUS.md,
            padding: isMobile ? 12 : 16,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span>🚨</span> Выявленные клинические дефекты ({mistakes.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {mistakes.map((m, idx) => (
              <div
                key={m.id || idx}
                style={{
                  background: `${C.red}10`,
                  border: `1px solid ${C.red}33`,
                  borderRadius: RADIUS.xs,
                  padding: "8px 12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>{m.title}</span>
                  {m.penalty > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.red }}>−{m.penalty} б.</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>{m.reason}</div>
                {m.guidelineRef && (
                  <div style={{ fontSize: 11, color: C.accent, marginTop: 4, fontWeight: 500 }}>
                    📖 {m.guidelineRef}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Фоллбэк до пересборки движка: раздельный анализ исследований и терапии */
        <>
          <TestAnalysis cd={cd} orderedDiag={orderedDiag} isMobile={isMobile} />
          <TreatmentAnalysis cd={cd} selTreat={selTreat} isMobile={isMobile} />
        </>
      )}

      {/* Замечания ИИ-эксперта */}
      {result?.aiEvaluated && (
        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.accentDim}`,
            borderRadius: isMobile ? RADIUS.sm : RADIUS.md,
            padding: isMobile ? 12 : 16,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <span>🤖</span> Анализ клинического мышления от ИИ
          </div>
          <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.6, marginBottom: 8 }}>
            {result.aiFeedback}
          </div>
          {result.aiErrors && result.aiErrors.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: C.red, display: "flex", flexDirection: "column", gap: 4 }}>
              {result.aiErrors.map((err, idx) => (
                <li key={idx} style={{ lineHeight: 1.5 }}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Чек-лист оценки */}
      <ChecklistBlock
        assessmentMode={assessmentMode}
        checklistItems={checklistItems}
        checklistDone={checklistDone}
        isChecklistDone={isChecklistDone}
        isMobile={isMobile}
      />
    </div>
  );
}
