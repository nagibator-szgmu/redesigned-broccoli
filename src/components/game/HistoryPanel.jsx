import React, { useState } from "react";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { IconClipboard, IconSearch } from "../../ui/icons";

/**
 * Clean Clinical Objective Examination & History Accordion Panel.
 * Sections are fully visible and open by default, with smooth accordion toggle.
 * No auto-scroll or disruptive animations.
 */
export default function HistoryPanel({
  cd,
  onRevealAnamnesis,
  isMobile = false
}) {
  const C = useTheme();
  const { t } = useTranslate();

  const [anamnesisOpen, setAnamnesisOpen] = useState(true);
  const [examOpen, setExamOpen] = useState(true);

  if (!cd) return null;

  const anamnesisText = cd.anamnesis || cd.shortHistory || "Данные анамнеза отсутствуют.";
  const examText = cd.exam || "Данные объективного осмотра в пределах нормы.";

  const handleToggleAnamnesis = () => {
    const next = !anamnesisOpen;
    setAnamnesisOpen(next);
    if (next && onRevealAnamnesis) {
      onRevealAnamnesis("shortHistory");
    }
  };

  const handleToggleExam = () => {
    const next = !examOpen;
    setExamOpen(next);
    if (next && onRevealAnamnesis) {
      onRevealAnamnesis("exam");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: isMobile ? 8 : 10 }}>
      {/* Section 1: Anamnesis & Life History */}
      <div style={{
        background: C.panelBg,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color 0.2s"
      }}>
        <div
          onClick={handleToggleAnamnesis}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            background: anamnesisOpen ? `${C.accent}0d` : C.panelBg,
            borderBottom: anamnesisOpen ? `1px solid ${C.border}` : "none",
            cursor: "pointer",
            userSelect: "none"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IconClipboard size={14} color={C.accent} />
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: C.white,
              fontFamily: FONT,
              letterSpacing: 0.3
            }}>
              {t("history.short") || "Анамнез заболевания и жизни"}
            </span>
          </div>
          <span style={{
            fontSize: 11,
            color: C.textDim,
            fontWeight: 600,
            fontFamily: FONT,
            transition: "transform 0.2s",
            transform: anamnesisOpen ? "rotate(180deg)" : "rotate(0deg)"
          }}>
            ▼
          </span>
        </div>

        {anamnesisOpen && (
          <div style={{
            padding: "12px 14px",
            fontSize: 12.5,
            lineHeight: 1.65,
            color: C.text,
            fontFamily: FONT,
            background: C.panelBg
          }}>
            <p style={{ margin: 0 }}>{anamnesisText}</p>
          </div>
        )}
      </div>

      {/* Section 2: Objective Physical Examination */}
      <div style={{
        background: C.panelBg,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color 0.2s"
      }}>
        <div
          onClick={handleToggleExam}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            background: examOpen ? `${C.green}0d` : C.panelBg,
            borderBottom: examOpen ? `1px solid ${C.border}` : "none",
            cursor: "pointer",
            userSelect: "none"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IconSearch size={14} color={C.green} />
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: C.white,
              fontFamily: FONT,
              letterSpacing: 0.3
            }}>
              {t("history.exam") || "Данные объективного осмотра"}
            </span>
          </div>
          <span style={{
            fontSize: 11,
            color: C.textDim,
            fontWeight: 600,
            fontFamily: FONT,
            transition: "transform 0.2s",
            transform: examOpen ? "rotate(180deg)" : "rotate(0deg)"
          }}>
            ▼
          </span>
        </div>

        {examOpen && (
          <div style={{
            padding: "12px 14px",
            fontSize: 12.5,
            lineHeight: 1.65,
            color: C.text,
            fontFamily: FONT,
            background: C.panelBg
          }}>
            <p style={{ margin: 0 }}>{examText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
