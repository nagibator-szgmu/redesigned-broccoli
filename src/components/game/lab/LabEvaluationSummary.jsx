import React from "react";
import { FONT } from "../../../ui/theme";
import { IconCheckCircle, IconAlertTriangle } from "../../../ui/icons";

export default function LabEvaluationSummary({ scoreResult, onResetCheck, C }) {
  const { totalCount, correctCount, scorePercent, allCorrect, feedbackText } = scoreResult;

  return (
    <div
      style={{
        marginTop: 10,
        padding: "10px 12px",
        borderRadius: 8,
        background: allCorrect ? `${C.green}12` : `${C.yellow}12`,
        border: `1px solid ${allCorrect ? C.green : C.yellow}`,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {allCorrect ? (
            <IconCheckCircle size={15} color={C.green} />
          ) : (
            <IconAlertTriangle size={15} color={C.yellow} />
          )}
          <span style={{ fontSize: 12, fontWeight: 700, color: allCorrect ? C.green : C.yellow, fontFamily: FONT }}>
            Точность анализа: {scorePercent}% ({correctCount} из {totalCount})
          </span>
        </div>
        <button
          type="button"
          onClick={onResetCheck}
          style={{
            background: "transparent",
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            padding: "2px 8px",
            fontSize: 10.5,
            color: C.textDim,
            fontFamily: FONT,
            cursor: "pointer",
          }}
        >
          Изменить оценку
        </button>
      </div>
      <div style={{ fontSize: 11.5, color: C.text, fontFamily: FONT, lineHeight: 1.4 }}>
        {feedbackText}
      </div>
    </div>
  );
}
