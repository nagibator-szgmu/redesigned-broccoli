import React from "react";
import { useTheme } from "../../ui/ThemeContext";
import { FONT, RADIUS } from "../../ui/theme";
import { useTranslate } from "../../locale/useTranslate";
import { IconCardiac, IconSkull } from "../../ui/icons";

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
    icon: <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, display: "inline-block", boxShadow: `0 0 6px ${C.green}` }} />,
    color: C.green,
    bg: `${C.green}18`
  };

  if (norm === "deteriorating" || norm === "unstable" || norm === "worsening") {
    config = {
      key: "deteriorating",
      label: t("patientStatus.deteriorating") || "Ухудшение",
      icon: <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.yellow, display: "inline-block", boxShadow: `0 0 6px ${C.yellow}` }} />,
      color: C.yellow,
      bg: `${C.yellow}18`
    };
  } else if (norm === "critical" || norm === "severe") {
    config = {
      key: "critical",
      label: t("patientStatus.critical") || "Критическое",
      icon: <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.red, display: "inline-block", boxShadow: `0 0 6px ${C.red}` }} />,
      color: C.red,
      bg: `${C.red}18`
    };
  } else if (norm === "resuscitated" || norm === "stabilized") {
    config = {
      key: "resuscitated",
      label: t("patientStatus.resuscitated") || "Реанимирован",
      icon: <IconCardiac size={12} color={C.purple} />,
      color: C.purple,
      bg: `${C.purple}18`
    };
  } else if (norm === "deceased" || norm === "dead" || norm === "fatal") {
    config = {
      key: "deceased",
      label: t("patientStatus.deceased") || "Летальный исход",
      icon: <IconSkull size={12} color={C.textDim} />,
      color: C.textDim,
      bg: `${C.textDim}18`
    };
  }

  const sizes = {
    sm: { padding: "2px 8px", fontSize: 10, borderRadius: RADIUS.xs, gap: 4 },
    md: { padding: "4px 10px", fontSize: 11.5, borderRadius: RADIUS.xs, gap: 6 },
    lg: { padding: "6px 14px", fontSize: 13, borderRadius: RADIUS.sm, gap: 8 }
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: currentSize.gap,
        padding: currentSize.padding,
        borderRadius: currentSize.borderRadius,
        background: config.bg,
        border: `1px solid ${config.color}40`,
        color: config.color,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: currentSize.fontSize,
        letterSpacing: 0.2,
        lineHeight: 1,
        ...style
      }}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </div>
  );
}
