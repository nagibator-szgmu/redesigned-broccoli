import React, { useState } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import { DIAGNOSTICS } from "../../../data/diagnostics";
import {
  IconMicroscope, IconCheckCircle, IconClock,
  IconChevronDown, IconChevronUp
} from "../../../ui/icons";

/** Свернутый по умолчанию аккордеон результатов обследования */
export default function MobileResultsAccordion({
  orderedDiag = [],
  revealedResults = {},
  newResultIds = [],
  onOpenDiag,
}) {
  const C = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  if (!orderedDiag || orderedDiag.length === 0) return null;

  return (
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
        onClick={() => setIsOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          cursor: "pointer",
          background: isOpen ? `${C.accent}12` : "transparent",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, fontFamily: FONT, display: "inline-flex", alignItems: "center", gap: 5 }}>
          <IconMicroscope size={13} color={C.accent} />
          Результаты обследования ({orderedDiag.length})
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDiag && onOpenDiag();
            }}
            style={{
              background: "transparent", border: "none", color: C.accent, fontSize: 11,
              fontFamily: FONT, fontWeight: 600, cursor: "pointer", padding: 0
            }}
          >
            + Добавить
          </button>
          {isOpen ? <IconChevronUp size={13} color={C.textDim} /> : <IconChevronDown size={13} color={C.textDim} />}
        </div>
      </div>

      {isOpen && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "6px 10px 10px", borderTop: `1px solid ${C.border}` }}>
          {orderedDiag.map((id) => {
            const test = DIAGNOSTICS.find((d) => d.id === id);
            const text = revealedResults[id];
            const isNew = newResultIds.includes(id);

            return (
              <div
                key={id}
                style={{
                  background: isNew ? `${C.yellow}15` : `${C.accent}08`,
                  border: `1px solid ${isNew ? C.yellow : `${C.accent}25`}`,
                  borderRadius: 6,
                  padding: "6px 8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: C.white, fontFamily: FONT }}>
                    {test?.name || id}
                  </span>
                  {text ? (
                    <span style={{ fontSize: 10, color: C.green, display: "inline-flex", alignItems: "center", gap: 3, fontFamily: FONT }}>
                      <IconCheckCircle size={10} color={C.green} /> Готово
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, color: C.yellow, display: "inline-flex", alignItems: "center", gap: 3, fontFamily: FONT }}>
                      <IconClock size={10} color={C.yellow} /> Выполняется...
                    </span>
                  )}
                </div>
                {text && (
                  <div style={{ fontSize: 11, color: C.text, fontFamily: FONT, lineHeight: 1.35, marginTop: 2 }}>
                    {text}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
