import React, { useState, useEffect } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";
import ActionTabBar from "./ActionTabBar";
import DiagnosticWorkspace from "./DiagnosticWorkspace";
import TreatTab from "./TreatTab";
import DiagnosisRoutingTab from "./DiagnosisRoutingTab";

/**
 * Главный клинический командный центр врача (Active Clinical Command Center).
 * Содержит постоянные рабочие вкладки вместо закрытых аккордеонов.
 */
export default function ActionCommandCenter({
  phase,
  selDiag = [],
  setSelDiag,
  orderedDiag = [],
  revealedResults = {},
  newResultIds = [],
  handleOrderTests,
  processingTests,
  cd,
  selTreat = [],
  toggleTreatment,
  appliedFx,
  pendingFx,
  treatCat,
  setTreatCat,
  diagText,
  setDiagText,
  handleSubmit,
  selectedRoute,
  setSelectedRoute,
  setExtraResult,
}) {
  const C = useTheme();
  const { t } = useTranslate();

  const [activeTab, setActiveTab] = useState(() =>
    phase === "diagnose" ? "diagnose" : phase === "treat" ? "treat" : "diag"
  );

  useEffect(() => {
    if (phase === "diagnose") {
      setActiveTab("diagnose");
    } else if (phase === "treat" && activeTab === "diag" && orderedDiag.length > 0) {
      setActiveTab("treat");
    }
  }, [phase]);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: C.panelBg,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Навигационная панель переключения рабочих столов врача */}
      <ActionTabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        orderedCount={orderedDiag.length}
        treatCount={selTreat.length}
        hasDiag={Boolean(diagText)}
        t={t}
        C={C}
      />

      {/* Рабочая область выбранного режима */}
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {activeTab === "diag" && (
          <DiagnosticWorkspace
            selDiag={selDiag}
            setSelDiag={setSelDiag}
            orderedDiag={orderedDiag}
            revealedResults={revealedResults}
            newResultIds={newResultIds}
            handleOrderTests={handleOrderTests}
            processingTests={processingTests}
            cd={cd}
            t={t}
          />
        )}

        {activeTab === "treat" && (
          <TreatTab
            cd={cd}
            selTreat={selTreat}
            toggleTreatment={toggleTreatment}
            appliedFx={appliedFx}
            pendingFx={pendingFx}
            treatCat={treatCat}
            setTreatCat={setTreatCat}
          />
        )}

        {activeTab === "diagnose" && (
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "10px 12px" }}>
            <DiagnosisRoutingTab
              diagText={diagText}
              setDiagText={setDiagText}
              selTreat={selTreat}
              pendingFx={pendingFx}
              handleSubmit={handleSubmit}
              cd={cd}
              selectedRoute={selectedRoute}
              setSelectedRoute={setSelectedRoute}
              setExtraResult={setExtraResult}
              orderedDiag={orderedDiag}
              t={t}
            />
          </div>
        )}
      </div>
    </div>
  );
}
