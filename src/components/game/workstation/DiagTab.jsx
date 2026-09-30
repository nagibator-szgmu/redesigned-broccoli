import React, { useState, useMemo } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, getCategoryColor } from "../../../ui/theme";
import { DIAGNOSTICS } from "../../../data/diagnostics";
import { Btn } from "../../../ui/components";
import {
  IconSearch,
  IconX,
  IconMicroscope,
  IconCardiac,
  IconRespiratory,
  IconXRay,
  IconBrain,
} from "../../../ui/icons";
import DiagAccordionGroup from "./DiagAccordionGroup";

const DIAG_CATEGORIES = [
  { key: "lab", title: "Лабораторные исследования", Icon: IconMicroscope },
  { key: "cardiac", title: "Кардиология", Icon: IconCardiac },
  { key: "respiratory", title: "Дыхание и газы", Icon: IconRespiratory },
  { key: "imaging", title: "Лучевая диагностика и эндоскопия", Icon: IconXRay },
  { key: "neuro", title: "Неврология", Icon: IconBrain },
];

/** Diagnostics selection tab with collapsible category accordions */
export default function DiagTab({
  selDiag = [],
  setSelDiag,
  orderedDiag = [],
  handleOrderTests,
  processingTests,
  t,
}) {
  const C = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [openCats, setOpenCats] = useState(() => new Set());

  const q = searchQuery.trim().toLowerCase();

  const groupedDiagnostics = useMemo(() => {
    const map = {};
    DIAG_CATEGORIES.forEach((cat) => {
      map[cat.key] = DIAGNOSTICS.filter((item) => {
        const matchesCat = item.cat === cat.key;
        const matchesQuery = !q || item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
        return matchesCat && matchesQuery;
      });
    });
    return map;
  }, [q]);

  const toggleDiag = (id) => {
    setSelDiag((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleCat = (key) => {
    setOpenCats((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "8px 12px", boxSizing: "border-box" }}>
      {/* Search Bar matching screenshot */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: C.headerBg2,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: "6px 12px",
          marginBottom: 8,
          backdropFilter: "blur(8px)",
          flexShrink: 0,
        }}
      >
        <IconSearch size={14} color={C.textDim} />
        <input
          className="seamless-input"
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.trim()) {
              setOpenCats(new Set(DIAG_CATEGORIES.map((c) => c.key)));
            } else {
              setOpenCats(new Set());
            }
          }}
          placeholder={t("search.placeholderDiag") || "Поиск исследований..."}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: C.text,
            fontFamily: FONT,
            fontSize: 13,
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
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconX size={12} />
          </button>
        )}
      </div>

      {/* Accordion Categories List */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto", paddingRight: 2, display: "flex", flexDirection: "column" }}>
        {DIAG_CATEGORIES.map((cat) => {
          const items = groupedDiagnostics[cat.key] || [];
          if (q && items.length === 0) return null;
          const catColor = getCategoryColor(cat.key, C);
          const IconComp = cat.Icon;
          return (
            <DiagAccordionGroup
              key={cat.key}
              title={cat.title}
              icon={<IconComp size={15} color={catColor} />}
              color={catColor}
              items={items}
              selDiag={selDiag}
              orderedDiag={orderedDiag}
              onToggle={toggleDiag}
              isOpen={openCats.has(cat.key) || !!q}
              onToggleOpen={() => toggleCat(cat.key)}
              disabled={processingTests}
            />
          );
        })}
      </div>

      {/* Footer Actions */}
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: C.textDim, fontFamily: FONT, fontWeight: 500 }}>
          {t("orderTests.selected", { n: selDiag.length })}
        </span>
        <Btn
          onClick={handleOrderTests}
          disabled={selDiag.length === 0 || processingTests}
          color={C.accent}
          style={{ minHeight: 41, padding: "8px 22px", fontSize: 14, fontWeight: 600 }}
        >
          {t("orderTests.send")}
        </Btn>
      </div>
    </div>
  );
}
