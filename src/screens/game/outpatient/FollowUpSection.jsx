import React from "react";
import { FONT, CODE } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { IconCheck, IconClipboard } from "../../../ui/icons";

/**
 * FollowUpSection
 * Интерактивный блок выбора тактики диспансерного наблюдения (Follow-up)
 * Включает чипсы сроков контрольного визита и чекбоксы контрольных биомаркеров.
 */
export default function FollowUpSection({ followUpPlan, followUpData = {}, onChange }) {
  const C = useTheme();

  if (!followUpPlan) return null;

  const currentTiming = followUpData.timingId || null;
  const currentBiomarkers = followUpData.selectedBiomarkers || [];

  const handleSelectTiming = (id) => {
    onChange && onChange({
      ...followUpData,
      timingId: currentTiming === id ? null : id,
    });
  };

  const handleToggleBiomarker = (id) => {
    const next = currentBiomarkers.includes(id)
      ? currentBiomarkers.filter((x) => x !== id)
      : [...currentBiomarkers, id];
    onChange && onChange({
      ...followUpData,
      selectedBiomarkers: next,
    });
  };

  return (
    <div
      style={{
        background: `${C.panel2 || C.panel}80`,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "14px 16px",
        marginTop: 12,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <IconClipboard size={15} color={C.accent} />
        <span style={{ fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: FONT }}>
          План диспансерного наблюдения и контроля (Follow-up)
        </span>
      </div>

      {/* 1. Срок контрольного визита */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.subText, fontFamily: FONT, marginBottom: 6 }}>
          Срок повторного приема / контроля терапии:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {(followUpPlan.timingOptions || []).map((opt) => {
            const isSelected = currentTiming === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectTiming(opt.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontFamily: FONT,
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  border: `1px solid ${isSelected ? C.accent : C.border}`,
                  background: isSelected ? `${C.accent}22` : "transparent",
                  color: isSelected ? C.accent : C.text,
                  transition: "all 0.15s ease",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Контрольные биомаркеры */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.subText, fontFamily: FONT, marginBottom: 6 }}>
          Контрольные биомаркеры и инструментальные тесты:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {(followUpPlan.biomarkers || []).map((bm) => {
            const isChecked = currentBiomarkers.includes(bm.id);
            return (
              <div
                key={bm.id}
                onClick={() => handleToggleBiomarker(bm.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 10px",
                  borderRadius: 8,
                  cursor: "pointer",
                  background: isChecked ? `${C.green || "#10B981"}15` : "transparent",
                  border: `1px solid ${isChecked ? (C.green || "#10B981") : C.border}`,
                  transition: "all 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    border: `1px solid ${isChecked ? (C.green || "#10B981") : C.border}`,
                    background: isChecked ? (C.green || "#10B981") : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {isChecked && <IconCheck size={12} color="#ffffff" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: 12.5, color: isChecked ? C.text : C.textDim, fontFamily: FONT }}>
                  {bm.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {followUpPlan.redFlags && (
        <div
          style={{
            marginTop: 4,
            padding: "8px 10px",
            borderRadius: 6,
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            fontSize: 11,
            color: C.textDim,
            fontFamily: CODE,
            lineHeight: 1.45,
          }}
        >
          <strong style={{ color: "#EF4444" }}>Красные флаги для пациента: </strong>
          {followUpPlan.redFlags}
        </div>
      )}
    </div>
  );
}
