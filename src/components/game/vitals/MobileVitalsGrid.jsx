import React from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";

/**
 * Адаптивная сетка витальных функций для мобильных устройств.
 * Отображает все 6 ключевых показателей в один ряд без горизонтального скролла.
 */
export default function MobileVitalsGrid({ items = [] }) {
  const C = useTheme();

  if (!items || items.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: 3,
        width: "100%",
        boxSizing: "border-box",
        padding: "2px 0 0 0",
      }}
    >
      {items.map((v) => {
        const isAlert = v.critical || v.warn;
        const alertColor = v.critical ? C.red : v.warn ? C.yellow : C.textDim;
        const bg = v.critical
          ? `${C.red}18`
          : v.warn
            ? `${C.yellow}12`
            : C.panelBg2;
        const border = v.critical
          ? `1px solid ${C.red}70`
          : v.warn
            ? `1px solid ${C.yellow}60`
            : `1px solid ${C.border}`;

        return (
          <div
            key={v.key}
            style={{
              flex: 1,
              minWidth: 0,
              background: bg,
              border: border,
              borderRadius: 5,
              padding: "2px 3px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              boxSizing: "border-box",
              transition: "background 0.2s ease, border-color 0.2s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                fontSize: 8.5,
                fontFamily: FONT,
                color: isAlert ? alertColor : C.textDim,
                fontWeight: 600,
                lineHeight: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
              }}
            >
              {v.icon && <span style={{ flexShrink: 0, display: "inline-flex" }}>{v.icon}</span>}
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{v.label}</span>
            </div>

            <div
              style={{
                fontSize: v.value && v.value.length > 5 ? 11 : 12.5,
                fontWeight: 700,
                fontFamily: CODE,
                color: isAlert ? alertColor : C.white,
                lineHeight: 1.15,
                marginTop: 2,
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
              }}
            >
              {v.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
