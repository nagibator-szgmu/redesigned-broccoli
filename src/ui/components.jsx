import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { FONT, CODE } from "./theme";
import { useTheme } from "./ThemeContext";
import { DIAGNOSTICS, DIAGNOSTIC_REFS, CAT_COLOR } from "../data/diagnostics";
import { DRUG_REFERENCE } from "../data/drugReference";
import DicomViewer from "../components/game/DicomViewer";

export const STitle = ({ icon, label, color: colorProp }) => {
  const C = useTheme();
  const color = colorProp ?? C.accent;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
      <span style={{fontSize:15, display: "inline-flex", alignItems: "center"}}>{icon}</span>
      <span style={{fontFamily:FONT,fontSize:11,letterSpacing:1,color,textTransform:"uppercase",fontWeight:600}}>{label}</span>
      <div style={{flex:1,height:1,background:`linear-gradient(90deg,${color}55,transparent)`}}/>
    </div>
  );
};

export const HeaderBackBtn = ({ onClick, label = "В главное меню" }) => {
  const C = useTheme();
  return (
    <button
      onClick={onClick}
      className="icon-btn"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: C.btnBg,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "8px 16px",
        fontFamily: FONT,
        fontSize: 12,
        fontWeight: 600,
        color: C.accent,
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.25)"
      }}
    >
      <span style={{ fontSize: 14, lineHeight: 1 }}>←</span>
      <span>{label}</span>
    </button>
  );
};

export const Btn = ({ onClick, disabled, color: colorProp, children, style = {} }) => {
  const C = useTheme();
  const color = colorProp ?? C.accent;
  return (
    <button onClick={onClick} disabled={disabled} className="med-btn" style={{
      background: `${color}12`,
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      border: `1px solid ${color}3b`,
      borderRadius: 10,
      padding: "10px 20px",
      fontFamily: FONT,
      fontSize: 13,
      fontWeight: 600,
      color,
      cursor: disabled ? "not-allowed" : "pointer",
      letterSpacing: 0.3,
      opacity: disabled ? 0.35 : 1,
      boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
      ...style,
    }}>{children}</button>
  );
};

export const CheckRow = ({ item, selected, onToggle, color: colorProp, danger, disabled }) => {
  const C = useTheme();
  const color = colorProp ?? C.accent;

  const drugInfo = DRUG_REFERENCE.find(d => d.id === item.id);
  const diagInfo = DIAGNOSTIC_REFS[item.id];

  const tooltipTitle = drugInfo?.name || item.name;
  const tooltipText = drugInfo?.mechanism || (diagInfo ? `Диагностическое исследование (${diagInfo.sample || "Лаборатория"}).` : "Назначение в рамках протокола ведения больного.");
  const tooltipRef = drugInfo?.dosage ? `Дозировка: ${drugInfo.dosage}` : (diagInfo?.refRange ? `Норма: ${diagInfo.refRange}` : null);
  const detailsObj = drugInfo || diagInfo;

  return (
    <Tooltip
      title={tooltipTitle}
      text={tooltipText}
      refRange={tooltipRef}
      details={detailsObj}
      position="top"
      style={{ width: "100%", display: "block" }}
    >
      <div onClick={() => !disabled && onToggle(item.id)} className="treat-row" style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: selected ? `${color}14` : danger ? `${C.red}06` : "transparent",
        border: `1px solid ${selected ? color + "66" : danger ? `${C.red}2b` : C.border}`,
        borderRadius: 10,
        padding: "9px 13px",
        cursor: disabled ? "default" : "pointer",
        marginBottom: 5,
        opacity: disabled ? 0.4 : 1,
        boxShadow: selected ? `0 2px 8px -2px ${color}15` : "none",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          border: `1px solid ${selected ? color : C.textDim}`,
          background: selected ? color : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: selected ? `0 0 6px ${color}55` : "none",
          transition: "all 0.15s ease",
        }}>
          {selected && <span style={{ fontSize: 10, color: C.bg, fontWeight: 900 }}>✓</span>}
        </div>
        <span style={{ color: selected ? C.white : danger ? C.red : C.text, fontSize: 12.5, fontFamily: FONT, flex: 1, fontWeight: selected ? 500 : 400 }}>{item.name}</span>
        {danger && <span style={{ fontSize: 10.5, color: C.red, fontFamily: FONT, fontWeight: 500, background: `${C.red}18`, padding: "1px 6px", borderRadius: 4 }}>⚠ опасно</span>}
      </div>
    </Tooltip>
  );
};

export const TimerCircle = ({ left, total }) => {
  const C = useTheme();
  const pct = left / total;
  const color = pct > 0.5 ? C.green : pct > 0.2 ? C.yellow : C.red;
  const r = 24, circ = 2 * Math.PI * r;
  const mm = Math.floor(left / 60), ss = left % 60;
  return (
    <div style={{position:"relative",width:60,height:60}}>
      <svg width="60" height="60" style={{transform:"rotate(-90deg)",position:"absolute"}}>
        <circle cx="30" cy="30" r={r} fill="none" stroke={C.border} strokeWidth="4"/>
        <circle cx="30" cy="30" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct)}
          style={{transition:"stroke-dashoffset 1s linear,stroke 0.4s"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
        fontFamily:CODE,fontSize:13,color,fontWeight:700}}>
        {mm}:{ss.toString().padStart(2,"0")}
      </div>
    </div>
  );
};

export const ResultCard = ({ id, text, isNew, cd }) => {
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

        {/* Reference & Sample Clinical Metadata */}
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
};

export const Tooltip = ({
  text,
  title,
  formula,
  refRange,
  details,
  children,
  position = "top",
  delay = 150,
  indicator = false,
  style = {}
}) => {
  const C = useTheme();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, placement: position });
  const [detailCoords, setDetailCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const detailBtnRef = useRef(null);
  const timerRef = useRef(null);

  if (!text && !title && !formula && !refRange && !details) return children;

  const updateCoords = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    
    let placement = position;
    let top = 0;
    let left = rect.left + rect.width / 2;

    if (position === "top" && rect.top < 120) {
      placement = "bottom";
    } else if (position === "bottom" && window.innerHeight - rect.bottom < 120) {
      placement = "top";
    }

    if (placement === "top") {
      top = rect.top - 8;
    } else {
      top = rect.bottom + 8;
    }

    const isMobileWidth = window.innerWidth < 768;
    const minLeft = isMobileWidth ? 130 : 160;
    const maxLeft = window.innerWidth - (isMobileWidth ? 130 : 160);
    left = Math.max(12, Math.min(window.innerWidth - 12, Math.max(minLeft, Math.min(maxLeft, left))));

    setCoords({ top, left, placement });
  };

  const updateDetailCoords = () => {
    if (!detailBtnRef.current) return;
    const rect = detailBtnRef.current.getBoundingClientRect();
    const isMobileWidth = window.innerWidth < 768;
    let left = rect.right + 12;
    if (isMobileWidth || left + 280 > window.innerWidth) {
      left = Math.max(12, (window.innerWidth - Math.min(290, window.innerWidth - 24)) / 2);
    }
    const top = Math.max(10, Math.min(window.innerHeight - 320, rect.bottom + 8));
    setDetailCoords({ top, left });
  };

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      updateCoords();
      setVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setShowDetails(false);
    }, 180);
  };

  const isUnderline = indicator === true || indicator === "underline";
  const isIcon = indicator === "icon";

  const hasExtendedDetails = details && (
    details.mechanism || details.indications || details.contraindications ||
    details.dosage || details.sideEffects || details.refRange || details.sample
  );

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => {
        clearTimeout(timerRef.current);
        updateCoords();
        setVisible(prev => !prev);
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        borderBottom: isUnderline ? `1px dashed ${C.accent || "#00e6c8"}88` : "none",
        cursor: "help",
        ...style
      }}
    >
      {children}
      {isIcon && (
        <span style={{
          fontSize: 9.5,
          fontWeight: 700,
          color: C.accent,
          background: `${C.accent}20`,
          border: `1px solid ${C.accent}40`,
          borderRadius: "50%",
          width: 14,
          height: 14,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 2,
          flexShrink: 0
        }}>ℹ</span>
      )}

      {/* Level 1 Tooltip Window */}
      {visible && createPortal(
        <div
          onMouseEnter={() => clearTimeout(timerRef.current)}
          onMouseLeave={handleMouseLeave}
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            transform: coords.placement === "top" ? "translate(-50%, -100%)" : "translate(-50%, 0)",
            zIndex: 999999,
            background: "#0c182b",
            border: `1.5px solid ${C.accent || "#00e6c8"}`,
            color: "#ffffff",
            padding: "10px 14px",
            borderRadius: 12,
            fontSize: 12,
            lineHeight: 1.45,
            whiteSpace: "normal",
            width: "max-content",
            maxWidth: "calc(100vw - 24px)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.95), 0 0 20px rgba(0,230,200,0.25)",
            pointerEvents: "auto",
            animation: "fadeIn 0.15s ease",
            fontFamily: FONT,
            textAlign: "left"
          }}
        >
          {title && (
            <div style={{
              fontSize: 11,
              fontWeight: 800,
              color: C.accent || "#00e6c8",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: (formula || refRange || text) ? 6 : 0,
              paddingBottom: (formula || refRange || text) ? 6 : 0,
              borderBottom: (formula || refRange || text) ? "1px solid rgba(255,255,255,0.1)" : "none"
            }}>
              {title}
            </div>
          )}

          {(formula || refRange) && (
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              color: C.yellow || "#f59e0b",
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.3)",
              padding: "4px 8px",
              borderRadius: 6,
              marginBottom: text ? 6 : 0,
              fontFamily: CODE
            }}>
              {formula || refRange}
            </div>
          )}

          {text && (
            <div style={{ fontSize: 11.5, color: "#e2e8f0", fontWeight: 400, marginBottom: hasExtendedDetails ? 8 : 0 }}>
              {text}
            </div>
          )}

          {/* Level 2 Interactive Trigger Button */}
          {hasExtendedDetails && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
              <button
                ref={detailBtnRef}
                onMouseEnter={() => {
                  updateDetailCoords();
                  setShowDetails(true);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  updateDetailCoords();
                  setShowDetails(prev => !prev);
                }}
                style={{
                  background: `${C.accent}22`,
                  border: `1px solid ${C.accent}`,
                  borderRadius: 6,
                  padding: "3px 9px",
                  color: C.accent,
                  fontSize: 10.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: FONT,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "all 0.15s ease"
                }}
              >
                📖 Подробно ▾
              </button>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* Level 2 Extended Reference Window (Portal) */}
      {visible && showDetails && hasExtendedDetails && createPortal(
        <div
          onMouseEnter={() => clearTimeout(timerRef.current)}
          onMouseLeave={handleMouseLeave}
          style={{
            position: "fixed",
            top: detailCoords.top,
            left: detailCoords.left,
            zIndex: 9999999,
            background: "#08101e",
            border: `1.5px solid ${C.yellow || "#f59e0b"}`,
            color: "#ffffff",
            padding: "12px 14px",
            borderRadius: 12,
            fontSize: 11.5,
            lineHeight: 1.5,
            width: 290,
            maxWidth: "calc(100vw - 24px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.98), 0 0 24px rgba(245,158,11,0.3)",
            pointerEvents: "auto",
            animation: "fadeIn 0.15s ease",
            fontFamily: FONT
          }}
        >
          <div style={{
            fontSize: 11,
            fontWeight: 800,
            color: C.yellow || "#f59e0b",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginBottom: 8,
            paddingBottom: 4,
            borderBottom: "1px solid rgba(245,158,11,0.3)"
          }}>
            📚 МЕДИЦИНСКИЙ СПРАВОЧНИК
          </div>

          {details.category && (
            <div style={{ marginBottom: 6 }}>
              <span style={{ color: C.textDim }}>💊 Категория:</span> <strong style={{ color: "#ffffff" }}>{details.category}</strong>
            </div>
          )}

          {details.mechanism && (
            <div style={{ marginBottom: 6, background: "rgba(255,255,255,0.03)", padding: 6, borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ color: C.accent, fontWeight: 700 }}>⚙️ Механизм действия:</span>
              <div style={{ color: "#cbd5e1", marginTop: 2 }}>{details.mechanism}</div>
            </div>
          )}

          {details.indications && (
            <div style={{ marginBottom: 6 }}>
              <span style={{ color: C.green, fontWeight: 700 }}>📋 Показания:</span>
              <div style={{ color: "#e2e8f0" }}>
                {Array.isArray(details.indications) ? details.indications.join(", ") : details.indications}
              </div>
            </div>
          )}

          {details.contraindications && (
            <div style={{ marginBottom: 6, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", padding: 6, borderRadius: 6 }}>
              <span style={{ color: C.red, fontWeight: 700 }}>🚨 Противопоказания:</span>
              <div style={{ color: "#fca5a5" }}>
                {Array.isArray(details.contraindications) ? details.contraindications.join(", ") : details.contraindications}
              </div>
            </div>
          )}

          {details.dosage && (
            <div style={{ marginBottom: 6 }}>
              <span style={{ color: C.yellow, fontWeight: 700 }}>💉 Стандартная дозировка:</span>
              <div style={{ color: "#fef08a", fontFamily: CODE }}>{details.dosage}</div>
            </div>
          )}

          {details.refRange && (
            <div style={{ marginBottom: 4 }}>
              <span style={{ color: C.accent, fontWeight: 700 }}>📊 Референсная норма:</span>
              <div style={{ color: "#cbd5e1", fontFamily: CODE }}>{details.refRange} {details.unit || ""}</div>
            </div>
          )}

          {details.sample && (
            <div style={{ fontSize: 10.5, color: C.textDim, marginTop: 4 }}>
              🩸 <strong>Материал:</strong> {details.sample} {details.tatSec ? `| ⏱️ Время: ${details.tatSec} сек.` : ""}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};



