import { useState } from "react";
import { useTranslate } from "../locale/useTranslate";
import { computeSeverity } from "../engine/severity";

function PatientAvatar({ gender, age, severity, C }) {
  const isMale = gender === "М" || gender === "Male" || gender === "Мужской" || gender === "Муржской";
  const avatarBg = severity === "critical" ? `${C.red}1a` : severity === "severe" ? `${C.red}10` : severity === "moderate" ? `${C.yellow}10` : `${C.green}10`;
  const avatarBorder = severity === "critical" ? C.red : severity === "severe" ? C.yellow : severity === "moderate" ? C.yellow : C.green;

  return (
    <div style={{
      width: 42, height: 42, borderRadius: 10, flexShrink: 0,
      background: avatarBg, border: `1.5px solid ${avatarBorder}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 18, position: "relative", boxShadow: `0 0 12px ${avatarBorder}25`
    }}>
      <span>{isMale ? "👨" : "👩"}</span>
      <div style={{
        position: "absolute", bottom: -3, right: -3, background: C.panel,
        border: `1px solid ${C.border}`, borderRadius: 4, padding: "0px 3px",
        fontSize: 7, fontWeight: 700, color: C.white
      }}>{age}</div>
    </div>
  );
}

export default function PatientSidebar({
  phase,
  setPhase,
  cd,
  ps,
  timeLeft,
  totalTime,
  eventLog,
  steps,
  activeStep,
  trend,
  C,
  FONT,
  CODE,
  SER,
  r1,
  TimerCircle,
  sevColor,
  sevLabel,
}) {
  const { t } = useTranslate();
  const [complaintExpanded, setComplaintExpanded] = useState(false);
  const si = computeSeverity(ps);
  const siLabels = {
    mild: t("severityIndex.mild"),
    moderate: t("severityIndex.moderate"),
    severe: t("severityIndex.severe"),
    critical: t("severityIndex.critical"),
  };
  return (
    <aside style={{width:224,flexShrink:0,zIndex:10,background:C.sidebarBg,
       backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
       borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",
       padding:"16px 12px",overflowY:"auto",overflowX:"hidden"}}>
       <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:18}}>
           <div onClick={()=>setPhase("menu")} className="icon-btn" style={{width:34,height:34,borderRadius:10,flexShrink:0,
            background:`linear-gradient(135deg,${C.accentDim},${C.accent}15)`,
            border:`1px solid ${C.borderBright}`,display:"flex",alignItems:"center",justifyContent:"center",
            cursor:"pointer"}}>
           <span style={{fontFamily:SER,fontSize:17,color:C.accent,fontStyle:"italic",fontWeight:700}}>М</span>
        </div>
        <span style={{fontSize:15,fontWeight:700,color:C.white,fontFamily:FONT,letterSpacing:-0.3,flex:1,lineHeight:1}}>{t("brand.name")}</span>
        <button onClick={()=>setPhase("menu")} className="med-btn" style={{background:C.btnBg,border:`1px solid ${C.border}`,
          borderRadius:7,padding:"5px 10px",cursor:"pointer",color:C.textDim,fontSize:11,fontFamily:FONT,flexShrink:0}}>{t("sidebar.menu")}</button>
      </div>

      {/* Patient card */}
      <div style={{background:C.btnBg,border:`1px solid ${sevColor}25`,borderRadius:13,padding:"11px 12px",marginBottom:11}}>
        <div style={{fontSize:9,color:C.textDim,letterSpacing:1.5,marginBottom:6,fontFamily:FONT,fontWeight:600,textTransform:"uppercase"}}>{t("sidebar.patient")}</div>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
          <PatientAvatar gender={cd.gender} age={cd.age} severity={si.label} C={C} />
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700,color:C.white,fontFamily:FONT,lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cd.name}</div>
            <div style={{fontSize:9,color:C.textDim,fontFamily:FONT,marginTop:2}}>{cd.gender === "М" ? "Мужчина" : "Женщина"}, {cd.age} л</div>
          </div>
        </div>
        <span style={{background:`${sevColor}20`,border:`1px solid ${sevColor}44`,borderRadius:6,padding:"2px 9px",fontSize:10,color:sevColor,fontWeight:700,fontFamily:FONT}}>{sevLabel}</span>
        <div onClick={() => setComplaintExpanded(v => !v)} style={{fontSize:12,color:C.text,fontFamily:FONT,marginTop:8,lineHeight:1.5,opacity:0.85,
           cursor:"pointer",
           ...(complaintExpanded ? {display:"block",overflow:"visible"} : {display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"})}}>{cd.complaint}</div>
        {!complaintExpanded && cd.complaint?.length > 80 && <div onClick={() => setComplaintExpanded(true)} style={{fontSize:9,color:C.accent,fontFamily:FONT,cursor:"pointer",marginTop:2}}>ещё...</div>}
      </div>

      {/* Vitals grid */}
      <div style={{marginBottom:11}}>
        <div style={{fontSize:9,color:C.textDim,letterSpacing:1.5,marginBottom:6,fontFamily:FONT,fontWeight:600,textTransform:"uppercase"}}>{t("sidebar.vitals")}</div>
        <div data-tutorial="vitals_color" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
          {[
            {id:"vitals_bp",label:t("vitals.sbp"),value:`${Math.round(ps.sbp)}/${Math.round(ps.dbp)}`,warn:ps.sbp<90||ps.sbp>160,tr:trend("sbp")},
            {id:"vitals_hr",label:t("vitals.hr"),value:`${Math.round(ps.hr)}`,warn:ps.hr>100||ps.hr<50,tr:trend("hr")},
            {id:"vitals_spo2",label:"SpO₂",value:`${r1(ps.spo2)}%`,warn:ps.spo2<94,tr:trend("spo2")},
            {id:"vitals_rr",label:t("vitals.rr"),value:`${Math.round(ps.rr)}`,warn:ps.rr>20||ps.rr<10,tr:trend("rr")},
            {id:"vitals_temp",label:"t°C",value:`${r1(ps.temp)}`,warn:ps.temp>38||ps.temp<36,tr:trend("temp")},
            {id:"vitals_gcs",label:t("vitals.gcs"),value:`${Math.round(ps.gcs)}`,warn:ps.gcs<10,tr:trend("gcs")},
           ].map(({id,label,value,warn,tr})=>(
            <div key={label} data-tutorial={id} style={{background:warn?`${C.red}12`:`${C.accent}0a`,border:`1px solid ${warn?C.red+"44":C.borderBright}`,borderRadius:8,padding:"5px 8px"}}>
              <div style={{fontSize:9,color:C.textDim,fontFamily:FONT,marginBottom:1}}>{label}</div>
              <div style={{display:"flex",alignItems:"center",gap:3}}>
                <span style={{fontSize:13,fontWeight:700,color:warn?C.red:C.accent,fontFamily:CODE,lineHeight:1}}>{value}</span>
                {tr!==0&&<span style={{fontSize:8,color:warn?C.red:C.yellow}}>{tr>0?"▲":"▼"}</span>}
              </div>
            </div>
          ))}
         </div>
         <div data-tutorial="vitals_pain" style={{marginTop:5,background:`${C.accent}0a`,border:`1px solid ${C.borderBright}`,borderRadius:8,padding:"5px 9px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:9,color:C.textDim,fontFamily:FONT,textTransform:"uppercase",letterSpacing:0.8}}>{t("vitals.pain")}</span>
                <span style={{fontSize:11,fontWeight:700,fontFamily:CODE,color:ps.pain>7?C.red:ps.pain>4?C.yellow:C.green}}>{r1(ps.pain)}/10</span>
            </div>
            <div style={{display:"flex",gap:2}}>
                {[1,2,3,4,5,6,7,8,9,10].map(n=>(
                <div key={n} style={{flex:1,height:3,borderRadius:2,background:n<=ps.pain?(ps.pain>7?C.red:ps.pain>4?C.yellow:C.green):C.borderBright}}/>
            ))}
          </div>
        </div>
        <div style={{marginTop:5,background:`${si.color}12`,border:`1px solid ${si.color}44`,borderRadius:8,padding:"5px 9px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:9,color:C.textDim,fontFamily:FONT,textTransform:"uppercase",letterSpacing:0.8}}>{t("severityIndex.title")}</span>
                <span style={{fontSize:11,fontWeight:700,fontFamily:CODE,color:si.color}}>{si.total}/20</span>
            </div>
            <div style={{display:"flex",gap:2,marginBottom:3}}>
                <div style={{flex:1,height:4,borderRadius:2,background:C.borderBright,overflow:"hidden"}}>
                    <div style={{width:`${(si.total/20)*100}%`,height:"100%",background:si.color,borderRadius:2,transition:"width .3s"}}/>
                </div>
            </div>
            <div style={{fontSize:9,color:si.color,fontWeight:700,fontFamily:FONT,textAlign:"center"}}>{siLabels[si.label]||si.label}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1px 6px",marginTop:4}}>
                {[{k:"spo2",v:si.subs.spo2},{k:"sbp",v:si.subs.sbp},{k:"gcs",v:si.subs.gcs},{k:"hr",v:si.subs.hr},{k:"rr",v:si.subs.rr}].map(({k,v})=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:8,fontFamily:CODE,color:C.textDim}}>
                        <span>{t(`severityIndex.${k}`)}</span><span style={{color:v>=3?C.red:v>=2?C.yellow:C.green}}>{v}</span>
                    </div>
                ))}
            </div>
            <div style={{fontSize:7,color:C.textDim,fontFamily:FONT,textAlign:"center",marginTop:3,opacity:0.6}}>{t("severityIndex.disclaimer")}</div>
        </div>
        {ps.status==="critical"&&<div style={{marginTop:5,background:`${C.red}18`,border:`1px solid ${C.red}55`,borderRadius:8,padding:"5px 10px",fontSize:11,color:C.red,fontWeight:700,animation:"pulse 1s infinite",fontFamily:FONT,textAlign:"center"}}>{t("game.critical")}</div>}
        {ps.status==="dead"&&<div style={{marginTop:5,background:`${C.red}18`,border:`1px solid ${C.red}55`,borderRadius:8,padding:"5px 10px",fontSize:11,color:C.red,fontWeight:700,fontFamily:FONT,textAlign:"center"}}>{t("game.fatal")}</div>}
        {ps.status==="stable"&&<div style={{marginTop:5,background:`${C.green}18`,border:`1px solid ${C.green}55`,borderRadius:8,padding:"5px 10px",fontSize:11,color:C.green,fontWeight:700,fontFamily:FONT,textAlign:"center"}}>{t("game.stable")}</div>}
      </div>

      <div data-tutorial="timer" style={{display:"flex",justifyContent:"center",marginBottom:11}}>
        <TimerCircle left={timeLeft} total={totalTime}/>
      </div>

      {/* Steps */}
      <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:11}}>
        {steps.map((s,i)=>{
          const isActive=s.key===phase, isDone=i<activeStep;
          return (
            <div key={s.key} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:9,
              background:isActive?`${C.accent}15`:isDone?`${C.green}10`:C.btnBg,
              border:`1px solid ${isActive?`${C.accent}33`:isDone?`${C.green}20`:C.btnBorder}`}}>
              <span style={{fontSize:12}}>{s.icon}</span>
              <span style={{fontSize:11,fontFamily:FONT,flex:1,color:isActive?C.accent:isDone?C.green:C.textDim,fontWeight:isActive?700:400}}>{s.label}</span>
              {isDone&&<span style={{fontSize:10,color:C.green}}>✓</span>}
              {isActive&&<div style={{width:5,height:5,borderRadius:"50%",background:C.accent,boxShadow:`0 0 6px ${C.accent}`}}/>}
            </div>
          );
        })}
      </div>

      <div style={{flex:1}}/>
      <div style={{height:1,background:C.border,margin:"6px 0"}}/>

      {/* Mini event log */}
      <div>
        <div style={{fontSize:9,color:C.textDim,letterSpacing:1.5,marginBottom:5,fontFamily:FONT,fontWeight:600,textTransform:"uppercase"}}>{t("sidebar.events")}</div>
        {eventLog.length===0&&<div style={{fontSize:10,color:C.textDim,fontFamily:FONT}}>{t("sidebar.noEvents")}</div>}
        {eventLog.slice(0,6).map(e=>{
          const col=e.type==="critical"?C.red:e.type==="warning"?C.yellow:e.type==="treatment"?C.green:e.type==="result"?C.accent:C.textDim;
          return (
            <div key={e.id} style={{display:"flex",gap:6,marginBottom:3}}>
              <span style={{fontSize:9,color:C.textDim,fontFamily:CODE,flexShrink:0,minWidth:28}}>{e.elapsed}</span>
              <span style={{fontSize:10,color:col,fontFamily:FONT,lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.text}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}