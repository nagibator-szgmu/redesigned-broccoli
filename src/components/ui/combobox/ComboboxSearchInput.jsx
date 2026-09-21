import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { IconSearch } from "../../../ui/icons";

export default function ComboboxSearchInput({
  inputRef,
  searchQuery,
  setSearchQuery,
  onClose,
  onEnter,
}) {
  const C = useTheme();

  return (
    <div
      style={{
        padding: "10px 12px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: C.headerBg2,
      }}
    >
      <IconSearch size={14} color={C.accent} />
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Поиск по названию или коду..."
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          color: C.white,
          fontSize: 13,
          fontFamily: FONT,
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose();
          } else if (e.key === "Enter" && onEnter) {
            onEnter();
          }
        }}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          style={{
            background: "transparent",
            border: "none",
            color: C.textDim,
            cursor: "pointer",
            fontSize: 12,
            padding: "2px 6px",
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
