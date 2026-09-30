import React from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import PatientResultsSection from "./PatientResultsSection";
import DiagTab from "./DiagTab";
import { IconCheckCircle } from "../../../ui/icons";

/**
 * Единый диагностический терминал:
 * Верхний блок отображает результаты назначенных тестов,
 * Нижний блок позволяет искать и заказывать новые исследования.
 */
export default function DiagnosticWorkspace({
  selDiag,
  setSelDiag,
  orderedDiag = [],
  revealedResults = {},
  newResultIds = [],
  handleOrderTests,
  processingTests,
  cd,
  t,
}) {
  const C = useTheme();
  const hasResults = orderedDiag.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflow: "hidden" }}>
      {/* Секция готовых результатов (если тесты уже назначены) */}
      {hasResults && (
        <div
          style={{
            flexShrink: 0,
            maxHeight: "38%",
            display: "flex",
            flexDirection: "column",
            background: `${C.accent}06`,
            borderBottom: `1px solid ${C.border}`,
            padding: "6px 10px",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.accent, fontFamily: FONT, textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 4 }}>
              <IconCheckCircle size={12} color={C.accent} />
              Результаты исследований ({orderedDiag.length})
            </span>
            {newResultIds.length > 0 && (
              <span style={{ fontSize: 9, fontWeight: 700, color: C.yellow, background: `${C.yellow}20`, padding: "1px 6px", borderRadius: 4 }}>
                +{newResultIds.length} новых
              </span>
            )}
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", paddingRight: 2 }} className="no-scrollbar">
            <PatientResultsSection
              orderedDiag={orderedDiag}
              revealedResults={revealedResults}
              newResultIds={newResultIds}
              cd={cd}
            />
          </div>
        </div>
      )}

      {/* Каталог заказа исследований */}
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <DiagTab
            selDiag={selDiag}
            setSelDiag={setSelDiag}
            orderedDiag={orderedDiag}
            handleOrderTests={handleOrderTests}
            processingTests={processingTests}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}
