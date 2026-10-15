import React, { useMemo } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";
import { BMP_PARAMETERS, LAB_GROUPS, LAB_PROFILES, DEFAULT_BMP_PARAMS } from "../../../engine/labAnalysisEngine";
import { IconCheck } from "../../../ui/icons";

/** Встроенная панель выбора параметров биохимии крови */
export default function LabInlineSelector({ selectedIds, onChange, onClose }) {
  const C = useTheme();
  const currentSelected = Array.isArray(selectedIds) ? selectedIds : DEFAULT_BMP_PARAMS;

  const grouped = useMemo(() => {
    const res = {};
    BMP_PARAMETERS.forEach((p) => {
      if (!res[p.group]) res[p.group] = [];
      res[p.group].push(p);
    });
    return res;
  }, []);

  const toggleParam = (id) => {
    onChange(currentSelected.includes(id) ? currentSelected.filter((x) => x !== id) : [...currentSelected, id]);
  };

  const PROFILES = [
    { label: "Базовый", ids: LAB_PROFILES.bmp_basic.paramIds },
    { label: "Печеночные", ids: LAB_PROFILES.bmp_hepatic.paramIds },
    { label: "Почечный", ids: LAB_PROFILES.bmp_renal.paramIds },
    { label: "Электролиты", ids: LAB_PROFILES.bmp_electrolytes.paramIds },
    { label: "Метаболизм/Шок", ids: LAB_PROFILES.bmp_metabolic.paramIds },
    { label: `Все ${BMP_PARAMETERS.length}`, ids: LAB_PROFILES.bmp_full.paramIds },
  ];

  return (
    <div style={{ marginTop: 6, padding: "10px 12px", background: C.dimBg || "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 8, display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Быстрые клинические профили */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
        <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: C.subText, textTransform: "uppercase" }}>Профили:</span>
        {PROFILES.map((p) => (
          <button key={p.label} type="button" onClick={() => onChange(p.ids)} style={chipStyle(C)}>
            {p.label}
          </button>
        ))}
        <button type="button" onClick={() => onChange([])} style={{ ...chipStyle(C), color: C.warn || "#EF4444" }}>
          Сброс
        </button>
      </div>

      {/* Сетка групп параметров */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 6 }}>
        {Object.entries(grouped).map(([groupKey, params]) => (
          <div key={groupKey} style={{ padding: "6px 8px", background: C.panel, border: `1px solid ${C.border}`, borderRadius: 6 }}>
            <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: C.accent, marginBottom: 4 }}>
              {LAB_GROUPS[groupKey] || groupKey}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {params.map((param) => {
                const isChecked = currentSelected.includes(param.id);
                return (
                  <label
                    key={param.id}
                    onClick={() => toggleParam(param.id)}
                    style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, fontFamily: FONT, color: isChecked ? C.text : C.subText, cursor: "pointer", padding: "2px 0", userSelect: "none" }}
                  >
                    <span style={{ width: 13, height: 13, borderRadius: 3, border: `1px solid ${isChecked ? C.accent : C.border}`, background: isChecked ? C.accent : "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                      {isChecked && <IconCheck size={9} />}
                    </span>
                    <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{param.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Подвал с количеством */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 2 }}>
        <span style={{ fontFamily: CODE, fontSize: 11, color: C.subText }}>
          Выбрано: <strong style={{ color: C.text }}>{currentSelected.length} из {BMP_PARAMETERS.length}</strong>
        </span>
        {onClose && (
          <button type="button" onClick={onClose} style={{ background: "transparent", border: "none", color: C.accent, fontFamily: FONT, fontSize: 11.5, fontWeight: 600, cursor: "pointer", padding: "2px 4px" }}>
            Свернуть
          </button>
        )}
      </div>
    </div>
  );
}

function chipStyle(C) {
  return {
    padding: "2px 8px",
    background: C.panel,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    fontSize: 10.5,
    fontFamily: FONT,
    color: C.text,
    cursor: "pointer",
    outline: "none",
  };
}
