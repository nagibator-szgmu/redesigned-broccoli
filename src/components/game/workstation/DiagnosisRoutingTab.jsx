import React, { useState, useMemo } from "react";
import {
  DiagnosisSearchSection,
  DiagnosisCriteriaSection,
  RoutingSection,
  DiagnosisFooter,
  deriveAvailableCriteria,
} from "./diagnosis";

/**
 * Вкладка формулировки клинического диагноза, обоснования (опорные критерии),
 * интерактивного поиска МКБ-10 и маршрутизации.
 */
export default function DiagnosisRoutingTab({
  diagText,
  setDiagText,
  selTreat = [],
  pendingFx,
  handleSubmit,
  cd,
  selectedRoute,
  setSelectedRoute,
  setExtraResult,
  orderedDiag = [],
  t,
}) {
  const [selectedCriteria, setSelectedCriteria] = useState(new Set());

  const isAdmission = cd?.department === "admission";
  const hasRouteOptions = Boolean(cd?.routeOptions && cd.routeOptions.length > 0);
  const canSubmit = isAdmission && hasRouteOptions
    ? selTreat.length > 0 && selectedRoute !== null
    : selTreat.length > 0;

  const availableCriteria = useMemo(() => {
    return deriveAvailableCriteria(cd, orderedDiag);
  }, [cd, orderedDiag]);

  const toggleCriterion = (id) => {
    setSelectedCriteria((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const doSubmit = () => {
    if (isAdmission && setExtraResult) {
      setExtraResult({
        selectedRoute,
        routeOptions: cd.routeOptions,
        correctRoute: cd.correctRoute,
        selectedCriteria: Array.from(selectedCriteria),
      });
    }
    handleSubmit(false);
  };

  return (
    <div
      style={{
        height: "100%",
        padding: "12px 14px",
        overflowY: "auto",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Секция 1: Формулировка клинического диагноза и поиск МКБ-10 */}
      <DiagnosisSearchSection diagText={diagText} setDiagText={setDiagText} t={t} />

      {/* Секция 2: Клиническое обоснование диагноза (Опорные критерии) */}
      <DiagnosisCriteriaSection
        availableCriteria={availableCriteria}
        selectedCriteria={selectedCriteria}
        toggleCriterion={toggleCriterion}
      />

      {/* Секция 3: Маршрутизация пациента (только если доступна для отделения) */}
      {hasRouteOptions && (
        <RoutingSection
          routeOptions={cd.routeOptions}
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
          t={t}
        />
      )}

      {/* Секция 4: Сводка и завершение */}
      <DiagnosisFooter
        selTreat={selTreat}
        pendingFx={pendingFx}
        canSubmit={canSubmit}
        doSubmit={doSubmit}
        t={t}
      />
    </div>
  );
}
