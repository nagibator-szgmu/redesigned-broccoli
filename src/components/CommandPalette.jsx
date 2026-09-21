import React, { useState, useEffect, useRef, useContext } from "react";
import { ThemeCtx } from "../ui/ThemeContext";
import {
  usePaletteItems,
  PaletteHeader,
  PaletteItemList,
  PaletteFooter,
} from "./palette";

/**
 * Global Keyboard-First Command Palette (⌘K / Ctrl+K).
 * Dispatches clinical actions and navigation without duplicating engine logic.
 */
export default function CommandPalette({
  isOpen,
  onClose,
  phase,
  setPhase,
  selTreat = [],
  toggleTreatment,
  orderedDiag = [],
  handleOrderTests,
  onSelectABCDE,
}) {
  const C = useContext(ThemeCtx);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef(null);

  const items = usePaletteItems({
    phase,
    query,
    setPhase,
    onClose,
    onSelectABCDE,
    handleOrderTests,
    orderedDiag,
    toggleTreatment,
    selTreat,
  });

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation inside palette
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, items.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + items.length) % Math.max(1, items.length));
      } else if (e.key === "Enter" && items[selectedIndex]) {
        e.preventDefault();
        items[selectedIndex].action();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, items, selectedIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.children[selectedIndex];
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "80px 16px 24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 620,
          background: C.panel,
          border: `1px solid ${C.borderBright}`,
          borderRadius: 16,
          boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(37,99,235,0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "fadeUp 0.18s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <PaletteHeader query={query} setQuery={setQuery} C={C} />
        <PaletteItemList
          listRef={listRef}
          items={items}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          query={query}
          C={C}
        />
        <PaletteFooter C={C} />
      </div>
    </div>
  );
}

