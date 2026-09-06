import { useState } from "react";
import { FONT } from "./theme";
import { useTheme } from "./ThemeContext";
import { DIAGNOSTICS, DIAGNOSTIC_REFS, CAT_COLOR } from "../data/diagnostics";
import DicomViewer from "../components/game/DicomViewer";
import Tooltip from "./Tooltip";

export default function ResultCard({ id, text, isNew, cd }) {
  const C = useTheme();
  const [showDicom, setShowDicom] = useState(false);
  const diag = DIAGNOSTICS.find(d => d.id === id);
  const meta = DIAGNOSTIC_REFS?.[id] || {};
  const color = CAT_COLOR[diag?.cat] || C.accent;
  const isCritical = text.startsWith("🔴") || text.toLowerCase().includes("критич") || text.toLowerCase().includes("патолог");
  const isAbnormal = isCritical || text.includes("↑") || text.includes("↓") || text.toLowerCase().includes("повыш") || text.toLowerCase().includes("сниж");
  const isDicom = ["ct_head", "mri"].includes(id);

  const statusBadge = isCritical ? (
    <span style={{ fontSize: 9, color: C.red, background: `${C.red}18`, border: `1px solid ${C.red}40`, borderRadius: 4, padding: "1px 6px", fontFamily: FONT, fontWeight: 700 }}>
      КРИТИЧНО
    </span>
  ) : isAbnormal ? (
    <span style={{ fontSize: 9, color: C.yellow, background: `${C.yellow}18`, border: `1px solid ${C.yellow}40`, borderRadius: 4, padding: "1px 6px", fontFamily: FONT, fontWeight: 700 }}>
      ОТКЛОНЕНИЕ
    </span>
  ) : (
    <span style={{ fontSize: 9, color: C.green, background: `${C.green}18`, border: `1px solid ${C.green}40`, borderRadius: 4, padding: "1px 6px", fontFamily: FONT, fontWeight: 700 }}>
      НОРМА
    </span>
  );

  return (
    <Tooltip
      title={diag?.name || id}
      refRange={meta.refRange ? `Норма: ${meta.refRange}` : null}
      text={`Исследование категории: ${diag?.cat || "лаб"}.`}
      details={meta}
      position="top"
      style={{ width: "100%", display: "block" }}
    >
      <div className="treat-row" style={{
        background: isCritical ? `linear-gradient(135deg, ${C.red}0d, ${C.red}05)` : `linear-gradient(135deg, ${C.panel2}b3, ${C.panel2}66)`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: `1px solid ${isCritical ? `${C.red}3b` : `${color}22`}`,
        borderRadius: 12,
        padding: "12px 14px",
        marginBottom: 8,
        boxShadow: "0 4px 20px -4px rgba(0,0,0,0.3)",
        animation: isNew ? "fadeIn 0.4s ease" : "none",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: isCritical ? C.red : color, flexShrink: 0 }} />
          <span style={{ fontSize: 11.5, color, fontFamily: FONT, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>
            {diag?.name || id}
          </span>
          {statusBadge}
          {isNew && <span style={{ fontSize: 10, color: C.green, fontFamily: FONT, fontWeight: 600 }}>● новый</span>}
          {isDicom && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowDicom(true); }}
              style={{
                background: `${color}18`, border: `1px solid ${color}33`,
                borderRadius: 8, padding: "2px 7px", color, fontSize: 10, cursor: "pointer",
                fontFamily: FONT, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4,
                marginLeft: "auto", transition: "all 0.15s"
              }}
            >
              📷 PACS Снимки
            </button>
          )}
        </div>

        <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.6, fontFamily: FONT }}>
          {text.replace("🔴 ", "")}
        </div>

        {meta.refRange && (
          <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 10, fontSize: 10, color: C.textDim, fontFamily: FONT }}>
            <span><strong>Референс:</strong> {meta.refRange}</span>
            {meta.unit && <span><strong>Ед.:</strong> {meta.unit}</span>}
            {meta.sample && <span><strong>Материал:</strong> {meta.sample}</span>}
          </div>
        )}

        {showDicom && <DicomViewer cd={cd} onClose={() => setShowDicom(false)} />}
      </div>
    </Tooltip>
  );
}
