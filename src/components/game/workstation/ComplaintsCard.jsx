import React, { useState } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import { IconChevronDown, IconChevronUp, IconUser } from "../../../ui/icons";

/** Карточка жалоб и статуса пациента с поддержкой компактного мобильного режима */
export default function ComplaintsCard({ complaint, compact = false }) {
  const C = useTheme();
  const [expanded, setExpanded] = useState(false);

  const isLong = complaint && complaint.length > 70;

  return (
    <div
      style={{
        background: C.panelBg,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: compact ? "6px 10px" : "14px",
        display: "flex",
        flexDirection: "column",
        gap: compact ? 3 : 6,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontFamily: FONT,
            fontSize: compact ? 12 : 15,
            fontWeight: 600,
            color: C.text,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <IconUser size={compact ? 12 : 15} color={C.accent} />
          Ведущая жалоба
        </span>

        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            style={{
              background: "transparent",
              border: "none",
              color: C.accent,
              fontSize: 11,
              fontFamily: FONT,
              fontWeight: 500,
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {expanded ? <IconChevronUp size={11} /> : <IconChevronDown size={11} />}
            <span>{expanded ? "Свернуть" : "Подробнее"}</span>
          </button>
        )}
      </div>

      <div
        style={{
          fontSize: compact ? 12.5 : 15,
          color: "#F1F5F9",
          fontFamily: FONT,
          lineHeight: compact ? 1.3 : 1.45,
          fontWeight: 400,
          display: expanded ? "block" : "-webkit-box",
          WebkitLineClamp: expanded ? "none" : compact ? 2 : 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {complaint || "Жалоб активно не предъявляет."}
      </div>
    </div>
  );
}
