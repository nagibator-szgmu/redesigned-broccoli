import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";
import { IconTarget } from "../../ui/icons";

function cleanDiagString(str) {
  if (!str || typeof str !== "string") return "";
  return str.replace(/^["'«»\s]+|["'«»\s]+$/g, "").replace(/\\"/g, '"').trim();
}

function renderFormattedDiagnosis(text) {
  if (!text) return null;
  let parsed = null;
  if (typeof text === "object") {
    parsed = text;
  } else if (typeof text === "string") {
    let trimmed = text.trim();
    while ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      trimmed = trimmed.slice(1, -1).trim();
    }
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        // ignore
      }
    }
    if (!parsed) {
      const clean = cleanDiagString(trimmed);
      return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : null;
    }
  }

  if (parsed && typeof parsed === "object") {
    const main = cleanDiagString(parsed.main);
    const comp = cleanDiagString(parsed.complication);
    const comorb = cleanDiagString(parsed.comorbidity);
    if (!main && !comp && !comorb) return null;
    if (!comp && !comorb) {
      return main.charAt(0).toUpperCase() + main.slice(1);
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {main && (
          <div>
            <span style={{ opacity: 0.75, fontSize: 11, marginRight: 4 }}>Основной:</span>
            <span style={{ fontWeight: 600 }}>{main.charAt(0).toUpperCase() + main.slice(1)}</span>
          </div>
        )}
        {comp && (
          <div>
            <span style={{ opacity: 0.75, fontSize: 11, marginRight: 4 }}>Осложнение:</span>
            <span>{comp.charAt(0).toUpperCase() + comp.slice(1)}</span>
          </div>
        )}
        {comorb && (
          <div>
            <span style={{ opacity: 0.75, fontSize: 11, marginRight: 4 }}>Сопутствующий:</span>
            <span>{comorb.charAt(0).toUpperCase() + comorb.slice(1)}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
}

export default function DiagnosisBlock({ result, cd, diagText, isMobile }) {
  const C = useTheme();
  const { t } = useTranslate();

  const diagColor = result.diagCorrect ? C.green : result.diagPartial ? C.yellow : C.red;
  const formattedUser = renderFormattedDiagnosis(diagText);
  const formattedRef = renderFormattedDiagnosis(cd?.diagnosis);

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 10 }}>
      <STitle icon={<IconTarget size={15} color={diagColor} />} label={t("result.diagnosis")} color={diagColor} />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 8 : 16 }}>
        <div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: C.textDim, marginBottom: isMobile ? 4 : 5, textTransform: "uppercase", fontFamily: FONT }}>{t("result.yourAnswer")}</div>
          <div style={{ color: diagColor, fontSize: 13, lineHeight: 1.6, fontFamily: FONT }}>
            {formattedUser || <span style={{ color: C.textDim, fontStyle: "italic" }}>{t("result.notProvided")}</span>}
          </div>
        </div>
        <div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: C.textDim, marginBottom: isMobile ? 4 : 5, textTransform: "uppercase", fontFamily: FONT }}>{t("result.correctDiag")}</div>
          <div style={{ color: C.green, fontSize: 13, lineHeight: 1.6, fontFamily: FONT }}>
            {formattedRef}
          </div>
        </div>
      </div>
    </div>
  );
}
