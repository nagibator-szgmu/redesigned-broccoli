import React, { useState, useMemo } from "react";
import { useTheme } from "../../ui/ThemeContext";
import { FONT, CODE } from "../../ui/theme";
import { STitle } from "../../ui/components";
import { buildClinicalRoadmap } from "../../engine/clinicalRoadmapEngine";
import { evaluateClinicalSafety } from "../../engine/safetyEngine";
import { deriveProblemList } from "../../engine/problemListEngine";

/**
 * Rebuilt Clinical Roadmap Debrief Panel (Task 4).
 * Breaks down completed case actions into official Clinical Guidelines stages:
 * 1. Анамнез
 * 2. Осмотр
 * 3. Исследования
 * 4. Диагноз
 * 5. Лечение
 * 6. Маршрутизация
 * With clear visual indicators: 🟢 Выполнено (хорошо) / 🔴 Не выполнено (пропущено/ошибка) / 🟡 Частично.
 */
export default function DebriefPanel({
  cd,
  initialPS,
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
    setExpandedStages(prev => ({ ...prev, [id]: !prev[id] }));
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

  const safety = useMemo(() => {
    return evaluateClinicalSafety(cd, selTreat, selDiag, revealedAnamnesis, trajectory);
  }, [cd, selTreat, selDiag, revealedAnamnesis, trajectory]);

  const doneStagesCount = roadmap.filter(s => s.status === "done").length;

  return (
    <div data-testid="clinical-debrief-panel" style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12, marginBottom: 16 }}>
      <STitle icon="🗺️" label="Разбор по дорожной карте клинических рекомендаций (Roadmap)" color={C.accent} />

      {/* Summary Score Banner */}
      <div
        style={{
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: doneStagesCount >= 5 ? `${C.green}18` : doneStagesCount >= 3 ? `${C.yellow}18` : `${C.red}18`,
              border: `1.5px solid ${doneStagesCount >= 5 ? C.green : doneStagesCount >= 3 ? C.yellow : C.red}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            {doneStagesCount >= 5 ? "🏆" : doneStagesCount >= 3 ? "⚡" : "⚠️"}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: FONT }}>
              Соответствие дорожной карте КР: {doneStagesCount} из {roadmap.length} этапов
            </div>
            <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, marginTop: 2 }}>
              {cd.sourceReference ? `${cd.sourceReference.name} (${cd.sourceReference.year || "Стандарт"})` : "Клинические рекомендации Минздрава РФ"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {roadmap.map((s) => {
            const color = s.statusColor === "green" ? C.green : s.statusColor === "yellow" ? C.yellow : C.red;
            return (
              <div
                key={s.id}
                title={`${s.title}: ${s.statusLabel}`}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: `${color}25`,
                  border: `1px solid ${color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
              >
                {s.status === "done" ? "✓" : s.status === "partial" ? "•" : "✕"}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step by step Roadmap stages list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {roadmap.map((stage) => {
          const isExpanded = expandedStages[stage.id];
          const color = stage.statusColor === "green" ? C.green : stage.statusColor === "yellow" ? C.yellow : C.red;

          return (
            <div
              key={stage.id}
              style={{
                background: C.panel,
                border: `1px solid ${stage.status === "done" ? `${C.green}40` : stage.status === "partial" ? `${C.yellow}40` : `${C.red}40`}`,
                borderRadius: 14,
                overflow: "hidden",
                transition: "all 0.15s ease",
              }}
            >
              {/* Stage Header */}
              <div
                onClick={() => toggleStage(stage.id)}
                style={{
                  padding: "12px 16px",
                  background: `${color}0c`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{stage.icon}</span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: C.white, fontFamily: FONT }}>
                      {stage.title}
                    </div>
                    <div style={{ fontSize: 10.5, color: C.textDim, fontFamily: FONT, marginTop: 1 }}>
                      {stage.krReference}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: color,
                      background: `${color}18`,
                      border: `1px solid ${color}44`,
                      borderRadius: 6,
                      padding: "3px 10px",
                      fontFamily: FONT,
                    }}
                  >
                    {stage.status === "done" ? "🟢 " : stage.status === "partial" ? "🟡 " : "🔴 "}
                    {stage.statusLabel}
                  </span>
                  <span style={{ color: C.textDim, fontSize: 11 }}>{isExpanded ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Stage Content */}
              {isExpanded && (
                <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {/* Guideline Rationale */}
                  <div
                    style={{
                      fontSize: 12,
                      color: C.text,
                      lineHeight: 1.6,
                      fontFamily: FONT,
                      padding: "8px 12px",
                      background: C.headerBg2,
                      borderRadius: 8,
                      borderLeft: `3px solid ${color}`,
                    }}
                  >
                    <strong>Клиническое обоснование:</strong> {stage.rationale}
                  </div>

                  {/* Item Breakdown */}
                  {stage.items && stage.items.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                      {stage.items.map((item, idx) => {
                        const isSuccess = item.krStatus === "success";
                        const isCritDanger = item.krStatus === "critical_danger";
                        const itemColor = isCritDanger ? C.red : isSuccess ? C.green : C.red;

                        return (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                              padding: "8px 12px",
                              borderRadius: 8,
                              background: isCritDanger ? `${C.red}18` : isSuccess ? `${C.green}0e` : `${C.red}0c`,
                              border: `1px solid ${itemColor}33`,
                            }}
                          >
                            <span style={{ fontSize: 14, marginTop: 1 }}>
                              {isCritDanger ? "🚨" : isSuccess ? "🟢" : "🔴"}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.white, fontFamily: FONT }}>
                                {item.name}
                              </div>
                              {item.detail && (
                                <div style={{ fontSize: 11.5, color: C.textDim, marginTop: 2, fontFamily: FONT, lineHeight: 1.4 }}>
                                  {item.detail}
                                </div>
                              )}
                              {item.rationale && (
                                <div style={{ fontSize: 11, color: itemColor, marginTop: 2, fontFamily: FONT }}>
                                  {item.rationale}
                                </div>
                              )}
                            </div>
                            <span
                              style={{
                                fontSize: 10.5,
                                fontWeight: 700,
                                color: itemColor,
                                textTransform: "uppercase",
                                fontFamily: CODE,
                              }}
                            >
                              {isCritDanger ? "ОШИБКА" : isSuccess ? "ВЫПОЛНЕНО" : "ПРОПУЩЕНО"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
