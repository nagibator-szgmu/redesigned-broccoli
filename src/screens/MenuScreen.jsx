import { useState } from "react";
import { createPortal } from "react-dom";
import { C, FONT, SER } from "../ui/theme";
import { CASES } from "../data/cases";

const catMeta = {
  cardiac:{icon:"❤️",label:"Кардиология",color:"#ff3d5a"},
  neuro:{icon:"🧠",label:"Неврология",color:"#9d6ff5"},
  respiratory:{icon:"🫁",label:"Пульмонология",color:"#00e5a0"},
  infectious:{icon:"🦠",label:"Инфекции",color:"#f57c42"},
  metabolic:{icon:"⚗️",label:"Метаболизм",color:"#f5c842"},
  abdominal:{icon:"🔬",label:"Хирургия",color:"#00e6c8"},
};
const navSpec = [
  {icon:"❤️",label:"Кардиология",cat:"cardiac"},
  {icon:"🧠",label:"Неврология",cat:"neuro"},
  {icon:"🫁",label:"Пульмонология",cat:"respiratory"},
  {icon:"🦠",label:"Инфекции",cat:"infectious"},
  {icon:"⚗️",label:"Метаболизм",cat:"metabolic"},
  {icon:"🔬",label:"Хирургия",cat:"abdominal"},
];

export default function MenuScreen({
  startGame, totalScore, casesPlayed,
  searchQuery, setSearchQuery,
  specFilter, setSpecFilter,
  showAllCases, setShowAllCases,
  showNotif, setShowNotif,
  showSettings, setShowSettings,
}) {
  const [notifRead, setNotifRead] = useState(false);
  const [heroMouse, setHeroMouse] = useState({ x: 0.5, y: 0.5, over: false });

  const openNotif = () => { setShowNotif(v=>!v); setShowSettings(false); setNotifRead(true); };

  const onHeroMove = e => {
    const r = e.currentTarget.getBoundingClientRect();
    setHeroMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, over: true });
  };
  const onHeroLeave = () => setHeroMouse(m => ({ ...m, over: false }));

  return (
    <div style={{height:"100vh",background:`linear-gradient(160deg,#070d18 0%,#0a1628 50%,#070f1a 100%)`,
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
      <aside style={{width:220,flexShrink:0,zIndex:10,background:"rgba(10,18,36,0.85)",
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
          background:"rgba(7,13,24,0.7)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
          borderBottom:"1px solid rgba(0,230,200,0.06)",position:"relative"}}>
          <span style={{fontSize:13,color:C.textDim,fontFamily:FONT}}>Главное меню</span>
          <div style={{width:1,height:16,background:"rgba(255,255,255,0.06)"}}/>
          <div style={{flex:1,maxWidth:480,background:"rgba(255,255,255,0.04)",
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
            background:showNotif?"rgba(0,230,200,0.1)":"rgba(255,255,255,0.04)",
            border:`1px solid ${showNotif?"rgba(0,230,200,0.3)":"rgba(0,230,200,0.08)"}`,
            borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <span style={{fontSize:16}}>🔔</span>
            {!notifRead && <div style={{position:"absolute",top:6,right:6,width:7,height:7,background:C.red,borderRadius:"50%",border:"1px solid #070d18"}}/>}
          </div>
          <div onClick={()=>{setShowSettings(v=>!v);setShowNotif(false);}} className="icon-btn" style={{width:38,height:38,
            background:showSettings?"rgba(0,230,200,0.1)":"rgba(255,255,255,0.04)",
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
              background:"rgba(10,18,36,0.98)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
              border:"1px solid rgba(0,230,200,0.2)",borderRadius:16,padding:"16px",
              boxShadow:"0 16px 48px rgba(0,0,0,0.8),0 0 0 1px rgba(0,230,200,0.05)",fontFamily:FONT}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <span style={{fontSize:13,fontWeight:700,color:C.white}}>Уведомления</span>
                <span onClick={()=>setShowNotif(false)} style={{fontSize:12,color:C.textDim,cursor:"pointer",padding:"2px 8px",borderRadius:6,background:"rgba(255,255,255,0.06)"}}>✕</span>
              </div>
              {[
                {icon:"👋",text:"Добро пожаловать в МедСим!",sub:"Начните первую симуляцию"},
                {icon:"🏥",text:`Доступно ${CASES.length} клинических кейсов`,sub:"Кардиология, неврология и другие"},
                {icon:"🏆",text:`Ваш текущий счёт: ${totalScore} очков`,sub:`${casesPlayed} кейсов пройдено`},
              ].map((n,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"10px",borderRadius:10,
                  background:"rgba(255,255,255,0.03)",border:"1px solid rgba(0,230,200,0.08)",marginBottom:i<2?6:0}}>
                  <span style={{fontSize:18,flexShrink:0}}>{n.icon}</span>
                  <div>
                    <div style={{fontSize:12,color:C.white,fontWeight:500}}>{n.text}</div>
                    <div style={{fontSize:11,color:C.textDim,marginTop:2}}>{n.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </>,
          document.body
        )}

        {/* Settings portal */}
        {showSettings && createPortal(
          <>
            <div style={{position:"fixed",inset:0,zIndex:99998}} onClick={()=>setShowSettings(false)}/>
            <div style={{position:"fixed",top:72,right:8,width:280,zIndex:99999,
              background:"rgba(10,18,36,0.98)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
              border:"1px solid rgba(0,230,200,0.2)",borderRadius:16,padding:"16px",
              boxShadow:"0 16px 48px rgba(0,0,0,0.8),0 0 0 1px rgba(0,230,200,0.05)",fontFamily:FONT}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <span style={{fontSize:13,fontWeight:700,color:C.white}}>Настройки</span>
                <span onClick={()=>setShowSettings(false)} style={{fontSize:12,color:C.textDim,cursor:"pointer",padding:"2px 8px",borderRadius:6,background:"rgba(255,255,255,0.06)"}}>✕</span>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Сложность</div>
                <div style={{display:"flex",gap:6}}>
                  {["Лёгкая","Средняя","Сложная"].map((d,i)=>(
                    <button key={d} style={{flex:1,background:i===1?`${C.accent}18`:"transparent",
                      border:`1px solid ${i===1?C.accent:"rgba(0,230,200,0.1)"}`,borderRadius:8,padding:"7px 4px",
                      fontSize:11,color:i===1?C.accent:C.textDim,cursor:"pointer",fontFamily:FONT}}>{d}</button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Тема</div>
                <div style={{display:"flex",gap:6}}>
                  {["Тёмная","Синяя"].map((t,i)=>(
                    <button key={t} style={{flex:1,background:i===0?`${C.accent}18`:"transparent",
                      border:`1px solid ${i===0?C.accent:"rgba(0,230,200,0.1)"}`,borderRadius:8,padding:"7px 4px",
                      fontSize:11,color:i===0?C.accent:C.textDim,cursor:"pointer",fontFamily:FONT}}>{t}</button>
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
                background:"linear-gradient(135deg,#082840 0%,#0a3d2e 55%,#071828 100%)",
                boxShadow:"0 8px 48px rgba(0,0,0,0.6),inset 0 1px 0 rgba(0,230,200,0.06)"}}>
              {/* Grid */}
              <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(0,230,200,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,230,200,0.04) 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
              {/* Interior cursor glow — bright core + soft halo */}
              <div style={{position:"absolute",inset:0,pointerEvents:"none",
                opacity:heroMouse.over?1:0,transition:"opacity 0.6s ease",
                background:`radial-gradient(70px circle at ${heroMouse.x*100}% ${heroMouse.y*100}%, rgba(0,230,200,0.09) 0%, transparent 100%), radial-gradient(280px circle at ${heroMouse.x*100}% ${heroMouse.y*100}%, rgba(0,230,200,0.04) 0%, transparent 100%)`}}/>
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
                <div style={{fontSize:10,color:C.accent,letterSpacing:5,textTransform:"uppercase",marginBottom:10,fontFamily:FONT,fontWeight:600}}>КЛИНИЧЕСКИЙ СИМУЛЯТОР</div>
                <div style={{fontSize:42,fontWeight:700,fontFamily:"Georgia,serif",fontStyle:"italic",lineHeight:1.1,
                  background:`linear-gradient(135deg,${C.accent} 0%,${C.green} 100%)`,
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:12}}>МедСим</div>
                <div style={{fontSize:13,color:"rgba(168,200,224,0.75)",fontFamily:FONT,marginBottom:20,lineHeight:1.6}}>
                  Клинические симуляции нового поколения.<br/>Учитесь принимать решения в критических ситуациях.
                </div>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <button className="start-btn" onClick={startGame} style={{background:C.accent,border:"none",borderRadius:10,
                    padding:"11px 26px",fontSize:14,fontWeight:700,color:C.bg,cursor:"pointer",fontFamily:FONT,
                    letterSpacing:0.3,transition:"all 0.2s",boxShadow:`0 4px 16px rgba(0,230,200,0.3)`}}>▶ Начать</button>
                  <div style={{display:"flex",gap:8}}>
                    {["Анализы","Диагноз","Лечение"].map(t=>(
                      <span key={t} style={{background:"rgba(0,230,200,0.1)",border:"1px solid rgba(0,230,200,0.2)",
                        borderRadius:20,padding:"4px 11px",fontSize:11,color:C.accent,fontFamily:FONT}}>{t}</span>
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
                        background:"rgba(13,26,46,0.7)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",
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
            <div style={{background:"rgba(13,26,46,0.7)",backdropFilter:"blur(16px)",
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
                    <div key={label} style={{textAlign:"center",background:"rgba(255,255,255,0.02)",
                      border:"1px solid rgba(255,255,255,0.04)",borderRadius:14,padding:"14px 8px"}}>
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
              <div style={{display:"flex",alignItems:"center",gap:14,background:"rgba(255,255,255,0.02)",
                border:"1px solid rgba(255,255,255,0.04)",borderRadius:13,padding:"12px 16px"}}>
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
            <div style={{background:"rgba(13,26,46,0.7)",backdropFilter:"blur(16px)",
              border:"1px solid rgba(0,230,200,0.08)",borderRadius:18,padding:"18px 16px",boxShadow:"0 4px 24px rgba(0,0,0,0.3)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <span style={{fontSize:13,fontWeight:600,color:C.white,fontFamily:FONT}}>Недавние сессии</span>
                <span style={{fontSize:11,color:C.accent,fontFamily:FONT,background:"rgba(0,230,200,0.08)",borderRadius:5,padding:"2px 8px",cursor:"pointer"}}>Ещё</span>
              </div>
              {CASES.slice(0,5).map(c=>{
                const cm = catMeta[c.category]||{icon:"🏥",label:c.category,color:C.accent};
                return (
                  <div key={c.id} className="session-row" style={{display:"flex",alignItems:"center",gap:11,
                    padding:"9px 10px",borderRadius:12,marginBottom:4,transition:"background 0.15s",cursor:"pointer"}}>
                    <div style={{width:36,height:36,borderRadius:10,flexShrink:0,background:`${cm.color}15`,
                      border:`1px solid ${cm.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{cm.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,color:C.white,fontFamily:FONT,fontWeight:500,
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.3}}>
                        {c.name.split(" ").slice(0,2).join(" ")}
                      </div>
                      <div style={{fontSize:11,color:C.textDim,fontFamily:FONT,marginTop:2}}>{cm.label}</div>
                    </div>
                    <button onClick={()=>startGame(c.id)} style={{background:"transparent",border:"1px solid rgba(0,230,200,0.25)",
                      borderRadius:8,padding:"4px 12px",fontSize:12,color:C.accent,cursor:"pointer",fontFamily:FONT,flexShrink:0}}>Старт</button>
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
