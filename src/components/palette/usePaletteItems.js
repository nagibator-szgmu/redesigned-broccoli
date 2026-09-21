import { useMemo } from "react";
import { TREATMENTS } from "../../data/treatments";
import { DIAGNOSTICS } from "../../data/diagnostics";
import { getNavPaletteItems, getAbcdePaletteItems } from "./paletteStaticItems";

export function usePaletteItems({
  phase,
  query,
  setPhase,
  onClose,
  onSelectABCDE,
  handleOrderTests,
  orderedDiag = [],
  toggleTreatment,
  selTreat = [],
}) {
  return useMemo(() => {
    const isSim = phase === "order_tests" || phase === "awaiting_results" || phase === "diagnose";
    const q = query.trim().toLowerCase();
    const result = [];

    // 1. Navigation items
    const navItems = getNavPaletteItems(setPhase, onClose);
    navItems.forEach((n) => {
      if (!q || n.title.toLowerCase().includes(q) || n.sub.toLowerCase().includes(q)) {
        result.push(n);
      }
    });

    // 2. ABCDE Assessment (in simulation)
    if (isSim && onSelectABCDE) {
      const abcde = getAbcdePaletteItems(onSelectABCDE, onClose);
      abcde.forEach((a) => {
        if (!q || a.title.toLowerCase().includes(q) || a.sub.toLowerCase().includes(q)) {
          result.push(a);
        }
      });
    }

    // 3. Diagnostics items (in simulation)
    if (isSim && handleOrderTests) {
      DIAGNOSTICS.forEach((d) => {
        const title = d.name;
        const sub = d.desc || d.category || "Диагностический тест";
        const isOrdered = orderedDiag.includes(d.id);
        if (!q || title.toLowerCase().includes(q) || sub.toLowerCase().includes(q)) {
          result.push({
            id: `diag_${d.id}`,
            cat: "Диагностические исследования",
            title: `${title}${isOrdered ? " (✓ Выполнен)" : ""}`,
            sub: `${d.category || "Тест"} · ${sub}`,
            action: () => {
              if (!isOrdered) handleOrderTests([d.id]);
              onClose();
            },
          });
        }
      });
    }

    // 4. Treatments items (in simulation)
    if (isSim && toggleTreatment) {
      TREATMENTS.forEach((t) => {
        const title = t.name;
        const sub = t.category || "Фармакотерапия";
        const isApplied = selTreat.includes(t.id);
        if (!q || title.toLowerCase().includes(q) || sub.toLowerCase().includes(q)) {
          result.push({
            id: `treat_${t.id}`,
            cat: "Фармакотерапия и вмешательства",
            title: `${title}${isApplied ? " (✓ Назначен)" : ""}`,
            sub: `${t.category || "Препарат"} · Дозировка по протоколу`,
            action: () => {
              toggleTreatment(t.id);
              onClose();
            },
          });
        }
      });
    }

    return result;
  }, [
    phase,
    query,
    setPhase,
    onClose,
    onSelectABCDE,
    handleOrderTests,
    orderedDiag,
    toggleTreatment,
    selTreat,
  ]);
}
