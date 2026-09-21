import { FONT, CODE } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { IconHospital, IconBook } from "../../ui/icons";
import QuizQuestionOptions from "./QuizQuestionOptions";

export default function QuizQuestionCard({
  q,
  currentQ,
  total,
  isLast,
  selectedOption,
  answered,
  onSelect,
  onNext,
  isMobile,
}) {
  const C = useTheme();

  const typeLabel = q.type === "clinical" ? (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <IconHospital size={14} color={C.accent} /> Клинический кейс
    </span>
  ) : (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <IconBook size={14} color={C.accent} /> Вопрос
    </span>
  );

  return (
    <div style={{ padding: isMobile ? "16px" : "24px 28px" }}>
      {/* Progress */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: C.textDim, fontFamily: FONT }}>{typeLabel}</span>
          <span style={{ fontSize: 11, color: C.textDim, fontFamily: CODE }}>
            {currentQ + 1}/{total}
          </span>
        </div>
        <div
          style={{
            height: 3,
            borderRadius: 2,
            background: C.btnBg,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${((currentQ + 1) / total) * 100}%`,
              background: C.accent,
              borderRadius: 2,
              transition: "width 0.3s",
            }}
          />
        </div>
      </div>

      {/* Question text */}
      {q.type === "clinical" ? (
        <div
          style={{
            padding: "10px 14px",
            marginBottom: 12,
            borderRadius: 10,
            background: `${C.yellow}08`,
            border: `1px solid ${C.yellow}22`,
            fontSize: 12,
            color: C.text,
            lineHeight: 1.7,
            fontFamily: FONT,
          }}
        >
          {q.text}
        </div>
      ) : (
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: C.white,
            fontFamily: FONT,
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          {q.text}
        </div>
      )}

      {/* Options */}
      <QuizQuestionOptions
        options={q.options}
        correctIndex={q.correct}
        selectedOption={selectedOption}
        answered={answered}
        onSelect={onSelect}
      />

      {/* Explanation */}
      {answered && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: `${C.accent}08`,
            border: `1px solid ${C.accent}18`,
            marginBottom: 16,
            animation: "fadeIn 0.2s ease",
          }}
        >
          <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, fontFamily: FONT, marginBottom: 4 }}>
            Пояснение:
          </div>
          <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6, fontFamily: FONT }}>
            {q.explanation}
          </div>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onNext}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              background: `linear-gradient(135deg,${C.accent},${C.green})`,
              border: "none",
              color: C.bg,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: FONT,
              cursor: "pointer",
            }}
          >
            {isLast ? "Завершить" : "Далее →"}
          </button>
        </div>
      )}
    </div>
  );
}
