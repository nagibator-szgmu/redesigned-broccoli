import { FONT, CODE, SER } from "./theme";
import { useTheme } from "./ThemeContext";
import { DIAGNOSTICS, CAT_COLOR } from "../data/diagnostics";

export const Vital = ({ label, value, warn, trend }) => {
  const C = useTheme();
  const tArrow = trend > 0 ? "▲" : trend < 0 ? "▼" : "";
  const tColor = warn ? C.red : trend !== 0 ? C.yellow : C.textDim;
  return (
    <div style={{background:warn?`${C.red}18`:`${C.accent}0c`,border:`1px solid ${warn?C.red+"66":C.borderBright}`,
      borderRadius:12,padding:"7px 13px",textAlign:"center",minWidth:78}}>
      <div style={{fontSize:10,color:C.textDim,fontFamily:FONT,textTransform:"uppercase",letterSpacing:0.8,marginBottom:3,fontWeight:600}}>{label}</div>
      <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:3}}>
        <div style={{fontSize:17,fontWeight:700,color:warn?C.red:C.accent,fontFamily:CODE,letterSpacing:-0.5}}>{value}</div>
        {tArrow && <span style={{fontSize:11,color:tColor,fontFamily:CODE}}>{tArrow}</span>}
      </div>
    </div>
  );
};

export const GCSBadge = ({ gcs }) => {
  const C = useTheme();
  const color = gcs >= 13 ? C.green : gcs >= 9 ? C.yellow : C.red;
  const label = gcs >= 13 ? "Ясное" : gcs >= 9 ? "Оглушение" : gcs >= 6 ? "Сопор" : "Кома";
  return (
    <div style={{background:`${color}0c`,border:`1px solid ${color}44`,borderRadius:12,padding:"7px 13px",textAlign:"center",minWidth:96}}>
      <div style={{fontSize:10,color:C.textDim,fontFamily:FONT,textTransform:"uppercase",letterSpacing:0.8,marginBottom:3,fontWeight:600}}>ГКС / Сознание</div>
      <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:5}}>
        <span style={{fontSize:17,fontWeight:700,color,fontFamily:CODE}}>{Math.round(gcs)}</span>
        <span style={{fontSize:12,color,fontFamily:FONT,fontWeight:500}}>{label}</span>
      </div>
    </div>
  );
};

export const PainBadge = ({ pain }) => {
  const C = useTheme();
  const color = pain >= 8 ? C.red : pain >= 5 ? C.yellow : C.green;
  return (
    <div style={{background:`${color}0c`,border:`1px solid ${color}44`,borderRadius:12,padding:"7px 13px",textAlign:"center",minWidth:78}}>
      <div style={{fontSize:10,color:C.textDim,fontFamily:FONT,textTransform:"uppercase",letterSpacing:0.8,marginBottom:3,fontWeight:600}}>Боль</div>
      <div style={{fontSize:17,fontWeight:700,color,fontFamily:CODE}}>{Math.round(pain*10)/10}<span style={{fontSize:12}}>/10</span></div>
    </div>
  );
};

export const StatusBanner = ({ status }) => {
  const C = useTheme();
  if (!status || status === "deteriorating") return null;
  const map = {
    critical:{color:C.red,text:"⚠ КРИТИЧЕСКОЕ СОСТОЯНИЕ — СРОЧНО ДЕЙСТВУЙТЕ"},
    dead:{color:C.red,text:"💀 ПАЦИЕНТ ПОГИБ"},
    stable:{color:C.green,text:"✓ СОСТОЯНИЕ СТАБИЛИЗИРУЕТСЯ"},
  };
  const m = map[status];
  if (!m) return null;
  return (
    <div style={{background:`${m.color}22`,border:`2px solid ${m.color}`,borderRadius:10,
      padding:"10px 16px",marginBottom:10,textAlign:"center",fontFamily:FONT,fontWeight:700,
      fontSize:14,color:m.color,animation:"pulse 1s ease-in-out infinite"}}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.7}}`}</style>
      {m.text}
    </div>
  );
};

export const EventLog = ({ events }) => {
  const C = useTheme();
  return (
    <div style={{background:C.panel2,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 10px",maxHeight:110,overflowY:"auto"}}>
      <div style={{fontSize:11,color:C.textDim,textTransform:"uppercase",letterSpacing:1,marginBottom:4,fontFamily:FONT}}>Журнал событий</div>
      {events.length === 0 && <div style={{fontSize:12,color:C.textDim,fontFamily:FONT}}>Нет событий...</div>}
      {events.map(e => {
        const col = e.type==="critical"?C.red:e.type==="warning"?C.yellow:e.type==="treatment"?C.green:e.type==="result"?C.accent:C.text;
        return (
          <div key={e.id} style={{display:"flex",gap:8,marginBottom:2}}>
            <span style={{fontSize:11,color:C.textDim,fontFamily:CODE,flexShrink:0}}>{e.elapsed}</span>
            <span style={{fontSize:12,color:col,fontFamily:FONT,lineHeight:1.4}}>{e.text}</span>
          </div>
        );
      })}
    </div>
  );
};

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
      background:`${color}18`,border:`1.5px solid ${color}55`,borderRadius:10,
      padding:"11px 22px",fontFamily:FONT,fontSize:14,fontWeight:600,color,
      cursor:disabled?"not-allowed":"pointer",letterSpacing:0.3,opacity:disabled?0.4:1,
      ...style,
    }}>{children}</button>
  );
};

export const CheckRow = ({ item, selected, onToggle, color: colorProp, danger, disabled }) => {
  const C = useTheme();
  const color = colorProp ?? C.accent;
  return (
    <div onClick={() => !disabled && onToggle(item.id)} style={{
      display:"flex",alignItems:"center",gap:10,
      background:selected?`${color}18`:danger?`${C.red}0a`:"transparent",
      border:`1px solid ${selected?color+"88":danger?`${C.red}44`:C.border}`,
      borderRadius:10,padding:"9px 13px",cursor:disabled?"default":"pointer",marginBottom:5,
      opacity:disabled?0.5:1,transition:"border-color 0.15s,background 0.15s",
    }}>
      <div style={{width:17,height:17,borderRadius:5,border:`2px solid ${selected?color:C.textDim}`,
        background:selected?color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        {selected && <span style={{fontSize:11,color:"#061412",fontWeight:900}}>✓</span>}
      </div>
      <span style={{color:selected?C.white:danger?C.red:C.text,fontSize:13,fontFamily:FONT,flex:1,fontWeight:selected?500:400}}>{item.name}</span>
      {danger && <span style={{fontSize:11,color:C.red,fontFamily:FONT}}>⚠ опасно</span>}
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

export const ResultCard = ({ id, text, isNew }) => {
  const C = useTheme();
  const diag = DIAGNOSTICS.find(d => d.id === id);
  const color = CAT_COLOR[diag?.cat] || C.accent;
  const isCritical = text.startsWith("🔴");
  return (
    <div style={{background:isCritical?C.redDim:C.panel2,
      border:`1px solid ${isCritical?C.red+"55":color+"33"}`,
      borderRadius:12,padding:"13px 15px",marginBottom:8,animation:isNew?"fadeIn 0.4s ease":"none"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
        <div style={{width:7,height:7,borderRadius:"50%",background:isCritical?C.red:color,flexShrink:0}}/>
        <span style={{fontSize:12,color,fontFamily:FONT,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8}}>{diag?.name||id}</span>
        {isCritical && <span style={{fontSize:10,color:C.red,background:`${C.red}18`,border:`1px solid ${C.red}44`,borderRadius:5,padding:"1px 7px",fontFamily:FONT,fontWeight:700}}>КРИТИЧНО</span>}
        {isNew && <span style={{fontSize:11,color:C.green,marginLeft:"auto",fontFamily:FONT}}>● новый</span>}
      </div>
      <div style={{fontSize:13,color:C.text,lineHeight:1.7,fontFamily:FONT}}>{text.replace("🔴 ","")}</div>
    </div>
  );
};
