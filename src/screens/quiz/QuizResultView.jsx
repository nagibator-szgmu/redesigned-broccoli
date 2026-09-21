import { FONT, CODE } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { PASS_THRESHOLD } from "../../data/quiz";
import { IconCheck, IconBook } from "../../ui/icons";

export default function QuizResultView({
  quiz,
  answers,
  correctCount,
  total,
  passed,
  onRestart,
  onClose,
  isMobile,
}) {
  const C = useTheme();

  return (
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
            onClick={onRestart}
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
  );
}
