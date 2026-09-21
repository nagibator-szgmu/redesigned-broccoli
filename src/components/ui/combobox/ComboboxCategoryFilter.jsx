import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";

export default function ComboboxCategoryFilter({ categories, activeCat, setActiveCat }) {
  const C = useTheme();

  if (!categories || categories.length === 0) return null;

  return (
    <div
      className="no-scrollbar"
      style={{
        display: "flex",
        gap: 4,
        padding: "8px 10px",
        overflowX: "auto",
        borderBottom: `1px solid ${C.border}33`,
        background: `${C.dimBg}`,
      }}
    >
      {categories.map((cat) => {
        const isActive = activeCat === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: isActive ? 700 : 500,
              fontFamily: FONT,
              cursor: "pointer",
              background: isActive ? `${C.accent}25` : "transparent",
              border: `1px solid ${isActive ? C.accent : "transparent"}`,
              color: isActive ? C.accent : C.textDim,
              whiteSpace: "nowrap",
              transition: "all 0.1s",
            }}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
