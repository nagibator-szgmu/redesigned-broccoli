import React, { useState, useMemo } from "react";
import { FONT, getCategoryColor } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";
import { DIAGNOSTICS } from "../../../data/diagnostics";
import { IconCheck, IconSearch, IconX } from "../../../ui/icons";

/** Test ordering panel with full diagnostics catalog (FR-С.3) */
export function TestSelection({ selDiag, setSelDiag, handleOrderTests }) {
  const C = useTheme();
  const { t } = useTranslate();
  const [search, setSearch] = useState("");

  const toggleDiag = (id) => {
    setSelDiag(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filteredDiag = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return DIAGNOSTICS;
    return DIAGNOSTICS.filter(item =>
      item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: FONT }}>
          {t("outpatient.orderTests") || "Назначение исследований"}
        </div>
        <span style={{ fontSize: 11, color: C.textDim, fontFamily: FONT }}>
          Выбрано: {selDiag.length}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.headerBg2 || `${C.border}30`, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 8px", marginBottom: 8 }}>
        <IconSearch size={13} color={C.textDim} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search.placeholderDiag") || "Поиск исследований (ЭКГ, кровь, целиакия...)"}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontFamily: FONT, fontSize: 12 }}
        />
        {search && (
          <button type="button" onClick={() => setSearch("")} style={{ background: "transparent", border: "none", color: C.textDim, cursor: "pointer", padding: 0 }}>
            <IconX size={12} />
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 240, overflowY: "auto", marginTop: 4 }}>
        {filteredDiag.map(item => {
          const selected = selDiag.includes(item.id);
          const color = getCategoryColor(item.cat, C);
          return (
            <div
              key={item.id}
              onClick={() => toggleDiag(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 10px",
                borderRadius: 8,
                cursor: "pointer",
                background: selected ? `${color}15` : "transparent",
                border: `1px solid ${selected ? color : C.border}`,
                transition: "all 0.1s ease",
              }}
            >
              <div
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: 4,
                  border: `2px solid ${selected ? color : C.textDim}`,
                  background: selected ? color : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {selected && <IconCheck size={11} color={C.bg} strokeWidth={3} />}
              </div>
              <span style={{ fontSize: 12.5, color: selected ? C.white : C.text, fontFamily: FONT, flex: 1 }}>
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      {selDiag.length > 0 && (
        <button
          onClick={handleOrderTests}
          style={{
            width: "100%",
            marginTop: 12,
            padding: "11px",
            borderRadius: 10,
            background: `linear-gradient(135deg,${C.accent},${C.green})`,
            border: "none",
            fontSize: 13.5,
            fontWeight: 700,
            color: C.bg,
            cursor: "pointer",
            fontFamily: FONT,
            boxShadow: `0 4px 14px ${C.accent}30`,
          }}
        >
          {t("outpatient.send", { n: selDiag.length })}
        </button>
      )}
    </div>
  );
}
