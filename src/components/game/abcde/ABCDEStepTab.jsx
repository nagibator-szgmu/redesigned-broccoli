import React from "react";
import ABCDEStepContent from "./ABCDEStepContent";
import ABCDEActionHistory from "./ABCDEActionHistory";

/** Активный шаг протокола первичного обследования ABCDE */
export default function ABCDEStepTab({ activeTab, cd, ps, results, recordStep }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <ABCDEStepContent
        activeTab={activeTab}
        cd={cd}
        ps={ps}
        results={results}
        recordStep={recordStep}
      />
      <ABCDEActionHistory activeTab={activeTab} results={results} />
    </div>
  );
}
