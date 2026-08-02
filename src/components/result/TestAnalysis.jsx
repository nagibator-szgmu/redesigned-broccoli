import { FONT } from "../../ui/theme";
import { useTheme } from "../../ui/ThemeContext";
import { useTranslate } from "../../locale/useTranslate";
import { STitle } from "../../ui/components";
import { DIAGNOSTICS, MISSED_TEST_REASONS } from "../../data/diagnostics";

export default function TestAnalysis({ cd, orderedDiag, isMobile }) {
  const C = useTheme();
  const { t } = useTranslate();

  const missedCritical = cd.needDiag.filter(id => !orderedDiag.includes(id));
  const extraTests = orderedDiag.filter(id => !cd.needDiag.includes(id));

  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: isMobile ? 12 : 14, padding: isMobile ? 14 : 16, marginBottom: 10 }}>
      <STitle icon="🧪" label={t("result.testAnalysis")} color={C.accent} />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 8 : 12 }}>
        <div>
          <div style={{ fontSize: isMobile ? 11 : 12, color: C.textDim, marginBottom: isMobile ? 5 : 6, textTransform: "uppercase", fontFamily: FONT }}>{t("result.ordered")}</div>
          {cd.needDiag.map(id => {
            const done = orderedDiag.includes(id);
            const name = DIAGNOSTICS.find(d => d.id === id)?.name || id;
            return <div key={id} style={{ fontSize: 13, color: done ? C.green : C.red, marginBottom: 3, fontFamily: FONT }}>{done ? "✓" : "✗"} {name}</div>;
          })}
          {extraTests.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: isMobile ? 11 : 12, color: C.textDim, marginBottom: 4, fontFamily: FONT }}>{t("result.extra")}</div>
              {extraTests.map(id => (
                <div key={id} style={{ fontSize: 12, color: C.textDim, marginBottom: 2, fontFamily: FONT }}>· {DIAGNOSTICS.find(d => d.id === id)?.name || id}</div>
              ))}
            </div>
          )}
        </div>
        <div>
          {missedCritical.length > 0 && (
            <>
              <div style={{ fontSize: isMobile ? 11 : 12, color: C.red, marginBottom: isMobile ? 5 : 6, textTransform: "uppercase", fontFamily: FONT }}>{t("result.missedCritical")}</div>
              {missedCritical.map(id => {
                const name = DIAGNOSTICS.find(d => d.id === id)?.name || id;
                const reason = MISSED_TEST_REASONS[id];
                return (
                  <div key={id} style={{ background: C.redDim, border: `1px solid ${C.red}33`, borderRadius: 6, padding: "6px 10px", marginBottom: 6 }}>
                    <div style={{ fontSize: 13, color: C.red, marginBottom: reason ? 3 : 0, fontFamily: FONT }}>✗ {name}</div>
                    {reason && <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5, fontFamily: FONT }}>{reason}</div>}
                  </div>
                );
              })}
            </>
          )}
          {missedCritical.length === 0 && <div style={{ color: C.green, fontSize: isMobile ? 12 : 13, fontFamily: FONT }}>{t("result.allKey")}</div>}
        </div>
      </div>
    </div>
  );
}
