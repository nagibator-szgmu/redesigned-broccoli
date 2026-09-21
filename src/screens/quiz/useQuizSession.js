import { useState } from "react";
import { getQuizForTopic } from "../../data/quiz";

export function useQuizSession(topicId, onResult) {
  const quiz = getQuizForTopic(topicId);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);

  if (!quiz) {
    return { quiz: null };
  }

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
      const updatedAnswers = { ...answers, [q.id]: selectedOption };
      const finalCorrect = quiz.questions.filter(
        (question) => updatedAnswers[question.id] === question.correct
      ).length;
      const finalPassed = finalCorrect >= quiz.passingScore;
      if (onResult) {
        onResult(finalPassed, { correct: finalCorrect, total });
      }
    } else {
      setCurrentQ((v) => v + 1);
      setSelectedOption(null);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setAnswers({});
    setShowResult(false);
    setSelectedOption(null);
    setAnswered(false);
  };

  const correctCount = quiz.questions.filter(
    (question) => answers[question.id] === question.correct
  ).length;
  const passed = correctCount >= quiz.passingScore;

  return {
    quiz,
    q,
    total,
    isLast,
    currentQ,
    answers,
    showResult,
    selectedOption,
    answered,
    correctCount,
    passed,
    handleSelect,
    handleNext,
    handleRestart,
  };
}
