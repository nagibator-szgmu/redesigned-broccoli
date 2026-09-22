import React from "react";
import { FONT, RADIUS } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";

/**
 * UnconsciousPatientBanner — Предупреждающая плашка при коме / сопоре (ШКГ <= 8).
 */
export default function UnconsciousPatientBanner({ gcs = 15 }) {
  const C = useTheme();

  return (
    <div
      data-testid="unconscious-banner"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(255, 77, 79, 0.12)",
        border: "1px solid rgba(255, 77, 79, 0.4)",
        borderRadius: RADIUS.sm,
        padding: "6px 10px",
        marginBottom: 8,
        fontFamily: FONT,
      }}
    >
      <span style={{ fontSize: 16 }}>⚠️</span>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#ff4d4f" }}>
          Пациент без сознания (ШКГ: {gcs} б.)
        </span>
        <span style={{ fontSize: 10, color: C.textDim }}>
          Продуктивный речевой контакт невозможен. Опрос со слов больного заблокирован.
        </span>
      </div>
    </div>
  );
}
