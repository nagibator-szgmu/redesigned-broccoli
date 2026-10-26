import React, { useState } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";
import { IconChevronDown, IconCheck, IconX } from "../../../ui/icons";

/**
 * OutpatientTreatAccordionGroup
 * Аккордеон амбулаторных назначений: медикаменты с конструктором рецепта
 * и лечебные диеты Минздрава РФ с прямой отметкой.
 */
export default function OutpatientTreatAccordionGroup({
  title, icon, color, items = [], selTreat = [], prescriptions = {},
  onToggle, onOpenRxBuilder, onRemoveRx, isOpen, onToggleOpen,
}) {
  const C = useTheme();
  const [hovered, setHovered] = useState(false);

  if (items.length === 0) return null;
  const selCount = items.filter((i) => selTreat.includes(i.id)).length;

  const handleItemClick = (item) => {
    if (item.isDiet) {
      onToggle(item.id);
    } else {
      onOpenRxBuilder(item);
    }
  };

  const handleCheckboxClick = (e, item, isSelected) => {
    e.stopPropagation();
    if (item.isDiet) {
      onToggle(item.id);
    } else if (isSelected) {
      if (onRemoveRx) onRemoveRx(item.id);
      else onToggle(item.id);
    } else {
      onOpenRxBuilder(item);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 4 }}>
      <button
        type="button" onClick={onToggleOpen}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 6, padding: "8px 12px",
          background: isOpen ? `${color}10` : hovered ? C.dimBg : "transparent",
          border: `1px solid ${isOpen ? color + "50" : hovered ? C.borderBright : C.border}`,
          borderRadius: 8, cursor: "pointer", outline: "none", transition: "all 0.15s ease",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, flexShrink: 0 }}>
          {icon}
        </span>
        <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: C.text, flex: 1, textAlign: "left" }}>
          {title}
        </span>
        {selCount > 0 && (
          <span style={{ fontFamily: CODE, fontSize: 10, fontWeight: 700, color: "#FFFFFF", background: color, borderRadius: 9999, padding: "1px 6px" }}>
            {selCount}
          </span>
        )}
        <span style={{ fontFamily: CODE, fontSize: 10, color: C.textDim, background: C.dimBg, borderRadius: 4, padding: "1px 4px" }}>
          {items.length}
        </span>
        <div style={{ color: isOpen ? color : C.textDim, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease, color 0.15s ease", display: "flex", alignItems: "center" }}>
          <IconChevronDown size={12} color="currentColor" />
        </div>
      </button>

      {isOpen && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingLeft: 4, paddingRight: 2 }}>
          {items.map((item) => {
            const isSelected = selTreat.includes(item.id);
            const rx = prescriptions[item.id];
            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                style={{
                  display: "flex", flexDirection: "column", gap: 4, minHeight: 40,
                  background: isSelected ? `${color}14` : "transparent",
                  border: `1px solid ${isSelected ? color + "70" : C.border}`,
                  borderRadius: 8, padding: "8px 12px", cursor: "pointer", marginBottom: 2,
                  boxShadow: isSelected ? `0 2px 8px -2px ${color}25` : "none",
                  transition: "all 0.15s ease", width: "100%", boxSizing: "border-box",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    onClick={(e) => handleCheckboxClick(e, item, isSelected)}
                    style={{
                      width: 18, height: 18, borderRadius: 4,
                      border: `1.5px solid ${isSelected ? color : C.borderBright}`,
                      background: isSelected ? color : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, boxShadow: isSelected ? `0 0 6px ${color}66` : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {isSelected && <IconCheck size={12} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: isSelected ? (C.isDark !== false ? C.white : C.accent) : C.text, fontSize: 13.5, fontFamily: FONT, fontWeight: isSelected ? 600 : 400, lineHeight: 1.35 }}>
                      {item.name}
                    </div>
                    {item.desc && (
                      <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, marginTop: 1 }}>
                        {item.desc}
                      </div>
                    )}
                  </div>
                </div>

                {/* Subline with prescribed recipe details */}
                {isSelected && !item.isDiet && rx && (
                  <div style={{ marginTop: 3, marginLeft: 28, display: "flex", alignItems: "center", justifyContent: "space-between", background: `${color}18`, border: `1px solid ${color}40`, borderRadius: 6, padding: "4px 8px" }}>
                    <span style={{ fontSize: 11, color: C.text, fontFamily: CODE, lineHeight: 1.3 }}>
                      ↳ {rx.dose || "Стандартная доза"}{rx.route ? `, ${rx.route}` : ""}{rx.frequency ? `, ${rx.frequency}` : ""}{rx.duration ? `, курс: ${rx.duration}` : ""}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: 6 }}>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onOpenRxBuilder(item); }}
                        style={{ background: "transparent", border: "none", color, fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "1px 4px" }}
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onRemoveRx ? onRemoveRx(item.id) : onToggle(item.id); }}
                        style={{ background: "transparent", border: "none", color: C.textDim, cursor: "pointer", display: "flex", alignItems: "center", padding: "1px 2px" }}
                        title="Отменить назначение"
                      >
                        <IconX size={12} color="currentColor" />
                      </button>
                    </div>
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
