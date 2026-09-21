import React from "react";
import PauseOverlay from "../PauseOverlay";
import LearningTipToast from "../LearningTipToast";
import TheoryModal from "../TheoryModal";
import ReassessmentModal from "../ReassessmentModal";

/**
 * Контейнер оверлеев и модальных окон рабочей станции врача.
 */
export default function WorkstationOverlays({
  learningMode,
  learningTip,
  paused,
  setPaused,
  showTheory,
  setShowTheory,
  relatedTopics = [],
  activeTheoryTopic,
  setActiveTheoryTopic,
  reassessModalOpen,
  setReassessModalOpen,
  baselinePS,
  currentPS,
  prevProblems = [],
  curProblems = [],
  iteration = 1,
  onConfirmReassessment,
}) {
  return (
    <>
      {learningMode && learningTip && <LearningTipToast tip={learningTip} isMobile={false} />}
      {learningMode && paused && <PauseOverlay onResume={() => setPaused(false)} />}
      <TheoryModal
        relatedTopics={relatedTopics}
        showTheory={showTheory}
        setShowTheory={setShowTheory}
        activeTheoryTopic={activeTheoryTopic}
        setActiveTheoryTopic={setActiveTheoryTopic}
        isMobile={false}
      />
      <ReassessmentModal
        isOpen={reassessModalOpen}
        onClose={() => setReassessModalOpen(false)}
        baselinePS={baselinePS}
        currentPS={currentPS}
        prevProblems={prevProblems}
        curProblems={curProblems}
        iteration={iteration}
        onConfirmReassessment={onConfirmReassessment}
        isMobile={false}
      />
    </>
  );
}
