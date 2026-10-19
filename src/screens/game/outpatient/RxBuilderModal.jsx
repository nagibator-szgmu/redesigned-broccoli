import React, { useState, useEffect } from "react";
import { FONT, CODE } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { IconPill, IconCheck, IconX } from "../../../ui/icons";

/**
 * RxBuilderModal
 * Интерактивный конструктор рецепта: МНН -> разовая доза -> путь -> кратность -> длительность.
 */
export default function RxBuilderModal({ isOpen, rxPlan, currentRx, onSave, onClose }) {
  const C = useTheme();
  const [rx, setRx] = useState(() => ({
    id: currentRx?.id || rxPlan?.options?.[0]?.id || null,
    dose: currentRx?.dose || null,
    route: currentRx?.route || null,
    frequency: currentRx?.frequency || null,
    duration: currentRx?.duration || null,
  }));

  const activeOption = (rxPlan?.options || []).find((o) => o.id === rx.id) || rxPlan?.options?.[0];

  useEffect(() => {
    if (activeOption) {
      setRx((p) => ({
        ...p,
        dose: p.dose || activeOption.doses?.[0] || null,
        route: p.route || activeOption.routes?.[0] || null,
        frequency: p.frequency || activeOption.frequencies?.[0] || null,
        duration: p.duration || activeOption.durations?.[0] || null,
      }));
    }
  }, [activeOption]);

  if (!isOpen || !rxPlan) return null;

  const handleSave = () => {
    if (!activeOption) return;
    onSave({
      id: activeOption.id,
      mnn: activeOption.mnn,
      dose: rx.dose,
      route: rx.route,
      frequency: rx.frequency,
      duration: rx.duration,
      isCorrect: activeOption.isCorrect && rx.dose === activeOption.correctDose && rx.frequency === activeOption.correctFrequency,
      score: activeOption.score || 10,
    });
    onClose();
  };

  const renderChips = (label, items = [], currentVal, key) => (
    <div style={{ marginBottom: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.subText, fontFamily: FONT, marginBottom: 3 }}>{label}:</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {items.map((val) => (
          <button key={val} type="button" onClick={() => setRx((p) => ({ ...p, [key]: val }))}
            style={{ padding: "4px 8px", borderRadius: 6, fontSize: 11, fontFamily: FONT, fontWeight: currentVal === val ? 700 : 500, border: `1px solid ${currentVal === val ? C.accent : C.border}`, background: currentVal === val ? `${C.accent}22` : "transparent", color: currentVal === val ? C.accent : C.text, cursor: "pointer" }}>
            {val}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", maxWidth: 480, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IconPill size={16} color={C.accent} />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text, fontFamily: FONT }}>Конструктор фармакотерапии</div>
              <div style={{ fontSize: 10.5, color: C.subText, fontFamily: CODE }}>{rxPlan.group}</div>
            </div>
          </div>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer" }}><IconX size={18} /></button>
        </div>

        {/* Выбор МНН */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 }}>
          {(rxPlan.options || []).map((opt) => {
            const isSel = activeOption?.id === opt.id;
            return (
              <div key={opt.id} onClick={() => setRx({ id: opt.id, dose: opt.doses?.[0] || null, route: opt.routes?.[0] || null, frequency: opt.frequencies?.[0] || null, duration: opt.durations?.[0] || null })}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", borderRadius: 7, cursor: "pointer", border: `1px solid ${isSel ? C.accent : C.border}`, background: isSel ? `${C.accent}15` : "transparent" }}>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: isSel ? 700 : 500, color: isSel ? C.accent : C.text, fontFamily: FONT }}>{opt.mnn}</div>
                  {opt.comment && <div style={{ fontSize: 10, color: C.subText, fontFamily: FONT }}>{opt.comment}</div>}
                </div>
                {isSel && <IconCheck size={14} color={C.accent} strokeWidth={2.5} />}
              </div>
            );
          })}
        </div>

        {/* Параметры */}
        {activeOption && (
          <div style={{ background: `${C.panel2 || C.panel}60`, padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, marginBottom: 10 }}>
            {renderChips("Разовая доза", activeOption.doses, rx.dose, "dose")}
            {renderChips("Путь введения", activeOption.routes, rx.route, "route")}
            {renderChips("Кратность приема", activeOption.frequencies, rx.frequency, "frequency")}
            {renderChips("Длительность курса", activeOption.durations, rx.duration, "duration")}
          </div>
        )}

        {rxPlan.nonPharm?.length > 0 && (
          <div style={{ marginBottom: 12, fontSize: 10.5, color: C.subText, fontFamily: FONT }}>
            <strong>Немедикаментозный базис: </strong>{rxPlan.nonPharm.join("; ")}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={onClose} style={{ padding: "7px 12px", borderRadius: 7, border: `1px solid ${C.border}`, background: "transparent", color: C.text, fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer" }}>Отмена</button>
          <button type="button" onClick={handleSave} style={{ padding: "7px 16px", borderRadius: 7, border: "none", background: `linear-gradient(135deg, ${C.accent}, ${C.green || "#10B981"})`, color: C.bg || "#ffffff", fontSize: 12, fontWeight: 700, fontFamily: FONT, cursor: "pointer" }}>Сохранить рецепт</button>
        </div>
      </div>
    </div>
  );
}
