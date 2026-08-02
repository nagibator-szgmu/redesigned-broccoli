import { FONT, SER } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { Btn } from "../../ui/components";

export default function ResultHeader({ setPhase, isMobile }) {
  const C = useTheme();
  const { t } = useTranslate();

  return (
    <div style={{
      background: C.panel, borderBottom: `1px solid ${C.border}`,
      padding: isMobile ? "10px 16px" : "12px 28px",
      display: "flex", alignItems: "center", gap: isMobile ? 10 : 12,
      ...(isMobile ? { position: "sticky", top: 0, zIndex: 10 } : {}),
    }}>
      <div
        onClick={() => setPhase("menu")}
        className="icon-btn"
        style={{
          width: isMobile ? 26 : 28, height: isMobile ? 26 : 28,
          background: `${C.accent}20`, border: `1px solid ${C.accent}44`,
          borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}
      >
        <span style={{ fontFamily: SER, fontSize: isMobile ? 13 : 14, color: C.accent, fontStyle: "italic", fontWeight: 700 }}>М</span>
      </div>
      <span style={{ fontFamily: SER, fontSize: isMobile ? 14 : 16, color: C.accent, fontStyle: "italic", letterSpacing: 1 }}>{t("brand.name")}</span>
      <div style={{ width: 1, height: isMobile ? 14 : 18, background: C.border }} />
      <span style={{ fontSize: isMobile ? 11 : 13, color: C.textDim, fontFamily: FONT }}>{t("result.header")}</span>
      <div style={{ flex: 1 }} />
      <Btn onClick={() => setPhase("menu")} color={C.textDim} style={{ padding: isMobile ? "5px 12px" : "7px 16px", fontSize: isMobile ? 11 : 12 }}>
        {isMobile ? "🏠" : t("result.menu")}
      </Btn>
    </div>
  );
}
