import React, { useState } from "react";
import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";
import { IconClipboard, IconSearch, IconChevronDown } from "../../../ui/icons";

/**
 * Anamnesis + examination accordion panel for Outpatient.
 * Formatted cleanly like the ICU / Workstation style: vector icons, cards, animated chevron.
 */
export function HistoryPanel({ cd, onReveal }) {
  const C = useTheme();
  const { t } = useTranslate();
  const [showIllness, setShowIllness] = useState(false);
  const [showLife, setShowLife] = useState(false);
  const [showExam, setShowExam] = useState(false);

  if (!cd) return null;

  const handleToggle = (type) => {
    if (type === "illness") {
      setShowIllness(prev => {
        const next = !prev;
        if (next && onReveal) onReveal("historyOfIllness");
        return next;
      });
    } else if (type === "life") {
      setShowLife(prev => {
        const next = !prev;
        if (next && onReveal) onReveal("lifeHistory");
        return next;
      });
    } else if (type === "exam") {
      setShowExam(prev => {
        const next = !prev;
        if (next && onReveal) onReveal("exam");
        return next;
      });
    }
  };

  const renderSection = ({ key, isOpen, onToggle, icon, title, text, color }) => (
    <div
      key={key}
      style={{
        background: C.panelBg,
        border: `1px solid ${isOpen ? color + "60" : C.border}`,
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
    >
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: isOpen ? `${color}0d` : C.panelBg,
          borderBottom: isOpen ? `1px solid ${C.border}` : "none",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {icon}
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: C.white,
              fontFamily: FONT,
              letterSpacing: 0.3,
            }}
          >
            {title}
          </span>
        </div>
        <div
          style={{
            color: isOpen ? color : C.textDim,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconChevronDown size={14} color="currentColor" />
        </div>
      </div>
      {isOpen && (
        <div
          style={{
            padding: "12px 14px",
            fontSize: 13,
            lineHeight: 1.65,
            color: C.text,
            fontFamily: FONT,
            background: C.panelBg,
          }}
        >
          <p style={{ margin: 0 }}>{text}</p>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
      {cd.historyOfIllness && renderSection({
        key: "illness",
        isOpen: showIllness,
        onToggle: () => handleToggle("illness"),
        icon: <IconClipboard size={14} color={C.accent} />,
        title: t("history.illness"),
        text: cd.historyOfIllness,
        color: C.accent,
      })}
      {cd.lifeHistory && renderSection({
        key: "life",
        isOpen: showLife,
        onToggle: () => handleToggle("life"),
        icon: <IconClipboard size={14} color={C.green} />,
        title: t("history.life"),
        text: cd.lifeHistory,
        color: C.green,
      })}
      {cd.exam && renderSection({
        key: "exam",
        isOpen: showExam,
        onToggle: () => handleToggle("exam"),
        icon: <IconSearch size={14} color={C.green} />,
        title: t("history.exam") || "Данные объективного осмотра",
        text: cd.exam,
        color: C.green,
      })}
    </div>
  );
}
