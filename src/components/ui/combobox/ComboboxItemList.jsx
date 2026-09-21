import { useTheme } from "../../../ui/ThemeContext";

export default function ComboboxItemList({
  filteredItems,
  searchQuery,
  selectedIds,
  onToggle,
  catColors = {},
  badgeColor,
  isMobile,
  renderItemExtra,
}) {
  const C = useTheme();

  if (filteredItems.length === 0) {
    return (
      <div style={{ flex: 1, padding: "20px 12px", textAlign: "center", color: C.textDim, fontSize: 12 }}>
        Ничего не найдено по запросу «{searchQuery}»
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "6px 8px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {filteredItems.map((item) => {
        const isSelected = selectedIds.includes(item.id);
        const itemColor = catColors[item.cat] || badgeColor || C.accent;
        return (
          <div
            key={item.id}
            onClick={() => onToggle(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: isMobile ? "9px 10px" : "8px 12px",
              borderRadius: 8,
              cursor: "pointer",
              background: isSelected ? `${itemColor}15` : "transparent",
              border: `1px solid ${isSelected ? `${itemColor}44` : "transparent"}`,
              transition: "background 0.1s ease",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) e.currentTarget.style.background = C.dimBg;
            }}
            onMouseLeave={(e) => {
              if (!isSelected) e.currentTarget.style.background = "transparent";
            }}
          >
            {/* Checkbox */}
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                border: `1.5px solid ${isSelected ? itemColor : C.borderBright || C.border}`,
                background: isSelected ? itemColor : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {isSelected && (
                <span style={{ color: C.bg, fontSize: 10, fontWeight: 900 }}>✓</span>
              )}
            </div>

            {/* Item details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: isMobile ? 12.5 : 13,
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? C.white : C.text,
                  lineHeight: 1.3,
                }}
              >
                {item.name}
              </div>
              {item.desc && (
                <div
                  style={{
                    fontSize: 10.5,
                    color: C.textDim,
                    marginTop: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.desc}
                </div>
              )}
            </div>

            {renderItemExtra && renderItemExtra(item, isSelected)}
          </div>
        );
      })}
    </div>
  );
}
