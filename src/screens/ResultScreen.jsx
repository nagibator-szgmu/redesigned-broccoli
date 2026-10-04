import React from "react";
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
  isChecklistDone,
} from "../components/result";
import {
  ResultSummaryTab,
  ResultErrorsTab,
  ResultTheoryTab,
  ResultTimelineTab,
} from "../components/result/tabs";
import { IconAlertTriangle, IconBook, IconClock } from "../ui/icons";

function ResultSectionHeader({ icon, title, C, isMobile }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        paddingBottom: 6,
        borderBottom: `1px solid ${C.border}`,
        marginTop: 12,
        marginBottom: 4,
      }}
    >
      {icon}
      <span
        style={{
          fontSize: isMobile ? 13 : 14,
          fontWeight: 700,
          color: C.white,
          fontFamily: FONT,
          letterSpacing: "0.2px",
        }}
      >
        {title}
      </span>
    </div>
  );
}

export default function ResultScreen({
  result, cd, ps, trajectory = [], orderedDiag, selTreat, diagText,
  eventLog, setPhase, startGame, assessmentMode, curriculum, advanceCurriculum,
  getNextCurriculumCase, clearCurriculum, getNextCurriculumTopic, extraResult,
  tutorialMode, elapsedSec, revealedAnamnesis,
}) {
  const C = useTheme();
  const isMobile = useIsMobile();
  const { t } = useTranslate();

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

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
          {/* 1. Клинический итог и оценка */}
          <ResultSummaryTab
            result={result}
            cd={cd}
            ps={ps}
            diagText={diagText}
            vitalDeltas={vitalDeltas}
            isMobile={isMobile}
            extraResult={extraResult}
          />

          {/* 2. Разбор ошибок и клинических дефектов */}
          <ResultSectionHeader
            icon={<IconAlertTriangle size={16} color={C.red} />}
            title="Разбор ошибок и клинических дефектов"
            C={C}
            isMobile={isMobile}
          />
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

          {/* 3. Клиническое обоснование, протоколы и КР Минздрава */}
          <ResultSectionHeader
            icon={<IconBook size={16} color={C.accent} />}
            title="Клиническое обоснование и протоколы"
            C={C}
            isMobile={isMobile}
          />
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

          {/* 4. Хронология ведения пациента */}
          <ResultSectionHeader
            icon={<IconClock size={16} color={C.textDim} />}
            title="Хронология ведения пациента"
            C={C}
            isMobile={isMobile}
          />
          <ResultTimelineTab
            eventLog={eventLog}
            trajectory={trajectory}
            elapsedSec={elapsedSec}
            isMobile={isMobile}
          />
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
