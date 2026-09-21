import React, { useState, useRef, useEffect, useMemo } from "react";
import { useTheme } from "../../ui/ThemeContext";
import { FONT } from "../../ui/theme";
import ComboboxTrigger from "./combobox/ComboboxTrigger";
import ComboboxSearchInput from "./combobox/ComboboxSearchInput";
import ComboboxCategoryFilter from "./combobox/ComboboxCategoryFilter";
import ComboboxItemList from "./combobox/ComboboxItemList";
import ComboboxFooter from "./combobox/ComboboxFooter";

/**
 * Modern responsive SearchableCombobox / Autocomplete dropdown for medications and diagnostic investigations.
 */
export default function SearchableCombobox({
  items = [],
  selectedIds = [],
  onToggle,
  placeholder = "Начните вводить для поиска...",
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

  const handleEnter = () => {
    if (filteredItems.length > 0) {
      onToggle(filteredItems[0].id);
    }
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
      <ComboboxTrigger
        isOpen={isOpen}
        toggleDropdown={toggleDropdown}
        disabled={disabled}
        selectedIds={selectedIds}
        selectedItems={selectedItems}
        placeholder={placeholder}
        badgeColor={badgeColor}
        isMobile={isMobile}
      />

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
          <ComboboxSearchInput
            inputRef={inputRef}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClose={() => setIsOpen(false)}
            onEnter={handleEnter}
          />

          <ComboboxCategoryFilter
            categories={categories}
            activeCat={activeCat}
            setActiveCat={setActiveCat}
          />

          <ComboboxItemList
            filteredItems={filteredItems}
            searchQuery={searchQuery}
            selectedIds={selectedIds}
            onToggle={onToggle}
            catColors={catColors}
            badgeColor={badgeColor}
            isMobile={isMobile}
            renderItemExtra={renderItemExtra}
          />

          <ComboboxFooter
            selectedCount={selectedIds.length}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
