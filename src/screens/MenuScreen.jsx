import { useState } from "react";
import { createPortal } from "react-dom";
import { FONT, CODE, SER } from "../ui/theme";
import { useTheme } from "../ui/ThemeContext";
import { CASES } from "../data/cases";
import useIsMobile from "../hooks/useIsMobile";

const catMeta = {
  cardiac:{icon:"❤️",label:"Кардиология",color:"#ff3d5a"},
  neuro:{icon:"🧠",label:"Неврология",color:"#9d6ff5"},
  respiratory:{icon:"🫁",label:"Пульмонология",color:"#00e5a0"},
  infectious:{icon:"🦠",label:"Инфекции",color:"#f57c42"},
  endocrine:{icon:"⚗️",label:"Эндокринология",color:"#f5c842"},
  toxicology:{icon:"☠️",label:"Токсикология",color:"#f57c42"},
  abdominal:{icon:"🔬",label:"Хирургия",color:"#00e6c8"},
};
const navSpec = [
  {icon:"❤️",label:"Кардиология",cat:"cardiac"},
  {icon:"🧠",label:"Неврология",cat:"neuro"},
  {icon:"🫁",label:"Пульмонология",cat:"respiratory"},
  {icon:"🦠",label:"Инфекции",cat:"infectious"},
  {icon:"⚗️",label:"Эндокринология",cat:"endocrine"},
  {icon:"☠️",label:"Токсикология",cat:"toxicology"},
  {icon:"🔬",label:"Хирургия",cat:"abdominal"},
];

function buildNotifications(sessionHistory, casesPlayed, totalScore) {
  const notifs = [];
  const avgScore = casesPlayed ? Math.round(totalScore / casesPlayed) : 0;

  if (casesPlayed === 0) {
    notifs.push({id:"welcome",icon:"👋",text:"Добро пожаловать в МедСим!",sub:"Выберите кейс и начните первую симуляцию"});
    notifs.push({id:"info_cases",icon:"🏥",text:`Доступно ${CASES.length} клинических кейсов`,sub:"Кардиология, неврология, токсикология и другие"});
    return notifs;
  }

  // Last session result
  const last = sessionHistory[0];
  if (last) {
    const gradeEmoji = {Отлично:"🏆",Хорошо:"📈",Удовлетворительно:"📊",Неудовлетворительно:"📉"}[last.grade]||"📊";
    const d = new Date(last.date);
    const dateStr = d.toLocaleDateString("ru-RU",{day:"numeric",month:"short"})+" "+d.toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"});
    notifs.push({id:`ses_${last.id}`,icon:gradeEmoji,text:`${last.caseName.split(" ").slice(0,2).join(" ")} — ${last.score} очков`,sub:`${last.grade} · ${dateStr}`});
  }

  // Died recently
  const diedRecent = sessionHistory.slice(0,3).find(s=>s.died);
  if (diedRecent) {
    notifs.push({id:`died_${diedRecent.id}`,icon:"💀",text:"Пациент погиб в недавней сессии",sub:`${diedRecent.caseName.split(" ").slice(0,2).join(" ")} — повторите кейс`});
  }

  // Milestones
  const milestones = [{n:20,icon:"🌟",t:"20 кейсов — отличный прогресс!"},{n:10,icon:"⭐",t:"10 кейсов пройдено!"},{n:5,icon:"🎯",t:"5 кейсов пройдено!"},{n:1,icon:"🎓",t:"Первый кейс завершён!"}];
  const hit = milestones.find(m=>casesPlayed>=m.n);
  if (hit) notifs.push({id:`ms_${hit.n}`,icon:hit.icon,text:hit.t,sub:`Ср. балл: ${avgScore} · Всего: ${totalScore} очков`});

  // Perfect score
  const best = sessionHistory.find(s=>s.score>=95);
  if (best) notifs.push({id:`perf_${best.id}`,icon:"💎",text:`Идеальный результат: ${best.score}/100`,sub:best.caseName.split(" ").slice(0,2).join(" ")});

  // Unplayed category suggestion
  const playedCats = new Set(sessionHistory.map(s=>s.category));
  const unplayed = Object.entries(catMeta).find(([cat])=>!playedCats.has(cat));
  if (unplayed) {
    const [cat,cm] = unplayed;
    notifs.push({id:`explore_${cat}`,icon:cm.icon,text:`Попробуйте ${cm.label}`,sub:"Вы ещё не проходили кейсы этой специализации"});
  }

  // Low avg score tip
  if (casesPlayed >= 3 && avgScore < 55) {
    notifs.push({id:"tip_debrief",icon:"💡",text:"Читайте разбор после каждого кейса",sub:"Патофизиология и объяснения — во вкладке «Дебриф»"});
  }

  return notifs.slice(0,5);
}

export default function MenuScreen({
  startGame, totalScore, casesPlayed,
  searchQuery, setSearchQuery,
  specFilter, setSpecFilter,
  showAllCases, setShowAllCases,
  showNotif, setShowNotif,
  showSettings, setShowSettings,
  difficulty, setDifficulty,
  theme, setTheme,
  sessionHistory,
}) {
  const C = useTheme();
  const [readNotifIds, setReadNotifIds] = useState(() => new Set(JSON.parse(localStorage.getItem("ms_readNotifs")||"[]")));
  const [heroMouse, setHeroMouse] = useState({ x: 0.5, y: 0.5, over: false });
  const isMobile = useIsMobile();

  const notifications = buildNotifications(sessionHistory, casesPlayed, totalScore);
  const unreadCount = notifications.filter(n => !readNotifIds.has(n.id)).length;

  const openNotif = () => {
    setShowNotif(v=>!v);
    setShowSettings(false);
    setReadNotifIds(prev => {
      const next = new Set([...prev, ...notifications.map(n=>n.id)]);
      localStorage.setItem("ms_readNotifs", JSON.stringify([...next]));
      return next;
    });
  };

  const onHeroMove = e => {
    const r = e.currentTarget.getBoundingClientRect();
    setHeroMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, over: true });
  };
  const onHeroLeave = () => setHeroMouse(m => ({ ...m, over: false }));

  if (isMobile) return (
    <div style={{minHeight:"100vh",background:C.bgGrad,fontFamily:FONT,overflowY:"auto",position:"relative"}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <header style={{position:"sticky",top:0,zIndex:100,height:54,background:C.headerBg,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,230,200,0.06)",display:"flex",alignItems:"center",gap:10,padding:"0 16px"}}>
        <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,rgba(0,230,200,0.2),rgba(0,150,200,0.1))",border:"1px solid rgba(0,230,200,0.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontFamily:SER,fontSize:16,color:C.accent,fontStyle:"italic",fontWeight:700}}>М</span>
        </div>
        <span style={{fontSize:15,fontWeight:700,color:C.white,fontFamily:FONT,letterSpacing:-0.3}}>МедСим</span>
        <div style={{flex:1}}/>
        <div onClick={openNotif} className="icon-btn" style={{position:"relative",width:34,height:34,background:showNotif?"rgba(0,230,200,0.1)":C.btnBg,border:`1px solid ${showNotif?"rgba(0,230,200,0.3)":"rgba(0,230,200,0.08)"}`,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <span style={{fontSize:15}}>🔔</span>
          {unreadCount>0&&<div style={{position:"absolute",top:5,right:5,width:6,height:6,background:C.red,borderRadius:"50%",border:"1px solid #070d18"}}/>}
        </div>
        <div onClick={()=>{setShowSettings(v=>!v);setShowNotif(false);}} className="icon-btn" style={{width:34,height:34,background:showSettings?"rgba(0,230,200,0.1)":C.btnBg,border:`1px solid ${showSettings?"rgba(0,230,200,0.3)":"rgba(0,230,200,0.08)"}`,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <span style={{fontSize:15}}>⚙️</span>
        </div>
      </header>

      {/* Mobile portals (full-width, positioned below header) */}
      {showNotif&&createPortal(<>
        <div style={{position:"fixed",inset:0,zIndex:99998}} onClick={()=>setShowNotif(false)}/>
        <div style={{position:"fixed",top:60,right:12,left:12,zIndex:99999,background:C.overlayBg,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",border:"1px solid rgba(0,230,200,0.2)",borderRadius:16,padding:"16px",boxShadow:"0 16px 48px rgba(0,0,0,0.8)",fontFamily:FONT}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <span style={{fontSize:13,fontWeight:700,color:C.white}}>Уведомления</span>
            <span onClick={()=>setShowNotif(false)} style={{fontSize:12,color:C.textDim,cursor:"pointer",padding:"2px 8px",borderRadius:6,background:C.dimBg}}>✕</span>
          </div>
          {notifications.map((n,i)=>{
            const isNew = !readNotifIds.has(n.id);
            return (
              <div key={n.id} style={{display:"flex",gap:10,padding:"10px",borderRadius:10,background:C.btnBg,border:`1px solid ${isNew?"rgba(0,230,200,0.18)":"rgba(0,230,200,0.08)"}`,marginBottom:i<notifications.length-1?6:0,position:"relative"}}>
                {isNew&&<div style={{position:"absolute",top:8,right:8,width:6,height:6,borderRadius:"50%",background:C.accent}}/>}
                <span style={{fontSize:18,flexShrink:0}}>{n.icon}</span>
                <div><div style={{fontSize:12,color:C.white,fontWeight:500}}>{n.text}</div><div style={{fontSize:11,color:C.textDim,marginTop:2}}>{n.sub}</div></div>
              </div>
            );
          })}
        </div>
      </>,document.body)}
      {showSettings&&createPortal(<>
        <div style={{position:"fixed",inset:0,zIndex:99998}} onClick={()=>setShowSettings(false)}/>
        <div style={{position:"fixed",top:60,right:12,left:12,zIndex:99999,background:C.overlayBg,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",border:"1px solid rgba(0,230,200,0.2)",borderRadius:16,padding:"16px",boxShadow:"0 16px 48px rgba(0,0,0,0.8)",fontFamily:FONT}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <span style={{fontSize:13,fontWeight:700,color:C.white}}>Настройки</span>
            <span onClick={()=>setShowSettings(false)} style={{fontSize:12,color:C.textDim,cursor:"pointer",padding:"2px 8px",borderRadius:6,background:C.dimBg}}>✕</span>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Сложность</div>
            <div style={{display:"flex",gap:6}}>{[{l:"Лёгкая",v:"easy"},{l:"Средняя",v:"normal"},{l:"Сложная",v:"hard"}].map(({l,v})=><button key={v} onClick={()=>setDifficulty(v)} style={{flex:1,background:difficulty===v?`${C.accent}18`:"transparent",border:`1px solid ${difficulty===v?C.accent:"rgba(0,230,200,0.1)"}`,borderRadius:8,padding:"7px 4px",fontSize:11,color:difficulty===v?C.accent:C.textDim,cursor:"pointer",fontFamily:FONT}}>{l}</button>)}</div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Тема</div>
            <div style={{display:"flex",gap:6}}>{[{l:"Тёмная",v:"dark"},{l:"Белая",v:"light"}].map(({l,v})=><button key={v} onClick={()=>setTheme(v)} style={{flex:1,background:theme===v?`${C.accent}18`:"transparent",border:`1px solid ${theme===v?C.accent:"rgba(0,230,200,0.1)"}`,borderRadius:8,padding:"7px 4px",fontSize:11,color:theme===v?C.accent:C.textDim,cursor:"pointer",fontFamily:FONT}}>{l}</button>)}</div>
          </div>
          <div style={{paddingTop:12,borderTop:"1px solid rgba(0,230,200,0.06)",fontSize:11,color:C.textDim,textAlign:"center",opacity:0.7}}>Дополнительные настройки в разработке</div>
        </div>
      </>,document.body)}

      {/* Search */}
      <div style={{padding:"12px 16px 6px"}}>
        <div style={{background:C.btnBg,border:"1px solid rgba(0,230,200,0.1)",borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
          <span style={{color:C.textDim,fontSize:14}}>🔍</span>
          <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Поиск кейсов..." style={{background:"transparent",border:"none",outline:"none",color:C.white,fontSize:13,fontFamily:FONT,flex:1,caretColor:C.accent}}/>
          {searchQuery&&<span onClick={()=>setSearchQuery("")} style={{color:C.textDim,fontSize:13,cursor:"pointer"}}>✕</span>}
        </div>
      </div>

      {/* Spec chips — horizontal scroll */}
      <div className="no-scrollbar" style={{display:"flex",gap:7,overflowX:"auto",padding:"6px 16px 10px"}}>
        <div onClick={()=>setSpecFilter(null)} style={{flexShrink:0,padding:"5px 14px",borderRadius:20,fontSize:12,fontFamily:FONT,cursor:"pointer",background:!specFilter?"rgba(0,230,200,0.15)":C.btnBg,border:`1px solid ${!specFilter?"rgba(0,230,200,0.3)":"rgba(0,230,200,0.1)"}`,color:!specFilter?C.accent:C.textDim}}>Все</div>
        {navSpec.map(({icon,label,cat})=>{
          const isA=specFilter===cat;
          return <div key={cat} onClick={()=>setSpecFilter(isA?null:cat)} style={{flexShrink:0,padding:"5px 14px",borderRadius:20,fontSize:12,fontFamily:FONT,cursor:"pointer",background:isA?"rgba(0,230,200,0.15)":C.btnBg,border:`1px solid ${isA?"rgba(0,230,200,0.3)":"rgba(0,230,200,0.1)"}`,color:isA?C.accent:C.textDim}}>{icon} {label}</div>;
        })}
      </div>

      {/* Hero — compact */}
      <div style={{margin:"0 16px 20px",borderRadius:18,overflow:"hidden",background:C.heroGrad,boxShadow:"0 8px 32px rgba(0,0,0,0.5)",position:"relative",padding:"22px 20px"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(0,230,200,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,230,200,0.03) 1px,transparent 1px)",backgroundSize:"24px 24px",pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <div style={{fontSize:9,color:C.heroLabel,letterSpacing:4,textTransform:"uppercase",marginBottom:8,fontFamily:FONT,fontWeight:600}}>КЛИНИЧЕСКИЙ СИМУЛЯТОР</div>
          <div style={{fontSize:34,fontWeight:700,fontFamily:SER,fontStyle:"italic",lineHeight:1.1,background:C.heroTitleGrad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:8}}>МедСим</div>
          <div style={{fontSize:12,color:C.heroText,fontFamily:FONT,marginBottom:16,lineHeight:1.5}}>Клинические симуляции нового поколения.</div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <button className="start-btn" onClick={startGame} style={{background:C.accent,border:"none",borderRadius:10,padding:"10px 22px",fontSize:14,fontWeight:700,color:C.bg,cursor:"pointer",fontFamily:FONT,letterSpacing:0.3,boxShadow:`0 4px 16px rgba(0,230,200,0.3)`}}>▶ Начать</button>
            {["Анализы","Диагноз","Лечение"].map(t=><span key={t} style={{background:C.heroTagBg,border:`1px solid ${C.heroTagBorder}`,borderRadius:20,padding:"4px 10px",fontSize:11,color:C.heroTagText,fontFamily:FONT}}>{t}</span>)}
          </div>
        </div>
      </div>

      {/* Cases */}
      <div style={{padding:"0 16px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{fontSize:15,fontWeight:700,color:C.white,fontFamily:FONT}}>{specFilter?catMeta[specFilter]?.label:searchQuery?"Результаты поиска":"Клинические кейсы"}</div>
          <div onClick={()=>setShowAllCases(v=>!v)} style={{fontSize:12,color:C.accent,fontFamily:FONT,cursor:"pointer",padding:"4px 11px",borderRadius:8,border:"1px solid rgba(0,230,200,0.2)",background:"rgba(0,230,200,0.06)"}}>
            {showAllCases?"↑ Свернуть":`Все (${CASES.length})`}
          </div>
        </div>
        {(()=>{
          const q=searchQuery.toLowerCase();
          const visible=CASES.filter(c=>{
            if(specFilter&&c.category!==specFilter)return false;
            if(!q)return true;
            return c.name.toLowerCase().includes(q)||c.complaint.toLowerCase().includes(q)||(catMeta[c.category]?.label||"").toLowerCase().includes(q);
          });
          if(visible.length===0)return <div style={{color:C.textDim,fontSize:14,fontFamily:FONT,padding:"20px 0"}}>Ничего не найдено</div>;
          return (
            <div style={{display:"flex",flexDirection:"column",gap:10,paddingBottom:110}}>
              {(specFilter||searchQuery||showAllCases?visible:visible.slice(0,4)).map((c,i)=>{
                const cm=catMeta[c.category]||{icon:"🏥",label:c.category,color:C.accent};
                const sc={critical:C.red,moderate:C.yellow,mild:C.green}[c.severity]||C.yellow;
                const dots={critical:3,moderate:2,mild:1}[c.severity]||2;
                return (
                  <div key={c.id} className="case-card" onClick={()=>startGame(c.id)} style={{background:C.panelBg,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:"1px solid rgba(0,230,200,0.08)",borderRadius:16,padding:"16px",cursor:"pointer",boxShadow:"0 4px 24px rgba(0,0,0,0.35)"}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:10}}>
                      <div style={{width:40,height:40,borderRadius:12,flexShrink:0,background:`${cm.color}18`,border:`1px solid ${cm.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19}}>{cm.icon}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4,flexWrap:"wrap"}}>
                          <span style={{fontSize:11,color:cm.color,fontFamily:FONT,fontWeight:600,textTransform:"uppercase",letterSpacing:0.6}}>{cm.label}</span>
                          <div style={{display:"flex",gap:3}}>{[1,2,3].map(d=><div key={d} style={{width:6,height:6,borderRadius:"50%",background:d<=dots?sc:`${sc}30`}}/>)}</div>
                        </div>
                        <div style={{fontSize:14,fontWeight:600,color:C.white,fontFamily:FONT,marginBottom:4,lineHeight:1.3}}>{c.name}, {c.age} л</div>
                        <div style={{fontSize:12,color:C.textDim,fontFamily:FONT,lineHeight:1.5,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{c.complaint}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:10,borderTop:"1px solid rgba(0,230,200,0.06)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:11,color:C.textDim,fontFamily:FONT}}>⏱ {c.timeLimit} мин</span>
                        <span style={{fontSize:11,color:sc,fontFamily:FONT,background:`${sc}15`,borderRadius:5,padding:"2px 7px"}}>{{critical:"Критический",moderate:"Средний",mild:"Лёгкий"}[c.severity]}</span>
                      </div>
                      <button className="start-btn" onClick={e=>{e.stopPropagation();startGame(c.id);}} style={{background:C.accent,border:"none",borderRadius:9,padding:"7px 18px",fontSize:13,fontWeight:700,color:C.bg,cursor:"pointer",fontFamily:FONT,boxShadow:`0 3px 12px rgba(0,230,200,0.25)`}}>Старт</button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Fixed bottom bar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:90,background:C.headerBg,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:"1px solid rgba(0,230,200,0.1)",padding:"12px 16px"}}>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          {[{v:casesPlayed,l:"Кейсов",c:C.accent},{v:casesPlayed?Math.round(totalScore/casesPlayed):0,l:"Ср. балл",c:C.green},{v:totalScore,l:"Очков",c:C.yellow}].map(({v,l,c})=>(
            <div key={l} style={{flex:1,background:C.btnBg,borderRadius:10,padding:"7px 8px",textAlign:"center"}}>
              <div style={{fontSize:17,fontWeight:700,color:c,fontFamily:CODE,lineHeight:1}}>{v}</div>
              <div style={{fontSize:10,color:C.textDim,fontFamily:FONT,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
        <button className="start-btn" onClick={startGame} style={{background:`linear-gradient(135deg,${C.accent},${C.green})`,border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:700,color:C.bg,cursor:"pointer",fontFamily:FONT,letterSpacing:0.5,width:"100%",boxShadow:`0 6px 24px rgba(0,230,200,0.3)`}}>
          ▶ НОВЫЙ ПАЦИЕНТ
        </button>
      </div>
    </div>
  );

  return (
    <div style={{height:"100vh",background:C.bgGrad,
      display:"flex",fontFamily:FONT,overflow:"hidden",position:"relative"}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glowPulse{0%,100%{opacity:0.5}50%{opacity:1}}
      `}</style>

      {/* Ambient glow */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",left:"-10%",top:"-5%",width:600,height:600,
          background:"radial-gradient(circle,rgba(0,230,200,0.07) 0%,transparent 65%)",borderRadius:"50%"}}/>
        <div style={{position:"absolute",right:"-5%",bottom:"-10%",width:500,height:500,
          background:"radial-gradient(circle,rgba(0,100,200,0.08) 0%,transparent 65%)",borderRadius:"50%"}}/>
      </div>

      {/* Sidebar */}
      <aside style={{width:220,flexShrink:0,zIndex:10,background:C.sidebarBg,
        backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
        borderRight:"1px solid rgba(0,230,200,0.08)",display:"flex",flexDirection:"column",padding:"22px 12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:11,padding:"6px 10px",marginBottom:30}}>
          <div style={{width:38,height:38,borderRadius:11,flexShrink:0,
            background:"linear-gradient(135deg,rgba(0,230,200,0.2),rgba(0,150,200,0.1))",
            border:"1px solid rgba(0,230,200,0.3)",display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 0 20px rgba(0,230,200,0.15)"}}>
            <span style={{fontFamily:SER,fontSize:19,color:C.accent,fontStyle:"italic",fontWeight:700}}>М</span>
          </div>
          <div>
            <div style={{fontSize:17,fontWeight:700,color:C.white,fontFamily:FONT,letterSpacing:-0.3,lineHeight:1}}>МедСим</div>
            <div style={{fontSize:10,color:C.accent,fontFamily:FONT,letterSpacing:1,marginTop:2,opacity:0.7}}>СИМУЛЯТОР</div>
          </div>
        </div>

        <div style={{fontSize:10,color:C.textDim,letterSpacing:1.5,padding:"0 10px",marginBottom:6,fontFamily:FONT,fontWeight:600}}>МЕНЮ</div>
        <div className="nav-item" style={{display:"flex",alignItems:"center",gap:11,padding:"10px 12px",
          borderRadius:11,marginBottom:2,cursor:"default",background:"rgba(0,230,200,0.12)",
          border:"1px solid rgba(0,230,200,0.2)",transition:"all 0.15s"}}>
          <span style={{fontSize:15,width:20,textAlign:"center"}}>▦</span>
          <span style={{fontSize:13,color:C.accent,fontWeight:600,fontFamily:FONT}}>Главное меню</span>
          <div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:C.accent,boxShadow:`0 0 8px ${C.accent}`}}/>
        </div>

        <div style={{fontSize:10,color:C.textDim,letterSpacing:1.5,padding:"0 10px",margin:"18px 0 6px",fontFamily:FONT,fontWeight:600}}>СПЕЦИАЛИЗАЦИИ</div>
        {specFilter && (
          <div onClick={()=>setSpecFilter(null)} className="nav-item" style={{display:"flex",alignItems:"center",gap:8,
            padding:"7px 12px 7px 14px",borderRadius:10,marginBottom:4,cursor:"pointer",transition:"all 0.15s",
            background:"rgba(0,230,200,0.06)",border:"1px solid rgba(0,230,200,0.12)"}}>
            <span style={{fontSize:11,color:C.accent,fontFamily:FONT}}>✕ Сбросить фильтр</span>
          </div>
        )}
        {navSpec.map(({icon,label,cat})=>{
          const isActive = specFilter === cat;
          return (
            <div key={cat} onClick={()=>setSpecFilter(isActive?null:cat)} className="nav-item" style={{
              display:"flex",alignItems:"center",gap:11,padding:"9px 12px 9px 18px",
              borderRadius:10,marginBottom:2,cursor:"pointer",transition:"all 0.15s",
              background:isActive?"rgba(0,230,200,0.1)":"transparent",
              border:`1px solid ${isActive?"rgba(0,230,200,0.2)":"transparent"}`}}>
              <span style={{fontSize:14,width:18,textAlign:"center",opacity:isActive?1:0.5}}>{icon}</span>
              <span style={{fontSize:12,fontFamily:FONT,color:isActive?C.accent:C.text,
                fontWeight:isActive?600:400,opacity:isActive?1:0.7}}>{label}</span>
              {isActive && <div style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:C.accent,boxShadow:`0 0 6px ${C.accent}`}}/>}
            </div>
          );
        })}
        <div style={{flex:1}}/>
      </aside>

      {/* Main area */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,zIndex:1}}>

        {/* Top bar */}
        <header style={{height:66,flexShrink:0,padding:"0 28px",display:"flex",alignItems:"center",gap:16,
          background:C.headerBg2,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
          borderBottom:"1px solid rgba(0,230,200,0.06)",position:"relative"}}>
          <span style={{fontSize:13,color:C.textDim,fontFamily:FONT}}>Главное меню</span>
          <div style={{width:1,height:16,background:C.dimBg}}/>
          <div style={{flex:1,maxWidth:480,background:C.btnBg,
            border:"1px solid rgba(0,230,200,0.1)",borderRadius:12,padding:"10px 16px",
            display:"flex",alignItems:"center",gap:10}}>
            <span style={{color:C.textDim,fontSize:14}}>🔍</span>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
              placeholder="Поиск симуляций, кейсов, специальностей..."
              style={{background:"transparent",border:"none",outline:"none",color:C.white,fontSize:13,fontFamily:FONT,flex:1,caretColor:C.accent}}/>
            {searchQuery && <span onClick={()=>setSearchQuery("")} style={{color:C.textDim,fontSize:13,cursor:"pointer"}}>✕</span>}
          </div>
          <div style={{flex:1}}/>
          <div onClick={openNotif} className="icon-btn" style={{position:"relative",width:38,height:38,
            background:showNotif?"rgba(0,230,200,0.1)":C.btnBg,
            border:`1px solid ${showNotif?"rgba(0,230,200,0.3)":"rgba(0,230,200,0.08)"}`,
            borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <span style={{fontSize:16}}>🔔</span>
            {!notifRead && <div style={{position:"absolute",top:6,right:6,width:7,height:7,background:C.red,borderRadius:"50%",border:"1px solid #070d18"}}/>}
          </div>
          <div onClick={()=>{setShowSettings(v=>!v);setShowNotif(false);}} className="icon-btn" style={{width:38,height:38,
            background:showSettings?"rgba(0,230,200,0.1)":C.btnBg,
            border:`1px solid ${showSettings?"rgba(0,230,200,0.3)":"rgba(0,230,200,0.08)"}`,
            borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <span style={{fontSize:16}}>⚙️</span>
          </div>
        </header>

        {/* Notifications portal */}
        {showNotif && createPortal(
          <>
            <div style={{position:"fixed",inset:0,zIndex:99998}} onClick={()=>setShowNotif(false)}/>
            <div style={{position:"fixed",top:72,right:54,width:300,zIndex:99999,
              background:C.overlayBg,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
              border:"1px solid rgba(0,230,200,0.2)",borderRadius:16,padding:"16px",
              boxShadow:"0 16px 48px rgba(0,0,0,0.8),0 0 0 1px rgba(0,230,200,0.05)",fontFamily:FONT}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <span style={{fontSize:13,fontWeight:700,color:C.white}}>Уведомления</span>
                <span onClick={()=>setShowNotif(false)} style={{fontSize:12,color:C.textDim,cursor:"pointer",padding:"2px 8px",borderRadius:6,background:C.dimBg}}>✕</span>
              </div>
              {notifications.map((n,i)=>{
                const isNew = !readNotifIds.has(n.id);
                return (
                  <div key={n.id} style={{display:"flex",gap:10,padding:"10px",borderRadius:10,
                    background:C.btnBg,border:`1px solid ${isNew?"rgba(0,230,200,0.2)":"rgba(0,230,200,0.08)"}`,marginBottom:i<notifications.length-1?6:0,position:"relative"}}>
                    {isNew&&<div style={{position:"absolute",top:8,right:8,width:6,height:6,borderRadius:"50%",background:C.accent}}/>}
                    <span style={{fontSize:18,flexShrink:0}}>{n.icon}</span>
                    <div>
                      <div style={{fontSize:12,color:C.white,fontWeight:500}}>{n.text}</div>
                      <div style={{fontSize:11,color:C.textDim,marginTop:2}}>{n.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>,
          document.body
        )}

        {/* Settings portal */}
        {showSettings && createPortal(
          <>
            <div style={{position:"fixed",inset:0,zIndex:99998}} onClick={()=>setShowSettings(false)}/>
            <div style={{position:"fixed",top:72,right:8,width:280,zIndex:99999,
              background:C.overlayBg,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
              border:"1px solid rgba(0,230,200,0.2)",borderRadius:16,padding:"16px",
              boxShadow:"0 16px 48px rgba(0,0,0,0.8),0 0 0 1px rgba(0,230,200,0.05)",fontFamily:FONT}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <span style={{fontSize:13,fontWeight:700,color:C.white}}>Настройки</span>
                <span onClick={()=>setShowSettings(false)} style={{fontSize:12,color:C.textDim,cursor:"pointer",padding:"2px 8px",borderRadius:6,background:C.dimBg}}>✕</span>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Сложность</div>
                <div style={{display:"flex",gap:6}}>
                  {[{l:"Лёгкая",v:"easy"},{l:"Средняя",v:"normal"},{l:"Сложная",v:"hard"}].map(({l,v})=>(
                    <button key={v} onClick={()=>setDifficulty(v)} style={{flex:1,background:difficulty===v?`${C.accent}18`:"transparent",
                      border:`1px solid ${difficulty===v?C.accent:"rgba(0,230,200,0.1)"}`,borderRadius:8,padding:"7px 4px",
                      fontSize:11,color:difficulty===v?C.accent:C.textDim,cursor:"pointer",fontFamily:FONT}}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Тема</div>
                <div style={{display:"flex",gap:6}}>
                  {[{l:"Тёмная",v:"dark"},{l:"Белая",v:"light"}].map(({l,v})=>(
                    <button key={v} onClick={()=>setTheme(v)} style={{flex:1,background:theme===v?`${C.accent}18`:"transparent",
                      border:`1px solid ${theme===v?C.accent:"rgba(0,230,200,0.1)"}`,borderRadius:8,padding:"7px 4px",
                      fontSize:11,color:theme===v?C.accent:C.textDim,cursor:"pointer",fontFamily:FONT}}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{paddingTop:12,borderTop:"1px solid rgba(0,230,200,0.06)",fontSize:11,color:C.textDim,textAlign:"center",opacity:0.7}}>
                Дополнительные настройки в разработке
              </div>
            </div>
          </>,
          document.body
        )}

        {/* Content */}
        <div style={{flex:1,display:"flex",overflow:"hidden"}}>
          {/* Center */}
          <div style={{flex:1,overflowY:"auto",padding:"26px 24px 40px"}}>
            {/* Hero */}
            <div
              onMouseMove={onHeroMove}
              onMouseLeave={onHeroLeave}
              style={{position:"relative",borderRadius:23,padding:1,marginBottom:28,
                animation:"fadeUp 0.5s ease",background:"rgba(0,230,200,0.11)"}}>
              {/* Glowing border — follows cursor */}
              <div style={{position:"absolute",inset:0,borderRadius:23,pointerEvents:"none",
                background:`radial-gradient(350px circle at ${heroMouse.x*100}% ${heroMouse.y*100}%, rgba(0,230,200,0.55), transparent 65%)`,
                opacity:heroMouse.over?1:0,transition:"opacity 0.5s ease"}}/>
              {/* Inner card */}
              <div style={{position:"relative",height:220,borderRadius:22,overflow:"hidden",
                background:C.heroGrad,
                boxShadow:"0 8px 48px rgba(0,0,0,0.6),inset 0 1px 0 rgba(0,230,200,0.06)"}}>
              {/* Grid */}
              <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(0,230,200,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,230,200,0.04) 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
              {/* Small cursor glow */}
              <div style={{position:"absolute",inset:0,pointerEvents:"none",
                opacity:heroMouse.over?1:0,transition:"opacity 0.4s ease",
                background:`radial-gradient(78px circle at ${heroMouse.x*100}% ${heroMouse.y*100}%, rgba(0,230,200,0.1) 0%, transparent 100%)`}}/>
              <div style={{position:"absolute",left:"-5%",top:"-20%",width:320,height:320,background:`radial-gradient(circle,${C.accent}12 0%,transparent 65%)`,borderRadius:"50%"}}/>
              <div style={{position:"absolute",right:"-5%",top:"-10%",width:400,height:400,background:"radial-gradient(circle,rgba(0,100,200,0.1) 0%,transparent 65%)",borderRadius:"50%"}}/>
              {/* Animated circle */}
              <div style={{position:"absolute",right:36,top:"50%",transform:"translateY(-50%)",opacity:0.8}}>
                <svg width="170" height="170" viewBox="0 0 170 170">
                  {/* Slowly rotating rings + crosshairs */}
                  <g>
                    <circle cx="85" cy="85" r="75" fill="none" stroke="rgba(0,230,200,0.07)" strokeWidth="1"/>
                    <circle cx="85" cy="85" r="60" fill="none" stroke="rgba(0,230,200,0.1)" strokeWidth="1"/>
                    <circle cx="85" cy="85" r="45" fill="none" stroke="rgba(0,230,200,0.14)" strokeWidth="1"/>
                    <circle cx="85" cy="85" r="30" fill="none" stroke="rgba(0,230,200,0.18)" strokeWidth="1"/>
                    <line x1="85" y1="10" x2="85" y2="160" stroke="rgba(0,230,200,0.05)" strokeWidth="1"/>
                    <line x1="10" y1="85" x2="160" y2="85" stroke="rgba(0,230,200,0.05)" strokeWidth="1"/>
                    <animateTransform attributeName="transform" type="rotate" from="0 85 85" to="360 85 85" dur="30s" repeatCount="indefinite"/>
                  </g>
                  {/* Counter-rotating dashed ring */}
                  <circle cx="85" cy="85" r="68" fill="none" stroke={C.accent} strokeWidth="1" strokeDasharray="6 14" opacity="0.2">
                    <animateTransform attributeName="transform" type="rotate" from="0 85 85" to="-360 85 85" dur="20s" repeatCount="indefinite"/>
                  </circle>
                  {/* Accent arcs — medium rotation */}
                  <g>
                    <path d="M 85 10 A 75 75 0 0 1 152 52" stroke={C.accent} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <path d="M 85 160 A 75 75 0 0 1 18 118" stroke={C.accent} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
                    <circle cx="85" cy="10" r="2.5" fill={C.accent}/>
                    <circle cx="152" cy="52" r="3" fill={C.green}/>
                    <circle cx="160" cy="85" r="2.5" fill={C.accent} opacity="0.6"/>
                    <animateTransform attributeName="transform" type="rotate" from="0 85 85" to="360 85 85" dur="10s" repeatCount="indefinite"/>
                  </g>
                  {/* Orbiting dot — glow */}
                  <circle cx="85" cy="10" r="6" fill={C.accent} opacity="0.15">
                    <animateTransform attributeName="transform" type="rotate" from="0 85 85" to="360 85 85" dur="6s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="85" cy="10" r="3" fill={C.accent}>
                    <animateTransform attributeName="transform" type="rotate" from="0 85 85" to="360 85 85" dur="6s" repeatCount="indefinite"/>
                  </circle>
                  {/* Center dot — pulse */}
                  <circle cx="85" cy="85" r="5" fill={C.accent} opacity="0.9">
                    <animate attributeName="r" values="4;6.5;4" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
                  </circle>
                </svg>
              </div>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 38px",maxWidth:"62%"}}>
                <div style={{fontSize:10,color:C.heroLabel,letterSpacing:5,textTransform:"uppercase",marginBottom:10,fontFamily:FONT,fontWeight:600}}>КЛИНИЧЕСКИЙ СИМУЛЯТОР</div>
                <div style={{fontSize:42,fontWeight:700,fontFamily:"Georgia,serif",fontStyle:"italic",lineHeight:1.1,
                  background:C.heroTitleGrad,
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:12}}>МедСим</div>
                <div style={{fontSize:13,color:C.heroText,fontFamily:FONT,marginBottom:20,lineHeight:1.6}}>
                  Клинические симуляции нового поколения.<br/>Учитесь принимать решения в критических ситуациях.
                </div>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <button className="start-btn" onClick={startGame} style={{background:C.accent,border:"none",borderRadius:10,
                    padding:"11px 26px",fontSize:14,fontWeight:700,color:C.bg,cursor:"pointer",fontFamily:FONT,
                    letterSpacing:0.3,transition:"all 0.2s",boxShadow:`0 4px 16px rgba(0,230,200,0.3)`}}>▶ Начать</button>
                  <div style={{display:"flex",gap:8}}>
                    {["Анализы","Диагноз","Лечение"].map(t=>(
                      <span key={t} style={{background:C.heroTagBg,border:`1px solid ${C.heroTagBorder}`,
                        borderRadius:20,padding:"4px 11px",fontSize:11,color:C.heroTagText,fontFamily:FONT}}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Cases header */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div style={{fontSize:17,fontWeight:700,color:C.white,fontFamily:FONT,letterSpacing:-0.3}}>
                {specFilter?`${catMeta[specFilter]?.label||specFilter}`:searchQuery?"Результаты поиска":"Клинические кейсы"}
              </div>
              <div style={{display:"flex",gap:6}}>
                {specFilter && (
                  <div onClick={()=>setSpecFilter(null)} style={{fontSize:12,color:C.accent,fontFamily:FONT,cursor:"pointer",
                    padding:"5px 13px",borderRadius:8,border:"1px solid rgba(0,230,200,0.25)",background:"rgba(0,230,200,0.1)"}}>✕ Сбросить</div>
                )}
                <div onClick={()=>setShowAllCases(v=>!v)} style={{fontSize:12,color:showAllCases?C.white:C.accent,fontFamily:FONT,cursor:"pointer",
                  padding:"5px 13px",borderRadius:8,
                  border:`1px solid ${showAllCases?"rgba(0,230,200,0.35)":"rgba(0,230,200,0.2)"}`,
                  background:showAllCases?"rgba(0,230,200,0.15)":"rgba(0,230,200,0.06)",fontWeight:showAllCases?600:400}}>
                  {showAllCases?"↑ Свернуть":`Все (${CASES.length})`}
                </div>
              </div>
            </div>

            {/* Cases grid */}
            {(()=>{
              const q = searchQuery.toLowerCase();
              const visible = CASES.filter(c=>{
                if (specFilter && c.category !== specFilter) return false;
                if (!q) return true;
                return c.name.toLowerCase().includes(q)||c.complaint.toLowerCase().includes(q)||(catMeta[c.category]?.label||"").toLowerCase().includes(q);
              });
              if (visible.length === 0) return (
                <div style={{color:C.textDim,fontSize:14,fontFamily:FONT,padding:"20px 0"}}>
                  Ничего не найдено{searchQuery?` по запросу «${searchQuery}»`:` по выбранной специализации`}
                </div>
              );
              return (
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  {(specFilter||searchQuery||showAllCases?visible:visible.slice(0,4)).map((c,i)=>{
                    const cm = catMeta[c.category]||{icon:"🏥",label:c.category,color:C.accent};
                    const sc = {critical:C.red,moderate:C.yellow,mild:C.green}[c.severity]||C.yellow;
                    const dots = {critical:3,moderate:2,mild:1}[c.severity]||2;
                    return (
                      <div key={c.id} className="case-card" onClick={()=>startGame(c.id)} style={{
                        background:C.panelBg,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",
                        border:"1px solid rgba(0,230,200,0.08)",borderRadius:18,padding:"18px 20px",
                        display:"flex",flexDirection:"column",gap:14,cursor:"pointer",
                        boxShadow:"0 4px 24px rgba(0,0,0,0.35)",animation:`fadeUp ${0.35+i*0.08}s ease`}}>
                        <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                          <div style={{width:42,height:42,borderRadius:13,flexShrink:0,background:`${cm.color}18`,
                            border:`1px solid ${cm.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{cm.icon}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5,flexWrap:"wrap"}}>
                              <span style={{fontSize:11,color:cm.color,fontFamily:FONT,fontWeight:600,textTransform:"uppercase",letterSpacing:0.6}}>{cm.label}</span>
                              <div style={{display:"flex",gap:3}}>
                                {[1,2,3].map(d=>(
                                  <div key={d} style={{width:6,height:6,borderRadius:"50%",background:d<=dots?sc:`${sc}30`}}/>
                                ))}
                              </div>
                            </div>
                            <div style={{fontSize:14,fontWeight:600,color:C.white,fontFamily:FONT,marginBottom:5,lineHeight:1.3}}>{c.name}, {c.age} л</div>
                            <div style={{fontSize:12,color:C.textDim,fontFamily:FONT,lineHeight:1.55,overflow:"hidden",
                              textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{c.complaint}</div>
                          </div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:12,borderTop:"1px solid rgba(0,230,200,0.06)"}}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <span style={{fontSize:11,color:C.textDim,fontFamily:FONT}}>⏱ {c.timeLimit} мин</span>
                            <span style={{fontSize:11,color:sc,fontFamily:FONT,background:`${sc}15`,borderRadius:5,padding:"2px 7px"}}>
                              {{critical:"Критический",moderate:"Средний",mild:"Лёгкий"}[c.severity]}
                            </span>
                          </div>
                          <button className="start-btn" onClick={e=>{e.stopPropagation();startGame(c.id);}} style={{
                            background:C.accent,border:"none",borderRadius:9,padding:"8px 20px",fontSize:13,fontWeight:700,
                            color:C.bg,cursor:"pointer",fontFamily:FONT,transition:"all 0.2s",boxShadow:`0 3px 12px rgba(0,230,200,0.25)`}}>Старт</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Right column */}
          <div style={{width:280,flexShrink:0,overflowY:"auto",padding:"26px 20px 40px 4px",display:"flex",flexDirection:"column",gap:14}}>
            {/* Progress */}
            <div style={{background:C.panelBg,backdropFilter:"blur(16px)",
              border:"1px solid rgba(0,230,200,0.08)",borderRadius:18,padding:"18px 14px",boxShadow:"0 4px 24px rgba(0,0,0,0.3)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <span style={{fontSize:11,color:C.textDim,textTransform:"uppercase",letterSpacing:1.2,fontFamily:FONT,fontWeight:600}}>Прогресс</span>
                <span style={{fontSize:11,color:C.accent,fontFamily:FONT,background:"rgba(0,230,200,0.1)",borderRadius:5,padding:"2px 8px"}}>Серия</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                {[
                  {value:casesPlayed,max:CASES.length,label:"Кейсов",color:C.accent},
                  {value:casesPlayed?Math.round(totalScore/casesPlayed):0,max:100,label:"Ср. балл",color:C.green},
                ].map(({value,max,label,color})=>{
                  const pct = max>0?Math.min(value/max,1):0;
                  const r=30,circ=2*Math.PI*r;
                  return (
                    <div key={label} style={{textAlign:"center",background:C.btnBg,
                      border:`1px solid ${C.btnBorder}`,borderRadius:14,padding:"14px 8px"}}>
                      <div style={{position:"relative",width:72,height:72,margin:"0 auto 10px"}}>
                        <svg width="72" height="72" style={{transform:"rotate(-90deg)",display:"block"}}>
                          <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4.5"/>
                          <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="4.5"
                            strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round"
                            style={{filter:`drop-shadow(0 0 6px ${color}88)`,transition:"stroke-dashoffset 0.8s ease"}}/>
                        </svg>
                        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                          <div style={{fontSize:20,fontWeight:700,color,fontFamily:"'SF Mono','Menlo',monospace",lineHeight:1}}>{value}</div>
                        </div>
                      </div>
                      <div style={{fontSize:11,color:C.textDim,fontFamily:FONT,textTransform:"uppercase",letterSpacing:0.8}}>{label}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:14,background:C.btnBg,
                border:`1px solid ${C.btnBorder}`,borderRadius:13,padding:"12px 16px"}}>
                <div style={{width:46,height:46,borderRadius:12,flexShrink:0,
                  background:`linear-gradient(135deg,${C.yellow}25,${C.orange}15)`,border:`1px solid ${C.yellow}30`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🏆</div>
                <div>
                  <div style={{fontSize:26,fontWeight:700,color:C.yellow,fontFamily:"'SF Mono','Menlo',monospace",lineHeight:1}}>{totalScore}</div>
                  <div style={{fontSize:11,color:C.textDim,fontFamily:FONT,marginTop:3}}>очков всего</div>
                </div>
              </div>
            </div>
            <button className="start-btn" onClick={startGame} style={{background:`linear-gradient(135deg,${C.accent},${C.green})`,
              border:"none",borderRadius:14,padding:"16px",fontSize:15,fontWeight:700,color:C.bg,cursor:"pointer",
              fontFamily:FONT,letterSpacing:0.5,width:"100%",boxShadow:`0 6px 24px rgba(0,230,200,0.3)`,transition:"all 0.2s"}}>
              ▶ НОВЫЙ ПАЦИЕНТ
            </button>
            {/* Recent sessions */}
            <div style={{background:C.panelBg,backdropFilter:"blur(16px)",
              border:"1px solid rgba(0,230,200,0.08)",borderRadius:18,padding:"18px 16px",boxShadow:"0 4px 24px rgba(0,0,0,0.3)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <span style={{fontSize:13,fontWeight:600,color:C.white,fontFamily:FONT}}>Недавние сессии</span>
                <span onClick={()=>setShowAllCases(true)} style={{fontSize:11,color:C.accent,fontFamily:FONT,background:"rgba(0,230,200,0.08)",borderRadius:5,padding:"2px 8px",cursor:"pointer"}}>Все кейсы</span>
              </div>
              {sessionHistory.length === 0 ? (
                <div style={{color:C.textDim,fontSize:12,fontFamily:FONT,textAlign:"center",padding:"10px 0",lineHeight:1.6}}>
                  История пуста.<br/>Начните первый кейс!
                </div>
              ) : sessionHistory.slice(0,5).map(s=>{
                const cm = catMeta[s.category]||{icon:"🏥",color:C.accent};
                const gradeColor = {Отлично:C.green,Хорошо:C.accent,Удовлетворительно:C.yellow,Неудовлетворительно:C.red}[s.grade]||C.accent;
                const dateStr = new Date(s.date).toLocaleDateString("ru-RU",{day:"numeric",month:"short"});
                return (
                  <div key={s.id} className="session-row" style={{display:"flex",alignItems:"center",gap:11,
                    padding:"9px 10px",borderRadius:12,marginBottom:4,transition:"background 0.15s",cursor:"pointer"}}>
                    <div style={{width:36,height:36,borderRadius:10,flexShrink:0,background:`${cm.color}15`,
                      border:`1px solid ${cm.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{cm.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,color:C.white,fontFamily:FONT,fontWeight:500,
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.3}}>
                        {s.caseName.split(" ").slice(0,2).join(" ")}
                      </div>
                      <div style={{fontSize:11,color:C.textDim,fontFamily:FONT,marginTop:2}}>{dateStr} · <span style={{color:gradeColor}}>{s.score} очков</span></div>
                    </div>
                    <button onClick={()=>startGame(s.caseId)} style={{background:"transparent",border:"1px solid rgba(0,230,200,0.25)",
                      borderRadius:8,padding:"4px 12px",fontSize:12,color:C.accent,cursor:"pointer",fontFamily:FONT,flexShrink:0}}>Ещё раз</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
