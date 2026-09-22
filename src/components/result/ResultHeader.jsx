import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { HeaderBackBtn } from "../../ui/components";
import PillEmblem from "../../ui/PillEmblem";

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
      <div onClick={() => setPhase("menu")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
        <PillEmblem size={isMobile ? 24 : 26} />
        <span style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, color: C.white, fontFamily: FONT, letterSpacing: -0.3 }}>
          {t("brand.name")}
        </span>
      </div>
      <div style={{ width: 1, height: isMobile ? 14 : 18, background: C.border }} />
      <span style={{ fontSize: isMobile ? 11 : 13, color: C.textDim, fontFamily: FONT }}>{t("result.header")}</span>
      <div style={{ flex: 1 }} />
      <HeaderBackBtn onClick={() => setPhase("menu")} label={t("result.menu")} isMobile={isMobile} />
    </div>
  );
}
