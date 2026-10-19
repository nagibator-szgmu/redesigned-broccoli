import React from "react";
import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { IconAlertTriangle } from "../../../ui/icons";

/**
 * InvasiveConfirmModal
 * Нейтральное предупреждение при попытке назначить метод с лучевой нагрузкой
 * или инвазивное инструментальное вмешательство.
 */
export default function InvasiveConfirmModal({ isOpen, testName, onConfirm, onCancel }) {
  const C = useTheme();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: "rgba(0, 0, 0, 0.82)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <div
        style={{
          background: C.panel || "#131b2e",
          border: `1px solid ${C.border || "#2d3748"}`,
          borderRadius: 14,
          padding: "20px 22px",
          maxWidth: 440,
          width: "100%",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(234, 179, 8, 0.15)",
              border: "1px solid rgba(234, 179, 8, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <IconAlertTriangle size={18} color="#EAB308" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: FONT }}>
              Подтверждение назначения
            </div>
            <div style={{ fontSize: 12, color: C.subText, fontFamily: FONT }}>
              Инвазивный / радиационный метод
            </div>
          </div>
        </div>

        <div style={{ fontSize: 13, color: C.text, lineHeight: 1.55, fontFamily: FONT }}>
          Вы назначаете метод с лучевой нагрузкой или инвазивное вмешательство (
          <strong style={{ color: C.accent }}>{testName}</strong>). Подтвердите наличие клинических показаний в соответствии с клиническими рекомендациями.
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: "transparent",
              color: C.text,
              fontSize: 12.5,
              fontWeight: 600,
              fontFamily: FONT,
              cursor: "pointer",
            }}
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              background: "linear-gradient(135deg, #EAB308, #CA8A04)",
              color: "#ffffff",
              fontSize: 12.5,
              fontWeight: 700,
              fontFamily: FONT,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(202, 138, 4, 0.3)",
            }}
          >
            Подтвердить назначение
          </button>
        </div>
      </div>
    </div>
  );
}
