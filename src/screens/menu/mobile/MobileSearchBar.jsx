import { RADIUS, FONT } from "../../../ui/theme";
import { IconSearch, IconX } from "../../../ui/icons";

export default function MobileSearchBar({
  searchQuery,
  setSearchQuery,
  searchFocused,
  setSearchFocused,
  t,
  C,
}) {
  return (
    <div style={{ padding: "14px 16px 6px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: C.panel,
          border: `1px solid ${searchFocused ? C.accent : C.border}`,
          boxShadow: searchFocused ? `0 0 16px -2px ${C.accent}20` : "none",
          borderRadius: RADIUS.md,
          minHeight: 46,
          padding: "0 14px",
          transition: "all 0.2s ease",
        }}
      >
        <IconSearch size={16} color={searchFocused ? C.accent : C.textDim} />
        <input
          className="seamless-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder={t("search.placeholder")}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: C.white,
            fontSize: 16,
            fontFamily: FONT,
            flex: 1,
            caretColor: C.accent,
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            aria-label="Очистить поиск"
            style={{
              width: 28,
              height: 28,
              borderRadius: RADIUS.full,
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
            <IconX size={12} color={C.textDim} />
          </button>
        )}
      </div>
    </div>
  );
}
