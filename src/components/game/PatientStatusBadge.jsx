import { useTheme } from "../../ui/ThemeContext";
import { FONT } from "../../ui/theme";
import { useTranslate } from "../../locale/useTranslate";

/** Standardized patient status indicator for 5 clinical states */
export default function PatientStatusBadge({
  status = "stable",
  size = "md",
  showIcon = true,
  style = {}
}) {
  const C = useTheme();
  const { t } = useTranslate();

  const norm = (status || "").toLowerCase();

  let config = {
    key: "stable",
    label: t("patientStatus.stable") || "Стабильное",
    icon: "🟢",
    color: C.green,
    bg: C.greenDim || `${C.green}18`
  };

  if (norm === "deteriorating" || norm === "unstable" || norm === "worsening") {
    config = {
      key: "deteriorating",
      label: t("patientStatus.deteriorating") || "Ухудшение",
      icon: "🟡",
      color: C.orange || C.yellow,
      bg: `${C.orange || C.yellow}18`
    };
  } else if (norm === "critical" || norm === "severe") {
    config = {
      key: "critical",
      label: t("patientStatus.critical") || "Критическое",
      icon: "🔴",
      color: C.red,
      bg: C.redDim || `${C.red}18`
    };
  } else if (norm === "resuscitated" || norm === "stabilized") {
    config = {
      key: "resuscitated",
      label: t("patientStatus.resuscitated") || "Реанимирован",
      icon: "⚡",
      color: C.purple || C.accent,
      bg: `${C.purple || C.accent}18`
    };
  } else if (norm === "deceased" || norm === "dead" || norm === "fatal") {
    config = {
      key: "deceased",
      label: t("patientStatus.deceased") || "Летальный исход",
      icon: "💀",
      color: C.textDim,
      bg: `${C.textDim}18`
    };
  }

  const sizes = {
    sm: { padding: "2px 8px", fontSize: 10, borderRadius: 6, gap: 4 },
    md: { padding: "4px 10px", fontSize: 12, borderRadius: 8, gap: 6 },
    lg: { padding: "6px 14px", fontSize: 13, borderRadius: 10, gap: 8 }
  };

  const sz = sizes[size] || sizes.md;

  return (
    <span
      className="patient-status-badge"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: sz.gap,
        padding: sz.padding,
        fontSize: sz.fontSize,
        borderRadius: sz.borderRadius,
        background: config.bg,
        border: `1px solid ${config.color}44`,
        color: config.color,
        fontWeight: 700,
        fontFamily: FONT,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        ...style
      }}
    >
      {showIcon && <span style={{ fontSize: sz.fontSize }}>{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  );
}
