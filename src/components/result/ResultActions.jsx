import { useTheme } from "../../ui/ThemeContext";
import { FONT } from "../../ui/theme";
import { useTranslate } from "../../locale/useTranslate";
import { TOPICS } from "../../data/topics";
import { QUIZ_QUESTIONS } from "../../data/quiz";

export default function ResultActions({ curriculum, advanceCurriculum, getNextCurriculumCase, clearCurriculum, startGame, setPhase, getNextCurriculumTopic }) {
  const C = useTheme();
  const { t } = useTranslate();

  if (curriculum?.topicId) {
    const topic = TOPICS.flatMap(c => c.children).find(t => t.id === curriculum.topicId);
    if (!topic) return null;
    const nextCaseId = getNextCurriculumCase ? getNextCurriculumCase() : null;
    const hasQuiz = !!QUIZ_QUESTIONS[curriculum.topicId];

    const handleNextCase = () => {
      advanceCurriculum && advanceCurriculum();
      if (nextCaseId) startGame(nextCaseId);
    };

    const handleNextTopic = () => {
      const next = getNextCurriculumTopic ? getNextCurriculumTopic(curriculum.topicId) : null;
      clearCurriculum && clearCurriculum();
      if (next) {
        setPhase("theory");
      } else {
        setPhase("menu");
      }
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{
          fontSize: 12, color: C.accent, fontWeight: 600, fontFamily: FONT, marginBottom: 4,
          display: "flex", alignItems: "center", gap: 8
        }}>
          <span>📚</span>
          {t("theory.course")}: {topic.name}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {nextCaseId ? (
            <button onClick={handleNextCase}
              style={{ flex: 1, minWidth: 140, background: `linear-gradient(135deg,${C.accent},${C.green})`, border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT, letterSpacing: 0.5 }}>
              ▶ {t("result.nextCase")} ({(topic.cases.length - curriculum.caseQueue.length) + 1}/{Math.min(topic.cases.length, 3)})
            </button>
          ) : hasQuiz ? (
            <button onClick={() => setPhase("theory")}
              style={{ flex: 1, minWidth: 140, background: `linear-gradient(135deg,${C.yellow},${C.orange || C.yellow})`, border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT, letterSpacing: 0.5 }}>
              📝 {t("quiz.quiz")}
            </button>
          ) : (
            <>
              <button onClick={handleNextTopic}
                style={{ flex: 1, minWidth: 140, background: `linear-gradient(135deg,${C.accent},${C.green})`, border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT, letterSpacing: 0.5 }}>
                ✓ {t("theory.topicComplete", {n: topic.cases.length})}
              </button>
              {getNextCurriculumTopic && getNextCurriculumTopic(curriculum.topicId) && (
                <button onClick={handleNextTopic}
                  style={{ flex: 1, minWidth: 140, background: `linear-gradient(135deg,${C.blue || C.accent},${C.accent})`, border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT, letterSpacing: 0.5 }}>
                  ➜ {t("theory.nextTopic")}
                </button>
              )}
            </>
          )}
          <button onClick={() => { clearCurriculum && clearCurriculum(); setPhase("menu"); }}
            style={{ padding: "11px 20px", borderRadius: 12, border: `1px solid ${C.textDim}44`,
              background: "transparent", fontSize: 13, color: C.textDim, cursor: "pointer", fontFamily: FONT }}>
            {t("result.menu")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button onClick={startGame} className="next-case-btn" style={{ flex: 1, background: `linear-gradient(135deg,${C.accent},${C.green})`, border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, color: C.bg, cursor: "pointer", fontFamily: FONT, letterSpacing: 0.5 }}>
        {t("result.nextCase")}
      </button>
      <button onClick={() => setPhase("menu")}
        style={{ padding: "11px 20px", borderRadius: 12, border: `1px solid ${C.textDim}44`,
          background: "transparent", fontSize: 13, color: C.textDim, cursor: "pointer", fontFamily: FONT }}>
        {t("result.menu")}
      </button>
    </div>
  );
}
