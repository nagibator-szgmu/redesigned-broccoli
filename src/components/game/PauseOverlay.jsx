import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";

export default function PauseOverlay({ onResume }) {
  const C = useTheme();
  const { t } = useTranslate();

  return (
    <div onClick={onResume} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexDirection: "column", gap: 12 }}>
      <span style={{ fontSize: 48 }}>⏸</span>
      <span style={{ fontSize: 18, fontWeight: 700, color: C.yellow, fontFamily: FONT }}>{t("game.paused")}</span>
      <span style={{ fontSize: 12, color: C.textDim, fontFamily: FONT }}>{t("game.tapToResume")}</span>
    </div>
  );
}
