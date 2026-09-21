import React from "react";
import ABCDEStepsAirBreathing from "./ABCDEStepsAirBreathing";
import ABCDEStepsCirculation from "./ABCDEStepsCirculation";
import ABCDEStepsDisabilityExposure from "./ABCDEStepsDisabilityExposure";

/** Контейнер активных шагов обследования ABCDE */
export default function ABCDEStepContent({ activeTab, cd, ps, results, recordStep }) {
  return (
    <>
      {(activeTab === "A" || activeTab === "B") && (
        <ABCDEStepsAirBreathing
          activeTab={activeTab}
          cd={cd}
          ps={ps}
          results={results}
          recordStep={recordStep}
        />
      )}
      {activeTab === "C" && (
        <ABCDEStepsCirculation
          activeTab={activeTab}
          ps={ps}
          results={results}
          recordStep={recordStep}
        />
      )}
      {(activeTab === "D" || activeTab === "E") && (
        <ABCDEStepsDisabilityExposure
          activeTab={activeTab}
          cd={cd}
          ps={ps}
          results={results}
          recordStep={recordStep}
        />
      )}
    </>
  );
}
