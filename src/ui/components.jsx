import { FONT, CODE } from "./theme";
import { useTheme } from "./ThemeContext";
import { DIAGNOSTIC_REFS } from "../data/diagnostics";
import { DRUG_REFERENCE } from "../data/drugReference";
import Tooltip from "./Tooltip";

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

export { default as ResultCard } from "./ResultCard";
export { Tooltip };

