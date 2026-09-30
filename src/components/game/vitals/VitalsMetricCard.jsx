import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";
import { IconTrendingUp, IconTrendingDown } from "../../../ui/icons";

/**
 * Индивидуальная карточка телеметрии для VitalsHUD.
 * Цифры 18–19 px (tabular-nums), подписи 11 px, акцентный левый бордер при отклонениях.
 */
export default function VitalsMetricCard({
  label,
  value,
  unit = "",
  trend = 0,
  warn = false,
  critical = false,
  icon,
  onClick,
  compact = false,
  style = {},
}) {
  const C = useTheme();

  const statusColor = critical ? C.red : warn ? C.yellow : C.text;
  const isAlert = warn || critical;
  const bg = critical ? `${C.red}15` : warn ? `${C.yellow}10` : C.panelBg2;
  const borderLeft = isAlert ? `3px solid ${critical ? C.red : C.yellow}` : `1px solid ${C.border}`;

  // Отслеживание числовой динамики показателя
  const numericPart = parseFloat(String(value).replace(",", "."));
  const prevNumRef = useRef(numericPart);
  const [delta, setDelta] = useState(null);

  useEffect(() => {
    if (!isNaN(numericPart) && prevNumRef.current !== undefined) {
      const diff = Math.round((numericPart - prevNumRef.current) * 10) / 10;
      if (diff !== 0 && Math.abs(diff) >= 0.2) {
        setDelta(diff);
        const timer = setTimeout(() => setDelta(null), 1000);
        prevNumRef.current = numericPart;
        return () => clearTimeout(timer);
      }
    }
    prevNumRef.current = numericPart;
  }, [numericPart]);

  return (
    <div
      onClick={onClick}
      style={{
        background: bg,
        border: `1px solid ${C.border}`,
        borderLeft: borderLeft,
        borderRadius: compact ? 6 : 8,
        padding: compact ? "4px 6px" : "6px 10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        minWidth: compact ? 56 : 76,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
        <span
          style={{
            fontSize: compact ? 10 : 11,
            color: isAlert ? (critical ? C.red : C.yellow) : C.textDim,
            fontFamily: FONT,
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: 0.2,
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          {icon && <span>{icon}</span>}
          {label}
        </span>

        {/* Индикатор изменения: дельта при тике или тренд */}
        {delta !== null ? (
          <span
            style={{
              fontSize: 9,
              fontFamily: CODE,
              fontWeight: 700,
              color: delta > 0 ? (warn || critical ? C.red : C.green) : C.yellow,
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {delta > 0 ? <IconTrendingUp size={9} /> : <IconTrendingDown size={9} />}
            {delta > 0 ? `+${delta}` : delta}
          </span>
        ) : trend !== 0 ? (
          <span style={{ fontSize: 9, color: trend > 0 ? (warn || critical ? statusColor : C.green) : C.accent, fontWeight: 700 }}>
            {trend > 0 ? <IconTrendingUp size={9} /> : <IconTrendingDown size={9} />}
          </span>
        ) : null}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span
          style={{
            fontSize: compact ? 14 : 18.5,
            fontWeight: 700,
            color: isAlert ? statusColor : C.white,
            fontFamily: CODE,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: compact ? 8 : 10, color: C.textDim, fontFamily: FONT, fontWeight: 500 }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
