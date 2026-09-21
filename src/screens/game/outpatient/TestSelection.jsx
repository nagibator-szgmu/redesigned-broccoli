import React from "react";
import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";
import { DIAGNOSTICS, CAT_COLOR } from "../../../data/diagnostics";

/** Test ordering panel with full diagnostics catalog (FR-С.3) */
export function TestSelection({ selDiag, setSelDiag, handleOrderTests }) {
  const C = useTheme();
  const { t } = useTranslate();

  const toggleDiag = (id) => {
    setSelDiag(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

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
