import React, { useState, useRef, useEffect, useMemo } from "react";
import { useTheme } from "../../ui/ThemeContext";
import { FONT, CODE } from "../../ui/theme";
import { IconSearch } from "../../ui/icons";

/**
 * Modern responsive SearchableCombobox / Autocomplete dropdown for medications and diagnostic investigations.
 * Supports:
 * - Search query filter with quick clear
 * - Category tabs filtering
 * - Multi-select and single-select
 * - Mobile/desktop responsive viewport boundary constraints
 * - Keyboard support (Escape to close)
 */
export default function SearchableCombobox({
  items = [],
  selectedIds = [],
  onToggle,
  placeholder = "Начните вводить для поиска...",
  title = "Выберите из списка",
  categories = [],
  catColors = {},
  disabled = false,
  isMobile = false,
  badgeColor,
  renderItemExtra,
}) {
  const C = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const matchCat =
        !activeCat ||
        activeCat === "all" ||
        item.cat === activeCat ||
        item.group === activeCat;
      const matchQuery =
        !q ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.id && item.id.toLowerCase().includes(q)) ||
        (item.desc && item.desc.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [items, searchQuery, activeCat]);

  const selectedItems = useMemo(() => {
    const set = new Set(selectedIds);
    return items.filter((i) => set.has(i.id));
  }, [items, selectedIds]);

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        fontFamily: FONT,
        marginBottom: 8,
      }}
    >
      {/* Trigger Button / Input Display */}
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
            <span style={{ fontSize: isMobile ? 12.5 : 13.5, color: C.textDim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
          <span style={{ fontSize: 10, color: C.textDim, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
            ▼
          </span>
        </div>
      </div>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 1000,
            background: C.panelBg2 || C.panel,
            border: `1px solid ${C.borderBright || C.border}`,
            borderRadius: 14,
            boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: isMobile ? 320 : 380,
            animation: "fadeIn 0.15s ease",
          }}
        >
          {/* Search Header inside Dropdown */}
          <div style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8, background: C.headerBg2 }}>
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
                  setIsOpen(false);
                } else if (e.key === "Enter" && filteredItems.length > 0) {
                  onToggle(filteredItems[0].id);
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

          {/* Category Pills (if provided) */}
          {categories && categories.length > 0 && (
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
          )}

          {/* Scrollable Items List */}
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
            {filteredItems.length === 0 ? (
              <div style={{ padding: "20px 12px", textAlign: "center", color: C.textDim, fontSize: 12 }}>
                Ничего не найдено по запросу «{searchQuery}»
              </div>
            ) : (
              filteredItems.map((item) => {
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
                    {/* Checkbox Icon */}
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

                    {/* Item Name & Details */}
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
                        <div style={{ fontSize: 10.5, color: C.textDim, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.desc}
                        </div>
                      )}
                    </div>

                    {renderItemExtra && renderItemExtra(item, isSelected)}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
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
              Выбрано: <strong style={{ color: C.white }}>{selectedIds.length}</strong>
            </span>
            <button
              onClick={() => setIsOpen(false)}
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
        </div>
      )}
    </div>
  );
}
