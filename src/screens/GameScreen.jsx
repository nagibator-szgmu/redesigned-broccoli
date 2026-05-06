import { useState } from "react";
import { FONT, CODE, SER } from "../ui/theme";
import { useTheme } from "../ui/ThemeContext";
import { CAT_COLOR, DIAGNOSTICS } from "../data/diagnostics";
import { TREATMENTS } from "../data/treatments";
import { r1 } from "../engine/patient";
import { STitle, Btn, CheckRow, TimerCircle, ResultCard } from "../ui/components";
import useIsMobile from "../hooks/useIsMobile";

export default function GameScreen({
  phase, setPhase, cd, ps, prevPs,
  selDiag, setSelDiag, selTreat, toggleTreatment,
  orderedDiag, revealedResults, newResultIds,
  diagText, setDiagText,
  diagCat, setDiagCat, treatCat, setTreatCat,
  appliedFx, pendingFx,
  timeLeft, totalTime,
  eventLog,
  handleOrderTests, handleSubmit,
  processingTests, allResultsReady,
}) {
  const C = useTheme();
  const isMobile = useIsMobile();
  const [mobileTab, setMobileTab] = useState("main");
  const [showInfo, setShowInfo] = useState(false);

  const sev = cd.severity;
  const sevColor = {critical:C.red,moderate:C.yellow,mild:C.green}[sev]||C.yellow;
  const sevLabel = {critical:"🚨 КРИТИЧЕСКИЙ",moderate:"⚠ СРЕДНИЙ",mild:"✅ ЛЁГКИЙ"}[sev];

  const toggle = (setter, id) => setter(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const diagCats = ["all",...new Set(DIAGNOSTICS.map(d=>d.cat))];
  const treatCats = ["all",...new Set(TREATMENTS.map(t=>t.cat))];
  const filtDiag = diagCat==="all"?DIAGNOSTICS:DIAGNOSTICS.filter(d=>d.cat===diagCat);
  const filtTreat = treatCat==="all"?TREATMENTS:TREATMENTS.filter(t=>t.cat===treatCat);
  const TREAT_CAT_LABELS = {all:"Все",antiplatelet:"Антиагреганты",anticoagulant:"Антикоагулянты",intervention:"Процедуры",supportive:"Поддержка",cardiac:"Кардио",analgesic:"Анальгетики",betablocker:"β-блокаторы",diuretic:"Диуретики",antibiotic:"Антибиотики",steroid:"Стероиды",endocrine:"Эндокринные",antidote:"Антидоты",vasopressor:"Вазопрессоры",anticonvulsant:"Антиконвульсанты",antiarrhythmic:"Антиаритмики",neuro:"Нейро",antiviral:"Антивирусные",renal:"Нефрология"};
  const DIAG_CAT_LABELS = {all:"Все",cardiac:"Кардио",lab:"Лаборатория",respiratory:"Дыхание",imaging:"Визуализация",neuro:"Нейро"};

  const trend = (key) => {
    if (!ps||!prevPs) return 0;
    return ps[key]>prevPs[key]?1:ps[key]<prevPs[key]?-1:0;
  };

  const steps = [
    {key:"order_tests",label:"Исследования",icon:"🔬"},
    {key:"awaiting_results",label:"Ожидание",icon:"⏳"},
    {key:"diagnose",label:"Диагноз+Лечение",icon:"📝"},
  ];
  const activeStep = steps.findIndex(s=>s.key===phase);

  const renderTreatList = () => filtTreat.map(item=>{
    const selected = selTreat.includes(item.id);
    const isPending = pendingFx.has(item.id);
    const isApplied = appliedFx.has(item.id);
    const isDanger = cd.wrongTreat.includes(item.id);
    const color = isDanger&&selected?C.red:(CAT_COLOR[item.cat]||C.green);
    return (
      <div key={item.id} onClick={()=>toggleTreatment(item.id)} className="treat-row" style={{
        display:"flex",alignItems:"center",gap:8,
        background:selected?(isDanger?`${C.red}18`:`${color}18`):"transparent",
        border:`1px solid ${selected?color:C.border}`,
        borderRadius:8,padding:"9px 12px",cursor:"pointer",marginBottom:4,
      }}>
        <div style={{width:16,height:16,borderRadius:4,border:`2px solid ${selected?color:C.textDim}`,
          background:selected?color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          {selected&&<span style={{fontSize:10,color:"#000",fontWeight:900}}>✓</span>}
        </div>
        <span style={{color:selected?C.white:isDanger?`${C.red}cc`:C.text,fontSize:13,fontFamily:FONT,flex:1,lineHeight:1.4}}>{item.name}</span>
        {isPending&&<div style={{width:8,height:8,border:`2px solid ${C.yellow}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}}/>}
        {isApplied&&!isDanger&&<span style={{fontSize:12,color:C.green,flexShrink:0}}>✓</span>}
        {isApplied&&isDanger&&<span style={{fontSize:12,color:C.red,flexShrink:0}}>🚨</span>}
        {!selected&&isDanger&&<span style={{fontSize:12,color:`${C.red}88`,flexShrink:0}}>⚠</span>}
      </div>
    );
  });

  const renderTreatCatFilter = () => (
    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
      {treatCats.map(cat=>(
        <button key={cat} onClick={()=>setTreatCat(cat)} className="filter-pill" style={{
          background:treatCat===cat?`${C.green}1a`:"transparent",
          border:`1px solid ${treatCat===cat?C.green:C.border}`,
          borderRadius:10,padding:"3px 10px",cursor:"pointer",fontFamily:FONT,
          fontSize:12,color:treatCat===cat?C.green:C.textDim}}>
          {TREAT_CAT_LABELS[cat]??cat}
        </button>
      ))}
    </div>
  );

  /* ── MOBILE LAYOUT ── */
  if (isMobile) return (
    <div style={{height:"100vh",background:C.bgGrad,
      fontFamily:FONT,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Compact header */}
      <header style={{flexShrink:0,padding:"0 14px",height:52,display:"flex",alignItems:"center",gap:10,
        background:C.headerBg,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(0,230,200,0.08)"}}>
        <div onClick={()=>setPhase("menu")} className="icon-btn" style={{width:30,height:30,borderRadius:8,flexShrink:0,
          background:"linear-gradient(135deg,rgba(0,230,200,0.2),rgba(0,150,200,0.1))",
          border:"1px solid rgba(0,230,200,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <span style={{fontFamily:SER,fontSize:15,color:C.accent,fontStyle:"italic",fontWeight:700}}>М</span>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:700,color:C.white,fontFamily:FONT,lineHeight:1,
            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cd.name}</div>
          <div style={{fontSize:10,color:C.textDim,fontFamily:FONT,marginTop:1}}>{cd.age} л · {cd.gender}</div>
        </div>
        <span style={{background:`${sevColor}20`,border:`1px solid ${sevColor}44`,borderRadius:5,
          padding:"2px 8px",fontSize:10,color:sevColor,fontWeight:700,fontFamily:FONT,flexShrink:0}}>{sevLabel}</span>
        <div style={{flexShrink:0,textAlign:"right"}}>
          <div style={{fontSize:14,fontWeight:700,fontFamily:CODE,lineHeight:1,
            color:timeLeft<60?C.red:timeLeft<180?C.yellow:C.accent}}>
            {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,"0")}
          </div>
          <div style={{fontSize:9,color:C.textDim,fontFamily:FONT}}>осталось</div>
        </div>
      </header>

      {/* Vitals strip */}
      <div className="no-scrollbar" style={{flexShrink:0,display:"flex",overflowX:"auto",
        background:C.sidebarBg,borderBottom:"1px solid rgba(0,230,200,0.06)"}}>
        {[
          {label:"АД",value:`${Math.round(ps.sbp)}/${Math.round(ps.dbp)}`,warn:ps.sbp<90||ps.sbp>160},
          {label:"ЧСС",value:`${Math.round(ps.hr)}`,warn:ps.hr>100||ps.hr<50},
          {label:"SpO₂",value:`${r1(ps.spo2)}%`,warn:ps.spo2<94},
          {label:"ЧД",value:`${Math.round(ps.rr)}`,warn:ps.rr>20||ps.rr<10},
          {label:"ГКС",value:`${Math.round(ps.gcs)}`,warn:ps.gcs<10},
          {label:"Боль",value:`${r1(ps.pain)}/10`,warn:ps.pain>7},
        ].map(({label,value,warn})=>(
          <div key={label} style={{flexShrink:0,padding:"7px 14px",borderRight:"1px solid rgba(0,230,200,0.06)",
            background:warn?`${C.red}0a`:"transparent",textAlign:"center"}}>
            <div style={{fontSize:8,color:warn?C.red:C.textDim,textTransform:"uppercase",letterSpacing:0.8,marginBottom:2,fontFamily:FONT}}>{label}</div>
            <div style={{fontSize:13,fontWeight:700,color:warn?C.red:C.accent,fontFamily:CODE,lineHeight:1}}>{value}</div>
          </div>
        ))}
        {(ps.status==="critical"||ps.status==="dead"||ps.status==="stable")&&(
          <div style={{flexShrink:0,padding:"7px 14px",display:"flex",alignItems:"center",
            background:ps.status==="stable"?`${C.green}0a`:`${C.red}0a`}}>
            <span style={{fontSize:11,color:ps.status==="stable"?C.green:C.red,fontWeight:700,fontFamily:FONT,whiteSpace:"nowrap"}}>
              {ps.status==="critical"?"⚠ КРИТИЧНО":ps.status==="dead"?"💀 ЛЕТАЛЬНЫЙ":"✓ СТАБИЛЕН"}
            </span>
          </div>
        )}
      </div>

      {/* Phase breadcrumb */}
      <div style={{flexShrink:0,display:"flex",alignItems:"center",padding:"5px 14px",gap:4,
        background:C.headerBg2,borderBottom:"1px solid rgba(0,230,200,0.04)"}}>
        {steps.map((s,i)=>(
          <span key={s.key} style={{display:"inline-flex",alignItems:"center",gap:3,flexShrink:0}}>
            <span style={{fontSize:11,fontFamily:FONT,
              color:s.key===phase?C.accent:i<activeStep?C.green:C.textDim,
              fontWeight:s.key===phase?700:400,
              opacity:s.key===phase?1:i<activeStep?0.85:0.4}}>
              {s.icon} {s.label}
            </span>
            {i<2&&<span style={{color:"rgba(255,255,255,0.15)",fontSize:11,marginLeft:2}}>›</span>}
          </span>
        ))}
      </div>

      {/* Scrollable content */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px 12px",minHeight:0}}>

        {/* MAIN tab */}
        {mobileTab==="main"&&(
          <>
            {phase==="order_tests"&&(
              <>
                <div style={{marginBottom:12}}>
                  <div onClick={()=>setShowInfo(v=>!v)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",background:C.panelBg,border:"1px solid rgba(0,230,200,0.1)",borderRadius:showInfo?"12px 12px 0 0":12,cursor:"pointer"}}>
                    <span style={{fontSize:11,color:C.textDim,fontFamily:FONT,fontWeight:600,textTransform:"uppercase",letterSpacing:0.8}}>📋 Анамнез и осмотр</span>
                    <span style={{color:C.textDim,fontSize:11}}>{showInfo?"▲":"▼"}</span>
                  </div>
                  {showInfo&&<div style={{border:"1px solid rgba(0,230,200,0.08)",borderTop:"none",borderRadius:"0 0 12px 12px",overflow:"hidden"}}>
                    {[{icon:"📋",label:"Анамнез",text:cd.anamnesis},{icon:"🔍",label:"Осмотр",text:cd.exam}].map(({icon,label,text},i)=>(
                      <div key={label} style={{background:C.panelBg,padding:"10px 12px",borderTop:i>0?"1px solid rgba(0,230,200,0.06)":undefined}}>
                        <div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:1,marginBottom:5,fontFamily:FONT,fontWeight:600}}>{icon} {label}</div>
                        <p style={{color:C.text,fontSize:12,lineHeight:1.7,margin:0,fontFamily:FONT}}>{text}</p>
                      </div>
                    ))}
                  </div>}
                </div>
                <STitle icon="🔬" label="Исследования" color={C.accent}/>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                  {diagCats.map(cat=>(
                    <button key={cat} onClick={()=>setDiagCat(cat)} className="filter-pill" style={{
                      background:diagCat===cat?`${C.accent}1a`:C.btnBg,
                      border:`1px solid ${diagCat===cat?C.accent:"rgba(0,230,200,0.1)"}`,
                      borderRadius:12,padding:"4px 12px",cursor:"pointer",fontFamily:FONT,
                      fontSize:12,color:diagCat===cat?C.accent:C.textDim}}>{DIAG_CAT_LABELS[cat]??cat}</button>
                  ))}
                </div>
                <div>
                  {filtDiag.map(item=>(
                    <CheckRow key={item.id} item={item} selected={selDiag.includes(item.id)}
                      onToggle={id=>setSelDiag(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id])} color={CAT_COLOR[item.cat]||C.accent}/>
                  ))}
                </div>
                <div style={{marginTop:14,paddingTop:12,borderTop:"1px solid rgba(0,230,200,0.06)",
                  display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:13,color:C.textDim,fontFamily:FONT}}>
                    Выбрано: <span style={{color:C.accent,fontWeight:700}}>{selDiag.length}</span>
                  </span>
                  <Btn onClick={handleOrderTests} disabled={selDiag.length===0||processingTests} color={C.accent} style={{padding:"10px 18px",fontSize:13}}>📤 В ЛАБОРАТОРИЮ</Btn>
                </div>
              </>
            )}

            {phase==="awaiting_results"&&(
              <>
                {!allResultsReady&&(
                  <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                    background:C.yellowDim,border:"1px solid rgba(245,200,66,0.22)",
                    borderRadius:10,marginBottom:12,fontSize:13,color:C.yellow,fontFamily:FONT}}>
                    <div style={{width:12,height:12,border:`2px solid ${C.yellow}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}}/>
                    Ожидание... {Object.keys(revealedResults).length}/{orderedDiag.length}
                  </div>
                )}
                {allResultsReady&&(
                  <div style={{display:"flex",flexDirection:"column",gap:8,padding:"12px 14px",
                    background:C.greenDim,border:"1px solid rgba(0,229,160,0.22)",
                    borderRadius:10,marginBottom:12,fontSize:13,color:C.green,fontFamily:FONT}}>
                    <span>✓ Все результаты получены</span>
                    <Btn onClick={()=>setPhase("diagnose")} color={C.green} style={{padding:"10px",fontSize:13,width:"100%"}}>📝 ПОСТАВИТЬ ДИАГНОЗ →</Btn>
                  </div>
                )}
                <div style={{display:"flex",flexDirection:"column",gap:0}}>
                  {orderedDiag.map(id=>{
                    const text=revealedResults[id];
                    if(!text)return(
                      <div key={id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",
                        background:"rgba(13,26,46,0.6)",border:"1px solid rgba(0,230,200,0.06)",borderRadius:12,opacity:0.6,marginBottom:8}}>
                        <div style={{width:9,height:9,border:`2px solid ${C.textDim}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}}/>
                        <span style={{fontSize:13,color:C.textDim,fontFamily:FONT}}>{DIAGNOSTICS.find(d=>d.id===id)?.name||id}...</span>
                      </div>
                    );
                    return <ResultCard key={id} id={id} text={text} isNew={newResultIds.includes(id)}/>;
                  })}
                </div>
              </>
            )}

            {phase==="diagnose"&&(
              <>
                <div style={{background:C.panelBg,border:"1px solid rgba(0,230,200,0.08)",borderRadius:12,padding:"10px 12px",marginBottom:12}}>
                  <STitle icon="📋" label={`Результаты (${orderedDiag.length})`} color={C.accent}/>
                  {orderedDiag.slice(0,2).map(id=>(
                    <ResultCard key={id} id={id} text={revealedResults[id]||""}/>
                  ))}
                  {orderedDiag.length>2&&<div style={{fontSize:12,color:C.textDim,fontFamily:FONT,textAlign:"center",paddingTop:4}}>+ ещё {orderedDiag.length-2}</div>}
                </div>
                <div style={{background:C.panelBg,border:"1px solid rgba(157,111,245,0.2)",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
                  <STitle icon="🎯" label="Диагноз" color={C.purple}/>
                  <textarea value={diagText} onChange={e=>setDiagText(e.target.value)}
                    placeholder="Сформулируйте диагноз..."
                    style={{width:"100%",minHeight:90,background:C.headerBg2,
                      border:`1px solid ${diagText?"rgba(157,111,245,0.4)":"rgba(0,230,200,0.1)"}`,
                      borderRadius:10,padding:"10px 12px",color:C.white,fontSize:13,fontFamily:FONT,
                      resize:"vertical",outline:"none",boxSizing:"border-box",lineHeight:1.8}}/>
                </div>
                <div style={{background:C.panelBg,border:"1px solid rgba(0,230,200,0.08)",borderRadius:12,padding:"12px 14px",
                  display:"flex",flexDirection:"column",gap:10}}>
                  <span style={{fontSize:13,color:selTreat.length>0?C.green:C.yellow,fontFamily:FONT}}>
                    {selTreat.length>0?`💊 Назначено: ${selTreat.length} препаратов`:"💊 Назначьте лечение во вкладке Лечение"}
                  </span>
                  <Btn onClick={()=>handleSubmit(false)} disabled={selTreat.length===0} color={C.green} style={{padding:"12px",fontSize:14,width:"100%"}}>
                    ✓ ЗАВЕРШИТЬ СЛУЧАЙ
                  </Btn>
                </div>
              </>
            )}
          </>
        )}

        {/* TREATMENT tab */}
        {mobileTab==="treatment"&&(
          <>
            <div style={{background:C.redDim,border:"1px solid rgba(255,61,90,0.12)",borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:12,color:C.red,fontFamily:FONT}}>⚠ Некоторые препараты опасны при данной патологии</div>
            {renderTreatCatFilter()}
            {renderTreatList()}
            {selTreat.length>0&&(
              <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(0,230,200,0.06)",fontSize:12,color:C.textDim,fontFamily:FONT}}>
                {appliedFx.size>0&&<div style={{color:C.green,marginBottom:2}}>✓ Применено: {appliedFx.size}</div>}
                {pendingFx.size>0&&<div style={{color:C.yellow}}>⏳ В действии: {pendingFx.size}</div>}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom tab bar */}
      <div style={{flexShrink:0,height:52,display:"flex",background:C.headerBg,
        backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
        borderTop:"1px solid rgba(0,230,200,0.1)"}}>
        <button onClick={()=>setMobileTab("main")} style={{flex:1,border:"none",
          background:mobileTab==="main"?"rgba(0,230,200,0.04)":"transparent",
          borderTop:mobileTab==="main"?`2px solid ${C.accent}`:"2px solid transparent",
          cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2}}>
          <span style={{fontSize:14}}>{steps.find(s=>s.key===phase)?.icon||"📋"}</span>
          <span style={{fontSize:10,fontFamily:FONT,fontWeight:mobileTab==="main"?600:400,
            color:mobileTab==="main"?C.accent:C.textDim}}>
            {phase==="order_tests"?"Исследования":phase==="awaiting_results"?"Результаты":"Диагноз"}
          </span>
        </button>
        <button onClick={()=>setMobileTab("treatment")} style={{flex:1,border:"none",
          background:mobileTab==="treatment"?"rgba(0,229,160,0.04)":"transparent",
          borderTop:mobileTab==="treatment"?`2px solid ${C.green}`:"2px solid transparent",
          cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,
          position:"relative"}}>
          <span style={{fontSize:14}}>💊</span>
          <span style={{fontSize:10,fontFamily:FONT,fontWeight:mobileTab==="treatment"?600:400,
            color:mobileTab==="treatment"?C.green:C.textDim}}>Лечение</span>
          {selTreat.length>0&&(
            <div style={{position:"absolute",top:6,right:"calc(50% - 20px)",width:16,height:16,
              background:C.green,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:9,color:"#000",fontWeight:700}}>{selTreat.length}</div>
          )}
        </button>
      </div>
    </div>
  );

  /* ── DESKTOP LAYOUT ── */
  return (
    <div style={{height:"100vh",background:C.bgGrad,
      fontFamily:FONT,display:"flex",overflow:"hidden",position:"relative"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Ambient glow */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",left:"-5%",top:"-10%",width:500,height:500,background:C.glowBg1,borderRadius:"50%"}}/>
        <div style={{position:"absolute",right:"-5%",bottom:"-10%",width:400,height:400,background:C.glowBg2,borderRadius:"50%"}}/>
      </div>

      {/* Sidebar */}
      <aside style={{width:224,flexShrink:0,zIndex:10,background:C.sidebarBg,
        backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
        borderRight:"1px solid rgba(0,230,200,0.08)",display:"flex",flexDirection:"column",
        padding:"16px 12px",overflowY:"auto",overflowX:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:18}}>
          <div onClick={()=>setPhase("menu")} className="icon-btn" style={{width:34,height:34,borderRadius:10,flexShrink:0,
            background:"linear-gradient(135deg,rgba(0,230,200,0.2),rgba(0,150,200,0.1))",
            border:"1px solid rgba(0,230,200,0.3)",display:"flex",alignItems:"center",justifyContent:"center",
            cursor:"pointer"}}>
            <span style={{fontFamily:SER,fontSize:17,color:C.accent,fontStyle:"italic",fontWeight:700}}>М</span>
          </div>
          <span style={{fontSize:15,fontWeight:700,color:C.white,fontFamily:FONT,letterSpacing:-0.3,flex:1,lineHeight:1}}>МедСим</span>
          <button onClick={()=>setPhase("menu")} className="med-btn" style={{background:C.btnBg,border:"1px solid rgba(0,230,200,0.15)",
            borderRadius:7,padding:"5px 10px",cursor:"pointer",color:C.textDim,fontSize:11,fontFamily:FONT,flexShrink:0}}>← Меню</button>
        </div>

        {/* Patient card */}
        <div style={{background:C.btnBg,border:`1px solid ${sevColor}25`,borderRadius:13,padding:"11px 12px",marginBottom:11}}>
          <div style={{fontSize:9,color:C.textDim,letterSpacing:1.5,marginBottom:6,fontFamily:FONT,fontWeight:600,textTransform:"uppercase"}}>Пациент</div>
          <div style={{fontSize:14,fontWeight:700,color:C.white,fontFamily:FONT,lineHeight:1.2,marginBottom:3}}>{cd.name}</div>
          <div style={{fontSize:11,color:C.textDim,fontFamily:FONT,marginBottom:7}}>{cd.age} л · {cd.gender}</div>
          <span style={{background:`${sevColor}20`,border:`1px solid ${sevColor}44`,borderRadius:6,padding:"2px 9px",fontSize:10,color:sevColor,fontWeight:700,fontFamily:FONT}}>{sevLabel}</span>
          <div style={{fontSize:12,color:C.text,fontFamily:FONT,marginTop:8,lineHeight:1.5,opacity:0.85,
            display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{cd.complaint}</div>
        </div>

        {/* Vitals grid */}
        <div style={{marginBottom:11}}>
          <div style={{fontSize:9,color:C.textDim,letterSpacing:1.5,marginBottom:6,fontFamily:FONT,fontWeight:600,textTransform:"uppercase"}}>Показатели</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
            {[
              {label:"АД",value:`${Math.round(ps.sbp)}/${Math.round(ps.dbp)}`,warn:ps.sbp<90||ps.sbp>160,tr:trend("sbp")},
              {label:"ЧСС",value:`${Math.round(ps.hr)}`,warn:ps.hr>100||ps.hr<50,tr:trend("hr")},
              {label:"SpO₂",value:`${r1(ps.spo2)}%`,warn:ps.spo2<94,tr:trend("spo2")},
              {label:"ЧД",value:`${Math.round(ps.rr)}`,warn:ps.rr>20||ps.rr<10,tr:trend("rr")},
              {label:"t°C",value:`${r1(ps.temp)}`,warn:ps.temp>38||ps.temp<36,tr:trend("temp")},
              {label:"ГКС",value:`${Math.round(ps.gcs)}`,warn:ps.gcs<10,tr:trend("gcs")},
            ].map(({label,value,warn,tr})=>(
              <div key={label} style={{background:warn?`${C.red}12`:`${C.accent}0a`,border:`1px solid ${warn?C.red+"44":C.borderBright}`,borderRadius:8,padding:"5px 8px"}}>
                <div style={{fontSize:9,color:C.textDim,fontFamily:FONT,marginBottom:1}}>{label}</div>
                <div style={{display:"flex",alignItems:"center",gap:3}}>
                  <span style={{fontSize:13,fontWeight:700,color:warn?C.red:C.accent,fontFamily:CODE,lineHeight:1}}>{value}</span>
                  {tr!==0&&<span style={{fontSize:8,color:warn?C.red:C.yellow}}>{tr>0?"▲":"▼"}</span>}
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:5,background:`${C.accent}0a`,border:`1px solid ${C.borderBright}`,borderRadius:8,padding:"5px 9px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:9,color:C.textDim,fontFamily:FONT,textTransform:"uppercase",letterSpacing:0.8}}>Боль</span>
              <span style={{fontSize:11,fontWeight:700,fontFamily:CODE,color:ps.pain>7?C.red:ps.pain>4?C.yellow:C.green}}>{r1(ps.pain)}/10</span>
            </div>
            <div style={{display:"flex",gap:2}}>
              {[1,2,3,4,5,6,7,8,9,10].map(n=>(
                <div key={n} style={{flex:1,height:3,borderRadius:2,background:n<=ps.pain?(ps.pain>7?C.red:ps.pain>4?C.yellow:C.green):"rgba(255,255,255,0.07)"}}/>
              ))}
            </div>
          </div>
          {ps.status==="critical"&&<div style={{marginTop:5,background:`${C.red}18`,border:`1px solid ${C.red}55`,borderRadius:8,padding:"5px 10px",fontSize:11,color:C.red,fontWeight:700,animation:"pulse 1s infinite",fontFamily:FONT,textAlign:"center"}}>⚠ КРИТИЧНО</div>}
          {ps.status==="dead"&&<div style={{marginTop:5,background:`${C.red}18`,border:`1px solid ${C.red}55`,borderRadius:8,padding:"5px 10px",fontSize:11,color:C.red,fontWeight:700,fontFamily:FONT,textAlign:"center"}}>💀 ЛЕТАЛЬНЫЙ ИСХОД</div>}
          {ps.status==="stable"&&<div style={{marginTop:5,background:`${C.green}18`,border:`1px solid ${C.green}55`,borderRadius:8,padding:"5px 10px",fontSize:11,color:C.green,fontWeight:700,fontFamily:FONT,textAlign:"center"}}>✓ СТАБИЛИЗИРОВАН</div>}
        </div>

        <div style={{display:"flex",justifyContent:"center",marginBottom:11}}>
          <TimerCircle left={timeLeft} total={totalTime}/>
        </div>

        {/* Steps */}
        <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:11}}>
          {steps.map((s,i)=>{
            const isActive=s.key===phase, isDone=i<activeStep;
            return (
              <div key={s.key} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:9,
                background:isActive?"rgba(0,230,200,0.1)":isDone?"rgba(0,229,160,0.06)":C.btnBg,
                border:`1px solid ${isActive?"rgba(0,230,200,0.22)":isDone?"rgba(0,229,160,0.18)":C.btnBorder}`}}>
                <span style={{fontSize:12}}>{s.icon}</span>
                <span style={{fontSize:11,fontFamily:FONT,flex:1,color:isActive?C.accent:isDone?C.green:C.textDim,fontWeight:isActive?700:400}}>{s.label}</span>
                {isDone&&<span style={{fontSize:10,color:C.green}}>✓</span>}
                {isActive&&<div style={{width:5,height:5,borderRadius:"50%",background:C.accent,boxShadow:`0 0 6px ${C.accent}`}}/>}
              </div>
            );
          })}
        </div>

        <div style={{flex:1}}/>
        <div style={{height:1,background:"rgba(0,230,200,0.06)",margin:"6px 0"}}/>

        {/* Mini event log */}
        <div>
          <div style={{fontSize:9,color:C.textDim,letterSpacing:1.5,marginBottom:5,fontFamily:FONT,fontWeight:600,textTransform:"uppercase"}}>События</div>
          {eventLog.length===0&&<div style={{fontSize:10,color:C.textDim,fontFamily:FONT}}>Нет событий...</div>}
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

      {/* Main area */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,zIndex:1}}>
        <header style={{height:46,flexShrink:0,padding:"0 20px",display:"flex",alignItems:"center",gap:10,
          background:C.headerBg2,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
          borderBottom:"1px solid rgba(0,230,200,0.06)"}}>
          <span style={{fontSize:11,color:C.textDim,fontFamily:FONT}}>МедСим</span>
          <span style={{color:"rgba(255,255,255,0.2)",fontSize:11}}>›</span>
          <span style={{fontSize:12,color:C.accent,fontFamily:FONT,fontWeight:600}}>
            {steps.find(s=>s.key===phase)?.icon} {steps.find(s=>s.key===phase)?.label}
          </span>
          <div style={{flex:1}}/>
          {phase==="awaiting_results"&&allResultsReady&&(
            <Btn onClick={()=>setPhase("diagnose")} color={C.green} style={{padding:"6px 16px",fontSize:12}}>📝 К диагнозу →</Btn>
          )}
        </header>

        <div style={{flex:1,display:"flex",overflow:"hidden",minHeight:0}}>

          {/* ORDER TESTS */}
          {phase==="order_tests"&&(
            <>
              <div style={{flex:1,overflowY:"auto",padding:"14px 16px",minWidth:0}}>
                <div style={{marginBottom:14}}>
                  <div onClick={()=>setShowInfo(v=>!v)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 14px",background:C.panelBg,backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",border:"1px solid rgba(0,230,200,0.1)",borderRadius:showInfo?"14px 14px 0 0":14,cursor:"pointer"}}>
                    <span style={{fontSize:11,color:C.textDim,fontFamily:FONT,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>📋 Анамнез и осмотр</span>
                    <span style={{color:C.textDim,fontSize:11}}>{showInfo?"▲ Свернуть":"▼ Раскрыть"}</span>
                  </div>
                  {showInfo&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",border:"1px solid rgba(0,230,200,0.08)",borderTop:"none",borderRadius:"0 0 14px 14px",overflow:"hidden"}}>
                    {[{icon:"📋",label:"Анамнез",text:cd.anamnesis},{icon:"🔍",label:"Осмотр",text:cd.exam}].map(({icon,label,text},i)=>(
                      <div key={label} style={{background:C.panelBg,backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",padding:"12px 14px",borderLeft:i>0?"1px solid rgba(0,230,200,0.06)":undefined}}>
                        <div style={{fontSize:10,color:C.textDim,textTransform:"uppercase",letterSpacing:1.2,marginBottom:7,fontFamily:FONT,fontWeight:600}}>{icon} {label}</div>
                        <p style={{color:C.text,fontSize:12,lineHeight:1.7,margin:0,fontFamily:FONT}}>{text}</p>
                      </div>
                    ))}
                  </div>}
                </div>
                <div style={{background:C.accentDim,border:"1px solid rgba(0,230,200,0.18)",borderRadius:10,padding:"9px 14px",marginBottom:14,fontSize:12,color:C.accent,lineHeight:1.6,fontFamily:FONT}}>
                  ⚡ Выберите необходимые исследования и отправьте в лабораторию. Экстренное лечение — справа.
                </div>
                <STitle icon="🔬" label="Исследования" color={C.accent}/>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                  {diagCats.map(cat=>(
                    <button key={cat} onClick={()=>setDiagCat(cat)} className="filter-pill" style={{
                      background:diagCat===cat?`${C.accent}1a`:C.btnBg,
                      border:`1px solid ${diagCat===cat?C.accent:"rgba(0,230,200,0.1)"}`,
                      borderRadius:12,padding:"3px 11px",cursor:"pointer",fontFamily:FONT,
                      fontSize:12,color:diagCat===cat?C.accent:C.textDim}}>{DIAG_CAT_LABELS[cat]??cat}</button>
                  ))}
                </div>
                <div>
                  {filtDiag.map(item=>(
                    <CheckRow key={item.id} item={item} selected={selDiag.includes(item.id)}
                      onToggle={id=>setSelDiag(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id])} color={CAT_COLOR[item.cat]||C.accent}/>
                  ))}
                </div>
                <div style={{marginTop:14,paddingTop:12,borderTop:"1px solid rgba(0,230,200,0.06)",
                  display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:13,color:C.textDim,fontFamily:FONT}}>
                    Выбрано: <span style={{color:C.accent,fontWeight:700}}>{selDiag.length}</span> исследований
                  </span>
                  <Btn onClick={handleOrderTests} disabled={selDiag.length===0||processingTests} color={C.accent}>📤 В ЛАБОРАТОРИЮ</Btn>
                </div>
              </div>
              <div style={{width:260,flexShrink:0,borderLeft:"1px solid rgba(0,230,200,0.06)",overflowY:"auto",padding:"14px 12px",background:C.dimBg}}>
                <STitle icon="💊" label="Экстренное лечение" color={C.green}/>
                <div style={{background:C.accentDim,border:"1px solid rgba(0,230,200,0.12)",borderRadius:8,padding:"8px 10px",marginBottom:10,fontSize:12,color:C.accent,lineHeight:1.6,fontFamily:FONT}}>Можно начать немедленно</div>
                <div style={{background:C.redDim,border:"1px solid rgba(255,61,90,0.12)",borderRadius:8,padding:"7px 10px",marginBottom:10,fontSize:12,color:C.red,fontFamily:FONT}}>⚠ Некоторые препараты опасны при данной патологии</div>
                {renderTreatCatFilter()}
                {renderTreatList()}
                {selTreat.length>0&&(
                  <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(0,230,200,0.06)",fontSize:12,color:C.textDim,fontFamily:FONT}}>
                    {appliedFx.size>0&&<div style={{color:C.green,marginBottom:2}}>✓ Применено: {appliedFx.size}</div>}
                    {pendingFx.size>0&&<div style={{color:C.yellow}}>⏳ В действии: {pendingFx.size}</div>}
                  </div>
                )}
              </div>
            </>
          )}

          {/* AWAITING RESULTS */}
          {phase==="awaiting_results"&&(
            <>
              <div style={{flex:1,overflowY:"auto",padding:"14px 16px",minWidth:0}}>
                {!allResultsReady&&(
                  <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",
                    background:C.yellowDim,border:"1px solid rgba(245,200,66,0.22)",
                    borderRadius:10,marginBottom:14,fontSize:13,color:C.yellow,fontFamily:FONT}}>
                    <div style={{width:12,height:12,border:`2px solid ${C.yellow}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}}/>
                    Ожидание результатов... {Object.keys(revealedResults).length} из {orderedDiag.length}
                  </div>
                )}
                {allResultsReady&&(
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",
                    background:C.greenDim,border:"1px solid rgba(0,229,160,0.22)",
                    borderRadius:10,marginBottom:14,fontSize:13,color:C.green,fontFamily:FONT}}>
                    <span>✓ Все результаты получены</span>
                    <Btn onClick={()=>setPhase("diagnose")} color={C.green} style={{padding:"7px 16px",fontSize:13}}>📝 ПОСТАВИТЬ ДИАГНОЗ →</Btn>
                  </div>
                )}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,alignItems:"start"}}>
                  {orderedDiag.map(id=>{
                    const text = revealedResults[id];
                    if (!text) return (
                      <div key={id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",
                        background:"rgba(13,26,46,0.6)",border:"1px solid rgba(0,230,200,0.06)",borderRadius:12,opacity:0.6}}>
                        <div style={{width:9,height:9,border:`2px solid ${C.textDim}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}}/>
                        <span style={{fontSize:13,color:C.textDim,fontFamily:FONT}}>{DIAGNOSTICS.find(d=>d.id===id)?.name||id}...</span>
                      </div>
                    );
                    return <ResultCard key={id} id={id} text={text} isNew={newResultIds.includes(id)}/>;
                  })}
                </div>
              </div>
              <div style={{width:260,flexShrink:0,borderLeft:"1px solid rgba(0,230,200,0.06)",overflowY:"auto",padding:"14px 12px",background:C.dimBg}}>
                <STitle icon="💊" label="Лечение" color={C.green}/>
                <div style={{background:C.redDim,border:"1px solid rgba(255,61,90,0.12)",borderRadius:8,padding:"7px 10px",marginBottom:10,fontSize:12,color:C.red,fontFamily:FONT}}>⚠ Некоторые препараты опасны при данной патологии</div>
                {renderTreatCatFilter()}
                {renderTreatList()}
                {selTreat.length>0&&(
                  <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(0,230,200,0.06)",fontSize:12,color:C.textDim,fontFamily:FONT}}>
                    {appliedFx.size>0&&<div style={{color:C.green,marginBottom:2}}>✓ Применено: {appliedFx.size}</div>}
                    {pendingFx.size>0&&<div style={{color:C.yellow}}>⏳ В действии: {pendingFx.size}</div>}
                  </div>
                )}
              </div>
            </>
          )}

          {/* DIAGNOSE */}
          {phase==="diagnose"&&(
            <>
              <div style={{flex:"0 0 50%",overflowY:"auto",padding:"14px 16px",borderRight:"1px solid rgba(0,230,200,0.06)"}}>
                <STitle icon="📋" label="Результаты исследований" color={C.accent}/>
                {orderedDiag.map(id=>(
                  <ResultCard key={id} id={id} text={revealedResults[id]||""}/>
                ))}
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"14px 16px",minWidth:0}}>
                <div style={{background:C.panelBg,backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",
                  border:"1px solid rgba(157,111,245,0.2)",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                  <STitle icon="🎯" label="Клинический диагноз" color={C.purple}/>
                  <textarea value={diagText} onChange={e=>setDiagText(e.target.value)}
                    placeholder="Сформулируйте диагноз. Напр.: Острый инфаркт миокарда с подъёмом ST нижней стенки. Кардиогенный шок."
                    style={{width:"100%",minHeight:100,background:C.headerBg2,
                      border:`1px solid ${diagText?"rgba(157,111,245,0.4)":"rgba(0,230,200,0.1)"}`,
                      borderRadius:10,padding:"12px 14px",color:C.white,fontSize:13,fontFamily:FONT,
                      resize:"vertical",outline:"none",boxSizing:"border-box",lineHeight:1.8}}/>
                </div>
                <div style={{background:C.panelBg,backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",
                  border:"1px solid rgba(0,230,200,0.08)",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                  <STitle icon="💊" label="Назначения" color={C.green}/>
                  <div style={{background:C.redDim,border:"1px solid rgba(255,61,90,0.12)",borderRadius:8,padding:"7px 10px",marginBottom:10,fontSize:12,color:C.red,fontFamily:FONT}}>⚠ Некоторые препараты противопоказаны при данной патологии</div>
                  {renderTreatCatFilter()}
                  {renderTreatList()}
                  {selTreat.length>0&&(
                    <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(0,230,200,0.06)",fontSize:12,color:C.textDim,fontFamily:FONT}}>
                      {appliedFx.size>0&&<div style={{color:C.green,marginBottom:2}}>✓ Применено: {appliedFx.size}</div>}
                      {pendingFx.size>0&&<div style={{color:C.yellow}}>⏳ В действии: {pendingFx.size}</div>}
                    </div>
                  )}
                </div>
                <div style={{background:C.panelBg,backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)",
                  border:"1px solid rgba(0,230,200,0.08)",borderRadius:14,padding:"12px 16px",
                  display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                  <span style={{fontSize:13,color:C.textDim,fontFamily:FONT}}>
                    {selTreat.length>0
                      ?<span style={{color:C.green}}>💊 Назначено: {selTreat.length} препаратов</span>
                      :<span style={{color:C.yellow}}>⬆ Выберите лечение выше</span>}
                    {pendingFx.size>0&&<span style={{color:C.yellow,marginLeft:8}}>⏳ {pendingFx.size} в действии</span>}
                  </span>
                  <Btn onClick={()=>handleSubmit(false)} disabled={selTreat.length===0} color={C.green} style={{padding:"11px 28px",fontSize:14,flexShrink:0}}>
                    ✓ ЗАВЕРШИТЬ СЛУЧАЙ
                  </Btn>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
