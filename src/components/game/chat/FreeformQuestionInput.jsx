import React from "react";
import { FONT, RADIUS } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";

/**
 * FreeformQuestionInput — Поле текстового ввода произвольного вопроса пациента.
 */
export default function FreeformQuestionInput({
  inputQuestion = "",
  setInputQuestion,
  onSubmit,
  loading = false,
  disabled = false,
}) {
  const C = useTheme();

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", gap: 6 }}>
      <input
        type="text"
        data-testid="dialogue-freeform-input"
        value={inputQuestion}
        onChange={(e) => setInputQuestion(e.target.value)}
        placeholder={
          disabled
            ? "Пациент без сознания..."
            : "Задать свой вопрос пациенту..."
        }
        disabled={disabled || loading}
        style={{
          flex: 1,
          background: C.panel2 || C.inputBg,
          border: `1px solid ${C.border}`,
          borderRadius: RADIUS.sm,
          padding: "6px 10px",
          fontSize: 12,
          color: C.text,
          fontFamily: FONT,
          outline: "none",
          opacity: disabled ? 0.6 : 1,
        }}
      />
      <button
        type="submit"
        data-testid="dialogue-send-btn"
        disabled={!inputQuestion.trim() || loading || disabled}
        style={{
          background: !inputQuestion.trim() || loading || disabled ? C.dimBg : C.accent,
          color: !inputQuestion.trim() || loading || disabled ? C.textDim : "#FFFFFF",
          border: `1px solid ${!inputQuestion.trim() || loading || disabled ? C.border : C.accent}`,
          borderRadius: RADIUS.sm,
          padding: "6px 14px",
          fontSize: 12,
          fontWeight: 600,
          cursor: !inputQuestion.trim() || loading || disabled ? "not-allowed" : "pointer",
          fontFamily: FONT,
          transition: "background 0.15s, color 0.15s, border-color 0.15s",
        }}
      >
        {loading ? "..." : "Спросить"}
      </button>
    </form>
  );
}
