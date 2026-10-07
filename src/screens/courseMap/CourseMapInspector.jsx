import React from "react";
import { FONT } from "../../ui/theme";
import { IconPlay, IconBrain, IconX } from "../../ui/icons";
import { THEORY } from "../../data/theory";
import CASES from "../../data/cases";
import CourseMapInspectorCases from "./CourseMapInspectorCases";

/**
 * Inspector panel / Bottom sheet for selected course map topic.
 */
export default function CourseMapInspector({
  step,
  isPassed,
  isUnlocked,
  completedCases = [],
  onStartCase,
  onOpenTheory,
  onClose,
  isMobile,
  C,
}) {
  if (!step) return null;

  const theoryInfo = THEORY[step.id];
  const summaryText = theoryInfo?.definition || "Клинический модуль по углубленной диагностике и неотложной терапии.";

  const topicCaseObjs = (step.cases || []).map((caseId) => {
    const found = CASES.find((c) => String(c.id) === String(caseId));
    return found || { id: caseId, name: `Клинический случай #${caseId}`, department: "icu" };
  });

  const content = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 14 }}>
      {/* Top Specialty Badge & Close button */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: `${step.catColor}18`,
              border: `1px solid ${step.catColor}35`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {React.cloneElement(step.icon, { size: 22, color: step.catColor })}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 10.5, color: step.catColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
                {step.catName}
              </span>
              {isPassed && (
                <span style={{ fontSize: 9.5, color: C.green, background: `${C.green}20`, padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>
                  ПРОЙДЕН
                </span>
              )}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.white, fontFamily: FONT, lineHeight: 1.25 }}>
              {step.name}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="icon-btn"
          style={{ background: "transparent", border: "none", color: C.textDim, cursor: "pointer", padding: 4 }}
          aria-label="Закрыть панель"
        >
          <IconX size={18} color={C.textDim} />
        </button>
      </div>

      {/* Definition summary */}
      <div
        style={{
          fontSize: 12.5,
          color: C.textDim,
          fontFamily: FONT,
          lineHeight: 1.5,
          background: `${C.panelBg}99`,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "10px 12px",
        }}
      >
        {summaryText}
      </div>

      {/* Cases list */}
      <CourseMapInspectorCases
        cases={topicCaseObjs}
        completedCases={completedCases}
        isUnlocked={isUnlocked}
        onStartCase={onStartCase}
        C={C}
      />

      {/* Action CTA Buttons */}
      <div style={{ display: "flex", gap: 8, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
        <button
          onClick={onOpenTheory}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "10px 14px", borderRadius: 10, background: C.panelBg, border: `1px solid ${C.border}`,
            color: C.white, fontSize: 12.5, fontWeight: 600, fontFamily: FONT, cursor: "pointer",
          }}
        >
          <IconBrain size={14} color={C.accent} />
          <span>Теория</span>
        </button>

        {isUnlocked && (
          <button
            onClick={() => onStartCase()}
            style={{
              flex: 1.4, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "10px 16px", borderRadius: 10, background: C.accent, border: "none",
              color: "#FFFFFF", fontSize: 13, fontWeight: 700, fontFamily: FONT, cursor: "pointer",
              boxShadow: `0 3px 12px ${C.accentDim}`,
            }}
          >
            <IconPlay size={14} color="#FFFFFF" />
            <span>Начать кейс</span>
          </button>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
          background: `linear-gradient(180deg, ${C.panelBg} 0%, ${C.dimBg} 100%)`,
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          borderTop: `1px solid ${C.border}`, borderTopLeftRadius: 20, borderTopRightRadius: 20,
          padding: "12px 18px 24px", boxShadow: "0 -8px 32px rgba(0,0,0,0.5)", maxHeight: "65vh",
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: "0 auto 12px" }} />
        {content}
      </div>
    );
  }

  return (
    <div
      style={{
        width: 360, background: `linear-gradient(135deg, ${C.panelBg} 0%, ${C.dimBg} 100%)`,
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${C.border}`, borderRadius: 18, padding: "20px",
        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.35)", display: "flex", flexDirection: "column",
        height: "calc(100vh - 120px)", alignSelf: "flex-start", position: "sticky", top: 20,
      }}
    >
      {content}
    </div>
  );
}
