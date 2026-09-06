import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { FONT, CODE } from "./theme";
import { useTheme } from "./ThemeContext";

/**
 * Renders extended details for drugs or diagnostics
 */
function TooltipDetails({ details, coords, C, onLeave, timerRef }) {
  return createPortal(
    <div
      onMouseEnter={() => clearTimeout(timerRef.current)}
      onMouseLeave={onLeave}
      style={{
        position: "fixed", top: coords.top, left: coords.left, zIndex: 9999999,
        background: "#08101e", border: `1.5px solid ${C.yellow || "#f59e0b"}`,
        color: "#ffffff", padding: "12px 14px", borderRadius: 12, fontSize: 11.5,
        lineHeight: 1.5, width: 290, maxWidth: "calc(100vw - 24px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.98), 0 0 24px rgba(245,158,11,0.3)",
        animation: "fadeIn 0.15s ease", fontFamily: FONT,
      }}
    >
      <div style={{
        fontSize: 11, fontWeight: 800, color: C.yellow || "#f59e0b",
        textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8,
        paddingBottom: 4, borderBottom: "1px solid rgba(245,158,11,0.3)"
      }}>
        📚 МЕДИЦИНСКИЙ СПРАВОЧНИК
      </div>
      {details.category && (
        <div style={{ marginBottom: 6 }}>
          <span style={{ color: C.textDim }}>💊 Категория:</span> <strong>{details.category}</strong>
        </div>
      )}
      {details.mechanism && (
        <div style={{ marginBottom: 6, background: "rgba(255,255,255,0.03)", padding: 6, borderRadius: 6 }}>
          <span style={{ color: C.accent, fontWeight: 700 }}>⚙️ Механизм:</span>
          <div style={{ color: "#cbd5e1", marginTop: 2 }}>{details.mechanism}</div>
        </div>
      )}
      {details.indications && (
        <div style={{ marginBottom: 6 }}>
          <span style={{ color: C.green, fontWeight: 700 }}>📋 Показания:</span>
          <div style={{ color: "#e2e8f0" }}>{Array.isArray(details.indications) ? details.indications.join(", ") : details.indications}</div>
        </div>
      )}
      {details.contraindications && (
        <div style={{ marginBottom: 6, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", padding: 6, borderRadius: 6 }}>
          <span style={{ color: C.red, fontWeight: 700 }}>🚨 Противопоказания:</span>
          <div style={{ color: "#fca5a5" }}>{Array.isArray(details.contraindications) ? details.contraindications.join(", ") : details.contraindications}</div>
        </div>
      )}
      {details.dosage && (
        <div style={{ marginBottom: 6 }}>
          <span style={{ color: C.yellow, fontWeight: 700 }}>💉 Дозировка:</span>
          <div style={{ color: "#fef08a", fontFamily: CODE }}>{details.dosage}</div>
        </div>
      )}
      {details.refRange && (
        <div style={{ marginBottom: 4 }}>
          <span style={{ color: C.accent, fontWeight: 700 }}>📊 Норма:</span>
          <span style={{ color: "#cbd5e1", fontFamily: CODE, marginLeft: 6 }}>{details.refRange} {details.unit || ""}</span>
        </div>
      )}
      {details.sample && (
        <div style={{ fontSize: 10.5, color: C.textDim, marginTop: 4 }}>
          🩸 {details.sample} {details.tatSec ? `| ⏱️ ${details.tatSec} сек.` : ""}
        </div>
      )}
    </div>,
    document.body
  );
}

export default function Tooltip({
  text, title, formula, refRange, details, children,
  position = "top", delay = 150, indicator = false, style = {}
}) {
  const C = useTheme();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, placement: position });
  const [detailCoords, setDetailCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const timerRef = useRef(null);

  if (!text && !title && !formula && !refRange && !details) return children;

  const updateCoords = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const isTop = position === "top" ? r.top >= 120 : window.innerHeight - r.bottom < 120;
    const top = isTop ? r.top - 8 : r.bottom + 8;
    const left = Math.max(130, Math.min(window.innerWidth - 130, r.left + r.width / 2));
    setCoords({ top, left, placement: isTop ? "top" : "bottom" });
  };

  const toggleDetails = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const left = Math.min(window.innerWidth - 300, Math.max(12, r.right + 12));
    const top = Math.max(10, Math.min(window.innerHeight - 320, r.bottom + 8));
    setDetailCoords({ top, left });
    setShowDetails(prev => !prev);
  };

  const handleEnter = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { updateCoords(); setVisible(true); }, delay);
  };

  const handleLeave = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { setVisible(false); setShowDetails(false); }, 180);
  };

  const hasDetails = details && (details.mechanism || details.indications || details.contraindications || details.dosage || details.refRange);

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={() => { clearTimeout(timerRef.current); updateCoords(); setVisible(v => !v); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 4, cursor: "help", ...style }}
    >
      {children}
      {indicator === "icon" && (
        <span style={{
          fontSize: 9.5, fontWeight: 700, color: C.accent, background: `${C.accent}20`,
          border: `1px solid ${C.accent}40`, borderRadius: "50%", width: 14, height: 14,
          display: "inline-flex", alignItems: "center", justifyContent: "center", marginLeft: 2
        }}>ℹ</span>
      )}

      {visible && createPortal(
        <div
          onMouseEnter={() => clearTimeout(timerRef.current)}
          onMouseLeave={handleLeave}
          style={{
            position: "fixed", top: coords.top, left: coords.left,
            transform: coords.placement === "top" ? "translate(-50%, -100%)" : "translate(-50%, 0)",
            zIndex: 999999, background: "#0c182b", border: `1.5px solid ${C.accent || "#00e6c8"}`,
            color: "#ffffff", padding: "10px 14px", borderRadius: 12, fontSize: 12, lineHeight: 1.45,
            width: "max-content", maxWidth: "calc(100vw - 24px)", fontFamily: FONT, textAlign: "left",
            boxShadow: "0 16px 48px rgba(0,0,0,0.95), 0 0 20px rgba(0,230,200,0.25)",
          }}
        >
          {title && <div style={{ fontSize: 11, fontWeight: 800, color: C.accent, textTransform: "uppercase", marginBottom: 6 }}>{title}</div>}
          {(formula || refRange) && (
            <div style={{ fontSize: 11, fontWeight: 600, color: C.yellow, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", padding: "4px 8px", borderRadius: 6, marginBottom: text ? 6 : 0, fontFamily: CODE }}>
              {formula || refRange}
            </div>
          )}
          {text && <div style={{ fontSize: 11.5, color: "#e2e8f0" }}>{text}</div>}
          {hasDetails && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
              <button
                onClick={(e) => { e.stopPropagation(); toggleDetails(); }}
                style={{ background: `${C.accent}22`, border: `1px solid ${C.accent}`, borderRadius: 6, padding: "3px 9px", color: C.accent, fontSize: 10.5, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}
              >
                📖 Подробно ▾
              </button>
            </div>
          )}
        </div>,
        document.body
      )}

      {visible && showDetails && hasDetails && (
        <TooltipDetails details={details} coords={detailCoords} C={C} onLeave={handleLeave} timerRef={timerRef} />
      )}
    </div>
  );
}
