import React from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { IconBot } from "../../../ui/icons";

/**
 * DialogueHeader — Шапка панели диалога с пациентом.
 */
export default function DialogueHeader({ mode = "hybrid", isUnconscious = false }) {
  const C = useTheme();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <IconBot size={16} color={isUnconscious ? "#ff4d4f" : C.accent} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: isUnconscious ? "#ff4d4f" : C.accent,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Диалог с пациентом
        </span>
      </div>

      <span
        style={{
          fontSize: 10,
          color: isUnconscious ? "#ff4d4f" : C.textDim,
          padding: "2px 6px",
          borderRadius: 4,
          background: isUnconscious ? "rgba(255, 77, 79, 0.15)" : C.dimBg,
          fontWeight: isUnconscious ? 600 : 400,
        }}
      >
        {isUnconscious
          ? "🔴 Без сознания"
          : mode === "hybrid"
          ? "⚡ Гибридный (LLM)"
          : "📋 Стандартный"}
      </span>
    </div>
  );
}
