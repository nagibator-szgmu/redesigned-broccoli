import React from "react";
import { FONT } from "../../../ui/theme";
import { useTheme } from "../../../ui/ThemeContext";
import { STATUS_CONFIG, ABCDE_TABS, formatTime } from "./abcdeEngine";

/** Сводка выявленных параметров по первичному осмотру ABCDE */
export default function ABCDESummaryView({ statuses, results, criticalFindings }) {
  const C = useTheme();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, fontFamily: FONT }}>
      <div style={{ fontWeight: 600, color: C.white, borderBottom: `1px solid ${C.border}`, paddingBottom: 4 }}>
        Клинический протокол первичного осмотра (Summary):
      </div>
      {ABCDE_TABS.map((t) => {
        const st = STATUS_CONFIG[statuses[t.key]];
        const sectionSteps = Object.values(results).filter((r) => r.section === t.key);
        return (
          <div key={t.key} style={{ padding: "6px 8px", borderRadius: 8, background: C.btnBg, border: `1px solid ${C.btnBorder}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <strong>{t.label}: {t.title}</strong>
              <span style={{ fontSize: 9, padding: "1px 4px", borderRadius: 4, background: st.bg, color: st.text, border: `1px solid ${st.border}` }}>
                {st.label}
              </span>
            </div>
            {sectionSteps.length > 0 ? (
              sectionSteps.map((s, i) => (
                <div key={i} style={{ fontSize: 11, color: s.isCritical ? C.red : s.isAbnormal ? C.yellow : C.textDim }}>
                  • {s.action}: {s.details} <span style={{ fontSize: 9, opacity: 0.7 }}>({formatTime(s.timestamp)})</span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 10, color: C.textDim, fontStyle: "italic" }}>Действия не выполнялись</div>
            )}
          </div>
        );
      })}
      {criticalFindings.length > 0 && (
        <div style={{ marginTop: 4, padding: "8px", borderRadius: 8, background: "rgba(255,61,90,0.1)", border: `1px solid rgba(255,61,90,0.3)` }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 11, marginBottom: 4 }}>⚠️ Выявленные критические находки:</div>
          {criticalFindings.map((f, idx) => (
            <div key={idx} style={{ fontSize: 11, color: C.white, marginBottom: 2 }}>
              • [{f.section}] {f.action} — {f.details}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
