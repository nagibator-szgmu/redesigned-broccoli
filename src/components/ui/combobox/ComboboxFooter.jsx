import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";

export default function ComboboxFooter({ selectedCount, onClose }) {
  const C = useTheme();

  return (
    <div
      style={{
        padding: "8px 12px",
        borderTop: `1px solid ${C.border}`,
        background: C.headerBg2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span style={{ fontSize: 11, color: C.textDim, fontFamily: FONT }}>
        Выбрано: <strong style={{ color: C.white }}>{selectedCount}</strong>
      </span>
      <button
        onClick={onClose}
        style={{
          background: C.accent,
          border: "none",
          borderRadius: 7,
          padding: "5px 14px",
          fontSize: 12,
          fontWeight: 700,
          color: C.bg,
          cursor: "pointer",
          fontFamily: FONT,
        }}
      >
        Готово
      </button>
    </div>
  );
}
