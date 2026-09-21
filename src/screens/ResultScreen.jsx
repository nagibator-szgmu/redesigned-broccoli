import React, { useState } from "react";
import { FONT } from "../ui/theme";
import { useTheme } from "../ui/ThemeContext";
import { useTranslate } from "../locale/useTranslate";
import { getTopicsForCase } from "../data/topics";
import { getRelatedProtocols } from "../engine/protocols";
import useIsMobile from "../hooks/useIsMobile";
import {
  ResultHeader,
  computeVitalDeltas,
  ResultActions,
  ResultTutorialBanner,
  ResultTabBar,
  isChecklistDone,
} from "../components/result";
import {
  ResultSummaryTab,
  ResultErrorsTab,
  ResultTheoryTab,
  ResultTimelineTab,
} from "../components/result/tabs";

const RESULT_TABS = [
  { id: "summary", label: "Итог и оценка", icon: "📊" },
  { id: "errors", label: "Разбор ошибок", icon: "🚨" },
  { id: "theory", label: "Обоснование и КР", icon: "📖" },
  { id: "timeline", label: "Хронология", icon: "⏱️" },
];

export default function ResultScreen({
  result, cd, ps, trajectory = [], orderedDiag, selTreat, diagText,
  eventLog, setPhase, startGame, assessmentMode, curriculum, advanceCurriculum,
  getNextCurriculumCase, clearCurriculum, getNextCurriculumTopic, extraResult,
  tutorialMode, elapsedSec, revealedAnamnesis,
}) {
  const C = useTheme();
  const isMobile = useIsMobile();
  const { t } = useTranslate();
  const [activeTab, setActiveTab] = useState("summary");

  const relatedTopics = getTopicsForCase(cd?.id);
  const relatedProtocols = getRelatedProtocols(cd?.id);
  const vitalDeltas = computeVitalDeltas(cd, ps, t);

  const checkItemDone = (item) => isChecklistDone(item, orderedDiag, selTreat);
  const checklistItems = assessmentMode && cd?.checklistItems ? cd.checklistItems : [];
  const checklistDone = checklistItems.filter(checkItemDone).length;

  return (
    <div style={{ position: "fixed", inset: 0, overflowY: "auto", background: C.bg, fontFamily: FONT }}>
      <ResultHeader setPhase={setPhase} isMobile={isMobile} />
      <div style={isMobile ? { padding: "14px 14px 80px" } : { maxWidth: 900, margin: "0 auto", padding: "24px 20px 80px" }}>
        {tutorialMode && <ResultTutorialBanner isMobile={isMobile} />}

        <ResultTabBar
          tabs={RESULT_TABS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobile={isMobile}
        />

        <div style={{ marginBottom: 20 }}>
          {activeTab === "summary" && (
            <ResultSummaryTab
              result={result}
              cd={cd}
              ps={ps}
              diagText={diagText}
              vitalDeltas={vitalDeltas}
              isMobile={isMobile}
              extraResult={extraResult}
            />
          )}

          {activeTab === "errors" && (
            <ResultErrorsTab
              result={result}
              cd={cd}
              orderedDiag={orderedDiag}
              selTreat={selTreat}
              isMobile={isMobile}
              assessmentMode={assessmentMode}
              checklistItems={checklistItems}
              checklistDone={checklistDone}
              isChecklistDone={checkItemDone}
              revealedAnamnesis={revealedAnamnesis}
            />
          )}

          {activeTab === "theory" && (
            <ResultTheoryTab
              cd={cd}
              extraResult={extraResult}
              vitalDeltas={vitalDeltas}
              selTreat={selTreat}
              relatedProtocols={relatedProtocols}
              relatedTopics={relatedTopics}
              setPhase={setPhase}
              isMobile={isMobile}
            />
          )}

          {activeTab === "timeline" && (
            <ResultTimelineTab
              eventLog={eventLog}
              trajectory={trajectory}
              elapsedSec={elapsedSec}
              isMobile={isMobile}
            />
          )}
        </div>

        <ResultActions
          curriculum={curriculum}
          advanceCurriculum={advanceCurriculum}
          getNextCurriculumCase={getNextCurriculumCase}
          clearCurriculum={clearCurriculum}
          startGame={startGame}
          setPhase={setPhase}
          getNextCurriculumTopic={getNextCurriculumTopic}
        />
      </div>
    </div>
  );
}
