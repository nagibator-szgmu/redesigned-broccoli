import { useState } from "react";
import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";

/**
 * Patient history panel for stationary — anamnesis buttons + examination.
 * FR-Р.2.1/Р.2.2: Clicking reveals pre-written text (not manual input).
 * FR-Р.3.1: Skipping anamnesis reduces score (tracked via onReveal callback).
 */
export default function StationaryHistoryPanel({ cd, onReveal }) {
  const C = useTheme();
  const { t } = useTranslate();
  const [showIllness, setShowIllness] = useState(false);
  const [showLife, setShowLife] = useState(false);

  const handleReveal = (type) => {
    if (type === "illness" && !showIllness) {
      setShowIllness(true);
      onReveal && onReveal("historyOfIllness");
    }
    if (type === "life" && !showLife) {
      setShowLife(true);
      onReveal && onReveal("lifeHistory");
    }
  };

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
      {cd.historyOfIllness && (
        <div style={{ marginBottom: 10 }}>
          <button onClick={() => handleReveal("illness")}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, border: `1px solid ${showIllness ? C.green : C.border}`, background: showIllness ? `${C.green}10` : "transparent", cursor: "pointer", fontFamily: FONT }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: showIllness ? C.green : C.accent, fontFamily: FONT }}>{t("history.illness")}</span>
            <span style={{ fontSize: 10, color: showIllness ? C.green : C.textDim }}>{showIllness ? "▼" : "▶"}</span>
          </button>
          {showIllness && (
            <p style={{ fontSize: 12, color: C.text, fontFamily: FONT, lineHeight: 1.6, margin: 0, padding: "8px 10px", background: `${C.textDim}08`, borderRadius: 8, borderLeft: `3px solid ${C.green}`, marginTop: 6 }}>{cd.historyOfIllness}</p>
          )}
        </div>
      )}
      {cd.lifeHistory && (
        <div style={{ marginBottom: 10 }}>
          <button onClick={() => handleReveal("life")}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, border: `1px solid ${showLife ? C.green : C.border}`, background: showLife ? `${C.green}10` : "transparent", cursor: "pointer", fontFamily: FONT }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: showLife ? C.green : C.accent, fontFamily: FONT }}>{t("history.life")}</span>
            <span style={{ fontSize: 10, color: showLife ? C.green : C.textDim }}>{showLife ? "▼" : "▶"}</span>
          </button>
          {showLife && (
            <p style={{ fontSize: 12, color: C.text, fontFamily: FONT, lineHeight: 1.6, margin: 0, padding: "8px 10px", background: `${C.textDim}08`, borderRadius: 8, borderLeft: `3px solid ${C.green}`, marginTop: 6 }}>{cd.lifeHistory}</p>
          )}
        </div>
      )}
      <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, fontFamily: FONT, marginBottom: 6 }}>{t("history.exam")}</div>
      <p style={{ fontSize: 12, color: C.text, fontFamily: FONT, lineHeight: 1.6, margin: 0 }}>{cd.exam}</p>
    </div>
  );
}
