import { useState, useCallback } from "react";

export function useDiagnosticOrders({ stateRef, setPhase, addEvent }) {
  const [selDiag, setSelDiag] = useState([]);
  const [orderedDiag, setOrderedDiag] = useState([]);
  const [revealedResults, setRevealedResults] = useState({});
  const [newResultIds, setNewResultIds] = useState([]);
  const [processingTests, setProcessingTests] = useState(false);

  const resetDiagnostics = useCallback(() => {
    setSelDiag([]);
    setOrderedDiag([]);
    setRevealedResults({});
    setNewResultIds([]);
    setProcessingTests(false);
  }, []);

  const handleOrderTests = useCallback(async () => {
    if (selDiag.length === 0) return;
    setProcessingTests(true);
    setOrderedDiag(selDiag);
    setPhase("awaiting_results");
    addEvent(`Назначено ${selDiag.length} исследований`, "info");
    const ids = [...selDiag];
    const cCase = stateRef.current.cd;
    for (let i = 0; i < ids.length; i++) {
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
      const id = ids[i];
      const text = cCase.testResults[id] || `${id}: в пределах нормы.`;
      setRevealedResults((prev) => ({ ...prev, [id]: text }));
      setNewResultIds((prev) => [...prev, id]);
      const isCrit = text.startsWith("🔴");
      addEvent(`Результат: ${id}${isCrit ? " — КРИТИЧНО" : ""}`, isCrit ? "critical" : "result");
      setTimeout(() => setNewResultIds((prev) => prev.filter((x) => x !== id)), 2000);
    }
    setProcessingTests(false);
  }, [selDiag, addEvent, setPhase, stateRef]);

  const allResultsReady = orderedDiag.length > 0 && orderedDiag.every((id) => revealedResults[id]);

  return {
    selDiag,
    setSelDiag,
    orderedDiag,
    setOrderedDiag,
    revealedResults,
    setRevealedResults,
    newResultIds,
    setNewResultIds,
    processingTests,
    resetDiagnostics,
    handleOrderTests,
    allResultsReady,
  };
}
