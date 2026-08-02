import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FONT, CODE, SER } from "../ui/theme";
import { useTheme } from "../ui/ThemeContext";
import { useLocale } from "../locale/LocaleContext";
import { useTranslate } from "../locale/useTranslate";
import { useAuth } from "../context/AuthContext";
import { CASES } from "../data/cases";
import { IS_DEV_MODE } from "../config";
import { getVisibleCases } from "../hooks/useReviewRegistry";
import useIsMobile from "../hooks/useIsMobile";
import ThreeDTicker from "../components/ThreeDTicker";

const makeCatMeta = (t) => ({
  cardiac:{icon:"❤️",label:t("spec.cardiac"),color:"#ff3d5a"},
  neuro:{icon:"🧠",label:t("spec.neuro"),color:"#9d6ff5"},
  respiratory:{icon:"🫁",label:t("spec.respiratory"),color:"#00e5a0"},
  infectious:{icon:"🦠",label:t("spec.infectious"),color:"#f57c42"},
  endocrine:{icon:"⚗️",label:t("spec.endocrine"),color:"#f5c842"},
  toxicology:{icon:"☠️",label:t("spec.toxicology"),color:"#f57c42"},
  abdominal:{icon:"🔬",label:t("spec.abdominal"),color:"#00e6c8"},
});
const makeNavSpec = (t) => [
  {icon:"❤️",label:t("spec.cardiac"),cat:"cardiac"},
  {icon:"🧠",label:t("spec.neuro"),cat:"neuro"},
  {icon:"🫁",label:t("spec.respiratory"),cat:"respiratory"},
  {icon:"🦠",label:t("spec.infectious"),cat:"infectious"},
  {icon:"⚗️",label:t("spec.endocrine"),cat:"endocrine"},
  {icon:"☠️",label:t("spec.toxicology"),cat:"toxicology"},
  {icon:"🔬",label:t("spec.abdominal"),cat:"abdominal"},
];

const DEPT_FILTERS = (t) => [
  {key:"all",label:t("department.all"),icon:"🏥"},
  {key:"icu",label:t("department.icu"),icon:"🚑"},
  {key:"admission",label:t("department.admission"),icon:"🩻"},
  {key:"outpatient",label:t("department.outpatient"),icon:"🩺"},
  {key:"stationary",label:t("department.stationary"),icon:"🛏️"},
];

function buildNotifications(sessionHistory, casesPlayed, totalScore, t, catMeta) {
  const notifs = [];
  const avgScore = casesPlayed ? Math.round(totalScore / casesPlayed) : 0;

  if (casesPlayed === 0) {
    notifs.push({id:"welcome",icon:"👋",text:t("notifications.welcome"),sub:t("notifications.welcomeSub")});
    notifs.push({id:"info_cases",icon:"🏥",text:t("notifications.casesAvailable",{n:CASES.length}),sub:t("notifications.casesSub")});
    return notifs;
  }

  // Last session result
  const last = sessionHistory[0];
  if (last) {
    const gradeEmoji = t(`gradeEmoji.${last.gradeId}`)||"📊";
    const d = new Date(last.date);
    const dateStr = d.toLocaleDateString("ru-RU",{day:"numeric",month:"short"})+" "+d.toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"});
    notifs.push({id:`ses_${last.id}`,icon:gradeEmoji,text:t("notifications.sessionResult",{name:last.caseName.split(" ").slice(0,2).join(" "),score:last.score}),sub:`${t(`grades.${last.gradeId}`)} · ${dateStr}`});
  }

  // Died recently
  const diedRecent = sessionHistory.slice(0,3).find(s=>s.died);
  if (diedRecent) {
    notifs.push({id:`died_${diedRecent.id}`,icon:"💀",text:t("notifications.died"),sub:`${diedRecent.caseName.split(" ").slice(0,2).join(" ")} — ${t("notifications.repeatCase")}`});
  }

  // Milestones
  const milestones = [{n:20,icon:"🌟",text:t("notifications.milestone20")},{n:10,icon:"⭐",text:t("notifications.milestone10")},{n:5,icon:"🎯",text:t("notifications.milestone5")},{n:1,icon:"🎓",text:t("notifications.milestone1")}];
  const hit = milestones.find(m=>casesPlayed>=m.n);
  if (hit) notifs.push({id:`ms_${hit.n}`,icon:hit.icon,text:hit.text,sub:t("notifications.avgScore",{avg:avgScore,total:totalScore})});

  // Perfect score
  const best = sessionHistory.find(s=>s.score>=95);
  if (best) notifs.push({id:`perf_${best.id}`,icon:"💎",text:t("notifications.perfect",{score:best.score}),sub:best.caseName.split(" ").slice(0,2).join(" ")});

  // Unplayed category suggestion
  const playedCats = new Set(sessionHistory.map(s=>s.category));
  const unplayed = Object.entries(catMeta).find(([cat])=>!playedCats.has(cat));
  if (unplayed) {
    const [cat,cm] = unplayed;
    notifs.push({id:`explore_${cat}`,icon:cm.icon,text:t("notifications.tryCategory",{name:cm.label}),sub:t("notifications.notPlayedYet")});
  }

  // Low avg score tip
  if (casesPlayed >= 3 && avgScore < 55) {
    notifs.push({id:"tip_debrief",icon:"💡",text:t("notifications.readDebrief"),sub:t("notifications.debriefSub")});
  }

  return notifs.slice(0,5);
}

export default function MenuScreen({
  startGame, setPhase, totalScore, casesPlayed,
  searchQuery, setSearchQuery,
  department, setDepartment,
  specFilter, setSpecFilter,
  showAllCases, setShowAllCases,
  showNotif, setShowNotif,
  showSettings, setShowSettings,
  difficulty, setDifficulty,
  gameMode, setGameMode,
  theme, setTheme,
  learningMode, setLearningMode,
  assessmentMode, setAssessmentMode,
  progressionMode, setProgressionMode,
  audioEnabled, setAudioEnabled,
  hideWarnings, setHideWarnings,
  sessionHistory,
  isDevMode,
  checkDeptTutorial,
  forceShowDeptTutorial,
  restartTutorial,
  showTutorialTips,
}) {
  const C = useTheme();
  const { logout } = useAuth();
  const { locale, setLocale: setLocaleGlobal, LOCALES } = useLocale();
  const { t } = useTranslate();
  const catMeta = makeCatMeta(t);
  const navSpec = makeNavSpec(t);
  const deptFilters = DEPT_FILTERS(t);
  const [readNotifIds, setReadNotifIds] = useState(() => new Set(JSON.parse(localStorage.getItem("ms_readNotifs")||"[]")));
  const [llmProvider, setLlmProvider] = useState(() => localStorage.getItem("ms_llm_provider") || "gemini");
  const [llmKey, setLlmKey] = useState(() => localStorage.getItem("ms_llm_key") || "");
  const [showDevSettings, setShowDevSettings] = useState(false);
  const [heroMouse, setHeroMouse] = useState({ x: 0.5, y: 0.5, over: false });
  const [searchFocused, setSearchFocused] = useState(false);
  const [theorySearchFocused, setTheorySearchFocused] = useState(false);
  const [showTutorialMenu, setShowTutorialMenu] = useState(false);
  const tutorialMenuRef = useRef(null);
  useEffect(() => {
    if (!showTutorialMenu) return;
    const handler = (e) => {
      if (tutorialMenuRef.current && !tutorialMenuRef.current.contains(e.target)) {
        setShowTutorialMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showTutorialMenu]);
  const isMobile = useIsMobile();

  const notifications = buildNotifications(sessionHistory, casesPlayed, totalScore, t, catMeta);
  const unreadCount = notifications.filter(n => !readNotifIds.has(n.id)).length;
  const caseScores = {};
  sessionHistory.forEach(s => {
    if (!caseScores[s.caseId] || s.score > caseScores[s.caseId]) caseScores[s.caseId] = s.score;
  });

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
        <span style={{fontSize:15,fontWeight:700,color:C.white,fontFamily:FONT,letterSpacing:-0.3}}>{t("brand.name")}</span>
        <div style={{flex:1}}/>
        <div onClick={()=>setPhase("theory")} className="icon-btn" style={{width:34,height:34,background:C.btnBg,border:"1px solid rgba(0,230,200,0.08)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <span style={{fontSize:15}}>📚</span>
        </div>
        <div onClick={()=>{setProgressionMode("strict");setPhase("theory");}} className="icon-btn" style={{width:34,height:34,background:progressionMode==="strict"?`${C.accent}20`:C.btnBg,border:`1px solid ${progressionMode==="strict"?`${C.accent}30`:"rgba(0,230,200,0.08)"}`,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <span style={{fontSize:15}}>🎯</span>
        </div>
        <div onClick={()=>setPhase("map")} className="icon-btn" style={{width:34,height:34,background:C.btnBg,border:"1px solid rgba(0,230,200,0.08)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <span style={{fontSize:15}}>🗺️</span>
        </div>
        <div onClick={()=>setPhase("leaderboard")} className="icon-btn" style={{width:34,height:34,background:C.btnBg,border:"1px solid rgba(0,230,200,0.08)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <span style={{fontSize:15}}>🏆</span>
        </div>
        <div onClick={()=>setPhase("certificates")} className="icon-btn" style={{width:34,height:34,background:C.btnBg,border:"1px solid rgba(0,230,200,0.08)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <span style={{fontSize:15}}>🎓</span>
        </div>
        <div onClick={()=>setPhase("teacher_dashboard")} className="icon-btn" style={{width:34,height:34,background:C.btnBg,border:"1px solid rgba(0,230,200,0.08)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} title="Кабинет преподавателя">
          <span style={{fontSize:15}}>📊</span>
        </div>
        <div onClick={openNotif} className="icon-btn" style={{position:"relative",width:34,height:34,background:showNotif?`${C.accent}1a`:C.btnBg,border:`1px solid ${showNotif?`${C.accent}55`:"rgba(0,230,200,0.08)"}`,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <span style={{fontSize:15,display:"inline-flex",alignItems:"center",justifyContent:"center",width:15,height:15,lineHeight:1}}>🔔</span>
          {unreadCount>0&&<div style={{position:"absolute",top:5,right:5,width:6,height:6,background:C.red,borderRadius:"50%",border:"1px solid #070d18"}}/>}
        </div>
        <div id="tutorial-other" onClick={()=>{setShowSettings(v=>!v);setShowNotif(false);}} className="icon-btn" style={{width:34,height:34,background:showSettings?`${C.accent}1a`:C.btnBg,border:`1px solid ${showSettings?`${C.accent}55`:"rgba(0,230,200,0.08)"}`,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <span style={{fontSize:15,display:"inline-flex",alignItems:"center",justifyContent:"center",width:15,height:15,lineHeight:1}}>⚙️</span>
        </div>
        <div onClick={logout} className="icon-btn" style={{width:34,height:34,background:C.btnBg,border:"1px solid rgba(0,230,200,0.08)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <span style={{fontSize:15,display:"inline-flex",alignItems:"center",justifyContent:"center",width:15,height:15,lineHeight:1}}>🚪</span>
        </div>
      </header>

      {/* Mobile portals (full-width, positioned below header) */}
      {showNotif&&createPortal(<>
        <div style={{position:"fixed",inset:0,zIndex:99998}} onClick={()=>setShowNotif(false)}/>
        <div style={{position:"fixed",top:60,right:12,left:12,zIndex:99999,background:C.overlayBg,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",border:"1px solid rgba(0,230,200,0.2)",borderRadius:16,padding:"16px",boxShadow:"0 16px 48px rgba(0,0,0,0.8)",fontFamily:FONT}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <span style={{fontSize:13,fontWeight:700,color:C.white}}>{t("notifications.title")}</span>
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
            <span style={{fontSize:13,fontWeight:700,color:C.white}}>{t("settings.title")}</span>
            <span onClick={()=>setShowSettings(false)} style={{fontSize:12,color:C.textDim,cursor:"pointer",padding:"2px 8px",borderRadius:6,background:C.dimBg}}>✕</span>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{t("settings.difficulty")}</div>
            <div style={{display:"flex",gap:6}}>{[{l:t("settings.easy"),v:"easy"},{l:t("settings.normal"),v:"normal"},{l:t("settings.hard"),v:"hard"}].map(({l,v})=><button key={v} onClick={()=>setDifficulty(v)} style={{flex:1,background:difficulty===v?`${C.accent}18`:"transparent",border:`1px solid ${difficulty===v?C.accent:"rgba(0,230,200,0.1)"}`,borderRadius:8,padding:"7px 4px",fontSize:11,color:difficulty===v?C.accent:C.textDim,cursor:"pointer",fontFamily:FONT}}>{l}</button>)}</div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{t("settings.gameMode")}</div>
            <div style={{display:"flex",gap:6}}>{[{l:t("settings.modeNormal"),v:"normal",d:t("settings.modeNormalDesc")},{l:t("settings.modeRandom"),v:"random",d:t("settings.modeRandomDesc")},{l:t("settings.modeStress"),v:"stress",d:t("settings.modeStressDesc")}].map(({l,v,d})=><button key={v} onClick={()=>setGameMode(v)} style={{flex:1,background:gameMode===v?`${C.accent}18`:"transparent",border:`1px solid ${gameMode===v?C.accent:"rgba(0,230,200,0.1)"}`,borderRadius:8,padding:"7px 4px",textAlign:"center",cursor:"pointer",fontFamily:FONT}}><div style={{fontSize:11,color:gameMode===v?C.accent:C.textDim,marginBottom:2}}>{l}</div><div style={{fontSize:9,color:C.textDim,opacity:0.7}}>{d}</div></button>)}</div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{t("settings.theme")}</div>
            <div style={{display:"flex",gap:6}}>{[{l:t("settings.dark"),v:"dark"},{l:t("settings.light"),v:"light"}].map(({l,v})=><button key={v} onClick={()=>setTheme(v)} style={{flex:1,background:theme===v?`${C.accent}18`:"transparent",border:`1px solid ${theme===v?C.accent:"rgba(0,230,200,0.1)"}`,borderRadius:8,padding:"7px 4px",fontSize:11,color:theme===v?C.accent:C.textDim,cursor:"pointer",fontFamily:FONT}}>{l}</button>)}</div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{t("settings.langLabel")}</div>
            <div style={{display:"flex",gap:6}}>{Object.entries(LOCALES).map(([v,l])=><button key={v} onClick={()=>setLocaleGlobal(v)} style={{flex:1,background:locale===v?`${C.accent}18`:"transparent",border:`1px solid ${locale===v?C.accent:"rgba(0,230,200,0.1)"}`,borderRadius:8,padding:"7px 4px",fontSize:11,color:locale===v?C.accent:C.textDim,cursor:"pointer",fontFamily:FONT}}>{l}</button>)}</div>
          </div>
          <div style={{ marginBottom: 14, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div 
              onClick={() => setShowDevSettings(prev => !prev)} 
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "4px 0" }}
            >
              <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 1 }}>
                🛠️ Для разработчиков (Свой ключ)
              </div>
              <span style={{ fontSize: 10, color: C.textDim }}>{showDevSettings ? "▲" : "▼"}</span>
            </div>
            {showDevSettings && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                  {[{ l: "Gemini", v: "gemini" }, { l: "OpenAI", v: "openai" }, { l: "OpenRouter", v: "openrouter" }].map(({ l, v }) => (
                    <button key={v} onClick={() => { setLlmProvider(v); localStorage.setItem("ms_llm_provider", v); }} style={{
                      flex: 1, background: llmProvider === v ? `${C.accent}18` : "transparent",
                      border: `1px solid ${llmProvider === v ? C.accent : "rgba(0,230,200,0.1)"}`, borderRadius: 8, padding: "7px 4px",
                      fontSize: 11, color: llmProvider === v ? C.accent : C.textDim, cursor: "pointer", fontFamily: FONT
                    }}>{l}</button>
                  ))}
                </div>
                <div style={{ background: C.inputBg || "rgba(7,13,24,0.6)", border: "1px solid rgba(0,230,200,0.15)", borderRadius: 8, padding: "5px 10px", display: "flex", alignItems: "center", marginBottom: llmProvider === "openrouter" ? 6 : 0 }}>
                  <input 
                    type="password" 
                    value={llmKey} 
                    onChange={e => { setLlmKey(e.target.value); localStorage.setItem("ms_llm_key", e.target.value); }} 
                    placeholder="Свой API-ключ (необязательно)..." 
                    style={{ background: "transparent", border: "none", outline: "none", color: C.white, fontSize: 11, fontFamily: FONT, flex: 1 }}
                  />
                  {llmKey && <span onClick={() => { setLlmKey(""); localStorage.setItem("ms_llm_key", ""); }} style={{ color: C.textDim, fontSize: 11, cursor: "pointer", marginLeft: 5 }}>✕</span>}
                </div>
                {llmProvider === "openrouter" && (
                  <div style={{ fontSize: 9, color: C.textDim, lineHeight: 1.3, marginTop: 4 }}>
                    Для бесплатной игры без VPN зарегистрируйтесь на <a href="https://openrouter.ai" target="_blank" rel="noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>openrouter.ai</a>, создайте бесплатный ключ (API Key) в разделе Keys и вставьте его сюда.
                  </div>
                )}
              </div>
            )}
          </div>
          <div style={{marginBottom:14}}>
            <div onClick={()=>setLearningMode(v=>!v)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",background:learningMode?`${C.yellow}12`:"transparent",border:`1px solid ${learningMode?`${C.yellow}44`:"rgba(0,230,200,0.1)"}`,borderRadius:8,cursor:"pointer"}}>
              <div>
                <div style={{fontSize:12,color:learningMode?C.yellow:C.text,fontWeight:600,fontFamily:FONT}}>📚 {t("settings.learningMode")}</div>
                <div style={{fontSize:10,color:C.textDim,fontFamily:FONT,marginTop:2}}>{t("settings.learningModeDesc")}</div>
              </div>
              <div style={{width:36,height:20,borderRadius:10,background:learningMode?C.yellow:`${C.textDim}30`,position:"relative",transition:"background 0.2s",flexShrink:0}}>
                <div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:learningMode?18:2,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}/>
              </div>
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <div onClick={()=>setAssessmentMode(v=>!v)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",background:assessmentMode?`${C.green}12`:"transparent",border:`1px solid ${assessmentMode?`${C.green}44`:"rgba(0,230,200,0.1)"}`,borderRadius:8,cursor:"pointer"}}>
              <div>
                <div style={{fontSize:12,color:assessmentMode?C.green:C.text,fontWeight:600,fontFamily:FONT}}>✅ {t("settings.assessmentMode")}</div>
                <div style={{fontSize:10,color:C.textDim,fontFamily:FONT,marginTop:2}}>{t("settings.assessmentModeDesc")}</div>
              </div>
              <div style={{width:36,height:20,borderRadius:10,background:assessmentMode?C.green:`${C.textDim}30`,position:"relative",transition:"background 0.2s",flexShrink:0}}>
                <div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:assessmentMode?18:2,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}/>
              </div>
            </div>
          </div>
          <div style={{paddingTop:12,borderTop:"1px solid rgba(0,230,200,0.06)",fontSize:11,color:C.textDim,textAlign:"center",opacity:0.7}}>{t("settings.moreComing")}</div>
        </div>
      </>,document.body)}

      {/* Search */}
      <div style={{padding:"12px 16px 6px"}}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: C.panel,
          border: `1px solid ${searchFocused ? `${C.accent}55` : C.border}`,
          boxShadow: searchFocused ? `0 0 16px -2px ${C.accent}15, 0 4px 20px rgba(0,0,0,0.3)` : "none",
          borderRadius: 12,
          padding: "8px 12px",
          marginBottom: 20,
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          <span style={{ fontSize: 14 }}>🔍</span>
          <input 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder={t("search.placeholder")} 
            style={{ background: "transparent", border: "none", outline: "none", color: C.white, fontSize: 13, fontFamily: FONT, flex: 1, caretColor: C.accent }}
          />
          {searchQuery && <span onClick={() => setSearchQuery("")} style={{ fontSize: 11, color: C.textDim, cursor: "pointer", padding: "2px 8px", borderRadius: 6, background: C.dimBg }}>✕</span>}
        </div>
      </div>

      {/* Department filter — horizontal scroll */}
      <div id="tutorial-filters" className="no-scrollbar" style={{display:"flex",gap:7,overflowX:"auto",padding:"10px 16px 4px"}}>
        {deptFilters.map(({key,label,icon})=>{
          const isA=department===key;
          return <div key={key} onClick={()=>{setDepartment(key);if(key!=="all")checkDeptTutorial?.(key);}} style={{flexShrink:0,padding:"5px 14px",borderRadius:20,fontSize:12,fontFamily:FONT,cursor:"pointer",background:isA?"rgba(0,230,200,0.15)":C.btnBg,border:`1px solid ${isA?"rgba(0,230,200,0.3)":"rgba(0,230,200,0.1)"}`,color:isA?C.accent:C.textDim}}>{icon} {label}</div>;
        })}
      </div>

      {/* Spec chips — horizontal scroll */}
      <div className="no-scrollbar" style={{display:"flex",gap:7,overflowX:"auto",padding:"6px 16px 10px"}}>
        <div onClick={()=>setSpecFilter(null)} style={{flexShrink:0,padding:"5px 14px",borderRadius:20,fontSize:12,fontFamily:FONT,cursor:"pointer",background:!specFilter?"rgba(0,230,200,0.15)":C.btnBg,border:`1px solid ${!specFilter?"rgba(0,230,200,0.3)":"rgba(0,230,200,0.1)"}`,color:!specFilter?C.accent:C.textDim}}>{t("filter.all")}</div>
        {navSpec.map(({icon,label,cat})=>{
          const isA=specFilter===cat;
          return <div key={cat} onClick={()=>setSpecFilter(isA?null:cat)} style={{flexShrink:0,padding:"5px 14px",borderRadius:20,fontSize:12,fontFamily:FONT,cursor:"pointer",background:isA?"rgba(0,230,200,0.15)":C.btnBg,border:`1px solid ${isA?"rgba(0,230,200,0.3)":"rgba(0,230,200,0.1)"}`,color:isA?C.accent:C.textDim}}>{icon} {label}</div>;
        })}
      </div>

      {/* Hero — compact */}
      <div style={{margin:"0 16px 20px",borderRadius:18,overflow:"hidden",background:C.heroGrad,boxShadow:"0 8px 32px rgba(0,0,0,0.5)",position:"relative",padding:"22px 20px"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(0,230,200,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,230,200,0.03) 1px,transparent 1px)",backgroundSize:"24px 24px",pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <div style={{fontSize:9,color:C.heroLabel,letterSpacing:4,textTransform:"uppercase",marginBottom:8,fontFamily:FONT,fontWeight:600}}>{t("brand.tagline")}</div>
          <div key={theme} style={{fontSize:34,fontWeight:700,fontFamily:SER,fontStyle:"italic",lineHeight:1.1,background:C.heroTitleGrad,WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent",color:"transparent",marginBottom:8}}>{t("brand.name")}</div>
          <div style={{fontSize:12,color:C.heroText,fontFamily:FONT,marginBottom:16,lineHeight:1.5}}>{t("hero.desc1")}</div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <button className="start-btn" onClick={startGame} style={{background:C.accent,border:"none",borderRadius:10,padding:"10px 22px",fontSize:14,fontWeight:700,color:C.bg,cursor:"pointer",fontFamily:FONT,letterSpacing:0.3,boxShadow:`0 4px 16px rgba(0,230,200,0.3)`}}>{t("hero.start")}</button>
            {t("hero.tags").map(tag=><span key={tag} style={{background:C.heroTagBg,border:`1px solid ${C.heroTagBorder}`,borderRadius:20,padding:"4px 10px",fontSize:11,color:C.heroTagText,fontFamily:FONT}}>{tag}</span>)}
          </div>
        </div>
      </div>

      {/* Cases */}
      <div style={{padding:"0 16px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{fontSize:15,fontWeight:700,color:C.white,fontFamily:FONT}}>{specFilter?catMeta[specFilter]?.label:searchQuery?t("cases.searchResults"):t("cases.title")}</div>
          <div onClick={()=>setShowAllCases(v=>!v)} style={{fontSize:12,color:C.accent,fontFamily:FONT,cursor:"pointer",padding:"4px 11px",borderRadius:8,border:"1px solid rgba(0,230,200,0.2)",background:"rgba(0,230,200,0.06)"}}>
            {showAllCases?t("cases.collapse"):t("cases.showAll",{n:CASES.length})}
          </div>
        </div>
        {(()=>{
          const q=searchQuery.toLowerCase();
          const baseCases = IS_DEV_MODE ? CASES : getVisibleCases(CASES);
          const visible=baseCases.filter(c=>{
            if(department!=="all"&&c.department!==department)return false
            if(specFilter&&c.category!==specFilter)return false;
            if(!q)return true;
            return c.name.toLowerCase().includes(q)||c.complaint.toLowerCase().includes(q)||(catMeta[c.category]?.label||"").toLowerCase().includes(q);
          });
          if(visible.length===0)return <div style={{color:C.textDim,fontSize:14,fontFamily:FONT,padding:"20px 0"}}>{t("cases.empty")}</div>;
          return (
            <div style={{display:"flex",flexDirection:"column",gap:10,paddingBottom:110}}>
              {(specFilter||department!=="all"||searchQuery||showAllCases||isDevMode?visible:visible.slice(0,4)).map((c)=>{
                const cm=catMeta[c.category]||{icon:"🏥",label:c.category,color:C.accent};
                const sc={critical:C.red,moderate:C.yellow,mild:C.green}[c.severity]||C.yellow;
                const dots={critical:3,moderate:2,mild:1}[c.severity]||2;
                return (
                  <div key={c.id} className="case-card" onClick={()=>startGame(c.id)} style={{
                    background: `linear-gradient(135deg, ${C.panelBg} 0%, ${C.dimBg} 100%)`,
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: `1px solid ${C.border}`,
                    borderRadius: 16,
                    padding: "16px",
                    cursor: "pointer",
                    boxShadow: "0 8px 32px 0 rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)",
                    transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}>
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
                        <span style={{fontSize:11,color:C.textDim,fontFamily:FONT,cursor:"help"}} title={t("cases.timeLimitTooltip")}>⏱ {c.timeLimit} {t("cases.minutes")}</span>
                        <span style={{fontSize:11,color:sc,fontFamily:FONT,background:`${sc}15`,borderRadius:5,padding:"2px 7px"}}>{{critical:t("severity.critical"),moderate:t("severity.moderate"),mild:t("severity.mild")}[c.severity]}</span>
                        {caseScores[c.id] != null && (
                          <span style={{fontSize:11,color:C.green,fontFamily:FONT,fontWeight:600,background:`${C.green}15`,borderRadius:5,padding:"2px 7px"}}>✓ {caseScores[c.id]}</span>
                        )}
                      </div>
                      <button className="start-btn" onClick={e=>{e.stopPropagation();startGame(c.id);}} style={{background:C.accent,border:"none",borderRadius:9,padding:"7px 18px",fontSize:13,fontWeight:700,color:C.bg,cursor:"pointer",fontFamily:FONT,boxShadow:`0 3px 12px rgba(0,230,200,0.25)`}}>{t("cases.start")}</button>
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
          {[{v:casesPlayed,l:t("progress.cases"),c:C.accent},{v:casesPlayed?Math.round(totalScore/casesPlayed):0,l:t("progress.avgScore"),c:C.green},{v:totalScore,l:t("progress.totalPoints"),c:C.yellow}].map(({v,l,c})=>(
            <div key={l} style={{flex:1,background:C.btnBg,borderRadius:10,padding:"7px 8px",textAlign:"center"}}>
              <div style={{fontSize:17,fontWeight:700,color:c,fontFamily:CODE,lineHeight:1}}>{v}</div>
              <div style={{fontSize:10,color:C.textDim,fontFamily:FONT,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
        <button className="start-btn" onClick={startGame} style={{background:`linear-gradient(135deg,${C.accent},${C.green})`,border:"none",borderRadius:12,padding:"14px",fontSize:15,fontWeight:700,color:C.bg,cursor:"pointer",fontFamily:FONT,letterSpacing:0.5,width:"100%",boxShadow:`0 6px 24px rgba(0,230,200,0.3)`}}>
          {t("cta.newPatient")}
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
        borderRight:"1px solid rgba(0,230,200,0.08)",display:"flex",flexDirection:"column",padding:"22px 12px",overflowY:"auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:11,padding:"6px 10px",marginBottom:30}}>
          <div style={{width:38,height:38,borderRadius:11,flexShrink:0,
            background:"linear-gradient(135deg,rgba(0,230,200,0.2),rgba(0,150,200,0.1))",
            border:"1px solid rgba(0,230,200,0.3)",display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 0 20px rgba(0,230,200,0.15)"}}>
            <span style={{fontFamily:SER,fontSize:19,color:C.accent,fontStyle:"italic",fontWeight:700}}>М</span>
          </div>
          <div>
            <div style={{fontSize:17,fontWeight:700,color:C.white,fontFamily:FONT,letterSpacing:-0.3,lineHeight:1}}>{t("brand.name")}</div>
            <div style={{fontSize:10,color:C.accent,fontFamily:FONT,letterSpacing:1,marginTop:2,opacity:0.7}}>{t("brand.subtitle")}</div>
          </div>
        </div>

        <div style={{fontSize:10,color:C.textDim,letterSpacing:1.5,padding:"0 10px",marginBottom:6,fontFamily:FONT,fontWeight:600}}>{t("nav.menu")}</div>
        <div className="nav-item" style={{display:"flex",alignItems:"center",gap:11,padding:"10px 12px",
          borderRadius:11,marginBottom:2,cursor:"default",background:"rgba(0,230,200,0.12)",
          border:"1px solid rgba(0,230,200,0.2)",transition:"all 0.15s"}}>
          <span style={{fontSize:15,width:20,textAlign:"center"}}>▦</span>
          <span style={{fontSize:13,color:C.accent,fontWeight:600,fontFamily:FONT}}>{t("nav.mainMenu")}</span>
          <div style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:C.accent,boxShadow:`0 0 8px ${C.accent}`}}/>
        </div>
        <div onClick={()=>setPhase("theory")} className="nav-item" style={{display:"flex",alignItems:"center",gap:11,padding:"10px 12px",
          borderRadius:11,marginBottom:2,cursor:"pointer",transition:"all 0.15s",
          background:C.btnBg,border:"1px solid transparent"}}>
          <span style={{fontSize:15,width:20,textAlign:"center"}}>📚</span>
          <span style={{fontSize:13,color:C.text,fontWeight:500,fontFamily:FONT}}>{t("nav.theory")}</span>
        </div>
        <div id="tutorial-curriculum" onClick={()=>{setProgressionMode("strict");setPhase("theory");}} className="nav-item" style={{display:"flex",alignItems:"center",gap:11,padding:"10px 12px",
          borderRadius:11,marginBottom:2,cursor:"pointer",transition:"all 0.15s",
          background:progressionMode==="strict"?`${C.accent}12`:C.btnBg,border:`1px solid ${progressionMode==="strict"?`${C.accent}30`:"transparent"}`}}>
          <span style={{fontSize:15,width:20,textAlign:"center"}}>🎯</span>
          <span style={{fontSize:13,color:progressionMode==="strict"?C.accent:C.text,fontWeight:500,fontFamily:FONT}}>{t("nav.course")}</span>
        </div>
        <div onClick={()=>setPhase("map")} className="nav-item" style={{display:"flex",alignItems:"center",gap:11,padding:"10px 12px",
          borderRadius:11,marginBottom:2,cursor:"pointer",transition:"all 0.15s",
          background:C.btnBg,border:"1px solid transparent"}}>
          <span style={{fontSize:15,width:20,textAlign:"center"}}>🗺️</span>
          <span style={{fontSize:13,color:C.text,fontWeight:500,fontFamily:FONT}}>{t("nav.map")}</span>
        </div>
        <div onClick={()=>setPhase("leaderboard")} className="nav-item" style={{display:"flex",alignItems:"center",gap:11,padding:"10px 12px",
          borderRadius:11,marginBottom:2,cursor:"pointer",transition:"all 0.15s",
          background:C.btnBg,border:"1px solid transparent"}}>
          <span style={{fontSize:15,width:20,textAlign:"center"}}>🏆</span>
          <span style={{fontSize:13,color:C.text,fontWeight:500,fontFamily:FONT}}>{t("nav.leaderboard")}</span>
        </div>
        <div onClick={()=>setPhase("certificates")} className="nav-item" style={{display:"flex",alignItems:"center",gap:11,padding:"10px 12px",
          borderRadius:11,marginBottom:2,cursor:"pointer",transition:"all 0.15s",
          background:C.btnBg,border:"1px solid transparent"}}>
          <span style={{fontSize:15,width:20,textAlign:"center"}}>🎓</span>
          <span style={{fontSize:13,color:C.text,fontWeight:500,fontFamily:FONT}}>{t("nav.certificates")}</span>
        </div>
        <div onClick={()=>setPhase("teacher_dashboard")} className="nav-item" style={{display:"flex",alignItems:"center",gap:11,padding:"10px 12px",
          borderRadius:11,marginBottom:2,cursor:"pointer",transition:"all 0.15s",
          background:C.btnBg,border:"1px solid transparent"}}>
          <span style={{fontSize:15,width:20,textAlign:"center"}}>📊</span>
          <span style={{fontSize:13,color:C.text,fontWeight:500,fontFamily:FONT}}>Кабинет преподавателя</span>
        </div>
        <div id="tutorial-training" onClick={()=>setShowTutorialMenu(v=>!v)} style={{position:"relative",display:"flex",alignItems:"center",gap:11,padding:"10px 12px",
          borderRadius:11,marginBottom:12,cursor:"pointer",transition:"all 0.15s",
          background:showTutorialMenu?`${C.yellow}12`:C.btnBg,border:`1px solid ${showTutorialMenu?`${C.yellow}30`:"transparent"}`}}>
          <span style={{fontSize:15,width:20,textAlign:"center"}}>📖</span>
          <span style={{fontSize:13,color:showTutorialMenu?C.yellow:C.text,fontWeight:500,fontFamily:FONT}}>{t("nav.tutorial")}</span>
          {showTutorialMenu && <>
            <div ref={tutorialMenuRef} onClick={e => e.stopPropagation()} style={{position:"absolute",left:"100%",top:0,marginLeft:4,zIndex:99999,background:C.overlayBg,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",border:`1px solid ${C.border}`,borderRadius:12,padding:"6px",boxShadow:"0 8px 32px rgba(0,0,0,0.6)",minWidth:200}}>
              <div style={{fontSize:10,color:C.textDim,letterSpacing:1,padding:"6px 12px 4px",fontFamily:FONT,fontWeight:600}}>ОСНОВНОЙ КУРС</div>
              <div onClick={()=>{setShowTutorialMenu(false);restartTutorial?.();}} style={{padding:"8px 14px",borderRadius:8,cursor:"pointer",fontSize:12,color:C.text,fontFamily:FONT,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14}}>🔄</span> Пройти заново
              </div>
              <div onClick={()=>{setShowTutorialMenu(false);showTutorialTips?.();}} style={{padding:"8px 14px",borderRadius:8,cursor:"pointer",fontSize:12,color:C.text,fontFamily:FONT,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14}}>💡</span> Показать подсказки
              </div>
              <div style={{height:1,background:C.border,margin:"6px 8px"}}/>
              <div style={{fontSize:10,color:C.textDim,letterSpacing:1,padding:"6px 12px 4px",fontFamily:FONT,fontWeight:600}}>МИНИ-ТУТОРИАЛЫ</div>
              {[{key:"outpatient",icon:"🏥",label:"Поликлиника"},{key:"admission",icon:"🩺",label:"Приёмное"},{key:"stationary",icon:"🏨",label:"Стационар"}].map(({key,icon,label}) => (
                <div key={key} onClick={()=>{setShowTutorialMenu(false);forceShowDeptTutorial?.(key);}} style={{padding:"8px 14px",borderRadius:8,cursor:"pointer",fontSize:12,color:C.text,fontFamily:FONT,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:14}}>{icon}</span> {label}
                </div>
              ))}
            </div>
          </>}
        </div>

        <div style={{fontSize:10,color:C.textDim,letterSpacing:1.5,padding:"0 10px",margin:"18px 0 6px",fontFamily:FONT,fontWeight:600}}>{t("department.all").split(" ")[0]==="Все"?"ОТДЕЛЕНИЕ":"DEPARTMENT"}</div>
        <div style={{display:"flex",flexDirection:"column",gap:2,marginBottom:4}}>
          {deptFilters.map(({key,label,icon})=>{
            const isActive = department === key;
            return (
              <div key={key} onClick={()=>{setDepartment(key);if(key!=="all")checkDeptTutorial?.(key);}} className="nav-item" style={{
                display:"flex",alignItems:"center",gap:11,padding:"9px 12px 9px 18px",
                borderRadius:10,cursor:"pointer",transition:"all 0.15s",
                background:isActive?"rgba(0,230,200,0.1)":"transparent",
                border:`1px solid ${isActive?"rgba(0,230,200,0.2)":"transparent"}`}}>
                <span style={{fontSize:14,width:18,textAlign:"center",opacity:isActive?1:0.5}}>{icon}</span>
                <span style={{fontSize:12,fontFamily:FONT,color:isActive?C.accent:C.text,
                  fontWeight:isActive?600:400,opacity:isActive?1:0.7}}>{label}</span>
                {isActive && <div style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:C.accent,boxShadow:`0 0 6px ${C.accent}`}}/>}
              </div>
            );
          })}
        </div>

        <div style={{fontSize:10,color:C.textDim,letterSpacing:1.5,padding:"0 10px",margin:"18px 0 6px",fontFamily:FONT,fontWeight:600}}>{t("nav.specializations")}</div>
        {specFilter && (
          <div onClick={()=>setSpecFilter(null)} className="nav-item" style={{display:"flex",alignItems:"center",gap:8,
            padding:"7px 12px 7px 14px",borderRadius:10,marginBottom:4,cursor:"pointer",transition:"all 0.15s",
            background:"rgba(0,230,200,0.06)",border:"1px solid rgba(0,230,200,0.12)"}}>
            <span style={{fontSize:11,color:C.accent,fontFamily:FONT}}>{t("nav.clearFilter")}</span>
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
        <div onClick={logout} className="nav-item" style={{display:"flex",alignItems:"center",gap:11,padding:"10px 12px",
          borderRadius:11,marginBottom:2,cursor:"pointer",transition:"all 0.15s",
          background:C.btnBg,border:"1px solid transparent"}}>
          <span style={{fontSize:15,width:20,textAlign:"center"}}>🚪</span>
          <span style={{fontSize:12,color:C.red,fontWeight:500,fontFamily:FONT,opacity:0.8}}>{t("nav.logout")}</span>
        </div>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.95, padding: "12px 0 0", borderTop: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 9, color: C.textDim, fontFamily: FONT, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700 }}>designed by</span>
          <ThreeDTicker width={176} height={110} />
        </div>
      </aside>

      {/* Main area */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,zIndex:1}}>

        {/* Top bar */}
        <header style={{height:66,flexShrink:0,padding:"0 28px",display:"flex",alignItems:"center",gap:16,
          background:C.headerBg2,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
          borderBottom:"1px solid rgba(0,230,200,0.06)",position:"relative"}}>
          <span style={{fontSize:13,color:C.textDim,fontFamily:FONT}}>{t("nav.mainMenu")}</span>
          <div style={{width:1,height:16,background:C.dimBg}}/>
          <div style={{
            flex: 1,
            maxWidth: 480,
            background: C.btnBg,
            border: `1px solid ${theorySearchFocused ? `${C.accent}55` : "rgba(0,230,200,0.1)"}`,
            boxShadow: theorySearchFocused ? `0 0 16px -2px ${C.accent}15, 0 4px 20px rgba(0,0,0,0.3)` : "none",
            borderRadius: 12,
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            <span style={{ color: C.textDim, fontSize: 14 }}>🔍</span>
            <input 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setTheorySearchFocused(true)}
              onBlur={() => setTheorySearchFocused(false)}
              placeholder={t("search.placeholder")}
              style={{ background: "transparent", border: "none", outline: "none", color: C.white, fontSize: 13, fontFamily: FONT, flex: 1, caretColor: C.accent }}
            />
            {searchQuery && <span onClick={() => setSearchQuery("")} style={{ color: C.textDim, fontSize: 13, cursor: "pointer" }}>✕</span>}
          </div>
          <div style={{flex:1}}/>
          <div onClick={openNotif} className="icon-btn" style={{position:"relative",width:38,height:38,
            background:showNotif?`${C.accent}1a`:C.btnBg,
            border:`1px solid ${showNotif?`${C.accent}55`:"rgba(0,230,200,0.08)"}`,
            borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <span style={{fontSize:16,display:"inline-flex",alignItems:"center",justifyContent:"center",width:16,height:16,lineHeight:1}}>🔔</span>
            {unreadCount>0 && <div style={{position:"absolute",top:6,right:6,width:7,height:7,background:C.red,borderRadius:"50%",border:"1px solid #070d18"}}/>}
          </div>
          <div onClick={()=>{setShowSettings(v=>!v);setShowNotif(false);}} className="icon-btn" style={{width:38,height:38,
            background:showSettings?`${C.accent}1a`:C.btnBg,
            border:`1px solid ${showSettings?`${C.accent}55`:"rgba(0,230,200,0.08)"}`,
            borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <span style={{fontSize:16,display:"inline-flex",alignItems:"center",justifyContent:"center",width:16,height:16,lineHeight:1}}>⚙️</span>
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
            <span style={{fontSize:13,fontWeight:700,color:C.white}}>{t("notifications.title")}</span>
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
            <span style={{fontSize:13,fontWeight:700,color:C.white}}>{t("settings.title")}</span>
                <span onClick={()=>setShowSettings(false)} style={{fontSize:12,color:C.textDim,cursor:"pointer",padding:"2px 8px",borderRadius:6,background:C.dimBg}}>✕</span>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{t("settings.difficulty")}</div>
                <div style={{display:"flex",gap:6}}>
                  {[{l:t("settings.easy"),v:"easy"},{l:t("settings.normal"),v:"normal"},{l:t("settings.hard"),v:"hard"}].map(({l,v})=>(
                    <button key={v} onClick={()=>setDifficulty(v)} style={{flex:1,background:difficulty===v?`${C.accent}18`:"transparent",
                      border:`1px solid ${difficulty===v?C.accent:"rgba(0,230,200,0.1)"}`,borderRadius:8,padding:"7px 4px",
                      fontSize:11,color:difficulty===v?C.accent:C.textDim,cursor:"pointer",fontFamily:FONT}}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{t("settings.gameMode")}</div>
                <div style={{display:"flex",gap:6}}>
                  {[{l:t("settings.modeNormal"),v:"normal",d:t("settings.modeNormalDesc")},{l:t("settings.modeRandom"),v:"random",d:t("settings.modeRandomDesc")},{l:t("settings.modeStress"),v:"stress",d:t("settings.modeStressDesc")}].map(({l,v,d})=>(
                    <button key={v} onClick={()=>setGameMode(v)} style={{flex:1,background:gameMode===v?`${C.accent}18`:"transparent",
                      border:`1px solid ${gameMode===v?C.accent:"rgba(0,230,200,0.1)"}`,borderRadius:8,padding:"7px 4px",
                      textAlign:"center",cursor:"pointer",fontFamily:FONT}}>
                      <div style={{fontSize:11,color:gameMode===v?C.accent:C.textDim,marginBottom:2}}>{l}</div>
                      <div style={{fontSize:9,color:C.textDim,opacity:0.7}}>{d}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{t("settings.learningMode")}</div>
                <div style={{display:"flex",gap:6}}>
                  {[{l:t("settings.learningOn"),v:true},{l:t("settings.learningOff"),v:false}].map(({l,v})=>(
                    <button key={String(v)} onClick={()=>setLearningMode(v)} style={{flex:1,background:learningMode===v?`${C.accent}18`:"transparent",
                      border:`1px solid ${learningMode===v?C.accent:"rgba(0,230,200,0.1)"}`,borderRadius:8,padding:"7px 4px",
                      fontSize:11,color:learningMode===v?C.accent:C.textDim,cursor:"pointer",fontFamily:FONT}}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{t("settings.audio")}</div>
                <div style={{display:"flex",gap:6}}>
                  {[{l:t("settings.learningOn"),v:true},{l:t("settings.learningOff"),v:false}].map(({l,v})=>(
                    <button key={String(v)} onClick={()=>setAudioEnabled(v)} style={{flex:1,background:audioEnabled===v?`${C.accent}18`:"transparent",
                      border:`1px solid ${audioEnabled===v?C.accent:"rgba(0,230,200,0.1)"}`,borderRadius:8,padding:"7px 4px",
                      fontSize:11,color:audioEnabled===v?C.accent:C.textDim,cursor:"pointer",fontFamily:FONT}}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{t("settings.hideWarnings") || "Подсказки по ЛС"}</div>
                <div style={{display:"flex",gap:6}}>
                  {[{l: t("settings.warningsShow") || "Показывать",v:false},{l: t("settings.warningsHide") || "Скрывать",v:true}].map(({l,v})=>(
                    <button key={String(v)} onClick={()=>setHideWarnings(v)} style={{flex:1,background:hideWarnings===v?`${C.accent}18`:"transparent",
                      border:`1px solid ${hideWarnings===v?C.accent:"rgba(0,230,200,0.1)"}`,borderRadius:8,padding:"7px 4px",
                      fontSize:11,color:hideWarnings===v?C.accent:C.textDim,cursor:"pointer",fontFamily:FONT}}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{t("settings.theme")}</div>
                <div style={{display:"flex",gap:6}}>
                  {[{l:t("settings.dark"),v:"dark"},{l:t("settings.light"),v:"light"}].map(({l,v})=>(
                    <button key={v} onClick={()=>setTheme(v)} style={{flex:1,background:theme===v?`${C.accent}18`:"transparent",
                      border:`1px solid ${theme===v?C.accent:"rgba(0,230,200,0.1)"}`,borderRadius:8,padding:"7px 4px",
                      fontSize:11,color:theme===v?C.accent:C.textDim,cursor:"pointer",fontFamily:FONT}}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:C.textDim,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{t("settings.langLabel")}</div>
                <div style={{display:"flex",gap:6}}>
                  {Object.entries(LOCALES).map(([v,l])=>(
                    <button key={v} onClick={()=>setLocaleGlobal(v)} style={{flex:1,background:locale===v?`${C.accent}18`:"transparent",
                      border:`1px solid ${locale===v?C.accent:"rgba(0,230,200,0.1)"}`,borderRadius:8,padding:"7px 4px",
                      fontSize:11,color:locale===v?C.accent:C.textDim,cursor:"pointer",fontFamily:FONT}}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 14, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div 
                  onClick={() => setShowDevSettings(prev => !prev)} 
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "4px 0" }}
                >
                  <div style={{ fontSize: 11, color: C.textDim, textTransform: "uppercase", letterSpacing: 1 }}>
                    🛠️ Для разработчиков (Свой ключ)
                  </div>
                  <span style={{ fontSize: 10, color: C.textDim }}>{showDevSettings ? "▲" : "▼"}</span>
                </div>
                {showDevSettings && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                      {[{ l: "Gemini", v: "gemini" }, { l: "OpenAI", v: "openai" }, { l: "OpenRouter", v: "openrouter" }].map(({ l, v }) => (
                        <button key={v} onClick={() => { setLlmProvider(v); localStorage.setItem("ms_llm_provider", v); }} style={{
                          flex: 1, background: llmProvider === v ? `${C.accent}18` : "transparent",
                          border: `1px solid ${llmProvider === v ? C.accent : "rgba(0,230,200,0.1)"}`, borderRadius: 8, padding: "7px 4px",
                          fontSize: 11, color: llmProvider === v ? C.accent : C.textDim, cursor: "pointer", fontFamily: FONT
                        }}>{l}</button>
                      ))}
                    </div>
                    <div style={{ background: C.inputBg || "rgba(7,13,24,0.6)", border: "1px solid rgba(0,230,200,0.15)", borderRadius: 8, padding: "5px 10px", display: "flex", alignItems: "center", marginBottom: llmProvider === "openrouter" ? 6 : 0 }}>
                      <input 
                        type="password" 
                        value={llmKey} 
                        onChange={e => { setLlmKey(e.target.value); localStorage.setItem("ms_llm_key", e.target.value); }} 
                        placeholder="Свой API-ключ (необязательно)..." 
                        style={{ background: "transparent", border: "none", outline: "none", color: C.white, fontSize: 11, fontFamily: FONT, flex: 1 }}
                      />
                      {llmKey && <span onClick={() => { setLlmKey(""); localStorage.setItem("ms_llm_key", ""); }} style={{ color: C.textDim, fontSize: 11, cursor: "pointer", marginLeft: 5 }}>✕</span>}
                    </div>
                    {llmProvider === "openrouter" && (
                      <div style={{ fontSize: 9, color: C.textDim, lineHeight: 1.3, marginTop: 4 }}>
                        Для бесплатной игры без VPN зарегистрируйтесь на <a href="https://openrouter.ai" target="_blank" rel="noreferrer" style={{ color: C.accent, textDecoration: "underline" }}>openrouter.ai</a>, создайте бесплатный ключ (API Key) в разделе Keys и вставьте его сюда.
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{marginBottom:14}}>
                <div onClick={()=>setLearningMode(v=>!v)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",background:learningMode?`${C.yellow}12`:"transparent",border:`1px solid ${learningMode?`${C.yellow}44`:"rgba(0,230,200,0.1)"}`,borderRadius:8,cursor:"pointer"}}>
                  <div>
                    <div style={{fontSize:12,color:learningMode?C.yellow:C.text,fontWeight:600,fontFamily:FONT}}>📚 {t("settings.learningMode")}</div>
                    <div style={{fontSize:10,color:C.textDim,fontFamily:FONT,marginTop:2}}>{t("settings.learningModeDesc")}</div>
                  </div>
                  <div style={{width:36,height:20,borderRadius:10,background:learningMode?C.yellow:`${C.textDim}30`,position:"relative",transition:"background 0.2s",flexShrink:0}}>
                    <div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:learningMode?18:2,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}/>
                  </div>
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <div onClick={()=>setAssessmentMode(v=>!v)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",background:assessmentMode?`${C.green}12`:"transparent",border:`1px solid ${assessmentMode?`${C.green}44`:"rgba(0,230,200,0.1)"}`,borderRadius:8,cursor:"pointer"}}>
                  <div>
                    <div style={{fontSize:12,color:assessmentMode?C.green:C.text,fontWeight:600,fontFamily:FONT}}>✅ {t("settings.assessmentMode")}</div>
                    <div style={{fontSize:10,color:C.textDim,fontFamily:FONT,marginTop:2}}>{t("settings.assessmentModeDesc")}</div>
                  </div>
                  <div style={{width:36,height:20,borderRadius:10,background:assessmentMode?C.green:`${C.textDim}30`,position:"relative",transition:"background 0.2s",flexShrink:0}}>
                    <div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:assessmentMode?18:2,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}/>
                  </div>
                </div>
              </div>
              <div style={{paddingTop:12,borderTop:"1px solid rgba(0,230,200,0.06)",fontSize:11,color:C.textDim,textAlign:"center",opacity:0.7}}>
                {t("settings.moreComing")}
              </div>
            </div>
          </>,
          document.body
        )}

        {/* Content */}
        <div style={{flex:1,display:"flex",overflow:"hidden"}}>
          {/* Center */}
          <div style={{flex:1,overflowY:"auto",padding:"26px 24px 40px"}}>
            {/* Quick Specialization Filters */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              <div 
                onClick={() => setSpecFilter(null)} 
                style={{
                  padding: "6px 14px", borderRadius: 20, fontSize: 12, fontFamily: FONT, cursor: "pointer", transition: "all 0.15s",
                  background: !specFilter ? `${C.accent}18` : C.btnBg,
                  border: `1px solid ${!specFilter ? C.accent : "rgba(0,230,200,0.08)"}`,
                  color: !specFilter ? C.accent : C.textDim
                }}
              >
                {t("filter.all")}
              </div>
              {navSpec.map(({ icon, label, cat }) => {
                const isActive = specFilter === cat;
                return (
                  <div 
                    key={cat} 
                    onClick={() => setSpecFilter(isActive ? null : cat)} 
                    style={{
                      padding: "6px 14px", borderRadius: 20, fontSize: 12, fontFamily: FONT, cursor: "pointer", transition: "all 0.15s",
                      background: isActive ? `${C.accent}18` : C.btnBg,
                      border: `1px solid ${isActive ? C.accent : "rgba(0,230,200,0.08)"}`,
                      color: isActive ? C.accent : C.textDim
                    }}
                  >
                    {icon} {label}
                  </div>
                );
              })}
            </div>

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
              <div style={{position:"relative",minHeight:220,borderRadius:22,overflow:"hidden",
                background:C.heroGrad, display:"flex", alignItems:"center",
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
              <div style={{position:"relative",display:"flex",flexDirection:"column",justifyContent:"center",padding:"24px 38px",maxWidth:"62%",zIndex:1}}>
                <div style={{fontSize:10,color:C.heroLabel,letterSpacing:5,textTransform:"uppercase",marginBottom:10,fontFamily:FONT,fontWeight:600}}>{t("brand.tagline")}</div>
                <div key={theme} style={{fontSize:42,fontWeight:700,fontFamily:"Georgia,serif",fontStyle:"italic",lineHeight:1.1,
                  background:C.heroTitleGrad,
                  WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent",color:"transparent",marginBottom:12}}>{t("brand.name")}</div>
                <div style={{fontSize:13,color:C.heroText,fontFamily:FONT,marginBottom:20,lineHeight:1.6}}>
                  {t("hero.desc1")}<br/>{t("hero.desc2")}
                </div>
                <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                  <button className="start-btn" onClick={startGame} style={{background:C.accent,border:"none",borderRadius:10,
                    padding:"11px 26px",fontSize:14,fontWeight:700,color:C.bg,cursor:"pointer",fontFamily:FONT,
                    letterSpacing:0.3,transition:"all 0.2s",boxShadow:`0 4px 16px rgba(0,230,200,0.3)`}}>{t("hero.start")}</button>
                  <button onClick={()=>{setProgressionMode("strict");setPhase("theory");}} style={{background:"transparent",border:`1.5px solid ${C.accent}`,borderRadius:10,
                    padding:"9px 24px",fontSize:14,fontWeight:700,color:C.accent,cursor:"pointer",fontFamily:FONT,
                    letterSpacing:0.3,transition:"all 0.2s"}}>{t("nav.course")}</button>
                  <div style={{display:"flex",gap:8}}>
                    {t("hero.tags").map(tag=>(
                      <span key={tag} style={{background:C.heroTagBg,border:`1px solid ${C.heroTagBorder}`,
                        borderRadius:20,padding:"4px 11px",fontSize:11,color:C.heroTagText,fontFamily:FONT}}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Cases header */}
            <div id="tutorial-cases" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div style={{fontSize:17,fontWeight:700,color:C.white,fontFamily:FONT,letterSpacing:-0.3}}>
                {specFilter?`${catMeta[specFilter]?.label||specFilter}`:searchQuery?t("cases.searchResults"):t("cases.title")}
              </div>
              <div style={{display:"flex",gap:6}}>
                {specFilter && (
                  <div onClick={()=>setSpecFilter(null)} style={{fontSize:12,color:C.accent,fontFamily:FONT,cursor:"pointer",
                    padding:"5px 13px",borderRadius:8,border:"1px solid rgba(0,230,200,0.25)",background:"rgba(0,230,200,0.1)"}}>{t("cases.clear")}</div>
                )}
                <div onClick={()=>setShowAllCases(v=>!v)} style={{fontSize:12,color:showAllCases?C.white:C.accent,fontFamily:FONT,cursor:"pointer",
                  padding:"5px 13px",borderRadius:8,
                  border:`1px solid ${showAllCases?"rgba(0,230,200,0.35)":"rgba(0,230,200,0.2)"}`,
                  background:showAllCases?"rgba(0,230,200,0.15)":"rgba(0,230,200,0.06)",fontWeight:showAllCases?600:400}}>
                  {showAllCases?t("cases.collapse"):t("cases.showAll",{n:CASES.length})}
                </div>
              </div>
            </div>

            {/* Cases grid */}
            {(()=>{
              const q = searchQuery.toLowerCase();
              const baseCases = IS_DEV_MODE ? CASES : getVisibleCases(CASES);
              const visible = baseCases.filter(c=>{
                if (department!=="all"&&c.department!==department)return false
                if (specFilter && c.category !== specFilter) return false;
                if (!q) return true;
                return c.name.toLowerCase().includes(q)||c.complaint.toLowerCase().includes(q)||(catMeta[c.category]?.label||"").toLowerCase().includes(q);
              });
              if (visible.length === 0) return (
                <div style={{color:C.textDim,fontSize:14,fontFamily:FONT,padding:"20px 0"}}>
                  {t("cases.empty")}{searchQuery?t("cases.emptySearch"):t("cases.emptyFilter")}
                </div>
              );
              return (
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  {(specFilter||department!=="all"||searchQuery||showAllCases||isDevMode?visible:visible.slice(0,4)).map((c,i)=>{
                    const cm = catMeta[c.category]||{icon:"🏥",label:c.category,color:C.accent};
                    const sc = {critical:C.red,moderate:C.yellow,mild:C.green}[c.severity]||C.yellow;
                    const dots = {critical:3,moderate:2,mild:1}[c.severity]||2;
                    return (
                      <div key={c.id} className="case-card" onClick={()=>startGame(c.id)} style={{
                        background: `linear-gradient(135deg, ${C.panelBg} 0%, ${C.dimBg} 100%)`,
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: `1px solid ${C.border}`,
                        borderRadius: 16,
                        padding: "16px",
                        display:"flex",flexDirection:"column",gap:14,cursor:"pointer",
                        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)",
                        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                        animation:`fadeUp ${0.35+i*0.08}s ease`}}>
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
                             <span style={{fontSize:11,color:C.textDim,fontFamily:FONT,cursor:"help"}} title={t("cases.timeLimitTooltip")}>⏱ {c.timeLimit} {t("cases.minutes")}</span>
                            <span style={{fontSize:11,color:sc,fontFamily:FONT,background:`${sc}15`,borderRadius:5,padding:"2px 7px"}}>
                              {{critical:t("severity.critical"),moderate:t("severity.moderate"),mild:t("severity.mild")}[c.severity]}
                            </span>
                            {caseScores[c.id] != null && (
                              <span style={{fontSize:11,color:C.green,fontFamily:FONT,fontWeight:600,background:`${C.green}15`,borderRadius:5,padding:"2px 7px"}}>✓ {caseScores[c.id]}</span>
                            )}
                          </div>
                          <button className="start-btn" onClick={e=>{e.stopPropagation();startGame(c.id);}} style={{
                            background:C.accent,border:"none",borderRadius:9,padding:"8px 20px",fontSize:13,fontWeight:700,
                            color:C.bg,cursor:"pointer",fontFamily:FONT,transition:"all 0.2s",boxShadow:`0 3px 12px rgba(0,230,200,0.25)`}}>{t("cases.start")}</button>
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
                <span style={{fontSize:11,color:C.textDim,textTransform:"uppercase",letterSpacing:1.2,fontFamily:FONT,fontWeight:600}}>{t("progress.title")}</span>
                <span style={{fontSize:11,color:C.accent,fontFamily:FONT,background:"rgba(0,230,200,0.1)",borderRadius:5,padding:"2px 8px"}}>{t("progress.streak")}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                {[
                  {value:casesPlayed,max:CASES.length,label:t("progress.cases"),color:C.accent},
                  {value:casesPlayed?Math.round(totalScore/casesPlayed):0,max:100,label:t("progress.avgScore"),color:C.green},
                ].map(({value,max,label,color})=>{
                  const pct = max>0?Math.min(value/max,1):0;
                  const r=30,circ=2*Math.PI*r;
                  return (
                    <div key={label} style={{textAlign:"center",background:C.btnBg,
                      border:`1px solid ${C.btnBorder}`,borderRadius:14,padding:"14px 8px"}}>
                      <div style={{position:"relative",width:72,height:72,margin:"0 auto 10px"}}>
                        <svg width="72" height="72" style={{transform:"rotate(-90deg)",display:"block"}}>
                          <circle cx="36" cy="36" r={r} fill="none" stroke={theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,40,80,0.12)"} strokeWidth="4.5"/>
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
                  <div style={{fontSize:11,color:C.textDim,fontFamily:FONT,marginTop:3}}>{t("progress.totalPoints")}</div>
                </div>
              </div>
            </div>
            <button className="start-btn" onClick={startGame} style={{background:`linear-gradient(135deg,${C.accent},${C.green})`,
              border:"none",borderRadius:14,padding:"16px",fontSize:15,fontWeight:700,color:C.bg,cursor:"pointer",
              fontFamily:FONT,letterSpacing:0.5,width:"100%",boxShadow:`0 6px 24px rgba(0,230,200,0.3)`,transition:"all 0.2s"}}>
              {t("cta.newPatient")}
            </button>
            {/* Recent sessions */}
            <div style={{background:C.panelBg,backdropFilter:"blur(16px)",
              border:"1px solid rgba(0,230,200,0.08)",borderRadius:18,padding:"18px 16px",boxShadow:"0 4px 24px rgba(0,0,0,0.3)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <span style={{fontSize:13,fontWeight:600,color:C.white,fontFamily:FONT}}>{t("sessions.recent")}</span>
                <span onClick={()=>setShowAllCases(true)} style={{fontSize:11,color:C.accent,fontFamily:FONT,background:"rgba(0,230,200,0.08)",borderRadius:5,padding:"2px 8px",cursor:"pointer"}}>{t("sessions.allCases")}</span>
              </div>
              {sessionHistory.length === 0 ? (
                <div style={{color:C.textDim,fontSize:12,fontFamily:FONT,textAlign:"center",padding:"10px 0",lineHeight:1.6}}>
                  {t("sessions.empty")}
                </div>
              ) : sessionHistory.slice(0,5).map(s=>{
                const cm = catMeta[s.category]||{icon:"🏥",color:C.accent};
                const gradeColor = {excellent:C.green,good:C.accent,satisfactory:C.yellow,unsatisfactory:C.red}[s.gradeId]||C.accent;
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
                      <div style={{fontSize:11,color:C.textDim,fontFamily:FONT,marginTop:2}}>{dateStr} · <span style={{color:gradeColor}}>{s.score} {t("scores.points")}</span></div>
                    </div>
                    <button onClick={()=>startGame(s.caseId)} style={{background:"transparent",border:"1px solid rgba(0,230,200,0.25)",
                      borderRadius:8,padding:"4px 12px",fontSize:12,color:C.accent,cursor:"pointer",fontFamily:FONT,flexShrink:0}}>{t("actions.retry")}</button>
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
