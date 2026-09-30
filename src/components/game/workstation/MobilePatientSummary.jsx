import React, { useState } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";
import { TREATMENTS } from "../../../data/treatments";
import {
  IconPill, IconCheckCircle,
  IconChevronDown, IconChevronUp
} from "../../../ui/icons";
import MobileResultsAccordion from "./MobileResultsAccordion";

/**
 * Сводка обследований и терапии в карте пациента.
 * Все секции изначально свернуты (closed by default) по требованию эргономики.
 */
export default function MobilePatientSummary({
  orderedDiag = [],
  revealedResults = {},
  newResultIds = [],
  selTreat = [],
  onOpenDiag,
  onOpenTreat,
}) {
  const C = useTheme();
  const [treatOpen, setTreatOpen] = useState(false);
  const hasTreat = selTreat.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
      {/* 1. Блок результатов обследований (по умолчанию свернут) */}
      <MobileResultsAccordion
        orderedDiag={orderedDiag}
        revealedResults={revealedResults}
        newResultIds={newResultIds}
        onOpenDiag={onOpenDiag}
      />

      {/* 2. Блок примененной терапии (по умолчанию свернут) */}
      {hasTreat && (
        <div
          style={{
            background: C.panelBg,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <div
            onClick={() => setTreatOpen((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              cursor: "pointer",
              background: treatOpen ? `${C.green}12` : "transparent",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: C.green, fontFamily: FONT, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <IconPill size={13} color={C.green} />
              Назначенная терапия ({selTreat.length})
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTreat && onOpenTreat();
                }}
                style={{
                  background: "transparent", border: "none", color: C.green, fontSize: 11,
                  fontFamily: FONT, fontWeight: 600, cursor: "pointer", padding: 0
                }}
              >
                + Добавить
              </button>
              {treatOpen ? <IconChevronUp size={13} color={C.textDim} /> : <IconChevronDown size={13} color={C.textDim} />}
            </div>
          </div>

          {treatOpen && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "6px 10px 10px", borderTop: `1px solid ${C.border}` }}>
              {selTreat.map((id) => {
                const tr = TREATMENTS.find((t) => t.id === id);
                return (
                  <span
                    key={id}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                      background: `${C.green}18`,
                      border: `1px solid ${C.green}45`,
                      borderRadius: 4,
                      padding: "2px 6px",
                      fontSize: 10.5,
                      fontFamily: CODE,
                      color: C.green,
                      fontWeight: 600,
                    }}
                  >
                    <IconCheckCircle size={9} color={C.green} />
                    {tr?.name || id}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
