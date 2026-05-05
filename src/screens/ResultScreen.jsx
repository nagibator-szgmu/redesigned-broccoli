import { createPortal } from "react-dom";
import { C, FONT, CODE, SER } from "../ui/theme";
import { STitle, Btn } from "../ui/components";
import { DIAGNOSTICS, MISSED_TEST_REASONS } from "../data/diagnostics";
import { TREATMENTS, TREAT_FX, ADVERSE_REASONS } from "../data/treatments";
import { r1 } from "../engine/patient";

export default function ResultScreen({ result, cd, ps, orderedDiag, selTreat, diagText, eventLog, setPhase, startGame }) {
  const outcomeMap = {
    stable:{color:C.green,label:"Стабилизирован",icon:"✓"},
    unstable:{color:C.yellow,label:"Нестабилен",icon:"⚠"},
    critical:{color:C.red,label:"Критическое состояние",icon:"🚨"},
    dead:{color:C.red,label:"Летальный исход",icon:"💀"},
    unknown:{color:C.textDim,label:"Неизвестно",icon:"?"},
  };
  const oc = outcomeMap[result.outcome] || outcomeMap.unknown;
  const gCol = {Отлично:C.green,Хорошо:C.accent,Удовлетворительно:C.yellow,Неудовлетворительно:C.red}[result.grade];

  const initSbp = parseInt(cd.vitals.bp);
  const initDbp = parseInt(cd.vitals.bp.split("/")[1]);
  const vitalDeltas = ps ? [
    {label:"АД",init:cd.vitals.bp,final:`${Math.round(ps.sbp)}/${Math.round(ps.dbp)}`,delta:Math.round(ps.sbp)-initSbp,warn:ps.sbp<90||ps.sbp>160},
    {label:"ЧСС",init:cd.vitals.hr,final:Math.round(ps.hr),delta:Math.round(ps.hr)-cd.vitals.hr,warn:ps.hr>100||ps.hr<50},
    {label:"SpO₂",init:`${cd.vitals.spo2}%`,final:`${r1(ps.spo2)}%`,delta:r1(ps.spo2-cd.vitals.spo2),warn:ps.spo2<94},
    {label:"ЧД",init:cd.vitals.rr,final:Math.round(ps.rr),delta:Math.round(ps.rr)-cd.vitals.rr,warn:ps.rr>20},
    {label:"ГКС",init:cd.initialGCS??15,final:Math.round(ps.gcs),delta:r1(ps.gcs-(cd.initialGCS??15)),warn:ps.gcs<10},
    {label:"Боль",init:cd.initialPain??6,final:r1(ps.pain),delta:r1(ps.pain-(cd.initialPain??6)),warn:ps.pain>7},
  ] : [];

  const missedCritical = cd.needDiag.filter(id => !orderedDiag.includes(id));
  const extraTests = orderedDiag.filter(id => !cd.needDiag.includes(id));
  const missedTreat = cd.needTreat.filter(id => !selTreat.includes(id));
  const wrongGiven = cd.wrongTreat.filter(id => selTreat.includes(id));

  return (
    <div style={{height:"100vh",overflowY:"auto",background:C.bg,fontFamily:FONT}}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{background:C.panel,borderBottom:`1px solid ${C.border}`,padding:"12px 28px",display:"flex",alignItems:"center",gap:12}}>
        <div onClick={()=>setPhase("menu")} style={{width:28,height:28,background:`${C.accent}20`,border:`1px solid ${C.accent}44`,
          borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",
          cursor:"pointer",transition:"all 0.2s cubic-bezier(0.16,1,0.3,1)"}}>
          <span style={{fontFamily:SER,fontSize:14,color:C.accent,fontStyle:"italic",fontWeight:700}}>М</span>
        </div>
        <span style={{fontFamily:SER,fontSize:16,color:C.accent,fontStyle:"italic",letterSpacing:1}}>МедСим</span>
        <div style={{width:1,height:18,background:C.border}}/>
        <span style={{fontSize:13,color:C.textDim,fontFamily:FONT}}>Разбор случая</span>
        <div style={{flex:1}}/>
        <Btn onClick={()=>setPhase("menu")} color={C.textDim} style={{padding:"7px 16px",fontSize:12}}>🏠 Меню</Btn>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"24px 20px 80px"}}>

        {/* Score */}
        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:18,
          padding:"28px 32px",marginBottom:14,animation:"fadeIn 0.5s ease",
          display:"flex",alignItems:"center",gap:32}}>
          <div style={{textAlign:"center",flexShrink:0}}>
            <div style={{fontSize:72,fontWeight:700,color:gCol,fontFamily:CODE,lineHeight:1,textShadow:`0 0 40px ${gCol}44`}}>{result.score}</div>
            <div style={{fontSize:12,color:C.textDim,fontFamily:FONT,marginTop:4}}>из 100 баллов</div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:12,letterSpacing:3,color:C.textDim,marginBottom:8,textTransform:"uppercase",fontFamily:FONT}}>
              {cd.name} · {cd.age} л · {cd.gender}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
              <span style={{background:`${gCol}20`,border:`1px solid ${gCol}55`,borderRadius:20,padding:"5px 18px",fontSize:14,color:gCol,fontWeight:700,fontFamily:FONT}}>{result.grade}</span>
              <span style={{background:`${oc.color}20`,border:`1px solid ${oc.color}55`,borderRadius:20,padding:"5px 18px",fontSize:14,color:oc.color,fontWeight:700,fontFamily:FONT}}>{oc.icon} {oc.label}</span>
            </div>
            {result.timeout && <div style={{color:C.red,fontSize:12,fontFamily:FONT}}>⏱ Время истекло</div>}
            {result.died && <div style={{color:C.red,fontSize:12,fontFamily:FONT}}>💀 Пациент погиб в ходе ведения</div>}
          </div>
        </div>

        {/* Vital dynamics */}
        {vitalDeltas.length > 0 && (
          <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:14,padding:16,marginBottom:10}}>
            <STitle icon="📈" label="Динамика показателей" color={C.yellow}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {vitalDeltas.map(({label,init,final,delta,warn})=>{
                const isGood = label==="SpO₂"||label==="ГКС"?delta>=0:label==="Боль"?delta<=0:!warn;
                const dColor = isGood?C.green:(warn?C.red:C.yellow);
                return (
                  <div key={label} style={{background:C.panel2,border:`1px solid ${warn?C.red+"44":C.border}`,borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
                    <div style={{fontSize:11,color:C.textDim,textTransform:"uppercase",marginBottom:4,fontFamily:FONT}}>{label}</div>
                    <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:6}}>
                      <span style={{fontSize:13,color:C.textDim,fontFamily:CODE}}>{init}</span>
                      <span style={{fontSize:11,color:C.textDim}}>→</span>
                      <span style={{fontSize:15,fontWeight:700,color:warn?C.red:C.accent,fontFamily:CODE}}>{final}</span>
                    </div>
                    {delta!==0 && <div style={{fontSize:11,color:dColor,marginTop:2,fontFamily:CODE}}>{delta>0?"+":""}{delta}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Diagnosis */}
        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:14,padding:16,marginBottom:10}}>
          <STitle icon="🎯" label="Диагноз" color={result.diagCorrect?C.green:result.diagPartial?C.yellow:C.red}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div>
              <div style={{fontSize:12,color:C.textDim,marginBottom:5,textTransform:"uppercase",fontFamily:FONT}}>Ваш ответ</div>
              <div style={{color:result.diagCorrect?C.green:result.diagPartial?C.yellow:C.red,fontSize:13,lineHeight:1.6,fontFamily:FONT}}>
                {diagText||<span style={{color:C.textDim,fontStyle:"italic"}}>не указан</span>}
              </div>
            </div>
            <div>
              <div style={{fontSize:12,color:C.textDim,marginBottom:5,textTransform:"uppercase",fontFamily:FONT}}>Правильный диагноз</div>
              <div style={{color:C.green,fontSize:13,lineHeight:1.6,fontFamily:FONT}}>{cd.diagnosis}</div>
            </div>
          </div>
        </div>

        {/* Tests analysis */}
        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:14,padding:16,marginBottom:10}}>
          <STitle icon="🔬" label="Анализ исследований" color={C.accent}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <div style={{fontSize:12,color:C.textDim,marginBottom:6,textTransform:"uppercase",fontFamily:FONT}}>Назначены</div>
              {cd.needDiag.map(id=>{
                const done = orderedDiag.includes(id);
                const name = DIAGNOSTICS.find(d=>d.id===id)?.name||id;
                return <div key={id} style={{fontSize:13,color:done?C.green:C.red,marginBottom:3,fontFamily:FONT}}>{done?"✓":"✗"} {name}</div>;
              })}
              {extraTests.length > 0 && (
                <div style={{marginTop:8}}>
                  <div style={{fontSize:12,color:C.textDim,marginBottom:4,fontFamily:FONT}}>Лишние (не критично):</div>
                  {extraTests.map(id=>(
                    <div key={id} style={{fontSize:12,color:C.textDim,marginBottom:2,fontFamily:FONT}}>· {DIAGNOSTICS.find(d=>d.id===id)?.name||id}</div>
                  ))}
                </div>
              )}
            </div>
            <div>
              {missedCritical.length > 0 && (
                <>
                  <div style={{fontSize:12,color:C.red,marginBottom:6,textTransform:"uppercase",fontFamily:FONT}}>Пропущены критические:</div>
                  {missedCritical.map(id=>{
                    const name = DIAGNOSTICS.find(d=>d.id===id)?.name||id;
                    const reason = MISSED_TEST_REASONS[id];
                    return (
                      <div key={id} style={{background:`${C.redDim}55`,border:`1px solid ${C.red}33`,borderRadius:6,padding:"6px 10px",marginBottom:6}}>
                        <div style={{fontSize:13,color:C.red,marginBottom:reason?3:0,fontFamily:FONT}}>✗ {name}</div>
                        {reason && <div style={{fontSize:12,color:C.text,lineHeight:1.5,fontFamily:FONT}}>{reason}</div>}
                      </div>
                    );
                  })}
                </>
              )}
              {missedCritical.length === 0 && <div style={{color:C.green,fontSize:13,fontFamily:FONT}}>✓ Все ключевые исследования назначены</div>}
            </div>
          </div>
        </div>

        {/* Treatment analysis */}
        <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:14,padding:16,marginBottom:10}}>
          <STitle icon="💊" label="Анализ лечения" color={C.green}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <div style={{fontSize:12,color:C.textDim,marginBottom:6,textTransform:"uppercase",fontFamily:FONT}}>Обязательные препараты</div>
              {cd.needTreat.map(id=>{
                const given = selTreat.includes(id);
                const name = TREATMENTS.find(t=>t.id===id)?.name||id;
                const fx = TREAT_FX[id];
                return (
                  <div key={id} style={{fontSize:13,color:given?C.green:C.red,marginBottom:4,lineHeight:1.4,fontFamily:FONT}}>
                    {given?"✓":"✗"} {name}
                    {given&&fx&&<span style={{fontSize:11,color:C.green,marginLeft:4}}>→ {fx.desc}</span>}
                  </div>
                );
              })}
              {missedTreat.length === 0 && <div style={{color:C.green,fontSize:12,marginTop:4,fontFamily:FONT}}>✓ Все необходимые препараты назначены</div>}
            </div>
            <div>
              {wrongGiven.length > 0 && (
                <>
                  <div style={{fontSize:12,color:C.red,marginBottom:6,textTransform:"uppercase",fontFamily:FONT}}>🚨 Опасные назначения (−15 каждый)</div>
                  {wrongGiven.map(id=>{
                    const name = TREATMENTS.find(t=>t.id===id)?.name||id;
                    const reason = ADVERSE_REASONS[id];
                    return (
                      <div key={id} style={{background:`${C.redDim}77`,border:`1px solid ${C.red}55`,borderRadius:6,padding:"8px 10px",marginBottom:8}}>
                        <div style={{fontSize:13,color:C.red,fontWeight:700,marginBottom:4,fontFamily:FONT}}>🚨 {name}</div>
                        {reason && <div style={{fontSize:12,color:C.text,lineHeight:1.6,fontFamily:FONT}}>{reason}</div>}
                        {!reason && <div style={{fontSize:12,color:C.text,fontFamily:FONT}}>Противопоказан при данной патологии</div>}
                      </div>
                    );
                  })}
                </>
              )}
              {wrongGiven.length === 0 && <div style={{color:C.green,fontSize:13,fontFamily:FONT}}>✓ Опасных назначений нет</div>}
            </div>
          </div>
        </div>

        {/* Clinical tip */}
        <div style={{background:C.panel,border:`1px solid ${C.accentDim}`,borderRadius:14,padding:18,marginBottom:10}}>
          <STitle icon="💡" label="Клинический разбор" color={C.accent}/>
          <p style={{color:C.text,fontSize:13,lineHeight:1.9,margin:0}}>{cd.tip}</p>
        </div>

        {/* Event log */}
        {eventLog.length > 1 && (
          <div style={{background:C.panel,border:`1px solid ${C.border}`,borderRadius:14,padding:14,marginBottom:18}}>
            <STitle icon="📋" label="Хронология событий" color={C.textDim}/>
            <div style={{maxHeight:160,overflowY:"auto"}}>
              {[...eventLog].reverse().map(e=>{
                const col = e.type==="critical"?C.red:e.type==="warning"?C.yellow:e.type==="treatment"?C.green:e.type==="result"?C.accent:C.textDim;
                return (
                  <div key={e.id} style={{display:"flex",gap:10,marginBottom:3}}>
                    <span style={{fontSize:12,color:C.textDim,fontFamily:CODE,flexShrink:0,minWidth:36}}>{e.elapsed}</span>
                    <span style={{fontSize:12,color:col,fontFamily:FONT,lineHeight:1.4}}>{e.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{display:"flex",gap:10}}>
          <button onClick={startGame} style={{flex:1,background:`linear-gradient(135deg,${C.accent},${C.green})`,
            border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:700,
            color:C.bg,cursor:"pointer",fontFamily:FONT,letterSpacing:0.5}}>
            ▶ СЛЕДУЮЩИЙ КЕЙС
          </button>
          <Btn onClick={()=>setPhase("menu")} color={C.textDim} style={{padding:"11px 20px",fontSize:13}}>🏠 Меню</Btn>
        </div>
      </div>
    </div>
  );
}
