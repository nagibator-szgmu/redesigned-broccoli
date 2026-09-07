import React from "react";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { DIAGNOSTICS, CAT_COLOR } from "../../data/diagnostics";
import { ROUTE_ICONS } from "./OutpatientPanels";
import SearchableCombobox from "../../components/ui/SearchableCombobox";

/** Test ordering panel with SearchableCombobox and full diagnostics catalog (FR-С.3) */
export function TestSelection({ cd, selDiag, setSelDiag, handleOrderTests }) {
  const C = useTheme();
  const { t } = useTranslate();

  const toggleDiag = (id) => {
    setSelDiag(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const categories = [
    { id: "all", label: "Все" },
    { id: "lab", label: "Лабораторные" },
    { id: "instrumental", label: "Инструментальные" },
    { id: "imaging", label: "Лучевая диагн." },
    { id: "poc", label: "Экспресс (POC)" },
  ];

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: FONT, marginBottom: 10 }}>
        {t("outpatient.orderTests") || "Назначение исследований"}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 240, overflowY: "auto", marginTop: 8 }}>
        {DIAGNOSTICS.map(item => {
          const selected = selDiag.includes(item.id);
          const color = CAT_COLOR[item.cat] || C.green;
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
                {selected && <span style={{ fontSize: 9, color: C.bg, fontWeight: 900 }}>✓</span>}
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

/** Test results panel */
export function ResultsPanel({ orderedDiag, revealedResults, processingTests, handleNextFromResults }) {
  const C = useTheme();
  const { t } = useTranslate();
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: FONT, marginBottom: 10 }}>
        {t("results.title", { n: orderedDiag.length })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {orderedDiag.map(id => {
          const text = revealedResults[id];
          if (!text) return (
            <div key={id} style={{ padding: "8px 10px", borderRadius: 8, background: `${C.textDim}08`, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, border: `2px solid ${C.yellow}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <span style={{ fontSize: 12, color: C.textDim, fontFamily: FONT }}>{id} — {t("outpatient.loading")}</span>
            </div>
          );
          const isCrit = text.startsWith("🔴");
          return (
            <div key={id} style={{ padding: "8px 10px", borderRadius: 8, background: isCrit ? `${C.red}0a` : `${C.textDim}08`, borderLeft: `3px solid ${isCrit ? C.red : C.accent}` }}>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT, textTransform: "uppercase", marginBottom: 2 }}>{id}</div>
              <div style={{ fontSize: 12.5, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>{text}</div>
            </div>
          );
        })}
      </div>
      {processingTests && <div style={{ textAlign: "center", padding: 8, fontSize: 12, color: C.textDim, fontFamily: FONT }}>{t("outpatient.loading")}</div>}
      {orderedDiag.length > 0 && orderedDiag.every(id => revealedResults[id]) && (
        <button
          onClick={handleNextFromResults}
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
          {t("outpatient.toDiagnose")}
        </button>
      )}
    </div>
  );
}

/** Route selection panel */
export function RouteSelection({ routeOptions, selectedRoute, setSelectedRoute }) {
  const C = useTheme();
  const { t } = useTranslate();
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: FONT, marginBottom: 10 }}>
        {t("outpatient.routeTitle")}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {(routeOptions || []).map(opt => {
          const sel = selectedRoute === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => setSelectedRoute(opt.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                cursor: "pointer",
                background: sel ? `${C.accent}18` : "transparent",
                border: `1px solid ${sel ? C.accent : C.border}`,
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: 18 }}>{ROUTE_ICONS[opt.id] || "📋"}</span>
              <span style={{ fontSize: 13, color: sel ? C.accent : C.text, fontWeight: sel ? 700 : 400, fontFamily: FONT, flex: 1 }}>
                {opt.label}
              </span>
              {sel && <span style={{ fontSize: 14, color: C.accent, fontWeight: 900 }}>✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
