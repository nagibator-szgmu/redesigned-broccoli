import { useState } from "react";
import { createPortal } from "react-dom";
import { FONT, CODE } from "../ui/theme";
import { useTheme } from "../ui/ThemeContext";
import useIsMobile from "../hooks/useIsMobile";
import { getQuizForTopic, PASS_THRESHOLD } from "../data/quiz";
import { IconHospital, IconBook, IconCheck } from "../ui/icons";

export default function QuizModal({ topicId, onClose, onResult }) {
  const C = useTheme();
  const isMobile = useIsMobile();
  const quiz = getQuizForTopic(topicId);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);

  if (!quiz) return null;

  const q = quiz.questions[currentQ];
  const total = quiz.questions.length;
  const isLast = currentQ === total - 1;

  const handleSelect = (idx) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);
    setAnswers((prev) => ({ ...prev, [q.id]: idx }));
  };

  const handleNext = () => {
    if (isLast) {
      setShowResult(true);
      const finalCorrect = quiz.questions.filter(
        (question) => ({ ...answers, [q.id]: selectedOption })[question.id] === question.correct
      ).length;
      const finalPassed = finalCorrect >= quiz.passingScore;
      if (onResult) onResult(finalPassed, { correct: finalCorrect, total });
    } else {
      setCurrentQ((v) => v + 1);
      setSelectedOption(null);
      setAnswered(false);
    }
  };

  const correctCount = quiz.questions.filter(
    (question) => answers[question.id] === question.correct
  ).length;
  const passed = correctCount >= quiz.passingScore;

  const typeLabel = q.type === "clinical" ? (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <IconHospital size={14} color={C.accent} /> Клинический кейс
    </span>
  ) : (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <IconBook size={14} color={C.accent} /> Вопрос
    </span>
  );

  const content = showResult ? (
    <div style={{ textAlign: "center", padding: isMobile ? "30px 20px" : "40px 32px" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        {passed ? <IconCheck size={48} color={C.green} /> : <IconBook size={48} color={C.yellow} />}
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: passed ? C.green : C.red,
          fontFamily: CODE,
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {correctCount}/{total}
      </div>
      <div
        style={{
          fontSize: 14,
          color: passed ? C.green : C.yellow,
          fontWeight: 700,
          fontFamily: FONT,
          marginBottom: 16,
        }}
      >
        {passed ? "Тест пройден!" : "Тест не пройден"}
      </div>
      <div style={{ fontSize: 12, color: C.textDim, fontFamily: FONT, marginBottom: 20 }}>
        Порог: {Math.round(PASS_THRESHOLD * 100)}% ({quiz.passingScore} из {total})
      </div>

      {/* Review answers */}
      {quiz.questions.map((question, i) => {
        const userAns = answers[question.id];
        const isCorrect = userAns === question.correct;
        return (
          <div
            key={question.id}
            style={{
              textAlign: "left",
              padding: "10px 14px",
              marginBottom: 8,
              borderRadius: 10,
              background: isCorrect ? `${C.green}10` : `${C.red}10`,
              border: `1px solid ${isCorrect ? `${C.green}33` : `${C.red}33`}`,
            }}
          >
            <div style={{ fontSize: 12, color: C.textDim, fontFamily: FONT, marginBottom: 4 }}>
              {i + 1}. {isCorrect ? "✓" : "✗"}{" "}
              {question.text.slice(0, 80)}
              {question.text.length > 80 ? "..." : ""}
            </div>
            {!isCorrect && (
              <div style={{ fontSize: 11, color: C.accent, fontFamily: FONT, marginTop: 4 }}>
                Ответ: {question.options[question.correct]}
              </div>
            )}
          </div>
        );
      })}

      <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "center" }}>
        {!passed && (
          <button
            onClick={() => {
              setCurrentQ(0);
              setAnswers({});
              setShowResult(false);
              setSelectedOption(null);
              setAnswered(false);
            }}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              background: C.btnBg,
              border: `1px solid ${C.border}`,
              color: C.text,
              fontSize: 13,
              fontFamily: FONT,
              cursor: "pointer",
            }}
          >
            Пройти заново
          </button>
        )}
        <button
          onClick={onClose}
          style={{
            padding: "10px 24px",
            borderRadius: 10,
            background: passed ? `linear-gradient(135deg,${C.accent},${C.green})` : C.btnBg,
            border: `1px solid ${passed ? "transparent" : C.border}`,
            color: passed ? C.bg : C.text,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: FONT,
            cursor: "pointer",
          }}
        >
          {passed ? "К кейсам →" : "Вернуться к теории"}
        </button>
      </div>
    </div>
  ) : (
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
      {q.type === "clinical" && (
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
      )}

      {q.type !== "clinical" && (
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
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
        {q.options.map((opt, i) => {
          const isSelected = selectedOption === i;
          const isCorrectOption = answered && i === q.correct;
          const isWrongSelected = answered && isSelected && i !== q.correct;

          let borderColor = C.border;
          let bgColor = "transparent";
          if (isCorrectOption) {
            borderColor = C.green;
            bgColor = `${C.green}12`;
          } else if (isWrongSelected) {
            borderColor = C.red;
            bgColor = `${C.red}12`;
          } else if (isSelected) {
            borderColor = C.accent;
            bgColor = `${C.accent}12`;
          }

          return (
            <div
              key={i}
              onClick={() => handleSelect(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 10,
                border: `1px solid ${borderColor}`,
                background: bgColor,
                cursor: answered ? "default" : "pointer",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: `2px solid ${isCorrectOption ? C.green : isWrongSelected ? C.red : isSelected ? C.accent : C.textDim}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: isCorrectOption ? C.green : isWrongSelected ? C.red : "transparent",
                }}
              >
                {isCorrectOption && <span style={{ fontSize: 11, color: "#000", fontWeight: 900 }}>✓</span>}
                {isWrongSelected && <span style={{ fontSize: 11, color: "#fff", fontWeight: 900 }}>✗</span>}
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: isCorrectOption ? C.green : isWrongSelected ? C.red : C.text,
                  fontFamily: FONT,
                  lineHeight: 1.5,
                }}
              >
                {opt}
              </span>
            </div>
          );
        })}
      </div>

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
            onClick={handleNext}
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

  return createPortal(
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99998,
          background: "rgba(0,0,0,0.7)",
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: isMobile ? "fixed" : "fixed",
          ...(isMobile
            ? { top: 54, right: 0, left: 0, bottom: 0 }
            : { top: "8%", left: "20%", right: "20%", bottom: "8%" }),
          zIndex: 99999,
          background: C.overlayBg,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(0,230,200,0.2)",
          borderRadius: isMobile ? 0 : 18,
          boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
          fontFamily: FONT,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isMobile ? "12px 16px" : "14px 20px",
            borderBottom: "1px solid rgba(0,230,200,0.08)",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: C.white }}>
            📝 Тест по теме
          </span>
          <span
            onClick={onClose}
            style={{
              fontSize: 12,
              color: C.textDim,
              cursor: "pointer",
              padding: "4px 10px",
              borderRadius: 6,
              background: C.dimBg,
            }}
          >
            ✕
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto" }}>{content}</div>
      </div>
    </>,
    document.body
  );
}
