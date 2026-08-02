import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";

export default function ProtocolReferences({ protocols, setPhase, isMobile }) {
  const C = useTheme();
  const { t } = useTranslate();

  if (!protocols.length) return null;

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 10 }}>
      <STitle icon="📋" label={t("protocols.title")} color={C.accent} />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: isMobile ? 8 : 10 }}>
        {protocols.map(p => (
          <div key={p.id} onClick={() => setPhase("theory")} style={{ background: `${p.color}08`, border: `1px solid ${p.color}33`, borderRadius: isMobile ? 8 : 10, padding: isMobile ? "10px 12px" : "12px 14px", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: isMobile ? 4 : 6 }}>
              <span style={{ fontSize: isMobile ? 16 : 18 }}>{p.icon}</span>
              <span style={{ fontSize: 13, color: p.color, fontWeight: 600, fontFamily: FONT }}>{p.name}</span>
            </div>
            <div style={{ fontSize: 11, color: C.textDim, fontFamily: FONT, marginBottom: isMobile ? 6 : 8 }}>{t("protocols.source")}: {p.source}</div>
            {p.keyPoints.slice(0, 3).map((kp, i) => (
              <div key={i} style={{ fontSize: isMobile ? 11 : 12, color: C.text, lineHeight: 1.5, fontFamily: FONT, paddingLeft: 12, paddingBottom: 2 }}>• {kp}</div>
            ))}
            <div style={{ fontSize: 11, color: C.accent, marginTop: isMobile ? 6 : 8, fontFamily: FONT }}>→ {t("protocols.keyPoints")}: {p.keyPoints.length}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
