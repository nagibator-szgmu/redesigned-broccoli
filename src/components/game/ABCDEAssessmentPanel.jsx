import React, { useState, useMemo } from "react";
import { useTheme } from "../../ui/ThemeContext";
import { FONT } from "../../ui/theme";
import {
  STATUS_CONFIG,
  ABCDE_TABS,
  evaluateABCDEStatuses,
  ABCDESummaryView,
  ABCDEStepTab,
} from "./abcde";

/** Первичный осмотр пациента по протоколу ABCDE */
export default function ABCDEAssessmentPanel({ cd, ps, addEvent }) {
  const C = useTheme();
  const [activeTab, setActiveTab] = useState("A");
  const [results, setResults] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const recordStep = (stepKey, section, actionName, details, isAbnormal = false, isCritical = false) => {
    const now = Date.now();
    const entry = { key: stepKey, section, action: actionName, details, timestamp: now, isAbnormal, isCritical };
    setResults((prev) => ({ ...prev, [stepKey]: entry }));
    if (addEvent) {
      addEvent(`[ABCDE ${section}] ${actionName}: ${details}`, isCritical ? "danger" : isAbnormal ? "warn" : "result");
    }
  };

  const statuses = useMemo(() => {
    return evaluateABCDEStatuses(results, cd, ps);
  }, [results, cd, ps]);

  const criticalFindings = useMemo(() => {
    return Object.values(results).filter((r) => r.isCritical || r.isAbnormal);
  }, [results]);

  return (
    <div style={{ background: C.panelBg, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Top Header with Summary Toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
        <div style={{ fontSize: 11, color: C.accent, fontWeight: 700, fontFamily: FONT, letterSpacing: 0.8, textTransform: "uppercase" }}>
          Первичный осмотр ABCDE
        </div>
        <button
          onClick={() => setShowSummary((prev) => !prev)}
          style={{
            padding: "3px 8px",
            borderRadius: 6,
            background: showSummary ? `${C.accent}22` : C.btnBg,
            border: `1px solid ${showSummary ? C.accent : C.btnBorder}`,
            color: showSummary ? C.accent : C.textDim,
            fontSize: 10,
            fontFamily: FONT,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {showSummary ? "← К шагам" : "📋 Сводка ABCDE"}
        </button>
      </div>

      {/* Tabs Row with Visual Badges */}
      <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
        {ABCDE_TABS.map((tab) => {
          const isActive = activeTab === tab.key && !showSummary;
          const st = STATUS_CONFIG[statuses[tab.key]];
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setShowSummary(false);
              }}
              style={{
                flex: 1,
                minWidth: 54,
                padding: "6px 4px",
                borderRadius: 8,
                background: isActive ? `${C.accent}1c` : C.btnBg,
                border: `1px solid ${isActive ? C.accent : C.btnBorder}`,
                color: isActive ? C.accent : C.text,
                fontSize: 11,
                fontFamily: FONT,
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <span>{tab.key}</span>
              <span style={{ fontSize: 8, padding: "1px 4px", borderRadius: 4, background: st.bg, color: st.text, border: `1px solid ${st.border}`, whiteSpace: "nowrap" }}>
                {st.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Summary View Mode or Sequential Active Tab Content */}
      {showSummary ? (
        <ABCDESummaryView
          statuses={statuses}
          results={results}
          criticalFindings={criticalFindings}
        />
      ) : (
        <ABCDEStepTab
          activeTab={activeTab}
          cd={cd}
          ps={ps}
          results={results}
          recordStep={recordStep}
        />
      )}
    </div>
  );
}
