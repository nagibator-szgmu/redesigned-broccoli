import {
  buildAnamnesisStage,
  buildExamStage,
  buildDiagnosticsStage,
  buildDiagnosisStage,
  buildTreatmentStage,
  buildRoutingStage,
} from "./roadmap/index.js";

/**
 * Clinical Roadmap Engine for Case Debriefing.
 * Builds structured step-by-step guideline verification across 6 mandatory stages:
 * 1. Сбор анамнеза и жалоб (Anamnesis)
 * 2. Физикальный осмотр и ABCDE (Examination)
 * 3. Лабораторно-инструментальная диагностика (Diagnostics)
 * 4. Клинический диагноз по КР (Diagnosis)
 * 5. Фармакотерапия и неотложные манипуляции (Treatment)
 * 6. Маршрутизация и исход (Routing & Disposition)
 */
export function buildClinicalRoadmap({
  cd,
  selTreat = [],
  selDiag = [],
  revealedResults = {},
  revealedAnamnesis = new Set(),
  diagText = "",
  extraResult = null,
  trajectory = [],
}) {
  if (!cd) return [];

  const sourceRef = cd.sourceReference
    ? `${cd.sourceReference.name}${cd.sourceReference.year ? ` (${cd.sourceReference.year})` : ""}`
    : "Клинические рекомендации Минздрава РФ";

  const anamnesisStage = buildAnamnesisStage({
    cd,
    sourceRef,
    revealedAnamnesis,
    trajectory,
  });

  const examStage = buildExamStage({
    cd,
    sourceRef,
  });

  const diagnosticsStage = buildDiagnosticsStage({
    cd,
    sourceRef,
    selDiag,
    revealedResults,
  });

  const diagnosisStage = buildDiagnosisStage({
    cd,
    sourceRef,
    diagText,
  });

  const treatmentStage = buildTreatmentStage({
    cd,
    sourceRef,
    selTreat,
  });

  const routingStage = buildRoutingStage({
    cd,
    sourceRef,
    extraResult,
  });

  return [
    anamnesisStage,
    examStage,
    diagnosticsStage,
    diagnosisStage,
    treatmentStage,
    routingStage,
  ];
}

