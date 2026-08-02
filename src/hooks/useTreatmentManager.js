import { useState, useCallback } from "react";
import { TREAT_FX, ADVERSE_FX, TREATMENTS } from "../data/treatments";
import { applyTreatmentEffects, resolveStatus } from "../engine/deterioration";

/**
 * Manages treatment selection, pending effects, and applied effects.
 * @param {Object} opts
 * @param {Function} opts.addEvent
 * @param {Function} opts.setPs
 * @param {React.MutableRefObject} opts.stateRef
 * @param {React.MutableRefObject} opts.fxTimersRef
 * @returns {Object} treatment state + handlers
 */
export default function useTreatmentManager({ addEvent, setPs, stateRef, fxTimersRef }) {
  const [selTreat, setSelTreat] = useState([]);
  const [appliedFx, setAppliedFx] = useState(new Set());
  const [pendingFx, setPendingFx] = useState(new Set());

  const applyTreatEffect = useCallback((treatId) => {
    const cCase = stateRef.current.cd;
    if (!cCase) return;
    const fx = TREAT_FX[treatId];
    const tName = TREATMENTS.find(t => t.id === treatId)?.name || treatId;
    const isWrong = cCase.wrongTreat.includes(treatId);
    if (isWrong && stateRef.current.learningMode) {
      setAppliedFx(prev => new Set([...prev, treatId]));
      setPendingFx(prev => { const n = new Set(prev); n.delete(treatId); return n; });
      return;
    }
    const effects = isWrong ? (ADVERSE_FX[treatId] || {}) : (fx?.eff || {});
    if (!Object.keys(effects).some(k => effects[k] !== 0)) {
      setAppliedFx(prev => new Set([...prev, treatId]));
      setPendingFx(prev => { const n = new Set(prev); n.delete(treatId); return n; });
      return;
    }
    setPs(prev => {
      if (!prev || prev.status === "dead") return prev;
      const next = applyTreatmentEffects(prev, cCase, treatId);
      return resolveStatus(next, cCase);
    });
    if (isWrong) {
      const hideWarnings = localStorage.getItem("ms_hideWarnings") === "true";
      if (hideWarnings) {
        addEvent(`✓ ${tName}: эффект применён`, "result");
      } else {
        addEvent(`🚨 ${tName}: ОПАСНЫЙ ЭФФЕКТ — состояние ухудшилось`, "critical");
      }
    } else {
      addEvent(`✓ ${tName}: ${fx?.desc || "эффект применён"}`, "result");
    }
    setAppliedFx(prev => new Set([...prev, treatId]));
    setPendingFx(prev => { const n = new Set(prev); n.delete(treatId); return n; });
  }, [addEvent, setPs, stateRef]);

  const toggleTreatment = useCallback((treatId) => {
    const alreadySelected = stateRef.current.selTreat.includes(treatId);
    if (alreadySelected) {
      if (stateRef.current.appliedFx.has(treatId)) return;
      setPendingFx(p => { const n = new Set(p); n.delete(treatId); return n; });
      setSelTreat(prev => prev.filter(x => x !== treatId));
      return;
    }
    setSelTreat(prev => [...prev, treatId]);
    const tName = TREATMENTS.find(t => t.id === treatId)?.name || treatId;
    addEvent(`💊 Назначен: ${tName}`, "treatment");
    const fx = TREAT_FX[treatId];
    const delayMs = Math.round(((fx?.delay || 60) / 6) * 1000);
    setPendingFx(p => new Set([...p, treatId]));
    const timer = setTimeout(() => applyTreatEffect(treatId), delayMs);
    fxTimersRef.current.push(timer);
  }, [addEvent, applyTreatEffect, stateRef, fxTimersRef]);

  return { selTreat, setSelTreat, appliedFx, setAppliedFx, pendingFx, setPendingFx, toggleTreatment };
}
