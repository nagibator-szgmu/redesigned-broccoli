import React from "react";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";
import { FONT, CODE } from "../../../ui/theme";
import { IconAlertTriangle } from "../../../ui/icons";

/**
 * Протокол отмены / отказа лаборатории при отсутствии субстрата или противопоказаниях.
 */
export default function LabCancellationCard({ meta, rawResult = "", isNew = false }) {
  const C = useTheme();
  const { t } = useTranslate();
  const cleanNotice = rawResult.replace(/^🔴\s*/, "").replace(/^[\u{1F7E1}\u{26A0}]\s*/u, "").trim();

  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${C.red || "#EF4444"}40`,
        borderRadius: 8,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginBottom: 8,
        animation: isNew ? "fadeIn 0.35s ease" : "none",
        boxShadow: "0 4px 16px -4px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1px solid ${C.border}`, paddingBottom: 6 }}>
        <div>
          <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.text }}>
            {meta?.title || "Лабораторный протокол"}
          </div>
          <div style={{ fontFamily: CODE, fontSize: 11, color: C.subText, marginTop: 2 }}>
            {t("lab.sampleNotCollected") || "Биоматериал: не получен (отсутствует субстрат / противопоказания)"}
          </div>
        </div>
        <span style={{ fontFamily: CODE, fontSize: 11, color: C.red || "#EF4444", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {t("component.cancelledShort") || "Не выполнено"}
        </span>
      </div>

      <div
        style={{
          background: `${C.red || "#EF4444"}0d`,
          border: `1px solid ${C.red || "#EF4444"}30`,
          borderRadius: 6,
          padding: "10px 12px",
          fontSize: 12.5,
          fontFamily: FONT,
          color: C.text,
          lineHeight: 1.5,
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <div style={{ flexShrink: 0, marginTop: 1 }}>
          <IconAlertTriangle size={16} color={C.red || "#EF4444"} />
        </div>
        <div>{cleanNotice}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 2 }}>
        <span style={{ fontFamily: CODE, fontSize: 10, color: C.subText }}>
          {t("lab.cancelledSafetyProtocol") || "Протокол отмены: процедура остановлена в соответствии со стандартами безопасности"}
        </span>
      </div>
    </div>
  );
}
