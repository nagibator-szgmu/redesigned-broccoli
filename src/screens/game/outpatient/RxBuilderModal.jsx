import React, { useState, useEffect } from "react";
import { FONT, CODE } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { IconPill, IconX } from "../../../ui/icons";
import { getDrugPreset } from "../../../data/outpatientDrugConfigs";
import { findMatchingOption } from "../../../engine/drugMatcher";

/**
 * RxBuilderModal
 * Интерактивный конструктор рецепта: разовая доза -> путь -> кратность -> курс.
 */
export default function RxBuilderModal({ isOpen, targetDrug, rxPlan, currentRx, onSave, onClose }) {
  const C = useTheme();
  const preset = targetDrug ? getDrugPreset(targetDrug.id, targetDrug.name) : null;
  const activeOption = !targetDrug && rxPlan?.options
    ? (rxPlan.options.find((o) => o.id === currentRx?.id) || rxPlan.options[0]) : null;

  const mnnTitle = preset?.mnn || targetDrug?.name || activeOption?.mnn || "Препарат";
  const groupTitle = preset?.group || rxPlan?.group || "Фармакотерапия";
  const doses = preset?.doses || activeOption?.doses || [];
  const routes = preset?.routes || activeOption?.routes || [];
  const frequencies = preset?.frequencies || activeOption?.frequencies || [];
  const durations = preset?.durations || activeOption?.durations || [];

  const [rx, setRx] = useState({ dose: null, route: null, frequency: null, duration: null });

  useEffect(() => {
    if (!isOpen) return;
    setRx({
      dose: currentRx?.dose || preset?.defaultDose || doses[0] || null,
      route: currentRx?.route || preset?.defaultRoute || routes[0] || null,
      frequency: currentRx?.frequency || preset?.defaultFrequency || frequencies[0] || null,
      duration: currentRx?.duration || preset?.defaultDuration || durations[0] || null,
    });
  }, [isOpen, targetDrug, currentRx]);

  if (!isOpen) return null;

  const handleSave = () => {
    const drugId = targetDrug?.id || activeOption?.id || currentRx?.id;
    if (!drugId) return;
    const matched = findMatchingOption(drugId, rxPlan);
    const isCorrect = matched
      ? Boolean(matched.isCorrect && (!matched.correctDose || rx.dose === matched.correctDose) && (!matched.correctFrequency || rx.frequency === matched.correctFrequency))
      : false;

    onSave({
      id: drugId,
      mnn: mnnTitle,
      dose: rx.dose || doses[0] || "Стандартная доза",
      route: rx.route || routes[0] || "Перорально (per os)",
      frequency: rx.frequency || frequencies[0] || "1 раз в сутки",
      duration: rx.duration || durations[0] || "2–4 недели",
      isCorrect,
      score: isCorrect ? 10 : 0,
    });
    onClose();
  };

  const renderChips = (label, items = [], currentVal, key) => (
    <div style={{ marginBottom: 9 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.textDim || "#64748B", fontFamily: FONT, marginBottom: 4 }}>
        {label}:
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {items.map((val) => {
          const isSel = currentVal === val;
          return (
            <button key={val} type="button" onClick={() => setRx((p) => ({ ...p, [key]: val }))}
              style={{
                padding: "5px 10px", borderRadius: 7, fontSize: 11.5, fontFamily: FONT,
                fontWeight: isSel ? 700 : 500,
                border: `1.5px solid ${isSel ? C.accent : (C.borderBright || C.border)}`,
                background: isSel ? `${C.accent}22` : (C.dimBg || "transparent"),
                color: isSel ? C.accent : C.text, cursor: "pointer", transition: "all 0.15s ease",
              }}>
              {val}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "50px 16px 20px" }}>
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", maxWidth: 500, width: "100%", maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IconPill size={17} color={C.accent} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: FONT }}>{mnnTitle}</div>
              <div style={{ fontSize: 11, color: C.textDim, fontFamily: CODE }}>{groupTitle}</div>
            </div>
          </div>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer" }}><IconX size={18} /></button>
        </div>

        <div style={{ background: `${C.panel2 || C.panel}80`, padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, marginBottom: 12 }}>
          {renderChips("Разовая доза", doses, rx.dose, "dose")}
          {renderChips("Путь введения", routes, rx.route, "route")}
          {renderChips("Кратность приема", frequencies, rx.frequency, "frequency")}
          {renderChips("Длительность курса", durations, rx.duration, "duration")}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={onClose} style={{ padding: "7px 12px", borderRadius: 7, border: `1px solid ${C.border}`, background: "transparent", color: C.text, fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer" }}>Отмена</button>
          <button type="button" onClick={handleSave} style={{ padding: "7px 16px", borderRadius: 7, border: "none", background: `linear-gradient(135deg, ${C.accent}, ${C.green || "#10B981"})`, color: C.bg || "#ffffff", fontSize: 12, fontWeight: 700, fontFamily: FONT, cursor: "pointer" }}>Сохранить рецепт</button>
        </div>
      </div>
    </div>
  );
}
