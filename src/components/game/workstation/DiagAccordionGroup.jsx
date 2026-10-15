import React, { useState } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";
import { CheckRow } from "../../../ui/components";
import { IconChevronDown } from "../../../ui/icons";
import { LabInlineSelector } from "../lab";
import { BMP_PARAMETERS, DEFAULT_BMP_PARAMS } from "../../../engine/labAnalysisEngine";

/**
 * Группа категорий диагностических тестов с поддержкой inline-выбора биохимии.
 */
export default function DiagAccordionGroup({
  title,
  icon,
  color,
  items = [],
  selDiag = [],
  orderedDiag = [],
  onToggle,
  isOpen,
  onToggleOpen,
  disabled,
  selectedLabParams = {},
  onParamsChange,
}) {
  const C = useTheme();
  const [hovered, setHovered] = useState(false);
  const [expandedBmp, setExpandedBmp] = useState(false);

  if (items.length === 0) return null;

  const selCount = items.filter((i) => selDiag.includes(i.id)).length;
  const orderedCount = items.filter((i) => orderedDiag.includes(i.id)).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 4 }}>
      {/* Шапка аккордеона категории */}
      <button
        type="button"
        onClick={onToggleOpen}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          background: isOpen ? `${color}10` : hovered ? C.dimBg : "transparent",
          border: `1px solid ${isOpen ? color + "50" : hovered ? C.borderBright : C.border}`,
          borderRadius: 8,
          cursor: "pointer",
          outline: "none",
          transition: "all 0.15s ease",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, flexShrink: 0 }}>
          {icon}
        </span>
        <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C.text, flex: 1, textAlign: "left" }}>
          {title}
        </span>
        {selCount > 0 && (
          <span style={{ fontFamily: CODE, fontSize: 10, fontWeight: 700, color: "#FFFFFF", background: color, borderRadius: 9999, padding: "1px 6px" }}>
            {selCount}
          </span>
        )}
        <span style={{ fontFamily: CODE, fontSize: 10, color: C.textDim, background: C.dimBg, borderRadius: 4, padding: "1px 4px" }}>
          {orderedCount > 0 ? `${items.length - orderedCount}/${items.length}` : items.length}
        </span>
        <div style={{ color: isOpen ? color : C.textDim, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
          <IconChevronDown size={12} color="currentColor" />
        </div>
      </button>

      {/* Список исследований внутри категории */}
      {isOpen && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingLeft: 4, paddingRight: 2 }}>
          {items.map((item) => {
            const isBmp = item.id === "bmp";
            const bmpParams = selectedLabParams?.bmp || [];
            const count = bmpParams.length > 0 ? bmpParams.length : DEFAULT_BMP_PARAMS.length;

            const suffix = isBmp ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedBmp((prev) => !prev);
                }}
                style={{
                  background: expandedBmp ? `${color}25` : `${color}12`,
                  border: `1px solid ${color}45`,
                  borderRadius: 6,
                  padding: "2px 7px",
                  fontSize: 10,
                  fontFamily: FONT,
                  color,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                }}
                title="Настроить показатели биохимии"
              >
                <span>{count} из {BMP_PARAMETERS.length}</span>
                <span style={{ transform: expandedBmp ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease", display: "inline-flex" }}>
                  <IconChevronDown size={10} color={color} />
                </span>
              </button>
            ) : null;

            return (
              <React.Fragment key={item.id}>
                <CheckRow
                  item={item}
                  selected={selDiag.includes(item.id)}
                  onToggle={(id) => {
                    onToggle(id);
                    if (isBmp && !selDiag.includes(id)) {
                      setExpandedBmp(true);
                    }
                  }}
                  color={color}
                  disabled={disabled || orderedDiag.includes(item.id)}
                  suffix={suffix}
                />
                {isBmp && expandedBmp && (
                  <LabInlineSelector
                    selectedIds={bmpParams}
                    onChange={(newIds) => {
                      onParamsChange && onParamsChange("bmp", newIds);
                      if (newIds.length > 0 && !selDiag.includes("bmp")) {
                        onToggle("bmp");
                      }
                    }}
                    onClose={() => setExpandedBmp(false)}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
