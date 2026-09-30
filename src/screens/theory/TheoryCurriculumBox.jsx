import { FONT } from "../../ui/theme";
import { useTranslate } from "../../locale/useTranslate";
import { TOPICS } from "../../data/topics";
import { QUIZ_QUESTIONS } from "../../data/quiz";
import { IconCheck, IconPlay, IconClipboard } from "../../ui/icons";

export default function TheoryCurriculumBox({ topicId, onQuiz, progress, startGame, C }) {
  const { t } = useTranslate();
  const topic = TOPICS.flatMap(c => c.children).find(t => t.id === topicId);
  const tp = progress ? progress.getTopicProgress(topicId) : null;
  const casesDone = tp ? tp.completedCases.length : 0;
  const isComplete = progress && progress.isTopicComplete(topicId);
  const curriculum = progress?.curriculum;
  const isCurActive = curriculum && curriculum.topicId === topicId;

  const handleStartPractice = () => {
    if (!progress || !startGame) return;
    const firstCase = progress.startCurriculum(topicId);
    if (firstCase) startGame(firstCase);
  };

  return (
    <>
      {progress && startGame && topic && topic.cases.length > 0 && (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.accent, letterSpacing: 1.2, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>
            {t("theory.practice")}
          </div>
          {isComplete ? (
            <div style={{ padding: "10px 14px", background: `${C.green}10`, border: `1px solid ${C.green}33`, borderRadius: 10, fontSize: 12, color: C.green, fontFamily: FONT, display: "flex", alignItems: "center", gap: 8 }}>
              <IconCheck size={14} color={C.green} />
              <span>{t("theory.topicComplete", { n: casesDone })}</span>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, marginBottom: 8 }}>
                {t("theory.casesLabel")} {casesDone}/{topic.cases.length} · {tp?.quizPassed ? t("theory.testPassed") : t("theory.testNotPassed")}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleStartPractice}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "10px 16px", borderRadius: 10,
                    background: `linear-gradient(135deg, ${C.accentDim}, ${C.greenDim})`,
                    border: `1px solid ${C.accent}40`, color: C.accent, fontSize: 13,
                    fontWeight: 600, fontFamily: FONT, cursor: "pointer", transition: "all 0.15s"
                  }}>
                  <IconPlay size={14} color={C.accent} />
                  <span>{t("theory.startPractice")}</span>
                </button>
                {tp && tp.quizPassed === false && casesDone >= topic.cases.length && (
                  <button onClick={onQuiz}
                    style={{
                      padding: "10px 16px", borderRadius: 10, background: `${C.yellow}15`,
                      border: `1px solid ${C.yellow}33`, color: C.yellow, fontSize: 13,
                      fontWeight: 600, fontFamily: FONT, cursor: "pointer", transition: "all 0.15s",
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                    <IconClipboard size={14} color={C.yellow} />
                    <span>{t("quiz.quiz")}</span>
                  </button>
                )}
              </div>
              {isCurActive && curriculum?.quizPending && (
                <div style={{ marginTop: 8, padding: "8px 12px", background: `${C.yellow}10`, border: `1px solid ${C.yellow}33`, borderRadius: 8, fontSize: 11, color: C.yellow, fontFamily: FONT }}>
                  {t("theory.allCasesDone")}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {QUIZ_QUESTIONS[topicId] && (
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
          <button onClick={onQuiz}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 12,
              background: `linear-gradient(135deg, ${C.accentDim}, ${C.greenDim})`,
              border: `1px solid ${C.accent}33`, color: C.accent, fontSize: 14,
              fontWeight: 600, fontFamily: FONT, cursor: "pointer", transition: "all 0.15s"
            }}>
            <IconClipboard size={18} color={C.accent} />
            <span>{t("theory.quizByTopic", { n: QUIZ_QUESTIONS[topicId].length })}</span>
          </button>
          <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, marginTop: 6 }}>
            {t("theory.quizThreshold")}
          </div>
        </div>
      )}
    </>
  );
}
