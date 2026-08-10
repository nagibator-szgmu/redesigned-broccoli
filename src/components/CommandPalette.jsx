import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { ThemeCtx } from "../ui/ThemeContext";
import { FONT } from "../ui/theme";
import { TREATMENTS } from "../data/treatments";
import { DIAGNOSTICS } from "../data/diagnostics";

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

  // Build searchable items based on current context
  const items = useMemo(() => {
    const isSim = phase === "order_tests" || phase === "awaiting_results" || phase === "diagnose";
    const q = query.trim().toLowerCase();
    const result = [];

    // 1. Navigation items
    const navItems = [
      { id: "nav_menu", cat: "Навигация", title: "Главное меню", sub: "Перейти к выбору кейсов", action: () => { setPhase("menu"); onClose(); } },
      { id: "nav_theory", cat: "Навигация", title: "Клинические протоколы и теория", sub: "35 конспектов по КР Минздрава", action: () => { setPhase("theory"); onClose(); } },
      { id: "nav_leaderboard", cat: "Навигация", title: "Достижения и статистика", sub: "Портфолио и баллы", action: () => { setPhase("leaderboard"); onClose(); } },
      { id: "nav_map", cat: "Навигация", title: "Карта курса и специализаций", sub: "Дерево клинических тем", action: () => { setPhase("map"); onClose(); } },
    ];
    navItems.forEach(n => {
      if (!q || n.title.toLowerCase().includes(q) || n.sub.toLowerCase().includes(q)) result.push(n);
    });

    // 2. ABCDE Assessment (in simulation)
    if (isSim && onSelectABCDE) {
      const abcde = [
        { id: "abcde_a", cat: "Осмотр ABCDE", title: "A — Airway (Дыхательные пути)", sub: "Проходимость ВДП, стридор", action: () => { onSelectABCDE("A"); onClose(); } },
        { id: "abcde_b", cat: "Осмотр ABCDE", title: "B — Breathing (Дыхание)", sub: "Аускультация, ЧДД, SpO2", action: () => { onSelectABCDE("B"); onClose(); } },
        { id: "abcde_c", cat: "Осмотр ABCDE", title: "C — Circulation (Кровообращение)", sub: "Пульс, АД, капиллярный ответ", action: () => { onSelectABCDE("C"); onClose(); } },
        { id: "abcde_d", cat: "Осмотр ABCDE", title: "D — Disability (Неврология)", sub: "Шкала Глазго, зрачки, глюкоза", action: () => { onSelectABCDE("D"); onClose(); } },
        { id: "abcde_e", cat: "Осмотр ABCDE", title: "E — Exposure (Осмотр тела)", sub: "Температура, сыпь, живот, травмы", action: () => { onSelectABCDE("E"); onClose(); } },
      ];
      abcde.forEach(a => {
        if (!q || a.title.toLowerCase().includes(q) || a.sub.toLowerCase().includes(q)) result.push(a);
      });
    }

    // 3. Diagnostics items (in simulation)
    if (isSim && handleOrderTests) {
      DIAGNOSTICS.forEach(d => {
        const title = d.name;
        const sub = d.desc || d.category || "Диагностический тест";
        const isOrdered = orderedDiag.includes(d.id);
        if (!q || title.toLowerCase().includes(q) || sub.toLowerCase().includes(q)) {
          result.push({
            id: `diag_${d.id}`,
            cat: "Диагностические исследования",
            title: `${title}${isOrdered ? " (✓ Выполнен)" : ""}`,
            sub: `${d.category || "Тест"} · ${sub}`,
            action: () => {
              if (!isOrdered) handleOrderTests([d.id]);
              onClose();
            },
          });
        }
      });
    }

    // 4. Treatments items (in simulation)
    if (isSim && toggleTreatment) {
      TREATMENTS.forEach(t => {
        const title = t.name;
        const sub = t.category || "Фармакотерапия";
        const isApplied = selTreat.includes(t.id);
        if (!q || title.toLowerCase().includes(q) || sub.toLowerCase().includes(q)) {
          result.push({
            id: `treat_${t.id}`,
            cat: "Фармакотерапия и вмешательства",
            title: `${title}${isApplied ? " (✓ Назначен)" : ""}`,
            sub: `${t.category || "Препарат"} · Дозировка по протоколу`,
            action: () => {
              toggleTreatment(t.id);
              onClose();
            },
          });
        }
      });
    }

    return result;
  }, [phase, query, setPhase, onClose, onSelectABCDE, handleOrderTests, orderedDiag, toggleTreatment, selTreat]);

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
        setSelectedIndex(prev => (prev + 1) % Math.max(1, items.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + items.length) % Math.max(1, items.length));
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
        {/* Search header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: C.accentDim, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, fontSize: 13, fontWeight: 800 }}>
            ⌘
          </div>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Быстрый поиск препарата, анализа, ABCDE или действия... (⌘K)"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 15,
              color: C.white,
              fontFamily: FONT,
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{ background: "transparent", border: "none", color: C.textDim, cursor: "pointer", fontSize: 12 }}
            >
              ✕
            </button>
          )}
          <span style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, padding: "2px 6px", borderRadius: 4, background: C.btnBg }}>
            ESC
          </span>
        </div>

        {/* Results list */}
        <div
          ref={listRef}
          style={{
            maxHeight: 380,
            overflowY: "auto",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {items.length === 0 ? (
            <div style={{ padding: "32px 16px", textAlign: "center", color: C.textDim, fontSize: 13, fontFamily: FONT }}>
              По запросу «{query}» ничего не найдено.
            </div>
          ) : (
            items.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: 10,
                    cursor: "pointer",
                    background: isSelected ? C.accentDim : "transparent",
                    border: `1px solid ${isSelected ? `${C.accent}40` : "transparent"}`,
                    transition: "background 0.1s ease",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: isSelected ? 600 : 500, color: isSelected ? C.accent : C.white, fontFamily: FONT }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.sub}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, color: isSelected ? C.accent : C.textDim, fontFamily: FONT, background: C.btnBg, padding: "3px 8px", borderRadius: 6, flexShrink: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {item.cat}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderTop: `1px solid ${C.border}`, background: C.panelBg, fontSize: 11, color: C.textDim, fontFamily: FONT }}>
          <span>↑↓ навигация</span>
          <span>↵ применить</span>
          <span>ESC закрыть</span>
        </div>
      </div>
    </div>
  );
}
