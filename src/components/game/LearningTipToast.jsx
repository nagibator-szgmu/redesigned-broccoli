import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";

export default function LearningTipToast({ tip, isMobile }) {
  const C = useTheme();

  return (
    <div style={{
      position: "fixed",
      bottom: isMobile ? 64 : 20,
      ...(isMobile ? { left: 14, right: 14 } : { left: "50%", transform: "translateX(-50%)" }),
      zIndex: 9999, background: C.panelBg, border: `1px solid ${C.yellow}44`,
      borderRadius: 10, padding: isMobile ? "8px 14px" : "8px 18px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.5)", fontFamily: FONT,
      fontSize: isMobile ? 11 : 12, color: C.yellow,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <span>📖</span><span>{tip}</span>
    </div>
  );
}
