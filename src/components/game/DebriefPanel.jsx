import React, { useState, useMemo } from "react";
import { useTheme } from "../../ui/ThemeContext";
import { STitle } from "../../ui/components";
import { buildClinicalRoadmap } from "../../engine/clinicalRoadmapEngine";
import DebriefSummaryBanner from "./debrief/DebriefSummaryBanner";
import DebriefStageCard from "./debrief/DebriefStageCard";

/**
 * Rebuilt Clinical Roadmap Debrief Panel.
 * Breaks down completed case actions into official Clinical Guidelines stages.
 */
export default function DebriefPanel({
  cd,
  trajectory = [],
  selTreat = [],
  selDiag = [],
  revealedResults = {},
  revealedAnamnesis = new Set(),
  diagText = "",
  extraResult = null,
}) {
  const C = useTheme();
  const [expandedStages, setExpandedStages] = useState({
    diagnostics: true,
    treatment: true,
    diagnosis: true,
  });

  const toggleStage = (id) => {
    setExpandedStages((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const roadmap = useMemo(() => {
    return buildClinicalRoadmap({
      cd,
      selTreat,
      selDiag,
      revealedResults,
      revealedAnamnesis,
      diagText,
      extraResult,
      trajectory,
    });
  }, [cd, selTreat, selDiag, revealedResults, revealedAnamnesis, diagText, extraResult, trajectory]);

  const doneStagesCount = roadmap.filter((s) => s.status === "done").length;

  return (
    <div
      data-testid="clinical-debrief-panel"
      style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12, marginBottom: 16 }}
    >
      <STitle icon="🗺️" label="Разбор по дорожной карте клинических рекомендаций (Roadmap)" color={C.accent} />

      <DebriefSummaryBanner
        doneStagesCount={doneStagesCount}
        roadmap={roadmap}
        cd={cd}
        C={C}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {roadmap.map((stage) => (
          <DebriefStageCard
            key={stage.id}
            stage={stage}
            isExpanded={expandedStages[stage.id]}
            toggleStage={toggleStage}
            C={C}
          />
        ))}
      </div>
    </div>
  );
}
