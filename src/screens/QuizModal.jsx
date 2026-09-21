import { createPortal } from "react-dom";
import { FONT, RADIUS } from "../ui/theme";
import { useTheme } from "../ui/ThemeContext";
import useIsMobile from "../hooks/useIsMobile";
import { useQuizSession } from "./quiz/useQuizSession";
import QuizHeader from "./quiz/QuizHeader";
import QuizQuestionCard from "./quiz/QuizQuestionCard";
import QuizResultView from "./quiz/QuizResultView";

export default function QuizModal({ topicId, onClose, onResult }) {
  const C = useTheme();
  const isMobile = useIsMobile();
  const session = useQuizSession(topicId, onResult);

  if (!session.quiz) return null;

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
          position: "fixed",
          ...(isMobile
            ? { top: 0, right: 0, left: 0, bottom: 0, borderRadius: 0 }
            : {
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                maxWidth: 600,
                maxHeight: "90vh",
                borderRadius: RADIUS.md,
              }),
          zIndex: 99999,
          background: C.overlayBg,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${C.border}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
          fontFamily: FONT,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <QuizHeader onClose={onClose} isMobile={isMobile} />

        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
          {session.showResult ? (
            <QuizResultView
              quiz={session.quiz}
              answers={session.answers}
              correctCount={session.correctCount}
              total={session.total}
              passed={session.passed}
              onRestart={session.handleRestart}
              onClose={onClose}
              isMobile={isMobile}
            />
          ) : (
            <QuizQuestionCard
              q={session.q}
              currentQ={session.currentQ}
              total={session.total}
              isLast={session.isLast}
              selectedOption={session.selectedOption}
              answered={session.answered}
              onSelect={session.handleSelect}
              onNext={session.handleNext}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
