import { RADIUS } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { IconBook, IconX } from "../../ui/icons";

export default function QuizHeader({ onClose, isMobile }) {
  const C = useTheme();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "12px 16px" : "14px 20px",
        borderBottom: `1px solid ${C.border}`,
        flexShrink: 0,
        paddingTop: "max(12px, env(safe-area-inset-top, 12px))",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <IconBook size={16} color={C.accent} />
        <span style={{ fontSize: 14, fontWeight: 700, color: C.white }}>
          Тест по теме
        </span>
      </div>
      <button
        onClick={onClose}
        aria-label="Закрыть тест"
        style={{
          width: 32,
          height: 32,
          borderRadius: RADIUS.xs,
          background: C.dimBg,
          border: "none",
          color: C.textDim,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        <IconX size={14} color={C.textDim} />
      </button>
    </div>
  );
}
