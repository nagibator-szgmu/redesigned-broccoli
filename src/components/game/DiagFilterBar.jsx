import { useTheme } from "../../ui/ThemeContext";
import { FONT } from "../../ui/theme";
import { DIAGNOSTICS } from "../../data/diagnostics";

export default function DiagFilterBar({
  diagCat = "all",
  setDiagCat,
  searchQuery = "",
  setSearchQuery,
  matchCount,
  totalCount,
  t
}) {
  const C = useTheme();

  const DIAG_CATS = [
    { id: "all", label: t ? t("diagCat.all") : "Все" },
    { id: "lab", label: t ? t("diagCat.lab") : "Лаборатория" },
    { id: "cardiac", label: t ? t("diagCat.cardiac") : "Кардио" },
    { id: "imaging", label: t ? t("diagCat.imaging") : "Визуализация" },
    { id: "respiratory", label: t ? t("diagCat.respiratory") : "Дыхание" },
    { id: "neuro", label: t ? t("diagCat.neuro") : "Нейро" }
  ];

  const total = totalCount ?? DIAGNOSTICS.length;
  const matches = matchCount ?? (
    diagCat === "all" ? total : DIAGNOSTICS.filter(d => d.cat === diagCat).length
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
      {/* Search Input Bar with Clear Button & Match Counter */}
      {setSearchQuery && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: C.inputBg || "rgba(7,13,24,0.6)",
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: "6px 12px",
          backdropFilter: "blur(8px)"
        }}>
          <span style={{ fontSize: 14, color: C.textDim }}>🔍</span>
          <input
            className="seamless-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t ? t("search.placeholderDiag") || "Поиск тестов..." : "Поиск тестов..."}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: C.text,
              fontFamily: FONT,
              fontSize: 13
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
                padding: "2px 4px",
                fontSize: 13,
                lineHeight: 1
              }}
              title="Clear search"
            >
              ✕
            </button>
          )}
          <span style={{
            fontSize: 11,
            color: C.accent,
            fontFamily: FONT,
            background: `${C.accent}15`,
            border: `1px solid ${C.accent}33`,
            borderRadius: 6,
            padding: "2px 6px",
            whiteSpace: "nowrap"
          }}>
            {matches} / {total}
          </span>
        </div>
      )}

      {/* Quick Category Badges */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
        {DIAG_CATS.map(cat => {
          const active = diagCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setDiagCat && setDiagCat(cat.id)}
              className="filter-pill"
              style={{
                background: active ? `${C.accent}1a` : C.btnBg || "transparent",
                border: `1px solid ${active ? C.accent : C.border}`,
                borderRadius: 10,
                padding: "4px 11px",
                cursor: "pointer",
                fontFamily: FONT,
                fontSize: 12,
                color: active ? C.accent : C.textDim,
                fontWeight: active ? 700 : 500,
                transition: "all 0.15s ease"
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
