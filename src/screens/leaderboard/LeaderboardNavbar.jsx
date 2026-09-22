import React from "react";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { HeaderBackBtn } from "../../ui/components";
import { IconTrophy } from "../../ui/icons";
import PillEmblem from "../../ui/PillEmblem";

/** Навигационная шапка экрана лидерборда (адаптивная для десктопа и мобильных) */
export default function LeaderboardNavbar({ setPhase, isMobile = false }) {
  const C = useTheme();
  const { t } = useTranslate();

  if (isMobile) {
    return (
      <div style={{ background: C.panel, borderBottom: `1px solid ${C.border}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 10 }}>
        <HeaderBackBtn onClick={() => setPhase("menu")} label={t("theory.back")} style={{ padding: "6px 8px" }} />
        <div style={{ width: 1, height: 16, background: C.border }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
          <IconTrophy size={16} color={C.yellow} />
          <span style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: FONT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Достижения и сертификаты
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.panel, borderBottom: `1px solid ${C.border}`, padding: "12px 28px", display: "flex", alignItems: "center", gap: 12 }}>
      <HeaderBackBtn onClick={() => setPhase("menu")} label={t("theory.back")} />
      <div style={{ width: 1, height: 18, background: C.border }} />
      <div
        onClick={() => setPhase("menu")}
        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
      >
        <PillEmblem size={26} />
        <span style={{ fontSize: 16, fontWeight: 700, color: C.white, fontFamily: FONT, letterSpacing: -0.3 }}>
          {t("brand.name")}
        </span>
      </div>
      <div style={{ width: 1, height: 18, background: C.border }} />
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <IconTrophy size={16} color={C.yellow} />
        <span style={{ fontSize: 13, color: C.textDim, fontFamily: FONT }}>
          Достижения и сертификаты
        </span>
      </div>
    </div>
  );
}
