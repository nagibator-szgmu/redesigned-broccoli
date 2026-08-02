import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";

export default function DiagnosisBlock({ result, cd, diagText, isMobile }) {
  const C = useTheme();
  const { t } = useTranslate();

  const diagColor = result.diagCorrect ? C.green : result.diagPartial ? C.yellow : C.red;

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 10 }}>
      <STitle icon="🎯" label={t("result.diagnosis")} color={diagColor} />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 8 : 16 }}>
        <div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: C.textDim, marginBottom: isMobile ? 4 : 5, textTransform: "uppercase", fontFamily: FONT }}>{t("result.yourAnswer")}</div>
          <div style={{ color: diagColor, fontSize: 13, lineHeight: 1.6, fontFamily: FONT }}>
            {diagText || <span style={{ color: C.textDim, fontStyle: "italic" }}>{t("result.notProvided")}</span>}
          </div>
        </div>
        <div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: C.textDim, marginBottom: isMobile ? 4 : 5, textTransform: "uppercase", fontFamily: FONT }}>{t("result.correctDiag")}</div>
          <div style={{ color: C.green, fontSize: 13, lineHeight: 1.6, fontFamily: FONT }}>{cd.diagnosis}</div>
        </div>
      </div>
    </div>
  );
}
