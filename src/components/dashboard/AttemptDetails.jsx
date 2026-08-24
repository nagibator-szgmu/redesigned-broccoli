import React from "react";
import { useTheme } from "../../ui/ThemeContext";


export default function AttemptDetails({ attempt }) {
  const C = useTheme();

  if (!attempt) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: C.textDim, fontSize: 14, minHeight: 200 }}>
        Выберите попытку прохождения из списка слева для подробного анализа
      </div>
    );
  }

  const title = attempt.caseTitle || attempt.caseName || attempt.caseId || "Клинический случай";
  const cogErrors = attempt.cognitiveErrors || { anchoring: false, prematureClosure: false, diagnosticBlindness: false };
  const critCount = attempt.criticalErrorsCount ?? ((attempt.criticalErrors?.length || 0) + (attempt.died ? 1 : 0));

  return (
    <div>
      <h3 style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 800, color: C.white }}>{title}</h3>
      <div style={{ display: "flex", gap: 14, marginBottom: 20, fontSize: 12, color: C.textDim, flexWrap: "wrap", alignItems: "center" }}>
        <span>Дата прохождения: <strong>{attempt.date}</strong></span>
        <span>|</span>
        <span>Результат: <strong style={{ color: attempt.score >= 70 ? C.green : C.red }}>{attempt.score}/100 б.</strong></span>
        {attempt.died && <span style={{ color: C.red, fontWeight: 700, background: `${C.red}20`, padding: "2px 8px", borderRadius: 4 }}>Летальный исход</span>}
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
              Исследования: {attempt.checklist ? `${attempt.checklist.diagPassed}/${attempt.checklist.diagTotal} вып.` : (attempt.score >= 80 ? "✓ Ключевые выполнены" : "⚠️ Есть пропуски")}
            </span>
            <span style={{
              background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
              borderRadius: 8, padding: "6px 12px", fontSize: 12.5, color: C.white
            }}>
              Лечение: {attempt.checklist ? `${attempt.checklist.treatPassed}/${attempt.checklist.treatTotal} верн.` : (attempt.score >= 75 ? "✓ Назначено верно" : "⚠️ Ошибки подбора")}
            </span>
          </div>
        </div>

        {/* Cognitive Errors */}
        <div>
          <h4 style={{ margin: "0 0 10px 0", fontSize: 13.5, color: C.yellow, textTransform: "uppercase", letterSpacing: 0.5 }}>Анализ когнитивных ошибок</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {!cogErrors.anchoring && !cogErrors.prematureClosure && !cogErrors.diagnosticBlindness ? (
              <div style={{ fontSize: 13, color: C.green }}>✓ Когнитивных искажений не выявлено. Мышление структурировано.</div>
            ) : (
              <>
                {cogErrors.diagnosticBlindness && (
                  <div style={{ background: `${C.red}0d`, border: `1px solid ${C.red}3b`, borderRadius: 10, padding: 12, fontSize: 12.5, color: C.white }}>
                    <strong style={{ color: C.red }}>⚠️ Диагностическая слепота:</strong> Студент пропустил обязательное базовое обследование при данных симптомах.
                  </div>
                )}
                {cogErrors.anchoring && (
                  <div style={{ background: `${C.red}0d`, border: `1px solid ${C.red}3b`, borderRadius: 10, padding: 12, fontSize: 12.5, color: C.white }}>
                    <strong style={{ color: C.red }}>⚠️ Эффект якоря:</strong> Студент зафиксировался на неверной гипотезе и проводил нецелевую избыточную терапию.
                  </div>
                )}
                {cogErrors.prematureClosure && (
                  <div style={{ background: `${C.red}0d`, border: `1px solid ${C.red}3b`, borderRadius: 10, padding: 12, fontSize: 12.5, color: C.white }}>
                    <strong style={{ color: C.red }}>⚠️ Преждевременное закрытие:</strong> Диагностический поиск остановлен до сбора полноты клинической картины.
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Critical Errors */}
        <div>
          <h4 style={{ margin: "0 0 10px 0", fontSize: 13.5, color: C.red, textTransform: "uppercase", letterSpacing: 0.5 }}>Критические ошибки (Fails)</h4>
          <div style={{ fontSize: 13, color: critCount > 0 ? C.red : C.textDim }}>
            {critCount > 0 
              ? "🚨 Обнаружены опасные назначения препаратов или ухудшение состояния больного."
              : "✓ Грубых и критических ошибок во время ведения не совершено."
            }
          </div>
        </div>

        {/* AI Feedback if present */}
        {attempt.aiFeedback && (
          <div>
            <h4 style={{ margin: "0 0 10px 0", fontSize: 13.5, color: C.accent, textTransform: "uppercase", letterSpacing: 0.5 }}>Разбор ИИ-эксперта</h4>
            <div style={{ background: `${C.accent}0d`, border: `1px solid ${C.accent}33`, borderRadius: 10, padding: 12, fontSize: 12.5, color: C.white, lineHeight: 1.5 }}>
              {attempt.aiFeedback}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
