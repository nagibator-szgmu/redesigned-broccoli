import React from "react";
import { FONT } from "../../../ui/theme";
import { LAB_PROFILES } from "../../../engine/labAnalysisEngine";
import { IconGear } from "../../../ui/icons";

/** Панель быстрых профилей анализов */
export default function LabProfilesBar({ isBmp, catalog, selectedCount, onSelectProfile, onReset, C }) {
  const chip = (active) => ({
    padding: "3px 8px",
    borderRadius: 6,
    border: `1px solid ${active ? C.accent : C.border}`,
    background: active ? `${C.accent}25` : "transparent",
    color: active ? C.accent : C.text,
    fontSize: 11,
    fontFamily: FONT,
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
    transition: "all 0.12s ease",
  });

  return (
    <div style={{ padding: "8px 18px", background: `${C.accent}08`, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.textDim, fontFamily: FONT, display: "flex", alignItems: "center", gap: 4 }}>
        <IconGear size={12} color={C.accent} /> Профили:
      </span>
      {isBmp ? (
        <>
          <button type="button" onClick={() => onSelectProfile(LAB_PROFILES.bmp_basic.paramIds)} style={chip(selectedCount === 8)}>
            Базовый (8)
          </button>
          <button type="button" onClick={() => onSelectProfile(LAB_PROFILES.bmp_renal.paramIds)} style={chip(false)}>
            Почечный (6)
          </button>
          <button type="button" onClick={() => onSelectProfile(LAB_PROFILES.bmp_hepatic.paramIds)} style={chip(false)}>
            Печеночный (6)
          </button>
          <button type="button" onClick={() => onSelectProfile(catalog.map((p) => p.id))} style={chip(selectedCount === catalog.length)}>
            Все ({catalog.length})
          </button>
        </>
      ) : (
        <>
          <button type="button" onClick={() => onSelectProfile(LAB_PROFILES.urine_standard.paramIds)} style={chip(selectedCount === 6)}>
            Стандартный (6)
          </button>
          <button type="button" onClick={() => onSelectProfile(catalog.map((p) => p.id))} style={chip(selectedCount === catalog.length)}>
            Все ({catalog.length})
          </button>
        </>
      )}
      <button type="button" onClick={onReset} style={{ ...chip(false), color: C.textDim }}>
        Сброс
      </button>
    </div>
  );
}
