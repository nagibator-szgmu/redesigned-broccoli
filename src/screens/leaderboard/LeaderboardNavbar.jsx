import React from "react";
import { FONT, SER } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { HeaderBackBtn } from "../../ui/components";
import { IconTrophy } from "../../ui/icons";

/** Навигационная шапка экрана лидерборда (адаптивная для десктопа и мобильных) */
export default function LeaderboardNavbar({ setPhase, isMobile = false }) {
  const C = useTheme();

  if (isMobile) {
    return (
      <div style={{ background: C.panel, borderBottom: `1px solid ${C.border}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 10 }}>
        <div
          onClick={() => setPhase("menu")}
          className="icon-btn"
          style={{ width: 26, height: 26, background: `${C.accent}20`, border: `1px solid ${C.accent}44`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <span style={{ fontFamily: SER, fontSize: 13, color: C.accent, fontStyle: "italic", fontWeight: 700 }}>М</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconTrophy size={16} color={C.yellow} />
          <span style={{ fontSize: 14, fontWeight: 700, color: C.white, fontFamily: FONT }}>Достижения и сертификаты</span>
        </div>
        <div style={{ flex: 1 }} />
        <HeaderBackBtn onClick={() => setPhase("menu")} />
      </div>
    );
  }

  return (
    <div style={{ background: C.panel, borderBottom: `1px solid ${C.border}`, padding: "12px 28px", display: "flex", alignItems: "center", gap: 12 }}>
      <div
        onClick={() => setPhase("menu")}
        className="icon-btn"
        style={{ width: 28, height: 28, background: `${C.accent}20`, border: `1px solid ${C.accent}44`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
      >
        <span style={{ fontFamily: SER, fontSize: 14, color: C.accent, fontStyle: "italic", fontWeight: 700 }}>М</span>
      </div>
      <span style={{ fontFamily: SER, fontSize: 16, color: C.accent, fontStyle: "italic", letterSpacing: 1 }}>МедСим</span>
      <div style={{ width: 1, height: 18, background: C.border }} />
      <span style={{ fontSize: 13, color: C.textDim, fontFamily: FONT }}>Достижения и сертификаты</span>
      <div style={{ flex: 1 }} />
      <HeaderBackBtn onClick={() => setPhase("menu")} />
    </div>
  );
}
