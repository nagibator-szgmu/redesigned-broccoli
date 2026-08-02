import React from "react";
import { useTheme } from "../../ui/ThemeContext";


export default function AttemptDetails({ attempt }) {
  const C = useTheme();

  if (!attempt) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: C.textDim, fontSize: 14 }}>
        Выберите попытку прохождения из списка слева для подробного анализа
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 800, color: C.white }}>{attempt.caseTitle}</h3>
      <div style={{ display: "flex", gap: 14, marginBottom: 20, fontSize: 12, color: C.textDim }}>
        <span>Дата прохождения: {attempt.date}</span>
        <span>|</span>
        <span>Оценка: <strong style={{ color: attempt.score >= 70 ? C.green : C.red }}>{attempt.score}/100</strong></span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* OSCE Checklist */}
        <div>
          <h4 style={{ margin: "0 0 10px 0", fontSize: 13.5, color: C.accent, textTransform: "uppercase", letterSpacing: 0.5 }}>Чек-лист оценки ОСКЭ</h4>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{
              background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
              borderRadius: 8, padding: "6px 12px", fontSize: 12.5, color: C.white
            }}>
              Исследования: {attempt.score >= 80 ? "✓ Ключевые выполнены" : "⚠️ Есть пропуски"}
            </span>
            <span style={{
              background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
              borderRadius: 8, padding: "6px 12px", fontSize: 12.5, color: C.white
            }}>
              Лекарства: {attempt.score >= 75 ? "✓ Назначены верно" : "⚠️ Ошибки подбора"}
            </span>
          </div>
        </div>

        {/* Cognitive Errors */}
        <div>
          <h4 style={{ margin: "0 0 10px 0", fontSize: 13.5, color: C.yellow, textTransform: "uppercase", letterSpacing: 0.5 }}>Анализ когнитивных ошибок</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.values(attempt.cognitiveErrors).every(v => !v) ? (
              <div style={{ fontSize: 13, color: C.green }}>✓ Когнитивных искажений не выявлено. Мышление структурировано.</div>
            ) : (
              <>
                {attempt.cognitiveErrors.diagnosticBlindness && (
                  <div style={{ background: `${C.red}0d`, border: `1px solid ${C.red}3b`, borderRadius: 10, padding: 12, fontSize: 12.5 }}>
                    <strong>⚠️ Диагностическая слепота:</strong> Студент пропустил обязательное базовое обследование при данных симптомах.
                  </div>
                )}
                {attempt.cognitiveErrors.anchoring && (
                  <div style={{ background: `${C.red}0d`, border: `1px solid ${C.red}3b`, borderRadius: 10, padding: 12, fontSize: 12.5 }}>
                    <strong>⚠️ Эффект якоря:</strong> Студент зафиксировался на неверной гипотезе и проводил нецелевую избыточную терапию.
                  </div>
                )}
                {attempt.cognitiveErrors.prematureClosure && (
                  <div style={{ background: `${C.red}0d`, border: `1px solid ${C.red}3b`, borderRadius: 10, padding: 12, fontSize: 12.5 }}>
                    <strong>⚠️ Преждевременное закрытие:</strong> Диагностический поиск остановлен до сбора полноты клинической картины.
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Critical Errors */}
        <div>
          <h4 style={{ margin: "0 0 10px 0", fontSize: 13.5, color: C.red, textTransform: "uppercase", letterSpacing: 0.5 }}>Критические ошибки (Fails)</h4>
          <div style={{ fontSize: 13, color: attempt.criticalErrorsCount > 0 ? C.red : C.textDim }}>
            {attempt.criticalErrorsCount > 0 
              ? "🚨 Обнаружено опасное назначение препарата, ухудшившее состояние больного."
              : "✓ Грубых и критических ошибок во время ведения не совершено."
            }
          </div>
        </div>
      </div>
    </div>
  );
}
