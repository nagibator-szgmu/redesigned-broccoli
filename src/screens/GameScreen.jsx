import { useTheme } from "../ui/ThemeContext";
import { FONT } from "../ui/theme";
import { useTranslate } from "../locale/useTranslate";
import { CASES } from "../data/cases";
import { TOPICS } from "../data/topics";
import { QUIZ_QUESTIONS } from "../data/quiz";
import EmergencyGameScreen from "./game/EmergencyGameScreen";
import OutpatientGameScreen from "./game/OutpatientGameScreen";
import StationaryGameScreen from "./game/StationaryGameScreen";

const DEPT_SCREEN = {
  icu: EmergencyGameScreen,
  admission: EmergencyGameScreen,
  emergency: EmergencyGameScreen,
  outpatient: OutpatientGameScreen,
  stationary: StationaryGameScreen,
};

export default function GameScreen(props) {
  const { cd, curriculum, topicsProgress } = props;
  const C = useTheme();
  const { t } = useTranslate();
  const dept = cd?.department || CASES.find(c => c.id === cd?.id)?.department || "emergency";
  const Screen = DEPT_SCREEN[dept] || EmergencyGameScreen;

  const currTopic = curriculum?.topicId
    ? TOPICS.flatMap(c => c.children).find(t => t.id === curriculum.topicId)
    : null;

  const tp = topicsProgress?.[curriculum?.topicId];
  const casesDone = tp?.completedCases?.length || 0;
  const casesTotal = Math.min(currTopic?.cases.length || 0, 3);
  const remaining = curriculum?.caseQueue?.length || 0;

  return (
    <>
      {currTopic && (
        <div style={{
          background: `linear-gradient(135deg,${C.accent}22,${C.green}15)`,
          borderBottom: `1px solid ${C.accent}33`,
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: FONT,
          fontSize: 12,
          color: C.accent,
          flexShrink: 0,
        }}>
          <span>📚</span>
          <span style={{ fontWeight: 600 }}>{t("theory.course")}: {currTopic.name}</span>
          <span style={{ color: C.textDim }}>
            ({casesDone}/{casesTotal})
          </span>
          <div style={{ flex: 1 }} />
          {remaining > 0 && (
            <span style={{ fontSize: 10, color: C.textDim }}>
              {t("result.remainingCase")}: +{remaining}
            </span>
          )}
          {remaining === 0 && casesDone >= casesTotal && QUIZ_QUESTIONS[curriculum.topicId] && (
            <span style={{ fontSize: 10, color: C.yellow, background: `${C.yellow}15`, padding: "2px 8px", borderRadius: 4 }}>
              📝 {t("quiz.quiz")}
            </span>
          )}
        </div>
      )}
      <Screen {...props} />
    </>
  );
}
