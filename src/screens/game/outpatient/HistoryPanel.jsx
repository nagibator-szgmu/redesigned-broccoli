import { useState } from "react";
import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { useTranslate } from "../../../locale/useTranslate";

/** Anamnesis + examination panel with clickable anamnesis buttons (FR-Р.2.1/Р.2.2) */
export function HistoryPanel({ cd, onReveal }) {
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
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 12 }}>
      {cd.historyOfIllness && (
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => handleReveal("illness")}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, border: `1px solid ${showIllness ? C.green : C.border}`, background: showIllness ? `${C.green}10` : "transparent", cursor: "pointer", fontFamily: FONT }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: showIllness ? C.green : C.accent }}>{t("history.illness")}</span>
            <span style={{ fontSize: 12, color: showIllness ? C.green : C.textDim }}>{showIllness ? "▼" : "▶"}</span>
          </button>
          {showIllness && (
            <p style={{ fontSize: 13, color: C.text, fontFamily: FONT, lineHeight: 1.7, margin: 0, padding: "10px 14px", background: `${C.textDim}08`, borderRadius: 10, borderLeft: `3px solid ${C.green}`, marginTop: 8 }}>{cd.historyOfIllness}</p>
          )}
        </div>
      )}
      {cd.lifeHistory && (
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => handleReveal("life")}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, border: `1px solid ${showLife ? C.green : C.border}`, background: showLife ? `${C.green}10` : "transparent", cursor: "pointer", fontFamily: FONT }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: showLife ? C.green : C.accent }}>{t("history.life")}</span>
            <span style={{ fontSize: 12, color: showLife ? C.green : C.textDim }}>{showLife ? "▼" : "▶"}</span>
          </button>
          {showLife && (
            <p style={{ fontSize: 13, color: C.text, fontFamily: FONT, lineHeight: 1.7, margin: 0, padding: "10px 14px", background: `${C.textDim}08`, borderRadius: 10, borderLeft: `3px solid ${C.green}`, marginTop: 8 }}>{cd.lifeHistory}</p>
          )}
        </div>
      )}
      <div style={{ fontSize: 12, fontWeight: 600, color: C.accent, fontFamily: FONT, marginBottom: 8 }}>{t("history.exam")}</div>
      <p style={{ fontSize: 13, color: C.text, fontFamily: FONT, lineHeight: 1.7, margin: 0 }}>{cd.exam}</p>
    </div>
  );
}
