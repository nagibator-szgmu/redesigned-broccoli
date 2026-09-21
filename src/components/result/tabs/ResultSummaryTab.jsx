import React from "react";
import { ScoreCard, VitalsDelta, DiagnosisBlock, OutpatientRouteResult, StationaryDaySummary } from "../index";

/**
 * ResultSummaryTab — Вкладка «Клинический итог».
 * 
 * Отображает итоговую оценку, правильность диагноза,
 * дельту витальных показателей и исход госпитализации.
 */
export default function ResultSummaryTab({
  result,
  cd,
  ps,
  diagText,
  vitalDeltas,
  isMobile,
  extraResult,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Итоговая карточка оценки */}
      <ScoreCard result={result} cd={cd} ps={ps} isMobile={isMobile} />

      {/* Формулировка диагноза */}
      <DiagnosisBlock result={result} cd={cd} diagText={diagText} isMobile={isMobile} />

      {/* Динамика витальных функций */}
      {vitalDeltas && vitalDeltas.length > 0 && (
        <VitalsDelta vitalDeltas={vitalDeltas} isMobile={isMobile} />
      )}

      {/* Специфичные результаты отделений */}
      {cd.department === "outpatient" && extraResult && (
        <OutpatientRouteResult cd={cd} extraResult={extraResult} isMobile={isMobile} />
      )}
      {cd.department === "stationary" && extraResult && (
        <StationaryDaySummary cd={cd} extraResult={extraResult} isMobile={isMobile} />
      )}
    </div>
  );
}
