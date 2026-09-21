import { useState, useMemo } from "react";
import { calculateMap } from "../../../engine/reassessmentEngine";
import { deriveProblemList } from "../../../engine/problemListEngine";

/**
 * Хук логики переоценки динамики пациента на рабочей станции.
 */
export function useWorkstationReassessment({
  trajectory = [],
  recordTrajectoryCheckpoint,
  ps,
  revealedResults,
  selTreat = [],
  addEvent,
}) {
  const [reassessModalOpen, setReassessModalOpen] = useState(false);

  const reassessmentIteration = useMemo(() => {
    return (trajectory.filter((c) => c.checkpointId?.startsWith("REASSESSMENT")).length) + 1;
  }, [trajectory]);

  const handleConfirmReassessment = (data) => {
    if (!data || !addEvent) return;
    const { report, chosenPlan, iteration } = data;
    const type =
      report.overallResponse === "positive"
        ? "result"
        : report.overallResponse === "negative"
        ? "critical"
        : "warn";
    addEvent(
      `[REASSESSMENT #${iteration}] ${report.summaryText} (Улучшено: ${report.improvedCount}, Ухудшено: ${report.worsenedCount}) → План: ${chosenPlan?.label || "Продолжить"}`,
      type
    );

    if (recordTrajectoryCheckpoint) {
      recordTrajectoryCheckpoint({
        checkpointId: `REASSESSMENT #${iteration}`,
        iteration,
        vitals: { ...ps },
        map: calculateMap(ps.sbp, ps.dbp),
        overallResponse: report.overallResponse,
        summaryText: report.summaryText,
        chosenPlan,
        activeProblems: deriveProblemList(ps, revealedResults),
        recentInterventions: [...selTreat],
      });
    }
  };

  return {
    reassessModalOpen,
    setReassessModalOpen,
    reassessmentIteration,
    handleConfirmReassessment,
  };
}
