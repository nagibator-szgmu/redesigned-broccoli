import { useState } from "react";
import { FONT, CODE } from "./theme";
import { useTheme } from "./ThemeContext";
import { DIAGNOSTICS, CAT_COLOR } from "../data/diagnostics";
import DicomViewer from "../components/game/DicomViewer";

export const STitle = ({ icon, label, color: colorProp }) => {
  const C = useTheme();
  const color = colorProp ?? C.accent;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
      <span style={{fontSize:15}}>{icon}</span>
      <span style={{fontFamily:FONT,fontSize:11,letterSpacing:1,color,textTransform:"uppercase",fontWeight:600}}>{label}</span>
      <div style={{flex:1,height:1,background:`linear-gradient(90deg,${color}55,transparent)`}}/>
    </div>
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
  return (
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
  const color = CAT_COLOR[diag?.cat] || C.accent;
  const isCritical = text.startsWith("🔴");
  const isDicom = ["ct_head", "mri"].includes(id);

  return (
    <div className="treat-row" style={{
      background: isCritical ? `linear-gradient(135deg, ${C.red}0d, ${C.red}05)` : `linear-gradient(135deg, ${C.panel2}b3, ${C.panel2}66)`,
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: `1px solid ${isCritical ? `${C.red}3b` : `${color}22`}`,
      borderRadius: 12,
      padding: "13px 15px",
      marginBottom: 8,
      boxShadow: "0 4px 20px -4px rgba(0,0,0,0.3)",
      animation: isNew ? "fadeIn 0.4s ease" : "none"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: isCritical ? C.red : color, flexShrink: 0 }} />
        <span style={{ fontSize: 11.5, color, fontFamily: FONT, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{diag?.name || id}</span>
        {isCritical && <span style={{ fontSize: 9.5, color: C.red, background: `${C.red}18`, border: `1px solid ${C.red}2b`, borderRadius: 5, padding: "1px 7px", fontFamily: FONT, fontWeight: 700 }}>КРИТИЧНО</span>}
        {isNew && <span style={{ fontSize: 10.5, color: C.green, marginLeft: "auto", fontFamily: FONT, fontWeight: 500 }}>● новый</span>}
        {isDicom && (
          <button
            onClick={() => setShowDicom(true)}
            style={{
              background: `${color}18`, border: `1px solid ${color}33`,
              borderRadius: 8, padding: "3px 8px", color, fontSize: 10.5, cursor: "pointer",
              fontFamily: FONT, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4,
              marginLeft: isNew ? 10 : "auto", transition: "all 0.15s"
            }}
          >
            📷 PACS Снимки
          </button>
        )}
      </div>
      <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.7, fontFamily: FONT }}>{text.replace("🔴 ", "")}</div>
      {showDicom && <DicomViewer cd={cd} onClose={() => setShowDicom(false)} />}
    </div>
  );
};
