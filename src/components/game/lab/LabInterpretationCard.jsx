import React, { useState, useMemo } from "react";
import { FONT, CODE } from "../../../ui/theme";
import { parseLabTest, scoreLabEvaluation } from "../../../engine/labAnalysisEngine";
import { IconMicroscope, IconCheck } from "../../../ui/icons";
import LabParamRow from "./LabParamRow";
import LabEvaluationSummary from "./LabEvaluationSummary";

export default function LabInterpretationCard({
  testId,
  testName,
  text = "",
  userSelectedParamIds = null,
  onEvaluationComplete,
  C,
}) {
  const [userEvaluations, setUserEvaluations] = useState({});
  const [isChecked, setIsChecked] = useState(false);

  const parsedItems = useMemo(() => {
    return parseLabTest(testId, text, userSelectedParamIds);
  }, [testId, text, userSelectedParamIds]);

  const scoreResult = useMemo(() => {
    return scoreLabEvaluation(parsedItems, userEvaluations);
  }, [parsedItems, userEvaluations]);

  const handleSelectChoice = (paramId, choice) => {
    setUserEvaluations((prev) => ({
      ...prev,
      [paramId]: prev[paramId] === choice ? undefined : choice,
    }));
  };

  const handleCheck = () => {
    setIsChecked(true);
    if (onEvaluationComplete) {
      onEvaluationComplete(testId, scoreResult);
    }
  };

  const mistakesMap = useMemo(() => {
    const map = {};
    scoreResult.mistakes.forEach((m) => {
      map[m.id] = m;
    });
    return map;
  }, [scoreResult.mistakes]);

  const canCheck = scoreResult.evaluatedCount > 0;

  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${isChecked ? (scoreResult.allCorrect ? C.green : C.yellow) : C.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {/* Шапка бланка */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconMicroscope size={15} color={C.accent} />
          <span style={{ fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: FONT }}>
            {testName || testId.toUpperCase()}
          </span>
        </div>
        <div>
          {!isChecked ? (
            <span style={{ fontSize: 9.5, fontWeight: 700, color: C.accent, background: `${C.accent}14`, border: `1px solid ${C.accent}40`, padding: "2px 8px", borderRadius: 4, fontFamily: FONT }}>
              ТРЕБУЕТ ИНТЕРПРЕТАЦИИ ({scoreResult.evaluatedCount}/{scoreResult.totalCount})
            </span>
          ) : (
            <span style={{ fontSize: 9.5, fontWeight: 700, color: scoreResult.allCorrect ? C.green : C.yellow, background: `${scoreResult.allCorrect ? C.green : C.yellow}14`, border: `1px solid ${scoreResult.allCorrect ? C.green : C.yellow}40`, padding: "2px 8px", borderRadius: 4, fontFamily: FONT }}>
              {scoreResult.allCorrect ? "ВСЕ ВЕРНО (100%)" : `ПРОВЕРЕНО (${scoreResult.scorePercent}%)`}
            </span>
          )}
        </div>
      </div>

      <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT }}>
        Сравните значения с референсными интервалами нормы и определите наличие патологических отклонений:
      </div>

      {/* Список показателей */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {parsedItems.map((item) => (
          <LabParamRow
            key={item.id}
            item={item}
            userChoice={userEvaluations[item.id]}
            onSelectChoice={handleSelectChoice}
            isChecked={isChecked}
            mistake={mistakesMap[item.id]}
            C={C}
          />
        ))}
      </div>

      {/* Кнопка проверки анализа */}
      {!isChecked ? (
        <div style={{ marginTop: 4, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 11, fontFamily: CODE, color: C.textDim }}>
            Оценено: {scoreResult.evaluatedCount} из {scoreResult.totalCount}
          </span>
          <button
            type="button"
            onClick={handleCheck}
            disabled={!canCheck}
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              border: "none",
              background: canCheck ? `linear-gradient(135deg, ${C.accent}, ${C.green})` : `${C.border}50`,
              color: canCheck ? C.bg : C.textDim,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: FONT,
              cursor: canCheck ? "pointer" : "not-allowed",
              boxShadow: canCheck ? `0 2px 8px ${C.accent}25` : "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <IconCheck size={12} strokeWidth={2.5} />
            Подтвердить анализ
          </button>
        </div>
      ) : (
        <LabEvaluationSummary scoreResult={scoreResult} onResetCheck={() => setIsChecked(false)} C={C} />
      )}
    </div>
  );
}
