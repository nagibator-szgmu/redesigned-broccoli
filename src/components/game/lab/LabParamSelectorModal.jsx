import React, { useState, useMemo, useEffect } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";
import {
  BMP_PARAMETERS,
  URINE_PARAMETERS,
  DEFAULT_BMP_PARAMS,
  DEFAULT_URINE_PARAMS,
  LAB_GROUPS,
} from "../../../engine/labAnalysisEngine";
import { IconX, IconVial } from "../../../ui/icons";
import LabParamItem from "./LabParamItem";
import LabProfilesBar from "./LabProfilesBar";

export default function LabParamSelectorModal({
  isOpen,
  onClose,
  testId = "bmp",
  selectedParamIds = [],
  onSave,
}) {
  const C = useTheme();
  const isBmp = testId === "bmp";
  const catalog = isBmp ? BMP_PARAMETERS : URINE_PARAMETERS;
  const defaultIds = isBmp ? DEFAULT_BMP_PARAMS : DEFAULT_URINE_PARAMS;

  const [localSelected, setLocalSelected] = useState(() => {
    return selectedParamIds && selectedParamIds.length > 0 ? selectedParamIds : defaultIds;
  });

  useEffect(() => {
    if (isOpen) {
      setLocalSelected(selectedParamIds && selectedParamIds.length > 0 ? selectedParamIds : defaultIds);
    }
  }, [isOpen, selectedParamIds, defaultIds]);

  const groupedParams = useMemo(() => {
    const groups = {};
    catalog.forEach((param) => {
      const g = param.group || "other";
      if (!groups[g]) groups[g] = [];
      groups[g].push(param);
    });
    return groups;
  }, [catalog]);

  if (!isOpen) return null;

  const toggleParam = (id) => {
    setLocalSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleConfirm = () => {
    onSave(localSelected.length > 0 ? localSelected : defaultIds);
    onClose();
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...modalStyle, background: C.panel, border: `1px solid ${C.border}` }}>
        {/* Header */}
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.headerBg2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconVial size={20} color={C.accent} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: FONT }}>
                {isBmp ? "Показатели биохимии крови" : "Показатели анализа мочи (ОАМ)"}
              </div>
              <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT }}>
                Выберите необходимые маркеры для лабораторного бланка
              </div>
            </div>
          </div>
          <button onClick={onClose} type="button" style={{ background: "transparent", border: "none", color: C.textDim, cursor: "pointer", padding: 4 }}>
            <IconX size={18} />
          </button>
        </div>

        {/* Quick Profiles Bar */}
        <LabProfilesBar isBmp={isBmp} catalog={catalog} selectedCount={localSelected.length} onSelectProfile={setLocalSelected} onReset={() => setLocalSelected([])} C={C} />

        {/* Parameters list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.entries(groupedParams).map(([groupKey, items]) => (
            <div key={groupKey}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: C.accent, fontFamily: FONT, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>
                {LAB_GROUPS[groupKey] || groupKey}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 6 }}>
                {items.map((item) => (
                  <LabParamItem key={item.id} item={item} isChecked={localSelected.includes(item.id)} onToggle={toggleParam} C={C} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "10px 16px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.panelBg2 }}>
          <span style={{ fontSize: 11.5, fontFamily: CODE, color: C.textDim }}>
            Выбрано: <strong style={{ color: C.accent }}>{localSelected.length}</strong> из {catalog.length}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={onClose} style={{ padding: "7px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.textDim, fontSize: 12, fontFamily: FONT, cursor: "pointer" }}>
              Отмена
            </button>
            <button type="button" onClick={handleConfirm} style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${C.accent}, ${C.green})`, color: C.bg, fontWeight: 700, fontSize: 12, fontFamily: FONT, cursor: "pointer", boxShadow: `0 2px 10px ${C.accent}30` }}>
              Сохранить ({localSelected.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const backdropStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  background: "rgba(0,0,0,0.65)",
  backdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};

const modalStyle = {
  width: "100%",
  maxWidth: 580,
  maxHeight: "82vh",
  borderRadius: 14,
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
  overflow: "hidden",
};
