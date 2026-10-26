import React, { useState, useMemo } from "react";
import { FONT, CODE, getCategoryColor } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";
import { DIAGNOSTICS } from "../../../data/diagnostics";
import { DAY_COLORS } from "./constants";
import { IconCheck, IconSearch, IconX } from "../../../ui/icons";
import { LabInlineSelector } from "../../../components/game/lab";
import { BIOCHEMICAL_TEST_IDS, BMP_PARAMETERS, DEFAULT_BMP_PARAMS } from "../../../engine/labAnalysisEngine";

const DIAG_TABS = [
  { id: "all", label: "Все" },
  { id: "lab", label: "Лаборатория" },
  { id: "cardiac", label: "Кардио" },
  { id: "respiratory", label: "Дыхание" },
  { id: "imaging", label: "Лучевая/Инстр" },
  { id: "neuro", label: "Неврология" },
];

/** Test ordering panel in stationary game with category tabs and search */
export default function TestSelection({
  selDiag,
  setSelDiag,
  handleOrderTests,
  cycle,
  selectedLabParams = {},
  setSelectedLabParams,
}) {
  const C = useTheme();
  const { t } = useTranslate();
  const dayColor = DAY_COLORS[cycle.currentDay % 7];
  const [activeCat, setActiveCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBmp, setExpandedBmp] = useState(false);

  const q = searchQuery.trim().toLowerCase();

  const toggleDiag = (id) => {
    setSelDiag((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const filteredDiagnostics = useMemo(() => {
    return DIAGNOSTICS.filter((item) => {
      const matchesCat = activeCat === "all" || item.cat === activeCat;
      const matchesQ = !q || item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
      const notBiochemSub = !BIOCHEMICAL_TEST_IDS.includes(item.id);
      return matchesCat && matchesQ && notBiochemSub;
    });
  }, [activeCat, q]);

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px" }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: dayColor, fontFamily: FONT, marginBottom: 6 }}>
        {t("stationary.day", { n: cycle.currentDay + 1 })} — {t("phases.order_tests")}
      </div>

      {/* Вкладки категорий исследований */}
      <div className="no-scrollbar" style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 4, marginBottom: 6, flexShrink: 0, WebkitOverflowScrolling: "touch" }}>
        {DIAG_TABS.map((tab) => {
          const isActive = activeCat === tab.id;
          const count = selDiag.filter((id) => {
            const d = DIAGNOSTICS.find((x) => x.id === id);
            return d && (tab.id === "all" || d.cat === tab.id);
          }).length;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCat(tab.id)}
              style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, border: `1px solid ${isActive ? C.accent : C.btnBorder || C.border}`, background: isActive ? `${C.accent}20` : C.panelBg2, color: isActive ? C.accent : C.textDim, fontSize: 11, fontWeight: isActive ? 700 : 500, fontFamily: FONT, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
            >
              <span>{tab.label}</span>
              {count > 0 && <span style={{ background: `${C.accent}30`, color: C.accent, borderRadius: 9999, fontSize: 9, fontWeight: 700, fontFamily: CODE, padding: "0 4px" }}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Компактный поиск исследований */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.headerBg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 8px", marginBottom: 6 }}>
        <IconSearch size={12} color={C.textDim} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("search.placeholderDiag") || "Поиск исследований..."}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontFamily: FONT, fontSize: 11.5 }}
        />
        {searchQuery && (
          <button type="button" onClick={() => setSearchQuery("")} style={{ background: "transparent", border: "none", color: C.textDim, cursor: "pointer", padding: 0 }}>
            <IconX size={11} />
          </button>
        )}
      </div>

      {/* Список исследований выбранной вкладки */}
      <div className="no-scrollbar" style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 180, overflowY: "auto", paddingRight: 2 }}>
        {filteredDiagnostics.length === 0 ? (
          <div style={{ textAlign: "center", padding: "12px", color: C.textDim, fontSize: 11, fontFamily: FONT }}>{t("cases.empty")}</div>
        ) : (
          filteredDiagnostics.map((item) => {
            const selected = selDiag.includes(item.id);
            const color = getCategoryColor(item.cat, C);
            return (
              <React.Fragment key={item.id}>
                <div
                  onClick={() => toggleDiag(item.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6,
                    cursor: "pointer", background: selected ? `${color}15` : "transparent",
                    border: `1px solid ${selected ? color : C.border}`,
                  }}
                >
                  <div style={{ width: 14, height: 14, borderRadius: 3, border: `2px solid ${selected ? color : C.textDim}`, background: selected ? color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {selected && <IconCheck size={10} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: 12, color: selected ? (C.isDark !== false ? C.white : C.accent) : C.text, fontFamily: FONT, flex: 1 }}>
                    {item.name}
                  </span>
                  {item.id === "bmp" && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); if (!selected) toggleDiag(item.id); setExpandedBmp((prev) => !prev); }}
                      style={{ background: `${color}20`, border: `1px solid ${color}50`, borderRadius: 5, padding: "1px 6px", fontSize: 10, fontFamily: FONT, color, fontWeight: 700, cursor: "pointer" }}
                      title="Настроить показатели биохимии"
                    >
                      <span>{(selectedLabParams?.bmp?.length || DEFAULT_BMP_PARAMS.length)} из {BMP_PARAMETERS.length}</span>
                    </button>
                  )}
                </div>
                {item.id === "bmp" && expandedBmp && (
                  <LabInlineSelector
                    selectedIds={selectedLabParams?.bmp || []}
                    onChange={(ids) => {
                      setSelectedLabParams && setSelectedLabParams((prev) => ({ ...prev, bmp: ids }));
                      if (ids.length > 0 && !selected) toggleDiag("bmp");
                    }}
                    onClose={() => setExpandedBmp(false)}
                  />
                )}
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* Кнопка заказа исследований */}
      {selDiag.length > 0 && (
        <button
          onClick={handleOrderTests}
          style={{
            width: "100%", marginTop: 8, padding: "9px", borderRadius: 8,
            background: `linear-gradient(135deg,${dayColor},${C.accent})`, border: "none",
            fontSize: 12.5, fontWeight: 700, color: "#FFFFFF", cursor: "pointer", fontFamily: FONT,
          }}
        >
          {t("outpatient.send", { n: selDiag.length })}
        </button>
      )}
    </div>
  );
}
