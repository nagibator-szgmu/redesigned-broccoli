import React from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { FONT } from "../../../ui/theme";
import { useTranslate } from "../../../locale/useTranslate";
import { IconUser } from "../../../ui/icons";

/** Паспортная карточка пациента с индикатором тяжести состояния */
export default function PatientIdentityCard({ cd, compact = false }) {
  const C = useTheme();
  const { t } = useTranslate();

  const isCrit = cd?.severity === "critical";
  const sevColor = isCrit ? C.red : cd?.severity === "moderate" ? C.yellow : C.green;

  return (
    <div
      style={{
        background: C.panelBg,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: compact ? "6px 10px" : "12px 14px",
        minHeight: compact ? 42 : 74,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: compact ? 8 : 12 }}>
        <div
          style={{
            width: compact ? 26 : 36,
            height: compact ? 26 : 36,
            borderRadius: compact ? 6 : 8,
            background: `${sevColor}18`,
            border: `1.5px solid ${sevColor}55`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <IconUser size={compact ? 14 : 18} color={sevColor} />
        </div>
        <div>
          <div
            data-testid="patient-card-name"
            style={{
              fontSize: compact ? 13 : 16,
              fontWeight: 600,
              color: C.white,
              fontFamily: FONT,
              lineHeight: 1.2,
            }}
          >
            {cd?.name}
          </div>
          <div style={{ fontSize: compact ? 10.5 : 13, color: C.textDim, fontFamily: FONT, marginTop: 1, fontWeight: 400 }}>
            {cd?.gender === "М" ? "Мужчина" : "Женщина"}, {cd?.age} {t("cases.ageSuffix")}
          </div>
        </div>
      </div>
      <span
        style={{
          background: isCrit ? C.red : `${sevColor}22`,
          border: isCrit ? `1px solid ${C.red}` : `1px solid ${sevColor}44`,
          borderRadius: 6,
          padding: compact ? "2px 6px" : "3px 8px",
          fontSize: compact ? 10.5 : 12.5,
          color: isCrit ? "#FFFFFF" : sevColor,
          fontWeight: 600,
          fontFamily: FONT,
          whiteSpace: "nowrap",
        }}
      >
        {cd?.severity ? t(`severity.${cd.severity}`) : ""}
      </span>
    </div>
  );
}
