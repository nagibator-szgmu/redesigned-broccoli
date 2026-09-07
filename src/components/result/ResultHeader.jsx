import { FONT, SER } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { Btn } from "../../ui/components";
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
      <div onClick={() => setPhase("menu")} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
        <PillEmblem size={isMobile ? 26 : 28} />
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
