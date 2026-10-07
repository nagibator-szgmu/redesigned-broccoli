import React, { useState, useMemo } from "react";
import { useTranslate } from "../locale/useTranslate";
import { useTheme } from "../ui/ThemeContext";
import { FONT } from "../ui/theme";
import useIsMobile from "../hooks/useIsMobile";
import { TOPICS } from "../data/topics";
import {
  IconCardiac, IconNeuro, IconRespiratory, IconInfectious,
  IconEndocrine, IconToxicology, IconAbdominal,
} from "../ui/icons";
import CourseMapHeader from "./courseMap/CourseMapHeader";
import CourseMapNode from "./courseMap/CourseMapNode";
import CourseMapPathSvg from "./courseMap/CourseMapPathSvg";
import CourseMapInspector from "./courseMap/CourseMapInspector";

const CAT_ICONS = {
  cardiology: IconCardiac, neurology: IconNeuro, respiratory: IconRespiratory,
  infectious: IconInfectious, endocrine: IconEndocrine, toxicology: IconToxicology,
  abdominal: IconAbdominal, surgery: IconAbdominal,
};

export default function CourseMapScreen({ setPhase, progress, startGame, progressionMode = "strict" }) {
  const C = useTheme();
  const { t } = useTranslate();
  const isMobile = useIsMobile(860);

  // Flatten topics into linear track sequence
  const allSteps = useMemo(() => {
    const list = [];
    TOPICS.forEach((cat) => {
      const IconComp = CAT_ICONS[cat.id] || IconCardiac;
      cat.children.forEach((topic) => {
        list.push({
          id: topic.id,
          name: topic.name,
          cases: topic.cases || [],
          icon: <IconComp size={20} color="currentColor" />,
          catName: cat.name,
          catColor: cat.id === "cardiology" ? C.red : cat.id === "neurology" ? C.purple : C.accent,
        });
      });
    });
    return list;
  }, [C]);

  // Find index of first incomplete unlocked topic (default selection)
  const initialIndex = useMemo(() => {
    const idx = allSteps.findIndex((s) => {
      const isPassed = progress ? progress.isTopicComplete(s.id) : false;
      const isUnlocked = progress ? progress.isTopicUnlocked(s.id, progressionMode) : true;
      return isUnlocked && !isPassed;
    });
    return idx >= 0 ? idx : 0;
  }, [allSteps, progress, progressionMode]);

  const [selectedTopicId, setSelectedTopicId] = useState(isMobile ? null : allSteps[initialIndex]?.id);

  const selectedStep = allSteps.find((s) => s.id === selectedTopicId) || (isMobile ? null : allSteps[0]);
  const completedCount = allSteps.filter((s) => progress?.isTopicComplete(s.id)).length;

  const handleStartCase = (targetCaseId) => {
    if (!selectedStep) return;
    if (targetCaseId && startGame) {
      startGame(targetCaseId);
      return;
    }
    const topicProg = progress?.getTopicProgress(selectedStep.id);
    const uncompleted = selectedStep.cases.filter((id) => !topicProg?.completedCases?.includes(id));
    const nextCase = uncompleted[0] || selectedStep.cases[0];
    if (progress?.startCurriculum) progress.startCurriculum(selectedStep.id);
    if (nextCase && startGame) startGame(nextCase);
  };

  const handleOpenTheory = () => {
    if (progress?.startCurriculum && selectedStep) {
      progress.startCurriculum(selectedStep.id);
    }
    setPhase("theory");
  };

  const nodeSpacing = isMobile ? 86 : 98;
  const nodeCenterX = isMobile ? 41 : 45;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: C.bgGrad, fontFamily: FONT, overflow: "hidden" }}>
      <CourseMapHeader
        onBack={() => setPhase("menu")}
        title={t("courseMap.title") || "Карта курса"}
        completedCount={completedCount}
        totalCount={allSteps.length}
        C={C}
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {/* Scrollable Track Section */}
        <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "24px 14px 100px" : "36px 32px", position: "relative" }}>
          <div style={{ maxWidth: 520, margin: "0 auto", position: "relative", minHeight: allSteps.length * nodeSpacing }}>
            <CourseMapPathSvg
              stepsCount={allSteps.length}
              currentIndex={initialIndex}
              nodeSpacing={nodeSpacing}
              nodeCenterX={nodeCenterX}
              startY={30}
              C={C}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 18 : 22, position: "relative", zIndex: 1 }}>
              {allSteps.map((step, idx) => {
                const isPassed = progress ? progress.isTopicComplete(step.id) : false;
                const isUnlocked = progress ? progress.isTopicUnlocked(step.id, progressionMode) : true;
                const isCurrent = isUnlocked && !isPassed;
                const status = isPassed ? "completed" : isCurrent ? "current" : isUnlocked ? "unlocked" : "locked";

                return (
                  <CourseMapNode
                    key={step.id}
                    step={step}
                    index={idx}
                    status={status}
                    isSelected={selectedTopicId === step.id}
                    onSelect={(st) => setSelectedTopicId(st.id)}
                    isMobile={isMobile}
                    C={C}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Inspector: Docked panel on desktop, bottom sheet on mobile */}
        {selectedStep && (
          <div style={isMobile ? {} : { padding: "24px 28px 24px 0", flexShrink: 0 }}>
            <CourseMapInspector
              step={selectedStep}
              isPassed={progress?.isTopicComplete(selectedStep.id)}
              isUnlocked={progress?.isTopicUnlocked(selectedStep.id, progressionMode)}
              completedCases={progress?.getTopicProgress(selectedStep.id)?.completedCases || []}
              onStartCase={handleStartCase}
              onOpenTheory={handleOpenTheory}
              onClose={() => setSelectedTopicId(null)}
              isMobile={isMobile}
              C={C}
            />
          </div>
        )}
      </div>
    </div>
  );
}
