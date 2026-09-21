import { useTheme } from "../../../ui/ThemeContext";
import { IconSearch } from "../../../ui/icons";

export default function ComboboxTrigger({
  isOpen,
  toggleDropdown,
  disabled,
  selectedIds,
  selectedItems,
  placeholder,
  badgeColor,
  isMobile,
}) {
  const C = useTheme();

  return (
    <div
      onClick={toggleDropdown}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        background: C.inputBg || C.headerBg2,
        border: `1px solid ${isOpen ? C.accent : selectedIds.length > 0 ? `${C.accent}66` : C.border}`,
        borderRadius: 12,
        padding: isMobile ? "9px 12px" : "10px 14px",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.15s ease",
        boxShadow: isOpen ? `0 0 0 2px ${C.accent}25` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
        <IconSearch size={15} color={isOpen ? C.accent : C.textDim} />
        {selectedIds.length === 0 ? (
          <span
            style={{
              fontSize: isMobile ? 12.5 : 13.5,
              color: C.textDim,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {placeholder}
          </span>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 6, overflow: "hidden", flexWrap: "nowrap" }}>
            <span
              style={{
                background: badgeColor || C.accent,
                color: C.bg,
                fontSize: 11,
                fontWeight: 800,
                borderRadius: 6,
                padding: "2px 7px",
                flexShrink: 0,
              }}
            >
              {selectedIds.length}
            </span>
            <span
              style={{
                fontSize: isMobile ? 12.5 : 13.5,
                fontWeight: 600,
                color: C.white,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {selectedItems.map((s) => s.name).join(", ")}
            </span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            fontSize: 10,
            color: C.textDim,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          ▼
        </span>
      </div>
    </div>
  );
}
