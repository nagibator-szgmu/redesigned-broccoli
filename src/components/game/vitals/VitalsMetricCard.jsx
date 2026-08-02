import { useTheme } from "../../../ui/ThemeContext";
import { FONT, CODE } from "../../../ui/theme";

/** Individual telemetry card subcomponent for VitalsHUD */
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
  style = {}
}) {
  const C = useTheme();

  const statusColor = critical ? C.red : warn ? C.yellow : C.accent;
  const bg = critical ? `${C.red}18` : warn ? `${C.yellow}14` : `${C.accent}0a`;
  const border = critical ? `${C.red}55` : warn ? `${C.yellow}44` : "rgba(0,230,200,0.12)";

  return (
    <div
      onClick={onClick}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: compact ? 8 : 10,
        padding: compact ? "4px 8px" : "6px 10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        minWidth: compact ? 60 : 75,
        ...style
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{ fontSize: 9, color: C.textDim, fontFamily: FONT, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {icon && <span style={{ marginRight: 3 }}>{icon}</span>}
          {label}
        </span>
        {trend !== 0 && (
          <span style={{ fontSize: 8, color: trend > 0 ? (warn || critical ? statusColor : C.green) : C.blue, fontWeight: 700 }}>
            {trend > 0 ? "▲" : "▼"}
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
        <span style={{ fontSize: compact ? 13 : 15, fontWeight: 700, color: statusColor, fontFamily: CODE, lineHeight: 1 }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: 9, color: C.textDim, fontFamily: FONT }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
